import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import type { Metadata } from "next";
import { AdminCouponsClient } from "./AdminCouponsClient";

export const metadata: Metadata = { title: "Coupons — Admin" };

export default async function AdminCouponsPage() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/login");

  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-sm font-inter font-light text-[#8B8B8B] hover:text-[#1A1410]">← Dashboard</Link>
            <h1 className="font-playfair font-semibold text-[#1A1410] text-3xl"
              style={{ fontFamily: "var(--font-cormorant)" }}>Coupons</h1>
          </div>
        </div>
        <AdminCouponsClient initialCoupons={coupons.map((c) => ({
          id: c.id, code: c.code, description: c.description,
          discountType: c.discountType, discountValue: Number(c.discountValue),
          minimumPurchase: c.minimumPurchase ? Number(c.minimumPurchase) : null,
          usageLimit: c.usageLimit, usageCount: c.timesUsed,
          isActive: c.isActive, expiresAt: c.expiresAt?.toISOString() ?? null,
        }))} />
      </div>
    </div>
  );
}
