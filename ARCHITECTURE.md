# 🏗️ Architecture Overview

## 📐 Clean Architecture Layers

```
┌─────────────────────────────────────────────────────────┐
│                    API Layer                            │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Controllers (HTTP Endpoints)                    │  │
│  │  - AuthController                                │  │
│  │  - WalletController (to be added)                │  │
│  │  - PaymentController (to be added)               │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                Application Layer                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Services (Business Logic)                       │  │
│  │  - AuthService                                   │  │
│  │  - WalletService (to be added)                   │  │
│  │  - FraudDetectionService (to be added)           │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Validators (Input Validation)                  │  │
│  │  - RegisterRequestValidator                     │  │
│  │  - LoginRequestValidator                        │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                  Domain Layer                            │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Entities (Core Business Models)                │  │
│  │  - User                                         │  │
│  │  - Wallet                                       │  │
│  │  - Transaction                                  │  │
│  │  - FraudEvent                                   │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Enums                                           │  │
│  │  - TransactionType                              │  │
│  │  - TransactionStatus                            │  │
│  │  - FraudSeverity                                │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│              Infrastructure Layer                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Data Access                                    │  │
│  │  - ApplicationDbContext (EF Core)               │  │
│  │  - PostgreSQL (Supabase)                        │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  External Services                              │  │
│  │  - PasswordHasher (BCrypt)                     │  │
│  │  - JwtTokenService                             │  │
│  │  - RedisService                                │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 Request Flow Example: User Registration

```
┌─────────────┐
│   Client    │
│  (Browser/  │
│   Postman)  │
└──────┬──────┘
       │
       │ POST /api/auth/register
       │ { email, password, phone }
       ↓
┌─────────────────────────────────────┐
│  API Layer: AuthController          │
│  - Receives HTTP request            │
│  - Extracts IP address              │
│  - Extracts device fingerprint      │
└──────────────┬──────────────────────┘
               │
               │ Calls AuthService.RegisterAsync()
               ↓
┌─────────────────────────────────────┐
│  Application Layer: AuthService      │
│  - Validates request (FluentValidation)│
│  - Checks if user exists             │
│  - Hashes password                   │
└──────────────┬──────────────────────┘
               │
               │ Uses Infrastructure Services
               ↓
┌─────────────────────────────────────┐
│  Infrastructure Layer                │
│  ┌────────────────────────────────┐ │
│  │ PasswordHasher                 │ │
│  │ - BCrypt.HashPassword()        │ │
│  └────────────────────────────────┘ │
│  ┌────────────────────────────────┐ │
│  │ ApplicationDbContext           │ │
│  │ - Save User to PostgreSQL     │ │
│  │ - Save Wallet to PostgreSQL   │ │
│  └────────────────────────────────┘ │
│  ┌────────────────────────────────┐ │
│  │ JwtTokenService                │ │
│  │ - GenerateAccessToken()        │ │
│  │ - GenerateRefreshToken()       │ │
│  └────────────────────────────────┘ │
│  ┌────────────────────────────────┐ │
│  │ RedisService                  │ │
│  │ - Store refresh token          │ │
│  └────────────────────────────────┘ │
└──────────────┬──────────────────────┘
               │
               │ Returns AuthResponse
               ↓
┌─────────────────────────────────────┐
│  Response                            │
│  {                                   │
│    accessToken: "jwt...",            │
│    refreshToken: "guid...",          │
│    expiresAt: "2024-...",            │
│    user: { id, email, phone }        │
│  }                                   │
└─────────────────────────────────────┘
```

---

## 🗄️ Database Schema

```
┌──────────────┐
│    users     │
├──────────────┤
│ id (PK)      │
│ email        │
│ password_hash│
│ phone        │
│ created_at   │
│ last_login_ip│
│ device_fp    │
└──────┬───────┘
       │
       │ 1:N
       ↓
