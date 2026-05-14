import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Order Details" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();
  if (!session) redirect(`/login?callbackUrl=/account/orders/${id}`);

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
      user: { select: { name: true, email: true } },
    },
  });

  if (!order || order.userId !== session.user.id) notFound();

  const addr = order.shippingAddress as {
    fullName: string; streetAddress: string; addressLine2?: string | null;
    city: string; province: string; postalCode: string; country: string;
  } | null;

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-50 text-yellow-700",
    PAID: "bg-blue-50 text-blue-700",
    PROCESSING: "bg-purple-50 text-purple-700",
    SHIPPED: "bg-[#3A1A5C] text-[#E7D3A8]",
    DELIVERED: "bg-[#6B8E4E]/10 text-[#6B8E4E]",
    CANCELLED: "bg-[#B85450]/10 text-[#B85450]",
    REFUNDED: "bg-gray-50 text-gray-600",
  };

  const statusMessages: Record<string, string> = {
    PENDING: "Your order is pending payment confirmation.",
    PAID: "Payment received — your order is being prepared.",
    PROCESSING: "Your order is being packed.",
    SHIPPED: "Your order is on its way!",
    DELIVERED: "Your order has been delivered.",
    CANCELLED: "This order was cancelled.",
    REFUNDED: "This order has been refunded.",
  };

  return (
    <div className="min-h-screen bg-[#050507]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 flex-wrap">
          <Link href="/account" className="text-sm font-inter font-light text-[#A8A4B0] hover:text-[#E7D3A8] transition-colors">My Account</Link>
          <span className="text-[#3A1A5C]">/</span>
          <Link href="/account/orders" className="text-sm font-inter font-light text-[#A8A4B0] hover:text-[#E7D3A8] transition-colors">Orders</Link>
          <span className="text-[#3A1A5C]">/</span>
          <span className="text-sm font-inter font-light text-[#F8F4EE]">{order.orderNumber}</span>
        </div>

        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="font-semibold text-[#E7D3A8] text-3xl"
              style={{ fontFamily: "var(--font-playfair)" }}>{order.orderNumber}</h1>
            <p className="text-sm font-inter font-light text-[#A8A4B0] mt-1">
              Placed on {new Date(order.createdAt).toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          <span className={`text-sm px-4 py-2 rounded-full font-inter font-light ${statusColors[order.status] ?? "bg-gray-50 text-gray-600"}`}>
            {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
          </span>
        </div>

        {/* Status message */}
        {statusMessages[order.status] && (
          <div className="mb-6 p-4 bg-[#150820] rounded-xl border border-[#3A1A5C] text-sm font-inter font-light text-[#F8F4EE]">
            {statusMessages[order.status]}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Items */}
          <div className="lg:col-span-2 bg-[#150820] rounded-2xl border border-[#3A1A5C] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#3A1A5C]">
              <h2 className="font-semibold text-[#E7D3A8]"
                style={{ fontFamily: "var(--font-playfair)" }}>Items Ordered</h2>
            </div>
            <div className="divide-y divide-[#3A1A5C]">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 px-6 py-4">
                  {item.productImage ? (
                    <img src={item.productImage} alt={item.productName}
                      className="w-16 h-16 rounded-lg object-cover border border-[#3A1A5C] shrink-0" />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-[#3A1A5C]/40 shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-inter font-normal text-[#F8F4EE]">{item.productName}</p>
                    {(item.size || item.color) && (
                      <p className="text-xs font-inter font-light text-[#A8A4B0] mt-0.5">
                        {[item.size, item.color].filter(Boolean).join(" · ")}
                      </p>
                    )}
                    <p className="text-xs font-inter font-light text-[#A8A4B0] mt-0.5">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-inter font-normal text-[#E7D3A8] shrink-0">
                    {formatPrice(Number(item.priceAtPurchase) * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Summary + Address */}
          <div className="space-y-5">
            <div className="bg-[#150820] rounded-2xl border border-[#3A1A5C] p-5">
              <h2 className="font-semibold text-[#E7D3A8] mb-4"
                style={{ fontFamily: "var(--font-playfair)" }}>Order Summary</h2>
              <div className="space-y-2 text-sm font-inter font-light">
                <div className="flex justify-between">
                  <span className="text-[#A8A4B0]">Subtotal</span>
                  <span className="text-[#F8F4EE]">{formatPrice(Number(order.subtotal))}</span>
                </div>
                {Number(order.discount) > 0 && (
                  <div className="flex justify-between text-[#6B8E4E]">
                    <span>Discount{order.couponCode ? ` (${order.couponCode})` : ""}</span>
                    <span>−{formatPrice(Number(order.discount))}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[#A8A4B0]">Shipping</span>
                  <span className="text-[#F8F4EE]">{Number(order.shippingCost) === 0 ? "Free" : formatPrice(Number(order.shippingCost))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A8A4B0]">Tax</span>
                  <span className="text-[#F8F4EE]">{formatPrice(Number(order.tax))}</span>
                </div>
                <div className="flex justify-between font-semibold text-[#E7D3A8] pt-2 border-t border-[#3A1A5C]">
                  <span>Total</span>
                  <span>{formatPrice(Number(order.total))} CAD</span>
                </div>
              </div>
            </div>

            {addr && (
              <div className="bg-[#150820] rounded-2xl border border-[#3A1A5C] p-5">
                <h2 className="font-semibold text-[#E7D3A8] mb-3"
                  style={{ fontFamily: "var(--font-playfair)" }}>Ship To</h2>
                <div className="text-sm font-inter font-light text-[#A8A4B0] space-y-0.5">
                  <p className="text-[#F8F4EE] font-normal">{addr.fullName}</p>
                  <p>{addr.streetAddress}</p>
                  {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                  <p>{addr.city}, {addr.province} {addr.postalCode}</p>
                  <p>{addr.country}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
