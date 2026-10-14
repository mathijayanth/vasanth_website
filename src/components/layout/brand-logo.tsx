import { PageLink as Link } from "@/components/ui/page-link";
import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative inline-flex size-9 items-center justify-center overflow-hidden rounded-full bg-primary text-white shadow-soft",
        className,
      )}
    >
      <svg viewBox="0 0 32 32" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 9l8 14 8-14" />
      </svg>
    </span>
  );
}

export function BrandLogo({ inverted = false, className }: { inverted?: boolean; className?: string }) {
  return (
    <Link href="/" className={cn("group inline-flex items-center gap-2.5", className)} aria-label="VMed Research home">
      <BrandMark className="transition-transform duration-500 group-hover:scale-105" />
      <span className={cn("text-lg font-extrabold tracking-tight", inverted ? "text-white" : "text-primary")}>
        VMed<span className={cn("font-semibold", inverted ? "text-white/75" : "text-secondary")}> Research</span>
      </span>
    </Link>
  );
}
