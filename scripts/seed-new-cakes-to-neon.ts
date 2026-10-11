import { getNeonSql } from "../lib/neon";
import fs from "fs";
import path from "path";

// Auto-load .env
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

function parseWeight(weightStr: string): { value: number | null; unit: string | null } {
  const match = weightStr.match(/^([\d.]+)\s*(kg|g|grm|gram|grams)?/i);
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
  if (w.includes("4kg")) return "32-40 Servings";
  if (w.includes("5kg")) return "40-50 Servings";
  if (w.includes("bento") || w.includes("350g") || w.includes("300g")) return "1-2 Servings";
  return "Custom Servings";
}

async function main() {
  console.log("⚡ Connecting to Neon PostgreSQL...");
  const sql = getNeonSql();
  if (!sql) {
    throw new Error("Could not initialize Neon SQL client.");
  }

  // Read new-cakes.json
  const cakesJsonPath = path.resolve(process.cwd(), "new-cakes.json");
  const rawData = fs.readFileSync(cakesJsonPath, "utf-8");
  const cakes: any[] = JSON.parse(rawData);

  console.log(`📋 Found ${cakes.length} cakes in new-cakes.json to sync into Neon DB.`);

  // 1. Ensure Categories Exist
  const categoryDefs = [
    {
      name: "Bento Cakes",
      slug: "bento-cakes",
      description: "Adorable Korean minimalist bento box lunchbox cakes in cute pastel shades.",
      imageName: "/PRODUCT_IMAGES/cakes/BENTO CAKES/classic-white-heart-bento-cake.jpeg",
    },
    {
      name: "Wedding Cakes",
      slug: "wedding-cakes",
      description: "Exquisite handcrafted multi-tier wedding and anniversary cakes.",
      imageName: "/PRODUCT_IMAGES/cakes/WEDDING CAKES/royal-blush-crown-2tier-wedding-cake.jpeg",
    },
    {
      name: "1st Birthday Cakes",
      slug: "first-birthday-cakes",
      description: "Delightful handcrafted first birthday theme cakes for baby milestones.",
      imageName: "/PRODUCT_IMAGES/cakes/1ST BIRTHDAY CAKES/cocomelon-adventure-2tier-1st-birthday-cake.jpeg",
    },
  ];

  const categoryDbIds = new Map<string, number>();

  for (const cat of categoryDefs) {
    const rows = await sql`
      INSERT INTO categories (name, slug, description, image_name, created_at, updated_at)
      VALUES (${cat.name}, ${cat.slug}, ${cat.description}, ${cat.imageName}, NOW(), NOW())
      ON CONFLICT (slug)
      DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, image_name = EXCLUDED.image_name, updated_at = NOW()
      RETURNING id, name, slug;
    `;
    const catId = Number(rows[0].id);
    categoryDbIds.set(cat.slug, catId);
    categoryDbIds.set(cat.name, catId);
    console.log(`✅ Category ready: "${cat.name}" (id: ${catId}, slug: "${cat.slug}")`);
  }

  // Also map aliases
  const bentoId = categoryDbIds.get("Bento Cakes")!;
  const weddingId = categoryDbIds.get("Wedding Cakes")!;
  const firstBirthdayId = categoryDbIds.get("1st Birthday Cakes")!;

  categoryDbIds.set("bento-cake", bentoId);
  categoryDbIds.set("wedding-cakes", weddingId);
  categoryDbIds.set("first-birthday", firstBirthdayId);

  // 2. Insert or Update Products & Variants
  let insertedCount = 0;
  let variantCount = 0;

  for (const cake of cakes) {
    let catId = categoryDbIds.get(cake.category) || categoryDbIds.get(cake.categoryName);
    if (!catId) {
      if (cake.category === "bento-cake" || cake.categoryName.includes("Bento")) catId = bentoId;
      else if (cake.category === "wedding-cakes" || cake.categoryName.includes("Wedding")) catId = weddingId;
      else catId = firstBirthdayId;
    }

    const productCode = cake.productCode;
    const slug = cake.id;
    const name = cake.name;
    const description = cake.description || `${cake.name} freshly handcrafted by Lollipop Cake Shop.`;
    const imageName = cake.image;
    const badge = cake.badge || null;
    const rating = Number(cake.rating) || 4.9;
    const reviewCount = Number(cake.reviewCount) || 30;

    // Check if product exists by product_code or slug
    const existing = await sql`
      SELECT id FROM products WHERE product_code = ${productCode} OR slug = ${slug} LIMIT 1;
    `;

    let productId: number;

    if (existing && existing.length > 0) {
      productId = Number(existing[0].id);
      await sql`
        UPDATE products SET
          category_id = ${catId},
          product_code = ${productCode},
          name = ${name},
          slug = ${slug},
          description = ${description},
          image_name = ${imageName},
          badge = ${badge},
          rating = ${rating},
          review_count = ${reviewCount},
          product_type = 'CAKE'::"ProductType",
          is_active = true,
          updated_at = NOW()
        WHERE id = ${productId};
      `;
      // Delete old variants to re-insert freshly
      await sql`DELETE FROM product_variants WHERE product_id = ${productId};`;
    } else {
      const pRows = await sql`
        INSERT INTO products (
          category_id, product_code, name, slug, description, image_name, badge, rating, review_count, product_type, is_active, created_at, updated_at
        ) VALUES (
          ${catId}, ${productCode}, ${name}, ${slug}, ${description}, ${imageName}, ${badge}, ${rating}, ${reviewCount}, 'CAKE'::"ProductType", true, NOW(), NOW()
        )
        RETURNING id;
      `;
      productId = Number(pRows[0].id);
    }

    insertedCount++;

    // Insert variants
    const variants = cake.variants && cake.variants.length > 0
      ? cake.variants
      : [{ weight: "Regular", price: cake.minPrice || 399, originalPrice: cake.minPrice, offer: "" }];

    for (const v of variants) {
      const { value, unit } = parseWeight(v.weight);
      const variantName = v.weight || "Regular";
      const price = Number(v.price);
      const offer = v.offer || null;
      const serves = getServingSize(variantName);

      await sql`
        INSERT INTO product_variants (
          product_id, name, weight_value, weight_unit, price, is_eggless, serves, is_available, offer, created_at, updated_at
        ) VALUES (
          ${productId}, ${variantName}, ${value}, ${unit}, ${price}, false, ${serves}, true, ${offer}, NOW(), NOW()
        );
      `;
      variantCount++;
    }
  }

  console.log(`\n🎉 All ${insertedCount} new cakes and ${variantCount} variants successfully synced into Neon DB!`);

  // Verify counts in DB
  const totalInDb = await sql`SELECT count(*) FROM products;`;
  const newCakesInDb = await sql`
    SELECT count(*) 
    FROM products 
    WHERE product_code LIKE 'LLP-BNT-%' 
       OR product_code LIKE 'LLP-WED-%' 
       OR product_code LIKE 'LLP-FBD-%';
  `;
  console.log(`📊 Total products in Neon DB now: ${totalInDb[0].count}`);
  console.log(`🍰 New cakes in Neon DB (LLP-BNT, LLP-WED, LLP-FBD): ${newCakesInDb[0].count}`);
}

main().catch((err) => {
  console.error("❌ Failed to seed new cakes into Neon DB:", err);
  process.exit(1);
});
