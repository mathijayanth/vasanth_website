import { requireUser } from "@/features/auth/server/session";
import {
  categoriesListQuerySchema,
  createCategorySchema,
} from "@/features/categories/category.schemas";
import { createCategory, listCategories } from "@/features/categories/server/category.service";
import { withErrorHandling } from "@/server/http/handle-error";
import { parseJsonBody, parseSearchParams } from "@/server/http/parse";
import { apiSuccess } from "@/server/http/response";

export const GET = withErrorHandling(async (request) => {
  const query = parseSearchParams(categoriesListQuerySchema, request.nextUrl.searchParams);
  return apiSuccess(await listCategories(query));
});

export const POST = withErrorHandling(async (request) => {
  const user = await requireUser();
  const input = await parseJsonBody(createCategorySchema, request);
  const category = await createCategory(input, user);
  return apiSuccess(category, { message: "Category created", status: 201 });
});
