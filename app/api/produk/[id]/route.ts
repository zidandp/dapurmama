import { NextRequest, NextResponse } from "next/server";
import { products } from "@/app/lib/produk-data";

export const GET = async (
  request: NextRequest,
  context: { params: Record<string, string> }
) => {
  const { id } = context.params;
  const product = products.find((p) => p.id === id);
  if (!product) {
    return NextResponse.json(
      { message: "Produk tidak ditemukan" },
      { status: 404 }
    );
  }
  return NextResponse.json(product);
};

export const PATCH = async (
  request: NextRequest,
  context: { params: Record<string, string> }
) => {
  const { id } = context.params;
  const productIndex = products.findIndex((p) => p.id === id);
  if (productIndex === -1) {
    return NextResponse.json(
      { message: "Produk tidak ditemukan" },
      { status: 404 }
    );
  }

  try {
    const body = await request.json();
    const updatedProduct = { ...products[productIndex], ...body };
    products[productIndex] = updatedProduct;
    return NextResponse.json(updatedProduct);
  } catch (error) {
    return NextResponse.json(
      { message: "Gagal memproses request.", error },
      { status: 500 }
    );
  }
};

export const DELETE = async (
  request: NextRequest,
  context: { params: Record<string, string> }
) => {
  const { id } = context.params;
  const productIndex = products.findIndex((p) => p.id === id);
  if (productIndex === -1) {
    return NextResponse.json(
      { message: "Produk tidak ditemukan" },
      { status: 404 }
    );
  }
  const deleted = products.splice(productIndex, 1);
  return NextResponse.json({
    message: "Produk berhasil dihapus",
    product: deleted[0],
  });
};
