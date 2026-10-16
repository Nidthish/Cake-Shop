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
  servings: string;
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
    servings: "Serves 40 to 60 Guests",
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
    servings: "Serves 25 to 40 Guests",
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
    servings: "Serves 15 to 30 Guests",
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
    servings: "Serves 30 to 45 Guests",
    flavours: ["Belgian Milk Chocolate", "Nutty Praline Truffle", "Classic Vanilla"],
    highlights: ["Imperial Crown Topper", "Gold Baroque Scrolls", "Quilted Diamond Finish"],
  },
];

interface FlavourOption {
  id: string;
  name: string;
  gradient: string;
  dripColor: string;
  pearlColor: string;
  accentBg: string;
}

const FLAVOUR_OPTIONS: FlavourOption[] = [
  {
    id: "belgian-chocolate",
    name: "Belgian Chocolate",
    gradient: "from-[#442217] via-[#2E150D] to-[#1C0A05]",
    dripColor: "#170804",
    pearlColor: "#F5E6CC",
    accentBg: "bg-[#2E150D]",
  },
  {
    id: "red-velvet",
    name: "Red Velvet",
    gradient: "from-[#9E2336] via-[#7D1625] to-[#590C16]",
    dripColor: "#FFF9F2",
    pearlColor: "#FFFFFF",
    accentBg: "bg-[#7D1625]",
  },
  {
    id: "vanilla-gold",
    name: "Vanilla Gold",
    gradient: "from-[#FFFDF9] via-[#F4ECE0] to-[#E3D4B8]",
    dripColor: "#D4AF37",
    pearlColor: "#D4AF37",
    accentBg: "bg-[#E3D4B8]",
  },
  {
    id: "blueberry",
    name: "Blueberry",
    gradient: "from-[#8C649B] via-[#6D477C] to-[#4E2E5D]",
    dripColor: "#391C45",
    pearlColor: "#F3E8F7",
    accentBg: "bg-[#6D477C]",
  },
  {
    id: "butterscotch",
    name: "Butterscotch",
    gradient: "from-[#B87034] via-[#995420] to-[#753B0E]",
    dripColor: "#522607",
    pearlColor: "#FFF1DC",
    accentBg: "bg-[#995420]",
  },
  {
    id: "fresh-mango",
    name: "Fresh Mango",
    gradient: "from-[#EB8E2C] via-[#CE7316] to-[#A35308]",
    dripColor: "#7A3B02",
    pearlColor: "#FFF4E5",
    accentBg: "bg-[#CE7316]",
  },
];

const LAYER_OPTIONS = [
  { count: 1, label: "1 Layer", serves: "Serves 10 to 15" },
  { count: 2, label: "2 Layers", serves: "Serves 20 to 25" },
  { count: 3, label: "3 Layers", serves: "Serves 35 to 50" },
];

const WEIGHT_OPTIONS = [
  { weight: "1.5 kg", label: "1.5 kg (10-15)" },
  { weight: "2.0 kg", label: "2.0 kg (15-20)" },
  { weight: "3.0 kg", label: "3.0 kg (25-30)" },
  { weight: "4.0 kg+", label: "4.0 kg+ (35+)" },
];

const TOPPER_OPTIONS = [
  { id: "crown", label: "Tiara Crown", icon: "military_tech" },
  { id: "teddy", label: "Sugar Teddy", icon: "pets" },
  { id: "star", label: "Golden Star", icon: "star" },
  { id: "rosette", label: "Sugar Flowers", icon: "local_florist" },
  { id: "none", label: "Simple Top", icon: "horizontal_rule" },
];

