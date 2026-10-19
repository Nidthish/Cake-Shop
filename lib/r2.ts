import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

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
    getCleanEnv("R2_PUBLIC_URL") ||
    "https://pub-cc78f2072e744ca2a82f1b0346156699.r2.dev";
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
    "lollipop-bakery";

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
