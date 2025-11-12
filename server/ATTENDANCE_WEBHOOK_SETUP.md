# Attendance Webhook Server Setup

This server receives attendance detection events from ANSVIS AI cameras and writes them to Firebase.

## Prerequisites

1. **Firebase Service Account Key**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project (`hsb-library`)
   - Go to **Project Settings** → **Service Accounts**
   - Click **Generate New Private Key**
   - Save the JSON file as `server/firebase-service-account.json`
   - ⚠️ **NEVER commit this file to git** (it's in .gitignore)

2. **Node.js Dependencies**
   ```bash
   cd server
   npm install
   ```

## Running the Server

### Option 1: Attendance webhook only
```bash
cd server
npm run attendance
```
Server will run on: `http://localhost:3003`

### Option 2: Run all servers (SCImago + Attendance)
```bash
cd server
npm run dev
```

### Option 3: Production (using environment variable)
```bash
export FIREBASE_SERVICE_ACCOUNT='{ "type": "service_account", ... }'
export FIREBASE_PROJECT_ID=hsb-library
node attendance-webhook.js
```

## Webhook Configuration

### For Local Development (Testing)

If cameras are on the same network:
```
Webhook URL: http://YOUR_LOCAL_IP:3003/webhook/attendance
Example: http://192.168.1.100:3003/webhook/attendance
```

### For Production (Remote Cameras)

You need a public URL. Options:

1. **ngrok** (Quick testing)
   ```bash
   # Install ngrok: https://ngrok.com/
   ngrok http 3003

   # Use the HTTPS URL ngrok provides:
   # https://abc123.ngrok.io/webhook/attendance
   ```

2. **Deploy to Cloud**
   - Deploy `attendance-webhook.js` to:
     - Google Cloud Run
     - AWS Lambda + API Gateway
     - Heroku
     - Render.com
   - Use the deployed URL in camera config

## Camera Configuration

### ANSVIS AI Camera Settings

Configure each camera to send POST requests to your webhook URL:

```json
{
  "webhook_url": "http://YOUR_SERVER:3003/webhook/attendance",
  "auth_token": "optional_bearer_token",
  "events": ["face_detected"],
  "min_confidence": 0.75
}
```

### Expected Payload Format

The camera should send JSON in this format:

```json
{
  "task_id": "unique_task_id",
  "camera_id": "CAM-001",
  "timestamp": "2025-01-12T10:30:00Z",
  "detected_faces": [
    {
      "student_id": "SV001",
      "confidence": 0.95,
      "bbox": { "x": 100, "y": 100, "w": 200, "h": 200 }
    }
  ],
  "session_info": {
    "course_id": "CS101",
    "room": "A201",
    "start_time": "2025-01-12T10:00:00Z",
    "end_time": "2025-01-12T12:00:00Z"
  },
  "image_url": "https://example.com/snapshot.jpg",
  "video_url": "https://example.com/recording.mp4"
}
```

## Testing

### 1. Check Server Health
```bash
curl http://localhost:3003/health
```

### 2. Get Sample Payload
```bash
curl http://localhost:3003/webhook/test
```

### 3. Send Test Webhook
```bash
curl -X POST http://localhost:3003/webhook/attendance \
  -H "Content-Type: application/json" \
  -d '{
    "task_id": "TEST-001",
    "camera_id": "CAM-001",
    "timestamp": "2025-01-12T10:30:00Z",
    "detected_faces": [
      {
        "student_id": "SV001",
        "confidence": 0.95,
        "bbox": { "x": 100, "y": 100, "w": 200, "h": 200 }
      }
    ],
    "session_info": {
      "course_id": "CS101",
      "room": "A201",
      "start_time": "2025-01-12T10:00:00Z",
      "end_time": "2025-01-12T12:00:00Z"
    }
  }'
```

### 4. Verify in Firebase Console

- Go to Firestore console
- Check `attendance_records` collection for new documents
- Check `ai_cameras` collection for camera status updates

## Troubleshooting

### Error: "Firebase service account not found"
- Make sure `firebase-service-account.json` exists in `server/` directory
- Download from Firebase Console → Project Settings → Service Accounts

### Error: "ECONNREFUSED" from camera
- Check firewall rules (allow port 3003)
- Verify server is running: `curl http://localhost:3003/health`
- For remote cameras, use ngrok or deploy to cloud

### Low confidence detections not recorded
- By default, faces with confidence < 75% are skipped
- Adjust in `attendance-webhook.js` line 77:
  ```js
  if (face.confidence < 0.75) { // Change threshold here
  ```

### Data not appearing in frontend
- Check Firebase rules allow read/write to `attendance_records`
- Verify `subscribeToLiveAttendance` is using correct collection name
- Check browser console for errors

## Firestore Security Rules

Add these rules to allow the webhook server to write:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /attendance_records/{record} {
      allow read: if request.auth != null;
      allow write: if true; // Service account writes
    }

    match /ai_cameras/{camera} {
      allow read: if request.auth != null;
      allow write: if true; // Service account writes
    }
  }
}
```

## Production Deployment Checklist

- [ ] Firebase service account configured
- [ ] Server deployed to cloud platform
- [ ] HTTPS enabled (required for production)
- [ ] Firestore security rules configured
- [ ] All cameras configured with webhook URL
- [ ] Test webhook with each camera
- [ ] Monitor server logs for errors
- [ ] Set up error alerting (Sentry, Datadog, etc.)

## Architecture

```
ANSVIS Camera → Webhook (POST) → Express Server → Firebase Admin SDK → Firestore
                                                                            ↓
Frontend (React) ← Firebase Client SDK ← Real-time Listener ← Firestore
```

## Port Reference

- `3002` - SCImago/WOS proxy server
- `3003` - Attendance webhook server
- `5173` - Vite dev server (frontend)
