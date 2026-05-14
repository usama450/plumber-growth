"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Heart, Minus, Plus, ChevronRight, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { toast } from "@/components/common/Toaster";
import { formatPrice, getDiscountPercentage, cn } from "@/lib/utils";

interface ProductImage { id: string; imageUrl: string; altText: string | null; displayOrder: number; }
interface ProductVariant { id: string; size: string | null; color: string | null; sku: string; stockQuantity: number; priceModifier: unknown; }
interface Review { id: string; rating: number; title: string | null; comment: string; createdAt: Date; isVerifiedPurchase: boolean; user: { name: string | null; image: string | null; }; }

interface ProductDetailProps {
  product: {
    id: string; name: string; slug: string; description: string;
    price: number; comparePrice: number | null;
    isOnSale: boolean; material: string | null; careInstructions: string | null;
    threadCount: number | null;
    category: { name: string; slug: string };
    images: ProductImage[]; variants: ProductVariant[];
    reviews: Review[]; avgRating: number;
    _count: { reviews: number };
  };
}

export function ProductDetailClient({ product }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "care" | "shipping">("description");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const { addItem } = useCartStore();

  const sizes = [...new Set(product.variants.map((v) => v.size).filter(Boolean))] as string[];
  const colors = [...new Set(product.variants.map((v) => v.color).filter(Boolean))] as string[];
  const discount = product.comparePrice ? getDiscountPercentage(product.price, product.comparePrice) : 0;

  const selectedVariant = product.variants.find((v) =>
    (sizes.length === 0 || v.size === selectedSize) &&
    (colors.length === 0 || v.color === selectedColor)
  );

  const isOutOfStock = selectedVariant ? selectedVariant.stockQuantity === 0
    : product.variants.every((v) => v.stockQuantity === 0);

  const handleAddToCart = async () => {
    if ((sizes.length > 0 && !selectedSize) || (colors.length > 0 && !selectedColor)) {
      toast.error("Please select all options before adding to cart.");
      return;
    }
    if (isOutOfStock) { toast.error("This item is out of stock."); return; }
    setAddingToCart(true);
    try {
      addItem({
        id: `${product.id}-${selectedVariant?.id ?? "default"}`,
        productId: product.id, variantId: selectedVariant?.id ?? product.id,
        name: product.name, slug: product.slug,
        image: product.images[0]?.imageUrl ?? "",
        price: product.price, size: selectedSize, color: selectedColor,
        quantity, sku: selectedVariant?.sku ?? product.id,
        maxStock: selectedVariant?.stockQuantity ?? 99,
      });
      toast.success(`${product.name} added to cart!`);
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <div className="bg-[#FAF7F2] py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs font-inter font-light text-[#8B8B8B] mb-8" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#1A1410] transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link href="/shop" className="hover:text-[#1A1410] transition-colors">Shop</Link>
          <ChevronRight size={12} />
          <Link href={`/shop/${product.category.slug}`} className="hover:text-[#1A1410] transition-colors capitalize">
            {product.category.name}
          </Link>
          <ChevronRight size={12} />
          <span className="text-[#2A2A2A] line-clamp-1">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Gallery */}
          <div className="space-y-3">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#F7F3EE]/30">
              {product.images[selectedImage] && (
                <Image
                  src={product.images[selectedImage].imageUrl}
                  alt={product.images[selectedImage].altText ?? product.name}
                  fill className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              )}
              {isOutOfStock && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <span className="px-4 py-2 bg-white/90 rounded-full text-sm font-inter font-light text-[#2A2A2A]">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-4 gap-2">
                {product.images.map((img, i) => (
                  <button key={img.id} onClick={() => setSelectedImage(i)}
                    className={cn("aspect-square rounded-lg overflow-hidden border-2 transition-all",
                      i === selectedImage ? "border-[#1A1410]" : "border-transparent hover:border-[#C4992E]")}
                    aria-label={`View image ${i + 1}`}
                  >
                    <Image src={img.imageUrl} alt={img.altText ?? `${product.name} ${i + 1}`}
                      width={100} height={100} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="lg:pt-2">
            <p className="text-xs font-inter font-light text-[#8B8B8B] uppercase tracking-wider mb-2">
              {product.category.name}
            </p>
            <h1 className="font-playfair font-semibold text-[#1A1410] text-2xl sm:text-3xl mb-3"
              style={{ fontFamily: "var(--font-cormorant)" }}>
              {product.name}
            </h1>

            {/* Rating */}
            {product._count.reviews > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-0.5">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} size={14}
                      className={cn(i <= product.avgRating ? "fill-[#C9A961] text-[#C9A961]" : "text-[#D4C5B0]")} />
                  ))}
                </div>
                <span className="text-sm font-inter font-light text-[#8B8B8B]">
                  {product.avgRating.toFixed(1)} ({product._count.reviews} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl font-playfair font-semibold text-[#1A1410]"
                style={{ fontFamily: "var(--font-cormorant)" }}>
                {formatPrice(product.price)}
              </span>
              {product.comparePrice && product.comparePrice > product.price && (
                <>
                  <span className="text-lg font-inter font-light text-[#8B8B8B] line-through">
                    {formatPrice(product.comparePrice)}
                  </span>
                  <span className="px-2 py-0.5 bg-[#1A1410] text-white text-xs font-inter font-normal rounded-md">
                    Save {discount}%
                  </span>
                </>
              )}
            </div>

            {/* Size selector */}
            {sizes.length > 0 && (
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-sm font-inter font-normal text-[#2A2A2A]">Size</span>
                  {selectedSize && <span className="text-sm font-inter font-light text-[#1A1410]">{selectedSize}</span>}
                </div>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => {
                    const hasStock = product.variants.some((v) => v.size === size && v.stockQuantity > 0);
                    return (
                      <button key={size} onClick={() => setSelectedSize(size)} disabled={!hasStock}
                        className={cn("px-4 py-2 rounded-lg border text-sm font-inter font-light transition-all",
                          selectedSize === size ? "bg-[#1A1410] text-white border-[#1A1410]"
                          : hasStock ? "bg-white text-[#2A2A2A] border-[#D4C5B0] hover:border-[#C4992E]"
                          : "bg-[#FAF7F2] text-[#D4C5B0] border-[#F7F3EE] cursor-not-allowed line-through")}
                        aria-pressed={selectedSize === size}
                      >{size}</button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Color selector */}
            {colors.length > 0 && (
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-sm font-inter font-normal text-[#2A2A2A]">Color</span>
                  {selectedColor && <span className="text-sm font-inter font-light text-[#1A1410] capitalize">{selectedColor}</span>}
                </div>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <button key={color} onClick={() => setSelectedColor(color)}
                      className={cn("px-3 py-1.5 rounded-lg border text-sm font-inter font-light capitalize transition-all",
                        selectedColor === color ? "bg-[#1A1410] text-white border-[#1A1410]"
                        : "bg-white text-[#2A2A2A] border-[#D4C5B0] hover:border-[#C4992E]")}
                      aria-pressed={selectedColor === color}
                    >{color}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <span className="text-sm font-inter font-normal text-[#2A2A2A] block mb-2.5">Quantity</span>
              <div className="inline-flex items-center border border-[#D4C5B0] rounded-xl overflow-hidden">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-11 h-11 flex items-center justify-center text-[#1A1410] hover:bg-[#F7F3EE]/50 transition-colors"
                  aria-label="Decrease quantity"><Minus size={15} /></button>
                <span className="w-12 text-center text-sm font-inter font-light text-[#2A2A2A]">{quantity}</span>
                <button onClick={() => setQuantity(Math.min((selectedVariant?.stockQuantity ?? 99), quantity + 1))}
                  className="w-11 h-11 flex items-center justify-center text-[#1A1410] hover:bg-[#F7F3EE]/50 transition-colors"
                  disabled={!!selectedVariant && quantity >= selectedVariant.stockQuantity}
                  aria-label="Increase quantity"><Plus size={15} /></button>
              </div>
              {selectedVariant && selectedVariant.stockQuantity <= 5 && selectedVariant.stockQuantity > 0 && (
                <p className="text-xs text-[#B85450] mt-2 font-inter font-light">
                  Only {selectedVariant.stockQuantity} left in stock!
                </p>
              )}
            </div>

            {/* Add to cart + wishlist */}
            <div className="flex gap-3 mb-6">
              <button onClick={handleAddToCart} disabled={addingToCart || isOutOfStock}
                className={cn("flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-inter font-normal text-sm transition-all",
                  isOutOfStock ? "bg-[#D4C5B0] text-[#8B8B8B] cursor-not-allowed"
                  : "bg-[#1A1410] text-white hover:bg-[#5B3A6B] hover:shadow-[0_4px_16px_rgba(74,44,90,0.3)] disabled:opacity-70")}>
                <ShoppingBag size={17} />
                {isOutOfStock ? "Out of Stock" : addingToCart ? "Adding..." : "Add to Cart"}
              </button>
              <button onClick={() => setIsWishlisted(!isWishlisted)}
                className={cn("w-12 h-12 flex items-center justify-center rounded-xl border transition-all",
                  isWishlisted ? "bg-[#F7F3EE] border-[#C4992E]" : "border-[#D4C5B0] hover:border-[#C4992E] hover:bg-[#F7F3EE]/30")}
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}>
                <Heart size={18} className={cn(isWishlisted ? "fill-[#1A1410] text-[#1A1410]" : "text-[#1A1410]")} />
              </button>
            </div>

            {/* Trust signals */}
            <div className="space-y-2 py-5 border-y border-[#F7F3EE]">
              {[
                { icon: "🚚", text: "Free shipping on orders over $125" },
                { icon: "↩️", text: "Free 30-day returns" },
                { icon: "🍁", text: "Canadian-made, family-owned" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2.5">
                  <span className="text-base">{item.icon}</span>
                  <span className="text-sm font-inter font-light text-[#2A2A2A]">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12 lg:mt-16">
          <div className="flex border-b border-[#F7F3EE]">
            {([
              { key: "description", label: "Description" },
              { key: "care", label: "Materials & Care" },
              { key: "shipping", label: "Shipping & Returns" },
            ] as const).map((tab) => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={cn("px-6 py-3 text-sm font-inter font-light border-b-2 transition-colors",
                  activeTab === tab.key ? "border-[#1A1410] text-[#1A1410]"
                  : "border-transparent text-[#8B8B8B] hover:text-[#1A1410]")}>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="py-6 max-w-2xl">
            {activeTab === "description" && (
              <div className="prose prose-sm font-inter font-light text-[#2A2A2A] leading-relaxed space-y-3">
                <p>{product.description}</p>
                {product.threadCount && (
                  <p><strong className="font-normal text-[#1A1410]">Thread Count:</strong> {product.threadCount} TC</p>
                )}
                {product.material && (
                  <p><strong className="font-normal text-[#1A1410]">Material:</strong> {product.material}</p>
                )}
              </div>
            )}
            {activeTab === "care" && (
              <div className="font-inter font-light text-[#2A2A2A] leading-relaxed space-y-3">
                {product.careInstructions ? (
                  <p>{product.careInstructions}</p>
                ) : (
                  <ul className="space-y-2 text-sm">
                    {["Machine wash warm with like colours", "Tumble dry low", "Do not bleach", "Iron on medium if needed", "Do not dry clean"].map((i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-[#C9A961]">✦</span>{i}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            {activeTab === "shipping" && (
              <div className="font-inter font-light text-[#2A2A2A] text-sm leading-relaxed space-y-3">
                <p><strong className="font-normal text-[#1A1410]">Free shipping</strong> on all orders over $125 CAD across Canada.</p>
                <p>Orders under $125 ship for a flat <strong className="font-normal">$15 CAD</strong>.</p>
                <p>Most orders ship within 1–2 business days. Delivery takes 3–7 business days depending on your location.</p>
                <p>We offer <strong className="font-normal">free 30-day returns</strong> on all unwashed, unused items in original packaging.</p>
              </div>
            )}
          </div>
        </div>

        {/* Reviews */}
        {product.reviews.length > 0 && (
          <div className="mt-8 pt-8 border-t border-[#F7F3EE]">
            <h2 className="font-playfair font-semibold text-[#1A1410] text-xl mb-6"
              style={{ fontFamily: "var(--font-cormorant)" }}>
              Customer Reviews ({product._count.reviews})
            </h2>
            <div className="space-y-5">
              {product.reviews.slice(0, 5).map((review) => (
                <div key={review.id} className="bg-white rounded-xl p-5 border border-[#F7F3EE]/60">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-0.5 mb-1">
                        {[1,2,3,4,5].map((i) => (
                          <Star key={i} size={13} className={cn(i <= review.rating ? "fill-[#C9A961] text-[#C9A961]" : "text-[#D4C5B0]")} />
                        ))}
                      </div>
                      {review.title && (
                        <h4 className="text-sm font-inter font-normal text-[#2A2A2A]">{review.title}</h4>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-inter font-light text-[#2A2A2A]">{review.user.name}</p>
                      {review.isVerifiedPurchase && (
                        <span className="text-[11px] text-[#6B8E4E] font-inter">✓ Verified Purchase</span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm font-inter font-light text-[#2A2A2A] leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile sticky CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#F7F3EE] px-4 py-3 flex gap-3">
        <div className="flex-1">
          <p className="text-xs font-inter font-light text-[#8B8B8B] line-clamp-1">{product.name}</p>
          <p className="text-sm font-inter font-normal text-[#1A1410]">{formatPrice(product.price)}</p>
        </div>
        <button onClick={handleAddToCart} disabled={addingToCart || isOutOfStock}
          className="px-5 py-2.5 bg-[#1A1410] text-white text-sm font-inter font-normal rounded-xl hover:bg-[#5B3A6B] transition-colors disabled:opacity-60">
          {isOutOfStock ? "Sold Out" : "Add to Cart"}
        </button>
      </div>
      <div className="lg:hidden h-16" />
    </div>
  );
}
