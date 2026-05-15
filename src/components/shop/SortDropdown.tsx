"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Best Selling", value: "best_selling" },
  { label: "Featured", value: "featured" },
];

export function SortDropdown() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get("sort") ?? "newest";

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="relative inline-flex items-center">
      <select
        value={current}
        onChange={(e) => handleChange(e.target.value)}
        className="appearance-none pl-4 pr-8 py-2 bg-white border border-[#E2DDD7] text-sm font-inter font-light text-[#1A1714] focus:outline-none focus:border-[#2C4A35] hover:border-[#B5AFA8] cursor-pointer transition-colors"
        aria-label="Sort products"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7A746D] pointer-events-none" />
    </div>
  );
}
