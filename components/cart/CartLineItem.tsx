"use client";

import type { CartItem } from "@/types";
import { useCart } from "@/components/cart/CartProvider";

export default function CartLineItem({ item }: { item: CartItem }) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex items-center gap-4 py-5 border-b border-[#E6C184]/20">
      <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#F1E6DF] flex-shrink-0">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/images/hero_cake.png";
          }}
        />
      </div>
      <div className="flex-grow min-w-0 space-y-1">
        <p className="font-display font-bold text-base text-[#1C0D0A] truncate">{item.name}</p>
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#5C524E]">
          <span>Weight: <strong>{item.weight}</strong></span>
          {item.eggPreference && (
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                item.eggPreference === "eggless"
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                  : "bg-amber-100 text-amber-900 border border-amber-200"
              }`}
            >
              {item.eggPreference === "eggless" ? "🌱 Eggless" : "🥚 With Egg"}
            </span>
          )}
        </div>
        {item.offer && (
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold">
            <span>🎁</span> {item.offer}
          </div>
        )}
        {item.cakeMessage && (
          <p className="text-[11px] text-[#802B52] italic">
            🎂 Message: &quot;{item.cakeMessage}&quot;
          </p>
        )}
        <div className="flex items-baseline gap-2 pt-0.5">
          <span className="font-bold text-sm text-[#962854]">₹{item.price}</span>
          {item.originalPrice && item.originalPrice > item.price && (
            <span className="text-xs text-[#9C8B84] line-through">₹{item.originalPrice}</span>
          )}
        </div>
      </div>
      <div className="flex items-center border border-[#E6C184]/40 rounded-xl overflow-hidden flex-shrink-0">
        <button
          onClick={() => updateQuantity(item.id, item.weight, item.quantity - 1)}
          className="w-8 h-8 flex items-center justify-center text-[#1C0D0A] hover:bg-[#FAF3EC]"
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item.id, item.weight, item.quantity + 1)}
          className="w-8 h-8 flex items-center justify-center text-[#1C0D0A] hover:bg-[#FAF3EC]"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
      <button
        onClick={() => removeItem(item.id, item.weight)}
        className="p-2 text-[#9C8B84] hover:text-[#962854] flex-shrink-0"
        aria-label="Remove item"
      >
        <span className="material-symbols-outlined text-xl">delete</span>
      </button>
    </div>
  );
}
