import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [
      total,
      available,
      unavailable,
      categories,
      averagePrice,
      recentlyAdded,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { isAvailable: true } }),
      prisma.product.count({ where: { isAvailable: false } }),
      prisma.product.groupBy({
        by: ["category"],
        _count: { category: true },
        orderBy: { _count: { category: "desc" } },
      }),
      prisma.product.aggregate({
        _avg: { price: true },
      }),
      prisma.product.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
          },
        },
      }),
    ]);

    const stats = {
      total,
      available,
      unavailable,
      categories: categories.map((cat) => ({
        name: cat.category,
        count: cat._count.category,
      })),
      averagePrice: Math.round(Number(averagePrice._avg.price || 0)),
      recentlyAdded,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Failed to fetch product stats:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
