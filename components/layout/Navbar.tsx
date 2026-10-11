"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { PRODUCTS_DATA, getCardPrice } from "@/lib/products";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/cakes", label: "Cakes" },
  { href: "/dry-cakes", label: "Dry Cakes" },
  { href: "/custom-cake", label: "Custom Cake", icon: "auto_awesome" },
  { href: "/first-birthday", label: "1st Birthday" },
  { href: "/wedding-cakes", label: "Wedding" },
  { href: "/bento-cake", label: "Bento Cake" },
  { href: "/snacks", label: "Snacks" },
  { href: "/about", label: "About Us" },
];

const DRAWER_LINKS = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/cakes", label: "Cakes", icon: "cake" },
  { href: "/dry-cakes", label: "Dry Cakes", icon: "bakery_dining" },
  { href: "/custom-cake", label: "Custom Cake", icon: "auto_awesome" },
  { href: "/first-birthday", label: "1st Birthday", icon: "child_care" },
  { href: "/wedding-cakes", label: "Wedding Cakes", icon: "favorite" },
  { href: "/bento-cake", label: "Bento Cake", icon: "lunch_dining" },
  { href: "/snacks", label: "Snacks", icon: "cookie" },
  { href: "/track-order", label: "Track My Order", icon: "local_shipping" },
  { href: "/about", label: "About Us", icon: "info" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  useEffect(() => {
    const isPanelOpen = drawerOpen || searchOpen;
    document.body.style.overflow = isPanelOpen ? "hidden" : "";
    document.body.classList.toggle("slide-panel-open", isPanelOpen);
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("lollipop:slide-panel", {
          detail: { open: isPanelOpen },
        })
      );
    }
    return () => {
      document.body.style.overflow = "";
      document.body.classList.remove("slide-panel-open");
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("lollipop:slide-panel", {
            detail: { open: false },
          })
        );
      }
    };
  }, [drawerOpen, searchOpen]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return PRODUCTS_DATA.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.subCategory.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [query]);

  function goToProduct(id: string) {
    setSearchOpen(false);
    setQuery("");
    router.push(`/products/${id}`);
  }

  const isTrackActive =
    pathname === "/track-order" || pathname?.startsWith("/search-order");

  return (
    <>
      <header
        id="main-header"
        className="sticky top-0 z-50 w-full glass-header border-b border-[#E6C184]/20 transition-all duration-300"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-2 sm:gap-4">
          <Link href="/" className="flex flex-col group flex-shrink-0">
            <span className="font-display font-bold text-xl sm:text-2xl lg:text-[24px] text-[#1C0D0A] tracking-[0.02em] leading-tight group-hover:text-[#962854] transition-colors whitespace-nowrap">
              Lollipop Cake Shop
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-3 xl:gap-5 text-[12px] xl:text-[13px] uppercase tracking-wider font-semibold whitespace-nowrap">
            {NAV_LINKS.map((l) => {
              const isActive =
                l.href === "/"
                  ? pathname === "/"
                  : pathname === l.href || pathname?.startsWith(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`nav-link flex items-center gap-1 transition-colors whitespace-nowrap ${isActive
                      ? "active text-[#962854]"
                      : "text-[#5C524E] hover:text-[#1C0D0A]"
                    }`}
                >
                  {l.icon && (
                    <span className="material-symbols-outlined text-base xl:text-lg leading-none">
                      {l.icon}
                    </span>
                  )}
                  <span>{l.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
            <button
              className="search-toggle-btn p-2 text-[#1C0D0A] hover:text-[#962854] hover:bg-[#FAF3EC] rounded-full transition-colors flex items-center justify-center"
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
              suppressHydrationWarning
            >
              <span className="material-symbols-outlined text-2xl">search</span>
            </button>
            <Link
              href="/cart"
              className="relative p-2 text-[#1C0D0A] hover:text-[#962854] hover:bg-[#FAF3EC] rounded-full transition-colors flex items-center justify-center"
              aria-label="Cart"
              title="View Cart"
            >
              <span className="material-symbols-outlined text-2xl">shopping_bag</span>
              {itemCount > 0 && (
                <span className="cart-badge-count absolute top-0 right-0 bg-[#962854] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            <Link
              href="/track-order"
              className={`p-2 rounded-full transition-colors flex items-center justify-center ${isTrackActive
                  ? "text-[#962854] bg-[#FAF3EC]"
                  : "text-[#1C0D0A] hover:text-[#962854] hover:bg-[#FAF3EC]"
                }`}
              aria-label="Track My Order"
              title="Track My Order"
            >
              <span className="material-symbols-outlined text-2xl">local_shipping</span>
            </Link>
            <button
              className="mobile-menu-toggle lg:hidden p-2 text-[#1C0D0A] hover:bg-[#FAF3EC] rounded-full transition-colors flex items-center justify-center"
              aria-label="Open Menu"
              onClick={() => setDrawerOpen(true)}
              suppressHydrationWarning
            >
              <span className="material-symbols-outlined text-2xl">menu</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-[2px] z-50 transition-opacity duration-300 ${drawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        onClick={() => setDrawerOpen(false)}
      />
      
      {/* Responsive Mobile Drawer */}
      <aside
        className={`fixed top-0 right-0 w-[310px] xs:w-80 max-w-[88vw] h-[100dvh] max-h-[100dvh] bg-[#FFF9F5] z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-out ${drawerOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {/* Drawer Header (Pinned at top) */}
        <div className="flex-shrink-0 flex items-center justify-between border-b border-[#E6C184]/30 px-5 py-4 bg-[#FFF9F5]">
          <Link
            href="/"
            onClick={() => setDrawerOpen(false)}
            className="font-display font-bold text-xl sm:text-2xl text-[#1C0D0A] tracking-[0.02em] block hover:text-[#962854] transition-colors"
          >
            Lollipop Cake Shop
          </Link>
          <button
            className="p-1.5 text-[#5C524E] hover:text-[#1C0D0A] rounded-full hover:bg-[#FAF3EC] transition-colors cursor-pointer flex items-center justify-center"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu"
            suppressHydrationWarning
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {/* Drawer Scrollable Links Container */}
        <nav className="flex-1 min-h-0 overflow-y-auto px-3.5 py-3 space-y-1 overscroll-contain">
          {DRAWER_LINKS.map((l) => {
            const isActive =
              l.href === "/"
                ? pathname === "/"
                : pathname === l.href || pathname?.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setDrawerOpen(false)}
                className={`px-3 py-2.5 rounded-xl flex items-center gap-3 font-semibold text-sm transition-colors ${
                  isActive
                    ? "bg-[#962854]/10 text-[#962854] font-bold"
                    : "text-[#1C0D0A] hover:bg-[#FAF3EC] hover:text-[#962854]"
                }`}
              >
                <span
                  className={`material-symbols-outlined text-xl transition-colors ${
                    isActive ? "text-[#962854]" : "text-[#5C524E]"
                  }`}
                >
                  {l.icon}
                </span>
                <span>{l.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Drawer Footer (Pinned at bottom with safe-area spacing - View Cart Button) */}
        <div className="flex-shrink-0 border-t border-[#E6C184]/30 p-4 bg-[#FFF9F5] shadow-[0_-4px_16px_rgba(0,0,0,0.04)] pb-[max(1rem,env(safe-area-inset-bottom))]">
          <Link
            href="/cart"
            onClick={() => setDrawerOpen(false)}
            className="w-full bg-[#2A082C] text-white py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 font-bold text-sm shadow-md hover:bg-[#962854] active:scale-[0.98] transition-all"
          >
            <span className="material-symbols-outlined text-xl">shopping_bag</span>
            <span>View Cart</span>
            {itemCount > 0 && (
              <span className="ml-1 bg-[#E6C184] text-[#2A082C] text-xs font-extrabold px-2 py-0.5 rounded-full">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </aside>

      {/* Search Modal */}
      {searchOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm flex items-start justify-center pt-24 px-4"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="bg-[#FFF9F5] w-full max-w-2xl rounded-3xl p-6 shadow-2xl border border-[#E6C184]/40 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-[#E6C184]/30 pb-4">
              <span className="material-symbols-outlined text-2xl text-[#962854]">search</span>
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search Belgian Truffle, Bento Cakes, Pastries..."
                className="w-full bg-transparent text-base text-[#1C0D0A] font-medium focus:outline-none placeholder-[#5C524E]"
                suppressHydrationWarning
              />
              <button
                className="p-2 text-[#5C524E] hover:text-[#1C0D0A]"
                onClick={() => setSearchOpen(false)}
                aria-label="Close search"
                suppressHydrationWarning
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="mt-4 max-h-80 overflow-y-auto space-y-2">
              {query.trim().length < 2 ? (
                <p className="text-xs text-[#5C524E] text-center py-6 font-medium">
                  Start typing to search delicious cakes &amp; treats...
                </p>
              ) : results.length === 0 ? (
                <p className="text-xs text-[#5C524E] text-center py-6 font-medium">
                  No products found for &ldquo;{query}&rdquo;.
                </p>
              ) : (
                results.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => goToProduct(p.id)}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#FAF3EC] transition-colors text-left"
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#F1E6DF] flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-grow">
                      <p className="text-sm font-semibold text-[#1C0D0A] truncate">{p.name}</p>
                      <p className="text-xs text-[#5C524E]">₹{getCardPrice(p)}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
