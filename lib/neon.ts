import { neon, neonConfig, NeonQueryFunction } from "@neondatabase/serverless";

/**
 * Lollipop Cake Shop — Neon PostgreSQL Serverless Helper
 * High-performance, resilient serverless SQL access using @neondatabase/serverless
 */

// Configure resilient DNS lookup & Undici fetch agent only in Node.js server environment
let undiciAgent: any = null;

if (typeof window === "undefined") {
  try {
    // Dynamically require Node-specific modules in server environment to avoid client bundling errors
    const dns = require("dns");
    const { Agent, fetch: undiciFetch } = require("undici");

    // Fallback public DNS resolver for Windows/ISP environments where deep AWS subdomains fail to resolve
    const publicDnsResolver = new dns.Resolver();
    publicDnsResolver.setServers(["8.8.8.8", "1.1.1.1"]);

    const resilientDnsLookup = (
      hostname: string,
      options: any,
      callback: (err: any, address?: any, family?: number) => void
    ) => {
      if (typeof options === "function") {
        callback = options;
        options = {};
      }

      // 1. Try local OS DNS resolver first
      dns.lookup(hostname, options, (err: any, address: any, family?: number) => {
        if (!err && address) {
          return callback(null, address, family);
        }

        // 2. If OS resolver returns ENOTFOUND or errors on regional Neon subdomain, fallback to public DNS
        publicDnsResolver.resolve4(hostname, (resErr: any, addresses?: string[]) => {
          if (!resErr && addresses && addresses.length > 0) {
            if (options && options.all) {
              return callback(null, addresses.map((a: string) => ({ address: a, family: 4 })));
            }
            return callback(null, addresses[0], 4);
          }
          callback(err || resErr);
        });
      });
    };

    undiciAgent = new Agent({
      connect: {
        lookup: resilientDnsLookup,
        timeout: 30000, // 30s connection timeout absorbs Neon cold-start wakeups comfortably
      },
      headersTimeout: 30000,
      bodyTimeout: 30000,
      keepAliveTimeout: 30000,
    });

    if (typeof neonConfig !== "undefined" && neonConfig) {
      // Custom fetch function binding resilient agent
      neonConfig.fetchFunction = (url: string, init?: any) => {
        return undiciFetch(url, {
          ...init,
          dispatcher: undiciAgent!,
        });
      };
    }
  } catch {
    // Edge runtime or fallback
  }
}

/**
 * Clean and normalize database connection string for Neon serverless HTTP fetch
 */
export function normalizeNeonConnectionString(url: string): string {
  return url
    .trim()
    .replace(/^["']|["']$/g, "")
    .replace("&channel_binding=require", "")
    .replace("?channel_binding=require", "");
}

/**
 * Get Neon Serverless SQL template function instance
 */
export function getNeonSql(): NeonQueryFunction<false, false> | null {
  const rawUrl = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;
  
  if (!rawUrl) {
    return null;
  }

  try {
    const cleanUrl = normalizeNeonConnectionString(rawUrl);
    return neon(cleanUrl);
  } catch (error) {
    console.error("❌ [Neon PostgreSQL] Initialization error:", error);
    return null;
  }
}

/**
 * Execute a raw SQL query safely with automatic retry on cold-start or network latency
 */
export async function executeNeonQuery<T = any>(
  queryFn: (sql: NeonQueryFunction<false, false>) => Promise<T>,
  fallbackValue?: T,
  retries = 2
): Promise<T | undefined> {
  const sql = getNeonSql();
  if (!sql) {
    return fallbackValue;
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await queryFn(sql);
    } catch (error: any) {
      if (attempt === retries) {
        console.error(`❌ [Neon PostgreSQL] Query failed after ${retries} attempts:`, error?.message || error);
        return fallbackValue;
      }
      // Brief pause to allow compute endpoint to complete waking up
      await new Promise((r) => setTimeout(r, 600 * attempt));
    }
  }
  return fallbackValue;
}

