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
    document.body.style.overflow = drawerOpen || searchOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
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

  return (
    <>
      <header
        id="main-header"
        className="sticky top-0 z-50 w-full glass-header border-b border-[#E6C184]/20 transition-all duration-300"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex flex-col group">
            <span className="font-display font-bold text-2xl sm:text-[26px] text-[#1C0D0A] tracking-[0.03em] leading-tight group-hover:text-[#962854] transition-colors">
              Lollipop Cake Shop
            </span>
          </Link>

          <nav className="hidden lg:flex items-center space-x-5 text-[13px] uppercase tracking-wider font-semibold">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="nav-link text-[#5C524E] hover:text-[#1C0D0A] flex items-center gap-1"
              >
                {l.icon && <span className="material-symbols-outlined text-sm">{l.icon}</span>}
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              className="search-toggle-btn p-2 text-[#1C0D0A] hover:text-[#962854] hover:bg-[#FAF3EC] rounded-full transition-colors"
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
              suppressHydrationWarning
            >
              <span className="material-symbols-outlined text-2xl">search</span>
            </button>
            <Link
              href="/cart"
              className="relative p-2 text-[#1C0D0A] hover:text-[#962854] hover:bg-[#FAF3EC] rounded-full transition-colors"
              aria-label="Cart"
            >
              <span className="material-symbols-outlined text-2xl">shopping_bag</span>
              {itemCount > 0 && (
                <span className="cart-badge-count absolute top-0 right-0 bg-[#962854] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            <button
              className="mobile-menu-toggle lg:hidden p-2 text-[#1C0D0A] hover:bg-[#FAF3EC] rounded-full transition-colors"
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
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity ${
          drawerOpen ? "opacity-100" : "opacity-0 pointer-events-none hidden"
        }`}
        onClick={() => setDrawerOpen(false)}
      />
      <aside
        className={`fixed top-0 right-0 w-80 max-w-full h-full bg-[#FFF9F5] z-50 shadow-2xl flex flex-col justify-between p-6 overflow-y-auto transition-transform duration-300 ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div>
          <div className="flex items-center justify-between border-b border-[#E6C184]/30 pb-4 mb-6">
            <span className="font-display font-bold text-2xl text-[#1C0D0A] tracking-[0.03em] block">
              Lollipop Cake Shop
            </span>
            <button
              className="p-2 text-[#5C524E] hover:text-[#1C0D0A] rounded-full hover:bg-[#FAF3EC] transition-colors"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close menu"
              suppressHydrationWarning
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <nav className="flex flex-col space-y-1.5">
            {DRAWER_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setDrawerOpen(false)}
                className="p-3 rounded-xl hover:bg-[#FAF3EC] text-[#1C0D0A] flex items-center gap-2 font-semibold text-sm"
              >
                <span className="material-symbols-outlined text-base">{l.icon}</span>
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="border-t border-[#E6C184]/30 pt-4 mt-6">
          <Link
            href="/cart"
            onClick={() => setDrawerOpen(false)}
            className="w-full bg-[#2A082C] text-white py-3.5 rounded-xl flex items-center justify-center gap-2 font-bold text-sm shadow-md hover:bg-[#962854] transition-colors"
          >
            <span className="material-symbols-outlined text-base">shopping_bag</span> View Cart
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
