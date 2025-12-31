// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: string;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Reservation types
export interface Reservation {
  id: string;
  date: string;
  time: string;
  partySize: number;
  status: 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  specialRequest?: string;
  confirmationNumber: string;
  table?: {
    tableNumber: string;
    location: string;
  };
  createdAt: string;
}

export interface CreateReservationData {
  date: string;
  time: string;
  partySize: number;
  specialRequest?: string;
}

// Menu types
export interface MenuItem {
  id: string;
  name: string;
  nameTr?: string;
  description?: string;
  detailedInfo?: string;
  price: number;
  category: 'soups' | 'appetizers' | 'mains' | 'kebabs' | 'grills' | 'desserts' | 'drinks' | 'specials';
  imageUrl?: string;
  available: boolean;
  dietaryTags: string[];
  preparationTime: number;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}

// AI Chat types
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AIChatResponse {
  conversationId: string;
  aiResponse: string;
  extractedData: {
    partySize?: number;
    date?: string;
    time?: string;
    specialRequest?: string;
  };
  isComplete: boolean;
}

