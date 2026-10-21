import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us & Bakery Outlets in Trichy",
  description:
    "Visit Lollipop Cake Shop in Trichy at Sanjeevi Nagar & Andar Veedhi. Contact our bakery team for custom cake consultations, delivery inquiries, and orders.",
  alternates: {
    canonical: `${SITE_URL}/contact-us`,
  },
  openGraph: {
    title: "Contact Us & Bakery Outlets in Trichy | Lollipop Cake Shop",
    description:
      "Visit Lollipop Cake Shop in Trichy at Sanjeevi Nagar & Andar Veedhi. Contact our bakery team for custom cake consultations, delivery inquiries, and orders.",
    url: `${SITE_URL}/contact-us`,
    siteName: "Lollipop Cake Shop",
    type: "website",
  },
};

export default function ContactUsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
