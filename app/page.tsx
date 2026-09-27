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
    title: "1st Birthday Smash",
    icon: "child_care",
    tagline: "Pure & Low Sugar",
    desc: "Crafted tenderly with organic, low-sugar ingredients perfect for baby's first celebration.",
    href: "/first-birthday",
    badge: "Milestone",
  },
  {
    id: "wedding",
    title: "Wedding Centerpieces",
    icon: "church",
    tagline: "Multi-tiered Luxury",
    desc: "Bespoke tier architecture decorated with edible gold leaf and delicate sugar flowers.",
    href: "/wedding-cakes",
    badge: "Luxury",
  },
  {
    id: "custom",
    title: "Custom 3D Studio",
    icon: "auto_awesome",
    tagline: "Bespoke Custom Design",
    desc: "You imagine it, our master artisans bring your dream cake concept to sweet reality.",
    href: "/custom-cake",
    badge: "Personalized",
  },
  {
    id: "bento",
    title: "Korean Bento Box",
    icon: "takeout_dining",
    tagline: "Cute 300g Mini Treats",
    desc: "Adorable mini cakes packed in eco-friendly minimalist bento boxes with wooden cutlery.",
    href: "/bento-cake",
    badge: "Trending",
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
    name: "Ananya Patel",
    location: "Mumbai",
    rating: 5,
    text: "The Belgian Dark Chocolate Truffle was the absolute highlight of my daughter's 1st birthday! So soft, rich, and delicious.",
    initial: "A",
  },
  {
    name: "Rohan Mehta",
    location: "Pune",
    rating: 5,
    text: "The Belgian Chocolate Truffle Cake with the silky rich ganache was insane! Everyone asked me where I ordered it from.",
    initial: "R",
  },
  {
    name: "Siddharth Kapoor",
    location: "Mumbai",
    rating: 5,
    text: "Ordered a 3-tier custom wedding cake with gold leaf detailing. It looked like pure art and tasted divine!",
    initial: "S",
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
                ✨ PREMIUM ARTISANAL BAKERY
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
                  ✨ Official Signature Badge
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {OCCASIONS.map((occ) => (
              <Link
                key={occ.id}
                href={occ.href}
                className="celebration-card p-6 flex flex-col justify-between group hover:border-[#962854] transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#FAF3EC] border border-[#E6C184]/40 flex items-center justify-center text-[#962854] group-hover:bg-[#962854] group-hover:text-white transition-colors">
                      <span className="material-symbols-outlined text-2xl">{occ.icon}</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-[#FAF3EC] text-[#962854] px-2.5 py-1 rounded-full border border-[#E6C184]/40">
                      {occ.badge}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-xl text-[#1C0D0A] mb-1 group-hover:text-[#962854] transition-colors">
                    {occ.title}
                  </h3>
                  <span className="text-xs font-semibold text-[#962854] block mb-2">{occ.tagline}</span>
                  <p className="text-xs text-[#5C524E] leading-relaxed mb-6">{occ.desc}</p>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-[#1C0D0A] group-hover:text-[#962854] transition-colors pt-3 border-t border-[#F1E6DF]">
                  <span>EXPLORE COLLECTION</span>
                  <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                    east
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {REVIEWS.map((rev, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#F1E6DF] rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between relative"
              >
                <div className="mb-6">
                  <div className="flex items-center gap-1 text-[#E6C184] mb-4">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <span key={i} className="material-symbols-outlined text-lg fill-current">
                        star
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-[#4A3E39] italic leading-relaxed font-sans">&ldquo;{rev.text}&rdquo;</p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-[#F1E6DF]">
                  <div className="w-10 h-10 rounded-full bg-[#962854] text-white font-bold font-display flex items-center justify-center text-base shadow-md">
                    {rev.initial}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#1C0D0A]">{rev.name}</h4>
                    <span className="text-[11px] text-[#9C8B84] font-medium flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#1B5E20]"></span> Verified Buyer • {rev.location}
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
