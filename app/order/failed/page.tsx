"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function FailedContent() {
  const params = useSearchParams();
  const orderId = params.get("orderId");

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <span className="material-symbols-outlined text-6xl text-red-500 mb-4 inline-block">error</span>
      <h1 className="font-display font-bold text-3xl sm:text-4xl text-[#1C0D0A] mb-3">Payment Failed</h1>
      <p className="text-[#5C524E] mb-2">
        We couldn&rsquo;t confirm your payment. Your card or account has not been charged for this attempt.
      </p>
      {orderId && <p className="text-xs text-[#9C8B84] mb-8 font-mono">Reference: {orderId}</p>}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
        <Link href="/checkout" className="btn-primary inline-flex items-center gap-2 py-3.5 px-8 text-xs font-bold uppercase tracking-wider">
          Retry Payment
        </Link>
        <Link href="/cart" className="btn-secondary inline-flex items-center gap-2 py-3.5 px-7 text-xs font-bold uppercase tracking-wider">
          Back to Cart
        </Link>
        <Link href="/" className="text-sm font-semibold text-[#962854] hover:underline">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default function OrderFailedPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-sm text-[#9C8B84]">Loading…</div>}>
      <FailedContent />
    </Suspense>
  );
}
