import type { Metadata } from "next";
import { getDbProducts } from "@/lib/products";
import CakesCatalogClient from "@/components/products/CakesCatalogClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "All Eggless Cakes — Lollipop Cake Shop",
  description:
    "Browse all handcrafted 100% eggless signature cakes. Normal Flavors, Choco Cakes, Delight Cakes, Rich Special, Premium, Fruit Cakes & Extreme Combos. Order 1 day prior for eggless.",
};

export default async function Page() {
  const allProducts = await getDbProducts();

  const allCakes = allProducts.filter(
    (p) =>
      p.category === "cakes" &&
      (p.subCategory || "").toLowerCase() !== "dry cakes" &&
      (p.subCategory || "").toLowerCase() !== "snacks" &&
      (p.subCategory || "").toLowerCase() !== "brownies" &&
      (p.subCategory || "").toLowerCase() !== "photo cakes" &&
      !(p.subCategory || "").toLowerCase().includes("photo") &&
      !(p.name || "").toLowerCase().includes("brownie") &&
      !(p.name || "").toLowerCase().includes("photo cake")
  );

  return <CakesCatalogClient allCakes={allCakes} />;
}
