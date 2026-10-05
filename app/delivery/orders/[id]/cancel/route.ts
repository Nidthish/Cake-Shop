import { NextRequest, NextResponse } from "next/server";
import { cancelDeliveryOrder } from "@/lib/orders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept, X-Requested-With",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

/**
 * POST /delivery/orders/[id]/cancel
 * Cancel order from delivery agent side with structured reason
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

    const { reason, partnerName } = body;

    if (!reason || !String(reason).trim()) {
      return NextResponse.json(
        { success: false, error: "A valid cancellation reason is required" },
        { status: 400, headers: corsHeaders }
      );
    }

    const result = await cancelDeliveryOrder(orderId, String(reason).trim(), partnerName);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to cancel order" },
        { status: 400, headers: corsHeaders }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Order successfully marked as CANCELLED",
      order: result.order,
      cancelledAt: result.order?.cancelledAt || new Date().toISOString(),
      reason: result.order?.cancellationReason,
    }, { headers: corsHeaders });
  } catch (error: any) {
    console.error("[POST /delivery/orders/[id]/cancel] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500, headers: corsHeaders }
    );
  }
}
