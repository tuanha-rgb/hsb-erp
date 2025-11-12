// AttendanceOrganizer.tsx
// UI component to reorganize attendance records by date

import React, { useState } from 'react';
import { reorganizeByDate, exportByDate, getDateSummary } from './organize-by-date';
import { FolderTree, Download, Calendar, Play, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

export default function AttendanceOrganizer() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [dateSummary, setDateSummary] = useState<any[]>([]);

  const handleReorganize = async () => {
    if (!confirm('This will reorganize all attendance records by date in Firestore. Continue?')) {
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const result = await reorganizeByDate();
      setResult(result);
      alert(`✅ Success! Reorganized ${result.totalRecords} records into ${result.uniqueDates} dates`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to reorganize records';
      setError(message);
      alert(`❌ Error: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await exportByDate();

      // Download summary
      result.downloadJSON('attendance_summary.json', result.summary);

      // Download each date's records
      Object.entries(result.byDate).forEach(([date, data]) => {
        result.downloadJSON(`attendance_${date}.json`, data);
      });

      alert(`✅ Downloaded ${result.summary.uniqueDates} date files + summary`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to export records';
      setError(message);
      alert(`❌ Error: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadSummary = async () => {
    setLoading(true);
    try {
      const summary = await getDateSummary();
      setDateSummary(summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load summary');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Attendance Records Organizer</h1>
          <p className="text-gray-600">
            Reorganize attendance_records collection by date for better organization
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-red-900">Error</p>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-800"
            >
              ×
            </button>
          </div>
        )}

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Option 1: Reorganize in Firestore */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-4">
              <FolderTree className="w-8 h-8 text-blue-600" />
              <h2 className="text-xl font-semibold">Reorganize in Firestore</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Creates new collection <code className="bg-gray-100 px-2 py-1 rounded">attendance_by_date</code> with
              date-based subcollections:
            </p>
            <pre className="bg-gray-50 p-3 rounded text-xs mb-4 overflow-x-auto">
{`attendance_by_date/
  2025-01-11/
    records/
      ATT-001
      ATT-002
  2025-01-12/
    records/
      ATT-003`}
            </pre>
            <button
              onClick={handleReorganize}
              disabled={loading}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Reorganize in Firestore
                </>
              )}
            </button>
          </div>

          {/* Option 2: Export to JSON */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-4">
              <Download className="w-8 h-8 text-green-600" />
              <h2 className="text-xl font-semibold">Export to JSON Files</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Downloads JSON files organized by date:
            </p>
            <pre className="bg-gray-50 p-3 rounded text-xs mb-4 overflow-x-auto">
{`Downloads/
  attendance_summary.json
  attendance_2025-01-11.json
  attendance_2025-01-12.json
  ...`}
            </pre>
            <button
              onClick={handleExport}
              disabled={loading}
              className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Export to JSON
                </>
              )}
            </button>
          </div>
        </div>

        {/* Result Display */}
        {result && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-semibold text-green-900">Reorganization Complete!</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-700">Total Records:</span>
                <span className="font-semibold">{result.totalRecords}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Unique Dates:</span>
                <span className="font-semibold">{result.uniqueDates}</span>
              </div>
            </div>

            {result.dateBreakdown && (
              <div className="mt-4">
                <h4 className="font-medium text-gray-900 mb-2">Breakdown by Date:</h4>
                <div className="max-h-48 overflow-y-auto space-y-1">
                  {result.dateBreakdown.map((item: any) => (
                    <div key={item.date} className="flex justify-between text-sm bg-white px-3 py-2 rounded">
                      <span className="text-gray-700">{item.date}</span>
                      <span className="font-medium">{item.count} records</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Date Summary */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-semibold">Organized Dates</h2>
            </div>
            <button
              onClick={handleLoadSummary}
              disabled={loading}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Load Summary
            </button>
          </div>

          {dateSummary.length > 0 ? (
            <div className="space-y-2">
              {dateSummary.map((item) => (
                <div key={item.date} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{item.date}</p>
                    <p className="text-sm text-gray-600">
                      Created: {item.createdAt?.toLocaleString() || 'N/A'}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                    {item.recordCount} records
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              Click "Load Summary" to view organized dates
            </p>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3">📝 Instructions</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li><strong>Reorganize in Firestore:</strong> Creates a new collection structure organized by date. Original data is preserved.</li>
            <li><strong>Export to JSON:</strong> Downloads data as JSON files, one per date + summary file.</li>
            <li><strong>Load Summary:</strong> Shows existing organized dates (only works after reorganization).</li>
            <li><strong>Note:</strong> Original <code className="bg-blue-100 px-1 rounded">attendance_records</code> collection remains unchanged as a backup.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