export default function CustomCakeClient() {
  // Builder visual states
  const [layers, setLayers] = useState<1 | 2 | 3>(2);
  const [selectedFlavourId, setSelectedFlavourId] = useState<string>("belgian-chocolate");
  const [selectedWeight, setSelectedWeight] = useState<string>("2.0 kg");
  const [customName, setCustomName] = useState<string>("Happy Birthday");
  const [selectedTopperId, setSelectedTopperId] = useState<string>("crown");

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
            Design your own cake online or choose from our best creations in Trichy.
          </p>
        </div>
      </section>

      {/* ── 2. CREATE MY OWN CAKE (FIRST SECTION!) ───────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        <div className="text-center max-w-xl mx-auto mb-6 sm:mb-8 space-y-1">
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#1C0D0A]">
            Create Your Cake
          </h2>
          <p className="text-xs text-[#5C524E]">
            Tap the options below to build your cake. The order form fills automatically!
          </p>
        </div>

        {/* 2-Column Layout on Laptop, Compact Stack on Mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          {/* ── LEFT: PROPER TIERED CAKE VISUALIZER ─────────────────────── */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-[#E6C184]/60 p-4 sm:p-6 shadow-lg flex flex-col items-center justify-between relative overflow-hidden">
            
            {/* Top Info Bar */}
            <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-[#E6DBCE] text-[11px] text-[#7A6B72]">
              <span className="font-bold text-[#802B52] uppercase tracking-wider">
                Live Cake Preview
              </span>
              <span>{layers} Tier{layers > 1 ? "s" : ""} • {selectedWeight}</span>
            </div>

            {/* REALISTIC ANIMATED TIERED CAKE STAGE */}
            <div className="w-full h-56 sm:h-64 flex flex-col items-center justify-end relative pb-1 pt-4 select-none">
              
              {/* Topper Element */}
              <div className="mb-1 transition-all duration-300 flex flex-col items-center">
                {selectedTopperId === "crown" && (
                  <span className="material-symbols-outlined text-amber-500 text-3xl drop-shadow-sm animate-pulse">
                    military_tech
                  </span>
                )}
                {selectedTopperId === "teddy" && (
                  <span className="material-symbols-outlined text-amber-800 text-3xl drop-shadow-sm">
                    pets
                  </span>
                )}
                {selectedTopperId === "star" && (
                  <span className="material-symbols-outlined text-amber-400 text-3xl drop-shadow-sm">
                    star
                  </span>
                )}
                {selectedTopperId === "rosette" && (
                  <span className="material-symbols-outlined text-rose-500 text-3xl drop-shadow-sm">
                    local_florist
                  </span>
                )}
                {selectedTopperId === "none" && (
                  <div className="w-4 h-1.5 rounded-full bg-amber-400/80 mb-0.5" />
                )}
              </div>

              {/* TIER 3 (Top Tier - Only when layers === 3) */}
              {layers === 3 && (
                <div
                  className={`w-28 sm:w-32 h-11 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-b ${currentFlavour.gradient} shadow-md relative border border-white/40 transition-all duration-500 transform animate-fade-in flex flex-col items-center justify-between p-1`}
                >
                  <div
                    className="w-11/12 h-1.5 rounded-full opacity-85 shadow-xs"
                    style={{ backgroundColor: currentFlavour.dripColor }}
                  />
                  <div className="w-full flex justify-around px-2">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: currentFlavour.pearlColor }} />
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: currentFlavour.pearlColor }} />
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: currentFlavour.pearlColor }} />
                  </div>
                </div>
              )}

              {/* TIER 2 (Middle Tier - When layers >= 2) */}
              {layers >= 2 && (
                <div
                  className={`w-40 sm:w-48 h-13 sm:h-14 -mt-1 rounded-xl sm:rounded-2xl bg-gradient-to-b ${currentFlavour.gradient} shadow-lg relative border border-white/40 transition-all duration-500 flex flex-col items-center justify-between p-1.5`}
                >
                  <div className="w-full h-1 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 opacity-90 rounded-full" />
                  <div className="w-full flex justify-between items-center px-3">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: currentFlavour.pearlColor }} />
                    <span className="text-[9px] uppercase font-bold tracking-wider text-white/80">
                      Handcrafted
                    </span>
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: currentFlavour.pearlColor }} />
                  </div>
                </div>
              )}

              {/* TIER 1 (Base Tier - Always visible) */}
              <div
                className={`w-56 sm:w-64 h-16 sm:h-18 -mt-1 rounded-xl sm:rounded-2xl bg-gradient-to-b ${currentFlavour.gradient} shadow-xl relative border border-white/50 transition-all duration-500 flex flex-col items-center justify-between p-2`}
              >
                {/* Drip Edge */}
                <div
                  className="w-full h-2 rounded-full opacity-90"
                  style={{ backgroundColor: currentFlavour.dripColor }}
                />

                {/* Name Plaque */}
                <div className="bg-[#FAF5EE]/95 border border-[#D4AF37] px-3 py-0.5 rounded-full shadow-xs max-w-[85%] text-center">
                  <span className="font-display font-bold text-xs sm:text-sm text-[#1C0D0A] block truncate">
                    {customName.trim() || "Your Name Here"}
                  </span>
                </div>

                {/* Base Trim */}
                <div className="w-full flex justify-between items-center px-3">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: currentFlavour.pearlColor }} />
                  <span className="text-[9px] uppercase font-bold tracking-wider text-white/70">
                    {currentFlavour.name}
                  </span>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: currentFlavour.pearlColor }} />
                </div>
              </div>

              {/* Golden Cake Pedestal Stand */}
              <div className="w-64 sm:w-72 h-3 bg-gradient-to-r from-[#C5A030] via-[#F4E1A1] to-[#C5A030] rounded-full shadow-md border border-amber-300 mt-1" />
              <div className="w-24 h-2.5 bg-gradient-to-b from-[#B89228] to-[#7D6013] rounded-b-lg" />
            </div>

            {/* Bottom Flavour & Servings Tag */}
            <div className="w-full pt-2 border-t border-[#E6DBCE] flex items-center justify-between text-[11px] text-[#5C524E]">
              <span className="font-semibold">{currentFlavour.name}</span>
              <span className="font-bold text-[#802B52]">{selectedWeight}</span>
            </div>
          </div>

          {/* ── RIGHT: COMPACT CONTROLS (NO ENDLESS SCROLLING) ──────────── */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* 1. LAYERS (Compact 3 buttons) */}
            <div className="bg-white rounded-2xl border border-[#E6DBCE] p-3.5 shadow-xs space-y-2">
              <label className="text-xs font-bold text-[#1C0D0A] block">
                1. Select Layers
              </label>
              <div className="grid grid-cols-3 gap-2">
                {LAYER_OPTIONS.map((opt) => (
                  <button
                    key={opt.count}
                    type="button"
                    onClick={() => handleLayersChange(opt.count as 1 | 2 | 3)}
                    className={`py-2 px-2 rounded-xl text-center border transition-all ${
                      layers === opt.count
                        ? "bg-[#802B52] text-white border-[#802B52] font-bold shadow-xs"
                        : "bg-[#FAF5EE] text-[#1C0D0A] border-[#E6DBCE] hover:border-[#802B52]/40"
                    }`}
                  >
                    <span className="block text-xs font-bold">{opt.label}</span>
                    <span className={`block text-[10px] ${layers === opt.count ? "text-white/80" : "text-[#7A6B72]"}`}>
                      {opt.serves}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. FLAVOURS (Compact 3x2 pills) */}
            <div className="bg-white rounded-2xl border border-[#E6DBCE] p-3.5 shadow-xs space-y-2">
              <label className="text-xs font-bold text-[#1C0D0A] block">
                2. Choose Flavour
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
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
            <div className="bg-white rounded-2xl border border-[#E6DBCE] p-3.5 shadow-xs space-y-2">
              <label className="text-xs font-bold text-[#1C0D0A] block">
                3. Cake Weight
              </label>
              <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                {WEIGHT_OPTIONS.map((w) => (
                  <button
                    key={w.weight}
                    type="button"
                    onClick={() => handleWeightChange(w.weight)}
                    className={`py-2 px-1 rounded-xl text-center border transition-all ${
                      selectedWeight === w.weight
                        ? "bg-[#802B52] text-white border-[#802B52] font-bold shadow-xs"
                        : "bg-[#FAF5EE] text-[#1C0D0A] border-[#E6DBCE] hover:border-[#802B52]/40"
                    }`}
                  >
                    <span className="block text-xs font-bold">{w.weight}</span>
                    <span className={`block text-[9px] ${selectedWeight === w.weight ? "text-white/80" : "text-[#7A6B72]"}`}>
                      {w.weight === "1.5 kg" ? "10-15 p" : w.weight === "2.0 kg" ? "15-20 p" : w.weight === "3.0 kg" ? "25-30 p" : "35+ p"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. NAME TO WRITE (Compact input, reduced font size) */}
            <div className="bg-white rounded-2xl border border-[#E6DBCE] p-3.5 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#1C0D0A]">
                  4. Name to Write on Cake
                </label>
                <span className="text-[10px] text-[#7A6B72]">Shows live on cake</span>
              </div>
              <input
                type="text"
                placeholder="Enter name or message..."
                value={customName}
                maxLength={30}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full bg-[#FAF5EE] border border-[#E6DBCE] rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-[#1C0D0A] focus:outline-none focus:border-[#802B52]"
              />
              <div className="flex flex-wrap gap-1 pt-0.5">
                {["Happy Birthday", "Aarav", "Happy 1st Birthday", "Forever Together"].map((s) => (
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
            <div className="bg-white rounded-2xl border border-[#E6DBCE] p-3.5 shadow-xs space-y-2">
              <label className="text-xs font-bold text-[#1C0D0A] block">
                5. Topper Style
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

            {/* Special Request Notes (Full width on sm/md) */}
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

      {/* ── 4. SHOWCASE CAKES (2 ON MOBILE, 4 ON LAPTOP) ────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 border-t border-[#E6C184]/30">
        
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-12 space-y-1">
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#1C0D0A]">
            Our Best Cakes
          </h2>
          <p className="text-xs sm:text-sm text-[#5C524E]">
            Handcrafted custom cakes made for recent celebrations in Trichy.
          </p>
        </div>

        {/* Responsive Grid: Mobile shows 2 cakes, Laptop shows 4 cakes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SHOWCASE_CAKES.map((cake, idx) => {
            // Hide 3rd and 4th cakes on mobile, show on md and above
            const isHiddenOnMobile = idx >= 2;

            return (
              <div
                key={cake.id}
                className={`${
                  isHiddenOnMobile ? "hidden md:flex" : "flex"
                } flex-col bg-white rounded-3xl border border-[#E6DBCE] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group`}
              >
                {/* Cake Image */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F0E5D8]">
                  <img
                    src={cake.image}
                    alt={cake.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/95 text-[#802B52] border border-[#E6DBCE] shadow-2xs">
                      {cake.category}
                    </span>
                  </div>
                </div>

                {/* Cake Details */}
                <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 space-y-3">
                  <div className="space-y-1.5">
                    <h3 className="font-display font-bold text-lg text-[#1C0D0A] leading-snug">
                      {cake.name}
                    </h3>
                    <p className="text-xs font-semibold text-[#802B52]">
                      {cake.tagline}
                    </p>
                    <p className="text-xs text-[#5C524E] leading-relaxed line-clamp-2">
                      {cake.description}
                    </p>
                  </div>

                  <div className="space-y-3 pt-2 border-t border-[#E6DBCE]/60">
                    <div className="text-[11px] text-[#7A6B72] space-y-0.5">
                      <div className="font-semibold text-[#1C0D0A]">{cake.tiers}</div>
                      <div>{cake.servings}</div>
                    </div>

                    {/* Quick WhatsApp Inquiry for this exact cake */}
                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                        `Hello Lollipop! I would like to order the "${cake.name}" design for my celebration in Trichy. Please confirm price quote and available dates.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-[#FAF5EE] hover:bg-[#802B52] text-[#802B52] hover:text-white border border-[#E6DBCE] hover:border-[#802B52] py-2 px-3 rounded-xl font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all"
                    >
                      <span>Inquire This Cake</span>
                      <span className="material-symbols-outlined text-xs">arrow_forward</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </section>

    </div>
  );
}
