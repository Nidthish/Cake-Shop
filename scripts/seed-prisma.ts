import { prisma } from "../lib/prisma";
import rawProducts from "../lib/products-data.json";
import { hashPassword } from "../lib/crypto";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

async function main() {
  console.log("🌱 [Prisma Seed] Starting Neon PostgreSQL Seeding...");

  // 1. Seed Initial Super Admin User
  const initialEmail = (process.env.INITIAL_ADMIN_EMAIL || "admin@lollipopcakeshop.com").trim().toLowerCase();
  const initialPassword = process.env.INITIAL_ADMIN_PASSWORD || "Admin@123456";

  const adminUser = await prisma.user.upsert({
    where: { email: initialEmail },
    update: {
      passwordHash: hashPassword(initialPassword),
      role: "SUPERADMIN",
      isActive: true,
    },
    create: {
      email: initialEmail,
      fullName: "Master Super Admin",
      passwordHash: hashPassword(initialPassword),
      phone: "+91 9876543210",
      role: "SUPERADMIN",
      isActive: true,
    },
  });

  console.log(`✅ Super Admin created/updated: ${adminUser.email}`);

  // 2. Seed Categories & Products from products-data.json
  const productsList = rawProducts as any[];
  console.log(`📦 Processing ${productsList.length} products into Neon PostgreSQL...`);

  // Map category names to IDs
  const categoryMap = new Map<string, bigint>();

  for (const item of productsList) {
    const categoryName = item.categoryName || item.category || "Cakes";
    const categorySlug = slugify(categoryName);

    if (!categoryMap.has(categorySlug)) {
      const category = await prisma.category.upsert({
        where: { slug: categorySlug },
        update: { name: categoryName },
        create: {
          name: categoryName,
          slug: categorySlug,
          description: `${categoryName} freshly baked at Lollipop Cake Shop`,
          imageName: item.image || "/images/hero_cake.png",
        },
      });
      categoryMap.set(categorySlug, category.id);
    }

    const categoryId = categoryMap.get(categorySlug)!;
    const productSlug = slugify(item.id || item.name);
    const productCode = item.productCode || item.id || `PRD-${slugify(item.name).toUpperCase()}`;

    // Create / Update Product
    const dbProduct = await prisma.product.upsert({
      where: { productCode },
      update: {
        name: item.name,
        slug: productSlug,
        description: item.description || "",
        imageName: item.image || "",
        badge: item.badge || null,
        rating: item.rating ? String(item.rating) : "5.00",
        reviewCount: item.reviewCount || 0,
        isActive: true,
        productType: categoryName.toLowerCase().includes("snack") ? "SNACK" : "CAKE",
      },
      create: {
        categoryId,
        productCode,
        name: item.name,
        slug: productSlug,
        description: item.description || "",
        imageName: item.image || "",
        badge: item.badge || null,
        rating: item.rating ? String(item.rating) : "5.00",
        reviewCount: item.reviewCount || 0,
        isActive: true,
        productType: categoryName.toLowerCase().includes("snack") ? "SNACK" : "CAKE",
      },
    });

    // Create Variants
    if (Array.isArray(item.variants) && item.variants.length > 0) {
      for (const v of item.variants) {
        const variantName = v.weight || "0.5kg";
        const isEggless = v.isEggless !== undefined ? v.isEggless : false;

        await prisma.productVariant.upsert({
          where: {
            productId_name_isEggless: {
              productId: dbProduct.id,
              name: variantName,
              isEggless,
            },
          },
          update: {
            price: v.price,
            isAvailable: true,
          },
          create: {
            productId: dbProduct.id,
            name: variantName,
            price: v.price,
            isEggless,
            isAvailable: true,
          },
        });
      }
    } else {
      // Default 0.5kg variant
      await prisma.productVariant.upsert({
        where: {
          productId_name_isEggless: {
            productId: dbProduct.id,
            name: "0.5kg",
            isEggless: false,
          },
        },
        update: {
          price: item.minPrice || item.price || 370,
          isAvailable: true,
        },
        create: {
          productId: dbProduct.id,
          name: "0.5kg",
          price: item.minPrice || item.price || 370,
          isEggless: false,
          isAvailable: true,
        },
      });
    }
  }

  console.log("🎉 [Prisma Seed] Neon PostgreSQL Database Seeding Completed Successfully!");
}

main()
  .catch((err) => {
    console.error("❌ Seeding Error:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
