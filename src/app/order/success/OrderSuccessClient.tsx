"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { useCartStore } from "@/store/cart";

export function OrderSuccessClient() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { clearCart } = useCartStore();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center px-4 py-20">
      <div className="max-w-lg w-full text-center">
        <div className="w-20 h-20 bg-[#6B8E4E]/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={40} className="text-[#6B8E4E]" />
        </div>
        <h1 className="font-playfair font-semibold text-[#4A2C5A] text-3xl mb-3"
          style={{ fontFamily: "var(--font-playfair)" }}>
          Thank you for your order!
        </h1>
        <p className="text-[#8B8B8B] font-inter font-light mb-2">
          Your order has been confirmed. We&apos;ll email you with tracking information once it ships.
        </p>
        {sessionId && (
          <p className="text-xs text-[#8B8B8B] font-inter font-light mb-8">
            Session: {sessionId.slice(0, 20)}...
          </p>
        )}
        <div className="bg-white rounded-2xl p-6 border border-[#E8DFF5] mb-8">
          <div className="space-y-3 text-sm font-inter font-light text-[#2A2A2A]">
            <div className="flex items-center gap-3">
              <span className="text-xl">📦</span>
              <span>Order confirmed and payment received</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xl">🏭</span>
              <span>We&apos;ll start preparing your order within 1-2 business days</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xl">🚚</span>
              <span>Delivery in 3–7 business days across Canada</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/account/orders"
            className="px-6 py-3 bg-[#4A2C5A] text-white font-inter font-normal text-sm rounded-xl hover:bg-[#5B3A6B] transition-colors">
            View My Orders
          </Link>
          <Link href="/shop"
            className="px-6 py-3 border border-[#4A2C5A] text-[#4A2C5A] font-inter font-light text-sm rounded-xl hover:bg-[#E8DFF5]/50 transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
