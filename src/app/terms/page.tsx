import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="font-playfair font-semibold text-[#4A2C5A] text-3xl mb-2"
          style={{ fontFamily: "var(--font-playfair)" }}>Terms of Service</h1>
        <p className="text-sm text-[#8B8B8B] font-inter font-light mb-10">Last updated: {new Date().toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" })}</p>
        <div className="space-y-6 font-inter font-light text-[#2A2A2A] leading-relaxed text-sm">
          <p>By using the Khwab website (khwab.ca) and purchasing our products, you agree to these Terms of Service. Khwab Home Textiles is operated from Ontario, Canada and these terms are governed by the laws of Ontario.</p>
          {[
            { title: "Use of Website", text: "You must be 18+ to make purchases. You agree not to use our site for any unlawful purpose or in a way that infringes the rights of others." },
            { title: "Product Pricing and Availability", text: "Prices are in Canadian dollars (CAD) and include applicable taxes at checkout. We reserve the right to change prices at any time. Product availability is not guaranteed." },
            { title: "Orders and Payment", text: "All orders are subject to acceptance. We process payments through Stripe. By placing an order, you represent that all payment information is accurate." },
            { title: "Intellectual Property", text: "All content on this website — including text, images, logos, and design — is the property of Khwab Home Textiles and may not be reproduced without permission." },
            { title: "Limitation of Liability", text: "Khwab Home Textiles shall not be liable for indirect, incidental, or consequential damages arising from your use of this website or our products, to the maximum extent permitted by Canadian law." },
            { title: "Changes to Terms", text: "We may update these terms at any time. Continued use of the site after changes constitutes acceptance of the new terms." },
            { title: "Contact", text: "Questions about these terms? Contact us at legal@khwab.ca." },
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
