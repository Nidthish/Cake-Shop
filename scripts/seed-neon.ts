import { neon } from "@neondatabase/serverless";
import rawProducts from "../lib/products-data.json";
import { hashPassword } from "../lib/crypto";
import fs from "fs";
import path from "path";

// Auto-load .env file variables if running outside Next.js process
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

/**
 * Lollipop Cake Shop — Neon PostgreSQL Seeding Script
 * Synchronizes schema tables and populates all 133 catalog products & default admin into Neon.
 */

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
  let connectionString = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;

  if (!connectionString) {
    console.error("❌ ERROR: DATABASE_URL is not set. Please add your Neon connection string to .env file.");
    process.exit(1);
  }

  // Clean pooler suffix for @neondatabase/serverless HTTP protocol
  connectionString = connectionString
    .replace("-pooler.", ".")
    .replace("&channel_binding=require", "")
    .replace("?channel_binding=require", "");

  console.log("⚡ Connecting to Neon PostgreSQL Serverless...");
  const sql = neon(connectionString);

  console.log("🛠️ Creating Neon Database tables if not exist...");

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id BIGSERIAL PRIMARY KEY,
      email VARCHAR(150) UNIQUE NOT NULL,
      password_hash VARCHAR(255),
      full_name VARCHAR(120) NOT NULL,
      phone VARCHAR(20),
      role VARCHAR(20) DEFAULT 'CUSTOMER',
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS categories (
      id BIGSERIAL PRIMARY KEY,
      name VARCHAR(100) UNIQUE NOT NULL,
      slug VARCHAR(120) UNIQUE NOT NULL,
      description TEXT,
      image_name VARCHAR(255),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id BIGSERIAL PRIMARY KEY,
      category_id BIGINT REFERENCES categories(id) ON DELETE CASCADE,
      product_code VARCHAR(30) UNIQUE NOT NULL,
      name VARCHAR(200) NOT NULL,
      slug VARCHAR(220) UNIQUE NOT NULL,
      description TEXT,
      image_name VARCHAR(255),
      badge VARCHAR(50),
      rating DECIMAL(3, 2) DEFAULT 5.00,
      review_count INT DEFAULT 0,
      is_active BOOLEAN DEFAULT TRUE,
      product_type VARCHAR(20) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS product_variants (
      id BIGSERIAL PRIMARY KEY,
      product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
      name VARCHAR(50) NOT NULL,
      weight_value DECIMAL(8, 3),
      weight_unit VARCHAR(10),
      price DECIMAL(10, 2) NOT NULL,
      is_eggless BOOLEAN DEFAULT TRUE,
      serves VARCHAR(50),
      is_available BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS product_offers (
      id BIGSERIAL PRIMARY KEY,
      product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
      buy_variant_id BIGINT REFERENCES product_variants(id) ON DELETE CASCADE,
      free_variant_id BIGINT REFERENCES product_variants(id) ON DELETE CASCADE,
      buy_quantity INT DEFAULT 1,
      free_quantity INT DEFAULT 1,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS orders (
      id BIGSERIAL PRIMARY KEY,
      order_number VARCHAR(50) UNIQUE NOT NULL,
      user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
      customer_name VARCHAR(120) NOT NULL,
      customer_email VARCHAR(150) NOT NULL,
      customer_phone VARCHAR(20) NOT NULL,
      street_address TEXT NOT NULL,
      city VARCHAR(80) NOT NULL,
      pincode VARCHAR(10) NOT NULL,
      state VARCHAR(80) DEFAULT 'Tamil Nadu',
      landmark VARCHAR(150),
      delivery_date TIMESTAMP WITH TIME ZONE NOT NULL,
      delivery_time_slot VARCHAR(50) NOT NULL,
      delivery_notes TEXT,
      has_eggless_items BOOLEAN DEFAULT FALSE,
      subtotal DECIMAL(10, 2) NOT NULL,
      sgst DECIMAL(10, 2) NOT NULL,
      cgst DECIMAL(10, 2) NOT NULL,
      tax_amount DECIMAL(10, 2) NOT NULL,
      delivery_fee DECIMAL(10, 2) DEFAULT 0.00,
      discount_amount DECIMAL(10, 2) DEFAULT 0.00,
      total_amount DECIMAL(10, 2) NOT NULL,
      status VARCHAR(30) DEFAULT 'PENDING',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  console.log("✅ Neon Database schema verified.");

  // Seed Admin User
  console.log("👤 Seeding default Super Admin user into Neon...");
  const adminEmail = "admin@lollipopcakeshop.com";
  const adminPasswordHash = hashPassword("Admin@123456");

  await sql`
    INSERT INTO users (email, password_hash, full_name, role, is_active)
    VALUES (${adminEmail}, ${adminPasswordHash}, 'Master Super Admin', 'SUPERADMIN', true)
    ON CONFLICT (email) 
    DO UPDATE SET password_hash = ${adminPasswordHash}, role = 'SUPERADMIN', is_active = true
  `;
  console.log("✅ Admin user ready: admin@lollipopcakeshop.com");

  // Seed Categories
  console.log("🌱 Seeding Categories into Neon...");
  const categoryMap = new Map<string, { name: string; slug: string; description: string; imageName: string }>();

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

  const categoryDbIds = new Map<string, number>();

  for (const [catName, catData] of categoryMap.entries()) {
    const rows = await sql`
      INSERT INTO categories (name, slug, description, image_name)
      VALUES (${catData.name}, ${catData.slug}, ${catData.description}, ${catData.imageName})
      ON CONFLICT (slug)
      DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, image_name = EXCLUDED.image_name
      RETURNING id
    `;
    categoryDbIds.set(catName, Number(rows[0].id));
  }
  console.log(`✅ Seeded ${categoryDbIds.size} categories into Neon.`);

  // Seed Products & Variants
  console.log("🎂 Seeding 133 Products and Variants into Neon...");
  let productCount = 0;
  let variantCount = 0;

  for (let idx = 0; idx < rawProducts.length; idx++) {
    const item: any = rawProducts[idx];
    const catName = item.categoryName || item.category || "Normal Flavors";
    const categoryId = categoryDbIds.get(catName);

    if (!categoryId) continue;

    const productType = catName.toLowerCase().includes("snack") ? "SNACK" : "CAKE";
    const productCode = `LOL-${String(idx + 1).padStart(3, "0")}`;
    const productSlug = item.id || `${slugify(catName)}-${slugify(item.name)}`;

    const pRows = await sql`
      INSERT INTO products (
        category_id, product_code, name, slug, description, image_name, badge, rating, review_count, product_type, is_active
      ) VALUES (
        ${categoryId}, ${productCode}, ${item.name}, ${productSlug}, ${item.description || `${item.name} freshly made cake.`}, 
        ${item.image}, ${item.badge || null}, ${item.rating || 5.0}, ${item.reviewCount || 35}, ${productType}, true
      )
      ON CONFLICT (slug)
      DO UPDATE SET 
        name = EXCLUDED.name,
        description = EXCLUDED.description,
        image_name = EXCLUDED.image_name,
        badge = EXCLUDED.badge,
        rating = EXCLUDED.rating,
        review_count = EXCLUDED.review_count,
        updated_at = NOW()
      RETURNING id
    `;
    const productId = Number(pRows[0].id);
    productCount++;

    // Variants
    const variantsList = item.variants && item.variants.length > 0
      ? item.variants
      : [{ weight: "Regular", price: item.price || item.minPrice || 370 }];

    for (const v of variantsList) {
      const { value, unit } = parseWeight(v.weight);
      const variantName = v.weight || "Regular";
      const isCakeCat = catName.toLowerCase().includes("cake") || catName.toLowerCase() === "cakes";

      await sql`
        INSERT INTO product_variants (
          product_id, name, weight_value, weight_unit, price, is_eggless, serves, is_available
        ) VALUES (
          ${productId}, ${variantName}, ${value}, ${unit}, ${v.price}, ${isCakeCat}, ${getServingSize(variantName)}, true
        )
      `;
      variantCount++;
    }
  }

  console.log(`🎉 Neon Database Seeding Completed Successfully!`);
  console.log(`📦 Categories: ${categoryDbIds.size}`);
  console.log(`🎂 Products: ${productCount}`);
  console.log(`⚖️ Variants: ${variantCount}`);
}

main().catch((err) => {
  console.error("❌ Neon seeding failed:", err);
  process.exit(1);
});
