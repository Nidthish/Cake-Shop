import type { Metadata } from "next";
import Link from "next/link";
import { getDbProducts, getProductsByCategory, PRODUCTS_DATA } from "@/lib/products";
import ProductCard from "@/components/products/ProductCard";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Lollipop Cake Shop",
  description:
    "Order fresh cakes, birthday cakes, customized cakes, bento cakes, dry cakes and snacks online from Lollipop Cake Shop in Trichy. Handcrafted fresh daily with same-day delivery across Tiruchirappalli.",
  alternates: {
    canonical: SITE_URL,
  },
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
    "fast cake delivery in Trichy",
    "birthday cakes in Trichy",
    "customized cakes in Trichy",
    "chocolate cake in Trichy",
    "wedding cakes in Trichy",
    "bento cakes in Trichy",
    "dry cakes in Trichy",
    "snacks in Trichy",
    "cake shop Townhall Trichy",
    "cake shop Sanjeevi Nagar Trichy",
    "cake shop Andar Veedhi Trichy",
  ],
  openGraph: {
    title: "Lollipop Cake Shop",
    description:
      "Order fresh cakes, birthday cakes, customized cakes, bento cakes, dry cakes and snacks online from Lollipop Cake Shop in Trichy. Handcrafted fresh daily with same-day delivery across Tiruchirappalli.",
    url: SITE_URL,
    siteName: "Lollipop Cake Shop",
    locale: "en_IN",
    type: "website",
  },
};

const OCCASIONS = [
  {
    id: "first-birthday",
    badge: "Milestone",
    title: "1st Birthday\nSmash",
    tagline: "Pure & Low Sugar",
    desc: "Crafted tenderly with organic, low-sugar ingredients perfect for baby's first celebration.",
    image: "/images/celebration_opt/1st_birthdaycake.png",
    href: "/first-birthday",
    iconType: "cake",
    doodle: null,
    doodleClass: "",
    isPrimary: true,
    archClass: "right-0 top-3 sm:top-4 bottom-0 w-[52%] sm:w-[50%] bg-[#FAF0EB] rounded-tl-full rounded-tr-[28px] rounded-br-[28px]",
  },
  {
    id: "wedding",
    badge: "Luxury",
    title: "Wedding\nCenterpieces",
    tagline: "Multi-tiered Luxury",
    desc: "Bespoke tier architecture decorated with edible gold leaf and delicate sugar flowers.",
    image: "/images/celebration_opt/weddingcake.png",
    href: "/wedding-cakes",
    iconType: "rings",
    doodle: null,
    doodleClass: "",
    isPrimary: false,
    archClass: "right-0 top-3 sm:top-4 bottom-0 w-[52%] sm:w-[50%] bg-[#F6ECE4] rounded-tl-full rounded-tr-[28px] rounded-br-[28px]",
  },
  {
    id: "custom",
    badge: "Personalized",
    title: "Custom 3D\nStudio",
    tagline: "Bespoke Custom Design",
    desc: "You imagine it, our master bakers bring your dream cake concept to sweet reality.",
    image: "/images/celebration_opt/customizecake.png",
    href: "/custom-cake",
    iconType: "cake",
    doodle: null,
    doodleClass: "",
    isPrimary: false,
    archClass: "right-0 top-3 sm:top-4 bottom-0 w-[52%] sm:w-[50%] bg-[#FAF0EB] rounded-tl-full rounded-tr-[28px] rounded-br-[28px]",
  },
  {
    id: "bento",
    badge: "Trending",
    title: "Korean Bento\nBox",
    tagline: "Cute 300g Mini Treats",
    desc: "Adorable mini cakes packed in eco-friendly minimalist bento boxes with wooden cutlery.",
    image: "/images/celebration_opt/betocake.png",
    href: "/bento-cake",
    iconType: "gift",
    doodle: "heart",
    doodleClass: "right-4 sm:right-5 top-4 sm:top-5",
    isPrimary: false,
    archClass: "right-0 top-3 sm:top-4 bottom-0 w-[52%] sm:w-[50%] bg-[#F8EFE7] rounded-tl-full rounded-tr-[28px] rounded-br-[28px]",
  },
];

