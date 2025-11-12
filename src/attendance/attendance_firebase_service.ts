// attendance_firebase_service.ts
// Place this file in: src/attendance/attendance_firebase_service.ts

import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  writeBatch,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../firebase/firebase.config'; // Uses your existing firebase_config.ts
import type { AttendanceRecord, StudentAttendanceStats, CourseAttendance, AttendanceAlert, AICamera } from './attendancemodel';

// Firebase Collections
const COLLECTIONS = {
  attendance: 'attendance_records',
  cameras: 'ai_cameras',
  alerts: 'attendance_alerts',
  sessions: 'class_sessions',
  stats: 'attendance_stats'
};

// ============= AI CAMERA WEBHOOK HANDLER =============
export interface ANSVISWebhookPayload {
  task_id: string;
  camera_id: string;
  timestamp: string;
  detected_faces: Array<{
    student_id: string;
    confidence: number;
    bbox: { x: number; y: number; w: number; h: number };
  }>;
  session_info: {
    course_id: string;
    room: string;
    start_time: string;
    end_time: string;
  };
  image_url?: string;
  video_url?: string;
}

export async function handleANSVISWebhook(payload: ANSVISWebhookPayload): Promise<void> {
  const batch = writeBatch(db);
  const timestamp = new Date(payload.timestamp);

  // Process each detected face
  for (const face of payload.detected_faces) {
    if (face.confidence < 0.75) continue; // Skip low-confidence detections

    const attendanceId = `ATT-${timestamp.getTime()}-${face.student_id}`;
    const attendanceRef = doc(db, COLLECTIONS.attendance, attendanceId);

    const record: Partial<AttendanceRecord> = {
      id: attendanceId,
      studentId: face.student_id,
      courseId: payload.session_info.course_id,
      date: timestamp,
      status: 'present',
      source: 'ai-camera',
      sessionType: 'lecture',
      timestamp,
      cameraId: payload.camera_id,
      lecturerVerified: false,
      notes: `AI Detection - Confidence: ${(face.confidence * 100).toFixed(1)}%`
    };

    batch.set(attendanceRef, {
      ...record,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
  }

  // Update camera last sync
  const cameraRef = doc(db, COLLECTIONS.cameras, payload.camera_id);
  const cameraDoc = await getDoc(cameraRef);
  const currentSessions = cameraDoc.exists() ? (cameraDoc.data().sessionsToday || 0) : 0;

  batch.set(cameraRef, {
    lastSync: Timestamp.now(),
    sessionsToday: currentSessions + 1,
    status: 'online'
  }, { merge: true });

  await batch.commit();
}

// ============= ATTENDANCE RECORDING =============
export async function recordAttendance(record: AttendanceRecord): Promise<void> {
  const docRef = doc(db, COLLECTIONS.attendance, record.id);
  await setDoc(docRef, {
    ...record,
    date: Timestamp.fromDate(record.date),
    timestamp: record.timestamp ? Timestamp.fromDate(record.timestamp) : Timestamp.now(),
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  });
}

export async function bulkRecordAttendance(records: AttendanceRecord[]): Promise<void> {
  const batch = writeBatch(db);
  
  records.forEach(record => {
    const docRef = doc(db, COLLECTIONS.attendance, record.id);
    batch.set(docRef, {
      ...record,
      date: Timestamp.fromDate(record.date),
      timestamp: record.timestamp ? Timestamp.fromDate(record.timestamp) : Timestamp.now(),
      createdAt: Timestamp.now()
    });
  });

  await batch.commit();
}

// ============= QUERIES =============
export async function getStudentAttendance(
  studentId: string,
  startDate?: Date,
  endDate?: Date
): Promise<AttendanceRecord[]> {
  let q = query(
    collection(db, COLLECTIONS.attendance),
    where('studentId', '==', studentId),
    orderBy('date', 'desc')
  );

  if (startDate) {
    q = query(q, where('date', '>=', Timestamp.fromDate(startDate)));
  }
  if (endDate) {
    q = query(q, where('date', '<=', Timestamp.fromDate(endDate)));
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    ...doc.data(),
    date: doc.data().date.toDate(),
    timestamp: doc.data().timestamp?.toDate()
  } as AttendanceRecord));
}

