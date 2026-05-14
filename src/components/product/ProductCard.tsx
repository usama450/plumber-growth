"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { cn, formatPrice, getDiscountPercentage } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { toast } from "@/components/common/Toaster";
import type { ProductCardData } from "@/types";

interface ProductCardProps {
  product: ProductCardData;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const { addItem } = useCartStore();

  const primaryImage = product.images[0];
  const hoverImage = product.images[1] ?? product.images[0];
  const discount = product.comparePrice
    ? getDiscountPercentage(product.price, product.comparePrice)
    : 0;
  const defaultVariant = product.variants.find((v) => v.stockQuantity > 0);
  const isOutOfStock = product.variants.every((v) => v.stockQuantity === 0);
  const avgRating = product.avgRating ?? 0;

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!defaultVariant || isOutOfStock) return;
    setAddingToCart(true);
    try {
      addItem({
        id: `${product.id}-${defaultVariant.size}-${defaultVariant.color}`,
        productId: product.id,
        variantId: `${product.id}-${defaultVariant.size ?? "default"}`,
        name: product.name,
        slug: product.slug,
        image: primaryImage?.imageUrl ?? "",
        price: product.price,
        size: defaultVariant.size,
        color: defaultVariant.color,
        quantity: 1,
        sku: `${product.id}-default`,
        maxStock: defaultVariant.stockQuantity,
      });
      toast.success("Added to cart!");
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <article
      className={cn("group relative overflow-hidden rounded-2xl", className)}
      style={{
        boxShadow: isHovered
          ? "0 20px 60px rgba(5,0,7,0.7), 0 0 0 1px rgba(231,211,168,0.15)"
          : "0 4px 20px rgba(5,0,7,0.4), 0 0 0 1px rgba(58,26,92,0.3)",
        transform: isHovered ? "translateY(-6px) scale(1.01)" : "translateY(0) scale(1)",
        transition: "transform 0.4s cubic-bezier(0.25,0.1,0.25,1), box-shadow 0.4s cubic-bezier(0.25,0.1,0.25,1)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Full card is the image link — info overlays at bottom */}
      <Link href={`/product/${product.slug}`} className="block relative aspect-[3/4] bg-[#150820]">

        {/* Product image */}
        {primaryImage ? (
          <Image
            src={isHovered && hoverImage !== primaryImage ? hoverImage.imageUrl : primaryImage.imageUrl}
            alt={primaryImage.altText ?? product.name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          /* Placeholder when no image */
          <div className="absolute inset-0 bg-gradient-to-br from-[#2A0F3D] to-[#150820] flex items-center justify-center">
            <ShoppingBag size={40} className="text-[#3A1A5C]" />
          </div>
        )}

        {/* Permanent subtle gradient at bottom for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-[#050507]/50 via-40% to-transparent" />

        {/* Hover gradient intensifies */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#1A0826]/80 via-transparent to-transparent transition-opacity duration-400"
          style={{ opacity: isHovered ? 1 : 0 }}
        />

        {/* Top badges row */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between z-10">
          {/* Sale / stock badge */}
          <div className="flex flex-col gap-1.5">
            {product.isOnSale && discount > 0 && (
              <span
                className="px-2.5 py-1 rounded-full text-[10px] tracking-[0.12em] uppercase font-medium"
                style={{
                  fontFamily: "var(--font-inter)",
                  background: "linear-gradient(135deg, #5A189A, #7B3DBF)",
                  color: "#F8F4EE",
                }}
              >
                -{discount}%
              </span>
            )}
            {isOutOfStock && (
              <span
                className="px-2.5 py-1 rounded-full bg-[#1A0826]/80 backdrop-blur text-[#A8A4B0] text-[10px] tracking-[0.12em] uppercase border border-[#3A1A5C]"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Sold Out
              </span>
            )}
            {product.isFeatured && !product.isOnSale && (
              <span
                className="px-2.5 py-1 rounded-full text-[10px] tracking-[0.12em] uppercase"
                style={{
                  fontFamily: "var(--font-inter)",
                  background: "rgba(201,169,97,0.15)",
                  border: "1px solid rgba(201,169,97,0.4)",
                  color: "#C9A961",
                }}
              >
                New
              </span>
            )}
          </div>

          {/* Wishlist button */}
          <button
            onClick={(e) => { e.preventDefault(); setIsWishlisted(!isWishlisted); }}
            className={cn(
              "w-9 h-9 flex items-center justify-center rounded-full backdrop-blur-md border transition-all duration-300",
              isWishlisted
                ? "bg-[#5A189A]/60 border-[#C9A961] opacity-100"
                : "bg-[#050507]/50 border-[#3A1A5C] opacity-0 group-hover:opacity-100 hover:border-[#C9A961]"
            )}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              size={14}
              className={isWishlisted ? "fill-[#C9A961] text-[#C9A961]" : "text-[#A8A4B0]"}
            />
          </button>
        </div>

        {/* Overlay info — always visible, sitting on gradient */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-4">
          {/* Category */}
          <p
            className="text-[9px] tracking-[0.28em] uppercase text-[#A8A4B0] mb-1.5"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            {product.category.name}
          </p>

          {/* Product name */}
          <h3
            className="text-[15px] text-[#F8F4EE] group-hover:text-[#E7D3A8] transition-colors leading-snug line-clamp-1 mb-2"
            style={{ fontFamily: "var(--font-playfair)", fontWeight: 400 }}
          >
            {product.name}
          </h3>

          {/* Stars + price row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Price */}
              <span
                className="text-[15px] text-[#E7D3A8]"
                style={{ fontFamily: "var(--font-inter)", fontWeight: 500 }}
              >
                {formatPrice(product.price)}
              </span>
              {product.comparePrice && product.comparePrice > product.price && (
                <span
                  className="text-[12px] text-[#6B6475] line-through"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {formatPrice(product.comparePrice)}
                </span>
              )}
            </div>

            {/* Stars (compact) */}
            {avgRating > 0 && (
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    size={9}
                    className={cn(
                      i <= Math.round(avgRating)
                        ? "fill-[#C9A961] text-[#C9A961]"
                        : "text-[#3A1A5C] fill-[#3A1A5C]"
                    )}
                  />
                ))}
                <span className="text-[9px] text-[#6B6475] ml-0.5" style={{ fontFamily: "var(--font-inter)" }}>
                  ({product._count?.reviews ?? 0})
                </span>
              </div>
            )}
          </div>

          {/* Quick Add — slides up on hover */}
          {!isOutOfStock && (
            <div
              className="overflow-hidden transition-all duration-300 ease-out"
              style={{ maxHeight: isHovered ? "48px" : "0px", marginTop: isHovered ? "10px" : "0px" }}
            >
              <button
                onClick={handleQuickAdd}
                disabled={addingToCart}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-[11px] tracking-[0.18em] uppercase transition-all disabled:opacity-70"
                style={{
                  fontFamily: "var(--font-inter)",
                  fontWeight: 500,
                  background: "linear-gradient(135deg, rgba(90,24,154,0.85), rgba(123,61,191,0.85))",
                  border: "1px solid rgba(231,211,168,0.2)",
                  color: "#F8F4EE",
                  backdropFilter: "blur(8px)",
                }}
              >
                <ShoppingBag size={12} />
                {addingToCart ? "Adding…" : "Quick Add"}
              </button>
            </div>
          )}
        </div>

        {/* Gold shimmer line at top on hover */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] transition-opacity duration-300"
          style={{
            background: "linear-gradient(to right, transparent, #C9A961, transparent)",
            opacity: isHovered ? 1 : 0,
          }}
        />
      </Link>
    </article>
  );
}
