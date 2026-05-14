"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import { X } from "lucide-react";

const CATEGORIES = [
  { label: "Bedsheets", value: "bedsheets" },
  { label: "Comforter Sets", value: "comforters" },
  { label: "Bath Towels", value: "towels" },
  { label: "Gift Bundles", value: "gift-bundles" },
];

const COLORS = [
  { label: "White", value: "white", hex: "#FFFFFF" },
  { label: "Ivory", value: "ivory", hex: "#FFFFF0" },
  { label: "Lavender", value: "lavender", hex: "#F7F3EE" },
  { label: "Plum", value: "plum", hex: "#1A1410" },
  { label: "Navy", value: "navy", hex: "#1a237e" },
  { label: "Sage", value: "sage", hex: "#6B8E4E" },
  { label: "Blush", value: "blush", hex: "#F4A7B9" },
  { label: "Charcoal", value: "charcoal", hex: "#2A2A2A" },
];

const SIZES = ["Twin", "Full", "Queen", "King", "Cal King"];

interface FilterSidebarProps {
  onClose?: () => void;
}

export function FilterSidebar({ onClose }: FilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParam = useCallback(
    (key: string, value: string, toggle = false) => {
      const params = new URLSearchParams(searchParams.toString());
      if (toggle) {
        const current = params.getAll(key);
        if (current.includes(value)) {
          params.delete(key);
          current.filter((v) => v !== value).forEach((v) => params.append(key, v));
        } else {
          params.append(key, value);
        }
      } else {
        params.set(key, value);
      }
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const clearAll = () => router.push(pathname);

  const selectedCategories = searchParams.getAll("category");
  const selectedColors = searchParams.getAll("color");
  const selectedSizes = searchParams.getAll("size");
  const minPrice = searchParams.get("minPrice") ?? "0";
  const maxPrice = searchParams.get("maxPrice") ?? "500";
  const hasFilters = selectedCategories.length > 0 || selectedColors.length > 0 || selectedSizes.length > 0 || minPrice !== "0" || maxPrice !== "500";

  return (
    <aside className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-inter font-normal text-sm text-[#E7D3A8] uppercase tracking-wider">
          Filters
        </h2>
        <div className="flex items-center gap-2">
          {hasFilters && (
            <button
              onClick={clearAll}
              className="text-xs font-inter font-light text-[#A8A4B0] hover:text-[#9D4EDD] transition-colors"
            >
              Clear all
            </button>
          )}
          {onClose && (
            <button onClick={onClose} className="lg:hidden text-[#A8A4B0] hover:text-[#F8F4EE]">
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-7">
        {/* Category */}
        <div>
          <h3 className="text-xs font-inter font-medium text-[#E7D3A8] uppercase tracking-[0.12em] mb-3">
            Category
          </h3>
          <div className="space-y-2">
            {CATEGORIES.map((cat) => (
              <label key={cat.value} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat.value)}
                  onChange={() => updateParam("category", cat.value, true)}
                  className="w-4 h-4 rounded border-[#3A1A5C] accent-[#9D4EDD] cursor-pointer"
                />
                <span className="text-sm font-inter font-light text-[#A8A4B0] group-hover:text-[#F8F4EE] transition-colors">
                  {cat.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <h3 className="text-xs font-inter font-medium text-[#E7D3A8] uppercase tracking-[0.12em] mb-3">
            Price Range
          </h3>
          <div className="space-y-2">
            <input
              type="range"
              min={0}
              max={500}
              step={10}
              value={parseInt(maxPrice)}
              onChange={(e) => updateParam("maxPrice", e.target.value)}
              className="w-full accent-[#9D4EDD]"
            />
            <div className="flex justify-between text-xs font-inter font-light text-[#A8A4B0]">
              <span>$0</span>
              <span className="text-[#E7D3A8] font-normal">Up to ${maxPrice}</span>
              <span>$500</span>
            </div>
          </div>
        </div>

        {/* Color */}
        <div>
          <h3 className="text-xs font-inter font-medium text-[#E7D3A8] uppercase tracking-[0.12em] mb-3">
            Color
          </h3>
          <div className="flex flex-wrap gap-2">
            {COLORS.map((color) => (
              <button
                key={color.value}
                onClick={() => updateParam("color", color.value, true)}
                title={color.label}
                className={`w-7 h-7 rounded-full border-2 transition-all ${
                  selectedColors.includes(color.value)
                    ? "border-[#9D4EDD] scale-110 shadow-[0_0_8px_rgba(157,78,221,0.6)]"
                    : "border-[#3A1A5C] hover:border-[#9D4EDD]"
                }`}
                style={{ backgroundColor: color.hex }}
                aria-label={color.label}
                aria-pressed={selectedColors.includes(color.value)}
              />
            ))}
          </div>
        </div>

        {/* Size */}
        <div>
          <h3 className="text-xs font-inter font-medium text-[#E7D3A8] uppercase tracking-[0.12em] mb-3">
            Size
          </h3>
          <div className="flex flex-wrap gap-2">
            {SIZES.map((size) => (
              <button
                key={size}
                onClick={() => updateParam("size", size, true)}
                className={`px-3 py-1.5 rounded-lg text-xs font-inter font-light border transition-all ${
                  selectedSizes.includes(size)
                    ? "bg-[#9D4EDD] text-[#F8F4EE] border-[#9D4EDD] shadow-[0_0_10px_rgba(157,78,221,0.4)]"
                    : "bg-[#0D0415] text-[#A8A4B0] border-[#3A1A5C] hover:border-[#9D4EDD] hover:text-[#F8F4EE]"
                }`}
                aria-pressed={selectedSizes.includes(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* On Sale */}
        <div>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={searchParams.get("sale") === "true"}
              onChange={() => {
                const params = new URLSearchParams(searchParams.toString());
                if (params.get("sale") === "true") params.delete("sale");
                else params.set("sale", "true");
                router.push(`${pathname}?${params.toString()}`);
              }}
              className="w-4 h-4 rounded border-[#3A1A5C] accent-[#9D4EDD] cursor-pointer"
            />
            <span className="text-sm font-inter font-light text-[#A8A4B0] hover:text-[#F8F4EE] transition-colors">On Sale</span>
          </label>
        </div>
      </div>
    </aside>
  );
}
