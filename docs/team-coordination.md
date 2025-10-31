# Team Coordination Guide

## Communication & Collaboration Best Practices

---

## Team Structure

### 👥 4-Person Team Assignments

| Member | Primary Role | Responsibilities | Technologies |
|--------|--------------|------------------|--------------|
| **Student A** | Customer Frontend + AI | Customer web app, AI chatbot integration | React, TypeScript, Tailwind, OpenAI API |
| **Student B** | Admin Panel | Admin dashboard, management features | React, TypeScript, Tailwind, Charts |
| **Student C** | Backend Developer | REST API, database, business logic | Node.js, Express, PostgreSQL, Prisma |
| **Student D** | Kitchen Display + Real-time | KDS screen, WebSocket integration | React, TypeScript, Socket.io |

### Cross-Training
While each member has a primary focus, everyone should:
- Understand the full system architecture
- Review code from other components
- Be able to assist teammates if needed
- Participate in integration work

---

## Git Workflow

### Repository Structure

```
main (production-ready)
  ↑
  └── develop (integration branch)
        ↑
        ├── feature/customer-login (Student A)
        ├── feature/admin-dashboard (Student B)
        ├── feature/api-reservations (Student C)
        └── feature/kds-orders (Student D)
```

### Branch Naming Convention

```
feature/<component>-<description>
bugfix/<component>-<description>
hotfix/<critical-issue>
docs/<description>

Examples:
feature/customer-booking-form
feature/admin-table-management
feature/backend-auth-api
feature/kds-real-time
bugfix/customer-login-error
docs/update-api-specs
```

### Daily Workflow

#### 1. Start Your Day
```bash
# Make sure you're on develop
git checkout develop

# Get latest changes
git pull origin develop

# Create your feature branch
git checkout -b feature/customer-login
```

#### 2. Work on Your Feature
```bash
# Make changes to your code
# ...

# Check what changed
git status

# Add files
git add src/components/Login.tsx

# Commit with good message
git commit -m "feat(customer): add login form with validation"

# Push to remote
git push origin feature/customer-login
```

#### 3. Create Pull Request
1. Go to GitHub
2. Click "New Pull Request"
3. Base: `develop` ← Compare: `feature/customer-login`
4. Fill out PR template (see below)
5. Request review from 1 team member
6. Link related issues/tasks

#### 4. Code Review
- Reviewer checks code within 24 hours
- Author addresses comments
- Once approved, author merges (or reviewer merges)
- Delete feature branch after merge

#### 5. Keep Your Branch Updated
```bash
# While working on long-lived branch
git checkout feature/my-feature

# Get latest from develop
git fetch origin develop
git merge origin/develop

# Resolve any conflicts
# Test to make sure everything still works
```

---

## Commit Message Convention

### Format
```
type(scope): description

[optional body]

[optional footer]
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Build process, dependencies

### Scopes
- `customer`: Customer app
- `admin`: Admin panel
- `backend`: Backend API
- `kds`: Kitchen Display System
- `database`: Database changes
- `docs`: Documentation
- `config`: Configuration

### Examples
```bash
feat(customer): add reservation booking form
fix(backend): resolve double-booking bug in availability check
docs(api): update reservation endpoints documentation
style(admin): format dashboard component with Prettier
refactor(backend): simplify reservation service logic
test(customer): add unit tests for login form
chore(deps): update React to v18.3.0
```

### Bad Examples ❌
```bash
"fixed stuff"
"updates"
"WIP"
"asdfasdf"
```

---

## Pull Request Template

When creating a PR, include:

```markdown
## Description
Brief description of what this PR does

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Documentation update
- [ ] Refactoring

## Related Issues
Closes #123
Related to #456

## Changes Made
- Added login form component
- Implemented form validation
- Added auth API integration
- Updated README

## Testing Done
- [ ] Manual testing completed
- [ ] All existing tests pass
- [ ] New tests added (if applicable)
- [ ] Tested on Chrome, Firefox

