"use client";

import { useState } from "react";
import { Search, Package, AlertCircle, Loader2 } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { OrderTimeline } from "@/components/track/OrderTimeline";
import { useDebounce } from "@/hooks/use-debounce";

interface OrderTrackingData {
  id: string;
  orderNumber: string;
  customerName: string;
  totalAmount: number;
  status: string;
  items: {
    id: string;
    productName: string;
    quantity: number;
    price: number;
    subtotal: number;
  }[];
  createdAt: string;
  updatedAt: string;
}

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [orderData, setOrderData] = useState<OrderTrackingData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const debouncedOrderNumber = useDebounce(orderNumber, 300);

  const validateOrderNumber = (input: string): boolean => {
    // Format: DM-YYMMDD-XXXX
    const orderNumberRegex = /^DM-\d{6}-\d{4}$/;
    return orderNumberRegex.test(input);
  };

  const searchOrder = async (orderNum: string) => {
    if (!orderNum.trim()) {
      setError("");
      setOrderData(null);
      setHasSearched(false);
      return;
    }

    if (!validateOrderNumber(orderNum)) {
      setError("Format nomor pesanan tidak valid. Contoh: DM-240101-0001");
      setOrderData(null);
      setHasSearched(true);
      return;
    }

    setIsLoading(true);
    setError("");
    setHasSearched(true);

    try {
      const response = await fetch(`/api/track/${orderNum}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Pesanan tidak ditemukan");
        }
        throw new Error("Terjadi kesalahan saat mencari pesanan");
      }

      const data = await response.json();
      setOrderData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      setOrderData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    searchOrder(orderNumber);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusDisplay = (status: string) => {
    const statusMap = {
      PENDING: "Menunggu Konfirmasi",
      CONFIRMED: "Dikonfirmasi",
      PROCESSING: "Sedang Diproses",
      READY: "Siap Diambil",
      COMPLETED: "Selesai",
      CANCELLED: "Dibatalkan",
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container-custom py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Package className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">Lacak Pesanan</h1>
            <p className="text-muted-foreground">
              Masukkan nomor pesanan Anda untuk melihat status terkini
            </p>
          </div>

          {/* Search Section */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Nomor Pesanan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="DM-240101-0001"
                    value={orderNumber}
                    onChange={(e) =>
                      setOrderNumber(e.target.value.toUpperCase())
                    }
                    onKeyPress={handleKeyPress}
                    className="font-mono"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Masukkan nomor pesanan Anda (contoh: DM-240101-0001)
                  </p>
                </div>
                <Button
                  onClick={handleSearch}
                  disabled={isLoading || !orderNumber.trim()}
                  className="min-w-[100px]"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Cari
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Results Section */}
          {hasSearched && !isLoading && !error && !orderData && (
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Pesanan tidak ditemukan. Pastikan nomor pesanan yang Anda
                masukkan benar.
              </AlertDescription>
            </Alert>
          )}

          {/* Order Details */}
          {orderData && (
            <div className="space-y-6">
              {/* Order Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Detail Pesanan
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Nomor Pesanan
                      </label>
                      <p className="font-mono font-semibold">
                        {orderData.orderNumber}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Nama Pemesan
                      </label>
                      <p className="font-semibold">{orderData.customerName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Total Pembayaran
                      </label>
                      <p className="font-semibold text-lg text-primary">
                        {formatCurrency(orderData.totalAmount)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Status Saat Ini
                      </label>
                      <p className="font-semibold">
                        {getStatusDisplay(orderData.status)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Timeline */}
              <OrderTimeline
                status={orderData.status}
                timestamps={{
                  createdAt: orderData.createdAt,
                  updatedAt: orderData.updatedAt,
                }}
              />

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Item Pesanan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {orderData.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center p-3 border rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{item.productName}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.quantity} x {formatCurrency(item.price)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            {formatCurrency(item.subtotal)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
