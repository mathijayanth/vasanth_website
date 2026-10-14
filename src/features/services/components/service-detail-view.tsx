import Link from "next/link";
import { FeatureGrid, ProcessSteps, SectionHeader } from "@/components/layout";
import { Accordion, Reveal } from "@/components/ui";
import { serviceHref, serviceSummaries } from "../data/service-summaries";
import type { ServiceDetail, ServiceSummary } from "../services.types";
import { ServiceIcon } from "./service-icon";

const container = "mx-auto max-w-6xl px-4 sm:px-6 lg:px-8";

function CheckList({ items, columns = 1 }: { items: readonly string[]; columns?: 1 | 2 }) {
  return (
    <ul className={columns === 2 ? "grid gap-3 sm:grid-cols-2" : "space-y-3"}>
      {items.map((item, index) => (
        <Reveal as="li" key={item} index={index % 6} variant="left" className="flex items-start gap-3">
          <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-white">
            <svg aria-hidden viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M3.5 8.5l3 3 6-7" />
            </svg>
          </span>
          <span className="text-foreground">{item}</span>
        </Reveal>
      ))}
    </ul>
  );
}

export function ServiceDetailView({ service, detail }: { service: ServiceSummary; detail: ServiceDetail }) {
  const others = serviceSummaries.filter((item) => item.slug !== service.slug);
  const contactHref = `/contact?service=${service.slug}`;

  return (
    <>
      <section className={`${container} pb-20`}>
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-start">
          <Reveal variant="left">
            <p className="text-overline">Overview</p>
            <h2 className="mt-3 text-title">{detail.highlight.title}</h2>
            <div className="mt-5 space-y-4 text-lg leading-relaxed text-muted">
              {detail.highlight.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </Reveal>
          <Reveal index={1} variant="scale" className="rounded-[2rem] border border-border bg-card p-8 shadow-card">
            <CheckList items={detail.highlight.points} />
          </Reveal>
        </div>
      </section>

      <section className="border-y border-border bg-card/60 py-20">
        <div className={container}>
          <SectionHeader align="center" overline="What We Offer" title={`Our ${service.name} Services`} description={detail.offerings.intro} />
          <FeatureGrid className="mt-12" items={detail.offerings.items} />
        </div>
      </section>

      <section className={`${container} py-20`}>
        <SectionHeader align="center" overline="Our Process" title="How We Develop Your Content" />
        <ProcessSteps className="mt-12" steps={detail.process} />
      </section>

      <section className="bg-gradient-to-b from-primary/5 to-background py-20">
        <div className={container}>
          <SectionHeader align="center" overline="Who We Serve" title="Built for the People Who Rely on It" />
          <FeatureGrid className="mt-12" items={detail.audiences} columns={detail.audiences.length % 4 === 0 ? 4 : 3} marker="check" />
        </div>
      </section>

      <section className={`${container} py-20`}>
        <SectionHeader align="center" overline="Quality Standards" title="Our Content Standards" />
        <FeatureGrid className="mt-12" items={detail.standards} marker="none" />
      </section>

      <section className="border-y border-border bg-card/60 py-20">
        <div className={`${container} grid gap-12 lg:grid-cols-2`}>
          <div>
            <SectionHeader overline="Why Choose Us" title="Why Choose VMed Research" />
            <div className="mt-8">
              <CheckList items={detail.whyChoose} />
            </div>
          </div>
          <div>
            <SectionHeader overline="Deliverables" title="What You Receive" description={detail.deliverablesIntro} />
            <div className="mt-8">
              <CheckList items={detail.deliverables} columns={2} />
            </div>
          </div>
        </div>
      </section>

      <section className={`${container} py-20`}>
        <Reveal
          variant="scale"
          className="flex flex-col items-start gap-6 rounded-[2rem] border border-dashed border-primary/30 bg-primary/5 p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10"
        >
          <div className="max-w-2xl">
            <p className="text-overline">Sample Work</p>
            <p className="mt-2 text-lg leading-relaxed text-foreground">{detail.samples}</p>
          </div>
          <Link
            href={contactHref}
            className="inline-flex min-h-12 shrink-0 items-center rounded-full border border-primary/30 bg-card px-6 font-semibold text-primary shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-elevated"
          >
            View Sample Work
          </Link>
        </Reveal>
      </section>

      <section className="bg-card/60 py-20">
        <div className={`${container} max-w-4xl`}>
          <SectionHeader align="center" overline="FAQ" title="Frequently Asked Questions" />
          <Reveal className="mt-10">
            <Accordion items={detail.faqs} />
          </Reveal>
        </div>
      </section>

      <section className={`${container} py-20`}>
        <SectionHeader overline="Explore More" title="Other Services" href="/services" linkLabel="All services" />
        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((item, index) => (
            <Reveal as="li" key={item.slug} index={index % 3}>
              <Link
                href={serviceHref(item)}
                className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-elevated"
              >
                <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 text-primary transition-colors group-hover:from-primary group-hover:to-secondary group-hover:text-white">
                  <ServiceIcon name={item.icon} className="size-5" />
                </span>
                <span className="font-semibold text-foreground">{item.name}</span>
                <span aria-hidden className="ml-auto text-primary transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </section>
    </>
  );
}

export function buildFaqJsonLd(faqs: ServiceDetail["faqs"]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}
