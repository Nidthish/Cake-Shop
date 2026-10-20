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
  metadataBase: new URL("https://lollipopcakeshop.in"),
  title: {
    default: "Lollipop Cake Shop | Fresh Cakes, Snacks & Delivery in Trichy",
    template: "%s | Lollipop Cake Shop",
  },
  description:
    "Order fresh cakes, birthday cakes, customized cakes, bento cakes, dry cakes and snacks online from Lollipop Cake Shop in Trichy. Enjoy convenient delivery and special offers.",
  keywords: [
    "Lollipop Cake Shop",
    "Lollipop Cake Shop Trichy",
    "Lollipop cakes",
    "Lollipop cake shop Trichy",
    "Lollipop bakery Trichy",
    "Lollipop cakes Trichy",
    "Lollipop online cake shop",
    "Lollipop cake delivery Trichy",
    "Lollipop customized cakes",
    "Lollipop bento cakes",
    "Lollipop snacks Trichy",
    "lollipopcakeshop.in",
    "best fresh cakes in Trichy",
    "best cake shop in Trichy",
    "cake shop in Trichy",
    "fresh cakes in Trichy",
    "online cake shop in Trichy",
    "order cake online in Trichy",
    "cake delivery in Trichy",
    "fast cake delivery in Trichy",
    "birthday cakes in Trichy",
    "customized cakes in Trichy",
    "chocolate cake in Trichy",
    "wedding cakes in Trichy",
    "bento cakes in Trichy",
    "dry cakes in Trichy",
    "snacks in Trichy",
    "online snacks shop in Trichy",
    "cake offers in Trichy",
    "1 kg cake + 1/2 kg free Trichy",
  ],
  alternates: {
    canonical: "https://lollipopcakeshop.in",
  },
  openGraph: {
    title: "Lollipop Cake Shop | Fresh Cakes, Snacks & Delivery in Trichy",
    description:
      "Order fresh cakes, birthday cakes, customized cakes, bento cakes, dry cakes and snacks online from Lollipop Cake Shop in Trichy. Enjoy convenient delivery and special offers.",
    siteName: "Lollipop Cake Shop",
    url: "https://lollipopcakeshop.in",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/PRODUCT_IMAGES/cakes/NORMAL%20CAKES/black_forest.webp",
        width: 1200,
        height: 630,
        alt: "Lollipop Cake Shop Trichy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lollipop Cake Shop | Fresh Cakes, Snacks & Delivery in Trichy",
    description:
      "Order fresh cakes, birthday cakes, customized cakes, bento cakes, dry cakes and snacks online from Lollipop Cake Shop in Trichy.",
    images: ["/PRODUCT_IMAGES/cakes/NORMAL%20CAKES/black_forest.webp"],
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Lollipop Cake Shop",
  alternateName: ["Lollipop", "Lollipop The Cake Shop"],
  url: "https://lollipopcakeshop.in/",
};

const bakerySchema = {
  "@context": "https://schema.org",
  "@type": "Bakery",
  "@id": "https://lollipopcakeshop.in/#bakery",
  name: "Lollipop Cake Shop",
  alternateName: ["Lollipop The Cake Shop", "Lollipop Cakes Trichy"],
  url: "https://lollipopcakeshop.in",
  logo: "https://lollipopcakeshop.in/images/logo_master_inner_balanced.png",
  image: "https://lollipopcakeshop.in/PRODUCT_IMAGES/cakes/NORMAL%20CAKES/black_forest.webp",
  description:
    "Handcrafted fresh cakes, birthday cakes, customized cakes, bento cakes, dry cakes and snacks online from Lollipop Cake Shop in Trichy.",
  telephone: "+91 84893 24697",
  email: "trichylollipop@gmail.com",
  priceRange: "₹₹",
  currenciesAccepted: "INR",
  paymentAccepted: "Cash, Credit Card, Debit Card, UPI, Net Banking",
  servesCuisine: ["Bakery", "Cakes", "Pastries", "Snacks", "Desserts"],
  address: {
    "@type": "PostalAddress",
    streetAddress: "150, N Andar St",
    addressLocality: "Tiruchirappalli",
    addressRegion: "Tamil Nadu",
    postalCode: "620002",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 10.8275,
    longitude: 78.6946,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "08:00",
      closes: "22:00",
    },
  ],
  hasMap: "https://maps.google.com/?q=Lollipop+The+Cake+Shop+Trichy",
  sameAs: [
    "https://timesofindia.indiatimes.com/city/trichy/home-bakers-in-trichy-see-rising-demand-for-custom-cakes/amp_articleshow/116636146.cms",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${manrope.variable} scroll-smooth`} suppressHydrationWarning>
      <head>
        {/* Google Site Name & Local Business Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(bakerySchema) }}
        />
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
