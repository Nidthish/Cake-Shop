"use client";

import React, { useState, useMemo, useCallback, useEffect } from 'react';

// --- 1. ARTISANAL FLAVOUR DEFINITIONS & COLOR PALETTES (NO PRICES) ---
export interface FlavourConfig {
  id: string;
  name: string;
  badge: string;
  tastingNote: string;
  calories: string;
  sponge: string;
  spongeLight: string;
  spongeDark: string;
  stripe: string;
  crumbDot: string;
  drip: string;
  dripHighlight: string;
  creamPrimary: string;
  creamSecondary: string;
  macaronColor: string;
  macaronFilling: string;
}

export const FLAVOURS: FlavourConfig[] = [
  {
    id: 'belgian-chocolate',
    name: 'Belgian Chocolate',
    badge: 'Bestseller',
    tastingNote: '70% Dark Callebaut chocolate sponge layered with silky truffle ganache & cocoa nibs.',
    calories: '390 kcal / 100g',
    sponge: '#8F5334',
    spongeLight: '#AA6946',
    spongeDark: '#69391F',
    stripe: '#4A220E',
    crumbDot: '#3B1A09',
    drip: '#381808',
    dripHighlight: '#633219',
    creamPrimary: '#7D4527',
    creamSecondary: '#FFF6EB',
    macaronColor: '#D49B7E',
    macaronFilling: '#4A220E',
  },
  {
    id: 'red-velvet',
    name: 'Red Velvet',
    badge: 'Romantic',
    tastingNote: 'Velvety crimson cocoa sponge paired with Madagascar vanilla bean cream cheese frosting.',
    calories: '375 kcal / 100g',
    sponge: '#A82231',
    spongeLight: '#C43545',
    spongeDark: '#7D1520',
    stripe: '#FFF7F0',
    crumbDot: '#690E18',
    drip: '#75111C',
    dripHighlight: '#A32936',
    creamPrimary: '#FFF8F2',
    creamSecondary: '#E03E4E',
    macaronColor: '#F26B7A',
    macaronFilling: '#FFF8F2',
  },
  {
    id: 'vanilla',
    name: 'Vanilla Bean',
    badge: 'Classic',
    tastingNote: 'Light-as-air sponge infused with real Tahiti vanilla pods & whipped white chocolate Chantilly.',
    calories: '340 kcal / 100g',
    sponge: '#F3D292',
    spongeLight: '#FCE2AE',
    spongeDark: '#D9B26C',
    stripe: '#FFFDF9',
    crumbDot: '#B88E44',
    drip: '#E0AF5A',
    dripHighlight: '#F7CE83',
    creamPrimary: '#FFFDF7',
    creamSecondary: '#F2CB80',
    macaronColor: '#FAE5B8',
    macaronFilling: '#E0AF5A',
  },
  {
    id: 'blueberry',
    name: 'Blueberry Compote',
    badge: 'Fruity',
    tastingNote: 'Wild blueberry infused sponge with tangy berry compote & lavender-kissed mascarpone.',
    calories: '355 kcal / 100g',
    sponge: '#8A60A6',
    spongeLight: '#A47BC0',
    spongeDark: '#694382',
    stripe: '#4E2B66',
    crumbDot: '#371A4B',
    drip: '#422059',
    dripHighlight: '#6C408A',
    creamPrimary: '#946EB0',
    creamSecondary: '#F5EEFA',
    macaronColor: '#B392CE',
    macaronFilling: '#422059',
  },
  {
    id: 'butterscotch',
    name: 'Butterscotch',
    badge: 'Crunchy',
    tastingNote: 'Brown-butter sponge layered with golden caramel sauce & roasted cashew praline nougat.',
    calories: '410 kcal / 100g',
    sponge: '#DF9B52',
    spongeLight: '#F0B26E',
    spongeDark: '#BF7A32',
    stripe: '#995516',
    crumbDot: '#733D0B',
    drip: '#82430A',
    dripHighlight: '#B3651E',
    creamPrimary: '#D6893B',
    creamSecondary: '#FFF7EB',
    macaronColor: '#F5C487',
    macaronFilling: '#82430A',
  },
  {
    id: 'fresh-mango',
    name: 'Fresh Mango',
    badge: 'Seasonal',
    tastingNote: 'Sun-ripened Alphonso mango pulp folded into cloud-soft sponge & tropical passionfruit glaze.',
    calories: '330 kcal / 100g',
    sponge: '#F7B52B',
    spongeLight: '#FFCC52',
    spongeDark: '#DB950F',
    stripe: '#E68000',
    crumbDot: '#B56200',
    drip: '#D46E00',
    dripHighlight: '#FA9623',
    creamPrimary: '#FFA621',
    creamSecondary: '#FFF9E6',
    macaronColor: '#FFD166',
    macaronFilling: '#D46E00',
  },
  {
    id: 'black-forest',
    name: 'Black Forest',
    badge: 'Heritage',
    tastingNote: 'Rich German dark chocolate sponge soaked in cherry reduction with Morello cherries & cream.',
    calories: '380 kcal / 100g',
    sponge: '#47291E',
    spongeLight: '#5E382A',
    spongeDark: '#301A12',
    stripe: '#FFFDF9',
    crumbDot: '#9E1929',
    drip: '#24120C',
    dripHighlight: '#47291E',
    creamPrimary: '#FFFDF9',
    creamSecondary: '#8F1B2C',
    macaronColor: '#C23B4E',
    macaronFilling: '#FFFDF9',
  },
  {
    id: 'lotus-biscoff',
    name: 'Lotus Biscoff',
    badge: 'Trending',
    tastingNote: 'Caramelized speculoos biscuit sponge with creamy Biscoff spread & crushed cookie butter.',
    calories: '435 kcal / 100g',
    sponge: '#C77A46',
    spongeLight: '#DE925E',
    spongeDark: '#A35D2E',
    stripe: '#7A3E17',
    crumbDot: '#592B0D',
    drip: '#66300D',
    dripHighlight: '#944F22',
    creamPrimary: '#B56735',
    creamSecondary: '#FFF4E8',
    macaronColor: '#E09B6B',
    macaronFilling: '#66300D',
  },
  {
    id: 'strawberry',
    name: 'Strawberry',
    badge: 'Kid Favorite',
    tastingNote: 'Mahabaleshwar strawberry sponge layered with ruby berry preserve & whipped pink Chantilly.',
    calories: '345 kcal / 100g',
    sponge: '#F296AC',
    spongeLight: '#FFB0C3',
    spongeDark: '#D6748B',
    stripe: '#D64568',
    crumbDot: '#A82545',
    drip: '#BF2E52',
    dripHighlight: '#E66282',
    creamPrimary: '#F788A3',
    creamSecondary: '#FFF5F7',
    macaronColor: '#FFB8C9',
    macaronFilling: '#BF2E52',
  },
  {
    id: 'pistachio',
    name: 'Pistachio',
    badge: 'Artisanal',
    tastingNote: 'Roasted Iranian pistachio sponge with rosewater cardamom cream & crushed green nuts.',
    calories: '395 kcal / 100g',
    sponge: '#AFC77D',
    spongeLight: '#C5DB93',
    spongeDark: '#91AB5E',
    stripe: '#708C3E',
    crumbDot: '#4E6327',
    drip: '#58702C',
    dripHighlight: '#819E48',
    creamPrimary: '#9AB562',
    creamSecondary: '#F9FCEF',
    macaronColor: '#C8E09B',
    macaronFilling: '#58702C',
  },
];

// --- 2. LAYER, WEIGHT, DRIP, STAND, AND DECORATION CONFIGS (NO PRICES, NO HEIGHT/SLICES) ---
export const LAYER_OPTIONS = [
  { layers: 1, label: '1 Layer' },
  { layers: 2, label: '2 Layers' },
  { layers: 3, label: '3 Layers' },
];

export const WEIGHT_OPTIONS = [
  { label: '1.0 kg', kg: 1.0, minLayers: 1 },
  { label: '1.5 kg', kg: 1.5, minLayers: 1 },
  { label: '2.0 kg', kg: 2.0, minLayers: 1 },
  { label: '3.0 kg', kg: 3.0, minLayers: 2 },
  { label: '4.0 kg+', kg: 4.0, minLayers: 2 },
];

export const DRIP_STYLES = [
  { id: 'signature', name: 'Signature Glaze', desc: 'Matches flavour' },
  { id: 'dark-ganache', name: 'Dark Ganache', color: '#2B1105', highlight: '#522510' },
  { id: 'white-choc', name: 'White Chocolate', color: '#FFF8EB', highlight: '#FFFFFF' },
  { id: 'salted-caramel', name: 'Golden Caramel', color: '#C87619', highlight: '#EDA145' },
  { id: 'none', name: 'Naked (No Drip)', desc: 'Clean artisan edge' },
];

export const CAKE_STANDS = [
  { id: 'gold', name: 'Royal Gold' },
  { id: 'marble', name: 'White Marble' },
  { id: 'rosegold', name: 'Rose Blush' },
  { id: 'wood', name: 'Walnut Wood' },
];

export const FONT_STYLES = [
  { id: 'handwriting', name: 'Script', className: 'font-handwriting', sizeBoost: 0 },
  { id: 'serif', name: 'Classic', className: 'font-serif-title italic', sizeBoost: -4 },
  { id: 'modern', name: 'Playful', className: 'font-bold tracking-tight', sizeBoost: -6 },
];

export const QUICK_MESSAGES = [
  'Happy Birthday',
  'Anniversary',
  'Congratulations',
  'Special Day',
  'Bride to Be',
  'Best Wishes',
];

export const DECORATIONS = [
  { id: 'fruits', name: 'Fruits' },
  { id: 'chocolate', name: 'Chocolate' },
  { id: 'cream', name: 'Cream Swirl' },
  { id: 'candles', name: 'Candles' },
  { id: 'sprinkles', name: 'Sprinkles' },
  { id: 'topper', name: 'Topper' },
  { id: 'plaque', name: 'Name Plaque' },
  { id: 'macarons', name: 'Macarons' },
  { id: 'goldleaf', name: '24K Gold' },
];

export const MOBILE_TABS = [
  { id: 'all', label: 'All Steps' },
  { id: 'size', label: '1. Layers' },
  { id: 'flavour', label: '2. Flavour' },
  { id: 'weight', label: '3. Weight' },
  { id: 'message', label: '4. Name' },
  { id: 'decor', label: '5. Toppings' },
];

// --- 3. MEMOIZED MINI SVG ICONS FOR CONFIGURATION BUTTONS ---

