# FalconPay FraudShield API - Backend

A production-ready C# .NET 8 backend API for real-time fraud detection and payments gateway simulation.

## 🏗️ Architecture

This project follows **Clean Architecture** principles with the following layers:

- **API**: Controllers, middleware, and API configuration
- **Application**: Business logic, services, DTOs, validators
- **Domain**: Entities, enums, domain models
- **Infrastructure**: Data access (EF Core), external services (Redis, JWT)
- **Workers**: Background services for fraud scanning
- **Shared**: Shared DTOs and common types

## 🚀 Getting Started

### Prerequisites

- .NET 8 SDK
- PostgreSQL (Supabase or local)
- Redis (optional, for caching and rate limiting)

### Setup

1. **Clone and navigate to the project**
   ```bash
   cd src/API
   ```

2. **Configure Database Connection**
   
   Update `appsettings.json` or `appsettings.Development.json` with your Supabase PostgreSQL connection string:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Host=your-supabase-host.supabase.co;Port=5432;Database=postgres;Username=postgres;Password=your-password;SSL Mode=Require;"
   }
   ```

3. **Run Database Migrations**
   
   Execute the SQL script in `scripts/db.sql` in your Supabase SQL Editor, or use EF Core migrations:
   ```bash
   dotnet ef migrations add InitialCreate --project ../Infrastructure --startup-project .
   dotnet ef database update --project ../Infrastructure --startup-project .
   ```

4. **Configure Redis (Optional)**
   
   Update the Redis connection string in `appsettings.json`:
   ```json
   "ConnectionStrings": {
     "Redis": "localhost:6379"
   }
   ```

5. **Configure JWT Secret**
   
   Update the JWT secret in `appsettings.json` (use a strong, random secret in production):
   ```json
   "Jwt": {
     "Secret": "YourSuperSecretKeyForJWTTokenGenerationMustBeAtLeast32CharactersLong!"
   }
   ```

6. **Run the API**
   ```bash
   dotnet run
   ```

7. **Access Swagger UI**
   
   Navigate to `https://localhost:5001` or `http://localhost:5000` (Swagger UI is at the root)

## 📚 API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT tokens
- `POST /api/auth/refresh-token` - Refresh access token
- `GET /api/auth/test` - Test authenticated endpoint (requires JWT)

### Example Request (Register)

```json
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "phone": "+254712345678"
}
```

### Example Response

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "guid-refresh-token",
  "expiresAt": "2024-01-01T12:00:00Z",
  "user": {
    "id": "guid",
    "email": "user@example.com",
    "phone": "+254712345678"
  }
}
```

## 🔧 Project Structure

```
src/
├── API/                    # Web API layer
│   ├── Controllers/
│   ├── Program.cs
│   └── appsettings.json
├── Application/            # Application layer
│   ├── Interfaces/
│   ├── Services/
│   ├── Mappings/
│   └── Validators/
├── Domain/                 # Domain layer
│   ├── Entities/
│   └── Enums/
├── Infrastructure/         # Infrastructure layer
│   ├── Data/
│   └── Services/
├── Workers/                # Background workers
└── Shared/                 # Shared DTOs
    └── DTOs/
```

## 🗄️ Database Schema

The database includes the following tables:

- **users**: User accounts
- **wallets**: User wallets (KES/USD)
- **transactions**: Payment transactions
- **fraud_events**: Fraud detection events

See `scripts/db.sql` for the complete schema.

## 🔐 Security

- JWT-based authentication
- BCrypt password hashing
- Refresh token rotation
- CORS configuration
- Input validation with FluentValidation

## 📝 Next Steps

The following features are still to be implemented:

- Wallet endpoints (GET, deposit, withdraw, transactions)
- Payment endpoints (transfer, mobile-money, card-charge)
- Fraud detection engine and rules
- Background worker for fraud scanning
- Admin endpoints
- Webhook endpoints

## 🛠️ Development

### Adding a New Migration

```bash
dotnet ef migrations add MigrationName --project ../Infrastructure --startup-project .
dotnet ef database update --project ../Infrastructure --startup-project .
```

### Running Tests

```bash
dotnet test
```

## 📄 License

This project is part of the FalconPay FraudShield system.

