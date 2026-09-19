import type { Order } from "@/types";

/**
 * ─────────────────────────────────────────────────────────────────────────
 * ORDER STORAGE — IN-MEMORY REFERENCE IMPLEMENTATION
 * ─────────────────────────────────────────────────────────────────────────
 * This module is intentionally isolated behind a small interface
 * (OrderStore) so it can be swapped for a real database (Postgres via
 * Prisma/Drizzle, MongoDB, PlanetScale, Supabase, etc.) without touching
 * any route handler or UI code.
 *
 * IMPORTANT — PRODUCTION CAVEAT:
 * A plain in-memory Map only works reliably on a single long-lived Node.js
 * process. On serverless/edge deployments (Vercel, most modern Next.js
 * hosts) each invocation may run in a different, short-lived instance, so
 * this store WILL LOSE DATA and WILL NOT be safely idempotent across
 * concurrent requests in that environment. Before going live, replace
 * `InMemoryOrderStore` with a real database-backed implementation of the
 * same `OrderStore` interface (see the note in README / final report).
 * ─────────────────────────────────────────────────────────────────────────
 */

export interface OrderStore {
  create(order: Order): Promise<Order>;
  get(orderId: string): Promise<Order | null>;
  getByRazorpayOrderId(razorpayOrderId: string): Promise<Order | null>;
  getByIdempotencyKey(key: string): Promise<Order | null>;
  registerIdempotencyKey(key: string, orderId: string): Promise<void>;
  update(orderId: string, patch: Partial<Order>): Promise<Order | null>;
}

class InMemoryOrderStore implements OrderStore {
  private orders = new Map<string, Order>();
  private idempotencyIndex = new Map<string, string>(); // key -> orderId
  private razorpayIndex = new Map<string, string>(); // razorpayOrderId -> orderId

  async create(order: Order): Promise<Order> {
    this.orders.set(order.id, order);
    if (order.razorpayOrderId) {
      this.razorpayIndex.set(order.razorpayOrderId, order.id);
    }
    return order;
  }

  async get(orderId: string): Promise<Order | null> {
    return this.orders.get(orderId) ?? null;
  }

  async getByRazorpayOrderId(razorpayOrderId: string): Promise<Order | null> {
    const orderId = this.razorpayIndex.get(razorpayOrderId);
    if (!orderId) return null;
    return this.get(orderId);
  }

  async getByIdempotencyKey(key: string): Promise<Order | null> {
    const orderId = this.idempotencyIndex.get(key);
    if (!orderId) return null;
    return this.get(orderId);
  }

  async registerIdempotencyKey(key: string, orderId: string): Promise<void> {
    this.idempotencyIndex.set(key, orderId);
  }

  async update(orderId: string, patch: Partial<Order>): Promise<Order | null> {
    const existing = this.orders.get(orderId);
    if (!existing) return null;
    const updated: Order = {
      ...existing,
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    this.orders.set(orderId, updated);
    if (updated.razorpayOrderId) {
      this.razorpayIndex.set(updated.razorpayOrderId, updated.id);
    }
    return updated;
  }
}

// Module-scope singleton so it survives across requests within the same
// server process (see production caveat above).
const globalForOrders = globalThis as unknown as {
  __lollipopOrderStore?: InMemoryOrderStore;
};

export const orderStore: OrderStore =
  globalForOrders.__lollipopOrderStore ??
  (globalForOrders.__lollipopOrderStore = new InMemoryOrderStore());

export function generateOrderId(): string {
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `LOL-${rand}-${Date.now().toString(36).toUpperCase()}`;
}
