import {
  findArticleBySlugOrId,
  type ArticlePublicDTO,
} from "@/lib/api/services/articles";
import { mapArticleDtoToDetail, mapListRowToSummary } from "@/lib/articles/map-db-article";
import { db } from "@/lib/db";
import type { ArticleSummary } from "@/types";
import type { ArticleDetail } from "@/types/article-content";

export async function getArticleBySlug(slug: string): Promise<ArticleDetail | null> {
  const article = await findArticleBySlugOrId(slug, { includeDrafts: false });
  if (!article) return null;
  return mapArticleDtoToDetail(article);
}

export async function getAllArticleSlugs(): Promise<string[]> {
  const rows = await db.article.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true },
    orderBy: { publishedAt: "desc" },
  });
  return rows.map((row) => row.slug);
}

export async function getRelatedArticles(
  article: ArticleSummary,
  limit = 3,
): Promise<ArticleSummary[]> {
  const rows = await db.article.findMany({
    where: {
      status: "PUBLISHED",
      slug: { not: article.slug },
      category: { slug: article.categorySlug },
    },
    orderBy: { publishedAt: "desc" },
    take: limit,
    select: {
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
    },
  });

  return rows.map(mapListRowToSummary);
}

export async function getFallbackRelatedArticles(
  article: ArticleSummary,
  limit = 3,
): Promise<ArticleSummary[]> {
  const related = await getRelatedArticles(article, limit);
  if (related.length >= limit) return related;

  const extras = await db.article.findMany({
    where: {
      status: "PUBLISHED",
      slug: { not: article.slug },
      id: { notIn: related.map((item) => item.id) },
    },
    orderBy: { publishedAt: "desc" },
    take: limit - related.length,
    select: {
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
    },
  });

  return [...related, ...extras.map(mapListRowToSummary)];
}

/** @internal for tests or API parity */
export type { ArticlePublicDTO };
