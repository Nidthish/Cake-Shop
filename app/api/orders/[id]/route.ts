import { NextRequest, NextResponse } from "next/server";
import { orderStore } from "@/lib/orders";
import type { ApiError } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const order = await orderStore.get(id);

  if (!order) {
    return NextResponse.json<ApiError>(
      { success: false, error: "Order not found.", code: "ORDER_NOT_FOUND" },
      { status: 404 }
    );
  }

  // Never leak sensitive payment identifiers beyond what's needed to
  // display an order confirmation.
  return NextResponse.json({
    success: true,
    order: {
      id: order.id,
      items: order.items,
      customer: order.customer,
      address: order.address,
      schedule: order.schedule,
      subtotal: order.subtotal,
      sgst: order.sgst,
      cgst: order.cgst,
      tax: order.tax,
      deliveryFee: order.deliveryFee,
      total: order.total,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      razorpayOrderId: order.razorpayOrderId,
      razorpayPaymentId: order.razorpayPaymentId,
      deliveryOtp: order.deliveryOtp,
      deliveryOtpVerified: order.deliveryOtpVerified,
      deliveryPartnerName: order.deliveryPartnerName,
      deliveredAt: order.deliveredAt,
      cakeMessage: order.cakeMessage,
      specialInstructions: order.specialInstructions,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    },
  });
}
