"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/types";
import { useCart } from "@/components/cart/CartProvider";
import { useToast } from "@/components/common/ToastProvider";
import ProductCard from "@/components/products/ProductCard";

export default function ProductDetailClient({
  product,
  similar,
}: {
  product: Product;
  similar: Product[];
}) {
  const { addItem } = useCart();
  const { showToast } = useToast();
  const router = useRouter();

  const variants = product.variants?.length
    ? product.variants
    : [{ weight: "Regular", price: product.price ?? product.minPrice ?? 0 }];

  const [variantIdx, setVariantIdx] = useState(0);
  const [eggless, setEggless] = useState<boolean>(!!product.egglessAvailable);
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState<"description" | "ingredients">("description");

  const variant = variants[variantIdx];
  const price = variant.price;
  const originalPrice = variant.originalPrice;
  const hasDiscount = Boolean(originalPrice && originalPrice > price);

  const rating = useMemo(() => Math.round(product.rating * 10) / 10, [product.rating]);

  function handleAddToCart() {
    addItem({
      id: product.id,
      name: product.name,
      image: product.image,
      weight: variant.weight,
      price,
      quantity,
      eggPreference: product.egglessAvailable ? (eggless ? "eggless" : "egg") : undefined,
    });
    showToast(`${product.name} added to cart`, "success");
  }

  function handleBuyNow() {
    handleAddToCart();
    router.push("/cart");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
        {/* Gallery */}
        <div>
          <div className="rounded-3xl overflow-hidden bg-[#F1E6DF] aspect-square shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Purchase panel */}
        <div className="flex flex-col">
          {product.badge && (
            <span className="self-start bg-[#962854] text-white text-[10px] font-bold uppercase tracking-wide px-3 py-1 rounded-full mb-3">
              {product.badge}
            </span>
          )}
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-[#1C0D0A] leading-tight mb-2">
            {product.name}
          </h1>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-0.5 text-[#E6C184]">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className="material-symbols-outlined text-base" style={{ fontVariationSettings: i < Math.round(rating) ? "'FILL' 1" : "'FILL' 0" }}>
                  star
                </span>
              ))}
            </div>
            <span className="text-xs text-[#5C524E] font-medium">
              {rating} ({product.reviewCount} reviews)
            </span>
          </div>

          <p className="text-[#5C524E] text-sm leading-relaxed mb-6">{product.description}</p>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="font-display font-bold text-3xl text-[#1C0D0A]">₹{price}</span>
            {hasDiscount && <span className="text-base text-[#9C8B84] line-through">₹{originalPrice}</span>}
          </div>

          {/* Weight / variant selector */}
          {variants.length > 1 && (
            <div className="mb-5">
              <p className="text-xs font-bold uppercase tracking-wider text-[#5C524E] mb-2">Select Weight</p>
              <div className="flex flex-wrap gap-2">
                {variants.map((v, idx) => (
                  <button
                    key={v.weight}
                    onClick={() => setVariantIdx(idx)}
                    className={`thumb-btn px-4 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                      idx === variantIdx
                        ? "bg-[#1C0D0A] text-white border-[#1C0D0A]"
                        : "bg-white text-[#5C524E] border-[#E6C184]/40 hover:border-[#962854]"
                    }`}
                  >
                    {v.weight}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Eggless toggle */}
          {product.egglessAvailable && (
            <div className="mb-5">
              <p className="text-xs font-bold uppercase tracking-wider text-[#5C524E] mb-2">Preference</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setEggless(true)}
                  className={`egg-toggle-btn sel-egg px-4 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-colors ${
                    eggless ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-[#5C524E] border-[#E6C184]/40"
                  }`}
                >
                  🌱 Eggless
                </button>
                <button
                  onClick={() => setEggless(false)}
                  className={`egg-toggle-btn px-4 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-colors ${
                    !eggless ? "bg-[#1C0D0A] text-white border-[#1C0D0A]" : "bg-white text-[#5C524E] border-[#E6C184]/40"
                  }`}
                >
                  🥚 With Egg
                </button>
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-wider text-[#5C524E] mb-2">Quantity</p>
            <div className="inline-flex items-center border border-[#E6C184]/40 rounded-xl overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center text-[#1C0D0A] hover:bg-[#FAF3EC]"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-10 text-center text-sm font-bold">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                className="w-10 h-10 flex items-center justify-center text-[#1C0D0A] hover:bg-[#FAF3EC]"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <button onClick={handleAddToCart} className="add-to-cart-btn btn-secondary flex-1 py-3.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-base">shopping_bag</span> Add to Cart
            </button>
            <button onClick={handleBuyNow} className="btn-primary flex-1 py-3.5 text-xs font-bold uppercase tracking-wider">
              Buy Now
            </button>
          </div>

          {/* Tabs */}
          <div className="border-t border-[#E6C184]/30 pt-5">
            <div className="flex gap-6 mb-4">
              <button
                onClick={() => setTab("description")}
                className={`detail-tab-btn text-xs font-bold uppercase tracking-wider pb-2 border-b-2 transition-colors ${
                  tab === "description" ? "border-[#962854] text-[#1C0D0A]" : "border-transparent text-[#9C8B84]"
                }`}
              >
                Description
              </button>
              {product.ingredients && product.ingredients.length > 0 && (
                <button
                  onClick={() => setTab("ingredients")}
                  className={`detail-tab-btn text-xs font-bold uppercase tracking-wider pb-2 border-b-2 transition-colors ${
                    tab === "ingredients" ? "border-[#962854] text-[#1C0D0A]" : "border-transparent text-[#9C8B84]"
                  }`}
                >
                  Ingredients
                </button>
              )}
            </div>
            <div className="detail-tab-content text-sm text-[#5C524E] leading-relaxed">
              {tab === "description" ? (
                <p>{product.description}</p>
              ) : (
                <ul className="list-disc pl-5 space-y-1">
                  {product.ingredients?.map((ing) => (
                    <li key={ing}>{ing}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Similar products */}
      {similar.length > 0 && (
        <div className="mt-16 pt-10 border-t border-[#E6C184]/30">
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#1C0D0A] mb-6">You May Also Like</h2>
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {similar.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
