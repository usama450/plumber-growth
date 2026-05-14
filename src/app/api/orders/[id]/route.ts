import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true, user: { select: { name: true, email: true } } },
    });

    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    if (session.user.role !== "ADMIN" && order.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json({ data: order });
  } catch (error) {
    console.error("GET /api/orders/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    const { status } = await req.json();
    const validStatuses = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    const order = await prisma.order.update({ where: { id }, data: { status } });
    return NextResponse.json({ order });
  } catch (error) {
    console.error("PATCH /api/orders/[id] error:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    const body = await req.json();
    const { status, trackingNumber, notes } = body;

    const order = await prisma.order.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(trackingNumber !== undefined && { trackingNumber }),
        ...(notes !== undefined && { notes }),
        ...(status === "SHIPPED" && { shippedAt: new Date() }),
        ...(status === "DELIVERED" && { deliveredAt: new Date() }),
      },
    });

    // Send shipping notification if tracking number was added
    if (trackingNumber && status === "SHIPPED") {
      try {
        const { resend, FROM_EMAIL } = await import("@/lib/resend");
        const fullOrder = await prisma.order.findUnique({
          where: { id },
          include: { user: { select: { email: true, name: true } } },
        });
        if (fullOrder?.user.email) {
          await resend.emails.send({
            from: FROM_EMAIL,
            to: fullOrder.user.email,
            subject: `Your Khwab order has shipped! — ${fullOrder.orderNumber}`,
            html: `
              <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
                <div style="background:#4A2C5A;padding:32px;text-align:center">
                  <h1 style="color:white;font-family:Georgia,serif;margin:0">Khwab</h1>
                </div>
                <div style="padding:32px">
                  <h2 style="color:#4A2C5A;font-family:Georgia,serif">Your order is on its way!</h2>
                  <p>Hi ${fullOrder.user.name ?? "there"},</p>
                  <p>Great news — order <strong>${fullOrder.orderNumber}</strong> has shipped.</p>
                  <p>Tracking number: <strong>${trackingNumber}</strong></p>
                  <p>Estimated delivery: 3-7 business days.</p>
                </div>
              </div>
            `,
          });
        }
      } catch (emailError) {
        console.error("Shipping notification email error:", emailError);
      }
    }

    return NextResponse.json({ data: order });
  } catch (error) {
    console.error("PUT /api/orders/[id] error:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