export const MiniLayerIcon = React.memo(({ layers }: { layers: number }) => (
  <svg viewBox="0 0 64 52" className="w-14 h-11 mx-auto overflow-visible">
    <defs>
      <linearGradient id={`plateGrad-${layers}`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#D6A66C" />
        <stop offset="50%" stopColor="#F5D7A1" />
        <stop offset="100%" stopColor="#C48F52" />
      </linearGradient>
    </defs>
    <ellipse cx="32" cy="46" rx="24" ry="3.5" fill="rgba(0,0,0,0.14)" />
    <ellipse cx="32" cy="44" rx="23" ry="4" fill={`url(#plateGrad-${layers})`} />

    {layers === 1 && (
      <g>
        <path d="M15,30 L15,42 C15,44.5 49,44.5 49,42 L49,30 Z" fill="#6E3B1F" />
        <path d="M15,35 C15,37.5 49,37.5 49,35 L49,38 C49,40.5 15,40.5 15,38 Z" fill="#4A2410" />
        <ellipse cx="32" cy="30" rx="17" ry="4" fill="#FFF3E6" />
        <ellipse cx="32" cy="29.5" rx="15" ry="3" fill="#8C4A27" />
      </g>
    )}

    {layers === 2 && (
      <g>
        <path d="M13,30 L13,42 C13,45 51,45 51,42 L51,30 Z" fill="#F7E4C8" />
        <path d="M13,35 C13,38 51,38 51,35 L51,38 C51,41 13,41 13,38 Z" fill="#E5C59B" />
        <ellipse cx="32" cy="30" rx="19" ry="4.5" fill="#FFF9F0" />
        <path d="M19,19 L19,29.5 C19,31.5 45,31.5 45,29.5 L45,19 Z" fill="#F7E4C8" />
        <path d="M19,24 C19,26 45,26 45,24 L45,26.5 C45,28.5 19,28.5 19,26.5 Z" fill="#E5C59B" />
        <ellipse cx="32" cy="19" rx="13" ry="3" fill="#FFF9F0" />
        <circle cx="24" cy="18.5" r="1.5" fill="#E69A8D" />
        <circle cx="28" cy="19.5" r="1.5" fill="#E69A8D" />
        <circle cx="32" cy="19.8" r="1.5" fill="#E69A8D" />
        <circle cx="36" cy="19.5" r="1.5" fill="#E69A8D" />
        <circle cx="40" cy="18.5" r="1.5" fill="#E69A8D" />
      </g>
    )}

    {layers === 3 && (
      <g>
        <path d="M12,33 L12,42.5 C12,45.5 52,45.5 52,42.5 L52,33 Z" fill="#D98836" />
        <path d="M12,37 C12,40 52,40 52,37 L52,39 C52,42 12,42 12,39 Z" fill="#B5681B" />
        <ellipse cx="32" cy="33" rx="20" ry="4" fill="#F2AE57" />
        <path d="M17,23 L17,32.5 C17,34.5 47,34.5 47,32.5 L47,23 Z" fill="#D98836" />
        <path d="M17,27.5 C17,29.5 47,29.5 47,27.5 L47,29 C47,31 17,31 17,29 Z" fill="#B5681B" />
        <ellipse cx="32" cy="23" rx="15" ry="3" fill="#F2AE57" />
        <path d="M22,14 L22,22.5 C22,24 42,24 42,22.5 L42,14 Z" fill="#D98836" />
        <ellipse cx="32" cy="14" rx="10" ry="2.2" fill="#F2AE57" />
        <path
          d="M22,14 Q25,18 27,14 Q30,19 32,14 Q35,18 37,14 Q40,18 42,14"
          fill="none"
          stroke="#8C4908"
          strokeWidth="1.5"
        />
      </g>
    )}
  </svg>
));
MiniLayerIcon.displayName = 'MiniLayerIcon';

export const MiniFlavourIcon = React.memo(({ flavour }: { flavour: FlavourConfig }) => (
  <svg viewBox="0 0 48 44" className="w-11 h-10 shrink-0 overflow-visible">
    <ellipse cx="24" cy="39" rx="18" ry="3.5" fill="rgba(0,0,0,0.08)" />
    <path d="M8,18 L8,35 C8,39.5 40,39.5 40,35 L40,18 Z" fill={flavour.sponge} />
    <path d="M8,25 C8,29.5 40,29.5 40,25 L40,29 C40,33.5 8,33.5 8,29 Z" fill={flavour.stripe} />
    <ellipse cx="24" cy="18" rx="16" ry="5" fill={flavour.drip} />
    <ellipse cx="24" cy="17.5" rx="14.5" ry="4" fill={flavour.spongeLight} />
    <path
      d="M8,18 C8,21 10,25 11.5,25 C13,25 13,20 15,20 C17,20 17,26 19,26 C21,26 21,21 24,21 C27,21 27,26 29,26 C31,26 31,20 33,20 C35,20 35,25 36.5,25 C38,25 40,21 40,18 Z"
      fill={flavour.drip}
    />
    {flavour.id === 'belgian-chocolate' && (
      <g>
        <circle cx="16" cy="16" r="2.2" fill="#42200E" />
        <circle cx="24" cy="15" r="2.2" fill="#42200E" />
        <circle cx="32" cy="16" r="2.2" fill="#42200E" />
      </g>
    )}
    {flavour.id === 'red-velvet' && (
      <g>
        <circle cx="15" cy="16" r="2.5" fill="#FFF8F0" />
        <circle cx="24" cy="14.5" r="2.5" fill="#FFF8F0" />
        <circle cx="33" cy="16" r="2.5" fill="#FFF8F0" />
        <circle cx="24" cy="17.5" r="1.2" fill="#A82431" />
      </g>
    )}
    {flavour.id === 'blueberry' && (
      <g>
        <circle cx="19" cy="15" r="2.5" fill="#311B47" />
        <circle cx="24" cy="13.5" r="3" fill="#231136" />
        <circle cx="29" cy="15" r="2.5" fill="#311B47" />
        <path d="M21,12 Q24,9 27,12" stroke="#4F8A4B" strokeWidth="1.5" fill="none" />
      </g>
    )}
    {flavour.id === 'fresh-mango' && (
      <g>
        <circle cx="18" cy="15" r="2.8" fill="#FF9900" />
        <circle cx="24" cy="14" r="3.2" fill="#FFAE00" />
        <circle cx="30" cy="15" r="2.8" fill="#FF9900" />
      </g>
    )}
    {flavour.id === 'black-forest' && (
      <g>
        <circle cx="15" cy="15.5" r="2.5" fill="#FFF" />
        <circle cx="15" cy="14.5" r="1.8" fill="#C91E32" />
        <circle cx="24" cy="14.5" r="2.5" fill="#FFF" />
        <circle cx="24" cy="13.5" r="1.8" fill="#C91E32" />
        <circle cx="33" cy="15.5" r="2.5" fill="#FFF" />
        <circle cx="33" cy="14.5" r="1.8" fill="#C91E32" />
      </g>
    )}
    {flavour.id === 'lotus-biscoff' && (
      <g>
        <rect x="17" y="10" width="7" height="5" rx="1" transform="rotate(-20 17 10)" fill="#A65523" />
        <rect x="25" y="11" width="7" height="5" rx="1" transform="rotate(15 25 11)" fill="#8C4215" />
      </g>
    )}
    {flavour.id === 'strawberry' && (
      <g>
        <path d="M21,16 C21,11 27,11 27,16 C27,18 24,20 24,20 C24,20 21,18 21,16 Z" fill="#E62243" />
        <path d="M22,12 L24,14 L26,12" stroke="#4D8C3A" strokeWidth="1.5" fill="none" />
        <circle cx="16" cy="16" r="2" fill="#FFF0F3" />
        <circle cx="32" cy="16" r="2" fill="#FFF0F3" />
      </g>
    )}
    {flavour.id === 'pistachio' && (
      <g>
        <ellipse cx="19" cy="15" rx="2.5" ry="1.5" transform="rotate(-25 19 15)" fill="#6D873B" />
        <ellipse cx="25" cy="14.5" rx="2.5" ry="1.5" transform="rotate(15 25 14.5)" fill="#7E9948" />
        <ellipse cx="30" cy="15.5" rx="2.5" ry="1.5" transform="rotate(-10 30 15.5)" fill="#6D873B" />
      </g>
    )}
  </svg>
));
MiniFlavourIcon.displayName = 'MiniFlavourIcon';

export const MiniDecorationIcon = React.memo(({ id }: { id: string }) => {
  switch (id) {
    case 'fruits':
      return (
        <svg viewBox="0 0 48 48" className="w-10 h-10 mx-auto">
          <path d="M16,22 C13,14 23,11 26,14 C29,11 38,16 33,26 C29,34 21,38 18,36 C15,34 17,27 16,22 Z" fill="#E3242B" />
          <path d="M18,22 C16,16 23,14 25,16 C27,14 33,18 30,25 C27,31 21,34 19,33 Z" fill="#F54248" />
          <circle cx="21" cy="21" r="0.8" fill="#FFD166" />
          <circle cx="25" cy="20" r="0.8" fill="#FFD166" />
          <circle cx="28" cy="23" r="0.8" fill="#FFD166" />
          <circle cx="23" cy="26" r="0.8" fill="#FFD166" />
          <circle cx="20" cy="28" r="0.8" fill="#FFD166" />
          <circle cx="26" cy="29" r="0.8" fill="#FFD166" />
          <path d="M26,14 C22,9 17,12 19,15 C15,15 15,19 21,17 C24,16 25,18 26,15 C28,19 33,19 31,16 C35,16 35,12 29,13 C28,9 25,10 26,14 Z" fill="#4C9A2A" />
        </svg>
      );
    case 'chocolate':
      return (
        <svg viewBox="0 0 48 48" className="w-10 h-10 mx-auto">
          <g transform="rotate(28 24 24)">
            <rect x="13" y="10" width="22" height="28" rx="2.5" fill="#4A2511" />
            <rect x="15" y="12" width="8.5" height="7.5" rx="1" fill="#69361A" />
            <rect x="24.5" y="12" width="8.5" height="7.5" rx="1" fill="#69361A" />
            <rect x="15" y="20.5" width="8.5" height="7.5" rx="1" fill="#69361A" />
            <rect x="24.5" y="20.5" width="8.5" height="7.5" rx="1" fill="#69361A" />
            <rect x="15" y="29" width="8.5" height="7.5" rx="1" fill="#69361A" />
            <rect x="24.5" y="29" width="8.5" height="7.5" rx="1" fill="#69361A" />
          </g>
        </svg>
      );
    case 'cream':
      return (
        <svg viewBox="0 0 48 48" className="w-10 h-10 mx-auto">
          <path d="M11,33 C11,28 37,28 37,33 C37,37 11,37 11,33 Z" fill="#6E3B1F" />
          <path d="M13,29 C13,24 35,24 35,29 C35,33 13,33 13,29 Z" fill="#8C5233" />
          <path d="M15,26 C15,21 33,21 33,26 C33,29 15,29 15,26 Z" fill="#F5E6D3" />
          <path d="M18,22 C18,17 29,17 30,22 C30,25 18,25 18,22 Z" fill="#FFFDF9" />
          <path d="M22,18 C22,14 25,12 24,10 C27,13 28,16 27,19 Z" fill="#FFFDF9" />
        </svg>
      );
    case 'candles':
      return (
        <svg viewBox="0 0 48 48" className="w-10 h-10 mx-auto">
          <rect x="16" y="18" width="5" height="20" rx="1" fill="#FFF5EB" stroke="#E0C8B8" strokeWidth="0.5" />
          <path d="M16,22 L21,19 M16,27 L21,24 M16,32 L21,29 M16,37 L21,34" stroke="#E03C42" strokeWidth="1.8" />
          <path d="M18.5,10 C16.5,14 17,17 18.5,17 C20,17 20.5,14 18.5,10 Z" fill="#FF9F1C" />
          <rect x="27" y="18" width="5" height="20" rx="1" fill="#FFF5EB" stroke="#E0C8B8" strokeWidth="0.5" />
          <path d="M27,22 L32,19 M27,27 L32,24 M27,32 L32,29 M27,37 L32,34" stroke="#E03C42" strokeWidth="1.8" />
          <path d="M29.5,10 C27.5,14 28,17 29.5,17 C31,17 31.5,14 29.5,10 Z" fill="#FF9F1C" />
        </svg>
      );
    case 'sprinkles':
      return (
        <svg viewBox="0 0 48 48" className="w-10 h-10 mx-auto">
          <circle cx="24" cy="24" r="2.2" fill="#E63946" />
          <circle cx="17" cy="19" r="2" fill="#F4A261" />
          <circle cx="28" cy="16" r="2" fill="#2A9D8F" />
          <circle cx="32" cy="22" r="2.2" fill="#E76F51" />
          <circle cx="15" cy="27" r="2.2" fill="#8338EC" />
          <circle cx="21" cy="31" r="2" fill="#2A9D8F" />
          <circle cx="29" cy="30" r="2.2" fill="#FFB703" />
          <circle cx="22" cy="14" r="1.6" fill="#FF006E" />
          <circle cx="34" cy="27" r="1.6" fill="#3A86FF" />
        </svg>
      );
    case 'topper':
      return (
        <svg viewBox="0 0 48 48" className="w-10 h-10 mx-auto">
          <line x1="24" y1="32" x2="24" y2="41" stroke="#D4A359" strokeWidth="2" strokeLinecap="round" />
          <path
            d="M24,35 C24,35 11,26 11,17.5 C11,12.5 15,9.5 19,9.5 C21.8,9.5 24,11.5 24,13.5 C24,11.5 26.2,9.5 29,9.5 C33,9.5 37,12.5 37,17.5 C37,26 24,35 24,35 Z"
            fill="#EB4C68"
          />
        </svg>
      );
    case 'plaque':
      return (
        <svg viewBox="0 0 48 48" className="w-10 h-10 mx-auto">
          <path
            d="M11,18 C9,18 8,21 8,24 C8,27 9,30 11,30 L37,30 C39,30 40,27 40,24 C40,21 39,18 37,18 Z"
            fill="#FFF8EB"
            stroke="#D19E66"
            strokeWidth="1.5"
          />
          <path
            d="M12,20 L36,20 C37.2,20 38,21.8 38,24 C38,26.2 37.2,28 36,28 L12,28 C10.8,28 10,26.2 10,24 C10,21.8 10.8,20 12,20 Z"
            fill="none"
            stroke="#E8C9A3"
            strokeWidth="0.8"
          />
        </svg>
      );
    case 'macarons':
      return (
        <svg viewBox="0 0 48 48" className="w-10 h-10 mx-auto">
          <g transform="rotate(-12 24 24)">
            <path d="M12,22 C12,14 36,14 36,22 Z" fill="#F29BB0" />
            <rect x="11" y="21.5" width="26" height="4.5" rx="2" fill="#FFF8F0" />
            <path d="M12,25.5 C12,32 36,32 36,25.5 Z" fill="#E07A93" />
          </g>
        </svg>
      );
    case 'goldleaf':
      return (
        <svg viewBox="0 0 48 48" className="w-10 h-10 mx-auto">
          <polygon points="24,10 29,21 38,18 31,29 35,38 23,34 14,39 17,27 11,19 20,20" fill="#F2C14E" stroke="#C9931E" strokeWidth="1" />
          <polygon points="24,14 27,22 33,21 28,28 21,30 18,23" fill="#FFE699" />
        </svg>
      );
    default:
      return null;
  }
});
MiniDecorationIcon.displayName = 'MiniDecorationIcon';

// --- 4. REUSABLE CAKE DECORATION SUB-ELEMENTS FOR LIVE PREVIEW ---

export const PipedSwirl = React.memo(({ x, y, scale = 1, color = '#FFF8F0', isDark = false }: {
  x: number;
  y: number;
  scale?: number;
  color?: string;
  isDark?: boolean;
}) => {
  const baseFill = isDark ? color : '#FFF5E8';
  const midFill = isDark ? color : '#FFFBF5';
  const shadowColor = isDark ? 'rgba(0,0,0,0.28)' : '#E5CFC0';

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <ellipse cx="0" cy="4" rx="18" ry="6" fill="rgba(0,0,0,0.18)" />
      <path
        d="M-16,2 C-18,-5 -8,-9 0,-9 C8,-9 18,-5 16,2 C14,7 -14,7 -16,2 Z"
        fill={baseFill}
        stroke={shadowColor}
        strokeWidth="1"
      />
      <path
        d="M-13,-2 C-14,-9 -4,-13 2,-13 C9,-13 14,-8 12,-2 C10,3 -10,3 -13,-2 Z"
        fill={midFill}
        stroke={shadowColor}
        strokeWidth="1"
      />
      <path
        d="M-9,-7 C-9,-14 -2,-18 1,-22 C5,-17 9,-12 8,-7 C6,-3 -6,-3 -9,-7 Z"
        fill={midFill}
        stroke={shadowColor}
        strokeWidth="1"
      />
      <path
        d="M-6,3 Q-2,-4 1,-21 M4,3 Q6,-5 1,-21 M-11,1 Q-7,-5 -3,-12"
        stroke={shadowColor}
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
      />
    </g>
  );
});
PipedSwirl.displayName = 'PipedSwirl';

