import { apiError } from "@/lib/api/response";

export function handleRouteError(error: unknown) {
  console.error(error);
  return apiError("INTERNAL_ERROR", "An unexpected error occurred", 500);
}
