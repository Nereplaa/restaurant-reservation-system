# Kitchen Display System (KDS)

Real-time order display system for kitchen staff to view and manage incoming orders.

## 🎯 Overview

The KDS shows:
- Incoming orders in real-time
- Order details (items, quantities, special notes)
- Table/reservation information
- Order status (pending, preparing, ready)
- Order age/timer
- Audio alerts for new orders

## 🛠️ Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Socket.io Client** - Real-time updates

## 📁 Project Structure

```
kitchen-display/
├── src/
│   ├── components/
│   │   ├── OrderCard.tsx       # Individual order display
│   │   ├── OrderQueue.tsx      # List of orders
│   │   └── StatusButton.tsx    # Update status button
│   │
│   ├── pages/
│   │   └── KitchenDashboard.tsx
│   │
│   ├── services/
│   │   └── socketService.ts    # WebSocket connection
│   │
│   ├── types/
│   │   └── index.ts
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── index.html
├── package.json
├── vite.config.ts
└── README.md
```

## 🚀 Getting Started

### Installation

```bash
cd kitchen-display
npm install
```

### Environment Variables

Create `.env`:
```
VITE_WS_URL=ws://localhost:5000
```

### Start Development

```bash
npm run dev
```

Runs on `http://localhost:3002`

## 📡 WebSocket Connection

```typescript
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_WS_URL);

// Authenticate
socket.emit('authenticate', { token: 'jwt-token' });

// Join kitchen room
socket.emit('join_kitchen');

// Listen for new orders
socket.on('new_order', (order) => {
  // Display order
  playNotificationSound();
});

// Listen for order updates
socket.on('order_updated', (order) => {
  // Update order status
});
```

## 🎨 Features

### Order Card Component
- Large, readable text
- Color-coded by priority/age
- Touch-friendly buttons
- Special instructions highlighted

### Order Status Flow
```
PENDING (red) → PREPARING (yellow) → READY (green)
```

### Audio Notifications
Play sound when new order arrives:
```typescript
const audio = new Audio('/notification.mp3');
audio.play();
```

### Order Timer
Show how long ago order was placed:
```typescript
function OrderTimer({ orderTime }) {
  const [elapsed, setElapsed] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      const diff = Date.now() - new Date(orderTime).getTime();
      setElapsed(Math.floor(diff / 1000 / 60)); // minutes
    }, 1000);
    
    return () => clearInterval(interval);
  }, [orderTime]);
  
  return <span>{elapsed} min ago</span>;
}
```

## 🖥️ Display Configuration

### Fullscreen Mode
Press F11 or use button to enter fullscreen

### Multiple Displays
- Can run multiple instances
- Filter by station (grill, salad, dessert)
- Each display connects to same backend

### Touch Interface
- Large buttons (min 48x48px)
- High contrast colors
- Simple, clear UI

## 📦 Build

```bash
npm run build
```

## 🚀 Deployment

Deploy to Netlify or Vercel

## 👥 Team Responsibility

**Student D (Kitchen Display + Real-time)** is responsible for:
- All code in this directory
- KDS UI optimized for large displays
- WebSocket client integration
- Real-time order updates
- Order status management
- Audio notifications
- Touch-friendly interface
- Multiple display support

## 📖 Resources

- [Socket.io Client](https://socket.io/docs/v4/client-api/)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [Fullscreen API](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API)

---

**For questions, check team Discord**

