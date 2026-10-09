import { searchQuerySchema } from "@/features/articles/article.schemas";
import { searchArticles } from "@/features/articles/server/article.service";
import { withErrorHandling } from "@/server/http/handle-error";
import { parseSearchParams } from "@/server/http/parse";
import { apiSuccess } from "@/server/http/response";

export const GET = withErrorHandling(async (request) => {
  const query = parseSearchParams(searchQuerySchema, request.nextUrl.searchParams);
  return apiSuccess(await searchArticles(query));
});
