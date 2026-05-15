import Image from "next/image";
import Link from "next/link";
import { ScrollReveal } from "@/components/common/ScrollReveal";

export function BrandStory() {
  return (
    <section className="py-20 lg:py-28 bg-[#F9F7F4] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">

          {/* Image column */}
          <ScrollReveal type="fade-right" className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/5] overflow-hidden border border-[#E2DDD7]">
              <Image
                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=85"
                alt="Khwab home textiles lifestyle"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />

              {/* Decorative corner — top-left */}
              <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-[#E2DDD7]/60 pointer-events-none" />
              {/* Decorative corner — bottom-right */}
              <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-[#E2DDD7]/60 pointer-events-none" />
            </div>
          </ScrollReveal>

          {/* Text column */}
          <ScrollReveal type="fade-left" className="order-1 lg:order-2">
            {/* Eyebrow */}
            <p
              className="text-[11px] tracking-[0.38em] uppercase mb-5"
              style={{ fontFamily: "var(--font-inter)", color: "#A67C3C", fontWeight: 500 }}
            >
              Our Story
            </p>

            {/* Heading */}
            <h2
              className="text-[#1A1714] mb-7 leading-tight"
              style={{
                fontFamily: "var(--font-playfair)",
                fontSize: "clamp(1.7rem, 3vw, 2.6rem)",
                fontWeight: 600,
              }}
            >
              A Family Legacy Woven Into Every Thread
            </h2>

            {/* Body paragraphs */}
            <div
              className="space-y-5 mb-10"
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "16px",
                fontWeight: 300,
                lineHeight: 1.85,
                color: "#5A554F",
              }}
            >
              <p>
                Khwab — meaning &ldquo;dream&rdquo; in Urdu — is a Canadian home
                textiles brand born from a love of premium craftsmanship and the
                rich textile heritage of Pakistan.
              </p>
              <p>
                We partner with a trusted Canadian manufacturer with over 25
                years of expertise to bring beautifully crafted bedsheets,
                comforters, and towels to homes across Canada. Every thread
                tells a story of quality and care.
              </p>
            </div>

            {/* Single stat */}
            <div className="border-t border-[#E2DDD7] pt-8 mb-10">
              <div className="flex items-baseline gap-3">
                <span
                  className="text-3xl text-[#2C4A35]"
                  style={{ fontFamily: "var(--font-playfair)", fontWeight: 700 }}
                >
                  25+
                </span>
                <span
                  className="text-[13px] tracking-wide"
                  style={{ fontFamily: "var(--font-inter)", color: "#A67C3C", fontWeight: 400 }}
                >
                  Years of Manufacturing Expertise
                </span>
              </div>
            </div>

            {/* CTA */}
            <Link
              href="/about"
              className="btn-primary inline-flex items-center justify-center gap-2.5 px-8 py-3.5 text-sm tracking-[0.15em] uppercase"
              style={{ fontFamily: "var(--font-inter)", fontWeight: 400 }}
            >
              Read Our Story
            </Link>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
