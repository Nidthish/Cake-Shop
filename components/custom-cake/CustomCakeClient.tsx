"use client";

import { useState, useMemo } from "react";
import LiveCakeCustomizer from "./LiveCakeCustomizer";
import ScrollReveal from "@/components/common/ScrollReveal";

const WHATSAPP_NUMBER = "918489324697";
const PHONE_DISPLAY = "+91 84893 24697";

export const CAKE_FLAVOUR_OPTIONS = [
  "Select a flavour",
  "Belgian Chocolate",
  "Red Velvet",
  "Black Forest",
  "White Forest",
  "Butterscotch",
  "Blueberry",
  "Fresh Fruit / Mango",
  "Nutella Truffle",
  "Lotus Biscoff",
  "Raffaello Cake",
  "Pistachio Special",
  "Caramel Crunch",
  "Irish Coffee",
  "Vanilla Bean",
  "Other Custom Flavour (Specify in description)",
];

export interface ShowcaseCake {
  id: string;
  name: string;
  category: string;
  tagline: string;
  image: string;
  description: string;
  tiers: string;
  flavours: string[];
  highlights: string[];
}

export const SHOWCASE_CAKES: ShowcaseCake[] = [
  {
    id: "grand-floating-tier-luxury",
    name: "Grand Floating Tier Wedding Cake",
    category: "Wedding Centerpiece",
    tagline: "3 Tiers • 24K Gold Leaf & Fresh Florals",
    image: "/PRODUCT_IMAGES/cakes/WEDDING CAKES/grand-floating-tier-luxury-wedding-cake.jpeg",
    description:
      "A grand multi-tier centerpiece with an architectural floating tier, hand-painted edible gold leaf, and cascading fresh roses.",
    tiers: "3 Tiers (Floating Architecture)",
    flavours: ["Belgian Dark Chocolate", "Red Velvet Cream Cheese", "Vanilla Bean"],
    highlights: ["Floating Tier Design", "24K Edible Gold Leaf", "Fresh Rose Cascade"],
  },
  {
    id: "teddy-bear-toy-train",
    name: "Teddy Bear Toy Train 1st Birthday Cake",
    category: "1st Birthday Milestone",
    tagline: "3 Tiers • Handcrafted Sugar Toys & Train",
    image: "/PRODUCT_IMAGES/cakes/1ST BIRTHDAY CAKES/teddy-bear-toy-train-3tier-1st-birthday-cake.jpeg",
    description:
      "Our most loved 1st birthday cake with hand-sculpted teddy bears, a colorful toy train with name blocks, and a golden crown topper.",
    tiers: "3 Tiers (Tiered Stacking)",
    flavours: ["Belgian Chocolate Truffle", "Velvet Vanilla", "Strawberry Cream"],
    highlights: ["Custom Name Blocks", "Hand-Sculpted Bears", "Golden Crown Topper"],
  },
  {
    id: "royal-blush-crown-2tier",
    name: "Royal Blush Crown 2-Tier Cake",
    category: "Wedding & Engagement",
    tagline: "2 Tiers • Pleated Buttercream with Tiara",
    image: "/PRODUCT_IMAGES/cakes/WEDDING CAKES/royal-blush-crown-2tier-wedding-cake.jpeg",
    description:
      "Blush pink pleated celebration cake crowned with a royal tiara, fresh champagne roses, and edible sugar pearls.",
    tiers: "2 Tiers (Wide Base)",
    flavours: ["Red Velvet Cream Cheese", "White Chocolate Raspberry"],
    highlights: ["Tiara Crown Topper", "Fresh Rose Garland", "Pleated Texture"],
  },
  {
    id: "royal-prince-crown-3tier",
    name: "Royal Prince Crown 3-Tier Cake",
    category: "Prince Milestone",
    tagline: "3 Tiers • Royal Blue & Gold Fondant",
    image: "/PRODUCT_IMAGES/cakes/1ST BIRTHDAY CAKES/royal-prince-crown-3tier-birthday-cake.jpeg",
    description:
      "Regal royal blue and gold celebration cake with edible golden scrolls, quilted pattern, and a handcrafted imperial crown.",
    tiers: "3 Tiers (Imperial Stacking)",
    flavours: ["Belgian Milk Chocolate", "Nutty Praline Truffle", "Classic Vanilla"],
    highlights: ["Imperial Crown Topper", "Gold Baroque Scrolls", "Quilted Diamond Finish"],
  },
];

