"use client";

import { useState } from "react";
import Link from "next/link";
import { useToast } from "@/components/common/ToastProvider";

export default function ContactUsPage() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Order Inquiry",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.message.trim()) {
      showToast("Please fill in your name, phone number, and message.", "error");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      showToast("Thank you! Your message has been sent. We will get back to you shortly.", "success");
    }, 800);
  };

  return (
    <div className="bg-[#FFF9F5] text-[#1C0D0A] min-h-screen py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-12 pb-6 border-b border-[#E6C184]/40 text-center sm:text-left">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#962854] block mb-2">
            Get In Touch • We&rsquo;re Here to Help
          </span>
          <h1 className="font-display font-bold text-3xl sm:text-5xl text-[#1C0D0A] tracking-tight">
            Contact Us
          </h1>
          <p className="text-xs sm:text-sm text-[#5C524E] mt-2 max-w-2xl">
            Have questions about your cake order, custom celebration cakes, delivery tracking, or Razorpay payment support? Reach out to our bakery team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column: Official Contact & Branch Info */}
          <div className="lg:col-span-5 space-y-6">

            {/* Registered Entity Box */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#F1E6DF] shadow-xs space-y-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#962854] block mb-1">
                  Merchant Legal Entity
                </span>
                <h2 className="font-display font-bold text-xl text-[#1C0D0A]">
                  Lollipop The Cake Shop
                </h2>
                <p className="text-xs text-[#5C524E] mt-1">
                  Artisanal Cakes, French Pastries &amp; Confectionery • Operating since 2019
                </p>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-[#4A3E39] pt-2 border-t border-[#F1E6DF]">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#962854] text-lg mt-0.5">location_on</span>
                  <div>
                    <strong className="text-[#1C0D0A] block text-xs">Registered &amp; Operating Headquarters:</strong>
                    <p className="text-xs text-[#5C524E]">
                      150, N Andar St, Tiruchirappalli, Tamil Nadu 620002, India
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#962854] text-lg mt-0.5">call</span>
                  <div>
                    <strong className="text-[#1C0D0A] block text-xs">Direct Support Helplines:</strong>
                    <p className="text-xs text-[#5C524E] space-y-0.5">
                      <a href="tel:+919655888829" className="hover:text-[#962854] font-medium block">+91 96558 88829</a>
                      <a href="tel:+918489324697" className="hover:text-[#962854] font-medium block">+91 84893 24697</a>
                      <a href="tel:+917373737810" className="hover:text-[#962854] font-medium block">+91 73737 37810</a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#962854] text-lg mt-0.5">mail</span>
                  <div>
                    <strong className="text-[#1C0D0A] block text-xs">Official Support Email:</strong>
                    <a href="mailto:trichylollipop@gmail.com" className="text-xs text-[#962854] hover:underline font-medium">
                      trichylollipop@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#962854] text-lg mt-0.5">schedule</span>
                  <div>
                    <strong className="text-[#1C0D0A] block text-xs">Operating Hours:</strong>
                    <p className="text-xs text-[#5C524E]">
                      Monday – Sunday: 8:00 AM – 10:00 PM IST (365 Days)
                    </p>
                  </div>
                </div>
              </div>

              {/* Instant WhatsApp Action */}
              <div className="pt-2">
                <a
                  href="https://wa.me/919655888829?text=Hello%20Lollipop%20Cake%20Shop%2C%20I%20have%20an%20inquiry%20about%20an%20order."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-xs"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                  Chat with Our Bakery Desk
                </a>
              </div>
            </div>

            {/* Physical Retail Branches */}
            <div className="bg-white rounded-2xl p-6 border border-[#F1E6DF] shadow-xs space-y-4">
              <h3 className="font-display font-bold text-lg text-[#1C0D0A]">
                Retail Branch Counters
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-[#FAF0F2] border border-[#962854]/20">
                  <strong className="text-[#962854] block font-semibold mb-0.5">
                    Branch 1: Sanjeevi Nagar
                  </strong>
                  <p className="text-[#5C524E]">Sanjeevi Nagar, Tiruchirappalli, Tamil Nadu</p>
                  <p className="text-[#1C0D0A] font-medium mt-1">Phone: +91 96558 88829</p>
                </div>

                <div className="p-3 rounded-xl bg-[#FAF3EC] border border-[#E6C184]/40">
                  <strong className="text-[#1C0D0A] block font-semibold mb-0.5">
                    Branch 2: Andar Veedhi
                  </strong>
                  <p className="text-[#5C524E]">150, N Andar St, Tiruchirappalli, Tamil Nadu 620002</p>
                  <p className="text-[#1C0D0A] font-medium mt-1">Phone: +91 84893 24697</p>
                </div>
              </div>
            </div>

            {/* Grievance Redressal Box */}
            <div className="bg-[#FAF3EC] rounded-2xl p-5 border border-[#E6C184]/40 text-xs space-y-2">
              <strong className="text-[#1C0D0A] block">Grievance &amp; Compliance Escalation</strong>
              <p className="text-[#5C524E]">
                If your payment or order issue is unresolved after contacting helpline, write directly to:
              </p>
              <p className="font-medium text-[#1C0D0A]">
                Grievance Officer, Lollipop The Cake Shop<br />
                Email: <a href="mailto:trichylollipop@gmail.com" className="text-[#962854] underline">trichylollipop@gmail.com</a>
              </p>
              <p className="text-[11px] text-[#7A6B63]">
                Acknowledged within 24–48 working hours under IT Act &amp; RBI compliance guidelines.
              </p>
            </div>

          </div>

          {/* Right Column: Interactive Contact & Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#F1E6DF] shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-[#962854] block mb-1">
                Direct Message
              </span>
              <h2 className="font-display font-bold text-2xl text-[#1C0D0A] mb-2">
                Send Us an Enquiry
              </h2>
              <p className="text-xs text-[#5C524E] mb-6">
                Fill out the form below. Whether you want to enquire about an ongoing order, request custom wedding cake pricing, or report a payment issue, we will respond promptly.
              </p>

              {submitted ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                  <span className="material-symbols-outlined text-3xl text-emerald-600 block">verified</span>
                  <h3 className="font-bold text-emerald-800 text-lg">Thank You! Message Received</h3>
                  <p className="text-xs text-emerald-700 max-w-md mx-auto">
                    We have received your enquiry. Our cake studio coordinator will get in touch with you via phone or WhatsApp within 2 hours.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: "", email: "", phone: "", subject: "Order Inquiry", message: "" });
                    }}
                    className="text-xs font-semibold text-[#962854] underline hover:text-[#7A1E43] pt-2 block mx-auto"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#1C0D0A] mb-1.5">
                        Your Full Name <span className="text-[#962854]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Priya Sundaram"
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D8C3B3] focus:outline-none focus:border-[#962854] focus:ring-1 focus:ring-[#962854]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#1C0D0A] mb-1.5">
                        Phone Number (10 digits) <span className="text-[#962854]">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="e.g. 9876543210"
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D8C3B3] focus:outline-none focus:border-[#962854] focus:ring-1 focus:ring-[#962854]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#1C0D0A] mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="name@example.com"
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D8C3B3] focus:outline-none focus:border-[#962854] focus:ring-1 focus:ring-[#962854]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#1C0D0A] mb-1.5">
                        Inquiry Topic <span className="text-[#962854]">*</span>
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D8C3B3] focus:outline-none focus:border-[#962854] focus:ring-1 focus:ring-[#962854] bg-white"
                      >
                        <option value="Order Inquiry">Order Status &amp; Tracking</option>
                        <option value="Custom Cake Quote">Custom / Wedding Cake Quote</option>
                        <option value="Razorpay Payment Assistance">Razorpay Payment / Debited Issue</option>
                        <option value="Refund & Cancellation">Refund or Cancellation Request</option>
                        <option value="Bulk / Corporate Order">Bulk / Event Catering Order</option>
                        <option value="General Feedback">General Feedback or Compliment</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1C0D0A] mb-1.5">
                      Your Message / Details <span className="text-[#962854]">*</span>
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please share details such as your Order ID, event date, flavour preferences, or payment reference..."
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D8C3B3] focus:outline-none focus:border-[#962854] focus:ring-1 focus:ring-[#962854] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 bg-[#962854] hover:bg-[#7A1E43] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-60 shadow-xs flex items-center justify-center gap-2"
                  >
                    {submitting ? "Sending Your Message..." : "Submit Inquiry"}
                  </button>

                  <p className="text-[11px] text-[#7A6B63] text-center pt-2">
                    By submitting this form, you agree to our{" "}
                    <Link href="/privacy-policy" className="text-[#962854] underline">
                      Privacy Policy
                    </Link>
                    . Your contact details are kept strictly confidential.
                  </p>
                </form>
              )}
            </div>

            {/* Quick Policies Navigation Links */}
            <div className="mt-6 p-4 rounded-2xl bg-white border border-[#F1E6DF] flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="font-semibold text-[#1C0D0A]">Compliance &amp; Support Policies:</span>
              <div className="flex flex-wrap gap-3">
                <Link href="/terms-and-conditions" className="text-[#962854] hover:underline font-medium">
                  Terms &amp; Conditions
                </Link>
                <span className="text-[#D8C3B3]">•</span>
                <Link href="/refund-policy" className="text-[#962854] hover:underline font-medium">
                  Refund &amp; Cancellation
                </Link>
                <span className="text-[#D8C3B3]">•</span>
                <Link href="/shipping-policy" className="text-[#962854] hover:underline font-medium">
                  Shipping &amp; Delivery
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
