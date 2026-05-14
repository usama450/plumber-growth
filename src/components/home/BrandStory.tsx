import Image from "next/image";
import Link from "next/link";

export function BrandStory() {
  return (
    <section className="py-16 lg:py-24 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Image side */}
          <div className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=85"
                alt="Khwab family team in their Canadian facility"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* Decorative border */}
              <div className="absolute inset-0 rounded-2xl ring-1 ring-[#B8A4D4]/30" />
            </div>

            {/* Floating stat card */}
            <div className="absolute -bottom-5 -right-4 lg:-right-8 bg-[#4A2C5A] text-white rounded-2xl p-5 shadow-xl">
              <div className="text-3xl font-playfair font-semibold mb-0.5"
                style={{ fontFamily: "var(--font-playfair)" }}>
                25+
              </div>
              <div className="text-xs font-inter font-light tracking-wide text-[#E8DFF5]">
                Years of Excellence
              </div>
            </div>

            {/* Decorative element */}
            <div className="absolute -top-4 -left-4 w-20 h-20 rounded-full bg-[#E8DFF5] -z-10" />
          </div>

          {/* Text side */}
          <div className="order-1 lg:order-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-8 bg-[#C9A961]" />
              <span className="text-xs font-inter tracking-[0.2em] uppercase text-[#C9A961] font-light">
                Our Story
              </span>
            </div>

            <h2
              className="font-playfair font-semibold text-[#4A2C5A] mb-6 leading-tight"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              A family legacy, woven into every thread
            </h2>

            <div className="space-y-4 font-inter font-light text-[#2A2A2A] leading-relaxed">
              <p>
                Khwab — meaning <em>&ldquo;dream&rdquo;</em> in Urdu — was born from a simple belief: that the place where you rest should feel like a sanctuary.
              </p>
              <p>
                Our family has been crafting premium home textiles for over 25 years, drawing on rich Pakistani weaving traditions and adapting them for the modern Canadian home. Every set is manufactured right here in Canada, with full control over quality at every step.
              </p>
              <p>
                We source the finest Egyptian and Pakistani cotton, apply time-honoured dyeing techniques, and finish every piece to standards that would make our grandmothers proud.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4 py-6 border-y border-[#E8DFF5]">
              {[
                { stat: "100%", label: "Canadian Made" },
                { stat: "50k+", label: "Happy Homes" },
                { stat: "🍁", label: "Family Owned" },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <div className="text-xl font-playfair font-semibold text-[#4A2C5A] mb-1"
                    style={{ fontFamily: "var(--font-playfair)" }}>
                    {item.stat}
                  </div>
                  <div className="text-xs font-inter font-light text-[#8B8B8B] tracking-wide">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-6 py-3 border border-[#4A2C5A] text-[#4A2C5A] font-inter font-light text-sm rounded-xl hover:bg-[#E8DFF5]/50 transition-all"
              >
                Read Our Full Story →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
