import type { Metadata } from "next";
import { getProductsByCategory } from "@/lib/products";
import CategoryHero from "@/components/products/CategoryHero";
import CategoryPageClient from "@/components/products/CategoryPageClient";

export const metadata: Metadata = {
  title: "Wedding Cake Masterpieces",
  description: "Elegant, multi-tier wedding cake masterpieces crafted for your most important day.",
};

export default function Page() {
  const products = getProductsByCategory("wedding-cakes");
  return (
    <>
      <CategoryHero eyebrow="Wedding Collection" title="Wedding Cake Masterpieces" description="Elegant, multi-tier wedding cake masterpieces crafted for your most important day." />
      <CategoryPageClient products={products} />
    </>
  );
}
