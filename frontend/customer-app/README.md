# Customer App - Restaurant Reservation System

Customer-facing web application for making reservations, browsing menu, and interacting with AI chatbot.

## 🎯 Overview

This is the customer interface where users can:
- Register and login
- Browse restaurant menu
- Make reservations via AI chatbot or form
- View and manage their reservations
- Update profile

## 🛠️ Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Socket.io Client** - Real-time features (optional)

## 📁 Project Structure

```
customer-app/
├── src/
│   ├── components/          # Reusable components
│   │   ├── Navbar.tsx
│   │   ├── BookingForm.tsx
│   │   ├── ChatBot.tsx
│   │   ├── ReservationCard.tsx
│   │   └── MenuItemCard.tsx
│   │
│   ├── pages/              # Page components
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── BookingPage.tsx
│   │   ├── MyReservationsPage.tsx
│   │   ├── MenuPage.tsx
│   │   └── ProfilePage.tsx
│   │
│   ├── services/           # API services
│   │   ├── api.ts          # Axios instance
│   │   ├── authService.ts
│   │   ├── reservationService.ts
│   │   ├── menuService.ts
│   │   └── aiChatService.ts
│   │
│   ├── context/            # React Context
│   │   └── AuthContext.tsx
│   │
│   ├── hooks/              # Custom hooks
│   │   └── useAuth.ts
│   │
│   ├── types/              # TypeScript types
│   │   └── index.ts
│   │
│   ├── utils/              # Utility functions
│   │   └── validators.ts
│   │
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
│
├── public/                 # Static assets
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm or yarn
- Backend API running on `http://localhost:5000`

### Installation

1. **Install dependencies**
```bash
cd frontend/customer-app
npm install
```

2. **Set up environment variables**
```bash
# Create .env file
cp env-example.txt .env

# Edit .env
VITE_API_URL=http://localhost:5000/api/v1
```

3. **Start development server**
```bash
npm run dev
```

App will run on `http://localhost:3000`

## 📝 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint errors |

## 🎨 Pages

### Home Page (`/`)
- Hero section with restaurant intro
- Quick booking button
- Featured menu items
- Testimonials

### Login Page (`/login`)
- Email/password login
- Link to register
- "Forgot password" (optional)

### Register Page (`/register`)
- Registration form
- Email, password, name, phone
- Redirects to home after success

### Booking Page (`/book`)
- Two options:
  1. AI Chatbot - Natural conversation booking
  2. Manual Form - Traditional form
- Date/time picker
- Party size selector
- Special requests text area

### My Reservations Page (`/reservations`)
- List of upcoming reservations
- Past reservations
- Option to modify/cancel
- Reservation details

### Menu Page (`/menu`)
- Browse menu items by category
- Search functionality
- Filter by dietary preferences
- Item details (description, price, dietary tags)

### Profile Page (`/profile`)
- View/edit user information
- Change password
- Account settings

## 🔐 Authentication

### Login Flow
```typescript
1. User enters email/password
2. POST /api/v1/auth/login
3. Store JWT token in localStorage
4. Set user in AuthContext
5. Redirect to home page
```

### Protected Routes
- `/book` - Requires authentication
- `/reservations` - Requires authentication
- `/profile` - Requires authentication

Use `ProtectedRoute` component to wrap protected pages.

## 📡 API Integration

### API Service (`src/services/api.ts`)
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Add auth token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### Example Service (`src/services/reservationService.ts`)
```typescript
import api from './api';

export async function createReservation(data) {
  const response = await api.post('/reservations', data);
  return response.data;
}

export async function getMyReservations() {
  const response = await api.get('/reservations');
  return response.data;
}
```

## 🎨 Styling with Tailwind CSS

### Tailwind Configuration (`tailwind.config.js`)
```javascript
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#10B981',
      },
    },
  },
  plugins: [],
};
```

### Example Component
```tsx
export function Button({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-primary text-white px-6 py-2 rounded-lg 
                 hover:bg-blue-600 transition-colors"
    >
      {children}
    </button>
  );
}
```

## 🤖 AI Chatbot Integration

### ChatBot Component
```tsx
const [messages, setMessages] = useState([]);
const [input, setInput] = useState('');

const sendMessage = async () => {
  const response = await aiChatService.sendMessage(input);
  setMessages([...messages, 
    { role: 'user', content: input },
    { role: 'assistant', content: response.aiResponse }
  ]);
};
```

## 📱 Responsive Design

All pages are responsive and work on:
- Desktop (1920px+)
- Laptop (1024px+)
- Tablet (768px+)
- Mobile (375px+)

Use Tailwind's responsive prefixes:
```tsx
className="text-sm md:text-base lg:text-lg"
```

## 🧪 Testing

### Manual Testing Checklist
- [ ] User can register
- [ ] User can login
- [ ] User can view menu
- [ ] User can make reservation (form)
- [ ] User can make reservation (AI)
- [ ] User can view reservations
- [ ] User can modify reservation
- [ ] User can cancel reservation
- [ ] All forms validate input
- [ ] Error messages display correctly

## 📦 Build for Production

```bash
npm run build
```

Output will be in `dist/` folder.

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

## 👥 Team Responsibilities

**Student A (Customer Frontend + AI)** is responsible for:
- All code in this directory
- UI/UX for customer-facing pages
- AI chatbot integration
- Form validation
- API integration with backend
- Responsive design
- User authentication flow

## 🤝 Contributing

1. Create feature branch: `feature/customer-booking-form`
2. Make changes
3. Test thoroughly
4. Commit: `feat(customer): add booking form validation`
5. Push and create PR
6. Get approval
7. Merge to `develop`

## 📖 Resources

- [React Documentation](https://react.dev/)
- [React Router Documentation](https://reactrouter.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev/)
- [Axios Documentation](https://axios-http.com/docs/intro)

---

**For questions, check team Discord or create GitHub issue.**

