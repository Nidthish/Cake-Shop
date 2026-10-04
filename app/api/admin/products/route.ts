import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedAdmin } from "@/lib/auth";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/admin/products — List all products with categories and variants from MySQL
export async function GET(req: NextRequest) {
  try {
    const admin = await getAuthenticatedAdmin(req);
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized access." }, { status: 401 });
    }

    const products = await prisma.product.findMany({
      include: {
        category: true,
        variants: true,
        offers: true,
      },
      orderBy: { id: "asc" },
    });

    return NextResponse.json({
      success: true,
      count: products.length,
      products: products.map((p: any) => {
        const catSlug = (p.category.slug || "").toLowerCase();
        let mainCategory = "cakes";
        if (
          p.productType === "SNACK" ||
          ["breads", "buns", "puffs", "cookies", "brownies", "cup-cakes", "doughnuts", "snacks"].includes(catSlug)
        ) {
          mainCategory = "snacks";
        } else if (catSlug.includes("dry")) {
          mainCategory = "dry-cakes";
        } else if (catSlug.includes("bento")) {
          mainCategory = "bento-cake";
        } else if (catSlug.includes("wedding")) {
          mainCategory = "wedding-cakes";
        } else if (catSlug.includes("1st") || catSlug.includes("first")) {
          mainCategory = "first-birthday";
        } else if (catSlug.includes("custom")) {
          mainCategory = "custom-cake";
        }

        const hasOffer = p.offers && p.offers.some((o: any) => o.isActive);

        return {
          id: p.id.toString(),
          slug: p.slug,
          productCode: p.productCode,
          name: p.name,
          category: mainCategory,
          categoryName: p.category.name,
          subCategory: p.category.name,
          description: p.description,
          imageName: p.imageName,
          badge: p.badge,
          rating: Number(p.rating),
          reviewCount: p.reviewCount,
          productType: p.productType,
          isActive: p.isActive,
          isOfferProduct: hasOffer || (p.badge || "").includes("1kg Free"),
          isEggless: p.variants.some((v: any) => v.isEggless),
          variants: p.variants.map((v: any) => ({
            id: v.id.toString(),
            name: v.name,
            price: Number(v.price),
            weightValue: Number(v.weightValue),
            weightUnit: v.weightUnit,
            isEggless: v.isEggless,
            isAvailable: v.isAvailable,
            serves: v.serves,
            isOffer1kgFree: hasOffer && v.name.includes("1kg"),
          })),
          offers: p.offers.map((o: any) => ({
            id: o.id.toString(),
            buyQuantity: o.buyQuantity,
            freeQuantity: o.freeQuantity,
            isActive: o.isActive,
          })),
        };
      }),
    });
  } catch (error: any) {
    console.error("[GET /api/admin/products] Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

const createProductSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  categorySlug: z.string().min(1, "Category is required"),
  subCategory: z.string().optional(),
  description: z.string().optional(),
  imageName: z.string().optional(),
  badge: z.string().optional(),
  hasOffer: z.boolean().optional().default(false),
  offerBadge: z.string().optional(),
  offerBuyVariant: z.string().optional(),
  offerFreeVariant: z.string().optional(),
  productType: z.enum(["CAKE", "SNACK"]).default("CAKE"),
  isActive: z.boolean().default(true),
  variants: z
    .array(
      z.object({
        name: z.string().min(1, "Variant name is required"),
        price: z.number().min(0, "Price must be positive"),
        weightValue: z.number().optional().default(0.5),
        weightUnit: z.string().optional().default("kg"),
        isEggless: z.boolean().optional().default(true),
        serves: z.string().optional(),
        isOffer1kgFree: z.boolean().optional().default(false),
      })
    )
    .min(1, "At least one variant price is required"),
});