const CATEGORY_SHOWCASES = [
  {
    id: "cakes",
    slug: "cakes",
    title: "Normal Cakes",
    subtitle: "A SLICE OF SWEET MEMORIES",
    desc: "Classic flavours, baked for every sweet moment.",
    cta: "EXPLORE THE CLASSICS →",
    href: "/cakes",
  },
  {
    id: "first-birthday",
    slug: "first-birthday",
    title: "1st Birthday Cakes",
    subtitle: "A WISH FOR THEIR FIRST",
    desc: "Magical cakes for their very first celebration.",
    cta: "MAKE A WISH →",
    href: "/first-birthday",
  },
  {
    id: "wedding-cakes",
    slug: "wedding-cakes",
    title: "Wedding Cakes",
    subtitle: "LOVE, LAYER BY LAYER",
    desc: "Elegant creations for your forever moment.",
    cta: "EXPLORE THE COLLECTION →",
    href: "/wedding-cakes",
  },
  {
    id: "bento-cake",
    slug: "bento-cake",
    title: "Bento Cakes",
    subtitle: "LITTLE CAKES, BIG LOVE",
    desc: "Tiny treats made for the moments that matter.",
    cta: "DISCOVER LITTLE DELIGHTS →",
    href: "/bento-cake",
  },
  {
    id: "snacks",
    slug: "snacks",
    title: "Snacks & Pastries",
    subtitle: "LITTLE BITES OF HAPPINESS",
    desc: "Freshly baked delights for every little craving.",
    cta: "EXPLORE THE BAKES →",
    href: "/snacks",
  },
  {
    id: "custom-cake",
    slug: "cakes", // fallback catalog products
    title: "Customised Cakes",
    subtitle: "MADE FROM YOUR IMAGINATION",
    desc: "You imagine it. We turn it into cake.",
    cta: "CREATE YOUR DREAM CAKE →",
    href: "/custom-cake",
  },
];

const REVIEWS = [
  {
    name: "Shirly Joeshirly",
    location: "",
    rating: 4.5,
    text: "Ordered for my daughter’s birthday. Loved their service, on-time delivery and the cake was fantastic. The taste was really awesome. My kid and whole family enjoyed the flavour and finishing of the cake.",
    initial: "S",
  },
  {
    name: "Hajira Jagan",
    location: "",
    rating: 5,
    text: "The strawberry pinata choco truffle cake was very tasty and worth the amount. Comfortable payment option and correct-time delivery.",
    initial: "H",
  },
  {
    name: "Christelle Mendoza",
    location: "Philippines",
    rating: 4.5,
    text: "Pastry is very tasty and service is recommendable. I’m ordering all the way from Philippines for my father-in-law. Special thanks to Guru.",
    initial: "C",
  },
  {
    name: "Ramya",
    location: "",
    rating: 5,
    text: "Their food is not only tasty, but the staff is also incredibly friendly and welcoming. I was blown away by the good quantity of food they offer.",
    initial: "R",
  },
];

