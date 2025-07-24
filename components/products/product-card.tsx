"use client";

import { useState } from 'react';
import { ShoppingCart, Eye, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Product } from '@/lib/types';
import { formatPrice } from '@/lib/data';
import { useCart } from '@/components/providers/cart-provider';
import { ProductModal } from './product-modal';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.isAvailable) {
      toast.error('Produk sedang tidak tersedia');
      return;
    }
    addItem(product);
    toast.success(`${product.name} ditambahkan ke keranjang`);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  return (
    <>
      <Card className="card-product cursor-pointer" onClick={() => setIsModalOpen(true)}>
        <CardContent className="p-0">
          <div className="relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-40 sm:h-48 object-cover rounded-t-xl"
            />
            {!product.isAvailable && (
              <div className="absolute inset-0 bg-black/50 rounded-t-xl flex items-center justify-center">
                <span className="text-white text-xs font-medium bg-black/70 px-2 py-1 rounded-lg">
                  Tidak Tersedia
                </span>
              </div>
            )}
            <div className="absolute top-2 right-2 flex gap-1">
              <Button
                size="icon"
                variant="secondary"
                className="h-7 w-7 sm:h-8 sm:w-8 opacity-90 hover:opacity-100"
                onClick={handleQuickView}
              >
                <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </div>
          
          <div className="p-3 sm:p-4">
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-xs sm:text-sm leading-tight line-clamp-2 flex-1 pr-2">
                  {product.name}
                </h3>
                <span className="text-xs bg-accent px-2 py-0.5 rounded-full text-accent-foreground whitespace-nowrap">
                  {product.category}
                </span>
              </div>
              
              <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                {product.description}
              </p>
              
              <div className="flex items-center justify-between pt-1">
                <span className="font-bold text-primary text-sm sm:text-base">
                  {formatPrice(product.price)}
                </span>
                {/* Mobile: Icon only, Desktop: Icon + Text */}
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    onClick={handleAddToCart}
                    disabled={!product.isAvailable}
                    className="btn-touch h-8 w-8 sm:h-9 sm:w-auto sm:px-3 p-0 sm:p-2"
                  >
                    <Plus className="h-4 w-4 sm:mr-1" />
                    <span className="hidden sm:inline">Tambah</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <ProductModal
        product={product}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
}