export async function getCourseAttendance(
  courseId: string,
  date?: Date
): Promise<AttendanceRecord[]> {
  let q = query(
    collection(db, COLLECTIONS.attendance),
    where('courseId', '==', courseId),
    orderBy('date', 'desc')
  );

  if (date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    q = query(
      q,
      where('date', '>=', Timestamp.fromDate(startOfDay)),
      where('date', '<=', Timestamp.fromDate(endOfDay))
    );
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    ...doc.data(),
    date: doc.data().date.toDate(),
    timestamp: doc.data().timestamp?.toDate()
  } as AttendanceRecord));
}

// ============= REAL-TIME LISTENERS =============
export function subscribeToLiveAttendance(
  courseId: string,
  date: Date,
  callback: (records: AttendanceRecord[]) => void
) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const q = query(
    collection(db, COLLECTIONS.attendance),
    where('courseId', '==', courseId),
    where('date', '>=', Timestamp.fromDate(startOfDay)),
    where('date', '<=', Timestamp.fromDate(endOfDay)),
    orderBy('timestamp', 'desc')
  );

  return onSnapshot(q, snapshot => {
    const records = snapshot.docs.map(doc => ({
      ...doc.data(),
      date: doc.data().date.toDate(),
      timestamp: doc.data().timestamp?.toDate()
    } as AttendanceRecord));
    callback(records);
  });
}

// ============= STATISTICS =============
export async function calculateLiveStats(studentId: string): Promise<StudentAttendanceStats | null> {
  const records = await getStudentAttendance(studentId);
  if (records.length === 0) return null;

  const totalSessions = records.length;
  const attended = records.filter(r => r.status === 'present').length;
  const late = records.filter(r => r.status === 'late').length;
  const absent = records.filter(r => r.status === 'absent').length;
  const excused = records.filter(r => r.status === 'excused').length;

  const baseAttendanceRate = (attended / totalSessions) * 100;
  const quizRecords = records.filter(r => r.source === 'quiz' || r.source === 'assignment');
  const quizAttendance = quizRecords.filter(r => r.status === 'present').length;
  const quizBonus = Math.min(10, Math.floor((quizAttendance / Math.max(1, quizRecords.length)) * 10));
  const attendanceRate = Math.min(100, baseAttendanceRate + quizBonus);

  // Trend calculation
  const midpoint = Math.floor(records.length / 2);
  const recentRecords = records.slice(0, midpoint);
  const olderRecords = records.slice(midpoint);
  
  const recentRate = recentRecords.length > 0 
    ? (recentRecords.filter(r => r.status === 'present').length / recentRecords.length) * 100 
    : baseAttendanceRate;
  const olderRate = olderRecords.length > 0 
    ? (olderRecords.filter(r => r.status === 'present').length / olderRecords.length) * 100 
    : baseAttendanceRate;

  let trend: "improving" | "declining" | "stable";
  if (recentRate > olderRate + 5) trend = "improving";
  else if (recentRate < olderRate - 5) trend = "declining";
  else trend = "stable";

  return {
    studentId,
    studentName: '',
    program: '',
    level: 'Bachelor', // Use proper CourseLevel value
    year: '',
    totalSessions,
    attended,
    late,
    absent,
    excused,
    attendanceRate,
    trend,
    atRisk: attendanceRate < 70,
    eligibleForExam: attendanceRate >= 70,
    quizBonus
  };
}

// ============= AI CAMERA MANAGEMENT =============
export async function registerCamera(camera: AICamera): Promise<void> {
  const docRef = doc(db, COLLECTIONS.cameras, camera.id);
  await setDoc(docRef, {
    ...camera,
    lastSync: Timestamp.fromDate(camera.lastSync),
    registeredAt: Timestamp.now()
  });
}

