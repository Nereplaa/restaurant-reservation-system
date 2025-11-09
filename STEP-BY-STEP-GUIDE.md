# 🎯 Step-by-Step Testing Guide

Follow these steps **one by one** to test your complete system.

---

## ✅ Prerequisites Check

**Before starting, make sure you have:**

- [ ] Docker Desktop installed
- [ ] Docker Desktop is **running** (check system tray)
- [ ] Git installed (optional)
- [ ] A web browser (Chrome/Firefox/Edge)

---

## 📝 Step 1: Verify Docker

**Open PowerShell or Command Prompt and run:**

```bash
docker --version
docker-compose --version
```

**Expected output:**
```
Docker version 24.x.x
Docker Compose version v2.x.x
```

✅ **If you see version numbers, continue to Step 2**  
❌ **If error, install Docker Desktop first**

---

## 📂 Step 2: Navigate to Project Folder

```bash
cd C:\Users\Alperen\Desktop\restaurant-service-system
```

**Verify you're in the right folder:**

```bash
dir
```

**You should see:**
- `backend` folder
- `frontend` folder
- `kitchen-display` folder
- `docker-compose.yml` file

✅ **If you see these, continue to Step 3**

---

## 🚀 Step 3: Start All Services

**Run this command:**

```bash
docker-compose up -d
```

**What happens:**
- Downloads Docker images (first time: 5-10 minutes)
- Builds all services
- Starts PostgreSQL database
- Starts backend API
- Starts all frontend apps

**Expected output:**
```
Creating network "restaurant-network" done
Creating restaurant-db ... done
Creating restaurant-backend ... done
Creating restaurant-customer-app ... done
Creating restaurant-admin-panel ... done
Creating restaurant-kitchen-display ... done
```

⏳ **Wait 2 minutes for everything to start**

✅ **Continue to Step 4**

---

## 🔍 Step 4: Check Service Status

**Run this command:**

```bash
docker-compose ps
```

**Expected output:**
```
NAME                          STATE
restaurant-db                 Up (healthy)
restaurant-backend            Up (healthy)
restaurant-customer-app       Up
restaurant-admin-panel        Up
restaurant-kitchen-display    Up
```

**All services should show "Up"**

✅ **If all are "Up", continue to Step 5**  
❌ **If any service shows "Exit", check logs (see troubleshooting below)**

---

## 🌐 Step 5: Test Backend API

**Open your browser and visit:**

```
http://localhost:5000/health
```

