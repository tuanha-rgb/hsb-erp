// enrollmentService.ts
// Firebase service for student enrollment data

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  writeBatch,
  query,
  where,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase/firebase.config';
import type { StudentEnrollment, SessionType, BlockSchedule } from './enrollmentModel';
import { getSessionFromDate, getCurrentSemester, getBlockFromDate } from './enrollmentModel';

const COLLECTIONS = {
  enrollments: 'student_enrollments',
  attendance: 'attendance_records'
};

/**
 * Get student's course for a specific session, date, and semester
 */
export async function getStudentCourseForSession(
  studentId: string,
  session: SessionType,
  date: Date,
  semester?: string
): Promise<string | null> {
  const currentSemester = semester || getCurrentSemester();
  const enrollmentId = `${studentId}_${currentSemester}`;

  try {
    const docRef = doc(db, COLLECTIONS.enrollments, enrollmentId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.warn(`No enrollment found for student ${studentId} in ${currentSemester}`);
      return null;
    }

    const enrollment = docSnap.data() as StudentEnrollment;

    // Find which block this date falls into
    const block = getBlockFromDate(date, enrollment.blocks);

    if (!block) {
      console.warn(`Date ${date.toISOString().split('T')[0]} does not fall into any block for student ${studentId}`);
      return null;
    }

    const courseId = block.courses[session];

    if (!courseId) {
      console.warn(`Student ${studentId} has no ${session} class in block ${block.blockNumber}`);
      return null;
    }

    return courseId;
  } catch (error) {
    console.error('Error getting student course:', error);
    return null;
  }
}

/**
 * Match attendance record to course based on student, time, and date
 */
export async function matchAttendanceToCourse(
  studentId: string,
  timestamp: Date,
  semester?: string
): Promise<string | null> {
  // 1. Determine session from timestamp
  const session = getSessionFromDate(timestamp);

  // 2. Look up student's course for this session and date (considers blocks)
  const courseId = await getStudentCourseForSession(studentId, session, timestamp, semester);

  return courseId;
}

/**
 * Import student enrollments from CSV data
 * CSV Format: studentId, semester, block, startDate, endDate, morningCourse, afternoonCourse, nightCourse
 * Each row represents one block for one student
 */
export async function importEnrollmentsFromCSV(csvData: string): Promise<{
  imported: number;
  errors: string[];
}> {
  const lines = csvData.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());

  // Validate headers
  const requiredHeaders = ['studentId', 'semester', 'block', 'startDate', 'endDate'];
  const hasRequiredHeaders = requiredHeaders.every(h => headers.includes(h));

  if (!hasRequiredHeaders) {
    throw new Error(`CSV must have headers: ${requiredHeaders.join(', ')}, morningCourse, afternoonCourse, nightCourse`);
  }

  // Group rows by studentId + semester
  const enrollmentMap = new Map<string, StudentEnrollment>();
  const errors: string[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    try {
      const values = line.split(',').map(v => v.trim());
      const row: Record<string, string> = {};

      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });

      const studentId = row.studentId;
      const semester = row.semester || getCurrentSemester();
      const blockNumber = parseInt(row.block);
      const startDate = row.startDate;
      const endDate = row.endDate;

      if (!studentId) {
        errors.push(`Line ${i + 1}: Missing studentId`);
        continue;
      }

      if (!blockNumber || blockNumber < 1 || blockNumber > 3) {
        errors.push(`Line ${i + 1}: Invalid block number (must be 1, 2, or 3)`);
        continue;
      }

      if (!startDate || !endDate) {
        errors.push(`Line ${i + 1}: Missing startDate or endDate`);
        continue;
      }

      const enrollmentKey = `${studentId}_${semester}`;

      // Get or create enrollment
      let enrollment = enrollmentMap.get(enrollmentKey);
      if (!enrollment) {
        enrollment = {
          studentId,
          semester,
          blocks: []
        };
        enrollmentMap.set(enrollmentKey, enrollment);
      }

      // Add block
      const blockSchedule: BlockSchedule = {
        blockNumber: blockNumber as 1 | 2 | 3,
        startDate,
        endDate,
        courses: {
          morning: row.morningCourse || row.morning || undefined,
          afternoon: row.afternoonCourse || row.afternoon || undefined,
          night: row.nightCourse || row.night || undefined
        }
      };

      enrollment.blocks.push(blockSchedule);
    } catch (error: any) {
      errors.push(`Line ${i + 1}: ${error.message}`);
    }
  }

  // Now write to Firestore
  const batch = writeBatch(db);
  let batchCount = 0;
  let imported = 0;

  for (const [enrollmentKey, enrollment] of enrollmentMap) {
    const enrollmentRef = doc(db, COLLECTIONS.enrollments, enrollmentKey);

    batch.set(enrollmentRef, {
      ...enrollment,
      importedAt: Timestamp.now()
    });

    batchCount++;
    imported++;

    // Firestore batch limit is 500
    if (batchCount >= 500) {
      await batch.commit();
      batchCount = 0;
    }
  }

  // Commit remaining batch
  if (batchCount > 0) {
    await batch.commit();
  }

  return { imported, errors };
}

