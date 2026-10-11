import { getNeonSql } from "../lib/neon";

async function main() {
  const sql = getNeonSql();
  if (!sql) {
    console.error("No sql");
    return;
  }
  const cols = await sql`
    SELECT column_name, data_type, column_default 
    FROM information_schema.columns 
    WHERE table_name = 'product_variants';
  `;
  console.log("product_variants columns:", cols.map(c => c.column_name));

  const offerCols = await sql`
    SELECT column_name, data_type, column_default 
    FROM information_schema.columns 
    WHERE table_name = 'product_offers';
  `;
  console.log("product_offers columns:", offerCols.map(c => c.column_name));
}

main().catch(console.error);
