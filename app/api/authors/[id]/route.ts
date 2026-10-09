import { apiError, apiSuccess } from "@/lib/api/response";
import { handleRouteError } from "@/lib/api/handle-error";
import { looksLikeCuid } from "@/lib/api/utils";
import { serializeAuthor } from "@/lib/api/services/articles";
import { db } from "@/lib/db";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    const author = looksLikeCuid(id)
      ? await db.authorProfile.findUnique({ where: { id } })
      : await db.authorProfile.findUnique({ where: { slug: id } });

    if (!author) {
      return apiError("NOT_FOUND", "Author not found", 404);
    }

    const publishedCount = await db.article.count({
      where: { authorId: author.id, status: "PUBLISHED" },
    });

    return apiSuccess({
      ...serializeAuthor(author),
      publishedArticleCount: publishedCount,
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
