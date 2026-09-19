import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Custom Cake Studio",
  description: "Design your own custom cake — choose flavour, shape, size and message.",
};

const STEPS = [
  { icon: "cake", title: "Choose Your Cake", desc: "Pick a base flavour, shape and tier count." },
  { icon: "palette", title: "Customize Design", desc: "Select colours, toppers and a personal message." },
  { icon: "local_shipping", title: "We Deliver Fresh", desc: "Baked fresh and delivered on your chosen date." },
];

export default function CustomCakePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-14">
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#962854]">Custom Cake Studio</span>
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-[#1C0D0A] mt-2 mb-4">Design Your Dream Cake</h1>
        <p className="text-[#5C524E] max-w-2xl mx-auto leading-relaxed">
          Tell us your vision and our pastry chefs will bring it to life — perfect for
          birthdays, weddings, and every celebration in between.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-14">
        {STEPS.map((s, i) => (
          <div key={s.title} className="bg-white rounded-2xl border border-[#E6C184]/30 p-6 text-center relative">
            <span className="absolute top-3 right-4 text-3xl font-display font-bold text-[#F1E6DF]">{i + 1}</span>
            <span className="material-symbols-outlined text-3xl text-[#962854] mb-3 inline-block">{s.icon}</span>
            <h3 className="font-display font-bold text-lg text-[#1C0D0A] mb-2">{s.title}</h3>
            <p className="text-xs text-[#5C524E] leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#FAF3EC] rounded-3xl border border-[#E6C184]/40 p-8 sm:p-12 text-center">
        <p className="text-sm text-[#5C524E] mb-1">Custom cakes require at least <strong>24 hours</strong> notice.</p>
        <p className="text-sm text-[#5C524E] mb-6">Chat with our team on WhatsApp to start designing, or browse our ready-made collections.</p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="https://wa.me/919876543210?text=Hi!%20I%27d%20like%20to%20design%20a%20custom%20cake."
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-2 py-3.5 px-8 text-xs font-bold uppercase tracking-wider"
          >
            Start on WhatsApp
          </a>
          <Link href="/cakes" className="btn-secondary inline-flex items-center gap-2 py-3.5 px-7 text-xs font-bold uppercase tracking-wider">
            Browse Ready-Made Cakes
          </Link>
        </div>
      </div>
    </div>
  );
}
