import type mysql from "mysql2/promise";

/**
 * Local MySQL connection has been disabled per user request.
 * The application operates entirely on Neon Postgres / Prisma & in-memory store.
 */
export function getMySqlPool(): mysql.Pool | null {
  return null;
}
