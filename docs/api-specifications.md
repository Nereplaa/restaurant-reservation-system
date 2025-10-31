# API Specifications

## Base Information

**Base URL**: `http://localhost:5000/api/v1` (Development)  
**Base URL**: `https://api.your-domain.com/api/v1` (Production)  
**API Version**: v1  
**Content-Type**: `application/json`  
**Authentication**: JWT Bearer Token

---

## Authentication Header

For protected routes, include:
```
Authorization: Bearer <your-jwt-token>
```

---

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "timestamp": "2025-10-30T12:00:00Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  },
  "timestamp": "2025-10-30T12:00:00Z"
}
```

### HTTP Status Codes
- `200` - OK (Success)
- `201` - Created
- `400` - Bad Request (Validation error)
- `401` - Unauthorized (Not authenticated)
- `403` - Forbidden (Not authorized)
- `404` - Not Found
- `409` - Conflict (e.g., duplicate reservation)
- `500` - Internal Server Error

---

## API Endpoints

## 1. Authentication Routes

### 1.1 Register Customer
**POST** `/auth/register`

**Description**: Create a new customer account

**Request Body**:
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}
```

**Validation**:
- `email`: Valid email format, unique
- `password`: Min 8 characters, 1 uppercase, 1 number, 1 special char
- `firstName`: 2-50 characters
- `lastName`: 2-50 characters
- `phone`: Valid phone format

**Response** (201):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid-123",
      "email": "john.doe@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+1234567890",
      "role": "customer",
      "createdAt": "2025-10-30T12:00:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Registration successful"
}
```

---

### 1.2 Login
**POST** `/auth/login`

**Description**: Authenticate user and get JWT token

**Request Body**:
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid-123",
      "email": "john.doe@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "customer"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login successful"
}
```

**Error Response** (401):
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid email or password"
  }
}
```

---

### 1.3 Get Current User
**GET** `/auth/me`

**Authentication**: Required

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "uuid-123",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "role": "customer",
    "createdAt": "2025-10-30T12:00:00Z"
  }
}
```

---

### 1.4 Logout
**POST** `/auth/logout`

**Authentication**: Required

**Response** (200):
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## 2. Reservation Routes

### 2.1 Create Reservation
**POST** `/reservations`

**Authentication**: Required (Customer)

**Request Body**:
```json
{
  "date": "2025-11-15",
  "time": "19:30:00",
  "partySize": 4,
  "specialRequest": "Birthday celebration, need high chair"
}
```

**Validation**:
- `date`: ISO date format, future date, max 30 days ahead
- `time`: Time format HH:MM:SS, within restaurant hours
- `partySize`: Integer, 1-20
- `specialRequest`: Optional, max 500 characters

**Response** (201):
```json
{
  "success": true,
  "data": {
    "id": "uuid-456",
    "userId": "uuid-123",
    "date": "2025-11-15",
    "time": "19:30:00",
    "partySize": 4,
    "specialRequest": "Birthday celebration, need high chair",
    "status": "confirmed",
    "confirmationNumber": "RES-2025-001234",
    "tableId": null,
    "createdAt": "2025-10-30T12:00:00Z"
  },
  "message": "Reservation created successfully"
}
```

**Error Response** (409):
```json
{
  "success": false,
  "error": {
    "code": "NO_AVAILABILITY",
    "message": "No tables available for the selected date and time",
    "details": {
      "suggestedTimes": ["19:00:00", "20:00:00", "20:30:00"]
    }
  }
}
```

---

### 2.2 Get All Reservations (Customer)
**GET** `/reservations`

**Authentication**: Required (Customer)

**Query Parameters**:
- `status`: Filter by status (upcoming, past, cancelled) - Optional
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 50)

**Example**: `/reservations?status=upcoming&page=1&limit=10`

**Response** (200):
```json
{
  "success": true,
  "data": {
    "reservations": [
      {
        "id": "uuid-456",
        "date": "2025-11-15",
        "time": "19:30:00",
        "partySize": 4,
        "status": "confirmed",
        "confirmationNumber": "RES-2025-001234",
        "table": {
          "tableNumber": "A5",
          "location": "Main Hall"
        },
        "createdAt": "2025-10-30T12:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  }
}
```

---

### 2.3 Get Reservation by ID
**GET** `/reservations/:id`

