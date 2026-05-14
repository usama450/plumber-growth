import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const q = searchParams.get("q");
    const category = searchParams.getAll("category");
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const page = parseInt(searchParams.get("page") ?? "1");
    const sort = searchParams.get("sort") ?? "newest";
    const maxPrice = parseFloat(searchParams.get("maxPrice") ?? "99999");
    const featured = searchParams.get("featured") === "true";
    const sale = searchParams.get("sale") === "true";
    const colors = searchParams.getAll("color");
    const sizes = searchParams.getAll("size");

    const where: Prisma.ProductWhereInput = {
      isActive: true,
      price: { lte: maxPrice },
      ...(featured && { isFeatured: true }),
      ...(sale && { isOnSale: true }),
      ...(category.length > 0 && { category: { slug: { in: category } } }),
      ...(colors.length > 0 && { variants: { some: { color: { in: colors } } } }),
      ...(sizes.length > 0 && { variants: { some: { size: { in: sizes } } } }),
      ...(q && {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
        ],
      }),
    };

    const orderBy: Prisma.ProductOrderByWithRelationInput =
      sort === "price_asc" ? { price: "asc" }
      : sort === "price_desc" ? { price: "desc" }
      : sort === "best_selling" ? { orderItems: { _count: "desc" } }
      : { createdAt: "desc" };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where, orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          images: { orderBy: { displayOrder: "asc" }, take: 2 },
          variants: { select: { size: true, color: true, stockQuantity: true } },
          category: { select: { name: true, slug: true } },
          _count: { select: { reviews: true } },
          reviews: { select: { rating: true } },
        },
      }),
      prisma.product.count({ where }),
    ]);

    const data = products.map((p) => {
      const avgRating = p.reviews.length > 0
        ? p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length : 0;
      return {
        id: p.id, name: p.name, slug: p.slug,
        price: Number(p.price), comparePrice: p.comparePrice ? Number(p.comparePrice) : null,
        isOnSale: p.isOnSale, isFeatured: p.isFeatured,
        images: p.images, category: p.category, variants: p.variants,
        _count: p._count, avgRating: Math.round(avgRating * 10) / 10,
      };
    });

    return NextResponse.json({ data, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { auth } = await import("@/lib/auth");
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, slug, description, price, comparePrice, categoryId, material,
      careInstructions, threadCount, isActive, isFeatured, isOnSale, images, variants } = body;

    const product = await prisma.product.create({
      data: {
        name, slug, description,
        price, comparePrice: comparePrice ?? null,
        categoryId, material, careInstructions,
        threadCount: threadCount ?? null,
        isActive: isActive ?? true,
        isFeatured: isFeatured ?? false,
        isOnSale: isOnSale ?? false,
        images: { createMany: { data: images ?? [] } },
        variants: { createMany: { data: variants ?? [] } },
      },
    });

    return NextResponse.json({ data: product }, { status: 201 });
  } catch (error) {
    console.error("POST /api/products error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
