import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "My Orders" };

export default async function OrdersPage() {
  const session = await auth();
  if (!session) redirect("/login?callbackUrl=/account/orders");

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        select: { productName: true, quantity: true, priceAtPurchase: true, productImage: true },
      },
    },
  });

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-50 text-yellow-700",
    PAID: "bg-blue-50 text-blue-700",
    PROCESSING: "bg-[#F4F0EB] text-[#5A554F]",
    SHIPPED: "bg-[#2C4A35]/10 text-[#2C4A35]",
    DELIVERED: "bg-[#2C4A35]/10 text-[#2C4A35]",
    CANCELLED: "bg-[#C0392B]/10 text-[#C0392B]",
    REFUNDED: "bg-[#F4F0EB] text-[#7A746D]",
  };

  return (
    <div className="min-h-screen bg-[#F9F7F4]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/account" className="text-sm font-inter font-light text-[#7A746D] hover:text-[#1A1714] transition-colors">
            ← My Account
          </Link>
          <span className="text-[#B5AFA8]">/</span>
          <h1 className="font-semibold text-[#1A1714] text-3xl"
            style={{ fontFamily: "var(--font-playfair)" }}>My Orders</h1>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white border border-[#E2DDD7] p-12 text-center">
            <p className="text-4xl mb-4">📦</p>
            <p className="font-semibold text-[#1A1714] text-xl mb-2"
              style={{ fontFamily: "var(--font-playfair)" }}>No orders yet</p>
            <p className="text-sm font-inter font-light text-[#5A554F] mb-6">
              When you place an order, it will appear here.
            </p>
            <Link href="/shop"
              className="btn-primary inline-block px-6 py-3">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link key={order.id} href={`/account/orders/${order.id}`}
                className="block bg-white border border-[#E2DDD7] hover:border-[#2C4A35] hover:shadow-[0_2px_12px_rgba(44,74,53,0.06)] transition-all overflow-hidden">
                {/* Order header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2DDD7]">
                  <div>
                    <p className="text-sm font-inter font-normal text-[#1A1714]">{order.orderNumber}</p>
                    <p className="text-xs font-inter font-light text-[#7A746D] mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString("en-CA", {
                        year: "numeric", month: "long", day: "numeric"
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-xs px-3 py-1 font-inter font-light ${statusColors[order.status] ?? "bg-[#F4F0EB] text-[#7A746D]"}`}>
                      {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
                    </span>
                    <span className="text-sm font-inter font-semibold text-[#1A1714]">
                      {formatPrice(Number(order.total))}
                    </span>
                  </div>
                </div>

                {/* Items preview */}
                <div className="px-6 py-4 flex items-center gap-4">
                  <div className="flex -space-x-2">
                    {order.items.slice(0, 3).map((item, i) => (
                      item.productImage ? (
                        <img key={i} src={item.productImage} alt={item.productName}
                          className="w-12 h-12 object-cover border-2 border-white" />
                      ) : (
                        <div key={i} className="w-12 h-12 bg-[#F4F0EB] border-2 border-white flex items-center justify-center">
                          <span className="text-xs text-[#7A746D]">📦</span>
                        </div>
                      )
                    ))}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-inter font-light text-[#1A1714]">
                      {order.items[0].productName}
                      {order.items.length > 1 && <span className="text-[#7A746D]"> + {order.items.length - 1} more</span>}
                    </p>
                    <p className="text-xs font-inter font-light text-[#7A746D] mt-0.5">
                      {order.items.reduce((s, i) => s + i.quantity, 0)} item{order.items.reduce((s, i) => s + i.quantity, 0) !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <span className="text-xs font-inter font-light text-[#2C4A35]">View details →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
