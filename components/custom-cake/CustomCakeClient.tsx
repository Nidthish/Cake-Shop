"use client";

import { useState, useMemo } from "react";

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

interface FlavourOption {
  id: string;
  name: string;
  badgeName: string;
  tierTopColor: string;
  tierBaseColor: string;
  dripColor: string;
  accentBg: string;
  glowColor: string;
  topperDefault: "crown" | "heart" | "teddy" | "star" | "rosette";
}

const FLAVOUR_OPTIONS: FlavourOption[] = [
  {
    id: "belgian-chocolate",
    name: "Belgian Chocolate",
    badgeName: "BELGIAN CHOCOLATE",
    tierTopColor: "#4A2417",
    tierBaseColor: "#1C0A05",
    dripColor: "#120502",
    accentBg: "bg-[#2A130B]",
    glowColor: "rgba(180, 110, 50, 0.22)",
    topperDefault: "crown",
  },
  {
    id: "red-velvet",
    name: "Red Velvet",
    badgeName: "RED VELVET",
    tierTopColor: "#9E1C2F",
    tierBaseColor: "#520A14",
    dripColor: "#FFF8F0",
    accentBg: "bg-[#7D1525]",
    glowColor: "rgba(225, 29, 72, 0.25)",
    topperDefault: "heart",
  },
  {
    id: "vanilla-gold",
    name: "Vanilla Gold",
    badgeName: "VANILLA GOLD",
    tierTopColor: "#FCF8F0",
    tierBaseColor: "#E2D1B3",
    dripColor: "#D4AF37",
    accentBg: "bg-[#E3D4B8]",
    glowColor: "rgba(212, 175, 55, 0.28)",
    topperDefault: "crown",
  },
  {
    id: "butterscotch",
    name: "Butterscotch",
    badgeName: "BUTTERSCOTCH",
    tierTopColor: "#C27532",
    tierBaseColor: "#70350B",
    dripColor: "#472005",
    accentBg: "bg-[#995420]",
    glowColor: "rgba(217, 119, 6, 0.25)",
    topperDefault: "star",
  },
  {
    id: "fresh-mango",
    name: "Fresh Mango",
    badgeName: "FRESH MANGO",
    tierTopColor: "#F59325",
    tierBaseColor: "#A35105",
    dripColor: "#6B3302",
    accentBg: "bg-[#CE7316]",
    glowColor: "rgba(249, 115, 22, 0.25)",
    topperDefault: "star",
  },
  {
    id: "blueberry",
    name: "Blueberry",
    badgeName: "BLUEBERRY",
    tierTopColor: "#845A94",
    tierBaseColor: "#412152",
    dripColor: "#2A1236",
    accentBg: "bg-[#6D477C]",
    glowColor: "rgba(147, 51, 234, 0.25)",
    topperDefault: "rosette",
  },
  {
    id: "strawberry",
    name: "Strawberry",
    badgeName: "STRAWBERRY",
    tierTopColor: "#E85D7B",
    tierBaseColor: "#9C223E",
    dripColor: "#FFF5F7",
    accentBg: "bg-[#D14A68]",
    glowColor: "rgba(244, 63, 94, 0.26)",
    topperDefault: "heart",
  },
  {
    id: "black-forest",
    name: "Black Forest",
    badgeName: "BLACK FOREST",
    tierTopColor: "#331810",
    tierBaseColor: "#140602",
    dripColor: "#0D0301",
    accentBg: "bg-[#240F09]",
    glowColor: "rgba(225, 29, 72, 0.2)",
    topperDefault: "heart",
  },
  {
    id: "lotus-biscoff",
    name: "Lotus Biscoff",
    badgeName: "LOTUS BISCOFF",
    tierTopColor: "#A85E2B",
    tierBaseColor: "#5E2C09",
    dripColor: "#3D1A04",
    accentBg: "bg-[#8C4A1D]",
    glowColor: "rgba(180, 83, 9, 0.25)",
    topperDefault: "star",
  },
  {
    id: "pistachio",
    name: "Pistachio",
    badgeName: "PISTACHIO",
    tierTopColor: "#7CA35D",
    tierBaseColor: "#426127",
    dripColor: "#273D14",
    accentBg: "bg-[#658D46]",
    glowColor: "rgba(34, 197, 94, 0.22)",
    topperDefault: "rosette",
  },
];

const LAYER_OPTIONS = [
  { count: 1, label: "1 Layer" },
  { count: 2, label: "2 Layers" },
  { count: 3, label: "3 Layers" },
];

const WEIGHT_OPTIONS = [
  { weight: "1.5 kg" },
  { weight: "2.0 kg" },
  { weight: "3.0 kg" },
  { weight: "4.0 kg+" },
];

const TOPPER_OPTIONS = [
  { id: "auto", label: "Auto Match", icon: "auto_awesome" },
  { id: "crown", label: "Tiara Crown", icon: "military_tech" },
  { id: "heart", label: "Romantic Heart", icon: "favorite" },
  { id: "teddy", label: "Sugar Teddy", icon: "pets" },
  { id: "star", label: "Golden Star", icon: "star" },
  { id: "rosette", label: "Sugar Flowers", icon: "local_florist" },
];

