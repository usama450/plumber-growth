import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Products — Admin" };

export default async function AdminProductsPage() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/login");

  const products = await prisma.product.findMany({
    include: {
      category: { select: { name: true } },
      images: { orderBy: { displayOrder: "asc" }, take: 1 },
      variants: { select: { stockQuantity: true } },
      _count: { select: { orderItems: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-sm font-inter font-light text-[#8B8B8B] hover:text-[#4A2C5A]">← Dashboard</Link>
            <h1 className="font-playfair font-semibold text-[#4A2C5A] text-3xl"
              style={{ fontFamily: "var(--font-playfair)" }}>Products</h1>
          </div>
          <Link href="/admin/products/new"
            className="px-4 py-2 bg-[#4A2C5A] text-white text-sm font-inter font-normal rounded-lg hover:bg-[#5B3A6B] transition-colors">
            + Add Product
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8DFF5]/60 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E8DFF5] bg-[#FAF7F2]/60">
                <th className="text-left px-6 py-3 text-xs font-inter font-normal text-[#8B8B8B] uppercase tracking-wider">Product</th>
                <th className="text-left px-4 py-3 text-xs font-inter font-normal text-[#8B8B8B] uppercase tracking-wider hidden sm:table-cell">Category</th>
                <th className="text-left px-4 py-3 text-xs font-inter font-normal text-[#8B8B8B] uppercase tracking-wider">Price</th>
                <th className="text-left px-4 py-3 text-xs font-inter font-normal text-[#8B8B8B] uppercase tracking-wider hidden lg:table-cell">Stock</th>
                <th className="text-left px-4 py-3 text-xs font-inter font-normal text-[#8B8B8B] uppercase tracking-wider hidden lg:table-cell">Orders</th>
                <th className="text-left px-4 py-3 text-xs font-inter font-normal text-[#8B8B8B] uppercase tracking-wider">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DFF5]">
              {products.map((product) => {
                const totalStock = product.variants.reduce((s, v) => s + v.stockQuantity, 0);
                return (
                  <tr key={product.id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {product.images[0] ? (
                          <img src={product.images[0].imageUrl} alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover border border-[#E8DFF5] shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-[#E8DFF5]/40 shrink-0" />
                        )}
                        <div>
                          <p className="text-sm font-inter font-normal text-[#2A2A2A] line-clamp-1">{product.name}</p>
                          <p className="text-xs font-inter font-light text-[#8B8B8B]">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      <span className="text-xs font-inter font-light text-[#8B8B8B]">{product.category.name}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <p className="text-sm font-inter font-normal text-[#2A2A2A]">{formatPrice(Number(product.price))}</p>
                        {product.comparePrice && (
                          <p className="text-xs font-inter font-light text-[#8B8B8B] line-through">{formatPrice(Number(product.comparePrice))}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <span className={`text-sm font-inter font-light ${totalStock < 5 ? "text-[#B85450]" : "text-[#2A2A2A]"}`}>
                        {totalStock}
                      </span>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <span className="text-sm font-inter font-light text-[#2A2A2A]">{product._count.orderItems}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-1 flex-wrap">
                        {product.isActive ? (
                          <span className="text-xs px-2 py-0.5 bg-[#6B8E4E]/10 text-[#6B8E4E] rounded-full font-inter font-light">Active</span>
                        ) : (
                          <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full font-inter font-light">Draft</span>
                        )}
                        {product.isOnSale && (
                          <span className="text-xs px-2 py-0.5 bg-[#B85450]/10 text-[#B85450] rounded-full font-inter font-light">Sale</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <Link href={`/product/${product.slug}`} target="_blank"
                          className="text-xs font-inter font-light text-[#8B8B8B] hover:text-[#4A2C5A] transition-colors">
                          View
                        </Link>
                        <Link href={`/admin/products/${product.id}/edit`}
                          className="text-xs font-inter font-light text-[#4A2C5A] hover:underline transition-colors">
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {products.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-sm font-inter font-light text-[#8B8B8B]">No products yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
