import { registerSchema } from "@/features/auth/auth.schemas";
import { register } from "@/features/auth/server/auth.service";
import { withErrorHandling } from "@/server/http/handle-error";
import { parseJsonBody } from "@/server/http/parse";
import { enforceRateLimit } from "@/server/http/rate-limit";
import { apiSuccess } from "@/server/http/response";

export const POST = withErrorHandling(async (request) => {
  enforceRateLimit(request, { bucket: "auth-register", limit: 5, windowMs: 60_000 });
  const input = await parseJsonBody(registerSchema, request);
  await register(input);
  return apiSuccess({ registered: true }, { message: "Account created successfully", status: 201 });
});
