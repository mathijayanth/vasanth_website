import type { Prisma } from "@prisma/client";
import { buildArticleOrderBy } from "@/lib/api/services/articles";
import { ARTICLE_PAGE_SIZE } from "@/lib/articles/constants";
import { mapListRowToSummary } from "@/lib/articles/map-db-article";
import { db } from "@/lib/db";
import type { ArticleSummary } from "@/types";
import type { ParsedArticlesQuery } from "./search-params";

export type ArticlesQueryResult = {
  items: ArticleSummary[];
  featured: ArticleSummary[];
  total: number;
  totalPages: number;
  page: number;
  pageSize: number;
};

const listSelect = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  featuredImage: true,
  featuredImageAlt: true,
  publishedAt: true,
  readingTime: true,
  category: { select: { name: true, slug: true } },
  author: {
    select: {
      slug: true,
      displayName: true,
      avatarUrl: true,
      title: true,
    },
  },
} satisfies Prisma.ArticleSelect;

function buildWhere(query: ParsedArticlesQuery): Prisma.ArticleWhereInput {
  const where: Prisma.ArticleWhereInput = { status: "PUBLISHED" };

  if (query.category) {
    where.category = { slug: query.category };
  }

  if (query.search) {
    const q = query.search;
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { excerpt: { contains: q, mode: "insensitive" } },
    ];
  }

  return where;
}

export async function queryArticles(
  query: ParsedArticlesQuery,
): Promise<ArticlesQueryResult> {
  const where = buildWhere(query);
  const orderBy = buildArticleOrderBy(query.sort);
  const showFeatured =
    query.page === 1 && !query.search && !query.category;

  let featured: ArticleSummary[] = [];
  let gridWhere: Prisma.ArticleWhereInput = where;

  if (showFeatured) {
    const featuredRows = await db.article.findMany({
      where,
      orderBy,
      take: 2,
      select: listSelect,
    });
    featured = featuredRows.map(mapListRowToSummary);
    const featuredIds = featuredRows.map((row) => row.id);
    if (featuredIds.length > 0) {
      gridWhere = { AND: [where, { id: { notIn: featuredIds } }] };
    }
  }

  const total = await db.article.count({ where: gridWhere });
  const totalPages = Math.max(1, Math.ceil(total / ARTICLE_PAGE_SIZE));
  const page = Math.min(query.page, totalPages);
  const skip = (page - 1) * ARTICLE_PAGE_SIZE;

  const rows = await db.article.findMany({
    where: gridWhere,
    orderBy,
    skip,
    take: ARTICLE_PAGE_SIZE,
    select: listSelect,
  });

  return {
    items: rows.map(mapListRowToSummary),
    featured,
    total,
    totalPages,
    page,
    pageSize: ARTICLE_PAGE_SIZE,
  };
}

export async function countPublishedArticles(): Promise<number> {
  return db.article.count({ where: { status: "PUBLISHED" } });
}
