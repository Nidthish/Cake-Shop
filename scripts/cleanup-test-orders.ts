import { prisma } from "../lib/prisma";

async function main() {
  console.log("🧹 Cleaning up dummy test orders and test users from MySQL database...");

  // Delete test payments
  await prisma.payment.deleteMany({});
  console.log("✅ Cleared test payments.");

  // Delete test order items
  await prisma.orderItem.deleteMany({});
  console.log("✅ Cleared test order items.");

  // Delete test orders
  await prisma.order.deleteMany({});
  console.log("✅ Cleared test orders.");

  // Delete non-admin customer users
  await prisma.user.deleteMany({
    where: {
      role: "CUSTOMER",
    },
  });
  console.log("✅ Cleared test customer users.");
}

main()
  .catch((e) => {
    console.error("❌ Cleanup error:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
