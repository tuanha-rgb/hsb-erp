// attendanceModel.ts
import { studentdata, sampleStudents } from "../student/studentdata";
import { courseData } from "../acad/courses";
import { FacultyCode, CourseLevel, CourseItem } from "../acad/academicmodel";

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  date: Date;
  status: "present" | "absent" | "late" | "excused";
  source: "ai-camera" | "manual" | "quiz" | "assignment";
  sessionType: "lecture" | "lab" | "tutorial" | "exam";
  timestamp?: Date;
  cameraId?: string;
  lecturerVerified?: boolean;
  notes?: string;
}

export interface StudentAttendanceStats {
  studentId: string;
  studentName: string;
  program: string;
  level: CourseLevel;
  year: string;
  totalSessions: number;
  attended: number;
  late: number;
  absent: number;
  excused: number;
  attendanceRate: number;
  trend: "improving" | "declining" | "stable";
  atRisk: boolean;
  eligibleForExam: boolean;
  quizBonus: number;
}

export interface CourseAttendance {
  courseId: string;
  courseName: string;
  instructor: string;
  program: string;
  faculty: FacultyCode;
  level: CourseLevel;
  totalStudents: number;
  averageAttendance: number;
  sessionsHeld: number;
  atRiskStudents: number;
  trend: "up" | "down" | "stable";
}

export interface AttendanceAlert {
  id: string;
  studentId: string;
  studentName: string;
  type: "below-threshold" | "declining-trend" | "consecutive-absence" | "exam-ineligible";
  severity: "critical" | "warning" | "info";
  message: string;
  date: Date;
  acknowledged: boolean;
  courseId?: string;
}

export interface AICamera {
  id: string;
  location: string;
  status: "online" | "offline" | "maintenance";
  lastSync: Date;
  sessionsToday: number;
  accuracy: number;
}

// Generate attendance records based on real student and course data
export function generateAttendanceRecords(
  students: studentdata[],
  courses: CourseItem[],
  daysBack: number = 60
): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  const now = new Date();
  let recordId = 1;

  // For each course, generate attendance records
  courses.forEach(course => {
    // Number of sessions for this course (3-5 sessions per week over the period)
    const sessionsCount = Math.floor((daysBack / 7) * (3 + Math.random() * 2));
    
    // Get students who might be in this course based on program and level
    const eligibleStudents = students.filter(s => {
      // Match students to courses based on program
      const programMatch = course.program.includes(s.program) || s.program.includes(course.program);
      const levelMatch = s.level === course.level;
      return programMatch && levelMatch && s.status === "Active";
    }).slice(0, Math.min(course.students, 30)); // Limit to course capacity

    // Generate attendance records for each session
    for (let sessionNum = 0; sessionNum < sessionsCount; sessionNum++) {
      const daysAgo = Math.floor((sessionNum / sessionsCount) * daysBack);
      const sessionDate = new Date(now);
      sessionDate.setDate(sessionDate.getDate() - daysAgo);
      sessionDate.setHours(8 + Math.floor(Math.random() * 8), 0, 0, 0);

      eligibleStudents.forEach(student => {
        // Generate attendance with realistic patterns based on student GPA
        const gpa = parseFloat(student.gpa);
        const attendanceProb = Math.min(0.95, 0.65 + (gpa / 4) * 0.25); // Higher GPA = better attendance
        const lateProb = 0.08;
        const rand = Math.random();

        let status: AttendanceRecord["status"];
        if (rand < attendanceProb) {
          status = "present";
        } else if (rand < attendanceProb + lateProb) {
          status = "late";
        } else if (rand < attendanceProb + lateProb + 0.05) {
          status = "excused";
        } else {
          status = "absent";
        }

        const source: AttendanceRecord["source"] = 
          Math.random() > 0.7 ? "ai-camera" :
          Math.random() > 0.5 ? "manual" :
          Math.random() > 0.5 ? "quiz" : "assignment";

        records.push({
          id: `ATT-${String(recordId++).padStart(6, '0')}`,
          studentId: student.id,
          studentName: student.name,
          courseId: course.id,
          courseName: course.name,
          date: sessionDate,
          status,
          source,
          sessionType: Math.random() > 0.3 ? "lecture" : Math.random() > 0.5 ? "lab" : "tutorial",
          timestamp: sessionDate,
          cameraId: source === "ai-camera" ? `CAM-${Math.floor(Math.random() * 5) + 1}` : undefined,
          lecturerVerified: Math.random() > 0.15
        });
      });
    }
  });

  return records;
}

