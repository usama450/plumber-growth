"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { toast } from "@/components/common/Toaster";
import type { Metadata } from "next";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Message sent! We'll get back to you within 24 hours.");
      setForm({ name: "", email: "", subject: "", message: "" });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <div className="bg-[#F7F3EE]/30 border-b border-[#F7F3EE] py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-playfair font-semibold text-[#1A1410] text-3xl"
            style={{ fontFamily: "var(--font-cormorant)" }}>Contact Us</h1>
          <p className="text-[#8B8B8B] font-inter font-light mt-2">We&apos;d love to hear from you. We typically respond within 24 hours.</p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-2 gap-10">
          <div>
            <h2 className="font-playfair font-semibold text-[#1A1410] text-xl mb-6"
              style={{ fontFamily: "var(--font-cormorant)" }}>Get in Touch</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { key: "name", label: "Name", type: "text" },
                { key: "email", label: "Email", type: "email" },
                { key: "subject", label: "Subject", type: "text" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-sm font-inter font-light text-[#2A2A2A] mb-1.5">{f.label}</label>
                  <input type={f.type} value={form[f.key as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} required
                    className="w-full px-4 py-3 rounded-xl border border-[#D4C5B0] bg-white text-sm font-inter font-light focus:outline-none focus:ring-2 focus:ring-[#C4992E]" />
                </div>
              ))}
              <div>
                <label className="block text-sm font-inter font-light text-[#2A2A2A] mb-1.5">Message</label>
                <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required
                  rows={5} className="w-full px-4 py-3 rounded-xl border border-[#D4C5B0] bg-white text-sm font-inter font-light focus:outline-none focus:ring-2 focus:ring-[#C4992E] resize-none" />
              </div>
              <button type="submit" disabled={sending}
                className="w-full py-3.5 bg-[#1A1410] text-white font-inter font-normal text-sm rounded-xl hover:bg-[#5B3A6B] transition-colors disabled:opacity-60">
                {sending ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
          <div className="space-y-6">
            <h2 className="font-playfair font-semibold text-[#1A1410] text-xl"
              style={{ fontFamily: "var(--font-cormorant)" }}>Our Information</h2>
            {[
              { icon: <Mail size={18} />, label: "Email", value: "hello@khwab.ca", href: "mailto:hello@khwab.ca" },
              { icon: <Phone size={18} />, label: "Phone", value: "1-800-KHWAB-CA", href: "tel:+18005492222" },
              { icon: <MapPin size={18} />, label: "Location", value: "Greater Toronto Area, Ontario, Canada" },
              { icon: <Clock size={18} />, label: "Hours", value: "Mon–Fri: 9am–6pm ET\nSat: 10am–4pm ET" },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#F7F3EE] flex items-center justify-center shrink-0 text-[#1A1410]">
                  {item.icon}
                </div>
                <div>
                  <p className="text-xs font-inter font-medium text-[#8B8B8B] uppercase tracking-wider mb-0.5">{item.label}</p>
                  {item.href ? (
                    <a href={item.href} className="text-sm font-inter font-light text-[#2A2A2A] hover:text-[#1A1410] transition-colors">{item.value}</a>
                  ) : (
                    <p className="text-sm font-inter font-light text-[#2A2A2A] whitespace-pre-line">{item.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
