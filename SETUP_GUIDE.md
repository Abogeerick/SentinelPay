# 🚀 FalconPay FraudShield API - Complete Setup Guide for Beginners

## 📋 What Has Been Created

I've built a complete C# .NET 8 backend API with the following structure:

### 1. **Project Structure** (Clean Architecture)

```
FalconPay.FraudShield/
├── src/
│   ├── API/                    ← Web API (Controllers, HTTP endpoints)
│   ├── Application/            ← Business logic (Services, Validators)
│   ├── Domain/                 ← Core entities (User, Wallet, Transaction)
│   ├── Infrastructure/         ← Database, Redis, JWT services
│   ├── Workers/                ← Background services (for fraud scanning)
│   └── Shared/                 ← Shared DTOs (Data Transfer Objects)
├── scripts/
│   └── db.sql                  ← Database schema script
└── FalconPay.FraudShield.sln   ← Solution file (groups all projects)
```

### 2. **What Each Layer Does**

- **Domain**: Contains your core business entities (User, Wallet, Transaction, FraudEvent)
- **Application**: Contains business logic and services (AuthService, validators)
- **Infrastructure**: Handles external concerns (database, Redis, JWT tokens)
- **API**: Exposes HTTP endpoints (REST API)
- **Shared**: Common DTOs used across layers

### 3. **What's Been Implemented**

✅ **Database Schema** (`scripts/db.sql`)
   - Users table
   - Wallets table
   - Transactions table
   - Fraud events table

✅ **Authentication System**
   - User registration
   - User login
   - JWT token generation
   - Refresh token support
   - Password hashing (BCrypt)

✅ **Infrastructure Services**
   - PostgreSQL database connection (Supabase)
   - Redis connection for caching
   - JWT token service
   - Password hasher

✅ **API Endpoints**
   - `POST /api/auth/register` - Register new user
   - `POST /api/auth/login` - Login user
   - `POST /api/auth/refresh-token` - Refresh access token
   - `GET /api/auth/test` - Test authenticated endpoint

✅ **Swagger UI** - Interactive API documentation

---

## 🛠️ Step-by-Step Setup Instructions

### **Step 1: Install Prerequisites**

1. **Install .NET 8 SDK**
   - Download from: https://dotnet.microsoft.com/download/dotnet/8.0
   - Verify installation:
     ```bash
     dotnet --version
     ```
     Should show: `8.0.x` or higher

2. **Install PostgreSQL** (if using local database)
   - Or use Supabase (cloud PostgreSQL) - recommended
   - Supabase: https://supabase.com (free tier available)

3. **Install Redis** (optional, for caching)
   - Windows: Download from https://redis.io/download
   - Or use Docker: `docker run -d -p 6379:6379 redis`

### **Step 2: Configure Database Connection**

1. **If using Supabase:**
   - Go to your Supabase project dashboard
   - Go to Settings → Database
   - Copy the connection string (it looks like):
     ```
     Host=xxx.supabase.co;Port=5432;Database=postgres;Username=postgres;Password=xxx;SSL Mode=Require;
     ```

2. **Update `src/API/appsettings.Development.json`:**
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "YOUR_SUPABASE_CONNECTION_STRING_HERE"
     }
   }
   ```

### **Step 3: Run Database Migration**

**Option A: Using Supabase SQL Editor (Recommended)**
1. Go to Supabase Dashboard → SQL Editor
2. Copy the entire contents of `scripts/db.sql`
3. Paste and run it in the SQL Editor

**Option B: Using EF Core Migrations**
```bash
cd src/API
dotnet ef migrations add InitialCreate --project ../Infrastructure --startup-project .
dotnet ef database update --project ../Infrastructure --startup-project .
```

### **Step 4: Configure JWT Secret**

1. Open `src/API/appsettings.json`
2. Change the JWT Secret to a strong random string (at least 32 characters):
   ```json
   "Jwt": {
     "Secret": "YourSuperSecretKeyForJWTTokenGenerationMustBeAtLeast32CharactersLong!"
   }
   ```

### **Step 5: Build the Solution**

```bash
# Navigate to project root
cd C:\Users\OPTIVEN-LIMITED\Desktop\SentinelPay

# Restore NuGet packages
dotnet restore

# Build all projects
dotnet build
```

If you see "Build succeeded", you're good to go! ✅

### **Step 6: Run the API**

```bash
cd src/API
dotnet run
```

You should see:
```
info: FalconPay.FraudShield.API.Controllers.AuthController[0]
      FalconPay FraudShield API starting...
Now listening on: https://localhost:5001
Now listening on: http://localhost:5000
```

---

## 🧪 How to Test the API

### **Method 1: Using Swagger UI (Easiest)**

1. **Start the API** (if not running):
   ```bash
   cd src/API
   dotnet run
   ```

2. **Open Swagger UI:**
   - Navigate to: `https://localhost:5001` or `http://localhost:5000`
   - You'll see the Swagger interface with all available endpoints

