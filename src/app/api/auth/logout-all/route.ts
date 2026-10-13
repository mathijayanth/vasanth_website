import { logoutEverywhere } from "@/features/auth/server/auth.service";
import { endSession, requireUser } from "@/features/auth/server/session";
import { withErrorHandling } from "@/server/http/handle-error";
import { apiSuccess } from "@/server/http/response";

export const POST = withErrorHandling(async () => {
  const user = await requireUser();
  await logoutEverywhere(user);
  await endSession();
  return apiSuccess({ loggedOut: true }, { message: "Signed out on all devices" });
});
