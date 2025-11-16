# Restaurant Service System

A complete restaurant management system with Python FastAPI backend and React frontends.

## Overview

This system provides a comprehensive solution for restaurant operations including customer reservations, menu management, order processing, and real-time kitchen display updates.

### Key Features

- **Customer Portal**: Browse menu, make reservations, manage bookings
- **Admin Dashboard**: Full system management and analytics
- **Kitchen Display**: Real-time order tracking and status updates
- **Multi-role Access**: Customer, Server, Kitchen Staff, Manager, and Admin roles
- **Real-time Updates**: WebSocket-based live order notifications
- **Bilingual Menu**: Turkish and English menu item names

## Tech Stack

### Backend
- **Python 3.11+** with FastAPI framework
- **SQLAlchemy** ORM for database operations
- **PostgreSQL** database
- **JWT** authentication
- **Socket.IO** for real-time communication
- **Pydantic** for data validation

### Frontend
- **React 18** with TypeScript
- **Vite** build tool
- **TailwindCSS** for styling
- **Axios** for HTTP requests
- **Socket.IO Client** for real-time updates

### Infrastructure
- **Docker** and Docker Compose
- **Nginx** for serving static files
- **Alembic** for database migrations

## Quick Start

### Using Docker (Recommended)

```bash
docker-compose up --build
```

Then access:
- Customer App: http://localhost:3000
- Admin Panel: http://localhost:3001
- Kitchen Display: http://localhost:3002
- API Documentation: http://localhost:5000/api/docs

### Local Development

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python seed.py
python run.py
```

**Frontend:**
```bash
cd frontend/customer-app  # or admin-panel, or kitchen-display
npm install
npm run dev
```

## Test Accounts

After running the seed script:

| Role     | Email                    | Password    |
|----------|--------------------------|-------------|
| Admin    | admin@restaurant.com     | admin123    |
| Manager  | manager@restaurant.com   | manager123  |
| Server   | server@restaurant.com    | server123   |
| Kitchen  | kitchen@restaurant.com   | kitchen123  |
| Customer | customer@example.com     | customer123 |

## Project Structure

```
restaurant-service-system/
├── backend/              # Python FastAPI backend
│   ├── app/
│   │   ├── models/       # SQLAlchemy models
│   │   ├── schemas/      # Pydantic schemas
│   │   ├── routers/      # API endpoints
│   │   ├── middleware/   # Authentication
│   │   └── utils/        # Helper functions
│   ├── alembic/          # Database migrations
│   └── requirements.txt  # Python dependencies
├── frontend/
│   ├── customer-app/     # Customer-facing application
│   └── admin-panel/      # Admin dashboard
├── kitchen-display/      # Kitchen order display
└── docker-compose.yml    # Docker orchestration
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user

### Reservations
- `GET /api/v1/reservations` - List reservations
- `POST /api/v1/reservations` - Create reservation
- `PATCH /api/v1/reservations/:id` - Update reservation
- `DELETE /api/v1/reservations/:id` - Delete reservation

### Menu Management
- `GET /api/v1/menu` - List menu items
- `POST /api/v1/menu` - Create menu item (admin)
- `PATCH /api/v1/menu/:id` - Update menu item (admin)
- `DELETE /api/v1/menu/:id` - Delete menu item (admin)

### Orders
- `GET /api/v1/orders` - List orders (staff only)
- `POST /api/v1/orders` - Create order (staff only)
- `PATCH /api/v1/orders/:id/status` - Update order status
- `DELETE /api/v1/orders/:id` - Delete order (admin)

### Tables
- `GET /api/v1/tables` - List tables
- `POST /api/v1/tables` - Create table (admin)
- `PATCH /api/v1/tables/:id` - Update table
- `DELETE /api/v1/tables/:id` - Delete table (admin)

### Admin
- `GET /api/v1/admin/stats` - Get dashboard statistics
- `GET /api/v1/admin/users` - List all users

Full API documentation available at `/api/docs` when server is running.

## Database Schema

- **users** - User accounts with role-based access
- **tables** - Restaurant table management
- **reservations** - Customer booking records
- **menu_items** - Restaurant menu with Turkish translations
- **orders** - Order records
- **order_items** - Individual items in orders

## Environment Configuration

### Backend (.env)
```env
PORT=5000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/restaurant_db
JWT_SECRET=your-secret-key
JWT_ALGORITHM=HS256
JWT_EXPIRATION_MINUTES=1440
CORS_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:3002
LOG_LEVEL=INFO
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api/v1
```

## Development

### Database Migrations

```bash
cd backend
alembic revision --autogenerate -m "description"
alembic upgrade head
```

### Running Tests

```bash
# Backend
cd backend
pytest

# Frontend
cd frontend/customer-app
npm test
```

## Docker Commands

```bash
# Start all services
docker-compose up

# Build and start
docker-compose up --build

# Stop services
docker-compose down

# Remove all data
docker-compose down -v
```

## Sample Data

The seed script includes:
- 5 user accounts with different roles
- 8 restaurant tables
- 17 menu items (Turkish restaurant theme)
- Sample reservation

Run `python backend/seed.py` to populate the database.

## Documentation

- **Backend Details**: See `backend/README.md`
- **Quick Start Guide**: See `QUICK-START.md`
- **Project Structure**: See `PROJECT-STRUCTURE.md`

## Features by Role

### Customer
- Browse menu items
- Create and manage reservations
- View reservation history
- Account management

### Server
- Create orders
- Manage table status
- View reservations
- Access menu information

### Kitchen Staff
- View incoming orders in real-time
- Update order preparation status
- Mark orders as ready
- Real-time notifications

### Manager
- All server capabilities
- Manage menu items
- Manage tables
- View reservations

### Admin
- Full system access
- User management
- System statistics
- All CRUD operations

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- CORS configuration
- Rate limiting
- SQL injection protection via ORM

## Performance

- Async/await support in FastAPI
- Database connection pooling
- Optimized queries with SQLAlchemy
- Frontend code splitting with Vite
- Docker multi-stage builds

## License

MIT License - See LICENSE file for details

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Support

For issues and questions:
- Check documentation in `backend/README.md`
- Review `QUICK-START.md` for setup help
- Open an issue on GitHub

---

Built with Python, FastAPI, React, PostgreSQL, and Docker