**Expected result:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-11-09T..."
}
```

✅ **If you see this JSON, backend is working! Continue to Step 6**  
❌ **If page doesn't load, check Step 4 again**

---

## 🎨 Step 6: Test Customer App

**Open your browser and visit:**

```
http://localhost:3000
```

**Expected result:**
- You should see a beautiful homepage
- Navigation bar at top
- "Welcome to Restaurant" or similar text
- Menu, Login, Register buttons

**Try clicking around the navbar**

✅ **If you see the homepage, continue to Step 7**

---

## 🔐 Step 7: Test Admin Panel Login

**Open a new browser tab and visit:**

```
http://localhost:3001
```

**Expected result:**
- Login page with restaurant theme
- Email and Password fields
- "Admin Login" title

**Click "Fill Admin Credentials" button**

**Then click "Login"**

**Expected result:**
- You should be redirected to Dashboard
- See sidebar on the left
- See statistics cards
- See recent reservations table

✅ **If you see the dashboard, continue to Step 8**  
❌ **If login fails, database might not be seeded. See troubleshooting.**

---

## 📊 Step 8: Explore Admin Dashboard

**You should now be on the Admin Dashboard. Let's explore:**

### 8.1 View Dashboard Statistics

**You should see 6 cards showing:**
- Today's Reservations: 0 (or a number)
- Today's Revenue: $0 (or amount)
- Total Customers: 3 (or more)
- Active Orders: 0 (or a number)
- Available Tables: 0 (initially)
- Occupied Tables: 0

✅ **Statistics visible? Continue to 8.2**

### 8.2 Check Sidebar Navigation

**Click each item in the sidebar:**

1. Click **Dashboard** - Should stay on dashboard
2. Click **Reservations** - Should show reservations page
3. Click **Customers** - Should show customers page
4. Click **Tables** - Should show tables page
5. Click **Menu** - Should show menu page
6. Click **Orders** - Should show orders page
7. Click **Settings** - Should show settings page

✅ **All pages load? Continue to Step 9**

---

## 🪑 Step 9: Add Your First Table

**In Admin Panel, click "Tables" in sidebar**

**Click "+ Add Table" button**

**Fill in the form:**
- Table Number: `1`
- Capacity: `4`
- Location: `Main Hall`
- Status: `Available`

**Click "Create"**

**Expected result:**
- Modal closes
- You see a new table card showing "Table 1"
- Card shows capacity 4 guests
- Card shows location "Main Hall"
- Card has green "Available" badge

✅ **Table created? Continue to Step 10**

---

## 🍽️ Step 10: Add Your First Menu Item

**Click "Menu" in sidebar**

**Click "+ Add Menu Item" button**

**Fill in the form:**
- Name: `Grilled Salmon`
- Description: `Fresh Atlantic salmon with lemon butter sauce`
- Category: `MAIN_COURSE`
- Price: `24.99`
- Preparation Time: `20`
- Available: `Yes`
- Image URL: (leave empty)

**Click "Create"**

**Expected result:**
- Modal closes
- You see a new menu item card
- Shows "Grilled Salmon"
- Shows "$24.99"
- Shows "20 min" prep time
- Has green "Available" badge

✅ **Menu item created? Continue to Step 11**

---

## 📺 Step 11: Test Kitchen Display

**Open a new browser tab and visit:**

```
http://localhost:3002
```

**Expected result:**
- Dark theme (black/gray background)
- "🍽️ Kitchen Display System" title
- Green dot showing "Connected"
- Four status cards showing counts (all 0 initially):
  - Pending: 0
  - Preparing: 0
  - Ready: 0
  - Completed: 0
- Message: "No active orders"

✅ **Kitchen Display loads? Continue to Step 12**

---

## 👤 Step 12: Create Customer Account

**Go back to Customer App tab (http://localhost:3000)**

**Click "Register" in the navbar**

**Fill in the form:**
- First Name: `Test`
- Last Name: `User`
- Email: `test@example.com`
- Phone: `1234567890`
- Password: `password123`
- Confirm Password: `password123`

**Click "Register"**

**Expected result:**
- Registration successful
- You're logged in automatically
- Navbar now shows "Test User" and "Logout"

✅ **Registered successfully? Continue to Step 13**

---

## 📅 Step 13: Make a Reservation

**In Customer App, click "Book a Table"**

**Fill in the form:**
- Date: Select **tomorrow's date**
- Time: Select **19:00** (7 PM)
- Number of Guests: `2`
- Special Requests: `Window seat please` (optional)

**Click "Check Availability"**

**Then click "Confirm Reservation"**

**Expected result:**
- Success message appears
- Shows confirmation number (e.g., "CONF-XXXXXX")
- Click "View My Reservations" button

✅ **Reservation created? Continue to Step 14**

---

## 📋 Step 14: View Your Reservation

**You should now be on "My Reservations" page**

**Expected result:**
- You see your reservation listed
- Shows tomorrow's date and 19:00 time
- Shows 2 guests
- Status badge shows "PENDING" (yellow)
- Shows confirmation number

✅ **Reservation visible? Continue to Step 15**

---

## 🎛️ Step 15: Manage Reservation (Admin)

**Go back to Admin Panel tab (http://localhost:3001)**

**Click "Reservations" in sidebar**

**Expected result:**
- You should see the reservation you just created
- Customer name: "Test User"
- Date and time visible
- Status: "PENDING"

**Click "Manage" button on the reservation**

**In the modal:**
- Status: Change to `CONFIRMED`
- Assign Table: Select `Table 1 - Capacity: 4 (Main Hall)`

**Click "Update"**

**Expected result:**
- Modal closes
- Reservation now shows "CONFIRMED" (blue badge)
- Table column shows "1"

✅ **Reservation updated? Continue to Step 16**

---

## 🔄 Step 16: Verify Real-time Updates

**Go back to Customer App tab (http://localhost:3000)**

**Click "My Reservations" in navbar (if not already there)**

**Expected result:**
- Your reservation now shows "CONFIRMED" status (blue badge)
- Should update automatically or after page refresh

✅ **Status updated? Great! Continue to Step 17**

---

## 📊 Step 17: Check Dashboard Statistics

**Go back to Admin Panel (http://localhost:3001)**

**Click "Dashboard" in sidebar**

**Expected result:**
- Total Customers: Should show 4 (or more)
- Available Tables: Should show 1
- You should see recent reservation in the table

✅ **Statistics updated? Continue to Step 18**

---

## 👥 Step 18: View Customers

**Click "Customers" in sidebar**

**Expected result:**
- You should see at least 4 customers:
  - Admin User
  - Kitchen User  
  - John Doe
  - Test User (you just created)

**Try the search box:**
- Type `test`
- Only "Test User" should appear

✅ **Customer list working? Continue to Step 19**

---

## 🍽️ Step 19: Browse Menu (Customer)

**Go back to Customer App (http://localhost:3000)**

**Click "Menu" in navbar**

**Expected result:**
- You should see "Grilled Salmon" item you created
- Shows price $24.99
- Beautiful card with category badge
- Filter buttons at top

**Try clicking category filters:**
- Click "All" - Shows all items
- Click "MAIN COURSE" - Shows only main courses
- Click "DESSERT" - Shows only desserts (none yet)

✅ **Menu browsing works? Continue to Step 20**

---

## 🔍 Step 20: View Logs (Optional)

**Open PowerShell/Command Prompt**

**View all logs:**
```bash
docker-compose logs -f
```

**Or view specific service:**
```bash
docker-compose logs -f backend
```

**Press Ctrl+C to stop viewing logs**

✅ **Logs visible? Continue to Step 21**

---

## 🧪 Step 21: Test Order System (Create Test Order)

**In Admin Panel, click "Orders" in sidebar**

**Note:** Currently no UI to create orders from admin panel, but you can see orders here when they're created via API.

**For now, check that:**
- Orders page loads
- Shows empty state message
- Filter buttons work

✅ **Orders page works? Continue to Step 22**

---

## 📱 Step 22: Test Responsive Design

**In any of the apps, press F12 to open DevTools**

**Click the "Toggle device toolbar" icon (or Ctrl+Shift+M)**

**Try different device sizes:**
- iPhone SE
- iPad
- Desktop

**Expected result:**
- Layout adjusts for mobile
- Navbar becomes hamburger menu
- Cards stack vertically
- Text remains readable

✅ **Responsive design works? Continue to Step 23**

---

## 🎨 Step 23: Final Visual Check

**Check all applications are working:**

### Customer App (http://localhost:3000)
- [ ] Homepage loads
- [ ] Menu page shows items
- [ ] Reservations page works
- [ ] Can login/logout

### Admin Panel (http://localhost:3001)
- [ ] Dashboard shows statistics
- [ ] All sidebar pages load
- [ ] Can create/edit tables
- [ ] Can create/edit menu items
- [ ] Can manage reservations

### Kitchen Display (http://localhost:3002)
- [ ] Dark theme displays
- [ ] Connected status shows
- [ ] Statistics cards visible

✅ **Everything looks good? Continue to Step 24**

---

## 🛑 Step 24: Stop All Services

**When you're done testing:**

```bash
docker-compose down
```

**Expected output:**
```
Stopping restaurant-kitchen-display ... done
Stopping restaurant-admin-panel ... done
Stopping restaurant-customer-app ... done
Stopping restaurant-backend ... done
Stopping restaurant-db ... done
Removing containers...
Removing network restaurant-network
```

✅ **All services stopped successfully!**

---

## 🎉 Step 25: Restart Everything (Quick Test)

**To verify you can restart easily:**

```bash
docker-compose up -d
```

**Wait 1 minute, then check:**

```bash
docker-compose ps
```

**All services should be "Up" again**

**Visit http://localhost:3001 and login**

**Your data should still be there:**
- Tables you created
- Menu items
- Reservations
- Customers

✅ **Everything persists? Perfect!**

---

## ✅ COMPLETE! 🎉

**Congratulations! You've successfully:**

1. ✅ Started all services with Docker
2. ✅ Verified backend API works
3. ✅ Tested Customer App
4. ✅ Tested Admin Panel (all pages)
5. ✅ Created tables and menu items
6. ✅ Made a reservation
7. ✅ Managed reservation (assign table, change status)
8. ✅ Verified real-time updates
9. ✅ Tested Kitchen Display
10. ✅ Verified data persistence

**Your restaurant management system is 100% functional! 🚀**

---

## 🐛 Troubleshooting

### If any service is not "Up"

**Check logs:**
```bash
docker-compose logs backend
docker-compose logs postgres
```

**Common issues:**

**Backend fails to start:**
```bash
# Restart just the backend
docker-compose restart backend

