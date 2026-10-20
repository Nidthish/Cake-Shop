"use client";

import { useState, useMemo } from "react";
import LiveCakeCustomizer from "./LiveCakeCustomizer";
import ScrollReveal from "@/components/common/ScrollReveal";

const WHATSAPP_NUMBER = "918489324697";
const PHONE_DISPLAY = "+91 84893 24697";

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

  // Form states (cleanly pre-filled from live studio builder without height, slices, eggless, or stand finish)
  const [formLayers, setFormLayers] = useState<string>("2 Layers");
  const [formFlavour, setFormFlavour] = useState<string>("Belgian Chocolate");
  const [formWeight, setFormWeight] = useState<string>("2.0 kg");
  const [formName, setFormName] = useState<string>("Happy Birthday");
  const [formToppings, setFormToppings] = useState<string>(
    "Fruits, Chocolate, Cream Swirl, Candles, Sprinkles, Name Plaque"
  );
  const [formAddress, setFormAddress] = useState<string>("Thillai Nagar, Trichy");
  const [formDate, setFormDate] = useState<string>("");
  const [formTime, setFormTime] = useState<string>("");
  const [formNotes, setFormNotes] = useState<string>("");


  // Generate direct WhatsApp link from manual form values (NO PRICES, NO HEIGHT, NO SLICE COUNT)
  const whatsappUrl = useMemo(() => {
    const lines = [
      "🎂 CUSTOM CAKE ORDER — LOLLIPOP CAKE STUDIO",
      "---------------------------------------",
      `Cake Layers: ${formLayers}`,
      `Flavour: ${formFlavour}`,
      `Weight: ${formWeight}`,
      formName.trim() ? `Name on Cake: "${formName.trim()}"` : "Name on Cake: None",
      formToppings.trim() ? `Selected Toppings: ${formToppings}` : "",
      `Delivery Address: ${formAddress.trim() || "Trichy"}`,
      formDate ? `Delivery Date: ${formDate}` : "",
      formTime.trim() ? `Delivery Time: ${formTime.trim()}` : "",
      formNotes.trim() ? `Special Notes: ${formNotes.trim()}` : "",
      "---------------------------------------",
      "Hello! I would like to order this custom cake from your website studio. Please confirm availability and order details!",
    ].filter(Boolean);

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
  }, [formLayers, formFlavour, formWeight, formName, formToppings, formAddress, formDate, formTime, formNotes]);

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

      {/* ── 3 & 4. STUDIO & ORDER FORM CONTAINER (FORM ABOVE STUDIO ON MOBILE ONLY) ── */}
      <div className="flex flex-col">
        {/* Live Cake Customizer (order-2 on Mobile, order-1 on Laptop) */}
        <section
          id="cake-customizer-section"
          className="order-2 lg:order-1 max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-8 sm:py-14"
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
                Customize tiers, flavours, glaze drips, toppings & inscription. Watch your cake update live in 3D!
              </p>
            </div>

            {/* Live Vector Animated Studio Component (Interactive For Fun Preview) */}
            <LiveCakeCustomizer />
          </ScrollReveal>
        </section>

        {/* Manual Editable Order Form (order-1 on Mobile, order-2 on Laptop) */}
        <section
          id="custom-cake-order-form"
          className="order-1 lg:order-2 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8 sm:pt-14 pb-12 sm:pb-20 lg:pt-0"
        >
          <ScrollReveal>
            <div className="bg-white rounded-3xl border border-[#E6C184]/70 p-5 sm:p-8 shadow-xl space-y-6">
            <div className="pb-3 border-b border-[#E6DBCE] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-display font-bold text-xl sm:text-2xl text-[#1C0D0A]">
                  Custom Cake Order Form
                </h3>
                <p className="text-xs text-[#5C524E]">
                  Enter your custom cake requirements to order directly on WhatsApp.
                </p>
              </div>
              <span className="text-[11px] font-bold text-[#802B52] uppercase tracking-wider">
                Ready to Send to WhatsApp
              </span>
            </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            
            {/* Cake Layers Field */}
            <div>
              <label className="text-[11px] font-bold text-[#5C524E] uppercase tracking-wider block mb-1">
                Cake Layers
              </label>
              <input
                type="text"
                value={formLayers}
                onChange={(e) => setFormLayers(e.target.value)}
                className="w-full bg-[#FAF5EE] border border-[#E6DBCE] rounded-xl px-3 py-2 text-xs font-semibold text-[#1C0D0A] focus:outline-none focus:border-[#802B52]"
              />
            </div>

            {/* Cake Flavour Field */}
            <div>
              <label className="text-[11px] font-bold text-[#5C524E] uppercase tracking-wider block mb-1">
                Cake Flavour
              </label>
              <input
                type="text"
                value={formFlavour}
                onChange={(e) => setFormFlavour(e.target.value)}
                className="w-full bg-[#FAF5EE] border border-[#E6DBCE] rounded-xl px-3 py-2 text-xs font-semibold text-[#1C0D0A] focus:outline-none focus:border-[#802B52]"
              />
            </div>

            {/* Cake Weight Field */}
            <div>
              <label className="text-[11px] font-bold text-[#5C524E] uppercase tracking-wider block mb-1">
                Cake Weight
              </label>
              <input
                type="text"
                value={formWeight}
                onChange={(e) => setFormWeight(e.target.value)}
                className="w-full bg-[#FAF5EE] border border-[#E6DBCE] rounded-xl px-3 py-2 text-xs font-semibold text-[#1C0D0A] focus:outline-none focus:border-[#802B52]"
              />
            </div>

            {/* Name on Cake Field */}
            <div>
              <label className="text-[11px] font-bold text-[#5C524E] uppercase tracking-wider block mb-1">
                Name on Cake
              </label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full bg-[#FAF5EE] border border-[#E6DBCE] rounded-xl px-3 py-2 text-xs font-semibold text-[#1C0D0A] focus:outline-none focus:border-[#802B52]"
              />
            </div>

            {/* Selected Toppings Field */}
            <div className="sm:col-span-1 md:col-span-2">
              <label className="text-[11px] font-bold text-[#5C524E] uppercase tracking-wider block mb-1">
                Selected Toppings & Garnishes
              </label>
              <input
                type="text"
                value={formToppings}
                onChange={(e) => setFormToppings(e.target.value)}
                className="w-full bg-[#FAF5EE] border border-[#E6DBCE] rounded-xl px-3 py-2 text-xs font-semibold text-[#1C0D0A] focus:outline-none focus:border-[#802B52]"
              />
            </div>

            {/* Delivery Address */}
            <div>
              <label className="text-[11px] font-bold text-[#5C524E] uppercase tracking-wider block mb-1">
                Delivery Address in Trichy
              </label>
              <input
                type="text"
                placeholder="e.g. Door No, Street, Thillai Nagar, Trichy"
                value={formAddress}
                onChange={(e) => setFormAddress(e.target.value)}
                className="w-full bg-[#FAF5EE] border border-[#E6DBCE] rounded-xl px-3 py-2 text-xs font-semibold text-[#1C0D0A] focus:outline-none focus:border-[#802B52]"
              />
            </div>

            {/* Delivery Date */}
            <div>
              <label className="text-[11px] font-bold text-[#5C524E] uppercase tracking-wider block mb-1">
                Delivery Date
              </label>
              <input
                type="date"
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                className="w-full bg-[#FAF5EE] border border-[#E6DBCE] rounded-xl px-3 py-2 text-xs font-semibold text-[#1C0D0A] focus:outline-none focus:border-[#802B52]"
              />
            </div>

            {/* Delivery Time */}
            <div>
              <label className="text-[11px] font-bold text-[#5C524E] uppercase tracking-wider block mb-1">
                Delivery Time
              </label>
              <input
                type="text"
                placeholder="e.g. 4:00 PM or Evening (5 PM - 8 PM)"
                value={formTime}
                onChange={(e) => setFormTime(e.target.value)}
                className="w-full bg-[#FAF5EE] border border-[#E6DBCE] rounded-xl px-3 py-2 text-xs font-semibold text-[#1C0D0A] focus:outline-none focus:border-[#802B52]"
              />
            </div>

            {/* Special Request Notes */}
            <div className="sm:col-span-2 md:col-span-3">
              <label className="text-[11px] font-bold text-[#5C524E] uppercase tracking-wider block mb-1">
                Special Request / Reference Photo Notes
              </label>
              <input
                type="text"
                placeholder="e.g. Please match invitation colors. I will send photo on WhatsApp."
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
                className="w-full bg-[#FAF5EE] border border-[#E6DBCE] rounded-xl px-3 py-2 text-xs font-semibold text-[#1C0D0A] focus:outline-none focus:border-[#802B52]"
              />
            </div>

          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:flex-1 bg-[#25D366] hover:bg-[#20ba59] text-white py-3.5 px-6 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all hover:scale-101 active:scale-99"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824z" />
              </svg>
              <span>Send Order to WhatsApp</span>
            </a>

            <a
              href={`tel:${WHATSAPP_NUMBER}`}
              className="w-full sm:w-auto bg-white hover:bg-[#FAF5EE] text-[#1C0D0A] border border-[#E6DBCE] hover:border-[#802B52]/40 py-3.5 px-5 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
            >
              <span className="material-symbols-outlined text-base text-[#802B52]">call</span>
              <span>Call {PHONE_DISPLAY}</span>
            </a>
          </div>
        </div>
      </ScrollReveal>
    </section>
  </div>

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
                    className="w-full py-2.5 rounded-full border border-[#E6DBCE] text-xs font-bold uppercase tracking-wider text-[#5C524E] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
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
