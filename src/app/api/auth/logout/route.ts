import { apiSuccess } from "@/lib/api/response";
import { handleRouteError } from "@/lib/api/handle-error";
import { clearSessionCookie } from "@/lib/auth/session";

export async function POST() {
  try {
    await clearSessionCookie();
    return apiSuccess({ loggedOut: true }, { message: "Signed out successfully" });
  } catch (error) {
    return handleRouteError(error);
  }
}
