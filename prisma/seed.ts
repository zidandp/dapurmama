import { seedAdmin } from "./seeds/admin-seed";
import { seedProducts } from "./seeds/products-seed";

async function main() {
  console.log("🌱 Starting database seeding...\n");

  try {
    // Seed admin user
    await seedAdmin();
    console.log("");

    // Seed products
    const productResult = await seedProducts();

    console.log("\n🎉 All seeding completed successfully!");
    console.log(`📊 Final summary:`);
    console.log(`   👤 Admin users: 1`);
    console.log(`   🍰 Products: ${productResult.created}`);
    console.log(`   📦 Categories: ${productResult.categories}`);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    const { PrismaClient } = require("@prisma/client");
    const prisma = new PrismaClient();
    await prisma.$disconnect();
  });
