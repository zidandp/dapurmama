import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const now = new Date();

    const activePOSessions = await prisma.pOSession.findMany({
      where: {
        status: "ACTIVE",
        startDate: {
          lte: now,
        },
        endDate: {
          gte: now,
        },
      },
      include: {
        poSessionProducts: {
          include: {
            product: {
              // HAPUS bagian where ini - tidak valid di nested include
              select: {
                id: true,
                name: true,
                description: true,
                price: true,
                imageUrl: true,
                category: true,
                isAvailable: true,
              },
            },
          },
        },
      },
      orderBy: {
        startDate: "desc",
      },
    });

    // Transform data untuk frontend dengan filtering manual
    const transformedSessions = activePOSessions.map((session) => ({
      id: session.id,
      name: session.name,
      description: session.description,
      startDate: session.startDate.toISOString(),
      endDate: session.endDate.toISOString(),
      status: session.status,
      products: session.poSessionProducts
        // Filter produk yang tersedia di level JavaScript
        .filter((psp) => psp.product && psp.product.isAvailable)
        .map((psp) => ({
          id: psp.product.id,
          name: psp.product.name,
          description: psp.product.description,
          price: Number(psp.product.price),
          image: psp.product.imageUrl,
          category: psp.product.category,
          isAvailable: psp.product.isAvailable,
        })),
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    }));

    return NextResponse.json(transformedSessions);
  } catch (error) {
    console.error("Failed to fetch active PO sessions:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
