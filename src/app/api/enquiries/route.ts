import { enquirySchema } from "@/features/enquiries/enquiries.schemas";
import { submitEnquiry } from "@/features/enquiries/server/enquiry.service";
import { withErrorHandling } from "@/server/http/handle-error";
import { parseJsonBody } from "@/server/http/parse";
import { enforceRateLimit } from "@/server/http/rate-limit";
import { apiSuccess } from "@/server/http/response";

export const POST = withErrorHandling(async (request) => {
  await enforceRateLimit(request, { bucket: "enquiry-submit", limit: 5, windowMs: 10 * 60_000 });
  const input = await parseJsonBody(enquirySchema, request);
  await submitEnquiry(input);
  return apiSuccess(
    { received: true },
    { message: "Thank you. We have received your enquiry.", status: 201 },
  );
});
