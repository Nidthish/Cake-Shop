"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/components/cart/CartProvider";

const CONTACTS = [
  { name: "Lollipop Support 1", phone: "918489324697", display: "+91 84893 24697" },
  { name: "Lollipop Support 2", phone: "919655888829", display: "+91 96558 88829" },
  { name: "Lollipop Support 3", phone: "917373737810", display: "+91 73737 37810" },
];

const CANDY_TRAIL_EMOJIS = ["✨", "🌟", "🍬", "🍭", "⭐", "💖", "🍰"];
const BURST_ANGLES = [0, 60, 120, 180, 240, 300];

export default function FloatingActions() {
  const pathname = usePathname();
  const { items, itemCount, summary, updateQuantity, removeItem } = useCart();

  const [cartOpen, setCartOpen] = useState(false);
  const [waOpen, setWaOpen] = useState(false);
  const [cartChomp, setCartChomp] = useState(false);
  const [badgeBouncing, setBadgeBouncing] = useState(false);
  const [slidePanelOpen, setSlidePanelOpen] = useState(false);

  const cartBtnRef = useRef<HTMLButtonElement | null>(null);
  const waBtnRef = useRef<HTMLButtonElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Listen for mobile slide panel (drawer / search modal) events
  useEffect(() => {
    const handleSlide = (e: Event) => {
      const customEvent = e as CustomEvent<{ open: boolean }>;
      if (customEvent.detail) {
        setSlidePanelOpen(customEvent.detail.open);
        if (customEvent.detail.open) {
          setCartOpen(false);
          setWaOpen(false);
        }
      }
    };
    window.addEventListener("lollipop:slide-panel", handleSlide);
    return () => {
      window.removeEventListener("lollipop:slide-panel", handleSlide);
    };
  }, []);

  // Close popups on navigation
  useEffect(() => {
    setCartOpen(false);
    setWaOpen(false);
  }, [pathname]);

  // Close popups on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setCartOpen(false);
        setWaOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Trigger radial burst of sparkles around cart upon arrival
  const triggerCartBurst = useCallback((targetX: number, targetY: number) => {
    if (typeof window === "undefined") return;

    BURST_ANGLES.forEach((deg) => {
      const rad = (deg * Math.PI) / 180;
      const dist = 38 + Math.random() * 15;
      const bx = Math.cos(rad) * dist;
      const by = Math.sin(rad) * dist;

      const star = document.createElement("div");
      star.className = "candy-burst-star";
      star.style.position = "fixed";
      star.style.left = `${targetX}px`;
      star.style.top = `${targetY}px`;
      star.style.setProperty("--bx", `${bx}px`);
      star.style.setProperty("--by", `${by}px`);
      star.textContent = deg % 120 === 0 ? "✨" : "⭐";

      document.body.appendChild(star);
      setTimeout(() => star.remove(), 750);
    });
  }, []);

  // Smooth, slow, catchy kidish fly-to-cart animation engine
  const triggerFlyAnimation = useCallback(
    (startX: number, startY: number, imageUrl?: string) => {
      if (typeof window === "undefined") return;

      const targetBtn =
        cartBtnRef.current ||
        document.getElementById("floating-candy-cart-btn") ||
        document.getElementById("mobile-cart-float-btn");
      if (!targetBtn) return;

      const targetRect = targetBtn.getBoundingClientRect();
      const targetX = targetRect.left + targetRect.width / 2;
      const targetY = targetRect.top + targetRect.height / 2;

      // 1. Initial Launch Shockwave Halo at origin
      const shockwave = document.createElement("div");
      shockwave.className = "candy-launch-shockwave";
      shockwave.style.left = `${startX}px`;
      shockwave.style.top = `${startY}px`;
      document.body.appendChild(shockwave);
      setTimeout(() => shockwave.remove(), 650);

      // 2. Flying Cake Bubble Node
      const flyer = document.createElement("div");
      flyer.className = "candy-flying-particle";
      flyer.style.position = "fixed";
      flyer.style.left = "0px";
      flyer.style.top = "0px";
      flyer.style.width = "62px";
      flyer.style.height = "62px";
      flyer.style.zIndex = "999999";
      flyer.style.pointerEvents = "none";
      flyer.style.willChange = "transform, opacity";

      // Inner candy sphere
      const inner = document.createElement("div");
      inner.style.width = "100%";
      inner.style.height = "100%";
      inner.style.borderRadius = "9999px";
      inner.style.position = "relative";
      inner.style.overflow = "hidden";
      inner.style.border = "3.5px solid #FFD54F";
      inner.style.backgroundColor = "#FFFDF8";
      inner.style.boxShadow =
        "0 12px 28px rgba(255, 64, 129, 0.45), 0 0 20px rgba(255, 215, 0, 0.65)";
      inner.style.display = "flex";
      inner.style.alignItems = "center";
      inner.style.justifyContent = "center";

      if (imageUrl) {
        const img = document.createElement("img");
        img.src = imageUrl;
        img.alt = "Cake";
        img.style.width = "100%";
        img.style.height = "100%";
        img.style.objectFit = "cover";
        img.style.borderRadius = "9999px";
        inner.appendChild(img);
      } else {
        const icon = document.createElement("span");
        icon.className = "material-symbols-outlined";
        icon.innerText = "cake";
        icon.style.color = "#E91E63";
        icon.style.fontSize = "32px";
        inner.appendChild(icon);
      }

      // Glossy highlight arc overlay
      const shine = document.createElement("div");
      shine.style.position = "absolute";
      shine.style.top = "2px";
      shine.style.left = "6px";
      shine.style.right = "6px";
      shine.style.height = "40%";
      shine.style.background =
        "linear-gradient(180deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.05) 100%)";
      shine.style.borderRadius = "9999px 9999px 0 0";
      shine.style.pointerEvents = "none";
      inner.appendChild(shine);

      flyer.appendChild(inner);
      document.body.appendChild(flyer);

      // 3. Parabolic Rainbow Flight Arc Calculation
      const midX = startX + (targetX - startX) * 0.45;
      const arcHeight = Math.max(140, Math.min(260, Math.abs(startX - targetX) * 0.35));
      const midY = Math.min(startY, targetY) - arcHeight;

      // Sample 26 points along the quadratic curve for smooth 60fps/120fps motion
      const STEPS = 25;
      const keyframes: Keyframe[] = [];

      for (let i = 0; i <= STEPS; i++) {
        const t = i / STEPS;
        // Ease timing: gentle ease-out start, smooth floating mid-flight, sweet dive end
        const u = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

        // Quadratic Bezier interpolation
        const currentX = (1 - u) * (1 - u) * startX + 2 * (1 - u) * u * midX + u * u * targetX;
        const currentY = (1 - u) * (1 - u) * startY + 2 * (1 - u) * u * midY + u * u * targetY;

        // Kidish cartoon scale progression:
        // Pop up big at start (wind-up) -> float comfortably -> shrink upon entering cart
        let scale = 1;
        if (t < 0.15) {
          scale = 0.3 + (1.45 - 0.3) * (t / 0.15); // Pops up to 1.45x
        } else if (t < 0.5) {
          scale = 1.45 - (1.45 - 1.25) * ((t - 0.15) / 0.35); // Floats at 1.25x
        } else if (t < 0.8) {
          scale = 1.25 - (1.25 - 1.0) * ((t - 0.5) / 0.3);
        } else {
          scale = 1.0 - (1.0 - 0.12) * ((t - 0.8) / 0.2); // Dives into cart
        }

        // Playful cartoon rotation wobble
        let rot = 0;
        if (t < 0.2) rot = t * 90; // winds up
        else if (t < 0.45) rot = 18 - ((t - 0.2) / 0.25) * 32; // wobbles left
        else if (t < 0.75) rot = -14 + ((t - 0.45) / 0.3) * 26; // wobbles right
        else rot = 12 - ((t - 0.75) / 0.25) * 36; // dives straight in

        // Opacity: fades in instantly, stays solid, fades only in the final 5%
        let opacity = 1;
        if (t === 0) opacity = 0.3;
        else if (t > 0.95) opacity = 1 - (t - 0.95) / 0.05;

        keyframes.push({
          transform: `translate3d(${currentX - 31}px, ${currentY - 31}px, 0) scale(${scale}) rotate(${rot}deg)`,
          opacity,
          offset: t,
        });
      }

      // 4. Start 1500ms smooth animation
      const DURATION = 1500; // 1.5 seconds: visibly slow, attractive & kidish!
      const animation = flyer.animate(keyframes, {
        duration: DURATION,
        easing: "linear",
      });

      // 5. Spawning Twinkling Candy Trail Stars along the path
      let trailCount = 0;
      const trailInterval = setInterval(() => {
        trailCount++;
        if (trailCount > 10) return;

        const rect = flyer.getBoundingClientRect();
        if (rect.width > 0 && rect.left > 0) {
          const star = document.createElement("div");
          star.className = "candy-trail-sparkle";
          star.style.left = `${rect.left + rect.width / 2}px`;
          star.style.top = `${rect.top + rect.height / 2}px`;

          const dx = (Math.random() - 0.5) * 36;
          const dy = Math.random() * 26 + 10;
          star.style.setProperty("--dx", `${dx}px`);
          star.style.setProperty("--dy", `${dy}px`);

          const emoji = CANDY_TRAIL_EMOJIS[Math.floor(Math.random() * CANDY_TRAIL_EMOJIS.length)];
          star.textContent = emoji;

          document.body.appendChild(star);
          setTimeout(() => star.remove(), 700);
        }
      }, 130);

      // 6. Arrival Impact at Candy Cart
      animation.onfinish = () => {
        clearInterval(trailInterval);
        flyer.remove();

        // Trigger joyful Jelly Chomp on the pink candy cart button
        setCartChomp(true);
        setBadgeBouncing(true);
        triggerCartBurst(targetX, targetY);

        setTimeout(() => {
          setCartChomp(false);
          setBadgeBouncing(false);
        }, 750);
      };
    },
    [triggerCartBurst]
  );

  useEffect(() => {
    const handleFlyEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ x: number; y: number; image?: string }>;
      if (customEvent.detail) {
        const { x, y, image } = customEvent.detail;
        triggerFlyAnimation(x, y, image);
      }
    };

    window.addEventListener("lollipop:fly-to-cart", handleFlyEvent);
    return () => {
      window.removeEventListener("lollipop:fly-to-cart", handleFlyEvent);
    };
  }, [triggerFlyAnimation]);

  // Hide on Admin, Cart, Checkout, Order, Track pages, or when the slide panel is open
  const HIDDEN_PREFIXES = [
    "/admin",
    "/cart",
    "/checkout",
    "/order",
    "/track-order",
    "/search-order",
  ];

  const isHiddenRoute = HIDDEN_PREFIXES.some(
    (prefix) => pathname === prefix || pathname?.startsWith(prefix)
  );

  if (isHiddenRoute || slidePanelOpen) return null;

  return (
    <>
      {/* Mobile Backdrop Overlay to dismiss on tap */}
      {(cartOpen || waOpen) && (
        <div
          className="fixed inset-0 bg-black/25 backdrop-blur-[1px] z-40 sm:hidden transition-opacity"
          onClick={() => {
            setCartOpen(false);
            setWaOpen(false);
          }}
          aria-hidden="true"
        />
      )}

      <div
        ref={containerRef}
        id="floating-actions-dock"
        className="fixed bottom-5 right-3.5 sm:right-6 sm:bottom-6 z-50 flex flex-col items-center gap-3.5 select-none pointer-events-auto"
      >
        {/* =========================================================================
            1. TOP BUTTON: PINK CANDY SHOPPING CART
            ========================================================================= */}
        <div className="relative group flex items-center justify-center">
          {/* Subtle Hover Tooltip on Desktop */}
          <span className="hidden md:block absolute right-[calc(100%+14px)] opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap bg-[#1C0D0A]/95 text-white text-xs font-bold py-1.5 px-3 rounded-full shadow-lg border border-[#E6C184]/40 z-30">
            Cart ({itemCount})
          </span>

          {/* Mini Cart Popup Drawer */}
          {cartOpen && (
            <div
              id="cart-floating-popup"
              className="fixed inset-x-3 bottom-24 sm:absolute sm:inset-x-auto sm:right-[calc(100%+16px)] sm:bottom-0 w-auto sm:w-96 max-w-sm sm:max-w-none mx-auto sm:mx-0 max-h-[75vh] flex flex-col bg-white rounded-2xl p-4 border border-[#E6C184] shadow-2xl z-50 transition-all duration-300"
              style={{
                boxShadow: "0 18px 45px rgba(42, 8, 44, 0.24), 0 0 25px rgba(212, 175, 55, 0.18)",
              }}
            >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#F1E6DF]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E91E63] animate-pulse" />
                <h3 className="font-display font-bold text-sm text-[#1C0D0A]">
                  Your Sweet Cart ({itemCount})
                </h3>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="w-7 h-7 rounded-full bg-[#FAF5EE] hover:bg-[#F1E6DF] text-[#5C524E] flex items-center justify-center transition-colors"
                aria-label="Close cart popup"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            {/* Empty State */}
            {items.length === 0 ? (
              <div className="py-8 text-center text-[#5C524E]">
                <span className="material-symbols-outlined text-4xl text-[#E6C184] mb-2 block animate-bounce">
                  shopping_bag
                </span>
                <p className="text-xs font-semibold">Your cart is currently empty.</p>
                <p className="text-[11px] text-[#A89F91] mt-1">
                  Discover our freshly baked delights!
                </p>
              </div>
            ) : (
              /* Items List */
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div
                    key={`${item.id}-${item.weight}-${item.eggPreference}`}
                    className="flex items-center gap-3 p-2 rounded-xl bg-[#FAF5EE]/70 border border-[#F1E6DF] hover:border-[#E6C184] transition-all"
                  >
                    {/* Item Image */}
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-white border border-[#F1E6DF] flex-shrink-0 flex items-center justify-center">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="material-symbols-outlined text-xl text-[#962854]">
                          cake
                        </span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-grow min-w-0">
                      <h4 className="text-xs font-bold text-[#1C0D0A] truncate">{item.name}</h4>
                      <div className="flex items-center gap-1.5 text-[10px] text-[#7A6B72]">
                        <span>{item.weight}</span>
                        {item.eggPreference && (
                          <span
                            className={`font-semibold ${
                              item.eggPreference === "eggless" ? "text-emerald-700" : "text-amber-700"
                            }`}
                          >
                            • {item.eggPreference === "eggless" ? "🌱 Eggless" : "🥚 Egg"}
                          </span>
                        )}
                        {item.offer && (
                          <span className="text-[#962854] font-bold truncate">
                            • 🎁 {item.offer}
                          </span>
                        )}
                      </div>
                      {item.cakeMessage && (
                        <p className="text-[10px] text-[#962854] italic truncate">
                          "{item.cakeMessage}"
                        </p>
                      )}
                      <p className="text-xs font-extrabold text-[#962854] mt-0.5">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-1 bg-white border border-[#E6C184] rounded-lg p-0.5">
                      <button
                        onClick={() => updateQuantity(item.id, item.weight, item.quantity - 1)}
                        className="w-5 h-5 flex items-center justify-center rounded hover:bg-[#FAF5EE] text-xs font-bold text-[#1C0D0A]"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="text-xs font-black px-1 min-w-[14px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.weight, item.quantity + 1)}
                        className="w-5 h-5 flex items-center justify-center rounded hover:bg-[#FAF5EE] text-xs font-bold text-[#1C0D0A]"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeItem(item.id, item.weight)}
                      className="text-[#A89F91] hover:text-red-500 transition-colors p-1"
                      aria-label="Remove item"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Footer Summary & Checkout Button */}
            {items.length > 0 && (
              <div className="pt-3 mt-3 border-t border-[#F1E6DF]">
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="font-semibold text-[#5C524E]">Subtotal:</span>
                  <span className="font-bold text-sm text-[#1C0D0A]">
                    ₹{summary.subtotal.toFixed(2)}
                  </span>
                </div>
                <Link
                  href="/cart"
                  onClick={() => setCartOpen(false)}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#962854] to-[#2A082C] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg transition-all active:scale-98"
                >
                  <span>View Full Cart &amp; Checkout</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Pink Candy Cart Button */}
        <button
          id="floating-candy-cart-btn"
          ref={cartBtnRef}
          suppressHydrationWarning
          onClick={() => {
            setCartOpen((prev) => !prev);
            setWaOpen(false);
          }}
          className="relative w-[58px] h-[58px] sm:w-[66px] sm:h-[66px] cursor-pointer transition-transform duration-200 active:scale-95 group focus:outline-none flex items-center justify-center"
          aria-label="View Cart"
        >
          {/* High-res Candy Cart PNG */}
          <img
            src="/images/floating-cart-candy.png"
            alt="Shopping Cart"
            className={`w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(233,30,99,0.35)] transition-transform duration-300 group-hover:scale-108 ${
              cartChomp ? "candy-cart-chomp" : "candy-float-a"
            }`}
          />

          {/* Red Circular Notification Badge with Item Count */}
          <span
            className={`candy-cart-badge ${badgeBouncing ? "candy-badge-pop" : ""}`}
            style={{
              top: "1px",
              right: "1px",
            }}
          >
            {itemCount}
          </span>
        </button>
      </div>

      {/* =========================================================================
          2. BOTTOM BUTTON: GREEN CANDY WHATSAPP
          ========================================================================= */}
      <div className="relative group flex items-center justify-center">
        {/* Subtle Hover Tooltip on Desktop */}
        <span className="hidden md:block absolute right-[calc(100%+14px)] opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap bg-[#1C0D0A]/95 text-white text-xs font-bold py-1.5 px-3 rounded-full shadow-lg border border-[#E6C184]/40 z-30">
          Chat &amp; Order
        </span>

        {/* WhatsApp Contacts Popup */}
        {waOpen && (
          <div
            id="wa-contact-popup"
            className="fixed inset-x-3 bottom-24 sm:absolute sm:inset-x-auto sm:right-[calc(100%+16px)] sm:bottom-0 w-auto sm:w-80 max-w-sm sm:max-w-none mx-auto sm:mx-0 bg-white rounded-2xl p-4 border border-[#E6C184] shadow-2xl z-50 transition-all duration-300"
            style={{
              boxShadow: "0 18px 45px rgba(27, 94, 32, 0.22), 0 0 25px rgba(212, 175, 55, 0.18)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-[#F1E6DF]">
              <h4 className="font-display font-bold text-xs text-[#1C0D0A] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-emerald-600 text-sm">chat</span>{" "}
                WhatsApp &amp; Mobile Support
              </h4>
              <button
                onClick={() => setWaOpen(false)}
                className="w-6 h-6 rounded-full bg-[#FAF5EE] hover:bg-[#F1E6DF] text-[#5C524E] flex items-center justify-center transition-colors"
                aria-label="Close WhatsApp support"
              >
                <span className="material-symbols-outlined text-xs">close</span>
              </button>
            </div>

            {/* Contacts list */}
            <div className="space-y-2">
              {CONTACTS.map((c) => (
                <a
                  key={c.phone}
                  href={`https://wa.me/${c.phone}?text=${encodeURIComponent(
                    "Hi! I want to place an order or inquire with Lollipop Cake Shop."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-emerald-50 border border-emerald-100/60 hover:border-emerald-300 transition-all group"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                    <span className="material-symbols-outlined text-sm">call</span>
                  </div>
                  <div className="flex-grow min-w-0">
                    <span className="block text-xs font-bold text-[#1C0D0A] group-hover:text-emerald-700 transition-colors truncate">
                      {c.name}
                    </span>
                    <span className="block text-[11px] text-[#5C524E] font-medium">{c.display}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Green Candy WhatsApp Button */}
        <button
          id="floating-candy-wa-btn"
          ref={waBtnRef}
          suppressHydrationWarning
          onClick={() => {
            setWaOpen((prev) => !prev);
            setCartOpen(false);
          }}
          className="relative w-[58px] h-[58px] sm:w-[66px] sm:h-[66px] cursor-pointer transition-transform duration-200 active:scale-95 group focus:outline-none flex items-center justify-center"
          aria-label="Order on WhatsApp"
        >
          {/* High-res Candy WhatsApp PNG */}
          <img
            src="/images/floating-whatsapp-candy.png"
            alt="WhatsApp Support"
            className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(37,211,102,0.35)] transition-transform duration-300 group-hover:scale-108 candy-float-b"
          />
        </button>
      </div>
    </div>
  </>
  );
}
