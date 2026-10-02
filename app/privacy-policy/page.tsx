import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy - Lollipop The Cake Shop",
  description:
    "Learn how Lollipop The Cake Shop collects, uses, and safeguards your personal data and payment information via Razorpay secure gateway.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#FFF9F5] text-[#1C0D0A] min-h-screen py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-10 pb-6 border-b border-[#E6C184]/40 text-center sm:text-left">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#962854] block mb-2">
            Data Protection &amp; Security
          </span>
          <h1 className="font-display font-bold text-3xl sm:text-5xl text-[#1C0D0A] tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-[#5C524E] mt-2">
            Last Updated: October 2024 • Operating entity: Lollipop The Cake Shop, Tiruchirappalli, Tamil Nadu
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8 text-xs sm:text-sm text-[#4A3E39] leading-relaxed">

          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-[#F1E6DF] shadow-xs">
            <h2 className="font-display font-bold text-xl sm:text-2xl text-[#1C0D0A] mb-3">
              1. Overview &amp; Commitment
            </h2>
            <p className="mb-3">
              At <strong>Lollipop The Cake Shop</strong> (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;), we are deeply committed to respecting and protecting the personal privacy of our website visitors and valued customers. This Privacy Policy outlines our procedures concerning the collection, storage, use, and disclosure of personal information when you use our website or purchase fresh cakes and confectionery items from us.
            </p>
            <p>
              By accessing our website or providing information during the checkout process, you agree to the collection and use of information in accordance with this policy and Indian data protection regulations under the <em>Information Technology Act, 2000</em> and the <em>Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011</em>.
            </p>
          </section>

          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-[#F1E6DF] shadow-xs">
            <h2 className="font-display font-bold text-xl sm:text-2xl text-[#1C0D0A] mb-3">
              2. Information We Collect
            </h2>
            <p className="mb-3">
              To process your cake orders and ensure prompt doorstep delivery across Tiruchirappalli, we collect the following types of information:
            </p>
            <div className="space-y-3">
              <div>
                <strong className="text-[#1C0D0A] block">A. Personal Identification &amp; Contact Details:</strong>
                <p>Full name, primary mobile phone number, secondary contact number (if provided for delivery coordination), and email address.</p>
              </div>
              <div>
                <strong className="text-[#1C0D0A] block">B. Delivery Address &amp; Recipient Information:</strong>
                <p>Street address, landmark, area, city (Tiruchirappalli), postal pin code, and recipient contact name (for gift deliveries).</p>
              </div>
              <div>
                <strong className="text-[#1C0D0A] block">C. Order &amp; Customization Specifications:</strong>
                <p>Cake flavour, weight, dietary choice (standard or 100% eggless), custom text message on cake, occasion details, and reference images uploaded for bespoke designer cakes.</p>
              </div>
              <div>
                <strong className="text-[#1C0D0A] block">D. Technical &amp; Device Information:</strong>
                <p>Internet Protocol (IP) address, browser type, operating system, and anonymous analytics data regarding page visits to optimize website loading speeds and checkout flow.</p>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-[#F1E6DF] shadow-xs">
            <div className="flex items-start gap-3">
              <span className="p-2 rounded-lg bg-[#FAF0F2] text-[#962854] font-bold text-lg mt-0.5">🔒</span>
              <div>
                <h2 className="font-display font-bold text-xl sm:text-2xl text-[#1C0D0A] mb-2">
                  3. Payment Security &amp; Razorpay Compliance
                </h2>
                <p className="text-[#962854] font-semibold mb-3">
                  We Never Store Sensitive Payment Data on Our Servers
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <p>
                All online transactions on our store are processed through <strong>Razorpay Payment Gateway</strong> (Razorpay Software Private Limited), an RBI-authorized payment aggregator certified under <strong>PCI-DSS (Payment Card Industry Data Security Standard) Level 1</strong>, the highest tier of global security certification.
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
                <li>
                  <strong>No Card Data Storage:</strong> We do NOT capture, store, or process any credit or debit card numbers, CVV/CVC codes, expiry dates, net banking passwords, or UPI MPINs on our web servers.
                </li>
                <li>
                  <strong>256-Bit SSL Encryption:</strong> All transaction communication between your browser and Razorpay is encrypted using industry-standard 256-bit Secure Sockets Layer (SSL) encryption.
                </li>
                <li>
                  <strong>Two-Factor Authentication:</strong> Card and net banking payments are secured by bank OTP (One-Time Password) verification or UPI PIN authorization in compliance with Reserve Bank of India mandates.
                </li>
                <li>
                  Razorpay processes your transaction data only to complete your payment authorization and fraud-prevention checks in accordance with their privacy policy.
                </li>
              </ul>
            </div>
          </section>

          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-[#F1E6DF] shadow-xs">
            <h2 className="font-display font-bold text-xl sm:text-2xl text-[#1C0D0A] mb-3">
              4. How We Use Your Information
            </h2>
            <p className="mb-3">
              We use the collected information strictly for legitimate commercial purposes:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
              <li>Processing, baking, and packaging your fresh cake order according to your exact specifications.</li>
              <li>Coordinating accurate and timely doorstep delivery with our dedicated in-house delivery fleet.</li>
              <li>Sending automated order confirmations, delivery slot updates, and electronic tax receipts via SMS, WhatsApp, and email.</li>
              <li>Contacting you in the event of stock availability changes, address clarification, or baking design confirmation.</li>
              <li>Handling customer support inquiries, feedback, and refund/cancellation claims.</li>
              <li>Complying with statutory accounting and tax filing obligations under Indian law.</li>
            </ul>
          </section>

          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-[#F1E6DF] shadow-xs">
            <h2 className="font-display font-bold text-xl sm:text-2xl text-[#1C0D0A] mb-3">
              5. Information Sharing &amp; Third Parties
            </h2>
            <p className="mb-3">
              <strong>We never sell, rent, trade, or monetize your personal information to third-party marketing companies.</strong>
            </p>
            <p className="mb-3">
              We share minimal necessary data strictly with trusted service providers:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
              <li><strong>Payment Gateway (Razorpay):</strong> Transaction amount, order ID, customer name, email, and phone number to initiate and verify payment sessions.</li>
              <li><strong>Logistics Drivers:</strong> Name, delivery address, and phone number provided to delivery riders for the sole purpose of handing over the perishable cake parcel.</li>
              <li><strong>Legal Authorities:</strong> Only when required by law, subpoena, or law enforcement investigations in accordance with applicable Indian laws.</li>
            </ul>
          </section>

          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-[#F1E6DF] shadow-xs">
            <h2 className="font-display font-bold text-xl sm:text-2xl text-[#1C0D0A] mb-3">
              6. Cookies &amp; Local Storage
            </h2>
            <p className="mb-3">
              Our website uses essential session cookies and browser local storage to maintain your shopping cart items, selected egg preferences, and delivery slot selections as you browse through our menu.
            </p>
            <p>
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you disable cookies, some portions of the cart and checkout experience may not function as intended.
            </p>
          </section>

          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-[#F1E6DF] shadow-xs">
            <h2 className="font-display font-bold text-xl sm:text-2xl text-[#1C0D0A] mb-3">
              7. Data Retention &amp; User Rights
            </h2>
            <p className="mb-3">
              We retain customer order history and contact details only for as long as necessary to fulfill order delivery, resolve customer service issues, and meet statutory tax audit requirements.
            </p>
            <p className="mb-3">
              Under applicable Indian privacy laws, you have the right to:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
              <li>Request confirmation of the personal data we hold about you.</li>
              <li>Request correction or updating of inaccurate personal information.</li>
              <li>Request deletion of your non-essential account or contact records.</li>
              <li>Opt-out of promotional SMS or WhatsApp messages by notifying our helpline.</li>
            </ul>
          </section>

          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-[#F1E6DF] shadow-xs">
            <h2 className="font-display font-bold text-xl sm:text-2xl text-[#1C0D0A] mb-3">
              8. Grievance Redressal Officer
            </h2>
            <p className="mb-3">
              In accordance with the Information Technology Act, 2000 and rules made thereunder, the name and contact details of the Grievance Officer are provided below:
            </p>
            <div className="bg-[#FAF0F2] rounded-xl p-4 sm:p-5 border border-[#962854]/20 space-y-1.5 text-xs sm:text-sm">
              <p><strong>Grievance Officer:</strong> Customer Care Lead, Lollipop The Cake Shop</p>
              <p><strong>Address:</strong> 150, N Andar St, Tiruchirappalli, Tamil Nadu 620002, India</p>
              <p><strong>Email:</strong> <a href="mailto:trichylollipop@gmail.com" className="text-[#962854] font-semibold underline">trichylollipop@gmail.com</a></p>
              <p><strong>Helpline:</strong> +91 96558 88829 / +91 84893 24697</p>
              <p><strong>Response Time:</strong> Inquiries and grievances are acknowledged within 24–48 working hours.</p>
            </div>
          </section>

          <div className="pt-4 flex flex-wrap gap-4 text-xs">
            <Link href="/terms-and-conditions" className="text-[#962854] font-semibold hover:underline">
              ← View Terms &amp; Conditions
            </Link>
            <span className="text-[#D8C3B3]">•</span>
            <Link href="/refund-policy" className="text-[#962854] font-semibold hover:underline">
              View Refund &amp; Cancellation Policy →
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
