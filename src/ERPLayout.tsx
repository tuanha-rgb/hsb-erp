import React, { useState, useEffect, useMemo } from "react";
import Student from "./student";
import Lecturer from "./lecturer";
import './project.css';
import './index.css';


import {
  scholarships,
  applications,
  getStatusscholarshipColor,
  type Scholarship,
  type ScholarshipApplication,
  type ScholarshipStatus,
  type ApplicationStatus,
} from "./student/scholarshipdata";

import ResearchManagement from "./research/ResearchManagement";

import { AttendanceRecord, StudentAttendanceStats, CourseAttendance, AttendanceAlert, AICamera, initializeAttendanceData } from "./attendance/attendancemodel";
import AttendanceLive from "./attendance/attendanceLive";
import AttendanceLoader from "./attendance/AttendanceLoader";

import LibraryViewer from "./library/libraryviewer";
import ThesisStorage from "./library/ThesisStorage";
import BookManagement from "./library/BookManagement";
import LibraryDashboard from "./library/LibraryDashboard";

import RoomSchedule from './attendance/RoomSchedule';

// Projects Management (Firebase-based)
import ProjectsTab from './projects/ProjectsTab';

import { sampleEvents, type EventItem, getEventStatusColor } from "./student/eventdata";

// Document Management (Firebase-based)
import DocumentList from './documents/DocumentList';
import DocumentUpload from './documents/DocumentUpload';
import DocumentDashboard from './documents/DocumentDashboard';
import CategoryManager from './documents/CategoryManager';
import DocumentHandbook from './documents/documenthandbook';

// ✅ Types (match your file name exactly)
import {
  Faculty, ProgramCatalog, BachelorProgramStat, FacultyMetric,
  CourseItem, StudentGradeRow, FacultyCode,
} from "./acad/academicmodel";

// ✅ Data (match your file names from the screenshot)
import { faculties } from "./acad/faculties";
import { programs } from "./acad/programs";
import { bachelorProgramStats } from "./acad/programstats";
import { facultyMetrics } from "./acad/facultymetrics";
import { courseData } from "./acad/courses";
import { studentGrades } from "./student/studentgrades";

import {  Thesis,  ThesisStatus,  ThesisCategory,  ThesisLevel,  sampleTheses,} from "./acad/thesis";

import { sampleStudents, studentdata } from "./student/studentdata";

import { researchProjects } from "./research/researchProjects";
import { publications } from "./research/publications";
import { patentData } from "./research/patent";

import { ResearchProject, Publication, Patent } from "./research/research";
import { getDisciplineColor, getStatusColor } from "./research/ResearchColors";

import PollSystem from './PollSystem';


import HSBShop from "./shop/HSBShop";
import HSBShopViewer from "./shop/HSBShopViewer";

import { sampleUsers,  getStatusaccColor } from "./useraccounts";
import type { UserAccount} from "./useraccounts";
import AccountManagement from './account/AccountManagement';


import type { LucideIcon } from "lucide-react";
import RoleDropdown, { type RoleValue } from "./RoleDropdown";

import { navigationConfig, type UserType, type MenuItem } from "./navigation";

import { 
  ChevronDown, ChevronRight, Users, GraduationCap, BookOpen, Calendar, 
  DollarSign, FileText, Award, Clock, Building, Globe, Briefcase, 
  MessageSquare, Settings, BarChart3, TrendingUp, UserCheck, Home, 
  Search, Plus, ArrowRight, Bell, AlertTriangle, TrendingDown, 
  AlertCircle, Download, Filter, PieChart, ArrowUpRight, ArrowDownRight, 
  Target, MapPin, Star, CheckCircle, XCircle, User, Eye, Check, X, MessageCircle,
  Edit, Save, ShieldCheck, Phone, Mail, Trash2, ThumbsUp, ThumbsDown, Minus, Folder,
  Kanban, BarChart2, FolderOpen, List, Package, Boxes, ShoppingCart, CreditCard, 
  AlertOctagon, RotateCcw, Footprints, RefreshCw, Shield, Key, Upload, Scroll, FileCheck, Send,
  Banknote, Archive, Grid, List as ListIcon, Library, Users as UsersIcon, Book, BookOpen as BookOpenIcon,
  Building2, Copy, Layers, Hash, Cpu, Zap, Cloud, Database, HardDrive, Server, Terminal, Code, Bug, GitBranch, Paperclip,Camera
} from "lucide-react";

// Utility renderer for dynamic values
function renderValue(v: unknown): React.ReactNode {
  if (v == null) return null;
  if (React.isValidElement(v)) return v;
  if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") {
    return String(v);
  }
  if (Array.isArray(v)) return v.map((x, i) => <span key={i}>{renderValue(x)}</span>);
  try {
    return typeof v === "object" ? JSON.stringify(v) : String(v);
  } catch {
    return String(v);
  }
}

const ERPLayout: React.FC = () => {
  const [userType, setUserType] = useState<UserType>("admin");
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [sidebarLocked, setSidebarLocked] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Read URL parameters and set activeTab on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam) {
      console.log('Setting activeTab from URL:', tabParam);
      setActiveTab(tabParam);
    }
  }, []);
// At the top of ERPLayout.tsx, add mock user
const mockUser = {
  id: 'test-user-001',
  name: 'Test User',
  role: 'staff' // or 'student' or 'management'
};
type UserLevel = 'student' | 'staff' | 'management';

