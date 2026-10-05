import { NextRequest, NextResponse } from "next/server";
import { getNeonSql } from "@/lib/neon";
import { orderStore } from "@/lib/orders";

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

/**
 * GET /delivery/orders/[id]
 * Fetch detailed order information for delivery partner
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const orderId = decodeURIComponent(id);

    if (!orderId) {
      return NextResponse.json({ success: false, error: "Order ID is required" }, { status: 400, headers: corsHeaders });
    }

    // 1. Try Neon PostgreSQL
    try {
      const sql = getNeonSql();
      if (sql) {
        const rows = await sql`
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
                  'productId', i.product_code,
                  'name', i.product_name,
                  'variant', i.variant_name,
                  'isEggless', i.is_eggless,
                  'quantity', i.quantity,
                  'unitPrice', i.unit_price,
                  'lineTotal', i.line_total,
                  'cakeMessage', i.cake_message
                )
              ) FILTER (WHERE i.id IS NOT NULL),
              '[]'
            ) as items
          FROM orders o
          LEFT JOIN payments p ON p.order_id = o.id
          LEFT JOIN order_items i ON i.order_id = o.id
          WHERE o.order_number = ${orderId} OR o.id::text = ${orderId}
          GROUP BY o.id, p.id
          LIMIT 1
        `;

        if (rows.length > 0) {
          const o = rows[0];
          return NextResponse.json({
            success: true,
            order: {
              id: o.order_number,
              dbId: o.id.toString(),
              orderNumber: o.order_number,
              status: o.status,
              customer: {
                fullName: o.customer_name,
                email: o.customer_email,
                phone: o.customer_phone,
              },
              address: {
                street: o.street_address,
                city: o.city,
                pincode: o.pincode,
                state: o.state || "Tamil Nadu",
                landmark: o.landmark || null,
                mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${o.street_address}, ${o.city}, ${o.pincode}`
                )}`,
              },
              schedule: {
                date: o.deliveryDate || (o.delivery_date ? new Date(o.delivery_date).toISOString().split("T")[0] : ""),
                timeSlot: o.delivery_time_slot,
                notes: o.delivery_notes || null,
              },
              pricing: {
                subtotal: Number(o.subtotal),
                sgst: Number(o.sgst),
                cgst: Number(o.cgst),
                taxAmount: Number(o.tax_amount),
                deliveryFee: Number(o.delivery_fee),
                totalAmount: Number(o.total_amount),
              },
              payment: {
                method: o.paymentMethod || "COD",
                status: o.paymentStatus || "PENDING",
                isPrepaid: o.paymentStatus === "PAID",
                amountToCollect: o.paymentStatus === "PAID" ? 0 : Number(o.total_amount),
              },
              delivery: {
                otp: o.delivery_otp || null,
                otpVerified: Boolean(o.delivery_otp_verified),
                partnerName: o.delivery_partner_name || null,
                partnerPhone: o.delivery_partner_phone || null,
                cancellationReason: o.cancellation_reason || null,
                cancelledAt: o.cancelled_at ? new Date(o.cancelled_at).toISOString() : null,
                deliveredAt: o.delivered_at ? new Date(o.delivered_at).toISOString() : null,
                assignedAt: o.assigned_at ? new Date(o.assigned_at).toISOString() : null,
              },
              hasEgglessItems: Boolean(o.has_eggless_items),
              items: Array.isArray(o.items) ? o.items : [],
              createdAt: new Date(o.created_at).toISOString(),
              updatedAt: new Date(o.updated_at).toISOString(),
            },
          }, { headers: corsHeaders });
        }
      }
    } catch (neonErr: any) {
      console.warn("⚠️ [Delivery GET /orders/[id]] Neon query failed:", neonErr?.message || neonErr);
    }

    // 2. Try OrderStore (Hybrid: memory + MySQL + Neon)
    const order = await orderStore.get(orderId);
    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404, headers: corsHeaders });
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.id,
        status: order.orderStatus,
        customer: order.customer,
        address: {
          ...order.address,
          state: "Tamil Nadu",
          mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            `${order.address.street}, ${order.address.city}, ${order.address.pincode}`
          )}`,
        },
        schedule: {
          date: order.schedule.date,
          timeSlot: order.schedule.timeSlot,
          notes: order.specialInstructions || null,
        },
        pricing: {
          subtotal: order.subtotal,
          sgst: order.sgst,
          cgst: order.cgst,
          taxAmount: order.tax,
          deliveryFee: order.deliveryFee,
          totalAmount: order.total,
        },
        payment: {
          method: order.paymentMethod || "COD",
          status: order.paymentStatus,
          isPrepaid: order.paymentStatus === "PAID",
          amountToCollect: order.paymentStatus === "PAID" ? 0 : order.total,
        },
        delivery: {
          otp: order.deliveryOtp || null,
          otpVerified: Boolean(order.deliveryOtpVerified),
          partnerName: order.deliveryPartnerName || null,
          partnerPhone: order.deliveryPartnerPhone || null,
          cancellationReason: order.cancellationReason || null,
          cancelledAt: order.cancelledAt || null,
          deliveredAt: order.deliveredAt || null,
          assignedAt: order.assignedAt || null,
        },
        items: order.items,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      },
    }, { headers: corsHeaders });
  } catch (error: any) {
    console.error("[GET /delivery/orders/[id]] Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders });
  }
}

/**
 * PATCH /delivery/orders/[id]
 * General update of delivery assignment or status
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const orderId = decodeURIComponent(id);
    const body = await req.json();

    const { status, partnerName, partnerPhone, deliveryNotes } = body;

    const patch: any = {};
    if (status) patch.orderStatus = status;
    if (partnerName) patch.deliveryPartnerName = partnerName;
    if (partnerPhone) patch.deliveryPartnerPhone = partnerPhone;
    if (deliveryNotes) patch.specialInstructions = deliveryNotes;

    const updated = await orderStore.update(orderId, patch);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Order not found or update failed" }, { status: 404, headers: corsHeaders });
    }

    return NextResponse.json({
      success: true,
      message: "Order updated successfully",
      order: updated,
    }, { headers: corsHeaders });
  } catch (error: any) {
    console.error("[PATCH /delivery/orders/[id]] Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders });
  }
}
