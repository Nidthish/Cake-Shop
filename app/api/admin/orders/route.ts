import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedAdmin } from "@/lib/auth";
import { getNeonSql } from "@/lib/neon";
import { getMySqlPool } from "@/lib/mysql";
import { prisma } from "@/lib/prisma";
import { orderStore } from "@/lib/orders";
import { sendOrderDeliveredEmail } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/admin/orders — Fetch orders with selective date filtering & on-demand search
export async function GET(req: NextRequest) {
  try {
    const admin = await getAuthenticatedAdmin(req);
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized access." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const searchParam = (searchParams.get("q") || searchParams.get("search") || "").trim();
    // Default to 'today' unless searching or explicit dateFilter is passed
    const rawDate = searchParams.get("date") || searchParams.get("dateFilter");
    const dateFilter = (rawDate || (searchParam ? "all" : "today")).toLowerCase();
    const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "150", 10), 1), 300);

    const hasSearch = Boolean(searchParam.length > 0);
    const searchPattern = `%${searchParam}%`;

    // 1. Fetch from Neon PostgreSQL (HTTPS port 443)
    try {
      const sql = getNeonSql();
      if (sql) {
        const rows = await sql`
          SELECT 
            o.id,
            o.order_number as "orderNumber",
            o.customer_name as "customerName",
            o.customer_email as "customerEmail",
            o.customer_phone as "customerPhone",
            o.street_address as "streetAddress",
            o.city,
            o.pincode,
            to_char(o.delivery_date, 'YYYY-MM-DD') as "deliveryDate",
            o.delivery_time_slot as "deliveryTimeSlot",
            o.has_eggless_items as "hasEgglessItems",
            o.subtotal,
            o.tax_amount as "taxAmount",
            o.delivery_fee as "deliveryFee",
            o.total_amount as "totalAmount",
            o.status,
            o.delivery_otp as "deliveryOtp",
            o.delivery_otp_verified as "deliveryOtpVerified",
            o.delivery_partner_name as "deliveryPartnerName",
            o.delivery_partner_phone as "deliveryPartnerPhone",
            o.delivery_notes as "specialInstructions",
            o.delivery_notes as "deliveryNotes",
            o.cancellation_reason as "cancellationReason",
            o.cancelled_at as "cancelledAt",
            o.delivered_at as "deliveredAt",
            o.assigned_at as "assignedAt",
            o.created_at as "createdAt",
            p.payment_status as "paymentStatus",
            p.payment_method as "paymentMethod",
            p.razorpay_payment_id as "razorpayPaymentId",
            COALESCE(
              json_agg(
                json_build_object(
                  'id', i.id,
                  'productCode', i.product_code,
                  'productName', i.product_name,
                  'variantName', i.variant_name,
                  'isEggless', i.is_eggless,
                  'quantity', i.quantity,
                  'unitPrice', i.unit_price,
                  'lineTotal', i.line_total,
                  'cakeMessage', i.cake_message,
                  'offer', i.offer
                )
              ) FILTER (WHERE i.id IS NOT NULL),
              '[]'
            ) as items
          FROM orders o
          LEFT JOIN payments p ON p.order_id = o.id
          LEFT JOIN order_items i ON i.order_id = o.id
          WHERE 
            (${hasSearch} = false OR (
              o.order_number ILIKE ${searchPattern} OR
              o.id::text ILIKE ${searchPattern} OR
              o.customer_name ILIKE ${searchPattern} OR
              o.customer_phone ILIKE ${searchPattern} OR
              o.customer_email ILIKE ${searchPattern}
            ))
            AND (
              ${dateFilter} = 'all' OR
              (${dateFilter} = 'today' AND (
                (o.created_at AT TIME ZONE 'Asia/Kolkata')::date = (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata')::date OR 
                o.delivery_date = (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata')::date
              )) OR
              (${dateFilter} = 'yesterday' AND (
                (o.created_at AT TIME ZONE 'Asia/Kolkata')::date = ((CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata') - INTERVAL '1 day')::date
              )) OR
              (${dateFilter} = '7days' AND (
                (o.created_at AT TIME ZONE 'Asia/Kolkata')::date >= ((CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata') - INTERVAL '7 days')::date
              )) OR
              (${dateFilter} = 'month' AND (
                to_char(o.created_at AT TIME ZONE 'Asia/Kolkata', 'YYYY-MM') = to_char(CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata', 'YYYY-MM')
              ))
            )
          GROUP BY o.id, p.id
          ORDER BY o.created_at DESC
          LIMIT ${limit}
        `;

        const formatted = rows.map((o: any) => ({
          id: o.id.toString(),
          orderNumber: o.orderNumber,
          customerName: o.customerName,
          customerEmail: o.customerEmail,
          customerPhone: o.customerPhone,
          streetAddress: o.streetAddress,
          city: o.city,
          pincode: o.pincode,
          deliveryDate: o.deliveryDate || (o.delivery_date ? new Date(o.delivery_date).toISOString().split("T")[0] : ""),
          deliveryTimeSlot: o.deliveryTimeSlot,
          hasEgglessItems: Boolean(o.hasEgglessItems),
          subtotal: Number(o.subtotal),
          taxAmount: Number(o.taxAmount),
          deliveryFee: Number(o.deliveryFee),
          totalAmount: Number(o.totalAmount),
          status: o.status,
          deliveryOtp: o.deliveryOtp || null,
          deliveryOtpVerified: Boolean(o.deliveryOtpVerified),
          deliveryPartnerName: o.deliveryPartnerName || null,
          deliveryPartnerPhone: o.deliveryPartnerPhone || null,
          cancellationReason: o.cancellationReason || null,
          cancelledAt: o.cancelledAt ? new Date(o.cancelledAt).toISOString() : null,
          deliveredAt: o.deliveredAt ? new Date(o.deliveredAt).toISOString() : null,
          assignedAt: o.assignedAt ? new Date(o.assignedAt).toISOString() : null,
          createdAt: new Date(o.createdAt).toISOString(),
          specialInstructions: o.specialInstructions || o.deliveryNotes || null,
          deliveryNotes: o.deliveryNotes || o.specialInstructions || null,
          cakeMessage: o.cakeMessage || (Array.isArray(o.items) ? o.items.find((i: any) => i.cakeMessage)?.cakeMessage : null) || null,
          paymentStatus: o.paymentStatus || "PENDING",
          paymentMethod: o.paymentMethod || "COD",
          razorpayPaymentId: o.razorpayPaymentId || null,
          items: Array.isArray(o.items)
            ? o.items.map((i: any) => ({
                id: i.id?.toString(),
                productCode: i.productCode,
                productName: i.productName,
                variantName: i.variantName,
                isEggless: Boolean(i.isEggless),
                quantity: Number(i.quantity),
                unitPrice: Number(i.unitPrice),
                lineTotal: Number(i.lineTotal),
                cakeMessage: i.cakeMessage || null,
                offer: i.offer || null,
              }))
            : [],
        }));

        // Compute summary statistics
        const revenueOrders = formatted.filter(
          (o: any) => o.status !== "CANCELLED" && (o.status === "DELIVERED" || o.paymentStatus === "PAID")
        );
        const totalRevenue = revenueOrders.reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0);
        const pendingCodOrders = formatted.filter(
          (o: any) => o.status !== "CANCELLED" && o.status !== "DELIVERED" && o.paymentStatus !== "PAID"
        );
        const pendingCodAmount = pendingCodOrders.reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0);

        return NextResponse.json({
          success: true,
          count: formatted.length,
          filter: dateFilter,
          search: searchParam,
          orders: formatted,
          stats: {
            totalRevenue,
            totalCount: formatted.length,
            paidOrders: revenueOrders.length,
            avgOrderValue: revenueOrders.length > 0 ? totalRevenue / revenueOrders.length : 0,
            pendingCodCount: pendingCodOrders.length,
            pendingCodAmount,
          },
        });
      }
    } catch (neonErr: any) {
      console.warn("⚠️ [Admin Orders] Neon fetch failed, switching to MySQL fallback:", neonErr?.message || neonErr);
    }

    // 2. Fallback to MySQL (localhost:3306 lollipop_db)
    try {
      const pool = getMySqlPool();
      if (pool) {
        let mysqlWhere = "1=1";
        const mysqlParams: any[] = [];

        if (hasSearch) {
          mysqlWhere += " AND (o.order_number LIKE ? OR o.customer_name LIKE ? OR o.customer_phone LIKE ? OR o.customer_email LIKE ? OR CAST(o.id AS CHAR) LIKE ?)";
          mysqlParams.push(searchPattern, searchPattern, searchPattern, searchPattern, searchPattern);
        }

        if (dateFilter === "today") {
          mysqlWhere += " AND (DATE(o.created_at) = CURDATE() OR DATE(o.delivery_date) = CURDATE())";
        } else if (dateFilter === "yesterday") {
          mysqlWhere += " AND (DATE(o.created_at) = SUBDATE(CURDATE(), 1))";
        } else if (dateFilter === "7days") {
          mysqlWhere += " AND (o.created_at >= SUBDATE(NOW(), INTERVAL 7 DAY))";
        } else if (dateFilter === "month") {
          mysqlWhere += " AND (YEAR(o.created_at) = YEAR(CURDATE()) AND MONTH(o.created_at) = MONTH(CURDATE()))";
        }

        mysqlParams.push(limit);

        const [orders]: any = await pool.query(
          `SELECT 
            o.id,
            o.order_number as orderNumber,
            o.customer_name as customerName,
            o.customer_email as customerEmail,
            o.customer_phone as customerPhone,
            o.street_address as streetAddress,
            o.city,
            o.pincode,
            DATE_FORMAT(o.delivery_date, '%Y-%m-%d') as deliveryDate,
            o.delivery_time_slot as deliveryTimeSlot,
            o.has_eggless_items as hasEgglessItems,
            o.subtotal,
            o.tax_amount as taxAmount,
            o.delivery_fee as deliveryFee,
            o.total_amount as totalAmount,
            o.status,
            o.delivery_otp as deliveryOtp,
            o.delivery_otp_verified as deliveryOtpVerified,
            o.delivery_partner_name as deliveryPartnerName,
            o.delivery_partner_phone as deliveryPartnerPhone,
            o.delivery_notes as specialInstructions,
            o.delivery_notes as deliveryNotes,
            o.cancellation_reason as cancellationReason,
            o.cancelled_at as cancelledAt,
            o.delivered_at as deliveredAt,
            o.assigned_at as assignedAt,
            o.created_at as createdAt,
            p.payment_status as paymentStatus,
            p.payment_method as paymentMethod,
            p.razorpay_payment_id as razorpayPaymentId
          FROM lollipop_db.orders o
          LEFT JOIN lollipop_db.payments p ON p.order_id = o.id
          WHERE ${mysqlWhere}
          ORDER BY o.created_at DESC
          LIMIT ?`,
          mysqlParams
        );

        const orderIds = orders.map((o: any) => o.id);
        const itemsByOrderId: Record<number, any[]> = {};
        if (orderIds.length > 0) {
          const [items]: any = await pool.query(
            `SELECT id, order_id, product_code as productCode, product_name as productName,
                    variant_name as variantName, is_eggless as isEggless, quantity, unit_price as unitPrice, line_total as lineTotal,
                    cake_message as cakeMessage, offer
             FROM lollipop_db.order_items WHERE order_id IN (?)`,
            [orderIds]
          );
          for (const item of items) {
            if (!itemsByOrderId[item.order_id]) itemsByOrderId[item.order_id] = [];
            itemsByOrderId[item.order_id].push({
              id: item.id.toString(),
              productCode: item.productCode,
              productName: item.productName,
              variantName: item.variantName,
              isEggless: Boolean(item.isEggless),
              quantity: Number(item.quantity),
              unitPrice: Number(item.unitPrice),
              lineTotal: Number(item.lineTotal),
              cakeMessage: item.cakeMessage || null,
              offer: item.offer || null,
            });
          }
        }

        const formatted = orders.map((o: any) => ({
          id: o.id.toString(),
          orderNumber: o.orderNumber,
          customerName: o.customerName,
          customerEmail: o.customerEmail,
          customerPhone: o.customerPhone,
          streetAddress: o.streetAddress,
          city: o.city,
          pincode: o.pincode,
          deliveryDate: o.deliveryDate || "",
          deliveryTimeSlot: o.deliveryTimeSlot,
          hasEgglessItems: Boolean(o.hasEgglessItems),
          subtotal: Number(o.subtotal),
          taxAmount: Number(o.taxAmount),
          deliveryFee: Number(o.deliveryFee),
          totalAmount: Number(o.totalAmount),
          status: o.status,
          deliveryOtp: o.deliveryOtp || null,
          deliveryOtpVerified: Boolean(o.deliveryOtpVerified),
          deliveryPartnerName: o.deliveryPartnerName || null,
          deliveryPartnerPhone: o.deliveryPartnerPhone || null,
          cancellationReason: o.cancellationReason || null,
          cancelledAt: o.cancelledAt ? new Date(o.cancelledAt).toISOString() : null,
          deliveredAt: o.deliveredAt ? new Date(o.deliveredAt).toISOString() : null,
          assignedAt: o.assignedAt ? new Date(o.assignedAt).toISOString() : null,
          createdAt: new Date(o.createdAt).toISOString(),
          specialInstructions: o.specialInstructions || o.deliveryNotes || null,
          deliveryNotes: o.deliveryNotes || o.specialInstructions || null,
          cakeMessage: (itemsByOrderId[o.id] ? itemsByOrderId[o.id].find((i: any) => i.cakeMessage)?.cakeMessage : null) || null,
          paymentStatus: o.paymentStatus || "PENDING",
          paymentMethod: o.paymentMethod || "COD",
          razorpayPaymentId: o.razorpayPaymentId || null,
          items: itemsByOrderId[o.id] || [],
        }));

        const revenueOrders = formatted.filter(
          (o: any) => o.status !== "CANCELLED" && (o.status === "DELIVERED" || o.paymentStatus === "PAID")
        );
        const totalRevenue = revenueOrders.reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0);
        const pendingCodOrders = formatted.filter(
          (o: any) => o.status !== "CANCELLED" && o.status !== "DELIVERED" && o.paymentStatus !== "PAID"
        );
        const pendingCodAmount = pendingCodOrders.reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0);

        return NextResponse.json({
          success: true,
          count: formatted.length,
          filter: dateFilter,
          search: searchParam,
          orders: formatted,
          stats: {
            totalRevenue,
            totalCount: formatted.length,
            paidOrders: revenueOrders.length,
            avgOrderValue: revenueOrders.length > 0 ? totalRevenue / revenueOrders.length : 0,
            pendingCodCount: pendingCodOrders.length,
            pendingCodAmount,
          },
        });
      }
    } catch (mysqlErr: any) {
      console.warn("⚠️ [Admin Orders] MySQL fetch failed, switching to Prisma fallback:", mysqlErr?.message || mysqlErr);
    }

    // 3. Fallback to Prisma
    const prismaWhere: any = {};
    if (hasSearch) {
      prismaWhere.OR = [
        { orderNumber: { contains: searchParam, mode: "insensitive" } },
        { customerName: { contains: searchParam, mode: "insensitive" } },
        { customerPhone: { contains: searchParam, mode: "insensitive" } },
        { customerEmail: { contains: searchParam, mode: "insensitive" } },
      ];
    }
    if (dateFilter === "today") {
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      prismaWhere.createdAt = { gte: startOfToday };
    } else if (dateFilter === "yesterday") {
      const startOfYesterday = new Date();
      startOfYesterday.setDate(startOfYesterday.getDate() - 1);
      startOfYesterday.setHours(0, 0, 0, 0);
      const endOfYesterday = new Date(startOfYesterday);
      endOfYesterday.setHours(23, 59, 59, 999);
      prismaWhere.createdAt = { gte: startOfYesterday, lte: endOfYesterday };
    } else if (dateFilter === "7days") {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      prismaWhere.createdAt = { gte: sevenDaysAgo };
    } else if (dateFilter === "month") {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      prismaWhere.createdAt = { gte: startOfMonth };
    }

    const orders = await prisma.order.findMany({
      where: Object.keys(prismaWhere).length > 0 ? prismaWhere : undefined,
      include: {
        items: true,
        payment: true,
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    const formattedPrisma = orders.map((o) => ({
      id: o.id.toString(),
      orderNumber: o.orderNumber,
      customerName: o.customerName,
      customerEmail: o.customerEmail,
      customerPhone: o.customerPhone,
      streetAddress: o.streetAddress,
      city: o.city,
      pincode: o.pincode,
      deliveryDate: o.deliveryDate.toISOString().split("T")[0],
      deliveryTimeSlot: o.deliveryTimeSlot,
      hasEgglessItems: o.hasEgglessItems,
      subtotal: Number(o.subtotal),
      taxAmount: Number(o.taxAmount),
      deliveryFee: Number(o.deliveryFee),
      totalAmount: Number(o.totalAmount),
      status: o.status,
      deliveryOtp: o.deliveryOtp || null,
      deliveryOtpVerified: o.deliveryOtpVerified,
      deliveryPartnerName: o.deliveryPartnerName || null,
      deliveryPartnerPhone: o.deliveryPartnerPhone || null,
      cancellationReason: o.cancellationReason || null,
      cancelledAt: o.cancelledAt ? o.cancelledAt.toISOString() : null,
      deliveredAt: o.deliveredAt ? o.deliveredAt.toISOString() : null,
      assignedAt: o.assignedAt ? o.assignedAt.toISOString() : null,
      createdAt: o.createdAt.toISOString(),
      specialInstructions: o.deliveryNotes || null,
      deliveryNotes: o.deliveryNotes || null,
      cakeMessage: (o.items && o.items.find((i) => i.cakeMessage)?.cakeMessage) || null,
      paymentStatus: o.payment ? o.payment.paymentStatus : "PENDING",
      paymentMethod: o.payment ? o.payment.paymentMethod : "RAZORPAY",
      razorpayPaymentId: o.payment ? o.payment.razorpayPaymentId : null,
      items: o.items.map((i) => ({
        id: i.id.toString(),
        productCode: i.productCode,
        productName: i.productName,
        variantName: i.variantName,
        isEggless: i.isEggless,
        quantity: i.quantity,
        unitPrice: Number(i.unitPrice),
        lineTotal: Number(i.lineTotal),
        cakeMessage: i.cakeMessage || null,
        offer: (i as any).offer || null,
      })),
    }));

    const revenueOrders = formattedPrisma.filter(
      (o: any) => o.status !== "CANCELLED" && (o.status === "DELIVERED" || o.paymentStatus === "PAID")
    );
    const totalRevenue = revenueOrders.reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0);
    const pendingCodOrders = formattedPrisma.filter(
      (o: any) => o.status !== "CANCELLED" && o.status !== "DELIVERED" && o.paymentStatus !== "PAID"
    );
    const pendingCodAmount = pendingCodOrders.reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0);

    return NextResponse.json({
      success: true,
      count: formattedPrisma.length,
      filter: dateFilter,
      search: searchParam,
      orders: formattedPrisma,
      stats: {
        totalRevenue,
        totalCount: formattedPrisma.length,
        paidOrders: revenueOrders.length,
        avgOrderValue: revenueOrders.length > 0 ? totalRevenue / revenueOrders.length : 0,
        pendingCodCount: pendingCodOrders.length,
        pendingCodAmount,
      },
    });
  } catch (error: any) {
    console.error("[GET /api/admin/orders] Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT /api/admin/orders — Update status of an order (SUPERADMIN only)
export async function PUT(req: NextRequest) {
  try {
    const admin = await getAuthenticatedAdmin(req);
    if (!admin || admin.role !== "SUPERADMIN") {
      return NextResponse.json(
        { success: false, error: "Access denied. Only Super Admins can update order status." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { orderId, status, paymentStatus, deliveryPartnerName, deliveryPartnerPhone } = body;

    if (!orderId) {
      return NextResponse.json({ success: false, error: "orderId is required" }, { status: 400 });
    }

    let updatedAny = false;
    const strOrderId = String(orderId);
    const isDelivered = status === "DELIVERED";

    // 1. Update Neon PostgreSQL
    try {
      const sql = getNeonSql();
      if (sql) {
        if (status) {
          if (isDelivered) {
            await sql`
              UPDATE orders 
              SET status = 'DELIVERED',
                  delivered_at = NOW(),
                  delivery_otp_verified = true,
                  delivery_partner_name = COALESCE(${deliveryPartnerName || null}, delivery_partner_name),
                  delivery_partner_phone = COALESCE(${deliveryPartnerPhone || null}, delivery_partner_phone),
                  updated_at = NOW() 
              WHERE id::text = ${strOrderId} OR order_number = ${strOrderId}
            `;
            await sql`
              UPDATE payments 
              SET payment_status = 'PAID', updated_at = NOW()
              WHERE order_id = (SELECT id FROM orders WHERE id::text = ${strOrderId} OR order_number = ${strOrderId} LIMIT 1)
            `;
          } else {
            await sql`
              UPDATE orders 
              SET status = ${status},
                  delivery_partner_name = COALESCE(${deliveryPartnerName || null}, delivery_partner_name),
                  delivery_partner_phone = COALESCE(${deliveryPartnerPhone || null}, delivery_partner_phone),
                  assigned_at = CASE WHEN ${deliveryPartnerName || null} IS NOT NULL THEN NOW() ELSE assigned_at END,
                  updated_at = NOW() 
              WHERE id::text = ${strOrderId} OR order_number = ${strOrderId}
            `;
          }
        } else if (deliveryPartnerName) {
          await sql`
            UPDATE orders 
            SET delivery_partner_name = ${deliveryPartnerName},
                delivery_partner_phone = ${deliveryPartnerPhone || null},
                assigned_at = NOW(),
                updated_at = NOW() 
            WHERE id::text = ${strOrderId} OR order_number = ${strOrderId}
          `;
        }

        if (paymentStatus) {
          await sql`
            UPDATE payments 
            SET payment_status = ${paymentStatus}, updated_at = NOW()
            WHERE order_id = (SELECT id FROM orders WHERE id::text = ${strOrderId} OR order_number = ${strOrderId} LIMIT 1)
          `;
        }
        updatedAny = true;
      }
    } catch (neonErr: any) {
      console.warn("⚠️ [Admin PUT /orders] Neon update error:", neonErr?.message || neonErr);
    }

    // 2. Update MySQL
    try {
      const pool = getMySqlPool();
      if (pool) {
        if (status) {
          if (isDelivered) {
            await pool.query(
              "UPDATE lollipop_db.orders SET status = 'DELIVERED', delivered_at = NOW(), delivery_otp_verified = 1, updated_at = NOW() WHERE id = ? OR order_number = ?",
              [strOrderId, strOrderId]
            );
            await pool.query(
              `UPDATE lollipop_db.payments 
               SET payment_status = 'PAID', updated_at = NOW() 
               WHERE order_id = (SELECT id FROM lollipop_db.orders WHERE id = ? OR order_number = ? LIMIT 1)`,
              [strOrderId, strOrderId]
            );
          } else {
            await pool.query(
              "UPDATE lollipop_db.orders SET status = ?, updated_at = NOW() WHERE id = ? OR order_number = ?",
              [status, strOrderId, strOrderId]
            );
          }
        }
        if (deliveryPartnerName) {
          await pool.query(
            "UPDATE lollipop_db.orders SET delivery_partner_name = ?, delivery_partner_phone = ?, assigned_at = NOW(), updated_at = NOW() WHERE id = ? OR order_number = ?",
            [deliveryPartnerName, deliveryPartnerPhone || null, strOrderId, strOrderId]
          );
        }
        if (paymentStatus) {
          await pool.query(
            `UPDATE lollipop_db.payments 
             SET payment_status = ?, updated_at = NOW() 
             WHERE order_id = (SELECT id FROM lollipop_db.orders WHERE id = ? OR order_number = ? LIMIT 1)`,
            [paymentStatus, strOrderId, strOrderId]
          );
        }
        updatedAny = true;
      }
    } catch (mysqlErr: any) {
      console.warn("⚠️ [Admin PUT /orders] MySQL update error:", mysqlErr?.message || mysqlErr);
    }

    // 3. Update memory store
    const patch: any = {};
    if (status) patch.orderStatus = status;
    if (paymentStatus) patch.paymentStatus = paymentStatus;
    if (deliveryPartnerName) patch.deliveryPartnerName = deliveryPartnerName;
    if (deliveryPartnerPhone) patch.deliveryPartnerPhone = deliveryPartnerPhone;
    if (isDelivered) {
      patch.deliveredAt = new Date().toISOString();
      patch.deliveryOtpVerified = true;
      patch.paymentStatus = "PAID";
    }
    const updatedOrder = await orderStore.update(strOrderId, patch);

    // If order was marked as DELIVERED, trigger real-time delivery confirmation email!
    if (isDelivered) {
      try {
        const fullOrder = updatedOrder || (await orderStore.get(strOrderId));
        if (fullOrder) {
          console.log(`📧 [Admin Order Update] Triggering delivery success email for Order ${strOrderId}...`);
          await Promise.race([
            sendOrderDeliveredEmail(fullOrder),
            new Promise((resolve) => setTimeout(resolve, 5000)),
          ]);
        }
      } catch (emailErr) {
        console.error("❌ Failed to send order delivered email from admin:", emailErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Order status updated successfully across databases!",
      order: updatedOrder,
    });
  } catch (error: any) {
    console.error("[PUT /api/admin/orders] Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