export async function getAllCameras(): Promise<AICamera[]> {
  const snapshot = await getDocs(collection(db, COLLECTIONS.cameras));
  return snapshot.docs.map(doc => ({
    ...doc.data(),
    lastSync: doc.data().lastSync.toDate()
  } as AICamera));
}

export async function updateCameraStatus(
  cameraId: string, 
  status: AICamera['status']
): Promise<void> {
  const docRef = doc(db, COLLECTIONS.cameras, cameraId);
  await setDoc(docRef, {
    status,
    lastSync: Timestamp.now()
  }, { merge: true });
}

// ============= ALERTS =============
export async function createAlert(alert: AttendanceAlert): Promise<void> {
  const docRef = doc(db, COLLECTIONS.alerts, alert.id);
  await setDoc(docRef, {
    ...alert,
    date: Timestamp.fromDate(alert.date),
    createdAt: Timestamp.now()
  });
}

export async function getActiveAlerts(severity?: AttendanceAlert['severity']): Promise<AttendanceAlert[]> {
  let q = query(
    collection(db, COLLECTIONS.alerts),
    where('acknowledged', '==', false),
    orderBy('date', 'desc')
  );

  if (severity) {
    q = query(q, where('severity', '==', severity));
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    ...doc.data(),
    date: doc.data().date.toDate()
  } as AttendanceAlert));
}

export async function acknowledgeAlert(alertId: string): Promise<void> {
  const docRef = doc(db, COLLECTIONS.alerts, alertId);
  await setDoc(docRef, {
    acknowledged: true,
    acknowledgedAt: Timestamp.now()
  }, { merge: true });
}

// ============= BULK DATA RETRIEVAL =============

/**
 * Get all attendance records from Firebase
 * Optionally filter by date range
 */
export async function getAllAttendanceRecords(
  startDate?: Date,
  endDate?: Date
): Promise<AttendanceRecord[]> {
  let q = query(
    collection(db, COLLECTIONS.attendance),
    orderBy('date', 'desc')
  );

  if (startDate) {
    q = query(q, where('date', '>=', Timestamp.fromDate(startDate)));
  }
  if (endDate) {
    q = query(q, where('date', '<=', Timestamp.fromDate(endDate)));
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      date: data.date?.toDate() || new Date(),
      timestamp: data.timestamp?.toDate() || new Date()
    } as AttendanceRecord;
  });
}

/**
 * Calculate stats for all students based on real Firebase data
 * Enriches with student info from studentData
 */
