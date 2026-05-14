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

const supportLinks = [
  { label: "FAQ", href: "/faq" },
  { label: "Shipping & Returns", href: "/shipping-returns" },
  { label: "Contact Us", href: "/contact" },
  { label: "About Khwab", href: "/about" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

export function Footer() {
  return (
    <footer
      role="contentinfo"
      style={{ background: "linear-gradient(180deg, #1A0826 0%, #050507 100%)" }}
      className="border-t border-[#E7D3A8]/25"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-5">
              <span
                className="text-2xl text-white tracking-wide block"
                style={{ fontFamily: "var(--font-playfair)", fontWeight: 700 }}
              >
                Khwab
              </span>
              <div
                className="text-[9px] tracking-[0.28em] uppercase mt-0.5"
                style={{ fontFamily: "var(--font-inter)", color: "#D4AF37", fontWeight: 500 }}
              >
                Home Textiles
              </div>
            </Link>

            <p
              className="text-[13px] leading-relaxed mb-6 max-w-[200px]"
              style={{ fontFamily: "var(--font-inter)", color: "rgba(220,212,236,0.6)", fontWeight: 300 }}
            >
              Premium Pakistani-inspired home textiles for the modern Canadian home.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-2.5">
              <a
                href="#"
                aria-label="Instagram"
                className="w-8 h-8 border border-[#E7D3A8]/20 text-[#E7D3A8] hover:text-[#C9A961] hover:border-[#C9A961]/40 flex items-center justify-center transition-colors duration-300"
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="w-8 h-8 border border-[#E7D3A8]/20 text-[#E7D3A8] hover:text-[#C9A961] hover:border-[#C9A961]/40 flex items-center justify-center transition-colors duration-300"
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="Email"
                className="w-8 h-8 border border-[#E7D3A8]/20 text-[#E7D3A8] hover:text-[#C9A961] hover:border-[#C9A961]/40 flex items-center justify-center transition-colors duration-300"
              >
                <Mail size={14} />
              </a>
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h3
              className="text-[10px] tracking-[0.32em] uppercase mb-5"
              style={{ color: "#D4AF37", fontWeight: 600 }}
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Shop
            </h3>
            <ul className="space-y-3">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[13px] hover:text-white transition-colors duration-200" style={{ color: "rgba(220,212,236,0.65)", fontWeight: 300 }}
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h3
              className="text-[10px] tracking-[0.32em] uppercase mb-5"
              style={{ color: "#D4AF37", fontWeight: 600 }}
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Support
            </h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[13px] hover:text-white transition-colors duration-200" style={{ color: "rgba(220,212,236,0.65)", fontWeight: 300 }}
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h3
              className="text-[10px] tracking-[0.32em] uppercase mb-5"
              style={{ color: "#D4AF37", fontWeight: 600 }}
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Newsletter
            </h3>
            <p
              className="text-[13px] mb-4 leading-relaxed" style={{ color: "rgba(220,212,236,0.6)", fontWeight: 300 }}
              style={{ fontFamily: "var(--font-inter)" }}
            >
              New arrivals and exclusive offers — right to your inbox.
            </p>
            <NewsletterForm compact />
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#E7D3A8]/10">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p
            className="text-[11px] text-[#F8F4EE]/20"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            &copy; {new Date().getFullYear()} Khwab Home Textiles. All rights reserved.
          </p>
          <p
            className="text-[11px] text-[#F8F4EE]/20"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Canadian Owned &amp; Operated
          </p>
        </div>
      </div>
    </footer>
  );
}
