# 🎂 Lollipop Cake Shop — Next.js Enterprise E-Commerce Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Razorpay](https://img.shields.io/badge/Razorpay-Integrated-blueviolet?style=flat-square)](https://razorpay.com/)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen?style=flat-square)]()

A high-performance, modern, enterprise e-commerce application for **Lollipop Cake Shop**, featuring a catalog of **133 artisanal products**, high-speed static generation (SSG) across **153 pages**, custom cake studio, intelligent fuzzy catalog search, cart context with local storage persistence, and secure server-verified Razorpay payment integration.

---

## 📸 Executive Summary & Architecture Overview

```
                        ┌───────────────────────────────┐
                        │      Next.js App Router       │
                        │ (Static Pre-rendering - 153p) │
                        └──────────────┬────────────────┘
                                       │
            ┌──────────────────────────┼──────────────────────────┐
            ▼                          ▼                          ▼
  ┌───────────────────┐      ┌───────────────────┐      ┌───────────────────┐
  │ 🛍️ Product Catalog │      │ 🛒 Cart Context   │      │ 🎨 Custom Studio  │
  │ (133 Items & SSG) │      │ (Local Storage)   │      │ (WhatsApp Bridge) │
  └───────────────────┘      └─────────┬─────────┘      └───────────────────┘
                                       │
                                       ▼
                         ┌───────────────────────────┐
                         │   🔒 Secure Checkout      │
                         └─────────────┬─────────────┘
                                       │
           ┌───────────────────────────┴───────────────────────────┐
           ▼                                                       ▼
 ┌────────────────────────────────────┐         ┌────────────────────────────────────┐
 │  POST /api/razorpay/create-order   │         │ POST /api/razorpay/verify-payment  │
 │  • Server Price Recalculation      │         │  • HMAC-SHA256 Verification        │
 │  • Client Price Discard            │         │  • Constant-Time Comparison        │
 │  • Zod Validation & Idempotency    │         │  • Order ID & State Consistency   │
 └────────────────────────────────────┘         └────────────────────────────────────┘
```

---

## ✨ Features & Capabilities

### 📱 User Interface & E-Commerce Workflow
- **133-Item Product Catalog**: Full catalog ported with exact product pricing, descriptions, images, tags, ratings, and multi-weight variants.
- **Fuzzy Search & Dynamic Filters**: Modal search powered by fuzzy text matching (by name, description, flavor, subcategory) + real-time category filtering.
- **Category Navigation**: 6 dedicated category pages:
  - 🎂 **Signature Cakes** (`/cakes`) — Normal, Choco, Delight, Rich, Fruit, Combo.
  - 🍱 **Korean Bento Cakes** (`/bento-cake`) — Compact single-serve designs.
  - 👶 **1st Birthday Smash Cakes** (`/first-birthday`) — Milestone cakes.
  - 💍 **Wedding Cake Masterpieces** (`/wedding-cakes`) — Multi-tier luxury cakes.
  - 🥮 **Dry Cakes Collection** (`/dry-cakes`) — Long-lasting teatime bakes.
  - 🥐 **Gourmet Snacks & Pastries** (`/snacks`) — Doughnuts, brownies, puffs, cookies.
- **Custom Cake Studio (`/custom-cake`)**: Guided step-by-step custom order flow integrated with direct WhatsApp consultation.
- **Cart Management**: Real-time state with `localStorage` persistence (`lollipop_cart`), quantity adjustments, eggless/egg options, line item totals, and summary calculations (subtotal, SGST 2.5%, CGST 2.5%, free delivery).
- **Responsive Mobile Drawer & Sticky Navigation**: Glassmorphic header with quick cart count badge, mobile side drawer, floating WhatsApp support widget (`WhatsAppFloat.tsx`).

### 🛡️ Enterprise Payment Security & Razorpay Integration
1. **Server-Side Price Recalculation (`lib/pricing.ts`)**:
   - The server ignores prices submitted by the client browser.
   - Computes total price strictly using product IDs, weight options, and quantities directly from `products-data.json`.
   - Protects against price tampering, negative values, or zero-cost attacks.
2. **HMAC-SHA256 Signature Verification (`lib/razorpay.ts`)**:
   - Verifies the cryptographic payload: `HMAC_SHA256(razorpay_order_id + "|" + razorpay_payment_id, secret)`.
   - Uses `crypto.timingSafeEqual` for constant-time comparisons to defeat timing attacks.
   - `order.razorpayOrderId === razorpay_order_id` check prevents using valid signatures from lower-cost orders.
3. **Idempotency Key Protection**:
   - Prevents duplicate order creation and double-billing on network retries or fast double-clicks.
4. **Zod Validation**:
   - Validates all request payloads (customer details, phone numbers, email addresses, 6-digit Indian pincodes, dates, time slots) server-side.

