import Link from "next/link";
import { Star } from "lucide-react";
import { ScrollReveal } from "@/components/common/ScrollReveal";

export function Testimonials() {
  return (
    <section className="py-20 lg:py-28 bg-[#1A2B20]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">

        {/* Section heading */}
        <ScrollReveal type="fade-up" className="text-center mb-14">
          <div className="flex items-center justify-center gap-4 mb-5">
            <span className="block w-10 h-px bg-[#F9F7F4]/20" />
            <span
              className="text-[11px] tracking-[0.38em] uppercase"
              style={{ fontFamily: "var(--font-inter)", color: "#A67C3C", fontWeight: 500 }}
            >
              Customer Stories
            </span>
            <span className="block w-10 h-px bg-[#F9F7F4]/20" />
          </div>
          <h2
            className="text-[#F9F7F4]"
            style={{ fontFamily: "var(--font-playfair)", fontWeight: 600 }}
          >
            Customer Stories
          </h2>
        </ScrollReveal>

        {/* Coming soon card */}
        <ScrollReveal type="fade-up">
          <div
            className="border border-[#F9F7F4]/10 px-12 py-16 max-w-2xl mx-auto text-center"
            style={{ background: "rgba(249,247,244,0.04)" }}
          >
            {/* Empty star row */}
            <div className="flex items-center justify-center gap-1.5 mb-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  size={18}
                  className="text-[#A67C3C]"
                />
              ))}
            </div>

            {/* Heading */}
            <h3
              className="text-2xl text-[#F9F7F4] mb-5"
              style={{ fontFamily: "var(--font-playfair)", fontWeight: 500 }}
            >
              Customer Stories Coming Soon
            </h3>

            {/* Body */}
            <p
              className="mb-10 leading-relaxed max-w-sm mx-auto"
              style={{
                fontFamily: "var(--font-inter)",
                fontWeight: 300,
                color: "rgba(249,247,244,0.6)",
              }}
            >
              We&rsquo;re welcoming our first Khwab family. Be among the first
              to share your experience.
            </p>

            {/* CTA */}
            <Link
              href="/shop"
              className="btn-gold-shimmer"
            >
              Shop Now
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
