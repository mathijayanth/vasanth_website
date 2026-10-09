import { NextRequest, NextResponse } from "next/server";
import { apiError, apiSuccess } from "@/lib/api/response";
import { parseJsonBody } from "@/lib/api/parse";
import { handleRouteError } from "@/lib/api/handle-error";
import { looksLikeCuid } from "@/lib/api/utils";
import { getSessionUser, requireRoles } from "@/lib/auth/session";
import {
  getAuthorProfileIdForUser,
  userCanEditArticle,
  validateArticleMutationPermissions,
} from "@/lib/auth/article-access";
import { canManageArticles } from "@/lib/auth/permissions";
import {
  deleteArticleRecord,
  findArticleBySlugOrId,
  ensureAuthorExists,
  ensureCategoryExists,
  ensureUniqueArticleSlug,
  serializeArticle,
  updateArticleRecord,
} from "@/lib/api/services/articles";
import { updateArticleSchema } from "@/lib/validations/api";

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const session = await getSessionUser();
    const includeDrafts =
      session?.role === "ADMIN" ||
      session?.role === "EDITOR" ||
      session?.role === "AUTHOR";

    const article = await findArticleBySlugOrId(slug, { includeDrafts });
    if (!article) {
      return apiError("NOT_FOUND", "Article not found", 404);
    }

    return apiSuccess(serializeArticle(article));
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { slug: id } = await context.params;
    if (!looksLikeCuid(id)) {
      return apiError("BAD_REQUEST", "Article id must be used for updates", 400);
    }

    const auth = await requireRoles(["ADMIN", "EDITOR", "AUTHOR"]);
    if (auth.error) return auth.error;
    if (!canManageArticles(auth.user.role)) {
      return apiError("FORBIDDEN", "You do not have permission to update articles", 403);
    }

    const parsed = await parseJsonBody(updateArticleSchema, request);
    if (parsed instanceof NextResponse) return parsed;

    if (parsed.slug) {
      const unique = await ensureUniqueArticleSlug(parsed.slug, id);
      if (!unique) return apiError("CONFLICT", "Article slug already exists", 409);
    }

    if (parsed.categoryId) {
      const category = await ensureCategoryExists(parsed.categoryId);
      if (!category) return apiError("BAD_REQUEST", "Invalid categoryId", 400);
    }

    if (parsed.authorId) {
      const author = await ensureAuthorExists(parsed.authorId);
      if (!author) return apiError("BAD_REQUEST", "Invalid authorId", 400);
    }

    const canEdit = await userCanEditArticle(auth.user.id, auth.user.role, id);
    if (!canEdit) {
      return apiError("FORBIDDEN", "You can only edit your own articles", 403);
    }

    const authorProfile =
      auth.user.role === "AUTHOR"
        ? await getAuthorProfileIdForUser(auth.user.id)
        : null;
    const permission = validateArticleMutationPermissions(
      auth.user.role,
      { status: parsed.status, authorId: parsed.authorId },
      { ownAuthorId: authorProfile?.id ?? null },
    );
    if (!permission.ok) {
      return apiError("FORBIDDEN", permission.message, 403);
    }

    const updatePayload = {
      ...parsed,
      publishedAt:
        parsed.publishedAt === undefined
          ? undefined
          : parsed.publishedAt
            ? new Date(parsed.publishedAt)
            : null,
    };

    const article = await updateArticleRecord(id, updatePayload);

    return apiSuccess(serializeArticle(article), { message: "Article updated" });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const { slug: id } = await context.params;
    if (!looksLikeCuid(id)) {
      return apiError("BAD_REQUEST", "Article id must be used for deletion", 400);
    }

    const auth = await requireRoles(["ADMIN", "EDITOR"]);
    if (auth.error) return auth.error;

    await deleteArticleRecord(id);
    return apiSuccess({ id }, { message: "Article deleted" });
  } catch (error) {
    return handleRouteError(error);
  }
}
