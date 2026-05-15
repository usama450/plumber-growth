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
        className={`fixed inset-0 z-50 bg-[#1A1714]/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-[85vw] max-w-[340px] bg-white shadow-2xl flex flex-col transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E2DDD7]">
          <div>
            <span
              className="text-xl text-[#2C4A35] tracking-wide block"
              style={{ fontFamily: "var(--font-playfair)", fontWeight: 700 }}
            >
              Khwab
            </span>
            <div
              className="text-[9px] tracking-[0.3em] uppercase text-[#A67C3C] mt-0.5"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Home Textiles
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#1A1714] hover:text-[#2C4A35] transition-colors"
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
              className="flex items-center justify-between px-6 py-4 text-[15px] text-[#1A1714] hover:text-[#2C4A35] hover:bg-[#F4F0EB] transition-colors border-b border-[#E2DDD7]"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {link.label}
              <ChevronRight size={14} className="text-[#B5AFA8]" />
            </Link>
          ))}
        </nav>

        {/* Account section */}
        <div className="border-t border-[#E2DDD7] p-6 space-y-3 bg-[#F4F0EB]">
          <p
            className="text-[10px] tracking-[0.25em] uppercase text-[#A67C3C] mb-4"
            style={{ fontFamily: "var(--font-inter)", fontWeight: 600 }}
          >
            Account
          </p>
          {session ? (
            <>
              <Link
                href="/account"
                onClick={onClose}
                className="block w-full text-center py-3 px-4 bg-[#2C4A35] text-[#F9F7F4] text-[12px] tracking-[0.14em] uppercase transition-colors duration-300 hover:bg-[#3D6147]"
                style={{ fontFamily: "var(--font-inter)", borderRadius: "2px" }}
              >
                My Account
              </Link>
              <button
                onClick={() => { signOut(); onClose(); }}
                className="block w-full text-center py-3 px-4 text-[12px] tracking-[0.14em] uppercase text-[#5A554F] hover:text-[#1A1714] transition-colors"
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
                className="block w-full text-center py-3 px-4 bg-[#2C4A35] text-[#F9F7F4] text-[12px] tracking-[0.14em] uppercase transition-colors duration-300 hover:bg-[#3D6147]"
                style={{ fontFamily: "var(--font-inter)", borderRadius: "2px" }}
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={onClose}
                className="block w-full text-center py-3 px-4 border border-[#1A1714] text-[#1A1714] text-[12px] tracking-[0.14em] uppercase hover:bg-[#1A1714] hover:text-[#F9F7F4] transition-colors duration-300"
                style={{ fontFamily: "var(--font-inter)", borderRadius: "2px" }}
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
