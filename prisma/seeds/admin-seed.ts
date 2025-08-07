import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function seedAdmin() {
  console.log("🔐 Seeding admin user...");

  const hashedPassword = await bcrypt.hash("admin123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      password: hashedPassword,
      name: "Admin Dapur Mama",
      role: "ADMIN",
    },
  });

  console.log("✅ Admin user created:", admin.email);
  return admin;
}

if (require.main === module) {
  seedAdmin()
    .catch((e) => {
      console.error("❌ Error seeding admin:", e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
