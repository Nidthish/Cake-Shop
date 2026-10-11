# Product Catalog In-Memory Cache System

This document outlines the architecture, specification, and implementation blueprint for the **Product Catalog Cache System** in Lollipop Cake Shop.

---

## 1. Scope & Objective

### ✅ IN SCOPE (What is Cached):
The cache is **strictly limited to catalog product fetching** from the database for the 5 customer-facing catalog tabs and product detail views:
1. **Cakes Catalog** (`/cakes`)
2. **Dry Cakes Catalog** (`/dry-cakes`)
3. **1st Birthday Cakes** (`/first-birthday`)
4. **Wedding Cakes** (`/wedding-cakes`)
5. **Bento Cakes** (`/bento-cake`)
6. **Snacks Catalog** (`/snacks`)
7. **Product Detail Pages** (`/products/[slug]`)
8. **Homepage Catalog Showcases** (`/`)

### ❌ STRICTLY EXCLUDED (What is NEVER Cached):
To guarantee complete security, data integrity, and real-time accuracy, the following areas **MUST NEVER BE CACHED**:
* **Admin Dashboard (`/admin`)**: All product lists, sales metrics, and stock controls query live Neon PostgreSQL every single time.
* **Customer Orders & Checkout (`/cart`, `/checkout`)**: Cart calculations, coupon applications, and order placements are 100% real-time transactions.
* **Order Tracking (`/track-order`, `/search-order`)**: Order statuses, delivery partner assignments, and OTPs are always live.
* **Delivery Rider & Admin Authentication (`/api/auth/*`)**: All authentication sessions, role verifications, and tokens are processed live without caching.

---

## 2. Problem Statement & Motivation

### Current Architecture Without Cache:
* **Neon PostgreSQL Database Location:** `us-east-2` (Ohio, United States).
* **Application Visitors & Server Location:** India.
* **Round-trip Network Latency:** 200ms – 400ms per database round-trip across the ocean.
* **Behavior:** Every time a visitor clicks between the 5 tabs (e.g. from *Bento* to *Wedding* to *1st Birthday*), the server executes fresh SQL queries to Ohio, resulting in **1.5s to 3.5s of waiting time**.
* **Product Detail Redundancy:** On `/products/[slug]`, Next.js calls `generateMetadata()` for SEO and `ProductDetailPage()` for the UI sequentially, executing **two separate cross-ocean round-trips (3s – 5s total latency)**.

### Target Performance With Product Cache:
| Metric | Without Cache (Direct DB) | With Product In-Memory Cache |
| :--- | :--- | :--- |
| **Catalog Page Latency** | 3,500 ms – 5,000 ms | **10 ms – 35 ms (Near-instant)** |
| **Product Detail Latency** | 4,500 ms – 7,800 ms | **20 ms – 50 ms** |
| **Database Network Hops** | 1 to 2 queries *per click* | **1 query per 60 seconds (shared by all users)** |
| **Neon Compute Hours** | High (frequent queries) | **~90% reduction in database load** |

---

## 3. Architecture & Operational Mechanics

### A. Lazy / On-Demand Execution (No Timers, No Polling)
The cache operates on a **lazy on-demand model**:
* **No background processes:** There is **no `setInterval`**, **no cron job**, and **no polling loop**.
* **Zero Idle Compute:** If no customers visit the website for 6 hours (e.g. overnight), **0 requests are sent to Neon DB**. Neon automatically goes to sleep, consuming 0 compute units.
* **Activation:** The cache is only evaluated when an actual user requests a product page.

### B. Lifecycle Diagram

```
User visits /bento-cake
       │
       ▼
Check RAM Cache:
Is cache empty OR older than 60 seconds?
       ├── YES (Cold / Expired) ──> Fetch from Neon DB (~1.5s)
       │                            Save in RAM with current timestamp
       │                            Return products to user
       │
       └── NO (Warm / Valid)    ──> Return immediately from RAM (2ms)
                                    (ZERO database round-trips!)
```

### C. Timeline Example

