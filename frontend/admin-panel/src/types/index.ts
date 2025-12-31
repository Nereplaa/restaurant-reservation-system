export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: 'customer' | 'admin' | 'manager' | 'server' | 'kitchen';
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
  status: 'confirmed' | 'completed' | 'cancelled' | 'no_show';
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
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
  createdAt: string;
  updatedAt: string;
}

export interface MenuItem {
  id: string;
  name: string;
  nameTr?: string;
  description: string;
  detailedInfo?: string;
  category: string;
  price: number;
  imageUrl: string | null;
  available: boolean;
  preparationTime: number;
  dietaryTags: string[];
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  tableId: string;
  userId: string | null;
  status: 'pending' | 'preparing' | 'ready' | 'served' | 'cancelled';
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

