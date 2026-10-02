"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="bg-[#250527] text-white pt-12 pb-8 border-t border-[#962854]/30 mt-auto relative z-10 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main Footer Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-white/10 text-xs text-[#E5D2E7]">

          {/* Brand Info */}
          <div className="md:col-span-3 space-y-3">
            <span className="font-display font-semibold text-xl text-white block tracking-[0.03em]">
              Lollipop Cake Shop
            </span>
            <p className="leading-relaxed text-[#D8C3B3] text-xs">
              Handcrafted artisanal luxury cakes, French pastries, customized
              milestone cakes, and fresh baked delights daily across Tiruchirappalli.
            </p>
            <div className="pt-1 text-[11px] text-[#A892A8] space-y-0.5">
              <p>Branch 1: Sanjeevi Nagar, Trichy</p>
              <p>Branch 2: Andar Veedhi, Trichy</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2">
            <h4 className="font-bold text-white uppercase tracking-wider mb-3 text-xs">
              Quick Links
            </h4>
            <ul className="space-y-2 text-[#D8C3B3]">
              <li><Link href="/" className="hover:text-white transition-colors">Home Page</Link></li>
              <li><Link href="/cakes" className="hover:text-white transition-colors">Signature Cakes</Link></li>
              <li><Link href="/dry-cakes" className="hover:text-white transition-colors">Dry Cakes Collection</Link></li>
              <li><Link href="/snacks" className="hover:text-white transition-colors">Gourmet Pastries</Link></li>
              <li><Link href="/custom-cake" className="hover:text-white transition-colors">Custom Cake Studio</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Occasions */}
          <div className="md:col-span-2">
            <h4 className="font-bold text-white uppercase tracking-wider mb-3 text-xs">
              Occasions
            </h4>
            <ul className="space-y-2 text-[#D8C3B3]">
              <li><Link href="/first-birthday" className="hover:text-white transition-colors">1st Birthday Smash</Link></li>
              <li><Link href="/wedding-cakes" className="hover:text-white transition-colors">Wedding Masterpieces</Link></li>
              <li><Link href="/bento-cake" className="hover:text-white transition-colors">Korean Bento Cakes</Link></li>
            </ul>
          </div>

          {/* Policies & Legal (Razorpay Compliance) */}
          <div className="md:col-span-2">
            <h4 className="font-bold text-white uppercase tracking-wider mb-3 text-xs">
              Policies &amp; Legal
            </h4>
            <ul className="space-y-2 text-[#D8C3B3]">
              <li>
                <Link href="/terms-and-conditions" className="hover:text-white transition-colors">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-white transition-colors">
                  Refund &amp; Cancellation
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-white transition-colors">
                  Shipping &amp; Delivery
                </Link>
              </li>
              <li>
                <Link href="/contact-us" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="md:col-span-3 space-y-2 text-[#D8C3B3]">
            <h4 className="font-bold text-white uppercase tracking-wider mb-3 text-xs">
              Reach Our Bakery
            </h4>
            <p className="leading-snug">
              📍 150, N Andar St, Tiruchirappalli, Tamil Nadu 620002
            </p>
            <div className="space-y-1 pt-1">
              <p>📞 <a href="tel:+918489324697" className="hover:text-white">+91 84893 24697</a></p>
              <p>📞 <a href="tel:+919655888829" className="hover:text-white">+91 96558 88829</a></p>
              <p>📞 <a href="tel:+917373737810" className="hover:text-white">+91 73737 37810</a></p>
              <p>✉️ <a href="mailto:trichylollipop@gmail.com" className="hover:text-white">trichylollipop@gmail.com</a></p>
            </div>
            <p className="text-[11px] text-[#A892A8] pt-1">
              ⏰ Open Mon–Sun: 8:00 AM – 10:00 PM
            </p>
          </div>
        </div>

        {/* Razorpay Trust & Payment Logos Banner */}
        <div className="py-6 border-b border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#D8C3B3]">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#E5D2E7]">
              100% Secure Payments Powered by <strong className="text-white">Razorpay</strong>
            </span>
          </div>

          {/* Payment Method Logos */}
          <div className="flex flex-wrap items-center justify-center gap-3">

            {/* UPI */}
            <div className="h-8 px-2 bg-white rounded-md flex items-center justify-center" title="UPI">
              <svg height="20" viewBox="0 0 60 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <text x="0" y="18" fontFamily="Arial,sans-serif" fontWeight="800" fontSize="18" fill="#6B3FA0">UPI</text>
              </svg>
            </div>

            {/* Google Pay */}
            <div className="h-8 px-2 bg-white rounded-md flex items-center justify-center" title="Google Pay">
              <svg height="18" viewBox="0 0 50 20" xmlns="http://www.w3.org/2000/svg">
                <text x="0" y="15" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="13" fill="#4285F4">G</text>
                <text x="10" y="15" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="13" fill="#EA4335">P</text>
                <text x="19" y="15" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="13" fill="#FBBC05">a</text>
                <text x="27" y="15" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="13" fill="#34A853">y</text>
              </svg>
            </div>

            {/* PhonePe */}
            <div className="h-8 px-2 bg-white rounded-md flex items-center justify-center" title="PhonePe">
              <svg height="18" viewBox="0 0 72 20" xmlns="http://www.w3.org/2000/svg">
                <text x="0" y="15" fontFamily="Arial,sans-serif" fontWeight="800" fontSize="12" fill="#5F259F">PhonePe</text>
              </svg>
            </div>

            {/* Visa */}
            <div className="h-8 px-3 bg-white rounded-md flex items-center justify-center" title="Visa">
              <svg height="16" viewBox="0 0 60 20" xmlns="http://www.w3.org/2000/svg">
                <text x="0" y="16" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="18" fontStyle="italic" fill="#1A1F71">VISA</text>
              </svg>
            </div>

            {/* Mastercard */}
            <div className="h-8 px-2 bg-white rounded-md flex items-center justify-center gap-1" title="Mastercard">
              <svg height="22" viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg">
                <circle cx="14" cy="12" r="10" fill="#EB001B" />
                <circle cx="24" cy="12" r="10" fill="#F79E1B" />
                <path d="M19 5.27a10 10 0 0 1 0 13.46A10 10 0 0 1 19 5.27z" fill="#FF5F00" />
              </svg>
            </div>

            {/* RuPay */}
            <div className="h-8 px-2 bg-white rounded-md flex items-center justify-center" title="RuPay">
              <svg height="18" viewBox="0 0 58 20" xmlns="http://www.w3.org/2000/svg">
                <text x="0" y="15" fontFamily="Arial,sans-serif" fontWeight="800" fontSize="13" fill="#006A4E">Ru</text>
                <text x="22" y="15" fontFamily="Arial,sans-serif" fontWeight="800" fontSize="13" fill="#F47920">Pay</text>
              </svg>
            </div>

            {/* Net Banking */}
            <div className="h-8 px-2 bg-white rounded-md flex items-center justify-center" title="Net Banking">
              <svg height="20" viewBox="0 0 24 20" xmlns="http://www.w3.org/2000/svg" fill="none">
                <rect x="2" y="6" width="20" height="13" rx="2" stroke="#374151" strokeWidth="1.5" />
                <path d="M2 10h20" stroke="#374151" strokeWidth="1.5" />
                <path d="M6 14h4" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M3 6L12 2l9 4" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

          </div>
        </div>

        {/* Bottom Copyright & Guarantee */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#D8C3B3] gap-4">
          <p>© 2019 Lollipop Cake Shop. Made for Moments. Baked for Memories.</p>
          <p className="flex items-center gap-3">
            <span>100% Fresh Daily</span>
            <span>•</span>
            <span>PCI-DSS Level 1 Compliant</span>
            <span>•</span>
            <span>Artisanal Quality</span>
          </p>
        </div>

      </div>
    </footer>
  );
}
