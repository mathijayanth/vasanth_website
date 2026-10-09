type SendMailInput = {
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
  const from = process.env.EMAIL_FROM;
  const resendKey = process.env.RESEND_API_KEY;

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

  if (process.env.NODE_ENV !== "production") {
    console.info("[dev] Email not configured — message preview:");
    console.info(`  To: ${input.to}`);
    console.info(`  Subject: ${input.subject}`);
    console.info(`  ${input.text}`);
  }

  return { delivered: false, provider: "log" };
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  const subject = "Reset your VitalNotes password";
  const text = [
    "We received a request to reset your VitalNotes password.",
    "",
    `Open this link to choose a new password (expires in 1 hour):`,
    resetUrl,
    "",
    "If you did not request this, you can ignore this email.",
  ].join("\n");

  const html = `
    <p>We received a request to reset your VitalNotes password.</p>
    <p><a href="${resetUrl}">Reset your password</a> (link expires in 1 hour).</p>
    <p>If you did not request this, you can ignore this email.</p>
  `.trim();

  return sendMail({ to, subject, text, html });
}
