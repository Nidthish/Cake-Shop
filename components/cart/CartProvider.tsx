"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CartItem, CartSummary } from "@/types";

const STORAGE_KEY = "lollipop_cart";
const SGST_RATE = 0.025;
const CGST_RATE = 0.025;

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  summary: CartSummary;
  addItem: (item: CartItem) => void;
  removeItem: (id: string, weight: string) => void;
  updateQuantity: (id: string, weight: string, quantity: number) => void;
  clearCart: () => void;
  isHydrated: boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

function lineKey(id: string, weight: string) {
  return `${id}__${weight}`;
}

function computeSummary(items: CartItem[]): CartSummary {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const sgst = Math.round(subtotal * SGST_RATE);
  const cgst = Math.round(subtotal * CGST_RATE);
  const tax = sgst + cgst;
  const deliveryFee = 0;
  const total = Math.round(subtotal + tax + deliveryFee);
  return { subtotal, sgst, cgst, tax, deliveryFee, total };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage once on mount (client only).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore corrupted storage
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Persist on every change, after hydration.
  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent("lollipop:cart-updated"));
  }, [items, isHydrated]);

  const addItem = useCallback((newItem: CartItem) => {
    setItems((prev) => {
      const key = lineKey(newItem.id, newItem.weight);
      const existingIdx = prev.findIndex((i) => lineKey(i.id, i.weight) === key);
      if (existingIdx >= 0) {
        const next = [...prev];
        next[existingIdx] = {
          ...next[existingIdx],
          quantity: next[existingIdx].quantity + newItem.quantity,
        };
        return next;
      }
      return [...prev, newItem];
    });
  }, []);

  const removeItem = useCallback((id: string, weight: string) => {
    setItems((prev) => prev.filter((i) => lineKey(i.id, i.weight) !== lineKey(id, weight)));
  }, []);

  const updateQuantity = useCallback((id: string, weight: string, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((i) => lineKey(i.id, i.weight) !== lineKey(id, weight));
      }
      return prev.map((i) =>
        lineKey(i.id, i.weight) === lineKey(id, weight)
          ? { ...i, quantity: Math.min(quantity, 20) }
          : i
      );
    });
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  // Expose global window.CartManager for compatibility
  useEffect(() => {
    if (typeof window === "undefined") return;

    (window as unknown as { CartManager: Record<string, unknown> }).CartManager = {
      STORAGE_KEY,
      getCart: () => {
        try {
          return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        } catch {
          return [];
        }
      },
      saveCart: (cart: CartItem[]) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
        setItems(cart);
      },
      addItem: (p: { id: string; name: string; price: number; image: string; weight?: string; quantity?: number }) => {
        addItem({
          id: p.id,
          name: p.name,
          price: Number(p.price),
          image: p.image,
          weight: p.weight || "500g",
          quantity: p.quantity || 1,
        });
      },
      updateQuantity: (id: string, weight: string, newQty: number) => {
        updateQuantity(id, weight, newQty);
      },
      removeItem: (id: string, weight: string) => {
        removeItem(id, weight);
      },
      clearCart: () => {
        clearCart();
      },
      getSummary: () => computeSummary(items),
    };
  }, [addItem, clearCart, items, removeItem, updateQuantity]);

  const itemCount = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );
  const summary = useMemo(() => computeSummary(items), [items]);

  const value: CartContextValue = {
    items,
    itemCount,
    summary,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isHydrated,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
