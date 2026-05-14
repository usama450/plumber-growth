"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { ShoppingBag, Heart, User, Search, Menu, ChevronDown } from "lucide-react";
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
  const pathname = usePathname();
  const isHeroPage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-[#F7F3EE]/96 backdrop-blur-lg shadow-[0_1px_0_rgba(26,20,16,0.08)]"
            : "bg-transparent"
        }`}
      >
        {/* Announcement bar */}
        <div
          className={`text-center py-2 text-[11px] tracking-[0.2em] uppercase transition-all duration-500 ${
            isScrolled ? "bg-[#1A1410] text-[#F7F3EE]" : "bg-[#1A1410]/60 backdrop-blur-sm text-[#F7F3EE]/80"
          }`}
          style={{ fontFamily: "var(--font-dm)" }}
        >
          Free shipping on orders over $125 across Canada
        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex flex-col leading-none group">
              <span
                className={`text-2xl font-light tracking-wide transition-colors duration-300 ${
                  isScrolled ? "text-[#1A1410]" : "text-[#F7F3EE]"
                }`}
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                Khwab
              </span>
              <span
                className={`text-[9px] tracking-[0.3em] uppercase transition-colors duration-300 ${
                  isScrolled ? "text-[#C4992E]" : "text-[#C4992E]/80"
                }`}
                style={{ fontFamily: "var(--font-dm)" }}
              >
                Home Textiles
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-0.5" aria-label="Main navigation">
              {navLinks.map((link) => (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => link.sub && setActiveDropdown(link.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={link.href}
                    className={`flex items-center gap-1 px-3.5 py-2 text-[13px] tracking-wide transition-colors duration-200 ${
                      isScrolled
                        ? "text-[#1A1410]/70 hover:text-[#1A1410]"
                        : "text-[#F7F3EE]/70 hover:text-[#F7F3EE]"
                    }`}
                    style={{ fontFamily: "var(--font-dm)", fontWeight: 400 }}
                  >
                    {link.label}
                    {link.sub && (
                      <ChevronDown
                        size={12}
                        className={`transition-transform duration-200 ${activeDropdown === link.label ? "rotate-180" : ""}`}
                      />
                    )}
                  </Link>

                  {link.sub && activeDropdown === link.label && (
                    <div className="absolute top-full left-0 mt-0 w-52 bg-[#F7F3EE] shadow-[0_8px_40px_rgba(26,20,16,0.12)] border-t-2 border-[#C4992E] py-3 animate-in fade-in slide-in-from-top-1 duration-150">
                      {link.sub.map((sub) => (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          className="block px-5 py-2.5 text-[13px] text-[#1A1410]/60 hover:text-[#1A1410] hover:bg-[#EDE8DF]/50 transition-colors"
                          style={{ fontFamily: "var(--font-dm)" }}
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
            <div className="flex items-center gap-0.5">
              {[
                { icon: <Search size={18} />, onClick: () => setIsSearchOpen(true), label: "Search" },
                { icon: <User size={18} />, href: session ? "/account" : "/login", label: "Account" },
                { icon: <Heart size={18} />, href: session ? "/account/wishlist" : "/login", label: "Wishlist" },
              ].map((item) =>
                item.href ? (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`p-2.5 rounded-full transition-colors duration-200 ${
                      isScrolled ? "text-[#1A1410]/60 hover:text-[#1A1410] hover:bg-[#EDE8DF]" : "text-[#F7F3EE]/60 hover:text-[#F7F3EE] hover:bg-white/10"
                    }`}
                    aria-label={item.label}
                  >
                    {item.icon}
                  </Link>
                ) : (
                  <button
                    key={item.label}
                    onClick={item.onClick}
                    className={`p-2.5 rounded-full transition-colors duration-200 ${
                      isScrolled ? "text-[#1A1410]/60 hover:text-[#1A1410] hover:bg-[#EDE8DF]" : "text-[#F7F3EE]/60 hover:text-[#F7F3EE] hover:bg-white/10"
                    }`}
                    aria-label={item.label}
                  >
                    {item.icon}
                  </button>
                )
              )}

              {/* Cart */}
              <button
                onClick={openCart}
                className={`relative p-2.5 rounded-full transition-colors duration-200 ${
                  isScrolled ? "text-[#1A1410]/60 hover:text-[#1A1410] hover:bg-[#EDE8DF]" : "text-[#F7F3EE]/60 hover:text-[#F7F3EE] hover:bg-white/10"
                }`}
                aria-label={`Cart (${itemCount})`}
              >
                <ShoppingBag size={18} />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-[#C4992E] text-white text-[9px] font-medium rounded-full flex items-center justify-center px-1 leading-none">
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                )}
              </button>

              {/* Mobile */}
              <button
                onClick={() => setIsMobileOpen(true)}
                className={`lg:hidden p-2.5 rounded-full ml-1 transition-colors ${
                  isScrolled ? "text-[#1A1410]/60 hover:text-[#1A1410]" : "text-[#F7F3EE]/60 hover:text-[#F7F3EE]"
                }`}
                aria-label="Open menu"
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer for non-hero pages (hero is full-screen so needs none) */}
      {!isHeroPage && <div className="h-[100px]" aria-hidden="true" />}

      <MobileMenu isOpen={isMobileOpen} onClose={() => setIsMobileOpen(false)} />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
