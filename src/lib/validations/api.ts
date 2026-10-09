import { z } from "zod";

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});

export type PaginationInput = z.infer<typeof paginationSchema>;

export const articleSortSchema = z.enum(["latest", "oldest", "title"]).default("latest");

export const articlesListQuerySchema = paginationSchema.extend({
  search: z.string().trim().max(120).optional(),
  category: z.string().trim().max(80).optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  sort: articleSortSchema.optional(),
});

export const searchQuerySchema = paginationSchema.extend({
  q: z.string().trim().min(1).max(120),
  category: z.string().trim().max(80).optional(),
});

export const createArticleSchema = z.object({
  title: z.string().trim().min(3).max(200),
  slug: z
    .string()
    .trim()
    .min(3)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase kebab-case"),
  excerpt: z.string().trim().min(10).max(500),
  content: z.unknown(),
  featuredImage: z.string().url().max(2048).optional().nullable(),
  featuredImageAlt: z.string().trim().max(200).optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  categoryId: z.string().cuid(),
  authorId: z.string().cuid(),
  readingTime: z.number().int().min(1).max(120).default(5),
  seoTitle: z.string().trim().max(200).optional().nullable(),
  seoDescription: z.string().trim().max(300).optional().nullable(),
  publishedAt: z.string().datetime().optional().nullable(),
  tagIds: z.array(z.string().cuid()).max(20).optional(),
});

export const updateArticleSchema = createArticleSchema.partial();

export const createCategorySchema = z.object({
  name: z.string().trim().min(2).max(100),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().trim().max(500).optional().nullable(),
});

export const newsletterSchema = z.object({
  email: z.string().trim().email().max(254),
});

export const loginSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(8).max(128),
});

export const authorsListQuerySchema = paginationSchema.extend({
  search: z.string().trim().max(120).optional(),
});

export const categoriesListQuerySchema = paginationSchema.extend({
  search: z.string().trim().max(120).optional(),
});
