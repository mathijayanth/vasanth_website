import Link from "next/link";
import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative inline-flex size-9 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-primary to-secondary shadow-soft",
        className,
      )}
    >
      <svg viewBox="0 0 32 32" className="size-6 text-white" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9l6.5 14L16 15.5" />
        <path d="M16 15.5h3l2-4 2.5 8 2.5-4H27" />
      </svg>
    </span>
  );
}

export function BrandLogo({ inverted = false, className }: { inverted?: boolean; className?: string }) {
  return (
    <Link href="/" className={cn("group inline-flex items-center gap-2.5", className)} aria-label="VMed Research home">
      <BrandMark className="transition-transform duration-500 group-hover:rotate-[8deg] group-hover:scale-105" />
      <span className={cn("text-lg font-extrabold tracking-tight", inverted ? "text-white" : "text-foreground")}>
        VMed<span className={cn("font-semibold", inverted ? "text-white/70" : "text-muted")}> Research</span>
      </span>
    </Link>
  );
}
