"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Package,
  Calendar,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Clock,
} from "lucide-react";
import { formatPrice } from "@/lib/data";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface Analytics {
  overview: {
    totalProducts: number;
    activePOSessions: number;
    todayOrders: number;
    monthlyRevenue: number;
    orderGrowth: number;
    revenueGrowth: number;
  };
  topProducts: Array<{
    name: string;
    imageUrl: string;
    price: number;
    quantity: number;
    orders: number;
  }>;
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    customerName: string;
    totalAmount: number;
    status: string;
    createdAt: Date;
    poSession?: { name: string };
  }>;
  ordersByStatus: Record<string, number>;
  dailyStats: Array<{
    date: string;
    orders: number;
    revenue: number;
  }>;
}

const statusColors = {
  PENDING: "#fbbf24",
  CONFIRMED: "#3b82f6",
  PROCESSING: "#8b5cf6",
  READY: "#f97316",
  COMPLETED: "#10b981",
  CANCELLED: "#ef4444",
};

const statusLabels = {
  PENDING: "Menunggu",
  CONFIRMED: "Dikonfirmasi",
  PROCESSING: "Diproses",
  READY: "Siap",
  COMPLETED: "Selesai",
  CANCELLED: "Dibatalkan",
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem("admin_token");
        if (!token) return;

        const response = await fetch("/api/analytics", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setAnalytics(data);
        }
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-8 bg-muted rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  const pieData = Object.entries(analytics.ordersByStatus).map(
    ([status, count]) => ({
      name: statusLabels[status as keyof typeof statusLabels],
      value: count,
      color: statusColors[status as keyof typeof statusColors],
    })
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Selamat datang kembali, {user?.name}!
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Produk</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.overview.totalProducts}
            </div>
            <p className="text-xs text-muted-foreground">Produk aktif</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sesi PO Aktif</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.overview.activePOSessions}
            </div>
            <p className="text-xs text-muted-foreground">Sedang berjalan</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pesanan Hari Ini
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.overview.todayOrders}
            </div>
            <div className="flex items-center text-xs">
              {analytics.overview.orderGrowth >= 0 ? (
                <>
                  <ArrowUpRight className="h-3 w-3 text-green-600 mr-1" />
                  <span className="text-green-600">
                    +{analytics.overview.orderGrowth}%
                  </span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="h-3 w-3 text-red-600 mr-1" />
                  <span className="text-red-600">
                    {analytics.overview.orderGrowth}%
                  </span>
                </>
              )}
              <span className="text-muted-foreground ml-1">vs minggu lalu</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Revenue Bulan Ini
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(analytics.overview.monthlyRevenue)}
            </div>
            <div className="flex items-center text-xs">
              {analytics.overview.revenueGrowth >= 0 ? (
                <>
                  <ArrowUpRight className="h-3 w-3 text-green-600 mr-1" />
                  <span className="text-green-600">
                    +{analytics.overview.revenueGrowth}%
                  </span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="h-3 w-3 text-red-600 mr-1" />
                  <span className="text-red-600">
                    {analytics.overview.revenueGrowth}%
                  </span>
                </>
              )}
              <span className="text-muted-foreground ml-1">vs minggu lalu</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Tren Penjualan (7 Hari Terakhir)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.dailyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "short",
                    })
                  }
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("id-ID")
                  }
                  formatter={(value: any, name: string) => [
                    name === "revenue" ? formatPrice(Number(value)) : value,
                    name === "revenue" ? "Revenue" : "Orders",
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Status Pesanan</CardTitle>
            <CardDescription>
              Distribusi status pesanan saat ini
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {pieData.map((entry, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span>{entry.name}</span>
                  </div>
                  <span className="font-medium">{entry.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Produk Terlaris</CardTitle>
            <CardDescription>
              5 produk dengan penjualan tertinggi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topProducts.map((product, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="relative w-10 h-10">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute -top-1 -left-1 w-5 h-5 bg-primary text-primary-foreground text-xs flex items-center justify-center rounded-full">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {product.quantity} terjual
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {product.orders} pesanan
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Pesanan Terbaru</CardTitle>
            <CardDescription>5 pesanan yang baru masuk</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <div>
                      <p className="text-sm font-medium">{order.orderNumber}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-muted-foreground">
                          {order.customerName}
                        </p>
                        {order.poSession && (
                          <Badge variant="outline" className="text-xs">
                            <Calendar className="h-2 w-2 mr-1" />
                            PO
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {formatPrice(order.totalAmount)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
