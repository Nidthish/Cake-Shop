import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  // If executed in browser environment, return a dummy object to avoid browser bundle crashes
  if (typeof window !== "undefined") {
    return new Proxy({} as PrismaClient, {
      get(_target, prop) {
        if (prop === "then") return undefined;
        return () => Promise.resolve(null);
      },
    });
  }

  // Sanitize DATABASE_URL in process.env if present
  if (process.env.DATABASE_URL) {
    let sanitized = process.env.DATABASE_URL.trim().replace(/^["']|["']$/g, "");
    if (!sanitized.includes("connect_timeout=")) {
      const sep = sanitized.includes("?") ? "&" : "?";
      sanitized = `${sanitized}${sep}connect_timeout=30`;
    }
    process.env.DATABASE_URL = sanitized;
  }

  const client =
    globalForPrisma.prisma ??
    new PrismaClient({
      log: [
        {
          emit: "event",
          level: "error",
        },
      ],
    });

  // Handle connection error events cleanly if supported
  try {
    // @ts-ignore
    if (typeof client.$on === "function") {
      // @ts-ignore
      client.$on("error", (e: any) => {
        if (e?.message?.includes("10054") || e?.message?.includes("ConnectionReset")) {
          console.warn("⚠️ [Neon PostgreSQL] Connection reset by remote host. Re-establishing pool connection...");
        } else {
          console.error("❌ [Prisma Error]:", e);
        }
      });
    }
  } catch {
    // Ignore event listener setup errors
  }

  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = client;
  return client;
}

export const prisma = createPrismaClient();
