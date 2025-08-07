import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const products = [
  // Kategori: Brownies (6 produk)
  {
    name: "Brownies Coklat Premium",
    description:
      "Brownies lezat dengan coklat premium yang rich dan fudgy, dipanggang sempurna untuk tekstur yang moist di dalam dan crispy di luar.",
    price: 75000,
    imageUrl:
      "https://images.pexels.com/photos/1721932/pexels-photo-1721932.jpeg?auto=compress&cs=tinysrgb&w=500",
    category: "Brownies",
    isAvailable: true,
  },
  {
    name: "Brownies Red Velvet",
    description:
      "Perpaduan unik brownies dengan rasa red velvet yang lembut, dilengkapi cream cheese frosting yang creamy.",
    price: 85000,
    imageUrl:
      "https://images.pexels.com/photos/4110008/pexels-photo-4110008.jpeg?auto=compress&cs=tinysrgb&w=500",
    category: "Brownies",
    isAvailable: true,
  },
  {
    name: "Brownies Nutella",
    description:
      "Brownies yang diperkaya dengan Nutella asli, memberikan rasa hazelnut yang khas dan tekstur yang extra fudgy.",
    price: 95000,
    imageUrl:
      "https://images.pexels.com/photos/5639755/pexels-photo-5639755.jpeg?auto=compress&cs=tinysrgb&w=500",
    category: "Brownies",
    isAvailable: true,
  },
  {
    name: "Brownies Salted Caramel",
    description:
      "Brownies coklat dengan lapisan salted caramel yang gurih-manis, menciptakan kombinasi rasa yang sempurna.",
    price: 90000,
    imageUrl:
      "https://images.pexels.com/photos/8753657/pexels-photo-8753657.jpeg?auto=compress&cs=tinysrgb&w=500",
    category: "Brownies",
    isAvailable: true,
  },
  {
    name: "Brownies Oreo Crumble",
    description:
      "Brownies dengan topping oreo crumble yang crunchy, memberikan tekstur dan rasa yang menarik.",
    price: 80000,
    imageUrl:
      "https://images.pexels.com/photos/4099235/pexels-photo-4099235.jpeg?auto=compress&cs=tinysrgb&w=500",
    category: "Brownies",
    isAvailable: true,
  },
  {
    name: "Brownies Cheese",
    description:
      "Brownies dengan lapisan cream cheese yang lembut di atasnya, menciptakan kontras rasa yang delicious.",
    price: 85000,
    imageUrl:
      "https://images.pexels.com/photos/6880219/pexels-photo-6880219.jpeg?auto=compress&cs=tinysrgb&w=500",
    category: "Brownies",
    isAvailable: true,
  },

  // Kategori: Kue (6 produk)
  {
    name: "Kue Ulang Tahun Coklat",
    description:
      "Kue ulang tahun dengan sponge coklat yang lembut, dilapis buttercream chocolate dan hiasan custom.",
    price: 120000,
    imageUrl:
      "https://images.pexels.com/photos/1039837/pexels-photo-1039837.jpeg?auto=compress&cs=tinysrgb&w=500",
    category: "Kue",
    isAvailable: true,
  },
  {
    name: "Kue Red Velvet",
    description:
      "Kue red velvet klasik dengan warna merah yang cantik dan cream cheese frosting yang tidak terlalu manis.",
    price: 110000,
    imageUrl:
      "https://images.pexels.com/photos/6880975/pexels-photo-6880975.jpeg?auto=compress&cs=tinysrgb&w=500",
    category: "Kue",
    isAvailable: true,
  },
  {
    name: "Kue Vanilla Rainbow",
    description:
      "Kue vanilla dengan layer warna-warni yang cantik, perfect untuk celebration dan acara spesial.",
    price: 115000,
    imageUrl:
      "https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg?auto=compress&cs=tinysrgb&w=500",
    category: "Kue",
    isAvailable: true,
  },
  {
    name: "Kue Tart Buah",
    description:
      "Tart dengan base shortbread crispy, custard cream lembut, dan topping buah segar seasonal.",
    price: 125000,
    imageUrl:
      "https://images.pexels.com/photos/9324567/pexels-photo-9324567.jpeg?auto=compress&cs=tinysrgb&w=500",
    category: "Kue",
    isAvailable: true,
  },
  {
    name: "Kue Blackforest",
    description:
      "Kue klasik dengan sponge coklat, whipped cream, cherry, dan serutan coklat yang generous.",
    price: 130000,
    imageUrl:
      "https://images.pexels.com/photos/5792329/pexels-photo-5792329.jpeg?auto=compress&cs=tinysrgb&w=500",
    category: "Kue",
    isAvailable: true,
  },
  {
    name: "Kue Tiramisu",
    description:
      "Kue tiramisu dengan ladyfinger yang direndam espresso, mascarpone cream, dan cocoa powder.",
    price: 135000,
    imageUrl:
      "https://images.pexels.com/photos/3987066/pexels-photo-3987066.jpeg?auto=compress&cs=tinysrgb&w=500",
    category: "Kue",
    isAvailable: true,
  },

  // Kategori: Bolu (5 produk)
  {
    name: "Bolu Pandan",
    description:
      "Bolu pandan dengan aroma dan rasa daun pandan asli, tekstur yang lembut dan warna hijau natural.",
    price: 45000,
    imageUrl:
      "https://images.pexels.com/photos/7525184/pexels-photo-7525184.jpeg?auto=compress&cs=tinysrgb&w=500",
    category: "Bolu",
    isAvailable: true,
  },
  {
    name: "Bolu Kukus Gula Merah",
    description:
      "Bolu kukus tradisional dengan gula merah asli, memberikan rasa manis yang khas dan tekstur yang lembut.",
    price: 40000,
    imageUrl:
      "https://images.pexels.com/photos/4198018/pexels-photo-4198018.jpeg?auto=compress&cs=tinysrgb&w=500",
    category: "Bolu",
    isAvailable: true,
  },
  {
    name: "Bolu Marmer",
    description:
      "Bolu dengan kombinasi vanilla dan coklat yang menciptakan pattern marmer yang cantik dan rasa yang balanced.",
    price: 50000,
    imageUrl:
      "https://images.pexels.com/photos/6880284/pexels-photo-6880284.jpeg?auto=compress&cs=tinysrgb&w=500",
    category: "Bolu",
    isAvailable: true,
  },
  {
    name: "Bolu Tape Keju",
    description:
      "Bolu dengan rasa tape yang unik dipadukan dengan keju, menciptakan perpaduan rasa tradisional dan modern.",
    price: 55000,
    imageUrl:
      "https://images.pexels.com/photos/2067396/pexels-photo-2067396.jpeg?auto=compress&cs=tinysrgb&w=500",
    category: "Bolu",
    isAvailable: true,
  },
  {
    name: "Bolu Lapis Legit",
    description:
      "Bolu lapis dengan spices traditional Indonesia, dibuat layer demi layer dengan penuh kesabaran.",
    price: 95000,
    imageUrl:
      "https://images.pexels.com/photos/1191639/pexels-photo-1191639.jpeg?auto=compress&cs=tinysrgb&w=500",
    category: "Bolu",
    isAvailable: true,
  },

  // Kategori: Cookies (5 produk)
  {
    name: "Chocolate Chip Cookies",
    description:
      "Cookies klasik dengan chocolate chips yang melimpah, tekstur crispy di luar dan chewy di dalam.",
    price: 35000,
    imageUrl:
      "https://images.pexels.com/photos/4110008/pexels-photo-4110008.jpeg?auto=compress&cs=tinysrgb&w=500",
    category: "Cookies",
    isAvailable: true,
  },
  {
    name: "Oatmeal Raisin Cookies",
    description:
      "Cookies sehat dengan oatmeal dan raisin, perfect untuk snack yang mengenyangkan dan bernutrisi.",
    price: 30000,
    imageUrl:
      "https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg?auto=compress&cs=tinysrgb&w=500",
    category: "Cookies",
    isAvailable: true,
  },
  {
    name: "Sugar Cookies",
    description:
      "Cookies vanilla dengan royal icing decoration yang cantik, bisa di-custom sesuai tema acara.",
    price: 40000,
    imageUrl:
      "https://images.pexels.com/photos/4099227/pexels-photo-4099227.jpeg?auto=compress&cs=tinysrgb&w=500",
    category: "Cookies",
    isAvailable: true,
  },
  {
    name: "Snickerdoodle Cookies",
    description:
      "Cookies dengan coating cinnamon sugar yang memberikan rasa manis dan aroma cinnamon yang hangat.",
    price: 35000,
    imageUrl:
      "https://images.pexels.com/photos/7525080/pexels-photo-7525080.jpeg?auto=compress&cs=tinysrgb&w=500",
    category: "Cookies",
    isAvailable: true,
  },
  {
    name: "Double Chocolate Cookies",
    description:
      "Cookies coklat dengan double chocolate chips, untuk pecinta coklat yang ingin sensasi chocolate overload.",
    price: 45000,
    imageUrl:
      "https://images.pexels.com/photos/2067396/pexels-photo-2067396.jpeg?auto=compress&cs=tinysrgb&w=500",
    category: "Cookies",
    isAvailable: true,
  },

  // Kategori: Dessert (4 produk)
  {
    name: "Cheesecake New York",
    description:
      "Cheesecake premium dengan tekstur yang creamy dan dense, disajikan dengan berry compote segar.",
    price: 65000,
    imageUrl:
      "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=500",
    category: "Dessert",
    isAvailable: true,
  },
  {
    name: "Pudding Coklat",
    description:
      "Pudding coklat yang silky smooth dengan topping whipped cream dan chocolate shavings.",
    price: 25000,
    imageUrl:
      "https://images.pexels.com/photos/4198018/pexels-photo-4198018.jpeg?auto=compress&cs=tinysrgb&w=500",
    category: "Dessert",
    isAvailable: true,
  },
  {
    name: "Panna Cotta",
    description:
      "Dessert Italia yang lembut dengan vanilla bean asli, disajikan dengan berry sauce yang fresh.",
    price: 35000,
    imageUrl:
      "https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=500",
    category: "Dessert",
    isAvailable: true,
  },
  {
    name: "Creme Brulee",
    description:
      "Dessert klasik Perancis dengan custard yang creamy dan caramelized sugar topping yang crispy.",
    price: 50000,
    imageUrl:
      "https://images.pexels.com/photos/3987026/pexels-photo-3987026.jpeg?auto=compress&cs=tinysrgb&w=500",
    category: "Dessert",
    isAvailable: true,
  },

  // Kategori: Pastry (4 produk)
  {
    name: "Croissant Butter",
    description:
      "Croissant klasik dengan lapisan butter yang flaky dan aroma butter yang rich, perfect untuk breakfast.",
    price: 20000,
    imageUrl:
      "https://images.pexels.com/photos/2067396/pexels-photo-2067396.jpeg?auto=compress&cs=tinysrgb&w=500",
    category: "Pastry",
    isAvailable: true,
  },
  {
    name: "Danish Pastry",
    description:
      "Pastry Denmark dengan berbagai filling seperti custard, fruit jam, atau cream cheese yang lezat.",
    price: 25000,
    imageUrl:
      "https://images.pexels.com/photos/2638026/pexels-photo-2638026.jpeg?auto=compress&cs=tinysrgb&w=500",
    category: "Pastry",
    isAvailable: true,
  },
  {
    name: "Eclair Chocolate",
    description:
      "Eclair dengan choux pastry yang light, diisi dengan pastry cream dan topped dengan chocolate glaze.",
    price: 30000,
    imageUrl:
      "https://images.pexels.com/photos/1998636/pexels-photo-1998636.jpeg?auto=compress&cs=tinysrgb&w=500",
    category: "Pastry",
    isAvailable: true,
  },
  {
    name: "Profiteroles",
    description:
      "Choux pastry mini yang diisi dengan whipped cream dan disajikan dengan chocolate sauce yang warm.",
    price: 35000,
    imageUrl:
      "https://images.pexels.com/photos/4099235/pexels-photo-4099235.jpeg?auto=compress&cs=tinysrgb&w=500",
    category: "Pastry",
    isAvailable: true,
  },
];