// POST /api/admin/products — Create a new product (SUPERADMIN only)
export async function POST(req: NextRequest) {
  try {
    const admin = await getAuthenticatedAdmin(req);
    if (!admin || admin.role !== "SUPERADMIN") {
      return NextResponse.json({ success: false, error: "Access denied. Only Super Admins can add new products." }, { status: 403 });
    }

    const json = await req.json();
    const parsed = createProductSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const data = parsed.data;
    
    // Ensure unique slug
    let baseSlug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    if (!baseSlug) baseSlug = "product";
    let slug = baseSlug;
    
    const existingSlugProduct = await prisma.product.findUnique({ where: { slug } });
    if (existingSlugProduct) {
      slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
    }

    const productCode = `LOL-${Math.floor(1000 + Math.random() * 9000)}`;

    // Resolve category name in MySQL based on primary category & subcategory
    let targetCatName = "Normal Flavors";
    if (data.categorySlug === "cakes") {
      targetCatName = (data.subCategory && data.subCategory.trim()) ? data.subCategory.trim() : "Normal Flavors";
    } else {
      const primaryNames: Record<string, string> = {
        "dry-cakes": "Dry Cakes",
        snacks: "Snacks & Pastries",
        "bento-cake": "Bento Cakes",
        "wedding-cakes": "Wedding Cakes",
        "first-birthday": "1st Birthday Cakes",
        "custom-cake": "Customized Cakes",
      };
      targetCatName = primaryNames[data.categorySlug] || data.categorySlug;
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

    const hasAnyOffer = data.variants.some((v) => v.isOffer1kgFree);
    let finalBadge = data.badge || null;
    if (hasAnyOffer && !finalBadge) {
      finalBadge = "1kg Free Offer";
    }

    let cleanImageName = data.imageName || "product.image";
    if (cleanImageName && (cleanImageName.startsWith("data:") || cleanImageName.length > 450)) {
      if (cleanImageName.startsWith("data:")) {
        const subDir = data.categorySlug?.toLowerCase().includes("snack") ? "Snacks" : "cakes";
        cleanImageName = `/PRODUCT_IMAGES/${subDir}/product-${Date.now()}.jpg`;
      } else {
        cleanImageName = cleanImageName.substring(0, 450);
      }
    }

    // Create Product in MySQL
    const newProduct = await prisma.product.create({
      data: {
        productCode,
        name: data.name,
        slug,
        categoryId: category.id,
        description: data.description || `Freshly baked ${data.name}. 100% handcrafted perfection!`,
        imageName: cleanImageName,
        badge: finalBadge,
        productType: data.productType,
        isActive: data.isActive,
        rating: 5.0,
        reviewCount: 1,
      },
    });

    // Create Product Variants
    let buy1kgVariantId: bigint | null = null;
    let free05kgVariantId: bigint | null = null;

    const buyVariantName = data.offerBuyVariant || "1kg";
    const freeVariantName = data.offerFreeVariant || "0.5kg";

    for (const v of data.variants) {
      const variant = await prisma.productVariant.create({
        data: {
          productId: newProduct.id,
          name: v.name,
          price: v.price,
          weightValue: v.weightValue ?? 0.5,
          weightUnit: v.weightUnit || "kg",
          isEggless: v.isEggless !== undefined ? v.isEggless : true,
          isAvailable: true,
          serves: v.serves || (v.name.includes("0.5") ? "4-6 Servings" : "8-10 Servings"),
        },
      });

      if (v.name.includes(buyVariantName) || v.name.includes("1kg") || v.isOffer1kgFree) {
        if (!buy1kgVariantId) buy1kgVariantId = variant.id;
      }
      if (v.name.includes(freeVariantName) || v.name.includes("0.5kg") || v.name.includes("500g")) {
        if (!free05kgVariantId) free05kgVariantId = variant.id;
      }
    }

    // Create product offer if requested on any variant or hasOffer is true
    const shouldCreateOffer = (hasAnyOffer || Boolean(data.hasOffer)) && buy1kgVariantId && free05kgVariantId;
    if (shouldCreateOffer) {
      await prisma.productOffer.create({
        data: {
          productId: newProduct.id,
          buyVariantId: buy1kgVariantId!,
          freeVariantId: free05kgVariantId!,
          buyQuantity: 1,
          freeQuantity: 1,
          isActive: true,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: `Product "${newProduct.name}" created successfully in Neon PostgreSQL database!`,
      productId: newProduct.id.toString(),
      slug: newProduct.slug,
    });
  } catch (error: any) {
    console.error("[POST /api/admin/products] Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
