import { NewsletterForm } from "@/components/common/NewsletterForm";
import { ScrollReveal } from "@/components/common/ScrollReveal";

export function NewsletterSection() {
  return (
    <section className="py-20 lg:py-24 bg-[#EDE8DF] relative overflow-hidden">
      {/* Decorative large letter */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[20rem] font-light text-[#DDD5C9]/30 leading-none select-none pointer-events-none overflow-hidden"
        style={{ fontFamily: "var(--font-cormorant)" }}>
        K
      </div>

      <div className="relative max-w-2xl mx-auto px-6 sm:px-8 text-center">
        <ScrollReveal type="fade-up">
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="eyebrow-line" />
            <span className="text-[11px] tracking-[0.35em] uppercase text-[#C4992E] font-medium"
              style={{ fontFamily: "var(--font-dm)" }}>
              Join the Family
            </span>
            <span className="eyebrow-line" />
          </div>

          <h2 className="text-[#1A1410] mb-4" style={{ fontFamily: "var(--font-cormorant)" }}>
            Get 10% Off Your First Order
          </h2>

          <p className="text-[15px] text-[#6B6258] mb-9 leading-relaxed max-w-md mx-auto"
            style={{ fontFamily: "var(--font-dm)" }}>
            Subscribe for exclusive offers, new arrival previews, and home styling inspiration.
            No spam — just beautiful things.
          </p>

          <div className="max-w-sm mx-auto">
            <NewsletterForm />
          </div>

          <p className="mt-5 text-[12px] text-[#9A9088]" style={{ fontFamily: "var(--font-dm)" }}>
            By subscribing, you agree to our{" "}
            <a href="/privacy" className="underline hover:text-[#1A1410] transition-colors">Privacy Policy</a>.
            Unsubscribe anytime.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
