import { useState } from 'react';
import {
  importEnrollmentsFromCSV,
  importEnrollmentsFromJSON,
  updateAllAttendanceRecords,
  getMatchingStats,
  getAllEnrollments
} from './enrollmentService';
import { StudentEnrollment } from './enrollmentModel';

interface ImportResult {
  imported: number;
  errors: string[];
}

interface MatchingResult {
  total: number;
  matched: number;
  unmatched: number;
  errors: string[];
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export default function EnrollmentImporter() {
  const [csvData, setCsvData] = useState('');
  const [jsonData, setJsonData] = useState('');
  const [importMode, setImportMode] = useState<'csv' | 'json'>('csv');
  const [previewData, setPreviewData] = useState<StudentEnrollment[]>([]);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [matchingResult, setMatchingResult] = useState<MatchingResult | null>(null);
  const [matchingStats, setMatchingStats] = useState<any>(null);
  const [existingEnrollments, setExistingEnrollments] = useState<StudentEnrollment[]>([]);
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const handlePreview = () => {
    try {
      if (importMode === 'csv') {
        const lines = csvData.trim().split('\n');
        if (lines.length < 2) {
          showToast('CSV must have headers and at least one data row', 'error');
          return;
        }

        const headers = lines[0].split(',').map(h => h.trim());

        // Group by studentId + semester to build complete enrollments
        const enrollmentMap = new Map<string, StudentEnrollment>();

        for (let i = 1; i < Math.min(16, lines.length); i++) { // Preview first 15 rows
          const values = lines[i].split(',').map(v => v.trim());
          const row: Record<string, string> = {};
          headers.forEach((header, index) => {
            row[header] = values[index] || '';
          });

          const studentId = row.studentId || row.student_id || '';
          const semester = row.semester || '';
          const blockNumber = parseInt(row.block);
          const key = `${studentId}_${semester}`;

          let enrollment = enrollmentMap.get(key);
          if (!enrollment) {
            enrollment = {
              studentId,
              semester,
              blocks: []
            };
            enrollmentMap.set(key, enrollment);
          }

          enrollment.blocks.push({
            blockNumber: blockNumber as 1 | 2 | 3,
            startDate: row.startDate,
            endDate: row.endDate,
            courses: {
              morning: row.morningCourse || row.morning || undefined,
              afternoon: row.afternoonCourse || row.afternoon || undefined,
              night: row.nightCourse || row.night || undefined
            }
          });
        }

        const preview = Array.from(enrollmentMap.values()).slice(0, 5);
        setPreviewData(preview);
        showToast(`Preview loaded: ${preview.length} students`, 'success');
      } else {
        const parsed = JSON.parse(jsonData);
        const enrollments = Array.isArray(parsed) ? parsed : [parsed];
        setPreviewData(enrollments.slice(0, 5));
        showToast(`Preview loaded: ${Math.min(5, enrollments.length)} students`, 'success');
      }
    } catch (error: any) {
      showToast(`Preview error: ${error.message}`, 'error');
    }
  };

  const handleImport = async () => {
    setLoading(true);
    setImportResult(null);

    try {
      let result: ImportResult;

      if (importMode === 'csv') {
        result = await importEnrollmentsFromCSV(csvData);
      } else {
        const parsed = JSON.parse(jsonData);
        const enrollments = Array.isArray(parsed) ? parsed : [parsed];
        result = await importEnrollmentsFromJSON(enrollments);
      }

      setImportResult(result);

      if (result.imported > 0) {
        showToast(`Successfully imported ${result.imported} enrollments`, 'success');
        if (result.errors.length > 0) {
          showToast(`${result.errors.length} errors occurred`, 'error');
        }
        // Refresh existing enrollments
        await loadExistingEnrollments();
      } else {
        showToast('No records imported', 'error');
      }
    } catch (error: any) {
      showToast(`Import failed: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleMatchAttendance = async () => {
    setLoading(true);
    setMatchingResult(null);

    try {
      const result = await updateAllAttendanceRecords();
      setMatchingResult(result);

      if (result.matched > 0) {
        showToast(`Matched ${result.matched} attendance records`, 'success');
        // Refresh stats
        await loadMatchingStats();
      } else {
        showToast('No records were matched', 'info');
      }

      if (result.errors.length > 0) {
        showToast(`${result.errors.length} records could not be matched`, 'error');
      }
    } catch (error: any) {
      showToast(`Matching failed: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadMatchingStats = async () => {
    try {
      const stats = await getMatchingStats();
      setMatchingStats(stats);
    } catch (error: any) {
      console.error('Error loading stats:', error);
    }
  };

  const loadExistingEnrollments = async () => {
    try {
      const enrollments = await getAllEnrollments();
      setExistingEnrollments(enrollments);
    } catch (error: any) {
      console.error('Error loading enrollments:', error);
    }
  };

  const sampleCSV = `studentId,semester,block,startDate,endDate,morningCourse,afternoonCourse,nightCourse
S001001,2024-2025-1,1,2024-09-01,2024-10-15,CS101,MATH201,
S001001,2024-2025-1,2,2024-10-16,2024-11-30,CS201,MATH301,
S001001,2024-2025-1,3,2024-12-01,2025-01-15,CS301,,PHYS401
S001002,2024-2025-1,1,2024-09-01,2024-10-15,CS101,,BIO401
S001002,2024-2025-1,2,2024-10-16,2024-11-30,CS201,CHEM201,`;

  const sampleJSON = `[
  {
    "studentId": "S001001",
    "semester": "2024-2025-1",
    "blocks": [
      {
        "blockNumber": 1,
        "startDate": "2024-09-01",
        "endDate": "2024-10-15",
        "courses": {
          "morning": "CS101",
          "afternoon": "MATH201"
        }
      },
      {
        "blockNumber": 2,
        "startDate": "2024-10-16",
        "endDate": "2024-11-30",
        "courses": {
          "morning": "CS201",
          "afternoon": "MATH301"
        }
      }
    ]
  }
]`;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Toasts */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`px-4 py-3 rounded shadow-lg ${
              toast.type === 'success' ? 'bg-green-500 text-white' :
              toast.type === 'error' ? 'bg-red-500 text-white' :
              'bg-blue-500 text-white'
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Student Enrollment Import</h1>
        <p className="text-gray-600">Import student course enrollments to enable automatic attendance-to-course matching</p>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Existing Enrollments</div>
          <div className="text-2xl font-bold text-blue-600">
            {existingEnrollments.length}
          </div>
          <button
            onClick={loadExistingEnrollments}
            className="text-xs text-blue-500 hover:underline mt-1"
          >
            Refresh
          </button>
        </div>

        {matchingStats && (
          <>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-gray-600">Match Rate</div>
              <div className="text-2xl font-bold text-green-600">
                {matchingStats.matchRate.toFixed(1)}%
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {matchingStats.matched} of {matchingStats.totalRecords} records
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-gray-600">Unmatched Records</div>
              <div className="text-2xl font-bold text-orange-600">
                {matchingStats.unmatched}
              </div>
              <button
                onClick={loadMatchingStats}
                className="text-xs text-blue-500 hover:underline mt-1"
              >
                Refresh Stats
              </button>
            </div>
          </>
        )}
      </div>

      {/* Import Mode Selector */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Import Data</h2>

        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setImportMode('csv')}
            className={`px-4 py-2 rounded ${
              importMode === 'csv'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            CSV Format
          </button>
          <button
            onClick={() => setImportMode('json')}
            className={`px-4 py-2 rounded ${
              importMode === 'json'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            JSON Format
          </button>
        </div>

        {/* CSV Input */}
        {importMode === 'csv' && (
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                CSV Data (headers: studentId, semester, block, startDate, endDate, morningCourse, afternoonCourse, nightCourse)
              </label>
              <button
                onClick={() => setCsvData(sampleCSV)}
                className="text-xs text-blue-500 hover:underline"
              >
                Load Sample
              </button>
            </div>
            <textarea
              value={csvData}
              onChange={(e) => setCsvData(e.target.value)}
              placeholder="Paste CSV data here..."
              className="w-full h-48 p-3 border border-gray-300 rounded font-mono text-sm"
            />
          </div>
        )}

        {/* JSON Input */}
        {importMode === 'json' && (
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                JSON Data (array of StudentEnrollment objects)
              </label>
              <button
                onClick={() => setJsonData(sampleJSON)}
                className="text-xs text-blue-500 hover:underline"
              >
                Load Sample
              </button>
            </div>
            <textarea
              value={jsonData}
              onChange={(e) => setJsonData(e.target.value)}
              placeholder="Paste JSON data here..."
              className="w-full h-48 p-3 border border-gray-300 rounded font-mono text-sm"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={handlePreview}
            disabled={loading || (importMode === 'csv' ? !csvData : !jsonData)}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Preview Data
          </button>
          <button
            onClick={handleImport}
            disabled={loading || (importMode === 'csv' ? !csvData : !jsonData)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {loading ? 'Importing...' : 'Import to Firebase'}
          </button>
        </div>
      </div>

      {/* Preview */}
      {previewData.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Preview (first 5 students)</h2>
          <div className="space-y-6">
            {previewData.map((enrollment, enrollmentIndex) => (
              <div key={enrollmentIndex} className="border border-gray-200 rounded-lg p-4">
                <div className="mb-3">
                  <span className="font-semibold text-gray-800">Student ID:</span> {enrollment.studentId}
                  <span className="ml-4 font-semibold text-gray-800">Semester:</span> {enrollment.semester}
                  <span className="ml-4 text-sm text-gray-600">({enrollment.blocks.length} blocks)</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Block</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Start Date</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">End Date</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Morning</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Afternoon</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Night</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {enrollment.blocks.map((block, blockIndex) => (
                        <tr key={blockIndex}>
                          <td className="px-3 py-2 text-sm text-gray-900 font-medium">Block {block.blockNumber}</td>
                          <td className="px-3 py-2 text-sm text-gray-600">{block.startDate}</td>
                          <td className="px-3 py-2 text-sm text-gray-600">{block.endDate}</td>
                          <td className="px-3 py-2 text-sm text-blue-600">{block.courses.morning || '-'}</td>
                          <td className="px-3 py-2 text-sm text-blue-600">{block.courses.afternoon || '-'}</td>
                          <td className="px-3 py-2 text-sm text-blue-600">{block.courses.night || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Import Result */}
      {importResult && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Import Results</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-green-600 font-medium">✓ Imported:</span>
              <span className="text-gray-900">{importResult.imported} records</span>
            </div>
            {importResult.errors.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-red-600 font-medium">✗ Errors:</span>
                  <span className="text-gray-900">{importResult.errors.length}</span>
                </div>
                <div className="bg-red-50 border border-red-200 rounded p-3 max-h-48 overflow-y-auto">
                  {importResult.errors.map((error, index) => (
                    <div key={index} className="text-sm text-red-700">{error}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Matching Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Course Matching</h2>
        <p className="text-sm text-gray-600 mb-4">
          After importing enrollments, run the matching process to update all attendance records with correct course IDs based on student schedules and timestamps.
        </p>

        <button
          onClick={handleMatchAttendance}
          disabled={loading || existingEnrollments.length === 0}
          className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {loading ? 'Matching...' : 'Match All Attendance Records'}
        </button>

        {existingEnrollments.length === 0 && (
          <p className="text-sm text-orange-600 mt-2">
            Import enrollments first before running the matching process
          </p>
        )}

        {/* Matching Result */}
        {matchingResult && (
          <div className="mt-6 space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-medium">Total Records:</span>
              <span className="text-gray-900">{matchingResult.total}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600 font-medium">✓ Matched:</span>
              <span className="text-gray-900">{matchingResult.matched}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-orange-600 font-medium">⚠ Unmatched:</span>
              <span className="text-gray-900">{matchingResult.unmatched}</span>
            </div>

            {matchingResult.errors.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-red-600 font-medium">Errors:</span>
                  <span className="text-gray-900">{matchingResult.errors.length}</span>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded p-3 max-h-48 overflow-y-auto">
                  {matchingResult.errors.slice(0, 20).map((error, index) => (
                    <div key={index} className="text-sm text-orange-700">{error}</div>
                  ))}
                  {matchingResult.errors.length > 20 && (
                    <div className="text-sm text-gray-500 mt-2">
                      ... and {matchingResult.errors.length - 20} more errors
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
        <h3 className="text-lg font-bold text-blue-900 mb-3">How It Works</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
          <li>Prepare your enrollment data in CSV or JSON format with <strong>blocks</strong></li>
          <li>A semester typically has 3 blocks (or 2 for summer)</li>
          <li>Each student has ONE course per session per block</li>
          <li>Specify date ranges for each block (startDate, endDate)</li>
          <li>Click "Preview Data" to verify format</li>
          <li>Click "Import to Firebase" to save enrollments</li>
          <li>Click "Match All Attendance Records" to update existing records</li>
          <li>System will match attendance by: studentId + date → block → session → courseId</li>
        </ol>

        <div className="mt-4">
          <h4 className="font-bold text-blue-900 mb-2">CSV Format (each row = one block):</h4>
          <pre className="bg-white p-2 rounded text-xs overflow-x-auto">
{sampleCSV}
          </pre>
          <p className="text-xs text-blue-700 mt-2">
            ℹ️ Each student needs multiple rows (one per block). Example: Student S001001 has 3 rows for 3 blocks.
          </p>
        </div>
      </div>
    </div>
  );
}
