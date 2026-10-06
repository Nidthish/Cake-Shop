import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms and Conditions - Lollipop The Cake Shop",
  description:
    "Official terms and conditions governing online cake orders, payments via Razorpay, and deliveries for Lollipop The Cake Shop, Trichy.",
};

export default function TermsAndConditionsPage() {
  return (
    <div className="bg-[#FFF9F5] text-[#1C0D0A] min-h-screen py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-10 pb-6 border-b border-[#E6C184]/40 text-center sm:text-left">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#962854] block mb-2">
            Legal &amp; Compliance
          </span>
          <h1 className="font-display font-bold text-3xl sm:text-5xl text-[#1C0D0A] tracking-tight">
            Terms &amp; Conditions
          </h1>
          <p className="text-xs sm:text-sm text-[#5C524E] mt-2">
            Last Updated: October 2024 • Governing entity: Lollipop The Cake Shop, Tiruchirappalli, Tamil Nadu
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8 text-xs sm:text-sm text-[#4A3E39] leading-relaxed">

          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-[#F1E6DF] shadow-xs">
            <h2 className="font-display font-bold text-xl sm:text-2xl text-[#1C0D0A] mb-3">
              1. Introduction &amp; Acceptance of Terms
            </h2>
            <p className="mb-3">
              Welcome to <strong>Lollipop The Cake Shop</strong> (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;). These Terms and Conditions govern your access to and use of our website, digital storefront, and online cake ordering services.
            </p>
            <p>
              By accessing our website or placing an online order, you agree to be legally bound by these Terms and Conditions, our{" "}
              <Link href="/privacy-policy" className="text-[#962854] font-semibold underline hover:text-[#7A1E43]">
                Privacy Policy
              </Link>
              , and our{" "}
              <Link href="/refund-policy" className="text-[#962854] font-semibold underline hover:text-[#7A1E43]">
                Refund &amp; Cancellation Policy
              </Link>
              . If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-[#F1E6DF] shadow-xs">
            <h2 className="font-display font-bold text-xl sm:text-2xl text-[#1C0D0A] mb-3">
              2. Business Information &amp; Operational Jurisdiction
            </h2>
            <p className="mb-3">
              Our business operations and physical retail bakeries are headquartered in Tiruchirappalli (Trichy), Tamil Nadu:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
              <li><strong>Merchant Legal Name:</strong> Lollipop The Cake Shop</li>
              <li><strong>Registered / Operating Address:</strong> 150, N Andar St, Tiruchirappalli, Tamil Nadu 620002, India</li>
              <li><strong>Branch 1:</strong> Sanjeevi Nagar, Trichy, Tamil Nadu</li>
              <li><strong>Branch 2:</strong> Andar Veedhi, Trichy, Tamil Nadu</li>
              <li><strong>Support Helpline:</strong> +91 96558 88829 / +91 84893 24697 / +91 73737 37810</li>
              <li><strong>Official Support Email:</strong> trichylollipop@gmail.com</li>
            </ul>
          </section>

          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-[#F1E6DF] shadow-xs">
            <h2 className="font-display font-bold text-xl sm:text-2xl text-[#1C0D0A] mb-3">
              3. Products, Pricing &amp; Perishable Goods Disclaimer
            </h2>
            <div className="space-y-3">
              <p>
                <strong>Perishable Nature:</strong> All artisanal cakes, Korean bento cakes, French pastries, and confectionery items sold on our website are freshly baked perishable food products. They must be stored in temperature-controlled conditions (refrigerated at 4°C – 8°C) immediately upon receipt.
              </p>
              <p>
                <strong>Handcrafted Variation:</strong> Because each cake is handcrafted by our master bakers, slight artistic variations in color shades, piping patterns, and edible floral arrangements compared to catalogue photographs may occur.
              </p>
              <p>
                <strong>Pricing &amp; Currency:</strong> All prices listed on our website are in Indian National Rupees (INR ₹) and are inclusive of applicable taxes unless stated otherwise. Delivery fees and eggless customization charges, if applicable, are clearly summarized before checkout.
              </p>
            </div>
          </section>

          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-[#F1E6DF] shadow-xs">
            <h2 className="font-display font-bold text-xl sm:text-2xl text-[#1C0D0A] mb-3">
              4. Payment Terms &amp; Razorpay Gateway Security
            </h2>
            <div className="space-y-3">
              <p>
                Online payments for orders placed on our website are securely processed through <strong>Razorpay Payment Gateway</strong> (Razorpay Software Private Limited).
              </p>
              <p>
                We accept major digital payment methods supported by Razorpay:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
                <li>Unified Payments Interface (UPI) via Google Pay, PhonePe, Paytm, BHIM, and all bank UPI apps</li>
                <li>Credit and Debit Cards (Visa, MasterCard, RuPay, Maestro)</li>
                <li>Net Banking across 50+ commercial banks in India</li>
                <li>Authorized Digital Wallets</li>
              </ul>
              <div className="p-4 rounded-xl bg-[#FAF0F2] border border-[#962854]/20 text-xs text-[#7A1E43] mt-2">
                <strong>Payment Security:</strong> We do NOT collect, view, or store your sensitive banking credentials, CVV, or card passwords. All transaction information is transmitted via industry-standard 256-bit SSL encryption directly to Razorpay, which is certified compliant with PCI-DSS Level 1 standards.
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-[#F1E6DF] shadow-xs">
            <h2 className="font-display font-bold text-xl sm:text-2xl text-[#1C0D0A] mb-3">
              5. Order Confirmation &amp; Fulfillment
            </h2>
            <p className="mb-3">
              An order is deemed confirmed only once successful payment authorization is verified by Razorpay and an automated order confirmation is generated.
            </p>
            <p>
              We reserve the right to decline or cancel an order in exceptional circumstances, including inventory unavailability, unforeseen force majeure events, or inability to safely deliver to the specified address. In such cases, a 100% full refund will be immediately processed.
            </p>
          </section>

          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-[#F1E6DF] shadow-xs">
            <h2 className="font-display font-bold text-xl sm:text-2xl text-[#1C0D0A] mb-3">
              6. Cancellation &amp; Refund Policy Summary
            </h2>
            <p className="mb-3">
              Our comprehensive refund and return terms are detailed on our{" "}
              <Link href="/refund-policy" className="text-[#962854] font-semibold underline hover:text-[#7A1E43]">
                Refund &amp; Cancellation Policy page
              </Link>
              . Key terms include:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm">
              <li>
                <strong>Standard Cakes:</strong> Free cancellation up to 4 hours before the scheduled delivery slot for a 100% full refund.
              </li>
              <li>
                <strong>Custom &amp; 3D Wedding Cakes:</strong> Free cancellation up to 24 hours prior to delivery due to specialized raw material procurement and sculpting.
              </li>
              <li>
                <strong>Refund Timelines:</strong> Approved refunds are credited back to the original payment source via Razorpay within <strong>5 to 7 business days</strong>.
              </li>
            </ul>
          </section>

          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-[#F1E6DF] shadow-xs">
            <h2 className="font-display font-bold text-xl sm:text-2xl text-[#1C0D0A] mb-3">
              7. Dietary Preferences &amp; Allergen Advisory
            </h2>
            <p className="mb-3">
              We offer both regular and 100% pure vegetarian (eggless) variants across our cake catalogue. Please select your egg preference during order placement.
            </p>
            <p>
              <strong>Allergen Notice:</strong> Our bakery handles dairy, gluten, nuts, and chocolate. While stringent food safety and sanitation protocols are observed to prevent cross-contamination, customers with severe medical allergies must contact us before ordering.
            </p>
          </section>

          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-[#F1E6DF] shadow-xs">
            <h2 className="font-display font-bold text-xl sm:text-2xl text-[#1C0D0A] mb-3">
              8. Governing Law &amp; Dispute Resolution
            </h2>
            <p>
              These Terms and Conditions shall be governed by and construed in accordance with the laws of India. Any disputes arising out of or related to our website, online orders, or payment transactions shall be subject to the exclusive jurisdiction of the competent courts in <strong>Tiruchirappalli (Trichy), Tamil Nadu, India</strong>.
            </p>
          </section>

          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-[#F1E6DF] shadow-xs">
            <h2 className="font-display font-bold text-xl sm:text-2xl text-[#1C0D0A] mb-3">
              9. Customer Support &amp; Grievances
            </h2>
            <p className="mb-3">
              For any questions regarding these Terms, your orders, or payment inquiries, please reach out to our customer care team:
            </p>
            <div className="bg-[#FAF3EC] p-4 rounded-xl border border-[#E6C184]/40 text-xs sm:text-sm space-y-1">
              <p><strong>Lollipop The Cake Shop Customer Care</strong></p>
              <p>Email: <a href="mailto:trichylollipop@gmail.com" className="text-[#962854] font-semibold underline">trichylollipop@gmail.com</a></p>
              <p>Phone / WhatsApp: <a href="tel:+919655888829" className="text-[#962854] font-semibold underline">+91 96558 88829</a></p>
              <p>Operating Hours: Monday – Sunday, 8:00 AM – 10:00 PM IST</p>
            </div>
          </section>

        </div>

        {/* Back Link */}
        <div className="mt-10 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#962854] hover:text-[#7A1E43] transition-colors"
          >
            <span>&larr; Back to Home</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
