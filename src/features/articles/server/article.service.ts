import "server-only";
import type { UserRole } from "@prisma/client";
import { authorRepository } from "@/features/authors/server/author.repository";
import type { SessionUser } from "@/features/auth/server/session";
import { categoryRepository } from "@/features/categories/server/category.repository";
import { badRequest, conflict, forbidden, notFound } from "@/server/http/errors";
import { buildPaginationMeta, toSkipTake } from "@/server/http/pagination";
import { toArticleApiDto, toArticleDetail, toArticleSummary } from "../article.mapper";
import type {
  ArticlesListQuery,
  CreateArticleInput,
  SearchQuery,
  UpdateArticleInput,
} from "../article.schemas";
import type { ArticleDetail, ArticleSummary } from "../article.types";
import { ARTICLE_PAGE_SIZE } from "../lib/constants";
import type { ParsedArticlesQuery } from "../lib/search-params";
import {
  assertCanDeleteArticles,
  assertCanEditArticle,
  assertCanManageArticles,
  assertMutationAllowed,
  canViewDrafts,
} from "./article.policy";
import { articleRepository, type ArticleFilters } from "./article.repository";

function toDate(value: string | null | undefined): Date | null | undefined {
  if (value === undefined) return undefined;
  return value ? new Date(value) : null;
}

async function ownAuthorProfileId(user: SessionUser): Promise<string | null> {
  return user.role === "AUTHOR" ? authorRepository.findIdByUserId(user.id) : null;
}

async function assertReferencesExist(input: { categoryId?: string; authorId?: string }) {
  const [categoryOk, authorOk] = await Promise.all([
    input.categoryId ? categoryRepository.exists(input.categoryId) : true,
    input.authorId ? authorRepository.exists(input.authorId) : true,
  ]);
  if (!categoryOk) throw badRequest("Invalid categoryId");
  if (!authorOk) throw badRequest("Invalid authorId");
}

// ─── API operations ─────────────────────────────────────────────────────────

export async function listArticles(query: ArticlesListQuery, viewerRole?: UserRole) {
  const includeDrafts = canViewDrafts(viewerRole);
  if (query.status && !includeDrafts) {
    throw forbidden("Status filter requires authentication");
  }

  const filters: ArticleFilters = {
    search: query.search,
    categorySlug: query.category,
    status: query.status ?? (includeDrafts ? undefined : "PUBLISHED"),
  };

  const [items, total] = await Promise.all([
    articleRepository.findMany({ filters, sort: query.sort, ...toSkipTake(query) }),
    articleRepository.count(filters),
  ]);

  return { items, pagination: buildPaginationMeta(query, total) };
}

export async function searchArticles(query: SearchQuery) {
  return listArticles({ ...query, search: query.q, sort: "latest" });
}

/** Accepts a slug or id. Drafts are visible to staff only. */
export async function getArticle(identifier: string, viewerRole?: UserRole) {
  const article =
    (await articleRepository.findBySlug(identifier)) ??
    (await articleRepository.findById(identifier));

  if (!article || (article.status !== "PUBLISHED" && !canViewDrafts(viewerRole))) {
    throw notFound("Article not found");
  }
  return toArticleApiDto(article);
}

export async function createArticle(input: CreateArticleInput, user: SessionUser) {
  assertCanManageArticles(user.role);

  await assertReferencesExist(input);
  if (!(await articleRepository.isSlugAvailable(input.slug))) {
    throw conflict("Article slug already exists");
  }

  assertMutationAllowed(user.role, input, await ownAuthorProfileId(user));

  const article = await articleRepository.create({
    ...input,
    publishedAt: toDate(input.publishedAt),
  });
  return toArticleApiDto(article);
}

