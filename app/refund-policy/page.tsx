import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Refund and Cancellation Policy - Lollipop The Cake Shop",
  description:
    "Official refund, return, and cancellation policies for online cake orders placed on Lollipop The Cake Shop, Trichy via Razorpay.",
};

export default function RefundPolicyPage() {
  return (
    <div className="bg-[#FFF9F5] text-[#1C0D0A] min-h-screen py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-10 pb-6 border-b border-[#E6C184]/40 text-center sm:text-left">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#962854] block mb-2">
            Customer Assurance &amp; Policies
          </span>
          <h1 className="font-display font-bold text-3xl sm:text-5xl text-[#1C0D0A] tracking-tight">
            Refund &amp; Cancellation Policy
          </h1>
          <p className="text-xs sm:text-sm text-[#5C524E] mt-2">
            Last Updated: October 2024 • Governing merchant: Lollipop The Cake Shop, Tiruchirappalli, Tamil Nadu
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8 text-xs sm:text-sm text-[#4A3E39] leading-relaxed">

          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-[#F1E6DF] shadow-xs">
            <h2 className="font-display font-bold text-xl sm:text-2xl text-[#1C0D0A] mb-3">
              1. Policy Overview
            </h2>
            <p className="mb-3">
              At <strong>Lollipop The Cake Shop</strong>, we bake every single cake, French pastry, and dessert fresh to order with extreme care and hygiene. Because confectionery items and celebration cakes are <strong>perishable food goods</strong> with limited shelf lives, specific rules govern order modifications, cancellations, and refunds.
            </p>
            <p>
              Please review this policy thoroughly before confirming and paying for your order. By placing an order through our website, you agree to these cancellation and refund terms.
            </p>
          </section>

          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-[#F1E6DF] shadow-xs">
            <h2 className="font-display font-bold text-xl sm:text-2xl text-[#1C0D0A] mb-3">
              2. Order Cancellation Windows
            </h2>
            <p className="mb-4">
              Cancellations are accepted based on the product category and how far in advance notice is provided before the scheduled delivery slot:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#FAF0F2] border border-[#962854]/20">
                <span className="font-bold text-[#962854] block mb-1">Standard Fresh &amp; Bento Cakes</span>
                <p className="text-xs text-[#5C524E] mb-2">
                  (Signature cakes, Korean bento, pastries, snack boxes)
                </p>
                <ul className="list-disc pl-4 space-y-1 text-xs">
                  <li><strong>Cancelled 4+ hours before delivery slot:</strong> 100% full refund initiated.</li>
                  <li><strong>Cancelled within 4 hours of delivery:</strong> Non-refundable, as the sponge has already been baked, decorated, and packed for dispatch.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF3EC] border border-[#E6C184]/40">
                <span className="font-bold text-[#1C0D0A] block mb-1">Customised, 3D &amp; Wedding Cakes</span>
                <p className="text-xs text-[#5C524E] mb-2">
                  (Bespoke studio orders, multi-tier wedding cakes, fondant figures)
                </p>
                <ul className="list-disc pl-4 space-y-1 text-xs">
                  <li><strong>Cancelled 24+ hours before delivery date:</strong> Full refund minus any non-reusable custom toppers already manufactured.</li>
                  <li><strong>Cancelled within 24 hours of delivery:</strong> Non-refundable due to raw material and labor commitment.</li>
                </ul>
              </div>
            </div>

            <p className="mt-4 text-xs text-[#5C524E]">
              To request a cancellation, call our direct support helpline immediately at <strong>+91 96558 88829</strong> or WhatsApp <strong>+91 84893 24697</strong> with your Order ID.
            </p>
          </section>

          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-[#F1E6DF] shadow-xs">
            <h2 className="font-display font-bold text-xl sm:text-2xl text-[#1C0D0A] mb-3">
              3. Perishable Goods &amp; Physical Return Policy
            </h2>
            <div className="space-y-3">
              <p>
                Due to food safety and health regulations, <strong>we do not accept physical returns of cakes once accepted by the recipient</strong>. Once a food parcel has been handed over at the destination, it cannot be returned to our bakery inventory.
              </p>
              <p>
                However, if there is a verified defect, damage, or discrepancy upon arrival, you are fully entitled to an immediate replacement or refund as detailed below.
              </p>
            </div>
          </section>

          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-[#F1E6DF] shadow-xs">
            <h2 className="font-display font-bold text-xl sm:text-2xl text-[#1C0D0A] mb-3">
              4. Damaged, Defective, or Incorrect Deliveries
            </h2>
            <p className="mb-3">
              We take extreme care in packaging and temperature-controlled two-wheeler and four-wheeler transport. In the unlikely event that your cake arrives in an unsatisfactory condition, follow these steps:
            </p>
            <ol className="list-decimal pl-5 space-y-2 text-xs sm:text-sm">
              <li>
                <strong>Inspect at Delivery:</strong> Please inspect the cake box and contents in the presence of the delivery courier or immediately upon handover.
              </li>
              <li>
                <strong>Report Within 2 Hours:</strong> Notify us within <strong>2 hours of delivery</strong> by sending clear photographs/video of the cake and the packaging box via WhatsApp to <strong>+91 96558 88829</strong> or email to <strong>trichylollipop@gmail.com</strong> along with your Order ID.
              </li>
              <li>
                <strong>Eligible Situations:</strong>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>Significant structural transit damage (e.g., cake collapsed or crushed).</li>
                  <li>Delivered completely wrong flavour or wrong product compared to order invoice.</li>
                  <li>Missing key customized elements explicitly confirmed in writing (e.g., wrong name piping).</li>
                </ul>
              </li>
              <li>
                <strong>Resolution:</strong> Upon verification by our kitchen manager, we will offer:
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>An urgent express fresh remake delivered to your doorstep free of cost, OR</li>
                  <li>A 100% full refund processed back to your original payment account.</li>
                </ul>
              </li>
            </ol>
          </section>

          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-[#F1E6DF] shadow-xs">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined p-2 rounded-lg bg-[#FAF0F2] text-[#962854] text-xl mt-0.5">credit_card</span>
              <div>
                <h2 className="font-display font-bold text-xl sm:text-2xl text-[#1C0D0A] mb-1">
                  5. Refund Mode &amp; Razorpay Processing Timelines
                </h2>
                <p className="text-[#962854] font-semibold text-xs mb-3">
                  Official Payment Gateway Settlement Timeline
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <p>
                All online payments are securely processed through the <strong>Razorpay Payment Gateway</strong>. In the event of an approved cancellation or refund:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
                <li>
                  <strong>Refund Initiation:</strong> Our team will initiate the refund on the Razorpay merchant dashboard within <strong>24 to 48 hours</strong> of verification.
                </li>
                <li>
                  <strong>Credit to Original Source:</strong> All refunds are credited strictly back to the original payment method used while placing the order (UPI account, Debit/Credit Card, Net Banking, or Wallet). We do not issue cash refunds for online payments.
                </li>
                <li>
                  <strong>Timeline for Amount to Reflect:</strong>
                  <div className="mt-2 bg-[#FAF3EC] p-3 rounded-lg border border-[#E6C184]/40 space-y-1 text-xs">
                    <p>• <strong>UPI (GPay, PhonePe, Paytm, BHIM):</strong> Typically credited within <strong>24 to 48 hours</strong>.</p>
                    <p>• <strong>Credit / Debit Cards &amp; Net Banking:</strong> Reflected in customer bank statement within <strong>5 to 7 business days</strong> (excluding bank holidays and weekends), depending on the issuing bank&rsquo;s clearance cycles.</p>
                  </div>
                </li>
              </ul>
            </div>
          </section>

          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-[#F1E6DF] shadow-xs">
            <h2 className="font-display font-bold text-xl sm:text-2xl text-[#1C0D0A] mb-3">
              6. Failed / Debited Transactions with No Order Placed
            </h2>
            <p className="mb-3">
              If money has been deducted from your bank account or UPI app, but you did not receive an order confirmation screen or Order ID due to network interruption or timeout:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
              <li>
                This is typically an unsettled transaction held by the banking network. Razorpay&rsquo;s automated reconciliation system automatically initiates an auto-refund within 24 hours.
              </li>
              <li>
                The debited amount will be returned to your bank account automatically within <strong>5 to 7 working days</strong>.
              </li>
              <li>
                If you do not receive credit within 7 business days, share your bank transaction reference (UTR / Razorpay Payment ID) with us at <strong>trichylollipop@gmail.com</strong> and our accounts team will coordinate directly with Razorpay support.
              </li>
            </ul>
          </section>

          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-[#F1E6DF] shadow-xs">
            <h2 className="font-display font-bold text-xl sm:text-2xl text-[#1C0D0A] mb-3">
              7. Non-Refundable Scenarios
            </h2>
            <p className="mb-3">
              Refunds will not be entertained in the following instances:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
              <li>Incorrect, incomplete, or unserviceable address provided by the customer during checkout.</li>
              <li>Recipient unavailable, door locked, or contact phone unreachable after 3 consecutive delivery attempts by the rider.</li>
              <li>Recipient refuses to accept the cake delivery at the destination.</li>
              <li>Cake melting or damage caused due to customer failing to refrigerate the cake after successful handover.</li>
              <li>Subjective dissatisfaction regarding slight artistic color variations in handmade frosting.</li>
            </ul>
          </section>

          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-[#F1E6DF] shadow-xs">
            <h2 className="font-display font-bold text-xl sm:text-2xl text-[#1C0D0A] mb-3">
              8. Contact Us for Cancellations &amp; Refund Assistance
            </h2>
            <p className="mb-3">
              For any questions regarding your order status, cancellation, or refund tracking:
            </p>
            <div className="bg-[#FAF0F2] rounded-xl p-4 sm:p-5 border border-[#962854]/20 space-y-1 text-xs sm:text-sm">
              <p><strong>Lollipop The Cake Shop — Customer Care</strong></p>
              <p>150, N Andar St, Tiruchirappalli, Tamil Nadu 620002</p>
              <p>Phone: +91 96558 88829 / +91 84893 24697 / +91 73737 37810</p>
              <p>WhatsApp Support: +91 96558 88829</p>
              <p>Email: <a href="mailto:trichylollipop@gmail.com" className="text-[#962854] font-semibold underline">trichylollipop@gmail.com</a></p>
              <p>Support Hours: Monday to Sunday, 8:00 AM – 10:00 PM IST</p>
            </div>
          </section>

          <div className="pt-4 flex flex-wrap gap-4 text-xs">
            <Link href="/shipping-policy" className="text-[#962854] font-semibold hover:underline">
              ← View Shipping &amp; Delivery Policy
            </Link>
            <span className="text-[#D8C3B3]">•</span>
            <Link href="/terms-and-conditions" className="text-[#962854] font-semibold hover:underline">
              View Terms &amp; Conditions →
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
