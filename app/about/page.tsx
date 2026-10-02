import type { Metadata } from "next";
import Link from "next/link";
import BranchSection from "@/components/about/BranchSection";

export const metadata: Metadata = {
  title: "About Us - Lollipop The Cake Shop, Trichy",
  description:
    "Since 2019, Lollipop The Cake Shop has been making good-quality cakes affordable for Trichy. Our story, our two branches and our Times of India feature.",
};

const TOI_ARTICLE_URL = "https://timesofindia.indiatimes.com/city/trichy/home-bakers-in-trichy-see-rising-demand-for-custom-cakes/amp_articleshow/116636146.cms";

const FAQS = [
  {
    q: "Are your cakes fresh?",
    a: "Yes. Our cakes are prepared with careful attention to freshness, flavour and presentation, and custom orders are baked after you place them.",
  },
  {
    q: "Can I customise a cake design at Lollipop The Cake Shop?",
    a: "Yes, you can order a customised cake from Lollipop The Cake Shop! Use our Custom Cake Studio to upload your reference picture and share the details.",
    linkText: "Custom Cake Studio",
    linkUrl: "/custom-cake",
  },
  {
    q: "Does Lollipop The Cake Shop in Trichy provide vegan cakes?",
    a: "You can get in touch with Lollipop The Cake Shop during our working hours (Monday to Sunday, 8:00 AM – 10:00 PM) to check for custom vegan cake availability.",
  },
  {
    q: "How are cakes stored in shops?",
    a: "The cakes in the shops are stored in temperature-controlled refrigerators for them to last longer and taste good.",
  },
  {
    q: "Where are you located in Trichy?",
    a: "We have two branches in Trichy (Branch 1: Sanjeevi Nagar & Branch 2: Andar Veedhi). See the map above for complete addresses and directions.",
    linkText: "map above",
    linkUrl: "#branches",
  },
  {
    q: "How can I contact Lollipop The Cake Shop for enquiries?",
    a: "You can contact Lollipop The Cake Shop directly at +91 96558 88829 or through the contact details available above for all enquiries.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept UPI (GPay, PhonePe, Paytm), QR code, credit/debit cards, and net banking via Razorpay secure checkout.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-[#FFF9F5] text-[#1C0D0A] min-h-screen">
      {/* ───────────────────────────────────────────────────────────────
         1. HERO SECTION
         ─────────────────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-r from-[#FFF9F5] via-[#FAF3EC] to-[#FAF0F2] py-14 sm:py-20 border-b border-[#E6C184]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF0F2] border border-[#962854]/30 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#962854] animate-pulse" />
              <span className="text-xs font-extrabold text-[#962854] uppercase tracking-wider">
                Our story • Trichy • Since 2019
              </span>
            </div>

            <h1 className="font-display font-bold text-4xl sm:text-6xl lg:text-7xl text-[#1C0D0A] leading-[1.05] tracking-tight">
              Everyone deserves a <span className="text-[#962854] italic font-semibold">good cake.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#4A3E39] font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
              In 2019, Lollipop began with a simple dream: to make good-quality cakes affordable for everyone. Birthdays, surprises, or just a slice on a Tuesday shouldn&apos;t come with a heavy price tag.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href="#branches"
                className="btn-primary py-3.5 px-7 text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg"
              >
                <span>📍 Find our branches</span>
              </a>
              <Link
                href="/custom-cake"
                className="btn-secondary py-3.5 px-7 text-xs font-bold uppercase tracking-wider flex items-center gap-2"
              >
                <span className="text-[#962854]">✨</span>
                <span>Design a custom cake</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md aspect-square rounded-3xl overflow-hidden border border-[#F1E6DF] shadow-2xl bg-white relative group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/about/image%20copy.png"
                alt="Lollipop The Cake Shop storefront in Trichy, lit with festive string lights at night"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C0D0A]/60 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-4 left-4 right-4 text-white text-xs font-bold bg-[#1C0D0A]/70 backdrop-blur-md p-3 rounded-xl border border-white/20">
               Lollipop The Cake Shop • Trichy
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────
         2. STORY SECTION
         ─────────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7 space-y-6 text-[#4A3E39] text-base leading-relaxed">
            <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-[#1C0D0A]">
              It started with a simple thought.
            </h2>
            <p>
              We believed that celebrating a birthday, surprising someone you love, or simply enjoying a slice of cake shouldn&apos;t come with a heavy price tag. So we started creating cakes with one thing in mind: to make people feel good.
            </p>
            <p>
              From the taste of the first bite to the moment the cake reaches the celebration, we wanted every part of the experience to feel special, comfortable and worth remembering.
            </p>
            <p>
              Over the years, Lollipop has grown alongside the people of Trichy, becoming part of birthdays, anniversaries, family celebrations, surprises and countless little moments of happiness. The reason we started hasn&apos;t changed.
            </p>

            <div className="p-6 rounded-2xl bg-[#FAF3EC] border border-[#E6C184]/50 my-6">
              <p className="font-display font-semibold text-2xl sm:text-3xl text-[#962854] leading-snug">
                Good taste. Fresh cakes. Happy customers.
              </p>
            </div>

            <p>
              We care about how the cake tastes, how it looks, how fresh it is, how comfortably you can order it, and most importantly, how you feel when you share it with the people you love.
            </p>
          </div>

          <aside className="lg:col-span-5 sticky top-28 bg-white border border-[#F1E6DF] p-8 rounded-3xl shadow-xl space-y-6 border-l-4 border-l-[#962854]">
            <p className="font-display font-semibold text-2xl sm:text-3xl text-[#1C0D0A] leading-tight">
              &ldquo;Because a cake is never just a cake.&rdquo;
            </p>
            <ul className="space-y-3 font-display text-xl sm:text-2xl text-[#962854] font-medium">
              <li className="flex items-center gap-2">
                <span>🎂</span> <span>It&apos;s a birthday wish.</span>
              </li>
              <li className="flex items-center gap-2">
                <span>🎁</span> <span>It&apos;s a surprise.</span>
              </li>
              <li className="flex items-center gap-2">
                <span>👨‍👩‍👧‍👦</span> <span>It&apos;s a family gathering.</span>
              </li>
              <li className="flex items-center gap-2">
                <span>🎉</span> <span>It&apos;s a celebration.</span>
              </li>
              <li className="flex items-center gap-2">
                <span>❤️</span> <span>It&apos;s a memory.</span>
              </li>
            </ul>
            <p className="text-xs sm:text-sm text-[#5C524E] font-medium pt-4 border-t border-[#F1E6DF]">
              And we&apos;re happy to be a small part of it. ❤️
            </p>
          </aside>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────
         3. PHOTOS STRIP SECTION
         ─────────────────────────────────────────────────────────────── */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-6">
          <figure className="md:col-span-7 relative rounded-3xl overflow-hidden border border-[#F1E6DF] shadow-md h-72 sm:h-96 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/about/image%20copy%202.png"
              alt="Display counter with cakes, pastries and fondant cake posters at Lollipop"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <figcaption className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-[#1C0D0A] shadow-md">
              Fresh cakes and bakes, daily
            </figcaption>
          </figure>

          <figure className="md:col-span-5 relative rounded-3xl overflow-hidden border border-[#F1E6DF] shadow-md h-72 sm:h-96 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/about/image%20copy%203.png"
              alt="Seating area inside Lollipop with colourful chairs and framed custom cake photos"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <figcaption className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-[#1C0D0A] shadow-md">
              Sit, taste, celebrate
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────
         4. PROMISE + FOCUS BAND SECTION
         ─────────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-[#FAF3EC] border-y border-[#E6C184]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Promise Column */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#1C0D0A]">
              Our promise
            </h2>
            <div className="space-y-4 pt-4 border-t border-[#E6C184]/60">
              {[
                "Taste that makes you come back.",
                "Freshness you can feel.",
                "Prices that make celebrations easier.",
                "Service that puts you first.",
                "Cakes made to make you feel good.",
              ].map((item, idx) => (
                <p
                  key={idx}
                  className="font-display text-xl sm:text-2xl text-[#1C0D0A] font-semibold py-3 border-b border-[#E6C184]/40 flex items-center gap-3"
                >
                  <span className="text-[#962854] text-base">✦</span>
                  <span>{item}</span>
                </p>
              ))}
            </div>
          </div>

          {/* Focus Column */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#1C0D0A]">
              What we focus on
            </h2>
            <p className="text-sm sm:text-base text-[#4A3E39] leading-relaxed">
              Whether it&apos;s a birthday cake in Trichy, a customised cake for a special occasion, an anniversary cake, or something sweet for the family, every celebration is different. These five things stay the same.
            </p>

            <div className="space-y-4 pt-4">
              {[
                {
                  emoji: "🍰",
                  title: "Great taste",
                  desc: "Cakes that are made to be enjoyed, not just admired.",
                },
                {
                  emoji: "❤️",
                  title: "Customer satisfaction",
                  desc: "Your happiness is at the centre of every order.",
                },
                {
                  emoji: "✨",
                  title: "Freshness and quality",
                  desc: "Careful preparation with attention to freshness, flavour and presentation.",
                },
                {
                  emoji: "🤍",
                  title: "Comfort and convenience",
                  desc: "A smooth experience from choosing your cake to receiving it.",
                },
                {
                  emoji: "💰",
                  title: "Affordable cakes",
                  desc: "Our journey began with a simple goal: making good cakes accessible at prices people can feel good about.",
                },
              ].map((f, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white border border-[#F1E6DF] shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow"
                >
                  <span className="text-2xl sm:text-3xl p-2 rounded-xl bg-[#FAF3EC] flex-shrink-0">
                    {f.emoji}
                  </span>
                  <div>
                    <h3 className="font-bold text-base sm:text-lg text-[#1C0D0A]">
                      {f.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#4A3E39] mt-0.5 leading-relaxed">
                      {f.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────
         5. JOURNEY SECTION
         ─────────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-[#1C0D0A] text-center mb-12">
            Our journey
          </h2>

          <div className="relative pl-8 border-l-2 border-gradient-to-b from-[#962854] to-[#E6C184] space-y-10">
            <div className="relative">
              <span className="absolute -left-[41px] top-1.5 w-4 h-4 rounded-full bg-[#962854] border-4 border-[#FFF9F5] shadow-md ring-2 ring-[#962854]" />
              <h3 className="font-display font-bold text-2xl text-[#962854]">
                2019: The beginning
              </h3>
              <p className="text-sm sm:text-base text-[#4A3E39] mt-1 leading-relaxed">
                Lollipop started with a simple goal: to provide good cakes at an affordable price.
              </p>
            </div>

            <div className="relative">
              <span className="absolute -left-[41px] top-1.5 w-4 h-4 rounded-full bg-[#962854] border-4 border-[#FFF9F5] shadow-md ring-2 ring-[#962854]" />
              <h3 className="font-display font-bold text-2xl text-[#962854]">
                Growing with Trichy
              </h3>
              <p className="text-sm sm:text-base text-[#4A3E39] mt-1 leading-relaxed">
                With the support of our customers, Lollipop became part of more birthdays, celebrations, family moments and special occasions.
              </p>
            </div>

            <div className="relative">
              <span className="absolute -left-[41px] top-1.5 w-4 h-4 rounded-full bg-[#E6C184] border-4 border-[#FFF9F5] shadow-md ring-2 ring-[#E6C184]" />
              <h3 className="font-display font-bold text-2xl text-[#962854]">
                Today: two branches
              </h3>
              <p className="text-sm sm:text-base text-[#4A3E39] mt-1 leading-relaxed">
                We continue to create cakes and sweet treats with the same purpose we started with: good taste, freshness, affordability and happy customers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────
         6. BRANCHES + MAP SECTION
         ─────────────────────────────────────────────────────────────── */}
      <BranchSection />

      {/* ───────────────────────────────────────────────────────────────
         7. TIMES OF INDIA FEATURE SECTION
         ─────────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF3EC] border border-[#E6C184] text-xs font-bold text-[#1C0D0A]">
              <span>📰 Media Feature</span>
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-5xl text-[#1C0D0A] leading-tight">
              As featured in The Times of India
            </h2>
            <p className="text-sm sm:text-base text-[#4A3E39] leading-relaxed">
              Lollipop Cakes was featured in a Times of India article on the growing demand for custom cakes in Trichy. It mentions our proprietor, Rockfort Inba, speaking about freshly prepared, order-based cakes and the rising interest in customised cakes and baked treats.
            </p>

            <div className="p-6 rounded-2xl bg-white border-l-4 border-l-[#962854] border border-[#F1E6DF] shadow-md my-4">
              <p className="font-display font-bold text-xl sm:text-2xl text-[#1C0D0A] leading-snug">
                &ldquo;Home bakers in Trichy see rising demand for custom cakes&rdquo;
              </p>
              <span className="text-xs text-[#5C524E] font-bold block mt-2">
                The Times of India • Trichy • December 24, 2024
              </span>
            </div>

            <a
              href={TOI_ARTICLE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center gap-2 py-3.5 px-7 text-xs font-bold uppercase tracking-wider shadow-lg"
            >
              <span>Read the article ↗</span>
            </a>
          </div>

          <div className="lg:col-span-6">
            <a
              href={TOI_ARTICLE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-3xl overflow-hidden border border-[#F1E6DF] shadow-2xl bg-white group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/about/timesofindia.png"
                alt="Times of India article headline: Home Bakers In Trichy See Rising Demand For Custom Cakes, dated Dec 24, 2024"
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="p-4 bg-[#1C0D0A] text-white flex items-center justify-between text-xs font-bold">
                <span>The Times of India Coverage</span>
                <span className="text-[#E6C184] flex items-center gap-1">
                  View Clipping <span className="material-symbols-outlined text-sm">east</span>
                </span>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────
         8. CLOSING SECTION
         ─────────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-gradient-to-r from-[#FAF3EC] via-[#FAF0F2] to-[#FAF3EC] text-center border-y border-[#E6C184]/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-[#1C0D0A]">
            More than just a cake
          </h2>
          <p className="font-display font-medium text-2xl sm:text-3xl text-[#4A3E39] leading-relaxed max-w-3xl mx-auto">
            A cake can be a birthday surprise. It can be part of an anniversary. It can bring a family together. It can turn an ordinary day into something a little sweeter.
          </p>
          <p className="text-sm sm:text-base text-[#4A3E39] max-w-2xl mx-auto leading-relaxed">
            At Lollipop, we don&apos;t just want to make a cake that looks good on the table. We want to make something that tastes good, feels special and becomes part of a memory.
          </p>

          <p className="font-display font-bold text-2xl sm:text-3xl text-[#962854] pt-4">
            Your moment. Your taste. Your Lollipop.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link
              href="/cakes"
              className="btn-primary py-3.5 px-8 text-xs font-bold uppercase tracking-wider shadow-lg flex items-center gap-2"
            >
              <span>🎂 Browse cakes</span>
            </Link>
            <Link
              href="/custom-cake"
              className="btn-secondary py-3.5 px-8 text-xs font-bold uppercase tracking-wider"
            >
              <span>Start a custom cake</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────
         9. FREQUENTLY ASKED QUESTIONS
         ─────────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-[#1C0D0A] text-center mb-10">
            Frequently asked questions
          </h2>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <details
                key={idx}
                className="group border border-[#F1E6DF] bg-white rounded-2xl p-6 transition-all hover:border-[#962854]/40"
              >
                <summary className="font-display font-bold text-xl sm:text-2xl text-[#1C0D0A] cursor-pointer list-none flex items-center justify-between gap-4">
                  <span>{faq.q}</span>
                  <span className="material-symbols-outlined text-[#962854] group-open:rotate-45 transition-transform text-2xl">
                    add
                  </span>
                </summary>
                <p className="text-xs sm:text-sm text-[#4A3E39] mt-3 leading-relaxed border-t border-[#F1E6DF] pt-3">
                  {faq.a}{" "}
                  {faq.linkText && faq.linkUrl && (
                    <a href={faq.linkUrl} className="text-[#962854] font-bold underline">
                      {faq.linkText}
                    </a>
                  )}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
