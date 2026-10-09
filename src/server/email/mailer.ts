import "server-only";
import { env } from "@/config/env";

export type SendMailInput = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

export type SendMailResult =
  | { delivered: true; provider: "resend" }
  | { delivered: false; provider: "log" };

/**
 * Sends transactional mail when configured (Resend). Otherwise logs in non-production.
 */
export async function sendMail(input: SendMailInput): Promise<SendMailResult> {
  const { from, resendApiKey: resendKey } = env.email;

  if (resendKey && from) {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [input.to],
        subject: input.subject,
        text: input.text,
        html: input.html,
      }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.error("[email] Resend error:", response.status, detail);
      throw new Error("Unable to send email");
    }

    return { delivered: true, provider: "resend" };
  }

  if (!env.isProduction) {
    console.info("[dev] Email not configured — message preview:");
    console.info(`  To: ${input.to}`);
    console.info(`  Subject: ${input.subject}`);
    console.info(`  ${input.text}`);
  }

  return { delivered: false, provider: "log" };
}
