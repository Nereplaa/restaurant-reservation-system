# ⚡ Quick Start Guide

**For experienced developers who want to get started immediately.**

## Prerequisites
- Node.js v18+
- PostgreSQL v14+
- Git

## Setup (5 minutes)

### 1. Clone & Install
```bash
git clone <repo-url>
cd restaurant-reservation-system

# Backend
cd backend
npm install
cp env-example.txt .env
# Edit .env with your DATABASE_URL and JWT_SECRET

# Customer App
cd ../frontend/customer-app
npm install

# Admin Panel
cd ../admin-panel
npm install

# Kitchen Display
cd ../../kitchen-display
npm install
```

### 2. Database Setup
```bash
cd backend
npm run db:generate
npm run db:migrate
npm run db:seed  # Optional: sample data
```

### 3. Run Everything (4 terminals)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# http://localhost:5000
```

**Terminal 2 - Customer App:**
```bash
cd frontend/customer-app
npm run dev
# http://localhost:3000
```

**Terminal 3 - Admin Panel:**
```bash
cd frontend/admin-panel
npm run dev
# http://localhost:3001
```

**Terminal 4 - Kitchen Display:**
```bash
cd kitchen-display
npm run dev
# http://localhost:3002
```

## Verify
- Backend: `http://localhost:5000/health`
- Customer: `http://localhost:3000`
- Admin: `http://localhost:3001`
- Kitchen: `http://localhost:3002`

## Team Assignments

| Student | Directory | Port | Responsibilities |
|---------|-----------|------|------------------|
| A | `frontend/customer-app/` | 3000 | Customer UI + AI chatbot |
| B | `frontend/admin-panel/` | 3001 | Admin dashboard |
| C | `backend/` | 5000 | API + Database |
| D | `kitchen-display/` | 3002 | KDS + WebSockets |

## Essential Commands

```bash
# Backend
npm run dev          # Start server
npm run db:studio    # Database GUI
npm run db:migrate   # Run migrations

# Frontend
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # Code quality check
```

## Git Workflow

```bash
git checkout -b feature/my-feature
# ... make changes ...
git add .
git commit -m "feat(scope): description"
git push origin feature/my-feature
# Create PR on GitHub
```

## Documentation

- **Full Setup**: `SETUP-GUIDE.md`
- **Requirements**: `docs/requirements.md`
- **API Specs**: `docs/api-specifications.md`
- **Architecture**: `docs/architecture.md`
- **Team Guide**: `docs/team-coordination.md`
- **SDLC Process**: `docs/sdlc-process.md`

## Environment Variables

**Backend `.env` (REQUIRED):**
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/restaurant_db"
JWT_SECRET="random-secret-key-at-least-32-chars"
PORT=5000
NODE_ENV=development
```

**Frontend `.env` (Optional, defaults work):**
```env
VITE_API_URL=http://localhost:5000/api/v1
```

## Tech Stack

- **Backend**: Node.js + Express + TypeScript + Prisma + PostgreSQL
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Real-time**: Socket.io
- **Auth**: JWT
- **AI**: OpenAI API (add later)

## Common Issues

**Port already in use?**
```bash
# Change PORT in .env
```

**Database connection error?**
```bash
# Check DATABASE_URL in .env
# Ensure PostgreSQL is running
```

**Prisma errors?**
```bash
npm run db:generate
```

## Next Steps

1. Read `docs/requirements.md` - Understand what we're building
2. Read `docs/team-coordination.md` - Learn Git workflow
3. Check your assigned directory README
4. Start implementing your first feature!

## Support

- Team Discord/Slack
- GitHub Issues
- Pair programming sessions

---

**Ready to code? Let's build something amazing! 🚀**

