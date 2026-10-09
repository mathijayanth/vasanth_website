import type { Metadata } from "next";
import { notFound } from "next/navigation";

type AuthorPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: slug.replace(/-/g, " "),
  };
}

export default async function AuthorDetailPage({ params }: AuthorPageProps) {
  const { slug } = await params;
  if (!slug) notFound();

  return (
    <main className="mx-auto max-w-3xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl font-semibold capitalize tracking-tight">
        {slug.replace(/-/g, " ")}
      </h1>
      <p className="mt-6 text-muted">Author profile placeholder.</p>
    </main>
  );
}
