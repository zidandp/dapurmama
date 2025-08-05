import { CreateOrderData, Order } from "@/lib/types";

export class OrderService {
  static async createOrder(orderData: CreateOrderData): Promise<Order> {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create order");
    }

    return response.json();
  }

  static async getOrders(): Promise<Order[]> {
    const response = await fetch("/api/orders");

    if (!response.ok) {
      throw new Error("Failed to fetch orders");
    }

    return response.json();
  }

  static async getOrder(id: string): Promise<Order> {
    const response = await fetch(`/api/orders/${id}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch order");
    }

    return response.json();
  }

  static async updateOrderStatus(
    id: string,
    status: Order["status"],
    notes?: string
  ): Promise<Order> {
    const response = await fetch(`/api/orders/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status, notes }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update order");
    }

    return response.json();
  }

  static async deleteOrder(id: string): Promise<void> {
    const response = await fetch(`/api/orders/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to delete order");
    }
  }
}
