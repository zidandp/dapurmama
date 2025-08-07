"use client";

import React, { useState, useRef, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import {
  Upload,
  X,
  ImageIcon,
  DollarSign,
  Package,
  Tag,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const productSchema = z.object({
  name: z
    .string()
    .min(1, "Nama produk tidak boleh kosong")
    .max(100, "Nama produk maksimal 100 karakter"),
  description: z
    .string()
    .min(10, "Deskripsi minimal 10 karakter")
    .max(500, "Deskripsi maksimal 500 karakter"),
  price: z.coerce
    .number({ invalid_type_error: "Harga harus berupa angka" })
    .positive("Harga harus positif")
    .max(10000000, "Harga maksimal Rp 10.000.000"),
  image: z
    .string()
    .url("URL gambar tidak valid")
    .min(1, "Gambar produk wajib diisi"),
  category: z
    .string()
    .min(1, "Kategori tidak boleh kosong")
    .max(50, "Kategori maksimal 50 karakter"),
  isAvailable: z.boolean().default(true),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  product: Product | null;
  onSuccess: () => void;
}

// Predefined categories for better UX
const SUGGESTED_CATEGORIES = [
  "Kue Tradisional",
  "Brownies",
  "Cookies",
  "Roti",
  "Pastry",
  "Dessert",
  "Minuman",
  "Snack",
  "Lainnya",
];

// Image validation helpers
const isValidImageUrl = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: "HEAD" });
    const contentType = response.headers.get("content-type");
    return response.ok && contentType?.startsWith("image/") === true;
  } catch {
    return false;
  }
};

