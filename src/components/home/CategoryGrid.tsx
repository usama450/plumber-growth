import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { ScrollReveal } from "@/components/common/ScrollReveal";

const CATEGORY_META: Record<
  string,
  { image: string; label: string; order: number }
> = {
  bedsheets: {
    image:
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=85",
    label: "Bedsheets",
    order: 0,
  },
  comforters: {
    image:
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=85",
    label: "Comforters",
    order: 1,
  },
  towels: {
    image:
      "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=800&q=85",
    label: "Towels",
    order: 2,
  },
};

const ALLOWED_SLUGS = ["bedsheets", "comforters", "towels"];

export async function CategoryGrid() {
  const dbCategories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: { where: { isActive: true } } },
      },
    },
    orderBy: { name: "asc" },
  });

  // Filter to the 3 allowed slugs and sort in specified order
  const categories = dbCategories
    .filter((c) => ALLOWED_SLUGS.includes(c.slug))
    .sort(
      (a, b) =>
        (CATEGORY_META[a.slug]?.order ?? 99) -
        (CATEGORY_META[b.slug]?.order ?? 99)
    );

  return (
    <section className="py-20 lg:py-28 bg-[#F9F7F4]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Heading */}
        <ScrollReveal
          type="fade-up"
          className="text-center mb-14 lg:mb-18"
        >
          <p
            className="text-[11px] tracking-[0.38em] uppercase mb-4 text-[#A67C3C]"
            style={{ fontFamily: "var(--font-inter)", fontWeight: 500 }}
          >
            Collections
          </p>
          <h2
            className="text-[#1A1714]"
            style={{ fontFamily: "var(--font-playfair)", fontWeight: 600 }}
          >
            Shop by Category
          </h2>
        </ScrollReveal>

        {/* Cards */}
        <ScrollReveal type="stagger" className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-5">
          {categories.map((cat) => {
            const meta = CATEGORY_META[cat.slug];
            if (!meta) return null;
            const count = cat._count.products;

            return (
              <Link
                key={cat.slug}
                href={`/shop/${cat.slug}`}
                className="group relative aspect-[3/4] sm:aspect-[4/5] overflow-hidden block"
              >
                <Image
                  src={meta.image}
                  alt={meta.label}
                  fill
                  className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-[1.04]"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />

                {/* Dark gradient bottom overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A2B20]/80 via-transparent to-transparent" />

                {/* Bottom content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3
                    className="text-2xl text-white mb-1 group-hover:text-[#E8D0A0] transition-colors duration-300"
                    style={{ fontFamily: "var(--font-playfair)", fontWeight: 500 }}
                  >
                    {meta.label}
                  </h3>

                  {count > 0 && (
                    <p
                      className="text-[11px] mb-3"
                      style={{ fontFamily: "var(--font-inter)", color: "rgba(232,208,160,0.65)" }}
                    >
                      {count} {cat.slug === "towels" ? "colours" : "styles"}
                    </p>
                  )}

                  {/* Explore link with underline */}
                  <span
                    className="inline-flex items-center gap-1.5 text-[12px] tracking-[0.18em] uppercase font-medium"
                    style={{ fontFamily: "var(--font-inter)", color: "#C99B4D" }}
                  >
                    <span className="relative">
                      Explore →
                      <span className="absolute bottom-0 left-0 h-px w-0 bg-[#C99B4D] group-hover:w-full transition-all duration-300" />
                    </span>
                  </span>
                </div>
              </Link>
            );
          })}
        </ScrollReveal>
      </div>
    </section>
  );
}
