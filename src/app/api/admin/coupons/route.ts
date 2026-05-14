import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { code, description, discountType, discountValue, minimumPurchase, usageLimit, expiresAt } = body;

    if (!code || !discountType || !discountValue) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existing = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });
    if (existing) {
      return NextResponse.json({ error: "A coupon with this code already exists" }, { status: 409 });
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase(),
        description: description || null,
        discountType,
        discountValue,
        minimumPurchase: minimumPurchase ?? null,
        usageLimit: usageLimit ?? null,
        isActive: true,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });

    return NextResponse.json({ coupon }, { status: 201 });
  } catch (err) {
    console.error("POST /api/admin/coupons error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