// Calculate student attendance statistics
export function calculateStudentStats(
  students: studentdata[],
  attendanceRecords: AttendanceRecord[]
): StudentAttendanceStats[] {
  return students
    .filter(s => s.status === "Active")
    .map(student => {
      const studentRecords = attendanceRecords.filter(r => r.studentId === student.id);
      const totalSessions = studentRecords.length;
      
      if (totalSessions === 0) {
        return {
          studentId: student.id,
          studentName: student.name,
          program: student.program,
          level: student.level as CourseLevel,
          year: student.year,
          totalSessions: 0,
          attended: 0,
          late: 0,
          absent: 0,
          excused: 0,
          attendanceRate: 0,
          trend: "stable" as const,
          atRisk: true,
          eligibleForExam: false,
          quizBonus: 0
        };
      }

      const attended = studentRecords.filter(r => r.status === "present").length;
      const late = studentRecords.filter(r => r.status === "late").length;
      const absent = studentRecords.filter(r => r.status === "absent").length;
      const excused = studentRecords.filter(r => r.status === "excused").length;

      const baseAttendanceRate = (attended / totalSessions) * 100;
      
      // Quiz bonus based on quiz/assignment attendance
      const quizRecords = studentRecords.filter(r => r.source === "quiz" || r.source === "assignment");
      const quizAttendance = quizRecords.filter(r => r.status === "present").length;
      const quizBonus = Math.min(10, Math.floor((quizAttendance / Math.max(1, quizRecords.length)) * 10));
      
      const attendanceRate = Math.min(100, baseAttendanceRate + quizBonus);

      // Calculate trend based on recent vs older attendance
      const midpoint = Math.floor(studentRecords.length / 2);
      const recentRecords = studentRecords.slice(0, midpoint);
      const olderRecords = studentRecords.slice(midpoint);
      
      const recentRate = recentRecords.length > 0 
        ? (recentRecords.filter(r => r.status === "present").length / recentRecords.length) * 100 
        : baseAttendanceRate;
      const olderRate = olderRecords.length > 0 
        ? (olderRecords.filter(r => r.status === "present").length / olderRecords.length) * 100 
        : baseAttendanceRate;

      let trend: "improving" | "declining" | "stable";
      if (recentRate > olderRate + 5) trend = "improving";
      else if (recentRate < olderRate - 5) trend = "declining";
      else trend = "stable";

      const atRisk = attendanceRate < 70;
      const eligibleForExam = attendanceRate >= 70;

      return {
        studentId: student.id,
        studentName: student.name,
        program: student.program,
        level: student.level as CourseLevel,
        year: student.year,
        totalSessions,
        attended,
        late,
        absent,
        excused,
        attendanceRate,
        trend,
        atRisk,
        eligibleForExam,
        quizBonus
      };
    })
    .filter(s => s.totalSessions > 0); // Only include students with attendance records
}

// Calculate course attendance statistics
export function calculateCourseStats(
  courses: CourseItem[],
  attendanceRecords: AttendanceRecord[]
): CourseAttendance[] {
  return courses.map(course => {
    const courseRecords = attendanceRecords.filter(r => r.courseId === course.id);
    const uniqueStudents = new Set(courseRecords.map(r => r.studentId)).size;
    
    if (courseRecords.length === 0) {
      return {
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
        trend: "stable" as const
      };
    }

    const totalPresent = courseRecords.filter(r => r.status === "present").length;
    const averageAttendance = (totalPresent / courseRecords.length) * 100;
    
    // Calculate sessions held
    const uniqueDates = new Set(courseRecords.map(r => r.date.toISOString().split('T')[0])).size;
    
    // Calculate at-risk students
    const studentAttendance = new Map<string, { present: number; total: number }>();
    courseRecords.forEach(record => {
      const current = studentAttendance.get(record.studentId) || { present: 0, total: 0 };
      current.total++;
      if (record.status === "present") current.present++;
      studentAttendance.set(record.studentId, current);
    });
    
    const atRiskStudents = Array.from(studentAttendance.values())
      .filter(stats => (stats.present / stats.total) * 100 < 70)
      .length;

    // Determine trend based on recent vs historical data
    const midpoint = Math.floor(courseRecords.length / 2);
    const recentRecords = courseRecords.slice(0, midpoint);
    const olderRecords = courseRecords.slice(midpoint);
    
    const recentRate = recentRecords.length > 0
      ? (recentRecords.filter(r => r.status === "present").length / recentRecords.length) * 100
      : averageAttendance;
    const olderRate = olderRecords.length > 0
      ? (olderRecords.filter(r => r.status === "present").length / olderRecords.length) * 100
      : averageAttendance;

    let trend: "up" | "down" | "stable";
    if (recentRate > olderRate + 5) trend = "up";
    else if (recentRate < olderRate - 5) trend = "down";
    else trend = "stable";

    return {
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
    };
  });
}

