import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "My Wishlist" };

export default async function WishlistPage() {
  const session = await auth();
  if (!session) redirect("/login?callbackUrl=/account/wishlist");

  const wishlistItems = await prisma.wishlist.findMany({
    where: { userId: session.user.id },
    include: {
      product: {
        include: {
          images: { orderBy: { displayOrder: "asc" }, take: 1 },
          category: { select: { name: true, slug: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/account" className="text-sm font-inter font-light text-[#8B8B8B] hover:text-[#4A2C5A] transition-colors">
            ← My Account
          </Link>
          <span className="text-[#D4C5B0]">/</span>
          <h1 className="font-playfair font-semibold text-[#4A2C5A] text-3xl"
            style={{ fontFamily: "var(--font-playfair)" }}>My Wishlist</h1>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-[#E8DFF5] text-center">
            <p className="text-4xl mb-4">♡</p>
            <p className="font-playfair font-semibold text-[#4A2C5A] text-xl mb-2"
              style={{ fontFamily: "var(--font-playfair)" }}>Your wishlist is empty</p>
            <p className="text-sm font-inter font-light text-[#8B8B8B] mb-6">
              Save items you love and come back to them later.
            </p>
            <Link href="/shop"
              className="inline-block px-6 py-3 bg-[#4A2C5A] text-white text-sm font-inter font-normal rounded-xl hover:bg-[#5B3A6B] transition-colors">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {wishlistItems.map(({ product }) => (
              <Link key={product.id} href={`/product/${product.slug}`}
                className="bg-white rounded-2xl border border-[#E8DFF5]/60 hover:border-[#B8A4D4] hover:shadow-[0_4px_16px_rgba(74,44,90,0.08)] transition-all overflow-hidden group">
                {product.images[0] ? (
                  <div className="aspect-square overflow-hidden bg-[#E8DFF5]/20">
                    <img src={product.images[0].imageUrl} alt={product.images[0].altText ?? product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                ) : (
                  <div className="aspect-square bg-[#E8DFF5]/20 flex items-center justify-center">
                    <span className="text-[#B8A4D4] text-4xl">🛏️</span>
                  </div>
                )}
                <div className="p-4">
                  <p className="text-xs font-inter font-light text-[#8B8B8B] mb-1">{product.category.name}</p>
                  <p className="text-sm font-inter font-normal text-[#2A2A2A] mb-2 line-clamp-2">{product.name}</p>
                  <p className="text-sm font-inter font-semibold text-[#4A2C5A]">
                    {formatPrice(Number(product.price))}
                    {product.comparePrice && (
                      <span className="ml-2 text-xs font-light text-[#8B8B8B] line-through">
                        {formatPrice(Number(product.comparePrice))}
                      </span>
                    )}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
