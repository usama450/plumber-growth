import { NewsletterForm } from "@/components/common/NewsletterForm";

export function NewsletterSection() {
  return (
    <section className="py-16 lg:py-20 bg-[#4A2C5A] relative overflow-hidden">
      {/* Decorative background pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle, #E8DFF5 1px, transparent 1px),
            radial-gradient(circle at 50% 50%, #C9A961 1px, transparent 1px)`,
          backgroundSize: "60px 60px, 30px 30px",
          backgroundPosition: "0 0, 15px 15px",
        }}
      />

      {/* Gold accent circles */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#C9A961]/10 -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-[#B8A4D4]/20 translate-y-1/2 -translate-x-1/4" />

      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-px w-8 bg-[#C9A961]" />
          <span className="text-xs font-inter tracking-[0.2em] uppercase text-[#C9A961] font-light">
            Join the Family
          </span>
          <div className="h-px w-8 bg-[#C9A961]" />
        </div>

        <h2
          className="font-playfair font-semibold text-white mb-4"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Get 10% Off Your First Order
        </h2>

        <p className="text-base font-inter font-light text-[#E8DFF5] mb-8 leading-relaxed">
          Subscribe to our newsletter for exclusive offers, new arrival previews, and home styling inspiration. No spam — just beautiful things.
        </p>

        <div className="max-w-md mx-auto">
          <NewsletterForm />
        </div>

        <p className="mt-4 text-xs font-inter font-light text-[#B8A4D4]">
          By subscribing, you agree to our{" "}
          <a href="/privacy" className="underline hover:text-white transition-colors">Privacy Policy</a>.
          Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}
