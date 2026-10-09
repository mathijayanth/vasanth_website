import { saveArticle, unsaveArticle } from "@/features/articles/server/article.service";
import { requireUser } from "@/features/auth/server/session";
import { looksLikeCuid } from "@/lib/ids";
import { badRequest } from "@/server/http/errors";
import { withErrorHandling } from "@/server/http/handle-error";
import { apiSuccess } from "@/server/http/response";

type RouteContext = { params: Promise<{ slug: string }> };

async function requireArticleId(context: RouteContext): Promise<string> {
  const { slug: id } = await context.params;
  if (!looksLikeCuid(id)) throw badRequest("Invalid article id");
  return id;
}

export const POST = withErrorHandling<RouteContext>(async (_request, context) => {
  const articleId = await requireArticleId(context);
  const user = await requireUser();
  await saveArticle(articleId, user);
  return apiSuccess({ articleId, saved: true }, { message: "Article saved", status: 201 });
});

export const DELETE = withErrorHandling<RouteContext>(async (_request, context) => {
  const articleId = await requireArticleId(context);
  const user = await requireUser();
  await unsaveArticle(articleId, user);
  return apiSuccess({ articleId, saved: false }, { message: "Article unsaved" });
});
