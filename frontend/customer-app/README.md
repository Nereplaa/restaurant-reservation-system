# Customer App

React frontend for customers to browse menu and make reservations.

## Quick Start

### With Docker (Recommended)
```bash
cd restaurant-service-system
docker-compose up -d customer-app
```

### Local Development
```bash
cd frontend/customer-app
npm install
npm run dev
```

Open http://localhost:3000

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Check code quality

## Environment Variables

Create `.env` file:

```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000
```

## Features

- Browse menu with categories
- Make reservations
- View and manage bookings
- User authentication
- Responsive design

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Axios
- React Router

## Documentation

See main [README.md](../../README.md) for full documentation.
