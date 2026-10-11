import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);
const cols = await sql`
  SELECT column_name, data_type, column_default 
  FROM information_schema.columns 
  WHERE table_name = 'product_variants';
`;
console.log("product_variants columns:", cols);

const offerCols = await sql`
  SELECT column_name, data_type, column_default 
  FROM information_schema.columns 
  WHERE table_name = 'product_offers';
`;
console.log("product_offers columns:", offerCols);
