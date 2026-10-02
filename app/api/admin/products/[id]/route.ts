import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedAdmin } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/admin/products/[id] — Get single product by ID
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAuthenticatedAdmin(req);
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized access." }, { status: 401 });
    }

    const { id } = await context.params;
    const productId = BigInt(id);

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: true,
        variants: true,
        offers: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      product: {
        id: product.id.toString(),
        slug: product.slug,
        productCode: product.productCode,
        name: product.name,
        category: product.category.slug,
        categoryName: product.category.name,
        subCategory: product.category.name,
        description: product.description,
        imageName: product.imageName,
        badge: product.badge,
        rating: Number(product.rating),
        reviewCount: product.reviewCount,
        productType: product.productType,
        isActive: product.isActive,
        variants: product.variants.map((v) => ({
          id: v.id.toString(),
          name: v.name,
          price: Number(v.price),
          weightValue: Number(v.weightValue),
          weightUnit: v.weightUnit,
          isEggless: v.isEggless,
          isAvailable: v.isAvailable,
          serves: v.serves,
        })),
      },
    });
  } catch (error: any) {
    console.error("[GET /api/admin/products/[id]] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/admin/products/[id] — Update product (isActive sales pause/resume, details, variants)
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAuthenticatedAdmin(req);
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized access." }, { status: 401 });
    }

    const { id } = await context.params;
    const productId = BigInt(id);
    const body = await req.json();

    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    // 1. Partial Update: Toggle isActive (Pause / Resume Sales) - Allowed for both ADMIN & SUPERADMIN
    if (typeof body.isActive === "boolean" && Object.keys(body).length === 1) {
      const updated = await prisma.product.update({
        where: { id: productId },
        data: { isActive: body.isActive },
      });

      return NextResponse.json({
        success: true,
        message: `Product sales ${updated.isActive ? "resumed" : "paused"} in Neon PostgreSQL database!`,
        product: {
          id: updated.id.toString(),
          isActive: updated.isActive,
        },
      });
    }

    // 2. Full Update: Name, Category, SubCategory, Description, Badge, Variants — SUPERADMIN Only!
    if (admin.role !== "SUPERADMIN") {
      return NextResponse.json(
        { success: false, error: "Access denied. Normal admins can only pause/resume sales, not edit product details." },
        { status: 403 }
      );
    }

    const {
      name,
      categorySlug,
      subCategory,
      description,
      imageName,
      badge,
      productType,
      isActive,
      variants,
    } = body;

    let categoryId = existingProduct.categoryId;

    if (categorySlug) {
      let targetCatName = "Normal Flavors";
      if (categorySlug === "cakes") {
        targetCatName = (subCategory && subCategory.trim()) ? subCategory.trim() : "Normal Flavors";
      } else {
        const primaryNames: Record<string, string> = {
          "dry-cakes": "Dry Cakes",
          snacks: "Snacks & Pastries",
          "bento-cake": "Bento Cakes",
          "wedding-cakes": "Wedding Cakes",
          "first-birthday": "1st Birthday Cakes",
          "custom-cake": "Customized Cakes",
        };
        targetCatName = primaryNames[categorySlug] || categorySlug;
      }

      const cleanSlug = targetCatName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
      let category = await prisma.category.findFirst({
        where: {
          OR: [
            { slug: cleanSlug },
            { name: targetCatName },
          ],
        },
      });

      if (!category) {
        category = await prisma.category.create({
          data: {
            name: targetCatName,
            slug: cleanSlug,
            description: `${targetCatName} collection`,
          },
        });
      }
      categoryId = category.id;
    }

    const hasAnyOffer = Array.isArray(variants) && variants.some((v: any) => v.isOffer1kgFree);
    let finalBadge = badge !== undefined ? badge : existingProduct.badge;
    if (hasAnyOffer) {
      if (!finalBadge || finalBadge === "") {
        finalBadge = "1kg Free Offer";
      }
    } else if (finalBadge === "1kg Free Offer") {
      finalBadge = null;
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        name: name || existingProduct.name,
        slug: name
          ? name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
          : existingProduct.slug,
        categoryId,
        description:
          description !== undefined
            ? description
            : existingProduct.description,
        imageName: imageName || existingProduct.imageName,
        badge: finalBadge,
        productType: productType || existingProduct.productType,
        isActive: typeof isActive === "boolean" ? isActive : existingProduct.isActive,
      },
    });

    // Update variants if provided
    if (Array.isArray(variants) && variants.length > 0) {
      // 1. Delete existing offers first to prevent Foreign Key constraint violation
      await prisma.productOffer.deleteMany({
        where: { productId },
      });

      // 2. Delete existing variants
      await prisma.productVariant.deleteMany({
        where: { productId },
      });

      // 3. Re-create variants
      let buy1kgVariantId: bigint | null = null;
      let free05kgVariantId: bigint | null = null;

      const buyVariantName = body.offerBuyVariant || "1kg";
      const freeVariantName = body.offerFreeVariant || "0.5kg";

      for (const v of variants) {
        const variant = await prisma.productVariant.create({
          data: {
            productId,
            name: v.name,
            price: v.price,
            weightValue: v.weightValue || 0.5,
            weightUnit: v.weightUnit || "kg",
            isEggless: v.isEggless !== undefined ? v.isEggless : true,
            isAvailable: true,
            serves: v.serves || "4-6 Servings",
          },
        });

        if (v.name.includes(buyVariantName) || v.name.includes("1kg") || v.isOffer1kgFree) {
          if (!buy1kgVariantId) buy1kgVariantId = variant.id;
        }
        if (v.name.includes(freeVariantName) || v.name.includes("0.5kg") || v.name.includes("500g")) {
          if (!free05kgVariantId) free05kgVariantId = variant.id;
        }
      }

      // 4. Re-create product offer if requested on any variant or hasOffer is true
      const shouldCreateOffer = (hasAnyOffer || Boolean(body.hasOffer)) && buy1kgVariantId && free05kgVariantId;
      if (shouldCreateOffer) {
        await prisma.productOffer.create({
          data: {
            productId,
            buyVariantId: buy1kgVariantId!,
            freeVariantId: free05kgVariantId!,
            buyQuantity: 1,
            freeQuantity: 1,
            isActive: true,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Product "${updatedProduct.name}" updated successfully in Neon PostgreSQL database!`,
    });
  } catch (error: any) {
    console.error("[PUT /api/admin/products/[id]] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/products/[id] — Delete product from MySQL (SUPERADMIN only)
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAuthenticatedAdmin(req);
    if (!admin || admin.role !== "SUPERADMIN") {
      return NextResponse.json({ success: false, error: "Access denied. Only Super Admins can delete products." }, { status: 403 });
    }

    const { id } = await context.params;
    const productId = BigInt(id);

    // Delete associated offers, order items, and variants first (foreign key constraints)
    await prisma.productOffer.deleteMany({ where: { productId } });
    await prisma.orderItem.deleteMany({ where: { productId } });
    await prisma.productVariant.deleteMany({ where: { productId } });
    await prisma.product.delete({ where: { id: productId } });

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully from Neon PostgreSQL database!",
    });
  } catch (error: any) {
    console.error("[DELETE /api/admin/products/[id]] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
