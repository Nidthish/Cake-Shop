"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { useToast } from "@/components/common/ToastProvider";

const SPECIFIC_DELIVERY_TIMES = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
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
  "09:30 PM",
];

function tomorrow(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
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
  const [city, setCity] = useState("Tiruchirappalli");
  const [pincode, setPincode] = useState("");

  // Schedule State: Specific Delivery Time
  const [date, setDate] = useState(tomorrow());
  const [timeSlot, setTimeSlot] = useState(SPECIFIC_DELIVERY_TIMES[14]); // Default to 04:00 PM
  const [customTime, setCustomTime] = useState("");

  // Cake Customization State
  const [cakeMessage, setCakeMessage] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");

  // Payment Option: "COD" (Direct Order / Cash on Delivery) vs "RAZORPAY" (Online Payment)
  const [paymentOption, setPaymentOption] = useState<"COD" | "RAZORPAY">("COD");

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
    if (street.trim().length < 5) next.street = "Enter your complete delivery address.";
    if (city.trim().length < 2) next.city = "City is required.";
    if (!/^\d{6}$/.test(pincode.trim())) next.pincode = "Enter a valid 6-digit pincode.";
    if (hasEggless && date === todayStr) {
      next.date = "Delivery for today is not available for eggless cakes. Select tomorrow or later.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmitOrder() {
    if (items.length === 0) {
      showToast("Your cart is empty.", "error");
      return;
    }
    if (!validate()) {
      showToast("Please fill in all required delivery details.", "error");
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
              offer: i.offer,
            })),
            customer: { fullName, phone, email },
            address: { street, city, pincode },
            schedule: { date, timeSlot: finalDeliveryTime },
            cakeMessage,
            specialInstructions,
            paymentMethod: "COD",
          }),
        });

        const data = await res.json();
        if (data.success && data.orderId) {
          clearCart();
          showToast("Order placed successfully! Order confirmation email sent.", "success");
          router.push(`/order/success?orderId=${data.orderId}`);
        } else {
          showToast(data.error || "Could not place order. Please try again.", "error");
          setSubmitting(false);
        }
      } catch {
        showToast("Network error. Please try again.", "error");
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
            offer: i.offer,
          })),
          customer: { fullName, phone, email },
          address: { street, city, pincode },
          schedule: { date, timeSlot: finalDeliveryTime },
          cakeMessage,
          specialInstructions,
          idempotencyKey: idempotencyKey.current ?? undefined,
        }),
      });

      const data = await res.json();

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
            showToast("Payment cancelled.", "info");
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

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="w-20 h-20 bg-[#802B52]/10 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl text-[#802B52]">
          <span className="material-symbols-outlined text-4xl">cake</span>
        </div>
        <h1 className="font-display font-bold text-3xl text-[#1C0D0A] mb-3">Your Cart is Empty</h1>
        <p className="text-[#5C524E] mb-8">Add something delicious to your cart to proceed with ordering.</p>
        <Link href="/cakes" className="btn-primary inline-flex items-center gap-2 py-3.5 px-8 text-xs font-bold uppercase tracking-wider">
          Explore Cake Catalog
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

      <div className="bg-[#FAF5EE] min-h-screen py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <span className="material-symbols-outlined text-3xl text-[#802B52]">shopping_bag</span>
            <div>
              <h1 className="font-display font-bold text-3xl sm:text-4xl text-[#1C0D0A]">
                Checkout &amp; Order Placement
              </h1>
              <p className="text-xs text-[#7A6B72]">
                Complete your details below to confirm your fresh artisanal cake delivery.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Form Sections */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* SECTION 1: Customer Contact Details */}
              <section className="bg-white rounded-2xl border border-[#E6C184]/40 p-6 shadow-sm">
                <div className="flex items-center gap-2.5 mb-4 text-[#802B52]">
                  <span className="material-symbols-outlined text-xl">person</span>
                  <h2 className="font-display font-bold text-lg text-[#1C0D0A]">
                    Customer Contact Details
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#5C524E]">
                      Full Name *
                    </label>
                    <input
                      placeholder="e.g. Nidthish Selvam"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-[#E6C184]/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#802B52]/30"
                    />
                    {errors.fullName && <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>}
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#5C524E]">
                      Mobile Phone (for delivery updates) *
                    </label>
                    <input
                      placeholder="e.g. 9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      maxLength={10}
                      className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-[#E6C184]/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#802B52]/30"
                    />
                    {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#5C524E]">
                      Email Address (for instant receipt email) *
                    </label>
                    <input
                      placeholder="e.g. nidthishselvam@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-[#E6C184]/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#802B52]/30"
                    />
                    {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
                  </div>
                </div>
              </section>

              {/* SECTION 2: Delivery Address */}
              <section className="bg-white rounded-2xl border border-[#E6C184]/40 p-6 shadow-sm">
                <div className="flex items-center gap-2.5 mb-4 text-[#802B52]">
                  <span className="material-symbols-outlined text-xl">location_on</span>
                  <h2 className="font-display font-bold text-lg text-[#1C0D0A]">
                    Delivery Address
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#5C524E]">
                      Street Address &amp; Door No. *
                    </label>
                    <input
                      placeholder="e.g. No. 14, Main Road, Sanjeevi Nagar"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-[#E6C184]/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#802B52]/30"
                    />
                    {errors.street && <p className="text-xs text-red-600 mt-1">{errors.street}</p>}
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#5C524E]">
                      City *
                    </label>
                    <input
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-[#E6C184]/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#802B52]/30"
                    />
                    {errors.city && <p className="text-xs text-red-600 mt-1">{errors.city}</p>}
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#5C524E]">
                      Pincode *
                    </label>
                    <input
                      placeholder="e.g. 620002"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      maxLength={6}
                      className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-[#E6C184]/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#802B52]/30"
                    />
                    {errors.pincode && <p className="text-xs text-red-600 mt-1">{errors.pincode}</p>}
                  </div>
                </div>
              </section>

              {/* SECTION 3: Delivery Schedule & Time Slot */}
              <section className="bg-white rounded-2xl border border-[#E6C184]/40 p-6 shadow-sm">
                <div className="flex items-center gap-2.5 mb-4 text-[#802B52]">
                  <span className="material-symbols-outlined text-xl">schedule</span>
                  <h2 className="font-display font-bold text-lg text-[#1C0D0A]">
                    Delivery Date &amp; Time Slot
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#5C524E]">
                      Select Delivery Date *
                    </label>
                    <input
                      type="date"
                      min={minDate}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-[#E6C184]/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#802B52]/30"
                    />
                    {errors.date && <p className="text-xs text-red-600 mt-1">{errors.date}</p>}
                    {hasEggless && (
                      <p className="text-[11px] text-[#802B52] font-semibold mt-1.5 flex items-center gap-1">
                        Eggless items require 1 day prior notice.
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#5C524E]">
                      Specific Delivery Time *
                    </label>
                    <select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-[#E6C184]/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#802B52]/30 bg-white font-medium text-[#1C0D0A]"
                    >
                      {SPECIFIC_DELIVERY_TIMES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                      <option value="CUSTOM">Custom Exact Time...</option>
                    </select>
                    {timeSlot === "CUSTOM" && (
                      <div className="mt-2">
                        <label className="text-[11px] font-bold text-[#802B52] block mb-1">
                          Enter Specific Delivery Time:
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 05:45 PM"
                          value={customTime}
                          onChange={(e) => setCustomTime(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl border border-[#802B52]/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#802B52]/30 bg-white"
                        />
                      </div>
                    )}
                    <p className="text-[11px] text-[#7A6B72] mt-1">
                      Choose an exact delivery time for your fresh cake delivery.
                    </p>
                  </div>
                </div>
              </section>

              {/* SECTION 4: Cake Customization & Bakery Instructions */}
              <section className="bg-white rounded-2xl border border-[#E6C184]/40 p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2.5 text-[#802B52]">
                  <span className="material-symbols-outlined text-xl">edit_note</span>
                  <h2 className="font-display font-bold text-lg text-[#1C0D0A]">
                    Cake Personalization &amp; Special Notes
                  </h2>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#5C524E]">
                    Message to Write on Cake (Optional)
                  </label>
                  <input
                    placeholder='e.g. "Happy 25th Birthday Ananya!"'
                    value={cakeMessage}
                    onChange={(e) => setCakeMessage(e.target.value)}
                    maxLength={60}
                    className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-[#E6C184]/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#802B52]/30"
                  />
                  <p className="text-[11px] text-[#7A6B72] mt-1">
                    This message will be piped in fresh chocolate icing on your cake.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#5C524E]">
                    Special Bakery &amp; Delivery Instructions (Optional)
                  </label>
                  <textarea
                    placeholder="e.g. Please include 5 candles & knife. Less cream, extra chocolate drizzle."
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    rows={2}
                    className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-[#E6C184]/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#802B52]/30"
                  />
                </div>
              </section>

              {/* SECTION 5: Payment Method Selection */}
              <section className="bg-white rounded-2xl border border-[#E6C184]/40 p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2.5 text-[#802B52]">
                  <span className="material-symbols-outlined text-xl">credit_card</span>
                  <h2 className="font-display font-bold text-lg text-[#1C0D0A]">
                    Select Payment Method
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Option A: Cash on Delivery / Direct Order */}
                  <label
                    onClick={() => setPaymentOption("COD")}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3.5 ${
                      paymentOption === "COD"
                        ? "border-[#802B52] bg-[#802B52]/5 text-[#802B52]"
                        : "border-[#E6C184]/40 bg-white hover:border-[#802B52]/40"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentOption"
                      checked={paymentOption === "COD"}
                      onChange={() => setPaymentOption("COD")}
                      className="mt-1 accent-[#802B52]"
                    />
                    <div>
                      <div className="font-bold text-sm text-[#1C0D0A] flex items-center gap-2">
                        Direct Order / Cash on Delivery
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded font-extrabold uppercase">
                          Instant
                        </span>
                      </div>
                      <p className="text-xs text-[#7A6B72] mt-1 leading-relaxed">
                        No online payment required now! Pay cash or UPI when your cake is delivered to your doorstep.
                      </p>
                    </div>
                  </label>

                  {/* Option B: Razorpay Online Payment */}
                  <label
                    onClick={() => setPaymentOption("RAZORPAY")}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3.5 ${
                      paymentOption === "RAZORPAY"
                        ? "border-[#802B52] bg-[#802B52]/5 text-[#802B52]"
                        : "border-[#E6C184]/40 bg-white hover:border-[#802B52]/40"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentOption"
                      checked={paymentOption === "RAZORPAY"}
                      onChange={() => setPaymentOption("RAZORPAY")}
                      className="mt-1 accent-[#802B52]"
                    />
                    <div>
                      <div className="font-bold text-sm text-[#1C0D0A] flex items-center gap-2">
                        Pay Online (Razorpay)
                      </div>
                      <p className="text-xs text-[#7A6B72] mt-1 leading-relaxed">
                        Pay securely using GPay, PhonePe, Paytm, Credit/Debit Cards, or NetBanking.
                      </p>
                    </div>
                  </label>
                </div>
              </section>

            </div>

            {/* Right Column: Order Summary & Placement Button */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-[#E6C184]/40 p-6 shadow-lg sticky top-28 space-y-5">
                <h2 className="font-display font-bold text-xl text-[#1C0D0A] border-b border-[#E6C184]/30 pb-3 flex items-center justify-between">
                  <span>Order Summary</span>
                  <span className="text-xs font-bold text-[#802B52] bg-[#802B52]/10 px-2.5 py-1 rounded-full">
                    {items.length} {items.length === 1 ? "Item" : "Items"}
                  </span>
                </h2>

                {/* Cart Items List */}
                <div className="space-y-3.5 max-h-60 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div
                      key={`${item.id}__${item.weight}`}
                      className="p-3 bg-[#FAF5EE] rounded-xl border border-[#E6DBCE] flex justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="font-bold text-[#1C0D0A]">{item.name}</div>
                        <div className="text-[11px] text-[#7A6B72] flex items-center gap-1.5">
                          <span>Variant: <strong>{item.weight}</strong></span>
                          <span>•</span>
                          <span className={item.eggPreference === "eggless" ? "text-emerald-700 font-bold" : "text-amber-700"}>
                            {item.eggPreference === "eggless" ? "Eggless" : "With Egg"}
                          </span>
                        </div>
                        {item.offer && (
                          <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-100 border border-amber-300 text-amber-900 text-[10px] font-bold">
                            <span>🎁</span> {item.offer}
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

                {/* Price Breakdown */}
                <div className="space-y-2 text-sm text-[#5C524E] border-t border-[#E6C184]/30 pt-4">
                  <div className="flex justify-between">
                    <span>Items Subtotal</span>
                    <span className="font-semibold text-[#1C0D0A]">₹{summary.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-xs text-[#7A6B72]">
                    <span>SGST (2.5%)</span>
                    <span>₹{summary.sgst}</span>
                  </div>
                  <div className="flex justify-between text-xs text-[#7A6B72]">
                    <span>CGST (2.5%)</span>
                    <span>₹{summary.cgst}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span className="text-emerald-600 font-bold">FREE</span>
                  </div>
                </div>

                <div className="border-t border-[#E6C184]/40 pt-4 flex justify-between items-baseline">
                  <span className="font-display font-bold text-lg text-[#1C0D0A]">Grand Total</span>
                  <span className="font-display font-extrabold text-2xl text-[#802B52]">
                    ₹{summary.total}
                  </span>
                </div>

                {/* Submission Button */}
                <button
                  onClick={handleSubmitOrder}
                  disabled={submitting}
                  className="btn-primary w-full py-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl hover:shadow-pink-900/30 transition-all cursor-pointer disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing Order...
                    </>
                  ) : paymentOption === "COD" ? (
                    <>
                      Place Order Instantly (COD)
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-base">lock</span> Pay ₹{summary.total} via Razorpay
                    </>
                  )}
                </button>

                <div className="p-3 bg-[#FAF5EE] rounded-xl border border-[#E6DBCE] text-[11px] text-[#7A6B72] text-center space-y-1">
                  <p className="font-bold text-[#802B52]">
                    Instant Email Confirmation
                  </p>
                  <p>
                    An official PDF tax invoice receipt with product delivery time slot and OTP will be dispatched to <strong>{email || "your email"}</strong> immediately upon order placement.
                  </p>
                </div>

                <div className="text-[10px] text-[#9C8B84] text-center">
                  By placing your order, you agree to our{" "}
                  <Link href="/terms-and-conditions" target="_blank" className="text-[#802B52] underline">
                    Terms
                  </Link>{" "}
                  &amp;{" "}
                  <Link href="/privacy-policy" target="_blank" className="text-[#802B52] underline">
                    Privacy Policy
                  </Link>
                  .
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
