import { articlesListQuerySchema, createArticleSchema } from "@/features/articles/article.schemas";
import { createArticle, listArticles } from "@/features/articles/server/article.service";
import { getSessionUser, requireUser } from "@/features/auth/server/session";
import { withErrorHandling } from "@/server/http/handle-error";
import { parseJsonBody, parseSearchParams } from "@/server/http/parse";
import { apiSuccess } from "@/server/http/response";

export const GET = withErrorHandling(async (request) => {
  const query = parseSearchParams(articlesListQuerySchema, request.nextUrl.searchParams);
  const viewer = await getSessionUser();
  return apiSuccess(await listArticles(query, viewer?.role));
});

export const POST = withErrorHandling(async (request) => {
  const user = await requireUser();
  const input = await parseJsonBody(createArticleSchema, request);
  const article = await createArticle(input, user);
  return apiSuccess(article, { message: "Article created", status: 201 });
});
