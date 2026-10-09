import type { ArticlePublicDTO } from "@/lib/api/services/articles";
import { ARTICLE_IMAGE_FALLBACK } from "@/lib/articles/constants";
import type { ArticleSummary } from "@/types";
import type {
  ArticleContentBlock,
  ArticleDetail,
  ArticleReference,
  MedicalReviewInfo,
} from "@/types/article-content";

type ListArticleRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string | null;
  featuredImageAlt: string | null;
  publishedAt: Date | null;
  readingTime: number;
  category: { name: string; slug: string };
  author: {
    slug: string;
    displayName: string;
    avatarUrl: string | null;
    title: string | null;
  };
};

export function parseArticleContent(raw: unknown): ArticleContentBlock[] {
  if (!Array.isArray(raw)) return [];
  return raw as ArticleContentBlock[];
}

export function extractKeyTakeaways(content: ArticleContentBlock[]): string[] {
  const listBlock = content.find(
    (block): block is Extract<ArticleContentBlock, { type: "list" }> =>
      block.type === "list" && !block.ordered,
  );
  return listBlock?.items.slice(0, 5) ?? [];
}

export function isPlaceholderArticle(
  title: string,
  content: ArticleContentBlock[],
): boolean {
  if (title.includes("[PLACEHOLDER]")) return true;
  return content.some(
    (block) =>
      block.type === "callout" &&
      block.variant === "warning" &&
      block.title?.toUpperCase().includes("PLACEHOLDER"),
  );
}

export function mapListRowToSummary(row: ListArticleRow): ArticleSummary {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    category: row.category.name,
    categorySlug: row.category.slug,
    imageUrl: row.featuredImage ?? ARTICLE_IMAGE_FALLBACK,
    imageAlt: row.featuredImageAlt ?? row.title,
    author: {
      name: row.author.displayName,
      slug: row.author.slug,
      avatarUrl: row.author.avatarUrl ?? undefined,
      title: row.author.title ?? undefined,
    },
    publishedAt: (row.publishedAt ?? new Date()).toISOString(),
    readingTimeMinutes: row.readingTime,
  };
}

function mapReferences(
  refs: ArticlePublicDTO["references"],
): ArticleReference[] {
  return refs.map((ref) => ({
    id: ref.id,
    label: ref.label,
    href: ref.href ?? undefined,
  }));
}

function mapMedicalReview(article: ArticlePublicDTO): MedicalReviewInfo | undefined {
  const row = article.medicalReviews[0];
  if (!row) return undefined;
  return {
    reviewer: {
      name: row.reviewer.displayName,
      slug: row.reviewer.slug,
      avatarUrl: row.reviewer.avatarUrl ?? undefined,
      title: row.reviewer.title ?? undefined,
    },
    reviewedAt: row.reviewedAt.toISOString(),
    note: row.note ?? "",
  };
}

export function mapArticleDtoToDetail(article: ArticlePublicDTO): ArticleDetail {
  const content = parseArticleContent(article.content);
  const summary = mapListRowToSummary({
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    featuredImage: article.featuredImage,
    featuredImageAlt: article.featuredImageAlt,
    publishedAt: article.publishedAt,
    readingTime: article.readingTime,
    category: article.category,
    author: article.author,
  });

  return {
    ...summary,
    updatedAt: article.updatedAt.toISOString(),
    keyTakeaways: extractKeyTakeaways(content),
    content,
    references: mapReferences(article.references),
    medicalReview: mapMedicalReview(article),
    isPlaceholder: isPlaceholderArticle(article.title, content),
  };
}
