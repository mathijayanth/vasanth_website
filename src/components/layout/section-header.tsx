import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  overline?: string;
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  align?: "start" | "center";
  className?: string;
};

export function SectionHeader({
  overline,
  title,
  description,
  href,
  linkLabel = "View all",
  align = "start",
  className,
}: SectionHeaderProps) {
  const centered = align === "center";

  return (
    <Reveal
      className={cn(
        "flex flex-col gap-4",
        centered ? "items-center text-center" : "sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className={cn("max-w-2xl", centered && "mx-auto")}>
        {overline ? (
          <p className={cn("inline-flex items-center gap-2 text-overline", centered && "justify-center")}>
            <span aria-hidden className="h-px w-6 bg-gradient-to-r from-transparent to-secondary" />
            {overline}
            {centered ? (
              <span aria-hidden className="h-px w-6 bg-gradient-to-l from-transparent to-secondary" />
            ) : null}
          </p>
        ) : null}
        <h2 className={cn("text-title text-primary", overline && "mt-3")}>{title}</h2>
        {description ? <p className="mt-3 text-subtitle">{description}</p> : null}
      </div>
      {href ? (
        <Link
          href={href}
          className="group inline-flex min-h-11 shrink-0 items-center gap-1.5 text-sm font-semibold text-primary"
        >
          {linkLabel}
          <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </Link>
      ) : null}
    </Reveal>
  );
}
