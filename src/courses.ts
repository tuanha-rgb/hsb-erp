// src/features/academics/data/courses.ts
import { CourseItem } from "./academicmodel";

export const courseData: CourseItem[] = [
  { id: "HSB1001",  name: "Quản trị học / Management",                                         program: "MET", faculty: "FOM",   level: "Bachelor", instructor: "Dr. Nguyen Van A", students: 45, avgGrade: 3.45, passRate: 95.6 },
  { id: "HSB1002",  name: "Kinh tế học / Economics",                                           program: "MET", faculty: "FOM",   level: "Bachelor", instructor: "Dr. Tran Thi B",   students: 52, avgGrade: 3.28, passRate: 92.3 },
  { id: "HSB1003",  name: "Phân tích dữ liệu / Data Analysis",                                 program: "MET", faculty: "FONS",  level: "Bachelor", instructor: "Dr. Le Van C",     students: 38, avgGrade: 3.52, passRate: 97.4 },
  { id: "HSB1004",  name: "Luật Kinh doanh và đạo đức kinh doanh / Business Law and Ethics",   program: "MET", faculty: "FOM",   level: "Bachelor", instructor: "Dr. Pham Thi D",   students: 48, avgGrade: 3.38, passRate: 93.8 },
  { id: "HSB1005",  name: "Nguyên lý kế toán / Principle of Accounting",                       program: "MET", faculty: "FOM",   level: "Bachelor", instructor: "Dr. Hoang Van E",  students: 44, avgGrade: 3.15, passRate: 90.9 },
  { id: "HSB1006",  name: "Quản trị tài chính doanh nghiệp / Management of Corporate Finance", program: "MAS", faculty: "FOM",   level: "Bachelor", instructor: "Dr. Vo Thi F",    students: 42, avgGrade: 3.42, passRate: 94.5 },
  { id: "HSB2014",  name: "Quản trị công ty / Corporate Governance",                           program: "MET", faculty: "FOM",   level: "Bachelor", instructor: "Dr. Bui Van G",    students: 36, avgGrade: 3.58, passRate: 96.2 },
  { id: "HSB1033",  name: "Quản trị nguồn nhân lực và nhân tài / HR & Talents",                program: "MAS", faculty: "FOM",   level: "Bachelor", instructor: "Dr. Dinh Thi H",   students: 50, avgGrade: 3.35, passRate: 93.5 },
  { id: "HSB2001E", name: "Tư duy & quản trị chiến lược / Strategic Thinking & Management",    program: "MET", faculty: "FOM",   level: "Bachelor", instructor: "Dr. Ly Van I",     students: 40, avgGrade: 3.48, passRate: 95.0 },
  { id: "HSB2003E", name: "Kinh doanh toàn cầu / Global Business",                             program: "MET", faculty: "FOM",   level: "Bachelor", instructor: "Dr. Mai Van J",    students: 35, avgGrade: 3.62, passRate: 97.1 },
  { id: "HSB2004E", name: "Thương hiệu & tài sản trí tuệ / Branding & IP",                     program: "MAC", faculty: "FOMAC", level: "Bachelor", instructor: "Dr. Dang Thi K",   students: 38, avgGrade: 3.55, passRate: 96.8 },
  { id: "HSB3119",  name: "Tổng quan KHDL / Intro to Data Science",                            program: "MET", faculty: "FONS",  level: "Bachelor", instructor: "Dr. Cao Van L",    students: 32, avgGrade: 3.68, passRate: 98.1 },
  { id: "HSB2023",  name: "Toán ứng dụng / Applied Mathematics",                               program: "MET", faculty: "FONS",  level: "Bachelor", instructor: "Dr. Phan Thi M",   students: 46, avgGrade: 3.22, passRate: 91.3 },
  { id: "HSB2011",  name: "Nguyên lý Marketing & TT / Principles of Marketing & Comm",         program: "MAC", faculty: "FOMAC", level: "Bachelor", instructor: "Dr. Truong Van N", students: 55, avgGrade: 3.45, passRate: 94.5 },

  // Master
  { id: "MNS401",   name: "Cybersecurity Management",                                          program: "MNS", faculty: "FONS",  level: "Master",   instructor: "Dr. Ta Van Canh", students: 38, avgGrade: 3.52, passRate: 97.4 },
  { id: "MBA501",   name: "Corporate Strategy",                                                program: "HSB-MBA", faculty: "FOM", level: "Master", instructor: "Dr. Le Van P",     students: 28, avgGrade: 3.68, passRate: 100 },
  { id: "MNS601",   name: "Advanced Security Analysis",                                        program: "MNS", faculty: "FONS",  level: "Master",   instructor: "Dr. Tran Thi Q",  students: 22, avgGrade: 3.71, passRate: 100 },
];
