# Restaurant Service System - Backend

Python FastAPI backend for the Restaurant Service System.

## Features

- **FastAPI Framework** - Modern, fast Python web framework with async support
- **SQLAlchemy ORM** - Powerful database operations
- **PostgreSQL Database** - Production-ready relational database
- **JWT Authentication** - Secure token-based authentication
- **Socket.IO** - Real-time order updates for kitchen display
- **Role-based Access Control** - Five user roles with different permissions
- **Automatic API Documentation** - Interactive Swagger UI
- **Pydantic Validation** - Request/response data validation
- **Database Migrations** - Alembic for schema management

## Requirements

- Python 3.11 or higher
- PostgreSQL 15+
- pip package manager

## Installation

### Local Development

1. Navigate to backend directory
```bash
cd backend
```

2. Create virtual environment
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

3. Install dependencies
```bash
pip install -r requirements.txt
```

4. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

5. Initialize database
```bash
# Run migrations (if any)
alembic upgrade head

# Seed database with sample data
python seed.py
```

6. Start the server
```bash
python run.py
```

The API will be available at:
- API: http://localhost:7001
- API Docs: http://localhost:7001/api/docs
- Health Check: http://localhost:7001/health

### Docker

From project root:
```bash
docker-compose up --build
```

## Test Accounts

After seeding the database:

| Role     | Email                    | Password    | Access Level              |
|----------|--------------------------|-------------|---------------------------|
| Admin    | admin@restaurant.com     | admin123    | Full system access        |
| Manager  | manager@restaurant.com   | manager123  | Manage menu, tables, users|
| Server   | server@restaurant.com    | server123   | Create orders, manage tables|
| Kitchen  | kitchen@restaurant.com   | kitchen123  | View and update orders    |
| Customer | customer@example.com     | customer123 | Make reservations, view menu|

## Project Structure

```
backend/
├── app/
│   ├── models/           # SQLAlchemy database models
│   │   ├── user.py       # User model with roles
│   │   ├── table.py      # Restaurant tables
│   │   ├── reservation.py# Customer reservations
│   │   ├── menu_item.py  # Menu items
│   │   └── order.py      # Orders and order items
│   │
│   ├── schemas/          # Pydantic validation schemas
│   │   ├── auth.py       # Authentication schemas
│   │   ├── user.py       # User schemas
│   │   ├── reservation.py# Reservation schemas
│   │   ├── menu_item.py  # Menu schemas
│   │   ├── order.py      # Order schemas
│   │   └── table.py      # Table schemas
│   │
│   ├── routers/          # API endpoints
│   │   ├── auth.py       # Authentication endpoints
│   │   ├── reservation.py# Reservation CRUD
│   │   ├── menu.py       # Menu management
│   │   ├── order.py      # Order management
│   │   ├── table.py      # Table management
│   │   └── admin.py      # Admin endpoints
│   │
│   ├── middleware/       # Request middleware
│   │   └── auth.py       # JWT authentication & authorization
│   │
│   ├── utils/            # Utility functions
│   │   ├── auth.py       # JWT & password hashing
│   │   ├── logger.py     # Logging configuration
│   │   └── response.py   # Response formatting
│   │
│   ├── config.py         # Application configuration
│   ├── database.py       # Database connection
│   └── main.py           # FastAPI application & Socket.IO
│
├── alembic/              # Database migrations
│   ├── versions/         # Migration files
│   ├── env.py           # Migration environment
│   └── script.py.mako   # Migration template
│
├── requirements.txt      # Python dependencies
├── run.py               # Application entry point
├── seed.py              # Database seeding script
├── setup.sh             # Setup script (Unix)
├── setup.bat            # Setup script (Windows)
├── Dockerfile           # Docker configuration
└── alembic.ini          # Alembic configuration
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current authenticated user
- `POST /api/v1/auth/logout` - Logout (client-side token removal)

### Reservations
- `GET /api/v1/reservations` - List all reservations
- `POST /api/v1/reservations` - Create new reservation
- `GET /api/v1/reservations/:id` - Get reservation by ID
- `PATCH /api/v1/reservations/:id` - Update reservation
- `DELETE /api/v1/reservations/:id` - Delete reservation (admin/manager)

### Menu
- `GET /api/v1/menu` - List all menu items (with filters)
- `GET /api/v1/menu/:id` - Get menu item by ID
- `POST /api/v1/menu` - Create menu item (admin/manager)
- `PATCH /api/v1/menu/:id` - Update menu item (admin/manager)
- `DELETE /api/v1/menu/:id` - Delete menu item (admin/manager)

### Orders
- `GET /api/v1/orders` - List all orders (staff only)
- `POST /api/v1/orders` - Create new order (admin/server)
- `GET /api/v1/orders/:id` - Get order by ID
- `PATCH /api/v1/orders/:id/status` - Update order status (admin/kitchen)
- `PATCH /api/v1/orders/:id` - Update order (admin/server)
- `DELETE /api/v1/orders/:id` - Delete order (admin)

### Tables
- `GET /api/v1/tables` - List all tables (with status filter)
- `GET /api/v1/tables/:id` - Get table by ID
- `POST /api/v1/tables` - Create table (admin/manager)
- `PATCH /api/v1/tables/:id` - Update table (admin/manager/server)
- `DELETE /api/v1/tables/:id` - Delete table (admin/manager)

### Admin
- `GET /api/v1/admin/stats` - Get dashboard statistics (admin/manager)
- `GET /api/v1/admin/users` - List all users (admin/manager)

### System
- `GET /health` - Health check endpoint
- `GET /` - API information

Full interactive documentation available at `/api/docs`

## Database Models

### User
- Roles: customer, admin, manager, server, kitchen
- JWT authentication
- Password hashing with bcrypt

### Table
- Status: available, occupied, reserved, maintenance
- Capacity and location tracking

### Reservation
- Status: confirmed, completed, cancelled, no_show
- Unique confirmation numbers
- Date/time booking system

### MenuItem
- Categories: soups, appetizers, mains, kebabs, grills, desserts, drinks, specials
- Turkish and English names
- Nutritional information
- Availability tracking

### Order
- Status: pending, preparing, ready, served, cancelled
- Real-time updates via Socket.IO
- Order items with pricing at time of order

## Socket.IO Events

### Client to Server
- `connect` - Establish connection
- `join_kitchen` - Join kitchen room for updates
- `leave_kitchen` - Leave kitchen room
- `update_order_status` - Update order status

### Server to Client
- `connection_established` - Connection confirmed
- `joined_kitchen` - Successfully joined kitchen room
- `new_order` - New order created notification
- `order_updated` - Order status changed
- `order_deleted` - Order deleted notification

## Environment Variables

Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=7001
HOST=0.0.0.0
ENVIRONMENT=development

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:7005/restaurant_db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_ALGORITHM=HS256
JWT_EXPIRATION_MINUTES=1440

# CORS (comma-separated origins)
CORS_ORIGINS=http://localhost:7002,http://localhost:7003,http://localhost:7004

# Logging
LOG_LEVEL=INFO
```

