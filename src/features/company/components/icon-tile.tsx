import type { ReactNode } from "react";
import { PageLink as Link } from "@/components/ui/page-link";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

type IconTileProps = {
  href?: string;
  title: string;
  description?: string;
  icon: ReactNode;
  index?: number;
  className?: string;
};

export function IconTile({ href, title, description, icon, index = 0, className }: IconTileProps) {
  const inner = (
    <>
      <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
        {icon}
      </span>
      <span className="mt-4 block text-base font-bold tracking-tight text-primary">{title}</span>
      {description ? <span className="mt-1.5 block text-sm leading-relaxed text-muted">{description}</span> : null}
    </>
  );

  const classes = cn(
    "group flex h-full flex-col rounded-3xl border border-transparent bg-card p-6 text-left shadow-soft transition-all duration-300",
    "hover:-translate-y-1 hover:border-accent/60 hover:shadow-card",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
    className,
  );

  return (
    <Reveal as="li" index={index % 4} className="h-full">
      {href ? (
        <Link href={href} className={classes}>
          {inner}
        </Link>
      ) : (
        <div className={classes}>{inner}</div>
      )}
    </Reveal>
  );
}
