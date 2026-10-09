import Link from "next/link";
import { footerNav, socialLinks } from "@/config/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <p className="font-serif text-lg font-semibold">
              Vital<span className="text-secondary">Notes</span>
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Better questions, better health — a modern editorial experience for
              clinician-reviewed articles.
            </p>
            <ul className="mt-4 flex flex-wrap gap-3">
              {socialLinks.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <FooterColumn title="About" links={footerNav.about} />
          <FooterColumn title="Topics" links={footerNav.topics} />
          <FooterColumn title="Articles" links={footerNav.articles} />
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
          <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted">
            {footerNav.legal.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-foreground">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="text-xs text-muted">© {year} VitalNotes. All rights reserved.</p>
        </div>

        <p className="mt-6 text-xs leading-relaxed text-muted">
          Medical disclaimer: Content on VitalNotes is for general informational
          purposes only and does not constitute medical advice. Always seek the
          guidance of a qualified health provider with questions about a medical
          condition.
        </p>
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
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      <ul className="mt-3 space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