export default function CustomCakeClient() {
  // Photo inspection modal state
  const [inspectCake, setInspectCake] = useState<ShowcaseCake | null>(null);

  // Form states matching custom cake requirements
  const [formWeight, setFormWeight] = useState<string>("");
  const [formLayers, setFormLayers] = useState<string>("");
  const [formFlavour, setFormFlavour] = useState<string>("Select a flavour");
  const [formPurpose, setFormPurpose] = useState<string>("");
  const [formDescription, setFormDescription] = useState<string>("");
  const [formDate, setFormDate] = useState<string>("");
  const [formAddress, setFormAddress] = useState<string>("");
  const [referenceFile, setReferenceFile] = useState<File | null>(null);
  const [referencePreview, setReferencePreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Please upload an image smaller than 5 MB.");
        return;
      }
      setReferenceFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setReferencePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFile = () => {
    setReferenceFile(null);
    setReferencePreview(null);
  };

  // Generate direct WhatsApp link from 8 form values
  const whatsappUrl = useMemo(() => {
    const lines = [
      "*CUSTOM CAKE ORDER — LOLLIPOP CAKE STUDIO*",
      "---------------------------------------",
      formWeight.trim() ? `*1. Weight:* ${formWeight.trim()}` : "",
      formLayers.trim() ? `*2. Steps (Layers):* ${formLayers.trim()}` : "",
      formFlavour && formFlavour !== "Select a flavour" ? `*3. Flavour:* ${formFlavour}` : "",
      formPurpose.trim() ? `*4. Purpose:* ${formPurpose.trim()}` : "",
      formDescription.trim() ? `*5. Description:* ${formDescription.trim()}` : "",
      formDate ? `*6. Date of Delivery:* ${formDate}` : "",
      formAddress.trim() ? `*7. Address (Trichy):* ${formAddress.trim()}` : "",
      referenceFile ? `*8. Reference Cake Image:* Attached (${referenceFile.name})` : "",
      "---------------------------------------",
      "Hello! I would like to order this custom cake from your website. Please review my request and confirm availability & price!",
    ].filter(Boolean);

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
  }, [formWeight, formLayers, formFlavour, formPurpose, formDescription, formDate, formAddress, referenceFile]);

  return (
    <div className="bg-[#FAF5EE] min-h-screen text-[#1C0D0A] selection:bg-[#802B52] selection:text-white pb-20">
      
      {/* ── 1. HEADER & GALLERY SHOWCASE ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 sm:pt-14 sm:pb-20 border-b border-[#E6C184]/30 bg-[#FAF5EE]">
        <ScrollReveal>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-2 mb-10 sm:mb-14">
            <h1 className="font-display font-bold text-3xl sm:text-5xl text-[#1C0D0A] tracking-tight">
              Customized Cakes
            </h1>
            <p className="text-xs sm:text-sm text-[#5C524E] max-w-lg mx-auto">
              Explore our signature creations or design your own bespoke cake online with instant WhatsApp ordering.
            </p>
          </div>
        </ScrollReveal>

        {/* Editorial Layout (Gallery Cards with Scroll Reveal Animation) */}
        <div className="space-y-16 sm:space-y-24">
          {SHOWCASE_CAKES.map((cake, idx) => {
            const isEven = idx % 2 === 1;
            const isHiddenOnMobile = idx >= 2;

            // Animate each side from outside towards center:
            // Odd: Photo from Left, Description from Right
            // Even: Photo from Right, Description from Left
            const photoDirection = isEven ? "right" : "left";
            const textDirection = isEven ? "left" : "right";

            return (
              <div
                key={cake.id}
                className={`${isHiddenOnMobile ? "hidden md:block" : "block"} overflow-hidden`}
              >
                <div
                  className={`flex flex-col lg:flex-row items-center gap-8 sm:gap-12 lg:gap-16 ${
                    isEven ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  {/* Photo Container - Glides in from Left/Right */}
                  <ScrollReveal
                    direction={photoDirection}
                    distance={60}
                    duration={850}
                    className="w-full lg:w-1/2 flex"
                  >
                    <div
                      onClick={() => setInspectCake(cake)}
                      className="group relative cursor-pointer overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-[#E6DBCE] w-full aspect-square bg-[#F5EFE6]"
                    >
                      <img
                        src={cake.image}
                        alt={cake.name}
                        loading="lazy"
                        className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                      <div className="absolute top-4 left-4 z-10">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-white/95 text-[#802B52] border border-[#E6DBCE] shadow-xs backdrop-blur-xs">
                          {cake.category}
                        </span>
                      </div>

                      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                        <span className="inline-flex items-center gap-1.5 bg-[#1C0D0A]/85 text-white text-[11px] font-medium px-3.5 py-1.5 rounded-full backdrop-blur-xs shadow-md">
                          <span className="material-symbols-outlined text-sm">zoom_in</span>
                          <span>View Full Photo</span>
                        </span>
                      </div>
                    </div>
                  </ScrollReveal>

                  {/* Open Editorial Description - Glides in from Opposite Side (NOT A CARD) */}
                  <ScrollReveal
                    direction={textDirection}
                    distance={60}
                    duration={850}
                    className="w-full lg:w-1/2 flex"
                  >
                    <div className="w-full space-y-4 sm:space-y-5 py-2 sm:py-4 px-1 sm:px-2 flex flex-col justify-between">
                      <div className="space-y-2">
                        <span className="text-[11px] font-bold uppercase tracking-widest text-[#802B52]">
                          {cake.tagline}
                        </span>
                        <h3 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-[#1C0D0A] leading-tight">
                          {cake.name}
                        </h3>
                      </div>

                      <p className="text-sm sm:text-base text-[#5C524E] leading-relaxed font-normal">
                        {cake.description}
                      </p>

                      {/* Architecture Specification Pill */}
                      <div className="flex items-center gap-3.5 bg-white/90 border border-[#E6DBCE] rounded-2xl p-3.5 shadow-2xs backdrop-blur-xs">
                        <div className="w-9 h-9 rounded-xl bg-[#FAF0F2] text-[#802B52] flex items-center justify-center shrink-0 border border-[#802B52]/15">
                          <span className="material-symbols-outlined text-lg">layers</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#802B52] block leading-tight">
                            Architecture
                          </span>
                          <span className="text-xs sm:text-sm font-bold text-[#1C0D0A] block mt-0.5">
                            {cake.tiers}
                          </span>
                        </div>
                      </div>

                      <div className="pt-1 space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A6B72] block">
                          Handcrafted Techniques
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {cake.highlights.map((h, i) => (
                            <span
                              key={i}
                              className="text-[11px] bg-white/90 border border-[#E6DBCE] px-3.5 py-1.5 rounded-full text-[#5C524E] font-medium shadow-2xs"
                            >
                              {h}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-[#E6DBCE]/70 text-xs text-[#7A6B72]">
                        <span className="font-bold text-[#1C0D0A]">Recommended Flavours: </span>
                        {cake.flavours.join(" • ")}
                      </div>
                    </div>
                  </ScrollReveal>
                </div>
              </div>
            );
          })}
        </div>

      </section>

      {/* ── 2. CUSTOM CAKE ORDER FORM (COMPACT SINGLE-VIEWPORT FIT MATCHING REFERENCE DESIGN) ── */}
      <section
        id="custom-cake-order-form"
        className="max-w-4xl mx-auto w-full px-3 sm:px-6 pt-6 sm:pt-10 pb-8 sm:pb-12"
      >
        <ScrollReveal>
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#F0E6DE] p-4 sm:p-6 shadow-lg shadow-[#1C0D0A]/4 space-y-3.5">
            
            {/* Card Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-[#F0E6DE]">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#FAF0F3] border border-[#F5D8E1] flex items-center justify-center text-[#802348] shrink-0">
                  {/* Cake Outline SVG Icon */}
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v2m-6-2v2m12-2v2M4 9h16v11a2 2 0 01-2 2H6a2 2 0 01-2-2V9zm0 4c1.5 1 3 1 4 0s2.5-1 4 0 2.5 1 4 0 2.5-1 4 0" />
                  </svg>
                </div>
                <div>
                  <h2 className="font-display font-bold text-xl sm:text-2xl text-[#802348] tracking-tight leading-tight">
                    Custom Cake Order
                  </h2>
                  <p className="text-[11px] sm:text-xs text-[#7A6B72] mt-0.5 leading-tight">
                    Tell us about your dream cake. We&apos;ll review your request and confirm availability &amp; price on WhatsApp.
                  </p>
                </div>
              </div>

              {/* Decorative Handwritten Script Callout */}
              <div className="hidden sm:block text-right shrink-0 select-none">
                <p className="font-serif italic text-base sm:text-lg text-[#802348] leading-tight">
                  Made<br />for your<br />
                  <span className="relative inline-block font-bold">
                    special moments
                    <span className="absolute inset-x-0 bottom-0.5 h-1.5 bg-[#F8D2DD] -z-10 rounded-xs -rotate-1" />
                  </span> ♡
                </p>
              </div>
            </div>

            {/* 8 Form Fields Grid (Compact Bordered Cards Exactly Like Reference) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              
              {/* Field 1: Weight */}
              <div className="border border-[#EFE5DE] rounded-xl p-3 bg-white flex flex-col justify-between">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#802348] shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3a4 4 0 00-4 4v1H7a2 2 0 00-2 2l1.6 9.5A2.5 2.5 0 009 21h6a2.5 2.5 0 002.4-1.5L19 10a2 2 0 00-2-2h-1V7a4 4 0 00-4-4zm-2 4a2 2 0 014 0v1h-4V7z" />
                      </svg>
                    </span>
                    <label htmlFor="cake-weight" className="text-xs sm:text-[13px] font-bold text-[#802348] cursor-pointer">
                      1. Weight
                    </label>
                  </div>
                  <span className="text-[11px] text-[#7A6B72]">
                    Enter the approximate weight of your cake (e.g. 1.5 kg).
                  </span>
                </div>
                <input
                  id="cake-weight"
                  type="text"
                  placeholder="e.g. 1.5 kg"
                  value={formWeight}
                  onChange={(e) => setFormWeight(e.target.value)}
                  className="w-full bg-[#FAF7F4] border border-[#EBE0D7] focus:border-[#802348] focus:bg-white focus:ring-1 focus:ring-[#802348] rounded-lg px-3 py-2 text-xs sm:text-[13px] text-[#1C0D0A] placeholder:text-[#A89D95] outline-none transition"
                />
              </div>

              {/* Field 2: Steps (Layers) */}
              <div className="border border-[#EFE5DE] rounded-xl p-3 bg-white flex flex-col justify-between">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#802348] shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v2m-5-2v2m10-2v2M4 9h16v3H4zm2 3v4h12v-4m-10 4v3h8v-3" />
                      </svg>
                    </span>
                    <label htmlFor="cake-layers" className="text-xs sm:text-[13px] font-bold text-[#802348] cursor-pointer">
                      2. Steps (Layers)
                    </label>
                  </div>
                  <span className="text-[11px] text-[#7A6B72]">
                    Enter the number of layers for your cake.
                  </span>
                </div>
                <input
                  id="cake-layers"
                  type="text"
                  placeholder="e.g. 2"
                  value={formLayers}
                  onChange={(e) => setFormLayers(e.target.value)}
                  className="w-full bg-[#FAF7F4] border border-[#EBE0D7] focus:border-[#802348] focus:bg-white focus:ring-1 focus:ring-[#802348] rounded-lg px-3 py-2 text-xs sm:text-[13px] text-[#1C0D0A] placeholder:text-[#A89D95] outline-none transition"
                />
              </div>

              {/* Field 3: Flavours */}
              <div className="border border-[#EFE5DE] rounded-xl p-3 bg-white flex flex-col justify-between">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#802348] shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l1.5 10h11L19 10H5zm1-2a3 3 0 016-1 3 3 0 016 1M12 3v2" />
                      </svg>
                    </span>
                    <label htmlFor="cake-flavour" className="text-xs sm:text-[13px] font-bold text-[#802348] cursor-pointer">
                      3. Flavours
                    </label>
                  </div>
                  <span className="text-[11px] text-[#7A6B72]">
                    Choose your preferred cake flavour.
                  </span>
                </div>
                <div className="relative">
                  <select
                    id="cake-flavour"
                    value={formFlavour}
                    onChange={(e) => setFormFlavour(e.target.value)}
                    className="w-full appearance-none bg-[#FAF7F4] border border-[#EBE0D7] focus:border-[#802348] focus:bg-white focus:ring-1 focus:ring-[#802348] rounded-lg px-3 py-2 text-xs sm:text-[13px] text-[#1C0D0A] outline-none transition cursor-pointer pr-8"
                  >
                    {CAKE_FLAVOUR_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#7A6B72]">
                    <svg className="w-3.5 h-3.5 fill-none stroke-currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Field 4: Purpose */}
              <div className="border border-[#EFE5DE] rounded-xl p-3 bg-white flex flex-col justify-between">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#802348] shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m-9-9h18M4 8h16a1 1 0 011 1v3H3V9a1 1 0 011-1zm3 0a2.5 2.5 0 015-1.5V8H7zm5 0a2.5 2.5 0 015-1.5V8h-5z" />
                      </svg>
                    </span>
                    <label htmlFor="cake-purpose" className="text-xs sm:text-[13px] font-bold text-[#802348] cursor-pointer">
                      4. Purpose
                    </label>
                  </div>
                  <span className="text-[11px] text-[#7A6B72]">
                    Tell us the occasion or purpose for the cake.
                  </span>
                </div>
                <input
                  id="cake-purpose"
                  type="text"
                  placeholder="e.g. Birthday, Anniversary, Wedding, etc."
                  value={formPurpose}
                  onChange={(e) => setFormPurpose(e.target.value)}
                  className="w-full bg-[#FAF7F4] border border-[#EBE0D7] focus:border-[#802348] focus:bg-white focus:ring-1 focus:ring-[#802348] rounded-lg px-3 py-2 text-xs sm:text-[13px] text-[#1C0D0A] placeholder:text-[#A89D95] outline-none transition"
                />
              </div>

              {/* Field 5: Brief description of the cake (Spans 2 columns) */}
              <div className="md:col-span-2 border border-[#EFE5DE] rounded-xl p-3 bg-white">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#802348] shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h4m5-13H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7l-4-4z" />
                      </svg>
                    </span>
                    <label htmlFor="cake-description" className="text-xs sm:text-[13px] font-bold text-[#802348] cursor-pointer">
                      5. Brief description of the cake
                    </label>
                  </div>
                  <span className="text-[11px] text-[#7A6B72]">
                    Tell us more about your cake design, colours, theme, text on cake, etc.
                  </span>
                </div>
                <textarea
                  id="cake-description"
                  rows={2}
                  placeholder='e.g. I want a pink and white theme cake with fresh flowers and a "Happy Birthday" text...'
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full bg-[#FAF7F4] border border-[#EBE0D7] focus:border-[#802348] focus:bg-white focus:ring-1 focus:ring-[#802348] rounded-lg px-3 py-2 text-xs sm:text-[13px] text-[#1C0D0A] placeholder:text-[#A89D95] outline-none transition resize-y"
                />
              </div>

              {/* Field 6: Date of delivery */}
              <div className="border border-[#EFE5DE] rounded-xl p-3 bg-white flex flex-col justify-between">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#802348] shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <rect x="3" y="4" width="18" height="18" rx="2" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 2v4M8 2v4M3 10h18" />
                      </svg>
                    </span>
                    <label htmlFor="cake-date" className="text-xs sm:text-[13px] font-bold text-[#802348] cursor-pointer">
                      6. Date of delivery
                    </label>
                  </div>
                  <span className="text-[11px] text-[#7A6B72]">
                    Select your preferred delivery date.
                  </span>
                </div>
                <input
                  id="cake-date"
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full bg-[#FAF7F4] border border-[#EBE0D7] focus:border-[#802348] focus:bg-white focus:ring-1 focus:ring-[#802348] rounded-lg px-3 py-2 text-xs sm:text-[13px] text-[#1C0D0A] outline-none transition"
                />
              </div>

              {/* Field 7: Address (Only Trichy) */}
              <div className="border border-[#EFE5DE] rounded-xl p-3 bg-white flex flex-col justify-between">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#802348] shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </span>
                    <label htmlFor="cake-address" className="text-xs sm:text-[13px] font-bold text-[#802348] cursor-pointer">
                      7. Address (Only Trichy)
                    </label>
                  </div>
                  <span className="text-[11px] text-[#7A6B72]">
                    Enter your full delivery address in Trichy.
                  </span>
                </div>
                <input
                  id="cake-address"
                  type="text"
                  placeholder="Enter your full address in Trichy"
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                  className="w-full bg-[#FAF7F4] border border-[#EBE0D7] focus:border-[#802348] focus:bg-white focus:ring-1 focus:ring-[#802348] rounded-lg px-3 py-2 text-xs sm:text-[13px] text-[#1C0D0A] placeholder:text-[#A89D95] outline-none transition"
                />
              </div>

              {/* Field 8: Image of the reference cake (Compact Horizontal Upload Bar) */}
              <div className="md:col-span-2 border border-[#EFE5DE] rounded-xl p-3 bg-white">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#802348] shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 15l-5-5L5 21" />
                      </svg>
                    </span>
                    <label className="text-xs sm:text-[13px] font-bold text-[#802348]">
                      8. Image of the reference cake
                    </label>
                  </div>
                  <span className="text-[11px] text-[#7A6B72]">
                    Upload a reference image of the cake you like (optional).
                  </span>
                </div>

                {!referenceFile ? (
                  <label
                    htmlFor="reference-image-input"
                    className="border border-dashed border-[#F3B7C8] hover:border-[#802348]/60 bg-[#FFF8FA] hover:bg-[#FFF2F6] rounded-xl py-2.5 px-4 flex items-center justify-center gap-3 cursor-pointer transition-all group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#FAF0F3] border border-[#F5D8E1] flex items-center justify-center text-[#802348] shrink-0 group-hover:scale-105 transition-transform">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 15l-5-5L5 21" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <span className="text-xs font-bold text-[#802348] block">
                        Upload reference cake image
                      </span>
                      <span className="text-[10px] text-[#7A6B72] block">
                        JPG, PNG up to 5 MB
                      </span>
                    </div>
                    <input
                      id="reference-image-input"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="border border-[#EBE0D7] bg-[#FAF7F4] rounded-xl p-2.5 flex items-center gap-3 justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {referencePreview && (
                        <img
                          src={referencePreview}
                          alt="Reference cake preview"
                          className="w-10 h-10 rounded-lg object-cover border border-[#E6DBCE] bg-white shrink-0"
                        />
                      )}
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#1C0D0A] truncate">
                          {referenceFile.name}
                        </p>
                        <p className="text-[10px] text-[#7A6B72]">
                          {(referenceFile.size / 1024).toFixed(1)} KB • Reference image attached
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="text-xs font-semibold text-[#802348] hover:text-[#5c1933] border border-[#802348]/30 hover:border-[#802348] rounded-md px-2.5 py-1 bg-white transition cursor-pointer shrink-0"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

            </div>

            {/* Action Buttons (Side-by-side with rounded-xl like reference) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#802348] hover:bg-[#681c3a] text-white py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs hover:shadow-md transition-all active:scale-[0.99] cursor-pointer"
              >
                <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824z" />
                </svg>
                <span>Send Cake Request on WhatsApp →</span>
              </a>

              <a
                href={`tel:${WHATSAPP_NUMBER}`}
                className="bg-white hover:bg-[#FAF7F4] text-[#802348] border border-[#802348] py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <svg className="w-4 h-4 fill-none stroke-currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>Call {PHONE_DISPLAY}</span>
              </a>
            </div>

          </div>
        </ScrollReveal>
      </section>

      {/* ── 3. LIVE ATELIER CAKE STUDIO ("MAKE YOUR OWN CAKE") ── */}
      <section
        id="cake-customizer-section"
        className="max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-8 sm:py-14 border-t border-[#E6C184]/30"
      >
        <ScrollReveal>
          <div className="text-center max-w-xl mx-auto mb-6 sm:mb-8 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#802B52]">
              Online Atelier Studio
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-4xl text-[#1C0D0A]">
              Design Your Cake
            </h2>
            <p className="text-xs sm:text-sm text-[#5C524E]">
              Customize tiers, flavours, glaze drips, toppings &amp; inscription. Watch your cake update live in 3D!
            </p>
          </div>

          {/* Live Vector Animated Studio Component */}
          <LiveCakeCustomizer />
        </ScrollReveal>
      </section>

      {/* Full Photo Inspection Modal for Showcase Cakes */}
      {inspectCake && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm"
          onClick={() => setInspectCake(null)}
        >
          <div 
            className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-[#E6DBCE]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setInspectCake(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close photo view"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>

            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-3/5 bg-[#F8F4EE] flex items-center justify-center p-2">
                <img
                  src={inspectCake.image}
                  alt={inspectCake.name}
                  className="w-full h-full max-h-[70vh] object-contain object-center"
                />
              </div>
              <div className="w-full md:w-2/5 p-6 sm:p-8 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#802B52]">
                    {inspectCake.category}
                  </span>
                  <h3 className="font-display font-bold text-2xl text-[#1C0D0A] leading-tight">
                    {inspectCake.name}
                  </h3>
                  <p className="text-xs text-[#5C524E] leading-relaxed">
                    {inspectCake.description}
                  </p>
                  <div className="pt-3 border-t border-[#E6DBCE] space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A6B72] block">
                      Architecture
                    </span>
                    <span className="text-xs font-semibold text-[#1C0D0A]">
                      {inspectCake.tiers}
                    </span>
                  </div>
                  <div className="pt-2 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A6B72] block">
                      Handcrafted Highlights
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {inspectCake.highlights.map((h, i) => (
                        <span
                          key={i}
                          className="text-[11px] bg-[#FAF8F5] border border-[#E6DBCE] px-2.5 py-0.5 rounded-full text-[#5C524E] font-medium"
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E6DBCE]">
                  <button
                    onClick={() => setInspectCake(null)}
                    className="w-full py-2.5 rounded-xl border border-[#E6DBCE] text-xs font-bold uppercase tracking-wider text-[#5C524E] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                  >
                    Close Preview
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
