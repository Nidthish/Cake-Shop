import { NextRequest, NextResponse } from "next/server";
import { orderStore } from "@/lib/orders";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function sanitizeOrder(order: any) {
  const { deliveryOtp, customer, address, ...rest } = order;
  return {
    ...rest,
    customer: {
      fullName: customer?.fullName || "Customer",
      phone: customer?.phone ? `${customer.phone.slice(0, 2)}******${customer.phone.slice(-2)}` : "",
    },
    address: {
      street: address?.street || "",
      city: address?.city || "Trichy",
      pincode: address?.pincode || "",
    },
  };
}

export async function GET(req: NextRequest) {
  const limiter = rateLimit(req, { limit: 30, windowMs: 60000, endpointKey: "orders-search" });
  if (!limiter.allowed && limiter.response) {
    return limiter.response;
  }

  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim() || "";

    if (!query) {
      return NextResponse.json(
        { success: false, error: "Please enter an order number or mobile phone number." },
        { status: 400 }
      );
    }

    // First check exact order ID lookup
    const directOrder = await orderStore.get(query);
    if (directOrder) {
      return NextResponse.json({
        success: true,
        count: 1,
        orders: [sanitizeOrder(directOrder)],
      });
    }

    // Otherwise perform fuzzy multi-field search
    const rawOrders = await orderStore.search(query);
    const sanitizedOrders = rawOrders.map(sanitizeOrder);

    return NextResponse.json({
      success: true,
      count: sanitizedOrders.length,
      orders: sanitizedOrders,
    });
  } catch (error: any) {
    console.error("[GET /api/orders/search] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to search orders. Please try again." },
      { status: 500 }
    );
  }
}
