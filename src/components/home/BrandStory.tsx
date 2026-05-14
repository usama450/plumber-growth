import Image from "next/image";
import Link from "next/link";
import { ScrollReveal } from "@/components/common/ScrollReveal";

export function BrandStory() {
  return (
    <section className="py-20 lg:py-28 bg-[#F7F3EE]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">

          {/* Image */}
          <ScrollReveal type="fade-right" className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=85"
                alt="Khwab family team"
                fill
                className="object-cover transition-transform duration-700 hover:scale-[1.02]"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* Thin gold border overlay */}
              <div className="absolute inset-0 ring-1 ring-[#C4992E]/20 pointer-events-none" />
            </div>

            {/* Stat card */}
            <div className="absolute -bottom-6 -right-4 lg:-right-10 bg-[#1A1410] text-[#F7F3EE] p-6 min-w-[130px] shadow-2xl">
              <div className="text-4xl font-light text-[#C4992E] mb-1 leading-none"
                style={{ fontFamily: "var(--font-cormorant)" }}>25+</div>
              <div className="text-[10px] tracking-[0.25em] uppercase text-[#F7F3EE]/60"
                style={{ fontFamily: "var(--font-dm)" }}>
                Years of<br />Excellence
              </div>
            </div>

            {/* Decorative square */}
            <div className="absolute -top-5 -left-5 w-24 h-24 border border-[#DDD5C9] -z-10" />
          </ScrollReveal>

          {/* Text */}
          <ScrollReveal type="fade-left" className="order-1 lg:order-2">
            <div className="flex items-center gap-4 mb-6">
              <span className="eyebrow-line" />
              <span className="text-[11px] tracking-[0.35em] uppercase text-[#C4992E] font-medium"
                style={{ fontFamily: "var(--font-dm)" }}>
                Our Story
              </span>
            </div>

            <h2 className="text-[#1A1410] mb-7 leading-tight"
              style={{ fontFamily: "var(--font-cormorant)" }}>
              A family legacy, woven into every thread
            </h2>

            <div className="space-y-5 text-[15px] text-[#6B6258] leading-relaxed"
              style={{ fontFamily: "var(--font-dm)", fontWeight: 400 }}>
              <p>
                Khwab — meaning <em className="font-medium text-[#1A1410]">&ldquo;dream&rdquo;</em> in Urdu — was born from a simple belief: that the place where you rest should feel like a sanctuary.
              </p>
              <p>
                Our family has been crafting premium home textiles for over 25 years, drawing on rich Pakistani weaving traditions and adapting them for the modern Canadian home.
              </p>
              <p>
                We source the finest Egyptian and Pakistani cotton, apply time-honoured dyeing techniques, and finish every piece to standards that would make our grandmothers proud.
              </p>
            </div>

            {/* Stats */}
            <div className="mt-10 grid grid-cols-3 gap-6 py-8 border-y border-[#DDD5C9]">
              {[
                { stat: "100%", label: "Canadian Made" },
                { stat: "50k+", label: "Happy Homes" },
                { stat: "1999", label: "Est. in Canada" },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <div className="text-2xl font-light text-[#1A1410] mb-1"
                    style={{ fontFamily: "var(--font-cormorant)" }}>
                    {item.stat}
                  </div>
                  <div className="text-[11px] tracking-[0.15em] uppercase text-[#9A9088]"
                    style={{ fontFamily: "var(--font-dm)" }}>
                    {item.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Link
                href="/about"
                className="btn-gold inline-flex items-center gap-3 px-7 py-3.5 bg-[#1A1410] text-[#F7F3EE] text-[13px] tracking-wide hover:bg-[#2E2318] transition-colors duration-300"
                style={{ fontFamily: "var(--font-dm)" }}
              >
                Read Our Full Story
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
