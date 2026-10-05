"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/types";
import { useCart } from "@/components/cart/CartProvider";

import { is1kgFreeOfferVariant } from "@/lib/products";
import { getProductCardImage } from "@/lib/dummy-images";

export default function CakeCardInteractive({
  product,
  animDelay = 0,
}: {
  product: Product;
  animDelay?: number;
}) {
  const { addItem } = useCart();
  const [eggPreference, setEggPreference] = useState<"egg" | "eggless">(
    product.isEggless !== undefined ? (product.isEggless ? "eggless" : "egg") : "egg"
  );
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

  const [selectedWeightIdx, setSelectedWeightIdx] = useState(() => {
    const vars =
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
    const halfKgIdx = vars.findIndex(
      (v) =>
        v.weight.toLowerCase().includes("0.5") ||
        v.weight.toLowerCase().includes("500") ||
        v.weight.toLowerCase().includes("1/2") ||
        v.weight.toLowerCase().includes("half")
    );
    return halfKgIdx !== -1 ? halfKgIdx : 0;
  });

  const currentVariant = variants[selectedWeightIdx] || variants[0];
  const price = currentVariant.price;
  const rawOffer = currentVariant.offer || "";

  // The 1kg + 1/2kg free offer is active ONLY for egg cakes ("With Egg")
  const isVariantOffer = is1kgFreeOfferVariant(currentVariant) || Boolean(rawOffer);
  const showOfferTag = eggPreference === "egg" && isVariantOffer;

  const cardImage = getProductCardImage(product);

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      id: `${product.id}${eggPreference === "eggless" ? "-eggless" : ""}`,
      name: product.name,
      image: cardImage,
      weight: currentVariant.weight,
      price: price,
      quantity: 1,
      eggPreference: eggPreference,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1200);
  }

  return (
    <div
      className="product-card group relative bg-white border border-[#F1E6DF] rounded-2xl p-2.5 sm:p-3 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between h-full font-sans"
      style={{ animationDelay: `${animDelay}s` }}
      data-id={product.id}
    >
      <div className="relative aspect-square overflow-hidden bg-[#FAF5F0] rounded-xl border border-[#E6C184]/20 p-2 group-hover:border-[#962854]/40 transition-colors mb-2.5">
        <Link href={`/products/${product.id}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cardImage}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/images/hero_cake.png";
            }}
          />
        </Link>
      </div>

      <div className="pt-2 px-1 flex flex-col flex-grow">
        {/* SubCategory Tag & Offer Badge */}
        <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1">
          <span className="text-[10px] font-bold text-[#962854] bg-[#FAF0F2] px-2 py-0.5 rounded-full font-sans">
            {product.subCategory || product.categoryName || "Special"}
          </span>
          {showOfferTag && (
            <span className="text-[9.5px] font-extrabold text-white bg-[#962854] px-2 py-0.5 rounded-full shadow-xs animate-pulse font-sans">
              🎁 1kg + 1/2kg Free
            </span>
          )}
        </div>

        {/* Title */}
        <Link href={`/products/${product.id}`}>
          <h3 className="font-sans font-bold text-sm sm:text-base text-[#1C0D0A] mb-1 group-hover:text-[#962854] transition-colors leading-snug line-clamp-2 text-left">
            {product.name}
          </h3>
        </Link>

        {/* Product Description */}
        <p className="product-card-desc font-sans text-xs text-[#5C524E] line-clamp-2 mb-2.5 leading-relaxed font-normal text-left">
          {product.description}
        </p>

        {/* Weight Selector Label & Dynamic Side Info */}
        <div className="flex items-center justify-between mb-1.5 font-sans">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#5C524E] text-left font-sans">
            Select Weight
          </p>
          <div className="card-side-info text-[9.5px] font-bold">
            {showOfferTag ? (
              <span className="text-[#962854] bg-[#FAF0F2] border border-[#962854]/30 px-2 py-0.5 rounded-full inline-flex items-center gap-0.5 font-sans">
                {rawOffer || "1/2kg Free Offer"}
              </span>
            ) : eggPreference === "eggless" ? (
              <span className="text-[#962854] bg-[#FAF0F2] border border-[#962854]/30 px-2 py-0.5 rounded-md inline-flex items-center gap-0.5 font-sans">
                🕒 Order 1 Day Prior
              </span>
            ) : null}
          </div>
        </div>

        {/* Weight Selector Pills */}
        <div className="flex flex-wrap gap-1.5 mb-2.5 weight-selector font-sans">
          {variants.map((v, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedWeightIdx(idx)}
              className={`weight-btn font-sans ${selectedWeightIdx === idx ? "sel" : ""}`}
              data-price={v.price}
              data-orig={v.originalPrice}
              data-offer={v.offer || ""}
              suppressHydrationWarning
            >
              {v.weight}
            </button>
          ))}
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-2.5 font-sans text-left">
          <span className="price-display font-sans font-extrabold text-base sm:text-lg text-[#962854]">
            ₹{price}
          </span>
        </div>

        <div className="flex-grow" />

        {/* Egg Preference Section (Available for all cake categories) */}
        {product.egglessAvailable !== false && (
          <div className="mt-2 font-sans">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#5C524E] mb-1.5 text-left font-sans">
              Egg Preference
            </p>
            <div className="flex gap-1.5 items-center">
              <button
                type="button"
                onClick={() => setEggPreference("egg")}
                className={`egg-toggle-btn font-sans ${
                  eggPreference === "egg" ? "sel-egg" : ""
                }`}
                suppressHydrationWarning
              >
                With Egg
              </button>
              <button
                type="button"
                onClick={() => setEggPreference("eggless")}
                className={`egg-toggle-btn font-sans ${
                  eggPreference === "eggless" ? "sel-eggless" : ""
                }`}
                suppressHydrationWarning
              >
                Eggless
              </button>
            </div>
            {eggPreference === "eggless" && (
              <p className="text-[10px] text-[#962854] font-semibold mt-1.5 flex items-center gap-1 font-sans">
                <span>ℹ️ For eggless cakes, you need to order 1 day prior.</span>
              </p>
            )}
          </div>
        )}

        {/* Card Footer: View Details & Add to Cart */}
        <div className="flex items-center justify-between mt-auto pt-2.5 border-t border-[#F1E6DF] font-sans">
          <Link
            href={`/products/${product.id}`}
            className="text-xs font-semibold text-[#5C524E] hover:text-[#962854] flex items-center gap-0.5 transition-colors group/link font-sans"
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
            } text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-1 shadow-xs hover:shadow-sm hover:scale-105 active:scale-95 font-sans`}
            suppressHydrationWarning
          >
            {isAdded ? (
              <>
                <span className="material-symbols-outlined text-xs">check</span>{" "}
                Added
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-xs">
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