**Authentication**: Required (Customer or Admin)

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "uuid-456",
    "userId": "uuid-123",
    "user": {
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+1234567890",
      "email": "john.doe@example.com"
    },
    "date": "2025-11-15",
    "time": "19:30:00",
    "partySize": 4,
    "specialRequest": "Birthday celebration",
    "status": "confirmed",
    "confirmationNumber": "RES-2025-001234",
    "table": {
      "id": "uuid-table-1",
      "tableNumber": "A5",
      "capacity": 6,
      "location": "Main Hall"
    },
    "createdAt": "2025-10-30T12:00:00Z",
    "updatedAt": "2025-10-30T12:00:00Z"
  }
}
```

---

### 2.4 Update Reservation
**PUT** `/reservations/:id`

**Authentication**: Required (Customer - own reservation, or Admin)

**Request Body** (all fields optional):
```json
{
  "date": "2025-11-16",
  "time": "20:00:00",
  "partySize": 5,
  "specialRequest": "Updated request"
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "uuid-456",
    "date": "2025-11-16",
    "time": "20:00:00",
    "partySize": 5,
    "specialRequest": "Updated request",
    "status": "confirmed",
    "updatedAt": "2025-10-30T13:00:00Z"
  },
  "message": "Reservation updated successfully"
}
```

---

### 2.5 Cancel Reservation
**DELETE** `/reservations/:id`

**Authentication**: Required (Customer - own reservation, or Admin)

**Request Body** (optional):
```json
{
  "reason": "Schedule conflict"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Reservation cancelled successfully"
}
```

**Error Response** (400):
```json
{
  "success": false,
  "error": {
    "code": "CANCELLATION_TOO_LATE",
    "message": "Reservations can only be cancelled at least 2 hours in advance"
  }
}
```

---

### 2.6 Check Availability
**GET** `/reservations/availability`

**Authentication**: Optional

**Query Parameters**:
- `date`: Date (YYYY-MM-DD) - Required
- `partySize`: Number of guests - Required

**Example**: `/reservations/availability?date=2025-11-15&partySize=4`

**Response** (200):
```json
{
  "success": true,
  "data": {
    "date": "2025-11-15",
    "partySize": 4,
    "availableSlots": [
      {
        "time": "18:00:00",
        "available": true,
        "tablesAvailable": 3
      },
      {
        "time": "18:30:00",
        "available": true,
        "tablesAvailable": 2
      },
      {
        "time": "19:00:00",
        "available": false,
        "tablesAvailable": 0
      }
    ]
  }
}
```

---

## 3. Admin Reservation Management

### 3.1 Get All Reservations (Admin)
**GET** `/admin/reservations`

**Authentication**: Required (Admin)

**Query Parameters**:
- `date`: Filter by date (YYYY-MM-DD)
- `status`: Filter by status (confirmed, completed, cancelled, no_show)
- `search`: Search by customer name, email, or confirmation number
- `page`: Page number
- `limit`: Items per page

**Example**: `/admin/reservations?date=2025-11-15&status=confirmed`

**Response** (200):
```json
{
  "success": true,
  "data": {
    "reservations": [
      {
        "id": "uuid-456",
        "confirmationNumber": "RES-2025-001234",
        "customer": {
          "id": "uuid-123",
          "name": "John Doe",
          "email": "john.doe@example.com",
          "phone": "+1234567890"
        },
        "date": "2025-11-15",
        "time": "19:30:00",
        "partySize": 4,
        "table": {
          "tableNumber": "A5",
          "location": "Main Hall"
        },
        "status": "confirmed",
        "specialRequest": "Birthday celebration",
        "createdAt": "2025-10-30T12:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3
    }
  }
}
```

---

### 3.2 Assign Table to Reservation
**PATCH** `/admin/reservations/:id/assign-table`

**Authentication**: Required (Admin)

**Request Body**:
```json
{
  "tableId": "uuid-table-1"
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "uuid-456",
    "tableId": "uuid-table-1",
    "table": {
      "tableNumber": "A5",
      "capacity": 6
    }
  },
  "message": "Table assigned successfully"
}
```

---

### 3.3 Update Reservation Status
**PATCH** `/admin/reservations/:id/status`

**Authentication**: Required (Admin)

**Request Body**:
```json
{
  "status": "completed",
  "notes": "Customer arrived on time"
}
```

**Valid statuses**: confirmed, completed, cancelled, no_show

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "uuid-456",
    "status": "completed",
    "updatedAt": "2025-11-15T21:30:00Z"
  },
  "message": "Reservation status updated"
}
```

---

## 4. Menu Routes

