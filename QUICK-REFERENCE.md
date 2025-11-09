# ⚡ Quick Reference Guide

Fast reference for common commands and configurations.

---

## 🚀 Quick Start

```bash
# Start everything
docker-compose up -d

# Stop everything
docker-compose down
```

**URLs:**
- Customer App: http://localhost:3000
- Admin Panel: http://localhost:3001 (`admin@restaurant.com` / `admin123`)
- Kitchen Display: http://localhost:3002
- Backend API: http://localhost:5000/health

---

## 📦 Docker Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs (all)
docker-compose logs -f

# View logs (specific service)
docker-compose logs -f backend
docker-compose logs -f customer-app
docker-compose logs -f admin-panel
docker-compose logs -f kitchen-display

# Restart service
docker-compose restart backend

# Rebuild after code changes
docker-compose up -d --build

# Fresh start (deletes database)
docker-compose down -v
docker-compose up -d --build

# Check status
docker-compose ps

# Stop and remove everything
docker-compose down --rmi all -v
```

---

## 🔧 Backend Commands

```bash
cd backend

# Install dependencies
npm install

# Development
npm run dev                 # Start dev server
npm run build              # Build for production
npm run start              # Start production server

# Database
npm run db:generate        # Generate Prisma Client
npm run db:migrate         # Run migrations
npm run db:seed            # Seed sample data
npm run db:studio          # Open Prisma Studio GUI
npm run db:reset           # Reset database (dev only)

# Testing
npm test                   # Run tests
npm run test:watch         # Watch mode

# Code Quality
npm run lint               # Check code
npm run lint:fix           # Fix issues
```

---

## 🎨 Frontend Commands

**Same for all frontend apps (customer-app, admin-panel, kitchen-display):**

```bash
# Navigate to app directory first
cd frontend/customer-app
# or
cd frontend/admin-panel
# or
cd kitchen-display

# Install dependencies
npm install

# Development
npm run dev                # Start dev server
npm run build             # Build for production
npm run preview           # Preview production build

# Code Quality
npm run lint              # Check code
npm run lint:fix          # Fix issues
```

---

## 📝 Environment Variables

### Backend (.env)

```env
NODE_ENV=development
PORT=5000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/restaurant_db"
JWT_SECRET="your-secret-min-32-chars"
JWT_EXPIRES_IN="24h"
CORS_ORIGINS="http://localhost:3000,http://localhost:3001,http://localhost:3002"
```

### Frontend (.env)

**Customer App & Kitchen Display:**
```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000
```

**Admin Panel:**
```env
VITE_API_URL=http://localhost:5000/api/v1
```

---

## 🗄️ Database Commands

```bash
# PostgreSQL CLI
psql -U postgres -h localhost -d restaurant_db

# Common SQL commands
\l                        # List databases
\c restaurant_db         # Connect to database
\dt                      # List tables
\d table_name           # Describe table
\q                      # Quit

# Backup database
pg_dump -U postgres restaurant_db > backup.sql

# Restore database
psql -U postgres restaurant_db < backup.sql
```

---

## 🔐 Demo Accounts

**Admin:**
- Email: `admin@restaurant.com`
- Password: `admin123`
- Access: Admin Panel (all features)

**Kitchen Staff:**
- Email: `kitchen@restaurant.com`
- Password: `kitchen123`
- Access: Admin Panel (limited)

**Customer:**
- Email: `john.doe@example.com`
- Password: `customer123`
- Access: Customer App only

---

## 🌐 API Endpoints

**Base URL:** `http://localhost:5000/api/v1`

### Authentication
```
POST   /auth/register
POST   /auth/login
GET    /auth/me
POST   /auth/logout
```

### Reservations
```
GET    /reservations
POST   /reservations
GET    /reservations/:id
PUT    /reservations/:id
DELETE /reservations/:id
```

### Menu
```
GET    /menu
POST   /menu              # Admin only
PUT    /menu/:id          # Admin only
DELETE /menu/:id          # Admin only
```

### Orders
```
GET    /orders
POST   /orders
PATCH  /orders/:id/status
```

### Tables
```
GET    /tables
POST   /tables            # Admin only
PUT    /tables/:id        # Admin only
DELETE /tables/:id        # Admin only
```

### Admin
```
GET    /admin/dashboard/stats
GET    /admin/customers
GET    /admin/reservations
PUT    /admin/reservations/:id
```

---

## 🐛 Troubleshooting

### Port in Use

