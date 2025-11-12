# Zoho Bulk Read API Setup Guide

## Overview

The account management system now uses Zoho's **Bulk Read API** to fetch large datasets (students, lecturers) efficiently. This eliminates the need for a proxy server and calls Zoho APIs directly from the browser.

---

## Prerequisites

1. **Zoho OAuth Token**: Required for bulk read API authentication
2. **jszip package**: For extracting CSV files from ZIP responses (already added to package.json)

---

## Step 1: Get OAuth Token from Zoho

### Option A: Self-Client OAuth (Recommended for Testing)

1. Go to [Zoho API Console](https://api-console.zoho.com/)
2. Click "Add Client"
3. Select "Self Client"
4. Note down the **Client ID** and **Client Secret**
5. Generate OAuth token:

```bash
# Generate authorization code
https://accounts.zoho.com/oauth/v2/auth?response_type=code&client_id=YOUR_CLIENT_ID&scope=ZohoCreator.bulk.READ&redirect_uri=http://localhost&access_type=offline

# Exchange code for tokens
curl -X POST https://accounts.zoho.com/oauth/v2/token \
  -d "code=YOUR_AUTH_CODE" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "redirect_uri=http://localhost" \
  -d "grant_type=authorization_code"
```

### Option B: Server-Based OAuth (Production)

For production, implement proper OAuth flow with refresh tokens. See: [Zoho OAuth Documentation](https://www.zoho.com/creator/help/api/v2/oauth-overview.html)

---

## Step 2: Configure Environment Variables

Add to your `.env` file:

```env
# Zoho Configuration
VITE_ZOHO_BASE_URL=https://www.zohoapis.com
VITE_ZOHO_ACCOUNT_OWNER=hsbvnu
VITE_ZOHO_APP_LINK_NAME=hsbvnu

# OAuth Token (REQUIRED for bulk read)
VITE_ZOHO_OAUTH_TOKEN=1000.xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Legacy Public Keys (optional - for custom functions)
VITE_ZOHO_STUDENTS_PUBLIC_KEY=your_students_public_key_here
VITE_ZOHO_LECTURERS_PUBLIC_KEY=your_lecturers_public_key_here
```

**Important Notes:**
- Replace `VITE_ZOHO_OAUTH_TOKEN` with your actual OAuth token
- OAuth tokens expire (typically 1 hour) - you'll need to refresh them
- For production, implement automatic token refresh

---

## Step 3: Install Dependencies

```bash
npm install
```

This installs `jszip` (v3.10.1) for ZIP file handling.

---

## Step 4: Find Your Report Link Names

You need to know the **report link names** in your Zoho Creator app. These are the identifiers for your data tables.

### How to Find Report Link Names:

1. Go to your Zoho Creator app
2. Open a report (e.g., "All Students")
3. Look at the URL:
   ```
   https://creator.zoho.com/hsbvnu/hsbvnu/report-perma/All_Students_Report/xyz123/
                                                    ^^^^^^^^^^^^^^^^
                                                    This is the report link name
   ```

### Common Report Names:
- `All_Students_Report` - Students data
- `All_Lecturers_Report` - Lecturers data
- `Student_Profile` - Student profiles
- etc.

---

## Step 5: Update Account Management Component

The `AccountManagement.tsx` component has been updated to use the bulk read API. No changes needed unless you want to customize the report link names.

### Using Bulk Read in Your Code:

```typescript
import { bulkReadUsers } from '../zoho/zoho-api';

// Fetch students using bulk read
const students = await bulkReadUsers('All_Students_Report', (status) => {
  console.log(status); // Progress updates
});

console.log(`Fetched ${students.length} students`);
```

---

## API Functions Available

### 1. **bulkReadUsers** (Complete Workflow)
```typescript
const users = await bulkReadUsers(
  'All_Students_Report',
  (status) => console.log(status)
);
```

Automatically handles:
- Initializing bulk read job
- Polling status until complete
- Downloading and extracting ZIP
- Parsing CSV to JSON

### 2. **initBulkRead** (Manual Control - Step 1)
```typescript
const job = await initBulkRead('All_Students_Report');
console.log('Job ID:', job.job_id);
```

### 3. **checkBulkReadStatus** (Manual Control - Step 2)
```typescript
const status = await checkBulkReadStatus(jobId, 'All_Students_Report');
console.log('Status:', status.status); // PENDING, IN_PROGRESS, COMPLETED, FAILED
```

### 4. **downloadBulkReadResult** (Manual Control - Step 3)
```typescript
const result = await downloadBulkReadResult(jobId, 'All_Students_Report');
console.log('Records:', result.data);
```

---

## How It Works

### Workflow Diagram:

```
1. Initialize Bulk Read Job
   POST https://www.zohoapis.com/creator/v2.1/bulk/{owner}/{app}/report/{report}/read
   → Returns job_id

2. Poll Job Status (every 2 seconds)
   GET https://www.zohoapis.com/creator/v2.1/bulk/{owner}/{app}/report/{report}/read/{job_id}
   → Check status: PENDING → IN_PROGRESS → COMPLETED

3. Download Result (when COMPLETED)
   GET https://www.zohoapis.com/creator/v2.1/bulk/{owner}/{app}/report/{report}/read/{job_id}/result
   → Returns ZIP file containing CSV

4. Extract CSV from ZIP
   → Use jszip to unzip in browser

5. Parse CSV to JSON
   → Convert CSV rows to JavaScript objects
   → Return array of records
```

### Example Timeline:
```
00:00 - Initialize bulk read job
00:01 - Job status: PENDING
00:03 - Job status: IN_PROGRESS
00:05 - Job status: IN_PROGRESS
00:07 - Job status: COMPLETED
00:08 - Download ZIP file (2MB)
00:09 - Extract CSV (5MB uncompressed)
00:10 - Parse CSV (5000 records)
00:11 - Complete!
```

---

## Advantages Over Custom Functions

| Feature | Custom Functions | Bulk Read API |
|---------|------------------|---------------|
| **Max Records** | ~200 (limited) | 200,000+ |
| **Speed** | Slow for large datasets | Fast (async processing) |
| **Authentication** | Public Key | OAuth Token |
| **Timeout** | 30 seconds | Minutes (async) |
| **CORS** | May have issues | Proper CORS support |
| **Format** | JSON | CSV (more efficient) |

---

## Troubleshooting

### Error: "OAuth token not configured"
**Solution:** Add `VITE_ZOHO_OAUTH_TOKEN` to your `.env` file

### Error: "Failed to initialize bulk read"
**Possible causes:**
- Invalid OAuth token (expired?)
- Wrong report link name
- Missing permissions (need `ZohoCreator.bulk.READ` scope)

### Error: "No CSV file found in ZIP"
**Possible causes:**
- Report is empty
- Zoho returned malformed ZIP
- Network error during download

### Error: "Bulk read job did not complete in time"
**Solution:**
- Increase `maxAttempts` in `bulkReadUsers()` function
- Check Zoho Creator system status
- Report may have too many records

### CORS Errors
**Solution:**
- Bulk read API should have proper CORS headers
- If still having issues, check browser console
- Ensure you're using HTTPS (not HTTP)

---

## Testing

### Test 1: Check Configuration
```typescript
import { checkZohoConfig } from './zoho/zoho-api';

const config = checkZohoConfig();
if (!config.isValid) {
  console.error('Missing config:', config.errors);
}
```

### Test 2: Fetch Small Dataset
```typescript
import { bulkReadUsers } from './zoho/zoho-api';

try {
  const users = await bulkReadUsers('All_Students_Report', console.log);
  console.log('Success! Fetched', users.length, 'records');
} catch (error) {
  console.error('Failed:', error.message);
}
```

---

## Production Checklist

- [ ] Implement OAuth token refresh mechanism
- [ ] Store refresh token securely
- [ ] Add error handling for expired tokens
- [ ] Implement rate limiting
- [ ] Add caching for frequently accessed data
- [ ] Monitor API usage quota
- [ ] Set up error logging/monitoring
- [ ] Test with large datasets (10k+ records)

---

## OAuth Token Refresh (Production)

For production, implement automatic token refresh:

```typescript
let accessToken = import.meta.env.VITE_ZOHO_OAUTH_TOKEN;
let refreshToken = import.meta.env.VITE_ZOHO_REFRESH_TOKEN;

async function refreshAccessToken() {
  const response = await fetch('https://accounts.zoho.com/oauth/v2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: import.meta.env.VITE_ZOHO_CLIENT_ID,
      client_secret: import.meta.env.VITE_ZOHO_CLIENT_SECRET,
      grant_type: 'refresh_token'
    })
  });

  const data = await response.json();
  accessToken = data.access_token;

  // Update ZOHO_CONFIG.oauthToken with new token
  return accessToken;
}
```

---

## Next Steps

1. **Add OAuth Token** to `.env`
2. **Run:** `npm install`
3. **Test:** Open Account Management tab
4. **Click:** "Load from Zoho" button
5. **Verify:** Data loads successfully

---

## Support

For Zoho API issues:
- [Zoho Creator API Documentation](https://www.zoho.com/creator/help/api/v2/)
- [Zoho Developer Forums](https://help.zoho.com/portal/en/community)
- Check browser console for detailed error logs

For implementation issues:
- Check `src/zoho/zoho-api.ts` for implementation details
- Enable verbose logging with: `localStorage.setItem('ZOHO_DEBUG', 'true')`
