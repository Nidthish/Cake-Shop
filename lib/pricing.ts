import { getProductById } from "@/lib/products";
import type { CreateOrderRequestItem, OrderLineItem } from "@/types";

export const SGST_RATE = 0.025;
export const CGST_RATE = 0.025;
export const DELIVERY_FEE = 0; // "Handcrafted Delivery — FREE" in the original UI

export class PricingError extends Error {
  code: string;
  constructor(message: string, code = "PRICING_ERROR") {
    super(message);
    this.code = code;
  }
}

export interface PricedOrder {
  lineItems: OrderLineItem[];
  subtotal: number;
  sgst: number;
  cgst: number;
  tax: number;
  deliveryFee: number;
  total: number;
}

/**
 * Recomputes the entire order total from scratch on the server, using only
 * product IDs, chosen weights, and quantities from the client. Prices,
 * discounts, and tax are NEVER accepted from the browser — this function is
 * the single source of truth for what Razorpay is told to charge.
 */
export function priceOrder(items: CreateOrderRequestItem[]): PricedOrder {
  if (!Array.isArray(items) || items.length === 0) {
    throw new PricingError("Cart is empty.", "EMPTY_CART");
  }

  const lineItems: OrderLineItem[] = items.map((item) => {
    if (
      !item.productId ||
      typeof item.quantity !== "number" ||
      !Number.isFinite(item.quantity) ||
      item.quantity <= 0 ||
      item.quantity > 50
    ) {
      throw new PricingError(
        `Invalid item or quantity for product "${item.productId}".`,
        "INVALID_QUANTITY"
      );
    }

    const product = getProductById(item.productId);
    if (!product) {
      throw new PricingError(
        `Product "${item.productId}" is no longer available.`,
        "PRODUCT_NOT_FOUND"
      );
    }

    // Resolve the authoritative unit price for the requested weight/variant
    // directly from the server-side catalog — the client's price is ignored.
    let unitPrice: number | undefined;
    let resolvedWeight = item.weight;

    if (product.variants && product.variants.length > 0) {
      const variant = product.variants.find((v) => v.weight === item.weight);
      if (variant) {
        unitPrice = variant.price;
      } else {
        // Unknown/missing weight from the client — fall back to the first
        // variant rather than trusting an arbitrary client-supplied price.
        unitPrice = product.variants[0].price;
        resolvedWeight = product.variants[0].weight;
      }
    } else {
      unitPrice = product.price ?? product.minPrice;
    }

    if (unitPrice === undefined || !Number.isFinite(unitPrice)) {
      throw new PricingError(
        `Could not resolve a price for product "${item.productId}".`,
        "PRICE_UNRESOLVED"
      );
    }

    const lineTotal = Math.round(unitPrice * item.quantity * 100) / 100;

    return {
      productId: product.id,
      name: product.name,
      weight: resolvedWeight,
      quantity: item.quantity,
      unitPrice,
      lineTotal,
    };
  });

  const subtotal = round2(lineItems.reduce((sum, li) => sum + li.lineTotal, 0));
  const sgst = Math.round(subtotal * SGST_RATE);
  const cgst = Math.round(subtotal * CGST_RATE);
  const tax = sgst + cgst;
  const deliveryFee = DELIVERY_FEE;
  const total = round2(subtotal + tax + deliveryFee);

  if (total <= 0) {
    throw new PricingError("Order total must be greater than zero.", "INVALID_TOTAL");
  }

  return { lineItems, subtotal, sgst, cgst, tax, deliveryFee, total };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
