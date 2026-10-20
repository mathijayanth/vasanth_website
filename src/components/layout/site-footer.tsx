import Link from "next/link";
import { footerNav, siteConfig } from "@/config/site";
import { footerCommitment, homeCta } from "@/features/company";
import { serviceHref, serviceSummaries } from "@/features/services";
import { CtaBanner } from "./cta-banner";
import { BrandLogo } from "./brand-logo";
import { FooterMissionBox } from "./footer-mission-box";

const publicLegalLinks = footerNav.legal.filter((link) => link.href !== "/login");

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <div className="mt-auto border-t border-border bg-background">
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <FooterMissionBox />
        <CtaBanner
          variant="boxed"
          title={homeCta.title}
          body={homeCta.body}
          primary={homeCta.primary}
        />
      </div>

      <footer className="relative overflow-hidden bg-primary text-white">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 -top-40 size-[28rem] rounded-full bg-secondary/30 blur-3xl" />
          <div className="absolute -bottom-40 -right-24 size-[26rem] rounded-full bg-accent/20 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-[1.15fr_1fr_0.9fr_1.1fr] lg:gap-10">
            <div>
              <BrandLogo inverted />
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/75">{siteConfig.tagline}</p>
            </div>

            <div>
              <h2 className="text-sm font-bold text-white">Our Commitment</h2>
              <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-white/80">
                {footerCommitment.map((value) => (
                  <li key={value}>{value}</li>
                ))}
              </ul>
            </div>

            <FooterColumn title="Links" links={footerNav.quickLinks} />
            <FooterColumn
              title="Services"
              links={serviceSummaries.map((service) => ({ href: serviceHref(service), label: service.name }))}
            />
          </div>

          <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-white/65">© {year} VMed Research. All Rights Reserved.</p>
            <ul className="flex flex-wrap items-center gap-x-1 text-xs text-white/65">
              {publicLegalLinks.map((link, index) => (
                <li key={link.href} className="inline-flex items-center">
                  {index > 0 ? <span aria-hidden className="mx-2 text-white/35">|</span> : null}
                  <Link href={link.href} className="transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: ReadonlyArray<{ href: string; label: string }>;
}) {
  return (
    <div>
      <h2 className="text-sm font-bold text-white">{title}</h2>
      <ul className="mt-4 space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-sm text-white/75 transition-colors hover:text-white">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
