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
      className={cn("group relative", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image wrapper — this IS the card */}
      <Link
        href={`/product/${product.slug}`}
        className="block relative aspect-[3/4] overflow-hidden bg-[#EDE8E1]"
      >
        {/* Product image */}
        {primaryImage ? (
          <Image
            src={
              isHovered && hoverImage !== primaryImage
                ? hoverImage.imageUrl
                : primaryImage.imageUrl
            }
            alt={primaryImage.altText ?? product.name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 bg-[#EDE8E1] flex items-center justify-center">
            <ShoppingBag size={40} className="text-[#B5AFA8]" />
          </div>
        )}

        {/* Top badges row */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between z-10">
          {/* Sale / stock badges */}
          <div className="flex flex-col gap-1.5">
            {product.isOnSale && discount > 0 && (
              <span
                className="px-2 py-0.5 text-[10px] tracking-[0.1em] uppercase rounded-none bg-[#2C4A35] text-white"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                -{discount}%
              </span>
            )}
            {isOutOfStock && (
              <span
                className="px-2 py-0.5 text-[10px] tracking-[0.1em] uppercase bg-[#F4F0EB] text-[#7A746D] border border-[#E2DDD7]"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Sold Out
              </span>
            )}
            {product.isFeatured && !product.isOnSale && !isOutOfStock && (
              <span
                className="px-2 py-0.5 text-[10px] tracking-[0.1em] uppercase bg-[#F4F0EB] text-[#7A746D] border border-[#E2DDD7]"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                New
              </span>
            )}
          </div>

          {/* Wishlist button — shows on hover only */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsWishlisted(!isWishlisted);
            }}
            className={cn(
              "w-8 h-8 flex items-center justify-center rounded-full border border-[#E2DDD7]/70 bg-white/80 backdrop-blur-sm transition-all duration-300",
              isWishlisted
                ? "opacity-100"
                : "opacity-0 group-hover:opacity-100"
            )}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              size={14}
              className={
                isWishlisted
                  ? "fill-[#A67C3C] text-[#A67C3C]"
                  : "text-[#5A554F]"
              }
            />
          </button>
        </div>

        {/* Quick Add — slides up from bottom on hover */}
        {!isOutOfStock && (
          <div
            className="absolute bottom-0 left-0 right-0 z-10 overflow-hidden transition-all duration-300 ease-out"
            style={{ maxHeight: isHovered ? "44px" : "0px" }}
          >
            <button
              onClick={handleQuickAdd}
              disabled={addingToCart}
              className="w-full py-3 bg-[#1A1714]/90 backdrop-blur-sm text-[#F9F7F4] text-[11px] tracking-[0.14em] uppercase flex items-center justify-center gap-2 transition-all disabled:opacity-70"
              style={{ fontFamily: "var(--font-inter)", fontWeight: 500 }}
            >
              <ShoppingBag size={12} />
              {addingToCart ? "Adding…" : "Quick Add"}
            </button>
          </div>
        )}
      </Link>

      {/* Text below image — clean, minimal */}
      <div className="pt-3 pb-1">
        {/* Category */}
        <p
          className="text-[10px] tracking-[0.22em] uppercase text-[#7A746D] mb-1"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          {product.category.name}
        </p>

        {/* Product name */}
        <h3
          className="text-[14px] text-[#1A1714] leading-snug line-clamp-2 mb-2"
          style={{ fontFamily: "var(--font-playfair)", fontWeight: 400 }}
        >
          {product.name}
        </h3>

        {/* Price row */}
        <div className="flex items-center flex-wrap gap-1">
          <span
            className="text-[14px] text-[#1A1714]"
            style={{ fontFamily: "var(--font-inter)", fontWeight: 400 }}
          >
            {formatPrice(product.price)}
          </span>
          {product.comparePrice && product.comparePrice > product.price && (
            <span
              className="text-[12px] text-[#B5AFA8] line-through ml-2"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {formatPrice(product.comparePrice)}
            </span>
          )}

          {/* Stars */}
          {avgRating > 0 && (
            <div className="flex items-center gap-0.5 ml-auto">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  size={9}
                  className={cn(
                    i <= Math.round(avgRating)
                      ? "fill-[#A67C3C] text-[#A67C3C]"
                      : "fill-[#E2DDD7] text-[#E2DDD7]"
                  )}
                />
              ))}
              <span
                className="text-[9px] text-[#B5AFA8] ml-0.5"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                ({product._count?.reviews ?? 0})
              </span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
