import type { Metadata } from "next";
import CustomCakeClient from "@/components/custom-cake/CustomCakeClient";

export const metadata: Metadata = {
  title: "Customized Cakes in Trichy | Photo & Designer Cakes | Lollipop Cake Shop",
  description:
    "Order custom designed, photo and theme cakes handcrafted for your special celebration in Trichy by Lollipop Cake Shop.",
  alternates: {
    canonical: "https://lollipopcakeshop.in/custom-cake",
  },
  keywords: [
    "customized cakes in Trichy",
    "photo cake Trichy",
    "theme cakes Trichy",
    "designer cakes Trichy",
    "custom cakes trichy",
    "bespoke wedding cakes trichy",
    "1st birthday cake trichy",
    "designer cakes tiruchirappalli",
    "floating tier cake trichy",
    "fondant birthday cakes trichy",
    "multi tier wedding cake trichy",
  ],
  openGraph: {
    title: "Customized Cakes in Trichy | Photo & Designer Cakes | Lollipop Cake Shop",
    description:
      "Order custom designed, photo and theme cakes handcrafted for your special celebration in Trichy by Lollipop Cake Shop.",
    url: "https://lollipopcakeshop.in/custom-cake",
    siteName: "Lollipop Cake Shop",
    type: "website",
  },
};

export default function CustomCakePage() {
  return <CustomCakeClient />;
}
