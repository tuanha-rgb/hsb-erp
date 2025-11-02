"use client";

import React, { useState, useEffect } from 'react';
import * as QRCode from "qrcode";

import { Home, User, BookOpen, DollarSign, Activity, Calendar, Bell, Search, 
  ChevronRight, TrendingUp, Clock, CheckCircle, AlertCircle, Mail, Phone, 
  CreditCard, Edit3, Briefcase, Award, Globe, LockIcon, UnlockIcon, ChevronLeftIcon, ChevronLeft, Play, 
FileQuestion, FileDown, PieChart, Filter, XCircle, Pencil, Users, FileText, Gem, Notebook, Book, Building,
Star, Send, MessageSquare} 
from 'lucide-react';
import Documents from "./documents/documenthandbook";
import LibraryViewer from "./library/libraryviewer";

export default function Student() {
  const [activePage, setActivePage] = useState('calendar');
  const [academicSubTab, setAcademicSubTab] = useState('courses');
  const [calendarView, setCalendarView] = useState('month');
// Sidebar collapse/lock
const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
const [sidebarLocked, setSidebarLocked] = useState<boolean>(true);

const toggleLock = () => setSidebarLocked(v => !v);
const toggleCollapse = () => {
  if (sidebarLocked) return;         // ignore while locked
  setSidebarCollapsed(v => !v);
};
  // Optional: hover-to-expand when unlocked

  const upcomingActivities = [
    { 
      id: 1, 
      type: 'class',
      title: 'Data Structures Lecture', 
      course: 'CS301',
      time: 'Today, 10:00 AM',
      location: 'Room A301',
      duration: '1.5 hours',
      icon: 'book',
      color: 'blue'
    },
    { 
      id: 2, 
      type: 'assignment',
      title: 'Assignment 3 Due', 
      course: 'CS301',
      time: 'Tomorrow, 11:59 PM',
      location: 'Online Submission',
      urgent: true,
      icon: 'alert',
      color: 'red'
    },
    { 
      id: 3, 
      type: 'exam',
      title: 'Midterm Exam', 
      course: 'CS303',
      time: 'Oct 25, 9:00 AM',
      location: 'Hall A',
      duration: '2 hours',
      icon: 'file',
      color: 'purple'
    },
    { 
      id: 4, 
      type: 'event',
      title: 'Career Fair 2025', 
      course: 'Student Affairs',
      time: 'Oct 28, 2:00 PM',
      location: 'Main Auditorium',
      duration: '3 hours',
      icon: 'briefcase',
      color: 'emerald'
    },
    { 
      id: 5, 
      type: 'office_hours',
      title: 'Prof. Johnson Office Hours', 
      course: 'CS302',
      time: 'Oct 19, 3:00 PM',
      location: 'B205',
      duration: '1 hour',
      icon: 'user',
      color: 'orange'
    },
  ];

  const upcomingItems = [
    { id: 1, type: 'assignment', title: 'Assignment 3', course: 'CS301', due: 'Oct 18', urgent: true },
    { id: 2, type: 'project', title: 'Project Proposal', course: 'CS302', due: 'Oct 20', urgent: false },
    { id: 3, type: 'exam', title: 'Midterm Exam', course: 'CS303', due: 'Oct 25', urgent: false },
  ];

  const recentActivity = [
    { id: 1, action: 'Grade posted', detail: 'Assignment 2 - CS302', grade: 'A', time: '2h ago' },
    { id: 2, action: 'New announcement', detail: 'CS303 - Office hours update', time: '5h ago' },
    { id: 3, action: 'Material uploaded', detail: 'Lecture 8 slides - CS301', time: '1d ago' },
  ];

  const academicCourses = [
    { 
      id: 1, 
      code: 'CS301', 
      name: 'Data Structures', 
      credits: 4, 
      instructor: 'Dr. Smith',
      schedule: 'Mon, Wed 10:00-11:30',
      room: 'A301',
      attendance: 92,
      midterm: 85,
      final: null,
      assignments: 88,
      currentGrade: 'A-'
    },
    { 
      id: 2, 
      code: 'CS302', 
      name: 'Database Systems', 
      credits: 3, 
      instructor: 'Prof. Johnson',
      schedule: 'Tue, Thu 14:00-15:30',
      room: 'B205',
      attendance: 95,
      midterm: 78,
      final: null,
      assignments: 82,
      currentGrade: 'B+'
    },
    { 
      id: 3, 
      code: 'CS303', 
      name: 'Software Engineering', 
      credits: 4, 
      instructor: 'Dr. Williams',
      schedule: 'Mon, Wed, Fri 09:00-10:00',
      room: 'C102',
      attendance: 88,
      midterm: 90,
      final: null,
      assignments: 85,
      currentGrade: 'A'
    },
    { 
      id: 4, 
      code: 'MATH201', 
      name: 'Linear Algebra', 
      credits: 3, 
      instructor: 'Prof. Anderson',
      schedule: 'Tue, Thu 10:00-11:30',
      room: 'D401',
      attendance: 90,
      midterm: 82,
      final: null,
      assignments: 79,
      currentGrade: 'B+'
    },
  ];

  const assignments = [
    { id: 1, course: 'CS301', title: 'Assignment 3: Binary Trees', dueDate: '2025-10-18', status: 'pending', grade: null },
    { id: 2, course: 'CS302', title: 'Project Proposal', dueDate: '2025-10-20', status: 'pending', grade: null },
    { id: 3, course: 'CS301', title: 'Assignment 2: Linked Lists', dueDate: '2025-10-10', status: 'graded', grade: 'A' },
    { id: 4, course: 'CS303', title: 'Design Document', dueDate: '2025-10-15', status: 'submitted', grade: null },
  ];

  const upcomingExams = [
    { id: 1, course: 'CS303', type: 'Midterm', date: '2025-10-25', time: '09:00-11:00', room: 'Hall A' },
    { id: 2, course: 'MATH201', type: 'Quiz 3', date: '2025-10-22', time: '10:00-10:30', room: 'D401' },
  ];

  const transcriptData = [
    {
      semester: 'Semester I - Fall 2022',
      gpa: 2.90,
      credits: 18,
      courses: [
        { code: 'CS101', name: 'Introduction to Programming', credits: 4, grade: 'B+', points: 3.3, instructor: 'Dr. Smith' },
        { code: 'MATH101', name: 'Calculus I', credits: 4, grade: 'B', points: 3.0, instructor: 'Prof. Johnson' },
        { code: 'ENG101', name: 'English Composition', credits: 3, grade: 'A-', points: 3.7, instructor: 'Dr. Williams' },
        { code: 'PHY101', name: 'Physics I', credits: 4, grade: 'C+', points: 2.3, instructor: 'Prof. Brown' },
        { code: 'PE101', name: 'Physical Education', credits: 3, grade: 'A', points: 4.0, instructor: 'Coach Davis' },
      ]
    },
    {
      semester: 'Semester II - Spring 2023',
      gpa: 3.12,
      credits: 19,
      courses: [
        { code: 'CS102', name: 'Data Structures', credits: 4, grade: 'A-', points: 3.7, instructor: 'Dr. Smith' },
        { code: 'MATH102', name: 'Calculus II', credits: 4, grade: 'B+', points: 3.3, instructor: 'Prof. Johnson' },
        { code: 'CS201', name: 'Computer Architecture', credits: 4, grade: 'B+', points: 3.3, instructor: 'Dr. Lee' },
        { code: 'ENG102', name: 'Technical Writing', credits: 3, grade: 'A', points: 4.0, instructor: 'Dr. Williams' },
        { code: 'HIST101', name: 'World History', credits: 4, grade: 'B', points: 3.0, instructor: 'Prof. Taylor' },
      ]
    },
    {
      semester: 'Semester III - Fall 2023',
      gpa: 2.97,
      credits: 18,
      courses: [
        { code: 'CS202', name: 'Algorithms', credits: 4, grade: 'B', points: 3.0, instructor: 'Dr. Chen' },
        { code: 'CS203', name: 'Database Systems', credits: 3, grade: 'B+', points: 3.3, instructor: 'Prof. Anderson' },
        { code: 'MATH201', name: 'Linear Algebra', credits: 3, grade: 'C+', points: 2.3, instructor: 'Prof. Martinez' },
        { code: 'CS204', name: 'Operating Systems', credits: 4, grade: 'B+', points: 3.3, instructor: 'Dr. Wilson' },
        { code: 'ECON101', name: 'Microeconomics', credits: 4, grade: 'B', points: 3.0, instructor: 'Prof. Garcia' },
      ]
    },
    {
      semester: 'Semester IV - Spring 2024',
      gpa: 3.79,
      credits: 17,
      courses: [
        { code: 'CS301', name: 'Software Engineering', credits: 4, grade: 'A', points: 4.0, instructor: 'Dr. Williams' },
        { code: 'CS302', name: 'Web Development', credits: 3, grade: 'A', points: 4.0, instructor: 'Prof. Kim' },
        { code: 'CS303', name: 'Machine Learning', credits: 4, grade: 'A-', points: 3.7, instructor: 'Dr. Zhang' },
        { code: 'BUS201', name: 'Business Management', credits: 3, grade: 'A-', points: 3.7, instructor: 'Prof. White' },
        { code: 'CS304', name: 'Computer Networks', credits: 3, grade: 'A', points: 4.0, instructor: 'Dr. Brown' },
      ]
    },
  ];

  const getGradeColor = (grade) => {
    if (grade.startsWith('A')) return 'text-emerald-600 bg-emerald-50';
    if (grade.startsWith('B')) return 'text-blue-600 bg-blue-50';
    if (grade.startsWith('C')) return 'text-orange-600 bg-orange-50';
    if (grade.startsWith('D')) return 'text-red-600 bg-red-50';
    return 'text-gray-600 bg-gray-50';
  };

  const financialData = {
    totalTuition: 87400000,
    totalPaid: 65550000,
    outstanding: 21850000,
    scholarships: 15000000,
    grants: 8000000,
    nextPaymentDue: '2025-11-15',
    nextPaymentAmount: 10925000
  };

  const paymentHistory = [
    { id: 1, date: '2024-08-15', description: 'Semester IV Tuition Payment', amount: 21850000, status: 'paid', method: 'Bank Transfer' },
    { id: 2, date: '2024-03-10', description: 'Semester III Tuition Payment', amount: 21850000, status: 'paid', method: 'Credit Card' },
    { id: 3, date: '2023-09-01', description: 'Semester II Tuition Payment', amount: 21850000, status: 'paid', method: 'Bank Transfer' },
  ];

  const scholarshipsGrants = [
    { 
      id: 1, 
      name: 'Academic Excellence Scholarship', 
      type: 'scholarship', 
      amount: 10000000, 
      status: 'active',
      awarded: '2023-09-01',
      period: 'Annual',
      renewable: true
    },
    { 
      id: 2, 
      name: 'STEM Merit Scholarship', 
      type: 'scholarship', 
      amount: 5000000, 
      status: 'active',
      awarded: '2024-01-15',
      period: 'Semester',
      renewable: true
    },
    { 
      id: 3, 
      name: 'Research Grant', 
      type: 'grant', 
      amount: 8000000, 
      status: 'active',
      awarded: '2024-03-01',
      period: 'One-time',
      renewable: false
    },
  ];

  const upcomingPayments = [
    { id: 1, description: 'Semester V Tuition - 1st Installment', amount: 10925000, dueDate: '2025-11-15', status: 'pending' },
    { id: 2, description: 'Semester V Tuition - 2nd Installment', amount: 10925000, dueDate: '2025-12-15', status: 'upcoming' },
  ];

  const feesBreakdown = [
    { category: 'Tuition Fee', amount: 70000000, paid: 52500000, outstanding: 17500000 },
    { category: 'Lab Fee', amount: 8000000, paid: 6000000, outstanding: 2000000 },
    { category: 'Library Fee', amount: 2400000, paid: 1800000, outstanding: 600000 },
    { category: 'Sports & Activities', amount: 3000000, paid: 2250000, outstanding: 750000 },
    { category: 'Student Services', amount: 4000000, paid: 3000000, outstanding: 1000000 },
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const activitiesData = {
    registered: [
      {
        id: 1,
        title: 'Tech Innovation Summit 2025',
        type: 'conference',
        category: 'Academic',
        date: '2025-10-28',
        time: '09:00 AM - 5:00 PM',
        location: 'Main Auditorium',
        organizer: 'CS Department',
        participants: 250,
        maxParticipants: 300,
        status: 'confirmed',
        description: 'Annual technology conference featuring industry leaders and student presentations.',
        ecPoints: 10
      },
      {
        id: 2,
        title: 'Career Fair 2025',
        type: 'career',
        category: 'Professional',
        date: '2025-11-05',
        time: '2:00 PM - 6:00 PM',
        location: 'Sports Complex',
        organizer: 'Career Services',
        participants: 450,
        maxParticipants: 500,
        status: 'confirmed',
        description: 'Meet with top employers and explore internship opportunities.',
        ecPoints: 5
      },
      {
        id: 3,
        title: 'Volunteer Day - Community Service',
        type: 'volunteer',
        category: 'Community',
        date: '2025-10-30',
        time: '8:00 AM - 12:00 PM',
        location: 'Local Community Center',
        organizer: 'Student Affairs',
        participants: 80,
        maxParticipants: 100,
        status: 'confirmed',
        description: 'Help the local community through various service projects.',
        ecPoints: 15
      },
    ],
    available: [
      {
        id: 4,
        title: 'AI & Machine Learning Workshop',
        type: 'workshop',
        category: 'Academic',
        date: '2025-11-10',
        time: '3:00 PM - 6:00 PM',
        location: 'Lab B201',
        organizer: 'AI Research Lab',
        participants: 45,
        maxParticipants: 50,
        status: 'open',
        description: 'Hands-on workshop covering latest ML frameworks and techniques.',
        ecPoints: 8
      },
      {
        id: 5,
        title: 'Annual Sports Tournament',
        type: 'sports',
        category: 'Sports',
        date: '2025-11-15',
        time: '9:00 AM - 5:00 PM',
        location: 'University Stadium',
        organizer: 'Sports Department',
        participants: 120,
        maxParticipants: 200,
        status: 'open',
        description: 'Inter-department sports competition including basketball, volleyball, and track.',
        ecPoints: 12
      },
      {
        id: 6,
        title: 'Cultural Festival 2025',
        type: 'cultural',
        category: 'Cultural',
        date: '2025-11-20',
        time: '6:00 PM - 10:00 PM',
        location: 'Main Campus',
        organizer: 'International Office',
        participants: 300,
        maxParticipants: 500,
        status: 'open',
        description: 'Celebrate diversity with food, music, and performances from around the world.',
        ecPoints: 10
      },
      {
        id: 7,
        title: 'Startup Pitch Competition',
        type: 'competition',
        category: 'Professional',
        date: '2025-12-01',
        time: '1:00 PM - 5:00 PM',
        location: 'Innovation Hub',
        organizer: 'Entrepreneurship Club',
        participants: 30,
        maxParticipants: 50,
        status: 'open',
        description: 'Present your startup ideas to judges and win seed funding.',
        ecPoints: 20
      },
    ],
    completed: [
      {
        id: 8,
        title: 'Python Programming Bootcamp',
        type: 'workshop',
        category: 'Academic',
        date: '2025-09-15',
        time: '9:00 AM - 5:00 PM',
        location: 'Computer Lab',
        organizer: 'CS Department',
        status: 'completed',
        ecPoints: 10,
        certificateAvailable: true
      },
      {
        id: 9,
        title: 'Beach Cleanup Initiative',
        type: 'volunteer',
        category: 'Community',
        date: '2025-09-20',
        time: '7:00 AM - 11:00 AM',
        location: 'Nha Trang Beach',
        organizer: 'Environmental Club',
        status: 'completed',
        ecPoints: 12,
        certificateAvailable: true
      },
    ]
  };

  const ecLevelProgress = {
    current: 'Good',
    points: 47,
    nextLevel: 'Excellent',
    pointsNeeded: 13,
    totalForNextLevel: 60
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case 'Academic': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Professional': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Community': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Sports': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Cultural': return 'bg-pink-100 text-pink-700 border-pink-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const calendarEvents = [
    // Week 1 (Oct 14-20)
    { id: 1, title: 'Data Structures', type: 'class', date: '2025-10-16', time: '10:00', duration: '1.5h', location: 'A301', color: 'blue' },
    { id: 2, title: 'Database Systems', type: 'class', date: '2025-10-16', time: '14:00', duration: '1.5h', location: 'B205', color: 'blue' },
    { id: 3, title: 'Assignment 3 Due', type: 'assignment', date: '2025-10-18', time: '23:59', location: 'Online', color: 'red' },
    { id: 4, title: 'Prof. Office Hours', type: 'office_hours', date: '2025-10-19', time: '15:00', duration: '1h', location: 'B205', color: 'orange' },
    
    // Week 2 (Oct 21-27)
    { id: 5, title: 'Project Proposal Due', type: 'assignment', date: '2025-10-20', time: '23:59', location: 'Online', color: 'red' },
    { id: 6, title: 'Software Engineering', type: 'class', date: '2025-10-22', time: '09:00', duration: '1h', location: 'C102', color: 'blue' },
    { id: 7, title: 'Quiz 3 - MATH201', type: 'exam', date: '2025-10-22', time: '10:00', duration: '30min', location: 'D401', color: 'purple' },
    { id: 8, title: 'CS303 Midterm', type: 'exam', date: '2025-10-25', time: '09:00', duration: '2h', location: 'Hall A', color: 'purple' },
    
    // Week 3 (Oct 28 - Nov 3)
    { id: 9, title: 'Tech Summit 2025', type: 'event', date: '2025-10-28', time: '09:00', duration: '8h', location: 'Main Auditorium', color: 'emerald' },
    { id: 10, title: 'Volunteer Day', type: 'event', date: '2025-10-30', time: '08:00', duration: '4h', location: 'Community Center', color: 'emerald' },
    
    // Week 4 (Nov 4-10)
    { id: 11, title: 'Career Fair', type: 'event', date: '2025-11-05', time: '14:00', duration: '4h', location: 'Sports Complex', color: 'emerald' },
    { id: 12, title: 'AI Workshop', type: 'event', date: '2025-11-10', time: '15:00', duration: '3h', location: 'Lab B201', color: 'emerald' },
  ];

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const currentDate = new Date(2025, 9, 16); // October 16, 2025
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getEventsForDate = (day) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return calendarEvents.filter(event => event.date === dateStr);
  };

  const todaysEvents = getEventsForDate(16);
  const upcomingWeekEvents = calendarEvents.filter(event => {
    const eventDate = new Date(event.date);
    const today = new Date(2025, 9, 16);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    return eventDate >= today && eventDate <= nextWeek;
  });

  const getEventColor = (color) => {
    switch(color) {
      case 'blue': return 'bg-blue-500';
      case 'red': return 'bg-red-500';
      case 'purple': return 'bg-purple-500';
      case 'orange': return 'bg-orange-500';
      case 'emerald': return 'bg-emerald-500';
      default: return 'bg-gray-500';
    }
  };

  const getEventBgColor = (color) => {
    switch(color) {
      case 'blue': return 'bg-blue-50 border-blue-200';
      case 'red': return 'bg-red-50 border-red-200';
      case 'purple': return 'bg-purple-50 border-purple-200';
      case 'orange': return 'bg-orange-50 border-orange-200';
      case 'emerald': return 'bg-emerald-50 border-emerald-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const semesterGrades = [
    { semester: 'Semester I', gpa: 2.90, ecLevel: 'Good' },
    { semester: 'Semester II', gpa: 3.12, ecLevel: 'Excellent' },
    { semester: 'Semester III', gpa: 2.97, ecLevel: 'Satisfactory' },
    { semester: 'Semester IV', gpa: 3.79, ecLevel: 'Excellent' },
    { semester: 'Semester V', gpa: null, ecLevel: null },
    { semester: 'Semester VI', gpa: null, ecLevel: null },
    { semester: 'Semester VII', gpa: null, ecLevel: null },
    { semester: 'Semester VIII', gpa: null, ecLevel: null },
  ];

  const getECLevelColor = (level) => {
    if (!level) return 'bg-gray-100 text-gray-400';
    switch(level) {
      case 'Excellent': return 'bg-emerald-100 text-emerald-700';
      case 'Good': return 'bg-blue-100 text-blue-700';
      case 'Satisfactory': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-400';
    }
  };

 
 // --- Types (keep if you haven't added them yet) ---
type CanvasProps = {
  canvasSidebarOpen: boolean;
  setCanvasSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  canvasTab: 'courses' | 'groups' | 'todo' | 'notifications' | 'Progress';
  setCanvasTab: React.Dispatch<
    React.SetStateAction<'courses' | 'groups' | 'todo' | 'notifications' | 'Progress'>
  >;
  selectedCourse: any | null;
  setSelectedCourse: React.Dispatch<React.SetStateAction<any | null>>;
  courseSection:
    | 'lectures'
    | 'assignments'
    | 'announcements'
    | 'discussion'
    | 'grading'
    | 'attendance'
    | 'media';
  setCourseSection: React.Dispatch<
    React.SetStateAction<
      | 'lectures'
      | 'assignments'
      | 'announcements'
      | 'discussion'
      | 'grading'
      | 'attendance'
      | 'media'
    >
  >;
};


// --- Canvas - Global ---

const [canvasSidebarOpen, setCanvasSidebarOpen] = useState<boolean>(false);
const [canvasTab, setCanvasTab] = useState<'courses' | 'groups' | 'todo' | 'notifications' | 'Progress'>('courses');
const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
const [selectedAssignment, setSelectedAssignment] = useState<any | null>(null);


type Discussion = {
  id: number;
  title: string;
  author: string;
  authorRole: 'Student' | 'Teaching Assistant' | 'Course Instructor';
  date: string; // ISO
  category: 'Question' | 'Technical Discussion' | 'Study Groups' | 'Career Advice' | 'Technical Help';
  isPinned: boolean;
  content: string;
  views: number;
  replies: number;
  likes: number;
  hasAnswer: boolean;
  tags: string[];
  courseCode?: string; // optional if you later scope per-course
};

const initialDiscussions: Discussion[] = [
  {
    id: 1,
    title: 'Best practices for documenting incident response procedures?',
    author: 'Emily Chen',
    authorRole: 'Student',
    date: '2025-10-17T14:23:00',
    category: 'Technical Discussion',
    isPinned: false,
    content: `Hi everyone! I'm working on Assignment 3 and struggling with documentation format. Any tips?`,
    views: 127,
    replies: 3,
    likes: 15,
    hasAnswer: true,
    tags: ['assignment-help', 'documentation'],
  },
  {
    id: 2,
    title: 'Confused about the difference between IDS and IPS',
    author: 'Jake Morrison',
    authorRole: 'Student',
    date: '2025-10-16T10:15:00',
    category: 'Question',
    isPinned: false,
    content: `Can someone explain the key differences between IDS and IPS? When would you use one vs the other?`,
    views: 89,
    replies: 2,
    likes: 11,
    hasAnswer: true,
    tags: ['module-3', 'security-tools'],
  },
  {
    id: 3,
    title: 'Study Group for Midterm - Anyone interested?',
    author: 'Sofia Martinez',
    authorRole: 'Student',
    date: '2025-10-18T09:00:00',
    category: 'Study Groups',
    isPinned: false,
    content: `Organizing a study group for the November 10th midterm. Virtual meetings twice a week. Reply if interested!`,
    views: 156,
    replies: 12,
    likes: 24,
    hasAnswer: false,
    tags: ['study-group', 'midterm'],
  },
  {
    id: 4,
    title: 'Real-world incident response war stories',
    author: 'Mike Chen',
    authorRole: 'Teaching Assistant',
    date: '2025-10-15T13:30:00',
    category: 'Technical Discussion',
    isPinned: true,
    content: `Share your real-world IR experiences here! What surprised you most? What would you do differently?`,
    views: 243,
    replies: 15,
    likes: 47,
    hasAnswer: false,
    tags: ['discussion', 'real-world'],
  },
  {
    id: 5,
    title: 'Recommended certifications for incident response career?',
    author: 'Alex Thompson',
    authorRole: 'Student',
    date: '2025-10-14T16:00:00',
    category: 'Career Advice',
    isPinned: false,
    content: `Looking to pursue IR career after graduation. Which certifications actually matter to employers?`,
    views: 198,
    replies: 11,
    likes: 19,
    hasAnswer: true,
    tags: ['career', 'certifications'],
  },
  {
    id: 6,
    title: 'Lab environment setup issues - need help!',
    author: 'Jordan Lee',
    authorRole: 'Student',
    date: '2025-10-13T19:45:00',
    category: 'Technical Help',
    isPinned: false,
    content: `VirtualBox crashing with VT-x error. Anyone know how to fix this?`,
    views: 76,
    replies: 5,
    likes: 8,
    hasAnswer: true,
    tags: ['technical-help', 'lab-setup'],
  },
];



// ---- DISCUSSION: UI State ----
const [selectedDiscussion, setSelectedDiscussion] = useState(null);
const [searchQuery, setSearchQuery] = useState('');
const [categoryFilter, setCategoryFilter] = useState<'All' | 'Question' | 'Technical Discussion' | 'Study Groups' | 'Career Advice' | 'Technical Help'>('All');
const [tagFilter, setTagFilter] = useState<string>('All');
const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'unanswered'>('recent');
const [discussions, setDiscussions] = useState<Discussion[]>(initialDiscussions);

const [showNewPost, setShowNewPost] = useState(false);
const [newPostTitle, setNewPostTitle] = useState('');
const [newPostCategory, setNewPostCategory] = useState<'Question' | 'Technical Discussion' | 'Study Groups' | 'Career Advice' | 'Technical Help'>('Question');
const [newPostTags, setNewPostTags] = useState<string>('');
const [newPostContent, setNewPostContent] = useState('');
const [newReplyText, setNewReplyText] = useState('');

// If you want to scope by course, set this dynamically when the user opens a course:
const currentCourseCode = 'CSIR-6261';

// ---- DISCUSSION: Helpers ----
const formatTimeAgo = (iso: string) => {
  const dt = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - dt.getTime();
  const diffH = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffH < 1) return 'Just now';
  const diffD = Math.floor(diffH / 24);
  if (diffH < 24) return `${diffH}h ago`;
  if (diffD < 7) return `${diffD}d ago`;
  return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// optimistic actions
const togglePin = (id: number) => {
  const idx = discussions.findIndex(d => d.id === id);
  if (idx === -1) return;
  const next = [...discussions];
  next[idx] = { ...next[idx], isPinned: !next[idx].isPinned };
  setSelectedDiscussion(s => (s?.id === id ? next[idx] : s));
  // If you persist discussions in state, lift discussions to useState; else keep as const and ignore
};

const toggleSolved = (id: number) => {
  const idx = discussions.findIndex(d => d.id === id);
  if (idx === -1) return;
  const next = [...discussions];
  next[idx] = { ...next[idx], hasAnswer: !next[idx].hasAnswer };
  setSelectedDiscussion(s => (s?.id === id ? next[idx] : s));
};

const addLike = (id: number) => {
  const idx = discussions.findIndex(d => d.id === id);
  if (idx === -1) return;
  const next = [...discussions];
  next[idx] = { ...next[idx], likes: (next[idx].likes ?? 0) + 1 };
  setSelectedDiscussion(s => (s?.id === id ? next[idx] : s));
};

const addReply = (id: number, text: string) => {
  if (!text.trim()) return;
  const idx = discussions.findIndex(d => d.id === id);
  if (idx === -1) return;
  const next = [...discussions];
  next[idx] = {
    ...next[idx],
    replies: (next[idx].replies ?? 0) + 1,
    // If you want to store actual replies, add a `replyList` array on each discussion object.
  };
  setSelectedDiscussion(next[idx]);
  setNewReplyText('');
};

const createPost = () => {
  if (!newPostTitle.trim() || !newPostContent.trim()) return;
  const tags = newPostTags
    .split(',')
    .map(t => t.trim())
    .filter(Boolean);

  const newId = Math.max(...discussions.map(d => d.id)) + 1;
  const newPost = {
    id: newId,
    title: newPostTitle.trim(),
    author: 'You',
    authorRole: 'Student',
    date: new Date().toISOString(),
    category: newPostCategory,
    isPinned: false,
    content: newPostContent.trim(),
    views: 0,
    replies: 0,
    likes: 0,
    hasAnswer: false,
    tags
  };

  // If you want to make discussions mutable, put discussions into useState first:
  // const [discussions, setDiscussions] = useState<YourType[]>(initialDiscussions);
  // setDiscussions(prev => [newPost, ...prev]);

  // Quick UX:
  setShowNewPost(false);
  setNewPostTitle('');
  setNewPostContent('');
  setNewPostTags('');
  setNewPostCategory('Question');
  setSelectedDiscussion(newPost); // open it
};

// ---- DISCUSSION: Derived list (search/filter/sort) ----
const allTags = Array.from(
  new Set(discussions.flatMap(d => d.tags || []))
);
const filteredDiscussions = discussions
  .filter(d => {
    const matchesSearch =
      !searchQuery ||
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || d.category === categoryFilter;
    const matchesTag = tagFilter === 'All' || (d.tags || []).includes(tagFilter);
    return matchesSearch && matchesCategory && matchesTag;
  })
  .sort((a, b) => {
    if (sortBy === 'recent') return +new Date(b.date) - +new Date(a.date);
    if (sortBy === 'popular') return (b.likes ?? 0) - (a.likes ?? 0);
    if (sortBy === 'unanswered') return (a.hasAnswer ? 1 : 0) - (b.hasAnswer ? 1 : 0);
    return 0;
  });



const [courseSection, setCourseSection] =
  useState<'lectures' | 'assignments' | 'announcements' | 'discussion' | 'grading' | 'attendance' | 'media'>('lectures');

  const modules = [
  'Introduction to Cybersecurity',
  'Threat Intelligence Fundamentals',
  'Incident Detection Methods',
  'Response Planning & Strategy',
  'Forensics Analysis Techniques',
  'Security Monitoring Tools',
  'Advanced Threat Hunting',
  'Recovery & Documentation',
] as const;

const [selectedModule, setSelectedModule] = useState<number>(0);
const [activeResource, setActiveResource] = useState<'video' | 'quiz' | 'notes' | 'poll' | null>(null);
const [modulesOpen, setModulesOpen] = useState(true);
const [expandedGroup, setExpandedGroup] = useState<number | null>(null);

// ---------- QUIZ ----------
type QuizQ = { id: string; question: string; options: string[]; correct: number };
const quizQuestions: QuizQ[] = [
  {
    id: 'q1',
    question: 'Which set correctly defines the CIA triad?',
    options: [
      'Confidentiality, Integrity, Availability',
      'Control, Identity, Access',
      'Confidentiality, Identity, Audit',
      'Cryptography, Integrity, Access',
    ],
    correct: 0,
  },
  {
    id: 'q2',
    question: 'Which is an example of Defense in Depth?',
    options: [
      'Single perimeter firewall',
      'Multiple layered controls across physical, network, application, and data',
      'Bi-weekly password changes only',
      'Relying only on endpoint antivirus',
    ],
    correct: 1,
  },
  {
    id: 'q3',
    question: 'Which is commonly a social-engineering attack?',
    options: ['SQL Injection', 'Phishing', 'Buffer Overflow', 'ARP Spoofing'],
    correct: 1,
  },
];

const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
const [quizSubmitted, setQuizSubmitted] = useState(false);

const getQuizScore = () => {
  let correct = 0;
  quizQuestions.forEach((q) => {
    if (quizAnswers[q.id] === q.correct) correct++;
  });
  return correct;
};

const handleQuizSubmit = () => {
  setQuizSubmitted(true);
};

// ---------- POLL ----------
const [pollAnswer, setPollAnswer] = useState<string | null>(null);

// ===== Resource views =====
const renderVideo = () => (
  <div className="space-y-6">
    <button
      onClick={() => setActiveResource(null)}
      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
    >
      <ChevronLeft size={16} />
      Back to Module
    </button>

    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Video Lecture: {modules[selectedModule]}
      </h2>
      <p className="text-gray-600 mb-6">Duration: 45 minutes</p>
    </div>

    <div className="bg-black rounded-xl overflow-hidden aspect-video flex items-center justify-center">
      <div className="text-center text-white">
        <Play size={64} className="mx-auto mb-4 opacity-70" />
        <p className="text-lg">Video Player</p>
        <p className="text-sm opacity-70 mt-2">Click to play lecture video</p>
      </div>
    </div>

    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="font-semibold text-gray-900 mb-3">Video Description</h3>
      <p className="text-gray-700 mb-4">
        This comprehensive lecture covers all key aspects of {modules[selectedModule].toLowerCase()}.
        You&apos;ll learn fundamental concepts, see practical demonstrations, and understand real-world applications.
      </p>
      <div className="flex gap-4 text-sm text-gray-600">
        <span>👁️ 234 views</span>
        <span>📅 Posted Oct 10, 2025</span>
        <span>👨‍🏫 Dr. Sarah Johnson</span>
      </div>
    </div>
  </div>
);

const renderQuiz = () => (
  <div className="space-y-6">
    <button
      onClick={() => {
        setActiveResource(null);
        setQuizSubmitted(false);
        setQuizAnswers({});
      }}
      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
    >
      <ChevronLeft size={16} />
      Back to Module
    </button>

    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Quiz: {modules[selectedModule]}
      </h2>
      <p className="text-gray-600 mb-6">Test your knowledge • {quizQuestions.length} questions</p>
    </div>

    {!quizSubmitted ? (
      <div className="space-y-6">
        {quizQuestions.map((q, idx) => (
          <div key={q.id} className="bg-white rounded-xl border border-gray-200 p-6">
            <p className="font-semibold text-gray-900 mb-4">
              {idx + 1}. {q.question}
            </p>
            <div className="space-y-2">
              {q.options.map((option, optIdx) => (
                <label
                  key={optIdx}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="radio"
                    name={`question-${q.id}`}
                    checked={quizAnswers[q.id] === optIdx}
                    onChange={() => setQuizAnswers({ ...quizAnswers, [q.id]: optIdx })}
                    className="w-4 h-4"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        <button
          onClick={handleQuizSubmit}
          disabled={Object.keys(quizAnswers).length !== quizQuestions.length}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Submit Quiz
        </button>
      </div>
    ) : (
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-8 text-white text-center">
          <div className="text-6xl font-bold mb-2">
            {getQuizScore()}/{quizQuestions.length}
          </div>
          <p className="text-xl mb-1">
            {getQuizScore() === quizQuestions.length
              ? '🎉 Perfect Score!'
              : getQuizScore() >= quizQuestions.length * 0.7
              ? '✅ Good Job!'
              : '📚 Keep Learning!'}
          </p>
          <p className="opacity-90">{Math.round((getQuizScore() / quizQuestions.length) * 100)}% correct</p>
        </div>

        {quizQuestions.map((q, idx) => (
          <div key={q.id} className="bg-white rounded-xl border border-gray-200 p-6">
            <p className="font-semibold text-gray-900 mb-4">
              {idx + 1}. {q.question}
            </p>
            <div className="space-y-2">
              {q.options.map((option, optIdx) => {
                const isCorrect = optIdx === q.correct;
                const isSelected = quizAnswers[q.id] === optIdx;
                const showCorrect = isCorrect;
                const showWrong = isSelected && !isCorrect;

                return (
                  <div
                    key={optIdx}
                    className={`flex items-center gap-3 p-3 rounded-lg border ${
                      showCorrect
                        ? 'border-emerald-500 bg-emerald-50'
                        : showWrong
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <span className="text-gray-700">{option}</span>
                    {showCorrect && <span className="ml-auto text-emerald-600 font-semibold">✓ Correct</span>}
                    {showWrong && <span className="ml-auto text-red-600 font-semibold">✗ Wrong</span>}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

const renderNotes = () => {
  const lessonContent =
    selectedModule === 0
      ? {
          title: 'Introduction to Cybersecurity',
          sections: [
            {
              title: 'Key Takeaways',
              content: [
                {
                  subtitle: 'CIA Triad - The Foundation',
                  points: [
                    'Confidentiality, Integrity, and Availability are the three pillars of information security',
                    'All security measures should support at least one of these principles',
                    'Understanding the CIA Triad helps in designing comprehensive security strategies',
                  ],
                },
                {
                  subtitle: 'Defense in Depth Strategy',
                  points: [
                    'Multiple layers of security controls provide better protection than single solutions',
                    'Physical, network, application, and data security must work together',
                    'User awareness is a critical component often overlooked',
                  ],
                },
                {
                  subtitle: 'Common Threats to Remember',
                  points: [
                    'Malware, phishing, and social engineering remain top attack vectors',
                    'Zero-day exploits are particularly dangerous as no patches exist',
                    'DDoS attacks can cripple even well-defended systems',
                    'SQL injection exploits continue to be prevalent in web applications',
                  ],
                },
                {
                  subtitle: 'Security Frameworks',
                  points: [
                    'NIST Cybersecurity Framework provides a comprehensive approach to risk management',
                    'ISO/IEC 27001 is the international standard for ISMS',
                    'CIS Controls offer prioritized, actionable security measures',
                    'Organizations should adopt frameworks that fit their specific needs',
                  ],
                },
                {
                  subtitle: 'Lessons from Target Breach',
                  points: [
                    'Third-party vendor access requires strict security controls and monitoring',
                    'Network segmentation limits the impact of successful breaches',
                    "Security alerts must be acted upon promptly - tools alone aren't enough",
                    'Incident response plans need regular testing and updates',
                    'The financial and reputational costs of breaches can be devastating',
                  ],
                },
              ],
            },
          ],
          references: [
            {
              title: 'NIST Cybersecurity Framework',
              author: 'National Institute of Standards and Technology',
              year: '2024',
              url: 'https://www.nist.gov/cyberframework',
              description: 'Comprehensive framework for improving critical infrastructure cybersecurity',
            },
            {
              title: 'The Target Breach, By the Numbers',
              author: 'Krebs, B.',
              year: '2014',
              publication: 'KrebsOnSecurity',
              url: 'https://krebsonsecurity.com/2014/05/the-target-breach-by-the-numbers/',
              description: 'Detailed analysis of the Target data breach',
            },
            {
              title: 'ISO/IEC 27001:2022 Information Security Management',
              author: 'International Organization for Standardization',
              year: '2022',
              description: 'International standard for information security management systems',
            },
            {
              title: 'Computer Security: Principles and Practice (4th Edition)',
              author: 'Stallings, W., & Brown, L.',
              year: '2018',
              publication: 'Pearson',
              description: 'Comprehensive textbook covering fundamental cybersecurity concepts',
            },
            {
              title: 'The Cybersecurity Body of Knowledge',
              author: 'CyBOK',
              year: '2024',
              url: 'https://www.cybok.org/',
              description: 'Comprehensive knowledge base for cybersecurity professionals',
            },
            {
              title: 'Anatomy of a Target Data Breach: Missed Opportunities and Lessons Learned',
              author: 'Chickowski, E.',
              year: '2014',
              publication: 'Dark Reading',
              description: 'Analysis of security failures in the Target breach',
            },
            {
              title: 'SANS Institute Security Resources',
              author: 'SANS Institute',
              year: '2024',
              url: 'https://www.sans.org/',
              description: 'Leading cybersecurity research and training organization',
            },
            {
              title: 'MITRE ATT&CK Framework',
              author: 'MITRE Corporation',
              year: '2024',
              url: 'https://attack.mitre.org/',
              description: 'Knowledge base of adversary tactics and techniques',
            },
          ],
        }
      : {
          title: modules[selectedModule],
          sections: [
            {
              title: 'Key Concepts Summary',
              content: [
                {
                  subtitle: 'Important Points',
                  points: ['Core principles and frameworks', 'Industry best practices', 'Real-world applications'],
                },
              ],
            },
          ],
          references: [
            {
              title: 'NIST Cybersecurity Framework',
              author: 'National Institute of Standards and Technology',
              year: '2024',
              url: 'https://www.nist.gov/cyberframework',
            },
          ],
        };

  return (
    <div className="space-y-6">
      <button
        onClick={() => setActiveResource(null)}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
      >
        <ChevronLeft size={16} />
        Back to Module
      </button>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Further Reading: {lessonContent.title}</h2>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-8 space-y-8">
        {lessonContent.sections.map((section, idx) => (
          <section key={idx}>
            <h3 className="text-xl font-bold text-blue-600 mb-4">{section.title}</h3>
            {section.content.map((sub, subIdx) => (
              <div key={subIdx} className="mb-6">
                {sub.subtitle && <h4 className="text-lg font-semibold text-gray-900 mb-3">{sub.subtitle}</h4>}
                {sub.points && sub.points.length > 0 && (
                  <ul className="space-y-3 ml-4">
                    {sub.points.map((p, pIdx) => (
                      <li key={pIdx} className="flex gap-3 text-gray-700">
                        <span className="text-blue-600 font-bold">•</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        ))}

        <section className="border-t border-gray-200 pt-6">
          <h3 className="text-xl font-bold text-blue-600 mb-4">References &amp; Additional Resources</h3>
          <div className="space-y-4">
            {lessonContent.references.map((ref, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="font-semibold text-gray-900 mb-1">
                  {idx + 1}. {ref.title}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  {ref.author} ({ref.year})
                  {ref.publication && `. ${ref.publication}`}
                </p>
                {ref.description && <p className="text-sm text-gray-600 mb-2">{ref.description}</p>}
                {ref.url && (
                  <a href={ref.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                    {ref.url}
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="flex gap-4">
        <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 flex items-center justify-center gap-2">
          <FileDown size={20} />
          Download Study Guide
        </button>
        <button className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 flex items-center justify-center gap-2">
          
          Print Summary
        </button>
      </div>
    </div>
  );
};

const renderPoll = () => {
  const pollOptions = [
    { value: 'expert', label: '⭐⭐⭐⭐⭐ Expert - I can teach this to others', votes: 23 },
    { value: 'good', label: '⭐⭐⭐⭐ Good - I understand most concepts', votes: 45 },
    { value: 'average', label: '⭐⭐⭐ Average - I understand the basics', votes: 67 },
    { value: 'beginner', label: '⭐⭐ Beginner - I need more practice', votes: 34 },
    { value: 'new', label: '⭐ New - This is all new to me', votes: 12 },
  ];
  const totalVotes = pollOptions.reduce((s, o) => s + o.votes, 0);

  return (
    <div className="space-y-6">
      <button
        onClick={() => {
          setActiveResource(null);
          setPollAnswer(null);
        }}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
      >
        <ChevronLeft size={16} />
        Back to Module
      </button>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Poll: {modules[selectedModule]}</h2>
        <p className="text-gray-600 mb-6">Share your opinion with the class</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          How would you rate your current understanding of {modules[selectedModule].toLowerCase()}?
        </h3>

        <div className="space-y-3 mb-6">
          {pollOptions.map((option) => {
            const percentage = Math.round((option.votes / totalVotes) * 100);
            const isSelected = pollAnswer === option.value;

            return (
              <button
                key={option.value}
                onClick={() => setPollAnswer(option.value)}
                className={`w-full text-left p-4 rounded-lg border transition-all ${
                  isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{option.label}</span>
                  {pollAnswer && (
                    <span className="text-sm font-semibold text-gray-600">
                      {percentage}% ({option.votes})
                    </span>
                  )}
                </div>
                {pollAnswer && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${isSelected ? 'bg-blue-600' : 'bg-gray-400'}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {!pollAnswer && <p className="text-sm text-gray-500 text-center">Select an option to see poll results</p>}

        {pollAnswer && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-center">
            <p className="text-emerald-800 font-semibold">✓ Thank you for participating! {totalVotes} students have voted.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Canvas course modules use state
const [modulesCollapsed, setModulesCollapsed] = useState(false);
const getTagStyle = (t: string) => {
  switch (t.toLowerCase()) {
    case 'exam':
      return 'bg-red-100 text-red-700 border-red-200';
    case 'assignment':
      return 'bg-indigo-100 text-indigo-700 border-indigo-200';
    case 'event':
      return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'discussion':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};
// --- Canvas function ---
const Canvas = ({
  canvasSidebarOpen,
  setCanvasSidebarOpen,
  canvasTab,
  setCanvasTab,
  selectedCourse,
  setSelectedCourse,
  courseSection,
  setCourseSection,
}: CanvasProps) => {
  // Typed nav + section tabs
  const navItems: ReadonlyArray<{
    key: CanvasProps['canvasTab'];
    label: string;
    icon: any;
  }> = [
    { key: 'courses', label: 'Courses', icon: BookOpen },
    { key: 'groups', label: 'Groups', icon: User },
    { key: 'todo', label: 'To-do', icon: CheckCircle },
    { key: 'notifications', label: 'Notifications', icon: Bell },
    { key: 'Progress', label: 'Progress', icon: BookOpen },
  ] as const;

  const sectionTabs: ReadonlyArray<{
    key: CanvasProps['courseSection'];
    label: string;
  }> = [
    { key: 'lectures', label: 'Lectures' },
    { key: 'assignments', label: 'Assignments' },
    { key: 'announcements', label: 'Announcements' },
    { key: 'discussion', label: 'Discussion' },
    { key: 'grading', label: 'Grading' },
    { key: 'attendance', label: 'Attendance' },
    { key: 'media', label: 'Media' },
  ] as const;
type AssignmentDetail = {
  description?: string;
  instructions?: string;
  requirements?: string[];
  links?: { label: string; href: string }[];
  resources?: { name: string; size?: string; href?: string }[];
  rubric?: { criteria: string; points: number }[];
};
  const canvasData = {
    courses: [
      {
        name: 'Cybersecurity Incident Response',
        code: 'CSIR-6261',
        semester: 'Fall 2025',
        status: 'Active',
        lectures: [
          { id: 1, title: 'Week 1: Introduction to IR', published: true, completed: true },
          { id: 2, title: 'Week 2: Detection & Analysis', published: true, completed: true },
          { id: 3, title: 'Week 3: Containment Strategies', published: true, completed: false },
          { id: 4, title: 'Week 4: Evidence Collection', published: true, completed: false },
          { id: 5, title: 'Week 5: Recovery Procedures', published: false, completed: false },
        ],
        
        assignments: [
          { id: 1, title: 'Assignment 1: IR Plan', dueDate: '2025-10-15', status: 'submitted', grade: 'A' },
          { id: 2, title: 'Assignment 2: Case Study Analysis', dueDate: '2025-10-20', status: 'pending', grade: null },
          { id: 3, title: 'Assignment 3: Lab Report', dueDate: '2025-10-30', status: 'not_started', grade: null },
        ],
        announcements: [
          { id: 1, title: 'Assignment 2 deadline extended', tag: 'Assignment', date: '2025-10-11', content: 'Assignment 2 has been moved to Oct 20, 23:59.' },
          { id: 2, title: 'Midterm exam schedule', tag: 'Exam',date: '2025-10-08', content: 'The midterm will be held on Oct 25, 9:00 AM in Hall A.' },
          { id: 3, title: 'Midterm exam schedule', tag: 'Exam',date: '2025-10-11', content: 'The midterm will be held on Oct 25, 9:00 AM in Hall A.' },
          { id: 4, title: 'Midterm exam schedule', tag: 'Exam',date: '2025-10-12', content: 'The midterm will be held on Oct 25, 9:00 AM in Hall A.' },
          { id: 5, title: 'Midterm exam schedule', tag: 'Exam',date: '2025-10-20', content: 'The midterm will be held on Oct 25, 9:00 AM in Hall A.' },
        ],
      },
      { name: 'Network Security', code: 'CS-6262', semester: 'Fall 2025', status: 'Active' },
      { name: 'Secure Computer Systems', code: 'CS-6238', semester: 'Summer 2025', status: 'Completed' },
      { name: 'AI Literacy & Risk Perception', code: 'MAS-501', semester: 'Spring 2025', status: 'Completed' },
      { name: 'Critical Infrastructure Security', code: 'CIS-701', semester: 'Spring 2026', status: 'Upcoming' },
      { name: 'Digital Transformation & ICT', code: 'DTI-401', semester: 'Fall 2026', status: 'Upcoming' },
    ],
    groups: [
      { name: 'CSIR Group 1', course: 'CSIR-6261', members: ['Alice Nguyen', 'Binh Tran', 'Charlie Le', 'Dung Pham', 'Elisa Vo', 'Huy Hoang', 'Khanh Do'] },
      { name: 'IIS Group 10', course: 'IIS-520', members: ['Minh Anh', 'Nhat Quang', 'Oanh Vu', 'Phuc Nguyen', 'Quyen Truong', 'Son Le'] },
      { name: 'CSIR Group 2', course: 'CSIR-6261', members: ['Tony Pham', 'Uyen Do', 'Vy Ha', 'Wen Li', 'Xuan Truong'] },
    ],
    todos: {
      'CSIR-6261': [
        { text: 'Finish incident response case study', done: false },
        { text: 'Submit assignment 2', done: false },
      ],
      'CS-6262': [{ text: 'Prepare slides for network attack demo', done: false }],
      'CS-6238': [{ text: 'Review secure coding notes', done: true }],
    },
    notifications: [
      { type: 'system', title: 'Planned maintenance', detail: 'The LMS will undergo maintenance on Oct 20, 02:00–03:00 UTC.', when: '2025-10-12 09:00' },
      { type: 'course', course: 'CSIR-6261', title: 'Assignment due date updated', detail: 'Assignment 2 moved to Oct 20, 23:59.', when: '2025-10-11 15:24' },
      { type: 'group', group: 'CSIR Group 1', title: 'Member added', detail: 'Khanh Do joined the group.', when: '2025-10-10 18:02' },
      { type: 'course', course: 'CS-6262', title: 'New module published', detail: 'Week 6: IDS/IPS notes & quiz available.', when: '2025-10-09 08:12' },
    ],
  };
const assignmentDetails: Record<number, AssignmentDetail> = {
  1: {
    description:
      'Create an Incident Response (IR) plan for a mid-size retailer. Focus on preparation, communication flows, and RACI.',
    instructions:
      'Deliver a 5–7 page IR plan (PDF) covering: Purpose & Scope, Roles & Responsibilities, Tooling, Alert Triage, Communication, and Post-Incident Review.',
    requirements: [
      'Follow NIST SP 800-61 structure where applicable',
      'Include a one-page escalation flow diagram',
      'Define external notification triggers (legal, PR, regulators)',
      'Submit as a single PDF (max 10MB)',
    ],
    resources: [
      { name: 'IR Plan Template.docx', size: '84 KB', href: '#' },
      { name: 'Example Escalation Flow.pdf', size: '312 KB', href: '#' },
    ],
    links: [
      { label: 'NIST SP 800-61r2 (Guide to IR)', href: 'https://csrc.nist.gov' },
      { label: 'SANS Incident Handler’s Handbook', href: 'https://www.sans.org' },
    ],
    rubric: [
      { criteria: 'Preparation & Scope', points: 20 },
      { criteria: 'Roles, RACI & Communication', points: 25 },
      { criteria: 'Detection & Triage Flow', points: 20 },
      { criteria: 'Containment/Eradication/Recovery', points: 25 },
      { criteria: 'Post-Incident Review & Metrics', points: 10 },
    ],
  },
  2: {
    description:
      'Analyze a real breach and write a 2–3 page case study focusing on root cause and lessons learned.',
    instructions:
      'Select any public incident. Summarize timeline, ATT&CK mapping, control gaps, and 5 actionable recommendations.',
    requirements: [
      'Map at least 6 ATT&CK techniques',
      'Include properly formatted references',
      'Highlight business impact and risk',
    ],
    resources: [{ name: 'Case Study Outline.pdf', size: '128 KB', href: '#' }],
    links: [{ label: 'MITRE ATT&CK', href: 'https://attack.mitre.org/' }],
    rubric: [
      { criteria: 'Timeline & Evidence', points: 25 },
      { criteria: 'ATT&CK Mapping', points: 25 },
      { criteria: 'Root Cause Analysis', points: 25 },
      { criteria: 'Recommendations', points: 25 },
    ],
  },
  3: {
    description:
      'Run the provided lab and submit a short report with screenshots on log collection and basic triage.',
    instructions:
      'Use the lab VM, trigger the sample malware, collect logs, and document containment steps.',
    requirements: ['3–5 screenshots', 'Commands or tooling used', 'Short reflection (≤300 words)'],
    resources: [
      { name: 'Lab Guide.pdf', size: '980 KB', href: '#' },
      { name: 'Sample Logs.zip', size: '2.3 MB', href: '#' },
    ],
    links: [{ label: 'Elastic Detection Rules', href: 'https://www.elastic.co/guide' }],
    rubric: [
      { criteria: 'Repro & Evidence', points: 30 },
      { criteria: 'Analysis & Triage Notes', points: 40 },
      { criteria: 'Containment Steps', points: 20 },
      { criteria: 'Clarity & Organization', points: 10 },
    ],
  },
};
  const getStatusColor = (status: string) => {
    if (status === 'Active') return 'bg-green-50 text-green-700 border-green-200';
    if (status === 'Upcoming') return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  const getNotificationColor = (type: string) => {
    if (type === 'system') return 'bg-slate-100 text-slate-700 border-slate-200';
    if (type === 'course') return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  };

  return (
    <div className="flex h-full">
      {/* Canvas Sidebar Navigation */}
      <aside className={`${canvasSidebarOpen ? 'w-56' : 'w-16'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300`}>
        <div className={`px-3 pt-4 pb-2 flex items-center justify-between ${!canvasSidebarOpen && 'justify-center'}`}>
          {canvasSidebarOpen && <span className="text-xs font-semibold tracking-wider text-gray-500">NAVIGATION</span>}
          <button
            onClick={() => setCanvasSidebarOpen(!canvasSidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            title={canvasSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {canvasSidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>

        <nav className="flex-1 px-2 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setCanvasTab(item.key)}
              className={`w-full flex items-center ${canvasSidebarOpen ? 'gap-3' : 'justify-center'} rounded-2xl px-3 py-3 transition-all border ${
                canvasTab === item.key
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-[inset_0_0_0_1px_rgba(99,102,241,0.3)]'
                  : 'hover:bg-gray-50 border-transparent'
              }`}
              title={!canvasSidebarOpen ? item.label : ''}
            >
              <item.icon size={20} className="shrink-0" />
              {canvasSidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        {canvasSidebarOpen && <div className="px-3 pb-4 text-[10px] text-gray-400">© LMS Prototype</div>}
      </aside>

      {/* Main Canvas Content */}
<main className="flex-1 pb-24 sm:pb-28 w-full space-y-6 overflow-visible min-h-screen">
        {/* Courses Tab */}
        {canvasTab === 'courses' && !selectedCourse && (
          <div className="space-y-4 p-2">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold tracking-tight p-2">Courses</h1>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200">
              <div className="p-5">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      className="w-full rounded-xl border border-gray-200 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Search by name, code, semester, status…"
                    />
                  </div>
                  <select className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="all">All statuses</option>
                    <option value="Active">Active</option>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="px-5 pb-5">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500 border-b">
                        <th className="py-3 pr-4">Course Name</th>
                        <th className="py-3 pr-4">Course Code</th>
                        <th className="py-3 pr-4">Semester</th>
                        <th className="py-3 pr-4">Status</th>
                        <th className="py-3 pr-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {canvasData.courses.map((course, idx) => (
                        <tr key={idx} className="border-b last:border-b-0 hover:bg-gray-50">
                          
                                <button
                                  onClick={() => setSelectedCourse(course)}
                                  className="py-3 pr-4 font-bold text-blue-600 hover:underline cursor-pointer align-middle pl-4"
                                >
                                  {course.name}
                                </button>
                      

                          <td className="py-3 pr-4">{course.code}</td>
                          <td className="py-3 pr-4">{course.semester}</td>
                          <td className="py-3 pr-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(course.status)}`}>
                              {course.status}
                            </span>
                          </td>
                          <td className="py-3 pr-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => setSelectedCourse(course)}
                                className="px-3 py-1 rounded-xl border border-gray-200 hover:bg-gray-100 text-sm"
                              >
                                Open
                              </button>
                              <button className="px-3 py-1 rounded-xl border border-gray-200 hover:bg-gray-100 text-sm">Curriculum</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Individual Course View */}
        {canvasTab === 'courses' && selectedCourse && (
          <div className="">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-600 p-3">
              <button onClick={() => setSelectedCourse(null)} className="hover:text-gray-900">
                Courses
              </button>
              <ChevronRight size={16} />
              <span className="text-gray-900">{selectedCourse.code}</span>
            </div>

            

            {/* Course Navigation Tabs */}
            <div className="bg-white rounded-2xl border border-gray-200">
              <div className="flex gap-1 px-5 py-3 border-b border-gray-200 overflow-x-auto">
                {sectionTabs.map((section) => (
                  <button
                    key={section.key}
                    onClick={() => setCourseSection(section.key)}
                    className={`px-4 py-2 text-sm font-medium whitespace-nowrap rounded-lg transition-colors ${
                      courseSection === section.key ? 'bg-amber-100 text-amber-700' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
              </div>

              {/* Lectures Section with new Layout */} 
              {courseSection === 'lectures' && (
                <div className="flex min-h-0">
                  {/* Left Sidebar - Modules List */}
                   {modulesOpen && (
      <aside className="w-56 border-r border-gray-200 overflow-y-auto transition-all duration-300">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">MODULES</h3>
            <button
              onClick={() => setModulesOpen(false)}
              className="flex items-center gap-1 text-blue-600 font-semibold hover:text-blue-800"
            >
              <ChevronLeft size={20} strokeWidth={3} />
              <span>Hide</span>
            </button>
          </div>
          <div className="space-y-1">
            {modules.map((module, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSelectedModule(idx);
                  setActiveResource(null);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  selectedModule === idx
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {module}
              </button>             

          ))}
          </div>
        </div>
      </aside>
    )}
     
    

                  {/* Right Content - Module Details */}
                  <div className="flex-1 min-h-0 overflow-y-auto p-6">
                    <div className="mx-auto w-full max-w-none 2xl:max-w">
                      <div className="mb-4 flex items-center gap-3">
                    {!modulesOpen && (
                      <button
                        onClick={() => setModulesOpen(true)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-md bg-blue-600 text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        ☰ Show all Modules
                      </button>
                    )}
                  
                  </div>



                      {/* Show module content */}
                      {!activeResource && (
                        <>
                          <h2 className="text-3xl font-bold text-blue-600 mb-4">{modules[selectedModule]}</h2>

                          <div className="mb-6">
                            <h3 className="font-semibold text-gray-900 mb-2">Learning Objectives:</h3>
                            <p className="text-gray-700 leading-relaxed">
                              In this module, you will learn about {modules[selectedModule].toLowerCase()} and its practical applications in
                              cybersecurity incident response.
                            </p>
                          </div>

                          <div className="mb-6">
                            <h3 className="font-semibold text-gray-900 mb-3">Key Topics:</h3>
                            <ul className="space-y-2 text-gray-700">
                              <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-1">•</span>
                                <span>Understanding core principles and frameworks</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-1">•</span>
                                <span>Implementing best practices and techniques</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-1">•</span>
                                <span>Analyzing case studies and examples</span>
                              </li>
                            </ul>
                          </div>

                          <div className="mb-8">
                            <h3 className="font-semibold text-gray-900 mb-3">Resources:</h3>
                            <p className="text-gray-700 leading-relaxed">
                              Check the video lecture, complete the quiz, review the lecture notes, and participate in the poll below.
                            </p>
                          </div>
                          <div className="border-t border-gray-200 pt-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Overview</h3>
                            <p className="leading-relaxed mb-6">
                              Cybersecurity is the practice of protecting systems, networks, and programs from digital attacks. These
                              cyberattacks are usually aimed at accessing, changing, or destroying sensitive information, extorting money
                              from users, or interrupting normal business processes. In today's interconnected world, cybersecurity has
                              become a critical concern for individuals, organizations, and nations alike.
                            </p>

                            <h3 className="text-xl font-bold text-gray-900 mb-4">1. Fundamental Concepts</h3>
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">The CIA Triad</h4>
                            <p className="leading-relaxed mb-3">
                              The foundation of information security rests on three core principles known as the CIA Triad:
                            </p>
                            <ul className="space-y-2 ml-6 mb-6">
                              <li className="flex gap-2"><span className="text-blue-600">•</span><span><strong>Confidentiality:</strong> Ensuring that information is accessible only to those authorized to access it. This involves encryption, access controls, and authentication mechanisms.</span></li>
                              <li className="flex gap-2"><span className="text-blue-600">•</span><span><strong>Integrity:</strong> Maintaining the accuracy and completeness of data. This includes protecting against unauthorized modification and ensuring data remains trustworthy.</span></li>
                              <li className="flex gap-2"><span className="text-blue-600">•</span><span><strong>Availability:</strong> Ensuring that authorized users have reliable and timely access to information and resources when needed.</span></li>
                            </ul>

                            <h4 className="text-lg font-semibold text-gray-900 mb-2">Defense in Depth</h4>
                            <p className="leading-relaxed mb-3">
                              A cybersecurity strategy that employs multiple layers of security controls throughout an IT system. If one
                              defense mechanism fails, others are in place to thwart an attack. This includes:
                            </p>
                            <ul className="space-y-2 ml-6 mb-6">
                              <li className="flex gap-2"><span className="text-blue-600">•</span><span>Physical security measures (locks, badges, surveillance)</span></li>
                              <li className="flex gap-2"><span className="text-blue-600">•</span><span>Network security (firewalls, intrusion detection systems)</span></li>
                              <li className="flex gap-2"><span className="text-blue-600">•</span><span>Application security (secure coding practices, input validation)</span></li>
                              <li className="flex gap-2"><span className="text-blue-600">•</span><span>Data security (encryption, backup systems)</span></li>
                              <li className="flex gap-2"><span className="text-blue-600">•</span><span>User education and awareness training</span></li>
                            </ul>

                            <h3 className="text-xl font-bold text-gray-900 mb-4">2. Common Threat Landscape</h3>
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">Types of Cyber Threats</h4>
                            <p className="leading-relaxed mb-3">Understanding the various forms of cyber threats is essential for effective defense:</p>
                            <ul className="space-y-2 ml-6 mb-6">
                              <li className="flex gap-2"><span className="text-blue-600">•</span><span><strong>Malware:</strong> Malicious software including viruses, worms, trojans, ransomware, and spyware designed to damage or gain unauthorized access to systems.</span></li>
                              <li className="flex gap-2"><span className="text-blue-600">•</span><span><strong>Phishing:</strong> Social engineering attacks that trick users into revealing sensitive information through deceptive emails or websites.</span></li>
                              <li className="flex gap-2"><span className="text-blue-600">•</span><span><strong>Man-in-the-Middle (MitM) Attacks:</strong> Intercepting communications between two parties to eavesdrop or impersonate one of them.</span></li>
                              <li className="flex gap-2"><span className="text-blue-600">•</span><span><strong>Denial of Service (DoS/DDoS):</strong> Overwhelming systems with traffic to make them unavailable to legitimate users.</span></li>
                              <li className="flex gap-2"><span className="text-blue-600">•</span><span><strong>SQL Injection:</strong> Exploiting vulnerabilities in database-driven applications to execute malicious SQL statements.</span></li>
                              <li className="flex gap-2"><span className="text-blue-600">•</span><span><strong>Zero-Day Exploits:</strong> Attacks that target previously unknown vulnerabilities before developers can create patches.</span></li>
                            </ul>

                            <h4 className="text-lg font-semibold text-gray-900 mb-2">Threat Actors</h4>
                            <p className="leading-relaxed mb-3">Different categories of attackers with varying motivations:</p>
                            <ul className="space-y-2 ml-6 mb-6">
                              <li className="flex gap-2"><span className="text-blue-600">•</span><span><strong>Nation-State Actors:</strong> Government-sponsored groups conducting cyber espionage or sabotage</span></li>
                              <li className="flex gap-2"><span className="text-blue-600">•</span><span><strong>Cybercriminals:</strong> Financially motivated individuals or groups seeking monetary gain</span></li>
                              <li className="flex gap-2"><span className="text-blue-600">•</span><span><strong>Hacktivists:</strong> Activists using hacking to promote political or social causes</span></li>
                              <li className="flex gap-2"><span className="text-blue-600">•</span><span><strong>Insider Threats:</strong> Current or former employees with authorized access who misuse it</span></li>
                              <li className="flex gap-2"><span className="text-blue-600">•</span><span><strong>Script Kiddies:</strong> Inexperienced attackers using pre-made tools without deep technical knowledge</span></li>
                            </ul>

                            <h3 className="text-xl font-bold text-gray-900 mb-4">3. Security Frameworks and Standards</h3>
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">Industry Frameworks</h4>
                            <p className="leading-relaxed mb-3">Organizations rely on established frameworks to structure their security programs:</p>
                            <ul className="space-y-2 ml-6 mb-6">
                              <li className="flex gap-2"><span className="text-blue-600">•</span><span><strong>NIST Cybersecurity Framework:</strong> A voluntary framework consisting of standards, guidelines, and best practices to manage cybersecurity risks.</span></li>
                              <li className="flex gap-2"><span className="text-blue-600">•</span><span><strong>ISO/IEC 27001:</strong> International standard for information security management systems (ISMS).</span></li>
                              <li className="flex gap-2"><span className="text-blue-600">•</span><span><strong>CIS Controls:</strong> A prioritized set of 18 actions to defend against common cyber attacks.</span></li>
                              <li className="flex gap-2"><span className="text-blue-600">•</span><span><strong>COBIT:</strong> Framework for developing, implementing, monitoring and improving IT governance and management practices.</span></li>
                            </ul>

                            <h3 className="text-xl font-bold text-gray-900 mb-4">4. Case Study: Target Data Breach (2013)</h3>
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">Background</h4>
                            <p className="leading-relaxed mb-6">
                              In December 2013, retail giant Target experienced one of the largest data breaches in history, affecting
                              approximately 40 million credit and debit card accounts and 70 million customer records.
                            </p>

                            <h4 className="text-lg font-semibold text-gray-900 mb-2">Attack Vector</h4>
                            <p className="leading-relaxed mb-3">The breach occurred through a sophisticated multi-stage attack:</p>
                            <ul className="space-y-2 ml-6 mb-6">
                              <li className="flex gap-2"><span className="text-blue-600">•</span><span><strong>Initial Access:</strong> Attackers compromised a third-party HVAC vendor's credentials through a phishing email containing the Citadel malware.</span></li>
                              <li className="flex gap-2"><span className="text-blue-600">•</span><span><strong>Lateral Movement:</strong> Using the vendor's network access, attackers moved laterally within Target's network to access sensitive systems.</span></li>
                              <li className="flex gap-2"><span className="text-blue-600">•</span><span><strong>Point-of-Sale Compromise:</strong> Malware was installed on POS systems to capture card data as customers made purchases.</span></li>
                              <li className="flex gap-2"><span className="text-blue-600">•</span><span><strong>Data Exfiltration:</strong> Stolen data was sent to staging servers within Target's network, then transferred to external servers controlled by the attackers.</span></li>
                            </ul>

                            <h4 className="text-lg font-semibold text-gray-900 mb-2">Security Failures</h4>
                            <p className="leading-relaxed mb-3">Several security lapses contributed to the breach's severity:</p>
                            <ul className="space-y-2 ml-6 mb-6">
                              <li className="flex gap-2"><span className="text-blue-600">•</span><span>Inadequate network segmentation between vendor access and critical systems</span></li>
                              <li className="flex gap-2"><span className="text-blue-600">•</span><span>Failure to act on security alerts from the FireEye intrusion detection system</span></li>
                              <li className="flex gap-2"><span className="text-blue-600">•</span><span>Weak security controls for third-party vendors</span></li>
                              <li className="flex gap-2"><span className="text-blue-600">•</span><span>Insufficient monitoring of privileged access and lateral movement</span></li>
                              <li className="flex gap-2"><span className="text-blue-600">•</span><span>Delayed incident response despite early warning signs</span></li>
                            </ul>

                            <h4 className="text-lg font-semibold text-gray-900 mb-2">Impact and Consequences</h4>
                            <p className="leading-relaxed mb-3">The breach had far-reaching effects:</p>
                            <ul className="space-y-2 ml-6 mb-6">
                              <li className="flex gap-2"><span className="text-blue-600">•</span><span><strong>Financial:</strong> Over $200 million in costs including settlements, legal fees, and security improvements</span></li>
                              <li className="flex gap-2"><span className="text-blue-600">•</span><span><strong>Reputational:</strong> Significant damage to brand trust and customer confidence</span></li>
                              <li className="flex gap-2"><span className="text-blue-600">•</span><span><strong>Executive:</strong> CEO and CIO resigned following the incident</span></li>
                              <li className="flex gap-2"><span className="text-blue-600">•</span><span><strong>Regulatory:</strong> Led to increased scrutiny and stricter compliance requirements for retailers</span></li>
                              <li className="flex gap-2"><span className="text-blue-600">•</span><span><strong>Industry-wide:</strong> Prompted organizations across sectors to reassess third-party risk management</span></li>
                            </ul>

                            <h4 className="text-lg font-semibold text-gray-900 mb-2">Lessons Learned</h4>
                            <p className="leading-relaxed mb-3">Key takeaways from the Target breach:</p>
                            <ul className="space-y-2 ml-6 mb-6">
                              <li className="flex gap-2"><span className="text-blue-600">•</span><span>Third-party vendors represent a significant attack vector and require rigorous security vetting</span></li>
                              <li className="flex gap-2"><span className="text-blue-600">•</span><span>Network segmentation is critical to limit the blast radius of a breach</span></li>
                              <li className="flex gap-2"><span className="text-blue-600">•</span><span>Security tools are only effective if alerts are monitored and acted upon promptly</span></li>
                              <li className="flex gap-2"><span className="text-blue-600">•</span><span>Incident response plans must be tested and ready for immediate activation</span></li>
                              <li className="flex gap-2"><span className="text-blue-600">•</span><span>Security is an ongoing process requiring continuous monitoring and improvement</span></li>
                            </ul>

                            <h3 className="text-xl font-bold text-gray-900 mb-4">5. Best Practices for Organizations</h3>
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">Essential Security Measures</h4>
                            <p className="leading-relaxed mb-3">Organizations should implement these fundamental security practices:</p>
                            <ul className="space-y-2 ml-6 mb-6">
                              <li className="flex gap-2"><span className="text-blue-600">•</span><span><strong>Regular Security Assessments:</strong> Conduct vulnerability scans, penetration tests, and security audits</span></li>
                              <li className="flex gap-2"><span className="text-blue-600">•</span><span><strong>Patch Management:</strong> Implement a systematic approach to applying security updates promptly</span></li>
                              <li className="flex gap-2"><span className="text-blue-600">•</span><span><strong>Access Control:</strong> Enforce principle of least privilege and implement multi-factor authentication</span></li>
                              <li className="flex gap-2"><span className="text-blue-600">•</span><span><strong>Employee Training:</strong> Provide regular security awareness training to all staff</span></li>
                              <li className="flex gap-2"><span className="text-blue-600">•</span><span><strong>Incident Response Planning:</strong> Develop, document, and test incident response procedures</span></li>
                              <li className="flex gap-2"><span className="text-blue-600">•</span><span><strong>Data Backup:</strong> Maintain regular, tested backups with off-site storage</span></li>
                              <li className="flex gap-2"><span className="text-blue-600">•</span><span><strong>Encryption:</strong> Protect sensitive data both in transit and at rest</span></li>
                            </ul>
                </div>
                          

                          {/* Resource Cards – Video / Quiz / Notes / Poll */}
                          <div className="grid grid-cols-2 gap-4 mb-6">
                            {/* Video */}
                            <button
                              onClick={() => setActiveResource('video')}
                              className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white cursor-pointer hover:shadow-lg transition-shadow focus:outline-none focus:ring-2 focus:ring-white/60"
                            >
                              <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 mb-4 flex items-center justify-center">
                                  <svg className="w-12 h-12" fill="white" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                  </svg>
                                </div>
                                <h4 className="font-bold text-lg mb-2">Video Lecture</h4>
                                <p className="text-purple-100 text-sm">Click to watch</p>
                              </div>
                            </button>

                            {/* Quiz */}
                            <button
                              onClick={() => setActiveResource('quiz')}
                              className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl p-6 text-white cursor-pointer hover:shadow-lg transition-shadow focus:outline-none focus:ring-2 focus:ring-white/60"
                            >
                              <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 mb-4 flex items-center justify-center">
                                  <svg className="w-12 h-12" fill="white" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                                  </svg>
                                </div>
                                <h4 className="font-bold text-lg mb-2">Take Quiz</h4>
                                <p className="text-pink-100 text-sm">Test your knowledge</p>
                              </div>
                            </button>

                            {/* Notes */}
                            <button
                              onClick={() => setActiveResource('notes')}
                              className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl p-6 text-white cursor-pointer hover:shadow-lg transition-shadow focus:outline-none focus:ring-2 focus:ring-white/60"
                            >
                              <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 mb-4 flex items-center justify-center">
                                  <svg className="w-12 h-12" fill="white" viewBox="0 0 24 24">
                                    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                                  </svg>
                                </div>
                                <h4 className="font-bold text-lg mb-2">Further Reading</h4>
                                <p className="text-cyan-100 text-sm">Study materials & references</p>
                              </div>
                            </button>

                            {/* Poll */}
                            <button
                              onClick={() => setActiveResource('poll')}
                              className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white cursor-pointer hover:shadow-lg transition-shadow focus:outline-none focus:ring-2 focus:ring-white/60"
                            >
                              <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 mb-4 flex items-center justify-center">
                                  <svg className="w-12 h-12" fill="white" viewBox="0 0 24 24">
                                    <path d="M11 2v20c-5.07-.5-9-4.79-9-10s3.93-9.5 9-10zm2.03 0v8.99H22c-.47-4.74-4.24-8.52-8.97-8.99zm0 11.01V22c4.74-.47 8.5-4.25 8.97-8.99h-8.97z" />
                                  </svg>
                                </div>
                                <h4 className="font-bold text-lg mb-2">Class Poll</h4>
                                <p className="text-emerald-100 text-sm">Share your opinion</p>
                              </div>
                            </button>
                          </div>
                        </>
                      )
                      
                      
                      
                      
                      }

                      {activeResource === 'video' && renderVideo()}
{activeResource === 'quiz' && renderQuiz()}
{activeResource === 'notes' && renderNotes()}
{activeResource === 'poll' && renderPoll()}

                    </div>
                  </div>
                </div>
              )}

              {/* Other Sections */}
              {courseSection === 'assignments' && (
  <div className="p-6">
    {!selectedAssignment ? (
      // ===== List view =====
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="py-3 pr-4">Assignment</th>
              <th className="py-3 pr-4">Due Date</th>
              <th className="py-3 pr-4">Status</th>
              <th className="py-3 pr-4">Grade</th>
              <th className="py-3 pr-4"></th>
            </tr>
          </thead>
          <tbody>
            {selectedCourse.assignments?.map((a: any) => (
              <tr key={a.id} className="border-b last:border-b-0 hover:bg-gray-50">
                <td className="py-3 pr-4 font-medium">{a.title}</td>
                <td className="py-3 pr-4">{a.dueDate}</td>
                <td className="py-3 pr-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold border ${
                      a.status === 'submitted'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : a.status === 'pending'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-gray-100 text-gray-700 border-gray-200'
                    }`}
                  >
                    {String(a.status).replace('_', ' ')}
                  </span>
                </td>
                <td className="py-3 pr-4">
                  {a.grade ? (
                    <span className="font-semibold text-green-600">{a.grade}</span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="py-3 pr-4">
                 <button
  onClick={() => setSelectedAssignment({ ...a, ...assignmentDetails[a.id] })}
  className="px-3 py-1 rounded-xl border border-gray-200 hover:bg-gray-100 text-sm"
>
  Open
</button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      // ===== Detail view =====
     <div className="space-y-6">
  <button
    onClick={() => setSelectedAssignment(null)}
    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
  >
    <ChevronLeft size={16} />
    Back to Assignments
  </button>

  <div className="bg-white rounded-2xl border border-gray-200 p-8">
    {/* Header */}
    <div className="flex items-start justify-between gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{selectedAssignment.title}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-600">
          <span><span className="font-medium">Due:</span> {selectedAssignment.dueDate}</span>
          <span className="text-gray-300">•</span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${
              selectedAssignment.status === 'submitted'
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : selectedAssignment.status === 'pending'
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-gray-100 text-gray-700 border-gray-200'
            }`}
          >
            {String(selectedAssignment.status).replace('_', ' ')}
          </span>
          {selectedAssignment.grade && (
            <>
              <span className="text-gray-300">•</span>
              <span className="font-semibold text-green-600">Grade: {selectedAssignment.grade}</span>
            </>
          )}
        </div>
      </div>
      <div className="shrink-0 flex gap-2">
        <button className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-50 text-sm font-medium">
          Download Prompt
        </button>
        <button className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-50 text-sm font-medium">
          View Rubric
        </button>
      </div>
    </div>

    {/* Meta cards */}
    <div className="mt-6 grid gap-4 sm:grid-cols-3">
      <div className="rounded-xl border border-gray-200 p-4 bg-gray-50">
        <p className="text-sm text-gray-600 mb-1">Total Points</p>
        <p className="font-semibold text-gray-900">{selectedAssignment.totalPoints ?? '—'}</p>
      </div>
      <div className="rounded-xl border border-gray-200 p-4 bg-gray-50">
        <p className="text-sm text-gray-600 mb-1">Status</p>
        <p className="font-semibold text-gray-900 capitalize">
          {String(selectedAssignment.status).replace('_', ' ')}
        </p>
      </div>
      <div className="rounded-xl border border-gray-200 p-4 bg-gray-50">
        <p className="text-sm text-gray-600 mb-1">Grade</p>
        <p className="font-semibold text-gray-900">{selectedAssignment.grade ?? '—'}</p>
      </div>
    </div>

    {/* Description */}
    {selectedAssignment.description && (
      <section className="mt-8">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Overview</h3>
        <p className="text-gray-700 leading-relaxed">{selectedAssignment.description}</p>
      </section>
    )}

    {/* Instructions */}
    {selectedAssignment.instructions && (
      <section className="mt-8">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Instructions</h3>
        <p className="text-gray-700 leading-relaxed">{selectedAssignment.instructions}</p>
      </section>
    )}

    {/* Requirements */}
    {selectedAssignment.requirements?.length > 0 && (
      <section className="mt-8">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Requirements</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          {selectedAssignment.requirements.map((r: string, i: number) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      </section>
    )}

    {/* Resources (downloadables) */}
    {selectedAssignment.resources?.length > 0 && (
      <section className="mt-8">
        <h3 className="text-lg font-bold text-gray-900 mb-3">Resources</h3>
        <div className="space-y-2">
          {selectedAssignment.resources.map((res: any, i: number) => (
            <a
              key={i}
              href={res.href || '#'}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 border border-gray-200"
            >
              <div className="flex items-center gap-3">
                <FileText size={20} className="text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">{res.name}</p>
                  {res.size && <p className="text-sm text-gray-600">{res.size}</p>}
                </div>
              </div>
              <FileDown size={18} className="text-gray-400" />
            </a>
          ))}
        </div>
      </section>
    )}

    {/* Helpful links */}
    {selectedAssignment.links?.length > 0 && (
      <section className="mt-8">
        <h3 className="text-lg font-bold text-gray-900 mb-3">Helpful Links</h3>
        <ul className="space-y-2">
          {selectedAssignment.links.map((l: any, i: number) => (
            <li key={i}>
              <a href={l.href} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </section>
    )}

    {/* Rubric */}
    {selectedAssignment.rubric?.length > 0 && (
      <section className="mt-8">
        <h3 className="text-lg font-bold text-gray-900 mb-3">Grading Rubric</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr className="text-left text-gray-600">
                <th className="py-2 px-3">Criteria</th>
                <th className="py-2 px-3 w-32">Points</th>
              </tr>
            </thead>
            <tbody>
              {selectedAssignment.rubric.map((row: any, i: number) => (
                <tr key={i} className="border-t">
                  <td className="py-2 px-3">{row.criteria}</td>
                  <td className="py-2 px-3 font-semibold">{row.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    )}

    {/* Submission box (kept simple) */}
    <section className="mt-10 bg-blue-50 border border-blue-200 rounded-lg p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Submit / Resubmit</h3>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <label className="flex-1 cursor-pointer">
          <input type="file" className="hidden" />
          <div className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
            <p className="text-gray-700 font-medium">Click to upload or drag and drop</p>
            <p className="text-sm text-gray-500">PDF, DOC, DOCX (max 10MB)</p>
          </div>
        </label>
        <button className="px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700">
          Submit
        </button>
      </div>
    </section>
  </div>
</div>



    )}
  </div>
)}

     {courseSection === 'announcements' && (
  <div className="p-6 space-y-4">
    {selectedCourse.announcements?.map((a: any) => {
      // normalize
      const tagList: string[] = Array.isArray(a.tags)
        ? a.tags
        : a.tag
        ? [a.tag]
        : [];

      return (
        <div
          key={a.id}
          className="p-5 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-600/90" />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {/* tag pills */}
                  {tagList.map((t, i) => (
                    <span
                      key={i}
                      className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border ${getTagStyle(
                        t
                      )}`}
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <h3 className="font-semibold text-gray-900">{a.title}</h3>
                <p className="text-sm text-gray-700 mt-2">{a.content}</p>
              </div>
            </div>

            <span className="text-xs text-gray-500">{a.date}</span>
          </div>
        </div>
      );
    })}
  </div>
)}



              

{courseSection === 'discussion' ? (
  <>
    {!selectedDiscussion ? (
      <><div className="mt-6 mb-6 px-5">
  <div className="flex items-center justify-between">
    <h2 className="text-xl font-bold text-gray-900 tracking-tight">
      {currentCourseCode} • Discussion Forum
    </h2>
  </div>
</div>

        {/* Controls */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
          <div className="grid md:grid-cols-5 gap-3">
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search posts…"
              className="md:col-span-2 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>All</option>
              <option>Question</option>
              <option>Technical Discussion</option>
              <option>Study Groups</option>
              <option>Career Advice</option>
              <option>Technical Help</option>
            </select>

            <select
              value={tagFilter}
              onChange={e => setTagFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All tags</option>
              {allTags.map(t => (
                <option key={t} value={t}>#{t}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="recent">Sort: Recent</option>
              <option value="popular">Sort: Popular</option>
              <option value="unanswered">Sort: Unanswered</option>
            </select>
          </div>

          <div className="mt-3 flex items-center gap-3">
            <button
              onClick={() => setShowNewPost(true)}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700"
            >
              + New Post
            </button>
            <span className="text-sm text-gray-500">{filteredDiscussions.length} results</span>
          </div>
        </div>

        {/* List */}
        <div className="space-y-4">
          {filteredDiscussions.map((discussion) => (
            <div
              key={discussion.id}
              onClick={() => setSelectedDiscussion(discussion)}
              className={`bg-white rounded-xl border p-6 hover:shadow-lg transition-all cursor-pointer ${
                discussion.isPinned ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
              }`}
            >
              <div className="flex gap-4">
                <div className="flex flex-col items-center gap-2 flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-lg">
                    {discussion.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  {discussion.hasAnswer && (
                    <div className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-bold">
                      ✓ Solved
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {discussion.isPinned && (
                          <span className="px-2 py-0.5 bg-blue-200 text-blue-800 text-xs font-bold rounded">
                            📌 PINNED
                          </span>
                        )}
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded ${
                          discussion.category === 'Question' ? 'bg-amber-100 text-amber-700' :
                          discussion.category === 'Technical Discussion' ? 'bg-purple-100 text-purple-700' :
                          discussion.category === 'Study Groups' ? 'bg-blue-100 text-blue-700' :
                          discussion.category === 'Career Advice' ? 'bg-green-100 text-green-700' :
                          discussion.category === 'Technical Help' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {discussion.category}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {discussion.title}
                      </h3>

                      <p className="text-sm text-gray-600 mb-3">
                        <span className="font-medium">{discussion.author}</span>
                        {discussion.authorRole === 'Course Instructor' && (
                          <span className="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded">
                            Instructor
                          </span>
                        )}
                        {discussion.authorRole === 'Teaching Assistant' && (
                          <span className="ml-2 px-2 py-0.5 bg-teal-100 text-teal-700 text-xs font-semibold rounded">
                            TA
                          </span>
                        )}
                        <span className="ml-2 text-gray-400">• {formatTimeAgo(discussion.date)}</span>
                      </p>

                      <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                        {discussion.content}
                      </p>

                      <div className="flex items-center gap-2 mb-3">
                        {discussion.tags.map((tag, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>💬 {discussion.replies}</span>
                        <span>👁️ {discussion.views}</span>
                        <span>👍 {discussion.likes}</span>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-gray-400 flex-shrink-0 ml-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredDiscussions.length === 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-10 text-center text-gray-500">
              No posts match your filters.
            </div>
          )}
        </div>

        {/* New Post Modal (simple inline panel) */}
        {showNewPost && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="w-full max-w-2xl bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Create New Post</h3>
                <button
                  onClick={() => setShowNewPost(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  ✕
                </button>
              </div>

              <div className="grid gap-4">
                <input
                  value={newPostTitle}
                  onChange={e => setNewPostTitle(e.target.value)}
                  placeholder="Post title"
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={newPostCategory}
                  onChange={e => setNewPostCategory(e.target.value as any)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Question</option>
                  <option>Technical Discussion</option>
                  <option>Study Groups</option>
                  <option>Career Advice</option>
                  <option>Technical Help</option>
                </select>
                <input
                  value={newPostTags}
                  onChange={e => setNewPostTags(e.target.value)}
                  placeholder="Tags (comma separated)"
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  value={newPostContent}
                  onChange={e => setNewPostContent(e.target.value)}
                  rows={6}
                  placeholder="Write your post content…"
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowNewPost(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={createPost}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    ) : (
      // THREAD VIEW
      <div className="space-y-6">
        <button
          onClick={() => setSelectedDiscussion(null)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          <ChevronLeft size={16} />
          Back to Discussions
        </button>

        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <div className="flex items-start gap-4 mb-6 pb-6 border-b border-gray-200">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
              {selectedDiscussion.author.split(' ').map(n => n[0]).join('')}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {selectedDiscussion.isPinned && (
                  <span className="px-3 py-1 bg-blue-200 text-blue-800 text-xs font-bold rounded-full">
                    📌 PINNED
                  </span>
                )}
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  selectedDiscussion.category === 'Question' ? 'bg-amber-100 text-amber-700' :
                  selectedDiscussion.category === 'Technical Discussion' ? 'bg-purple-100 text-purple-700' :
                  selectedDiscussion.category === 'Study Groups' ? 'bg-blue-100 text-blue-700' :
                  selectedDiscussion.category === 'Career Advice' ? 'bg-green-100 text-green-700' :
                  selectedDiscussion.category === 'Technical Help' ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {selectedDiscussion.category}
                </span>
                {selectedDiscussion.hasAnswer && (
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                    ✓ Solved
                  </span>
                )}
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {selectedDiscussion.title}
              </h1>
              
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                <span className="font-medium">{selectedDiscussion.author}</span>
                <span>•</span>
                <span>{new Date(selectedDiscussion.date).toLocaleDateString('en-US', {
                  month: 'long', day: 'numeric', year: 'numeric'
                })}</span>
              </div>

              <div className="flex items-center gap-2">
                {selectedDiscussion.tags.map((tag, idx) => (
                  <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="text-gray-700 whitespace-pre-line leading-relaxed">
              {selectedDiscussion.content}
            </div>
          </div>

          <div className="flex items-center gap-3 py-4 border-y border-gray-200 mb-6">
            <button
              onClick={() => addLike(selectedDiscussion.id)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
            >
              <span className="text-lg">👍</span>
              <span className="font-semibold">{selectedDiscussion.likes}</span>
            </button>

            {/* Example admin/TA tools — show conditionally if user is staff */}
            <button
              onClick={() => toggleSolved(selectedDiscussion.id)}
              className="px-3 py-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 text-sm"
            >
              {selectedDiscussion.hasAnswer ? 'Mark Unsovled' : 'Mark Solved'}
            </button>
            <button
              onClick={() => togglePin(selectedDiscussion.id)}
              className="px-3 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 text-sm"
            >
              {selectedDiscussion.isPinned ? 'Unpin' : 'Pin'}
            </button>

            <div className="ml-auto text-sm text-gray-500">
              👁️ {selectedDiscussion.views} • 💬 {selectedDiscussion.replies}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Replies</h3>
            <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-500">
              <MessageSquare size={48} className="mx-auto mb-2 opacity-50" />
              <p>Replies appear here. (Wire to your backend or reply list array.)</p>
            </div>

            <div className="mt-6">
              <textarea
                value={newReplyText}
                onChange={(e) => setNewReplyText(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={4}
                placeholder="Write your reply..."
              />
              <button
                onClick={() => addReply(selectedDiscussion.id, newReplyText)}
                className="mt-3 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
              >
                Post Reply
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
  </>
) : (
  // ... your other tabs unchanged
 <div className="text-center py-3"></div>
 
)}
{courseSection === 'grading' && (
  <div className="space-y-8">
    <h1 className="text-2xl font-bold text-gray-900">📊 Grading Overview</h1>
    <div className="grid grid-cols-3 gap-6">
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 text-center">
        <p className="text-sm text-gray-600">Completed Assignments</p>
        <p className="text-3xl font-bold text-emerald-700">4 / 6</p>
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
        <p className="text-sm text-gray-600">Average Grade</p>
        <p className="text-3xl font-bold text-blue-700">B+</p>
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
        <p className="text-sm text-gray-600">Average GPA</p>
        <p className="text-3xl font-bold text-blue-700">3.0</p>
      </div>
    </div>

    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Detailed Grades</h2>
      <table className="w-full text-sm">
        <thead className="text-gray-500 border-b">
          <tr>
            <th className="py-2 text-left">Assignment</th>
            <th className="py-2 text-left">Status</th>
            <th className="py-2 text-left">Grade</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="py-2">Assignment 1: Risk Assessment</td>
            <td className="py-2 text-emerald-600">Graded</td>
            <td className="py-2 font-semibold">A</td>
          </tr>
          <tr className="border-b">
            <td className="py-2">Assignment 2: Threat Modeling</td>
            <td className="py-2 text-emerald-600">Graded</td>
            <td className="py-2 font-semibold">B+</td>
          </tr>
          <tr>
            <td className="py-2">Assignment 3: IR Plan</td>
            <td className="py-2 text-emerald-600">Graded</td>
            <td className="py-2 font-semibold">B+</td>
          </tr>
          <tr>
            <td className="py-2">Assignment 4: IR Plan</td>
            <td className="py-2  text-emerald-600">Graded</td>
            <td className="py-2 font-semibold">B+</td>
          </tr>
          <tr>
            <td className="py-2">Assignment 5: IR Plan</td>
            <td className="py-2 text-blue-600">Submitted</td>
            <td className="py-2">–</td>
          </tr>
          <tr>
            <td className="py-2">Assignment 6: IR Plan</td>
            <td className="py-2 text-amber-600">In Progress</td>
            <td className="py-2">–</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
)}

{/* Attendance Section */}
{courseSection === 'attendance' && (
  <div className="space-y-8">
    <h1 className="text-2xl font-bold text-gray-900">📅 Attendance Record</h1>
  {/* Attendance % */}
    <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg p-6 text-center">
      <p className="text-lg font-semibold">Attendance Rate</p>
      <p className="text-4xl font-bold mt-2">80%</p>
    </div>
    {/* Summary */}
    <div className="grid grid-cols-3 gap-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
        <p className="text-sm text-gray-600">Total Sessions</p>
        <p className="text-3xl font-bold text-blue-700">10</p>
      </div>
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 text-center">
        <p className="text-sm text-gray-600">Attended</p>
        <p className="text-3xl font-bold text-emerald-700">8</p>
      </div>
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-sm text-gray-600">Missed</p>
        <p className="text-3xl font-bold text-red-700">2</p>
      </div>
    </div>

   <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Detailed Attendance</h2>
      <table className="w-full text-sm">
        <thead className="text-gray-500 border-b">
          <tr>
            <th className="py-2 text-left">Session</th>
            <th className="py-2 text-left">Date</th>
            <th className="py-2 text-left">Topic</th>
            <th className="py-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="py-2">1</td>
            <td className="py-2">Oct 10, 2025</td>
            <td className="py-2">Intro to IR</td>
            <td className="py-2 text-emerald-600 font-semibold">Present</td>
          </tr>
          <tr className="border-b">
            <td className="py-2">2</td>
            <td className="py-2">Oct 17, 2025</td>
            <td className="py-2">Detection & Analysis</td>
            <td className="py-2 text-emerald-600 font-semibold">Present</td>
          </tr>
          <tr className="border-b">
            <td className="py-2">3</td>
            <td className="py-2">Oct 24, 2025</td>
            <td className="py-2">Containment</td>
            <td className="py-2 text-emerald-600 font-semibold">Present</td>
          </tr>
          <tr className="border-b">
            <td className="py-2">4</td>
            <td className="py-2">Oct 25, 2025</td>
            <td className="py-2">Containment</td>
            <td className="py-2 text-emerald-600 font-semibold">Present</td>
          </tr>
          <tr className="border-b">
            <td className="py-2">5</td>
            <td className="py-2">Oct 26, 2025</td>
            <td className="py-2">Containment</td>
            <td className="py-2 text-emerald-600 font-semibold">Present</td>
          </tr>
          <tr className="border-b">
            <td className="py-2">6</td>
            <td className="py-2">Oct 28, 2025</td>
            <td className="py-2">Containment</td>
            <td className="py-2 text-emerald-600 font-semibold">Present</td>
          </tr>
          <tr className="border-b">
            <td className="py-2">7</td>
            <td className="py-2">Oct 29, 2025</td>
            <td className="py-2">Containment</td>
            <td className="py-2 text-emerald-600 font-semibold">Present</td>
          </tr>
          <tr className="border-b">
            <td className="py-2">8</td>
            <td className="py-2">Oct 30, 2025</td>
            <td className="py-2">Containment</td>
            <td className="py-2 text-red-600 font-semibold">Absent</td>
          </tr>
          <tr className="border-b">
            <td className="py-2">9</td>
            <td className="py-2">Nov 2, 2025</td>
            <td className="py-2">Containment</td>
            <td className="py-2 text-emerald-600 font-semibold">Present</td>
          </tr>
          <tr className="border-b">
            <td className="py-2">10</td>
            <td className="py-2">Nov 5, 2025</td>
            <td className="py-2">Containment</td>
            <td className="py-2 text-red-600 font-semibold">Absent</td>
          </tr>

        </tbody>
      </table>
    </div>

  
  </div>
)}

{/* Media Section */}
{courseSection === 'media' && (
  <div className="space-y-6">
  {/* Header */}
  <div>
    
    <h1 className="text-3xl font-bold text-gray-900 mb-1">Media Library</h1>
    <p className="text-gray-600">
      Access lecture recordings, materials, and course resources
    </p>
  </div>

  {/* Category Pills */}
  <div className="flex flex-wrap gap-3">
    <div className="flex items-center gap-3 rounded-xl border px-4 py-3 bg-blue-50 border-blue-200 text-blue-700">
      <span className="text-xl">🎞️</span>
      <div className="text-left leading-tight">
        <div className="text-sm font-semibold">Lecture Recordings</div>
        <div className="text-[11px] text-gray-500">4 items</div>
      </div>
    </div>
    <div className="flex items-center gap-3 rounded-xl border px-4 py-3 bg-white border-gray-200 text-gray-700">
      <span className="text-xl">🧑‍🏫</span>
      <div className="text-left leading-tight">
        <div className="text-sm font-semibold">Office Hours</div>
        <div className="text-[11px] text-gray-500">4 items</div>
      </div>
    </div>
    
    <div className="flex items-center gap-3 rounded-xl border px-4 py-3 bg-white border-gray-200 text-gray-700">
      <span className="text-xl">🧪</span>
      <div className="text-left leading-tight">
        <div className="text-sm font-semibold">Lab Demos</div>
        <div className="text-[11px] text-gray-500">4 items</div>
      </div>
    </div>
    <div className="flex items-center gap-3 rounded-xl border px-4 py-3 bg-white border-gray-200 text-gray-700">
      <span className="text-xl">📚</span>
      <div className="text-left leading-tight">
        <div className="text-sm font-semibold">Supplementary</div>
        <div className="text-[11px] text-gray-500">4 items</div>
      </div>
    </div>
    <div className="flex items-center gap-3 rounded-xl border px-4 py-3 bg-white border-gray-200 text-gray-700">
      <span className="text-xl">📄</span>
      <div className="text-left leading-tight">
        <div className="text-sm font-semibold">Documents</div>
        <div className="text-[11px] text-gray-500">5 items</div>
      </div>
    </div>
  </div>

  {/* Media List */}
  <div className="space-y-5">
    {/* Module 1 */}
    <div className="bg-white border border-gray-200 rounded-xl p-5 flex gap-5 items-center">
      <div className="w-[180px] h-[110px] rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white shrink-0">
        <div className="w-16 h-16 rounded-full bg-white/20 grid place-items-center">
          ▶
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-gray-900 text-lg mb-1">Module 1: Introduction to Cybersecurity</h3>
        <p className="text-gray-600 text-sm">Overview of cybersecurity principles, CIA triad, and security frameworks</p>
        <div className="flex flex-wrap items-center gap-4 text-[13px] text-gray-600 mt-3">
          <span>📅 September 4, 2025</span>
          <span>⏱️ 1h 32m</span>
          <span>👁️ 234 views</span>
          <span>💾 450 MB</span>
          <span>🖥️ 1080p</span>
        </div>
        <div className="flex flex-wrap gap-3 mt-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold">▶ Watch Now</button>
          <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-semibold">Transcript</button>
          <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-semibold">Download</button>
        </div>
      </div>
    </div>

    {/* Module 2 */}
    <div className="bg-white border border-gray-200 rounded-xl p-5 flex gap-5 items-center">
      <div className="w-[180px] h-[110px] rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white shrink-0">
        <div className="w-16 h-16 rounded-full bg-white/20 grid place-items-center">
          ▶
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-gray-900 text-lg mb-1">Module 2: Threat Intelligence Fundamentals</h3>
        <p className="text-gray-600 text-sm">Understanding threat actors, attack vectors, and intelligence gathering</p>
        <div className="flex flex-wrap items-center gap-4 text-[13px] text-gray-600 mt-3">
          <span>📅 September 16, 2025</span>
          <span>⏱️ 1h 28m</span>
          <span>👁️ 198 views</span>
          <span>💾 420 MB</span>
          <span>🖥️ 1080p</span>
        </div>
        <div className="flex flex-wrap gap-3 mt-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold">▶ Watch Now</button>
          <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-semibold">Transcript</button>
          <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-semibold">Download</button>
        </div>
      </div>
    </div>

    {/* Repeat for Module 3 & 4 (copy structure, change details) */}
  </div>
</div>

)}
              {[ 'attendance', 'media'].includes(courseSection) && (
                <div className="p-6 text-center py-12 text-gray-500">
                  <p className="text-sm">More {courseSection.charAt(0).toUpperCase() + courseSection.slice(1)} content later</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Groups Tab */}
       {canvasTab === 'groups' && (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-semibold tracking-tight">Groups</h1>
    </div>

    <div className="bg-white rounded-2xl border border-gray-200">
      <div className="p-5">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            className="w-full rounded-xl border border-gray-200 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Search groups or course codes…"
          />
        </div>
      </div>

      <div className="px-5 pb-5">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="py-3 pr-4">Group</th>
                <th className="py-3 pr-4">Course Code</th>
                <th className="py-3 pr-4">Members</th>
                <th className="py-3 pr-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {canvasData.groups.map((group, idx) => (
                <React.Fragment key={idx}>
                  {/* PRIMARY ROW (stays fixed) */}
                  <tr className="border-b last:border-b-0 hover:bg-gray-50">
                    <td className="py-3 pr-4 font-medium">{group.name}</td>
                    <td className="py-3 pr-4">{group.course}</td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        {group.members.slice(0, 5).map((member, midx) => (
                          <div
                            key={midx}
                            title={member}
                            className="w-7 h-7 rounded-full border border-gray-200 grid place-items-center text-[10px] font-semibold bg-gray-100"
                          >
                            {getInitials(member)}
                          </div>
                        ))}
                        {group.members.length > 5 && (
                          <span className="text-xs text-gray-600">
                            +{group.members.length - 5} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <button
                        onClick={() =>
                          setExpandedGroup(expandedGroup === idx ? null : idx)
                        }
                        className="px-3 py-1 rounded-xl border border-gray-200 hover:bg-gray-100 text-sm"
                      >
                        {expandedGroup === idx ? 'Hide' : 'Show'} Members
                      </button>
                    </td>
                  </tr>

                  {/* EXPANDED DETAIL ROW (full names) */}
                  {expandedGroup === idx && (
                    <tr className="bg-gray-50 border-b last:border-b-0">
                      <td colSpan={4} className="py-4 px-4">
                        <div className="flex flex-wrap gap-2">
                          {group.members.map((name, nIdx) => (
                            <span
                              key={nIdx}
                              className="inline-block px-3 py-1 rounded-full border border-gray-300 bg-white text-gray-800"
                            >
                              {name}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
)}


        {/* To-do Tab */}
        {canvasTab === 'todo' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold tracking-tight">To-do List</h1>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="rounded border-gray-300" />
                Hide completed
              </label>
            </div>

            {Object.entries(canvasData.todos).map(([course, items]) => (
              <div key={course} className="bg-white rounded-2xl border border-gray-200">
                <div className="p-5 border-b border-gray-200">
                  <h2 className="font-medium">{course}</h2>
                </div>
                <div className="p-5">
                  <ul className="space-y-2">
                    {(items as any[]).map((item, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <input type="checkbox" className="rounded border-gray-300" defaultChecked={item.done} />
                        <span className={`text-sm ${item.done ? 'line-through text-gray-400' : ''}`}>{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}

            <div className="bg-white rounded-2xl border border-gray-200">
              <div className="p-5 border-b border-gray-200">
                <h2 className="font-medium">Add To-do Item</h2>
              </div>
              <div className="p-5">
                <div className="flex flex-col md:flex-row gap-2">
                  <select className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option>Select Course</option>
                    {canvasData.courses.map((c, idx) => (
                      <option key={idx} value={c.code}>
                        {c.code}
                      </option>
                    ))}
                  </select>
                  <input className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Enter new task..." />
                  <button className="flex items-center gap-1 px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-100">
                    <CheckCircle size={16} />
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {canvasTab === 'notifications' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold tracking-tight">Notifications</h1>
              <div className="flex items-center gap-2 text-sm">
                <label className="text-gray-600">Filter</label>
                <select className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="all">All</option>
                  <option value="system">System</option>
                  <option value="course">Course</option>
                  <option value="group">Group</option>
                </select>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200">
              <div className="p-5">
                <ul className="divide-y divide-gray-200">
                  {canvasData.notifications.map((notif, idx) => (
                    <li key={idx} className="py-3 flex items-start gap-3">
                      <Bell className="w-5 h-5 mt-0.5 text-gray-400" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${getNotificationColor(notif.type)}`}>
                            {notif.type.charAt(0).toUpperCase() + notif.type.slice(1)}
                          </span>
                          {(notif as any).course && (
                            <span className="text-xs text-gray-600">
                              Course: <strong>{(notif as any).course}</strong>
                            </span>
                          )}
                          {(notif as any).group && (
                            <span className="text-xs text-gray-600">
                              Group: <strong>{(notif as any).group}</strong>
                            </span>
                          )}
                          <span className="ml-auto text-xs text-gray-500">{notif.when}</span>
                        </div>
                        <div className="mt-1 font-medium">{notif.title}</div>
                        <div className="text-sm text-gray-600">{notif.detail}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Progress Tab */}
        {canvasTab === 'Progress' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold tracking-tight">Progress</h1>
            </div>
             {/* Program Overview */}
    <section className="bg-white rounded-2xl border border-gray-200">
      <div className="p-5 border-b border-gray-200">
        <h2 className="font-medium">Program Overview</h2>
      </div>
      <div className="p-5 grid gap-5 md:grid-cols-3">
        <div className="rounded-xl bg-indigo-50 border border-indigo-200 p-4">
          <p className="text-sm text-indigo-700 mb-1">Program</p>
          <p className="font-semibold text-indigo-900">MSc in Cybersecurity</p>
          <p className="text-xs text-indigo-700/80 mt-1">Incident Response Track</p>
        </div>
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4">
          <p className="text-sm text-emerald-700 mb-1">Total Credits</p>
          <p className="font-semibold text-emerald-900">36 Credits</p>
          <p className="text-xs text-emerald-700/80 mt-1">Core 24 • Electives 9 • Capstone 3</p>
        </div>
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
          <p className="text-sm text-amber-700 mb-1">Expected Duration</p>
          <p className="font-semibold text-amber-900">3 Semesters</p>
          <p className="text-xs text-amber-700/80 mt-1">Full-time plan shown below</p>
        </div>
      </div>
      <div className="px-5 pb-5">
        <div className="rounded-lg bg-gray-50 border border-gray-200 p-4">
          <p className="text-sm text-gray-700 leading-relaxed">
            This curriculum focuses on enterprise-scale incident response: detection, containment, forensics,
            recovery, and continuous improvement. You’ll work with SIEM tooling, threat intel feeds,
            and case-based playbooks aligned with NIST/ISO frameworks.
          </p>
        </div>
      </div>
    </section>
    
    {/* Current Progress */}
    <section className="bg-white rounded-2xl border border-gray-200">
      <div className="p-5 border-b border-gray-200">
        <h2 className="font-medium">Your Progress</h2>
      </div>
      <div className="p-5 space-y-4">
        <p className="text-gray-700">
          You are currently enrolled in <strong>CSIR-6261: Cybersecurity Incident Response</strong>.
        </p>
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-gray-600">Program Progress</span>
            <span className="text-sm font-medium text-indigo-600">40%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-indigo-600 h-3 rounded-full" style={{ width: '40%' }} />
          </div>
        </div>
        <p className="text-sm text-gray-500">
          Progress includes completed courses plus partial credit for your active course this semester.
        </p>
      </div>
    </section>

      {/* Suggested Plan by Semester */}
    <section className="bg-white rounded-2xl border border-gray-200">
      <div className="p-5 border-b border-gray-200">
        <h2 className="font-medium">Suggested Degree Plan</h2>
      </div>
      <div className="p-5 space-y-4">
        <div className="grid md:grid-cols-3 gap-4">
          {/* Semester 1 */}
          <div className="rounded-xl border border-gray-200">
            <div className="px-4 py-3 border-b bg-gray-50 rounded-t-xl">
              <p className="text-sm font-semibold text-gray-800">Semester 1</p>
              <p className="text-xs text-gray-500">Foundations & Core</p>
            </div>
            <ul className="p-4 space-y-2 text-sm">
              <li className="flex items-center justify-between">
                <span>CSIR-6261 Cybersecurity Incident Response</span>
                <span className="px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-200">Core</span>
              </li>
              <li className="flex items-center justify-between">
                <span>CS-6238 Secure Computer Systems</span>
                <span className="px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-200">Core</span>
              </li>
              <li className="flex items-center justify-between">
                <span>CS-6262 Network Security</span>
                <span className="px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-200">Core</span>
              </li>
            </ul>
          </div>

          {/* Semester 2 */}
          <div className="rounded-xl border border-gray-200">
            <div className="px-4 py-3 border-b bg-gray-50 rounded-t-xl">
              <p className="text-sm font-semibold text-gray-800">Semester 2</p>
              <p className="text-xs text-gray-500">Threats & Monitoring</p>
            </div>
            <ul className="p-4 space-y-2 text-sm">
              <li className="flex items-center justify-between">
                <span>Threat Intelligence Fundamentals</span>
                <span className="px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-200">Core</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Security Monitoring Tools (SIEM)</span>
                <span className="px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-200">Core</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Elective 1 (choose 1)</span>
                <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-50 text-emerald-700 border border-emerald-200">Elective</span>
              </li>
            </ul>
          </div>

          {/* Semester 3 */}
          <div className="rounded-xl border border-gray-200">
            <div className="px-4 py-3 border-b bg-gray-50 rounded-t-xl">
              <p className="text-sm font-semibold text-gray-800">Semester 3</p>
              <p className="text-xs text-gray-500">Advanced Practice</p>
            </div>
            <ul className="p-4 space-y-2 text-sm">
              <li className="flex items-center justify-between">
                <span>Advanced Threat Hunting</span>
                <span className="px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-200">Core</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Elective 2 (choose 1)</span>
                <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-50 text-emerald-700 border border-emerald-200">Elective</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Capstone / IR Playbook Project</span>
                <span className="px-2 py-0.5 rounded-full text-xs bg-amber-50 text-amber-700 border border-amber-200">Capstone</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
          <p className="text-sm text-amber-900">
            Tip: Plans are flexible. Talk to your advisor if you’re working part-time or want to fast-track with
            heavier loads.
          </p>
        </div>
      </div>
    </section>
      {/* Important Notes & Policies */}
    <section className="bg-white rounded-2xl border border-gray-200">
      <div className="p-5 border-b border-gray-200">
        <h2 className="font-medium">What to Know</h2>
      </div>
      <div className="p-5 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-gray-200 p-4">
          <p className="font-semibold text-gray-900 mb-2">Milestones</p>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Declare concentration by end of Semester 1</li>
            <li>• Mid-program review in Semester 2</li>
            <li>• Capstone proposal due Week 3 of final semester</li>
          </ul>
        </div>
        <div className="rounded-xl border border-gray-200 p-4">
          <p className="font-semibold text-gray-900 mb-2">Policies</p>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Minimum GPA 3.0 to graduate</li>
            <li>• One retake allowed for core courses</li>
            <li>• Academic integrity policy applies to labs & reports</li>
          </ul>
        </div>
        <div className="rounded-xl border border-gray-200 p-4">
          <p className="font-semibold text-gray-900 mb-2">Advising & Support</p>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Advisor: Dr. Sarah Johnson (Wed 2–4 PM)</li>
            <li>• TA Office Hours: Tue & Thu 5–6 PM</li>
            <li>• Career Services: Resume clinic every first Friday</li>
          </ul>
        </div>
      </div>
    </section>
   
     {/* Quick Resources */}
    <section className="bg-white rounded-2xl border border-gray-200">
      <div className="p-5 border-b border-gray-200">
        <h2 className="font-medium">Resources</h2>
      </div>
      <div className="p-5 grid gap-4 md:grid-cols-3">
        <a className="rounded-xl p-4 border hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
           href="#" onClick={(e)=>e.preventDefault()}>
          <p className="font-semibold text-gray-900">Program Handbook</p>
          <p className="text-sm text-gray-600">Requirements, policies, and forms</p>
        </a>
        <a className="rounded-xl p-4 border hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
           href="#" onClick={(e)=>e.preventDefault()}>
          <p className="font-semibold text-gray-900">Capstone Guide</p>
          <p className="text-sm text-gray-600">Proposal templates & grading rubric</p>
        </a>
        <a className="rounded-xl p-4 border hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
           href="#" onClick={(e)=>e.preventDefault()}>
          <p className="font-semibold text-gray-900">Advising Appointments</p>
          <p className="text-sm text-gray-600">Book time with your advisor</p>
        </a>
      </div>
    </section>
           

           
          </div>
        )}
      </main>
    </div>
  );
};

const Dashboard = () => (
    <div>
  <div className="px-3 sm:px-3 p-3">
  <div className="flex justify-between items-start">
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
      <p className="text-gray-500 mt-1">Welcome back, Nguyen Van A</p>
    </div>
  </div>
</div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 p-3">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">

          <div className="flex items-center justify-between mb-4">
                   
            <div className="p-3 bg-white/20 rounded-lg">
              <BookOpen size={24} />
            </div>
          </div>
          <p className="text-blue-100 text-sm font-medium">GPA</p>
          <p className="text-3xl font-bold mt-1">3.45</p>
          <p className="text-blue-100 text-xs mt-2">↑ 0.12 vs last semester</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <CheckCircle size={24} className="text-emerald-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm font-medium">Attendance</p>
          <p className="text-3xl font-bold mt-1 text-gray-900">92%</p>
          <p className="text-emerald-600 text-xs mt-2">↑ 3% vs last semester</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Activity size={24} className="text-purple-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm font-medium">Active Courses</p>
          <p className="text-3xl font-bold mt-1 text-gray-900">6</p>
          <p className="text-gray-500 text-xs mt-2">Current semester</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <AlertCircle size={24} className="text-orange-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm font-medium">Projects</p>
          <p className="text-3xl font-bold mt-1 text-gray-900">8</p>
          <p className="text-gray-500 text-xs mt-2">5 completed, 3 ongoing</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-1 xl:grid-cols-3 gap-3 p-3 ">
        <div className="col-span-2 space-y-3">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">Upcoming Activities & Events</h3>
              <button className="text-blue-600 text-sm font-medium hover:underline">View Calendar</button>
            </div>
            <div className="space-y-3">
              {upcomingActivities.map(activity => (
                <div key={activity.id} className={`border-l-4 rounded-lg p-4 transition-all hover:shadow-md ${
                  activity.urgent 
                    ? 'border-red-500 bg-red-50' 
                    : activity.color === 'blue' ? 'border-blue-500 bg-blue-50'
                    : activity.color === 'purple' ? 'border-purple-500 bg-purple-50'
                    : activity.color === 'emerald' ? 'border-emerald-500 bg-emerald-50'
                    : 'border-orange-500 bg-orange-50'
                }`}>
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${
                      activity.urgent 
                        ? 'bg-red-100' 
                        : activity.color === 'blue' ? 'bg-blue-100'
                        : activity.color === 'purple' ? 'bg-purple-100'
                        : activity.color === 'emerald' ? 'bg-emerald-100'
                        : 'bg-orange-100'
                    }`}>
                      {activity.icon === 'book' && <BookOpen size={20} className={`text-${activity.color}-600`} />}
                      {activity.icon === 'alert' && <AlertCircle size={20} className="text-red-600" />}
                      {activity.icon === 'file' && <CheckCircle size={20} className="text-purple-600" />}
                      {activity.icon === 'briefcase' && <Briefcase size={20} className="text-emerald-600" />}
                      {activity.icon === 'user' && <User size={20} className="text-orange-600" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900">{activity.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{activity.course}</p>
                        </div>
                        {activity.urgent && (
                          <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                            Urgent
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-700">
                        <div className="flex items-center gap-1">
                          <Clock size={16} />
                          <span>{activity.time}</span>
                        </div>
                        {activity.duration && (
                          <span className="text-gray-500">• {activity.duration}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                        <span>📍 {activity.location}</span>
                      </div>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700">
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Deadlines</h3>
            <div className="space-y-3">
              {upcomingItems.map(item => (
                <div 
                  key={item.id} 
                  className={`p-4 rounded-lg border-l-4 ${item.urgent ? 'bg-red-50 border-red-500' : 'bg-gray-50 border-gray-300'}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className={`font-semibold text-sm ${item.urgent ? 'text-red-900' : 'text-gray-900'}`}>
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">{item.course}</p>
                    </div>
                    {item.urgent && (
                      <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
                        Urgent
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className={`text-xs font-medium ${item.urgent ? 'text-red-700' : 'text-gray-700'}`}>
                      Due: {item.due}
                    </span>
                    <ChevronRight size={16} className="text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {recentActivity.map(item => (
                <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                  <div className="p-2 rounded-lg bg-white/20">
                    <CheckCircle size={16} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{item.action}</p>
                    <p className="text-sm text-purple-100">{item.detail}</p>
                  </div>
                  <div className="text-right">
                    {item.grade && (
                      <span className="text-sm font-semibold text-white bg-white/20 px-2 py-1 rounded">{item.grade}</span>
                    )}
                    <p className="text-xs text-purple-200 mt-1">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

const Profile = () => (
    <div className="space-y-3 p-3">
    {/* Profile hero (responsive) */}
<div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 sm:p-6 lg:p-8">
  {/* Top row: avatar + name/badges + actions */}
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
    {/* Left: avatar + name + badges */}
    <div className="flex flex-wrap items-center gap-4 flex-1 min-w-0">
      {/* Avatar */}
      <img
        src="https://i.postimg.cc/tgHhXHK4/hsb-capibara.jpg"
        alt="Avatar"
        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-white/20 object-cover shrink-0"
      />

      {/* Name + chips */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-bold leading-tight text-2xl sm:text-3xl lg:text-4xl min-w-0">
            <span className="truncate block">Nguyễn Văn A</span>
          </h1>

          {/* GPA + EC Level chips */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="px-3 py-1.5 rounded-lg bg-white/15 backdrop-blur text-sm">
              <span className="opacity-90 mr-2">GPA</span>
              <span className="font-semibold">3.45</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-white/15 backdrop-blur text-sm">
              <span className="opacity-90 mr-2">EC Level</span>
              <span className="font-semibold">Excellent</span>
            </div>
          </div>
        </div>

        {/* ID + tag line – wraps under the name on small screens */}
        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="opacity-90">22080000</span>
          </div>
          <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur text-xs">
            Internship
          </span>
        </div>
      </div>
    </div>

    {/* Right: actions – stack below on small screens */}
    <div className="absolute top-4 right-4 flex items-center gap-3 mt-6">
    <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
      <Bell size={18} />
    </button>
    <button className="px-3 py-1.5 bg-white/20 rounded-lg hover:bg-white/30 text-sm font-medium transition-colors flex items-center gap-2">
      <Pencil size={16} />
      Edit
    </button>
  </div>
  </div>

  {/* Info row – becomes 1/2/5 columns as screen grows */}
  <div className="mt-4 sm:mt-6 border-t border-white/20 pt-4 sm:pt-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
      <div className="min-w-0">
        <p className="text-white/80 text-sm mb-1">Email</p>
        <p className="font-semibold truncate">met22080001@hsb.edu.vn</p>
      </div>
      <div className="min-w-0">
        <p className="text-white/80 text-sm mb-1">Phone</p>
        <p className="font-semibold truncate">0846238088</p>
      </div>
      <div className="min-w-0">
        <p className="text-white/80 text-sm mb-1">Program</p>
        <p className="font-semibold truncate">MET</p>
      </div>
      <div className="min-w-0">
        <p className="text-white/80 text-sm mb-1">Cohort</p>
        <p className="font-semibold truncate">QH-2022-D</p>
      </div>
      <div className="min-w-0">
        <p className="text-white/80 text-sm mb-1">Current Semester</p>
        <p className="font-semibold">5</p>
      </div>
    </div>
  </div>
</div>
{/*profile info card*/}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        <div className="col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-3">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Gender</label>
                <p className="text-gray-900 font-medium">Female</p>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Date of Birth</label>
                <p className="text-gray-900 font-medium">01/10/2000</p>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">ID Card / CCCD</label>
                <p className="text-gray-900 font-medium">042304000000</p>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Class Officer / Secretary</label>
                <p className="text-gray-500 italic">Not assigned</p>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Enrollment Date</label>
                <p className="text-gray-500 italic">Not specified</p>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Failed Courses</label>
                <p className="text-gray-500 italic">None</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Student Performance</h3>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-xs text-gray-600">Total GPA</p>
                  <p className="text-2xl font-bold text-blue-600">3.45</p>
                </div>
                <div className="h-10 w-px bg-gray-200"></div>
                <div className="text-right">
                  <p className="text-xs text-gray-600">Current EC Level</p>
                  <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-semibold rounded-full mt-1">
                    Excellent
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {semesterGrades.map((sem, idx) => (
                <div key={idx} className={`p-4 rounded-lg border-2 ${sem.gpa ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-gray-50'}`}>
                  <p className="text-sm text-gray-600 mb-3 font-medium">{sem.semester}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">GPA</p>
                      <p className={`text-2xl font-bold ${sem.gpa ? 'text-blue-600' : 'text-gray-400'}`}>
                        {sem.gpa ? sem.gpa.toFixed(2) : '-'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 mb-1">EC Level</p>
                      <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${getECLevelColor(sem.ecLevel)}`}>
                        {sem.ecLevel || '-'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Party Activity</h4>
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <label className="text-sm text-gray-600 mb-1 block">Party Sympathy Course</label>
                    <p className="text-gray-500 italic">Not participated</p>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <label className="text-sm text-gray-600 mb-1 block">Party Member</label>
                    <p className="text-gray-500 italic">No</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Youth Union Activity</h4>
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <label className="text-sm text-gray-600 mb-1 block">Youth Union Member</label>
                    <p className="text-gray-900 font-medium">Yes</p>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <label className="text-sm text-gray-600 mb-1 block">Union Position</label>
                    <p className="text-gray-500 italic">Member</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="bg-white rounded-xl border border-gray-200 p-3">
              <div>
                <label className="text-m font-bold text-gray-600 mb-1 block">Current Status</label>
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  Internship
                </span>
              
              <div>
                <label className="text-sm text-gray-600 block mt-2">Enrollment Date</label>
                <p className="text-gray-500 italic">Not specified</p>
              </div>
              <div>
                <label className="text-sm text-gray-600 mt-2 block">Leave Start Date</label>
                <p className="text-gray-500 italic">Not applicable</p>
              </div>
              <div>
                <label className="text-sm text-gray-600 mt-2 block">Leave End Date</label>
                <p className="text-gray-500 italic">Not applicable</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 p-3">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Briefcase size={20} className="text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Internship</h3>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600 mt-2 block">Company</label>
                <p className="text-gray-500 italic">Not assigned</p>
              </div>
              <div>
                <label className="text-sm text-gray-600 mt-2 block">Status</label>
                <p className="text-gray-500 italic">Pending</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200 p-3">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Globe size={20} className="text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Overseas Exchange</h3>
            </div>
            <p className="text-gray-500 italic">No exchange program</p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-200 p-3">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Award size={20} className="text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Thesis / FYP</h3>
            </div>
            <p className="text-gray-500 italic">Not started</p>
          </div>
        </div>
      </div>
    </div>
  );


const Academic = () => (
    
    <div className="space-y-3 p-3">
      {/* Sub Navigation Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Academic Progress and Transcripts</h2>
          <p className="text-gray-600 mt-1">Monitor your academic journey, view current courses, and access your official transcripts.</p>
        </div>
      </div>
        <div className="flex gap-1">
          <button
            onClick={() => setAcademicSubTab('courses')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              academicSubTab === 'courses'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Current Courses
          </button>
          <button
            onClick={() => setAcademicSubTab('transcript')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              academicSubTab === 'transcript'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Transcript
          </button>
        </div>
      </div>

      {academicSubTab === 'courses' ? (
        <>
          {/* Academic Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <BookOpen size={24} className="text-blue-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm font-medium">Current Courses</p>
          <p className="text-3xl font-bold mt-1 text-gray-900">6</p>
          <p className="text-gray-500 text-xs mt-2">18 total credits</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <CheckCircle size={24} className="text-emerald-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm font-medium">Overall Attendance</p>
          <p className="text-3xl font-bold mt-1 text-gray-900">91%</p>
          <p className="text-emerald-600 text-xs mt-2">Above target</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <AlertCircle size={24} className="text-orange-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm font-medium">Pending Items</p>
          <p className="text-3xl font-bold mt-1 text-gray-900">5</p>
          <p className="text-gray-500 text-xs mt-2">2 assignments, 3 readings</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp size={24} className="text-purple-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm font-medium">Semester GPA</p>
          <p className="text-3xl font-bold mt-1 text-gray-900">3.45</p>
          <p className="text-purple-600 text-xs mt-2">Top 15%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {/* Current Courses Detail */}
        <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Current Courses</h3>
            <button className="text-blue-600 text-sm font-medium hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {academicCourses.map(course => (
              <div key={course.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-semibold text-gray-900">{course.name}</h4>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                        {course.credits} credits
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{course.code} • {course.instructor}</p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-full">
                    {course.currentGrade}
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-3 py-3 border-y border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Schedule</p>
                    <p className="text-sm font-medium text-gray-900">{course.schedule}</p>
                    <p className="text-xs text-gray-500">Room {course.room}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Attendance</p>
                    <p className="text-sm font-medium text-gray-900">{course.attendance}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Assignments Avg</p>
                    <p className="text-sm font-medium text-gray-900">{course.assignments}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button className="text-sm text-blue-600 hover:underline font-medium">View Details</button>
                  <button className="text-sm text-gray-600 hover:underline">Materials</button>
                  <button className="text-sm text-gray-600 hover:underline">Grades</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Assignments */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Assignments</h3>
            <div className="space-y-3">
              {assignments.slice(0, 4).map(assignment => (
                <div 
                  key={assignment.id}
                  className={`p-3 rounded-lg border ${
                    assignment.status === 'pending' ? 'bg-red-50 border-red-200' : 
                    assignment.status === 'submitted' ? 'bg-blue-50 border-blue-200' :
                    'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{assignment.title}</p>
                      <p className="text-xs text-gray-600 mt-1">{assignment.course}</p>
                    </div>
                    {assignment.grade && (
                      <span className="text-sm font-bold text-emerald-600">{assignment.grade}</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-600">Due: {assignment.dueDate}</p>
                    <span className={`text-xs font-medium ${
                      assignment.status === 'pending' ? 'text-red-700' :
                      assignment.status === 'submitted' ? 'text-blue-700' :
                      'text-emerald-700'
                    }`}>
                      {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors">
              View All Assignments
            </button>
          </div>

          {/* Upcoming Exams */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={20} className="text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Upcoming Exams</h3>
            </div>
            <div className="space-y-3">
              {upcomingExams.map(exam => (
                <div key={exam.id} className="p-4 bg-white rounded-lg border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-gray-900">{exam.course}</p>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">
                      {exam.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{exam.date}</p>
                  <p className="text-xs text-gray-500 mt-1">{exam.time} • {exam.room}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full bg-white/20 hover:bg-white/30 rounded-lg p-3 text-left transition-colors">
                <p className="font-medium text-sm">Register for Courses</p>
              </button>
              <button className="w-full bg-white/20 hover:bg-white/30 rounded-lg p-3 text-left transition-colors">
                <p className="font-medium text-sm">Request for Official Transcript</p>
              </button>
              <button className="w-full bg-white/20 hover:bg-white/30 rounded-lg p-3 text-left transition-colors">
                <p className="font-medium text-sm">View Timetable</p>
              </button>
            </div>
          </div>
        </div>
      </div>
      </>
      ) : (
        // Transcript View
        <div className="space-y-6">
          {/* Transcript Header */}
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">Academic Transcript</h2>
                <p className="text-blue-100">Nguyễn Văn A • ID: 22080000</p>
                <p className="text-blue-100 text-sm">Program: MET • Cohort: QH-2022-D</p>
              </div>
              <div className="text-right">
                <p className="text-blue-100 text-sm mb-1">Cumulative GPA</p>
                <p className="text-5xl font-bold">3.45</p>
                <p className="text-blue-100 text-sm mt-2">72 Credits Earned</p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/20">
              <div>
                <p className="text-blue-100 text-xs mb-1">Total Courses</p>
                <p className="text-2xl font-bold">20</p>
              </div>
              <div>
                <p className="text-blue-100 text-xs mb-1">Average Grade</p>
                <p className="text-2xl font-bold">B+</p>
              </div>
              <div>
                <p className="text-blue-100 text-xs mb-1">Highest GPA</p>
                <p className="text-2xl font-bold">3.79</p>
              </div>
              <div>
                <p className="text-blue-100 text-xs mb-1">Credits Remaining</p>
                <p className="text-2xl font-bold">48</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Request for official Transcript
            </button>
            <button className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Download non-standard transcript
            </button>
            <button className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share
            </button>
          </div>

          {/* Semester-by-Semester Transcript */}
          <div className="space-y-6">
            {transcriptData.map((semester, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {/* Semester Header */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{semester.semester}</h3>
                      <p className="text-sm text-gray-600 mt-1">{semester.courses.length} courses • {semester.credits} credits</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 mb-1">Semester GPA</p>
                      <p className="text-3xl font-bold text-blue-600">{semester.gpa.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                {/* Course Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Course Code</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Course Name</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Instructor</th>
                        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Credits</th>
                        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Grade</th>
                        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Points</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {semester.courses.map((course, courseIdx) => (
                        <tr key={courseIdx} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-medium text-gray-900">{course.code}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-900">{course.name}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-600">{course.instructor}</span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="text-sm text-gray-900">{course.credits}</span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${getGradeColor(course.grade)}`}>
                              {course.grade}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="text-sm font-medium text-gray-900">{course.points.toFixed(1)}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Semester Summary */}
                <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex gap-8">
                      <div>
                        <span className="text-gray-600">Total Credits: </span>
                        <span className="font-semibold text-gray-900">{semester.credits}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Courses Completed: </span>
                        <span className="font-semibold text-gray-900">{semester.courses.length}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Semester GPA: </span>
                      <span className="font-bold text-blue-600 text-lg">{semester.gpa.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Grading Scale</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 text-sm font-semibold rounded-full bg-emerald-50 text-emerald-600">A</span>
                <span className="text-sm text-gray-600">4.0 (Excellent)</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 text-sm font-semibold rounded-full bg-emerald-50 text-emerald-600">A-</span>
                <span className="text-sm text-gray-600">3.7</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 text-sm font-semibold rounded-full bg-blue-50 text-blue-600">B+</span>
                <span className="text-sm text-gray-600">3.3 (Good)</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 text-sm font-semibold rounded-full bg-blue-50 text-blue-600">B</span>
                <span className="text-sm text-gray-600">3.0</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 text-sm font-semibold rounded-full bg-orange-50 text-orange-600">C+</span>
                <span className="text-sm text-gray-600">2.3 (Fair)</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 text-sm font-semibold rounded-full bg-orange-50 text-orange-600">C</span>
                <span className="text-sm text-gray-600">2.0</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 text-sm font-semibold rounded-full bg-red-50 text-red-600">D</span>
                <span className="text-sm text-gray-600">1.0 (Poor)</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 text-sm font-semibold rounded-full bg-red-50 text-red-600">F</span>
                <span className="text-sm text-gray-600">0.0 (Fail)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );


const StudentFeedbackPortal = () => {
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [showSurveyModal, setShowSurveyModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');

  const availableSurveys = [
    {
      id: 1,
      title: 'CS301 - Data Structures Course Feedback',
      category: 'Course Feedback',
      instructor: 'Dr. Nguyễn Văn A',
      type: 'Course',
      icon: Book,
      deadline: '2024-11-30',
      estimatedTime: '5-7 minutes',
      status: 'Open',
      responses: 23,
      totalStudents: 45,
      description: 'Share your experience with the Data Structures and Algorithms course. Your feedback helps us improve teaching methods and course content.',
      questions: [
        'How would you rate the overall quality of this course?',
        'The instructor explained concepts clearly',
        'Course materials were helpful and relevant',
        'Assignments were appropriate for the learning objectives',
        'What aspects of the course did you find most valuable?',
        'What suggestions do you have for improving this course?'
      ]
    },
    {
      id: 2,
      title: 'BUS202 - Strategic Management Evaluation',
      category: 'Course Feedback',
      instructor: 'Prof. Trần Thị B',
      type: 'Course',
      icon: Book,
      deadline: '2024-11-28',
      estimatedTime: '5-7 minutes',
      status: 'Open',
      responses: 31,
      totalStudents: 52,
      description: 'Provide feedback on the Strategic Management course to help enhance the learning experience for future students.',
      questions: [
        'Rate the overall course quality',
        'Instructor effectiveness in teaching',
        'Relevance of case studies and examples',
        'Quality of course materials',
        'Most valuable learning outcomes',
        'Suggestions for improvement'
      ]
    },
    {
      id: 3,
      title: 'Fall 2024 Program Satisfaction Survey',
      category: 'Program Feedback',
      type: 'Program',
      icon: Users,
      deadline: '2024-12-15',
      estimatedTime: '10-15 minutes',
      status: 'Open',
      responses: 156,
      totalStudents: 320,
      description: 'Help us understand your overall experience with the Management of Entrepreneurship and Technology program. Your input shapes the future of our curriculum.',
      questions: [
        'Overall satisfaction with the program',
        'Quality of courses in your major',
        'Program structure and flexibility',
        'Support from academic advisors',
        'Career preparation and practical skills',
        'Campus resources and facilities',
        'What has been your best experience in the program?',
        'What areas need improvement?',
        'Would you recommend this program to others?'
      ]
    },
    {
      id: 4,
      title: 'Career Services & Employability Feedback',
      category: 'Employability',
      type: 'Services',
      icon: Briefcase,
      deadline: '2024-12-10',
      estimatedTime: '8-10 minutes',
      status: 'Open',
      responses: 89,
      totalStudents: 280,
      description: 'Share your experience with career counseling, job placement services, and internship support to help us better prepare students for their careers.',
      questions: [
        'Quality of career counseling services',
        'Usefulness of resume/CV workshops',
        'Interview preparation support',
        'Job/internship placement assistance',
        'Industry connections and networking events',
        'Skills development programs',
        'How well has the program prepared you for employment?',
        'Additional services you would like to see'
      ]
    },
    {
      id: 5,
      title: 'Library & Learning Resources Survey',
      category: 'Services Feedback',
      type: 'Services',
      icon: Building,
      deadline: '2024-12-05',
      estimatedTime: '5 minutes',
      status: 'Open',
      responses: 203,
      totalStudents: 450,
      description: 'Tell us about your experience using library services, study spaces, and online resources.',
      questions: [
        'Library facilities and study spaces',
        'Availability of books and resources',
        'Online database access',
        'Library staff helpfulness',
        'Operating hours convenience',
        'Suggestions for new resources or improvements'
      ]
    },
    {
      id: 6,
      title: 'Student Support Services Evaluation',
      category: 'Services Feedback',
      type: 'Services',
      icon: Users,
      deadline: '2024-12-08',
      estimatedTime: '6-8 minutes',
      status: 'Open',
      responses: 142,
      totalStudents: 380,
      description: 'Evaluate the quality of student support services including academic advising, counseling, and student affairs.',
      questions: [
        'Academic advising quality',
        'Student counseling services',
        'Financial aid support',
        'International student services',
        'Extracurricular activities',
        'Overall student life experience',
        'What support services have been most helpful?',
        'What additional support would you like?'
      ]
    },
    {
      id: 7,
      title: 'Mid-Semester Course Check-in',
      category: 'Course Feedback',
      instructor: 'Various',
      type: 'Course',
      icon: Book,
      deadline: '2024-11-15',
      estimatedTime: '3-4 minutes',
      status: 'Completed',
      responses: 45,
      totalStudents: 45,
      description: 'Quick feedback on your current courses to help instructors make real-time improvements.',
      questions: [
        'How is the course pace?',
        'Are learning objectives clear?',
        'Quality of instruction so far',
        'Any immediate concerns or suggestions?'
      ]
    },
    {
      id: 8,
      title: 'Campus Facilities & Infrastructure',
      category: 'Services Feedback',
      type: 'Services',
      icon: Building,
      deadline: '2024-12-20',
      estimatedTime: '5-7 minutes',
      status: 'Open',
      responses: 187,
      totalStudents: 500,
      description: 'Share your feedback on campus facilities including classrooms, labs, dining, and recreational spaces.',
      questions: [
        'Classroom facilities quality',
        'Computer labs and equipment',
        'Cafeteria and dining options',
        'Sports and recreation facilities',
        'Campus cleanliness and maintenance',
        'Accessibility for all students',
        'Suggestions for facility improvements'
      ]
    }
  ];

  const filteredSurveys = filterCategory === 'all' 
    ? availableSurveys 
    : availableSurveys.filter(survey => survey.category === filterCategory);

  const openSurveys = availableSurveys.filter(s => s.status === 'Open').length;
  const completedSurveys = availableSurveys.filter(s => s.status === 'Completed').length;

  const getStatusColor = (status) => {
    if (status === 'Open') return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (status === 'Completed') return 'bg-gray-100 text-gray-700 border-gray-200';
    return 'bg-blue-100 text-blue-700 border-blue-200';
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case 'Course Feedback': return 'bg-blue-100 text-blue-700';
      case 'Program Feedback': return 'bg-purple-100 text-purple-700';
      case 'Employability': return 'bg-orange-100 text-orange-700';
      case 'Services Feedback': return 'bg-teal-100 text-teal-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const categories = ['Course Feedback', 'Program Feedback', 'Employability', 'Services Feedback'];

  return (
    <div className="min-h-screen bg-gray-50 p-3 ">
      

      <div className="max-w mx-auto ">
        <div className="space-y-3">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-3">
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                
                <span className="text-sm font-semibold text-gray-600">Open Surveys</span>
              </div>
              <p className="text-4xl font-bold text-gray-900 mb-1">{openSurveys}</p>
              <p className="text-sm text-emerald-600 font-medium">Available to complete</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                
                <span className="text-sm font-semibold text-gray-600">Completed</span>
              </div>
              <p className="text-4xl font-bold text-gray-900 mb-1">{completedSurveys}</p>
              <p className="text-sm text-gray-500">Surveys submitted</p>
            </div>

            
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-sm font-semibold text-gray-600">Category:</span>
                <button
                  onClick={() => setFilterCategory('all')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    filterCategory === 'all'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All ({availableSurveys.length})
                </button>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                      filterCategory === cat
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {cat} ({availableSurveys.filter(s => s.category === cat).length})
                  </button>
                ))}
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search surveys..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Surveys Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4">
            {filteredSurveys.map(survey => (
              <div
                key={survey.id}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all hover:border-indigo-300"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-indigo-100 rounded-xl">
                    <survey.icon className="text-indigo-600" size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-bold text-lg text-gray-900 leading-tight">{survey.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(survey.status)}`}>
                        {survey.status}
                      </span>
                    </div>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(survey.category)}`}>
                      {survey.category}
                    </span>
                  </div>
                </div>

                {survey.instructor && (
                  <p className="text-sm text-gray-600 mb-3">
                    <span className="font-medium">Instructor:</span> {survey.instructor}
                  </p>
                )}

                <p className="text-sm text-gray-700 mb-4 line-clamp-2">{survey.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={16} className="text-gray-400" />
                    <span>Deadline: <strong>{survey.deadline}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock size={16} className="text-gray-400" />
                    <span>Estimated time: <strong>{survey.estimatedTime}</strong></span>
                  </div>
                  {survey.status === 'Open' && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                         
                     </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedSurvey(survey);
                      setShowSurveyModal(true);
                    }}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <FileText size={16} />
                    View Details
                  </button>
                  {survey.status === 'Open' && (
                    <button className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                      <ChevronRight size={16} />
                      Start Survey
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Survey Detail Modal */}
          {showSurveyModal && selectedSurvey && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                        <selectedSurvey.icon size={32} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h2 className="text-2xl font-bold">{selectedSurvey.title}</h2>
                          <span className={`px-3 py-1 bg-white/20 text-white text-xs font-semibold rounded-full border border-white/30`}>
                            {selectedSurvey.status}
                          </span>
                        </div>
                        <p className="text-indigo-100">{selectedSurvey.category}</p>
                        {selectedSurvey.instructor && (
                          <p className="text-indigo-200 text-sm mt-1">Instructor: {selectedSurvey.instructor}</p>
                        )}
                      </div>
                    </div>
                    <button 
                      onClick={() => setShowSurveyModal(false)}
                      className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <span className="text-2xl">×</span>
                    </button>
                  </div>
                </div>

                <div className="p-6 overflow-y-auto max-h-[calc(90vh-250px)]">
                  {/* Survey Info */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">About This Survey</h3>
                    <p className="text-gray-700 leading-relaxed">{selectedSurvey.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">Deadline</p>
                      <p className="text-lg font-bold text-gray-900">{selectedSurvey.deadline}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">Estimated Time</p>
                      <p className="text-lg font-bold text-gray-900">{selectedSurvey.estimatedTime}</p>
                    </div>
                  </div>

                  {/* Questions Preview */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Survey Questions ({selectedSurvey.questions.length})</h3>
                    <div className="space-y-2">
                      {selectedSurvey.questions.map((question, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs font-bold">
                            {idx + 1}
                          </span>
                          <p className="text-sm text-gray-700">{question}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedSurvey.status === 'Open' && (
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-900">
                        <strong>Note:</strong> Your responses are anonymous and will help improve the quality of education and services at HSB.
                      </p>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-200 p-6 bg-gray-50">
                  <div className="flex gap-3 justify-end">
                    <button 
                      onClick={() => setShowSurveyModal(false)}
                      className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    >
                      Close
                    </button>
                    {selectedSurvey.status === 'Open' && (
                      <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2">
                        <MessageSquare size={20} />
                        Start Survey
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}  

const Calendars = () => (
    <div className="space-y-3">
      {/* Calendar Header */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">{monthNames[currentMonth]} {currentYear}</h2>
            <p className="text-blue-100">Your schedule at a glance</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
              <ChevronRight size={20} className="rotate-180" />
            </button>
            <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
              Today
            </button>
            <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="bg-white rounded-xl border border-gray-200 p-2 flex gap-2">
        <button
          onClick={() => setCalendarView('month')}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
            calendarView === 'month' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Month View
        </button>
        <button
          onClick={() => setCalendarView('week')}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
            calendarView === 'week' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Week View
        </button>
        <button
          onClick={() => setCalendarView('agenda')}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
            calendarView === 'agenda' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Agenda
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {/* Calendar Grid - 3 columns */}
        <div className="col-span-3">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Day headers */}
              {dayNames.map(day => (
                <div key={day} className="text-center py-2 text-sm font-semibold text-gray-600">
                  {day}
                </div>
              ))}
              
              {/* Empty cells for days before month starts */}
              {Array.from({ length: firstDay }).map((_, idx) => (
                <div key={`empty-${idx}`} className="aspect-square" />
              ))}
              
              {/* Calendar days */}
              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const day = idx + 1;
                const events = getEventsForDate(day);
                const isToday = day === 16;
                
                return (
                  <div
                    key={day}
                    className={`aspect-square border-2 rounded-lg p-2 cursor-pointer transition-all hover:shadow-md ${
                      isToday 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className={`text-sm font-semibold mb-1 ${
                      isToday ? 'text-blue-600' : 'text-gray-900'
                    }`}>
                      {day}
                    </div>
                    <div className="space-y-1">
                      {events.slice(0, 2).map(event => (
                        <div
                          key={event.id}
                          className={`text-xs px-1 py-0.5 rounded truncate ${getEventColor(event.color)} text-white`}
                          title={event.title}
                        >
                          {event.title}
                        </div>
                      ))}
                      {events.length > 2 && (
                        <div className="text-xs text-gray-500 px-1">
                          +{events.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Event Types</h3>
            <div className="grid grid-cols-5 gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm text-gray-600">Classes</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm text-gray-600">Assignments</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span className="text-sm text-gray-600">Exams</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className="text-sm text-gray-600">Office Hours</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-sm text-gray-600">Events</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Today's Schedule */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Schedule</h3>
            <div className="space-y-3">
              {todaysEvents.length > 0 ? (
                todaysEvents.map(event => (
                  <div key={event.id} className={`p-3 rounded-lg border ${getEventBgColor(event.color)}`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-1.5 ${getEventColor(event.color)}`}></div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-gray-900">{event.title}</p>
                        <p className="text-xs text-gray-600 mt-1">
                          <Clock size={12} className="inline mr-1" />
                          {event.time} • {event.duration}
                        </p>
                        <p className="text-xs text-gray-600">📍 {event.location}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No events today</p>
              )}
            </div>
          </div>

          {/* Upcoming This Week */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming This Week</h3>
            <div className="space-y-3">
              {upcomingWeekEvents.slice(0, 5).map(event => (
                <div key={event.id} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className={`w-2 h-2 rounded-full mt-1.5 ${getEventColor(event.color)}`}></div>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-gray-900">{event.title}</p>
                    <p className="text-xs text-gray-600">{event.date} • {event.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full bg-white/20 hover:bg-white/30 rounded-lg p-3 text-left transition-colors">
                <p className="font-medium text-sm">+ Add Event</p>
              </button>
              <button className="w-full bg-white/20 hover:bg-white/30 rounded-lg p-3 text-left transition-colors">
                <p className="font-medium text-sm">Export Calendar</p>
              </button>
              <button className="w-full bg-white/20 hover:bg-white/30 rounded-lg p-3 text-left transition-colors">
                <p className="font-medium text-sm">Sync with Google</p>
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">This Month</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Events</span>
                <span className="text-lg font-bold text-gray-900">{calendarEvents.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Classes</span>
                <span className="text-lg font-bold text-blue-600">
                  {calendarEvents.filter(e => e.type === 'class').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Assignments Due</span>
                <span className="text-lg font-bold text-red-600">
                  {calendarEvents.filter(e => e.type === 'assignment').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Exams</span>
                <span className="text-lg font-bold text-purple-600">
                  {calendarEvents.filter(e => e.type === 'exam').length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

const Activities = () => (
    <div className="">
      {/* Activities Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 p-3">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <Calendar size={24} />
            </div>
          </div>
          <p className="text-blue-100 text-sm font-medium">Registered Events</p>
          <p className="text-3xl font-bold mt-1">{activitiesData.registered.length}</p>
          <p className="text-blue-100 text-xs mt-2">Upcoming activities</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <CheckCircle size={24} className="text-emerald-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm font-medium">Completed</p>
          <p className="text-3xl font-bold mt-1 text-gray-900">{activitiesData.completed.length}</p>
          <p className="text-emerald-600 text-xs mt-2">This semester</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp size={24} className="text-purple-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm font-medium">EC Points Earned</p>
          <p className="text-3xl font-bold mt-1 text-purple-600">{ecLevelProgress.points}</p>
          <p className="text-gray-500 text-xs mt-2">Current level: {ecLevelProgress.current}</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Activity size={24} className="text-orange-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm font-medium">Available Events</p>
          <p className="text-3xl font-bold mt-1 text-gray-900">{activitiesData.available.length}</p>
          <p className="text-gray-500 text-xs mt-2">Open for registration</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 p-3">
        {/* Main Content - Registered & Available Events */}
        <div className="col-span-2 space-y-3">
          {/* EC Level Progress */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">EC Level Progress</h3>
                <p className="text-purple-100 text-sm mt-1">Current: {ecLevelProgress.current} Level</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">{ecLevelProgress.points}</p>
                <p className="text-purple-100 text-sm">EC Points</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Progress to {ecLevelProgress.nextLevel}</span>
                <span>{ecLevelProgress.pointsNeeded} points needed</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <div 
                  className="bg-white h-3 rounded-full transition-all"
                  style={{ width: `${(ecLevelProgress.points / ecLevelProgress.totalForNextLevel) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* My Registered Events (compact) */}
<div className="bg-white rounded-xl border border-gray-200 p-5">
  <h3 className="text-base font-semibold text-gray-900 mb-4">Registered Events</h3>

  <div className="space-y-3">
    {activitiesData.registered.map((event) => (
      <div
        key={event.id}
        className="border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow"
      >
        <div className="flex gap-3 min-w-0">
          {/* Icon column only if provided */}
          

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Header: title + badge */}
            <div className="grid grid-cols-[1fr_auto] items-start gap-2 mb-1.5">
              <div className="min-w-0">
                <h4 className="font-semibold text-gray-900 leading-snug truncate">
                  {event.title}
                </h4>
                <p className="text-xs text-gray-600 mt-0.5">{event.organizer}</p>
              </div>
              <span
                className={`shrink-0 px-2 py-0.5 text-[11px] font-semibold rounded-full border ${getCategoryColor(
                  event.category
                )}`}
              >
                {event.category}
              </span>
            </div>

            {/* Description (tighter) */}
            <p className="text-xs text-gray-600 mb-2 line-clamp-2">
              {event.description}
            </p>

            {/* Time & Location (tighter grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
              <div className="flex items-center gap-1.5 text-xs text-gray-700">
                <Clock size={14} className="text-gray-500" />
                <span>{event.date} • {event.time}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-700">
                <span role="img" aria-label="location">📍</span>
                <span className="truncate">{event.location}</span>
              </div>
            </div>

            {/* Footer: participants, points, actions (compact) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-gray-100">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-600">
                  👥 {event.participants}/{event.maxParticipants}
                </span>
                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 font-semibold rounded">
                  +{event.ecPoints} EC Points
                </span>
              </div>

              <div className="flex gap-1.5">
                <button
                  className="px-3 py-1.5 text-xs text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  View Details
                </button>
                <button
                  className="px-3 py-1.5 text-xs text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>



          {/* Available Events */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Available Events</h3>
              <button className="text-blue-600 text-sm font-medium hover:underline">Browse All</button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {activitiesData.available.map(event => (
                <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full border mb-3 ${getCategoryColor(event.category)}`}>
                    {event.category}
                  </span>
                  <h4 className="font-semibold text-gray-900 mb-2">{event.title}</h4>
                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">{event.description}</p>
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2 text-xs text-gray-700">
                      <Clock size={14} />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-700">
                      <span>📍 {event.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded">
                      +{event.ecPoints} EC
                    </span>
                    <button className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors">
                      Register
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Filter & Search */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Events</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Category</label>
                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>All Categories</option>
                  <option>Academic</option>
                  <option>Professional</option>
                  <option>Community</option>
                  <option>Sports</option>
                  <option>Cultural</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Date Range</label>
                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>All Dates</option>
                  <option>This Week</option>
                  <option>This Month</option>
                  <option>Next Month</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">EC Points</label>
                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>All Points</option>
                  <option>5+ Points</option>
                  <option>10+ Points</option>
                  <option>15+ Points</option>
                </select>
              </div>
            </div>
          </div>

          {/* Completed Events */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Completed Events</h3>
            <div className="space-y-3">
              {activitiesData.completed.map(event => (
                <div key={event.id} className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{event.title}</p>
                      <p className="text-xs text-gray-600">{event.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded">
                      +{event.ecPoints} EC
                    </span>
                    {event.certificateAvailable && (
                      <button className="text-xs text-blue-600 hover:underline font-medium">
                        Download Certificate
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Academic Events</span>
                <span className="text-sm font-bold text-gray-900">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Community Service</span>
                <span className="text-sm font-bold text-gray-900">2</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Professional Dev</span>
                <span className="text-sm font-bold text-gray-900">1</span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-blue-200">
                <span className="text-sm font-semibold text-gray-900">Total Hours</span>
                <span className="text-lg font-bold text-blue-600">28h</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

 
const Finance = () => (
    <div className="">
      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 p-3">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white leading-tight">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <DollarSign size={24} />
            </div>
          </div>
          <p className="text-blue-100 text-s font-medium">Tuition</p>
          <p className="text-xl font-bold mt-1">{formatCurrency(financialData.totalTuition)}</p>
          <p className="text-blue-100 text-xs mt-2">Academic Year 2024-2025</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <CheckCircle size={24} className="text-emerald-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm font-medium">Paid</p>
          <p className="text-xl font-bold mt-1 text-gray-900">{formatCurrency(financialData.totalPaid)}</p>
          <p className="text-emerald-600 text-xs mt-2">75% completed</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertCircle size={24} className="text-red-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm font-medium">Outstanding</p>
          <p className="text-xl font-bold mt-1 text-red-600">{formatCurrency(financialData.outstanding)}</p>
          <p className="text-gray-500 text-xs mt-2">Due by Nov 15</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Award size={24} className="text-purple-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm font-medium">Total Aid</p>
          <p className="text-xl font-bold mt-1 text-purple-600">{formatCurrency(financialData.scholarships + financialData.grants)}</p>
          <p className="text-gray-500 text-xs mt-2">Scholarships & Grants</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 p-3">
        {/* Left Column - Main Content */}
        <div className="col-span-2 space-y-6">
          {/* Outstanding Payments */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Outstanding Payments</h3>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                Make Payment
              </button>
            </div>
            <div className="space-y-4">
              {upcomingPayments.map(payment => (
                <div key={payment.id} className={`p-4 rounded-lg border-l-4 ${
                  payment.status === 'pending' ? 'bg-red-50 border-red-500' : 'bg-gray-50 border-gray-300'
                }`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <p className="font-semibold text-red-600">{payment.description}</p>
                      <p className="text-sm text-gray-600 mt-1">Due Date: {payment.dueDate}</p>
                    </div>
                    {payment.status === 'pending' && (
                      <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                        Due Soon
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold text-red-600">{formatCurrency(payment.amount)}</p>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                      Pay Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fees Breakdown */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Fees Breakdown</h3>
            <div className="space-y-4">
              {feesBreakdown.map((fee, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">{fee.category}</h4>
                    <span className="text-sm text-gray-600">{formatCurrency(fee.amount)}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Paid</span>
                      <span className="font-medium text-emerald-600">{formatCurrency(fee.paid)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Outstanding</span>
                      <span className="font-medium text-red-600">{formatCurrency(fee.outstanding)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-emerald-600 h-2 rounded-full transition-all"
                        style={{ width: `${(fee.paid / fee.amount) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment History */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Payment History</h3>
              <button className="text-blue-600 text-sm font-medium hover:underline">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Description</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Method</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Amount</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paymentHistory.map(payment => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{payment.date}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{payment.description}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{payment.method}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right font-medium">{formatCurrency(payment.amount)}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
                          Paid
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Scholarships & Grants */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-5">
             
              <h3 className="text-lg font-semibold text-gray-900">Scholarships & Grants</h3>
            </div>
            <div className="space-y-3">
              {scholarshipsGrants.map(item => (
                <div key={item.id} className={`p-3 sm:p-4 rounded-lg border-2 ${
                  item.type === 'scholarship' ? 'border-purple-200 bg-purple-50' : 'border-blue-200 bg-blue-50'
                }`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 break-words">
              {item.name}</h4>
                      <p className="text-xs text-gray-600 mt-1">{item.period}</p>
                    </div>

                    

                  </div>
                  <p className="text-xl font-bold text-gray-900 mb-2">{formatCurrency(item.amount)}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Awarded: {item.awarded}</span>
                    {item.renewable && (
                      <span className="text-emerald-600 font-medium">Renewable</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors">
              Apply for More Aid
            </button>
          </div>

          {/* Payment Methods */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
            <div className="space-y-3">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-3">
                 
                  <div>
                    <p className="font-medium text-sm text-gray-900">Bank Transfer</p>
                    <p className="text-xs text-gray-600">HSB Account: 1234567890</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-3">
                  
                  <div>
                    <p className="font-medium text-sm text-gray-900">Credit/Debit Card</p>
                    <p className="text-xs text-gray-600">Visa, Mastercard accepted</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-3">
                  
                  <div>
                    <p className="font-medium text-sm text-gray-900">Cash Payment</p>
                    <p className="text-xs text-gray-600">At Finance Office</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full bg-white/20 hover:bg-white/30 rounded-lg p-3 text-left transition-colors">
                <p className="font-medium text-sm">Request Payment Plan</p>
              </button>
              <button className="w-full bg-white/20 hover:bg-white/30 rounded-lg p-3 text-left transition-colors">
                <p className="font-medium text-sm">Download Receipt</p>
              </button>
              <button className="w-full bg-white/20 hover:bg-white/30 rounded-lg p-3 text-left transition-colors">
                <p className="font-medium text-sm">Contact Finance Office</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
const [selectedRequestType, setSelectedRequestType] = useState<string>('');

// One-Stop: catalog of common forms
const commonForms = [
  { id: 'student-certificate', title: 'Student Certificate', description: 'Request an official student enrollment certificate', icon: '📋', category: 'Academic', department: 'Registrar Office', processingTime: '2-3 days' },
  { id: 'transcript', title: 'Official Transcript', description: 'Request your official academic transcript', icon: '📊', category: 'Academic', department: 'Registrar Office', processingTime: '3-5 days' },
  { id: 'exam-absence', title: 'Exam Absence Request', description: 'Request permission for exam absence with valid reason', icon: '📝', category: 'Academic', department: 'Academic Office', processingTime: '1-2 days' },
  { id: 'grade-appeal', title: 'Grade Appeal', description: 'Appeal a grade or request grade review', icon: '⚖️', category: 'Academic', department: 'Academic Office', processingTime: '5-7 days' },
  { id: 'leave-absence', title: 'Leave of Absence', description: 'Request temporary leave from studies', icon: '🏠', category: 'Student Affairs', department: 'Student Affairs', processingTime: '7-10 days' },
  { id: 'financial-aid', title: 'Financial Aid Request', description: 'Apply for financial assistance or scholarships', icon: '💰', category: 'Finance', department: 'Financial Aid Office', processingTime: '10-14 days' },
  { id: 'info-change', title: 'Personal Info Update', description: 'Request to update personal information', icon: '✏️', category: 'Student Affairs', department: 'Student Affairs', processingTime: '3-5 days' },
  { id: 'class-transfer', title: 'Class Transfer', description: 'Request to transfer to a different class section', icon: '🔄', category: 'Academic', department: 'Academic Office', processingTime: '3-5 days' },
];


const OneStop = () => (
  // One-Stop service state

  <div className="space-y-6 p-3">
    {/* Header */}
    <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-8 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">One-Stop Service Center</h2>
          <p className="text-blue-100">Submit requests and forms to HSB departments</p>
        </div>
        <div className="p-4 bg-white/20 rounded-xl">
          <Bell size={48} />
        </div>
      </div>
    </div>

    {/* Request History */}
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">My Request History</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full" />
              <span className="text-sm text-gray-600">Approved: <span className="font-semibold text-gray-900">8</span></span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full" />
              <span className="text-sm text-gray-600">Processing: <span className="font-semibold text-gray-900">3</span></span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full" />
              <span className="text-sm text-gray-600">Pending: <span className="font-semibold text-gray-900">2</span></span>
            </div>
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>All Status</option>
            <option>Approved</option>
            <option>Processing</option>
            <option>Pending</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Request ID</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Type</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Department</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {[
              { id: '#REQ-2025-1015', type: 'Student Certificate', date: '2025-10-15', dept: 'Registrar Office', status: 'Approved', badge: 'bg-emerald-100 text-emerald-700' },
              { id: '#REQ-2025-1012', type: 'Official Transcript', date: '2025-10-12', dept: 'Registrar Office', status: 'Processing', badge: 'bg-blue-100 text-blue-700' },
              { id: '#REQ-2025-1008', type: 'Exam Absence Request', date: '2025-10-08', dept: 'Academic Office', status: 'Pending', badge: 'bg-orange-100 text-orange-700' },
              { id: '#REQ-2025-1005', type: 'Grade Appeal', date: '2025-10-05', dept: 'Academic Office', status: 'Processing', badge: 'bg-blue-100 text-blue-700' },
              { id: '#REQ-2025-0928', type: 'Financial Aid Request', date: '2025-09-28', dept: 'Financial Aid Office', status: 'Approved', badge: 'bg-emerald-100 text-emerald-700' },
            ].map(row => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{row.id}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{row.type}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{row.date}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{row.dept}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-3 py-1 ${row.badge} text-xs font-semibold rounded-full`}>{row.status}</span>
                </td>
                <td className="px-4 py-3 text-center">
                  <button className="text-blue-600 hover:underline text-sm font-medium">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">Showing 1 to 5 of 13 requests</p>
        <div className="flex gap-2">
          <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">Previous</button>
          <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">1</button>
          <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">2</button>
          <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">3</button>
          <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">Next</button>
        </div>
      </div>
    </div>

    {/* Common Forms */}
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Common Forms & Requests</h3>
            <button className="text-blue-600 text-sm font-medium hover:underline">View All Forms</button>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {commonForms.map(form => (
              <div
                key={form.id}
                className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-all cursor-pointer hover:border-blue-400 hover:bg-blue-50"
                onClick={() => setSelectedRequestType(form.title)}
              >
                <h4 className="font-semibold text-gray-900 text-sm mb-2">{form.title}</h4>
                <div className="space-y-1 mb-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Dept:</span>
                    <span className="font-medium text-gray-700 text-right">{form.department}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Time:</span>
                    <span className="font-medium text-gray-700">{form.processingTime}</span>
                  </div>
                </div>
                <button className="w-full py-1.5 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 transition-colors">
                  Start Request
                </button>
              </div>
            ))}
          </div>
        </div>

        {selectedRequestType && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Submit Request: {selectedRequestType}</h3>
              <button onClick={() => setSelectedRequestType('')} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Full Name</label>
                  <input type="text" defaultValue="Nguyễn Văn A" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Student ID</label>
                  <input type="text" defaultValue="22080000" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Email</label>
                  <input type="email" defaultValue="met22080001@hsb.edu.vn" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Phone Number</label>
                  <input type="tel" defaultValue="0846238088" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Reason for Request <span className="text-red-500">*</span></label>
                <textarea rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Please provide detailed reason for your request..." />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Supporting Documents</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                  <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX, JPG, PNG (max. 10MB)</p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button onClick={() => setSelectedRequestType('')} className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">Cancel</button>
                <button className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">Submit Request</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Help Sidebar */}
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
          <p className="text-sm text-gray-600 mb-4">Contact our support team for assistance</p>
          <div className="space-y-3">
            <div className="bg-white rounded-lg p-3">
              <p className="text-xs font-medium text-gray-700 mb-1">Email</p>
              <p className="text-sm text-blue-600">onestop@hsb.edu.vn</p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <p className="text-xs font-medium text-gray-700 mb-1">Phone</p>
              <p className="text-sm text-blue-600">(+84) 24 3333 4444</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);





/* ---------- Types ---------- */
type Scholarship = {
  id: number;
  name: string;
  type: string;
  amount: string;
  period: string;
  deadline: string;
  status: string;
  description: string;
  requirements: string[];
  benefits: string[];
  applicationStatus: string;
  canApply?: boolean;
  // optional extras
  awardDate?: string;
  sponsor?: string | string[];
};

/* ---------- Component ---------- */
const ScholarshipManagement = () => {
  const [scholarshipFilter, setScholarshipFilter] =
    useState<"all" | "internal" | "external">("all");
  const [selectedScholarship, setSelectedScholarship] =
    useState<Scholarship | null>(null);
  const [showScholarshipModal, setShowScholarshipModal] = useState(false);

  const scholarships: { internal: Scholarship[]; external: Scholarship[] } = {
    internal: [
      {
        id: 1,
        name: "Merit-Based Scholarship",
        type: "Internal - Merit",
        amount: "10,000,000 VND",
        period: "Full Academic Year 2024-2025",
        deadline: "2024-12-31",
        status: "Active",
        description:
          "Awarded to students with exceptional academic performance (GPA ≥ 3.7)",
        requirements: ["GPA ≥ 3.7", "No disciplinary actions", "Full-time enrollment"],
        benefits: [
          "Full tuition coverage for one semester",
          "Priority course registration",
          "Academic advisor access",
        ],
        applicationStatus: "Awarded",
        awardDate: "2024-09-01",
      },
      {
        id: 2,
        name: "Commendation Scholarship",
        type: "Internal - Commendation",
        amount: "5,000,000 VND",
        period: "Semester 1, 2024-2025",
        deadline: "2025-01-15",
        status: "Open",
        description:
          "Recognition for outstanding contributions to university activities and community service",
        requirements: [
          "Active participation in 2+ university clubs",
          "Minimum 20 hours community service",
          "GPA ≥ 3.0",
        ],
        benefits: ["Partial tuition support", "Certificate of recognition", "Resume enhancement"],
        applicationStatus: "Eligible",
        canApply: true,
      },
      {
        id: 3,
        name: "Academic Excellence Award",
        type: "Internal - Merit",
        amount: "15,000,000 VND",
        period: "Full Academic Year 2024-2025",
        deadline: "2024-11-30",
        status: "Closed",
        description:
          "Top performer scholarship for students ranking in top 5% of their cohort",
        requirements: ["Top 5% class ranking", "GPA ≥ 3.9", "Research publication or presentation"],
        benefits: ["Full tuition coverage", "Monthly stipend 2,000,000 VND", "Research fund access"],
        applicationStatus: "Not Applied",
        canApply: false,
      },
    ],
    external: [
      {
        id: 4,
        name: "TechCorp Vietnam Scholarship",
        type: "External - Company Sponsor",
        amount: "20,000,000 VND",
        period: "Full Academic Year 2024-2025",
        deadline: "2025-02-28",
        status: "Open",
        description:
          "Sponsored by TechCorp Vietnam for students pursuing technology and innovation studies",
        requirements: [
          "Technology-related major",
          "GPA ≥ 3.5",
          "Interest in software development",
        ],
        benefits: [
          "Tuition support",
          "Internship opportunity at TechCorp",
          "Mentorship program",
        ],
        applicationStatus: "Under Review",
        sponsor: ["TechCorp Vietnam"],
        canApply: false,
      },
      {
        id: 5,
        name: "ASEAN Future Leaders Fund",
        type: "External - International Funding",
        amount: "$5,000 USD",
        period: "Full Academic Year 2024-2025",
        deadline: "2025-03-15",
        status: "Open",
        description:
          "International scholarship supporting future leaders across Southeast Asia",
        requirements: [
          "ASEAN citizenship",
          "Leadership experience",
          "GPA ≥ 3.6",
          "English proficiency (IELTS 6.5+)",
        ],
        benefits: [
          "Full tuition and living expenses",
          "International conference attendance",
          "Leadership training program",
        ],
        applicationStatus: "Eligible",
        sponsor: ["ASEAN Foundation"],
        canApply: true,
      },
      {
        id: 6,
        name: "VinGroup Talent Scholarship",
        type: "External - Company Sponsor",
        amount: "25,000,000 VND",
        period: "Full Academic Year 2024-2025",
        deadline: "2024-12-20",
        status: "Open",
        description:
          "Premier scholarship for outstanding students in business and technology fields",
        requirements: [
          "Business or Technology major",
          "GPA ≥ 3.8",
          "Demonstrated innovation or entrepreneurship",
        ],
        benefits: [
          "Full tuition coverage",
          "VinGroup internship guarantee",
          "Career development program",
          "Networking events",
        ],
        applicationStatus: "Eligible",
        sponsor: ["VinGroup"],
        canApply: true,
      },
      {
        id: 7,
        name: "HSB Alumni Scholarship",
        type: "External - Alumni Sponsorship",
        amount: "8,000,000 VND",
        period: "Semester 2, 2024-2025",
        deadline: "2025-01-31",
        status: "Open",
        description:
          "Funded by HSB alumni to support current students in financial need with strong academic records",
        requirements: ["Demonstrated financial need", "GPA ≥ 3.3", "Personal statement required"],
        benefits: ["Tuition assistance", "Alumni mentorship", "Career networking opportunities"],
        applicationStatus: "Not Applied",
        sponsor: ["HSB Alumni Association"],
        canApply: true,
      },
      {
        id: 8,
        name: "Samsung Innovation Scholarship",
        type: "External - Partner Scholarship",
        amount: "$3,000 USD",
        period: "Full Academic Year 2024-2025",
        deadline: "2025-02-15",
        status: "Open",
        description: "Partnership scholarship supporting innovation and technology education",
        requirements: ["STEM major", "Innovation project or patent", "GPA ≥ 3.6"],
        benefits: [
          "Financial support",
          "Samsung internship opportunity",
          "Technology training workshops",
        ],
        applicationStatus: "Eligible",
        sponsor: ["Samsung Vietnam"],
        canApply: true,
      },
      {
        id: 9,
        name: "JICA Development Scholarship",
        type: "External - International Funding",
        amount: "$8,000 USD",
        period: "Full Academic Year 2024-2025",
        deadline: "2025-04-30",
        status: "Open",
        description:
          "Japanese International Cooperation Agency scholarship for development studies",
        requirements: [
          "Interest in sustainable development",
          "GPA ≥ 3.5",
          "Japanese language proficiency (preferred)",
        ],
        benefits: [
          "Full tuition and living allowance",
          "Study visit to Japan",
          "Professional network access",
        ],
        applicationStatus: "Eligible",
        sponsor: ["JICA"],
        canApply: true,
      },
      {
        id: 10,
        name: "Chevron STEM Excellence",
        type: "External - Company Sponsor",
        amount: "$4,500 USD",
        period: "Full Academic Year 2024-2025",
        deadline: "2025-02-28",
        status: "Open",
        description:
          "Supporting students pursuing careers in STEM fields with focus on energy sector",
        requirements: [
          "Engineering or Science major",
          "GPA ≥ 3.7",
          "Interest in energy/sustainability",
        ],
        benefits: [
          "Tuition support",
          "Summer internship at Chevron",
          "Industry mentorship",
          "Career placement assistance",
        ],
        applicationStatus: "Not Applied",
        sponsor: ["Chevron Corporation"],
        canApply: true,
      },
    ],
  };

  const allScholarships: Scholarship[] = [
    ...scholarships.internal,
    ...scholarships.external,
  ];

  const filteredScholarships =
    scholarshipFilter === "all"
      ? allScholarships
      : scholarshipFilter === "internal"
      ? scholarships.internal
      : scholarships.external;

  /* ---------- Helpers ---------- */
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Active":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Closed":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getApplicationStatusColor = (status: string) => {
    switch (status) {
      case "Awarded":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Under Review":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "Eligible":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Not Applied":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getTypeIcon = (type: string) => {
    if (type.includes("Merit")) return "🏆";
    if (type.includes("Commendation")) return "⭐";
    if (type.includes("Company")) return "🏢";
    if (type.includes("International")) return "🌍";
    if (type.includes("Partner")) return "🤝";
    if (type.includes("Alumni")) return "🎓";
    return "💰";
  };

  // Stats
  const awardedCount = allScholarships.filter(
    (s) => s.applicationStatus === "Awarded"
  ).length;
  const underReviewCount = allScholarships.filter(
    (s) => s.applicationStatus === "Under Review"
  ).length;
  const eligibleCount = allScholarships.filter(
    (s) => s.applicationStatus === "Eligible"
  ).length;
  const openCount = allScholarships.filter((s) => s.status === "Open").length;

  /* ---------- Render ---------- */
  return (
    <div className="min-h-screen bg-gray-50">
      

      {/* Page content */}
      <div className="mx-auto w-full max-w px-3 lg:px-3 py-3 space-y-6">
        {/* Hero */}
        <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl p-6 md:p-8 text-white shadow-xl">
          <div className="flex items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Your Scholarship Journey</h2>
              <p className="text-purple-100 mb-4">
                Track your applications and discover new opportunities
              </p>
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-purple-200 text-sm">Total Applied</p>
                  <p className="text-3xl font-bold">
                    {awardedCount + underReviewCount}
                  </p>
                </div>
                <div className="w-px h-12 bg-purple-400" />
                <div>
                  <p className="text-purple-200 text-sm">Total Value</p>
                  <p className="text-3xl font-bold">30M VND</p>
                </div>
              </div>
            </div>
           
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-emerald-100 rounded-xl">
                <CheckCircle className="text-emerald-600" size={24} />
              </div>
              <span className="text-sm font-semibold text-gray-600">
                Awarded
              </span>
            </div>
            <p className="text-4xl font-bold text-gray-900 mb-1">
              {awardedCount}
            </p>
            <p className="text-sm text-emerald-600 font-medium">10M VND total</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-amber-100 rounded-xl">
                <Clock className="text-amber-600" size={24} />
              </div>
              <span className="text-sm font-semibold text-gray-600">
                Under Review
              </span>
            </div>
            <p className="text-4xl font-bold text-gray-900 mb-1">
              {underReviewCount}
            </p>
            <p className="text-sm text-gray-500">Pending decision</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Award className="text-blue-600" size={24} />
              </div>
              <span className="text-sm font-semibold text-gray-600">
                Eligible
              </span>
            </div>
            <p className="text-4xl font-bold text-gray-900 mb-1">
              {eligibleCount}
            </p>
            <p className="text-sm text-blue-600 font-medium">Can apply now</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <DollarSign className="text-purple-600" size={24} />
              </div>
              <span className="text-sm font-semibold text-gray-600">
                Available
              </span>
            </div>
            <p className="text-4xl font-bold text-gray-900 mb-1">{openCount}</p>
            <p className="text-sm text-gray-500">Open scholarships</p>
          </div>
        </div>

        {/* Filters/Search */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Filter size={20} className="text-gray-400" />
              {(["all", "internal", "external"] as const).map((k) => (
                <button
                  key={k}
                  onClick={() => setScholarshipFilter(k)}
                  className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${
                    scholarshipFilter === k
                      ? "bg-purple-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {k[0].toUpperCase() + k.slice(1)} (
                  {k === "all"
                    ? allScholarships.length
                    : k === "internal"
                    ? scholarships.internal.length
                    : scholarships.external.length}
                  )
                </button>
              ))}
            </div>
            <div className="relative flex-1 max-w">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search scholarships by name, sponsor, or type..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Scholarships Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredScholarships.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all hover:border-purple-300"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3 flex-1">
                    <span className="text-4xl">{getTypeIcon(s.type)}</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 mb-1 leading-tight">
                        {s.name}
                      </h3>
                      <p className="text-sm text-gray-600">{s.type}</p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                      s.status
                    )}`}
                  >
                    {s.status}
                  </span>
                </div>

                <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                  {s.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <span className="text-sm text-gray-600 font-medium">
                      Amount
                    </span>
                    <span className="font-bold text-purple-600">{s.amount}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={16} className="text-gray-400" />
                    <span>{s.period}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock size={16} className="text-gray-400" />
                    <span>
                      Deadline: <strong>{s.deadline}</strong>
                    </span>
                  </div>
                  {s.sponsor && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Award size={16} className="text-gray-400" />
                      <span>
                        Sponsor:{" "}
                        <strong>
                          {Array.isArray(s.sponsor) ? s.sponsor.join(", ") : s.sponsor}
                        </strong>
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${getApplicationStatusColor(
                      s.applicationStatus
                    )}`}
                  >
                    {s.applicationStatus}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedScholarship(s);
                        setShowScholarshipModal(true);
                      }}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                    >
                      View Details
                    </button>
                    {s.canApply && (
                      <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium shadow-md hover:shadow-lg">
                        Apply Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {showScholarshipModal && selectedScholarship && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <span className="text-5xl">
                      {getTypeIcon(selectedScholarship.type)}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="px-3 py-1 bg-white/20 text-white text-xs font-semibold rounded-full border border-white/30">
                          {selectedScholarship.type}
                        </span>
                        <span className="px-3 py-1 bg-white text-purple-700 text-xs font-semibold rounded-full">
                          {selectedScholarship.status}
                        </span>
                      </div>
                      <h2 className="text-2xl font-bold mb-2">
                        {selectedScholarship.name}
                      </h2>
                      <div className="flex items-center gap-4 text-sm text-white/90 flex-wrap">
                        <span>💰 {selectedScholarship.amount}</span>
                        <span>📅 {selectedScholarship.deadline}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowScholarshipModal(false)}
                    className="ml-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <XCircle size={24} />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-250px)]">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Description
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedScholarship.description}
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Requirements
                  </h3>
                  <ul className="space-y-2">
                    {selectedScholarship.requirements.map((req, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-gray-700"
                      >
                        <CheckCircle
                          size={18}
                          className="text-emerald-500 mt-0.5 flex-shrink-0"
                        />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Benefits
                  </h3>
                  <ul className="space-y-2">
                    {selectedScholarship.benefits.map((benefit, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-gray-700"
                      >
                        <Award
                          size={18}
                          className="text-purple-500 mt-0.5 flex-shrink-0"
                        />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-5">
                  <h3 className="text-sm font-semibold text-purple-900 mb-3">
                    Scholarship Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-purple-700 font-medium">Amount:</span>
                      <span className="text-gray-900 ml-2 font-semibold">
                        {selectedScholarship.amount}
                      </span>
                    </div>
                    <div>
                      <span className="text-purple-700 font-medium">Period:</span>
                      <span className="text-gray-900 ml-2">
                        {selectedScholarship.period}
                      </span>
                    </div>
                    <div>
                      <span className="text-purple-700 font-medium">Deadline:</span>
                      <span className="text-gray-900 ml-2">
                        {selectedScholarship.deadline}
                      </span>
                    </div>
                    <div>
                      <span className="text-purple-700 font-medium">Status:</span>
                      <span className="text-gray-900 ml-2">
                        {selectedScholarship.applicationStatus}
                      </span>
                    </div>
                    {selectedScholarship.sponsor && (
                      <div className="sm:col-span-2">
                        <span className="text-purple-700 font-medium">
                          Sponsor:
                        </span>
                        <span className="text-gray-900 ml-2">
                          {Array.isArray(selectedScholarship.sponsor)
                            ? selectedScholarship.sponsor.join(", ")
                            : selectedScholarship.sponsor}
                        </span>
                      </div>
                    )}
                    {selectedScholarship.awardDate && (
                      <div className="sm:col-span-2">
                        <span className="text-purple-700 font-medium">
                          Award Date:
                        </span>
                        <span className="text-gray-900 ml-2">
                          {selectedScholarship.awardDate}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 p-6 bg-gray-50">
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setShowScholarshipModal(false)}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Close
                  </button>
                  {selectedScholarship.canApply && (
                    <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center gap-2 shadow-md hover:shadow-lg">
                      <FileText size={20} />
                      Apply for Scholarship
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};



{/*Student Card*/}
const Matriculation = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const url = await QRCode.toDataURL("Nguyen Van A | 25080000 | MET | Bachelor | Active ", {
          width: 112,
          margin: 1,
          errorCorrectionLevel: "H",
        });
        if (mounted) setQrCodeUrl(url);
      } catch (err) {
        console.error("QR generation failed:", err);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="min-h-full flex items-center justify-center bg-white">
      <div className="w-full max-w-[420px] sm:max-w-[360px] mx-auto">
        {/* Student Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200">
          {/* Card Header */}
          
{/* Card Header (compact + aligned) */}
<div className="bg-blue-600 px-3 py-2 text-white rounded-t-2xl">
  <div className="flex items-center gap-2">
    {/* Logo */}
    <img
      src="https://i.postimg.cc/Th8cNfKB/HSB-logo-white-singular-no-slogan.png"
      alt="HSB Logo"
      className="w-11 h-11 object-contain"
    />

    {/* Text Block */}
    <div className="leading-snug">
      <h2 className="text-[10.5px] font-bold leading-snug">
        Hanoi School of Business and Management
      </h2>
      <p className="text-blue-100 text-[11px] font-medium leading-tight">
        Student Identification Card (VNU-HSB) </p>
    </div>
  </div>
</div>

{/* Card Body (denser spacing) */}
<div className="px-4 py-1 space-y-1">
  {/* Avatar (smaller) */}
  <div className="flex justify-center mb-2">
    <img
      src="https://i.postimg.cc/tgHhXHK4/hsb-capibara.jpg"
      alt="Photo"
      className="w-40 h-40 rounded-full border-4 border-white shadow-md object-cover"
    />
  </div>

  {/* Info (tighter paddings + smaller labels) */}
  <div className="space-y-2 text-gray-800">
    <div className="border-b border-gray-200 pb-2">
      <p className="text-gray-500 text-[10px] uppercase tracking-wide mb-0.5 font-semibold">Full Name</p>
      <p className="text-sm font-bold text-gray-900">Nguyễn Văn A</p>
    </div>

    <div className="border-b border-gray-200 pb-2">
      <p className="text-gray-500 text-[10px] uppercase tracking-wide mb-0.5 font-semibold">Student ID</p>
      <p className="text-sm font-bold text-gray-900">25080000</p>
    </div>

    <div className="border-b border-gray-200 pb-2">
      <p className="text-gray-500 text-[10px] uppercase tracking-wide mb-0.5 font-semibold">Program</p>
      <p className="text-sm font-bold text-gray-900">Management of Enterprise & Technology</p>
    </div>

    <div className="grid grid-cols-2 gap-3 border-b border-gray-200 pb-2">
      <div>
        <p className="text-gray-500 text-[10px] uppercase tracking-wide mb-0.5 font-semibold">Type</p>
        <p className="text-sm font-bold text-gray-900">Bachelor</p>
      </div>
      <div>
        <p className="text-gray-500 text-[10px] uppercase tracking-wide mb-0.5 font-semibold">Status</p>
        <p className="text-sm font-bold text-emerald-600">Active</p>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-3 items-start">
      <div>
        <p className="text-gray-500 text-[10px] uppercase tracking-wide mb-0.5 font-semibold">Valid Until</p>
        <p className="text-sm font-bold text-gray-900">2030</p>
      </div>
      <div className="flex justify-end">
        <div className="w-24 h-24 bg-white rounded-xl border border-gray-200 flex items-center justify-center p-2 shadow-sm">
          {qrCodeUrl ? (
            <img src={qrCodeUrl} alt="QR Code" className="w-full h-full object-contain" />
          ) : (
            <span className="text-[10px] text-gray-400">Generating…</span>
          )}
        </div>
      </div>
    </div>
  </div>
</div>

          {/* /Card Body */}
        </div>
      </div>
    </div>
  );
};

{/*Render sidebar*/}

return (
  
<div className="flex min-h-screen bg-gray-50">
  {/* Sidebar */}
  <div
    className={`${
      sidebarCollapsed ? 'w-16' : 'w-60'
    } relative bg-slate-800 text-white flex flex-col transition-all duration-300`}
  >
    {/* 1. Controls rail for COLLAPSED view (Appears only when sidebarCollapsed is true) */}
    <div className={`flex flex-col items-center gap-2 p-2 ${sidebarCollapsed ? 'block' : 'hidden'}`}>
      {/* Lock / Unlock */}
      <button
        onClick={() => setSidebarLocked(!sidebarLocked)}
        className="p-1.5 hover:bg-slate-700 rounded transition-colors"
        title={sidebarLocked ? 'Unlock sidebar' : 'Lock sidebar'}
      >
        {sidebarLocked ? (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
          </svg>
        )}
      </button>

      {/* Collapse / Expand (Pointing right when collapsed) */}
      <button
        onClick={() => {
          setSidebarCollapsed(!sidebarCollapsed);
          if (!sidebarCollapsed && !sidebarLocked) setSidebarLocked(true);
        }}
        className="p-1.5 hover:bg-slate-700 rounded transition-colors"
        title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <ChevronRight size={16} className={''} /> 
      </button>
    </div>

    {/* 2. Sidebar header (Expanded View - Appears only when sidebarCollapsed is false) */}
    <div className={`p-4 border-b border-slate-700 ${!sidebarCollapsed ? 'flex items-start justify-between' : 'hidden'}`}>
      {/* Text Content */}
      <div>
        <h1 className="text-2xl font-bold leading-none">HSB ERP</h1>
        <p className="text-slate-400 text-sm mt-1 leading-none">Student Portal</p>
      </div>

      {/* Control Buttons (Aligned with HSB ERP text) */}
      <div className="flex items-center gap-1 ml-4"> 
        {/* Lock / Unlock */}
        <button
          onClick={() => setSidebarLocked(!sidebarLocked)}
          className="p-1.5 hover:bg-slate-700 rounded transition-colors"
          title={sidebarLocked ? 'Unlock sidebar' : 'Lock sidebar'}
        >
          {sidebarLocked ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
            </svg>
          )}
        </button>

        {/* Collapse / Expand (Pointing left when expanded) */}
        <button
          onClick={() => {
            setSidebarCollapsed(!sidebarCollapsed);
            if (!sidebarCollapsed && !sidebarLocked) setSidebarLocked(true);
          }}
          className="p-1.5 hover:bg-slate-700 rounded transition-colors"
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronRight size={16} className={'rotate-180'} />
        </button>
      </div>
    </div>
    
    {/* Navigation Links */}
    <nav className="flex-1 p-4 space-y-1">
      {[
        { id: 'dashboard', icon: Home, label: 'Dashboard' },
        { id: 'profile', icon: User, label: 'My Profile' },
        { id: 'library', icon: BookOpen, label: 'Online Library' },
        { id: 'academic', icon: BookOpen, label: 'Academic' },
        { id: 'feedback', icon: Send, label: 'Feedback' },
        { id: 'finance', icon: DollarSign, label: 'Finance' },
        { id: 'activities', icon: Activity, label: 'Activities' },
        { id: 'calendar', icon: Calendar, label: 'Calendar' },
        { id: 'canvas', icon: BookOpen, label: 'Canvas/LMS' },
        { id: 'onestop', icon: Bell, label: 'One-Stop Service' },
        { id: 'documents', icon: Notebook, label: 'Documents' },
        
        { id: 'scholarship', icon: Gem, label: 'Scholarship' },
        { id: 'matriculation', icon: User, label: 'Identity' },
      ].map(item => (
        <button
          key={item.id}
          onClick={() => setActivePage(item.id)}
          title={item.label} 
          className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center px-2' : 'justify-start px-4 gap-3'} py-3 rounded-lg transition-colors ${
            activePage === item.id ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-700/50'
          }`}
        >
          <item.icon size={20} className="flex-shrink-0" />
          <span className={`${sidebarCollapsed ? 'sr-only' : 'inline'}`}>{item.label}</span>
        </button>
      ))}
    </nav>

    {/* User Profile Footer */}
    {/* User Profile Footer */}
<div className="p-4 border-t border-slate-700">
  <div
    className={`flex items-center px-4 py-3 overflow-hidden
      ${sidebarCollapsed ? 'justify-center gap-0' : 'justify-start gap-3'}`}
  >
    {/* Avatar: do not allow shrinking */}
    <div className="w-12 h-12 rounded-full  flex items-center justify-center font-semibold shrink-0">
   <img
      src="https://i.postimg.cc/tgHhXHK4/hsb-capibara.jpg" 
      alt="Student Photo"
      className="w-12 h-12 rounded-full border-4 border-white shadow-md object-cover"
    />    </div>

    {/* Text: collapse width when sidebarCollapsed */}
    <div
      className={`transition-all duration-200 overflow-hidden whitespace-nowrap
        ${sidebarCollapsed ? 'w-0 opacity-0 pointer-events-none select-none' : 'w-auto opacity-100'}`}
    >
      <p className="font-medium text-sm">Nguyễn Văn A</p>
      <p className="text-slate-400 text-xs">ID: 22080000</p>
    </div>
  </div>
</div>

  </div>

  {/* Main Content Area */}
  <div className="flex-1 flex flex-col overflow-hidden">
    <main className="flex-1 p-2 w-full space-y-6 overflow-visible min-h-screen">
      {/* ... Content rendering based on activePage ... */}
      {activePage === 'dashboard' && <Dashboard />}
      {activePage === 'profile' && <Profile />}
      {activePage === 'library' && <LibraryViewer />}
      {activePage === 'academic' && <Academic />}
      {activePage === 'feedback' && <StudentFeedbackPortal />}
      {activePage === 'finance' && <Finance />}
      {activePage === 'activities' && <Activities />}
      {activePage === 'calendar' && <Calendars />}
      {activePage === 'scholarship' && <ScholarshipManagement />}
      {activePage === 'canvas' && (
        <Canvas
          canvasSidebarOpen={canvasSidebarOpen}
          setCanvasSidebarOpen={setCanvasSidebarOpen}
          canvasTab={canvasTab}
          setCanvasTab={setCanvasTab}
          selectedCourse={selectedCourse}
          setSelectedCourse={setSelectedCourse}
          courseSection={courseSection}
          setCourseSection={setCourseSection}
        />
      )}
      {activePage === 'onestop' && <OneStop />}
      {activePage === 'documents' && <Documents />}
      {activePage === 'matriculation' && <Matriculation />}
    </main>
  </div>
</div>
  );
}