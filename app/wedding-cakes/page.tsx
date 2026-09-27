import type { Metadata } from "next";
import { getDbProducts, getProductsByCategory } from "@/lib/products";
import CategoryHero from "@/components/products/CategoryHero";
import CategoryPageClient from "@/components/products/CategoryPageClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Wedding Cake Masterpieces",
  description: "Elegant, multi-tier wedding cake masterpieces crafted for your most important day.",
};

export default async function Page() {
  const allProducts = await getDbProducts();
  const products = getProductsByCategory("wedding-cakes", allProducts);

  return (
    <>
      <CategoryHero eyebrow="Wedding Collection" title="Wedding Cake Masterpieces" description="Elegant, multi-tier wedding cake masterpieces crafted for your most important day." />
      <CategoryPageClient products={products} />
    </>
  );
}