/**
 * Import from JSON array
 * Expected format: array of StudentEnrollment objects with blocks
 */
export async function importEnrollmentsFromJSON(
  enrollments: StudentEnrollment[]
): Promise<{ imported: number; errors: string[] }> {
  const batch = writeBatch(db);
  let batchCount = 0;
  let imported = 0;
  const errors: string[] = [];

  for (const enrollment of enrollments) {
    try {
      if (!enrollment.studentId) {
        errors.push(`Missing studentId in enrollment`);
        continue;
      }

      if (!enrollment.blocks || enrollment.blocks.length === 0) {
        errors.push(`Missing blocks for student ${enrollment.studentId}`);
        continue;
      }

      const semester = enrollment.semester || getCurrentSemester();
      const enrollmentId = `${enrollment.studentId}_${semester}`;
      const enrollmentRef = doc(db, COLLECTIONS.enrollments, enrollmentId);

      batch.set(enrollmentRef, {
        ...enrollment,
        semester,
        importedAt: Timestamp.now()
      });

      batchCount++;
      imported++;

      if (batchCount >= 500) {
        await batch.commit();
        batchCount = 0;
      }
    } catch (error: any) {
      errors.push(`Error importing ${enrollment.studentId}: ${error.message}`);
    }
  }

  if (batchCount > 0) {
    await batch.commit();
  }

  return { imported, errors };
}

/**
 * Get all enrollments for a semester
 */
export async function getAllEnrollments(semester?: string): Promise<StudentEnrollment[]> {
  const currentSemester = semester || getCurrentSemester();

  const q = query(
    collection(db, COLLECTIONS.enrollments),
    where('semester', '==', currentSemester)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => doc.data() as StudentEnrollment);
}

/**
 * Get enrollment for specific student
 */
export async function getStudentEnrollment(
  studentId: string,
  semester?: string
): Promise<StudentEnrollment | null> {
  const currentSemester = semester || getCurrentSemester();
  const enrollmentId = `${studentId}_${currentSemester}`;

  const docRef = doc(db, COLLECTIONS.enrollments, enrollmentId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  return docSnap.data() as StudentEnrollment;
}

/**
 * Update ALL existing attendance records to match courses
 * This is a one-time batch operation
 */
export async function updateAllAttendanceRecords(
  semester?: string
): Promise<{
  total: number;
  matched: number;
  unmatched: number;
  errors: string[];
}> {
  const currentSemester = semester || getCurrentSemester();

  // Get all attendance records with DEFAULT_COURSE
  const attendanceRef = collection(db, COLLECTIONS.attendance);
  const q = query(
    attendanceRef,
    where('courseId', '==', 'DEFAULT_COURSE')
  );

  const snapshot = await getDocs(q);
  console.log(`Found ${snapshot.docs.length} records to update`);

  let matched = 0;
  let unmatched = 0;
  const errors: string[] = [];

  // Process in batches
  const batchSize = 500;
  for (let i = 0; i < snapshot.docs.length; i += batchSize) {
    const batch = writeBatch(db);
    const batchDocs = snapshot.docs.slice(i, i + batchSize);

    for (const docSnapshot of batchDocs) {
      try {
        const record = docSnapshot.data();
        const studentId = record.studentId;
        const timestamp = record.timestamp?.toDate() || record.date?.toDate();

        if (!timestamp) {
          errors.push(`${docSnapshot.id}: No timestamp`);
          unmatched++;
          continue;
        }

        const courseId = await matchAttendanceToCourse(
          studentId,
          timestamp,
          currentSemester
        );

        if (courseId) {
          batch.update(doc(db, COLLECTIONS.attendance, docSnapshot.id), {
            courseId,
            matchedAt: Timestamp.now(),
            matchMethod: 'enrollment-based'
          });
          matched++;
        } else {
          unmatched++;
          errors.push(`${docSnapshot.id}: No course found for ${studentId}`);
        }
      } catch (error: any) {
        errors.push(`${docSnapshot.id}: ${error.message}`);
        unmatched++;
      }
    }

    await batch.commit();
    console.log(`Processed batch ${i / batchSize + 1}`);
  }

  return {
    total: snapshot.docs.length,
    matched,
    unmatched,
    errors
  };
}

/**
 * Get matching statistics
 */
export async function getMatchingStats(semester?: string): Promise<{
  totalRecords: number;
  matched: number;
  unmatched: number;
  matchRate: number;
}> {
  const attendanceRef = collection(db, COLLECTIONS.attendance);

  // Get total records
  const allSnapshot = await getDocs(attendanceRef);
  const totalRecords = allSnapshot.docs.length;

  // Get unmatched (DEFAULT_COURSE)
  const unmatchedQuery = query(
    attendanceRef,
    where('courseId', '==', 'DEFAULT_COURSE')
  );
  const unmatchedSnapshot = await getDocs(unmatchedQuery);
  const unmatched = unmatchedSnapshot.docs.length;

  const matched = totalRecords - unmatched;
  const matchRate = totalRecords > 0 ? (matched / totalRecords) * 100 : 0;

  return {
    totalRecords,
    matched,
    unmatched,
    matchRate
  };
}
