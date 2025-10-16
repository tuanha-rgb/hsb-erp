import React, { useState } from 'react';

import { 
  ChevronDown, ChevronRight, Users, GraduationCap, BookOpen, Calendar,
DollarSign, FileText, Award, Clock, Building, Globe, Briefcase,
MessageSquare, Settings, BarChart3, TrendingUp, UserCheck, Home,
Search, Plus, ArrowRight, Bell, AlertTriangle, TrendingDown,
AlertCircle, Download, Filter, PieChart, ArrowUpRight, ArrowDownRight,
Target, MapPin, Star, CheckCircle, XCircle, Upload, Eye, Edit, Check, X, User
} from 'lucide-react';
function renderValue(v: unknown): React.ReactNode {
  if (v == null) return null;
  if (React.isValidElement(v)) return v;
  const t = typeof v;
  if (t === 'string' || t === 'number' || t === 'boolean') return String(v);
  if (Array.isArray(v)) return v.map((x, i) => <span key={i}>{renderValue(x)}</span>);
  // fallback: stringify objects (or refine this for specific shapes)
  try { return typeof v === 'object' ? JSON.stringify(v) : String(v); } catch { return String(v); }
}
const ERPLayout = () => {
  const [userType, setUserType] = useState('admin');
  const [expandedMenus, setExpandedMenus] = useState({});
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarLocked, setSidebarLocked] = useState(true);

  const toggleMenu = (menu) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  const navigationConfig = {
    admin: [
      { id: 'dashboard', label: 'Dashboard', icon: Home },
      {
        id: 'students', label: 'Students', icon: GraduationCap,
        submenu: [
          { id: 'student-services', label: 'Student Overview' },
          { id: 'student-profile', label: 'Student Profile' },
          { id: 'tuition-fees', label: 'Tuition Fees' },
          { id: 'gpa', label: 'GPA' },
          { id: 'training-score', label: 'Extra C. Score' },
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
          { id: 'grade-management', label: 'Grade Management' },
          { id: 'student-management', label: 'Student Management' },
          { id: 'view-rankings', label: 'View Rankings' },
          { id: 'curriculum-management', label: 'Curriculum Management' },
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
    ]
  };

  const currentNav = navigationConfig[userType] || navigationConfig.admin;

  const StatCard = ({ title, value, change, icon: Icon, bgColor, iconColor }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-transform hover:scale-105 hover:shadow-md cursor-pointer">
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-green-600 mt-2">{change}</p>
    </div>
  );

 
const AdminDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('last-year');
  const [selectedEarningsPeriod, setSelectedEarningsPeriod] = useState('last-semester');

  // Key Metrics
  const keyMetrics = {
    students: { current: 5699, change: 8.5, label: 'Students' },
    lecturers: { current: 297, change: 4.2, label: 'Lecturers' },
    publications: { current: 1248, change: 12.3, label: 'Publications' },
    revenue: { current: 87395000, change: 15.7, label: 'Revenue' }
  };

  // Academic Performance Data (Last 4 Years)
  const academicPerformance = [
    { year: '2021', value: 78, label: '2021' },
    { year: '2022', value: 82, label: '2022' },
    { year: '2023', value: 88, label: '2023' },
    { year: '2024', value: 75, label: '2024' },
    { year: '2025', value: 85, label: '2025' }
  ];

  // Earnings Data (Last Semester)
  const earningsData = [
    { month: 'Jan', amount: 8200000 },
    { month: 'Feb', amount: 7800000 },
    { month: 'Mar', amount: 8500000 },
    { month: 'Apr', amount: 9100000 },
    { month: 'May', amount: 8900000 },
    { month: 'Jun', amount: 9300000 }
  ];

  // Messages
  const messages = [
    { name: 'Susan Grey', message: 'Department meeting this...', time: '2:00 PM', avatar: 'SG' },
    { name: 'Jordan Kim', message: 'Found another accessing...', time: '11:30 AM', avatar: 'JK' },
    { name: 'Dean Richard Neal', message: 'Please join us in...', time: '10:00 AM', avatar: 'DR' }
  ];

  // Students Distribution
  const studentDistribution = {
    total: 2500,
    undergraduate: 2000,
    graduate: 250,
    doctoral: 50
  };

  // Student Activities
  const studentActivities = [
    { name: 'Math Olympiad', status: 'Gold Medal', icon: '🏆', color: 'bg-yellow-100' },
    { name: 'Project Showcase', status: 'Best Award', icon: '🚀', color: 'bg-blue-100' },
    { name: 'Volunteer Day', status: 'Lead Organizer', icon: '❤️', color: 'bg-red-100' }
  ];

  // Department Performance
  const departmentPerformance = [
    { name: 'FOM', students: 892, budget: 12500000, utilization: 78, performance: 92 },
    { name: 'FOMAC', students: 1245, budget: 15800000, utilization: 85, performance: 88 },
    { name: 'FONS', students: 756, budget: 9800000, utilization: 72, performance: 90 },
    { name: 'INS', students: 1089, budget: 11200000, utilization: 81, performance: 87 },
    { name: 'ITM', students: 623, budget: 6400000, utilization: 68, performance: 85 }
  ];

  // Faculty Stats
  const facultyStats = {
    totalFaculty: 297,
    fullTime: 245,
    partTime: 52,
    withPhD: 223,
    avgExperience: 12.5
  };

  // Research Metrics
  const researchMetrics = {
    activeProjects: 156,
    totalGrants: 18920000,
    publications: 1248,
    citations: 8945
  };

  const formatCurrency = (amount) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const MetricCard = ({ icon: Icon, label, value, change, color }) => {
    const isPositive = change > 0;
    
    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center`}>
            <Icon className="w-6 h-6 text-gray-700" />
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-1">{label}</p>
        <p className="text-3xl font-bold text-gray-900 mb-2">
          {label === 'Revenue' ? formatCurrency(value) : formatNumber(value)}
        </p>
        
        <div className={`flex items-center gap-1 text-sm font-semibold ${
          isPositive ? 'text-green-600' : 'text-red-600'
        }`}>
          {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          <span>{isPositive ? '+' : ''}{change}% vs last year</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-1">HSB Dashboard</h1>
          <p className="text-gray-600">October 15, 2025</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Search className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <span className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <MetricCard 
          icon={Users}
          label="Students"
          value={keyMetrics.students.current}
          change={keyMetrics.students.change}
          color="bg-blue-100"
        />
        <MetricCard 
          icon={GraduationCap}
          label="Lecturers"
          value={keyMetrics.lecturers.current}
          change={keyMetrics.lecturers.change}
          color="bg-purple-100"
        />
        <MetricCard 
          icon={BookOpen}
          label="Publications"
          value={keyMetrics.publications.current}
          change={keyMetrics.publications.change}
          color="bg-green-100"
        />
        <MetricCard 
          icon={DollarSign}
          label="Revenue"
          value={keyMetrics.revenue.current}
          change={keyMetrics.revenue.change}
          color="bg-orange-100"
        />
      </div>

      {/* Academic Performance & Earnings */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* Academic Performance */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Academic Performance</h2>
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="last-year">Last 4 Year</option>
              <option value="this-year">This Year</option>
              <option value="all-time">All Time</option>
            </select>
          </div>
          
          <div className="h-64 flex items-end justify-between gap-3">
            {academicPerformance.map((item, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full relative" style={{ height: '220px' }}>
                  <div 
                    className="w-full absolute bottom-0 bg-gradient-to-t from-green-400 to-green-300 rounded-t-lg hover:from-green-500 hover:to-green-400 cursor-pointer transition-all"
                    style={{ height: `${(item.value / 100) * 220}px` }}
                    title={`Performance: ${item.value}%`}
                  ></div>
                </div>
                <span className="text-xs font-medium text-gray-600">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Earnings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Earnings</h2>
            <select 
              value={selectedEarningsPeriod}
              onChange={(e) => setSelectedEarningsPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="last-semester">Last Semester</option>
              <option value="this-semester">This Semester</option>
              <option value="this-year">This Year</option>
            </select>
          </div>

          <div className="space-y-4">
            {earningsData.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{item.month}</span>
                <div className="flex items-center gap-3 flex-1 mx-4">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-400 to-green-400 h-2 rounded-full"
                      style={{ width: `${(item.amount / 10000000) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm font-bold text-gray-900">{formatCurrency(item.amount)}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Semester</span>
              <span className="text-xl font-bold text-green-600">
                {formatCurrency(earningsData.reduce((sum, item) => sum + item.amount, 0))}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages, Students, Student Activity */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* Messages */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Messages</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All
            </button>
          </div>

          <div className="space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-sm font-semibold text-gray-700">
                  {msg.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{msg.name}</p>
                  <p className="text-sm text-gray-600 truncate">{msg.message}</p>
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap">{msg.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Students Distribution */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Students</h2>
          </div>

          <div className="flex items-center justify-center mb-6">
            <div className="relative w-48 h-48">
              {/* Donut Chart */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Undergraduate - Blue */}
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="15"
                  strokeDasharray={`${(studentDistribution.undergraduate / studentDistribution.total) * 220} 220`}
                  strokeDashoffset="0"
                />
                {/* Graduate - Green */}
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="15"
                  strokeDasharray={`${(studentDistribution.graduate / studentDistribution.total) * 220} 220`}
                  strokeDashoffset={`-${(studentDistribution.undergraduate / studentDistribution.total) * 220}`}
                />
                {/* Doctoral - Purple */}
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  fill="none"
                  stroke="#8b5cf6"
                  strokeWidth="15"
                  strokeDasharray={`${(studentDistribution.doctoral / studentDistribution.total) * 220} 220`}
                  strokeDashoffset={`-${((studentDistribution.undergraduate + studentDistribution.graduate) / studentDistribution.total) * 220}`}
                />
              </svg>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-3xl font-bold text-gray-900">{formatNumber(studentDistribution.total)}</p>
                <p className="text-sm text-gray-600">Total</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Undergraduate</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">{formatNumber(studentDistribution.undergraduate)}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Graduate</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">{formatNumber(studentDistribution.graduate)}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Doctoral</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">{formatNumber(studentDistribution.doctoral)}</span>
            </div>
          </div>
        </div>

        {/* Student Activity */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Student Activity</h2>
          </div>

          <div className="space-y-4">
            {studentActivities.map((activity, i) => (
              <div key={i} className={`p-4 ${activity.color} rounded-lg border border-gray-200`}>
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{activity.icon}</div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{activity.name}</p>
                    <p className="text-sm text-gray-600">{activity.status}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            View All Activities
          </button>
        </div>
      </div>

      {/* Department Performance */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Department Performance</h2>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
            View Details
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Department</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Students</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Budget</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Utilization</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Performance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {departmentPerformance.map((dept, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-gray-900">{dept.name}</td>
                  <td className="px-6 py-4 text-right text-gray-700">{formatNumber(dept.students)}</td>
                  <td className="px-6 py-4 text-right text-gray-700">{formatCurrency(dept.budget)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${dept.utilization}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-gray-700 w-10 text-right">{dept.utilization}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${dept.performance}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-gray-700 w-10 text-right">{dept.performance}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Faculty & Research Stats */}
      <div className="grid grid-cols-2 gap-6">
        {/* Faculty Statistics */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Faculty Statistics</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-600 mb-1">Total Faculty</p>
              <p className="text-3xl font-bold text-blue-900">{formatNumber(facultyStats.totalFaculty)}</p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-sm text-gray-600 mb-1">Full-Time</p>
              <p className="text-3xl font-bold text-purple-900">{formatNumber(facultyStats.fullTime)}</p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-gray-600 mb-1">With Ph.D.</p>
              <p className="text-3xl font-bold text-green-900">{formatNumber(facultyStats.withPhD)}</p>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <p className="text-sm text-gray-600 mb-1">Avg Experience</p>
              <p className="text-3xl font-bold text-orange-900">{facultyStats.avgExperience} yrs</p>
            </div>
          </div>
        </div>

        {/* Research Metrics */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Research Metrics</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <p className="text-sm text-gray-600 mb-1">Active Projects</p>
              <p className="text-3xl font-bold text-indigo-900">{formatNumber(researchMetrics.activeProjects)}</p>
            </div>

            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <p className="text-sm text-gray-600 mb-1">Total Grants</p>
              <p className="text-3xl font-bold text-emerald-900">{formatCurrency(researchMetrics.totalGrants)}</p>
            </div>

            <div className="p-4 bg-cyan-50 rounded-lg border border-cyan-200">
              <p className="text-sm text-gray-600 mb-1">Publications</p>
              <p className="text-3xl font-bold text-cyan-900">{formatNumber(researchMetrics.publications)}</p>
            </div>

            <div className="p-4 bg-rose-50 rounded-lg border border-rose-200">
              <p className="text-sm text-gray-600 mb-1">Citations</p>
              <p className="text-3xl font-bold text-rose-900">{formatNumber(researchMetrics.citations)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

  const StudentDashboard = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
      <div className="grid grid-cols-4 gap-6">
        <StatCard title="GPA" value="3.45" change="↑ 0.12 vs last semester" icon={TrendingUp} bgColor="bg-blue-100" iconColor="text-blue-600" />
        <StatCard title="Active Courses" value="6" change="Current semester" icon={BookOpen} bgColor="bg-green-100" iconColor="text-green-600" />
        <StatCard title="Attendance" value="92%" change="↑ 3% vs last semester" icon={UserCheck} bgColor="bg-purple-100" iconColor="text-purple-600" />
        <StatCard title="Projects" value="8" change="5 completed, 3 ongoing" icon={Briefcase} bgColor="bg-orange-100" iconColor="text-orange-600" />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Current Courses</h3>
          <div className="space-y-3">
            {[
              {code: 'CS301', name: 'Data Structures', progress: 75},
              {code: 'CS302', name: 'Database Systems', progress: 60},
              {code: 'CS303', name: 'Software Engineering', progress: 80}
            ].map((course, i) => (
              <div key={i} className="p-4 border rounded-lg">
                <div className="flex justify-between mb-2">
                  <div>
                    <p className="font-semibold text-sm">{course.name}</p>
                    <p className="text-xs text-gray-500">{course.code}</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{width: `${course.progress}%`}}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Upcoming Deadlines</h3>
          <div className="space-y-3">
            {[
              {course: 'CS301', task: 'Assignment 3', date: 'Oct 18'},
              {course: 'CS302', task: 'Project Proposal', date: 'Oct 20'},
              {course: 'CS303', task: 'Midterm Exam', date: 'Oct 25'}
            ].map((item, i) => (
              <div key={i} className="p-4 border rounded-lg">
                <div className="flex justify-between">
                  <div>
                    <p className="font-semibold text-sm">{item.task}</p>
                    <p className="text-xs text-gray-600">{item.course}</p>
                  </div>
                  <p className="text-sm font-semibold">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const LecturerDashboard = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Lecturer Dashboard</h1>
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <button className="p-2 bg-gray-50 rounded-lg"><ArrowRight className="w-5 h-5" /></button>
          </div>
          <p className="text-sm text-gray-500 mb-1">Teaching Hours</p>
          <p className="text-2xl font-bold text-gray-900">480h</p>
          <p className="text-xs text-green-600 mt-2">Total cumulative</p>
          <p className="text-xs text-gray-600 mt-1">Workload: 16h/week</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <button className="p-2 bg-gray-50 rounded-lg"><ArrowRight className="w-5 h-5" /></button>
          </div>
          <p className="text-sm text-gray-500 mb-1">Publications</p>
          <p className="text-2xl font-bold text-gray-900 mb-2">8</p>
          <p className="text-xs text-gray-600">Papers: 5 & Patents: 3</p>
        </div>
        <StatCard title="Community Hours" value="120h" change="This academic year" icon={Users} bgColor="bg-purple-100" iconColor="text-purple-600" />
        <StatCard title="Active Projects" value="5" change="2 completed this year" icon={Briefcase} bgColor="bg-orange-100" iconColor="text-orange-600" />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">My Courses</h3>
          <div className="space-y-3">
            {[
              {code: 'CS401', name: 'Introduction to AI', students: 65},
              {code: 'CS501', name: 'Machine Learning', students: 58},
              {code: 'CS601', name: 'Deep Learning', students: 42}
            ].map((course, i) => (
              <div key={i} className="p-4 border rounded-lg">
                <div className="flex justify-between">
                  <div>
                    <p className="font-semibold text-sm">{course.name}</p>
                    <p className="text-xs text-gray-500">{course.code}</p>
                  </div>
                  <p className="text-sm font-semibold text-blue-600">{course.students}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Pending Tasks</h3>
          <div className="space-y-3">
            {[
              {task: 'Grade submission - CS401', deadline: 'Oct 20', priority: 'high'},
              {task: 'Syllabus update - CS501', deadline: 'Oct 25', priority: 'medium'},
              {task: 'Thesis review', deadline: 'Oct 30', priority: 'medium'}
            ].map((item, i) => (
              <div key={i} className="p-4 border rounded-lg">
                <p className="font-semibold text-sm">{item.task}</p>
                <p className="text-xs text-gray-600 mt-1">Due: {item.deadline}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const FacultyDashboard = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Faculty Dashboard</h1>
      <div className="grid grid-cols-4 gap-6">
        <StatCard title="KPI 1: Student Success Rate" value="94%" change="↑ 2% vs last year" icon={TrendingUp} bgColor="bg-blue-100" iconColor="text-blue-600" />
        <StatCard title="KPI 2: Research Output" value="156" change="Publications this year" icon={FileText} bgColor="bg-green-100" iconColor="text-green-600" />
        <StatCard title="KPI 3: Faculty Satisfaction" value="4.2/5.0" change="↑ 0.3 vs last year" icon={Award} bgColor="bg-purple-100" iconColor="text-purple-600" />
        <StatCard title="KPI 4: Budget Efficiency" value="88%" change="On track" icon={DollarSign} bgColor="bg-orange-100" iconColor="text-orange-600" />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Faculty Overview</h3>
          <div className="p-4 bg-blue-50 rounded-lg mb-4">
            <p className="text-sm text-gray-600">Total Faculty Members</p>
            <p className="text-2xl font-bold text-gray-900">45</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600">Average Teaching Load</p>
            <p className="text-2xl font-bold text-gray-900">14.5h/week</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Student Performance</h3>
          <div className="p-4 bg-blue-50 rounded-lg mb-4">
            <p className="text-sm text-gray-600">Average GPA</p>
            <p className="text-2xl font-bold text-gray-900">3.28</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600">Retention Rate</p>
            <p className="text-2xl font-bold text-gray-900">96%</p>
          </div>
        </div>
      </div>
    </div>
  );

const DepartmentOverview = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [timeRange, setTimeRange] = useState('month');

  const departments = [
    {
      id: 'hr',
      name: 'Human Resources',
      head: 'Ms. Nguyen Thi Mai',
      faculty: 12,
      students: 0,
      courses: 0,
      budget: '$450,000',
      utilization: 88,
      satisfaction: 4.3,
      research: 0,
      status: 'good',
      color: 'blue'
    },
    {
      id: 'irs',
      name: 'International Relation & Science',
      head: 'Dr. Tran Van Minh',
      faculty: 15,
      students: 0,
      courses: 0,
      budget: '$520,000',
      utilization: 85,
      satisfaction: 4.4,
      research: 45,
      status: 'good',
      color: 'green'
    },
    {
      id: 'admin-it',
      name: 'Admin & IT',
      head: 'Mr. Le Duc Anh',
      faculty: 18,
      students: 0,
      courses: 0,
      budget: '$680,000',
      utilization: 92,
      satisfaction: 4.5,
      research: 0,
      status: 'excellent',
      color: 'purple'
    },
    {
      id: 'academic',
      name: 'Academic Affairs',
      head: 'Dr. Pham Thi Lan',
      faculty: 22,
      students: 0,
      courses: 0,
      budget: '$590,000',
      utilization: 90,
      satisfaction: 4.6,
      research: 12,
      status: 'excellent',
      color: 'orange'
    },
    {
      id: 'finance',
      name: 'Finance & Accounting',
      head: 'Mr. Hoang Van Tuan',
      faculty: 16,
      students: 0,
      courses: 0,
      budget: '$540,000',
      utilization: 87,
      satisfaction: 4.2,
      research: 0,
      status: 'good',
      color: 'pink'
    },
    {
      id: 'fom',
      name: 'FOM',
      head: 'Dr. Nguyen Van Hung',
      faculty: 38,
      students: 980,
      courses: 42,
      budget: '$1,120,000',
      utilization: 89,
      satisfaction: 4.4,
      research: 98,
      status: 'good',
      color: 'blue'
    },
    {
      id: 'fomac',
      name: 'FOMAC',
      head: 'Dr. Bui Thi Ngoc',
      faculty: 35,
      students: 850,
      courses: 38,
      budget: '$1,050,000',
      utilization: 86,
      satisfaction: 4.3,
      research: 87,
      status: 'good',
      color: 'green'
    },
    {
      id: 'fons',
      name: 'FONS',
      head: 'Dr. Le Van Cuong',
      faculty: 45,
      students: 1200,
      courses: 48,
      budget: '$1,280,000',
      utilization: 93,
      satisfaction: 4.7,
      research: 156,
      status: 'excellent',
      color: 'purple'
    },
    {
      id: 'ins',
      name: 'INS',
      head: 'Dr. Dao Van Hai',
      faculty: 28,
      students: 720,
      courses: 32,
      budget: '$890,000',
      utilization: 84,
      satisfaction: 4.2,
      research: 72,
      status: 'good',
      color: 'orange'
    },
    {
      id: 'itm',
      name: 'ITM',
      head: 'Dr. Tran Thi Hoa',
      faculty: 32,
      students: 820,
      courses: 36,
      budget: '$980,000',
      utilization: 88,
      satisfaction: 4.5,
      research: 94,
      status: 'good',
      color: 'pink'
    },
    {
      id: 'cei',
      name: 'CEI',
      head: 'Dr. Pham Van Long',
      faculty: 25,
      students: 640,
      courses: 28,
      budget: '$820,000',
      utilization: 82,
      satisfaction: 4.1,
      research: 58,
      status: 'good',
      color: 'blue'
    }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'excellent': return 'bg-green-100 text-green-700 border-green-300';
      case 'good': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'warning': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'critical': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getDepartmentColor = (color) => {
    switch(color) {
      case 'blue': return 'from-blue-400 to-blue-600';
      case 'green': return 'from-green-400 to-green-600';
      case 'purple': return 'from-purple-400 to-purple-600';
      case 'orange': return 'from-orange-400 to-orange-600';
      case 'pink': return 'from-pink-400 to-pink-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const totalFaculty = departments.reduce((sum, dept) => sum + dept.faculty, 0);
  const totalStudents = departments.reduce((sum, dept) => sum + dept.students, 0);
  const totalCourses = departments.reduce((sum, dept) => sum + dept.courses, 0);
  const avgSatisfaction = (departments.reduce((sum, dept) => sum + dept.satisfaction, 0) / departments.length).toFixed(1);

  const filteredDepartments = selectedDepartment === 'all' 
    ? departments 
    : departments.filter(d => d.id === selectedDepartment);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Department Overview</h1>
            <p className="text-sm text-gray-500 mt-1">Comprehensive analytics and performance metrics across all departments</p>
          </div>
          <div className="flex items-center gap-3">
            <select 
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
              Export Report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-1">Total Departments</p>
            <p className="text-3xl font-bold text-gray-900">11</p>
            <p className="text-xs text-green-600 mt-2">All active</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-1">Total Personnels</p>
            <p className="text-3xl font-bold text-gray-900">120</p>
            <p className="text-xs text-gray-600 mt-2">Faculty and staff</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-1">Total Students</p>
            <p className="text-3xl font-bold text-gray-900">2,600</p>
            <div className="mt-2 space-y-0.5">
              <p className="text-xs text-gray-600">Full-time: 2,300</p>
              <p className="text-xs text-gray-600">Part-time: 300</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-1">Avg Satisfaction</p>
            <p className="text-3xl font-bold text-gray-900">{avgSatisfaction}<span className="text-lg text-gray-500">/5.0</span></p>
            <p className="text-xs text-green-600 mt-2">↑ 0.3 vs last period</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Department Performance</h3>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {departments.slice(0, 5).map((dept) => (
                <div key={dept.id}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">{dept.name}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(dept.status)}`}>
                      {dept.status}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full bg-gradient-to-r ${getDepartmentColor(dept.color)}`}
                      style={{width: `${dept.utilization}%`}}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{dept.utilization}% utilization</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Key Metrics Overview</h3>
              <span className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Courses</span>
                  <span className="text-2xl font-bold text-gray-900">{totalCourses}</span>
                </div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Research Projects</span>
                  <span className="text-2xl font-bold text-gray-900">587</span>
                </div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Faculty-Student Ratio</span>
                  <span className="text-2xl font-bold text-gray-900">1:{Math.round(totalStudents/totalFaculty)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Faculties and Centers</h3>
              <Building className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {departments.filter(d => ['fom', 'fomac', 'fons', 'ins', 'itm'].includes(d.id)).map((dept) => (
                <div key={dept.id}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">{dept.name}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(dept.status)}`}>
                      {dept.status}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full bg-gradient-to-r ${getDepartmentColor(dept.color)}`}
                      style={{width: `${dept.utilization}%`}}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{dept.utilization}% utilization</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Department Details</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Department Head</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Faculty</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Students</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Courses</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Budget</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Research</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Satisfaction</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDepartments.map((dept) => (
                  <tr key={dept.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 bg-gradient-to-br ${getDepartmentColor(dept.color)} rounded-lg flex items-center justify-center`}>
                          <Building className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{dept.name}</p>
                          <p className="text-xs text-gray-500">{dept.utilization}% utilization</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-900">{dept.head}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-sm font-semibold text-gray-900">{dept.faculty}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-sm font-semibold text-gray-900">{dept.students}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-sm font-semibold text-gray-900">{dept.courses}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-sm font-semibold text-gray-900">{dept.budget}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-sm font-semibold text-gray-900">{dept.research}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Award className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-semibold text-gray-900">{dept.satisfaction}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(dept.status)}`}>
                        {dept.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-6">Budget Distribution</h3>
            <div className="space-y-4">
              {departments.map((dept, i) => {
                const budgetAmount = parseInt(dept.budget.replace(/[^0-9]/g, ''));
                const maxBudget = 1300000;
                const percentage = (budgetAmount / maxBudget) * 100;
                return (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">{dept.name}</span>
                      <span className="text-sm font-bold text-gray-900">{dept.budget}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full bg-gradient-to-r ${getDepartmentColor(dept.color)}`}
                        style={{width: `${Math.min(percentage, 100)}%`}}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-6">Research Output Comparison</h3>
            <div className="space-y-4">
              {departments.filter(d => ['fons', 'fom', 'fomac', 'ins'].includes(d.id)).map((dept, i) => {
                const maxResearch = 160;
                const percentage = (dept.research / maxResearch) * 100;
                return (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">{dept.name}</span>
                      <span className="text-sm font-bold text-gray-900">{dept.research}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full bg-gradient-to-r ${getDepartmentColor(dept.color)}`}
                        style={{width: `${percentage}%`}}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

  const DepartmentDashboard = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Department Dashboard</h1>
      <div className="grid grid-cols-4 gap-6">
        <StatCard title="Total Employees" value="48" change="↑ 3 new this month" icon={Users} bgColor="bg-blue-100" iconColor="text-blue-600" />
        <StatCard title="Work Hours" value="1,920h" change="This month" icon={Clock} bgColor="bg-green-100" iconColor="text-green-600" />
        <StatCard title="Department KPIs" value="89%" change="↑ 4% vs last month" icon={TrendingUp} bgColor="bg-purple-100" iconColor="text-purple-600" />
        <StatCard title="Facilities" value="85" change="78 occupied, 3 available" icon={Building} bgColor="bg-orange-100" iconColor="text-orange-600" />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Employee Overview</h3>
          <div className="p-4 bg-blue-50 rounded-lg mb-4">
            <p className="text-sm text-gray-600">Active Employees</p>
            <p className="text-2xl font-bold text-gray-900">45</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600">On Leave</p>
            <p className="text-2xl font-bold text-gray-900">3</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Upcoming Events</h3>
          <div className="space-y-3">
            {[
              {event: 'All-Staff Meeting', date: 'Oct 18', time: '10:00 AM'},
              {event: 'Training Workshop', date: 'Oct 22', time: '2:00 PM'}
            ].map((item, i) => (
              <div key={i} className="p-3 border rounded-lg">
                <p className="font-semibold text-sm">{item.event}</p>
                <p className="text-xs text-gray-500 mt-1">{item.date} at {item.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

const FinanceOverview = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('current');
  const [selectedView, setSelectedView] = useState('summary');

  interface MetricValue {
  current: number;
  previous: number;
  target: number;
}

interface MetricCardProps {
  title: string;
  value: MetricValue;
  icon: React.ElementType;
  format?: 'currency' | 'percentage';
}

const FinanceMetricCards: React.FC = () => {
  const financialMetrics: Record<string, MetricValue> = {
    totalRevenue: { current: 87395000, previous: 75840000, target: 92000000 },
    totalExpenses: { current: 68245000, previous: 62100000, target: 70000000 },
    netIncome: { current: 19150000, previous: 13740000, target: 22000000 },
    operatingMargin: { current: 21.9, previous: 18.1, target: 23.9 }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercent = (value: number): string => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const calculateChange = (current: number, previous: number): number => {
    return ((current - previous) / previous) * 100;
  };

  const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon: Icon, format = 'currency' }) => {
    const changeValue = calculateChange(value.current, value.previous);
    const targetProgress = (value.current / value.target) * 100;
    const isPositive = changeValue > 0;

    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
            isPositive ? 'bg-green-50' : 'bg-red-50'
          }`}>
            <Icon className={`w-7 h-7 ${isPositive ? 'text-green-600' : 'text-red-600'}`} />
          </div>
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
            isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {formatPercent(changeValue)}
          </div>
        </div>

        <h3 className="text-sm text-gray-600 mb-2">{title}</h3>
        <p className="text-3xl font-bold text-gray-900 mb-3">
          {format === 'currency' ? formatCurrency(value.current) : `${value.current.toFixed(1)}%`}
        </p>

        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-600">
            <span>Target: {format === 'currency' ? formatCurrency(value.target) : `${value.target.toFixed(1)}%`}</span>
            <span className={targetProgress >= 95 ? 'text-green-600 font-semibold' : 'text-orange-600 font-semibold'}>
              {targetProgress.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${targetProgress >= 95 ? 'bg-green-500' : 'bg-orange-500'}`}
              style={{ width: `${Math.min(targetProgress, 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500">
            vs Previous: {format === 'currency' ? formatCurrency(value.previous) : `${value.previous.toFixed(1)}%`}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="grid grid-cols-4 gap-6">
        <MetricCard 
          title="Total Revenue" 
          value={financialMetrics.totalRevenue}
          icon={DollarSign}
        />
        <MetricCard 
          title="Total Expenses" 
          value={financialMetrics.totalExpenses}
          icon={TrendingDown}
        />
        <MetricCard 
          title="Net Income" 
          value={financialMetrics.netIncome}
          icon={TrendingUp}
        />
        <MetricCard 
          title="Operating Margin" 
          value={financialMetrics.operatingMargin}
          icon={PieChart}
          format="percentage"
        />
      </div>
    </div>
  );
};

  const financialMetrics = {
    totalRevenue: { current: 87395000, previous: 75840000, target: 92000000 },
    totalExpenses: { current: 68245000, previous: 62100000, target: 70000000 },
    netIncome: { current: 19150000, previous: 13740000, target: 22000000 },
    operatingMargin: { current: 21.9, previous: 18.1, target: 23.9 }
  };

  const revenueBreakdown = [
    { category: 'Tuition Fees', amount: 52450000, percentage: 60, change: 8.5, target: 55000000, status: 'on-track' },
    { category: 'Research Grants', amount: 18920000, percentage: 21.6, change: 12.3, target: 20000000, status: 'on-track' },
    { category: 'Endowment Income', amount: 8750000, percentage: 10, change: 15.7, target: 9000000, status: 'on-track' },
    { category: 'Short-term Training', amount: 4380000, percentage: 5, change: 22.4, target: 4500000, status: 'on-track' },
    { category: 'Other Income', amount: 2895000, percentage: 3.4, change: 5.2, target: 3500000, status: 'at-risk' }
  ];

  const expenseBreakdown = [
    { category: 'Salaries & Benefits', amount: 42850000, percentage: 62.8, change: 6.2, budget: 44000000, status: 'under-budget' },
    { category: 'Research Expenses', amount: 12340000, percentage: 18.1, change: 14.8, budget: 13000000, status: 'under-budget' },
    { category: 'Facilities & Maintenance', amount: 6890000, percentage: 10.1, change: 8.5, budget: 7000000, status: 'under-budget' },
    { category: 'Technology & Equipment', amount: 3420000, percentage: 5, change: 18.2, budget: 3500000, status: 'under-budget' },
    { category: 'Administrative Costs', amount: 2745000, percentage: 4, change: 3.8, budget: 2500000, status: 'over-budget' }
  ];

  const tuitionMetrics = {
    totalCollected: 52450000,
    outstanding: 3240000,
    collectionRate: 94.2,
    totalEnrolled: 5699,
    avgTuitionPerStudent: 9200,
    scholarshipAwarded: 8920000
  };

  const cashFlowData = [
    { month: 'Jan', inflow: 8200000, outflow: 6800000 },
    { month: 'Feb', inflow: 7800000, outflow: 6500000 },
    { month: 'Mar', inflow: 8500000, outflow: 7200000 },
    { month: 'Apr', inflow: 9100000, outflow: 6900000 },
    { month: 'May', inflow: 8900000, outflow: 7100000 },
    { month: 'Jun', inflow: 9300000, outflow: 7400000 },
    { month: 'Jul', inflow: 6500000, outflow: 5200000 },
    { month: 'Aug', inflow: 10200000, outflow: 8100000 },
    { month: 'Sep', inflow: 9800000, outflow: 7600000 },
    { month: 'Oct', inflow: 9500000, outflow: 7300000 }
  ];

  const budgetUtilization = [
    { department: 'Computer Science', budget: 12500000, spent: 8920000, percentage: 71.4, status: 'on-track' },
    { department: 'Business Admin', budget: 9800000, spent: 7450000, percentage: 76.0, status: 'on-track' },
    { department: 'Engineering', budget: 11200000, spent: 9340000, percentage: 83.4, status: 'at-risk' },
    { department: 'Sciences', budget: 8600000, spent: 6780000, percentage: 78.8, status: 'on-track' },
    { department: 'Arts & Humanities', budget: 6400000, spent: 4920000, percentage: 76.9, status: 'on-track' },
    { department: 'Administration', budget: 15800000, spent: 13450000, percentage: 85.1, status: 'at-risk' }
  ];

  const alerts = [
    { type: 'warning', message: 'Administrative costs 9.8% over budget', priority: 'high', time: '2 hours ago' },
    { type: 'success', message: 'Research grant revenue exceeded target by 12%', priority: 'medium', time: '5 hours ago' },
    { type: 'info', message: 'Q3 financial report ready for review', priority: 'medium', time: '1 day ago' },
    { type: 'warning', message: 'Tuition outstanding balance increased by 15%', priority: 'high', time: '2 days ago' }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercent = (value) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const calculateChange = (current, previous) => {
    return ((current - previous) / previous) * 100;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'on-track':
      case 'under-budget':
        return 'text-green-600 bg-green-100';
      case 'at-risk':
      case 'over-budget':
        return 'text-orange-600 bg-orange-100';
      case 'critical':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-blue-600 bg-blue-100';
    }
  };

  const MetricCard = ({ title, value, change, target, icon: Icon, format = 'currency' }) => {
    const changeValue = calculateChange(value.current, value.previous);
    const targetProgress = (value.current / value.target) * 100;
    const isPositive = changeValue > 0;

    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
            isPositive ? 'bg-green-100' : 'bg-red-100'
          }`}>
            <Icon className={`w-6 h-6 ${isPositive ? 'text-green-600' : 'text-red-600'}`} />
          </div>
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
            isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {formatPercent(changeValue)}
          </div>
        </div>

        <h3 className="text-sm text-gray-600 mb-2">{title}</h3>
        <p className="text-3xl font-bold text-gray-900 mb-3">
          {format === 'currency' ? formatCurrency(value.current) : `${value.current.toFixed(1)}%`}
        </p>

        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-600">
            <span>Target: {format === 'currency' ? formatCurrency(value.target) : `${value.target.toFixed(1)}%`}</span>
            <span className={targetProgress >= 100 ? 'text-green-600 font-semibold' : 'text-orange-600 font-semibold'}>
              {targetProgress.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${targetProgress >= 100 ? 'bg-green-500' : 'bg-orange-500'}`}
              style={{ width: `${Math.min(targetProgress, 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500">vs Previous: {format === 'currency' ? formatCurrency(value.previous) : `${value.previous.toFixed(1)}%`}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Finance Overview</h1>
            <p className="text-gray-600">Academic Year 2024-2025 • Last updated: Oct 15, 2025, 10:30 AM</p>
          </div>
          <div className="flex items-center gap-3">
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="current">Current Year</option>
              <option value="ytd">Year to Date</option>
              <option value="quarter">This Quarter</option>
              <option value="month">This Month</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium">
              <Filter size={18} />
              Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
              <Download size={18} />
              Export Report
            </button>
          </div>
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">Financial Alerts ({alerts.length})</h3>
                <div className="grid grid-cols-2 gap-2">
                  {alerts.map((alert, i) => (
                    <div key={i} className={`p-3 rounded-lg border ${
                      alert.type === 'warning' ? 'bg-orange-50 border-orange-200' :
                      alert.type === 'success' ? 'bg-green-50 border-green-200' :
                      'bg-blue-50 border-blue-200'
                    }`}>
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm text-gray-900 flex-1">{alert.message}</p>
                        <span className="text-xs text-gray-500 whitespace-nowrap">{alert.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>


      {/* Revenue & Expenses Overview */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Revenue Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Revenue Breakdown</h2>
            <span className="text-2xl font-bold text-green-600">{formatCurrency(financialMetrics.totalRevenue.current)}</span>
          </div>
          
          <div className="space-y-4">
            {revenueBreakdown.map((item, i) => (
              <div key={i} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="font-semibold text-gray-900">{item.category}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(item.status)}`}>
                    {item.status.replace('-', ' ')}
                  </span>
                </div>
                
                <div className="ml-5 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Amount: {formatCurrency(item.amount)}</span>
                    <span className="text-green-600 font-semibold flex items-center gap-1">
                      <ArrowUpRight size={14} />
                      {formatPercent(item.change)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Target: {formatCurrency(item.target)}</span>
                    <span>{((item.amount / item.target) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${Math.min((item.amount / item.target) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Expense Breakdown</h2>
            <span className="text-2xl font-bold text-red-600">{formatCurrency(financialMetrics.totalExpenses.current)}</span>
          </div>
          
          <div className="space-y-4">
            {expenseBreakdown.map((item, i) => (
              <div key={i} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <span className="font-semibold text-gray-900">{item.category}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(item.status)}`}>
                    {item.status.replace('-', ' ')}
                  </span>
                </div>
                
                <div className="ml-5 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Spent: {formatCurrency(item.amount)}</span>
                    <span className={`font-semibold flex items-center gap-1 ${
                      item.status === 'over-budget' ? 'text-red-600' : 'text-blue-600'
                    }`}>
                      {item.status === 'over-budget' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                      {formatPercent(item.change)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Budget: {formatCurrency(item.budget)}</span>
                    <span>{((item.amount / item.budget) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${item.status === 'over-budget' ? 'bg-red-500' : 'bg-blue-500'}`}
                      style={{ width: `${Math.min((item.amount / item.budget) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tuition & Cash Flow */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* Tuition Metrics */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Tuition Metrics</h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Total Collected</p>
              <p className="text-2xl font-bold text-green-700">{formatCurrency(tuitionMetrics.totalCollected)}</p>
            </div>

            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Outstanding Balance</p>
              <p className="text-2xl font-bold text-orange-700">{formatCurrency(tuitionMetrics.outstanding)}</p>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Collection Rate</p>
                <p className="text-xl font-bold text-blue-700">{tuitionMetrics.collectionRate}%</p>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${tuitionMetrics.collectionRate}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 border border-gray-200 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Enrolled Students</p>
                <p className="text-lg font-bold text-gray-900">{tuitionMetrics.totalEnrolled.toLocaleString()}</p>
              </div>
              <div className="p-3 border border-gray-200 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Avg Tuition</p>
                <p className="text-lg font-bold text-gray-900">{formatCurrency(tuitionMetrics.avgTuitionPerStudent)}</p>
              </div>
            </div>

            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Scholarships Awarded</p>
              <p className="text-xl font-bold text-purple-700">{formatCurrency(tuitionMetrics.scholarshipAwarded)}</p>
              <p className="text-xs text-gray-600 mt-1">
                {((tuitionMetrics.scholarshipAwarded / tuitionMetrics.totalCollected) * 100).toFixed(1)}% of tuition revenue
              </p>
            </div>
          </div>
        </div>

        {/* Cash Flow */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 col-span-2">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Cash Flow Analysis (10 Months)</h2>
          
          <div className="h-80 flex items-end justify-between gap-2 mb-4">
            {cashFlowData.map((month, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full relative" style={{ height: '280px' }}>
                  <div 
                    className="w-full absolute bottom-0 bg-green-500 rounded-t hover:bg-green-600 cursor-pointer transition-colors"
                    style={{ height: `${(month.inflow / 10500000) * 280}px` }}
                    title={`Inflow: ${formatCurrency(month.inflow)}`}
                  >
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-green-700 whitespace-nowrap">
                      {formatCurrency(month.inflow / 1000000)}M
                    </div>
                  </div>
                  <div 
                    className="w-full absolute bottom-0 bg-red-500 opacity-60 rounded-t hover:opacity-80 cursor-pointer transition-opacity"
                    style={{ height: `${(month.outflow / 10500000) * 280}px` }}
                    title={`Outflow: ${formatCurrency(month.outflow)}`}
                  ></div>
                </div>
                <span className="text-xs font-semibold text-gray-600">{month.month}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-8 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm text-gray-700 font-medium">Cash Inflow</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-sm text-gray-700 font-medium">Cash Outflow</span>
            </div>
            <div className="px-4 py-2 bg-blue-50 rounded-lg">
              <span className="text-sm text-gray-600">Net Cash Flow: </span>
              <span className="text-sm font-bold text-blue-700">
                {formatCurrency(cashFlowData.reduce((sum, m) => sum + (m.inflow - m.outflow), 0))}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Budget Utilization by Department */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Budget Utilization by Department</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">As of October 2025 (83% of fiscal year)</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Department</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Annual Budget</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Spent</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Remaining</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Utilization</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {budgetUtilization.map((dept, i) => {
                const remaining = dept.budget - dept.spent;
                const isOverpacing = dept.percentage > 83;
                
                return (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-900">{dept.department}</td>
                    <td className="px-6 py-4 text-right text-gray-700">{formatCurrency(dept.budget)}</td>
                    <td className="px-6 py-4 text-right font-semibold text-gray-900">{formatCurrency(dept.spent)}</td>
                    <td className="px-6 py-4 text-right text-gray-700">{formatCurrency(remaining)}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                        isOverpacing ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {dept.percentage.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(dept.status)}`}>
                        {dept.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full ${isOverpacing ? 'bg-orange-500' : 'bg-blue-500'}`}
                          style={{ width: `${Math.min(dept.percentage, 100)}%` }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-gray-50 border-t-2 border-gray-300">
              <tr className="font-bold">
                <td className="px-6 py-4 text-gray-900">TOTAL</td>
                <td className="px-6 py-4 text-right text-gray-900">
                  {formatCurrency(budgetUtilization.reduce((sum, d) => sum + d.budget, 0))}
                </td>
                <td className="px-6 py-4 text-right text-gray-900">
                  {formatCurrency(budgetUtilization.reduce((sum, d) => sum + d.spent, 0))}
                </td>
                <td className="px-6 py-4 text-right text-gray-900">
                  {formatCurrency(budgetUtilization.reduce((sum, d) => sum + (d.budget - d.spent), 0))}
                </td>
                <td className="px-6 py-4 text-center text-gray-900">
                  {((budgetUtilization.reduce((sum, d) => sum + d.spent, 0) / 
                     budgetUtilization.reduce((sum, d) => sum + d.budget, 0)) * 100).toFixed(1)}%
                </td>
                <td colSpan={2} className="px-6 py-4"></td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm font-semibold text-green-900">Under Budget</span>
            </div>
            <p className="text-2xl font-bold text-green-700">4 Departments</p>
            <p className="text-xs text-green-600 mt-1">Total savings: {formatCurrency(2450000)}</p>
          </div>

          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-semibold text-orange-900">At Risk</span>
            </div>
            <p className="text-2xl font-bold text-orange-700">2 Departments</p>
            <p className="text-xs text-orange-600 mt-1">Need monitoring</p>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-semibold text-blue-900">Avg Utilization</span>
            </div>
            <p className="text-2xl font-bold text-blue-700">78.6%</p>
            <p className="text-xs text-blue-600 mt-1">Expected: 83% at this point</p>
          </div>
        </div>
      </div>

      {/* Financial Health Indicators */}
      <div className="grid grid-cols-4 gap-6 mb-8 mt-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <PieChart className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Liquidity Ratio</p>
              <p className="text-2xl font-bold text-gray-900">2.4</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Current Assets / Liabilities</span>
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Healthy</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Revenue Growth</p>
              <p className="text-2xl font-bold text-gray-900">15.2%</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Year over Year</span>
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Strong</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Debt to Equity</p>
              <p className="text-2xl font-bold text-gray-900">0.45</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Total Debt / Total Equity</span>
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Low Risk</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">ROI</p>
              <p className="text-2xl font-bold text-gray-900">18.7%</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Return on Investment</span>
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Excellent</span>
          </div>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Key Performance Indicators (KPIs)</h2>
        
        <div className="grid grid-cols-3 gap-6">
          <div className="border-l-4 border-blue-500 pl-4">
            <p className="text-sm text-gray-600 mb-2">Cost per Student</p>
            <p className="text-3xl font-bold text-gray-900 mb-1">{formatCurrency(11972)}</p>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600">vs Target: {formatCurrency(12500)}</span>
              <span className="text-green-600 font-semibold flex items-center gap-1">
                <ArrowDownRight size={14} />
                4.2% under
              </span>
            </div>
          </div>

          <div className="border-l-4 border-green-500 pl-4">
            <p className="text-sm text-gray-600 mb-2">Revenue per Student</p>
            <p className="text-3xl font-bold text-gray-900 mb-1">{formatCurrency(15334)}</p>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600">vs Target: {formatCurrency(15000)}</span>
              <span className="text-green-600 font-semibold flex items-center gap-1">
                <ArrowUpRight size={14} />
                2.2% over
              </span>
            </div>
          </div>

          <div className="border-l-4 border-purple-500 pl-4">
            <p className="text-sm text-gray-600 mb-2">Operating Efficiency</p>
            <p className="text-3xl font-bold text-gray-900 mb-1">78.1%</p>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600">Expenses / Revenue</span>
              <span className="text-green-600 font-semibold flex items-center gap-1">
                <CheckCircle size={14} />
                Efficient
              </span>
            </div>
          </div>

          <div className="border-l-4 border-orange-500 pl-4">
            <p className="text-sm text-gray-600 mb-2">Days Cash on Hand</p>
            <p className="text-3xl font-bold text-gray-900 mb-1">156 days</p>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600">Target: 120+ days</span>
              <span className="text-green-600 font-semibold flex items-center gap-1">
                <CheckCircle size={14} />
                Healthy
              </span>
            </div>
          </div>

          <div className="border-l-4 border-pink-500 pl-4">
            <p className="text-sm text-gray-600 mb-2">Endowment Growth</p>
            <p className="text-3xl font-bold text-gray-900 mb-1">12.4%</p>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600">This fiscal year</span>
              <span className="text-green-600 font-semibold flex items-center gap-1">
                <ArrowUpRight size={14} />
                Above benchmark
              </span>
            </div>
          </div>

          <div className="border-l-4 border-red-500 pl-4">
            <p className="text-sm text-gray-600 mb-2">Student Debt Ratio</p>
            <p className="text-3xl font-bold text-gray-900 mb-1">32.5%</p>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600">Students with debt</span>
              <span className="text-green-600 font-semibold flex items-center gap-1">
                <ArrowDownRight size={14} />
                2.8% decrease
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Forecast & Projections */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Financial Forecast & Projections</h2>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
              View Scenarios
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
              Run Analysis
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="p-6 border-2 border-blue-200 rounded-lg bg-blue-50">
            <h3 className="text-lg font-bold text-blue-900 mb-4">Year-End Projection</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Projected Revenue</span>
                <span className="text-xl font-bold text-blue-900">{formatCurrency(104874000)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Projected Expenses</span>
                <span className="text-xl font-bold text-blue-900">{formatCurrency(81894000)}</span>
              </div>
              <div className="pt-3 border-t-2 border-blue-300 flex justify-between items-center">
                <span className="text-gray-700 font-semibold">Projected Net Income</span>
                <span className="text-2xl font-bold text-green-700">{formatCurrency(22980000)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <TrendingUp size={16} className="text-green-600" />
                <span>4.5% above target projection</span>
              </div>
            </div>
          </div>

          <div className="p-6 border-2 border-green-200 rounded-lg bg-green-50">
            <h3 className="text-lg font-bold text-green-900 mb-4">Next Year Outlook</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Expected Revenue Growth</span>
                <span className="text-xl font-bold text-green-900">8.2%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Expected Expense Growth</span>
                <span className="text-xl font-bold text-green-900">6.5%</span>
              </div>
              <div className="pt-3 border-t-2 border-green-300 flex justify-between items-center">
                <span className="text-gray-700 font-semibold">Operating Margin Target</span>
                <span className="text-2xl font-bold text-green-700">24.5%</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle size={16} className="text-green-600" />
                <span>Sustainable growth trajectory</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-900 mb-1">Strategic Recommendations</h4>
              <ul className="space-y-1 text-sm text-yellow-800">
                <li>• Continue focus on research grant applications to diversify revenue streams</li>
                <li>• Monitor administrative costs closely as they are currently 9.8% over budget</li>
                <li>• Implement cost-saving initiatives in facilities management for Q4</li>
                <li>• Expand short-term training programs showing 22.4% growth rate</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LibraryDashboard = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Library Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Hybrid Online + Offline Library Management</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium">
            Export Report
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
            Add New Item
          </button>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">Total Collection</p>
          <p className="text-2xl font-bold text-gray-900">87,543</p>
          <div className="mt-2 space-y-0.5">
            <p className="text-xs text-gray-600">Physical: 45,230</p>
            <p className="text-xs text-gray-600">Digital: 42,313</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">Active Users</p>
          <p className="text-2xl font-bold text-gray-900">5,892</p>
          <div className="mt-2 space-y-0.5">
            <p className="text-xs text-gray-600">Students: 5,100</p>
            <p className="text-xs text-gray-600">Faculty: 792</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">Offline Borrows</p>
          <p className="text-2xl font-bold text-gray-900">1,247</p>
          <div className="mt-2 space-y-0.5">
            <p className="text-xs text-gray-600">This month</p>
            <p className="text-xs text-green-600">↑ 12% vs last month</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">Online Access</p>
          <p className="text-2xl font-bold text-gray-900">48,392</p>
          <div className="mt-2 space-y-0.5">
            <p className="text-xs text-gray-600">This month</p>
            <p className="text-xs text-green-600">↑ 18% vs last month</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">Overdue Items</p>
          <p className="text-2xl font-bold text-red-600">34</p>
          <div className="mt-2 space-y-0.5">
            <p className="text-xs text-gray-600">Requires follow-up</p>
            <p className="text-xs text-gray-600">Avg: 5 days late</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">Textbooks</h3>
            <BookOpen className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-2">12,450</p>
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Physical</span>
              <span className="font-semibold">8,230</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Digital</span>
              <span className="font-semibold">4,220</span>
            </div>
            <div className="flex justify-between text-xs pt-2 border-t border-gray-200">
              <span className="text-gray-600">Offline Borrows</span>
              <span className="font-semibold text-blue-600">342/month</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Online Access</span>
              <span className="font-semibold text-green-600">18,450/month</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">Reference Books</h3>
            <BookOpen className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-2">8,920</p>
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Physical</span>
              <span className="font-semibold">5,680</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Digital</span>
              <span className="font-semibold">3,240</span>
            </div>
            <div className="flex justify-between text-xs pt-2 border-t border-gray-200">
              <span className="text-gray-600">Offline Borrows</span>
              <span className="font-semibold text-blue-600">189/month</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Online Access</span>
              <span className="font-semibold text-green-600">12,340/month</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">Thesis/Dissertations</h3>
            <FileText className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-2">3,847</p>
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Physical</span>
              <span className="font-semibold">2,120</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Digital</span>
              <span className="font-semibold">1,727</span>
            </div>
            <div className="flex justify-between text-xs pt-2 border-t border-gray-200">
              <span className="text-gray-600">Offline Borrows</span>
              <span className="font-semibold text-blue-600">67/month</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Online Access</span>
              <span className="font-semibold text-green-600">5,892/month</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">Journals & Periodicals</h3>
            <Globe className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-2">62,326</p>
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Physical</span>
              <span className="font-semibold">29,200</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Digital</span>
              <span className="font-semibold">33,126</span>
            </div>
            <div className="flex justify-between text-xs pt-2 border-t border-gray-200">
              <span className="text-gray-600">Offline Borrows</span>
              <span className="font-semibold text-blue-600">649/month</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Online Access</span>
              <span className="font-semibold text-green-600">11,710/month</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Usage Trends (Last 6 Months)</h3>
          <div className="h-64 flex items-end justify-between gap-3">
            {[
              {offline: 920, online: 38000},
              {offline: 1050, online: 41000},
              {offline: 980, online: 39500},
              {offline: 1120, online: 43000},
              {offline: 1180, online: 45500},
              {offline: 1247, online: 48392}
            ].map((data, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex gap-1">
                  <div 
                    className="flex-1 bg-blue-500 rounded-t hover:bg-blue-600 cursor-pointer transition-colors" 
                    style={{height: `${(data.offline / 1500) * 200}px`}}
                    title={`Offline: ${data.offline}`}
                  ></div>
                  <div 
                    className="flex-1 bg-green-500 rounded-t hover:bg-green-600 cursor-pointer transition-colors" 
                    style={{height: `${(data.online / 50000) * 200}px`}}
                    title={`Online: ${data.online}`}
                  ></div>
                </div>
                <span className="text-xs text-gray-500">M{i+1}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-sm text-gray-600">Offline Borrows</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm text-gray-600">Online Access</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Popular Resources</h3>
          <div className="space-y-4">
            {[
              {title: 'Introduction to Algorithms', type: 'Textbook', accesses: 1247},
              {title: 'Machine Learning Basics', type: 'Reference', accesses: 892},
              {title: 'Deep Learning Research', type: 'Journal', accesses: 756},
              {title: 'Data Science Fundamentals', type: 'Textbook', accesses: 643},
              {title: 'AI Applications in Healthcare', type: 'Thesis', accesses: 521}
            ].map((item, i) => (
              <div key={i} className="pb-3 border-b last:border-b-0 border-gray-200">
                <div className="flex justify-between items-start mb-1">
                  <p className="text-sm font-semibold text-gray-900 flex-1 pr-2">{item.title}</p>
                  <span className="text-xs font-bold text-blue-600">{item.accesses}</span>
                </div>
                <p className="text-xs text-gray-500">{item.type}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activities</h3>
          <div className="space-y-3">
            {[
              {action: 'New textbook added', item: 'Advanced Database Systems', time: '2 hours ago', type: 'add'},
              {action: 'Offline borrow', item: 'Machine Learning by Tom Mitchell', time: '3 hours ago', type: 'borrow'},
              {action: 'Digital access', item: 'IEEE Journal - AI Research', time: '5 hours ago', type: 'access'},
              {action: 'Item returned', item: 'Introduction to Algorithms', time: '6 hours ago', type: 'return'},
              {action: 'Overdue reminder sent', item: 'Data Structures Book', time: '1 day ago', type: 'alert'}
            ].map((activity, i) => (
              <div key={i} className="flex items-start gap-3 pb-3 border-b last:border-b-0 border-gray-200">
                <div className={`w-2 h-2 rounded-full mt-1.5 ${
                  activity.type === 'add' ? 'bg-green-500' :
                  activity.type === 'borrow' ? 'bg-blue-500' :
                  activity.type === 'access' ? 'bg-purple-500' :
                  activity.type === 'return' ? 'bg-gray-500' :
                  'bg-red-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-600">{activity.item}</p>
                  <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Library Statistics</h3>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Capacity Utilization</span>
                <span className="text-lg font-bold text-gray-900">78%</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{width: '78%'}}></div>
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Digital vs Physical Usage</span>
                <span className="text-lg font-bold text-gray-900">74:26</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 flex overflow-hidden">
                <div className="bg-green-600 h-2" style={{width: '74%'}}></div>
                <div className="bg-blue-600 h-2" style={{width: '26%'}}></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 border border-gray-200 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Avg. Borrow Duration</p>
                <p className="text-lg font-bold text-gray-900">14 days</p>
              </div>
              <div className="p-3 border border-gray-200 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Return Rate</p>
                <p className="text-lg font-bold text-green-600">96%</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 border border-gray-200 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">New Additions (Month)</p>
                <p className="text-lg font-bold text-gray-900">142</p>
              </div>
              <div className="p-3 border border-gray-200 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Database Subscriptions</p>
                <p className="text-lg font-bold text-gray-900">28</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const TimetableCalendar = () => {
    const [viewMode, setViewMode] = useState('week');
    const [currentDate, setCurrentDate] = useState(new Date(2025, 9, 15)); // Oct 15, 2025
    const [selectedRoom, setSelectedRoom] = useState('all');
    const [selectedProgram, setSelectedProgram] = useState('all');

    const sampleCourses = [
      { id: 1, code: 'CS301', name: 'Data Structures', room: 'A101', time: '08:00-09:30', day: 1, instructor: 'Dr. Nguyen' },
      { id: 2, code: 'CS302', name: 'Database Systems', room: 'A102', time: '10:00-11:30', day: 1, instructor: 'Dr. Tran' },
      { id: 3, code: 'BA201', name: 'Marketing', room: 'B201', time: '13:00-14:30', day: 1, instructor: 'Dr. Le' },
      { id: 4, code: 'CS401', name: 'AI Fundamentals', room: 'A101', time: '08:00-09:30', day: 2, instructor: 'Dr. Pham' },
      { id: 5, code: 'CS303', name: 'Software Engineering', room: 'A103', time: '10:00-11:30', day: 2, instructor: 'Dr. Hoang' },
      { id: 6, code: 'BA301', name: 'Strategic Management', room: 'B202', time: '14:00-15:30', day: 2, instructor: 'Dr. Vo' },
      { id: 7, code: 'CS501', name: 'Machine Learning', room: 'A201', time: '08:00-09:30', day: 3, instructor: 'Dr. Nguyen' },
      { id: 8, code: 'CS304', name: 'Web Development', room: 'A104', time: '10:00-11:30', day: 3, instructor: 'Dr. Dinh' },
      { id: 9, code: 'BA202', name: 'Finance', room: 'B203', time: '13:00-14:30', day: 3, instructor: 'Dr. Bui' },
      { id: 10, code: 'CS305', name: 'Networks', room: 'A105', time: '08:00-09:30', day: 4, instructor: 'Dr. Ly' },
      { id: 11, code: 'CS502', name: 'Deep Learning', room: 'A202', time: '10:00-11:30', day: 4, instructor: 'Dr. Nguyen' },
      { id: 12, code: 'BA401', name: 'Business Analytics', room: 'B301', time: '14:00-15:30', day: 4, instructor: 'Dr. Cao' },
      { id: 13, code: 'CS306', name: 'Mobile Dev', room: 'A106', time: '08:00-09:30', day: 5, instructor: 'Dr. Dang' },
      { id: 14, code: 'CS307', name: 'Security', room: 'A107', time: '10:00-11:30', day: 5, instructor: 'Dr. Vu' },
    ];

    const getWeekDates = () => {
      const startOfWeek = new Date(currentDate);
      const day = startOfWeek.getDay();
      const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
      startOfWeek.setDate(diff);
      
      return Array.from({ length: 7 }, (_, i) => {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        return date;
      });
    };

    const getMonthDates = () => {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const startDay = firstDay.getDay();
      const daysInMonth = lastDay.getDate();
      
      const dates = [];
      for (let i = 0; i < startDay; i++) {
        dates.push(null);
      }
      for (let i = 1; i <= daysInMonth; i++) {
        dates.push(new Date(year, month, i));
      }
      return dates;
    };

    const navigateDate = (direction) => {
      const newDate = new Date(currentDate);
      if (viewMode === 'day') {
        newDate.setDate(currentDate.getDate() + direction);
      } else if (viewMode === 'week') {
        newDate.setDate(currentDate.getDate() + (direction * 7));
      } else {
        newDate.setMonth(currentDate.getMonth() + direction);
      }
      setCurrentDate(newDate);
    };

    const DayView = () => {
      const dayOfWeek = currentDate.getDay();
      const coursesForDay = sampleCourses.filter(c => c.day === dayOfWeek);
      
      return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-bold text-lg">{currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
          </div>
          <div className="p-4 space-y-3">
            {coursesForDay.length > 0 ? coursesForDay.map(course => (
              <div key={course.id} className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900">{course.code}</h4>
                    <p className="text-sm text-gray-600">{course.name}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {course.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <Building size={14} />
                        Room {course.room}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{course.instructor}</span>
                </div>
              </div>
            )) : (
              <p className="text-center text-gray-500 py-8">No classes scheduled for this day</p>
            )}
          </div>
        </div>
      );
    };

    const WeekView = () => {
      const weekDates = getWeekDates();
      
      return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-7 border-b border-gray-200">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
              <div key={day} className="p-4 text-center border-r border-gray-200 last:border-r-0">
                <p className="text-sm font-semibold text-gray-600">{day}</p>
                <p className="text-lg font-bold text-gray-900 mt-1">{weekDates[index].getDate()}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {weekDates.map((date, index) => {
              const dayOfWeek = date.getDay() || 7;
              const coursesForDay = sampleCourses.filter(c => c.day === dayOfWeek);
              
              return (
                <div key={index} className="border-r border-gray-200 last:border-r-0 min-h-[400px] p-2">
                  <div className="space-y-2">
                    {coursesForDay.map(course => (
                      <div key={course.id} className="p-2 bg-blue-50 border-l-2 border-blue-500 rounded text-xs">
                        <p className="font-bold text-blue-900">{course.code}</p>
                        <p className="text-gray-600 text-xs mt-1">{course.time}</p>
                        <p className="text-gray-500 text-xs flex items-center gap-1 mt-1">
                          <Building size={10} />
                          {course.room}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    };

    const MonthView = () => {
      const monthDates = getMonthDates();
      
      return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-7 border-b border-gray-200">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} className="p-3 text-center border-r border-gray-200 last:border-r-0">
                <p className="text-sm font-semibold text-gray-600">{day}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {monthDates.map((date, index) => {
              if (!date) {
                return <div key={index} className="border-r border-b border-gray-200 min-h-[120px] bg-gray-50"></div>;
              }
              
              const dayOfWeek = date.getDay() || 7;
              const coursesForDay = sampleCourses.filter(c => c.day === dayOfWeek);
              const isToday = date.toDateString() === new Date(2025, 9, 15).toDateString();
              
              return (
                <div key={index} className={`border-r border-b border-gray-200 min-h-[120px] p-2 ${isToday ? 'bg-blue-50' : ''}`}>
                  <p className={`text-sm font-semibold mb-2 ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                    {date.getDate()}
                  </p>
                  <div className="space-y-1">
                    {coursesForDay.slice(0, 3).map(course => (
                      <div key={course.id} className="text-xs bg-blue-100 text-blue-900 px-1 py-0.5 rounded truncate">
                        {course.code} - {course.room}
                      </div>
                    ))}
                    {coursesForDay.length > 3 && (
                      <p className="text-xs text-gray-500">+{coursesForDay.length - 3} more</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Timetable Calendar</h1>
            <p className="text-sm text-gray-500 mt-1">View and manage course schedules</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigateDate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronRight className="rotate-180" size={20} />
              </button>
              <button
                onClick={() => setCurrentDate(new Date(2025, 9, 15))}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
              >
                Today
              </button>
              <button
                onClick={() => navigateDate(1)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronRight size={20} />
              </button>
              <h2 className="text-xl font-bold text-gray-900 ml-4">
                {viewMode === 'month' 
                  ? currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                  : currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                }
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <select 
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All Rooms</option>
                <option value="A101">Room A101</option>
                <option value="A102">Room A102</option>
                <option value="B201">Room B201</option>
              </select>

              <select 
                value={selectedProgram}
                onChange={(e) => setSelectedProgram(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All Programs</option>
                <option value="cs">Computer Science</option>
                <option value="ba">Business Admin</option>
              </select>

              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('day')}
                  className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${
                    viewMode === 'day' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Day
                </button>
                <button
                  onClick={() => setViewMode('week')}
                  className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${
                    viewMode === 'week' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Week
                </button>
                <button
                  onClick={() => setViewMode('month')}
                  className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${
                    viewMode === 'month' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Month
                </button>
              </div>
            </div>
          </div>
        </div>

        {viewMode === 'day' && <DayView />}
        {viewMode === 'week' && <WeekView />}
        {viewMode === 'month' && <MonthView />}

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Legend</h3>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-sm text-gray-600">Regular Classes</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm text-gray-600">Labs</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-500 rounded"></div>
              <span className="text-sm text-gray-600">Exams</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const LecturerProfileAdmin = () => {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [selectedLecturer, setSelectedLecturer] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const overviewStats = {
    totalLecturers: 297,
    activeContracts: 285,
    contractsExpiring: 12,
    onLeave: 8,
    avgKPI: 4.2,
    budgetUtilization: 87
  };

  const lecturers = [
    {
      id: 'L001234',
      name: 'Dr. Nguyen Van Minh',
      department: 'Computer Science',
      position: 'Associate Professor',
      degree: 'PhD',
      contractType: 'Full-time',
      contractStart: '2020-09-01',
      contractEnd: '2025-08-31',
      salary: '$65,000',
      teachingHours: 480,
      publications: 24,
      kpiScore: 4.5,
      leaveBalance: 15,
      conferences: 5,
      status: 'Active',
      lastReview: '2024-06-15'
    },
    {
      id: 'L001235',
      name: 'Dr. Tran Thi Lan',
      department: 'Business Administration',
      position: 'Professor',
      degree: 'PhD',
      contractType: 'Full-time',
      contractStart: '2018-01-15',
      contractEnd: '2025-01-14',
      salary: '$75,000',
      teachingHours: 520,
      publications: 38,
      kpiScore: 4.7,
      leaveBalance: 20,
      conferences: 8,
      status: 'Active',
      lastReview: '2024-05-20'
    },
    {
      id: 'L001236',
      name: 'Dr. Le Van Hieu',
      department: 'Software Engineering',
      position: 'Lecturer',
      degree: 'PhD',
      contractType: 'Full-time',
      contractStart: '2021-03-01',
      contractEnd: '2024-12-31',
      salary: '$58,000',
      teachingHours: 420,
      publications: 12,
      kpiScore: 4.0,
      leaveBalance: 12,
      conferences: 3,
      status: 'Contract Expiring',
      lastReview: '2024-07-10'
    },
    {
      id: 'L001237',
      name: 'Dr. Pham Thi Mai',
      department: 'Data Science',
      position: 'Associate Professor',
      degree: 'PhD',
      contractType: 'Full-time',
      contractStart: '2019-08-01',
      contractEnd: '2026-07-31',
      salary: '$68,000',
      teachingHours: 460,
      publications: 31,
      kpiScore: 4.6,
      leaveBalance: 18,
      conferences: 6,
      status: 'Active',
      lastReview: '2024-04-25'
    },
    {
      id: 'L001238',
      name: 'Dr. Hoang Van Tuan',
      department: 'Computer Science',
      position: 'Senior Lecturer',
      degree: 'PhD',
      contractType: 'Part-time',
      contractStart: '2022-01-10',
      contractEnd: '2025-01-09',
      salary: '$45,000',
      teachingHours: 240,
      publications: 18,
      kpiScore: 4.3,
      leaveBalance: 10,
      conferences: 4,
      status: 'On Leave',
      lastReview: '2024-08-01'
    }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'bg-green-100 text-green-700 border-green-300';
      case 'Contract Expiring': return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'On Leave': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'Inactive': return 'bg-gray-100 text-gray-700 border-gray-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getKPIColor = (score) => {
    if (score >= 4.5) return 'text-green-600';
    if (score >= 4.0) return 'text-blue-600';
    if (score >= 3.5) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Faculty Management Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Dean's comprehensive view of faculty performance, contracts, and KPIs</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium">
              <Download className="w-4 h-4" />
              Export Report
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
              <Plus className="w-4 h-4" />
              Add New Lecturer
            </button>
          </div>
        </div>

        <div className="grid grid-cols-6 gap-4">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-1">Total Lecturers</p>
            <p className="text-2xl font-bold text-gray-900">{overviewStats.totalLecturers}</p>
            <p className="text-xs text-gray-600 mt-1">Across all departments</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-1">Active Contracts</p>
            <p className="text-2xl font-bold text-gray-900">{overviewStats.activeContracts}</p>
            <p className="text-xs text-green-600 mt-1">96% of total</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-1">Expiring Soon</p>
            <p className="text-2xl font-bold text-gray-900">{overviewStats.contractsExpiring}</p>
            <p className="text-xs text-orange-600 mt-1">Within 6 months</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-1">On Leave</p>
            <p className="text-2xl font-bold text-gray-900">{overviewStats.onLeave}</p>
            <p className="text-xs text-gray-600 mt-1">Currently absent</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-pink-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-1">Avg KPI Score</p>
            <p className="text-2xl font-bold text-gray-900">{overviewStats.avgKPI}<span className="text-lg text-gray-500">/5.0</span></p>
            <p className="text-xs text-green-600 mt-1">Above target</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-1">Budget Used</p>
            <p className="text-2xl font-bold text-gray-900">{overviewStats.budgetUtilization}%</p>
            <p className="text-xs text-gray-600 mt-1">Salary allocation</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSelectedTab('overview')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedTab === 'overview' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setSelectedTab('contracts')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedTab === 'contracts' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Contracts
                </button>
                <button
                  onClick={() => setSelectedTab('kpi')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedTab === 'kpi' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  KPI & Performance
                </button>
                <button
                  onClick={() => setSelectedTab('leave')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedTab === 'leave' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Leave Management
                </button>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search lecturers..."
                    className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-64"
                  />
                </div>
                <select 
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="all">All Departments</option>
                  <option value="cs">Computer Science</option>
                  <option value="ba">Business Admin</option>
                  <option value="se">Software Engineering</option>
                  <option value="ds">Data Science</option>
                </select>
                <select 
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="expiring">Contract Expiring</option>
                  <option value="leave">On Leave</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Lecturer</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Department</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Contract</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">KPI Score</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Teaching</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Publications</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Leave</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Status</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {lecturers.map((lecturer) => (
                  <tr key={lecturer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium text-blue-600">{lecturer.id}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="font-semibold text-gray-900">{lecturer.name}</p>
                        <p className="text-xs text-gray-500">{lecturer.position}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{lecturer.department}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-xs">
                        <p className="font-semibold text-gray-900">{lecturer.contractType}</p>
                        <p className="text-gray-500">Until {lecturer.contractEnd}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Target className="w-4 h-4 text-yellow-500" />
                        <span className={`text-lg font-bold ${getKPIColor(lecturer.kpiScore)}`}>
                          {lecturer.kpiScore}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-sm font-semibold text-gray-900">{lecturer.teachingHours}h</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-sm font-semibold text-gray-900">{lecturer.publications}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-sm text-gray-600">{lecturer.leaveBalance} days</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(lecturer.status)}`}>
                        {lecturer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button 
                        onClick={() => setSelectedLecturer(lecturer)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">Showing 1-5 of 297 lecturers</p>
            <div className="flex gap-2">
              <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">Previous</button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded">1</button>
              <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">2</button>
              <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">3</button>
              <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">Next</button>
            </div>
          </div>
        </div>

        {selectedLecturer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedLecturer(null)}>
            <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-600 to-purple-600">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-white">
                    <h2 className="text-2xl font-bold">{selectedLecturer.name}</h2>
                    <p className="text-sm opacity-90">{selectedLecturer.position} • {selectedLecturer.department}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedLecturer(null)}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg text-white"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-2 space-y-6">
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        Contract Information
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Contract Type</p>
                          <p className="font-semibold text-gray-900">{selectedLecturer.contractType}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Start Date</p>
                          <p className="font-semibold text-gray-900">{selectedLecturer.contractStart}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">End Date</p>
                          <p className="font-semibold text-gray-900">{selectedLecturer.contractEnd}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Annual Salary</p>
                          <p className="font-semibold text-gray-900">{selectedLecturer.salary}</p>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
                          Renew Contract
                        </button>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Target className="w-5 h-5 text-purple-600" />
                        KPI & Performance Metrics
                      </h3>
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="p-4 bg-purple-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Overall KPI</p>
                          <p className={`text-3xl font-bold ${getKPIColor(selectedLecturer.kpiScore)}`}>
                            {selectedLecturer.kpiScore}/5.0
                          </p>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Teaching Hours</p>
                          <p className="text-3xl font-bold text-gray-900">{selectedLecturer.teachingHours}h</p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Publications</p>
                          <p className="text-3xl font-bold text-gray-900">{selectedLecturer.publications}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Teaching Quality</span>
                            <span className="font-semibold">4.7/5.0</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{width: '94%'}}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Research Output</span>
                            <span className="font-semibold">4.5/5.0</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{width: '90%'}}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Service & Admin</span>
                            <span className="font-semibold">4.0/5.0</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-purple-500 h-2 rounded-full" style={{width: '80%'}}></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-green-600" />
                        Academic Activities
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500 mb-2">Conferences Attended</p>
                          <div className="space-y-2">
                            <div className="p-2 bg-gray-50 rounded text-xs">
                              <p className="font-semibold">AI & ML Conference 2024</p>
                              <p className="text-gray-600">Singapore • June 2024</p>
                            </div>
                            <div className="p-2 bg-gray-50 rounded text-xs">
                              <p className="font-semibold">IEEE Computer Science</p>
                              <p className="text-gray-600">Japan • March 2024</p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-2">Recent Publications</p>
                          <div className="space-y-2">
                            <div className="p-2 bg-gray-50 rounded text-xs">
                              <p className="font-semibold">Deep Learning in Healthcare</p>
                              <p className="text-gray-600">Q1 Journal • 2024</p>
                            </div>
                            <div className="p-2 bg-gray-50 rounded text-xs">
                              <p className="font-semibold">AI Ethics Framework</p>
                              <p className="text-gray-600">Conference Paper • 2024</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-orange-600" />
                        Leave Management
                      </h3>
                      <div className="space-y-4">
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Leave Balance</p>
                          <p className="text-2xl font-bold text-gray-900">{selectedLecturer.leaveBalance} days</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 mb-2">Recent Leave</p>
                          <div className="space-y-2">
                            <div className="p-2 bg-gray-50 rounded text-xs">
                              <p className="font-semibold">Annual Leave</p>
                              <p className="text-gray-600">Aug 1-5, 2024 (5 days)</p>
                            </div>
                            <div className="p-2 bg-gray-50 rounded text-xs">
                              <p className="font-semibold">Conference</p>
                              <p className="text-gray-600">Jun 15-20, 2024 (6 days)</p>
                            </div>
                          </div>
                        </div>
                        <button className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium">
                          View Full Leave History
                        </button>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-pink-600" />
                        Quick Stats
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between py-2 border-b border-gray-200">
                          <span className="text-sm text-gray-600">Degree</span>
                          <span className="text-sm font-semibold text-gray-900">{selectedLecturer.degree}</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-gray-200">
                          <span className="text-sm text-gray-600">Last Review</span>
                          <span className="text-sm font-semibold text-gray-900">{selectedLecturer.lastReview}</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-gray-200">
                          <span className="text-sm text-gray-600">Conferences</span>
                          <span className="text-sm font-semibold text-gray-900">{selectedLecturer.conferences} attended</span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                          <span className="text-sm text-gray-600">Status</span>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium border ${getStatusColor(selectedLecturer.status)}`}>
                            {selectedLecturer.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <h3 className="font-bold text-gray-900 mb-4">Actions</h3>
                      <div className="space-y-2">
                        <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
                          Schedule Review
                        </button>
                        <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium">
                          Adjust Salary
                        </button>
                        <button className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium">
                          Send Message
                        </button>
                        <button className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium">
                          Export Profile
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

  const StudentProfileAdmin = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterProgram, setFilterProgram] = useState('all');
    const [filterLevel, setFilterLevel] = useState('all');
    const [selectedStudent, setSelectedStudent] = useState(null);

    const sampleStudents = [
      { id: 'S001234', name: 'Nguyen Van An', program: 'Computer Science', level: 'Bachelor', year: '3', gpa: '3.45', status: 'Active' },
      { id: 'S001235', name: 'Tran Thi Binh', program: 'Business Administration', level: 'Bachelor', year: '2', gpa: '3.72', status: 'Active' },
      { id: 'S001236', name: 'Le Van Cuong', program: 'Software Engineering', level: 'Master', year: '1', gpa: '3.88', status: 'Active' },
      { id: 'S001237', name: 'Pham Thi Dung', program: 'Data Science', level: 'Master', year: '2', gpa: '3.91', status: 'Active' },
      { id: 'S001238', name: 'Hoang Van Em', program: 'Computer Science', level: 'PhD', year: '3', gpa: '3.95', status: 'Active' },
    ];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Student Profile Management</h1>
            <p className="text-sm text-gray-500 mt-1">Comprehensive student data and analytics</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus size={18} />
            Add New Student
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Total Students</p>
            <p className="text-2xl font-bold text-gray-900">2,000</p>
            <div className="mt-2 space-y-0.5">
              <p className="text-xs text-gray-600">Bachelor: 1,700 (85%)</p>
              <p className="text-xs text-gray-600">Master: 300 (15%)</p>
              <p className="text-xs text-gray-600">PhD: 30 (1.5%)</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Bachelor Programs</p>
            <p className="text-2xl font-bold text-gray-900">6</p>
            <div className="mt-2 space-y-0.5">
              <p className="text-xs text-gray-600">Domestic: 5 programs</p>
              <p className="text-xs text-gray-600">International: 1 program</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Master Programs</p>
            <p className="text-2xl font-bold text-gray-900">3</p>
            <div className="mt-2 space-y-0.5">
              <p className="text-xs text-gray-600">300 students enrolled</p>
              <p className="text-xs text-gray-600">Avg. duration: 2 years</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">PhD Program</p>
            <p className="text-2xl font-bold text-gray-900">1</p>
            <div className="mt-2 space-y-0.5">
              <p className="text-xs text-gray-600">30 doctoral students</p>
              <p className="text-xs text-gray-600">Avg. duration: 4 years</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by student ID, name, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select 
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Levels</option>
                <option value="bachelor">Bachelor</option>
                <option value="master">Master</option>
                <option value="phd">PhD</option>
              </select>
              <select 
                value={filterProgram}
                onChange={(e) => setFilterProgram(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Programs</option>
                <option value="cs">Computer Science</option>
                <option value="ba">Business Administration</option>
                <option value="se">Software Engineering</option>
                <option value="ds">Data Science</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Student ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Full Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Program</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Level</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Year</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">GPA</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sampleStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{student.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{student.program}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        student.level === 'Bachelor' ? 'bg-blue-100 text-blue-700' :
                        student.level === 'Master' ? 'bg-purple-100 text-purple-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {student.level}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">Year {student.year}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{student.gpa}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">{student.status}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button 
                        onClick={() => setSelectedStudent(student)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">Showing 1-5 of 2,000 students</p>
            <div className="flex gap-2">
              <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">Previous</button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded">1</button>
              <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">2</button>
              <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">3</button>
              <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">Next</button>
            </div>
          </div>
        </div>

        {selectedStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Student Profile Details</h2>
                <button 
                  onClick={() => setSelectedStudent(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  ✕
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-1 flex flex-col items-center">
                    <div className="w-32 h-32 bg-gray-300 rounded-full mb-4"></div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedStudent.name}</h3>
                    <p className="text-sm text-gray-500">{selectedStudent.id}</p>
                  </div>
                  <div className="col-span-2 grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Program</p>
                      <p className="font-semibold text-gray-900">{selectedStudent.program}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Level</p>
                      <p className="font-semibold text-gray-900">{selectedStudent.level}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Current Year</p>
                      <p className="font-semibold text-gray-900">Year {selectedStudent.year}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">GPA</p>
                      <p className="font-semibold text-gray-900">{selectedStudent.gpa}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Status</p>
                      <p className="font-semibold text-green-600">{selectedStudent.status}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Email</p>
                      <p className="font-semibold text-gray-900 text-sm">{selectedStudent.id.toLowerCase()}@hsb.edu.vn</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3">Academic Performance</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Credits Completed</span>
                        <span className="font-semibold">95/120</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Attendance Rate</span>
                        <span className="font-semibold">94%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Training Score</span>
                        <span className="font-semibold">85/100</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3">Financial Status</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tuition Paid</span>
                        <span className="font-semibold text-green-600">Current</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Scholarship</span>
                        <span className="font-semibold">Merit-based 50%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Outstanding Balance</span>
                        <span className="font-semibold">$0</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const EventsDashboard = () => {
    const [viewMode, setViewMode] = useState('grid');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterType, setFilterType] = useState('all');
    const [selectedEvent, setSelectedEvent] = useState(null);

    const sampleEvents = [
      {
        id: 'EVT001',
        name: 'Annual Tech Conference 2025',
        type: 'Conference',
        date: '2025-10-25',
        time: '09:00 - 17:00',
        location: 'Main Auditorium',
        capacity: 500,
        registered: 423,
        status: 'Open',
        organizer: 'CS Department',
        description: 'Annual technology conference featuring keynotes, workshops, and networking.',
        color: 'blue'
      },
      {
        id: 'EVT002',
        name: 'Career Fair',
        type: 'Career',
        date: '2025-10-28',
        time: '10:00 - 16:00',
        location: 'Sports Center',
        capacity: 1000,
        registered: 847,
        status: 'Open',
        organizer: 'Career Services',
        description: 'Meet top employers and explore internship and job opportunities.',
        color: 'green'
      },
      {
        id: 'EVT003',
        name: 'Research Symposium',
        type: 'Academic',
        date: '2025-10-20',
        time: '13:00 - 18:00',
        location: 'Conference Hall B',
        capacity: 200,
        registered: 156,
        status: 'Open',
        organizer: 'Graduate School',
        description: 'Showcase of cutting-edge research by faculty and graduate students.',
        color: 'purple'
      },
      {
        id: 'EVT004',
        name: 'Student Orientation',
        type: 'Orientation',
        date: '2025-10-16',
        time: '08:00 - 12:00',
        location: 'Main Campus',
        capacity: 800,
        registered: 800,
        status: 'Full',
        organizer: 'Student Affairs',
        description: 'Welcome new students and introduce campus resources.',
        color: 'orange'
      },
      {
        id: 'EVT005',
        name: 'Alumni Networking Night',
        type: 'Social',
        date: '2025-11-05',
        time: '18:00 - 21:00',
        location: 'University Club',
        capacity: 300,
        registered: 187,
        status: 'Open',
        organizer: 'Alumni Relations',
        description: 'Connect with successful alumni and build professional networks.',
        color: 'pink'
      },
      {
        id: 'EVT006',
        name: 'Startup Pitch Competition',
        type: 'Competition',
        date: '2025-11-10',
        time: '14:00 - 18:00',
        location: 'Innovation Hub',
        capacity: 150,
        registered: 89,
        status: 'Open',
        organizer: 'Entrepreneurship Center',
        description: 'Students pitch their startup ideas to win funding and mentorship.',
        color: 'yellow'
      }
    ];

    const getStatusColor = (status) => {
      switch (status) {
        case 'Open': return 'bg-green-100 text-green-700';
        case 'Full': return 'bg-red-100 text-red-700';
        case 'Closed': return 'bg-gray-100 text-gray-700';
        default: return 'bg-blue-100 text-blue-700';
      }
    };

    const getTypeColor = (type) => {
      switch (type) {
        case 'Conference': return 'bg-blue-100 text-blue-700';
        case 'Career': return 'bg-green-100 text-green-700';
        case 'Academic': return 'bg-purple-100 text-purple-700';
        case 'Orientation': return 'bg-orange-100 text-orange-700';
        case 'Social': return 'bg-pink-100 text-pink-700';
        case 'Competition': return 'bg-yellow-100 text-yellow-700';
        default: return 'bg-gray-100 text-gray-700';
      }
    };

    const filteredEvents = sampleEvents.filter(event => {
      if (filterStatus !== 'all' && event.status.toLowerCase() !== filterStatus) return false;
      if (filterType !== 'all' && event.type.toLowerCase() !== filterType.toLowerCase()) return false;
      return true;
    });

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Events Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Manage and track university events</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus size={18} />
            Create Event
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-1">Total Events</p>
            <p className="text-3xl font-bold text-gray-900">24</p>
            <p className="text-xs text-gray-600 mt-2">6 upcoming this month</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-1">Total Registrations</p>
            <p className="text-3xl font-bold text-gray-900">2,502</p>
            <p className="text-xs text-green-600 mt-2">↑ 18% vs last month</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-1">Avg Attendance</p>
            <p className="text-3xl font-bold text-gray-900">87%</p>
            <p className="text-xs text-gray-600 mt-2">Based on check-ins</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-1">Capacity Utilization</p>
            <p className="text-3xl font-bold text-gray-900">73%</p>
            <p className="text-xs text-gray-600 mt-2">Overall average</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search events..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                  />
                </div>
                <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="open">Open</option>
                  <option value="full">Full</option>
                  <option value="closed">Closed</option>
                </select>
                <select 
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="all">All Types</option>
                  <option value="Conference">Conference</option>
                  <option value="Career">Career</option>
                  <option value="Academic">Academic</option>
                  <option value="Orientation">Orientation</option>
                  <option value="Social">Social</option>
                  <option value="Competition">Competition</option>
                </select>
              </div>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'
                  }`}
                >
                  List
                </button>
              </div>
            </div>
          </div>

          {viewMode === 'grid' ? (
            <div className="p-6 grid grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <div key={event.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                     onClick={() => setSelectedEvent(event)}>
                  <div className={`h-32 bg-gradient-to-br from-${event.color}-400 to-${event.color}-600 p-4 flex flex-col justify-between`}>
                    <div className="flex items-start justify-between">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(event.type)}`}>
                        {event.type}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                        {event.status}
                      </span>
                    </div>
                    <h3 className="text-white font-bold text-lg">{event.name}</h3>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar size={16} />
                      <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock size={16} />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Building size={16} />
                      <span>{event.location}</span>
                    </div>
                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-500">Registration</span>
                        <span className="text-xs font-semibold text-gray-900">{event.registered}/{event.capacity}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${event.status === 'Full' ? 'bg-red-500' : 'bg-blue-500'}`}
                          style={{width: `${(event.registered / event.capacity) * 100}%`}}
                        ></div>
                      </div>
                    </div>
                    <button className="w-full mt-3 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 text-sm font-medium">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Event Name</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date & Time</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Registrations</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEvents.map((event) => (
                    <tr key={event.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900">{event.name}</p>
                          <p className="text-xs text-gray-500">{event.organizer}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(event.type)}`}>
                          {event.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div>
                          <p>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                          <p className="text-xs text-gray-500">{event.time}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{event.location}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-gray-600">{event.registered}/{event.capacity}</span>
                              <span className="font-semibold">{Math.round((event.registered/event.capacity)*100)}%</span>
                            </div>
                            <div className="w-24 bg-gray-200 rounded-full h-1.5">
                              <div 
                                className={`h-1.5 rounded-full ${event.status === 'Full' ? 'bg-red-500' : 'bg-blue-500'}`}
                                style={{width: `${(event.registered / event.capacity) * 100}%`}}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                          {event.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => setSelectedEvent(event)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Event Types Distribution</h3>
            <div className="space-y-3">
              {[
                {type: 'Conference', count: 8, color: 'blue'},
                {type: 'Career', count: 5, color: 'green'},
                {type: 'Academic', count: 4, color: 'purple'},
                {type: 'Social', count: 4, color: 'pink'},
                {type: 'Competition', count: 3, color: 'yellow'}
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full bg-${item.color}-500`}></div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-700">{item.type}</span>
                      <span className="text-sm font-semibold text-gray-900">{item.count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className={`h-2 rounded-full bg-${item.color}-500`} style={{width: `${(item.count/24)*100}%`}}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
            <div className="space-y-4">
              {[
                {action: 'New registration', event: 'Career Fair', time: '5 min ago', type: 'success'},
                {action: 'Event created', event: 'Workshop: AI Ethics', time: '1 hour ago', type: 'info'},
                {action: 'Capacity reached', event: 'Student Orientation', time: '2 hours ago', type: 'warning'},
                {action: 'Event completed', event: 'Guest Lecture Series', time: '1 day ago', type: 'neutral'}
              ].map((activity, i) => (
                <div key={i} className="flex items-start gap-3 pb-3 border-b last:border-b-0">
                  <div className={`w-2 h-2 rounded-full mt-1.5 ${
                    activity.type === 'success' ? 'bg-green-500' :
                    activity.type === 'info' ? 'bg-blue-500' :
                    activity.type === 'warning' ? 'bg-orange-500' :
                    'bg-gray-400'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-600">{activity.event}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedEvent(null)}>
            <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className={`h-40 bg-gradient-to-br from-${selectedEvent.color}-400 to-${selectedEvent.color}-600 p-6 flex flex-col justify-between`}>
                <div className="flex items-start justify-between">
                  <div className="flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(selectedEvent.type)}`}>
                      {selectedEvent.type}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedEvent.status)}`}>
                      {selectedEvent.status}
                    </span>
                  </div>
                  <button 
                    onClick={() => setSelectedEvent(null)}
                    className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg text-white"
                  >
                    ✕
                  </button>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedEvent.name}</h2>
                  <p className="text-white text-opacity-90 text-sm mt-1">{selectedEvent.organizer}</p>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <Calendar size={18} />
                      <span className="text-xs font-semibold uppercase">Date</span>
                    </div>
                    <p className="font-semibold text-gray-900">
                      {new Date(selectedEvent.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <Clock size={18} />
                      <span className="text-xs font-semibold uppercase">Time</span>
                    </div>
                    <p className="font-semibold text-gray-900">{selectedEvent.time}</p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <Building size={18} />
                      <span className="text-xs font-semibold uppercase">Location</span>
                    </div>
                    <p className="font-semibold text-gray-900">{selectedEvent.location}</p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <Users size={18} />
                      <span className="text-xs font-semibold uppercase">Capacity</span>
                    </div>
                    <p className="font-semibold text-gray-900">{selectedEvent.capacity} attendees</p>
                  </div>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Registration Progress</h4>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Registered Attendees</span>
                    <span className="text-lg font-bold text-gray-900">{selectedEvent.registered} / {selectedEvent.capacity}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div 
                      className={`h-3 rounded-full ${selectedEvent.status === 'Full' ? 'bg-red-500' : 'bg-blue-500'}`}
                      style={{width: `${(selectedEvent.registered / selectedEvent.capacity) * 100}%`}}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500">
                    {selectedEvent.capacity - selectedEvent.registered} spots remaining
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Description</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{selectedEvent.description}</p>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                    Manage Registrations
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
                    Edit Event
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
                    Export Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

const TimetableOverview = () => {
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 9, 15));

  const occupancyData = [
    { time: '08:00', rooms: 45, capacity: 80, rate: 56 },
    { time: '09:00', rooms: 68, capacity: 80, rate: 85 },
    { time: '10:00', rooms: 72, capacity: 80, rate: 90 },
    { time: '11:00', rooms: 65, capacity: 80, rate: 81 },
    { time: '12:00', rooms: 32, capacity: 80, rate: 40 },
    { time: '13:00', rooms: 58, capacity: 80, rate: 73 },
    { time: '14:00', rooms: 70, capacity: 80, rate: 88 },
    { time: '15:00', rooms: 62, capacity: 80, rate: 78 },
    { time: '16:00', rooms: 48, capacity: 80, rate: 60 },
    { time: '17:00', rooms: 28, capacity: 80, rate: 35 }
  ];

  const upcomingHolidays = [
    { name: 'National Day', date: 'Oct 20, 2025', type: 'Public Holiday', daysAway: 4 },
    { name: 'Mid-semester Break', date: 'Oct 28-30, 2025', type: 'Academic Break', daysAway: 12 },
    { name: 'Founder\'s Day', date: 'Nov 5, 2025', type: 'University Holiday', daysAway: 20 }
  ];

  const pendingChanges = [
    { id: 1, type: 'Room Change', course: 'CS301 - Data Structures', from: 'A101', to: 'A205', requestedBy: 'Dr. Nguyen', status: 'Pending', priority: 'High' },
    { id: 2, type: 'Time Change', course: 'BA201 - Marketing', from: '10:00-11:30', to: '14:00-15:30', requestedBy: 'Dr. Le', status: 'Pending', priority: 'Medium' },
    { id: 3, type: 'Makeup Class', course: 'CS401 - AI Fundamentals', date: 'Oct 22, 2025', time: '15:00-16:30', requestedBy: 'Dr. Pham', status: 'Approved', priority: 'Low' },
    { id: 4, type: 'Room Change', course: 'CS502 - Deep Learning', from: 'A202', to: 'A301', requestedBy: 'Dr. Nguyen', status: 'Pending', priority: 'High' },
    { id: 5, type: 'Class Cancellation', course: 'BA301 - Strategic Mgmt', date: 'Oct 18, 2025', reason: 'Conference', requestedBy: 'Dr. Vo', status: 'Pending', priority: 'Medium' }
  ];

  const roomUtilization = [
    { building: 'Building A', total: 30, occupied: 27, available: 3, rate: 90 },
    { building: 'Building B', total: 25, occupied: 21, available: 4, rate: 84 },
    { building: 'Building C', total: 15, occupied: 12, available: 3, rate: 80 },
    { building: 'Labs', total: 10, occupied: 9, available: 1, rate: 90 }
  ];

  const conflicts = [
    { type: 'Double Booking', room: 'A101', time: 'Mon 10:00-11:30', courses: 'CS301 & BA202', severity: 'Critical' },
    { type: 'Capacity Issue', room: 'B205', enrolled: 85, capacity: 80, course: 'BA301', severity: 'High' },
    { type: 'Instructor Conflict', instructor: 'Dr. Le', time: 'Wed 14:00-15:30', courses: 'BA201 & BA302', severity: 'Critical' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Timetable Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Real-time schedule monitoring and management</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium">
            Export Report
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
            Manage Schedule
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">Total Rooms</p>
          <p className="text-3xl font-bold text-gray-900">80</p>
          <p className="text-xs text-gray-600 mt-2">Across 4 buildings</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">Avg Occupancy</p>
          <p className="text-3xl font-bold text-gray-900">87%</p>
          <p className="text-xs text-green-600 mt-2">↑ 3% vs last week</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">Active Classes</p>
          <p className="text-3xl font-bold text-gray-900">68</p>
          <p className="text-xs text-gray-600 mt-2">Current time slot</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">Pending Changes</p>
          <p className="text-3xl font-bold text-gray-900">5</p>
          <p className="text-xs text-orange-600 mt-2">3 high priority</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">Conflicts</p>
          <p className="text-3xl font-bold text-red-600">3</p>
          <p className="text-xs text-red-600 mt-2">Requires attention</p>
        </div>
      </div>

      {/* Conflicts Alert */}
      {conflicts.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-900 mb-2">Schedule Conflicts Detected</h3>
              <div className="space-y-2">
                {conflicts.map((conflict, i) => (
                  <div key={i} className="text-sm text-red-800">
                    <span className="font-semibold">{conflict.type}:</span> {
                      conflict.type === 'Double Booking' ? `${conflict.room} at ${conflict.time} (${conflict.courses})` :
                      conflict.type === 'Capacity Issue' ? `${conflict.room} - ${conflict.course} (${conflict.enrolled}/${conflict.capacity} students)` :
                      `${conflict.instructor} at ${conflict.time} (${conflict.courses})`
                    }
                  </div>
                ))}
              </div>
              <button className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">
                Resolve Conflicts
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        {/* Room Occupancy Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Room Occupancy by Time Slot</h3>
          <div className="h-80 flex items-end justify-between gap-2">
            {occupancyData.map((slot, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div className="w-full relative" style={{height: '280px'}}>
                  <div 
                    className={`w-full absolute bottom-0 rounded-t-lg transition-all hover:opacity-80 cursor-pointer ${
                      slot.rate >= 85 ? 'bg-red-500' :
                      slot.rate >= 70 ? 'bg-orange-500' :
                      slot.rate >= 50 ? 'bg-blue-500' :
                      'bg-green-500'
                    }`}
                    style={{height: `${(slot.rate / 100) * 280}px`}}
                    title={`${slot.rooms}/${slot.capacity} rooms (${slot.rate}%)`}
                  >
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-700">
                      {slot.rate}%
                    </div>
                  </div>
                </div>
                <span className="text-xs text-gray-600 mt-2">{slot.time}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-xs text-gray-600">&lt;50% Low</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-xs text-gray-600">50-70% Moderate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-500 rounded"></div>
              <span className="text-xs text-gray-600">70-85% High</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-xs text-gray-600">&gt;85% Critical</span>
            </div>
          </div>
        </div>

        {/* Room Utilization by Building */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Room Utilization by Building</h3>
          <div className="space-y-4">
            {roomUtilization.map((building, i) => (
              <div key={i} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">{building.building}</h4>
                  <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                    building.rate >= 85 ? 'bg-red-100 text-red-700' :
                    building.rate >= 70 ? 'bg-orange-100 text-orange-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {building.rate}%
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm mb-2">
                  <div>
                    <p className="text-xs text-gray-500">Total</p>
                    <p className="font-bold text-gray-900">{building.total}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Occupied</p>
                    <p className="font-bold text-blue-600">{building.occupied}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Available</p>
                    <p className="font-bold text-green-600">{building.available}</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      building.rate >= 85 ? 'bg-red-500' :
                      building.rate >= 70 ? 'bg-orange-500' :
                      'bg-blue-500'
                    }`}
                    style={{width: `${building.rate}%`}}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Pending Changes */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Pending Schedule Changes</h3>
            <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">
              {pendingChanges.filter(c => c.status === 'Pending').length} pending
            </span>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {pendingChanges.map((change) => (
              <div key={change.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 text-xs font-bold rounded ${
                        change.type === 'Room Change' ? 'bg-blue-100 text-blue-700' :
                        change.type === 'Time Change' ? 'bg-purple-100 text-purple-700' :
                        change.type === 'Makeup Class' ? 'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {change.type}
                      </span>
                      <span className={`px-2 py-0.5 text-xs font-bold rounded ${
                        change.priority === 'High' ? 'bg-red-100 text-red-700' :
                        change.priority === 'Medium' ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {change.priority}
                      </span>
                      <span className={`px-2 py-0.5 text-xs font-bold rounded ${
                        change.status === 'Approved' ? 'bg-green-100 text-green-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {change.status}
                      </span>
                    </div>
                    <p className="font-semibold text-gray-900 text-sm">{change.course}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      {change.from && change.to ? (
                        <>From: <span className="font-semibold">{change.from}</span> → To: <span className="font-semibold">{change.to}</span></>
                      ) : change.date ? (
                        <>Date: <span className="font-semibold">{change.date}</span> {change.time && `at ${change.time}`}</>
                      ) : (
                        <span className="font-semibold">{change.reason}</span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Requested by: {change.requestedBy}</p>
                  </div>
                </div>
                {change.status === 'Pending' && (
                  <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
                    <button className="flex-1 px-3 py-1.5 bg-green-600 text-white rounded text-xs font-medium hover:bg-green-700">
                      Approve
                    </button>
                    <button className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-xs font-medium hover:bg-gray-50">
                      Review
                    </button>
                    <button className="flex-1 px-3 py-1.5 bg-red-600 text-white rounded text-xs font-medium hover:bg-red-700">
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Holidays */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Upcoming Holidays & Breaks</h3>
          <div className="space-y-4">
            {upcomingHolidays.map((holiday, i) => (
              <div key={i} className="p-4 border-l-4 border-purple-500 bg-purple-50 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{holiday.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{holiday.date}</p>
                    <span className="inline-block mt-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">
                      {holiday.type}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-purple-600">{holiday.daysAway}</p>
                    <p className="text-xs text-gray-500">days away</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <Calendar size={16} />
              Schedule Impact
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• 3 classes affected by National Day</li>
              <li>• 48 classes rescheduled for mid-semester break</li>
              <li>• 12 makeup classes scheduled</li>
            </ul>
          </div>

          <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-900 mb-2">Quick Stats</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-green-700">Teaching Days Left</p>
                <p className="text-2xl font-bold text-green-900">42</p>
              </div>
              <div>
                <p className="text-green-700">Exam Period</p>
                <p className="text-2xl font-bold text-green-900">Dec 15</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-4 gap-4">
          <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
              <Plus className="w-5 h-5 text-blue-600" />
            </div>
            <p className="font-semibold text-gray-900 text-sm">Add Class</p>
            <p className="text-xs text-gray-500 mt-1">Schedule new class</p>
          </button>
          <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all text-left">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3">
              <Search className="w-5 h-5 text-green-600" />
            </div>
            <p className="font-semibold text-gray-900 text-sm">Find Room</p>
            <p className="text-xs text-gray-500 mt-1">Check availability</p>
          </button>
          <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all text-left">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <p className="font-semibold text-gray-900 text-sm">Analytics</p>
            <p className="text-xs text-gray-500 mt-1">View detailed reports</p>
          </button>
          <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all text-left">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
              <Settings className="w-5 h-5 text-orange-600" />
            </div>
            <p className="font-semibold text-gray-900 text-sm">Settings</p>
            <p className="text-xs text-gray-500 mt-1">Configure schedules</p>
          </button>
        </div>
      </div>
    </div>
  );
};


const ClassOverview = () => {
  const [selectedSemester, setSelectedSemester] = useState('current');
  const [selectedFaculty, setSelectedFaculty] = useState('all');
  const [viewMode, setViewMode] = useState('overview');

  const classData = {
    totalClasses: 186,
    activeClasses: 178,
    completedClasses: 8,
    avgClassSize: 32,
    totalEnrollment: 5952,
    utilizationRate: 87,
    satisfactionRate: 4.3
  };

  const facultyClasses = [
    {
      id: 'fons',
      name: 'FONS',
      classes: 48,
      students: 1536,
      avgSize: 32,
      utilization: 92,
      color: 'purple'
    },
    {
      id: 'fom',
      name: 'FOM',
      classes: 42,
      students: 1344,
      avgSize: 32,
      utilization: 88,
      color: 'blue'
    },
    {
      id: 'fomac',
      name: 'FOMAC',
      classes: 38,
      students: 1216,
      avgSize: 32,
      utilization: 85,
      color: 'green'
    },
    {
      id: 'ins',
      name: 'INS',
      classes: 32,
      students: 1024,
      avgSize: 32,
      utilization: 83,
      color: 'orange'
    },
    {
      id: 'itm',
      name: 'ITM',
      classes: 26,
      students: 832,
      avgSize: 32,
      utilization: 79,
      color: 'pink'
    }
  ];

  const classTypes = [
    {
      type: 'Theory',
      count: 98,
      percentage: 53,
      icon: BookOpen,
      color: 'blue'
    },
    {
      type: 'Practical/Lab',
      count: 56,
      percentage: 30,
      icon: Target,
      color: 'green'
    },
    {
      type: 'Seminar',
      count: 22,
      percentage: 12,
      icon: Users,
      color: 'purple'
    },
    {
      type: 'Online',
      count: 10,
      percentage: 5,
      icon: Clock,
      color: 'orange'
    }
  ];

  const timeSlots = [
    { slot: '7:00 - 9:00', classes: 42, utilization: 95 },
    { slot: '9:00 - 11:00', classes: 48, utilization: 98 },
    { slot: '11:00 - 13:00', classes: 38, utilization: 87 },
    { slot: '13:00 - 15:00', classes: 35, utilization: 82 },
    { slot: '15:00 - 17:00', classes: 23, utilization: 68 }
  ];

  const recentActivities = [
    { class: 'CS301 - Data Structures', action: 'Class started', time: '30 min ago', type: 'success' },
    { class: 'BA205 - Marketing Strategy', action: 'Assignment due today', time: '2 hours ago', type: 'warning' },
    { class: 'DS402 - Machine Learning', action: 'Midterm scheduled', time: '5 hours ago', type: 'info' },
    { class: 'SE301 - Software Engineering', action: 'Project submission', time: '1 day ago', type: 'info' }
  ];

  const getFacultyColor = (color) => {
    switch(color) {
      case 'blue': return 'from-blue-400 to-blue-600';
      case 'green': return 'from-green-400 to-green-600';
      case 'purple': return 'from-purple-400 to-purple-600';
      case 'orange': return 'from-orange-400 to-orange-600';
      case 'pink': return 'from-pink-400 to-pink-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getIconColor = (color) => {
    switch(color) {
      case 'blue': return 'bg-blue-100 text-blue-600';
      case 'green': return 'bg-green-100 text-green-600';
      case 'purple': return 'bg-purple-100 text-purple-600';
      case 'orange': return 'bg-orange-100 text-orange-600';
      case 'pink': return 'bg-pink-100 text-pink-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Classes Overview</h1>
            <p className="text-sm text-gray-500 mt-1">Comprehensive view of all classes, schedules, and performance metrics</p>
          </div>
          <div className="flex items-center gap-3">
            <select 
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="current">Current Semester</option>
              <option value="fall2024">Fall 2024</option>
              <option value="spring2024">Spring 2024</option>
              <option value="fall2023">Fall 2023</option>
            </select>
            <select 
              value={selectedFaculty}
              onChange={(e) => setSelectedFaculty(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All Faculties</option>
              <option value="fons">FONS</option>
              <option value="fom">FOM</option>
              <option value="fomac">FOMAC</option>
              <option value="ins">INS</option>
              <option value="itm">ITM</option>
            </select>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
              Export Report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-1">Total Classes</p>
            <p className="text-3xl font-bold text-gray-900">{classData.totalClasses}</p>
            <p className="text-xs text-green-600 mt-2">↑ 12 vs last semester</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-1">Active Classes</p>
            <p className="text-3xl font-bold text-gray-900">{classData.activeClasses}</p>
            <p className="text-xs text-gray-600 mt-2">{classData.completedClasses} completed</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-1">Total Enrollment</p>
            <p className="text-3xl font-bold text-gray-900">{classData.totalEnrollment.toLocaleString()}</p>
            <p className="text-xs text-gray-600 mt-2">Avg: {classData.avgClassSize} per class</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-1">Utilization Rate</p>
            <p className="text-3xl font-bold text-gray-900">{classData.utilizationRate}%</p>
            <p className="text-xs text-green-600 mt-2">↑ 3% vs last semester</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Classes by Faculty</h3>
              <Building className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {facultyClasses.map((faculty) => (
                <div key={faculty.id}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">{faculty.name}</span>
                    <span className="text-sm font-bold text-gray-900">{faculty.classes} classes</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full bg-gradient-to-r ${getFacultyColor(faculty.color)}`}
                      style={{width: `${faculty.utilization}%`}}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{faculty.students} students • {faculty.utilization}% utilization</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Class Types</h3>
              <Target className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              {classTypes.map((type, i) => (
                <div key={i} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${getIconColor(type.color)} rounded-lg flex items-center justify-center`}>
                      <type.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{type.type}</p>
                      <p className="text-xs text-gray-500">{type.count} classes</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-gray-900">{type.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Recent Activities</h3>
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity, i) => (
                <div key={i} className="flex items-start gap-3 pb-3 border-b last:border-b-0">
                  <div className={`w-2 h-2 rounded-full mt-1.5 ${
                    activity.type === 'success' ? 'bg-green-500' :
                    activity.type === 'warning' ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-600">{activity.class}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-6">Time Slot Distribution</h3>
            <div className="space-y-4">
              {timeSlots.map((slot, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{slot.slot}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{slot.classes} classes</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="h-2.5 rounded-full bg-gradient-to-r from-blue-400 to-blue-600"
                      style={{width: `${slot.utilization}%`}}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{slot.utilization}% utilization</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-6">Class Performance Metrics</h3>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Average Attendance Rate</span>
                  <span className="text-2xl font-bold text-gray-900">92%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{width: '92%'}}></div>
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Student Satisfaction</span>
                  <span className="text-2xl font-bold text-gray-900">4.3/5.0</span>
                </div>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map((star) => (
                    <Award key={star} className={`w-5 h-5 ${star <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                  ))}
                </div>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Assignment Completion</span>
                  <span className="text-2xl font-bold text-gray-900">88%</span>
                </div>
                <div className="w-full bg-purple-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{width: '88%'}}></div>
                </div>
              </div>

              <div className="p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Pass Rate</span>
                  <span className="text-2xl font-bold text-gray-900">91%</span>
                </div>
                <div className="w-full bg-orange-200 rounded-full h-2">
                  <div className="bg-orange-600 h-2 rounded-full" style={{width: '91%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Top Performing Classes</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Class Code</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Class Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Faculty</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Enrolled</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Attendance</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Satisfaction</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Pass Rate</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[
                  { code: 'CS401', name: 'Artificial Intelligence', faculty: 'FONS', enrolled: 45, attendance: 96, satisfaction: 4.8, passRate: 94, status: 'Active' },
                  { code: 'BA305', name: 'Strategic Management', faculty: 'FOM', enrolled: 38, attendance: 94, satisfaction: 4.7, passRate: 92, status: 'Active' },
                  { code: 'DS402', name: 'Machine Learning', faculty: 'FONS', enrolled: 42, attendance: 95, satisfaction: 4.6, passRate: 91, status: 'Active' },
                  { code: 'MC301', name: 'Digital Marketing', faculty: 'FOMAC', enrolled: 35, attendance: 93, satisfaction: 4.5, passRate: 90, status: 'Active' },
                  { code: 'IT305', name: 'Cloud Computing', faculty: 'ITM', enrolled: 40, attendance: 92, satisfaction: 4.5, passRate: 89, status: 'Active' }
                ].map((classItem, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-semibold text-blue-600">{classItem.code}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{classItem.name}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{classItem.faculty}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-sm font-semibold text-gray-900">{classItem.enrolled}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-sm font-semibold text-gray-900">{classItem.attendance}%</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Award className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-semibold text-gray-900">{classItem.satisfaction}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-sm font-semibold text-gray-900">{classItem.passRate}%</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-300">
                        {classItem.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

   const StudentServicesOverview = () => {
    const [selectedService, setSelectedService] = useState(null);

    const services = [
      {
        id: 'housing',
        title: 'Housing Services',
        icon: Building,
        color: 'blue',
        stats: { total: 450, occupied: 387, available: 63 },
        description: 'Manage student dormitories, room assignments, and housing requests.',
        requests: 28,
        items: [
          { name: 'Dormitory A', capacity: 200, occupied: 178, rate: '$300/month' },
          { name: 'Dormitory B', capacity: 150, occupied: 132, rate: '$280/month' },
          { name: 'Dormitory C', capacity: 100, occupied: 77, rate: '$250/month' }
        ]
      },
      {
        id: 'scholarships',
        title: 'Scholarships',
        icon: Award,
        color: 'green',
        stats: { total: 892, active: 756, pending: 136 },
        description: 'Track scholarship applications, awards, and disbursements.',
        requests: 45,
        items: [
          { name: 'Merit-based Scholarship', recipients: 342, amount: '$2,000', status: 'Active' },
          { name: 'Need-based Scholarship', recipients: 198, amount: '$3,000', status: 'Active' },
          { name: 'Athletic Scholarship', recipients: 89, amount: '$2,500', status: 'Active' },
          { name: 'Research Scholarship', recipients: 127, amount: '$4,000', status: 'Active' }
        ]
      },
      {
        id: 'financial-aid',
        title: 'Financial Aid',
        icon: DollarSign,
        color: 'purple',
        stats: { total: 1248, approved: 1089, processing: 159 },
        description: 'Process student loans, grants, and financial assistance programs.',
        requests: 67,
        items: [
          { name: 'Student Loans', applicants: 456, avgAmount: '$8,500', status: 'Ongoing' },
          { name: 'Emergency Grants', applicants: 89, avgAmount: '$500', status: 'Available' },
          { name: 'Work-Study Programs', participants: 234, avgEarning: '$12/hour', status: 'Active' },
          { name: 'Tuition Payment Plans', enrolled: 469, avgMonthly: '$850', status: 'Active' }
        ]
      },
      {
        id: 'requests',
        title: 'Student Requests',
        icon: FileText,
        color: 'orange',
        stats: { total: 342, pending: 89, completed: 253 },
        description: 'Handle various student service requests and administrative forms.',
        requests: 89,
        items: [
          { name: 'Transcript Requests', pending: 23, avgTime: '2 days' },
          { name: 'Leave of Absence', pending: 12, avgTime: '5 days' },
          { name: 'Course Withdrawal', pending: 18, avgTime: '3 days' },
          { name: 'Grade Appeals', pending: 8, avgTime: '7 days' },
          { name: 'Transfer Credits', pending: 28, avgTime: '10 days' }
        ]
      },
      {
        id: 'clubs',
        title: 'Clubs & Activities',
        icon: Users,
        color: 'pink',
        stats: { total: 48, active: 45, forming: 3 },
        description: 'Manage student organizations, clubs, and extracurricular activities.',
        requests: 15,
        items: [
          { name: 'Tech Innovation Club', members: 156, meetings: 'Weekly', budget: '$2,500' },
          { name: 'Business Leaders Society', members: 89, meetings: 'Bi-weekly', budget: '$1,800' },
          { name: 'Volunteer Corps', members: 234, meetings: 'Monthly', budget: '$3,000' },
          { name: 'Sports & Recreation', members: 412, meetings: 'Weekly', budget: '$5,000' }
        ]
      },
      {
        id: 'disciplinary',
        title: 'Disciplinary Actions',
        icon: AlertTriangle,
        color: 'red',
        stats: { total: 45, active: 12, resolved: 33 },
        description: 'Track and manage student conduct violations and disciplinary proceedings.',
        requests: 12,
        items: [
          { name: 'Academic Integrity', cases: 18, severity: 'Medium', avgResolution: '15 days' },
          { name: 'Code of Conduct', cases: 15, severity: 'Low', avgResolution: '10 days' },
          { name: 'Attendance Violations', cases: 8, severity: 'Low', avgResolution: '7 days' },
          { name: 'Safety Violations', cases: 4, severity: 'High', avgResolution: '20 days' }
        ]
      }
    ];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Student Life Overview</h1>
            <p className="text-sm text-gray-500 mt-1">Comprehensive management of all student support services</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              onClick={() => setSelectedService(service)}
              className={`bg-white p-6 rounded-xl shadow-sm border-2 border-gray-100 hover:border-${service.color}-500 hover:shadow-lg transition-all cursor-pointer`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-14 h-14 bg-${service.color}-100 rounded-xl flex items-center justify-center`}>
                  <service.icon className={`w-7 h-7 text-${service.color}-600`} />
                </div>
                {service.requests > 0 && (
                  <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                    {service.requests} pending
                  </span>
                )}
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 mb-2">{service.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{service.description}</p>
              
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-200">
                {Object.entries(service.stats).map(([key, value]) => (
                  <div key={key}>
                    <p className="text-xs text-gray-500 capitalize">{key}</p>
                    <p className="text-lg font-bold text-gray-900">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Service Request Trends</h3>
            <div className="h-64 flex items-end justify-between gap-3">
              {[
                { housing: 18, scholarships: 32, financial: 45, requests: 67, clubs: 12, disciplinary: 8 },
                { housing: 22, scholarships: 38, financial: 52, requests: 72, clubs: 15, disciplinary: 6 },
                { housing: 25, scholarships: 42, financial: 58, requests: 78, clubs: 18, disciplinary: 10 },
                { housing: 28, scholarships: 45, financial: 67, requests: 89, clubs: 15, disciplinary: 12 }
              ].map((data, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex flex-col gap-0.5">
                    <div className="w-full bg-blue-500 rounded-t" style={{ height: `${data.housing}px` }}></div>
                    <div className="w-full bg-green-500" style={{ height: `${data.scholarships}px` }}></div>
                    <div className="w-full bg-purple-500" style={{ height: `${data.financial}px` }}></div>
                    <div className="w-full bg-orange-500" style={{ height: `${data.requests}px` }}></div>
                    <div className="w-full bg-pink-500" style={{ height: `${data.clubs}px` }}></div>
                    <div className="w-full bg-red-500" style={{ height: `${data.disciplinary}px` }}></div>
                  </div>
                  <span className="text-xs text-gray-500">Q{i + 1}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-gray-200">
              {services.map((service) => (
                <div key={service.id} className="flex items-center gap-2">
                  <div className={`w-3 h-3 bg-${service.color}-500 rounded`}></div>
                  <span className="text-xs text-gray-600">{service.title.split(' ')[0]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activities</h3>
            <div className="space-y-4">
              {[
                { service: 'Housing', action: 'New room assignment', student: 'S001234', time: '10 min ago', color: 'blue' },
                { service: 'Scholarships', action: 'Application approved', student: 'S001567', time: '25 min ago', color: 'green' },
                { service: 'Financial Aid', action: 'Loan disbursed', student: 'S001892', time: '1 hour ago', color: 'purple' },
                { service: 'Requests', action: 'Transcript issued', student: 'S002134', time: '2 hours ago', color: 'orange' },
                { service: 'Clubs', action: 'New member joined', student: 'S002456', time: '3 hours ago', color: 'pink' },
                { service: 'Disciplinary', action: 'Case resolved', student: 'S002789', time: '5 hours ago', color: 'red' }
              ].map((activity, i) => (
                <div key={i} className="flex items-start gap-3 pb-3 border-b last:border-b-0">
                  <div className={`w-2 h-2 rounded-full bg-${activity.color}-500 mt-1.5`}></div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-600">{activity.service} • {activity.student}</p>
                      </div>
                      <span className="text-xs text-gray-400">{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {selectedService && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedService(null)}>
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className={`bg-gradient-to-br from-${selectedService.color}-400 to-${selectedService.color}-600 p-6`}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-16 h-16 bg-white bg-opacity-20 rounded-xl flex items-center justify-center`}>
                    <selectedService.icon className="w-8 h-8 text-white" />
                  </div>
                  <button 
                    onClick={() => setSelectedService(null)}
                    className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg text-white"
                  >
                    ✕
                  </button>
                </div>
                <h2 className="text-3xl font-bold text-white">{selectedService.title}</h2>
                <p className="text-white text-opacity-90 mt-2">{selectedService.description}</p>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(selectedService.stats).map(([key, value]) => (
                    <div key={key} className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 uppercase font-semibold mb-1">{key}</p>
                      <p className="text-3xl font-bold text-gray-900">{renderValue(value)}</p>
                    </div>
                  ))}
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Details</h3>
                  <div className="space-y-3">
                    {selectedService.items.map((item, i) => (
                      <div key={i} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-gray-900">{item.name}</p>
                            <div className="flex gap-4 mt-2 text-sm text-gray-600">
                              {Object.entries(item).filter(([key]) => key !== 'name').map(([key, value]) => (
                                <span key={key}>
                                  <span className="text-gray-500 capitalize">{key}:</span> <span className="font-semibold">{value as React.ReactNode}</span>
                                </span>
                              ))}
                            </div>
                          </div>
                          <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-100">
                            Manage
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button className={`flex-1 px-4 py-2 bg-${selectedService.color}-600 text-white rounded-lg hover:bg-${selectedService.color}-700 font-medium`}>
                    View All Records
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
                    Export Report
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
                    Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
 const ViewRankings = () => {
  const [selectedFaculty, setSelectedFaculty] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [sortBy, setSortBy] = useState('overall');

  const faculties = [
    { id: 'fons', name: 'FONS', fullName: 'Faculty of Nontraditional Security', courses: 52 },
    { id: 'fom', name: 'FOM', fullName: 'Faculty of Management', courses: 48 },
    { id: 'fomac', name: 'FOMAC', fullName: 'Faculty of Marketing & Communication', courses: 51 }
  ];

  const rankingsData = [
    { id: 1, name: 'Dr. Nguyen Van Minh', faculty: 'fons', department: 'Computer Science', level: 'undergrad', courses: 4, students: 240, overallRating: 4.8, teaching: 4.9, knowledge: 4.8, communication: 4.7, support: 4.8, responses: 234 },
    { id: 2, name: 'Dr. Pham Thi Mai', faculty: 'fons', department: 'Data Science', level: 'postgrad', courses: 3, students: 145, overallRating: 4.7, teaching: 4.8, knowledge: 4.9, communication: 4.6, support: 4.7, responses: 142 },
    { id: 3, name: 'Dr. Bui Thi Ngoc', faculty: 'fomac', department: 'Digital Media', level: 'undergrad', courses: 4, students: 234, overallRating: 4.8, teaching: 4.9, knowledge: 4.8, communication: 4.7, support: 4.8, responses: 228 },
    { id: 4, name: 'Dr. Tran Thi Lan', faculty: 'fom', department: 'Business Administration', level: 'undergrad', courses: 5, students: 280, overallRating: 4.7, teaching: 4.8, knowledge: 4.7, communication: 4.6, support: 4.8, responses: 272 },
    { id: 5, name: 'Dr. Hoang Van Tuan', faculty: 'fons', department: 'Computer Science', level: 'undergrad', courses: 3, students: 165, overallRating: 4.6, teaching: 4.7, knowledge: 4.6, communication: 4.5, support: 4.6, responses: 159 },
    { id: 6, name: 'Dr. Nguyen Duc Anh', faculty: 'fom', department: 'Marketing', level: 'postgrad', courses: 3, students: 156, overallRating: 4.6, teaching: 4.7, knowledge: 4.6, communication: 4.5, support: 4.6, responses: 150 },
    { id: 7, name: 'Dr. Dao Van Hai', faculty: 'fomac', department: 'Journalism', level: 'postgrad', courses: 3, students: 142, overallRating: 4.6, teaching: 4.7, knowledge: 4.6, communication: 4.5, support: 4.6, responses: 138 },
    { id: 8, name: 'Dr. Le Thi Hoa', faculty: 'fons', department: 'Mathematics', level: 'undergrad', courses: 4, students: 198, overallRating: 4.5, teaching: 4.6, knowledge: 4.7, communication: 4.4, support: 4.5, responses: 192 },
    { id: 9, name: 'Dr. Le Van Cuong', faculty: 'fom', department: 'Finance', level: 'undergrad', courses: 4, students: 215, overallRating: 4.5, teaching: 4.6, knowledge: 4.7, communication: 4.4, support: 4.5, responses: 208 },
    { id: 10, name: 'Dr. Ngo Thi Lan', faculty: 'fomac', department: 'Public Relations', level: 'undergrad', courses: 4, students: 198, overallRating: 4.5, teaching: 4.6, knowledge: 4.5, communication: 4.4, support: 4.5, responses: 192 },
    { id: 11, name: 'Dr. Tran Van Long', faculty: 'fons', department: 'Physics', level: 'postgrad', courses: 2, students: 89, overallRating: 4.4, teaching: 4.5, knowledge: 4.6, communication: 4.3, support: 4.4, responses: 85 },
    { id: 12, name: 'Dr. Pham Thi Huong', faculty: 'fom', department: 'Human Resources', level: 'postgrad', courses: 2, students: 124, overallRating: 4.4, teaching: 4.5, knowledge: 4.5, communication: 4.3, support: 4.4, responses: 119 },
    { id: 13, name: 'Dr. Truong Van Thanh', faculty: 'fomac', department: 'Film & Video', level: 'postgrad', courses: 2, students: 97, overallRating: 4.4, teaching: 4.5, knowledge: 4.6, communication: 4.3, support: 4.4, responses: 94 },
    { id: 14, name: 'Dr. Vo Thanh Nam', faculty: 'fom', department: 'International Business', level: 'undergrad', courses: 3, students: 189, overallRating: 4.3, teaching: 4.4, knowledge: 4.5, communication: 4.2, support: 4.3, responses: 182 },
    { id: 15, name: 'Dr. Dinh Thi Ha', faculty: 'fomac', department: 'Graphic Design', level: 'undergrad', courses: 3, students: 176, overallRating: 4.3, teaching: 4.4, knowledge: 4.4, communication: 4.2, support: 4.3, responses: 171 }
  ];

  const filteredData = rankingsData.filter(item => {
    if (selectedFaculty !== 'all' && item.faculty !== selectedFaculty) return false;
    if (selectedLevel !== 'all' && item.level !== selectedLevel) return false;
    return true;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    switch(sortBy) {
      case 'overall': return b.overallRating - a.overallRating;
      case 'teaching': return b.teaching - a.teaching;
      case 'knowledge': return b.knowledge - a.knowledge;
      case 'communication': return b.communication - a.communication;
      case 'support': return b.support - a.support;
      default: return b.overallRating - a.overallRating;
    }
  });

  const topPerformers = sortedData.slice(0, 3);
  const avgOverallRating = (filteredData.reduce((sum, item) => sum + item.overallRating, 0) / filteredData.length).toFixed(2);
  const totalResponses = filteredData.reduce((sum, item) => sum + item.responses, 0);
  const totalStudents = filteredData.reduce((sum, item) => sum + item.students, 0);

  const getRatingColor = (rating) => {
    if (rating >= 4.7) return 'text-green-600 bg-green-100';
    if (rating >= 4.4) return 'text-blue-600 bg-blue-100';
    if (rating >= 4.0) return 'text-yellow-600 bg-yellow-100';
    return 'text-orange-600 bg-orange-100';
  };

  const getFacultyColor = (faculty) => {
    switch(faculty) {
      case 'fons': return 'blue';
      case 'fom': return 'green';
      case 'fomac': return 'purple';
      default: return 'gray';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Faculty Rankings</h1>
            <p className="text-sm text-gray-500 mt-1">Based on student feedback - Semester 2, 2024</p>
          </div>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium">
            Export Report
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-sm text-gray-500 mb-1">Total Faculty</p>
            <p className="text-3xl font-bold text-gray-900">{filteredData.length}</p>
            <p className="text-xs text-gray-600 mt-2">Evaluated this semester</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
              <Award className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-sm text-gray-500 mb-1">Avg Rating</p>
            <p className="text-3xl font-bold text-gray-900">{avgOverallRating}/5.0</p>
            <p className="text-xs text-green-600 mt-2">↑ 0.2 vs last semester</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
              <MessageSquare className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-sm text-gray-500 mb-1">Responses</p>
            <p className="text-3xl font-bold text-gray-900">{totalResponses}</p>
            <p className="text-xs text-gray-600 mt-2">From {totalStudents} students</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <p className="text-sm text-gray-500 mb-1">Response Rate</p>
            <p className="text-3xl font-bold text-gray-900">{((totalResponses/totalStudents)*100).toFixed(0)}%</p>
            <p className="text-xs text-green-600 mt-2">Excellent engagement</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-8 rounded-xl border border-yellow-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Award className="w-7 h-7 text-yellow-600" />
            Top 3 Performers
          </h2>
          <div className="grid grid-cols-3 gap-6">
            {topPerformers.map((lecturer, index) => (
              <div key={lecturer.id} className="bg-white p-6 rounded-xl shadow-sm border-2 border-yellow-300 relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-16 h-16 transform rotate-45 translate-x-6 -translate-y-6 ${
                  index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                  index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                  'bg-gradient-to-br from-orange-400 to-orange-600'
                }`}></div>
                <div className="absolute top-3 right-3 text-white font-bold text-lg">#{index + 1}</div>
                
                <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-4"></div>
                <h3 className="text-center font-bold text-gray-900 text-lg mb-1">{lecturer.name}</h3>
                <p className="text-center text-sm text-gray-600 mb-1">{lecturer.department}</p>
                <p className="text-center text-xs text-gray-500 mb-4">
                  {faculties.find(f => f.id === lecturer.faculty)?.name}
                </p>
                
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Award className="w-5 h-5 text-yellow-600" />
                  <span className="text-3xl font-bold text-gray-900">{lecturer.overallRating}</span>
                  <span className="text-gray-500">/5.0</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2 bg-gray-50 rounded">
                    <p className="text-gray-500">Teaching</p>
                    <p className="font-bold text-gray-900">{lecturer.teaching}</p>
                  </div>
                  <div className="p-2 bg-gray-50 rounded">
                    <p className="text-gray-500">Knowledge</p>
                    <p className="font-bold text-gray-900">{lecturer.knowledge}</p>
                  </div>
                  <div className="p-2 bg-gray-50 rounded">
                    <p className="text-gray-500">Support</p>
                    <p className="font-bold text-gray-900">{lecturer.support}</p>
                  </div>
                  <div className="p-2 bg-gray-50 rounded">
                    <p className="text-gray-500">Responses</p>
                    <p className="font-bold text-gray-900">{lecturer.responses}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <select 
                value={selectedFaculty}
                onChange={(e) => setSelectedFaculty(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Faculties</option>
                {faculties.map(f => (
                  <option key={f.id} value={f.id}>{f.name} - {f.fullName}</option>
                ))}
              </select>
              
              <select 
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Levels</option>
                <option value="undergrad">Undergraduate</option>
                <option value="postgrad">Postgraduate</option>
              </select>

              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="overall">Sort by Overall Rating</option>
                <option value="teaching">Sort by Teaching Quality</option>
                <option value="knowledge">Sort by Subject Knowledge</option>
                <option value="communication">Sort by Communication</option>
                <option value="support">Sort by Student Support</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Lecturer</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Faculty</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Overall</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Teaching</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Knowledge</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Communication</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Support</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Responses</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedData.map((lecturer, index) => (
                  <tr key={lecturer.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                        index < 3 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {index + 1}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">{lecturer.name}</p>
                        <p className="text-xs text-gray-500">{lecturer.department}</p>
                        <p className="text-xs text-gray-400">{lecturer.courses} courses • {lecturer.students} students</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium bg-${getFacultyColor(lecturer.faculty)}-100 text-${getFacultyColor(lecturer.faculty)}-700`}>
                        {faculties.find(f => f.id === lecturer.faculty)?.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${getRatingColor(lecturer.overallRating)}`}>
                        {lecturer.overallRating}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-sm font-semibold text-gray-900">{lecturer.teaching}</td>
                    <td className="px-6 py-4 text-center text-sm font-semibold text-gray-900">{lecturer.knowledge}</td>
                    <td className="px-6 py-4 text-center text-sm font-semibold text-gray-900">{lecturer.communication}</td>
                    <td className="px-6 py-4 text-center text-sm font-semibold text-gray-900">{lecturer.support}</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">{lecturer.responses}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {faculties.map((faculty) => {
            const facultyData = rankingsData.filter(l => l.faculty === faculty.id);
            const avgRating = (facultyData.reduce((sum, l) => sum + l.overallRating, 0) / facultyData.length).toFixed(2);
            const topRated = [...facultyData].sort((a, b) => b.overallRating - a.overallRating).slice(0, 3);
            
            return (
              <div key={faculty.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{faculty.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{faculty.fullName}</p>
                
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">Average Rating</span>
                    <span className="text-2xl font-bold text-gray-900">{avgRating}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>{facultyData.length} faculty</span>
                    <span>{faculty.courses} courses</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Top Rated</p>
                  {topRated.map((lecturer, i) => (
                    <div key={i} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-500">{i + 1}.</span>
                        <span className="text-gray-900 font-medium text-xs">{lecturer.name.split(' ').slice(-2).join(' ')}</span>
                      </div>
                      <span className="font-bold text-green-600">{lecturer.overallRating}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
  const LecturersOverview = () => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [filterDepartment, setFilterDepartment] = useState('all');

    const categories = [
      {
        id: 'workload',
        title: 'Workload Distribution',
        icon: Clock,
        color: 'blue',
        stats: { avgHours: '14.8h', maxLoad: '20h', minLoad: '8h' },
        description: 'Track teaching hours, course load, and workload balance across faculty.',
        data: [
          { name: 'Dr. Nguyen Van Minh', dept: 'Computer Science', hours: 16, courses: 4, students: 240, status: 'Optimal' },
          { name: 'Dr. Tran Thi Lan', dept: 'Business Admin', hours: 18, courses: 5, students: 280, status: 'High' },
          { name: 'Dr. Le Van Hieu', dept: 'Software Engineering', hours: 14, courses: 3, students: 180, status: 'Optimal' },
          { name: 'Dr. Pham Thi Mai', dept: 'Data Science', hours: 15, courses: 4, students: 220, status: 'Optimal' },
          { name: 'Dr. Hoang Van Tuan', dept: 'Computer Science', hours: 12, courses: 3, students: 165, status: 'Low' }
        ]
      },
      {
        id: 'performance',
        title: 'Teaching Performance',
        icon: TrendingUp,
        color: 'green',
        stats: { avgRating: '4.3/5', topRated: 47, needsImprovement: 12 },
        description: 'Monitor student evaluations, teaching quality, and performance metrics.',
        data: [
          { name: 'Dr. Nguyen Van Minh', rating: 4.7, studentFeedback: 156, passRate: '94%', engagement: 'High' },
          { name: 'Dr. Tran Thi Lan', rating: 4.5, studentFeedback: 189, passRate: '91%', engagement: 'High' },
          { name: 'Dr. Le Van Hieu', rating: 4.2, studentFeedback: 134, passRate: '88%', engagement: 'Medium' },
          { name: 'Dr. Pham Thi Mai', rating: 4.8, studentFeedback: 178, passRate: '96%', engagement: 'High' },
          { name: 'Dr. Hoang Van Tuan', rating: 4.1, studentFeedback: 98, passRate: '87%', engagement: 'Medium' }
        ]
      },
      {
        id: 'research',
        title: 'Research Output',
        icon: FileText,
        color: 'purple',
        stats: { totalPubs: 1248, avgPerFaculty: 4.2, hIndex: '18.5' },
        description: 'Track publications, research projects, citations, and academic contributions.',
        data: [
          { name: 'Dr. Nguyen Van Minh', publications: 24, citations: 342, projects: 5, grants: '$125,000' },
          { name: 'Dr. Tran Thi Lan', publications: 38, citations: 567, projects: 8, grants: '$245,000' },
          { name: 'Dr. Le Van Hieu', publications: 12, citations: 189, projects: 3, grants: '$78,000' },
          { name: 'Dr. Pham Thi Mai', publications: 31, citations: 489, projects: 6, grants: '$198,000' },
          { name: 'Dr. Hoang Van Tuan', publications: 18, citations: 276, projects: 4, grants: '$92,000' }
        ]
      },
      {
        id: 'development',
        title: 'Professional Development',
        icon: Award,
        color: 'orange',
        stats: { workshops: 89, certifications: 134, conferences: 67 },
        description: 'Monitor faculty training, workshops, certifications, and skill development.',
        data: [
          { name: 'Dr. Nguyen Van Minh', workshops: 8, conferences: 5, certifications: 3, lastTraining: '2 weeks ago' },
          { name: 'Dr. Tran Thi Lan', workshops: 12, conferences: 8, certifications: 5, lastTraining: '1 week ago' },
          { name: 'Dr. Le Van Hieu', workshops: 5, conferences: 3, certifications: 2, lastTraining: '1 month ago' },
          { name: 'Dr. Pham Thi Mai', workshops: 10, conferences: 6, certifications: 4, lastTraining: '3 weeks ago' },
          { name: 'Dr. Hoang Van Tuan', workshops: 6, conferences: 4, certifications: 2, lastTraining: '2 months ago' }
        ]
      },
      {
        id: 'community',
        title: 'Community Engagement',
        icon: Users,
        color: 'pink',
        stats: { totalHours: 35640, avgPerFaculty: 120, activeProjects: 45 },
        description: 'Track community service, outreach programs, and social impact initiatives.',
        data: [
          { name: 'Dr. Nguyen Van Minh', hours: 120, projects: 4, impact: 'High', focus: 'STEM Education' },
          { name: 'Dr. Tran Thi Lan', hours: 145, projects: 6, impact: 'High', focus: 'Business Mentorship' },
          { name: 'Dr. Le Van Hieu', hours: 95, projects: 3, impact: 'Medium', focus: 'Tech Literacy' },
          { name: 'Dr. Pham Thi Mai', hours: 130, projects: 5, impact: 'High', focus: 'Data for Good' },
          { name: 'Dr. Hoang Van Tuan', hours: 105, projects: 3, impact: 'Medium', focus: 'Youth Coding' }
        ]
      },
      {
        id: 'recognition',
        title: 'Awards & Recognition',
        icon: Award,
        color: 'yellow',
        stats: { totalAwards: 156, teachingAwards: 67, researchAwards: 89 },
        description: 'Showcase faculty achievements, honors, and institutional recognition.',
        data: [
          { name: 'Dr. Nguyen Van Minh', awards: 5, latest: 'Best Teaching Award 2024', type: 'Teaching' },
          { name: 'Dr. Tran Thi Lan', awards: 8, latest: 'Outstanding Research 2024', type: 'Research' },
          { name: 'Dr. Le Van Hieu', awards: 3, latest: 'Innovation Award 2023', type: 'Innovation' },
          { name: 'Dr. Pham Thi Mai', awards: 7, latest: 'Excellence in Mentorship 2024', type: 'Mentorship' },
          { name: 'Dr. Hoang Van Tuan', awards: 4, latest: 'Community Impact 2023', type: 'Service' }
        ]
      }
    ];

    const departments = [
      { name: 'Computer Science', faculty: 45, avgAge: 42, phd: '100%' },
      { name: 'Business Administration', faculty: 38, avgAge: 45, phd: '95%' },
      { name: 'Software Engineering', faculty: 32, avgAge: 39, phd: '97%' },
      { name: 'Data Science', faculty: 28, avgAge: 38, phd: '100%' },
      { name: 'Information Systems', faculty: 24, avgAge: 41, phd: '92%' }
    ];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Lecturers Overview</h1>
            <p className="text-sm text-gray-500 mt-1">Comprehensive analytics and insights on faculty performance and development</p>
          </div>
          <select 
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Departments</option>
            <option value="cs">Computer Science</option>
            <option value="ba">Business Administration</option>
            <option value="se">Software Engineering</option>
            <option value="ds">Data Science</option>
            <option value="is">Information Systems</option>
          </select>
        </div>

        <div className="grid grid-cols-5 gap-4">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-1">Total Faculty</p>
            <p className="text-3xl font-bold text-gray-900">297</p>
            <p className="text-xs text-gray-600 mt-2">Across 5 departments</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-1">Avg Performance</p>
            <p className="text-3xl font-bold text-gray-900">4.3/5</p>
            <p className="text-xs text-green-600 mt-2">↑ 0.2 vs last year</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-1">Publications</p>
            <p className="text-3xl font-bold text-gray-900">1,248</p>
            <p className="text-xs text-green-600 mt-2">↑ 12% vs last year</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-1">Avg Workload</p>
            <p className="text-3xl font-bold text-gray-900">14.8h</p>
            <p className="text-xs text-gray-600 mt-2">Per week</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-pink-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-1">Awards</p>
            <p className="text-3xl font-bold text-gray-900">156</p>
            <p className="text-xs text-gray-600 mt-2">This academic year</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => setSelectedCategory(category)}
              className={`bg-white p-6 rounded-xl shadow-sm border-2 border-gray-100 hover:border-${category.color}-500 hover:shadow-lg transition-all cursor-pointer`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-14 h-14 bg-${category.color}-100 rounded-xl flex items-center justify-center`}>
                  <category.icon className={`w-7 h-7 text-${category.color}-600`} />
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 mb-2">{category.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{category.description}</p>
              
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-200">
                {Object.entries(category.stats).map(([key, value]) => (
                  <div key={key}>
                    <p className="text-xs text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                    <p className="text-sm font-bold text-gray-900">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Department Distribution</h3>
            <div className="space-y-4">
              {departments.map((dept, i) => (
                <div key={i} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">{dept.name}</h4>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                      {dept.faculty} faculty
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 text-xs">Avg Age</p>
                      <p className="font-semibold text-gray-900">{dept.avgAge} years</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">PhD Rate</p>
                      <p className="font-semibold text-gray-900">{dept.phd}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Status</p>
                      <p className="font-semibold text-green-600">Active</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Faculty Composition</h3>
            <div className="space-y-4">
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700 font-medium">Professors</span>
                  <span className="text-lg font-bold text-gray-900">45 (15%)</span>
                </div>
                <div className="w-full bg-purple-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{width: '15%'}}></div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700 font-medium">Associate Professors</span>
                  <span className="text-lg font-bold text-gray-900">102 (34%)</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{width: '34%'}}></div>
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700 font-medium">Senior Lecturers</span>
                  <span className="text-lg font-bold text-gray-900">78 (26%)</span>
                </div>
                <div className="w-full bg-green-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{width: '26%'}}></div>
                </div>
              </div>

              <div className="p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700 font-medium">Lecturers</span>
                  <span className="text-lg font-bold text-gray-900">72 (25%)</span>
                </div>
                <div className="w-full bg-orange-200 rounded-full h-2">
                  <div className="bg-orange-600 h-2 rounded-full" style={{width: '25%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {selectedCategory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedCategory(null)}>
            <div className="bg-white rounded-xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className={`bg-gradient-to-br from-${selectedCategory.color}-400 to-${selectedCategory.color}-600 p-6`}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-16 h-16 bg-white bg-opacity-20 rounded-xl flex items-center justify-center`}>
                    <selectedCategory.icon className="w-8 h-8 text-white" />
                  </div>
                  <button 
                    onClick={() => setSelectedCategory(null)}
                    className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg text-white"
                  >
                    ✕
                  </button>
                </div>
                <h2 className="text-3xl font-bold text-white">{selectedCategory.title}</h2>
                <p className="text-white text-opacity-90 mt-2">{selectedCategory.description}</p>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(selectedCategory.stats).map(([key, value]) => (
                    <div key={key} className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                      <p className="text-2xl font-bold text-gray-900">{value as React.ReactNode}</p>
                    </div>
                  ))}
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Faculty Details</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
                          {Object.keys(selectedCategory.data[0])
                            .filter(key => key !== 'name' && key !== 'dept')
                            .map(key => (
                              <th key={key} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </th>
                            ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedCategory.data.map((item, i) => (
                          <tr key={i} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                              <div>
                                <p>{item.name}</p>
                                {item.dept && <p className="text-xs text-gray-500">{item.dept}</p>}
                              </div>
                            </td>
                            {Object.entries(item)
                              .filter(([key]) => key !== 'name' && key !== 'dept')
                              .map(([key, value]) => (
                                <td key={key} className="px-4 py-3 text-sm text-gray-600">
                                  {key === 'status' ? (
                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                      value === 'High' ? 'bg-red-100 text-red-700' :
                                      value === 'Optimal' ? 'bg-green-100 text-green-700' :
                                      'bg-yellow-100 text-yellow-700'
                                    }`}>
                                      {value as React.ReactNode}
                                    </span>
                                  ) : key === 'engagement' || key === 'impact' ? (
                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                      value === 'High' ? 'bg-green-100 text-green-700' :
                                      'bg-blue-100 text-blue-700'
                                    }`}>
                                      {value as React.ReactNode}
                                    </span>
                                  ) : (
                                    <span className="font-semibold">{value as React.ReactNode}</span>
                                  )}
                                </td>
                              ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button className={`flex-1 px-4 py-2 bg-${selectedCategory.color}-600 text-white rounded-lg hover:bg-${selectedCategory.color}-700 font-medium`}>
                    Export Full Report
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
                    View Analytics
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
                    Compare Faculty
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

const CurriculumManagement = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedFaculty, setSelectedFaculty] = useState('all');
  const [selectedCurriculum, setSelectedCurriculum] = useState(null);

  const curriculumStats = {
    totalCurricula: 42,
    pending: 8,
    approved: 28,
    rejected: 6,
    activeReviews: 12
  };

  const facultyData = [
    { faculty: 'FONS', curricula: 12, pending: 3, approved: 8, rejected: 1 },
    { faculty: 'FOM', curricula: 10, pending: 2, approved: 7, rejected: 1 },
    { faculty: 'FOMAC', curricula: 8, pending: 1, approved: 6, rejected: 1 },
    { faculty: 'INS', curricula: 7, pending: 1, approved: 5, rejected: 1 },
    { faculty: 'ITM', curricula: 5, pending: 1, approved: 2, rejected: 2 }
  ];

  const pendingCurricula = [
    {
      id: 'CUR001',
      title: 'Bachelor of Computer Science - 2025',
      faculty: 'FONS',
      submittedBy: 'Dr. Nguyen Van Minh',
      submittedDate: '2025-10-10',
      type: 'Major Revision',
      status: 'Pending Review',
      priority: 'High',
      changes: 'Added 3 new AI courses, removed 2 outdated courses',
      reviewers: ['Dr. Tran Thi Lan', 'Dr. Le Van Hieu']
    },
    {
      id: 'CUR002',
      title: 'MBA Program Curriculum Update',
      faculty: 'FOM',
      submittedBy: 'Dr. Pham Thi Mai',
      submittedDate: '2025-10-12',
      type: 'Minor Update',
      status: 'Under Review',
      priority: 'Medium',
      changes: 'Updated course descriptions and prerequisites',
      reviewers: ['Dr. Hoang Van Tuan']
    },
    {
      id: 'CUR003',
      title: 'Digital Media Arts - New Program',
      faculty: 'FOMAC',
      submittedBy: 'Dr. Bui Thi Ngoc',
      submittedDate: '2025-10-14',
      type: 'New Program',
      status: 'Pending Review',
      priority: 'High',
      changes: 'Complete new program proposal with 120 credits',
      reviewers: ['Dr. Dao Van Hai', 'Dr. Le Thi Hoa']
    },
    {
      id: 'CUR004',
      title: 'Data Science Specialization',
      faculty: 'FONS',
      submittedBy: 'Dr. Le Van Cuong',
      submittedDate: '2025-10-15',
      type: 'New Specialization',
      status: 'Pending Review',
      priority: 'Medium',
      changes: 'New specialization track with 6 core courses',
      reviewers: ['Dr. Tran Van Long']
    }
  ];

  const approvedCurricula = [
    {
      id: 'CUR005',
      title: 'Bachelor of Business Administration - 2025',
      faculty: 'FOM',
      approvedBy: 'Academic Committee',
      approvedDate: '2025-09-28',
      effectiveDate: '2026-01-01',
      type: 'Major Revision'
    },
    {
      id: 'CUR006',
      title: 'Information Systems Program Update',
      faculty: 'INS',
      approvedBy: 'Curriculum Board',
      approvedDate: '2025-09-25',
      effectiveDate: '2025-11-01',
      type: 'Minor Update'
    }
  ];

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'pending review': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'under review': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'approved': return 'bg-green-100 text-green-700 border-green-300';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority.toLowerCase()) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-orange-600';
      case 'low': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Curriculum Management</h1>
            <p className="text-sm text-gray-500 mt-1">Review, approve, and manage curriculum changes across all faculties</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
              <Upload className="w-4 h-4" />
              Submit New
            </button>
          </div>
        </div>

        <div className="grid grid-cols-6 gap-6">
          {/* Left Side - Data Representation (1/6) */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-center mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mb-1 text-center">Total Curricula</p>
                <p className="text-3xl font-bold text-gray-900 text-center">{curriculumStats.totalCurricula}</p>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-center mb-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mb-1 text-center">Pending Approval</p>
                <p className="text-3xl font-bold text-gray-900 text-center">{curriculumStats.pending}</p>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-center mb-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mb-1 text-center">Approved</p>
                <p className="text-3xl font-bold text-gray-900 text-center">{curriculumStats.approved}</p>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-center mb-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mb-1 text-center">Active Reviews</p>
                <p className="text-3xl font-bold text-gray-900 text-center">{curriculumStats.activeReviews}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">By Faculty</h3>
              <div className="space-y-3">
                {facultyData.map((faculty, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600">{faculty.faculty}</span>
                      <span className="text-sm font-bold text-gray-900">{faculty.curricula}</span>
                    </div>
                    <div className="flex gap-2 text-xs">
                      <span className="text-yellow-600">⏳ {faculty.pending}</span>
                      <span className="text-green-600">✓ {faculty.approved}</span>
                      <span className="text-red-600">✗ {faculty.rejected}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">Recent Activity</h3>
              <div className="space-y-2">
                {[
                  { action: 'Approved', item: 'BBA Curriculum 2025', time: '2 hours ago', type: 'success' },
                  { action: 'Submitted', item: 'New CS Program', time: '5 hours ago', type: 'info' }
                ].map((activity, i) => (
                  <div key={i} className="flex items-start gap-2 pb-2 border-b last:border-b-0">
                    <div className={`w-2 h-2 rounded-full mt-1 ${
                      activity.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-600">{activity.item}</p>
                      <p className="text-xs text-gray-400">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Functionality (5/6) */}
          <div className="col-span-5 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setActiveTab('pending')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === 'pending' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      Pending ({pendingCurricula.length})
                    </button>
                    <button
                      onClick={() => setActiveTab('approved')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === 'approved' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      Approved ({approvedCurricula.length})
                    </button>
                    <button
                      onClick={() => setActiveTab('rejected')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === 'rejected' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      Rejected (6)
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search curricula..."
                        className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-64"
                      />
                    </div>
                    <select 
                      value={selectedFaculty}
                      onChange={(e) => setSelectedFaculty(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value="all">All Faculties</option>
                      <option value="fons">FONS</option>
                      <option value="fom">FOM</option>
                      <option value="fomac">FOMAC</option>
                      <option value="ins">INS</option>
                      <option value="itm">ITM</option>
                    </select>
                  </div>
                </div>
              </div>

              {activeTab === 'pending' && (
                <div className="p-6">
                  <div className="space-y-4">
                    {pendingCurricula.map((curriculum) => (
                      <div key={curriculum.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-bold text-gray-900">{curriculum.title}</h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(curriculum.status)}`}>
                                {curriculum.status}
                              </span>
                              <span className={`text-xs font-semibold ${getPriorityColor(curriculum.priority)}`}>
                                {curriculum.priority} Priority
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                              <span className="flex items-center gap-1">
                                <BookOpen className="w-4 h-4" />
                                {curriculum.faculty}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                {curriculum.submittedBy}
                              </span>
                              <span className="flex items-center gap-1">
                                <FileText className="w-4 h-4" />
                                {curriculum.type}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 mb-3">
                              <span className="font-semibold">Changes:</span> {curriculum.changes}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span>Submitted: {curriculum.submittedDate}</span>
                              <span>•</span>
                              <span>Reviewers: {curriculum.reviewers.join(', ')}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                          <button 
                            onClick={() => setSelectedCurriculum(curriculum)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                          >
                            <Eye className="w-4 h-4" />
                            Review
                          </button>
                          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium">
                            <Check className="w-4 h-4" />
                            Approve
                          </button>
                          <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium">
                            <X className="w-4 h-4" />
                            Reject
                          </button>
                          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium">
                            <MessageSquare className="w-4 h-4" />
                            Request Changes
                          </button>
                          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium ml-auto">
                            <Download className="w-4 h-4" />
                            Download
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'approved' && (
                <div className="p-6">
                  <div className="space-y-4">
                    {approvedCurricula.map((curriculum) => (
                      <div key={curriculum.id} className="border border-green-200 bg-green-50 rounded-lg p-5">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-bold text-gray-900">{curriculum.title}</h3>
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-300">
                                Approved
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                              <span className="flex items-center gap-1">
                                <BookOpen className="w-4 h-4" />
                                {curriculum.faculty}
                              </span>
                              <span className="flex items-center gap-1">
                                <CheckCircle className="w-4 h-4" />
                                {curriculum.approvedBy}
                              </span>
                              <span className="flex items-center gap-1">
                                <FileText className="w-4 h-4" />
                                {curriculum.type}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span>Approved: {curriculum.approvedDate}</span>
                              <span>•</span>
                              <span>Effective: {curriculum.effectiveDate}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 pt-4 border-t border-green-200">
                          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>
                          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 bg-white rounded-lg hover:bg-gray-50 text-sm font-medium">
                            <Download className="w-4 h-4" />
                            Download
                          </button>
                          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 bg-white rounded-lg hover:bg-gray-50 text-sm font-medium">
                            <Edit className="w-4 h-4" />
                            Revise
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {selectedCurriculum && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedCurriculum(null)}>
            <div className="bg-white rounded-xl shadow-xl w-full h-[90vh] flex" onClick={(e) => e.stopPropagation()}>
              {/* Left Side - PDF Viewer with Highlights */}
              <div className="w-2/3 border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <h3 className="font-semibold text-gray-900">Curriculum Document</h3>
                  <p className="text-sm text-gray-600">{selectedCurriculum.title}</p>
                </div>
                <div className="flex-1 overflow-auto p-6 bg-gray-100">
                  {/* PDF Viewer Simulation */}
                  <div className="bg-white rounded-lg shadow-lg p-8 max-w-3xl mx-auto">
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedCurriculum.title}</h2>
                        <p className="text-sm text-gray-600">Faculty: {selectedCurriculum.faculty}</p>
                        <p className="text-sm text-gray-600">Version: 2025.1</p>
                      </div>

                      <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4 rounded">
                        <p className="text-sm font-semibold text-gray-900 mb-2">📝 Highlighted Changes</p>
                        <p className="text-sm text-gray-700">{selectedCurriculum.changes}</p>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3">Course Structure</h3>
                        <div className="space-y-2">
                          <div className="p-3 bg-gray-50 rounded border border-gray-200">
                            <p className="font-semibold text-sm">Semester 1 - Core Courses</p>
                            <p className="text-xs text-gray-600">Total Credits: 18</p>
                          </div>
                          <div className="p-3 bg-green-50 rounded border-l-4 border-green-500">
                            <p className="font-semibold text-sm text-green-900">✨ NEW: CS401 - Artificial Intelligence Fundamentals</p>
                            <p className="text-xs text-green-700">3 Credits | Added in this revision</p>
                          </div>
                          <div className="p-3 bg-green-50 rounded border-l-4 border-green-500">
                            <p className="font-semibold text-sm text-green-900">✨ NEW: CS402 - Machine Learning Basics</p>
                            <p className="text-xs text-green-700">3 Credits | Added in this revision</p>
                          </div>
                          <div className="p-3 bg-gray-50 rounded border border-gray-200">
                            <p className="font-semibold text-sm">CS301 - Data Structures</p>
                            <p className="text-xs text-gray-600">3 Credits | No changes</p>
                          </div>
                          <div className="p-3 bg-red-50 rounded border-l-4 border-red-500 line-through opacity-50">
                            <p className="font-semibold text-sm text-red-900">❌ REMOVED: CS205 - Assembly Language</p>
                            <p className="text-xs text-red-700">3 Credits | Removed in this revision</p>
                          </div>
                        </div>
                      </div>

                      <div className="border-l-4 border-blue-400 bg-blue-50 p-4 rounded">
                        <p className="text-sm font-semibold text-gray-900 mb-2">📊 Summary of Changes</p>
                        <ul className="text-sm text-gray-700 space-y-1">
                          <li>• Added: 3 new courses (9 credits)</li>
                          <li>• Removed: 2 outdated courses (6 credits)</li>
                          <li>• Modified: 1 course prerequisite</li>
                          <li>• Net change: +3 credits</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Review Panel */}
              <div className="w-1/3 flex flex-col">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Review Panel</h2>
                  <button 
                    onClick={() => setSelectedCurriculum(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="flex-1 overflow-auto p-6 space-y-6">
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Submitted By</p>
                      <p className="font-semibold text-gray-900">{selectedCurriculum.submittedBy}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Submission Date</p>
                      <p className="font-semibold text-gray-900">{selectedCurriculum.submittedDate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Type</p>
                      <p className="font-semibold text-gray-900">{selectedCurriculum.type}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Priority</p>
                      <p className={`font-semibold ${getPriorityColor(selectedCurriculum.priority)}`}>{selectedCurriculum.priority}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Status</p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedCurriculum.status)}`}>
                        {selectedCurriculum.status}
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-2">Assigned Reviewers</p>
                    <div className="space-y-2">
                      {selectedCurriculum.reviewers.map((reviewer, i) => (
                        <div key={i} className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                          <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold text-blue-700">
                            {reviewer.charAt(0)}
                          </div>
                          <span className="text-sm text-blue-900">{reviewer}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-900 mb-2">Review Comments</p>
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                      rows={6}
                      placeholder="Add your review comments here..."
                    ></textarea>
                  </div>
                </div>

                <div className="p-4 border-t border-gray-200 space-y-2">
                  <button className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center justify-center gap-2">
                    <Check className="w-4 h-4" />
                    Approve Curriculum
                  </button>
                  <button className="w-full px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-medium flex items-center justify-center gap-2">
                    <Edit className="w-4 h-4" />
                    Request Changes
                  </button>
                  <button className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium flex items-center justify-center gap-2">
                    <X className="w-4 h-4" />
                    Reject Curriculum
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
const AlumniOverview = () => {
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedFaculty, setSelectedFaculty] = useState('all');

  const alumniStats = {
    totalAlumni: 12450,
    employed: 11208,
    employmentRate: 90,
    avgSalary: '$45,000',
    pursuing: 892,
    entrepreneurs: 350
  };

  const employmentByIndustry = [
    { industry: 'Technology', count: 3362, percentage: 30, color: 'blue' },
    { industry: 'Finance & Banking', count: 2242, percentage: 20, color: 'green' },
    { industry: 'Consulting', count: 1794, percentage: 16, color: 'purple' },
    { industry: 'Manufacturing', count: 1346, percentage: 12, color: 'orange' },
    { industry: 'Education', count: 1121, percentage: 10, color: 'pink' },
    { industry: 'Healthcare', count: 897, percentage: 8, color: 'red' },
    { industry: 'Others', count: 448, percentage: 4, color: 'gray' }
  ];

  const topCompanies = [
    { name: 'Viettel Group', alumni: 245, logo: '🏢', tier: 'Fortune 500' },
    { name: 'VinGroup', alumni: 198, logo: '🏢', tier: 'Top Employer' },
    { name: 'FPT Corporation', alumni: 187, logo: '💻', tier: 'Tech Leader' },
    { name: 'Vietnam Airlines', alumni: 156, logo: '✈️', tier: 'National Carrier' },
    { name: 'BIDV', alumni: 142, logo: '🏦', tier: 'Top Bank' },
    { name: 'Masan Group', alumni: 134, logo: '🏭', tier: 'Conglomerate' }
  ];

  const geographicDistribution = [
    { location: 'Ho Chi Minh City', count: 4356, percentage: 35 },
    { location: 'Hanoi', count: 3735, percentage: 30 },
    { location: 'Da Nang', count: 1245, percentage: 10 },
    { location: 'Other Vietnam', count: 1868, percentage: 15 },
    { location: 'International', count: 1246, percentage: 10 }
  ];

  const salaryRanges = [
    { range: 'Under $20,000', count: 1121, percentage: 10 },
    { range: '$20,000 - $35,000', count: 3362, percentage: 30 },
    { range: '$35,000 - $50,000', count: 3362, percentage: 30 },
    { range: '$50,000 - $75,000', count: 2242, percentage: 20 },
    { range: 'Above $75,000', count: 1121, percentage: 10 }
  ];

  const notableAlumni = [
    { name: 'Nguyen Van A', year: '2015', position: 'CEO', company: 'Tech Startup', achievement: 'Forbes 30 Under 30', photo: '👨‍💼' },
    { name: 'Tran Thi B', year: '2012', position: 'Director', company: 'Banking Corp', achievement: 'Industry Leader Award', photo: '👩‍💼' },
    { name: 'Le Van C', year: '2018', position: 'Founder', company: 'E-commerce Platform', achievement: 'Startup of the Year', photo: '👨‍💼' },
    { name: 'Pham Thi D', year: '2014', position: 'VP Research', company: 'AI Company', achievement: 'Innovation Award', photo: '👩‍💼' }
  ];

  const facultyBreakdown = [
    { faculty: 'FONS', alumni: 3735, employed: 3362, rate: 90 },
    { faculty: 'FOM', alumni: 3238, employed: 2914, rate: 90 },
    { faculty: 'FOMAC', alumni: 2242, employed: 1994, rate: 89 },
    { faculty: 'INS', alumni: 1868, employed: 1645, rate: 88 },
    { faculty: 'ITM', alumni: 1367, employed: 1230, rate: 90 }
  ];

  const yearlyGraduation = [
    { year: '2020', graduates: 2145 },
    { year: '2021', graduates: 2298 },
    { year: '2022', graduates: 2456 },
    { year: '2023', graduates: 2634 },
    { year: '2024', graduates: 2917 }
  ];

  const getColorClass = (color) => {
    switch(color) {
      case 'blue': return 'from-blue-400 to-blue-600';
      case 'green': return 'from-green-400 to-green-600';
      case 'purple': return 'from-purple-400 to-purple-600';
      case 'orange': return 'from-orange-400 to-orange-600';
      case 'pink': return 'from-pink-400 to-pink-600';
      case 'red': return 'from-red-400 to-red-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Alumni Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Track and analyze alumni career progression and achievements</p>
          </div>
          <div className="flex items-center gap-3">
            <select 
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All Years</option>
              <option value="2024">Class of 2024</option>
              <option value="2023">Class of 2023</option>
              <option value="2022">Class of 2022</option>
              <option value="2021">Class of 2021</option>
            </select>
            <select 
              value={selectedFaculty}
              onChange={(e) => setSelectedFaculty(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All Faculties</option>
              <option value="fons">FONS</option>
              <option value="fom">FOM</option>
              <option value="fomac">FOMAC</option>
              <option value="ins">INS</option>
              <option value="itm">ITM</option>
            </select>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
              Export Report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-1">Total Alumni</p>
            <p className="text-3xl font-bold text-gray-900">{alumniStats.totalAlumni.toLocaleString()}</p>
            <p className="text-xs text-green-600 mt-2">Growing network</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-1">Employment Rate</p>
            <p className="text-3xl font-bold text-gray-900">{alumniStats.employmentRate}%</p>
            <p className="text-xs text-gray-600 mt-2">{alumniStats.employed.toLocaleString()} employed</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-1">Avg Starting Salary</p>
            <p className="text-3xl font-bold text-gray-900">{alumniStats.avgSalary}</p>
            <p className="text-xs text-green-600 mt-2">↑ 8% vs last year</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-1">Entrepreneurs</p>
            <p className="text-3xl font-bold text-gray-900">{alumniStats.entrepreneurs}</p>
            <p className="text-xs text-gray-600 mt-2">Own businesses</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Employment by Industry</h3>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {employmentByIndustry.map((item, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">{item.industry}</span>
                    <span className="text-sm font-bold text-gray-900">{item.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full bg-gradient-to-r ${getColorClass(item.color)}`}
                      style={{width: `${item.percentage}%`}}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{item.percentage}% of employed alumni</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Top Employers</h3>
              <Building className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              {topCompanies.map((company, i) => (
                <div key={i} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{company.logo}</span>
                      <div>
                        <p className="font-semibold text-sm text-gray-900">{company.name}</p>
                        <p className="text-xs text-gray-500">{company.tier}</p>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-blue-600">{company.alumni}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Geographic Distribution</h3>
              <Globe className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {geographicDistribution.map((location, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{location.location}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{location.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-gradient-to-r from-blue-400 to-blue-600"
                      style={{width: `${location.percentage}%`}}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{location.percentage}%</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-6">Salary Distribution</h3>
            <div className="space-y-4">
              {salaryRanges.map((range, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">{range.range}</span>
                    <span className="text-sm font-bold text-gray-900">{range.count} alumni</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="h-2.5 rounded-full bg-gradient-to-r from-green-400 to-green-600"
                      style={{width: `${range.percentage}%`}}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{range.percentage}%</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-6">Graduation Trends</h3>
            <div className="h-64 flex items-end justify-between gap-4">
              {yearlyGraduation.map((data, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div 
                    className="w-full bg-gradient-to-t from-blue-400 to-blue-600 rounded-t-lg"
                    style={{height: `${(data.graduates / 3000) * 100}%`}}
                  ></div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-gray-900">{data.graduates}</p>
                    <p className="text-xs text-gray-500">{data.year}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-white text-lg">Notable Alumni</h3>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {notableAlumni.map((alumni, i) => (
              <div key={i} className="bg-white bg-opacity-10 backdrop-blur-sm p-4 rounded-lg border border-white border-opacity-20">
                <div className="flex flex-col items-center text-center mb-3">
                  <span className="text-4xl mb-2">{alumni.photo}</span>
                  <h4 className="font-bold text-white">{alumni.name}</h4>
                  <p className="text-xs text-white text-opacity-80">Class of {alumni.year}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-white font-semibold">{alumni.position}</p>
                  <p className="text-xs text-white text-opacity-90">{alumni.company}</p>
                  <div className="pt-2 mt-2 border-t border-white border-opacity-20">
                    <p className="text-xs text-white text-opacity-80">🏆 {alumni.achievement}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Employment Rate by Faculty</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Faculty</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Total Alumni</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Employed</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Employment Rate</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Progress</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {facultyBreakdown.map((faculty, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-semibold text-gray-900">{faculty.faculty}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-sm font-semibold text-gray-900">{faculty.alumni.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-sm font-semibold text-gray-900">{faculty.employed.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-lg font-bold text-green-600">{faculty.rate}%</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="h-2.5 rounded-full bg-gradient-to-r from-green-400 to-green-600"
                          style={{width: `${faculty.rate}%`}}
                        ></div>
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
  );
};

 
const OneStopService = () => {
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState('all');
  const [actionMenuOpen, setActionMenuOpen] = useState({});

  const toggleActionMenu = (requestId) => {
    setActionMenuOpen(prev => ({
      ...prev,
      [requestId]: !prev[requestId]
    }));
  };

  const closeActionMenu = (requestId) => {
    setActionMenuOpen(prev => ({
      ...prev,
      [requestId]: false
    }));
  };

  const requestStats = {
    totalRequests: 6,
    pending: 3,
    approved: 1,
    rejected: 0,
    processing: 2
  };

  const programStats = {
    undergraduate: {
      BNS: 0, HAS: 1, MET: 4, MAC: 0, HAT: 1, MAS: 0
    },
    postgraduate: {
      MNS: 0, MOTE: 0, 'HSB-MBA': 0, DMS: 0
    }
  };

  const requestTypes = [
    { id: 'verification', name: 'Student Verification', count: 3, icon: User },
    { id: 'transcript', name: 'Official Transcript', count: 2, icon: FileText },
    { id: 'regrading', name: 'Grade Review/Regrading', count: 1, icon: BookOpen },
    { id: 'extension', name: 'Deadline Extension', count: 0, icon: Calendar },
    { id: 'room', name: 'Room Booking', count: 0, icon: Home },
    { id: 'certificate', name: 'Certificate Request', count: 0, icon: GraduationCap },
    { id: 'leave', name: 'Leave of Absence', count: 0, icon: Clock },
    { id: 'other', name: 'Other Requests', count: 0, icon: AlertCircle }
  ];

  const requests = [
    {
      id: 'REQ001',
      type: 'Student Verification Request',
      submittedDate: '15/10/2025',
      studentName: 'NGUYỄN VIỆT HÙNG',
      studentId: '24080161',
      class: 'MAC.QH-2024-D',
      program: 'MAC',
      level: 'Undergraduate',
      status: 'Approved',
      priority: 'Normal',
      description: 'Verification letter for scholarship application',
      documents: ['ID Card', 'Enrollment Proof'],
      assignedTo: 'Academic Affairs'
    },
    {
      id: 'REQ002',
      type: 'Student Verification Request',
      submittedDate: '14/10/2025',
      studentName: 'LÊ NGUYỄN NAM PHƯƠNG',
      studentId: '25080567',
      class: 'HAS.QH-2025-D',
      program: 'HAS',
      level: 'Undergraduate',
      status: 'Submitted',
      priority: 'Normal',
      description: 'Verification for internship application',
      documents: ['Student ID', 'Current Enrollment'],
      assignedTo: 'Academic Affairs'
    },
    {
      id: 'REQ003',
      type: 'Student Verification Request',
      submittedDate: '14/10/2025',
      studentName: 'VŨ ANH ĐỨC',
      studentId: '19080029',
      class: 'MET.QH-2019-D',
      program: 'MET',
      level: 'Undergraduate',
      status: 'Submitted',
      priority: 'Urgent',
      description: 'Verification for visa application',
      documents: ['Passport', 'Enrollment Certificate'],
      assignedTo: 'International Office'
    },
    {
      id: 'REQ004',
      type: 'Official Transcript Request',
      submittedDate: '13/10/2025',
      studentName: 'TRẦN THỊ MAI',
      studentId: '23080145',
      class: 'MET.QH-2023-D',
      program: 'MET',
      level: 'Undergraduate',
      status: 'Processing',
      priority: 'Normal',
      description: 'Official transcript for graduate school application',
      documents: ['Transcript Request Form'],
      assignedTo: 'Registrar Office'
    },
    {
      id: 'REQ005',
      type: 'Official Transcript Request',
      submittedDate: '12/10/2025',
      studentName: 'PHẠM VĂN NAM',
      studentId: '22080234',
      class: 'HAT.QH-2022-D',
      program: 'HAT',
      level: 'Undergraduate',
      status: 'Processing',
      priority: 'Normal',
      description: 'Transcript for job application',
      documents: ['Application Letter'],
      assignedTo: 'Registrar Office'
    },
    {
      id: 'REQ006',
      type: 'Grade Review Request',
      submittedDate: '11/10/2025',
      studentName: 'HOÀNG THỊ LAN',
      studentId: '23080456',
      class: 'MET.QH-2023-D',
      program: 'MET',
      level: 'Undergraduate',
      status: 'Submitted',
      priority: 'High',
      description: 'Request for regrading final exam - CS301',
      documents: ['Exam Paper Copy', 'Appeal Form'],
      assignedTo: 'Academic Committee'
    },
    {
      id: 'REQ007',
      type: 'Student Verification Request',
      submittedDate: '10/10/2025',
      studentName: 'ĐẶNG VĂN LONG',
      studentId: '24080789',
      class: 'MET.QH-2024-D',
      program: 'MET',
      level: 'Undergraduate',
      status: 'Processing',
      priority: 'Normal',
      description: 'Enrollment verification for bank loan',
      documents: ['Bank Request Form', 'Student ID'],
      assignedTo: 'Student Affairs'
    },
    {
      id: 'REQ008',
      type: 'Official Transcript Request',
      submittedDate: '10/10/2025',
      studentName: 'NGUYỄN THỊ HƯƠNG',
      studentId: '23080912',
      class: 'HAS.QH-2023-D',
      program: 'HAS',
      level: 'Undergraduate',
      status: 'Submitted',
      priority: 'High',
      description: 'Urgent transcript for scholarship deadline',
      documents: ['Scholarship Form'],
      assignedTo: 'Registrar Office'
    },
    {
      id: 'REQ009',
      type: 'Grade Review Request',
      submittedDate: '09/10/2025',
      studentName: 'TRẦN VĂN BÌNH',
      studentId: '22080345',
      class: 'MET.QH-2022-D',
      program: 'MET',
      level: 'Undergraduate',
      status: 'Processing',
      priority: 'Normal',
      description: 'Request for grade review - BA202',
      documents: ['Grade Appeal Form'],
      assignedTo: 'Academic Committee'
    }
  ];

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'approved': return 'bg-green-100 text-green-700 border-green-300';
      case 'submitted': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'processing': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority.toLowerCase()) {
      case 'urgent': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'normal': return 'text-blue-600';
      case 'low': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const filteredRequests = requests.filter(req => {
    if (selectedTab === 'all') return true;
    if (selectedTab === 'undergraduate') return req.level === 'Undergraduate';
    if (selectedTab === 'postgraduate') return req.level === 'Postgraduate';
    if (selectedTab === 'pending') return req.status === 'Submitted';
    if (selectedTab === 'approved') return req.status === 'Approved';
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">One-Stop Service Center</h1>
            <p className="text-sm text-gray-500 mt-1">Student requests and service management portal</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium">
              <Download className="w-4 h-4" />
              Export Report
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
              <Plus className="w-4 h-4" />
              Add New Request
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900 text-sm">📚 UNDERGRADUATE PROGRAMS</h3>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
              TOTAL: {Object.values(programStats.undergraduate).reduce((a, b) => a + b, 0)} REQUESTS
            </span>
          </div>
          <div className="grid grid-cols-6 gap-3">
            {Object.entries(programStats.undergraduate).map(([program, count]) => (
              <div key={program} className="bg-gray-50 p-2 rounded text-center">
                <p className="text-xs text-gray-600 mb-1">{program}</p>
                <p className={`text-2xl font-bold ${count > 0 ? 'text-orange-600' : 'text-gray-400'}`}>
                  {count}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900 text-sm">🎓 POSTGRADUATE PROGRAMS</h3>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
              TOTAL: {Object.values(programStats.postgraduate).reduce((a, b) => a + b, 0)} REQUESTS
            </span>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {Object.entries(programStats.postgraduate).map(([program, count]) => (
              <div key={program} className="bg-gray-50 p-2 rounded text-center">
                <p className="text-xs text-gray-600 mb-1">{program}</p>
                <p className={`text-2xl font-bold ${count > 0 ? 'text-orange-600' : 'text-gray-400'}`}>
                  {count}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg flex items-center justify-between">
          <p className="text-sm text-gray-700">
            <span className="font-bold text-red-600">{requestStats.pending}</span> requests pending approval | Last updated: 15/10/2025
          </p>
        </div>

        <div className="grid grid-cols-8 gap-3">
          {requestTypes.map((type) => (
            <div key={type.id} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 text-center">
              <p className="text-xs font-medium text-gray-700 mb-2 h-8 flex items-center justify-center" title={type.name}>
                {type.name}
              </p>
              <p className="text-3xl font-bold text-gray-900">{type.count}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedTab('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedTab === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All (6)
                </button>
                <button
                  onClick={() => setSelectedTab('undergraduate')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedTab === 'undergraduate' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Undergraduate (6)
                </button>
                <button
                  onClick={() => setSelectedTab('postgraduate')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedTab === 'postgraduate' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Postgraduate (0)
                </button>
                <button
                  onClick={() => setSelectedTab('pending')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedTab === 'pending' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Pending (3)
                </button>
                <button
                  onClick={() => setSelectedTab('approved')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedTab === 'approved' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Approved (1)
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium">
                  <CheckCircle className="w-4 h-4" />
                  Bulk Approve
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700 text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase">
                    <input type="checkbox" className="rounded" />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Request Type</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Date Submitted</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Full Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Student ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Class</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold uppercase">Status</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <input type="checkbox" className="rounded" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{request.type}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{request.submittedDate}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{request.studentName}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{request.studentId}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-blue-600">{request.class}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => setSelectedRequest(request)}
                          className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {request.status === 'Submitted' ? (
                          <div className="relative">
                            <button 
                              className="px-3 py-1 bg-gray-300 text-gray-500 rounded cursor-not-allowed text-xs font-medium flex items-center gap-1"
                              disabled
                              title="Review required before taking action"
                            >
                              Actions
                              <ChevronDown className="w-3 h-3" />
                            </button>
                          </div>
                        ) : request.status === 'Processing' ? (
                          <div className="relative">
                            <button 
                              onClick={() => toggleActionMenu(request.id)}
                              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs font-medium flex items-center gap-1"
                            >
                              Actions
                              <ChevronDown className="w-3 h-3" />
                            </button>
                            {actionMenuOpen[request.id] && (
                              <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                                <button 
                                  onClick={() => {
                                    closeActionMenu(request.id);
                                    // Handle approve action
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-green-700 hover:bg-green-50 flex items-center gap-2 rounded-t-lg"
                                >
                                  <Check className="w-4 h-4" />
                                  Approve
                                </button>
                                <button 
                                  onClick={() => {
                                    closeActionMenu(request.id);
                                    // Handle disapprove action
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-red-700 hover:bg-red-50 flex items-center gap-2 rounded-b-lg"
                                >
                                  <X className="w-4 h-4" />
                                  Disapprove
                                </button>
                              </div>
                            )}
                          </div>
                        ) : request.status === 'Approved' ? (
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded text-xs font-medium flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Approved
                          </span>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">Showing 1-9 of 9 requests</p>
            <div className="flex gap-2">
              <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">Previous</button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded">1</button>
              <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">Next</button>
            </div>
          </div>
        </div>

        {selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedRequest(null)}>
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-600 to-purple-600">
                <div className="text-white">
                  <h2 className="text-2xl font-bold">Request Details</h2>
                  <p className="text-sm opacity-90">{selectedRequest.type}</p>
                </div>
                <button 
                  onClick={() => setSelectedRequest(null)}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg text-white"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Request ID</p>
                    <p className="font-semibold text-gray-900">{selectedRequest.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Submitted Date</p>
                    <p className="font-semibold text-gray-900">{selectedRequest.submittedDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Student Name</p>
                    <p className="font-semibold text-gray-900">{selectedRequest.studentName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Student ID</p>
                    <p className="font-semibold text-gray-900">{selectedRequest.studentId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Class</p>
                    <p className="font-semibold text-blue-600">{selectedRequest.class}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Program</p>
                    <p className="font-semibold text-gray-900">{selectedRequest.program} - {selectedRequest.level}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Priority</p>
                    <p className={`font-semibold ${getPriorityColor(selectedRequest.priority)}`}>{selectedRequest.priority}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Assigned To</p>
                    <p className="font-semibold text-gray-900">{selectedRequest.assignedTo}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">Description</p>
                  <p className="text-gray-900 bg-gray-50 p-4 rounded-lg">{selectedRequest.description}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">Attached Documents</p>
                  <div className="flex gap-2">
                    {selectedRequest.documents.map((doc, i) => (
                      <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        📄 {doc}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-3">Review Comments</p>
                  <textarea
                    className="w-full p-4 border border-gray-300 rounded-lg text-sm"
                    rows={4}
                    placeholder="Add your comments here..."
                  ></textarea>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center justify-center gap-2">
                    <Check className="w-4 h-4" />
                    Approve Request
                  </button>
                  <button className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium flex items-center justify-center gap-2">
                    <X className="w-4 h-4" />
                    Reject Request
                  </button>
                  <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
                    Request More Info
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

  const renderContent = () => {
    if (activeTab === 'dashboard') {
      if (userType === 'admin') return <AdminDashboard />;
      if (userType === 'student') return <StudentDashboard />;
      if (userType === 'lecturer') return <LecturerDashboard />;
      if (userType === 'faculty') return <FacultyDashboard />;
      if (userType === 'department') return <DepartmentDashboard />;
    }
    if (activeTab === 'student-profile') {
      return <StudentProfileAdmin />;
    }
    if (activeTab === 'lecturer-profile') {
      return <LecturerProfileAdmin />;
    }
    if (activeTab === 'lecturers-overview') {
      return <LecturersOverview />;
    }
    if (activeTab === 'library-dashboard') {
      return <LibraryDashboard />;
    }
    if (activeTab === 'events-dashboard') {
      return <EventsDashboard />;
    }
    if (activeTab === 'student-services') {
      return <StudentServicesOverview />;
    }
    if (activeTab === 'finance-overview') {
      return <FinanceOverview />;
    }
    if (activeTab === 'view-rankings') { 
      return <ViewRankings />;
    } 
    if (activeTab === 'timetable-overview') {
      return <TimetableOverview />;
    }
    if (activeTab === 'departments-overview') {
      return <DepartmentOverview />;
    }
    if (activeTab === 'class-overview') {
      return <ClassOverview />;
    }
    if (activeTab === 'alumni-overview') {
      return <AlumniOverview />;
    } 
    if (activeTab === 'room-schedule' || activeTab === 'course-schedule' || activeTab === 'exam-schedule') {
      return <TimetableCalendar />;
    }
    if (activeTab == 'curriculum-management'){
      return <CurriculumManagement/>;
    }
   
    if (activeTab == 'one-stop-service'){
      return <OneStopService/>;
    }
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4 text-gray-900">{activeTab}</h2>
        <p className="text-gray-600">Content for {activeTab} will be displayed here.</p>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div 
        className={`bg-slate-800 text-white overflow-y-auto transition-all duration-300 ${
          sidebarCollapsed ? 'w-16' : 'w-64'
        } ${!sidebarLocked && !sidebarCollapsed ? 'absolute left-0 top-0 bottom-0 z-40 shadow-2xl' : 'relative'}`}
        onMouseEnter={() => {
          if (!sidebarLocked && sidebarCollapsed) {
            setSidebarCollapsed(false);
          }
        }}
        onMouseLeave={() => {
          if (!sidebarLocked) {
            setSidebarCollapsed(true);
          }
        }}
      >
        <div className={`p-4 border-b border-slate-700 ${sidebarCollapsed ? 'px-2' : ''}`}>
          <div className={`flex items-center ${sidebarCollapsed ? 'justify-center flex-col gap-2' : 'justify-between'} mb-3`}>
            {!sidebarCollapsed && <h1 className="text-xl font-bold">HSB ERP</h1>}
            <div className={`flex items-center gap-1 ${sidebarCollapsed ? 'flex-col' : ''}`}>
              <button
                onClick={() => setSidebarLocked(!sidebarLocked)}
                className="p-1.5 hover:bg-slate-700 rounded transition-colors"
                title={sidebarLocked ? 'Unlock sidebar' : 'Lock sidebar'}
              >
                {sidebarLocked ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
              <button
                onClick={() => {
                  setSidebarCollapsed(!sidebarCollapsed);
                  if (!sidebarCollapsed && !sidebarLocked) setSidebarLocked(true);
                }}
                className="p-1.5 hover:bg-slate-700 rounded transition-colors"
                title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                <ChevronRight size={16} className={sidebarCollapsed ? '' : 'rotate-180'} />
              </button>
            </div>
          </div>
          {!sidebarCollapsed && (
            <select 
              value={userType} 
              onChange={(e) => {
                setUserType(e.target.value);
                setActiveTab('dashboard');
                setExpandedMenus({});
              }}
              className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg text-sm text-white"
            >
              <option value="admin">Admin</option>
              <option value="student">Student</option>
              <option value="lecturer">Lecturer</option>
              <option value="faculty">Faculty</option>
              <option value="department">Department</option>
            </select>
          )}
        </div>

        <nav className="p-2">
          {currentNav.map((item) => (
            <div key={item.id} className="mb-1">
              <button
                onClick={() => {
                  if (item.submenu) {
                    toggleMenu(item.id);
                  } else {
                    setActiveTab(item.id);
                  }
                }}
                className={`w-full flex items-center justify-between p-3 rounded-lg ${
                  activeTab === item.id ? 'bg-slate-700' : 'hover:bg-slate-700'
                } ${sidebarCollapsed ? 'justify-center' : ''}`}
                title={sidebarCollapsed ? item.label : ''}
              >
                <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center' : ''}`}>
                  <item.icon size={18} />
                  {!sidebarCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                </div>
                {!sidebarCollapsed && item.submenu && (expandedMenus[item.id] ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
              </button>

              {!sidebarCollapsed && item.submenu && expandedMenus[item.id] && (
                <div className="ml-4 mt-1 space-y-1 bg-slate-900 rounded-lg p-2">
                  {item.submenu.map((subItem) => (
                    <button
                      key={subItem.id}
                      onClick={() => setActiveTab(subItem.id)}
                      className={`w-full text-left p-2 pl-6 rounded-lg text-sm ${
                        activeTab === subItem.id ? 'bg-slate-700' : 'hover:bg-slate-700'
                      }`}
                    >
                      {subItem.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className={`flex-1 overflow-y-auto transition-all duration-300`}>
        <div className="p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ERPLayout;