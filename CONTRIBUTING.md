# Contributing to Restaurant Management System

Thank you for considering contributing to this project! 🎉

---

## How to Contribute

### 1. Fork the Repository

Click the "Fork" button at the top right of this repository.

### 2. Clone Your Fork

```bash
git clone https://github.com/YOUR-USERNAME/restaurant-service-system.git
cd restaurant-service-system
```

### 3. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/` - New features
- `bugfix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring

### 4. Make Your Changes

- Write clean, readable code
- Follow existing code style
- Add comments for complex logic
- Update documentation as needed

### 5. Test Your Changes

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend/customer-app
npm test
```

### 6. Commit Your Changes

Use meaningful commit messages:

```bash
git add .
git commit -m "feat(customer): add email verification"
```

**Commit Message Format:**
```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Code style (formatting)
- `refactor` - Code refactoring
- `test` - Adding tests
- `chore` - Maintenance

**Examples:**
```
feat(admin): add export to CSV functionality
fix(auth): resolve token expiration issue
docs(readme): update installation instructions
refactor(api): improve error handling
```

### 7. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 8. Create a Pull Request

1. Go to the original repository
2. Click "New Pull Request"
3. Select your fork and branch
4. Fill out the PR template
5. Submit!

---

## Code Style Guidelines

### TypeScript/JavaScript

- Use TypeScript for all new code
- Use meaningful variable names
- Add JSDoc comments for functions
- Follow ESLint configuration
- Use async/await over promises

**Example:**
```typescript
/**
 * Create a new reservation
 * @param userId - The ID of the user making the reservation
 * @param reservationData - The reservation details
 * @returns Promise with created reservation
 */
async function createReservation(
  userId: string,
  reservationData: ReservationInput
): Promise<Reservation> {
  // Implementation
}
```

### React Components

- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use TypeScript interfaces for props

**Example:**
```typescript
interface ButtonProps {
  text: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  variant = 'primary',
  disabled = false,
}) => {
  // Implementation
};
```

### CSS/Tailwind

- Use Tailwind utility classes
- Keep custom CSS minimal
- Use consistent spacing (4, 8, 16, 24, 32)
- Mobile-first responsive design

---

## Development Setup

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Docker (optional)

### Setup

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Setup database
npm run db:migrate
npm run db:seed

# Start development
npm run dev
```

---

## Testing

### Unit Tests

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend/customer-app
npm test
```

### Manual Testing

1. Start all services
2. Test the feature thoroughly
3. Check different user roles
4. Test error cases
5. Verify responsive design

---

## Pull Request Guidelines

### Before Submitting

- [ ] Code follows style guidelines
- [ ] Tests pass
- [ ] Documentation is updated
- [ ] Commit messages are clear
- [ ] No console.log statements
- [ ] No commented-out code
- [ ] Branch is up to date with main

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How to test the changes

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No breaking changes
```

---

## Reporting Bugs

### Before Reporting

1. Check if the bug is already reported
2. Try the latest version
3. Reproduce the bug consistently

### Bug Report Template

```markdown
**Describe the bug**
Clear description of the bug

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What should happen

**Screenshots**
If applicable

**Environment:**
- OS: [e.g., Windows 11]
- Browser: [e.g., Chrome 120]
- Version: [e.g., 1.0.0]

**Additional context**
Any other information
```

---

## Feature Requests

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
Clear description

**Describe the solution**
What you want to happen

**Alternatives considered**
Other solutions you've thought about

**Additional context**
Any other information
```

---

## Code Review Process

1. **Automated Checks** - CI/CD runs tests
2. **Code Review** - At least one team member reviews
3. **Discussion** - Address feedback
4. **Approval** - Get approval from maintainer
5. **Merge** - Maintainer merges the PR

---

## Communication

- Be respectful and constructive
- Ask questions if unclear
- Provide helpful feedback
- Acknowledge good work

---

## Project Structure

```
restaurant-service-system/
├── backend/           # Backend API
├── frontend/          # Frontend apps
├── kitchen-display/   # Kitchen display
├── docs/             # Documentation
└── docker/           # Docker configs
```

---

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

## Questions?

- Create an issue for questions
- Contact maintainers
- Check documentation

---

**Thank you for contributing! 🙏**

Every contribution, no matter how small, helps make this project better!

