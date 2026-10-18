import { getNeonSql } from "../lib/neon";
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

async function run() {
  const sql = getNeonSql();
  if (!sql) {
    console.log("No Neon SQL connection configured.");
    return;
  }
  try {
    await sql`ALTER TABLE product_variants ADD COLUMN IF NOT EXISTS offer VARCHAR(255);`;
    console.log("✅ product_variants.offer column verified.");
  } catch (err: any) {
    console.log("product_variants.offer notice:", err?.message || err);
  }

  try {
    await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS eggless_available BOOLEAN DEFAULT true;`;
    console.log("✅ products.eggless_available column verified.");
  } catch (err: any) {
    console.log("products.eggless_available notice:", err?.message || err);
  }
}

run();
