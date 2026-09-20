---
description: How to manage product catalog CRUD, price variants, pause/resume sales, and MySQL to Client synchronization in Lollipop Cake Shop
---

# Product Catalog & Admin Management Workflow

This workflow documents how product data flows between the **MySQL 8.0 Database**, the **Admin Dashboard (`/admin`)**, and the **Client Storefront pages (`/cakes`, `/dry-cakes`, `/snacks`)**.

---

## 1. Product Sorting Order
Products are retrieved from the database sorted in **ascending order by product ID (`id: "asc"`)**.

- **Admin API**: `GET /api/admin/products` queries `prisma.product.findMany({ orderBy: { id: "asc" } })`.
- **Client Helper**: `getDbProducts()` in `lib/products.ts` queries `prisma.product.findMany({ where: { isActive: true }, orderBy: { id: "asc" } })`.

---

## 2. Product Sales Toggling (Pause / Resume Sales)
Admins can pause or resume sales for any product directly from the Admin Dashboard:

1. Navigating to `http://localhost:3000/admin`.
2. Locating the item in the **Products & Catalog** list.
3. Clicking **Pause Sales** or **Resume Sales**.
4. The frontend sends a `PUT /api/admin/products/[id]` request with `{ isActive: false }` or `{ isActive: true }`.
5. MySQL updates the `is_active` column in the `products` table.
6. Paused products (`isActive = false`) are automatically excluded from customer-facing pages (`/cakes`, `/dry-cakes`, `/snacks`) via `getDbProducts()`.

---

## 3. Product CRUD Workflow

### **Adding a New Cake / Product**
1. Click **+ Add New Cake / Product** on `/admin`.
2. Enter product details (Name, Category, Description, Badge, Image).
3. Set price variants (`0.5kg`, `1kg`, `1.5kg`), prices, egg preference, and `1kg Free Offer` tags.
4. Click **Publish New Product**.
5. Product is inserted into MySQL (`products`, `product_variants`, `product_offers`) and immediately appears across the application in ascending ID order.

### **Editing an Existing Product**
1. Click **Edit Item** next to any product on `/admin`.
2. Modify name, category, prices, or variants.
3. Click **Update Product** to update MySQL records.

---

## 4. Operational & Database Error Protection
- All API routes (`/api/admin/products`, `/api/admin/orders`, `/api/products`) return strict `application/json` responses.
- Frontend fetch calls verify `response.ok` before invoking `response.json()`, preventing HTML error syntax errors (`Unexpected token '<'`).
