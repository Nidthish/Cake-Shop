import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#250527] text-white pt-12 pb-8 border-t border-[#962854]/30 mt-auto relative z-10 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-white/10 text-xs text-[#E5D2E7]">
          <div className="md:col-span-4 space-y-3">
            <span className="font-display font-semibold text-xl text-white block tracking-[0.03em]">
              Lollipop Cake Shop
            </span>
            <p className="leading-relaxed text-[#D8C3B3] text-xs">
              Handcrafted artisanal luxury cakes, French pastries, customized
              milestone cakes, and fresh baked delights daily.
            </p>
          </div>

          <div className="md:col-span-3">
            <h4 className="font-bold text-white uppercase tracking-wider mb-3 text-xs">
              Quick Links
            </h4>
            <ul className="space-y-2 text-[#D8C3B3]">
              <li><Link href="/" className="hover:text-white transition-colors">Home Page</Link></li>
              <li><Link href="/cakes" className="hover:text-white transition-colors">Signature Cakes Catalog</Link></li>
              <li><Link href="/dry-cakes" className="hover:text-white transition-colors">Dry Cakes Collection</Link></li>
              <li><Link href="/snacks" className="hover:text-white transition-colors">Gourmet Snacks &amp; Pastries</Link></li>
              <li><Link href="/custom-cake" className="hover:text-white transition-colors">Customized Cake Studio</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="font-bold text-white uppercase tracking-wider mb-3 text-xs">
              Occasions
            </h4>
            <ul className="space-y-2 text-[#D8C3B3]">
              <li><Link href="/first-birthday" className="hover:text-white transition-colors">1st Birthday Smash Cakes</Link></li>
              <li><Link href="/wedding-cakes" className="hover:text-white transition-colors">Wedding Cake Masterpieces</Link></li>
              <li><Link href="/bento-cake" className="hover:text-white transition-colors">Korean Bento Cakes</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About Us &amp; FAQs</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-2 text-[#D8C3B3]">
            <h4 className="font-bold text-white uppercase tracking-wider mb-3 text-xs">
              Contact Us
            </h4>
            <p>📍 Bandra, Mumbai &amp; Pune</p>
            <p>📞 +91 98765 43210</p>
            <p>✉️ orders@lollipop.com</p>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#D8C3B3] gap-4">
          <p>© 2024 Lollipop Cake Shop. Made for Moments. Baked for Memories.</p>
          <p className="flex items-center gap-3">
            <span>100% Fresh Daily</span>
            <span>•</span>
            <span>Artisanal Quality</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
