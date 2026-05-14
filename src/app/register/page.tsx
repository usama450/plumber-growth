"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Loader2, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) { setError("Passwords do not match"); return; }
    if (form.password.length < 8) { setError("Password must be at least 8 characters"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Registration failed"); return; }
      await signIn("credentials", { email: form.email, password: form.password, redirect: false });
      router.push("/account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050507] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/">
            <h1 className="text-3xl font-semibold text-[#E7D3A8]"
              style={{ fontFamily: "var(--font-playfair)" }}>Khwab</h1>
            <p className="text-[10px] text-[#C9A961] tracking-[0.2em] uppercase font-inter font-light mt-1">Home Textiles</p>
          </Link>
        </div>
        <div className="bg-[#150820] rounded-2xl p-8 border border-[#3A1A5C] shadow-[0_4px_24px_rgba(74,44,90,0.08)]">
          <h2 className="text-[#E7D3A8] text-2xl mb-1 font-semibold"
            style={{ fontFamily: "var(--font-playfair)" }}>Create your account</h2>
          <p className="text-sm font-inter font-light text-[#A8A4B0] mb-6">Join the Khwab family today</p>
          {error && (
            <div className="mb-4 p-3 bg-[#B85450]/10 border border-[#B85450]/20 rounded-lg text-sm text-[#B85450] font-inter font-light">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { key: "name", label: "Full Name", type: "text", placeholder: "Your full name" },
              { key: "email", label: "Email", type: "email", placeholder: "you@example.com" },
            ].map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-inter font-light text-[#A8A4B0] mb-1.5">{field.label}</label>
                <input type={field.type}
                  value={form[field.key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  required placeholder={field.placeholder}
                  className="w-full px-4 py-3 rounded-xl border border-[#3A1A5C] bg-[#0D0415] text-sm font-inter font-light text-[#F8F4EE] focus:outline-none focus:ring-1 focus:ring-[#5A189A] transition-all placeholder-[#6B6475]" />
              </div>
            ))}
            <div>
              <label className="block text-sm font-inter font-light text-[#A8A4B0] mb-1.5">Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })} required
                  placeholder="Min. 8 characters"
                  className="w-full px-4 py-3 pr-11 rounded-xl border border-[#3A1A5C] bg-[#0D0415] text-sm font-inter font-light text-[#F8F4EE] focus:outline-none focus:ring-1 focus:ring-[#5A189A] transition-all placeholder-[#6B6475]" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A8A4B0] hover:text-[#E7D3A8]">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-inter font-light text-[#A8A4B0] mb-1.5">Confirm Password</label>
              <input type="password" value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })} required
                placeholder="Repeat your password"
                className="w-full px-4 py-3 rounded-xl border border-[#3A1A5C] bg-[#0D0415] text-sm font-inter font-light text-[#F8F4EE] focus:outline-none focus:ring-1 focus:ring-[#5A189A] transition-all placeholder-[#6B6475]" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3.5 bg-[#5A189A] text-white font-inter font-normal text-sm rounded-xl hover:bg-[#7B3DBF] transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
              {loading ? <><Loader2 size={16} className="animate-spin" />Creating account...</> : "Create Account"}
            </button>
          </form>
          <button onClick={() => signIn("google", { callbackUrl: "/account" })}
            className="w-full mt-3 flex items-center justify-center gap-3 py-3 border border-[#3A1A5C] rounded-xl text-sm font-inter font-light text-[#F8F4EE] hover:bg-[#3A1A5C]/30 transition-colors">
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
        </div>
        <p className="text-center text-sm font-inter font-light text-[#A8A4B0] mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-[#E7D3A8] hover:underline">Sign in →</Link>
        </p>
      </div>
    </div>
  );
}
