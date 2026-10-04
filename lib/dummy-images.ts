/**
 * Lollipop Bakery - High-Quality Realistic Product Card Images
 * Replaces painted/vector illustrations on product item cards with photorealistic bakery photos.
 */

export function getProductCardImage(product: {
  id?: string;
  name?: string;
  category?: string;
  subCategory?: string;
  categoryName?: string;
  image?: string;
}): string {
  const name = (product.name || "").toLowerCase();
  const id = (product.id || "").toLowerCase();
  const cat = (product.category || product.categoryName || product.subCategory || "").toLowerCase();

  // 1. SNACKS & BAKERY ITEMS
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

  // 2. DRY CAKES
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

  // 3. CAKES (FLAVORS & SPECIALTIES)
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

  // 4. Default Cake Fallback
  return "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80";
}