### 4.1 Get All Menu Items
**GET** `/menu`

**Authentication**: Optional

**Query Parameters**:
- `category`: Filter by category (appetizers, mains, desserts, drinks)
- `available`: Filter by availability (true/false)

**Example**: `/menu?category=mains&available=true`

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-menu-1",
      "name": "Grilled Salmon",
      "description": "Fresh Atlantic salmon with herbs and lemon",
      "price": 24.99,
      "category": "mains",
      "imageUrl": "https://cdn.example.com/salmon.jpg",
      "available": true,
      "dietaryTags": ["gluten-free", "dairy-free"],
      "preparationTime": 20
    },
    {
      "id": "uuid-menu-2",
      "name": "Caesar Salad",
      "description": "Classic Caesar with romaine and parmesan",
      "price": 12.99,
      "category": "appetizers",
      "imageUrl": "https://cdn.example.com/caesar.jpg",
      "available": true,
      "dietaryTags": ["vegetarian"],
      "preparationTime": 10
    }
  ]
}
```

---

### 4.2 Get Menu Item by ID
**GET** `/menu/:id`

**Authentication**: Optional

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "uuid-menu-1",
    "name": "Grilled Salmon",
    "description": "Fresh Atlantic salmon with herbs and lemon",
    "price": 24.99,
    "category": "mains",
    "imageUrl": "https://cdn.example.com/salmon.jpg",
    "available": true,
    "dietaryTags": ["gluten-free", "dairy-free"],
    "preparationTime": 20,
    "ingredients": ["salmon", "herbs", "lemon", "olive oil"],
    "nutritionInfo": {
      "calories": 350,
      "protein": "40g",
      "carbs": "5g",
      "fat": "20g"
    }
  }
}
```

---

### 4.3 Create Menu Item (Admin)
**POST** `/admin/menu`

**Authentication**: Required (Admin)

**Request Body**:
```json
{
  "name": "Grilled Salmon",
  "description": "Fresh Atlantic salmon with herbs and lemon",
  "price": 24.99,
  "category": "mains",
  "imageUrl": "https://cdn.example.com/salmon.jpg",
  "dietaryTags": ["gluten-free", "dairy-free"],
  "preparationTime": 20,
  "available": true
}
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "id": "uuid-menu-1",
    "name": "Grilled Salmon",
    "price": 24.99,
    "category": "mains",
    "createdAt": "2025-10-30T12:00:00Z"
  },
  "message": "Menu item created successfully"
}
```

---

### 4.4 Update Menu Item (Admin)
**PUT** `/admin/menu/:id`

**Authentication**: Required (Admin)

**Request Body** (all fields optional):
```json
{
  "name": "Herb-Crusted Salmon",
  "price": 26.99,
  "available": false
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "uuid-menu-1",
    "name": "Herb-Crusted Salmon",
    "price": 26.99,
    "available": false,
    "updatedAt": "2025-10-30T13:00:00Z"
  },
  "message": "Menu item updated successfully"
}
```

---

### 4.5 Delete Menu Item (Admin)
**DELETE** `/admin/menu/:id`

**Authentication**: Required (Admin)

**Response** (200):
```json
{
  "success": true,
  "message": "Menu item deleted successfully"
}
```

---

## 5. Order Routes

### 5.1 Create Order
**POST** `/orders`

**Authentication**: Required (Admin or Server)

**Request Body**:
```json
{
  "tableId": "uuid-table-1",
  "reservationId": "uuid-456",
  "items": [
    {
      "menuItemId": "uuid-menu-1",
      "quantity": 2,
      "specialNotes": "No onions"
    },
    {
      "menuItemId": "uuid-menu-2",
      "quantity": 1
    }
  ],
  "notes": "Rush order"
}
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "id": "uuid-order-1",
    "orderNumber": "ORD-001",
    "tableId": "uuid-table-1",
    "table": {
      "tableNumber": "A5"
    },
    "items": [
      {
        "id": "uuid-orderitem-1",
        "menuItem": {
          "name": "Grilled Salmon",
          "preparationTime": 20
        },
        "quantity": 2,
        "specialNotes": "No onions"
      }
    ],
    "status": "pending",
    "totalAmount": 62.97,
    "orderTime": "2025-11-15T19:45:00Z",
    "estimatedReadyTime": "2025-11-15T20:05:00Z"
  },
  "message": "Order created successfully"
}
```

---

### 5.2 Get All Orders
**GET** `/orders`

**Authentication**: Required (Admin or Kitchen)

