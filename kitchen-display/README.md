# Kitchen Display

Real-time order display system for kitchen staff.

## Features

- Real-time order updates via Socket.IO
- Order status tracking (pending, preparing, ready, served)
- Visual order cards with details
- Sound/visual notifications for new orders
- Touch-friendly interface for kitchen environment

## Tech Stack

- React 18 with TypeScript
- Vite for fast development
- Socket.IO Client for real-time updates
- Axios for API calls
- TailwindCSS for styling

## Development

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running on port 5000 with Socket.IO

### Setup

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

Visit http://localhost:3002

### Build for Production

```bash
npm run build
```

Output in `dist/` directory.

## Environment Variables

Create `.env` file:

```env
VITE_API_URL=http://localhost:7001/api/v1
```

## Real-time Events

The application connects to Socket.IO server and listens for:

- `new_order` - New order received
- `order_updated` - Order status changed
- `order_deleted` - Order removed

## Test Account

- Kitchen Staff: kitchen@restaurant.com / kitchen123

## Project Structure

```
src/
├── components/       # Reusable components
│   └── OrderCard.tsx # Order display card
├── services/        # API and Socket services
│   ├── api.ts       # API client
│   └── socket.ts    # Socket.IO client
├── types/           # TypeScript types
└── App.tsx          # Main app component
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Usage

1. Login with kitchen staff credentials
2. View incoming orders in real-time
3. Update order status by clicking status buttons
4. Orders automatically refresh without page reload

## License

MIT
