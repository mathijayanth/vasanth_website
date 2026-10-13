import "server-only";
import type { UserRole } from "@prisma/client";
import { db } from "@/server/db/client";

const sessionUserSelect = {
  id: true,
  email: true,
  role: true,
  name: true,
  sessionVersion: true,
} as const;

export const userRepository = {
  findSessionUser(id: string) {
    return db.user.findUnique({ where: { id }, select: sessionUserSelect });
  },

  findByEmailWithPassword(email: string) {
    return db.user.findUnique({
      where: { email },
      select: { ...sessionUserSelect, passwordHash: true },
    });
  },

  findIdByEmail(email: string) {
    return db.user.findUnique({ where: { email }, select: { id: true, email: true } });
  },

  async emailExists(email: string) {
    return Boolean(await db.user.findUnique({ where: { email }, select: { id: true } }));
  },

  async create(data: { email: string; name: string | null; passwordHash: string; role: UserRole }) {
    await db.user.create({ data, select: { id: true } });
  },

  /** Atomic increment: revokes every session token issued for the user. */
  async incrementSessionVersion(id: string) {
    await db.user.update({
      where: { id },
      data: { sessionVersion: { increment: 1 } },
      select: { id: true },
    });
  },
};
