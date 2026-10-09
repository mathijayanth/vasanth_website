import { redirect } from "next/navigation";
import { Card, CardDescription, CardTitle } from "@/components/ui";
import { canManageAuthors } from "@/lib/auth/permissions";
import { getSessionUser } from "@/lib/auth/session";

export default async function AdminAuthorsPage() {
  const user = await getSessionUser();
  if (!user || !canManageAuthors(user.role)) {
    redirect("/admin");
  }

  return (
    <main className="mx-auto max-w-4xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-title">Manage authors</h1>
      <Card className="mt-8">
        <CardTitle>Author profiles</CardTitle>
        <CardDescription>
          Author profile management UI will connect to the database in a later phase.
        </CardDescription>
      </Card>
    </main>
  );
}
