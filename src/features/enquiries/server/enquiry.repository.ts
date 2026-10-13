import "server-only";
import { db } from "@/server/db/client";

export type CreateEnquiryData = {
  name: string;
  organization?: string;
  email: string;
  phone?: string;
  service: string;
  details: string;
  timeline?: string;
};

export const enquiryRepository = {
  create(data: CreateEnquiryData) {
    return db.enquiry.create({ data, select: { id: true, createdAt: true } });
  },
};
