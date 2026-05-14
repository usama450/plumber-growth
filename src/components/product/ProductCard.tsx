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
      className={cn(
        "group relative bg-white rounded-xl overflow-hidden",
        "border border-[#E8DFF5]/60 hover:border-[#B8A4D4]/60",
        "shadow-[0_2px_12px_rgba(74,44,90,0.06)] hover:shadow-[0_8px_32px_rgba(74,44,90,0.12)]",
        "transition-all duration-300",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <Link href={`/product/${product.slug}`} className="block relative aspect-[4/5] overflow-hidden bg-[#E8DFF5]/30">
        {primaryImage && (
          <Image
            src={isHovered && hoverImage !== primaryImage ? hoverImage.imageUrl : primaryImage.imageUrl}
            alt={primaryImage.altText ?? product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isOnSale && discount > 0 && (
            <span className="px-2 py-0.5 bg-[#4A2C5A] text-white text-[11px] font-inter font-normal rounded-md">
              -{discount}%
            </span>
          )}
          {product.isFeatured && (
            <span className="px-2 py-0.5 bg-[#C9A961] text-white text-[11px] font-inter font-normal rounded-md">
              Featured
            </span>
          )}
          {isOutOfStock && (
            <span className="px-2 py-0.5 bg-[#8B8B8B] text-white text-[11px] font-inter font-normal rounded-md">
              Sold Out
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          onClick={(e) => { e.preventDefault(); setIsWishlisted(!isWishlisted); }}
          className={cn(
            "absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full",
            "bg-white/90 backdrop-blur-sm border border-[#E8DFF5]",
            "opacity-0 group-hover:opacity-100 transition-all duration-200",
            "hover:bg-[#E8DFF5] hover:border-[#B8A4D4]"
          )}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            size={14}
            className={cn(
              "transition-colors",
              isWishlisted ? "fill-[#4A2C5A] text-[#4A2C5A]" : "text-[#4A2C5A]"
            )}
          />
        </button>

        {/* Quick add overlay */}
        {!isOutOfStock && (
          <div className={cn(
            "absolute bottom-0 left-0 right-0 p-3 transition-all duration-300",
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          )}>
            <button
              onClick={handleQuickAdd}
              disabled={addingToCart}
              className={cn(
                "w-full flex items-center justify-center gap-2 py-2.5 rounded-lg",
                "bg-[#4A2C5A] text-white text-sm font-inter font-normal",
                "hover:bg-[#5B3A6B] transition-colors disabled:opacity-70"
              )}
              aria-label={`Quick add ${product.name} to cart`}
            >
              <ShoppingBag size={15} />
              {addingToCart ? "Adding..." : "Quick Add"}
            </button>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="p-3.5">
        <p className="text-[11px] text-[#8B8B8B] font-inter font-light uppercase tracking-wider mb-1">
          {product.category.name}
        </p>
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-sm font-inter font-light text-[#2A2A2A] hover:text-[#4A2C5A] transition-colors line-clamp-1 mb-2"
            style={{ fontFamily: "var(--font-inter)" }}>
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        {avgRating > 0 && (
          <div className="flex items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                size={11}
                className={cn(
                  i <= avgRating ? "fill-[#C9A961] text-[#C9A961]" : "text-[#D4C5B0]"
                )}
              />
            ))}
            <span className="text-[11px] text-[#8B8B8B] font-inter ml-0.5">
              ({product._count?.reviews ?? 0})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-inter font-normal text-[#4A2C5A]">
            {formatPrice(product.price)}
          </span>
          {product.comparePrice && product.comparePrice > product.price && (
            <span className="text-xs font-inter font-light text-[#8B8B8B] line-through">
              {formatPrice(product.comparePrice)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
