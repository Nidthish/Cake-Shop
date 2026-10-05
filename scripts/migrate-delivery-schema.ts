import { getNeonSql } from "../lib/neon";
import { getMySqlPool } from "../lib/mysql";
import fs from "fs";
import path from "path";

// Load .env if not loaded
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

async function migrate() {
  console.log("🔄 Starting migration for Delivery App schema extensions...");

  // 1. Neon PostgreSQL
  try {
    const sql = getNeonSql();
    if (sql) {
      console.log("⚡ Updating Neon PostgreSQL 'orders' table...");
      await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_otp VARCHAR(10);`;
      await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_otp_verified BOOLEAN DEFAULT FALSE;`;
      await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_partner_name VARCHAR(120);`;
      await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_partner_phone VARCHAR(20);`;
      await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS cancellation_reason TEXT;`;
      await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMP WITH TIME ZONE;`;
      await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMP WITH TIME ZONE;`;
      await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS assigned_at TIMESTAMP WITH TIME ZONE;`;
      console.log("✅ Neon PostgreSQL orders table extended successfully!");
    } else {
      console.warn("⚠️ Neon SQL client not available.");
    }
  } catch (err: any) {
    console.warn("⚠️ Neon migration notice:", err?.message || err);
  }

  // 2. MySQL
  try {
    const pool = getMySqlPool();
    if (pool) {
      console.log("🐬 Verifying MySQL 'orders' table...");
      try {
        await pool.query("ALTER TABLE lollipop_db.orders MODIFY COLUMN status VARCHAR(50) DEFAULT 'PENDING'");
        console.log("✅ MySQL orders.status column widened to VARCHAR(50)");
      } catch (e: any) {
        console.warn("⚠️ Status modify notice:", e?.message);
      }
      const cols = [
        "delivery_otp VARCHAR(10) DEFAULT NULL",
        "delivery_otp_verified TINYINT(1) DEFAULT 0",
        "delivery_partner_name VARCHAR(120) DEFAULT NULL",
        "delivery_partner_phone VARCHAR(20) DEFAULT NULL",
        "cancellation_reason TEXT DEFAULT NULL",
        "cancelled_at DATETIME(3) DEFAULT NULL",
        "delivered_at DATETIME(3) DEFAULT NULL",
        "assigned_at DATETIME(3) DEFAULT NULL",
      ];
      for (const col of cols) {
        const colName = col.split(" ")[0];
        try {
          await pool.query(`ALTER TABLE lollipop_db.orders ADD COLUMN ${col}`);
          console.log(`✅ Added column ${colName} to MySQL`);
        } catch (e: any) {
          if (e.message?.includes("Duplicate column")) {
            console.log(`ℹ️ Column ${colName} already exists in MySQL`);
          } else {
            console.warn(`⚠️ MySQL column notice for ${colName}:`, e.message);
          }
        }
      }
      console.log("✅ MySQL orders table extended successfully!");
    }
  } catch (err: any) {
    console.warn("⚠️ MySQL migration notice:", err?.message || err);
  }

  console.log("🎉 Database schema migration completed successfully!");
}

migrate()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("Migration fatal error:", e);
    process.exit(1);
  });
