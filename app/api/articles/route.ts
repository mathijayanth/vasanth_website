import { NextRequest, NextResponse } from "next/server";
import { apiError, apiSuccess } from "@/lib/api/response";
import { parseJsonBody, parseSearchParams } from "@/lib/api/parse";
import { handleRouteError } from "@/lib/api/handle-error";
import { getSessionUser, requireRoles } from "@/lib/auth/session";
import {
  getAuthorProfileIdForUser,
  validateArticleMutationPermissions,
} from "@/lib/auth/article-access";
import { canManageArticles } from "@/lib/auth/permissions";
import {
  createArticleRecord,
  ensureAuthorExists,
  ensureCategoryExists,
  ensureUniqueArticleSlug,
  listArticles,
  serializeArticle,
} from "@/lib/api/services/articles";
import { articlesListQuerySchema, createArticleSchema } from "@/lib/validations/api";

function canViewDrafts(role?: string) {
  return role === "ADMIN" || role === "EDITOR" || role === "AUTHOR";
}

export async function GET(request: NextRequest) {
  try {
    const parsed = parseSearchParams(
      articlesListQuerySchema,
      request.nextUrl.searchParams,
    );
    if (parsed instanceof NextResponse) return parsed;

    const session = await getSessionUser();
    const includeDrafts = canViewDrafts(session?.role);

    if (parsed.status && !includeDrafts) {
      return apiError("FORBIDDEN", "Status filter requires authentication", 403);
    }

    const result = await listArticles({
      pagination: { page: parsed.page, limit: parsed.limit },
      search: parsed.search,
      categorySlug: parsed.category,
      status: parsed.status,
      sort: parsed.sort,
      includeDrafts,
    });

    return apiSuccess(result);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireRoles(["ADMIN", "EDITOR", "AUTHOR"]);
    if (auth.error) return auth.error;
    if (!canManageArticles(auth.user.role)) {
      return apiError("FORBIDDEN", "You do not have permission to create articles", 403);
    }

    const parsed = await parseJsonBody(createArticleSchema, request);
    if (parsed instanceof NextResponse) return parsed;

    const [category, author, slugUnique] = await Promise.all([
      ensureCategoryExists(parsed.categoryId),
      ensureAuthorExists(parsed.authorId),
      ensureUniqueArticleSlug(parsed.slug),
    ]);

    if (!category) return apiError("BAD_REQUEST", "Invalid categoryId", 400);
    if (!author) return apiError("BAD_REQUEST", "Invalid authorId", 400);
    if (!slugUnique) return apiError("CONFLICT", "Article slug already exists", 409);

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

    const article = await createArticleRecord({
      ...parsed,
      publishedAt: parsed.publishedAt ? new Date(parsed.publishedAt) : null,
    });

    return apiSuccess(serializeArticle(article), {
      message: "Article created",
      status: 201,
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
