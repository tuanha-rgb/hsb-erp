// AttendanceOverview.tsx
// Example component that loads REAL attendance data from Firebase

import React, { useState } from 'react';
import { useAttendanceData } from './useAttendanceData';
import { sampleStudents } from '../student/studentdata';
import { courseData } from '../acad/courses';
import { Users, TrendingUp, TrendingDown, AlertCircle, Camera, RefreshCw } from 'lucide-react';

export default function AttendanceOverview() {
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'semester'>('month');

  // Calculate date range
  const getDateRange = () => {
    const now = new Date();
    const startDate = new Date();

    switch (dateRange) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setDate(now.getDate() - 30);
        break;
      case 'semester':
        startDate.setDate(now.getDate() - 120);
        break;
    }

    return { startDate, endDate: now };
  };

  const { startDate, endDate } = getDateRange();

  // Load REAL data from Firebase
  const {
    records,
    students,
    courses,
    alerts,
    cameras,
    loading,
    error,
    refresh
  } = useAttendanceData({
    startDate,
    endDate,
    studentData: sampleStudents,
    courseData: courseData
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
          <p className="text-gray-600">Loading real attendance data from Firebase...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-red-800">
          <AlertCircle className="w-5 h-5" />
          <p className="font-medium">Error loading data: {error}</p>
        </div>
        <button
          onClick={refresh}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  // Calculate summary stats
  const totalRecords = records.length;
  const aiDetections = records.filter(r => r.source === 'ai-camera').length;
  const atRiskCount = students.filter(s => s.atRisk).length;
  const avgAttendance = students.length > 0
    ? students.reduce((sum, s) => sum + s.attendanceRate, 0) / students.length
    : 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Attendance Overview</h1>
          <p className="text-gray-600 mt-1">Real-time data from Firebase • {totalRecords} records</p>
        </div>
        <div className="flex gap-2">
          {/* Date Range Selector */}
          <div className="flex gap-2 bg-white border rounded-lg p-1">
            {(['week', 'month', 'semester'] as const).map(range => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-4 py-2 rounded ${
                  dateRange === range
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
          <button
            onClick={refresh}
            className="px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          icon={<Users className="w-6 h-6 text-blue-600" />}
          label="Total Students"
          value={students.length}
          subtext={`${students.filter(s => s.eligibleForExam).length} exam eligible`}
          color="blue"
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6 text-green-600" />}
          label="Avg Attendance"
          value={`${avgAttendance.toFixed(1)}%`}
          subtext={`${students.filter(s => s.trend === 'improving').length} improving`}
          color="green"
        />
        <StatCard
          icon={<AlertCircle className="w-6 h-6 text-red-600" />}
          label="At Risk"
          value={atRiskCount}
          subtext={`${((atRiskCount / Math.max(students.length, 1)) * 100).toFixed(1)}% of total`}
          color="red"
        />
        <StatCard
          icon={<Camera className="w-6 h-6 text-purple-600" />}
          label="AI Detections"
          value={aiDetections}
          subtext={`${cameras.filter(c => c.status === 'online').length}/${cameras.length} cameras online`}
          color="purple"
        />
      </div>

      {/* Active Alerts */}
      {alerts.filter(a => !a.acknowledged).length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Active Alerts ({alerts.filter(a => !a.acknowledged).length})
          </h3>
          <div className="space-y-2">
            {alerts.filter(a => !a.acknowledged).slice(0, 3).map(alert => (
              <div key={alert.id} className="text-sm text-yellow-800">
                • {alert.message}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Records */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-gray-900">Recent Attendance Records</h3>
          <p className="text-sm text-gray-600">Latest {Math.min(10, records.length)} entries from Firebase</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Time</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Student ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Course</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Source</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {records.slice(0, 10).map(record => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">
                    {record.timestamp?.toLocaleString() || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium">{record.studentId}</td>
                  <td className="px-4 py-3 text-sm">{record.courseId}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      record.status === 'present' ? 'bg-green-100 text-green-800' :
                      record.status === 'late' ? 'bg-yellow-100 text-yellow-800' :
                      record.status === 'absent' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {record.source === 'ai-camera' && record.cameraId ? (
                      <span className="flex items-center gap-1">
                        <Camera size={14} />
                        {record.cameraId}
                      </span>
                    ) : (
                      record.source
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Students */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h3 className="font-semibold text-gray-900">Top Performers</h3>
          </div>
          <div className="p-4 space-y-2">
            {students
              .sort((a, b) => b.attendanceRate - a.attendanceRate)
              .slice(0, 5)
              .map(student => (
                <div key={student.studentId} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{student.studentName}</p>
                    <p className="text-sm text-gray-600">{student.studentId}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">{student.attendanceRate.toFixed(1)}%</p>
                    <p className="text-xs text-gray-500">{student.attended}/{student.totalSessions}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h3 className="font-semibold text-gray-900">At-Risk Students</h3>
          </div>
          <div className="p-4 space-y-2">
            {students
              .filter(s => s.atRisk)
              .sort((a, b) => a.attendanceRate - b.attendanceRate)
              .slice(0, 5)
              .map(student => (
                <div key={student.studentId} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{student.studentName}</p>
                    <p className="text-sm text-gray-600">{student.studentId}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-red-600">{student.attendanceRate.toFixed(1)}%</p>
                    <p className="text-xs text-gray-500">{student.attended}/{student.totalSessions}</p>
                  </div>
                </div>
              ))}
            {students.filter(s => s.atRisk).length === 0 && (
              <p className="text-gray-500 text-center py-4">No at-risk students</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, subtext, color }: any) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    red: 'bg-red-50 border-red-200',
    purple: 'bg-purple-50 border-purple-200',
    yellow: 'bg-yellow-50 border-yellow-200'
  };

  return (
    <div className={`p-4 rounded-lg border ${colorClasses[color]}`}>
      <div className="flex items-center justify-between mb-2">
        {icon}
        <span className="text-2xl font-bold">{value}</span>
      </div>
      <p className="text-sm font-medium text-gray-700">{label}</p>
      <p className="text-xs text-gray-600 mt-1">{subtext}</p>
    </div>
  );
}
