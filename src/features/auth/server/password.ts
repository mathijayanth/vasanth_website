import "server-only";
import { compare, hash } from "bcryptjs";
import { BCRYPT_ROUNDS } from "../auth.constants";

export function hashPassword(plain: string): Promise<string> {
  return hash(plain, BCRYPT_ROUNDS);
}

export function verifyPassword(plain: string, passwordHash: string): Promise<boolean> {
  return compare(plain, passwordHash);
}
