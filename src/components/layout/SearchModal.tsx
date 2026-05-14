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
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative max-w-2xl mx-auto mt-16 mx-4 sm:mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Search input */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-[#E8DFF5]">
            <Search size={20} className="text-[#8B8B8B] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for bedsheets, towels, comforters..."
              className="flex-1 text-[15px] font-inter font-light text-[#2A2A2A] placeholder-[#8B8B8B] outline-none bg-transparent"
            />
            {isLoading && <Loader2 size={18} className="text-[#8B8B8B] animate-spin shrink-0" />}
            <button onClick={onClose} className="p-1 text-[#8B8B8B] hover:text-[#4A2C5A] transition-colors">
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
                  className="flex items-center gap-4 px-5 py-3 hover:bg-[#E8DFF5]/30 transition-colors"
                >
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#E8DFF5] shrink-0">
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
                    <p className="text-sm font-inter font-light text-[#2A2A2A] truncate">{product.name}</p>
                    <p className="text-xs text-[#8B8B8B] mt-0.5">{product.category.name}</p>
                  </div>
                  <span className="text-sm font-inter font-normal text-[#4A2C5A] shrink-0">
                    {formatPrice(product.price)}
                  </span>
                </Link>
              ))}
              <div className="px-5 pt-2 pb-3 border-t border-[#E8DFF5] mt-1">
                <Link
                  href={`/shop?q=${encodeURIComponent(query)}`}
                  onClick={onClose}
                  className="text-sm text-[#4A2C5A] hover:underline font-inter"
                >
                  View all results for &ldquo;{query}&rdquo; →
                </Link>
              </div>
            </div>
          )}

          {query.length >= 2 && !isLoading && results.length === 0 && (
            <div className="px-5 py-8 text-center text-[#8B8B8B] font-inter font-light text-sm">
              No products found for &ldquo;{query}&rdquo;
            </div>
          )}

          {!query && (
            <div className="px-5 py-6">
              <p className="text-xs text-[#8B8B8B] uppercase tracking-wider font-inter mb-3">Popular Searches</p>
              <div className="flex flex-wrap gap-2">
                {["Cotton Sheets", "Comforter Sets", "Bath Towels", "Gift Bundles", "King Size"].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-3 py-1.5 bg-[#E8DFF5] text-[#4A2C5A] rounded-full text-sm font-inter font-light hover:bg-[#B8A4D4]/40 transition-colors"
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
