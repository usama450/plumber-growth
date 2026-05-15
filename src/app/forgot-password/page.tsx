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
    <div className="min-h-screen bg-[#F9F7F4] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/">
            <h1 className="text-3xl font-semibold text-[#2C4A35]"
              style={{ fontFamily: "var(--font-playfair)" }}>Khwab</h1>
            <p className="text-[10px] text-[#A67C3C] tracking-[0.2em] uppercase font-inter font-light mt-1">Home Textiles</p>
          </Link>
        </div>

        <div className="bg-white border border-[#E2DDD7] p-8">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 bg-[#2C4A35]/10 flex items-center justify-center mx-auto mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2C4A35" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 11.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.13 1.04.36 2.05.71 3.03a2 2 0 0 1-.45 2.11L7.91 9A16 16 0 0 0 15 16.09l1.14-1.14a2 2 0 0 1 2.11-.45c.98.35 1.99.58 3.03.71A2 2 0 0 1 22 16.92z"/>
                </svg>
              </div>
              <h2 className="text-[#1A1714] text-2xl mb-2 font-semibold"
                style={{ fontFamily: "var(--font-playfair)" }}>Check your email</h2>
              <p className="text-sm font-inter font-light text-[#5A554F] mb-6">
                If an account exists for <strong>{email}</strong>, we&apos;ve sent a password reset link.
                Check your inbox (and spam folder).
              </p>
              <Link href="/login"
                className="btn-primary inline-block px-6 py-3">
                Back to Login
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-[#1A1714] text-2xl mb-1 font-semibold"
                style={{ fontFamily: "var(--font-playfair)" }}>Forgot your password?</h2>
              <p className="text-sm font-inter font-light text-[#5A554F] mb-6">
                Enter your email and we&apos;ll send you a reset link.
              </p>

              {error && (
                <div className="mb-4 p-3 bg-[#C0392B]/5 border border-[#C0392B]/20 text-[12px] text-[#C0392B] font-inter font-light">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[12px] tracking-[0.08em] uppercase text-[#5A554F] mb-1 font-inter" htmlFor="email">Email</label>
                  <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                    className="w-full bg-white border border-[#E2DDD7] text-[#1A1714] placeholder-[#B5AFA8] focus:border-[#2C4A35] focus:outline-none rounded-none px-3 py-2.5 text-[14px]"
                    placeholder="you@example.com" />
                </div>
                <button type="submit" disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-70">
                  {loading ? <><Loader2 size={16} className="animate-spin" />Sending...</> : "Send Reset Link"}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-sm font-inter font-light text-[#5A554F] mt-6">
          Remember your password?{" "}
          <Link href="/login" className="text-[#2C4A35] hover:text-[#1A1714] underline underline-offset-2">Sign in →</Link>
        </p>
      </div>
    </div>
  );
}
