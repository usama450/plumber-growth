import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import type { Metadata } from "next";
import Link from "next/link";
import { AdminProductForm } from "./AdminProductForm";

export const metadata: Metadata = { title: "New Product — Admin" };

export default async function NewProductPage() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/login");

  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/products" className="text-sm font-inter font-light text-[#8B8B8B] hover:text-[#4A2C5A]">← Products</Link>
          <h1 className="font-playfair font-semibold text-[#4A2C5A] text-3xl"
            style={{ fontFamily: "var(--font-playfair)" }}>Add Product</h1>
        </div>
        <AdminProductForm categories={categories.map((c) => ({ id: c.id, name: c.name }))} />
      </div>
    </div>
  );
}
