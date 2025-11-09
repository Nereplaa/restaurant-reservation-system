export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: 'CUSTOMER' | 'ADMIN' | 'KITCHEN_STAFF';
  createdAt: string;
  updatedAt: string;
}

export interface Reservation {
  id: string;
  userId: string;
  tableId: string | null;
  guestCount: number;
  reservationDate: string;
  reservationTime: string;
  duration: number;
  status: 'PENDING' | 'CONFIRMED' | 'SEATED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  specialRequests: string | null;
  confirmationNumber: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
  table?: Table;
}

export interface Table {
  id: string;
  tableNumber: string;
  capacity: number;
  location: string;
  status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'MAINTENANCE';
  createdAt: string;
  updatedAt: string;
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
  createdAt: string;
  updatedAt: string;
}

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

export interface DashboardStats {
  todayReservations: number;
  todayRevenue: number;
  totalCustomers: number;
  activeOrders: number;
  availableTables: number;
  occupiedTables: number;
}

