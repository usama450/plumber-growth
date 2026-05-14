import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Orders — Admin" };

export default async function AdminOrdersPage() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/login");

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      items: { select: { productName: true, quantity: true }, take: 2 },
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="text-sm font-inter font-light text-[#8B8B8B] hover:text-[#4A2C5A]">← Dashboard</Link>
          <h1 className="font-playfair font-semibold text-[#4A2C5A] text-3xl"
            style={{ fontFamily: "var(--font-playfair)" }}>All Orders</h1>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8DFF5]/60 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E8DFF5] bg-[#FAF7F2]/60">
                <th className="text-left px-6 py-3 text-xs font-inter font-normal text-[#8B8B8B] uppercase tracking-wider">Order</th>
                <th className="text-left px-4 py-3 text-xs font-inter font-normal text-[#8B8B8B] uppercase tracking-wider hidden md:table-cell">Customer</th>
                <th className="text-left px-4 py-3 text-xs font-inter font-normal text-[#8B8B8B] uppercase tracking-wider hidden sm:table-cell">Date</th>
                <th className="text-left px-4 py-3 text-xs font-inter font-normal text-[#8B8B8B] uppercase tracking-wider">Status</th>
                <th className="text-right px-4 py-3 text-xs font-inter font-normal text-[#8B8B8B] uppercase tracking-wider">Total</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DFF5]">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-inter font-normal text-[#2A2A2A]">{order.orderNumber}</p>
                    <p className="text-xs font-inter font-light text-[#8B8B8B] mt-0.5 line-clamp-1">
                      {order.items[0]?.productName}{order.items.length > 1 ? ` +${order.items.length - 1}` : ""}
                    </p>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <p className="text-sm font-inter font-light text-[#2A2A2A]">{order.user.name ?? "—"}</p>
                    <p className="text-xs font-inter font-light text-[#8B8B8B]">{order.user.email}</p>
                  </td>
                  <td className="px-4 py-4 hidden sm:table-cell">
                    <span className="text-sm font-inter font-light text-[#8B8B8B]">
                      {new Date(order.createdAt).toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-inter font-light ${statusColors[order.status] ?? "bg-gray-50 text-gray-600"}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className="text-sm font-inter font-normal text-[#4A2C5A]">{formatPrice(Number(order.total))}</span>
                  </td>
                  <td className="px-4 py-4">
                    <Link href={`/admin/orders/${order.id}`}
                      className="text-xs font-inter font-light text-[#4A2C5A] hover:underline">
                      Manage →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-sm font-inter font-light text-[#8B8B8B]">No orders yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
