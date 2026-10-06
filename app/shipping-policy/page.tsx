import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Shipping and Delivery Policy - Lollipop The Cake Shop",
  description:
    "Official shipping and delivery policy for fresh cake orders across Tiruchirappalli (Trichy), including time slots, fees, and handling protocols.",
};

export default function ShippingPolicyPage() {
  return (
    <div className="bg-[#FFF9F5] text-[#1C0D0A] min-h-screen py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-10 pb-6 border-b border-[#E6C184]/40 text-center sm:text-left">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#962854] block mb-2">
            Logistics &amp; Fulfillment
          </span>
          <h1 className="font-display font-bold text-3xl sm:text-5xl text-[#1C0D0A] tracking-tight">
            Shipping &amp; Delivery Policy
          </h1>
          <p className="text-xs sm:text-sm text-[#5C524E] mt-2">
            Last Updated: October 2024 • Operating merchant: Lollipop The Cake Shop, Tiruchirappalli, Tamil Nadu
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8 text-xs sm:text-sm text-[#4A3E39] leading-relaxed">
          
          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-[#F1E6DF] shadow-xs">
            <h2 className="font-display font-bold text-xl sm:text-2xl text-[#1C0D0A] mb-3">
              1. Service Coverage &amp; Delivery Areas
            </h2>
            <p className="mb-3">
              <strong>Lollipop The Cake Shop</strong> delivers fresh cakes, desserts, and confectionery items exclusively across <strong>Tiruchirappalli (Trichy), Tamil Nadu</strong> and its immediate urban surroundings.
            </p>
            <p className="mb-3">
              Key delivery locations include, but are not limited to:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-medium text-[#5C524E] bg-[#FAF3EC] p-4 rounded-xl border border-[#E6C184]/40">
              <span>• Andar Veedhi</span>
              <span>• Sanjeevi Nagar</span>
              <span>• Thillai Nagar</span>
              <span>• Cantonment</span>
              <span>• Srirangam</span>
              <span>• KK Nagar</span>
              <span>• Woraiyur</span>
              <span>• TVS Tollgate</span>
              <span>• Kattur &amp; Thuvakudi</span>
              <span>• Palakkarai</span>
              <span>• Crawford</span>
              <span>• Golden Rock (Ponmalai)</span>
            </div>
            <p className="mt-3 text-xs text-[#5C524E]">
              If your delivery pin code or landmark is located beyond standard city limits, please contact our dispatch desk at <strong>+91 96558 88829</strong> before placing an order to confirm courier availability.
            </p>
          </section>

          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-[#F1E6DF] shadow-xs">
            <h2 className="font-display font-bold text-xl sm:text-2xl text-[#1C0D0A] mb-3">
              2. Delivery Slots &amp; Operating Schedule
            </h2>
            <p className="mb-4">
              We offer convenient delivery time slots 7 days a week (Monday through Sunday) from 9:00 AM to 9:00 PM:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div className="p-3.5 rounded-xl bg-[#FAF0F2] border border-[#962854]/20 flex items-center gap-3">
                <span className="material-symbols-outlined text-[#962854] text-xl">schedule</span>
                <div>
                  <strong className="block text-[#1C0D0A] text-xs">Morning Slot</strong>
                  <span className="text-xs text-[#5C524E]">09:00 AM – 12:00 PM</span>
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#FAF0F2] border border-[#962854]/20 flex items-center gap-3">
                <span className="material-symbols-outlined text-[#962854] text-xl">schedule</span>
                <div>
                  <strong className="block text-[#1C0D0A] text-xs">Afternoon Slot</strong>
                  <span className="text-xs text-[#5C524E]">12:00 PM – 03:00 PM</span>
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#FAF0F2] border border-[#962854]/20 flex items-center gap-3">
                <span className="material-symbols-outlined text-[#962854] text-xl">schedule</span>
                <div>
                  <strong className="block text-[#1C0D0A] text-xs">Evening Slot</strong>
                  <span className="text-xs text-[#5C524E]">03:00 PM – 06:00 PM</span>
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#FAF0F2] border border-[#962854]/20 flex items-center gap-3">
                <span className="material-symbols-outlined text-[#962854] text-xl">schedule</span>
                <div>
                  <strong className="block text-[#1C0D0A] text-xs">Night Slot</strong>
                  <span className="text-xs text-[#5C524E]">06:00 PM – 09:00 PM</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-[#5C524E]">
              <strong>Special Midnight Deliveries (11:00 PM – 12:00 AM):</strong> Available for surprise birthday and anniversary celebrations. Please call our store at least 6 hours in advance to arrange dedicated midnight courier slots.
            </p>
          </section>

          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-[#F1E6DF] shadow-xs">
            <h2 className="font-display font-bold text-xl sm:text-2xl text-[#1C0D0A] mb-3">
              3. Delivery Timelines &amp; Lead Times
            </h2>
            <div className="space-y-3">
              <p>
                <strong>Same-Day Orders:</strong> Standard catalogue cakes ordered for same-day delivery are baked fresh and dispatched within <strong>2 to 4 hours</strong> of payment confirmation, or during your chosen time slot.
              </p>
              <p>
                <strong>Eggless &amp; Custom Artisan Cakes:</strong> To uphold our strict hygiene and flavor standards, 100% eggless cakes and intricate designer tier cakes require custom batter formulation and cooling time. Eggless cakes can be scheduled for next-day or chosen future dates.
              </p>
              <p>
                <strong>Future Scheduled Dates:</strong> You may pre-book your cake up to 30 days in advance via our interactive checkout calendar. Your cake will be baked on the morning of delivery to ensure peak freshness.
              </p>
            </div>
          </section>

          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-[#F1E6DF] shadow-xs">
            <h2 className="font-display font-bold text-xl sm:text-2xl text-[#1C0D0A] mb-3">
              4. Shipping Rates &amp; Charges
            </h2>
            <p className="mb-3">
              Delivery charges are calculated transparently and displayed on the checkout page before you make any payment via Razorpay:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
              <li>
                <strong>Orders ₹499 and Above:</strong> <strong>FREE Doorstep Delivery</strong> across standard Trichy city locations.
              </li>
              <li>
                <strong>Orders Below ₹499:</strong> A nominal delivery charge of <strong>₹50</strong> applies to support dedicated courier transit.
              </li>
              <li>
                <strong>Self-Pickup:</strong> 100% <strong>FREE</strong>. You can choose to collect your packaged order directly from our bakery counters.
              </li>
            </ul>
          </section>

          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-[#F1E6DF] shadow-xs">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined p-2 rounded-lg bg-[#FAF0F2] text-[#962854] text-xl mt-0.5">cake</span>
              <div>
                <h2 className="font-display font-bold text-xl sm:text-2xl text-[#1C0D0A] mb-2">
                  5. Perishable Cake Handling &amp; Safe Transit Protocol
                </h2>
                <p className="text-[#962854] font-semibold mb-3">
                  Delivered with Specialized Care to Ensure Structural Integrity
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <p>
                Cakes are delicate, temperature-sensitive culinary creations. We enforce rigorous safety standards during transit:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
                <li>
                  <strong>Specialized Packaging:</strong> Heavy-gauge reinforced bakery cartons with locking cake boards prevent slippage, tilting, or collision.
                </li>
                <li>
                  <strong>Trained Delivery Fleet:</strong> Handled exclusively by our bakery-trained riders using level carrier bags equipped with thermal insulation.
                </li>
                <li>
                  <strong>Four-Wheeler Transit for Multi-Tier Cakes:</strong> Wedding cakes and heavy 3D fondant structures are transported via air-conditioned car vans to maintain cold chain temperature and avoid road vibrations.
                </li>
              </ul>
            </div>
          </section>

          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-[#F1E6DF] shadow-xs">
            <h2 className="font-display font-bold text-xl sm:text-2xl text-[#1C0D0A] mb-3">
              6. Recipient Instructions &amp; Unsuccessful Delivery
            </h2>
            <p className="mb-3">
              To guarantee seamless delivery, please ensure:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
              <li>The provided delivery address includes complete landmarks and an active phone number capable of receiving incoming calls.</li>
              <li>The recipient or an authorized representative is available at the address during the selected time slot.</li>
            </ul>
            <div className="mt-3 bg-[#FAF3EC] p-4 rounded-xl border border-[#E6C184]/40 text-xs space-y-2">
              <p className="font-semibold text-[#1C0D0A]">What happens if the recipient cannot be reached?</p>
              <p className="text-[#5C524E]">
                Our courier will make up to three phone calls to the provided contact numbers. If unreachable after 15 minutes at the address, the cake will be safely returned to our nearest store refrigeration to prevent spoilage. The customer may pick up the order within 12 hours from our branch counter or arrange re-delivery at a nominal re-dispatch fee.
              </p>
            </div>
          </section>

          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-[#F1E6DF] shadow-xs">
            <h2 className="font-display font-bold text-xl sm:text-2xl text-[#1C0D0A] mb-3">
              7. Store Pickup (Self Collection)
            </h2>
            <p className="mb-3">
              Prefer collecting your cake in person? You can collect your pre-ordered and paid items at either of our physical retail bakeries:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[#FAF0F2] border border-[#962854]/20 space-y-1">
                <span className="font-bold text-[#962854] block">Branch 1 — Sanjeevi Nagar</span>
                <p>Sanjeevi Nagar, Tiruchirappalli, Tamil Nadu</p>
                <p>Hours: 8:00 AM – 10:00 PM (Mon – Sun)</p>
                <p>Phone: +91 96558 88829</p>
              </div>
              <div className="p-4 rounded-xl bg-[#FAF3EC] border border-[#E6C184]/40 space-y-1">
                <span className="font-bold text-[#1C0D0A] block">Branch 2 — Andar Veedhi</span>
                <p>150, N Andar St, Tiruchirappalli, Tamil Nadu 620002</p>
                <p>Hours: 8:00 AM – 10:00 PM (Mon – Sun)</p>
                <p>Phone: +91 84893 24697</p>
              </div>
            </div>
          </section>

          <div className="pt-4 flex flex-wrap gap-4 text-xs">
            <Link href="/refund-policy" className="text-[#962854] font-semibold hover:underline">
              ← View Refund &amp; Cancellation Policy
            </Link>
            <span className="text-[#D8C3B3]">•</span>
            <Link href="/contact-us" className="text-[#962854] font-semibold hover:underline">
              View Contact Details →
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
