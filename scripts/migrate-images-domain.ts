import fs from "fs";
import path from "path";

// Load .env
if (!process.env.DATABASE_URL) {
  const envPath = path.resolve(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf-8");
    for (const line of envContent.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        let val = trimmed.slice(eqIdx + 1).trim();
        if ((val.startsWith("'") && val.endsWith("'")) || (val.startsWith('"') && val.endsWith('"'))) {
          val = val.slice(1, -1);
        }
        if (key && !process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

import { prisma } from "../lib/prisma";

const OLD_R2_URL = "https://pub-cc78f2072e744ca2a82f1b0346156699.r2.dev";
const NEW_IMAGE_DOMAIN_URL = "https://images.lollipopcakeshop.in";

async function main() {
  console.log("🚀 Starting database image URL migration...");
  console.log(`Replacing: ${OLD_R2_URL} -> ${NEW_IMAGE_DOMAIN_URL}\n`);

  // 1. Products
  const products = await prisma.product.findMany({
    select: { id: true, name: true, slug: true, imageName: true },
  });

  const matchingProducts = products.filter(
    (p) => p.imageName && (p.imageName.includes("r2.dev") || p.imageName.includes("pub-cc78f2072e744ca2a82f1b0346156699"))
  );

  console.log(`Found ${matchingProducts.length} products to migrate:`);
  for (const prod of matchingProducts) {
    if (!prod.imageName) continue;
    const newImageName = prod.imageName
      .replace(OLD_R2_URL, NEW_IMAGE_DOMAIN_URL)
      .replace(/https?:\/\/[a-z0-9-]+\.r2\.dev/i, NEW_IMAGE_DOMAIN_URL);

    console.log(`  Updating product #${prod.id} (${prod.name}):`);
    console.log(`    FROM: ${prod.imageName}`);
    console.log(`    TO:   ${newImageName}`);

    await prisma.product.update({
      where: { id: prod.id },
      data: { imageName: newImageName },
    });
  }

  // 2. Categories
  const categories = await prisma.category.findMany({
    select: { id: true, name: true, slug: true, imageName: true },
  });
  const matchingCats = categories.filter(
    (c) => c.imageName && (c.imageName.includes("r2.dev") || c.imageName.includes("pub-cc78f2072e744ca2a82f1b0346156699"))
  );
  if (matchingCats.length > 0) {
    console.log(`\nFound ${matchingCats.length} categories to migrate:`);
    for (const cat of matchingCats) {
      if (!cat.imageName) continue;
      const newImageName = cat.imageName
        .replace(OLD_R2_URL, NEW_IMAGE_DOMAIN_URL)
        .replace(/https?:\/\/[a-z0-9-]+\.r2\.dev/i, NEW_IMAGE_DOMAIN_URL);

      console.log(`  Updating category #${cat.id} (${cat.name}):`);
      console.log(`    FROM: ${cat.imageName}`);
      console.log(`    TO:   ${newImageName}`);

      await prisma.category.update({
        where: { id: cat.id },
        data: { imageName: newImageName },
      });
    }
  } else {
    console.log("\nNo categories needed migration.");
  }

  // 3. Verification check
  console.log("\n🔍 Verifying all products in database...");
  const verifyProducts = await prisma.product.findMany({
    where: {
      imageName: {
        contains: "images.lollipopcakeshop.in",
      },
    },
    select: { id: true, name: true, imageName: true },
  });

  console.log(`✅ Successfully verified ${verifyProducts.length} products now using https://images.lollipopcakeshop.in:`);
  for (const vp of verifyProducts) {
    console.log(`  - #${vp.id} ${vp.name}: ${vp.imageName}`);
  }

  const lingeringOld = await prisma.product.findMany({
    where: {
      imageName: {
        contains: "r2.dev",
      },
    },
    select: { id: true, name: true, imageName: true },
  });
  if (lingeringOld.length === 0) {
    console.log("\n🎉 Zero products with old r2.dev domain remaining in DB!");
  } else {
    console.warn(`\n⚠️ Warning: ${lingeringOld.length} products still contain r2.dev:`, lingeringOld);
  }
}

main()
  .catch((e) => {
    console.error("Migration failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
