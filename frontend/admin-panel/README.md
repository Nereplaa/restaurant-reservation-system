# Admin Panel - Restaurant Management System

Admin dashboard for restaurant owners/managers to oversee all operations, manage reservations, tables, menu, and view analytics.

## 🎯 Overview

This admin panel allows restaurant staff to:
- View dashboard with statistics
- Manage all reservations
- Manage customer database
- Configure restaurant tables
- Manage menu items
- View and manage orders
- Access system settings
- View reports and analytics

## 🛠️ Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Axios** - HTTP client

## 📁 Project Structure

```
admin-panel/
├── src/
│   ├── components/          # Reusable components
│   │   ├── Sidebar.tsx
│   │   ├── StatsCard.tsx
│   │   ├── ReservationTable.tsx
│   │   ├── TableLayout.tsx
│   │   └── Chart.tsx
│   │
│   ├── pages/              # Page components
│   │   ├── LoginPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── ReservationsPage.tsx
│   │   ├── CustomersPage.tsx
│   │   ├── TablesPage.tsx
│   │   ├── MenuPage.tsx
│   │   ├── OrdersPage.tsx
│   │   └── SettingsPage.tsx
│   │
│   ├── services/           # API services
│   │   ├── api.ts
│   │   ├── adminService.ts
│   │   ├── reservationService.ts
│   │   └── menuService.ts
│   │
│   ├── context/            # React Context
│   │   └── AuthContext.tsx
│   │
│   ├── types/              # TypeScript types
│   │   └── index.ts
│   │
│   ├── utils/              # Utility functions
│   │   └── formatters.ts
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── public/
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## 🚀 Getting Started

### Installation

```bash
cd frontend/admin-panel
npm install
```

### Environment Variables

Create `.env` file:
```
VITE_API_URL=http://localhost:5000/api/v1
```

### Start Development Server

```bash
npm run dev
```

App runs on `http://localhost:3001`

## 📝 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 🎨 Pages

### Login Page (`/admin/login`)
- Admin authentication
- Email/password
- Remember me option

### Dashboard Page (`/admin/dashboard`)
- Today's reservations count
- Weekly statistics
- Revenue charts
- Popular menu items
- Upcoming reservations list
- Quick actions

### Reservations Page (`/admin/reservations`)
- All reservations table
- Filter by date, status
- Search by customer name/phone
- Calendar view
- Assign tables
- Update status
- Create manual reservations

### Customers Page (`/admin/customers`)
- Customer database
- Search and filter
- Customer profiles
- Reservation history
- VIP tagging
- Export customer data

### Tables Page (`/admin/tables`)
- Visual table layout
- Add/edit/delete tables
- Table status management
- Capacity configuration
- Location assignment

### Menu Page (`/admin/menu`)
- All menu items by category
- Add new items
- Edit items
- Upload images
- Set availability
- Dietary tags

### Orders Page (`/admin/orders`)
- Active orders list
- Order history
- Create new orders
- Link to tables/reservations
- Order status tracking

### Settings Page (`/admin/settings`)
- Restaurant information
- Business hours
- Reservation settings
- Email templates
- User management
- System configuration

## 📊 Dashboard Charts

Using Recharts for data visualization:

```tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

function ReservationChart({ data }) {
  return (
    <LineChart width={600} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="reservations" stroke="#3B82F6" />
    </LineChart>
  );
}
```

## 🔐 Authentication

Admin routes require authentication and proper role:

```typescript
// Protected route component
function AdminRoute({ children }) {
  const { user } = useAuth();
  
  if (!user || (user.role !== 'admin' && user.role !== 'manager')) {
    return <Navigate to="/admin/login" />;
  }
  
  return children;
}
```

## 📡 API Integration

All API calls use the admin service:

```typescript
// src/services/adminService.ts
import api from './api';

export async function getDashboardStats() {
  const response = await api.get('/admin/dashboard/stats');
  return response.data;
}

export async function getAllReservations(params) {
  const response = await api.get('/admin/reservations', { params });
  return response.data;
}
```

## 🎨 Layout

Admin panel uses a sidebar layout:

```tsx
<div className="flex h-screen">
  <Sidebar />
  <main className="flex-1 overflow-auto p-6">
    {/* Page content */}
  </main>
</div>
```

## 🧪 Testing Checklist

- [ ] Admin can login
- [ ] Dashboard loads statistics
- [ ] Can view all reservations
- [ ] Can filter/search reservations
- [ ] Can assign tables
- [ ] Can update reservation status
- [ ] Can add/edit menu items
- [ ] Can manage tables
- [ ] Can view customer database
- [ ] Charts render correctly
- [ ] All forms validate

## 📦 Build

```bash
npm run build
```

## 🚀 Deployment

Deploy to Vercel:
```bash
vercel
```

## 👥 Team Responsibility

**Student B (Admin Panel)** is responsible for:
- All code in this directory
- Admin UI/UX design
- Dashboard with analytics
- Table management features
- Menu management features
- Customer database interface
- Settings page
- Data visualization
- Admin authentication

## 📖 Resources

- [React Documentation](https://react.dev/)
- [Recharts Documentation](https://recharts.org/)
- [Tailwind CSS](https://tailwindcss.com/)

---

**For questions, check team Discord**

