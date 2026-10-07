export default function Loading() {
  return (
    <div
      className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-[#FFF9F5]/95 backdrop-blur-md px-4 transition-opacity duration-300"
      aria-label="Loading page content"
      role="status"
    >
      {/* Ambient warm glow behind cake */}
      <div className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-[#962854]/15 via-[#E6C184]/20 to-pink-200/25 blur-3xl pointer-events-none animate-pulse" />

      {/* Animated Patisserie Cake SVG */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 mb-5 animate-hero-float">
          <svg
            viewBox="0 0 120 120"
            className="w-full h-full drop-shadow-[0_12px_24px_rgba(150,40,84,0.18)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Cake Stand / Base */}
            <ellipse cx="60" cy="108" rx="42" ry="6" fill="#E6C184" fillOpacity="0.4" />
            <path
              d="M44 104 C44 98 76 98 76 104 L74 108 L46 108 Z"
              fill="#D4AF37"
              fillOpacity="0.6"
            />
            <ellipse cx="60" cy="98" rx="46" ry="5" fill="#FAF0E6" stroke="#E6C184" strokeWidth="1.5" />

            {/* Bottom Tier */}
            <rect x="22" y="70" width="76" height="26" rx="4" fill="#962854" />
            {/* Bottom Tier Frosting drips */}
            <path
              d="M22 74 Q 31 82 41 74 Q 50 84 60 74 Q 70 84 80 74 Q 89 82 98 74 L98 70 L22 70 Z"
              fill="#FAF3EC"
            />
            <ellipse cx="60" cy="70" rx="38" ry="4.5" fill="#FAF3EC" />

            {/* Middle Tier */}
            <rect x="32" y="46" width="56" height="23" rx="3" fill="#B86B35" />
            {/* Middle Frosting drips */}
            <path
              d="M32 50 Q 41 57 51 50 Q 60 58 70 50 Q 79 57 88 50 L88 46 L32 46 Z"
              fill="#FFF9F5"
            />
            <ellipse cx="60" cy="46" rx="28" ry="3.5" fill="#FFF9F5" />

            {/* Top Tier */}
            <rect x="42" y="28" width="36" height="17" rx="2.5" fill="#962854" />
            {/* Top Frosting drips */}
            <path
              d="M42 32 Q 51 38 60 32 Q 69 38 78 32 L78 28 L42 28 Z"
              fill="#FAF0EB"
            />
            <ellipse cx="60" cy="28" rx="18" ry="2.5" fill="#FAF0EB" />

            {/* Celebration Candle */}
            <rect x="58.5" y="14" width="3" height="13" rx="1.5" fill="#E6C184" stroke="#FAF0EB" strokeWidth="0.5" />

            {/* Flickering Flame */}
            <path
              d="M60 4 C57 9 56 12 60 14 C64 12 63 9 60 4 Z"
              fill="#FFB703"
              className="animate-pulse origin-bottom"
            />
            <ellipse cx="60" cy="11" rx="1.5" ry="2" fill="#FB8500" />

            {/* Ambient Sparkles */}
            <circle cx="20" cy="30" r="1.5" fill="#E6C184" className="animate-ping" style={{ animationDuration: "2s" }} />
            <circle cx="100" cy="38" r="1.5" fill="#962854" className="animate-ping" style={{ animationDuration: "2.4s" }} />
            <circle cx="94" cy="80" r="1.2" fill="#E6C184" className="animate-ping" style={{ animationDuration: "1.8s" }} />
          </svg>
        </div>

        {/* Brand Text */}
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#1C0D0A] tracking-tight text-center">
          Lollipop Cake Shop
        </h2>
        <p className="text-xs sm:text-sm text-[#5C524E] mt-1.5 font-medium tracking-wide text-center">
          Baking fresh moments for your celebration…
        </p>

        {/* Shimmer Progress Bar */}
        <div className="w-48 sm:w-56 h-1.5 bg-[#E6C184]/30 rounded-full overflow-hidden mt-5 relative">
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#962854] via-[#E6C184] to-[#962854] rounded-full animate-[shimmerMove_1.4s_infinite_linear]" />
        </div>
      </div>
    </div>
  );
}
