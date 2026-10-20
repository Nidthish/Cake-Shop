import type { Metadata } from "next";
import CustomCakeClient from "@/components/custom-cake/CustomCakeClient";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Custom Cakes in Trichy | Lollipop Cake Shop",
  description:
    "Order handcrafted custom cakes in Trichy from Lollipop Cake Shop. Specializing in custom birthday cakes, designer cakes in Trichy, theme cakes, and photo cakes.",
  alternates: {
    canonical: `${SITE_URL}/custom-cake`,
  },
  openGraph: {
    title: "Custom Cakes in Trichy | Lollipop Cake Shop",
    description:
      "Order handcrafted custom cakes in Trichy from Lollipop Cake Shop. Specializing in custom birthday cakes, designer cakes in Trichy, theme cakes, and photo cakes.",
    url: `${SITE_URL}/custom-cake`,
    siteName: "Lollipop Cake Shop",
    type: "website",
  },
};

export default function CustomCakePage() {
  return <CustomCakeClient />;
}
