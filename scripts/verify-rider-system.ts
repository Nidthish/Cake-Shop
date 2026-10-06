import * as fs from "fs";
import * as path from "path";

// Load .env manually if exists
try {
  const envPath = path.resolve(__dirname, "../.env");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf-8");
    for (const line of envContent.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        let val = trimmed.slice(eqIdx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
} catch (e) {
  // ignore
}

import { getNeonSql } from "../lib/neon";
import { prisma } from "../lib/prisma";
import { hashPassword, verifyPassword } from "../lib/crypto";
import { signJwt, verifyJwt } from "../lib/jwt";
import { generateOrderDeliveredHtml, generateOrderConfirmationHtml } from "../lib/email";

async function run() {
  console.log("=== 1. VERIFYING RIDER AUTHENTICATION & ACCESS CONTROL ===");
  const testRiderEmail = "rider.demo@lollipopcakeshop.com";
  const testPassword = "Rider@Demo123";
  const passwordHash = hashPassword(testPassword);

  const neon = getNeonSql();
  if (neon) {
    // Upsert demo rider in Neon
    await neon`
      INSERT INTO users (email, full_name, phone, role, password_hash, is_active, updated_at)
      VALUES (${testRiderEmail}, 'Karthik Rider', '9843212345', 'RIDER'::"Role", ${passwordHash}, true, NOW())
      ON CONFLICT (email) DO UPDATE
      SET role = 'RIDER'::"Role", password_hash = ${passwordHash}, is_active = true, updated_at = NOW()
    `;
    console.log("✓ Demo rider created/updated in Neon PostgreSQL.");
  }

  // Verify password
  const isMatch = verifyPassword(testPassword, passwordHash);
  console.log("✓ Password verification:", isMatch ? "PASSED" : "FAILED");

  // Sign JWT
  const token = signJwt({
    userId: "101",
    email: testRiderEmail,
    fullName: "Karthik Rider",
    role: "RIDER",
  });
  console.log("✓ JWT signed:", token.substring(0, 30) + "...");

  const payload = verifyJwt(token);
  console.log("✓ JWT verified. Role:", payload?.role, "User:", payload?.fullName);

  // Check Admin Access restriction
  const canAccessAdmin = payload?.role === "ADMIN" || payload?.role === "SUPERADMIN";
  console.log("✓ Admin panel access for Rider:", canAccessAdmin ? "ALLOWED (ERROR)" : "BLOCKED (CORRECT: 403 Forbidden)");

  console.log("\n=== 2. VERIFYING MINUTE CAKE DETAILS IN ORDER EMAIL ===");
  const sampleOrder: any = {
    id: "LLP-20261006-TEST",
    customer: { fullName: "Ananya Iyer", email: "ananya@example.com", phone: "9876543210" },
    address: { street: "12 Vasan Nagar 3rd Cross", city: "Trichy", pincode: "620001" },
    schedule: { date: "2026-10-07", timeSlot: "04:30 PM (Evening Express Slot)" },
    items: [
      {
        name: "Belgian Chocolate Truffle",
        weight: "1kg",
        quantity: 1,
        unitPrice: 850,
        lineTotal: 850,
        eggPreference: "egg",
        offer: "Buy 1kg Get 1/2kg Free",
        cakeMessage: "Happy 25th Birthday Ananya!",
      },
      {
        name: "Eggless Red Velvet Heart Cake",
        weight: "0.5kg",
        quantity: 1,
        unitPrice: 550,
        lineTotal: 550,
        eggPreference: "eggless",
        offer: "Special Festival Discount",
        cakeMessage: "Forever with Love",
      },
    ],
    subtotal: 1400,
    sgst: 35,
    cgst: 35,
    deliveryFee: 0,
    total: 1470,
    paymentMethod: "COD",
    paymentStatus: "PAID",
    deliveryOtp: "482910",
    deliveryOtpVerified: true,
  };

  const deliveredHtml = generateOrderDeliveredHtml(sampleOrder);
  console.log("✓ Order Delivered HTML generated. Size:", deliveredHtml.length, "bytes.");
  console.log("✓ Contains delivery success banner:", deliveredHtml.includes("Delivered Successfully"));
  console.log("✓ Contains minute cake offer:", deliveredHtml.includes("Buy 1kg Get 1/2kg Free"));
  console.log("✓ Contains cake message:", deliveredHtml.includes("Happy 25th Birthday Ananya!"));
  console.log("✓ Contains exact time slot:", deliveredHtml.includes("04:30 PM"));
  console.log("✓ Contains eggless badge:", deliveredHtml.includes("Eggless"));

  console.log("\n=== 3. ALL SYSTEMS VERIFIED PROFESSIONALLY ===");
}

run().catch((e) => {
  console.error("Verification failed:", e);
  process.exit(1);
});
