import "server-only";
import { db } from "@/server/db/client";

export const newsletterRepository = {
  async upsertActive(email: string) {
    await db.newsletterSubscriber.upsert({
      where: { email },
      create: { email, status: "ACTIVE" },
      update: { status: "ACTIVE", unsubscribedAt: null },
    });
  },
};
