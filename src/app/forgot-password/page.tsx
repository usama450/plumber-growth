"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (res.ok) {
      setSent(true);
    } else {
      const d = await res.json();
      setError(d.error ?? "Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/">
            <h1 className="font-playfair text-3xl font-semibold text-[#1A1410]"
              style={{ fontFamily: "var(--font-cormorant)" }}>Khwab</h1>
            <p className="text-[10px] text-[#C9A961] tracking-[0.2em] uppercase font-inter font-light mt-1">Home Textiles</p>
          </Link>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-[#F7F3EE]/60 shadow-[0_4px_24px_rgba(74,44,90,0.08)]">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 bg-[#6B8E4E]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6B8E4E" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 11.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.13 1.04.36 2.05.71 3.03a2 2 0 0 1-.45 2.11L7.91 9A16 16 0 0 0 15 16.09l1.14-1.14a2 2 0 0 1 2.11-.45c.98.35 1.99.58 3.03.71A2 2 0 0 1 22 16.92z"/>
                </svg>
              </div>
              <h2 className="font-playfair font-semibold text-[#1A1410] text-2xl mb-2"
                style={{ fontFamily: "var(--font-cormorant)" }}>Check your email</h2>
              <p className="text-sm font-inter font-light text-[#8B8B8B] mb-6">
                If an account exists for <strong>{email}</strong>, we&apos;ve sent a password reset link.
                Check your inbox (and spam folder).
              </p>
              <Link href="/login"
                className="inline-block px-6 py-3 bg-[#1A1410] text-white text-sm font-inter font-normal rounded-xl hover:bg-[#5B3A6B] transition-colors">
                Back to Login
              </Link>
            </div>
          ) : (
            <>
              <h2 className="font-playfair font-semibold text-[#1A1410] text-2xl mb-1"
                style={{ fontFamily: "var(--font-cormorant)" }}>Forgot your password?</h2>
              <p className="text-sm font-inter font-light text-[#8B8B8B] mb-6">
                Enter your email and we&apos;ll send you a reset link.
              </p>

              {error && (
                <div className="mb-4 p-3 bg-[#B85450]/10 border border-[#B85450]/20 rounded-lg text-sm text-[#B85450] font-inter font-light">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-inter font-light text-[#2A2A2A] mb-1.5" htmlFor="email">Email</label>
                  <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                    className="w-full px-4 py-3 rounded-xl border border-[#D4C5B0] bg-[#FAF7F2] text-sm font-inter font-light text-[#2A2A2A] focus:outline-none focus:ring-2 focus:ring-[#C4992E] focus:border-transparent transition-all"
                    placeholder="you@example.com" />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3.5 bg-[#1A1410] text-white font-inter font-normal text-sm rounded-xl hover:bg-[#5B3A6B] transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
                  {loading ? <><Loader2 size={16} className="animate-spin" />Sending...</> : "Send Reset Link"}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-sm font-inter font-light text-[#8B8B8B] mt-6">
          Remember your password?{" "}
          <Link href="/login" className="text-[#1A1410] hover:underline">Sign in →</Link>
        </p>
      </div>
    </div>
  );
}
