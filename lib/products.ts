import type { Product } from "@/types";
import rawProducts from "./products-data.json";

// The full 133-item catalog, migrated verbatim from the original
// assets/js/products.js (auto-generated from Lollipop_Menu_Final_Catchy.xlsx).
export const PRODUCTS_DATA: Product[] = rawProducts as Product[];

/**
 * Slugify a product's display name the same way the legacy site did,
 * for fuzzy-matching legacy links like /product-detail.html?id=...
 */
function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

/**
 * Get the display price for a product card: explicit price, else the
 * catalog's minPrice, else the first variant's price.
 */
export function getCardPrice(p: Product): number {
  return p.price ?? p.minPrice ?? p.variants?.[0]?.price ?? 0;
}

export function getCardOriginalPrice(p: Product): number {
  return (
    p.originalPrice ??
    p.variants?.[0]?.originalPrice ??
    getCardPrice(p)
  );
}

/**
 * Ported 1:1 from getProductsByCategory() in the legacy products.js —
 * same fuzzy category/subcategory/keyword matching rules.
 */
export function getProductsByCategory(cat?: string | null): Product[] {
  if (!cat || cat === "all" || cat.toLowerCase().trim() === "all") {
    return PRODUCTS_DATA;
  }

  const query = cat.toLowerCase().trim();
  const queryClean = query.replace(/[^a-z0-9]/g, "");

  const strictMatches = PRODUCTS_DATA.filter(
    (p) => (p.category || "").toLowerCase().trim() === query
  );
  if (strictMatches.length > 0) return strictMatches;

  return PRODUCTS_DATA.filter((p) => {
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

/**
 * Ported 1:1 from getProductById() in the legacy products.js.
 */
export function getProductById(id?: string | null): Product | null {
  if (!id || !id.trim()) return null;
  const clean = id.toLowerCase().trim();

  let found = PRODUCTS_DATA.find(
    (p) => p.id === clean || p.id.toLowerCase() === clean
  );
  if (found) return found;

  found = PRODUCTS_DATA.find(
    (p) =>
      p.id.toLowerCase().endsWith(clean) || clean.endsWith(p.id.toLowerCase())
  );
  if (found) return found;

  found = PRODUCTS_DATA.find(
    (p) =>
      slugify(p.name).includes(clean) || clean.includes(slugify(p.name))
  );
  if (found) return found;

  return null;
}

/**
 * Ported 1:1 from getSimilarProducts() in the legacy products.js.
 */
export function getSimilarProducts(currentId: string, limit = 4): Product[] {
  const current = getProductById(currentId);
  if (!current) return PRODUCTS_DATA.slice(0, limit);

  const cat = current.category;
  const sub = current.subCategory;

  let matches = PRODUCTS_DATA.filter(
    (p) => p.id !== current.id && p.subCategory === sub
  );
  if (matches.length < limit) {
    const catMatches = PRODUCTS_DATA.filter(
      (p) => p.id !== current.id && p.category === cat && !matches.includes(p)
    );
    matches = matches.concat(catMatches);
  }
  if (matches.length < limit) {
    const allOther = PRODUCTS_DATA.filter(
      (p) => p.id !== current.id && !matches.includes(p)
    );
    matches = matches.concat(allOther);
  }
  return matches.slice(0, limit);
}

export function getFeaturedProducts(limit = 4): Product[] {
  return PRODUCTS_DATA.filter((p) => p.category === "cakes").slice(0, limit);
}

export function getAllProductSlugs(): string[] {
  return PRODUCTS_DATA.map((p) => p.id);
}
