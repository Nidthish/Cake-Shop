import crypto from "crypto";

const JWT_SECRET =
  process.env.JWT_SECRET ||
  (process.env.NODE_ENV === "production"
    ? "lollipop_super_secret_jwt_key_2026_production_secure_9921"
    : "dev_jwt_secret_change_in_production");

if (!process.env.JWT_SECRET && process.env.NODE_ENV === "production") {
  console.warn("⚠️ [SECURITY WARNING] JWT_SECRET is not set in environment variables! Using fallback key.");
}

// Admin session lifetime: 1 hour (3600 seconds)
export const TOKEN_EXPIRY_SECONDS = 60 * 60; // 1 hour

export interface JwtPayload {
  userId: string;
  email: string;
  fullName: string;
  role: string;
  iat?: number;
  exp?: number;
}

function base64UrlEncode(str: string | Buffer): string {
  const base64 = Buffer.isBuffer(str)
    ? str.toString("base64")
    : Buffer.from(str).toString("base64");
  return base64.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return Buffer.from(base64, "base64").toString("utf8");
}

/**
 * Sign a hardened JWT token for Admin/Delivery authentication.
 * Defaults to 1 hour (3600s) session validity.
 */
export function signJwt(
  payload: Omit<JwtPayload, "iat" | "exp">,
  expiresInSeconds: number = TOKEN_EXPIRY_SECONDS
): string {
  const now = Math.floor(Date.now() / 1000);
  const fullPayload: JwtPayload = {
    ...payload,
    iat: now,
    exp: now + expiresInSeconds,
  };

  const header = { alg: "HS256", typ: "JWT" };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));

  const signatureInput = `${encodedHeader}.${encodedPayload}`;
  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(signatureInput)
    .digest();

  const encodedSignature = base64UrlEncode(signature);
  return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
}

/**
 * Verify & decode a JWT token with constant-time HMAC validation,
 * header algorithm enforcement, and expiration checks.
 * Returns payload if valid, null if invalid or expired.
 */
export function verifyJwt(token: string): JwtPayload | null {
  try {
    if (!token || typeof token !== "string") return null;

    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [encodedHeader, encodedPayload, encodedSignature] = parts;

    // Validate header: enforce HS256 algorithm and JWT typ
    let header: { alg?: string; typ?: string };
    try {
      header = JSON.parse(base64UrlDecode(encodedHeader));
    } catch {
      return null;
    }

    if (!header || header.alg !== "HS256") {
      console.warn("⚠️ [JWT Notice] Rejected token with unexpected algorithm:", header?.alg);
      return null;
    }

    const signatureInput = `${encodedHeader}.${encodedPayload}`;
    const expectedSignature = base64UrlEncode(
      crypto.createHmac("sha256", JWT_SECRET).update(signatureInput).digest()
    );

    const sigBuf = Buffer.from(encodedSignature);
    const expBuf = Buffer.from(expectedSignature);

    // Constant-time length and signature comparison
    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return null;
    }

    const payload: JwtPayload = JSON.parse(base64UrlDecode(encodedPayload));
    const now = Math.floor(Date.now() / 1000);

    // Reject tokens issued in the future (skew tolerance 60s)
    if (payload.iat && payload.iat > now + 60) {
      console.warn("⚠️ [JWT Notice] Token issued in future.");
      return null;
    }

    // Check expiration
    if (!payload.exp || payload.exp <= now) {
      console.warn("⚠️ [JWT Notice] Token has expired.");
      return null;
    }

    // Require essential user claims
    if (!payload.userId || !payload.role) {
      return null;
    }

    return payload;
  } catch (err) {
    return null;
  }
}
