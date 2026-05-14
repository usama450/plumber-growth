import Link from "next/link";
import { Mail } from "lucide-react";
import { NewsletterForm } from "@/components/common/NewsletterForm";

const shopLinks = [
  { label: "Bedsheets", href: "/shop/bedsheets" },
  { label: "Comforter Sets", href: "/shop/comforters" },
  { label: "Bath Towels", href: "/shop/towels" },
  { label: "Gift Bundles", href: "/shop/gift-bundles" },
  { label: "Sale", href: "/shop?sale=true" },
];

const serviceLinks = [
  { label: "FAQ", href: "/faq" },
  { label: "Shipping & Returns", href: "/shipping-returns" },
  { label: "Contact Us", href: "/contact" },
  { label: "Size Guide", href: "/size-guide" },
  { label: "Care Instructions", href: "/care" },
];

const companyLinks = [
  { label: "About Khwab", href: "/about" },
  { label: "Our Story", href: "/about#story" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

export function Footer() {
  return (
    <footer className="bg-[#D4C5B0]/40 border-t border-[#D4C5B0]" role="contentinfo">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span
                className="font-playfair text-2xl font-semibold text-[#4A2C5A]"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Khwab
              </span>
              <div className="text-[10px] text-[#C9A961] tracking-[0.2em] uppercase font-inter font-light mt-0.5">
                Home Textiles
              </div>
            </Link>
            <p className="text-sm text-[#2A2A2A] font-inter font-light leading-relaxed mb-5 max-w-[220px]">
              Premium Pakistani-inspired home textiles for the modern Canadian home. Family-owned, Canadian-made.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com/khwabhome"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-[#D4C5B0] text-[#4A2C5A] hover:bg-[#4A2C5A] hover:text-white hover:border-[#4A2C5A] transition-all"
                aria-label="Instagram"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a
                href="https://facebook.com/khwabhome"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-[#D4C5B0] text-[#4A2C5A] hover:bg-[#4A2C5A] hover:text-white hover:border-[#4A2C5A] transition-all"
                aria-label="Facebook"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a
                href="mailto:hello@khwab.ca"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-[#D4C5B0] text-[#4A2C5A] hover:bg-[#4A2C5A] hover:text-white hover:border-[#4A2C5A] transition-all"
                aria-label="Email us"
              >
                <Mail size={16} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3
              className="text-xs font-inter font-medium text-[#4A2C5A] uppercase tracking-[0.15em] mb-5"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Shop
            </h3>
            <ul className="space-y-2.5">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#2A2A2A] font-inter font-light hover:text-[#4A2C5A] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3
              className="text-xs font-inter font-medium text-[#4A2C5A] uppercase tracking-[0.15em] mb-5"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Customer Service
            </h3>
            <ul className="space-y-2.5">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#2A2A2A] font-inter font-light hover:text-[#4A2C5A] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3
              className="text-xs font-inter font-medium text-[#4A2C5A] uppercase tracking-[0.15em] mb-5"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Stay in Touch
            </h3>
            <p className="text-sm text-[#2A2A2A] font-inter font-light mb-4 leading-relaxed">
              New arrivals, exclusive offers, and home inspiration — right to your inbox.
            </p>
            <NewsletterForm compact />
            <div className="mt-5 space-y-1">
              {companyLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-sm text-[#2A2A2A] font-inter font-light hover:text-[#4A2C5A] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#D4C5B0] bg-[#D4C5B0]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-[#8B8B8B] font-inter font-light text-center sm:text-left">
            © {new Date().getFullYear()} Khwab Home Textiles. All rights reserved. Made with ❤️ in Canada.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-[#8B8B8B] font-inter">
              🇨🇦 Canadian Owned & Operated
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
