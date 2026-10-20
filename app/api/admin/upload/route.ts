import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getAuthenticatedAdmin } from "@/lib/auth";
import { uploadToR2, deleteFromR2, isR2Url, isR2Configured, getR2PublicUrl } from "@/lib/r2";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(req: NextRequest) {
  try {
    const admin = await getAuthenticatedAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access." },
        { status: 401 }
      );
    }

    const contentType = req.headers.get("content-type") || "";
    let buffer: Buffer | null = null;
    let originalName = "";
    let mimeType = "";
    let category = "cakes";
    let previousImageUrl = "";
    let productIdStr = "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      if (!file) {
        return NextResponse.json(
          { success: false, error: "No image file provided." },
          { status: 400 }
        );
      }
      originalName = file.name;
      mimeType = file.type;
      
      const catParam = formData.get("category");
      if (typeof catParam === "string" && catParam.trim()) {
        category = catParam.trim();
      }

      const prevParam = formData.get("previousImageUrl") || formData.get("oldImageUrl");
      if (typeof prevParam === "string" && prevParam.trim()) {
        previousImageUrl = prevParam.trim();
      }

      const prodIdParam = formData.get("productId");
      if (typeof prodIdParam === "string" && prodIdParam.trim()) {
        productIdStr = prodIdParam.trim();
      }

      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    } else if (contentType.includes("application/json")) {
      const json = await req.json();
      const {
        image,
        fileName,
        category: catParam,
        previousImageUrl: prevParam,
        oldImageUrl,
        productId: prodIdParam,
      } = json;

      if (!image || typeof image !== "string") {
        return NextResponse.json(
          { success: false, error: "Missing image data." },
          { status: 400 }
        );
      }
      originalName = fileName || "cake-image.jpg";
      if (typeof catParam === "string" && catParam.trim()) {
        category = catParam.trim();
      }

      const rawPrev = prevParam || oldImageUrl;
      if (typeof rawPrev === "string" && rawPrev.trim()) {
        previousImageUrl = rawPrev.trim();
      }

      if (prodIdParam !== undefined && prodIdParam !== null) {
        productIdStr = String(prodIdParam).trim();
      }

      const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches[2]) {
        mimeType = matches[1];
        buffer = Buffer.from(matches[2], "base64");
      } else {
        return NextResponse.json(
          { success: false, error: "Invalid Base64 image format." },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { success: false, error: "Unsupported Content-Type." },
        { status: 400 }
      );
    }

    if (!buffer || buffer.length === 0) {
      return NextResponse.json(
        { success: false, error: "Image file is empty." },
        { status: 400 }
      );
    }

    if (buffer.length > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: "Image file exceeds maximum 5 MB limit." },
        { status: 400 }
      );
    }

    // If productId is provided, verify against DB and look up previous image if not already specified
    let targetProductId: bigint | null = null;
    if (productIdStr && /^\d+$/.test(productIdStr)) {
      try {
        targetProductId = BigInt(productIdStr);
        const existingDbProduct = await prisma.product.findUnique({
          where: { id: targetProductId },
          select: { id: true, imageName: true },
        });

        if (existingDbProduct) {
          if (!previousImageUrl && existingDbProduct.imageName) {
            previousImageUrl = existingDbProduct.imageName;
          }
        } else {
          targetProductId = null;
        }
      } catch (err: any) {
        console.warn("Notice: Product DB lookup in upload skipped:", err?.message);
        targetProductId = null;
      }
    }

    // Determine extension - prioritize .webp format
    let ext = ".webp";
    if (mimeType.includes("webp") || originalName.toLowerCase().endsWith(".webp")) {
      ext = ".webp";
    } else {
      const originalExt = path.extname(originalName).toLowerCase();
      if (ALLOWED_EXTENSIONS.includes(originalExt)) {
        ext = originalExt;
      }
    }

    // Determine target subfolder: cakes or snacks
    const subDir = category.toLowerCase().includes("snack") ? "snacks" : "cakes";

    // Create unique safe filename
    const safeBase = originalName
      .replace(/\.[^/.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, "-")
      .replace(/^-+|-+$/g, "") || "cake";
    const fileName = `${safeBase}-${Date.now()}${ext}`;
    const r2Key = `${subDir}/${fileName}`;

    let imageUrl = "";
    let storageType = "local";

    // 1. Try uploading to Cloudflare R2
    if (isR2Configured()) {
      const r2Upload = await uploadToR2({
        buffer,
        key: r2Key,
        contentType: ext === ".webp" ? "image/webp" : mimeType || "image/webp",
      });

      if (r2Upload.success && r2Upload.url) {
        imageUrl = r2Upload.url;
        storageType = "cloudflare-r2";
      } else {
        console.warn("⚠️ Cloudflare R2 upload error, falling back to local storage:", r2Upload.error);
      }
    }

    // 2. If R2 is not fully configured or upload failed, store locally as fallback
    if (!imageUrl) {
      const publicDir = path.join(process.cwd(), "public", "PRODUCT_IMAGES", subDir);
      const rootDir = path.join(process.cwd(), "PRODUCT_IMAGES", subDir);

      try {
        await fs.promises.mkdir(publicDir, { recursive: true });
        await fs.promises.mkdir(rootDir, { recursive: true });

        const publicFilePath = path.join(publicDir, fileName);
        const rootFilePath = path.join(rootDir, fileName);

        await Promise.all([
          fs.promises.writeFile(publicFilePath, buffer).catch((err) => {
            console.warn("Notice: Local public filesystem write skipped:", err?.message);
          }),
          fs.promises.writeFile(rootFilePath, buffer).catch((err) => {
            console.warn("Notice: Local root filesystem write skipped:", err?.message);
          }),
        ]);
      } catch (fsErr: any) {
        console.warn("Notice: Filesystem directory creation skipped:", fsErr?.message);
      }

      imageUrl = `/PRODUCT_IMAGES/${subDir}/${fileName}`;
    }

    // 3. Delete the previous cake image from Cloudflare R2
    let previousImageDeleted = false;
    let deletedKey: string | undefined = undefined;

    if (previousImageUrl && previousImageUrl !== imageUrl) {
      if (isR2Url(previousImageUrl)) {
        try {
          const delRes = await deleteFromR2(previousImageUrl);
          if (delRes.success) {
            previousImageDeleted = true;
            deletedKey = delRes.key;
            console.log(`✅ [R2 Replacement] Deleted previous cake image: ${previousImageUrl}`);
          } else {
            console.warn(`⚠️ [R2 Replacement] Could not delete previous image:`, delRes.error);
          }
        } catch (delErr: any) {
          console.warn("Notice: Error deleting previous R2 image:", delErr?.message);
        }
      }
    }

    // 4. If target product exists in DB, update its imageName link immediately
    let dbUpdated = false;
    if (targetProductId && imageUrl) {
      try {
        await prisma.product.update({
          where: { id: targetProductId },
          data: { imageName: imageUrl },
        });
        dbUpdated = true;
        console.log(`✅ [DB Image Update] Updated product #${targetProductId} imageName to: ${imageUrl}`);
      } catch (dbErr: any) {
        console.warn(`⚠️ [DB Image Update] Failed to update product in DB:`, dbErr?.message);
      }
    }

    return NextResponse.json({
      success: true,
      fileName,
      imageUrl,
      size: buffer.length,
      storage: storageType,
      publicR2Url: `${getR2PublicUrl()}/${r2Key}`,
      previousImageDeleted,
      deletedKey,
      previousImageUrl: previousImageUrl || null,
      dbUpdated,
    });
  } catch (error: any) {
    console.error("[POST /api/admin/upload] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to save image." },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/upload — Explicitly delete an image from Cloudflare R2
export async function DELETE(req: NextRequest) {
  try {
    const admin = await getAuthenticatedAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    let imageUrl =
      searchParams.get("url") ||
      searchParams.get("imageUrl") ||
      searchParams.get("key");

    if (!imageUrl) {
      try {
        const body = await req.json();
        imageUrl = body.imageUrl || body.url || body.key;
      } catch {}
    }

    if (!imageUrl) {
      return NextResponse.json(
        { success: false, error: "Image URL or key is required." },
        { status: 400 }
      );
    }

    const result = await deleteFromR2(imageUrl);
    return NextResponse.json({
      success: result.success,
      key: result.key,
      error: result.error,
    });
  } catch (error: any) {
    console.error("[DELETE /api/admin/upload] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete image." },
      { status: 500 }
    );
  }
}
