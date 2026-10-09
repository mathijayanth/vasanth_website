import "server-only";
import type { ArticleStatus, Prisma } from "@prisma/client";
import { db } from "@/server/db/client";
import type { ArticleSortOption } from "../article.schemas";

export const articleDetailSelect = {
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

export const articleListSelect = {
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
} satisfies Prisma.ArticleSelect;

export type ArticleDetailRecord = Prisma.ArticleGetPayload<{ select: typeof articleDetailSelect }>;
export type ArticleListRecord = Prisma.ArticleGetPayload<{ select: typeof articleListSelect }>;

export type ArticleFilters = {
  search?: string;
  categorySlug?: string;
  status?: ArticleStatus;
  excludeIds?: string[];
  excludeSlug?: string;
};

export type ArticleWriteData = {
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

function buildWhere(filters: ArticleFilters): Prisma.ArticleWhereInput {
  const where: Prisma.ArticleWhereInput = {};
  if (filters.status) where.status = filters.status;
  if (filters.categorySlug) where.category = { slug: filters.categorySlug };
  if (filters.excludeIds?.length) where.id = { notIn: filters.excludeIds };
  if (filters.excludeSlug) where.slug = { not: filters.excludeSlug };
  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: "insensitive" } },
      { excerpt: { contains: filters.search, mode: "insensitive" } },
    ];
  }
  return where;
}

function buildOrderBy(sort: ArticleSortOption = "latest"): Prisma.ArticleOrderByWithRelationInput {
  if (sort === "oldest") return { publishedAt: "asc" };
  if (sort === "title") return { title: "asc" };
  return { publishedAt: "desc" };
}

export const articleRepository = {
  findMany(params: { filters: ArticleFilters; sort?: ArticleSortOption; skip?: number; take: number }) {
    return db.article.findMany({
      where: buildWhere(params.filters),
      orderBy: buildOrderBy(params.sort),
      skip: params.skip,
      take: params.take,
      select: articleListSelect,
    });
  },

  count(filters: ArticleFilters) {
    return db.article.count({ where: buildWhere(filters) });
  },

  findBySlug(slug: string) {
    return db.article.findUnique({ where: { slug }, select: articleDetailSelect });
  },

  findById(id: string) {
    return db.article.findUnique({ where: { id }, select: articleDetailSelect });
  },

  findOwnership(id: string) {
    return db.article.findUnique({ where: { id }, select: { id: true, authorId: true } });
  },

  findPublishedId(id: string) {
    return db.article.findFirst({ where: { id, status: "PUBLISHED" }, select: { id: true } });
  },

  async isSlugAvailable(slug: string, excludeId?: string) {
    const existing = await db.article.findUnique({ where: { slug }, select: { id: true } });
    if (!existing) return true;
    return excludeId ? existing.id === excludeId : false;
  },

  async findPublishedSlugs() {
    const rows = await db.article.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true },
      orderBy: { publishedAt: "desc" },
    });
    return rows.map((row) => row.slug);
  },

  create(data: ArticleWriteData) {
    return db.article.create({
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content as Prisma.InputJsonValue,
        featuredImage: data.featuredImage ?? null,
        featuredImageAlt: data.featuredImageAlt ?? null,
        status: data.status,
        categoryId: data.categoryId,
        authorId: data.authorId,
        readingTime: data.readingTime,
        seoTitle: data.seoTitle ?? null,
        seoDescription: data.seoDescription ?? null,
        publishedAt: data.publishedAt ?? (data.status === "PUBLISHED" ? new Date() : null),
        tags: data.tagIds?.length
          ? { create: data.tagIds.map((tagId) => ({ tagId })) }
          : undefined,
      },
      select: articleDetailSelect,
    });
  },

  update(id: string, data: Partial<ArticleWriteData>) {
    const update: Prisma.ArticleUncheckedUpdateInput = {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content === undefined ? undefined : (data.content as Prisma.InputJsonValue),
      featuredImage: data.featuredImage,
      featuredImageAlt: data.featuredImageAlt,
      status: data.status,
      categoryId: data.categoryId,
      authorId: data.authorId,
      readingTime: data.readingTime,
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
      publishedAt: data.publishedAt,
    };

    return db.$transaction(async (tx) => {
      if (data.tagIds) {
        await tx.articleTag.deleteMany({ where: { articleId: id } });
        update.tags = { create: data.tagIds.map((tagId) => ({ tagId })) };
      }
      return tx.article.update({ where: { id }, data: update, select: articleDetailSelect });
    });
  },

  async delete(id: string) {
    await db.article.delete({ where: { id } });
  },

  async save(userId: string, articleId: string) {
    await db.savedArticle.upsert({
      where: { userId_articleId: { userId, articleId } },
      create: { userId, articleId },
      update: {},
    });
  },

  async unsave(userId: string, articleId: string) {
    await db.savedArticle.deleteMany({ where: { userId, articleId } });
  },
};