## Screenshots (if UI changes)
[Add screenshots here]

## Checklist
- [ ] Code follows style guidelines
- [ ] No console.log statements
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No merge conflicts
```

---

## Code Review Guidelines

### For Reviewers (What to Check)

#### Functionality ✅
- [ ] Code does what it's supposed to do
- [ ] No obvious bugs
- [ ] Edge cases are handled
- [ ] Error handling is proper

#### Code Quality ✅
- [ ] Code is readable and understandable
- [ ] No duplicate code (DRY principle)
- [ ] Functions are small and focused
- [ ] Variable/function names are descriptive
- [ ] No over-engineering

#### Standards ✅
- [ ] Follows team code style
- [ ] No linter errors
- [ ] TypeScript types are proper (no `any` unless necessary)
- [ ] No console.log or debug code left in

#### Testing ✅
- [ ] Tests included (for backend changes)
- [ ] Manually tested (for frontend changes)
- [ ] No regression issues

#### Security ✅
- [ ] No hardcoded secrets
- [ ] User input is validated
- [ ] SQL injection prevention (using Prisma/parameterized queries)
- [ ] XSS prevention (proper sanitization)

### How to Give Feedback

#### Good Code Review Comments ✅
```
"Consider extracting this into a separate function for reusability:
[code suggestion]"

"Great implementation! One minor suggestion: we could use 
Array.map() here instead of forEach for better readability."

"This works, but I'm concerned about performance with large 
datasets. Could we add pagination?"

"Nice work on the error handling!"
```

#### Bad Code Review Comments ❌
```
"This is wrong" (not specific)
"Why did you do it this way?" (sounds accusatory)
"Just rewrite this" (not helpful)
```

### Approval Process
- **Approve** ✅ - Ready to merge
- **Request Changes** 🔄 - Must be addressed before merge
- **Comment** 💬 - Suggestions, not blockers

**Turnaround Time**: Aim for within 24 hours

---

## Merge Strategy

### How to Merge
1. **Squash and Merge** (preferred for most features)
   - Combines all commits into one clean commit
   - Keeps history clean
   
2. **Regular Merge** (for large features with important history)
   - Preserves all commits
   - Use when commit history tells a story

3. **Rebase and Merge** (not recommended for beginners)
   - Creates linear history
   - Can be confusing with conflicts

### Before Merging Checklist
- [ ] At least 1 approval
- [ ] All comments addressed
- [ ] CI/CD checks pass (green checkmark)
- [ ] No merge conflicts
- [ ] Tested locally
- [ ] Documentation updated

---

## Dealing with Merge Conflicts

### Preventing Conflicts
1. **Communicate**: Let team know what files you're working on
2. **Small PRs**: Smaller changes = fewer conflicts
3. **Frequent Pulls**: Update from develop daily
4. **Divide Work**: Avoid working on same files simultaneously

### Resolving Conflicts (Step by Step)

```bash
# 1. Update your branch with latest develop
git checkout feature/my-feature
git fetch origin develop
git merge origin/develop

# 2. Git will show conflicts
# CONFLICT (content): Merge conflict in src/App.tsx

# 3. Open conflicted files in VS Code
# Look for conflict markers:
<<<<<<< HEAD
your changes
=======
their changes
>>>>>>> origin/develop

# 4. Decide what to keep
# - Keep your changes
# - Keep their changes
# - Keep both
# - Rewrite completely

# 5. Remove conflict markers
# Save the file

# 6. Mark as resolved
git add src/App.tsx

# 7. Complete the merge
git commit -m "merge: resolve conflicts from develop"

# 8. Push
git push origin feature/my-feature

