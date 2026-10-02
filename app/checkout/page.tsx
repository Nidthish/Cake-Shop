"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { useToast } from "@/components/common/ToastProvider";
import type { CreateOrderResponse, ApiError } from "@/types";

const TIME_SLOTS = ["9 AM - 12 PM", "12 PM - 3 PM", "3 PM - 6 PM", "6 PM - 9 PM"];

function tomorrow(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

export default function CheckoutPage() {
  const { items, summary, clearCart } = useCart();
  const { showToast } = useToast();
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [date, setDate] = useState(tomorrow());
  const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[0]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [scriptReady, setScriptReady] = useState(false);

  const idempotencyKey = useRef<string | null>(null);

  useEffect(() => {
    if (!idempotencyKey.current) {
      idempotencyKey.current =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `chk-${Date.now()}-${Math.random()}`;
    }
  }, []);

  const egglessItems = useMemo(
    () => items.filter((i) => i.eggPreference === "eggless"),
    [items]
  );
  const hasEggless = egglessItems.length > 0;
  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);

  const minDate = useMemo(() => (hasEggless ? tomorrow() : todayStr), [hasEggless, todayStr]);

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (fullName.trim().length < 2) next.fullName = "Enter your full name.";
    if (!/^[6-9]\d{9}$/.test(phone.trim())) next.phone = "Enter a valid 10-digit mobile number.";
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) next.email = "Enter a valid email address.";
    if (street.trim().length < 5) next.street = "Enter your full delivery address.";
    if (city.trim().length < 2) next.city = "City is required.";
    if (!/^\d{6}$/.test(pincode.trim())) next.pincode = "Enter a valid 6-digit pincode.";
    if (hasEggless && date === todayStr) {
      next.date = "Delivery for today is not possible for eggless cakes. Select tomorrow or later.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handlePay() {
    if (items.length === 0) {
      showToast("Your cart is empty.", "error");
      return;
    }
    if (!validate()) {
      showToast("Please fix the highlighted fields.", "error");
      return;
    }
    if (!scriptReady || typeof window === "undefined" || !window.Razorpay) {
      showToast("Payment gateway is still loading, please try again in a moment.", "error");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.id, weight: i.weight, quantity: i.quantity })),
          customer: { fullName, phone, email },
          address: { street, city, pincode },
          schedule: { date, timeSlot },
          idempotencyKey: idempotencyKey.current ?? undefined,
        }),
      });

      const data: CreateOrderResponse | ApiError = await res.json();

      if (!data.success) {
        showToast(data.error || "Could not start payment.", "error");
        setSubmitting(false);
        return;
      }

      const rzp = new window.Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "Lollipop Cake Shop",
        description: `Order ${data.orderId}`,
        order_id: data.razorpayOrderId,
        prefill: { name: fullName, email, contact: phone },
        theme: { color: "#962854" },
        handler: async (response) => {
          try {
            const verifyRes = await fetch("/api/razorpay/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: data.orderId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              clearCart();
              router.push(`/order/success?orderId=${data.orderId}`);
            } else {
              router.push(`/order/failed?orderId=${data.orderId}`);
            }
          } catch {
            router.push(`/order/failed?orderId=${data.orderId}`);
          }
        },
        modal: {
          ondismiss: () => {
            setSubmitting(false);
            showToast("Payment cancelled.", "info");
          },
        },
      });

      rzp.on("payment.failed", () => {
        router.push(`/order/failed?orderId=${data.orderId}`);
      });

      rzp.open();
    } catch {
      showToast("Something went wrong. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h1 className="font-display font-bold text-3xl text-[#1C0D0A] mb-3">Nothing to check out</h1>
        <p className="text-[#5C524E] mb-8">Add something delicious to your cart first.</p>
        <Link href="/cakes" className="btn-primary inline-flex items-center gap-2 py-3.5 px-8 text-xs font-bold uppercase tracking-wider">
          Browse Cakes
        </Link>
      </div>
    );
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setScriptReady(true)}
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-[#1C0D0A] mb-8">Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white rounded-2xl border border-[#E6C184]/30 p-6">
              <h2 className="font-display font-bold text-xl text-[#1C0D0A] mb-4">Customer Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#5C524E]">Full Name</label>
                  <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full mt-1 px-3 py-2.5 rounded-xl border border-[#E6C184]/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#962854]/30" />
                  {errors.fullName && <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>}
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#5C524E]">Phone</label>
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={10} className="w-full mt-1 px-3 py-2.5 rounded-xl border border-[#E6C184]/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#962854]/30" />
                  {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#5C524E]">Email</label>
                  <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="w-full mt-1 px-3 py-2.5 rounded-xl border border-[#E6C184]/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#962854]/30" />
                  {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
                </div>
              </div>
            </section>

            <section className="bg-white rounded-2xl border border-[#E6C184]/30 p-6">
              <h2 className="font-display font-bold text-xl text-[#1C0D0A] mb-4">Delivery Address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#5C524E]">Street Address</label>
                  <input value={street} onChange={(e) => setStreet(e.target.value)} className="w-full mt-1 px-3 py-2.5 rounded-xl border border-[#E6C184]/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#962854]/30" />
                  {errors.street && <p className="text-xs text-red-600 mt-1">{errors.street}</p>}
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#5C524E]">City</label>
                  <input value={city} onChange={(e) => setCity(e.target.value)} className="w-full mt-1 px-3 py-2.5 rounded-xl border border-[#E6C184]/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#962854]/30" />
                  {errors.city && <p className="text-xs text-red-600 mt-1">{errors.city}</p>}
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#5C524E]">Pincode</label>
                  <input value={pincode} onChange={(e) => setPincode(e.target.value)} maxLength={6} className="w-full mt-1 px-3 py-2.5 rounded-xl border border-[#E6C184]/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#962854]/30" />
                  {errors.pincode && <p className="text-xs text-red-600 mt-1">{errors.pincode}</p>}
                </div>
              </div>
            </section>

            <section className="bg-white rounded-2xl border border-[#E6C184]/30 p-6">
              <h2 className="font-display font-bold text-xl text-[#1C0D0A] mb-4">Delivery Schedule</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#5C524E]">Delivery Date</label>
                  <input type="date" min={minDate} value={date} onChange={(e) => setDate(e.target.value)} className="w-full mt-1 px-3 py-2.5 rounded-xl border border-[#E6C184]/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#962854]/30" />
                  {errors.date && <p className="text-xs text-red-600 mt-1">{errors.date}</p>}
                  {hasEggless && (
                    <p className="text-[11px] text-[#962854] font-semibold mt-1">
                      🌱 Note: Eggless cakes require 1 day prior notice. Earliest available date: {minDate}.
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#5C524E]">Time Slot</label>
                  <select value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)} className="w-full mt-1 px-3 py-2.5 rounded-xl border border-[#E6C184]/40 text-sm focus:outline-none">
                    {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
            </section>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-[#E6C184]/30 p-6 sticky top-28">
              <h2 className="font-display font-bold text-xl text-[#1C0D0A] mb-4">Order Summary</h2>
              <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                {items.map((i) => (
                  <div key={`${i.id}__${i.weight}`} className="flex justify-between text-xs text-[#5C524E]">
                    <span className="truncate pr-2">{i.name} ({i.weight}) × {i.quantity}</span>
                    <span className="flex-shrink-0 font-semibold text-[#1C0D0A]">₹{i.price * i.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2 text-sm text-[#5C524E] border-t border-[#E6C184]/30 pt-4">
                <div className="flex justify-between"><span>Subtotal</span><span>₹{summary.subtotal}</span></div>
                <div className="flex justify-between"><span>Tax (5%)</span><span>₹{summary.tax}</span></div>
                <div className="flex justify-between"><span>Delivery</span><span className="text-emerald-600 font-semibold">FREE</span></div>
              </div>
              <div className="border-t border-[#E6C184]/30 mt-4 pt-4 flex justify-between font-bold text-lg text-[#1C0D0A]">
                <span>Total</span><span>₹{summary.total}</span>
              </div>
              <div className="mt-4 pt-3 border-t border-[#E6C184]/20 text-[11px] text-[#7A6B63] leading-relaxed">
                By placing your order, you agree to our{" "}
                <Link href="/terms-and-conditions" target="_blank" className="text-[#962854] font-semibold underline hover:text-[#7A1E43]">
                  Terms &amp; Conditions
                </Link>
                ,{" "}
                <Link href="/refund-policy" target="_blank" className="text-[#962854] font-semibold underline hover:text-[#7A1E43]">
                  Refund Policy
                </Link>
                , and{" "}
                <Link href="/privacy-policy" target="_blank" className="text-[#962854] font-semibold underline hover:text-[#7A1E43]">
                  Privacy Policy
                </Link>
                .
              </div>

              <button
                onClick={handlePay}
                disabled={submitting}
                className="btn-primary w-full mt-4 py-3.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {submitting ? "Processing…" : (
                  <>
                    <span className="material-symbols-outlined text-base">lock</span> Pay Securely with Razorpay
                  </>
                )}
              </button>

              <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-[#7A6B63]">
                <span className="text-emerald-700 font-bold">🔒 256-Bit SSL Encrypted</span>
                <span>•</span>
                <span>PCI-DSS Level 1 Gateway</span>
              </div>
              <p className="text-[10px] text-[#9C8B84] text-center mt-1">
                Amount verified on server — processed securely via Razorpay (UPI, Cards, NetBanking).
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
