import { redirect } from "next/navigation";
import { Card, CardDescription, CardTitle } from "@/components/ui";
import { canManageCategories } from "@/features/auth/permissions";
import { getSessionUser } from "@/features/auth/server/session";

export default async function AdminCategoriesPage() {
  const user = await getSessionUser();
  if (!user || !canManageCategories(user.role)) {
    redirect("/admin");
  }

  return (
    <main className="mx-auto max-w-4xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-title">Manage categories</h1>
      <Card className="mt-8">
        <CardTitle>Categories API</CardTitle>
        <CardDescription>
          Create categories via `POST /api/categories` (ADMIN and EDITOR only).
        </CardDescription>
      </Card>
    </main>
  );
}
