import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

// Skema validasi untuk data produk yang masuk
const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  image: z.string().url(),
  category: z.string().min(1),
  isAvailable: z.boolean(),
});

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        imageUrl: true,
        category: true,
        isAvailable: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Transform untuk kompatibilitas dengan frontend yang sudah ada
    const transformedProducts = products.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: Number(product.price),
      image: product.imageUrl, // Map imageUrl ke image
      category: product.category,
      isAvailable: product.isAvailable,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }));

    return NextResponse.json(transformedProducts);
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

    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price,
        imageUrl: image, // Map image ke imageUrl
        category,
        isAvailable,
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        imageUrl: true,
        category: true,
        isAvailable: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Transform untuk kompatibilitas dengan frontend
    const transformedProduct = {
      id: newProduct.id,
      name: newProduct.name,
      description: newProduct.description,
      price: Number(newProduct.price),
      image: newProduct.imageUrl,
      category: newProduct.category,
      isAvailable: newProduct.isAvailable,
      createdAt: newProduct.createdAt,
      updatedAt: newProduct.updatedAt,
    };

    return NextResponse.json(transformedProduct, { status: 201 });
  } catch (error) {
    console.error("Failed to create product:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
