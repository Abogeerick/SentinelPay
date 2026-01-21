# Contributing to SentinelPay

First off, thank you for considering contributing to SentinelPay! 🎉 It's people like you that make SentinelPay such a great tool.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **.NET 8 SDK**
- **Git**
- **PostgreSQL** (or Supabase account)

### Local Development Setup

1. **Fork the repository** on GitHub

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR-USERNAME/SentinelPay.git
   cd SentinelPay
   ```

3. **Install dependencies**
   ```bash
   # Frontend
   npm install

   # Backend
   dotnet restore
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your local settings
   ```

5. **Run the development servers**
   ```bash
   # Frontend (Terminal 1)
   npm run dev

   # Backend (Terminal 2)
   cd src/API
   dotnet run
   ```

## 💻 Development Workflow

### Branch Naming Convention

- `feature/` - New features (e.g., `feature/add-2fa-authentication`)
- `fix/` - Bug fixes (e.g., `fix/transaction-validation`)
- `docs/` - Documentation changes (e.g., `docs/update-api-readme`)
- `refactor/` - Code refactoring (e.g., `refactor/fraud-service`)
- `test/` - Test additions/fixes (e.g., `test/auth-store-coverage`)

### Creating a New Branch

```bash
# Ensure you're on the latest main
git checkout main
git pull origin main

# Create your feature branch
git checkout -b feature/your-feature-name
```

## 📝 Coding Standards

### TypeScript/JavaScript

- Use **TypeScript** for all new code
- Follow existing code style (enforced by ESLint)
- Use **functional components** with hooks
- Write **descriptive variable names**
- Add **JSDoc comments** for complex functions

```typescript
/**
 * Calculates the risk score for a transaction based on fraud detection rules.
 * 
 * @param transaction - The transaction to evaluate
 * @param user - The user making the transaction
 * @returns The calculated risk score (0-100)
 * 
 * @example
 * const score = calculateRiskScore(transaction, user);
 * if (score > 70) flagTransaction(transaction);
 */
export function calculateRiskScore(
  transaction: Transaction,
  user: User
): number {
  // Implementation
}
```

### C# (.NET)

- Follow **Microsoft's C# Coding Conventions**
- Use **async/await** for I/O operations
- Implement **interface segregation**
- Write **clean, self-documenting code**

```csharp
/// <summary>
/// Service for handling fraud detection operations.
/// </summary>
public interface IFraudService
{
    /// <summary>
    /// Calculates the risk score for a given transaction.
    /// </summary>
    /// <param name="transaction">The transaction to evaluate.</param>
    /// <param name="user">The user making the transaction.</param>
    /// <returns>A task containing the risk score (0-100).</returns>
    Task<int> CalculateRiskScoreAsync(Transaction transaction, User user);
}
```

### File Organization

```
src/
├── components/     # Reusable UI components
├── hooks/          # Custom React hooks
├── pages/          # Page components
├── services/       # API and external services
├── stores/         # Zustand state stores
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
└── __tests__/      # Test files
```

## 📝 Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
feat(auth): add two-factor authentication support

fix(fraud): correct velocity check time window calculation

docs(readme): update installation instructions

test(wallet): add unit tests for transfer functionality
```

## 🔄 Pull Request Process

### Before Submitting

1. **Update from main**
   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. **Run tests**
   ```bash
   npm run test:unit
   npm run lint
   ```

3. **Build successfully**
   ```bash
   npm run build
   dotnet build
   ```

### PR Checklist

- [ ] Tests pass locally
- [ ] Linting passes
- [ ] New code is covered by tests
- [ ] Documentation is updated if needed
- [ ] Commit messages follow our convention
- [ ] PR description explains the changes

### PR Template

```markdown
## Description
Brief description of the changes.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe how you tested the changes.

## Screenshots (if applicable)

## Checklist
- [ ] Tests pass
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
```

## 🧪 Testing

### Running Tests

```bash
# Run all frontend tests
npm run test

# Run with coverage
npm run test:coverage

# Run specific test file
npm run test -- src/stores/__tests__/authStore.test.ts

# Run backend tests
dotnet test
```

### Writing Tests

- Place test files in `__tests__` directories or next to the file being tested
- Name test files with `.test.ts` or `.spec.ts` suffix
- Aim for meaningful test coverage, not just 100%
- Test edge cases and error conditions

```typescript
describe('TransactionService', () => {
  describe('transfer', () => {
    it('should successfully transfer funds between users', async () => {
      // Arrange
      const fromUser = createMockUser({ balance: 1000 });
      const toUser = createMockUser({ balance: 0 });

      // Act
      const result = await transactionService.transfer(fromUser, toUser, 500);

      // Assert
      expect(result.success).toBe(true);
      expect(result.fromBalance).toBe(500);
      expect(result.toBalance).toBe(500);
    });

    it('should reject transfer with insufficient funds', async () => {
      // Test error case
    });
  });
});
```

## 📚 Documentation

- Update README.md for user-facing changes
- Add JSDoc/XML comments for public APIs
- Create or update ADRs for architectural decisions
- Keep the API documentation in sync

### Creating an ADR

For significant architectural decisions, create an ADR in `docs/adr/`:

```markdown
# ADR XXX: Title

## Status
Proposed | Accepted | Superseded

## Context
What is the issue?

## Decision
What is the solution?

## Consequences
What are the trade-offs?
```

## 🙏 Thank You!

Your contributions make SentinelPay better for everyone. We appreciate your time and effort! 💙

---

Questions? Open an issue or reach out to the maintainers.
