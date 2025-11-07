// AttendanceLive.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Camera, Users, AlertCircle, CheckCircle, Clock, TrendingUp, TrendingDown,
  BarChart3, BookOpen, RefreshCw, Download, Search, Filter, Bell,
  Eye, X, Calendar
} from 'lucide-react';
import { 
  subscribeToLiveAttendance,
  getAllCameras,
  getActiveAlerts,
  acknowledgeAlert,
  getCourseAttendance,
  calculateLiveStats
} from './attendance_firebase_service';
import type { AttendanceRecord, AICamera, AttendanceAlert, StudentAttendanceStats } from './attendancemodel';
import type { CourseItem } from '../acad/academicmodel';
import { courseData } from '../acad/courses';

export default function AttendanceLive() {
  const [activeTab, setActiveTab] = useState<'live' | 'history' | 'cameras' | 'alerts'>('live');
  const [selectedCourse, setSelectedCourse] = useState<CourseItem | null>(courseData[0] || null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [cameras, setCameras] = useState<AICamera[]>([]);
  const [alerts, setAlerts] = useState<AttendanceAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [liveMode, setLiveMode] = useState(true);

  // Load cameras and alerts on mount
  useEffect(() => {
    loadCameras();
    loadAlerts();
  }, []);

  // Subscribe to live attendance or load historical
  useEffect(() => {
    if (!selectedCourse) return;

    if (liveMode && activeTab === 'live') {
      setLoading(true);
      const unsubscribe = subscribeToLiveAttendance(
        selectedCourse.id, 
        selectedDate, 
        (liveRecords) => {
          setRecords(liveRecords);
          setLoading(false);
        }
      );
      return () => unsubscribe();
    } else if (activeTab === 'history') {
      loadHistoricalData();
    }
  }, [selectedCourse, selectedDate, liveMode, activeTab]);

  const loadHistoricalData = async () => {
    if (!selectedCourse) return;
    setLoading(true);
    const data = await getCourseAttendance(selectedCourse.id, selectedDate);
    setRecords(data);
    setLoading(false);
  };

  const loadCameras = async () => {
    const data = await getAllCameras();
    setCameras(data);
  };

  const loadAlerts = async () => {
    const data = await getActiveAlerts();
    setAlerts(data);
  };

  const handleAcknowledgeAlert = async (alertId: string) => {
    await acknowledgeAlert(alertId);
    setAlerts(alerts.filter(a => a.id !== alertId));
  };

  // Statistics
  const totalPresent = records.filter(r => r.status === 'present').length;
  const totalLate = records.filter(r => r.status === 'late').length;
  const totalAbsent = records.filter(r => r.status === 'absent').length;
  const aiDetections = records.filter(r => r.source === 'ai-camera').length;
  const uniqueStudents = new Set(records.map(r => r.studentId)).size;
  const attendanceRate = records.length > 0 ? (totalPresent / records.length) * 100 : 0;

  // Filter records
  const filteredRecords = useMemo(() => {
    return records.filter(r => 
      r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.studentId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [records, searchTerm]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Live Attendance System</h1>
            <p className="text-gray-600 mt-1">AI-Powered Real-time Attendance Monitoring</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={loadCameras}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <RefreshCw size={16} />
              Sync Cameras
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <Download size={16} />
              Export Report
            </button>
          </div>
        </div>

        {/* Course Selector */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
              <select 
                value={selectedCourse?.id || ''}
                onChange={(e) => setSelectedCourse(courseData.find(c => c.id === e.target.value) || null)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                {courseData.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.id} - {course.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={selectedDate.toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mode</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setLiveMode(true)}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium ${
                    liveMode 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    {liveMode && <span className="w-2 h-2 bg-white rounded-full animate-pulse" />}
                    Live
                  </div>
                </button>
                <button
                  onClick={() => { setLiveMode(false); setActiveTab('history'); }}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium ${
                    !liveMode 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  History
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts Banner */}
        {alerts.length > 0 && (
          <div className="mb-4 space-y-2">
            {alerts.slice(0, 3).map(alert => (
              <div 
                key={alert.id}
                className={`p-4 rounded-lg flex items-start gap-3 ${
                  alert.severity === 'critical' ? 'bg-red-50 border border-red-200' :
                  alert.severity === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
                  'bg-blue-50 border border-blue-200'
                }`}
              >
                <AlertCircle className={`w-5 h-5 mt-0.5 ${
                  alert.severity === 'critical' ? 'text-red-600' :
                  alert.severity === 'warning' ? 'text-yellow-600' :
                  'text-blue-600'
                }`} />
                <div className="flex-1">
                  <p className="font-medium">{alert.message}</p>
                </div>
                <button 
                  onClick={() => handleAcknowledgeAlert(alert.id)}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  <X size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={<Users className="w-6 h-6 text-blue-600" />}
          label="Students Present"
          value={totalPresent}
          subtext={`${uniqueStudents} unique`}
          color="blue"
        />
        <StatCard
          icon={<Clock className="w-6 h-6 text-yellow-600" />}
          label="Late Arrivals"
          value={totalLate}
          subtext={`${((totalLate / records.length) * 100 || 0).toFixed(1)}%`}
          color="yellow"
        />
        <StatCard
          icon={<AlertCircle className="w-6 h-6 text-red-600" />}
          label="Absent"
          value={totalAbsent}
          subtext={`${((totalAbsent / records.length) * 100 || 0).toFixed(1)}%`}
          color="red"
        />
        <StatCard
          icon={<Camera className="w-6 h-6 text-green-600" />}
          label="AI Detections"
          value={aiDetections}
          subtext={`${((aiDetections / records.length) * 100 || 0).toFixed(1)}%`}
          color="green"
        />
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="flex border-b px-4">
          <TabButton
            active={activeTab === 'live'}
            onClick={() => { setActiveTab('live'); setLiveMode(true); }}
            icon={<Camera size={18} />}
            label="Live Feed"
          />
          <TabButton
            active={activeTab === 'history'}
            onClick={() => { setActiveTab('history'); setLiveMode(false); }}
            icon={<Calendar size={18} />}
            label="History"
          />
          <TabButton
            active={activeTab === 'cameras'}
            onClick={() => setActiveTab('cameras')}
            icon={<Camera size={18} />}
            label={`Cameras (${cameras.length})`}
          />
          <TabButton
            active={activeTab === 'alerts'}
            onClick={() => setActiveTab('alerts')}
            icon={<Bell size={18} />}
            label={`Alerts (${alerts.length})`}
            badge={alerts.length}
          />
        </div>

        <div className="p-6">
          {activeTab === 'live' && <LiveFeedTab records={filteredRecords} loading={loading} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />}
          {activeTab === 'history' && <HistoryTab records={filteredRecords} loading={loading} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />}
          {activeTab === 'cameras' && <CamerasTab cameras={cameras} onRefresh={loadCameras} />}
          {activeTab === 'alerts' && <AlertsTab alerts={alerts} onAcknowledge={handleAcknowledgeAlert} />}
        </div>
      </div>
    </div>
  );
}

// Tab Components
function LiveFeedTab({ records, loading, searchTerm, setSearchTerm }: any) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="font-medium">Live Updates Active</span>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg w-64"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading live feed...</div>
      ) : records.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No attendance records yet</div>
      ) : (
        <AttendanceTable records={records} />
      )}
    </div>
  );
}

function HistoryTab({ records, loading, searchTerm, setSearchTerm }: any) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Attendance History</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg w-64"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading history...</div>
      ) : records.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No records found</div>
      ) : (
        <AttendanceTable records={records} />
      )}
    </div>
  );
}

function CamerasTab({ cameras, onRefresh }: any) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">AI Camera Network</h3>
        <button onClick={onRefresh} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <RefreshCw size={16} className="inline mr-2" />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cameras.map((cam: AICamera) => (
          <div key={cam.id} className="p-4 border rounded-lg hover:shadow-md transition">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-gray-600" />
                <span className="font-semibold">{cam.id}</span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                cam.status === 'online' ? 'bg-green-100 text-green-800' :
                cam.status === 'offline' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {cam.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-2">{cam.location}</p>
            <div className="flex justify-between text-xs text-gray-500">
              <span>{cam.sessionsToday} sessions today</span>
              <span>{cam.accuracy.toFixed(1)}% accuracy</span>
            </div>
            <div className="mt-2 text-xs text-gray-400">
              Last sync: {new Date(cam.lastSync).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AlertsTab({ alerts, onAcknowledge }: any) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Active Alerts</h3>
      {alerts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No active alerts</div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert: AttendanceAlert) => (
            <div 
              key={alert.id}
              className={`p-4 rounded-lg border ${
                alert.severity === 'critical' ? 'border-red-200 bg-red-50' :
                alert.severity === 'warning' ? 'border-yellow-200 bg-yellow-50' :
                'border-blue-200 bg-blue-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className={`w-5 h-5 ${
                      alert.severity === 'critical' ? 'text-red-600' :
                      alert.severity === 'warning' ? 'text-yellow-600' :
                      'text-blue-600'
                    }`} />
                    <span className="font-semibold">{alert.type.replace('-', ' ').toUpperCase()}</span>
                  </div>
                  <p className="text-gray-700">{alert.message}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(alert.date).toLocaleString()}
                  </p>
                </div>
                <button 
                  onClick={() => onAcknowledge(alert.id)}
                  className="px-3 py-1 bg-white border rounded-lg hover:bg-gray-50 text-sm"
                >
                  Acknowledge
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Helper Components
function StatCard({ icon, label, value, subtext, color }: any) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    yellow: 'bg-yellow-50 border-yellow-200',
    red: 'bg-red-50 border-red-200',
    green: 'bg-green-50 border-green-200'
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

function TabButton({ active, onClick, icon, label, badge }: any) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 font-medium flex items-center gap-2 border-b-2 transition-colors relative ${
        active 
          ? 'border-blue-600 text-blue-600' 
          : 'border-transparent text-gray-600 hover:text-gray-900'
      }`}
    >
      {icon}
      {label}
      {badge > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
          {badge}
        </span>
      )}
    </button>
  );
}

function AttendanceTable({ records }: { records: AttendanceRecord[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Time</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Student ID</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Source</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Verified</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {records.map(record => (
            <tr key={record.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm">
                {record.timestamp?.toLocaleTimeString() || '-'}
              </td>
              <td className="px-4 py-3 text-sm font-medium">{record.studentId}</td>
              <td className="px-4 py-3 text-sm">{record.studentName}</td>
              <td className="px-4 py-3">
                <StatusBadge status={record.status} />
              </td>
              <td className="px-4 py-3">
                <SourceBadge source={record.source} cameraId={record.cameraId} />
              </td>
              <td className="px-4 py-3">
                {record.lecturerVerified ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <span className="text-xs text-gray-400">Pending</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatusBadge({ status }: { status: AttendanceRecord['status'] }) {
  const styles = {
    present: 'bg-green-100 text-green-800',
    late: 'bg-yellow-100 text-yellow-800',
    absent: 'bg-red-100 text-red-800',
    excused: 'bg-blue-100 text-blue-800'
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function SourceBadge({ source, cameraId }: { source: AttendanceRecord['source']; cameraId?: string }) {
  const icons = {
    'ai-camera': <Camera className="w-3 h-3" />,
    'manual': <Users className="w-3 h-3" />,
    'quiz': <CheckCircle className="w-3 h-3" />,
    'assignment': <CheckCircle className="w-3 h-3" />
  };

  return (
    <div className="flex items-center gap-1 text-xs text-gray-600">
      {icons[source]}
      <span>{source === 'ai-camera' && cameraId ? cameraId : source}</span>
    </div>
  );
}