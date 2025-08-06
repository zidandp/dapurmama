"use client";

import Link from "next/link";
import { Package, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  const handleGoBack = () => {
    // Cek apakah ada history sebelumnya
    if (window.history.length > 1) {
      router.back();
    } else {
      // Jika tidak ada history, redirect ke beranda
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardContent className="pt-8 pb-8">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary/10 rounded-full">
              <Package className="h-12 w-12 text-primary" />
            </div>
          </div>

          {/* Error Code */}
          <h1 className="text-6xl font-bold text-primary mb-4">404</h1>

          {/* Title */}
          <h2 className="text-2xl font-semibold mb-2">
            Halaman Tidak Ditemukan
          </h2>

          {/* Description */}
          <p className="text-muted-foreground mb-6">
            Waduh, resep untuk halaman ini sepertinya hilang! Halaman yang Anda
            cari tidak dapat ditemukan.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="outline"
              onClick={handleGoBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </Button>
            <Button asChild>
              <Link href="/" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Beranda
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
