import crypto from "crypto";

/**
 * Hash password using PBKDF2 with SHA-256 and 10,000 iterations (OWASP Standard)
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha256")
    .toString("hex");
  return `${salt}:${hash}`;
}

/**
 * Verify a plain text password against a stored PBKDF2 salt:hash string
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash || !storedHash.includes(":")) {
    return false;
  }
  const [salt, originalHash] = storedHash.split(":");
  if (!salt || !originalHash) return false;

  const hashToVerify = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha256")
    .toString("hex");

  return crypto.timingSafeEqual(
    Buffer.from(originalHash, "hex"),
    Buffer.from(hashToVerify, "hex")
  );
}
