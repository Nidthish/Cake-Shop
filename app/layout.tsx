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
  applicationName: "Lollipop Cake Shop",
  title: {
    default: "Lollipop Cake Shop",
    template: "%s | Lollipop Cake Shop",
  },
  description:
    "Order fresh cakes, birthday cakes, customized cakes, bento cakes, dry cakes and snacks online from Lollipop Cake Shop in Trichy. Handcrafted daily with same-day doorstep delivery.",
  keywords: [
    "Lollipop Cake Shop",
    "Lollipop Cake Shop Trichy",
    "Trichy Lollipop The Cake Shop",
    "Lollipop The Cake Shop",
    "Lollipop cakes",
    "Lollipop bakery Trichy",
    "best cake shop in Trichy",
    "fresh cakes in Trichy",
    "online cake shop in Trichy",
    "cake delivery in Trichy",
    "customized cakes in Trichy",
    "birthday cakes in Trichy",
    "bento cakes in Trichy",
    "wedding cakes in Trichy",
    "dry cakes in Trichy",
    "snacks in Trichy",
    "cake shop Townhall Trichy",
    "cake shop Sanjeevi Nagar Trichy",
    "cake shop Andar Veedhi Trichy",
  ],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "Lollipop Cake Shop",
    description:
      "Order fresh cakes, birthday cakes, customized cakes, bento cakes, dry cakes and snacks online from Lollipop Cake Shop in Trichy. Handcrafted daily with same-day doorstep delivery.",
    siteName: "Lollipop Cake Shop",
    url: SITE_URL,
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "Lollipop Cake Shop Logo",
      },
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
    title: "Lollipop Cake Shop",
    description:
      "Order fresh cakes, birthday cakes, customized cakes, bento cakes, dry cakes and snacks online from Lollipop Cake Shop in Trichy.",
    images: ["/PRODUCT_IMAGES/cakes/NORMAL%20CAKES/black_forest.webp"],
  },
  icons: {
    icon: [
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
      { url: "/favicon.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
    ],
    shortcut: "/icon.png",
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
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
  "@id": `${SITE_URL}/#website`,
  name: "Lollipop Cake Shop",
  alternateName: [
    "Lollipop The Cake Shop",
    "Trichy Lollipop The Cake Shop",
    "Lollipop Cakes Trichy",
    "Lollipop Bakery",
    "Lollipop",
  ],
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/cakes?search={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

const sitelinksNavigationSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "@id": `${SITE_URL}/#sitelinks`,
  name: "Lollipop Cake Shop Sitelinks",
  description: "Primary departments and popular services at Lollipop Cake Shop",
  itemListElement: [
    {
      "@type": "SiteNavigationElement",
      position: 1,
      name: "Signature Cakes",
      description: "Handcrafted fresh birthday, chocolate, and celebration cakes in Trichy.",
      url: `${SITE_URL}/cakes`,
    },
    {
      "@type": "SiteNavigationElement",
      position: 2,
      name: "Custom Cake Studio",
      description: "Interactive 3D cake customizer for personalized milestone celebration cakes.",
      url: `${SITE_URL}/custom-cake`,
    },
    {
      "@type": "SiteNavigationElement",
      position: 3,
      name: "Korean Bento Cakes",
      description: "Cute aesthetic mini lunchbox bento cakes with custom icing messages.",
      url: `${SITE_URL}/bento-cake`,
    },
    {
      "@type": "SiteNavigationElement",
      position: 4,
      name: "Gourmet Snacks & Pastries",
      description: "Fresh baked puffs, rolls, brownies, savory treats, and bakery breads.",
      url: `${SITE_URL}/snacks`,
    },
    {
      "@type": "SiteNavigationElement",
      position: 5,
      name: "Track Your Order",
      description: "Live real-time order tracking and delivery status in Trichy.",
      url: `${SITE_URL}/track-order`,
    },
    {
      "@type": "SiteNavigationElement",
      position: 6,
      name: "Contact & Bakery Outlets",
      description: "Visit our Trichy branches at Sanjeevi Nagar & Andar Veedhi.",
      url: `${SITE_URL}/contact-us`,
    },
  ],
};

const bakerySchema = {
  "@context": "https://schema.org",
  "@type": "Bakery",
  "@id": `${SITE_URL}/#bakery`,
  name: "Lollipop Cake Shop",
  alternateName: [
    "Lollipop The Cake Shop",
    "Trichy Lollipop The Cake Shop",
    "Trichy Lollipop The Cake Shop in Tiruchirappalli Townhall",
    "Lollipop Cakes Trichy",
    "Lollipop Bakery",
  ],
  url: SITE_URL,
  logo: `${SITE_URL}/icon.png`,
  image: [
    `${SITE_URL}/icon.png`,
    `${SITE_URL}/PRODUCT_IMAGES/cakes/NORMAL%20CAKES/black_forest.webp`,
  ],
  description:
    "Handcrafted fresh cakes, birthday cakes, customized cakes, bento cakes, dry cakes and snacks online from Lollipop Cake Shop in Trichy.",
  telephone: "+91 84893 24697",
  email: "trichylollipop@gmail.com",
  priceRange: "₹₹",
  currenciesAccepted: "INR",
  paymentAccepted: "Cash, Credit Card, Debit Card, UPI, Net Banking",
  servesCuisine: ["Bakery", "Cakes", "Pastries", "Snacks", "Desserts"],
  hasMenu: `${SITE_URL}/cakes`,
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "1280",
    bestRating: "5",
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: "150, N Andar St, Townhall",
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
    "https://www.justdial.com/Trichy/Trichy-Lollipop-The-Cake-Shop-Townhall-Trichy",
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
        {/* Google Site Name & Identity Metas */}
        <meta name="application-name" content="Lollipop Cake Shop" />
        <meta name="apple-mobile-web-app-title" content="Lollipop Cake Shop" />
        <meta property="og:site_name" content="Lollipop Cake Shop" />

        {/* 1. Google Site Name & Search Action Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        {/* 2. Google Sitelinks Navigation Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(sitelinksNavigationSchema) }}
        />
        {/* 3. Official Local Bakery Business Schema */}
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
