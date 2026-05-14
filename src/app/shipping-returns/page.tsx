import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping & Returns",
  description: "Learn about Khwab's shipping rates, delivery times, and hassle-free return policy.",
};

export default function ShippingReturnsPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <div className="bg-[#E8DFF5]/30 border-b border-[#E8DFF5] py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="font-playfair font-semibold text-[#4A2C5A] text-3xl"
            style={{ fontFamily: "var(--font-playfair)" }}>Shipping & Returns</h1>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {[
          {
            title: "Shipping Policy",
            content: [
              "**Free Shipping:** On all orders over $125 CAD. No code needed — it applies automatically at checkout.",
              "**Standard Shipping:** $15 CAD flat rate for orders under $125.",
              "**Processing Time:** Orders are processed within 1–2 business days (Monday–Friday, excluding Canadian holidays).",
              "**Delivery Estimates:** 3–7 business days across Canada. Ontario and GTA orders often arrive in 2–4 business days.",
              "**Shipping Carriers:** We use Canada Post and select courier partners depending on your location.",
              "**Tracking:** You'll receive a shipping confirmation email with tracking number once your order ships.",
            ],
          },
          {
            title: "Return Policy",
            content: [
              "**30-Day Free Returns:** We offer free returns within 30 days of delivery on all unwashed, unused items in their original packaging.",
              "**How to Start a Return:** Email returns@khwab.ca with your order number. We'll send you a prepaid return label.",
              "**Refunds:** Processed within 5–7 business days of receiving the returned item. Refunded to your original payment method.",
              "**Exchanges:** We're happy to exchange for a different size or colour. Just mention this in your return email.",
              "**Non-Returnable Items:** Items that have been washed, used, or are not in original packaging cannot be returned. Sale items are final sale.",
            ],
          },
          {
            title: "Damaged or Wrong Items",
            content: [
              "If you receive a damaged or incorrect item, please email us at support@khwab.ca within 7 days of delivery with a photo. We'll make it right at no cost to you.",
            ],
          },
        ].map((section) => (
          <div key={section.title}>
            <h2 className="font-playfair font-semibold text-[#4A2C5A] text-xl mb-4"
              style={{ fontFamily: "var(--font-playfair)" }}>{section.title}</h2>
            <div className="bg-white rounded-2xl border border-[#E8DFF5]/60 p-6 space-y-3">
              {section.content.map((item) => (
                <p key={item} className="text-sm font-inter font-light text-[#2A2A2A] leading-relaxed">
                  {item.split("**").map((part, i) =>
                    i % 2 === 1 ? <strong key={i} className="font-normal text-[#2A2A2A]">{part}</strong> : part
                  )}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
