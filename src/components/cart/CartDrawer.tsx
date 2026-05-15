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
            className="fixed inset-0 z-50 bg-[#1A1714]/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <motion.div
            className="fixed top-0 right-0 bottom-0 z-50 w-full sm:w-[420px] bg-white shadow-2xl flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2DDD7]">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-[#1A1714]" />
                <h2
                  className="text-lg text-[#1A1714]"
                  style={{ fontFamily: "var(--font-playfair)", fontWeight: 400 }}
                >
                  Your Cart
                </h2>
                {items.length > 0 && (
                  <span
                    className="text-sm text-[#7A746D]"
                    style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
                  >
                    ({items.length} {items.length === 1 ? "item" : "items"})
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="p-2 text-[#5A554F] hover:text-[#1A1714] rounded-full hover:bg-[#F4F0EB] transition-colors"
                aria-label="Close cart"
              >
                <X size={20} />
              </button>
            </div>

            {/* Free shipping progress */}
            {items.length > 0 && (
              <div className="px-5 py-3 border-b border-[#E2DDD7]">
                {remaining > 0 ? (
                  <p
                    className="text-xs text-[#5A554F] mb-2"
                    style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
                  >
                    Add{" "}
                    <strong className="text-[#1A1714]">{formatPrice(remaining)}</strong>{" "}
                    more for free shipping!
                  </p>
                ) : (
                  <p
                    className="text-xs text-[#2C4A35] mb-2"
                    style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
                  >
                    You qualify for free shipping!
                  </p>
                )}
                <div className="h-1.5 bg-[#F4F0EB] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      remaining === 0 ? "bg-[#A67C3C]" : "bg-[#2C4A35]"
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
                    className="mb-4 text-[#B5AFA8]"
                  />
                  <h3
                    className="text-lg text-[#7A746D] mb-2"
                    style={{ fontFamily: "var(--font-playfair)", fontWeight: 400 }}
                  >
                    Your cart is empty
                  </h3>
                  <p
                    className="text-sm text-[#7A746D] mb-6"
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
                <div className="space-y-0">
                  {items.map((item, idx) => (
                    <div
                      key={item.variantId}
                      className={`flex gap-4 py-4 ${idx > 0 ? "border-t border-[#F4F0EB]" : ""}`}
                    >
                      <div className="w-20 h-20 overflow-hidden bg-[#F4F0EB] shrink-0">
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
                          className="text-sm text-[#1A1714] hover:text-[#2C4A35] transition-colors line-clamp-1"
                          style={{ fontFamily: "var(--font-inter)", fontWeight: 400 }}
                        >
                          {item.name}
                        </Link>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          {item.size && (
                            <span
                              className="text-xs text-[#7A746D]"
                              style={{ fontFamily: "var(--font-inter)" }}
                            >
                              {item.size}
                            </span>
                          )}
                          {item.size && item.color && (
                            <span className="text-[#B5AFA8]">&middot;</span>
                          )}
                          {item.color && (
                            <span
                              className="text-xs text-[#7A746D]"
                              style={{ fontFamily: "var(--font-inter)" }}
                            >
                              {item.color}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-2.5">
                          <div className="flex items-center gap-1 border border-[#E2DDD7] overflow-hidden">
                            <button
                              onClick={() =>
                                updateQuantity(item.variantId, item.quantity - 1)
                              }
                              className="w-7 h-7 flex items-center justify-center text-[#1A1714] hover:bg-[#F4F0EB] transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={13} />
                            </button>
                            <span
                              className="w-7 text-center text-sm text-[#1A1714]"
                              style={{ fontFamily: "var(--font-inter)", fontWeight: 400 }}
                            >
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.variantId, item.quantity + 1)
                              }
                              disabled={item.quantity >= item.maxStock}
                              className="w-7 h-7 flex items-center justify-center text-[#1A1714] hover:bg-[#F4F0EB] transition-colors disabled:opacity-40"
                              aria-label="Increase quantity"
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className="text-sm text-[#1A1714]"
                              style={{ fontFamily: "var(--font-inter)", fontWeight: 400 }}
                            >
                              {formatPrice(item.price * item.quantity)}
                            </span>
                            <button
                              onClick={() => removeItem(item.variantId)}
                              className="text-[#B5AFA8] hover:text-[#1A1714] transition-colors"
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
              <div className="border-t border-[#E2DDD7] px-5 py-4 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="text-[#1A1714]"
                    style={{ fontFamily: "var(--font-inter)", fontWeight: 400 }}
                  >
                    Subtotal
                  </span>
                  <span
                    className="text-[#1A1714] text-xl"
                    style={{ fontFamily: "var(--font-playfair)", fontWeight: 600 }}
                  >
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <p
                  className="text-xs text-[#7A746D] mb-4"
                  style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
                >
                  Taxes and shipping calculated at checkout
                </p>
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="btn-primary flex items-center justify-center w-full mb-2"
                >
                  View Cart &amp; Checkout
                </Link>
                <button
                  onClick={closeCart}
                  className="block w-full text-center py-2 text-sm text-[#5A554F] hover:text-[#1A1714] transition-colors"
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
