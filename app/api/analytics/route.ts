import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, requireAdminAuth } from "@/lib/auth-utils";

export async function GET(request: NextRequest) {
  try {
    // Require admin authentication
    const currentUser = await getCurrentUser(request);
    requireAdminAuth(currentUser);

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    // Parallel queries untuk performance
    const [
      totalProducts,
      activePOSessions,
      todayOrders,
      monthlyRevenue,
      weeklyStats,
      topProducts,
      recentOrders,
      ordersByStatus,
      dailyStats,
    ] = await Promise.all([
      // Total produk aktif
      prisma.product.count({
        where: { isAvailable: true },
      }),

      // Sesi PO aktif
      prisma.pOSession.count({
        where: {
          status: "ACTIVE",
          startDate: { lte: now },
          endDate: { gte: now },
        },
      }),

      // Pesanan hari ini
      prisma.order.count({
        where: {
          createdAt: { gte: startOfDay },
        },
      }),

      // Revenue bulan ini
      prisma.order.aggregate({
        where: {
          createdAt: { gte: startOfMonth },
          status: { in: ["CONFIRMED", "PROCESSING", "READY", "COMPLETED"] },
        },
        _sum: { totalAmount: true },
      }),

      // Stats mingguan untuk growth calculation
      prisma.order.groupBy({
        by: ["status"],
        where: {
          createdAt: { gte: startOfWeek },
        },
        _count: { id: true },
        _sum: { totalAmount: true },
      }),

      // Top 5 produk terlaris
      prisma.orderItem.groupBy({
        by: ["productId"],
        where: {
          order: {
            status: { in: ["CONFIRMED", "PROCESSING", "READY", "COMPLETED"] },
          },
        },
        _sum: { quantity: true },
        _count: { id: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: 5,
      }),

      // 5 pesanan terbaru
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          orderNumber: true,
          customerName: true,
          totalAmount: true,
          status: true,
          createdAt: true,
          poSession: {
            select: { name: true },
          },
        },
      }),

      // Orders by status
      prisma.order.groupBy({
        by: ["status"],
        _count: { id: true },
      }),

      // Daily stats untuk 7 hari terakhir
      prisma.$queryRaw`
        SELECT 
          DATE(created_at) as date,
          COUNT(*)::integer as orders,
          SUM(total_amount)::decimal as revenue
        FROM orders 
        WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `,
    ]);

    // Get product details untuk top products
    const topProductsWithDetails = await Promise.all(
      topProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: { name: true, imageUrl: true, price: true },
        });
        return {
          ...product,
          quantity: item._sum.quantity || 0,
          orders: item._count.id,
        };
      })
    );

    // Calculate growth percentages
    const lastWeekStart = new Date(startOfWeek);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);

    const lastWeekStats = await prisma.order.aggregate({
      where: {
        createdAt: {
          gte: lastWeekStart,
          lt: startOfWeek,
        },
      },
      _count: { id: true },
      _sum: { totalAmount: true },
    });

    const thisWeekOrders = weeklyStats.reduce(
      (sum, stat) => sum + stat._count.id,
      0
    );
    const thisWeekRevenue = weeklyStats.reduce(
      (sum, stat) => sum + Number(stat._sum.totalAmount || 0),
      0
    );

    const orderGrowth =
      lastWeekStats._count.id > 0
        ? ((thisWeekOrders - lastWeekStats._count.id) /
            lastWeekStats._count.id) *
          100
        : 0;

    const revenueGrowth =
      Number(lastWeekStats._sum.totalAmount || 0) > 0
        ? ((thisWeekRevenue - Number(lastWeekStats._sum.totalAmount || 0)) /
            Number(lastWeekStats._sum.totalAmount || 0)) *
          100
        : 0;

    const analytics = {
      overview: {
        totalProducts,
        activePOSessions,
        todayOrders,
        monthlyRevenue: Number(monthlyRevenue._sum.totalAmount || 0),
        orderGrowth: Math.round(orderGrowth * 100) / 100,
        revenueGrowth: Math.round(revenueGrowth * 100) / 100,
      },
      topProducts: topProductsWithDetails,
      recentOrders: recentOrders.map((order) => ({
        ...order,
        totalAmount: Number(order.totalAmount),
      })),
      ordersByStatus: ordersByStatus.reduce((acc, item) => {
        acc[item.status] = item._count.id;
        return acc;
      }, {} as Record<string, number>),
      dailyStats: (dailyStats as any[]).map((stat) => ({
        date: stat.date,
        orders: stat.orders,
        revenue: Number(stat.revenue || 0),
      })),
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error("Failed to fetch analytics:", error);

    if (error instanceof Error) {
      if (error.message === "Authentication required") {
        return NextResponse.json(
          { error: "Token tidak valid atau sudah expired" },
          { status: 401 }
        );
      }
      if (error.message === "Admin access required") {
        return NextResponse.json(
          { error: "Akses admin diperlukan" },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
