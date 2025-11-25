# SentinelPay — Real-Time Fraud Detection & Payments Gateway

<div align="center">
  <img width="1200" height="475" alt="SentinelPay Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

A modern fintech dashboard application built with React, TypeScript, and TailwindCSS. SentinelPay simulates a complete payment gateway with real-time fraud detection, risk scoring, and transaction analytics.

## 🚀 Features

- **Wallet Management**: View balance, transfer money, and track transactions
- **Payment Processing**: Simulated checkout with recipient and reason tracking
- **Fraud Detection**: Real-time risk scoring, security alerts, and device fingerprinting
- **Analytics Dashboard**: Spending vs income charts, transaction history, and activity trends
- **Mobile-First PWA**: Responsive design with bottom navigation on mobile, sidebar on desktop
- **Dark Mode**: Full theme support with smooth transitions
- **Mock Backend**: Complete API simulation for frontend-only development

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Routing**: React Router DOM (HashRouter)
- **Styling**: TailwindCSS
- **State Management**: Zustand
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Build Tool**: Vite

## 📁 Project Structure

```
src/
  ├── components/          # Reusable UI components
  │   ├── Button.tsx
  │   ├── Card.tsx
  │   ├── RiskGauge.tsx
  │   └── TransactionItem.tsx
  ├── pages/              # Page components
  │   ├── Dashboard.tsx
  │   ├── Wallet.tsx
  │   ├── Payments.tsx
  │   ├── Fraud.tsx
  │   ├── Settings.tsx
  │   └── Login.tsx
  ├── stores/             # Zustand state stores
  │   ├── authStore.ts
  │   ├── walletStore.ts
  │   ├── fraudStore.ts
  │   └── themeStore.ts
  ├── services/           # API service layer
  │   └── api.ts
  ├── mock/              # Mock data for API endpoints
  │   ├── auth.ts
  │   ├── wallet.ts
  │   ├── fraud.ts
  │   └── payments.ts
  ├── layout/            # Layout components
  │   └── AppLayout.tsx
  ├── types.ts           # TypeScript type definitions
  ├── App.tsx            # Main app component
  └── main.tsx           # Entry point
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd SentinelPay
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

## 📡 API Endpoints (Mocked)

All API endpoints are mocked using Axios interceptors. The following endpoints are available:

### Authentication
- `GET /auth/me` - Get current user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user

### Wallet
- `GET /wallet/balance` - Get wallet balance
- `GET /wallet/transactions` - Get transaction history
- `POST /wallet/transfer` - Transfer money

### Payments
- `POST /payments/checkout` - Process payment
- `GET /payments/history` - Get payment history

### Fraud Detection
- `GET /fraud/alerts` - Get security alerts
- `GET /fraud/risk-score` - Get current risk score
- `GET /fraud/device` - Get device fingerprint
- `POST /fraud/explain` - Get AI risk explanation

## 🎨 UI Features

- **Mobile-First Design**: Optimized for mobile devices with bottom navigation
- **Responsive Layout**: Sidebar navigation on desktop, bottom nav on mobile
- **Dark Mode**: Toggle between light and dark themes
- **Smooth Animations**: Fade-in and slide-up animations for better UX
- **Modern Fintech UI**: Clean design with soft shadows and rounded corners

## 📱 Pages

### Dashboard
- Wallet balance overview
- Fraud alerts widget
- Recent transactions
- Spending vs income charts (Recharts)
- Risk score gauge

### Wallet
- Balance display
- Transfer money form
- Transaction list
- Quick actions

### Payments
- Payment form (amount, recipient, reason)
- Payment confirmation modal
- Payment history display

### Fraud
- Fraud alerts list
- Risk heatmap chart
- Device fingerprint display
- AI risk explanation drawer

### Settings
- User profile
- Security settings
- Theme toggle
- Logout

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Configure build settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Deploy!

The app will be automatically deployed and available at a Vercel URL.

### Environment Variables

No environment variables are required. All API calls are mocked.

## 🔒 Security Note

This is a **frontend-only** application with mocked APIs. All authentication and API responses are simulated for demonstration purposes. In a production environment, you would need a real backend API.

## 📝 License

This project is for demonstration purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ using React, TypeScript, and TailwindCSS
