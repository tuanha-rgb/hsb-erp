# Troubleshooting Attendance Webhook (Records Stopped at 9:32)

## Quick Checks

### 1. Check Firebase Functions Logs

```bash
# View recent logs
firebase functions:log --only ansvisWebhook

# Or in Firebase Console:
# https://console.firebase.google.com/project/hsb-library/functions/logs
```

Look for:
- ❌ Errors after 9:32
- ⚠️ "No student ID" messages
- ⚠️ "Skipping invalid student ID" messages
- ✅ Last successful webhook timestamp

### 2. Test Webhook Manually

```bash
# Test with curl
curl -X POST https://us-central1-hsb-library.cloudfunctions.net/ansvisWebhook \
  -H "Content-Type: application/json" \
  -d '{
    "camera_id": "CAM-001",
    "timestamp": "2025-01-12T10:30:00Z",
    "Detections": [{
      "DetectionData": [{
        "UserInfo": {
          "UserID": "TEST_STUDENT_001"
        },
        "Detections": [{
          "Score": 0.95,
          "BoundingBox": {
            "Left": 100,
            "Top": 100,
            "Right": 300,
            "Bottom": 300
          }
        }]
      }]
    }],
    "session_info": {
      "course_id": "CS101",
      "room": "A201"
    }
  }'
```

Expected response:
```json
{
  "success": true,
  "processed": 1,
  "camera": "CAM-001",
  "task": "unknown_task"
}
```

### 3. Check Camera Status

Verify cameras are sending webhooks:
1. Log into each ANSVIS camera web interface
2. Go to **Event Settings** or **Webhook Configuration**
3. Check:
   - ✅ Webhook URL is correct
   - ✅ Webhook is enabled
   - ✅ Event type is set (e.g., "Face Detected")
   - ✅ Test button works (if available)

### 4. Check Camera Network

```bash
# From the camera network, test if function is reachable
curl -I https://us-central1-hsb-library.cloudfunctions.net/ansvisWebhook

# Should return: HTTP/2 405 (Method Not Allowed is OK - means endpoint is alive)
```

### 5. Check Firestore Records

In Firebase Console → Firestore:

```
attendance_records/
  └─ Filter by: timestamp > 9:32
```

If no records after 9:32:
- Webhook stopped receiving data
- Camera configuration issue
- Network issue

If records exist but UI doesn't show them:
- Frontend cache issue (refresh page)
- Date filter in AttendanceLive component

## Common Issues & Solutions

### Issue 1: Cameras Configured Incorrectly

**Problem:** Each camera needs to send unique `camera_id` in payload

**Solution:** Check camera webhook configuration
```
Camera 1: Should send "camera_id": "CAM-001"
Camera 2: Should send "camera_id": "CAM-002"
Camera 3: Should send "camera_id": "CAM-003"
```

### Issue 2: Function Quota Exceeded

**Problem:** Firebase free tier limits:
- 125K invocations/month
- 40K GB-seconds/month

**Check in Firebase Console:**
- Go to Functions → ansvisWebhook → Usage tab
- See if quota exceeded

**Solution:**
- Upgrade to Blaze plan (pay-as-you-go)
- Or reduce camera detection frequency

### Issue 3: Student ID Format Issues

**Problem:** Function line 131-141 skips faces with no/invalid student ID

**Check logs for:**
```
"Skipping face with no student ID"
"Skipping invalid student ID: ..."
```

**Solution:** Verify ANSVIS sends student ID in correct format:
- `UserInfo.UserID` (preferred)
- `UserInfo.UserName`
- `Name`
- `Class`

### Issue 4: Timestamp Issues

**Problem:** Records created but with wrong timestamp

**Check:** Line 59 in functions/src/index.ts
```typescript
const timestamp = new Date(payload.timestamp || payload.Time || Date.now());
```

**Solution:** Verify camera sends `timestamp` or `Time` field in ISO 8601 format:
```json
{
  "timestamp": "2025-01-12T10:30:00Z"
}
```

### Issue 5: Batch Commit Failure

**Problem:** Firestore batch limit is 500 operations

**Check logs for:**
```
"Error committing batch"
```

**Solution:** Already handled in code (lines 232-234), but check logs

### Issue 6: Network Timeout

**Problem:** Cameras lose connection to Firebase

**Check:**
- Camera network connectivity
- Firewall rules
- DNS resolution

**Test:**
```bash
# From camera network
ping google.com
nslookup us-central1-hsb-library.cloudfunctions.net
```

## Debugging Steps

### Step 1: Enable Detailed Logging

The function already logs everything. Check logs:

```bash
firebase functions:log --only ansvisWebhook --limit 50
```

### Step 2: Simulate Camera Webhook

Use the test curl command above to verify function works

### Step 3: Check Camera Logs

Each ANSVIS camera has internal logs. Check for:
- Webhook send attempts
- HTTP response codes
- Error messages

### Step 4: Verify Payload Format

Add temporary logging to see exact payload:
```typescript
// Already at line 44-46
console.log("=== RECEIVED PAYLOAD ===");
console.log(JSON.stringify(payload, null, 2));
console.log("========================");
```

### Step 5: Check Firebase Status

https://status.firebase.google.com/

Verify no outages at time of stoppage (9:32)

## Resolution Checklist

- [ ] Checked Firebase Functions logs for errors after 9:32
- [ ] Verified webhook URL in all 3 cameras
- [ ] Tested webhook manually with curl
- [ ] Confirmed cameras are online and detecting faces
- [ ] Checked Firestore for records after 9:32
- [ ] Verified no Firebase quota exceeded
- [ ] Confirmed network connectivity from cameras
- [ ] Checked camera internal logs
- [ ] Verified payload format matches expected structure
- [ ] Tested each camera individually

## What the Function Does

Line-by-line for webhook `https://us-central1-hsb-library.cloudfunctions.net/ansvisWebhook`:

1. **Line 40-46:** Logs entire payload for debugging
2. **Line 49-63:** Extracts camera_id, timestamp, task_id
3. **Line 66-99:** Parses detected faces from ANSVIS format
4. **Line 122-193:** Creates attendance record for each face
5. **Line 196-209:** Updates camera status in Firestore
6. **Line 212-230:** Updates session info
7. **Line 233:** Commits all changes to Firestore
8. **Line 237-249:** Returns success response

## Next Steps

1. **Immediate:** Check Firebase Functions logs
   ```bash
   firebase functions:log --only ansvisWebhook | grep -A 5 -B 5 "9:32"
   ```

2. **Test:** Send manual webhook (see test curl above)

3. **Verify:** Check camera configuration and logs

4. **Monitor:** Watch live logs while camera is active
   ```bash
   firebase functions:log --only ansvisWebhook --follow
   ```

## Get Help

If issue persists, provide:
1. Firebase Functions logs around 9:32
2. Screenshot of camera webhook configuration
3. Sample payload from camera (if available)
4. Camera model/firmware version
