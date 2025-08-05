export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  isAvailable: boolean;
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
