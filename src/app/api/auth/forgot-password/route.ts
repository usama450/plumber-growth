import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { resend, FROM_EMAIL } from "@/lib/resend";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });

    // Always return 200 to prevent user enumeration
    if (!user || !user.password) {
      return NextResponse.json({ ok: true });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    await prisma.verificationToken.upsert({
      where: { identifier_token: { identifier: email, token } },
      update: { token, expires },
      create: { identifier: email, token, expires },
    });

    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Reset your Khwab password",
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#2A2A2A">
          <div style="background:#4A2C5A;padding:32px;text-align:center">
            <h1 style="color:white;font-family:Georgia,serif;margin:0;font-size:28px">Khwab</h1>
            <p style="color:#E8DFF5;margin:8px 0 0;font-size:12px;letter-spacing:0.2em;text-transform:uppercase">Home Textiles</p>
          </div>
          <div style="padding:32px">
            <h2 style="color:#4A2C5A;font-family:Georgia,serif">Reset your password</h2>
            <p>Hi ${user.name ?? "there"},</p>
            <p>We received a request to reset your password. Click the button below to create a new one.</p>
            <p style="text-align:center;margin:32px 0">
              <a href="${resetUrl}"
                style="display:inline-block;padding:14px 32px;background:#4A2C5A;color:white;border-radius:8px;text-decoration:none;font-size:14px">
                Reset Password
              </a>
            </p>
            <p style="color:#8B8B8B;font-size:13px">This link expires in 1 hour. If you didn&apos;t request this, you can safely ignore this email.</p>
          </div>
          <div style="background:#D4C5B0;padding:20px;text-align:center;font-size:12px">
            <p>© ${new Date().getFullYear()} Khwab Home Textiles</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("forgot-password error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
