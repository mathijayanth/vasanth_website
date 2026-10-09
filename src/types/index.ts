/** Content shapes shared by mock data and future API responses. */

export type ArticleStatus = "DRAFT" | "PUBLISHED";

export type UserRole = "ADMIN" | "EDITOR" | "AUTHOR" | "USER";

export interface NavLink {
  href: string;
  label: string;
}

export interface ContentAuthor {
  name: string;
  slug: string;
  avatarUrl?: string;
  title?: string;
  specialty?: string;
}

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

export interface TopicSummary {
  slug: string;
  name: string;
  description: string;
}

export interface ExpertProfile extends ContentAuthor {
  id: string;
  bio: string;
}
