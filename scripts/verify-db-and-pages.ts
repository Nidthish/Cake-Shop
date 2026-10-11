import { getNeonSql } from "../lib/neon";
import { getDbProducts, getProductsByCategory } from "../lib/products";
import { getProductCardImage, getDummyFallbackImage } from "../lib/dummy-images";
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

async function verify() {
  console.log("🔍 Verifying Neon PostgreSQL database...");
  const sql = getNeonSql();
  if (!sql) throw new Error("No SQL client");

  const totalProducts = await sql`SELECT count(*) FROM products;`;
  console.log(`✅ Total products in Neon DB: ${totalProducts[0].count}`);

  const newCakes = await sql`
    SELECT p.id, p.product_code, p.name, p.slug, p.image_name, p.badge, p.rating, c.name as category_name
    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE p.product_code LIKE 'LLP-BNT-%' 
       OR p.product_code LIKE 'LLP-WED-%' 
       OR p.product_code LIKE 'LLP-FBD-%'
    ORDER BY p.product_code ASC;
  `;
  console.log(`✅ Total new cakes in Neon DB: ${newCakes.length}`);

  const variants = await sql`
    SELECT count(*) 
    FROM product_variants v
    JOIN products p ON v.product_id = p.id
    WHERE p.product_code LIKE 'LLP-BNT-%' 
       OR p.product_code LIKE 'LLP-WED-%' 
       OR p.product_code LIKE 'LLP-FBD-%';
  `;
  console.log(`✅ Total variants for new cakes in Neon DB: ${variants[0].count}`);

  // Test getDbProducts()
  console.log("\n🌐 Testing lib/products getDbProducts() query...");
  const allProds = await getDbProducts();
  console.log(`Fetched total products via getDbProducts(): ${allProds.length}`);

  const bentoProds = getProductsByCategory("bento-cake", allProds);
  const weddingProds = getProductsByCategory("wedding-cakes", allProds);
  const fbdProds = getProductsByCategory("first-birthday", allProds);

  console.log(`🎂 Bento cakes count: ${bentoProds.length}`);
  console.log(`🎂 Wedding cakes count: ${weddingProds.length}`);
  console.log(`🎂 1st Birthday cakes count: ${fbdProds.length}`);

  // Check sample from each
  if (bentoProds.length > 0) {
    const s = bentoProds[0];
    console.log(`Sample Bento: Code=${s.productCode}, Name="${s.name}", Variants=${s.variants.length}, Img="${getProductCardImage(s)}", Fallback="${getDummyFallbackImage(s)}"`);
  }
  if (weddingProds.length > 0) {
    const s = weddingProds[0];
    console.log(`Sample Wedding: Code=${s.productCode}, Name="${s.name}", Variants=${s.variants.length}, Img="${getProductCardImage(s)}", Fallback="${getDummyFallbackImage(s)}"`);
  }
  if (fbdProds.length > 0) {
    const s = fbdProds[0];
    console.log(`Sample 1st Birthday: Code=${s.productCode}, Name="${s.name}", Variants=${s.variants.length}, Img="${getProductCardImage(s)}", Fallback="${getDummyFallbackImage(s)}"`);
  }
}

verify().catch(console.error).finally(() => process.exit(0));
