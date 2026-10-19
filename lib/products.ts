import type { Product } from "@/types";
import rawProducts from "./products-data.json";

// The full 133-item catalog backup
export const PRODUCTS_DATA: Product[] = rawProducts as Product[];

export function normalizeProductImage(rawImage: string | null | undefined, name?: string): string {
  const clean = (rawImage || "").trim();

  // 1. If DB has an explicit Cloudflare R2 URL, remote HTTP/HTTPS, or data URL: ALWAYS return it directly
  if (clean && (clean.startsWith("http://") || clean.startsWith("https://") || clean.startsWith("data:"))) {
    return clean;
  }

  // 2. If it is already a valid custom path in public/ (and not a placeholder)
  if (clean && clean.startsWith("/") && clean !== "product.image" && !clean.includes("signature.cake")) {
    return clean;
  }

  // 3. Fallback only if image is missing or a known placeholder
  if (!clean || clean === "product.image" || clean.includes("signature.cake")) {
    const cakeName = (name || "").toLowerCase();
    if (cakeName.includes("black forest") || cakeName.includes("german black")) {
      return "/PRODUCT_IMAGES/cakes/NORMAL CAKES/black_forest.webp";
    }
    return "/PRODUCT_IMAGES/cakes/NORMAL CAKES/black_forest.webp";
  }

  let img = clean;
  if (!img.startsWith("/") && !img.startsWith("http://") && !img.startsWith("https://") && !img.startsWith("data:")) {
    img = `/${img}`;
  }

  if (img.startsWith("/images/Cakes/")) {
    img = img
      .replace("/images/Cakes/", "/PRODUCT_IMAGES/cakes/NORMAL CAKES/")
      .replace(/\.jpg$/i, ".webp");
  }

  if (img.includes("/NORMAL CAKES/") && img.endsWith(".jpg")) {
    img = img.replace(/\.jpg$/i, ".webp");
  }

  if (img.includes("/PRODUCT_IMAGES/Snacks/") && img.endsWith(".png")) {
    img = img.replace(/\.png$/i, ".webp");
  }

  return img;
}

/**
 * Fetch live active products from Neon PostgreSQL database.
 * Uses direct Neon serverless driver with auto-retry and Prisma Client fallback.
 * Falls back to PRODUCTS_DATA if database is unavailable.
 */
