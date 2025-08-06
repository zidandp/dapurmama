"use client";

import { useState } from "react";
import { X, Minus, Plus, ShoppingBag, Send, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/components/providers/cart-provider";
import { formatPrice } from "@/lib/data";
import { generateWhatsAppMessage, openWhatsApp } from "@/lib/whatsapp";
import { OrderForm } from "@/lib/types";
import { toast } from "sonner";

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    totalPrice,
    totalItems,
    currentPOSessionId,
  } = useCart();

  const [orderForm, setOrderForm] = useState<OrderForm>({
    name: "",
    phone: "",
    address: "",
    notes: "",
  });
  const [step, setStep] = useState<"cart" | "checkout">("cart");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(id);
      toast.success("Produk dihapus dari keranjang");
      return;
    }
    updateQuantity(id, newQuantity);
  };

  const handleCheckout = async () => {
    if (!orderForm.name || !orderForm.phone || !orderForm.address) {
      toast.error("Mohon lengkapi data pemesanan");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. SAVE ORDER TO DATABASE
      const orderData = {
        customerName: orderForm.name,
        customerPhone: orderForm.phone,
        customerAddress: orderForm.address,
        notes: orderForm.notes,
        poSessionId: currentPOSessionId || undefined, // PERBAIKAN: gunakan undefined bukan null
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      console.log("Sending order data:", orderData); // Debug log

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error(JSON.stringify(errorData.error)); // PERBAIKAN: stringify error object
      }

      const orderResult = await response.json();

      // 2. SEND WHATSAPP MESSAGE
      const message = generateWhatsAppMessage(
        items,
        orderForm,
        totalPrice,
        orderResult.orderNumber,
        currentPOSessionId ? "Pre-Order Session" : undefined // Bisa diambil dari nama session
      );
      openWhatsApp(message);

      // 3. CLEAR CART AND RESET
      clearCart();
      setStep("cart");
      setOrderForm({ name: "", phone: "", address: "", notes: "" });
      onOpenChange(false);

      toast.success(
        `Pesanan #${orderResult.orderNumber} berhasil disimpan dan dikirim ke WhatsApp!`
      );
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error(error.message || "Terjadi kesalahan saat checkout");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />

      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-background border-l border-border shadow-xl animate-slide-up">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-3 sm:p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
              <h2 className="font-semibold text-sm sm:text-base">
                {step === "cart" ? "Keranjang Belanja" : "Data Pemesanan"}
              </h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="btn-touch h-8 w-8 sm:h-10 sm:w-10"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {step === "cart" ? (
              <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                {/* PO Session Indicator */}
                {currentPOSessionId && (
                  <div className="bg-primary/10 p-3 rounded-lg border border-primary/20">
                    <div className="flex items-center gap-2 text-primary">
                      <Database className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        Pre-Order Session
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Pesanan ini akan diproses sesuai jadwal pre-order
                    </p>
                  </div>
                )}

                {items.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-sm sm:text-base text-muted-foreground">
                      Keranjang masih kosong
                    </p>
                  </div>
                ) : (
                  <>
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-2 sm:gap-3 p-2 sm:p-3 bg-card rounded-lg border border-border"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-xs sm:text-sm leading-tight line-clamp-2">
                            {item.name}
                          </h4>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {formatPrice(item.price)}
                          </p>
                          {item.poSessionId && (
                            <p className="text-xs text-primary">Pre-Order</p>
                          )}
                          <div className="flex items-center gap-1 sm:gap-2 mt-1 sm:mt-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6 sm:h-8 sm:w-8"
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity - 1)
                              }
                            >
                              <Minus className="h-2 w-2 sm:h-3 sm:w-3" />
                            </Button>
                            <span className="text-xs sm:text-sm font-medium w-6 sm:w-8 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6 sm:h-8 sm:w-8"
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity + 1)
                              }
                            >
                              <Plus className="h-2 w-2 sm:h-3 sm:w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs sm:text-sm font-medium">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              removeItem(item.id);
                              toast.success("Produk dihapus dari keranjang");
                            }}
                            className="text-destructive hover:text-destructive text-xs mt-1 h-6 px-2"
                          >
                            Hapus
                          </Button>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            ) : (
              <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm">
                    Nama Lengkap *
                  </Label>
                  <Input
                    id="name"
                    placeholder="Masukkan nama lengkap"
                    value={orderForm.name}
                    onChange={(e) =>
                      setOrderForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="h-10 sm:h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm">
                    Nomor WhatsApp *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="08xxxxxxxxxx"
                    value={orderForm.phone}
                    onChange={(e) =>
                      setOrderForm((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    className="h-10 sm:h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm">
                    Alamat Lengkap *
                  </Label>
                  <Textarea
                    id="address"
                    placeholder="Masukkan alamat lengkap untuk pengiriman"
                    value={orderForm.address}
                    onChange={(e) =>
                      setOrderForm((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                    className="min-h-[80px] sm:min-h-[100px] text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-sm">
                    Catatan (Opsional)
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="Catatan tambahan untuk pesanan"
                    value={orderForm.notes}
                    onChange={(e) =>
                      setOrderForm((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                    className="text-sm"
                  />
                </div>

                {/* Order Summary */}
                <div className="bg-accent/20 p-3 sm:p-4 rounded-lg">
                  <h4 className="font-medium mb-2 text-sm sm:text-base">
                    Ringkasan Pesanan
                  </h4>
                  <div className="space-y-1 text-sm">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <span className="text-xs sm:text-sm truncate pr-2">
                          {item.name} ({item.quantity}x)
                          {item.poSessionId && (
                            <span className="text-primary text-xs ml-1">
                              [PO]
                            </span>
                          )}
                        </span>
                        <span>{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                    <div className="border-t pt-2 font-medium flex justify-between text-sm">
                      <span>Total:</span>
                      <span className="text-primary">
                        {formatPrice(totalPrice)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-border p-3 sm:p-4 space-y-3">
              {step === "cart" && (
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-sm sm:text-base">
                    Total: {formatPrice(totalPrice)}
                  </span>
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    {totalItems} item
                  </span>
                </div>
              )}

              <div className="flex gap-2 sm:gap-3">
                {step === "checkout" && (
                  <Button
                    variant="outline"
                    onClick={() => setStep("cart")}
                    className="flex-1 btn-touch h-11 sm:h-12"
                    disabled={isSubmitting}
                  >
                    Kembali
                  </Button>
                )}
                <Button
                  onClick={
                    step === "cart" ? () => setStep("checkout") : handleCheckout
                  }
                  className="flex-1 btn-touch h-11 sm:h-12 text-sm"
                  disabled={isSubmitting}
                >
                  {step === "cart" ? (
                    "Checkout"
                  ) : (
                    <>
                      {isSubmitting ? (
                        "Menyimpan..."
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-1 sm:mr-2" />
                          Pesan via WhatsApp
                        </>
                      )}
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
