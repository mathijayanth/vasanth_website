import type { Metadata } from "next";
import Link from "next/link";
import { FeatureGrid, PageHero, SectionHeader } from "@/components/layout";
import { Reveal } from "@/components/ui";
import { ArticleGrid } from "@/features/articles";
import { getLatestArticles } from "@/features/articles/server/article.service";
import { resources } from "@/features/company";

export const metadata: Metadata = {
  title: "Resources",
  description: resources.paragraphs[0],
};

export const revalidate = 300;

const container = "mx-auto max-w-6xl px-4 sm:px-6 lg:px-8";

export default async function ResourcesPage() {
  const latestArticles = await getLatestArticles(6);

  return (
    <main className="flex-1">
      <PageHero overline="VMed Research Resources" title={resources.title} lead={resources.paragraphs[0]}>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/articles"
            className="inline-flex min-h-12 items-center rounded-full bg-gradient-to-r from-primary to-secondary px-7 font-semibold text-white shadow-elevated transition-transform duration-300 hover:-translate-y-0.5"
          >
            Explore All Resources
          </Link>
          <Link
            href="/search"
            className="inline-flex min-h-12 items-center rounded-full border border-border bg-card px-7 font-semibold text-foreground shadow-soft transition-colors hover:text-primary"
          >
            Search
          </Link>
        </div>
      </PageHero>

      <section className={`${container} pb-20`}>
        <Reveal className="mx-auto max-w-3xl text-center text-lg leading-relaxed text-muted">
          {resources.paragraphs[1]}
        </Reveal>
        <SectionHeader className="mt-16" align="center" overline="Explore Our Resources" title="Topics We Cover" />
        <FeatureGrid className="mt-12" items={resources.categories} marker="none" />
      </section>

      <section className={`${container} pb-20`}>
        <Reveal
          variant="scale"
          className="relative isolate overflow-hidden rounded-[2rem] bg-foreground p-8 text-white shadow-elevated sm:p-12"
        >
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -right-24 -top-24 size-80 animate-float rounded-full bg-primary/40 blur-3xl" />
            <div className="absolute -bottom-24 left-10 size-72 animate-float-slow rounded-full bg-secondary/30 blur-3xl" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Featured Resource</p>
          <h2 className="mt-4 max-w-3xl text-title text-balance">{resources.featured.title}</h2>
          <p className="mt-4 max-w-2xl text-xl font-semibold text-white/90">{resources.featured.body}</p>
          <p className="mt-3 max-w-2xl leading-relaxed text-white/70">{resources.featured.support}</p>
          <Link
            href="/articles"
            className="group mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-7 font-semibold text-foreground transition-transform duration-300 hover:-translate-y-0.5"
          >
            Explore All Resources
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </Reveal>
      </section>

      {latestArticles.length > 0 ? (
        <section className="border-t border-border bg-card/60 py-20">
          <div className={container}>
            <SectionHeader overline="Latest" title="Recent Articles" href="/articles" linkLabel="View all" />
            <Reveal className="mt-10">
              <ArticleGrid articles={latestArticles} />
            </Reveal>
          </div>
        </section>
      ) : null}
    </main>
  );
}
