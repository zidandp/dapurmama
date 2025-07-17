import { NextResponse } from 'next/server';
import { products } from '@/app/lib/produk-data';

// GET handler for a single product by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const product = products.find((p) => p.id === params.id);
  if (!product) {
    return NextResponse.json({ message: 'Produk tidak ditemukan' }, { status: 404 });
  }
  return NextResponse.json(product);
}

// PATCH handler to update a product by ID
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const productIndex = products.findIndex((p) => p.id === params.id);
  if (productIndex === -1) {
    return NextResponse.json({ message: 'Produk tidak ditemukan' }, { status: 404 });
  }

  try {
    const body = await request.json();
    const originalProduct = products[productIndex];

    // Update fields that are provided in the request body
    const updatedProduct = {
      ...originalProduct,
      ...body,
    };

    products[productIndex] = updatedProduct;

    return NextResponse.json(updatedProduct);
  } catch (error) {
    return NextResponse.json({ message: 'Gagal memproses request.', error }, { status: 500 });
  }
}

// DELETE handler to remove a product by ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const productIndex = products.findIndex((p) => p.id === params.id);
  if (productIndex === -1) {
    return NextResponse.json({ message: 'Produk tidak ditemukan' }, { status: 404 });
  }

  const deletedProduct = products.splice(productIndex, 1);

  return NextResponse.json({ message: 'Produk berhasil dihapus', product: deletedProduct[0] });
}
