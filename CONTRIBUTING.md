# Contributing Guidelines

Thank you for considering contributing to the Restaurant Service System!

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in Issues
2. Create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (OS, Python version, etc.)
   - Screenshots if applicable

### Suggesting Features

1. Open an issue with tag "enhancement"
2. Describe the feature and its use case
3. Explain why it would be useful
4. Consider implementation details

### Pull Requests

1. Fork the repository
2. Create a new branch from `main`
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes
4. Test thoroughly
5. Commit with clear messages
   ```bash
   git commit -m "Add feature: description"
   ```
6. Push to your fork
   ```bash
   git push origin feature/your-feature-name
   ```
7. Open a Pull Request

## Development Setup

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python seed.py
python run.py
```

### Frontend

```bash
cd frontend/customer-app  # or admin-panel, kitchen-display
npm install
npm run dev
```

## Code Style

### Python

- Follow PEP 8 style guide
- Use type hints
- Write docstrings for functions and classes
- Format with Black: `black app/`
- Lint with Flake8: `flake8 app/`

### TypeScript/React

- Follow ESLint rules
- Use TypeScript for type safety
- Use functional components
- Follow React best practices

## Testing

### Backend Tests

```bash
cd backend
pytest
```

### Frontend Tests

```bash
cd frontend/customer-app
npm test
```

## Database Changes

When modifying database models:

1. Update SQLAlchemy models in `backend/app/models/`
2. Create migration:
   ```bash
   cd backend
   alembic revision --autogenerate -m "description"
   ```
3. Review generated migration
4. Test migration:
   ```bash
   alembic upgrade head
   ```

## Commit Message Guidelines

Format: `<type>: <subject>`

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

Examples:
```
feat: Add table filtering by status
fix: Resolve reservation date validation
docs: Update API endpoint documentation
```

## Code Review Process

1. All PRs require review before merging
2. Address review comments
3. Keep PRs focused and reasonably sized
4. Ensure CI/CD checks pass

## Questions?

Open an issue for discussion or clarification.

Thank you for contributing!

