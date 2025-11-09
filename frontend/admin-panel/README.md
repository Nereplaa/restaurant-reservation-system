# Admin Panel

React frontend for restaurant staff to manage all operations.

## Quick Start

### With Docker (Recommended)
```bash
cd restaurant-service-system
docker-compose up -d admin-panel
```

### Local Development
```bash
cd frontend/admin-panel
npm install
npm run dev
```

Open http://localhost:3001

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Check code quality

## Environment Variables

Create `.env` file:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

## Features

- Dashboard with statistics
- Reservation management
- Table management
- Menu management
- Order management
- Customer management
- Settings

## Login Credentials

**Admin:**
- Email: `admin@restaurant.com`
- Password: `admin123`

**Kitchen Staff:**
- Email: `kitchen@restaurant.com`
- Password: `kitchen123`

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Axios
- React Router

## Documentation

See main [README.md](../../README.md) for full documentation.