## Database Management

### Migrations

```bash
# Create a new migration
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback one migration
alembic downgrade -1

# Show migration history
alembic history
```

### Seeding

```bash
# Seed database with sample data
python seed.py
```

Includes:
- 5 user accounts (admin, manager, server, kitchen, customer)
- 8 restaurant tables
- 17 menu items (Turkish restaurant menu)
- 1 sample reservation

## Development

### Code Quality

```bash
# Install development dependencies
pip install black flake8 mypy pytest

# Format code
black app/

# Lint code
flake8 app/

# Type checking
mypy app/

# Run tests
pytest
```

### Running in Development Mode

```bash
# With auto-reload
python run.py
```

FastAPI will automatically reload on code changes when `ENVIRONMENT=development`

## Docker

### Build Image

```bash
docker build -t restaurant-backend .
```

### Run Container

```bash
docker run -p 7001:7001 --env-file .env restaurant-backend
```

### Docker Compose

From project root:
```bash
# Start all services
docker-compose up

# Build and start
docker-compose up --build

# Stop services
docker-compose down
```

## Testing

### API Testing

Visit http://localhost:7001/api/docs for interactive Swagger UI

### Manual Testing

```bash
# Health check
curl http://localhost:7001/health

# Login
curl -X POST http://localhost:7001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@restaurant.com","password":"admin123"}'

# Get menu (no auth required)
curl http://localhost:7001/api/v1/menu

# Get authenticated user (requires token)
curl http://localhost:7001/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Dependencies

Main Python packages (see requirements.txt for complete list):

- **fastapi** - Web framework
- **uvicorn** - ASGI server
- **sqlalchemy** - ORM
- **psycopg2-binary** - PostgreSQL driver
- **pydantic** - Data validation
- **python-jose** - JWT handling
- **passlib** - Password hashing
- **python-socketio** - WebSocket support
- **alembic** - Database migrations
- **python-dotenv** - Environment variables
- **colorlog** - Colored logging

## Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env
- Verify database exists: `createdb restaurant_db`

### Port Already in Use
- Change PORT in .env
- Or stop the process using port 7001

### Import Errors
- Activate virtual environment
- Reinstall dependencies: `pip install -r requirements.txt`

### Migration Errors
- Reset database: `alembic downgrade base`
- Reapply migrations: `alembic upgrade head`

## Performance Considerations

- Database connection pooling via SQLAlchemy
- Async/await for non-blocking operations
- Query optimization with eager loading
- Index usage for frequently queried fields
- Rate limiting to prevent abuse

## Security

- JWT token expiration
- Password hashing with bcrypt (cost factor 10)
- CORS configuration
- SQL injection prevention via ORM
- Input validation with Pydantic
- Role-based authorization
- Environment variable configuration

## License

MIT License - See LICENSE file for details

## Support

For issues and questions, refer to the main README.md or open an issue on GitHub.