┌──────────────┐
│   wallets    │
├──────────────┤
│ id (PK)      │
│ user_id (FK) │
│ balance      │
│ currency     │
└──────┬───────┘
       │
       │ 1:N
       ↓
┌──────────────┐      ┌──────────────┐
│ transactions │──────│ fraud_events │
├──────────────┤ 1:N  ├──────────────┤
│ id (PK)      │      │ id (PK)      │
│ user_id (FK) │      │ trans_id(FK) │
│ wallet_id(FK)│      │ rule_trigger │
│ amount       │      │ severity     │
│ type         │      │ notes        │
│ status       │      │ created_at   │
│ ip_address   │      └──────────────┘
│ device_id    │
│ risk_score   │
│ created_at   │
└──────────────┘
```

---

## 🔐 Security Flow

```
User Registration/Login
         │
         ↓
┌────────────────────┐
│  Password Input    │
└─────────┬──────────┘
          │
          ↓
┌────────────────────┐
│  BCrypt Hash       │
│  (One-way)         │
└─────────┬──────────┘
          │
          ↓
┌────────────────────┐
│  Store in DB       │
│  (Never plaintext) │
└─────────┬──────────┘
          │
          ↓
┌────────────────────┐
│  Generate JWT      │
│  (Signed token)    │
└─────────┬──────────┘
          │
          ↓
┌────────────────────┐
│  Client stores     │
│  token in memory   │
└─────────┬──────────┘
          │
          ↓
┌────────────────────┐
│  Subsequent        │
│  requests include  │
│  Authorization:    │
│  Bearer <token>    │
└─────────┬──────────┘
          │
          ↓
┌────────────────────┐
│  API validates     │
│  token signature   │
└────────────────────┘
```

---

## 📦 Technology Stack

```
┌─────────────────────────────────────────┐
│         .NET 8 Runtime                  │
│  ┌───────────────────────────────────┐  │
│  │ ASP.NET Core Web API             │  │
│  │ - Controllers                    │  │
│  │ - Middleware                     │  │
│  │ - Dependency Injection           │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
              │
    ┌─────────┼─────────┐
    │         │         │
    ↓         ↓         ↓
┌────────┐ ┌────────┐ ┌────────┐
│Entity  │ │JWT     │ │Redis   │
│Framework│ │Bearer  │ │Cache   │
│Core    │ │Auth    │ │        │
└────────┘ └────────┘ └────────┘
    │
    ↓
┌────────┐
│PostgreSQL│
│(Supabase)│
└────────┘
```

---

## 🎯 Key Concepts for Beginners

### **1. Dependency Injection (DI)**
Services are registered in `Program.cs` and automatically injected into controllers/services.

```csharp
// Register service
builder.Services.AddScoped<IAuthService, AuthService>();

// Use in controller (automatically injected)
public class AuthController
{
    private readonly IAuthService _authService; // ← Injected!
    
    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }
}
```

### **2. Entity Framework Core**
Maps C# classes to database tables automatically.

```csharp
// C# Class
public class User
{
    public Guid Id { get; set; }
    public string Email { get; set; }
}

// Automatically maps to:
// CREATE TABLE users (
//     id UUID PRIMARY KEY,
//     email VARCHAR(255)
// );
```

### **3. JWT Tokens**
Stateless authentication - no need to store sessions in database.

```
1. User logs in → Server generates JWT
2. Client stores JWT
3. Client sends JWT with every request
4. Server validates JWT signature
5. If valid → Request allowed
```

### **4. Clean Architecture Benefits**
- **Separation of Concerns**: Each layer has one responsibility
- **Testability**: Easy to test business logic without database
- **Maintainability**: Changes in one layer don't break others
- **Scalability**: Easy to swap implementations (e.g., change database)

---

## 🚀 Next Steps

1. ✅ Authentication (DONE)
2. ⏳ Wallet Management
3. ⏳ Payment Processing
4. ⏳ Fraud Detection Engine
5. ⏳ Background Workers
6. ⏳ Admin APIs
7. ⏳ Webhooks


