# 🛡️ SentinelPay — Real-Time Fraud Detection & Payments Gateway

A production-ready full-stack fintech application featuring real-time fraud detection, risk scoring, and a complete payment gateway simulation. Built with **Clean Architecture**, **Domain-Driven Design (DDD)**, and modern web technologies.

![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?logo=dotnet)
![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178C6?logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Fraud Detection System](#fraud-detection-system)
- [Database Schema](#database-schema)
- [Deployment](#deployment)
- [Security](#security)
- [Contributing](#contributing)

---

## 🎯 Overview

SentinelPay is a comprehensive fintech platform that combines a modern React frontend with a robust C# .NET 8 backend. The system provides:

- **Real-time fraud detection** with multi-rule risk scoring
- **Complete payment gateway** simulation with transaction processing
- **Wallet management** with multi-currency support (KES, USD)
- **Advanced analytics** dashboard with fraud insights
- **JWT-based authentication** with refresh tokens
- **RESTful API** with OpenAPI/Swagger documentation
- **Production-ready deployment** on Vercel (frontend) and Render (backend)

---

## ✨ Features

### 🔐 Authentication & Security
- User registration and login with email/password
- JWT token-based authentication with refresh tokens
- BCrypt password hashing
- Device fingerprinting for security
- IP address tracking
- Role-based access control (User, Admin)

### 💰 Wallet & Payments
- Multi-currency wallet support (KES, USD)
- Real-time balance tracking
- Transaction history with filtering
- Payment processing with recipient tracking
- Transfer money between users
- Transaction status management (pending, success, failed, flagged)

### 🛡️ Fraud Detection
- **Real-time risk scoring** (0-100 scale)
- **7 fraud detection rules**:
  - High amount spike detection
  - Rapid transaction velocity checks
  - IP location change detection
  - Device fingerprint mismatch
  - Suspicious hours monitoring (1-4 AM)
  - New account large transaction detection
  - First-time large transfer detection
- Fraud alerts and notifications
- AI-powered risk explanations
- Fraud statistics and analytics
- Device fingerprinting

### 📊 Analytics & Dashboard
- Spending vs income charts
- Transaction history with filters
- Risk score visualization
- Fraud alerts dashboard
- Real-time activity monitoring
- Admin dashboard with system-wide statistics

### 🎨 User Experience
- **Responsive design** (mobile-first)
- **Dark mode** support
- **PWA-ready** architecture
- Smooth animations and transitions
- Modern fintech UI with TailwindCSS
- Bottom navigation on mobile, sidebar on desktop

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.2 | UI framework |
| **TypeScript** | 5.2 | Type safety |
| **Vite** | 5.1 | Build tool & dev server |
| **React Router DOM** | 6.22 | Client-side routing |
| **Zustand** | 4.5 | State management |
| **Axios** | 1.6 | HTTP client |
| **TailwindCSS** | 3.4 | Utility-first CSS |
| **Recharts** | 2.12 | Data visualization |
| **Lucide React** | 0.330 | Icon library |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **.NET** | 8.0 | Runtime & framework |
| **ASP.NET Core** | 8.0 | Web API framework |
| **Entity Framework Core** | 8.0 | ORM |
| **Npgsql** | 8.0 | PostgreSQL provider |
| **PostgreSQL** | 15+ | Primary database (Supabase) |
| **Redis** | Optional | Caching & rate limiting (in-memory fallback) |
| **JWT Bearer** | 8.0 | Authentication |
| **BCrypt.Net** | 4.0 | Password hashing |
| **AutoMapper** | 12.0 | Object mapping |
| **FluentValidation** | 11.9 | Input validation |
| **Serilog** | 8.0 | Structured logging |
| **Swashbuckle** | 6.5 | OpenAPI/Swagger |

### Infrastructure & DevOps
| Technology | Purpose |
|------------|---------|
| **Docker** | Containerization |
| **Supabase** | PostgreSQL hosting |
| **Vercel** | Frontend deployment |
| **Render** | Backend deployment |
| **GitHub** | Version control |

---

## 🏗️ Architecture

### Clean Architecture Layers

```
┌─────────────────────────────────────────┐
│           Presentation Layer             │
│  (React Frontend + API Controllers)      │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         Application Layer                │
│  (Services, Validators, DTOs)           │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│           Domain Layer                   │
│  (Entities, Enums, Business Rules)      │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│        Infrastructure Layer              │
│  (Database, Redis, JWT, External APIs)  │
└─────────────────────────────────────────┘
```

### Domain-Driven Design (DDD)

- **Entities**: `User`, `Wallet`, `Transaction`, `FraudEvent`
- **Value Objects**: DTOs for data transfer
- **Services**: Business logic in Application layer
- **Repositories**: EF Core DbContext as repository pattern
- **Domain Events**: Fraud detection events

### Design Patterns

- **Repository Pattern**: EF Core DbContext
- **Dependency Injection**: Built-in .NET DI container
- **CQRS-like**: Separate read/write operations
- **Strategy Pattern**: Fraud detection rules
- **Factory Pattern**: Service registration

---

## 📁 Project Structure

```
SentinelPay/
├── src/
│   ├── API/                          # Web API Layer
│   │   ├── Controllers/              # REST API endpoints
│   │   │   ├── AuthController.cs
│   │   │   ├── WalletController.cs
│   │   │   ├── PaymentsController.cs
│   │   │   ├── FraudController.cs
│   │   │   └── AdminController.cs
│   │   ├── Program.cs                # Startup & configuration
│   │   └── appsettings.json          # Configuration
│   │
│   ├── Application/                   # Application Layer
│   │   ├── Services/                 # Business logic
│   │   │   ├── AuthService.cs
│   │   │   ├── WalletService.cs
│   │   │   ├── PaymentService.cs
│   │   │   └── FraudService.cs
│   │   ├── Interfaces/               # Service contracts
│   │   ├── Validators/               # FluentValidation rules
│   │   └── Mappings/                 # AutoMapper profiles
│   │
│   ├── Domain/                       # Domain Layer
│   │   ├── Entities/                # Core business entities
│   │   │   ├── User.cs
│   │   │   ├── Wallet.cs
│   │   │   ├── Transaction.cs
│   │   │   └── FraudEvent.cs
│   │   └── Enums/                    # Domain enumerations
│   │
│   ├── Infrastructure/               # Infrastructure Layer
│   │   ├── Data/                     # EF Core DbContext
│   │   │   └── ApplicationDbContext.cs
│   │   └── Services/                 # External services
│   │       ├── JwtTokenService.cs
│   │       ├── PasswordHasher.cs
│   │       ├── RedisService.cs
│   │       └── InMemoryRedisService.cs
│   │
│   ├── Shared/                       # Shared DTOs
│   │   └── DTOs/                     # Data Transfer Objects
│   │
│   ├── Workers/                      # Background Services
│   │   └── (Background workers for fraud scanning)
│   │
│   ├── components/                   # React components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── RiskGauge.tsx
│   │   └── TransactionItem.tsx
│   │
│   ├── pages/                        # React pages
│   │   ├── Dashboard.tsx
│   │   ├── Wallet.tsx
│   │   ├── Payments.tsx
│   │   ├── Fraud.tsx
│   │   ├── Settings.tsx
│   │   └── Login.tsx
│   │
│   ├── stores/                       # Zustand stores
│   │   ├── authStore.ts
│   │   ├── walletStore.ts
│   │   ├── fraudStore.ts
│   │   └── themeStore.ts
│   │
│   ├── services/                     # API client
│   │   └── api.ts                    # Axios instance
│   │
│   └── layout/                       # Layout components
│       └── AppLayout.tsx
│
├── scripts/                          # Database scripts
│   ├── db.sql                        # Main schema
│   ├── migrate_add_name_avatar.sql   # Migration
│   └── seed_demo_data.sql            # Seed data
│
├── Dockerfile                        # Docker configuration
├── package.json                      # Frontend dependencies
├── FalconPay.FraudShield.sln         # .NET solution file
└── README.md                         # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **.NET 8 SDK** ([Download](https://dotnet.microsoft.com/download))
- **Node.js 18+** and **npm** ([Download](https://nodejs.org/))
- **PostgreSQL** (via Supabase) or local PostgreSQL
- **Git** ([Download](https://git-scm.com/))

### 1. Clone the Repository

   ```bash
git clone https://github.com/yourusername/SentinelPay.git
   cd SentinelPay
   ```

### 2. Database Setup

#### Option A: Using Supabase (Recommended)

1. Create a project at [Supabase](https://supabase.com)
2. Go to **SQL Editor** and run `scripts/db.sql`
3. Run `scripts/migrate_add_name_avatar.sql` (if needed)
4. Get your connection string from **Project Settings → Database**

#### Option B: Local PostgreSQL

   ```bash
# Create database
createdb sentinelpay

# Run schema
psql -d sentinelpay -f scripts/db.sql
```

### 3. Backend Setup

   ```bash
# Restore dependencies
dotnet restore

# Build the solution
dotnet build

# Configure connection string in src/API/appsettings.json
# Or set environment variable:
# ConnectionStrings__DefaultConnection="Host=...;Port=5432;Database=postgres;Username=...;Password=..."

# Run the API
cd src/API
dotnet run --urls "http://localhost:5000"
```

The API will be available at:
- **API**: http://localhost:5000
- **Swagger UI**: http://localhost:5000/swagger

### 4. Frontend Setup

```bash
# Install dependencies
npm install

# Create .env file (optional, defaults to localhost)
echo "VITE_API_URL=http://localhost:5000/api" > .env

# Start development server
npm run dev
```

The frontend will be available at **http://localhost:5173**

### 5. Seed Demo Data (Optional)

Run `scripts/seed_demo_data.sql` in your Supabase SQL Editor to populate the database with sample data.

---

## 📡 API Documentation

### Base URL

- **Local**: `http://localhost:5000/api`
- **Production**: `https://sentinelpay.onrender.com/api`

### Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Endpoints

#### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/auth/register` | Register new user | No |
| `POST` | `/api/auth/login` | Login user | No |
| `POST` | `/api/auth/refresh` | Refresh access token | No |
| `GET` | `/api/auth/me` | Get current user | Yes |

#### Wallet

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/wallet/balance` | Get wallet balance | Yes |
| `GET` | `/api/wallet/transactions` | Get transaction history | Yes |
| `POST` | `/api/wallet/transfer` | Transfer money | Yes |

#### Payments

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/payments/checkout` | Process payment | Yes |
| `GET` | `/api/payments/history` | Get payment history | Yes |

#### Fraud Detection

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/fraud/alerts` | Get fraud alerts | Yes |
| `GET` | `/api/fraud/risk-score` | Get current risk score | Yes |
| `GET` | `/api/fraud/device` | Get device fingerprint | Yes |
| `POST` | `/api/fraud/explain` | Get AI risk explanation | Yes |
| `GET` | `/api/fraud/stats` | Get fraud statistics | Yes |

#### Admin

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/admin/users` | Get all users | Yes (Admin) |
| `GET` | `/api/admin/transactions` | Get all transactions | Yes (Admin) |
| `GET` | `/api/admin/fraud-summary` | Get fraud summary | Yes (Admin) |
| `GET` | `/api/admin/dashboard` | Get dashboard stats | Yes (Admin) |

### Interactive API Documentation

Visit **http://localhost:5000/swagger** (or your deployed URL) for interactive Swagger UI documentation.

---

## 🛡️ Fraud Detection System

### Risk Scoring Algorithm

The system calculates a risk score (0-100) based on multiple fraud detection rules:

| Rule | Risk Points | Description |
|------|-------------|-------------|
| **High Amount Spike** | +25 | Transaction >= 50,000 |
| **Rapid Transactions** | +20 | 5+ transactions in 10 minutes |
| **IP Location Change** | +15 | Different IP from last login |
| **Device Mismatch** | +20 | Different device fingerprint |
| **Suspicious Hours** | +10 | Transactions between 1-4 AM |
| **New Account + Large Transaction** | +25 | Account < 7 days old + transaction >= 10,000 |
| **First-time Large Transfer** | +10 | First transfer > 5,000 to new recipient |

### Risk Levels

| Score Range | Level | Action |
|-------------|-------|--------|
| 0-30 | 🟢 **Safe** | Transaction approved |
| 31-50 | 🟡 **Caution** | Transaction approved with monitoring |
| 51-70 | 🟠 **Flag for Review** | Manual review required |
| 71-100 | 🔴 **Block** | Transaction blocked |

### Fraud Detection Flow

```
Transaction Request
        ↓
Calculate Risk Score
        ↓
Apply Fraud Rules
        ↓
Generate Fraud Event (if flagged)
        ↓
Update Transaction Status
        ↓
Return Response with Risk Score
```

---

## 🗄️ Database Schema

### Tables

#### `users`
- `id` (UUID, Primary Key)
- `email` (VARCHAR, Unique)
- `password_hash` (VARCHAR)
- `name` (VARCHAR)
- `phone` (VARCHAR)
- `avatar` (VARCHAR)
- `created_at` (TIMESTAMP)
- `last_login_ip` (VARCHAR)
- `device_fingerprint` (VARCHAR)
- `updated_at` (TIMESTAMP)

#### `wallets`
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key → users)
- `balance` (DECIMAL)
- `currency` (VARCHAR, 'KES' or 'USD')
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### `transactions`
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key → users)
- `wallet_id` (UUID, Foreign Key → wallets)
- `amount` (DECIMAL)
- `type` (VARCHAR, 'credit' or 'debit')
- `status` (VARCHAR, 'pending', 'success', 'failed', 'flagged')
- `ip_address` (VARCHAR)
- `device_id` (VARCHAR)
- `risk_score` (INT, 0-100)
- `metadata` (JSONB)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### `fraud_events`
- `id` (UUID, Primary Key)
- `transaction_id` (UUID, Foreign Key → transactions)
- `user_id` (UUID, Foreign Key → users)
- `rule_triggered` (VARCHAR)
- `risk_score` (INT)
- `severity` (VARCHAR, 'low', 'medium', 'high', 'critical')
- `description` (TEXT)
- `created_at` (TIMESTAMP)

### Relationships

```
users (1) ──→ (N) wallets
users (1) ──→ (N) transactions
users (1) ──→ (N) fraud_events
wallets (1) ──→ (N) transactions
transactions (1) ──→ (N) fraud_events
```

---

## 🚢 Deployment

### Frontend Deployment (Vercel)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Click **New Project** → Import from GitHub
   - Select your repository

3. **Configure Build Settings**
   - **Framework Preset**: Vite
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. **Environment Variables**
   - `VITE_API_URL`: `https://sentinelpay.onrender.com/api`

5. **Deploy!**

### Backend Deployment (Render)

1. **Push to GitHub** (same as above)

2. **Create Web Service on Render**
   - Go to [Render](https://render.com)
   - Click **New** → **Web Service**
   - Connect your GitHub repository

3. **Configure Service**
   - **Name**: `sentinelpay`
   - **Environment**: Docker
   - **Dockerfile Path**: `./Dockerfile`
   - **Port**: `8080`

4. **Environment Variables**
   ```
   ConnectionStrings__DefaultConnection=Host=aws-1-eu-central-2.pooler.supabase.com;Port=5432;Database=postgres;Username=postgres.xxx;Password=xxx;SSL Mode=Require;Trust Server Certificate=true
   JwtSettings__SecretKey=your-super-secret-key-min-32-chars
   JwtSettings__Issuer=FalconPay.FraudShield
   JwtSettings__Audience=FalconPay.FraudShield.Users
   JwtSettings__ExpirationMinutes=60
   EnableSwagger=true
   ```

5. **Deploy!**

### Docker Deployment

```bash
# Build image
docker build -t sentinelpay-api .

# Run container
docker run -p 8080:8080 \
  -e ConnectionStrings__DefaultConnection="..." \
  -e JwtSettings__SecretKey="..." \
  sentinelpay-api
```

---

## 🔒 Security

### Authentication & Authorization
- **JWT tokens** with expiration
- **Refresh tokens** for token renewal
- **BCrypt** password hashing (cost factor 12)
- **Role-based access control** (User, Admin)

### Data Protection
- **HTTPS** enforced in production
- **SQL injection** prevention via EF Core parameterized queries
- **XSS protection** via React's built-in escaping
- **CORS** configuration for allowed origins

### Fraud Prevention
- **Device fingerprinting** for device tracking
- **IP address tracking** for location monitoring
- **Rate limiting** (via Redis/in-memory)
- **Transaction risk scoring** before approval

### Best Practices
- Environment variables for sensitive data
- No secrets in code or version control
- Structured logging (Serilog)
- Input validation (FluentValidation)

---

## 📊 Monitoring & Logging

### Logging
- **Serilog** for structured logging
- Logs written to:
  - Console (development)
  - Files (`logs/falconpay-YYYYMMDD.txt`)
- Log levels: Debug, Information, Warning, Error

### Health Checks
- **Root endpoint**: `GET /` - API status
- **Database health**: `GET /api/health/db` - Database connectivity

---

## 🧪 Testing

### Manual Testing

1. **Register a new user**:
   ```bash
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"Test123!"}'
   ```

2. **Login**:
   ```bash
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"Test123!"}'
   ```

3. **Get wallet balance** (with token):
   ```bash
   curl -X GET http://localhost:5000/api/wallet/balance \
     -H "Authorization: Bearer <your-token>"
   ```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is for demonstration and educational purposes.

---

## 🙏 Acknowledgments

- **Supabase** for PostgreSQL hosting
- **Vercel** for frontend deployment
- **Render** for backend deployment
- **.NET Foundation** for the excellent framework
- **React Team** for the amazing UI library

---

## 📞 Support

For issues, questions, or contributions:
- Open an issue on [GitHub](https://github.com/yourusername/SentinelPay/issues)
- Check the [API Documentation](BACKEND_API_DOCS.md)
- Review the [Deployment Guide](DEPLOYMENT_GUIDE.md)

---

**Built with ❤️ using .NET 8, React, TypeScript, and modern web technologies**
