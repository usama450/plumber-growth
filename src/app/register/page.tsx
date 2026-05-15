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
          <h2 className="text-[#1A1714] text-2xl mb-1 font-semibold"
            style={{ fontFamily: "var(--font-playfair)" }}>Create your account</h2>
          <p className="text-sm font-inter font-light text-[#5A554F] mb-6">Join the Khwab family today</p>
          {error && (
            <div className="mb-4 p-3 bg-[#C0392B]/5 border border-[#C0392B]/20 text-[12px] text-[#C0392B] font-inter font-light">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { key: "name", label: "Full Name", type: "text", placeholder: "Your full name" },
              { key: "email", label: "Email", type: "email", placeholder: "you@example.com" },
            ].map((field) => (
              <div key={field.key}>
                <label className="block text-[12px] tracking-[0.08em] uppercase text-[#5A554F] mb-1 font-inter">{field.label}</label>
                <input type={field.type}
                  value={form[field.key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  required placeholder={field.placeholder}
                  className="w-full bg-white border border-[#E2DDD7] text-[#1A1714] placeholder-[#B5AFA8] focus:border-[#2C4A35] focus:outline-none rounded-none px-3 py-2.5 text-[14px]" />
              </div>
            ))}
            <div>
              <label className="block text-[12px] tracking-[0.08em] uppercase text-[#5A554F] mb-1 font-inter">Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })} required
                  placeholder="Min. 8 characters"
                  className="w-full bg-white border border-[#E2DDD7] text-[#1A1714] placeholder-[#B5AFA8] focus:border-[#2C4A35] focus:outline-none rounded-none px-3 py-2.5 text-[14px] pr-11" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A746D] hover:text-[#1A1714]">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-[12px] tracking-[0.08em] uppercase text-[#5A554F] mb-1 font-inter">Confirm Password</label>
              <input type="password" value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })} required
                placeholder="Repeat your password"
                className="w-full bg-white border border-[#E2DDD7] text-[#1A1714] placeholder-[#B5AFA8] focus:border-[#2C4A35] focus:outline-none rounded-none px-3 py-2.5 text-[14px]" />
            </div>
            <button type="submit" disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-70">
              {loading ? <><Loader2 size={16} className="animate-spin" />Creating account...</> : "Create Account"}
            </button>
          </form>
          <button onClick={() => signIn("google", { callbackUrl: "/account" })}
            className="w-full mt-3 flex items-center justify-center gap-3 py-3 border border-[#E2DDD7] text-sm font-inter font-light text-[#1A1714] hover:border-[#B5AFA8] hover:bg-[#F4F0EB] transition-colors">
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
        </div>
        <p className="text-center text-sm font-inter font-light text-[#5A554F] mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-[#2C4A35] hover:text-[#1A1714] underline underline-offset-2">Sign in →</Link>
        </p>
      </div>
    </div>
  );
}