export const WholeStrawberry = React.memo(({ x, y, scale = 1, rotate = 0 }: {
  x: number;
  y: number;
  scale?: number;
  rotate?: number;
}) => (
  <g transform={`translate(${x}, ${y}) scale(${scale}) rotate(${rotate})`}>
    <ellipse cx="0" cy="6" rx="22" ry="8" fill="rgba(0,0,0,0.2)" />
    <path
      d="M-22,-14 C-26,-32 -6,-42 2,-38 C12,-42 28,-28 22,-8 C17,8 2,12 -8,8 C-17,4 -19,-4 -22,-14 Z"
      fill="url(#strawberryBodyGrad)"
    />
    <path d="M-14,-24 C-12,-32 -2,-35 4,-32 C0,-28 -8,-20 -14,-24 Z" fill="rgba(255,255,255,0.28)" />
    {[
      [-12, -18], [-4, -24], [6, -22], [14, -15],
      [-14, -8], [-5, -12], [4, -10], [12, -5],
      [-8, 0], [1, -1], [8, 2], [-2, 5],
    ].map(([sx, sy], idx) => (
      <ellipse
        key={idx}
        cx={sx}
        cy={sy}
        rx="1.2"
        ry="1.8"
        transform={`rotate(15 ${sx} ${sy})`}
        fill="#FAD673"
      />
    ))}
    <path
      d="M2,-36 C-6,-48 -18,-42 -11,-35 C-22,-36 -22,-27 -9,-31 C-4,-32 0,-26 3,-33 C8,-24 18,-25 13,-32 C25,-30 25,-39 11,-37 C19,-44 8,-49 4,-38 C3,-46 -3,-46 2,-36 Z"
      fill="#4D9128"
      stroke="#346917"
      strokeWidth="1"
      strokeLinejoin="round"
    />
    <path d="M3,-38 Q7,-46 12,-47" stroke="#3B731B" strokeWidth="2.8" fill="none" strokeLinecap="round" />
  </g>
));
WholeStrawberry.displayName = 'WholeStrawberry';

export const SlicedStrawberry = React.memo(({ x, y, scale = 1, rotate = 0 }: {
  x: number;
  y: number;
  scale?: number;
  rotate?: number;
}) => (
  <g transform={`translate(${x}, ${y}) scale(${scale}) rotate(${rotate})`}>
    <ellipse cx="2" cy="6" rx="22" ry="7" fill="rgba(0,0,0,0.22)" />
    <path d="M-20,2 C-24,-10 -8,-30 8,-30 C22,-30 26,-8 18,4 C11,12 -14,12 -20,2 Z" fill="#D9232E" />
    <path d="M-16,0 C-19,-9 -6,-25 7,-25 C18,-25 21,-7 14,2 C8,9 -11,9 -16,0 Z" fill="#FF757F" />
    <path d="M-8,-2 C-10,-8 -2,-18 6,-18 C12,-18 13,-7 9,-1 C5,4 -5,4 -8,-2 Z" fill="#FFF0F2" />
    <path
      d="M3,-15 L2,1 M3,-12 L-5,-6 M3,-12 L10,-6 M2,-6 L-6,-1 M2,-6 L9,0"
      stroke="#FFA3AA"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <path
      d="M6,-29 C2,-36 -5,-32 -1,-27 C7,-30 14,-37 11,-28 C18,-33 22,-26 13,-24 Z"
      fill="#52992D"
    />
  </g>
));
SlicedStrawberry.displayName = 'SlicedStrawberry';

export const ChocolateSquare = React.memo(({ x, y, scale = 1, rotate = 0 }: {
  x: number;
  y: number;
  scale?: number;
  rotate?: number;
}) => (
  <g transform={`translate(${x}, ${y}) scale(${scale}) rotate(${rotate})`}>
    <rect x="-22" y="-26" width="44" height="52" rx="4" fill="#2E1508" stroke="#1F0D04" strokeWidth="1.5" />
    {[
      [-18, -22], [2, -22],
      [-18, -2], [2, -2],
    ].map(([bx, by], i) => (
      <g key={i}>
        <rect x={bx} y={by} width="16" height="16" rx="2" fill="#4D2612" />
        <polygon points={`${bx},${by} ${bx + 16},${by} ${bx + 13},${by + 3} ${bx + 3},${by + 3}`} fill="#6E391D" />
        <polygon points={`${bx},${by} ${bx + 3},${by + 3} ${bx + 3},${by + 13} ${bx},${by + 16}`} fill="#5C2E16" />
        <rect x={bx + 3} y={by + 3} width="10" height="10" rx="1" fill="#3D1D0D" />
      </g>
    ))}
  </g>
));
ChocolateSquare.displayName = 'ChocolateSquare';

