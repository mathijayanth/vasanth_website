import { endSession } from "@/features/auth/server/session";
import { withErrorHandling } from "@/server/http/handle-error";
import { apiSuccess } from "@/server/http/response";

export const POST = withErrorHandling(async () => {
  await endSession();
  return apiSuccess({ loggedOut: true }, { message: "Signed out successfully" });
});
