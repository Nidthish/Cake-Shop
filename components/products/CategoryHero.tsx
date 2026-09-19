export default function CategoryHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="relative bg-gradient-to-b from-[#FAF3EC]/90 via-[#FFF9F5] to-[#FFF9F5] py-14 sm:py-20 overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <span className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-[#962854] bg-[#962854]/10 px-4 py-1.5 rounded-full mb-4">
          {eyebrow}
        </span>
        <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-[#1C0D0A] leading-tight mb-4">
          {title}
        </h1>
        <p className="text-[#5C524E] text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
          {description}
        </p>
      </div>
    </section>
  );
}
