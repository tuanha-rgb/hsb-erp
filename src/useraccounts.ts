// src/data/users.ts

// ---- Types ---------------------------------------------------------------

export type UserRole =
  | "rector"
  | "dean"
  | "head"
  | "lead_staff"
  | "staff"
  | "lecturer"
  | "student";

export type UserStatus = "active" | "inactive";

export type PermissionKey =
  | "students_view" | "students_edit"
  | "lecturers_view" | "lecturers_edit"
  | "departments_view" | "departments_operations"
  | "finance_view" | "events_view"
  | "classes_view" | "timetable_manage"
  | "documents_view" | "users_view"
  | "library_view";

export type TabKey =
  | "students"
  | "lecturers"
  | "departments"
  | "finance"
  | "events"
  | "documents"
  | "classes"
  | "library"
  | "research"
  | "scholarships"
  | "settings";

export interface TabAccess {
  tabId: string;
  tabName: string;
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canExport: boolean;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  department: string;
  status: UserStatus;
  lastLogin: string;  // "YYYY-MM-DD HH:mm"
  createdAt: string;  // "YYYY-MM-DD"
  permissions: PermissionKey[];
  tabAccess: TabAccess[];
}

// Optional helpers
export const getStatusaccColor = (status: UserStatus) =>
  status === "active"
    ? "bg-emerald-100 text-emerald-700 border-emerald-200"
    : "bg-gray-100 text-gray-700 border-gray-200";

export const roleLabel: Record<UserRole, string> = {
  rector: "Rector",
  dean: "Dean",
  head: "Head of Department",
  lead_staff: "Lead Staff",
  staff: "Staff",
  lecturer: "Lecturer",
  student: "Student",
};

// ---- Sample Data ---------------------------------------------------------

export const sampleUsers: UserAccount[] = [
  {
    id: "1",
    name: "Nguyen Thi Mai",
    email: "nguyen.mai@hsb.edu.vn",
    phone: "+84 912 345 678",
    role: "rector",
    department: "N/A",
    status: "active",
    lastLogin: "2025-10-29 09:15",
    createdAt: "2024-01-15",
    permissions: [
      "students_view",
      "lecturers_view",
      "departments_view",
      "departments_operations",
      "finance_view",
    ],
    tabAccess: [],
  },
  {
    id: "2",
    name: "Tran Van Hoang",
    email: "tran.hoang@hsb.edu.vn",
    phone: "+84 903 456 789",
    role: "dean",
    department: "Faculty of Management",
    status: "active",
    lastLogin: "2025-10-29 08:30",
    createdAt: "2024-03-20",
    permissions: [
      "students_view",
      "students_edit",
      "lecturers_view",
      "events_view",
    ],
    tabAccess: [],
  },
  {
    id: "3",
    name: "Le Thi Huong",
    email: "le.huong@hsb.edu.vn",
    phone: "+84 918 765 432",
    role: "head",
    department: "Human Resources",
    status: "active",
    lastLogin: "2025-10-28 16:45",
    createdAt: "2024-05-10",
    permissions: ["lecturers_view", "lecturers_edit", "users_view"],
    tabAccess: [],
  },
  {
    id: "4",
    name: "Pham Van Khanh",
    email: "pham.khanh@hsb.edu.vn",
    phone: "+84 909 876 543",
    role: "lead_staff",
    department: "International Relations",
    status: "active",
    lastLogin: "2025-10-29 10:00",
    createdAt: "2024-06-15",
    permissions: ["students_view", "events_view", "documents_view"],
    tabAccess: [],
  },
  {
    id: "5",
    name: "Hoang Thi Lan",
    email: "hoang.lan@hsb.edu.vn",
    phone: "+84 916 234 567",
    role: "staff",
    department: "Academic Affairs",
    status: "inactive",
    lastLogin: "2025-10-15 14:20",
    createdAt: "2024-08-01",
    permissions: ["students_view", "timetable_manage"],
    tabAccess: [],
  },
  {
    id: "6",
    name: "Dr. Nguyen Van Minh",
    email: "nguyen.minh@hsb.edu.vn",
    phone: "+84 905 123 456",
    role: "lecturer",
    department: "Faculty of Business Administration",
    status: "active",
    lastLogin: "2025-10-29 07:45",
    createdAt: "2024-02-10",
    permissions: [
      "students_view",
      "classes_view",
      "timetable_manage",
      "documents_view",
    ],
    tabAccess: [],
  },
  {
    id: "7",
    name: "Pham Thi Anh",
    email: "pham.anh@hsb.edu.vn",
    phone: "+84 907 654 321",
    role: "lecturer",
    department: "Faculty of Marketing & Communication",
    status: "active",
    lastLogin: "2025-10-28 18:30",
    createdAt: "2024-04-25",
    permissions: ["students_view", "classes_view", "events_view"],
    tabAccess: [],
  },
  {
    id: "8",
    name: "Tran Minh Quan",
    email: "tran.quan.student@hsb.edu.vn",
    phone: "+84 913 987 654",
    role: "student",
    department: "Faculty of Information Technology",
    status: "active",
    lastLogin: "2025-10-29 10:30",
    createdAt: "2024-09-01",
    permissions: ["students_view", "classes_view", "library_view"],
    tabAccess: [],
  },
  {
    id: "9",
    name: "Le Thi Bich Ngoc",
    email: "le.ngoc.student@hsb.edu.vn",
    phone: "+84 914 321 098",
    role: "student",
    department: "Faculty of Economics",
    status: "active",
    lastLogin: "2025-10-29 09:00",
    createdAt: "2024-09-01",
    permissions: ["students_view", "events_view"],
    tabAccess: [],
  },
];