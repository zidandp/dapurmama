import { NextResponse } from 'next/server';
import { products } from '@/app/lib/produk-data';
import { Product } from '@/app/lib/definitions';

// GET handler to fetch all products
export async function GET() {
  return NextResponse.json(products);
}

// POST handler to add a new product
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, price, description } = body;

    // Simple validation
    if (!name || !price || typeof price !== 'number' || !description) {
      return NextResponse.json({ message: 'Input tidak valid. Pastikan nama, harga (angka), dan deskripsi diisi.' }, { status: 400 });
    }

    const newProduct: Product = {
      id: Date.now().toString(), // Simple ID generation
      name,
      price,
      description,
    };

    products.push(newProduct);

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Gagal memproses request.', error }, { status: 500 });
  }
}
