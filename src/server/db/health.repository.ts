import "server-only";
import { db } from "./client";

export async function pingDatabase(): Promise<boolean> {
  try {
    await db.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error("[health] Database ping failed:", error);
    return false;
  }
}
