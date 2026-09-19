"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { Order } from "@/types";

function SuccessContent() {
  const params = useSearchParams();
  const orderId = params.get("orderId");
  const [order, setOrder] = useState<Pick<Order, "id" | "items" | "total" | "customer" | "schedule"> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) { setLoading(false); return; }
    fetch(`/api/orders/${orderId}`)
      .then((r) => r.json())
      .then((data) => { if (data.success) setOrder(data.order); })
      .finally(() => setLoading(false));
  }, [orderId]);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <span className="material-symbols-outlined text-6xl text-emerald-500 mb-4 inline-block">check_circle</span>
      <h1 className="font-display font-bold text-3xl sm:text-4xl text-[#1C0D0A] mb-3">Order Confirmed!</h1>
      <p className="text-[#5C524E] mb-8">
        Thank you — your payment was successful and your order is being prepared.
      </p>

      {loading ? (
        <p className="text-sm text-[#9C8B84]">Loading order details…</p>
      ) : order ? (
        <div className="bg-white rounded-2xl border border-[#E6C184]/30 p-6 text-left mb-8">
          <div className="flex justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5C524E]">Order ID</span>
            <span className="font-mono text-sm font-bold text-[#1C0D0A]">{order.id}</span>
          </div>
          <div className="space-y-2 mb-4">
            {order.items.map((i) => (
              <div key={`${i.productId}-${i.weight}`} className="flex justify-between text-sm">
                <span className="text-[#5C524E]">{i.name} ({i.weight}) × {i.quantity}</span>
                <span className="font-semibold text-[#1C0D0A]">₹{i.lineTotal}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-[#E6C184]/30 pt-4 flex justify-between font-bold text-lg text-[#1C0D0A]">
            <span>Total Paid</span><span>₹{order.total}</span>
          </div>
        </div>
      ) : orderId ? (
        <p className="text-sm text-[#9C8B84] mb-8">Order reference: {orderId}</p>
      ) : null}

      <Link href="/" className="btn-primary inline-flex items-center gap-2 py-3.5 px-8 text-xs font-bold uppercase tracking-wider">
        Continue Shopping
      </Link>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-sm text-[#9C8B84]">Loading…</div>}>
      <SuccessContent />
    </Suspense>
  );
}
