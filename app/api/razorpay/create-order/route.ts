import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { priceOrder, PricingError } from "@/lib/pricing";
import { getRazorpayClient, getRazorpayPublicKeyId } from "@/lib/razorpay";
import { orderStore, generateOrderId } from "@/lib/orders";
import type { CreateOrderResponse, ApiError, Order } from "@/types";

export const runtime = "nodejs";

const requestSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        weight: z.string().min(1),
        quantity: z.number().int().min(1).max(50),
      })
    )
    .min(1, "Cart cannot be empty."),
  customer: z.object({
    fullName: z.string().trim().min(2, "Full name is required."),
    phone: z
      .string()
      .trim()
      .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number."),
    email: z.string().trim().email("Enter a valid email address."),
  }),
  address: z.object({
    street: z.string().trim().min(5, "Enter your full delivery address."),
    city: z.string().trim().min(2, "City is required."),
    pincode: z.string().trim().regex(/^\d{6}$/, "Enter a valid 6-digit pincode."),
  }),
  schedule: z.object({
    date: z.string().trim().min(1, "Delivery date is required."),
    timeSlot: z.string().trim().min(1, "Delivery time slot is required."),
  }),
  idempotencyKey: z.string().trim().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = requestSchema.safeParse(json);

    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: firstIssue?.message ?? "Invalid request.",
          code: "VALIDATION_ERROR",
        },
        { status: 400 }
      );
    }

    const { items, customer, address, schedule, idempotencyKey } = parsed.data;

    // Idempotency: if this exact checkout attempt already created an order,
    // return the existing order instead of creating a duplicate.
    if (idempotencyKey) {
      const existing = await orderStore.getByIdempotencyKey(idempotencyKey);
      if (existing && existing.razorpayOrderId) {
        return NextResponse.json<CreateOrderResponse>({
          success: true,
          orderId: existing.id,
          razorpayOrderId: existing.razorpayOrderId,
          amount: Math.round(existing.total * 100),
          currency: "INR",
          keyId: getRazorpayPublicKeyId(),
        });
      }
    }

    // ── Server-side price computation — the browser's numbers are ignored ──
    let priced;
    try {
      priced = priceOrder(items);
    } catch (err) {
      if (err instanceof PricingError) {
        return NextResponse.json<ApiError>(
          { success: false, error: err.message, code: err.code },
          { status: 422 }
        );
      }
      throw err;
    }

    const orderId = generateOrderId();
    const amountInPaise = Math.round(priced.total * 100);

    const razorpay = getRazorpayClient();
    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: orderId,
      notes: {
        orderId,
        customerName: customer.fullName,
        customerPhone: customer.phone,
      },
    });

    const now = new Date().toISOString();
    const order: Order = {
      id: orderId,
      items: priced.lineItems,
      customer,
      address,
      schedule,
      subtotal: priced.subtotal,
      sgst: priced.sgst,
      cgst: priced.cgst,
      tax: priced.tax,
      deliveryFee: priced.deliveryFee,
      total: priced.total,
      orderStatus: "PENDING",
      paymentStatus: "PAYMENT_INITIATED",
      razorpayOrderId: razorpayOrder.id,
      createdAt: now,
      updatedAt: now,
    };

    await orderStore.create(order);
    if (idempotencyKey) {
      await orderStore.registerIdempotencyKey(idempotencyKey, orderId);
    }

    return NextResponse.json<CreateOrderResponse>({
      success: true,
      orderId,
      razorpayOrderId: razorpayOrder.id,
      amount: amountInPaise,
      currency: "INR",
      keyId: getRazorpayPublicKeyId(),
    });
  } catch (err) {
    console.error("[create-order] error:", err);
    const message =
      err instanceof Error && err.message.includes("environment variable")
        ? err.message
        : "Could not create order. Please try again.";
    return NextResponse.json<ApiError>(
      { success: false, error: message, code: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}
