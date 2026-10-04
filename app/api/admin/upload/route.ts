import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getAuthenticatedAdmin } from "@/lib/auth";

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
      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    } else if (contentType.includes("application/json")) {
      const json = await req.json();
      const { image, fileName, category: catParam } = json;
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

    // Determine extension
    let ext = path.extname(originalName).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      if (mimeType.includes("png")) ext = ".png";
      else if (mimeType.includes("webp")) ext = ".webp";
      else ext = ".jpg";
    }

    // Determine target subfolder: cakes or Snacks
    const subDir = category.toLowerCase().includes("snack") ? "Snacks" : "cakes";

    // Create unique safe filename
    const safeBase = originalName
      .replace(/\.[^/.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, "-")
      .replace(/^-+|-+$/g, "") || "cake";
    const fileName = `${safeBase}-${Date.now()}${ext}`;

    // Target directories: public/PRODUCT_IMAGES/<subDir> and PRODUCT_IMAGES/<subDir>
    const publicDir = path.join(process.cwd(), "public", "PRODUCT_IMAGES", subDir);
    const rootDir = path.join(process.cwd(), "PRODUCT_IMAGES", subDir);

    try {
      await fs.promises.mkdir(publicDir, { recursive: true });
      await fs.promises.mkdir(rootDir, { recursive: true });

      const publicFilePath = path.join(publicDir, fileName);
      const rootFilePath = path.join(rootDir, fileName);

      await Promise.all([
        fs.promises.writeFile(publicFilePath, buffer).catch((err) => {
          console.warn("Notice: Local public filesystem write skipped (serverless environment):", err?.message);
        }),
        fs.promises.writeFile(rootFilePath, buffer).catch((err) => {
          console.warn("Notice: Local root filesystem write skipped (serverless environment):", err?.message);
        }),
      ]);
    } catch (fsErr: any) {
      console.warn("Notice: Filesystem directory creation skipped (serverless environment):", fsErr?.message);
    }

    const imageUrl = `/PRODUCT_IMAGES/${subDir}/${fileName}`;

    return NextResponse.json({
      success: true,
      fileName,
      imageUrl,
      size: buffer.length,
    });
  } catch (error: any) {
    console.error("[POST /api/admin/upload] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to save image." },
      { status: 500 }
    );
  }
}
