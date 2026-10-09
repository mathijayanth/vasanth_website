import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { UserRole } from "@prisma/client";
import { apiError, apiSuccess } from "@/lib/api/response";
import { parseJsonBody } from "@/lib/api/parse";
import { getClientIp, rateLimitOrError } from "@/lib/api/rate-limit";
import { handleRouteError } from "@/lib/api/handle-error";
import { db } from "@/lib/db";
import { registerSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const limited = await rateLimitOrError("auth-register", ip, 5, 60_000);
    if (limited) return limited;

    const parsed = await parseJsonBody(registerSchema, request);
    if (parsed instanceof NextResponse) return parsed;

    const email = parsed.email.toLowerCase();
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return apiError("CONFLICT", "An account with this email already exists", 409);
    }

    const passwordHash = await hash(parsed.password, 12);
    await db.user.create({
      data: {
        email,
        name: parsed.name ?? null,
        passwordHash,
        role: UserRole.USER,
      },
      select: { id: true, email: true },
    });

    return apiSuccess(
      { registered: true },
      { message: "Account created successfully", status: 201 },
    );
  } catch (error) {
    return handleRouteError(error);
  }
}
