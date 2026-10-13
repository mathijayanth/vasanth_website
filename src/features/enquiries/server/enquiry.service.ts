import "server-only";
import { env } from "@/config/env";
import { sendMail } from "@/server/email/mailer";
import { AppError } from "@/server/http/errors";
import { escapeHtml } from "@/lib/utils";
import { enquiryServiceLabel, type EnquiryInput } from "../enquiries.schemas";
import { enquiryRepository } from "./enquiry.repository";

export async function submitEnquiry(input: EnquiryInput): Promise<{ id: string } | null> {
  if (env.uiPreview) {
    throw new AppError("SERVICE_UNAVAILABLE", "Enquiries are disabled in this preview");
  }
  if (input.website) return null;

  const data = {
    name: input.name,
    organization: input.organization,
    email: input.email,
    phone: input.phone,
    service: input.service,
    details: input.details,
    timeline: input.timeline,
  };
  const enquiry = await enquiryRepository.create(data);

  await notifyInbox(enquiry.id, data).catch(() => {
    console.error("[enquiry] notification email failed for enquiry", enquiry.id);
  });

  return { id: enquiry.id };
}

async function notifyInbox(id: string, data: Omit<EnquiryInput, "website">) {
  const to = env.contactInboxEmail;
  if (!to) return;

  const rows: Array<[string, string | undefined]> = [
    ["Name", data.name],
    ["Organization", data.organization],
    ["Email", data.email],
    ["Phone", data.phone],
    ["Service", enquiryServiceLabel(data.service)],
    ["Timeline", data.timeline],
  ];
  const present = rows.filter((row): row is [string, string] => Boolean(row[1]));

  const text = [
    ...present.map(([label, value]) => `${label}: ${value}`),
    "",
    "Project details:",
    data.details,
    "",
    `Reference: ${id}`,
  ].join("\n");

  const html = `
    <h2>New website enquiry</h2>
    <table cellpadding="6">${present
      .map(([label, value]) => `<tr><th align="left">${label}</th><td>${escapeHtml(value)}</td></tr>`)
      .join("")}</table>
    <h3>Project details</h3>
    <p style="white-space:pre-wrap">${escapeHtml(data.details)}</p>
    <p style="color:#64748b">Reference: ${escapeHtml(id)}</p>`;

  await sendMail({
    to,
    subject: `New enquiry: ${enquiryServiceLabel(data.service)} from ${data.name}`.replace(/[\r\n]+/g, " "),
    text,
    html,
  });
}
