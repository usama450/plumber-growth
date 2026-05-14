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
  const discount = product.comparePrice ? getDiscountPercentage(product.price, product.comparePrice) : 0;
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
        name: product.name, slug: product.slug,
        image: primaryImage?.imageUrl ?? "",
        price: product.price,
        size: defaultVariant.size, color: defaultVariant.color,
        quantity: 1, sku: `${product.id}-default`,
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
        "group relative bg-white overflow-hidden",
        "transition-all duration-400",
        className
      )}
      style={{
        boxShadow: isHovered ? "0 20px 60px rgba(26,20,16,0.10)" : "0 2px 8px rgba(26,20,16,0.04)",
        transform: isHovered ? "translateY(-3px)" : "none",
        transition: "transform 0.4s cubic-bezier(0.25,0.1,0.25,1), box-shadow 0.4s cubic-bezier(0.25,0.1,0.25,1)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <Link href={`/product/${product.slug}`} className="block relative aspect-[4/5] overflow-hidden bg-[#EDE8DF]">
        {primaryImage && (
          <Image
            src={isHovered && hoverImage !== primaryImage ? hoverImage.imageUrl : primaryImage.imageUrl}
            alt={primaryImage.altText ?? product.name}
            fill
            className="object-cover transition-transform duration-600 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-[1.06]"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isOnSale && discount > 0 && (
            <span className="px-2.5 py-1 bg-[#1A1410] text-[#F7F3EE] text-[10px] tracking-[0.15em] uppercase"
              style={{ fontFamily: "var(--font-dm)" }}>
              -{discount}%
            </span>
          )}
          {isOutOfStock && (
            <span className="px-2.5 py-1 bg-[#9A9088] text-white text-[10px] tracking-[0.15em] uppercase"
              style={{ fontFamily: "var(--font-dm)" }}>
              Sold Out
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => { e.preventDefault(); setIsWishlisted(!isWishlisted); }}
          className={cn(
            "absolute top-3 right-3 w-8 h-8 flex items-center justify-center",
            "bg-white/90 backdrop-blur-sm border border-[#DDD5C9]",
            "opacity-0 group-hover:opacity-100 transition-all duration-300",
            "hover:border-[#C4992E]"
          )}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            size={13}
            className={cn("transition-colors", isWishlisted ? "fill-[#1A1410] text-[#1A1410]" : "text-[#1A1410]")}
          />
        </button>

        {/* Quick add */}
        {!isOutOfStock && (
          <div className={cn(
            "absolute bottom-0 left-0 right-0 transition-all duration-300",
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          )}>
            <button
              onClick={handleQuickAdd}
              disabled={addingToCart}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#1A1410] text-[#F7F3EE] text-[11px] tracking-[0.2em] uppercase hover:bg-[#2E2318] transition-colors disabled:opacity-70"
              style={{ fontFamily: "var(--font-dm)" }}
            >
              <ShoppingBag size={13} />
              {addingToCart ? "Adding..." : "Quick Add"}
            </button>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="p-4">
        <p className="text-[10px] text-[#9A9088] tracking-[0.25em] uppercase mb-1.5"
          style={{ fontFamily: "var(--font-dm)" }}>
          {product.category.name}
        </p>
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-[15px] text-[#1A1410] hover:text-[#2E2318] transition-colors line-clamp-1 mb-2.5 font-light"
            style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic" }}>
            {product.name}
          </h3>
        </Link>

        {avgRating > 0 && (
          <div className="flex items-center gap-1 mb-2.5">
            {[1,2,3,4,5].map((i) => (
              <Star key={i} size={10}
                className={cn(i <= avgRating ? "fill-[#C4992E] text-[#C4992E]" : "text-[#DDD5C9]")} />
            ))}
            <span className="text-[10px] text-[#9A9088] ml-0.5" style={{ fontFamily: "var(--font-dm)" }}>
              ({product._count?.reviews ?? 0})
            </span>
          </div>
        )}

        <div className="flex items-center gap-2.5">
          <span className="text-[15px] text-[#1A1410]" style={{ fontFamily: "var(--font-dm)", fontWeight: 500 }}>
            {formatPrice(product.price)}
          </span>
          {product.comparePrice && product.comparePrice > product.price && (
            <span className="text-[13px] text-[#9A9088] line-through" style={{ fontFamily: "var(--font-dm)" }}>
              {formatPrice(product.comparePrice)}
            </span>
          )}
          {product.isOnSale && discount > 0 && (
            <span className="text-[11px] text-[#C4992E]" style={{ fontFamily: "var(--font-dm)" }}>
              Save {discount}%
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
