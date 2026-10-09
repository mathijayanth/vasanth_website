import { Card, CardDescription, CardTitle } from "@/components/ui";

export default function AdminArticlesPage() {
  return (
    <main className="mx-auto max-w-4xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-title">Manage articles</h1>
      <Card className="mt-8">
        <CardTitle>Editor coming soon</CardTitle>
        <CardDescription>
          Use the REST API (`POST /api/articles`) with your session cookie until the admin editor UI ships.
        </CardDescription>
      </Card>
    </main>
  );
}
