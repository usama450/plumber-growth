import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { code, subtotal } = await req.json();
    if (!code) return NextResponse.json({ error: "Coupon code required" }, { status: 400 });

    const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });
    if (!coupon || !coupon.isActive) {
      return NextResponse.json({ error: "Invalid or expired coupon code" }, { status: 400 });
    }

    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      return NextResponse.json({ error: "This coupon has expired" }, { status: 400 });
    }
    if (coupon.usageLimit && coupon.timesUsed >= coupon.usageLimit) {
      return NextResponse.json({ error: "This coupon has reached its usage limit" }, { status: 400 });
    }
    if (coupon.minimumPurchase && subtotal < Number(coupon.minimumPurchase)) {
      return NextResponse.json({
        error: `Minimum purchase of $${Number(coupon.minimumPurchase).toFixed(2)} required`
      }, { status: 400 });
    }

    const discountAmount = coupon.discountType === "PERCENTAGE"
      ? (subtotal * Number(coupon.discountValue)) / 100
      : Math.min(Number(coupon.discountValue), subtotal);

    return NextResponse.json({
      code: coupon.code,
      description: coupon.description ?? `${coupon.discountValue}${coupon.discountType === "PERCENTAGE" ? "%" : "$"} off`,
      discountAmount: Math.round(discountAmount * 100) / 100,
    });
  } catch (error) {
    console.error("POST /api/coupons/validate error:", error);
    return NextResponse.json({ error: "Failed to validate coupon" }, { status: 500 });
  }
}
