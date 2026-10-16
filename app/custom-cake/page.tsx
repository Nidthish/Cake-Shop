import type { Metadata } from "next";
import CustomCakeClient from "@/components/custom-cake/CustomCakeClient";

export const metadata: Metadata = {
  title: "Custom Cakes in Trichy — Bespoke 1st Birthday & Luxury Wedding Cakes",
  description:
    "Explore Trichy's finest handcrafted custom cake showcase by Lollipop Cake Studio. Bespoke 1st birthday milestone cakes, luxury multi-tiered wedding centerpieces, and architectural floating tier cakes. Personal chef consultation on WhatsApp.",
  keywords: [
    "custom cakes trichy",
    "bespoke wedding cakes trichy",
    "1st birthday cake trichy",
    "designer cakes tiruchirappalli",
    "floating tier cake trichy",
    "fondant birthday cakes trichy",
    "multi tier wedding cake trichy",
  ],
  openGraph: {
    title: "Custom Cake Portfolio | Lollipop Cake Studio Trichy",
    description:
      "A curated lookbook of handcrafted 1st birthday milestones and luxury wedding centerpieces. Delivered across Tiruchirappalli.",
  },
};

export default function CustomCakePage() {
  return <CustomCakeClient />;
}
