import type { Metadata } from "next";
import { getDbProducts } from "@/lib/products";
import DryCakesCatalogClient from "@/components/products/DryCakesCatalogClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Artisanal Dry Cakes & Tea Cakes - Lollipop Cake Shop",
  description:
    "Explore handcrafted plum cakes, banana cakes, tea cakes, walnut cakes, and rich cake loafs baked fresh daily.",
};

export default async function Page() {
  const allProducts = await getDbProducts();
  const allDryCakes = allProducts.filter(
    (p) =>
      p.category === "dry-cakes" ||
      (p.subCategory && p.subCategory.toLowerCase() === "dry cakes")
  );

  return <DryCakesCatalogClient allDryCakes={allDryCakes} />;
}