3. **Test Registration:**
   - Click on `POST /api/auth/register`
   - Click "Try it out"
   - Enter this JSON:
     ```json
     {
       "email": "test@example.com",
       "password": "password123",
       "phone": "+254712345678"
     }
   ```
   - Click "Execute"
   - You should see a response with `accessToken` and `refreshToken`

4. **Test Login:**
   - Click on `POST /api/auth/login`
   - Click "Try it out"
   - Enter:
     ```json
     {
       "email": "test@example.com",
       "password": "password123"
     }
     ```
   - Click "Execute"
   - Copy the `accessToken` from the response

5. **Test Authenticated Endpoint:**
   - Click on `GET /api/auth/test`
   - Click "Authorize" button at the top
   - Paste your `accessToken` (without "Bearer " prefix)
   - Click "Authorize", then "Close"
   - Click "Try it out" and "Execute"
   - Should return: `{"message": "Authentication is working!"}`

### **Method 2: Using Postman**

1. **Download Postman**: https://www.postman.com/downloads/

2. **Create a new request:**
   - Method: `POST`
   - URL: `https://localhost:5001/api/auth/register`
   - Headers: `Content-Type: application/json`
   - Body (raw JSON):
     ```json
     {
       "email": "test@example.com",
       "password": "password123",
       "phone": "+254712345678"
     }
     ```
   - Click "Send"
   - Copy the `accessToken` from response

3. **Test authenticated endpoint:**
   - New request: `GET https://localhost:5001/api/auth/test`
   - Headers: `Authorization: Bearer YOUR_ACCESS_TOKEN_HERE`
   - Click "Send"

### **Method 3: Using cURL (Command Line)**

```bash
# Register a user
curl -X POST https://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"password123\",\"phone\":\"+254712345678\"}"

# Login
curl -X POST https://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"password123\"}"

# Test authenticated endpoint (replace YOUR_TOKEN)
curl -X GET https://localhost:5001/api/auth/test \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🔍 Troubleshooting

### **Error: "Connection string not found"**
- Make sure you've updated `appsettings.Development.json` with your database connection string

### **Error: "JWT Secret not configured"**
- Update the `Jwt:Secret` in `appsettings.json`

### **Error: "Cannot connect to database"**
- Check your Supabase connection string
- Make sure you've run the `db.sql` script in Supabase SQL Editor
- Verify your database credentials

### **Error: "Port already in use"**
- Change the port in `Properties/launchSettings.json` or kill the process using the port

### **SSL Certificate Error**
- If using `https://localhost:5001`, you might need to trust the development certificate:
  ```bash
  dotnet dev-certs https --trust
  ```

---

## 📝 Next Steps

After testing authentication, the following features are ready to be implemented:

1. **Wallet Endpoints** - Get balance, deposit, withdraw
2. **Payment Endpoints** - Transfer, mobile money, card charge
3. **Fraud Detection Engine** - Rules engine for fraud detection
4. **Background Worker** - Scans transactions for fraud
5. **Admin Endpoints** - Admin dashboard APIs
6. **Webhook Endpoints** - Event notifications

---

## 💡 Understanding the Code Flow

### **When you call `POST /api/auth/register`:**

1. **API Layer** (`AuthController.cs`)
   - Receives HTTP request
   - Extracts IP address and device fingerprint
   - Calls `AuthService.RegisterAsync()`

2. **Application Layer** (`AuthService.cs`)
   - Validates the request
   - Hashes the password using `PasswordHasher`
   - Creates User and Wallet in database
   - Generates JWT tokens using `JwtTokenService`
   - Stores refresh token in Redis

3. **Infrastructure Layer**
   - `ApplicationDbContext` - Saves to PostgreSQL
   - `RedisService` - Stores refresh token
   - `JwtTokenService` - Generates JWT token

4. **Response**
   - Returns `AuthResponse` with tokens and user info

---

## 🎓 Learning Resources

- **.NET 8 Documentation**: https://learn.microsoft.com/en-us/dotnet/
- **Entity Framework Core**: https://learn.microsoft.com/en-us/ef/core/
- **ASP.NET Core Web API**: https://learn.microsoft.com/en-us/aspnet/core/web-api/

---

## ✅ Quick Test Checklist

- [ ] .NET 8 SDK installed (`dotnet --version`)
- [ ] Database connection configured
- [ ] Database schema created (ran `db.sql`)
- [ ] JWT secret configured
- [ ] Solution builds successfully (`dotnet build`)
- [ ] API runs without errors (`dotnet run`)
- [ ] Swagger UI opens in browser
- [ ] Can register a new user
- [ ] Can login with registered user
- [ ] Can access authenticated endpoint with JWT token

---

**Need help?** Check the error messages in the console or Swagger UI response for detailed error information!


