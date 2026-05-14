import Link from "next/link";
import { prisma } from "@/lib/db";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ScrollReveal } from "@/components/common/ScrollReveal";
import type { ProductCardData } from "@/types";

async function getFeaturedProducts(): Promise<ProductCardData[]> {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        isFeatured: true,
        slug: { not: "test-product-free" },
      },
      take: 4,
      include: {
        images: { orderBy: { displayOrder: "asc" }, take: 2 },
        variants: { select: { size: true, color: true, stockQuantity: true } },
        category: { select: { name: true, slug: true } },
        _count: { select: { reviews: true } },
        reviews: { select: { rating: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return products.map((p) => {
      const avgRating =
        p.reviews.length > 0
          ? p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length
          : 0;
      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: Number(p.price),
        comparePrice: p.comparePrice ? Number(p.comparePrice) : null,
        isOnSale: p.isOnSale,
        isFeatured: p.isFeatured,
        images: p.images,
        category: p.category,
        variants: p.variants,
        _count: p._count,
        avgRating: Math.round(avgRating * 10) / 10,
      };
    });
  } catch {
    return [];
  }
}

function SkeletonCard() {
  return (
    <div className="bg-[#150820] rounded-[8px] overflow-hidden animate-pulse">
      <div className="aspect-[4/5] bg-[#3A1A5C]/40" />
      <div className="p-4 space-y-2.5">
        <div className="h-2.5 bg-[#3A1A5C]/60 rounded w-1/3" />
        <div className="h-4 bg-[#3A1A5C]/60 rounded w-3/4" />
        <div className="h-3 bg-[#3A1A5C]/40 rounded w-1/4" />
      </div>
    </div>
  );
}

export async function FeaturedProducts() {
  const products = await getFeaturedProducts();

  return (
    <section className="py-20 lg:py-28 bg-[#050507]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <ScrollReveal
          type="fade-up"
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12 lg:mb-16 gap-5"
        >
          <div>
            <div className="flex items-center gap-4 mb-4">
              <span className="block w-10 h-px bg-[#C9A961]" />
              <span
                className="text-[11px] tracking-[0.35em] uppercase text-[#C9A961]"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Handpicked Favourites
              </span>
            </div>
            <h2
              className="text-white"
              style={{ fontFamily: "var(--font-playfair)", fontWeight: 600 }}
            >
              Our Collection
            </h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-[13px] text-[#D4AF37] hover:text-white transition-colors border-b border-[#D4AF37]/40 hover:border-white pb-0.5 self-start sm:self-auto"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            View all
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </ScrollReveal>

        {/* Grid */}
        {products.length > 0 ? (
          <ProductGrid products={products} columns={4} />
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {[1, 2, 3, 4].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