export default function CustomCakeClient() {
  // Photo inspection modal state
  const [inspectCake, setInspectCake] = useState<ShowcaseCake | null>(null);

  // Builder visual states
  const [layers, setLayers] = useState<1 | 2 | 3>(2);
  const [selectedFlavourId, setSelectedFlavourId] = useState<string>("belgian-chocolate");
  const [selectedWeight, setSelectedWeight] = useState<string>("2.0 kg");
  const [customName, setCustomName] = useState<string>("Happy Birthday");
  const [selectedTopperId, setSelectedTopperId] = useState<string>("auto");

  // Form states (pre-filled from builder, but freely editable manually!)
  const [formFlavour, setFormFlavour] = useState<string>("Belgian Chocolate");
  const [formLayers, setFormLayers] = useState<string>("2 Layers");
  const [formWeight, setFormWeight] = useState<string>("2.0 kg");
  const [formName, setFormName] = useState<string>("Happy Birthday");
  const [formArea, setFormArea] = useState<string>("Thillai Nagar");
  const [formDate, setFormDate] = useState<string>("");
  const [formNotes, setFormNotes] = useState<string>("");

  // Synchronize builder choices into manual form fields
  const handleFlavourChange = (flav: FlavourOption) => {
    setSelectedFlavourId(flav.id);
    setFormFlavour(flav.name);
  };

  const handleLayersChange = (l: 1 | 2 | 3) => {
    setLayers(l);
    setFormLayers(`${l} ${l === 1 ? "Layer" : "Layers"}`);
  };

  const handleWeightChange = (w: string) => {
    setSelectedWeight(w);
    setFormWeight(w);
  };

  const handleNameChange = (val: string) => {
    setCustomName(val);
    setFormName(val);
  };

  const currentFlavour = useMemo(() => {
    return FLAVOUR_OPTIONS.find((f) => f.id === selectedFlavourId) || FLAVOUR_OPTIONS[0];
  }, [selectedFlavourId]);

  // Determine active topper type
  const activeTopperType = useMemo(() => {
    if (selectedTopperId === "auto") {
      return currentFlavour.topperDefault;
    }
    return selectedTopperId;
  }, [selectedTopperId, currentFlavour]);

  // Generate direct WhatsApp link from manual form values
  const whatsappUrl = useMemo(() => {
    const lines = [
      "CUSTOM CAKE ORDER — LOLLIPOP CAKE SHOP",
      "---------------------------------------",
      `Flavour: ${formFlavour}`,
      `Layers: ${formLayers}`,
      `Weight: ${formWeight}`,
      formName.trim() ? `Name on Cake: "${formName.trim()}"` : "Name on Cake: None",
      `Delivery Area: ${formArea}, Trichy`,
      formDate ? `Event Date: ${formDate}` : "",
      formNotes.trim() ? `Special Notes: ${formNotes.trim()}` : "",
      "---------------------------------------",
      "Hello! I would like to order this custom cake in Trichy. Please confirm price quote and availability.",
    ].filter(Boolean);

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
  }, [formFlavour, formLayers, formWeight, formName, formArea, formDate, formNotes]);

  return (
    <div className="bg-[#FAF5EE] min-h-screen text-[#1C0D0A] selection:bg-[#802B52] selection:text-white pb-20">
      
      {/* ── 1. CLEAN HEADER (SIMPLE WORDS, NO COMPLICATED TEXT) ───────────── */}
      <section className="pt-8 pb-6 sm:pt-14 sm:pb-8 border-b border-[#E6C184]/30 bg-gradient-to-b from-[#FAF5EE] to-[#F6EDE1]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-2">
          <h1 className="font-display font-bold text-3xl sm:text-5xl text-[#1C0D0A] tracking-tight">
            Customized Cakes
          </h1>
          <p className="text-xs sm:text-sm text-[#5C524E] max-w-lg mx-auto">
            Explore our signature creations or design your own cake online with instant WhatsApp ordering.
          </p>
        </div>
      </section>

      {/* ── 2. SHOWCASE: OUR BEST CAKES (FULL-IMAGE EDITORIAL SHOWCASE, NO CARDS, NO BUY BUTTONS) ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 border-b border-[#E6C184]/30">
        
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-20 space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#802B52]">
            Celebration Portfolio
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-[#1C0D0A] tracking-tight">
            Our Best Cakes
          </h2>
          <p className="text-xs sm:text-sm text-[#5C524E] max-w-md mx-auto">
            A visual showcase of recent custom masterpieces handcrafted for celebrations in Trichy.
          </p>
        </div>

        {/* Editorial Borderless Layout (Alternating Large Photography & Rich Narrative) */}
        <div className="space-y-16 sm:space-y-28">
          {SHOWCASE_CAKES.map((cake, idx) => {
            const isEven = idx % 2 === 1;
            // Responsive: mobile shows top 2 cakes (< md), laptop shows all 4 cakes (>= md)
            const isHiddenOnMobile = idx >= 2;

            return (
              <div
                key={cake.id}
                className={`${isHiddenOnMobile ? "hidden md:block" : "block"} transition-all duration-700`}
              >
                <div
                  className={`flex flex-col lg:flex-row items-center gap-8 sm:gap-12 lg:gap-16 ${
                    isEven ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  {/* Big Animated Full Image Container */}
                  <div className="w-full lg:w-1/2">
                    <div
                      onClick={() => setInspectCake(cake)}
                      className="group relative cursor-pointer overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 bg-[#F0E5D8]"
                    >
                      {/* Image with smooth zoom on hover */}
                      <div className="aspect-[4/3] w-full overflow-hidden">
                        <img
                          src={cake.image}
                          alt={cake.name}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-108"
                        />
                      </div>

                      {/* Subtle Vignette Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Category Badge on Image */}
                      <div className="absolute top-4 left-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-white/95 text-[#802B52] border border-[#E6DBCE] shadow-xs backdrop-blur-xs">
                          {cake.category}
                        </span>
                      </div>

                      {/* Click to Inspect Hint */}
                      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="inline-flex items-center gap-1.5 bg-[#1C0D0A]/85 text-white text-[11px] font-medium px-3 py-1.5 rounded-full backdrop-blur-xs shadow-md">
                          <span className="material-symbols-outlined text-sm">zoom_in</span>
                          <span>View Full Photo</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Rich Narrative & Explanation of the Cake (No Buy / Order Buttons!) */}
                  <div className="w-full lg:w-1/2 space-y-4 sm:space-y-5">
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold uppercase tracking-widest text-[#802B52]">
                        {cake.tagline}
                      </span>
                      <h3 className="font-display font-bold text-2xl sm:text-4xl text-[#1C0D0A] leading-tight">
                        {cake.name}
                      </h3>
                    </div>

                    <p className="text-xs sm:text-sm text-[#5C524E] leading-relaxed">
                      {cake.description}
                    </p>

                    {/* Architecture Details */}
                    <div className="pt-2 border-l-2 border-[#802B52] pl-4 py-1 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A6B72] block">
                        Architecture
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-[#1C0D0A] block">
                        {cake.tiers}
                      </span>
                    </div>

                    {/* Artisanal Craftsmanship Elements */}
                    <div className="pt-1 space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A6B72] block">
                        Handcrafted Techniques
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {cake.highlights.map((h, i) => (
                          <span
                            key={i}
                            className="text-[11px] bg-white border border-[#E6DBCE] px-3 py-1 rounded-full text-[#5C524E] font-medium shadow-2xs"
                          >
                            {h}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Recommended Flavours Note */}
                    <div className="pt-1 text-xs text-[#7A6B72]">
                      <span className="font-bold text-[#1C0D0A]">Recommended Flavours: </span>
                      {cake.flavours.join(" • ")}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </section>

      {/* ── 3. CREATE YOUR CAKE & CUSTOM BUILDER (PLACED AFTER BEST CAKES) ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        
        <div className="text-center max-w-xl mx-auto mb-6 sm:mb-8 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#802B52]">
            Online Atelier Studio
          </span>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#1C0D0A]">
            Create Your Cake
          </h2>
          <p className="text-xs text-[#5C524E]">
            Tap the options below to build your cake. The order form fills automatically!
          </p>
        </div>

        {/* 2-Column Layout on Laptop, Compact Stack on Mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          {/* ── LEFT: MAGICAL PYRAMID TIERED CAKE WITH RICH CELEBRATION ASSETS ── */}
          <div className="lg:col-span-6 bg-white rounded-3xl border border-[#E6C184]/70 p-5 sm:p-6 shadow-xl flex flex-col items-center justify-between relative overflow-hidden">
            
            {/* Top Bar matching reference */}
            <div className="w-full flex items-center justify-between pb-3 mb-2 border-b border-[#E6DBCE]/80 text-[11px]">
              <span className="font-bold text-[#802B52] uppercase tracking-wider font-mono">
                LIVE CAKE PREVIEW
              </span>
              <span className="text-[#5C524E] font-semibold">
                {layers} Tier{layers > 1 ? "s" : ""} • {selectedWeight}
              </span>
            </div>

            {/* Cake Ambient Stage Container with Animated Celebration Background */}
            <div className="w-full h-80 sm:h-92 relative flex items-center justify-center select-none overflow-hidden rounded-2xl bg-gradient-to-b from-[#FDFBF7] via-[#FAF3E8] to-[#F5ECE0]">
              
              {/* Dynamic Ambient Center Glow */}
              <div
                className="absolute inset-0 pointer-events-none transition-all duration-700"
                style={{
                  background: `radial-gradient(circle at 50% 60%, ${currentFlavour.glowColor} 0%, rgba(255,255,255,0) 70%)`,
                }}
              />

              {/* CELEBRATION ASSETS: BALLOONS, HEARTS, STARS, PARTY SPARKLES (SVG) */}
              <svg
                viewBox="0 0 400 340"
                className="w-full h-full absolute inset-0 pointer-events-none"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  {/* Balloon Gradients */}
                  <linearGradient id="balGold" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFF2B2" />
                    <stop offset="50%" stopColor="#E5B94E" />
                    <stop offset="100%" stopColor="#B38728" />
                  </linearGradient>
                  <linearGradient id="balRose" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFC2D1" />
                    <stop offset="50%" stopColor="#E86280" />
                    <stop offset="100%" stopColor="#AA2E48" />
                  </linearGradient>
                  <linearGradient id="balBurgundy" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#B84A74" />
                    <stop offset="60%" stopColor="#802B52" />
                    <stop offset="100%" stopColor="#4A122E" />
                  </linearGradient>

                  {/* Cake Tier Gradient */}
                  <linearGradient id="cakeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={currentFlavour.tierTopColor} />
                    <stop offset="45%" stopColor={currentFlavour.tierTopColor} />
                    <stop offset="100%" stopColor={currentFlavour.tierBaseColor} />
                  </linearGradient>

                  {/* Golden Platter Gradient */}
                  <linearGradient id="platterGold" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#B88A2E" />
                    <stop offset="35%" stopColor="#FDEAA8" />
                    <stop offset="60%" stopColor="#FFF5D1" />
                    <stop offset="80%" stopColor="#D9A73A" />
                    <stop offset="100%" stopColor="#9E731F" />
                  </linearGradient>

                  {/* Soft Platter Drop Shadow */}
                  <filter id="platterShadow" x="-10%" y="-10%" width="120%" height="150%">
                    <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#2A1407" floodOpacity="0.28" />
                  </filter>

                  {/* Tier Drop Shadow */}
                  <filter id="tierShadow" x="-10%" y="-10%" width="120%" height="130%">
                    <feDropShadow dx="0" dy="3" stdDeviation="3.5" floodColor="#000000" floodOpacity="0.32" />
                  </filter>
                </defs>

                {/* ── 1. CELEBRATION BALLOONS (LEFT CLUSTER) ── */}
                <g className="animate-balloon-left">
                  {/* Balloon Strings */}
                  <path d="M 40 82 Q 48 135 55 180" stroke="#C5A030" strokeWidth="1.2" fill="none" opacity="0.6" strokeDasharray="2,2" />
                  <path d="M 68 62 Q 62 120 57 182" stroke="#E6A8B8" strokeWidth="1.2" fill="none" opacity="0.6" />
                  <path d="M 22 108 Q 38 148 53 184" stroke="#D4AF37" strokeWidth="1.2" fill="none" opacity="0.6" strokeDasharray="3,2" />
                  
                  {/* Balloon 1: Gold */}
                  <ellipse cx="40" cy="65" rx="18" ry="22" fill="url(#balGold)" opacity="0.9" />
                  <ellipse cx="34" cy="56" rx="4" ry="7" fill="#FFFFFF" opacity="0.6" />
                  <polygon points="38,87 42,87 40,90" fill="#B38728" />

                  {/* Balloon 2: Rose */}
                  <ellipse cx="68" cy="46" rx="16" ry="20" fill="url(#balRose)" opacity="0.88" />
                  <ellipse cx="63" cy="38" rx="3.5" ry="6" fill="#FFFFFF" opacity="0.55" />
                  <polygon points="66,66 70,66 68,69" fill="#AA2E48" />

                  {/* Balloon 3: Burgundy */}
                  <ellipse cx="22" cy="92" rx="14" ry="17" fill="url(#balBurgundy)" opacity="0.85" />
                  <ellipse cx="18" cy="85" rx="3" ry="5" fill="#FFFFFF" opacity="0.5" />
                  <polygon points="20,109 24,109 22,112" fill="#802B52" />
                </g>

                {/* ── 2. CELEBRATION BALLOONS (RIGHT CLUSTER) ── */}
                <g className="animate-balloon-right">
                  {/* Balloon Strings */}
                  <path d="M 360 82 Q 352 135 345 180" stroke="#C5A030" strokeWidth="1.2" fill="none" opacity="0.6" strokeDasharray="2,2" />
                  <path d="M 332 62 Q 338 120 343 182" stroke="#E6A8B8" strokeWidth="1.2" fill="none" opacity="0.6" />
                  <path d="M 378 108 Q 362 148 347 184" stroke="#D4AF37" strokeWidth="1.2" fill="none" opacity="0.6" strokeDasharray="3,2" />

                  {/* Balloon 1: Rose */}
                  <ellipse cx="360" cy="65" rx="18" ry="22" fill="url(#balRose)" opacity="0.9" />
                  <ellipse cx="354" cy="56" rx="4" ry="7" fill="#FFFFFF" opacity="0.6" />
                  <polygon points="358,87 362,87 360,90" fill="#AA2E48" />

                  {/* Balloon 2: Gold */}
                  <ellipse cx="332" cy="46" rx="16" ry="20" fill="url(#balGold)" opacity="0.88" />
                  <ellipse cx="327" cy="38" rx="3.5" ry="6" fill="#FFFFFF" opacity="0.55" />
                  <polygon points="330,66 334,66 332,69" fill="#B38728" />

                  {/* Balloon 3: Burgundy */}
                  <ellipse cx="378" cy="92" rx="14" ry="17" fill="url(#balBurgundy)" opacity="0.85" />
                  <ellipse cx="374" cy="85" rx="3" ry="5" fill="#FFFFFF" opacity="0.5" />
                  <polygon points="376,109 380,109 378,112" fill="#802B52" />
                </g>

                {/* ── 3. FLOATING HEARTS & CRACKER STARS (MANY ELEVATING ASSETS) ── */}
                {/* Floating Hearts */}
                <g className="animate-float-heart-1">
                  <path d="M 85 140 C 85 133 75 130 75 137 C 75 144 85 152 85 152 C 85 152 95 144 95 137 C 95 130 85 133 85 140 Z" fill="#E11D48" opacity="0.75" />
                </g>
                <g className="animate-float-heart-2">
                  <path d="M 315 135 C 315 128 305 125 305 132 C 305 139 315 147 315 147 C 315 147 325 139 325 132 C 325 125 315 128 315 135 Z" fill="#F43F5E" opacity="0.7" />
                </g>
                <g className="animate-float-heart-3">
                  <path d="M 50 195 C 50 190 42 188 42 193 C 42 198 50 204 50 204 C 50 204 58 198 58 193 C 58 188 50 190 50 195 Z" fill="#E11D48" opacity="0.6" />
                </g>
                <g className="animate-float-heart-1">
                  <path d="M 350 195 C 350 190 342 188 342 193 C 342 198 350 204 350 204 C 350 204 358 198 358 193 C 358 188 350 190 350 195 Z" fill="#FB7185" opacity="0.65" />
                </g>
                <g className="animate-float-heart-2">
                  <path d="M 125 60 C 125 56 118 54 118 58 C 118 63 125 68 125 68 C 125 68 132 63 132 58 C 132 54 125 56 125 60 Z" fill="#E11D48" opacity="0.55" />
                </g>
                <g className="animate-float-heart-3">
                  <path d="M 275 60 C 275 56 268 54 268 58 C 268 63 275 68 275 68 C 275 68 282 63 282 58 C 282 54 275 56 275 60 Z" fill="#F43F5E" opacity="0.55" />
                </g>

                {/* Sparkling Crack Stars & Poppers */}
                <path d="M 105 40 Q 105 46 111 46 Q 105 46 105 52 Q 105 46 99 46 Q 105 46 105 40 Z" fill="#F59E0B" className="animate-twinkle-1" />
                <path d="M 295 40 Q 295 46 301 46 Q 295 46 295 52 Q 295 46 289 46 Q 295 46 295 40 Z" fill="#FBBF24" className="animate-twinkle-2" />
                <path d="M 155 30 Q 155 35 159 35 Q 155 35 155 40 Q 155 35 151 35 Q 155 35 155 30 Z" fill="#D97706" className="animate-twinkle-3" />
                <path d="M 245 30 Q 245 35 249 35 Q 245 35 245 40 Q 245 35 241 35 Q 245 35 245 30 Z" fill="#F59E0B" className="animate-twinkle-1" />

                {/* Starburst Cracker Sparkle Left */}
                <g opacity="0.75" className="animate-twinkle-2">
                  <line x1="88" y1="92" x2="88" y2="82" stroke="#E5B94E" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="88" y1="92" x2="88" y2="102" stroke="#E5B94E" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="88" y1="92" x2="78" y2="92" stroke="#E5B94E" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="88" y1="92" x2="98" y2="92" stroke="#E5B94E" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="88" cy="92" r="2" fill="#FFFFFF" />
                </g>

                {/* Starburst Cracker Sparkle Right */}
                <g opacity="0.75" className="animate-twinkle-3">
                  <line x1="312" y1="92" x2="312" y2="82" stroke="#E5B94E" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="312" y1="92" x2="312" y2="102" stroke="#E5B94E" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="312" y1="92" x2="302" y2="92" stroke="#E5B94E" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="312" y1="92" x2="322" y2="92" stroke="#E5B94E" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="312" cy="92" r="2" fill="#FFFFFF" />
                </g>

                {/* ── 4. GOLDEN METALLIC TRAY / PLATTER (BOTTOM OF CAKE) ── */}
                <g filter="url(#platterShadow)">
                  {/* Platter Pedestal Foot */}
                  <rect x="175" y="278" width="50" height="15" rx="5" ry="5" fill="#9E731F" />
                  <rect x="160" y="291" width="80" height="7" rx="3.5" ry="3.5" fill="url(#platterGold)" />
                  {/* Wide Golden Platter Table (Width 310, wider than base tier 270) */}
                  <rect x="45" y="268" width="310" height="13" rx="6.5" ry="6.5" fill="url(#platterGold)" stroke="#D4AF37" strokeWidth="0.8" />
                  {/* Top Platter Highlight Rim */}
                  <line x1="60" y1="270" x2="340" y2="270" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.7" strokeLinecap="round" />
                </g>

                {/* ── 5. PROPER PYRAMID TIERED CAKE ARCHITECTURE ── */}

                {/* TIER 1: BASE TIER (WIDEST: Width = 270, Center = 200, Left = 65, Right = 335) */}
                <g filter="url(#tierShadow)">
                  {/* Base Tier Body (clean modern rectangular slab with subtle rx=10) */}
                  <rect x="65" y="202" width="270" height="68" rx="10" ry="10" fill="url(#cakeGradient)" />
                  
                  {/* Dripping Glaze along top edge of Tier 1 */}
                  <path
                    d="M 65 210 Q 75 220 85 210 Q 95 226 105 212 Q 118 228 130 211 Q 148 225 165 212 Q 185 228 200 213 Q 215 227 235 211 Q 255 228 270 212 Q 285 226 300 211 Q 315 224 325 210 Q 332 216 335 210 L 335 202 L 65 202 Z"
                    fill={currentFlavour.dripColor}
                    opacity="0.9"
                  />

                  {/* Top Rim Highlight */}
                  <line x1="72" y1="203" x2="328" y2="203" stroke="#FFFFFF" strokeWidth="1" opacity="0.35" />

                  {/* ICONIC CENTER PLAQUE (EXACT MATCH TO REFERENCE PHOTO) */}
                  <g>
                    {/* Plaque Background & Double Gold Border */}
                    <rect x="110" y="222" width="180" height="38" rx="19" ry="19" fill="#FFFDF9" stroke="#D4AF37" strokeWidth="2.2" />
                    <rect x="113" y="225" width="174" height="32" rx="16" ry="16" fill="none" stroke="#E6C184" strokeWidth="0.8" opacity="0.7" />
                    
                    {/* Line 1: Inscribed Name */}
                    <text
                      x="200"
                      y="238"
                      textAnchor="middle"
                      fill="#1C0D0A"
                      fontFamily="var(--font-cormorant), Georgia, serif"
                      fontSize="13"
                      fontWeight="700"
                    >
                      {customName.trim() || "Happy Birthday"}
                    </text>

                    {/* Line 2: Flavour Badge Name in bold tracking */}
                    <text
                      x="200"
                      y="251"
                      textAnchor="middle"
                      fill="#802B52"
                      fontFamily="var(--font-manrope), sans-serif"
                      fontSize="8.5"
                      fontWeight="800"
                      letterSpacing="1.8px"
                    >
                      {currentFlavour.badgeName}
                    </text>
                  </g>
                </g>

                {/* TIER 2: MIDDLE TIER (NARROWER: Width = 196, Center = 200, Left = 102, Right = 298) */}
                {layers >= 2 && (
                  <g filter="url(#tierShadow)" className="animate-tier-mount">
                    {/* Middle Tier Body */}
                    <rect x="102" y="146" width="196" height="58" rx="8" ry="8" fill="url(#cakeGradient)" />

                    {/* Tier 2 Glaze Drips */}
                    <path
                      d="M 102 154 Q 112 166 122 153 Q 135 168 148 154 Q 165 169 180 155 Q 200 170 215 154 Q 232 168 250 154 Q 268 168 282 153 Q 292 164 298 154 L 298 146 L 102 146 Z"
                      fill={currentFlavour.dripColor}
                      opacity="0.9"
                    />

                    {/* Metallic Accent Trim across Tier 2 */}
                    <line x1="108" y1="147" x2="292" y2="147" stroke="#D4AF37" strokeWidth="1.2" opacity="0.8" />
                  </g>
                )}

                {/* TIER 3: TOP TIER (NARROWEST: Width = 132, Center = 200, Left = 134, Right = 266) */}
                {layers === 3 && (
                  <g filter="url(#tierShadow)" className="animate-tier-mount">
                    {/* Top Tier Body */}
                    <rect x="134" y="94" width="132" height="54" rx="7" ry="7" fill="url(#cakeGradient)" />

                    {/* Tier 3 Glaze Drips */}
                    <path
                      d="M 134 102 Q 144 114 154 102 Q 168 116 182 103 Q 200 117 215 102 Q 232 116 246 102 Q 258 113 266 102 L 266 94 L 134 94 Z"
                      fill={currentFlavour.dripColor}
                      opacity="0.9"
                    />

                    {/* Top Tier Rim Highlight */}
                    <line x1="140" y1="95" x2="260" y2="95" stroke="#FFFFFF" strokeWidth="1" opacity="0.4" />
                  </g>
                )}

                {/* ── 6. DYNAMIC TOPPER MOUNT (ON SUMMIT OF HIGHEST TIER) ── */}
                <g
                  transform={`translate(200, ${layers === 1 ? 194 : layers === 2 ? 138 : 86})`}
                  className="animate-topper-bob"
                >
                  {/* Stem connector */}
                  <line x1="0" y1="0" x2="0" y2="6" stroke="#C5A030" strokeWidth="2" strokeLinecap="round" />

                  {/* Tiara Crown */}
                  {activeTopperType === "crown" && (
                    <g transform="translate(-16, -24)">
                      <path
                        d="M 0 18 L 4 4 L 11 12 L 16 0 L 21 12 L 28 4 L 32 18 Z"
                        fill="url(#platterGold)"
                        stroke="#B88A2E"
                        strokeWidth="1.2"
                        strokeLinejoin="round"
                      />
                      <circle cx="16" cy="2" r="2.5" fill="#FFFFFF" />
                      <circle cx="4" cy="5" r="2" fill="#E11D48" />
                      <circle cx="28" cy="5" r="2" fill="#E11D48" />
                      <rect x="0" y="18" width="32" height="3" rx="1.5" fill="#AA820A" />
                    </g>
                  )}

                  {/* Romantic Heart */}
                  {activeTopperType === "heart" && (
                    <g transform="translate(-14, -26)">
                      <path
                        d="M 14 26 C 14 26 0 17 0 8 C 0 3 4 0 9 0 C 12 0 14 3 14 3 C 14 3 16 0 19 0 C 24 0 28 3 28 8 C 28 17 14 26 14 26 Z"
                        fill="#E11D48"
                        stroke="#FFF0F2"
                        strokeWidth="1.5"
                      />
                      <ellipse cx="8" cy="6" rx="2.5" ry="4" fill="#FFFFFF" opacity="0.55" transform="rotate(-25 8 6)" />
                    </g>
                  )}

                  {/* Golden Star */}
                  {activeTopperType === "star" && (
                    <g transform="translate(-15, -25)">
                      <polygon
                        points="15,0 19,10 30,11 22,18 24,29 15,23 6,29 8,18 0,11 11,10"
                        fill="url(#platterGold)"
                        stroke="#AA820A"
                        strokeWidth="1"
                      />
                      <circle cx="15" cy="15" r="3" fill="#FFFFFF" opacity="0.65" />
                    </g>
                  )}

                  {/* Sugar Teddy */}
                  {activeTopperType === "teddy" && (
                    <g transform="translate(-14, -24)">
                      {/* Ears */}
                      <circle cx="4" cy="4" r="4.5" fill="#8C5326" />
                      <circle cx="4" cy="4" r="2.5" fill="#FFD5AC" />
                      <circle cx="24" cy="4" r="4.5" fill="#8C5326" />
                      <circle cx="24" cy="4" r="2.5" fill="#FFD5AC" />
                      {/* Head */}
                      <circle cx="14" cy="14" r="11" fill="#A86A38" />
                      {/* Snout */}
                      <ellipse cx="14" cy="17" rx="5" ry="4" fill="#FFD5AC" />
                      <polygon points="12,15 16,15 14,17" fill="#1C0A05" />
                      {/* Eyes */}
                      <circle cx="10" cy="12" r="1.5" fill="#1C0A05" />
                      <circle cx="18" cy="12" r="1.5" fill="#1C0A05" />
                    </g>
                  )}

                  {/* Sugar Rose */}
                  {activeTopperType === "rosette" && (
                    <g transform="translate(-14, -22)">
                      <circle cx="14" cy="12" r="10" fill="#E11D48" />
                      <circle cx="14" cy="12" r="7" fill="#F43F5E" />
                      <circle cx="14" cy="12" r="4" fill="#FB7185" />
                      <circle cx="14" cy="12" r="2" fill="#FFF1F2" />
                      {/* Green leaf */}
                      <path d="M 4 18 Q 0 24 8 22 Q 12 18 4 18 Z" fill="#22C55E" />
                      <path d="M 24 18 Q 28 24 20 22 Q 16 18 24 18 Z" fill="#22C55E" />
                    </g>
                  )}
                </g>
              </svg>
            </div>

            {/* Bottom Flavour and Weight Bar */}
            <div className="w-full pt-3 border-t border-[#E6DBCE] flex items-center justify-between text-xs text-[#5C524E]">
              <span className="font-bold text-[#1C0D0A]">{currentFlavour.name}</span>
              <span className="font-bold text-[#802B52] font-mono">{selectedWeight}</span>
            </div>
          </div>

          {/* ── RIGHT: COMPACT CONTROLS (NO ENDLESS SCROLLING) ──────────── */}
          <div className="lg:col-span-6 space-y-3.5">
            
            {/* 1. LAYERS (Compact 3 buttons) */}
            <div className="bg-white rounded-2xl border border-[#E6DBCE] p-3 shadow-xs space-y-1.5">
              <label className="text-xs font-bold text-[#1C0D0A] block">
                1. Layers (Pyramid Structure)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {LAYER_OPTIONS.map((opt) => (
                  <button
                    key={opt.count}
                    type="button"
                    onClick={() => handleLayersChange(opt.count as 1 | 2 | 3)}
                    className={`py-2 px-2 rounded-xl text-center border transition-all ${
                      layers === opt.count
                        ? "bg-[#802B52] text-white border-[#802B52] font-bold shadow-xs scale-101"
                        : "bg-[#FAF5EE] text-[#1C0D0A] border-[#E6DBCE] hover:border-[#802B52]/40"
                    }`}
                  >
                    <span className="block text-xs font-bold">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. FLAVOURS (Compact 10 flavours from reference) */}
            <div className="bg-white rounded-2xl border border-[#E6DBCE] p-3 shadow-xs space-y-1.5">
              <label className="text-xs font-bold text-[#1C0D0A] block">
                2. Flavour
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {FLAVOUR_OPTIONS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => handleFlavourChange(f)}
                    className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all ${
                      selectedFlavourId === f.id
                        ? "bg-white border-[#802B52] ring-2 ring-[#802B52]/30 shadow-xs"
                        : "bg-[#FAF5EE] border-[#E6DBCE] hover:border-[#802B52]/40"
                    }`}
                  >
                    <span className={`w-3.5 h-3.5 rounded-full shrink-0 border border-black/10 ${f.accentBg}`} />
                    <span className="text-[11px] font-bold text-[#1C0D0A] truncate">
                      {f.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. WEIGHT (Compact 4 buttons) */}
            <div className="bg-white rounded-2xl border border-[#E6DBCE] p-3 shadow-xs space-y-1.5">
              <label className="text-xs font-bold text-[#1C0D0A] block">
                3. Weight
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {WEIGHT_OPTIONS.map((w) => (
                  <button
                    key={w.weight}
                    type="button"
                    onClick={() => handleWeightChange(w.weight)}
                    className={`py-2 px-1 rounded-xl text-center border transition-all ${
                      selectedWeight === w.weight
                        ? "bg-[#802B52] text-white border-[#802B52] font-bold shadow-xs scale-101"
                        : "bg-[#FAF5EE] text-[#1C0D0A] border-[#E6DBCE] hover:border-[#802B52]/40"
                    }`}
                  >
                    <span className="block text-xs font-bold">{w.weight}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. NAME TO WRITE (Compact input, reduced font size) */}
            <div className="bg-white rounded-2xl border border-[#E6DBCE] p-3 shadow-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#1C0D0A]">
                  4. Name to Write on Cake
                </label>
                <span className="text-[10px] text-[#7A6B72]">Live on base plaque</span>
              </div>
              <input
                type="text"
                placeholder="Enter name or message..."
                value={customName}
                maxLength={30}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full bg-[#FAF5EE] border border-[#E6DBCE] rounded-xl px-3 py-1.5 text-xs sm:text-sm font-semibold text-[#1C0D0A] focus:outline-none focus:border-[#802B52]"
              />
              <div className="flex flex-wrap gap-1 pt-0.5">
                {["Happy Birthday", "Aarav", "Forever Together", "Sweet Little Princess"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleNameChange(s)}
                    className="text-[10px] bg-[#FAF5EE] border border-[#E6DBCE] px-2 py-0.5 rounded-md text-[#5C524E] hover:border-[#802B52]"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. TOPPER (Compact chips) */}
            <div className="bg-white rounded-2xl border border-[#E6DBCE] p-3 shadow-xs space-y-1.5">
              <label className="text-xs font-bold text-[#1C0D0A] block">
                5. Topper Garnish
              </label>
              <div className="flex flex-wrap gap-1.5">
                {TOPPER_OPTIONS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedTopperId(t.id)}
                    className={`py-1.5 px-2.5 rounded-lg border text-[11px] font-semibold transition-all flex items-center gap-1 ${
                      selectedTopperId === t.id
                        ? "bg-[#802B52] text-white border-[#802B52]"
                        : "bg-[#FAF5EE] text-[#5C524E] border-[#E6DBCE] hover:border-[#802B52]/40"
                    }`}
                  >
                    <span className="material-symbols-outlined text-xs">{t.icon}</span>
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ── 3. MANUAL EDITABLE ORDER FORM (POST DIRECTLY TO WHATSAPP) ── */}
        <div className="mt-8 sm:mt-12 bg-white rounded-3xl border border-[#E6C184]/70 p-5 sm:p-8 shadow-xl space-y-6">
          
          <div className="pb-3 border-b border-[#E6DBCE] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-display font-bold text-xl sm:text-2xl text-[#1C0D0A]">
                Custom Cake Order Form
              </h3>
              <p className="text-xs text-[#5C524E]">
                Auto-filled from your choices above. You can also edit any field manually!
              </p>
            </div>
            <span className="text-[11px] font-bold text-[#802B52] uppercase tracking-wider">
              Ready to Send to WhatsApp
            </span>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            
            {/* Flavour Field */}
            <div>
              <label className="text-[11px] font-bold text-[#5C524E] uppercase tracking-wider block mb-1">
                Flavour
              </label>
              <input
                type="text"
                value={formFlavour}
                onChange={(e) => setFormFlavour(e.target.value)}
                className="w-full bg-[#FAF5EE] border border-[#E6DBCE] rounded-xl px-3 py-2 text-xs font-semibold text-[#1C0D0A] focus:outline-none focus:border-[#802B52]"
              />
            </div>

            {/* Layers Field */}
            <div>
              <label className="text-[11px] font-bold text-[#5C524E] uppercase tracking-wider block mb-1">
                Layers
              </label>
              <input
                type="text"
                value={formLayers}
                onChange={(e) => setFormLayers(e.target.value)}
                className="w-full bg-[#FAF5EE] border border-[#E6DBCE] rounded-xl px-3 py-2 text-xs font-semibold text-[#1C0D0A] focus:outline-none focus:border-[#802B52]"
              />
            </div>

            {/* Weight Field */}
            <div>
              <label className="text-[11px] font-bold text-[#5C524E] uppercase tracking-wider block mb-1">
                Weight
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

            {/* Delivery Area in Trichy */}
            <div>
              <label className="text-[11px] font-bold text-[#5C524E] uppercase tracking-wider block mb-1">
                Delivery Area in Trichy
              </label>
              <input
                type="text"
                placeholder="e.g. Thillai Nagar, Cantonment..."
                value={formArea}
                onChange={(e) => setFormArea(e.target.value)}
                className="w-full bg-[#FAF5EE] border border-[#E6DBCE] rounded-xl px-3 py-2 text-xs font-semibold text-[#1C0D0A] focus:outline-none focus:border-[#802B52]"
              />
            </div>

            {/* Event Date */}
            <div>
              <label className="text-[11px] font-bold text-[#5C524E] uppercase tracking-wider block mb-1">
                Event Date (Optional)
              </label>
              <input
                type="date"
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
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
                placeholder="e.g. Please match color with invitation. I will share photo on WhatsApp."
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

      </section>

      {/* Embedded CSS for animations */}
      <style jsx>{`
        /* Smooth Showcase Card Entrance */
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(22px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Tier Mount Spring Bounce */
        .animate-tier-mount {
          animation: tierMount 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        @keyframes tierMount {
          0% {
            transform: translateY(-26px) scale(0.95);
            opacity: 0;
          }
          70% {
            transform: translateY(2px) scale(1.02);
            opacity: 1;
          }
          100% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }

        /* Balloon Swaying */
        .animate-balloon-left {
          animation: balloonSwayLeft 5s ease-in-out infinite;
          transform-origin: 55px 180px;
        }

        @keyframes balloonSwayLeft {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-8px) rotate(-3deg);
          }
        }

        .animate-balloon-right {
          animation: balloonSwayRight 5.5s ease-in-out infinite;
          transform-origin: 345px 180px;
        }

        @keyframes balloonSwayRight {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-9px) rotate(3deg);
          }
        }

        /* Floating Hearts Animation */
        .animate-float-heart-1 {
          animation: floatHeart 4s ease-in-out infinite;
        }
        .animate-float-heart-2 {
          animation: floatHeart 5s ease-in-out infinite 1.2s;
        }
        .animate-float-heart-3 {
          animation: floatHeart 4.5s ease-in-out infinite 2.2s;
        }

        @keyframes floatHeart {
          0%, 100% {
            transform: translateY(0) scale(1);
            opacity: 0.65;
          }
          50% {
            transform: translateY(-14px) scale(1.15);
            opacity: 0.95;
          }
        }

        /* Twinkling Star Sparks */
        .animate-twinkle-1 {
          animation: starTwinkle 2.5s ease-in-out infinite;
        }
        .animate-twinkle-2 {
          animation: starTwinkle 3s ease-in-out infinite 0.8s;
        }
        .animate-twinkle-3 {
          animation: starTwinkle 3.2s ease-in-out infinite 1.6s;
        }

        @keyframes starTwinkle {
          0%, 100% {
            transform: scale(0.85);
            opacity: 0.4;
          }
          50% {
            transform: scale(1.25);
            opacity: 1;
          }
        }

        /* Topper Gentle Bob */
        .animate-topper-bob {
          animation: topperBob 3.5s ease-in-out infinite;
        }

        @keyframes topperBob {
          0%, 100% {
            transform: translate(200px, ${layers === 1 ? 194 : layers === 2 ? 138 : 86}px) translateY(0);
          }
          50% {
            transform: translate(200px, ${layers === 1 ? 194 : layers === 2 ? 138 : 86}px) translateY(-3px);
          }
        }
      `}</style>

      {/* Full Photo Inspection Modal */}
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
              <div className="w-full md:w-3/5 bg-[#F0E5D8]">
                <img
                  src={inspectCake.image}
                  alt={inspectCake.name}
                  className="w-full h-full max-h-[70vh] object-cover"
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
