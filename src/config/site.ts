import type { NavLink } from "@/types";

/** Public, client-safe site configuration. Secrets belong in `./env`. */
export const siteConfig = {
  name: "VitalNotes",
  title: "VitalNotes | Your Health, Better Understood",
  description:
    "Evidence-based health information written and reviewed by healthcare professionals.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
} as const;

export const primaryNavLinks: NavLink[] = [
  { href: "/articles", label: "Articles" },
  { href: "/topics", label: "Topics" },
  { href: "/authors", label: "Experts" },
  { href: "/research", label: "Research" },
  { href: "/about", label: "About" },
];

export const footerNav = {
  about: [
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ],
  topics: [
    { href: "/topics/heart-health", label: "Heart Health" },
    { href: "/topics/diabetes", label: "Diabetes" },
    { href: "/topics/nutrition", label: "Nutrition" },
    { href: "/topics/mental-health", label: "Mental Health" },
  ],
  articles: [
    { href: "/articles", label: "All articles" },
    { href: "/research", label: "Research" },
  ],
  legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms" },
    { href: "/disclaimer", label: "Medical Disclaimer" },
  ],
} as const;

export const socialLinks = [
  { href: "https://linkedin.com", label: "LinkedIn" },
  { href: "https://x.com", label: "X (Twitter)" },
  { href: "https://instagram.com", label: "Instagram" },
] as const;
