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
      <div className="flex-grow min-w-0">
        <p className="font-display font-bold text-base text-[#1C0D0A] truncate">{item.name}</p>
        <p className="text-xs text-[#5C524E]">
          {item.weight}
          {item.eggPreference ? ` · ${item.eggPreference === "eggless" ? "Eggless" : "With Egg"}` : ""}
        </p>
        <p className="font-bold text-sm text-[#1C0D0A] mt-1">₹{item.price}</p>
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
