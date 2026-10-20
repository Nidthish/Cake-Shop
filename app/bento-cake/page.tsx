import type { Metadata } from "next";
import { getDbProducts, getProductsByCategory } from "@/lib/products";
import CategoryPageClient from "@/components/products/CategoryPageClient";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Bento Cakes in Trichy | Lollipop Cake Shop",
  description:
    "Order adorable Korean bento cakes in Trichy from Lollipop Cake Shop. Cute mini cakes with custom message piping, perfect for intimate surprises.",
  alternates: {
    canonical: `${SITE_URL}/bento-cake`,
  },
  openGraph: {
    title: "Bento Cakes in Trichy | Lollipop Cake Shop",
    description:
      "Order adorable Korean bento cakes in Trichy from Lollipop Cake Shop. Cute mini cakes with custom message piping, perfect for intimate surprises.",
    url: `${SITE_URL}/bento-cake`,
    siteName: "Lollipop Cake Shop",
    type: "website",
  },
};

const BENTO_PILLS = [
  { label: "Chocolate & Nutella", keyword: "chocolate" },
  { label: "Lotus Biscoff", keyword: "biscoff" },
  { label: "Hearts & Love", keyword: "love" },
  { label: "Pastel & Butterfly", keyword: "butterfly" },
];

export default async function Page() {
  const allProducts = await getDbProducts();
  const products = getProductsByCategory("bento-cake", allProducts);

  return (
    <>
      <section className="bg-gradient-to-r from-[#FFF9F5] via-[#FAF3EC] to-[#FAF0F2] py-10 sm:py-14 border-b border-[#E6C184]/20 text-center relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FAF0F2] border border-[#962854]/30 mb-3 font-sans">
            <span className="w-2 h-2 rounded-full bg-[#962854]" />
            <span className="text-xs font-bold text-[#962854] uppercase tracking-wider">
              Cute Pastel Korean Lunchbox Cakes
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1C0D0A] mt-1 leading-tight tracking-tight">
            Bento Cakes in Trichy
          </h1>
          <p className="text-base sm:text-lg text-[#4A3E39] mt-3 leading-relaxed font-sans font-normal">
            Order adorable bento cakes in Trichy! Our 300g Korean bento cake and custom bento cakes are packed in eco-friendly mini lunchboxes with personalized text piping.
          </p>
        </div>
      </section>

      <CategoryPageClient products={products} pills={BENTO_PILLS} />
    </>
  );
}
