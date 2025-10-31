# System Architecture

## 1. Architecture Overview

### 1.1 System Type
**Three-Tier Architecture** with Real-time Communication Layer

```
┌─────────────────────────────────────────────────────────────┐
│                      PRESENTATION LAYER                      │
│  ┌────────────┐  ┌────────────┐  ┌────────────────────┐    │
│  │  Customer  │  │   Admin    │  │  Kitchen Display   │    │
│  │    App     │  │   Panel    │  │      System        │    │
│  │  (React)   │  │  (React)   │  │     (React)        │    │
│  └────────────┘  └────────────┘  └────────────────────┘    │
└────────────┬──────────────┬─────────────────┬──────────────┘
             │              │                 │
             │   REST API   │   REST API      │  WebSocket
             │              │                 │
┌────────────┴──────────────┴─────────────────┴──────────────┐
│                      BUSINESS LOGIC LAYER                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │          Node.js + Express Backend                   │  │
│  │  ┌──────────┐  ┌──────────┐  ┌─────────────────┐   │  │
│  │  │  Routes  │  │Controllers│  │    Services     │   │  │
│  │  └──────────┘  └──────────┘  └─────────────────┘   │  │
│  │  ┌──────────┐  ┌──────────┐  ┌─────────────────┐   │  │
│  │  │Middleware│  │   Auth    │  │  Socket.io      │   │  │
│  │  └──────────┘  └──────────┘  └─────────────────┘   │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │  Prisma ORM
                         │
┌────────────────────────┴────────────────────────────────────┐
│                        DATA LAYER                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              PostgreSQL Database                     │  │
│  │  (Users, Reservations, Orders, Tables, Menu, etc.)  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                         │
│  ┌────────────┐  ┌────────────┐  ┌────────────────────┐    │
│  │  OpenAI    │  │   Email    │  │   File Storage     │    │
│  │    API     │  │  Service   │  │     (Images)       │    │
│  └────────────┘  └────────────┘  └────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Component Breakdown

### 2.1 Customer Application (Frontend)
**Technology**: React 18 + TypeScript + Tailwind CSS

**Responsibilities**:
- User authentication (login/register)
- Reservation booking interface
- AI chatbot integration
- View/modify/cancel reservations
- Menu browsing
- User profile management

**Key Pages**:
- `/` - Home page
- `/login` - Login page
- `/register` - Registration page
- `/book` - Reservation booking
- `/reservations` - My reservations
- `/menu` - Restaurant menu
- `/profile` - User profile

**State Management**: React Context API + useState/useReducer

**API Communication**: Axios for REST, Socket.io-client for real-time

---

### 2.2 Admin Panel (Frontend)
**Technology**: React 18 + TypeScript + Tailwind CSS

**Responsibilities**:
- Admin authentication
- Dashboard with analytics
- Reservation management (CRUD)
- Customer management
- Table management
- Menu management
- Order management
- System settings

**Key Pages**:
- `/admin/login` - Admin login
- `/admin/dashboard` - Main dashboard
- `/admin/reservations` - Reservation management
- `/admin/customers` - Customer database
- `/admin/tables` - Table configuration
- `/admin/menu` - Menu management
- `/admin/orders` - Order tracking
- `/admin/settings` - System settings

**State Management**: React Context API + Custom hooks

**Data Visualization**: Recharts or Chart.js for analytics

---

### 2.3 Kitchen Display System (Frontend)
**Technology**: React 18 + TypeScript + Tailwind CSS

**Responsibilities**:
- Real-time order display
- Order status updates
- Audio notifications
- Touch-friendly interface
- Optimized for large displays

**Features**:
- Auto-refresh orders
- Color-coded priorities
- Timer for order age
- Full-screen mode
- Minimal UI for clarity

**State Management**: useState + useEffect with WebSocket

---

### 2.4 Backend API (Node.js + Express)
**Technology**: Node.js v18+ + Express + TypeScript + Prisma ORM

#### 2.4.1 Architecture Pattern: MVC (Model-View-Controller)

```
Request Flow:
Client → Route → Middleware → Controller → Service → Model → Database
                                                           ↓