# 9. Test to make sure everything works!
```

### When Stuck
- Ask for help in team chat
- Pair program with the person who made conflicting changes
- Use VS Code's merge conflict helper
- Don't force push unless you know what you're doing!

---

## File Ownership (To Minimize Conflicts)

### Student A (Customer App)
```
frontend/customer-app/
├── src/
│   ├── components/
│   │   ├── BookingForm.tsx
│   │   ├── ReservationList.tsx
│   │   └── ChatBot.tsx
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── BookingPage.tsx
│   │   └── MyReservationsPage.tsx
│   └── services/
│       ├── aiService.ts
│       └── reservationService.ts
```

### Student B (Admin Panel)
```
frontend/admin-panel/
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx
│   │   ├── ReservationTable.tsx
│   │   ├── TableManagement.tsx
│   │   └── MenuManagement.tsx
│   ├── pages/
│   │   ├── DashboardPage.tsx
│   │   ├── ReservationsPage.tsx
│   │   └── SettingsPage.tsx
│   └── services/
│       └── adminService.ts
```

### Student C (Backend)
```
backend/
├── src/
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── reservation.routes.ts
│   │   ├── menu.routes.ts
│   │   └── order.routes.ts
│   ├── controllers/
│   ├── services/
│   └── models/
```

### Student D (Kitchen Display)
```
kitchen-display/
├── src/
│   ├── components/
│   │   ├── OrderCard.tsx
│   │   ├── OrderQueue.tsx
│   │   └── StatusButton.tsx
│   ├── pages/
│   │   └── KitchenDashboard.tsx
│   └── services/
│       └── socketService.ts
```

### Shared Files (Coordinate Before Editing!)
```
- README.md
- docs/*
- package.json (in root)
- .env.example files
- shared/types/*
```

---

## Communication Channels

### Discord/Slack Setup

#### Channels:
1. **#general** - Casual chat, announcements
2. **#development** - Technical discussions
3. **#code-reviews** - PR notifications and reviews
4. **#blockers** - Post when you're stuck
5. **#standup** - Daily standup updates
6. **#resources** - Useful links, tutorials

### Daily Standup (Async in #standup channel)
Post every day by 10 AM:

```
**Daily Standup - [Your Name] - [Date]**

✅ Yesterday:
- Completed login form UI
- Started API integration

🚀 Today:
- Finish API integration
- Add error handling
- Create PR

🚧 Blockers:
- Waiting on backend auth endpoint (Student C)
```

### Response Time Expectations
| Urgency | Expected Response Time |
|---------|----------------------|
| 🔴 Critical Blocker | < 2 hours |
| 🟡 Code Review Request | < 24 hours |
| 🟢 General Question | < 24 hours |
| 🔵 Discussion | Before next meeting |

---

## Meeting Schedule

### Weekly Sprint Ceremonies

**Option 1: Compressed Schedule**
- **Monday 6 PM**: Sprint Planning (2 hours)
- **Tuesday-Friday 9 AM**: Daily Standup (async in chat)
- **Friday 4 PM**: Sprint Review + Retrospective (2 hours)

**Option 2: Separate Meetings**
- **Monday 6 PM**: Sprint Planning (2 hours)
- **Every day 9 AM**: Daily Standup (async)
- **Friday 4 PM**: Sprint Review (1 hour)
- **Friday 5 PM**: Retrospective (1 hour)

### Ad-hoc Meetings
- Schedule as needed for complex integration
- Pair programming sessions
- Debug sessions
- Use "coffee chats" for team bonding

---

## Pair Programming

### When to Pair Program
- Complex/tricky features
- Someone is stuck for > 2 hours
- Integration between components
- Learning new technology

### Tools for Remote Pairing
- **VS Code Live Share** (best option)
- Discord screen share
- GitHub Codespaces
- Tuple (paid, but great)

### How to Pair
1. **Driver**: Person typing
2. **Navigator**: Person guiding

Switch roles every 30 minutes!

---

## Handling Blockers

### You're Blocked? Do This:

1. **Try to solve it** (30 min max)
   - Google, Stack Overflow, documentation
   
2. **Ask for help** (post in #blockers)
   ```
   🚧 BLOCKER
   
   Issue: Can't connect to database from frontend
   
   What I tried:
   - Checked CORS settings
   - Verified .env variables
   - Tested with Postman (works)
   
   Error message:
   [paste error]
   
   Need help from: @Student C (backend)
   ```

3. **Work on something else** while waiting
   - Don't sit idle
   - Find another task

4. **Escalate** if no response in 2 hours
   - DM the person directly
   - Ask another team member

---

## Code Style & Standards

### General Rules
- **2 spaces** for indentation (JavaScript/TypeScript/React)
- **Semicolons**: Yes (ESLint will enforce)
- **Quotes**: Single quotes for strings (except JSX)
- **Line length**: Max 100 characters (flexible)

### Naming Conventions

#### JavaScript/TypeScript
```typescript
// Variables and functions: camelCase
const userName = 'John';
function getUserData() {}

// Constants: UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com';
const MAX_RETRY_COUNT = 3;

// Classes and Components: PascalCase
class UserService {}
function LoginForm() {}

// Private functions/variables: _prefixed (optional)
function _helperFunction() {}

// Files:
// - Components: PascalCase (LoginForm.tsx)
// - Utils/Services: camelCase (authService.ts)
// - Constants: UPPER_SNAKE_CASE (API_CONSTANTS.ts)
```

#### Database
```typescript
// Tables: snake_case plural
users, reservations, menu_items

// Columns: snake_case
first_name, created_at, user_id
```

### Component Structure (React)
```typescript
// 1. Imports
import { useState } from 'react';
import { Button } from './Button';

// 2. Types/Interfaces
interface LoginFormProps {
  onSubmit: (data: LoginData) => void;
}

// 3. Component
export function LoginForm({ onSubmit }: LoginFormProps) {
  // 3a. Hooks
  const [email, setEmail] = useState('');
  
  // 3b. Event handlers
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ email });
  };
  
  // 3c. Render
  return (
    <form onSubmit={handleSubmit}>
      {/* JSX */}
    </form>
  );
}
```

### Function Structure (Backend)
```typescript
// 1. Imports
import { Request, Response } from 'express';
import { prisma } from '../config/database';

