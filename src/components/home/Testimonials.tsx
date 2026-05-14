import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sana M.",
    location: "Mississauga, ON",
    rating: 5,
    text: "Absolutely obsessed with these sheets. The sateen weave is so soft — I actually look forward to bedtime now. The quality is exactly like the Pakistani cotton my nani used to have but modern and crisp.",
    product: "Sateen Bedsheet Set",
    avatar: "SM",
  },
  {
    id: 2,
    name: "David K.",
    location: "Toronto, ON",
    rating: 5,
    text: "Bought the comforter set as a wedding gift and the couple was over the moon. Beautifully packaged, incredible quality. Will definitely be shopping here for my own home next.",
    product: "Luxury Comforter Set",
    avatar: "DK",
  },
  {
    id: 3,
    name: "Priya R.",
    location: "Brampton, ON",
    rating: 5,
    text: "Finally found towels that are actually plush and absorbent. I've ordered twice now and just ordered again in a different colour. The customer service was also lovely when I had a question.",
    product: "Premium Bath Towel Set",
    avatar: "PR",
  },
  {
    id: 4,
    name: "James T.",
    location: "Vancouver, BC",
    rating: 4,
    text: "Love the quality. Ordered from across the country and it arrived quickly with great packaging. The percale sheets have gotten softer with every wash. Highly recommend.",
    product: "Percale Bedsheet Set",
    avatar: "JT",
  },
];

export function Testimonials() {
  return (
    <section className="py-16 lg:py-24 bg-[#E8DFF5]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8 bg-[#C9A961]" />
            <span className="text-xs font-inter tracking-[0.2em] uppercase text-[#C9A961] font-light">
              Customer Stories
            </span>
            <div className="h-px w-8 bg-[#C9A961]" />
          </div>
          <h2
            className="font-playfair font-semibold text-[#4A2C5A]"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Loved Across Canada
          </h2>
          <div className="flex items-center justify-center gap-1 mt-3">
            {[1,2,3,4,5].map((i) => (
              <Star key={i} size={16} className="fill-[#C9A961] text-[#C9A961]" />
            ))}
            <span className="ml-2 text-sm font-inter font-light text-[#8B8B8B]">
              4.9 average from 400+ reviews
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-2xl p-6 border border-[#E8DFF5]/60 shadow-[0_2px_12px_rgba(74,44,90,0.06)] flex flex-col"
            >
              {/* Stars */}
              <div className="flex items-center gap-0.5 mb-4">
                {[1,2,3,4,5].map((i) => (
                  <Star
                    key={i}
                    size={13}
                    className={i <= t.rating ? "fill-[#C9A961] text-[#C9A961]" : "text-[#D4C5B0]"}
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm font-inter font-light text-[#2A2A2A] leading-relaxed flex-1 mb-5">
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Product tag */}
              <div className="text-[11px] font-inter text-[#8B8B8B] bg-[#E8DFF5]/40 rounded-full px-3 py-1 self-start mb-4">
                {t.product}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 border-t border-[#E8DFF5] pt-4">
                <div className="w-9 h-9 rounded-full bg-[#4A2C5A] flex items-center justify-center shrink-0">
                  <span className="text-xs font-inter font-normal text-white">{t.avatar}</span>
                </div>
                <div>
                  <p className="text-sm font-inter font-normal text-[#2A2A2A]">{t.name}</p>
                  <p className="text-xs font-inter font-light text-[#8B8B8B]">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
