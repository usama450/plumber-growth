import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="font-playfair font-semibold text-[#4A2C5A] text-3xl mb-2"
          style={{ fontFamily: "var(--font-playfair)" }}>Privacy Policy</h1>
        <p className="text-sm text-[#8B8B8B] font-inter font-light mb-10">Last updated: {new Date().toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" })}</p>
        <div className="prose prose-sm max-w-none space-y-6 font-inter font-light text-[#2A2A2A] leading-relaxed">
          <p>Khwab Home Textiles (&quot;Khwab&quot;, &quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is committed to protecting your personal information in compliance with Canada&apos;s Personal Information Protection and Electronic Documents Act (PIPEDA) and applicable provincial privacy legislation.</p>
          {[
            { title: "Information We Collect", text: "We collect information you provide directly (name, email, shipping address, payment info processed by Stripe) and information collected automatically (IP address, browser type, pages visited via Google Analytics)." },
            { title: "How We Use Your Information", text: "To process and fulfill your orders, send order confirmations and shipping updates, respond to customer service inquiries, send marketing emails (only with your consent), and improve our website and services." },
            { title: "Payment Information", text: "All payment processing is handled by Stripe. We do not store your credit card information on our servers." },
            { title: "Cookies", text: "We use cookies for essential website functionality, analytics (Google Analytics), and advertising (Meta Pixel). You can manage cookie preferences via our cookie banner." },
            { title: "Data Sharing", text: "We do not sell your personal information. We share data only with service providers necessary to operate our business (Stripe, Resend, Cloudinary, Vercel, Supabase) under strict confidentiality agreements." },
            { title: "Your Rights", text: "You have the right to access, correct, or delete your personal information. Contact us at privacy@khwab.ca to make a request." },
            { title: "Contact", text: "For privacy questions, contact us at privacy@khwab.ca or Khwab Home Textiles, Greater Toronto Area, Ontario, Canada." },
          ].map((s) => (
            <div key={s.title}>
              <h2 className="text-base font-inter font-normal text-[#4A2C5A] mt-6 mb-2">{s.title}</h2>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
