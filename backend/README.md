# Backend API

Node.js + Express + TypeScript backend for Restaurant Management System.

## Quick Start

### With Docker (Recommended)
```bash
cd restaurant-service-system
docker-compose up -d backend
```

### Local Development
```bash
cd backend
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:generate` - Generate Prisma Client
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio GUI
- `npm test` - Run tests

## Environment Variables

Create `.env` file:

```env
NODE_ENV=development
PORT=5000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/restaurant_db?schema=public"
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"
JWT_EXPIRES_IN="24h"
CORS_ORIGINS="http://localhost:3000,http://localhost:3001,http://localhost:3002"
```

## Tech Stack

- Node.js 18+
- Express
- TypeScript
- PostgreSQL
- Prisma ORM
- Socket.io
- JWT

## Documentation

See main [README.md](../README.md) for full documentation.
