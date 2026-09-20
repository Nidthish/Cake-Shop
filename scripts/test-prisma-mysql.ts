import { prisma } from "../lib/prisma";

async function testPrisma() {
  console.log("🔍 Testing Prisma Client with MySQL Database (localhost:3306, user: nidthish)...");

  const catCount = await prisma.category.count();
  const prodCount = await prisma.product.count();
  const variantCount = await prisma.productVariant.count();
  const offerCount = await prisma.productOffer.count();

  console.log(`✅ Prisma connected to MySQL successfully!`);
  console.log(`📦 Categories in DB: ${catCount}`);
  console.log(`🎂 Products in DB: ${prodCount}`);
  console.log(`⚖️ Variants in DB: ${variantCount}`);
  console.log(`🎁 Product Offers in DB: ${offerCount}`);

  const sampleProducts = await prisma.product.findMany({
    take: 1,
    include: {
      category: true,
      variants: true,
      offers: true,
    },
  });

  console.log("🌟 Sample DB Product:", JSON.stringify(sampleProducts[0], (key, value) =>
    typeof value === 'bigint' ? value.toString() : value, 2));
}

testPrisma()
  .catch((e) => console.error("❌ Prisma Test Error:", e))
  .finally(async () => await prisma.$disconnect());
