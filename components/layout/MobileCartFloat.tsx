"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/components/cart/CartProvider";

export default function MobileCartFloat() {
  const pathname = usePathname();
  const { items, itemCount, summary, updateQuantity, removeItem } = useCart();
  const [open, setOpen] = useState(false);
  const [isImpact, setIsImpact] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const floatBtnRef = useRef<HTMLButtonElement | null>(null);

  // Close popup when navigating
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Flying Item Animation Engine
  const triggerFlyAnimation = useCallback(
    (startX: number, startY: number, imageUrl?: string) => {
      if (typeof window === "undefined") return;

      const targetBtn = floatBtnRef.current || document.getElementById("mobile-cart-float-btn");
      if (!targetBtn) return;

      const targetRect = targetBtn.getBoundingClientRect();
      const targetX = targetRect.left + targetRect.width / 2;
      const targetY = targetRect.top + targetRect.height / 2;

      // Create flying clone node
      const flyer = document.createElement("div");
      flyer.className = "cart-flying-particle";
      flyer.style.position = "fixed";
      flyer.style.left = "0px";
      flyer.style.top = "0px";
      flyer.style.zIndex = "9999";
      flyer.style.pointerEvents = "none";
      flyer.style.willChange = "transform, opacity";

      // Inner element with image or cake badge
      const inner = document.createElement("div");
      inner.style.width = "48px";
      inner.style.height = "48px";
      inner.style.borderRadius = "9999px";
      inner.style.overflow = "hidden";
      inner.style.border = "2.5px solid #D4AF37";
      inner.style.boxShadow = "0 8px 24px rgba(150, 40, 84, 0.45), 0 0 15px rgba(212, 175, 55, 0.6)";
      inner.style.backgroundColor = "#FAF3EC";
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
        inner.appendChild(img);
      } else {
        const icon = document.createElement("span");
        icon.className = "material-symbols-outlined";
        icon.innerText = "cake";
        icon.style.color = "#962854";
        icon.style.fontSize = "26px";
        inner.appendChild(icon);
      }

      flyer.appendChild(inner);
      document.body.appendChild(flyer);

      // Quadratic curve / arc calculation
      const midX = startX + (targetX - startX) * 0.45;
      const midY = Math.min(startY, targetY) - 80; // arc upwards

      // Keyframes
      const keyframes = [
        {
          transform: `translate3d(${startX - 24}px, ${startY - 24}px, 0) scale(1) rotate(0deg)`,
          opacity: 1,
        },
        {
          transform: `translate3d(${midX - 24}px, ${midY - 24}px, 0) scale(1.25) rotate(25deg)`,
          opacity: 0.95,
          offset: 0.45,
        },
        {
          transform: `translate3d(${targetX - 24}px, ${targetY - 24}px, 0) scale(0.2) rotate(160deg)`,
          opacity: 0.2,
        },
      ];

      const animation = flyer.animate(keyframes, {
        duration: 720,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
      });

      animation.onfinish = () => {
        flyer.remove();

        // Trigger impact bounce on the floating cart button
        setIsImpact(true);
        setTimeout(() => setIsImpact(false), 600);
      };
    },
    []
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

  if (pathname?.startsWith("/admin")) return null;

  const show = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    setOpen(true);
  };

  const scheduleHide = () => {
    hideTimer.current = setTimeout(() => setOpen(false), 300);
  };

  return (
    <div
      className="mobile-cart-float-container fixed z-40 transition-all duration-300"
      style={{
        bottom: "6.2rem", // Floats directly above WhatsApp button
        right: "1.5rem",
      }}
      onMouseLeave={scheduleHide}
      onMouseEnter={show}
    >
      {/* Floating Mini Cart Popup */}
      {open && (
        <div
          id="cart-floating-popup"
          className="absolute bottom-20 right-0 w-[calc(100vw-3rem)] max-w-sm bg-white rounded-2xl p-4 border border-[#E6C184] shadow-2xl z-50 transition-all duration-300"
          style={{
            boxShadow: "0 14px 40px rgba(42, 8, 44, 0.22), 0 0 20px rgba(212, 175, 55, 0.15)",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#F1E6DF]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#FAF0F2] flex items-center justify-center text-[#962854]">
                <span className="material-symbols-outlined text-base">shopping_bag</span>
              </div>
              <div>
                <h4 className="font-display font-bold text-sm text-[#1C0D0A] leading-tight">
                  Your Cart
                </h4>
                <p className="text-[11px] text-[#5C524E]">
                  {itemCount} {itemCount === 1 ? "item" : "items"} selected
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded-full text-[#5C524E] hover:text-[#1C0D0A] hover:bg-[#FAF3EC] transition-colors"
              aria-label="Close cart popup"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          {/* Cart Items List */}
          {items.length === 0 ? (
            <div className="py-6 text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#FAF3EC] text-[#962854] flex items-center justify-center mb-2">
                <span className="material-symbols-outlined text-2xl">shopping_basket</span>
              </div>
              <p className="text-xs font-bold text-[#1C0D0A] mb-1">Your cart is empty</p>
              <p className="text-[11px] text-[#7A6B72]">Explore our artisanal cakes & treats!</p>
            </div>
          ) : (
            <div className="max-h-60 overflow-y-auto space-y-2.5 pr-1 divide-y divide-[#FAF3EC]">
              {items.map((item) => (
                <div
                  key={`${item.id}__${item.weight}`}
                  className="pt-2 first:pt-0 flex items-center gap-2.5 group"
                >
                  {/* Thumbnail */}
                  <div className="w-12 h-12 rounded-xl bg-[#FAF5F0] overflow-hidden border border-[#E6C184]/30 flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image || "/images/hero_cake.png"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/images/hero_cake.png";
                      }}
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-grow min-w-0">
                    <p className="text-xs font-bold text-[#1C0D0A] truncate leading-tight mb-0.5">
                      {item.name}
                    </p>
                    <div className="flex items-center gap-1.5 text-[10.5px] text-[#7A6B72]">
                      <span className="font-semibold text-[#962854]">{item.weight}</span>
                      {item.eggPreference && (
                        <span>• {item.eggPreference === "eggless" ? "🌱 Eggless" : "🥚 Egg"}</span>
                      )}
                    </div>
                    <p className="text-xs font-extrabold text-[#962854] mt-0.5">
                      ₹{item.price * item.quantity}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center border border-[#E6C184]/40 rounded-lg overflow-hidden flex-shrink-0 bg-[#FFFDF8]">
                    <button
                      onClick={() => updateQuantity(item.id, item.weight, item.quantity - 1)}
                      className="w-6 h-6 flex items-center justify-center text-xs font-bold text-[#1C0D0A] hover:bg-[#FAF3EC]"
                      aria-label="Decrease"
                    >
                      −
                    </button>
                    <span className="w-5 text-center text-[11px] font-bold text-[#1C0D0A]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.weight, item.quantity + 1)}
                      className="w-6 h-6 flex items-center justify-center text-xs font-bold text-[#1C0D0A] hover:bg-[#FAF3EC]"
                      aria-label="Increase"
                    >
                      +
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.id, item.weight)}
                    className="p-1 text-stone-400 hover:text-rose-600 transition-colors flex-shrink-0"
                    title="Remove item"
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
                onClick={() => setOpen(false)}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#962854] to-[#2A082C] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg transition-all active:scale-98"
              >
                <span>View Full Cart &amp; Checkout</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Floating Action Button (Matches WhatsApp float button styling & scale) */}
      <button
        id="mobile-cart-float-btn"
        ref={floatBtnRef}
        suppressHydrationWarning
        className={`mobile-cart-float-btn relative group cursor-pointer transition-all duration-300 ${
          isImpact ? "cart-impact-active" : ""
        }`}
        aria-label="View Cart"
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "3.8rem",
          height: "3.8rem",
          borderRadius: "9999px",
          background: "linear-gradient(135deg, #962854 0%, #2A082C 100%)",
          border: "2.5px solid #E6C184",
          boxShadow: "0 10px 25px rgba(150, 40, 84, 0.45)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Decorative Golden Glaze Drip Overlay */}
        <svg
          className="absolute top-0 left-0 w-full h-[45%] pointer-events-none z-[5]"
          viewBox="0 0 100 45"
          preserveAspectRatio="none"
          style={{
            borderTopLeftRadius: "9999px",
            borderTopRightRadius: "9999px",
            overflow: "hidden",
          }}
        >
          <path d="M0 0 C15 30 30 10 50 35 C70 15 85 30 100 0 Z" fill="#D4AF37" />
        </svg>

        {/* Pulse ring when items are present */}
        {itemCount > 0 && <span className="cart-pulse-ring" />}

        {/* Cart Icon */}
        <span className="material-symbols-outlined text-[26px] text-white relative z-10">
          shopping_bag
        </span>

        {/* Item Count Badge */}
        {itemCount > 0 && (
          <span
            className="absolute -top-1 -right-1 z-20 bg-[#D4AF37] text-[#1C0D0A] font-black text-[11px] min-w-[22px] h-[22px] rounded-full flex items-center justify-center border-2 border-white shadow-md px-1 animate-bounce"
            style={{ animationIterationCount: isImpact ? 3 : 1 }}
          >
            {itemCount}
          </span>
        )}
      </button>

      {/* Tooltip */}
      <span className="cart-tooltip hidden md:block">Cart ({itemCount})</span>
    </div>
  );
}
