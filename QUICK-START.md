# Quick Start Guide

Get the Restaurant Service System running in 5 minutes.

## Prerequisites

- Docker and Docker Compose (recommended)
- OR Python 3.11+, Node.js 18+, and PostgreSQL 15+

## Option 1: Docker (Fastest)

### Step 1: Clone Repository

```bash
git clone <repository-url>
cd restaurant-service-system
```

### Step 2: Start All Services

```bash
docker-compose up --build
```

Wait 2-3 minutes for all services to start.

### Step 3: Access Applications

- **Customer App**: http://localhost:3000
- **Admin Panel**: http://localhost:3001
- **Kitchen Display**: http://localhost:3002
- **API Documentation**: http://localhost:5000/api/docs
- **API Health Check**: http://localhost:5000/health

## Option 2: Local Development

### Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Setup environment
cp .env.example .env
# Edit .env if needed

# Seed database
python seed.py

# Start server
python run.py
```

Backend runs at http://localhost:5000

### Frontend Setup

Repeat for each frontend: `customer-app`, `admin-panel`, `kitchen-display`

```bash
cd frontend/customer-app

# Install dependencies
npm install

# Start development server
npm run dev
```

## Test Accounts

After seeding, use these credentials:

### Admin
- Email: admin@restaurant.com
- Password: admin123
- Access: Full system control

### Manager
- Email: manager@restaurant.com
- Password: manager123
- Access: Menu, tables, reservations

### Server
- Email: server@restaurant.com
- Password: server123
- Access: Orders, tables

### Kitchen
- Email: kitchen@restaurant.com
- Password: kitchen123
- Access: View and update orders

### Customer
- Email: customer@example.com
- Password: customer123
- Access: Browse menu, make reservations

## Testing the System

### 1. Test Backend API

```bash
# Health check
curl http://localhost:5000/health

# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@restaurant.com","password":"admin123"}'

# Get menu items
curl http://localhost:5000/api/v1/menu
```

### 2. Test Frontend Apps

1. Open Customer App (http://localhost:3000)
2. Browse menu items
3. Try logging in with customer account
4. Create a test reservation

### 3. Test Admin Panel

1. Open Admin Panel (http://localhost:3001)
2. Login with admin credentials
3. View dashboard statistics
4. Browse orders, reservations, tables

### 4. Test Kitchen Display

1. Open Kitchen Display (http://localhost:3002)
2. See real-time order updates
3. Test order status changes

## Sample Data Included

After seeding:

- **5 Users** with different roles
- **8 Tables** (various capacities: 2, 4, 6, 8 seats)
- **17 Menu Items** (Turkish restaurant menu)
  - 2 Soups
  - 3 Appetizers
  - 3 Kebabs
  - 3 Main Dishes
  - 3 Desserts
  - 3 Drinks
- **1 Sample Reservation**

## Troubleshooting

### Port Already in Use

Change ports in `docker-compose.yml` or `.env` files:

```yaml
# docker-compose.yml
ports:
  - "5001:5000"  # Backend
  - "3010:3000"  # Customer App
```

### Database Connection Error

Check PostgreSQL is running:

```bash
# With Docker
docker ps | grep postgres

# Local
pg_isready
```

Verify DATABASE_URL in `backend/.env`:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/restaurant_db
```

### Frontend Can't Connect to Backend

Check VITE_API_URL in frontend `.env` files:
```env
VITE_API_URL=http://localhost:5000/api/v1
```

### Python Module Not Found

Ensure virtual environment is activated:
```bash
# You should see (venv) in terminal
# If not:
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows

# Reinstall dependencies
pip install -r requirements.txt
```

### Docker Build Fails

Remove old containers and volumes:
```bash
docker-compose down -v
docker-compose up --build
```

## Common Tasks

### Reset Database

```bash
# With Docker
docker-compose down -v
docker-compose up --build

# Local
dropdb restaurant_db
createdb restaurant_db
python backend/seed.py
```

### View Logs

```bash
# Docker - all services
docker-compose logs -f

# Docker - specific service
docker-compose logs -f backend

# Local - backend logs in terminal where run.py is running
```

### Stop All Services

```bash
# Docker
docker-compose down

# Local - press Ctrl+C in each terminal
```

## Next Steps

1. **Explore API**: Visit http://localhost:5000/api/docs for interactive API documentation
2. **Read Documentation**: See `backend/README.md` for detailed backend info
3. **Check Project Structure**: See `PROJECT-STRUCTURE.md` for architecture details
4. **Customize**: Modify menu items, add features, adjust styling

## Quick Commands Reference

```bash
# Start with Docker
docker-compose up --build

# Stop Docker services
docker-compose down

# Reset everything
docker-compose down -v

# Backend only
cd backend && python run.py

# Frontend only
cd frontend/customer-app && npm run dev

# Seed database
cd backend && python seed.py

# View API docs
http://localhost:5000/api/docs
```

## Development Tips

1. **Backend Hot Reload**: FastAPI automatically reloads on code changes
2. **Frontend Hot Reload**: Vite provides instant hot module replacement
3. **Database Viewer**: Use pgAdmin or DBeaver to browse database
4. **API Testing**: Use built-in Swagger UI at `/api/docs`
5. **Real-time Testing**: Open Kitchen Display and create orders from Admin Panel

## Support

- Main documentation: `README.md`
- Backend details: `backend/README.md`
- Project structure: `PROJECT-STRUCTURE.md`
- Issues: Open on GitHub

---

Happy coding!
