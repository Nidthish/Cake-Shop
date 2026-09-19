import type { MetadataRoute } from "next";
import { getAllProductSlugs } from "@/lib/products";

const BASE_URL = "https://www.lollipopbakery.example";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "", "cakes", "dry-cakes", "snacks", "bento-cake", "first-birthday",
    "wedding-cakes", "custom-cake", "about", "cart",
  ].map((path) => ({
    url: `${BASE_URL}/${path}`,
    lastModified: new Date(),
  }));

  const productRoutes = getAllProductSlugs().map((slug) => ({
    url: `${BASE_URL}/products/${slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...productRoutes];
}
