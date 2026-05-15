import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { ProductGrid } from "@/components/product/ProductGrid";
import { FilterSidebar } from "@/components/shop/FilterSidebar";
import { SortDropdown } from "@/components/shop/SortDropdown";
import type { ProductCardData } from "@/types";
import type { Prisma } from "@prisma/client";

const CATEGORY_META: Record<
  string,
  { title: string; description: string; image: string; heroTitle: string; heroSub: string }
> = {
  bedsheets: {
    title: "Premium Bedsheets",
    description:
      "Shop our collection of premium cotton bedsheets. Percale and sateen weaves in sizes from Twin to California King.",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1400&q=85",
    heroTitle: "Bedsheets",
    heroSub: "Thread counts from 400–1000. Percale, sateen, and beyond.",
  },
  comforters: {
    title: "Comforter Sets",
    description:
      "Complete comforter and duvet sets for a beautifully dressed bed. Premium fills and covers.",
    image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1400&q=85",
    heroTitle: "Comforter Sets",
    heroSub: "Complete bed-in-a-bag sets that dress your room instantly.",
  },
  towels: {
    title: "Bath Towels",
    description:
      "Plush, absorbent cotton bath towels and sets in a rich spectrum of colours.",
    image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=1400&q=85",
    heroTitle: "Bath Towels",
    heroSub: "Plush and absorbent. Because you deserve the best after every shower.",
  },
  "gift-bundles": {
    title: "Gift Bundles",
    description:
      "Curated home textile gift sets. Perfect for weddings, housewarmings, and special occasions.",
    image: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=1400&q=85",
    heroTitle: "Gift Bundles",
    heroSub: "The perfect gift for any home — beautifully packaged and ready to give.",
  },
};

interface CategoryPageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const meta = CATEGORY_META[category];
  if (!meta) return { title: "Category Not Found" };
  return { title: meta.title, description: meta.description };
}

async function getProductsByCategory(
  category: string,
  searchParams: Record<string, string | string[] | undefined>
): Promise<{ products: ProductCardData[]; total: number }> {
  const sort = (searchParams.sort as string) ?? "newest";
  const maxPrice = parseFloat((searchParams.maxPrice as string) ?? "500");
  const sale = searchParams.sale === "true";
  const colorFilter = searchParams.color
    ? Array.isArray(searchParams.color)
      ? searchParams.color
      : [searchParams.color]
    : [];
  const sizeFilter = searchParams.size
    ? Array.isArray(searchParams.size)
      ? searchParams.size
      : [searchParams.size]
    : [];

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sort === "price_asc" ? { price: "asc" }
    : sort === "price_desc" ? { price: "desc" }
    : sort === "best_selling" ? { orderItems: { _count: "desc" } }
    : { createdAt: "desc" };

  const where: Prisma.ProductWhereInput = {
    isActive: true,
    category: { slug: category },
    price: { lte: maxPrice },
    ...(sale && { isOnSale: true }),
    ...(colorFilter.length > 0 && { variants: { some: { color: { in: colorFilter } } } }),
    ...(sizeFilter.length > 0 && { variants: { some: { size: { in: sizeFilter } } } }),
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

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { category } = await params;
  const sp = await searchParams;
  const meta = CATEGORY_META[category];
  if (!meta) notFound();

  const { products, total } = await getProductsByCategory(category, sp);

  return (
    <div className="min-h-screen bg-[#F9F7F4]">
      {/* Category hero */}
      <div className="bg-[#F9F7F4] relative overflow-hidden min-h-[40vh] flex items-end">
        <Image
          src={meta.image}
          alt={meta.heroTitle}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A2B20]/85 via-[#1A2B20]/40 to-transparent" />
        <div className="relative z-10 px-6 sm:px-12 lg:px-20 py-12">
          <h1
            className="font-bold text-white mb-3"
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
            }}
          >
            {meta.heroTitle}
          </h1>
          <p
            className="font-light text-white/75 text-lg max-w-md"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            {meta.heroSub}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <div className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-[120px]">
              <Suspense>
                <FilterSidebar />
              </Suspense>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <p
                className="text-sm font-light text-[#7A746D]"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                <span className="text-[#1A1714]">{total}</span> products
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
                  className="text-lg text-[#1A1714] mb-2"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  No products found
                </p>
                <p
                  className="text-sm font-light text-[#7A746D]"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  <a href={`/shop/${category}`} className="text-[#2C4A35] underline hover:text-[#1A1714] transition-colors">
                    Clear filters
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