### 🌐 SEO & Technical Optimization
- **Static Site Generation (SSG)**: 153 pages pre-rendered at build time for instant page loads.
- **Structured Data (JSON-LD)**: Rich snippet schema (`schema.org/Product`) automatically injected on dynamic product routes (`/products/[slug]`).
- **OpenGraph & Twitter Cards**: Complete social sharing metadata across all routes.
- **Sitemap & Robots**: Next.js native dynamic `/sitemap.xml` and `/robots.txt`.
- **Security Headers**: Standard HTTP security headers configured in `next.config.ts`:
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: origin-when-cross-origin`
  - `Permissions-Policy` restrictions

---

## 📂 Codebase Directory Structure

```
lollipop-nextjs/
├── app/                        # Next.js App Router Routes & APIs
│   ├── about/                  # About Us page
│   ├── api/                    # Server-side API endpoints
│   │   ├── orders/[id]/        # Order retrieval endpoint
│   │   └── razorpay/           # Payment creation & verification
│   │       ├── create-order/   # Recalculate price & create Razorpay order
│   │       └── verify-payment/ # Validate HMAC signature & finalize order
│   ├── bento-cake/             # Korean Bento Cakes collection
│   ├── cakes/                  # Signature Cakes collection
│   ├── cart/                   # Shopping Cart page
│   ├── checkout/               # Checkout & Razorpay JS modal flow
│   ├── custom-cake/            # Custom Cake Studio page
│   ├── dry-cakes/              # Dry Cakes collection
│   ├── first-birthday/         # 1st Birthday Smash Cakes collection
│   ├── order/                  # Post-checkout status pages
│   │   ├── failed/             # Payment failed page
│   │   └── success/            # Order confirmation page
│   ├── products/[slug]/        # Dynamic SSG Product Detail page with JSON-LD
│   ├── snacks/                 # Gourmet Snacks & Pastries collection
│   ├── wedding-cakes/          # Wedding Cakes collection
│   ├── globals.css             # Design tokens & global CSS styles
│   ├── layout.tsx              # Root Layout (Fonts, CartProvider, ToastProvider)
│   ├── not-found.tsx           # Custom 404 page
│   ├── page.tsx                # Homepage (Hero, Showcase, Best Sellers)
│   ├── robots.ts               # Dynamic robots.txt
│   └── sitemap.ts              # Dynamic sitemap.xml
├── components/                 # UI Component Layer
│   ├── cart/                   # CartLineItem, CartProvider
│   ├── checkout/               # Checkout form helpers
│   ├── common/                 # ToastProvider
│   ├── layout/                 # Navbar, Footer, WhatsAppFloat, BakeryBackground
│   └── products/               # ProductCard, CategoryHero, CategoryPageClient, ProductDetailClient
├── lib/                        # Server & Core Business Logic
│   ├── orders.ts               # Order storage interface & in-memory implementation
│   ├── pricing.ts              # Server-side pricing engine (Source of Truth)
│   ├── products.ts             # Fuzzy matching, search, and category helpers
│   ├── products-data.json      # 133-product catalog database
│   └── razorpay.ts             # Razorpay client & HMAC signature validator
├── types/                      # TypeScript definitions (Cart, Product, Orders, API)
├── eslint.config.mjs           # ESLint configuration
├── next.config.ts              # Next.js configuration & security headers
├── package.json                # Project dependencies
├── tailwind.config.ts          # Tailwind theme & typography tokens
└── tsconfig.json               # TypeScript configuration
```

---

## 🛠️ Installation & Local Development

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **pnpm** / **yarn**

### 2. Setup Project
```bash
# Clone the repository
git clone <repository-url>
cd lollipop-nextjs

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
```

### 3. Environment Variables (`.env.local`)
Edit `.env.local` and add your Razorpay keys:
```env
# Razorpay Credentials (obtain from https://dashboard.razorpay.com)
RAZORPAY_KEY_ID=rzp_test_YourKeyIdHere
RAZORPAY_KEY_SECRET=YourKeySecretHere

# Optional: Webhook secret if configuring Razorpay Webhooks
RAZORPAY_WEBHOOK_SECRET=YourWebhookSecretHere
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Automated Security & Sanity Audit Suite
```bash
# Run security test suite (Price tampering defense, HMAC verification, Zod validation, Idempotency)
npm test
```

### 6. Production Build Verification
```bash
npm run build
npm run start
```

---

## 🎯 Is This Code Production Ready?

### ✅ What is Fully Production Ready Right Now:
1. **Architecture & Security**: Clean Next.js 15 App Router architecture with strict server-side price validation and HMAC-SHA256 signature verification.
2. **Speed & Reliability**: 153 pages pre-rendered via SSG for instantaneous response times.
3. **TypeScript & Validation**: 100% type coverage with Zod validation on API inputs.
4. **Responsive Luxury Design**: Mobile-first design, custom glassmorphism, responsive navigation drawer, toast notifications, and modal search.

### 🚀 Final Deployment Readiness Checklist (Before Going Live):

| Task | Status | Requirement / Next Steps |
|---|---|---|
| **Database Persistence** | ⚠️ In-Memory | Replace `InMemoryOrderStore` in `lib/orders.ts` with a real database (PostgreSQL via Prisma/Drizzle, Supabase, MongoDB, or PlanetScale) to persist orders across serverless instances. |
| **Razorpay Production Keys** | ⚠️ Config Required | Replace test key credentials (`rzp_test_...`) with Live Razorpay Keys in production environment variables. |
| **Webhooks (Recommended)** | 💡 Ready in Code | Configure a Razorpay Webhook route (`/api/razorpay/webhook`) using `verifyWebhookSignature` in `lib/razorpay.ts` for secondary payment confirmation. |
| **Rate Limiting** | 💡 Optional | Add Upstash Redis rate limiting on checkout endpoints to block automated requests. |

---

## 📄 License
Copyright © 2026 Lollipop Cake Shop. All rights reserved.
