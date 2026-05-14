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
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-[85vw] max-w-[360px] bg-[#FAF7F2] shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#E8DFF5]">
            <span
              className="font-playfair text-xl font-semibold text-[#4A2C5A]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Khwab
            </span>
            <button
              onClick={onClose}
              className="p-2 text-[#2A2A2A] hover:text-[#4A2C5A] hover:bg-[#E8DFF5]/50 rounded-full transition-colors"
              aria-label="Close menu"
            >
              <X size={22} />
            </button>
          </div>

          {/* Navigation links */}
          <nav className="flex-1 overflow-y-auto py-4">
            {menuLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className="flex items-center justify-between px-6 py-3.5 text-[#2A2A2A] hover:text-[#4A2C5A] hover:bg-[#E8DFF5]/40 transition-colors font-inter font-light text-[15px]"
              >
                {link.label}
                <ChevronRight size={16} className="text-[#8B8B8B]" />
              </Link>
            ))}
          </nav>

          {/* Account section */}
          <div className="border-t border-[#E8DFF5] p-6 space-y-3">
            {session ? (
              <>
                <Link
                  href="/account"
                  onClick={onClose}
                  className="block w-full text-center py-2.5 px-4 rounded-lg border border-[#4A2C5A] text-[#4A2C5A] font-inter font-light text-sm hover:bg-[#E8DFF5]/50 transition-colors"
                >
                  My Account
                </Link>
                <button
                  onClick={() => { signOut(); onClose(); }}
                  className="block w-full text-center py-2.5 px-4 rounded-lg text-[#8B8B8B] font-inter font-light text-sm hover:text-[#4A2C5A] transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={onClose}
                  className="block w-full text-center py-2.5 px-4 rounded-lg bg-[#4A2C5A] text-white font-inter font-normal text-sm hover:bg-[#5B3A6B] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={onClose}
                  className="block w-full text-center py-2.5 px-4 rounded-lg border border-[#4A2C5A] text-[#4A2C5A] font-inter font-light text-sm hover:bg-[#E8DFF5]/50 transition-colors"
                >
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
