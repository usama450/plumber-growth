import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Award, Layers, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Khwab — a Canadian home textiles brand born from a deep appreciation for quality craftsmanship and the rich textile traditions of Pakistan.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Dark hero section */}
      <div className="bg-[#050507] min-h-[60vh] flex items-center relative overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=2400&q=85"
          alt="Premium home textiles"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-[#050507]/70" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-20">
          <p
            className="text-[10px] text-[#E7D3A8]/70 tracking-[0.4em] uppercase mb-4"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Est. 2024
          </p>
          <h1
            className="font-bold text-[#E7D3A8] max-w-xl mb-6"
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "clamp(1.8rem, 4vw, 3rem)",
            }}
          >
            A New Chapter in Canadian Textiles
          </h1>
          <p
            className="text-[#F8F4EE]/60 font-light max-w-lg text-lg"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Crafted with care. Inspired by heritage. Made for the modern home.
          </p>
        </div>
      </div>

      {/* Light content section */}
      <div className="bg-[#F8F4EE]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Brand story */}
          <div className="mb-16">
            <h2
              className="text-[#5A189A] text-2xl sm:text-3xl font-bold mb-6"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              About Khwab
            </h2>
            <div className="space-y-4">
              <p
                className="text-[#1A1A1A] font-light leading-relaxed text-base"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Khwab — meaning &ldquo;dream&rdquo; in Urdu — is a Canadian home textiles brand
                born from a deep appreciation for quality craftsmanship and the rich textile
                traditions of Pakistan. We believe your home deserves the best, and that premium
                quality shouldn&apos;t be out of reach.
              </p>
              <p
                className="text-[#1A1A1A] font-light leading-relaxed text-base"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                We partner with a trusted, family-owned Canadian manufacturer based in the Greater
                Toronto Area, with over 25 years of expertise in textile production. This
                partnership allows us to bring you beautifully crafted bedsheets, comforters, and
                towels — made in Canada, inspired by heritage, designed for the modern home.
              </p>
            </div>
          </div>

          {/* Feature cards */}
          <div className="grid sm:grid-cols-3 gap-6 mb-16">
            {[
              {
                Icon: Award,
                title: "Canadian Made",
                text: "Every product is manufactured in the Greater Toronto Area. Canadian quality, through and through.",
              },
              {
                Icon: Layers,
                title: "Premium Quality",
                text: "From thread count to finishing, we hold every product to the highest standard — because your home deserves it.",
              },
              {
                Icon: Users,
                title: "Family Partnership",
                text: "We work with a family-owned Canadian manufacturer with 25+ years of expertise, sharing our commitment to quality.",
              },
            ].map(({ Icon, title, text }) => (
              <div
                key={title}
                className="bg-white border border-[#E8DFF5] rounded-[8px] p-6 hover:shadow-md transition-shadow"
              >
                <Icon size={24} className="text-[#5A189A] mb-4" />
                <h3
                  className="text-[#1A1A1A] text-lg font-bold mb-2"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {title}
                </h3>
                <p
                  className="text-[#8B8B8B] text-sm font-light leading-relaxed"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {text}
                </p>
              </div>
            ))}
          </div>

          {/* Textile image section */}
          <div className="mb-16">
            <div className="relative w-full aspect-[16/7] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1600&q=85"
                alt="Premium fabric texture — every thread crafted with care"
                fill
                className="object-cover"
              />
            </div>
            <p
              className="text-[#8B8B8B] text-sm italic text-center mt-3"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Every thread crafted with care
            </p>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-[#5A189A] text-[#F8F4EE] border border-[#E7D3A8]/30 px-6 py-3 text-sm tracking-[0.1em] uppercase hover:bg-[#7B3DBF] hover:shadow-[0_8px_30px_rgba(90,24,154,0.4)] transition-all rounded-[4px]"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Shop Our Collection
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
