# FalconPay FraudShield API - Complete Endpoints Documentation

## 🔐 Authentication Endpoints

### POST `/api/auth/register`
Register a new user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "phone": "+254712345678"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "guid-refresh-token",
  "expiresAt": "2024-01-01T12:00:00Z",
  "user": {
    "id": "guid",
    "name": "John Doe",
    "email": "user@example.com",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=user@example.com",
    "phone": "+254712345678"
  }
}
```

### POST `/api/auth/login`
Login existing user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### POST `/api/auth/refresh-token`
Refresh access token.

**Request:**
```json
{
  "refreshToken": "guid-refresh-token"
}
```

### GET `/api/auth/me`
Get current authenticated user. Requires JWT.

---

## 💰 Wallet Endpoints (Requires JWT)

### GET `/api/wallet`
Get wallet details.

### GET `/api/wallet/balance`
Get wallet balance.

**Response:**
```json
{
  "balance": 12450.75,
  "currency": "KES"
}
```

### GET `/api/wallet/transactions`
Get transaction history.

**Response:**
```json
[
  {
    "id": "guid",
    "amount": -120.00,
    "recipient": "Store_ABC",
    "recipientName": "Main St Grocers",
    "date": "2023-10-25T14:30:00Z",
    "type": "payment",
    "status": "completed"
  }
]
```

### POST `/api/wallet/deposit`
Deposit money to wallet.

**Request:**
```json
{
  "amount": 1000.00,
  "description": "Deposit"
}
```

### POST `/api/wallet/withdraw`
Withdraw money from wallet.

**Request:**
```json
{
  "amount": 500.00,
  "description": "Withdrawal"
}
```

### POST `/api/wallet/transfer`
Transfer money to another user.

**Request:**
```json
{
  "amount": 500.00,
  "recipient": "recipient_id",
  "recipientName": "John Doe",
  "description": "Payment for services"
}
```

---

## 💳 Payment Endpoints (Requires JWT)

### POST `/api/payments/checkout`
Process a payment.

**Request:**
```json
{
  "amount": 1000.00,
  "recipient": "merchant_id",
  "recipientName": "Online Store",
  "description": "Purchase",
  "paymentMethod": "card"
}
```

### GET `/api/payments/history`
Get payment history.

### POST `/api/payments/mobile-money`
Process mobile money payment (M-Pesa, etc).

**Request:**
```json
{
  "amount": 500.00,
  "phoneNumber": "+254712345678",
  "provider": "mpesa",
  "description": "Mobile payment"
}
```

### POST `/api/payments/card-charge`
Process card payment.

**Request:**
```json
{
  "amount": 1000.00,
  "cardToken": "tok_xxxx",
  "description": "Card payment"
}
```

---

## 🛡️ Fraud Detection Endpoints (Requires JWT)

### GET `/api/fraud/alerts`
Get fraud alerts for current user.

**Response:**
```json
[
  {
    "id": "guid",
    "severity": "high",
    "message": "Large transaction detected in unusual location",
    "timestamp": "2023-10-26T10:00:00Z",
    "resolved": false
  }
]
```

### GET `/api/fraud/risk-score`
Get current risk score.

**Response:**
```json
{
  "score": 65,
  "level": "caution",
  "trend": "up"
}
```

### GET `/api/fraud/device`
Get device fingerprint info.

**Response:**
```json
{
  "deviceId": "abc123xyz",
  "model": "Windows / Chrome 120",
  "ip": "197.201.12.44",
  "risk": "medium"
}
```

### POST `/api/fraud/explain`
Get AI explanation of risk score.

**Response:**
```json
{
  "explanation": "Your current risk score is 65/100 (caution). Recent unusual transactions..."
}
```

### POST `/api/fraud/evaluate/{transactionId}`
Evaluate a specific transaction for fraud.

### GET `/api/fraud/events`
Get all fraud events.

### GET `/api/fraud/stats`
Get fraud statistics.

---

## 👨‍💼 Admin Endpoints (Requires JWT)

### GET `/api/admin/users`
Get all users.

### GET `/api/admin/transactions`
Get all transactions.

### GET `/api/admin/fraud-summary`
Get fraud summary statistics.

**Response:**
```json
{
  "totalTransactions": 1000,
  "flaggedTransactions": 50,
  "successfulTransactions": 900,
  "failedTransactions": 50,
  "totalVolume": 5000000.00,
  "flaggedVolume": 250000.00,
  "totalUsers": 100,
  "activeUsersToday": 25,
  "riskDistribution": [
    { "range": "0-20", "count": 500 },
    { "range": "21-40", "count": 300 },
    { "range": "41-60", "count": 150 },
    { "range": "61-80", "count": 40 },
    { "range": "81-100", "count": 10 }
  ]
}
```

### GET `/api/admin/dashboard`
Get dashboard statistics.

---

## 🔒 Fraud Detection Rules

The following rules are evaluated for each transaction:

1. **High Amount Spike** (+25 risk): Transaction >= 50,000
2. **Rapid Transactions** (+20 risk): 5+ transactions in 10 minutes
3. **IP Location Change** (+15 risk): Different IP from last login
4. **Device Mismatch** (+20 risk): Different device fingerprint
5. **Suspicious Hours** (+10 risk): Transactions between 1-4 AM
6. **New Account + Large Transaction** (+25 risk): Account < 7 days old + transaction >= 10,000
7. **First-time Large Transfer** (+10 risk): First transfer > 5,000 to new recipient

**Risk Levels:**
- 0-30: Safe
- 31-50: Caution
- 51-70: Flag for review
- 71+: Block transaction

---

## 🚀 Quick Start

1. Run the migration in Supabase SQL Editor:
```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS name VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar VARCHAR(500);
```

2. Start the backend:
```bash
cd src/API
dotnet run --urls "http://localhost:5000"
```

3. Start the frontend:
```bash
npm run dev
```

4. Open http://localhost:5173 (or your frontend URL)

5. Click "Login" - it will auto-register a demo user

---

## 📡 Frontend Integration

The frontend is configured to connect to `http://localhost:5000/api`. 

Key files updated:
- `src/services/api.ts` - Points to real backend
- `src/stores/authStore.ts` - Real authentication
- `src/stores/walletStore.ts` - Real wallet operations
- `src/stores/fraudStore.ts` - Real fraud detection

All mock data has been replaced with real API calls.

