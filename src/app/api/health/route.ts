import { env } from "@/config/env";
import { pingDatabase } from "@/server/db/health.repository";
import { withErrorHandling } from "@/server/http/handle-error";
import { getRateLimitBackend } from "@/server/http/rate-limit";
import { apiError, apiSuccess } from "@/server/http/response";

export const dynamic = "force-dynamic";

export const GET = withErrorHandling(async () => {
  if (env.uiPreview) {
    return apiSuccess({ status: "ok", database: "disabled", rateLimit: getRateLimitBackend() });
  }
  const databaseUp = await pingDatabase();
  if (!databaseUp) {
    return apiError("SERVICE_UNAVAILABLE", "Service unavailable", 503);
  }
  return apiSuccess({ status: "ok", database: "up", rateLimit: getRateLimitBackend() });
});