export default async function HomePage() {
  const allProducts = await getDbProducts();

  return (
    <div className="relative overflow-x-hidden min-h-screen bg-[#FFF9F5]/30">
      {/* ───────────────────────────────────────────────────────────────
         1. HERO SECTION
         ─────────────────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-b from-[#FAF3EC]/30 via-transparent to-[#FFF9F5]/25 py-10 lg:py-16 xl:py-20 lg:min-h-[calc(100vh-5rem)] lg:flex lg:flex-col lg:justify-center overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-8 xl:gap-12 items-center w-full">
          {/* Hero Left Content */}
          <div className="text-center lg:text-left space-y-6 lg:space-y-6 xl:space-y-7 z-10">
            <h1 className="font-display text-4xl sm:text-6xl lg:text-[52px] xl:text-[66px] 2xl:text-7xl font-bold text-[#1C0D0A] leading-[1.02] lg:leading-[1.05] tracking-tight">
              <span className="sr-only">LollipopCakeShop — </span>
              Sweet{" "}
              <span className="relative inline-block text-[#962854] font-display italic font-semibold">
                Moments.
                {/* Sparkle burst at top right */}
                <svg
                  className="absolute -top-2.5 -right-3.5 sm:-top-4 sm:-right-5 lg:-top-3.5 lg:-right-4.5 xl:-top-4 xl:-right-5 w-7 h-7 sm:w-10 sm:h-10 lg:w-9 lg:h-9 xl:w-10 xl:h-10 text-[#BD426B] pointer-events-none"
                  viewBox="0 0 28 28"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                >
                  <line x1="7" y1="14" x2="10" y2="2" />
                  <line x1="12" y1="16" x2="23" y2="6" />
                  <line x1="14" y1="21" x2="26" y2="18" />
                </svg>
              </span>
              <br />
              Beautifully{" "}
              <span className="inline-flex items-center text-[#962854] font-display italic font-semibold">
                Baked.
                {/* Heart outline icon */}
                <svg
                  className="inline-block ml-2 sm:ml-3 lg:ml-2.5 w-5 h-5 sm:w-7 sm:h-7 lg:w-6 lg:h-6 text-[#BD426B] not-italic shrink-0 -mt-0.5 sm:-mt-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#5C524E] font-normal max-w-lg lg:max-w-xl leading-relaxed pt-1 lg:pt-1 mx-auto lg:mx-0">
              Premium cakes in Trichy, handcrafted with love and baked fresh daily to make every celebration a little more special and unforgettable.
            </p>

            {/* CTA Buttons & Master Chef Promise Card (Locked Same-Width Alignment) */}
            <div className="w-full max-w-[440px] sm:max-w-[460px] mx-auto lg:mx-0 space-y-2.5 sm:space-y-3 pt-1.5 sm:pt-2 lg:pt-1.5">
              {/* Row 1: The Two Action Buttons */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 w-full">
                <Link
                  href="/cakes"
                  className="btn-primary py-3 sm:py-3.5 lg:py-3.5 px-2 xs:px-3 sm:px-5 text-[10px] xs:text-[11px] sm:text-xs font-bold uppercase tracking-normal sm:tracking-wider shadow-lg flex items-center justify-center gap-1 sm:gap-2 w-full text-center whitespace-nowrap"
                >
                  <span>VIEW OUR CAKES</span>
                  <span className="material-symbols-outlined text-xs sm:text-sm shrink-0">east</span>
                </Link>
                <Link
                  href="/custom-cake"
                  className="btn-secondary py-3 sm:py-3.5 lg:py-3.5 px-2 xs:px-3 sm:px-5 text-[10px] xs:text-[11px] sm:text-xs font-bold uppercase tracking-normal sm:tracking-wider flex items-center justify-center gap-1 sm:gap-2 shadow-sm w-full text-center whitespace-nowrap"
                >
                  <span>CUSTOM CAKE</span>
                  <span className="material-symbols-outlined text-xs sm:text-sm shrink-0">east</span>
                </Link>
              </div>

              {/* Row 2: Master Chef Quality Promise Banner (Exact same width as above two combined) */}
              <Link
                href="/about"
                className="group relative flex items-center justify-between gap-2.5 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 lg:py-2.5 xl:py-3 rounded-2xl bg-gradient-to-r from-[#FCEBED] via-[#FDF0F1] to-[#FCEBED] border border-[#F5D6D9] shadow-xs hover:shadow-md hover:border-[#E8B5BD] transition-all overflow-hidden w-full block"
              >
                {/* Decorative organic petal shape at bottom right */}
                <div className="absolute right-0 bottom-0 w-24 h-20 rounded-tl-[48px] bg-gradient-to-tl from-[#F4CCD1]/50 to-transparent pointer-events-none" />

                <div className="flex items-center gap-2.5 sm:gap-3 relative z-10 text-left min-w-0">
                  {/* Chef Hat Icon with Sparkles */}
                  <div className="w-9 h-9 sm:w-11 sm:h-11 lg:w-10 lg:h-10 xl:w-11 xl:h-11 rounded-full bg-[#F0D0D3] flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                    <svg
                      viewBox="0 0 32 32"
                      className="w-5 h-5 sm:w-6 sm:h-6 lg:w-5.5 lg:h-5.5 text-[#561027]"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {/* Sparkle rays */}
                      <line x1="22" y1="6" x2="25" y2="3" />
                      <line x1="25" y1="9" x2="28" y2="8" />
                      <line x1="24" y1="12" x2="27" y2="13" />

                      {/* Chef Hat Toque */}
                      <path d="M7 19c-1.5-1-2-3-1-5s3-2.5 4.5-1.5c.5-2 2-3.5 4.5-3.5s4 1.5 4.5 3.5c1.5-1 3.5-.5 4.5 1.5s.5 4-1 5" />

                      {/* Hat Band */}
                      <rect x="7" y="19" width="16" height="7" rx="1.5" />
                      {/* Pleats */}
                      <line x1="12" y1="21" x2="12" y2="24" />
                      <line x1="18" y1="21" x2="18" y2="24" />
                    </svg>
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-serif font-bold text-xs xs:text-sm sm:text-base lg:text-sm xl:text-base text-[#561027] leading-tight group-hover:text-[#802348] transition-colors truncate sm:whitespace-normal">
                      Master Chef Signature Recipes
                    </h3>
                    <p className="text-[10px] xs:text-[11px] sm:text-xs lg:text-[11px] xl:text-xs text-[#736367] mt-0.5 leading-snug line-clamp-1 sm:line-clamp-none">
                      Handcrafted with Premium Ingredients & Loving Care
                    </p>
                  </div>
                </div>

                {/* Right Arrow Circle */}
                <div className="w-7 h-7 sm:w-8 sm:h-8 lg:w-7 lg:h-7 xl:w-8 xl:h-8 rounded-full bg-[#FCE0E1] flex items-center justify-center shrink-0 relative z-10 group-hover:bg-[#F9D2D4] group-hover:translate-x-0.5 transition-all">
                  <span className="material-symbols-outlined text-sm sm:text-base lg:text-sm text-[#561027]">
                    arrow_forward
                  </span>
                </div>
              </Link>
            </div>

            {/* Trust Stats Bar */}
            <div className="pt-5 sm:pt-6 lg:pt-6 xl:pt-8 border-t border-[#E6C184]/30 grid grid-cols-3 gap-3 sm:gap-4 text-center lg:text-left w-full max-w-[440px] sm:max-w-[460px] mx-auto lg:mx-0">
              <div>
                <span className="font-display text-2xl sm:text-3xl lg:text-2xl xl:text-3xl font-bold text-[#1C0D0A] block">10,000+</span>
                <span className="text-[11px] lg:text-[11px] xl:text-xs text-[#5C524E] uppercase tracking-wider font-bold">Cakes Delivered</span>
              </div>
              <div>
                <span className="font-display text-2xl sm:text-3xl lg:text-2xl xl:text-3xl font-bold text-[#1C0D0A] block">4.9 ★</span>
                <span className="text-[11px] lg:text-[11px] xl:text-xs text-[#5C524E] uppercase tracking-wider font-bold">Customer Rating</span>
              </div>
              <div>
                <span className="font-display text-2xl sm:text-3xl lg:text-2xl xl:text-3xl font-bold text-[#1C0D0A] block">2 Hours</span>
                <span className="text-[11px] lg:text-[11px] xl:text-xs text-[#5C524E] uppercase tracking-wider font-bold">Express Delivery</span>
              </div>
            </div>
          </div>

          {/* Hero Right Interactive Graphic */}
          <div id="hero-cake-container" className="relative flex justify-center items-center py-4 lg:py-0 order-first lg:order-last">
            <div className="relative w-80 h-80 sm:w-[420px] sm:h-[420px] md:w-[480px] md:h-[480px] lg:w-[470px] lg:h-[470px] xl:w-[510px] xl:h-[510px] 2xl:w-[550px] 2xl:h-[550px] flex items-center justify-center animate-hero-float">
              {/* 3D Glowing Ambient Aura */}
              <div className="absolute inset-4 bg-gradient-to-tr from-[#962854]/25 via-[#E6C184]/35 to-pink-300/40 rounded-full blur-3xl transform scale-105 animate-pulse" />

              {/* 3D Base Shadow */}
              <div className="absolute -bottom-4 w-3/4 h-8 bg-[#1C0D0A]/15 rounded-full blur-xl transform scale-x-90 animate-bounce-slow" />

              {/* Layer 1: Revolving Hot-Pink Scalloped Border */}
              <div className="absolute inset-0 w-full h-full flex items-center justify-center z-10 pointer-events-none animate-wave-border-revolve">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/logo_master_border_balanced.png"
                  alt="Revolving Wavy Scalloped Border Badge"
                  className="w-full h-full object-contain drop-shadow-xl"
                />
              </div>

              {/* Layer 2: Master Inner Logo Content */}
              <div className="absolute inset-0 w-full h-full flex items-center justify-center z-20 pointer-events-none">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  id="hero-cake-img"
                  src="/images/logo_master_inner_balanced.png"
                  alt="Lollipop The Cake Shop Signature Logo"
                  className="w-full h-full object-contain select-none cursor-pointer drop-shadow-sm transition-transform duration-300"
                />
              </div>

              {/* Floating Quality Badge 1 */}
              <div className="absolute -top-7 left-2 sm:top-4 sm:-left-2 lg:top-2 lg:-left-2 xl:top-3 xl:-left-2 z-30 glass-header px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full border border-[#E6C184]/60 shadow-xl flex items-center animate-bounce-slow">
                <span className="text-[11px] sm:text-xs font-bold text-[#1C0D0A] tracking-wide">
                  Official Signature Badge
                </span>
              </div>

              {/* Floating Quality Badge 2 */}
              <div className="absolute -bottom-7 right-2 sm:bottom-4 sm:-right-2 lg:bottom-2 lg:-right-2 xl:bottom-3 xl:-right-2 z-30 glass-header px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full border border-[#E6C184]/60 shadow-xl flex items-center">
                <span className="text-[11px] sm:text-xs font-bold text-[#1C0D0A] tracking-wide">Freshly Baked Daily</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────
         2. CHOCOLATE DRIP TRANSITION SVG
         ─────────────────────────────────────────────────────────────── */}
      <div className="chocolate-drip-top">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-12">
          <path
            d="M0,0 C150,90 350,-40 500,45 C650,130 900,-20 1200,40 L1200,0 L0,0 Z"
            className="shape-fill"
          />
        </svg>
      </div>

      {/* ───────────────────────────────────────────────────────────────
         3. TRUST BADGES BAR
         ─────────────────────────────────────────────────────────────── */}
      <section className="bg-[#962854] text-white py-6 sm:py-8 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center">
            <h4 className="font-bold text-xs sm:text-sm tracking-wider uppercase">100% Fresh Handcrafted Recipes</h4>
            <p className="text-[11px] text-[#FFF9F5]/80 mt-1">Fresh & Eggless Options Available</p>
          </div>
          <div className="flex flex-col items-center">
            <h4 className="font-bold text-xs sm:text-sm tracking-wider uppercase">Master Craftsmanship</h4>
            <p className="text-[11px] text-[#FFF9F5]/80 mt-1">Baked Daily by Master Chefs</p>
          </div>
          <div className="flex flex-col items-center">
            <h4 className="font-bold text-xs sm:text-sm tracking-wider uppercase">2-Hour Express Delivery</h4>
            <p className="text-[11px] text-[#FFF9F5]/80 mt-1">Fresh & Temperature Controlled</p>
          </div>
          <div className="flex flex-col items-center">
            <h4 className="font-bold text-xs sm:text-sm tracking-wider uppercase">Custom Handcrafted Designs</h4>
            <p className="text-[11px] text-[#FFF9F5]/80 mt-1">Personalized For Your Special Day</p>
          </div>
        </div>
      </section>


      {/* ───────────────────────────────────────────────────────────────
         4. CELEBRATION OCCASIONS SECTION
         ─────────────────────────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 bg-[#FFF9F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#962854] font-display italic font-semibold text-lg sm:text-xl block">
              Handcrafted For
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-5xl text-[#1C0D0A] tracking-tight mt-1">
              Explore By Celebration
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {OCCASIONS.map((occ) => (
              <Link
                key={occ.id}
                href={occ.href}
                className="group relative bg-white rounded-[28px] p-5 sm:p-6 border border-[#F2EAE4] transition-all duration-300 flex flex-col justify-between overflow-hidden min-h-[310px] h-[310px] shadow-[0_16px_36px_-10px_rgba(140,80,70,0.14),0_6px_16px_-4px_rgba(70,20,30,0.06),0_1px_2px_rgba(0,0,0,0.02)] hover:shadow-[0_22px_44px_-10px_rgba(140,80,70,0.22),0_10px_22px_-6px_rgba(70,20,30,0.10)] hover:-translate-y-1"
              >
                {/* Arch Backdrop */}
                <div
                  className={`absolute pointer-events-none transition-transform duration-500 group-hover:scale-105 ${occ.archClass}`}
                />

                {/* Doodle accents */}
                {occ.doodle === "heart" && (
                  <div className={`absolute pointer-events-none z-10 text-[#9A7067] ${occ.doodleClass}`}>
                    <svg className="w-6 h-6" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 10L9 12" />
                      <path d="M8 6L11 9" />
                      <path d="M21 9C19 6 15 7 15 10C15 7 11 6 9 9C6.5 12.8 15 22 15 22C15 22 23.5 12.8 21 9Z" transform="rotate(12 15 15)" />
                    </svg>
                  </div>
                )}

                {/* Ground Contact Shadow under cake base */}
                <div
                  className="absolute bottom-3 sm:bottom-4 right-1 sm:right-2 w-[48%] h-3.5 rounded-full pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(ellipse at center, rgba(40, 15, 25, 0.28) 0%, rgba(60, 20, 30, 0.10) 45%, transparent 72%)",
                    filter: "blur(3px)",
                  }}
                />

                {/* Cake Image */}
                <div className="absolute right-0 top-3 sm:top-4 bottom-3 sm:bottom-4 w-[52%] sm:w-[50%] flex items-end justify-center pointer-events-none pb-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={occ.image}
                    alt={occ.title.replace("\n", " ")}
                    className="max-w-full max-h-[88%] sm:max-h-[90%] object-contain filter drop-shadow-[0_10px_16px_rgba(60,20,30,0.14)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.06)] group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="eager"
                  />
                </div>

                {/* Left Content Column */}
                <div className="relative z-10 max-w-[52%] sm:max-w-[50%]">
                  {/* Top-left Icon */}
                  <div className="w-9 h-9 rounded-2xl bg-[#FAF0EE] flex items-center justify-center text-[#962854] mb-2.5 shadow-xs">
                    {occ.iconType === "cake" && (
                      <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="7.5" cy="3.5" r="1.2" />
                        <circle cx="12" cy="3" r="1.2" />
                        <circle cx="16.5" cy="3.5" r="1.2" />
                        <rect x="7" y="5.5" width="1" height="2" rx="0.5" />
                        <rect x="11.5" y="5" width="1" height="2.5" rx="0.5" />
                        <rect x="16" y="5.5" width="1" height="2" rx="0.5" />
                        <path d="M5.5 9C5.5 8.44772 5.94772 8 6.5 8H17.5C18.0523 8 18.5 8.44772 18.5 9V12C18.5 12.5523 18.0523 13 17.5 13H6.5C5.94772 13 5.5 12.5523 5.5 12V9Z" />
                        <path d="M4 14C4 13.4477 4.44772 13 5 13H19C19.5523 13 20 13.4477 20 14V18.5C20 19.3284 19.3284 20 18.5 20H5.5C4.67157 20 4 19.3284 4 18.5V14Z" />
                      </svg>
                    )}
                    {occ.iconType === "rings" && (
                      <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M8 2.5L9.5 4.5H6.5L8 2.5Z" fill="currentColor" strokeWidth="1.2" />
                        <circle cx="8" cy="12.5" r="5.5" />
                        <circle cx="15.5" cy="14" r="5" />
                      </svg>
                    )}
                    {occ.iconType === "gift" && (
                      <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9.5 6.5C8.67 6.5 8 5.83 8 5C8 4.17 8.67 3.5 9.5 3.5C10.5 3.5 11.5 4.5 12 5.5C12.5 4.5 13.5 3.5 14.5 3.5C15.33 3.5 16 4.17 16 5C16 5.83 15.33 6.5 14.5 6.5C13.5 6.5 12.5 5.5 12 5.5C11.5 5.5 10.5 6.5 9.5 6.5Z" />
                        <path d="M4 7C4 6.45 4.45 6 5 6H19C19.55 6 20 6.45 20 7V9C20 9.55 19.55 10 19 10H5C4.45 10 4 9.55 4 9V7Z" />
                        <path d="M5 11H10.5V20H6C5.45 20 5 19.55 5 19V11Z" />
                        <path d="M13.5 11H19V19C19 19.55 18.55 20 18 20H13.5V11Z" />
                      </svg>
                    )}
                  </div>

                  <span className="text-[9.5px] font-bold uppercase tracking-[0.16em] text-[#C07887] block mb-1">
                    {occ.badge}
                  </span>
                  <h3 className="font-display font-bold text-lg sm:text-[21px] text-[#1C0D0A] leading-[1.12] mb-1 whitespace-pre-line">
                    {occ.title}
                  </h3>
                  <span className="text-[11px] sm:text-xs font-semibold text-[#962854] block mb-1.5">
                    {occ.tagline}
                  </span>
                  <p className="text-[10.5px] text-[#5C524E] leading-relaxed line-clamp-3">
                    {occ.desc}
                  </p>
                </div>

                {/* Bottom Button */}
                <div className="relative z-10 pt-2">
                  <span
                    className={`rounded-full px-3.5 py-1.5 text-[9.5px] font-bold tracking-wider inline-flex items-center gap-1.5 transition-all duration-300 ${
                      occ.isPrimary
                        ? "bg-gradient-to-r from-[#8C2346] to-[#711634] text-white shadow-md shadow-[#8C2346]/25 border border-transparent"
                        : "border border-[#C88FA0]/60 text-[#8C2346] bg-transparent group-hover:bg-gradient-to-r group-hover:from-[#8C2346] group-hover:to-[#711634] group-hover:text-white group-hover:border-transparent group-hover:shadow-md"
                    }`}
                  >
                    <span>EXPLORE COLLECTION</span>
                    <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────
         5. ALL VARIETIES DYNAMIC CATEGORY SHOWCASE
         ─────────────────────────────────────────────────────────────── */}
      <section className="py-10 bg-[#FAF3EC]/40 space-y-16 sm:space-y-20">
        {CATEGORY_SHOWCASES.map((sec) => {
          // Retrieve up to 4 items from the catalog for each category section
          let items = getProductsByCategory(sec.slug, allProducts);
          if (sec.id === "custom-cake") {
            const homeWeddingIds = new Set(
              getProductsByCategory("wedding-cakes", allProducts).slice(0, 4).map((p) => p.id)
            );
            const homeBdayIds = new Set(
              getProductsByCategory("first-birthday", allProducts).slice(0, 4).map((p) => p.id)
            );

            const otherWeddingCakes = getProductsByCategory("wedding-cakes", allProducts).filter(
              (p) => !homeWeddingIds.has(p.id)
            );
            const otherBdayCakes = getProductsByCategory("first-birthday", allProducts).filter(
              (p) => !homeBdayIds.has(p.id)
            );

            // Curate 4 premium custom cakes (2 wedding + 2 1st birthday) strictly NOT already on the home page
            const customPicks = [
              otherWeddingCakes.find((p) => p.id === "wedding-grand-floating-tier-luxury") || otherWeddingCakes[0],
              otherBdayCakes.find((p) => p.id === "bday-baby-shark-underwater-floating-tier") || otherBdayCakes[0],
              otherWeddingCakes.find((p) => p.id === "wedding-crimson-romance-fondant-2tier") || otherWeddingCakes[1],
              otherBdayCakes.find((p) => p.id === "bday-jungle-safari-adventure-2tier") || otherBdayCakes[1],
            ].filter(Boolean) as typeof allProducts;

            items = customPicks.length === 4 ? customPicks : [...otherWeddingCakes.slice(0, 2), ...otherBdayCakes.slice(0, 2)];
          } else {
            items = items.slice(0, 4);
          }

          if (items.length === 0) {
            items = allProducts.slice(0, 4);
          }

          return (
            <div key={sec.id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[#E6C184]/30 gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#962854] block mb-1">
                    {sec.subtitle}
                  </span>
                  <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#1C0D0A]">{sec.title}</h2>
                  <p className="text-xs sm:text-sm text-[#5C524E] mt-1">{sec.desc}</p>
                </div>
                <Link
                  href={sec.href}
                  className="btn-primary py-2.5 px-6 text-xs font-bold uppercase tracking-wider flex items-center gap-2 self-start md:self-auto"
                >
                  <span>{sec.cta}</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {items.map((prod) => (
                  <ProductCard key={`${sec.id}-${prod.id}`} product={prod} />
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* ───────────────────────────────────────────────────────────────
         6. CUSTOMER REVIEWS & TESTIMONIALS
         ─────────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-[#FFF9F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-[#962854] font-display italic font-semibold text-xl sm:text-2xl block">
              Sweet Words
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-5xl text-[#1C0D0A] tracking-tight mt-1">
              What Our Customers Say
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            {REVIEWS.map((rev, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#F1E6DF] rounded-3xl p-5 lg:p-6 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between relative h-full"
              >
                <div className="mb-4">
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => {
                      const starValue = i + 1;
                      const isFull = rev.rating >= starValue;
                      const isHalf = !isFull && rev.rating >= starValue - 0.5;
                      return (
                        <span
                          key={i}
                          className="material-symbols-outlined text-lg sm:text-xl text-[#D97706]"
                          style={{
                            fontVariationSettings: isFull || isHalf ? "'FILL' 1, 'wght' 400" : "'FILL' 0, 'wght' 400",
                            opacity: isFull || isHalf ? 1 : 0.35,
                          }}
                        >
                          {isHalf ? "star_half" : "star"}
                        </span>
                      );
                    })}
                    <span className="text-xs font-bold text-[#962854] ml-1.5">{rev.rating.toFixed(1)}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#4A3E39] italic leading-relaxed font-sans">&ldquo;{rev.text}&rdquo;</p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-[#F1E6DF]">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#962854] text-white font-bold font-display flex items-center justify-center text-sm sm:text-base shadow-md flex-shrink-0">
                    {rev.initial}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs sm:text-sm text-[#1C0D0A] truncate">{rev.name}</h4>
                    <span className="text-[10px] sm:text-[11px] text-[#9C8B84] font-medium flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#1B5E20] flex-shrink-0"></span>
                      <span>{rev.location ? `Verified Buyer • ${rev.location}` : "Verified Buyer"}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────
         7. DESIGN YOUR DREAM CAKE CTA BANNER
         ─────────────────────────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 bg-[#FAF3EC]/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="celebration-card rounded-3xl bg-[#1C0D0A] text-white p-8 sm:p-14 text-center relative overflow-hidden shadow-2xl">
            <h2 className="font-display font-bold text-3xl sm:text-5xl mb-4 leading-tight">
              Design Your Dream Custom Cake
            </h2>
            <p className="text-[#D8C3B3] max-w-xl mx-auto mb-8 text-sm sm:text-base leading-relaxed">
              Pick your flavour, shape, multi-tier structure and personalized message — our pastry chefs will bring
              your custom cake vision to life!
            </p>
            <Link
              href="/custom-cake"
              className="btn-primary inline-flex items-center gap-2 py-4 px-10 text-xs font-bold uppercase tracking-wider shadow-xl hover:scale-105 transition-transform"
            >
              <span>CREATE YOUR DREAM CAKE</span>
              <span className="material-symbols-outlined text-sm">east</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
