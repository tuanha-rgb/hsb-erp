// src/acad/lecturers.ts
// Official English-translated and standardized lecturer dataset for HSB ERP

export type AcademicRank = "Professor" | "Associate Professor" | "None";
export type Degree = "PhD" | "Master" | "MSc Candidate" | "None";
export type Status = "Active" | "Inactive";

export type Department =
  | "Board of Rectors"
  | "Institute of Non-Traditional Security"
  | "Faculty of Marketing and Communication"
  | "Faculty of Management"
  | "Faculty of Non-Traditional Security";

export type Position =
  | "Rector"
  | "Vice Rector"
  | "Head of Faculty"
  | "Vice Dean of Faculty"
  | "Course Head"
  | "Head of Division"
  | "Head of Department"
  | "Director of Center"
  | "Faculty Secretary"
  | "Lecturer"
  | "Advisor"
  | "Researcher"
  | "Other";

export interface Lecturer {
  id: string;
  name: string;
  dob: string;                // DD/MM/YYYY
  rank: AcademicRank;
  degree: Degree;
  position: Position;
  department: Department;
  status: Status;
  teachingHours: number;      // numeric, e.g., 480
  publications: number;       // numeric, e.g., 12
}

// ========================================================
// Lecturer Dataset (with teachingHours & publications)
// ========================================================

