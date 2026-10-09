import "server-only";
import type { NewsletterInput } from "../newsletter.schemas";
import { newsletterRepository } from "./newsletter.repository";

export async function subscribe(input: NewsletterInput): Promise<void> {
  await newsletterRepository.upsertActive(input.email.toLowerCase());
}
