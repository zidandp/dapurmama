import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { z } from "zod";

// Skema validasi untuk data produk yang masuk
const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  image: z.string().url(),
  category: z.string().min(1),
  isAvailable: z.boolean(),
});

// Fungsi untuk memetakan hasil DB (snake_case) ke objek Product (camelCase)
const dbProductToProduct = (dbProduct: any) => ({
  id: dbProduct.id,
  name: dbProduct.name,
  description: dbProduct.description,
  price: parseFloat(dbProduct.price),
  image: dbProduct.image_url,
  category: dbProduct.category,
  isAvailable: dbProduct.is_available,
});

export async function GET() {
  try {
    const { rows: productsFromDb } =
      await sql`SELECT * FROM products ORDER BY created_at DESC;`;
    // Transformasi data sebelum dikirim ke client
    const products = productsFromDb.map(dbProductToProduct);
    return NextResponse.json(products);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = productSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, description, price, category, image, isAvailable } =
      validation.data;

    const { rows: newProductFromDb } = await sql`
      INSERT INTO products (name, description, price, image_url, category, is_available)
      VALUES (${name}, ${description}, ${price}, ${image}, ${category}, ${isAvailable})
      RETURNING *;
    `;
    const newProduct = dbProductToProduct(newProductFromDb[0]);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Failed to create product:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
