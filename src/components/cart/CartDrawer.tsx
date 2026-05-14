"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, ShoppingBag, Minus, Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/stripe";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getSubtotal } =
    useCartStore();
  const subtotal = getSubtotal();
  const shippingProgress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remaining = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-[#050507]/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <motion.div
            className="fixed top-0 right-0 bottom-0 z-50 w-full sm:w-[420px] bg-[#050507] shadow-2xl flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E7D3A8]/20">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-[#E7D3A8]" />
                <h2
                  className="text-lg text-[#E7D3A8]"
                  style={{ fontFamily: "var(--font-playfair)", fontWeight: 400 }}
                >
                  Your Cart
                </h2>
                {items.length > 0 && (
                  <span
                    className="text-sm text-[#8B8B8B]"
                    style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
                  >
                    ({items.length} {items.length === 1 ? "item" : "items"})
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="p-2 text-[#8B8B8B] hover:text-[#F8F4EE] rounded-full hover:bg-[#1A0826]/60 transition-colors"
                aria-label="Close cart"
              >
                <X size={20} />
              </button>
            </div>

            {/* Free shipping progress */}
            {items.length > 0 && (
              <div className="px-5 py-3 bg-[#1A0826]/60 border-b border-[#E7D3A8]/10">
                {remaining > 0 ? (
                  <p
                    className="text-xs text-[#F8F4EE]/60 mb-2"
                    style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
                  >
                    Add{" "}
                    <strong className="text-[#E7D3A8]">{formatPrice(remaining)}</strong>{" "}
                    more for free shipping!
                  </p>
                ) : (
                  <p
                    className="text-xs text-[#6B8E4E] mb-2"
                    style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
                  >
                    You qualify for free shipping!
                  </p>
                )}
                <div className="h-1.5 bg-[#0D0415] rounded-full overflow-hidden border border-[#3A1A5C]">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      remaining === 0
                        ? "bg-gradient-to-r from-[#C9A961] to-[#E7D3A8]"
                        : "bg-gradient-to-r from-[#5A189A] to-[#9D4EDD]"
                    }`}
                    style={{ width: `${shippingProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto py-4 px-5">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <ShoppingBag
                    size={48}
                    className="mb-4"
                    style={{ color: "rgba(90,24,154,0.3)" }}
                  />
                  <h3
                    className="text-lg text-[#F8F4EE]/60 mb-2"
                    style={{ fontFamily: "var(--font-playfair)", fontWeight: 400 }}
                  >
                    Your cart is empty
                  </h3>
                  <p
                    className="text-sm text-[#8B8B8B] mb-6"
                    style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
                  >
                    Discover our premium home textiles
                  </p>
                  <Link
                    href="/shop"
                    onClick={closeCart}
                    className="btn-primary"
                  >
                    Shop Now
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.variantId}
                      className="flex gap-4 p-3 bg-[#1A0826]/60 rounded-lg border border-[#E7D3A8]/10"
                    >
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#1A0826] shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/product/${item.slug}`}
                          onClick={closeCart}
                          className="text-sm text-[#F8F4EE]/80 hover:text-[#F8F4EE] transition-colors line-clamp-1"
                          style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
                        >
                          {item.name}
                        </Link>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          {item.size && (
                            <span
                              className="text-xs text-[#8B8B8B]"
                              style={{ fontFamily: "var(--font-inter)" }}
                            >
                              {item.size}
                            </span>
                          )}
                          {item.size && item.color && (
                            <span className="text-[#E7D3A8]/20">&middot;</span>
                          )}
                          {item.color && (
                            <span
                              className="text-xs text-[#8B8B8B]"
                              style={{ fontFamily: "var(--font-inter)" }}
                            >
                              {item.color}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-2.5">
                          <div className="flex items-center gap-1 border border-[#E7D3A8]/15 rounded-lg overflow-hidden">
                            <button
                              onClick={() =>
                                updateQuantity(item.variantId, item.quantity - 1)
                              }
                              className="w-7 h-7 flex items-center justify-center text-[#F8F4EE]/60 hover:text-[#F8F4EE] hover:bg-[#5A189A]/30 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={13} />
                            </button>
                            <span
                              className="w-7 text-center text-sm text-[#F8F4EE]/80"
                              style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
                            >
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.variantId, item.quantity + 1)
                              }
                              disabled={item.quantity >= item.maxStock}
                              className="w-7 h-7 flex items-center justify-center text-[#F8F4EE]/60 hover:text-[#F8F4EE] hover:bg-[#5A189A]/30 transition-colors disabled:opacity-40"
                              aria-label="Increase quantity"
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className="text-sm text-[#E7D3A8]"
                              style={{ fontFamily: "var(--font-inter)", fontWeight: 400 }}
                            >
                              {formatPrice(item.price * item.quantity)}
                            </span>
                            <button
                              onClick={() => removeItem(item.variantId)}
                              className="text-[#8B8B8B] hover:text-[#B85450] transition-colors"
                              aria-label={`Remove ${item.name}`}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-[#E7D3A8]/20 px-5 py-4 bg-[#050507]">
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="text-[#F8F4EE]/60"
                    style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
                  >
                    Subtotal
                  </span>
                  <span
                    className="text-[#E7D3A8] text-xl"
                    style={{ fontFamily: "var(--font-inter)", fontWeight: 400 }}
                  >
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <p
                  className="text-xs text-[#8B8B8B] mb-4"
                  style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
                >
                  Taxes and shipping calculated at checkout
                </p>
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="flex items-center justify-center w-full py-3.5 text-[#F8F4EE] text-[13px] font-medium tracking-wider uppercase rounded border border-[#E7D3A8]/25 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(90,24,154,0.45)] transition-all duration-200 mb-2"
                  style={{
                    fontFamily: "var(--font-inter)",
                    background: "linear-gradient(to right, #5A189A, #7B3DBF)",
                  }}
                >
                  View Cart &amp; Checkout
                </Link>
                <button
                  onClick={closeCart}
                  className="block w-full text-center py-2 text-sm text-[#8B8B8B] hover:text-[#F8F4EE] transition-colors"
                  style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
