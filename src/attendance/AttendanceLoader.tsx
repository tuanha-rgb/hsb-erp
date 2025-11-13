// AttendanceLoader.tsx
// Simple component to load and display ALL attendance records from Firebase

import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, limit, doc, updateDoc, writeBatch, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/firebase.config';
import { Users, Calendar, Camera, Download, RefreshCw, AlertCircle, CheckCircle, Settings } from 'lucide-react';
import { verifyAttendanceData, exportUnmatchedStudents } from './verify-attendance';
import { getBlockInfoFromTimestamp } from './blockUtils';

interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName?: string;
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
  const [view, setView] = useState<'all' | 'by-student'>('all');
  const [maxRecords, setMaxRecords] = useState(1000);
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

  const loadAttendance = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log(`Loading up to ${maxRecords} attendance records...`);

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

        const record: AttendanceRecord = {
          id: doc.id,
          studentId: data.studentId || 'UNKNOWN',
          studentName: data.studentName || data.studentId || 'UNKNOWN',
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
    const headers = ['Record ID', 'Student ID', 'Student Name', 'Course ID', 'Date', 'Time', 'Status', 'Source', 'Camera', 'Confidence'];
    const rows = records.map(r => [
      r.id,
      r.studentId,
      r.studentName || '',
      r.courseId,
      r.date.toLocaleDateString(),
      r.timestamp.toLocaleTimeString(),
      r.status,
      r.source,
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

  // Load saved block configurations from localStorage
  const loadSavedConfigs = () => {
    try {
      const saved = localStorage.getItem('attendance_block_configs');
      if (saved) {
        const parsed = JSON.parse(saved);
        setSavedBlockConfigs(parsed);
        return parsed;
      }
    } catch (err) {
      console.error('Failed to load saved configs:', err);
    }
    return {};
  };

  // Save block configuration to localStorage
  const saveBlockConfig = (semester: string, dates: {[key: number]: {start: string, end: string}}) => {
    try {
      const updated = {
        ...savedBlockConfigs,
        [semester]: dates
      };
      localStorage.setItem('attendance_block_configs', JSON.stringify(updated));
      setSavedBlockConfigs(updated);
    } catch (err) {
      console.error('Failed to save config:', err);
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

  // Get session from timestamp hour
  const getSession = (timestamp: Date): 'M' | 'A' | 'E' => {
    const hour = timestamp.getHours();

    if (hour >= 7 && hour < 13) {
      return 'M'; // Morning: 7:00 AM - 1:00 PM
    } else if (hour >= 13 && hour < 18) {
      return 'A'; // Afternoon: 1:00 PM - 6:00 PM
    } else {
      return 'E'; // Evening: 6:00 PM - 9:00 PM
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
          morning: '7:00 AM - 1:00 PM',
          afternoon: '1:00 PM - 6:00 PM',
          evening: '6:00 PM - 9:00 PM'
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
      const sessionCounts = { M: 0, A: 0, E: 0 };
      const blockCounts: {[key: number]: number} = {};

      for (const record of records) {
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
          const courseCode = `Blk${matchedBlock}_${session}`;

          const docRef = doc(db, 'attendance_records', record.id);
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
        sessionBreakdown: sessionCounts,
        blockBreakdown: blockCounts
      });

      alert(`Successfully updated ${updated} records with block and session information!\n\nBreakdown:\n- Morning (M): ${sessionCounts.M}\n- Afternoon (A): ${sessionCounts.A}\n- Evening (E): ${sessionCounts.E}\n- Skipped: ${skipped}`);

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
    loadSavedConfigs();
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">All Attendance Records</h1>
              <p className="text-gray-600 mt-1">Loaded from Firebase attendance_records collection</p>
            </div>
            <div className="flex gap-2">
              <select
                value={maxRecords}
                onChange={(e) => setMaxRecords(Number(e.target.value))}
                className="px-3 py-2 border rounded-lg"
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
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Loading...' : 'Reload'}
              </button>
              <button
                onClick={exportToJSON}
                disabled={records.length === 0}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                JSON
              </button>
              <button
                onClick={exportToCSV}
                disabled={records.length === 0}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                CSV
              </button>
              <button
                onClick={runVerification}
                disabled={verifying || records.length === 0}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 flex items-center gap-2"
              >
                <CheckCircle className={`w-4 h-4 ${verifying ? 'animate-spin' : ''}`} />
                {verifying ? 'Verifying...' : 'Verify Match'}
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
                              : 'No block configurations found. Click "Add Block & Semester Info" to configure.'
                            }
                          </p>
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
                  <li className="ml-6">• <strong>M</strong> (Morning): 7:00 AM - 1:00 PM</li>
                  <li className="ml-6">• <strong>A</strong> (Afternoon): 1:00 PM - 6:00 PM</li>
                  <li className="ml-6">• <strong>E</strong> (Evening): 6:00 PM - 9:00 PM</li>
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
                      <th className="px-4 py-2 text-left font-medium text-gray-700">Course</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-700">Status</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-700">Source</th>
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
                        <td className="px-4 py-2">{record.courseId}</td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            record.status === 'present' ? 'bg-green-100 text-green-800' : 'bg-gray-100'
                          }`}>
                            {record.status}
                          </span>
                        </td>
                        <td className="px-4 py-2">{record.source}</td>
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
            ) : (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
