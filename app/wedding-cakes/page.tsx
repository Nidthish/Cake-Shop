import type { Metadata } from "next";
import { getDbProducts, getProductsByCategory } from "@/lib/products";
import CategoryHero from "@/components/products/CategoryHero";
import CategoryPageClient from "@/components/products/CategoryPageClient";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Wedding Cakes in Trichy | Elegant Tiered Marriage Cakes | Lollipop Cake Shop",
  description:
    "Magnificent tiered wedding and reception cakes delivered across Trichy by Lollipop Cake Shop.",
  alternates: {
    canonical: `${SITE_URL}/wedding-cakes`,
  },
  keywords: [
    "wedding cakes in Trichy",
    "marriage cake Trichy",
    "reception cake Trichy",
    "tiered wedding cakes Trichy",
    "floating tier wedding cake Trichy",
    "luxury wedding cake Trichy",
    "Lollipop Cake Shop wedding cakes",
  ],
  openGraph: {
    title: "Wedding Cakes in Trichy | Elegant Tiered Marriage Cakes | Lollipop Cake Shop",
    description:
      "Magnificent tiered wedding and reception cakes delivered across Trichy by Lollipop Cake Shop.",
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
      <CategoryHero eyebrow="Wedding Collection" title="Wedding Cake Masterpieces" description="Elegant, multi-tier wedding cake masterpieces crafted for your most important day." />
      <CategoryPageClient
        products={products}
        pills={WEDDING_PILLS}
        allLabel="All Wedding Cakes"
        searchPlaceholder="Search 2-Tier, Fresh Florals, Luxury Floating Tier, Romance..."
      />
    </>
  );
}
