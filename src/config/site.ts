import type { NavLink } from "@/types";

/** Public, client-safe site configuration. Secrets belong in `./env`. */
export const siteConfig = {
  name: "VMed Research",
  title: "VMed Research | Medical & Healthcare Content That Communicates Clearly",
  description:
    "Scientifically accurate, reader-friendly, and purpose-driven medical and healthcare content backed by reliable medical literature and authoritative sources.",
  tagline: "Evidence-Based Medical Content & Healthcare Communication",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
} as const;

/** `/services` also opens a submenu of every service in the header. */
export const primaryNavLinks: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/resources", label: "Resources" },
  { href: "/contact", label: "Contact" },
];

export const footerNav = {
  quickLinks: [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/resources", label: "Resources / Blog" },
    { href: "/contact", label: "Contact" },
  ],
  legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms" },
    { href: "/disclaimer", label: "Medical Disclaimer" },
    { href: "/login", label: "Team login" },
  ],
} as const;
