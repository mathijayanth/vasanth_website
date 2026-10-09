import { updateArticleSchema } from "@/features/articles/article.schemas";
import {
  deleteArticle,
  getArticle,
  updateArticle,
} from "@/features/articles/server/article.service";
import { getSessionUser, requireUser } from "@/features/auth/server/session";
import { looksLikeCuid } from "@/lib/ids";
import { badRequest } from "@/server/http/errors";
import { withErrorHandling } from "@/server/http/handle-error";
import { parseJsonBody } from "@/server/http/parse";
import { apiSuccess } from "@/server/http/response";

type RouteContext = { params: Promise<{ slug: string }> };

/** GET accepts a slug or id; mutations require the article id in this segment. */
async function requireArticleId(context: RouteContext): Promise<string> {
  const { slug: id } = await context.params;
  if (!looksLikeCuid(id)) throw badRequest("Article id is required for this operation");
  return id;
}

export const GET = withErrorHandling<RouteContext>(async (_request, context) => {
  const { slug } = await context.params;
  const viewer = await getSessionUser();
  return apiSuccess(await getArticle(slug, viewer?.role));
});

export const PUT = withErrorHandling<RouteContext>(async (request, context) => {
  const id = await requireArticleId(context);
  const user = await requireUser();
  const input = await parseJsonBody(updateArticleSchema, request);
  const article = await updateArticle(id, input, user);
  return apiSuccess(article, { message: "Article updated" });
});

export const DELETE = withErrorHandling<RouteContext>(async (_request, context) => {
  const id = await requireArticleId(context);
  const user = await requireUser();
  await deleteArticle(id, user);
  return apiSuccess({ id }, { message: "Article deleted" });
});
