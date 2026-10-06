"use client";

/* eslint-disable @next/next/no-img-element */

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Product } from "@/types";
import { useCart } from "@/components/cart/CartProvider";
import { useToast } from "@/components/common/ToastProvider";
import { getProductCardImage } from "@/lib/dummy-images";

const SUB_CATEGORIES = [
  { label: "All Snacks & Pastries", value: "all" },
  { label: "Doughnuts", value: "Doughnuts" },
  { label: "Cup Cakes", value: "Cup Cakes" },
  { label: "Brownies", value: "Brownies" },
  { label: "Cookies", value: "Cookies" },
  { label: "Puffs", value: "Puffs" },
  { label: "Buns", value: "Buns" },
  { label: "Breads", value: "Breads" },
];

export default function SnacksCatalogClient({ products }: { products: Product[] }) {
  const { addItem } = useCart();
  const { showToast } = useToast();

  const [subCat, setSubCat] = useState("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"default" | "price-low" | "price-high">("default");
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  const filtered = useMemo(() => {
    let list = products;

    if (subCat !== "all") {
      list = list.filter(
        (p) => p.subCategory && p.subCategory.toLowerCase() === subCat.toLowerCase()
      );
    }

    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.subCategory && p.subCategory.toLowerCase().includes(q)) ||
          p.description.toLowerCase().includes(q)
      );
    }

    if (sort === "price-low") {
      list = [...list].sort(
        (a, b) => (a.price ?? a.minPrice ?? 0) - (b.price ?? b.minPrice ?? 0)
      );
    } else if (sort === "price-high") {
      list = [...list].sort(
        (a, b) => (b.price ?? b.minPrice ?? 0) - (a.price ?? a.minPrice ?? 0)
      );
    }

    return list;
  }, [products, subCat, query, sort]);

  function handleAddToCart(p: Product, e?: React.MouseEvent) {
    if (typeof window !== "undefined" && e?.currentTarget) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      window.dispatchEvent(
        new CustomEvent("lollipop:fly-to-cart", {
          detail: {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
            image: getProductCardImage(p),
          },
        })
      );
    }

    const price = p.price ?? p.minPrice ?? (p.variants && p.variants[0] ? p.variants[0].price : 20);
    const weight = p.variants && p.variants[0] ? p.variants[0].weight : "1 pc";

    addItem({
      id: p.id,
      name: p.name,
      price,
      image: getProductCardImage(p),
      weight,
      quantity: 1,
    });

    setAddedIds((prev) => ({ ...prev, [p.id]: true }));
    showToast(`Added ${p.name} to cart!`, "success");

    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [p.id]: false }));
    }, 1200);
  }

  function handleReset() {
    setSubCat("all");
    setQuery("");
    setSort("default");
  }

  return (
    <>
      <section className="bg-white/95 backdrop-blur-md border-b border-[#F1E6DF] shadow-sm sticky top-20 z-30 transition-all font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 space-y-3">
          <div className="flex flex-col sm:flex-row gap-2.5 items-center">
            <div className="relative flex-grow w-full sm:max-w-md">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#962854] text-lg">
                search
              </span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search Brownies, Doughnuts, Cupcakes, Puffs, Bread..."
                className="w-full bg-[#FFF9F5] border border-[#D8C3B3] focus:border-[#962854] focus:ring-2 focus:ring-[#962854]/20 rounded-lg pl-10 pr-4 py-2 text-sm font-semibold text-[#1C0D0A] outline-none transition-all placeholder-[#A89890]"
                suppressHydrationWarning
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
                className="bg-[#FFF9F5] border border-[#D8C3B3] focus:border-[#962854] rounded-lg px-3.5 py-2 text-xs font-bold text-[#1C0D0A] outline-none cursor-pointer flex-1 sm:flex-none"
                suppressHydrationWarning
              >
                <option value="default">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <button
                type="button"
                onClick={handleReset}
                className="px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-[#962854] hover:bg-[#FAF0F2] border border-[#962854]/30 rounded-lg transition-all whitespace-nowrap"
                suppressHydrationWarning
              >
                RESET
              </button>
            </div>
          </div>

          {/* Mobile View Subcategory Dropdown (sm:hidden) */}
          <div className="block sm:hidden w-full">
            <div className="relative">
              <select
                value={subCat}
                onChange={(e) => setSubCat(e.target.value)}
                className="w-full appearance-none bg-[#FFF9F5] border border-[#D8C3B3] focus:border-[#962854] focus:ring-2 focus:ring-[#962854]/20 rounded-xl px-4 py-2.5 text-xs font-bold text-[#1C0D0A] outline-none cursor-pointer pr-10 shadow-xs transition-all"
                suppressHydrationWarning
              >
                {SUB_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label} {cat.value === "all" ? `(${products.length})` : ""}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#962854]">
                <span className="material-symbols-outlined text-xl">expand_more</span>
              </div>
            </div>
          </div>

          {/* Desktop View Subcategory Pills (hidden sm:flex) */}
          <div className="hidden sm:flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs font-bold flex-wrap">
            {SUB_CATEGORIES.map((cat) => {
              const isActive = subCat.toLowerCase() === cat.value.toLowerCase();
              return (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setSubCat(cat.value)}
                  className={`cat-pill px-3.5 py-2 rounded-lg border transition-all whitespace-nowrap text-xs font-bold ${
                    isActive
                      ? "bg-[#962854] text-white border-[#962854] shadow-xs"
                      : "bg-[#FFF9F5] text-[#1C0D0A] border-[#D8C3B3] hover:border-[#962854] hover:bg-[#FAF0F2]"
                  }`}
                >
                  {cat.label}{" "}
                  {cat.value === "all" && (
                    <span className="opacity-75">({products.length})</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10 w-full">
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#E6C184]/20">
          <span className="text-xs font-black uppercase tracking-wider text-[#1C0D0A]">
            Showing {filtered.length} Gourmet Snack{filtered.length === 1 ? "" : "s"}
          </span>
          <span className="text-xs font-bold text-[#962854] bg-[#FAF0F2] px-3 py-1 rounded-full">
            Handcrafted Fresh Daily
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="col-span-full py-16 text-center">
            <h3 className="font-display font-bold text-2xl text-[#1C0D0A]">No matching snacks found</h3>
            <button
              onClick={handleReset}
              className="mt-4 btn-primary text-xs uppercase tracking-wider py-2.5 px-6 rounded-full"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 min-h-[400px]">
            {filtered.map((p) => {
              const price = p.price ?? p.minPrice ?? (p.variants && p.variants[0] ? p.variants[0].price : 20);
              const origPrice = p.originalPrice ?? (p.variants && p.variants[0] ? p.variants[0].originalPrice : undefined);
              const isAdded = addedIds[p.id];

              return (
                <div
                  key={p.id}
                  className="product-card group relative bg-white border border-[#F1E6DF] rounded-2xl p-2.5 sm:p-3 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between h-full font-sans"
                >
                  <div className="relative aspect-square overflow-hidden bg-[#FAF5F0] rounded-xl border border-[#E6C184]/20 p-2 group-hover:border-[#962854]/40 transition-colors mb-2.5">
                    <Link href={`/products/${p.id}`}>
                      <img
                        src={getProductCardImage(p)}
                        alt={p.name}
                        className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
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
                          {p.subCategory || p.categoryName || "Snacks"}
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

                    {/* Footer */}
                    <div className="pt-2.5 border-t border-[#F1E6DF] flex items-center justify-between mt-auto gap-1 font-sans">
                      <div className="flex items-baseline gap-1">
                        <span className="text-base sm:text-lg font-extrabold text-[#962854] font-sans">
                          ₹{price}
                        </span>
                        {origPrice !== undefined && origPrice > price && (
                          <span className="text-xs font-sans text-[#8C7E77] line-through ml-1 font-normal">
                            ₹{origPrice}
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
                          onClick={(e) => handleAddToCart(p, e)}
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
            })}
          </div>
        )}
      </main>
    </>
  );
}
