import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

// Schema validasi untuk Order
const orderSchema = z.object({
  customerName: z.string().min(1, "Nama pelanggan tidak boleh kosong"),
  customerPhone: z.string().min(1, "Nomor telepon tidak boleh kosong"),
  customerAddress: z.string().min(1, "Alamat tidak boleh kosong"),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.string().uuid("ID produk tidak valid"),
        quantity: z.number().min(1, "Quantity minimal 1"),
        price: z.number().positive("Harga harus positif"),
      })
    )
    .min(1, "Minimal 1 item dalam pesanan"),
  poSessionId: z.string().uuid("ID sesi PO tidak valid").nullable().optional(), // PERBAIKAN: tambah .nullable()
});

// GET all orders (untuk admin)
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: {
        createdAt: "desc",
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

    // Transform data untuk frontend
    const transformedOrders = orders.map((order) => ({
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
        quantity: item.quantity,
        price: Number(item.price),
        subtotal: Number(item.subtotal),
      })),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }));

    return NextResponse.json(transformedOrders);
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST create new order
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = orderSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const {
      customerName,
      customerPhone,
      customerAddress,
      notes,
      items,
      poSessionId,
    } = validation.data;

    // Generate unique order number
    const orderNumber = await generateOrderNumber();

    // Calculate total amount
    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Validasi PO Session jika ada
    if (poSessionId) {
      const poSession = await prisma.pOSession.findUnique({
        where: { id: poSessionId },
      });

      if (!poSession) {
        return NextResponse.json(
          { error: "Sesi PO tidak ditemukan" },
          { status: 400 }
        );
      }

      if (poSession.status !== "ACTIVE") {
        return NextResponse.json(
          { error: "Sesi PO tidak aktif" },
          { status: 400 }
        );
      }

      // Cek apakah masih dalam periode
      const now = new Date();
      if (now < poSession.startDate || now > poSession.endDate) {
        return NextResponse.json(
          { error: "Sesi PO sudah berakhir atau belum dimulai" },
          { status: 400 }
        );
      }
    }

    // Validasi produk tersedia
    const productIds = items.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        isAvailable: true,
      },
    });

    if (products.length !== productIds.length) {
      return NextResponse.json(
        { error: "Beberapa produk tidak tersedia" },
        { status: 400 }
      );
    }

    // Buat order dengan transaction
    const newOrder = await prisma.$transaction(async (tx) => {
      // Buat order
      const order = await tx.order.create({
        data: {
          orderNumber,
          customerName,
          customerPhone,
          customerAddress,
          notes,
          totalAmount,
          status: "PENDING",
          poSessionId,
        },
      });

      // Buat order items
      await tx.orderItem.createMany({
        data: items.map((item) => ({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.price * item.quantity,
        })),
      });

      return order;
    });

    // Fetch data lengkap untuk response
    const fullOrder = await prisma.order.findUnique({
      where: { id: newOrder.id },
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
      id: fullOrder!.id,
      orderNumber: fullOrder!.orderNumber,
      customerName: fullOrder!.customerName,
      customerPhone: fullOrder!.customerPhone,
      customerAddress: fullOrder!.customerAddress,
      notes: fullOrder!.notes,
      totalAmount: Number(fullOrder!.totalAmount),
      status: fullOrder!.status,
      poSession: fullOrder!.poSession,
      items: fullOrder!.orderItems.map((item) => ({
        id: item.id,
        productId: item.productId,
        productName: item.product.name,
        productImage: item.product.imageUrl,
        productCategory: item.product.category,
        quantity: item.quantity,
        price: Number(item.price),
        subtotal: Number(item.subtotal),
      })),
      createdAt: fullOrder!.createdAt,
      updatedAt: fullOrder!.updatedAt,
    };

    return NextResponse.json(transformedOrder, { status: 201 });
  } catch (error) {
    console.error("Failed to create order:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Helper function untuk generate order number
async function generateOrderNumber(): Promise<string> {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");

  // Format: DM-YYMMDD-XXXX
  const prefix = `DM-${year}${month}${day}`;

  // Cari order terakhir hari ini
  const lastOrder = await prisma.order.findFirst({
    where: {
      orderNumber: {
        startsWith: prefix,
      },
    },
    orderBy: {
      orderNumber: "desc",
    },
  });

  let sequence = 1;
  if (lastOrder) {
    const lastSequence = parseInt(lastOrder.orderNumber.split("-")[2]);
    sequence = lastSequence + 1;
  }

  return `${prefix}-${sequence.toString().padStart(4, "0")}`;
}
