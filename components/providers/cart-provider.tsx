"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/lib/types";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  poSessionId?: string; // Tambah support untuk PO Session
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, poSessionId?: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  totalPrice: number;
  totalItems: number;
  currentPOSessionId: string | null; // Ubah dari string | undefined
  setCurrentPOSessionId: (sessionId: string | null) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [currentPOSessionId, setCurrentPOSessionId] = useState<string | null>(
    null
  );

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    const savedPOSessionId = localStorage.getItem("currentPOSessionId");

    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }

    if (savedPOSessionId) {
      setCurrentPOSessionId(savedPOSessionId);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  // Save PO session ID to localStorage
  useEffect(() => {
    if (currentPOSessionId) {
      localStorage.setItem("currentPOSessionId", currentPOSessionId);
    } else {
      localStorage.removeItem("currentPOSessionId");
    }
  }, [currentPOSessionId]);

  const addItem = (product: Product, quantity = 1, poSessionId?: string) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);

      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [
          ...prevItems,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity,
            poSessionId: poSessionId || currentPOSessionId || undefined,
          },
        ];
      }
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const removeItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setItems([]);
    setCurrentPOSessionId(null);
  };

  const totalPrice = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        totalPrice,
        totalItems,
        currentPOSessionId,
        setCurrentPOSessionId,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
