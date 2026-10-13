import Link from "next/link";
import { HeroBackdrop } from "@/components/layout";
import { ServiceIcon, serviceSummaries } from "@/features/services";
import { companyTagline, homeHero, homeIntro } from "../data/company-content";

export function HomeHero() {
  return (
    <section className="relative isolate -mt-[76px] overflow-hidden pt-[76px]">
      <HeroBackdrop />
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 pb-20 pt-14 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:px-8 lg:pb-28 lg:pt-20">
        <div>
          <p className="inline-flex animate-fade-up items-center gap-2 rounded-full border border-primary/15 bg-card/70 px-4 py-1.5 text-xs font-semibold text-primary shadow-soft backdrop-blur">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-pulse-ring rounded-full bg-secondary" />
              <span className="relative inline-flex size-2 rounded-full bg-secondary" />
            </span>
            {companyTagline}
          </p>
          <h1 className="mt-7 animate-fade-up text-hero text-balance [animation-delay:100ms]">
            Medical &amp; Healthcare Content That{" "}
            <span className="text-gradient">Communicates Clearly</span>
          </h1>
          <p className="mt-6 max-w-xl animate-fade-up text-lg leading-relaxed text-muted [animation-delay:200ms]">
            {homeHero.lead}
          </p>
          <p className="mt-4 max-w-xl animate-fade-up leading-relaxed text-muted [animation-delay:250ms]">
            {homeHero.support}
          </p>
          <div className="mt-9 flex animate-fade-up flex-wrap gap-3 [animation-delay:350ms]">
            <Link
              href="/services"
              className="group relative inline-flex min-h-12 items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-primary to-secondary px-7 font-semibold text-white shadow-elevated transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl"
            >
              Explore Our Services
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
            <Link
              href="/contact"
              className="inline-flex min-h-12 items-center rounded-full border border-border bg-card px-7 font-semibold text-foreground shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:text-primary"
            >
              Contact Us
            </Link>
          </div>
        </div>

        <HeroVisual />
      </div>
    </section>
  );
}

function HeroVisual() {
  const featured = serviceSummaries.slice(0, 6);

  return (
    <div aria-hidden className="relative mx-auto w-full max-w-md animate-fade-in [animation-delay:300ms] lg:max-w-none">
      <div className="absolute inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-br from-primary/30 to-secondary/30 blur-2xl" />

      <div className="relative rounded-[2rem] border border-white/60 bg-card/80 p-6 shadow-elevated backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-foreground">{homeIntro.approachTitle}</p>
          <span className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-error/60" />
            <span className="size-2.5 rounded-full bg-warning/60" />
            <span className="size-2.5 rounded-full bg-success/60" />
          </span>
        </div>
        <ol className="mt-5 space-y-2.5">
          {homeIntro.approach.map((step, index) => (
            <li
              key={step}
              className="flex animate-fade-up items-center gap-3 rounded-xl bg-background/80 px-3 py-2"
              style={{ animationDelay: `${450 + index * 110}ms` }}
            >
              <span className="inline-flex size-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary text-xs font-bold text-white">
                {index + 1}
              </span>
              <span className="text-sm font-semibold text-foreground">{step}</span>
              <span
                className="ml-auto h-1.5 w-16 animate-shimmer rounded-full bg-gradient-to-r from-primary/30 to-secondary/40"
                style={{ animationDelay: `${index * 300}ms` }}
              />
            </li>
          ))}
        </ol>
      </div>

      <div className="absolute -left-6 top-10 hidden animate-float rounded-2xl border border-border bg-card p-3 shadow-elevated sm:block lg:-left-10">
        <div className="grid grid-cols-3 gap-2">
          {featured.map((service) => (
            <span
              key={service.slug}
              className="inline-flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 text-primary"
            >
              <ServiceIcon name={service.icon} className="size-5" />
            </span>
          ))}
        </div>
      </div>

      <div className="absolute -bottom-6 -right-4 animate-float-slow rounded-2xl border border-border bg-card px-4 py-3 shadow-elevated">
        <p className="text-xs font-semibold uppercase tracking-wider text-secondary">Evidence-Based</p>
        <p className="mt-0.5 text-sm font-bold text-foreground">Research • Clarity • Accuracy</p>
      </div>
    </div>
  );
}
