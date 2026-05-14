import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Toaster } from "@/components/common/Toaster";
import { Providers } from "@/components/common/Providers";
import { CookieBanner } from "@/components/common/CookieBanner";
import { Analytics } from "@/components/common/Analytics";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL ?? "https://khwab.ca"),
  title: {
    default: "Khwab — Premium Home Textiles | Canadian Made",
    template: "%s | Khwab",
  },
  description:
    "Premium Pakistani-inspired bedsheets, comforter sets, and bath towels. Family-owned, Canadian-made with 25 years of experience. Shop now and elevate your home.",
  keywords: [
    "bedsheets", "comforters", "bath towels", "home textiles",
    "Pakistani textiles", "Canadian made", "premium bedding", "Toronto",
  ],
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: "https://khwab.ca",
    siteName: "Khwab",
    title: "Khwab — Premium Home Textiles | Canadian Made",
    description: "Premium Pakistani-inspired bedsheets, comforter sets, and bath towels for the modern Canadian home.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Khwab Home Textiles" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Khwab — Premium Home Textiles",
    description: "Premium Pakistani-inspired home textiles for the modern Canadian home.",
    images: ["/og-image.jpg"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body>
        <Providers>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-[100] bg-[#1A1410] text-white px-4 py-2 rounded-lg"
          >
            Skip to content
          </a>
          <Navbar />
          <main id="main-content">{children}</main>
          <Footer />
          <CartDrawer />
          <Toaster />
          <CookieBanner />
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
