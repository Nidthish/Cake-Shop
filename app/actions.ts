"use server";

import { neon } from "@neondatabase/serverless";
import { getDbProducts, PRODUCTS_DATA } from "@/lib/products";
import { prisma } from "@/lib/prisma";
import { getNeonSql } from "@/lib/neon";

/**
 * Lollipop Cake Shop — Production-Ready Server Actions
 * Powered by Neon Serverless PostgreSQL (@neondatabase/serverless)
 */

/**
 * Server Action: getData()
 * Production-ready database data fetcher using Neon Serverless PostgreSQL.
 * Connects directly using process.env.DATABASE_URL and executes Neon SQL queries.
 * Preserves all shop catalog details, orders, and stats.
 */
export async function getData() {
  const sql = getNeonSql();

  if (sql) {
    try {
      // Concurrently query active catalog, categories, order metrics from Neon PostgreSQL
      const [products, categories, orderStats, categoriesCountResult] = await Promise.all([
        sql`SELECT p.*, c.name as category_name, c.slug as category_slug 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id 
            WHERE p.is_active = true 
            ORDER BY p.id ASC`,
        sql`SELECT * FROM categories ORDER BY name ASC`,
        sql`SELECT COUNT(*)::int as total_orders, 
                   COALESCE(SUM(CASE 
                     WHEN o.status = 'DELIVERED' OR p.payment_status = 'PAID' THEN o.total_amount 
                     ELSE 0 
                   END), 0)::float as total_revenue 
            FROM orders o
            LEFT JOIN payments p ON p.order_id = o.id
            WHERE o.status != 'CANCELLED'`,
        sql`SELECT COUNT(*)::int as total_categories FROM categories`
      ]);

      return {
        success: true,
        source: "neon-serverless",
        timestamp: new Date().toISOString(),
        productsCount: products.length,
        categoriesCount: categoriesCountResult[0]?.total_categories || categories.length,
        stats: {
          totalOrders: orderStats[0]?.total_orders || 0,
          totalRevenue: orderStats[0]?.total_revenue || 0,
        },
        data: {
          products,
          categories,
        },
      };
    } catch (error: any) {
      console.warn("Neon serverless query warning, falling back to Prisma/JSON store:", error?.message || error);
    }
  }

  // Production Fallback: Retrieve products via Prisma or JSON store if Neon connection string is local/pending
  try {
    const products = await getDbProducts();
    const categoriesCount = await prisma.category.count().catch(() => 0);
    const ordersCount = await prisma.order.count().catch(() => 0);

    return {
      success: true,
      source: "prisma-fallback",
      timestamp: new Date().toISOString(),
      productsCount: products.length,
      categoriesCount,
      stats: {
        totalOrders: ordersCount,
        totalRevenue: 0,
      },
      data: {
        products,
      },
    };
  } catch {
    return {
      success: true,
      source: "static-fallback",
      timestamp: new Date().toISOString(),
      productsCount: PRODUCTS_DATA.length,
      categoriesCount: 6,
      stats: {
        totalOrders: 0,
        totalRevenue: 0,
      },
      data: {
        products: PRODUCTS_DATA,
      },
    };
  }
}

/**
 * Server Action: getProductsData()
 * Returns product catalog directly from Neon database using SQL.
 */
export async function getProductsData() {
  const sql = getNeonSql();

  if (sql) {
    try {
      const products = await sql`
        SELECT p.id, p.product_code, p.name, p.slug, p.description, p.image_name, p.badge, 
               p.rating, p.review_count, p.is_active, p.product_type,
               c.name as category_name, c.slug as category_slug
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.is_active = true
        ORDER BY p.id ASC
      `;
      return { success: true, source: "neon-serverless", data: products };
    } catch (error: any) {
      console.warn("Neon fetch products error:", error?.message);
    }
  }

  const products = await getDbProducts();
  return { success: true, source: "fallback", data: products };
}

/**
 * Server Action: getCategoriesData()
 * Returns category list directly from Neon database using SQL.
 */
export async function getCategoriesData() {
  const sql = getNeonSql();

  if (sql) {
    try {
      const categories = await sql`SELECT * FROM categories ORDER BY id ASC`;
      return { success: true, source: "neon-serverless", data: categories };
    } catch (error: any) {
      console.warn("Neon fetch categories error:", error?.message);
    }
  }

  try {
    const categories = await prisma.category.findMany({ orderBy: { id: "asc" } });
    return { success: true, source: "prisma", data: categories };
  } catch {
    return { success: true, source: "fallback", data: [] };
  }
}

/**
 * Server Action: getOrdersData()
 * Returns orders list directly from Neon database using SQL.
 */
export async function getOrdersData(limit: number = 20) {
  const sql = getNeonSql();

  if (sql) {
    try {
      const orders = await sql`
        SELECT id, order_number, customer_name, customer_email, customer_phone, 
               total_amount, status, delivery_date, created_at
        FROM orders
        ORDER BY id DESC
        LIMIT ${limit}
      `;
      return { success: true, source: "neon-serverless", data: orders };
    } catch (error: any) {
      console.warn("Neon fetch orders error:", error?.message);
    }
  }

  try {
    const orders = await prisma.order.findMany({
      take: limit,
      orderBy: { id: "desc" },
    });
    return { success: true, source: "prisma", data: orders };
  } catch {
    return { success: true, source: "fallback", data: [] };
  }
}

/**
 * Server Action: storeProductInNeon()
 * Insert or update a product item in Neon PostgreSQL database.
 */
export async function storeProductInNeon(productData: {
  productCode: string;
  name: string;
  slug: string;
  categoryId: number;
  description?: string;
  imageName?: string;
  badge?: string;
  productType?: "CAKE" | "SNACK";
}) {
  const sql = getNeonSql();
  if (!sql) {
    throw new Error("Neon DATABASE_URL environment variable is missing or invalid.");
  }

  const { productCode, name, slug, categoryId, description, imageName, badge, productType } = productData;

  const result = await sql`
    INSERT INTO products (
      category_id, product_code, name, slug, description, image_name, badge, product_type, is_active
    ) VALUES (
      ${categoryId}, ${productCode}, ${name}, ${slug}, ${description || ""}, ${imageName || "product.image"}, ${badge || null}, ${productType || "CAKE"}, true
    )
    ON CONFLICT (slug) 
    DO UPDATE SET 
      name = EXCLUDED.name,
      description = EXCLUDED.description,
      image_name = EXCLUDED.image_name,
      badge = EXCLUDED.badge,
      updated_at = NOW()
    RETURNING *
  `;

  return { success: true, data: result[0] };
}
