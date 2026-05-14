"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronDown, MapPin, Package, Heart } from "lucide-react";

// ---------------------------------------------------------------------------
// FloatingParticles — positions generated client-side to avoid hydration mismatch
// ---------------------------------------------------------------------------
interface Particle {
  id: number;
  width: number;
  height: number;
  top: string;
  left: string;
  backgroundColor: string;
  animationDuration: string;
  animationDelay: string;
}

function FloatingParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const generated: Particle[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      width: 2 + Math.random() * 2,   // 2–4 px
      height: 2 + Math.random() * 2,
      top: `${Math.random() * 95}%`,
      left: `${Math.random() * 95}%`,
      backgroundColor:
        i % 2 === 0 ? "rgba(231,211,168,0.6)" : "rgba(201,169,97,0.4)",
      animationDuration: `${8 + Math.random() * 12}s`,
      animationDelay: `${Math.random() * 8}s`,
    }));
    setParticles(generated);
  }, []);

  if (particles.length === 0) return null;

  return (
    <>
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: p.width,
            height: p.height,
            top: p.top,
            left: p.left,
            backgroundColor: p.backgroundColor,
            animation: `floatParticle ${p.animationDuration} ease-in-out infinite`,
            animationDelay: p.animationDelay,
          }}
        />
      ))}
    </>
  );
}

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------
const headlineContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const wordVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
});

// ---------------------------------------------------------------------------
// HeroSection
// ---------------------------------------------------------------------------
export function HeroSection() {
  return (
    <section className="relative min-h-screen bg-[#050507] overflow-hidden">
      {/* Ken Burns background image */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="ken-burns absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=2400&q=85"
            alt="Luxurious Khwab bedroom"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#050507]/90 via-[#050507]/60 to-transparent" />
      </div>

      {/* Floating gold particles */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        <FloatingParticles />
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Main content                                                        */}
      {/* ----------------------------------------------------------------- */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 min-h-screen flex flex-col justify-center pt-24 pb-32">
        <div className="max-w-3xl">

          {/* Eyebrow */}
          <motion.p
            {...fadeUp(0.1)}
            className="mb-8 text-[10px] tracking-[0.4em] uppercase text-[#E7D3A8]/60"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Est. 2024 · Canadian Made
          </motion.p>

          {/* Headline — word-by-word Framer Motion */}
          <motion.div
            className="mb-6 flex flex-col"
            variants={headlineContainer}
            initial="hidden"
            animate="visible"
          >
            {["Where", "Dreams", "Begin"].map((word) => (
              <motion.div
                key={word}
                variants={wordVariant}
                style={{
                  fontFamily: "var(--font-playfair)",
                  fontSize: "clamp(2.5rem, 6vw, 5rem)",
                  fontWeight: 700,
                  color: "#E7D3A8",
                  lineHeight: 1.1,
                }}
              >
                {word}
              </motion.div>
            ))}
          </motion.div>

          {/* Subheading */}
          <motion.p
            {...fadeUp(0.5)}
            className="max-w-md mb-10"
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "18px",
              fontWeight: 300,
              color: "rgba(248,244,238,0.75)",
            }}
          >
            Premium home textiles crafted for the modern Canadian home.
          </motion.p>

          {/* CTA buttons */}
          <motion.div {...fadeUp(0.8)} className="flex flex-col sm:flex-row gap-4">
            <Link href="/shop" className="btn-gold-shimmer">
              Shop Collection
            </Link>
            <Link href="/about" className="btn-secondary">
              Our Story
            </Link>
          </motion.div>
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Live activity card (md+)                                           */}
      {/* ----------------------------------------------------------------- */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="hidden md:block absolute bottom-16 right-8 z-20 bg-[#1A0826]/80 backdrop-blur-md border border-[#3A1A5C] rounded-xl px-4 py-3 min-w-[220px]"
      >
        {/* Row 1 */}
        <div className="flex items-center gap-1.5 mb-1">
          <span className="live-dot" />
          <span
            style={{ fontFamily: "var(--font-inter)", fontSize: "12px" }}
            className="text-[#E7D3A8]"
          >
            47 people viewing{" "}
          </span>
          <span
            style={{ fontFamily: "var(--font-inter)", fontSize: "12px" }}
            className="text-[#A8A4B0]"
          >
            right now
          </span>
        </div>
        {/* Row 2 */}
        <div className="flex items-center gap-1">
          <span
            style={{ fontFamily: "var(--font-inter)", fontSize: "12px" }}
            className="text-[#A8A4B0]"
          >
            Last purchase:
          </span>
          <span
            style={{ fontFamily: "var(--font-inter)", fontSize: "12px" }}
            className="text-[#6B8E4E]"
          >
            {" "}2 mins ago
          </span>
        </div>
      </motion.div>

      {/* ----------------------------------------------------------------- */}
      {/* Bouncing ChevronDown                                               */}
      {/* ----------------------------------------------------------------- */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <ChevronDown size={22} className="text-[#E7D3A8]/50" />
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Badge strip at bottom                                              */}
      {/* ----------------------------------------------------------------- */}
      <div className="absolute bottom-8 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-center sm:justify-start gap-6 sm:gap-8">
            <div className="flex items-center gap-2">
              <MapPin size={13} className="text-[#E7D3A8]/80 shrink-0" />
              <span
                className="text-[11px] tracking-[0.1em] uppercase text-[#E7D3A8]/60"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Canadian Made
              </span>
            </div>
            <div className="w-px h-4 bg-[#E7D3A8]/30 hidden sm:block" />
            <div className="flex items-center gap-2">
              <Package size={13} className="text-[#E7D3A8]/80 shrink-0" />
              <span
                className="text-[11px] tracking-[0.1em] uppercase text-[#E7D3A8]/60"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Free Shipping $125+
              </span>
            </div>
            <div className="w-px h-4 bg-[#E7D3A8]/30 hidden sm:block" />
            <div className="flex items-center gap-2">
              <Heart size={13} className="text-[#E7D3A8]/80 shrink-0" />
              <span
                className="text-[11px] tracking-[0.1em] uppercase text-[#E7D3A8]/60"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Family Owned
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
