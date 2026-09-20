import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        category: true,
        variants: {
          where: { isAvailable: true },
        },
        offers: {
          where: { isActive: true },
          include: {
            buyVariant: true,
            freeVariant: true,
          },
        },
      },
      orderBy: { id: "asc" },
    });

    // Format products to match Product type interface
    const formattedProducts = products.map((p: any) => {
      const variants = p.variants.map((v: any) => {
        const hasOffer = p.offers.some((o: any) => o.buyVariantId === v.id);
        return {
          weight: v.name,
          price: Number(v.price),
          originalPrice: Number(v.price),
          offer: hasOffer ? "Buy 1kg Get 1/2kg Free (Offer)" : undefined,
        };
      });

      const firstVariant = variants[0];
      const minPrice = variants.length > 0 ? Math.min(...variants.map((v: any) => v.price)) : 0;

      return {
        id: p.slug,
        name: p.name,
        category: p.category.slug,
        categoryName: p.category.name,
        price: minPrice,
        minPrice,
        originalPrice: minPrice,
        image: p.imageName || "product.image",
        rating: Number(p.rating),
        reviewCount: p.reviewCount,
        badge: p.badge || undefined,
        description: p.description || undefined,
        variants,
        egglessAvailable: true,
      };
    });

    return NextResponse.json({ success: true, count: formattedProducts.length, source: "MySQL", products: formattedProducts });
  } catch (error: any) {
    console.error("Database query failed:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
