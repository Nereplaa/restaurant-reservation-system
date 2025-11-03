# Restaurant Reservation System

A comprehensive restaurant management system with customer reservations, AI-powered booking assistant, admin panel, and kitchen display system.

## 🎯 Project Overview

This system enables:
- **Customers**: Book reservations online via web/mobile with AI chatbot assistance
- **Restaurant Owner**: Manage all reservations, orders, and system settings via admin panel
- **Kitchen Staff**: View real-time orders on kitchen display screens

## 👥 Team Structure (4 Students)

### Team Assignments by Component:

| Student | Role | Responsibilities |
|---------|------|------------------|
| **Student A** | Customer Frontend + AI | Customer web app, AI chatbot integration |
| **Student B** | Admin Panel | Admin dashboard, management features |
| **Student C** | Backend Developer | REST API, database, business logic |
| **Student D** | Kitchen Display + Real-time | KDS screen, WebSocket integration |

## 📁 Project Structure

```
restaurant-reservation-system/
│
├── docs/                          # 📚 All documentation
│   ├── requirements.md            # Functional & non-functional requirements
│   ├── architecture.md            # System architecture & design
│   ├── api-specifications.md     # API endpoints & contracts
│   ├── database-schema.md        # Database design & ERD
│   ├── sdlc-process.md           # Agile/Scrum methodology
│   └── team-coordination.md      # Git workflow & coordination
│
├── frontend/                      # 🎨 Frontend applications
│   ├── customer-app/             # Customer booking interface
│   └── admin-panel/              # Admin management dashboard
│
├── backend/                       # ⚙️ Backend API server
│   ├── src/
│   │   ├── routes/               # API routes
│   │   ├── controllers/          # Request handlers
│   │   ├── models/               # Database models
│   │   ├── services/             # Business logic
│   │   └── middleware/           # Auth, validation, etc.
│   └── database/                 # Migrations & seeds
│
├── kitchen-display/               # 📺 Kitchen Display System
│
└── shared/                        # 🔄 Shared types & utilities
    └── types/                    # TypeScript interfaces
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** (v14 or higher)
- **Git**

### Initial Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd restaurant-reservation-system
```

2. **Install dependencies for all modules**
```bash
# Backend
cd backend
npm install

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

3. **Set up environment variables**
```bash
# Copy example env files
cp backend/.env.example backend/.env
cp frontend/customer-app/.env.example frontend/customer-app/.env
cp frontend/admin-panel/.env.example frontend/admin-panel/.env
cp kitchen-display/.env.example kitchen-display/.env

# Edit .env files with your configuration
```

4. **Set up database**
```bash
cd backend
npm run db:setup
npm run db:migrate
npm run db:seed
```

5. **Run all services**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Customer App
cd frontend/customer-app
npm run dev

# Terminal 3 - Admin Panel
cd frontend/admin-panel
npm run dev

# Terminal 4 - Kitchen Display
cd kitchen-display
npm run dev
```

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API calls
- **Socket.io-client** for real-time updates

### Backend
- **Node.js** with **Express**
- **TypeScript**
- **PostgreSQL** with **Prisma ORM**
- **Socket.io** for WebSocket communication
- **JWT** for authentication
- **OpenAI API** for AI chatbot

### DevOps & Tools
- **Git** for version control
- **ESLint** & **Prettier** for code formatting
- **Jest** for testing
- **Docker** (optional) for containerization

## 📖 Development Workflow (Agile - 2 Week Sprints)

### Sprint Cycle
1. **Sprint Planning** (Monday Week 1) - Plan tasks
2. **Daily Standups** (15 min) - Quick sync
3. **Development** (10 days)
4. **Sprint Review** (Friday Week 2) - Demo
5. **Sprint Retrospective** - Improve process

See `docs/sdlc-process.md` for detailed methodology.

## 🔄 Git Workflow

### Branch Strategy
- `main` - Production ready code
- `develop` - Integration branch
- `feature/<feature-name>` - Feature branches
- `bugfix/<bug-name>` - Bug fixes

### Commit Convention
```
type(scope): description

Types: feat, fix, docs, style, refactor, test, chore
Example: feat(customer): add reservation booking form
```

### Pull Request Process
1. Create feature branch from `develop`
2. Make changes and commit
3. Push and create PR to `develop`
4. Get 1 team member review
5. Merge after approval

See `docs/team-coordination.md` for detailed workflow.

## 📋 Project Phases

### Phase 1: Setup & Documentation (Weeks 1-2)
- [x] Project structure
- [x] Requirements documentation
- [x] Database design
- [ ] Development environment setup

### Phase 2: Core Features (Weeks 3-4)
- [ ] User authentication
- [ ] Basic reservation CRUD
- [ ] Admin dashboard basics

### Phase 3: Advanced Features (Weeks 5-6)
- [ ] AI chatbot integration
- [ ] Kitchen display with real-time
- [ ] Order management

### Phase 4: Polish & Testing (Weeks 7-8)
- [ ] Bug fixes
- [ ] UI/UX improvements
- [ ] Testing & documentation
- [ ] Final deployment

## 🧪 Testing

```bash
# Backend tests
cd backend
npm run test

# Frontend tests
cd frontend/customer-app
npm run test
```

## 📚 Documentation

All documentation is in the `docs/` folder:
- **requirements.md** - What the system should do
- **architecture.md** - How the system is structured
- **api-specifications.md** - API endpoint details
- **database-schema.md** - Database design
- **sdlc-process.md** - Development methodology
- **team-coordination.md** - How to work together

## 🤝 Team Communication

- **Daily Standup**: 15 minutes, same time every day
- **Code Reviews**: All PRs require 1 approval
- **Questions**: Use team Discord/Slack channel
- **Blockers**: Communicate immediately

## 📞 Support

For questions or issues:
1. Check documentation in `docs/`
2. Ask in team chat
3. Create an issue in GitHub

## 📄 License

Educational project for Software Engineering class.

---

**Built with ❤️ by [SEUA]**

