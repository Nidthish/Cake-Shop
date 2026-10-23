"use client";

/* eslint-disable @next/next/no-img-element */

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/CartProvider";
import { useToast } from "@/components/common/ToastProvider";

export default function CartPage() {
  const { items, summary, updateQuantity, removeItem, isHydrated } = useCart();
  const { showToast } = useToast();
  const router = useRouter();

  // Helper date calculations
  const todayStr = useMemo(() => {
    const d = new Date();
    return d.toISOString().split("T")[0];
  }, []);

  const tomorrowStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  }, []);

  const egglessItems = useMemo(
    () => items.filter((i) => i.eggPreference === "eggless"),
    [items]
  );
  const hasEggless = egglessItems.length > 0;

  // Selected date defaults to tomorrow if eggless cakes present
  const [selectedDate, setSelectedDate] = useState<string>(
    hasEggless ? tomorrowStr : todayStr
  );
  const [showTodayError, setShowTodayError] = useState<boolean>(false);

  const minAllowedDate = hasEggless ? tomorrowStr : todayStr;
  const isMinOrderMet = summary.subtotal >= 300;
  const minOrderDiff = Math.max(0, 300 - summary.subtotal);

  function handleDateChange(newDate: string) {
    if (hasEggless && newDate === todayStr) {
      setShowTodayError(true);
      setSelectedDate(tomorrowStr);
      showToast(
        `Eggless cake delivery is not available today. Please select tomorrow or a later date.`,
        "error"
      );
    } else {
      setShowTodayError(false);
      setSelectedDate(newDate);
    }
  }

  function handleProceedToCheckout() {
    if (!isMinOrderMet) {
      showToast(
        `Minimum order amount is ₹300. Please add ₹${minOrderDiff} more of our fresh bakery items to proceed.`,
        "error"
      );
      return;
    }
    if (hasEggless && selectedDate === todayStr) {
      setShowTodayError(true);
      showToast(
        `For eggless cakes, you need to select a delivery date at least one day after today.`,
        "error"
      );
      return;
    }
    router.push("/checkout");
  }

  if (!isHydrated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-[#E6C184]/20 rounded w-1/3 mx-auto" />
          <div className="h-32 bg-[#E6C184]/10 rounded-3xl w-2/3 mx-auto" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full relative z-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1C0D0A] tracking-tight">
            Your Shopping Cart
          </h1>
          <span className="bg-[#FAF0F2] text-[#962854] text-[11px] font-bold tracking-wider uppercase px-3.5 py-1.5 rounded-full border border-[#962854]/30 shadow-xs">
            Handcrafted Fresh Daily
          </span>
        </div>

        <div className="bg-white p-12 rounded-3xl border border-[#F1E6DF] text-center space-y-4 shadow-sm max-w-3xl mx-auto">
          <span className="material-symbols-outlined text-6xl text-[#D8C3B3] inline-block">
            shopping_bag
          </span>
          <h2 className="font-display font-semibold text-2xl text-[#1C0D0A]">
            Your cart is empty
          </h2>
          <p className="text-sm text-[#4A3E39]">
            Explore our handcrafted signature cakes, pastries, and gourmet treats.
          </p>
          <Link
            href="/cakes"
            className="inline-block btn-primary text-xs uppercase tracking-wider py-3.5 px-8 mt-2 font-semibold"
          >
            Explore Bakery Catalog
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full relative z-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1C0D0A] tracking-tight">
          Your Shopping Cart
        </h1>
        <span className="bg-[#FAF0F2] text-[#962854] text-[11px] font-bold tracking-wider uppercase px-3.5 py-1.5 rounded-full border border-[#962854]/30 shadow-xs">
          Handcrafted Fresh Daily
        </span>
      </div>

      <div id="cart-content-layout" className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-4">
          {/* Eggless Warning Banner if eggless cakes present */}
          {hasEggless && (
            <div className="bg-[#FAF3EC] border border-[#D8C3B3] p-4 rounded-2xl flex items-start gap-3 shadow-xs">
              <span className="material-symbols-outlined text-[#962854] text-xl shrink-0 mt-0.5">
                schedule
              </span>
              <div className="text-xs text-[#2A082C] space-y-1">
                <p className="font-bold text-sm text-[#962854]">
                  Order 1 Day Prior Required for Eggless Cakes
                </p>
                <p>
                  You have selected eggless cake(s):{" "}
                  <span className="font-bold underline text-[#1C0D0A]">
                    {egglessItems.map((i) => i.name).join(", ")}
                  </span>
                  . For eggless cakes, you need to select a delivery date at least one day after today. Delivery for today is not possible.
                </p>
              </div>
            </div>
          )}

          <div id="cart-items-container" className="space-y-4">
            {items.map((item) => (
              <div
                key={`${item.id}__${item.weight}`}
                className="bg-white p-4 sm:p-6 rounded-2xl border border-[#F1E6DF] shadow-sm flex flex-col sm:flex-row items-center gap-4 sm:gap-6"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl border border-[#FAF3EC]"
                />
                <div className="flex-grow text-center sm:text-left space-y-1">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h3 className="font-display font-semibold text-lg text-[#1C0D0A] leading-snug">
                      {item.name}
                    </h3>
                    <span className="bg-[#FAF0F2] text-[#962854] text-[10px] font-semibold px-2 py-0.5 rounded-full">
                      Fresh Daily
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-[#5C524E]">
                    <span>Portion: <strong className="text-[#1C0D0A]">{item.weight}</strong></span>
                    {item.eggPreference && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.eggPreference === "eggless"
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : "bg-[#FAF3EC] text-[#1C0D0A] border border-[#D8C3B3]"
                        }`}>
                        {item.eggPreference === "eggless" ? "Eggless" : "With Egg"}
                      </span>
                    )}
                  </div>
                  {item.cakeMessage && (
                    <p className="text-xs text-[#802B52] italic">
                      Message: &quot;{item.cakeMessage}&quot;
                    </p>
                  )}
                  <div className="flex items-baseline gap-2">
                    <p className="font-sans font-semibold text-lg text-[#962854]">
                      ₹{item.price}
                    </p>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <span className="text-xs text-[#9C8B84] line-through">₹{item.originalPrice}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-[#1C0D0A]/20 rounded-lg bg-white px-2 py-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.weight, item.quantity - 1)}
                      className="px-2 font-semibold hover:text-[#962854]"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-3 font-semibold text-sm text-[#1C0D0A]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.weight, item.quantity + 1)}
                      className="px-2 font-semibold hover:text-[#962854]"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id, item.weight)}
                    className="p-2 text-[#5C524E] hover:text-red-600 transition-colors"
                    title="Remove Item"
                    aria-label="Remove Item"
                  >
                    <span className="material-symbols-outlined text-xl">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-4">
            <Link
              href="/cakes"
              className="btn-secondary text-xs uppercase tracking-wider py-3 px-6 flex items-center gap-2 font-bold"
            >
              <span className="material-symbols-outlined text-sm">west</span> CONTINUE SHOPPING
            </Link>
          </div>
        </div>

        {/* Price Summary & Delivery Schedule */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F1E6DF] shadow-lg space-y-6">
          <h2 className="font-display font-bold text-2xl text-[#1C0D0A] border-b border-[#F1E6DF] pb-4">
            Order Summary
          </h2>

          {/* Preferred Delivery Date Selector */}
          <div className="space-y-2 bg-[#FAF5F0] p-4 rounded-2xl border border-[#E6C184]/30">
            <label className="text-xs font-bold uppercase tracking-wider text-[#1C0D0A] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base text-[#962854]">calendar_month</span>
              Select Delivery Date
            </label>
            <input
              type="date"
              min={minAllowedDate}
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#E6C184]/50 bg-white text-xs font-bold text-[#1C0D0A] focus:outline-none focus:ring-2 focus:ring-[#962854]/30"
            />

            {hasEggless && (
              <div className="space-y-0.5">
                <p className="text-[10.5px] text-[#962854] font-semibold flex items-center gap-1">
                  <span>Minimum date for Eggless: Tomorrow ({tomorrowStr})</span>
                </p>
                <p className="text-[10px] text-[#802B52] font-semibold">
                  • Eggless deliveries start from 01:00 PM onwards (1:00 PM to 9:00 PM)
                </p>
              </div>
            )}

            {showTodayError && hasEggless && (
              <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-[11px] font-semibold space-y-1">
                <p>You selected eggless cake(s):</p>
                <p className="font-bold underline">
                  {egglessItems.map((i) => i.name).join(", ")}
                </p>
                <p className="text-red-700 font-normal">
                  For eggless cakes, you need to select a delivery date at least one day after today. Delivery today is not possible.
                </p>
              </div>
            )}
          </div>

          {/* Minimum Order Value Alert */}
          {!isMinOrderMet && (
            <div className="bg-amber-50 border border-amber-300 p-3.5 rounded-2xl flex items-start gap-2.5 text-xs text-amber-900">
              <span className="material-symbols-outlined text-amber-700 text-lg shrink-0 mt-0.5">
                info
              </span>
              <div className="space-y-0.5">
                <p className="font-bold">Minimum Order Requirement: ₹300</p>
                <p className="text-[11px] text-amber-800">
                  Current items subtotal is <strong>₹{summary.subtotal}</strong>. Please add{" "}
                  <strong>₹{minOrderDiff}</strong> more to your cart to proceed to checkout.
                </p>
              </div>
            </div>
          )}

          <div className="space-y-3 text-sm text-[#4A3E39]">
            <div className="flex justify-between items-center">
              <span className="font-normal text-[#5C524E]">Items Subtotal</span>
              <span className="font-bold text-[#1C0D0A]">₹{summary.subtotal}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#5C524E]">SGST (2.5%)</span>
              <span className="font-semibold text-[#1C0D0A]">₹{summary.sgst}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#5C524E]">CGST (2.5%)</span>
              <span className="font-semibold text-[#1C0D0A]">₹{summary.cgst}</span>
            </div>
            <div className="flex justify-between items-center text-xs text-[#7A6B72]">
              <span>Total GST (5%)</span>
              <span>₹{summary.tax}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#5C524E]">Doorstep Delivery</span>
              <span className="text-[#802B52] font-semibold text-right">₹5 / km (at delivery)</span>
            </div>
            <div className="border-t border-[#F1E6DF] pt-3 flex justify-between items-center text-base font-bold text-[#1C0D0A]">
              <div>
                <span>Total Price</span>
                <span className="block text-[11px] font-normal text-[#7A6B72]">Inclusive of 5% GST</span>
              </div>
              <span className="font-sans text-2xl font-bold text-[#962854]">₹{summary.total}</span>
            </div>
          </div>

          <button
            onClick={handleProceedToCheckout}
            disabled={!isMinOrderMet}
            className={`w-full py-4 text-xs uppercase tracking-wider font-bold shadow-xl flex items-center justify-center gap-2 rounded-2xl transition-all cursor-pointer ${isMinOrderMet
              ? "btn-primary"
              : "bg-gray-300 text-gray-600 cursor-not-allowed hover:bg-gray-300"
              }`}
          >
            {isMinOrderMet ? (
              <>
                <span>PROCEED TO CHECKOUT</span>
                <span className="material-symbols-outlined text-lg">east</span>
              </>
            ) : (
              <span>MINIMUM ORDER ₹300 (ADD ₹{minOrderDiff} MORE)</span>
            )}
          </button>

          {/* Bakery Order Guidelines */}
          <div className="bg-[#FAF5EE] p-3 rounded-xl border border-[#E6DBCE] space-y-1 text-[11px] text-[#7A6B72]">
            <div className="flex items-center gap-1.5 font-semibold text-[#1C0D0A]">
              <span className="material-symbols-outlined text-sm text-[#802B52]">verified</span>
              <span>Lollipop Bakery Order Rules:</span>
            </div>
            <p>&bull; <strong>Minimum Order:</strong> ₹300 applicable for all orders (COD & GPay).</p>
            <p>&bull; <strong>Doorstep Delivery:</strong> ₹5 per km from our bakery in Trichy, payable directly upon delivery.</p>
            <p>&bull; <strong>Cash on Delivery:</strong> Available for purchases above ₹1,000.</p>
            <p>&bull; <strong>GST:</strong> Standard 2.5% CGST + 2.5% SGST applied to all orders.</p>
          </div>
        </div>
      </div>
    </main>
  );
}

