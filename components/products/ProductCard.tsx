"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/types";
import { getCardPrice } from "@/lib/products";
import { useCart } from "@/components/cart/CartProvider";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [addedToast, setAddedToast] = useState(false);

  const price = getCardPrice(product);
  const isEggless = product.egglessAvailable !== false;
  const weight = product.variants?.[0]?.weight || "500g";

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      image: product.image,
      weight: weight,
      price: price,
      quantity: 1,
      eggPreference: isEggless ? "eggless" : "egg",
    });
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 1800);
  }

  return (
    <div className="product-card group relative bg-white border border-[#F1E6DF] rounded-2xl p-2.5 sm:p-3 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between h-full">
      <Link
        href={`/products/${product.id}`}
        className="block relative aspect-square overflow-hidden bg-[#FAF5F0] rounded-xl border border-[#E6C184]/20 p-2 group-hover:border-[#962854]/40 transition-colors"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/images/hero_cake.png";
          }}
        />

        {product.badge && (
          <div className="absolute top-2 left-2 z-10 pointer-events-none">
            <span className="bg-[#962854] text-white text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-xs">
              {product.badge}
            </span>
          </div>
        )}
      </Link>

      <div className="pt-2.5 px-1 flex flex-col flex-grow justify-between">
        <div>
          <div className="flex items-center gap-1 text-[#B99A62] text-[11px] mb-1 font-sans">
            <span className="material-symbols-outlined text-xs font-fill">star</span>
            <span className="font-bold text-[#1C0D0A]">{product.rating}</span>
            <span className="text-[#8C7E77]">({product.reviewCount})</span>
          </div>

          <Link href={`/products/${product.id}`}>
            <h3
              className="font-sans text-sm sm:text-base font-bold text-[#1C0D0A] group-hover:text-[#962854] transition-colors leading-snug line-clamp-2 mb-1"
              title={product.name}
            >
              {product.name}
            </h3>
          </Link>
          <p className="text-[11px] text-[#5C524E] line-clamp-2 mb-2.5 leading-relaxed font-normal">
            {product.description}
          </p>
        </div>

        <div className="pt-2 border-t border-[#F1E6DF] flex items-center justify-between mt-auto gap-1">
          <div className="flex items-baseline gap-1">
            <span className="text-sm sm:text-base font-extrabold text-[#962854] font-sans">
              ₹{price}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className={`btn-pink-cart flex items-center gap-1 text-[11px] sm:text-xs font-bold px-3 py-1.5 rounded-lg transition-all duration-200 shadow-xs hover:shadow-sm hover:scale-105 active:scale-95 ${
              addedToast ? "bg-[#2A082C] text-white" : "bg-[#962854] text-white hover:bg-[#2A082C]"
            }`}
          >
            {addedToast ? (
              <>
                <span className="material-symbols-outlined text-xs">check</span> Added
              </>
            ) : (
              <>
                Add <span className="material-symbols-outlined text-xs">add_shopping_cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
