import React, { useState } from 'react';
import { Home, User, BookOpen, DollarSign, Activity, Calendar, Bell, Search, 
  ChevronRight, TrendingUp, Clock, CheckCircle, AlertCircle, Mail, Phone, 
  CreditCard, Edit3, Briefcase, Award, Globe, LockIcon, UnlockIcon, ChevronLeftIcon } from 'lucide-react';

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
        ecPoints: 10,
        image: '🎯'
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
        ecPoints: 5,
        image: '💼'
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
        ecPoints: 15,
        image: '🤝'
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
        ecPoints: 8,
        image: '🤖'
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
        ecPoints: 12,
        image: '⚽'
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
        ecPoints: 10,
        image: '🎭'
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
        ecPoints: 20,
        image: '🚀'
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
        certificateAvailable: true,
        image: '💻'
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
        certificateAvailable: true,
        image: '🌊'
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

  const renderAcademic = () => (
    <div className="space-y-6">
      {/* Sub Navigation Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 p-2">
        <div className="flex gap-2">
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
          <div className="grid grid-cols-4 gap-6">
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

      <div className="grid grid-cols-3 gap-6">
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
                <p className="font-medium text-sm">Download Transcript</p>
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
              Download Transcript (PDF)
            </button>
            <button className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print
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

  const renderCanvas = () => (
    <div className="space-y-6">
      {/* Canvas Header */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">HSB Canvas / LMS</h2>
            <p className="text-blue-100">Learning Management System</p>
          </div>
          <div className="p-4 bg-white/20 rounded-xl">
            <BookOpen size={48} />
          </div>
        </div>
      </div>

      {/* Placeholder Content */}
      <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
            <BookOpen size={48} className="text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Canvas / LMS Integration</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            This section will integrate with the university's Learning Management System (Canvas) to provide access to course materials, 
            assignments, discussions, grades, and learning resources.
          </p>
          
          <div className="grid grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
            <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <BookOpen size={24} className="text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Course Materials</h4>
              <p className="text-sm text-gray-600">Access lectures, readings, and resources</p>
            </div>
            
            <div className="p-6 bg-purple-50 rounded-lg border border-purple-200">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <CheckCircle size={24} className="text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Assignments</h4>
              <p className="text-sm text-gray-600">Submit work and track deadlines</p>
            </div>
            
            <div className="p-6 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <TrendingUp size={24} className="text-emerald-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Grades & Feedback</h4>
              <p className="text-sm text-gray-600">View grades and instructor feedback</p>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Connect to Canvas
            </button>
            <button className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Coming Soon Features</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <CheckCircle size={20} className="text-emerald-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Course Content Access</p>
                <p className="text-sm text-gray-600">View all course materials and lectures</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle size={20} className="text-emerald-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Assignment Submission</p>
                <p className="text-sm text-gray-600">Submit assignments directly through the platform</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle size={20} className="text-emerald-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Discussion Boards</p>
                <p className="text-sm text-gray-600">Participate in class discussions and forums</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle size={20} className="text-emerald-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Video Lectures</p>
                <p className="text-sm text-gray-600">Watch recorded lectures and tutorials</p>
              </div>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Integration Benefits</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-sm font-bold">1</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Centralized Learning Hub</p>
                <p className="text-sm text-gray-600">All your courses in one place</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-sm font-bold">2</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Real-time Updates</p>
                <p className="text-sm text-gray-600">Get notified of new content and announcements</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-sm font-bold">3</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Mobile Access</p>
                <p className="text-sm text-gray-600">Learn anywhere, anytime</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-sm font-bold">4</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Progress Tracking</p>
                <p className="text-sm text-gray-600">Monitor your learning progress</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );

  const renderCalendar = () => (
    <div className="space-y-6">
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

      <div className="grid grid-cols-4 gap-6">
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

  const renderActivities = () => (
    <div className="space-y-6">
      {/* Activities Overview */}
      <div className="grid grid-cols-4 gap-6">
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

      <div className="grid grid-cols-3 gap-6">
        {/* Main Content - Registered & Available Events */}
        <div className="col-span-2 space-y-6">
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

          {/* My Registered Events */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">My Registered Events</h3>
            <div className="space-y-4">
              {activitiesData.registered.map(event => (
                <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex gap-4">
                    <div className="text-4xl">{event.image}</div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900">{event.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{event.organizer}</p>
                        </div>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getCategoryColor(event.category)}`}>
                          {event.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Clock size={16} />
                          <span>{event.date} • {event.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <span>📍 {event.location}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-gray-600">👥 {event.participants}/{event.maxParticipants}</span>
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 font-semibold rounded">
                            +{event.ecPoints} EC Points
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button className="px-4 py-2 text-sm text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            View Details
                          </button>
                          <button className="px-4 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
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
                  <div className="text-3xl mb-3">{event.image}</div>
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
                    <span className="text-xl">{event.image}</span>
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

  const renderFinance = () => (
    <div className="space-y-6">
      {/* Financial Overview Cards */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <DollarSign size={24} />
            </div>
          </div>
          <p className="text-blue-100 text-sm font-medium">Total Tuition</p>
          <p className="text-2xl font-bold mt-1">{formatCurrency(financialData.totalTuition)}</p>
          <p className="text-blue-100 text-xs mt-2">Academic Year 2024-2025</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <CheckCircle size={24} className="text-emerald-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm font-medium">Total Paid</p>
          <p className="text-2xl font-bold mt-1 text-gray-900">{formatCurrency(financialData.totalPaid)}</p>
          <p className="text-emerald-600 text-xs mt-2">75% completed</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertCircle size={24} className="text-red-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm font-medium">Outstanding Balance</p>
          <p className="text-2xl font-bold mt-1 text-red-600">{formatCurrency(financialData.outstanding)}</p>
          <p className="text-gray-500 text-xs mt-2">Due by Nov 15</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Award size={24} className="text-purple-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm font-medium">Total Aid</p>
          <p className="text-2xl font-bold mt-1 text-purple-600">{formatCurrency(financialData.scholarships + financialData.grants)}</p>
          <p className="text-gray-500 text-xs mt-2">Scholarships & Grants</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
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
                      <p className="font-semibold text-gray-900">{payment.description}</p>
                      <p className="text-sm text-gray-600 mt-1">Due Date: {payment.dueDate}</p>
                    </div>
                    {payment.status === 'pending' && (
                      <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                        Due Soon
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(payment.amount)}</p>
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
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Award size={20} className="text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Scholarships & Grants</h3>
            </div>
            <div className="space-y-4">
              {scholarshipsGrants.map(item => (
                <div key={item.id} className={`p-4 rounded-lg border-2 ${
                  item.type === 'scholarship' ? 'border-purple-200 bg-purple-50' : 'border-blue-200 bg-blue-50'
                }`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm">{item.name}</h4>
                      <p className="text-xs text-gray-600 mt-1">{item.period}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      item.type === 'scholarship' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {item.type === 'scholarship' ? 'Scholarship' : 'Grant'}
                    </span>
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
                  <div className="p-2 bg-blue-100 rounded">
                    <CreditCard size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-900">Bank Transfer</p>
                    <p className="text-xs text-gray-600">HSB Account: 1234567890</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded">
                    <CreditCard size={20} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-900">Credit/Debit Card</p>
                    <p className="text-xs text-gray-600">Visa, Mastercard accepted</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded">
                    <DollarSign size={20} className="text-emerald-600" />
                  </div>
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
const renderOneStop = () => (
  // One-Stop service state

  <div className="space-y-6">
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

  const renderDashboard = () => (
    <div>
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <BookOpen size={24} />
            </div>
            <TrendingUp size={20} className="text-white/80" />
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

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Upcoming Activities & Events</h3>
              <button className="text-blue-600 text-sm font-medium hover:underline">View Calendar</button>
            </div>
            <div className="space-y-4">
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

  const renderProfile = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-8 text-white">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl font-bold border-4 border-white/30">
              NA
            </div>
            <div>
              <div className="flex items-center gap-4 mb-2">
                <h2 className="text-3xl font-bold">Nguyễn Văn A</h2>
                <div className="flex items-center gap-3 px-4 py-2 bg-white/20 rounded-lg">
                  <div className="text-center border-r border-white/30 pr-3">
                    <p className="text-xs text-blue-100 mb-1">GPA</p>
                    <p className="text-xl font-bold">3.45</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-blue-100 mb-1">EC Level</p>
                    <p className="text-sm font-semibold">Excellent</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-blue-100">
                <div className="flex items-center gap-2">
                  <CreditCard size={18} />
                  <span>22080000</span>
                </div>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                  Internship
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-blue-600"></span>
            </button>
            <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg flex items-center gap-2 transition-colors">
              <Edit3 size={18} />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-6 gap-4 pt-6 border-t border-white/20">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Mail size={18} />
              </div>
              <div>
                <p className="text-blue-100 text-xs">Email</p>
                <p className="font-medium text-sm">met22080001@hsb.edu.vn</p>
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Phone size={18} />
              </div>
              <div>
                <p className="text-blue-100 text-xs">Phone</p>
                <p className="font-medium text-sm">0846238088</p>
              </div>
            </div>
          </div>
          <div>
            <p className="text-blue-100 text-xs mb-1">Program</p>
            <p className="font-semibold">MET</p>
          </div>
          <div>
            <p className="text-blue-100 text-xs mb-1">Cohort</p>
            <p className="font-semibold">QH-2022-D</p>
          </div>
          <div>
            <p className="text-blue-100 text-xs mb-1">Current Semester</p>
            <p className="font-semibold">5</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
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

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
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

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Additional Information</h3>
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

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Status</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Current Status</label>
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  Internship
                </span>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Enrollment Date</label>
                <p className="text-gray-500 italic">Not specified</p>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Leave Start Date</label>
                <p className="text-gray-500 italic">Not applicable</p>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Leave End Date</label>
                <p className="text-gray-500 italic">Not applicable</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Briefcase size={20} className="text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Internship</h3>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Company</label>
                <p className="text-gray-500 italic">Not assigned</p>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Status</label>
                <p className="text-gray-500 italic">Pending</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Globe size={20} className="text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Overseas Exchange</h3>
            </div>
            <p className="text-gray-500 italic">No exchange program</p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-200 p-6">
            <div className="flex items-center gap-3 mb-4">
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

  return (

    
<div className="flex h-screen bg-gray-50">
  {/* Sidebar */}
  <div
    className={`${
      sidebarCollapsed ? 'w-16' : 'w-64'
    } relative bg-slate-800 text-white flex flex-col transition-all duration-300`}
  >
    {/* Controls rail that retracts with the panel */}
    <div className="flex items-center gap-1 justify-end">
      {/* Lock / Unlock */}
      <button
        onClick={toggleLock}
        title={sidebarLocked ? 'Unlock panel' : 'Lock panel'}
        className="p-2 rounded-lg border border-white/20 bg-white/10 hover:bg-white/20"
      >
        {sidebarLocked ? <LockIcon size={16} /> : <UnlockIcon size={16} />}
      </button>

      {/* Collapse / Expand */}
      <button
        onClick={toggleCollapse}
        title={
          sidebarCollapsed
            ? 'Expand panel'
            : sidebarLocked
            ? 'Unlock to collapse'
            : 'Collapse panel'
        }
        className={`p-2 rounded-lg border ${
          sidebarLocked
            ? 'border-white/20 opacity-50 cursor-not-allowed'
            : 'border-white/60 bg-slate-800 hover:bg-slate-700'
        }`}
      >
        {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeftIcon size={16} />}
      </button>
    </div>

    {/* Sidebar header */}
    <div className="p-4 border-b border-slate-700">
      <div className={sidebarCollapsed ?  'hidden' : 'block'}>
    <h1 className="text-2xl font-bold leading-none">HSB ERP</h1>
    <p className="text-slate-400 text-sm mt-1 leading-none">Student Portal</p>
  </div>
    </div>

    {/* ...keep your <nav> here ... */}


        
        <nav className="flex-1 p-4 space-y-1">
          {[
            { id: 'dashboard', icon: Home, label: 'Dashboard' },
            { id: 'profile', icon: User, label: 'My Profile' },
            { id: 'academic', icon: BookOpen, label: 'Academic' },
            { id: 'finance', icon: DollarSign, label: 'Finance' },
            { id: 'activities', icon: Activity, label: 'Activities' },
            { id: 'calendar', icon: Calendar, label: 'Calendar' },
            { id: 'canvas', icon: BookOpen, label: 'Canvas/LMS' },
            { id: 'onestop', icon: Bell, label: 'One-Stop Service' },
          ].map(item => (
            <button
  key={item.id}
  onClick={() => setActivePage(item.id)}
  title={item.label} // tooltip when collapsed
  className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center px-2' : 'justify-start px-4 gap-3'} py-3 rounded-lg transition-colors ${
    activePage === item.id ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-700/50'
  }`}
>
  <item.icon size={20} className="flex-shrink-0" />
  <span className={`${sidebarCollapsed ? 'sr-only' : 'inline'}`}>{item.label}</span>
</button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center font-semibold">
              NA
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">Nguyễn Văn A</p>
              <p className="text-slate-400 text-xs">ID: 22080000</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto p-8">
          {activePage === 'dashboard' ? renderDashboard() : 
           activePage === 'profile' ? renderProfile() : 
           activePage === 'academic' ? renderAcademic() :
           activePage === 'finance' ? renderFinance() :
           activePage === 'activities' ? renderActivities() :
           activePage === 'calendar' ? renderCalendar() :
           activePage === 'canvas' ? renderCanvas() :
           activePage === 'onestop' ? renderOneStop() :
           renderDashboard()}
        </main>
      </div>
    </div>
  );
}