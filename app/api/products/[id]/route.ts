import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { z } from "zod";

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

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { rows: productFromDb } =
      await sql`SELECT * FROM products WHERE id = ${params.id};`;
    if (productFromDb.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(dbProductToProduct(productFromDb[0]));
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
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

    const { rows: updatedProductFromDb } = await sql`
      UPDATE products
      SET name = ${name}, description = ${description}, price = ${price}, category = ${category}, image_url = ${image}, is_available = ${isAvailable}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *;
    `;
    if (updatedProductFromDb.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    const updatedProduct = dbProductToProduct(updatedProductFromDb[0]);
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Failed to update product:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  try {
    await sql`DELETE FROM products WHERE id = ${id}`;
    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    console.error("Failed to delete product:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
