import type { Metadata } from "next";
import { PRODUCTS_DATA } from "@/lib/products";
import DryCakesCatalogClient from "@/components/products/DryCakesCatalogClient";

export const metadata: Metadata = {
  title: "Artisanal Dry Cakes & Tea Cakes - Lollipop Cake Shop",
  description:
    "Explore handcrafted plum cakes, banana cakes, tea cakes, walnut cakes, and rich cake loafs baked fresh daily.",
};

export default function Page() {
  const allDryCakes = PRODUCTS_DATA.filter(
    (p) =>
      p.category === "dry-cakes" ||
      (p.subCategory && p.subCategory.toLowerCase() === "dry cakes")
  );

  return <DryCakesCatalogClient allDryCakes={allDryCakes} />;
}
