import type { Metadata } from "next";
import { PageHero } from "@/components/layout";
import { env } from "@/config/env";
import { Reveal } from "@/components/ui";
import { contact } from "@/features/company";
import { EnquiryForm } from "@/features/enquiries";
import { enquiryServiceOptions } from "@/features/enquiries/enquiries.schemas";

export const metadata: Metadata = {
  title: "Contact",
  description: contact.lead,
};

export default async function ContactPage({ searchParams }: PageProps<"/contact">) {
  const { service } = await searchParams;
  const defaultService = typeof service === "string" ? service : undefined;

  return (
    <main className="flex-1">
      <PageHero overline="Contact" title={contact.title} lead={contact.lead} />

      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <Reveal variant="scale" className="relative rounded-[2rem] border border-border bg-card p-6 shadow-elevated sm:p-10">
            <h2 className="text-2xl font-bold tracking-tight">{contact.formTitle}</h2>
            <p className="mt-2 text-muted">{contact.support}</p>
            <div className="mt-8">
              <EnquiryForm defaultService={defaultService} disabled={env.uiPreview} />
            </div>
          </Reveal>

          <div className="space-y-6">
            <Reveal index={1} className="relative isolate overflow-hidden rounded-[2rem] bg-primary p-8 text-white shadow-elevated">
              <div aria-hidden className="absolute -right-16 -top-16 -z-10 size-56 animate-float rounded-full bg-primary/50 blur-3xl" />
              <div aria-hidden className="absolute -bottom-20 -left-10 -z-10 size-56 animate-float-slow rounded-full bg-secondary/40 blur-3xl" />
              <h2 className="text-xl font-bold">{contact.asideTitle}</h2>
              <p className="mt-3 leading-relaxed text-white/75">{contact.asideBody}</p>
              <div className="mt-8 border-t border-white/10 pt-6">
                <p className="font-bold">VMed Research</p>
                <p className="mt-1 text-sm text-white/70">{contact.descriptor}</p>
                <p className="mt-4 text-sm font-semibold text-secondary">{contact.motto}</p>
              </div>
            </Reveal>

            <Reveal index={2} className="rounded-[2rem] border border-border bg-card p-8 shadow-card">
              <h2 className="text-overline">What do you need?</h2>
              <ul className="mt-4 space-y-2.5">
                {enquiryServiceOptions.map((option) => (
                  <li key={option.value} className="flex items-center gap-3 text-sm font-medium text-foreground">
                    <span aria-hidden className="size-1.5 rounded-full bg-accent" />
                    {option.label}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}
