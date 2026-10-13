import { pingDatabase } from "@/server/db/health.repository";
import { withErrorHandling } from "@/server/http/handle-error";
import { apiError, apiSuccess } from "@/server/http/response";

export const dynamic = "force-dynamic";

export const GET = withErrorHandling(async () => {
  const databaseUp = await pingDatabase();
  if (!databaseUp) {
    return apiError("INTERNAL_ERROR", "Service unavailable", 503);
  }
  return apiSuccess({ status: "ok", database: "up" });
});
