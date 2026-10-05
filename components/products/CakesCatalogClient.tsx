"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/types";
import CakeCardInteractive from "@/components/products/CakeCardInteractive";

const CATEGORY_PILLS = [
  { label: "All Cakes", subcat: "all" },
  { label: "Normal Flavors", subcat: "Normal Flavors" },
  { label: "Choco Cakes", subcat: "Choco Cakes" },
  { label: "Choco Special", subcat: "Choco Special" },
  { label: "Delight Cakes", subcat: "Delight Cakes" },
  { label: "Rich Special", subcat: "Rich Special" },
  { label: "Premium Cakes", subcat: "Premium Cake" },
  { label: "Fruit Cakes", subcat: "Fruit Cake" },
  { label: "Extreme Combo", subcat: "Extreme Combo" },
];

export default function CakesCatalogClient({
  allCakes,
}: {
  allCakes: Product[];
}) {
  const [currentSubCat, setCurrentSubCat] = useState("all");
  const [currentWeight, setCurrentWeight] = useState("all");
  const [currentSearch, setCurrentSearch] = useState("");
  const [currentSort, setCurrentSort] = useState("default");

  const categoryPills = useMemo(() => {
    const defaultSubs = [
      "Normal Flavors",
      "Choco Cakes",
      "Choco Special",
      "Delight Cakes",
      "Rich Special",
      "Premium Cakes",
      "Fruit Cakes",
      "Extreme Combo",
    ];

    const extraSubs = new Set<string>();
    allCakes.forEach((c) => {
      const sub = c.subCategory || c.categoryName;
      if (sub && sub !== "General" && sub !== "cakes" && !defaultSubs.includes(sub)) {
        extraSubs.add(sub);
      }
    });

    const combined = [...defaultSubs, ...Array.from(extraSubs)];
    return [
      { label: "All Cakes", subcat: "all" },
      ...combined.map((s) => ({ label: s, subcat: s })),
    ];
  }, [allCakes]);

  function resetAll() {
    setCurrentSubCat("all");
    setCurrentWeight("all");
    setCurrentSearch("");
    setCurrentSort("default");
  }

  const filteredCakes = useMemo(() => {
    let list = [...allCakes];

    // 1. Subcategory filter
    if (currentSubCat !== "all") {
      const query = currentSubCat.toLowerCase().trim();
      const queryClean = query.replace(/[^a-z0-9]/g, "");
      list = list.filter((p) => {
        const pSub = (p.subCategory || "").toLowerCase().trim();
        const pSubClean = pSub.replace(/[^a-z0-9]/g, "");
        const pCatName = (p.categoryName || "").toLowerCase().trim();
        const pCatClean = pCatName.replace(/[^a-z0-9]/g, "");
        return (
          pSub === query ||
          pSubClean === queryClean ||
          pCatClean === queryClean ||
          pSub.includes(query) ||
          query.includes(pSub)
        );
      });
    }

    // 2. Weight filter
    if (currentWeight !== "all") {
      list = list.filter(
        (p) =>
          p.variants &&
          p.variants.some((v) =>
            v.weight.toLowerCase().includes(currentWeight.toLowerCase())
          )
      );
    }

    // 3. Search query filter
    if (currentSearch.trim()) {
      const q = currentSearch.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.subCategory && p.subCategory.toLowerCase().includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          (p.variants &&
            p.variants.some((v) => v.weight.toLowerCase().includes(q)))
      );
    }

    // 4. Sort
    if (currentSort === "price-low") {
      list.sort(
        (a, b) =>
          (a.minPrice || a.variants?.[0]?.price || 0) -
          (b.minPrice || b.variants?.[0]?.price || 0)
      );
    } else if (currentSort === "price-high") {
      list.sort(
        (a, b) =>
          (b.minPrice || b.variants?.[0]?.price || 0) -
          (a.minPrice || a.variants?.[0]?.price || 0)
      );
    } else if (currentSort === "rating") {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [allCakes, currentSubCat, currentWeight, currentSearch, currentSort]);

  return (
    <>
      {/* ── HERO BANNER ────────────────────────────────────────────────────── */}
      <section className="hero-gradient py-14 sm:py-20 text-center relative z-10 overflow-hidden">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg,rgba(255,255,255,.15) 0,rgba(255,255,255,.15) 1px,transparent 0,transparent 50%)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 border border-white/30 mb-5">
            <span className="w-2 h-2 rounded-full bg-amber-300 animate-pulse" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              {allCakes.length} Unique Signature Cakes · Fresh Daily
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight drop-shadow-lg">
            Signature Cake Collection
          </h1>
          <p className="text-white/90 mt-4 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-normal">
            Every cake is handcrafted fresh to order. Choose your weight, pick
            your preference, and we&apos;ll bake it fresh for you.
          </p>
          <div className="flex items-center justify-center gap-3 mt-6 flex-wrap">
            <span className="flex items-center gap-1.5 bg-white/15 text-white text-xs font-bold px-4 py-2 rounded-lg border border-white/25">
              Freshly Baked Daily
            </span>
            <span className="flex items-center gap-1.5 bg-white/20 text-white text-xs font-bold px-4 py-2 rounded-lg border border-white/30">
              Advance Orders Welcome
            </span>
          </div>
        </div>
      </section>

      {/* ── STICKY FILTER BAR ──────────────────────────────────────────────── */}
      <section className="bg-white/95 backdrop-blur-md border-b border-[#F1E6DF] shadow-sm sticky top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 space-y-3">
          {/* Search + Sort row */}
          <div className="flex flex-col sm:flex-row gap-2.5 items-center">
            <div className="relative flex-grow w-full sm:max-w-md">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#962854] text-lg">
                search
              </span>
              <input
                type="text"
                value={currentSearch}
                onChange={(e) => setCurrentSearch(e.target.value)}
                placeholder="Search Black Forest, Truffle, 0.5kg…"
                className="w-full bg-[#FFF9F5] border border-[#D8C3B3] focus:border-[#962854] focus:ring-2 focus:ring-[#962854]/20 rounded-lg pl-10 pr-4 py-2 text-sm font-semibold text-[#1C0D0A] outline-none transition-all placeholder-[#A89890]"
                suppressHydrationWarning
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={currentWeight}
                onChange={(e) => setCurrentWeight(e.target.value)}
                className="bg-[#FFF9F5] border border-[#D8C3B3] focus:border-[#962854] rounded-lg px-3.5 py-2 text-xs font-bold text-[#1C0D0A] outline-none cursor-pointer flex-1 sm:flex-none"
                suppressHydrationWarning
              >
                <option value="all">⚡ All Weights</option>
                <option value="0.5kg">🍰 0.5 kg</option>
                <option value="1kg">🎂 1 kg</option>
                <option value="step 2">⭐ Step 2</option>
              </select>
              <select
                value={currentSort}
                onChange={(e) => setCurrentSort(e.target.value)}
                className="bg-[#FFF9F5] border border-[#D8C3B3] focus:border-[#962854] rounded-lg px-3.5 py-2 text-xs font-bold text-[#1C0D0A] outline-none cursor-pointer flex-1 sm:flex-none"
                suppressHydrationWarning
              >
                <option value="default">✨ Featured</option>
                <option value="price-low">💰 Price: Low→High</option>
                <option value="price-high">💎 Price: High→Low</option>
                <option value="rating">⭐ Top Rated</option>
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

          {/* Mobile View Category Dropdown (sm:hidden) */}
          <div className="block sm:hidden w-full">
            <div className="relative">
              <select
                value={currentSubCat}
                onChange={(e) => setCurrentSubCat(e.target.value)}
                className="w-full appearance-none bg-[#FFF9F5] border border-[#D8C3B3] focus:border-[#962854] focus:ring-2 focus:ring-[#962854]/20 rounded-xl px-4 py-2.5 text-xs font-bold text-[#1C0D0A] outline-none cursor-pointer pr-10 shadow-xs transition-all"
                suppressHydrationWarning
              >
                {categoryPills.map((pill) => (
                  <option key={pill.subcat} value={pill.subcat}>
                    🎂 {pill.label} {pill.subcat === "all" ? `(${allCakes.length})` : ""}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#962854]">
                <span className="material-symbols-outlined text-xl">expand_more</span>
              </div>
            </div>
          </div>

          {/* Laptop / Desktop View Category Filter Buttons (hidden sm:flex) */}
          <div className="hidden sm:flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs font-bold flex-wrap">
            {categoryPills.map((pill) => {
              const isActive = currentSubCat === pill.subcat;
              return (
                <button
                  key={pill.subcat}
                  type="button"
                  onClick={() => setCurrentSubCat(pill.subcat)}
                  className={`cat-pill px-3.5 py-2 rounded-lg border transition-all whitespace-nowrap text-xs font-bold ${
                    isActive
                      ? "bg-[#962854] text-white border-[#962854] shadow-xs"
                      : "bg-[#FFF9F5] text-[#1C0D0A] border-[#D8C3B3] hover:border-[#962854] hover:bg-[#FAF0F2]"
                  }`}
                  suppressHydrationWarning
                >
                  {pill.label}{" "}
                  {pill.subcat === "all" && (
                    <span className="opacity-75">({allCakes.length})</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── PRODUCTS SECTION ───────────────────────────────────────────────── */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10 w-full">
        {/* Results bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8 pb-4 border-b border-[#E6C184]/20">
          <div>
            <span className="text-sm font-black uppercase tracking-wider text-[#1C0D0A]">
              Showing {filteredCakes.length} Unique Cake
              {filteredCakes.length !== 1 ? "s" : ""}
            </span>
            <p className="text-xs text-[#5C524E] mt-0.5">
              Each cake is handcrafted fresh to order
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs font-bold text-[#2A082C] bg-[#FAF3EC] border border-[#D8C3B3] px-3 py-1.5 rounded-lg flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#962854] animate-pulse" />{" "}
              Advance Order Available
            </span>
            <span className="text-xs font-bold text-[#962854] bg-[#FAF0F2] px-3 py-1.5 rounded-lg border border-[#962854]/20">
              ✨ 100% Artisanal Quality
            </span>
          </div>
        </div>

        {/* Products Grid */}
        {filteredCakes.length === 0 ? (
          <div className="col-span-full py-20 text-center">
            <span className="material-symbols-outlined text-6xl text-[#D8C3B3]">
              cake
            </span>
            <h3 className="font-display font-bold text-2xl text-[#1C0D0A] mt-4">
              No cakes found
            </h3>
            <p className="text-sm text-[#4A3E39] mt-2">
              Try adjusting your search or category filter.
            </p>
            <button
              type="button"
              onClick={resetAll}
              className="mt-5 btn-primary text-xs uppercase tracking-wider py-3 px-8 rounded-full"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div
            id="cakes-grid"
            className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 min-h-[400px]"
          >
            {filteredCakes.map((p, idx) => (
              <CakeCardInteractive
                key={p.id}
                product={p}
                animDelay={(idx % 8) * 0.04}
              />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
