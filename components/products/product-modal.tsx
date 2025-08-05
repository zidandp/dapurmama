"use client";

import { useState } from "react";
import { X, ShoppingCart, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/data";
import { useCart } from "@/components/providers/cart-provider";
import { toast } from "sonner";

interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  poSessionId?: string | null;
}

export function ProductModal({
  product,
  isOpen,
  onClose,
  poSessionId,
}: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    if (!product.isAvailable) {
      toast.error("Produk sedang tidak tersedia");
      return;
    }

    addItem(product);

    if (poSessionId) {
      toast.success(`${product.name} ditambahkan ke keranjang (Sesi PO)`);
    } else {
      toast.success(`${product.name} ditambahkan ke keranjang`);
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={() => onClose()}
      />

      {/* Modal */}
      <div className="absolute bottom-0 left-0 right-0 bg-background rounded-t-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="sticky top-0 flex items-center justify-between p-4 border-b border-border bg-background/95 backdrop-blur">
          <h2 className="font-semibold">Detail Produk</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onClose()}
            className="btn-touch"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-4 space-y-6">
          {/* Product Image */}
          <div className="relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-64 object-cover rounded-xl"
            />
            {!product.isAvailable && (
              <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                <span className="text-white font-medium bg-black/70 px-4 py-2 rounded-lg">
                  Tidak Tersedia
                </span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-xl font-bold">{product.name}</h1>
                <p className="text-2xl font-bold text-primary mt-1">
                  {formatPrice(product.price)}
                </p>
              </div>
              <span className="bg-accent px-3 py-1 rounded-full text-sm font-medium text-accent-foreground">
                {product.category}
              </span>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            {/* Quantity Selector */}
            {product.isAvailable && (
              <div className="space-y-3">
                <label className="text-sm font-medium">Jumlah</label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="btn-touch"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-lg font-medium w-12 text-center">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    className="btn-touch"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  Subtotal:{" "}
                  <span className="font-medium text-primary">
                    {formatPrice(product.price * quantity)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="sticky bottom-0 bg-background pt-4 border-t border-border">
            <Button
              onClick={handleAddToCart}
              disabled={!product.isAvailable}
              className="w-full btn-touch"
              size="lg"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              {product.isAvailable ? "Tambah ke Keranjang" : "Tidak Tersedia"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
