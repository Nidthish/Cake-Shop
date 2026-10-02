import type { Product } from "@/types";
import rawProducts from "./products-data.json";
import { prisma } from "./prisma";

// The full 133-item catalog backup
export const PRODUCTS_DATA: Product[] = rawProducts as Product[];

/**
 * Fetch live active products from MySQL database using Prisma Client.
 * Falls back to PRODUCTS_DATA if MySQL server is unavailable.
 */
export async function getDbProducts(): Promise<Product[]> {
  try {
    const dbProducts = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        category: true,
        variants: {
          where: { isAvailable: true },
        },
        offers: {
          where: { isActive: true },
        },
      },
      orderBy: { id: "asc" },
    });

    if (!dbProducts || dbProducts.length === 0) {
      return PRODUCTS_DATA;
    }

    return dbProducts.map((p: any) => {
      const variants = p.variants.map((v: any) => {
        const hasOffer = p.offers.some((o: any) => o.buyVariantId === v.id);
        return {
          weight: v.name,
          price: Number(v.price),
          originalPrice: Number(v.price),
          offer: hasOffer ? (p.badge || "Buy 1kg Get 1/2kg Free (Offer)") : undefined,
          isEggless: v.isEggless,
        };
      });

      const minPrice = variants.length > 0 ? Math.min(...variants.map((v: any) => v.price)) : 0;

      // Map DB category slug to primary store section category
      const catSlug = (p.category.slug || "").toLowerCase();
      let mainCategory = "cakes";
      if (p.productType === "SNACK" || ["breads", "buns", "puffs", "cookies", "brownies", "cup-cakes", "doughnuts", "snacks"].includes(catSlug)) {
        mainCategory = "snacks";
      } else if (catSlug.includes("dry")) {
        mainCategory = "dry-cakes";
      } else if (catSlug.includes("bento")) {
        mainCategory = "bento-cake";
      } else if (catSlug.includes("wedding")) {
        mainCategory = "wedding-cakes";
      } else if (catSlug.includes("1st") || catSlug.includes("first")) {
        mainCategory = "first-birthday";
      }

      const hasEgglessVariant = p.variants.some((v: any) => v.isEggless);
      const isCakeCategory = ["cakes", "dry-cakes", "bento-cake", "wedding-cakes", "first-birthday", "custom-cake"].includes(mainCategory);

      return {
        id: p.slug,
        name: p.name,
        baseName: p.name,
        category: mainCategory,
        subCategory: p.category.name,
        categoryName: p.category.name,
        price: minPrice,
        minPrice,
        originalPrice: minPrice,
        image: p.imageName || "product.image",
        rating: Number(p.rating),
        reviewCount: p.reviewCount,
        badge: p.badge || undefined,
        description: p.description || "",
        variants,
        isEggless: hasEgglessVariant,
        egglessAvailable: isCakeCategory || hasEgglessVariant,
      };
    });
  } catch (error) {
    console.warn("Prisma MySQL fetch failed, falling back to static JSON:", error);
    return PRODUCTS_DATA;
  }
}

/**
 * Slugify a product's display name
 */
function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export function getCardPrice(p: Product): number {
  return p.price ?? p.minPrice ?? p.variants?.[0]?.price ?? 0;
}

export function getCardOriginalPrice(p: Product): number {
  return p.originalPrice ?? p.variants?.[0]?.originalPrice ?? getCardPrice(p);
}

export function is1kgFreeOfferVariant(
  variant?: { weight?: string; offer?: string; price?: number } | null
): boolean {
  if (!variant) return false;
  const offerText = (variant.offer || "").toLowerCase();
  const weightText = (variant.weight || "").toLowerCase();
  return (
    offerText.includes("1/2kg") ||
    offerText.includes("1kg free") ||
    (weightText.includes("1kg") && offerText.includes("free")) ||
    (weightText.includes("1kg") && variant.price === 699)
  );
}

