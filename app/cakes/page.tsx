import type { Metadata } from "next";
import { getDbProducts } from "@/lib/products";
import CakesCatalogClient from "@/components/products/CakesCatalogClient";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Fresh Cakes in Trichy | Birthday & Celebration Cakes | Lollipop Cake Shop",
  description:
    "Order fresh handcrafted celebration and birthday cakes online in Trichy from Lollipop Cake Shop. 100% fresh, eggless options, fast delivery.",
  alternates: {
    canonical: `${SITE_URL}/cakes`,
  },
  keywords: [
    "fresh cakes in Trichy",
    "birthday cakes Trichy",
    "eggless cakes Trichy",
    "chocolate cake Trichy",
    "cake delivery in Trichy",
    "Lollipop Cake Shop",
    "Lollipop cakes Trichy",
    "online cake shop in Trichy",
    "best cake shop in Trichy",
    "cake offers in Trichy",
  ],
  openGraph: {
    title: "Fresh Cakes in Trichy | Birthday & Celebration Cakes | Lollipop Cake Shop",
    description:
      "Order fresh handcrafted celebration and birthday cakes online in Trichy from Lollipop Cake Shop. 100% fresh, eggless options, fast delivery.",
    url: `${SITE_URL}/cakes`,
    siteName: "Lollipop Cake Shop",
    type: "website",
  },
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
