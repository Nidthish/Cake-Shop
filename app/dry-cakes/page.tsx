import type { Metadata } from "next";
import { getDbProducts } from "@/lib/products";
import DryCakesCatalogClient from "@/components/products/DryCakesCatalogClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dry Cakes in Trichy | Freshly Baked Tea Time Cakes | Lollipop Cake Shop",
  description:
    "Delicious fresh dry cakes, plum cakes, and tea cakes baked daily in Trichy by Lollipop Cake Shop.",
  alternates: {
    canonical: "https://lollipopcakeshop.in/dry-cakes",
  },
  keywords: [
    "dry cakes in Trichy",
    "tea cakes Trichy",
    "plum cake Trichy",
    "banana walnut cake Trichy",
    "Lollipop Cake Shop dry cakes",
    "tea time cakes Trichy",
  ],
  openGraph: {
    title: "Dry Cakes in Trichy | Freshly Baked Tea Time Cakes | Lollipop Cake Shop",
    description:
      "Delicious fresh dry cakes, plum cakes, and tea cakes baked daily in Trichy by Lollipop Cake Shop.",
    url: "https://lollipopcakeshop.in/dry-cakes",
    siteName: "Lollipop Cake Shop",
    type: "website",
  },
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
