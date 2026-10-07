import { Suspense } from "react";
import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart/CartProvider";
import { ToastProvider } from "@/components/common/ToastProvider";
import RouteLoadingIndicator from "@/components/common/RouteLoadingIndicator";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingActions from "@/components/layout/FloatingActions";
import BakeryBackground from "@/components/layout/BakeryBackground";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.lollipopbakery.example"),
  title: {
    default: "Lollipop Cake Shop — Luxury Patisserie & Custom Cakes",
    template: "%s | Lollipop Cake Shop",
  },
  description:
    "Handcrafted luxury cakes, pastries and celebration desserts. Order custom birthday, wedding and bento cakes online with same-day delivery.",
  openGraph: {
    title: "Lollipop Cake Shop — Luxury Patisserie & Custom Cakes",
    description:
      "Handcrafted luxury cakes, pastries and celebration desserts, delivered fresh.",
    siteName: "Lollipop Cake Shop",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lollipop Cake Shop — Luxury Patisserie & Custom Cakes",
    description: "Handcrafted luxury cakes, pastries and celebration desserts.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${manrope.variable} scroll-smooth`} suppressHydrationWarning>
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <Suspense fallback={null}>
          <RouteLoadingIndicator />
        </Suspense>
        <ToastProvider>
          <CartProvider>
            <BakeryBackground />
            <Navbar />
            <main className="relative z-10">{children}</main>
            <Footer />
            <FloatingActions />
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
