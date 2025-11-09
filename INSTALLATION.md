# 📦 Complete Installation Guide

Step-by-step guide to install and run the Restaurant Management System.

---

## Prerequisites Installation

### 1. Install Docker Desktop (Recommended)

**Windows & Mac:**
1. Download Docker Desktop from https://www.docker.com/products/docker-desktop/
2. Run the installer
3. Start Docker Desktop
4. Verify installation:
   ```bash
   docker --version
   docker-compose --version
   ```

**Linux:**
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify
docker --version
docker-compose --version
```

---

## Quick Start with Docker

### Step 1: Clone or Download Project

```bash
# If using Git
git clone <repository-url>
cd restaurant-service-system

# Or download and extract ZIP file
```

### Step 2: Start All Services

```bash
# Make sure Docker Desktop is running first!

# Start everything
docker-compose up -d

# Wait 1-2 minutes for initialization
# Watch progress with:
docker-compose logs -f
```

### Step 3: Verify Services

Check if all services are running:
```bash
docker-compose ps
```

You should see all services with "Up" status.

### Step 4: Access Applications

Open your browser and visit:
- Customer App: http://localhost:3000
- Admin Panel: http://localhost:3001 (Login: admin@restaurant.com / admin123)
- Kitchen Display: http://localhost:3002
- Backend API: http://localhost:5000/health

**You're done! 🎉**

---

## Alternative: Local Development Setup

If you prefer running without Docker (for development):

### 1. Install Node.js

**Download Node.js 18 or higher:**
- Windows/Mac: https://nodejs.org/
- Linux:
  ```bash
  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
  sudo apt-get install -y nodejs
  ```

**Verify:**
```bash
node --version  # Should show v18.x.x or higher
npm --version   # Should show 9.x.x or higher
```

### 2. Install PostgreSQL

**Windows:**
1. Download from https://www.postgresql.org/download/windows/
2. Run installer (remember the password you set!)
3. Default port is 5432

**Mac:**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Linux:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Create Database:**
```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE restaurant_db;

# Exit
\q
```

### 3. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp env-example.txt .env

# Edit .env file with your database credentials
# Use any text editor (notepad, nano, vim, vscode)
nano .env

# Important: Update these values:
# DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/restaurant_db"
# JWT_SECRET="create-a-long-random-string-at-least-32-characters-long"

# Generate Prisma Client
npm run db:generate

# Run database migrations (creates tables)
npm run db:migrate

# Seed database with sample data
npm run db:seed

# Start backend server
npm run dev
```

Backend should now be running on http://localhost:5000

### 4. Setup Customer App

**Open new terminal:**
```bash
cd frontend/customer-app

# Install dependencies
npm install

# Create .env file (optional, defaults work)
echo "VITE_API_URL=http://localhost:5000/api/v1" > .env
echo "VITE_SOCKET_URL=http://localhost:5000" >> .env

# Start development server
npm run dev
```

Customer app should now be running on http://localhost:3000

### 5. Setup Admin Panel

**Open new terminal:**
```bash
cd frontend/admin-panel

# Install dependencies
npm install

# Create .env file (optional)
echo "VITE_API_URL=http://localhost:5000/api/v1" > .env

# Start development server
npm run dev
```

Admin panel should now be running on http://localhost:3001

### 6. Setup Kitchen Display

**Open new terminal:**
```bash
cd kitchen-display

# Install dependencies
npm install

# Create .env file (optional)
echo "VITE_API_URL=http://localhost:5000/api/v1" > .env
echo "VITE_SOCKET_URL=http://localhost:5000" >> .env

# Start development server
npm run dev
```

Kitchen display should now be running on http://localhost:3002

---

## Dependency List

### Backend Dependencies

**Production:**
```json
{
  "@prisma/client": "^5.7.0",
  "bcrypt": "^5.1.1",
  "bcryptjs": "^2.4.3",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1",
  "express": "^4.18.2",
  "express-rate-limit": "^7.1.5",
  "express-validator": "^7.0.1",
  "joi": "^17.11.0",
  "jsonwebtoken": "^9.0.2",
  "socket.io": "^4.6.0",
  "uuid": "^9.0.1",
  "winston": "^3.11.0"
}
```

**Development:**
```json
{
  "prisma": "^5.7.0",
  "typescript": "^5.3.3",
  "ts-node": "^10.9.2",
  "nodemon": "^3.0.2",
  "@types/node": "^20.10.6",
  "@types/express": "^4.17.21",
  "@types/bcrypt": "^5.0.2",
  "@types/jsonwebtoken": "^9.0.5",
  "@types/cors": "^2.8.17"
}
```

### Frontend Dependencies (All Apps)

**Production:**
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.21.0",
  "axios": "^1.6.2",
  "socket.io-client": "^4.6.0"
}
```

**Development:**
```json
{
  "typescript": "^5.3.3",
  "vite": "^5.0.10",
  "@vitejs/plugin-react": "^4.2.1",
  "tailwindcss": "^3.4.0",
  "autoprefixer": "^10.4.16",
  "postcss": "^8.4.33",
  "@types/react": "^18.2.47",
  "@types/react-dom": "^18.2.18"
}
```

---

## Post-Installation

### Verify Installation

**Check Backend:**
```bash
curl http://localhost:5000/health
# Should return: {"success":true,"message":"Server is running"}
```

**Check Database:**
```bash
cd backend
npm run db:studio
# Opens Prisma Studio at http://localhost:5555
```

**Test Login:**
1. Go to http://localhost:3001
2. Login with: admin@restaurant.com / admin123
3. Should see admin dashboard

---

## Troubleshooting Installation

### NPM Install Fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Install again
npm install
```

### Database Connection Error

**Check PostgreSQL is running:**
```bash
# Windows: Check Services app
# Mac: brew services list
# Linux: systemctl status postgresql
```

**Test connection:**
```bash
psql -U postgres -h localhost -d restaurant_db
```

### Port Already in Use

**Find and kill process:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

### Docker Issues

**Reset Docker:**
```bash
# Stop and remove everything
docker-compose down -v

# Remove all Docker images
docker system prune -a

# Start fresh
docker-compose up -d --build
```

---

## Next Steps

After successful installation:

1. ✅ Read [README.md](README.md) for usage instructions
2. ✅ Check [PROJECT-STATUS.md](PROJECT-STATUS.md) for features
3. ✅ Review [docs/api-specifications.md](docs/api-specifications.md) for API details
4. ✅ Start customizing for your restaurant!

---

## Support

If you encounter issues:

1. Check this installation guide
2. Review error messages carefully
3. Check Docker/Node.js logs
4. Create an issue on GitHub
5. Contact team members

---

**Happy Coding! 🚀**

