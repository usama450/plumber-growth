"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { ShoppingBag, Search, Menu, ChevronDown, User, X } from "lucide-react";
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

const heroPages = ["/"];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const { data: session } = useSession();
  const { getItemCount, openCart } = useCartStore();
  const itemCount = getItemCount();
  const pathname = usePathname();
  const isHeroPage = heroPages.includes(pathname);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Close user menu on outside click */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const transparent = isHeroPage && !isScrolled;

  const iconColor = transparent
    ? "text-white/70 hover:text-white"
    : "text-[#1A1714]/60 hover:text-[#1A1714]";

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-[0_1px_0_#E2DDD7]"
            : "bg-transparent"
        }`}
      >
        {/* Announcement bar */}
        <div
          className="text-center py-2 text-[11px] tracking-[0.2em] uppercase bg-[#1A2B20] text-[#F9F7F4]/70"
          style={{ fontFamily: "var(--font-inter)", fontWeight: 400 }}
        >
          Free shipping on orders over $125 across Canada
        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" className="flex flex-col leading-none group shrink-0">
              <span
                className={`text-2xl tracking-wide transition-colors duration-300 ${
                  transparent ? "text-white" : "text-[#2C4A35]"
                }`}
                style={{ fontFamily: "var(--font-playfair)", fontWeight: 700 }}
              >
                Khwab
              </span>
              <span
                className="text-[9px] tracking-[0.25em] uppercase text-[#A67C3C]"
                style={{ fontFamily: "var(--font-inter)", fontWeight: 500 }}
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
                      transparent
                        ? "text-white/70 hover:text-white"
                        : "text-[#1A1714]/70 hover:text-[#1A1714]"
                    }`}
                    style={{ fontFamily: "var(--font-inter)", fontWeight: 400 }}
                  >
                    {link.label}
                    {link.sub && (
                      <ChevronDown
                        size={12}
                        className={`transition-transform duration-200 ${
                          activeDropdown === link.label ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </Link>

                  {link.sub && activeDropdown === link.label && (
                    <div
                      className="absolute top-full left-0 mt-0 w-52 bg-white border border-[#E2DDD7] shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-none py-3"
                      style={{ animation: "floatDown 0.18s ease forwards" }}
                    >
                      {link.sub.map((sub) => (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          className="block px-5 py-2.5 text-[13px] text-[#5A554F] hover:text-[#1A1714] hover:bg-[#F4F0EB] transition-colors"
                          style={{ fontFamily: "var(--font-inter)" }}
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
              {/* Search */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className={`p-2.5 transition-colors duration-200 ${iconColor}`}
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              {/* User menu */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen((v) => !v)}
                  className={`p-2.5 transition-colors duration-200 ${iconColor}`}
                  aria-label="Account"
                  aria-expanded={isUserMenuOpen}
                  aria-haspopup="menu"
                >
                  <User size={20} />
                </button>

                {isUserMenuOpen && (
                  <div
                    className="absolute top-full right-0 mt-2 w-48 bg-white border border-[#E2DDD7] shadow-[0_8px_24px_rgba(0,0,0,0.08)] rounded-none py-2 z-50"
                    role="menu"
                    style={{ animation: "floatDown 0.18s ease forwards" }}
                  >
                    {session ? (
                      <>
                        <Link
                          href="/account"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="block px-4 py-2.5 text-[13px] text-[#5A554F] hover:text-[#1A1714] hover:bg-[#F4F0EB] transition-colors"
                          style={{ fontFamily: "var(--font-inter)" }}
                          role="menuitem"
                        >
                          My Account
                        </Link>
                        <button
                          onClick={() => { signOut(); setIsUserMenuOpen(false); }}
                          className="block w-full text-left px-4 py-2.5 text-[13px] text-[#5A554F] hover:text-[#1A1714] hover:bg-[#F4F0EB] transition-colors"
                          style={{ fontFamily: "var(--font-inter)" }}
                          role="menuitem"
                        >
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/login"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="block px-4 py-2.5 text-[13px] text-[#5A554F] hover:text-[#1A1714] hover:bg-[#F4F0EB] transition-colors"
                          style={{ fontFamily: "var(--font-inter)" }}
                          role="menuitem"
                        >
                          Sign In
                        </Link>
                        <Link
                          href="/register"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="block px-4 py-2.5 text-[13px] text-[#5A554F] hover:text-[#1A1714] hover:bg-[#F4F0EB] transition-colors"
                          style={{ fontFamily: "var(--font-inter)" }}
                          role="menuitem"
                        >
                          Create Account
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Cart */}
              <button
                onClick={openCart}
                className={`relative p-2.5 transition-colors duration-200 ${iconColor}`}
                aria-label={`Cart (${itemCount} items)`}
              >
                <ShoppingBag size={20} />
                {itemCount > 0 && (
                  <span
                    className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-[#2C4A35] text-white text-[9px] font-medium rounded-full flex items-center justify-center px-1 leading-none"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                )}
              </button>

              {/* Hamburger (mobile only) */}
              <button
                onClick={() => setIsMobileOpen(true)}
                className={`lg:hidden p-2.5 ml-1 transition-colors ${iconColor}`}
                aria-label="Open menu"
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer for non-hero pages */}
      {!isHeroPage && <div className="h-[90px]" aria-hidden="true" />}

      <MobileMenu isOpen={isMobileOpen} onClose={() => setIsMobileOpen(false)} />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
