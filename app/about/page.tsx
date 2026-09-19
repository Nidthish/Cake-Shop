import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us - Lollipop Cake Shop",
  description:
    "Learn about Lollipop Cake Shop's artisanal bakery process, organic ingredients, and frequently asked questions.",
};

export default function AboutPage() {
  return (
    <>
      <section className="bg-gradient-to-r from-[#FFF9F5] via-[#FAF3EC] to-[#FAF0F2] py-16 text-center border-b border-[#E6C184]/20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 text-center max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FAF0F2] border border-[#962854]/30 mb-3 font-sans">
            <span className="w-2 h-2 rounded-full bg-[#962854]" />
            <span className="text-xs font-bold text-[#962854] uppercase tracking-wider">
              ✨ Artisanal French Bakery
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1C0D0A] mt-1 leading-tight tracking-tight">
            Made for Moments. Baked for Memories.
          </h1>
          <p className="text-base sm:text-lg text-[#4A3E39] mt-3 leading-relaxed font-sans font-normal">
            Founded with a passion for French patisserie techniques and pure organic ingredients, Lollipop Cake Shop crafts unforgettable cakes for life&apos;s sweetest milestones.
          </p>
        </div>
      </section>

      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <h2 className="font-display text-3xl font-bold text-[#1C0D0A]">
              Artisanal Baking Excellence
            </h2>
            <p className="text-base text-[#4A3E39] leading-relaxed font-sans font-normal">
              We believe that a cake is not just a dessert—it is the centerpiece of your most cherished celebrations. Every morning, our master pastry chefs select rich dark cocoa, fresh creamery butter, and handpicked organic berries to create rich, decadent sponges.
            </p>
            <p className="text-base text-[#4A3E39] leading-relaxed font-sans font-normal">
              Whether it&apos;s a 1st birthday smash cake, a grand 3-tier wedding centerpiece, or a cute Korean bento box cake, we bake with zero compromise on fluffiness and luxury.
            </p>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-xl border border-[#F1E6DF]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1000&auto=format&fit=crop"
              alt="Bakery Studio"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="font-display text-3xl font-bold text-[#1C0D0A] text-center">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-[#F1E6DF] space-y-2 shadow-sm">
              <h3 className="font-display font-bold text-lg text-[#1C0D0A]">
                Are your cakes fresh daily?
              </h3>
              <p className="text-xs text-[#4A3E39] font-sans font-normal leading-relaxed">
                Yes! 100% of our products across signature cakes, bento boxes, wedding tiers, and French pastries are freshly baked each morning with organic ingredients.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-[#F1E6DF] space-y-2 shadow-sm">
              <h3 className="font-display font-bold text-lg text-[#1C0D0A]">
                How fast is doorstep delivery?
              </h3>
              <p className="text-xs text-[#4A3E39] font-sans font-normal leading-relaxed">
                We offer same-day express delivery within 2 hours in Mumbai &amp; Pune for orders placed before 4 PM.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-[#F1E6DF] space-y-2 shadow-sm">
              <h3 className="font-display font-bold text-lg text-[#1C0D0A]">
                Can I customize a cake design?
              </h3>
              <p className="text-xs text-[#4A3E39] font-sans font-normal leading-relaxed">
                Absolutely! Use our{" "}
                <Link href="/custom-cake" className="text-[#962854] font-bold underline">
                  Custom Cake Studio
                </Link>{" "}
                to upload your reference picture and details.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-[#F1E6DF] space-y-2 shadow-sm">
              <h3 className="font-display font-bold text-lg text-[#1C0D0A]">
                What payment methods do you accept?
              </h3>
              <p className="text-xs text-[#4A3E39] font-sans font-normal leading-relaxed">
                We accept UPI (GPay, PhonePe, Paytm), QR code, Credit/Debit cards, and Net Banking via Razorpay secure checkout.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
