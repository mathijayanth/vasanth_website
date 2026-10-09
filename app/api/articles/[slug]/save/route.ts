import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api/response";
import { handleRouteError } from "@/lib/api/handle-error";
import { looksLikeCuid } from "@/lib/api/utils";
import { requireAuth } from "@/lib/auth/session";
import { db } from "@/lib/db";

type RouteContext = { params: Promise<{ slug: string }> };

async function getPublishedArticleId(id: string) {
  return db.article.findFirst({
    where: { id, status: "PUBLISHED" },
    select: { id: true },
  });
}

export async function POST(_request: NextRequest, context: RouteContext) {
  try {
    const { slug: id } = await context.params;
    if (!looksLikeCuid(id)) {
      return apiError("BAD_REQUEST", "Invalid article id", 400);
    }

    const auth = await requireAuth();
    if (auth.error) return auth.error;

    const article = await getPublishedArticleId(id);
    if (!article) return apiError("NOT_FOUND", "Article not found", 404);

    await db.savedArticle.upsert({
      where: { userId_articleId: { userId: auth.user.id, articleId: id } },
      create: { userId: auth.user.id, articleId: id },
      update: {},
    });

    return apiSuccess({ articleId: id, saved: true }, { message: "Article saved", status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const { slug: id } = await context.params;
    if (!looksLikeCuid(id)) {
      return apiError("BAD_REQUEST", "Invalid article id", 400);
    }

    const auth = await requireAuth();
    if (auth.error) return auth.error;

    await db.savedArticle.deleteMany({
      where: { userId: auth.user.id, articleId: id },
    });

    return apiSuccess({ articleId: id, saved: false }, { message: "Article unsaved" });
  } catch (error) {
    return handleRouteError(error);
  }
}
