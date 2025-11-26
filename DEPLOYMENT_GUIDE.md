# SentinelPay Deployment Guide

This guide covers deploying the full SentinelPay application:

- **Frontend**: React app deployed to Vercel
- **Backend**: .NET 8 API deployed to Railway, Render, or Azure
- **Database**: Already on Supabase (PostgreSQL)

---

## 📦 Step 1: Seed the Database

Before deploying, run the seed data SQL to populate test data:

1. Go to your Supabase dashboard: https://app.supabase.com
2. Click on your project → **SQL Editor**
3. Copy and paste the contents of `scripts/seed_demo_data.sql`
4. Click **Run**

This will add:

- Sample transactions (10 transactions with various types)
- Fraud events for flagged transactions
- Update wallet balance to 12,450.75 KES

---

## 🌐 Step 2: Deploy Frontend to Vercel

### Option A: Using Vercel CLI

```bash
# Install Vercel CLI if not installed
npm install -g vercel

# From the project root, deploy
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - Project name: sentinelpay
# - In which directory is your code located? ./
# - Override settings? N
```

### Option B: Using Vercel Dashboard

1. Go to https://vercel.com
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variable:
   ```
   VITE_API_URL=https://your-backend-url.railway.app/api
   ```
6. Click **Deploy**

### Update Frontend for Production

Before deploying, update `src/services/api.ts`:

```typescript
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ... rest of the file
```

---

## 🚀 Step 3: Deploy Backend to Railway

Railway is the easiest option for .NET APIs.

### 3.1 Prepare for Deployment

Create a `Dockerfile` in the project root:

```dockerfile
# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy solution and project files
COPY FalconPay.FraudShield.sln .
COPY src/Domain/FalconPay.FraudShield.Domain.csproj src/Domain/
COPY src/Shared/FalconPay.FraudShield.Shared.csproj src/Shared/
COPY src/Infrastructure/FalconPay.FraudShield.Infrastructure.csproj src/Infrastructure/
COPY src/Application/FalconPay.FraudShield.Application.csproj src/Application/
COPY src/Workers/FalconPay.FraudShield.Workers.csproj src/Workers/
COPY src/API/FalconPay.FraudShield.API.csproj src/API/

# Restore dependencies
RUN dotnet restore

# Copy everything else and build
COPY . .
WORKDIR /src/src/API
RUN dotnet publish -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .

# Expose port
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "FalconPay.FraudShield.API.dll"]
```

### 3.2 Deploy to Railway

1. Go to https://railway.app
2. Sign in with GitHub
3. Click **New Project** → **Deploy from GitHub repo**
4. Select your repository
5. Railway will detect the Dockerfile automatically
6. Add Environment Variables:

   ```
   ConnectionStrings__DefaultConnection=Host=aws-1-eu-central-2.pooler.supabase.com;Port=5432;Database=postgres;Username=postgres.umlixdjprrfalzotmhkr;Password=YOUR_PASSWORD;SSL Mode=Require;Trust Server Certificate=true

   Jwt__Secret=your-super-secret-jwt-key-that-is-at-least-32-characters-long
   Jwt__Issuer=FalconPay.FraudShield
   Jwt__Audience=FalconPay.FraudShield.Users
   Jwt__ExpirationMinutes=60

   ASPNETCORE_ENVIRONMENT=Production
   ```

7. Click **Deploy**

### 3.3 Get Your Backend URL

After deployment, Railway will give you a URL like:
`https://sentinelpay-api-production.up.railway.app`

Use this URL in your frontend's `VITE_API_URL` environment variable.

---

## 🔄 Alternative: Deploy Backend to Render

### 3.1 Create render.yaml

```yaml
services:
  - type: web
    name: sentinelpay-api
    env: docker
    dockerfilePath: ./Dockerfile
    envVars:
      - key: ConnectionStrings__DefaultConnection
        sync: false
      - key: Jwt__Secret
        sync: false
      - key: ASPNETCORE_ENVIRONMENT
        value: Production
```

### 3.2 Deploy

1. Go to https://render.com
2. New → Web Service
3. Connect your GitHub repo
4. Select Docker as the environment
5. Add environment variables
6. Deploy

---

## 📋 Step 4: Verify Deployment

### Test Backend API

```bash
# Health check (if implemented)
curl https://your-api.railway.app/api/health

# Test login
curl -X POST https://your-api.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@sentinelpay.io","password":"password123"}'
```

### Test Frontend

1. Visit your Vercel URL
2. Log in with demo@sentinelpay.io / password123
3. Check that:
   - Dashboard loads with balance
   - Wallet shows transactions
   - Fraud page shows risk score
   - All CRUD operations work

---

## 📖 Swagger Documentation

Swagger is only available in Development mode by default. To enable it in production:

### Option 1: Enable Swagger in Production (Not Recommended for Public APIs)

Edit `src/API/Program.cs`:

```csharp
// Change this:
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// To this (for public swagger):
app.UseSwagger();
app.UseSwaggerUI();
```

### Option 2: Create Separate Swagger Documentation Site

1. Export OpenAPI spec:

   ```bash
   cd src/API
   dotnet run &
   curl http://localhost:5000/swagger/v1/swagger.json > openapi.json
   ```

2. Use https://editor.swagger.io or host with ReDoc on a static site

### Option 3: Use SwaggerHub

1. Export your OpenAPI spec
2. Upload to https://app.swaggerhub.com
3. Get a public documentation URL

---

## 🔒 Security Checklist

Before going live:

- [ ] Change JWT secret to a strong, unique value
- [ ] Update database password
- [ ] Enable HTTPS only (Railway/Vercel handle this automatically)
- [ ] Set up rate limiting
- [ ] Configure CORS for your frontend domain only
- [ ] Review and restrict API access where needed

---

## 🌍 Environment Variables Summary

### Backend (Railway/Render)

```
ConnectionStrings__DefaultConnection=<supabase-connection-string>
Jwt__Secret=<32+-character-secret>
Jwt__Issuer=FalconPay.FraudShield
Jwt__Audience=FalconPay.FraudShield.Users
Jwt__ExpirationMinutes=60
ASPNETCORE_ENVIRONMENT=Production
```

### Frontend (Vercel)

```
VITE_API_URL=https://your-backend-url/api
```

---

## 📞 Support

If you encounter issues:

1. Check Railway/Render logs for backend errors
2. Check browser console for frontend errors
3. Verify environment variables are set correctly
4. Ensure Supabase is accessible from your deployment region

---

## 🎉 You're Live!

Once deployed, your application stack will be:

```
┌─────────────────────────────────────────┐
│           Vercel (Frontend)              │
│       https://sentinelpay.vercel.app    │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│         Railway (Backend API)            │
│   https://sentinelpay-api.railway.app   │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│         Supabase (Database)              │
│    PostgreSQL with Row Level Security   │
└─────────────────────────────────────────┘
```
