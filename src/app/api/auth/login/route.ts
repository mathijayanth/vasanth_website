import { loginSchema } from "@/features/auth/auth.schemas";
import { login } from "@/features/auth/server/auth.service";
import { withErrorHandling } from "@/server/http/handle-error";
import { parseJsonBody } from "@/server/http/parse";
import { enforceRateLimit } from "@/server/http/rate-limit";
import { apiSuccess } from "@/server/http/response";

export const POST = withErrorHandling(async (request) => {
  enforceRateLimit(request, { bucket: "auth-login", limit: 10, windowMs: 60_000 });
  const input = await parseJsonBody(loginSchema, request);
  const user = await login(input);
  return apiSuccess({ user }, { message: "Signed in successfully" });
});
