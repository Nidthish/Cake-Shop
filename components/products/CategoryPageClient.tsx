"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/types";
import ProductCard from "@/components/products/ProductCard";

export interface Pill {
  label: string;
  keyword: string; // matched against category/subCategory/name (lowercased)
}

export default function CategoryPageClient({
  products,
  pills,
}: {
  products: Product[];
  pills?: Pill[];
}) {
  const [query, setQuery] = useState("");
  const [activePill, setActivePill] = useState<string>("all");
  const [sort, setSort] = useState<"default" | "price-asc" | "price-desc">("default");

  const filtered = useMemo(() => {
    let list = products;

    if (pills && activePill !== "all") {
      const pill = pills.find((p) => p.keyword === activePill);
      if (pill) {
        const kw = pill.keyword.toLowerCase();
        list = list.filter(
          (p) =>
            p.subCategory.toLowerCase().includes(kw) ||
            p.name.toLowerCase().includes(kw) ||
            p.description.toLowerCase().includes(kw)
        );
      }
    }

    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }

    if (sort !== "default") {
      list = [...list].sort((a, b) => {
        const pa = a.price ?? a.minPrice ?? a.variants?.[0]?.price ?? 0;
        const pb = b.price ?? b.minPrice ?? b.variants?.[0]?.price ?? 0;
        return sort === "price-asc" ? pa - pb : pb - pa;
      });
    }

    return list;
  }, [products, pills, activePill, query, sort]);

  return (
    <>
      <div className="sticky top-20 z-30 bg-[#FFF9F5]/95 backdrop-blur-sm border-b border-[#E6C184]/20 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="relative flex-grow max-w-sm">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#9C8B84] text-lg">
                search
              </span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search this collection..."
                className="w-full pl-9 pr-3 py-2.5 rounded-full border border-[#E6C184]/40 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#962854]/30"
              />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="py-2.5 px-3 rounded-full border border-[#E6C184]/40 bg-white text-sm font-medium text-[#5C524E] focus:outline-none"
            >
              <option value="default">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
          {pills && pills.length > 0 && (
            <>
              {/* Mobile View Category Dropdown (sm:hidden) */}
              <div className="block sm:hidden w-full mt-3">
                <div className="relative">
                  <select
                    value={activePill}
                    onChange={(e) => setActivePill(e.target.value)}
                    className="w-full appearance-none bg-white border border-[#E6C184]/50 focus:border-[#962854] focus:ring-2 focus:ring-[#962854]/20 rounded-xl px-4 py-2.5 text-xs font-bold text-[#1C0D0A] outline-none cursor-pointer pr-10 shadow-xs transition-all"
                    suppressHydrationWarning
                  >
                    <option value="all">✨ All Items</option>
                    {pills.map((p) => (
                      <option key={p.keyword} value={p.keyword}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#962854]">
                    <span className="material-symbols-outlined text-xl">expand_more</span>
                  </div>
                </div>
              </div>

              {/* Desktop View Category Pills (hidden sm:flex) */}
              <div className="hidden sm:flex gap-2 overflow-x-auto no-scrollbar mt-3 pb-1">
                <button
                  onClick={() => setActivePill("all")}
                  className={`cat-pill flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold border transition-colors ${
                    activePill === "all"
                      ? "bg-[#1C0D0A] text-white border-[#1C0D0A]"
                      : "bg-white text-[#5C524E] border-[#E6C184]/40 hover:border-[#962854]"
                  }`}
                >
                  All
                </button>
                {pills.map((p) => (
                  <button
                    key={p.keyword}
                    onClick={() => setActivePill(p.keyword)}
                    className={`cat-pill flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold border transition-colors ${
                      activePill === p.keyword
                        ? "bg-[#1C0D0A] text-white border-[#1C0D0A]"
                        : "bg-white text-[#5C524E] border-[#E6C184]/40 hover:border-[#962854]"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {filtered.length === 0 ? (
          <div className="text-center py-16 px-6 bg-[#FAF5EE] rounded-3xl border border-[#E6DBCE] max-w-lg mx-auto shadow-sm">
            <span className="text-4xl mb-3 block">🎂</span>
            <h3 className="font-serif font-bold text-xl text-[#5B1E38] mb-2">
              No Items Currently in This Collection
            </h3>
            <p className="text-xs sm:text-sm text-[#7A6B72] mb-6 leading-relaxed">
              We prepare custom handcrafted cakes on demand. Contact our master bakers directly on WhatsApp to design & order your custom cake!
            </p>
            <a
              href="https://wa.me/919489569661?text=Hello%20Lollipop%20Cake%20Shop,%20I%20would%20like%20to%20place%20a%20custom%20cake%20order."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#25D366] text-white font-bold text-xs sm:text-sm hover:bg-[#20ba5a] transition-all shadow-md"
            >
              <span>💬 Custom Order via WhatsApp</span>
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