export function getProductsByCategory(cat?: string | null, customSource?: Product[]): Product[] {
  const source = customSource && customSource.length > 0 ? customSource : PRODUCTS_DATA;
  if (!cat || cat === "all" || cat.toLowerCase().trim() === "all") {
    return source;
  }

  const query = cat.toLowerCase().trim();
  const queryClean = query.replace(/[^a-z0-9]/g, "");

  const strictMatches = source.filter(
    (p) => (p.category || "").toLowerCase().trim() === query
  );
  if (strictMatches.length > 0) return strictMatches;

  return source.filter((p) => {
    const pCategory = (p.category || "").toLowerCase().trim();
    const pSubCategory = (p.subCategory || "").toLowerCase().trim();
    const pCategoryName = (p.categoryName || "").toLowerCase().trim();
    const pName = (p.name || "").toLowerCase().trim();
    const pDesc = (p.description || "").toLowerCase().trim();

    if (pCategory === query || pSubCategory === query) return true;
    if (
      pCategory.replace(/[^a-z0-9]/g, "") === queryClean ||
      pSubCategory.replace(/[^a-z0-9]/g, "") === queryClean
    )
      return true;
    if (pCategoryName.replace(/[^a-z0-9]/g, "") === queryClean) return true;

    if (queryClean.includes("blackforest")) {
      return (
        pName.includes("black forest") ||
        pDesc.includes("black forest") ||
        pSubCategory.includes("black forest")
      );
    }
    if (queryClean.includes("whiteforest")) {
      return pName.includes("white forest") || pDesc.includes("white forest");
    }
    if (
      queryClean.includes("chocolate") ||
      queryClean === "choco" ||
      queryClean === "chococakes"
    ) {
      return (
        pName.includes("choco") ||
        pName.includes("truffle") ||
        pName.includes("fudge") ||
        pSubCategory.includes("choco")
      );
    }
    if (queryClean.includes("redvelvet")) {
      return pName.includes("red velvet") || pDesc.includes("red velvet");
    }
    if (queryClean.includes("birthday") || queryClean === "firstbirthday") {
      return (
        pCategory === "first-birthday" ||
        pSubCategory.includes("birthday") ||
        pName.includes("birthday")
      );
    }
    if (queryClean.includes("photo") || queryClean === "photocakes") {
      return pSubCategory.includes("photo") || pName.includes("photo");
    }
    if (queryClean.includes("bento")) {
      return (
        pCategory === "bento-cake" ||
        pSubCategory.includes("bento") ||
        pName.includes("bento")
      );
    }
    if (queryClean.includes("wedding")) {
      return (
        pCategory === "wedding-cakes" ||
        pSubCategory.includes("wedding") ||
        pName.includes("wedding")
      );
    }
    if (queryClean.includes("snack") || queryClean.includes("pastr")) {
      return pCategory === "snacks";
    }

    const pClean = `${pCategory} ${pSubCategory} ${pName}`.toLowerCase();
    return pClean.includes(query);
  });
}

export function getProductById(id?: string | null, customSource?: Product[]): Product | null {
  if (!id || !id.trim()) return null;
  const clean = id.toLowerCase().trim();
  const source = customSource && customSource.length > 0 ? customSource : PRODUCTS_DATA;

  let found = source.find(
    (p) => p.id === clean || p.id.toLowerCase() === clean
  );
  if (found) return found;

  found = source.find(
    (p) =>
      p.id.toLowerCase().endsWith(clean) || clean.endsWith(p.id.toLowerCase())
  );
  if (found) return found;

  found = source.find(
    (p) => slugify(p.name).includes(clean) || clean.includes(slugify(p.name))
  );
  if (found) return found;

  return null;
}

export function getSimilarProducts(currentId: string, limit = 4, customSource?: Product[]): Product[] {
  const source = customSource && customSource.length > 0 ? customSource : PRODUCTS_DATA;
  const current = getProductById(currentId, source);
  if (!current) return source.slice(0, limit);

  const cat = current.category;
  const sub = current.subCategory;

  let matches = source.filter(
    (p) => p.id !== current.id && p.subCategory === sub
  );
  if (matches.length < limit) {
    const catMatches = source.filter(
      (p) => p.id !== current.id && p.category === cat && !matches.includes(p)
    );
    matches = matches.concat(catMatches);
  }
  if (matches.length < limit) {
    const allOther = source.filter(
      (p) => p.id !== current.id && !matches.includes(p)
    );
    matches = matches.concat(allOther);
  }
  return matches.slice(0, limit);
}

export function getFeaturedProducts(limit = 4, customSource?: Product[]): Product[] {
  const source = customSource && customSource.length > 0 ? customSource : PRODUCTS_DATA;
  return source.filter((p) => p.category === "cakes").slice(0, limit);
}

export function getAllProductSlugs(customSource?: Product[]): string[] {
  const source = customSource && customSource.length > 0 ? customSource : PRODUCTS_DATA;
  return source.map((p) => p.id);
}
