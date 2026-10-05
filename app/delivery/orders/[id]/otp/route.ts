import { NextRequest, NextResponse } from "next/server";
import { getOrGenerateDeliveryOtp, orderStore } from "@/lib/orders";

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
 * GET /delivery/orders/[id]/otp
 * Retrieve or view current delivery confirmation OTP
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const orderId = decodeURIComponent(id);

    const order = await orderStore.get(orderId);
    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404, headers: corsHeaders });
    }

    // If OTP doesn't exist yet, generate one
    let otp: string | undefined = order.deliveryOtp;
    if (!otp) {
      const generated = await getOrGenerateDeliveryOtp(orderId);
      otp = generated?.otp || undefined;
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      customerName: order.customer.fullName,
      customerPhone: order.customer.phone,
      otp: otp,
      otpVerified: Boolean(order.deliveryOtpVerified),
      status: order.orderStatus,
    }, { headers: corsHeaders });
  } catch (error: any) {
    console.error("[GET /delivery/orders/[id]/otp] Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders });
  }
}

/**
 * POST /delivery/orders/[id]/otp
 * Generate or re-generate delivery confirmation OTP
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const orderId = decodeURIComponent(id);

    const result = await getOrGenerateDeliveryOtp(orderId);
    if (!result) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404, headers: corsHeaders });
    }

    return NextResponse.json({
      success: true,
      message: "Delivery OTP generated successfully",
      orderId: result.order.id,
      customerName: result.order.customer.fullName,
      customerPhone: result.order.customer.phone,
      otp: result.otp,
      otpVerified: false,
    }, { headers: corsHeaders });
  } catch (error: any) {
    console.error("[POST /delivery/orders/[id]/otp] Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders });
  }
}
