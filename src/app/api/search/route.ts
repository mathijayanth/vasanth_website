import { NextRequest, NextResponse } from "next/server";
import { apiSuccess } from "@/lib/api/response";
import { parseSearchParams } from "@/lib/api/parse";
import { handleRouteError } from "@/lib/api/handle-error";
import { searchArticles } from "@/lib/api/services/articles";
import { searchQuerySchema } from "@/lib/validations/api";

export async function GET(request: NextRequest) {
  try {
    const parsed = parseSearchParams(searchQuerySchema, request.nextUrl.searchParams);
    if (parsed instanceof NextResponse) return parsed;

    const result = await searchArticles({
      pagination: { page: parsed.page, limit: parsed.limit },
      q: parsed.q,
      categorySlug: parsed.category,
    });

    return apiSuccess(result);
  } catch (error) {
    return handleRouteError(error);
  }
}
