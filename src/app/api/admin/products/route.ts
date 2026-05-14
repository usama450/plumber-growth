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
    const {
      name, slug, description, price, comparePrice, categoryId,
      material, careInstructions, threadCount, isActive, isFeatured, isOnSale,
      images = [], variants = [],
    } = body;

    if (!name || !slug || !description || !price || !categoryId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "A product with this slug already exists" }, { status: 409 });
    }

    const product = await prisma.product.create({
      data: {
        name, slug, description, price, comparePrice: comparePrice ?? null,
        categoryId, material: material || null,
        careInstructions: careInstructions || null,
        threadCount: threadCount ?? null,
        isActive: Boolean(isActive), isFeatured: Boolean(isFeatured), isOnSale: Boolean(isOnSale),
        images: {
          create: images.map((img: { url: string; alt: string }, i: number) => ({
            imageUrl: img.url,
            altText: img.alt || name,
            displayOrder: i,
          })),
        },
        variants: {
          create: variants.map((v: { size: string; color: string; sku: string; stockQuantity: number }) => ({
            size: v.size || null,
            color: v.color || null,
            sku: v.sku,
            stockQuantity: v.stockQuantity ?? 0,
          })),
        },
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (err) {
    console.error("POST /api/admin/products error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
