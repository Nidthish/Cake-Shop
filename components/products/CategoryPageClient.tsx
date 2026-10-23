"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Product } from "@/types";
import ProductCard from "@/components/products/ProductCard";

export interface Pill {
  label: string;
  keyword: string; // matched against category/subCategory/name/description (lowercased)
}

export default function CategoryPageClient({
  products,
  pills,
  allLabel = "All Items",
  searchPlaceholder = "Search this collection...",
}: {
  products: Product[];
  pills?: Pill[];
  allLabel?: string;
  searchPlaceholder?: string;
}) {
  const [query, setQuery] = useState("");
  const [activePill, setActivePill] = useState<string>("all");
  const [sort, setSort] = useState<"default" | "price-asc" | "price-desc">("default");

  // Dynamically compute all subcategory pills:
  // Predefined pills + any distinct subcategories present on products
  const allPills = useMemo(() => {
    const list: Pill[] = pills ? [...pills] : [];

    for (const p of products) {
      const sub = (p.subCategory || "").trim();
      if (
        !sub ||
        sub.toLowerCase() === "general" ||
        sub.toLowerCase() === (p.category || "").toLowerCase()
      ) {
        continue;
      }

      const subLower = sub.toLowerCase();
      const alreadyCovered = list.some((pill) => {
        const pillKw = pill.keyword.toLowerCase();
        const pillLbl = pill.label.toLowerCase();
        return (
          pillKw === subLower ||
          pillLbl === subLower ||
          subLower.includes(pillKw) ||
          pillLbl.includes(subLower)
        );
      });

      if (!alreadyCovered) {
        list.push({
          label: sub,
          keyword: subLower,
        });
      }
    }
    return list;
  }, [pills, products]);

  function resetAll() {
    setQuery("");
    setActivePill("all");
    setSort("default");
  }

  const filtered = useMemo(() => {
    let list = products;

    if (activePill !== "all") {
      const pill = allPills.find((p) => p.keyword === activePill);
      if (pill) {
        const kw = pill.keyword.toLowerCase().trim();
        const lbl = pill.label.toLowerCase().trim();
        list = list.filter((p) => {
          const pSub = (p.subCategory || "").toLowerCase().trim();
          const pCatName = (p.categoryName || "").toLowerCase().trim();
          const pName = (p.name || "").toLowerCase().trim();
          const pDesc = (p.description || "").toLowerCase().trim();
          return (
            pSub === kw ||
            pSub === lbl ||
            pSub.includes(kw) ||
            (kw.length > 2 && kw.includes(pSub)) ||
            pCatName.includes(kw) ||
            pName.includes(kw) ||
            pDesc.includes(kw)
          );
        });
      }
    }

    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.subCategory && p.subCategory.toLowerCase().includes(q))
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
  }, [products, allPills, activePill, query, sort]);

  return (
    <>
      {/* ── Search & Subcategory Controls (Card UI - Responsive for Mobile & Desktop) ──────────────── */}
      <section className="bg-white/95 backdrop-blur-md border-b border-[#F1E6DF] shadow-sm relative z-20 transition-all font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 space-y-3">
          <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
            {/* Search Input Bar */}
            <div className="relative flex-grow w-full sm:max-w-md">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#962854] text-lg pointer-events-none">
                search
              </span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full bg-[#FFF9F5] border border-[#D8C3B3] focus:border-[#962854] focus:ring-2 focus:ring-[#962854]/20 rounded-lg pl-10 pr-4 py-2 text-sm font-semibold text-[#1C0D0A] outline-none transition-all placeholder-[#A89890] h-[40px]"
                suppressHydrationWarning
              />
            </div>

            {/* Sort & Reset Buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
                className="bg-[#FFF9F5] border border-[#D8C3B3] focus:border-[#962854] rounded-lg px-2.5 sm:px-3.5 py-2 text-xs font-bold text-[#1C0D0A] outline-none cursor-pointer flex-1 min-w-0 sm:flex-none h-[40px]"
                suppressHydrationWarning
              >
                <option value="default">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
              <button
                type="button"
                onClick={resetAll}
                className="flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold uppercase tracking-wider bg-[#962854] text-white hover:bg-[#2A082C] active:scale-95 shadow-xs rounded-lg transition-all whitespace-nowrap shrink-0 h-[40px] cursor-pointer"
                suppressHydrationWarning
                title="Reset all filters"
              >
                <span className="material-symbols-outlined text-sm leading-none font-bold">restart_alt</span>
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Subcategory Card Filter Pills (Edge-to-edge touch scroll on Mobile, Wrapped on Desktop) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs font-bold no-scrollbar flex-nowrap sm:flex-wrap py-1 -mx-4 px-4 sm:mx-0 sm:px-0">
            <button
              type="button"
              onClick={() => setActivePill("all")}
              className={`cat-pill shrink-0 px-3.5 py-2 rounded-lg border transition-all whitespace-nowrap text-xs font-bold cursor-pointer active:scale-95 ${
                activePill === "all"
                  ? "bg-[#962854] text-white border-[#962854] shadow-xs"
                  : "bg-[#FFF9F5] text-[#1C0D0A] border-[#D8C3B3] hover:border-[#962854] hover:bg-[#FAF0F2]"
              }`}
              suppressHydrationWarning
            >
              {allLabel} <span className="opacity-80">({products.length})</span>
            </button>
            {allPills.map((pill) => {
              const isActive = activePill === pill.keyword;
              return (
                <button
                  key={pill.keyword}
                  type="button"
                  onClick={() => setActivePill(pill.keyword)}
                  className={`cat-pill shrink-0 px-3.5 py-2 rounded-lg border transition-all whitespace-nowrap text-xs font-bold cursor-pointer active:scale-95 ${
                    isActive
                      ? "bg-[#962854] text-white border-[#962854] shadow-xs"
                      : "bg-[#FFF9F5] text-[#1C0D0A] border-[#D8C3B3] hover:border-[#962854] hover:bg-[#FAF0F2]"
                  }`}
                  suppressHydrationWarning
                >
                  {pill.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Main Catalog Grid ─────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#E6C184]/20">
          <span className="text-xs font-black uppercase tracking-wider text-[#1C0D0A]">
            Showing {filtered.length} Item{filtered.length === 1 ? "" : "s"}
          </span>
          <span className="text-xs font-bold text-[#962854] bg-[#FAF0F2] px-3 py-1 rounded-full border border-[#E6C184]/40">
            Handcrafted Fresh Daily
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 px-6 bg-[#FAF5EE] rounded-3xl border border-[#E6DBCE] max-w-lg mx-auto shadow-sm">
            <span className="material-symbols-outlined text-4xl text-[#962854] mb-3 block">cake</span>
            <h3 className="font-serif font-bold text-xl text-[#5B1E38] mb-2">
              No Items Currently in This Filter
            </h3>
            <p className="text-xs sm:text-sm text-[#7A6B72] mb-6 leading-relaxed">
              We prepare custom handcrafted cakes on demand. Contact our master bakers directly to design & order your custom cake!
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={resetAll}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#962854] text-[#962854] font-bold text-xs sm:text-sm hover:bg-[#FAF0F2] transition-all cursor-pointer"
              >
                Clear Filter
              </button>
              <Link
                href="/custom-cake"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#962854] text-white font-bold text-xs sm:text-sm hover:bg-[#7d1e44] transition-all shadow-md"
              >
                Request Custom Cake
              </Link>
            </div>
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
