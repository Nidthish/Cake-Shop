import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
      <span className="material-symbols-outlined text-6xl text-[#E6C184] mb-4 inline-block">cake</span>
      <h1 className="font-display font-bold text-3xl sm:text-4xl text-[#1C0D0A] mb-3">Page Not Found</h1>
      <p className="text-[#5C524E] mb-8">The page you&rsquo;re looking for doesn&rsquo;t exist or may have moved.</p>
      <Link href="/" className="btn-primary inline-flex items-center gap-2 py-3.5 px-8 text-xs font-bold uppercase tracking-wider">
        Back to Home
      </Link>
    </div>
  );
}
