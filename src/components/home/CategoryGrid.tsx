import Link from "next/link";
import Image from "next/image";

const categories = [
  {
    name: "Bedsheets",
    slug: "bedsheets",
    description: "Thread counts from 400 to 1000. Percale, sateen & beyond.",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=85",
    accent: "#E8DFF5",
  },
  {
    name: "Comforter Sets",
    slug: "comforters",
    description: "Complete bed-in-a-bag sets that dress your room instantly.",
    image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=85",
    accent: "#D4C5B0",
  },
  {
    name: "Bath Towels",
    slug: "towels",
    description: "Plush, absorbent cotton towels in a spectrum of rich colours.",
    image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=800&q=85",
    accent: "#B8A4D4",
  },
];

export function CategoryGrid() {
  return (
    <section className="py-16 lg:py-24 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-12 lg:mb-14">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10 bg-[#C9A961]" />
            <span className="text-xs font-inter tracking-[0.2em] uppercase text-[#C9A961] font-light">
              Our Collections
            </span>
            <div className="h-px w-10 bg-[#C9A961]" />
          </div>
          <h2
            className="font-playfair font-semibold text-[#4A2C5A]"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Shop by Category
          </h2>
          <p className="mt-3 text-base font-inter font-light text-[#8B8B8B] max-w-lg mx-auto">
            Everything you need for a restful, beautiful home — curated and crafted to last.
          </p>
        </div>

        {/* Category cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 lg:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/shop/${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden aspect-[3/4] block hover-lift"
            >
              {/* Image */}
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, 33vw"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a0a24]/80 via-[#4A2C5A]/20 to-transparent" />

              {/* Decorative corner accent */}
              <div
                className="absolute top-4 right-4 w-10 h-10 rounded-full opacity-60"
                style={{ background: cat.accent }}
              />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3
                  className="font-playfair text-xl font-semibold text-white mb-1.5"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {cat.name}
                </h3>
                <p className="text-sm font-inter font-light text-white/75 mb-4 leading-relaxed">
                  {cat.description}
                </p>
                <span className="inline-flex items-center gap-2 text-sm font-inter font-normal text-white border border-white/40 rounded-full px-4 py-1.5 group-hover:bg-white group-hover:text-[#4A2C5A] transition-all duration-300">
                  Shop Now →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Gift bundles link */}
        <div className="mt-8 text-center">
          <Link
            href="/shop/gift-bundles"
            className="inline-flex items-center gap-2 text-sm font-inter font-light text-[#4A2C5A] border-b border-[#B8A4D4] pb-0.5 hover:border-[#4A2C5A] transition-colors"
          >
            Also explore our Gift Bundles — perfect for weddings & new homes →
          </Link>
        </div>
      </div>
    </section>
  );
}
