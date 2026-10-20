import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

type CtaAction = { href: string; label: string };

type CtaBannerProps = {
  title: string;
  body: string;
  primary?: CtaAction;
  secondary?: CtaAction;
  className?: string;
  /** Full-width strip (legacy) vs rounded card above the footer. */
  variant?: "strip" | "boxed";
};

function LeafWatermark() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 120 120"
      className="pointer-events-none absolute -bottom-4 -right-2 size-28 text-white/10 sm:size-32"
      fill="currentColor"
    >
      <path d="M95 18c-8 22-28 38-52 42 24-2 44-18 52-42-14 6-26 16-34 28 8-12 20-22 34-28zM70 72c-10 14-24 24-40 28 16-4 30-14 40-28-8 4-14 10-18 18 4-8 10-14 18-18z" />
    </svg>
  );
}

export function CtaBanner({
  title,
  body,
  primary = { href: "/contact", label: "Contact Us" },
  secondary,
  className,
  variant = "boxed",
}: CtaBannerProps) {
  const isBoxed = variant === "boxed";

  return (
    <section
      className={cn(
        isBoxed
          ? "relative overflow-hidden rounded-2xl bg-primary shadow-elevated"
          : "bg-primary",
        className,
      )}
    >
      <LeafWatermark />
      <Reveal
        className={cn(
          "relative grid items-center gap-6 px-6 py-8 sm:px-8 lg:grid-cols-[1.05fr_1fr_auto] lg:gap-8 lg:py-10",
          !isBoxed && "mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-14",
        )}
      >
        <h2 className="text-title text-balance text-white">{title}</h2>
        <p className="text-base leading-relaxed text-white/85 sm:text-lg">{body}</p>
        <div className="flex flex-wrap items-center gap-3 lg:justify-end">
          <Link
            href={primary.href}
            className="group inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-7 font-semibold text-primary shadow-soft transition-all duration-300 hover:-translate-y-0.5"
          >
            {primary.label}
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
          {secondary ? (
            <Link
              href={secondary.href}
              className="inline-flex min-h-12 items-center rounded-full border border-white/40 px-7 font-semibold text-white transition-colors duration-300 hover:bg-white/10"
            >
              {secondary.label}
            </Link>
          ) : null}
        </div>
      </Reveal>
    </section>
  );
}
