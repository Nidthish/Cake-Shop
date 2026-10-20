import type { Metadata } from "next";
import { getDbProducts, getProductsByCategory } from "@/lib/products";
import CategoryHero from "@/components/products/CategoryHero";
import CategoryPageClient from "@/components/products/CategoryPageClient";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Wedding Cakes in Trichy | Lollipop Cake Shop",
  description:
    "Magnificent tiered wedding cakes in Trichy handcrafted by Lollipop Cake Shop. Custom wedding cakes and elegant multi-tier reception centerpieces.",
  alternates: {
    canonical: `${SITE_URL}/wedding-cakes`,
  },
  openGraph: {
    title: "Wedding Cakes in Trichy | Lollipop Cake Shop",
    description:
      "Magnificent tiered wedding cakes in Trichy handcrafted by Lollipop Cake Shop. Custom wedding cakes and elegant multi-tier reception centerpieces.",
    url: `${SITE_URL}/wedding-cakes`,
    siteName: "Lollipop Cake Shop",
    type: "website",
  },
};

const WEDDING_PILLS = [
  { label: "2-Tier Classic", keyword: "2-tier" },
  { label: "Fresh Florals & Roses", keyword: "rose" },
  { label: "Luxury Floating Tier", keyword: "floating" },
  { label: "Romance & Monogram", keyword: "romance" },
];

export default async function Page() {
  const allProducts = await getDbProducts();
  const products = getProductsByCategory("wedding-cakes", allProducts);

  return (
    <>
      <CategoryHero
        eyebrow="Wedding & Reception Collection"
        title="Wedding Cakes in Trichy"
        description="Magnificent tiered wedding cakes, custom wedding cakes, and grand reception celebration cakes handcrafted in Trichy."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2 text-center">
        <h2 className="font-display font-semibold text-lg sm:text-2xl text-[#962854]">
          Custom Wedding Cakes for Your Special Celebration
        </h2>
      </div>
      <CategoryPageClient products={products} pills={WEDDING_PILLS} />
    </>
  );
}
