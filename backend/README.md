# Restaurant Reservation System - Backend API

Backend API server for the Restaurant Reservation System built with Node.js, Express, TypeScript, and PostgreSQL.

## 🛠️ Tech Stack

- **Node.js** v18+
- **Express** - Web framework
- **TypeScript** - Type safety
- **PostgreSQL** - Database
- **Prisma** - ORM
- **Socket.io** - Real-time communication
- **JWT** - Authentication
- **OpenAI API** - AI Chatbot
- **Jest** - Testing

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/              # Configuration files
│   │   ├── database.ts
│   │   ├── jwt.ts
│   │   └── openai.ts
│   │
│   ├── routes/              # API route definitions
│   │   ├── auth.routes.ts
│   │   ├── reservation.routes.ts
│   │   ├── menu.routes.ts
│   │   ├── order.routes.ts
│   │   ├── table.routes.ts
│   │   ├── admin.routes.ts
│   │   └── aiChat.routes.ts
│   │
│   ├── controllers/         # Request handlers
│   │   ├── authController.ts
│   │   ├── reservationController.ts
│   │   ├── menuController.ts
│   │   ├── orderController.ts
│   │   ├── tableController.ts
│   │   └── aiChatController.ts
│   │
│   ├── services/            # Business logic
│   │   ├── authService.ts
│   │   ├── reservationService.ts
│   │   ├── aiChatbotService.ts
│   │   ├── emailService.ts
│   │   └── availabilityService.ts
│   │
│   ├── middleware/          # Express middleware
│   │   ├── auth.middleware.ts
│   │   ├── validation.middleware.ts
│   │   ├── errorHandler.ts
│   │   └── rateLimiter.ts
│   │
│   ├── utils/               # Utility functions
│   │   ├── logger.ts
│   │   ├── responseFormatter.ts
│   │   └── validators.ts
│   │
│   ├── types/               # TypeScript types
│   │   └── index.ts
│   │
│   ├── sockets/             # WebSocket handlers
│   │   └── orderSocket.ts
│   │
│   └── server.ts            # Entry point
│
├── prisma/
│   ├── schema.prisma        # Prisma schema
│   ├── migrations/          # Database migrations
│   └── seed.ts              # Seed data
│
├── tests/                   # Test files
│   ├── unit/
│   └── integration/
│
├── package.json
├── tsconfig.json
├── .eslintrc.json
├── .gitignore
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js v18 or higher
- PostgreSQL v14 or higher
- npm or yarn

### Installation

1. **Install dependencies**
```bash
cd backend
npm install
```

2. **Set up environment variables**
```bash
# Copy the example file
cp env-example.txt .env

# Edit .env with your configuration
nano .env
```

Required environment variables:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `OPENAI_API_KEY` - OpenAI API key for chatbot

3. **Set up database**
```bash
# Generate Prisma Client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed database with sample data (optional)
npm run db:seed
```

4. **Start development server**
```bash
npm run dev
```

Server will start on `http://localhost:5000`

## 📝 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm test` | Run tests with coverage |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint errors |
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:migrate` | Run database migrations |
| `npm run db:seed` | Seed database |
| `npm run db:studio` | Open Prisma Studio (DB GUI) |
| `npm run db:reset` | Reset database (⚠️ deletes all data) |

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Login to get token:
```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password"
}
```

## 📚 API Documentation

Full API documentation available at: `docs/api-specifications.md`

### Base URL
- **Development**: `http://localhost:5000/api/v1`
- **Production**: `https://your-domain.com/api/v1`

### Main Endpoints

**Authentication**
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login
- `GET /auth/me` - Get current user
- `POST /auth/logout` - Logout

**Reservations**
- `GET /reservations` - Get all reservations
- `POST /reservations` - Create reservation
- `GET /reservations/:id` - Get reservation by ID
- `PUT /reservations/:id` - Update reservation
- `DELETE /reservations/:id` - Cancel reservation
- `GET /reservations/availability` - Check availability

