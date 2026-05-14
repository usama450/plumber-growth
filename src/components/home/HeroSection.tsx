import Link from "next/link";
import Image from "next/image";
import { ChevronDown, MapPin, Package, Heart } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen bg-[#050507] overflow-hidden">
      {/* Full-bleed background image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=2400&q=85"
          alt="Luxurious Khwab bedroom"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#050507]/90 via-[#050507]/65 to-[#050507]/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 min-h-screen flex flex-col justify-center pt-24 pb-32">
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <div className="mb-8">
            <span
              className="text-[10px] tracking-[0.4em] uppercase text-[#E7D3A8]"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Est. 2024 · Canadian Made
            </span>
          </div>

          {/* Headline */}
          <h1
            className="mb-6 leading-tight"
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "clamp(2.1rem, 6vw, 4.5rem)",
              fontWeight: 700,
              color: "#E7D3A8",
            }}
          >
            <span className="hero-word block">Where</span>
            <span className="hero-word block">Dreams</span>
            <span className="hero-word block">Begin</span>
          </h1>

          {/* Subheading */}
          <p
            className="hero-sub max-w-md mb-10 text-[#F8F4EE]/80"
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "18px",
              fontWeight: 300,
            }}
          >
            Premium home textiles for the modern Canadian home.
          </p>

          {/* CTA row */}
          <div className="hero-cta flex flex-col sm:flex-row gap-4">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center px-8 py-3.5 text-sm tracking-[0.15em] uppercase bg-[#5A189A] text-[#F8F4EE] border border-[#E7D3A8]/30 hover:bg-[#7B3DBF] hover:shadow-[0_8px_30px_rgba(90,24,154,0.5)] transition-all duration-300"
              style={{ fontFamily: "var(--font-inter)", fontWeight: 400 }}
            >
              Shop Collection
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center px-8 py-3.5 text-sm tracking-[0.15em] uppercase border border-[#E7D3A8] text-[#E7D3A8] hover:bg-[#E7D3A8]/10 transition-all duration-300"
              style={{ fontFamily: "var(--font-inter)", fontWeight: 400 }}
            >
              Our Story
            </Link>
          </div>
        </div>
      </div>

      {/* Bouncing chevron */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <ChevronDown size={22} className="text-[#E7D3A8]/50" />
      </div>

      {/* Premium badges strip */}
      <div className="absolute bottom-8 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-center sm:justify-start gap-6 sm:gap-8">
            {/* Badge 1 */}
            <div className="flex items-center gap-2">
              <MapPin size={13} className="text-[#E7D3A8]/80 shrink-0" />
              <span
                className="text-[11px] tracking-[0.1em] uppercase text-[#E7D3A8]/60"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Canadian Made
              </span>
            </div>
            {/* Divider */}
            <div className="w-px h-4 bg-[#E7D3A8]/30 hidden sm:block" />
            {/* Badge 2 */}
            <div className="flex items-center gap-2">
              <Package size={13} className="text-[#E7D3A8]/80 shrink-0" />
              <span
                className="text-[11px] tracking-[0.1em] uppercase text-[#E7D3A8]/60"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Free Shipping $125+
              </span>
            </div>
            {/* Divider */}
            <div className="w-px h-4 bg-[#E7D3A8]/30 hidden sm:block" />
            {/* Badge 3 */}
            <div className="flex items-center gap-2">
              <Heart size={13} className="text-[#E7D3A8]/80 shrink-0" />
              <span
                className="text-[11px] tracking-[0.1em] uppercase text-[#E7D3A8]/60"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Family Owned
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
