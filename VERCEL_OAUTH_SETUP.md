# Zoho OAuth with Vercel - Complete Setup Guide

## Why Vercel?

Using Vercel for the OAuth callback solves several problems:
- ✅ **HTTPS URL** - Zoho requires HTTPS for production OAuth
- ✅ **No localhost issues** - Works from any device
- ✅ **Free hosting** - Vercel offers free serverless functions
- ✅ **Simple deployment** - One command to deploy
- ✅ **Persistent URL** - Same URL across deployments

---

## 🚀 Quick Start (4 Steps)

### Step 1: Deploy to Vercel (5 minutes)

#### Option A: Using Vercel CLI (Recommended)

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel (opens browser)
vercel login

# Deploy the project
cd C:\Users\Lenovo\Documents\hsb-react-starter
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? hsb-erp (or your choice)
# - Which directory? ./ (default)
# - Override settings? No
```

**Your Vercel URL:** The CLI will show: `https://hsb-erp-xxxxx.vercel.app`

#### Option B: Using Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Sign up/login with GitHub
3. Click "Add New" → "Project"
4. Import your GitHub repository
5. Deploy!

---

### Step 2: Add Redirect URI to Zoho API Console

1. Go to [Zoho API Console](https://api-console.zoho.com/)
2. Find your Zoho OAuth client
3. Click on the client to edit
4. Scroll to **"Authorized Redirect URIs"**
5. Add: `https://YOUR-VERCEL-URL.vercel.app/api/oauth-callback`
   - Example: `https://hsb-erp-abc123.vercel.app/api/oauth-callback`
6. Click **"Update"**

---

### Step 3: Generate OAuth Token

Open the token generator:

```
file:///C:/Users/Lenovo/Documents/hsb-react-starter/generate-oauth-token-vercel.html
```

Or double-click: `generate-oauth-token-vercel.html`

**Follow the wizard:**
1. Enter your Vercel URL: `https://YOUR-URL.vercel.app`
2. Click "Open Zoho Authorization Page"
3. Login to Zoho and click "Accept"
4. Copy the authorization code from Vercel's callback page
5. Paste code and click "Exchange Code for Token"
6. Copy the generated `.env` variables

---

### Step 4: Update .env File

Add the generated tokens to your `.env` file:

```env
# Zoho OAuth Configuration
VITE_ZOHO_BASE_URL=https://www.zohoapis.com
VITE_ZOHO_ACCOUNT_OWNER=hsbvnu
VITE_ZOHO_APP_LINK_NAME=hsbvnu

# OAuth Credentials
VITE_ZOHO_CLIENT_ID=YOUR_ZOHO_CLIENT_ID
VITE_ZOHO_CLIENT_SECRET=YOUR_ZOHO_CLIENT_SECRET

# OAuth Tokens
VITE_ZOHO_OAUTH_TOKEN=1000.xxxxxxxxxxxxxxxxxxxxxxxx
VITE_ZOHO_REFRESH_TOKEN=1000.xxxxxxxxxxxxxxxxxxxxxxxx

# Vercel Redirect URI
VITE_ZOHO_REDIRECT_URI=https://YOUR-URL.vercel.app/api/oauth-callback
```

**Restart your dev server:**
```bash
# Stop (Ctrl+C) and restart
npm run dev
```

---

## 📁 Files Created

- ✅ `api/oauth-callback.js` - Vercel serverless function for OAuth callback
- ✅ `vercel.json` - Vercel configuration
- ✅ `generate-oauth-token-vercel.html` - Token generator (uses Vercel)
- ✅ `.vercelignore` - Files to exclude from deployment

---

## 🔧 Vercel Deployment Details

### What Gets Deployed?

The `api/oauth-callback.js` file is deployed as a serverless function at:
```
https://YOUR-URL.vercel.app/api/oauth-callback
```

### How It Works

1. **User clicks authorize** → Redirected to Zoho
2. **User accepts** → Zoho redirects to Vercel with code
3. **Vercel function receives code** → Shows it to user
4. **User copies code** → Pastes in token generator
5. **Token generator exchanges code** → Gets access & refresh tokens

### Vercel Function Endpoint

Your callback URL will be:
```
https://[your-project-name]-[random-id].vercel.app/api/oauth-callback
```

Example:
```
https://hsb-erp-abc123xyz.vercel.app/api/oauth-callback
```

---

## 🐛 Troubleshooting

### Error: "Redirect URI mismatch"

**Problem:** The redirect URI in Zoho doesn't match your Vercel URL

**Solution:**
1. Go to Zoho API Console
2. Edit your client
3. Add exact Vercel URL: `https://your-url.vercel.app/api/oauth-callback`
4. Make sure there are no typos or trailing slashes

### Error: "vercel: command not found"

**Solution:**
```bash
npm install -g vercel
```

### Error: "Failed to deploy"

**Solution:**
- Check that `api/oauth-callback.js` exists
- Check that `vercel.json` is valid JSON
- Try: `vercel --debug` for detailed logs

### Vercel URL not working

**Solution:**
- Wait 30 seconds after deployment
- Try: `vercel --prod` to deploy to production
- Check: `vercel ls` to see your deployments

---

## 🔄 Token Refresh

Access tokens expire after 1 hour. To get a new one:

### Option A: Use Refresh Token (Recommended)

```bash
curl -X POST https://accounts.zoho.com/oauth/v2/token \
  -d "refresh_token=YOUR_REFRESH_TOKEN" \
  -d "client_id=YOUR_ZOHO_CLIENT_ID" \
  -d "client_secret=YOUR_ZOHO_CLIENT_SECRET" \
  -d "grant_type=refresh_token"
```

### Option B: Re-run Token Generator

Just run through the authorization flow again.

---

## 📊 Vercel Dashboard

After deployment, you can:
- View logs: `vercel logs`
- Check deployments: `vercel ls`
- Open in browser: `vercel --open`
- Redeploy: `vercel --prod`

---

## 🔒 Security Notes

### Keep Secret:
- ❌ Don't commit `.env` to Git
- ❌ Don't share your OAuth tokens
- ❌ Don't expose client secret in frontend code

### Safe:
- ✅ Vercel functions are server-side (secure)
- ✅ OAuth flow follows industry standards
- ✅ Tokens are encrypted in transit (HTTPS)

---

## 🚀 Production Deployment

For production, you should:

1. **Use environment variables in Vercel:**
   ```bash
   vercel env add ZOHO_CLIENT_ID
   vercel env add ZOHO_CLIENT_SECRET
   ```

2. **Implement token refresh:**
   - Store refresh token securely
   - Auto-refresh access token when expired
   - See: `src/zoho/zoho-api.ts` for implementation

3. **Add error handling:**
   - Handle network errors
   - Handle token expiration
   - Log errors for monitoring

---

## 📝 Quick Commands

```bash
# Deploy to Vercel
vercel

# Deploy to production
vercel --prod

# View logs
vercel logs

# List deployments
vercel ls

# Remove deployment
vercel rm [deployment-url]

# Open in browser
vercel --open
```

---

## ✅ Success Checklist

- [ ] Vercel CLI installed
- [ ] Project deployed to Vercel
- [ ] Vercel URL added to Zoho API Console
- [ ] OAuth token generated successfully
- [ ] Tokens added to `.env` file
- [ ] Dev server restarted
- [ ] Account Management loads data from Zoho

---

## 🎯 Next Steps

After setup:
1. Test bulk read API in Account Management tab
2. Implement token refresh for production
3. Add error handling for token expiration
4. Monitor API usage in Zoho console

---

## 📞 Support

### Vercel Issues:
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Discord](https://vercel.com/discord)

### Zoho OAuth Issues:
- [Zoho OAuth Guide](https://www.zoho.com/creator/help/api/v2/oauth-overview.html)
- Check browser console for errors

---

**Ready to deploy?** Run `vercel` in your project directory! 🚀
