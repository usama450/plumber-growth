"use client";

import { useState } from "react";
import { Mail, AtSign, Globe } from "lucide-react";
import { toast } from "@/components/common/Toaster";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success("Message sent! We'll get back to you within 24–48 hours.");
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F4EE]">
      {/* Hero */}
      <div className="py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1
            className="text-[#5A189A] text-3xl sm:text-4xl font-bold mb-3"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Get in Touch
          </h1>
          <p
            className="text-[#8B8B8B] font-light"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Have a question or just want to say hello? We&apos;d love to hear from you.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid sm:grid-cols-2 gap-10 items-start">
          {/* Contact form */}
          <div className="bg-[#F5EFE5] rounded-[8px] p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              {(
                [
                  { key: "name", label: "Name", type: "text" },
                  { key: "email", label: "Email", type: "email" },
                  { key: "subject", label: "Subject", type: "text" },
                ] as const
              ).map((f) => (
                <div key={f.key}>
                  <label
                    className="block text-sm text-[#1A1A1A] mb-1.5"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {f.label}
                  </label>
                  <input
                    type={f.type}
                    value={form[f.key]}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-[4px] border border-[#E8DFF5] bg-white text-sm text-[#1A1A1A] focus:outline-none focus:border-[#5A189A] focus:ring-1 focus:ring-[#E8DFF5] transition-colors"
                    style={{ fontFamily: "var(--font-inter)" }}
                  />
                </div>
              ))}
              <div>
                <label
                  className="block text-sm text-[#1A1A1A] mb-1.5"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Message
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-[4px] border border-[#E8DFF5] bg-white text-sm text-[#1A1A1A] focus:outline-none focus:border-[#5A189A] focus:ring-1 focus:ring-[#E8DFF5] transition-colors resize-none"
                  style={{ fontFamily: "var(--font-inter)" }}
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                className="w-full bg-[#5A189A] text-[#F8F4EE] border border-[#E7D3A8]/30 px-6 py-3 text-sm tracking-[0.1em] uppercase hover:bg-[#7B3DBF] hover:shadow-[0_8px_30px_rgba(90,24,154,0.4)] transition-all rounded-[4px] disabled:opacity-60"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {sending ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>

          {/* Contact info */}
          <div className="space-y-8 pt-4">
            {/* Email */}
            <div className="flex items-start gap-4">
              <Mail size={20} className="text-[#5A189A] shrink-0 mt-0.5" />
              <div>
                <p
                  className="text-xs text-[#8B8B8B] tracking-[0.2em] uppercase mb-1"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Email
                </p>
                <a
                  href="mailto:khwabhome@gmail.com"
                  className="text-sm font-light text-[#1A1A1A] hover:text-[#5A189A] transition-colors"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  khwabhome@gmail.com
                </a>
                <p
                  className="text-xs text-[#8B8B8B] font-light mt-1"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  We typically respond within 24–48 hours.
                </p>
              </div>
            </div>

            {/* Social */}
            <div>
              <p
                className="text-xs text-[#8B8B8B] tracking-[0.2em] uppercase mb-3"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Follow Us
              </p>
              <div className="flex items-center gap-3">
                <a
                  href="#"
                  aria-label="Instagram"
                  className="w-10 h-10 flex items-center justify-center rounded-[8px] border border-[#E8DFF5] text-[#5A189A] hover:border-[#5A189A] hover:bg-[#5A189A]/5 transition-all"
                >
                  <AtSign size={18} />
                </a>
                <a
                  href="#"
                  aria-label="Facebook"
                  className="w-10 h-10 flex items-center justify-center rounded-[8px] border border-[#E8DFF5] text-[#5A189A] hover:border-[#5A189A] hover:bg-[#5A189A]/5 transition-all"
                >
                  <Globe size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
