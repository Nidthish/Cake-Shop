import type { Metadata } from "next";
import { getDbProducts, getProductsByCategory } from "@/lib/products";
import CategoryPageClient from "@/components/products/CategoryPageClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "1st Birthday Cakes in Trichy | First Birthday Theme Cakes | Lollipop Cake Shop",
  description:
    "Celebrate your little one's special milestone with handcrafted 1st birthday theme cakes from Lollipop Cake Shop in Trichy.",
  alternates: {
    canonical: "https://lollipopcakeshop.in/first-birthday",
  },
  keywords: [
    "1st birthday cakes in Trichy",
    "first birthday cake Trichy",
    "baby smash cake Trichy",
    "safari birthday cake Trichy",
    "princess crown cake Trichy",
    "Lollipop Cake Shop birthday cakes",
  ],
  openGraph: {
    title: "1st Birthday Cakes in Trichy | First Birthday Theme Cakes | Lollipop Cake Shop",
    description:
      "Celebrate your little one's special milestone with handcrafted 1st birthday theme cakes from Lollipop Cake Shop in Trichy.",
    url: "https://lollipopcakeshop.in/first-birthday",
    siteName: "Lollipop Cake Shop",
    type: "website",
  },
};

const BIRTHDAY_PILLS = [
  { label: "Safari & Jungle", keyword: "safari" },
  { label: "Prince & Crown", keyword: "crown" },
  { label: "Fairy & Butterfly", keyword: "fairy" },
  { label: "Teddy Bear & Toys", keyword: "bear" },
  { label: "LED Floating Tier", keyword: "floating" },
];

export default async function Page() {
  const allProducts = await getDbProducts();
  const products = getProductsByCategory("first-birthday", allProducts);

  return (
    <>
      <section className="bg-gradient-to-r from-[#FFF9F5] via-[#FAF3EC] to-[#FAF0F2] py-10 sm:py-14 border-b border-[#E6C184]/20 text-center relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FAF0F2] border border-[#962854]/30 mb-3 font-sans">
            <span className="w-2 h-2 rounded-full bg-[#962854]" />
            <span className="text-xs font-bold text-[#962854] uppercase tracking-wider">
              Gentle & Low-Sugar Baby Friendly
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1C0D0A] mt-1 leading-tight tracking-tight">
            1st Birthday Smash Cakes
          </h1>
          <p className="text-base sm:text-lg text-[#4A3E39] mt-3 leading-relaxed font-sans font-normal">
            Ultra-soft vanilla smash cakes, safari animal tiers, and royal princess crowns for your baby&apos;s first celebration.
          </p>
        </div>
      </section>

      <CategoryPageClient products={products} pills={BIRTHDAY_PILLS} />
    </>
  );
}
