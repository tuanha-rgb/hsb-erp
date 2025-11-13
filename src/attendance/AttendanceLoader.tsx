// AttendanceLoader.tsx
// Simple component to load and display ALL attendance records from Firebase

import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, limit, doc, updateDoc, writeBatch } from 'firebase/firestore';
import { db } from '../firebase/firebase.config';
import { Users, Calendar, Camera, Download, RefreshCw, AlertCircle, CheckCircle, Settings } from 'lucide-react';
import { verifyAttendanceData, exportUnmatchedStudents } from './verify-attendance';

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

  // Handle semester change
  const handleSemesterChange = (semester: 'spring' | 'summer' | 'fall' | '') => {
    setSelectedSemester(semester);
    setBlockDates({});

    // Initialize empty date ranges for each block
    if (semester) {
      const count = getBlockCount(semester);
      const initial: {[key: number]: {start: string, end: string}} = {};
      for (let i = 1; i <= count; i++) {
        initial[i] = { start: '', end: '' };
      }
      setBlockDates(initial);
    }
  };

  // Update block date
  const updateBlockDate = (blockNum: number, field: 'start' | 'end', value: string) => {
    setBlockDates(prev => ({
      ...prev,
      [blockNum]: {
        ...prev[blockNum],
        [field]: value
      }
    }));
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
          const docRef = doc(db, 'attendance_records', record.id);
          batch.update(docRef, {
            courseId: `Blk${matchedBlock}`,
            semester: selectedSemester,
            block: matchedBlock
          });
          updated++;
        }
      }

      await batch.commit();
      alert(`Successfully updated ${updated} records with block information!`);

      // Reload attendance to show updated data
      await loadAttendance();
    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to update course codes. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendance();
  }, []);

  const sortedStudents = Array.from(students.values()).sort((a, b) =>
    b.totalRecords - a.totalRecords
  );

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

          {/* Add Block & Semester Button */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => setShowBlockForm(!showBlockForm)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 flex items-center gap-2 shadow-lg font-semibold"
            >
              <Settings className="w-5 h-5" />
              {showBlockForm ? 'Hide Block Configuration' : 'Add Block & Semester Info'}
            </button>
          </div>

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
                    <option value="spring">🌸 Spring Semester (3 blocks)</option>
                    <option value="summer">☀️ Summer Semester (1 block)</option>
                    <option value="fall">🍂 Fall Semester (3 blocks)</option>
                  </select>
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
                    {records.slice(0, 100).map(record => (
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
                {records.length > 100 && (
                  <p className="text-center text-gray-500 mt-4">
                    Showing first 100 of {records.length} records. Export for full data.
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {sortedStudents.map(student => (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
