"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Search, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { ProductCardData } from "@/types";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductCardData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setQuery("");
      setResults([]);
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim() || query.length < 2) {
      setResults([]);
      return;
    }
    setIsLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products?q=${encodeURIComponent(query)}&limit=6`);
        const data = await res.json();
        setResults(data.data ?? []);
      } catch {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 350);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Search">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#1A1714]/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative max-w-2xl mx-auto mt-16 px-4 sm:px-0">
        <div className="bg-white rounded-none shadow-[0_8px_40px_rgba(26,23,20,0.12)] overflow-hidden">
          {/* Search input */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-[#E2DDD7]">
            <Search size={20} className="text-[#B5AFA8] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for bedsheets, towels, comforters..."
              className="flex-1 text-[15px] text-[#1A1714] placeholder-[#B5AFA8] outline-none bg-transparent"
              style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
            />
            {isLoading && <Loader2 size={18} className="text-[#B5AFA8] animate-spin shrink-0" />}
            <button onClick={onClose} className="p-1 text-[#5A554F] hover:text-[#1A1714] transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Results */}
          {results.length > 0 && (
            <div className="py-3 max-h-[60vh] overflow-y-auto">
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-4 px-5 py-3 hover:bg-[#F4F0EB] transition-colors"
                >
                  <div className="w-14 h-14 overflow-hidden bg-[#F4F0EB] shrink-0">
                    {product.images[0] && (
                      <Image
                        src={product.images[0].imageUrl}
                        alt={product.images[0].altText ?? product.name}
                        width={56}
                        height={56}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm truncate text-[#1A1714]"
                      style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
                    >
                      {product.name}
                    </p>
                    <p
                      className="text-xs text-[#7A746D] mt-0.5"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {product.category.name}
                    </p>
                  </div>
                  <span
                    className="text-sm text-[#1A1714] shrink-0"
                    style={{ fontFamily: "var(--font-inter)", fontWeight: 400 }}
                  >
                    {formatPrice(product.price)}
                  </span>
                </Link>
              ))}
              <div className="px-5 pt-2 pb-3 border-t border-[#E2DDD7] mt-1">
                <Link
                  href={`/shop?q=${encodeURIComponent(query)}`}
                  onClick={onClose}
                  className="text-sm text-[#2C4A35] hover:text-[#1A2B20] hover:underline"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  View all results for &ldquo;{query}&rdquo; &rarr;
                </Link>
              </div>
            </div>
          )}

          {query.length >= 2 && !isLoading && results.length === 0 && (
            <div
              className="px-5 py-8 text-center text-[#7A746D] text-sm"
              style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
            >
              No products found for &ldquo;{query}&rdquo;
            </div>
          )}

          {!query && (
            <div className="px-5 py-6">
              <p
                className="text-[11px] text-[#B5AFA8] uppercase tracking-[0.2em] mb-3"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Popular Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {["Cotton Sheets", "Comforter Sets", "Bath Towels", "Gift Bundles", "King Size"].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-3 py-1.5 bg-[#F4F0EB] text-[#5A554F] text-sm hover:bg-[#E2DDD7] hover:text-[#1A1714] transition-colors"
                    style={{ fontFamily: "var(--font-inter)", fontWeight: 300, borderRadius: "2px" }}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