# Check logs
docker-compose logs -f backend
```

**Database connection error:**
```bash
# Restart database
docker-compose restart postgres

# Wait 30 seconds, then restart backend
docker-compose restart backend
```

**Port already in use:**
```bash
# Stop all services
docker-compose down

# Kill process on port 5000 (Windows)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Start again
docker-compose up -d
```

### If login fails (no users)

**The database wasn't seeded. Fix it:**

```bash
# Access backend container
docker exec -it restaurant-backend sh

# Run seed command
npm run db:seed

# Exit container
exit

# Restart backend
docker-compose restart backend
```

### If pages show errors

**Clear browser cache:**
- Press Ctrl+Shift+Delete
- Clear cached images and files
- Reload page (Ctrl+F5)

### Reset everything (nuclear option)

```bash
# Stop and remove everything including database
docker-compose down -v

# Remove all Docker images
docker system prune -a

# Start fresh
docker-compose up -d --build

# Wait 2 minutes for initialization
```

---

## 📝 Quick Commands Reference

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend

# Check service status
docker-compose ps

# Restart a service
docker-compose restart backend

# Rebuild and restart
docker-compose up -d --build

# Fresh start (deletes database)
docker-compose down -v
docker-compose up -d --build
```

---

## 🎯 Next Steps

**Now that everything works:**

1. **Customize for your restaurant:**
   - Add real tables
   - Add real menu items
   - Update restaurant name in settings
   - Add your logo

2. **Test with team:**
   - Share the URLs with team members
   - Have them test all features
   - Gather feedback

3. **Prepare for deployment:**
   - Read deployment section in README.md
   - Choose hosting platform
   - Set up production database

4. **Add optional features:**
   - AI chatbot (if needed)
   - Email notifications (if needed)
   - Custom features for your restaurant

---

**🎊 You're all set! Your restaurant management system is ready to use! 🎊**

**Need help? Check:**
- [README.md](README.md) - Full documentation
- [INSTALLATION.md](INSTALLATION.md) - Installation details
- [QUICK-REFERENCE.md](QUICK-REFERENCE.md) - Command reference

**Happy restaurant managing! 🍽️**

