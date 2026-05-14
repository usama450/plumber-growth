import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import type { Metadata } from "next";
import { AdminOrderActions } from "./AdminOrderActions";

export const metadata: Metadata = { title: "Order Detail — Admin" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/login");

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
      user: { select: { id: true, name: true, email: true } },
    },
  });

  if (!order) notFound();

  const addr = order.shippingAddress as {
    fullName: string; streetAddress: string; addressLine2?: string | null;
    city: string; province: string; postalCode: string; country: string;
  } | null;

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-50 text-yellow-700",
    PAID: "bg-blue-50 text-blue-700",
    PROCESSING: "bg-purple-50 text-purple-700",
    SHIPPED: "bg-[#E8DFF5] text-[#4A2C5A]",
    DELIVERED: "bg-[#6B8E4E]/10 text-[#6B8E4E]",
    CANCELLED: "bg-[#B85450]/10 text-[#B85450]",
    REFUNDED: "bg-gray-50 text-gray-600",
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-2 mb-8 flex-wrap text-sm font-inter font-light">
          <Link href="/admin" className="text-[#8B8B8B] hover:text-[#4A2C5A]">Dashboard</Link>
          <span className="text-[#D4C5B0]">/</span>
          <Link href="/admin/orders" className="text-[#8B8B8B] hover:text-[#4A2C5A]">Orders</Link>
          <span className="text-[#D4C5B0]">/</span>
          <span className="text-[#2A2A2A]">{order.orderNumber}</span>
        </div>

        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="font-playfair font-semibold text-[#4A2C5A] text-3xl"
              style={{ fontFamily: "var(--font-playfair)" }}>{order.orderNumber}</h1>
            <p className="text-sm font-inter font-light text-[#8B8B8B] mt-1">
              {new Date(order.createdAt).toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
          <AdminOrderActions orderId={order.id} currentStatus={order.status} statusColors={statusColors} />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Items */}
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-2xl border border-[#E8DFF5]/60 overflow-hidden">
              <div className="px-6 py-4 border-b border-[#E8DFF5]">
                <h2 className="font-playfair font-semibold text-[#4A2C5A]"
                  style={{ fontFamily: "var(--font-playfair)" }}>Items ({order.items.length})</h2>
              </div>
              <div className="divide-y divide-[#E8DFF5]">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4 px-6 py-4">
                    {item.productImage ? (
                      <img src={item.productImage} alt={item.productName}
                        className="w-14 h-14 rounded-lg object-cover border border-[#E8DFF5] shrink-0" />
                    ) : (
                      <div className="w-14 h-14 rounded-lg bg-[#E8DFF5]/40 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-inter font-normal text-[#2A2A2A]">{item.productName}</p>
                      {(item.size || item.color) && (
                        <p className="text-xs font-inter font-light text-[#8B8B8B] mt-0.5">
                          {[item.size, item.color].filter(Boolean).join(" · ")}
                        </p>
                      )}
                      <p className="text-xs font-inter font-light text-[#8B8B8B]">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-inter font-normal text-[#4A2C5A]">
                        {formatPrice(Number(item.priceAtPurchase) * item.quantity)}
                      </p>
                      <p className="text-xs font-inter font-light text-[#8B8B8B]">
                        {formatPrice(Number(item.priceAtPurchase))} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer */}
            <div className="bg-white rounded-2xl border border-[#E8DFF5]/60 p-5">
              <h2 className="font-playfair font-semibold text-[#4A2C5A] mb-3"
                style={{ fontFamily: "var(--font-playfair)" }}>Customer</h2>
              <p className="text-sm font-inter font-normal text-[#2A2A2A]">{order.user.name ?? "—"}</p>
              <p className="text-sm font-inter font-light text-[#8B8B8B]">{order.user.email}</p>
              <Link href={`/admin/customers?id=${order.user.id}`}
                className="text-xs font-inter font-light text-[#4A2C5A] hover:underline mt-1 inline-block">
                View customer →
              </Link>
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-[#E8DFF5]/60 p-5">
              <h2 className="font-playfair font-semibold text-[#4A2C5A] mb-4"
                style={{ fontFamily: "var(--font-playfair)" }}>Summary</h2>
              <div className="space-y-2 text-sm font-inter font-light">
                <div className="flex justify-between">
                  <span className="text-[#8B8B8B]">Subtotal</span>
                  <span>{formatPrice(Number(order.subtotal))}</span>
                </div>
                {Number(order.discount) > 0 && (
                  <div className="flex justify-between text-[#6B8E4E]">
                    <span>Discount{order.couponCode ? ` (${order.couponCode})` : ""}</span>
                    <span>−{formatPrice(Number(order.discount))}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[#8B8B8B]">Shipping</span>
                  <span>{Number(order.shippingCost) === 0 ? "Free" : formatPrice(Number(order.shippingCost))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8B8B8B]">Tax</span>
                  <span>{formatPrice(Number(order.tax))}</span>
                </div>
                <div className="flex justify-between font-semibold text-[#4A2C5A] pt-2 border-t border-[#E8DFF5]">
                  <span>Total</span>
                  <span>{formatPrice(Number(order.total))}</span>
                </div>
              </div>
            </div>

            {addr && (
              <div className="bg-white rounded-2xl border border-[#E8DFF5]/60 p-5">
                <h2 className="font-playfair font-semibold text-[#4A2C5A] mb-3"
                  style={{ fontFamily: "var(--font-playfair)" }}>Ship To</h2>
                <div className="text-sm font-inter font-light text-[#8B8B8B] space-y-0.5">
                  <p className="text-[#2A2A2A] font-normal">{addr.fullName}</p>
                  <p>{addr.streetAddress}</p>
                  {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                  <p>{addr.city}, {addr.province} {addr.postalCode}</p>
                  <p>{addr.country}</p>
                </div>
              </div>
            )}

            {order.stripePaymentIntentId && (
              <div className="bg-white rounded-2xl border border-[#E8DFF5]/60 p-5">
                <h2 className="font-playfair font-semibold text-[#4A2C5A] mb-2"
                  style={{ fontFamily: "var(--font-playfair)" }}>Payment</h2>
                <p className="text-xs font-inter font-light text-[#8B8B8B] break-all">{order.stripePaymentIntentId}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