export async function getAllStudentStats(
  studentData: Array<{ id: string; name: string; program: string; level: string; year: string; status?: string }>,
  startDate?: Date,
  endDate?: Date
): Promise<StudentAttendanceStats[]> {
  const records = await getAllAttendanceRecords(startDate, endDate);

  // Group records by student
  const recordsByStudent = new Map<string, AttendanceRecord[]>();
  records.forEach(record => {
    if (!recordsByStudent.has(record.studentId)) {
      recordsByStudent.set(record.studentId, []);
    }
    recordsByStudent.get(record.studentId)!.push(record);
  });

  const stats: StudentAttendanceStats[] = [];

  // Calculate stats for each student with records
  recordsByStudent.forEach((studentRecords, studentId) => {
    const student = studentData.find(s => s.id === studentId);

    const totalSessions = studentRecords.length;
    const attended = studentRecords.filter(r => r.status === 'present').length;
    const late = studentRecords.filter(r => r.status === 'late').length;
    const absent = studentRecords.filter(r => r.status === 'absent').length;
    const excused = studentRecords.filter(r => r.status === 'excused').length;

    const baseAttendanceRate = totalSessions > 0 ? (attended / totalSessions) * 100 : 0;

    // Quiz bonus calculation
    const quizRecords = studentRecords.filter(r => r.source === 'quiz' || r.source === 'assignment');
    const quizAttendance = quizRecords.filter(r => r.status === 'present').length;
    const quizBonus = Math.min(10, Math.floor((quizAttendance / Math.max(1, quizRecords.length)) * 10));

    const attendanceRate = Math.min(100, baseAttendanceRate + quizBonus);

    // Trend calculation
    const midpoint = Math.floor(studentRecords.length / 2);
    const recentRecords = studentRecords.slice(0, midpoint);
    const olderRecords = studentRecords.slice(midpoint);

    const recentRate = recentRecords.length > 0
      ? (recentRecords.filter(r => r.status === 'present').length / recentRecords.length) * 100
      : baseAttendanceRate;
    const olderRate = olderRecords.length > 0
      ? (olderRecords.filter(r => r.status === 'present').length / olderRecords.length) * 100
      : baseAttendanceRate;

    let trend: "improving" | "declining" | "stable";
    if (recentRate > olderRate + 5) trend = "improving";
    else if (recentRate < olderRate - 5) trend = "declining";
    else trend = "stable";

    stats.push({
      studentId,
      studentName: student?.name || studentId,
      program: student?.program || 'Unknown',
      level: (student?.level as any) || 'Bachelor',
      year: student?.year || '',
      totalSessions,
      attended,
      late,
      absent,
      excused,
      attendanceRate,
      trend,
      atRisk: attendanceRate < 70,
      eligibleForExam: attendanceRate >= 70,
      quizBonus
    });
  });

  return stats.sort((a, b) => a.studentName.localeCompare(b.studentName));
}

/**
 * Calculate stats for all courses based on real Firebase data
 */
export async function getAllCourseStats(
  courseData: Array<{ id: string; name: string; instructor: string; program: string; faculty: any; level: any; students: number }>,
  startDate?: Date,
  endDate?: Date
): Promise<CourseAttendance[]> {
  const records = await getAllAttendanceRecords(startDate, endDate);

  // Group records by course
  const recordsByCourse = new Map<string, AttendanceRecord[]>();
  records.forEach(record => {
    if (!recordsByCourse.has(record.courseId)) {
      recordsByCourse.set(record.courseId, []);
    }
    recordsByCourse.get(record.courseId)!.push(record);
  });

  const stats: CourseAttendance[] = [];

  courseData.forEach(course => {
    const courseRecords = recordsByCourse.get(course.id) || [];
    const uniqueStudents = new Set(courseRecords.map(r => r.studentId)).size;
    const uniqueDates = new Set(courseRecords.map(r => r.date.toISOString().split('T')[0])).size;

    if (courseRecords.length === 0) {
      stats.push({
        courseId: course.id,
        courseName: course.name,
        instructor: course.instructor,
        program: course.program,
        faculty: course.faculty,
        level: course.level,
        totalStudents: course.students,
        averageAttendance: 0,
        sessionsHeld: 0,
        atRiskStudents: 0,
        trend: 'stable'
      });
      return;
    }

    const totalPresent = courseRecords.filter(r => r.status === 'present').length;
    const averageAttendance = (totalPresent / courseRecords.length) * 100;

    // Calculate at-risk students
    const studentAttendance = new Map<string, { present: number; total: number }>();
    courseRecords.forEach(record => {
      const current = studentAttendance.get(record.studentId) || { present: 0, total: 0 };
      current.total++;
      if (record.status === 'present') current.present++;
      studentAttendance.set(record.studentId, current);
    });

    const atRiskStudents = Array.from(studentAttendance.values())
      .filter(stats => (stats.present / stats.total) * 100 < 70)
      .length;

    // Trend calculation
    const midpoint = Math.floor(courseRecords.length / 2);
    const recentRecords = courseRecords.slice(0, midpoint);
    const olderRecords = courseRecords.slice(midpoint);

    const recentRate = recentRecords.length > 0
      ? (recentRecords.filter(r => r.status === 'present').length / recentRecords.length) * 100
      : averageAttendance;
    const olderRate = olderRecords.length > 0
      ? (olderRecords.filter(r => r.status === 'present').length / olderRecords.length) * 100
      : averageAttendance;

    let trend: "up" | "down" | "stable";
    if (recentRate > olderRate + 5) trend = "up";
    else if (recentRate < olderRate - 5) trend = "down";
    else trend = "stable";

    stats.push({
      courseId: course.id,
      courseName: course.name,
      instructor: course.instructor,
      program: course.program,
      faculty: course.faculty,
      level: course.level,
      totalStudents: uniqueStudents,
      averageAttendance,
      sessionsHeld: uniqueDates,
      atRiskStudents,
      trend
    });
  });

  return stats.sort((a, b) => b.averageAttendance - a.averageAttendance);
}

