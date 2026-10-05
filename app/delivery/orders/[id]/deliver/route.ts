import { NextRequest, NextResponse } from "next/server";
import { verifyAndDeliverOrder } from "@/lib/orders";

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
 * POST /delivery/orders/[id]/deliver
 * Confirm order delivery with OTP verification and update payment for COD
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const orderId = decodeURIComponent(id);

    let body: any = {};
    try {
      body = await req.json();
    } catch {
      // Empty body
    }

    const { otp, partnerName, partnerPhone, bypassOtp } = body;

    const result = await verifyAndDeliverOrder(orderId, {
      otp: otp ? String(otp).trim() : undefined,
      partnerName,
      partnerPhone,
      bypassOtp: Boolean(bypassOtp),
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || "Failed to confirm delivery",
        },
        { status: 400, headers: corsHeaders }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Order successfully confirmed as DELIVERED!",
      order: result.order,
      deliveredAt: result.order?.deliveredAt || new Date().toISOString(),
      paymentStatus: result.order?.paymentStatus,
    }, { headers: corsHeaders });
  } catch (error: any) {
    console.error("[POST /delivery/orders/[id]/deliver] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500, headers: corsHeaders }
    );
  }
}
