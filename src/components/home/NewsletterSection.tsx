import Link from "next/link";
import { NewsletterForm } from "@/components/common/NewsletterForm";
import { ScrollReveal } from "@/components/common/ScrollReveal";

export function NewsletterSection() {
  return (
    <section className="py-20 lg:py-24 bg-[#F5EFE5] relative overflow-hidden">
      {/* Decorative large "K" */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 select-none pointer-events-none leading-none text-[#E8DFF5]/40"
        style={{
          fontFamily: "var(--font-playfair)",
          fontSize: "clamp(16rem, 30vw, 26rem)",
        }}
        aria-hidden="true"
      >
        K
      </div>

      <div className="relative max-w-2xl mx-auto px-6 sm:px-8 text-center">
        <ScrollReveal type="fade-up">
          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="block w-10 h-px bg-[#C9A961]" />
            <span
              className="text-[11px] tracking-[0.35em] uppercase text-[#5A189A]"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Join the Khwab Family
            </span>
            <span className="block w-10 h-px bg-[#C9A961]" />
          </div>

          {/* Heading */}
          <h2
            className="text-[#1A1A1A] mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Get 10% Off Your First Order
          </h2>

          {/* Body */}
          <p
            className="text-[#8B8B8B] mb-9 leading-relaxed max-w-md mx-auto"
            style={{
              fontFamily: "var(--font-inter)",
              fontWeight: 300,
            }}
          >
            Subscribe for exclusive offers, new arrivals, and home styling
            inspiration.
          </p>

          {/* Form */}
          <div className="max-w-sm mx-auto">
            <NewsletterForm />
          </div>

          {/* Fine print */}
          <p
            className="mt-5 text-[12px] text-[#8B8B8B]"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            By subscribing you agree to our{" "}
            <Link
              href="/privacy"
              className="underline hover:text-[#5A189A] transition-colors"
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
