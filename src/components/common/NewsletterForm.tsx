"use client";

import { useState } from "react";
import { Loader2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface NewsletterFormProps {
  compact?: boolean;
  className?: string;
  darkMode?: boolean;
}

export function NewsletterForm({ compact = false, className, darkMode = false }: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage("You're subscribed! Check your inbox for your discount code.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <p className={cn("text-sm font-inter font-light", darkMode ? "text-[#C99B4D]" : "text-[#2C4A35]")}>
        ✓ {message}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn("w-full", className)}>
      <div className={cn("flex gap-2", compact ? "flex-col" : "flex-col sm:flex-row")}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className={cn(
            "flex-1 px-4 py-2.5 border text-sm font-inter font-light transition-all focus:outline-none rounded-none",
            darkMode
              ? "bg-[#F9F7F4]/10 border-[#F9F7F4]/25 text-[#F9F7F4] placeholder-[#F9F7F4]/40 focus:ring-2 focus:ring-[#A67C3C] focus:border-transparent"
              : "border-[#D4C5B0] bg-white text-[#2A2A2A] placeholder-[#8B8B8B] focus:ring-2 focus:ring-[#A67C3C] focus:border-transparent"
          )}
          aria-label="Email address"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className={cn(
            "flex items-center justify-center gap-2 px-5 py-2.5 font-inter font-normal text-sm transition-colors disabled:opacity-60",
            darkMode
              ? "btn-gold-shimmer shrink-0"
              : "bg-[#2C4A35] text-[#F9F7F4] hover:bg-[#1A2B20] rounded-none",
            !darkMode && (compact ? "w-full" : "shrink-0")
          )}
        >
          {status === "loading" ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <>Subscribe {!compact && <ArrowRight size={14} />}</>
          )}
        </button>
      </div>
      {status === "error" && (
        <p className={cn("mt-2 text-xs font-inter", darkMode ? "text-[#E8A0A0]" : "text-[#B85450]")}>{message}</p>
      )}
    </form>
  );
}
