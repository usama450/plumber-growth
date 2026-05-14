"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (session?.user?.name) setName(session.user.name);
  }, [session]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await fetch("/api/user/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (res.ok) {
      await update({ name });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      const d = await res.json();
      setError(d.error ?? "Failed to save");
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/account" className="text-sm font-inter font-light text-[#8B8B8B] hover:text-[#1A1410] transition-colors">
            ← My Account
          </Link>
          <span className="text-[#D4C5B0]">/</span>
          <h1 className="font-playfair font-semibold text-[#1A1410] text-3xl"
            style={{ fontFamily: "var(--font-cormorant)" }}>Account Settings</h1>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#F7F3EE]/60 mb-5">
          <h2 className="font-playfair font-semibold text-[#1A1410] text-xl mb-5"
            style={{ fontFamily: "var(--font-cormorant)" }}>Profile</h2>

          {error && (
            <div className="mb-4 p-3 bg-[#B85450]/10 border border-[#B85450]/20 rounded-lg text-sm text-[#B85450] font-inter font-light">
              {error}
            </div>
          )}
          {saved && (
            <div className="mb-4 p-3 bg-[#6B8E4E]/10 border border-[#6B8E4E]/20 rounded-lg text-sm text-[#6B8E4E] font-inter font-light">
              Changes saved successfully.
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-inter font-light text-[#2A2A2A] mb-1.5">Full Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} required
                className="w-full px-4 py-3 rounded-xl border border-[#D4C5B0] bg-[#FAF7F2] text-sm font-inter font-light text-[#2A2A2A] focus:outline-none focus:ring-2 focus:ring-[#C4992E] transition-all" />
            </div>
            <div>
              <label className="block text-sm font-inter font-light text-[#2A2A2A] mb-1.5">Email</label>
              <input value={session?.user?.email ?? ""} disabled
                className="w-full px-4 py-3 rounded-xl border border-[#D4C5B0] bg-[#F7F3EE]/20 text-sm font-inter font-light text-[#8B8B8B] cursor-not-allowed" />
              <p className="text-xs text-[#8B8B8B] font-inter font-light mt-1">Email cannot be changed.</p>
            </div>
            <button type="submit" disabled={saving}
              className="px-6 py-2.5 bg-[#1A1410] text-white text-sm font-inter font-normal rounded-xl hover:bg-[#5B3A6B] transition-colors disabled:opacity-70 flex items-center gap-2">
              {saving && <Loader2 size={14} className="animate-spin" />}
              Save Changes
            </button>
          </form>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#F7F3EE]/60">
          <h2 className="font-playfair font-semibold text-[#1A1410] text-xl mb-2"
            style={{ fontFamily: "var(--font-cormorant)" }}>Account</h2>
          <p className="text-sm font-inter font-light text-[#8B8B8B] mb-5">
            Member since {session?.user ? new Date().toLocaleDateString("en-CA", { year: "numeric", month: "long" }) : "—"}
          </p>
          <Link href="/api/auth/signout"
            className="inline-block px-5 py-2 border border-[#B85450]/40 text-[#B85450] text-sm font-inter font-light rounded-xl hover:bg-[#B85450]/5 transition-colors">
            Sign Out
          </Link>
        </div>
      </div>
    </div>
  );
}
