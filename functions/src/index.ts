import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();

// Collections
const COLLECTIONS = {
  attendance: "attendance_records",
  cameras: "ai_cameras",
  alerts: "attendance_alerts",
  sessions: "class_sessions",
};

// Helper: Sanitize ID to make it safe for Firestore
function sanitizeId(id: string | undefined | null, defaultValue: string): string {
  if (!id) return defaultValue;
  const sanitized = id.toString().replace(/[^a-zA-Z0-9_]/g, "_");
  return sanitized.length > 0 ? sanitized : defaultValue;
}

// ANSVIS Webhook Endpoint
export const ansvisWebhook = functions.https.onRequest(async (req, res) => {
  // CORS headers
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  try {
    const payload = req.body;
    
    // Log the entire payload for debugging
    console.log("=== RECEIVED PAYLOAD ===");
    console.log(JSON.stringify(payload, null, 2));
    console.log("========================");

    // Extract and sanitize data
    const taskId = sanitizeId(
      payload.task_id || payload.TaskID || payload.EventName,
      "unknown_task"
    );
    
    const cameraId = sanitizeId(
      payload.camera_id || payload.CameraID || payload.CameraName,
      "CAM_UNKNOWN"
    );
    
    const timestamp = new Date(payload.timestamp || payload.Time || Date.now());
    
    console.log(`Task ID: ${taskId}`);
    console.log(`Camera ID: ${cameraId}`);
    console.log(`Timestamp: ${timestamp.toISOString()}`);
    
    // Handle detected faces - ANSVIS sends in DetectionData nested structure
    let detectedFaces: any[] = [];

    // Extract from ANSVIS format: Detections[].DetectionData[]
    if (payload.Detections && Array.isArray(payload.Detections)) {
      for (const detection of payload.Detections) {
        if (detection.DetectionData && Array.isArray(detection.DetectionData)) {
          detectedFaces = detectedFaces.concat(detection.DetectionData);
        }
      }
    }
    
    console.log(`Found ${detectedFaces.length} detections in payload`);
    
    // If still no faces, check old format
    if (!detectedFaces.length) {
      detectedFaces = payload.detected_faces || payload.Detections || [];
    }

    if (!Array.isArray(detectedFaces) && typeof detectedFaces === "object") {
      detectedFaces = Object.values(detectedFaces);
    }

    if (!detectedFaces.length && (payload.Class || payload.student_id)) {
      detectedFaces = [{
        student_id: payload.Class || payload.student_id,
        confidence: payload.Confidence || 0.85,
        bbox: {
          x: payload.Left || 0,
          y: payload.Top || 0,
          w: payload.Right || 0,
          h: payload.Bottom || 0,
        },
      }];
    }

    console.log(`Detected faces: ${detectedFaces.length}`);

    // Session info
    const rawCourseId = payload.session_info?.course_id || 
                        payload.course_id || 
                        "DEFAULT_COURSE";
    const safeCourseId = sanitizeId(rawCourseId, "DEFAULT_COURSE");
    
    const sessionInfo = {
      course_id: safeCourseId,
      room: payload.session_info?.room || payload.room || "Unknown_Room",
      start_time: payload.session_info?.start_time || payload.start_time || "00:00",
      end_time: payload.session_info?.end_time || payload.end_time || "23:59",
    };

    console.log(`Course ID: ${sessionInfo.course_id}`);

    const batch = db.batch();
    let processedCount = 0;

    // Process each detected face
    for (const face of detectedFaces) {
      try {
        // ANSVIS format: UserInfo.UserID or Name field
        const rawStudentId = face.UserInfo?.UserID || 
                           face.UserInfo?.UserName || 
                           face.Name ||
                           face.student_id || 
                           face.Class;
        
        if (!rawStudentId) {
          console.log("Skipping face with no student ID");
          continue;
        }
        
        const studentId = sanitizeId(rawStudentId, "UNKNOWN_STUDENT");

        if (studentId === "UNKNOWN_STUDENT") {
          console.log(`Skipping invalid student ID: ${rawStudentId}`);
          continue;
        }
        
        // Get confidence from Score field
        const confidence = face.Detections?.[0]?.Score || 
                         face.confidence || 
                         face.Confidence || 
                         0.85;
        
        console.log(`Processing student: ${studentId} (confidence: ${confidence})`);

        // Generate safe attendance ID
        const randomSuffix = Math.random().toString(36).substring(2, 11);
        const attendanceId = `ATT_${Date.now()}_${randomSuffix}`;
        
        console.log(`Creating attendance record: ${attendanceId}`);
        
        // Extract bounding box from ANSVIS format
        const bbox = face.Detections?.[0]?.BoundingBox ? {
          x: face.Detections[0].BoundingBox.Left,
          y: face.Detections[0].BoundingBox.Top,
          w: face.Detections[0].BoundingBox.Right - face.Detections[0].BoundingBox.Left,
          h: face.Detections[0].BoundingBox.Bottom - face.Detections[0].BoundingBox.Top,
        } : (face.bbox || {});
        
        const attendanceRef = db.collection(COLLECTIONS.attendance).doc(attendanceId);

        batch.set(attendanceRef, {
          id: attendanceId,
          studentId: studentId,
          studentName: studentId,
          courseId: sessionInfo.course_id,
          courseName: sessionInfo.course_id,
          date: admin.firestore.Timestamp.fromDate(timestamp),
          status: "present",
          source: "ai-camera",
          sessionType: "lecture",
          timestamp: admin.firestore.Timestamp.fromDate(timestamp),
          cameraId: cameraId,
          lecturerVerified: false,
          confidence: confidence,
          bbox: bbox,
          imageUrl: payload.image_url || payload.ImageURL || "",
          notes: `AI Detection - Task: ${taskId}`,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        
        processedCount++;
        
      } catch (faceError: any) {
        console.error("Error processing face:", faceError.message);
      }
    }

    // Update camera status
    try {
      console.log(`Updating camera: ${cameraId}`);
      const cameraRef = db.collection(COLLECTIONS.cameras).doc(cameraId);
      batch.set(cameraRef, {
        id: cameraId,
        location: `Camera ${cameraId}`,
        lastSync: admin.firestore.FieldValue.serverTimestamp(),
        sessionsToday: admin.firestore.FieldValue.increment(1),
        status: "online",
        accuracy: 95.0,
      }, {merge: true});
    } catch (cameraError: any) {
      console.error("Error updating camera:", cameraError.message);
    }

    // Update session
    try {
      const dateStr = timestamp.toISOString().split("T")[0].replace(/-/g, "");
      const sessionId = `${sessionInfo.course_id}_${dateStr}`;
      
      console.log(`Updating session: ${sessionId}`);
      
      const sessionRef = db.collection(COLLECTIONS.sessions).doc(sessionId);
      batch.set(sessionRef, {
        courseId: sessionInfo.course_id,
        date: admin.firestore.Timestamp.fromDate(timestamp),
        room: sessionInfo.room,
        startTime: sessionInfo.start_time,
        endTime: sessionInfo.end_time,
        totalDetections: admin.firestore.FieldValue.increment(detectedFaces.length),
        lastUpdate: admin.firestore.FieldValue.serverTimestamp(),
      }, {merge: true});
    } catch (sessionError: any) {
      console.error("Error updating session:", sessionError.message);
    }

    // Commit batch
    console.log("Committing batch...");
    await batch.commit();
    console.log("Batch committed successfully!");

    const response = {
      success: true,
      processed: processedCount,
      timestamp: new Date().toISOString(),
      camera: cameraId,
      task: taskId,
    };

    console.log("=== RESPONSE ===");
    console.log(JSON.stringify(response, null, 2));
    console.log("================");
    
    res.status(200).json(response);

  } catch (error: any) {
    console.error("=== WEBHOOK ERROR ===");
    console.error("Error:", error);
    console.error("Message:", error.message);
    console.error("Stack:", error.stack);
    console.error("====================");
    
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});