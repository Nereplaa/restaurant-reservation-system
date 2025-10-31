# Database Schema Design

## Database: PostgreSQL 14+

---

## Entity Relationship Diagram (ERD)

```
┌─────────────────────┐
│       Users         │
├─────────────────────┤
│ id (PK)             │◄──────────────────┐
│ email (UNIQUE)      │                   │
│ password_hash       │                   │
│ first_name          │                   │ 1
│ last_name           │                   │
│ phone               │                   │
│ role (ENUM)         │                   │
│ created_at          │                   │
│ updated_at          │                   │
└─────────────────────┘                   │
                                          │
                                          │ N
┌─────────────────────┐                   │
│   Reservations      │───────────────────┘
├─────────────────────┤
│ id (PK)             │
│ user_id (FK)        │
│ table_id (FK)       │─────┐
│ date                │     │
│ time                │     │ N
│ party_size          │     │
│ status (ENUM)       │     │
│ special_request     │     │
│ confirmation_number │     │
│ created_at          │     │             ┌─────────────────────┐
│ updated_at          │     │             │      Tables         │
└─────────────────────┘     └─────────────┤ id (PK)             │
         │                                │ table_number        │
         │                                │ capacity            │
         │ 1                              │ location            │
         │                                │ status (ENUM)       │
         │                                │ created_at          │
         │ N                              │ updated_at          │
┌─────────────────────┐                   └─────────────────────┘
│      Orders         │                             ▲
├─────────────────────┤                             │
│ id (PK)             │                             │
│ order_number        │                             │ N
│ reservation_id (FK) │                             │
│ table_id (FK)       │─────────────────────────────┘
│ status (ENUM)       │
│ order_time          │
│ ready_time          │
│ notes               │
│ created_at          │
│ updated_at          │
└─────────────────────┘
         │
         │ 1
         │
         │ N
┌─────────────────────┐
│    OrderItems       │
├─────────────────────┤
│ id (PK)             │
│ order_id (FK)       │                   ┌─────────────────────┐
│ menu_item_id (FK)   │───────────────────┤    MenuItems        │
│ quantity            │      N        1   ├─────────────────────┤
│ special_notes       │                   │ id (PK)             │
│ price_at_order      │                   │ name                │
│ created_at          │                   │ description         │
└─────────────────────┘                   │ price               │
                                          │ category (ENUM)     │
                                          │ image_url           │
                                          │ available (BOOL)    │
                                          │ dietary_tags (JSON) │
                                          │ preparation_time    │
                                          │ created_at          │
                                          │ updated_at          │
                                          └─────────────────────┘
```

---

## Table Definitions

### 1. Users Table

**Purpose**: Store customer and staff user accounts

```sql
CREATE TYPE user_role AS ENUM ('customer', 'admin', 'manager', 'server', 'kitchen');

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  role user_role DEFAULT 'customer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

**Fields**:
- `id`: Unique identifier (UUID)
- `email`: User email (unique, used for login)
- `password_hash`: Bcrypt hashed password (never store plain text!)
- `first_name`: User's first name
- `last_name`: User's last name
- `phone`: Contact phone number
- `role`: User role (customer, admin, manager, server, kitchen)
- `created_at`: Account creation timestamp
- `updated_at`: Last update timestamp

**Sample Data**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "john.doe@example.com",
  "password_hash": "$2b$10$abcdefghijklmnopqrstuvwxyz",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+1234567890",
  "role": "customer",
  "created_at": "2025-10-30T12:00:00Z",
  "updated_at": "2025-10-30T12:00:00Z"
}
```

---

### 2. Tables Table

**Purpose**: Restaurant table inventory

```sql
CREATE TYPE table_status AS ENUM ('available', 'occupied', 'reserved', 'maintenance');

CREATE TABLE tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_number VARCHAR(10) UNIQUE NOT NULL,
  capacity INTEGER NOT NULL CHECK (capacity > 0),
  location VARCHAR(100),
  status table_status DEFAULT 'available',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_tables_status ON tables(status);
CREATE INDEX idx_tables_capacity ON tables(capacity);
```

**Fields**:
- `id`: Unique identifier
- `table_number`: Human-readable table identifier (e.g., "A5", "B12")
- `capacity`: Maximum number of guests
- `location`: Physical location in restaurant (e.g., "Main Hall", "Patio")
- `status`: Current availability status
- `created_at`: Record creation timestamp
- `updated_at`: Last update timestamp