export async function updateArticle(id: string, input: UpdateArticleInput, user: SessionUser) {
  assertCanManageArticles(user.role);

  const existing = await articleRepository.findOwnership(id);
  if (!existing) throw notFound("Article not found");

  if (input.slug && !(await articleRepository.isSlugAvailable(input.slug, id))) {
    throw conflict("Article slug already exists");
  }
  await assertReferencesExist(input);

  const ownProfileId = await ownAuthorProfileId(user);
  assertCanEditArticle(user.role, existing.authorId, ownProfileId);
  assertMutationAllowed(user.role, input, ownProfileId);

  const article = await articleRepository.update(id, {
    ...input,
    publishedAt: toDate(input.publishedAt),
  });
  return toArticleApiDto(article);
}

export async function deleteArticle(id: string, user: SessionUser) {
  assertCanDeleteArticles(user.role);
  await articleRepository.delete(id);
}

export async function saveArticle(articleId: string, user: SessionUser) {
  if (!(await articleRepository.findPublishedId(articleId))) {
    throw notFound("Article not found");
  }
  await articleRepository.save(user.id, articleId);
}

export async function unsaveArticle(articleId: string, user: SessionUser) {
  await articleRepository.unsave(user.id, articleId);
}

// ─── Public page queries (published content only) ───────────────────────────

export type ArticlesPageResult = {
  items: ArticleSummary[];
  featured: ArticleSummary[];
  total: number;
  totalPages: number;
  page: number;
  pageSize: number;
};

export async function getArticlesPage(query: ParsedArticlesQuery): Promise<ArticlesPageResult> {
  const filters: ArticleFilters = {
    status: "PUBLISHED",
    search: query.search || undefined,
    categorySlug: query.category || undefined,
  };
  const showFeatured = query.page === 1 && !query.search && !query.category;

  const featuredRows = showFeatured
    ? await articleRepository.findMany({ filters, sort: query.sort, take: 2 })
    : [];
  const gridFilters: ArticleFilters = {
    ...filters,
    excludeIds: featuredRows.map((row) => row.id),
  };

  const total = await articleRepository.count(gridFilters);
  const totalPages = Math.max(1, Math.ceil(total / ARTICLE_PAGE_SIZE));
  const page = Math.min(query.page, totalPages);
  const rows = await articleRepository.findMany({
    filters: gridFilters,
    sort: query.sort,
    skip: (page - 1) * ARTICLE_PAGE_SIZE,
    take: ARTICLE_PAGE_SIZE,
  });

  return {
    items: rows.map(toArticleSummary),
    featured: featuredRows.map(toArticleSummary),
    total,
    totalPages,
    page,
    pageSize: ARTICLE_PAGE_SIZE,
  };
}

export async function getLatestArticles(limit = 3): Promise<ArticleSummary[]> {
  const rows = await articleRepository.findMany({ filters: { status: "PUBLISHED" }, take: limit });
  return rows.map(toArticleSummary);
}

export function countPublishedArticles(): Promise<number> {
  return articleRepository.count({ status: "PUBLISHED" });
}

export async function getPublishedArticle(slug: string): Promise<ArticleDetail | null> {
  const article = await articleRepository.findBySlug(slug);
  if (!article || article.status !== "PUBLISHED") return null;
  return toArticleDetail(article);
}

export function getPublishedArticleSlugs(): Promise<string[]> {
  return articleRepository.findPublishedSlugs();
}

/** Same-category articles first, topped up with the latest articles. */
export async function getRelatedArticles(
  article: ArticleSummary,
  limit = 3,
): Promise<ArticleSummary[]> {
  const sameCategory = await articleRepository.findMany({
    filters: { status: "PUBLISHED", categorySlug: article.categorySlug, excludeSlug: article.slug },
    take: limit,
  });
  if (sameCategory.length >= limit) return sameCategory.map(toArticleSummary);

  const extras = await articleRepository.findMany({
    filters: {
      status: "PUBLISHED",
      excludeSlug: article.slug,
      excludeIds: sameCategory.map((row) => row.id),
    },
    take: limit - sameCategory.length,
  });
  return [...sameCategory, ...extras].map(toArticleSummary);
}
