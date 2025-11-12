# 🔒 Security Fix: Exposed OAuth Credentials

## ✅ What Has Been Done

1. **Removed credentials from all current files**:
   - `.env.example`
   - `QUICK_START_OAUTH.md`
   - `VERCEL_OAUTH_SETUP.md`
   - `GENERATE_ZOHO_TOKEN.md`
   - `generate-oauth-token.html`
   - `generate-oauth-token-vercel.html`

2. **Committed changes and pushed to GitHub**

## ⚠️ CRITICAL: What You MUST Do Immediately

### Step 1: Invalidate Exposed Credentials (DO THIS NOW!)

1. Go to [Zoho API Console](https://api-console.zoho.com/)
2. Find client ID: `1000.RJQQGXZ5O9YWORFH1JUF4J616S1T4W`
3. **DELETE this client** or **Regenerate Client Secret**

**WHY:** The old credentials are still in GitHub's commit history and may be cached. Anyone who saw the repository before the fix could have copied them.

---

### Step 2: Remove Credentials from Git History

The exposed credentials still exist in old commits. Choose ONE of these methods:

#### Method A: Automated Script (Recommended)

Run the PowerShell script:

```powershell
cd C:\Users\Lenovo\Documents\hsb-react-starter
powershell -ExecutionPolicy Bypass -File remove-credentials-history.ps1
```

This will:
- Install `git-filter-repo` (requires Python)
- Remove credentials from ALL commits
- Force push cleaned history to GitHub

---

#### Method B: Manual (If Python Not Available)

1. **Install Python** (if not installed):
   - Download from [python.org](https://www.python.org/downloads/)
   - Install with "Add Python to PATH" checked

2. **Install git-filter-repo**:
   ```bash
   pip install git-filter-repo
   ```

3. **Create replacements file** `replacements.txt`:
   ```
   1000.RJQQGXZ5O9YWORFH1JUF4J616S1T4W==>YOUR_ZOHO_CLIENT_ID
   6b8d93c6733bcfa07327353341b038d70f7d97cdfe==>YOUR_ZOHO_CLIENT_SECRET
   ```

4. **Run git-filter-repo**:
   ```bash
   cd C:\Users\Lenovo\Documents\hsb-react-starter
   git filter-repo --replace-text replacements.txt --force
   ```

5. **Force push to GitHub**:
   ```bash
   git push origin --force --all
   git push origin --force --tags
   ```

---

#### Method C: Nuclear Option (Easiest, but loses history)

If the above methods don't work:

1. **Delete the GitHub repository** (or make it private temporarily)

2. **Remove git history locally**:
   ```bash
   cd C:\Users\Lenovo\Documents\hsb-react-starter
   rm -rf .git
   ```

3. **Reinitialize**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit with credentials removed"
   ```

4. **Create new GitHub repository** and push:
   ```bash
   git remote add origin https://github.com/tuanha-rgb/hsb-erp-new.git
   git branch -M master
   git push -u origin master
   ```

---

### Step 3: Generate New OAuth Credentials

After invalidating old credentials:

1. **Create new OAuth client** in [Zoho API Console](https://api-console.zoho.com/):
   - Client Name: `HSB-ERP-OAuth`
   - Homepage URL: `http://localhost:5173`
   - Authorized Redirect URIs:
     - `http://localhost:5173/oauth-callback`
     - `https://your-vercel-url.vercel.app/api/oauth-callback`
   - Scopes: `ZohoCreator.bulk.READ,ZohoCreator.report.READ`

2. **Copy new credentials**:
   - Client ID: `1000.XXXXXXXXXX`
   - Client Secret: `XXXXXXXXXX`

3. **Update all files** with new credentials:
   ```bash
   # Search and replace in files
   # OLD: YOUR_ZOHO_CLIENT_ID
   # NEW: <new client ID>

   # OLD: YOUR_ZOHO_CLIENT_SECRET
   # NEW: <new client secret>
   ```

4. **Update `.env` file**:
   ```env
   VITE_ZOHO_CLIENT_ID=<new client ID>
   VITE_ZOHO_CLIENT_SECRET=<new client secret>
   ```

5. **Generate new OAuth tokens** using `generate-oauth-token-vercel.html`

---

### Step 4: Update .gitignore (Prevent Future Exposures)

Add to `.gitignore` (already there, but verify):

```
# Environment variables
.env
.env.local
.env.production

# Credentials
credentials-to-remove.txt
replacements.txt
```

---

## 🔍 How to Verify

After completing all steps:

1. **Check GitHub commits**:
   - Browse your repository on GitHub
   - Check old commits - should NOT see exposed credentials
   - If you still see them, the history wasn't cleaned properly

2. **Verify new credentials work**:
   ```bash
   npm run dev
   ```
   - Go to Account Management
   - Try loading from Zoho
   - Should work with new credentials

---

## 📋 Checklist

- [ ] Step 1: Invalidated old OAuth client in Zoho ⚠️ CRITICAL
- [ ] Step 2: Removed credentials from git history
- [ ] Step 3: Generated new OAuth credentials
- [ ] Step 3: Updated all files with new credentials
- [ ] Step 3: Generated new OAuth tokens
- [ ] Step 4: Verified .gitignore includes .env files
- [ ] Verified: No credentials visible in GitHub commit history
- [ ] Tested: New credentials work in application

---

## 🚨 If Someone Already Saw the Credentials

If you're concerned someone may have accessed your Zoho account:

1. **Check Zoho audit logs**:
   - Go to Zoho Admin Panel
   - Check recent API calls
   - Look for suspicious activity

2. **Rotate all access**:
   - Change Zoho account password
   - Review all OAuth clients
   - Check Creator app permissions

3. **Monitor for unusual activity**:
   - Watch for unexpected API calls
   - Check Creator app logs
   - Review data access patterns

---

## 📚 Prevention Tips

1. **Never commit credentials**:
   - Always use `.env` files
   - Always add `.env` to `.gitignore`
   - Use environment variables in CI/CD

2. **Use secrets management**:
   - For production: Use Vercel Environment Variables
   - For local: Use `.env.local` (gitignored)

3. **Rotate credentials regularly**:
   - OAuth tokens every 90 days
   - Client secrets every 6 months

4. **Use secret scanning**:
   - Enable GitHub secret scanning (free for public repos)
   - Use tools like `git-secrets` or `trufflehog`

---

## 🆘 Need Help?

If you encounter issues:

1. **GitHub Support**: Contact if credentials are still visible after cleaning
2. **Zoho Support**: Contact if you suspect unauthorized access
3. **Git Issues**: Check [git-filter-repo docs](https://github.com/newren/git-filter-repo/)

---

**Status**: Credentials removed from current files ✅
**Action Required**: Follow steps above to clean history and regenerate credentials ⚠️
