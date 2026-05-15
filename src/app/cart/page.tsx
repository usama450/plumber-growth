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
  const remaining = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);

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
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-20 bg-[#F9F7F4]">
        <ShoppingBag size={64} className="mb-6 text-[#B5AFA8]" />
        <h1
          className="text-[#1A1714] text-2xl mb-3"
          style={{ fontFamily: "var(--font-playfair)", fontWeight: 400 }}
        >
          Your cart is empty
        </h1>
        <p
          className="text-[#5A554F] font-light mb-8 text-center"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Discover our premium home textiles and fill your home with comfort.
        </p>
        <Link href="/shop" className="btn-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F7F4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1
          className="text-[#1A1714] text-3xl mb-8"
          style={{ fontFamily: "var(--font-playfair)", fontWeight: 400 }}
        >
          Shopping Cart
        </h1>

        {/* Free shipping progress */}
        <div className="bg-white border border-[#E2DDD7] p-4 mb-6">
          {remaining === 0 ? (
            <p
              className="text-sm font-light text-[#2C4A35] mb-2"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              You qualify for free shipping!
            </p>
          ) : (
            <p
              className="text-sm font-light text-[#5A554F] mb-2"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Add{" "}
              <strong className="text-[#1A1714]">{formatPrice(remaining)}</strong>{" "}
              more for free shipping
            </p>
          )}
          <div className="h-1.5 bg-[#F4F0EB] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${shippingProgress}%`,
                background: remaining === 0 ? "#A67C3C" : "#2C4A35",
              }}
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2">
            {items.map((item) => (
              <div
                key={item.variantId}
                className="bg-white border-b border-[#F4F0EB] flex gap-4 py-5 px-4 sm:px-5"
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 overflow-hidden bg-[#EDE8E1] shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={112}
                    height={112}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/product/${item.slug}`}
                      className="text-sm text-[#1A1714] hover:text-[#2C4A35] transition-colors line-clamp-2"
                      style={{ fontFamily: "var(--font-inter)", fontWeight: 400 }}
                    >
                      {item.name}
                    </Link>
                    <button
                      onClick={() => removeItem(item.variantId)}
                      className="text-[#B5AFA8] hover:text-[#C0392B] transition-colors p-1 shrink-0"
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div
                    className="flex items-center gap-2 mt-1 text-xs text-[#7A746D] font-light"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {item.size && <span>{item.size}</span>}
                    {item.size && item.color && <span className="text-[#B5AFA8]">·</span>}
                    {item.color && <span className="capitalize">{item.color}</span>}
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="inline-flex items-center border border-[#E2DDD7] overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-[#1A1714] hover:bg-[#F4F0EB] transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={13} />
                      </button>
                      <span
                        className="w-9 text-center text-sm text-[#1A1714]"
                        style={{ fontFamily: "var(--font-inter)", fontWeight: 400 }}
                      >
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                        disabled={item.quantity >= item.maxStock}
                        className="w-8 h-8 flex items-center justify-center text-[#1A1714] hover:bg-[#F4F0EB] transition-colors disabled:opacity-40"
                        aria-label="Increase quantity"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                    <span
                      className="text-sm text-[#1A1714]"
                      style={{ fontFamily: "var(--font-inter)", fontWeight: 400 }}
                    >
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            <div className="mt-6">
              <Link
                href="/shop"
                className="text-[#2C4A35] hover:text-[#1A1714] text-sm transition-colors"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-[#E2DDD7] p-6 sticky top-[120px]">
              <h2
                className="text-[#1A1714] text-lg mb-5"
                style={{ fontFamily: "var(--font-playfair)", fontWeight: 400 }}
              >
                Order Summary
              </h2>

              {/* Coupon */}
              {couponCode ? (
                <div className="flex items-center justify-between bg-[#F4F0EB] px-3 py-2.5 mb-5 border border-[#E2DDD7]">
                  <div className="flex items-center gap-2">
                    <Tag size={14} className="text-[#2C4A35]" />
                    <span
                      className="text-sm text-[#1A1714]"
                      style={{ fontFamily: "var(--font-inter)", fontWeight: 400 }}
                    >
                      {couponCode}
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-[#7A746D] hover:text-[#C0392B] transition-colors"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2 mb-5">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleValidateCoupon()}
                    placeholder="Promo code"
                    className="flex-1 px-3 py-2.5 bg-white border border-[#E2DDD7] text-sm text-[#1A1714] placeholder-[#B5AFA8] focus:outline-none focus:ring-1 focus:ring-[#2C4A35] transition-all"
                    style={{ fontFamily: "var(--font-inter)" }}
                  />
                  <button
                    onClick={handleValidateCoupon}
                    disabled={validatingCoupon || !couponInput.trim()}
                    className="px-4 py-2.5 bg-[#2C4A35] text-white text-sm hover:bg-[#1A2B20] transition-all disabled:opacity-60 flex items-center"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {validatingCoupon ? <Loader2 size={14} className="animate-spin" /> : "Apply"}
                  </button>
                </div>
              )}

              <div className="space-y-3 pb-4 border-b border-[#E2DDD7]">
                <div
                  className="flex justify-between text-sm text-[#5A554F]"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  <span>Subtotal</span>
                  <span className="text-[#1A1714]">{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div
                    className="flex justify-between text-sm text-[#2C4A35]"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    <span>Discount</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div
                  className="flex justify-between text-sm text-[#5A554F]"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  <span>Estimated Shipping</span>
                  <span className={shipping === 0 ? "text-[#2C4A35]" : "text-[#1A1714]"}>
                    {shipping === 0 ? "FREE" : formatPrice(shipping)}
                  </span>
                </div>
                <div
                  className="flex justify-between text-sm text-[#5A554F]"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  <span>Estimated Tax (HST)</span>
                  <span className="text-[#1A1714]">{formatPrice(estimatedTax)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 mb-6">
                <span
                  className="text-[#1A1714]"
                  style={{ fontFamily: "var(--font-inter)", fontWeight: 400 }}
                >
                  Total
                </span>
                <span
                  className="text-[#1A1714] text-xl"
                  style={{ fontFamily: "var(--font-playfair)", fontWeight: 600 }}
                >
                  {formatPrice(total)}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={checkingOut}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {checkingOut ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Proceed to Checkout →"
                )}
              </button>

              <p
                className="text-center text-xs text-[#7A746D] font-light mt-3"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Secure checkout powered by Stripe
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
