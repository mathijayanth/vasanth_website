import { Skeleton } from "@/components/ui";
import { cn } from "@/lib/utils";

export function ArticleCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-card shadow-card",
        className,
      )}
      aria-hidden
    >
      <Skeleton className="aspect-[16/10] w-full rounded-none" />
      <div className="space-y-3 p-5 sm:p-6">
        <div className="flex gap-2">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-16" />
        </div>
        <Skeleton className="h-6 w-[85%]" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[70%]" />
        <div className="flex items-center gap-3 border-t border-border pt-4">
          <Skeleton className="size-9 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </div>
    </div>
  );
}

type ArticleGridSkeletonProps = {
  count?: number;
  className?: string;
};

export function ArticleGridSkeleton({
  count = 6,
  className,
}: ArticleGridSkeletonProps) {
  return (
    <ul
      className={cn(
        "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3",
        className,
      )}
      aria-hidden
    >
      {Array.from({ length: count }).map((_, index) => (
        <li key={index}>
          <ArticleCardSkeleton />
        </li>
      ))}
    </ul>
  );
}

export function ArticlesPageSkeleton() {
  return (
    <main className="mx-auto max-w-6xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
      <Skeleton className="h-10 w-64 max-w-full" />
      <Skeleton className="mt-4 h-5 w-full max-w-xl" />
      <Skeleton className="mt-8 h-40 w-full rounded-2xl" />
      <Skeleton className="mt-10 h-8 w-48" />
      <ArticleGridSkeleton className="mt-6" />
    </main>
  );
}
