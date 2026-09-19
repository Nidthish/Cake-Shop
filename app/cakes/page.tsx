import type { Metadata } from "next";
import { PRODUCTS_DATA } from "@/lib/products";
import CakesCatalogClient from "@/components/products/CakesCatalogClient";

export const metadata: Metadata = {
  title: "All Eggless Cakes — Lollipop Cake Shop",
  description:
    "Browse all handcrafted 100% eggless signature cakes. Normal Flavors, Choco Cakes, Delight Cakes, Rich Special, Premium, Fruit Cakes & Extreme Combos. Order 1 day prior for eggless.",
};

export default function Page() {
  const allCakes = PRODUCTS_DATA.filter(
    (p) =>
      p.category === "cakes" &&
      (p.subCategory || "").toLowerCase() !== "dry cakes" &&
      (p.subCategory || "").toLowerCase() !== "snacks" &&
      (p.subCategory || "").toLowerCase() !== "brownies" &&
      !(p.name || "").toLowerCase().includes("brownie")
  );

  return <CakesCatalogClient allCakes={allCakes} />;
}
