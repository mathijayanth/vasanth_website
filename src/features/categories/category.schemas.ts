import { z } from "zod";
import { paginationSchema } from "@/server/http/pagination";

export const categoriesListQuerySchema = paginationSchema.extend({
  search: z.string().trim().max(120).optional(),
});

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

export type CategoriesListQuery = z.infer<typeof categoriesListQuerySchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
