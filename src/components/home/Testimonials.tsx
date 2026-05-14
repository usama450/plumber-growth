import Link from "next/link";
import { Star } from "lucide-react";
import { ScrollReveal } from "@/components/common/ScrollReveal";

export function Testimonials() {
  return (
    <section className="py-20 lg:py-28 bg-[#050507]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">

        {/* Section heading */}
        <ScrollReveal type="fade-up" className="text-center mb-14">
          <div className="flex items-center justify-center gap-4 mb-5">
            <span className="block w-10 h-px bg-[#E7D3A8]/40" />
            <span
              className="text-[11px] tracking-[0.35em] uppercase text-[#E7D3A8]/60"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Customer Stories
            </span>
            <span className="block w-10 h-px bg-[#E7D3A8]/40" />
          </div>
          <h2
            className="text-[#E7D3A8]"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Customer Stories
          </h2>
        </ScrollReveal>

        {/* Coming soon card */}
        <ScrollReveal type="fade-up">
          <div
            className="bg-[#1A0826] border border-[#E7D3A8]/15 px-12 py-16 max-w-2xl mx-auto text-center"
            style={{ boxShadow: "0 0 30px rgba(90,24,154,0.35)" }}
          >
            {/* Empty star row */}
            <div className="flex items-center justify-center gap-1.5 mb-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  size={18}
                  className="text-[#E7D3A8]/30"
                />
              ))}
            </div>

            {/* Heading */}
            <h3
              className="text-2xl text-[#E7D3A8] mb-5"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Customer Stories Coming Soon
            </h3>

            {/* Body */}
            <p
              className="text-[#F8F4EE]/50 mb-10 leading-relaxed max-w-sm mx-auto"
              style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
            >
              We&rsquo;re welcoming our first Khwab family. Be among the first
              to share your experience.
            </p>

            {/* CTA */}
            <Link
              href="/shop"
              className="inline-flex items-center justify-center px-8 py-3.5 text-sm tracking-[0.15em] uppercase bg-[#5A189A] text-[#F8F4EE] border border-[#E7D3A8]/30 hover:bg-[#7B3DBF] hover:shadow-[0_8px_30px_rgba(90,24,154,0.4)] transition-all duration-300"
              style={{ fontFamily: "var(--font-inter)", fontWeight: 400 }}
            >
              Shop Now
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
