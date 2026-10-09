import type { Article, ArticleStatus, AuthorProfile, Category, Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import type { PaginationInput } from "@/lib/validations/api";

const articlePublicSelect = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  content: true,
  featuredImage: true,
  featuredImageAlt: true,
  status: true,
  publishedAt: true,
  updatedAt: true,
  readingTime: true,
  seoTitle: true,
  seoDescription: true,
  lastReviewedAt: true,
  createdAt: true,
  category: { select: { id: true, name: true, slug: true } },
  author: {
    select: {
      id: true,
      slug: true,
      displayName: true,
      title: true,
      specialty: true,
      avatarUrl: true,
    },
  },
  tags: { select: { tag: { select: { id: true, name: true, slug: true } } } },
  references: {
    select: { id: true, label: true, href: true, sortOrder: true },
    orderBy: { sortOrder: "asc" as const },
  },
  medicalReviews: {
    take: 1,
    orderBy: { reviewedAt: "desc" as const },
    select: {
      reviewedAt: true,
      note: true,
      isVerified: true,
      reviewer: {
        select: { id: true, slug: true, displayName: true, title: true, avatarUrl: true },
      },
    },
  },
} satisfies Prisma.ArticleSelect;

export type ArticlePublicDTO = Prisma.ArticleGetPayload<{ select: typeof articlePublicSelect }>;

export function serializeArticle(article: ArticlePublicDTO) {
  const { medicalReviews, tags, ...rest } = article;
  return {
    ...rest,
    tags: tags.map((row) => row.tag),
    medicalReview: medicalReviews[0] ?? null,
  };
}

export function buildArticleOrderBy(
  sort: "latest" | "oldest" | "title",
): Prisma.ArticleOrderByWithRelationInput {
  if (sort === "oldest") return { publishedAt: "asc" };
  if (sort === "title") return { title: "asc" };
  return { publishedAt: "desc" };
}

export async function listArticles(params: {
  pagination: PaginationInput;
  search?: string;
  categorySlug?: string;
  status?: ArticleStatus;
  sort?: "latest" | "oldest" | "title";
  includeDrafts: boolean;
}) {
  const { page, limit } = params.pagination;
  const where: Prisma.ArticleWhereInput = {};

    if (params.status) {
      where.status = params.status;
    } else if (!params.includeDrafts) {
      where.status = "PUBLISHED";
    }

  if (params.categorySlug) {
    where.category = { slug: params.categorySlug };
  }

  if (params.search) {
    const q = params.search;
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { excerpt: { contains: q, mode: "insensitive" } },
    ];
  }

  const [items, total] = await Promise.all([
    db.article.findMany({
      where,
      orderBy: buildArticleOrderBy(params.sort ?? "latest"),
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        featuredImage: true,
        featuredImageAlt: true,
        status: true,
        publishedAt: true,
        readingTime: true,
        category: { select: { id: true, name: true, slug: true } },
        author: {
          select: { id: true, slug: true, displayName: true, avatarUrl: true, title: true },
        },
      },
    }),
    db.article.count({ where }),
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  };
}

export async function findArticleBySlugOrId(
  identifier: string,
  options: { includeDrafts: boolean },
) {
  const bySlug = await db.article.findUnique({
    where: { slug: identifier },
    select: articlePublicSelect,
  });
  if (bySlug) {
    if (!options.includeDrafts && bySlug.status !== "PUBLISHED") return null;
    return bySlug;
  }

  const byId = await db.article.findUnique({
    where: { id: identifier },
    select: articlePublicSelect,
  });
  if (!byId) return null;
  if (!options.includeDrafts && byId.status !== "PUBLISHED") return null;
  return byId;
}

export async function findArticleById(id: string) {
  return db.article.findUnique({
    where: { id },
    select: articlePublicSelect,
  });
}

export async function ensureCategoryExists(categoryId: string) {
  return db.category.findUnique({ where: { id: categoryId }, select: { id: true } });
}

export async function ensureAuthorExists(authorId: string) {
  return db.authorProfile.findUnique({ where: { id: authorId }, select: { id: true } });
}

