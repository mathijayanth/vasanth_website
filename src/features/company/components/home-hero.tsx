import Link from "next/link";
import { homeHero } from "../data/company-content";
import { siteImages } from "../lib/site-images";
import { PhotoOrb } from "./photo-orb";

export function HomeHero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 top-10 size-[22rem] rounded-full bg-accent/30 blur-3xl" />
        <div className="absolute -right-16 top-24 size-[18rem] rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-[1.15fr_0.95fr] lg:gap-16 lg:px-8 lg:pb-24 lg:pt-16">
        <div>
          <p className="animate-fade-up text-sm font-semibold leading-relaxed text-secondary">
            Evidence-Based Content. Meaningful Communication.
            <br />
            Trusted Healthcare Solutions.
          </p>
          <h1 className="mt-6 animate-fade-up text-hero text-balance text-primary [animation-delay:100ms]">
            Medical &amp; Healthcare Content That Communicates Clearly
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
              className="group inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-7 font-semibold text-white shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:bg-secondary hover:shadow-elevated"
            >
              Explore Our Services
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
            <Link
              href="/contact"
              className="inline-flex min-h-12 items-center rounded-full border border-accent bg-card px-7 font-semibold text-primary shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30"
            >
              Contact Us
            </Link>
          </div>
        </div>

        <div className="animate-fade-in [animation-delay:200ms]">
          <PhotoOrb
            src={siteImages.hero.src}
            alt={siteImages.hero.alt}
            caption={siteImages.hero.caption}
            priority
          />
        </div>
      </div>
    </section>
  );
}
