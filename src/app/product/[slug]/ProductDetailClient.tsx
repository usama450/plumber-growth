"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  Heart,
  Minus,
  Plus,
  ChevronRight,
  ShoppingBag,
  Truck,
  RotateCcw,
  MapPin,
} from "lucide-react";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/cart";
import { toast } from "@/components/common/Toaster";
import { formatPrice, getDiscountPercentage, cn } from "@/lib/utils";

interface ProductImage {
  id: string;
  imageUrl: string;
  altText: string | null;
  displayOrder: number;
}
interface ProductVariant {
  id: string;
  size: string | null;
  color: string | null;
  sku: string;
  stockQuantity: number;
  priceModifier: unknown;
}
interface Review {
  id: string;
  rating: number;
  title: string | null;
  comment: string;
  createdAt: Date;
  isVerifiedPurchase: boolean;
  user: { name: string | null; image: string | null };
}

interface ProductDetailProps {
  product: {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    comparePrice: number | null;
    isOnSale: boolean;
    material: string | null;
    careInstructions: string | null;
    threadCount: number | null;
    category: { name: string; slug: string };
    images: ProductImage[];
    variants: ProductVariant[];
    reviews: Review[];
    avgRating: number;
    _count: { reviews: number };
  };
}

const COLOR_MAP: Record<string, string> = {
  white: "#F8F4EE",
  cream: "#F5EFE5",
  ivory: "#FFFFF0",
  black: "#1A1A1A",
  grey: "#8B8B8B",
  gray: "#8B8B8B",
  navy: "#1B2A4A",
  blue: "#3A6B9F",
  "light blue": "#AEC6CF",
  green: "#6B8E4E",
  sage: "#87A878",
  blush: "#F4C2C2",
  pink: "#F4A7B9",
  lavender: "#E8DFF5",
  purple: "#5A189A",
  burgundy: "#800020",
  red: "#B85450",
  gold: "#C9A961",
  champagne: "#E7D3A8",
  brown: "#8B5E3C",
  taupe: "#B09080",
  charcoal: "#36454F",
};

function getColorHex(color: string): string | null {
  const key = color.toLowerCase().trim();
  return COLOR_MAP[key] ?? null;
}