// Generate alerts based on student stats
export function generateAlerts(studentStats: StudentAttendanceStats[]): AttendanceAlert[] {
  const alerts: AttendanceAlert[] = [];
  let alertId = 1;

  studentStats.forEach(student => {
    if (student.attendanceRate < 50) {
      alerts.push({
        id: `ALERT-${String(alertId++).padStart(4, '0')}`,
        studentId: student.studentId,
        studentName: student.studentName,
        type: "exam-ineligible",
        severity: "critical",
        message: `Critical: ${student.studentName} is ineligible for final exam (${student.attendanceRate.toFixed(1)}% attendance)`,
        date: new Date(),
        acknowledged: Math.random() > 0.7
      });
    } else if (student.attendanceRate < 60) {
      alerts.push({
        id: `ALERT-${String(alertId++).padStart(4, '0')}`,
        studentId: student.studentId,
        studentName: student.studentName,
        type: "below-threshold",
        severity: "warning",
        message: `Warning: ${student.studentName} is at risk of failing attendance requirement (${student.attendanceRate.toFixed(1)}%)`,
        date: new Date(),
        acknowledged: Math.random() > 0.5
      });
    } else if (student.attendanceRate < 70) {
      alerts.push({
        id: `ALERT-${String(alertId++).padStart(4, '0')}`,
        studentId: student.studentId,
        studentName: student.studentName,
        type: "below-threshold",
        severity: "warning",
        message: `Warning: ${student.studentName} is approaching attendance threshold (${student.attendanceRate.toFixed(1)}%)`,
        date: new Date(),
        acknowledged: Math.random() > 0.5
      });
    } else if (student.trend === "declining" && student.attendanceRate < 80) {
      alerts.push({
        id: `ALERT-${String(alertId++).padStart(4, '0')}`,
        studentId: student.studentId,
        studentName: student.studentName,
        type: "declining-trend",
        severity: "info",
        message: `Notice: ${student.studentName} showing declining attendance trend (${student.attendanceRate.toFixed(1)}%)`,
        date: new Date(),
        acknowledged: Math.random() > 0.3
      });
    }
  });

  return alerts;
}

// Generate camera data
export function generateCameras(): AICamera[] {
  const locations = [
    "Lecture Hall A - FOM Building",
    "Lab Building 2 - FONS Wing",
    "Tutorial Room 3B - Main Campus",
    "Main Auditorium - Conference Center",
    "Computer Lab 5 - Technology Building",
    "Classroom 201 - FOMAC Building",
    "Study Hall - Library 3F",
    "Seminar Room 4A - Research Center"
  ];

  return locations.map((location, i) => ({
    id: `CAM-${String(i + 1).padStart(3, '0')}`,
    location,
    status: Math.random() > 0.1 ? "online" : Math.random() > 0.5 ? "offline" : "maintenance",
    lastSync: new Date(Date.now() - Math.random() * 3600000),
    sessionsToday: Math.floor(Math.random() * 12),
    accuracy: 85 + Math.random() * 13
  }));
}

// Main data initialization function
export function initializeAttendanceData() {
  const records = generateAttendanceRecords(sampleStudents, courseData, 60);
  const students = calculateStudentStats(sampleStudents, records);
  const courses = calculateCourseStats(courseData, records);
  const alerts = generateAlerts(students);
  const cameras = generateCameras();

  return {
    records,
    students,
    courses,
    alerts,
    cameras
  };
}