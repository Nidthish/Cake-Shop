/**
 * Canonical Site & Asset Domain Configuration
 * Ensures consistent canonical URLs across SEO, OpenGraph, JSON-LD schema, and image serving.
 */

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "") ||
  "https://www.lollipopcakeshop.in";

export const SITE_DOMAIN = "www.lollipopcakeshop.in";
export const APEX_DOMAIN = "lollipopcakeshop.in";

export const IMAGE_DOMAIN = "images.lollipopcakeshop.in";

export const IMAGE_PUBLIC_URL =
  process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.trim().replace(/\/+$/, "") ||
  process.env.CLOUDFLARE_R2_PUBLIC_URL?.trim().replace(/\/+$/, "") ||
  "https://images.lollipopcakeshop.in";
