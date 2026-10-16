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
    const rawQuery = searchParams.get("q") || searchParams.get("orderId") || "";
    const query = rawQuery.trim();

    if (!query) {
      return NextResponse.json(
        { success: false, error: "Please enter your Order ID." },
        { status: 400 }
      );
    }

    // Explicitly reject mobile phone number queries
    const digitsOnly = query.replace(/[\s\-\(\)\+]/g, "");
    const isMobileNumber =
      /^(?:\+?91)?[6-9]\d{9}$/.test(digitsOnly) ||
      (/^\d{10,13}$/.test(digitsOnly) && !query.toUpperCase().startsWith("LLP-"));

    if (isMobileNumber) {
      return NextResponse.json(
        {
          success: false,
          error: "Tracking by mobile phone number is disabled. Please track your order using your Order ID (e.g. LLP-2026...).",
        },
        { status: 400 }
      );
    }

    // Lookup strictly by Order ID (remove any '#' prefix that users may copy)
    const cleanId = query.replace(/^#/, "").trim();
    let directOrder = await orderStore.get(cleanId);
    if (!directOrder && cleanId !== cleanId.toUpperCase()) {
      directOrder = await orderStore.get(cleanId.toUpperCase());
    }

    if (directOrder) {
      return NextResponse.json({
        success: true,
        count: 1,
        orders: [sanitizeOrder(directOrder)],
      });
    }

    return NextResponse.json({
      success: true,
      count: 0,
      orders: [],
      message: `No order found with Order ID "${query}". Please verify your Order ID.`,
    });
  } catch (error: any) {
    console.error("[GET /api/orders/search] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to search orders. Please try again." },
      { status: 500 }
    );
  }
}
