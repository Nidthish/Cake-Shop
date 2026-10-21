import fs from "fs";
import { hashPassword, verifyPassword } from "../lib/crypto";
import { signJwt, verifyJwt, TOKEN_EXPIRY_SECONDS } from "../lib/jwt";
import { prisma } from "../lib/prisma";
import sitemap from "../app/sitemap";

async function runAuthAndFaviconVerification() {
  console.log("==================================================");
  console.log("🔍 RUNNING COMPREHENSIVE AUTH, SEO & SITELINKS TEST");
  console.log("==================================================");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, name: string, detail?: string) {
    if (condition) {
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${name}${detail ? ` (${detail})` : ""}`);
      failed++;
    }
  }

  // 1. Password verification
  console.log("\n🔑 1. PASSWORD SECURITY CHECKS");
  const newPassword = "Lollipopadmin@321";
  const oldPassword = "Admin@123456";

  let dbUser = null;
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      dbUser = await prisma.user.findFirst({
        where: { role: "SUPERADMIN" },
      });
      if (dbUser) break;
    } catch {
      await new Promise(r => setTimeout(r, 1500));
    }
  }

  assert(!!dbUser, "1.1 Superadmin user found in Neon database");
  if (dbUser && dbUser.passwordHash) {
    assert(
      verifyPassword(newPassword, dbUser.passwordHash),
      "1.2 Superadmin verifies successfully with current password 'Lollipopadmin@321'"
    );
    assert(
      !verifyPassword(oldPassword, dbUser.passwordHash),
      "1.3 Superadmin rejects previous password 'Admin@123456'"
    );
    assert(
      !verifyPassword("WrongPassword123", dbUser.passwordHash),
      "1.4 Superadmin rejects arbitrary incorrect password"
    );
  }

  // 2. JWT & 1-Hour Session Verification
  console.log("\n🎟️ 2. JWT & 1-HOUR SESSION VALIDATION");
  assert(TOKEN_EXPIRY_SECONDS === 3600, "2.1 Default token expiration is exactly 3600 seconds (1 hour)");

  const payload = {
    userId: "2",
    email: "admin@lollipopcakeshop.com",
    fullName: "Master Super Admin",
    role: "SUPERADMIN",
  };

  const token = signJwt(payload, 3600);
  assert(typeof token === "string" && token.split(".").length === 3, "2.2 Generates valid 3-part JWT token");

  const verified = verifyJwt(token);
  assert(!!verified, "2.3 Verifies newly signed JWT token");
  assert(verified?.userId === "2", "2.4 Decodes user ID correctly");
  assert(verified?.role === "SUPERADMIN", "2.5 Decodes role correctly");
  assert(
    typeof verified?.exp === "number" &&
      typeof verified?.iat === "number" &&
      verified.exp - verified.iat === 3600,
    "2.6 Verified expiration is precisely 1 hour (3600s) from issued time"
  );

  const tamperedToken = token.slice(0, -5) + "abcde";
  assert(verifyJwt(tamperedToken) === null, "2.7 Rejects signature-tampered JWT token");

  const parts = token.split(".");
  const fakePayload = Buffer.from(JSON.stringify({ ...payload, role: "HACKER" })).toString("base64url");
  const manipulatedToken = `${parts[0]}.${fakePayload}.${parts[2]}`;
  assert(verifyJwt(manipulatedToken) === null, "2.8 Rejects payload-manipulated JWT token");

  const expiredToken = signJwt(payload, -10);
  assert(verifyJwt(expiredToken) === null, "2.9 Rejects expired JWT token");

  // 3. Favicon and Icon File Checks
  console.log("\n🖼️ 3. FAVICON & ICON ASSET VERIFICATION");
  const filesToCheck = [
    { path: "public/icon.png", minSize: 10000, desc: "public/icon.png (direct static serve for Google)" },
    { path: "public/favicon.png", minSize: 5000, desc: "public/favicon.png (192x192 multiple of 48 for Google)" },
    { path: "public/favicon.ico", minSize: 1000, desc: "public/favicon.ico (Multi-resolution Windows ICO)" },
    { path: "public/apple-icon.png", minSize: 5000, desc: "public/apple-icon.png (Apple touch icon)" },
    { path: "public/manifest.json", minSize: 100, desc: "public/manifest.json (Web app manifest)" },
  ];

  for (const item of filesToCheck) {
    const exists = fs.existsSync(item.path);
    const size = exists ? fs.statSync(item.path).size : 0;
    assert(exists && size > item.minSize, `3. Asset exists and valid size: ${item.desc} (${size} bytes)`);
  }

  // Ensure no conflicting files exist in app/
  assert(!fs.existsSync("app/icon.png"), "3.6 app/icon.png removed to prevent conflicting public/page route error");
  assert(!fs.existsSync("app/favicon.ico"), "3.7 app/favicon.ico removed to prevent conflicting public/page route error");
  assert(!fs.existsSync("app/apple-icon.png"), "3.8 app/apple-icon.png removed to prevent conflicting public/page route error");

  const icoBuf = fs.readFileSync("public/favicon.ico");
  const isRealIco = icoBuf.readUInt16LE(0) === 0 && icoBuf.readUInt16LE(2) === 1 && icoBuf.readUInt16LE(4) >= 3;
  assert(isRealIco, "3.9 public/favicon.ico has valid multi-layer ICO binary header");

  // 4. Google Site Name & Sitelinks SEO Checks
  console.log("\n🌐 4. GOOGLE SEARCH SNIPPET & SITELINKS VALIDATION");
  const layoutContent = fs.readFileSync("app/layout.tsx", "utf-8");
  const pageContent = fs.readFileSync("app/page.tsx", "utf-8");

  assert(layoutContent.includes('applicationName: "Lollipop Cake Shop"'), "4.1 applicationName set to 'Lollipop Cake Shop'");
  assert(layoutContent.includes('default: "Lollipop Cake Shop"'), "4.2 Layout default title is 'Lollipop Cake Shop'");
  assert(pageContent.includes('title: "Lollipop Cake Shop"'), "4.3 Homepage title is cleanly 'Lollipop Cake Shop'");
  assert(layoutContent.includes('siteName: "Lollipop Cake Shop"'), "4.4 og:site_name set to 'Lollipop Cake Shop'");

  // Structured Data Schema checks
  assert(layoutContent.includes('"@type": "WebSite"'), "4.5 Layout defines schema.org/WebSite");
  assert(layoutContent.includes('"@type": "ItemList"'), "4.6 Layout defines ItemList for Sitelinks");
  assert(layoutContent.includes('"@type": "SiteNavigationElement"'), "4.7 Layout defines SiteNavigationElement links");
  assert(layoutContent.includes('"@type": "SearchAction"'), "4.8 WebSite schema provides Sitelinks SearchAction");
  assert(layoutContent.includes('"@type": "Bakery"'), "4.9 Layout defines schema.org/Bakery for local SEO");
  assert(layoutContent.includes("https://www.justdial.com"), "4.10 sameAs links to Justdial profile to establish primary domain authority");

  // Check sitemap priorities
  const sitemapEntries = sitemap();
  const homeEntry = sitemapEntries.find(e => e.url.endsWith("/"));
  const cakesEntry = sitemapEntries.find(e => e.url.endsWith("/cakes"));
  const trackEntry = sitemapEntries.find(e => e.url.endsWith("/track-order"));
  const contactEntry = sitemapEntries.find(e => e.url.endsWith("/contact-us"));

  assert(homeEntry?.priority === 1.0, "4.11 Sitemap home priority is 1.0");
  assert(cakesEntry?.priority === 0.9, "4.12 Sitemap /cakes sitelink priority is 0.9");
  assert(trackEntry?.priority === 0.8, "4.13 Sitemap /track-order sitelink priority is 0.8");
  assert(contactEntry?.priority === 0.8, "4.14 Sitemap /contact-us sitelink priority is 0.8");

  // Check layout files exist for track-order and contact-us
  assert(fs.existsSync("app/track-order/layout.tsx"), "4.15 app/track-order/layout.tsx exists with metadata");
  assert(fs.existsSync("app/contact-us/layout.tsx"), "4.16 app/contact-us/layout.tsx exists with metadata");

  console.log("\n==================================================");
  console.log(`📊 RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log("==================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runAuthAndFaviconVerification()
  .catch((err) => {
    console.error("Test execution failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
