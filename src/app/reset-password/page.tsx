"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Eye, EyeOff } from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const email = searchParams.get("email") ?? "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) { setError("Passwords do not match"); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters"); return; }
    setLoading(true);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, email, password }),
    });
    if (res.ok) {
      setDone(true);
      setTimeout(() => router.push("/login"), 3000);
    } else {
      const d = await res.json();
      setError(d.error ?? "Reset failed. The link may have expired.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/">
            <h1 className="font-playfair text-3xl font-semibold text-[#4A2C5A]"
              style={{ fontFamily: "var(--font-playfair)" }}>Khwab</h1>
            <p className="text-[10px] text-[#C9A961] tracking-[0.2em] uppercase font-inter font-light mt-1">Home Textiles</p>
          </Link>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-[#E8DFF5]/60 shadow-[0_4px_24px_rgba(74,44,90,0.08)]">
          {done ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 bg-[#6B8E4E]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6B8E4E" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <h2 className="font-playfair font-semibold text-[#4A2C5A] text-2xl mb-2"
                style={{ fontFamily: "var(--font-playfair)" }}>Password reset!</h2>
              <p className="text-sm font-inter font-light text-[#8B8B8B]">
                Redirecting you to login...
              </p>
            </div>
          ) : (
            <>
              <h2 className="font-playfair font-semibold text-[#4A2C5A] text-2xl mb-1"
                style={{ fontFamily: "var(--font-playfair)" }}>Set new password</h2>
              <p className="text-sm font-inter font-light text-[#8B8B8B] mb-6">
                Choose a strong password for your account.
              </p>

              {error && (
                <div className="mb-4 p-3 bg-[#B85450]/10 border border-[#B85450]/20 rounded-lg text-sm text-[#B85450] font-inter font-light">
                  {error}
                </div>
              )}

              {(!token || !email) ? (
                <div className="text-center py-4">
                  <p className="text-sm font-inter font-light text-[#B85450] mb-4">Invalid or expired reset link.</p>
                  <Link href="/forgot-password" className="text-sm text-[#4A2C5A] hover:underline font-inter font-light">
                    Request a new link →
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-inter font-light text-[#2A2A2A] mb-1.5">New Password</label>
                    <div className="relative">
                      <input type={showPassword ? "text" : "password"} value={password}
                        onChange={(e) => setPassword(e.target.value)} required minLength={8}
                        className="w-full px-4 py-3 pr-11 rounded-xl border border-[#D4C5B0] bg-[#FAF7F2] text-sm font-inter font-light text-[#2A2A2A] focus:outline-none focus:ring-2 focus:ring-[#B8A4D4] transition-all"
                        placeholder="Min. 8 characters" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B8B8B] hover:text-[#4A2C5A] transition-colors">
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-inter font-light text-[#2A2A2A] mb-1.5">Confirm Password</label>
                    <input type="password" value={confirm}
                      onChange={(e) => setConfirm(e.target.value)} required
                      className="w-full px-4 py-3 rounded-xl border border-[#D4C5B0] bg-[#FAF7F2] text-sm font-inter font-light text-[#2A2A2A] focus:outline-none focus:ring-2 focus:ring-[#B8A4D4] transition-all"
                      placeholder="Repeat your password" />
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full py-3.5 bg-[#4A2C5A] text-white font-inter font-normal text-sm rounded-xl hover:bg-[#5B3A6B] transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
                    {loading ? <><Loader2 size={16} className="animate-spin" />Saving...</> : "Reset Password"}
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#4A2C5A] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
