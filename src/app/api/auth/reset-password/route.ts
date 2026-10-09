import { resetPasswordSchema } from "@/features/auth/auth.schemas";
import { resetPassword } from "@/features/auth/server/auth.service";
import { withErrorHandling } from "@/server/http/handle-error";
import { parseJsonBody } from "@/server/http/parse";
import { enforceRateLimit } from "@/server/http/rate-limit";
import { apiSuccess } from "@/server/http/response";

export const POST = withErrorHandling(async (request) => {
  enforceRateLimit(request, { bucket: "auth-reset-password", limit: 10, windowMs: 60_000 });
  const input = await parseJsonBody(resetPasswordSchema, request);
  await resetPassword(input);
  return apiSuccess({ reset: true }, { message: "Password updated successfully" });
});
