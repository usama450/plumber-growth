import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });
    if (existing?.isActive) {
      return NextResponse.json({ message: "Already subscribed" });
    }

    await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: { isActive: true },
      create: { email },
    });

    // Send welcome email
    try {
      const { resend, FROM_EMAIL } = await import("@/lib/resend");
      await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: "Welcome to Khwab — Here's your 10% discount code",
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#2A2A2A">
            <div style="background:#4A2C5A;padding:32px;text-align:center">
              <h1 style="color:white;font-family:Georgia,serif;margin:0;font-size:28px">Khwab</h1>
              <p style="color:#E8DFF5;margin:8px 0 0;font-size:12px;letter-spacing:0.2em;text-transform:uppercase">Home Textiles</p>
            </div>
            <div style="padding:32px;text-align:center">
              <h2 style="color:#4A2C5A;font-family:Georgia,serif">Welcome to the Khwab family!</h2>
              <p>Thank you for subscribing. Here's your exclusive discount code:</p>
              <div style="background:#FAF7F2;border:2px dashed #B8A4D4;border-radius:12px;padding:20px;margin:24px 0;font-size:24px;letter-spacing:0.2em;color:#4A2C5A;font-weight:600">
                WELCOME10
              </div>
              <p style="color:#8B8B8B;font-size:14px">Use at checkout for 10% off your first order. Valid for 30 days.</p>
              <a href="${process.env.NEXTAUTH_URL}/shop"
                style="display:inline-block;margin-top:16px;padding:14px 32px;background:#4A2C5A;color:white;border-radius:8px;text-decoration:none;font-size:14px">
                Shop Now
              </a>
            </div>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("Newsletter welcome email error:", emailError);
    }

    return NextResponse.json({ message: "Subscribed successfully" });
  } catch (error) {
    console.error("POST /api/newsletter error:", error);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
