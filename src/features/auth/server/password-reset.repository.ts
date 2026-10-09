import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { db } from "@/server/db/client";
import { PASSWORD_RESET_TTL_MS } from "../auth.constants";

function hashResetToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/** Invalidates any outstanding tokens for the user and issues a new one. Only the hash is stored. */
export async function issuePasswordResetToken(userId: string): Promise<string> {
  const token = randomBytes(32).toString("hex");

  await db.$transaction([
    db.passwordResetToken.updateMany({
      where: { userId, usedAt: null },
      data: { usedAt: new Date() },
    }),
    db.passwordResetToken.create({
      data: {
        userId,
        tokenHash: hashResetToken(token),
        expiresAt: new Date(Date.now() + PASSWORD_RESET_TTL_MS),
      },
    }),
  ]);

  return token;
}

export async function findValidResetToken(token: string) {
  const record = await db.passwordResetToken.findUnique({
    where: { tokenHash: hashResetToken(token) },
    select: { id: true, userId: true, usedAt: true, expiresAt: true },
  });
  if (!record || record.usedAt || record.expiresAt < new Date()) return null;
  return record;
}

export async function markResetTokenUsed(id: string) {
  await db.passwordResetToken.update({ where: { id }, data: { usedAt: new Date() } });
}
