import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyPaymentSignature } from "@/lib/razorpay";
import { orderStore } from "@/lib/orders";
import { sendOrderConfirmationEmail } from "@/lib/email";
import type { ApiError } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const requestSchema = z.object({
  orderId: z.string().min(1),
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = requestSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json<ApiError>(
        { success: false, error: "Malformed payment verification request.", code: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }

    const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      parsed.data;

    const order = await orderStore.get(orderId);
    if (!order) {
      return NextResponse.json<ApiError>(
        { success: false, error: "Order not found.", code: "ORDER_NOT_FOUND" },
        { status: 404 }
      );
    }

    // The Razorpay order id returned by checkout must match the one we
    // created server-side for this order — prevents an attacker from
    // pairing a valid signature for a *different*, cheaper order.
    if (order.razorpayOrderId !== razorpay_order_id) {
      return NextResponse.json<ApiError>(
        { success: false, error: "Order/payment mismatch.", code: "ORDER_MISMATCH" },
        { status: 400 }
      );
    }

    // Idempotency: if this order was already verified & paid (e.g. the
    // browser retried after a network hiccup), don't reprocess — just
    // confirm success again without creating side effects twice.
    if (order.paymentStatus === "PAID") {
      return NextResponse.json({
        success: true,
        orderId: order.id,
        alreadyProcessed: true,
      });
    }

    const isValid = verifyPaymentSignature({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    if (!isValid) {
      await orderStore.update(orderId, {
        paymentStatus: "PAYMENT_FAILED",
      });
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "Payment signature verification failed. This payment could not be confirmed.",
          code: "INVALID_SIGNATURE",
        },
        { status: 400 }
      );
    }

    const updated = await orderStore.update(orderId, {
      paymentStatus: "PAID",
      orderStatus: "PROCESSING",
      razorpayPaymentId: razorpay_payment_id,
    });

    if (updated) {
      // Trigger automatic receipt & invoice email
      sendOrderConfirmationEmail(updated).catch((emailErr) => {
        console.error("⚠️ [Email Trigger Notice] Failed to send order receipt:", emailErr);
      });
    }

    return NextResponse.json({
      success: true,
      orderId: updated!.id,
      alreadyProcessed: false,
    });
  } catch (err) {
    console.error("[verify-payment] error:", err);
    return NextResponse.json<ApiError>(
      { success: false, error: "Could not verify payment. Please contact support.", code: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}
