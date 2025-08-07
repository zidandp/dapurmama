export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  isAvailable: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Testimonial {
  id: string;
  name: string;
  message: string;
  rating: number;
  avatar?: string;
}

export interface OrderForm {
  name: string;
  phone: string;
  address: string;
  notes?: string;
}

export interface POSession {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  status: "DRAFT" | "ACTIVE" | "CLOSED";
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
  products: Product[];
  totalOrders: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface POSessionFormData {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  status: "DRAFT" | "ACTIVE" | "CLOSED";
  productIds: string[];
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  notes?: string;
  totalAmount: number;
  status:
    | "PENDING"
    | "CONFIRMED"
    | "PROCESSING"
    | "READY"
    | "COMPLETED"
    | "CANCELLED";
  poSession?: {
    id: string;
    name: string;
    status: string;
  };
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  productCategory: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface CreateOrderData {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  notes?: string;
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
  poSessionId?: string;
}
