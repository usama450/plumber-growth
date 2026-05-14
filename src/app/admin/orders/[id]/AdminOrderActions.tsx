"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const ALL_STATUSES = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"];

interface Props {
  orderId: string;
  currentStatus: string;
  statusColors: Record<string, string>;
}

export function AdminOrderActions({ orderId, currentStatus, statusColors }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [saving, setSaving] = useState(false);

  const handleUpdate = async () => {
    if (status === currentStatus) return;
    setSaving(true);
    await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setSaving(false);
    router.refresh();
  };

  return (
    <div className="flex items-center gap-3">
      <span className={`text-sm px-3 py-1.5 rounded-full font-inter font-light ${statusColors[currentStatus] ?? "bg-gray-50 text-gray-600"}`}>
        {currentStatus}
      </span>
      <select value={status} onChange={(e) => setStatus(e.target.value)}
        className="px-3 py-2 rounded-lg border border-[#D4C5B0] bg-white text-sm font-inter font-light text-[#2A2A2A] focus:outline-none focus:ring-2 focus:ring-[#C4992E]">
        {ALL_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
      <button onClick={handleUpdate} disabled={saving || status === currentStatus}
        className="px-4 py-2 bg-[#1A1410] text-white text-sm font-inter font-normal rounded-lg hover:bg-[#5B3A6B] transition-colors disabled:opacity-50 flex items-center gap-2">
        {saving && <Loader2 size={14} className="animate-spin" />}
        Update
      </button>
    </div>
  );
}
