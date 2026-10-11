import { getNeonSql } from "../lib/neon";
import { getMySqlPool } from "../lib/mysql";

async function main() {
  console.log("Migrating product_variants to ensure 'offer' column exists...");

  // 1. Neon PostgreSQL
  try {
    const sql = getNeonSql();
    if (sql) {
      await sql`
        ALTER TABLE product_variants 
        ADD COLUMN IF NOT EXISTS offer VARCHAR(150);
      `;
      console.log("✓ Neon PostgreSQL product_variants updated with 'offer' column.");
    }
  } catch (err: any) {
    console.warn("Neon migration warning:", err?.message || err);
  }

  // 2. MySQL fallback
  try {
    const pool = getMySqlPool();
    if (pool) {
      // Check if column exists
      const [cols]: any = await pool.query(`
        SHOW COLUMNS FROM lollipop_db.product_variants LIKE 'offer';
      `);
      if (cols.length === 0) {
        await pool.query(`
          ALTER TABLE lollipop_db.product_variants 
          ADD COLUMN offer VARCHAR(150) NULL AFTER is_available;
        `);
        console.log("✓ MySQL product_variants updated with 'offer' column.");
      } else {
        console.log("✓ MySQL product_variants already has 'offer' column.");
      }
    }
  } catch (err: any) {
    console.warn("MySQL migration warning:", err?.message || err);
  }

  console.log("Migration complete!");
}

main().catch(console.error);
