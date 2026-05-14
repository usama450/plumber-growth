import { Star } from "lucide-react";
import { ScrollReveal } from "@/components/common/ScrollReveal";

const testimonials = [
  {
    id: 1, name: "Sana M.", location: "Mississauga, ON", rating: 5,
    text: "The sateen weave is so soft — I actually look forward to bedtime now. The quality is exactly like the Pakistani cotton my nani used to have, but modern and crisp.",
    product: "Sateen Bedsheet Set", avatar: "SM",
  },
  {
    id: 2, name: "David K.", location: "Toronto, ON", rating: 5,
    text: "Bought the comforter set as a wedding gift and the couple was over the moon. Beautifully packaged, incredible quality. Will definitely be shopping here for my own home.",
    product: "Luxury Comforter Set", avatar: "DK",
  },
  {
    id: 3, name: "Priya R.", location: "Brampton, ON", rating: 5,
    text: "Finally found towels that are actually plush and absorbent. I've ordered twice now and just ordered again in a different colour. Customer service was also lovely.",
    product: "Premium Bath Towel Set", avatar: "PR",
  },
  {
    id: 4, name: "James T.", location: "Vancouver, BC", rating: 4,
    text: "Love the quality. Ordered from across the country and it arrived quickly with great packaging. The percale sheets have gotten softer with every wash.",
    product: "Percale Bedsheet Set", avatar: "JT",
  },
];

export function Testimonials() {
  return (
    <section className="py-20 lg:py-28 bg-[#1A1410]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">

        <ScrollReveal type="fade-up" className="text-center mb-14">
          <div className="flex items-center justify-center gap-4 mb-5">
            <span className="eyebrow-line" />
            <span className="text-[11px] tracking-[0.35em] uppercase text-[#C4992E] font-medium"
              style={{ fontFamily: "var(--font-dm)" }}>
              Customer Stories
            </span>
            <span className="eyebrow-line" />
          </div>
          <h2 className="text-[#F7F3EE]" style={{ fontFamily: "var(--font-cormorant)" }}>
            Loved Across Canada
          </h2>
          <div className="flex items-center justify-center gap-1.5 mt-4">
            {[1,2,3,4,5].map((i) => (
              <Star key={i} size={14} className="fill-[#C4992E] text-[#C4992E]" />
            ))}
            <span className="ml-2 text-[13px] text-[#F7F3EE]/40"
              style={{ fontFamily: "var(--font-dm)" }}>
              4.9 · 400+ reviews
            </span>
          </div>
        </ScrollReveal>

        <ScrollReveal type="stagger" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-[#F7F3EE]/05 border border-[#F7F3EE]/08 p-6 flex flex-col hover:bg-[#F7F3EE]/08 transition-colors duration-300">
              {/* Stars */}
              <div className="flex gap-0.5 mb-5">
                {[1,2,3,4,5].map((i) => (
                  <Star key={i} size={12}
                    className={i <= t.rating ? "fill-[#C4992E] text-[#C4992E]" : "text-[#F7F3EE]/20"} />
                ))}
              </div>

              {/* Quote */}
              <p className="text-[14px] text-[#F7F3EE]/65 leading-relaxed flex-1 mb-6"
                style={{ fontFamily: "var(--font-dm)", fontStyle: "italic" }}>
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Product */}
              <div className="text-[10px] tracking-[0.2em] uppercase text-[#C4992E]/70 mb-5"
                style={{ fontFamily: "var(--font-dm)" }}>
                {t.product}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 border-t border-[#F7F3EE]/08 pt-4">
                <div className="w-8 h-8 bg-[#C4992E]/20 flex items-center justify-center shrink-0">
                  <span className="text-[10px] text-[#C4992E] font-medium" style={{ fontFamily: "var(--font-dm)" }}>
                    {t.avatar}
                  </span>
                </div>
                <div>
                  <p className="text-[13px] text-[#F7F3EE]/80 font-medium" style={{ fontFamily: "var(--font-dm)" }}>
                    {t.name}
                  </p>
                  <p className="text-[11px] text-[#F7F3EE]/35" style={{ fontFamily: "var(--font-dm)" }}>
                    {t.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}
