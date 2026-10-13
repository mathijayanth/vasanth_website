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
};

export function CtaBanner({
  title,
  body,
  primary = { href: "/contact", label: "Contact Us" },
  secondary,
  className,
}: CtaBannerProps) {
  return (
    <section className={cn("mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8", className)}>
      <Reveal
        variant="scale"
        className="relative isolate overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary via-primary to-secondary bg-[length:200%_200%] px-6 py-14 text-center text-white shadow-elevated animate-gradient-pan sm:px-12 sm:py-20"
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-20 -top-20 size-72 animate-float rounded-full bg-white/15 blur-3xl" />
          <div className="absolute -bottom-24 -right-16 size-80 animate-float-slow rounded-full bg-secondary/40 blur-3xl" />
          <div className="bg-grid mask-fade-bottom absolute inset-0 opacity-40 invert" />
        </div>
        <h2 className="mx-auto max-w-3xl text-title text-balance">{title}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-white/85">{body}</p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={primary.href}
            className="group inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-7 font-semibold text-primary shadow-elevated transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl"
          >
            {primary.label}
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
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
