"use client";

import { useState, useEffect, useMemo } from "react";
import { Order } from "@/lib/types";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  MoreHorizontal,
  Eye,
  Phone,
  MapPin,
  Calendar,
  Package,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { formatPrice } from "@/lib/data";

interface OrderDataTableProps {
  onStatsUpdate: (orders: Order[]) => void;
}

async function fetchOrders(): Promise<Order[]> {
  const token = localStorage.getItem("admin_token");
  if (!token) {
    throw new Error("Token tidak ditemukan");
  }

  const res = await fetch("/api/orders", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem("admin_token");
      window.location.href = "/admin/login";
      return [];
    }
    throw new Error("Failed to fetch orders");
  }
  return res.json();
}

async function updateOrderStatus(id: string, status: string): Promise<void> {
  const token = localStorage.getItem("admin_token");
  if (!token) {
    throw new Error("Token tidak ditemukan");
  }

  const res = await fetch(`/api/orders/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    throw new Error("Failed to update order status");
  }
}

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  CONFIRMED: "bg-blue-100 text-blue-800 border-blue-200",
  PROCESSING: "bg-purple-100 text-purple-800 border-purple-200",
  READY: "bg-orange-100 text-orange-800 border-orange-200",
  COMPLETED: "bg-green-100 text-green-800 border-green-200",
  CANCELLED: "bg-red-100 text-red-800 border-red-200",
};

const statusLabels = {
  PENDING: "Menunggu",
  CONFIRMED: "Dikonfirmasi",
  PROCESSING: "Diproses",
  READY: "Siap",
  COMPLETED: "Selesai",
  CANCELLED: "Dibatalkan",
};

export function OrderDataTable({ onStatsUpdate }: OrderDataTableProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [poFilter, setPOFilter] = useState<string>("all");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const loadOrders = async () => {
    try {
      const data = await fetchOrders();
      setOrders(data);
      onStatsUpdate(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memuat daftar pesanan.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // Filter and search logic
  const filteredOrders = useMemo(() => {
    let filtered = orders;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.customerName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          order.customerPhone.includes(searchQuery)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    // PO filter
    if (poFilter === "po") {
      filtered = filtered.filter((order) => order.poSession);
    } else if (poFilter === "regular") {
      filtered = filtered.filter((order) => !order.poSession);
    }

    return filtered;
  }, [orders, searchQuery, statusFilter, poFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, poFilter]);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      await loadOrders();
      toast({
        title: "Sukses",
        description: `Status pesanan berhasil diubah menjadi ${
          statusLabels[newStatus as keyof typeof statusLabels]
        }.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mengubah status pesanan.",
        variant: "destructive",
      });
    }
  };

  const openDetail = (order: Order) => {
    setSelectedOrder(order);
    setDetailOpen(true);
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse flex space-x-4 p-4">
            <div className="rounded-full bg-muted h-10 w-10"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Cari berdasarkan nomor order, nama, atau telepon..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="PENDING">Menunggu</SelectItem>
            <SelectItem value="CONFIRMED">Dikonfirmasi</SelectItem>
            <SelectItem value="PROCESSING">Diproses</SelectItem>
            <SelectItem value="READY">Siap</SelectItem>
            <SelectItem value="COMPLETED">Selesai</SelectItem>
            <SelectItem value="CANCELLED">Dibatalkan</SelectItem>
          </SelectContent>
        </Select>

        <Select value={poFilter} onValueChange={setPOFilter}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Filter Tipe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Tipe</SelectItem>
            <SelectItem value="po">Pre-Order</SelectItem>
            <SelectItem value="regular">Regular</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results Summary */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-muted-foreground">
          Menampilkan {paginatedOrders.length} dari {filteredOrders.length}{" "}
          pesanan
          {searchQuery && ` (dicari: "${searchQuery}")`}
        </p>

        <Select
          value={itemsPerPage.toString()}
          onValueChange={(value) => setItemsPerPage(Number(value))}
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="25">25</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order #</TableHead>
              <TableHead>Pelanggan</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedOrders.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                >
                  {filteredOrders.length === 0 && searchQuery
                    ? `Tidak ada pesanan yang cocok dengan "${searchQuery}"`
                    : "Belum ada pesanan"}
                </TableCell>
              </TableRow>
            ) : (
              paginatedOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{order.orderNumber}</span>
                      {order.poSession && (
                        <Badge variant="outline" className="text-xs w-fit mt-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          PO
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{order.customerName}</span>
                      <span className="text-sm text-muted-foreground">
                        {order.customerPhone}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span>{order.items.length} item</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatPrice(order.totalAmount)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        statusColors[order.status as keyof typeof statusColors]
                      }
                    >
                      {statusLabels[order.status as keyof typeof statusLabels]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openDetail(order)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Lihat Detail
                        </DropdownMenuItem>
                        {order.status === "PENDING" && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusUpdate(order.id, "CONFIRMED")
                            }
                          >
                            Konfirmasi
                          </DropdownMenuItem>
                        )}
                        {["CONFIRMED", "PROCESSING"].includes(order.status) && (
                          <>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusUpdate(order.id, "PROCESSING")
                              }
                            >
                              Proses
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusUpdate(order.id, "READY")
                              }
                            >
                              Siap
                            </DropdownMenuItem>
                          </>
                        )}
                        {order.status === "READY" && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusUpdate(order.id, "COMPLETED")
                            }
                          >
                            Selesai
                          </DropdownMenuItem>
                        )}
                        {!["COMPLETED", "CANCELLED"].includes(order.status) && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusUpdate(order.id, "CANCELLED")
                            }
                            className="text-red-600"
                          >
                            Batalkan
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Halaman {currentPage} dari {totalPages}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Order Detail Dialog - tetap sama seperti sebelumnya */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Detail Pesanan {selectedOrder?.orderNumber}
            </DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Informasi Pelanggan
                  </h4>
                  <div className="bg-muted p-3 rounded-lg space-y-2">
                    <p>
                      <strong>Nama:</strong> {selectedOrder.customerName}
                    </p>
                    <p>
                      <strong>Telepon:</strong> {selectedOrder.customerPhone}
                    </p>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <strong>Alamat:</strong>
                        <p className="text-sm">
                          {selectedOrder.customerAddress}
                        </p>
                      </div>
                    </div>
                    {selectedOrder.notes && (
                      <p>
                        <strong>Catatan:</strong> {selectedOrder.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Status & Info</h4>
                  <div className="bg-muted p-3 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Status:</span>
                      <Badge
                        className={
                          statusColors[
                            selectedOrder.status as keyof typeof statusColors
                          ]
                        }
                      >
                        {
                          statusLabels[
                            selectedOrder.status as keyof typeof statusLabels
                          ]
                        }
                      </Badge>
                    </div>
                    <p>
                      <strong>Tanggal:</strong>{" "}
                      {new Date(selectedOrder.createdAt).toLocaleDateString(
                        "id-ID"
                      )}
                    </p>
                    <p>
                      <strong>Total:</strong>{" "}
                      <span className="text-lg font-bold text-primary">
                        {formatPrice(selectedOrder.totalAmount)}
                      </span>
                    </p>
                    {selectedOrder.poSession && (
                      <p>
                        <strong>Pre-Order:</strong>{" "}
                        {selectedOrder.poSession.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Detail Pesanan
                </h4>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produk</TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead>Harga</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">
                            {item.productName}
                          </TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{formatPrice(item.price)}</TableCell>
                          <TableCell>{formatPrice(item.subtotal)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
