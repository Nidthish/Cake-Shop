import { neon, neonConfig, NeonQueryFunction } from "@neondatabase/serverless";

/**
 * Lollipop Cake Shop — Neon Serverless Database Helper
 * Configures direct serverless SQL access using @neondatabase/serverless
 */

// Route queries directly to host /sql to prevent DNS ENOTFOUND on regional api subdomains
if (typeof neonConfig !== "undefined" && neonConfig) {
  neonConfig.fetchEndpoint = (host: string) => `https://${host}/sql`;
}

export function normalizeNeonConnectionString(url: string): string {
  return url
    .replace("-pooler.", ".")
    .replace("&channel_binding=require", "")
    .replace("?channel_binding=require", "");
}

export function getNeonSql(): NeonQueryFunction<false, false> | null {
  const rawUrl = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;
  
  if (!rawUrl) {
    return null;
  }

  try {
    const cleanUrl = normalizeNeonConnectionString(rawUrl);
    return neon(cleanUrl);
  } catch (error) {
    console.error("Neon connection initialization error:", error);
    return null;
  }
}

/**
 * Execute a raw SQL query safely with optional fallback
 */
export async function executeNeonQuery<T = any>(
  queryFn: (sql: NeonQueryFunction<false, false>) => Promise<T>,
  fallbackValue?: T
): Promise<T | undefined> {
  const sql = getNeonSql();
  if (!sql) {
    return fallbackValue;
  }

  try {
    return await queryFn(sql);
  } catch (error) {
    console.error("Neon SQL Query Execution Failed:", error);
    return fallbackValue;
  }
}
