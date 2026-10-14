import { PageLink as Link } from "@/components/ui/page-link";
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
    <section className={cn("bg-primary", className)}>
      <Reveal className="mx-auto grid max-w-6xl items-center gap-6 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_1fr_auto] lg:px-8 lg:py-14">
        <h2 className="text-title text-balance text-white">{title}</h2>
        <p className="text-lg leading-relaxed text-white/80">{body}</p>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={primary.href}
            className="group inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-7 font-semibold text-primary shadow-soft transition-all duration-300 hover:-translate-y-0.5"
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
