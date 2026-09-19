"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application runtime error:", error);
  }, [error]);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
      <span className="material-symbols-outlined text-6xl text-[#962854] mb-4 inline-block">
        warning
      </span>
      <h1 className="font-display font-bold text-3xl sm:text-4xl text-[#1C0D0A] mb-3">
        Something went wrong
      </h1>
      <p className="text-[#5C524E] mb-8 text-sm sm:text-base">
        We encountered an unexpected issue while loading this page. Please try refreshing or return to the homepage.
      </p>
      <div className="flex items-center justify-center gap-4 flex-wrap">
        <button
          type="button"
          onClick={() => reset()}
          className="btn-primary inline-flex items-center gap-2 py-3 px-6 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm hover:shadow-md transition-all"
        >
          <span className="material-symbols-outlined text-sm">refresh</span> Try Again
        </button>
        <Link
          href="/"
          className="bg-[#FAF3EC] text-[#1C0D0A] hover:bg-[#FAF0F2] border border-[#D8C3B3] inline-flex items-center gap-2 py-3 px-6 text-xs font-bold uppercase tracking-wider rounded-full transition-all"
        >
          <span className="material-symbols-outlined text-sm">home</span> Back to Home
        </Link>
      </div>
    </div>
  );
}
