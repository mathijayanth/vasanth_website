import { PageLink as Link } from "@/components/ui/page-link";
import { cn } from "@/lib/utils";
import type { TopicSummary } from "../category.types";

type TopicCardProps = {
  topic: TopicSummary;
  className?: string;
};

export function TopicCard({ topic, className }: TopicCardProps) {
  return (
    <Link
      href={`/articles?category=${topic.slug}`}
      className={cn(
        "group flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-soft transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-secondary/40 hover:shadow-card sm:p-6",
        className,
      )}
    >
      <span className="text-overline">{topic.name}</span>
      <p className="mt-3 text-sm leading-relaxed text-muted group-hover:text-foreground/80">
        {topic.description}
      </p>
      <span className="mt-4 text-sm font-semibold text-primary">Explore →</span>
    </Link>
  );
}

type TopicGridProps = {
  topics: TopicSummary[];
};

export function TopicGrid({ topics }: TopicGridProps) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {topics.map((topic) => (
        <li key={topic.slug}>
          <TopicCard topic={topic} />
        </li>
      ))}
    </ul>
  );
}
