"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ScrollReveal } from "@/components/common/ScrollReveal";

function FloatingParticles() {
  const [particles, setParticles] = useState<Array<{
    id: number; left: number; size: number; duration: number; delay: number; gold: boolean;
  }>>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        left: Math.random() * 95,
        size: 2 + Math.random() * 2,
        duration: 10 + Math.random() * 10,
        delay: Math.random() * 6,
        gold: i % 2 === 0,
      }))
    );
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            bottom: 0,
            width: p.size,
            height: p.size,
            backgroundColor: p.gold ? "rgba(231,211,168,0.5)" : "rgba(201,169,97,0.35)",
            animation: `floatParticle ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

export function BrandStory() {
  return (
    <section className="py-20 lg:py-28 bg-[#0D0415] relative overflow-hidden">
      {/* Decorative radial glow top-right */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at top right, rgba(157,78,221,0.12), transparent 70%)",
        }}
      />

      {/* Decorative radial glow bottom-left */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at bottom left, rgba(90,24,154,0.08), transparent 70%)",
        }}
      />

      {/* Floating particles */}
      <FloatingParticles />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">

          {/* Image column */}
          <ScrollReveal type="fade-right" className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/5] overflow-hidden border border-[#E7D3A8]/20">
              <Image
                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=85"
                alt="Khwab home textiles lifestyle"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />

              {/* Decorative gold corner — top-left */}
              <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-[#E7D3A8]/40 pointer-events-none" />
              {/* Decorative gold corner — bottom-right */}
              <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-[#E7D3A8]/40 pointer-events-none" />
            </div>
          </ScrollReveal>

          {/* Text column */}
          <ScrollReveal type="fade-left" className="order-1 lg:order-2">
            {/* Eyebrow */}
            <p
              className="text-[11px] tracking-[0.45em] uppercase mb-5"
              style={{ fontFamily: "var(--font-inter)", color: "#D4AF37", fontWeight: 500 }}
            >
              Our Story
            </p>

            {/* Heading */}
            <h2
              className="text-white mb-7 leading-tight"
              style={{
                fontFamily: "var(--font-playfair)",
                fontSize: "clamp(1.7rem, 3vw, 2.6rem)",
                fontWeight: 600,
              }}
            >
              A Family Legacy Woven Into Every Thread
            </h2>

            {/* Body paragraphs */}
            <div
              className="space-y-5 mb-10"
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "16px",
                fontWeight: 300,
                lineHeight: 1.85,
                color: "rgba(220,212,236,0.8)",
              }}
            >
              <p>
                Khwab — meaning &ldquo;dream&rdquo; in Urdu — is a Canadian home
                textiles brand born from a love of premium craftsmanship and the
                rich textile heritage of Pakistan.
              </p>
              <p>
                We partner with a trusted Canadian manufacturer with over 25
                years of expertise to bring beautifully crafted bedsheets,
                comforters, and towels to homes across Canada. Every thread
                tells a story of quality and care.
              </p>
            </div>

            {/* Single stat */}
            <div className="border-t border-[#E7D3A8]/15 pt-8 mb-10">
              <div className="flex items-baseline gap-3">
                <span
                  className="text-3xl text-white"
                  style={{ fontFamily: "var(--font-playfair)", fontWeight: 700 }}
                >
                  25+
                </span>
                <span
                  className="text-[13px] tracking-wide"
                  style={{ fontFamily: "var(--font-inter)", color: "rgba(212,175,55,0.8)", fontWeight: 400 }}
                >
                  Years of Manufacturing Expertise
                </span>
              </div>
            </div>

            {/* CTA */}
            <Link
              href="/about"
              className="btn-gold-shimmer inline-flex items-center justify-center gap-2.5 px-8 py-3.5 text-sm tracking-[0.15em] uppercase"
              style={{ fontFamily: "var(--font-inter)", fontWeight: 400 }}
            >
              Read Our Story
            </Link>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
