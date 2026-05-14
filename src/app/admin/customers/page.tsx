import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Customers — Admin" };

export default async function AdminCustomersPage() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/login");

  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    include: {
      _count: { select: { orders: true } },
      orders: { select: { total: true }, where: { status: { not: "CANCELLED" } } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="text-sm font-inter font-light text-[#8B8B8B] hover:text-[#1A1410]">← Dashboard</Link>
          <h1 className="font-playfair font-semibold text-[#1A1410] text-3xl"
            style={{ fontFamily: "var(--font-cormorant)" }}>Customers</h1>
          <span className="text-sm font-inter font-light text-[#8B8B8B]">({customers.length})</span>
        </div>

        <div className="bg-white rounded-2xl border border-[#F7F3EE]/60 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#F7F3EE] bg-[#FAF7F2]/60">
                <th className="text-left px-6 py-3 text-xs font-inter font-normal text-[#8B8B8B] uppercase tracking-wider">Customer</th>
                <th className="text-left px-4 py-3 text-xs font-inter font-normal text-[#8B8B8B] uppercase tracking-wider hidden sm:table-cell">Joined</th>
                <th className="text-left px-4 py-3 text-xs font-inter font-normal text-[#8B8B8B] uppercase tracking-wider">Orders</th>
                <th className="text-right px-4 py-3 text-xs font-inter font-normal text-[#8B8B8B] uppercase tracking-wider">Total Spent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F7F3EE]">
              {customers.map((customer) => {
                const totalSpent = customer.orders.reduce((s, o) => s + Number(o.total), 0);
                return (
                  <tr key={customer.id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-inter font-normal text-[#2A2A2A]">{customer.name ?? "—"}</p>
                      <p className="text-xs font-inter font-light text-[#8B8B8B]">{customer.email}</p>
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      <span className="text-sm font-inter font-light text-[#8B8B8B]">
                        {new Date(customer.createdAt).toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-inter font-light text-[#2A2A2A]">{customer._count.orders}</span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span className="text-sm font-inter font-normal text-[#1A1410]">{formatPrice(totalSpent)}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {customers.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-sm font-inter font-light text-[#8B8B8B]">No customers yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
