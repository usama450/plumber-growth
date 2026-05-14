import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { token, email, password } = await req.json();
    if (!token || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password too short" }, { status: 400 });
    }

    const record = await prisma.verificationToken.findFirst({
      where: { identifier: email, token },
    });

    if (!record) {
      return NextResponse.json({ error: "Invalid or expired reset link" }, { status: 400 });
    }
    if (record.expires < new Date()) {
      await prisma.verificationToken.delete({ where: { identifier_token: { identifier: email, token } } });
      return NextResponse.json({ error: "Reset link has expired" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 12);
    await prisma.user.update({
      where: { email },
      data: { password: hashed },
    });

    await prisma.verificationToken.delete({
      where: { identifier_token: { identifier: email, token } },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("reset-password error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
