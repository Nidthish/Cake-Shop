import type { Metadata } from "next";
import { getDbProducts } from "@/lib/products";
import CakesCatalogClient from "@/components/products/CakesCatalogClient";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Cakes in Trichy | Lollipop Cake Shop",
  description:
    "Order fresh handcrafted cakes in Trichy from Lollipop Cake Shop. Choose from chocolate cakes, birthday cakes, custom cakes, and eggless cakes with fast cake delivery in Trichy.",
  alternates: {
    canonical: `${SITE_URL}/cakes`,
  },
  openGraph: {
    title: "Cakes in Trichy | Lollipop Cake Shop",
    description:
      "Order fresh handcrafted cakes in Trichy from Lollipop Cake Shop. Choose from chocolate cakes, birthday cakes, custom cakes, and eggless cakes with fast cake delivery in Trichy.",
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
