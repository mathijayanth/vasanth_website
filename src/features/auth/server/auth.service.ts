import "server-only";
import { env } from "@/config/env";
import { AppError, badRequest, conflict, unauthorized } from "@/server/http/errors";
import { consumeRateLimit, resetRateLimit } from "@/server/http/rate-limit";
import type {
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
} from "../auth.schemas";
import { sendPasswordResetEmail } from "./auth.emails";
import { hashPassword, verifyPassword } from "./password";
import { passwordResetRepository } from "./password-reset.repository";
import { startSession, type SessionUser } from "./session";
import { userRepository } from "./user.repository";

const INVALID_CREDENTIALS = "Invalid email or password";
const INVALID_RESET_TOKEN = "Invalid or expired reset token";

export const LOGIN_EMAIL_BUCKET = "auth-login-email";
export const LOGIN_EMAIL_LIMIT = { limit: 5, windowMs: 15 * 60_000 };
export const FORGOT_PASSWORD_EMAIL_BUCKET = "auth-forgot-password-email";
export const FORGOT_PASSWORD_EMAIL_LIMIT = { limit: 3, windowMs: 60 * 60_000 };

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

let dummyPasswordHash: Promise<string> | undefined;

/** Unknown emails still pay for a bcrypt comparison, so response time does not reveal accounts. */
function getDummyPasswordHash(): Promise<string> {
  dummyPasswordHash ??= hashPassword("timing-equalizer-not-a-real-password");
  return dummyPasswordHash;
}

/**
 * The per-email counter is incremented before the password check (race-safe under concurrent
 * attempts) and cleared on success, so it effectively counts failures: five failed attempts
 * are allowed per window and the next attempt is rejected with 429.
 */
export async function login(input: LoginInput): Promise<SessionUser> {
  const email = normalizeEmail(input.email);
  await consumeRateLimit(LOGIN_EMAIL_BUCKET, email, LOGIN_EMAIL_LIMIT);

  const user = await userRepository.findByEmailWithPassword(email);
  const passwordMatches = await verifyPassword(
    input.password,
    user?.passwordHash ?? (await getDummyPasswordHash()),
  );
  if (!user?.passwordHash || !passwordMatches) throw unauthorized(INVALID_CREDENTIALS);

  await resetRateLimit(LOGIN_EMAIL_BUCKET, email);

  const sessionUser: SessionUser = {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  };
  if (!(await startSession({ ...sessionUser, sessionVersion: user.sessionVersion }))) {
    throw new AppError("INTERNAL_ERROR", "Authentication is not configured. Set AUTH_SECRET.");
  }
  return sessionUser;
}

export async function register(input: RegisterInput): Promise<void> {
  const email = normalizeEmail(input.email);
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
 * The per-email limit is applied before the lookup for the same reason.
 * Returns the reset URL only when it could not be emailed outside production (local dev).
 */
export async function requestPasswordReset(
  input: ForgotPasswordInput,
): Promise<{ devResetUrl?: string }> {
  const email = normalizeEmail(input.email);
  await consumeRateLimit(FORGOT_PASSWORD_EMAIL_BUCKET, email, FORGOT_PASSWORD_EMAIL_LIMIT);

  const user = await userRepository.findIdByEmail(email);
  if (!user) return {};

  const token = await passwordResetRepository.issue(user.id);
  const resetUrl = `${env.appUrl}/reset-password?token=${encodeURIComponent(token)}`;

  let delivered: boolean;
  try {
    delivered = (await sendPasswordResetEmail(user.email, resetUrl)).delivered;
  } catch (error) {
    console.error("[auth] Password reset email failed:", error);
    throw new AppError("EMAIL_FAILED", "Unable to send reset email. Try again later.");
  }

  return !delivered && !env.isProduction ? { devResetUrl: resetUrl } : {};
}

/** On success the password changes and every existing session for the user is revoked. */
export async function resetPassword(input: ResetPasswordInput): Promise<void> {
  const record = await passwordResetRepository.findValid(input.token);
  if (!record) throw badRequest(INVALID_RESET_TOKEN);

  const completed = await passwordResetRepository.complete({
    tokenId: record.id,
    userId: record.userId,
    passwordHash: await hashPassword(input.password),
  });
  if (!completed) throw badRequest(INVALID_RESET_TOKEN);
}

/** Revokes every session token for the user, including the caller's. */
export async function logoutEverywhere(user: SessionUser): Promise<void> {
  await userRepository.incrementSessionVersion(user.id);
}
