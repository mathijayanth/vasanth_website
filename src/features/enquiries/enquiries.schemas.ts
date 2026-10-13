import { z } from "zod";
import { serviceSummaries } from "@/features/services/data/service-summaries";

export const OTHER_SERVICE = "other";

export const enquiryServiceOptions = [
  ...serviceSummaries.map((service) => ({ value: service.slug, label: service.name })),
  { value: OTHER_SERVICE, label: "Other Healthcare Content Requirements" },
] as const;

const serviceValues = enquiryServiceOptions.map((option) => option.value) as [string, ...string[]];

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((value) => (value ? value : undefined));

export const enquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(120),
  organization: optionalText(160),
  email: z.string().trim().toLowerCase().email("Please enter a valid email").max(254),
  phone: optionalText(40).refine((value) => !value || /^[+\d][\d\s().-]{5,}$/.test(value), {
    message: "Please enter a valid phone number",
  }),
  service: z.enum(serviceValues, { message: "Please select a service" }),
  details: z
    .string()
    .trim()
    .min(20, "Please tell us a little more (at least 20 characters)")
    .max(5000),
  timeline: optionalText(120),
  /** Honeypot: hidden from real visitors. Filled submissions are accepted but silently dropped. */
  website: z.string().max(500).optional(),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;

export function enquiryServiceLabel(value: string): string {
  return enquiryServiceOptions.find((option) => option.value === value)?.label ?? value;
}
