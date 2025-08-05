import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const poSessionSchema = z
  .object({
    name: z.string().min(1, "Nama sesi PO tidak boleh kosong"),
    description: z.string().optional(),
    startDate: z.string().datetime("Format tanggal mulai tidak valid"),
    endDate: z.string().datetime("Format tanggal selesai tidak valid"),
    status: z.enum(["DRAFT", "ACTIVE", "CLOSED"]),
    productIds: z
      .array(z.string().uuid("ID produk tidak valid"))
      .min(1, "Minimal pilih 1 produk"),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "Tanggal selesai harus setelah tanggal mulai",
    path: ["endDate"],
  });

// GET single PO session
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const poSession = await prisma.pOSession.findUnique({
      where: { id: params.id },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        poSessionProducts: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                imageUrl: true,
                category: true,
                description: true,
                isAvailable: true,
              },
            },
          },
        },
        _count: {
          select: {
            orders: true,
          },
        },
      },
    });

    if (!poSession) {
      return NextResponse.json(
        { error: "PO Session not found" },
        { status: 404 }
      );
    }

    // Transform untuk response
    const transformedSession = {
      id: poSession.id,
      name: poSession.name,
      description: poSession.description,
      startDate: poSession.startDate.toISOString(),
      endDate: poSession.endDate.toISOString(),
      status: poSession.status,
      createdBy: poSession.createdBy,
      products: poSession.poSessionProducts.map((psp) => ({
        id: psp.product.id,
        name: psp.product.name,
        price: Number(psp.product.price),
        image: psp.product.imageUrl,
        category: psp.product.category,
        description: psp.product.description,
        isAvailable: psp.product.isAvailable,
      })),
      totalOrders: poSession._count.orders,
      createdAt: poSession.createdAt,
      updatedAt: poSession.updatedAt,
    };

    return NextResponse.json(transformedSession);
  } catch (error) {
    console.error("Failed to fetch PO session:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PUT update PO session
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validation = poSessionSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, description, startDate, endDate, status, productIds } =
      validation.data;

    // Update dengan transaction
    const updatedPOSession = await prisma.$transaction(async (tx) => {
      // Update POSession
      const poSession = await tx.pOSession.update({
        where: { id: params.id },
        data: {
          name,
          description,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          status,
        },
      });

      // Hapus relasi produk yang lama
      await tx.pOSessionProduct.deleteMany({
        where: { poSessionId: params.id },
      });

      // Buat relasi produk yang baru
      await tx.pOSessionProduct.createMany({
        data: productIds.map((productId) => ({
          poSessionId: params.id,
          productId,
        })),
      });

      return poSession;
    });

    // Fetch data lengkap untuk response
    const fullPOSession = await prisma.pOSession.findUnique({
      where: { id: params.id },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        poSessionProducts: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                imageUrl: true,
                category: true,
              },
            },
          },
        },
        _count: {
          select: {
            orders: true,
          },
        },
      },
    });

    // Transform untuk response
    const transformedSession = {
      id: fullPOSession!.id,
      name: fullPOSession!.name,
      description: fullPOSession!.description,
      startDate: fullPOSession!.startDate.toISOString(),
      endDate: fullPOSession!.endDate.toISOString(),
      status: fullPOSession!.status,
      createdBy: fullPOSession!.createdBy,
      products: fullPOSession!.poSessionProducts.map((psp) => ({
        id: psp.product.id,
        name: psp.product.name,
        price: Number(psp.product.price),
        image: psp.product.imageUrl,
        category: psp.product.category,
      })),
      totalOrders: fullPOSession!._count.orders,
      createdAt: fullPOSession!.createdAt,
      updatedAt: fullPOSession!.updatedAt,
    };

    return NextResponse.json(transformedSession);
  } catch (error) {
    // Type-safe error handling untuk Prisma errors
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { error: "PO Session not found" },
        { status: 404 }
      );
    }

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Failed to update PO session:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE PO session
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Cek apakah ada pesanan yang terkait
    const orderCount = await prisma.order.count({
      where: { poSessionId: params.id },
    });

    if (orderCount > 0) {
      return NextResponse.json(
        { error: "Tidak dapat menghapus sesi PO yang sudah memiliki pesanan" },
        { status: 400 }
      );
    }

    // Hapus POSession (POSessionProduct akan terhapus otomatis karena cascade)
    await prisma.pOSession.delete({
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
      return NextResponse.json(
        { error: "PO Session not found" },
        { status: 404 }
      );
    }

    console.error("Failed to delete PO session:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
