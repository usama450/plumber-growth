"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2 } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface Variant {
  size: string;
  color: string;
  sku: string;
  stockQuantity: string;
}

interface Props {
  categories: Category[];
}

export function AdminProductForm({ categories }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [images, setImages] = useState<{ url: string; alt: string }[]>([{ url: "", alt: "" }]);
  const [variants, setVariants] = useState<Variant[]>([{ size: "", color: "", sku: "", stockQuantity: "0" }]);
  const [form, setForm] = useState({
    name: "", slug: "", description: "", price: "", comparePrice: "",
    categoryId: categories[0]?.id ?? "", material: "", careInstructions: "",
    threadCount: "", isActive: true, isFeatured: false, isOnSale: false,
  });

  const slugify = (text: string) =>
    text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: parseFloat(form.price),
        comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : null,
        threadCount: form.threadCount ? parseInt(form.threadCount) : null,
        images: images.filter((i) => i.url.trim()),
        variants: variants.filter((v) => v.sku.trim()).map((v) => ({
          ...v, stockQuantity: parseInt(v.stockQuantity) || 0,
        })),
      }),
    });

    if (res.ok) {
      router.push("/admin/products");
    } else {
      const d = await res.json();
      setError(d.error ?? "Failed to create product");
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-[#B85450]/10 border border-[#B85450]/20 rounded-xl text-sm text-[#B85450] font-inter font-light">
          {error}
        </div>
      )}

      {/* Basic Info */}
      <div className="bg-white rounded-2xl p-6 border border-[#E8DFF5]/60 space-y-4">
        <h2 className="font-playfair font-semibold text-[#4A2C5A] text-xl"
          style={{ fontFamily: "var(--font-playfair)" }}>Basic Info</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-inter font-light text-[#2A2A2A] mb-1.5">Product Name *</label>
            <input required value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value, slug: slugify(e.target.value) })}
              className="w-full px-4 py-3 rounded-xl border border-[#D4C5B0] bg-[#FAF7F2] text-sm font-inter font-light focus:outline-none focus:ring-2 focus:ring-[#B8A4D4] transition-all" />
          </div>
          <div>
            <label className="block text-sm font-inter font-light text-[#2A2A2A] mb-1.5">Slug *</label>
            <input required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-[#D4C5B0] bg-[#FAF7F2] text-sm font-inter font-light focus:outline-none focus:ring-2 focus:ring-[#B8A4D4] transition-all" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-inter font-light text-[#2A2A2A] mb-1.5">Description *</label>
            <textarea required rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-[#D4C5B0] bg-[#FAF7F2] text-sm font-inter font-light focus:outline-none focus:ring-2 focus:ring-[#B8A4D4] transition-all resize-none" />
          </div>
          <div>
            <label className="block text-sm font-inter font-light text-[#2A2A2A] mb-1.5">Category *</label>
            <select required value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-[#D4C5B0] bg-[#FAF7F2] text-sm font-inter font-light focus:outline-none focus:ring-2 focus:ring-[#B8A4D4] transition-all">
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-inter font-light text-[#2A2A2A] mb-1.5">Thread Count</label>
            <input type="number" value={form.threadCount} onChange={(e) => setForm({ ...form, threadCount: e.target.value })}
              placeholder="e.g. 400"
              className="w-full px-4 py-3 rounded-xl border border-[#D4C5B0] bg-[#FAF7F2] text-sm font-inter font-light focus:outline-none focus:ring-2 focus:ring-[#B8A4D4] transition-all" />
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-white rounded-2xl p-6 border border-[#E8DFF5]/60 space-y-4">
        <h2 className="font-playfair font-semibold text-[#4A2C5A] text-xl"
          style={{ fontFamily: "var(--font-playfair)" }}>Pricing</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-inter font-light text-[#2A2A2A] mb-1.5">Price (CAD) *</label>
            <input required type="number" step="0.01" min="0.01" value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-[#D4C5B0] bg-[#FAF7F2] text-sm font-inter font-light focus:outline-none focus:ring-2 focus:ring-[#B8A4D4] transition-all" />
          </div>
          <div>
            <label className="block text-sm font-inter font-light text-[#2A2A2A] mb-1.5">Compare Price</label>
            <input type="number" step="0.01" min="0" value={form.comparePrice}
              onChange={(e) => setForm({ ...form, comparePrice: e.target.value })}
              placeholder="Original price"
              className="w-full px-4 py-3 rounded-xl border border-[#D4C5B0] bg-[#FAF7F2] text-sm font-inter font-light focus:outline-none focus:ring-2 focus:ring-[#B8A4D4] transition-all" />
          </div>
          <div className="flex flex-col gap-3 pt-2">
            {[
              { key: "isActive", label: "Active" },
              { key: "isFeatured", label: "Featured" },
              { key: "isOnSale", label: "On Sale" },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form[key as keyof typeof form] as boolean}
                  onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
                  className="rounded border-[#D4C5B0] text-[#4A2C5A]" />
                <span className="text-sm font-inter font-light text-[#2A2A2A]">{label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Material & Care */}
      <div className="bg-white rounded-2xl p-6 border border-[#E8DFF5]/60 space-y-4">
        <h2 className="font-playfair font-semibold text-[#4A2C5A] text-xl"
          style={{ fontFamily: "var(--font-playfair)" }}>Material & Care</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-inter font-light text-[#2A2A2A] mb-1.5">Material</label>
            <input value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })}
              placeholder="e.g. 100% Egyptian Cotton"
              className="w-full px-4 py-3 rounded-xl border border-[#D4C5B0] bg-[#FAF7F2] text-sm font-inter font-light focus:outline-none focus:ring-2 focus:ring-[#B8A4D4] transition-all" />
          </div>
          <div>
            <label className="block text-sm font-inter font-light text-[#2A2A2A] mb-1.5">Care Instructions</label>
            <input value={form.careInstructions} onChange={(e) => setForm({ ...form, careInstructions: e.target.value })}
              placeholder="e.g. Machine wash warm"
              className="w-full px-4 py-3 rounded-xl border border-[#D4C5B0] bg-[#FAF7F2] text-sm font-inter font-light focus:outline-none focus:ring-2 focus:ring-[#B8A4D4] transition-all" />
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="bg-white rounded-2xl p-6 border border-[#E8DFF5]/60 space-y-4">
        <h2 className="font-playfair font-semibold text-[#4A2C5A] text-xl"
          style={{ fontFamily: "var(--font-playfair)" }}>Images</h2>
        {images.map((img, i) => (
          <div key={i} className="flex gap-3">
            <input value={img.url} onChange={(e) => setImages(images.map((x, j) => j === i ? { ...x, url: e.target.value } : x))}
              placeholder="Image URL (Cloudinary or Unsplash)"
              className="flex-1 px-4 py-3 rounded-xl border border-[#D4C5B0] bg-[#FAF7F2] text-sm font-inter font-light focus:outline-none focus:ring-2 focus:ring-[#B8A4D4] transition-all" />
            <input value={img.alt} onChange={(e) => setImages(images.map((x, j) => j === i ? { ...x, alt: e.target.value } : x))}
              placeholder="Alt text"
              className="w-40 px-4 py-3 rounded-xl border border-[#D4C5B0] bg-[#FAF7F2] text-sm font-inter font-light focus:outline-none focus:ring-2 focus:ring-[#B8A4D4] transition-all" />
            {images.length > 1 && (
              <button type="button" onClick={() => setImages(images.filter((_, j) => j !== i))}
                className="text-[#B85450]/60 hover:text-[#B85450] transition-colors">
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={() => setImages([...images, { url: "", alt: "" }])}
          className="flex items-center gap-2 text-sm font-inter font-light text-[#4A2C5A] hover:underline">
          <Plus size={14} /> Add Image
        </button>
      </div>

      {/* Variants */}
      <div className="bg-white rounded-2xl p-6 border border-[#E8DFF5]/60 space-y-4">
        <h2 className="font-playfair font-semibold text-[#4A2C5A] text-xl"
          style={{ fontFamily: "var(--font-playfair)" }}>Variants</h2>
        {variants.map((variant, i) => (
          <div key={i} className="grid grid-cols-4 gap-3">
            {[
              { key: "size", placeholder: "Queen" },
              { key: "color", placeholder: "White" },
              { key: "sku", placeholder: "SKU-001" },
              { key: "stockQuantity", placeholder: "10", type: "number" },
            ].map(({ key, placeholder, type }) => (
              <input key={key} type={type ?? "text"} value={variant[key as keyof Variant]}
                onChange={(e) => setVariants(variants.map((v, j) => j === i ? { ...v, [key]: e.target.value } : v))}
                placeholder={placeholder}
                className="px-3 py-2.5 rounded-xl border border-[#D4C5B0] bg-[#FAF7F2] text-sm font-inter font-light focus:outline-none focus:ring-2 focus:ring-[#B8A4D4] transition-all" />
            ))}
          </div>
        ))}
        <div className="flex gap-3">
          <button type="button" onClick={() => setVariants([...variants, { size: "", color: "", sku: "", stockQuantity: "0" }])}
            className="flex items-center gap-2 text-sm font-inter font-light text-[#4A2C5A] hover:underline">
            <Plus size={14} /> Add Variant
          </button>
          {variants.length > 1 && (
            <button type="button" onClick={() => setVariants(variants.slice(0, -1))}
              className="text-sm font-inter font-light text-[#B85450] hover:underline">
              Remove Last
            </button>
          )}
        </div>
        <p className="text-xs font-inter font-light text-[#8B8B8B]">
          Columns: Size · Color · SKU · Stock Quantity
        </p>
      </div>

      <div className="flex gap-3 pb-8">
        <button type="submit" disabled={saving}
          className="px-8 py-3 bg-[#4A2C5A] text-white font-inter font-normal text-sm rounded-xl hover:bg-[#5B3A6B] transition-colors disabled:opacity-70 flex items-center gap-2">
          {saving && <Loader2 size={16} className="animate-spin" />}
          Create Product
        </button>
        <button type="button" onClick={() => router.back()}
          className="px-8 py-3 border border-[#D4C5B0] text-[#2A2A2A] font-inter font-light text-sm rounded-xl hover:bg-[#FAF7F2] transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}
