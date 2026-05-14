"use client";

import { useState } from "react";
import { Loader2, Plus, Trash2, ToggleLeft, ToggleRight } from "lucide-react";

interface Coupon {
  id: string;
  code: string;
  description: string | null;
  discountType: string;
  discountValue: number;
  minimumPurchase: number | null;
  usageLimit: number | null;
  usageCount: number;
  isActive: boolean;
  expiresAt: string | null;
}

interface Props {
  initialCoupons: Coupon[];
}

const emptyForm = {
  code: "", description: "", discountType: "PERCENTAGE", discountValue: "",
  minimumPurchase: "", usageLimit: "", expiresAt: "",
};

export function AdminCouponsClient({ initialCoupons }: Props) {
  const [coupons, setCoupons] = useState(initialCoupons);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: form.code.toUpperCase(),
        description: form.description || null,
        discountType: form.discountType,
        discountValue: parseFloat(form.discountValue),
        minimumPurchase: form.minimumPurchase ? parseFloat(form.minimumPurchase) : null,
        usageLimit: form.usageLimit ? parseInt(form.usageLimit) : null,
        expiresAt: form.expiresAt || null,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      setCoupons((prev) => [{ ...data.coupon, ordersCount: 0 }, ...prev]);
      setShowForm(false);
      setForm(emptyForm);
    } else {
      const d = await res.json();
      setError(d.error ?? "Failed to create coupon");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    setDeleting(null);
  };

  const handleToggle = async (id: string, isActive: boolean) => {
    setToggling(id);
    const res = await fetch(`/api/admin/coupons/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    if (res.ok) {
      setCoupons((prev) => prev.map((c) => c.id === id ? { ...c, isActive: !isActive } : c));
    }
    setToggling(null);
  };

  return (
    <div className="space-y-5">
      {/* Create form */}
      <button onClick={() => setShowForm(!showForm)}
        className="flex items-center gap-2 px-4 py-2 bg-[#4A2C5A] text-white text-sm font-inter font-normal rounded-lg hover:bg-[#5B3A6B] transition-colors">
        <Plus size={16} />
        New Coupon
      </button>

      {showForm && (
        <div className="bg-white rounded-2xl p-6 border border-[#E8DFF5]/60">
          <h2 className="font-playfair font-semibold text-[#4A2C5A] text-xl mb-5"
            style={{ fontFamily: "var(--font-playfair)" }}>Create Coupon</h2>
          {error && (
            <div className="mb-4 p-3 bg-[#B85450]/10 border border-[#B85450]/20 rounded-lg text-sm text-[#B85450]">{error}</div>
          )}
          <form onSubmit={handleCreate} className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-inter font-light text-[#2A2A2A] mb-1.5">Code *</label>
              <input required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                placeholder="SUMMER20"
                className="w-full px-4 py-3 rounded-xl border border-[#D4C5B0] bg-[#FAF7F2] text-sm font-inter font-light focus:outline-none focus:ring-2 focus:ring-[#B8A4D4] transition-all uppercase" />
            </div>
            <div>
              <label className="block text-sm font-inter font-light text-[#2A2A2A] mb-1.5">Discount Type *</label>
              <select required value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-[#D4C5B0] bg-[#FAF7F2] text-sm font-inter font-light focus:outline-none focus:ring-2 focus:ring-[#B8A4D4] transition-all">
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FIXED">Fixed Amount ($)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-inter font-light text-[#2A2A2A] mb-1.5">
                Discount Value * {form.discountType === "PERCENTAGE" ? "(%)" : "($)"}
              </label>
              <input required type="number" step="0.01" min="0.01" value={form.discountValue}
                onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-[#D4C5B0] bg-[#FAF7F2] text-sm font-inter font-light focus:outline-none focus:ring-2 focus:ring-[#B8A4D4] transition-all" />
            </div>
            <div>
              <label className="block text-sm font-inter font-light text-[#2A2A2A] mb-1.5">Min. Purchase ($)</label>
              <input type="number" step="0.01" min="0" value={form.minimumPurchase}
                onChange={(e) => setForm({ ...form, minimumPurchase: e.target.value })}
                placeholder="0"
                className="w-full px-4 py-3 rounded-xl border border-[#D4C5B0] bg-[#FAF7F2] text-sm font-inter font-light focus:outline-none focus:ring-2 focus:ring-[#B8A4D4] transition-all" />
            </div>
            <div>
              <label className="block text-sm font-inter font-light text-[#2A2A2A] mb-1.5">Usage Limit</label>
              <input type="number" min="1" value={form.usageLimit}
                onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
                placeholder="Unlimited"
                className="w-full px-4 py-3 rounded-xl border border-[#D4C5B0] bg-[#FAF7F2] text-sm font-inter font-light focus:outline-none focus:ring-2 focus:ring-[#B8A4D4] transition-all" />
            </div>
            <div>
              <label className="block text-sm font-inter font-light text-[#2A2A2A] mb-1.5">Expires At</label>
              <input type="date" value={form.expiresAt}
                onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-[#D4C5B0] bg-[#FAF7F2] text-sm font-inter font-light focus:outline-none focus:ring-2 focus:ring-[#B8A4D4] transition-all" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-inter font-light text-[#2A2A2A] mb-1.5">Description</label>
              <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="e.g. 20% off summer sale"
                className="w-full px-4 py-3 rounded-xl border border-[#D4C5B0] bg-[#FAF7F2] text-sm font-inter font-light focus:outline-none focus:ring-2 focus:ring-[#B8A4D4] transition-all" />
            </div>
            <div className="sm:col-span-2 flex gap-3">
              <button type="submit" disabled={saving}
                className="px-6 py-2.5 bg-[#4A2C5A] text-white text-sm font-inter font-normal rounded-xl hover:bg-[#5B3A6B] disabled:opacity-70 flex items-center gap-2 transition-colors">
                {saving && <Loader2 size={14} className="animate-spin" />}
                Create Coupon
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="px-6 py-2.5 border border-[#D4C5B0] text-[#2A2A2A] text-sm font-inter font-light rounded-xl hover:bg-[#FAF7F2] transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Coupons list */}
      <div className="bg-white rounded-2xl border border-[#E8DFF5]/60 overflow-hidden">
        {coupons.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm font-inter font-light text-[#8B8B8B]">No coupons yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#E8DFF5]">
            {coupons.map((coupon) => (
              <div key={coupon.id} className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-inter font-semibold text-[#4A2C5A] tracking-wider">{coupon.code}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-inter font-light ${coupon.isActive ? "bg-[#6B8E4E]/10 text-[#6B8E4E]" : "bg-gray-100 text-gray-500"}`}>
                        {coupon.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <p className="text-xs font-inter font-light text-[#8B8B8B]">
                      {coupon.discountType === "PERCENTAGE" ? `${coupon.discountValue}% off` : `$${coupon.discountValue} off`}
                      {coupon.minimumPurchase && ` · min $${coupon.minimumPurchase}`}
                      {coupon.description && ` · ${coupon.description}`}
                    </p>
                    <p className="text-xs font-inter font-light text-[#8B8B8B] mt-0.5">
                      Used {coupon.usageCount}×{coupon.usageLimit ? ` / ${coupon.usageLimit}` : ""}
                      {coupon.expiresAt && ` · Expires ${new Date(coupon.expiresAt).toLocaleDateString("en-CA")}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button onClick={() => handleToggle(coupon.id, coupon.isActive)}
                    disabled={toggling === coupon.id}
                    className="text-[#8B8B8B] hover:text-[#4A2C5A] transition-colors disabled:opacity-50">
                    {toggling === coupon.id ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : coupon.isActive ? (
                      <ToggleRight size={22} className="text-[#6B8E4E]" />
                    ) : (
                      <ToggleLeft size={22} />
                    )}
                  </button>
                  <button onClick={() => handleDelete(coupon.id)} disabled={deleting === coupon.id}
                    className="text-[#B85450]/60 hover:text-[#B85450] transition-colors disabled:opacity-50">
                    {deleting === coupon.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
