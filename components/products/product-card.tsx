"use client";

import { useState } from "react";
import { ShoppingCart, Eye, Plus, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/data";
import { useCart } from "@/components/providers/cart-provider";
import { ProductModal } from "./product-modal";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
  poSessionId?: string | null;
}

export function ProductCard({ product, poSessionId }: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.isAvailable) {
      toast.error("Produk sedang tidak tersedia");
      return;
    }

    // Add product with PO session context
    const productWithContext = {
      ...product,
      poSessionId, // This will be used later for checkout
    };

    addItem(product);

    if (poSessionId) {
      toast.success(`${product.name} ditambahkan ke keranjang (Sesi PO)`);
    } else {
      toast.success(`${product.name} ditambahkan ke keranjang`);
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  return (
    <>
      <Card
        className="card-product cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <CardContent className="p-0">
          <div className="relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-40 sm:h-48 object-cover rounded-t-xl"
            />

            {/* PO Session Badge */}
            {poSessionId && (
              <div className="absolute top-2 left-2">
                <Badge
                  variant="secondary"
                  className="text-xs bg-primary/90 text-primary-foreground"
                >
                  <Calendar className="h-3 w-3 mr-1" />
                  PO
                </Badge>
              </div>
            )}

            {!product.isAvailable && (
              <div className="absolute inset-0 bg-black/50 rounded-t-xl flex items-center justify-center">
                <span className="text-white text-xs font-medium bg-black/70 px-2 py-1 rounded-lg">
                  Tidak Tersedia
                </span>
              </div>
            )}

            {/* Quick View Button */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8 btn-touch"
                onClick={handleQuickView}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="p-3 sm:p-4">
            <h3 className="font-semibold text-sm sm:text-base line-clamp-2 mb-1">
              {product.name}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-2">
              {product.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="font-bold text-primary text-sm sm:text-base">
                {formatPrice(product.price)}
              </span>
              <Button
                size="sm"
                onClick={handleAddToCart}
                disabled={!product.isAvailable}
                className="btn-touch text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3"
              >
                <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Tambah
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product Modal */}
      <ProductModal
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        poSessionId={poSessionId}
      />
    </>
  );
}
