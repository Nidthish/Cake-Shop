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
      return "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80"; // Artisanal sliced loaf
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

  // 6. CAKES (FLAVORS & SPECIALTIES)
  if (name.includes("black forest") || name.includes("german black")) {
    return "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=600&q=80"; // Real layered Black Forest
  }
  if (name.includes("white forest")) {
    return "https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=600&q=80"; // Elegant White Forest cake
  }
  if (name.includes("butter scotch") || name.includes("butterscotch") || name.includes("caramel")) {
    return "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=600&q=80"; // Caramel butterscotch drip cake
  }
  if (name.includes("mango")) {
    return "https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=600&q=80"; // Fresh mango gateau
  }
  if (name.includes("strawberry")) {
    return "https://images.unsplash.com/photo-1611293388250-580b08c4a145?auto=format&fit=crop&w=600&q=80"; // Fresh strawberry cream cake
  }
  if (name.includes("pineapple")) {
    return "https://images.unsplash.com/photo-1549576490-b0b4831ef60a?auto=format&fit=crop&w=600&q=80"; // Fresh pineapple cake
  }
  if (name.includes("red velvet") || name.includes("redvelvet") || name.includes("red bee")) {
    return "https://images.unsplash.com/photo-1586788680434-30d324b2d46f?auto=format&fit=crop&w=600&q=80"; // Classic red velvet
  }
  if (
    name.includes("blueberry") ||
    name.includes("black currant") ||
    name.includes("currant") ||
    name.includes("kiwi")
  ) {
    return "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=600&q=80"; // Blueberry berry cake
  }
  if (
    name.includes("ferrero") ||
    name.includes("nutella") ||
    name.includes("hazelnut") ||
    name.includes("rocher")
  ) {
    return "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=600&q=80"; // Ferrero hazelnut chocolate
  }
  if (
    name.includes("kit kat") ||
    name.includes("kitkat") ||
    name.includes("oreo") ||
    name.includes("snickers")
  ) {
    return "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80"; // Cookies & cream / chocolate overload
  }
  if (
    name.includes("truffle") ||
    name.includes("choco") ||
    name.includes("chocolate") ||
    name.includes("fudge")
  ) {
    return "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80"; // Decadent chocolate truffle cake
  }
  if (name.includes("pista") || name.includes("pistachio")) {
    return "https://images.unsplash.com/photo-1562772186-08573190886a?auto=format&fit=crop&w=600&q=80"; // Pistachio green cream cake
  }
  if (name.includes("coffee") || name.includes("iris")) {
    return "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80"; // Mocha espresso coffee cake
  }
  if (
    name.includes("rasamalai") ||
    name.includes("rasagulla") ||
    name.includes("gulab jamun")
  ) {
    return "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80"; // Saffron cardamom fusion cake
  }
  if (
    name.includes("vancho") ||
    name.includes("vanilla") ||
    name.includes("coconut") ||
    name.includes("raffaello") ||
    name.includes("milky")
  ) {
    return "https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=600&q=80"; // Creamy white vanilla cake
  }
  if (name.includes("fruit")) {
    return "https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=600&q=80"; // Fresh exotic fruit cake
  }

  // 7. General Default Fallback
  return "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80";
}

/**
 * Returns the fallback image URL for onError image events
 */
export function getDummyFallbackImage(product: ProductLike): string {
  return getDummyInternetImage(product);
}

/**
 * Main function returning the display image for a product card.
 * Prioritizes actual product image when provided, and cleanly falls back to
 * high-resolution dummy internet images from Unsplash.
 */
export function getProductCardImage(product: ProductLike): string {
  if (
    product.image &&
    (product.image.startsWith("data:") ||
      product.image.startsWith("http://") ||
      product.image.startsWith("https://") ||
      product.image.startsWith("/"))
  ) {
    return product.image;
  }

  return getDummyInternetImage(product);
}