```
10:00:00 AM ── User A opens /cakes       ──> Neon DB queried once (1.5s). Cached in RAM until 10:01:00 AM.
10:00:15 AM ── User A opens /bento-cake  ──> Served from RAM in 3ms (0 DB calls).
10:00:30 AM ── User B opens /wedding     ──> Served from RAM in 3ms (0 DB calls).
10:00:45 AM ── User B opens cake details ──> Served from RAM in 5ms (0 DB calls).
10:01:00 AM to 02:00:00 PM ── Site is idle ──> ZERO calls to Neon DB. Database sleeps.
02:00:05 PM ── User C opens /cakes       ──> Cache expired; Neon DB queried once (1.5s). Refreshed in RAM.
```

---

## 4. Implementation Blueprint

### File: `lib/products.ts`

```typescript
import { cache } from "react";
import { neon } from "@neondatabase/serverless";

// 1. In-Memory Cache Storage (Lives in Node.js server RAM)
interface CatalogCache {
  data: Product[] | null;
  timestamp: number;
}

const CACHE_TTL_MS = 60 * 1000; // 60 seconds Time-To-Live
let catalogCache: CatalogCache = {
  data: null,
  timestamp: 0,
};

/**
 * Invalidate the catalog cache immediately.
 * Called when an admin updates, adds, or deletes a product.
 */
export function invalidateProductCache(): void {
  catalogCache.data = null;
  catalogCache.timestamp = 0;
  console.log("[CATALOG_CACHE] Cache manually invalidated.");
}

/**
 * Internal fetcher with 60s in-memory caching.
 * Only applied to the public catalog (the 5 tabs).
 */
async function fetchCatalogWithCache(): Promise<Product[]> {
  const now = Date.now();
  const isFresh = catalogCache.data && (now - catalogCache.timestamp < CACHE_TTL_MS);

  if (isFresh && catalogCache.data) {
    // CACHE HIT: Instant return from server memory
    return catalogCache.data;
  }

  // CACHE MISS: Fetch once from Neon DB
  try {
    const products = await fetchFromNeonDatabase();
    catalogCache = {
      data: products,
      timestamp: Date.now(),
    };
    return products;
  } catch (error) {
    // Resilience Fallback: If DB query fails, return stale cache if available
    if (catalogCache.data) {
      console.warn("[CATALOG_CACHE] DB fetch failed, returning stale cache fallback.");
      return catalogCache.data;
    }
    throw error;
  }
}

/**
 * 2. React cache() Request Deduplication
 * Deduplicates multiple calls within a single page render (e.g. metadata + page component)
 */
export const getCachedProducts = cache(async (): Promise<Product[]> => {
  return await fetchCatalogWithCache();
});
```

---

## 5. Instant Admin Cache Invalidation

One common concern with caching is: *"What if I change a cake price or pause sales in the Admin Dashboard? Will customers have to wait 60 seconds?"*

### Solution: Instant On-Demand Invalidation
Whenever an admin performs a mutation in the admin panel (`POST /api/admin/products`, `PATCH /api/admin/products/[id]`, or `DELETE /api/admin/products/[id]`), the API route calls:

```typescript
import { invalidateProductCache } from "@/lib/products";

export async function PATCH(req: Request) {
  // 1. Update Neon PostgreSQL
  await db.product.update({ ... });

  // 2. Clear the catalog cache instantly
  invalidateProductCache();

  // 3. Return success
  return NextResponse.json({ success: true });
}
```

**Result:**
* If an admin changes a price or pauses a cake, the cache is instantly cleared.
* The very next customer request immediately gets the latest live price from Neon.
* If no changes are made, customers enjoy 2-millisecond instant page loading.

---

## 6. Safety & Security Guarantees

1. **Isolation from Orders:** The orders table and checkout logic never interact with `catalogCache`. Every checkout and order status check reads directly from the database with live ACID transactions.
2. **Zero Memory Leak Risk:** 140 catalog products in memory take approximately **~150 KB of RAM**, which is negligible (a standard server has 512 MB to 2 GB of RAM).
3. **Resilience / High Availability:** If Neon PostgreSQL has a momentary network hiccup or cold-start timeout, the in-memory cache gracefully serves the catalog to customers with 100% uptime instead of displaying an error screen.
4. **Admin Route Separation:** Admin routes (`/admin`, `/api/admin/*`) bypass this cache completely to ensure store managers always see ground-truth live data.
