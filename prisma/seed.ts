import { PrismaClient } from "@prisma/client"; // eslint-disable-line
// Prisma v5 seed file
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Khwab database...");

  // Categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "bedsheets" },
      update: {},
      create: {
        name: "Bedsheets",
        slug: "bedsheets",
        description: "Premium cotton bedsheets in percale and sateen weaves.",
        image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=85",
      },
    }),
    prisma.category.upsert({
      where: { slug: "comforters" },
      update: {},
      create: {
        name: "Comforter Sets",
        slug: "comforters",
        description: "Complete comforter and duvet sets for a beautifully dressed bed.",
        image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=85",
      },
    }),
    prisma.category.upsert({
      where: { slug: "towels" },
      update: {},
      create: {
        name: "Bath Towels",
        slug: "towels",
        description: "Plush, absorbent cotton bath towels in rich colours.",
        image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=800&q=85",
      },
    }),
    prisma.category.upsert({
      where: { slug: "gift-bundles" },
      update: {},
      create: {
        name: "Gift Bundles",
        slug: "gift-bundles",
        description: "Curated home textile gift sets for every occasion.",
        image: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=800&q=85",
      },
    }),
  ]);

  const [bedsheets, comforters, towels, giftBundles] = categories;
  console.log("✅ Categories created");

  // Products
  const product1 = await prisma.product.upsert({
    where: { slug: "luxe-sateen-bedsheet-set" },
    update: {},
    create: {
      name: "Luxe Sateen Bedsheet Set",
      slug: "luxe-sateen-bedsheet-set",
      description: "Experience the silky smoothness of our 800 thread count sateen weave bedsheet set. Made from 100% long-staple Egyptian cotton, these sheets grow softer with every wash. Includes one fitted sheet, one flat sheet, and two pillowcases. The sateen weave gives a lustrous sheen and a drape that feels like luxury.",
      price: 149.99,
      comparePrice: 199.99,
      categoryId: bedsheets.id,
      material: "100% Long-Staple Egyptian Cotton",
      careInstructions: "Machine wash warm with like colours. Tumble dry low. Do not bleach. Becomes softer with every wash.",
      threadCount: 800,
      isActive: true,
      isFeatured: true,
      isOnSale: true,
      images: {
        create: [
          { imageUrl: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=85", altText: "Luxe Sateen Bedsheet Set in white", displayOrder: 0 },
          { imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&q=85", altText: "Close up of sateen weave texture", displayOrder: 1 },
        ],
      },
      variants: {
        create: [
          { size: "Twin", color: "White", sku: "LS-TW-WH", stockQuantity: 25 },
          { size: "Queen", color: "White", sku: "LS-QN-WH", stockQuantity: 30 },
          { size: "King", color: "White", sku: "LS-KG-WH", stockQuantity: 20 },
          { size: "Queen", color: "Ivory", sku: "LS-QN-IV", stockQuantity: 15 },
          { size: "King", color: "Ivory", sku: "LS-KG-IV", stockQuantity: 10 },
          { size: "Queen", color: "Lavender", sku: "LS-QN-LV", stockQuantity: 12 },
          { size: "King", color: "Lavender", sku: "LS-KG-LV", stockQuantity: 8 },
        ],
      },
    },
  });

  const product2 = await prisma.product.upsert({
    where: { slug: "heritage-comforter-set" },
    update: {},
    create: {
      name: "Heritage Comforter Set",
      slug: "heritage-comforter-set",
      description: "Our Heritage Comforter Set draws inspiration from traditional Pakistani patterns, reinterpreted in a modern, understated palette. The set includes a reversible comforter and two shams. Filled with premium microfibre for year-round comfort. The cover is 100% cotton with a 300 TC percale weave — breathable and cool.",
      price: 229.99,
      comparePrice: null,
      categoryId: comforters.id,
      material: "100% Cotton Cover, Premium Microfibre Fill",
      careInstructions: "Machine wash warm. Tumble dry on medium. Do not iron. Comes out of the dryer fluffy and ready to use.",
      threadCount: 300,
      isActive: true,
      isFeatured: true,
      isOnSale: false,
      images: {
        create: [
          { imageUrl: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=900&q=85", altText: "Heritage Comforter Set on a styled bed", displayOrder: 0 },
          { imageUrl: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=900&q=85", altText: "Heritage Comforter Set detail view", displayOrder: 1 },
        ],
      },
      variants: {
        create: [
          { size: "Full/Queen", color: "Sand", sku: "HC-FQ-SA", stockQuantity: 20 },
          { size: "King/Cal King", color: "Sand", sku: "HC-KK-SA", stockQuantity: 15 },
          { size: "Full/Queen", color: "Slate Blue", sku: "HC-FQ-SB", stockQuantity: 18 },
          { size: "King/Cal King", color: "Slate Blue", sku: "HC-KK-SB", stockQuantity: 10 },
        ],
      },
    },
  });

  const product3 = await prisma.product.upsert({
    where: { slug: "plush-bath-towel-set" },
    update: {},
    create: {
      name: "Plush Bath Towel Set",
      slug: "plush-bath-towel-set",
      description: "Wrap yourself in luxury with our Plush Bath Towel Set. Made from 600 GSM Turkish cotton, these towels are incredibly soft, highly absorbent, and quick-drying. Set includes two bath towels, two hand towels, and two washcloths. Gets softer with every wash.",
      price: 89.99,
      comparePrice: 119.99,
      categoryId: towels.id,
      material: "100% Turkish Cotton, 600 GSM",
      careInstructions: "Machine wash warm. Tumble dry medium. Do not use fabric softener — it reduces absorbency.",
      threadCount: null,
      isActive: true,
      isFeatured: true,
      isOnSale: true,
      images: {
        create: [
          { imageUrl: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=900&q=85", altText: "Plush Bath Towel Set folded neatly", displayOrder: 0 },
          { imageUrl: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=900&q=85", altText: "Bath towels in bathroom setting", displayOrder: 1 },
        ],
      },
      variants: {
        create: [
          { size: "Set of 6", color: "White", sku: "PT-S6-WH", stockQuantity: 35 },
          { size: "Set of 6", color: "Blush", sku: "PT-S6-BL", stockQuantity: 20 },
          { size: "Set of 6", color: "Charcoal", sku: "PT-S6-CH", stockQuantity: 22 },
          { size: "Set of 6", color: "Sage", sku: "PT-S6-SG", stockQuantity: 15 },
          { size: "Set of 6", color: "Navy", sku: "PT-S6-NV", stockQuantity: 18 },
        ],
      },
    },
  });

  const product4 = await prisma.product.upsert({
    where: { slug: "dream-home-gift-bundle" },
    update: {},
    create: {
      name: "Dream Home Gift Bundle",
      slug: "dream-home-gift-bundle",
      description: "The perfect gift for a wedding, housewarming, or a loved one who deserves the best. This curated bundle includes one Queen sheet set, one comforter, and a 4-piece towel set — all beautifully packaged in our signature gift box with a handwritten card. Everything needed for the best sleep of their life.",
      price: 349.99,
      comparePrice: 429.99,
      categoryId: giftBundles.id,
      material: "Various — see individual products",
      careInstructions: "See individual product care instructions.",
      threadCount: null,
      isActive: true,
      isFeatured: true,
      isOnSale: true,
      images: {
        create: [
          { imageUrl: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=900&q=85", altText: "Dream Home Gift Bundle packaging", displayOrder: 0 },
          { imageUrl: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=900&q=85", altText: "Gift bundle contents laid out", displayOrder: 1 },
        ],
      },
      variants: {
        create: [
          { size: "Queen Bundle", color: "Classic White", sku: "GB-QN-WH", stockQuantity: 10 },
          { size: "King Bundle", color: "Classic White", sku: "GB-KG-WH", stockQuantity: 8 },
          { size: "Queen Bundle", color: "Warm Sand", sku: "GB-QN-SA", stockQuantity: 7 },
          { size: "King Bundle", color: "Warm Sand", sku: "GB-KG-SA", stockQuantity: 5 },
        ],
      },
    },
  });

  console.log("✅ Products created");

  // Admin user
  const adminPassword = await bcrypt.hash("Admin@Khwab2024!", 12);
  await prisma.user.upsert({
    where: { email: "admin@khwab.ca" },
    update: {},
    create: {
      name: "Khwab Admin",
      email: "admin@khwab.ca",
      password: adminPassword,
      role: "ADMIN",
      emailVerified: new Date(),
    },
  });
  console.log("✅ Admin user created (admin@khwab.ca / Admin@Khwab2024!)");

  // Test customer
  const customerPassword = await bcrypt.hash("Customer@123", 12);
  const customer = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      name: "Sana Ahmed",
      email: "test@example.com",
      password: customerPassword,
      role: "CUSTOMER",
      emailVerified: new Date(),
    },
  });
  console.log("✅ Test customer created (test@example.com / Customer@123)");

  // Sample reviews
  const reviewData = [
    { userId: customer.id, productId: product1.id, rating: 5, title: "Best sheets I've ever owned", comment: "Absolutely obsessed. The sateen weave is incredibly soft — I actually look forward to bedtime now. The quality is exceptional.", isVerifiedPurchase: true },
    { userId: customer.id, productId: product2.id, rating: 5, title: "Perfect weight for all seasons", comment: "Love this comforter! Not too hot in summer, warm enough in winter. The pattern is subtle and beautiful.", isVerifiedPurchase: true },
    { userId: customer.id, productId: product3.id, rating: 5, title: "So fluffy and absorbent!", comment: "Finally found towels that are plush AND absorbent. The charcoal colour is stunning too.", isVerifiedPurchase: true },
    { userId: customer.id, productId: product4.id, rating: 5, title: "Incredible gift!", comment: "Bought this for my sister's wedding. The packaging was gorgeous and she absolutely loved everything inside.", isVerifiedPurchase: false },
    { userId: customer.id, productId: product1.id, rating: 4, title: "Excellent quality", comment: "Great sheets, ships fast. Would buy again. Gave 4 stars only because I wish there were more colour options.", isVerifiedPurchase: true },
  ];

  for (const review of reviewData) {
    await prisma.review.upsert({
      where: { id: `seed-review-${review.productId}-${review.userId}-${review.rating}` },
      update: {},
      create: { id: `seed-review-${review.productId}-${review.userId}-${review.rating}`, ...review },
    });
  }
  console.log("✅ Reviews created");

  // Sample coupon
  await prisma.coupon.upsert({
    where: { code: "WELCOME10" },
    update: {},
    create: {
      code: "WELCOME10",
      description: "10% off your first order",
      discountType: "PERCENTAGE",
      discountValue: 10,
      minimumPurchase: 50,
      isActive: true,
    },
  });

  await prisma.coupon.upsert({
    where: { code: "SAVE20" },
    update: {},
    create: {
      code: "SAVE20",
      description: "$20 off orders over $150",
      discountType: "FIXED",
      discountValue: 20,
      minimumPurchase: 150,
      isActive: true,
    },
  });
  console.log("✅ Coupons created");

  console.log("\n🎉 Database seeded successfully!");
  console.log("\nAdmin login: admin@khwab.ca / Admin@Khwab2024!");
  console.log("Customer login: test@example.com / Customer@123");
  console.log("Coupon codes: WELCOME10 (10% off), SAVE20 ($20 off $150+)");
}

main()
  .catch((e) => { console.error("Seed error:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