export async function seedProducts() {
  console.log("🍰 Seeding products...");

  try {
    // Cek apakah ada orders yang menggunakan products
    const existingOrders = await prisma.order.count();

    if (existingOrders > 0) {
      console.log(
        `⚠️ Found ${existingOrders} existing orders. Products with orders will be skipped for safety.`
      );

      // Hanya hapus produk yang tidak ada di order_items
      const productsInOrders = await prisma.orderItem.findMany({
        select: { productId: true },
        distinct: ["productId"],
      });

      const productIdsInOrders = productsInOrders.map((item) => item.productId);

      // Hapus hanya produk yang tidak digunakan
      const deletedCount = await prisma.product.deleteMany({
        where: {
          id: {
            notIn: productIdsInOrders,
          },
        },
      });

      console.log(
        `🗑️ Cleared ${deletedCount.count} unused products (${productIdsInOrders.length} products preserved due to existing orders)`
      );
    } else {
      // Aman untuk hapus semua karena tidak ada orders
      const deletedCount = await prisma.product.deleteMany({});
      console.log(`🗑️ Cleared ${deletedCount.count} existing products`);
    }

    // Create products - skip yang sudah ada
    let createdCount = 0;
    let skippedCount = 0;

    for (const product of products) {
      // Cek apakah produk dengan nama yang sama sudah ada
      const existingProduct = await prisma.product.findFirst({
        where: { name: product.name },
      });

      if (existingProduct) {
        skippedCount++;
        console.log(`⏭️ Skipped: ${product.name} (already exists)`);
      } else {
        await prisma.product.create({
          data: product,
        });
        createdCount++;
      }
    }

    console.log(`✅ Created ${createdCount} new products!`);
    if (skippedCount > 0) {
      console.log(`⏭️ Skipped ${skippedCount} existing products`);
    }

    // Display summary by category - Fixed untuk ES5 compatibility
    const categorySet = new Set<string>();
    products.forEach((p) => categorySet.add(p.category));
    const categories = Array.from(categorySet);
    console.log("\n📊 Summary by category:");
    for (const category of categories) {
      const count = products.filter((p) => p.category === category).length;
      console.log(`   📦 ${category}: ${count} produk`);
    }

    return {
      created: createdCount,
      skipped: skippedCount,
      categories: categories.length,
    };
  } catch (error) {
    console.error("❌ Error in seedProducts:", error);
    throw error;
  }
}

if (require.main === module) {
  seedProducts()
    .catch((e) => {
      console.error("❌ Error seeding products:", e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
