import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

// Schema validasi untuk Order - FIXED
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
  poSessionId: z.string().uuid("ID sesi PO tidak valid").nullish(), // FIXED: gunakan nullish() untuk handle undefined/null
});

// Function untuk generate order number
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
    console.log("🛒 Processing new order...");

    const body = await request.json();
    console.log("📦 Received order data:", JSON.stringify(body, null, 2));

    const validation = orderSchema.safeParse(body);

    if (!validation.success) {
      console.error("❌ Validation failed:", validation.error.flatten());
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.error.flatten().fieldErrors,
        },
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

    console.log("✅ Validation passed, processing order...");

    // Generate unique order number
    const orderNumber = await generateOrderNumber();
    console.log("📋 Generated order number:", orderNumber);

    // Calculate total amount
    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    console.log("💰 Total amount:", totalAmount);

    // Validasi PO Session jika ada
    if (poSessionId) {
      console.log("🔍 Checking PO Session:", poSessionId);
      const poSession = await prisma.pOSession.findUnique({
        where: { id: poSessionId },
      });

      if (!poSession) {
        console.error("❌ PO Session not found:", poSessionId);
        return NextResponse.json(
          { error: "Sesi PO tidak ditemukan" },
          { status: 400 }
        );
      }
      console.log("✅ PO Session valid:", poSession.name);
    }

    // Validasi products
    console.log("🔍 Validating products...");
    const productIds = items.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        isAvailable: true,
      },
    });

    if (products.length !== productIds.length) {
      console.error("❌ Some products not found or not available");
      return NextResponse.json(
        { error: "Beberapa produk tidak tersedia" },
        { status: 400 }
      );
    }
    console.log("✅ All products valid");

    // Create order dalam transaction
    console.log("💾 Creating order in database...");
    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          customerName,
          customerPhone,
          customerAddress,
          notes: notes || "",
          totalAmount,
          poSessionId: poSessionId || null,
        },
      });

      // Create order items
      const orderItems = await Promise.all(
        items.map((item) => {
          const subtotal = item.price * item.quantity;
          return tx.orderItem.create({
            data: {
              orderId: newOrder.id,
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
              subtotal,
            },
          });
        })
      );

      return { order: newOrder, items: orderItems };
    });

    console.log("✅ Order created successfully:", order.order.id);

    // Return success response
    return NextResponse.json({
      success: true,
      order: {
        id: order.order.id,
        orderNumber: order.order.orderNumber,
        totalAmount: Number(order.order.totalAmount),
        status: order.order.status,
      },
    });
  } catch (error) {
    console.error("❌ Error creating order:", error);

    // Handle unknown error type
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    const errorStack = error instanceof Error ? error.stack : undefined;

    // Detailed error logging
    console.error("Error message:", errorMessage);
    if (errorStack) {
      console.error("Error stack:", errorStack);
    }

    return NextResponse.json(
      {
        error: "Internal Server Error",
        message:
          process.env.NODE_ENV === "development"
            ? errorMessage
            : "Failed to create order",
      },
      { status: 500 }
    );
  }
}
