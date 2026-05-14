import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "My Account" };

export default async function AccountPage() {
  const session = await auth();
  if (!session) redirect("/login?callbackUrl=/account");

  const recentOrders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 3,
    include: { items: { take: 1 } },
  });

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-50 text-yellow-700",
    PAID: "bg-blue-50 text-blue-700",
    PROCESSING: "bg-purple-50 text-purple-700",
    SHIPPED: "bg-[#3A1A5C] text-[#E7D3A8]",
    DELIVERED: "bg-[#6B8E4E]/10 text-[#6B8E4E]",
    CANCELLED: "bg-[#B85450]/10 text-[#B85450]",
    REFUNDED: "bg-gray-50 text-gray-600",
  };

  return (
    <div className="min-h-screen bg-[#050507]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="font-semibold text-[#E7D3A8] text-3xl"
            style={{ fontFamily: "var(--font-playfair)" }}>
            My Account
          </h1>
          <p className="text-[#A8A4B0] font-inter font-light mt-1">
            Welcome back, {session.user.name?.split(" ")[0] ?? "there"} 👋
          </p>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Orders", href: "/account/orders", icon: "📦" },
            { label: "Wishlist", href: "/account/wishlist", icon: "♡" },
            { label: "Addresses", href: "/account/addresses", icon: "📍" },
            { label: "Settings", href: "/account/settings", icon: "⚙️" },
          ].map((item) => (
            <Link key={item.href} href={item.href}
              className="bg-[#150820] rounded-xl p-5 border border-[#3A1A5C] hover:border-[#5A189A] hover:shadow-[0_4px_16px_rgba(74,44,90,0.08)] transition-all text-center">
              <span className="text-2xl block mb-2">{item.icon}</span>
              <span className="text-sm font-inter font-light text-[#F8F4EE]">{item.label}</span>
            </Link>
          ))}
        </div>

        {/* Recent orders */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-[#E7D3A8] text-xl"
              style={{ fontFamily: "var(--font-playfair)" }}>Recent Orders</h2>
            <Link href="/account/orders" className="text-sm font-inter font-light text-[#E7D3A8] hover:underline">
              View all →
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <div className="bg-[#150820] rounded-xl p-8 border border-[#3A1A5C] text-center">
              <p className="text-[#A8A4B0] font-inter font-light">No orders yet.</p>
              <Link href="/shop" className="inline-block mt-4 px-6 py-2.5 bg-[#5A189A] text-white text-sm font-inter font-normal rounded-xl hover:bg-[#7B3DBF] transition-colors">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <Link key={order.id} href={`/account/orders/${order.id}`}
                  className="flex items-center justify-between bg-[#150820] rounded-xl p-4 border border-[#3A1A5C] hover:border-[#5A189A] transition-all">
                  <div>
                    <p className="text-sm font-inter font-normal text-[#F8F4EE]">{order.orderNumber}</p>
                    <p className="text-xs text-[#A8A4B0] font-inter font-light mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" })}
                      {" · "}{order.items.length} item{order.items.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-inter font-light capitalize ${statusColors[order.status] ?? "bg-gray-50 text-gray-600"}`}>
                      {order.status.toLowerCase()}
                    </span>
                    <span className="text-sm font-inter font-normal text-[#E7D3A8]">
                      {formatPrice(Number(order.total))}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
