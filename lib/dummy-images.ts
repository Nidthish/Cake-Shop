/**
 * Lollipop Bakery - High-Quality Realistic Product Card Images
 * Provides photorealistic bakery photos & internet fallback images from Unsplash.
 */

export interface ProductLike {
  id?: string;
  name?: string;
  category?: string;
  subCategory?: string;
  categoryName?: string;
  image?: string;
}

/**
 * Returns a curated photorealistic Unsplash dummy internet image for any cake or bakery item.
 */
export function getDummyInternetImage(product: ProductLike): string {
  const name = (product.name || "").toLowerCase();
  const id = (product.id || "").toLowerCase();
  const cat = (product.category || product.categoryName || product.subCategory || "").toLowerCase();

  // 1. BENTO CAKES
  if (cat.includes("bento") || id.startsWith("bento-") || name.includes("bento")) {
    if (name.includes("white") || name.includes("heart") || name.includes("minimalist")) {
      return "https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=600&q=80"; // Aesthetic white heart cake
    }
    if (name.includes("biscoff") || name.includes("lotus") || name.includes("caramel")) {
      return "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=600&q=80"; // Caramel biscoff drip bento
    }
    if (name.includes("lavender") || name.includes("butterfly") || name.includes("pink") || name.includes("floral")) {
      return "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=600&q=80"; // Pastel butterfly floral cake
    }
    if (name.includes("strawberry") || name.includes("berry") || name.includes("fruit")) {
      return "https://images.unsplash.com/photo-1611293388250-580b08c4a145?auto=format&fit=crop&w=600&q=80"; // Chocolate strawberry bento
    }
    if (name.includes("love") || name.includes("couple") || name.includes("romantic")) {
      return "https://images.unsplash.com/photo-1586788680434-30d324b2d46f?auto=format&fit=crop&w=600&q=80"; // Romantic celebration cake
    }
    // Default Bento: Chocolate / Nutella drip
    return "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80";
  }

  // 2. WEDDING CAKES
  if (cat.includes("wedding") || id.startsWith("wedding-") || name.includes("wedding") || name.includes("tier")) {
    if (name.includes("rose") || name.includes("blush") || name.includes("crown") || name.includes("crimson")) {
      return "https://images.unsplash.com/photo-1525253086316-d0c936c81488?auto=format&fit=crop&w=600&q=80"; // Romantic rose tiered wedding cake
    }
    if (name.includes("floating") || name.includes("grand") || name.includes("luxury")) {
      return "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=600&q=80"; // Multi-tier architectural luxury cake
    }
    if (name.includes("orchid") || name.includes("blue") || name.includes("lavender")) {
      return "https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=600&q=80"; // Elegant floral tiered cake
    }
    // Default Wedding: Grand multi-tier white floral cake
    return "https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=600&q=80";
  }

  // 3. 1ST BIRTHDAY CAKES
  if (cat.includes("1st") || cat.includes("birthday") || id.startsWith("fbd-") || name.includes("1st birthday")) {
    if (name.includes("safari") || name.includes("jungle") || name.includes("dino") || name.includes("lion")) {
      return "https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?auto=format&fit=crop&w=600&q=80"; // Safari party celebration cake
    }
    if (name.includes("teddy") || name.includes("balloon") || name.includes("elephant") || name.includes("train")) {
      return "https://images.unsplash.com/photo-1574085733277-851d9d856a3a?auto=format&fit=crop&w=600&q=80"; // Pastel milestone celebration cake
    }
    if (name.includes("princess") || name.includes("castle") || name.includes("tiara") || name.includes("queen")) {
      return "https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=600&q=80"; // Royal princess castle celebration cake
    }
    if (name.includes("star") || name.includes("twinkle") || name.includes("rainbow") || name.includes("shark") || name.includes("cocomelon")) {
      return "https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=600&q=80"; // Vibrant kids celebration milestone cake
    }
    // Default 1st Birthday
    return "https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?auto=format&fit=crop&w=600&q=80";
  }

  // 4. SNACKS & BAKERY ITEMS
  if (
    cat.includes("snack") ||
    cat.includes("puff") ||
    cat.includes("bread") ||
    cat.includes("bun") ||
    cat.includes("brownie") ||
    cat.includes("cookie") ||
    cat.includes("pastr")
  ) {
    if (name.includes("puff")) {
      return "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80"; // Golden flaky puff pastry
    }
    if (name.includes("brownie")) {
      return "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80"; // Rich chocolate walnut brownie
    }
    if (name.includes("bun")) {
      return "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80"; // Fresh bakery dinner buns
    }
    if (name.includes("bread")) {
      return "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80"; // Sliced loaf
    }
    if (name.includes("cup") || name.includes("cupcake")) {
      return "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&w=600&q=80"; // Gourmet frosted cupcakes
    }
    if (name.includes("cookie")) {
      return "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=600&q=80"; // Fresh bakery butter cookies
    }
    if (name.includes("pizza")) {
      return "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80"; // Pizza base
    }
    return "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80";
  }

  // 5. DRY CAKES
  if (
    cat.includes("dry") ||
    name.includes("tea cake") ||
    name.includes("plum") ||
    name.includes("sponge") ||
    name.includes("pudding")
  ) {
    if (name.includes("plum")) {
      return "https://images.unsplash.com/photo-1543508282-6319a3e2621f?auto=format&fit=crop&w=600&q=80"; // Traditional rich plum cake
    }
    if (name.includes("tea") || name.includes("plain") || name.includes("sponge") || name.includes("pudding")) {
      return "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=600&q=80"; // Golden tea cake loaf
    }
    return "https://images.unsplash.com/photo-1543508282-6319a3e2621f?auto=format&fit=crop&w=600&q=80";
  }

  // 6. CAKES (FLAVORS & SPECIALTIES - REAL 1024x1024 WEBP IMAGES)
  if (name.includes("black forest") || name.includes("german black")) {
    return "/PRODUCT_IMAGES/cakes/NORMAL CAKES/black_forest.webp";
  }
  if (name.includes("white forest")) {
    return "/PRODUCT_IMAGES/cakes/NORMAL CAKES/white_forest.webp";
  }
  if (name.includes("butter scotch") || name.includes("butterscotch")) {
    return "/PRODUCT_IMAGES/cakes/NORMAL CAKES/butter_scotch.webp";
  }
  if (name.includes("caramel")) {
    return "/PRODUCT_IMAGES/cakes/NORMAL CAKES/caramel.webp";
  }
  if (name.includes("mango")) {
    return "/PRODUCT_IMAGES/cakes/NORMAL CAKES/mango.webp";
  }
  if (name.includes("strawberry") && !name.includes("choco")) {
    return "/PRODUCT_IMAGES/cakes/NORMAL CAKES/strawberry.webp";
  }
  if (name.includes("pineapple")) {
    return "/PRODUCT_IMAGES/cakes/NORMAL CAKES/pineapple.webp";
  }
  if (name.includes("red velvet") || name.includes("redvelvet") || name.includes("red bee")) {
    return "/PRODUCT_IMAGES/cakes/NORMAL CAKES/red_velvet.webp";
  }
  if (name.includes("blueberry")) {
    return "/PRODUCT_IMAGES/cakes/NORMAL CAKES/blueberry.webp";
  }
  if (name.includes("black currant") || name.includes("currant")) {
    return "/PRODUCT_IMAGES/cakes/NORMAL CAKES/black_currant.webp";
  }
  if (name.includes("kiwi")) {
    return "/PRODUCT_IMAGES/cakes/NORMAL CAKES/kiwi.webp";
  }
  if (name.includes("ferrero rocher")) {
    return "/PRODUCT_IMAGES/cakes/NORMAL CAKES/ferrero_rocher.webp";
  }
  if (name.includes("ferrero truffle") || name.includes("ferrero")) {
    return "/PRODUCT_IMAGES/cakes/NORMAL CAKES/ferrero_truffle.webp";
  }
  if (name.includes("nutella")) {
    return "/PRODUCT_IMAGES/cakes/NORMAL CAKES/nutella.webp";
  }
  if (name.includes("kit kat") || name.includes("kitkat")) {
    return "/PRODUCT_IMAGES/cakes/NORMAL CAKES/choco_kit_kat.webp";
  }
  if (name.includes("oreo")) {
    return "/PRODUCT_IMAGES/cakes/NORMAL CAKES/choco_oreo.webp";
  }
  if (name.includes("snickers")) {
    return "/PRODUCT_IMAGES/cakes/NORMAL CAKES/choco_snickers.webp";
  }
  if (name.includes("choco almond")) {
    return "/PRODUCT_IMAGES/cakes/NORMAL CAKES/choco_almond.webp";
  }
  if (name.includes("choco delight")) {
    return "/PRODUCT_IMAGES/cakes/NORMAL CAKES/choco_delight.webp";
  }
  if (name.includes("choco fantacy")) {
    return "/PRODUCT_IMAGES/cakes/NORMAL CAKES/choco_fantacy.webp";
  }
  if (name.includes("choco nuts")) {
    return "/PRODUCT_IMAGES/cakes/NORMAL CAKES/choco_nuts.webp";
  }
  if (name.includes("choco redvelvet")) {
    return "/PRODUCT_IMAGES/cakes/NORMAL CAKES/choco_redvelvet.webp";
  }
  if (name.includes("choco strawberry")) {
    return "/PRODUCT_IMAGES/cakes/NORMAL CAKES/choco_strawberry.webp";
  }
  if (name.includes("choco vanilla")) {
    return "/PRODUCT_IMAGES/cakes/NORMAL CAKES/choco_vanilla.webp";
  }
  if (name.includes("truffle") || name.includes("choco") || name.includes("chocolate")) {
    return "/PRODUCT_IMAGES/cakes/NORMAL CAKES/choco_truffle.webp";
  }
  if (name.includes("pista") || name.includes("pistachio")) {
    return "/PRODUCT_IMAGES/cakes/NORMAL CAKES/pista.webp";
  }
  if (name.includes("coffee") || name.includes("iris")) {
    return "/PRODUCT_IMAGES/cakes/NORMAL CAKES/iris_coffee.webp";
  }
  if (name.includes("rasamalai")) {
    return "/PRODUCT_IMAGES/cakes/NORMAL CAKES/rasamalai.webp";
  }
  if (name.includes("rasagulla")) {
    return "/PRODUCT_IMAGES/cakes/NORMAL CAKES/rasagulla.webp";
  }
  if (name.includes("gulab jamun")) {
    return "/PRODUCT_IMAGES/cakes/NORMAL CAKES/gulab_jamun.webp";
  }
  if (name.includes("vancho")) {
    return "/PRODUCT_IMAGES/cakes/NORMAL CAKES/vancho.webp";
  }
  if (name.includes("coconut") || name.includes("soconut")) {
    return "/PRODUCT_IMAGES/cakes/NORMAL CAKES/tender_coconut.webp";
  }
  if (name.includes("raffaello")) {
    return "/PRODUCT_IMAGES/cakes/NORMAL CAKES/raffaello_cake.webp";
  }
  if (name.includes("biscoff") || name.includes("lotus")) {
    return "/PRODUCT_IMAGES/cakes/NORMAL CAKES/louts_biscoff.webp";
  }
  if (name.includes("fudge nut") || name.includes("fudge")) {
    return "/PRODUCT_IMAGES/cakes/NORMAL CAKES/fudge_nut.webp";
  }
  if (name.includes("milky truffle")) {
    return "/PRODUCT_IMAGES/cakes/NORMAL CAKES/milky_truffle.webp";
  }
  if (name.includes("nutty bubble")) {
    return "/PRODUCT_IMAGES/cakes/NORMAL CAKES/nutty_bubble.webp";
  }
  if (name.includes("nutty choco")) {
    return "/PRODUCT_IMAGES/cakes/NORMAL CAKES/nutty_choco_truffle.webp";
  }
  if (name.includes("nutty ferrero")) {
    return "/PRODUCT_IMAGES/cakes/NORMAL CAKES/nutty_ferrero_truffle.webp";
  }
  if (name.includes("2 in 1") || name.includes("2_in_1")) {
    return "/PRODUCT_IMAGES/cakes/NORMAL CAKES/2_in_1_fruit_cake_flavour.webp";
  }
  if (name.includes("3 in 1") || name.includes("3_in_1")) {
    return "/PRODUCT_IMAGES/cakes/NORMAL CAKES/3_in_1_fruit_cake_flavour.webp";
  }
  if (name.includes("fruit fantacy")) {
    return "/PRODUCT_IMAGES/cakes/NORMAL CAKES/fruit_fantacy.webp";
  }
  if (name.includes("spanish delight")) {
    return "/PRODUCT_IMAGES/cakes/NORMAL CAKES/spanish_delight.webp";
  }

  // If category is cakes or subcategory is cakes, return black forest webp as default
  if (cat.includes("cake")) {
    return "/PRODUCT_IMAGES/cakes/NORMAL CAKES/black_forest.webp";
  }

  // 7. General Default Fallback
  return "/PRODUCT_IMAGES/cakes/NORMAL CAKES/black_forest.webp";
}

