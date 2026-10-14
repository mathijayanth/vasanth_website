import { PageLink as Link } from "@/components/ui/page-link";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <p className="text-sm font-medium uppercase tracking-widest text-secondary">
        404
      </p>
      <h1 className="font-serif text-3xl font-semibold">Page not found</h1>
      <p className="max-w-md text-muted">
        The page you are looking for does not exist or may have moved.
      </p>
      <Link
        href="/"
        className="min-h-11 rounded-xl border border-border bg-card px-5 py-3 text-sm font-medium shadow-soft"
      >
        Back to home
      </Link>
    </main>
  );
}
