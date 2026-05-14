import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
prisma.product.update({ where: { slug: "test-product-free" }, data: { price: 1 } })
  .then(p => { console.log("✅ Test product price updated to $" + Number(p.price)); return prisma.$disconnect(); })
  .catch(console.error);
