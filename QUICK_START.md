# ⚡ Quick Start Guide - Test Your API in 5 Minutes

## 🎯 What Was Built

I created a **complete C# .NET 8 backend API** with:

### ✅ What's Working Right Now:

1. **Database Schema** - 4 tables (users, wallets, transactions, fraud_events)
2. **Authentication System** - Register, Login, Refresh Token
3. **JWT Security** - Secure token-based authentication
4. **Swagger UI** - Interactive API testing interface
5. **PostgreSQL Integration** - Ready for Supabase
6. **Redis Support** - For caching (optional)

---

## 🚀 Quick Test (5 Steps)

### **Step 1: Check .NET is Installed**
```powershell
dotnet --version
```
Should show: `8.0.x` or higher

### **Step 2: Update Database Connection**

Edit `src/API/appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "YOUR_SUPABASE_CONNECTION_STRING_HERE"
  }
}
```

**OR** if you don't have Supabase yet, you can use a local PostgreSQL:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=falconpay;Username=postgres;Password=yourpassword;"
  }
}
```

### **Step 3: Create Database Tables**

**Option A: Supabase (Easiest)**
1. Go to https://supabase.com
2. Create a free project
3. Go to SQL Editor
4. Copy and paste the entire `scripts/db.sql` file
5. Click "Run"

**Option B: Local PostgreSQL**
```powershell
# If you have psql installed
psql -U postgres -d falconpay -f scripts/db.sql
```

### **Step 4: Build and Run**

```powershell
# Navigate to project root
cd C:\Users\OPTIVEN-LIMITED\Desktop\SentinelPay

# Restore packages
dotnet restore

# Build
dotnet build

# Run the API
cd src/API
dotnet run
```

You should see:
```
info: FalconPay FraudShield API starting...
Now listening on: https://localhost:5001
Now listening on: http://localhost:5000
```

### **Step 5: Test in Browser**

1. Open: `https://localhost:5001` or `http://localhost:5000`
2. You'll see **Swagger UI** - a beautiful API testing interface
3. Try these endpoints:

#### **Test 1: Register a User**
- Click `POST /api/auth/register`
- Click "Try it out"
- Paste this:
```json
{
  "email": "test@example.com",
  "password": "password123",
  "phone": "+254712345678"
}
```
- Click "Execute"
- ✅ You should see a response with `accessToken` and `refreshToken`

#### **Test 2: Login**
- Click `POST /api/auth/login`
- Click "Try it out"
- Paste this:
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```
- Click "Execute"
- ✅ Copy the `accessToken` from response

#### **Test 3: Test Authenticated Endpoint**
- Click `GET /api/auth/test`
- Click the **"Authorize"** button (top right)
- Paste your `accessToken` (just the token, no "Bearer")
- Click "Authorize", then "Close"
- Click "Try it out" → "Execute"
- ✅ Should return: `{"message": "Authentication is working!"}`

---

## 📊 Project Structure Explained

```
FalconPay.FraudShield/
│
├── src/
│   ├── API/                    ← 🌐 HTTP Endpoints (Controllers)
│   │   ├── Controllers/
│   │   │   └── AuthController.cs    ← Handles /api/auth/* requests
│   │   ├── Program.cs              ← Startup configuration
│   │   └── appsettings.json        ← Configuration file
│   │
│   ├── Application/            ← 🧠 Business Logic
│   │   ├── Services/
│   │   │   └── AuthService.cs      ← Handles registration/login logic
│   │   └── Validators/             ← Input validation
│   │
│   ├── Domain/                 ← 📦 Core Entities
│   │   └── Entities/
│   │       ├── User.cs            ← User model
│   │       ├── Wallet.cs          ← Wallet model
│   │       ├── Transaction.cs     ← Transaction model
│   │       └── FraudEvent.cs      ← Fraud event model
│   │
│   ├── Infrastructure/         ← 🔧 External Services
│   │   ├── Data/
│   │   │   └── ApplicationDbContext.cs  ← Database connection
│   │   └── Services/
│   │       ├── PasswordHasher.cs         ← Password encryption
│   │       ├── JwtTokenService.cs        ← JWT token generation
│   │       └── RedisService.cs           ← Redis caching
│   │
│   ├── Shared/                 ← 📋 Shared DTOs
│   │   └── DTOs/Auth/          ← Request/Response models
│   │
│   └── Workers/                ← ⚙️ Background Services (for fraud scanning)
│
└── scripts/
    └── db.sql                  ← 📄 Database schema script
```

---

## 🔄 How It Works (Simple Flow)

### When You Call `POST /api/auth/register`:

```
1. Request arrives → AuthController.Register()
                    ↓
2. Validates input → RegisterRequestValidator
                    ↓
3. Business logic → AuthService.RegisterAsync()
                    ↓
4. Hash password → PasswordHasher.HashPassword()
                    ↓
5. Save to DB → ApplicationDbContext (PostgreSQL)
                    ↓
6. Generate JWT → JwtTokenService.GenerateAccessToken()
                    ↓
7. Store refresh token → RedisService (Redis)
                    ↓
8. Return response → AuthResponse with tokens
```

---

## 🐛 Common Issues & Fixes

### ❌ "Connection string not found"
**Fix:** Update `src/API/appsettings.Development.json` with your database connection string

### ❌ "JWT Secret not configured"
**Fix:** Make sure `appsettings.json` has a `Jwt:Secret` value (at least 32 characters)

### ❌ "Cannot connect to database"
**Fix:** 
- Check your connection string is correct
- Make sure you ran `db.sql` to create tables
- Verify database credentials

### ❌ "Port 5000/5001 already in use"
**Fix:** Kill the process or change port in `Properties/launchSettings.json`

### ❌ "SSL Certificate Error"
**Fix:** Run this command:
```powershell
dotnet dev-certs https --trust
```

---

## 📝 What's Next?

After testing authentication, you can implement:

1. ✅ **Wallet Endpoints** - Get balance, deposit, withdraw
2. ✅ **Payment Endpoints** - Transfer money, mobile money
3. ✅ **Fraud Detection** - Rules engine to detect fraud
4. ✅ **Background Worker** - Scans transactions automatically
5. ✅ **Admin Dashboard** - Admin APIs

---

## 🎓 Learning Tips

- **Swagger UI** is your best friend - use it to test everything
- Check the **console logs** - they show what's happening
- Look at **error messages** - they tell you exactly what's wrong
- Start simple - test one endpoint at a time

---

## ✅ Success Checklist

- [ ] API runs without errors
- [ ] Swagger UI opens in browser
- [ ] Can register a new user
- [ ] Can login with that user
- [ ] Can access protected endpoint with JWT token

**If all checkboxes are ✅, you're ready to build more features!** 🎉