Client ← Response ← Controller ← Service ←──────────────────
```

#### 2.4.2 Folder Structure

```
backend/src/
├── config/              # Configuration files
│   ├── database.ts
│   ├── jwt.ts
│   └── openai.ts
│
├── routes/              # API route definitions
│   ├── auth.routes.ts
│   ├── reservation.routes.ts
│   ├── customer.routes.ts
│   ├── menu.routes.ts
│   ├── order.routes.ts
│   ├── table.routes.ts
│   └── admin.routes.ts
│
├── controllers/         # Request handlers
│   ├── authController.ts
│   ├── reservationController.ts
│   ├── customerController.ts
│   ├── menuController.ts
│   ├── orderController.ts
│   └── tableController.ts
│
├── services/            # Business logic
│   ├── authService.ts
│   ├── reservationService.ts
│   ├── aiChatbotService.ts
│   ├── emailService.ts
│   └── notificationService.ts
│
├── models/              # Database models (Prisma schema)
│   └── schema.prisma
│
├── middleware/          # Express middleware
│   ├── auth.middleware.ts
│   ├── validation.middleware.ts
│   ├── errorHandler.ts
│   └── rateLimit.ts
│
├── utils/               # Utility functions
│   ├── dateUtils.ts
│   ├── validators.ts
│   └── helpers.ts
│
├── types/               # TypeScript types
│   └── index.ts
│
├── sockets/             # WebSocket handlers
│   └── orderSocket.ts
│
└── server.ts            # Entry point
```

#### 2.4.3 Core Modules

**Authentication Module**:
- JWT-based authentication
- Password hashing (bcrypt)
- Role-based access control (RBAC)
- Session management

**Reservation Module**:
- Availability checking
- Double-booking prevention
- CRUD operations
- Time slot validation

**AI Chatbot Module**:
- OpenAI/Anthropic API integration
- Conversation context management
- Intent recognition
- Fallback handling

**Email Module**:
- Confirmation emails
- Reminder notifications
- Cancellation emails
- Template engine (Handlebars)

**WebSocket Module**:
- Real-time order broadcasting
- Connection management
- Room-based communication
- Heartbeat/ping-pong

---

## 3. Database Design

### 3.1 Entity Relationship Diagram (ERD)

```
┌─────────────────┐
│     Users       │
├─────────────────┤
│ id (PK)         │◄────────┐
│ email           │         │
│ password_hash   │         │
│ first_name      │         │
│ last_name       │         │
│ phone           │         │
│ role            │         │
│ created_at      │         │
└─────────────────┘         │
                            │ (1:N)
┌─────────────────┐         │
│  Reservations   │─────────┘
├─────────────────┤
│ id (PK)         │
│ user_id (FK)    │
│ table_id (FK)   │─────────┐
│ date            │         │
│ time            │         │
│ party_size      │         │
│ status          │         │ (N:1)
│ special_request │         │
│ confirmation_no │         │
│ created_at      │    ┌─────────────────┐
│ updated_at      │    │     Tables      │
└─────────────────┘    ├─────────────────┤
         │             │ id (PK)         │
         │             │ table_number    │
         │ (1:N)       │ capacity        │
         │             │ location        │
         │             │ status          │
┌─────────────────┐    └─────────────────┘
│     Orders      │
├─────────────────┤
│ id (PK)         │
│ reservation_id  │
│ table_id (FK)   │
│ status          │
│ order_time      │
│ ready_time      │
│ notes           │
│ created_at      │
└─────────────────┘
         │
         │ (1:N)
         │
┌─────────────────┐         ┌─────────────────┐
│   OrderItems    │         │   MenuItems     │
├─────────────────┤         ├─────────────────┤
│ id (PK)         │         │ id (PK)         │
│ order_id (FK)   │         │ name            │
│ menu_item_id(FK)│─────────┤ description     │
│ quantity        │  (N:1)  │ price           │
│ special_notes   │         │ category        │
└─────────────────┘         │ image_url       │
                            │ available       │
                            │ dietary_tags    │
                            └─────────────────┘
```

### 3.2 Database Tables

See `database-schema.md` for detailed schema definition.

---

## 4. API Architecture

### 4.1 RESTful API Design

**Base URL**: `https://api.restaurant.com/api/v1`

**Endpoint Structure**:
```
/api/v1/auth/*                  # Authentication
/api/v1/reservations/*          # Reservations
/api/v1/customers/*             # Customer management
/api/v1/menu/*                  # Menu items
/api/v1/orders/*                # Orders
/api/v1/tables/*                # Tables
/api/v1/admin/*                 # Admin operations
/api/v1/ai-chat/*               # AI chatbot
```

**HTTP Methods**:
- `GET` - Retrieve resources
- `POST` - Create resources
- `PUT` - Update resources (full)
- `PATCH` - Update resources (partial)
- `DELETE` - Delete resources

