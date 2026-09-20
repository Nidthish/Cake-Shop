import { prisma } from "./prisma";
import type { Order, OrderLineItem } from "@/types";

export interface OrderStore {
  create(order: Order): Promise<Order>;
  get(orderId: string): Promise<Order | null>;
  getByRazorpayOrderId(razorpayOrderId: string): Promise<Order | null>;
  getByIdempotencyKey(key: string): Promise<Order | null>;
  registerIdempotencyKey(key: string, orderId: string): Promise<void>;
  update(orderId: string, patch: Partial<Order>): Promise<Order | null>;
}

class HybridOrderStore implements OrderStore {
  private memoryOrders = new Map<string, Order>();
  private idempotencyMap = new Map<string, string>();
  private rzpIndex = new Map<string, string>();

  async create(order: Order): Promise<Order> {
    // 1. Store in memory for instant lookup
    this.memoryOrders.set(order.id, order);
    if (order.razorpayOrderId) {
      this.rzpIndex.set(order.razorpayOrderId, order.id);
    }

    // 2. Persist to MySQL Database asynchronously
    try {
      let userId: bigint | undefined = undefined;
      const user = await prisma.user.findUnique({
        where: { email: order.customer.email },
      });
      if (user) {
        userId = user.id;
      } else {
        const newUser = await prisma.user.create({
          data: {
            email: order.customer.email,
            fullName: order.customer.fullName,
            phone: order.customer.phone,
            role: "CUSTOMER",
          },
        });
        userId = newUser.id;
      }

      const hasEggless = order.items.some(
        (i) => i.weight.toLowerCase().includes("eggless") || i.name.toLowerCase().includes("eggless")
      );

      const dbOrder = await prisma.order.create({
        data: {
          orderNumber: order.id,
          userId,
          customerName: order.customer.fullName,
          customerEmail: order.customer.email,
          customerPhone: order.customer.phone,
          streetAddress: order.address.street,
          city: order.address.city,
          pincode: order.address.pincode,
          deliveryDate: new Date(order.schedule.date),
          deliveryTimeSlot: order.schedule.timeSlot,
          hasEgglessItems: hasEggless,
          subtotal: order.subtotal,
          sgst: order.sgst,
          cgst: order.cgst,
          taxAmount: order.tax,
          deliveryFee: order.deliveryFee,
          totalAmount: order.total,
          status: "PENDING",
        },
      });

      for (const item of order.items) {
        const product = await prisma.product.findFirst({
          where: { slug: item.productId },
        });

        if (product) {
          await prisma.orderItem.create({
            data: {
              orderId: dbOrder.id,
              productId: product.id,
              productCode: product.productCode,
              productName: item.name,
              variantName: item.weight,
              isEggless: item.weight.toLowerCase().includes("eggless"),
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              lineTotal: item.lineTotal,
            },
          });
        }
      }

      if (order.razorpayOrderId) {
        await prisma.payment.create({
          data: {
            orderId: dbOrder.id,
            paymentMethod: "RAZORPAY",
            paymentStatus: "PENDING",
            amount: order.total,
            razorpayOrderId: order.razorpayOrderId,
          },
        });
      }
    } catch (dbErr) {
      console.warn("[OrderStore] Database persistence notice:", (dbErr as any)?.message || dbErr);
    }

    return order;
  }

  async get(orderId: string): Promise<Order | null> {
    const memory = this.memoryOrders.get(orderId);
    if (memory) return memory;

    try {
      const dbOrder = await prisma.order.findUnique({
        where: { orderNumber: orderId },
        include: { items: true, payment: true },
      });
      if (!dbOrder) return null;

      const items: OrderLineItem[] = dbOrder.items.map((i: any) => ({
        productId: i.productCode,
        name: i.productName,
        weight: i.variantName,
        quantity: i.quantity,
        unitPrice: Number(i.unitPrice),
        lineTotal: Number(i.lineTotal),
      }));

      return {
        id: dbOrder.orderNumber,
        items,
        customer: {
          fullName: dbOrder.customerName,
          email: dbOrder.customerEmail,
          phone: dbOrder.customerPhone,
        },
        address: {
          street: dbOrder.streetAddress,
          city: dbOrder.city,
          pincode: dbOrder.pincode,
        },
        schedule: {
          date: dbOrder.deliveryDate.toISOString().split("T")[0],
          timeSlot: dbOrder.deliveryTimeSlot,
        },
        subtotal: Number(dbOrder.subtotal),
        sgst: Number(dbOrder.sgst),
        cgst: Number(dbOrder.cgst),
        tax: Number(dbOrder.taxAmount),
        deliveryFee: Number(dbOrder.deliveryFee),
        total: Number(dbOrder.totalAmount),
        orderStatus: dbOrder.status as any,
        paymentStatus: dbOrder.payment ? (dbOrder.payment.paymentStatus as any) : "PENDING",
        razorpayOrderId: dbOrder.payment?.razorpayOrderId || undefined,
        createdAt: dbOrder.createdAt.toISOString(),
        updatedAt: dbOrder.updatedAt.toISOString(),
      };
    } catch {
      return null;
    }
  }

  async getByRazorpayOrderId(razorpayOrderId: string): Promise<Order | null> {
    const memoryId = this.rzpIndex.get(razorpayOrderId);
    if (memoryId) return this.get(memoryId);

    try {
      const payment = await prisma.payment.findUnique({
        where: { razorpayOrderId },
        include: { order: true },
      });
      if (!payment || !payment.order) return null;
      return this.get(payment.order.orderNumber);
    } catch {
      return null;
    }
  }

  async getByIdempotencyKey(key: string): Promise<Order | null> {
    const orderId = this.idempotencyMap.get(key);
    if (!orderId) return null;
    return this.get(orderId);
  }

  async registerIdempotencyKey(key: string, orderId: string): Promise<void> {
    this.idempotencyMap.set(key, orderId);
  }

  async update(orderId: string, patch: Partial<Order>): Promise<Order | null> {
    const existing = this.memoryOrders.get(orderId);
    if (existing) {
      const updated: Order = {
        ...existing,
        ...patch,
        updatedAt: new Date().toISOString(),
      };
      this.memoryOrders.set(orderId, updated);
      if (updated.razorpayOrderId) {
        this.rzpIndex.set(updated.razorpayOrderId, updated.id);
      }
    }

    try {
      const dbOrder = await prisma.order.findUnique({
        where: { orderNumber: orderId },
      });
      if (dbOrder) {
        if (patch.orderStatus) {
          await prisma.order.update({
            where: { id: dbOrder.id },
            data: { status: patch.orderStatus as any },
          });
        }

        if (patch.paymentStatus || patch.razorpayPaymentId) {
          await prisma.payment.update({
            where: { orderId: dbOrder.id },
            data: {
              paymentStatus: patch.paymentStatus === "PAID" ? "PAID" : "PENDING",
              razorpayPaymentId: patch.razorpayPaymentId || undefined,
              paidAt: patch.paymentStatus === "PAID" ? new Date() : undefined,
            },
          });
        }
      }
    } catch (dbErr) {
      console.warn("[OrderStore.update] Database notice:", (dbErr as any)?.message || dbErr);
    }

    return this.get(orderId);
  }
}

const globalForOrders = globalThis as unknown as {
  __lollipopOrderStore?: OrderStore;
};

export const orderStore: OrderStore =
  globalForOrders.__lollipopOrderStore ??
  (globalForOrders.__lollipopOrderStore = new HybridOrderStore());

export function generateOrderId(): string {
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `LOL-${rand}-${Date.now().toString(36).toUpperCase()}`;
}
