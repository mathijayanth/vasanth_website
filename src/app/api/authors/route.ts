import { NextRequest, NextResponse } from "next/server";
import { apiSuccess } from "@/lib/api/response";
import { parseSearchParams } from "@/lib/api/parse";
import { handleRouteError } from "@/lib/api/handle-error";
import { serializeAuthor } from "@/lib/api/services/articles";
import { db } from "@/lib/db";
import { authorsListQuerySchema } from "@/lib/validations/api";

export async function GET(request: NextRequest) {
  try {
    const parsed = parseSearchParams(
      authorsListQuerySchema,
      request.nextUrl.searchParams,
    );
    if (parsed instanceof NextResponse) return parsed;

    const where = parsed.search
      ? {
          OR: [
            { displayName: { contains: parsed.search, mode: "insensitive" as const } },
            { slug: { contains: parsed.search, mode: "insensitive" as const } },
            { specialty: { contains: parsed.search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [items, total] = await Promise.all([
      db.authorProfile.findMany({
        where,
        orderBy: { displayName: "asc" },
        skip: (parsed.page - 1) * parsed.limit,
        take: parsed.limit,
      }),
      db.authorProfile.count({ where }),
    ]);

    return apiSuccess({
      items: items.map(serializeAuthor),
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
