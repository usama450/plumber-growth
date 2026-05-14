import type { Metadata } from "next";
import { Suspense } from "react";
import { prisma } from "@/lib/db";
import { ProductGrid } from "@/components/product/ProductGrid";
import { FilterSidebar } from "@/components/shop/FilterSidebar";
import { SortDropdown } from "@/components/shop/SortDropdown";
import type { ProductCardData } from "@/types";
import type { Prisma } from "@prisma/client";

export const metadata: Metadata = {
  title: "Shop All Products",
  description: "Browse our full collection of premium bedsheets, comforter sets, bath towels, and gift bundles.",
};

async function getProducts(searchParams: Record<string, string | string[] | undefined>): Promise<{ products: ProductCardData[]; total: number }> {
  const sort = (searchParams.sort as string) ?? "newest";
  const categoryFilter = searchParams.category
    ? Array.isArray(searchParams.category) ? searchParams.category : [searchParams.category]
    : [];
  const colorFilter = searchParams.color
    ? Array.isArray(searchParams.color) ? searchParams.color : [searchParams.color]
    : [];
  const sizeFilter = searchParams.size
    ? Array.isArray(searchParams.size) ? searchParams.size : [searchParams.size]
    : [];
  const maxPrice = parseFloat((searchParams.maxPrice as string) ?? "500");
  const sale = searchParams.sale === "true";
  const q = searchParams.q as string | undefined;

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sort === "price_asc" ? { price: "asc" }
    : sort === "price_desc" ? { price: "desc" }
    : sort === "best_selling" ? { orderItems: { _count: "desc" } }
    : sort === "featured" ? { isFeatured: "desc" }
    : { createdAt: "desc" };

  const where: Prisma.ProductWhereInput = {
    isActive: true,
    price: { lte: maxPrice },
    ...(sale && { isOnSale: true }),
    ...(categoryFilter.length > 0 && { category: { slug: { in: categoryFilter } } }),
    ...(colorFilter.length > 0 && { variants: { some: { color: { in: colorFilter } } } }),
    ...(sizeFilter.length > 0 && { variants: { some: { size: { in: sizeFilter } } } }),
    ...(q && {
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ],
    }),
  };

  try {
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        include: {
          images: { orderBy: { displayOrder: "asc" }, take: 2 },
          variants: { select: { size: true, color: true, stockQuantity: true } },
          category: { select: { name: true, slug: true } },
          _count: { select: { reviews: true } },
          reviews: { select: { rating: true } },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      total,
      products: products.map((p) => {
        const avgRating =
          p.reviews.length > 0
            ? p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length
            : 0;
        return {
          id: p.id, name: p.name, slug: p.slug,
          price: Number(p.price), comparePrice: p.comparePrice ? Number(p.comparePrice) : null,
          isOnSale: p.isOnSale, isFeatured: p.isFeatured,
          images: p.images, category: p.category, variants: p.variants,
          _count: p._count, avgRating: Math.round(avgRating * 10) / 10,
        };
      }),
    };
  } catch {
    return { products: [], total: 0 };
  }
}

interface ShopPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const { products, total } = await getProducts(params);

  return (
    <div className="min-h-screen bg-[#050507]">
      {/* Page header */}
      <div className="bg-[#0D0415] border-b border-[#3A1A5C] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1
            className="text-[#E7D3A8] text-3xl font-bold"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Shop All Products
          </h1>
          <p
            className="mt-2 text-sm font-light text-[#A8A4B0]"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            {total} {total === 1 ? "product" : "products"} available
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-[120px]">
              <Suspense>
                <FilterSidebar />
              </Suspense>
            </div>
          </div>

          {/* Main */}
          <div className="flex-1 min-w-0">
            {/* Sort bar */}
            <div className="flex items-center justify-between mb-6">
              <p
                className="text-sm font-light text-[#A8A4B0]"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Showing{" "}
                <span className="text-[#F8F4EE]">{products.length}</span> of{" "}
                <span className="text-[#F8F4EE]">{total}</span> products
              </p>
              <Suspense>
                <SortDropdown />
              </Suspense>
            </div>

            {products.length > 0 ? (
              <ProductGrid products={products} columns={4} />
            ) : (
              <div className="text-center py-20">
                <p
                  className="text-lg text-[#E7D3A8] mb-2"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  No products found
                </p>
                <p
                  className="text-sm font-light text-[#A8A4B0]"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Try adjusting your filters or{" "}
                  <a href="/shop" className="text-[#9D4EDD] underline hover:text-[#E7D3A8] transition-colors">
                    clear all filters
                  </a>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
