import { Request } from 'express';
import { UserRole } from '@prisma/client';

// Extend Express Request to include authenticated user
export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: UserRole;
  };
}

// API Response format
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  timestamp: string;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}

// Pagination
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Reservation types
export interface CreateReservationInput {
  date: string;
  time: string;
  partySize: number;
  specialRequest?: string;
}

export interface AvailabilityQuery {
  date: string;
  partySize: number;
}

export interface TimeSlot {
  time: string;
  available: boolean;
  tablesAvailable: number;
}

// Order types
export interface CreateOrderInput {
  tableId: string;
  reservationId?: string;
  items: OrderItemInput[];
  notes?: string;
}

export interface OrderItemInput {
  menuItemId: string;
  quantity: number;
  specialNotes?: string;
}

// AI Chat types
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIChatRequest {
  message: string;
  conversationId?: string;
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

// Menu types
export interface CreateMenuItemInput {
  name: string;
  description?: string;
  price: number;
  category: string;
  imageUrl?: string;
  dietaryTags?: string[];
  preparationTime?: number;
}

// Error codes
export enum ErrorCode {
  // Authentication
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  INVALID_TOKEN = 'INVALID_TOKEN',
  
  // Validation
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  
  // Resources
  NOT_FOUND = 'NOT_FOUND',
  DUPLICATE_EMAIL = 'DUPLICATE_EMAIL',
  
  // Business Logic
  NO_AVAILABILITY = 'NO_AVAILABILITY',
  CANCELLATION_TOO_LATE = 'CANCELLATION_TOO_LATE',
  INVALID_DATE = 'INVALID_DATE',
  INVALID_TIME = 'INVALID_TIME',
  
  // Server
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
}

