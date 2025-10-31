// src/data/scholarships.ts

// Literal unions for strong typing
export type ScholarshipStatus = "Active" | "Closed";
export type ApplicationStatus = "Approved" | "Under Review" | "Pending Documents" | "Rejected";

// Core interfaces
export interface Scholarship {
  id: number;
  name: string;
  type: string;                 // e.g., "Internal - Merit", "External - Company"
  amount: string;               // e.g., "10,000,000 VND" (kept as string to preserve formatting)
  period: string;               // e.g., "2024-2025"
  deadline: string;             // ISO-like date string
  status: ScholarshipStatus;
  applicants: number;
  awarded: number;
  budget: string;               // formatted currency string
  budgetUsed: string;           // formatted currency string
  department: string;
  sponsor?: string;             // optional for external scholarships
}

export interface ScholarshipApplication {
  id: number;
  studentId: string;
  studentName: string;
  scholarshipName: string;
  amount: string;               // formatted currency string
  submittedDate: string;        // ISO-like date string
  status: ApplicationStatus;
  gpa: number;
  department: string;
  reviewer: string;
  documents: string[];
  // Optional fields depending on status
  approvedDate?: string;
  rejectedDate?: string;
  rejectionReason?: string;
}

// Sample data
export const scholarships: Scholarship[] = [
  {
    id: 1,
    name: "Merit-Based Scholarship",
    type: "Internal - Merit",
    amount: "10,000,000 VND",
    period: "2024-2025",
    deadline: "2024-12-31",
    status: "Active",
    applicants: 45,
    awarded: 12,
    budget: "120,000,000 VND",
    budgetUsed: "60,000,000 VND",
    department: "Academic Affairs",
  },
  {
    id: 2,
    name: "Commendation Scholarship",
    type: "Internal - Commendation",
    amount: "5,000,000 VND",
    period: "2024-2025",
    deadline: "2025-01-15",
    status: "Active",
    applicants: 38,
    awarded: 8,
    budget: "50,000,000 VND",
    budgetUsed: "25,000,000 VND",
    department: "Student Services",
  },
  {
    id: 3,
    name: "TechCorp Vietnam Scholarship",
    type: "External - Company",
    amount: "20,000,000 VND",
    period: "2024-2025",
    deadline: "2025-02-28",
    status: "Active",
    applicants: 67,
    awarded: 5,
    budget: "100,000,000 VND",
    budgetUsed: "100,000,000 VND",
    department: "Academic Affairs",
    sponsor: "TechCorp Vietnam",
  },
  {
    id: 4,
    name: "VinGroup Talent Scholarship",
    type: "External - Company",
    amount: "25,000,000 VND",
    period: "2024-2025",
    deadline: "2024-12-20",
    status: "Active",
    applicants: 89,
    awarded: 10,
    budget: "250,000,000 VND",
    budgetUsed: "250,000,000 VND",
    department: "Academic Affairs",
    sponsor: "VinGroup",
  },
  {
    id: 5,
    name: "HSB Alumni Scholarship",
    type: "External - Alumni",
    amount: "8,000,000 VND",
    period: "2024-2025",
    deadline: "2025-01-31",
    status: "Active",
    applicants: 52,
    awarded: 15,
    budget: "120,000,000 VND",
    budgetUsed: "120,000,000 VND",
    department: "Student Services",
    sponsor: "HSB Alumni Association",
  },
];

export const applications: ScholarshipApplication[] = [
  {
    id: 1,
    studentId: "22080000",
    studentName: "Nguyễn Văn A",
    scholarshipName: "Merit-Based Scholarship",
    amount: "10,000,000 VND",
    submittedDate: "2024-10-15",
    status: "Under Review",
    gpa: 3.85,
    department: "Academic Affairs",
    reviewer: "Dr. Trần Thị B",
    documents: ["Transcript", "Recommendation Letter", "Personal Statement"],
  },
  {
    id: 2,
    studentId: "22080001",
    studentName: "Lê Thị C",
    scholarshipName: "TechCorp Vietnam Scholarship",
    amount: "20,000,000 VND",
    submittedDate: "2024-10-18",
    status: "Approved",
    gpa: 3.92,
    department: "Academic Affairs",
    reviewer: "Dr. Trần Thị B",
    approvedDate: "2024-10-22",
    documents: ["Transcript", "Project Portfolio", "Recommendation Letter"],
  },
  {
    id: 3,
    studentId: "22080002",
    studentName: "Phạm Văn D",
    scholarshipName: "Commendation Scholarship",
    amount: "5,000,000 VND",
    submittedDate: "2024-10-12",
    status: "Under Review",
    gpa: 3.45,
    department: "Student Services",
    reviewer: "Ms. Nguyễn Thị E",
    documents: ["Transcript", "Community Service Certificate", "Personal Statement"],
  },
  {
    id: 4,
    studentId: "22080003",
    studentName: "Hoàng Thị F",
    scholarshipName: "VinGroup Talent Scholarship",
    amount: "25,000,000 VND",
    submittedDate: "2024-10-20",
    status: "Pending Documents",
    gpa: 3.88,
    department: "Academic Affairs",
    reviewer: "Dr. Trần Thị B",
    documents: ["Transcript", "Recommendation Letter"],
  },
  {
    id: 5,
    studentId: "22080004",
    studentName: "Đỗ Văn G",
    scholarshipName: "HSB Alumni Scholarship",
    amount: "8,000,000 VND",
    submittedDate: "2024-10-19",
    status: "Rejected",
    gpa: 3.12,
    department: "Student Services",
    reviewer: "Ms. Nguyễn Thị E",
    rejectedDate: "2024-10-23",
    rejectionReason: "Does not meet minimum GPA requirement",
    documents: ["Transcript", "Financial Need Statement"],
  },
  {
    id: 6,
    studentId: "22080005",
    studentName: "Vũ Thị H",
    scholarshipName: "Merit-Based Scholarship",
    amount: "10,000,000 VND",
    submittedDate: "2024-10-21",
    status: "Approved",
    gpa: 3.95,
    department: "Academic Affairs",
    reviewer: "Dr. Trần Thị B",
    approvedDate: "2024-10-24",
    documents: ["Transcript", "Recommendation Letter", "Research Publication"],
  },
];

// Tailwind class helper (typed)
export const getStatusscholarshipColor = (
  status: ApplicationStatus | ScholarshipStatus
): string => {
  switch (status) {
    case "Approved":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "Under Review":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "Pending Documents":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "Rejected":
      return "bg-red-100 text-red-700 border-red-200";
    case "Active":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "Closed":
      return "bg-gray-100 text-gray-700 border-gray-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};
