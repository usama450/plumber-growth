import Link from "next/link";
import { NewsletterForm } from "@/components/common/NewsletterForm";
import { ScrollReveal } from "@/components/common/ScrollReveal";

export function NewsletterSection() {
  return (
    <section className="py-20 lg:py-24 bg-[#1A2B20] relative overflow-hidden">
      {/* Decorative large "K" */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 select-none pointer-events-none leading-none"
        style={{
          fontFamily: "var(--font-playfair)",
          fontSize: "clamp(16rem, 30vw, 26rem)",
          color: "rgba(249,247,244,0.04)",
        }}
        aria-hidden="true"
      >
        K
      </div>

      <div className="relative max-w-2xl mx-auto px-6 sm:px-8 text-center">
        <ScrollReveal type="fade-up">
          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="block w-10 h-px bg-[#A67C3C]/50" />
            <span
              className="text-[11px] tracking-[0.38em] uppercase"
              style={{ fontFamily: "var(--font-inter)", color: "#A67C3C", fontWeight: 500 }}
            >
              Join the Khwab Family
            </span>
            <span className="block w-10 h-px bg-[#A67C3C]/50" />
          </div>

          {/* Heading */}
          <h2
            className="text-[#F9F7F4] mb-4"
            style={{ fontFamily: "var(--font-playfair)", fontWeight: 600 }}
          >
            Get 10% Off Your First Order
          </h2>

          {/* Body */}
          <p
            className="mb-9 leading-relaxed max-w-md mx-auto"
            style={{
              fontFamily: "var(--font-inter)",
              fontWeight: 300,
              color: "rgba(249,247,244,0.6)",
            }}
          >
            Subscribe for exclusive offers, new arrivals, and home styling
            inspiration.
          </p>

          {/* Form */}
          <div className="max-w-sm mx-auto">
            <NewsletterForm darkMode />
          </div>

          {/* Fine print */}
          <p
            className="mt-5 text-[12px]"
            style={{ fontFamily: "var(--font-inter)", color: "rgba(249,247,244,0.4)" }}
          >
            By subscribing you agree to our{" "}
            <Link
              href="/privacy"
              className="underline hover:text-[#F9F7F4] transition-colors"
            >
              Privacy Policy
            </Link>
            . Unsubscribe anytime.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
