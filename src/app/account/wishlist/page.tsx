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
    <div className="min-h-screen bg-[#050507]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/account" className="text-sm font-inter font-light text-[#A8A4B0] hover:text-[#E7D3A8] transition-colors">
            ← My Account
          </Link>
          <span className="text-[#3A1A5C]">/</span>
          <h1 className="font-semibold text-[#E7D3A8] text-3xl"
            style={{ fontFamily: "var(--font-playfair)" }}>My Wishlist</h1>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="bg-[#150820] rounded-2xl p-12 border border-[#3A1A5C] text-center">
            <p className="text-4xl mb-4">♡</p>
            <p className="font-semibold text-[#E7D3A8] text-xl mb-2"
              style={{ fontFamily: "var(--font-playfair)" }}>Your wishlist is empty</p>
            <p className="text-sm font-inter font-light text-[#A8A4B0] mb-6">
              Save items you love and come back to them later.
            </p>
            <Link href="/shop"
              className="inline-block px-6 py-3 bg-[#5A189A] text-white text-sm font-inter font-normal rounded-xl hover:bg-[#7B3DBF] transition-colors">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {wishlistItems.map(({ product }) => (
              <Link key={product.id} href={`/product/${product.slug}`}
                className="bg-[#150820] rounded-2xl border border-[#3A1A5C] hover:border-[#5A189A] hover:shadow-[0_4px_16px_rgba(74,44,90,0.08)] transition-all overflow-hidden group">
                {product.images[0] ? (
                  <div className="aspect-square overflow-hidden bg-[#3A1A5C]/20">
                    <img src={product.images[0].imageUrl} alt={product.images[0].altText ?? product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                ) : (
                  <div className="aspect-square bg-[#3A1A5C]/20 flex items-center justify-center">
                    <span className="text-[#C4992E] text-4xl">🛏️</span>
                  </div>
                )}
                <div className="p-4">
                  <p className="text-xs font-inter font-light text-[#A8A4B0] mb-1">{product.category.name}</p>
                  <p className="text-sm font-inter font-normal text-[#F8F4EE] mb-2 line-clamp-2">{product.name}</p>
                  <p className="text-sm font-inter font-semibold text-[#E7D3A8]">
                    {formatPrice(Number(product.price))}
                    {product.comparePrice && (
                      <span className="ml-2 text-xs font-light text-[#A8A4B0] line-through">
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