**Menu**
- `GET /menu` - Get all menu items
- `GET /menu/:id` - Get menu item by ID

**Orders**
- `GET /orders` - Get all orders
- `POST /orders` - Create order
- `PATCH /orders/:id/status` - Update order status

**Tables**
- `GET /tables` - Get all tables

**Admin** (requires admin role)
- `GET /admin/dashboard/stats` - Dashboard statistics
- `GET /admin/reservations` - All reservations
- `GET /admin/customers` - All customers
- `POST /admin/menu` - Create menu item
- `POST /admin/tables` - Create table

**AI Chatbot**
- `POST /ai-chat/message` - Send message to AI
- `POST /ai-chat/complete-reservation` - Complete AI booking

## 🔌 WebSocket Events

Connect to WebSocket: `ws://localhost:5000`

### Client → Server
- `authenticate` - Authenticate with JWT
- `join_kitchen` - Join kitchen room
- `update_order_status` - Update order status

### Server → Client
- `new_order` - New order created
- `order_updated` - Order status updated
- `order_deleted` - Order cancelled

## 🗄️ Database Schema

Database uses PostgreSQL with Prisma ORM.

Main entities:
- **Users** - Customer and staff accounts
- **Reservations** - Table reservations
- **Tables** - Restaurant tables
- **MenuItems** - Menu items
- **Orders** - Food orders
- **OrderItems** - Individual order items

View full schema: `prisma/schema.prisma`

### Database Management

```bash
# View database in GUI
npm run db:studio

# Create new migration
npx prisma migrate dev --name description

# View current migrations
npx prisma migrate status
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- authService.test.ts

# Run tests with coverage
npm test -- --coverage
```

Test structure:
```
tests/
├── unit/                   # Unit tests
│   ├── services/
│   └── utils/
└── integration/            # Integration tests
    └── api/
```

## 🐛 Debugging

### Enable Debug Logging
Set `NODE_ENV=development` in `.env`

### View Logs
Logs are output to:
- Console (development)
- `logs/error.log` (errors only)
- `logs/combined.log` (all logs)

### Common Issues

**"Cannot connect to database"**
- Check `DATABASE_URL` in `.env`
- Ensure PostgreSQL is running
- Verify database exists

**"JWT token invalid"**
- Check `JWT_SECRET` matches between sessions
- Token may have expired (24 hour default)

**"OpenAI API error"**
- Verify `OPENAI_API_KEY` is correct
- Check API key has credits
- Ensure API key has proper permissions

## 📦 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Environment Variables for Production
Update these in your hosting platform:
- `NODE_ENV=production`
- `DATABASE_URL` - Production database URL
- `JWT_SECRET` - Secure random string
- `CORS_ORIGINS` - Your frontend URLs

### Recommended Hosting
- **Railway** - Free tier, easy setup
- **Render** - Free tier, automatic deployments
- **Heroku** - Simple, but paid
- **DigitalOcean** - VPS option

## 👥 Team Responsibilities

**Student C (Backend Developer)** is responsible for:
- All backend code in this directory
- Database schema and migrations
- API endpoints implementation
- Business logic services
- Authentication and authorization
- WebSocket setup
- Integration with AI API
- API testing

## 🤝 Contributing

1. Create feature branch from `develop`
2. Make changes
3. Write/update tests
4. Commit with conventional commit message
5. Create Pull Request
6. Get approval from 1 team member
7. Merge to `develop`

### Commit Convention
```
feat(scope): add user registration endpoint
fix(auth): resolve token expiration bug
docs(api): update reservation endpoints
```

## 📖 Additional Resources

- [Express Documentation](https://expressjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Socket.io Documentation](https://socket.io/docs/)
- [JWT Introduction](https://jwt.io/introduction)

---

**For questions or issues, check the team Discord channel or create a GitHub issue.**

