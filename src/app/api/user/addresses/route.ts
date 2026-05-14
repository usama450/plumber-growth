import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const addresses = await prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: [{ isDefault: "desc" }, { id: "desc" }],
  });

  return NextResponse.json({ addresses });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { fullName, streetAddress, addressLine2, city, province, postalCode, country, isDefault } = body;

  if (!fullName || !streetAddress || !city || !province || !postalCode) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (isDefault) {
    await prisma.address.updateMany({
      where: { userId: session.user.id },
      data: { isDefault: false },
    });
  }

  const address = await prisma.address.create({
    data: {
      userId: session.user.id,
      fullName, streetAddress,
      addressLine2: addressLine2 || null,
      city, province,
      postalCode, country: country ?? "CA",
      isDefault: Boolean(isDefault),
    },
  });

  return NextResponse.json({ address }, { status: 201 });
}
