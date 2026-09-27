import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "lollipop_super_secret_jwt_key_2026_production_secure_9921";
const TOKEN_EXPIRY_SECONDS = 24 * 60 * 60; // 24 hours

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
 * Sign a JWT token for Admin authentication
 */
export function signJwt(payload: Omit<JwtPayload, "iat" | "exp">): string {
  const now = Math.floor(Date.now() / 1000);
  const fullPayload: JwtPayload = {
    ...payload,
    iat: now,
    exp: now + TOKEN_EXPIRY_SECONDS,
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
 * Verify & decode a JWT token. Returns payload if valid, null if invalid or expired.
 */
export function verifyJwt(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [encodedHeader, encodedPayload, encodedSignature] = parts;
    const signatureInput = `${encodedHeader}.${encodedPayload}`;

    const expectedSignature = base64UrlEncode(
      crypto.createHmac("sha256", JWT_SECRET).update(signatureInput).digest()
    );

    // Timing safe comparison to prevent timing attacks
    if (!crypto.timingSafeEqual(Buffer.from(encodedSignature), Buffer.from(expectedSignature))) {
      return null;
    }

    const payload: JwtPayload = JSON.parse(base64UrlDecode(encodedPayload));
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp < now) {
      console.warn("⚠️ [JWT Notice] Token has expired.");
      return null;
    }

    return payload;
  } catch (err) {
    return null;
  }
}
