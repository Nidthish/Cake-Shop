"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { useToast } from "@/components/common/ToastProvider";

const WITH_EGG_DELIVERY_TIMES = [
  "12:00 PM",
  "12:30 PM",
  "01:00 PM",
  "01:30 PM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
  "05:00 PM",
  "05:30 PM",
  "06:00 PM",
  "06:30 PM",
  "07:00 PM",
  "07:30 PM",
  "08:00 PM",
  "08:30 PM",
  "09:00 PM",
];

const EGGLESS_DELIVERY_TIMES = [
  "01:00 PM",
  "01:30 PM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
  "05:00 PM",
  "05:30 PM",
  "06:00 PM",
  "06:30 PM",
  "07:00 PM",
  "07:30 PM",
  "08:00 PM",
  "08:30 PM",
  "09:00 PM",
];

function getDayString(daysOffset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split("T")[0];
}

function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-").map(Number);
  const dateObj = new Date(y, m - 1, d);
  return dateObj.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export default function CheckoutPage() {
  const { items, summary, clearCart } = useCart();
  const { showToast } = useToast();
  const router = useRouter();

  // Customer State
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // Address State
  const [street, setStreet] = useState("");
  const [city] = useState("Tiruchirappalli");
  const [pincode, setPincode] = useState("");

  // Eggless check & Minimum delivery date logic
  const egglessItems = useMemo(
    () => items.filter((i) => i.eggPreference === "eggless"),
    [items]
  );
  const hasEggless = egglessItems.length > 0;
  const todayStr = useMemo(() => getDayString(0), []);
  const tomorrowStr = useMemo(() => getDayString(1), []);
  const dayAfterStr = useMemo(() => getDayString(2), []);
  const minDate = useMemo(() => (hasEggless ? tomorrowStr : todayStr), [hasEggless, tomorrowStr, todayStr]);

  // Available Delivery Time Slots based on Egg / Eggless constraints
  // Eggless: 01:00 PM to 09:00 PM; With Egg: 12:00 PM to 09:00 PM
  const availableDeliveryTimes = useMemo(
    () => (hasEggless ? EGGLESS_DELIVERY_TIMES : WITH_EGG_DELIVERY_TIMES),
    [hasEggless]
  );

  // Schedule State: Specific Delivery Time
  const [date, setDate] = useState(tomorrowStr);
  const [timeSlot, setTimeSlot] = useState(hasEggless ? "01:00 PM" : "12:00 PM");
  const [customTime, setCustomTime] = useState("");

  // Auto-switch timeSlot if current slot is outside the valid constraint (e.g. 12:00 PM for eggless)
  useEffect(() => {
    if (timeSlot !== "CUSTOM" && !availableDeliveryTimes.includes(timeSlot)) {
      setTimeSlot(availableDeliveryTimes[0]);
    }
  }, [availableDeliveryTimes, timeSlot]);

  // Cake Customization State
  const [cakeMessage, setCakeMessage] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");

  // Carryover cake message from cart item if available
  useEffect(() => {
    const itemWithMsg = items.find((i) => i.cakeMessage?.trim());
    if (itemWithMsg?.cakeMessage && !cakeMessage) {
      setCakeMessage(itemWithMsg.cakeMessage.trim());
    }
  }, [items, cakeMessage]);

  // If eggless items are present and date was somehow set to today, update to tomorrow
  useEffect(() => {
    if (hasEggless && date === todayStr) {
      setDate(tomorrowStr);
    }
  }, [hasEggless, date, todayStr, tomorrowStr]);

  // Payment Option & Order Threshold Rules
  const isMinOrderMet = summary.subtotal >= 300;
  const minOrderDiff = Math.max(0, 300 - summary.subtotal);
  const isCodEligible = summary.subtotal >= 1000;
  const codDiff = Math.max(0, 1000 - summary.subtotal);

  // Payment Option: "COD" vs "RAZORPAY" (defaults to RAZORPAY if under ₹1,000)
  const [paymentOption, setPaymentOption] = useState<"COD" | "RAZORPAY">(
    summary.subtotal >= 1000 ? "COD" : "RAZORPAY"
  );

  // If subtotal drops below ₹1,000 and COD was chosen, auto-switch to RAZORPAY
  useEffect(() => {
    if (!isCodEligible && paymentOption === "COD") {
      setPaymentOption("RAZORPAY");
    }
  }, [isCodEligible, paymentOption]);

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

  function clearError(field: string) {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const copy = { ...prev };
      delete copy[field];
      return copy;
    });
  }

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (fullName.trim().length < 2) next.fullName = "Please enter your full name.";
    if (!/^[6-9]\d{9}$/.test(phone.trim())) next.phone = "Enter a valid 10-digit mobile number.";
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) next.email = "Enter a valid email address.";
    if (street.trim().length < 5) next.street = "Enter your full street address & door number.";
    if (!/^\d{6}$/.test(pincode.trim())) next.pincode = "Enter a valid 6-digit postal pincode.";
    if (hasEggless && date === todayStr) {
      next.date = "Eggless cakes require 24 hours prior baking notice. Please choose tomorrow or later.";
    }
    if (timeSlot === "CUSTOM") {
      if (!customTime.trim()) {
        next.deliveryTimeSlot = "Please enter your preferred delivery time (e.g. 05:30 PM).";
      }
    } else if (hasEggless && !EGGLESS_DELIVERY_TIMES.includes(timeSlot)) {
      next.deliveryTimeSlot = "For eggless cakes, earliest delivery begins from 01:00 PM.";
    } else if (!hasEggless && !WITH_EGG_DELIVERY_TIMES.includes(timeSlot)) {
      next.deliveryTimeSlot = "Delivery hours are between 12:00 PM and 09:00 PM.";
    }

    setErrors(next);

    if (Object.keys(next).length > 0) {
      // Scroll to the first error element smoothly
      const firstErrorField = Object.keys(next)[0];
      const el = document.getElementById(firstErrorField);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.focus();
      }
      return false;
    }
    return true;
  }

  async function handleSubmitOrder() {
    if (items.length === 0) {
      showToast("Your cart is empty.", "error");
      return;
    }
    if (!isMinOrderMet) {
      showToast(
        `Minimum order amount is ₹300. Please add ₹${minOrderDiff} more of our fresh bakery items to proceed.`,
        "error"
      );
      return;
    }
    if (paymentOption === "COD" && !isCodEligible) {
      showToast(
        `Cash on Delivery is only available for purchases above ₹1,000. Please pay online via UPI / GPay / Card.`,
        "error"
      );
      return;
    }
    if (!validate()) {
      showToast("Please complete the required delivery information.", "error");
      return;
    }

    setSubmitting(true);

    const finalDeliveryTime = timeSlot === "CUSTOM" && customTime.trim() ? customTime.trim() : timeSlot;

    // OPTION 1: DIRECT ORDER / CASH ON DELIVERY (No Razorpay gateway required)
    if (paymentOption === "COD") {
      try {
        const res = await fetch("/api/orders/place", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: items.map((i) => ({
              productId: i.id,
              weight: i.weight,
              quantity: i.quantity,
              eggPreference: i.eggPreference,
              cakeMessage: i.cakeMessage || cakeMessage,
              offer: i.eggPreference === "eggless" ? undefined : i.offer,
            })),
            customer: { fullName, phone, email },
            address: { street, city, pincode },
            schedule: { date, timeSlot: finalDeliveryTime },
            cakeMessage: cakeMessage.trim() || undefined,
            specialInstructions: specialInstructions.trim() || undefined,
            deliveryNotes: specialInstructions.trim() || undefined,
            paymentMethod: "COD",
          }),
        });

        const data = await res.json();
        if (data.success && data.orderId) {
          clearCart();
          showToast("Order placed successfully! Confirmation invoice dispatched.", "success");
          router.push(`/order/success?orderId=${data.orderId}`);
        } else {
          showToast(data.error || "Could not place order. Please check your details.", "error");
          setSubmitting(false);
        }
      } catch {
        showToast("Network error placing order. Please try again.", "error");
        setSubmitting(false);
      }
      return;
    }

    // OPTION 2: ONLINE PAYMENT VIA RAZORPAY
    if (!scriptReady || typeof window === "undefined" || !window.Razorpay) {
      showToast("Payment gateway is initializing, please try again in a moment.", "error");
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.id,
            weight: i.weight,
            quantity: i.quantity,
            eggPreference: i.eggPreference,
            cakeMessage: i.cakeMessage || cakeMessage,
            offer: i.eggPreference === "eggless" ? undefined : i.offer,
          })),
          customer: { fullName, phone, email },
          address: { street, city, pincode },
          schedule: { date, timeSlot: finalDeliveryTime },
          cakeMessage: cakeMessage.trim() || undefined,
          specialInstructions: specialInstructions.trim() || undefined,
          deliveryNotes: specialInstructions.trim() || undefined,
          idempotencyKey: idempotencyKey.current ?? undefined,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        showToast(data.error || "Could not initiate payment gateway.", "error");
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
        theme: { color: "#802B52" },
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
              showToast("Payment verified & order confirmed!", "success");
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
            showToast("Payment checkout cancelled.", "info");
          },
        },
      });

      rzp.on("payment.failed", () => {
        router.push(`/order/failed?orderId=${data.orderId}`);
      });

      rzp.open();
    } catch {
      showToast("Something went wrong with online payment. Try Cash on Delivery.", "error");
    } finally {
      setSubmitting(false);
    }
  }

  // Quick Date Pill Options
  const dateOptions = useMemo(() => {
    const list = [];
    if (!hasEggless) {
      list.push({ dateStr: todayStr, label: "Today", sub: formatDisplayDate(todayStr) });
    }
    list.push({ dateStr: tomorrowStr, label: "Tomorrow", sub: formatDisplayDate(tomorrowStr) });
    list.push({ dateStr: dayAfterStr, label: "Day After", sub: formatDisplayDate(dayAfterStr) });
    return list;
  }, [hasEggless, todayStr, tomorrowStr, dayAfterStr]);

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="w-20 h-20 bg-[#802B52]/10 rounded-full flex items-center justify-center mx-auto mb-5 text-[#802B52]">
          <span className="material-symbols-outlined text-4xl">cake</span>
        </div>
        <h1 className="font-display font-bold text-3xl text-[#1C0D0A] mb-3">Your Cart is Empty</h1>
        <p className="text-sm text-[#5C524E] mb-8 max-w-md mx-auto">
          Please add a freshly baked cake or dessert to your cart before proceeding to checkout.
        </p>
        <Link
          href="/cakes"
          className="btn-primary inline-flex items-center gap-2 py-3.5 px-8 text-xs font-bold uppercase tracking-wider"
        >
          Explore Fresh Cakes
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

      <div className="bg-[#FAF5EE] min-h-screen py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header & Flow Indicator */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-xs font-bold text-[#802B52] uppercase tracking-wider mb-2">
              <Link href="/cart" className="hover:underline flex items-center gap-1">
                <span>Cart</span>
              </Link>
              <span className="text-[#E6C184]">•</span>
              <span className="text-[#1C0D0A]">Confirm Order & Delivery</span>
              <span className="text-[#E6C184]">•</span>
              <span className="text-[#9C8B84]">Confirmation</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h1 className="font-display font-bold text-3xl sm:text-4xl text-[#1C0D0A]">
                  Order Confirmation & Delivery
                </h1>
                <p className="text-xs text-[#5C524E] mt-1">
                  Quick 60-second checkout — no account creation required.
                </p>
              </div>

              <div className="hidden sm:flex items-center gap-2 bg-white border border-[#E6C184]/40 px-3.5 py-1.5 rounded-full text-xs text-[#5C524E] shadow-xs">
                <span className="material-symbols-outlined text-base text-emerald-600">verified_user</span>
                <span>Direct Bakery Doorstep Delivery</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left Column: Focused 3-Step Guided Form */}
            <div className="lg:col-span-2 space-y-6">

              {/* STEP 1: Contact & Delivery Location */}
              <section className="bg-white rounded-3xl border border-[#E6C184]/40 p-6 sm:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#E6C184]/30">
                  <span className="w-8 h-8 rounded-full bg-[#802B52] text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                    1
                  </span>
                  <div>
                    <h2 className="font-display font-bold text-lg text-[#1C0D0A]">
                      Contact & Delivery Address
                    </h2>
                    <p className="text-xs text-[#7A6B72]">
                      Where should our delivery team bring your fresh cake?
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Name & Mobile Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="fullName" className="text-xs font-bold uppercase tracking-wider text-[#5C524E]">
                        Full Name *
                      </label>
                      <input
                        id="fullName"
                        type="text"
                        autoComplete="name"
                        placeholder="Enter your full name"
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          clearError("fullName");
                        }}
                        className={`w-full mt-1.5 px-4 py-3 rounded-2xl border text-sm font-semibold text-[#1C0D0A] transition-all focus:outline-none focus:ring-2 ${errors.fullName
                          ? "border-red-400 bg-red-50/20 focus:ring-red-300"
                          : "border-[#E6DBCE] bg-[#FAF5EE]/40 focus:border-[#802B52] focus:ring-[#802B52]/20"
                          }`}
                      />
                      {errors.fullName && <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>}
                    </div>

                    <div>
                      <label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-[#5C524E]">
                        Mobile Phone (for delivery OTP) *
                      </label>
                      <div className="relative mt-1.5 flex items-center">
                        <span className="absolute left-4 text-xs font-bold text-[#802B52] select-none pointer-events-none">
                          +91
                        </span>
                        <input
                          id="phone"
                          type="tel"
                          inputMode="numeric"
                          autoComplete="tel"
                          maxLength={10}
                          placeholder="10-digit mobile number"
                          value={phone}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                            setPhone(val);
                            clearError("phone");
                          }}
                          className={`w-full pl-12 pr-4 py-3 rounded-2xl border text-sm font-semibold text-[#1C0D0A] transition-all focus:outline-none focus:ring-2 ${errors.phone
                            ? "border-red-400 bg-red-50/20 focus:ring-red-300"
                            : "border-[#E6DBCE] bg-[#FAF5EE]/40 focus:border-[#802B52] focus:ring-[#802B52]/20"
                            }`}
                        />
                      </div>
                      {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-[#5C524E]">
                      Email Address (for instant receipt & order tracking) *
                    </label>
                    <input
                      id="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        clearError("email");
                      }}
                      className={`w-full mt-1.5 px-4 py-3 rounded-2xl border text-sm font-semibold text-[#1C0D0A] transition-all focus:outline-none focus:ring-2 ${errors.email
                        ? "border-red-400 bg-red-50/20 focus:ring-red-300"
                        : "border-[#E6DBCE] bg-[#FAF5EE]/40 focus:border-[#802B52] focus:ring-[#802B52]/20"
                        }`}
                    />
                    {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
                  </div>

                  {/* Street Address */}
                  <div>
                    <label htmlFor="street" className="text-xs font-bold uppercase tracking-wider text-[#5C524E]">
                      Complete Street Address & Door No. *
                    </label>
                    <input
                      id="street"
                      type="text"
                      autoComplete="street-address"
                      placeholder="Flat / House no., building name, street, landmark"
                      value={street}
                      onChange={(e) => {
                        setStreet(e.target.value);
                        clearError("street");
                      }}
                      className={`w-full mt-1.5 px-4 py-3 rounded-2xl border text-sm font-semibold text-[#1C0D0A] transition-all focus:outline-none focus:ring-2 ${errors.street
                        ? "border-red-400 bg-red-50/20 focus:ring-red-300"
                        : "border-[#E6DBCE] bg-[#FAF5EE]/40 focus:border-[#802B52] focus:ring-[#802B52]/20"
                        }`}
                    />
                    {errors.street && <p className="text-xs text-red-600 mt-1">{errors.street}</p>}
                  </div>

                  {/* City (Pre-set) & Pincode */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-[#5C524E]">
                        Delivery City
                      </label>
                      <div className="mt-1.5 flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border border-[#E6DBCE] bg-[#FAF5EE]/70 text-sm font-semibold text-[#1C0D0A]">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="material-symbols-outlined text-base text-[#802B52] shrink-0">location_city</span>
                          <span className="truncate">Tiruchirappalli (Trichy)</span>
                        </div>
                        <span className="shrink-0 whitespace-nowrap inline-flex items-center justify-center text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full leading-none">
                          Active Delivery
                        </span>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="pincode" className="text-xs font-bold uppercase tracking-wider text-[#5C524E]">
                        Pincode *
                      </label>
                      <input
                        id="pincode"
                        type="text"
                        inputMode="numeric"
                        autoComplete="postal-code"
                        maxLength={6}
                        placeholder="6-digit pincode"
                        value={pincode}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                          setPincode(val);
                          clearError("pincode");
                        }}
                        className={`w-full mt-1.5 px-4 py-3 rounded-2xl border text-sm font-semibold text-[#1C0D0A] transition-all focus:outline-none focus:ring-2 ${errors.pincode
                          ? "border-red-400 bg-red-50/20 focus:ring-red-300"
                          : "border-[#E6DBCE] bg-[#FAF5EE]/40 focus:border-[#802B52] focus:ring-[#802B52]/20"
                          }`}
                      />
                      {errors.pincode && <p className="text-xs text-red-600 mt-1">{errors.pincode}</p>}
                    </div>
                  </div>

                  {/* Delivery Charge Note */}
                  <div className="p-3.5 bg-[#FAF5EE] rounded-2xl border border-[#E6DBCE] flex items-start gap-2.5 text-xs text-[#5C524E]">
                    <span className="material-symbols-outlined text-base text-[#802B52] mt-0.5">two_wheeler</span>
                    <div>
                      <strong className="text-[#802B52]">Doorstep Delivery Charge:</strong> Calculated at standard <strong>₹5 per kilometer</strong> from our bakery in Trichy to your address, payable directly upon delivery.
                    </div>
                  </div>
                </div>
              </section>

              {/* STEP 2: Delivery Date & Time Slot */}
              <section className="bg-white rounded-3xl border border-[#E6C184]/40 p-6 sm:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#E6C184]/30">
                  <span className="w-8 h-8 rounded-full bg-[#802B52] text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                    2
                  </span>
                  <div>
                    <h2 className="font-display font-bold text-lg text-[#1C0D0A]">
                      Delivery Schedule
                    </h2>
                    <p className="text-xs text-[#7A6B72]">
                      Select the preferred day and time for your fresh bake.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Date Selection */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#5C524E]">
                        Select Delivery Date *
                      </label>
                      {hasEggless && (
                        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                          Eggless: Next-Day From 01:00 PM
                        </span>
                      )}
                    </div>

                    {/* Quick Date Chips */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-3">
                      {dateOptions.map((opt) => {
                        const isSelected = date === opt.dateStr;
                        return (
                          <button
                            key={opt.dateStr}
                            type="button"
                            onClick={() => {
                              setDate(opt.dateStr);
                              clearError("date");
                            }}
                            className={`p-3 rounded-2xl border text-left transition-all ${isSelected
                              ? "bg-[#802B52] text-white border-[#802B52] shadow-sm font-bold"
                              : "bg-[#FAF5EE]/60 text-[#1C0D0A] border-[#E6DBCE] hover:border-[#802B52]/50"
                              }`}
                          >
                            <div className="text-xs font-bold">{opt.label}</div>
                            <div className={`text-[11px] mt-0.5 ${isSelected ? "text-pink-100" : "text-[#7A6B72]"}`}>
                              {opt.sub}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Custom Date Picker Fallback */}
                    <div className="flex items-center gap-3">
                      <div className="relative flex-1">
                        <input
                          id="date"
                          type="date"
                          min={minDate}
                          value={date}
                          onChange={(e) => {
                            setDate(e.target.value);
                            clearError("date");
                          }}
                          className={`w-full px-4 py-2.5 rounded-2xl border text-xs font-semibold text-[#1C0D0A] transition-all focus:outline-none focus:ring-2 ${errors.date
                            ? "border-red-400 bg-red-50/20 focus:ring-red-300"
                            : "border-[#E6DBCE] bg-[#FAF5EE]/40 focus:border-[#802B52] focus:ring-[#802B52]/20"
                            }`}
                        />
                      </div>
                      <span className="text-xs text-[#7A6B72]">Selected: <strong>{formatDisplayDate(date)}</strong></span>
                    </div>
                    {errors.date && <p className="text-xs text-red-600 mt-1">{errors.date}</p>}
                  </div>

                  {/* Time Slot Selection: Dropdown Only (Box Cards Removed) */}
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <label htmlFor="deliveryTimeSlot" className="text-xs font-bold uppercase tracking-wider text-[#5C524E]">
                        Specific Delivery Time *
                      </label>
                      {hasEggless ? (
                        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                          Eggless: 01:00 PM – 09:00 PM
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-[#802B52] bg-[#FAF5EE] border border-[#E6C184]/40 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                          With Egg: 12:00 PM – 09:00 PM
                        </span>
                      )}
                    </div>

                    {/* Single Full Dropdown tailored to Egg vs Eggless constraints */}
                    <div className="flex flex-col sm:flex-row gap-3 items-center">
                      <div className="w-full sm:w-auto flex-1">
                        <select
                          id="deliveryTimeSlot"
                          value={timeSlot}
                          onChange={(e) => {
                            setTimeSlot(e.target.value);
                            clearError("deliveryTimeSlot");
                          }}
                          className={`w-full px-4 py-3 rounded-2xl border text-xs sm:text-sm font-semibold text-[#1C0D0A] transition-all focus:outline-none focus:ring-2 ${errors.deliveryTimeSlot
                            ? "border-red-400 bg-red-50/20 focus:ring-red-300"
                            : "border-[#E6DBCE] bg-white focus:border-[#802B52] focus:ring-[#802B52]/20"
                            }`}
                        >
                          <optgroup
                            label={
                              hasEggless
                                ? "Eggless Delivery Slots (01:00 PM to 09:00 PM)"
                                : "With Egg Delivery Slots (12:00 PM to 09:00 PM)"
                            }
                          >
                            {availableDeliveryTimes.map((t) => (
                              <option key={t} value={t}>
                                {t}
                              </option>
                            ))}
                          </optgroup>
                          <option value="CUSTOM">Custom Exact Time...</option>
                        </select>
                      </div>

                      {timeSlot === "CUSTOM" && (
                        <div className="w-full sm:w-auto flex-1">
                          <input
                            type="text"
                            placeholder="Enter time (e.g. 05:45 PM)"
                            value={customTime}
                            onChange={(e) => {
                              setCustomTime(e.target.value);
                              clearError("deliveryTimeSlot");
                            }}
                            className={`w-full px-4 py-3 rounded-2xl border text-xs sm:text-sm font-semibold text-[#1C0D0A] transition-all focus:outline-none focus:ring-2 ${errors.deliveryTimeSlot
                              ? "border-red-400 bg-red-50/20 focus:ring-red-300"
                              : "border-[#802B52] bg-white focus:ring-[#802B52]/20"
                              }`}
                          />
                        </div>
                      )}
                    </div>
                    {errors.deliveryTimeSlot && (
                      <p className="text-xs text-red-600 mt-1">{errors.deliveryTimeSlot}</p>
                    )}

                    <p className="text-[11px] text-[#7A6B72] mt-2">
                      {hasEggless
                        ? "• Eggless cakes require specialized batter formulation & chilling. Next-day delivery begins from 01:00 PM (up to 09:00 PM)."
                        : "• Freshly baked to order. Available delivery slots: 12:00 PM to 09:00 PM."}
                    </p>
                  </div>
                </div>
              </section>

              {/* STEP 3: Personalization & Payment Method */}
              <section className="bg-white rounded-3xl border border-[#E6C184]/40 p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-[#E6C184]/30">
                  <span className="w-8 h-8 rounded-full bg-[#802B52] text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                    3
                  </span>
                  <div>
                    <h2 className="font-display font-bold text-lg text-[#1C0D0A]">
                      Personalization & Payment
                    </h2>
                    <p className="text-xs text-[#7A6B72]">
                      Add cake piping text and pick your payment method.
                    </p>
                  </div>
                </div>

                {/* Cake Message */}
                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="cakeMessage" className="text-xs font-bold uppercase tracking-wider text-[#5C524E]">
                      Message to Pipe on Cake
                      <span className="text-[10px] lowercase text-[#7A6B72] font-normal ml-1.5">(optional)</span>
                    </label>
                    <span className="text-[10px] font-mono text-[#7A6B72]">
                      {cakeMessage.length}/60
                    </span>
                  </div>
                  <input
                    id="cakeMessage"
                    type="text"
                    maxLength={60}
                    placeholder="Name or celebration message to pipe on the cake"
                    value={cakeMessage}
                    onChange={(e) => setCakeMessage(e.target.value)}
                    className="w-full mt-1.5 px-4 py-3 rounded-2xl border border-[#E6DBCE] bg-[#FAF5EE]/40 text-sm font-semibold text-[#1C0D0A] focus:outline-none focus:border-[#802B52] focus:ring-2 focus:ring-[#802B52]/20"
                  />
                  <p className="text-[11px] text-[#7A6B72] mt-1">
                    Freshly piped on top of your cake in gourmet chocolate icing at no extra charge.
                  </p>
                </div>

                {/* Special Instructions */}
                <div>
                  <label htmlFor="specialInstructions" className="text-xs font-bold uppercase tracking-wider text-[#5C524E]">
                    Delivery Notes / Bakery Requests
                    <span className="text-[10px] lowercase text-[#7A6B72] font-normal ml-1.5">(optional)</span>
                  </label>
                  <textarea
                    id="specialInstructions"
                    rows={2}
                    maxLength={250}
                    placeholder="Any landmark details, candle count, knife requests, or gate instructions"
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    className="w-full mt-1.5 px-4 py-3 rounded-2xl border border-[#E6DBCE] bg-[#FAF5EE]/40 text-sm font-semibold text-[#1C0D0A] focus:outline-none focus:border-[#802B52] focus:ring-2 focus:ring-[#802B52]/20 resize-none"
                  />
                </div>

                {/* Payment Option Cards */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#5C524E] block">
                      Select Payment Method *
                    </label>
                    <span className="text-[11px] font-semibold text-[#802B52]">
                      5% GST (2.5% CGST + 2.5% SGST) applied
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Option A: Cash on Delivery (Strictly for orders >= ₹1,000) */}
                    <div
                      onClick={() => {
                        if (isCodEligible) {
                          setPaymentOption("COD");
                        } else {
                          showToast(
                            `Cash on Delivery is only available for purchases above ₹1,000. Current total is ₹${summary.subtotal}. Please pay online via UPI/GPay or add items worth ₹${codDiff} more.`,
                            "error"
                          );
                        }
                      }}
                      className={`p-4 rounded-2xl border-2 transition-all flex items-start gap-3.5 ${!isCodEligible
                        ? "opacity-60 bg-gray-50 border-gray-200 cursor-not-allowed"
                        : paymentOption === "COD"
                          ? "border-[#802B52] bg-[#802B52]/5 text-[#802B52] shadow-sm cursor-pointer"
                          : "border-[#E6DBCE] bg-white hover:border-[#802B52]/40 cursor-pointer"
                        }`}
                    >
                      <input
                        type="radio"
                        id="payment-cod"
                        name="paymentOption"
                        checked={paymentOption === "COD"}
                        disabled={!isCodEligible}
                        onChange={() => {
                          if (isCodEligible) setPaymentOption("COD");
                        }}
                        className="mt-1 accent-[#802B52] cursor-pointer disabled:cursor-not-allowed"
                      />
                      <label
                        htmlFor="payment-cod"
                        className={`space-y-1 ${isCodEligible ? "cursor-pointer" : "cursor-not-allowed"}`}
                      >
                        <div className="font-bold text-sm text-[#1C0D0A] flex flex-wrap items-center gap-2">
                          <span>Cash on Delivery</span>
                          {isCodEligible ? (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-extrabold uppercase">
                              Eligible
                            </span>
                          ) : (
                            <span className="bg-amber-100 text-amber-900 text-[10px] px-2 py-0.5 rounded-full font-bold">
                              Above ₹1,000 only
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#7A6B72] leading-relaxed">
                          {isCodEligible
                            ? "Pay cash or scan UPI when delivered at your doorstep."
                            : `Available only for orders above ₹1,000. Add ₹${codDiff} more to enable COD.`}
                        </p>
                      </label>
                    </div>

                    {/* Option B: Razorpay Online Payment (UPI, GPay, PhonePe, Cards) */}
                    <div
                      onClick={() => setPaymentOption("RAZORPAY")}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3.5 ${paymentOption === "RAZORPAY"
                        ? "border-[#802B52] bg-[#802B52]/5 text-[#802B52] shadow-sm"
                        : "border-[#E6DBCE] bg-white hover:border-[#802B52]/40"
                        }`}
                    >
                      <input
                        type="radio"
                        id="payment-rzp"
                        name="paymentOption"
                        checked={paymentOption === "RAZORPAY"}
                        onChange={() => setPaymentOption("RAZORPAY")}
                        className="mt-1 accent-[#802B52] cursor-pointer"
                      />
                      <label htmlFor="payment-rzp" className="cursor-pointer space-y-1">
                        <div className="font-bold text-sm text-[#1C0D0A] flex flex-wrap items-center gap-2">
                          <span>Pay Online (GPay / UPI / Cards)</span>
                          <span className="bg-purple-100 text-purple-800 text-[10px] px-2 py-0.5 rounded-full font-extrabold uppercase">
                            Recommended
                          </span>
                        </div>
                        <p className="text-xs text-[#7A6B72] leading-relaxed">
                          Instant payment via Google Pay, PhonePe, UPI apps, Credit/Debit cards & NetBanking.
                        </p>
                      </label>
                    </div>
                  </div>
                </div>
              </section>

            </div>

            {/* Right Column: Reassuring Sticky Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl border border-[#E6C184]/40 p-6 shadow-xl sticky top-24 space-y-5">

                <div className="flex items-center justify-between pb-3 border-b border-[#E6C184]/30">
                  <h2 className="font-display font-bold text-xl text-[#1C0D0A]">
                    Order Summary
                  </h2>
                  <span className="text-xs font-bold text-[#802B52] bg-[#802B52]/10 px-3 py-1 rounded-full">
                    {items.length} {items.length === 1 ? "Item" : "Items"}
                  </span>
                </div>

                {/* Items List */}
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div
                      key={`${item.id}__${item.weight}`}
                      className="p-3 bg-[#FAF5EE] rounded-2xl border border-[#E6DBCE] flex justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="font-bold text-[#1C0D0A]">{item.name}</div>
                        <div className="text-[11px] text-[#7A6B72] flex items-center gap-1.5">
                          <span>Weight: <strong>{item.weight}</strong></span>
                          <span>•</span>
                          <span className={item.eggPreference === "eggless" ? "text-emerald-700 font-bold" : "text-amber-700"}>
                            {item.eggPreference === "eggless" ? "Eggless" : "With Egg"}
                          </span>
                        </div>
                        {item.offer && (
                          <div className="inline-flex items-center px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-bold">
                            {item.offer}
                          </div>
                        )}
                        {item.cakeMessage && (
                          <div className="text-[10px] text-[#802B52] italic">
                            Message: &quot;{item.cakeMessage}&quot;
                          </div>
                        )}
                        <div className="text-[11px] text-[#5C524E]">
                          Qty: <strong>{item.quantity}</strong> × ₹{item.price}
                        </div>
                      </div>
                      <div className="font-extrabold text-[#802B52] text-sm self-center">
                        ₹{item.price * item.quantity}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Minimum Order Value Alert */}
                {!isMinOrderMet && (
                  <div className="bg-amber-50 border border-amber-300 p-3 rounded-2xl flex items-start gap-2 text-xs text-amber-900">
                    <span className="material-symbols-outlined text-amber-700 text-base shrink-0 mt-0.5">
                      info
                    </span>
                    <div className="space-y-0.5">
                      <p className="font-bold">Minimum Order Requirement: ₹300</p>
                      <p className="text-[11px] text-amber-800">
                        Current subtotal is <strong>₹{summary.subtotal}</strong>. Add{" "}
                        <strong>₹{minOrderDiff}</strong> more to place an order.
                      </p>
                    </div>
                  </div>
                )}

                {/* Price Breakdown */}
                <div className="space-y-2 text-sm text-[#5C524E] border-t border-[#E6C184]/30 pt-4">
                  <div className="flex justify-between">
                    <span>Items Subtotal</span>
                    <span className="font-semibold text-[#1C0D0A]">₹{summary.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-xs text-[#7A6B72]">
                    <span>SGST (2.5%)</span>
                    <span className="font-semibold text-[#1C0D0A]">₹{summary.sgst}</span>
                  </div>
                  <div className="flex justify-between text-xs text-[#7A6B72]">
                    <span>CGST (2.5%)</span>
                    <span className="font-semibold text-[#1C0D0A]">₹{summary.cgst}</span>
                  </div>
                  <div className="flex justify-between text-xs text-[#7A6B72]">
                    <span>Total GST (5%)</span>
                    <span>₹{summary.tax}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span>Delivery Charge</span>
                    <span className="text-[#802B52] font-semibold text-right">₹5 / km (at delivery)</span>
                  </div>
                </div>

                {/* Total */}
                <div className="border-t border-[#E6C184]/40 pt-4 flex justify-between items-baseline">
                  <div>
                    <span className="font-display font-bold text-lg text-[#1C0D0A] block">
                      Total Payable
                    </span>
                    <span className="text-[11px] text-[#7A6B72]">Inclusive of 5% GST</span>
                  </div>
                  <span className="font-display font-extrabold text-3xl text-[#802B52]">
                    ₹{summary.total}
                  </span>
                </div>

                {/* Submit Order Action */}
                <button
                  type="button"
                  onClick={handleSubmitOrder}
                  disabled={submitting || !isMinOrderMet}
                  className={`w-full py-4 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all ${!isMinOrderMet
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed hover:bg-gray-300"
                    : "bg-[#250527] hover:bg-[#4A0E4E] text-white cursor-pointer"
                    } disabled:opacity-60`}
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Placing Your Order...</span>
                    </>
                  ) : !isMinOrderMet ? (
                    <span>Minimum Order ₹300 (Add ₹{minOrderDiff} more)</span>
                  ) : paymentOption === "COD" ? (
                    <>
                      <span>Confirm & Place Order (COD)</span>
                      <span className="material-symbols-outlined text-base">check_circle</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-base">lock</span>
                      <span>Pay ₹{summary.total} via Razorpay (GPay/Cards)</span>
                    </>
                  )}
                </button>

                {/* Lollipop Bakery Order Rules Box */}
                <div className="bg-[#FAF5EE] p-3 rounded-2xl border border-[#E6DBCE] space-y-1 text-[11px] text-[#7A6B72]">
                  <div className="flex items-center gap-1.5 font-bold text-[#1C0D0A]">
                    <span className="material-symbols-outlined text-sm text-[#802B52]">verified</span>
                    <span>Bakery Order Requirements:</span>
                  </div>
                  <p>&bull; <strong>Minimum Order:</strong> ₹300 across all orders (COD & GPay).</p>
                  <p>&bull; <strong>Cash on Delivery:</strong> Applicable for orders above ₹1,000.</p>
                  <p>&bull; <strong>GST:</strong> 2.5% CGST + 2.5% SGST applied to all types of payments.</p>
                </div>

                {/* Trust Signals */}
                <div className="space-y-2 pt-2 border-t border-[#E6C184]/20 text-[11px] text-[#7A6B72]">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base text-emerald-600">verified</span>
                    <span>Instant PDF Invoice & Handoff OTP via Email</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base text-[#802B52]">lock</span>
                    <span>100% Secure Checkout & Data Privacy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base text-amber-600">cookie</span>
                    <span>Artisanal Cake Baked Fresh for Your Time Slot</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* Mobile Sticky Action Bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#E6C184]/40 p-4 z-40 shadow-2xl flex items-center justify-between gap-4">
          <div>
            <div className="text-[10px] uppercase font-bold text-[#7A6B72]">Grand Total</div>
            <div className="font-display font-extrabold text-xl text-[#802B52]">₹{summary.total}</div>
          </div>
          <button
            type="button"
            onClick={handleSubmitOrder}
            disabled={submitting || !isMinOrderMet}
            className={`flex-1 py-3.5 px-4 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all ${!isMinOrderMet
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-[#250527] hover:bg-[#4A0E4E] text-white cursor-pointer"
              }`}
          >
            {submitting
              ? "Placing..."
              : !isMinOrderMet
                ? `Min Order ₹300`
                : paymentOption === "COD"
                  ? "Place Order (COD)"
                  : `Pay ₹${summary.total} (GPay)`}
          </button>
        </div>

      </div>
    </>
  );
}
