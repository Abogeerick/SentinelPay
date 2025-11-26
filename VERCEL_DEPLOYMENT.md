# Vercel Frontend Deployment Guide

## Quick Setup

Your backend is live at: **https://sentinelpay.onrender.com**

### Step 1: Deploy to Vercel

1. Go to https://vercel.com
2. Click **Add New** → **Project**
3. Import your GitHub repository (`Abogeerick/SentinelPay`)
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave empty)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Step 2: Add Environment Variable

In Vercel's project settings, add:

**Variable Name**: `VITE_API_URL`  
**Value**: `https://sentinelpay.onrender.com/api`

### Step 3: Deploy

Click **Deploy** and wait for the build to complete.

---

## Environment Variables

The frontend will automatically use:
- **Production**: `https://sentinelpay.onrender.com/api` (from Vercel env var)
- **Local Development**: `http://localhost:5000/api` (default fallback)

---

## Testing

After deployment:

1. Visit your Vercel URL (e.g., `https://sentinelpay.vercel.app`)
2. Log in with: `demo@sentinelpay.io` / `password123`
3. Verify all features work:
   - Dashboard loads balance
   - Wallet shows transactions
   - Fraud detection works
   - All CRUD operations function

---

## Notes

- The `.env.production` file is already configured for production builds
- For local development, the API defaults to `http://localhost:5000/api`
- Make sure your backend is running locally when developing