**Response Format**:
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "timestamp": "2025-10-30T12:00:00Z"
}
```

**Error Format**:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": { ... }
  },
  "timestamp": "2025-10-30T12:00:00Z"
}
```

### 4.2 Authentication Flow

```
1. Client Login:
   POST /api/v1/auth/login
   Body: { email, password }

2. Server validates credentials

3. Server generates JWT token:
   {
     userId: "123",
     role: "customer",
     exp: 1234567890
   }

4. Server responds:
   {
     token: "eyJhbGciOiJIUzI1NiIs...",
     user: { id, email, name }
   }

5. Client stores token (localStorage)

6. Subsequent requests include:
   Header: Authorization: Bearer <token>

7. Server validates token via middleware

8. Request proceeds to controller
```

### 4.3 WebSocket Communication

**Connection**: `wss://api.restaurant.com`

**Events**:

**Client → Server**:
- `authenticate` - Send JWT token
- `join_kitchen` - Join kitchen room
- `update_order_status` - Update order

**Server → Client**:
- `new_order` - New order created
- `order_updated` - Order status changed
- `order_deleted` - Order cancelled

**Example**:
```javascript
// Client
socket.emit('authenticate', { token: 'jwt-token' });
socket.on('new_order', (order) => {
  // Display order in UI
});

// Server
io.to('kitchen').emit('new_order', orderData);
```

---

## 5. AI Chatbot Architecture

### 5.1 Conversation Flow

```
User: "I want to book a table"
  ↓
AI Service receives message
  ↓
Build context with conversation history
  ↓
Add system prompt:
  "You are a restaurant booking assistant.
   Ask for date, time, party size.
   Check availability and confirm."
  ↓
Call OpenAI API
  ↓
Parse AI response
  ↓
Extract structured data (date, time, etc.)
  ↓
If complete → Create reservation
If incomplete → Ask follow-up question
  ↓
Return response to user
```

### 5.2 AI Service Structure

```typescript
class AIChatbotService {
  async processMessage(
    message: string,
    conversationHistory: Message[],
    userId: string
  ): Promise<AIResponse> {
    // Build context
    const context = this.buildContext(conversationHistory);
    
    // Call OpenAI
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...context,
        { role: "user", content: message }
      ]
    });
    
    // Parse response
    const reply = aiResponse.choices[0].message.content;
    
    // Extract structured data
    const extracted = this.extractReservationData(reply);
    
    // Check if complete
    if (this.isReservationComplete(extracted)) {
      // Create reservation
      await this.createReservation(extracted, userId);
    }
    
    return {
      message: reply,
      data: extracted,
      complete: this.isReservationComplete(extracted)
    };
  }
}
```

---

## 6. Security Architecture

### 6.1 Security Layers

**1. Transport Security**:
- HTTPS/TLS encryption
- Secure WebSocket (WSS)

**2. Authentication Security**:
- Password hashing (bcrypt, 10 rounds)
- JWT tokens (24-hour expiry)
- Refresh token mechanism
- Secure cookie storage (HttpOnly)

**3. Authorization Security**:
- Role-based access control (RBAC)
- Middleware checks on routes
- Resource ownership verification

**4. Input Validation**:
- Joi/Zod schema validation
- SQL injection prevention (Prisma)
- XSS sanitization
- CSRF tokens for state-changing operations

**5. Rate Limiting**:
- 100 requests/minute per IP
- Exponential backoff for login failures
- API key rate limits

**6. Database Security**:
- Connection pooling
- Prepared statements
- Least privilege principle
- Encrypted connections

### 6.2 Authentication Middleware

```typescript
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ 
      error: 'Access token required' 
    });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ 
      error: 'Invalid or expired token' 
    });
  }
};
```

---

## 7. Deployment Architecture

### 7.1 Deployment Diagram

