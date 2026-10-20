import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout";
import {
  ServiceDetailView,
  ServiceIcon,
  buildFaqJsonLd,
  getServiceDetail,
  getServiceDetailSlugs,
  getServiceSummary,
} from "@/features/services";

export const dynamicParams = false;

export function generateStaticParams() {
  return getServiceDetailSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceSummary(slug);
  if (!service) return {};
  return { title: service.name, description: service.summary };
}

export default async function ServiceDetailPage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = getServiceSummary(slug);
  const detail = getServiceDetail(slug);
  if (!service || !detail) notFound();

  const jsonLd = JSON.stringify(buildFaqJsonLd(detail.faqs)).replace(/</g, "\\u003c");

  return (
    <main className="flex-1">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />

      <PageHero overline={`Service ${service.number}`} title={service.name} lead={detail.intro}>
        <div className="flex flex-col items-center gap-6">
          <span className="inline-flex size-16 animate-float items-center justify-center rounded-3xl bg-primary text-white shadow-elevated">
            <ServiceIcon name={service.icon} className="size-8" />
          </span>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href={`/contact?service=${service.slug}`}
              className="inline-flex min-h-12 items-center rounded-full bg-primary px-7 font-semibold text-white shadow-elevated transition-transform duration-300 hover:-translate-y-0.5 hover:bg-secondary"
            >
              Request a Quote
            </Link>
            <Link
              href="/services"
              className="inline-flex min-h-12 items-center rounded-full border border-border bg-card px-7 font-semibold text-foreground shadow-soft transition-colors hover:text-primary"
            >
              All Services
            </Link>
          </div>
        </div>
      </PageHero>

      <ServiceDetailView service={service} detail={detail} />
    </main>
  );
}
