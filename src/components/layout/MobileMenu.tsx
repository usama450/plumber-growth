"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X, ChevronRight } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

const menuLinks = [
  { label: "Shop All", href: "/shop" },
  { label: "Bedsheets", href: "/shop/bedsheets" },
  { label: "Comforter Sets", href: "/shop/comforters" },
  { label: "Bath Towels", href: "/shop/towels" },
  { label: "Gift Bundles", href: "/shop/gift-bundles" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { data: session } = useSession();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-[#050507]/80 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-[85vw] max-w-[340px] bg-[#1A0826] shadow-2xl flex flex-col transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E7D3A8]/10">
          <div>
            <span
              className="text-xl font-light text-[#E7D3A8] tracking-wide block"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Khwab
            </span>
            <div
              className="text-[9px] tracking-[0.3em] uppercase text-[#E7D3A8]/60 mt-0.5"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Home Textiles
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#E7D3A8]/50 hover:text-[#E7D3A8] transition-colors"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto py-4" aria-label="Mobile navigation">
          {menuLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="flex items-center justify-between px-6 py-4 text-[15px] text-[#F8F4EE]/60 hover:text-[#F8F4EE] hover:bg-[#5A189A]/20 transition-colors border-b border-[#E7D3A8]/10"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {link.label}
              <ChevronRight size={14} className="text-[#E7D3A8]/40" />
            </Link>
          ))}
        </nav>

        {/* Account section */}
        <div className="border-t border-[#E7D3A8]/20 p-6 space-y-3 bg-[#050507]/40">
          {session ? (
            <>
              <Link
                href="/account"
                onClick={onClose}
                className="block w-full text-center py-3 px-4 bg-[#5A189A] text-[#F8F4EE] text-[13px] tracking-wide rounded hover:bg-[#7B3DBF] transition-colors duration-300"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                My Account
              </Link>
              <button
                onClick={() => { signOut(); onClose(); }}
                className="block w-full text-center py-3 px-4 text-[13px] text-[#E7D3A8]/60 hover:text-[#E7D3A8] transition-colors"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={onClose}
                className="block w-full text-center py-3 px-4 bg-[#5A189A] text-[#F8F4EE] text-[13px] tracking-wide rounded hover:bg-[#7B3DBF] transition-colors duration-300"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={onClose}
                className="block w-full text-center py-3 px-4 border border-[#E7D3A8]/55 text-[#E7D3A8] text-[13px] tracking-wide rounded hover:bg-[#E7D3A8]/10 transition-colors duration-300"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Create Account
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
