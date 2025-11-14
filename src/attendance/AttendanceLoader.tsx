// AttendanceLoader.tsx
// Simple component to load and display ALL attendance records from Firebase

import React, { useState, useEffect, useMemo } from 'react';
import { collection, getDocs, query, orderBy, limit, doc, updateDoc, writeBatch, addDoc, serverTimestamp, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase.config';
import { Users, Calendar, Camera, Download, RefreshCw, AlertCircle, CheckCircle, Settings } from 'lucide-react';
import { verifyAttendanceData, exportUnmatchedStudents } from './verify-attendance';
import { getBlockInfoFromTimestamp, saveBlockConfigToLocalStorage, updateBlockConfigCache } from './blockUtils';

interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName?: string;
  class?: string;
  courseId: string;
  date: Date;
  timestamp: Date;
  status: string;
  source: string;
  cameraId?: string;
  confidence?: number;
}

interface StudentSummary {
  studentId: string;
  studentName: string;
  totalRecords: number;
  firstSeen: Date;
  lastSeen: Date;
  cameras: Set<string>;
  courses: Set<string>;
  records: AttendanceRecord[];
}

export default function AttendanceLoader() {
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [students, setStudents] = useState<Map<string, StudentSummary>>(new Map());
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'all' | 'by-student' | 'eligible'>('all');
  const [maxRecords, setMaxRecords] = useState(5000);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [verifying, setVerifying] = useState(false);
  const [showBlockForm, setShowBlockForm] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState<'spring' | 'summer' | 'fall' | ''>('');
  const [blockDates, setBlockDates] = useState<{[key: number]: {start: string, end: string}}>({});
  const [savedBlockConfigs, setSavedBlockConfigs] = useState<{
    [semester: string]: {[key: number]: {start: string, end: string}}
  }>({});
  const [currentPageAll, setCurrentPageAll] = useState(1);
  const [currentPageStudents, setCurrentPageStudents] = useState(1);
  const recordsPerPage = 50;
  const [processingDuplicates, setProcessingDuplicates] = useState(false);
  const [uploadingStudents, setUploadingStudents] = useState(false);
  const [studentNameMap, setStudentNameMap] = useState<Map<string, {name: string, class: string}>>(new Map());

  // Load student names and classes from Firebase
  const loadStudentNames = async () => {
    try {
      const studentsRef = collection(db, 'students');
      const snapshot = await getDocs(studentsRef);

      const nameMap = new Map<string, {name: string, class: string}>();
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.studentId && data.studentName) {
          nameMap.set(data.studentId, {
            name: data.studentName,
            class: data.class || ''
          });
        }
      });

      setStudentNameMap(nameMap);
      console.log(`[Student Names] Loaded ${nameMap.size} student names from Firebase`);
      return nameMap;
    } catch (err) {
      console.error('Failed to load student names:', err);
      return new Map<string, {name: string, class: string}>();
    }
  };

  const loadAttendance = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log(`Loading up to ${maxRecords} attendance records...`);

      // Load student names first if not already loaded
      let nameMap = studentNameMap;
      if (nameMap.size === 0) {
        nameMap = await loadStudentNames();
      }

      // Query attendance_records collection
      const recordsRef = collection(db, 'attendance_records');
      const q = query(
        recordsRef,
        orderBy('timestamp', 'desc'),
        limit(maxRecords)
      );

      const snapshot = await getDocs(q);
      console.log(`Found ${snapshot.docs.length} records`);

      // Parse records
      const allRecords: AttendanceRecord[] = [];
      const studentMap = new Map<string, StudentSummary>();

      snapshot.docs.forEach(doc => {
        const data = doc.data();

        // Look up student name and class from the map
        const studentData = nameMap.get(data.studentId);
        const studentName = studentData?.name || data.studentName || data.studentId || 'UNKNOWN';
        const studentClass = studentData?.class || data.class || '';

        // Debug: Log first few mismatches
        if (!studentData && nameMap.size > 0) {
          console.log(`[Name Lookup] No name found for studentId: "${data.studentId}"`);
        }

        const record: AttendanceRecord = {
          id: doc.id,
          studentId: data.studentId || 'UNKNOWN',
          studentName: studentName,
          class: studentClass,
          courseId: data.courseId || 'UNKNOWN',
          date: data.date?.toDate() || new Date(),
          timestamp: data.timestamp?.toDate() || data.date?.toDate() || new Date(),
          status: data.status || 'present',
          source: data.source || 'unknown',
          cameraId: data.cameraId,
          confidence: data.confidence
        };

        allRecords.push(record);

        // Group by student
        const studentId = record.studentId;
        if (!studentMap.has(studentId)) {
          studentMap.set(studentId, {
            studentId,
            studentName: record.studentName || studentId,
            totalRecords: 0,
            firstSeen: record.timestamp,
            lastSeen: record.timestamp,
            cameras: new Set(),
            courses: new Set(),
            records: []
          });
        }

        const summary = studentMap.get(studentId)!;
        summary.totalRecords++;
        summary.records.push(record);
        if (record.timestamp < summary.firstSeen) summary.firstSeen = record.timestamp;
        if (record.timestamp > summary.lastSeen) summary.lastSeen = record.timestamp;
        if (record.cameraId) summary.cameras.add(record.cameraId);
        summary.courses.add(record.courseId);
      });

      setRecords(allRecords);
      setStudents(studentMap);

      console.log(`Loaded ${allRecords.length} records for ${studentMap.size} students`);

    } catch (err) {
      console.error('Error loading attendance:', err);
      setError(err instanceof Error ? err.message : 'Failed to load attendance');
    } finally {
      setLoading(false);
    }
  };

  const exportToJSON = () => {
    const data = {
      exportDate: new Date().toISOString(),
      totalRecords: records.length,
      totalStudents: students.size,
      records: records.map(r => ({
        ...r,
        date: r.date.toISOString(),
        timestamp: r.timestamp.toISOString()
      })),
      students: Array.from(students.values()).map(s => ({
        ...s,
        firstSeen: s.firstSeen.toISOString(),
        lastSeen: s.lastSeen.toISOString(),
        cameras: Array.from(s.cameras),
        courses: Array.from(s.courses),
        records: s.records.length // Just count, not full records
      }))
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_export_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToCSV = () => {
    const headers = ['Record ID', 'Student ID', 'Student Name', 'Course ID', 'Date', 'Time', 'Status', 'Camera', 'Confidence'];
    const rows = records.map(r => [
      r.id,
      r.studentId,
      r.studentName || '',
      r.courseId,
      r.date.toLocaleDateString(),
      r.timestamp.toLocaleTimeString(),
      r.status,
      r.cameraId || '',
      r.confidence?.toFixed(2) || ''
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportEligibleStudentsToCSV = () => {
    const headers = ['Course Code', 'Unique Eligible Students', 'Total Records', 'Eligible Records', 'Eligibility Rate'];
    const rows = eligibleStudentsByCourse.map(course => [
      course.courseCode,
      course.uniqueStudents.size,
      course.totalRecords,
      course.eligibleRecords,
      ((course.eligibleRecords / course.totalRecords) * 100).toFixed(1) + '%'
    ]);

    // Add summary row
    const totalUniqueStudents = eligibleStudentsByCourse.reduce((sum, c) => sum + c.uniqueStudents.size, 0);
    const totalRecords = eligibleStudentsByCourse.reduce((sum, c) => sum + c.totalRecords, 0);
    const totalEligibleRecords = eligibleStudentsByCourse.reduce((sum, c) => sum + c.eligibleRecords, 0);

    rows.push(['']); // Empty row
    rows.push(['TOTAL', totalUniqueStudents, totalRecords, totalEligibleRecords, ((totalEligibleRecords / totalRecords) * 100).toFixed(1) + '%']);

    // Add student details section
    rows.push(['']); // Empty row
    rows.push(['STUDENT DETAILS BY COURSE']);
    rows.push(['Course Code', 'Student ID', 'Student Name', 'Class', 'Check-in Time', 'Eligible']);

    // Add individual student records for eligible students
    eligibleStudentsByCourse.forEach(course => {
      const eligibleRecordsForCourse = records.filter(record => {
        return record.courseId === course.courseCode && isEligibleRecord(record);
      });

      // Group by student and get earliest time
      const studentMap = new Map<string, AttendanceRecord>();
      eligibleRecordsForCourse.forEach(record => {
        const existing = studentMap.get(record.studentId);
        if (!existing || record.timestamp < existing.timestamp) {
          studentMap.set(record.studentId, record);
        }
      });

      // Sort by student ID
      const sortedStudents = Array.from(studentMap.values()).sort((a, b) =>
        a.studentId.localeCompare(b.studentId)
      );

      sortedStudents.forEach(record => {
        rows.push([
          course.courseCode,
          record.studentId,
          record.studentName,
          record.class || '',
          record.timestamp.toLocaleTimeString(),
          'YES'
        ]);
      });
    });

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eligible-students-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const runVerification = async () => {
    setVerifying(true);
    try {
      const result = await verifyAttendanceData();
      setVerificationResult(result);
      console.log('✅ Verification complete!');
    } catch (err) {
      console.error('Verification failed:', err);
      setError('Verification failed');
    } finally {
      setVerifying(false);
    }
  };

  // Get number of blocks for each semester
  const getBlockCount = (semester: string) => {
    if (semester === 'summer') return 1;
    if (semester === 'spring' || semester === 'fall') return 3;
    return 0;
  };

  // Load saved block configurations from Firebase (primary) and localStorage (cache)
  const loadSavedConfigs = async () => {
    try {
      // Try Firebase first (primary source - syncs across devices)
      const configRef = doc(db, 'system_config', 'attendance_blocks');
      const configDoc = await getDoc(configRef);

      if (configDoc.exists()) {
        const firebaseConfig = configDoc.data().blockConfigs || {};
        console.log('[AttendanceLoader] Loaded config from Firebase:', firebaseConfig);
        setSavedBlockConfigs(firebaseConfig);
        // Update memory cache (for webhook auto-assignment)
        updateBlockConfigCache(firebaseConfig);
        // Cache to localStorage for faster subsequent loads
        saveBlockConfigToLocalStorage(firebaseConfig);
        return firebaseConfig;
      } else {
        console.log('[AttendanceLoader] No Firebase config found, checking localStorage...');
        // Fallback to localStorage (legacy data)
        const saved = localStorage.getItem('attendance_block_configs');
        if (saved) {
          const parsed = JSON.parse(saved);
          console.log('[AttendanceLoader] Found localStorage config, migrating to Firebase:', parsed);
          setSavedBlockConfigs(parsed);
          // Update memory cache
          updateBlockConfigCache(parsed);
          // Migrate localStorage data to Firebase for future syncing
          await setDoc(configRef, { blockConfigs: parsed, updatedAt: serverTimestamp() });
          return parsed;
        }
      }
    } catch (err) {
      console.error('Failed to load saved configs:', err);
    }
    return {};
  };

  // Save block configuration to Firebase (primary) and localStorage (cache)
  const saveBlockConfig = async (semester: string, dates: {[key: number]: {start: string, end: string}}) => {
    try {
      const updated = {
        ...savedBlockConfigs,
        [semester]: dates
      };

      // Save to Firebase (primary - syncs across devices)
      const configRef = doc(db, 'system_config', 'attendance_blocks');
      await setDoc(configRef, {
        blockConfigs: updated,
        updatedAt: serverTimestamp()
      }, { merge: true });

      console.log('[AttendanceLoader] Saved config to Firebase:', updated);

      // Update memory cache (for webhook auto-assignment)
      updateBlockConfigCache(updated);

      // Cache to localStorage for faster subsequent loads
      saveBlockConfigToLocalStorage(updated);

      setSavedBlockConfigs(updated);
    } catch (err) {
      console.error('Failed to save config:', err);
      alert('Failed to save block configuration.');
    }
  };

  // Handle semester change
  const handleSemesterChange = (semester: 'spring' | 'summer' | 'fall' | '') => {
    setSelectedSemester(semester);

    // Load saved configuration if exists, otherwise initialize empty
    if (semester) {
      const count = getBlockCount(semester);

      // Check if we have saved configuration for this semester
      if (savedBlockConfigs[semester]) {
        setBlockDates(savedBlockConfigs[semester]);
      } else {
        // Initialize empty date ranges for each block
        const initial: {[key: number]: {start: string, end: string}} = {};
        for (let i = 1; i <= count; i++) {
          initial[i] = { start: '', end: '' };
        }
        setBlockDates(initial);
      }
    } else {
      setBlockDates({});
    }
  };

  // Update block date and auto-save
  const updateBlockDate = (blockNum: number, field: 'start' | 'end', value: string) => {
    const updated = {
      ...blockDates,
      [blockNum]: {
        ...blockDates[blockNum],
        [field]: value
      }
    };
    setBlockDates(updated);

    // Auto-save to localStorage
    if (selectedSemester) {
      saveBlockConfig(selectedSemester, updated);
    }
  };

  // Quick setup for Fall 2025 (includes November 13, 2025)
  const quickSetupFall2025 = () => {
    const fallDates = {
      1: { start: '2025-09-01', end: '2025-10-15' },
      2: { start: '2025-10-16', end: '2025-11-30' },
      3: { start: '2025-12-01', end: '2025-12-31' }
    };
    setSelectedSemester('fall');
    setBlockDates(fallDates);
    saveBlockConfig('fall', fallDates);
    alert('✓ Fall 2025 blocks configured!\n\nBlock 1: Sep 1 - Oct 15\nBlock 2: Oct 16 - Nov 30 (includes TODAY)\nBlock 3: Dec 1 - Dec 31\n\nNew attendance records will now be auto-assigned!');
  };

  // Get session from timestamp hour
  const getSession = (timestamp: Date): 'M' | 'A' | 'E' | null => {
    const hour = timestamp.getHours();
    const minute = timestamp.getMinutes();

    // Morning: 7:00 AM - 11:45 AM (cutoff 8:10)
    if (hour >= 7 && (hour < 11 || (hour === 11 && minute <= 45))) {
      return 'M';
    }
    // Noon break: 11:46 AM - 1:00 PM (13:00) - AUTO DELETE
    else if ((hour === 11 && minute >= 46) || hour === 12 || (hour === 13 && minute === 0)) {
      return null;
    }
    // Gap: 1:01 PM - 1:15 PM (no registration)
    else if (hour === 13 && minute >= 1 && minute <= 15) {
      return null;
    }
    // Afternoon: 1:16 PM - 5:00 PM (13:16 - 17:00) (cutoff 13:40)
    else if ((hour === 13 && minute >= 16) || (hour > 13 && hour < 17)) {
      return 'A';
    }
    // Gap: 5:00 PM - 5:29 PM (no registration)
    else if (hour === 17 && minute < 30) {
      return null;
    }
    // Evening: 5:30 PM - 8:30 PM (17:30 - 20:30) (cutoff 18:10)
    else if ((hour === 17 && minute >= 30) || (hour === 18) || (hour === 19) || (hour === 20 && minute <= 30)) {
      return 'E';
    }
    // Outside defined session times
    else {
      return null;
    }
  };

  // Check if current time is past the cutoff for a given session
  const isPastCutoff = (session: 'M' | 'A' | 'E' | null): boolean => {
    if (!session) return false;

    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();

    if (session === 'M') {
      // Morning cutoff: 8:10 AM
      return hour > 8 || (hour === 8 && minute >= 10);
    } else if (session === 'A') {
      // Afternoon cutoff: 13:40 (1:40 PM)
      return hour > 13 || (hour === 13 && minute >= 40);
    } else if (session === 'E') {
      // Evening cutoff: 18:10 (6:10 PM)
      return hour > 18 || (hour === 18 && minute >= 10);
    }
    return false;
  };

  // Process and delete duplicate records after cutoff times
  const processDuplicates = async () => {
    if (!confirm('This will delete duplicate attendance records for each student in sessions that are past their cutoff time.\n\nMorning cutoff: 8:10 AM\nAfternoon cutoff: 1:40 PM (13:40)\nEvening cutoff: 6:10 PM (18:10)\n\nOnly the EARLIEST record for each student in each session will be kept.\n\nContinue?')) {
      return;
    }

    try {
      setProcessingDuplicates(true);
      const batch = writeBatch(db);
      let deletedCount = 0;

      // Get today's date string
      const today = new Date().toISOString().split('T')[0];

      // Group records by date, courseId, and studentId
      const recordGroups = new Map<string, AttendanceRecord[]>();

      records.forEach(record => {
        const recordDate = record.timestamp.toISOString().split('T')[0];

        // Only process today's records
        if (recordDate !== today) return;

        const session = getSession(record.timestamp);

        // Skip records with no session or not past cutoff
        if (!session || !isPastCutoff(session)) return;

        const key = `${recordDate}_${record.courseId}_${record.studentId}`;

        if (!recordGroups.has(key)) {
          recordGroups.set(key, []);
        }
        recordGroups.get(key)!.push(record);
      });

      console.log(`[Duplicate Processing] Found ${recordGroups.size} unique student-course combinations`);

      // For each group, keep earliest and delete the rest
      recordGroups.forEach((group, key) => {
        if (group.length > 1) {
          // Sort by timestamp (earliest first)
          group.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

          const keepRecord = group[0];
          const deleteRecords = group.slice(1);

          console.log(`[Duplicate Processing] ${key}: Keeping ${keepRecord.id} (${keepRecord.timestamp.toLocaleTimeString()}), deleting ${deleteRecords.length} duplicates`);

          deleteRecords.forEach(record => {
            const docRef = doc(db, 'attendance_records', record.id);
            batch.delete(docRef);
            deletedCount++;
          });
        }
      });

      if (deletedCount > 0) {
        await batch.commit();
        alert(`✓ Successfully deleted ${deletedCount} duplicate records!\n\nKept the earliest record for each student in each session.`);

        // Reload attendance data
        await loadAttendance();
      } else {
        alert('No duplicate records found that are past their cutoff times.');
      }

    } catch (err) {
      console.error('Error processing duplicates:', err);
      alert('Failed to process duplicate records.');
    } finally {
      setProcessingDuplicates(false);
    }
  };

  // Upload students from JSON file to Firebase
  const uploadStudentsFromJSON = async () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';

    fileInput.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        setUploadingStudents(true);

        const text = await file.text();
        const students = JSON.parse(text);

        if (!Array.isArray(students)) {
          throw new Error('JSON file must contain an array of students');
        }

        console.log(`[Upload Students] Processing ${students.length} students...`);

        const batch = writeBatch(db);
        let uploadedCount = 0;

        students.forEach((student: any) => {
          if (student.studentId && student.studentName) {
            const docRef = doc(db, 'students', student.studentId);
            batch.set(docRef, {
              studentId: student.studentId,
              studentName: student.studentName,
              class: student.class || '',
              uploadedAt: serverTimestamp()
            });
            uploadedCount++;
          }
        });

        await batch.commit();

        // Reload student names
        await loadStudentNames();

        // Reload attendance to show updated names
        await loadAttendance();

        alert(`✓ Successfully uploaded ${uploadedCount} students to Firebase!\n\nStudent names will now appear in the attendance records.`);

      } catch (err) {
        console.error('Error uploading students:', err);
        alert(`Failed to upload students: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setUploadingStudents(false);
      }
    };

    fileInput.click();
  };

  // Delete all noon break recordings (11:46 AM - 1:00 PM)
  const deleteNoonBreakRecordings = async () => {
    if (!confirm('⚠️ This will delete ALL recordings during noon break (11:46 AM - 1:00 PM).\n\nThese are non-class times and should not have attendance records.\n\nContinue?')) {
      return;
    }

    try {
      setProcessingDuplicates(true);
      const batch = writeBatch(db);
      let deletedCount = 0;

      records.forEach(record => {
        const hour = record.timestamp.getHours();
        const minute = record.timestamp.getMinutes();

        // Check if time is in noon break: 11:46 AM - 1:00 PM (13:00)
        const isNoonBreak = (hour === 11 && minute >= 46) || hour === 12 || (hour === 13 && minute === 0);

        if (isNoonBreak) {
          const docRef = doc(db, 'attendance_records', record.id);
          batch.delete(docRef);
          deletedCount++;
          console.log(`[Delete Noon Break] Deleting ${record.id} at ${record.timestamp.toLocaleString()}`);
        }
      });

      if (deletedCount > 0) {
        await batch.commit();
        alert(`✓ Successfully deleted ${deletedCount} noon break recordings!\n\nAll records between 11:46 AM - 1:00 PM have been removed.`);

        // Reload attendance data
        await loadAttendance();
      } else {
        alert('No noon break recordings found.');
      }

    } catch (err) {
      console.error('Error deleting noon break recordings:', err);
      alert('Failed to delete noon break recordings.');
    } finally {
      setProcessingDuplicates(false);
    }
  };

  // Delete ALL duplicates since inception (regardless of date or cutoff)
  const deleteAllDuplicates = async () => {
    if (!confirm('⚠️ WARNING: This will delete ALL duplicate records in the entire database history!\n\nFor each student-course-date combination, only the EARLIEST record will be kept.\n\nThis action cannot be undone.\n\nAre you sure you want to continue?')) {
      return;
    }

    try {
      setProcessingDuplicates(true);
      const batch = writeBatch(db);
      let deletedCount = 0;

      // Group ALL records by date, courseId, and studentId
      const recordGroups = new Map<string, AttendanceRecord[]>();

      records.forEach(record => {
        const recordDate = record.timestamp.toISOString().split('T')[0];
        const key = `${recordDate}_${record.courseId}_${record.studentId}`;

        if (!recordGroups.has(key)) {
          recordGroups.set(key, []);
        }
        recordGroups.get(key)!.push(record);
      });

      console.log(`[Delete All Duplicates] Processing ${recordGroups.size} unique student-course-date combinations`);

      // For each group, keep earliest and delete the rest
      recordGroups.forEach((group, key) => {
        if (group.length > 1) {
          // Sort by timestamp (earliest first)
          group.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

          const keepRecord = group[0];
          const deleteRecords = group.slice(1);

          console.log(`[Delete All Duplicates] ${key}: Keeping ${keepRecord.id} (${keepRecord.timestamp.toLocaleString()}), deleting ${deleteRecords.length} duplicates`);

          deleteRecords.forEach(record => {
            const docRef = doc(db, 'attendance_records', record.id);
            batch.delete(docRef);
            deletedCount++;
          });
        }
      });

      if (deletedCount > 0) {
        await batch.commit();
        alert(`✓ Successfully deleted ${deletedCount} duplicate records from entire database history!\n\nKept the earliest record for each student-course-date combination.`);

        // Reload attendance data
        await loadAttendance();
      } else {
        alert('No duplicate records found in the database.');
      }

    } catch (err) {
      console.error('Error deleting all duplicates:', err);
      alert('Failed to delete duplicate records.');
    } finally {
      setProcessingDuplicates(false);
    }
  };

  // Log block configuration update to Firebase
  const logBlockUpdate = async (semester: string, blockConfig: any, updateStats: any) => {
    try {
      await addDoc(collection(db, 'attendance_block_logs'), {
        timestamp: serverTimestamp(),
        semester: semester,
        blockConfiguration: blockConfig,
        updateStats: updateStats,
        action: 'block_update',
        sessionRanges: {
          morning: '7:00 AM - 11:45 AM',
          noonBreak: '11:46 AM - 1:15 PM (DEFAULT_COURSE)',
          afternoon: '1:16 PM - 6:00 PM',
          evening: '6:00 PM - 9:00 PM',
          note: 'Times outside these ranges will use DEFAULT_COURSE'
        }
      });
      console.log('Block update logged to Firebase');
    } catch (err) {
      console.error('Failed to log block update:', err);
    }
  };

  // Update course codes based on block configuration
  const updateCourseCodes = async () => {
    if (!selectedSemester) {
      alert('Please select a semester first');
      return;
    }

    // Validate all blocks have dates
    const blockCount = getBlockCount(selectedSemester);
    for (let i = 1; i <= blockCount; i++) {
      if (!blockDates[i]?.start || !blockDates[i]?.end) {
        alert(`Please fill in start and end dates for Block ${i}`);
        return;
      }
    }

    if (!confirm(`Update all ${records.length} attendance records with block information?`)) {
      return;
    }

    try {
      setLoading(true);
      const batch = writeBatch(db);
      let updated = 0;
      let skipped = 0;
      let defaultCourseCount = 0;
      const sessionCounts = { M: 0, A: 0, E: 0 };
      const blockCounts: {[key: number]: number} = {};

      for (const record of records) {
        // SKIP records that already have correct block assignments (from webhook)
        if (record.courseId && record.courseId.startsWith('Blk') && record.courseId.includes('_')) {
          console.log(`[Batch Update] Skipping ${record.id} - already has block assignment: ${record.courseId}`);
          skipped++;
          continue;
        }

        const recordDate = record.timestamp.toISOString().split('T')[0]; // YYYY-MM-DD

        // Find which block this record belongs to
        let matchedBlock = null;
        for (let blockNum = 1; blockNum <= blockCount; blockNum++) {
          const blockStart = blockDates[blockNum].start;
          const blockEnd = blockDates[blockNum].end;

          if (recordDate >= blockStart && recordDate <= blockEnd) {
            matchedBlock = blockNum;
            break;
          }
        }

        if (matchedBlock) {
          // Get session from timestamp
          const session = getSession(record.timestamp);

          const docRef = doc(db, 'attendance_records', record.id);

          // If time is outside defined session ranges (e.g., noon break)
          if (!session) {
            // Update to DEFAULT_COURSE and clear block/session info
            batch.update(docRef, {
              courseId: 'DEFAULT_COURSE',
              semester: selectedSemester,
              block: null,
              session: null
            });
            updated++;
            defaultCourseCount++;
          } else {
            // Normal block assignment
            const courseCode = `Blk${matchedBlock}_${session}`;

            batch.update(docRef, {
              courseId: courseCode,
              semester: selectedSemester,
              block: matchedBlock,
              session: session
            });
            updated++;

            // Track statistics
            sessionCounts[session]++;
            blockCounts[matchedBlock] = (blockCounts[matchedBlock] || 0) + 1;
          }
        } else {
          skipped++;
        }
      }

      await batch.commit();

      // Log to Firebase
      await logBlockUpdate(selectedSemester, blockDates, {
        totalRecords: records.length,
        updated: updated,
        skipped: skipped,
        defaultCourseCount: defaultCourseCount,
        sessionBreakdown: sessionCounts,
        blockBreakdown: blockCounts
      });

      alert(`Successfully updated ${updated} records with block and session information!\n\nBreakdown:\n- Morning (M): ${sessionCounts.M}\n- Afternoon (A): ${sessionCounts.A}\n- Evening (E): ${sessionCounts.E}\n- DEFAULT_COURSE (noon break, etc.): ${defaultCourseCount}\n- Skipped (outside date range): ${skipped}`);

      // Reload attendance to show updated data
      await loadAttendance();
    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to update course codes. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  // Load saved configurations on mount
  useEffect(() => {
    loadSavedConfigs().catch(err => {
      console.error('Failed to load block configurations:', err);
    });
  }, []);

  useEffect(() => {
    loadAttendance();
  }, []);

  // Reset pagination when view changes
  useEffect(() => {
    setCurrentPageAll(1);
    setCurrentPageStudents(1);
  }, [view]);

  // Reset pagination when data is reloaded
  useEffect(() => {
    setCurrentPageAll(1);
    setCurrentPageStudents(1);
  }, [records.length, students.size]);

  const sortedStudents = Array.from(students.values()).sort((a, b) =>
    b.totalRecords - a.totalRecords
  );

  // Check if a record is eligible based on official attendance cutoff times
  const isEligibleRecord = (record: AttendanceRecord): boolean => {
    const hour = record.timestamp.getHours();
    const minute = record.timestamp.getMinutes();
    const session = getSession(record.timestamp);

    // Morning session: must check in before/at 8:05 AM
    if (session === 'M') {
      // Morning: must check in before/at 8:10 AM
      return hour < 8 || (hour === 8 && minute <= 10);
    }
    // Afternoon session: must check in before/at 1:40 PM (13:40)
    else if (session === 'A') {
      return hour < 13 || (hour === 13 && minute <= 40);
    }
    // Evening session: must check in before/at 6:10 PM (18:10)
    else if (session === 'E') {
      return hour < 18 || (hour === 18 && minute <= 10);
    }
    // Records with no session (noon break, etc.) are not eligible
    else {
      return false;
    }
  };

  // Calculate eligible students by course
  const eligibleStudentsByCourse = useMemo(() => {
    const courseMap = new Map<string, {
      courseCode: string;
      uniqueStudents: Set<string>;
      totalRecords: number;
      eligibleRecords: number;
      semester?: string;
      block?: number;
      session?: string;
    }>();

    records.forEach(record => {
      const courseCode = record.courseId;

      if (!courseMap.has(courseCode)) {
        courseMap.set(courseCode, {
          courseCode,
          uniqueStudents: new Set(),
          totalRecords: 0,
          eligibleRecords: 0
        });
      }

      const courseData = courseMap.get(courseCode)!;
      courseData.totalRecords++;

      if (isEligibleRecord(record)) {
        courseData.uniqueStudents.add(record.studentId);
        courseData.eligibleRecords++;
      }
    });

    return Array.from(courseMap.values()).sort((a, b) =>
      b.uniqueStudents.size - a.uniqueStudents.size
    );
  }, [records]);

  // Pagination calculations for All Records
  const totalPagesAll = Math.ceil(records.length / recordsPerPage);
  const indexOfLastRecordAll = currentPageAll * recordsPerPage;
  const indexOfFirstRecordAll = indexOfLastRecordAll - recordsPerPage;
  const currentRecordsAll = records.slice(indexOfFirstRecordAll, indexOfLastRecordAll);

  // Pagination calculations for By Students
  const totalPagesStudents = Math.ceil(sortedStudents.length / recordsPerPage);
  const indexOfLastStudentAll = currentPageStudents * recordsPerPage;
  const indexOfFirstStudentAll = indexOfLastStudentAll - recordsPerPage;
  const currentStudents = sortedStudents.slice(indexOfFirstStudentAll, indexOfLastStudentAll);

  // Pagination component
  const PaginationControls = ({ currentPage, totalPages, onPageChange }: { currentPage: number, totalPages: number, onPageChange: (page: number) => void }) => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex items-center justify-center gap-2 mt-4">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          Previous
        </button>

        {startPage > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="px-3 py-2 border rounded-lg hover:bg-gray-50"
            >
              1
            </button>
            {startPage > 2 && <span className="px-2">...</span>}
          </>
        )}

        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => onPageChange(number)}
            className={`px-3 py-2 border rounded-lg font-medium ${
              currentPage === number
                ? 'bg-blue-600 text-white border-blue-600'
                : 'hover:bg-gray-50'
            }`}
          >
            {number}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2">...</span>}
            <button
              onClick={() => onPageChange(totalPages)}
              className="px-3 py-2 border rounded-lg hover:bg-gray-50"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          Next
        </button>

        <span className="ml-4 text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w mx-auto space-y-3">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">All Attendance Records</h1>
              <p className="text-gray-600 mt-1">
                Loaded from Firebase attendance_records collection
                {studentNameMap.size > 0 && (
                  <span className="ml-2 text-green-600 font-semibold">
                    • {studentNameMap.size} student names loaded
                  </span>
                )}
              </p>
            </div>
            <div className="flex gap-2">
              <select
                value={maxRecords}
                onChange={(e) => setMaxRecords(Number(e.target.value))}
                className="p-2 border rounded-lg"
              >
                <option value={100}>100 records</option>
                <option value={500}>500 records</option>
                <option value={1000}>1,000 records</option>
                <option value={5000}>5,000 records</option>
                <option value={10000}>10,000 records</option>
              </select>
              <button
                onClick={loadAttendance}
                disabled={loading}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Loading...' : 'Reload'}
              </button>
              <button
                onClick={exportToJSON}
                disabled={records.length === 0}
                className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                JSON
              </button>
              <button
                onClick={exportToCSV}
                disabled={records.length === 0}
                className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                CSV
              </button>
              <button
                onClick={runVerification}
                disabled={verifying || records.length === 0}
                className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 flex items-center gap-2"
              >
                <CheckCircle className={`w-4 h-4 ${verifying ? 'animate-spin' : ''}`} />
                {verifying ? 'Verifying...' : 'Verify Match'}
              </button>
              <button
                onClick={processDuplicates}
                disabled={processingDuplicates || records.length === 0}
                className="p-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-400 flex items-center gap-2"
              >
                <AlertCircle className={`w-4 h-4 ${processingDuplicates ? 'animate-spin' : ''}`} />
                {processingDuplicates ? 'Processing...' : 'Del. Dup. Today'}
              </button>
              <button
                onClick={deleteAllDuplicates}
                disabled={processingDuplicates || records.length === 0}
                className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 flex items-center gap-2"
              >
                <AlertCircle className={`w-4 h-4 ${processingDuplicates ? 'animate-spin' : ''}`} />
                {processingDuplicates ? 'Processing...' : 'Del. ALL Dup.'}
              </button>
              <button
                onClick={uploadStudentsFromJSON}
                disabled={uploadingStudents}
                className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 flex items-center gap-2"
              >
                <Users className={`w-4 h-4 ${uploadingStudents ? 'animate-spin' : ''}`} />
                {uploadingStudents ? 'Uploading...' : 'Upload Students'}
              </button>
              <button
                onClick={deleteNoonBreakRecordings}
                disabled={processingDuplicates || records.length === 0}
                className="p-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:bg-gray-400 flex items-center gap-2"
              >
                <AlertCircle className={`w-4 h-4 ${processingDuplicates ? 'animate-spin' : ''}`} />
                {processingDuplicates ? 'Processing...' : 'Del. Noon Break'}
              </button>
            </div>
          </div>

          {/* Current Block Status */}
          {(() => {
            const now = new Date();
            const currentBlock = getBlockInfoFromTimestamp(now);
            const hasConfigs = Object.keys(savedBlockConfigs).length > 0;

            return (
              <div className={`mt-4 p-4 rounded-lg border-2 ${
                currentBlock
                  ? 'bg-green-50 border-green-300'
                  : 'bg-yellow-50 border-yellow-300'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${currentBlock ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
                    <div>
                      {currentBlock ? (
                        <>
                          <p className="font-semibold text-green-900">
                            ✓ Auto-Assignment Active: <span className="font-mono bg-green-200 px-2 py-1 rounded">{currentBlock.courseCode}</span>
                          </p>
                          <p className="text-sm text-green-700">
                            Today ({now.toLocaleDateString()}) is in {currentBlock.semester.charAt(0).toUpperCase() + currentBlock.semester.slice(1)} Semester, Block {currentBlock.block}, {currentBlock.session === 'M' ? 'Morning' : currentBlock.session === 'A' ? 'Afternoon' : 'Evening'} session
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="font-semibold text-yellow-900">
                            ⚠ Auto-Assignment Inactive
                          </p>
                          <p className="text-sm text-yellow-700">
                            {hasConfigs
                              ? `Today (${now.toLocaleDateString()}) is not within any configured block dates. New records will use DEFAULT_COURSE.`
                              : 'No block configurations found. New records will use DEFAULT_COURSE.'
                            }
                          </p>
                          {!hasConfigs && (
                            <button
                              onClick={quickSetupFall2025}
                              className="mt-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-semibold text-sm flex items-center gap-2"
                            >
                              ⚡ Quick Setup Fall 2025 (for today)
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setShowBlockForm(!showBlockForm)}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 flex items-center gap-2 shadow-lg font-semibold"
                  >
                    <Settings className="w-5 h-5" />
                    {showBlockForm ? 'Hide Block Configuration' : 'Configure Blocks'}
                  </button>
                </div>
              </div>
            );
          })()}

          {/* Block & Semester Configuration Form */}
          {showBlockForm && (
            <div className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Configure Block & Semester Time Periods</h3>

              <div className="bg-white rounded-lg p-6 mb-4">
                {/* Semester Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Step 1: Select Semester
                  </label>
                  <select
                    value={selectedSemester}
                    onChange={(e) => handleSemesterChange(e.target.value as any)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                  >
                    <option value="">-- Choose Semester --</option>
                    <option value="spring">
                      🌸 Spring Semester (3 blocks) {savedBlockConfigs['spring'] ? '✓ Saved' : ''}
                    </option>
                    <option value="summer">
                      ☀️ Summer Semester (1 block) {savedBlockConfigs['summer'] ? '✓ Saved' : ''}
                    </option>
                    <option value="fall">
                      🍂 Fall Semester (3 blocks) {savedBlockConfigs['fall'] ? '✓ Saved' : ''}
                    </option>
                  </select>

                  {/* Show saved indicator */}
                  {selectedSemester && savedBlockConfigs[selectedSemester] && (
                    <p className="mt-2 text-sm text-green-600 font-medium">
                      ✓ This semester has saved block configurations
                    </p>
                  )}
                </div>

                {/* Block Date Configuration Table */}
                {selectedSemester && (
                  <div className="mb-6">
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      Step 2: Set Time Period for Each Block
                    </label>
                    <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700">Block</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700">Start Date</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700">End Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {Array.from({ length: getBlockCount(selectedSemester) }, (_, i) => i + 1).map(blockNum => (
                            <tr key={blockNum} className="hover:bg-gray-50">
                              <td className="px-4 py-3 font-semibold text-blue-600">
                                Block {blockNum}
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  type="date"
                                  value={blockDates[blockNum]?.start || ''}
                                  onChange={(e) => updateBlockDate(blockNum, 'start', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  type="date"
                                  value={blockDates[blockNum]?.end || ''}
                                  onChange={(e) => updateBlockDate(blockNum, 'end', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setShowBlockForm(false);
                      setSelectedSemester('');
                      setBlockDates({});
                    }}
                    className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={updateCourseCodes}
                    disabled={!selectedSemester || loading}
                    className="px-6 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 disabled:bg-gray-400 font-semibold flex items-center gap-2"
                  >
                    {loading ? 'Updating...' : '✓ Update All Course Codes'}
                  </button>
                </div>
              </div>

              {/* Information Box */}
              <div className="bg-blue-100 border border-blue-300 rounded-lg p-4">
                <p className="text-sm text-blue-900 font-semibold mb-2">
                  📖 How it works:
                </p>
                <ul className="space-y-1 text-sm text-blue-800">
                  <li>1. Select a semester (Spring, Summer, or Fall)</li>
                  <li>2. Enter start and end dates for each block</li>
                  <li>3. Click "Update All Course Codes" to automatically update all attendance records</li>
                  <li>4. The system will check each record's timestamp and assign it to the correct block</li>
                  <li>5. Session codes are automatically added based on time:</li>
                  <li className="ml-6">• <strong>M</strong> (Morning): 7:00 AM - 11:45 AM (cutoff 8:10 AM)</li>
                  <li className="ml-6 text-red-700">• <strong>NOON BREAK</strong>: 11:46 AM - 1:00 PM → AUTO DELETE</li>
                  <li className="ml-6">• <strong>A</strong> (Afternoon): 1:16 PM - 5:00 PM (cutoff 1:40 PM)</li>
                  <li className="ml-6">• <strong>E</strong> (Evening): 5:30 PM - 8:30 PM (cutoff 6:10 PM)</li>
                  <li className="ml-6 text-orange-700">• <strong>Other times</strong>: No registration (gaps between sessions)</li>
                  <li>6. Result example: <code className="bg-white px-2 py-1 rounded font-mono">Blk2_M</code> = Block 2, Morning session</li>
                  <li>7. All updates are logged to Firebase for tracking</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Verification Results */}
        {verificationResult && (
          <div className="mt-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-purple-900">Database Match Results</h3>
              {verificationResult.unmatchedIds.length > 0 && (
                <button
                  onClick={() => exportUnmatchedStudents(verificationResult.unmatchedIds)}
                  className="text-sm px-3 py-1 bg-white border border-purple-300 rounded hover:bg-purple-50"
                >
                  Export Unmatched
                </button>
              )}
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Match Rate</p>
                <p className={`text-2xl font-bold ${
                  verificationResult.matchRate > 80 ? 'text-green-600' :
                  verificationResult.matchRate > 50 ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {verificationResult.matchRate.toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-gray-600">Matched Students</p>
                <p className="text-2xl font-bold text-green-600">{verificationResult.matched}</p>
              </div>
              <div>
                <p className="text-gray-600">Unmatched</p>
                <p className="text-2xl font-bold text-red-600">{verificationResult.unmatched}</p>
              </div>
            </div>
            {verificationResult.unmatched > 0 && (
              <div className="mt-3 p-3 bg-yellow-50 rounded text-sm">
                <p className="font-medium text-yellow-900">⚠️ Action Required:</p>
                <p className="text-yellow-800 mt-1">
                  {verificationResult.unmatched} student(s) in attendance are not in your student database.
                  Click "Export Unmatched" to get a list.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-blue-600 mb-2">
                <Calendar className="w-5 h-5" />
                <span className="font-medium">Total Records</span>
              </div>
              <p className="text-3xl font-bold text-blue-900">{records.length}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-green-600 mb-2">
                <Users className="w-5 h-5" />
                <span className="font-medium">Unique Students</span>
              </div>
              <p className="text-3xl font-bold text-green-900">{students.size}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-purple-600 mb-2">
                <Camera className="w-5 h-5" />
                <span className="font-medium">AI Detections</span>
              </div>
              <p className="text-3xl font-bold text-purple-900">
                {records.filter(r => r.source === 'ai-camera').length}
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-600 mb-2">
                <Calendar className="w-5 h-5" />
                <span className="font-medium">Date Range</span>
              </div>
              <p className="text-sm font-medium text-yellow-900">
                {records.length > 0 ? (
                  <>
                    {records[records.length - 1].date.toLocaleDateString()}
                    <br />to {records[0].date.toLocaleDateString()}
                  </>
                ) : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* View Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b flex">
            <button
              onClick={() => setView('all')}
              className={`px-6 py-3 font-medium ${
                view === 'all'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All Records ({records.length})
            </button>
            <button
              onClick={() => setView('by-student')}
              className={`px-6 py-3 font-medium ${
                view === 'by-student'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              By Student ({students.size})
            </button>
            <button
              onClick={() => setView('eligible')}
              className={`px-6 py-3 font-medium ${
                view === 'eligible'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Eligible Students ({eligibleStudentsByCourse.reduce((sum, c) => sum + c.uniqueStudents.size, 0)})
            </button>
          </div>

          <div className="p-6">
            {view === 'all' ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-gray-700">Time</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-700">Student ID</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-700">Name</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-700">Class</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-700">Course ID</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-700">Status</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-700">Camera</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-700">Confidence</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {currentRecordsAll.map(record => (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 whitespace-nowrap">
                          {record.timestamp.toLocaleString()}
                        </td>
                        <td className="px-4 py-2 font-medium">{record.studentId}</td>
                        <td className="px-4 py-2">{record.studentName}</td>
                        <td className="px-4 py-2">{record.class || '-'}</td>
                        <td className="px-4 py-2">{record.courseId}</td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            record.status === 'present' ? 'bg-green-100 text-green-800' : 'bg-gray-100'
                          }`}>
                            {record.status}
                          </span>
                        </td>
                        <td className="px-4 py-2">{record.cameraId || '-'}</td>
                        <td className="px-4 py-2">
                          {record.confidence ? `${(record.confidence * 100).toFixed(0)}%` : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination for All Records */}
                {records.length > 0 && (
                  <div className="mt-4">
                    <p className="text-center text-gray-600 text-sm mb-2">
                      Showing {indexOfFirstRecordAll + 1} to {Math.min(indexOfLastRecordAll, records.length)} of {records.length} records
                    </p>
                    <PaginationControls
                      currentPage={currentPageAll}
                      totalPages={totalPagesAll}
                      onPageChange={setCurrentPageAll}
                    />
                  </div>
                )}
              </div>
            ) : view === 'by-student' ? (
              <div>
                <div className="space-y-3">
                  {currentStudents.map(student => (
                    <div key={student.studentId} className="border rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">{student.studentName}</h3>
                          <p className="text-sm text-gray-600">ID: {student.studentId}</p>
                        </div>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                          {student.totalRecords} records
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">First Seen</p>
                          <p className="font-medium">{student.firstSeen.toLocaleDateString()}</p>
                          <p className="text-xs text-gray-500">{student.firstSeen.toLocaleTimeString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Last Seen</p>
                          <p className="font-medium">{student.lastSeen.toLocaleDateString()}</p>
                          <p className="text-xs text-gray-500">{student.lastSeen.toLocaleTimeString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Cameras</p>
                          <p className="font-medium">{student.cameras.size} camera(s)</p>
                          <p className="text-xs text-gray-500">{Array.from(student.cameras).join(', ')}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Courses</p>
                          <p className="font-medium">{student.courses.size} course(s)</p>
                          <p className="text-xs text-gray-500">{Array.from(student.courses).join(', ')}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination for By Student */}
                {sortedStudents.length > 0 && (
                  <div className="mt-4">
                    <p className="text-center text-gray-600 text-sm mb-2">
                      Showing {indexOfFirstStudentAll + 1} to {Math.min(indexOfLastStudentAll, sortedStudents.length)} of {sortedStudents.length} students
                    </p>
                    <PaginationControls
                      currentPage={currentPageStudents}
                      totalPages={totalPagesStudents}
                      onPageChange={setCurrentPageStudents}
                    />
                  </div>
                )}
              </div>
            ) : view === 'eligible' ? (
              <div>
                {/* Information banner */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-300 rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-bold text-green-900 mb-2">📊 Official Attendance Cutoff Times</h3>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="bg-white rounded-lg p-3 border border-green-200">
                      <p className="font-semibold text-gray-700">Morning Session</p>
                      <p className="text-green-600 font-bold text-lg">≤ 8:10 AM</p>
                      <p className="text-xs text-gray-500">Must check in by 8:10 AM</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-blue-200">
                      <p className="font-semibold text-gray-700">Afternoon Session</p>
                      <p className="text-blue-600 font-bold text-lg">≤ 1:40 PM</p>
                      <p className="text-xs text-gray-500">Must check in by 1:40 PM</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-purple-200">
                      <p className="font-semibold text-gray-700">Evening Session</p>
                      <p className="text-purple-600 font-bold text-lg">≤ 6:10 PM</p>
                      <p className="text-xs text-gray-500">Must check in by 6:10 PM</p>
                    </div>
                  </div>
                </div>

                {/* Export button for eligible students */}
                <div className="mb-4">
                  <button
                    onClick={exportEligibleStudentsToCSV}
                    disabled={eligibleStudentsByCourse.length === 0}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg transition"
                  >
                    <Download className="w-5 h-5" />
                    Export Eligible Students CSV
                  </button>
                </div>

                {/* Eligible students by course */}
                <div className="space-y-3">
                  {eligibleStudentsByCourse.map(course => (
                    <div key={course.courseCode} className="border-2 border-gray-200 rounded-lg p-5 hover:shadow-lg transition bg-white">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{course.courseCode}</h3>
                          <p className="text-sm text-gray-600 mt-1">Official Attendance Report</p>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-bold text-green-600">{course.uniqueStudents.size}</p>
                          <p className="text-sm text-gray-600">Eligible Students</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-600 mb-1">Total Records</p>
                          <p className="text-xl font-bold text-gray-900">{course.totalRecords}</p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-3">
                          <p className="text-xs text-green-700 mb-1">Eligible Records</p>
                          <p className="text-xl font-bold text-green-600">{course.eligibleRecords}</p>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-3">
                          <p className="text-xs text-blue-700 mb-1">Unique Students</p>
                          <p className="text-xl font-bold text-blue-600">{course.uniqueStudents.size}</p>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-3">
                          <p className="text-xs text-purple-700 mb-1">Eligibility Rate</p>
                          <p className="text-xl font-bold text-purple-600">
                            {course.totalRecords > 0 ? ((course.eligibleRecords / course.totalRecords) * 100).toFixed(1) : 0}%
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {eligibleStudentsByCourse.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <p className="text-lg">No eligible students found</p>
                    <p className="text-sm mt-2">Load attendance records and ensure block information is configured</p>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
