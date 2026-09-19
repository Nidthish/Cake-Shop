"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/types";
import { useCart } from "@/components/cart/CartProvider";

export default function CakeCardInteractive({
  product,
  animDelay = 0,
}: {
  product: Product;
  animDelay?: number;
}) {
  const { addItem } = useCart();
  const [selectedWeightIdx, setSelectedWeightIdx] = useState(0);
  const [eggPreference, setEggPreference] = useState<"egg" | "eggless">("egg");
  const [isAdded, setIsAdded] = useState(false);

  const variants =
    product.variants && product.variants.length > 0
      ? product.variants
      : [
          {
            weight: "0.5kg",
            price: product.minPrice || 370,
            originalPrice: product.originalPrice,
            offer: "",
          },
        ];

  const currentVariant = variants[selectedWeightIdx] || variants[0];
  const price = currentVariant.price;
  const offer = currentVariant.offer || "";

  const is1kgOffer =
    currentVariant.weight.toLowerCase().includes("1kg") ||
    offer.toLowerCase().includes("1/2kg") ||
    offer.toLowerCase().includes("free");

  const effectiveEggPreference = is1kgOffer ? "egg" : eggPreference;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      id: `${product.id}${effectiveEggPreference === "eggless" ? "-eggless" : ""}`,
      name: product.name,
      image: product.image,
      weight: currentVariant.weight,
      price: price,
      quantity: 1,
      eggPreference: effectiveEggPreference,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1200);
  }



  return (
    <div
      className="cake-card p-2.5 sm:p-3"
      style={{ animationDelay: `${animDelay}s` }}
      data-id={product.id}
    >
      <div className="card-img relative rounded-xl border border-[#E6C184]/20 p-2 bg-[#FAF5F0]">
        <Link href={`/products/${product.id}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover rounded-lg"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/images/hero_cake.png";
            }}
          />
        </Link>
      </div>

      <div className="pt-2 px-1 flex flex-col flex-grow">
        {/* SubCategory Tag */}
        <div className="flex items-center justify-start mb-1.5">
          <span className="text-[10px] font-bold text-[#962854] bg-[#FAF0F2] px-2 py-0.5 rounded-full">
            {product.subCategory}
          </span>
        </div>

        {/* Title */}
        <Link href={`/products/${product.id}`}>
          <h3 className="font-sans font-bold text-sm sm:text-base text-[#1C0D0A] mb-1 hover:text-[#962854] transition-colors leading-snug line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Product Description */}
        <p className="product-card-desc font-sans text-xs text-[#5C524E] line-clamp-2 mb-2 leading-relaxed">
          {product.description}
        </p>

        {/* Weight Selector Label & Dynamic Side Info */}
        <div className="flex items-center justify-between mb-1.5 font-sans">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#5C524E]">
            Select Weight
          </p>
          <div className="card-side-info text-[9.5px] font-bold">
            {is1kgOffer ? (
              <span className="text-[#962854] bg-[#FAF0F2] border border-[#962854]/30 px-2 py-0.5 rounded-full inline-flex items-center gap-0.5">
                🎁 Special Offer
              </span>
            ) : effectiveEggPreference === "eggless" ? (
              <span className="text-[#2A082C] bg-[#FAF3EC] border border-[#D8C3B3] px-2 py-0.5 rounded-md inline-flex items-center gap-0.5 font-sans">
                🕒 1 Day Prior Order
              </span>
            ) : null}
          </div>
        </div>

        {/* Weight Selector Pills */}
        <div className="flex flex-wrap gap-1.5 mb-2 weight-selector">
          {variants.map((v, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedWeightIdx(idx)}
              className={`weight-btn ${selectedWeightIdx === idx ? "sel" : ""}`}
              data-price={v.price}
              data-orig={v.originalPrice}
              data-offer={v.offer || ""}
            >
              {v.weight}
            </button>
          ))}
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-2 font-sans">
          <span className="price-display font-sans font-extrabold text-base sm:text-lg text-[#962854]">
            ₹{price}
          </span>
        </div>

        <div className="flex-grow" />

        {/* Egg Preference Section */}
        <div className="mt-2 font-sans">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#5C524E] mb-1.5">
            Egg Preference
          </p>
          <div className="flex gap-1.5 items-center">
            <button
              type="button"
              onClick={() => setEggPreference("egg")}
              className={`egg-toggle-btn font-sans ${
                effectiveEggPreference === "egg" ? "sel-egg" : ""
              }`}
            >
              With Egg
            </button>
            {!is1kgOffer && (
              <button
                type="button"
                onClick={() => setEggPreference("eggless")}
                className={`egg-toggle-btn font-sans ${
                  effectiveEggPreference === "eggless" ? "sel-eggless" : ""
                }`}
              >
                Eggless
              </button>
            )}
          </div>
        </div>

        {/* Card Footer: View Details & Add to Cart */}
        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-[#F1E6DF] font-sans">
          <Link
            href={`/products/${product.id}`}
            className="text-xs font-semibold text-[#5C524E] hover:text-[#962854] flex items-center gap-0.5 transition-colors group/link"
          >
            View Details{" "}
            <span className="material-symbols-outlined text-xs transition-transform group-hover/link:translate-x-0.5">
              arrow_forward
            </span>
          </Link>
          <button
            type="button"
            onClick={handleAddToCart}
            className={`add-to-cart-btn ${
              isAdded ? "bg-[#2A082C]" : "bg-[#962854] hover:bg-[#2A082C]"
            } text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-1 shadow-xs hover:shadow-sm hover:-translate-y-0.5 active:scale-95 font-sans`}
          >
            {isAdded ? (
              <>
                <span className="material-symbols-outlined text-sm">check</span>{" "}
                Added
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-sm">
                  shopping_bag
                </span>{" "}
                Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
