import Link from "next/link";
import { getDbProducts, getProductsByCategory, PRODUCTS_DATA } from "@/lib/products";
import ProductCard from "@/components/products/ProductCard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Lollipop Cake Shop - Handcrafted Artisanal Cakes & Pastries",
  description:
    "Handcrafted artisanal luxury cakes, French pastries, customized milestone cakes, and gourmet treats baked fresh daily.",
};

const OCCASIONS = [
  {
    id: "first-birthday",
    badge: "Milestone",
    title: "1st Birthday\nSmash",
    tagline: "Pure & Low Sugar",
    desc: "Crafted tenderly with organic, low-sugar ingredients perfect for baby's first celebration.",
    image: "/images/asserts/1st_birthdaycake.png",
    href: "/first-birthday",
    iconType: "cake",
    doodle: "sparkle",
    doodleClass: "right-[43%] top-[24%]",
    isPrimary: true,
    archClass: "right-2 top-7 bottom-12 w-[46%] bg-[#FAF0EB]",
    imageContainerClass: "right-0 top-7 bottom-12 w-[48%]",
  },
  {
    id: "wedding",
    badge: "Luxury",
    title: "Wedding\nCenterpieces",
    tagline: "Multi-tiered Luxury",
    desc: "Bespoke tier architecture decorated with edible gold leaf and delicate sugar flowers.",
    image: "/images/asserts/weddingcake.png",
    href: "/wedding-cakes",
    iconType: "rings",
    doodle: null,
    doodleClass: "",
    isPrimary: false,
    archClass: "right-2 top-4 bottom-12 w-[45%] bg-[#F7ECE4]",
    imageContainerClass: "right-0 top-4 bottom-12 w-[47%]",
  },
  {
    id: "custom",
    badge: "Personalized",
    title: "Custom 3D\nStudio",
    tagline: "Bespoke Custom Design",
    desc: "You imagine it, our master artisans bring your dream cake concept to sweet reality.",
    image: "/images/asserts/customizecake.png",
    href: "/custom-cake",
    iconType: "sparkles",
    doodle: "sparkle",
    doodleClass: "right-[43%] top-[26%]",
    isPrimary: false,
    archClass: "right-2 top-7 bottom-12 w-[46%] bg-[#FAF0EB]",
    imageContainerClass: "right-0 top-7 bottom-12 w-[48%]",
  },
  {
    id: "bento",
    badge: "Trending",
    title: "Korean Bento\nBox",
    tagline: "Cute 300g Mini Treats",
    desc: "Adorable mini cakes packed in eco-friendly minimalist bento boxes with wooden cutlery.",
    image: "/images/asserts/betocake.png",
    href: "/bento-cake",
    iconType: "gift",
    doodle: "heart",
    doodleClass: "right-4 top-5",
    isPrimary: false,
    archClass: "right-2 top-7 bottom-12 w-[46%] bg-[#F9ECE4]",
    imageContainerClass: "right-0 top-7 bottom-12 w-[48%]",
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
    <div className="relative overflow-x-hidden min-h-screen bg-[#FFF9F5]/70">
      {/* ───────────────────────────────────────────────────────────────
         1. HERO SECTION
         ─────────────────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-b from-[#FAF3EC]/60 via-[#FFF9F5]/80 to-[#FFF9F5]/70 py-10 lg:py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full">
          {/* Hero Left Content */}
          <div className="text-center lg:text-left space-y-6 z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF3EC] border border-[#E6C184]/60 shadow-sm">
              <span className="material-symbols-outlined text-sm text-[#962854]">auto_awesome</span>
              <span className="text-xs font-bold text-[#1C0D0A] uppercase tracking-wider">
                 PREMIUM ARTISANAL BAKERY
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold text-[#1C0D0A] leading-[1.02] tracking-tight">
              Made for <span className="text-[#962854] font-display italic font-semibold">Moments.</span>
              <br />
              Baked for <span className="text-[#962854] font-display italic font-semibold">Memories.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#5C524E] font-normal max-w-lg leading-relaxed pt-1 mx-auto lg:mx-0">
              &ldquo;Beautifully crafted, irresistibly delicious, and made with passion — our cakes are created to make
              every celebration feel a little more extraordinary.&rdquo;
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/cakes"
                className="btn-primary py-3.5 px-8 text-xs font-bold uppercase tracking-wider shadow-lg flex items-center gap-2"
              >
                <span>EXPLORE CATALOG</span>
                <span className="material-symbols-outlined text-sm">east</span>
              </Link>
              <Link
                href="/custom-cake"
                className="btn-secondary py-3.5 px-7 text-xs font-bold uppercase tracking-wider flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm text-[#962854]">auto_awesome</span>
                <span>CUSTOM CAKE</span>
              </Link>
            </div>

            {/* Master Chef Quality Promise */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-[#962854]/10 border border-[#962854]/20 shadow-sm">
                <span className="material-symbols-outlined text-xl text-[#962854]">workspace_premium</span>
                <div className="text-left">
                  <span className="font-bold text-xs text-[#1C0D0A] block leading-tight">
                    Master Chef Signature Recipes
                  </span>
                  <span className="text-[11px] text-[#5C524E] font-normal">
                    Handcrafted with Premium Ingredients &amp; Artisan Care
                  </span>
                </div>
              </div>
            </div>

            {/* Trust Stats Bar */}
            <div className="pt-6 border-t border-[#E6C184]/30 grid grid-cols-3 gap-4 text-center lg:text-left">
              <div>
                <span className="font-display text-2xl sm:text-3xl font-bold text-[#1C0D0A] block">10,000+</span>
                <span className="text-[11px] text-[#5C524E] uppercase tracking-wider font-bold">Cakes Delivered</span>
              </div>
              <div>
                <span className="font-display text-2xl sm:text-3xl font-bold text-[#1C0D0A] block">4.9 ★</span>
                <span className="text-[11px] text-[#5C524E] uppercase tracking-wider font-bold">Customer Rating</span>
              </div>
              <div>
                <span className="font-display text-2xl sm:text-3xl font-bold text-[#1C0D0A] block">2 Hours</span>
                <span className="text-[11px] text-[#5C524E] uppercase tracking-wider font-bold">Express Delivery</span>
              </div>
            </div>
          </div>

          {/* Hero Right Interactive Graphic */}
          <div id="hero-cake-container" className="relative flex justify-center items-center py-4 lg:py-0 order-first lg:order-last">
            <div className="relative w-80 h-80 sm:w-[420px] sm:h-[420px] md:w-[480px] md:h-[480px] lg:w-[520px] lg:h-[520px] flex items-center justify-center animate-hero-float">
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
              <div className="absolute -top-7 left-2 sm:top-4 sm:-left-2 z-30 glass-header px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-[#E6C184]/60 shadow-xl flex items-center gap-1.5 sm:gap-2 animate-bounce-slow">
                <span className="material-symbols-outlined text-sm sm:text-base text-[#962854]">
                  workspace_premium
                </span>
                <span className="text-[11px] sm:text-xs font-bold text-[#1C0D0A] tracking-wide">
                  Official Signature Badge
                </span>
              </div>

              {/* Floating Quality Badge 2 */}
              <div className="absolute -bottom-7 right-2 sm:bottom-4 sm:-right-2 z-30 glass-header px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-[#E6C184]/60 shadow-xl flex items-center gap-1.5 sm:gap-2">
                <span className="material-symbols-outlined text-sm sm:text-base text-[#962854]">bakery_dining</span>
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
            <span className="material-symbols-outlined text-3xl sm:text-4xl text-[#E6C184] mb-2">auto_awesome</span>
            <h4 className="font-bold text-xs sm:text-sm tracking-wider uppercase">100% Artisanal Recipes</h4>
            <p className="text-[11px] text-[#FFF9F5]/80 mt-0.5">Fresh &amp; Eggless Options Available</p>
          </div>
          <div className="flex flex-col items-center">
            <span className="material-symbols-outlined text-3xl sm:text-4xl text-[#E6C184] mb-2">workspace_premium</span>
            <h4 className="font-bold text-xs sm:text-sm tracking-wider uppercase">Artisanal Craftsmanship</h4>
            <p className="text-[11px] text-[#FFF9F5]/80 mt-0.5">Baked Daily by Master Chefs</p>
          </div>
          <div className="flex flex-col items-center">
            <span className="material-symbols-outlined text-3xl sm:text-4xl text-[#E6C184] mb-2">local_shipping</span>
            <h4 className="font-bold text-xs sm:text-sm tracking-wider uppercase">2-Hour Express Delivery</h4>
            <p className="text-[11px] text-[#FFF9F5]/80 mt-0.5">Fresh &amp; Temperature Controlled</p>
          </div>
          <div className="flex flex-col items-center">
            <span className="material-symbols-outlined text-3xl sm:text-4xl text-[#E6C184] mb-2">celebration</span>
            <h4 className="font-bold text-xs sm:text-sm tracking-wider uppercase">Custom Handcrafted Designs</h4>
            <p className="text-[11px] text-[#FFF9F5]/80 mt-0.5">Personalized For Your Special Day</p>
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
                className={`group relative bg-white rounded-[26px] p-5 sm:p-6 border transition-all duration-300 flex flex-col justify-between overflow-hidden h-[310px] ${
                  occ.isPrimary
                    ? "border-[#F0C2CE] shadow-[0_8px_25px_rgba(150,40,84,0.08)] hover:shadow-xl hover:-translate-y-1"
                    : "border-[#F1E6DF] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-xl hover:border-[#F0C2CE] hover:-translate-y-1"
                }`}
              >
                {/* Arch Backdrop */}
                <div
                  className={`absolute rounded-t-full rounded-b-3xl pointer-events-none transition-transform duration-500 group-hover:scale-105 ${occ.archClass}`}
                />

                {/* Doodle accents */}
                {occ.doodle === "sparkle" && (
                  <div className={`absolute pointer-events-none text-[#BA9684] ${occ.doodleClass}`}>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                      <path d="M5 16L9 12" />
                      <path d="M11 18L12 11" />
                      <path d="M18 15L14 10" />
                    </svg>
                  </div>
                )}
                {occ.doodle === "heart" && (
                  <div className={`absolute pointer-events-none z-10 text-[#9A7067] ${occ.doodleClass}`}>
                    <svg className="w-6 h-6" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 10L9 12" />
                      <path d="M8 6L11 9" />
                      <path d="M21 9C19 6 15 7 15 10C15 7 11 6 9 9C6.5 12.8 15 22 15 22C15 22 23.5 12.8 21 9Z" transform="rotate(12 15 15)" />
                    </svg>
                  </div>
                )}

                {/* Cake Image */}
                <div className={`absolute flex items-center justify-center p-1 pointer-events-none ${occ.imageContainerClass}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={occ.image}
                    alt={occ.title.replace("\n", " ")}
                    className="max-w-full max-h-full object-contain drop-shadow-[0_6px_14px_rgba(0,0,0,0.08)] group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                </div>

                {/* Left Content Column */}
                <div className="relative z-10 max-w-[50%]">
                  {/* Top-left Icon */}
                  <div className="w-9 h-9 rounded-2xl bg-[#FAF0EE] flex items-center justify-center text-[#962854] mb-3 shadow-xs">
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
                    {occ.iconType === "sparkles" && (
                      <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 3C9 6.31 6.31 9 3 9C6.31 9 9 11.69 9 15C9 11.69 11.69 9 15 9C11.69 9 9 6.31 9 3Z" />
                        <path d="M17.5 11C17.5 13.21 15.71 15 13.5 15C15.71 15 17.5 16.79 17.5 19C17.5 16.79 19.29 15 21.5 15C19.29 15 17.5 13.21 17.5 11Z" />
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
                  <h3 className="font-display font-bold text-lg sm:text-[21px] text-[#1C0D0A] leading-[1.15] mb-1 whitespace-pre-line">
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
                        ? "bg-gradient-to-r from-[#8C2346] to-[#711634] text-white shadow-md shadow-[#8C2346]/20 border border-transparent"
                        : "border border-[#E2B8C2] text-[#8C2346] bg-transparent group-hover:bg-gradient-to-r group-hover:from-[#8C2346] group-hover:to-[#711634] group-hover:text-white group-hover:border-transparent"
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
            items = allProducts.filter((p) => p.badge || p.subCategory?.includes("Special")).slice(0, 4);
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
            <span className="material-symbols-outlined text-4xl sm:text-5xl text-[#E6C184] mb-4 inline-block animate-bounce-slow">
              auto_awesome
            </span>
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
