import { NextRequest, NextResponse } from "next/server";
import { orderStore, getOrGenerateDeliveryOtp } from "@/lib/orders";

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
 * PATCH /delivery/orders/[id]/status
 * Update order delivery status (e.g., OUT_FOR_DELIVERY, PREPARING)
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const orderId = decodeURIComponent(id);

    const body = await req.json();
    const { status, partnerName, partnerPhone } = body;

    if (!status) {
      return NextResponse.json({ success: false, error: "Status is required" }, { status: 400, headers: corsHeaders });
    }

    const validStatuses = [
      "PENDING",
      "CONFIRMED",
      "PREPARING",
      "PROCESSING",
      "OUT_FOR_DELIVERY",
      "DELIVERED",
      "CANCELLED",
    ];

    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid status '${status}'. Must be one of: ${validStatuses.join(", ")}`,
        },
        { status: 400, headers: corsHeaders }
      );
    }

    const patch: any = {
      orderStatus: status,
      ...(partnerName && { deliveryPartnerName: partnerName }),
      ...(partnerPhone && { deliveryPartnerPhone: partnerPhone }),
    };

    if (status === "OUT_FOR_DELIVERY") {
      patch.assignedAt = new Date().toISOString();
      await getOrGenerateDeliveryOtp(orderId);
    } else if (status === "DELIVERED") {
      patch.deliveredAt = new Date().toISOString();
      patch.deliveryOtpVerified = true;
    } else if (status === "CANCELLED") {
      patch.cancelledAt = new Date().toISOString();
    }

    const updated = await orderStore.update(orderId, patch);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Order not found or update failed" }, { status: 404, headers: corsHeaders });
    }

    return NextResponse.json({
      success: true,
      message: `Order status successfully updated to ${status}`,
      order: updated,
    }, { headers: corsHeaders });
  } catch (error: any) {
    console.error("[PATCH /delivery/orders/[id]/status] Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders });
  }
}
