"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, ShoppingBag, Minus, Plus, Trash2 } from "lucide-react";
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
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-full sm:w-[420px] bg-[#FAF7F2] shadow-2xl transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8DFF5]">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-[#4A2C5A]" />
            <h2
              className="font-playfair text-lg font-semibold text-[#4A2C5A]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Your Cart
            </h2>
            {items.length > 0 && (
              <span className="text-sm text-[#8B8B8B] font-inter font-light">
                ({items.length} {items.length === 1 ? "item" : "items"})
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="p-2 text-[#8B8B8B] hover:text-[#4A2C5A] rounded-full hover:bg-[#E8DFF5]/50 transition-colors"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Free shipping progress */}
        {items.length > 0 && (
          <div className="px-5 py-3 bg-[#E8DFF5]/40 border-b border-[#E8DFF5]">
            {remaining > 0 ? (
              <p className="text-xs font-inter font-light text-[#4A2C5A] mb-2">
                Add <strong>{formatPrice(remaining)}</strong> more for free shipping!
              </p>
            ) : (
              <p className="text-xs font-inter font-light text-[#6B8E4E] mb-2">
                🎉 You qualify for free shipping!
              </p>
            )}
            <div className="h-1.5 bg-[#D4C5B0] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#4A2C5A] rounded-full transition-all duration-500"
                style={{ width: `${shippingProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto py-4 px-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <ShoppingBag size={48} className="text-[#D4C5B0] mb-4" />
              <h3 className="font-playfair text-lg font-semibold text-[#4A2C5A] mb-2"
                style={{ fontFamily: "var(--font-playfair)" }}>
                Your cart is empty
              </h3>
              <p className="text-sm text-[#8B8B8B] font-inter font-light mb-6">
                Discover our premium home textiles
              </p>
              <Link
                href="/shop"
                onClick={closeCart}
                className="px-6 py-2.5 bg-[#4A2C5A] text-white text-sm font-inter font-normal rounded-lg hover:bg-[#5B3A6B] transition-colors"
              >
                Shop Now
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.variantId}
                  className="flex gap-4 p-3 bg-white rounded-xl border border-[#E8DFF5]/60"
                >
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-[#E8DFF5]/30 shrink-0">
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
                      className="text-sm font-inter font-light text-[#2A2A2A] hover:text-[#4A2C5A] transition-colors line-clamp-1"
                    >
                      {item.name}
                    </Link>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      {item.size && (
                        <span className="text-xs text-[#8B8B8B] font-inter">{item.size}</span>
                      )}
                      {item.size && item.color && (
                        <span className="text-[#D4C5B0]">·</span>
                      )}
                      {item.color && (
                        <span className="text-xs text-[#8B8B8B] font-inter">{item.color}</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-2.5">
                      <div className="flex items-center gap-1 border border-[#E8DFF5] rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-[#4A2C5A] hover:bg-[#E8DFF5]/50 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-7 text-center text-sm font-inter font-light text-[#2A2A2A]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          disabled={item.quantity >= item.maxStock}
                          className="w-7 h-7 flex items-center justify-center text-[#4A2C5A] hover:bg-[#E8DFF5]/50 transition-colors disabled:opacity-40"
                          aria-label="Increase quantity"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-inter font-normal text-[#4A2C5A]">
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
          <div className="border-t border-[#E8DFF5] px-5 py-4 bg-white">
            <div className="flex items-center justify-between mb-4">
              <span className="font-inter font-light text-[#2A2A2A]">Subtotal</span>
              <span className="font-inter font-normal text-[#4A2C5A] text-lg">
                {formatPrice(subtotal)}
              </span>
            </div>
            <p className="text-xs text-[#8B8B8B] font-inter font-light mb-4">
              Taxes and shipping calculated at checkout
            </p>
            <Link
              href="/cart"
              onClick={closeCart}
              className="block w-full text-center py-3.5 bg-[#4A2C5A] text-white font-inter font-normal rounded-xl hover:bg-[#5B3A6B] transition-colors mb-2"
            >
              View Cart & Checkout
            </Link>
            <button
              onClick={closeCart}
              className="block w-full text-center py-2 text-sm text-[#8B8B8B] font-inter font-light hover:text-[#4A2C5A] transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
