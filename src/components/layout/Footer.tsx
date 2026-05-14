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
];

const companyLinks = [
  { label: "About Khwab", href: "/about" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

export function Footer() {
  return (
    <footer className="bg-[#1A1410]" role="contentinfo">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-5">
              <span className="text-2xl font-light text-[#F7F3EE] tracking-wide"
                style={{ fontFamily: "var(--font-cormorant)" }}>
                Khwab
              </span>
              <div className="text-[9px] text-[#C4992E] tracking-[0.3em] uppercase mt-0.5"
                style={{ fontFamily: "var(--font-dm)" }}>
                Home Textiles
              </div>
            </Link>
            <p className="text-[13px] text-[#F7F3EE]/45 leading-relaxed mb-6 max-w-[200px]"
              style={{ fontFamily: "var(--font-dm)" }}>
              Premium Pakistani-inspired home textiles for the modern Canadian home.
            </p>
            <div className="flex items-center gap-2.5">
              {[
                {
                  href: "https://instagram.com/khwabhome",
                  label: "Instagram",
                  icon: <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>,
                },
                {
                  href: "https://facebook.com/khwabhome",
                  label: "Facebook",
                  icon: <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
                },
                {
                  href: "mailto:hello@khwab.ca",
                  label: "Email",
                  icon: <Mail size={14} />,
                },
              ].map((s) => (
                <a key={s.label} href={s.href}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="w-8 h-8 border border-[#F7F3EE]/15 text-[#F7F3EE]/40 hover:text-[#C4992E] hover:border-[#C4992E]/40 flex items-center justify-center transition-colors duration-300"
                  aria-label={s.label}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-[10px] tracking-[0.3em] uppercase text-[#F7F3EE]/30 mb-5"
              style={{ fontFamily: "var(--font-dm)" }}>
              Shop
            </h3>
            <ul className="space-y-3">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}
                    className="text-[13px] text-[#F7F3EE]/50 hover:text-[#F7F3EE] transition-colors duration-200"
                    style={{ fontFamily: "var(--font-dm)" }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-[10px] tracking-[0.3em] uppercase text-[#F7F3EE]/30 mb-5"
              style={{ fontFamily: "var(--font-dm)" }}>
              Support
            </h3>
            <ul className="space-y-3">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}
                    className="text-[13px] text-[#F7F3EE]/50 hover:text-[#F7F3EE] transition-colors duration-200"
                    style={{ fontFamily: "var(--font-dm)" }}>
                    {link.label}
                  </Link>
                </li>
              ))}
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}
                    className="text-[13px] text-[#F7F3EE]/50 hover:text-[#F7F3EE] transition-colors duration-200"
                    style={{ fontFamily: "var(--font-dm)" }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-[10px] tracking-[0.3em] uppercase text-[#F7F3EE]/30 mb-5"
              style={{ fontFamily: "var(--font-dm)" }}>
              Stay in Touch
            </h3>
            <p className="text-[13px] text-[#F7F3EE]/45 mb-4 leading-relaxed"
              style={{ fontFamily: "var(--font-dm)" }}>
              New arrivals and exclusive offers — right to your inbox.
            </p>
            <NewsletterForm compact />
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#F7F3EE]/08">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[11px] text-[#F7F3EE]/25" style={{ fontFamily: "var(--font-dm)" }}>
            © {new Date().getFullYear()} Khwab Home Textiles. All rights reserved.
          </p>
          <p className="text-[11px] text-[#F7F3EE]/25" style={{ fontFamily: "var(--font-dm)" }}>
            Canadian Owned & Operated
          </p>
        </div>
      </div>
    </footer>
  );
}
