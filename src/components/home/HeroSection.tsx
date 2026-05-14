import Link from "next/link";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative min-h-screen bg-[#1A1410] overflow-hidden">
      {/* Full-bleed image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1600&q=90"
          alt="Luxurious Khwab bedsheets"
          fill
          priority
          className="object-cover opacity-50"
          sizes="100vw"
        />
        {/* Rich dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A1410]/90 via-[#1A1410]/60 to-[#1A1410]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1410]/80 via-transparent to-transparent" />
      </div>

      {/* Decorative grain texture */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 min-h-screen flex flex-col justify-center pt-24 pb-16">

        <div className="max-w-3xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-4 mb-10 hero-sub" style={{ animationDelay: "0s" }}>
            <span className="eyebrow-line" />
            <span className="text-[11px] tracking-[0.35em] uppercase text-[#C4992E] font-medium"
              style={{ fontFamily: "var(--font-dm)" }}>
              Canadian Made · Est. 1999
            </span>
          </div>

          {/* Headline */}
          <h1 className="hero-headline mb-2">
            <span className="hero-word block">Where</span>
            <span className="hero-word block"><em>Dreams</em></span>
            <span className="hero-word block">Begin.</span>
          </h1>

          {/* Subheading */}
          <p className="hero-sub text-base sm:text-lg text-[#F7F3EE]/70 leading-relaxed max-w-md mb-10 mt-8"
            style={{ fontFamily: "var(--font-dm)", animationDelay: "0.6s" }}>
            Premium Pakistani-inspired home textiles for the modern Canadian home.
            Crafted with 25 years of family expertise.
          </p>

          {/* CTAs */}
          <div className="hero-cta flex flex-col sm:flex-row gap-4">
            <Link href="/shop"
              className="btn-gold inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#C4992E] text-[#1A1410] font-medium text-sm tracking-wide rounded-none hover:bg-[#D4A93E] transition-colors duration-300"
              style={{ fontFamily: "var(--font-dm)" }}>
              Shop the Collection
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <Link href="/about"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-[#F7F3EE]/30 text-[#F7F3EE] font-light text-sm tracking-wide rounded-none hover:border-[#F7F3EE]/70 hover:bg-[#F7F3EE]/5 transition-all duration-300"
              style={{ fontFamily: "var(--font-dm)" }}>
              Our Story
            </Link>
          </div>
        </div>

        {/* Bottom badges */}
        <div className="hero-cta absolute bottom-10 left-0 right-0 px-6 sm:px-8 lg:px-12">
          <div className="max-w-7xl mx-auto flex items-center gap-8">
            {[
              { label: "100% Canadian Made" },
              { label: "25 Years of Craft" },
              { label: "Sustainably Sourced" },
            ].map((b, i) => (
              <div key={b.label} className="flex items-center gap-2.5"
                style={{ animationDelay: `${0.9 + i * 0.1}s` }}>
                <div className="w-1 h-1 rounded-full bg-[#C4992E]" />
                <span className="text-[11px] text-[#F7F3EE]/50 tracking-[0.2em] uppercase hidden sm:block"
                  style={{ fontFamily: "var(--font-dm)" }}>
                  {b.label}
                </span>
              </div>
            ))}
            <div className="ml-auto hidden lg:block">
              <div className="w-px h-8 bg-[#F7F3EE]/20" />
            </div>
            <p className="hidden lg:block text-xs text-[#F7F3EE]/40 tracking-wide"
              style={{ fontFamily: "var(--font-dm)" }}>
              Scroll to explore
            </p>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#F7F3EE] to-transparent" />
    </section>
  );
}
