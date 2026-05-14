import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin Dashboard" };

export default async function AdminDashboard() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/login");

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalOrdersToday, totalOrdersWeek, totalOrdersMonth,
    pendingOrders, totalCustomers, totalProducts,
    recentOrders, topProducts,
  ] = await Promise.all([
    prisma.order.aggregate({ where: { createdAt: { gte: todayStart }, status: { not: "CANCELLED" } }, _sum: { total: true }, _count: true }),
    prisma.order.aggregate({ where: { createdAt: { gte: weekStart }, status: { not: "CANCELLED" } }, _sum: { total: true } }),
    prisma.order.aggregate({ where: { createdAt: { gte: monthStart }, status: { not: "CANCELLED" } }, _sum: { total: true } }),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.product.count({ where: { isActive: true } }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" }, take: 5,
      include: { user: { select: { name: true, email: true } }, items: { take: 1 } },
    }),
    prisma.orderItem.groupBy({
      by: ["productName"],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    }),
  ]);

  const statusColors: Record<string, string> = {
    PENDING: "text-yellow-700 bg-yellow-50",
    PAID: "text-blue-700 bg-blue-50",
    PROCESSING: "text-purple-700 bg-purple-50",
    SHIPPED: "text-[#1A1410] bg-[#F7F3EE]",
    DELIVERED: "text-[#6B8E4E] bg-[#6B8E4E]/10",
    CANCELLED: "text-[#B85450] bg-[#B85450]/10",
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-playfair font-semibold text-[#1A1410] text-3xl"
              style={{ fontFamily: "var(--font-cormorant)" }}>Admin Dashboard</h1>
            <p className="text-[#8B8B8B] font-inter font-light text-sm mt-1">
              {now.toLocaleDateString("en-CA", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/products/new"
              className="px-4 py-2 bg-[#1A1410] text-white text-sm font-inter font-normal rounded-lg hover:bg-[#5B3A6B] transition-colors">
              + Add Product
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Today's Sales", value: formatPrice(Number(totalOrdersToday._sum.total ?? 0)), sub: `${totalOrdersToday._count} orders`, accent: "#C9A961" },
            { label: "This Week", value: formatPrice(Number(totalOrdersWeek._sum.total ?? 0)), accent: "#C4992E" },
            { label: "This Month", value: formatPrice(Number(totalOrdersMonth._sum.total ?? 0)), accent: "#6B8E4E" },
            { label: "Pending Orders", value: pendingOrders.toString(), sub: "Awaiting action", accent: "#B85450" },
            { label: "Total Customers", value: totalCustomers.toLocaleString(), accent: "#1A1410" },
            { label: "Active Products", value: totalProducts.toString(), accent: "#1A1410" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl p-5 border border-[#F7F3EE]/60">
              <p className="text-xs font-inter font-light text-[#8B8B8B] mb-2">{stat.label}</p>
              <p className="text-2xl font-playfair font-semibold" style={{ color: stat.accent, fontFamily: "var(--font-cormorant)" }}>
                {stat.value}
              </p>
              {stat.sub && <p className="text-xs text-[#8B8B8B] font-inter font-light mt-1">{stat.sub}</p>}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent orders */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-[#F7F3EE]/60 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#F7F3EE]">
              <h2 className="font-playfair font-semibold text-[#1A1410]"
                style={{ fontFamily: "var(--font-cormorant)" }}>Recent Orders</h2>
              <Link href="/admin/orders" className="text-sm font-inter font-light text-[#1A1410] hover:underline">View all</Link>
            </div>
            <div className="divide-y divide-[#F7F3EE]">
              {recentOrders.map((order) => (
                <Link key={order.id} href={`/admin/orders/${order.id}`}
                  className="flex items-center justify-between px-6 py-4 hover:bg-[#FAF7F2] transition-colors">
                  <div>
                    <p className="text-sm font-inter font-normal text-[#2A2A2A]">{order.orderNumber}</p>
                    <p className="text-xs text-[#8B8B8B] font-inter font-light">{order.user.name ?? order.user.email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-inter font-light ${statusColors[order.status] ?? ""}`}>
                      {order.status}
                    </span>
                    <span className="text-sm font-inter font-normal text-[#1A1410]">{formatPrice(Number(order.total))}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Top products + Nav */}
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-[#F7F3EE]/60 overflow-hidden">
              <div className="px-5 py-4 border-b border-[#F7F3EE]">
                <h2 className="font-playfair font-semibold text-[#1A1410]"
                  style={{ fontFamily: "var(--font-cormorant)" }}>Top Products</h2>
              </div>
              <div className="divide-y divide-[#F7F3EE]">
                {topProducts.map((p, i) => (
                  <div key={p.productName} className="flex items-center gap-3 px-5 py-3">
                    <span className="text-xs text-[#8B8B8B] font-inter w-4">{i + 1}</span>
                    <span className="text-sm font-inter font-light text-[#2A2A2A] flex-1 truncate">{p.productName}</span>
                    <span className="text-xs text-[#1A1410] font-inter">{p._sum.quantity ?? 0} sold</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-[#F7F3EE]/60 p-5 space-y-2">
              <h2 className="font-playfair font-semibold text-[#1A1410] mb-3"
                style={{ fontFamily: "var(--font-cormorant)" }}>Quick Links</h2>
              {[
                { label: "Manage Products", href: "/admin/products" },
                { label: "All Orders", href: "/admin/orders" },
                { label: "Customers", href: "/admin/customers" },
                { label: "Coupons", href: "/admin/coupons" },
              ].map((link) => (
                <Link key={link.href} href={link.href}
                  className="block px-3 py-2.5 rounded-lg text-sm font-inter font-light text-[#2A2A2A] hover:bg-[#F7F3EE]/40 hover:text-[#1A1410] transition-colors">
                  {link.label} →
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
