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
import { SITE_URL } from "@/lib/site";

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
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Lollipop Cake Shop Trichy | Birthday & Custom Cakes",
    template: "%s | Lollipop Cake Shop",
  },
  description:
    "Lollipop Cake Shop in Trichy offers fresh birthday cakes, custom cakes, wedding cakes, bento cakes, eggless cakes, pastries and snacks. Order cakes online in Tiruchirappalli.",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "Lollipop Cake Shop Trichy | Birthday & Custom Cakes",
    description:
      "Lollipop Cake Shop in Trichy offers fresh birthday cakes, custom cakes, wedding cakes, bento cakes, eggless cakes, pastries and snacks. Order cakes online in Tiruchirappalli.",
    siteName: "Lollipop Cake Shop",
    url: SITE_URL,
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/PRODUCT_IMAGES/cakes/NORMAL%20CAKES/black_forest.webp",
        width: 1200,
        height: 630,
        alt: "Birthday cake from Lollipop Cake Shop in Trichy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lollipop Cake Shop Trichy | Birthday & Custom Cakes",
    description:
      "Lollipop Cake Shop in Trichy offers fresh birthday cakes, custom cakes, wedding cakes, bento cakes, eggless cakes, pastries and snacks. Order cakes online in Tiruchirappalli.",
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
  alternateName: [
    "Lollipop The Cake Shop",
    "Lollipop Cake Shop Trichy",
    "Lollipop Cake Shop Tiruchirappalli",
  ],
  url: `${SITE_URL}/`,
};

const bakerySchema = {
  "@context": "https://schema.org",
  "@type": "Bakery",
  "@id": `${SITE_URL}/#bakery`,
  name: "Lollipop Cake Shop",
  alternateName: [
    "Lollipop The Cake Shop",
    "Lollipop Cake Shop Trichy",
    "Lollipop Cake Shop Tiruchirappalli",
    "Lollipop cakes Trichy",
  ],
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo_master_inner_balanced.png`,
  image: `${SITE_URL}/PRODUCT_IMAGES/cakes/NORMAL%20CAKES/black_forest.webp`,
  description:
    "Lollipop Cake Shop in Trichy offers fresh birthday cakes, custom cakes, wedding cakes, bento cakes, eggless cakes, pastries and snacks. Order cakes online in Tiruchirappalli.",
  telephone: "+91 84893 24697",
  email: "trichylollipop@gmail.com",
  priceRange: "₹₹",
  currenciesAccepted: "INR",
  paymentAccepted: "Cash, Credit Card, Debit Card, UPI, Net Banking",
  servesCuisine: [
    "Bakery",
    "Cakes",
    "Birthday Cakes",
    "Custom Cakes",
    "Wedding Cakes",
    "Bento Cakes",
    "Pastries",
    "Snacks",
  ],
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
