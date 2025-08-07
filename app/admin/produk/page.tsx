"use client";

import { useState } from "react";
import { ProductDataTable } from "@/components/admin/products/ProductDataTable";
import { ProductStats } from "@/components/admin/products/ProductStats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Plus } from "lucide-react";

export default function AdminProductsPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Package className="h-6 w-6" />
          Manajemen Produk
        </h1>
        <p className="text-muted-foreground">
          Kelola katalog produk, harga, dan ketersediaan
        </p>
      </div>

      {/* Product Stats */}
      <ProductStats refreshTrigger={refreshTrigger} />

      {/* Product Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Produk</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductDataTable
            refreshTrigger={refreshTrigger}
            onDataChange={triggerRefresh}
          />
        </CardContent>
      </Card>
    </div>
  );
}