**Query Parameters**:
- `status`: Filter by status (pending, preparing, ready, served)
- `tableId`: Filter by table
- `date`: Filter by date (YYYY-MM-DD)

**Example**: `/orders?status=pending&date=2025-11-15`

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-order-1",
      "orderNumber": "ORD-001",
      "table": {
        "tableNumber": "A5"
      },
      "items": [
        {
          "menuItem": {
            "name": "Grilled Salmon"
          },
          "quantity": 2,
          "specialNotes": "No onions"
        }
      ],
      "status": "pending",
      "orderTime": "2025-11-15T19:45:00Z",
      "estimatedReadyTime": "2025-11-15T20:05:00Z"
    }
  ]
}
```

---

### 5.3 Update Order Status
**PATCH** `/orders/:id/status`

**Authentication**: Required (Admin or Kitchen)

**Request Body**:
```json
{
  "status": "preparing"
}
```

**Valid statuses**: pending, preparing, ready, served, cancelled

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "uuid-order-1",
    "status": "preparing",
    "updatedAt": "2025-11-15T19:50:00Z"
  },
  "message": "Order status updated"
}
```

**Note**: This triggers WebSocket event to all connected clients

---

## 6. Table Routes

### 6.1 Get All Tables
**GET** `/tables`

**Authentication**: Required (Admin)

