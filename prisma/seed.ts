import { PrismaClient, ProductType } from "@prisma/client";
import rawProducts from "../lib/products-data.json";

const prisma = new PrismaClient();

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function parseWeight(weightStr: string): { value: number | null; unit: string | null } {
  const match = weightStr.match(/^([\d.]+)\s*(kg|g|grm|gram|grams)?$/i);
  if (match) {
    return {
      value: parseFloat(match[1]),
      unit: (match[2] || "kg").toLowerCase(),
    };
  }
  return { value: null, unit: null };
}

function getServingSize(weightStr: string): string {
  const w = weightStr.toLowerCase();
  if (w.includes("0.5kg") || w.includes("500g")) return "4-6 Servings";
  if (w.includes("1kg")) return "8-10 Servings";
  if (w.includes("1.5kg")) return "12-14 Servings";
  if (w.includes("2kg")) return "16-20 Servings";
  if (w.includes("3kg")) return "24-30 Servings";
  if (w.includes("bento") || w.includes("mini")) return "1-2 Servings";
  if (w.includes("cupcake") || w.includes("piece")) return "1 Serving";
  return "Custom Servings";
}

async function main() {
  console.log("🌱 Starting MySQL Database Seed from products-data.json...");

  // 1. Group Categories
  const categoryMap = new Map<string, any>();
  for (const item of rawProducts) {
    const catName = item.categoryName || item.category || "Normal Flavors";
    if (!categoryMap.has(catName)) {
      categoryMap.set(catName, {
        name: catName,
        slug: slugify(catName),
        description: `Handcrafted fresh ${catName.toLowerCase()} cakes & bakery treats.`,
        imageName: item.image,
      });
    }
  }

  // Insert Categories
  const dbCategories = new Map<string, any>();
  for (const [catName, catData] of categoryMap.entries()) {
    const category = await prisma.category.upsert({
      where: { slug: catData.slug },
      update: { name: catData.name, description: catData.description, imageName: catData.imageName },
      create: {
        name: catData.name,
        slug: catData.slug,
        description: catData.description,
        imageName: catData.imageName,
      },
    });
    dbCategories.set(catName, category);
  }
  console.log(`✅ Seeded ${dbCategories.size} Categories.`);

  // 2. Insert Products & Variants
  let productCount = 0;
  let variantCount = 0;
  let offerCount = 0;

  for (let idx = 0; idx < rawProducts.length; idx++) {
    const item = rawProducts[idx];
    const catName = item.categoryName || item.category || "Normal Flavors";
    const category = dbCategories.get(catName);

    if (!category) continue;

    const productType: ProductType = catName.toLowerCase().includes("snack")
      ? ProductType.SNACK
      : ProductType.CAKE;

    const productCode = `LOL-${String(idx + 1).padStart(3, "0")}`;
    const productSlug = item.id || `${slugify(catName)}-${slugify(item.name)}`;

    const product = await prisma.product.upsert({
      where: { slug: productSlug },
      update: {
        name: item.name,
        productCode,
        description: item.description || `${item.name} freshly made cake.`,
        imageName: item.image,
        badge: item.badge || null,
        rating: item.rating ? item.rating : 5.0,
        reviewCount: item.reviewCount || 35,
        productType,
        isActive: true,
      },
      create: {
        categoryId: category.id,
        productCode,
        name: item.name,
        slug: productSlug,
        description: item.description || `${item.name} freshly made cake.`,
        imageName: item.image,
        badge: item.badge || null,
        rating: item.rating ? item.rating : 5.0,
        reviewCount: item.reviewCount || 35,
        productType,
        isActive: true,
      },
    });
    productCount++;

    // Insert Product Variants
    const variantsList = item.variants && item.variants.length > 0
      ? item.variants
      : [{ weight: "Regular", price: item.price || item.minPrice || 370 }];

    const dbVariants: any[] = [];
    for (const v of variantsList) {
      const { value, unit } = parseWeight(v.weight);
      const variantName = v.weight || "Regular";

      // Delete existing matching variant to ensure clean update
      await prisma.productVariant.deleteMany({
        where: { productId: product.id, name: variantName, isEggless: true },
      });

      const variant = await prisma.productVariant.create({
        data: {
          productId: product.id,
          name: variantName,
          weightValue: value,
          weightUnit: unit,
          price: v.price,
          isEggless: true,
          serves: getServingSize(variantName),
          isAvailable: true,
        },
      });
      dbVariants.push({ ...variant, rawOffer: (v as any).offer });
      variantCount++;
    }

    // 3. Insert Product Offers (Buy 1kg Get 0.5kg Free)
    const variant1kg = dbVariants.find(
      (v) =>
        v.name.toLowerCase().includes("1kg") ||
        (v.rawOffer && (v.rawOffer.includes("1/2kg") || v.rawOffer.includes("Free")))
    );
    const variant05kg = dbVariants.find(
      (v) => v.name.toLowerCase().includes("0.5kg") || v.name.toLowerCase().includes("500g")
    );

    if (variant1kg && variant05kg) {
      await prisma.productOffer.deleteMany({
        where: { productId: product.id },
      });

      await prisma.productOffer.create({
        data: {
          productId: product.id,
          buyVariantId: variant1kg.id,
          freeVariantId: variant05kg.id,
          buyQuantity: 1,
          freeQuantity: 1,
          isActive: true,
        },
      });
      offerCount++;
    }
  }

  console.log(`🎉 Seeding Completed!`);
  console.log(`📦 Categories: ${dbCategories.size}`);
  console.log(`🎂 Products: ${productCount}`);
  console.log(`⚖️ Variants: ${variantCount}`);
  console.log(`🎁 Buy-X-Get-Y Offers: ${offerCount}`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