export const sampleLecturers: Lecturer[] = [
  // --- Board of Rectors ---
  {
    id: "L0001",
    name: "Hoang Dinh Phi",
    dob: "12/11/1969",
    rank: "Associate Professor",
    degree: "PhD",
    position: "Rector",
    department: "Board of Rectors",
    status: "Active",
    teachingHours: 120,
    publications: 40,
  },
  {
    id: "L0002",
    name: "Nguyen Ngoc Thang",
    dob: "08/07/1977",
    rank: "Associate Professor",
    degree: "PhD",
    position: "Vice Rector",
    department: "Board of Rectors",
    status: "Active",
    teachingHours: 160,
    publications: 28,
  },

  // --- Institute of Non-Traditional Security ---
  {
    id: "L0003",
    name: "Nguyen Xuan Yem",
    dob: "02/06/1957",
    rank: "Professor",
    degree: "PhD",
    position: "Head of Faculty",
    department: "Institute of Non-Traditional Security",
    status: "Active",
    teachingHours: 220,
    publications: 75,
  },
  {
    id: "L0004",
    name: "Do Khac Hai",
    dob: "24/08/1963",
    rank: "Associate Professor",
    degree: "PhD",
    position: "Course Head",
    department: "Institute of Non-Traditional Security",
    status: "Active",
    teachingHours: 380,
    publications: 24,
  },
  {
    id: "L0005",
    name: "Luu Van Vinh",
    dob: "05/06/1963",
    rank: "None",
    degree: "Master",
    position: "Lecturer",
    department: "Institute of Non-Traditional Security",
    status: "Active",
    teachingHours: 420,
    publications: 6,
  },

  // --- Faculty of Marketing and Communication ---
  {
    id: "L0006",
    name: "Dinh Thi Thuy Hang",
    dob: "01/05/1959",
    rank: "Associate Professor",
    degree: "PhD",
    position: "Head of Faculty",
    department: "Faculty of Marketing and Communication",
    status: "Active",
    teachingHours: 260,
    publications: 32,
  },
  {
    id: "L0007",
    name: "Tran Dang Tuan",
    dob: "05/10/1957",
    rank: "None",
    degree: "PhD",
    position: "Advisor",
    department: "Faculty of Marketing and Communication",
    status: "Active",
    teachingHours: 80,
    publications: 18,
  },
  {
    id: "L0008",
    name: "Ta Thi Dao",
    dob: "11/11/1979",
    rank: "None",
    degree: "PhD",
    position: "Vice Dean of Faculty",
    department: "Faculty of Marketing and Communication",
    status: "Active",
    teachingHours: 400,
    publications: 20,
  },
  {
    id: "L0009",
    name: "Florian Philippe Eric Lefebvre",
    dob: "30/07/1992",
    rank: "None",
    degree: "PhD",
    position: "Lecturer",
    department: "Faculty of Marketing and Communication",
    status: "Active",
    teachingHours: 360,
    publications: 12,
  },
  {
    id: "L0010",
    name: "Pham Thuy Duong",
    dob: "21/03/1982",
    rank: "None",
    degree: "PhD",
    position: "Lecturer",
    department: "Faculty of Marketing and Communication",
    status: "Active",
    teachingHours: 380,
    publications: 14,
  },
  {
    id: "L0011",
    name: "Nguyen Lan Huong",
    dob: "23/01/1991",
    rank: "None",
    degree: "PhD",
    position: "Head of Division",
    department: "Faculty of Marketing and Communication",
    status: "Active",
    teachingHours: 240,
    publications: 10,
  },
  {
    id: "L0012",
    name: "Dong Dao Dung",
    dob: "02/09/1984",
    rank: "None",
    degree: "PhD",
    position: "Lecturer",
    department: "Faculty of Marketing and Communication",
    status: "Active",
    teachingHours: 370,
    publications: 9,
  },
  {
    id: "L0013",
    name: "Dao Tuan Duc",
    dob: "21/03/1992",
    rank: "None",
    degree: "Master",
    position: "Lecturer",
    department: "Faculty of Marketing and Communication",
    status: "Active",
    teachingHours: 340,
    publications: 5,
  },

  // --- Faculty of Management ---
  {
    id: "L0014",
    name: "Nguyen Quynh Huy",
    dob: "18/01/1977",
    rank: "None",
    degree: "PhD",
    position: "Vice Dean of Faculty",
    department: "Faculty of Management",
    status: "Active",
    teachingHours: 410,
    publications: 16,
  },
  {
    id: "L0015",
    name: "Nguyen Thi Hang Nga",
    dob: "13/10/1986",
    rank: "None",
    degree: "PhD",
    position: "Lecturer",
    department: "Faculty of Management",
    status: "Active",
    teachingHours: 395,
    publications: 11,
  },
  {
    id: "L0016",
    name: "Nguyen Van Giap",
    dob: "03/05/1974",
    rank: "None",
    degree: "PhD",
    position: "Lecturer",
    department: "Faculty of Management",
    status: "Active",
    teachingHours: 405,
    publications: 9,
  },
  {
    id: "L0017",
    name: "Truong Minh Duc",
    dob: "05/05/1962",
    rank: "None",
    degree: "PhD",
    position: "Lecturer",
    department: "Faculty of Management",
    status: "Active",
    teachingHours: 360,
    publications: 13,
  },
  {
    id: "L0018",
    name: "Nguyen Anh Tuan",
    dob: "08/07/1983",
    rank: "None",
    degree: "PhD",
    position: "Lecturer",
    department: "Faculty of Management",
    status: "Active",
    teachingHours: 420,
    publications: 8,
  },
  {
    id: "L0019",
    name: "Nguyen Thi Ly",
    dob: "06/10/1993",
    rank: "None",
    degree: "PhD",
    position: "Lecturer",
    department: "Faculty of Management",
    status: "Active",
    teachingHours: 375,
    publications: 7,
  },
  {
    id: "L0020",
    name: "Bui Minh Thuy",
    dob: "16/07/1984",
    rank: "None",
    degree: "PhD",
    position: "Lecturer",
    department: "Faculty of Management",
    status: "Active",
    teachingHours: 390,
    publications: 10,
  },
  {
    id: "L0021",
    name: "Mai Viet Dung",
    dob: "28/08/1982",
    rank: "None",
    degree: "MSc Candidate",
    position: "Head of Department",
    department: "Faculty of Management",
    status: "Active",
    teachingHours: 260,
    publications: 6,
  },
  {
    id: "L0022",
    name: "Do Thi Thuy Trang",
    dob: "16/12/1983",
    rank: "None",
    degree: "PhD",
    position: "Lecturer",
    department: "Faculty of Management",
    status: "Active",
    teachingHours: 365,
    publications: 9,
  },
  {
    id: "L0023",
    name: "Le Phuong Thao",
    dob: "19/06/1992",
    rank: "None",
    degree: "MSc Candidate",
    position: "Lecturer",
    department: "Faculty of Management",
    status: "Active",
    teachingHours: 330,
    publications: 5,
  },

  // --- Faculty of Non-Traditional Security ---
  {
    id: "L0026",
    name: "Tran Ngoc Ca",
    dob: "26/08/1955",
    rank: "Associate Professor",
    degree: "PhD",
    position: "Head of Faculty",
    department: "Faculty of Non-Traditional Security",
    status: "Active",
    teachingHours: 300,
    publications: 38,
  },
  {
    id: "L0027",
    name: "Hoang Anh Tuan",
    dob: "24/11/1991",
    rank: "None",
    degree: "PhD",
    position: "Head of Department",
    department: "Faculty of Non-Traditional Security",
    status: "Active",
    teachingHours: 450,
    publications: 14,
  },
  {
    id: "L0035",
    name: "Tran Manh Hung",
    dob: "05/07/1979",
    rank: "None",
    degree: "MSc Candidate",
    position: "Director of Center",
    department: "Faculty of Non-Traditional Security",
    status: "Active",
    teachingHours: 240,
    publications: 8,
  },
  {
    id: "L0036",
    name: "Vuong Thi Nhung",
    dob: "21/05/1987",
    rank: "None",
    degree: "MSc Candidate",
    position: "Faculty Secretary",
    department: "Faculty of Non-Traditional Security",
    status: "Active",
    teachingHours: 210,
    publications: 4,
  },
  {
    id: "L0037",
    name: "Nguyen Huy Anh",
    dob: "27/04/1990",
    rank: "None",
    degree: "Master",
    position: "Lecturer",
    department: "Faculty of Non-Traditional Security",
    status: "Active",
    teachingHours: 400,
    publications: 6,
  },
];
