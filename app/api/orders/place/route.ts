import { NextRequest, NextResponse } from "next/server";
import { priceOrder, PricingError } from "@/lib/pricing";
import { orderStore, generateOrderId, generateDeliveryOtp } from "@/lib/orders";
import { sendOrderConfirmationEmail } from "@/lib/email";
import type { Order, ApiError } from "@/types";

import { rateLimit, sanitizeString } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  // Rate limiting defense: max 10 requests per minute per IP
  const limiter = rateLimit(req, { limit: 10, windowMs: 60000, endpointKey: "orders-place" });
  if (!limiter.allowed && limiter.response) {
    return limiter.response;
  }

  try {
    const body = await req.json();
    const { items, customer, address, schedule, cakeMessage, specialInstructions, paymentMethod } = body;

    // Validate customer details
    if (!customer?.fullName?.trim() || !customer?.phone?.trim() || !customer?.email?.trim()) {
      return NextResponse.json<ApiError>(
        { success: false, error: "Complete customer name, mobile phone, and email are required." },
        { status: 400 }
      );
    }

    // Validate delivery address
    if (!address?.street?.trim() || !address?.city?.trim() || !address?.pincode?.trim()) {
      return NextResponse.json<ApiError>(
        { success: false, error: "Complete street address, city, and pincode are required." },
        { status: 400 }
      );
    }

    // Validate delivery schedule
    if (!schedule?.date || !schedule?.timeSlot) {
      return NextResponse.json<ApiError>(
        { success: false, error: "Delivery date and time slot selection are required." },
        { status: 400 }
      );
    }

    // Calculate authoritative price breakdown on server
    const priced = priceOrder(items);
    const orderId = generateOrderId();
    const deliveryOtp = generateDeliveryOtp();
    const chosenPaymentMethod = paymentMethod === "DIRECT" ? "DIRECT" : "COD";

    const cleanCakeMessage = sanitizeString(cakeMessage);
    const cleanSpecialInstructions = sanitizeString(specialInstructions);

    const order: Order = {
      id: orderId,
      items: priced.lineItems.map((item, idx) => ({
        ...item,
        eggPreference: items[idx]?.eggPreference || "eggless",
        cakeMessage: sanitizeString(items[idx]?.cakeMessage || cleanCakeMessage),
      })),
      customer: {
        fullName: sanitizeString(customer.fullName),
        phone: sanitizeString(customer.phone),
        email: sanitizeString(customer.email),
      },
      address: {
        street: sanitizeString(address.street),
        city: sanitizeString(address.city),
        pincode: sanitizeString(address.pincode),
      },
      schedule: {
        date: sanitizeString(schedule.date),
        timeSlot: sanitizeString(schedule.timeSlot),
      },
      subtotal: priced.subtotal,
      sgst: priced.sgst,
      cgst: priced.cgst,
      tax: priced.tax,
      deliveryFee: priced.deliveryFee,
      total: priced.total,
      orderStatus: "CONFIRMED",
      paymentStatus: chosenPaymentMethod === "DIRECT" ? "PAID" : "PENDING",
      paymentMethod: chosenPaymentMethod,
      deliveryOtp: deliveryOtp,
      deliveryOtpVerified: false,
      cakeMessage: cleanCakeMessage || undefined,
      specialInstructions: cleanSpecialInstructions || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Store in OrderStore (Memory & Neon Database)
    await orderStore.create(order);

    // Trigger real-time customer email confirmation
    sendOrderConfirmationEmail(order).catch((err) => {
      console.error("❌ Failed to send order confirmation email:", err);
    });

    console.log(`✅ [Direct Order API] Order ${order.id} placed successfully for ${customer.email}`);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      order,
    });
  } catch (error: any) {
    if (error instanceof PricingError) {
      return NextResponse.json<ApiError>(
        { success: false, error: error.message, code: error.code },
        { status: 400 }
      );
    }

    console.error("❌ Order placement error:", error);
    return NextResponse.json<ApiError>(
      { success: false, error: "Failed to place order. Please try again." },
      { status: 500 }
    );
  }
}
