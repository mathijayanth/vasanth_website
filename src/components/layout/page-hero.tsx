import { cn } from "@/lib/utils";

type PageHeroProps = {
  overline?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
};

export function HeroBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="bg-grid mask-fade-bottom absolute inset-0" />
      <div className="absolute -left-24 -top-32 size-[30rem] animate-float rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -right-24 top-10 size-[26rem] animate-float-slow rounded-full bg-secondary/20 blur-3xl" />
    </div>
  );
}

export function PageHero({ overline, title, lead, children, className }: PageHeroProps) {
  return (
    <section className={cn("relative isolate -mt-[76px] pt-[76px]", className)}>
      <HeroBackdrop />
      <div className="mx-auto max-w-4xl px-4 pb-16 pt-14 text-center sm:px-6 sm:pb-20 sm:pt-20 lg:px-8">
        {overline ? (
          <p className="inline-flex animate-fade-up items-center gap-2 rounded-full border border-primary/15 bg-card/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-primary shadow-soft backdrop-blur">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-pulse-ring rounded-full bg-secondary" />
              <span className="relative inline-flex size-2 rounded-full bg-secondary" />
            </span>
            {overline}
          </p>
        ) : null}
        <h1 className="mt-6 animate-fade-up text-display text-balance [animation-delay:100ms]">{title}</h1>
        {lead ? (
          <p className="mx-auto mt-6 max-w-2xl animate-fade-up text-lg leading-relaxed text-muted [animation-delay:200ms]">
            {lead}
          </p>
        ) : null}
        {children ? <div className="mt-8 animate-fade-up [animation-delay:300ms]">{children}</div> : null}
      </div>
    </section>
  );
}