// Map your RoleDropdown values to UserLevel
const roleToUserLevel = (role: string): UserLevel => {
  switch(role) {
    case 'admin': return 'management';
    case 'lecturer': return 'staff';
    case 'faculty': return 'staff';
    case 'department': return 'management';
    case 'student': return 'student';
    default: return 'student';
  }
};
  // Compute navigation based on current user type
  const currentNav: MenuItem[] = useMemo(
    () => navigationConfig[userType] ?? navigationConfig.admin,
    [userType]
  );

  // Reset menus and active tab when user type changes
  useEffect(() => {
    setExpandedMenus({});
    setActiveTab(currentNav[0]?.id ?? "dashboard");
  }, [userType, currentNav]);

  // Fullscreen functions
  const enterFullscreen = () => {
    const elem = document.documentElement;
    
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch(err => {
        console.log('Fullscreen error:', err);
      });
    } else if ((elem as any).webkitRequestFullscreen) {
      (elem as any).webkitRequestFullscreen();
    } else if ((elem as any).msRequestFullscreen) {
      (elem as any).msRequestFullscreen();
    }
  };

  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).msFullscreenElement
      );
      
      setIsFullscreen(isCurrentlyFullscreen);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Cleanup fullscreen on unmount
  useEffect(() => {
    return () => {
      exitFullscreen();
    };
  }, []);

  // Toggle menu expansion
  const toggleMenu = (menuId: string) =>
    setExpandedMenus((prev) => ({ ...prev, [menuId]: !prev[menuId] }));

  // Handle tab change with fullscreen logic
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    
    // Enter fullscreen if Room Schedule tab is selected
    if (tabId === "room-schedule") {
      enterFullscreen();
    } else {
      exitFullscreen();
    }
  };

  // Check if current role has its own sidebar
  const roleHasOwnSidebar = userType === "student" || userType === "lecturer";
  if (roleHasOwnSidebar) {
    return userType === "student" ? <Student /> : <Lecturer />;
  }

  // StatCard component
  const StatCard = ({ title, value, change, icon: Icon, bgColor, iconColor }: {
    title: string;
    value: string | number;
    change: string;
    icon: LucideIcon;
    bgColor?: string;
    iconColor?: string;
  }) => (
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
    { year: '2021', value: 78, label: 'Y1' },
    { year: '2022', value: 82, label: 'Y2' },
    { year: '2023', value: 88, label: 'Y3' },
    { year: '2024', value: 75, label: 'Y4' },
    { year: '2024', value: 85, label: 'Y5' },
    { year: '2024', value: 90, label: 'Y6' },
    { year: '2024', value: 95, label: 'Y7' },
    { year: '2024', value: 92, label: 'Y8' }
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
    total: 5100,
    undergraduate: 3400,
    graduate: 1200,
    doctoral: 500
  };

  // Important Events
  const upcomingEvents = [
    { name: 'Board Meeting', date: 'Oct 18, 2025', time: '2:00 PM', icon: '📋', color: 'bg-yellow-100' },
    { name: 'Faculty Conference', date: 'Oct 22, 2025', time: '9:00 AM', icon: '🎓', color: 'bg-blue-100' },
    { name: 'Alumni Gala', date: 'Oct 28, 2025', time: '6:00 PM', icon: '🎉', color: 'bg-red-100' }
  ];

  // Department Performance
  const departmentPerformance = [
    { name: 'Faculty of Management', publication: 28, personnel: 28, utilization: 78, performance: 92 },
    { name: 'Faculty of Marketing & Communication', publication: 18, personnel: 18, utilization: 85, performance: 88 },
    { name: 'Faculty of Nontraditonal Security', publication: 38, personnel: 38, utilization: 72, performance: 90 },
    { name: 'Institute of Nontraditional Security ', publication: 8, personnel: 11, utilization: 81, performance: 87 },
    { name: 'Institute of Trainging & Management', publication: 3, personnel: 6, utilization: 68, performance: 85 }
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
    <div className="min-h-screen bg-gray-50 p-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-1">Dashboard</h1>
          <p className="text-gray-600">October 15, 2025</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Search className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <MessageCircle className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mb-3">
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

      {/* KPI Performance & Publications/Patents */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        {/* KPI Performance */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">KPI Performance</h2>
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
          
          <div className="space-y-3">
            {/* Student Satisfaction */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Student Satisfaction</span>
                <span className="text-sm font-bold text-gray-900">92%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-gradient-to-r from-blue-400 to-blue-500 h-3 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>

            {/* Graduation Rate */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Graduation Rate</span>
                <span className="text-sm font-bold text-gray-900">88%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-gradient-to-r from-green-400 to-green-500 h-3 rounded-full" style={{ width: '88%' }}></div>
              </div>
            </div>

            {/* Employment Rate */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Employment Rate (6 months)</span>
                <span className="text-sm font-bold text-gray-900">85%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-gradient-to-r from-purple-400 to-purple-500 h-3 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>

            {/* Research Output */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Research Output Target</span>
                <span className="text-sm font-bold text-gray-900">96%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-gradient-to-r from-orange-400 to-orange-500 h-3 rounded-full" style={{ width: '96%' }}></div>
              </div>
            </div>

            {/* Faculty Retention */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Faculty Retention</span>
                <span className="text-sm font-bold text-gray-900">94%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-gradient-to-r from-cyan-400 to-cyan-500 h-3 rounded-full" style={{ width: '94%' }}></div>
              </div>
            </div>

            {/* Budget Utilization */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Budget Utilization</span>
                <span className="text-sm font-bold text-gray-900">78%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-gradient-to-r from-pink-400 to-pink-500 h-3 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Publications & Patents */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Publications & Patents</h2>
            <select 
              value={selectedEarningsPeriod}
              onChange={(e) => setSelectedEarningsPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="last-semester">Last Year</option>
              <option value="this-semester">This Year</option>
              <option value="this-year">All Time</option>
            </select>
          </div>

          <div className="space-y-3">
            {/* Journal Articles */}
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Journal Articles</span>
                <span className="text-2xl font-bold text-blue-900">847</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <TrendingUp className="w-3 h-3 text-green-600" />
                <span className="text-green-600 font-semibold">+12% vs last year</span>
              </div>
            </div>

            {/* Conference Papers */}
            <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Conference Papers</span>
                <span className="text-2xl font-bold text-purple-900">312</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <TrendingUp className="w-3 h-3 text-green-600" />
                <span className="text-green-600 font-semibold">+8% vs last year</span>
              </div>
            </div>

            {/* Patents Filed */}
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Patents Filed</span>
                <span className="text-2xl font-bold text-green-900">54</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <TrendingUp className="w-3 h-3 text-green-600" />
                <span className="text-green-600 font-semibold">+23% vs last year</span>
              </div>
            </div>

            {/* Patents Granted */}
            <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Patents Granted</span>
                <span className="text-2xl font-bold text-orange-900">35</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <TrendingUp className="w-3 h-3 text-green-600" />
                <span className="text-green-600 font-semibold">+18% vs last year</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Output</span>
              <span className="text-xl font-bold text-blue-600">1,248</span>
            </div>
          </div>
        </div>
      </div>

      {/* Important Events */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-3">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold text-gray-900">Important Events</h2>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
            View All Events
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {upcomingEvents.map((event, i) => (
            <div key={i} className={`p-3 ${event.color} rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer`}>
              <div className="flex flex-col">
                <p className="text-xl font-bold text-gray-900 mb-2">{event.name}</p>
                <p className="text-sm text-gray-600 mb-1">{event.date}</p>
                <p className="text-sm font-semibold text-gray-700">{event.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Department Performance */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-3">
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
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Publications</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Personnel</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Utilization</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Performance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {departmentPerformance.map((dept, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-gray-900">{dept.name}</td>
                  <td className="px-6 py-4 text-right text-gray-700">{formatNumber(dept.publication)}</td>
                  <td className="px-6 py-4 text-right text-gray-700">{formatNumber(dept.personnel)}</td>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-3 mt-3">
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
    <div className="min-h-screen bg-gray-50 p-2">
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
    { department: 'FONS', budget: 12500000, spent: 8920000, percentage: 71.4, status: 'on-track' },
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
    <div className="min-h-screen bg-gray-50 p-2">
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

{/*Scholarship tab*/}
const Scholarship = () => {

  const [activeTab, setActiveTab] = useState('overview');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showCreateScholarship, setShowCreateScholarship] = useState(false);
  const [showPushConfirmation, setShowPushConfirmation] = useState(false);
  const [selectedScholarshipToPush, setSelectedScholarshipToPush] = useState(null);
  const [pushedScholarships, setPushedScholarships] = useState([]);

  const handlePushScholarship = (scholarshipId) => {
    setSelectedScholarshipToPush(scholarshipId);
    setShowPushConfirmation(true);
  };

  const confirmPush = () => {
    setPushedScholarships([...pushedScholarships, selectedScholarshipToPush]);
    setShowPushConfirmation(false);
    setSelectedScholarshipToPush(null);
  };

 

  const filteredApplications = filterStatus === 'all' 
    ? applications 
    : applications.filter(app => app.status === filterStatus);

  const totalApplicants = applications.length;
  const approvedCount = applications.filter(a => a.status === 'Approved').length;
  const underReviewCount = applications.filter(a => a.status === 'Under Review').length;
  const pendingCount = applications.filter(a => a.status === 'Pending Documents').length;
  const rejectedCount = applications.filter(a => a.status === 'Rejected').length;
  
  const totalBudget = scholarships.reduce((sum, s) => {
    const amount = parseInt(s.budget.replace(/[^0-9]/g, ''));
    return sum + amount;
  }, 0);
  
  const totalBudgetUsed = scholarships.reduce((sum, s) => {
    const amount = parseInt(s.budgetUsed.replace(/[^0-9]/g, ''));
    return sum + amount;
  }, 0);

  const renderOverview = () => (
    <div className="">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <FileText className="text-blue-600" size={24} />
            </div>
            <span className="text-sm font-semibold text-gray-600">Total Applications</span>
          </div>
          <p className="text-4xl font-bold text-gray-900 mb-1">{totalApplicants}</p>
          <p className="text-sm text-gray-500">{scholarships.length} active scholarships</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-emerald-100 rounded-xl">
              <CheckCircle className="text-emerald-600" size={24} />
            </div>
            <span className="text-sm font-semibold text-gray-600">Approved</span>
          </div>
          <p className="text-4xl font-bold text-gray-900 mb-1">{approvedCount}</p>
          <p className="text-sm text-emerald-600 font-medium">+{Math.round((approvedCount/totalApplicants)*100)}% approval rate</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-amber-100 rounded-xl">
              <Clock className="text-amber-600" size={24} />
            </div>
            <span className="text-sm font-semibold text-gray-600">Under Review</span>
          </div>
          <p className="text-4xl font-bold text-gray-900 mb-1">{underReviewCount}</p>
          <p className="text-sm text-gray-500">Requires attention</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-100 rounded-xl">
              <DollarSign className="text-purple-600" size={24} />
            </div>
            <span className="text-sm font-semibold text-gray-600">Budget Usage</span>
          </div>
          <p className="text-4xl font-bold text-gray-900 mb-1">{Math.round((totalBudgetUsed/totalBudget)*100)}%</p>
          <p className="text-sm text-gray-500">{(totalBudgetUsed/1000000).toFixed(0)}M / {(totalBudget/1000000).toFixed(0)}M VND</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-2 mt-3 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Status Distribution</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Approved</span>
              <div className="flex items-center gap-3">
                <div className="w-64 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{width: `${(approvedCount/totalApplicants)*100}%`}}></div>
                </div>
                <span className="text-sm font-semibold text-gray-900 w-8">{approvedCount}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Under Review</span>
              <div className="flex items-center gap-3">
                <div className="w-64 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{width: `${(underReviewCount/totalApplicants)*100}%`}}></div>
                </div>
                <span className="text-sm font-semibold text-gray-900 w-8">{underReviewCount}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Pending Documents</span>
              <div className="flex items-center gap-3">
                <div className="w-64 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{width: `${(pendingCount/totalApplicants)*100}%`}}></div>
                </div>
                <span className="text-sm font-semibold text-gray-900 w-8">{pendingCount}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Rejected</span>
              <div className="flex items-center gap-3">
                <div className="w-64 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full" style={{width: `${(rejectedCount/totalApplicants)*100}%`}}></div>
                </div>
                <span className="text-sm font-semibold text-gray-900 w-8">{rejectedCount}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Scholarships by Applications</h3>
          <div className="space-y-4">
            {scholarships.sort((a, b) => b.applicants - a.applicants).slice(0, 5).map((scholarship, idx) => (
              <div key={scholarship.id} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center font-bold text-purple-600">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">{scholarship.name}</p>
                  <p className="text-xs text-gray-500">{scholarship.department}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{scholarship.applicants}</p>
                  <p className="text-xs text-gray-500">applicants</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-200 p-3 mt-3">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="">
          {applications.slice(0, 5).map(app => (
            <div key={app.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                  {app.studentName.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{app.studentName}</p>
                  <p className="text-xs text-gray-500">Applied for {app.scholarshipName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500">{app.submittedDate}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusscholarshipColor(app.status)}`}>
                  {app.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderApplications = () => (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Filter size={20} className="text-gray-400" />
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                filterStatus === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({applications.length})
            </button>
            <button
              onClick={() => setFilterStatus('Under Review')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                filterStatus === 'Under Review'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Under Review ({underReviewCount})
            </button>
            <button
              onClick={() => setFilterStatus('Approved')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                filterStatus === 'Approved'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Approved ({approvedCount})
            </button>
            <button
              onClick={() => setFilterStatus('Pending Documents')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                filterStatus === 'Pending Documents'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pending ({pendingCount})
            </button>
          </div>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by student name or ID..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Student</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Scholarship</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">GPA</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Department</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Submitted</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredApplications.map(app => (
                <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                        {app.studentName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{app.studentName}</p>
                        <p className="text-xs text-gray-500">{app.studentId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">{app.scholarshipName}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-indigo-600">{app.amount}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-gray-900">{app.gpa}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-700">{app.department}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-700">{app.submittedDate}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusscholarshipColor(app.status)}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedApplication(app);
                        setShowApplicationModal(true);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors text-sm font-medium"
                    >
                      <Eye size={14} />
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Application Review Modal */}
      {showApplicationModal && selectedApplication && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white font-bold text-2xl border border-white/30">
                    {selectedApplication.studentName.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-1">{selectedApplication.studentName}</h2>
                    <p className="text-indigo-100">ID: {selectedApplication.studentId}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`px-3 py-1 bg-white text-indigo-700 text-xs font-semibold rounded-full`}>
                        {selectedApplication.status}
                      </span>
                      <span className="text-sm text-indigo-100">GPA: {selectedApplication.gpa}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setShowApplicationModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <XCircle size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-280px)]">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-2">Scholarship Applied</h3>
                  <p className="text-lg font-bold text-gray-900">{selectedApplication.scholarshipName}</p>
                  <p className="text-sm text-indigo-600 font-semibold mt-1">{selectedApplication.amount}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-2">Submission Date</h3>
                  <p className="text-lg font-bold text-gray-900">{selectedApplication.submittedDate}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-2">Department</h3>
                  <p className="text-lg font-bold text-gray-900">{selectedApplication.department}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-2">Reviewer</h3>
                  <p className="text-lg font-bold text-gray-900">{selectedApplication.reviewer}</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Submitted Documents</h3>
                <div className="grid grid-cols-2 gap-3">
                  {selectedApplication.documents.map((doc, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <FileText className="text-indigo-600" size={20} />
                      <span className="text-sm font-medium text-gray-900">{doc}</span>
                      <button className="ml-auto text-indigo-600 hover:text-indigo-700">
                        <Download size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {selectedApplication.rejectionReason && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="text-red-600 mt-0.5" size={20} />
                    <div>
                      <h3 className="text-sm font-semibold text-red-900 mb-1">Rejection Reason</h3>
                      <p className="text-sm text-red-700">{selectedApplication.rejectionReason}</p>
                      <p className="text-xs text-red-600 mt-1">Date: {selectedApplication.rejectedDate}</p>
                    </div>
                  </div>
                </div>
              )}

              {selectedApplication.approvedDate && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="text-emerald-600 mt-0.5" size={20} />
                    <div>
                      <h3 className="text-sm font-semibold text-emerald-900 mb-1">Approved</h3>
                      <p className="text-sm text-emerald-700">This application has been approved</p>
                      <p className="text-xs text-emerald-600 mt-1">Date: {selectedApplication.approvedDate}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <div className="flex gap-3 justify-end">
                <button 
                  onClick={() => setShowApplicationModal(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Close
                </button>
                {selectedApplication.status === 'Under Review' && (
                  <>
                    <button className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
                      Reject Application
                    </button>
                    <button className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium">
                      Approve Application
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderScholarships = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search scholarships..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <button
          onClick={() => setShowCreateScholarship(true)}
          className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
        >
          <Plus size={20} />
          Create Scholarship
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {scholarships.map(scholarship => (
          <div key={scholarship.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{scholarship.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusscholarshipColor(scholarship.status)}`}>
                    {scholarship.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{scholarship.type}</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handlePushScholarship(scholarship.id)}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                    pushedScholarships.includes(scholarship.id)
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 hover:bg-gray-400'
                  }`}
                >
                  <CheckCircle size={16} />
                  {pushedScholarships.includes(scholarship.id) ? 'Pushed' : 'Push'}
                </button>
                <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors" title="Edit">
                  <Edit size={18} className="text-gray-700" />
                </button>
                <button className="p-2 bg-red-100 rounded-lg hover:bg-red-200 transition-colors" title="Delete">
                  <Trash2 size={18} className="text-red-600" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-6 mb-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Amount</p>
                <p className="text-lg font-bold text-indigo-600">{scholarship.amount}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Period</p>
                <p className="text-lg font-bold text-gray-900">{scholarship.period}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Deadline</p>
                <p className="text-lg font-bold text-gray-900">{scholarship.deadline}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Department</p>
                <p className="text-lg font-bold text-gray-900">{scholarship.department}</p>
              </div>
              {scholarship.sponsor && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Sponsor</p>
                  <p className="text-sm font-semibold text-gray-900">{scholarship.sponsor}</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-xs text-blue-600 font-medium mb-1">Applicants</p>
                <p className="text-2xl font-bold text-blue-900">{scholarship.applicants}</p>
              </div>
              <div className="bg-emerald-50 rounded-lg p-3">
                <p className="text-xs text-emerald-600 font-medium mb-1">Awarded</p>
                <p className="text-2xl font-bold text-emerald-900">{scholarship.awarded}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-3">
                <p className="text-xs text-purple-600 font-medium mb-1">Budget Usage</p>
                <p className="text-2xl font-bold text-purple-900">
                  {Math.round((parseInt(scholarship.budgetUsed.replace(/[^0-9]/g, ''))/parseInt(scholarship.budget.replace(/[^0-9]/g, '')))*100)}%
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Push Confirmation Modal */}
      {showPushConfirmation && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 rounded-xl">
                  <CheckCircle size={24} />
                </div>
                <h2 className="text-2xl font-bold">Confirm Push to Students</h2>
              </div>
            </div>

            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to push this scholarship to all eligible students? 
                Once pushed, students will be able to view and apply for this scholarship.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900 font-medium">
                  This action will:
                </p>
                <ul className="mt-2 space-y-1 text-sm text-blue-800">
                  <li>• Notify all eligible students via email</li>
                  <li>• Make the scholarship visible in student portal</li>
                  <li>• Enable students to submit applications</li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <div className="flex gap-3 justify-end">
                <button 
                  onClick={() => {
                    setShowPushConfirmation(false);
                    setSelectedScholarshipToPush(null);
                  }}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmPush}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
                >
                  <CheckCircle size={20} />
                  Confirm Push
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Scholarship Modal */}
      {showCreateScholarship && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Create New Scholarship</h2>
                <button 
                  onClick={() => setShowCreateScholarship(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <XCircle size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Scholarship Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter scholarship name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
                    <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <option>Internal - Merit</option>
                      <option>Internal - Commendation</option>
                      <option>External - Company</option>
                      <option>External - International</option>
                      <option>External - Alumni</option>
                      <option>External - Partner</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
                    <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <option>Academic Affairs</option>
                      <option>Student Services</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Amount (VND)</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="10,000,000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Budget (VND)</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="100,000,000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Period</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="2024-2025"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Deadline</label>
                    <input
                      type="date"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Sponsor (Optional)</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Company or organization name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <textarea
                        rows={3}

                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter scholarship description"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Requirements</label>
                  <textarea
                        rows={3}

                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter requirements (one per line)"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Benefits</label>
                  <textarea
                        rows={3}

                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter benefits (one per line)"
                  ></textarea>
                </div>
              </form>
            </div>

            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <div className="flex gap-3 justify-end">
                <button 
                  onClick={() => setShowCreateScholarship(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    setShowCreateScholarship(false);
                    alert('Scholarship created successfully! You can now push it to students from the scholarships list.');
                  }}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  Create Scholarship
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-3">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 rounded-xl border sticky top-0 z-10">
        <div className="max-w mx-auto p-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Scholarship Management Portal</h1>
              <p className="text-gray-600 mt-1">Admin Dashboard for Academic Affairs & Student Services</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'overview'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <BarChart3 size={20} />
                Overview
              </div>
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'applications'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText size={20} />
                Applications
                <span className="px-2 py-0.5 bg-amber-500 text-white text-xs font-bold rounded-full">
                  {underReviewCount}
                </span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('scholarships')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'scholarships'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <Award size={20} />
                Scholarships
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w mx-auto py-3">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'applications' && renderApplications()}
        {activeTab === 'scholarships' && renderScholarships()}
      </div>
    </div>
  );
}




{/*research management for lecturer*/}

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
      <div className="min-h-screen bg-gray-50 p-3">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Student Services Overview</h1>
            <p className="text-sm text-gray-500 mt-1">Comprehensive management of all student support services</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
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

        <div className="grid grid-cols-2 gap-6 mt-3">
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



const StudentProfileAdmin = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterProgram, setFilterProgram] = useState("all");
  const [filterLevel, setFilterLevel] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState<any>(null);


    const [students, setStudents] = useState<studentdata[]>(sampleStudents);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // --- Filtering (basic, you can expand later)
  const filtered = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLevel =
      filterLevel === "all" || student.level.toLowerCase() === filterLevel;

    const matchesProgram =
      filterProgram === "all" ||
      student.program.toLowerCase() === filterProgram.toLowerCase();

    return matchesSearch && matchesLevel && matchesProgram;
  });

  // --- Pagination
  const totalStudents = filtered.length;
  const totalPages = Math.ceil(totalStudents / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalStudents);
  const pageStudents = filtered.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-gray-50 p-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Student Profile Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Comprehensive student data and analytics
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          + Add New Student
        </button>
      </div>

      {/* Stats cards remain unchanged... */}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mt-6">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search by student ID, name, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-3 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filterLevel}
              onChange={(e) => {
                setFilterLevel(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Levels</option>
              <option value="bachelor">Bachelor</option>
              <option value="master">Master</option>
              <option value="phd">PhD</option>
            </select>
            <select
              value={filterProgram}
              onChange={(e) => {
                setFilterProgram(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Programs</option>
              <option value="met">MET</option>
              <option value="mac">MAC</option>
              <option value="hat">HAT</option>
              <option value="mas">MAS</option>
              <option value="bns">BNS</option>
              <option value="has">HAS</option>
              <option value="mba">MBA</option>
              <option value="mns">MNS</option>
              <option value="mote">MOTE</option>
              <option value="dms">DMS</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Student ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Full Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Program
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Year
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  GPA
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pageStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                    {student.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {student.program}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        student.level === "Bachelor"
                          ? "bg-blue-100 text-blue-700"
                          : student.level === "Master"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {student.level}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    Year {student.year}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {student.gpa}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                      {student.status}
                    </span>
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

        {/* Pagination footer */}
        <div className="p-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {startIndex + 1}–{endIndex} of {totalStudents} students
          </p>
          <div className="flex items-center gap-3">
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-1 border border-gray-300 rounded"
            >
              <option value={20}>20 / page</option>
              <option value={50}>50 / page</option>
              <option value={100}>100 / page</option>
            </select>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white"
                      : "border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal (unchanged) */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          {/* modal content ... */}
        </div>
      )}
    </div>
  );
};



// Types


const ThesisManagement = () => {
  const [theses, setTheses] = useState<Thesis[]>(sampleTheses);
  const [selectedThesis, setSelectedThesis] = useState<Thesis | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "detail" | "create">("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<ThesisStatus | "all">("all");
  const [filterCategory, setFilterCategory] = useState<ThesisCategory | "all">("all");
  const [filterLevel, setFilterLevel] = useState<ThesisLevel | "all">("all");
  const [activeTab, setActiveTab] = useState<"overview" | "documents" | "reviews" | "defense" | "timeline" | "associated">("overview");

  // Statistics
  const stats = useMemo(() => {
    return {
      total: theses.length,
      submitted: theses.filter(t => t.status === "submitted").length,
      underReview: theses.filter(t => t.status === "under_review").length,
      approved: theses.filter(t => t.status === "approved").length,
      withPublications: theses.filter(t => t.associatedItems.publications.length > 0).length,
      withPatents: theses.filter(t => t.associatedItems.patents.length > 0).length,
      avgPlagiarism: theses.filter(t => t.plagiarismScore !== null)
        .reduce((acc, t) => acc + (t.plagiarismScore || 0), 0) / theses.filter(t => t.plagiarismScore !== null).length || 0,
      upcomingDefenses: theses.filter(t => t.defenseDate && new Date(t.defenseDate) > new Date()).length
    };
  }, [theses]);

  // Filter theses
  const filteredTheses = useMemo(() => {
    return theses.filter(thesis => {
      const matchesSearch = 
        thesis.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        thesis.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        thesis.student.studentId.includes(searchTerm) ||
        thesis.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === "all" || thesis.status === filterStatus;
      const matchesCategory = filterCategory === "all" || thesis.category === filterCategory;
      const matchesLevel = filterLevel === "all" || thesis.level === filterLevel;
      return matchesSearch && matchesStatus && matchesCategory && matchesLevel;
    });
  }, [theses, searchTerm, filterStatus, filterCategory, filterLevel]);

  const getStatusColor = (status: ThesisStatus) => {
    switch (status) {
      case "draft": return "bg-gray-100 text-gray-700";
      case "submitted": return "bg-blue-100 text-blue-700";
      case "under_review": return "bg-yellow-100 text-yellow-700";
      case "revision_required": return "bg-orange-100 text-orange-700";
      case "approved": return "bg-green-100 text-green-700";
      case "rejected": return "bg-red-100 text-red-700";
      case "published": return "bg-purple-100 text-purple-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: ThesisStatus) => {
    switch (status) {
      case "draft": return <Edit className="w-4 h-4" />;
      case "submitted": return <Upload className="w-4 h-4" />;
      case "under_review": return <Clock className="w-4 h-4" />;
      case "revision_required": return <AlertCircle className="w-4 h-4" />;
      case "approved": return <CheckCircle className="w-4 h-4" />;
      case "rejected": return <XCircle className="w-4 h-4" />;
      case "published": return <Award className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (category: ThesisCategory, level: ThesisLevel) => {
    const categoryLabel = category === "thesis" ? "Thesis" : 
                         category === "dissertation" ? "Dissertation" : "Final Project";
    const levelLabel = level === "bachelor" ? "Bachelor's" : 
                      level === "master" ? "Master's" : "PhD";
    return `${levelLabel} ${categoryLabel}`;
  };

  const getCategoryColor = (category: ThesisCategory) => {
    switch (category) {
      case "thesis": return "bg-blue-100 text-blue-700";
      case "dissertation": return "bg-purple-100 text-purple-700";
      case "final_project": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getLevelColor = (level: ThesisLevel) => {
    switch (level) {
      case "bachelor": return "bg-cyan-100 text-cyan-700";
      case "master": return "bg-indigo-100 text-indigo-700";
      case "phd": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const formatStatus = (status: ThesisStatus) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <ChevronRight className="w-4 h-4" />
           
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Thesis/Dissertation Management</h1>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {/* Export report */}}
            className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Report
          </button>
          <button
            onClick={() => setViewMode("create")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add New Thesis
          </button>
        </div>
      </div>

      {viewMode === "list" ? (
        <>
          {/* Statistics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Total Works</p>
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-xs text-gray-500 mt-1">All categories</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Submitted</p>
                <Upload className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-blue-600">{stats.submitted}</p>
              <p className="text-xs text-gray-500 mt-1">Awaiting review</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Under Review</p>
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <p className="text-2xl font-bold text-yellow-600">{stats.underReview}</p>
              <p className="text-xs text-gray-500 mt-1">In review process</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Approved</p>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              <p className="text-xs text-gray-500 mt-1">Completed works</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">With Publications</p>
                <FileCheck className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-purple-600">{stats.withPublications}</p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.total > 0 ? `${Math.round((stats.withPublications / stats.total) * 100)}% of total` : '0% of total'}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">With Patents</p>
                <Scroll className="w-5 h-5 text-orange-600" />
              </div>
              <p className="text-2xl font-bold text-orange-600">{stats.withPatents}</p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.total > 0 ? `${Math.round((stats.withPatents / stats.total) * 100)}% of total` : '0% of total'}
              </p>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by title, student name, ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value as ThesisCategory | "all")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  <option value="thesis">Thesis</option>
                  <option value="dissertation">Dissertation</option>
                  <option value="final_project">Final Project</option>
                </select>
              </div>

              <div>
                <select
                  value={filterLevel}
                  onChange={(e) => setFilterLevel(e.target.value as ThesisLevel | "all")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Levels</option>
                  <option value="bachelor">Bachelor&apos;s</option>
                  <option value="master">Master&apos;s</option>
                  <option value="phd">PhD</option>
                </select>
              </div>

              <div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as ThesisStatus | "all")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="submitted">Submitted</option>
                  <option value="under_review">Under Review</option>
                  <option value="revision_required">Revision Required</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>
          </div>

          {/* Theses List */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title & Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supervisor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Defense</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTheses.map(thesis => (
                    <tr key={thesis.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <span className="text-sm font-medium text-gray-900">{thesis.id}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <div className="text-sm font-medium text-gray-900 truncate">{thesis.title}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                            <GraduationCap className="w-4 h-4" />
                            {thesis.student.name} ({thesis.student.studentId})
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(thesis.category)}`}>
                          {thesis.category === "thesis" ? "Thesis" : 
                           thesis.category === "dissertation" ? "Dissertation" : "Final Project"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLevelColor(thesis.level)}`}>
                          {thesis.level === "bachelor" ? "Bachelor's" : 
                           thesis.level === "master" ? "Master's" : "PhD"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{thesis.supervisor.name}</div>
                        <div className="text-xs text-gray-500 truncate max-w-[150px]">{thesis.supervisor.department}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(thesis.status)}`}>
                          {getStatusIcon(thesis.status)}
                          {formatStatus(thesis.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {thesis.defenseDate ? (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {thesis.defenseDate}
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">Not scheduled</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => {
                            setSelectedThesis(thesis);
                            setViewMode("detail");
                          }}
                          className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : viewMode === "detail" && selectedThesis ? (
        /* Detail View */
        <div className="space-y-6">
          {/* Back Button */}
          <button
            onClick={() => setViewMode("list")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Back to Thesis List
          </button>

          {/* Thesis Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-medium text-gray-500">{selectedThesis.id}</span>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedThesis.status)}`}>
                    {getStatusIcon(selectedThesis.status)}
                    {formatStatus(selectedThesis.status)}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(selectedThesis.category)}`}>
                    {selectedThesis.category === "thesis" ? "Thesis" : 
                     selectedThesis.category === "dissertation" ? "Dissertation" : "Final Project"}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLevelColor(selectedThesis.level)}`}>
                    {selectedThesis.level === "bachelor" ? "Bachelor's" : 
                     selectedThesis.level === "master" ? "Master's" : "PhD"}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedThesis.title}</h2>
                <p className="text-gray-600 italic mb-4">{selectedThesis.titleVietnamese}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <GraduationCap className="w-5 h-5 text-blue-600 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Student</p>
                      <p className="text-sm text-gray-900">{selectedThesis.student.name}</p>
                      <p className="text-xs text-gray-500">{selectedThesis.student.studentId} • {selectedThesis.student.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <UserCheck className="w-5 h-5 text-green-600 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Supervisor</p>
                      <p className="text-sm text-gray-900">{selectedThesis.supervisor.name}</p>
                      <p className="text-xs text-gray-500">{selectedThesis.supervisor.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="flex">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`px-6 py-3 text-sm font-medium ${
                    activeTab === "overview"
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab("documents")}
                  className={`px-6 py-3 text-sm font-medium ${
                    activeTab === "documents"
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Documents
                </button>
                <button
                  onClick={() => setActiveTab("reviews")}
                  className={`px-6 py-3 text-sm font-medium ${
                    activeTab === "reviews"
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Reviews ({selectedThesis.reviews.length})
                </button>
                <button
                  onClick={() => setActiveTab("defense")}
                  className={`px-6 py-3 text-sm font-medium ${
                    activeTab === "defense"
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Defense
                </button>
                <button
                  onClick={() => setActiveTab("timeline")}
                  className={`px-6 py-3 text-sm font-medium ${
                    activeTab === "timeline"
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Timeline
                </button>
                <button
                  onClick={() => setActiveTab("associated")}
                  className={`px-6 py-3 text-sm font-medium ${
                    activeTab === "associated"
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Associated Items
                </button>
              </nav>
            </div>

            <div className="p-6">
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Abstract</h3>
                    <p className="text-gray-700 leading-relaxed">{selectedThesis.abstract}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Details</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-sm text-gray-600">Department</span>
                          <span className="text-sm font-medium text-gray-900">{selectedThesis.department}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-sm text-gray-600">Field of Study</span>
                          <span className="text-sm font-medium text-gray-900">{selectedThesis.fieldOfStudy}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-sm text-gray-600">Academic Year</span>
                          <span className="text-sm font-medium text-gray-900">{selectedThesis.academicYear}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-sm text-gray-600">Submission Date</span>
                          <span className="text-sm font-medium text-gray-900">{selectedThesis.submissionDate}</span>
                        </div>
                        {selectedThesis.plagiarismScore !== null && (
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-600">Plagiarism Score</span>
                            <span className={`text-sm font-medium ${selectedThesis.plagiarismScore <= 15 ? 'text-green-600' : 'text-red-600'}`}>
                              {selectedThesis.plagiarismScore}%
                            </span>
                          </div>
                        )}
                        {selectedThesis.finalGrade && (
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-600">Final Grade</span>
                            <span className="text-sm font-medium text-gray-900">{selectedThesis.finalGrade}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Keywords</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedThesis.keywords.map((keyword, idx) => (
                          <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Documents Tab */}
              {activeTab === "documents" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Uploaded Documents</h3>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Upload Document
                    </button>
                  </div>

                  <div className="space-y-3">
                    {selectedThesis.documents.proposal && (
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Thesis Proposal</p>
                            <p className="text-xs text-gray-500">{selectedThesis.documents.proposal}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-2 text-gray-600 hover:text-blue-600">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-600 hover:text-blue-600">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}

                    {selectedThesis.documents.fullThesis && (
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Full Thesis Document</p>
                            <p className="text-xs text-gray-500">{selectedThesis.documents.fullThesis}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-2 text-gray-600 hover:text-blue-600">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-600 hover:text-blue-600">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}

                    {selectedThesis.documents.presentation && (
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Defense Presentation</p>
                            <p className="text-xs text-gray-500">{selectedThesis.documents.presentation}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-2 text-gray-600 hover:text-blue-600">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-600 hover:text-blue-600">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}

                    {selectedThesis.documents.plagiarismReport && (
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                            <BarChart3 className="w-5 h-5 text-orange-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Plagiarism Report</p>
                            <p className="text-xs text-gray-500">{selectedThesis.documents.plagiarismReport}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-2 text-gray-600 hover:text-blue-600">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-600 hover:text-blue-600">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Reviews Tab */}
              {activeTab === "reviews" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Thesis Reviews</h3>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Assign Reviewer
                    </button>
                  </div>

                  {selectedThesis.reviews.length > 0 ? (
                    <div className="space-y-4">
                      {selectedThesis.reviews.map(review => (
                        <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                                {review.reviewerName.charAt(0)}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{review.reviewerName}</p>
                                <p className="text-xs text-gray-500">{review.reviewerEmail}</p>
                              </div>
                            </div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              review.status === "completed" ? "bg-green-100 text-green-700" :
                              review.status === "in_progress" ? "bg-yellow-100 text-yellow-700" :
                              "bg-gray-100 text-gray-700"
                            }`}>
                              {review.status === "completed" ? "Completed" :
                               review.status === "in_progress" ? "In Progress" : "Pending"}
                            </span>
                          </div>

                          {review.rating !== null && (
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm text-gray-600">Rating:</span>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`w-4 h-4 ${i < Math.floor(review.rating! / 2) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                  />
                                ))}
                                <span className="text-sm font-medium text-gray-900 ml-2">{review.rating}/10</span>
                              </div>
                            </div>
                          )}

                          {review.comments && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-700">{review.comments}</p>
                            </div>
                          )}

                          {review.submittedDate && (
                            <p className="text-xs text-gray-500 mt-2">Submitted on {review.submittedDate}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600">No reviews yet</p>
                    </div>
                  )}
                </div>
              )}

              {/* Defense Tab */}
              {activeTab === "defense" && (
                <div className="space-y-6">
                  {selectedThesis.defense ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <Calendar className="w-5 h-5 text-blue-600" />
                            <h3 className="font-semibold text-gray-900">Defense Schedule</h3>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Date</span>
                              <span className="text-sm font-medium text-gray-900">{selectedThesis.defense.date}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Time</span>
                              <span className="text-sm font-medium text-gray-900">{selectedThesis.defense.time}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Location</span>
                              <span className="text-sm font-medium text-gray-900">{selectedThesis.defense.location}</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <Users className="w-5 h-5 text-green-600" />
                            <h3 className="font-semibold text-gray-900">Defense Committee</h3>
                          </div>
                          <div className="space-y-2">
                            {selectedThesis.defense.committee.map((member, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span className="text-sm text-gray-900">{member}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                          <Edit className="w-4 h-4" />
                          Reschedule Defense
                        </button>
                        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-2">
                          <Send className="w-4 h-4" />
                          Send Notifications
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 mb-4">Defense not scheduled yet</p>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto">
                        <Plus className="w-4 h-4" />
                        Schedule Defense
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Timeline Tab */}
              {activeTab === "timeline" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Thesis Progress Timeline</h3>
                  <div className="relative space-y-6">
                    {/* Timeline items */}
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                      </div>
                      <div className="flex-1 pb-6">
                        <p className="text-sm font-medium text-gray-900">Thesis Submitted</p>
                        <p className="text-xs text-gray-500">{selectedThesis.submissionDate}</p>
                        <p className="text-sm text-gray-600 mt-1">Full thesis document uploaded to the system</p>
                      </div>
                    </div>

                    {selectedThesis.reviews.length > 0 && (
                      <div className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                            <Clock className="w-5 h-5 text-yellow-600" />
                          </div>
                          <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                        </div>
                        <div className="flex-1 pb-6">
                          <p className="text-sm font-medium text-gray-900">Under Review</p>
                          <p className="text-xs text-gray-500">Current Status</p>
                          <p className="text-sm text-gray-600 mt-1">{selectedThesis.reviews.length} reviewer(s) assigned</p>
                        </div>
                      </div>
                    )}

                    {selectedThesis.defenseDate && (
                      <div className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">Defense Scheduled</p>
                          <p className="text-xs text-gray-500">{selectedThesis.defenseDate}</p>
                          <p className="text-sm text-gray-600 mt-1">Defense presentation scheduled</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Associated Items Tab */}
              {activeTab === "associated" && (
                <div className="space-y-6">
                  {/* Publications */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <FileCheck className="w-5 h-5 text-blue-600" />
                        Publications ({selectedThesis.associatedItems.publications.length})
                      </h3>
                      <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm">
                        <Plus className="w-4 h-4" />
                        Add Publication
                      </button>
                    </div>
                    
                    {selectedThesis.associatedItems.publications.length > 0 ? (
                      <div className="space-y-3">
                        {selectedThesis.associatedItems.publications.map(pub => (
                          <div key={pub.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="text-sm font-medium text-gray-900 mb-1">{pub.title}</h4>
                                <div className="flex items-center gap-4 text-xs text-gray-600 mb-2">
                                  <span className="flex items-center gap-1">
                                    <BookOpen className="w-3 h-3" />
                                    {pub.journalName}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {pub.publicationDate}
                                  </span>
                                  {pub.impactFactor && (
                                    <span className="flex items-center gap-1">
                                      <TrendingUp className="w-3 h-3" />
                                      IF: {pub.impactFactor}
                                    </span>
                                  )}
                                  {pub.citations !== undefined && (
                                    <span className="flex items-center gap-1">
                                      <Award className="w-3 h-3" />
                                      {pub.citations} citations
                                    </span>
                                  )}
                                </div>
                                {pub.doi && (
                                  <p className="text-xs text-gray-500">DOI: {pub.doi}</p>
                                )}
                              </div>
                              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                pub.status === "published" ? "bg-green-100 text-green-700" :
                                pub.status === "accepted" ? "bg-blue-100 text-blue-700" :
                                pub.status === "submitted" ? "bg-yellow-100 text-yellow-700" :
                                "bg-gray-100 text-gray-700"
                              }`}>
                                {pub.status.charAt(0).toUpperCase() + pub.status.slice(1)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <FileCheck className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">No publications associated yet</p>
                      </div>
                    )}
                  </div>

                  {/* Grants */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Award className="w-5 h-5 text-purple-600" />
                        Grants ({selectedThesis.associatedItems.grants.length})
                      </h3>
                      <button className="px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 text-sm">
                        <Plus className="w-4 h-4" />
                        Add Grant
                      </button>
                    </div>
                    
                    {selectedThesis.associatedItems.grants.length > 0 ? (
                      <div className="space-y-3">
                        {selectedThesis.associatedItems.grants.map(grant => (
                          <div key={grant.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <h4 className="text-sm font-medium text-gray-900">{grant.grantName}</h4>
                                <p className="text-xs text-gray-600 mt-1">{grant.fundingAgency}</p>
                              </div>
                              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                grant.status === "active" ? "bg-green-100 text-green-700" :
                                grant.status === "completed" ? "bg-blue-100 text-blue-700" :
                                grant.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                                "bg-red-100 text-red-700"
                              }`}>
                                {grant.status.charAt(0).toUpperCase() + grant.status.slice(1)}
                              </span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 mt-3 text-xs">
                              <div>
                                <span className="text-gray-600">Amount:</span>
                                <span className="font-medium text-gray-900 ml-1">
                                  {grant.amount.toLocaleString()} {grant.currency}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-600">Period:</span>
                                <span className="font-medium text-gray-900 ml-1">
                                  {grant.startDate} - {grant.endDate}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-600">PI:</span>
                                <span className="font-medium text-gray-900 ml-1">{grant.principalInvestigator}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <Award className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">No grants associated yet</p>
                      </div>
                    )}
                  </div>

                  {/* Funding */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Banknote className="w-5 h-5 text-green-600" />
                        Funding ({selectedThesis.associatedItems.funding.length})
                      </h3>
                      <button className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 text-sm">
                        <Plus className="w-4 h-4" />
                        Add Funding
                      </button>
                    </div>
                    
                    {selectedThesis.associatedItems.funding.length > 0 ? (
                      <div className="space-y-3">
                        {selectedThesis.associatedItems.funding.map(fund => (
                          <div key={fund.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <h4 className="text-sm font-medium text-gray-900">{fund.sourceName}</h4>
                                <p className="text-xs text-gray-600 mt-1">{fund.purpose}</p>
                              </div>
                              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                fund.status === "received" ? "bg-green-100 text-green-700" :
                                fund.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                                "bg-red-100 text-red-700"
                              }`}>
                                {fund.status.charAt(0).toUpperCase() + fund.status.slice(1)}
                              </span>
                            </div>
                            <div className="flex items-center gap-6 mt-3 text-xs">
                              <div>
                                <span className="text-gray-600">Type:</span>
                                <span className="font-medium text-gray-900 ml-1 capitalize">
                                  {fund.fundingType.replace('_', ' ')}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-600">Amount:</span>
                                <span className="font-medium text-gray-900 ml-1">
                                  {fund.amount.toLocaleString()} {fund.currency}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-600">Received:</span>
                                <span className="font-medium text-gray-900 ml-1">{fund.receivedDate}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <Banknote className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">No funding sources associated yet</p>
                      </div>
                    )}
                  </div>

                  {/* Patents */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Scroll className="w-5 h-5 text-orange-600" />
                        Patents ({selectedThesis.associatedItems.patents.length})
                      </h3>
                      <button className="px-3 py-1.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2 text-sm">
                        <Plus className="w-4 h-4" />
                        Add Patent
                      </button>
                    </div>
                    
                    {selectedThesis.associatedItems.patents.length > 0 ? (
                      <div className="space-y-3">
                        {selectedThesis.associatedItems.patents.map(patent => (
                          <div key={patent.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <h4 className="text-sm font-medium text-gray-900">{patent.patentTitle}</h4>
                                {patent.patentNumber && (
                                  <p className="text-xs text-gray-600 mt-1">Patent No: {patent.patentNumber}</p>
                                )}
                              </div>
                              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                patent.status === "granted" ? "bg-green-100 text-green-700" :
                                patent.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                                patent.status === "rejected" ? "bg-red-100 text-red-700" :
                                "bg-gray-100 text-gray-700"
                              }`}>
                                {patent.status.charAt(0).toUpperCase() + patent.status.slice(1)}
                              </span>
                            </div>
                            <div className="mt-3 text-xs space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="text-gray-600">Inventors:</span>
                                <span className="font-medium text-gray-900">{patent.inventors.join(', ')}</span>
                              </div>
                              <div className="flex items-center gap-6">
                                <div>
                                  <span className="text-gray-600">Application:</span>
                                  <span className="font-medium text-gray-900 ml-1">{patent.applicationDate}</span>
                                </div>
                                {patent.grantDate && (
                                  <div>
                                    <span className="text-gray-600">Granted:</span>
                                    <span className="font-medium text-gray-900 ml-1">{patent.grantDate}</span>
                                  </div>
                                )}
                                <div>
                                  <span className="text-gray-600">Country:</span>
                                  <span className="font-medium text-gray-900 ml-1">{patent.country}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <Scroll className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">No patents associated yet</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Create/Add New Thesis Form */
        <div className="space-y-6">
          <button
            onClick={() => setViewMode("list")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Back to Thesis List
          </button>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Register New Thesis</h2>
              <p className="text-sm text-gray-600 mt-1">Complete the form below to register a new thesis/dissertation</p>
            </div>

            <div className="p-6">
              <div className="text-center py-12 text-gray-500">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p>Thesis registration form would go here</p>
                <p className="text-sm mt-2">Include fields for student info, supervisor, title, abstract, etc.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};  

const CourseFeedback =() => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showFeedbackDetail, setShowFeedbackDetail] = useState(false);
  const [showPositiveComments, setShowPositiveComments] = useState(false);
  const [showNegativeComments, setShowNegativeComments] = useState(false);

  const courseFeedback = [
    {
      id: 1,
      courseCode: 'CS301',
      courseName: 'Data Structures and Algorithms',
      instructor: 'Dr. Nguyễn Văn A',
      semester: 'Fall 2024',
      totalResponses: 45,
      averageScore: 8.3,
      scoreDistribution: { 1: 0, 2: 0, 3: 1, 4: 2, 5: 3, 6: 5, 7: 8, 8: 12, 9: 10, 10: 4 },
      sentimentBreakdown: { positive: 35, neutral: 8, negative: 2 },
      comments: [
        { id: 1, text: 'Excellent course! The professor explains concepts very clearly and the assignments are challenging but fair.', score: 9, sentiment: 'positive', date: '2024-10-20' },
        { id: 2, text: 'Great learning experience. The material is well-organized and the instructor is always available for questions.', score: 9, sentiment: 'positive', date: '2024-10-19' },
        { id: 4, text: 'Very informative and engaging lectures. I feel much more confident in my coding skills now.', score: 10, sentiment: 'positive', date: '2024-10-17' },
        { id: 5, text: 'The pace is too fast for beginners. More foundational material would be helpful.', score: 6, sentiment: 'negative', date: '2024-10-16' }
      ]
    },
    {
      id: 2,
      courseCode: 'BUS202',
      courseName: 'Strategic Management',
      instructor: 'Prof. Trần Thị B',
      semester: 'Fall 2024',
      totalResponses: 52,
      averageScore: 7.8,
      scoreDistribution: { 1: 0, 2: 1, 3: 2, 4: 3, 5: 5, 6: 8, 7: 12, 8: 14, 9: 6, 10: 1 },
      sentimentBreakdown: { positive: 28, neutral: 18, negative: 6 },
      comments: [
        { id: 1, text: 'Very practical approach to strategy. Case studies are particularly useful.', score: 8, sentiment: 'positive', date: '2024-10-20' },
        { id: 3, text: 'Too much theory, not enough real-world application.', score: 5, sentiment: 'negative', date: '2024-10-18' },
        { id: 4, text: 'The professor brings great industry experience to the classroom.', score: 9, sentiment: 'positive', date: '2024-10-17' },
        { id: 5, text: 'Group projects are well-structured and help develop teamwork skills.', score: 8, sentiment: 'positive', date: '2024-10-16' }
      ]
    },
    {
      id: 3,
      courseCode: 'ENG101',
      courseName: 'Business English Communication',
      instructor: 'Ms. Lê Thị C',
      semester: 'Fall 2024',
      totalResponses: 38,
      averageScore: 9.1,
      scoreDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 1, 6: 2, 7: 4, 8: 8, 9: 15, 10: 8 },
      sentimentBreakdown: { positive: 34, neutral: 3, negative: 1 },
      comments: [
        { id: 1, text: 'Outstanding teacher! My English skills have improved dramatically.', score: 10, sentiment: 'positive', date: '2024-10-20' },
        { id: 2, text: 'Very engaging and supportive learning environment. Highly recommend!', score: 9, sentiment: 'positive', date: '2024-10-19' },
        { id: 3, text: 'Excellent feedback on presentations and written work.', score: 9, sentiment: 'positive', date: '2024-10-18' },
        { id: 4, text: 'The course materials are well-designed and relevant to business contexts.', score: 8, sentiment: 'positive', date: '2024-10-17' },
        { id: 5, text: 'Perfect balance of speaking, writing, and listening activities.', score: 10, sentiment: 'positive', date: '2024-10-16' }
      ]
    },
    {
      id: 4,
      courseCode: 'MATH203',
      courseName: 'Statistics for Business',
      instructor: 'Dr. Phạm Văn D',
      semester: 'Fall 2024',
      totalResponses: 41,
      averageScore: 6.9,
      scoreDistribution: { 1: 1, 2: 2, 3: 4, 4: 5, 5: 6, 6: 8, 7: 9, 8: 4, 9: 2, 10: 0 },
      sentimentBreakdown: { positive: 15, neutral: 16, negative: 10 },
      comments: [
        { id: 1, text: 'Difficult material but the professor tries to make it accessible.', score: 7, sentiment: 'positive', date: '2024-10-20' },
        { id: 2, text: 'Need more examples and practice problems during class.', score: 6, sentiment: 'negative', date: '2024-10-19' },
        { id: 4, text: 'Good course for understanding statistical concepts in business context.', score: 8, sentiment: 'positive', date: '2024-10-17' },
        { id: 5, text: 'Too much emphasis on theory, not enough on practical application.', score: 5, sentiment: 'negative', date: '2024-10-16' }
      ]
    },
    {
      id: 5,
      courseCode: 'MKT301',
      courseName: 'Digital Marketing',
      instructor: 'Ms. Hoàng Thị E',
      semester: 'Fall 2024',
      totalResponses: 47,
      averageScore: 8.7,
      scoreDistribution: { 1: 0, 2: 0, 3: 0, 4: 1, 5: 2, 6: 3, 7: 6, 8: 15, 9: 14, 10: 6 },
      sentimentBreakdown: { positive: 40, neutral: 5, negative: 2 },
      comments: [
        { id: 1, text: 'Amazing course! Very up-to-date with current digital marketing trends.', score: 10, sentiment: 'positive', date: '2024-10-20' },
        { id: 2, text: 'Practical assignments that prepare you for real marketing roles.', score: 9, sentiment: 'positive', date: '2024-10-19' },
        { id: 3, text: 'The instructor has great industry connections and shares valuable insights.', score: 9, sentiment: 'positive', date: '2024-10-18' },
        { id: 5, text: 'Excellent use of case studies from Vietnamese and international companies.', score: 9, sentiment: 'positive', date: '2024-10-16' }
      ]
    }
  ];

  const overallAverageScore = (courseFeedback.reduce((sum, course) => sum + course.averageScore, 0) / courseFeedback.length).toFixed(1);
  const totalResponses = courseFeedback.reduce((sum, course) => sum + course.totalResponses, 0);
  const totalPositive = courseFeedback.reduce((sum, course) => sum + course.sentimentBreakdown.positive, 0);
  const totalNeutral = courseFeedback.reduce((sum, course) => sum + course.sentimentBreakdown.neutral, 0);
  const totalNegative = courseFeedback.reduce((sum, course) => sum + course.sentimentBreakdown.negative, 0);

  const getSentimentColor = (sentiment) => {
    switch(sentiment) {
      case 'positive': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'neutral': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'negative': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch(sentiment) {
      case 'positive': return <ThumbsUp size={16} />;
      case 'neutral': return <Minus size={16} />;
      case 'negative': return <ThumbsDown size={16} />;
      default: return null;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 8.5) return 'text-emerald-600';
    if (score >= 7.0) return 'text-blue-600';
    if (score >= 6.0) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3">
      {/* Header */}
      <div className="bg-white border-b rounded-xl border-gray-200 sticky">
        <div className="max-w mx-auto p-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Course Feedback Management</h1>
              <p className="text-gray-600 mt-1">Student feedback analysis and sentiment tracking</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w mx-auto mt-3">
        <div className="space-y-4">
          {/* Statistics Cards */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <BarChart3 className="text-blue-600" size={24} />
                </div>
                <span className="text-sm font-semibold text-gray-600">Average Score</span>
              </div>
              <p className="text-4xl font-bold text-gray-900 mb-1">{overallAverageScore}</p>
              <p className="text-sm text-gray-500">Out of 10.0</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <MessageSquare className="text-purple-600" size={24} />
                </div>
                <span className="text-sm font-semibold text-gray-600">Total Responses</span>
              </div>
              <p className="text-4xl font-bold text-gray-900 mb-1">{totalResponses}</p>
              <p className="text-sm text-gray-500">{courseFeedback.length} courses</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-emerald-100 rounded-xl">
                  <ThumbsUp className="text-emerald-600" size={24} />
                </div>
                <span className="text-sm font-semibold text-gray-600">Positive Sentiment</span>
              </div>
              <p className="text-4xl font-bold text-gray-900 mb-1">{Math.round((totalPositive/totalResponses)*100)}%</p>
              <p className="text-sm text-emerald-600 font-medium">{totalPositive} responses</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-red-100 rounded-xl">
                  <ThumbsDown className="text-red-600" size={24} />
                </div>
                <span className="text-sm font-semibold text-gray-600">Needs Attention</span>
              </div>
              <p className="text-4xl font-bold text-gray-900 mb-1">{totalNegative}</p>
              <p className="text-sm text-red-600 font-medium">Negative responses</p>
            </div>
          </div>

          {/* Sentiment Overview Chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Overall Sentiment Distribution</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ThumbsUp size={18} className="text-emerald-600" />
                  <span className="text-sm text-gray-600">Positive</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-96 h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{width: `${(totalPositive/totalResponses)*100}%`}}></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-12">{totalPositive}</span>
                  <span className="text-sm text-gray-500 w-12">{Math.round((totalPositive/totalResponses)*100)}%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Minus size={18} className="text-amber-600" />
                  <span className="text-sm text-gray-600">Neutral</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-96 h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{width: `${(totalNeutral/totalResponses)*100}%`}}></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-12">{totalNeutral}</span>
                  <span className="text-sm text-gray-500 w-12">{Math.round((totalNeutral/totalResponses)*100)}%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ThumbsDown size={18} className="text-red-600" />
                  <span className="text-sm text-gray-600">Negative</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-96 h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 rounded-full" style={{width: `${(totalNegative/totalResponses)*100}%`}}></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-12">{totalNegative}</span>
                  <span className="text-sm text-gray-500 w-12">{Math.round((totalNegative/totalResponses)*100)}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Course Feedback List */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Course Feedback Analysis</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>
            </div>

            <div className="space-y-4">
              {courseFeedback.map(course => (
                <div key={course.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="text-lg font-bold text-gray-900">{course.courseCode}</h4>
                        <span className={`text-2xl font-bold ${getScoreColor(course.averageScore)}`}>
                          {course.averageScore.toFixed(1)}
                        </span>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={16} 
                              className={i < Math.round(course.averageScore/2) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm font-medium text-gray-700">{course.courseName}</p>
                      <p className="text-xs text-gray-500 mt-1">{course.instructor} • {course.semester}</p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedCourse(course);
                        setShowFeedbackDetail(true);
                      }}
                      className="flex items-center gap-1 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors text-sm font-medium"
                    >
                      <Eye size={16} />
                      View Details
                    </button>
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Responses</p>
                      <p className="text-xl font-bold text-gray-900">{course.totalResponses}</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-xs text-blue-600 font-medium mb-1">Average Score</p>
                      <p className="text-xl font-bold text-blue-900">
                        {course.averageScore.toFixed(1)}/10
                      </p>
                    </div>
                    <div className="bg-emerald-50 rounded-lg p-3">
                      <div className="flex items-center gap-1 mb-1">
                        <ThumbsUp size={14} className="text-emerald-600" />
                        <p className="text-xs text-emerald-600 font-medium">Positive</p>
                      </div>
                      <p className="text-xl font-bold text-emerald-900">
                        {Math.round((course.sentimentBreakdown.positive/course.totalResponses)*100)}%
                      </p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-3">
                      <div className="flex items-center gap-1 mb-1">
                        <ThumbsDown size={14} className="text-red-600" />
                        <p className="text-xs text-red-600 font-medium">Negative</p>
                      </div>
                      <p className="text-xl font-bold text-red-900">
                        {Math.round((course.sentimentBreakdown.negative/course.totalResponses)*100)}%
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feedback Detail Modal */}
          {showFeedbackDetail && selectedCourse && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                        <MessageSquare size={32} />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h2 className="text-2xl font-bold">{selectedCourse.courseCode} - {selectedCourse.courseName}</h2>
                          <span className="text-3xl font-bold">
                            {selectedCourse.averageScore.toFixed(1)}
                          </span>
                        </div>
                        <p className="text-indigo-100">{selectedCourse.instructor} • {selectedCourse.semester}</p>
                        <p className="text-indigo-200 text-sm mt-1">{selectedCourse.totalResponses} responses</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setShowFeedbackDetail(false)}
                      className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <XCircle size={24} />
                    </button>
                  </div>
                </div>

                <div className="p-6 overflow-y-auto max-h-[calc(90vh-250px)]">
                  {/* Top Metrics Cards */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <BarChart3 className="text-blue-600" size={20} />
                        <span className="text-sm font-semibold text-blue-900">Average Score</span>
                      </div>
                      <p className="text-4xl font-bold text-blue-900">{selectedCourse.averageScore.toFixed(1)}/10</p>
                      <p className="text-sm text-blue-700 mt-1">{selectedCourse.totalResponses} responses</p>
                    </div>
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <ThumbsUp className="text-emerald-600" size={20} />
                        <span className="text-sm font-semibold text-emerald-900">Positive</span>
                      </div>
                      <p className="text-4xl font-bold text-emerald-900">{selectedCourse.sentimentBreakdown.positive}</p>
                      <p className="text-sm text-emerald-700 mt-1">
                        {Math.round((selectedCourse.sentimentBreakdown.positive/selectedCourse.totalResponses)*100)}% of responses
                      </p>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <ThumbsDown className="text-red-600" size={20} />
                        <span className="text-sm font-semibold text-red-900">Negative</span>
                      </div>
                      <p className="text-4xl font-bold text-red-900">{selectedCourse.sentimentBreakdown.negative}</p>
                      <p className="text-sm text-red-700 mt-1">
                        {Math.round((selectedCourse.sentimentBreakdown.negative/selectedCourse.totalResponses)*100)}% of responses
                      </p>
                    </div>
                  </div>

                  {/* Student Comments */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Comments</h3>
                    
                    {/* Positive Comments Dropdown */}
                    <div className="mb-3 border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setShowPositiveComments(!showPositiveComments)}
                        className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-emerald-100 rounded-lg">
                            <ThumbsUp className="text-emerald-600" size={18} />
                          </div>
                          <div className="text-left">
                            <p className="font-semibold text-gray-900">Positive Responses</p>
                            <p className="text-xs text-gray-500">{selectedCourse.comments.filter(c => c.sentiment === 'positive').length} comments</p>
                          </div>
                        </div>
                        <svg 
                          className={`w-5 h-5 text-gray-400 transition-transform ${showPositiveComments ? 'rotate-180' : ''}`}
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      {showPositiveComments && (
                        <div className="border-t border-gray-200 bg-gray-50 p-4 space-y-3">
                          {selectedCourse.comments
                            .filter(comment => comment.sentiment === 'positive')
                            .map(comment => (
                              <div key={comment.id} className="bg-white border border-emerald-200 rounded-lg p-4">
                                <div className="flex items-start justify-between mb-2">
                                  <span className="text-sm font-bold text-emerald-600">Score: {comment.score}/10</span>
                                  <span className="text-xs text-gray-500">{comment.date}</span>
                                </div>
                                <p className="text-sm text-gray-700 leading-relaxed">{comment.text}</p>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>

                    {/* Negative Comments Dropdown */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setShowNegativeComments(!showNegativeComments)}
                        className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-red-100 rounded-lg">
                            <ThumbsDown className="text-red-600" size={18} />
                          </div>
                          <div className="text-left">
                            <p className="font-semibold text-gray-900">Negative Responses</p>
                            <p className="text-xs text-gray-500">{selectedCourse.comments.filter(c => c.sentiment === 'negative').length} comments</p>
                          </div>
                        </div>
                        <svg 
                          className={`w-5 h-5 text-gray-400 transition-transform ${showNegativeComments ? 'rotate-180' : ''}`}
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      {showNegativeComments && (
                        <div className="border-t border-gray-200 bg-gray-50 p-4 space-y-3">
                          {selectedCourse.comments
                            .filter(comment => comment.sentiment === 'negative')
                            .map(comment => (
                              <div key={comment.id} className="bg-white border border-red-200 rounded-lg p-4">
                                <div className="flex items-start justify-between mb-2">
                                  <span className="text-sm font-bold text-red-600">Score: {comment.score}/10</span>
                                  <span className="text-xs text-gray-500">{comment.date}</span>
                                </div>
                                <p className="text-sm text-gray-700 leading-relaxed">{comment.text}</p>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 p-6 bg-gray-50">
                  <div className="flex gap-3 justify-end">
                    <button 
                      onClick={() => setShowFeedbackDetail(false)}
                      className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    >
                      Close
                    </button>
                    <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2">
                      <Download size={20} />
                      Export Report
                    </button>
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




// Main Attendance Component
const AttendanceStudent: React.FC = () => {
  const [data] = useState(() => initializeAttendanceData());
  const [activeTab, setActiveTab] = useState<"overview" | "students" | "courses" | "alerts" | "cameras">("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "at-risk" | "eligible" | "ineligible">("all");
  const [selectedStudent, setSelectedStudent] = useState<StudentAttendanceStats | null>(null);
  const [dateRange, setDateRange] = useState<"week" | "month" | "semester">("month");

  // Filtered students
  const filteredStudents = useMemo(() => {
    return data.students.filter(student => {
      const matchesSearch = student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           student.studentId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = 
        filterStatus === "all" ? true :
        filterStatus === "at-risk" ? student.atRisk :
        filterStatus === "eligible" ? student.eligibleForExam :
        !student.eligibleForExam;
      
      return matchesSearch && matchesFilter;
    });
  }, [data.students, searchTerm, filterStatus]);

  // Overall stats
  const overallStats = useMemo(() => {
    const totalStudents = data.students.length;
    const avgAttendance = data.students.reduce((sum, s) => sum + s.attendanceRate, 0) / totalStudents;
    const atRisk = data.students.filter(s => s.atRisk).length;
    const eligible = data.students.filter(s => s.eligibleForExam).length;
    const criticalAlerts = data.alerts.filter(a => a.severity === "critical" && !a.acknowledged).length;

    return { totalStudents, avgAttendance, atRisk, eligible, criticalAlerts };
  }, [data]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-gray-900">
              Attendance Monitoring
            </h1>
            <p className="text-gray-600 text-sm">
              Track student attendance, analyze trends, and manage exam eligibility
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-all">
              <RefreshCw size={16} />
              <span>Sync Cameras</span>
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-all">
              <Download size={16} />
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            icon={<Users size={24} />}
            title="Total Students"
            value={overallStats.totalStudents.toString()}
            subtitle="Enrolled this semester"
            color="blue"
          />
          <MetricCard
            icon={<BarChart3 size={24} />}
            title="Average Attendance"
            value={`${overallStats.avgAttendance.toFixed(1)}%`}
            subtitle={overallStats.avgAttendance >= 70 ? "Above threshold" : "Below threshold"}
            color={overallStats.avgAttendance >= 70 ? "green" : "red"}
            trend={overallStats.avgAttendance >= 70 ? "up" : "down"}
          />
          <MetricCard
            icon={<CheckCircle size={24} />}
            title="Exam Eligible"
            value={overallStats.eligible.toString()}
            subtitle={`${((overallStats.eligible / overallStats.totalStudents) * 100).toFixed(0)}% of students`}
            color="green"
          />
          <MetricCard
            icon={<AlertTriangle size={24} />}
            title="At Risk"
            value={overallStats.atRisk.toString()}
            subtitle={`${overallStats.criticalAlerts} critical alerts`}
            color="orange"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="flex border-b border-gray-200 px-4 overflow-x-auto">
          {[
            { id: "overview", label: "Overview", icon: <BarChart3 size={18} /> },
            { id: "students", label: "Students", icon: <Users size={18} /> },
            { id: "courses", label: "Courses", icon: <BookOpen size={18} /> },
            { id: "alerts", label: "Alerts", icon: <Bell size={18} /> },
            { id: "cameras", label: "AI Cameras", icon: <Camera size={18} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-4 flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 font-semibold'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "overview" && (
            <OverviewTab 
              data={data} 
              stats={overallStats}
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />
          )}
          
          {activeTab === "students" && (
            <StudentsTab
              students={filteredStudents}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              filterStatus={filterStatus}
              onFilterChange={setFilterStatus}
              selectedStudent={selectedStudent}
              onSelectStudent={setSelectedStudent}
            />
          )}
          
          {activeTab === "courses" && (
            <CoursesTab courses={data.courses} />
          )}
          
          {activeTab === "alerts" && (
            <AlertsTab alerts={data.alerts} />
          )}
          
          {activeTab === "cameras" && (
            <CamerasTab cameras={data.cameras} />
          )}
        </div>
      </div>
    </div>
  );
};

// Metric Card Component
const MetricCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  color: string;
  trend?: "up" | "down";
}> = ({ icon, title, value, subtitle, color, trend }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
    orange: 'bg-orange-50 text-orange-600',
  }[color];

  return (
    <div className="bg-white p-5 rounded-lg shadow-sm flex gap-4 hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${colorClasses}`}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="text-xs text-gray-600 mb-1">{title}</div>
        <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
        <div className="text-xs text-gray-600 flex items-center gap-1">
          {trend && (
            trend === "up" ? 
              <TrendingUp size={14} className="text-green-600" /> : 
              <TrendingDown size={14} className="text-red-600" />
          )}
          {subtitle}
        </div>
      </div>
    </div>
  );
};

// Overview Tab
const OverviewTab: React.FC<{
  data: {
    records: AttendanceRecord[];
    students: StudentAttendanceStats[];
    courses: CourseAttendance[];
    alerts: AttendanceAlert[];
    cameras: AICamera[];
  };
  stats: any;
  dateRange: string;
  onDateRangeChange: (range: "week" | "month" | "semester") => void;
}> = ({ data, stats, dateRange, onDateRangeChange }) => {
  return (
    <div className="flex flex-col gap-6">
      {/* Attendance Trend Chart */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Attendance Trends</h3>
          <div className="flex gap-2">
            {["week", "month", "semester"].map(range => (
              <button
                key={range}
                onClick={() => onDateRangeChange(range as any)}
                className={`px-3 py-1.5 text-xs rounded transition-all capitalize ${
                  dateRange === range
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
        <AttendanceTrendChart data={data.records} />
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Attendance Distribution</h3>
          <AttendanceDistribution students={data.students} />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Source Breakdown</h3>
          <SourceBreakdown records={data.records} />
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Recent Sessions</h3>
        <RecentSessions records={data.records.slice(0, 10)} />
      </div>
    </div>
  );
};

// Attendance Trend Chart
const AttendanceTrendChart: React.FC<{ data: AttendanceRecord[] }> = ({ data }) => {
  const chartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    return last7Days.map(date => {
      const dayRecords = data.filter(r => r.date.toISOString().split('T')[0] === date);
      const present = dayRecords.filter(r => r.status === "present").length;
      const total = dayRecords.length;
      const rate = total > 0 ? (present / total) * 100 : 0;
      
      return {
        date: new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        rate: rate.toFixed(1)
      };
    });
  }, [data]);

  return (
    <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
      <div className="flex h-48 items-end gap-3">
        {chartData.map((item, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center gap-2">
            <div className="text-xs font-semibold text-gray-700">
              {item.rate}%
            </div>
            <div
              className={`w-full rounded-t transition-all ${
                parseFloat(item.rate) >= 70 ? 'bg-green-500' : 
                parseFloat(item.rate) >= 50 ? 'bg-orange-500' : 
                'bg-red-500'
              }`}
              style={{ height: `${(parseFloat(item.rate) / 100) * 140}px` }}
            />
            <div className="text-xs text-gray-600 text-center">
              {item.date}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Attendance Distribution
const AttendanceDistribution: React.FC<{ students: StudentAttendanceStats[] }> = ({ students }) => {
  const distribution = useMemo(() => {
    const ranges = [
      { label: "90-100%", count: students.filter(s => s.attendanceRate >= 90).length, color: "bg-green-600" },
      { label: "80-89%", count: students.filter(s => s.attendanceRate >= 80 && s.attendanceRate < 90).length, color: "bg-green-500" },
      { label: "70-79%", count: students.filter(s => s.attendanceRate >= 70 && s.attendanceRate < 80).length, color: "bg-yellow-500" },
      { label: "60-69%", count: students.filter(s => s.attendanceRate >= 60 && s.attendanceRate < 70).length, color: "bg-orange-500" },
      { label: "Below 60%", count: students.filter(s => s.attendanceRate < 60).length, color: "bg-red-500" }
    ];
    return ranges;
  }, [students]);

  const maxCount = Math.max(...distribution.map(d => d.count));

  return (
    <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
      {distribution.map((item, idx) => (
        <div key={idx} className="mb-3 last:mb-0">
          <div className="flex justify-between mb-1">
            <span className="text-sm text-gray-700">{item.label}</span>
            <span className="text-sm font-semibold text-gray-900">{item.count} students</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full ${item.color} transition-all`}
              style={{ width: `${(item.count / maxCount) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

// Source Breakdown
const SourceBreakdown: React.FC<{ records: AttendanceRecord[] }> = ({ records }) => {
  const breakdown = useMemo(() => {
    const aiCamera = records.filter(r => r.source === "ai-camera").length;
    const quiz = records.filter(r => r.source === "quiz").length;
    const manual = records.filter(r => r.source === "manual").length;
    const total = records.length;

    return [
      { label: "AI Camera", count: aiCamera, percentage: ((aiCamera / total) * 100).toFixed(1), color: "blue", icon: <Camera size={16} /> },
      { label: "Quiz/Assignment", count: quiz, percentage: ((quiz / total) * 100).toFixed(1), color: "purple", icon: <FileText size={16} /> },
      { label: "Manual Entry", count: manual, percentage: ((manual / total) * 100).toFixed(1), color: "gray", icon: <UserCheck size={16} /> }
    ];
  }, [records]);

  return (
    <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
      {breakdown.map((item, idx) => (
        <div key={idx} className={`flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 ${idx < breakdown.length - 1 ? 'mb-2' : ''}`}>
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              item.color === 'blue' ? 'bg-blue-100 text-blue-600' :
              item.color === 'purple' ? 'bg-purple-100 text-purple-600' :
              'bg-gray-100 text-gray-600'
            }`}>
              {item.icon}
            </div>
            <span className="text-sm text-gray-700">{item.label}</span>
          </div>
          <div className="text-right">
            <div className="text-base font-semibold text-gray-900">{item.count}</div>
            <div className="text-xs text-gray-600">{item.percentage}%</div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Recent Sessions
const RecentSessions: React.FC<{ records: AttendanceRecord[] }> = ({ records }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600">Date/Time</th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600">Student</th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600">Course</th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600">Status</th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600">Source</th>
          </tr>
        </thead>
        <tbody>
          {records.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 10).map((record, idx) => (
            <tr key={record.id} className={`${idx > 0 ? 'border-t border-gray-200' : ''} hover:bg-gray-50`}>
              <td className="px-3 py-3 text-sm text-gray-700">
                {record.date.toLocaleDateString()} {record.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </td>
              <td className="px-3 py-3 text-sm font-medium text-gray-900">
                {record.studentName}
              </td>
              <td className="px-3 py-3 text-sm text-gray-700">
                {record.courseName}
              </td>
              <td className="px-3 py-3">
                <StatusBadge status={record.status} />
              </td>
              <td className="px-3 py-3">
                <SourceBadge source={record.source} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Students Tab
const StudentsTab: React.FC<{
  students: StudentAttendanceStats[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filterStatus: string;
  onFilterChange: (status: any) => void;
  selectedStudent: StudentAttendanceStats | null;
  onSelectStudent: (student: StudentAttendanceStats | null) => void;
}> = ({ students, searchTerm, onSearchChange, filterStatus, onFilterChange, selectedStudent, onSelectStudent }) => {
  return (
    <div>
      {/* Search and Filter */}
      <div className="flex gap-3 mb-5">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or student ID..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => onFilterChange(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Students</option>
          <option value="at-risk">At Risk</option>
          <option value="eligible">Exam Eligible</option>
          <option value="ineligible">Exam Ineligible</option>
        </select>
      </div>

      {/* Student List */}
      {selectedStudent ? (
        <StudentDetailView 
          student={selectedStudent} 
          onBack={() => onSelectStudent(null)} 
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {students.map(student => (
            <StudentCard 
              key={student.studentId} 
              student={student} 
              onClick={() => onSelectStudent(student)}
            />
          ))}
        </div>
      )}

      {students.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <Users size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-base">No students found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

// Student Card
const StudentCard: React.FC<{
  student: StudentAttendanceStats;
  onClick: () => void;
}> = ({ student, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-lg p-5 cursor-pointer transition-all hover:border-blue-500 hover:shadow-lg hover:-translate-y-1"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-base font-semibold text-gray-900 mb-1">
            {student.studentName}
          </h4>
          <p className="text-xs text-gray-600">
            {student.studentId} • Year {student.year}
          </p>
        </div>
        {student.atRisk && (
          <AlertTriangle size={18} className="text-orange-500" />
        )}
      </div>

      <div className="mb-3">
        <div className="flex justify-between mb-1.5">
          <span className="text-sm text-gray-700">Attendance Rate</span>
          <span className={`text-sm font-semibold ${
            student.eligibleForExam ? 'text-green-600' : 'text-red-600'
          }`}>
            {student.attendanceRate.toFixed(1)}%
          </span>
        </div>
        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${
              student.eligibleForExam ? 'bg-green-500' : 'bg-red-500'
            }`}
            style={{ width: `${student.attendanceRate}%` }}
          />
        </div>
      </div>

      <div className="flex gap-3 text-xs mb-3">
        <div className="flex-1">
          <div className="text-gray-600 mb-0.5">Present</div>
          <div className="font-semibold text-gray-900">{student.attended}/{student.totalSessions}</div>
        </div>
        <div className="flex-1">
          <div className="text-gray-600 mb-0.5">Quiz Bonus</div>
          <div className="font-semibold text-purple-600">+{student.quizBonus}%</div>
        </div>
      </div>

      <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
        <div className={`text-xs px-2 py-1 rounded font-medium ${
          student.eligibleForExam
            ? 'bg-green-50 text-green-700'
            : 'bg-red-50 text-red-700'
        }`}>
          {student.eligibleForExam ? '✓ Exam Eligible' : '✗ Not Eligible'}
        </div>
        <Eye size={14} className="text-gray-400" />
      </div>
    </div>
  );
};

// Student Detail View
const StudentDetailView: React.FC<{
  student: StudentAttendanceStats;
  onBack: () => void;
}> = ({ student, onBack }) => {
  return (
    <div>
      <button
        onClick={onBack}
        className="px-4 py-2 border border-gray-200 bg-white rounded-lg hover:bg-gray-50 mb-5 flex items-center gap-2 transition-all"
      >
        ← Back to List
      </button>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">{student.studentName}</h2>
            <p className="text-gray-600">{student.studentId} • {student.program} ({student.level}) • Year {student.year}</p>
          </div>
          <div className={`px-5 py-3 rounded-lg font-semibold ${
            student.eligibleForExam
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {student.eligibleForExam ? '✓ Exam Eligible' : '✗ Not Eligible for Exam'}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-600 mb-1">Attendance Rate</div>
            <div className={`text-3xl font-bold ${student.eligibleForExam ? 'text-green-600' : 'text-red-600'}`}>
              {student.attendanceRate.toFixed(1)}%
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-600 mb-1">Sessions Attended</div>
            <div className="text-3xl font-bold text-gray-900">
              {student.attended}/{student.totalSessions}
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-600 mb-1">Quiz Bonus</div>
            <div className="text-3xl font-bold text-purple-600">
              +{student.quizBonus}%
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-600 mb-1">Absences</div>
            <div className="text-3xl font-bold text-red-600">
              {student.absent}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-base font-semibold mb-3">Attendance Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { label: "Present", value: student.attended, color: "text-green-600" },
              { label: "Late", value: student.late, color: "text-yellow-600" },
              { label: "Absent", value: student.absent, color: "text-red-600" },
              { label: "Excused", value: student.excused, color: "text-gray-600" }
            ].map(item => (
              <div key={item.label} className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">{item.label}</span>
                <span className={`font-semibold ${item.color}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {student.atRisk && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3 items-start">
            <AlertTriangle size={20} className="text-red-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-red-900 mb-1">
                At Risk: Attendance Below Threshold
              </div>
              <div className="text-sm text-red-800">
                This student needs {Math.ceil((70 - student.attendanceRate) * student.totalSessions / 100)} more attended sessions to become eligible for the final exam.
                {student.quizBonus > 0 && ` Current quiz bonus: +${student.quizBonus}%`}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Courses Tab
const CoursesTab: React.FC<{ courses: CourseAttendance[] }> = ({ courses }) => {
  const [sortBy, setSortBy] = useState<"name" | "attendance" | "atRisk">("attendance");

  const sortedCourses = useMemo(() => {
    return [...courses].sort((a, b) => {
      if (sortBy === "name") return a.courseName.localeCompare(b.courseName);
      if (sortBy === "attendance") return b.averageAttendance - a.averageAttendance;
      return b.atRiskStudents - a.atRiskStudents;
    });
  }, [courses, sortBy]);

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-lg font-semibold">Course Performance</h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="attendance">Sort by Attendance</option>
          <option value="atRisk">Sort by At-Risk Students</option>
          <option value="name">Sort by Name</option>
        </select>
      </div>

      <div className="flex flex-col gap-4">
        {sortedCourses.map(course => (
          <div
            key={course.courseId}
            className="bg-white border border-gray-200 rounded-lg p-5"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h4 className="text-base font-semibold mb-1">{course.courseName}</h4>
                <p className="text-sm text-gray-600">
                  {course.courseId} • Instructor: {course.instructor}
                </p>
              </div>
              <div className="flex items-center gap-1">
                {course.trend === "up" ? (
                  <TrendingUp size={18} className="text-green-600" />
                ) : course.trend === "down" ? (
                  <TrendingDown size={18} className="text-red-600" />
                ) : (
                  <Minus size={18} className="text-gray-600" />
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-3">
              <div>
                <div className="text-xs text-gray-600 mb-1">Students</div>
                <div className="text-xl font-semibold">{course.totalStudents}</div>
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1">Avg Attendance</div>
                <div className={`text-xl font-semibold ${
                  course.averageAttendance >= 70 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {course.averageAttendance.toFixed(1)}%
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1">Sessions</div>
                <div className="text-xl font-semibold">{course.sessionsHeld}</div>
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1">At Risk</div>
                <div className="text-xl font-semibold text-orange-600">{course.atRiskStudents}</div>
              </div>
            </div>

            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  course.averageAttendance >= 70 ? 'bg-green-500' : 'bg-red-500'
                }`}
                style={{ width: `${course.averageAttendance}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Alerts Tab
const AlertsTab: React.FC<{ alerts: AttendanceAlert[] }> = ({ alerts }) => {
  const [filter, setFilter] = useState<"all" | "critical" | "warning" | "unacknowledged">("all");

  const filteredAlerts = useMemo(() => {
    return alerts.filter(alert => {
      if (filter === "all") return true;
      if (filter === "unacknowledged") return !alert.acknowledged;
      return alert.severity === filter;
    });
  }, [alerts, filter]);

  const stats = useMemo(() => {
    return {
      total: alerts.length,
      critical: alerts.filter(a => a.severity === "critical").length,
      warning: alerts.filter(a => a.severity === "warning").length,
      unacknowledged: alerts.filter(a => !a.acknowledged).length
    };
  }, [alerts]);

  return (
    <div>
      <div className="grid grid-cols-4 gap-3 mb-5">
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-xs text-gray-600 mb-1">Total Alerts</div>
          <div className="text-2xl font-bold">{stats.total}</div>
        </div>
        <div className="p-3 bg-red-50 rounded-lg border border-red-200">
          <div className="text-xs text-red-700 mb-1">Critical</div>
          <div className="text-2xl font-bold text-red-600">{stats.critical}</div>
        </div>
        <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
          <div className="text-xs text-orange-700 mb-1">Warning</div>
          <div className="text-2xl font-bold text-orange-600">{stats.warning}</div>
        </div>
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-xs text-blue-700 mb-1">Unacknowledged</div>
          <div className="text-2xl font-bold text-blue-600">{stats.unacknowledged}</div>
        </div>
      </div>

      <div className="flex gap-2 mb-5">
        {["all", "critical", "warning", "unacknowledged"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-4 py-2 rounded-lg text-sm capitalize transition-all ${
              filter === f
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {filteredAlerts.map(alert => (
          <div
            key={alert.id}
            className={`bg-white border rounded-lg p-4 flex gap-4 items-start ${
              alert.severity === "critical" ? 'border-red-300' :
              alert.severity === "warning" ? 'border-orange-300' :
              'border-blue-300'
            }`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
              alert.severity === "critical" ? 'bg-red-50' :
              alert.severity === "warning" ? 'bg-orange-50' :
              'bg-blue-50'
            }`}>
              {alert.severity === "critical" ? (
                <XCircle size={24} className="text-red-600" />
              ) : alert.severity === "warning" ? (
                <AlertTriangle size={24} className="text-orange-600" />
              ) : (
                <AlertCircle size={24} className="text-blue-600" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex justify-between mb-2">
                <h4 className="text-sm font-semibold text-gray-900">
                  {alert.studentName}
                </h4>
                <span className="text-xs text-gray-600">
                  {alert.date.toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-gray-700 mb-2">
                {alert.message}
              </p>
              <div className="flex gap-2 items-center">
                <span className={`text-xs px-2 py-1 rounded font-medium ${
                  alert.acknowledged
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {alert.acknowledged ? "Acknowledged" : "Pending"}
                </span>
                {!alert.acknowledged && (
                  <button className="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Acknowledge
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAlerts.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Bell size={48} className="mx-auto mb-4 opacity-20" />
          <p>No alerts matching your filter</p>
        </div>
      )}
    </div>
  );
};

// Cameras Tab
const CamerasTab: React.FC<{ cameras: AICamera[] }> = ({ cameras }) => {
  return (
    <div>
      <div className="mb-5">
        <h3 className="text-lg font-semibold mb-2">AI Camera Network</h3>
        <p className="text-sm text-gray-600">
          Monitor the status and performance of AI cameras used for attendance tracking
        </p>
      </div>

      <div className="p-4 bg-blue-50 rounded-lg mb-6 border border-blue-200">
        <div className="flex gap-3 items-start">
          <AlertCircle size={20} className="text-blue-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-blue-900 mb-1">
              API Integration Pending
            </div>
            <div className="text-sm text-blue-800">
              Once the AI camera API documentation is available, this system will automatically sync attendance data from all connected cameras. The interface below shows how camera data will be displayed.
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {cameras.map(camera => (
          <div
            key={camera.id}
            className="bg-white border border-gray-200 rounded-lg p-5"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                camera.status === "online" ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <Camera size={24} className={camera.status === "online" ? 'text-green-600' : 'text-red-600'} />
              </div>
              <div className={`px-2 py-1 rounded text-xs font-semibold ${
                camera.status === "online" ? 'bg-green-100 text-green-700' :
                camera.status === "offline" ? 'bg-red-100 text-red-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {camera.status.toUpperCase()}
              </div>
            </div>

            <h4 className="text-base font-semibold mb-1">{camera.id}</h4>
            <p className="text-sm text-gray-600 mb-4">{camera.location}</p>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <div className="text-xs text-gray-600 mb-1">Sessions Today</div>
                <div className="text-lg font-semibold">{camera.sessionsToday}</div>
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1">Accuracy</div>
                <div className="text-lg font-semibold text-green-600">{camera.accuracy.toFixed(1)}%</div>
              </div>
            </div>

            <div className="text-xs text-gray-600">
              Last sync: {camera.lastSync.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
      </div>

      <div className="p-5 bg-gray-50 rounded-lg border border-gray-200">
        <h4 className="text-base font-semibold mb-3">Integration Guide</h4>
        <div className="text-sm text-gray-700 leading-relaxed">
          <p className="mb-2">
            <strong>When API is available:</strong>
          </p>
          <ul className="list-disc ml-5 mb-3 space-y-1">
            <li>Camera data will sync every 5 minutes</li>
            <li>Face recognition events will automatically create attendance records</li>
            <li>Lecturers can verify or override AI-detected attendance</li>
            <li>System will flag low confidence detections for manual review</li>
          </ul>
          <p className="mb-2">
            <strong>Expected API Endpoints:</strong>
          </p>
          <pre className="bg-gray-900 text-green-400 p-3 rounded text-xs font-mono overflow-x-auto">
GET /api/cameras - List all cameras<br />
GET /api/cameras/:id/sessions - Get camera sessions<br />
POST /api/attendance/verify - Verify attendance record
          </pre>
        </div>
      </div>
    </div>
  );
};

// Status Badge
const StatusBadge: React.FC<{ status: AttendanceRecord["status"] }> = ({ status }) => {
  const config = {
    present: { bg: 'bg-green-100', text: 'text-green-700', icon: <CheckCircle size={12} /> },
    late: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: <Clock size={12} /> },
    absent: { bg: 'bg-red-100', text: 'text-red-700', icon: <XCircle size={12} /> },
    excused: { bg: 'bg-teal-100', text: 'text-teal-700', icon: <CheckCircle size={12} /> }
  }[status];

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium ${config.bg} ${config.text}`}>
      {config.icon}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// Source Badge
const SourceBadge: React.FC<{ source: AttendanceRecord["source"] }> = ({ source }) => {
  const config = {
    "ai-camera": { bg: 'bg-blue-100', text: 'text-blue-700', icon: <Camera size={12} />, label: "AI Camera" },
    "quiz": { bg: 'bg-purple-100', text: 'text-purple-700', icon: <FileText size={12} />, label: "Quiz" },
    "manual": { bg: 'bg-gray-100', text: 'text-gray-700', icon: <UserCheck size={12} />, label: "Manual" },
    "assignment": { bg: 'bg-teal-100', text: 'text-teal-700', icon: <Award size={12} />, label: "Assignment" }
  }[source];

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${config.bg} ${config.text}`}>
      {config.icon}
      {config.label}
    </span>
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
    { class: 'SE301 - FONS', action: 'Project submission', time: '1 day ago', type: 'info' }
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
    <div className="min-h-screen bg-gray-50 p-2">
      <div className="max-w- mx-auto space-y-6">
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
          { name: 'Dr. Nguyen Van Minh', dept: 'FONS', hours: 16, courses: 4, students: 240, status: 'Optimal' },
          { name: 'Dr. Tran Thi Lan', dept: 'Business Admin', hours: 18, courses: 5, students: 280, status: 'High' },
          { name: 'Dr. Le Van Hieu', dept: 'FONS', hours: 14, courses: 3, students: 180, status: 'Optimal' },
          { name: 'Dr. Pham Thi Mai', dept: 'FONS', hours: 15, courses: 4, students: 220, status: 'Optimal' },
          { name: 'Dr. Hoang Van Tuan', dept: 'FONS', hours: 12, courses: 3, students: 165, status: 'Low' }
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
      { name: 'FONS', faculty: 45, avgAge: 42, phd: '100%' },
      { name: 'FOM', faculty: 38, avgAge: 45, phd: '95%' },
      { name: 'FONS', faculty: 32, avgAge: 39, phd: '97%' },
      { name: 'INS', faculty: 28, avgAge: 38, phd: '100%' },
      { name: 'ITM', faculty: 24, avgAge: 41, phd: '92%' }
    ];

    return (
      <div className="min-h-screen bg-gray-50 p-3">
        <div className="flex items-center justify-between mb-3">
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
            <option value="cs">FONS</option>
            <option value="ba">FOM</option>
            <option value="se">FONS</option>
            <option value="ds">FONS</option>
            <option value="is">Information Systems</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 mt-3">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-3 mt-3">
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




type ViewKey = "overview" | "courses" | "grading";

const GradeManagement = () => {
  const [activeView, setActiveView] = useState<ViewKey>("overview");
  const [selectedFaculty, setSelectedFaculty] = useState<"all" | FacultyCode>("all");
  const [selectedProgram, setSelectedProgram] = useState<string>("all");
  const [selectedSemester, setSelectedSemester] = useState<string>("fall-2024");
  const [selectedCourse, setSelectedCourse] = useState<CourseItem | null>(null);
  const [editMode, setEditMode] = useState(false);

  // ------ Overview ------
  const OverviewDashboard = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-sm text-gray-500 mb-1">Total Students</p>
          <p className="text-3xl font-bold text-gray-900">2,000</p>
          <p className="text-xs text-green-600 mt-2">↑ 8.5% vs last year</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
            <Award className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-sm text-gray-500 mb-1">Average GPA</p>
          <p className="text-3xl font-bold text-gray-900">2.88</p>
          <p className="text-xs text-green-600 mt-2">↑ 0.12 vs last semester</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
            <TrendingUp className="w-6 h-6 text-purple-600" />
          </div>
          <p className="text-sm text-gray-500 mb-1">Pass Rate</p>
          <p className="text-3xl font-bold text-gray-900">84.8%</p>
          <p className="text-xs text-green-600 mt-2">↑ 1.2% vs last semester</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
            <AlertCircle className="w-6 h-6 text-orange-600" />
          </div>
          <p className="text-sm text-gray-500 mb-1">At-Risk Students</p>
          <p className="text-3xl font-bold text-gray-900">86</p>
          <p className="text-xs text-green-600 mt-2">↓ 12 vs last semester</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 mt-3">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance by Level</h3>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Bachelor Programs</span>
                <span className="text-lg font-bold text-blue-600">1850</span>
              </div>
              <div className="text-xs text-gray-600 space-y-1">
                <p>Avg GPA: 3.35</p>
                <p>Pass Rate: 64.2%</p>
              </div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Master Programs</span>
                <span className="text-lg font-bold text-purple-600">120</span>
              </div>
              <div className="text-xs text-gray-600 space-y-1">
                <p>Avg GPA: 3.68</p>
                <p>Pass Rate: 78.5%</p>
              </div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">PhD Program</span>
                <span className="text-lg font-bold text-green-600">30</span>
              </div>
              <div className="text-xs text-gray-600 space-y-1">
                <p>Avg GPA: 3.82</p>
                <p>Pass Rate: 90%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Faculty Metrics</h3>
          <div className="space-y-4">
            {facultyMetrics.map((faculty: FacultyMetric, i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-semibold text-gray-900">{faculty.code}</p>
                    <p className="text-xs text-gray-600 mt-1">{faculty.name}</p>
                  </div>
                  <span className="text-sm font-bold text-blue-600">{faculty.timelyDelivery}%</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-xs">
                    <span className="text-gray-600">Timely Delivery:</span>
                    <span className="font-semibold text-gray-900 ml-1">{faculty.timelyDelivery}%</span>
                  </div>
                  <div className="text-xs">
                    <span className="text-gray-600">S.D:</span>
                    <span className="font-semibold text-gray-900 ml-1">{faculty.stdDev}</span>
                  </div>
                  <div className="text-xs">
                    <span className="text-gray-600">Skewness:</span>
                    <span className="font-semibold text-gray-900 ml-1">{faculty.skewness}</span>
                  </div>
                  <div className="text-xs">
                    <span className="text-gray-600">Kurtosis:</span>
                    <span className="font-semibold text-gray-900 ml-1">{faculty.kurtosis}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Bachelor Programs</h3>
          <div className="grid grid-cols-2 gap-2">
            {bachelorProgramStats.map((prog: BachelorProgramStat, i) => (
              <div key={i} className="p-2 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-m font-bold text-gray-900">{prog.code}</h4>
                  <span className="text-sm text-gray-500">{prog.students}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Pass Rate</p>
                    <p className="text-m font-bold text-green-600">{prog.passRate}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">S.D Score</p>
                    <p className="text-m font-bold text-blue-600">{prog.stdDev}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // ------ Course Analysis ------
  const CourseAnalysis = () => {
    // simple filtering by faculty if wanted
    const visibleCourses =
      selectedFaculty === "all"
        ? courseData
        : courseData.filter((c) => c.faculty === selectedFaculty);

    return (
      <div className="min-h-screen bg-gray-50 p-2">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <select
                  value={selectedFaculty}
                  onChange={(e) => setSelectedFaculty(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="all">All Faculties</option>
                  {faculties.map((f: Faculty) => (
                    <option key={f.code} value={f.code}>
                      {f.code} - {f.name}
                    </option>
                  ))}
                </select>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Download size={18} />
                Export
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Course Code</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Course Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Program</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Faculty</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Level</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Instructor</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Students</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Avg Grade</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Pass Rate</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {visibleCourses.map((course: CourseItem) => (
                  <tr key={course.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className="font-semibold text-blue-600">{course.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{course.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">{course.program}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          course.faculty === "FOM"
                            ? "bg-blue-100 text-blue-700"
                            : course.faculty === "FOMAC"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {course.faculty}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          course.level === "Bachelor"
                            ? "bg-blue-100 text-blue-700"
                            : course.level === "Master"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {course.level}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{course.instructor}</td>
                    <td className="px-6 py-4 text-sm font-semibold">{course.students}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold ${
                          course.avgGrade >= 3.5 ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {course.avgGrade}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold ${
                          course.passRate >= 95 ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {course.passRate}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => {
                          setSelectedCourse(course);
                          setActiveView("grading");
                        }}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Manage Grades
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // ------ Grade Insertion ------
  const GradeInsertion = () => {
    if (!selectedCourse) {
      return (
        <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
          <div className="max-w-md mx-auto">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Course Selected</h3>
            <p className="text-gray-600 mb-6">Please select a course from the Course Analysis tab.</p>
            <button
              onClick={() => setActiveView("courses")}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Go to Course Analysis
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedCourse.id} - {selectedCourse.name}
                </h2>
                <div className="flex gap-4 mt-2 text-sm text-gray-600">
                  <span>Program: {selectedCourse.program}</span>
                  <span>•</span>
                  <span>Instructor: {selectedCourse.instructor}</span>
                </div>
              </div>
              <button onClick={() => setSelectedCourse(null)} className="p-2 hover:bg-white rounded-lg">
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Student Grades</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditMode(!editMode)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  {editMode ? <X size={18} /> : <Edit size={18} />}
                  {editMode ? "Cancel" : "Edit Grades"}
                </button>
                {editMode && (
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <Save size={18} />
                    Save Changes
                  </button>
                )}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Student ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Midterm (30%)</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Final (40%)</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Assignments (20%)</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Participation (10%)</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Overall</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Letter Grade</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">GPA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {studentGrades.map((row: StudentGradeRow) => (
                    <tr key={row.studentId} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-blue-600">{row.studentId}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{row.name}</td>
                      <td className="px-4 py-3 text-center">
                        {editMode ? (
                          <input
                            type="number"
                            defaultValue={row.midterm}
                            className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                            step="0.1"
                            min="0"
                            max="10"
                          />
                        ) : (
                          <span className="text-sm font-semibold">{row.midterm}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {editMode ? (
                          <input
                            type="number"
                            defaultValue={row.final}
                            className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                            step="0.1"
                            min="0"
                            max="10"
                          />
                        ) : (
                          <span className="text-sm font-semibold">{row.final}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {editMode ? (
                          <input
                            type="number"
                            defaultValue={row.assignments}
                            className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                            step="0.1"
                            min="0"
                            max="10"
                          />
                        ) : (
                          <span className="text-sm font-semibold">{row.assignments}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {editMode ? (
                          <input
                            type="number"
                            defaultValue={row.participation}
                            className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                            step="0.1"
                            min="0"
                            max="10"
                          />
                        ) : (
                          <span className="text-sm font-semibold">{row.participation}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-sm font-bold text-gray-900">{row.overall}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            row.letterGrade === "A"
                              ? "bg-green-100 text-green-700"
                              : row.letterGrade === "B"
                              ? "bg-blue-100 text-blue-700"
                              : row.letterGrade === "C"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {row.letterGrade}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-sm font-bold text-gray-900">{row.gpa}</span>
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

  // ------ Shell ------
  return (
    <div className="min-h-screen bg-gray-50 p-3">
      <div className="mx-auto w-full max-w space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Grade Management</h1>
            <p className="text-sm text-gray-500 mt-1">Monitor and manage student performance</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="border-b border-gray-200">
            <div className="flex gap-1 p-2">
              <button
                onClick={() => { setActiveView("overview"); setSelectedCourse(null); }}
                className={`px-6 py-3 rounded-lg text-sm font-medium ${
                  activeView === "overview" ? "bg-blue-50 text-blue-600" : "text-gray-600"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => { setActiveView("courses"); setSelectedCourse(null); }}
                className={`px-6 py-3 rounded-lg text-sm font-medium ${
                  activeView === "courses" ? "bg-blue-50 text-blue-600" : "text-gray-600"
                }`}
              >
                Course Analysis
              </button>
              <button
                onClick={() => setActiveView("grading")}
                className={`px-6 py-3 rounded-lg text-sm font-medium ${
                  activeView === "grading" ? "bg-blue-50 text-blue-600" : "text-gray-600"
                }`}
              >
                Grade Insertion
              </button>
            </div>
          </div>
        </div>

        {activeView === "overview" && <OverviewDashboard />}
        {activeView === "courses" && <CourseAnalysis />}
        {activeView === "grading" && <GradeInsertion />}
      </div>
    </div>
  );
};





const LecturerProfileAdmin = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDepartment, setFilterDepartment] = useState('all');
    const [filterPosition, setFilterPosition] = useState('all');
    const [selectedLecturer, setSelectedLecturer] = useState(null);

    const sampleLecturers = [
    { id: 'L001239', name: 'Assoc.Prof. Vu Thi Hoa', department: 'FOM', position: 'Associate Professor', degree: 'PhD', teachingHours: '500h', publications: '29', status: 'Active' },
{ id: 'L001240', name: 'Dr. Nguyen Quang Huy', department: 'FONS', position: 'Lecturer', degree: 'PhD', teachingHours: '410h', publications: '15', status: 'Active' },
{ id: 'L001241', name: 'Dr. Bui Thi Huong', department: 'FOM', position: 'Senior Lecturer', degree: 'PhD', teachingHours: '450h', publications: '21', status: 'Active' },
{ id: 'L001242', name: 'Assoc.Prof. Tran Van Phuc', department: 'FONS', position: 'Associate Professor', degree: 'PhD', teachingHours: '480h', publications: '33', status: 'Active' },
{ id: 'L001243', name: 'Prof. Pham Van Khoa', department: 'FOM', position: 'Professor', degree: 'PhD', teachingHours: '530h', publications: '40', status: 'Active' },
{ id: 'L001244', name: 'Dr. Le Thi Bich', department: 'FONS', position: 'Lecturer', degree: 'PhD', teachingHours: '390h', publications: '11', status: 'Active' },
{ id: 'L001245', name: 'Dr. Do Van Nam', department: 'FONS', position: 'Senior Lecturer', degree: 'PhD', teachingHours: '460h', publications: '19', status: 'Active' },
{ id: 'L001246', name: 'Assoc.Prof. Tran Thi Thu', department: 'FOM', position: 'Associate Professor', degree: 'PhD', teachingHours: '490h', publications: '27', status: 'Active' },
{ id: 'L001247', name: 'Dr. Hoang Minh Tuan', department: 'FONS', position: 'Lecturer', degree: 'PhD', teachingHours: '400h', publications: '13', status: 'Active' },
{ id: 'L001248', name: 'Prof. Nguyen Thi Kim', department: 'FOM', position: 'Professor', degree: 'PhD', teachingHours: '550h', publications: '42', status: 'Active' },
{ id: 'L001249', name: 'Assoc.Prof. Dang Quang Binh', department: 'FOMAC', position: 'Associate Professor', degree: 'PhD', teachingHours: '470h', publications: '25', status: 'Active' },
{ id: 'L001250', name: 'Dr. Nguyen Thi Thanh', department: 'FOMAC', position: 'Lecturer', degree: 'PhD', teachingHours: '420h', publications: '14', status: 'Active' },
{ id: 'L001251', name: 'Prof. Tran Van Duong', department: 'FOMAC', position: 'Professor', degree: 'PhD', teachingHours: '540h', publications: '39', status: 'Active' },
{ id: 'L001252', name: 'Dr. Le Thi Thu Ha', department: 'FOMAC', position: 'Senior Lecturer', degree: 'PhD', teachingHours: '450h', publications: '20', status: 'Active' },
{ id: 'L001253', name: 'Assoc.Prof. Pham Van Long', department: 'FOMAC', position: 'Associate Professor', degree: 'PhD', teachingHours: '480h', publications: '28', status: 'Active' },

];

    return (
      <div className="min-h-screen bg-gray-50 p-3">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Lecturer Profile Management</h1>
            <p className="text-sm text-gray-500 mt-1">Comprehensive faculty data and analytics</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus size={18} />
            Add New Lecturer
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <p className="text-xs font-semibold text-blue-500 mb-1">Total Lecturers</p>
            <p className="text-2xl font-bold text-gray-900">297</p>
            <div className="mt-2 space-y-0.5">
              <p className="text-xs text-gray-600">Professors: 45 (15%)</p>
              <p className="text-xs text-gray-600">Associate: 102 (34%)</p>
              <p className="text-xs text-gray-600">Lecturers: 150 (51%)</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <p className="text-xs font-semibold text-blue-500 mb-1">Total Teaching Hours</p>
            <p className="text-2xl font-bold text-gray-900">132,480h</p>
            <div className="mt-2 space-y-0.5">
              <p className="text-xs text-gray-600">Avg: 446h per lecturer</p>
              <p className="text-xs text-gray-600">This academic year</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <p className="text-xs font-semibold text-blue-500 mb-1">Total Publications</p>
            <p className="text-2xl font-bold text-gray-900">1,248</p>
            <div className="mt-2 space-y-0.5">
              <p className="text-xs text-gray-600">Papers: 892</p>
              <p className="text-xs text-gray-600">Patents: 356</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <p className="text-xs font-semibold text-blue-500 mb-1">Avg Workload</p>
            <p className="text-2xl font-bold text-gray-900">14.8h/week</p>
            <div className="mt-2 space-y-0.5">
              <p className="text-xs text-gray-600">Within standard range</p>
              <p className="text-xs text-gray-600">12-16h recommended</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mt-3">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by lecturer ID, name, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select 
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Departments</option>
                <option value="cs">FONS</option>
                <option value="ba">FOM</option>
                <option value="se">FONS</option>
                <option value="ds">FONS</option>
              </select>
              <select 
                value={filterPosition}
                onChange={(e) => setFilterPosition(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Positions</option>
                <option value="professor">Professor</option>
                <option value="associate">Associate Professor</option>
                <option value="senior">Senior Lecturer</option>
                <option value="lecturer">Lecturer</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Lecturer ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Full Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Position</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Degree</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Teaching Hours</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Publications</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sampleLecturers.map((lecturer) => (
                  <tr key={lecturer.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{lecturer.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{lecturer.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{lecturer.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        lecturer.position === 'Professor' ? 'bg-purple-100 text-purple-700' :
                        lecturer.position === 'Associate Professor' ? 'bg-blue-100 text-blue-700' :
                        lecturer.position === 'Senior Lecturer' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {lecturer.position}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{lecturer.degree}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{lecturer.teachingHours}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{lecturer.publications}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">{lecturer.status}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button 
                        onClick={() => setSelectedLecturer(lecturer)}
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Lecturer Profile Details</h2>
                <button 
                  onClick={() => setSelectedLecturer(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  ✕
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-1 flex flex-col items-center">
                    <div className="w-32 h-32 bg-gray-300 rounded-full mb-4"></div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedLecturer.name}</h3>
                    <p className="text-sm text-gray-500">{selectedLecturer.id}</p>
                    <p className="text-sm text-blue-600 mt-1">{selectedLecturer.position}</p>
                  </div>
                  <div className="col-span-2 grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Department</p>
                      <p className="font-semibold text-gray-900">{selectedLecturer.department}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Degree</p>
                      <p className="font-semibold text-gray-900">{selectedLecturer.degree}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Teaching Hours</p>
                      <p className="font-semibold text-gray-900">{selectedLecturer.teachingHours}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Publications</p>
                      <p className="font-semibold text-gray-900">{selectedLecturer.publications}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Status</p>
                      <p className="font-semibold text-green-600">{selectedLecturer.status}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Email</p>
                      <p className="font-semibold text-gray-900 text-sm">{selectedLecturer.id.toLowerCase()}@hsb.edu.vn</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3">Teaching Performance</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Active Courses</span>
                        <span className="font-semibold">6</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Student Rating</span>
                        <span className="font-semibold">4.7/5.0</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Workload (weekly)</span>
                        <span className="font-semibold">16h</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3">Research & Activities</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Research Projects</span>
                        <span className="font-semibold">5 active</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Community Hours</span>
                        <span className="font-semibold">120h this year</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Conference Attendance</span>
                        <span className="font-semibold">8 events</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Recent Publications</h4>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <p className="font-semibold text-gray-900">Machine Learning Applications in Healthcare</p>
                      <p className="text-xs text-gray-600">Journal of AI Research, 2025</p>
                    </div>
                    <div className="text-sm">
                      <p className="font-semibold text-gray-900">Deep Learning for Natural Language Processing</p>
                      <p className="text-xs text-gray-600">International Conference on AI, 2024</p>
                    </div>
                    <div className="text-sm">
                      <p className="font-semibold text-gray-900">Neural Networks and Pattern Recognition</p>
                      <p className="text-xs text-gray-600">IEEE Transactions, 2024</p>
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

const ViewRankings = () => {
  const [filterFaculty, setFilterFaculty] = useState('all');
  const [filterLevel, setFilterLevel] = useState('all');
  const [sortBy, setSortBy] = useState('overall');

  const facultyData = [
    { rank: 1, name: 'Dr. Nguyen Van Minh', department: 'FONS', faculty: 'FONS', courses: 3, students: 206, overall: 4.8, teaching: 4.9, knowledge: 4.8, communication: 4.7, support: 4.8, responses: 234, badge: 'gold' },
    { rank: 2, name: 'Dr. Bui Thi Ngoc', department: 'Digital Media', faculty: 'FOMAC', courses: 4, students: 267, overall: 4.8, teaching: 4.9, knowledge: 4.8, communication: 4.7, support: 4.8, responses: 228, badge: 'silver' },
    { rank: 3, name: 'Dr. Pham Thi Mai', department: 'FONS', faculty: 'FONS', courses: 3, students: 145, overall: 4.7, teaching: 4.8, knowledge: 4.9, communication: 4.6, support: 4.7, responses: 142, badge: 'bronze' },
    { rank: 4, name: 'Dr. Tran Thi Lan', department: 'FOM', faculty: 'FOM', courses: 5, students: 280, overall: 4.7, teaching: 4.8, knowledge: 4.7, communication: 4.6, support: 4.8, responses: 272, badge: null },
    { rank: 5, name: 'Dr. Hoang Van Tuan', department: 'FONS', faculty: 'FONS', courses: 3, students: 165, overall: 4.6, teaching: 4.7, knowledge: 4.6, communication: 4.5, support: 4.6, responses: 189, badge: null },
    { rank: 6, name: 'Dr. Nguyen Duc Anh', department: 'Marketing', faculty: 'FOM', courses: 3, students: 156, overall: 4.6, teaching: 4.7, knowledge: 4.6, communication: 4.5, support: 4.6, responses: 150, badge: null },
    { rank: 7, name: 'Dr. Dao Van Hai', department: 'Journalism', faculty: 'FOMAC', courses: 2, students: 144, overall: 4.6, teaching: 4.7, knowledge: 4.6, communication: 4.5, support: 4.6, responses: 138, badge: null },
    { rank: 8, name: 'Dr. Le Thi Hoa', department: 'Economics', faculty: 'FONS', courses: 4, students: 198, overall: 4.5, teaching: 4.6, knowledge: 4.7, communication: 4.4, support: 4.5, responses: 192, badge: null },
    { rank: 9, name: 'Dr. Le Van Cuong', department: 'Finance', faculty: 'FOM', courses: 4, students: 215, overall: 4.5, teaching: 4.6, knowledge: 4.7, communication: 4.4, support: 4.5, responses: 208, badge: null },
    { rank: 10, name: 'Dr. Tran Van Long', department: 'Physics', faculty: 'FONS', courses: 2, students: 89, overall: 4.4, teaching: 4.5, knowledge: 4.6, communication: 4.3, support: 4.4, responses: 85, badge: null },
  ];

  const topPerformers = facultyData.slice(0, 3);

  const getFacultyColor = (faculty) => {
    switch(faculty) {
      case 'FONS': return 'bg-blue-100 text-blue-700';
      case 'FOMAC': return 'bg-purple-100 text-purple-700';
      case 'FOM': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getBadgeColor = (badge) => {
    switch(badge) {
      case 'gold': return 'bg-yellow-400';
      case 'silver': return 'bg-gray-300';
      case 'bronze': return 'bg-orange-400';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2">
      <div className="max-w- mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Faculty Rankings</h1>
            <p className="text-sm text-gray-500 mt-1">Based on student feedback and teaching evaluations</p>
          </div>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium">
            Export Report
          </button>
        </div>

        <div className="grid grid-cols-4 gap-6">
          <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-1">Total Faculty</p>
            <p className="text-3xl font-bold text-gray-900">10</p>
            <p className="text-xs text-gray-600 mt-2">Evaluated this semester</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-1">Avg Overall Rating</p>
            <p className="text-3xl font-bold text-gray-900">4.62<span className="text-lg text-gray-500">/5.0</span></p>
            <p className="text-xs text-gray-600 mt-2">↑ 0.2 vs last semester</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-1">Total Responses</p>
            <p className="text-3xl font-bold text-gray-900">1808</p>
            <p className="text-xs text-gray-600 mt-2">From 1984 students</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-1">Response Rate</p>
            <p className="text-3xl font-bold text-gray-900">97%</p>
            <p className="text-xs text-gray-600 mt-2">↑ 5% vs last semester</p>
          </div>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-lg">
          <div className="flex items-start gap-3">
            <Award className="w-6 h-6 text-yellow-600 mt-1" />
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-4">Top Performers This Semester</h3>
              <div className="grid grid-cols-3 gap-6">
                {topPerformers.map((lecturer) => (
                  <div key={lecturer.rank} className="bg-white p-6 rounded-xl shadow-sm border-2 border-yellow-200 relative">
                    {lecturer.badge && (
                      <div className={`absolute -top-3 -right-3 w-12 h-12 ${getBadgeColor(lecturer.badge)} rounded-full flex items-center justify-center shadow-lg`}>
                        <span className="text-white font-bold text-lg">{lecturer.rank}</span>
                      </div>
                    )}
                    <div className="flex flex-col items-center mb-4">
                      <div className="w-20 h-20 bg-gray-300 rounded-full mb-3"></div>
                      <h4 className="font-bold text-gray-900 text-center">{lecturer.name}</h4>
                      <p className="text-xs text-gray-500">{lecturer.department}</p>
                      <span className={`mt-2 px-2 py-1 rounded-full text-xs font-medium ${getFacultyColor(lecturer.faculty)}`}>
                        {lecturer.faculty}
                      </span>
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-4 pb-4 border-b border-gray-200">
                      <Award className="w-5 h-5 text-yellow-500" />
                      <span className="text-2xl font-bold text-gray-900">{lecturer.overall}</span>
                      <span className="text-gray-500">/5.0</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-center">
                      <div>
                        <p className="text-xs text-gray-500">Teaching</p>
                        <p className="font-bold text-gray-900">{lecturer.teaching}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Knowledge</p>
                        <p className="font-bold text-gray-900">{lecturer.knowledge}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Support</p>
                        <p className="font-bold text-gray-900">{lecturer.support}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Responses</p>
                        <p className="font-bold text-gray-900">{lecturer.responses}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <select 
                value={filterFaculty}
                onChange={(e) => setFilterFaculty(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All Faculties</option>
                <option value="fons">FONS</option>
                <option value="fomac">FOMAC</option>
                <option value="fom">FOM</option>
              </select>
              <select 
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All Levels</option>
                <option value="professor">Professor</option>
                <option value="associate">Associate Professor</option>
                <option value="lecturer">Lecturer</option>
              </select>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="overall">Sort by Overall Rating</option>
                <option value="teaching">Sort by Teaching</option>
                <option value="knowledge">Sort by Knowledge</option>
                <option value="responses">Sort by Responses</option>
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
                {facultyData.map((lecturer) => (
                  <tr key={lecturer.rank} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-bold text-gray-900">{lecturer.rank}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="font-semibold text-gray-900">{lecturer.name}</p>
                        <p className="text-xs text-gray-500">{lecturer.department}</p>
                        <p className="text-xs text-gray-400">{lecturer.courses} courses • {lecturer.students} students</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getFacultyColor(lecturer.faculty)}`}>
                        {lecturer.faculty}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="inline-flex items-center justify-center px-3 py-1 bg-green-100 rounded-full">
                        <span className="text-lg font-bold text-green-700">{lecturer.overall}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-semibold text-gray-900">{lecturer.teaching}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-semibold text-gray-900">{lecturer.knowledge}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-semibold text-gray-900">{lecturer.communication}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-semibold text-gray-900">{lecturer.support}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-semibold text-gray-900">{lecturer.responses}</td>
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
    <div className="min-h-screen bg-gray-50 p-2">
      <div className="max-w- mx-auto space-y-6">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-3">
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

{/*HR Profile start */}
const HRProfileManagement = () => {
  const [activeView, setActiveView] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPosition, setFilterPosition] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterContractStatus, setFilterContractStatus] = useState('all');
  const [selectedStaff, setSelectedStaff] = useState(null);

  const staffData = [
    {
      id: 'STF001',
      name: 'Dr. Nguyen Van A',
      position: 'Department Head',
      type: 'Academic Staff',
      department: 'Faculty of Nontraditional Security',
      email: 'nguyenvana@university.edu.vn',
      phone: '+84 24 1234 5678',
      joinDate: '2015-03-15',
      education: 'Ph.D. in International Relations',
      specialization: 'Security Studies',
      politicalTraining: {
        completed: true,
        level: 'Advanced',
        completionDate: '2020-06-30',
        certificate: 'Certificate No. PT-2020-456'
      },
      academicRank: 'Associate Professor',
      publications: 45,
      projects: 12,
      teachingHours: 240,
      status: 'Active',
      eligibleForPromotion: true,
      contract: {
        type: 'Permanent',
        startDate: '2015-03-15',
        endDate: null,
        salary: '$4,500/month',
        benefits: ['Health Insurance', 'Pension Fund', 'Annual Leave: 24 days'],
        status: 'Active',
        lastRenewal: '2023-03-15',
        nextReview: '2026-03-15'
      }
    },
    {
      id: 'STF002',
      name: 'Prof. Tran Thi B',
      position: 'Faculty Dean',
      type: 'Academic Staff',
      department: 'Faculty of Management',
      email: 'tranthib@university.edu.vn',
      phone: '+84 24 2234 5678',
      joinDate: '2012-09-01',
      education: 'Ph.D. in Business Administration',
      specialization: 'Strategic Management',
      politicalTraining: {
        completed: true,
        level: 'Advanced',
        completionDate: '2019-12-15',
        certificate: 'Certificate No. PT-2019-123'
      },
      academicRank: 'Professor',
      publications: 78,
      projects: 18,
      teachingHours: 180,
      status: 'Active',
      eligibleForPromotion: false,
      contract: {
        type: 'Permanent',
        startDate: '2012-09-01',
        endDate: null,
        salary: '$6,200/month',
        benefits: ['Health Insurance', 'Pension Fund', 'Housing Allowance', 'Annual Leave: 28 days'],
        status: 'Active',
        lastRenewal: '2022-09-01',
        nextReview: '2025-09-01'
      }
    },
    {
      id: 'STF003',
      name: 'Dr. Le Van C',
      position: 'Senior Lecturer',
      type: 'Academic Staff',
      department: 'Faculty of Nontraditional Security',
      email: 'levanc@university.edu.vn',
      phone: '+84 24 3234 5678',
      joinDate: '2018-01-10',
      education: 'Ph.D. in Computer Science',
      specialization: 'Artificial Intelligence',
      politicalTraining: {
        completed: true,
        level: 'Intermediate',
        completionDate: '2021-08-20',
        certificate: 'Certificate No. PT-2021-789'
      },
      academicRank: 'Lecturer',
      publications: 23,
      projects: 8,
      teachingHours: 320,
      status: 'Active',
      eligibleForPromotion: true,
      contract: {
        type: 'Fixed-Term',
        startDate: '2018-01-10',
        endDate: '2025-01-09',
        salary: '$3,800/month',
        benefits: ['Health Insurance', 'Annual Leave: 20 days'],
        status: 'Expiring Soon',
        lastRenewal: '2022-01-10',
        nextReview: '2024-12-01'
      }
    },
    {
      id: 'STF004',
      name: 'Dr. Pham Thi D',
      position: 'Lecturer',
      type: 'Academic Staff',
      department: 'Faculty of Marketing and Communication',
      email: 'phamthid@university.edu.vn',
      phone: '+84 24 4234 5678',
      joinDate: '2019-08-01',
      education: 'Ph.D. in Marketing',
      specialization: 'Digital Marketing',
      politicalTraining: {
        completed: false,
        level: null,
        completionDate: null,
        certificate: null
      },
      academicRank: 'Lecturer',
      publications: 12,
      projects: 5,
      teachingHours: 280,
      status: 'Active',
      eligibleForPromotion: false,
      contract: {
        type: 'Fixed-Term',
        startDate: '2019-08-01',
        endDate: '2024-12-31',
        salary: '$3,200/month',
        benefits: ['Health Insurance', 'Annual Leave: 18 days'],
        status: 'Expiring Soon',
        lastRenewal: null,
        nextReview: '2024-11-01'
      }
    },
    {
      id: 'STF005',
      name: 'Ms. Hoang Thi E',
      position: 'HR Manager',
      type: 'Administrative Staff',
      department: 'Human Resources Department',
      email: 'hoangthie@university.edu.vn',
      phone: '+84 24 5234 5678',
      joinDate: '2016-05-20',
      education: 'Master in Human Resource Management',
      specialization: 'Recruitment & Development',
      politicalTraining: {
        completed: true,
        level: 'Intermediate',
        completionDate: '2022-03-10',
        certificate: 'Certificate No. PT-2022-345'
      },
      academicRank: null,
      publications: 0,
      projects: 0,
      teachingHours: 0,
      status: 'Active',
      eligibleForPromotion: true,
      contract: {
        type: 'Permanent',
        startDate: '2016-05-20',
        endDate: null,
        salary: '$3,500/month',
        benefits: ['Health Insurance', 'Pension Fund', 'Annual Leave: 22 days'],
        status: 'Active',
        lastRenewal: '2022-05-20',
        nextReview: '2025-05-20'
      }
    },
    {
      id: 'STF006',
      name: 'Mr. Vo Van F',
      position: 'Administrative Officer',
      type: 'Administrative Staff',
      department: 'Faculty of Nontraditional Security',
      email: 'vovanf@university.edu.vn',
      phone: '+84 24 6234 5678',
      joinDate: '2020-02-15',
      education: 'Bachelor in Public Administration',
      specialization: 'Office Management',
      politicalTraining: {
        completed: false,
        level: null,
        completionDate: null,
        certificate: null
      },
      academicRank: null,
      publications: 0,
      projects: 0,
      teachingHours: 0,
      status: 'Active',
      eligibleForPromotion: false,
      contract: {
        type: 'Fixed-Term',
        startDate: '2020-02-15',
        endDate: '2025-02-14',
        salary: '$2,400/month',
        benefits: ['Health Insurance', 'Annual Leave: 15 days'],
        status: 'Active',
        lastRenewal: null,
        nextReview: '2024-12-15'
      }
    },
    {
      id: 'STF007',
      name: 'Dr. Bui Van G',
      position: 'Vice Rector',
      type: 'Academic Staff',
      department: 'Board of Rectors',
      email: 'buivang@university.edu.vn',
      phone: '+84 24 7234 5678',
      joinDate: '2010-07-01',
      education: 'Ph.D. in Education Management',
      specialization: 'Higher Education Administration',
      politicalTraining: {
        completed: true,
        level: 'Advanced',
        completionDate: '2018-11-25',
        certificate: 'Certificate No. PT-2018-987'
      },
      academicRank: 'Professor',
      publications: 92,
      projects: 25,
      teachingHours: 120,
      status: 'Active',
      eligibleForPromotion: false,
      contract: {
        type: 'Permanent',
        startDate: '2010-07-01',
        endDate: null,
        salary: '$7,500/month',
        benefits: ['Health Insurance', 'Pension Fund', 'Housing Allowance', 'Car Allowance', 'Annual Leave: 30 days'],
        status: 'Active',
        lastRenewal: '2023-07-01',
        nextReview: '2026-07-01'
      }
    },
    {
      id: 'STF008',
      name: 'Ms. Cao Thi H',
      position: 'Finance Officer',
      type: 'Administrative Staff',
      department: 'Finance Department',
      email: 'caothih@university.edu.vn',
      phone: '+84 24 8234 5678',
      joinDate: '2017-11-10',
      education: 'Bachelor in Accounting',
      specialization: 'Financial Management',
      politicalTraining: {
        completed: true,
        level: 'Intermediate',
        completionDate: '2021-05-18',
        certificate: 'Certificate No. PT-2021-456'
      },
      academicRank: null,
      publications: 0,
      projects: 0,
      teachingHours: 0,
      status: 'Active',
      eligibleForPromotion: true,
      contract: {
        type: 'Permanent',
        startDate: '2017-11-10',
        endDate: null,
        salary: '$2,800/month',
        benefits: ['Health Insurance', 'Pension Fund', 'Annual Leave: 20 days'],
        status: 'Active',
        lastRenewal: '2022-11-10',
        nextReview: '2025-11-10'
      }
    }
  ];

  const getPositionColor = (position) => {
    if (position.includes('Rector') || position.includes('Dean')) return 'bg-purple-100 text-purple-700 border-purple-300';
    if (position.includes('Head')) return 'bg-blue-100 text-blue-700 border-blue-300';
    if (position.includes('Professor') || position.includes('Lecturer')) return 'bg-green-100 text-green-700 border-green-300';
    return 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const getPoliticalTrainingBadge = (training) => {
    if (!training.completed) {
      return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full border border-red-300">Not Completed</span>;
    }
    if (training.level === 'Advanced') {
      return <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full border border-purple-300">Advanced Level</span>;
    }
    return <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full border border-blue-300">Intermediate Level</span>;
  };

  const filteredStaff = staffData.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPosition = filterPosition === 'all' || staff.type === filterPosition;
    const matchesDepartment = filterDepartment === 'all' || staff.department === filterDepartment;
    return matchesSearch && matchesPosition && matchesDepartment;
  });

  const OverviewDashboard = () => {
    const totalStaff = staffData.length;
    const academicStaff = staffData.filter(s => s.type === 'Academic Staff').length;
    const adminStaff = staffData.filter(s => s.type === 'Administrative Staff').length;
    const withPoliticalTraining = staffData.filter(s => s.politicalTraining.completed).length;
    const eligibleForPromotion = staffData.filter(s => s.eligibleForPromotion).length;
    const needsTraining = staffData.filter(s => !s.politicalTraining.completed).length;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-sm text-gray-500 mb-1">Total Staff</p>
            <p className="text-3xl font-bold text-gray-900">{totalStaff}</p>
            <p className="text-xs text-gray-600 mt-2">{academicStaff} Academic / {adminStaff} Admin</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
              <ShieldCheck className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-sm text-gray-500 mb-1">Political Training</p>
            <p className="text-3xl font-bold text-gray-900">{withPoliticalTraining}</p>
            <p className="text-xs text-green-600 mt-2">{Math.round((withPoliticalTraining/totalStaff)*100)}% completion rate</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-sm text-gray-500 mb-1">Eligible for Promotion</p>
            <p className="text-3xl font-bold text-gray-900">{eligibleForPromotion}</p>
            <p className="text-xs text-purple-600 mt-2">Ready for advancement</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
            <p className="text-sm text-gray-500 mb-1">Needs Training</p>
            <p className="text-3xl font-bold text-gray-900">{needsTraining}</p>
            <p className="text-xs text-orange-600 mt-2">Action required</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Staff by Department</h3>
            <div className="space-y-4">
              {[
                { name: 'Nontraditional Security', count: 3 },
                { name: 'Management', count: 1 },
                { name: 'Marketing & Communication', count: 1 },
                { name: 'Board of Rectors', count: 1 },
                { name: 'HR Department', count: 1 },
                { name: 'Finance Department', count: 1 }
              ].map((dept, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{dept.name}</span>
                    <span className="text-sm font-semibold text-gray-900">{dept.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="h-2 rounded-full bg-blue-500" style={{width: `${(dept.count/totalStaff)*100}%`}}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Political Training Levels</h3>
            <div className="space-y-3">
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Advanced Level</span>
                    <p className="text-xs text-gray-500 mt-1">Required for Board of Rectors & Deans</p>
                  </div>
                  <span className="text-2xl font-bold text-purple-700">3</span>
                </div>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Intermediate Level</span>
                    <p className="text-xs text-gray-500 mt-1">Suitable for Department Heads</p>
                  </div>
                  <span className="text-2xl font-bold text-blue-700">3</span>
                </div>
              </div>
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Not Completed</span>
                    <p className="text-xs text-gray-500 mt-1">Training enrollment needed</p>
                  </div>
                  <span className="text-2xl font-bold text-red-700">2</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Leadership Positions</h3>
            <div className="space-y-3">
              <div className="p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                <p className="text-sm font-semibold text-gray-900">Board of Rectors</p>
                <p className="text-xs text-gray-600 mt-1">1 position • Political Training Required</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <p className="text-sm font-semibold text-gray-900">Faculty Deans</p>
                <p className="text-xs text-gray-600 mt-1">1 position • Political Training Required</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                <p className="text-sm font-semibold text-gray-900">Department Heads</p>
                <p className="text-xs text-gray-600 mt-1">1 position • Political Training Required</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-500 p-6 rounded-lg">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Political Training Requirement Notice</h4>
              <p className="text-sm text-gray-700 mb-3">
                Staff members aspiring for leadership positions (Department Head, Faculty Dean, or Board of Rectors) 
                must complete the required level of Political Training to be eligible for promotion.
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">2 staff members</span> currently need to complete their political training 
                to be considered for future leadership roles.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const StaffListView = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <select 
              value={filterPosition}
              onChange={(e) => setFilterPosition(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Staff Types</option>
              <option value="Academic Staff">Academic Staff</option>
              <option value="Administrative Staff">Administrative Staff</option>
            </select>

            <select 
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Departments</option>
              <option value="Faculty of Nontraditional Security">Nontraditional Security</option>
              <option value="Faculty of Management">Management</option>
              <option value="Faculty of Marketing and Communication">Marketing & Communication</option>
              <option value="Board of Rectors">Board of Rectors</option>
              <option value="Human Resources Department">HR Department</option>
              <option value="Finance Department">Finance Department</option>
            </select>

            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 whitespace-nowrap">
              <Plus size={18} />
              Add Staff
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {filteredStaff.map((staff) => (
            <div key={staff.id} className="border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {staff.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{staff.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPositionColor(staff.position)}`}>
                        {staff.position}
                      </span>
                      {staff.type === 'Academic Staff' && staff.academicRank && (
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold border border-indigo-300">
                          {staff.academicRank}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{staff.department}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1.5">
                        <Mail size={14} />
                        {staff.email}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Phone size={14} />
                        {staff.phone}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        Joined: {new Date(staff.joinDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3 mb-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Education</p>
                  <p className="text-sm font-bold text-gray-900">{staff.education}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Specialization</p>
                  <p className="text-sm font-bold text-gray-900">{staff.specialization}</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Political Training</p>
                  {getPoliticalTrainingBadge(staff.politicalTraining)}
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Promotion Status</p>
                  {staff.eligibleForPromotion ? (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Eligible</span>
                  ) : (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">Not Eligible</span>
                  )}
                </div>
              </div>

              {staff.type === 'Academic Staff' && (
                <div className="grid grid-cols-3 gap-3 mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{staff.publications}</p>
                    <p className="text-xs text-gray-600">Publications</p>
                  </div>
                  <div className="text-center border-x border-gray-200">
                    <p className="text-2xl font-bold text-green-600">{staff.projects}</p>
                    <p className="text-xs text-gray-600">Research Projects</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">{staff.teachingHours}</p>
                    <p className="text-xs text-gray-600">Teaching Hours</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setSelectedStaff(staff)}
                  className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 text-sm font-medium"
                >
                  View Full Profile
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium">
                  <Edit size={16} className="inline mr-2" />
                  Edit
                </button>
                {!staff.politicalTraining.completed && (
                  <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm font-medium">
                    Enroll in Training
                  </button>
                )}
              </div>
            </div>
          ))}
          {filteredStaff.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No staff members found matching your criteria
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-2">
      <div className="max-w mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">HR Profile Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage all staff profiles, qualifications, and political training status</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="border-b border-gray-200">
            <div className="flex gap-1 p-2">
              <button
                onClick={() => setActiveView('overview')}
                className={`px-6 py-3 rounded-lg text-sm font-medium ${activeView === 'overview' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveView('staff')}
                className={`px-6 py-3 rounded-lg text-sm font-medium ${activeView === 'staff' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                All Staff
              </button>
              <button
                onClick={() => setActiveView('training')}
                className={`px-6 py-3 rounded-lg text-sm font-medium ${activeView === 'training' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                Political Training
              </button>
              <button
                onClick={() => setActiveView('promotion')}
                className={`px-6 py-3 rounded-lg text-sm font-medium ${activeView === 'promotion' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                Promotion Tracking
              </button>
              <button
                onClick={() => setActiveView('contracts')}
                className={`px-6 py-3 rounded-lg text-sm font-medium ${activeView === 'contracts' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                Contract Management
              </button>
            </div>
          </div>
        </div>

        {activeView === 'overview' && <OverviewDashboard />}
        {activeView === 'staff' && <StaffListView />}
        {activeView === 'training' && (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                  <ShieldCheck className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-sm text-gray-500 mb-1">Completed Training</p>
                <p className="text-3xl font-bold text-gray-900">{staffData.filter(s => s.politicalTraining.completed).length}</p>
                <p className="text-xs text-green-600 mt-2">{Math.round((staffData.filter(s => s.politicalTraining.completed).length / staffData.length) * 100)}% completion rate</p>
              </div>

              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <p className="text-sm text-gray-500 mb-1">Advanced Level</p>
                <p className="text-3xl font-bold text-gray-900">{staffData.filter(s => s.politicalTraining.level === 'Advanced').length}</p>
                <p className="text-xs text-purple-600 mt-2">Leadership qualified</p>
              </div>

              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-sm text-gray-500 mb-1">Intermediate Level</p>
                <p className="text-3xl font-bold text-gray-900">{staffData.filter(s => s.politicalTraining.level === 'Intermediate').length}</p>
                <p className="text-xs text-blue-600 mt-2">Mid-level qualified</p>
              </div>

              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-3">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <p className="text-sm text-gray-500 mb-1">Not Completed</p>
                <p className="text-3xl font-bold text-gray-900">{staffData.filter(s => !s.politicalTraining.completed).length}</p>
                <p className="text-xs text-red-600 mt-2">Enrollment required</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Advanced Level Training (Board of Rectors & Faculty Deans)</h3>
                <p className="text-sm text-gray-500 mt-1">Staff who have completed the highest level of political training</p>
              </div>
              <div className="p-6 space-y-4">
                {staffData.filter(s => s.politicalTraining.level === 'Advanced').map((staff) => (
                  <div key={staff.id} className="border-2 border-purple-200 bg-purple-50 rounded-xl p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {staff.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-lg font-bold text-gray-900">{staff.name}</h4>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPositionColor(staff.position)}`}>
                              {staff.position}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{staff.department}</p>
                          
                          <div className="grid grid-cols-3 gap-4">
                            <div className="p-3 bg-white rounded-lg border border-purple-200">
                              <p className="text-xs text-gray-600 mb-1">Training Level</p>
                              <p className="text-sm font-bold text-purple-700">Advanced</p>
                            </div>
                            <div className="p-3 bg-white rounded-lg border border-purple-200">
                              <p className="text-xs text-gray-600 mb-1">Completion Date</p>
                              <p className="text-sm font-semibold text-gray-900">{new Date(staff.politicalTraining.completionDate).toLocaleDateString()}</p>
                            </div>
                            <div className="p-3 bg-white rounded-lg border border-purple-200">
                              <p className="text-xs text-gray-600 mb-1">Certificate</p>
                              <p className="text-xs font-mono text-gray-900">{staff.politicalTraining.certificate}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button className="px-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 text-sm font-medium">
                          View Certificate
                        </button>
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium">
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Intermediate Level Training (Department Heads)</h3>
                <p className="text-sm text-gray-500 mt-1">Staff who have completed intermediate political training</p>
              </div>
              <div className="p-6 space-y-4">
                {staffData.filter(s => s.politicalTraining.level === 'Intermediate').map((staff) => (
                  <div key={staff.id} className="border-2 border-blue-200 bg-blue-50 rounded-xl p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {staff.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-lg font-bold text-gray-900">{staff.name}</h4>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPositionColor(staff.position)}`}>
                              {staff.position}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{staff.department}</p>
                          
                          <div className="grid grid-cols-3 gap-4">
                            <div className="p-3 bg-white rounded-lg border border-blue-200">
                              <p className="text-xs text-gray-600 mb-1">Training Level</p>
                              <p className="text-sm font-bold text-blue-700">Intermediate</p>
                            </div>
                            <div className="p-3 bg-white rounded-lg border border-blue-200">
                              <p className="text-xs text-gray-600 mb-1">Completion Date</p>
                              <p className="text-sm font-semibold text-gray-900">{new Date(staff.politicalTraining.completionDate).toLocaleDateString()}</p>
                            </div>
                            <div className="p-3 bg-white rounded-lg border border-blue-200">
                              <p className="text-xs text-gray-600 mb-1">Certificate</p>
                              <p className="text-xs font-mono text-gray-900">{staff.politicalTraining.certificate}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 text-sm font-medium">
                          View Certificate
                        </button>
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium">
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Not Completed - Enrollment Required</h3>
                    <p className="text-sm text-gray-500 mt-1">Staff members who need to complete political training</p>
                  </div>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium">
                    Enroll All
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {staffData.filter(s => !s.politicalTraining.completed).map((staff) => (
                  <div key={staff.id} className="border-2 border-red-200 bg-red-50 rounded-xl p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-14 h-14 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {staff.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-lg font-bold text-gray-900">{staff.name}</h4>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPositionColor(staff.position)}`}>
                              {staff.position}
                            </span>
                            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold border border-red-300">
                              Not Completed
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{staff.department} • {staff.type}</p>
                          
                          <div className="bg-white border border-red-200 rounded-lg p-3">
                            <div className="flex items-start gap-3">
                              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-sm font-semibold text-red-700 mb-1">Training Required for Promotion</p>
                                <p className="text-xs text-gray-600">
                                  Political training must be completed before this staff member can be considered for leadership positions 
                                  such as Department Head, Faculty Dean, or Board of Rectors.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium whitespace-nowrap">
                          Enroll in Training
                        </button>
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium">
                          View Profile
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-l-4 border-purple-500 p-6 rounded-lg">
                <div className="flex items-start gap-4">
                  <Award className="w-8 h-8 text-purple-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Political Training Levels Explained</h4>
                    <div className="space-y-2 text-sm text-gray-700">
                      <div>
                        <p className="font-semibold text-purple-700">Advanced Level:</p>
                        <p className="text-xs">Required for Board of Rectors and Faculty Deans. Comprehensive leadership and political theory training.</p>
                      </div>
                      <div>
                        <p className="font-semibold text-blue-700">Intermediate Level:</p>
                        <p className="text-xs">Suitable for Department Heads and senior positions. Foundational political training and management principles.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Training Completion Timeline</h3>
                <div className="space-y-3">
                  {staffData.filter(s => s.politicalTraining.completed) .sort((a, b) =>
  (new Date(b.politicalTraining?.completionDate ?? 0).getTime()) -
  (new Date(a.politicalTraining?.completionDate ?? 0).getTime())
)
                .slice(0, 5).map((staff, i) => (
                    <div key={staff.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 ${staff.politicalTraining.level === 'Advanced' ? 'bg-purple-100' : 'bg-blue-100'} rounded-full flex items-center justify-center text-xs font-bold ${staff.politicalTraining.level === 'Advanced' ? 'text-purple-700' : 'text-blue-700'}`}>
                          {i + 1}
                        </div>
                       
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{staff.name}</p>
                          <p className="text-xs text-gray-500">{staff.politicalTraining.level}</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600">{new Date(staff.politicalTraining.completionDate).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === 'contracts' && (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-sm text-gray-500 mb-1">Total Contracts</p>
                <p className="text-3xl font-bold text-gray-900">{staffData.length}</p>
                <p className="text-xs text-blue-600 mt-2">All staff contracts</p>
              </div>

              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                  <Award className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-sm text-gray-500 mb-1">Permanent Contracts</p>
                <p className="text-3xl font-bold text-gray-900">{staffData.filter(s => s.contract.type === 'Permanent').length}</p>
                <p className="text-xs text-green-600 mt-2">Long-term staff</p>
              </div>

              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <p className="text-sm text-gray-500 mb-1">Fixed-Term Contracts</p>
                <p className="text-3xl font-bold text-gray-900">{staffData.filter(s => s.contract.type === 'Fixed-Term').length}</p>
                <p className="text-xs text-purple-600 mt-2">Temporary staff</p>
              </div>

              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
                  <AlertCircle className="w-6 h-6 text-orange-600" />
                </div>
                <p className="text-sm text-gray-500 mb-1">Expiring Soon</p>
                <p className="text-3xl font-bold text-gray-900">{staffData.filter(s => s.contract.status === 'Expiring Soon').length}</p>
                <p className="text-xs text-orange-600 mt-2">Renewal needed</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="Search by staff name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <select 
                    value={filterContractStatus}
                    onChange={(e) => setFilterContractStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Expiring Soon">Expiring Soon</option>
                  </select>

                  <select 
                    value={filterPosition}
                    onChange={(e) => setFilterPosition(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Contract Types</option>
                    <option value="Permanent">Permanent</option>
                    <option value="Fixed-Term">Fixed-Term</option>
                  </select>

                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 whitespace-nowrap">
                    <Download size={18} />
                    Export Report
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {staffData.filter(staff => {
                  const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase());
                  const matchesStatus = filterContractStatus === 'all' || staff.contract.status === filterContractStatus;
                  const matchesType = filterPosition === 'all' || staff.contract.type === filterPosition;
                  return matchesSearch && matchesStatus && matchesType;
                }).map((staff) => (
                  <div key={staff.id} className={`border-2 rounded-xl p-6 ${staff.contract.status === 'Expiring Soon' ? 'border-orange-200 bg-orange-50' : 'border-gray-200 bg-white'}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`w-14 h-14 ${staff.contract.status === 'Expiring Soon' ? 'bg-gradient-to-br from-orange-400 to-orange-600' : 'bg-gradient-to-br from-blue-400 to-purple-500'} rounded-full flex items-center justify-center text-white font-bold text-lg`}>
                          {staff.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-lg font-bold text-gray-900">{staff.name}</h4>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${staff.contract.type === 'Permanent' ? 'bg-green-100 text-green-700 border-green-300' : 'bg-purple-100 text-purple-700 border-purple-300'}`}>
                              {staff.contract.type}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${staff.contract.status === 'Expiring Soon' ? 'bg-orange-100 text-orange-700 border-orange-300' : 'bg-green-100 text-green-700 border-green-300'}`}>
                              {staff.contract.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{staff.position} • {staff.department}</p>
                          
                          <div className="grid grid-cols-4 gap-4 mb-3">
                            <div className="p-3 bg-blue-50 rounded-lg">
                              <p className="text-xs text-gray-600 mb-1">Start Date</p>
                              <p className="text-sm font-semibold text-gray-900">{new Date(staff.contract.startDate).toLocaleDateString()}</p>
                            </div>
                            <div className="p-3 bg-green-50 rounded-lg">
                              <p className="text-xs text-gray-600 mb-1">End Date</p>
                              <p className="text-sm font-semibold text-gray-900">{staff.contract.endDate ? new Date(staff.contract.endDate).toLocaleDateString() : 'Permanent'}</p>
                            </div>
                            <div className="p-3 bg-purple-50 rounded-lg">
                              <p className="text-xs text-gray-600 mb-1">Salary</p>
                              <p className="text-sm font-semibold text-gray-900">{staff.contract.salary}</p>
                            </div>
                            <div className="p-3 bg-orange-50 rounded-lg">
                              <p className="text-xs text-gray-600 mb-1">Next Review</p>
                              <p className="text-sm font-semibold text-gray-900">{new Date(staff.contract.nextReview).toLocaleDateString()}</p>
                            </div>
                          </div>

                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs font-semibold text-gray-600 mb-2">Benefits</p>
                            <div className="flex flex-wrap gap-2">
                              {staff.contract.benefits.map((benefit, i) => (
                                <span key={i} className="px-2 py-1 bg-white border border-gray-200 rounded text-xs text-gray-700">
                                  {benefit}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <button className="block w-full px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 text-sm font-medium">
                          View Contract
                        </button>
                        <button className="block w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium">
                          Edit Details
                        </button>
                        {staff.contract.status === 'Expiring Soon' && (
                          <button className="block w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm font-medium">
                            Renew Contract
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Contracts Expiring in Next 6 Months</h3>
                <div className="space-y-3">
                  {staffData.filter(s => s.contract.status === 'Expiring Soon').map((staff) => (
                    <div key={staff.id} className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-900">{staff.name}</p>
                          <p className="text-sm text-gray-600">{staff.position}</p>
                          <p className="text-xs text-orange-700 mt-1 font-medium">
                            Expires: {new Date(staff.contract.endDate).toLocaleDateString()}
                          </p>
                        </div>
                        <button className="px-3 py-1 bg-orange-600 text-white rounded text-xs font-medium hover:bg-orange-700">
                          Renew
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Contract Type Distribution</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Permanent Contracts</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {staffData.filter(s => s.contract.type === 'Permanent').length} ({Math.round((staffData.filter(s => s.contract.type === 'Permanent').length / staffData.length) * 100)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="h-2 rounded-full bg-green-500" style={{width: `${(staffData.filter(s => s.contract.type === 'Permanent').length / staffData.length) * 100}%`}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Fixed-Term Contracts</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {staffData.filter(s => s.contract.type === 'Fixed-Term').length} ({Math.round((staffData.filter(s => s.contract.type === 'Fixed-Term').length / staffData.length) * 100)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="h-2 rounded-full bg-purple-500" style={{width: `${(staffData.filter(s => s.contract.type === 'Fixed-Term').length / staffData.length) * 100}%`}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeView === 'promotion' && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-sm text-gray-500 mb-1">Eligible for Promotion</p>
                <p className="text-3xl font-bold text-gray-900">{staffData.filter(s => s.eligibleForPromotion).length}</p>
                <p className="text-xs text-green-600 mt-2">Ready for advancement</p>
              </div>

              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
                  <AlertCircle className="w-6 h-6 text-orange-600" />
                </div>
                <p className="text-sm text-gray-500 mb-1">Pending Requirements</p>
                <p className="text-3xl font-bold text-gray-900">{staffData.filter(s => !s.eligibleForPromotion).length}</p>
                <p className="text-xs text-orange-600 mt-2">Action needed</p>
              </div>

              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <p className="text-sm text-gray-500 mb-1">Leadership Positions</p>
                <p className="text-3xl font-bold text-gray-900">3</p>
                <p className="text-xs text-purple-600 mt-2">Require advanced training</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Eligible for Promotion</h3>
                <p className="text-sm text-gray-500 mt-1">Staff members who meet all requirements including political training</p>
              </div>
              <div className="p-6 space-y-4">
                {staffData.filter(s => s.eligibleForPromotion).map((staff) => (
                  <div key={staff.id} className="border-2 border-green-200 bg-green-50 rounded-xl p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {staff.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-lg font-bold text-gray-900">{staff.name}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPositionColor(staff.position)}`}>
                              {staff.position}
                            </span>
                            {getPoliticalTrainingBadge(staff.politicalTraining)}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{staff.department}</p>
                          
                          <div className="grid grid-cols-3 gap-4 mt-3">
                            <div>
                              <p className="text-xs text-gray-500">Political Training</p>
                              <p className="text-sm font-semibold text-green-700">✓ {staff.politicalTraining.level}</p>
                            </div>
                            {staff.type === 'Academic Staff' && (
                              <>
                                <div>
                                  <p className="text-xs text-gray-500">Publications</p>
                                  <p className="text-sm font-semibold text-gray-900">{staff.publications} papers</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Experience</p>
                                  <p className="text-sm font-semibold text-gray-900">
                                    Math.floor(
  (new Date().getTime() - new Date(staff.joinDate).getTime()) /
  (365 * 24 * 60 * 60 * 1000)
) years
                                  </p>
                                </div>
                              </>
                            )}
                            {staff.type === 'Administrative Staff' && (
                              <div>
                                <p className="text-xs text-gray-500">Experience</p>
                                <p className="text-sm font-semibold text-gray-900">
                                  Math.floor(
  (new Date().getTime() - new Date(staff.joinDate).getTime()) /
  (365 * 24 * 60 * 60 * 1000)
) years
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold mb-2">
                          ELIGIBLE
                        </span>
                        <button className="block w-full px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 text-sm font-medium">
                          Review Application
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Pending Requirements</h3>
                <p className="text-sm text-gray-500 mt-1">Staff members who need to complete requirements before promotion eligibility</p>
              </div>
              <div className="p-6 space-y-4">
                {staffData.filter(s => !s.eligibleForPromotion).map((staff) => (
                  <div key={staff.id} className="border-2 border-orange-200 bg-orange-50 rounded-xl p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {staff.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-lg font-bold text-gray-900">{staff.name}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPositionColor(staff.position)}`}>
                              {staff.position}
                            </span>
                            {getPoliticalTrainingBadge(staff.politicalTraining)}
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{staff.department}</p>
                          
                          <div className="bg-white border border-orange-200 rounded-lg p-3">
                            <p className="text-sm font-semibold text-orange-700 mb-2">Missing Requirements:</p>
                            <ul className="space-y-1">
                              {!staff.politicalTraining.completed && (
                                <li className="text-sm text-gray-700 flex items-center gap-2">
                                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                  Political Training not completed
                                </li>
                              )}
                              {staff.type === 'Academic Staff' && staff.publications < 20 && (
                                <li className="text-sm text-gray-700 flex items-center gap-2">
                                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                                  Minimum publications requirement (Current: {staff.publications}, Required: 20)
                                </li>
                              )}
                             { Math.floor(
                                  (Date.now() - new Date(staff.joinDate).getTime()) /
                                  (365 * 24 * 60 * 60 * 1000)
                                ) < 5 && (
                                  <li className="text-sm text-gray-700 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                                    Minimum experience requirement (Current: {
                                      Math.floor(
                                        (Date.now() - new Date(staff.joinDate).getTime()) /
                                        (365 * 24 * 60 * 60 * 1000)
                                      )
                                    } years, Required: 5 years)
                                  </li>
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-semibold mb-2">
                          NOT ELIGIBLE
                        </span>
                        {!staff.politicalTraining.completed && (
                          <button className="block w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm font-medium">
                            Enroll in Training
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-6 rounded-lg">
              <div className="flex items-start gap-4">
                <Award className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Promotion Requirements</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                    <div>
                      <p className="font-semibold mb-1">For Academic Staff:</p>
                      <ul className="space-y-1 text-xs">
                        <li>• Political Training: Advanced (for Deans/Rectors) or Intermediate (for Heads)</li>
                        <li>• Minimum 20 publications</li>
                        <li>• Minimum 5 years experience</li>
                        <li>• Active research projects</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold mb-1">For Administrative Staff:</p>
                      <ul className="space-y-1 text-xs">
                        <li>• Political Training: Intermediate or Advanced</li>
                        <li>• Minimum 5 years experience</li>
                        <li>• Performance evaluation score above 85%</li>
                        <li>• Relevant certifications</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedStaff && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedStaff(null)}>
            <div className="bg-white rounded-xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="h-40 bg-gradient-to-br from-blue-500 to-purple-600 p-6 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold text-2xl shadow-lg">
                      {selectedStaff.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{selectedStaff.name}</h2>
                      <p className="text-white text-opacity-90">{selectedStaff.position}</p>
                      <p className="text-white text-opacity-75 text-sm">{selectedStaff.department}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedStaff(null)}
                    className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg text-white text-xl font-bold"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Email</p>
                          <p className="text-sm font-medium text-gray-900">{selectedStaff.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Phone</p>
                          <p className="text-sm font-medium text-gray-900">{selectedStaff.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Join Date</p>
                          <p className="text-sm font-medium text-gray-900">{new Date(selectedStaff.joinDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Details</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <GraduationCap className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Education</p>
                          <p className="text-sm font-medium text-gray-900">{selectedStaff.education}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <BookOpen className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Specialization</p>
                          <p className="text-sm font-medium text-gray-900">{selectedStaff.specialization}</p>
                        </div>
                      </div>
                      {selectedStaff.academicRank && (
                        <div className="flex items-center gap-3">
                          <Award className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Academic Rank</p>
                            <p className="text-sm font-medium text-gray-900">{selectedStaff.academicRank}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-blue-600" />
                    Political Training Status
                  </h3>
                  
                  {selectedStaff.politicalTraining.completed ? (
                    <div className="p-6 bg-green-50 border-2 border-green-300 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-sm font-bold text-green-700 uppercase mb-1">Training Completed</p>
                          <p className="text-2xl font-bold text-green-700">{selectedStaff.politicalTraining.level}</p>
                        </div>
                        <ShieldCheck size={48} className="text-green-600" />
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <p className="text-xs text-gray-600">Completion Date</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {new Date(selectedStaff.politicalTraining.completionDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Certificate Number</p>
                          <p className="text-sm font-semibold text-gray-900">{selectedStaff.politicalTraining.certificate}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 bg-red-50 border-2 border-red-300 rounded-lg">
                      <div className="flex items-center gap-4">
                        <AlertCircle size={48} className="text-red-600" />
                        <div className="flex-1">
                          <p className="text-lg font-bold text-red-700 mb-2">Political Training Not Completed</p>
                          <p className="text-sm text-gray-700 mb-3">
                            This staff member has not completed the required political training. 
                            Completion is necessary for eligibility in leadership positions.
                          </p>
                          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium">
                            Enroll in Training Program
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {selectedStaff.type === 'Academic Staff' && (
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Performance</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-5 bg-blue-50 rounded-lg border border-blue-200 text-center">
                        <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <p className="text-3xl font-bold text-blue-700">{selectedStaff.publications}</p>
                        <p className="text-sm text-gray-600">Publications</p>
                      </div>
                      <div className="p-5 bg-green-50 rounded-lg border border-green-200 text-center">
                        <Briefcase className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <p className="text-3xl font-bold text-green-700">{selectedStaff.projects}</p>
                        <p className="text-sm text-gray-600">Research Projects</p>
                      </div>
                      <div className="p-5 bg-purple-50 rounded-lg border border-purple-200 text-center">
                        <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                        <p className="text-3xl font-bold text-purple-700">{selectedStaff.teachingHours}</p>
                        <p className="text-sm text-gray-600">Teaching Hours</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Promotion Eligibility</h3>
                  {selectedStaff.eligibleForPromotion ? (
                    <div className="p-5 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="w-6 h-6 text-green-600" />
                        <div>
                          <p className="font-semibold text-green-700">Eligible for Promotion</p>
                          <p className="text-sm text-gray-600 mt-1">
                            This staff member meets all requirements for promotion consideration, including political training completion.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-5 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <AlertCircle className="w-6 h-6 text-orange-600" />
                        <div>
                          <p className="font-semibold text-orange-700">Not Eligible for Promotion</p>
                          <p className="text-sm text-gray-600 mt-1">
                            {!selectedStaff.politicalTraining.completed 
                              ? "Political training must be completed before promotion eligibility."
                              : "Additional requirements need to be met for promotion eligibility."}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                    Edit Profile
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
                    <Download size={16} className="inline mr-2" />
                    Download CV
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
                    View Documents
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


const EventsDashboard = () => {
    const [viewMode, setViewMode] = useState('grid');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterType, setFilterType] = useState('all');
    const [selectedEvent, setSelectedEvent] = useState(null);



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
      <div className="min-h-screen bg-gray-50 p-3">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mt-3">
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

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mt-3">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-3 mt-3">
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
    { building: 'Building C', total: 15, occupied: 12, available: 3, rate: 80 }
  ];

  const conflicts = [
    { type: 'Double Booking', room: 'A101', time: 'Mon 10:00-11:30', courses: 'CS301 & BA202', severity: 'Critical' },
    { type: 'Capacity Issue', room: 'B205', enrolled: 85, capacity: 80, course: 'BA301', severity: 'High' },
    { type: 'Instructor Conflict', instructor: 'Dr. Le', time: 'Wed 14:00-15:30', courses: 'BA201 & BA302', severity: 'Critical' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-3">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3 mt-3">
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
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mt-3">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 mt-3">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-3 mt-3">
        {/* Pending Changes */}
        <div className="bg-white p-6  rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Pending Schedule Changes</h3>
            <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">
              {pendingChanges.filter(c => c.status === 'Pending').length} pending
            </span>
          </div>
          <div className="space-y-3 overflow-y-auto h-[520px] pr-2">
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
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Upcoming Holidays & Breaks</h3>
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
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-3">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
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
      { id: 5, code: 'CS303', name: 'FONS', room: 'A103', time: '10:00-11:30', day: 2, instructor: 'Dr. Hoang' },
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2">
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
      <div className="space-y-6 p-3">
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
                <option value="cs">FONS</option>
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


/*Room Schedule tab*/









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
    <div className="min-h-screen bg-gray-50 p-2">
      <div className="max-w- mx-auto space-y-6">
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
    <div className="min-h-screen bg-gray-50 p-2">
      <div className="max-w- mx-auto space-y-3">
        <div className="flex items-center justify-between mt-3">
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












// Role hierarchy definition
type RoleLevel = "admin" | "rector" | "head" | "dean" | "lead_staff" | "staff" | "lecturer" | "student";

interface Role {
  id: RoleLevel;
  name: string;
  level: number;
  color: string;
  icon: React.ReactNode;
  hasDepartment: boolean;
}

const roleHierarchy: Role[] = [
  { id: "admin", name: "Administrator", level: 1, color: "#dc2626", icon: <Shield className="w-4 h-4" />, hasDepartment: false },
  { id: "rector", name: "Rector", level: 2, color: "#ea580c", icon: <Award className="w-4 h-4" />, hasDepartment: false },
  { id: "head", name: "Department Head", level: 3, color: "#d97706", icon: <Building className="w-4 h-4" />, hasDepartment: true },
  { id: "dean", name: "Dean", level: 4, color: "#16a34a", icon: <UserCheck className="w-4 h-4" />, hasDepartment: true },
  { id: "lead_staff", name: "Lead Staff", level: 5, color: "#2563eb", icon: <Users className="w-4 h-4" />, hasDepartment: true },
  { id: "staff", name: "Staff", level: 6, color: "#7c3aed", icon: <User className="w-4 h-4" />, hasDepartment: true },
  { id: "lecturer", name: "Lecturer", level: 7, color: "#0891b2", icon: <GraduationCap className="w-4 h-4" />, hasDepartment: true },
  { id: "student", name: "Student", level: 8, color: "#84cc16", icon: <BookOpen className="w-4 h-4" />, hasDepartment: true },
];

interface Permission {
  id: string;
  name: string;
  category: string;
  description: string;
}

interface TabAccess {
  tabId: string;
  tabName: string;
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canExport: boolean;
}

interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: RoleLevel;
  department: string;
  status: "active" | "inactive" | "suspended";
  lastLogin: string;
  createdAt: string;
  permissions: string[];
  tabAccess: TabAccess[];
}

const permissionsList: Permission[] = [
  // Dashboard
  { id: "dashboard_view", name: "View Dashboard", category: "Dashboard", description: "Access main dashboard" },
  { id: "dashboard_analytics", name: "Dashboard Analytics", category: "Dashboard", description: "View advanced analytics" },
  
  // Student Management
  { id: "students_view", name: "View Students", category: "Students", description: "View student records and profiles" },
  { id: "students_create", name: "Create Students", category: "Students", description: "Add new students" },
  { id: "students_edit", name: "Edit Students", category: "Students", description: "Modify student information" },
  { id: "students_delete", name: "Delete Students", category: "Students", description: "Remove student records" },
  { id: "students_ec_score", name: "Manage EC Score", category: "Students", description: "View and manage extracurricular scores" },
  { id: "students_scholarships", name: "Manage Scholarships", category: "Students", description: "Handle scholarship applications" },
  { id: "students_attendance", name: "Track Attendance", category: "Students", description: "Monitor student attendance" },
  { id: "students_achievements", name: "Manage Achievements", category: "Students", description: "Record student achievements" },
  { id: "students_discipline", name: "Manage Discipline", category: "Students", description: "Handle disciplinary records" },
  
  // Lecturer/Faculty Management
  { id: "lecturers_view", name: "View Lecturers", category: "Lecturers/Faculty", description: "View faculty records" },
  { id: "lecturers_create", name: "Create Lecturers", category: "Lecturers/Faculty", description: "Add new faculty" },
  { id: "lecturers_edit", name: "Edit Lecturers", category: "Lecturers/Faculty", description: "Modify faculty information" },
  { id: "lecturers_delete", name: "Delete Lecturers", category: "Lecturers/Faculty", description: "Remove faculty records" },
  { id: "lecturers_research", name: "Manage Research", category: "Lecturers/Faculty", description: "Access research management" },
  { id: "lecturers_grades", name: "Manage Grades", category: "Lecturers/Faculty", description: "Input and modify grades" },
  { id: "lecturers_syllabus", name: "Manage Syllabus", category: "Lecturers/Faculty", description: "Create and edit syllabi" },
  { id: "lecturers_rankings", name: "View Rankings", category: "Lecturers/Faculty", description: "Access faculty rankings" },
  
  // Department Management
  { id: "departments_view", name: "View Departments", category: "Departments", description: "View department data" },
  { id: "departments_manage", name: "Manage Departments", category: "Departments", description: "Create/edit departments" },
  { id: "departments_operations", name: "Manage Operations", category: "Departments", description: "Handle department operations" },
  { id: "departments_schedule", name: "Manage Work Schedule", category: "Departments", description: "Create work schedules" },
  { id: "departments_hr", name: "Access HR Profile", category: "Departments", description: "View HR information" },
  { id: "departments_kpis", name: "Manage KPIs", category: "Departments", description: "Track and manage KPIs" },
  { id: "departments_facilities", name: "Manage Facilities", category: "Departments", description: "Handle facility management" },
  
  // Classes
  { id: "classes_view", name: "View Classes", category: "Classes", description: "View class information" },
  { id: "classes_manage", name: "Manage Classes", category: "Classes", description: "Create and edit classes" },
  { id: "classes_courses", name: "Manage Courses", category: "Classes", description: "Handle course management" },
  { id: "classes_activities", name: "Manage Activities", category: "Classes", description: "Organize class activities" },
  { id: "classes_rooms", name: "Manage Rooms", category: "Classes", description: "Allocate and manage rooms" },
  
  // Events
  { id: "events_view", name: "View Events", category: "Events", description: "View events and calendar" },
  { id: "events_create", name: "Create Events", category: "Events", description: "Create new events" },
  { id: "events_edit", name: "Edit Events", category: "Events", description: "Modify event details" },
  { id: "events_delete", name: "Delete Events", category: "Events", description: "Remove events" },
  { id: "events_registration", name: "Manage Registration", category: "Events", description: "Handle event registrations" },
  { id: "events_checkin", name: "Manage Check-in", category: "Events", description: "Control event check-in" },
  { id: "events_analytics", name: "View Analytics", category: "Events", description: "Access event analytics" },
  
  // Timetable
  { id: "timetable_view", name: "View Timetable", category: "Timetable", description: "View schedules" },
  { id: "timetable_manage", name: "Manage Timetable", category: "Timetable", description: "Create and edit schedules" },
  { id: "timetable_rooms", name: "Manage Room Schedule", category: "Timetable", description: "Schedule room usage" },
  { id: "timetable_exams", name: "Manage Exam Schedule", category: "Timetable", description: "Schedule examinations" },
  
  // Library
  { id: "library_view", name: "View Library", category: "Library", description: "Access library resources" },
  { id: "library_manage", name: "Manage Library", category: "Library", description: "Manage library items" },
  { id: "library_thesis", name: "Manage Thesis/Dissertation", category: "Library", description: "Handle academic papers" },
  { id: "library_textbooks", name: "Manage Textbooks", category: "Library", description: "Manage textbook inventory" },
  { id: "library_journals", name: "Manage Journals", category: "Library", description: "Handle journal subscriptions" },
  
  // Finance
  { id: "finance_view", name: "View Finance", category: "Finance", description: "View financial records" },
  { id: "finance_manage", name: "Manage Finance", category: "Finance", description: "Manage transactions" },
  { id: "finance_tuition", name: "Manage Tuition Fees", category: "Finance", description: "Handle tuition payments" },
  { id: "finance_costs", name: "Manage Costs", category: "Finance", description: "Track operational costs" },
  { id: "finance_salary", name: "Manage Salary", category: "Finance", description: "Process salary payments" },
  { id: "finance_bonus", name: "Manage Bonus", category: "Finance", description: "Distribute bonuses" },
  { id: "finance_tax", name: "Manage Tax", category: "Finance", description: "Handle tax matters" },
  { id: "finance_approve", name: "Approve Transactions", category: "Finance", description: "Approve financial transactions" },
  
  // Documents
  { id: "documents_view", name: "View Documents", category: "Documents", description: "Access documents" },
  { id: "documents_upload", name: "Upload Documents", category: "Documents", description: "Upload new documents" },
  { id: "documents_edit", name: "Edit Documents", category: "Documents", description: "Modify documents" },
  { id: "documents_signature", name: "Digital Signature", category: "Documents", description: "Use digital signatures" },
  { id: "documents_processes", name: "Manage Processes", category: "Documents", description: "Handle administrative processes" },
  
  // One-Stop Service
  { id: "onestop_view", name: "View One-Stop Service", category: "One-Stop Service", description: "Access service center" },
  { id: "onestop_manage", name: "Manage Requests", category: "One-Stop Service", description: "Handle service requests" },
  
  // Projects
  { id: "projects_view", name: "View Projects", category: "Projects", description: "View project information" },
  { id: "projects_create", name: "Create Projects", category: "Projects", description: "Create new projects" },
  { id: "projects_edit", name: "Edit Projects", category: "Projects", description: "Modify project details" },
  { id: "projects_delete", name: "Delete Projects", category: "Projects", description: "Remove projects" },
  
  // HSB Shop
  { id: "shop_view", name: "View Shop", category: "HSB-Shop", description: "Access shop interface" },
  { id: "shop_manage", name: "Manage Shop", category: "HSB-Shop", description: "Manage shop items and orders" },
  
  // Alumni
  { id: "alumni_view", name: "View Alumni", category: "Alumni", description: "Access alumni information" },
  { id: "alumni_manage", name: "Manage Alumni", category: "Alumni", description: "Update alumni records" },
  { id: "alumni_statistics", name: "View Statistics", category: "Alumni", description: "Access alumni statistics" },
  { id: "alumni_employment", name: "Track Employment", category: "Alumni", description: "Monitor employment data" },
  
  // Canvas/LMS
  { id: "canvas_view", name: "View Canvas/LMS", category: "Canvas/LMS", description: "Access learning management system" },
  { id: "canvas_lectures", name: "Manage Lectures", category: "Canvas/LMS", description: "Upload and manage lectures" },
  { id: "canvas_assignments", name: "Manage Assignments", category: "Canvas/LMS", description: "Create and grade assignments" },
  { id: "canvas_projects", name: "Manage Projects", category: "Canvas/LMS", description: "Supervise student projects" },
  { id: "canvas_thesis", name: "Manage Thesis", category: "Canvas/LMS", description: "Supervise thesis work" },
  
  // System Administration
  { id: "users_view", name: "View Users", category: "Administration", description: "View user accounts" },
  { id: "users_create", name: "Create Users", category: "Administration", description: "Add new user accounts" },
  { id: "users_edit", name: "Edit Users", category: "Administration", description: "Modify user information" },
  { id: "users_delete", name: "Delete Users", category: "Administration", description: "Remove user accounts" },
  { id: "roles_manage", name: "Manage Roles", category: "Administration", description: "Configure roles and permissions" },
  { id: "system_settings", name: "System Settings", category: "Administration", description: "Access system configuration" },
  { id: "audit_logs", name: "View Audit Logs", category: "Administration", description: "View system activity logs" },
];

const availableTabs = [
  "Dashboard", "Students", "Lecturers/Faculty", "Departments", "Classes", 
  "Events", "Timetable", "Library", "Finance", "Documents", "Projects",
  "HSB-Shop", "Alumni", "CanvasLMS", "Account"
];

// Sample data


{/*render nav*/}

{/*Show tab content*/}

  const renderContent = () => {
   
   if (activeTab === "dashboard") {
  if (userType === "admin") return <AdminDashboard />;

  if (userType === "faculty") return <FacultyDashboard />;
  if (userType === "department") return <DepartmentDashboard />;
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
    if (activeTab === 'lecturer-research'){
      return <ResearchManagement userRole="admin" />;
    }
    if (activeTab == 'grade-management'){
      return <GradeManagement/>;
    }
    if (activeTab == 'feedback'){
      return <CourseFeedback/>;
    }
    if (activeTab == 'hr-profile'){
      return <HRProfileManagement/>;
    }

    if (activeTab === 'events-dashboard') {
      return <EventsDashboard />;
    }
    if (activeTab === 'student-services') {
      return <StudentServicesOverview />;
    }
    if (activeTab === 'scholarships') {
      return <Scholarship />;
    }
    if (activeTab === 'attendance') {
      return <AttendanceLoader />;
    }
    if (activeTab === 'attendance-live') {
      return <AttendanceLive />;
    }
    if (activeTab === 'attendance-loader' || activeTab === 'load-attendance') {
      return <AttendanceLoader />;
    }
    if (activeTab === 'view-rankings') { 
      return <ViewRankings />;
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
    
    if (activeTab === 'course-schedule' || activeTab === 'exam-schedule') {
      return <TimetableCalendar />;
    }
    if (activeTab === 'timetable-overview') {
      return <TimetableOverview />;
    }
    if (activeTab === 'room-schedule' ) {
      return <RoomSchedule />;
    }
    
    if (activeTab === 'library-dashboard') {
      return <LibraryDashboard />;
    }
    if (activeTab === 'library-view') {
      return <LibraryViewer />;
    }
    if (activeTab === 'thesis-store') {
      return <ThesisStorage />;
    }
    if (activeTab === 'book-management') {
      return <BookManagement />;
    }
    if (activeTab === 'thesis-dissertation') {
      return <ThesisManagement />;
    }
    if (activeTab === 'finance-overview') {
      return <FinanceOverview />;
    }
   if (activeTab == 'one-stop-service'){
      return <OneStopService/>;
    }
    if (activeTab == 'documents-dashboard'){
      return <DocumentDashboard userId={mockUser.id} userRole="admin" />;
    }
    if (activeTab == 'my-documents'){
      return (
        <DocumentList
          userId={mockUser.id}
          userName={mockUser.name}
          userType="student"
        />
      );
    }
    if (activeTab == 'upload-document'){
      return (
        <DocumentUpload
          uploaderId={mockUser.id}
          uploaderName={mockUser.name}
          onSuccess={(docId) => {
            console.log('Document uploaded:', docId);
            // Switch back to documents list after upload
            setActiveTab('my-documents');
          }}
          onClose={() => setActiveTab('my-documents')}
        />
      );
    }
    if (activeTab == 'category-manager'){
      return <CategoryManager />;
    }
    if (activeTab == 'handbook'){
      return <DocumentHandbook userRole="admin" userId={mockUser.id} userName={mockUser.name} />;
    }
    if (activeTab == 'projects'){
      return <ProjectsTab userId={mockUser.id} userName={mockUser.name} />;
    }
    if (activeTab == 'shop-viewer'){
      return <HSBShopViewer userId={mockUser.id} userName={mockUser.name} />;
    }
    if (activeTab == 'shop-admin'){
      return <HSBShop />;
    }
    if (activeTab === 'polling'){
  return <PollSystem 
    userId={mockUser.id} 
    userLevel={roleToUserLevel(mockUser.role)}
  />;
}
      if (activeTab == 'account'){
      return <AccountManagement/>;
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
          sidebarCollapsed ? 'w-16' : 'w-60'
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
  <RoleDropdown
    value={userType as RoleValue}
    onChange={(v) => setUserType(v as UserType)}
    options={[
      { value: "admin", label: "Admin" },
      { value: "student", label: "Student" },
      { value: "lecturer", label: "Staff" },
      { value: "faculty", label: "Faculty" },
      { value: "department", label: "Department" },
    ]}
    className="mt-2"
  />
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
                    handleTabChange(item.id); {/* ✅ Changed from setActiveTab to handleTabChange */}
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
                      onClick={() => handleTabChange(subItem.id)} 
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
        <div className="p-2">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ERPLayout;