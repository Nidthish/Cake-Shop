import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedAdmin } from "@/lib/auth";

export const runtime = "nodejs";

// GET /api/admin/orders — Fetch all orders with items & payment details from MySQL
export async function GET(req: NextRequest) {
  try {
    const admin = await getAuthenticatedAdmin(req);
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized access." }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      include: {
        items: true,
        payment: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      count: orders.length,
      orders: orders.map((o) => ({
        id: o.id.toString(),
        orderNumber: o.orderNumber,
        customerName: o.customerName,
        customerEmail: o.customerEmail,
        customerPhone: o.customerPhone,
        streetAddress: o.streetAddress,
        city: o.city,
        pincode: o.pincode,
        deliveryDate: o.deliveryDate.toISOString().split("T")[0],
        deliveryTimeSlot: o.deliveryTimeSlot,
        hasEgglessItems: o.hasEgglessItems,
        subtotal: Number(o.subtotal),
        taxAmount: Number(o.taxAmount),
        deliveryFee: Number(o.deliveryFee),
        totalAmount: Number(o.totalAmount),
        status: o.status,
        createdAt: o.createdAt.toISOString(),
        paymentStatus: o.payment ? o.payment.paymentStatus : "PENDING",
        paymentMethod: o.payment ? o.payment.paymentMethod : "RAZORPAY",
        razorpayPaymentId: o.payment ? o.payment.razorpayPaymentId : null,
        items: o.items.map((i) => ({
          id: i.id.toString(),
          productCode: i.productCode,
          productName: i.productName,
          variantName: i.variantName,
          isEggless: i.isEggless,
          quantity: i.quantity,
          unitPrice: Number(i.unitPrice),
          lineTotal: Number(i.lineTotal),
        })),
      })),
    });
  } catch (error: any) {
    console.error("[GET /api/admin/orders] Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT /api/admin/orders — Update status of an order
export async function PUT(req: NextRequest) {
  try {
    const admin = await getAuthenticatedAdmin(req);
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized access." }, { status: 401 });
    }

    const body = await req.json();
    const { orderId, status, paymentStatus } = body;

    if (!orderId) {
      return NextResponse.json({ success: false, error: "orderId is required" }, { status: 400 });
    }

    const orderIdBigInt = BigInt(orderId);

    if (status) {
      await prisma.order.update({
        where: { id: orderIdBigInt },
        data: { status },
      });
    }

    if (paymentStatus) {
      await prisma.payment.updateMany({
        where: { orderId: orderIdBigInt },
        data: { paymentStatus },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Order status updated successfully in MySQL!",
    });
  } catch (error: any) {
    console.error("[PUT /api/admin/orders] Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
