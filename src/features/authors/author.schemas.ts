import { z } from "zod";
import { paginationSchema } from "@/server/http/pagination";

export const authorsListQuerySchema = paginationSchema.extend({
  search: z.string().trim().max(120).optional(),
});

export type AuthorsListQuery = z.infer<typeof authorsListQuerySchema>;
