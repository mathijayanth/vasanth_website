export type ServiceIconName =
  | "website"
  | "disease"
  | "drug"
  | "device"
  | "communications"
  | "seo"
  | "scientific";

/** One entry on the Services overview page. Every service has one. */
export type ServiceSummary = {
  slug: string;
  number: string;
  name: string;
  icon: ServiceIconName;
  tagline: string;
  /** Short card copy used on the home page and in navigation. */
  summary: string;
  description: string;
  includes: readonly string[];
  closing: string;
  /** False when only overview copy exists; links then point at its section on /services. */
  hasDetailPage: boolean;
};

export type ServiceFeature = { title: string; description: string };

export type ServiceFaq = { question: string; answer: string };

/** Full service page content, transcribed from the service's source document. */
export type ServiceDetail = {
  slug: string;
  intro: string;
  highlight: { title: string; paragraphs: readonly string[]; points: readonly string[] };
  offerings: { intro?: string; items: readonly ServiceFeature[] };
  process: readonly ServiceFeature[];
  audiences: readonly ServiceFeature[];
  standards: readonly ServiceFeature[];
  whyChoose: readonly string[];
  deliverablesIntro?: string;
  deliverables: readonly string[];
  samples: string;
  cta: { title: string; body: string };
  faqs: readonly ServiceFaq[];
};
