import mysql from "mysql2/promise";
import rawProducts from "../lib/products-data.json";

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

async function runSetup() {
  console.log("🚀 Connecting to MySQL (localhost:3306, user: nidthish)...");

  const conn = await mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "nidthish",
    password: "1122",
  });

  console.log("✅ Connected to MySQL Server!");

  await conn.query("CREATE DATABASE IF NOT EXISTS lollipop_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");
  await conn.query("USE lollipop_db;");
  console.log("📂 Database `lollipop_db` ready!");

  await conn.query("SET FOREIGN_KEY_CHECKS = 0;");

  const tables = [
    "audit_logs",
    "payments",
    "order_items",
    "orders",
    "custom_cake_requests",
    "product_offers",
    "product_variants",
    "products",
    "categories",
    "users",
  ];
  for (const t of tables) {
    await conn.query(`DROP TABLE IF EXISTS ${t};`);
  }
  console.log("🧹 Previous tables cleaned.");

  // Table Definitions
  await conn.query(`
    CREATE TABLE categories (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL UNIQUE,
      slug VARCHAR(120) NOT NULL UNIQUE,
      description TEXT NULL,
      image_name VARCHAR(255) NULL,
      created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await conn.query(`
    CREATE TABLE products (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      category_id BIGINT NOT NULL,
      product_code VARCHAR(30) NOT NULL UNIQUE,
      name VARCHAR(200) NOT NULL,
      slug VARCHAR(220) NOT NULL UNIQUE,
      description TEXT NULL,
      image_name VARCHAR(255) NULL,
      badge VARCHAR(50) NULL,
      rating DECIMAL(3, 2) NOT NULL DEFAULT 5.00,
      review_count INT NOT NULL DEFAULT 35,
      product_type ENUM('CAKE', 'SNACK') NOT NULL DEFAULT 'CAKE',
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT ON UPDATE CASCADE,
      INDEX idx_category_id (category_id),
      INDEX idx_product_type (product_type),
      INDEX idx_is_active (is_active)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await conn.query(`
    CREATE TABLE product_variants (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      product_id BIGINT NOT NULL,
      name VARCHAR(50) NOT NULL,
      weight_value DECIMAL(8, 3) NULL,
      weight_unit VARCHAR(10) NULL,
      price DECIMAL(10, 2) NOT NULL,
      is_eggless BOOLEAN NOT NULL DEFAULT TRUE,
      serves VARCHAR(50) NULL,
      is_available BOOLEAN NOT NULL DEFAULT TRUE,
      created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE ON UPDATE CASCADE,
      UNIQUE KEY uq_prod_variant (product_id, name, is_eggless),
      INDEX idx_product_id (product_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await conn.query(`
    CREATE TABLE product_offers (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      product_id BIGINT NOT NULL,
      buy_variant_id BIGINT NOT NULL,
      free_variant_id BIGINT NOT NULL,
      buy_quantity INT NOT NULL DEFAULT 1,
      free_quantity INT NOT NULL DEFAULT 1,
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE ON UPDATE CASCADE,
      FOREIGN KEY (buy_variant_id) REFERENCES product_variants(id) ON DELETE RESTRICT ON UPDATE CASCADE,
      FOREIGN KEY (free_variant_id) REFERENCES product_variants(id) ON DELETE RESTRICT ON UPDATE CASCADE,
      INDEX idx_product_id (product_id),
      INDEX idx_buy_variant (buy_variant_id),
      INDEX idx_free_variant (free_variant_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await conn.query(`
    CREATE TABLE users (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(150) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NULL,
      full_name VARCHAR(120) NOT NULL,
      phone VARCHAR(20) NULL,
      role ENUM('SUPERADMIN', 'ADMIN', 'STAFF', 'CUSTOMER') NOT NULL DEFAULT 'CUSTOMER',
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await conn.query(`
    CREATE TABLE custom_cake_requests (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      user_id BIGINT NULL,
      customer_name VARCHAR(120) NOT NULL,
      customer_phone VARCHAR(20) NOT NULL,
      customer_email VARCHAR(150) NOT NULL,
      custom_type ENUM('CUSTOMIZED', 'WEDDING', 'BENTO', 'FIRST_BIRTHDAY', 'DREAM_CAKE') NOT NULL DEFAULT 'CUSTOMIZED',
      flavor_preference VARCHAR(100) NOT NULL,
      is_eggless BOOLEAN NOT NULL DEFAULT FALSE,
      tier_or_weight VARCHAR(50) NOT NULL,
      description TEXT NULL,
      reference_image_url VARCHAR(500) NULL,
      reference_video_url VARCHAR(500) NULL,
      cake_message VARCHAR(150) NULL,
      requested_date DATETIME(3) NOT NULL,
      requested_time_slot VARCHAR(50) NOT NULL,
      status VARCHAR(30) NOT NULL DEFAULT 'PENDING_QUOTE',
      quoted_price DECIMAL(10, 2) NULL,
      admin_notes TEXT NULL,
      created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await conn.query(`
    CREATE TABLE orders (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      order_number VARCHAR(50) NOT NULL UNIQUE,
      user_id BIGINT NULL,
      customer_name VARCHAR(120) NOT NULL,
      customer_email VARCHAR(150) NOT NULL,
      customer_phone VARCHAR(20) NOT NULL,
      street_address TEXT NOT NULL,
      city VARCHAR(80) NOT NULL,
      pincode VARCHAR(10) NOT NULL,
      state VARCHAR(80) NOT NULL DEFAULT 'Tamil Nadu',
      landmark VARCHAR(150) NULL,
      delivery_date DATETIME(3) NOT NULL,
      delivery_time_slot VARCHAR(50) NOT NULL,
      delivery_notes TEXT NULL,
      has_eggless_items BOOLEAN NOT NULL DEFAULT FALSE,
      subtotal DECIMAL(10, 2) NOT NULL,
      sgst DECIMAL(10, 2) NOT NULL,
      cgst DECIMAL(10, 2) NOT NULL,
      tax_amount DECIMAL(10, 2) NOT NULL,
      delivery_fee DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
      discount_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
      total_amount DECIMAL(10, 2) NOT NULL,
      status ENUM('PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
      created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
      INDEX idx_order_number (order_number),
      INDEX idx_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await conn.query(`
    CREATE TABLE order_items (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      order_id BIGINT NOT NULL,
      product_id BIGINT NOT NULL,
      variant_id BIGINT NULL,
      product_code VARCHAR(30) NOT NULL,
      product_name VARCHAR(200) NOT NULL,
      variant_name VARCHAR(50) NOT NULL,
      is_eggless BOOLEAN NOT NULL DEFAULT FALSE,
      quantity INT NOT NULL DEFAULT 1,
      unit_price DECIMAL(10, 2) NOT NULL,
      line_total DECIMAL(10, 2) NOT NULL,
      cake_message VARCHAR(150) NULL,
      created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE ON UPDATE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT ON UPDATE CASCADE,
      FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE SET NULL ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await conn.query(`
    CREATE TABLE payments (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      order_id BIGINT NOT NULL UNIQUE,
      payment_method ENUM('RAZORPAY', 'COD', 'UPI', 'CARD', 'NET_BANKING') NOT NULL DEFAULT 'RAZORPAY',
      payment_status ENUM('PENDING', 'INITIATED', 'PAID', 'PAYMENT_FAILED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
      currency VARCHAR(10) NOT NULL DEFAULT 'INR',
      amount DECIMAL(10, 2) NOT NULL,
      razorpay_order_id VARCHAR(100) NULL UNIQUE,
      razorpay_payment_id VARCHAR(100) NULL UNIQUE,
      razorpay_signature TEXT NULL,
      refund_id VARCHAR(100) NULL,
      refund_amount DECIMAL(10, 2) NULL,
      failure_reason TEXT NULL,
      paid_at DATETIME(3) NULL,
      refunded_at DATETIME(3) NULL,
      created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await conn.query(`
    CREATE TABLE audit_logs (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      user_id BIGINT NULL,
      action VARCHAR(100) NOT NULL,
      details TEXT NULL,
      ip_address VARCHAR(45) NULL,
      created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await conn.query("SET FOREIGN_KEY_CHECKS = 1;");
  console.log("✅ MySQL Schema Created: 10 Tables Ready!");

  // Seeding Data
  const catMap = new Map<string, number>();
  for (const item of rawProducts as any[]) {
    const catName = item.categoryName || item.category || "Normal Flavors";
    const catSlug = slugify(catName);

    if (!catMap.has(catName)) {
      await conn.query(
        "INSERT INTO categories (name, slug, description, image_name) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE name=VALUES(name);",
        [catName, catSlug, `Handcrafted fresh ${catName.toLowerCase()} cakes.`, item.image]
      );
      const [rows]: any = await conn.query("SELECT id FROM categories WHERE slug = ?;", [catSlug]);
      catMap.set(catName, rows[0].id);
    }
  }
  console.log(`📦 Categories Seeded: ${catMap.size}`);

  let productCount = 0;
  let variantCount = 0;
  let offerCount = 0;

  for (let idx = 0; idx < (rawProducts as any[]).length; idx++) {
    const item = (rawProducts as any[])[idx];
    const catName = item.categoryName || item.category || "Normal Flavors";
    const categoryId = catMap.get(catName);
    if (!categoryId) continue;

    const productType = catName.toLowerCase().includes("snack") ? "SNACK" : "CAKE";
    const productCode = `LOL-${String(idx + 1).padStart(3, "0")}`;
    const productSlug = item.id || `${slugify(catName)}-${slugify(item.name)}`;

    await conn.query(
      `INSERT INTO products (category_id, product_code, name, slug, description, image_name, badge, rating, review_count, product_type, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE name=VALUES(name), description=VALUES(description), image_name=VALUES(image_name);`,
      [
        categoryId,
        productCode,
        item.name,
        productSlug,
        item.description || `${item.name} freshly made cake.`,
        item.image,
        item.badge || null,
        item.rating || 5.0,
        item.reviewCount || 35,
        productType,
        1,
      ]
    );

    const [pRows]: any = await conn.query("SELECT id FROM products WHERE slug = ?;", [productSlug]);
    if (!pRows || pRows.length === 0) continue;
    const productId = pRows[0].id;
    productCount++;

    const variantsList = item.variants && item.variants.length > 0
      ? item.variants
      : [{ weight: "Regular", price: item.price || item.minPrice || 370 }];

    const insertedVariants: any[] = [];
    for (const v of variantsList) {
      const { value, unit } = parseWeight(v.weight);
      const variantName = v.weight || "Regular";

      await conn.query(
        `INSERT INTO product_variants (product_id, name, weight_value, weight_unit, price, is_eggless, serves, is_available)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE price=VALUES(price), serves=VALUES(serves);`,
        [productId, variantName, value, unit, v.price || 370, 1, getServingSize(variantName), 1]
      );

      const [vRows]: any = await conn.query(
        "SELECT id FROM product_variants WHERE product_id = ? AND name = ? LIMIT 1;",
        [productId, variantName]
      );
      if (vRows && vRows.length > 0) {
        insertedVariants.push({ id: vRows[0].id, name: variantName, rawOffer: v.offer || "" });
        variantCount++;
      }
    }

    // Buy 1kg Get 0.5kg Free Offer
    const var1kg = insertedVariants.find(
      (v) =>
        v.name.toLowerCase().includes("1kg") ||
        (v.rawOffer && (v.rawOffer.includes("1/2kg") || v.rawOffer.includes("Free")))
    );
    const var05kg = insertedVariants.find(
      (v) => v.name.toLowerCase().includes("0.5kg") || v.name.toLowerCase().includes("500g")
    );

    if (var1kg && var05kg && var1kg.id !== var05kg.id) {
      await conn.query(
        `INSERT INTO product_offers (product_id, buy_variant_id, free_variant_id, buy_quantity, free_quantity, is_active)
         VALUES (?, ?, ?, 1, 1, 1);`,
        [productId, var1kg.id, var05kg.id]
      );
      offerCount++;
    }
  }

  console.log(`🎉 MySQL Migration & Seed Completed!`);
  console.log(`🎂 Products Inserted: ${productCount}`);
  console.log(`⚖️ Variants Inserted: ${variantCount}`);
  console.log(`🎁 Offers Created: ${offerCount}`);

  await conn.end();
}

runSetup().catch((e) => {
  console.error("❌ Setup Error:", e);
  process.exit(1);
});
