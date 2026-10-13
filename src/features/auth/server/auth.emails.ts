import "server-only";
import { escapeHtml } from "@/lib/utils";
import { sendMail } from "@/server/email/mailer";

export function sendPasswordResetEmail(to: string, resetUrl: string) {
  const text = [
    "We received a request to reset your VitalNotes password.",
    "",
    "Open this link to choose a new password (expires in 1 hour):",
    resetUrl,
    "",
    "If you did not request this, you can ignore this email.",
  ].join("\n");

  const html = `
    <p>We received a request to reset your VitalNotes password.</p>
    <p><a href="${escapeHtml(resetUrl)}">Reset your password</a> (link expires in 1 hour).</p>
    <p>If you did not request this, you can ignore this email.</p>
  `.trim();

  return sendMail({ to, subject: "Reset your VitalNotes password", text, html });
}
