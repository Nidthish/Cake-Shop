import type { Metadata } from "next";
import { getDbProducts } from "@/lib/products";
import SnacksCatalogClient from "@/components/products/SnacksCatalogClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "French Pastries & Artisanal Snacks - Lollipop Cake Shop",
  description:
    "Explore fresh doughnuts, cupcakes, fudge brownies, cookies, puff pastries, buns, and breads.",
};

export default async function Page() {
  const allProducts = await getDbProducts();
  const products = allProducts.filter((p) => p.category === "snacks");

  return (
    <>
      <section className="bg-gradient-to-r from-[#FFF9F5] via-[#FAF3EC] to-[#FAF0F2] py-10 sm:py-14 border-b border-[#E6C184]/20 text-center relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FAF0F2] border border-[#962854]/30 mb-3 font-sans">
            <span className="w-2 h-2 rounded-full bg-[#962854]" />
            <span className="text-xs font-bold text-[#962854] uppercase tracking-wider">
               Artisanal Fresh Baked Daily
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1C0D0A] mt-1 leading-tight tracking-tight">
            French Pastries &amp; Artisanal Snacks
          </h1>
          <p className="text-base sm:text-lg text-[#4A3E39] mt-3 leading-relaxed font-sans font-normal">
            Dry cakes, doughnuts, cupcakes, brownies, cookies, savory puffs, buns, and fresh breads baked daily.
          </p>
        </div>
      </section>

      <SnacksCatalogClient products={products} />
    </>
  );
}
