# 🚀 Restaurant Reservation System - Complete Setup Guide

## Welcome Team! 👋

This guide will help all 4 team members get the project running on their local machines.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Backend Setup](#backend-setup)
4. [Frontend Setup](#frontend-setup)
5. [Running the Project](#running-the-project)
6. [Verification](#verification)
7. [Next Steps](#next-steps)
8. [Common Issues](#common-issues)

---

## Prerequisites

Before starting, install these on your computer:

### Required Software

1. **Node.js (v18 or higher)**
   - Download: https://nodejs.org/
   - Verify: `node --version` (should show v18+)

2. **PostgreSQL (v14 or higher)**
   - Download: https://www.postgresql.org/download/
   - Or use a cloud database (see below)
   - Verify: `psql --version`

3. **Git**
   - Download: https://git-scm.com/
   - Verify: `git --version`

4. **Code Editor**
   - Recommended: VS Code (https://code.visualstudio.com/)

### Optional but Recommended

- **Postman** - For testing API endpoints (https://www.postman.com/)
- **pgAdmin** - PostgreSQL GUI (comes with PostgreSQL installer)

---

## Initial Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd restaurant-reservation-system
```

### 2. Create a New Branch

```bash
git checkout -b setup/<your-name>
```

Example: `git checkout -b setup/john`

---

## Backend Setup

### Step 1: Navigate to Backend

```bash
cd backend
```

### Step 2: Install Dependencies

```bash
npm install
```

This will take 2-3 minutes. Wait for it to complete.

### Step 3: Set Up Database

#### Option A: Local PostgreSQL (Recommended for Development)

1. Open PostgreSQL:
   - Windows: Use pgAdmin or command prompt
   - Mac: Use Terminal
   - Linux: Use Terminal

2. Create database:
```sql
CREATE DATABASE restaurant_db;
```

3. Note your connection details:
   - Host: `localhost`
   - Port: `5432` (default)
   - Username: `postgres` (or your username)
   - Password: (your postgres password)

#### Option B: Cloud Database (Easier, No Local Install)

Use one of these free services:
- **Supabase**: https://supabase.com/ (Recommended)
- **Neon**: https://neon.tech/
- **Railway**: https://railway.app/

After creating database, copy the connection URL.

### Step 4: Configure Environment Variables

1. Copy the example file:
```bash
cp env-example.txt .env
```

2. Open `.env` in your code editor

3. Fill in these values:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database (UPDATE THIS!)
DATABASE_URL="postgresql://username:password@localhost:5432/restaurant_db?schema=public"
# Replace: username, password, localhost, restaurant_db with your values

# JWT Secret (CHANGE THIS!)
JWT_SECRET="your-super-secret-key-change-this-to-random-string"
# Generate a random string, at least 32 characters

# OpenAI API (Optional for now, get later)
OPENAI_API_KEY="sk-your-key-here"
OPENAI_MODEL="gpt-4"

# Email Service (Optional, skip for now)
EMAIL_SERVICE="sendgrid"
EMAIL_API_KEY=""
EMAIL_FROM="noreply@restaurant.com"

# CORS Origins
CORS_ORIGINS="http://localhost:3000,http://localhost:3001,http://localhost:3002"
```

**Important Notes:**
- ✅ Database URL is REQUIRED
- ✅ JWT Secret is REQUIRED (change to random string)
- ⏭️ OpenAI API can be added later (costs money)
- ⏭️ Email service can be skipped for development

### Step 5: Set Up Prisma

1. Generate Prisma Client:
```bash
npm run db:generate
```

2. Run database migrations:
```bash
npm run db:migrate
```

This will create all tables.

3. (Optional) Seed sample data:
```bash
npm run db:seed
```

### Step 6: Test Backend

```bash
npm run dev
```

You should see:
```
🚀 Server running on port 5000
📊 Environment: development
🔗 Health check: http://localhost:5000/health
```

Test it: Open browser and go to `http://localhost:5000/health`

You should see:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "..."
}
```

✅ **If you see this, backend is working!**

Press `Ctrl+C` to stop the server.

---

## Frontend Setup

You'll set up 3 frontend applications.

### Customer App Setup

```bash
# From project root
cd frontend/customer-app

# Install dependencies
npm install

# Create .env file
cp env-example.txt .env

# Edit .env (should already be correct)
# VITE_API_URL=http://localhost:5000/api/v1

# Start dev server
npm run dev
```

Should open automatically at `http://localhost:3000`

You should see the Customer App placeholder page.

✅ **If you see this, customer app is working!**

### Admin Panel Setup

Open a **new terminal** (keep customer app running):

```bash
# From project root
cd frontend/admin-panel

# Install dependencies
npm install

# Start dev server
npm run dev
```

Should open at `http://localhost:3001`

✅ **If you see Admin Panel placeholder, it's working!**

### Kitchen Display Setup

Open **another new terminal**:

```bash
# From project root
cd kitchen-display

# Install dependencies
npm install

# Start dev server
npm run dev
```

Should open at `http://localhost:3002`

✅ **If you see Kitchen Display placeholder, it's working!**

---

## Running the Project

You need **4 terminals** running simultaneously:

### Terminal 1: Backend
```bash
cd backend
npm run dev
```
Runs on: `http://localhost:5000`

### Terminal 2: Customer App
```bash
cd frontend/customer-app
npm run dev
```
Runs on: `http://localhost:3000`

### Terminal 3: Admin Panel
```bash
cd frontend/admin-panel
npm run dev
```
Runs on: `http://localhost:3001`

### Terminal 4: Kitchen Display
```bash
cd kitchen-display
npm run dev
```
Runs on: `http://localhost:3002`

---

## Verification

Check all 4 URLs are working:

- [ ] `http://localhost:5000/health` - Backend health check
- [ ] `http://localhost:3000` - Customer App
- [ ] `http://localhost:3001` - Admin Panel
- [ ] `http://localhost:3002` - Kitchen Display

✅ **All working? Congratulations! Setup complete!**

---

## Next Steps

### For All Team Members

1. **Read documentation in `docs/` folder**
   - `requirements.md` - What we're building
   - `architecture.md` - How it's structured
   - `api-specifications.md` - API endpoints
   - `sdlc-process.md` - How we'll work
   - `team-coordination.md` - Git workflow

2. **Join team communication channel** (Discord/Slack)

3. **Attend first sprint planning meeting**

### For Student A (Customer Frontend + AI)

Your code is in: `frontend/customer-app/`

**First tasks:**
1. Create `HomePage.tsx`
2. Create `LoginPage.tsx`
3. Create `RegisterPage.tsx`
4. Set up React Router

**Resources:**
- `frontend/customer-app/README.md`
- React docs: https://react.dev/

### For Student B (Admin Panel)

Your code is in: `frontend/admin-panel/`

**First tasks:**
1. Create `LoginPage.tsx`
2. Create `DashboardPage.tsx`
3. Create `Sidebar.tsx` component
4. Set up React Router

**Resources:**
- `frontend/admin-panel/README.md`
- Recharts docs: https://recharts.org/

### For Student C (Backend Developer)

Your code is in: `backend/`

**First tasks:**
1. Implement `authController.ts` (register, login)
2. Create `authService.ts`
3. Test with Postman
4. Write API tests

**Resources:**
- `backend/README.md`
- Express docs: https://expressjs.com/
- Prisma docs: https://www.prisma.io/docs

### For Student D (Kitchen Display + Real-time)

Your code is in: `kitchen-display/`

**First tasks:**
1. Set up WebSocket connection
2. Create `OrderCard.tsx` component
3. Create `OrderQueue.tsx` component
4. Test real-time updates

**Resources:**
- `kitchen-display/README.md`
- Socket.io docs: https://socket.io/docs/v4/

---

## Common Issues

### Issue: "npm install" fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Try again
npm install
```

### Issue: "Cannot connect to database"

**Solutions:**
1. Check PostgreSQL is running
2. Verify DATABASE_URL in `.env` is correct
3. Check username/password
4. Try connecting with pgAdmin first

### Issue: "Port already in use"

**Solution:**
```bash
# Find process using port (example: 5000)
# Windows
netstat -ano | findstr :5000

# Mac/Linux
lsof -i :5000

# Kill the process or use different port
```

### Issue: "Prisma Client not found"

**Solution:**
```bash
cd backend
npm run db:generate
```

### Issue: Frontend can't connect to backend

**Solution:**
1. Check backend is running (`http://localhost:5000/health`)
2. Check `.env` file has correct API URL
3. Check CORS settings in backend

### Issue: Git conflicts

**Solution:**
```bash
# Update your branch
git checkout develop
git pull origin develop
git checkout your-branch
git merge develop

# Resolve conflicts in code editor
# Then commit
git add .
git commit -m "merge: resolve conflicts"
```

---

## Getting Help

### Team Resources
1. **Check documentation** in `docs/` folder first
2. **Ask in team Discord/Slack** channel
3. **Create GitHub issue** for bugs
4. **Pair program** with teammate

### External Resources
- **Stack Overflow** - For specific error messages
- **Official documentation** - For each technology
- **GitHub Discussions** - Ask questions

---

## Pro Tips

### 1. Use Git Properly
```bash
# Always work on feature branches
git checkout -b feature/my-feature

# Commit often with good messages
git commit -m "feat(customer): add login form"

# Push regularly
git push origin feature/my-feature
```

### 2. Code Editor Extensions (VS Code)

Install these:
- ESLint
- Prettier
- Prisma (for Student C)
- Tailwind CSS IntelliSense
- GitLens

### 3. Keep Dependencies Updated

```bash
# Check for outdated packages
npm outdated

# Update carefully (discuss with team first!)
npm update
```

### 4. Database Management

```bash
# View database in GUI
cd backend
npm run db:studio
```

Opens Prisma Studio at `http://localhost:5555`

### 5. Debugging

**Backend:**
- Check terminal for error messages
- Look at `logs/` folder
- Use `console.log` temporarily (remove before commit!)

**Frontend:**
- Open browser DevTools (F12)
- Check Console tab for errors
- Check Network tab for API calls

---

## Project Structure Overview

```
restaurant-reservation-system/
│
├── docs/                       # 📚 All documentation
│   ├── requirements.md
│   ├── architecture.md
│   ├── api-specifications.md
│   ├── database-schema.md
│   ├── sdlc-process.md
│   └── team-coordination.md
│
├── backend/                    # ⚙️ Node.js + Express API
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── middleware/
│   │   └── server.ts
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json
│
├── frontend/                   # 🎨 React Applications
│   ├── customer-app/          # Customer interface
│   ├── admin-panel/           # Admin dashboard
│   └── (shared code later)
│
├── kitchen-display/            # 📺 KDS for kitchen
│
├── README.md                   # Main project README
├── SETUP-GUIDE.md             # This file!
└── gitignore.txt              # Git ignore patterns
```

---

## Quick Command Reference

### Backend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm test             # Run tests
npm run db:migrate   # Run database migrations
npm run db:studio    # Open database GUI
```

### Frontend (all 3 apps)
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Check code style
```

---

## Success Checklist

Week 1 goals:

- [ ] All 4 team members have project running locally
- [ ] Everyone has created their feature branch
- [ ] Completed first sprint planning
- [ ] Each member has committed at least one file
- [ ] All members understand Git workflow
- [ ] Documentation has been read
- [ ] Communication channels set up

---

## Need More Help?

**For setup issues:**
1. Read error message carefully
2. Google the error
3. Check Stack Overflow
4. Ask in team chat

**For project questions:**
1. Check `docs/` folder
2. Ask in team chat
3. Schedule pair programming
4. Ask professor (last resort)

---

**🎉 You're all set! Happy coding!**

Remember: Communication is key. When in doubt, ask your team!

---

**Document Version**: 1.0  
**Last Updated**: October 30, 2025  
**Team**: [Your Team Name]

