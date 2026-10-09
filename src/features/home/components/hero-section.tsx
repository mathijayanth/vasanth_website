import Image from "next/image";
import { ButtonLink } from "@/components/ui";
import { heroVisual } from "../data/homepage-data";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-card via-background to-background">
      <div className="pointer-events-none absolute -right-20 top-0 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-2 lg:items-center lg:gap-12 lg:px-8 lg:py-24">
        <div>
          <p className="text-overline">Evidence-informed editorial</p>
          <h1 className="text-display mt-4">Your Health, Better Understood.</h1>
          <p className="text-subtitle mt-6 max-w-xl">
            Evidence-based health information written and reviewed by healthcare
            professionals.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <ButtonLink href="/articles">Explore Articles</ButtonLink>
            <ButtonLink href="/topics" variant="secondary">
              Explore Topics
            </ButtonLink>
          </div>
          <p className="mt-6 max-w-lg text-caption">
            Placeholder content for demonstration — not individualized medical
            advice.
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-border bg-card shadow-elevated sm:aspect-[5/6]">
            <Image
              src={heroVisual.imageUrl}
              alt={heroVisual.imageAlt}
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 540px"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-4 left-4 right-4 rounded-2xl border border-border bg-card/95 p-4 shadow-card backdrop-blur sm:left-6 sm:right-auto sm:max-w-xs">
            <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
              Medically reviewed workflow
            </p>
            <p className="mt-1 text-sm text-muted">
              Clinician-authored articles with clear context and citations — coming
              with the content platform.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
