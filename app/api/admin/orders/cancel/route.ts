import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getNeonSql } from "@/lib/neon";
import { orderStore } from "@/lib/orders";
import { isRazorpayConfigured, createRazorpayRefund } from "@/lib/razorpay";
import { sendOrderCancelledEmail } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST /api/admin/orders/cancel — Cancel order (COD: direct cancel, GPAY/Razorpay: cancel + refund)
export async function POST(req: NextRequest) {
  try {
    const admin = await getAuthenticatedAdmin(req);
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized access." }, { status: 401 });
    }

    const body = await req.json();
    const { orderId, reason } = body;

    if (!orderId) {
      return NextResponse.json({ success: false, error: "orderId is required." }, { status: 400 });
    }

    const strOrderId = String(orderId).trim();

    // 1. Fetch Order with Payment & Items details from Prisma (with fallback to orderStore)
    let order: any = null;
    try {
      const isNumeric = /^\d+$/.test(strOrderId);
      order = await prisma.order.findFirst({
        where: {
          OR: [
            ...(isNumeric ? [{ id: BigInt(strOrderId) }] : []),
            { orderNumber: strOrderId },
          ],
        },
        include: { payment: true, items: true },
      });
    } catch (err: any) {
      console.warn("[Cancel Order] Prisma findFirst fallback:", err?.message);
    }

    if (!order) {
      const memoryOrder = await orderStore.get(strOrderId);
      if (memoryOrder) {
        order = {
          id: BigInt(1),
          orderNumber: memoryOrder.id,
          customerName: memoryOrder.customer.fullName,
          customerEmail: memoryOrder.customer.email,
          customerPhone: memoryOrder.customer.phone,
          streetAddress: memoryOrder.address?.street || "",
          city: memoryOrder.address?.city || "",
          pincode: memoryOrder.address?.pincode || "",
          totalAmount: memoryOrder.total,
          status: memoryOrder.orderStatus,
          payment: {
            paymentMethod: memoryOrder.paymentMethod,
            razorpayPaymentId: (memoryOrder as any).razorpayPaymentId || null,
          },
          items: (memoryOrder.items || []).map((it) => ({
            productTitle: it.name,
            cakeVariant: it.weight,
            quantity: it.quantity,
            unitPrice: it.unitPrice,
            totalPrice: it.lineTotal,
            cakeMessage: it.cakeMessage,
          })),
        };
      }
    }

    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found." }, { status: 404 });
    }

    if (order.status === "CANCELLED") {
      return NextResponse.json(
        { success: false, error: `Order #${order.orderNumber} is already cancelled.` },
        { status: 400 }
      );
    }

    const paymentMethod = (order.payment?.paymentMethod || "COD").toUpperCase();
    const isCod = paymentMethod === "COD" || paymentMethod.includes("CASH");
    const totalAmount = Number(order.totalAmount);
    const cancelReason = reason ? reason.trim() : "Cancelled by admin";
    const paymentId = order.payment?.razorpayPaymentId || null;

    let refundDetails: any = null;
    let paymentStatusToSet = "CANCELLED";
    let successMessage = "";

    // 2. Handle GPAY / Online Payment Refund
    if (!isCod) {
      if (isRazorpayConfigured()) {
        if (!paymentId) {
          return NextResponse.json(
            {
              success: false,
              error: `Cannot issue Razorpay refund: Order #${order.orderNumber} does not have a linked Razorpay Payment ID.`,
            },
            { status: 400 }
          );
        }

        try {
          console.log(`[Cancel & Refund] Initiating live Razorpay refund for Order #${order.orderNumber}, Payment ${paymentId}, Amount ₹${totalAmount}...`);
          const refund = await createRazorpayRefund(paymentId, {
            amountInRupees: totalAmount,
            notes: {
              orderNumber: order.orderNumber,
              reason: cancelReason,
            },
          });
          refundDetails = refund;
          paymentStatusToSet = "REFUNDED";
          successMessage = `Order #${order.orderNumber} cancelled and ₹${totalAmount} successfully refunded via Razorpay (Refund ID: ${refund.id || "OK"})!`;
        } catch (rfErr: any) {
          console.error("❌ [Cancel & Refund] Razorpay refund error:", rfErr);
          return NextResponse.json(
            {
              success: false,
              error: `Razorpay Refund Failed: ${rfErr.error?.description || rfErr.message || "Gateway rejection"}`,
            },
            { status: 502 }
          );
        }
      } else {
        // Razorpay keys not yet configured in .env
        paymentStatusToSet = "REFUND_PENDING";
        successMessage = `Order #${order.orderNumber} cancelled. Refund marked as REFUND_PENDING. (Add your RAZORPAY_KEY_ID & RAZORPAY_KEY_SECRET to .env for live automated gateway refunds.)`;
      }
    } else {
      // COD Order — Direct cancellation
      paymentStatusToSet = "CANCELLED";
      successMessage = `COD Order #${order.orderNumber} cancelled successfully.`;
    }

    // 3. Update Neon Postgres Database
    try {
      const sql = getNeonSql();
      if (sql) {
        await sql`
          UPDATE orders 
          SET status = 'CANCELLED',
              cancellation_reason = ${cancelReason},
              cancelled_at = NOW(),
              updated_at = NOW()
          WHERE id = ${order.id}
        `;
        await sql`
          UPDATE payments 
          SET payment_status = ${paymentStatusToSet},
              updated_at = NOW()
          WHERE order_id = ${order.id}
        `;
      }
    } catch (neonErr: any) {
      console.warn("⚠️ [Cancel Order] Neon SQL update warning:", neonErr?.message);
    }

    // 4. Update Prisma Database
    try {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: "CANCELLED",
          cancellationReason: cancelReason,
          cancelledAt: new Date(),
        },
      });
      if (order.payment) {
        const prismaPaymentStatus = paymentStatusToSet === "REFUNDED" ? "REFUNDED" : "PAYMENT_FAILED";
        await prisma.payment.update({
          where: { id: order.payment.id },
          data: {
            paymentStatus: prismaPaymentStatus as any,
          },
        });
      }
    } catch (prismaErr: any) {
      console.warn("⚠️ [Cancel Order] Prisma update warning:", prismaErr?.message);
    }

    // 6. Update In-Memory Order Store
    await orderStore.update(order.orderNumber, {
      orderStatus: "CANCELLED",
      paymentStatus: (paymentStatusToSet === "REFUNDED" ? "REFUNDED" : "PAYMENT_FAILED") as any,
      cancellationReason: cancelReason,
      cancelledAt: new Date().toISOString(),
    });

    // 7. Send Proper Customer Cancellation Email with Reason & Refund Timing
    let emailSent = false;
    let emailStatusNote = "";
    try {
      const memoryOrder = await orderStore.get(order.orderNumber);
      const customerEmail = (order.customerEmail || memoryOrder?.customer?.email || "").trim();
      const customerName = order.customerName || memoryOrder?.customer?.fullName || "Valued Customer";
      const customerPhone = order.customerPhone || memoryOrder?.customer?.phone || "";

      const rawItems =
        order.items && order.items.length > 0
          ? order.items
          : memoryOrder?.items || [];

      const formattedItems = rawItems.map((it: any) => ({
        name: it.productTitle || it.name || "Handcrafted Cake",
        weight: it.cakeVariant || it.weight || "",
        quantity: Number(it.quantity) || 1,
        unitPrice: Number(it.unitPrice) || 0,
        lineTotal:
          Number(it.totalPrice || it.lineTotal) ||
          (Number(it.unitPrice) || 0) * (Number(it.quantity) || 1),
        cakeMessage: it.cakeMessage || "",
      }));

      if (customerEmail) {
        console.log(`[Cancel Order] Dispatching cancellation email to ${customerEmail}...`);
        const emailResult = await sendOrderCancelledEmail({
          orderId: String(order.id),
          orderNumber: order.orderNumber,
          customerName,
          customerEmail,
          customerPhone,
          deliveryDate: order.deliveryDate ? new Date(order.deliveryDate).toISOString() : undefined,
          deliveryTimeSlot: order.deliveryTimeSlot || undefined,
          streetAddress: order.streetAddress || undefined,
          city: order.city || undefined,
          pincode: order.pincode || undefined,
          paymentMethod,
          totalAmount,
          cancellationReason: cancelReason,
          refundStatus: paymentStatusToSet,
          refundId: refundDetails?.id || null,
          items: formattedItems,
        });

        emailSent = emailResult.success;
        emailStatusNote = emailResult.success
          ? `Notification email sent to customer (${customerEmail}).`
          : `Note: Email could not be delivered (${emailResult.error}).`;
      } else {
        emailStatusNote = "Note: No customer email associated with this order.";
      }
    } catch (mailErr: any) {
      console.error("⚠️ [Cancel Order Email Error]:", mailErr?.message || mailErr);
      emailStatusNote = `Note: Email notification error: ${mailErr.message}`;
    }

    return NextResponse.json({
      success: true,
      message: `${successMessage} ${emailStatusNote}`.trim(),
      orderNumber: order.orderNumber,
      status: "CANCELLED",
      paymentStatus: paymentStatusToSet,
      refundDetails,
      emailSent,
    });
  } catch (error: any) {
    console.error("[POST /api/admin/orders/cancel] Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
