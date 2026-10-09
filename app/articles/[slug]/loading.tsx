import { Skeleton } from "@/components/ui";

export default function ArticleDetailLoading() {
  return (
    <div className="mx-auto max-w-6xl flex-1 px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
      <Skeleton className="h-4 w-64 max-w-full" />
      <Skeleton className="mt-6 h-10 w-full max-w-2xl" />
      <Skeleton className="mt-4 h-5 w-full max-w-xl" />
      <Skeleton className="mt-8 aspect-[16/9] w-full rounded-3xl" />
      <div className="mt-10 lg:grid lg:grid-cols-[15rem_1fr] lg:gap-12">
        <Skeleton className="hidden h-64 rounded-2xl lg:block" />
        <div className="space-y-4">
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[83%]" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[80%]" />
        </div>
      </div>
    </div>
  );
}
