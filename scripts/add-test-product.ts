import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const cat = await prisma.category.findFirst({ where: { slug: "bedsheets" } });
  if (!cat) { console.log("No category found — run seed first"); process.exit(1); }

  const p = await prisma.product.upsert({
    where: { slug: "test-product-free" },
    update: { isActive: true, isFeatured: true },
    create: {
      name: "Test Product (Free)",
      slug: "test-product-free",
      description: "A free test product to verify the full checkout flow end-to-end.",
      price: 0,
      comparePrice: null,
      isActive: true,
      isFeatured: true,
      isOnSale: false,
      material: "Cotton",
      categoryId: cat.id,
      images: {
        create: [{
          imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=85",
          altText: "Test product",
          displayOrder: 0,
        }],
      },
      variants: {
        create: [{
          sku: "TEST-FREE-001",
          size: "Queen",
          color: "White",
          stockQuantity: 999,
          priceModifier: 0,
        }],
      },
    },
  });

  console.log("✅ Test product ready:", p.name, "| price: $" + Number(p.price) + " | slug:", p.slug);
  await prisma.$disconnect();
}

main().catch(console.error);
