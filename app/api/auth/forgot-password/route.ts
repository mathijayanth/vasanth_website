import { NextResponse } from "next/server";
import { apiSuccess } from "@/lib/api/response";
import { parseJsonBody } from "@/lib/api/parse";
import { getClientIp, rateLimitOrError } from "@/lib/api/rate-limit";
import { handleRouteError } from "@/lib/api/handle-error";
import { buildResetPasswordUrl, createPasswordResetToken } from "@/lib/auth/password-reset";
import { db } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/email/send-mail";
import { forgotPasswordSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const limited = await rateLimitOrError("auth-forgot-password", ip, 5, 60_000);
    if (limited) return limited;

    const parsed = await parseJsonBody(forgotPasswordSchema, request);
    if (parsed instanceof NextResponse) return parsed;

    const email = parsed.email.toLowerCase();
    const user = await db.user.findUnique({
      where: { email },
      select: { id: true, email: true },
    });

    const genericMessage =
      "If an account exists for that email, password reset instructions were sent.";

    if (user) {
      const { token } = await createPasswordResetToken(user.id);
      const resetUrl = buildResetPasswordUrl(token);

      let mailResult: Awaited<ReturnType<typeof sendPasswordResetEmail>> | null =
        null;
      try {
        mailResult = await sendPasswordResetEmail(user.email, resetUrl);
      } catch (error) {
        console.error("[auth] Password reset email failed:", error);
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "EMAIL_FAILED",
              message: "Unable to send reset email. Try again later.",
            },
          },
          { status: 503 },
        );
      }

      const exposeResetUrl =
        process.env.NODE_ENV !== "production" && mailResult?.delivered === false;

      return apiSuccess(
        exposeResetUrl ? { resetUrl } : {},
        { message: genericMessage },
      );
    }

    return apiSuccess({}, { message: genericMessage });
  } catch (error) {
    return handleRouteError(error);
  }
}
