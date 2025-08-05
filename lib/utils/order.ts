import { Order } from "@/lib/types";

export function getOrderStatusText(status: Order["status"]): string {
  switch (status) {
    case "PENDING":
      return "Menunggu Konfirmasi";
    case "CONFIRMED":
      return "Dikonfirmasi";
    case "PROCESSING":
      return "Sedang Diproses";
    case "READY":
      return "Siap Diambil";
    case "COMPLETED":
      return "Selesai";
    case "CANCELLED":
      return "Dibatalkan";
    default:
      return "Unknown";
  }
}

export function getOrderStatusColor(status: Order["status"]): string {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
    case "CONFIRMED":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case "PROCESSING":
      return "bg-purple-100 text-purple-800 hover:bg-purple-200";
    case "READY":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "COMPLETED":
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    case "CANCELLED":
      return "bg-red-100 text-red-800 hover:bg-red-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
}

export function formatOrderNumber(orderNumber: string): string {
  return orderNumber;
}

export function canDeleteOrder(status: Order["status"]): boolean {
  return ["PENDING", "CANCELLED"].includes(status);
}

export function canEditOrder(status: Order["status"]): boolean {
  return !["COMPLETED", "CANCELLED"].includes(status);
}
