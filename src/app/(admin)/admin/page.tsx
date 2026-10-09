import type { Metadata } from "next";
import { Card, CardDescription, CardTitle } from "@/components/ui";
import { getSessionUser } from "@/features/auth/server/session";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminHomePage() {
  const user = await getSessionUser();

  return (
    <main className="mx-auto max-w-4xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-title">Admin dashboard</h1>
      <p className="text-subtitle mt-2">
        Signed in as {user?.email}. Use the navigation above to manage content based on your role.
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <Card>
          <CardTitle>Articles</CardTitle>
          <CardDescription>Create, edit, and publish placeholder editorial content.</CardDescription>
        </Card>
        <Card>
          <CardTitle>Your role</CardTitle>
          <CardDescription>{user?.role ?? "Unknown"}</CardDescription>
        </Card>
      </div>
    </main>
  );
}
