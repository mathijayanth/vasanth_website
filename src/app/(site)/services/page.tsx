import type { Metadata } from "next";
import Link from "next/link";
import { CtaBanner, PageHero, ProcessSteps, SectionHeader } from "@/components/layout";
import { Reveal } from "@/components/ui";
import { homeCta, servicesIntro } from "@/features/company";
import { ServiceCard, ServiceIcon, serviceSummaries, serviceWorkflow } from "@/features/services";

export const metadata: Metadata = {
  title: "Services",
  description: servicesIntro.body,
};

const container = "mx-auto max-w-6xl px-4 sm:px-6 lg:px-8";

export default function ServicesPage() {
  return (
    <main className="flex-1">
      <PageHero overline="Services" title={servicesIntro.title} lead={servicesIntro.body}>
        <Link
          href="/contact"
          className="inline-flex min-h-12 items-center rounded-full bg-primary px-7 font-semibold text-white shadow-elevated transition-transform duration-300 hover:-translate-y-0.5 hover:bg-secondary"
        >
          Start a Project
        </Link>
      </PageHero>

      <section className={`${container} pb-20`}>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {serviceSummaries.map((service, index) => (
            <Reveal as="li" key={service.slug} index={index % 3}>
              <ServiceCard service={service} />
            </Reveal>
          ))}
        </ul>
      </section>

      <section className="border-y border-border bg-card/60 py-20">
        <div className={`${container} space-y-8`}>
          {serviceSummaries.map((service, index) => (
            <Reveal
              as="article"
              key={service.slug}
              variant={index % 2 === 0 ? "left" : "up"}
              className="scroll-mt-28 overflow-hidden rounded-[2rem] border border-border bg-card shadow-card"
            >
              <div id={service.slug} className="grid gap-8 p-8 sm:p-10 lg:grid-cols-[1fr_1.2fr]">
                <div>
                  <div className="flex items-center gap-4">
                    <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-primary text-white shadow-soft">
                      <ServiceIcon name={service.icon} className="size-7" />
                    </span>
                    <span className="font-mono text-sm font-semibold text-muted">{service.number}</span>
                  </div>
                  <h2 className="mt-6 text-2xl font-bold tracking-tight">{service.name}</h2>
                  <p className="mt-2 font-semibold text-primary">{service.tagline}</p>
                  <p className="mt-4 leading-relaxed text-muted">{service.description}</p>
                  {service.closing ? <p className="mt-3 leading-relaxed text-muted">{service.closing}</p> : null}
                  <Link
                    href={service.hasDetailPage ? `/services/${service.slug}` : `/contact?service=${service.slug}`}
                    className="group mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary"
                  >
                    {service.hasDetailPage ? "Explore this service" : "Discuss your requirements"}
                    <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </Link>
                </div>
                <div>
                  <p className="text-overline">Services Include</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {service.includes.map((item) => (
                      <li
                        key={item}
                        className="rounded-full border border-border bg-background px-3.5 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-primary/30 hover:text-primary"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className={`${container} py-20`}>
        <SectionHeader align="center" overline="Our Service Workflow" title="From Requirement to Final Content" />
        <ProcessSteps className="mt-12" steps={serviceWorkflow} />
      </section>

      <CtaBanner title={homeCta.title} body={homeCta.body} primary={homeCta.primary} />
    </main>
  );
}
