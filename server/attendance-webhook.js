// Attendance Webhook Server for ANSVIS AI Cameras
// Receives face detection events and writes to Firebase

const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

const app = express();
const PORT = 3003;

// Initialize Firebase Admin SDK
// Using service account credentials from environment variable or file
let serviceAccount;

try {
  // Try to load from environment variable first (for production)
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } else {
    // For development, use service account file
    serviceAccount = require('./firebase-service-account.json');
  }
} catch (error) {
  console.error('⚠️  Firebase service account not found. Please create firebase-service-account.json');
  console.error('   Download it from Firebase Console → Project Settings → Service Accounts');
}

if (serviceAccount) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID || 'hsb-library'
  });
  console.log('✅ Firebase Admin initialized');
} else {
  console.warn('⚠️  Running without Firebase - webhooks will be logged only');
}

const db = admin.firestore ? admin.firestore() : null;

app.use(cors());
app.use(express.json({ limit: '10mb' })); // Support larger payloads with images

/**
 * Webhook endpoint for ANSVIS AI Camera detections
 * POST /webhook/attendance
 *
 * Expected payload format:
 * {
 *   task_id: string,
 *   camera_id: string,
 *   timestamp: ISO8601 string,
 *   detected_faces: [
 *     {
 *       student_id: string,
 *       confidence: number (0-1),
 *       bbox: { x, y, w, h }
 *     }
 *   ],
 *   session_info: {
 *     course_id: string,
 *     room: string,
 *     start_time: ISO8601 string,
 *     end_time: ISO8601 string
 *   },
 *   image_url?: string,
 *   video_url?: string
 * }
 */
app.post('/webhook/attendance', async (req, res) => {
  const payload = req.body;

  try {
    console.log(`\n📸 Received attendance webhook from camera: ${payload.camera_id || 'unknown'}`);
    console.log(`   Task ID: ${payload.task_id}`);
    console.log(`   Timestamp: ${payload.timestamp}`);
    console.log(`   Detected faces: ${payload.detected_faces?.length || 0}`);

    // Validate payload
    if (!payload.camera_id || !payload.detected_faces || !payload.session_info) {
      console.error('❌ Invalid payload - missing required fields');
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: camera_id, detected_faces, or session_info'
      });
    }

    if (!db) {
      console.warn('⚠️  Firebase not initialized - logging only');
      console.log('Payload:', JSON.stringify(payload, null, 2));
      return res.json({
        success: true,
        message: 'Logged (no Firebase)',
        processed: 0
      });
    }

    const timestamp = new Date(payload.timestamp || new Date());
    const batch = db.batch();
    let processedCount = 0;

    // Process each detected face
    for (const face of payload.detected_faces) {
      // Skip low-confidence detections
      if (face.confidence < 0.75) {
        console.log(`   ⏭️  Skipped ${face.student_id} - low confidence (${(face.confidence * 100).toFixed(1)}%)`);
        continue;
      }

      const attendanceId = `ATT-${timestamp.getTime()}-${face.student_id}`;
      const attendanceRef = db.collection('attendance_records').doc(attendanceId);

      const record = {
        id: attendanceId,
        studentId: face.student_id,
        courseId: payload.session_info.course_id,
        date: admin.firestore.Timestamp.fromDate(timestamp),
        status: 'present',
        source: 'ai-camera',
        sessionType: 'lecture',
        timestamp: admin.firestore.Timestamp.fromDate(timestamp),
        cameraId: payload.camera_id,
        lecturerVerified: false,
        confidence: face.confidence,
        bbox: face.bbox,
        notes: `AI Detection - Confidence: ${(face.confidence * 100).toFixed(1)}%`,
        imageUrl: payload.image_url || null,
        videoUrl: payload.video_url || null,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };

      batch.set(attendanceRef, record);
      processedCount++;
      console.log(`   ✅ Queued ${face.student_id} (${(face.confidence * 100).toFixed(1)}% confidence)`);
    }

    // Update camera status
    const cameraRef = db.collection('ai_cameras').doc(payload.camera_id);
    const cameraDoc = await cameraRef.get();
    const currentSessions = cameraDoc.exists ? (cameraDoc.data().sessionsToday || 0) : 0;

    batch.set(cameraRef, {
      id: payload.camera_id,
      lastSync: admin.firestore.FieldValue.serverTimestamp(),
      sessionsToday: currentSessions + 1,
      status: 'online'
    }, { merge: true });

    // Commit batch write
    await batch.commit();

    console.log(`✅ Webhook processed successfully`);
    console.log(`   Records created: ${processedCount}`);
    console.log(`   Camera ${payload.camera_id} updated\n`);

    res.json({
      success: true,
      message: 'Attendance recorded',
      processed: processedCount,
      timestamp: timestamp.toISOString()
    });

  } catch (error) {
    console.error('❌ Error processing webhook:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Test endpoint - Generate a sample webhook payload
 * GET /webhook/test
 */
app.get('/webhook/test', (req, res) => {
  const samplePayload = {
    task_id: 'TEST-' + Date.now(),
    camera_id: 'CAM-001',
    timestamp: new Date().toISOString(),
    detected_faces: [
      {
        student_id: 'SV001',
        confidence: 0.95,
        bbox: { x: 100, y: 100, w: 200, h: 200 }
      },
      {
        student_id: 'SV002',
        confidence: 0.88,
        bbox: { x: 350, y: 120, w: 190, h: 210 }
      }
    ],
    session_info: {
      course_id: 'CS101',
      room: 'A201',
      start_time: new Date().toISOString(),
      end_time: new Date(Date.now() + 3600000).toISOString()
    },
    image_url: 'https://example.com/snapshot.jpg'
  };

  res.json({
    message: 'Sample webhook payload',
    usage: 'POST this to /webhook/attendance',
    payload: samplePayload,
    curl_example: `curl -X POST http://localhost:${PORT}/webhook/attendance \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(samplePayload)}'`
  });
});

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'HSB Attendance Webhook Server',
    firebase: db ? 'connected' : 'disconnected',
    uptime: process.uptime()
  });
});

app.listen(PORT, () => {
  console.log('\n🎓 HSB Attendance Webhook Server');
  console.log('═══════════════════════════════════════════');
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log('\n📡 Endpoints:');
  console.log(`   POST /webhook/attendance  - Receive camera detections`);
  console.log(`   GET  /webhook/test        - View sample payload`);
  console.log(`   GET  /health             - Health check`);
  console.log('\n📋 Configure this URL in your ANSVIS cameras:');
  console.log(`   http://localhost:${PORT}/webhook/attendance`);
  console.log('   (Use ngrok or production server for remote cameras)');
  console.log('═══════════════════════════════════════════\n');
});
