import { NextRequest, NextResponse } from "next/server";
import { apiError, apiSuccess } from "@/lib/api/response";
import { parseJsonBody, parseSearchParams } from "@/lib/api/parse";
import { handleRouteError } from "@/lib/api/handle-error";
import { requireRoles } from "@/lib/auth/session";
import { canManageCategories } from "@/lib/auth/session";
import { serializeCategory } from "@/lib/api/services/articles";
import { db } from "@/lib/db";
import { categoriesListQuerySchema, createCategorySchema } from "@/lib/validations/api";

export async function GET(request: NextRequest) {
  try {
    const parsed = parseSearchParams(
      categoriesListQuerySchema,
      request.nextUrl.searchParams,
    );
    if (parsed instanceof NextResponse) return parsed;

    const where = parsed.search
      ? {
          OR: [
            { name: { contains: parsed.search, mode: "insensitive" as const } },
            { slug: { contains: parsed.search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [items, total] = await Promise.all([
      db.category.findMany({
        where,
        orderBy: { name: "asc" },
        skip: (parsed.page - 1) * parsed.limit,
        take: parsed.limit,
      }),
      db.category.count({ where }),
    ]);

    return apiSuccess({
      items: items.map(serializeCategory),
      pagination: {
        page: parsed.page,
        limit: parsed.limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / parsed.limit)),
      },
    });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireRoles(["ADMIN", "EDITOR"]);
    if (auth.error) return auth.error;
    if (!canManageCategories(auth.user.role)) {
      return apiError("FORBIDDEN", "You do not have permission to create categories", 403);
    }

    const parsed = await parseJsonBody(createCategorySchema, request);
    if (parsed instanceof NextResponse) return parsed;

    const existing = await db.category.findUnique({ where: { slug: parsed.slug } });
    if (existing) return apiError("CONFLICT", "Category slug already exists", 409);

    const category = await db.category.create({
      data: {
        name: parsed.name,
        slug: parsed.slug,
        description: parsed.description ?? null,
      },
    });

    return apiSuccess(serializeCategory(category), {
      message: "Category created",
      status: 201,
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
