import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Track Your Order | Live Cake Delivery Status",
  description:
    "Track your live cake order in real-time from Lollipop Cake Shop in Trichy. Instant updates on baking, packing, and rider delivery.",
  alternates: {
    canonical: `${SITE_URL}/track-order`,
  },
  openGraph: {
    title: "Track Your Order | Live Delivery Status | Lollipop Cake Shop",
    description:
      "Track your live cake order in real-time from Lollipop Cake Shop in Trichy. Instant updates on baking, packing, and rider delivery.",
    url: `${SITE_URL}/track-order`,
    siteName: "Lollipop Cake Shop",
    type: "website",
  },
};

export default function TrackOrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
