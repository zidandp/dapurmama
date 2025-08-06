import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Schema validasi untuk order number
const orderNumberSchema = z
  .string()
  .regex(/^DM-\d{6}-\d{4}$/, "Format nomor pesanan tidak valid");

// Rate limiting cache (sederhana, untuk production gunakan Redis)
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // maksimal 10 request per menit
const RATE_WINDOW = 60 * 1000; // 1 menit

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userLimit = requestCounts.get(ip);

  if (!userLimit || now > userLimit.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }

  if (userLimit.count >= RATE_LIMIT) {
    return false;
  }

  userLimit.count++;
  return true;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { orderNumber: string } }
) {
  try {
    // Rate limiting check
    const ip =
      request.ip || request.headers.get("x-forwarded-for") || "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Terlalu banyak permintaan. Coba lagi dalam beberapa saat." },
        { status: 429 }
      );
    }

    // Validasi format order number
    const { orderNumber } = params;
    const validationResult = orderNumberSchema.safeParse(orderNumber);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Format nomor pesanan tidak valid" },
        { status: 400 }
      );
    }

    // Cari pesanan berdasarkan order number
    const order = await prisma.order.findUnique({
      where: {
        orderNumber: orderNumber,
      },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                name: true,
              },
            },
          },
        },
        poSession: {
          select: {
            name: true,
            status: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Pesanan tidak ditemukan" },
        { status: 404 }
      );
    }

    // Transform data untuk client (sembunyikan info sensitif)
    const trackingData = {
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      // customerPhone disembunyikan untuk keamanan
      totalAmount: Number(order.totalAmount),
      status: order.status,
      items: order.orderItems.map((item) => ({
        id: item.id,
        productName: item.product.name,
        quantity: item.quantity,
        price: Number(item.price),
        subtotal: Number(item.subtotal),
      })),
      poSession: order.poSession
        ? {
            name: order.poSession.name,
            status: order.poSession.status,
          }
        : null,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    };

    // Set cache headers untuk performa
    const response = NextResponse.json(trackingData);
    response.headers.set(
      "Cache-Control",
      "public, max-age=300, stale-while-revalidate=60"
    );

    return response;
  } catch (error) {
    console.error("Failed to track order:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