// 2. Types
interface CreateReservationBody {
  date: string;
  time: string;
  partySize: number;
}

// 3. Function
export async function createReservation(
  req: Request<{}, {}, CreateReservationBody>,
  res: Response
) {
  try {
    // 3a. Validate input
    const { date, time, partySize } = req.body;
    
    // 3b. Business logic
    const reservation = await prisma.reservation.create({
      data: { date, time, partySize }
    });
    
    // 3c. Return response
    return res.status(201).json({
      success: true,
      data: reservation
    });
  } catch (error) {
    // 3d. Error handling
    return res.status(500).json({
      success: false,
      error: 'Failed to create reservation'
    });
  }
}
```

---

## Environment Variables

### Never Commit Secrets!

**Bad** ❌
```typescript
const apiKey = 'sk-abc123xyz789';
```

**Good** ✅
```typescript
const apiKey = process.env.OPENAI_API_KEY;
```

### .env File Structure

Each component has its own `.env` file:

```
backend/.env
frontend/customer-app/.env
frontend/admin-panel/.env
kitchen-display/.env
```

### Sharing Environment Variables
1. One person sets up `.env.example` files
2. Share actual values in **private** team channel (never in GitHub!)
3. Each team member creates local `.env` from `.env.example`

---

## Testing Strategy

### Backend (Student C)
- **Unit tests**: Individual functions
- **Integration tests**: API endpoints
- **Target**: 60% coverage

```typescript
// Example: reservation.test.ts
import { createReservation } from './reservationService';

