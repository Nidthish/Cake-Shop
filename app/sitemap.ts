import type { MetadataRoute } from "next";
import { getAllProductSlugs } from "@/lib/products";
import { SITE_URL } from "@/lib/site";

const BASE_URL = SITE_URL;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "cakes",
    "dry-cakes",
    "custom-cake",
    "first-birthday",
    "wedding-cakes",
    "bento-cake",
    "snacks",
    "about",
    "contact-us",
    "shipping-policy",
    "privacy-policy",
    "terms-and-conditions",
    "refund-policy",
  ].map((path) => ({
    url: path ? `${BASE_URL}/${path}` : `${BASE_URL}/`,
    lastModified: new Date(),
    changeFrequency: path === "" ? ("daily" as const) : ("weekly" as const),
    priority: path === "" ? 1.0 : 0.8,
  }));

  const productRoutes = getAllProductSlugs().map((slug) => ({
    url: `${BASE_URL}/products/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...productRoutes];
}
