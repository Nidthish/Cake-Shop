import type { Metadata } from "next";
import { getDbProducts } from "@/lib/products";
import DryCakesCatalogClient from "@/components/products/DryCakesCatalogClient";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dry Cakes in Trichy | Lollipop Cake Shop",
  description:
    "Delicious fresh dry cakes, traditional plum cakes, and tea time cakes baked daily in Trichy by Lollipop Cake Shop.",
  alternates: {
    canonical: `${SITE_URL}/dry-cakes`,
  },
  openGraph: {
    title: "Dry Cakes in Trichy | Lollipop Cake Shop",
    description:
      "Delicious fresh dry cakes, traditional plum cakes, and tea time cakes baked daily in Trichy by Lollipop Cake Shop.",
    url: `${SITE_URL}/dry-cakes`,
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
