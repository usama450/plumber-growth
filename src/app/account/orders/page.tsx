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
    PROCESSING: "bg-purple-50 text-purple-700",
    SHIPPED: "bg-[#E8DFF5] text-[#4A2C5A]",
    DELIVERED: "bg-[#6B8E4E]/10 text-[#6B8E4E]",
    CANCELLED: "bg-[#B85450]/10 text-[#B85450]",
    REFUNDED: "bg-gray-50 text-gray-600",
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/account" className="text-sm font-inter font-light text-[#8B8B8B] hover:text-[#4A2C5A] transition-colors">
            ← My Account
          </Link>
          <span className="text-[#D4C5B0]">/</span>
          <h1 className="font-playfair font-semibold text-[#4A2C5A] text-3xl"
            style={{ fontFamily: "var(--font-playfair)" }}>My Orders</h1>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-[#E8DFF5] text-center">
            <p className="text-4xl mb-4">📦</p>
            <p className="font-playfair font-semibold text-[#4A2C5A] text-xl mb-2"
              style={{ fontFamily: "var(--font-playfair)" }}>No orders yet</p>
            <p className="text-sm font-inter font-light text-[#8B8B8B] mb-6">
              When you place an order, it will appear here.
            </p>
            <Link href="/shop"
              className="inline-block px-6 py-3 bg-[#4A2C5A] text-white text-sm font-inter font-normal rounded-xl hover:bg-[#5B3A6B] transition-colors">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link key={order.id} href={`/account/orders/${order.id}`}
                className="block bg-white rounded-2xl border border-[#E8DFF5]/60 hover:border-[#B8A4D4] hover:shadow-[0_4px_16px_rgba(74,44,90,0.08)] transition-all overflow-hidden">
                {/* Order header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8DFF5]/60">
                  <div>
                    <p className="text-sm font-inter font-normal text-[#2A2A2A]">{order.orderNumber}</p>
                    <p className="text-xs font-inter font-light text-[#8B8B8B] mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString("en-CA", {
                        year: "numeric", month: "long", day: "numeric"
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-xs px-3 py-1 rounded-full font-inter font-light ${statusColors[order.status] ?? "bg-gray-50 text-gray-600"}`}>
                      {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
                    </span>
                    <span className="text-sm font-inter font-semibold text-[#4A2C5A]">
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
                          className="w-12 h-12 rounded-lg object-cover border-2 border-white" />
                      ) : (
                        <div key={i} className="w-12 h-12 rounded-lg bg-[#E8DFF5] border-2 border-white flex items-center justify-center">
                          <span className="text-xs text-[#4A2C5A]">📦</span>
                        </div>
                      )
                    ))}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-inter font-light text-[#2A2A2A]">
                      {order.items[0].productName}
                      {order.items.length > 1 && <span className="text-[#8B8B8B]"> + {order.items.length - 1} more</span>}
                    </p>
                    <p className="text-xs font-inter font-light text-[#8B8B8B] mt-0.5">
                      {order.items.reduce((s, i) => s + i.quantity, 0)} item{order.items.reduce((s, i) => s + i.quantity, 0) !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <span className="text-xs font-inter font-light text-[#4A2C5A]">View details →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