```bash
# Find process
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

### Docker Issues

```bash
# Reset Docker
docker-compose down -v
docker system prune -a
docker-compose up -d --build
```

### Database Issues

```bash
# Restart PostgreSQL
docker-compose restart postgres

# Check logs
docker-compose logs postgres

# Reset database
cd backend
npm run db:reset
```

### NPM Issues

```bash
# Clear cache
npm cache clean --force

# Delete and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📁 Important Files

```
├── README.md              # Main documentation
├── INSTALLATION.md        # Installation guide
├── QUICK-REFERENCE.md     # This file
├── CONTRIBUTING.md        # Contribution guide
├── CHANGELOG.md           # Version history
├── PROJECT-STATUS.md      # Project status
├── docker-compose.yml     # Docker orchestration
├── .gitignore            # Git ignore
├── LICENSE               # MIT License
│
├── backend/
│   ├── .env              # Backend config (create this)
│   ├── prisma/schema.prisma  # Database schema
│   └── src/server.ts     # Main server
│
├── frontend/
│   ├── customer-app/.env # Customer app config
│   ├── admin-panel/.env  # Admin panel config
│   └── ...
│
└── kitchen-display/.env  # Kitchen display config
```

---

## 🔍 File Search

```bash
# Find files by name
find . -name "*.ts"
find . -name "package.json"

# Search in files
grep -r "TODO" .
grep -r "function createOrder" .

# Count lines of code
find . -name "*.ts" | xargs wc -l
```

---

## 📊 Project Stats

```bash
# Count TypeScript files
find . -name "*.ts" -o -name "*.tsx" | wc -l

# Count total lines
find . -name "*.ts" -o -name "*.tsx" | xargs wc -l

# Check Docker disk usage
docker system df
```

---

## 🚦 Service Ports

| Service | Port | URL |
|---------|------|-----|
| Backend API | 5000 | http://localhost:5000 |
| Customer App | 3000 | http://localhost:3000 |
| Admin Panel | 3001 | http://localhost:3001 |
| Kitchen Display | 3002 | http://localhost:3002 |
| PostgreSQL | 5432 | localhost:5432 |
| Prisma Studio | 5555 | http://localhost:5555 |

---

## 📦 Package Managers

```bash
# npm (default)
npm install
npm run dev

# yarn (alternative)
yarn install
yarn dev

# pnpm (alternative)
pnpm install
pnpm dev
```

---

## 🔄 Git Commands

```bash
# Check status
git status

# Create branch
git checkout -b feature/my-feature

# Stage changes
git add .

# Commit
git commit -m "feat: add new feature"

# Push
git push origin feature/my-feature

# Pull latest
git pull origin main

# Merge branch
git merge feature/my-feature
```

---

## 🎯 Testing Checklist

### Customer App
- [ ] Register new account
- [ ] Login
- [ ] Browse menu
- [ ] Filter by category
- [ ] Make reservation
- [ ] View reservations
- [ ] Cancel reservation

### Admin Panel
- [ ] Login as admin
- [ ] View dashboard
- [ ] Manage reservations
- [ ] Add/edit tables
- [ ] Add/edit menu items
- [ ] View orders
- [ ] View customers

### Kitchen Display
- [ ] See orders appear
- [ ] Update order status
- [ ] Hear audio notification
- [ ] Check timer accuracy
- [ ] Test WebSocket connection

---

## 📞 Quick Help

**Installation Issues:**
```bash
# See INSTALLATION.md
cat INSTALLATION.md | less
```

**API Documentation:**
```bash
# See docs/api-specifications.md
cat docs/api-specifications.md | less
```

**Project Status:**
```bash
# See PROJECT-STATUS.md
cat PROJECT-STATUS.md | less
```

---

## 🎨 Color Codes (Tailwind)

```
Primary: blue-600
Success: green-600
Warning: yellow-600
Error: red-600
Info: purple-600

Backgrounds:
- gray-100 (light)
- gray-800 (dark)
- gray-900 (darkest)
```

---

## 🔑 Keyboard Shortcuts

**Browser DevTools:**
- F12 - Open DevTools
- Ctrl+Shift+C - Inspect element
- Ctrl+Shift+J - Console
- Ctrl+Shift+N - Network tab

**VS Code:**
- Ctrl+P - Quick file open
- Ctrl+Shift+P - Command palette
- Ctrl+` - Toggle terminal
- Ctrl+B - Toggle sidebar

---

**Need more help? Check [README.md](README.md) or [INSTALLATION.md](INSTALLATION.md)**

