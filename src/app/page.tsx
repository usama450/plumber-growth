import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { BrandStory } from "@/components/home/BrandStory";
import { Testimonials } from "@/components/home/Testimonials";
import { NewsletterSection } from "@/components/home/NewsletterSection";

export const metadata: Metadata = {
  title: "Khwab — Premium Home Textiles | Canadian Made",
  description:
    "Premium Pakistani-inspired bedsheets, comforter sets, and bath towels for the modern Canadian home. Family-owned, Canadian-made with 25 years of experience.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoryGrid />
      <FeaturedProducts />
      <BrandStory />
      <Testimonials />
      <NewsletterSection />
    </>
  );
}