export function ProductDetailClient({ product }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "care" | "shipping">("description");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [stickyVisible, setStickyVisible] = useState(false);

  const addToCartBtnRef = useRef<HTMLButtonElement>(null);
  const { addItem } = useCartStore();

  const sizes = [...new Set(product.variants.map((v) => v.size).filter(Boolean))] as string[];
  const colors = [...new Set(product.variants.map((v) => v.color).filter(Boolean))] as string[];
  const discount = product.comparePrice ? getDiscountPercentage(product.price, product.comparePrice) : 0;

  const selectedVariant = product.variants.find(
    (v) =>
      (sizes.length === 0 || v.size === selectedSize) &&
      (colors.length === 0 || v.color === selectedColor)
  );

  const isOutOfStock = selectedVariant
    ? selectedVariant.stockQuantity === 0
    : product.variants.every((v) => v.stockQuantity === 0);

  useEffect(() => {
    const el = addToCartBtnRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setStickyVisible(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleAddToCart = async () => {
    if ((sizes.length > 0 && !selectedSize) || (colors.length > 0 && !selectedColor)) {
      toast.error("Please select all options before adding to cart.");
      return;
    }
    if (isOutOfStock) {
      toast.error("This item is out of stock.");
      return;
    }
    setAddingToCart(true);
    try {
      addItem({
        id: `${product.id}-${selectedVariant?.id ?? "default"}`,
        productId: product.id,
        variantId: selectedVariant?.id ?? product.id,
        name: product.name,
        slug: product.slug,
        image: product.images[0]?.imageUrl ?? "",
        price: product.price,
        size: selectedSize,
        color: selectedColor,
        quantity,
        sku: selectedVariant?.sku ?? product.id,
        maxStock: selectedVariant?.stockQuantity ?? 99,
      });
      toast.success(`${product.name} added to cart!`);
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <div className="bg-[#050507] py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav
          className="flex items-center gap-1.5 text-xs mb-8"
          style={{ fontFamily: "var(--font-inter)" }}
          aria-label="Breadcrumb"
        >
          <Link href="/" className="text-[#5A189A] hover:underline transition-colors">
            Home
          </Link>
          <ChevronRight size={12} className="text-[#6B6475]" />
          <Link href="/shop" className="text-[#5A189A] hover:underline transition-colors">
            Shop
          </Link>
          <ChevronRight size={12} className="text-[#6B6475]" />
          <Link
            href={`/shop/${product.category.slug}`}
            className="text-[#5A189A] hover:underline transition-colors capitalize"
          >
            {product.category.name}
          </Link>
          <ChevronRight size={12} className="text-[#6B6475]" />
          <span className="text-[#6B6475] line-clamp-1">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Gallery */}
          <div className="space-y-3">
            <div className="relative aspect-square rounded-[12px] overflow-hidden bg-[#150820] shadow-[0_8px_40px_rgba(5,0,7,0.4)]">
              {product.images[selectedImage] && (
                <Image
                  src={product.images[selectedImage].imageUrl}
                  alt={product.images[selectedImage].altText ?? product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              )}
              {isOutOfStock && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="px-4 py-2 bg-[#050507]/90 rounded-full text-sm text-[#A8A4B0]"
                    style={{ fontFamily: "var(--font-inter)" }}>
                    Out of Stock
                  </span>
                </div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(i)}
                    className={cn(
                      "aspect-square rounded-[8px] overflow-hidden transition-all ring-offset-[#050507]",
                      i === selectedImage
                        ? "ring-2 ring-[#E7D3A8]"
                        : "hover:ring-1 hover:ring-[#C9A961]"
                    )}
                    aria-label={`View image ${i + 1}`}
                  >
                    <Image
                      src={img.imageUrl}
                      alt={img.altText ?? `${product.name} ${i + 1}`}
                      width={120}
                      height={120}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <motion.div
            className="lg:pt-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Category */}
            <p
              className="text-[10px] tracking-[0.35em] uppercase text-[#9D4EDD] mb-2"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {product.category.name}
            </p>

            {/* Product name */}
            <h1
              className="text-[#E7D3A8] text-2xl sm:text-3xl font-bold mb-3"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    size={14}
                    className={cn(
                      i <= Math.round(product.avgRating)
                        ? "fill-[#C9A961] text-[#C9A961]"
                        : "text-[#C9A961]/30 fill-[#C9A961]/10"
                    )}
                  />
                ))}
              </div>
              <span
                className="text-sm text-[#A8A4B0]"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {product._count.reviews > 0
                  ? `${product.avgRating.toFixed(1)} (${product._count.reviews} ${product._count.reviews === 1 ? "review" : "reviews"})`
                  : "No reviews yet"}
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span
                className="text-2xl text-[#E7D3A8] font-medium"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {formatPrice(product.price)}
              </span>
              {product.comparePrice && product.comparePrice > product.price && (
                <>
                  <span
                    className="text-lg text-[#6B6475] line-through"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {formatPrice(product.comparePrice)}
                  </span>
                  <span
                    className="bg-gradient-to-r from-[#5A189A] to-[#7B3DBF] text-[#F8F4EE] text-xs px-2 py-0.5 rounded"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    Save {discount}%
                  </span>
                </>
              )}
            </div>

            {/* Color selector */}
            {colors.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] tracking-[0.25em] uppercase text-[#A8A4B0]" style={{ fontFamily: "var(--font-inter)" }}>
                    Color
                  </span>
                  {selectedColor && (
                    <span className="text-[13px] text-[#E7D3A8] capitalize" style={{ fontFamily: "var(--font-inter)" }}>
                      {selectedColor}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-3 mb-3">
                  {colors.map((color) => {
                    const hex = getColorHex(color);
                    const isSelected = selectedColor === color;
                    if (hex) {
                      return (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          title={color}
                          aria-label={`Select color ${color}`}
                          aria-pressed={isSelected}
                          className={cn(
                            "w-10 h-10 rounded-full border-2 transition-all ring-offset-2 ring-offset-[#050507]",
                            isSelected
                              ? "border-transparent ring-2 ring-[#E7D3A8]"
                              : "border-transparent hover:border-[#C9A961]"
                          )}
                          style={{ backgroundColor: hex }}
                        />
                      );
                    }
                    return (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        aria-pressed={isSelected}
                        className={cn(
                          "px-4 py-2 rounded-full text-[12px] tracking-wide capitalize transition-all border",
                          isSelected
                            ? "bg-[#5A189A] text-[#F8F4EE] border-[#5A189A] shadow-[0_0_16px_rgba(90,24,154,0.4)]"
                            : "bg-[#150820] text-[#A8A4B0] border-[#3A1A5C] hover:border-[#5A189A] hover:text-[#F8F4EE]"
                        )}
                        style={{ fontFamily: "var(--font-inter)" }}
                      >
                        {color}
                      </button>
                    );
                  })}
                </div>
                {/* 12px color bar showing selected color */}
                {selectedColor && getColorHex(selectedColor) && (
                  <div className="h-3 rounded-full overflow-hidden bg-[#150820] border border-[#3A1A5C]">
                    <div
                      className="h-full rounded-full"
                      style={{ backgroundColor: getColorHex(selectedColor)!, width: "100%" }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Size selector */}
            {sizes.length > 0 && (
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2.5">
                  <span
                    className="text-[11px] tracking-[0.25em] uppercase text-[#A8A4B0]"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    Size
                  </span>
                  {selectedSize && (
                    <span
                      className="text-[13px] text-[#E7D3A8]"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {selectedSize}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => {
                    const hasStock = product.variants.some(
                      (v) => v.size === size && v.stockQuantity > 0
                    );
                    return (
                      <button
                        key={size}
                        onClick={() => hasStock && setSelectedSize(size)}
                        disabled={!hasStock}
                        aria-pressed={selectedSize === size}
                        className={cn(
                          "px-5 py-2.5 rounded-full text-[12px] tracking-wide transition-all border",
                          selectedSize === size
                            ? "bg-gradient-to-r from-[#5A189A] to-[#7B3DBF] text-[#F8F4EE] border-transparent shadow-[0_0_20px_rgba(90,24,154,0.4)]"
                            : hasStock
                            ? "bg-[#150820] text-[#A8A4B0] border-[#3A1A5C] hover:border-[#5A189A] hover:text-[#F8F4EE]"
                            : "bg-[#0D0415] text-[#6B6475] border-[#1A0826] cursor-not-allowed line-through"
                        )}
                        style={{ fontFamily: "var(--font-inter)" }}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <span
                className="text-[11px] tracking-[0.25em] uppercase text-[#A8A4B0] block mb-2.5"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Quantity
              </span>
              <div className="inline-flex items-center bg-[#150820] border border-[#3A1A5C] rounded-full overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-11 h-11 flex items-center justify-center text-[#A8A4B0] hover:text-[#E7D3A8] hover:bg-[#2A0F3D] transition-colors rounded-full"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span
                  className="w-12 text-center text-sm text-[#F8F4EE]"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity(Math.min(selectedVariant?.stockQuantity ?? 99, quantity + 1))
                  }
                  disabled={!!selectedVariant && quantity >= selectedVariant.stockQuantity}
                  className="w-11 h-11 flex items-center justify-center text-[#A8A4B0] hover:text-[#E7D3A8] hover:bg-[#2A0F3D] transition-colors rounded-full disabled:opacity-40"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>
              {selectedVariant &&
                selectedVariant.stockQuantity <= 5 &&
                selectedVariant.stockQuantity > 0 && (
                  <p
                    className="text-xs text-[#B85450] mt-2"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    Only {selectedVariant.stockQuantity} left in stock!
                  </p>
                )}
            </div>

            {/* Add to cart + wishlist */}
            <div className="flex gap-3 mb-6">
              <button
                ref={addToCartBtnRef}
                onClick={handleAddToCart}
                disabled={addingToCart || isOutOfStock}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-4 text-sm tracking-[0.12em] uppercase transition-all rounded-[6px] border border-[#E7D3A8]/25 disabled:opacity-60 disabled:cursor-not-allowed",
                  isOutOfStock
                    ? "bg-[#2A0F3D]/40 text-[#A8A4B0] cursor-not-allowed"
                    : "bg-gradient-to-r from-[#5A189A] to-[#7B3DBF] text-[#F8F4EE] hover:brightness-110 hover:shadow-[0_8px_32px_rgba(90,24,154,0.5)]"
                )}
                style={{ fontFamily: "var(--font-inter)", fontWeight: 500 }}
              >
                <ShoppingBag size={17} />
                {isOutOfStock ? "Out of Stock" : addingToCart ? "Adding..." : "Add to Cart"}
              </button>
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={cn(
                  "btn-icon",
                  isWishlisted && "!bg-[#5A189A]/30 !border-[#C9A961]"
                )}
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart size={18} className={cn(isWishlisted ? "fill-[#C9A961] text-[#C9A961]" : "text-[#A8A4B0]")} />
              </button>
            </div>

            {/* Trust badges */}
            <div className="space-y-3 py-5 border-y border-[#3A1A5C]">
              {[
                { Icon: Truck, text: "Free Shipping over $125" },
                { Icon: RotateCcw, text: "Free 30-Day Returns" },
                { Icon: MapPin, text: "Canadian Made" },
              ].map(({ Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <Icon size={16} className="text-[#9D4EDD] shrink-0" />
                  <span
                    className="text-[13px] font-light text-[#A8A4B0]"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="mt-12 lg:mt-16">
          <div className="flex border-b border-[#3A1A5C]">
            {(
              [
                { key: "description", label: "Description" },
                { key: "care", label: "Materials & Care" },
                { key: "shipping", label: "Shipping & Returns" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn("btn-tab", activeTab === tab.key && "active")}
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="py-6 max-w-2xl">
            {activeTab === "description" && (
              <div
                className="text-sm text-[#A8A4B0] leading-relaxed space-y-3 font-light"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                <p>{product.description}</p>
                {product.threadCount && (
                  <p>
                    <strong className="font-medium text-[#E7D3A8]">Thread Count:</strong>{" "}
                    {product.threadCount} TC
                  </p>
                )}
                {product.material && (
                  <p>
                    <strong className="font-medium text-[#E7D3A8]">Material:</strong>{" "}
                    {product.material}
                  </p>
                )}
              </div>
            )}
            {activeTab === "care" && (
              <div
                className="text-sm text-[#A8A4B0] leading-relaxed font-light space-y-2"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {product.careInstructions ? (
                  <p>{product.careInstructions}</p>
                ) : (
                  <ul className="space-y-2">
                    {[
                      "Machine wash warm with like colours",
                      "Tumble dry low",
                      "Do not bleach",
                      "Iron on medium if needed",
                      "Do not dry clean",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <span className="text-[#C9A961]">✦</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            {activeTab === "shipping" && (
              <div
                className="text-sm text-[#A8A4B0] leading-relaxed font-light space-y-3"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                <p>
                  <strong className="font-medium text-[#E7D3A8]">Free shipping</strong> on all orders over $125
                  CAD across Canada.
                </p>
                <p>
                  Orders under $125 ship for a flat <strong className="font-medium text-[#E7D3A8]">$15 CAD</strong>.
                </p>
                <p>
                  Most orders ship within 1–2 business days. Delivery takes 3–7 business days
                  depending on your location.
                </p>
                <p>
                  We offer <strong className="font-medium text-[#E7D3A8]">free 30-day returns</strong> on all
                  unwashed, unused items in original packaging.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-8 pt-8 border-t border-[#3A1A5C]">
          <h2
            className="text-[#E7D3A8] text-xl font-bold mb-6"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Customer Reviews
            {product._count.reviews > 0 && ` (${product._count.reviews})`}
          </h2>

          {product.reviews.length === 0 ? (
            <div className="text-center py-12">
              <p
                className="text-[#A8A4B0] mb-4"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Be the first to review this product
              </p>
              <button
                className="px-6 py-3 border border-[#5A189A] text-[#5A189A] text-sm tracking-[0.1em] uppercase rounded-[4px] hover:bg-[#5A189A]/10 transition-all"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Write a Review
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {product.reviews.slice(0, 5).map((review) => (
                <div
                  key={review.id}
                  className="bg-[#150820] rounded-xl p-5 border border-[#3A1A5C]"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-0.5 mb-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star
                            key={i}
                            size={13}
                            className={cn(
                              i <= review.rating
                                ? "fill-[#C9A961] text-[#C9A961]"
                                : "text-[#C9A961]/30 fill-[#C9A961]/10"
                            )}
                          />
                        ))}
                      </div>
                      {review.title && (
                        <h4
                          className="text-sm font-medium text-[#E7D3A8]"
                          style={{ fontFamily: "var(--font-inter)" }}
                        >
                          {review.title}
                        </h4>
                      )}
                    </div>
                    <div className="text-right">
                      <p
                        className="text-sm font-light text-[#A8A4B0]"
                        style={{ fontFamily: "var(--font-inter)" }}
                      >
                        {review.user.name}
                      </p>
                      {review.isVerifiedPurchase && (
                        <span
                          className="text-[11px] text-[#6B8E4E]"
                          style={{ fontFamily: "var(--font-inter)" }}
                        >
                          ✓ Verified Purchase
                        </span>
                      )}
                    </div>
                  </div>
                  <p
                    className="text-sm font-light text-[#A8A4B0] leading-relaxed"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile sticky CTA */}
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-[#050507]/95 backdrop-blur-xl border-t border-[#3A1A5C] px-4 py-3 flex gap-3 transition-transform duration-200",
          stickyVisible ? "translate-y-0" : "translate-y-full"
        )}
      >
        <div className="flex-1 min-w-0">
          <p
            className="text-xs text-[#A8A4B0] line-clamp-1"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            {product.name}
          </p>
          <p
            className="text-sm font-medium text-[#E7D3A8]"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            {formatPrice(product.price)}
          </p>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={addingToCart || isOutOfStock}
          className="px-5 py-2.5 bg-gradient-to-r from-[#5A189A] to-[#7B3DBF] text-[#F8F4EE] text-sm tracking-[0.05em] uppercase rounded-[4px] border border-[#E7D3A8]/25 hover:brightness-110 transition-all disabled:opacity-60"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          {isOutOfStock ? "Sold Out" : "Add to Cart"}
        </button>
      </div>
      <div className="h-20 lg:hidden" />
    </div>
  );
}
