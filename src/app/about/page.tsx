import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Khwab — a family-owned, Canadian-made home textiles brand with 25 years of experience and Pakistani heritage.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Hero */}
      <div className="relative h-64 sm:h-80 overflow-hidden">
        <Image src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1400&q=85"
          alt="Khwab team" fill className="object-cover" />
        <div className="absolute inset-0 bg-[#1A1410]/60" />
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <div>
            <h1 className="font-playfair font-semibold text-white text-4xl mb-3"
              style={{ fontFamily: "var(--font-cormorant)" }}>Our Story</h1>
            <p className="text-white/80 font-inter font-light max-w-md mx-auto">Family-owned. Canadian-made. Inspired by Pakistan.</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Story sections */}
        <div className="space-y-16">
          <div id="story" className="grid sm:grid-cols-2 gap-10 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8 bg-[#C9A961]" />
                <span className="text-xs font-inter tracking-[0.2em] uppercase text-[#C9A961] font-light">The Beginning</span>
              </div>
              <h2 className="font-playfair font-semibold text-[#1A1410] text-2xl mb-4"
                style={{ fontFamily: "var(--font-cormorant)" }}>From Pakistan to Canada, with love</h2>
              <div className="space-y-3 font-inter font-light text-[#2A2A2A] leading-relaxed text-sm">
                <p>Khwab — meaning <em>&ldquo;dream&rdquo;</em> in Urdu — was founded in 1999 by the Ahmed family, who immigrated from Lahore to Toronto with a simple dream: to bring the world&apos;s finest home textiles to Canadian families.</p>
                <p>Drawing on Pakistan&apos;s centuries-old tradition of textile craftsmanship — the same heritage that made Pakistani cotton famous around the world — we set up our manufacturing facility in the Greater Toronto Area.</p>
              </div>
            </div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <Image src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=85"
                alt="Beautiful home with Khwab textiles" fill className="object-cover" />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: "🍁", title: "Canadian Made", text: "Every product is manufactured in our GTA facility. We oversee quality at every step." },
              { icon: "✦", title: "25 Years Experience", text: "A quarter century of perfecting the craft of premium home textiles." },
              { icon: "🌿", title: "Sustainable Sourcing", text: "We partner with ethical cotton farms in Egypt and Pakistan for our finest materials." },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-6 border border-[#F7F3EE]/60 text-center">
                <span className="text-3xl mb-3 block">{item.icon}</span>
                <h3 className="font-playfair font-semibold text-[#1A1410] text-lg mb-2"
                  style={{ fontFamily: "var(--font-cormorant)" }}>{item.title}</h3>
                <p className="text-sm font-inter font-light text-[#8B8B8B] leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#1A1410] text-white font-inter font-normal text-sm rounded-xl hover:bg-[#5B3A6B] transition-colors">
            Shop Our Collection →
          </Link>
        </div>
      </div>
    </div>
  );
}
