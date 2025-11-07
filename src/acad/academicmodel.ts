// src/features/academics/academicModels.ts

export type FacultyCode = "FOM" | "FOMAC" | "FONS" | "INS" | "ITM";
export interface Faculty {
  code: FacultyCode;
  name: string;
}


export interface ProgramItem {
  code: string;
  name: string;
  faculty: FacultyCode;
}

export interface ProgramCatalog {
  bachelor: ProgramItem[];
  master: ProgramItem[];
  phd: ProgramItem[];
}

export interface BachelorProgramStat {
  code: string;       // e.g., "MET"
  students: number;   // count
  passRate: number;   // percentage (0..100)
  stdDev: number;     // standard deviation
}

export interface FacultyMetric {
  code: FacultyCode;
  name: string;
  timelyDelivery: number; // percentage (0..100)
  stdDev: number;
  skewness: number;
  kurtosis: number;
}

export type CourseLevel = "Bachelor" | "Master" | "PhD";
export interface CourseItem {
  id: string;
  name: string;        // bilingual ok
  program: string;     // program code
  faculty: FacultyCode;
  level: CourseLevel;
  instructor: string;
  students: number;
  avgGrade: number;
  passRate: number;    // percentage (0..100)
}

export type LetterGrade = "A" | "B" | "C" | "D" | "F";
export interface StudentGradeRow {
  studentId: string;
  name: string;
  midterm: number;
  final: number;
  assignments: number;
  participation: number;
  overall: number;
  letterGrade: LetterGrade;
  gpa: number;
}
