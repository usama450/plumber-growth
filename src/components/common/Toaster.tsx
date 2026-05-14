"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "info";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

// Simple event bus
const listeners: ((toast: Toast) => void)[] = [];

export function toast(message: string, type: ToastType = "info") {
  const t: Toast = { id: Math.random().toString(36).slice(2), message, type };
  listeners.forEach((fn) => fn(t));
}

toast.success = (message: string) => toast(message, "success");
toast.error = (message: string) => toast(message, "error");
toast.info = (message: string) => toast(message, "info");

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const handler = (t: Toast) => {
      setToasts((prev) => [...prev, t]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((x) => x.id !== t.id));
      }, 4000);
    };
    listeners.push(handler);
    return () => {
      const idx = listeners.indexOf(handler);
      if (idx > -1) listeners.splice(idx, 1);
    };
  }, []);

  const icons = {
    success: <CheckCircle2 size={18} className="text-[#6B8E4E] shrink-0" />,
    error: <XCircle size={18} className="text-[#B85450] shrink-0" />,
    info: <Info size={18} className="text-[#1A1410] shrink-0" />,
  };

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="fixed bottom-4 right-4 z-[200] flex flex-col gap-2 pointer-events-none"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg pointer-events-auto",
            "bg-white border border-[#F7F3EE] max-w-[340px] animate-in slide-in-from-right-4 fade-in duration-300",
            "font-inter text-sm font-light text-[#2A2A2A]"
          )}
          role="alert"
        >
          {icons[t.type]}
          <span className="flex-1">{t.message}</span>
          <button
            onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
            className="text-[#8B8B8B] hover:text-[#2A2A2A] transition-colors ml-1"
            aria-label="Dismiss"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
