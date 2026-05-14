import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
      select: { id: true, email: true, name: true },
    });

    // Welcome email
    try {
      const { resend, FROM_EMAIL } = await import("@/lib/resend");
      await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: "Welcome to Khwab!",
        html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto"><div style="background:#4A2C5A;padding:32px;text-align:center"><h1 style="color:white;font-family:Georgia,serif;margin:0">Khwab</h1></div><div style="padding:32px"><h2 style="color:#4A2C5A;font-family:Georgia,serif">Welcome, ${name ?? "there"}!</h2><p>Your account has been created. Start exploring our premium home textiles.</p><a href="${process.env.NEXTAUTH_URL}/shop" style="display:inline-block;margin-top:16px;padding:12px 28px;background:#4A2C5A;color:white;border-radius:8px;text-decoration:none">Shop Now</a></div></div>`,
      });
    } catch { /* non-fatal */ }

    return NextResponse.json({ data: user }, { status: 201 });
  } catch (error) {
    console.error("POST /api/auth/register error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
