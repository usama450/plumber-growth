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
    PROCESSING: "bg-[#F4F0EB] text-[#5A554F]",
    SHIPPED: "bg-[#2C4A35]/10 text-[#2C4A35]",
    DELIVERED: "bg-[#2C4A35]/10 text-[#2C4A35]",
    CANCELLED: "bg-[#C0392B]/10 text-[#C0392B]",
    REFUNDED: "bg-[#F4F0EB] text-[#7A746D]",
  };

  return (
    <div className="min-h-screen bg-[#F9F7F4]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="font-semibold text-[#1A1714] text-3xl"
            style={{ fontFamily: "var(--font-playfair)" }}>
            My Account
          </h1>
          <p className="text-[#5A554F] font-inter font-light mt-1">
            Welcome back, {session.user.name?.split(" ")[0] ?? "there"}
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
              className="bg-white border border-[#E2DDD7] p-5 hover:border-[#2C4A35] hover:shadow-[0_2px_12px_rgba(44,74,53,0.08)] transition-all text-center">
              <span className="text-2xl block mb-2">{item.icon}</span>
              <span className="text-sm font-inter font-light text-[#1A1714]">{item.label}</span>
            </Link>
          ))}
        </div>

        {/* Recent orders */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-[#1A1714] text-xl"
              style={{ fontFamily: "var(--font-playfair)" }}>Recent Orders</h2>
            <Link href="/account/orders" className="text-sm font-inter font-light text-[#2C4A35] hover:text-[#1A1714] underline underline-offset-2">
              View all →
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <div className="bg-white border border-[#E2DDD7] p-8 text-center">
              <p className="text-[#5A554F] font-inter font-light">No orders yet.</p>
              <Link href="/shop" className="btn-primary inline-block mt-4 px-6 py-2.5">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <Link key={order.id} href={`/account/orders/${order.id}`}
                  className="flex items-center justify-between bg-white border border-[#E2DDD7] p-4 hover:border-[#2C4A35] transition-all">
                  <div>
                    <p className="text-sm font-inter font-normal text-[#1A1714]">{order.orderNumber}</p>
                    <p className="text-xs text-[#7A746D] font-inter font-light mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" })}
                      {" · "}{order.items.length} item{order.items.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2.5 py-1 font-inter font-light capitalize ${statusColors[order.status] ?? "bg-[#F4F0EB] text-[#7A746D]"}`}>
                      {order.status.toLowerCase()}
                    </span>
                    <span className="text-sm font-inter font-normal text-[#1A1714]">
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
