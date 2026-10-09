import { getAuthor } from "@/features/authors/server/author.service";
import { withErrorHandling } from "@/server/http/handle-error";
import { apiSuccess } from "@/server/http/response";

type RouteContext = { params: Promise<{ id: string }> };

export const GET = withErrorHandling<RouteContext>(async (_request, context) => {
  const { id } = await context.params;
  return apiSuccess(await getAuthor(id));
});
