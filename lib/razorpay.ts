import Razorpay from "razorpay";
import crypto from "crypto";

/**
 * Server-only Razorpay client. RAZORPAY_KEY_SECRET must never be exposed to
 * the browser — this file is only ever imported from Route Handlers
 * (app/api/**) which run exclusively on the server.
 */
function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable "${name}". Copy .env.example to .env.local and fill in your Razorpay keys.`
    );
  }
  return value;
}

let cachedClient: Razorpay | null = null;

export function getRazorpayClient(): Razorpay {
  if (cachedClient) return cachedClient;
  cachedClient = new Razorpay({
    key_id: getEnv("RAZORPAY_KEY_ID"),
    key_secret: getEnv("RAZORPAY_KEY_SECRET"),
  });
  return cachedClient;
}

export function getRazorpayPublicKeyId(): string {
  return getEnv("RAZORPAY_KEY_ID");
}

/**
 * Verifies the HMAC-SHA256 signature Razorpay returns after checkout, using
 * the official recipe: HMAC_SHA256(order_id + "|" + payment_id, key_secret)
 * must equal the signature returned to the browser. This MUST be done
 * server-side — trusting a client-reported "payment succeeded" flag is a
 * critical security hole and is exactly what this function prevents.
 */
export function verifyPaymentSignature(params: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}): boolean {
  const secret = getEnv("RAZORPAY_KEY_SECRET");
  const body = `${params.razorpay_order_id}|${params.razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  // Constant-time comparison to avoid timing attacks.
  const a = Buffer.from(expectedSignature, "utf-8");
  const b = Buffer.from(params.razorpay_signature, "utf-8");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

/**
 * Verifies an incoming Razorpay webhook signature (X-Razorpay-Signature
 * header) against RAZORPAY_WEBHOOK_SECRET. Optional but recommended for
 * production so payment confirmation doesn't depend solely on the client
 * redirect completing.
 */
export function verifyWebhookSignature(rawBody: string, signature: string): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return false;
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  const a = Buffer.from(expected, "utf-8");
  const b = Buffer.from(signature, "utf-8");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
