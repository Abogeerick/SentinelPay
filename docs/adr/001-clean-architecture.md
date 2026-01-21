# ADR 001: Clean Architecture Pattern

## Status
✅ Accepted

## Date
2024-01-15

## Context

SentinelPay requires a robust, maintainable architecture that can:
- Support complex business logic (fraud detection, payments, wallet management)
- Enable independent testing of components
- Allow easy replacement of infrastructure concerns
- Scale with team size and feature complexity
- Demonstrate senior engineering best practices

## Decision

We will implement **Clean Architecture** (also known as Hexagonal/Ports & Adapters) with the following layers:

```
┌─────────────────────────────────────────┐
│           Presentation Layer            │
│  (React Frontend + API Controllers)     │
└────────────────────┬────────────────────┘
                     ↓
┌─────────────────────────────────────────┐
│         Application Layer               │
│  (Services, Validators, DTOs)           │
└────────────────────┬────────────────────┘
                     ↓
┌─────────────────────────────────────────┐
│           Domain Layer                  │
│  (Entities, Enums, Business Rules)      │
└────────────────────┬────────────────────┘
                     ↓
┌─────────────────────────────────────────┐
│        Infrastructure Layer             │
│  (Database, Redis, JWT, External APIs)  │
└─────────────────────────────────────────┘
```

### Layer Responsibilities

1. **Domain Layer** (Core)
   - Contains enterprise-wide business rules
   - Entities: `User`, `Wallet`, `Transaction`, `FraudEvent`
   - Domain enums and value objects
   - No dependencies on other layers

2. **Application Layer**
   - Contains application-specific business logic
   - Service classes orchestrate domain entities
   - Input validation with FluentValidation
   - DTOs for data transfer
   - Depends only on Domain layer

3. **Infrastructure Layer**
   - Database access via Entity Framework Core
   - External service implementations (Redis, JWT)
   - Repository pattern implementation
   - Depends on Domain and Application layers

4. **Presentation Layer**
   - API Controllers handle HTTP requests
   - React frontend consumes the API
   - Maps between DTOs and view models

## Consequences

### Positive
- **Testability**: Business logic can be unit tested without database or external services
- **Flexibility**: Easy to swap implementations (e.g., change from Redis to another cache)
- **Maintainability**: Clear separation of concerns makes code easier to understand
- **Interview Ready**: Demonstrates understanding of enterprise architecture patterns
- **Framework Independence**: Core business logic doesn't depend on frameworks

### Negative
- **Initial Complexity**: More upfront setup compared to a simple CRUD app
- **Boilerplate**: Some code duplication required for mapping between layers
- **Learning Curve**: New team members need to understand the architecture

### Mitigations
- Clear documentation and examples in each layer
- Use AutoMapper to reduce mapping boilerplate
- Consistent naming conventions across layers

## References
- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Microsoft Clean Architecture Template](https://github.com/jasontaylordev/CleanArchitecture)