export const TruffleBall = React.memo(({ x, y, r = 9, color = '#4A2511' }: {
  x: number;
  y: number;
  r?: number;
  color?: string;
}) => (
  <g transform={`translate(${x}, ${y})`}>
    <ellipse cx="0" cy={r * 0.75} rx={r * 1.1} ry={r * 0.45} fill="rgba(0,0,0,0.25)" />
    <circle cx="0" cy="0" r={r} fill={color} />
    <circle cx={-r * 0.3} cy={-r * 0.3} r={r * 0.35} fill="rgba(255,255,255,0.22)" />
    <circle cx={-r * 0.35} cy={-r * 0.35} r={r * 0.15} fill="rgba(255,255,255,0.45)" />
  </g>
));
TruffleBall.displayName = 'TruffleBall';

export const SugarPearl = React.memo(({ x, y, r = 3.5, color = '#FFF5E4' }: {
  x: number;
  y: number;
  r?: number;
  color?: string;
}) => (
  <g transform={`translate(${x}, ${y})`}>
    <circle cx="0" cy="1" r={r} fill="rgba(0,0,0,0.2)" />
    <circle cx="0" cy="0" r={r} fill={color} />
    <circle cx={-r * 0.3} cy={-r * 0.3} r={r * 0.35} fill="#FFFFFF" />
  </g>
));
SugarPearl.displayName = 'SugarPearl';

export const FrenchMacaron = React.memo(({ x, y, scale = 1, rotate = 0, shellColor = '#F29BB0', fillingColor = '#FFF8F0' }: {
  x: number;
  y: number;
  scale?: number;
  rotate?: number;
  shellColor?: string;
  fillingColor?: string;
}) => (
  <g transform={`translate(${x}, ${y}) scale(${scale}) rotate(${rotate})`}>
    <ellipse cx="0" cy="10" rx="18" ry="5" fill="rgba(0,0,0,0.22)" />
    {/* Bottom shell */}
    <path d="M-16,3 C-16,11 16,11 16,3 Z" fill={shellColor} />
    {/* Filling cream */}
    <rect x="-17" y="-2" width="34" height="6" rx="3" fill={fillingColor} />
    {/* Ruffled feet */}
    <circle cx="-13" cy="-2" r="2" fill={shellColor} />
    <circle cx="-7" cy="-2" r="2" fill={shellColor} />
    <circle cx="0" cy="-2" r="2" fill={shellColor} />
    <circle cx="7" cy="-2" r="2" fill={shellColor} />
    <circle cx="13" cy="-2" r="2" fill={shellColor} />
    {/* Top dome shell */}
    <path d="M-16,-2 C-16,-14 16,-14 16,-2 Z" fill={shellColor} />
    {/* Glossy highlight */}
    <ellipse cx="-5" cy="-8" rx="6" ry="2.2" transform="rotate(-12 -5 -8)" fill="rgba(255,255,255,0.38)" />
  </g>
));
FrenchMacaron.displayName = 'FrenchMacaron';

export const GoldFlake = React.memo(({ x, y, scale = 1, rotate = 0 }: {
  x: number;
  y: number;
  scale?: number;
  rotate?: number;
}) => (
  <g transform={`translate(${x}, ${y}) scale(${scale}) rotate(${rotate})`}>
    <polygon
      points="0,-8 6,-3 9,4 2,8 -7,5 -5,-3"
      fill="url(#goldRimGrad)"
      stroke="#B87B31"
      strokeWidth="0.6"
    />
    <polygon points="0,-5 4,-1 2,4 -3,2" fill="#FFF3B0" opacity="0.8" />
  </g>
));
GoldFlake.displayName = 'GoldFlake';

export const BirthdayCandle = React.memo(({ x, y, isLit, onToggle }: {
  x: number;
  y: number;
  isLit: boolean;
  onToggle: () => void;
}) => (
  <g
    transform={`translate(${x}, ${y})`}
    onClick={onToggle}
    className="cursor-pointer group"
    role="button"
    aria-label="Toggle candle flame"
  >
    <ellipse cx="0" cy="2" rx="9" ry="3.5" fill="rgba(0,0,0,0.25)" />
    <clipPath id={`candleClip-${x}`}>
      <rect x="-6.5" y="-76" width="13" height="78" rx="3" />
    </clipPath>
    <g clipPath={`url(#candleClip-${x})`}>
      <rect x="-6.5" y="-76" width="13" height="78" rx="3" fill="#FFF8F0" />
      {[-75, -57, -39, -21, -3].map((sy, idx) => (
        <polygon key={idx} points={`-8,${sy} 8,${sy - 10} 8,${sy - 2} -8,${sy + 8}`} fill="#D9383A" />
      ))}
      <rect x="-6.5" y="-76" width="4" height="78" fill="rgba(255,255,255,0.35)" />
      <rect x="2.5" y="-76" width="4" height="78" fill="rgba(0,0,0,0.12)" />
    </g>
    <rect x="-6.5" y="-76" width="13" height="78" rx="3" fill="none" stroke="#D9C2B2" strokeWidth="0.8" />
    <line x1="0" y1="-76" x2="0" y2="-82" stroke="#3D261C" strokeWidth="2" strokeLinecap="round" />

    {isLit ? (
      <g className="candle-flame" style={{ transformOrigin: '0px -82px' }}>
        <ellipse cx="0" cy="-95" rx="16" ry="22" fill="rgba(255, 168, 38, 0.32)" />
        <path d="M0,-114 C-9,-98 -8,-82 0,-82 C8,-82 9,-98 0,-114 Z" fill="#FF8811" />
        <path d="M0,-107 C-5,-96 -4,-84 0,-84 C4,-84 5,-96 0,-107 Z" fill="#FFE156" />
        <ellipse cx="0" cy="-88" rx="2.2" ry="4.2" fill="#FFFFFF" />
      </g>
    ) : (
      <g className="smoke-rise">
        <path
          d="M0,-83 Q-6,-94 2,-104 T-3,-125"
          fill="none"
          stroke="rgba(160, 150, 145, 0.65)"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <circle cx="2" cy="-112" r="3" fill="rgba(180,170,165,0.4)" />
        <circle cx="-3" cy="-126" r="4.5" fill="rgba(180,170,165,0.25)" />
      </g>
    )}
  </g>
));
BirthdayCandle.displayName = 'BirthdayCandle';

// --- 5. CROSS-SECTION "SLICE VIEW" CUTAWAY OVERLAY ---
export const SliceCutoutOverlay = React.memo(({ yTop, yBottom, widthHalf, flavour }: {
  yTop: number;
  yBottom: number;
  widthHalf: number;
  flavour: FlavourConfig;
}) => {
  const height = yBottom - yTop;
  const step = height / 4;
  return (
    <g className="deco-enter">
      <polygon
        points={`260,${yTop - 3} ${260 + widthHalf},${yTop + 10} ${260 + widthHalf},${yBottom + 8} 260,${yBottom + 14} ${260 - widthHalf},${yBottom + 8} ${260 - widthHalf},${yTop + 10}`}
        fill="#241006"
      />
      <polygon
        points={`260,${yTop} ${260 - widthHalf},${yTop + 11} ${260 - widthHalf},${yBottom + 7} 260,${yBottom - 4}`}
        fill={flavour.sponge}
        stroke={flavour.drip}
        strokeWidth="1.5"
      />
      <polygon
        points={`260,${yTop} ${260 + widthHalf},${yTop + 11} ${260 + widthHalf},${yBottom + 7} 260,${yBottom - 4}`}
        fill={flavour.spongeDark}
        stroke={flavour.drip}
        strokeWidth="1.5"
      />
      {[1, 2, 3].map((i) => {
        const ly = yTop + step * i;
        return (
          <g key={i}>
            <line
              x1="260"
              y1={ly - 3}
              x2={260 - widthHalf + 2}
              y2={ly + 8}
              stroke={flavour.creamSecondary}
              strokeWidth="5"
              strokeLinecap="round"
            />
            <line
              x1="260"
              y1={ly - 3}
              x2={260 + widthHalf - 2}
              y2={ly + 8}
              stroke={flavour.stripe}
              strokeWidth="5"
              strokeLinecap="round"
            />
          </g>
        );
      })}
      <circle cx="242" cy={yTop + height * 0.38} r="2" fill={flavour.crumbDot} opacity="0.6" />
      <circle cx="230" cy={yTop + height * 0.65} r="1.8" fill={flavour.crumbDot} opacity="0.6" />
      <circle cx="278" cy={yTop + height * 0.42} r="2" fill={flavour.crumbDot} opacity="0.6" />
      <circle cx="288" cy={yTop + height * 0.7} r="1.6" fill={flavour.crumbDot} opacity="0.6" />
    </g>
  );
});
SliceCutoutOverlay.displayName = 'SliceCutoutOverlay';

// --- 6. LIVE CAKE CUSTOMIZER EXPORT COMPONENT ---

export interface CakeCustomizerState {
  layers: number;
  layerLabel: string;
  flavour: FlavourConfig;
  flavourName: string;
  weight: string;
  cakeMessage: string;
  activeDecorations: string[];
  activeDecorationNames: string[];
}

interface LiveCakeCustomizerProps {
  onDesignChange?: (state: CakeCustomizerState) => void;
}

