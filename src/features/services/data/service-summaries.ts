import type { ServiceSummary } from "../services.types";

/** Source: Content_for_blog/VMED RESEARCH.docx — "SERVICES" and "What We Do" sections. */
export const serviceSummaries: readonly ServiceSummary[] = [
  {
    slug: "medical-website-content",
    number: "01",
    name: "Medical Website Content",
    icon: "website",
    tagline: "Professional Healthcare Content for a Stronger Digital Presence",
    summary:
      "Professional and patient-friendly website content for healthcare organizations, hospitals, clinics, doctors, and healthcare businesses.",
    description:
      "We develop structured website content that helps healthcare organizations communicate their services, expertise, and information clearly.",
    includes: [
      "Healthcare website content",
      "Hospital website content",
      "Clinic website content",
      "Doctor profile content",
      "Treatment pages",
      "Disease pages",
      "Patient education pages",
      "Medical blogs",
      "Landing pages",
      "Country-based healthcare content",
      "Service pages",
      "FAQs",
      "About Us pages",
      "Healthcare specialty pages",
      "Department pages",
      "Procedure and treatment content",
    ],
    closing: "",
    hasDetailPage: true,
  },
  {
    slug: "disease-information",
    number: "02",
    name: "Disease Information",
    icon: "disease",
    tagline: "Evidence-Based Health & Disease Content",
    summary:
      "Evidence-based content covering diseases and health conditions, including symptoms, causes, diagnosis, treatment, risk factors, prevention, and related information.",
    description:
      "We develop structured disease and condition content designed to explain medical information clearly to the intended audience.",
    includes: [
      "Disease overview",
      "Definition",
      "Causes",
      "Signs and symptoms",
      "Risk factors",
      "Diagnosis",
      "Treatment",
      "Prevention",
      "Complications",
      "Patient education",
      "Frequently asked questions",
      "Healthcare awareness content",
    ],
    closing:
      "Our objective is to communicate disease-related information in a way that is clear, informative, structured, and supported by appropriate research.",
    hasDetailPage: true,
  },
  {
    slug: "drug-information",
    number: "03",
    name: "Drug Information",
    icon: "drug",
    tagline: "Clear & Scientifically Accurate Medication Content",
    summary:
      "Scientifically accurate drug content covering indications, mechanisms of action, safety information, precautions, and patient education requirements.",
    description:
      "We develop drug-related content that presents important information in a structured and reader-friendly format.",
    includes: [
      "Drug overview",
      "Generic and brand information",
      "Indications and uses",
      "Mechanism of action",
      "Dosage-related information",
      "Precautions",
      "Contraindications",
      "Adverse effects",
      "Drug interactions",
      "Safety information",
      "Patient education",
      "Frequently asked questions",
    ],
    closing:
      "The content scope can be adapted according to the intended audience, project requirements, and applicable source information.",
    hasDetailPage: true,
  },
  {
    slug: "medical-device-content",
    number: "04",
    name: "Medical Device Content",
    icon: "device",
    tagline: "Informative Content for Medical Devices & Healthcare Technologies",
    summary:
      "Clear and informative content for medical devices, including product descriptions, educational materials, and healthcare communications.",
    description:
      "We create clear and informative content that helps audiences understand medical devices and healthcare technologies.",
    includes: [
      "Medical device website content",
      "Product descriptions",
      "Device information",
      "Product education materials",
      "Patient education content",
      "Healthcare professional content",
      "Medical device blogs",
      "Product landing pages",
      "FAQs",
      "Educational communications",
    ],
    closing:
      "Our focus is on communicating device-related information clearly while maintaining an appropriate medical and professional tone.",
    hasDetailPage: true,
  },
  {
    slug: "medical-communications",
    number: "05",
    name: "Medical Communications",
    icon: "communications",
    tagline: "Communicating Healthcare Information With Purpose",
    summary:
      "Educational materials, healthcare campaigns, presentations, articles, and communication assets designed for clear and effective communication.",
    description:
      "We develop medical communication materials for different audiences and healthcare communication objectives.",
    includes: [
      "Healthcare campaigns",
      "Disease awareness content",
      "Patient education materials",
      "Medical articles",
      "Healthcare blogs",
      "Medical brochures",
      "Educational materials",
      "Medical presentations",
      "Healthcare communication assets",
      "Medical marketing content",
    ],
    closing: "",
    hasDetailPage: true,
  },
  {
    slug: "healthcare-seo-content",
    number: "06",
    name: "Healthcare SEO Content",
    icon: "seo",
    tagline: "Healthcare Content Designed for People & Search",
    summary:
      "Search-focused healthcare content designed around relevant topics, user intent, readability, and digital visibility while maintaining medical content quality.",
    description:
      "We develop healthcare SEO content that combines medical information with search-focused content development.",
    includes: [
      "Healthcare keyword research",
      "Search intent analysis",
      "SEO medical blogs",
      "Disease SEO pages",
      "Treatment pages",
      "Healthcare service pages",
      "Landing pages",
      "Meta titles",
      "Meta descriptions",
      "FAQ content",
      "AEO-focused content structure",
      "Internal linking recommendations",
      "Existing content optimization",
      "Healthcare website content optimization",
    ],
    closing:
      "Our approach aims to balance search visibility, user intent, readability, and medical content quality.",
    hasDetailPage: true,
  },
  {
    slug: "scientific-clinical-content",
    number: "07",
    name: "Scientific & Clinical Content",
    icon: "scientific",
    tagline: "Research-Driven Content for Scientific Audiences",
    summary:
      "Research-based scientific and clinical content for healthcare and life science requirements.",
    description:
      "We develop research-based scientific and clinical content for healthcare and life science requirements.",
    includes: [
      "Scientific articles",
      "Literature-based content",
      "Literature reviews",
      "Research summaries",
      "Clinical research content",
      "Abstracts",
      "Simplified abstracts",
      "Case-based content",
      "Scientific presentations",
      "Scientific posters",
      "Graphical abstracts",
      "Research documentation",
    ],
    closing:
      "Our process emphasizes literature research, evidence verification, scientific clarity, logical structure, and appropriate referencing.",
    hasDetailPage: false,
  },
];

export function getServiceSummary(slug: string): ServiceSummary | undefined {
  return serviceSummaries.find((service) => service.slug === slug);
}

export function serviceHref(service: ServiceSummary): string {
  return service.hasDetailPage ? `/services/${service.slug}` : `/services#${service.slug}`;
}
