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
    <div className="min-h-screen bg-[#F9F7F4]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/account" className="text-sm font-inter font-light text-[#7A746D] hover:text-[#1A1714] transition-colors">
            ← My Account
          </Link>
          <span className="text-[#B5AFA8]">/</span>
          <h1 className="font-semibold text-[#1A1714] text-3xl"
            style={{ fontFamily: "var(--font-playfair)" }}>Account Settings</h1>
        </div>

        <div className="bg-white border border-[#E2DDD7] p-6 lg:p-8 mb-5">
          <h2 className="font-semibold text-[#1A1714] text-xl mb-5"
            style={{ fontFamily: "var(--font-playfair)" }}>Profile</h2>

          {error && (
            <div className="mb-4 p-3 bg-[#C0392B]/5 border border-[#C0392B]/20 text-[12px] text-[#C0392B] font-inter font-light">
              {error}
            </div>
          )}
          {saved && (
            <div className="mb-4 p-3 bg-[#2C4A35]/5 border border-[#2C4A35]/20 text-[12px] text-[#2C4A35] font-inter font-light">
              Changes saved successfully.
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-[12px] tracking-[0.08em] uppercase text-[#5A554F] mb-1 font-inter">Full Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} required
                className="w-full bg-white border border-[#E2DDD7] text-[#1A1714] placeholder-[#B5AFA8] focus:border-[#2C4A35] focus:outline-none rounded-none px-3 py-2.5 text-[14px]" />
            </div>
            <div>
              <label className="block text-[12px] tracking-[0.08em] uppercase text-[#5A554F] mb-1 font-inter">Email</label>
              <input value={session?.user?.email ?? ""} disabled
                className="w-full bg-[#F4F0EB] border border-[#E2DDD7] text-[#7A746D] rounded-none px-3 py-2.5 text-[14px] cursor-not-allowed" />
              <p className="text-[12px] text-[#7A746D] font-inter font-light mt-1">Email cannot be changed.</p>
            </div>
            <button type="submit" disabled={saving}
              className="btn-primary px-6 py-2.5 flex items-center gap-2 disabled:opacity-70">
              {saving && <Loader2 size={14} className="animate-spin" />}
              Save Changes
            </button>
          </form>
        </div>

        <div className="bg-white border border-[#E2DDD7] p-6 lg:p-8">
          <h2 className="font-semibold text-[#1A1714] text-xl mb-2"
            style={{ fontFamily: "var(--font-playfair)" }}>Account</h2>
          <p className="text-sm font-inter font-light text-[#5A554F] mb-5">
            Member since {session?.user ? new Date().toLocaleDateString("en-CA", { year: "numeric", month: "long" }) : "—"}
          </p>
          <Link href="/api/auth/signout"
            className="inline-block px-5 py-2 border border-[#C0392B]/30 text-[#C0392B] text-sm font-inter font-light hover:bg-[#C0392B]/5 transition-colors">
            Sign Out
          </Link>
        </div>
      </div>
    </div>
  );
}
