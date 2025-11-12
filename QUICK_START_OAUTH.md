# 🚀 Quick Start: Zoho OAuth with Vercel

## What You Need

Your Zoho credentials:
- Client ID: `YOUR_ZOHO_CLIENT_ID`
- Client Secret: `YOUR_ZOHO_CLIENT_SECRET`

---

## Step-by-Step (10 minutes)

### 1️⃣ Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel
```

**Copy your Vercel URL:** `https://your-project-xxxxx.vercel.app`

---

### 2️⃣ Add Redirect URI to Zoho

1. Go to [api-console.zoho.com](https://api-console.zoho.com/)
2. Open your Zoho OAuth client
3. Add redirect URI: `https://your-vercel-url.vercel.app/api/oauth-callback`
4. Click "Update"

---

### 3️⃣ Generate Tokens

Open: `generate-oauth-token-vercel.html` (double-click the file)

1. Enter your Vercel URL
2. Click "Open Zoho Authorization Page"
3. Login and accept
4. Copy the authorization code
5. Paste and click "Exchange Code for Token"
6. Copy the `.env` configuration

---

### 4️⃣ Update .env File

Paste the generated config into `.env`:

```env
VITE_ZOHO_OAUTH_TOKEN=1000.xxxxxxxx...
VITE_ZOHO_REFRESH_TOKEN=1000.xxxxxxxx...
```

**Restart dev server:**
```bash
npm run dev
```

---

## ✅ Test It

1. Go to **Account Management** tab
2. Click **"Load from Zoho"**
3. Select **"Students"** or **"Lecturers"**
4. Should see: "Initializing bulk read..." → "Complete!"

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Redirect URI mismatch" | Check URI in Zoho matches Vercel URL exactly |
| "vercel: command not found" | Run: `npm install -g vercel` |
| Token expired | Use refresh token or re-run token generator |
| No data loading | Check browser console for errors |

---

## 📚 Detailed Guides

- **`VERCEL_OAUTH_SETUP.md`** - Complete Vercel setup guide
- **`ZOHO_BULK_READ_SETUP.md`** - API technical documentation
- **`GENERATE_ZOHO_TOKEN.md`** - Token generation guide

---

## 🔄 Token Refresh (when expired)

```bash
curl -X POST https://accounts.zoho.com/oauth/v2/token \
  -d "refresh_token=YOUR_REFRESH_TOKEN" \
  -d "client_id=YOUR_ZOHO_CLIENT_ID" \
  -d "client_secret=YOUR_ZOHO_CLIENT_SECRET" \
  -d "grant_type=refresh_token"
```

---

**That's it!** You're ready to use Zoho Bulk Read API 🎉
