import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

/**
 * Cloudflare R2 Storage Helper (Server-side Only)
 * Secure S3-compatible file storage for uploaded product images.
 * Keeps all access credentials hidden on the server.
 */

function getCleanEnv(key: string): string {
  const val = process.env[key];
  if (!val) return "";
  return val.trim().replace(/^["']|["']$/g, "");
}

export function getR2PublicUrl(): string {
  const url =
    getCleanEnv("CLOUDFLARE_R2_PUBLIC_URL") ||
    getCleanEnv("NEXT_PUBLIC_R2_PUBLIC_URL") ||
    getCleanEnv("R2_PUBLIC_URL") ||
    "https://images.lollipopcakeshop.in";
  return url.replace(/\/+$/, "");
}

export function getR2Endpoint(): string {
  const customEndpoint =
    getCleanEnv("CLOUDFLARE_R2_ENDPOINT") || getCleanEnv("R2_ENDPOINT");
  if (customEndpoint) {
    return customEndpoint.replace(/\/+$/, "");
  }

  let accountId =
    getCleanEnv("CLOUDFLARE_R2_ACCOUNT_ID") || getCleanEnv("R2_ACCOUNT_ID");
  if (accountId.includes("r2.cloudflarestorage.com")) {
    const match = accountId.match(/([a-f0-9]{32})/i);
    if (match) accountId = match[1];
  }

  return accountId ? `https://${accountId}.r2.cloudflarestorage.com` : "";
}

export function isR2Configured(): boolean {
  const endpoint = getR2Endpoint();
  const accessKeyId =
    getCleanEnv("CLOUDFLARE_R2_ACCESS_KEY_ID") || getCleanEnv("R2_ACCESS_KEY_ID");
  const secretAccessKey =
    getCleanEnv("CLOUDFLARE_R2_SECRET_ACCESS_KEY") ||
    getCleanEnv("R2_SECRET_ACCESS_KEY");
  const bucket =
    getCleanEnv("CLOUDFLARE_R2_BUCKET_NAME") || getCleanEnv("R2_BUCKET_NAME");

  return Boolean(endpoint && accessKeyId && secretAccessKey && bucket);
}

let s3ClientInstance: S3Client | null = null;

export function getR2Client(): S3Client | null {
  if (!isR2Configured()) return null;
  if (s3ClientInstance) return s3ClientInstance;

  const endpoint = getR2Endpoint();
  const accessKeyId =
    getCleanEnv("CLOUDFLARE_R2_ACCESS_KEY_ID") || getCleanEnv("R2_ACCESS_KEY_ID");
  const secretAccessKey =
    getCleanEnv("CLOUDFLARE_R2_SECRET_ACCESS_KEY") ||
    getCleanEnv("R2_SECRET_ACCESS_KEY");

  s3ClientInstance = new S3Client({
    region: "auto",
    endpoint,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  return s3ClientInstance;
}

/**
 * Extract clean Cloudflare R2 object key from a full URL or partial key string.
 * Supports:
 * - Full public R2 URL (e.g. https://pub-xxx.r2.dev/cakes/black_forest-xxx.webp)
 * - Cloudflare S3 endpoint URL (e.g. https://xxx.r2.cloudflarestorage.com/bucket/cakes/xxx.webp)
 * - Direct R2 key (e.g. cakes/black_forest-xxx.webp or /cakes/black_forest-xxx.webp)
 * Returns null if the string is not an R2 object or is a local static asset.
 */
export function extractR2Key(keyOrUrl: string | null | undefined): string | null {
  if (!keyOrUrl || typeof keyOrUrl !== "string") return null;
  const cleanInput = keyOrUrl.trim();
  if (!cleanInput || cleanInput.startsWith("data:") || cleanInput === "product.image") return null;

  const bucket =
    getCleanEnv("CLOUDFLARE_R2_BUCKET_NAME") ||
    getCleanEnv("R2_BUCKET_NAME") ||
    "lollipopcakeshop-image";

  // 1. If it's a full HTTP or HTTPS URL
  if (cleanInput.startsWith("http://") || cleanInput.startsWith("https://")) {
    try {
      const parsedUrl = new URL(cleanInput);
      let pathname = decodeURIComponent(parsedUrl.pathname).replace(/^\/+/, "");

      // If bucket name is part of pathname, remove it
      if (pathname.startsWith(`${bucket}/`)) {
        pathname = pathname.slice(bucket.length + 1);
      }

      const hostname = parsedUrl.hostname.toLowerCase();
      const publicBaseUrl = getR2PublicUrl();
      let publicHost = "";
      try {
        publicHost = new URL(publicBaseUrl).hostname.toLowerCase();
      } catch {}

      const isR2Host =
        hostname.includes("r2.dev") ||
        hostname.includes("r2.cloudflarestorage.com") ||
        hostname === "images.lollipopcakeshop.in" ||
        hostname.endsWith(".lollipopcakeshop.in") ||
        (publicHost && hostname === publicHost);

      if (isR2Host || pathname.startsWith("cakes/") || pathname.startsWith("snacks/")) {
        return pathname.replace(/^\/+/, "");
      }
      return null;
    } catch {
      // Invalid URL format, fallback to string inspection
    }
  }

  // 2. Relative or plain key format
  let cleanKey = cleanInput.replace(/^\/+/, "");
  if (cleanKey.startsWith(`${bucket}/`)) {
    cleanKey = cleanKey.slice(bucket.length + 1);
  }

  // Check if it matches our standard R2 upload folders
  if (cleanKey.startsWith("cakes/") || cleanKey.startsWith("snacks/")) {
    return cleanKey;
  }

  return null;
}

/**
 * Checks whether a given string is a Cloudflare R2 object URL or key.
 */
export function isR2Url(keyOrUrl: string | null | undefined): boolean {
  return Boolean(extractR2Key(keyOrUrl));
}

/**
 * Upload an image buffer to Cloudflare R2.
 */
export async function uploadToR2(params: {
  buffer: Buffer;
  key: string;
  contentType?: string;
}): Promise<{ success: boolean; url: string; error?: string }> {
  const publicBaseUrl = getR2PublicUrl();
  const cleanKey = params.key.replace(/^\/+/, "");
  const expectedUrl = `${publicBaseUrl}/${cleanKey}`;

  const client = getR2Client();
  const bucket =
    getCleanEnv("CLOUDFLARE_R2_BUCKET_NAME") ||
    getCleanEnv("R2_BUCKET_NAME") ||
    "lollipopcakeshop-image";

  if (!client) {
    return {
      success: false,
      url: expectedUrl,
      error: "Cloudflare R2 API credentials not fully configured in environment.",
    };
  }

  try {
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: cleanKey,
      Body: params.buffer,
      ContentType: params.contentType || "image/webp",
      CacheControl: "public, max-age=31536000, immutable",
    });

    await client.send(command);

    console.log(`☁️ [Cloudflare R2] Successfully uploaded: ${cleanKey}`);
    return {
      success: true,
      url: expectedUrl,
    };
  } catch (err: any) {
    console.error("❌ [Cloudflare R2] PutObjectCommand failed:", err?.message || err);
    return {
      success: false,
      url: expectedUrl,
      error: err?.message || "Failed to upload image to Cloudflare R2",
    };
  }
}

/**
 * Delete an image object from Cloudflare R2 by URL or object key.
 */
export async function deleteFromR2(
  keyOrUrl: string | null | undefined
): Promise<{ success: boolean; key?: string; error?: string }> {
  if (!keyOrUrl) {
    return { success: false, error: "No image key or URL provided." };
  }

  const key = extractR2Key(keyOrUrl);
  if (!key) {
    return {
      success: false,
      error: `Could not identify Cloudflare R2 object key from: ${keyOrUrl}`,
    };
  }

  const client = getR2Client();
  const bucket =
    getCleanEnv("CLOUDFLARE_R2_BUCKET_NAME") ||
    getCleanEnv("R2_BUCKET_NAME") ||
    "lollipopcakeshop-image";

  if (!client) {
    return {
      success: false,
      key,
      error: "Cloudflare R2 API credentials not fully configured in environment.",
    };
  }

  try {
    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    await client.send(command);
    console.log(`🗑️ [Cloudflare R2] Successfully deleted previous object: ${key}`);

    return {
      success: true,
      key,
    };
  } catch (err: any) {
    console.error(`❌ [Cloudflare R2] DeleteObjectCommand failed for ${key}:`, err?.message || err);
    return {
      success: false,
      key,
      error: err?.message || "Failed to delete image from Cloudflare R2",
    };
  }
}

/**
 * Delete multiple images from Cloudflare R2 by URLs or object keys.
 */
export async function deleteMultipleFromR2(
  keysOrUrls: (string | null | undefined)[]
): Promise<{ success: boolean; deletedCount: number; errors: string[] }> {
  let deletedCount = 0;
  const errors: string[] = [];

  for (const item of keysOrUrls) {
    if (!item) continue;
    const res = await deleteFromR2(item);
    if (res.success) {
      deletedCount++;
    } else if (res.error) {
      errors.push(res.error);
    }
  }

  return {
    success: errors.length === 0,
    deletedCount,
    errors,
  };
}
