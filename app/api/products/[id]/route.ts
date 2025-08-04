import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(1, "Nama produk harus diisi"),
  price: z.number().min(0, "Harga harus lebih besar atau sama dengan 0"),
  imageUrl: z.string().url("URL gambar tidak valid"),
  description: z.string().min(1, "Deskripsi produk harus diisi"),
  category: z.string().min(1, "Kategori harus diisi"),
  isAvailable: z.boolean(),
});

// GET single product
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Transform untuk konsistensi dengan format yang diharapkan frontend
    const transformedProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.imageUrl, // Transform imageUrl ke image untuk frontend
      description: product.description,
      category: product.category,
      isAvailable: product.isAvailable,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };

    return NextResponse.json(transformedProduct);
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PUT update product
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    // Transform image ke imageUrl untuk database
    if (body.image) {
      body.imageUrl = body.image;
      delete body.image;
    }

    // Validasi data dengan Zod
    const validatedData = productSchema.parse(body);

    const updatedProduct = await prisma.product.update({
      where: { id: params.id },
      data: validatedData,
    });

    // Transform untuk konsistensi dengan format yang diharapkan frontend
    const transformedProduct = {
      id: updatedProduct.id,
      name: updatedProduct.name,
      price: updatedProduct.price,
      image: updatedProduct.imageUrl, // Transform imageUrl ke image untuk frontend
      description: updatedProduct.description,
      category: updatedProduct.category,
      isAvailable: updatedProduct.isAvailable,
      createdAt: updatedProduct.createdAt,
      updatedAt: updatedProduct.updatedAt,
    };

    return NextResponse.json(transformedProduct);
  } catch (error) {
    // Type-safe error handling untuk Prisma errors
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Failed to update product:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE product
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.product.delete({
      where: { id: params.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    // Type-safe error handling untuk Prisma errors
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    console.error("Failed to delete product:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
