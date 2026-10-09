import { z } from "zod";
import { paginationSchema } from "@/server/http/pagination";

const slugSchema = z
  .string()
  .trim()
  .min(3)
  .max(200)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase kebab-case");

export const articleStatusSchema = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);
export const articleSortSchema = z.enum(["latest", "oldest", "title"]);

export const articlesListQuerySchema = paginationSchema.extend({
  search: z.string().trim().max(120).optional(),
  category: z.string().trim().max(80).optional(),
  status: articleStatusSchema.optional(),
  sort: articleSortSchema.optional(),
});

export const searchQuerySchema = paginationSchema.extend({
  q: z.string().trim().min(1).max(120),
  category: z.string().trim().max(80).optional(),
});

export const createArticleSchema = z.object({
  title: z.string().trim().min(3).max(200),
  slug: slugSchema,
  excerpt: z.string().trim().min(10).max(500),
  content: z.unknown(),
  featuredImage: z.string().url().max(2048).optional().nullable(),
  featuredImageAlt: z.string().trim().max(200).optional().nullable(),
  status: articleStatusSchema.default("DRAFT"),
  categoryId: z.string().cuid(),
  authorId: z.string().cuid(),
  readingTime: z.number().int().min(1).max(120).default(5),
  seoTitle: z.string().trim().max(200).optional().nullable(),
  seoDescription: z.string().trim().max(300).optional().nullable(),
  publishedAt: z.string().datetime().optional().nullable(),
  tagIds: z.array(z.string().cuid()).max(20).optional(),
});

export const updateArticleSchema = createArticleSchema.partial();

export type ArticleSortOption = z.infer<typeof articleSortSchema>;
export type ArticlesListQuery = z.infer<typeof articlesListQuerySchema>;
export type SearchQuery = z.infer<typeof searchQuerySchema>;
export type CreateArticleInput = z.infer<typeof createArticleSchema>;
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>;