export function ProductForm({ product, onSuccess }: ProductFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    product?.image || null
  );
  const [imageError, setImageError] = useState<string | null>(null);
  const [customCategory, setCustomCategory] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price || 0,
      image: product?.image || "",
      category: product?.category || "",
      isAvailable: product?.isAvailable ?? true,
    },
  });

  const watchedImage = form.watch("image");

  // Handle image URL change
  useEffect(() => {
    const validateImage = async () => {
      if (!watchedImage || watchedImage === imagePreview) return;

      setImageLoading(true);
      setImageError(null);

      try {
        if (await isValidImageUrl(watchedImage)) {
          setImagePreview(watchedImage);
          setImageError(null);
        } else {
          setImageError("URL gambar tidak valid atau tidak dapat diakses");
          setImagePreview(null);
        }
      } catch {
        setImageError("Gagal memvalidasi URL gambar");
        setImagePreview(null);
      } finally {
        setImageLoading(false);
      }
    };

    const debounce = setTimeout(validateImage, 500);
    return () => clearTimeout(debounce);
  }, [watchedImage, imagePreview]);

  const onSubmit: SubmitHandler<ProductFormValues> = async (data) => {
    setIsSubmitting(true);

    try {
      const method = product ? "PUT" : "POST";
      const url = product ? `/api/products/${product.id}` : "/api/products";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Gagal menyimpan produk");
      }

      toast({
        title: "✅ Sukses!",
        description: `Produk berhasil ${
          product ? "diperbarui" : "ditambahkan"
        }.`,
      });

      onSuccess();
    } catch (error: any) {
      toast({
        title: "❌ Error",
        description:
          error.message || "Terjadi kesalahan saat menyimpan produk.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Format file tidak valid",
        description: "Hanya file gambar yang diperbolehkan.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File terlalu besar",
        description: "Ukuran file maksimal 5MB.",
        variant: "destructive",
      });
      return;
    }

    // Create blob URL for preview
    const blobUrl = URL.createObjectURL(file);
    setImagePreview(blobUrl);

    // Here you would typically upload to your storage service
    // For now, we'll just show a message
    toast({
      title: "📁 Upload Gambar",
      description:
        "Fitur upload gambar akan segera tersedia. Gunakan URL gambar untuk sementara.",
    });
  };

  const clearImage = () => {
    setImagePreview(null);
    setImageError(null);
    form.setValue("image", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-1">
          {/* Single Column Layout for better mobile experience */}
          <div className="space-y-6">
            {/* Basic Info Section */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Package className="h-5 w-5" />
                  Informasi Produk
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Produk *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Contoh: Brownies Coklat Premium"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        {field.value.length}/100 karakter
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deskripsi *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Deskripsikan produk Anda dengan menarik..."
                          rows={3}
                          {...field}
                          className="resize-none"
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        {field.value.length}/500 karakter
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Price and Status in responsive grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Harga *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="number"
                              placeholder="25000"
                              className="pl-10"
                              {...field}
                              onChange={(e) => {
                                const value =
                                  e.target.value === ""
                                    ? 0
                                    : Number(e.target.value);
                                field.onChange(value);
                              }}
                            />
                          </div>
                        </FormControl>
                        {field.value > 0 && (
                          <FormDescription className="text-primary font-medium text-xs">
                            {formatPrice(field.value)}
                          </FormDescription>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isAvailable"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status Ketersediaan</FormLabel>
                        <FormControl>
                          <div className="flex items-center space-x-3 p-3 border rounded-lg">
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                            <div className="flex items-center gap-2">
                              {field.value ? (
                                <>
                                  <Eye className="h-4 w-4 text-green-600" />
                                  <Badge
                                    variant="default"
                                    className="bg-green-100 text-green-800 border-green-200 text-xs"
                                  >
                                    Tersedia
                                  </Badge>
                                </>
                              ) : (
                                <>
                                  <EyeOff className="h-4 w-4 text-red-600" />
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    Tidak Tersedia
                                  </Badge>
                                </>
                              )}
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Category Section */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Tag className="h-5 w-5" />
                  Kategori
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kategori Produk *</FormLabel>
                      <div className="space-y-3">
                        {!customCategory ? (
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih kategori..." />
                              </SelectTrigger>
                              <SelectContent>
                                {SUGGESTED_CATEGORIES.map((cat) => (
                                  <SelectItem key={cat} value={cat}>
                                    {cat}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                        ) : (
                          <FormControl>
                            <Input
                              placeholder="Kategori kustom..."
                              {...field}
                            />
                          </FormControl>
                        )}

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setCustomCategory(!customCategory);
                            if (customCategory) {
                              field.onChange("");
                            }
                          }}
                        >
                          {customCategory
                            ? "Pilih dari daftar"
                            : "Kategori kustom"}
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Image Section */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ImageIcon className="h-5 w-5" />
                  Gambar Produk
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL Gambar *</FormLabel>
                      <FormControl>
                        <div className="space-y-3">
                          <Input
                            placeholder="https://example.com/image.jpg"
                            {...field}
                          />

                          {/* Upload Option - Disabled for now */}
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              atau
                            </span>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              disabled
                              className="opacity-50"
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Upload Gambar (Segera Hadir)
                            </Button>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Image Preview */}
                <div className="space-y-3">
                  <Label>Preview Gambar</Label>
                  <div className="relative border-2 border-dashed border-muted rounded-lg p-4 min-h-[180px] flex items-center justify-center">
                    {imageLoading ? (
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span className="text-sm">Memvalidasi gambar...</span>
                      </div>
                    ) : imagePreview && !imageError ? (
                      <div className="relative group w-full">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-40 object-cover rounded-lg"
                        />
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={clearImage}
                            className="h-8 w-8"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="absolute bottom-2 left-2">
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Valid
                          </Badge>
                        </div>
                      </div>
                    ) : imageError ? (
                      <div className="flex flex-col items-center gap-2 text-red-600">
                        <AlertCircle className="h-6 w-6" />
                        <span className="text-sm text-center">
                          {imageError}
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <ImageIcon className="h-6 w-6" />
                        <span className="text-sm text-center">
                          Masukkan URL gambar untuk melihat preview
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons - Sticky at bottom */}
          <div className="sticky bottom-0 bg-background border-t pt-4 mt-6">
            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={onSuccess}
                disabled={isSubmitting}
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !!imageError}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {product ? "Update Produk" : "Tambah Produk"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