/**
 * Get all alerts from Firebase (not just active ones)
 */
export async function getAllAlerts(maxResults?: number): Promise<AttendanceAlert[]> {
  let q = query(
    collection(db, COLLECTIONS.alerts),
    orderBy('date', 'desc')
  );

  if (maxResults) {
    q = query(q, limit(maxResults));
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    ...doc.data(),
    id: doc.id,
    date: doc.data().date.toDate()
  } as AttendanceAlert));
}

/**
 * Generate alerts based on current stats
 * Can be called periodically to check for at-risk students
 */
export async function generateAndSaveAlerts(
  studentStats: StudentAttendanceStats[]
): Promise<AttendanceAlert[]> {
  const alerts: AttendanceAlert[] = [];
  const batch = writeBatch(db);

  studentStats.forEach((student, index) => {
    let alert: AttendanceAlert | null = null;

    if (student.attendanceRate < 50) {
      alert = {
        id: `ALERT-${Date.now()}-${index}`,
        studentId: student.studentId,
        studentName: student.studentName,
        type: 'exam-ineligible',
        severity: 'critical',
        message: `Critical: ${student.studentName} is ineligible for final exam (${student.attendanceRate.toFixed(1)}% attendance)`,
        date: new Date(),
        acknowledged: false
      };
    } else if (student.attendanceRate < 60) {
      alert = {
        id: `ALERT-${Date.now()}-${index}`,
        studentId: student.studentId,
        studentName: student.studentName,
        type: 'below-threshold',
        severity: 'warning',
        message: `Warning: ${student.studentName} is at risk of failing attendance requirement (${student.attendanceRate.toFixed(1)}%)`,
        date: new Date(),
        acknowledged: false
      };
    } else if (student.attendanceRate < 70) {
      alert = {
        id: `ALERT-${Date.now()}-${index}`,
        studentId: student.studentId,
        studentName: student.studentName,
        type: 'below-threshold',
        severity: 'warning',
        message: `Warning: ${student.studentName} is approaching attendance threshold (${student.attendanceRate.toFixed(1)}%)`,
        date: new Date(),
        acknowledged: false
      };
    } else if (student.trend === 'declining' && student.attendanceRate < 80) {
      alert = {
        id: `ALERT-${Date.now()}-${index}`,
        studentId: student.studentId,
        studentName: student.studentName,
        type: 'declining-trend',
        severity: 'info',
        message: `Notice: ${student.studentName} showing declining attendance trend (${student.attendanceRate.toFixed(1)}%)`,
        date: new Date(),
        acknowledged: false
      };
    }

    if (alert) {
      alerts.push(alert);
      const alertRef = doc(db, COLLECTIONS.alerts, alert.id);
      batch.set(alertRef, {
        ...alert,
        date: Timestamp.fromDate(alert.date),
        createdAt: Timestamp.now()
      });
    }
  });

  if (alerts.length > 0) {
    await batch.commit();
  }

  return alerts;
}

// Note: Firebase increment not directly used in current implementation
// For increment operations, use updateDoc with serverTimestamp or fetch-update pattern