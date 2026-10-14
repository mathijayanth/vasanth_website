import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

type Feature = { title: string; description?: string };

type FeatureGridProps = {
  items: readonly Feature[];
  columns?: 2 | 3 | 4;
  /** "number" shows 01, 02…; "check" shows a tick; "none" shows no marker. */
  marker?: "number" | "check" | "none";
  className?: string;
};

const columnClasses = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
} as const;

export function FeatureGrid({ items, columns = 3, marker = "number", className }: FeatureGridProps) {
  return (
    <ul className={cn("grid gap-5", columnClasses[columns], className)}>
      {items.map((item, index) => (
        <Reveal
          as="li"
          key={item.title}
          index={index % 4}
          className="group relative overflow-hidden rounded-3xl border border-transparent bg-card p-6 shadow-soft transition-all duration-500 hover:-translate-y-1 hover:border-accent/60 hover:shadow-card"
        >
          <span
            aria-hidden
            className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-primary to-accent transition-transform duration-500 group-hover:scale-x-100"
          />
          {marker === "number" ? (
            <span className="text-sm font-bold text-transparent [-webkit-text-stroke:1px_var(--primary)] sm:text-3xl">
              {String(index + 1).padStart(2, "0")}
            </span>
          ) : null}
          {marker === "check" ? (
            <span className="inline-flex size-9 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
              <svg aria-hidden viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M3.5 8.5l3 3 6-7" />
              </svg>
            </span>
          ) : null}
          <h3 className={cn("text-lg font-bold tracking-tight text-primary", marker !== "none" && "mt-4")}>
            {item.title}
          </h3>
          {item.description ? (
            <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>
          ) : null}
        </Reveal>
      ))}
    </ul>
  );
}
