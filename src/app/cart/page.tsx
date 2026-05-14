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
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-20 bg-[#050507]">
        <ShoppingBag size={64} className="mb-6" style={{ color: "rgba(90,24,154,0.3)" }} />
        <h1
          className="text-[#E7D3A8] text-2xl mb-3"
          style={{ fontFamily: "var(--font-playfair)", fontWeight: 400 }}
        >
          Your cart is empty
        </h1>
        <p
          className="text-[#A8A4B0] font-light mb-8 text-center"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Discover our premium home textiles and fill your home with comfort.
        </p>
        <Link href="/shop" className="btn-gold-shimmer">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050507]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1
          className="text-[#E7D3A8] text-3xl mb-8"
          style={{ fontFamily: "var(--font-playfair)", fontWeight: 400 }}
        >
          Shopping Cart
        </h1>

        {/* Free shipping progress */}
        <div className="bg-[#150820] rounded-xl p-4 border border-[#3A1A5C] mb-6">
          {remaining === 0 ? (
            <p
              className="text-sm font-light text-[#6B8E4E] mb-2"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              🎉 You qualify for free shipping!
            </p>
          ) : (
            <p
              className="text-sm font-light text-[#A8A4B0] mb-2"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Add{" "}
              <strong className="text-[#E7D3A8]">{formatPrice(remaining)}</strong>{" "}
              more for free shipping
            </p>
          )}
          <div className="h-2 bg-[#0D0415] rounded-full overflow-hidden border border-[#3A1A5C]">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${shippingProgress}%`,
                background: remaining === 0
                  ? "linear-gradient(to right, #C9A961, #E7D3A8)"
                  : "linear-gradient(to right, #5A189A, #9D4EDD)",
              }}
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.variantId}
                className="bg-[#150820] rounded-xl p-4 sm:p-5 border border-[#3A1A5C] flex gap-4"
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-[#0D0415] shrink-0">
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
                      className="text-sm font-light text-[#F8F4EE]/80 hover:text-[#E7D3A8] transition-colors line-clamp-2"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {item.name}
                    </Link>
                    <button
                      onClick={() => removeItem(item.variantId)}
                      className="text-[#6B6475] hover:text-[#B85450] transition-colors p-1 shrink-0"
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div
                    className="flex items-center gap-2 mt-1 text-xs text-[#A8A4B0] font-light"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {item.size && <span>{item.size}</span>}
                    {item.size && item.color && <span className="text-[#3A1A5C]">·</span>}
                    {item.color && <span className="capitalize">{item.color}</span>}
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="inline-flex items-center bg-[#0D0415] border border-[#3A1A5C] rounded-full overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-[#A8A4B0] hover:text-[#E7D3A8] hover:bg-[#2A0F3D] transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={13} />
                      </button>
                      <span
                        className="w-9 text-center text-sm text-[#F8F4EE]"
                        style={{ fontFamily: "var(--font-inter)" }}
                      >
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                        disabled={item.quantity >= item.maxStock}
                        className="w-8 h-8 flex items-center justify-center text-[#A8A4B0] hover:text-[#E7D3A8] hover:bg-[#2A0F3D] transition-colors disabled:opacity-40"
                        aria-label="Increase quantity"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                    <span
                      className="text-sm text-[#E7D3A8]"
                      style={{ fontFamily: "var(--font-inter)", fontWeight: 400 }}
                    >
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#150820] rounded-2xl p-6 border border-[#3A1A5C] sticky top-[120px]">
              <h2
                className="text-[#E7D3A8] text-lg mb-5"
                style={{ fontFamily: "var(--font-playfair)", fontWeight: 400 }}
              >
                Order Summary
              </h2>

              {/* Coupon */}
              {couponCode ? (
                <div className="flex items-center justify-between bg-[#2A0F3D]/60 rounded-lg px-3 py-2.5 mb-5 border border-[#3A1A5C]">
                  <div className="flex items-center gap-2">
                    <Tag size={14} className="text-[#E7D3A8]" />
                    <span
                      className="text-sm font-light text-[#E7D3A8]"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {couponCode}
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-[#A8A4B0] hover:text-[#B85450] transition-colors"
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
                    className="flex-1 px-3 py-2.5 bg-[#0D0415] border border-[#3A1A5C] rounded-lg text-sm font-light text-[#F8F4EE] placeholder-[#6B6475] focus:outline-none focus:ring-1 focus:ring-[#5A189A] transition-all"
                    style={{ fontFamily: "var(--font-inter)" }}
                  />
                  <button
                    onClick={handleValidateCoupon}
                    disabled={validatingCoupon || !couponInput.trim()}
                    className="px-4 py-2.5 bg-gradient-to-r from-[#5A189A] to-[#7B3DBF] text-[#F8F4EE] text-sm rounded-lg hover:brightness-110 transition-all disabled:opacity-60 flex items-center"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {validatingCoupon ? <Loader2 size={14} className="animate-spin" /> : "Apply"}
                  </button>
                </div>
              )}

              <div className="space-y-3 pb-4 border-b border-[#3A1A5C]">
                <div
                  className="flex justify-between text-sm font-light text-[#A8A4B0]"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  <span>Subtotal</span>
                  <span className="text-[#F8F4EE]">{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div
                    className="flex justify-between text-sm font-light text-[#6B8E4E]"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    <span>Discount</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div
                  className="flex justify-between text-sm font-light text-[#A8A4B0]"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  <span>Estimated Shipping</span>
                  <span className={shipping === 0 ? "text-[#6B8E4E]" : "text-[#F8F4EE]"}>
                    {shipping === 0 ? "FREE" : formatPrice(shipping)}
                  </span>
                </div>
                <div
                  className="flex justify-between text-sm font-light text-[#A8A4B0]"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  <span>Estimated Tax (HST)</span>
                  <span className="text-[#F8F4EE]">{formatPrice(estimatedTax)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 mb-6">
                <span
                  className="text-[#A8A4B0]"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Total
                </span>
                <span
                  className="text-[#E7D3A8] text-xl"
                  style={{ fontFamily: "var(--font-playfair)", fontWeight: 400 }}
                >
                  {formatPrice(total)}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={checkingOut}
                className="w-full py-3.5 bg-gradient-to-r from-[#5A189A] to-[#7B3DBF] text-[#F8F4EE] text-sm tracking-[0.06em] uppercase rounded-lg border border-[#E7D3A8]/20 hover:brightness-110 transition-all hover:shadow-[0_8px_32px_rgba(90,24,154,0.4)] disabled:opacity-70 flex items-center justify-center gap-2"
                style={{ fontFamily: "var(--font-inter)", fontWeight: 500 }}
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
                className="text-center text-xs text-[#6B6475] font-light mt-3"
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
