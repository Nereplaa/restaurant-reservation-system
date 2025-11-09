# Kitchen Display System

Real-time order display for kitchen staff with WebSocket updates.

## Quick Start

### With Docker (Recommended)
```bash
cd restaurant-service-system
docker-compose up -d kitchen-display
```

### Local Development
```bash
cd kitchen-display
npm install
npm run dev
```

Open http://localhost:3002

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

- Real-time order updates via WebSocket
- Visual order timer with color-coding
- Audio notifications for new orders
- Touch-friendly interface
- Order status workflow
- Auto-refresh

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Axios
- Socket.io-client

## Documentation

See main [README.md](../README.md) for full documentation.
