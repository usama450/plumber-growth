import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ProductDetailClient } from "./ProductDetailClient";
import { ProductGrid } from "@/components/product/ProductGrid";
import type { ProductCardData } from "@/types";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string) {
  try {
    return await prisma.product.findUnique({
      where: { slug, isActive: true },
      include: {
        images: { orderBy: { displayOrder: "asc" } },
        variants: true,
        category: true,
        reviews: {
          include: { user: { select: { name: true, image: true } } },
          orderBy: { createdAt: "desc" },
        },
        _count: { select: { reviews: true } },
      },
    });
  } catch {
    return null;
  }
}

async function getRelated(categoryId: string, excludeId: string): Promise<ProductCardData[]> {
  try {
  const products = await prisma.product.findMany({
    where: { categoryId, id: { not: excludeId }, isActive: true },
    take: 4,
    include: {
      images: { orderBy: { displayOrder: "asc" }, take: 2 },
      variants: { select: { size: true, color: true, stockQuantity: true } },
      category: { select: { name: true, slug: true } },
      _count: { select: { reviews: true } },
      reviews: { select: { rating: true } },
    },
  });
  return products.map((p) => {
    const avg = p.reviews.length > 0 ? p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length : 0;
    return {
      id: p.id, name: p.name, slug: p.slug,
      price: Number(p.price), comparePrice: p.comparePrice ? Number(p.comparePrice) : null,
      isOnSale: p.isOnSale, isFeatured: p.isFeatured,
      images: p.images, category: p.category, variants: p.variants,
      _count: p._count, avgRating: Math.round(avg * 10) / 10,
    };
  });
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.name,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 160),
      images: product.images[0] ? [{ url: product.images[0].imageUrl }] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const related = await getRelated(product.categoryId, product.id);
  const avgRating = product.reviews.length > 0
    ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length : 0;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map((i) => i.imageUrl),
    brand: { "@type": "Brand", name: "Khwab" },
    offers: {
      "@type": "Offer",
      price: Number(product.price).toFixed(2),
      priceCurrency: "CAD",
      availability: product.variants.some((v) => v.stockQuantity > 0)
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
    aggregateRating: product._count.reviews > 0
      ? { "@type": "AggregateRating", ratingValue: avgRating.toFixed(1), reviewCount: product._count.reviews }
      : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ProductDetailClient
        product={{
          ...product,
          price: Number(product.price),
          comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
          reviews: product.reviews.map((r) => ({
            ...r,
            user: { name: r.user.name, image: r.user.image },
          })),
          avgRating: Math.round(avgRating * 10) / 10,
        }}
      />
      {related.length > 0 && (
        <section className="py-16 bg-[#FAF7F2] border-t border-[#F7F3EE]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-playfair font-semibold text-[#1A1410] text-2xl mb-8"
              style={{ fontFamily: "var(--font-cormorant)" }}>
              You Might Also Like
            </h2>
            <ProductGrid products={related} columns={4} />
          </div>
        </section>
      )}
    </>
  );
}
