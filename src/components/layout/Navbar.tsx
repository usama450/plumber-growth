"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { useCartStore } from "@/store/cart";
import { MobileMenu } from "./MobileMenu";
import { SearchModal } from "./SearchModal";

const navLinks = [
  { label: "Shop All", href: "/shop" },
  {
    label: "Bedsheets",
    href: "/shop/bedsheets",
    sub: [
      { label: "Cotton Sheets", href: "/shop/bedsheets?material=cotton" },
      { label: "Percale Weave", href: "/shop/bedsheets?weave=percale" },
      { label: "Sateen Weave", href: "/shop/bedsheets?weave=sateen" },
      { label: "Shop All Bedsheets", href: "/shop/bedsheets" },
    ],
  },
  {
    label: "Comforters",
    href: "/shop/comforters",
    sub: [
      { label: "Duvet Sets", href: "/shop/comforters?type=duvet" },
      { label: "Comforter Sets", href: "/shop/comforters?type=comforter" },
      { label: "Shop All Comforters", href: "/shop/comforters" },
    ],
  },
  { label: "Towels", href: "/shop/towels" },
  { label: "Gift Bundles", href: "/shop/gift-bundles" },
  { label: "About", href: "/about" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { data: session } = useSession();
  const { getItemCount, openCart } = useCartStore();
  const itemCount = getItemCount();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#FAF7F2]/95 backdrop-blur-md shadow-[0_2px_20px_rgba(74,44,90,0.08)]"
            : "bg-[#FAF7F2]/80 backdrop-blur-sm"
        }`}
      >
        {/* Announcement bar */}
        <div className="bg-[#4A2C5A] text-white text-center py-2 text-sm font-inter tracking-wide">
          Free shipping on orders over $125 across Canada 🍁
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex flex-col leading-none">
                <span
                  className="font-playfair text-2xl font-semibold text-[#4A2C5A] tracking-wide group-hover:text-[#5B3A6B] transition-colors"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Khwab
                </span>
                <span className="text-[10px] text-[#C9A961] tracking-[0.2em] uppercase font-inter font-light">
                  Home Textiles
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1" role="navigation" aria-label="Main navigation">
              {navLinks.map((link) => (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => link.sub && setActiveDropdown(link.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={link.href}
                    className="flex items-center gap-1 px-3 py-2 text-sm font-inter font-light text-[#2A2A2A] hover:text-[#4A2C5A] transition-colors rounded-md hover:bg-[#E8DFF5]/50"
                  >
                    {link.label}
                    {link.sub && <ChevronDown size={14} className={`transition-transform ${activeDropdown === link.label ? "rotate-180" : ""}`} />}
                  </Link>

                  {link.sub && activeDropdown === link.label && (
                    <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-[0_8px_32px_rgba(74,44,90,0.12)] border border-[#E8DFF5] py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                      {link.sub.map((sub) => (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          className="block px-4 py-2 text-sm text-[#2A2A2A] hover:text-[#4A2C5A] hover:bg-[#E8DFF5]/50 transition-colors font-inter font-light"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Right Icons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-[#2A2A2A] hover:text-[#4A2C5A] hover:bg-[#E8DFF5]/50 rounded-full transition-colors"
                aria-label="Search products"
              >
                <Search size={20} />
              </button>

              <Link
                href={session ? "/account" : "/login"}
                className="p-2 text-[#2A2A2A] hover:text-[#4A2C5A] hover:bg-[#E8DFF5]/50 rounded-full transition-colors"
                aria-label="Account"
              >
                <User size={20} />
              </Link>

              <Link
                href={session ? "/account/wishlist" : "/login"}
                className="p-2 text-[#2A2A2A] hover:text-[#4A2C5A] hover:bg-[#E8DFF5]/50 rounded-full transition-colors"
                aria-label="Wishlist"
              >
                <Heart size={20} />
              </Link>

              <button
                onClick={openCart}
                className="relative p-2 text-[#2A2A2A] hover:text-[#4A2C5A] hover:bg-[#E8DFF5]/50 rounded-full transition-colors"
                aria-label={`Cart with ${itemCount} items`}
              >
                <ShoppingBag size={20} />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 min-w-[18px] min-h-[18px] bg-[#4A2C5A] text-white text-[10px] font-medium rounded-full flex items-center justify-center leading-none px-1">
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                )}
              </button>

              {/* Mobile hamburger */}
              <button
                onClick={() => setIsMobileOpen(true)}
                className="lg:hidden p-2 text-[#2A2A2A] hover:text-[#4A2C5A] rounded-full transition-colors ml-1"
                aria-label="Open menu"
                aria-expanded={isMobileOpen}
              >
                <Menu size={22} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer for fixed navbar + announcement bar */}
      <div className="h-[104px]" />

      <MobileMenu isOpen={isMobileOpen} onClose={() => setIsMobileOpen(false)} />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
