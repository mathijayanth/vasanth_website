import { authorsListQuerySchema } from "@/features/authors/author.schemas";
import { listAuthors } from "@/features/authors/server/author.service";
import { withErrorHandling } from "@/server/http/handle-error";
import { parseSearchParams } from "@/server/http/parse";
import { apiSuccess } from "@/server/http/response";

export const GET = withErrorHandling(async (request) => {
  const query = parseSearchParams(authorsListQuerySchema, request.nextUrl.searchParams);
  return apiSuccess(await listAuthors(query));
});
