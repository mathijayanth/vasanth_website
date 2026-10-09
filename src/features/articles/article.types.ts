import type { ContentAuthor } from "@/types";

export interface ArticleSummary {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  categorySlug: string;
  imageUrl: string;
  imageAlt: string;
  author: ContentAuthor;
  publishedAt: string;
  readingTimeMinutes: number;
}

export type ContentHeadingLevel = 2 | 3 | 4;

export type InlinePart =
  | { type: "text"; value: string }
  | { type: "link"; value: string; href: string; external?: boolean };

export type ArticleContentBlock =
  | { type: "heading"; id: string; level: ContentHeadingLevel; text: string }
  | { type: "paragraph"; parts: InlinePart[] }
  | { type: "list"; ordered: boolean; items: string[] }
  | {
      type: "image";
      src: string;
      alt: string;
      caption?: string;
      width?: number;
      height?: number;
    }
  | { type: "quote"; text: string; attribution?: string }
  | {
      type: "callout";
      variant: "info" | "highlight" | "warning";
      title?: string;
      parts: InlinePart[];
    }
  | {
      type: "table";
      caption?: string;
      headers: string[];
      rows: string[][];
    };

export interface ArticleReference {
  id: string;
  label: string;
  href?: string;
}

export interface MedicalReviewInfo {
  reviewer: ContentAuthor;
  reviewedAt: string;
  note: string;
}

export interface ArticleDetail extends ArticleSummary {
  updatedAt: string;
  keyTakeaways: string[];
  content: ArticleContentBlock[];
  references: ArticleReference[];
  medicalReview?: MedicalReviewInfo;
  /** Visible banner that content is placeholder editorial */
  isPlaceholder?: boolean;
}

export function extractHeadings(
  content: ArticleContentBlock[],
): Array<{ id: string; level: ContentHeadingLevel; text: string }> {
  return content
    .filter((block): block is Extract<ArticleContentBlock, { type: "heading" }> => block.type === "heading")
    .map(({ id, level, text }) => ({ id, level, text }));
}
