import { newsletterSchema } from "@/features/newsletter/newsletter.schemas";
import { subscribe } from "@/features/newsletter/server/newsletter.service";
import { withErrorHandling } from "@/server/http/handle-error";
import { parseJsonBody } from "@/server/http/parse";
import { enforceRateLimit } from "@/server/http/rate-limit";
import { apiSuccess } from "@/server/http/response";

export const POST = withErrorHandling(async (request) => {
  enforceRateLimit(request, { bucket: "newsletter-subscribe", limit: 5, windowMs: 60_000 });
  const input = await parseJsonBody(newsletterSchema, request);
  await subscribe(input);
  return apiSuccess({ subscribed: true }, { message: "Subscribed successfully", status: 201 });
});
