import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { db } from "@/server/db/client";
import { PASSWORD_RESET_TTL_MS } from "../auth.constants";

function hashResetToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export const passwordResetRepository = {
  /** Invalidates any outstanding tokens for the user and issues a new one. Only the hash is stored. */
  async issue(userId: string): Promise<string> {
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
  },

  async findValid(token: string) {
    const record = await db.passwordResetToken.findUnique({
      where: { tokenHash: hashResetToken(token) },
      select: { id: true, userId: true, usedAt: true, expiresAt: true },
    });
    if (!record || record.usedAt || record.expiresAt < new Date()) return null;
    return record;
  },

  /**
   * In one transaction: claims the token (only if still unused and unexpired), sets the new
   * password and bumps `sessionVersion`. Returns false, changing nothing, if the token was
   * already claimed, e.g. by a concurrent request.
   */
  async complete(input: { tokenId: string; userId: string; passwordHash: string }) {
    return db.$transaction(async (tx) => {
      const claimed = await tx.passwordResetToken.updateMany({
        where: { id: input.tokenId, usedAt: null, expiresAt: { gt: new Date() } },
        data: { usedAt: new Date() },
      });
      if (claimed.count !== 1) return false;

      await tx.user.update({
        where: { id: input.userId },
        data: { passwordHash: input.passwordHash, sessionVersion: { increment: 1 } },
        select: { id: true },
      });
      return true;
    });
  },
};
