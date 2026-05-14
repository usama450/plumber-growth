import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { resend, FROM_EMAIL } from "@/lib/resend";

function generateCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let suffix = "";
  for (let i = 0; i < 6; i++) {
    suffix += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `WELCOME${suffix}`;
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    // Check if already subscribed
    const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });
    if (existing?.isActive) {
      return NextResponse.json({
        success: true,
        message: "Check your email for your discount code!",
      });
    }

    // Upsert subscriber
    await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: { isActive: true },
      create: { email },
    });

    // Generate a unique coupon code
    let code = generateCode();
    // Ensure uniqueness — retry up to 5 times on collision
    for (let attempt = 0; attempt < 5; attempt++) {
      const taken = await prisma.coupon.findUnique({ where: { code } });
      if (!taken) break;
      code = generateCode();
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 90);

    await prisma.coupon.create({
      data: {
        code,
        discountType: "PERCENTAGE",
        discountValue: 10,
        isActive: true,
        minimumPurchase: 0,
        usageLimit: 1,
        expiresAt,
        description: `Newsletter welcome discount for ${email}`,
      },
    });

    // Send welcome email
    try {
      const shopUrl = `${process.env.NEXTAUTH_URL ?? ""}/shop`;
      await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: "Welcome to Khwab — Your exclusive 10% off code",
        html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to Khwab</title>
</head>
<body style="margin:0;padding:0;background-color:#F8F4EE;font-family:'Inter',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8F4EE;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border-radius:8px;overflow:hidden;box-shadow:0 4px 24px rgba(26,10,38,0.10);">

          <!-- Header -->
          <tr>
            <td style="background:#050507;padding:36px 40px;text-align:center;">
              <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:32px;font-weight:700;color:#E7D3A8;letter-spacing:0.05em;">Khwab</h1>
              <p style="margin:8px 0 0;font-size:11px;color:#E8DFF5;letter-spacing:0.3em;text-transform:uppercase;">Home Textiles</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#ffffff;padding:40px 40px 32px;">
              <h2 style="font-family:Georgia,'Times New Roman',serif;font-size:24px;font-weight:700;color:#1A1A1A;margin:0 0 12px;">Welcome to the Khwab family!</h2>
              <p style="font-size:15px;color:#1A1A1A;font-weight:300;line-height:1.6;margin:0 0 24px;">
                Thank you for subscribing. As a welcome gift, here&rsquo;s your exclusive 10% off code:
              </p>

              <!-- Code box -->
              <div style="background:#F5EFE5;border:2px dashed #C9A961;border-radius:8px;padding:24px;text-align:center;margin:0 0 24px;">
                <p style="margin:0 0 8px;font-size:12px;color:#8B8B8B;letter-spacing:0.2em;text-transform:uppercase;">Your discount code</p>
                <p style="margin:0;font-size:28px;font-weight:700;color:#5A189A;letter-spacing:0.25em;font-family:Georgia,'Times New Roman',serif;">${code}</p>
              </div>

              <p style="font-size:13px;color:#8B8B8B;font-weight:300;line-height:1.5;margin:0 0 28px;text-align:center;">
                Valid for 90 days &bull; One use only &bull; No minimum purchase
              </p>

              <!-- CTA button -->
              <div style="text-align:center;">
                <a href="${shopUrl}"
                  style="display:inline-block;background:#5A189A;color:#F8F4EE;text-decoration:none;font-size:13px;font-weight:500;letter-spacing:0.12em;text-transform:uppercase;padding:14px 36px;border-radius:4px;border:1px solid rgba(231,211,168,0.3);">
                  Shop Now
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#F5EFE5;padding:20px 40px;text-align:center;border-top:1px solid #E8DFF5;">
              <p style="margin:0;font-size:12px;color:#8B8B8B;font-weight:300;">
                &copy; ${new Date().getFullYear()} Khwab Home Textiles &bull; Made in Canada
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
        `.trim(),
      });
    } catch (emailError) {
      console.error("Newsletter welcome email error:", emailError);
      // Don't fail the request — subscriber and coupon are already created
    }

    return NextResponse.json({
      success: true,
      message: "Check your email for your discount code!",
    });
  } catch (error) {
    console.error("POST /api/newsletter error:", error);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