```
┌─────────────────────────────────────────────────┐
│               Users (Browsers)                  │
└───────────────────┬─────────────────────────────┘
                    │
                    │ HTTPS
                    ↓
┌─────────────────────────────────────────────────┐
│            Vercel (Frontend Hosting)            │
│  ┌──────────────┐  ┌──────────────┐            │
│  │ Customer App │  │  Admin Panel │            │
│  │   (Static)   │  │   (Static)   │            │
│  └──────────────┘  └──────────────┘            │
└───────────────────┬─────────────────────────────┘
                    │
                    │ API Calls
                    ↓
┌─────────────────────────────────────────────────┐
│          Render/Railway (Backend Hosting)       │
│  ┌─────────────────────────────────────────┐   │
│  │     Node.js Server (Docker Container)   │   │
│  │  ┌────────────┐  ┌──────────────────┐  │   │
│  │  │ REST API   │  │   WebSocket      │  │   │
│  │  └────────────┘  └──────────────────┘  │   │
│  └─────────────────────────────────────────┘   │
└───────────────────┬─────────────────────────────┘
                    │
                    │ Database Connection
                    ↓
┌─────────────────────────────────────────────────┐
│      Supabase/Neon (PostgreSQL Hosting)        │
│  ┌─────────────────────────────────────────┐   │
│  │        PostgreSQL Database              │   │
│  └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘

External Services:
┌──────────────┐  ┌──────────────┐
│  OpenAI API  │  │ SendGrid     │
│              │  │ (Email)      │
└──────────────┘  └──────────────┘
```

### 7.2 Environment Configuration

**Development**:
- Local database (PostgreSQL)
- Local backend (localhost:5000)
- Local frontend (localhost:3000)
- Mock email service

**Production**:
- Cloud database (Supabase/Neon)
- Hosted backend (Render/Railway)
- CDN frontend (Vercel)
- Real email service (SendGrid)

---

## 8. Data Flow Examples

### 8.1 Customer Creates Reservation

```
1. User fills form in Customer App
   ↓
2. Frontend validates input
   ↓
3. POST /api/v1/reservations
   Body: { date, time, partySize, specialRequest }
   Header: Authorization: Bearer <token>
   ↓
4. Backend auth middleware validates token
   ↓
5. Backend validation middleware checks data
   ↓
6. reservationController.create() called
   ↓
7. reservationService.checkAvailability()
   - Query database for conflicts
   ↓
8. If available:
   - reservationService.create()
   - Generate confirmation number
   - Save to database
   - emailService.sendConfirmation()
   ↓
9. Return response to frontend
   ↓
10. Frontend shows success message
```

### 8.2 Order Sent to Kitchen Display

```
1. Server creates order in Admin Panel
   ↓
2. POST /api/v1/orders
   Body: { tableId, items[] }
   ↓
3. orderController.create()
   ↓
4. orderService.create()
   - Save order to database
   - Get order details with items
   ↓
5. Socket.io emits event:
   io.to('kitchen').emit('new_order', orderData)
   ↓
6. Kitchen Display System receives event
   ↓
7. KDS updates UI with new order
   - Plays audio notification
   - Adds order to queue
```

---

## 9. Technology Decisions & Rationale

| Technology | Purpose | Why Chosen |
|------------|---------|------------|
| **React** | Frontend framework | Component-based, large community, team familiarity |
| **TypeScript** | Type safety | Catches errors early, better IDE support, scalable |
| **Tailwind CSS** | Styling | Fast development, consistent design, no CSS conflicts |
| **Node.js + Express** | Backend | JavaScript everywhere, async I/O, vast ecosystem |
| **PostgreSQL** | Database | ACID compliance, relational data fits well, free hosting |
| **Prisma** | ORM | Type-safe queries, migrations, great DX |
| **Socket.io** | Real-time | Easy WebSocket abstraction, fallback support |
| **JWT** | Authentication | Stateless, scalable, industry standard |
| **OpenAI API** | AI Chatbot | Best-in-class NLP, easy integration, good docs |
| **Vercel** | Frontend hosting | Automatic deployments, free tier, fast CDN |
| **Render/Railway** | Backend hosting | Free tier, Docker support, easy setup |

---

## 10. Scalability Considerations

**Current Architecture** (Educational Phase):
- Handles 100 concurrent users
- Single backend server
- Single database instance

**Future Enhancements** (If Deployed Commercially):
- Load balancer for backend
- Redis for session storage
- Horizontal scaling with multiple servers
- Database read replicas
- CDN for static assets
- Message queue (RabbitMQ/Redis) for background jobs

---

## 11. Monitoring & Logging

**Logging Strategy**:
- **Winston** for structured logging
- Log levels: error, warn, info, debug
- Separate log files for errors
- Request/response logging

**Monitoring** (Optional):
- Health check endpoint: `GET /api/v1/health`
- Database connection monitoring
- API response time tracking

---

**Document Version**: 1.0  
**Last Updated**: October 30, 2025  
**Architecture Team**: [Team Name]

