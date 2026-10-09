import { NextRequest, NextResponse } from "next/server";
import { apiSuccess } from "@/lib/api/response";
import { parseJsonBody } from "@/lib/api/parse";
import { getClientIp, rateLimitOrError } from "@/lib/api/rate-limit";
import { handleRouteError } from "@/lib/api/handle-error";
import { db } from "@/lib/db";
import { newsletterSchema } from "@/lib/validations/api";

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const limited = await rateLimitOrError("newsletter-subscribe", ip, 5, 60_000);
    if (limited) return limited;

    const parsed = await parseJsonBody(newsletterSchema, request);
    if (parsed instanceof NextResponse) return parsed;

    const email = parsed.email.toLowerCase();

    await db.newsletterSubscriber.upsert({
      where: { email },
      create: { email, status: "ACTIVE" },
      update: { status: "ACTIVE", unsubscribedAt: null },
    });

    return apiSuccess(
      { subscribed: true },
      { message: "Subscribed successfully", status: 201 },
    );
  } catch (error) {
    return handleRouteError(error);
  }
}