describe('Reservation Service', () => {
  test('should create valid reservation', async () => {
    const result = await createReservation({
      date: '2025-11-15',
      time: '19:30',
      partySize: 4
    });
    
    expect(result).toBeDefined();
    expect(result.status).toBe('confirmed');
  });
  
  test('should reject invalid party size', async () => {
    await expect(createReservation({
      partySize: 0
    })).rejects.toThrow();
  });
});
```

### Frontend (Students A, B, D)
- **Manual testing**: Click through every feature
- **Test checklist**: Create for each feature
- **Cross-browser**: Test on Chrome, Firefox minimum

---

## Deployment & Environments

### Three Environments

| Environment | Branch | URL | Purpose |
|-------------|--------|-----|---------|
| **Development** | feature/* | localhost | Local development |
| **Staging** | develop | staging.app.com | Testing integration |
| **Production** | main | app.com | Live app |

### Deployment Process

**Automatic (CI/CD)**:
```
Push to develop → Auto-deploy to staging
Push to main → Auto-deploy to production
```

**Manual** (if automatic isn't set up):
```bash
# Deploy backend
cd backend
git push render main

# Deploy frontend
cd frontend/customer-app
vercel deploy --prod
```

---

## Emergency Procedures

### Production is Broken! 🔥

1. **Stay Calm**
2. **Identify the Issue**
   - What's broken?
   - Error messages?
   - When did it break?

3. **Communicate**
   ```
   🚨 PRODUCTION ISSUE
   
   What: Login is broken
   Impact: Users can't sign in
   Cause: Recent auth update
   Owner: @Student C
   Status: Investigating
   ```

4. **Quick Fix or Rollback?**
   - **Hotfix**: If quick fix (< 30 min)
   - **Rollback**: If complex
   
5. **Rollback Process**
   ```bash
   git checkout main
   git revert <bad-commit-hash>
   git push origin main
   # Redeploy
   ```

6. **Post-Mortem**
   - What happened?
   - Why did it happen?
   - How do we prevent it?

---

## Conflict Resolution

### Technical Disagreements
1. **Discuss pros/cons** of each approach
2. **Research** best practices
3. **Vote** if can't agree
4. **Document decision** (why we chose it)
5. **Move forward** (no grudges!)

### Personal Conflicts
1. **Talk directly** first (DM)
2. **Bring to team** if unresolved (retrospective)
3. **Mediation** by Scrum Master
4. **Escalate** to professor (last resort)

### Unequal Work Distribution
- Track work in sprint board
- Discuss in retrospective
- Adjust assignments
- Consider skill levels (learning takes time)

---

## Knowledge Sharing

### Document as You Go
- Add comments to complex code
- Update README when setup changes
- Create wiki pages for common issues
- Record decisions and why

### Tech Talks (Optional)
- 30 min presentations
- Each person teaches something they learned
- Examples:
  - "How Prisma ORM Works"
  - "React Hooks Deep Dive"
  - "WebSocket Architecture"

---

## Success Metrics

Track these weekly:

- **Velocity**: Story points completed per sprint
- **PR Turnaround**: Average time from PR to merge
- **Build Success**: % of successful builds (goal: >90%)
- **Code Coverage**: Test coverage % (goal: >60% backend)
- **Blockers**: Average time to resolve (goal: <4 hours)

---

## Quick Reference

### Commands Cheat Sheet
```bash
# Daily workflow
git pull origin develop
git checkout -b feature/my-feature
# ... make changes ...
git add .
git commit -m "feat(scope): description"
git push origin feature/my-feature

# Update your branch
git fetch origin develop
git merge origin/develop

# Fix a mistake
git reset HEAD~1  # Undo last commit (keeps changes)
git checkout -- file.txt  # Discard changes to file

# Clean up
git branch -d feature/old-feature  # Delete local branch
git remote prune origin  # Clean up deleted remote branches
```

---

**Remember**: We're a team! Help each other, communicate often, and celebrate wins together! 🎉

---

**Document Version**: 1.0  
**Last Updated**: October 30, 2025  
**Team**: [Your Team Name]

