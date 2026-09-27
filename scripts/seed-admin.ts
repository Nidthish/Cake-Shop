import { prisma } from "../lib/prisma";
import { hashPassword } from "../lib/crypto";

async function main() {
  console.log(" Ensuring default Super Admin user exists in MySQL database...");
  const defaultEmail = "admin@lollipopcakeshop.com";
  const defaultPasswordHash = hashPassword("Admin@123456");

  const existing = await prisma.user.findUnique({
    where: { email: defaultEmail },
  });

  if (!existing) {
    const user = await prisma.user.create({
      data: {
        email: defaultEmail,
        fullName: "Master Super Admin",
        passwordHash: defaultPasswordHash,
        role: "SUPERADMIN",
        isActive: true,
      },
    });
    console.log("✅ Super Admin user created:", user.email);
  } else {
    const updated = await prisma.user.update({
      where: { email: defaultEmail },
      data: {
        passwordHash: defaultPasswordHash,
        role: "SUPERADMIN",
        isActive: true,
      },
    });
    console.log("✅ Super Admin password reset & updated:", updated.email);
  }
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
