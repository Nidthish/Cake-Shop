import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/api/",
        "/cart/",
        "/checkout/",
        "/account/",
        "/login/",
        "/register/",
        "/order/",
        "/delivery/",
      ],
    },
    sitemap: "https://lollipopcakeshop.in/sitemap.xml",
  };
}