export default function LiveCakeCustomizer({ onDesignChange }: LiveCakeCustomizerProps) {
  // Core Cake State
  const [layers, setLayers] = useState<number>(2);
  const [selectedFlavourId, setSelectedFlavourId] = useState<string>('belgian-chocolate');
  const [weight, setWeight] = useState<string>('2.0 kg');
  const [cakeMessage, setCakeMessage] = useState<string>('Happy Birthday');
  const [activeDecorations, setActiveDecorations] = useState<string[]>([
    'fruits',
    'chocolate',
    'cream',
    'candles',
    'sprinkles',
    'plaque',
  ]);

  // Extended Studio Customizations
  const [dripStyleId, setDripStyleId] = useState<string>('signature');
  const [standStyle, setStandStyle] = useState<string>('gold');
  const [fontStyleId, setFontStyleId] = useState<string>('handwriting');

  // Interactive Canvas Modes - Night glow is the default background (wishMode = true)
  const [candlesLit, setCandlesLit] = useState<boolean>(true);
  const [wishMode, setWishMode] = useState<boolean>(true);
  const [sliceView, setSliceView] = useState<boolean>(false);
  const [celebrating, setCelebrating] = useState<boolean>(false);

  // Mobile UI & Modals
  const [mobileTab, setMobileTab] = useState<string>('all');

  const currentFlavour = useMemo(
    () => FLAVOURS.find((f) => f.id === selectedFlavourId) || FLAVOURS[0],
    [selectedFlavourId]
  );

  const currentFont = useMemo(
    () => FONT_STYLES.find((f) => f.id === fontStyleId) || FONT_STYLES[0],
    [fontStyleId]
  );

  // Resolve active drip colors
  const activeDripColors = useMemo(() => {
    if (dripStyleId === 'signature') {
      return {
        drip: currentFlavour.drip,
        highlight: currentFlavour.dripHighlight,
        visible: true,
      };
    }
    if (dripStyleId === 'none') {
      return {
        drip: currentFlavour.spongeDark,
        highlight: currentFlavour.spongeLight,
        visible: false,
      };
    }
    const found = DRIP_STYLES.find((d) => d.id === dripStyleId);
    return {
      drip: found?.color || currentFlavour.drip,
      highlight: found?.highlight || currentFlavour.dripHighlight,
      visible: true,
    };
  }, [dripStyleId, currentFlavour]);

  // Notify parent of state changes (no height, no slices, clean state)
  useEffect(() => {
    if (onDesignChange) {
      const activeDecoNames = activeDecorations
        .map((id) => DECORATIONS.find((d) => d.id === id)?.name || id);

      onDesignChange({
        layers,
        layerLabel: `${layers} ${layers === 1 ? 'Layer' : 'Layers'}`,
        flavour: currentFlavour,
        flavourName: currentFlavour.name,
        weight,
        cakeMessage,
        activeDecorations,
        activeDecorationNames: activeDecoNames,
      });
    }
  }, [
    layers,
    currentFlavour,
    weight,
    cakeMessage,
    activeDecorations,
    onDesignChange,
  ]);

  const toggleDecoration = useCallback((id: string) => {
    setActiveDecorations((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  const hasDeco = useCallback((id: string) => activeDecorations.includes(id), [activeDecorations]);

  const handleToggleCandles = useCallback(() => {
    setCandlesLit((prev) => !prev);
  }, []);

  const triggerCelebration = useCallback(() => {
    setCelebrating(true);
    setTimeout(() => setCelebrating(false), 3200);
  }, []);

  const handleResetDefault = useCallback(() => {
    setLayers(2);
    setSelectedFlavourId('belgian-chocolate');
    setWeight('2.0 kg');
    setCakeMessage('Happy Birthday');
    setDripStyleId('signature');
    setStandStyle('gold');
    setFontStyleId('handwriting');
    setCandlesLit(true);
    setSliceView(false);
    setWishMode(true);
    setActiveDecorations(['fruits', 'chocolate', 'cream', 'candles', 'sprinkles', 'plaque']);
  }, []);

  // Automatically ensure weight fits minimum layer count
  useEffect(() => {
    if (layers === 3 && (weight === '1.0 kg' || weight === '1.5 kg')) {
      setWeight('2.0 kg');
    }
  }, [layers, weight]);

  // Compute where top-of-cake elements sit based on number of tiers
  const topSurfaceY = layers === 1 ? 305 : layers === 2 ? 205 : 135;

  // Stand palette definitions
  const standColors = useMemo(() => {
    switch (standStyle) {
      case 'marble':
        return { p1: '#D6D9DF', p2: '#F5F7FA', p3: '#FFFFFF', rim: '#BCC2CC', stroke: '#9BA3B0' };
      case 'rosegold':
        return { p1: '#B56B62', p2: '#E8A598', p3: '#FCD5CE', rim: '#C97B70', stroke: '#8F4D45' };
      case 'wood':
        return { p1: '#5C381E', p2: '#8C5832', p3: '#B0784F', rim: '#6E4425', stroke: '#422612' };
      default:
        return { p1: '#B87B31', p2: '#E8B86D', p3: '#FCE2A6', rim: '#DF9F4C', stroke: '#9E621E' };
    }
  }, [standStyle]);

  // Helper to check if a section is visible on mobile
  const isSectionVisible = (sectionKey: string) => mobileTab === 'all' || mobileTab === sectionKey;

  return (
    <div className="w-full text-[#2D1A12] font-sans pb-4 pt-2 px-1 sm:px-2 flex flex-col items-center">
      {/* Custom Google Fonts & Keyframe Animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Playfair+Display:ital,wght@0,700;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .font-handwriting {
          font-family: 'Caveat', cursive;
        }
        .font-serif-title {
          font-family: 'Playfair Display', serif;
        }

        @keyframes flameFlicker {
          0%, 100% { transform: scale(1) rotate(-1.5deg); }
          25% { transform: scale(1.06, 0.95) rotate(2deg); }
          50% { transform: scale(0.95, 1.07) rotate(-1deg); }
          75% { transform: scale(1.04, 0.98) rotate(1.5deg); }
        }
        .candle-flame {
          animation: flameFlicker 1.6s infinite ease-in-out;
        }

        @keyframes smokeFloat {
          0% { opacity: 0.85; transform: translateY(0px) scale(0.95); }
          50% { opacity: 0.5; transform: translateY(-10px) scale(1.08); }
          100% { opacity: 0; transform: translateY(-22px) scale(1.25); }
        }
        .smoke-rise {
          animation: smokeFloat 2.4s infinite ease-out;
        }

        @keyframes floatSparkle {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.85; }
          50% { transform: translateY(-7px) scale(1.12); opacity: 1; }
        }
        .animate-float-slow {
          animation: floatSparkle 3.6s infinite ease-in-out;
        }
        .animate-float-delayed {
          animation: floatSparkle 4.2s infinite ease-in-out 1.2s;
        }

        @keyframes tierPop {
          0% { opacity: 0; transform: scale(0.84) translateY(16px); }
          70% { opacity: 1; transform: scale(1.03) translateY(-2px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .tier-enter {
          animation: tierPop 0.42s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          transform-box: fill-box;
          transform-origin: center bottom;
        }

        @keyframes decoPop {
          0% { opacity: 0; transform: scale(0.45); }
          75% { opacity: 1; transform: scale(1.07); }
          100% { opacity: 1; transform: scale(1); }
        }
        .deco-enter {
          animation: decoPop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          transform-box: fill-box;
          transform-origin: center center;
        }

        @keyframes confettiFall {
          0% { transform: translateY(-40px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(520px) rotate(360deg); opacity: 0; }
        }
        .confetti-piece {
          animation: confettiFall 2.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* ==================== TOP STUDIO CONTROLS BAR (EGGLESS REMOVED) ==================== */}
      <header className="max-w-[1320px] w-full flex flex-wrap items-center justify-between gap-2 mb-3 sm:mb-5 px-1">
        <div className="flex items-center gap-2.5">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold tracking-tight text-[#2B1810] leading-none">
              Lollipop Live Cake Studio
            </h2>
            <p className="text-[11px] sm:text-xs text-[#7A6A63] mt-0.5">
              Live 3D Vector Designer &bull; Handcrafted in Trichy
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Reset Button */}
          <button
            type="button"
            onClick={handleResetDefault}
            title="Reset to default cake"
            className="flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-white hover:bg-[#F5EDE3] text-[#5C4B42] border border-[#E6DCD2] transition-colors cursor-pointer"
          >
            <span>Reset Cake</span>
          </button>
        </div>
      </header>

      <div className="max-w-[1320px] w-full grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-7 items-start">
        {/* ==================== LEFT COLUMN: LIVE CAKE PREVIEW ==================== */}
        <div className="lg:col-span-6 relative bg-white rounded-[24px] sm:rounded-[28px] border border-[#F0E6DC] shadow-[0_12px_36px_rgba(92,52,32,0.08)] p-2.5 sm:p-4 transition-all">
          {/* Inner Cream / Night Preview Canvas */}
          <div
            className={`relative w-full h-[340px] xs:h-[380px] sm:h-[420px] lg:h-[470px] rounded-2xl overflow-hidden flex items-center justify-center border transition-colors duration-500 ${
              wishMode
                ? 'bg-[#1D1118] border-[#38222F]'
                : 'bg-[#FAF4EC] border-[#F3EAE0]'
            }`}
          >
            {/* Interactive Canvas Floating Action Pills */}
            <div className="absolute top-2.5 left-2.5 right-2.5 z-20 flex items-center justify-between pointer-events-none">
              <div className="flex flex-wrap items-center gap-1.5 pointer-events-auto">
                {/* Blow Out / Light Candles Pill */}
                {hasDeco('candles') && (
                  <button
                    type="button"
                    onClick={handleToggleCandles}
                    className={`flex items-center px-2.5 py-1.5 rounded-full text-[11px] font-bold shadow-sm transition-all cursor-pointer ${
                      candlesLit
                        ? 'bg-[#FFF3D6] text-[#B85D00] border border-[#F5D08A] hover:bg-[#FFE8B3]'
                        : 'bg-white/90 text-[#4A3B34] border border-[#E6DCD2] hover:bg-white'
                    }`}
                  >
                    {candlesLit ? (
                      <span>Blow Candles</span>
                    ) : (
                      <span>Relight</span>
                    )}
                  </button>
                )}

                {/* Peek Inside Slice Cutout Toggle */}
                <button
                  type="button"
                  onClick={() => setSliceView((s) => !s)}
                  className={`flex items-center px-2.5 py-1.5 rounded-full text-[11px] font-bold shadow-sm transition-all cursor-pointer ${
                    sliceView
                      ? 'bg-[#802348] text-white'
                      : 'bg-white/90 text-[#4A3B34] border border-[#E6DCD2] hover:bg-white'
                  }`}
                >
                  <span>{sliceView ? 'Close Slice' : 'Slice View'}</span>
                </button>
              </div>

              {/* Right Side: Studio Light / Night Glow & Celebrate */}
              <div className="flex items-center gap-1.5 pointer-events-auto">
                <button
                  type="button"
                  onClick={() => setWishMode((w) => !w)}
                  title="Toggle Studio Light / Night Glow"
                  className={`flex items-center px-2.5 py-1.5 rounded-full text-[11px] font-bold shadow-sm transition-all cursor-pointer ${
                    wishMode
                      ? 'bg-[#F3C65F] text-[#2B1810]'
                      : 'bg-white text-[#4A3B34] border border-[#E6DCD2] hover:bg-[#FAF4EC]'
                  }`}
                >
                  <span>{wishMode ? 'Night Glow' : 'Studio Light'}</span>
                </button>

                <button
                  type="button"
                  onClick={triggerCelebration}
                  title="Celebrate with confetti"
                  className="flex items-center px-2.5 py-1.5 rounded-full text-[11px] font-bold bg-white/90 hover:bg-white text-[#802348] border border-[#E6DCD2] shadow-sm transition-transform active:scale-90 cursor-pointer"
                >
                  <span>Celebrate</span>
                </button>
              </div>
            </div>

            {/* SVG CAKE ILLUSTRATION STAGE */}
            <svg
              viewBox="0 0 520 530"
              className="w-full h-full max-h-[500px] select-none"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                {/* Dynamic Pedestal Gradients */}
                <linearGradient id="goldRimGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={standColors.p1} />
                  <stop offset="25%" stopColor={standColors.p2} />
                  <stop offset="50%" stopColor={standColors.p3} />
                  <stop offset="78%" stopColor={standColors.rim} />
                  <stop offset="100%" stopColor={standColors.p1} />
                </linearGradient>

                <linearGradient id="goldStandPillar" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={standColors.stroke} />
                  <stop offset="30%" stopColor={standColors.rim} />
                  <stop offset="52%" stopColor={standColors.p3} />
                  <stop offset="75%" stopColor={standColors.p1} />
                  <stop offset="100%" stopColor={standColors.stroke} />
                </linearGradient>

                <linearGradient id="plateSurfaceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FFFDF9" />
                  <stop offset="65%" stopColor="#F5E6D3" />
                  <stop offset="100%" stopColor="#E2C7A8" />
                </linearGradient>

                <linearGradient id="strawberryBodyGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#FF4B55" />
                  <stop offset="55%" stopColor="#E01B24" />
                  <stop offset="100%" stopColor="#9E0B12" />
                </linearGradient>

                <linearGradient id="spongeCylinderGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={currentFlavour.spongeDark} />
                  <stop offset="28%" stopColor={currentFlavour.sponge} />
                  <stop offset="55%" stopColor={currentFlavour.spongeLight} />
                  <stop offset="85%" stopColor={currentFlavour.sponge} />
                  <stop offset="100%" stopColor={currentFlavour.spongeDark} />
                </linearGradient>

                <linearGradient id="stripeCylinderGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={currentFlavour.stripe} />
                  <stop offset="50%" stopColor={currentFlavour.dripHighlight} />
                  <stop offset="100%" stopColor={currentFlavour.stripe} />
                </linearGradient>

                <radialGradient id="wishCandleGlow" cx="50%" cy="35%" r="55%">
                  <stop offset="0%" stopColor="rgba(255, 195, 75, 0.42)" />
                  <stop offset="50%" stopColor="rgba(255, 140, 35, 0.14)" />
                  <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
                </radialGradient>

                <filter id="plaqueShadow" x="-10%" y="-10%" width="120%" height="130%">
                  <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#2B1406" floodOpacity="0.28" />
                </filter>
              </defs>

              {/* Soft Warm Aura Blob Behind Cake */}
              <path
                d="M110,360 C70,260 110,130 200,115 C245,108 280,75 335,105 C415,145 445,255 415,360 Z"
                fill={wishMode ? '#2B1924' : '#F4E9DC'}
                opacity="0.75"
              />

              {/* Wish Mode Warm Candle Ambient Halo */}
              {wishMode && candlesLit && hasDeco('candles') && (
                <circle cx="260" cy={topSurfaceY - 60} r="220" fill="url(#wishCandleGlow)" />
              )}

              {/* Floating Background Sparkles & Hearts */}
              <g className="animate-float-slow">
                <path d="M78,120 Q78,136 62,136 Q78,136 78,152 Q78,136 94,136 Q78,136 78,120 Z" fill="#F3C65F" />
                <path
                  d="M75,246 C75,246 61,236 61,228 C61,223 65,220 69,220 C72,220 75,222 75,225 C75,222 78,220 81,220 C85,220 89,223 89,228 C89,236 75,246 75,246 Z"
                  fill="#F26B7A"
                />
                <path d="M62,306 Q62,316 52,316 Q62,316 62,326 Q62,316 72,316 Q62,316 62,306 Z" fill="#F3C65F" />
              </g>

              <g className="animate-float-delayed">
                <path
                  d="M442,182 C442,182 428,172 428,164 C428,159 432,156 436,156 C439,156 442,158 442,161 C442,158 445,156 448,156 C452,156 456,159 456,164 C456,172 442,182 442,182 Z"
                  fill="#F26B7A"
                />
                <path d="M454,200 Q454,215 439,215 Q454,215 454,230 Q454,215 469,215 Q454,215 454,200 Z" fill="#F3C65F" />
                <path d="M456,308 Q456,317 447,317 Q456,317 456,326 Q456,317 465,317 Q456,317 456,308 Z" fill="#F3C65F" />
              </g>

              {/* ==================== PEDESTAL CAKE STAND ==================== */}
              <g id="cake-pedestal">
                <ellipse
                  cx="260"
                  cy="480"
                  rx="150"
                  ry="18"
                  fill={wishMode ? 'rgba(0,0,0,0.45)' : '#E6D6C3'}
                />
                <ellipse cx="260" cy="476" rx="108" ry="13" fill="rgba(90, 50, 20, 0.22)" />

                <path
                  d="M178,460 L188,443 L332,443 L342,460 C342,472 178,472 178,460 Z"
                  fill="url(#goldStandPillar)"
                  stroke={standColors.stroke}
                  strokeWidth="1"
                />
                <ellipse
                  cx="260"
                  cy="444"
                  rx="72"
                  ry="9"
                  fill="url(#goldRimGrad)"
                  stroke={standColors.stroke}
                  strokeWidth="0.8"
                />
                <path
                  d="M236,406 L232,442 C232,447 288,447 288,442 L284,406 Z"
                  fill="url(#goldStandPillar)"
                  stroke={standColors.stroke}
                  strokeWidth="1"
                />
                <ellipse cx="260" cy="414" rx="52" ry="8" fill="rgba(70,35,10,0.35)" />

                <path
                  d="M46,374 C46,418 474,418 474,374 L474,386 C474,432 46,432 46,386 Z"
                  fill="url(#goldRimGrad)"
                  stroke={standColors.stroke}
                  strokeWidth="1.2"
                />
                <ellipse
                  cx="260"
                  cy="374"
                  rx="214"
                  ry="37"
                  fill="url(#plateSurfaceGrad)"
                  stroke="#E5C89E"
                  strokeWidth="1.5"
                />
                <ellipse cx="260" cy="374" rx="192" ry="30" fill="none" stroke="#DEC09A" strokeWidth="1" />
                <ellipse cx="260" cy="373" rx="176" ry="27" fill="rgba(60, 28, 10, 0.28)" />
              </g>

              {/* ==================== TIER 1: BOTTOM LAYER ==================== */}
              <g id="tier-1-bottom" className="tier-enter">
                <path d="M92,282 L92,368 C92,398 428,398 428,368 L428,282 Z" fill="url(#spongeCylinderGrad)" />
                <path
                  d="M92,324 C92,354 428,354 428,324 L428,344 C428,374 92,374 92,344 Z"
                  fill="url(#stripeCylinderGrad)"
                />
                <ellipse cx="260" cy="282" rx="168" ry="26" fill={activeDripColors.drip} />
                <ellipse cx="260" cy="280" rx="160" ry="22" fill={activeDripColors.highlight} opacity="0.55" />

                {activeDripColors.visible && (
                  <path
                    d="M92,282
                       C92,302 96,326 102,326
                       C108,326 109,302 116,302
                       C123,302 124,338 131,338
                       C138,338 140,305 148,305
                       C156,305 158,320 165,320
                       C172,320 175,302 184,302
                       C193,302 195,330 203,330
                       C211,330 215,305 225,305
                       C235,305 238,322 247,322
                       C256,322 260,306 270,306
                       C280,306 284,325 293,325
                       C302,325 306,304 316,304
                       C326,304 330,334 338,334
                       C346,334 350,305 359,305
                       C368,305 371,322 378,322
                       C385,322 388,302 395,302
                       C402,302 405,332 411,332
                       C417,332 419,304 423,304
                       C426,304 428,295 428,282 Z"
                    fill={activeDripColors.drip}
                  />
                )}

                <path
                  d="M100,287 Q260,312 420,287"
                  fill="none"
                  stroke="rgba(255,255,255,0.22)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {/* Slice View Cutout on Bottom Tier */}
                {sliceView && (
                  <SliceCutoutOverlay yTop={295} yBottom={380} widthHalf={42} flavour={currentFlavour} />
                )}

                {/* Platter Edge Garnishes */}
                {hasDeco('chocolate') && (
                  <g className="deco-enter">
                    <TruffleBall x={128} y={376} r={9.5} color={currentFlavour.drip} />
                    <TruffleBall x={144} y={381} r={6.5} color={currentFlavour.spongeDark} />
                  </g>
                )}

                {hasDeco('cream') && (
                  <g className="deco-enter">
                    <PipedSwirl x={358} y={380} scale={0.95} />
                    <PipedSwirl x={414} y={366} scale={0.85} color={currentFlavour.creamPrimary} isDark={true} />
                  </g>
                )}

                {hasDeco('fruits') && (
                  <g className="deco-enter">
                    <SlicedStrawberry x={388} y={374} scale={0.95} rotate={12} />
                  </g>
                )}

                {hasDeco('sprinkles') && (
                  <g className="deco-enter">
                    <SugarPearl x={115} y={376} r={3.5} color="#FFF5E4" />
                    <SugarPearl x={156} y={382} r={3} color="#F2B880" />
                    <SugarPearl x={335} y={384} r={3.5} color="#FFF5E4" />
                    <SugarPearl x={374} y={387} r={3} color="#FFF5E4" />
                  </g>
                )}

                {/* Tier 1 Shoulder Ledge Decorations */}
                {hasDeco('cream') && (
                  <g className="deco-enter">
                    <PipedSwirl x={126} y={272} scale={1.05} />
                    <PipedSwirl x={152} y={279} scale={0.85} color={currentFlavour.creamPrimary} isDark={true} />
                    <PipedSwirl x={392} y={272} scale={0.95} />
                    <PipedSwirl x={372} y={280} scale={0.88} color={currentFlavour.creamPrimary} isDark={true} />
                  </g>
                )}

                {hasDeco('chocolate') && (
                  <g className="deco-enter">
                    <ChocolateSquare x={368} y={260} scale={0.68} rotate={32} />
                    <TruffleBall x={174} y={283} r={8.5} color={currentFlavour.drip} />
                    <TruffleBall x={192} y={287} r={6} color={currentFlavour.spongeDark} />
                    <TruffleBall x={305} y={287} r={7.5} color={currentFlavour.drip} />
                  </g>
                )}

                {hasDeco('fruits') && (
                  <g className="deco-enter">
                    <SlicedStrawberry x={335} y={278} scale={0.95} rotate={15} />
                  </g>
                )}

                {hasDeco('macarons') && (
                  <g className="deco-enter">
                    <FrenchMacaron
                      x={136}
                      y={282}
                      scale={0.85}
                      rotate={-18}
                      shellColor={currentFlavour.macaronColor}
                      fillingColor={currentFlavour.macaronFilling}
                    />
                    <FrenchMacaron
                      x={108}
                      y={372}
                      scale={0.8}
                      rotate={14}
                      shellColor={currentFlavour.macaronColor}
                      fillingColor={currentFlavour.creamSecondary}
                    />
                  </g>
                )}

                {hasDeco('goldleaf') && (
                  <g className="deco-enter">
                    <GoldFlake x={115} y={315} scale={1.1} rotate={15} />
                    <GoldFlake x={202} y={308} scale={0.9} rotate={-25} />
                    <GoldFlake x={338} y={318} scale={1.2} rotate={40} />
                    <GoldFlake x={408} y={310} scale={0.95} rotate={-10} />
                  </g>
                )}

                {hasDeco('sprinkles') && (
                  <g className="deco-enter">
                    <SugarPearl x={138} y={286} r={3.2} />
                    <SugarPearl x={163} y={288} r={2.8} color="#F7C59F" />
                    <SugarPearl x={208} y={291} r={3} />
                    <SugarPearl x={225} y={288} r={2.2} color="#FFD166" />
                    <SugarPearl x={286} y={291} r={3.2} />
                    <SugarPearl x={316} y={292} r={2.6} />
                    <SugarPearl x={360} y={289} r={3.2} />
                  </g>
                )}
              </g>

              {/* ==================== TIER 2: MIDDLE LAYER ==================== */}
              {layers >= 2 && (
                <g id="tier-2-middle" className="tier-enter">
                  <ellipse cx="260" cy="278" rx="116" ry="18" fill="rgba(35, 14, 4, 0.35)" />
                  <path d="M148,196 L148,274 C148,298 372,298 372,274 L372,196 Z" fill="url(#spongeCylinderGrad)" />
                  <path
                    d="M148,242 C148,265 372,265 372,242 L372,260 C372,283 148,283 148,260 Z"
                    fill="url(#stripeCylinderGrad)"
                  />
                  <ellipse cx="260" cy="196" rx="112" ry="18" fill={activeDripColors.drip} />
                  <ellipse cx="260" cy="194.5" rx="105" ry="15" fill={activeDripColors.highlight} opacity="0.55" />

                  {activeDripColors.visible && (
                    <path
                      d="M148,196
                         C148,214 152,232 158,232
                         C164,232 166,210 173,210
                         C180,210 183,242 191,242
                         C199,242 202,212 212,212
                         C222,212 225,228 234,228
                         C243,228 248,212 258,212
                         C268,212 272,245 280,245
                         C288,245 292,214 302,214
                         C312,214 316,232 324,232
                         C332,232 336,210 344,210
                         C352,210 355,235 361,235
                         C367,235 372,212 372,196 Z"
                      fill={activeDripColors.drip}
                    />
                  )}

                  <path
                    d="M155,200 Q260,219 365,200"
                    fill="none"
                    stroke="rgba(255,255,255,0.24)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />

                  {sliceView && (
                    <SliceCutoutOverlay yTop={206} yBottom={282} widthHalf={34} flavour={currentFlavour} />
                  )}

                  {hasDeco('goldleaf') && (
                    <g className="deco-enter">
                      <GoldFlake x={188} y={226} scale={1} rotate={-15} />
                      <GoldFlake x={280} y={232} scale={1.1} rotate={28} />
                      <GoldFlake x={342} y={222} scale={0.85} rotate={12} />
                    </g>
                  )}

                  {layers === 3 && (
                    <g>
                      {hasDeco('cream') && (
                        <>
                          <PipedSwirl x={170} y={193} scale={0.78} />
                          <PipedSwirl x={350} y={193} scale={0.78} />
                        </>
                      )}
                      {hasDeco('chocolate') && (
                        <>
                          <TruffleBall x={194} y={198} r={6.5} color={currentFlavour.drip} />
                          <TruffleBall x={326} y={198} r={6.5} color={currentFlavour.drip} />
                        </>
                      )}
                    </g>
                  )}
                </g>
              )}

              {/* ==================== TIER 3: TOP LAYER ==================== */}
              {layers === 3 && (
                <g id="tier-3-top" className="tier-enter">
                  <ellipse cx="260" cy="194" rx="78" ry="12" fill="rgba(35, 14, 4, 0.35)" />
                  <path d="M186,128 L186,190 C186,208 334,208 334,190 L334,128 Z" fill="url(#spongeCylinderGrad)" />
                  <path
                    d="M186,160 C186,178 334,178 334,160 L334,174 C334,192 186,192 186,174 Z"
                    fill="url(#stripeCylinderGrad)"
                  />
                  <ellipse cx="260" cy="128" rx="74" ry="13" fill={activeDripColors.drip} />
                  <ellipse cx="260" cy="127" rx="68" ry="11" fill={activeDripColors.highlight} opacity="0.55" />

                  {activeDripColors.visible && (
                    <path
                      d="M186,128
                         C186,142 190,156 196,156
                         C202,156 205,138 213,138
                         C221,138 225,162 233,162
                         C241,162 246,140 256,140
                         C266,140 271,164 279,164
                         C287,164 292,138 300,138
                         C308,138 312,156 319,156
                         C326,156 334,142 334,128 Z"
                      fill={activeDripColors.drip}
                    />
                  )}

                  <path
                    d="M192,131 Q260,145 328,131"
                    fill="none"
                    stroke="rgba(255,255,255,0.22)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />

                  {sliceView && (
                    <SliceCutoutOverlay yTop={136} yBottom={196} widthHalf={25} flavour={currentFlavour} />
                  )}
                </g>
              )}

              {/* ==================== CROWN TOPPINGS ==================== */}
              <g
                id="crown-decorations"
                style={{
                  transform: `translate(0px, ${topSurfaceY - 205}px)`,
                  transition: 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
              >
                {/* Heart Cake Topper */}
                {hasDeco('topper') && (
                  <g className="deco-enter">
                    <line x1="260" y1="120" x2="260" y2="188" stroke="#D49B4B" strokeWidth="3.5" strokeLinecap="round" />
                    <path
                      d="M260,142 C260,142 222,116 222,94 C222,79 234,70 246,70 C254,70 260,76 260,82 C260,76 266,70 274,70 C286,70 298,79 298,94 C298,116 260,142 260,142 Z"
                      fill="#F0546A"
                      stroke="#FFF0F3"
                      strokeWidth="2"
                    />
                    <path
                      d="M234,88 C234,81 241,77 247,78"
                      stroke="rgba(255,255,255,0.5)"
                      strokeWidth="2.5"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </g>
                )}

                {/* Angled Chocolate Bar on Crown */}
                {hasDeco('chocolate') && (
                  <g className="deco-enter">
                    <ChocolateSquare x={222} y={172} scale={0.92} rotate={-36} />
                  </g>
                )}

                {/* Interactive Blowable Birthday Candles */}
                {hasDeco('candles') && (
                  <g className="deco-enter">
                    <BirthdayCandle x={244} y={190} isLit={candlesLit} onToggle={handleToggleCandles} />
                    <BirthdayCandle x={274} y={190} isLit={candlesLit} onToggle={handleToggleCandles} />
                  </g>
                )}

                {/* Large Whole Strawberry on Crown */}
                {hasDeco('fruits') && (
                  <g className="deco-enter">
                    <WholeStrawberry x={294} y={184} scale={1.32} rotate={8} />
                  </g>
                )}

                {/* French Macaron on Crown */}
                {hasDeco('macarons') && (
                  <g className="deco-enter">
                    <FrenchMacaron
                      x={208}
                      y={192}
                      scale={0.9}
                      rotate={-14}
                      shellColor={currentFlavour.macaronColor}
                      fillingColor={currentFlavour.macaronFilling}
                    />
                  </g>
                )}

                {/* Piped Cream Swirls on Crown */}
                {hasDeco('cream') && (
                  <g className="deco-enter">
                    <PipedSwirl x={190} y={188} scale={1.15} color={currentFlavour.creamPrimary} isDark={true} />
                    <PipedSwirl x={260} y={194} scale={1.18} />
                    <PipedSwirl x={330} y={188} scale={1.08} color={currentFlavour.creamPrimary} isDark={true} />
                  </g>
                )}

                {/* Crown Truffle Balls */}
                {hasDeco('chocolate') && (
                  <g className="deco-enter">
                    <TruffleBall x={224} y={194} r={9.5} color={currentFlavour.drip} />
                    <TruffleBall x={302} y={195} r={8.5} color={currentFlavour.drip} />
                  </g>
                )}

                {/* Crown 24K Gold Flakes */}
                {hasDeco('goldleaf') && (
                  <g className="deco-enter">
                    <GoldFlake x={192} y={176} scale={1} rotate={-20} />
                    <GoldFlake x={262} y={182} scale={1.15} rotate={12} />
                    <GoldFlake x={326} y={176} scale={0.95} rotate={30} />
                  </g>
                )}

                {/* Crown Sugar Pearls */}
                {hasDeco('sprinkles') && (
                  <g className="deco-enter">
                    <SugarPearl x={170} y={194} r={3} />
                    <SugarPearl x={210} y={198} r={3.5} />
                    <SugarPearl x={240} y={201} r={2.8} color="#F7C59F" />
                    <SugarPearl x={286} y={200} r={3.2} />
                    <SugarPearl x={318} y={197} r={3.8} />
                    <SugarPearl x={348} y={193} r={2.8} />
                  </g>
                )}
              </g>

              {/* ==================== CUSTOM NAME PLAQUE ON FRONT TIER ==================== */}
              {hasDeco('plaque') && !sliceView && (
                <g id="cake-name-plaque" className="deco-enter" filter="url(#plaqueShadow)">
                  <path
                    d="M174,312
                       L346,312
                       C355,312 360,318 360,324
                       C366,326 369,331 369,337
                       C369,343 366,348 360,350
                       C360,356 355,362 346,362
                       L174,362
                       C165,362 160,356 160,350
                       C154,348 151,343 151,337
                       C151,331 154,326 160,324
                       C160,318 165,312 174,312 Z"
                    fill="#FFF9EE"
                    stroke="#DFBF9F"
                    strokeWidth="2"
                  />
                  <path
                    d="M177,316
                       L343,316
                       C350,316 354,321 354,326
                       C359,328 362,332 362,337
                       C362,342 359,346 354,348
                       C354,353 350,358 343,358
                       L177,358
                       C170,358 166,353 166,348
                       C161,346 158,342 158,337
                       C158,332 161,328 166,326
                       C166,321 170,316 177,316 Z"
                    fill="none"
                    stroke="#EAD3B8"
                    strokeWidth="1.2"
                  />

                  <path
                    d="M175,342 C175,342 168,337 168,333 C168,330.5 170,329 172,329 C173.5,329 175,330 175,331.5 C175,330 176.5,329 178,329 C180,329 182,330.5 182,333 C182,337 175,342 175,342 Z"
                    fill="#E35D5B"
                  />
                  <path
                    d="M345,342 C345,342 338,337 338,333 C338,330.5 340,329 342,329 C343.5,329 345,330 345,331.5 C345,330 346.5,329 348,329 C350,329 352,330.5 352,333 C352,337 345,342 345,342 Z"
                    fill="#E35D5B"
                  />

                  <text
                    x="260"
                    y="344"
                    textAnchor="middle"
                    fill="#4A2511"
                    className={`${currentFont.className} font-bold`}
                    fontSize={(cakeMessage.length > 18 ? 20 : 25) + currentFont.sizeBoost}
                  >
                    {cakeMessage.trim() || 'Happy Birthday'}
                  </text>
                </g>
              )}

              {/* ==================== CONFETTI CELEBRATION OVERLAY ==================== */}
              {celebrating && (
                <g>
                  {[
                    { x: 90, c: '#E63946', d: '0s' },
                    { x: 140, c: '#FFB703', d: '0.15s' },
                    { x: 195, c: '#2A9D8F', d: '0.05s' },
                    { x: 250, c: '#8338EC', d: '0.2s' },
                    { x: 310, c: '#FF006E', d: '0.1s' },
                    { x: 365, c: '#FB5607', d: '0.25s' },
                    { x: 420, c: '#3A86FF', d: '0.08s' },
                    { x: 120, c: '#F4A261', d: '0.3s' },
                    { x: 280, c: '#06D6A0', d: '0.18s' },
                    { x: 390, c: '#FFD166', d: '0.12s' },
                  ].map((p, i) => (
                    <rect
                      key={i}
                      x={p.x}
                      y="10"
                      width="10"
                      height="16"
                      rx="3"
                      fill={p.c}
                      className="confetti-piece"
                      style={{ animationDelay: p.d }}
                    />
                  ))}
                </g>
              )}
            </svg>
          </div>
        </div>

        {/* ==================== MOBILE CATEGORY STEP NAVIGATOR (< 1024px) ==================== */}
        <div className="lg:hidden w-full overflow-x-auto no-scrollbar -my-1">
          <div className="flex items-center gap-2 pb-1">
            {MOBILE_TABS.map((tab) => {
              const active = mobileTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setMobileTab(tab.id)}
                  className={`flex items-center px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    active
                      ? 'bg-[#802348] text-white shadow-sm'
                      : 'bg-white text-[#5C4B42] border border-[#EADFD4]'
                  }`}
                >
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ==================== RIGHT COLUMN: 5 CONFIGURATION SECTIONS ==================== */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          {/* 1. LAYERS (CAKE SIZE) */}
          {isSectionVisible('size') && (
            <section className="bg-white rounded-2xl border border-[#F0E6DC] p-4 sm:p-5 shadow-[0_4px_20px_rgba(92,52,32,0.03)]">
              <div className="flex items-center justify-between mb-3.5">
                <h3 className="text-[15px] font-bold text-[#2B1810]">1. Cake Layers</h3>
                <span className="text-xs font-semibold text-[#802348] bg-[#FDF2F5] px-2.5 py-0.5 rounded-full">
                  {layers} {layers === 1 ? 'Tier' : 'Tiers'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {LAYER_OPTIONS.map((opt) => {
                  const isSelected = layers === opt.layers;
                  return (
                    <button
                      key={opt.layers}
                      type="button"
                      onClick={() => setLayers(opt.layers)}
                      className={`group relative rounded-xl p-2.5 sm:p-3 flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? 'bg-[#802348] text-white ring-2 ring-[#802348] ring-offset-2 ring-offset-white shadow-md'
                          : 'bg-[#FAF6F0] text-[#2B1810] hover:bg-[#F3ECE2] border border-[#EFE5DA]'
                      }`}
                    >
                      <MiniLayerIcon layers={opt.layers} />
                      <span className="text-[13px] font-bold mt-1">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {/* 2. FLAVOUR & GLAZE DRIP */}
          {isSectionVisible('flavour') && (
            <section className="bg-white rounded-2xl border border-[#F0E6DC] p-4 sm:p-5 shadow-[0_4px_20px_rgba(92,52,32,0.03)]">
              <div className="flex items-center justify-between mb-3.5">
                <h3 className="text-[15px] font-bold text-[#2B1810]">2. Flavour</h3>
                <span className="text-xs text-[#7A6A63] font-medium">10 Recipes</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {FLAVOURS.map((flavour) => {
                  const isSelected = flavour.id === selectedFlavourId;
                  return (
                    <button
                      key={flavour.id}
                      type="button"
                      onClick={() => setSelectedFlavourId(flavour.id)}
                      className={`relative flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl text-left transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? 'bg-[#FDF6F8] border-2 border-[#802348] shadow-sm'
                          : 'bg-[#FAF6F0] border border-[#EFE5DA] hover:bg-[#F3ECE2]'
                      }`}
                    >
                      <MiniFlavourIcon flavour={flavour} />
                      <div className="min-w-0">
                        <span className="block text-[12.5px] font-bold text-[#2B1810] leading-tight truncate">
                          {flavour.name}
                        </span>
                        <span className="block text-[10px] font-medium text-[#8C7A6B] mt-0.5">
                          {flavour.badge}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Glaze Drip Sub-selector */}
              <div className="mt-4 pt-3.5 border-t border-[#F2E8DEC0]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#5C4B42]">Glaze Drip Finish:</span>
                  <span className="text-[11px] text-[#8C7A6B]">Customizes top drip curtain</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {DRIP_STYLES.map((drip) => {
                    const active = dripStyleId === drip.id;
                    return (
                      <button
                        key={drip.id}
                        type="button"
                        onClick={() => setDripStyleId(drip.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          active
                            ? 'bg-[#802348] text-white shadow-xs'
                            : 'bg-[#FAF6F0] text-[#4A3B34] border border-[#EFE5DA] hover:bg-[#F3ECE2]'
                        }`}
                      >
                        {drip.color && (
                          <span
                            className="w-3 h-3 rounded-full border border-black/15"
                            style={{ backgroundColor: drip.color }}
                          />
                        )}
                        <span>{drip.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>
          )}

          {/* 3. WEIGHT */}
          {isSectionVisible('weight') && (
            <section className="bg-white rounded-2xl border border-[#F0E6DC] p-4 sm:p-5 shadow-[0_4px_20px_rgba(92,52,32,0.03)]">
              <div className="flex items-center justify-between mb-3.5">
                <h3 className="text-[15px] font-bold text-[#2B1810]">3. Weight</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {WEIGHT_OPTIONS.map((item) => {
                  const isSelected = weight === item.label;
                  const isDisabled = layers === 3 && item.kg < 2.0;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      disabled={isDisabled}
                      onClick={() => setWeight(item.label)}
                      className={`py-3 px-3 rounded-xl flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${
                        isDisabled
                          ? 'bg-[#F5F2EE] text-[#C2B6AD] border border-[#EDE6DF] cursor-not-allowed opacity-60'
                          : isSelected
                          ? 'bg-[#802348] text-white shadow-sm'
                          : 'bg-[#FAF6F0] text-[#2B1810] border border-[#EFE5DA] hover:bg-[#F3ECE2]'
                      }`}
                    >
                      <span className="text-[13.5px] font-bold">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {/* 4. NAME TO WRITE ON CAKE */}
          {isSectionVisible('message') && (
            <section className="bg-white rounded-2xl border border-[#F0E6DC] p-4 sm:p-5 shadow-[0_4px_20px_rgba(92,52,32,0.03)]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[15px] font-bold text-[#2B1810]">4. Name to Write on Cake</h3>
                {/* Font Calligraphy Switcher */}
                <div className="flex items-center gap-1 bg-[#FAF6F0] p-1 rounded-lg border border-[#EFE5DA]">
                  {FONT_STYLES.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFontStyleId(f.id)}
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                        fontStyleId === f.id
                          ? 'bg-[#802348] text-white'
                          : 'text-[#6E5A4F] hover:text-[#2B1810]'
                      }`}
                    >
                      {f.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative mb-3">
                <input
                  type="text"
                  maxLength={30}
                  value={cakeMessage}
                  onChange={(e) => {
                    setCakeMessage(e.target.value);
                    if (!hasDeco('plaque')) toggleDecoration('plaque');
                    if (sliceView) setSliceView(false);
                  }}
                  placeholder="Write a message on the cake..."
                  className="w-full bg-[#FDFBF9] border border-[#E8DEC8] focus:border-[#802348] focus:outline-none rounded-xl px-4 py-2.5 pr-16 text-[14px] font-medium text-[#2B1810] transition-colors"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-[#9A897E]">
                  {cakeMessage.length}/30
                </span>
              </div>

              {/* Quick Suggestion Pills */}
              <div className="flex flex-wrap gap-2">
                {QUICK_MESSAGES.map((msg) => {
                  const isSelected = cakeMessage === msg;
                  return (
                    <button
                      key={msg}
                      type="button"
                      onClick={() => {
                        setCakeMessage(msg);
                        if (!hasDeco('plaque')) toggleDecoration('plaque');
                        if (sliceView) setSliceView(false);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
                        isSelected
                          ? 'bg-[#FCF0F4] text-[#802348] border border-[#802348]'
                          : 'bg-[#FAF6F0] text-[#5C4B42] border border-[#EFE5DA] hover:bg-[#F3ECE2]'
                      }`}
                    >
                      {msg}
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {/* 5. DECORATIONS (OPTIONAL) */}
          {isSectionVisible('decor') && (
            <section className="bg-white rounded-2xl border border-[#F0E6DC] p-4 sm:p-5 shadow-[0_4px_20px_rgba(92,52,32,0.03)]">
              <div className="flex items-center justify-between mb-3.5">
                <div>
                  <h3 className="text-[15px] font-bold text-[#2B1810]">
                    5. Decorations (Optional)
                  </h3>
                  <p className="text-[11px] text-[#8C7A6B]">
                    Tap toppings to add or remove from your live cake
                  </p>
                </div>
                <span className="text-xs font-bold text-[#802348] bg-[#FDF2F5] px-2.5 py-1 rounded-full">
                  {activeDecorations.length} Active
                </span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2">
                {DECORATIONS.map((deco) => {
                  const isSelected = hasDeco(deco.id);
                  return (
                    <button
                      key={deco.id}
                      type="button"
                      onClick={() => toggleDecoration(deco.id)}
                      className={`relative flex flex-col items-center justify-between p-2 rounded-xl transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? 'bg-[#FDF6F8] border-2 border-[#802348] shadow-sm scale-[1.02]'
                          : 'bg-[#FAF6F0] border border-[#EFE5DA] hover:bg-[#F3ECE2] opacity-85 hover:opacity-100'
                      }`}
                    >
                      {isSelected && (
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#802348]" />
                      )}
                      <div className="w-10 h-10 flex items-center justify-center">
                        <MiniDecorationIcon id={deco.id} />
                      </div>
                      <span className="text-[10.5px] font-bold text-[#2B1810] text-center leading-tight mt-1">
                        {deco.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
