import Link from "next/link";
import { prisma } from "@/lib/db";
import { ProductGrid } from "@/components/product/ProductGrid";
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

export async function FeaturedProducts() {
  const products = await getFeaturedProducts();

  if (products.length === 0) return null;

  return (
    <section className="py-16 lg:py-24 bg-[#E8DFF5]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 lg:mb-12 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px w-8 bg-[#C9A961]" />
              <span className="text-xs font-inter tracking-[0.2em] uppercase text-[#C9A961] font-light">
                Handpicked For You
              </span>
            </div>
            <h2
              className="font-playfair font-semibold text-[#4A2C5A]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Featured Products
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-sm font-inter font-light text-[#4A2C5A] border-b border-[#B8A4D4] pb-0.5 hover:border-[#4A2C5A] transition-colors self-start sm:self-auto"
          >
            View all products →
          </Link>
        </div>

        <ProductGrid products={products} columns={4} />
      </div>
    </section>
  );
}
