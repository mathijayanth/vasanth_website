import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { apiError, apiSuccess } from "@/lib/api/response";
import { parseJsonBody } from "@/lib/api/parse";
import { getClientIp, rateLimitOrError } from "@/lib/api/rate-limit";
import { handleRouteError } from "@/lib/api/handle-error";
import {
  consumePasswordResetToken,
  markPasswordResetTokenUsed,
} from "@/lib/auth/password-reset";
import { db } from "@/lib/db";
import { resetPasswordSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const limited = await rateLimitOrError("auth-reset-password", ip, 10, 60_000);
    if (limited) return limited;

    const parsed = await parseJsonBody(resetPasswordSchema, request);
    if (parsed instanceof NextResponse) return parsed;

    const record = await consumePasswordResetToken(parsed.token);
    if (!record) {
      return apiError("BAD_REQUEST", "Invalid or expired reset token", 400);
    }

    const passwordHash = await hash(parsed.password, 12);
    await db.user.update({
      where: { id: record.userId },
      data: { passwordHash },
    });
    await markPasswordResetTokenUsed(record.id);

    return apiSuccess({ reset: true }, { message: "Password updated successfully" });
  } catch (error) {
    return handleRouteError(error);
  }
}
