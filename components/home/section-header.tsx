import Link from "next/link";
import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  overline?: string;
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  className?: string;
};

export function SectionHeader({
  overline,
  title,
  description,
  href,
  linkLabel = "View all",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="max-w-2xl">
        {overline ? <p className="text-overline">{overline}</p> : null}
        <h2 className={cn("text-title", overline && "mt-2")}>{title}</h2>
        {description ? (
          <p className="mt-2 text-subtitle">{description}</p>
        ) : null}
      </div>
      {href ? (
        <Link
          href={href}
          className="inline-flex min-h-11 shrink-0 items-center text-sm font-semibold text-primary hover:underline"
        >
          {linkLabel} →
        </Link>
      ) : null}
    </div>
  );
}
