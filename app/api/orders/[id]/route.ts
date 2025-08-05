import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateOrderSchema = z.object({
  status: z.enum([
    "PENDING",
    "CONFIRMED",
    "PROCESSING",
    "READY",
    "COMPLETED",
    "CANCELLED",
  ]),
  notes: z.string().optional(),
});

// GET single order
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
                category: true,
                description: true,
              },
            },
          },
        },
        poSession: {
          select: {
            id: true,
            name: true,
            status: true,
            startDate: true,
            endDate: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Transform untuk response
    const transformedOrder = {
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      customerAddress: order.customerAddress,
      notes: order.notes,
      totalAmount: Number(order.totalAmount),
      status: order.status,
      poSession: order.poSession,
      items: order.orderItems.map((item) => ({
        id: item.id,
        productId: item.productId,
        productName: item.product.name,
        productImage: item.product.imageUrl,
        productCategory: item.product.category,
        productDescription: item.product.description,
        quantity: item.quantity,
        price: Number(item.price),
        subtotal: Number(item.subtotal),
      })),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };

    return NextResponse.json(transformedOrder);
  } catch (error) {
    console.error("Failed to fetch order:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PUT update order (untuk admin)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validation = updateOrderSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { status, notes } = validation.data;

    const updatedOrder = await prisma.order.update({
      where: { id: params.id },
      data: {
        status,
        ...(notes !== undefined && { notes }),
      },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
                category: true,
              },
            },
          },
        },
        poSession: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
      },
    });

    // Transform untuk response
    const transformedOrder = {
      id: updatedOrder.id,
      orderNumber: updatedOrder.orderNumber,
      customerName: updatedOrder.customerName,
      customerPhone: updatedOrder.customerPhone,
      customerAddress: updatedOrder.customerAddress,
      notes: updatedOrder.notes,
      totalAmount: Number(updatedOrder.totalAmount),
      status: updatedOrder.status,
      poSession: updatedOrder.poSession,
      items: updatedOrder.orderItems.map((item) => ({
        id: item.id,
        productId: item.productId,
        productName: item.product.name,
        productImage: item.product.imageUrl,
        productCategory: item.product.category,
        quantity: item.quantity,
        price: Number(item.price),
        subtotal: Number(item.subtotal),
      })),
      createdAt: updatedOrder.createdAt,
      updatedAt: updatedOrder.updatedAt,
    };

    return NextResponse.json(transformedOrder);
  } catch (error) {
    // Type-safe error handling untuk Prisma errors
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Failed to update order:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE order (untuk admin - hanya jika status PENDING atau CANCELLED)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Cek status order terlebih dahulu
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      select: { status: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (!["PENDING", "CANCELLED"].includes(order.status)) {
      return NextResponse.json(
        {
          error:
            "Hanya dapat menghapus pesanan dengan status PENDING atau CANCELLED",
        },
        { status: 400 }
      );
    }

    // Hapus order (OrderItems akan terhapus otomatis karena cascade)
    await prisma.order.delete({
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
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    console.error("Failed to delete order:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