export async function ensureUniqueArticleSlug(slug: string, excludeId?: string) {
  const existing = await db.article.findUnique({ where: { slug }, select: { id: true } });
  if (!existing) return true;
  return excludeId ? existing.id === excludeId : false;
}

export function serializeAuthor(author: AuthorProfile) {
  return {
    id: author.id,
    slug: author.slug,
    displayName: author.displayName,
    bio: author.bio,
    title: author.title,
    specialty: author.specialty,
    avatarUrl: author.avatarUrl,
    createdAt: author.createdAt,
    updatedAt: author.updatedAt,
  };
}

export function serializeCategory(category: Category) {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  };
}

export async function searchArticles(params: {
  pagination: PaginationInput;
  q: string;
  categorySlug?: string;
}) {
  return listArticles({
    pagination: params.pagination,
    search: params.q,
    categorySlug: params.categorySlug,
    sort: "latest",
    includeDrafts: false,
  });
}

export type ArticleCreateInput = {
  title: string;
  slug: string;
  excerpt: string;
  content: unknown;
  featuredImage?: string | null;
  featuredImageAlt?: string | null;
  status: ArticleStatus;
  categoryId: string;
  authorId: string;
  readingTime: number;
  seoTitle?: string | null;
  seoDescription?: string | null;
  publishedAt?: Date | null;
  tagIds?: string[];
};

export async function createArticleRecord(input: ArticleCreateInput) {
  return db.article.create({
    data: {
      title: input.title,
      slug: input.slug,
      excerpt: input.excerpt,
      content: input.content as Prisma.InputJsonValue,
      featuredImage: input.featuredImage ?? null,
      featuredImageAlt: input.featuredImageAlt ?? null,
      status: input.status,
      categoryId: input.categoryId,
      authorId: input.authorId,
      readingTime: input.readingTime,
      seoTitle: input.seoTitle ?? null,
      seoDescription: input.seoDescription ?? null,
      publishedAt:
        input.publishedAt ??
        (input.status === "PUBLISHED" ? new Date() : null),
      tags: input.tagIds?.length
        ? { create: input.tagIds.map((tagId) => ({ tagId })) }
        : undefined,
    },
    select: articlePublicSelect,
  });
}

export async function updateArticleRecord(
  id: string,
  input: Partial<ArticleCreateInput>,
) {
  const data: Prisma.ArticleUpdateInput = {
    ...(input.title !== undefined ? { title: input.title } : {}),
    ...(input.slug !== undefined ? { slug: input.slug } : {}),
    ...(input.excerpt !== undefined ? { excerpt: input.excerpt } : {}),
    ...(input.content !== undefined
      ? { content: input.content as Prisma.InputJsonValue }
      : {}),
    ...(input.featuredImage !== undefined ? { featuredImage: input.featuredImage } : {}),
    ...(input.featuredImageAlt !== undefined
      ? { featuredImageAlt: input.featuredImageAlt }
      : {}),
    ...(input.status !== undefined ? { status: input.status } : {}),
    ...(input.categoryId !== undefined ? { categoryId: input.categoryId } : {}),
    ...(input.authorId !== undefined ? { authorId: input.authorId } : {}),
    ...(input.readingTime !== undefined ? { readingTime: input.readingTime } : {}),
    ...(input.seoTitle !== undefined ? { seoTitle: input.seoTitle } : {}),
    ...(input.seoDescription !== undefined
      ? { seoDescription: input.seoDescription }
      : {}),
    ...(input.publishedAt !== undefined ? { publishedAt: input.publishedAt } : {}),
  };

  if (input.tagIds) {
    await db.articleTag.deleteMany({ where: { articleId: id } });
    data.tags = { create: input.tagIds.map((tagId) => ({ tagId })) };
  }

  return db.article.update({
    where: { id },
    data,
    select: articlePublicSelect,
  });
}

export async function deleteArticleRecord(id: string) {
  await db.article.delete({ where: { id } });
}

export type { Article };
