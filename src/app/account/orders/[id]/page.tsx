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
    PROCESSING: "bg-[#F4F0EB] text-[#5A554F]",
    SHIPPED: "bg-[#2C4A35]/10 text-[#2C4A35]",
    DELIVERED: "bg-[#2C4A35]/10 text-[#2C4A35]",
    CANCELLED: "bg-[#C0392B]/10 text-[#C0392B]",
    REFUNDED: "bg-[#F4F0EB] text-[#7A746D]",
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
    <div className="min-h-screen bg-[#F9F7F4]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 flex-wrap">
          <Link href="/account" className="text-sm font-inter font-light text-[#7A746D] hover:text-[#1A1714] transition-colors">My Account</Link>
          <span className="text-[#B5AFA8]">/</span>
          <Link href="/account/orders" className="text-sm font-inter font-light text-[#7A746D] hover:text-[#1A1714] transition-colors">Orders</Link>
          <span className="text-[#B5AFA8]">/</span>
          <span className="text-sm font-inter font-light text-[#1A1714]">{order.orderNumber}</span>
        </div>

        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="font-semibold text-[#1A1714] text-3xl"
              style={{ fontFamily: "var(--font-playfair)" }}>{order.orderNumber}</h1>
            <p className="text-sm font-inter font-light text-[#7A746D] mt-1">
              Placed on {new Date(order.createdAt).toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          <span className={`text-sm px-4 py-2 font-inter font-light ${statusColors[order.status] ?? "bg-[#F4F0EB] text-[#7A746D]"}`}>
            {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
          </span>
        </div>

        {/* Status message */}
        {statusMessages[order.status] && (
          <div className="mb-6 p-4 bg-white border border-[#E2DDD7] text-sm font-inter font-light text-[#5A554F]">
            {statusMessages[order.status]}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Items */}
          <div className="lg:col-span-2 bg-white border border-[#E2DDD7] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E2DDD7]">
              <h2 className="font-semibold text-[#1A1714]"
                style={{ fontFamily: "var(--font-playfair)" }}>Items Ordered</h2>
            </div>
            <div className="divide-y divide-[#E2DDD7]">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 px-6 py-4">
                  {item.productImage ? (
                    <img src={item.productImage} alt={item.productName}
                      className="w-16 h-16 object-cover border border-[#E2DDD7] shrink-0" />
                  ) : (
                    <div className="w-16 h-16 bg-[#F4F0EB] shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-inter font-normal text-[#1A1714]">{item.productName}</p>
                    {(item.size || item.color) && (
                      <p className="text-xs font-inter font-light text-[#7A746D] mt-0.5">
                        {[item.size, item.color].filter(Boolean).join(" · ")}
                      </p>
                    )}
                    <p className="text-xs font-inter font-light text-[#7A746D] mt-0.5">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-inter font-normal text-[#1A1714] shrink-0">
                    {formatPrice(Number(item.priceAtPurchase) * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Summary + Address */}
          <div className="space-y-5">
            <div className="bg-white border border-[#E2DDD7] p-5">
              <h2 className="font-semibold text-[#1A1714] mb-4"
                style={{ fontFamily: "var(--font-playfair)" }}>Order Summary</h2>
              <div className="space-y-2 text-sm font-inter font-light">
                <div className="flex justify-between">
                  <span className="text-[#7A746D]">Subtotal</span>
                  <span className="text-[#1A1714]">{formatPrice(Number(order.subtotal))}</span>
                </div>
                {Number(order.discount) > 0 && (
                  <div className="flex justify-between text-[#2C4A35]">
                    <span>Discount{order.couponCode ? ` (${order.couponCode})` : ""}</span>
                    <span>−{formatPrice(Number(order.discount))}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[#7A746D]">Shipping</span>
                  <span className="text-[#1A1714]">{Number(order.shippingCost) === 0 ? "Free" : formatPrice(Number(order.shippingCost))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7A746D]">Tax</span>
                  <span className="text-[#1A1714]">{formatPrice(Number(order.tax))}</span>
                </div>
                <div className="flex justify-between font-semibold text-[#1A1714] pt-2 border-t border-[#E2DDD7]">
                  <span>Total</span>
                  <span>{formatPrice(Number(order.total))} CAD</span>
                </div>
              </div>
            </div>

            {addr && (
              <div className="bg-white border border-[#E2DDD7] p-5">
                <h2 className="font-semibold text-[#1A1714] mb-3"
                  style={{ fontFamily: "var(--font-playfair)" }}>Ship To</h2>
                <div className="text-sm font-inter font-light text-[#5A554F] space-y-0.5">
                  <p className="text-[#1A1714] font-normal">{addr.fullName}</p>
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
