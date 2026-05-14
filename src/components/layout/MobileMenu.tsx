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
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-[#1A1410]/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-[85vw] max-w-[340px] bg-[#F7F3EE] shadow-2xl transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#DDD5C9]">
            <div>
              <span className="text-xl font-light text-[#1A1410] tracking-wide"
                style={{ fontFamily: "var(--font-cormorant)" }}>
                Khwab
              </span>
              <div className="text-[9px] tracking-[0.3em] uppercase text-[#C4992E]"
                style={{ fontFamily: "var(--font-dm)" }}>
                Home Textiles
              </div>
            </div>
            <button onClick={onClose}
              className="p-2 text-[#1A1410]/50 hover:text-[#1A1410] transition-colors"
              aria-label="Close menu">
              <X size={20} />
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex-1 overflow-y-auto py-4">
            {menuLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={onClose}
                className="flex items-center justify-between px-6 py-4 text-[15px] text-[#1A1410]/70 hover:text-[#1A1410] hover:bg-[#EDE8DF]/50 transition-colors border-b border-[#DDD5C9]/30"
                style={{ fontFamily: "var(--font-dm)" }}>
                {link.label}
                <ChevronRight size={14} className="text-[#9A9088]" />
              </Link>
            ))}
          </nav>

          {/* Account */}
          <div className="border-t border-[#DDD5C9] p-6 space-y-3">
            {session ? (
              <>
                <Link href="/account" onClick={onClose}
                  className="block w-full text-center py-3 px-4 border border-[#1A1410] text-[#1A1410] text-[13px] tracking-wide hover:bg-[#1A1410] hover:text-[#F7F3EE] transition-colors duration-300"
                  style={{ fontFamily: "var(--font-dm)" }}>
                  My Account
                </Link>
                <button onClick={() => { signOut(); onClose(); }}
                  className="block w-full text-center py-3 px-4 text-[13px] text-[#9A9088] hover:text-[#1A1410] transition-colors"
                  style={{ fontFamily: "var(--font-dm)" }}>
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={onClose}
                  className="block w-full text-center py-3 px-4 bg-[#1A1410] text-[#F7F3EE] text-[13px] tracking-wide hover:bg-[#2E2318] transition-colors duration-300"
                  style={{ fontFamily: "var(--font-dm)" }}>
                  Sign In
                </Link>
                <Link href="/register" onClick={onClose}
                  className="block w-full text-center py-3 px-4 border border-[#1A1410] text-[#1A1410] text-[13px] tracking-wide hover:bg-[#EDE8DF] transition-colors duration-300"
                  style={{ fontFamily: "var(--font-dm)" }}>
                  Create Account
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
