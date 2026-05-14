"use client";

import { useState } from "react";
import { Loader2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface NewsletterFormProps {
  compact?: boolean;
  className?: string;
}

export function NewsletterForm({ compact = false, className }: NewsletterFormProps) {
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
      <p className="text-sm text-[#6B8E4E] font-inter font-light">
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
            "flex-1 px-4 py-2.5 rounded-lg border border-[#D4C5B0] bg-white",
            "text-sm font-inter font-light text-[#2A2A2A] placeholder-[#8B8B8B]",
            "focus:outline-none focus:ring-2 focus:ring-[#C4992E] focus:border-transparent",
            "transition-all"
          )}
          aria-label="Email address"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className={cn(
            "flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg",
            "bg-[#1A1410] text-white font-inter font-normal text-sm",
            "hover:bg-[#5B3A6B] transition-colors disabled:opacity-60",
            compact ? "w-full" : "shrink-0"
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
        <p className="mt-2 text-xs text-[#B85450] font-inter">{message}</p>
      )}
    </form>
  );
}
