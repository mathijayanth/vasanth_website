import Link from "next/link";
import { footerNav, siteConfig } from "@/config/site";
import { footerCommitment } from "@/features/company";
import { serviceHref, serviceSummaries } from "@/features/services";
import { BrandLogo } from "./brand-logo";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-auto overflow-hidden bg-primary text-white">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-40 size-[28rem] rounded-full bg-secondary/30 blur-3xl" />
        <div className="absolute -bottom-40 -right-24 size-[26rem] rounded-full bg-accent/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <BrandLogo inverted />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">{siteConfig.tagline}</p>
            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-accent">Our Commitment</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {footerCommitment.map((value) => (
                <li
                  key={value}
                  className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/80"
                >
                  {value}
                </li>
              ))}
            </ul>
          </div>

          <FooterColumn
            title="Services"
            links={serviceSummaries.map((service) => ({ href: serviceHref(service), label: service.name }))}
          />
          <FooterColumn title="Quick Links" links={footerNav.quickLinks} />
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/60">© {year} VMed Research. All Rights Reserved.</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/60">
            {footerNav.legal.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
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
      <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{title}</h2>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="group inline-flex items-center gap-1.5 text-sm text-white/70 transition-colors hover:text-white"
            >
              <span aria-hidden className="h-px w-0 bg-accent transition-all duration-300 group-hover:w-3" />
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
