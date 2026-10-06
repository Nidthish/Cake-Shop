import { getNeonSql } from "../lib/neon";
import { getMySqlPool } from "../lib/mysql";
import fs from "fs";
import path from "path";

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

async function runMigration() {
  console.log("🔄 Starting database migration for Rider Role and Offer columns...");

  // 1. Neon PostgreSQL
  try {
    const sql = getNeonSql();
    if (sql) {
      console.log("⚡ Checking Neon PostgreSQL Role enum and order_items columns...");
      try {
        await sql`ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'RIDER';`;
        console.log("✅ Neon PostgreSQL: 'RIDER' added to 'Role' enum.");
      } catch (err: any) {
        console.log("ℹ️ Neon Role enum notice:", err?.message || err);
      }

      try {
        await sql`ALTER TABLE order_items ADD COLUMN IF NOT EXISTS offer VARCHAR(150);`;
        console.log("✅ Neon PostgreSQL: 'offer' column added to order_items.");
      } catch (err: any) {
        console.log("ℹ️ Neon order_items.offer notice:", err?.message || err);
      }
    }
  } catch (err: any) {
    console.warn("⚠️ Neon migration error:", err?.message || err);
  }

  // 2. MySQL fallback
  try {
    const pool = getMySqlPool();
    if (pool) {
      console.log("🐬 Checking MySQL users role and order_items offer column...");
      try {
        await pool.query("ALTER TABLE lollipop_db.users MODIFY COLUMN role VARCHAR(50) DEFAULT 'CUSTOMER'");
        console.log("✅ MySQL: users.role column confirmed VARCHAR(50).");
      } catch (e: any) {
        console.log("ℹ️ MySQL users role notice:", e?.message);
      }

      try {
        await pool.query("ALTER TABLE lollipop_db.order_items ADD COLUMN offer VARCHAR(150) DEFAULT NULL");
        console.log("✅ MySQL: 'offer' column added to order_items.");
      } catch (e: any) {
        if (e?.message?.includes("Duplicate column")) {
          console.log("ℹ️ MySQL: 'offer' column already exists in order_items.");
        } else {
          console.log("ℹ️ MySQL order_items offer notice:", e?.message);
        }
      }
    }
  } catch (err: any) {
    console.warn("⚠️ MySQL migration error:", err?.message || err);
  }

  console.log("🎉 Migration script finished successfully!");
}

runMigration()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Migration failed:", err);
    process.exit(1);
  });
