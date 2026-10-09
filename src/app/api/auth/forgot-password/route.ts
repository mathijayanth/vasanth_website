import { forgotPasswordSchema } from "@/features/auth/auth.schemas";
import { requestPasswordReset } from "@/features/auth/server/auth.service";
import { withErrorHandling } from "@/server/http/handle-error";
import { parseJsonBody } from "@/server/http/parse";
import { enforceRateLimit } from "@/server/http/rate-limit";
import { apiSuccess } from "@/server/http/response";

export const POST = withErrorHandling(async (request) => {
  enforceRateLimit(request, { bucket: "auth-forgot-password", limit: 5, windowMs: 60_000 });
  const input = await parseJsonBody(forgotPasswordSchema, request);
  const { devResetUrl } = await requestPasswordReset(input);
  return apiSuccess(devResetUrl ? { resetUrl: devResetUrl } : {}, {
    message: "If an account exists for that email, password reset instructions were sent.",
  });
});
