import Link from "next/link";
import { prisma } from "@/lib/db";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ScrollReveal } from "@/components/common/ScrollReveal";
import type { ProductCardData } from "@/types";

async function getFeaturedProducts(): Promise<ProductCardData[]> {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
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
      const avgRating = p.reviews.length > 0
        ? p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length : 0;
      return {
        id: p.id, name: p.name, slug: p.slug,
        price: Number(p.price), comparePrice: p.comparePrice ? Number(p.comparePrice) : null,
        isOnSale: p.isOnSale, isFeatured: p.isFeatured, images: p.images,
        category: p.category, variants: p.variants, _count: p._count,
        avgRating: Math.round(avgRating * 10) / 10,
      };
    });
  } catch { return []; }
}

export async function FeaturedProducts() {
  const products = await getFeaturedProducts();
  if (products.length === 0) return null;

  return (
    <section className="py-20 lg:py-28 bg-[#EDE8DF]/40">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">

        <ScrollReveal type="fade-up" className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12 lg:mb-16 gap-5">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <span className="eyebrow-line" />
              <span className="text-[11px] tracking-[0.35em] uppercase text-[#C4992E] font-medium"
                style={{ fontFamily: "var(--font-dm)" }}>
                Handpicked
              </span>
            </div>
            <h2 className="text-[#1A1410]" style={{ fontFamily: "var(--font-cormorant)" }}>
              Featured Products
            </h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-[13px] text-[#9A9088] hover:text-[#1A1410] transition-colors border-b border-[#DDD5C9] hover:border-[#1A1410] pb-0.5 self-start sm:self-auto"
            style={{ fontFamily: "var(--font-dm)" }}
          >
            View all products
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </ScrollReveal>

        <ProductGrid products={products} columns={4} />
      </div>
    </section>
  );
}
