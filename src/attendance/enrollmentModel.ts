// enrollmentModel.ts
// Student enrollment data structure for course matching

export type SessionType = 'morning' | 'afternoon' | 'night';
export type BlockNumber = 1 | 2 | 3;

/**
 * Block schedule with date ranges
 */
export interface BlockSchedule {
  blockNumber: BlockNumber;
  startDate: string;       // YYYY-MM-DD
  endDate: string;         // YYYY-MM-DD
  courses: {
    morning?: string;      // Course ID for morning session
    afternoon?: string;    // Course ID for afternoon session
    night?: string;        // Course ID for night session
  };
}

/**
 * Student enrollment for one semester with multiple blocks
 */
export interface StudentEnrollment {
  studentId: string;
  semester: string;        // e.g., "2024-2025-1" (Fall), "2024-2025-2" (Spring)
  blocks: BlockSchedule[]; // Multiple blocks per semester
}

/**
 * Course information
 */
export interface CourseInfo {
  courseId: string;
  courseName: string;
  instructor?: string;
  room?: string;          // Optional: if course always in same room
  credits?: number;
}

/**
 * Session time definitions
 */
export const SESSION_TIMES = {
  morning: {
    start: '07:00',
    end: '12:00',
    label: 'Morning Session'
  },
  afternoon: {
    start: '12:00',
    end: '17:30',
    label: 'Afternoon Session'
  },
  night: {
    start: '17:30',
    end: '22:00',
    label: 'Night Session'
  }
} as const;

/**
 * Get session type from time string (HH:MM)
 */
export function getSessionFromTime(timeString: string): SessionType {
  const [hours, minutes] = timeString.split(':').map(Number);
  const timeInMinutes = hours * 60 + minutes;

  const morningStart = 7 * 60;      // 07:00
  const afternoonStart = 12 * 60;   // 12:00
  const nightStart = 17 * 60 + 30;  // 17:30

  if (timeInMinutes >= morningStart && timeInMinutes < afternoonStart) {
    return 'morning';
  } else if (timeInMinutes >= afternoonStart && timeInMinutes < nightStart) {
    return 'afternoon';
  } else {
    return 'night';
  }
}

/**
 * Get session type from Date object
 */
export function getSessionFromDate(date: Date): SessionType {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  return getSessionFromTime(timeString);
}

/**
 * Get current semester (adjust based on your academic calendar)
 */
export function getCurrentSemester(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // 1-12

  // Example: Fall (9-12) = Semester 1, Spring (1-5) = Semester 2, Summer (6-8) = Semester 3
  if (month >= 9 && month <= 12) {
    return `${year}-${year + 1}-1`; // Fall
  } else if (month >= 1 && month <= 5) {
    return `${year - 1}-${year}-2`; // Spring
  } else {
    return `${year}-${year + 1}-3`; // Summer
  }
}

/**
 * Format semester for display
 */
export function formatSemester(semester: string): string {
  const parts = semester.split('-');
  if (parts.length !== 3) return semester;

  const [year1, year2, semNum] = parts;
  const semesterNames = ['Fall', 'Spring', 'Summer'];
  const semName = semesterNames[parseInt(semNum) - 1] || `Semester ${semNum}`;

  return `${semName} ${year1}-${year2}`;
}

/**
 * Get block number for a given date from a list of blocks
 */
export function getBlockFromDate(date: Date, blocks: BlockSchedule[]): BlockSchedule | null {
  const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD

  for (const block of blocks) {
    if (dateStr >= block.startDate && dateStr <= block.endDate) {
      return block;
    }
  }

  return null;
}

/**
 * Parse date string to Date object
 */
export function parseDate(dateStr: string): Date {
  // Handle YYYY-MM-DD format
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}
