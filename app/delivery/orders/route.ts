import { NextRequest, NextResponse } from "next/server";
import { getNeonSql } from "@/lib/neon";
import { getMySqlPool } from "@/lib/mysql";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept, X-Requested-With",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

// Helper to format order for mobile response
function formatDeliveryOrder(o: any, items: any[] = []) {
  return {
    id: o.orderNumber || o.order_number || o.id?.toString(),
    dbId: o.id?.toString(),
    orderNumber: o.orderNumber || o.order_number,
    status: o.status,
    customer: {
      fullName: o.customerName || o.customer_name || "Guest Customer",
      email: o.customerEmail || o.customer_email || "",
      phone: o.customerPhone || o.customer_phone || "",
    },
    address: {
      street: o.streetAddress || o.street_address || "",
      city: o.city || "",
      pincode: o.pincode || "",
      state: o.state || "Tamil Nadu",
      landmark: o.landmark || null,
      mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${o.streetAddress || o.street_address || ""}, ${o.city || ""}, ${o.pincode || ""}`
      )}`,
    },
    schedule: {
      date: o.deliveryDate || (o.delivery_date ? new Date(o.delivery_date).toISOString().split("T")[0] : ""),
      timeSlot: o.deliveryTimeSlot || o.delivery_time_slot || "Standard Delivery",
      notes: o.deliveryNotes || o.delivery_notes || null,
    },
    pricing: {
      subtotal: Number(o.subtotal || 0),
      taxAmount: Number(o.taxAmount || o.tax_amount || 0),
      deliveryFee: Number(o.deliveryFee || o.delivery_fee || 0),
      totalAmount: Number(o.totalAmount || o.total_amount || 0),
    },
    payment: {
      method: o.paymentMethod || o.payment_method || "COD",
      status: o.paymentStatus || o.payment_status || "PENDING",
      isPrepaid: (o.paymentStatus || o.payment_status) === "PAID",
      amountToCollect:
        (o.paymentStatus || o.payment_status) === "PAID"
          ? 0
          : Number(o.totalAmount || o.total_amount || 0),
    },
    delivery: {
      otp: o.deliveryOtp || o.delivery_otp || null,
      otpVerified: Boolean(o.deliveryOtpVerified || o.delivery_otp_verified),
      partnerName: o.deliveryPartnerName || o.delivery_partner_name || null,
      partnerPhone: o.deliveryPartnerPhone || o.delivery_partner_phone || null,
      cancellationReason: o.cancellationReason || o.cancellation_reason || null,
      cancelledAt: o.cancelledAt || o.cancelled_at || null,
      deliveredAt: o.deliveredAt || o.delivered_at || null,
      assignedAt: o.assignedAt || o.assigned_at || null,
    },
    hasEgglessItems: Boolean(o.hasEgglessItems || o.has_eggless_items),
    itemCount: items.length,
    items: items.map((i: any) => ({
      id: i.id?.toString(),
      productId: i.productCode || i.product_code || "",
      name: i.productName || i.product_name || "Cake Item",
      variant: i.variantName || i.variant_name || "",
      isEggless: Boolean(i.isEggless || i.is_eggless),
      quantity: Number(i.quantity || 1),
      unitPrice: Number(i.unitPrice || i.unit_price || 0),
      lineTotal: Number(i.lineTotal || i.line_total || 0),
      cakeMessage: i.cakeMessage || i.cake_message || null,
      offer: i.offer || null,
    })),
    createdAt: o.createdAt || (o.created_at ? new Date(o.created_at).toISOString() : new Date().toISOString()),
    updatedAt: o.updatedAt || (o.updated_at ? new Date(o.updated_at).toISOString() : new Date().toISOString()),
  };
}

