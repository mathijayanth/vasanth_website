import type { Metadata } from "next";
import { FeatureGrid, PageHero, ProcessSteps, SectionHeader } from "@/components/layout";
import { Reveal } from "@/components/ui";
import { MissionVision, about, coreValues, whyVmed } from "@/features/company";

export const metadata: Metadata = {
  title: "About",
  description: about.paragraphs[0],
};

const container = "mx-auto max-w-6xl px-4 sm:px-6 lg:px-8";

export default function AboutPage() {
  return (
    <main className="flex-1">
      <PageHero overline="About VMed Research" title={about.title} lead={about.paragraphs[0]} />

      <section className={`${container} pb-20`}>
        <div className="grid gap-10 lg:grid-cols-2">
          <Reveal className="space-y-4 text-lg leading-relaxed text-muted">
            {about.paragraphs.slice(1).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Reveal>
          <Reveal
            index={1}
            variant="scale"
            className="relative overflow-hidden rounded-[2rem] border border-border bg-card p-8 shadow-card"
          >
            <div aria-hidden className="absolute -right-16 -top-16 size-48 rounded-full bg-secondary/15 blur-3xl" />
            <h2 className="relative text-2xl font-bold tracking-tight text-primary">{about.belief.title}</h2>
            <p className="relative mt-3 leading-relaxed text-muted">{about.belief.body}</p>
            <p className="relative mt-5 font-semibold text-foreground">{about.belief.lead}</p>
            <ul className="relative mt-4 flex flex-wrap gap-2">
              {about.belief.qualities.map((quality) => (
                <li
                  key={quality}
                  className="rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 px-4 py-1.5 text-sm font-semibold text-primary"
                >
                  {quality}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-border bg-card/60 py-20">
        <div className={container}>
          <SectionHeader
            align="center"
            overline={about.strength.title}
            title="Medical Understanding + Professional Content Development"
            description={about.strength.paragraphs.join(" ")}
          />
          <ProcessSteps className="mt-12" steps={about.process.steps.map((title) => ({ title }))} />
          <Reveal className="mx-auto mt-10 max-w-2xl text-center text-muted">{about.process.note}</Reveal>
        </div>
      </section>

      <section className={`${container} py-20`}>
        <SectionHeader align="center" overline="Our Focus Areas" title="Where We Support Healthcare Communication" />
        <ul className="mx-auto mt-10 flex max-w-4xl flex-wrap justify-center gap-3">
          {about.focusAreas.map((area, index) => (
            <Reveal
              as="li"
              key={area}
              index={index % 6}
              variant="scale"
              className="rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground shadow-soft transition-colors hover:border-primary/30 hover:text-primary"
            >
              {area}
            </Reveal>
          ))}
        </ul>
      </section>

      <section className="bg-gradient-to-b from-primary/5 to-background py-20">
        <div className={container}>
          <SectionHeader align="center" overline="Why VMed Research?" title="What Sets Our Work Apart" />
          <FeatureGrid className="mt-12" items={whyVmed} />
        </div>
      </section>

      <section className={`${container} py-20`}>
        <MissionVision />
        <div className="mt-20">
          <SectionHeader align="center" overline="Core Values" title="Accuracy • Evidence • Clarity • Integrity • Quality • Trust" />
          <FeatureGrid className="mt-12" items={coreValues} marker="none" />
        </div>
        <Reveal className="mx-auto mt-16 max-w-3xl space-y-4 text-center text-lg leading-relaxed text-muted">
          <p className="text-overline">Our Commitment</p>
          {about.commitment.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <p className="pt-2 text-xl font-semibold text-foreground">
            <span className="text-gradient">Our goal:</span> {about.goal}
          </p>
        </Reveal>
      </section>

    </main>
  );
}
