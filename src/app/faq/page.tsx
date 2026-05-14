"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  { q: "How long does shipping take across Canada?", a: "Standard shipping takes 3–7 business days depending on your location. Orders in the GTA and Ontario often arrive in 2–4 business days. We ship from our facility in the Greater Toronto Area." },
  { q: "Do you offer free shipping?", a: "Yes! We offer free shipping on all orders over $125 CAD. Orders under $125 ship for a flat rate of $15 CAD." },
  { q: "What is your return policy?", a: "We offer free 30-day returns on all unwashed, unused items in their original packaging. Simply email us at returns@khwab.ca to start a return." },
  { q: "How do I care for my Khwab sheets?", a: "Machine wash warm with like colours. Tumble dry low. Do not bleach. Iron on medium heat if needed. Our sheets actually get softer with every wash!" },
  { q: "What thread count do you recommend?", a: "For everyday comfort, we recommend 400–600 TC percale. For a luxurious, silky feel, try our 600–1000 TC sateen. Higher thread count doesn't always mean better — weave matters just as much." },
  { q: "What sizes do you carry?", a: "We carry Twin, Full (Double), Queen, King, and California King in most of our bedsheet collections. Specific sizes available are listed on each product page." },
  { q: "Do you ship outside Canada?", a: "Currently we only ship within Canada. We hope to expand to the US and internationally soon — subscribe to our newsletter to be the first to know!" },
  { q: "Are your products made in Canada?", a: "Yes! Every Khwab product is manufactured in our facility in the Greater Toronto Area. We've been Canadian-made since 1999." },
  { q: "Can I use a promo code?", a: "Yes! Enter your promo code in the cart before proceeding to checkout. New subscribers receive a 10% discount code via email when they join our newsletter." },
  { q: "How do I track my order?", a: "Once your order ships, you'll receive an email with your tracking number. You can also view order status in your account under 'My Orders'." },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#F7F3EE] last:border-0">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left"
        aria-expanded={open}>
        <span className="text-sm font-inter font-normal text-[#2A2A2A] pr-4">{q}</span>
        <ChevronDown size={16} className={cn("text-[#1A1410] shrink-0 transition-transform duration-200", open && "rotate-180")} />
      </button>
      {open && (
        <div className="pb-5 text-sm font-inter font-light text-[#8B8B8B] leading-relaxed pr-6">{a}</div>
      )}
    </div>
  );
}

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <div className="bg-[#F7F3EE]/30 border-b border-[#F7F3EE] py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="font-playfair font-semibold text-[#1A1410] text-3xl"
            style={{ fontFamily: "var(--font-cormorant)" }}>Frequently Asked Questions</h1>
          <p className="text-[#8B8B8B] font-inter font-light mt-2">Everything you need to know about Khwab.</p>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl border border-[#F7F3EE]/60 px-6 sm:px-8">
          {faqs.map((faq) => <FaqItem key={faq.q} {...faq} />)}
        </div>
        <div className="mt-8 text-center">
          <p className="text-sm font-inter font-light text-[#8B8B8B]">
            Still have questions?{" "}
            <a href="/contact" className="text-[#1A1410] hover:underline">Contact our team →</a>
          </p>
        </div>
      </div>
    </div>
  );
}
