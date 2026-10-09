import { NextRequest, NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { apiError, apiSuccess } from "@/lib/api/response";
import { parseJsonBody } from "@/lib/api/parse";
import { getClientIp, rateLimitOrError } from "@/lib/api/rate-limit";
import { handleRouteError } from "@/lib/api/handle-error";
import { createSessionToken, setSessionCookie } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { loginSchema } from "@/lib/validations/api";

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const limited = await rateLimitOrError("auth-login", ip, 10, 60_000);
    if (limited) return limited;

    const parsed = await parseJsonBody(loginSchema, request);
    if (parsed instanceof NextResponse) return parsed;

    const user = await db.user.findUnique({
      where: { email: parsed.email.toLowerCase() },
      select: { id: true, email: true, role: true, name: true, passwordHash: true },
    });

    if (!user?.passwordHash) {
      return apiError("UNAUTHORIZED", "Invalid email or password", 401);
    }

    const valid = await compare(parsed.password, user.passwordHash);
    if (!valid) {
      return apiError("UNAUTHORIZED", "Invalid email or password", 401);
    }

    const token = await createSessionToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    if (!token) {
      return apiError(
        "INTERNAL_ERROR",
        "Authentication is not configured. Set AUTH_SECRET.",
        500,
      );
    }

    await setSessionCookie(token);

    return apiSuccess(
      { user: { id: user.id, email: user.email, role: user.role, name: user.name } },
      { message: "Signed in successfully" },
    );
  } catch (error) {
    return handleRouteError(error);
  }
}