/**
 * GET /delivery/orders
 * Query Parameters:
 *   - status: 'ALL' | 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED'
 *   - search: string (matches order number, customer name, phone, city)
 *   - limit: number (default 50)
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const statusParam = (searchParams.get("status") || "ALL").toUpperCase();
    const searchParam = searchParams.get("search")?.trim() || "";
    const limit = Math.min(parseInt(searchParams.get("limit") || "100", 10), 200);

    // 1. Try Neon PostgreSQL
    try {
      const sql = getNeonSql();
      if (sql) {
        let rows: any[] = [];
        if (statusParam === "ALL" && !searchParam) {
          rows = await sql`
            SELECT 
              o.*,
              to_char(o.delivery_date, 'YYYY-MM-DD') as "deliveryDate",
              p.payment_status as "paymentStatus",
              p.payment_method as "paymentMethod",
              p.razorpay_payment_id as "razorpayPaymentId",
              COALESCE(
                json_agg(
                  json_build_object(
                    'id', i.id,
                    'product_code', i.product_code,
                    'product_name', i.product_name,
                    'variant_name', i.variant_name,
                    'is_eggless', i.is_eggless,
                    'quantity', i.quantity,
                    'unit_price', i.unit_price,
                    'line_total', i.line_total,
                    'cake_message', i.cake_message,
                    'offer', i.offer
                  )
                ) FILTER (WHERE i.id IS NOT NULL),
                '[]'
              ) as items
            FROM orders o
            LEFT JOIN payments p ON p.order_id = o.id
            LEFT JOIN order_items i ON i.order_id = o.id
            GROUP BY o.id, p.id
            ORDER BY o.created_at DESC
            LIMIT ${limit}
          `;
        } else if (statusParam !== "ALL" && !searchParam) {
          rows = await sql`
            SELECT 
              o.*,
              to_char(o.delivery_date, 'YYYY-MM-DD') as "deliveryDate",
              p.payment_status as "paymentStatus",
              p.payment_method as "paymentMethod",
              p.razorpay_payment_id as "razorpayPaymentId",
              COALESCE(
                json_agg(
                  json_build_object(
                    'id', i.id,
                    'product_code', i.product_code,
                    'product_name', i.product_name,
                    'variant_name', i.variant_name,
                    'is_eggless', i.is_eggless,
                    'quantity', i.quantity,
                    'unit_price', i.unit_price,
                    'line_total', i.line_total,
                    'cake_message', i.cake_message,
                    'offer', i.offer
                  )
                ) FILTER (WHERE i.id IS NOT NULL),
                '[]'
              ) as items
            FROM orders o
            LEFT JOIN payments p ON p.order_id = o.id
            LEFT JOIN order_items i ON i.order_id = o.id
            WHERE o.status = ${statusParam}
            GROUP BY o.id, p.id
            ORDER BY o.created_at DESC
            LIMIT ${limit}
          `;
        } else {
          // Search with filter
          const pattern = `%${searchParam}%`;
          rows = await sql`
            SELECT 
              o.*,
              to_char(o.delivery_date, 'YYYY-MM-DD') as "deliveryDate",
              p.payment_status as "paymentStatus",
              p.payment_method as "paymentMethod",
              p.razorpay_payment_id as "razorpayPaymentId",
              COALESCE(
                json_agg(
                  json_build_object(
                    'id', i.id,
                    'product_code', i.product_code,
                    'product_name', i.product_name,
                    'variant_name', i.variant_name,
                    'is_eggless', i.is_eggless,
                    'quantity', i.quantity,
                    'unit_price', i.unit_price,
                    'line_total', i.line_total,
                    'cake_message', i.cake_message,
                    'offer', i.offer
                  )
                ) FILTER (WHERE i.id IS NOT NULL),
                '[]'
              ) as items
            FROM orders o
            LEFT JOIN payments p ON p.order_id = o.id
            LEFT JOIN order_items i ON i.order_id = o.id
            WHERE (${statusParam} = 'ALL' OR o.status = ${statusParam})
              AND (
                o.order_number ILIKE ${pattern} OR
                o.customer_name ILIKE ${pattern} OR
                o.customer_phone ILIKE ${pattern} OR
                o.city ILIKE ${pattern}
              )
            GROUP BY o.id, p.id
            ORDER BY o.created_at DESC
            LIMIT ${limit}
          `;
        }

        // Compute summary counts from Neon
        const countRows = await sql`
          SELECT 
            status,
            COUNT(*)::int as cnt
          FROM orders
          GROUP BY status
        `;
        const stats: Record<string, number> = {
          total: 0,
          pending: 0,
          confirmed: 0,
          preparing: 0,
          outForDelivery: 0,
          delivered: 0,
          cancelled: 0,
          active: 0,
        };

        for (const cr of countRows) {
          const st = cr.status;
          const cnt = Number(cr.cnt);
          stats.total += cnt;
          if (st === "PENDING") stats.pending += cnt;
          else if (st === "CONFIRMED") stats.confirmed += cnt;
          else if (st === "PREPARING") stats.preparing += cnt;
          else if (st === "OUT_FOR_DELIVERY") stats.outForDelivery += cnt;
          else if (st === "DELIVERED") stats.delivered += cnt;
          else if (st === "CANCELLED") stats.cancelled += cnt;
        }
        stats.active = stats.pending + stats.confirmed + stats.preparing + stats.outForDelivery;

        const formatted = rows.map((r: any) => formatDeliveryOrder(r, Array.isArray(r.items) ? r.items : []));

        return NextResponse.json({
          success: true,
          source: "neon",
          stats,
          count: formatted.length,
          orders: formatted,
        }, { headers: corsHeaders });
      }
    } catch (neonErr: any) {
      console.warn("⚠️ [Delivery API /orders] Neon query failed, falling back to MySQL:", neonErr?.message || neonErr);
    }

    // 2. MySQL Fallback
    try {
      const pool = getMySqlPool();
      if (pool) {
        let query = `
          SELECT 
            o.*,
            DATE_FORMAT(o.delivery_date, '%Y-%m-%d') as deliveryDate,
            p.payment_status as paymentStatus,
            p.payment_method as paymentMethod,
            p.razorpay_payment_id as razorpayPaymentId
          FROM lollipop_db.orders o
          LEFT JOIN lollipop_db.payments p ON p.order_id = o.id
        `;
        const queryParams: any[] = [];

        if (statusParam !== "ALL" && !searchParam) {
          query += ` WHERE o.status = ?`;
          queryParams.push(statusParam);
        } else if (searchParam) {
          query += ` WHERE 1=1`;
          if (statusParam !== "ALL") {
            query += ` AND o.status = ?`;
            queryParams.push(statusParam);
          }
          query += ` AND (o.order_number LIKE ? OR o.customer_name LIKE ? OR o.customer_phone LIKE ? OR o.city LIKE ?)`;
          const pat = `%${searchParam}%`;
          queryParams.push(pat, pat, pat, pat);
        }

        query += ` ORDER BY o.created_at DESC LIMIT ?`;
        queryParams.push(limit);

        const [orders]: any = await pool.query(query, queryParams);

        const orderIds = orders.map((o: any) => o.id);
        const itemsByOrderId: Record<number, any[]> = {};
        if (orderIds.length > 0) {
          const [items]: any = await pool.query(
            `SELECT * FROM lollipop_db.order_items WHERE order_id IN (?)`,
            [orderIds]
          );
          for (const item of items) {
            if (!itemsByOrderId[item.order_id]) itemsByOrderId[item.order_id] = [];
            itemsByOrderId[item.order_id].push(item);
          }
        }

        // Stats from MySQL
        const [statsRows]: any = await pool.query(
          `SELECT status, COUNT(*) as cnt FROM lollipop_db.orders GROUP BY status`
        );
        const stats: Record<string, number> = {
          total: 0,
          pending: 0,
          confirmed: 0,
          preparing: 0,
          outForDelivery: 0,
          delivered: 0,
          cancelled: 0,
          active: 0,
        };

        for (const sr of statsRows) {
          const st = sr.status;
          const cnt = Number(sr.cnt);
          stats.total += cnt;
          if (st === "PENDING") stats.pending += cnt;
          else if (st === "CONFIRMED") stats.confirmed += cnt;
          else if (st === "PREPARING") stats.preparing += cnt;
          else if (st === "OUT_FOR_DELIVERY") stats.outForDelivery += cnt;
          else if (st === "DELIVERED") stats.delivered += cnt;
          else if (st === "CANCELLED") stats.cancelled += cnt;
        }
        stats.active = stats.pending + stats.confirmed + stats.preparing + stats.outForDelivery;

        const formatted = orders.map((o: any) => formatDeliveryOrder(o, itemsByOrderId[o.id] || []));

        return NextResponse.json({
          success: true,
          source: "mysql",
          stats,
          count: formatted.length,
          orders: formatted,
        }, { headers: corsHeaders });
      }
    } catch (mysqlErr: any) {
      console.warn("⚠️ [Delivery API /orders] MySQL query failed, falling back to Prisma:", mysqlErr?.message || mysqlErr);
    }

    // 3. Prisma Fallback
    const whereClause: any = {};
    if (statusParam !== "ALL") {
      whereClause.status = statusParam;
    }
    if (searchParam) {
      whereClause.OR = [
        { orderNumber: { contains: searchParam, mode: "insensitive" } },
        { customerName: { contains: searchParam, mode: "insensitive" } },
        { customerPhone: { contains: searchParam, mode: "insensitive" } },
      ];
    }

    const prismaOrders = await prisma.order.findMany({
      where: whereClause,
      include: { items: true, payment: true },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    const formatted = prismaOrders.map((o) =>
      formatDeliveryOrder(
        {
          ...o,
          orderNumber: o.orderNumber,
          customerName: o.customerName,
          customerEmail: o.customerEmail,
          customerPhone: o.customerPhone,
          streetAddress: o.streetAddress,
          deliveryDate: o.deliveryDate.toISOString().split("T")[0],
          deliveryTimeSlot: o.deliveryTimeSlot,
          paymentStatus: o.payment?.paymentStatus || "PENDING",
          paymentMethod: o.payment?.paymentMethod || "COD",
        },
        o.items
      )
    );

    return NextResponse.json({
      success: true,
      source: "prisma",
      count: formatted.length,
      orders: formatted,
    }, { headers: corsHeaders });
  } catch (error: any) {
    console.error("[GET /delivery/orders] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch delivery orders" },
      { status: 500, headers: corsHeaders }
    );
  }
}
