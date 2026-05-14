"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Loader2, Plus, Trash2 } from "lucide-react";

interface Address {
  id: string;
  fullName: string;
  streetAddress: string;
  addressLine2: string | null;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [form, setForm] = useState({
    fullName: "", streetAddress: "", addressLine2: "",
    city: "", province: "ON", postalCode: "", country: "CA", isDefault: false,
  });

  const provinces = [
    ["AB", "Alberta"], ["BC", "British Columbia"], ["MB", "Manitoba"],
    ["NB", "New Brunswick"], ["NL", "Newfoundland"], ["NS", "Nova Scotia"],
    ["NT", "Northwest Territories"], ["NU", "Nunavut"], ["ON", "Ontario"],
    ["PE", "Prince Edward Island"], ["QC", "Quebec"], ["SK", "Saskatchewan"],
    ["YT", "Yukon"],
  ];

  useEffect(() => {
    fetch("/api/user/addresses")
      .then((r) => r.json())
      .then((d) => setAddresses(d.addresses ?? []))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/user/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const data = await res.json();
      setAddresses((prev) => [...prev, data.address]);
      setShowForm(false);
      setForm({ fullName: "", streetAddress: "", addressLine2: "", city: "", province: "ON", postalCode: "", country: "CA", isDefault: false });
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    await fetch(`/api/user/addresses/${id}`, { method: "DELETE" });
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    setDeleting(null);
  };

  return (
    <div className="min-h-screen bg-[#050507]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/account" className="text-sm font-inter font-light text-[#A8A4B0] hover:text-[#E7D3A8] transition-colors">
            ← My Account
          </Link>
          <span className="text-[#3A1A5C]">/</span>
          <h1 className="font-semibold text-[#E7D3A8] text-3xl"
            style={{ fontFamily: "var(--font-playfair)" }}>Saved Addresses</h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-[#5A189A]" size={28} />
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              {addresses.map((addr) => (
                <div key={addr.id} className="bg-[#150820] rounded-2xl p-5 border border-[#3A1A5C] relative">
                  {addr.isDefault && (
                    <span className="absolute top-4 right-4 text-xs px-2 py-0.5 bg-[#3A1A5C] text-[#E7D3A8] rounded-full font-inter font-light">
                      Default
                    </span>
                  )}
                  <p className="text-sm font-inter font-normal text-[#F8F4EE] mb-1">{addr.fullName}</p>
                  <p className="text-sm font-inter font-light text-[#A8A4B0]">{addr.streetAddress}</p>
                  {addr.addressLine2 && <p className="text-sm font-inter font-light text-[#A8A4B0]">{addr.addressLine2}</p>}
                  <p className="text-sm font-inter font-light text-[#A8A4B0]">{addr.city}, {addr.province} {addr.postalCode}</p>
                  <p className="text-sm font-inter font-light text-[#A8A4B0]">{addr.country}</p>
                  <button onClick={() => handleDelete(addr.id)} disabled={deleting === addr.id}
                    className="mt-3 flex items-center gap-1.5 text-xs text-[#B85450] hover:text-[#B85450]/80 font-inter font-light transition-colors">
                    {deleting === addr.id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                    Remove
                  </button>
                </div>
              ))}

              <button onClick={() => setShowForm(true)}
                className="flex flex-col items-center justify-center gap-2 bg-[#150820] rounded-2xl p-5 border border-dashed border-[#3A1A5C] hover:border-[#5A189A] hover:bg-[#3A1A5C]/10 transition-all min-h-[140px]">
                <Plus size={20} className="text-[#A8A4B0]" />
                <span className="text-sm font-inter font-light text-[#A8A4B0]">Add new address</span>
              </button>
            </div>

            {showForm && (
              <div className="bg-[#150820] rounded-2xl p-6 border border-[#3A1A5C]">
                <h2 className="font-semibold text-[#E7D3A8] text-xl mb-5"
                  style={{ fontFamily: "var(--font-playfair)" }}>New Address</h2>
                <form onSubmit={handleSave} className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-inter font-light text-[#A8A4B0] mb-1.5">Full Name</label>
                    <input required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[#3A1A5C] bg-[#0D0415] text-sm font-inter font-light text-[#F8F4EE] focus:outline-none focus:ring-1 focus:ring-[#5A189A] transition-all" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-inter font-light text-[#A8A4B0] mb-1.5">Street Address</label>
                    <input required value={form.streetAddress} onChange={(e) => setForm({ ...form, streetAddress: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[#3A1A5C] bg-[#0D0415] text-sm font-inter font-light text-[#F8F4EE] focus:outline-none focus:ring-1 focus:ring-[#5A189A] transition-all" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-inter font-light text-[#A8A4B0] mb-1.5">Apt, Suite (optional)</label>
                    <input value={form.addressLine2} onChange={(e) => setForm({ ...form, addressLine2: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[#3A1A5C] bg-[#0D0415] text-sm font-inter font-light text-[#F8F4EE] focus:outline-none focus:ring-1 focus:ring-[#5A189A] transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-inter font-light text-[#A8A4B0] mb-1.5">City</label>
                    <input required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[#3A1A5C] bg-[#0D0415] text-sm font-inter font-light text-[#F8F4EE] focus:outline-none focus:ring-1 focus:ring-[#5A189A] transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-inter font-light text-[#A8A4B0] mb-1.5">Province</label>
                    <select required value={form.province} onChange={(e) => setForm({ ...form, province: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[#3A1A5C] bg-[#0D0415] text-sm font-inter font-light text-[#F8F4EE] focus:outline-none focus:ring-1 focus:ring-[#5A189A] transition-all">
                      {provinces.map(([code, name]) => (
                        <option key={code} value={code}>{name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-inter font-light text-[#A8A4B0] mb-1.5">Postal Code</label>
                    <input required value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[#3A1A5C] bg-[#0D0415] text-sm font-inter font-light text-[#F8F4EE] focus:outline-none focus:ring-1 focus:ring-[#5A189A] transition-all" />
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <input type="checkbox" id="isDefault" checked={form.isDefault}
                      onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
                      className="rounded border-[#3A1A5C] text-[#5A189A]" />
                    <label htmlFor="isDefault" className="text-sm font-inter font-light text-[#A8A4B0]">Set as default</label>
                  </div>
                  <div className="sm:col-span-2 flex gap-3 pt-2">
                    <button type="submit" disabled={saving}
                      className="px-6 py-2.5 bg-[#5A189A] text-white text-sm font-inter font-normal rounded-xl hover:bg-[#7B3DBF] transition-colors disabled:opacity-70 flex items-center gap-2">
                      {saving && <Loader2 size={14} className="animate-spin" />}
                      Save Address
                    </button>
                    <button type="button" onClick={() => setShowForm(false)}
                      className="px-6 py-2.5 border border-[#3A1A5C] text-[#F8F4EE] text-sm font-inter font-light rounded-xl hover:bg-[#0D0415] transition-colors">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
