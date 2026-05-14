"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("khwab-cookies-accepted");
    if (!accepted) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem("khwab-cookies-accepted", "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-[150] bg-white border-t border-[#F7F3EE] shadow-[0_-4px_24px_rgba(74,44,90,0.08)] p-4 sm:p-5"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="flex-1 text-sm font-inter font-light text-[#2A2A2A]">
          We use cookies to enhance your experience. By continuing to browse, you consent to our use of cookies.{" "}
          <Link href="/privacy" className="text-[#1A1410] underline hover:no-underline">
            Privacy Policy
          </Link>
        </p>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setVisible(false)}
            className="text-sm font-inter text-[#8B8B8B] hover:text-[#2A2A2A] transition-colors"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="px-5 py-2 bg-[#1A1410] text-white text-sm font-inter font-normal rounded-lg hover:bg-[#5B3A6B] transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
