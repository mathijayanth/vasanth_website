import "server-only";
import { env } from "@/config/env";
import { AppError, badRequest, conflict, unauthorized } from "@/server/http/errors";
import type {
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
} from "../auth.schemas";
import { sendPasswordResetEmail } from "./auth.emails";
import { hashPassword, verifyPassword } from "./password";
import {
  findValidResetToken,
  issuePasswordResetToken,
  markResetTokenUsed,
} from "./password-reset.repository";
import { startSession, type SessionUser } from "./session";
import { userRepository } from "./user.repository";

const INVALID_CREDENTIALS = "Invalid email or password";

export async function login(input: LoginInput): Promise<SessionUser> {
  const user = await userRepository.findByEmailWithPassword(input.email.toLowerCase());
  if (!user?.passwordHash) throw unauthorized(INVALID_CREDENTIALS);
  if (!(await verifyPassword(input.password, user.passwordHash))) {
    throw unauthorized(INVALID_CREDENTIALS);
  }

  const sessionUser: SessionUser = {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  };
  if (!(await startSession(sessionUser))) {
    throw new AppError("INTERNAL_ERROR", "Authentication is not configured. Set AUTH_SECRET.");
  }
  return sessionUser;
}

export async function register(input: RegisterInput): Promise<void> {
  const email = input.email.toLowerCase();
  if (await userRepository.emailExists(email)) {
    throw conflict("An account with this email already exists");
  }

  await userRepository.create({
    email,
    name: input.name ?? null,
    passwordHash: await hashPassword(input.password),
    role: "USER",
  });
}

/**
 * Always resolves the same way whether or not the account exists, to avoid email enumeration.
 * Returns the reset URL only when it could not be emailed outside production (local dev).
 */
export async function requestPasswordReset(
  input: ForgotPasswordInput,
): Promise<{ devResetUrl?: string }> {
  const user = await userRepository.findIdByEmail(input.email.toLowerCase());
  if (!user) return {};

  const token = await issuePasswordResetToken(user.id);
  const resetUrl = `${env.appUrl}/reset-password?token=${encodeURIComponent(token)}`;

  let delivered: boolean;
  try {
    delivered = (await sendPasswordResetEmail(user.email, resetUrl)).delivered;
  } catch (error) {
    console.error("[auth] Password reset email failed:", error);
    throw new AppError("EMAIL_FAILED", "Unable to send reset email. Try again later.");
  }

  return !delivered && env.nodeEnv !== "production" ? { devResetUrl: resetUrl } : {};
}

export async function resetPassword(input: ResetPasswordInput): Promise<void> {
  const record = await findValidResetToken(input.token);
  if (!record) throw badRequest("Invalid or expired reset token");

  await userRepository.updatePassword(record.userId, await hashPassword(input.password));
  await markResetTokenUsed(record.id);
}
