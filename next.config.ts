import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.lollipopcakeshop.in" },
      { protocol: "https", hostname: "www.lollipopcakeshop.in" },
      { protocol: "https", hostname: "lollipopcakeshop.in" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "api.qrserver.com" },
      { protocol: "https", hostname: "pub-cc78f2072e744ca2a82f1b0346156699.r2.dev" },
      { protocol: "https", hostname: "**.r2.dev" },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      {
        source: "/wedding",
        destination: "/wedding-cakes",
        permanent: true,
      },
      {
        source: "/1st-birthday",
        destination: "/first-birthday",
        permanent: true,
      },
      {
        source: "/contact",
        destination: "/contact-us",
        permanent: true,
      },
      {
        source: "/offers",
        destination: "/cakes",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/PRODUCT_IMAGES/cakes/black_forest:suffix(.*)",
        destination: "/PRODUCT_IMAGES/cakes/NORMAL CAKES/black_forest.webp",
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "origin-when-cross-origin" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
