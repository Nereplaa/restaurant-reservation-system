# 🍽️ Restaurant Management System

A comprehensive, production-ready restaurant management system with real-time order tracking, reservation management, and administrative controls.

![Status](https://img.shields.io/badge/Status-Production%20Ready-success)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Installation](#-installation)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

---

## ✨ Features

### 🎯 Core Features

- **Customer Portal**
  - Browse menu with category filters
  - Make and manage reservations
  - User authentication and profile
  - Responsive mobile-friendly design

- **Admin Dashboard**
  - Real-time statistics and analytics
  - Reservation management with table assignment
  - Menu item CRUD operations
  - Table management
  - Customer management
  - Order tracking and status updates

- **Kitchen Display System**
  - Real-time order notifications via WebSocket
  - Visual order timer with color-coding
  - Audio alerts for new orders
  - Touch-friendly interface
  - Order status workflow (Pending → Preparing → Ready → Served)

- **Backend API**
  - RESTful API with JWT authentication
  - Role-based access control (Customer, Admin, Kitchen Staff)
  - WebSocket for real-time updates
  - PostgreSQL database with Prisma ORM
  - Comprehensive error handling and logging

---

## 🛠️ Tech Stack

### Backend
- **Node.js** v18+ with Express
- **TypeScript** for type safety
- **PostgreSQL** v14+ database
- **Prisma ORM** for database management
- **Socket.io** for WebSocket communication
- **JWT** for authentication
- **bcrypt** for password hashing

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Axios** for API calls
- **React Router** for navigation
- **Socket.io-client** for real-time updates

### DevOps
- **Docker** & **Docker Compose** for containerization
- **Nginx** for serving frontend apps
- **Git** for version control

---

## 🚀 Quick Start

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed
- Git (optional, for cloning)

### Start Everything (1 Command!)

```bash
# Clone repository (if you haven't already)
git clone <your-repository-url>
cd restaurant-service-system

# Start all services
docker-compose up -d

# Wait 1-2 minutes for services to initialize
```

### Access Applications

Once running, open your browser:

| Application | URL | Credentials |
|------------|-----|-------------|
| **Customer App** | http://localhost:3000 | Register new account |
| **Admin Panel** | http://localhost:3001 | `admin@restaurant.com` / `admin123` |
| **Kitchen Display** | http://localhost:3002 | No login required |
| **Backend API** | http://localhost:5000/health | - |

### Demo Accounts

After seeding, use these test accounts:

**Admin:**
- Email: `admin@restaurant.com`
- Password: `admin123`

**Kitchen Staff:**
- Email: `kitchen@restaurant.com`
- Password: `kitchen123`

**Customer:**
- Email: `john.doe@example.com`
- Password: `customer123`

---

## 📦 Installation

### Option 1: Docker (Recommended)

**Requirements:**
- Docker Desktop 4.0+
- 4GB RAM minimum

**Steps:**

```bash
# 1. Clone repository
git clone <your-repository-url>
cd restaurant-service-system

# 2. Start with Docker Compose
docker-compose up -d

# 3. View logs (optional)
docker-compose logs -f

# 4. Access applications at localhost
```

**Docker Commands:**

```bash
# Stop all services
docker-compose down

# Rebuild after code changes
docker-compose up -d --build

# Fresh start (removes database data)
docker-compose down -v
docker-compose up -d --build

# View service status
docker-compose ps

# View logs for specific service
docker-compose logs -f backend
```

---

### Option 2: Local Development

**Requirements:**
- Node.js 18+ ([Download](https://nodejs.org/))
- PostgreSQL 14+ ([Download](https://www.postgresql.org/download/))
- npm or yarn

**Backend Setup:**

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
cp env-example.txt .env

# Edit .env with your database credentials
# DATABASE_URL="postgresql://user:password@localhost:5432/restaurant_db"
# JWT_SECRET="your-secret-key-min-32-characters"

# Generate Prisma Client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed database with sample data
npm run db:seed

# Start development server
npm run dev
```

**Frontend Apps Setup:**

Open 3 separate terminals:

**Terminal 1 - Customer App:**
```bash
cd frontend/customer-app
npm install
npm run dev
# Runs on http://localhost:3000
```

**Terminal 2 - Admin Panel:**
```bash
cd frontend/admin-panel
npm install
npm run dev
# Runs on http://localhost:3001
```

**Terminal 3 - Kitchen Display:**
```bash
cd kitchen-display
npm install
npm run dev
# Runs on http://localhost:3002
```

---

## 📖 Usage

### For Customers

1. Visit http://localhost:3000
2. Register a new account
3. Browse the menu
4. Make a reservation:
   - Select date and time
   - Choose number of guests
   - Add special requests
5. View and manage your reservations

### For Restaurant Staff (Admin)

1. Visit http://localhost:3001
2. Login with admin credentials
3. **Dashboard**: View statistics and recent activity
4. **Reservations**: 
   - View all bookings
   - Assign tables
   - Update reservation status
5. **Tables**: Add and manage restaurant tables
6. **Menu**: Create and update menu items
7. **Orders**: Track and update order status
8. **Customers**: View customer information

### For Kitchen Staff

1. Visit http://localhost:3002
2. View incoming orders in real-time
3. Update order status:
   - Click "Start Preparing" when you begin
   - Click "Mark Ready" when food is ready
   - Click "Mark as Served" when delivered
4. Monitor order timers

---

## 🔌 API Documentation

### Base URL

```
http://localhost:5000/api/v1
```

### Authentication

Include JWT token in headers:
```
Authorization: Bearer <your-jwt-token>
```

### Endpoints

#### Authentication
```
POST   /auth/register     - Register new user
POST   /auth/login        - Login user
GET    /auth/me           - Get current user
POST   /auth/logout       - Logout user
```

#### Reservations
```
GET    /reservations           - Get user's reservations
POST   /reservations           - Create new reservation
GET    /reservations/:id       - Get specific reservation
PUT    /reservations/:id       - Update reservation
DELETE /reservations/:id       - Cancel reservation
```

#### Menu
```
GET    /menu              - Get all menu items
GET    /menu/:id          - Get specific menu item
POST   /menu              - Create menu item (Admin)
PUT    /menu/:id          - Update menu item (Admin)
DELETE /menu/:id          - Delete menu item (Admin)
```

#### Orders
```
GET    /orders            - Get all orders
POST   /orders            - Create new order
GET    /orders/:id        - Get specific order
PATCH  /orders/:id/status - Update order status
```

#### Tables
```
GET    /tables            - Get all tables
POST   /tables            - Create table (Admin)
PUT    /tables/:id        - Update table (Admin)
DELETE /tables/:id        - Delete table (Admin)
```

#### Admin
```
GET    /admin/dashboard/stats    - Get dashboard statistics
GET    /admin/customers          - Get all customers
GET    /admin/reservations       - Get all reservations
PUT    /admin/reservations/:id   - Update any reservation
```

**Full API Documentation:** See [docs/api-specifications.md](docs/api-specifications.md)

---

## 📁 Project Structure

```
restaurant-service-system/
│
├── backend/                        # Node.js + Express API
│   ├── prisma/
│   │   ├── schema.prisma          # Database schema
│   │   └── seed.ts                # Sample data seeder
│   ├── src/
│   │   ├── controllers/           # Route controllers
│   │   ├── middleware/            # Auth, error handling
│   │   ├── routes/                # API routes
│   │   ├── sockets/               # WebSocket handlers
│   │   ├── utils/                 # Helper functions
│   │   └── server.ts              # Main server file
│   ├── Dockerfile                 # Backend container
│   └── package.json               # Backend dependencies
│
├── frontend/
│   ├── customer-app/              # Customer interface
│   │   ├── src/
│   │   │   ├── components/        # React components
│   │   │   ├── contexts/          # React contexts
│   │   │   ├── pages/             # Page components
│   │   │   └── services/          # API services
│   │   ├── Dockerfile             # Customer app container
│   │   └── package.json           # Dependencies
│   │
│   └── admin-panel/               # Admin dashboard
│       ├── src/
│       │   ├── components/        # React components
│       │   ├── contexts/          # React contexts
│       │   ├── pages/             # Page components
│       │   └── services/          # API services
│       ├── Dockerfile             # Admin panel container
│       └── package.json           # Dependencies
│
├── kitchen-display/               # Kitchen Display System
│   ├── src/
│   │   ├── components/            # React components
│   │   ├── services/              # API & Socket services
│   │   └── App.tsx                # Main app
│   ├── Dockerfile                 # KDS container
│   └── package.json               # Dependencies
│
├── docs/                          # Documentation
│   ├── api-specifications.md      # API documentation
│   ├── architecture.md            # System architecture
│   ├── database-schema.md         # Database design
│   └── requirements.md            # Project requirements
│
├── docker-compose.yml             # Docker orchestration
├── .dockerignore                  # Docker ignore patterns
├── .gitignore                     # Git ignore patterns
└── README.md                      # This file
```

---

## 🌐 Deployment

### Deploy to Cloud

#### Recommended Platforms:

**Backend + Database:**
- [Railway.app](https://railway.app/) - Easiest, supports Docker
- [Heroku](https://heroku.com/) - With Heroku Postgres
- [DigitalOcean App Platform](https://www.digitalocean.com/products/app-platform/)
- [AWS](https://aws.amazon.com/) - EC2 + RDS

**Frontend Apps:**
- [Vercel](https://vercel.com/) - Best for React apps
- [Netlify](https://netlify.com/) - Static hosting
- [Cloudflare Pages](https://pages.cloudflare.com/)

#### Deployment Steps:

**1. Push to GitHub:**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo>
git push -u origin main
```

**2. Deploy Backend (Railway):**
- Connect GitHub repository
- Set environment variables
- Deploy automatically from Docker

**3. Deploy Frontends (Vercel):**
- Import project from GitHub
- Configure build settings
- Set environment variables
- Deploy

**4. Update Environment Variables:**
```env
# Backend
DATABASE_URL=<production-database-url>
JWT_SECRET=<strong-random-secret>
CORS_ORIGINS=https://yourdomain.com

# Frontends
VITE_API_URL=https://api.yourdomain.com/api/v1
```

---

## 🔒 Security

### Production Checklist:

- [ ] Change JWT secret to strong random value (64+ characters)
- [ ] Update all default passwords
- [ ] Enable HTTPS with SSL certificate
- [ ] Configure CORS properly for your domains
- [ ] Use strong database passwords
- [ ] Enable rate limiting
- [ ] Set up database backups
- [ ] Configure environment variables securely
- [ ] Enable logging and monitoring
- [ ] Review and test all security measures

---

## 🧪 Testing

### Run Tests:

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend/customer-app
npm test
```

### Manual Testing:

1. **Customer Flow:**
   - Register → Browse Menu → Make Reservation → View Reservations

2. **Admin Flow:**
   - Login → View Dashboard → Manage Reservations → Assign Tables

3. **Kitchen Flow:**
   - View Orders → Update Status → Complete Order

4. **Real-time Test:**
   - Create order in admin panel
   - Verify it appears in kitchen display instantly

---

## 🛠️ Development

### Prerequisites Installation:

**Node.js:**
```bash
# Download from https://nodejs.org/
# Or use nvm (recommended):
nvm install 18
nvm use 18
```

**PostgreSQL:**
```bash
# Windows: Download from https://www.postgresql.org/download/windows/
# Mac: brew install postgresql@14
# Linux: sudo apt install postgresql-14
```

**Docker:**
```bash
# Download Docker Desktop from:
# https://www.docker.com/products/docker-desktop/
```

### Environment Variables:

**backend/.env:**
```env
NODE_ENV=development
PORT=5000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/restaurant_db?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production-min-32-chars"
JWT_EXPIRES_IN="24h"
CORS_ORIGINS="http://localhost:3000,http://localhost:3001,http://localhost:3002"
```

**frontend/customer-app/.env:**
```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000
```

**frontend/admin-panel/.env:**
```env
VITE_API_URL=http://localhost:5000/api/v1
```

**kitchen-display/.env:**
```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000
```

### Database Management:

```bash
# Generate Prisma Client
npm run db:generate

# Create migration
npm run db:migrate

# Seed database
npm run db:seed

# Open Prisma Studio (GUI)
npm run db:studio

# Reset database
npm run db:reset
```

---

## 🐛 Troubleshooting

### Common Issues:

**Port Already in Use:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

**Database Connection Error:**
```bash
# Check PostgreSQL is running
# Windows: Check Services
# Mac: brew services list
# Linux: systemctl status postgresql

# Test connection
psql -U postgres -h localhost -d restaurant_db
```

**Docker Issues:**
```bash
# Restart Docker Desktop

# Remove all containers and volumes
docker-compose down -v

# Rebuild from scratch
docker-compose build --no-cache
docker-compose up -d
```

**Frontend Not Connecting:**
- Check `.env` files have correct API URLs
- Verify backend is running: `curl http://localhost:5000/health`
- Check browser console for errors (F12)

---

## 📊 Features Overview

| Feature | Customer App | Admin Panel | Kitchen Display |
|---------|-------------|-------------|-----------------|
| Authentication | ✅ | ✅ | ❌ |
| Menu Browse | ✅ | ✅ (Edit) | ❌ |
| Reservations | ✅ (Own) | ✅ (All) | ❌ |
| Orders | ❌ | ✅ (View) | ✅ (Manage) |
| Tables | ❌ | ✅ (Manage) | ❌ |
| Real-time Updates | ✅ | ✅ | ✅ |
| Dashboard | ❌ | ✅ | ❌ |

---

## 🤝 Contributing

### How to Contribute:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Code Style:

- Use TypeScript for all new code
- Follow ESLint configuration
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation as needed

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

Built by Team [Your Team Name] as part of Software Engineering course.

---

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by real-world restaurant management needs
- Thanks to all contributors and testers

---

## 📞 Support

For issues or questions:

1. Check [Troubleshooting](#-troubleshooting) section
2. Review documentation in `/docs` folder
3. Create an issue on GitHub
4. Contact team members

---

## 🗺️ Roadmap

### Future Enhancements:

- [ ] AI Chatbot for reservations (OpenAI integration)
- [ ] Email notifications for reservations
- [ ] SMS reminders
- [ ] Mobile apps (React Native)
- [ ] Payment integration
- [ ] QR code menu
- [ ] Multi-location support
- [ ] Advanced analytics
- [ ] Customer loyalty program
- [ ] Online ordering system

---

## 📈 Project Stats

- **Lines of Code:** 5000+
- **Technologies:** 15+
- **Pages:** 20+
- **API Endpoints:** 30+
- **Real-time Events:** 5+

---

**⭐ If you find this project helpful, please give it a star!**

---

Made with ❤️ and ☕ by the team
