export interface Order {
  id: string;
  tableId: string;
  userId: string | null;
  status: 'PENDING' | 'PREPARING' | 'READY' | 'SERVED' | 'CANCELLED';
  totalAmount: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  table?: Table;
  user?: User;
  orderItems?: OrderItem[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  menuItemId: string;
  quantity: number;
  price: number;
  specialInstructions: string | null;
  menuItem?: MenuItem;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  imageUrl: string | null;
  available: boolean;
  preparationTime: number;
  dietaryTags: string[];
}

export interface Table {
  id: string;
  tableNumber: string;
  capacity: number;
  location: string;
  status: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

