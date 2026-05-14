import Link from "next/link";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative min-h-[85vh] lg:min-h-[90vh] bg-[#FAF7F2] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="grid lg:grid-cols-2 gap-0 min-h-[85vh] lg:min-h-[90vh] items-center">

          {/* Left — Image */}
          <div className="relative h-[50vh] lg:h-full lg:min-h-[90vh] order-1 lg:order-none -mx-4 lg:mx-0 lg:-ml-8">
            <div className="absolute inset-0 lg:inset-y-0 lg:right-0 lg:left-0">
              {/* Placeholder gradient that looks like a premium bedroom shot */}
              <div className="w-full h-full bg-gradient-to-br from-[#E8DFF5] via-[#D4C5B0] to-[#B8A4D4] relative overflow-hidden">
                {/* Decorative pattern overlay — subtle Pakistani motif */}
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `radial-gradient(circle at 25% 25%, #4A2C5A 1px, transparent 1px),
                      radial-gradient(circle at 75% 75%, #4A2C5A 1px, transparent 1px)`,
                    backgroundSize: "40px 40px",
                  }}
                />
                <Image
                  src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=85"
                  alt="Luxurious Khwab bedsheets on a beautifully styled bed"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                {/* Soft right vignette on desktop to blend into the white */}
                <div className="hidden lg:block absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#FAF7F2] to-transparent" />
              </div>
            </div>
          </div>

          {/* Right — Copy */}
          <div className="order-2 lg:order-none flex flex-col justify-center py-12 lg:py-0 lg:pl-12 xl:pl-16">
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-10 bg-[#C9A961]" />
              <span className="text-xs font-inter tracking-[0.25em] uppercase text-[#C9A961] font-light">
                Canadian Made · Est. 1999
              </span>
            </div>

            {/* Headline */}
            <h1
              className="font-playfair font-semibold text-[#4A2C5A] leading-tight mb-6"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Where
              <br />
              <em className="italic">Dreams</em>
              <br />
              Begin.
            </h1>

            {/* Subheading */}
            <p className="text-base lg:text-lg font-inter font-light text-[#2A2A2A] leading-relaxed mb-8 max-w-md">
              Premium Pakistani-inspired home textiles for the modern Canadian home.
              Crafted with 25 years of family expertise — where tradition meets comfort.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#4A2C5A] text-white font-inter font-normal text-sm rounded-xl hover:bg-[#5B3A6B] transition-all hover:shadow-[0_4px_16px_rgba(74,44,90,0.3)]"
              >
                Shop Collection
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-[#4A2C5A] text-[#4A2C5A] font-inter font-light text-sm rounded-xl hover:bg-[#E8DFF5]/50 transition-all"
              >
                Our Story
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-5">
              {[
                { icon: "🍁", text: "Canadian Made" },
                { icon: "✦", text: "25 Years Experience" },
                { icon: "♻", text: "Sustainable Materials" },
              ].map((badge) => (
                <div key={badge.text} className="flex items-center gap-1.5">
                  <span className="text-[#C9A961] text-sm">{badge.icon}</span>
                  <span className="text-xs font-inter font-light text-[#8B8B8B] tracking-wide">
                    {badge.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave divider */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-[#FAF7F2]" style={{
        clipPath: "ellipse(55% 100% at 50% 100%)",
      }} />
    </section>
  );
}
