"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { POSession } from "@/lib/types";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Plus, Calendar, Package } from "lucide-react";
import { POSessionForm } from "./POSessionForm";
import {
  formatPOSessionDateRange,
  getPOSessionStatusColor,
  getPOSessionStatusText,
} from "@/lib/utils/po-session";

async function fetchPOSessions(): Promise<POSession[]> {
  const res = await fetch("/api/po-sessions");
  if (!res.ok) {
    throw new Error("Failed to fetch PO sessions");
  }
  return res.json();
}

async function deletePOSession(id: string): Promise<void> {
  const res = await fetch(`/api/po-sessions/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to delete PO session");
  }
}

export function POSessionDataTable() {
  const [poSessions, setPOSessions] = useState<POSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<POSession | null>(
    null
  );

  const loadPOSessions = async () => {
    setLoading(true);
    try {
      const data = await fetchPOSessions();
      setPOSessions(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memuat sesi PO.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPOSessions();
  }, []);

  const handleEdit = (session: POSession) => {
    setSelectedSession(session);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus sesi PO ini?")) return;

    try {
      await deletePOSession(id);
      toast({
        title: "Sukses",
        description: "Sesi PO berhasil dihapus.",
      });
      loadPOSessions();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Gagal menghapus sesi PO.",
        variant: "destructive",
      });
    }
  };

  const handleFormSuccess = () => {
    setIsDialogOpen(false);
    setSelectedSession(null);
    loadPOSessions();
  };

  const handleAddNew = () => {
    setSelectedSession(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Manajemen Sesi PO
          </h1>
          <p className="text-muted-foreground">
            Kelola sesi pre-order untuk produk Anda
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew} className="gap-2">
              <Plus className="h-4 w-4" />
              Tambah Sesi PO
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedSession ? "Edit Sesi PO" : "Tambah Sesi PO"}
              </DialogTitle>
            </DialogHeader>
            <POSessionForm
              session={selectedSession}
              onSuccess={handleFormSuccess}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-medium">Total Sesi</span>
          </div>
          <div className="text-2xl font-bold">{poSessions.length}</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium">Sesi Aktif</span>
          </div>
          <div className="text-2xl font-bold">
            {poSessions.filter((s) => s.status === "ACTIVE").length}
          </div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <MoreHorizontal className="h-5 w-5 text-orange-500" />
            <span className="text-sm font-medium">Total Pesanan</span>
          </div>
          <div className="text-2xl font-bold">
            {poSessions.reduce((sum, s) => sum + s.totalOrders, 0)}
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Sesi</TableHead>
                <TableHead>Periode</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Produk</TableHead>
                <TableHead>Pesanan</TableHead>
                <TableHead>Dibuat</TableHead>
                <TableHead className="w-[70px]">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {poSessions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <Calendar className="h-8 w-8 text-muted-foreground" />
                      <p className="text-muted-foreground">Belum ada sesi PO</p>
                      <Button
                        onClick={handleAddNew}
                        variant="outline"
                        size="sm"
                      >
                        Tambah Sesi PO Pertama
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                poSessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{session.name}</div>
                        {session.description && (
                          <div className="text-sm text-muted-foreground">
                            {session.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {formatPOSessionDateRange(
                          session.startDate,
                          session.endDate
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={getPOSessionStatusColor(session.status)}
                      >
                        {getPOSessionStatusText(session.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {session.products.length} produk
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {session.totalOrders} pesanan
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {new Date(session.createdAt).toLocaleDateString(
                          "id-ID"
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Buka menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(session)}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(session.id)}
                            className="text-destructive"
                            disabled={session.totalOrders > 0}
                          >
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
