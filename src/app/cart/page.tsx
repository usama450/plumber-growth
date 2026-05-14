"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag, Loader2, Tag } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { FREE_SHIPPING_THRESHOLD, FLAT_SHIPPING_RATE } from "@/lib/stripe";
import { toast } from "@/components/common/Toaster";

export default function CartPage() {
  const {
    items, removeItem, updateQuantity, getSubtotal,
    couponCode, discount, applyCoupon, removeCoupon,
  } = useCartStore();
  const [couponInput, setCouponInput] = useState("");
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);

  const subtotal = getSubtotal();
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_RATE;
  const estimatedTax = (subtotal - discount) * 0.13;
  const total = subtotal - discount + shipping + estimatedTax;
  const shippingProgress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

  const handleValidateCoupon = async () => {
    if (!couponInput.trim()) return;
    setValidatingCoupon(true);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponInput.trim(), subtotal }),
      });
      const data = await res.json();
      if (res.ok) {
        applyCoupon(data.code, data.discountAmount);
        toast.success(`Coupon applied: ${data.description}`);
        setCouponInput("");
      } else {
        toast.error(data.error ?? "Invalid coupon code");
      }
    } catch {
      toast.error("Failed to validate coupon");
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setCheckingOut(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, couponCode, discount }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.error ?? "Checkout failed. Please try again.");
        setCheckingOut(false);
      }
    } catch {
      toast.error("Checkout failed. Please try again.");
      setCheckingOut(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-20 bg-[#FAF7F2]">
        <ShoppingBag size={64} className="text-[#D4C5B0] mb-6" />
        <h1 className="font-playfair font-semibold text-[#4A2C5A] text-2xl mb-3"
          style={{ fontFamily: "var(--font-playfair)" }}>
          Your cart is empty
        </h1>
        <p className="text-[#8B8B8B] font-inter font-light mb-8 text-center">
          Discover our premium home textiles and fill your home with comfort.
        </p>
        <Link href="/shop"
          className="px-8 py-3 bg-[#4A2C5A] text-white font-inter font-normal text-sm rounded-xl hover:bg-[#5B3A6B] transition-colors">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="font-playfair font-semibold text-[#4A2C5A] text-3xl mb-8"
          style={{ fontFamily: "var(--font-playfair)" }}>
          Shopping Cart
        </h1>

        {/* Free shipping progress */}
        <div className="bg-white rounded-xl p-4 border border-[#E8DFF5] mb-6">
          {shipping === 0 ? (
            <p className="text-sm font-inter font-light text-[#6B8E4E]">
              🎉 You qualify for free shipping!
            </p>
          ) : (
            <p className="text-sm font-inter font-light text-[#4A2C5A] mb-2">
              Add <strong>{formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)}</strong> more for free shipping
            </p>
          )}
          <div className="h-1.5 bg-[#E8DFF5] rounded-full overflow-hidden">
            <div className="h-full bg-[#4A2C5A] rounded-full transition-all duration-500"
              style={{ width: `${shippingProgress}%` }} />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.variantId}
                className="bg-white rounded-xl p-4 sm:p-5 border border-[#E8DFF5]/60 flex gap-4">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-[#E8DFF5]/30 shrink-0">
                  <Image src={item.image} alt={item.name} width={112} height={112}
                    className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <Link href={`/product/${item.slug}`}
                      className="text-sm font-inter font-light text-[#2A2A2A] hover:text-[#4A2C5A] transition-colors line-clamp-2">
                      {item.name}
                    </Link>
                    <button onClick={() => removeItem(item.variantId)}
                      className="text-[#8B8B8B] hover:text-[#B85450] transition-colors p-1 shrink-0"
                      aria-label={`Remove ${item.name}`}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-[#8B8B8B] font-inter font-light">
                    {item.size && <span>{item.size}</span>}
                    {item.size && item.color && <span>·</span>}
                    {item.color && <span className="capitalize">{item.color}</span>}
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-[#E8DFF5] rounded-lg overflow-hidden">
                      <button onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-[#4A2C5A] hover:bg-[#E8DFF5]/50 transition-colors"
                        aria-label="Decrease quantity"><Minus size={13} /></button>
                      <span className="w-9 text-center text-sm font-inter font-light">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                        disabled={item.quantity >= item.maxStock}
                        className="w-8 h-8 flex items-center justify-center text-[#4A2C5A] hover:bg-[#E8DFF5]/50 transition-colors disabled:opacity-40"
                        aria-label="Increase quantity"><Plus size={13} /></button>
                    </div>
                    <span className="text-sm font-inter font-normal text-[#4A2C5A]">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 border border-[#E8DFF5]/60 sticky top-[120px]">
              <h2 className="font-playfair font-semibold text-[#4A2C5A] text-lg mb-5"
                style={{ fontFamily: "var(--font-playfair)" }}>
                Order Summary
              </h2>

              {/* Coupon */}
              {couponCode ? (
                <div className="flex items-center justify-between bg-[#E8DFF5]/40 rounded-lg px-3 py-2.5 mb-5">
                  <div className="flex items-center gap-2">
                    <Tag size={14} className="text-[#4A2C5A]" />
                    <span className="text-sm font-inter font-light text-[#4A2C5A]">{couponCode}</span>
                  </div>
                  <button onClick={removeCoupon}
                    className="text-xs text-[#8B8B8B] hover:text-[#B85450] font-inter transition-colors">
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2 mb-5">
                  <input type="text" value={couponInput} onChange={(e) => setCouponInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleValidateCoupon()}
                    placeholder="Promo code"
                    className="flex-1 px-3 py-2.5 border border-[#D4C5B0] rounded-lg text-sm font-inter font-light text-[#2A2A2A] placeholder-[#8B8B8B] focus:outline-none focus:ring-2 focus:ring-[#B8A4D4]" />
                  <button onClick={handleValidateCoupon} disabled={validatingCoupon || !couponInput.trim()}
                    className="px-4 py-2.5 bg-[#4A2C5A] text-white text-sm font-inter font-normal rounded-lg hover:bg-[#5B3A6B] transition-colors disabled:opacity-60">
                    {validatingCoupon ? <Loader2 size={14} className="animate-spin" /> : "Apply"}
                  </button>
                </div>
              )}

              <div className="space-y-3 pb-4 border-b border-[#E8DFF5]">
                <div className="flex justify-between text-sm font-inter font-light text-[#2A2A2A]">
                  <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm font-inter font-light text-[#6B8E4E]">
                    <span>Discount</span><span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-inter font-light text-[#2A2A2A]">
                  <span>Estimated Shipping</span>
                  <span>{shipping === 0 ? "FREE" : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between text-sm font-inter font-light text-[#2A2A2A]">
                  <span>Estimated Tax (HST)</span><span>{formatPrice(estimatedTax)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 mb-6">
                <span className="font-inter font-normal text-[#2A2A2A]">Total</span>
                <span className="font-playfair font-semibold text-[#4A2C5A] text-xl"
                  style={{ fontFamily: "var(--font-playfair)" }}>
                  {formatPrice(total)}
                </span>
              </div>

              <button onClick={handleCheckout} disabled={checkingOut}
                className="w-full py-3.5 bg-[#4A2C5A] text-white font-inter font-normal rounded-xl hover:bg-[#5B3A6B] transition-all hover:shadow-[0_4px_16px_rgba(74,44,90,0.3)] disabled:opacity-70 flex items-center justify-center gap-2">
                {checkingOut ? <><Loader2 size={16} className="animate-spin" />Processing...</> : "Proceed to Checkout →"}
              </button>

              <p className="text-center text-xs text-[#8B8B8B] font-inter font-light mt-3">
                Secure checkout powered by Stripe
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
