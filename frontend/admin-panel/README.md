# Admin Panel

React-based administrative dashboard for the Restaurant Service System.

## Features

- Dashboard with real-time statistics
- User management
- Menu item CRUD operations
- Order management and tracking
- Table management
- Reservation oversight
- Role-based access control

## Tech Stack

- React 18 with TypeScript
- Vite for fast development
- React Router for navigation
- Axios for API calls
- TailwindCSS for styling

## Development

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running on port 5000

### Setup

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

Visit http://localhost:3001

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

## Test Accounts

- Admin: admin@restaurant.com / admin123
- Manager: manager@restaurant.com / manager123

## Project Structure

```
src/
├── components/       # Reusable components
│   ├── Sidebar.tsx  # Navigation sidebar
│   └── ProtectedRoute.tsx
├── contexts/        # React contexts (Auth)
├── pages/           # Page components
│   ├── DashboardPage.tsx
│   ├── OrdersPage.tsx
│   ├── MenuPage.tsx
│   ├── TablesPage.tsx
│   └── ...
├── services/        # API service layer
├── types/           # TypeScript types
└── App.tsx          # Main app component
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## License

MIT
