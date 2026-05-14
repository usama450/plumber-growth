"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Eye, EyeOff } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/account";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email, password, redirect: false,
      });
      if (result?.error) {
        setError("Invalid email or password. Please try again.");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => signIn("google", { callbackUrl });

  return (
    <div className="min-h-screen bg-[#050507] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <h1 className="text-3xl font-semibold text-[#E7D3A8]"
              style={{ fontFamily: "var(--font-playfair)" }}>Khwab</h1>
            <p className="text-[10px] text-[#C9A961] tracking-[0.2em] uppercase font-inter font-light mt-1">Home Textiles</p>
          </Link>
        </div>

        <div className="bg-[#150820] rounded-2xl p-8 border border-[#3A1A5C] shadow-[0_4px_24px_rgba(74,44,90,0.08)]">
          <h2 className="text-[#E7D3A8] text-2xl mb-1 font-semibold"
            style={{ fontFamily: "var(--font-playfair)" }}>Welcome back</h2>
          <p className="text-sm font-inter font-light text-[#A8A4B0] mb-6">Sign in to your account</p>

          {searchParams.get("error") && (
            <div className="mb-4 p-3 bg-[#B85450]/10 border border-[#B85450]/20 rounded-lg text-sm text-[#B85450] font-inter font-light">
              There was a problem signing in. Please try again.
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-[#B85450]/10 border border-[#B85450]/20 rounded-lg text-sm text-[#B85450] font-inter font-light">
              {error}
            </div>
          )}

          {/* Google OAuth */}
          <button onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 py-3 border border-[#3A1A5C] rounded-xl text-sm font-inter font-light text-[#F8F4EE] hover:bg-[#3A1A5C]/30 transition-colors mb-5">
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-[#3A1A5C]" />
            <span className="text-xs text-[#A8A4B0] font-inter font-light">or</span>
            <div className="flex-1 h-px bg-[#3A1A5C]" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-inter font-light text-[#A8A4B0] mb-1.5" htmlFor="email">Email</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full px-4 py-3 rounded-xl border border-[#3A1A5C] bg-[#0D0415] text-sm font-inter font-light text-[#F8F4EE] focus:outline-none focus:ring-1 focus:ring-[#5A189A] focus:border-transparent transition-all placeholder-[#6B6475]"
                placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm font-inter font-light text-[#A8A4B0] mb-1.5" htmlFor="password">Password</label>
              <div className="relative">
                <input id="password" type={showPassword ? "text" : "password"} value={password}
                  onChange={(e) => setPassword(e.target.value)} required
                  className="w-full px-4 py-3 rounded-xl border border-[#3A1A5C] bg-[#0D0415] text-sm font-inter font-light text-[#F8F4EE] focus:outline-none focus:ring-1 focus:ring-[#5A189A] focus:border-transparent transition-all pr-11 placeholder-[#6B6475]"
                  placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A8A4B0] hover:text-[#E7D3A8] transition-colors">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-xs font-inter font-light text-[#A8A4B0] hover:text-[#E7D3A8] transition-colors">
                Forgot password?
              </Link>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3.5 bg-[#5A189A] text-white font-inter font-normal text-sm rounded-xl hover:bg-[#7B3DBF] transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
              {loading ? <><Loader2 size={16} className="animate-spin" />Signing in...</> : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm font-inter font-light text-[#A8A4B0] mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-[#E7D3A8] hover:underline">Create one →</Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050507] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#5A189A] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
