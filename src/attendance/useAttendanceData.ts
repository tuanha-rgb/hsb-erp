// useAttendanceData.ts
// React hook to load real attendance data from Firebase

import { useState, useEffect } from 'react';
import {
  getAllAttendanceRecords,
  getAllStudentStats,
  getAllCourseStats,
  getAllAlerts,
  getAllCameras
} from './attendance_firebase_service';
import type {
  AttendanceRecord,
  StudentAttendanceStats,
  CourseAttendance,
  AttendanceAlert,
  AICamera
} from './attendancemodel';

export interface AttendanceData {
  records: AttendanceRecord[];
  students: StudentAttendanceStats[];
  courses: CourseAttendance[];
  alerts: AttendanceAlert[];
  cameras: AICamera[];
  loading: boolean;
  error: string | null;
}

export interface UseAttendanceDataOptions {
  startDate?: Date;
  endDate?: Date;
  studentData?: Array<{ id: string; name: string; program: string; level: string; year: string; status?: string }>;
  courseData?: Array<{ id: string; name: string; instructor: string; program: string; faculty: any; level: any; students: number }>;
  autoLoad?: boolean; // If false, call refresh() manually
}

/**
 * React hook to load real attendance data from Firebase
 *
 * @example
 * ```tsx
 * const { records, students, courses, loading, refresh } = useAttendanceData({
 *   studentData: sampleStudents,
 *   courseData: courseData,
 *   startDate: new Date('2025-01-01')
 * });
 * ```
 */
export function useAttendanceData(options: UseAttendanceDataOptions = {}) {
  const {
    startDate,
    endDate,
    studentData = [],
    courseData = [],
    autoLoad = true
  } = options;

  const [data, setData] = useState<AttendanceData>({
    records: [],
    students: [],
    courses: [],
    alerts: [],
    cameras: [],
    loading: true,
    error: null
  });

  const loadData = async () => {
    try {
      setData(prev => ({ ...prev, loading: true, error: null }));

      // Load all data in parallel
      const [records, cameras, alerts] = await Promise.all([
        getAllAttendanceRecords(startDate, endDate),
        getAllCameras(),
        getAllAlerts(100) // Limit to 100 most recent alerts
      ]);

      // Calculate stats from records (requires student and course data)
      const [students, courses] = await Promise.all([
        studentData.length > 0
          ? getAllStudentStats(studentData, startDate, endDate)
          : Promise.resolve([]),
        courseData.length > 0
          ? getAllCourseStats(courseData, startDate, endDate)
          : Promise.resolve([])
      ]);

      setData({
        records,
        students,
        courses,
        alerts,
        cameras,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Error loading attendance data:', error);
      setData(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load attendance data'
      }));
    }
  };

  useEffect(() => {
    if (autoLoad) {
      loadData();
    }
  }, [startDate, endDate, autoLoad]);

  return {
    ...data,
    refresh: loadData
  };
}

/**
 * Hook for loading only student stats
 */
export function useStudentAttendanceStats(
  studentData: Array<{ id: string; name: string; program: string; level: string; year: string; status?: string }>,
  startDate?: Date,
  endDate?: Date
) {
  const [stats, setStats] = useState<StudentAttendanceStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllStudentStats(studentData, startDate, endDate);
      setStats(data);
    } catch (err) {
      console.error('Error loading student stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to load student stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (studentData.length > 0) {
      loadStats();
    }
  }, [studentData, startDate, endDate]);

  return { stats, loading, error, refresh: loadStats };
}

/**
 * Hook for loading only course stats
 */
export function useCourseAttendanceStats(
  courseData: Array<{ id: string; name: string; instructor: string; program: string; faculty: any; level: any; students: number }>,
  startDate?: Date,
  endDate?: Date
) {
  const [stats, setStats] = useState<CourseAttendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllCourseStats(courseData, startDate, endDate);
      setStats(data);
    } catch (err) {
      console.error('Error loading course stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to load course stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseData.length > 0) {
      loadStats();
    }
  }, [courseData, startDate, endDate]);

  return { stats, loading, error, refresh: loadStats };
}