**Query Parameters**:
- `status`: Filter by status (available, occupied, reserved)
- `capacity`: Minimum capacity

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-table-1",
      "tableNumber": "A5",
      "capacity": 6,
      "location": "Main Hall",
      "status": "available",
      "currentReservation": null
    },
    {
      "id": "uuid-table-2",
      "tableNumber": "B3",
      "capacity": 4,
      "location": "Patio",
      "status": "occupied",
      "currentReservation": {
        "id": "uuid-456",
        "confirmationNumber": "RES-2025-001234"
      }
    }
  ]
}
```

---

### 6.2 Create Table (Admin)
**POST** `/admin/tables`

**Authentication**: Required (Admin)

**Request Body**:
```json
{
  "tableNumber": "A5",
  "capacity": 6,
  "location": "Main Hall"
}
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "id": "uuid-table-1",
    "tableNumber": "A5",
    "capacity": 6,
    "location": "Main Hall",
    "status": "available",
    "createdAt": "2025-10-30T12:00:00Z"
  },
  "message": "Table created successfully"
}
```

---

### 6.3 Update Table (Admin)
**PUT** `/admin/tables/:id`

**Authentication**: Required (Admin)

**Request Body**:
```json
{
  "capacity": 8,
  "status": "available"
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "uuid-table-1",
    "capacity": 8,
    "status": "available",
    "updatedAt": "2025-10-30T13:00:00Z"
  },
  "message": "Table updated successfully"
}
```

---

### 6.4 Delete Table (Admin)
**DELETE** `/admin/tables/:id`

**Authentication**: Required (Admin)

**Response** (200):
```json
{
  "success": true,
  "message": "Table deleted successfully"
}
```

---

## 7. AI Chatbot Routes

### 7.1 Send Message to AI
**POST** `/ai-chat/message`

**Authentication**: Required (Customer)

**Request Body**:
```json
{
  "message": "I want to book a table for 4 people",
  "conversationId": "uuid-conv-1"
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "conversationId": "uuid-conv-1",
    "aiResponse": "I'd be happy to help you book a table for 4! What date would you prefer?",
    "extractedData": {
      "partySize": 4,
      "date": null,
      "time": null
    },
    "isComplete": false
  }
}
```

---

### 7.2 Complete AI Reservation
**POST** `/ai-chat/complete-reservation`

**Authentication**: Required (Customer)

**Request Body**:
```json
{
  "conversationId": "uuid-conv-1",
  "reservationData": {
    "date": "2025-11-15",
    "time": "19:30:00",
    "partySize": 4,
    "specialRequest": "Birthday celebration"
  }
}
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "reservation": {
      "id": "uuid-456",
      "confirmationNumber": "RES-2025-001234",
      "date": "2025-11-15",
      "time": "19:30:00",
      "partySize": 4,
      "status": "confirmed"
    }
  },
  "message": "Reservation created successfully via AI assistant"
}
```

---

## 8. Customer Management (Admin)

### 8.1 Get All Customers
**GET** `/admin/customers`

**Authentication**: Required (Admin)

**Query Parameters**:
- `search`: Search by name, email, or phone
- `page`: Page number
- `limit`: Items per page

**Response** (200):
```json
{
  "success": true,
  "data": {
    "customers": [
      {
        "id": "uuid-123",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@example.com",
        "phone": "+1234567890",
        "totalReservations": 15,
        "lastReservation": "2025-10-25T19:30:00Z",
        "createdAt": "2025-01-15T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    }
  }
}
```

---

### 8.2 Get Customer Details
**GET** `/admin/customers/:id`

**Authentication**: Required (Admin)

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "uuid-123",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "createdAt": "2025-01-15T10:00:00Z",
    "reservations": [
      {
        "id": "uuid-456",
        "date": "2025-11-15",
        "time": "19:30:00",
        "partySize": 4,
        "status": "confirmed"
      }
    ],
    "statistics": {
      "totalReservations": 15,
      "completedReservations": 12,
      "cancelledReservations": 2,
      "noShows": 1
    }
  }
}
```

---

## 9. Dashboard & Analytics (Admin)

### 9.1 Get Dashboard Statistics
**GET** `/admin/dashboard/stats`

**Authentication**: Required (Admin)

**Response** (200):
```json
{
  "success": true,
  "data": {
    "today": {
      "reservations": 25,
      "completedReservations": 18,
      "activeOrders": 7,
      "revenue": 1245.50
    },
    "thisWeek": {
      "reservations": 178,
      "newCustomers": 23,
      "revenue": 8975.25
    },
    "upcomingReservations": [
      {
        "time": "19:00:00",
        "customer": "John Doe",
        "partySize": 4,
        "table": "A5"
      }
    ],
    "popularItems": [
      {
        "name": "Grilled Salmon",
        "ordersCount": 45
      }
    ]
  }
}
```

---

## 10. Settings (Admin)

### 10.1 Get Restaurant Settings
**GET** `/admin/settings`

**Authentication**: Required (Admin)

**Response** (200):
```json
{
  "success": true,
  "data": {
    "restaurantInfo": {
      "name": "The Fine Dine",
      "address": "123 Main St, City, State",
      "phone": "+1234567890",
      "email": "info@restaurant.com"
    },
    "businessHours": {
      "monday": { "open": "11:00", "close": "22:00" },
      "tuesday": { "open": "11:00", "close": "22:00" },
      "closed": ["sunday"]
    },
    "reservationSettings": {
      "maxAdvanceDays": 30,
      "minAdvanceHours": 2,
      "slotDuration": 120,
      "maxPartySize": 20
    }
  }
}
```

---

### 10.2 Update Settings
**PUT** `/admin/settings`

**Authentication**: Required (Admin)

**Request Body**:
```json
{
  "reservationSettings": {
    "maxAdvanceDays": 45,
    "minAdvanceHours": 4
  }
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Settings updated successfully"
}
```

---

## WebSocket Events

### Connection
```javascript
const socket = io('http://localhost:5000', {
  auth: {
    token: 'your-jwt-token'
  }
});
```

### Events

#### Client → Server

**authenticate**
```javascript
socket.emit('authenticate', { token: 'jwt-token' });
```

**join_kitchen**
```javascript
socket.emit('join_kitchen');
```

**update_order_status**
```javascript
socket.emit('update_order_status', {
  orderId: 'uuid-order-1',
  status: 'preparing'
});
```

#### Server → Client

**new_order**
```javascript
socket.on('new_order', (data) => {
  // data contains full order object
  console.log('New order:', data);
});
```

**order_updated**
```javascript
socket.on('order_updated', (data) => {
  // data contains updated order
  console.log('Order updated:', data);
});
```

**order_deleted**
```javascript
socket.on('order_deleted', (data) => {
  // data contains order ID
  console.log('Order deleted:', data.orderId);
});
```

---

## Error Codes Reference

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_CREDENTIALS` | 401 | Wrong email or password |
| `UNAUTHORIZED` | 401 | Not authenticated |
| `FORBIDDEN` | 403 | Not authorized for this action |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Input validation failed |
| `DUPLICATE_EMAIL` | 409 | Email already registered |
| `NO_AVAILABILITY` | 409 | No tables available |
| `CANCELLATION_TOO_LATE` | 400 | Too late to cancel |
| `INVALID_TOKEN` | 401 | JWT token invalid or expired |
| `INTERNAL_ERROR` | 500 | Server error |

---

**Document Version**: 1.0  
**Last Updated**: October 30, 2025  
**API Team**: [Team Name]

