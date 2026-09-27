"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Product } from "@/types";
import { useCart } from "@/components/cart/CartProvider";

const SUB_PILLS = [
  { label: "All Dry Cakes", keyword: "all" },
  { label: "Plum Cakes", keyword: "plum" },
  { label: "Banana Cakes", keyword: "banana" },
  { label: "Tea Cakes", keyword: "tea" },
];

function DryCakeCard({ p, animDelay = 0 }: { p: Product; animDelay?: number }) {
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const price = p.price || p.minPrice || (p.variants && p.variants[0] ? p.variants[0].price : 20);
  const originalPrice =
    p.originalPrice ||
    (p.variants && p.variants[0] && p.variants[0].originalPrice
      ? p.variants[0].originalPrice
      : undefined);

  const hasDiscount = Boolean(originalPrice && originalPrice > price);

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      id: p.id,
      name: p.name,
      image: p.image,
      weight: "1 pc",
      price: price,
      quantity: 1,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1200);
  }

  return (
    <div
      className="product-card group relative bg-white border border-[#F1E6DF] rounded-2xl p-2.5 sm:p-3 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between h-full font-sans"
      style={{ animationDelay: `${animDelay}s` }}
    >
      <div className="relative aspect-square overflow-hidden bg-[#FAF5F0] rounded-xl border border-[#E6C184]/20 p-2 group-hover:border-[#962854]/40 transition-colors mb-2.5">
        <Link href={`/products/${p.id}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={p.image}
            alt={p.name}
            loading="lazy"
            className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/images/hero_cake.png";
            }}
          />
        </Link>
      </div>

      <div className="pt-2 px-1 flex flex-col flex-grow justify-between">
        <div>
          {/* SubCategory Tag */}
          <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1">
            <span className="text-[10px] font-bold text-[#962854] bg-[#FAF0F2] px-2 py-0.5 rounded-full font-sans">
              Dry Cakes
            </span>
            <div className="flex items-center gap-1 text-[#B99A62] text-[11px] font-sans">
              <span className="material-symbols-outlined text-xs font-fill">star</span>
              <span className="font-bold text-[#1C0D0A]">{p.rating}</span>
              <span className="text-[#8C7E77]">({p.reviewCount})</span>
            </div>
          </div>

          {/* Title */}
          <Link href={`/products/${p.id}`}>
            <h3 className="font-sans font-bold text-sm sm:text-base text-[#1C0D0A] mb-1 group-hover:text-[#962854] transition-colors leading-snug line-clamp-2 text-left">
              {p.name}
            </h3>
          </Link>

          {/* Product Description */}
          <p className="font-sans text-xs text-[#5C524E] line-clamp-2 mb-2.5 leading-relaxed font-normal text-left">
            {p.description}
          </p>
        </div>

        {/* Price & Action Button Footer */}
        <div className="pt-2.5 border-t border-[#F1E6DF] flex items-center justify-between mt-auto gap-1 font-sans">
          <div className="flex items-baseline gap-1">
            <span className="text-base sm:text-lg font-extrabold text-[#962854] font-sans">
              ₹{price}
            </span>
            {hasDiscount && (
              <span className="text-xs font-sans text-[#8C7E77] line-through ml-1 font-normal">
                ₹{originalPrice}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/products/${p.id}`}
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
            >
              {isAdded ? (
                <>
                  <span className="material-symbols-outlined text-xs">check</span> Added
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-xs">shopping_bag</span> Add
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DryCakesCatalogClient({
  allDryCakes,
}: {
  allDryCakes: Product[];
}) {
  const [currentKeyword, setCurrentKeyword] = useState("all");
  const [currentSearch, setCurrentSearch] = useState("");
  const [currentSort, setCurrentSort] = useState("default");

  function resetAll() {
    setCurrentKeyword("all");
    setCurrentSearch("");
    setCurrentSort("default");
  }

  const filteredDryCakes = useMemo(() => {
    let list = [...allDryCakes];

    if (currentKeyword !== "all") {
      const kw = currentKeyword.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(kw) ||
          p.description.toLowerCase().includes(kw)
      );
    }

    if (currentSearch.trim()) {
      const q = currentSearch.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    if (currentSort === "price-low") {
      list.sort(
        (a, b) =>
          (a.price || a.minPrice || a.variants?.[0]?.price || 0) -
          (b.price || b.minPrice || b.variants?.[0]?.price || 0)
      );
    } else if (currentSort === "price-high") {
      list.sort(
        (a, b) =>
          (b.price || b.minPrice || b.variants?.[0]?.price || 0) -
          (a.price || a.minPrice || a.variants?.[0]?.price || 0)
      );
    }

    return list;
  }, [allDryCakes, currentKeyword, currentSearch, currentSort]);

  return (
    <>
      {/* ── Hero Header Banner ─────────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-[#FFF9F5] via-[#FAF3EC] to-[#FAF0F2] py-10 sm:py-14 border-b border-[#E6C184]/20 text-center relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FAF3EC] border border-[#E6C184]/60 mb-3">
            <span className="material-symbols-outlined text-sm text-[#962854]">
              auto_awesome
            </span>
            <span className="text-xs font-bold text-[#1C0D0A] uppercase tracking-wider">
               Handcrafted Fresh Daily
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1C0D0A] mt-1 leading-tight tracking-tight">
            Rich &amp; Artisanal Dry Cakes
          </h1>
          <p className="text-base sm:text-lg text-[#4A3E39] mt-3 leading-relaxed font-normal">
            Delicious plum cakes, moist banana loafs, tea cakes, walnut cakes, and
            pudding treats baked to perfection.
          </p>
        </div>
      </section>

      {/* ── Search & Subcategory Controls ────────────────────────────── */}
      <section className="bg-white/95 backdrop-blur-md border-b border-[#F1E6DF] shadow-sm sticky top-20 z-30 transition-all font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 space-y-3">
          <div className="flex flex-col sm:flex-row gap-2.5 items-center">
            <div className="relative flex-grow w-full sm:max-w-md">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#962854] text-lg">
                search
              </span>
              <input
                type="text"
                value={currentSearch}
                onChange={(e) => setCurrentSearch(e.target.value)}
                placeholder="Search Plum Cake, Banana Cake, Tea Cake, Walnut Cake..."
                className="w-full bg-[#FFF9F5] border border-[#D8C3B3] focus:border-[#962854] focus:ring-2 focus:ring-[#962854]/20 rounded-lg pl-10 pr-4 py-2 text-sm font-semibold text-[#1C0D0A] outline-none transition-all placeholder-[#A89890]"
                suppressHydrationWarning
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={currentSort}
                onChange={(e) => setCurrentSort(e.target.value)}
                className="bg-[#FFF9F5] border border-[#D8C3B3] focus:border-[#962854] rounded-lg px-3.5 py-2 text-xs font-bold text-[#1C0D0A] outline-none cursor-pointer flex-1 sm:flex-none"
                suppressHydrationWarning
              >
                <option value="default">✨ Featured</option>
                <option value="price-low">💰 Price: Low→High</option>
                <option value="price-high">💎 Price: High→Low</option>
              </select>
              <button
                type="button"
                onClick={resetAll}
                className="px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-[#962854] hover:bg-[#FAF0F2] border border-[#962854]/30 rounded-lg transition-all whitespace-nowrap"
                suppressHydrationWarning
              >
                RESET
              </button>
            </div>
          </div>

          {/* Subcategory Quick Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs font-bold flex-nowrap sm:flex-wrap">
            {SUB_PILLS.map((pill) => {
              const isActive = currentKeyword === pill.keyword;
              return (
                <button
                  key={pill.keyword}
                  type="button"
                  onClick={() => setCurrentKeyword(pill.keyword)}
                  className={`cat-pill px-3.5 py-2 rounded-lg border transition-all whitespace-nowrap text-xs font-bold ${
                    isActive
                      ? "bg-[#962854] text-white border-[#962854] shadow-xs"
                      : "bg-[#FFF9F5] text-[#1C0D0A] border-[#D8C3B3] hover:border-[#962854] hover:bg-[#FAF0F2]"
                  }`}
                >
                  {pill.label}{" "}
                  {pill.keyword === "all" && (
                    <span className="opacity-75">({allDryCakes.length})</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Main Catalog Grid ─────────────────────────────────────────── */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10 w-full">
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#E6C184]/20">
          <span className="text-xs font-black uppercase tracking-wider text-[#1C0D0A]">
            Showing {filteredDryCakes.length} Dry Cake
            {filteredDryCakes.length === 1 ? "" : "s"}
          </span>
          <span className="text-xs font-bold text-[#962854] bg-[#FAF0F2] px-3 py-1 rounded-full border border-[#E6C184]/40">
            ✨ Baked Fresh Daily
          </span>
        </div>

        {filteredDryCakes.length === 0 ? (
          <div className="col-span-full py-16 text-center">
            <h3 className="font-display font-bold text-2xl text-[#1C0D0A]">
              No matching dry cakes found
            </h3>
            <button
              type="button"
              onClick={resetAll}
              className="mt-4 btn-primary text-xs uppercase tracking-wider py-2.5 px-6 rounded-full"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div
            id="dry-cakes-grid"
            className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 min-h-[400px]"
          >
            {filteredDryCakes.map((p, idx) => (
              <DryCakeCard key={p.id} p={p} animDelay={(idx % 8) * 0.04} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
