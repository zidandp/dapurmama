"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Eye, EyeOff, TrendingUp, AlertTriangle } from "lucide-react";

interface ProductStats {
  total: number;
  available: number;
  unavailable: number;
  categories: Array<{ name: string; count: number }>;
  averagePrice: number;
  recentlyAdded: number;
}

interface ProductStatsProps {
  refreshTrigger: number;
}

export function ProductStats({ refreshTrigger }: ProductStatsProps) {
  const [stats, setStats] = useState<ProductStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/products/stats");
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch product stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [refreshTrigger]);

  if (loading || !stats) {
    return (
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
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Produk</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-xs text-muted-foreground">
            {stats.categories.length} kategori
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tersedia</CardTitle>
          <Eye className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {stats.available}
          </div>
          <p className="text-xs text-muted-foreground">
            {((stats.available / stats.total) * 100).toFixed(1)}% dari total
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tidak Tersedia</CardTitle>
          <EyeOff className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {stats.unavailable}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.unavailable > 0 && (
              <span className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Perlu stok
              </span>
            )}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Rata-rata Harga</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            Rp {stats.averagePrice.toLocaleString("id-ID")}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.recentlyAdded} ditambahkan minggu ini
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
