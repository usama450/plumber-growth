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
      className={cn("group relative bg-white rounded-[8px] overflow-hidden", className)}
      style={{
        border: isHovered ? "1px solid #E8DFF5" : "1px solid transparent",
        boxShadow: isHovered
          ? "0 12px 40px rgba(26,10,38,0.12)"
          : "0 2px 8px rgba(26,10,38,0.04)",
        transform: isHovered ? "translateY(-4px)" : "none",
        transition:
          "transform 0.4s cubic-bezier(0.25,0.1,0.25,1), box-shadow 0.4s cubic-bezier(0.25,0.1,0.25,1), border-color 0.4s",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image area */}
      <Link
        href={`/product/${product.slug}`}
        className="block relative aspect-[4/5] bg-[#F5EFE5] overflow-hidden rounded-t-[8px]"
      >
        {primaryImage && (
          <Image
            src={
              isHovered && hoverImage !== primaryImage
                ? hoverImage.imageUrl
                : primaryImage.imageUrl
            }
            alt={primaryImage.altText ?? product.name}
            fill
            className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-[1.05]"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        )}

        {/* Badges top-left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isOnSale && discount > 0 && (
            <span
              className="px-2.5 py-1 bg-[#1A0826] text-[#E7D3A8] text-[10px] tracking-[0.15em] uppercase"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              -{discount}%
            </span>
          )}
          {isOutOfStock && (
            <span
              className="px-2.5 py-1 bg-[#8B8B8B] text-white text-[10px] tracking-[0.15em] uppercase"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Sold Out
            </span>
          )}
        </div>

        {/* Wishlist button top-right */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsWishlisted(!isWishlisted);
          }}
          className={cn(
            "absolute top-3 right-3 w-8 h-8 flex items-center justify-center",
            "bg-white/90 backdrop-blur-sm border border-[#E8DFF5]",
            "opacity-0 group-hover:opacity-100 transition-all duration-300",
            "hover:border-[#C9A961]"
          )}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            size={13}
            className={cn(
              "transition-colors",
              isWishlisted ? "fill-[#1A1A1A] text-[#1A1A1A]" : "text-[#1A1A1A]"
            )}
          />
        </button>

        {/* Quick Add button bottom */}
        {!isOutOfStock && (
          <div
            className={cn(
              "absolute bottom-0 left-0 right-0 transition-all duration-300",
              isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            )}
          >
            <button
              onClick={handleQuickAdd}
              disabled={addingToCart}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#5A189A] text-[#F8F4EE] text-[11px] tracking-[0.2em] uppercase hover:bg-[#7B3DBF] transition-colors disabled:opacity-70"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              <ShoppingBag size={13} />
              {addingToCart ? "Adding..." : "Quick Add"}
            </button>
          </div>
        )}
      </Link>

      {/* Info area */}
      <div className="p-4">
        {/* Category label */}
        <p
          className="text-[10px] text-[#8B8B8B] tracking-[0.25em] uppercase mb-1"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          {product.category.name}
        </p>

        {/* Product name */}
        <Link href={`/product/${product.slug}`}>
          <h3
            className="text-[15px] text-[#1A1A1A] hover:text-[#5A189A] transition-colors line-clamp-1 mb-2 font-normal italic"
            style={{ fontFamily: "var(--font-playfair)", fontWeight: 400 }}
          >
            {product.name}
          </h3>
        </Link>

        {/* Star rating */}
        {avgRating > 0 && (
          <div className="flex items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                size={10}
                className={cn(
                  i <= avgRating
                    ? "fill-[#C9A961] text-[#C9A961]"
                    : "text-[#C9A961]/30"
                )}
              />
            ))}
            <span
              className="text-[10px] text-[#8B8B8B] ml-0.5"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              ({product._count?.reviews ?? 0})
            </span>
          </div>
        )}

        {/* Price row */}
        <div className="flex items-center gap-2.5">
          <span
            className="text-[15px] text-[#5A189A]"
            style={{ fontFamily: "var(--font-inter)", fontWeight: 500 }}
          >
            {formatPrice(product.price)}
          </span>
          {product.comparePrice && product.comparePrice > product.price && (
            <span
              className="text-[13px] text-[#8B8B8B] line-through"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {formatPrice(product.comparePrice)}
            </span>
          )}
          {product.isFeatured && (
            <Star
              size={10}
              className="fill-[#C9A961] text-[#C9A961] shrink-0"
            />
          )}
        </div>
      </div>
    </article>
  );
}
