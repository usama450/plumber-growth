import Link from "next/link";
import Image from "next/image";
import { ScrollReveal } from "@/components/common/ScrollReveal";

const categories = [
  {
    name: "Bedsheets",
    slug: "bedsheets",
    description: "Thread counts from 400 to 1000. Percale, sateen & beyond.",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=85",
    count: "12 styles",
  },
  {
    name: "Comforter Sets",
    slug: "comforters",
    description: "Complete bed-in-a-bag sets that dress your room instantly.",
    image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=85",
    count: "8 styles",
  },
  {
    name: "Bath Towels",
    slug: "towels",
    description: "Plush, absorbent cotton towels in a spectrum of rich colours.",
    image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=800&q=85",
    count: "5 colours",
  },
];

export function CategoryGrid() {
  return (
    <section className="py-20 lg:py-28 bg-[#F7F3EE]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">

        {/* Heading */}
        <ScrollReveal type="fade-up" className="text-center mb-14 lg:mb-18">
          <div className="flex items-center justify-center gap-4 mb-5">
            <span className="eyebrow-line" />
            <span className="text-[11px] tracking-[0.35em] uppercase text-[#C4992E] font-medium"
              style={{ fontFamily: "var(--font-dm)" }}>
              Our Collections
            </span>
            <span className="eyebrow-line" />
          </div>
          <h2 className="text-[#1A1410] mb-4" style={{ fontFamily: "var(--font-cormorant)" }}>
            Shop by Category
          </h2>
          <p className="text-[#9A9088] max-w-md mx-auto leading-relaxed"
            style={{ fontFamily: "var(--font-dm)", fontSize: "15px" }}>
            Everything you need for a restful, beautiful home — curated and crafted to last.
          </p>
        </ScrollReveal>

        {/* Cards */}
        <ScrollReveal type="stagger" className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-5">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/shop/${cat.slug}`}
              className="group relative aspect-[3/4] overflow-hidden block lift-hover"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-108"
                sizes="(max-width: 640px) 100vw, 33vw"
              />

              {/* Overlay — deepens on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1410]/85 via-[#1A1410]/20 to-transparent transition-all duration-500 group-hover:from-[#1A1410]/90 group-hover:via-[#1A1410]/35" />

              {/* Count chip */}
              <div className="absolute top-5 right-5">
                <span className="text-[10px] text-[#F7F3EE]/60 tracking-[0.2em] uppercase"
                  style={{ fontFamily: "var(--font-dm)" }}>
                  {cat.count}
                </span>
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-7 translate-y-2 group-hover:translate-y-0 transition-transform duration-400 ease-[cubic-bezier(0.25,0.1,0.25,1)]">
                <h3 className="text-2xl font-light text-[#F7F3EE] mb-1.5"
                  style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic" }}>
                  {cat.name}
                </h3>
                <p className="text-[13px] text-[#F7F3EE]/65 mb-5 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                  style={{ fontFamily: "var(--font-dm)" }}>
                  {cat.description}
                </p>
                <span className="inline-flex items-center gap-2.5 text-[11px] tracking-[0.25em] uppercase text-[#C4992E] font-medium"
                  style={{ fontFamily: "var(--font-dm)" }}>
                  Explore
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </ScrollReveal>

        <ScrollReveal type="fade-in" className="mt-10 text-center">
          <Link
            href="/shop/gift-bundles"
            className="inline-flex items-center gap-2 text-[13px] text-[#9A9088] hover:text-[#1A1410] transition-colors border-b border-[#DDD5C9] hover:border-[#1A1410] pb-0.5"
            style={{ fontFamily: "var(--font-dm)" }}
          >
            Also explore our Gift Bundles — perfect for weddings & new homes
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
