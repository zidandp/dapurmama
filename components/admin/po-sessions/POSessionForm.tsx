"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect } from "react";
import { POSession, Product, POSessionFormData } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import { CalendarIcon, Package } from "lucide-react";

const poSessionSchema = z
  .object({
    name: z.string().min(1, "Nama sesi PO tidak boleh kosong"),
    description: z.string().optional(),
    startDate: z.string().min(1, "Tanggal mulai harus diisi"),
    endDate: z.string().min(1, "Tanggal selesai harus diisi"),
    status: z.enum(["DRAFT", "ACTIVE", "CLOSED"]),
    productIds: z.array(z.string()).min(1, "Minimal pilih 1 produk"),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "Tanggal selesai harus setelah tanggal mulai",
    path: ["endDate"],
  });

type POSessionFormValues = z.infer<typeof poSessionSchema>;

interface POSessionFormProps {
  session: POSession | null;
  onSuccess: () => void;
}

export function POSessionForm({ session, onSuccess }: POSessionFormProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const form = useForm<POSessionFormValues>({
    resolver: zodResolver(poSessionSchema),
    defaultValues: {
      name: session?.name || "",
      description: session?.description || "",
      startDate: session?.startDate
        ? new Date(session.startDate).toISOString().slice(0, 16)
        : "",
      endDate: session?.endDate
        ? new Date(session.endDate).toISOString().slice(0, 16)
        : "",
      status: session?.status || "DRAFT",
      productIds: session?.products.map((p) => p.id) || [],
    },
  });

  // Load products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data.filter((p: Product) => p.isAvailable));
      } catch (error) {
        toast({
          title: "Error",
          description: "Gagal memuat daftar produk.",
          variant: "destructive",
        });
      } finally {
        setLoadingProducts(false);
      }
    };

    loadProducts();
  }, []);

  const onSubmit: SubmitHandler<POSessionFormValues> = async (data) => {
    setLoading(true);
    try {
      const method = session ? "PUT" : "POST";
      const url = session
        ? `/api/po-sessions/${session.id}`
        : "/api/po-sessions";

      // Convert datetime-local to ISO string
      const payload = {
        ...data,
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString(),
      };

      // GET JWT TOKEN FROM LOCALSTORAGE
      const token = localStorage.getItem("admin_token");
      if (!token) {
        throw new Error("Token tidak ditemukan. Silakan login ulang.");
      }

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ADD JWT TOKEN
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();

        // Handle authentication errors
        if (res.status === 401) {
          localStorage.removeItem("admin_token");
          window.location.href = "/admin/login";
          return;
        }

        throw new Error(errorData.error || "Gagal menyimpan sesi PO");
      }

      toast({
        title: "Sukses",
        description: `Sesi PO berhasil ${
          session ? "diperbarui" : "ditambahkan"
        }.`,
      });
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message || "Terjadi kesalahan saat menyimpan sesi PO.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProductToggle = (productId: string, checked: boolean) => {
    const currentIds = form.getValues("productIds");
    if (checked) {
      form.setValue("productIds", [...currentIds, productId]);
    } else {
      form.setValue(
        "productIds",
        currentIds.filter((id) => id !== productId)
      );
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Sesi PO</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Contoh: PO Kue Lebaran 2024"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi (Opsional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Deskripsi singkat tentang sesi PO ini..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="ACTIVE">Aktif</SelectItem>
                      <SelectItem value="CLOSED">Ditutup</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Date Range */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tanggal Mulai</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tanggal Selesai</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Product Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Pilih Produk
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingProducts ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">
                  Tidak ada produk tersedia
                </p>
              </div>
            ) : (
              <ScrollArea className="h-64">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-start space-x-3 p-3 rounded-lg border"
                    >
                      <Checkbox
                        id={product.id}
                        checked={form.watch("productIds").includes(product.id)}
                        onCheckedChange={(checked) =>
                          handleProductToggle(product.id, checked as boolean)
                        }
                      />
                      <div className="flex-1 min-w-0">
                        <Label
                          htmlFor={product.id}
                          className="text-sm font-medium cursor-pointer"
                        >
                          {product.name}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Rp {product.price.toLocaleString("id-ID")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {product.category}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
            <FormMessage>
              {form.formState.errors.productIds?.message}
            </FormMessage>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-2">
          <Button type="submit" disabled={loading} className="min-w-[120px]">
            {loading ? "Menyimpan..." : session ? "Update" : "Simpan"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