**Sample Data**:
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "table_number": "A5",
  "capacity": 6,
  "location": "Main Hall",
  "status": "available",
  "created_at": "2025-10-30T10:00:00Z",
  "updated_at": "2025-10-30T10:00:00Z"
}
```

---

### 3. Reservations Table

**Purpose**: Store customer reservations

```sql
CREATE TYPE reservation_status AS ENUM ('confirmed', 'completed', 'cancelled', 'no_show');

CREATE TABLE reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  table_id UUID REFERENCES tables(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  party_size INTEGER NOT NULL CHECK (party_size > 0 AND party_size <= 20),
  status reservation_status DEFAULT 'confirmed',
  special_request TEXT,
  confirmation_number VARCHAR(20) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_reservations_user_id ON reservations(user_id);
CREATE INDEX idx_reservations_table_id ON reservations(table_id);
CREATE INDEX idx_reservations_date ON reservations(date);
CREATE INDEX idx_reservations_status ON reservations(status);
CREATE INDEX idx_reservations_confirmation ON reservations(confirmation_number);

-- Composite index for availability checking
CREATE INDEX idx_reservations_date_time ON reservations(date, time);
```

**Fields**:
- `id`: Unique identifier
- `user_id`: Foreign key to users table
- `table_id`: Foreign key to tables (nullable, assigned later)
- `date`: Reservation date
- `time`: Reservation time
- `party_size`: Number of guests
- `status`: Reservation status
- `special_request`: Customer notes (allergies, occasions, etc.)
- `confirmation_number`: Unique booking reference (e.g., "RES-2025-001234")
- `created_at`: Booking creation timestamp
- `updated_at`: Last modification timestamp

**Business Rules**:
- `party_size` must be 1-20
- `date` must be in the future
- `confirmation_number` auto-generated (format: RES-YYYY-NNNNNN)
- Prevent double-booking (same table, overlapping time)

**Sample Data**:
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440002",
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "table_id": "660e8400-e29b-41d4-a716-446655440001",
  "date": "2025-11-15",
  "time": "19:30:00",
  "party_size": 4,
  "status": "confirmed",
  "special_request": "Birthday celebration, need high chair",
  "confirmation_number": "RES-2025-001234",
  "created_at": "2025-10-30T12:00:00Z",
  "updated_at": "2025-10-30T12:00:00Z"
}
```

---

### 4. MenuItems Table

**Purpose**: Restaurant menu with items and details

```sql
CREATE TYPE menu_category AS ENUM ('appetizers', 'mains', 'desserts', 'drinks', 'specials');

CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  category menu_category NOT NULL,
  image_url VARCHAR(500),
  available BOOLEAN DEFAULT true,
  dietary_tags JSONB DEFAULT '[]',
  preparation_time INTEGER DEFAULT 15,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_menu_items_category ON menu_items(category);
CREATE INDEX idx_menu_items_available ON menu_items(available);
CREATE INDEX idx_menu_items_dietary_tags ON menu_items USING GIN (dietary_tags);
```

**Fields**:
- `id`: Unique identifier
- `name`: Item name
- `description`: Detailed description
- `price`: Item price (decimal for currency)
- `category`: Menu category
- `image_url`: URL to item image
- `available`: Currently available for ordering
- `dietary_tags`: JSON array of tags (e.g., ["vegetarian", "gluten-free"])
- `preparation_time`: Minutes to prepare
- `created_at`: Record creation timestamp
- `updated_at`: Last update timestamp

**Sample Data**:
```json
{
  "id": "880e8400-e29b-41d4-a716-446655440003",
  "name": "Grilled Salmon",
  "description": "Fresh Atlantic salmon with herbs and lemon",
  "price": 24.99,
  "category": "mains",
  "image_url": "https://cdn.example.com/salmon.jpg",
  "available": true,
  "dietary_tags": ["gluten-free", "dairy-free"],
  "preparation_time": 20,
  "created_at": "2025-10-30T10:00:00Z",
  "updated_at": "2025-10-30T10:00:00Z"
}
```

---

### 5. Orders Table

**Purpose**: Track food orders from tables

```sql
CREATE TYPE order_status AS ENUM ('pending', 'preparing', 'ready', 'served', 'cancelled');

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(20) UNIQUE NOT NULL,
  reservation_id UUID REFERENCES reservations(id) ON DELETE SET NULL,
  table_id UUID REFERENCES tables(id) ON DELETE SET NULL,
  status order_status DEFAULT 'pending',
  order_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  ready_time TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_orders_reservation_id ON orders(reservation_id);
CREATE INDEX idx_orders_table_id ON orders(table_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_order_time ON orders(order_time);
```

**Fields**:
- `id`: Unique identifier
- `order_number`: Human-readable order number (e.g., "ORD-001")
- `reservation_id`: Optional link to reservation
- `table_id`: Which table placed the order
- `status`: Current order status
- `order_time`: When order was placed
- `ready_time`: When order was marked ready
- `notes`: General order notes
- `created_at`: Record creation timestamp
- `updated_at`: Last update timestamp

**Sample Data**:
```json
{
  "id": "990e8400-e29b-41d4-a716-446655440004",
  "order_number": "ORD-001",
  "reservation_id": "770e8400-e29b-41d4-a716-446655440002",
  "table_id": "660e8400-e29b-41d4-a716-446655440001",
  "status": "pending",
  "order_time": "2025-11-15T19:45:00Z",
  "ready_time": null,
  "notes": "Rush order",
  "created_at": "2025-11-15T19:45:00Z",
  "updated_at": "2025-11-15T19:45:00Z"
}
```

---

### 6. OrderItems Table

**Purpose**: Individual items within an order (junction table)

```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price_at_order DECIMAL(10, 2) NOT NULL,
  special_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_menu_item_id ON order_items(menu_item_id);
```

**Fields**:
- `id`: Unique identifier
- `order_id`: Foreign key to orders
- `menu_item_id`: Foreign key to menu_items
- `quantity`: Number of this item ordered
- `price_at_order`: Price at time of order (snapshot for historical accuracy)
- `special_notes`: Item-specific notes (e.g., "No onions")
- `created_at`: Record creation timestamp

**Why `price_at_order`?**  
Menu prices can change, but we need to know what the customer was charged.

**Sample Data**:
```json
{
  "id": "aa0e8400-e29b-41d4-a716-446655440005",
  "order_id": "990e8400-e29b-41d4-a716-446655440004",
  "menu_item_id": "880e8400-e29b-41d4-a716-446655440003",
  "quantity": 2,
  "price_at_order": 24.99,
  "special_notes": "No lemon",
  "created_at": "2025-11-15T19:45:00Z"
}
```

---

## Relationships Summary

| Relationship | Type | Description |
|--------------|------|-------------|
| Users → Reservations | 1:N | One user can have many reservations |
| Tables → Reservations | 1:N | One table can have many reservations (over time) |
| Reservations → Orders | 1:N | One reservation can have multiple orders |
| Tables → Orders | 1:N | One table can have many orders |
| Orders → OrderItems | 1:N | One order contains many items |
| MenuItems → OrderItems | 1:N | One menu item can be in many orders |

---

## Database Constraints

### Primary Keys
All tables use UUID as primary keys for:
- Global uniqueness
- Security (not sequential)
- Distributed system friendly

### Foreign Keys with Cascade Rules
- `ON DELETE CASCADE`: When parent deleted, children deleted too
  - users → reservations (delete user = delete their reservations)
  - orders → order_items (delete order = delete its items)

- `ON DELETE SET NULL`: When parent deleted, reference set to null
  - tables → reservations (delete table = reservation keeps record)
  - reservations → orders (delete reservation = order keeps record)

- `ON DELETE RESTRICT`: Prevent deletion if children exist
  - menu_items → order_items (can't delete menu item in existing orders)

### Check Constraints
- `party_size` between 1 and 20
- `capacity` > 0
- `quantity` > 0
- `price` >= 0

### Unique Constraints
- `users.email`
- `tables.table_number`
- `reservations.confirmation_number`
- `orders.order_number`

---

## Indexes Strategy

### Why Indexes?
Indexes speed up data retrieval but slow down inserts/updates. We index:
- Foreign keys (for JOINs)
- Fields used in WHERE clauses
- Fields used for sorting (ORDER BY)

### Indexes in This Schema:
- Email lookups (login)
- Reservation date searches
- Table status filtering
- Order status filtering
- Menu category filtering

---

## Prisma Schema

For this project, we'll use **Prisma ORM**. Here's the Prisma schema:

**File**: `backend/src/models/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum UserRole {
  customer
  admin
  manager
  server
  kitchen
}

enum TableStatus {
  available
  occupied
  reserved
  maintenance
}

enum ReservationStatus {
  confirmed
  completed
  cancelled
  no_show
}

enum OrderStatus {
  pending
  preparing
  ready
  served
  cancelled
}

enum MenuCategory {
  appetizers
  mains
  desserts
  drinks
  specials
}

model User {
  id            String        @id @default(uuid())
  email         String        @unique
  passwordHash  String        @map("password_hash")
  firstName     String        @map("first_name")
  lastName      String        @map("last_name")
  phone         String?
  role          UserRole      @default(customer)
  createdAt     DateTime      @default(now()) @map("created_at")
  updatedAt     DateTime      @updatedAt @map("updated_at")
  
  reservations  Reservation[]
  
  @@index([email])
  @@index([role])
  @@map("users")
}

model Table {
  id           String       @id @default(uuid())
  tableNumber  String       @unique @map("table_number")
  capacity     Int
  location     String?
  status       TableStatus  @default(available)
  createdAt    DateTime     @default(now()) @map("created_at")
  updatedAt    DateTime     @updatedAt @map("updated_at")
  
  reservations Reservation[]
  orders       Order[]
  
  @@index([status])
  @@index([capacity])
  @@map("tables")
}

model Reservation {
  id                 String            @id @default(uuid())
  userId             String            @map("user_id")
  tableId            String?           @map("table_id")
  date               DateTime          @db.Date
  time               DateTime          @db.Time
  partySize          Int               @map("party_size")
  status             ReservationStatus @default(confirmed)
  specialRequest     String?           @map("special_request") @db.Text
  confirmationNumber String            @unique @map("confirmation_number")
  createdAt          DateTime          @default(now()) @map("created_at")
  updatedAt          DateTime          @updatedAt @map("updated_at")
  
  user               User              @relation(fields: [userId], references: [id], onDelete: Cascade)
  table              Table?            @relation(fields: [tableId], references: [id], onDelete: SetNull)
  orders             Order[]
  
  @@index([userId])
  @@index([tableId])
  @@index([date])
  @@index([status])
  @@index([confirmationNumber])
  @@index([date, time])
  @@map("reservations")
}

model MenuItem {
  id               String        @id @default(uuid())
  name             String
  description      String?       @db.Text
  price            Decimal       @db.Decimal(10, 2)
  category         MenuCategory
  imageUrl         String?       @map("image_url")
  available        Boolean       @default(true)
  dietaryTags      Json          @default("[]") @map("dietary_tags")
  preparationTime  Int           @default(15) @map("preparation_time")
  createdAt        DateTime      @default(now()) @map("created_at")
  updatedAt        DateTime      @updatedAt @map("updated_at")
  
  orderItems       OrderItem[]
  
  @@index([category])
  @@index([available])
  @@map("menu_items")
}

model Order {
  id             String      @id @default(uuid())
  orderNumber    String      @unique @map("order_number")
  reservationId  String?     @map("reservation_id")
  tableId        String?     @map("table_id")
  status         OrderStatus @default(pending)
  orderTime      DateTime    @default(now()) @map("order_time")
  readyTime      DateTime?   @map("ready_time")
  notes          String?     @db.Text
  createdAt      DateTime    @default(now()) @map("created_at")
  updatedAt      DateTime    @updatedAt @map("updated_at")
  
  reservation    Reservation? @relation(fields: [reservationId], references: [id], onDelete: SetNull)
  table          Table?       @relation(fields: [tableId], references: [id], onDelete: SetNull)
  orderItems     OrderItem[]
  
  @@index([reservationId])
  @@index([tableId])
  @@index([status])
  @@index([orderTime])
  @@map("orders")
}

model OrderItem {
  id            String   @id @default(uuid())
  orderId       String   @map("order_id")
  menuItemId    String   @map("menu_item_id")
  quantity      Int
  priceAtOrder  Decimal  @map("price_at_order") @db.Decimal(10, 2)
  specialNotes  String?  @map("special_notes") @db.Text
  createdAt     DateTime @default(now()) @map("created_at")
  
  order         Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  menuItem      MenuItem @relation(fields: [menuItemId], references: [id], onDelete: Restrict)
  
  @@index([orderId])
  @@index([menuItemId])
  @@map("order_items")
}
```

---

## Common Queries

### 1. Check Availability for a Date/Time
```sql
SELECT t.*
FROM tables t
WHERE t.capacity >= 4
  AND t.status = 'available'
  AND t.id NOT IN (
    SELECT table_id
    FROM reservations
    WHERE date = '2025-11-15'
      AND time BETWEEN '19:00:00' AND '21:00:00'
      AND status IN ('confirmed', 'completed')
  );
```

### 2. Get Customer's Upcoming Reservations
```sql
SELECT r.*, t.table_number, t.location
FROM reservations r
LEFT JOIN tables t ON r.table_id = t.id
WHERE r.user_id = 'user-uuid'
  AND r.date >= CURRENT_DATE
  AND r.status = 'confirmed'
ORDER BY r.date, r.time;
```

### 3. Get Today's Orders for Kitchen Display
```sql
SELECT 
  o.order_number,
  o.status,
  o.order_time,
  t.table_number,
  json_agg(
    json_build_object(
      'name', mi.name,
      'quantity', oi.quantity,
      'specialNotes', oi.special_notes
    )
  ) as items
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
JOIN menu_items mi ON oi.menu_item_id = mi.id
LEFT JOIN tables t ON o.table_id = t.id
WHERE DATE(o.order_time) = CURRENT_DATE
  AND o.status IN ('pending', 'preparing')
GROUP BY o.id, o.order_number, o.status, o.order_time, t.table_number
ORDER BY o.order_time;
```

### 4. Get Admin Dashboard Statistics
```sql
-- Today's reservations count
SELECT COUNT(*) FROM reservations 
WHERE date = CURRENT_DATE AND status = 'confirmed';

-- This week's reservations
SELECT COUNT(*) FROM reservations 
WHERE date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
  AND status = 'confirmed';

-- Total customers
SELECT COUNT(*) FROM users WHERE role = 'customer';

-- Popular menu items this month
SELECT mi.name, COUNT(oi.id) as order_count
FROM order_items oi
JOIN menu_items mi ON oi.menu_item_id = mi.id
JOIN orders o ON oi.order_id = o.id
WHERE o.order_time >= DATE_TRUNC('month', CURRENT_DATE)
GROUP BY mi.id, mi.name
ORDER BY order_count DESC
LIMIT 10;
```

---

## Seed Data Script

For development, create initial data:

```sql
-- Admin user
INSERT INTO users (email, password_hash, first_name, last_name, role)
VALUES ('admin@restaurant.com', '$2b$10$...', 'Admin', 'User', 'admin');

-- Sample tables
INSERT INTO tables (table_number, capacity, location, status)
VALUES 
  ('A1', 2, 'Main Hall', 'available'),
  ('A2', 2, 'Main Hall', 'available'),
  ('A3', 4, 'Main Hall', 'available'),
  ('A4', 4, 'Main Hall', 'available'),
  ('A5', 6, 'Main Hall', 'available'),
  ('B1', 4, 'Patio', 'available'),
  ('B2', 6, 'Patio', 'available'),
  ('B3', 8, 'Patio', 'available');

-- Sample menu items
INSERT INTO menu_items (name, description, price, category, available, dietary_tags)
VALUES
  ('Caesar Salad', 'Classic Caesar with romaine and parmesan', 12.99, 'appetizers', true, '["vegetarian"]'),
  ('Grilled Salmon', 'Fresh Atlantic salmon with herbs', 24.99, 'mains', true, '["gluten-free"]'),
  ('Ribeye Steak', '12oz premium ribeye', 34.99, 'mains', true, '["gluten-free"]'),
  ('Chocolate Cake', 'Rich chocolate layer cake', 8.99, 'desserts', true, '["vegetarian"]'),
  ('Craft Beer', 'Local craft beer selection', 6.99, 'drinks', true, '[]');
```

---

## Database Migrations

Using Prisma, migrations are managed automatically:

```bash
# Create a new migration
npx prisma migrate dev --name init

# Apply migrations to production
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate

# Reset database (dev only!)
npx prisma migrate reset
```

---

## Backup Strategy

### Development:
- No automated backups (use migrations)
- Manual backups before major changes

### Production:
- Daily automated backups (Supabase/Neon provides this)
- Keep last 7 days
- Test restore process monthly

---

**Document Version**: 1.0  
**Last Updated**: October 30, 2025  
**Database Team**: [Team Name]

