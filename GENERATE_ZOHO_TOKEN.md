# Generate Zoho OAuth Token - Quick Guide

## 🚀 Quick Start (3 Steps)

Your Zoho credentials are already configured. Follow these steps to generate your OAuth token:

---

## Step 1: Open Token Generator

Open the token generator in your browser:

```
http://localhost:5174/generate-oauth-token.html
```

Or double-click the file: `generate-oauth-token.html`

---

## Step 2: Get Authorization Code

1. Click **"Open Zoho Authorization Page"** button
2. Log in to your Zoho account
3. Click **"Accept"** to authorize the app
4. You'll be redirected to a page showing your authorization code
5. **Copy the code** (it will auto-copy to clipboard)
6. Go back to the token generator and **paste the code**
7. Click **"Exchange Code for Token"**

---

## Step 3: Update .env File

The token generator will show:
- ✅ Access Token
- ✅ Refresh Token
- ✅ Ready-to-paste .env configuration

Click **"Copy to Clipboard"** and paste into your `.env` file.

Your `.env` file should look like:

```env
# Zoho OAuth Configuration
VITE_ZOHO_BASE_URL=https://www.zohoapis.com
VITE_ZOHO_ACCOUNT_OWNER=hsbvnu
VITE_ZOHO_APP_LINK_NAME=hsbvnu

# OAuth Tokens
VITE_ZOHO_OAUTH_TOKEN=1000.xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_ZOHO_REFRESH_TOKEN=1000.xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_ZOHO_CLIENT_ID=YOUR_ZOHO_CLIENT_ID
VITE_ZOHO_CLIENT_SECRET=YOUR_ZOHO_CLIENT_SECRET
```

**Done!** Restart your dev server and test the account management.

---

## 🔧 Testing

After updating `.env`, test the bulk read API:

```bash
# Restart dev server
# Ctrl+C to stop
npm run dev
```

Then:
1. Go to Account Management tab
2. Click "Load from Zoho"
3. Select "Students" or "Lecturers"
4. Watch the progress as it fetches data

---

## ⚠️ Important Notes

### Token Expiration
- **Access Token**: Expires after 1 hour
- **Refresh Token**: Valid indefinitely (use to get new access tokens)

### When Access Token Expires:
You'll see error: `"Failed to initialize bulk read"`

**Solution:** Use the refresh token to get a new access token:

```bash
curl -X POST https://accounts.zoho.com/oauth/v2/token \
  -d "refresh_token=YOUR_REFRESH_TOKEN" \
  -d "client_id=YOUR_ZOHO_CLIENT_ID" \
  -d "client_secret=YOUR_ZOHO_CLIENT_SECRET" \
  -d "grant_type=refresh_token"
```

Or re-run the token generator.

---

## 📋 Your Credentials

**Client ID:**
```
YOUR_ZOHO_CLIENT_ID
```

**Client Secret:**
```
YOUR_ZOHO_CLIENT_SECRET
```

**Redirect URI:**
```
http://localhost:5173/oauth-callback
```

**Scopes:**
```
ZohoCreator.bulk.READ,ZohoCreator.report.READ
```

---

## 🐛 Troubleshooting

### Error: "Redirect URI mismatch"
**Solution:** Add `http://localhost:5173/oauth-callback` to your Zoho API Console → Client Details → Authorized Redirect URIs

### Error: "Invalid client"
**Solution:** Verify your Client ID and Client Secret are correct

### Error: "Scope not authorized"
**Solution:** Ensure your Zoho account has Creator permissions and the scopes are enabled in API Console

### Token generator won't open
**Solution:**
- Make sure dev server is running: `npm run dev`
- Try opening directly: `file:///path/to/generate-oauth-token.html`

---

## 🎯 Quick Commands

```bash
# Start dev server
npm run dev

# Generate token
# Open: http://localhost:5174/generate-oauth-token.html

# Test bulk read in browser console
const { bulkReadUsers } = await import('./src/zoho/zoho-api.ts');
const users = await bulkReadUsers('All_Students_Report', console.log);
console.log('Fetched', users.length, 'users');
```

---

## 📚 Related Files

- `generate-oauth-token.html` - Token generator tool
- `public/oauth-callback.html` - OAuth redirect handler
- `.env.example` - Environment variable template
- `ZOHO_BULK_READ_SETUP.md` - Detailed setup guide
- `src/zoho/zoho-api.ts` - API implementation

---

## ✅ Success Criteria

You'll know it's working when:
- ✅ Token generator shows "Success! OAuth tokens generated"
- ✅ `.env` file contains `VITE_ZOHO_OAUTH_TOKEN` and `VITE_ZOHO_REFRESH_TOKEN`
- ✅ Account Management loads data from Zoho without errors
- ✅ Console shows: "Fetched X records" with actual data

---

Ready to generate your token? Open `generate-oauth-token.html` and follow the steps! 🚀
