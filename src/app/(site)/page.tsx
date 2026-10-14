import { PageLink as Link } from "@/components/ui/page-link";
import { CtaBanner, ProcessSteps, SectionHeader } from "@/components/layout";
import { Reveal } from "@/components/ui";
import { ArticleGrid } from "@/features/articles";
import { getLatestArticles } from "@/features/articles/server/article.service";
import {
  HomeHero,
  MissionVision,
  audiencesServed,
  homeCta,
  homeIntro,
  whyVmed,
} from "@/features/company";
import { AudienceIcon, WhyIcon } from "@/features/company/components/audience-icon";
import { IconTile } from "@/features/company/components/icon-tile";
import { PhotoOrb } from "@/features/company/components/photo-orb";
import { siteImages } from "@/features/company/lib/site-images";
import { ServiceIcon, serviceHref, serviceSummaries } from "@/features/services";

export const revalidate = 300;

const container = "mx-auto max-w-6xl px-4 sm:px-6 lg:px-8";

export default async function HomePage() {
  const latestArticles = await getLatestArticles(3);

  return (
    <main className="flex-1">
      <HomeHero />

      <section className={`${container} py-16 lg:py-20`}>
        <SectionHeader
          align="center"
          title={homeIntro.approachTitle}
          description="Evidence-Based · Research · Clarity · Accuracy"
        />
        <ProcessSteps
          className="mt-12"
          steps={homeIntro.approach.map((title) => ({ title }))}
        />
      </section>

      <section className="py-16 lg:py-20">
        <div className={container}>
          <SectionHeader
            overline="What We Do"
            title="Our Services"
            href="/services"
            linkLabel="View All Services"
          />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {serviceSummaries.map((service, index) => (
              <IconTile
                key={service.slug}
                href={serviceHref(service)}
                title={service.name}
                icon={<ServiceIcon name={service.icon} className="size-6" />}
                index={index}
              />
            ))}
          </ul>
        </div>
      </section>

      <section className={`${container} py-16 lg:py-24`}>
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <Reveal variant="left">
            <h2 className="text-display text-balance text-primary">{homeIntro.title}</h2>
            <p className="mt-5 text-xl font-semibold text-foreground">{homeIntro.lead}</p>
            <div className="mt-4 space-y-4 leading-relaxed text-muted">
              {homeIntro.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <Link
              href="/about"
              className="group mt-8 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary"
            >
              Know our work
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </Reveal>
          <Reveal index={1}>
            <PhotoOrb src={siteImages.intro.src} alt={siteImages.intro.alt} caption={siteImages.intro.caption} />
          </Reveal>
        </div>
      </section>

      <section className={`${container} py-16 lg:py-20`}>
        <SectionHeader
          align="center"
          overline="Who We Serve"
          title="Partnering Across Healthcare & Life Sciences"
        />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {audiencesServed.map((audience, index) => (
            <IconTile
              key={audience.title}
              title={audience.title}
              icon={<AudienceIcon title={audience.title} />}
              index={index}
            />
          ))}
        </ul>
      </section>

      <section className="bg-card/50 py-16 lg:py-20">
        <div className={container}>
          <SectionHeader
            align="center"
            overline="Why VMed Research?"
            title="Medical Understanding Meets Professional Writing"
          />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {whyVmed.map((item, index) => (
              <IconTile
                key={item.title}
                title={item.title}
                description={item.description}
                icon={<WhyIcon title={item.title} />}
                index={index}
              />
            ))}
          </ul>
        </div>
      </section>

      <section className={`${container} py-16 lg:py-20`}>
        <MissionVision />
      </section>

      {latestArticles.length > 0 ? (
        <section className="border-t border-border py-16">
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

      <CtaBanner title={homeCta.title} body={homeCta.body} primary={homeCta.primary} />
    </main>
  );
}
