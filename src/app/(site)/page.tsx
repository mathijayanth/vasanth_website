import { CtaBanner, FeatureGrid, ProcessSteps, SectionHeader } from "@/components/layout";
import { Reveal } from "@/components/ui";
import { ArticleGrid } from "@/features/articles";
import { getLatestArticles } from "@/features/articles/server/article.service";
import {
  HomeHero,
  MissionVision,
  ServicesMarquee,
  audiencesServed,
  coreValues,
  homeCta,
  homeIntro,
  whyVmed,
} from "@/features/company";
import { ServiceCard, serviceSummaries } from "@/features/services";

export const revalidate = 300;

const container = "mx-auto max-w-6xl px-4 sm:px-6 lg:px-8";

export default async function HomePage() {
  const latestArticles = await getLatestArticles(3);

  return (
    <main className="flex-1">
      <HomeHero />
      <ServicesMarquee />

      <section className={`${container} py-20 lg:py-28`}>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <Reveal variant="left">
            <p className="text-overline">Healthcare Communication</p>
            <h2 className="mt-3 text-display text-balance">{homeIntro.title}</h2>
          </Reveal>
          <Reveal index={1} className="space-y-4 text-lg leading-relaxed text-muted">
            <p className="text-xl font-semibold text-foreground">{homeIntro.lead}</p>
            {homeIntro.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Reveal>
        </div>

        <div className="mt-20">
          <SectionHeader
            align="center"
            overline="How we work"
            title={homeIntro.approachTitle}
            description={homeIntro.approachNote}
          />
          <ProcessSteps
            className="mt-12"
            steps={homeIntro.approach.map((title) => ({ title }))}
          />
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-border bg-card/60 py-20 lg:py-28">
        <div className={container}>
          <SectionHeader overline="What We Do" title="Our Services" href="/services" linkLabel="View All Services" />
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {serviceSummaries
              .filter((service) => service.hasDetailPage)
              .map((service, index) => (
                <Reveal as="li" key={service.slug} index={index % 3}>
                  <ServiceCard service={service} />
                </Reveal>
              ))}
          </ul>
        </div>
      </section>

      <section className={`${container} py-20 lg:py-28`}>
        <SectionHeader align="center" overline="Who We Serve" title="Partnering Across Healthcare & Life Sciences" />
        <FeatureGrid className="mt-12" items={audiencesServed} columns={4} marker="check" />
      </section>

      <section className="relative isolate overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background py-20 lg:py-28">
        <div className={container}>
          <SectionHeader align="center" overline="Why VMed Research?" title="Medical Understanding Meets Professional Writing" />
          <FeatureGrid className="mt-12" items={whyVmed} columns={3} />
        </div>
      </section>

      <section className={`${container} py-20 lg:py-24`}>
        <MissionVision />
        <div className="mt-20">
          <SectionHeader align="center" overline="Core Values" title="What Guides Every Project" />
          <FeatureGrid className="mt-12" items={coreValues} columns={3} marker="none" />
        </div>
      </section>

      {latestArticles.length > 0 ? (
        <section className="border-t border-border bg-card/60 py-20">
          <div className={container}>
            <SectionHeader
              overline="Resources"
              title="Latest Insights"
              href="/resources"
              linkLabel="Explore Resources"
            />
            <Reveal className="mt-10">
              <ArticleGrid articles={latestArticles} />
            </Reveal>
          </div>
        </section>
      ) : null}

      <CtaBanner
        title={homeCta.title}
        body={homeCta.body}
        primary={homeCta.primary}
        secondary={{ href: "/services", label: "Explore Our Services" }}
      />
    </main>
  );
}
