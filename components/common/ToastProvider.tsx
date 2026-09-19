"use client";

import { createContext, useCallback, useContext, useState } from "react";

interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "info";
}

interface ToastContextValue {
  showToast: (message: string, type?: Toast["type"]) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: Toast["type"] = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-20 sm:top-24 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl border font-body text-sm font-semibold animate-[toastIn_0.3s_ease-out] ${
              t.type === "success"
                ? "bg-[#1C0D0A] text-[#FFF9F5] border-[#E6C184]"
                : t.type === "error"
                ? "bg-[#962854] text-[#FFF9F5] border-[#E6C184]"
                : "bg-white text-[#1C0D0A] border-[#F1E6DF]"
            }`}
          >
            <span className="material-symbols-outlined text-base">
              {t.type === "success" ? "check_circle" : t.type === "error" ? "error" : "info"}
            </span>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}
