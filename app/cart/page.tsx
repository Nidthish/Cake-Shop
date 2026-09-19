"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/CartProvider";

export default function CartPage() {
  const { items, summary, updateQuantity, removeItem, isHydrated } = useCart();
  const router = useRouter();

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
            ✨ Handcrafted Fresh Daily
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
          ✨ Handcrafted Fresh Daily
        </span>
      </div>

      <div id="cart-content-layout" className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-4">
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
                      ✨ Fresh Daily
                    </span>
                  </div>
                  <p className="text-xs text-[#5C524E]">
                    Portion: <span className="font-medium text-[#1C0D0A]">{item.weight}</span>
                  </p>
                  <p className="font-sans font-semibold text-lg text-[#962854]">
                    ₹{item.price}
                  </p>
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

        {/* Price Summary */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F1E6DF] shadow-lg space-y-6">
          <h2 className="font-display font-bold text-2xl text-[#1C0D0A] border-b border-[#F1E6DF] pb-4">
            Order Summary
          </h2>

          <div className="space-y-3 text-sm text-[#4A3E39]">
            <div className="flex justify-between items-center">
              <span className="font-normal text-[#5C524E]">Items Subtotal</span>
              <span className="font-bold text-[#1C0D0A]">₹{summary.subtotal}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-normal text-[#5C524E]">SGST &amp; CGST (2.5% + 2.5%)</span>
              <span className="font-bold text-[#1C0D0A]">₹{summary.tax}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-normal text-[#5C524E]">Doorstep Express Delivery</span>
              <span className="font-bold text-emerald-700">FREE</span>
            </div>
            <div className="border-t border-[#F1E6DF] pt-3 flex justify-between items-center text-base font-bold text-[#1C0D0A]">
              <span>Total Price</span>
              <span className="font-sans text-2xl font-bold text-[#962854]">₹{summary.total}</span>
            </div>
          </div>

          <button
            onClick={() => router.push("/checkout")}
            className="w-full btn-primary py-4 text-xs uppercase tracking-wider font-bold shadow-xl flex items-center justify-center gap-2"
          >
            PROCEED TO CHECKOUT <span className="material-symbols-outlined text-lg">east</span>
          </button>
        </div>
      </div>
    </main>
  );
}
