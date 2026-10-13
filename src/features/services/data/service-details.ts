import type { ServiceDetail, ServiceFeature } from "../services.types";
import { diseaseInformation } from "./details/disease-information";
import { drugInformation } from "./details/drug-information";
import { healthcareSeoContent } from "./details/healthcare-seo-content";
import { medicalCommunications } from "./details/medical-communications";
import { medicalDeviceContent } from "./details/medical-device-content";
import { medicalWebsiteContent } from "./details/medical-website-content";

const serviceDetails: readonly ServiceDetail[] = [
  medicalWebsiteContent,
  diseaseInformation,
  drugInformation,
  medicalDeviceContent,
  medicalCommunications,
  healthcareSeoContent,
];

export function getServiceDetail(slug: string): ServiceDetail | undefined {
  return serviceDetails.find((detail) => detail.slug === slug);
}

export function getServiceDetailSlugs(): string[] {
  return serviceDetails.map((detail) => detail.slug);
}

/** Source: VMED RESEARCH.docx — "Our Service Workflow". */
export const serviceWorkflow: readonly ServiceFeature[] = [
  { title: "Understand", description: "Understand your topic, audience, objectives, and requirements." },
  { title: "Research", description: "Review relevant medical literature and authoritative information." },
  { title: "Structure", description: "Develop a logical and reader-friendly content framework." },
  { title: "Write", description: "Create clear and professionally structured content." },
  { title: "Fact-Check", description: "Review important medical and scientific information." },
  { title: "Reference", description: "Include appropriate references according to project requirements." },
  { title: "Finalize", description: "Complete quality review and prepare the final content." },
];