export async function getDbProducts(): Promise<Product[]> {
  if (typeof window !== "undefined") {
    return PRODUCTS_DATA;
  }

  // 1. Primary: Direct high-performance Neon PostgreSQL serverless HTTP query
  try {
    const { getNeonSql } = await import("./neon");
    const sql = getNeonSql();
    if (sql) {
      let rows: any = null;
      let lastErr: any = null;

      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          rows = await sql`
            SELECT p.id, p.product_code, p.name, p.slug, p.description, p.image_name, p.badge, 
                   p.rating, p.review_count, p.is_active, p.product_type, p.eggless_available,
                   c.name as category_name, c.slug as category_slug,
                   COALESCE(
                     json_agg(
                       json_build_object(
                         'name', v.name,
                         'price', v.price,
                         'is_eggless', v.is_eggless,
                         'is_available', v.is_available,
                         'offer', v.offer
                       )
                     ) FILTER (WHERE v.id IS NOT NULL), '[]'
                   ) as variants
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN product_variants v ON v.product_id = p.id AND v.is_available = true
            WHERE p.is_active = true
            GROUP BY p.id, c.id
            ORDER BY p.id ASC
          `;
          if (rows) break;
        } catch (err: any) {
          lastErr = err;
          if (attempt === 1) {
            // Pause 500ms to allow sleeping compute endpoint to complete wake-up
            await new Promise((r) => setTimeout(r, 500));
          }
        }
      }

      if (rows && rows.length > 0) {
        return rows.map((p: any) => {
          const catSlug = (p.category_slug || "").toLowerCase();
          let mainCategory = "cakes";
          if (p.product_type === "SNACK" || ["breads", "buns", "puffs", "cookies", "brownies", "cup-cakes", "doughnuts", "snacks"].includes(catSlug)) {
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

          const isCakeCategory = ["cakes", "bento-cake", "wedding-cakes", "first-birthday", "custom-cake"].includes(mainCategory);

          const variantsList = Array.isArray(p.variants) ? p.variants : [];
          const mappedVariants = variantsList.map((v: any) => ({
            weight: v.name,
            price: Number(v.price),
            originalPrice: Number(v.price),
            // Offer is strictly for cakes only
            offer: isCakeCategory ? (v.offer || ((p.badge || "").includes("1kg Free") ? "Buy 1kg Get 1/2kg Free (Offer)" : undefined)) : undefined,
            isEggless: Boolean(v.is_eggless),
          }));

          const minPrice = mappedVariants.length > 0 ? Math.min(...mappedVariants.map((v: any) => v.price)) : 0;
          const hasEggless = isCakeCategory && mappedVariants.some((v: any) => v.isEggless);

          // Eggless available determination:
          // If explicitly in database, use it. For bento-cake default to false (always egg unless admin enabled).
          let egglessAvail: boolean;
          if (p.eggless_available !== null && p.eggless_available !== undefined) {
            egglessAvail = Boolean(p.eggless_available);
          } else if (mainCategory === "bento-cake") {
            egglessAvail = false;
          } else {
            egglessAvail = isCakeCategory;
          }

          return {
            id: p.slug,
            slug: p.slug,
            name: p.name,
            baseName: p.name,
            category: mainCategory,
            subCategory: p.category_name || "Cakes",
            categoryName: p.category_name || "Cakes",
            price: minPrice,
            minPrice,
            originalPrice: minPrice,
            image: normalizeProductImage(p.image_name, p.name),
            rating: Number(p.rating),
            reviewCount: p.review_count,
            badge: p.badge || undefined,
            description: p.description || "",
            variants: mappedVariants,
            isEggless: hasEggless,
            egglessAvailable: egglessAvail,
            productCode: p.product_code,
          };
        });
      }

      if (lastErr) {
        console.warn("⚠️ [Neon PostgreSQL] Direct SQL query notice:", lastErr?.message || lastErr);
      }
    }
  } catch (neonErr: any) {
    console.warn("⚠️ [Neon PostgreSQL] Direct query attempt failed:", neonErr?.message || neonErr);
  }

  // 2. Secondary: Prisma Client PostgreSQL connection
  try {
    const { prisma } = await import("./prisma");
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

    if (dbProducts && dbProducts.length > 0) {
      return dbProducts.map((p: any) => {
        const variants = p.variants.map((v: any) => {
          const hasOffer = p.offers.some((o: any) => o.buyVariantId === v.id);
          return {
            weight: v.name,
            price: Number(v.price),
            originalPrice: Number(v.price),
            offer: (v as any).offer || (hasOffer ? (p.badge || "Buy 1kg Get 1/2kg Free (Offer)") : undefined),
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

        const isCakeCategory = ["cakes", "bento-cake", "wedding-cakes", "first-birthday", "custom-cake"].includes(mainCategory);
        const hasEgglessVariant = isCakeCategory && p.variants.some((v: any) => v.isEggless);

        // Filter offers for cakes only
        const cakeVariants = variants.map((v: any) => ({
          ...v,
          offer: isCakeCategory ? v.offer : undefined,
        }));

        let egglessAvail: boolean;
        if ((p as any).egglessAvailable !== null && (p as any).egglessAvailable !== undefined) {
          egglessAvail = Boolean((p as any).egglessAvailable);
        } else if (mainCategory === "bento-cake") {
          egglessAvail = false;
        } else {
          egglessAvail = isCakeCategory;
        }

        return {
          id: p.slug,
          slug: p.slug,
          name: p.name,
          baseName: p.name,
          category: mainCategory,
          subCategory: p.category.name,
          categoryName: p.category.name,
          price: minPrice,
          minPrice,
          originalPrice: minPrice,
          image: normalizeProductImage(p.imageName, p.name),
          rating: Number(p.rating),
          reviewCount: p.reviewCount,
          badge: p.badge || undefined,
          description: p.description || "",
          variants: cakeVariants,
          isEggless: hasEgglessVariant,
          egglessAvailable: egglessAvail,
          productCode: p.productCode,
        };
      });
    }
  } catch (prismaErr: any) {
    console.warn("⚠️ [Neon PostgreSQL] Prisma pooler fallback failed:", prismaErr?.message || prismaErr);
  }

  // 3. Fallback: Static products catalog backup
  console.warn("⚠️ [Neon PostgreSQL] Database unavailable, serving catalog from local cache.");
  return PRODUCTS_DATA;
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
