import { NextRequest, NextResponse } from "next/server";

interface RateLimitRecord {
  timestamps: number[];
}

// In-memory store for sliding window rate limiting
const ipStore = new Map<string, RateLimitRecord>();

// Cleanup stale records every 5 minutes to prevent memory leaks
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of ipStore.entries()) {
      record.timestamps = record.timestamps.filter((ts) => now - ts < 600000); // keep last 10 minutes
      if (record.timestamps.length === 0) {
        ipStore.delete(key);
      }
    }
  }, 300000);
}

/**
 * Extract Client IP Address from standard proxy/CDN headers
 */
export function getClientIp(req: NextRequest): string {
  const xForwardedFor = req.headers.get("x-forwarded-for");
  if (xForwardedFor) {
    return xForwardedFor.split(",")[0].trim();
  }
  const xRealIp = req.headers.get("x-real-ip");
  if (xRealIp) return xRealIp.trim();

  const cfConnectingIp = req.headers.get("cf-connecting-ip");
  if (cfConnectingIp) return cfConnectingIp.trim();

  return "127.0.0.1";
}

export interface RateLimitConfig {
  limit: number; // max requests
  windowMs: number; // in milliseconds
  endpointKey?: string; // unique namespace
}

/**
 * Sliding Window Rate Limiter
 * Returns { allowed: boolean, remaining: number, resetMs: number, response?: NextResponse }
 */
export function rateLimit(
  req: NextRequest,
  config: RateLimitConfig
): {
  allowed: boolean;
  remaining: number;
  resetMs: number;
  response?: NextResponse;
} {
  const ip = getClientIp(req);
  const namespace = config.endpointKey || req.nextUrl.pathname;
  const key = `${namespace}:${ip}`;
  const now = Date.now();
  const windowStart = now - config.windowMs;

  let record = ipStore.get(key);
  if (!record) {
    record = { timestamps: [] };
    ipStore.set(key, record);
  }

  // Filter timestamps within current window
  record.timestamps = record.timestamps.filter((ts) => ts > windowStart);

  if (record.timestamps.length >= config.limit) {
    const oldestTimestamp = record.timestamps[0];
    const resetMs = Math.max(0, oldestTimestamp + config.windowMs - now);
    const retryAfterSec = Math.ceil(resetMs / 1000);

    const res = NextResponse.json(
      {
        success: false,
        error: "Too many requests. Please slow down and try again shortly.",
        code: "RATE_LIMIT_EXCEEDED",
        retryAfter: retryAfterSec,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfterSec),
          "X-RateLimit-Limit": String(config.limit),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(Math.ceil((now + resetMs) / 1000)),
        },
      }
    );

    return { allowed: false, remaining: 0, resetMs, response: res };
  }

  // Record this request timestamp
  record.timestamps.push(now);
  const remaining = config.limit - record.timestamps.length;

  return {
    allowed: true,
    remaining,
    resetMs: config.windowMs,
  };
}

/**
 * Sanitize User Inputs against XSS / Script Injections
 */
export function sanitizeString(input: string | undefined | null): string {
  if (!input || typeof input !== "string") return "";
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<[^>]+>/g, "") // Strip HTML tags
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "") // Strip event handlers like onerror=
    .trim();
}
