# Customer App

React-based customer-facing application for the Restaurant Service System.

## Features

- Browse menu items with filtering
- User registration and authentication
- Create and manage reservations
- View reservation history
- Responsive design with TailwindCSS

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

Visit http://localhost:3000

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

## Project Structure

```
src/
├── components/       # Reusable components
├── contexts/        # React contexts (Auth)
├── pages/           # Page components
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