/**
 * Returns the fallback image URL for onError image events
 */
export function getDummyFallbackImage(product: ProductLike): string {
  const name = (product.name || "").toLowerCase();
  if (name.includes("black forest") || name.includes("german black")) {
    return "/PRODUCT_IMAGES/cakes/NORMAL CAKES/black_forest.webp";
  }
  if (product.image && (product.image.includes("black_forest") || product.image.includes("1791131428600"))) {
    return "/PRODUCT_IMAGES/cakes/NORMAL CAKES/black_forest.webp";
  }
  if (product.image && product.image.includes("/NORMAL CAKES/")) {
    let img = product.image.trim();
    if (!img.startsWith("/")) img = `/${img}`;
    return img.replace(/\.jpg$/i, ".webp");
  }
  return getDummyInternetImage(product);
}

/**
 * Main function returning the display image for a product card.
 * Prioritizes actual product image when provided, and cleanly maps
 * cakes to their real 1024x1024 WebP image files in public/PRODUCT_IMAGES/cakes/NORMAL CAKES/.
 */
export function getProductCardImage(product: ProductLike): string {
  let img = product.image ? product.image.trim() : "";

  // Dynamically rewrite legacy Cloudflare R2 URLs to the new custom domain
  if (img && img.includes(".r2.dev/")) {
    img = img.replace(/https?:\/\/[a-z0-9-]+\.r2\.dev\//i, "https://images.lollipopcakeshop.in/");
  }

  // 1. If product has an explicit Cloudflare R2 URL or remote HTTP/HTTPS/data image, use it directly
  if (img && (img.startsWith("http://") || img.startsWith("https://") || img.startsWith("data:"))) {
    return img;
  }

  // 2. If it is already a valid absolute path in public/
  if (img && img.startsWith("/") && img !== "product.image" && !img.includes("signature.cake")) {
    return img;
  }

  // 3. Fallback only if no image or placeholder provided
  if (!img || img === "product.image" || img.includes("signature.cake")) {
    const name = (product.name || "").toLowerCase();
    if (name.includes("black forest") || name.includes("german black")) {
      return "/PRODUCT_IMAGES/cakes/NORMAL CAKES/black_forest.webp";
    }
    return getDummyInternetImage(product);
  }

  if (!img.startsWith("/") && !img.startsWith("http://") && !img.startsWith("https://") && !img.startsWith("data:")) {
    img = `/${img}`;
  }
  if (img.startsWith("/images/Cakes/")) {
    return img
      .replace("/images/Cakes/", "/PRODUCT_IMAGES/cakes/NORMAL CAKES/")
      .replace(/\.jpg$/i, ".webp");
  }
  if (img.includes("/NORMAL CAKES/") && img.endsWith(".jpg")) {
    return img.replace(/\.jpg$/i, ".webp");
  }
  if (img.includes("/PRODUCT_IMAGES/Snacks/") && img.endsWith(".png")) {
    return img.replace(/\.png$/i, ".webp");
  }
  return img;
}
