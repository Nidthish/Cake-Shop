"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function RouteLoadingIndicator() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // When pathname or search params update, conclude the loading animation
  useEffect(() => {
    setProgress(100);
    const timer = setTimeout(() => {
      setLoading(false);
      setProgress(0);
    }, 250);
    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  // Intercept click on internal links to provide instant feedback
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;
      const href = target.getAttribute("href");
      if (
        href &&
        href.startsWith("/") &&
        !href.startsWith("/#") &&
        !href.startsWith("mailto:") &&
        !href.startsWith("tel:") &&
        target.target !== "_blank" &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.shiftKey &&
        !e.altKey
      ) {
        // Only trigger if navigating to a different page/url
        const currentUrl = window.location.pathname + window.location.search;
        if (href !== currentUrl) {
          setLoading(true);
          setProgress(25);
          setTimeout(() => setProgress((p) => (p === 25 ? 65 : p)), 120);
          setTimeout(() => setProgress((p) => (p === 65 ? 85 : p)), 300);
        }
      }
    };

    document.addEventListener("click", handleClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleClick, { capture: true });
    };
  }, []);

  if (!loading && progress === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none h-[3px] bg-transparent"
      aria-hidden="true"
    >
      <div
        className="h-full bg-gradient-to-r from-[#962854] via-[#D4AF37] to-[#962854] shadow-[0_0_10px_rgba(150,40,84,0.7),0_0_5px_rgba(212,175,55,0.8)] transition-all ease-out"
        style={{
          width: `${progress}%`,
          transitionDuration: progress === 100 ? "200ms" : "300ms",
          opacity: progress === 100 ? 0 : 1,
        }}
      />
    </div>
  );
}
