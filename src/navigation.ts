import type { LucideIcon } from "lucide-react";
import { Home, Users, GraduationCap, BookOpen, Calendar, DollarSign, Award,
         Globe, Clock, FileText, TrendingUp, BarChart3, Settings, UserCheck, Briefcase,
         Building, MessageSquare } from "lucide-react";

export type SubItem = { id: string; label: string };
export type MenuItem = { id: string; label: string; icon: LucideIcon; submenu?: SubItem[] };
export type UserType = "admin" | "student" | "lecturer" | "department" | "faculty";

export const navigationConfig: Record<UserType, MenuItem[]> = {
    admin: [
          { id: 'dashboard', label: 'Dashboard', icon: Home },
          {
            id: 'students', label: 'Students', icon: GraduationCap,
            submenu: [
              { id: 'student-services', label: 'Student Services Overview' },
              { id: 'student-profile', label: 'Student Profile' },
              { id: 'ec-score', label: 'EC Score' },
              { id: 'scholarships', label: 'Scholarships' },
              { id: 'feedback', label: 'Feedback' },
              { id: 'attendance', label: 'Attendance' },
              { id: 'english-certificates', label: 'English Certificates' },
              { id: 'party-union-clubs', label: 'Party/Union/Clubs' },
              { id: 'achievements', label: 'Achievements' },
              { id: 'discipline', label: 'Discipline' },
              
            ]
          },
          {
            id: 'lecturers', label: 'Lecturers/Faculty', icon: Users,
            submenu: [
              { id: 'lecturers-overview', label: 'Lecturers Overview' },
              { id: 'lecturer-profile', label: 'Lecturer Profile' },
              { id: 'lecturer-research', label: 'Research Management'},
              { id: 'grade-management', label: 'Grade Management' },
              { id: 'view-rankings', label: 'View Rankings' },
              { id: 'syllabus-management', label: 'Syllabus Management' },
              { id: 'schedule-management', label: 'Schedule Management' },
              { id: 'community-hours', label: 'Community Hours' }
            ]
          },
          {
            id: 'departments', label: 'Departments', icon: Building,
            submenu: [
              { id: 'departments-overview', label: 'Departments Overview' },
              { id: 'operations', label: 'Operations' },
              { id: 'work-schedule', label: 'Work Schedule' },
              { id: 'hr-profile', label: 'HR Profile' },
              { id: 'kpis', label: 'KPIs' },
              { id: 'facility-management', label: 'Facility Management' }
            ]
          },
          {
            id: 'classes', label: 'Classes', icon: BookOpen,
            submenu: [
              { id: 'class-overview', label: 'Class Overview' },
              { id: 'course-management', label: 'Course Management' },
              { id: 'activity-management', label: 'Activity Management' },
              { id: 'room-management', label: 'Room Management' }
            ]
          },
          {
            id: 'events', label: 'Events', icon: Calendar,
            submenu: [
              { id: 'events-dashboard', label: 'Events Dashboard' },
              { id: 'event-information', label: 'Event Information' },
              { id: 'registration', label: 'Registration Management' },
              { id: 'check-in', label: 'Check-in System' },
              { id: 'event-analytics', label: 'Event Analytics' }
            ]
          },
          {
            id: 'timetable', label: 'Timetable', icon: Clock,
            submenu: [
              { id: 'timetable-overview', label: 'Timetable Overview' },
              { id: 'room-schedule', label: 'Room Schedule' },
              { id: 'course-schedule', label: 'Course Schedule' },
              { id: 'exam-schedule', label: 'Exam Schedule' }
            ]
          },
          {
            id: 'library', label: 'Library', icon: BookOpen,
            submenu: [
              { id: 'library-dashboard', label: 'Library Dashboard' },
              { id: 'thesis-dissertation', label: 'Thesis/Dissertation Management' },
              { id: 'textbook-management', label: 'Textbook Management' },
              { id: 'reference-book', label: 'Reference Book Management' },
              { id: 'scientific-journals', label: 'Scientific Journals' },
              { id: 'other-journals', label: 'Other Journals' }
            ]
          },
          {
            id: 'finance', label: 'Finance', icon: DollarSign,
            submenu: [
               { id: 'finance-overview', label: 'Finance Overview' },
              { id: 'tuition-fees-finance', label: 'Tuition Fees' },
              { id: 'management-costs', label: 'Management Costs' },
              { id: 'research-revenue', label: 'Research Revenue' },
              { id: 'short-term-training', label: 'Short-term Training' },
              { id: 'fund-management', label: 'Fund Management' },
              { id: 'salary', label: 'Salary' },
              { id: 'bonus', label: 'Bonus' },
              { id: 'tax', label: 'Tax' }
            ]
          },
          {
            id: 'documents', label: 'Documents', icon: FileText,
            submenu: [
              { id: 'digital-signature', label: 'Digital Signature' },
              { id: 'administrative-processes', label: 'Administrative Processes' },
              { id: 'regulations-decrees', label: 'Regulations & Decrees' },
              { id: 'hsb-office', label: 'HSB Office' }
            ]
          },
          { id: 'one-stop-service', label: 'One-Stop Service', icon: UserCheck },
          { id: 'projects', label: 'Projects', icon: Briefcase },
          { id: 'shopping', label: 'HSB-Shop', icon: UserCheck },

          {
            id: 'alumni', label: 'Alumni', icon: Award,
            submenu: [
              { id: 'alumni-overview', label: 'Alumni Overview' },
              { id: 'alumni-info', label: 'Alumni Information' },
              { id: 'executive-board', label: 'Executive Board' },
              { id: 'employment-stats', label: 'Employment Statistics' },
              { id: 'workplace-stats', label: 'Workplace Statistics' },
              { id: 'vip-stats', label: 'VIP Statistics' },
              { id: 'activity-stats', label: 'Activity Statistics' }
            ]
          },
          {
            id: 'canvas', label: 'Canvas/LMS', icon: Globe,
            submenu: [
              { id: 'lecture-management', label: 'Lecture Management' },
              { id: 'syllabus-mgmt', label: 'Syllabus Management' },
              { id: 'assignment-mgmt', label: 'Assignment Management' },
              { id: 'project-mgmt', label: 'Project Management' },
              { id: 'supervision', label: 'Supervision' },
              { id: 'thesis-mgmt', label: 'Thesis Management' }
            ]
          },
          { id: 'account', label: 'Account', icon: Settings }
        ],
     student: [
       { id: 'dashboard', label: 'Dashboard', icon: Home },
       { id: 'profile', label: 'My Profile', icon: Users },
       { id: 'academic', label: 'Academic', icon: BookOpen },
       { id: 'finance-student', label: 'Finance', icon: DollarSign },
       { id: 'activities', label: 'Activities', icon: Award },
       { id: 'canvas-student', label: 'Canvas/LMS', icon: Globe },
       { id: 'events-student', label: 'Events', icon: Calendar }
     ],
     lecturer: [
       { id: 'dashboard', label: 'Dashboard', icon: Home },
       { id: 'profile-lecturer', label: 'My Profile', icon: Users },
       { id: 'teaching', label: 'Teaching', icon: BookOpen },
       { id: 'schedule-lecturer', label: 'Schedule', icon: Clock },
       { id: 'research', label: 'Research', icon: TrendingUp },
       { id: 'canvas-lecturer', label: 'Canvas/LMS', icon: Globe },
       { id: 'messages', label: 'Messages', icon: MessageSquare }
     ],
     department: [
       { id: 'dashboard', label: 'Dashboard', icon: Home },
       {
         id: 'departments-menu', label: 'Departments', icon: Building,
         submenu: [
           { id: 'operations', label: 'Operations' },
           { id: 'work-schedule', label: 'Work Schedule' },
           { id: 'hr-profile', label: 'HR Profile' },
           { id: 'kpis', label: 'KPIs' },
           { id: 'facility-management', label: 'Facility Management' }
         ]
       },
       { id: 'account-dept', label: 'Account', icon: Settings }
     ],
     faculty: [
       { id: 'dashboard', label: 'Dashboard', icon: Home },
       {
         id: 'overview', label: 'Department Overview', icon: Building,
         submenu: [
           { id: 'faculty-structure', label: 'Faculty Structure' },
           { id: 'performance-metrics', label: 'Performance Metrics' },
           { id: 'department-activities', label: 'Department Activities' }
         ]
       },
       {
         id: 'faculty-management', label: 'Faculty Management', icon: Users,
         submenu: [
           { id: 'lecturer-overview', label: 'Lecturer Overview' },
           { id: 'teaching-loads', label: 'Teaching Loads' },
           { id: 'research-output', label: 'Research Output' },
           { id: 'faculty-rankings', label: 'Faculty Rankings' }
         ]
       },
       {
         id: 'student-overview', label: 'Student Overview', icon: GraduationCap,
         submenu: [
           { id: 'enrollment-stats', label: 'Enrollment Statistics' },
           { id: 'academic-performance', label: 'Academic Performance' },
           { id: 'retention-leave', label: 'Retention & Leave' },
           { id: 'scholarships-dept', label: 'Scholarships' }
         ]
       },
       {
         id: 'curriculum', label: 'Curriculum', icon: FileText,
         submenu: [
           { id: 'course-management-dept', label: 'Course Management' },
           { id: 'syllabus-review', label: 'Syllabus Review' },
           { id: 'program-structure', label: 'Program Structure' }
         ]
       },
       {
         id: 'research-dept', label: 'Research', icon: TrendingUp,
         submenu: [
           { id: 'research-projects', label: 'Research Projects' },
           { id: 'publications-dept', label: 'Publications' },
           { id: 'research-hours-dept', label: 'Research Hours' }
         ]
       },
       { id: 'reports', label: 'Reports', icon: BarChart3 }
     ],
};
