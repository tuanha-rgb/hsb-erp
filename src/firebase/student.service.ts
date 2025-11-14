import { collection, query, where, getDocs, doc, getDoc, limit } from 'firebase/firestore';
import { db } from './firebase.config';

export interface StudentProfile {
  studentId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  year: number;
  program?: string;
  cohort?: string;
  gender?: string;
  dateOfBirth?: string;
}

export interface StaffProfile {
  staffId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  role?: string;
  title?: string;
}

// Firebase collection names
const STUDENTS_COLLECTION = 'students';
const STAFF_COLLECTION = 'staff';

// Cache for students and staff to avoid repeated queries
let studentsCache: StudentProfile[] | null = null;
let staffCache: StaffProfile[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Get all students from Firebase (with caching)
 */
async function getAllStudents(forceRefresh = false): Promise<StudentProfile[]> {
  const now = Date.now();

  if (!forceRefresh && studentsCache && (now - cacheTimestamp < CACHE_DURATION)) {
    return studentsCache;
  }

  try {
    const querySnapshot = await getDocs(collection(db, STUDENTS_COLLECTION));
    const students: StudentProfile[] = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        studentId: data.studentId || data.Student_Code || data.ID || doc.id,
        name: data.studentName || data.name || data.Name || data.fullName || data.FullName || '',
        email: data.email || data.Email || '',
        phone: data.phone || data.Phone || '',
        department: data.department || data.Department || data.Program || '',
        year: data.year || extractYearFromCohort(data.cohort || data.Cohort) || 1,
        program: data.program || data.Program_Name_English || data.Program,
        cohort: data.cohort || data.Cohort,
        gender: data.gender || data.Gender,
        dateOfBirth: data.dateOfBirth || data.Date_of_Birth
      };
    });

    studentsCache = students;
    cacheTimestamp = now;
    return students;
  } catch (error) {
    console.error('Error fetching students from Firebase:', error);
    return studentsCache || [];
  }
}

/**
 * Get all staff from Firebase (with caching)
 */
async function getAllStaff(forceRefresh = false): Promise<StaffProfile[]> {
  const now = Date.now();

  if (!forceRefresh && staffCache && (now - cacheTimestamp < CACHE_DURATION)) {
    return staffCache;
  }

  try {
    const querySnapshot = await getDocs(collection(db, STAFF_COLLECTION));
    const staff: StaffProfile[] = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        staffId: data.staffId || data.ID || doc.id,
        name: data.staffName || data.name || data.Name || data.fullName || data.FullName || '',
        email: data.email || data.Email || '',
        phone: data.phone || data.Phone || '',
        department: data.department || data.Department || '',
        role: data.role || data.Role,
        title: data.title || data.Title
      };
    });

    staffCache = staff;
    cacheTimestamp = now;
    return staff;
  } catch (error) {
    console.error('Error fetching staff from Firebase:', error);
    return staffCache || [];
  }
}

/**
 * Extract year from cohort string (e.g., "K29" -> 2, "K30" -> 1)
 */
function extractYearFromCohort(cohort?: string): number {
  if (!cohort) return 1;

  const cohortMatch = cohort.match(/K(\d+)/i);
  if (cohortMatch) {
    const cohortNumber = parseInt(cohortMatch[1]);
    const currentYear = new Date().getFullYear();
    const startYear = 2000 + cohortNumber;
    return Math.min(Math.max(currentYear - startYear + 1, 1), 4);
  }

  return 1;
}

/**
 * Look up student by Student Code from Firebase
 */
export async function getStudentByCode(studentCode: string): Promise<StudentProfile | null> {
  try {
    const students = await getAllStudents();

    // Search for student with matching studentId (case-insensitive)
    const student = students.find(s =>
      s.studentId.toLowerCase() === studentCode.toLowerCase()
    );

    return student || null;
  } catch (error) {
    console.error('Error looking up student:', error);
    return null;
  }
}

/**
 * Look up staff/lecturer by ID from Firebase
 */
export async function getStaffById(staffId: string): Promise<StaffProfile | null> {
  try {
    const staff = await getAllStaff();

    // Search for staff with matching staffId (case-insensitive)
    const staffMember = staff.find(s =>
      s.staffId.toLowerCase() === staffId.toLowerCase()
    );

    return staffMember || null;
  } catch (error) {
    console.error('Error looking up staff:', error);
    return null;
  }
}

/**
 * Search students by name or code from Firebase
 */
export async function searchStudents(searchTerm: string): Promise<StudentProfile[]> {
  try {
    const students = await getAllStudents();
    const lowerSearch = searchTerm.toLowerCase();

    const matches = students
      .filter(s =>
        s.studentId.toLowerCase().includes(lowerSearch) ||
        s.name.toLowerCase().includes(lowerSearch) ||
        s.email.toLowerCase().includes(lowerSearch)
      )
      .slice(0, 10); // Limit to 10 results

    return matches;
  } catch (error) {
    console.error('Error searching students:', error);
    return [];
  }
}

/**
 * Search staff by name or ID from Firebase
 */
export async function searchStaff(searchTerm: string): Promise<StaffProfile[]> {
  try {
    const staff = await getAllStaff();
    const lowerSearch = searchTerm.toLowerCase();

    const matches = staff
      .filter(s =>
        s.staffId.toLowerCase().includes(lowerSearch) ||
        s.name.toLowerCase().includes(lowerSearch) ||
        s.email.toLowerCase().includes(lowerSearch)
      )
      .slice(0, 10); // Limit to 10 results

    return matches;
  } catch (error) {
    console.error('Error searching staff:', error);
    return [];
  }
}

/**
 * Clear cache (useful for forcing refresh)
 */
export function clearCache() {
  studentsCache = null;
  staffCache = null;
  cacheTimestamp = 0;
}
