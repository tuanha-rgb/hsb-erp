import React, { useState, useEffect, useMemo } from "react";
import Student from "./student";
import Lecturer from "./lecturer";
import './project.css';
import './index.css';
import {   bookRecords,   publishers,   catalogues,  type BookRecord,  type Publisher,
  type BookType,  type CatalogueCategory} from './bookdata';

import {  type Document,  type DocumentSource,  type DocumentType,  type DocumentStatus,  type PriorityLevel,
  type Signatory,  type Attachment,  sampleDocuments,  getDocumentStatistics} from './documentdata';

// ✅ Types (match your file name exactly)
import {
  Faculty, ProgramCatalog, BachelorProgramStat, FacultyMetric,
  CourseItem, StudentGradeRow, FacultyCode,
} from "./academicmodel";

// ✅ Data (match your file names from the screenshot)
import { faculties } from "./faculties";
import { programs } from "./programs";
import { bachelorProgramStats } from "./programstats";
import { facultyMetrics } from "./facultymetrics";
import { courseData } from "./courses";
import { studentGrades } from "./studentgrades";

import {  Thesis,  ThesisStatus,  ThesisCategory,  ThesisLevel,  sampleTheses,} from "./thesis";

import { sampleStudents, studentdata } from "./studentdata";

import { researchProjects } from "./researchProjects";
import { publications } from "./publications";
import { patentData } from "./patent";

import { ResearchProject, Publication, Patent } from "./research";
import { getDisciplineColor, getStatusColor } from "./ResearchColors";

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

  const scholarships = [
    {
      id: 1,
      name: 'Merit-Based Scholarship',
      type: 'Internal - Merit',
      amount: '10,000,000 VND',
      period: '2024-2025',
      deadline: '2024-12-31',
      status: 'Active',
      applicants: 45,
      awarded: 12,
      budget: '120,000,000 VND',
      budgetUsed: '60,000,000 VND',
      department: 'Academic Affairs'
    },
    {
      id: 2,
      name: 'Commendation Scholarship',
      type: 'Internal - Commendation',
      amount: '5,000,000 VND',
      period: '2024-2025',
      deadline: '2025-01-15',
      status: 'Active',
      applicants: 38,
      awarded: 8,
      budget: '50,000,000 VND',
      budgetUsed: '25,000,000 VND',
      department: 'Student Services'
    },
    {
      id: 3,
      name: 'TechCorp Vietnam Scholarship',
      type: 'External - Company',
      amount: '20,000,000 VND',
      period: '2024-2025',
      deadline: '2025-02-28',
      status: 'Active',
      applicants: 67,
      awarded: 5,
      budget: '100,000,000 VND',
      budgetUsed: '100,000,000 VND',
      department: 'Academic Affairs',
      sponsor: 'TechCorp Vietnam'
    },
    {
      id: 4,
      name: 'VinGroup Talent Scholarship',
      type: 'External - Company',
      amount: '25,000,000 VND',
      period: '2024-2025',
      deadline: '2024-12-20',
      status: 'Active',
      applicants: 89,
      awarded: 10,
      budget: '250,000,000 VND',
      budgetUsed: '250,000,000 VND',
      department: 'Academic Affairs',
      sponsor: 'VinGroup'
    },
    {
      id: 5,
      name: 'HSB Alumni Scholarship',
      type: 'External - Alumni',
      amount: '8,000,000 VND',
      period: '2024-2025',
      deadline: '2025-01-31',
      status: 'Active',
      applicants: 52,
      awarded: 15,
      budget: '120,000,000 VND',
      budgetUsed: '120,000,000 VND',
      department: 'Student Services',
      sponsor: 'HSB Alumni Association'
    }
  ];

  const applications = [
    {
      id: 1,
      studentId: '22080000',
      studentName: 'Nguyễn Văn A',
      scholarshipName: 'Merit-Based Scholarship',
      amount: '10,000,000 VND',
      submittedDate: '2024-10-15',
      status: 'Under Review',
      gpa: 3.85,
      department: 'Academic Affairs',
      reviewer: 'Dr. Trần Thị B',
      documents: ['Transcript', 'Recommendation Letter', 'Personal Statement']
    },
    {
      id: 2,
      studentId: '22080001',
      studentName: 'Lê Thị C',
      scholarshipName: 'TechCorp Vietnam Scholarship',
      amount: '20,000,000 VND',
      submittedDate: '2024-10-18',
      status: 'Approved',
      gpa: 3.92,
      department: 'Academic Affairs',
      reviewer: 'Dr. Trần Thị B',
      approvedDate: '2024-10-22',
      documents: ['Transcript', 'Project Portfolio', 'Recommendation Letter']
    },
    {
      id: 3,
      studentId: '22080002',
      studentName: 'Phạm Văn D',
      scholarshipName: 'Commendation Scholarship',
      amount: '5,000,000 VND',
      submittedDate: '2024-10-12',
      status: 'Under Review',
      gpa: 3.45,
      department: 'Student Services',
      reviewer: 'Ms. Nguyễn Thị E',
      documents: ['Transcript', 'Community Service Certificate', 'Personal Statement']
    },
    {
      id: 4,
      studentId: '22080003',
      studentName: 'Hoàng Thị F',
      scholarshipName: 'VinGroup Talent Scholarship',
      amount: '25,000,000 VND',
      submittedDate: '2024-10-20',
      status: 'Pending Documents',
      gpa: 3.88,
      department: 'Academic Affairs',
      reviewer: 'Dr. Trần Thị B',
      documents: ['Transcript', 'Recommendation Letter']
    },
    {
      id: 5,
      studentId: '22080004',
      studentName: 'Đỗ Văn G',
      scholarshipName: 'HSB Alumni Scholarship',
      amount: '8,000,000 VND',
      submittedDate: '2024-10-19',
      status: 'Rejected',
      gpa: 3.12,
      department: 'Student Services',
      reviewer: 'Ms. Nguyễn Thị E',
      rejectedDate: '2024-10-23',
      rejectionReason: 'Does not meet minimum GPA requirement',
      documents: ['Transcript', 'Financial Need Statement']
    },
    {
      id: 6,
      studentId: '22080005',
      studentName: 'Vũ Thị H',
      scholarshipName: 'Merit-Based Scholarship',
      amount: '10,000,000 VND',
      submittedDate: '2024-10-21',
      status: 'Approved',
      gpa: 3.95,
      department: 'Academic Affairs',
      reviewer: 'Dr. Trần Thị B',
      approvedDate: '2024-10-24',
      documents: ['Transcript', 'Recommendation Letter', 'Research Publication']
    }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Approved': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Under Review': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Pending Documents': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
      case 'Active': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Closed': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
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
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(app.status)}`}>
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
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(app.status)}`}>
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
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(scholarship.status)}`}>
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
            <span>Digital Library</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Library: Thesis Management</span>
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

// This component uses Tailwind CSS utility classes
// Make sure Tailwind is configured in your project

// Types and Interfaces
interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  date: Date;
  status: "present" | "absent" | "late" | "excused";
  source: "ai-camera" | "manual" | "quiz" | "assignment";
  sessionType: "lecture" | "lab" | "tutorial" | "exam";
  timestamp?: Date;
  cameraId?: string;
  lecturerVerified?: boolean;
  notes?: string;
}

interface StudentAttendanceStats {
  studentId: string;
  studentName: string;
  department: string;
  year: number;
  totalSessions: number;
  attended: number;
  late: number;
  absent: number;
  excused: number;
  attendanceRate: number;
  trend: "improving" | "declining" | "stable";
  atRisk: boolean;
  eligibleForExam: boolean;
  quizBonus: number;
}

interface CourseAttendance {
  courseId: string;
  courseName: string;
  instructor: string;
  totalStudents: number;
  averageAttendance: number;
  sessionsHeld: number;
  atRiskStudents: number;
  trend: "up" | "down" | "stable";
}

interface AttendanceAlert {
  id: string;
  studentId: string;
  studentName: string;
  type: "below-threshold" | "declining-trend" | "consecutive-absence" | "exam-ineligible";
  severity: "critical" | "warning" | "info";
  message: string;
  date: Date;
  acknowledged: boolean;
  courseId?: string;
}

interface AICamera {
  id: string;
  location: string;
  status: "online" | "offline" | "maintenance";
  lastSync: Date;
  sessionsToday: number;
  accuracy: number;
}

// Sample Data Generator
const generateSampleAttendanceData = (): {
  records: AttendanceRecord[];
  students: StudentAttendanceStats[];
  courses: CourseAttendance[];
  alerts: AttendanceAlert[];
  cameras: AICamera[];
} => {
  const studentNames = [
    "Emma Wilson", "Liam Chen", "Sophia Rodriguez", "Noah Patel", "Olivia Kim",
    "Ethan Brown", "Ava Johnson", "Mason Lee", "Isabella Garcia", "Lucas Martinez",
    "Mia Anderson", "Oliver Taylor", "Charlotte Thomas", "Elijah Jackson", "Amelia White"
  ];

  const courses = [
    { id: "CS101", name: "Introduction to Programming", instructor: "Dr. Smith" },
    { id: "MATH201", name: "Calculus II", instructor: "Prof. Johnson" },
    { id: "PHYS301", name: "Quantum Mechanics", instructor: "Dr. Lee" },
    { id: "ENG102", name: "Technical Writing", instructor: "Prof. Davis" },
    { id: "CHEM105", name: "Organic Chemistry", instructor: "Dr. Wilson" }
  ];

  const departments = ["Computer Science", "Mathematics", "Physics", "Engineering", "Chemistry"];

  // Generate attendance records
  const records: AttendanceRecord[] = [];
  const now = new Date();
  
  for (let i = 0; i < 200; i++) {
    const daysAgo = Math.floor(Math.random() * 60);
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);
    
    records.push({
      id: `ATT-${1000 + i}`,
      studentId: `STU-${Math.floor(Math.random() * 15) + 1}`,
      studentName: studentNames[Math.floor(Math.random() * studentNames.length)],
      courseId: courses[Math.floor(Math.random() * courses.length)].id,
      courseName: courses[Math.floor(Math.random() * courses.length)].name,
      date: date,
      status: Math.random() > 0.15 ? "present" : Math.random() > 0.5 ? "late" : "absent",
      source: Math.random() > 0.3 ? "ai-camera" : Math.random() > 0.5 ? "quiz" : "manual",
      sessionType: ["lecture", "lab", "tutorial"][Math.floor(Math.random() * 3)] as any,
      timestamp: date,
      cameraId: Math.random() > 0.3 ? `CAM-${Math.floor(Math.random() * 5) + 1}` : undefined,
      lecturerVerified: Math.random() > 0.2
    });
  }

  // Generate student stats
  const students: StudentAttendanceStats[] = studentNames.map((name, idx) => {
    const totalSessions = 40 + Math.floor(Math.random() * 20);
    const attended = Math.floor(totalSessions * (0.6 + Math.random() * 0.35));
    const late = Math.floor((totalSessions - attended) * 0.3);
    const excused = Math.floor((totalSessions - attended - late) * 0.4);
    const absent = totalSessions - attended - late - excused;
    const attendanceRate = (attended / totalSessions) * 100;
    const quizBonus = Math.floor(Math.random() * 10);
    const finalRate = Math.min(attendanceRate + quizBonus, 100);

    return {
      studentId: `STU-${idx + 1}`,
      studentName: name,
      department: departments[Math.floor(Math.random() * departments.length)],
      year: Math.floor(Math.random() * 4) + 1,
      totalSessions,
      attended,
      late,
      absent,
      excused,
      attendanceRate: finalRate,
      trend: attendanceRate > 75 ? "stable" : attendanceRate > 60 ? "declining" : "declining",
      atRisk: finalRate < 70,
      eligibleForExam: finalRate >= 70,
      quizBonus
    };
  });

  // Generate course stats
  const courseStats: CourseAttendance[] = courses.map(course => {
    const avgAttendance = 65 + Math.random() * 30;
    return {
      courseId: course.id,
      courseName: course.name,
      instructor: course.instructor,
      totalStudents: 45 + Math.floor(Math.random() * 35),
      averageAttendance: avgAttendance,
      sessionsHeld: 35 + Math.floor(Math.random() * 15),
      atRiskStudents: Math.floor(Math.random() * 15),
      trend: avgAttendance > 80 ? "up" : avgAttendance > 65 ? "stable" : "down"
    };
  });

  // Generate alerts
  const alerts: AttendanceAlert[] = students
    .filter(s => s.atRisk || s.attendanceRate < 60)
    .map((s, idx) => ({
      id: `ALERT-${idx + 1}`,
      studentId: s.studentId,
      studentName: s.studentName,
      type: s.attendanceRate < 50 ? "exam-ineligible" : s.attendanceRate < 60 ? "below-threshold" : "declining-trend",
      severity: s.attendanceRate < 50 ? "critical" : s.attendanceRate < 60 ? "warning" : "info",
      message: s.attendanceRate < 50 
        ? `Critical: ${s.studentName} is ineligible for final exam (${s.attendanceRate.toFixed(1)}% attendance)`
        : s.attendanceRate < 60
        ? `Warning: ${s.studentName} is at risk of failing attendance requirement (${s.attendanceRate.toFixed(1)}%)`
        : `Notice: ${s.studentName} showing declining attendance trend`,
      date: new Date(),
      acknowledged: Math.random() > 0.5,
      courseId: courses[Math.floor(Math.random() * courses.length)].id
    }));

  // Generate camera data
  const cameras: AICamera[] = Array.from({ length: 5 }, (_, i) => ({
    id: `CAM-${i + 1}`,
    location: [`Lecture Hall A`, `Lab Building 2`, `Tutorial Room 3B`, `Main Auditorium`, `Computer Lab 5`][i],
    status: Math.random() > 0.1 ? "online" : "offline",
    lastSync: new Date(Date.now() - Math.random() * 3600000),
    sessionsToday: Math.floor(Math.random() * 12),
    accuracy: 85 + Math.random() * 13
  }));

  return { records, students, courses: courseStats, alerts, cameras };
};

// Main Attendance Component
const Attendance: React.FC = () => {
  const [data] = useState(generateSampleAttendanceData());
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
  data: ReturnType<typeof generateSampleAttendanceData>;
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
            <p className="text-gray-600">{student.studentId} • {student.department} • Year {student.year}</p>
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



const ResearchManagement = () => {
  const [activeView, setActiveView] = useState('overview');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);



  const OverviewDashboard = () => (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">Total Projects</p>
          <p className="text-3xl font-bold text-gray-900">42</p>
          <p className="text-xs text-green-600 mt-2">↑ 15% vs last year</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">Total Publications</p>
          <p className="text-3xl font-bold text-gray-900">156</p>
          <p className="text-xs text-green-600 mt-2">↑ 22% vs last year</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">Total Funding</p>
          <p className="text-3xl font-bold text-gray-900">$8.5M</p>
          <p className="text-xs text-gray-600 mt-2">Active grants</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">Avg Citations</p>
          <p className="text-3xl font-bold text-gray-900">38.2</p>
          <p className="text-xs text-gray-600 mt-2">Per publication</p>
        </div>
      </div>

    

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Active Projects by Faculty</h3>
          <div className="space-y-4">
            {[
              {dept: 'Faculty of Nontraditional Security', count: 18, percentage: 43},
              {dept: 'Faculty of Management', count: 12, percentage: 29},
              {dept: 'Faculty of Marketing and Communication', count: 8, percentage: 19},
              {dept: 'Other Faculties', count: 4, percentage: 9}
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{item.dept}</span>
                  <span className="text-sm font-semibold text-gray-900">{item.count} projects</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="h-2 rounded-full bg-blue-500" style={{width: `${item.percentage}%`}}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Publication Types</h3>
          <div className="space-y-4">
            {[
              {type: 'Journal Articles', count: 92, percentage: 59},
              {type: 'Conference Papers', count: 38, percentage: 24},
              {type: 'Book Chapters', count: 18, percentage: 12},
              {type: 'Patents', count: 8, percentage: 5}
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{item.type}</span>
                  <span className="text-sm font-semibold text-gray-900">{item.count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="h-2 rounded-full bg-green-500" style={{width: `${item.percentage}%`}}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Researchers</h3>
          <div className="space-y-4">
            {[
              {name: 'Dr. Nguyen Van A', publications: 24, citations: 892},
              {name: 'Dr. Vo Thi F', publications: 18, citations: 756},
              {name: 'Dr. Pham Thi D', publications: 16, citations: 634}
            ].map((researcher, i) => (
              <div key={i} className="flex items-start gap-3 pb-3 border-b last:border-b-0">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">{researcher.name}</p>
                  <div className="flex gap-3 mt-1">
                    <span className="text-xs text-gray-600">{researcher.publications} pubs</span>
                    <span className="text-xs text-gray-600">{researcher.citations} citations</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Funding Sources</h3>
          <div className="space-y-3">
            {[
              {source: 'Nafosted', amount: '$3.2M', percentage: 38},
              {source: 'Ministry of Education', amount: '$2.8M', percentage: 33},
              {source: 'Ministry of Science and Technology', amount: '$1.5M', percentage: 18},
              {source: 'VNU', amount: '$1.0M', percentage: 11}
            ].map((item, i) => (
              <div key={i} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{item.source}</span>
                  <span className="text-sm font-bold text-gray-900">{item.amount}</span>
                </div>
                <div className="w-full bg-gray-300 rounded-full h-1.5">
                  <div className="h-1.5 rounded-full bg-blue-600" style={{width: `${item.percentage}%`}}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Publications by Discipline</h3>
          <div className="space-y-3">
            {[
              {discipline: 'Nontraditional Security', count: 42, color: 'blue'},
              {discipline: 'Sustainable Development', count: 28, color: 'green'},
              {discipline: 'Engineering & IT', count: 24, color: 'purple'},
              {discipline: 'Human Resources', count: 18, color: 'green'},
              {discipline: 'Finance', count: 16, color: 'green'},
              {discipline: 'Marketing', count: 14, color: 'green'},
              {discipline: 'Communication', count: 10, color: 'green'},
              {discipline: 'Law & Criminology', count: 4, color: 'blue'}
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full bg-${item.color}-500`}></div>
                  <span className="text-xs text-gray-700">{item.discipline}</span>
                </div>
                <span className="text-xs font-bold text-gray-900">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const ProjectsView = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mt-3">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All Types</option>
                <option value="applied">Applied Research</option>
                <option value="basic">Basic Research</option>
              </select>
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Plus size={18} />
              New Project
            </button>
          </div>
        </div>
          <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            
            <div className="text-right">
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">International</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">Erasmus, EU, International grant</p>
          <p className="text-3xl font-bold text-gray-900">6</p>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-600">20% of total projects</p>
            <p className="text-xs text-green-600 mt-1">↑ 10% vs last year</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            
            <div className="text-right">
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">National level</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">Ministry, Nafosted, National Funding</p>
          <p className="text-3xl font-bold text-gray-900">6</p>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-600">20% of total projects</p>
            <p className="text-xs text-green-600 mt-1">↑ 10% vs last year</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
           
            <div className="text-right">
              <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded">VNU</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">VNU projects, grants</p>
          <p className="text-3xl font-bold text-gray-900">12</p>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-600">40% of total projects</p>
            <p className="text-xs text-blue-600 mt-1">↑ 5% vs last year</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            
            <div className="text-right">
              <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded">HSB</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">HSB Projects / Company sponsored</p>
          <p className="text-3xl font-bold text-gray-900">3</p>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-600">20% of total projects</p>
            <p className="text-xs text-orange-600 mt-1">Action needed</p>
          </div>
        </div>
      </div>
        <div className="p-6 grid grid-cols-1 gap-4">
          {researchProjects.map((project) => (
            <div key={project.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{project.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1.5">
                        <Users size={16} />
                        PI: {project.pi}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Building size={16} />
                        {project.department}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar size={16} />
                        {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Funding</p>
                    <p className="text-lg font-bold text-gray-900">{project.funding}</p>
                    <p className="text-xs text-gray-500">{project.fundingSource}</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Progress</p>
                    <p className="text-lg font-bold text-gray-900">{project.progress}%</p>
                    <div className="w-full bg-gray-300 rounded-full h-1.5 mt-2">
                      <div className="h-1.5 rounded-full bg-green-600" style={{width: `${project.progress}%`}}></div>
                    </div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Publications</p>
                    <p className="text-lg font-bold text-gray-900">{project.publications}</p>
                    <p className="text-xs text-gray-500">Published</p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Team Size</p>
                    <p className="text-lg font-bold text-gray-900">{project.coInvestigators.length + 1}</p>
                    <p className="text-xs text-gray-500">Researchers</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setSelectedItem({type: 'project', data: project})}
                    className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 text-sm font-medium"
                  >
                    View Details
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium">
                    Edit
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium">
                    Generate Report
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const PublicationsView = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search publications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All Types</option>
                <option value="journal">Journal Article</option>
                <option value="conference">Conference Paper</option>
                <option value="book">Book Chapter</option>
                <option value="book">Book</option>

              </select>
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="review">Under Review</option>
              </select>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Plus size={18} />
              Add Publication
            </button>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">Scopus</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">Scopus Indexed</p>
          <p className="text-3xl font-bold text-gray-900">92</p>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-600">59% of total publications</p>
            <p className="text-xs text-green-600 mt-1">↑ 18 vs last year</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">WoS</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">Web of Science</p>
          <p className="text-3xl font-bold text-gray-900">68</p>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-600">44% of total publications</p>
            <p className="text-xs text-green-600 mt-1">↑ 14 vs last year</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded">DOI</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">With DOI</p>
          <p className="text-3xl font-bold text-gray-900">142</p>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-600">91% of total publications</p>
            <p className="text-xs text-blue-600 mt-1">Well documented</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-orange-600" />
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded">No DOI</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">Without DOI</p>
          <p className="text-3xl font-bold text-gray-900">14</p>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-600">9% of total publications</p>
            <p className="text-xs text-orange-600 mt-1">Action needed</p>
          </div>
        </div>
      </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Authors</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Journal/Venue</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Discipline</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Year</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Citations</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Impact</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {publications.map((pub) => (
                <tr key={pub.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-sm text-gray-900 max-w-xs">{pub.title}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">
                      {pub.authors.slice(0, 2).join(', ')}
                      {pub.authors.length > 2 && ` +${pub.authors.length - 2}`}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      {pub.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{pub.journal}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDisciplineColor(pub.discipline)}`}>
                      {pub.discipline}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{pub.year}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{pub.citations}</td>
                  <td className="px-6 py-4">
                    {pub.impactFactor ? (
                      <div className="text-sm">
                        <p className="font-semibold text-gray-900">{pub.impactFactor}</p>
                        <p className="text-xs text-gray-500">{pub.quartile}</p>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">N/A</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(pub.status)}`}>
                      {pub.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => setSelectedItem({type: 'publication', data: pub})}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View
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

  
  const filteredPatents = patentData.filter(patent => {
    const matchesSearch = patent.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || patent.status === filterStatus;
    const matchesType = filterType === 'all' || patent.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });
  const PatentsView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
            <Award className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-sm text-gray-500 mb-1">Total Patents</p>
          <p className="text-3xl font-bold text-gray-900">8</p>
          <p className="text-xs text-green-600 mt-2">↑ 3 vs last year</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
            <Award className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-sm text-gray-500 mb-1">Granted Patents</p>
          <p className="text-3xl font-bold text-gray-900">3</p>
          <p className="text-xs text-green-600 mt-2">37.5% success rate</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-3">
            <FileText className="w-6 h-6 text-yellow-600" />
          </div>
          <p className="text-sm text-gray-500 mb-1">Pending/Under Review</p>
          <p className="text-3xl font-bold text-gray-900">4</p>
          <p className="text-xs text-yellow-600 mt-2">Awaiting decision</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
            <TrendingUp className="w-6 h-6 text-purple-600" />
          </div>
          <p className="text-sm text-gray-500 mb-1">International Patents</p>
          <p className="text-3xl font-bold text-gray-900">2</p>
          <p className="text-xs text-purple-600 mt-2">PCT & US</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search patents by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="Granted">Granted</option>
              <option value="Pending">Pending</option>
              <option value="Under Examination">Under Examination</option>
              <option value="International">International</option>
            </select>

            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="Invention Patent">Invention Patent</option>
              <option value="Utility Model">Utility Model</option>
            </select>

            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 whitespace-nowrap">
              <Plus size={18} />
              New Patent
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {filteredPatents.map((patent) => (
            <div key={patent.id} className={`border-2 rounded-xl p-6 hover:shadow-lg transition-shadow ${getStatusColor(patent.status)}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{patent.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(patent.status)}`}>
                      {patent.status}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDisciplineColor(patent.discipline)}`}>
                      {patent.discipline}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{patent.abstract}</p>
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1.5">
                      <Users size={16} />
                      {patent.inventors.length} inventors
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Building size={16} />
                      {patent.faculty}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar size={16} />
                      {new Date(patent.applicationDate).toLocaleDateString()}
                    </span>
                    <span className="font-medium">
                      {patent.country}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3 mb-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Type</p>
                  <p className="text-sm font-bold text-gray-900">{patent.type}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Country</p>
                  <p className="text-sm font-bold text-gray-900">{patent.country}</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Application No.</p>
                  <p className="text-sm font-mono text-gray-900">{patent.applicationNumber}</p>
                </div>
                {patent.patentNumber ? (
                  <div className="p-3 bg-green-100 rounded-lg border border-green-300">
                    <p className="text-xs text-gray-600 mb-1">Patent No.</p>
                    <p className="text-sm font-mono font-bold text-green-700">{patent.patentNumber}</p>
                  </div>
                ) : (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Patent No.</p>
                    <p className="text-sm text-gray-400">Pending</p>
                  </div>
                )}
              </div>

              <button 
                onClick={() => setSelectedItem({type: 'patent', data: patent})}
                className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 text-sm font-medium"
              >
                View Details
              </button>
            </div>
          ))}
          {filteredPatents.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No patents found matching your criteria
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Patents by Faculty</h3>
          <div className="space-y-4">
            {[
              { name: 'Nontraditional Security', count: 4, percent: 50 },
              { name: 'Management', count: 2, percent: 25 },
              { name: 'Marketing & Communication', count: 1, percent: 12.5 },
              { name: 'Others', count: 1, percent: 12.5 }
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{item.name}</span>
                  <span className="text-sm font-semibold text-gray-900">{item.count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="h-2 rounded-full bg-blue-500" style={{width: `${item.percent}%`}}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Patents by Discipline</h3>
          <div className="space-y-3">
            {[
              { discipline: 'Nontraditional Security', count: 2, color: 'blue' },
              { discipline: 'Engineering & IT', count: 1, color: 'purple' },
              { discipline: 'Sustainable Development', count: 2, color: 'green' },
              { discipline: 'Finance', count: 1, color: 'red' },
              { discipline: 'Marketing', count: 1, color: 'pink' },
              { discipline: 'Human Resources', count: 1, color: 'orange' }
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full bg-${item.color}-500`}></div>
                  <span className="text-sm text-gray-700">{item.discipline}</span>
                </div>
                <span className="text-sm font-bold text-gray-900">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Patent Status Overview</h3>
          <div className="space-y-3">
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Granted</span>
                <span className="text-2xl font-bold text-green-700">3</span>
              </div>
            </div>
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Pending</span>
                <span className="text-2xl font-bold text-yellow-700">3</span>
              </div>
            </div>
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Under Examination</span>
                <span className="text-2xl font-bold text-orange-700">1</span>
              </div>
            </div>
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">International</span>
                <span className="text-2xl font-bold text-purple-700">1</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );


  return (
    <div className="min-h-screen bg-gray-50 p-3">
      <div className="max-w mx-auto space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Research Management</h1>
            <p className="text-sm text-gray-500 mt-1">Manage faculty projects, publications, and research output</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="border-b border-gray-200">
            <div className="flex gap-1 p-2">
              <button
                onClick={() => setActiveView('overview')}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeView === 'overview' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveView('projects')}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeView === 'projects' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Projects
              </button>
              <button
                onClick={() => setActiveView('publications')}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeView === 'publications' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Publications
              </button>
              <button
                onClick={() => setActiveView('patents')}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeView === 'patents' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Patents
              </button>
            </div>
          </div>
        </div>

        {activeView === 'overview' && <OverviewDashboard />}
        {activeView === 'projects' && <ProjectsView />}
        {activeView === 'publications' && <PublicationsView />}
        {activeView === 'patents' && <PatentsView />}

        {selectedItem && selectedItem.type === 'project' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedItem(null)}>
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="h-32 bg-gradient-to-br from-blue-400 to-blue-600 p-6 flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div className="flex gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-white bg-opacity-20 text-white">
                      {selectedItem.data.type}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedItem.data.status)}`}>
                      {selectedItem.data.status}
                    </span>
                  </div>
                  <button 
                    onClick={() => setSelectedItem(null)}
                    className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg text-white"
                  >
                    ✕
                  </button>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedItem.data.title}</h2>
                  <p className="text-white text-opacity-90 text-sm mt-1">{selectedItem.data.pi}</p>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Project Description</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{selectedItem.data.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <Calendar size={18} />
                      <span className="text-xs font-semibold uppercase">Duration</span>
                    </div>
                    <p className="font-semibold text-gray-900 text-sm">
                      {new Date(selectedItem.data.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - {new Date(selectedItem.data.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <DollarSign size={18} />
                      <span className="text-xs font-semibold uppercase">Funding</span>
                    </div>
                    <p className="font-semibold text-gray-900">{selectedItem.data.funding}</p>
                    <p className="text-xs text-gray-600 mt-1">{selectedItem.data.fundingSource}</p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <Building size={18} />
                      <span className="text-xs font-semibold uppercase">Department</span>
                    </div>
                    <p className="font-semibold text-gray-900">{selectedItem.data.department}</p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <Users size={18} />
                      <span className="text-xs font-semibold uppercase">Team Size</span>
                    </div>
                    <p className="font-semibold text-gray-900">{selectedItem.data.coInvestigators.length + 1} researchers</p>
                  </div>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Project Progress</h4>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Overall Completion</span>
                    <span className="text-lg font-bold text-gray-900">{selectedItem.data.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div 
                      className="h-3 rounded-full bg-blue-500"
                      style={{width: `${selectedItem.data.progress}%`}}
                    ></div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Research Team</h4>
                  <div className="space-y-2">
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm font-semibold text-gray-900">{selectedItem.data.pi}</p>
                      <p className="text-xs text-gray-600">Principal Investigator</p>
                    </div>
                    {selectedItem.data.coInvestigators.map((investigator, i) => (
                      <div key={i} className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-semibold text-gray-900">{investigator}</p>
                        <p className="text-xs text-gray-600">Co-Investigator</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                    Edit Project
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
                    View Publications
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
                    Generate Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedItem && selectedItem.type === 'publication' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedItem(null)}>
            <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="h-32 bg-gradient-to-br from-green-400 to-green-600 p-6 flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div className="flex gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-white bg-opacity-20 text-white">
                      {selectedItem.data.type}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedItem.data.status)}`}>
                      {selectedItem.data.status}
                    </span>
                  </div>
                  <button 
                    onClick={() => setSelectedItem(null)}
                    className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg text-white"
                  >
                    ✕
                  </button>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedItem.data.title}</h2>
                  <p className="text-white text-opacity-90 text-sm mt-1">{selectedItem.data.year}</p>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Authors</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.data.authors.map((author, i) => (
                      <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                        {author}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                  <p className="text-xs font-semibold text-gray-600 mb-1">Discipline</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getDisciplineColor(selectedItem.data.discipline)}`}>
                    {selectedItem.data.discipline}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <FileText size={18} />
                      <span className="text-xs font-semibold uppercase">Journal/Venue</span>
                    </div>
                    <p className="font-semibold text-gray-900 text-sm">{selectedItem.data.journal}</p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <Calendar size={18} />
                      <span className="text-xs font-semibold uppercase">Publication Year</span>
                    </div>
                    <p className="font-semibold text-gray-900">{selectedItem.data.year}</p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <TrendingUp size={18} />
                      <span className="text-xs font-semibold uppercase">Citations</span>
                    </div>
                    <p className="font-semibold text-gray-900">{selectedItem.data.citations}</p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <Award size={18} />
                      <span className="text-xs font-semibold uppercase">Impact Factor</span>
                    </div>
                    <p className="font-semibold text-gray-900">
                      {selectedItem.data.impactFactor || 'N/A'}
                      {selectedItem.data.quartile && selectedItem.data.quartile !== 'N/A' && (
                        <span className="text-xs text-gray-600 ml-2">({selectedItem.data.quartile})</span>
                      )}
                    </p>
                  </div>
                </div>

                {selectedItem.data.doi && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs font-semibold text-gray-600 mb-1">DOI</p>
                    <p className="text-sm font-mono text-blue-600">{selectedItem.data.doi}</p>
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
                    Edit Publication
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
                    View Full Text
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
                    Export Citation
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

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
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

    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 col-span-2">
    <h3 className="text-lg font-semibold text-gray-900 mb-6">
      Usage Trends (Last 6 Months)
    </h3>

    <div className="h-64 flex items-end justify-between gap-3">
      {[
        { month: 'May', offline: 920,  online: 38000 },
        { month: 'Jun', offline: 1050, online: 41000 },
        { month: 'Jul', offline: 980,  online: 39500 },
        { month: 'Aug', offline: 1120, online: 43000 },
        { month: 'Sep', offline: 1180, online: 45500 },
        { month: 'Oct', offline: 1247, online: 48392 },
      ].map((data, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-2">
          {/* Both bars share the same height context */}
          <div className="w-full h-48 flex gap-1 items-end">
            <div
              className="flex-1 bg-blue-500 rounded-t hover:bg-blue-600 cursor-pointer transition-colors"
              style={{ height: `${(data.offline / 1500) * 100}%` }}
              title={`Offline: ${data.offline}`}
            />
            <div
              className="flex-1 bg-green-500 rounded-t hover:bg-green-600 cursor-pointer transition-colors"
              style={{ height: `${(data.online / 50000) * 100}%` }}
              title={`Online: ${data.online}`}
            />
          </div>
          <span className="text-xs text-gray-500">{data.month}</span>
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
              {title: 'FONS Fundamentals', type: 'Textbook', accesses: 643},
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

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-3">
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



// Types
type ThesisType = 'thesis' | 'dissertation' | 'final_project';
type DegreeLevel = 'bachelor' | 'master' | 'phd';

interface ThesisArchive {
  id: string;
  title: string;
  author: string;
  studentId: string;
  supervisor: string;
  coSupervisor?: string;
  department: string;
  degreeLevel: DegreeLevel;
  thesisType: ThesisType;
  submissionDate: string;
  approvalDate: string;
  defenseDate: string;
  archiveDate: string;
  abstract: string;
  keywords: string[];
  pages: number;
  fileUrl: string;
  fileSize: string;
  doi?: string;
  citations: number;
  views: number;
  rating: number;
  language: string;
  isPlagiarismChecked: boolean;
  plagiarismScore: number;
  isPublished: boolean;
  embargoUntil?: string;
}

interface ThesisFilterOptions {
  thesisType: ThesisType | 'all';
  degreeLevel: DegreeLevel | 'all';
  department: string;
  yearFrom: string;
  yearTo: string;
  language: string;
  isPublished: string;
}

const ThesisStorage: React.FC = () => {
  // Sample data
  const initialTheses: ThesisArchive[] = [
    {
      id: 'THS-2024-001',
      title: 'Deep Learning Approaches for Natural Language Processing in Healthcare',
      author: 'John Smith',
      studentId: 'STD-2020-145',
      supervisor: 'Dr. Sarah Johnson',
      coSupervisor: 'Dr. Michael Chen',
      department: 'Computer Science',
      degreeLevel: 'phd',
      thesisType: 'dissertation',
      submissionDate: '2024-06-15',
      approvalDate: '2024-07-20',
      defenseDate: '2024-07-10',
      archiveDate: '2024-07-25',
      abstract: 'This dissertation explores advanced deep learning techniques for processing medical texts...',
      keywords: ['Deep Learning', 'NLP', 'Healthcare', 'Machine Learning', 'Medical Informatics'],
      pages: 245,
      fileUrl: '/storage/thesis/THS-2024-001.pdf',
      fileSize: '15.2 MB',
      doi: '10.1234/hsb.2024.001',
      citations: 12,
      views: 345,
      rating: 4.8,
      language: 'English',
      isPlagiarismChecked: true,
      plagiarismScore: 3.2,
      isPublished: true
    },
    {
      id: 'THS-2024-002',
      title: 'Sustainable Urban Planning: A Case Study of Smart Cities',
      author: 'Emma Davis',
      studentId: 'STD-2021-089',
      supervisor: 'Prof. Robert Wilson',
      department: 'Architecture',
      degreeLevel: 'master',
      thesisType: 'thesis',
      submissionDate: '2024-08-20',
      approvalDate: '2024-09-15',
      defenseDate: '2024-09-05',
      archiveDate: '2024-09-20',
      abstract: 'This research examines sustainable urban planning strategies in modern smart cities...',
      keywords: ['Urban Planning', 'Sustainability', 'Smart Cities', 'Architecture'],
      pages: 156,
      fileUrl: '/storage/thesis/THS-2024-002.pdf',
      fileSize: '8.7 MB',
      citations: 5,
      views: 178,
      rating: 4.5,
      language: 'English',
      isPlagiarismChecked: true,
      plagiarismScore: 4.1,
      isPublished: true
    },
    {
      id: 'THS-2024-003',
      title: 'E-Commerce Platform Development Using Microservices Architecture',
      author: 'Michael Brown',
      studentId: 'STD-2020-234',
      supervisor: 'Dr. Lisa Anderson',
      department: 'Information Technology',
      degreeLevel: 'bachelor',
      thesisType: 'final_project',
      submissionDate: '2024-09-01',
      approvalDate: '2024-09-25',
      defenseDate: '2024-09-20',
      archiveDate: '2024-09-28',
      abstract: 'This project implements a scalable e-commerce platform using microservices...',
      keywords: ['Microservices', 'E-Commerce', 'Software Architecture', 'Cloud Computing'],
      pages: 98,
      fileUrl: '/storage/thesis/THS-2024-003.pdf',
      fileSize: '5.4 MB',
      citations: 0,
      views: 45,
      rating: 4.2,
      language: 'English',
      isPlagiarismChecked: true,
      plagiarismScore: 5.8,
      isPublished: false
    },
    {
      id: 'THS-2024-004',
      title: 'Renewable Energy Integration in Industrial Manufacturing',
      author: 'Sarah Williams',
      studentId: 'STD-2019-167',
      supervisor: 'Prof. David Martinez',
      coSupervisor: 'Dr. Emily Taylor',
      department: 'Mechanical Engineering',
      degreeLevel: 'phd',
      thesisType: 'dissertation',
      submissionDate: '2024-05-10',
      approvalDate: '2024-06-25',
      defenseDate: '2024-06-15',
      archiveDate: '2024-06-30',
      abstract: 'This research investigates the integration of renewable energy sources in manufacturing...',
      keywords: ['Renewable Energy', 'Manufacturing', 'Sustainability', 'Engineering'],
      pages: 312,
      fileUrl: '/storage/thesis/THS-2024-004.pdf',
      fileSize: '22.1 MB',
      citations: 18,
      views: 567,
      rating: 4.9,
      language: 'English',
      isPlagiarismChecked: true,
      plagiarismScore: 2.1,
      isPublished: true
    },
    {
      id: 'THS-2023-045',
      title: 'Artificial Intelligence in Financial Forecasting',
      author: 'James Johnson',
      studentId: 'STD-2020-312',
      supervisor: 'Dr. Patricia Lee',
      department: 'Business Administration',
      degreeLevel: 'master',
      thesisType: 'thesis',
      submissionDate: '2023-12-15',
      approvalDate: '2024-01-20',
      defenseDate: '2024-01-10',
      archiveDate: '2024-01-25',
      abstract: 'This thesis explores AI applications in predicting financial market trends...',
      keywords: ['AI', 'Finance', 'Forecasting', 'Machine Learning', 'Economics'],
      pages: 189,
      fileUrl: '/storage/thesis/THS-2023-045.pdf',
      fileSize: '11.3 MB',
      citations: 23,
      views: 892,
      rating: 4.7,
      language: 'English',
      isPlagiarismChecked: true,
      plagiarismScore: 3.5,
      isPublished: true
    }
  ];

  const [theses, setTheses] = useState<ThesisArchive[]>(initialTheses);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedThesis, setSelectedThesis] = useState<ThesisArchive | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
const [filters, setFilters] = useState<ThesisFilterOptions>({
  thesisType: 'all',
  degreeLevel: 'all',
  department: 'all',
  yearFrom: '',
  yearTo: '',
  language: 'all',
  isPublished: 'all'  // Keep this for ThesisStorage
});

  // Statistics
  const statistics = useMemo(() => {
    const total = theses.length;
    const thisYear = theses.filter(t => 
      new Date(t.archiveDate).getFullYear() === new Date().getFullYear()
    ).length;
    const published = theses.filter(t => t.isPublished).length;
    const totalviews = theses.reduce((sum, t) => sum + t.views, 0);
    const avgRating = theses.reduce((sum, t) => sum + t.rating, 0) / total;
    const totalCitations = theses.reduce((sum, t) => sum + t.citations, 0);

    return {
      total,
      published,
      thisYear,
      totalviews,
      totalCitations,
      avgRating: avgRating.toFixed(1)
    };
  }, [theses]);

  // Filtered theses
  const filteredTheses = useMemo(() => {
    return theses.filter(thesis => {
      const matchesSearch = 
        thesis.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        thesis.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        thesis.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase())) ||
        thesis.supervisor.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = filters.thesisType === 'all' || thesis.thesisType === filters.thesisType;
      const matchesDegree = filters.degreeLevel === 'all' || thesis.degreeLevel === filters.degreeLevel;
      const matchesDept = filters.department === 'all' || thesis.department === filters.department;
      const matchesLanguage = filters.language === 'all' || thesis.language === filters.language;
      const matchesPublished = filters.isPublished === 'all' || 
        (filters.isPublished === 'published' && thesis.isPublished) ||
        (filters.isPublished === 'unpublished' && !thesis.isPublished);

      const thesisYear = new Date(thesis.archiveDate).getFullYear();
      const matchesYearFrom = !filters.yearFrom || thesisYear >= parseInt(filters.yearFrom);
      const matchesYearTo = !filters.yearTo || thesisYear <= parseInt(filters.yearTo);

      return matchesSearch && matchesType && matchesDegree && 
             matchesDept && matchesLanguage && matchesPublished && 
             matchesYearFrom && matchesYearTo;
    });
  }, [theses, searchTerm, filters]);

  // Helper functions
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const departments = useMemo(() => {
    const depts = new Set(theses.map(t => t.department));
    return ['all', ...Array.from(depts)];
  }, [theses]);

  const handleViewDetail = (thesis: ThesisArchive) => {
    setSelectedThesis(thesis);
    setShowDetailModal(true);
  };

  const handleDownload = (thesis: ThesisArchive) => {
    console.log('Downloading:', thesis.title);
    // In real app: window.open(thesis.fileUrl, '_blank');
  };

  return (
    <div className="p-3 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Thesis Storage</h1>
            <p className="text-gray-600 mt-1">
              Completed thesis, dissertations, and final project reports repository
            </p>
          </div>
          <button 
            onClick={() => setShowUploadModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
          >
            <Upload className="w-4 h-4" />
            Upload Thesis
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-3">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
              <Archive className="w-4 h-4" />
              Total Archived
            </div>
            <div className="text-2xl font-bold text-gray-900">{statistics.total}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 text-green-600 text-sm mb-1">
              <CheckCircle className="w-4 h-4" />
              Published
            </div>
            <div className="text-2xl font-bold text-green-600">{statistics.published}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 text-blue-600 text-sm mb-1">
              <Calendar className="w-4 h-4" />
              This Year
            </div>
            <div className="text-2xl font-bold text-blue-600">{statistics.thisYear}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 text-purple-600 text-sm mb-1">
              <Eye className="w-4 h-4" />
              Views
            </div>
            <div className="text-2xl font-bold text-purple-600">{statistics.totalviews}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 text-orange-600 text-sm mb-1">
              <BookOpen className="w-4 h-4" />
              Citations
            </div>
            <div className="text-2xl font-bold text-orange-600">{statistics.totalCitations}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 text-yellow-600 text-sm mb-1">
              <Star className="w-4 h-4" />
              Avg Rating
            </div>
            <div className="text-2xl font-bold text-yellow-600">{statistics.avgRating}</div>
          </div>
        </div>

        {/* Search and Controls */}
        <div className="bg-white p-3 rounded-lg shadow-sm">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by title, author, keywords, or supervisor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${
                  showFilters ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
              <div className="flex bg-gray-200 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow' : ''}`}
                >
                  <ListIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow' : ''}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={filters.thesisType}
                    onChange={(e) => setFilters({...filters, thesisType: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Types</option>
                    <option value="thesis">Thesis</option>
                    <option value="dissertation">Dissertation</option>
                    <option value="final_project">Final Project</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                  <select
                    value={filters.degreeLevel}
                    onChange={(e) => setFilters({...filters, degreeLevel: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Degrees</option>
                    <option value="bachelor">Bachelor</option>
                    <option value="master">Master</option>
                    <option value="phd">PhD</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <select
                    value={filters.department}
                    onChange={(e) => setFilters({...filters, department: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {departments.map(dept => (
                      <option key={dept} value={dept}>
                        {dept === 'all' ? 'All Departments' : dept}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year From</label>
                  <input
                    type="number"
                    placeholder="2020"
                    value={filters.yearFrom}
                    onChange={(e) => setFilters({...filters, yearFrom: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year To</label>
                  <input
                    type="number"
                    placeholder="2024"
                    value={filters.yearTo}
                    onChange={(e) => setFilters({...filters, yearTo: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                  <select
                    value={filters.language}
                    onChange={(e) => setFilters({...filters, language: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Languages</option>
                    <option value="English">English</option>
                    <option value="Indonesian">Indonesian</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Published</label>
                  <select
                    value={filters.isPublished}
                    onChange={(e) => setFilters({...filters, isPublished: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All</option>
                    <option value="published">Published</option>
                    <option value="unpublished">Unpublished</option>
                  </select>
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => setFilters({
                    thesisType: 'all',
                    degreeLevel: 'all',
                    department: 'all',
                    yearFrom: '',
                    yearTo: '',
                    language: 'all',
                    isPublished: 'all'
                  })}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-3 text-sm text-gray-600">
        Showing {filteredTheses.length} of {theses.length} theses
      </div>

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-3">
          {filteredTheses.map((thesis) => (
            <div key={thesis.id} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <FileText className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{thesis.title}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {thesis.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <GraduationCap className="w-4 h-4" />
                          {thesis.supervisor}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(thesis.submissionDate)}
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          {thesis.pages} pages
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {thesis.thesisType.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                          {thesis.degreeLevel.toUpperCase()}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                          {thesis.department}
                        </span>
                        {thesis.isPublished && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Published
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {thesis.keywords.slice(0, 5).map((keyword, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-50 text-gray-600 rounded text-xs border border-gray-200">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => handleViewDetail(thesis)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    title="View Details"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDownload(thesis)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                    title="Download"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-600 pt-3 border-t border-gray-100">
                <span className="flex items-center gap-1">
                  <Download className="w-4 h-4" />
                  {thesis.views} views
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  {thesis.rating.toFixed(1)} rating
                </span>
                {thesis.isPlagiarismChecked && (
                  <span className="flex items-center gap-1">
                    <FileCheck className="w-4 h-4 text-green-600" />
                    Plagiarism: {thesis.plagiarismScore}%
                  </span>
                )}
                <span className="flex items-center gap-1">
                  {thesis.fileSize}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTheses.map((thesis) => (
            <div key={thesis.id} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition">
              <div className="flex items-start justify-between mb-3">
                <FileText className="w-8 h-8 text-blue-600 flex-shrink-0" />
                {thesis.isPublished && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Published
                  </span>
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{thesis.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{thesis.author}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  {thesis.degreeLevel.toUpperCase()}
                </span>
                <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                  {thesis.department}
                </span>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <span className="flex items-center gap-1">
                    <Download className="w-3 h-3" />
                    {thesis.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    {thesis.rating}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewDetail(thesis)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDownload(thesis)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded transition"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredTheses.length === 0 && (
        <div className="bg-white p-12 rounded-lg shadow-sm text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No theses found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setFilters({
                // Remove this line: status: 'all',
                thesisType: 'all',
                degreeLevel: 'all',
                department: 'all',
                yearFrom: '',
                yearTo: '',
                language: 'all',
                isPublished: 'all'  // Add this line if it's missing
              });
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedThesis && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Thesis Details</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <div className="flex items-start gap-2 mb-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {selectedThesis.thesisType.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                    {selectedThesis.degreeLevel.toUpperCase()}
                  </span>
                  {selectedThesis.isPublished && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Published
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{selectedThesis.title}</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Author</div>
                    <div className="font-medium">{selectedThesis.author}</div>
                    <div className="text-sm text-gray-600">ID: {selectedThesis.studentId}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Supervisor</div>
                    <div className="font-medium">{selectedThesis.supervisor}</div>
                    {selectedThesis.coSupervisor && (
                      <div className="text-sm text-gray-600">Co-supervisor: {selectedThesis.coSupervisor}</div>
                    )}
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Department</div>
                    <div className="font-medium">{selectedThesis.department}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Submission Date</div>
                    <div className="font-medium">{formatDate(selectedThesis.submissionDate)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Defense Date</div>
                    <div className="font-medium">{formatDate(selectedThesis.defenseDate)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Approval Date</div>
                    <div className="font-medium">{formatDate(selectedThesis.approvalDate)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Archive Date</div>
                    <div className="font-medium">{formatDate(selectedThesis.archiveDate)}</div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Abstract</h4>
                  <p className="text-gray-700">{selectedThesis.abstract}</p>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedThesis.keywords.map((keyword, idx) => (
                      <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Pages</div>
                    <div className="text-2xl font-bold">{selectedThesis.pages}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">File Size</div>
                    <div className="text-2xl font-bold">{selectedThesis.fileSize}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Views</div>
                    <div className="text-2xl font-bold">{selectedThesis.views}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Rating</div>
                    <div className="text-2xl font-bold flex items-center gap-1">
                      {selectedThesis.rating}
                      <Star className="w-5 h-5 text-yellow-500" />
                    </div>
                  </div>
                </div>

                {selectedThesis.isPlagiarismChecked && (
                  <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <FileCheck className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-green-900">Plagiarism Check Completed</span>
                    </div>
                    <div className="text-sm text-green-700">
                      Similarity Score: {selectedThesis.plagiarismScore}%
                    </div>
                  </div>
                )}

                {selectedThesis.doi && (
                  <div className="mb-6">
                    <div className="text-sm text-gray-600 mb-1">DOI</div>
                    <div className="font-mono text-blue-600">{selectedThesis.doi}</div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => handleDownload(selectedThesis)}
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition"
                  >
                    <Download className="w-5 h-5" />
                    Download Thesis
                  </button>
                  <button
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Upload New Thesis</h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-700 mb-2">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-500">PDF files up to 50MB</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Thesis Type</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option>Thesis</option>
                      <option>Dissertation</option>
                      <option>Final Project</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Degree Level</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option>Bachelor</option>
                      <option>Master</option>
                      <option>PhD</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Author Name</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Supervisor</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      {departments.filter(d => d !== 'all').map(dept => (
                        <option key={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Abstract</label>
                  <textarea rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-lg"></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Keywords (comma-separated)</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" 
                         placeholder="e.g., Machine Learning, AI, Data Science" />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
                  >
                    <Upload className="w-5 h-5" />
                    Upload Thesis
                  </button>
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};



// Types
type BookStatus = 'available' | 'borrowed' | 'reserved' | 'maintenance' | 'lost';

interface BookFilterOptions {
  bookType: BookType | 'all';
  catalogue: CatalogueCategory | 'all';
  publisher: string;
  status: 'all' | 'available' | 'low_stock';
  yearFrom: string;
  yearTo: string;
  language: string;
}

const BookManagement: React.FC = () => {
  const [books, setBooks] = useState<BookRecord[]>(bookRecords);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<BookRecord | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCatalogue, setSelectedCatalogue] = useState<CatalogueCategory | 'all'>('all');
  
const [filters, setFilters] = useState<BookFilterOptions>({
  bookType: 'all',
  catalogue: 'all',
  publisher: 'all',
  status: 'all',
  yearFrom: '',
  yearTo: '',
  language: 'all'
});

  // Statistics
  const statistics = useMemo(() => {
    const total = books.length;
    const totalPhysicalCopies = books.reduce((sum, b) => sum + b.totalCopies, 0);
    const availableCopies = books.reduce((sum, b) => sum + b.availableCopies, 0);
    const borrowedCopies = books.reduce((sum, b) => sum + b.borrowedCopies, 0);
    const utilizationRate = ((borrowedCopies / totalPhysicalCopies) * 100).toFixed(1);
    const uniquePublishers = new Set(books.map(b => b.publisher)).size;
    const avgRating = books.reduce((sum, b) => sum + b.rating, 0) / total;

    return {
      total,
      totalPhysicalCopies,
      availableCopies,
      borrowedCopies,
      utilizationRate,
      uniquePublishers,
      avgRating: avgRating.toFixed(1)
    };
  }, [books]);

  // Publisher statistics
  const publisherStats = useMemo(() => {
    const stats = books.reduce((acc, book) => {
      if (!acc[book.publisher]) {
        acc[book.publisher] = {
          count: 0,
          totalCopies: 0,
          borrowed: 0
        };
      }
      acc[book.publisher].count += 1;
      acc[book.publisher].totalCopies += book.totalCopies;
      acc[book.publisher].borrowed += book.borrowedCopies;
      return acc;
    }, {} as Record<string, { count: number; totalCopies: number; borrowed: number }>);

    return Object.entries(stats)
      .map(([publisher, data]) => ({ publisher, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [books]);

  // Catalogue statistics
  const catalogueStats = useMemo(() => {
    const stats = books.reduce((acc, book) => {
      if (!acc[book.catalogue]) {
        acc[book.catalogue] = { count: 0, available: 0, borrowed: 0 };
      }
      acc[book.catalogue].count += book.totalCopies;
      acc[book.catalogue].available += book.availableCopies;
      acc[book.catalogue].borrowed += book.borrowedCopies;
      return acc;
    }, {} as Record<string, { count: number; available: number; borrowed: number }>);

    return Object.entries(stats)
      .map(([catalogue, data]) => ({ catalogue, ...data }))
      .sort((a, b) => b.count - a.count);
  }, [books]);

  // Filtered books
  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      const matchesSearch = 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.authors.some(a => a.toLowerCase().includes(searchTerm.toLowerCase())) ||
        book.isbn.includes(searchTerm) ||
        book.subjects.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
        book.publisher.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = filters.bookType === 'all' || book.bookType === filters.bookType;
      const matchesCatalogue = filters.catalogue === 'all' || book.catalogue === filters.catalogue;
      const matchesPublisher = filters.publisher === 'all' || book.publisher === filters.publisher;
      const matchesLanguage = filters.language === 'all' || book.language === filters.language;
      
      const matchesStatus = 
        filters.status === 'all' ||
        (filters.status === 'available' && book.availableCopies > 0) ||
        (filters.status === 'low_stock' && book.availableCopies <= 5 && book.availableCopies > 0);

      const matchesYearFrom = !filters.yearFrom || book.publicationYear >= parseInt(filters.yearFrom);
      const matchesYearTo = !filters.yearTo || book.publicationYear <= parseInt(filters.yearTo);

      const matchesSelectedCatalogue = selectedCatalogue === 'all' || book.catalogue === selectedCatalogue;

      return matchesSearch && matchesType && matchesCatalogue && matchesPublisher && 
             matchesLanguage && matchesStatus && matchesYearFrom && matchesYearTo && 
             matchesSelectedCatalogue;
    });
  }, [books, searchTerm, filters, selectedCatalogue]);

  // Helper functions
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getAvailabilityColor = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    if (percentage > 50) return 'text-green-600 bg-green-50';
    if (percentage > 20) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getBookTypeLabel = (type: BookType) => {
    const labels = {
      textbook: 'Textbook',
      reference: 'Reference',
      lecture_notes: 'Lecture Notes'
    };
    return labels[type];
  };

  const handleViewDetail = (book: BookRecord) => {
    setSelectedBook(book);
    setShowDetailModal(true);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Book Management</h1>
            <p className="text-gray-600 mt-1">
              Comprehensive library collection management system
            </p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
          >
            <Plus className="w-4 h-4" />
            Add Book
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
              <Library className="w-4 h-4" />
              Total Titles
            </div>
            <div className="text-2xl font-bold text-gray-900">{statistics.total}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 text-blue-600 text-sm mb-1">
              <Book className="w-4 h-4" />
              Total Copies
            </div>
            <div className="text-2xl font-bold text-blue-600">{statistics.totalPhysicalCopies}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 text-green-600 text-sm mb-1">
              <CheckCircle className="w-4 h-4" />
              Available
            </div>
            <div className="text-2xl font-bold text-green-600">{statistics.availableCopies}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 text-orange-600 text-sm mb-1">
              <Users className="w-4 h-4" />
              Borrowed
            </div>
            <div className="text-2xl font-bold text-orange-600">{statistics.borrowedCopies}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 text-purple-600 text-sm mb-1">
              <TrendingUp className="w-4 h-4" />
              Utilization
            </div>
            <div className="text-2xl font-bold text-purple-600">{statistics.utilizationRate}%</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 text-indigo-600 text-sm mb-1">
              <Building2 className="w-4 h-4" />
              Publishers
            </div>
            <div className="text-2xl font-bold text-indigo-600">{statistics.uniquePublishers}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 text-yellow-600 text-sm mb-1">
              <Star className="w-4 h-4" />
              Avg Rating
            </div>
            <div className="text-2xl font-bold text-yellow-600">{statistics.avgRating}</div>
          </div>
        </div>

        {/* Catalogue Quick Filter */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Layers className="w-4 h-4" />
            Browse by Catalogue
          </h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCatalogue('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                selectedCatalogue === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Categories
            </button>
            {catalogues.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCatalogue(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  selectedCatalogue === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Top Publishers Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              Top Publishers
            </h3>
            <div className="space-y-3">
              {publisherStats.map((stat, idx) => (
                <div key={stat.publisher} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                      {idx + 1}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{stat.publisher}</div>
                      <div className="text-sm text-gray-600">{stat.count} titles, {stat.totalCopies} copies</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{stat.borrowed} borrowed</div>
                    <div className="text-xs text-gray-600">
                      {((stat.borrowed / stat.totalCopies) * 100).toFixed(1)}% usage
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-green-600" />
              Catalogue Distribution
            </h3>
            <div className="space-y-3">
              {catalogueStats.slice(0, 6).map((stat) => (
                <div key={stat.catalogue} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-900">{stat.catalogue}</span>
                    <span className="text-gray-600">{stat.count} copies</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${(stat.count / statistics.totalPhysicalCopies) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Search and Controls */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by title, author, ISBN, subject, or publisher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${
                  showFilters ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
              <div className="flex bg-gray-200 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow' : ''}`}
                >
                  <ListIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow' : ''}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Book Type</label>
                  <select
                    value={filters.bookType}
                    onChange={(e) => setFilters({...filters, bookType: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Types</option>
                    <option value="textbook">Textbook</option>
                    <option value="reference">Reference</option>
                    <option value="lecture_notes">Lecture Notes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Catalogue</label>
                  <select
                    value={filters.catalogue}
                    onChange={(e) => setFilters({...filters, catalogue: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Catalogues</option>
                    {catalogues.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Publisher</label>
                  <select
                    value={filters.publisher}
                    onChange={(e) => setFilters({...filters, publisher: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Publishers</option>
                    {publishers.map(pub => (
                      <option key={pub.id} value={pub.name}>{pub.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({...filters, status: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="available">Available</option>
                    <option value="low_stock">Low Stock (≤5)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year From</label>
                  <input
                    type="number"
                    placeholder="2010"
                    value={filters.yearFrom}
                    onChange={(e) => setFilters({...filters, yearFrom: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year To</label>
                  <input
                    type="number"
                    placeholder="2024"
                    value={filters.yearTo}
                    onChange={(e) => setFilters({...filters, yearTo: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                  <select
                    value={filters.language}
                    onChange={(e) => setFilters({...filters, language: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Languages</option>
                    <option value="English">English</option>
                    <option value="Indonesian">Indonesian</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => setFilters({
                    bookType: 'all',
                    catalogue: 'all',
                    publisher: 'all',
                    status: 'all',
                    yearFrom: '',
                    yearTo: '',
                    language: 'all'
                  })}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredBooks.length} of {books.length} books
      </div>

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {filteredBooks.map((book) => (
            <div key={book.id} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-24 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{book.title}</h3>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-2">
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {book.authors.join(', ')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Building2 className="w-4 h-4" />
                          {book.publisher}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {book.publicationYear} • {book.edition}
                        </span>
                        <span className="flex items-center gap-1">
                          <Hash className="w-4 h-4" />
                          ISBN: {book.isbn}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {getBookTypeLabel(book.bookType)}
                        </span>
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                          {book.catalogue}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                          {book.shelfLocation}
                        </span>
                        {book.subjects.slice(0, 3).map((subject, idx) => (
                          <span key={idx} className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs border border-green-200">
                            {subject}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <span className={`flex items-center gap-1 px-3 py-1 rounded-full font-medium ${getAvailabilityColor(book.availableCopies, book.totalCopies)}`}>
                          <CheckCircle className="w-4 h-4" />
                          {book.availableCopies}/{book.totalCopies} Available
                        </span>
                        <span className="text-gray-600">
                          {book.borrowedCopies} Borrowed
                        </span>
                        <span className="flex items-center gap-1 text-yellow-600">
                          <Star className="w-4 h-4 fill-current" />
                          {book.rating} ({book.totalRatings})
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleViewDetail(book)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                        title="Edit"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <div key={book.id} className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition">
              <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-20 h-20 text-white" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2">{book.title}</h3>
              <p className="text-sm text-gray-600 mb-2 line-clamp-1">{book.authors[0]}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  {getBookTypeLabel(book.bookType)}
                </span>
                <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                  {book.catalogue}
                </span>
              </div>
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Availability</span>
                  <span>{book.availableCopies}/{book.totalCopies}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      (book.availableCopies / book.totalCopies) > 0.5 ? 'bg-green-600' :
                      (book.availableCopies / book.totalCopies) > 0.2 ? 'bg-yellow-600' : 'bg-red-600'
                    }`}
                    style={{ width: `${(book.availableCopies / book.totalCopies) * 100}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                    {book.rating}
                  </span>
                  <span>{book.publisher}</span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleViewDetail(book)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    className="p-2 text-green-600 hover:bg-green-50 rounded transition"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredBooks.length === 0 && (
        <div className="bg-white p-12 rounded-lg shadow-sm text-center">
          <Library className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No books found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCatalogue('all');
              setFilters({
                bookType: 'all',
                catalogue: 'all',
                publisher: 'all',
                status: 'all',
                yearFrom: '',
                yearTo: '',
                language: 'all'
              });
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Book Details</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-3 gap-6 mb-6">
                <div className="col-span-1">
                  <div className="w-full h-80 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-32 h-32 text-white" />
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="flex items-start gap-2 mb-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {getBookTypeLabel(selectedBook.bookType)}
                    </span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                      {selectedBook.catalogue}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedBook.title}</h3>
                  {selectedBook.subtitle && (
                    <p className="text-lg text-gray-600 mb-4">{selectedBook.subtitle}</p>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Author(s)</div>
                      <div className="font-medium">{selectedBook.authors.join(', ')}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Publisher</div>
                      <div className="font-medium">{selectedBook.publisher}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">ISBN</div>
                      <div className="font-medium font-mono">{selectedBook.isbn}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Edition</div>
                      <div className="font-medium">{selectedBook.edition}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Publication Year</div>
                      <div className="font-medium">{selectedBook.publicationYear}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Pages</div>
                      <div className="font-medium">{selectedBook.pages}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Language</div>
                      <div className="font-medium">{selectedBook.language}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Shelf Location</div>
                      <div className="font-medium">{selectedBook.shelfLocation}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="text-sm text-green-700 mb-1">Available</div>
                      <div className="text-2xl font-bold text-green-600">{selectedBook.availableCopies}</div>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                      <div className="text-sm text-orange-700 mb-1">Borrowed</div>
                      <div className="text-2xl font-bold text-orange-600">{selectedBook.borrowedCopies}</div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <div className="text-sm text-blue-700 mb-1">Total Copies</div>
                      <div className="text-2xl font-bold text-blue-600">{selectedBook.totalCopies}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                      <span className="font-semibold text-gray-900">{selectedBook.rating}</span> ({selectedBook.totalRatings} ratings)
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                      Popularity: {selectedBook.popularityScore}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                <p className="text-gray-700">{selectedBook.description}</p>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-2">Subjects</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedBook.subjects.map((subject, idx) => (
                    <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {subject}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Added to Library</div>
                  <div className="font-medium">{formatDate(selectedBook.addedDate)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Last Updated</div>
                  <div className="font-medium">{formatDate(selectedBook.lastUpdated)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Price</div>
                  <div className="font-medium">{selectedBook.currency} {selectedBook.price.toFixed(2)}</div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition"
                >
                  <Edit className="w-5 h-5" />
                  Edit Details
                </button>
                <button
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  <Copy className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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



interface RoomSession {
  morning: string;
  afternoon: string;
  evening: string;
}

interface RoomScheduleItem {
  roomCode: string;
  floor: string;
  sessions: RoomSession;
}

interface WeeklyScheduleData {
  [date: string]: RoomScheduleItem[];
}

interface RoomScheduleProps {
  googleSheetUrl?: string;
  apiKey?: string;
}

const getEnvVar = (key: string): string => {
  try {
    // @ts-ignore
    return import.meta.env[key] || "";
  } catch {
    return "";
  }
};

const RoomSchedule: React.FC<RoomScheduleProps> = ({ 
  googleSheetUrl = getEnvVar('VITE_SHEET_URL'),
  apiKey = getEnvVar('VITE_GOOGLE_API_KEY')
}) => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [scheduleData, setScheduleData] = useState<WeeklyScheduleData>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [debugInfo, setDebugInfo] = useState<string>("");
  const [availableDates, setAvailableDates] = useState<string[]>([]);

  const parseGoogleSheetsData = (data: any[][]): WeeklyScheduleData => {
    const weeklyData: WeeklyScheduleData = {};
    
    if (!data || data.length < 2) {
      console.error('No data or insufficient rows');
      return weeklyData;
    }

    // Get room names from header row
    const headerRow = data[0];
    console.log('Header row (first 5):', headerRow.slice(0, 5));

    const roomColumns: { [key: number]: { name: string; floor: string } } = {};
    
    // Start from column C (index 2) onwards
    for (let i = 2; i < headerRow.length; i++) {
  const roomName = (headerRow[i] || '').toString().trim();
  if (roomName) {
    let floor = 'Floor 1'; // Default
    
    // Floor identification based on T1, T2, T3, T4 pattern
    // T1 = Floor 1, T2 = Floor 2, T3 = Floor 3, T4 = Floor 4
    // B1 = Building 1 (not related to floor)
    
    if (roomName.includes('T1')) {
      floor = 'Floor 1';
    }
    else if (roomName.includes('T2')) {
      floor = 'Floor 2';
    }
    else if (roomName.includes('T3')) {
      floor = 'Floor 3';
    }
    else if (roomName.includes('T4')) {
      floor = 'Floor 4';
    }
    // Legacy room names with room numbers (201, 301, 401, etc.)
    else if (roomName.includes('201') || roomName.includes('202')) {
      floor = 'Floor 2';
    }
    else if (roomName.includes('301') || roomName.includes('302')) {
      floor = 'Floor 3';
    }
    else if (roomName.includes('401') || roomName.includes('402')) {
      floor = 'Floor 4';
    }
        
        roomColumns[i] = { name: roomName, floor };
      }
    }
    console.log('Found', Object.keys(roomColumns).length, 'room columns');

    // Track current date as we process rows
    let currentDate = '';
    
    // Process each data row
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (!row || row.length < 2) continue;

      const dateCell = (row[0] || '').toString().trim();
      const sessionType = (row[1] || '').toString().trim().toUpperCase();

      // Update current date if this row has a date
      if (dateCell) {
        const dateMatch = dateCell.match(/ngày (\d+)\.(\d+)\.(\d+)/);
        if (dateMatch) {
          const day = dateMatch[1].padStart(2, '0');
          const month = dateMatch[2].padStart(2, '0');
          const year = dateMatch[3];
          currentDate = `${year}-${month}-${day}`;
          
          // Initialize this date if not exists
          if (!weeklyData[currentDate]) {
            weeklyData[currentDate] = [];
            console.log('Found new date:', currentDate);
          }
        }
      }

      // Skip if we don't have a valid date yet
      if (!currentDate) continue;

      // Skip if not a valid session type
      if (!['S', 'C', 'T'].includes(sessionType)) continue;

      console.log(`Processing ${currentDate} - Session: ${sessionType}`);

      // Process each room column for this session
      Object.entries(roomColumns).forEach(([colIndex, roomInfo]) => {
        const idx = parseInt(colIndex);
        const cellValue = (row[idx] || '').toString().trim();

        // Find or create room entry for this date
        let roomEntry = weeklyData[currentDate].find(r => r.roomCode === roomInfo.name);
        
        if (!roomEntry) {
          roomEntry = {
            roomCode: roomInfo.name,
            floor: roomInfo.floor,
            sessions: { morning: '', afternoon: '', evening: '' }
          };
          weeklyData[currentDate].push(roomEntry);
        }

        // Assign to appropriate session
        if (sessionType === 'S') {
          roomEntry.sessions.morning = cellValue;
        } else if (sessionType === 'C') {
          roomEntry.sessions.afternoon = cellValue;
        } else if (sessionType === 'T') {
          roomEntry.sessions.evening = cellValue;
        }
      });
    }

    const dates = Object.keys(weeklyData).sort();
    console.log('Total dates parsed:', dates.length);
    console.log('Dates:', dates);
    
    // Log sample data for first date
    if (dates.length > 0) {
      const firstDate = dates[0];
      const sampleRooms = weeklyData[firstDate].slice(0, 3);
      console.log('Sample rooms for', firstDate, ':', sampleRooms);
    }
    
    return weeklyData;
  };

  const loadDemoData = () => {
    console.log('Loading demo data...');
    const today = new Date().toISOString().split('T')[0];
    
    setScheduleData({
      [today]: [
        { roomCode: "Chu Văn An B1", floor: "Floor 2", sessions: { morning: "", afternoon: "MAS3", evening: "MET6 - Tiếng Hàn" } },
        { roomCode: "Nguyễn Văn Đạo B1", floor: "Floor 2", sessions: { morning: "", afternoon: "", evening: "MET6 - Tiếng Trung" } },
        { roomCode: "MET T4 B1", floor: "Floor 4", sessions: { morning: "", afternoon: "MET7", evening: "" } }
      ]
    });
    setAvailableDates([today]);
    setSelectedDate(today);
    setError("Using demo data. Configure .env to connect to Google Sheets.");
  };

  const fetchScheduleData = async () => {
    console.log('=== Starting fetch ===');
    
    if (!googleSheetUrl || !apiKey) {
      console.log('Missing credentials');
      loadDemoData();
      return;
    }
    
    setLoading(true);
    setError("");
    setDebugInfo("Connecting to Google Sheets...");
    
    try {
      const match = googleSheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (!match) throw new Error("Invalid URL");
      
      const spreadsheetId = match[1];
      const range = "sheet1!A1:R300"; // Increased range to capture more data
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;
      
      console.log('Fetching from sheet1...');
      setDebugInfo("Loading data...");
      
      const response = await fetch(url);
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        throw new Error(`API Error (${response.status})`);
      }
      
      const result = await response.json();
      console.log('Received rows:', result.values?.length || 0);
      
      if (!result.values || result.values.length === 0) {
        throw new Error("Empty sheet");
      }
      
      setDebugInfo("Processing data...");
      const parsedData = parseGoogleSheetsData(result.values);
      
      const dates = Object.keys(parsedData).sort();
      const dateCount = dates.length;
      console.log('Final parsed dates count:', dateCount);
      
      if (dateCount === 0) {
        throw new Error("No valid data found");
      }
      
      setScheduleData(parsedData);
      setAvailableDates(dates);
      
      // Set to first available date
      if (dates.length > 0) {
        setSelectedDate(dates[0]);
      }
      
      setDebugInfo(`Loaded ${dateCount} days`);
      setError("");
      
      setTimeout(() => setDebugInfo(""), 3000);
      
    } catch (err) {
      console.error('Error:', err);
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      setDebugInfo("");
      loadDemoData();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScheduleData();
  }, []);

  const currentDaySchedule = useMemo(() => {
    const schedule = scheduleData[selectedDate] || [];
    console.log('Displaying schedule for', selectedDate, '- Rooms:', schedule.length);
    return schedule;
  }, [scheduleData, selectedDate]);

  const getDayOfWeek = (dateStr: string) => {
    if (!dateStr) return '';
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date(dateStr).getDay()];
  };

  const SessionBadge: React.FC<{ session: string; type: 'morning' | 'afternoon' | 'evening' }> = ({ session, type }) => {
    if (!session) return <div className="text-sm text-gray-400">-</div>;
    
    const badgeClass = type === 'morning' ? "bg-blue-100 text-blue-700" :
      type === 'afternoon' ? "bg-orange-100 text-orange-700" : "bg-purple-100 text-purple-700";

    return <div className={`px-3 py-1.5 rounded-md text-s font-medium ${badgeClass}`}>{session}</div>;
  };

 return (
    <div className="h-full w-full bg-gray-50 overflow-auto">
      <div className="p-1 max-w mx-auto">
        {/* Header Section */}
      <div className="flex items-center justify-between">
  <div>
    <h1 className="text-3xl font-bold text-gray-900 mb-1 flex items-center">
      
      HSB Class Schedule
    </h1>
    {selectedDate && (
      <p className="text-lg text-gray-600">
        {getDayOfWeek(selectedDate)}, {new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
      </p>
    )}
  </div>
  
  <button 
    onClick={fetchScheduleData} 
    disabled={loading} 
    className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 font-medium flex items-center gap-2 transition-colors"
  >
    <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
    Reload
  </button>
</div>

        {/* Debug Info */}
        {debugInfo && (
          <div className="mb-4 flex items-start gap-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">{debugInfo}</div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 flex items-start gap-2 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800">{error}</div>
          </div>
        )}

        {/* Date Selector & Legend Row */}
        <div className="mb-2 flex flex-wrap items-center justify-between gap-4 bg-white rounded-lg shadow-sm border border-gray-200 p-2">
          {/* Date Selector */}
          <div className="flex items-center gap-4 flex-1 min-w-[300px]">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2 whitespace-nowrap">
              <Calendar className="w-5 h-5" />
              Select Date:
            </label>
            {availableDates.length > 0 && (
              <select 
                value={selectedDate} 
                onChange={(e) => setSelectedDate(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
              >
                {availableDates.map(date => (
                  <option key={date} value={date}>
                    {new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 items-center">
            <span className="text-sm font-medium text-gray-700">Legend:</span>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-blue-100 border border-blue-300 rounded"></div>
              <span className="text-sm">Morning</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-orange-100 border border-orange-300 rounded"></div>
              <span className="text-sm">Afternoon</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-purple-100 border border-purple-300 rounded"></div>
              <span className="text-sm">Evening</span>
            </div>
          </div>
        </div>

        {/* Schedule Grid */}
        {loading ? (
          <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
            <RefreshCw className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-spin" />
            <p className="text-xl text-gray-600">Loading data...</p>
          </div>
        ) : currentDaySchedule.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
            {currentDaySchedule.map((room, index) => (
              <div 
                key={`${room.roomCode}-${index}`} 
                className="bg-white rounded-lg border-2 border-gray-200 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all p-2"
              >
                <div className="mb-3 pb-3 border-b-2 border-gray-200">
                  <h3 className="font-bold text-gray-900 text-base mb-1">{room.roomCode}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Building className="w-3 h-3" />
                    {room.floor}
                  </p>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-500 mb-1.5 flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      Morning
                    </div>
                    <SessionBadge session={room.sessions.morning} type="morning" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1.5 flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      Afternoon
                    </div>
                    <SessionBadge session={room.sessions.afternoon} type="afternoon" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1.5 flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      Evening
                    </div>
                    <SessionBadge session={room.sessions.evening} type="evening" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-lg border-2 border-gray-200">
            <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600 mb-3">No schedule for this day</p>
            {availableDates.length > 0 && (
              <button 
                onClick={() => setSelectedDate(availableDates[0])}
                className="mt-3 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Go to first available date
              </button>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-1 text-center text-sm text-gray-500">
          © 2025 Hanoi School of Business and Management (HSB). All rights reserved. Designed by Tuan.HA
        </div>
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




// Import types and data from documentData.ts

const DocumentManagement: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>(sampleDocuments);
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'pending'>('overview');
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSource, setSelectedSource] = useState<DocumentSource | "ALL">("ALL");
  const [selectedType, setSelectedType] = useState<DocumentType | "ALL">("ALL");
  const [selectedStatus, setSelectedStatus] = useState<DocumentStatus | "ALL">("ALL");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showNewDocumentModal, setShowNewDocumentModal] = useState(false);

  // Statistics
  const stats = useMemo(() => {
    const docStats = getDocumentStatistics();
    return {
      total: docStats.total,
      pendingSignature: docStats.byStatus.pendingSignature,
      pendingReview: docStats.byStatus.pendingReview,
      urgent: docStats.byPriority.urgent,
      issued: docStats.byStatus.issued,
    };
  }, []);

  // Document type labels
  const documentTypeLabels: Record<DocumentType, string> = {
    CIRCULAR: "Thông tư",
    DIRECTIVE: "Chỉ thị",
    DECISION: "Quyết định",
    DISPATCH: "Công văn",
    GUIDELINE: "Hướng dẫn",
    REGULATION: "Quy định",
    REPORT: "Báo cáo",
    REQUEST: "Đề nghị",
    NOTIFICATION: "Thông báo",
    RESOLUTION: "Nghị quyết",
    INSTRUCTION: "Chỉ đạo"
  };

  // Document source labels
  const documentSourceLabels: Record<DocumentSource, string> = {
    VNU_HANOI: "ĐHQG Hà Nội",
    MOE: "Bộ Giáo dục",
    MPS: "Bộ Công an",
    MOH: "Bộ Y tế",
    MOET: "Bộ GD&ĐT",
    MOST: "Bộ KH&CN",
    MOF: "Bộ Tài chính",
    MOLISA: "Bộ LĐ-TB&XH",
    INTERNAL: "Nội bộ",
    OTHER: "Khác"
  };

  // Document status labels
  const documentStatusLabels: Record<DocumentStatus, string> = {
    DRAFT: "Dự thảo",
    PENDING_REVIEW: "Chờ xem xét",
    PENDING_SIGNATURE: "Chờ ký",
    SIGNED: "Đã ký",
    ISSUED: "Đã ban hành",
    ARCHIVED: "Đã lưu trữ",
    REJECTED: "Từ chối",
    EXPIRED: "Hết hiệu lực"
  };

  // Priority labels
  const priorityLabels: Record<PriorityLevel, string> = {
    LOW: "Thấp",
    MEDIUM: "Trung bình",
    HIGH: "Cao",
    URGENT: "Khẩn cấp"
  };

  // Get status color
  const getStatusColor = (status: DocumentStatus): string => {
    const colors: Record<DocumentStatus, string> = {
      DRAFT: "bg-gray-100 text-gray-700 border-gray-200",
      PENDING_REVIEW: "bg-amber-100 text-amber-700 border-amber-200",
      PENDING_SIGNATURE: "bg-blue-100 text-blue-700 border-blue-200",
      SIGNED: "bg-emerald-100 text-emerald-700 border-emerald-200",
      ISSUED: "bg-purple-100 text-purple-700 border-purple-200",
      ARCHIVED: "bg-gray-100 text-gray-600 border-gray-200",
      REJECTED: "bg-red-100 text-red-700 border-red-200",
      EXPIRED: "bg-gray-100 text-gray-500 border-gray-200"
    };
    return colors[status];
  };

  // Get priority color
  const getPriorityColor = (priority: PriorityLevel): string => {
    const colors: Record<PriorityLevel, string> = {
      LOW: "bg-green-100 text-green-700 border-green-200",
      MEDIUM: "bg-yellow-100 text-yellow-700 border-yellow-200",
      HIGH: "bg-orange-100 text-orange-700 border-orange-200",
      URGENT: "bg-red-100 text-red-700 border-red-200"
    };
    return colors[priority];
  };

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  // Filter documents
  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      const matchesSearch = 
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.documentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.sourceOrganization.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSource = selectedSource === "ALL" || doc.source === selectedSource;
      const matchesType = selectedType === "ALL" || doc.type === selectedType;
      const matchesStatus = selectedStatus === "ALL" || doc.status === selectedStatus;

      return matchesSearch && matchesSource && matchesType && matchesStatus;
    });
  }, [documents, searchTerm, selectedSource, selectedType, selectedStatus]);

  // Handle document click
  const handleDocumentClick = (doc: Document) => {
    setSelectedDocument(doc);
    setShowDocumentModal(true);
  };

  // Render Overview Tab
  const renderOverview = () => (
    <div className="space-y-3">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <FileText className="text-blue-600" size={24} />
            </div>
            <span className="text-sm font-semibold text-gray-600">Tổng số văn bản</span>
          </div>
          <p className="text-4xl font-bold text-gray-900 mb-1">{stats.total}</p>
          <p className="text-sm text-gray-500">Tất cả văn bản trong hệ thống</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-amber-100 rounded-xl">
              <Clock className="text-amber-600" size={24} />
            </div>
            <span className="text-sm font-semibold text-gray-600">Chờ ký duyệt</span>
          </div>
          <p className="text-4xl font-bold text-gray-900 mb-1">{stats.pendingSignature}</p>
          <p className="text-sm text-amber-600 font-medium">Cần xử lý ngay</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Eye className="text-purple-600" size={24} />
            </div>
            <span className="text-sm font-semibold text-gray-600">Chờ xem xét</span>
          </div>
          <p className="text-4xl font-bold text-gray-900 mb-1">{stats.pendingReview}</p>
          <p className="text-sm text-gray-500">Đang được xem xét</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-red-100 rounded-xl">
              <AlertTriangle className="text-red-600" size={24} />
            </div>
            <span className="text-sm font-semibold text-gray-600">Khẩn cấp</span>
          </div>
          <p className="text-4xl font-bold text-gray-900 mb-1">{stats.urgent}</p>
          <p className="text-sm text-red-600 font-medium">Ưu tiên cao nhất</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Phân bố trạng thái văn bản</h3>
          <div className="space-y-3">
            {Object.entries(documentStatusLabels).map(([status, label]) => {
              const count = documents.filter(d => d.status === status).length;
              const percentage = (count / documents.length) * 100;
              return (
                <div key={status} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{label}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-48 h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          status === 'ISSUED' ? 'bg-purple-500' :
                          status === 'PENDING_SIGNATURE' ? 'bg-blue-500' :
                          status === 'PENDING_REVIEW' ? 'bg-amber-500' :
                          status === 'SIGNED' ? 'bg-emerald-500' :
                          status === 'REJECTED' ? 'bg-red-500' : 'bg-gray-400'
                        }`}
                        style={{width: `${percentage}%`}}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-8">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Nguồn văn bản hàng đầu</h3>
          <div className="space-y-4">
            {Object.entries(
              documents.reduce((acc, doc) => {
                acc[doc.source] = (acc[doc.source] || 0) + 1;
                return acc;
              }, {} as Record<DocumentSource, number>)
            )
              .sort(([, a], [, b]) => b - a)
              .slice(0, 5)
              .map(([source, count], idx) => (
                <div key={source} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center font-bold text-indigo-600">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">
                      {documentSourceLabels[source as DocumentSource]}
                    </p>
                    <p className="text-xs text-gray-500">Nguồn văn bản</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{count}</p>
                    <p className="text-xs text-gray-500">văn bản</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Recent Documents */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Văn bản gần đây</h3>
        <div className="space-y-2">
          {documents.slice(0, 5).map(doc => (
            <div 
              key={doc.id} 
              className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
              onClick={() => handleDocumentClick(doc)}
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  <FileText size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{doc.title}</p>
                  <p className="text-xs text-gray-500">{doc.documentNumber} • {documentSourceLabels[doc.source]}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500">{formatDate(doc.issuedDate)}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(doc.status)}`}>
                  {documentStatusLabels[doc.status]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Render Documents Tab
  const renderDocuments = () => (
    <div className="space-y-4">
      {/* Search and Actions */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo số văn bản, tiêu đề, nội dung..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
              showFilters
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Filter size={18} />
            Bộ lọc
          </button>
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
              }`}
            >
              <ListIcon size={18} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
              }`}
            >
              <Grid size={18} />
            </button>
          </div>
          <button
            onClick={() => setShowNewDocumentModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            <Plus size={18} />
            Thêm văn bản
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nguồn văn bản</label>
              <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value as DocumentSource | "ALL")}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="ALL">Tất cả</option>
                {Object.entries(documentSourceLabels).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Loại văn bản</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as DocumentType | "ALL")}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="ALL">Tất cả</option>
                {Object.entries(documentTypeLabels).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Trạng thái</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as DocumentStatus | "ALL")}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="ALL">Tất cả</option>
                {Object.entries(documentStatusLabels).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Documents List/Grid */}
      {viewMode === 'list' ? (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Số văn bản</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tiêu đề</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Loại</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ngày BH</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ưu tiên</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredDocuments.map(doc => (
                  <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-indigo-600">{doc.documentNumber}</p>
                    </td>
                    <td className="px-6 py-4 max-w-md">
                      <p className="text-sm font-semibold text-gray-900 truncate">{doc.title}</p>
                      <p className="text-xs text-gray-500 truncate">{doc.sourceOrganization}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                        {documentTypeLabels[doc.type]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-700">{formatDate(doc.issuedDate)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(doc.priority)}`}>
                        {priorityLabels[doc.priority]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(doc.status)}`}>
                        {documentStatusLabels[doc.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDocumentClick(doc)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors text-sm font-medium"
                      >
                        <Eye size={14} />
                        Xem
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredDocuments.length === 0 && (
            <div className="text-center py-12">
              <FileText size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Không tìm thấy văn bản nào</p>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocuments.map(doc => (
            <div
              key={doc.id}
              onClick={() => handleDocumentClick(doc)}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                  {documentTypeLabels[doc.type]}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(doc.priority)}`}>
                  {priorityLabels[doc.priority]}
                </span>
              </div>

              <p className="text-sm font-semibold text-indigo-600 mb-2">{doc.documentNumber}</p>
              <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2">{doc.title}</h3>

              <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                <Building2 size={14} />
                <span className="truncate">{doc.sourceOrganization}</span>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                <Calendar size={14} />
                <span>Ngày BH: {formatDate(doc.issuedDate)}</span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(doc.status)}`}>
                  {documentStatusLabels[doc.status]}
                </span>
                {doc.attachments && doc.attachments.length > 0 && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Paperclip size={14} />
                    {doc.attachments.length}
                  </div>
                )}
              </div>
            </div>
          ))}
          {filteredDocuments.length === 0 && (
            <div className="col-span-full text-center py-12 bg-white rounded-xl border border-gray-200">
              <FileText size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Không tìm thấy văn bản nào</p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  // Render Pending Tab
  const renderPending = () => {
    const pendingDocs = documents.filter(
      d => d.status === 'PENDING_SIGNATURE' || d.status === 'PENDING_REVIEW'
    );

    return (
      <div className="space-y-4">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-amber-600 mt-0.5" size={20} />
            <div>
              <h3 className="text-sm font-semibold text-amber-900 mb-1">
                Có {pendingDocs.length} văn bản cần xử lý
              </h3>
              <p className="text-sm text-amber-700">
                Các văn bản đang chờ xem xét hoặc ký duyệt cần được xử lý sớm
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {pendingDocs.map(doc => (
            <div key={doc.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{doc.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(doc.status)}`}>
                      {documentStatusLabels[doc.status]}
                    </span>
                  </div>
                  <p className="text-sm text-indigo-600 font-semibold mb-1">{doc.documentNumber}</p>
                  <p className="text-sm text-gray-600">{documentSourceLabels[doc.source]} • {documentTypeLabels[doc.type]}</p>
                </div>
                <button
                  onClick={() => handleDocumentClick(doc)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  <Eye size={16} />
                  Xem chi tiết
                </button>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Cơ quan</p>
                  <p className="text-sm font-semibold text-gray-900 truncate">{doc.sourceOrganization}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Ngày ban hành</p>
                  <p className="text-sm font-semibold text-gray-900">{formatDate(doc.issuedDate)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Ưu tiên</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(doc.priority)}`}>
                    {priorityLabels[doc.priority]}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Người tạo</p>
                  <p className="text-sm font-semibold text-gray-900">{doc.createdBy}</p>
                </div>
              </div>

              {doc.signatories && doc.signatories.length > 0 && (
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 mb-2">NGƯỜI KÝ DUYỆT</p>
                  <div className="flex flex-wrap gap-2">
                    {doc.signatories.map(sig => (
                      <div key={sig.id} className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                        <User size={14} className="text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">{sig.name}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          sig.status === 'SIGNED' ? 'bg-emerald-100 text-emerald-700' :
                          sig.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {sig.status === 'SIGNED' ? 'Đã ký' : sig.status === 'PENDING' ? 'Chờ ký' : 'Từ chối'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {pendingDocs.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <CheckCircle size={48} className="mx-auto text-emerald-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Tất cả đã được xử lý</h3>
            <p className="text-gray-500">Không có văn bản nào đang chờ xử lý</p>
          </div>
        )}
      </div>
    );
  };

  // Document Detail Modal
  const DocumentDetailModal = () => {
    if (!selectedDocument) return null;

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-xs font-semibold rounded-full border border-white/30">
                    {documentTypeLabels[selectedDocument.type]}
                  </span>
                  <span className={`px-3 py-1 bg-white text-xs font-semibold rounded-full ${
                    selectedDocument.priority === 'URGENT' ? 'text-red-700' :
                    selectedDocument.priority === 'HIGH' ? 'text-orange-700' :
                    selectedDocument.priority === 'MEDIUM' ? 'text-yellow-700' :
                    'text-green-700'
                  }`}>
                    {priorityLabels[selectedDocument.priority]}
                  </span>
                  <span className="px-3 py-1 bg-white text-indigo-700 text-xs font-semibold rounded-full">
                    {documentStatusLabels[selectedDocument.status]}
                  </span>
                </div>
                <h2 className="text-2xl font-bold mb-2">{selectedDocument.title}</h2>
                <p className="text-indigo-100">{selectedDocument.documentNumber}</p>
              </div>
              <button 
                onClick={() => setShowDocumentModal(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <XCircle size={24} />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-280px)]">
            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Cơ quan ban hành</p>
                <p className="text-base font-bold text-gray-900">{selectedDocument.sourceOrganization}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Nguồn</p>
                <p className="text-base font-bold text-gray-900">{documentSourceLabels[selectedDocument.source]}</p>
              </div>
              {selectedDocument.category && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Lĩnh vực</p>
                  <p className="text-base font-bold text-gray-900">{selectedDocument.category}</p>
                </div>
              )}
              {selectedDocument.confidentialityLevel && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Độ mật</p>
                  <p className="text-base font-bold text-gray-900">
                    {selectedDocument.confidentialityLevel === 'PUBLIC' ? 'Công khai' :
                     selectedDocument.confidentialityLevel === 'INTERNAL' ? 'Nội bộ' :
                     selectedDocument.confidentialityLevel === 'CONFIDENTIAL' ? 'Mật' : 'Tối mật'}
                  </p>
                </div>
              )}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Ngày ban hành</p>
                <p className="text-base font-bold text-gray-900">{formatDate(selectedDocument.issuedDate)}</p>
              </div>
              {selectedDocument.receivedDate && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Ngày nhận</p>
                  <p className="text-base font-bold text-gray-900">{formatDate(selectedDocument.receivedDate)}</p>
                </div>
              )}
              {selectedDocument.effectiveDate && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Ngày hiệu lực</p>
                  <p className="text-base font-bold text-gray-900">{formatDate(selectedDocument.effectiveDate)}</p>
                </div>
              )}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Người tạo</p>
                <p className="text-base font-bold text-gray-900">{selectedDocument.createdBy}</p>
              </div>
            </div>

            {/* Recipient Departments */}
            {selectedDocument.recipientDepartments && selectedDocument.recipientDepartments.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Phòng ban nhận văn bản</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedDocument.recipientDepartments.map((dept, idx) => (
                    <span key={idx} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium">
                      {dept}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Summary */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Tóm tắt nội dung</h3>
              <p className="text-sm text-gray-700 leading-relaxed p-4 bg-gray-50 rounded-lg border border-gray-200">
                {selectedDocument.summary}
              </p>
            </div>

            {/* Full Content */}
            {selectedDocument.content && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Nội dung chi tiết</h3>
                <div className="text-sm text-gray-700 leading-relaxed p-4 bg-gray-50 rounded-lg border border-gray-200 max-h-64 overflow-y-auto">
                  {selectedDocument.content}
                </div>
              </div>
            )}

            {/* Signatories */}
            {selectedDocument.signatories.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Người ký duyệt</h3>
                <div className="space-y-3">
                  {selectedDocument.signatories.map(sig => (
                    <div key={sig.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">{sig.name}</p>
                        <p className="text-xs text-gray-600 mt-1">{sig.position} {sig.department && `• ${sig.department}`}</p>
                        {(sig.email || sig.phone) && (
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            {sig.email && (
                              <div className="flex items-center gap-1">
                                <Mail size={12} />
                                {sig.email}
                              </div>
                            )}
                            {sig.phone && (
                              <div className="flex items-center gap-1">
                                <Phone size={12} />
                                {sig.phone}
                              </div>
                            )}
                          </div>
                        )}
                        {sig.signedAt && (
                          <p className="text-xs text-gray-500 mt-2">Đã ký: {formatDate(sig.signedAt)}</p>
                        )}
                        {sig.comments && (
                          <p className="text-xs text-gray-700 mt-2 italic bg-white p-2 rounded">💬 {sig.comments}</p>
                        )}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                        sig.status === 'SIGNED' ? 'bg-emerald-100 text-emerald-700' :
                        sig.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {sig.status === 'SIGNED' ? 'Đã ký' : sig.status === 'PENDING' ? 'Chờ ký' : 'Từ chối'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Attachments */}
            {selectedDocument.attachments && selectedDocument.attachments.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  File đính kèm ({selectedDocument.attachments.length})
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {selectedDocument.attachments.map((attachment, idx) => {
                    const fileName = typeof attachment === 'string' ? attachment : attachment.fileName;
                    const fileSize = typeof attachment === 'string' ? null : attachment.fileSize;
                    
                    return (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <Paperclip className="text-indigo-600 flex-shrink-0" size={18} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{fileName}</p>
                            {fileSize && (
                              <p className="text-xs text-gray-500">{(fileSize / 1024 / 1024).toFixed(2)} MB</p>
                            )}
                          </div>
                        </div>
                        <button className="ml-2 text-indigo-600 hover:text-indigo-700 flex-shrink-0">
                          <Download size={16} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tags */}
            {selectedDocument.tags.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedDocument.tags.map((tag, idx) => (
                    <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {selectedDocument.notes && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="text-amber-600 mt-0.5 flex-shrink-0" size={18} />
                  <div>
                    <h3 className="text-sm font-semibold text-amber-900 mb-1">Ghi chú</h3>
                    <p className="text-sm text-amber-700">{selectedDocument.notes}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setShowDocumentModal(false)}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Đóng
              </button>
              {selectedDocument.status === 'PENDING_SIGNATURE' && (
                <>
                  <button className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                    <Edit size={18} />
                    Chỉnh sửa
                  </button>
                  <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
                    <Send size={18} />
                    Gửi duyệt
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 rounded-xl border sticky top-0 z-10 mb-3">
        <div className="max-w mx-auto p-3">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Quản lý Văn bản</h1>
              <p className="text-gray-600 mt-1">Hệ thống quản lý công văn, thông tư từ ĐHQG Hà Nội và các Bộ</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-4">
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
                Tổng quan
              </div>
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'documents'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText size={20} />
                Văn bản
              </div>
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'pending'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <Clock size={20} />
                Chờ xử lý
                {(stats.pendingSignature + stats.pendingReview) > 0 && (
                  <span className="px-2 py-0.5 bg-amber-500 text-white text-xs font-bold rounded-full">
                    {stats.pendingSignature + stats.pendingReview}
                  </span>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w mx-auto">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'documents' && renderDocuments()}
        {activeTab === 'pending' && renderPending()}
      </div>

      {/* Document Detail Modal */}
      {showDocumentModal && <DocumentDetailModal />}
    </div>
  );
};


const HSBShop = () => {
  const [activeView, setActiveView] = useState('dashboard'); // dashboard, inventory, sales, add-product
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const [inventoryViewMode, setInventoryViewMode] = useState('grid'); // grid or list

  // Sample merchandise data
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "HSB University T-Shirt",
      category: "Apparel",
      price: 25.99,
      hsbPoints: 250,
      stock: 150,
      sold: 89,
      image: "https://i.postimg.cc/tgHhXHK4/hsb-capibara.jpg",
      sku: "HSB-TS-001",
      status: "in-stock",
      reorderLevel: 50,
      supplier: "UniWear Co.",
      lastRestocked: "2025-10-15",
      sizes: ["S", "M", "L", "XL"]
    },
    {
      id: 2,
      name: "HSB Hoodie Navy",
      category: "Apparel",
      price: 45.99,
      hsbPoints: 450,
      stock: 12,
      sold: 134,
      image: "https://i.postimg.cc/tgHhXHK4/hsb-capibara.jpg",
      sku: "HSB-HD-002",
      status: "low-stock",
      reorderLevel: 30,
      supplier: "UniWear Co.",
      lastRestocked: "2025-10-01",
      sizes: ["S", "M", "L", "XL", "XXL"]
    },
    {
      id: 3,
      name: "University Notebook Set",
      category: "Stationery",
      price: 12.99,
      hsbPoints: 130,
      stock: 0,
      sold: 245,
      image: "https://i.postimg.cc/tgHhXHK4/hsb-capibara.jpg",
      sku: "HSB-NB-003",
      status: "out-of-stock",
      reorderLevel: 100,
      supplier: "StudySupplies Inc.",
      lastRestocked: "2025-09-20",
      sizes: []
    },
    {
      id: 4,
      name: "HSB Baseball Cap",
      category: "Accessories",
      price: 18.99,
      hsbPoints: 190,
      stock: 85,
      sold: 67,
      image: "https://i.postimg.cc/tgHhXHK4/hsb-capibara.jpg",
      sku: "HSB-CAP-004",
      status: "in-stock",
      reorderLevel: 40,
      supplier: "HeadGear Pro",
      lastRestocked: "2025-10-10",
      sizes: ["One Size"]
    },
    {
      id: 5,
      name: "University Backpack",
      category: "Accessories",
      price: 59.99,
      hsbPoints: 600,
      stock: 34,
      sold: 112,
      image: "https://i.postimg.cc/tgHhXHK4/hsb-capibara.jpg",
      sku: "HSB-BP-005",
      status: "in-stock",
      reorderLevel: 25,
      supplier: "BagMasters Ltd.",
      lastRestocked: "2025-10-12",
      sizes: []
    },
    {
      id: 6,
      name: "HSB Water Bottle",
      category: "Accessories",
      price: 15.99,
      hsbPoints: 160,
      stock: 8,
      sold: 178,
      image: "https://i.postimg.cc/tgHhXHK4/hsb-capibara.jpg",
      sku: "HSB-WB-006",
      status: "low-stock",
      reorderLevel: 60,
      supplier: "HydroGoods",
      lastRestocked: "2025-09-28",
      sizes: []
    },
    {
      id: 7,
      name: "Premium Pen Set",
      category: "Stationery",
      price: 8.99,
      hsbPoints: 90,
      stock: 156,
      sold: 203,
      image: "https://i.postimg.cc/tgHhXHK4/hsb-capibara.jpg",
      sku: "HSB-PS-007",
      status: "in-stock",
      reorderLevel: 80,
      supplier: "StudySupplies Inc.",
      lastRestocked: "2025-10-18",
      sizes: []
    },
    {
      id: 8,
      name: "HSB Sweatpants",
      category: "Apparel",
      price: 38.99,
      hsbPoints: 390,
      stock: 45,
      sold: 91,
      image: "https://i.postimg.cc/tgHhXHK4/hsb-capibara.jpg",
      sku: "HSB-SP-008",
      status: "in-stock",
      reorderLevel: 35,
      supplier: "UniWear Co.",
      lastRestocked: "2025-10-05",
      sizes: ["S", "M", "L", "XL"]
    },
    {
      id: 9,
      name: "HSB-CLC Voucher",
      category: "Vouchers",
      price: 50.00,
      hsbPoints: 500,
      stock: 200,
      sold: 45,
      image: "https://i.postimg.cc/tgHhXHK4/hsb-capibara.jpg",
      sku: "HSB-CLC-009",
      status: "in-stock",
      reorderLevel: 50,
      supplier: "HSB Administration",
      lastRestocked: "2025-10-20",
      sizes: []
    }
  ]);

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Apparel',
    price: '',
    hsbPoints: '',
    stock: '',
    image: 'https://i.postimg.cc/tgHhXHK4/hsb-capibara.jpg',
    sku: '',
    reorderLevel: '',
    supplier: '',
    sizes: []
  });

  // Calculate dashboard statistics
  const stats = useMemo(() => {
    const totalRevenue = products.reduce((sum, p) => sum + (p.price * p.sold), 0);
    const totalProducts = products.length;
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
    const totalSold = products.reduce((sum, p) => sum + p.sold, 0);
    const lowStockCount = products.filter(p => p.status === 'low-stock').length;
    const outOfStockCount = products.filter(p => p.status === 'out-of-stock').length;

    return {
      totalRevenue,
      totalProducts,
      totalStock,
      totalSold,
      lowStockCount,
      outOfStockCount
    };
  }, [products]);

  // Filter products based on search and category
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, filterCategory]);

  const categories = ['all', 'Apparel', 'Stationery', 'Accessories', 'Vouchers'];

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.hsbPoints || !newProduct.stock || !newProduct.sku) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }

    const product = {
      ...newProduct,
      id: products.length + 1,
      price: parseFloat(newProduct.price),
      hsbPoints: parseInt(newProduct.hsbPoints),
      stock: parseInt(newProduct.stock),
      reorderLevel: parseInt(newProduct.reorderLevel) || 20,
      sold: 0,
      status: parseInt(newProduct.stock) > parseInt(newProduct.reorderLevel || '20') ? 'in-stock' : 'low-stock',
      lastRestocked: new Date().toISOString().split('T')[0]
    };

    setProducts([...products, product]);
    setNewProduct({
      name: '',
      category: 'Apparel',
      price: '',
      hsbPoints: '',
      stock: '',
      image: 'https://i.postimg.cc/tgHhXHK4/hsb-capibara.jpg',
      sku: '',
      reorderLevel: '',
      supplier: '',
      sizes: []
    });
    setActiveView('inventory');
    showNotification('Product added successfully!');
  };

  const handleUpdateStock = (productId, newStock) => {
    setProducts(products.map(p => {
      if (p.id === productId) {
        const status = newStock > p.reorderLevel ? 'in-stock' : 
                      newStock > 0 ? 'low-stock' : 'out-of-stock';
        return { ...p, stock: newStock, status };
      }
      return p;
    }));
    showNotification('Stock updated successfully!');
  };

  const handleDeleteProduct = (productId) => {
    setProducts(products.filter(p => p.id !== productId));
    setShowModal(false);
    showNotification('Product deleted successfully!');
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'in-stock': return 'text-green-600 bg-green-50';
      case 'low-stock': return 'text-orange-600 bg-orange-50';
      case 'out-of-stock': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'in-stock': return <CheckCircle className="w-4 h-4" />;
      case 'low-stock': return <AlertTriangle className="w-4 h-4" />;
      case 'out-of-stock': return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  // Dashboard View
  const renderDashboard = () => (
    <div className="space-y-3">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toFixed(2)}</p>
              <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                <ArrowUpRight className="w-3 h-3" />
                +15.7% vs last year
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
              <p className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" />
                +8% vs last month
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
              <Boxes className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">Total Stock</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalStock}</p>
              <p className="text-xs text-gray-600 mt-1">Across all items</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-orange-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">Items Sold</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalSold}</p>
              <p className="text-xs text-orange-600 flex items-center gap-1 mt-1">
                <ArrowUpRight className="w-3 h-3" />
                +12% vs last month
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      {(stats.lowStockCount > 0 || stats.outOfStockCount > 0) && (
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-orange-600" />
            Stock Alerts
          </h3>
          <div className="space-y-3">
            {stats.outOfStockCount > 0 && (
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100">
                <div className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="font-semibold text-red-900">Out of Stock</p>
                    <p className="text-sm text-red-700">{stats.outOfStockCount} product(s) need immediate restocking</p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveView('inventory')}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                >
                  View Items
                </button>
              </div>
            )}
            {stats.lowStockCount > 0 && (
              <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl border border-orange-100">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="font-semibold text-orange-900">Low Stock</p>
                    <p className="text-sm text-orange-700">{stats.lowStockCount} product(s) running low</p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveView('inventory')}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
                >
                  Review
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Top Selling Products */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">Top Selling Products</h3>
          <button 
            onClick={() => setActiveView('sales')}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            View All <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-4">
          {[...products].sort((a, b) => b.sold - a.sold).slice(0, 5).map((product, index) => (
            <div key={product.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors">
              <div className="w-12 h-12 rounded-full flex items-center justify-center font-semibold shrink-0">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-12 h-12 rounded-full border-4 border-white shadow-md object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{product.name}</p>
                <p className="text-sm text-gray-600">{product.sold} units sold</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">${(product.price * product.sold).toFixed(2)}</p>
                <p className="text-xs text-blue-600">{product.hsbPoints * product.sold} HSB Points</p>
                <p className="text-sm text-gray-600">${product.price} / {product.hsbPoints} pts</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Inventory View
  const renderInventory = () => (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2 items-center">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-4 py-2 rounded-xl font-medium text-sm transition-colors ${
                  filterCategory === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
            <div className="h-8 w-px bg-gray-300 mx-2" />
            <button
              onClick={() => setInventoryViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                inventoryViewMode === 'grid'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title="Grid View"
            >
              <Kanban className="w-5 h-5" />
            </button>
            <button
              onClick={() => setInventoryViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                inventoryViewMode === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title="List View"
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {inventoryViewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center font-semibold shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 rounded-full border-4 border-white shadow-md object-cover"
                    />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusColor(product.status)}`}>
                    {getStatusIcon(product.status)}
                    {product.status.split('-').join(' ').toUpperCase()}
                  </span>
                </div>
                
                <h4 className="font-bold text-gray-900 mb-1">{product.name}</h4>
                <p className="text-sm text-gray-600 mb-3">SKU: {product.sku}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Price:</span>
                    <div className="text-right">
                      <span className="font-bold text-gray-900">${product.price}</span>
                      <span className="text-xs text-blue-600 ml-2">/ {product.hsbPoints} pts</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Stock:</span>
                    <span className={`font-bold ${product.stock === 0 ? 'text-red-600' : product.stock < product.reorderLevel ? 'text-orange-600' : 'text-green-600'}`}>
                      {product.stock} units
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Sold:</span>
                    <span className="font-semibold text-gray-900">{product.sold} units</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedProduct(product);
                      setShowModal(true);
                    }}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleUpdateStock(product.id, product.stock + 10)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {inventoryViewMode === 'list' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-200 font-semibold text-sm text-gray-700">
            <div className="col-span-3">Product</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-2">Price</div>
            <div className="col-span-1 text-center">Stock</div>
            <div className="col-span-1 text-center">Sold</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-gray-100">
            {filteredProducts.map(product => (
              <div key={product.id} className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-50 transition-colors items-center">
                {/* Product Info */}
                <div className="col-span-3 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-semibold shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 rounded-full border-4 border-white shadow-md object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{product.name}</p>
                    <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                  </div>
                </div>

                {/* Category */}
                <div className="col-span-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    {product.category}
                  </span>
                </div>

                {/* Price */}
                <div className="col-span-2">
                  <p className="font-bold text-gray-900">${product.price}</p>
                  <p className="text-xs text-blue-600">{product.hsbPoints} pts</p>
                </div>

                {/* Stock */}
                <div className="col-span-1 text-center">
                  <p className={`font-bold ${product.stock === 0 ? 'text-red-600' : product.stock < product.reorderLevel ? 'text-orange-600' : 'text-green-600'}`}>
                    {product.stock}
                  </p>
                  <p className="text-xs text-gray-500">units</p>
                </div>

                {/* Sold */}
                <div className="col-span-1 text-center">
                  <p className="font-semibold text-gray-900">{product.sold}</p>
                  <p className="text-xs text-gray-500">units</p>
                </div>

                {/* Status */}
                <div className="col-span-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${getStatusColor(product.status)}`}>
                    {getStatusIcon(product.status)}
                    {product.status.split('-').join(' ').toUpperCase()}
                  </span>
                </div>

                {/* Actions */}
                <div className="col-span-1 flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setSelectedProduct(product);
                      setShowModal(true);
                    }}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleUpdateStock(product.id, product.stock + 10)}
                    className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    title="Restock +10"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {filteredProducts.length === 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-12 border border-gray-100 text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">No Products Found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );

  // Add Product View
  const renderAddProduct = () => (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Product</h2>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter product name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={newProduct.category}
                onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Apparel">Apparel</option>
                <option value="Stationery">Stationery</option>
                <option value="Accessories">Accessories</option>
                <option value="Vouchers">Vouchers</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                SKU *
              </label>
              <input
                type="text"
                value={newProduct.sku}
                onChange={(e) => setNewProduct({...newProduct, sku: e.target.value})}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="HSB-XXX-000"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Supplier
              </label>
              <input
                type="text"
                value={newProduct.supplier}
                onChange={(e) => setNewProduct({...newProduct, supplier: e.target.value})}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter supplier name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Price ($) *
              </label>
              <input
                type="number"
                step="0.01"
                value={newProduct.price}
                onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                HSB Points *
              </label>
              <input
                type="number"
                value={newProduct.hsbPoints}
                onChange={(e) => setNewProduct({...newProduct, hsbPoints: e.target.value})}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Initial Stock *
              </label>
              <input
                type="number"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Reorder Level
              </label>
              <input
                type="number"
                value={newProduct.reorderLevel}
                onChange={(e) => setNewProduct({...newProduct, reorderLevel: e.target.value})}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="20"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Product Image URL
              </label>
              <input
                type="text"
                value={newProduct.image}
                onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://i.postimg.cc/..."
              />
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <button
              onClick={handleAddProduct}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Product
            </button>
            <button
              onClick={() => setActiveView('inventory')}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Sales View
  const renderSales = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Sales Performance</h3>
        
        <div className="space-y-3">
          {[...products].sort((a, b) => (b.price * b.sold) - (a.price * a.sold)).map((product, index) => (
            <div key={product.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center font-bold text-blue-600">
                {index + 1}
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center font-semibold shrink-0">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-12 h-12 rounded-full border-4 border-white shadow-md object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{product.name}</p>
                <p className="text-sm text-gray-600">{product.category}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">${(product.price * product.sold).toFixed(2)}</p>
                <p className="text-xs text-blue-600">{product.hsbPoints * product.sold} HSB Points</p>
                <p className="text-sm text-gray-600">{product.sold} units × ${product.price} / {product.hsbPoints} pts</p>
              </div>
              <div className="w-24">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(100, (product.sold / Math.max(...products.map(p => p.sold))) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Edit Product Modal
  const renderModal = () => {
    if (!showModal || !selectedProduct) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Edit Product</h3>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Stock Quantity</label>
                <input
                  type="number"
                  defaultValue={selectedProduct.stock}
                  onChange={(e) => setSelectedProduct({...selectedProduct, stock: parseInt(e.target.value)})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  defaultValue={selectedProduct.price}
                  onChange={(e) => setSelectedProduct({...selectedProduct, price: parseFloat(e.target.value)})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">HSB Points</label>
                <input
                  type="number"
                  defaultValue={selectedProduct.hsbPoints}
                  onChange={(e) => setSelectedProduct({...selectedProduct, hsbPoints: parseInt(e.target.value)})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => {
                  handleUpdateStock(selectedProduct.id, selectedProduct.stock);
                  setShowModal(false);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold"
              >
                Save Changes
              </button>
              <button
                onClick={() => handleDeleteProduct(selectedProduct.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-semibold flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w mx-auto p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">HSB Shop</h1>
                <p className="text-sm text-gray-600">Merchandise Management System</p>
              </div>
            </div>
            
            <button
              onClick={() => setActiveView('add-product')}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Product
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w mx-auto p-3">
          <div className="flex gap-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Home },
              { id: 'inventory', label: 'Inventory', icon: Package },
              { id: 'sales', label: 'Sales', icon: TrendingUp },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                className={`flex items-center gap-2 px-4 py-4 border-b-2 transition-colors font-medium ${
                  activeView === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w mx-auto p-3">
        {activeView === 'dashboard' && renderDashboard()}
        {activeView === 'inventory' && renderInventory()}
        {activeView === 'add-product' && renderAddProduct()}
        {activeView === 'sales' && renderSales()}
      </div>

      {/* Modal */}
      {renderModal()}

      {/* Notification */}
      {notification && (
        <div className={`fixed bottom-6 right-6 px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 z-50 ${
          notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        } text-white`}>
          {notification.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <XCircle className="w-5 h-5" />
          )}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}
    </div>
  );
};



{/*project tab*/}


// Types
interface Project {
  id: string;
  title: string;
  description: string;
  type: 'student' | 'staff' | 'mixed';
  startDate: string;
  endDate: string;
  progress: number;
  members: Member[];
  status: 'active' | 'planning' | 'completed';
  department: string;
  priority: 'low' | 'medium' | 'high';
}

interface Member {
  id: string;
  name: string;
  initials: string;
  color: string;
}

interface Task {
  id: string;
  title: string;
  projectId: string;
  labels: Label[];
  assignee?: Member;
  startDate: string;
  endDate: string;
  column: string; // Changed to string to support custom columns
  description?: string;
}

interface Label {
  type: 'bug' | 'feature' | 'urgent' | 'devops' | 'documentation' | 'design' | 'backend' | 'performance' | 'setup' | 'uiux';
  text: string;
}

interface KanbanColumn {
  id: string;
  title: string;
  icon?: LucideIcon;
  order: number;
}

type ViewMode = 'kanban' | 'gantt';

const ProjectsTab = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'student' | 'staff' | 'mixed'>('all');
  const [showNewColumnInput, setShowNewColumnInput] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');
  
  // Default columns
  const [columns, setColumns] = useState<KanbanColumn[]>([
    { id: 'todo', title: 'To Do', icon: FileText, order: 0 },
    { id: 'inprogress', title: 'In Progress', icon: Clock, order: 1 },
    { id: 'review', title: 'Review', icon: Eye, order: 2 },
    { id: 'done', title: 'Done', icon: CheckCircle, order: 3 },
  ]);

  // Sample Members
  const members: Member[] = [
    { id: '1', name: 'John Doe', initials: 'JD', color: 'blue' },
    { id: '2', name: 'Sarah Miller', initials: 'SM', color: 'green' },
    { id: '3', name: 'Alex Kim', initials: 'AK', color: 'purple' },
    { id: '4', name: 'Dr. Roberts', initials: 'DR', color: 'red' },
    { id: '5', name: 'Mary Johnson', initials: 'MJ', color: 'blue' },
    { id: '6', name: 'Lisa White', initials: 'LW', color: 'pink' },
    { id: '7', name: 'Prof. Smith', initials: 'PS', color: 'purple' },
    { id: '8', name: 'Tom Kelly', initials: 'TK', color: 'green' },
    { id: '9', name: 'Rachel Brown', initials: 'RB', color: 'orange' },
    { id: '10', name: 'Nina Kumar', initials: 'NK', color: 'pink' },
  ];

  // Sample Projects
  const projects: Project[] = [
    {
      id: '1',
      title: 'Research Web Portal',
      description: 'Developing a comprehensive web portal for research paper management',
      type: 'student',
      startDate: '2025-10-01',
      endDate: '2025-11-15',
      progress: 65,
      members: [members[0], members[1], members[2]],
      status: 'active',
      department: 'Computer Science',
      priority: 'high'
    },
    {
      id: '2',
      title: 'Curriculum Redesign 2025',
      description: 'Complete overhaul of Computer Science curriculum',
      type: 'staff',
      startDate: '2025-09-15',
      endDate: '2025-12-20',
      progress: 42,
      members: [members[3], members[4], members[5]],
      status: 'active',
      department: 'Administration',
      priority: 'high'
    },
    {
      id: '3',
      title: 'AI Research Initiative',
      description: 'Joint research project exploring machine learning applications',
      type: 'mixed',
      startDate: '2025-09-01',
      endDate: '2026-01-30',
      progress: 78,
      members: [members[6], members[7], members[8]],
      status: 'active',
      department: 'Computer Science',
      priority: 'medium'
    },
    {
      id: '4',
      title: 'Mobile App Development',
      description: 'Creating a campus navigation and event management app',
      type: 'student',
      startDate: '2025-10-15',
      endDate: '2025-11-30',
      progress: 34,
      members: [members[9], members[0]],
      status: 'planning',
      department: 'Computer Science',
      priority: 'medium'
    },
    {
      id: '5',
      title: 'Digital Library System',
      description: 'Modernizing the library management system',
      type: 'mixed',
      startDate: '2025-10-01',
      endDate: '2025-12-15',
      progress: 56,
      members: [members[1], members[3]],
      status: 'active',
      department: 'Library',
      priority: 'high'
    },
    {
      id: '6',
      title: 'Faculty Development Program',
      description: 'Organizing training workshops and seminars',
      type: 'staff',
      startDate: '2025-10-20',
      endDate: '2025-11-10',
      progress: 89,
      members: [members[4], members[5]],
      status: 'active',
      department: 'HR',
      priority: 'low'
    },
    {
      id: '7',
      title: 'Student Feedback System',
      description: 'Building an automated system for collecting and analyzing student feedback',
      type: 'mixed',
      startDate: '2025-09-20',
      endDate: '2025-12-01',
      progress: 45,
      members: [members[2], members[6], members[8]],
      status: 'active',
      department: 'Administration',
      priority: 'high'
    },
    {
      id: '8',
      title: 'Blockchain Research Lab',
      description: 'Establishing a research lab for blockchain and cryptocurrency studies',
      type: 'staff',
      startDate: '2025-10-01',
      endDate: '2026-02-28',
      progress: 28,
      members: [members[3], members[7]],
      status: 'planning',
      department: 'Computer Science',
      priority: 'medium'
    },
    {
      id: '9',
      title: 'E-Learning Platform',
      description: 'Developing an interactive online learning platform with video streaming',
      type: 'student',
      startDate: '2025-09-10',
      endDate: '2025-12-10',
      progress: 72,
      members: [members[0], members[2], members[9]],
      status: 'active',
      department: 'Computer Science',
      priority: 'high'
    },
    {
      id: '10',
      title: 'Campus Sustainability Initiative',
      description: 'Implementing green technologies and sustainable practices across campus',
      type: 'mixed',
      startDate: '2025-08-15',
      endDate: '2026-03-30',
      progress: 38,
      members: [members[1], members[4], members[6], members[8]],
      status: 'active',
      department: 'Facilities',
      priority: 'medium'
    },
    {
      id: '11',
      title: 'Alumni Network Platform',
      description: 'Creating a digital platform to connect alumni and current students',
      type: 'staff',
      startDate: '2025-10-05',
      endDate: '2025-12-31',
      progress: 51,
      members: [members[5], members[7]],
      status: 'active',
      department: 'Alumni Relations',
      priority: 'medium'
    },
    {
      id: '12',
      title: 'Virtual Reality Lab Setup',
      description: 'Setting up a VR lab for immersive learning experiences',
      type: 'mixed',
      startDate: '2025-09-25',
      endDate: '2025-11-20',
      progress: 62,
      members: [members[2], members[3], members[9]],
      status: 'active',
      department: 'Engineering',
      priority: 'high'
    },
    {
      id: '13',
      title: 'Smart Classroom Integration',
      description: 'Upgrading classrooms with IoT devices and smart technology',
      type: 'staff',
      startDate: '2025-10-10',
      endDate: '2026-01-15',
      progress: 15,
      members: [members[4], members[6]],
      status: 'planning',
      department: 'IT',
      priority: 'high'
    },
    {
      id: '14',
      title: 'Student Hackathon 2025',
      description: 'Organizing and managing the annual student hackathon event',
      type: 'student',
      startDate: '2025-10-20',
      endDate: '2025-11-05',
      progress: 85,
      members: [members[0], members[1], members[9]],
      status: 'active',
      department: 'Computer Science',
      priority: 'medium'
    },
    {
      id: '15',
      title: 'Research Publication Portal',
      description: 'Platform for faculty to publish and share research papers',
      type: 'mixed',
      startDate: '2025-09-01',
      endDate: '2025-12-20',
      progress: 54,
      members: [members[3], members[5], members[7]],
      status: 'active',
      department: 'Research',
      priority: 'medium'
    },
    {
      id: '16',
      title: 'Cybersecurity Awareness Program',
      description: 'Comprehensive cybersecurity training for staff and students',
      type: 'staff',
      startDate: '2025-10-01',
      endDate: '2025-11-30',
      progress: 68,
      members: [members[2], members[8]],
      status: 'active',
      department: 'IT',
      priority: 'high'
    },
    {
      id: '17',
      title: 'Student Mental Health App',
      description: 'Mobile application for mental health support and counseling services',
      type: 'student',
      startDate: '2025-09-15',
      endDate: '2025-12-01',
      progress: 47,
      members: [members[1], members[9]],
      status: 'active',
      department: 'Student Services',
      priority: 'high'
    },
    {
      id: '18',
      title: 'Data Analytics Dashboard',
      description: 'Creating centralized analytics dashboard for institutional data',
      type: 'mixed',
      startDate: '2025-10-08',
      endDate: '2026-01-10',
      progress: 31,
      members: [members[0], members[4], members[6]],
      status: 'active',
      department: 'Administration',
      priority: 'medium'
    },
    {
      id: '19',
      title: 'International Student Onboarding',
      description: 'Streamlining the onboarding process for international students',
      type: 'staff',
      startDate: '2025-09-20',
      endDate: '2025-11-25',
      progress: 76,
      members: [members[5], members[7], members[8]],
      status: 'active',
      department: 'International Office',
      priority: 'high'
    },
    {
      id: '20',
      title: 'Open Source Contribution Initiative',
      description: 'Encouraging students to contribute to open source projects',
      type: 'student',
      startDate: '2025-10-01',
      endDate: '2026-03-31',
      progress: 22,
      members: [members[0], members[2], members[9]],
      status: 'planning',
      department: 'Computer Science',
      priority: 'low'
    },
  ];

  // Sample Tasks
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 't1',
      title: 'Design database schema',
      projectId: '1',
      labels: [{ type: 'feature', text: 'Feature' }, { type: 'urgent', text: 'High Priority' }],
      assignee: members[0],
      startDate: '2025-10-26',
      endDate: '2025-11-02',
      column: 'todo'
    },
    {
      id: 't2',
      title: 'Create user authentication module',
      projectId: '1',
      labels: [{ type: 'feature', text: 'Feature' }],
      assignee: members[1],
      startDate: '2025-10-28',
      endDate: '2025-11-05',
      column: 'todo'
    },
    {
      id: 't3',
      title: 'Setup CI/CD pipeline',
      projectId: '1',
      labels: [{ type: 'devops', text: 'DevOps' }],
      assignee: members[2],
      startDate: '2025-10-27',
      endDate: '2025-11-03',
      column: 'todo'
    },
    {
      id: 't4',
      title: 'Write API documentation',
      projectId: '1',
      labels: [{ type: 'documentation', text: 'Documentation' }],
      assignee: members[0],
      startDate: '2025-11-01',
      endDate: '2025-11-08',
      column: 'todo'
    },
    {
      id: 't5',
      title: 'Design landing page mockups',
      projectId: '1',
      labels: [{ type: 'design', text: 'Design' }],
      assignee: members[1],
      startDate: '2025-10-29',
      endDate: '2025-11-04',
      column: 'todo'
    },
    {
      id: 't6',
      title: 'Implement search functionality',
      projectId: '1',
      labels: [{ type: 'feature', text: 'Feature' }, { type: 'urgent', text: 'High Priority' }],
      assignee: members[0],
      startDate: '2025-10-20',
      endDate: '2025-10-30',
      column: 'inprogress'
    },
    {
      id: 't7',
      title: 'Build responsive dashboard',
      projectId: '1',
      labels: [{ type: 'uiux', text: 'UI/UX' }],
      assignee: members[2],
      startDate: '2025-10-18',
      endDate: '2025-10-28',
      column: 'inprogress'
    },
    {
      id: 't8',
      title: 'Integrate payment gateway',
      projectId: '1',
      labels: [{ type: 'backend', text: 'Backend' }],
      assignee: members[0],
      startDate: '2025-10-22',
      endDate: '2025-11-01',
      column: 'inprogress'
    },
    {
      id: 't9',
      title: 'Fix login page responsiveness',
      projectId: '1',
      labels: [{ type: 'bug', text: 'Bug' }],
      assignee: members[1],
      startDate: '2025-10-20',
      endDate: '2025-10-26',
      column: 'review'
    },
    {
      id: 't10',
      title: 'Add email notifications',
      projectId: '1',
      labels: [{ type: 'feature', text: 'Feature' }],
      assignee: members[1],
      startDate: '2025-10-18',
      endDate: '2025-10-25',
      column: 'review'
    },
    {
      id: 't11',
      title: 'Optimize database queries',
      projectId: '1',
      labels: [{ type: 'performance', text: 'Performance' }],
      assignee: members[0],
      startDate: '2025-10-19',
      endDate: '2025-10-27',
      column: 'review'
    },
    {
      id: 't12',
      title: 'Update user guide',
      projectId: '1',
      labels: [{ type: 'documentation', text: 'Documentation' }],
      assignee: members[0],
      startDate: '2025-10-17',
      endDate: '2025-10-24',
      column: 'review'
    },
    {
      id: 't13',
      title: 'Setup project repository',
      projectId: '1',
      labels: [{ type: 'setup', text: 'Setup' }],
      assignee: members[2],
      startDate: '2025-10-01',
      endDate: '2025-10-15',
      column: 'done'
    },
    {
      id: 't14',
      title: 'Create wireframes',
      projectId: '1',
      labels: [{ type: 'design', text: 'Design' }],
      assignee: members[1],
      startDate: '2025-10-05',
      endDate: '2025-10-18',
      column: 'done'
    },
    {
      id: 't15',
      title: 'Initialize database',
      projectId: '1',
      labels: [{ type: 'backend', text: 'Backend' }],
      assignee: members[0],
      startDate: '2025-10-08',
      endDate: '2025-10-20',
      column: 'done'
    },
  ]);

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      if (activeFilter === 'all') return true;
      return project.type === activeFilter;
    });
  }, [activeFilter]);

  const getTasksByColumn = (columnId: string) => {
    if (!selectedProject) return [];
    return tasks.filter(task => task.column === columnId && task.projectId === selectedProject.id);
  };

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (columnId: string) => {
    if (draggedTask) {
      setTasks(tasks.map(task =>
        task.id === draggedTask.id ? { ...task, column: columnId } : task
      ));
      setDraggedTask(null);
    }
  };

  const handleAddColumn = () => {
    if (newColumnName.trim()) {
      const newColumn: KanbanColumn = {
        id: `custom-${Date.now()}`,
        title: newColumnName.trim(),
        order: columns.length
      };
      setColumns([...columns, newColumn]);
      setNewColumnName('');
      setShowNewColumnInput(false);
    }
  };

  const handleDeleteColumn = (columnId: string) => {
    // Don't allow deleting default columns
    const defaultColumns = ['todo', 'inprogress', 'review', 'done'];
    if (defaultColumns.includes(columnId)) {
      alert('Cannot delete default columns');
      return;
    }
    
    // Move tasks from deleted column to 'todo'
    setTasks(tasks.map(task =>
      task.column === columnId ? { ...task, column: 'todo' } : task
    ));
    
    setColumns(columns.filter(col => col.id !== columnId));
  };

  // Gantt Chart Helpers
  const getDatePosition = (date: string, minDate: Date, maxDate: Date) => {
    const dateObj = new Date(date);
    const totalDays = (maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24);
    const daysPassed = (dateObj.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24);
    return (daysPassed / totalDays) * 100;
  };

  const getDuration = (startDate: string, endDate: string, minDate: Date, maxDate: Date) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalDays = (maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24);
    const projectDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    return (projectDays / totalDays) * 100;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Get min and max dates for Gantt chart
  const getDateRange = () => {
    const allDates = filteredProjects.flatMap(p => [new Date(p.startDate), new Date(p.endDate)]);
    const minDate = new Date(Math.min(...allDates.map(d => d.getTime())));
    const maxDate = new Date(Math.max(...allDates.map(d => d.getTime())));
    
    // Add padding
    minDate.setDate(minDate.getDate() - 7);
    maxDate.setDate(maxDate.getDate() + 7);
    
    return { minDate, maxDate };
  };

  // Generate month markers for Gantt
  const generateMonthMarkers = (minDate: Date, maxDate: Date) => {
    const markers = [];
    const current = new Date(minDate);
    current.setDate(1);
    
    while (current <= maxDate) {
      const position = getDatePosition(current.toISOString(), minDate, maxDate);
      markers.push({
        position,
        label: current.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      });
      current.setMonth(current.getMonth() + 1);
    }
    
    return markers;
  };

  // Components
  const TaskCard: React.FC<{ task: Task }> = ({ task }) => (
    <div
      className="task-card"
      draggable
      onDragStart={() => handleDragStart(task)}
    >
      <div className="task-title">{task.title}</div>
      <div className="task-labels">
        {task.labels.map((label, index) => (
          <span key={index} className={`task-label label-${label.type}`}>
            {label.text}
          </span>
        ))}
      </div>
      <div className="task-footer">
        {task.assignee && (
          <div className="task-members">
            <div className={`member-avatar avatar-${task.assignee.color}`}>
              {task.assignee.initials}
            </div>
          </div>
        )}
        <span className="task-date">
          <Calendar size={12} style={{ display: 'inline', marginRight: '4px' }} />
          {formatDate(task.endDate)}
        </span>
      </div>
    </div>
  );

  const KanbanColumn: React.FC<{
    column: KanbanColumn;
    tasks: Task[];
    onDelete?: (columnId: string) => void;
  }> = ({ column, tasks, onDelete }) => {
    const defaultColumns = ['todo', 'inprogress', 'review', 'done'];
    const isDefaultColumn = defaultColumns.includes(column.id);
    const Icon = column.icon || List;

    return (
      <div
        className="kanban-column"
        onDragOver={handleDragOver}
        onDrop={() => handleDrop(column.id)}
      >
        <div className="column-header">
          <div className="column-title">
            <Icon size={16} />
            <span>{column.title}</span>
            <span className="column-count">{tasks.length}</span>
          </div>
          {!isDefaultColumn && onDelete && (
            <button 
              className="column-delete-btn"
              onClick={() => onDelete(column.id)}
              title="Delete column"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <div className="column-cards">
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
        <button className="add-card-btn">
          <Plus size={16} />
          <span>Add Task</span>
        </button>
      </div>
    );
  };

  const KanbanView: React.FC = () => {
    if (!selectedProject) {
      return (
        <div className="no-selection">
          <div className="no-selection-icon">
            <Folder size={64} color="#cbd5e1" />
          </div>
          <h3>Select a project to view tasks</h3>
          <p>Choose a project from the list to see its Kanban board</p>
        </div>
      );
    }

    return (
      <div className="kanban-view">
        <div className="project-header-info">
          <div className="project-header-main">
            <h2>{selectedProject.title}</h2>
            <span className={`project-type type-${selectedProject.type}`}>
              {selectedProject.type === 'student' ? 'Student' : 
               selectedProject.type === 'staff' ? 'Staff' : 'Student-Staff'}
            </span>
          </div>
          <p className="project-description-header">{selectedProject.description}</p>
          <div className="project-meta-header">
            <span>
              <Building size={14} style={{ display: 'inline', marginRight: '4px' }} />
              {selectedProject.department}
            </span>
            <span>
              <Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} />
              {formatDate(selectedProject.startDate)} - {formatDate(selectedProject.endDate)}
            </span>
            <span>
              <Users size={14} style={{ display: 'inline', marginRight: '4px' }} />
              {selectedProject.members.length} members
            </span>
          </div>
        </div>

        <div className="kanban-board">
          {columns.sort((a, b) => a.order - b.order).map(column => (
            <KanbanColumn
              key={column.id}
              column={column}
              tasks={getTasksByColumn(column.id)}
              onDelete={handleDeleteColumn}
            />
          ))}
          
          {/* Add New Column */}
          {showNewColumnInput ? (
            <div className="kanban-column new-column-input">
              <div className="column-header">
                <input
                  type="text"
                  className="new-column-name-input"
                  placeholder="Enter list name..."
                  value={newColumnName}
                  onChange={(e) => setNewColumnName(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddColumn();
                    } else if (e.key === 'Escape') {
                      setShowNewColumnInput(false);
                      setNewColumnName('');
                    }
                  }}
                  autoFocus
                />
              </div>
              <div className="new-column-actions">
                <button className="btn btn-primary btn-sm" onClick={handleAddColumn}>
                  Add list
                </button>
                <button 
                  className="btn-icon" 
                  onClick={() => {
                    setShowNewColumnInput(false);
                    setNewColumnName('');
                  }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          ) : (
            <button className="add-column-btn" onClick={() => setShowNewColumnInput(true)}>
              <Plus size={16} />
              <span>Add another list</span>
            </button>
          )}
        </div>
      </div>
    );
  };

  const GanttView: React.FC = () => {
    const { minDate, maxDate } = getDateRange();
    const monthMarkers = generateMonthMarkers(minDate, maxDate);

    return (
      <div className="gantt-view">
        <div className="gantt-header">
          <div className="gantt-sidebar-header">Project</div>
          <div className="gantt-timeline-header">
            <div className="timeline-months">
              {monthMarkers.map((marker, index) => (
                <div
                  key={index}
                  className="timeline-month"
                  style={{ left: `${marker.position}%` }}
                >
                  {marker.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="gantt-body">
          {filteredProjects.map((project) => {
            const startPos = getDatePosition(project.startDate, minDate, maxDate);
            const width = getDuration(project.startDate, project.endDate, minDate, maxDate);
            
            return (
              <div
                key={project.id}
                className={`gantt-row ${selectedProject?.id === project.id ? 'selected' : ''}`}
                onClick={() => setSelectedProject(project)}
              >
                <div className="gantt-sidebar">
                  <div className="gantt-project-info">
                    <div className="gantt-project-title">{project.title}</div>
                    <div className="gantt-project-meta">
                      <span className={`project-type-small type-${project.type}`}>
                        {project.type === 'student' ? 'Student' : 
                         project.type === 'staff' ? 'Staff' : 'Mixed'}
                      </span>
                      <span className="gantt-project-department">{project.department}</span>
                    </div>
                  </div>
                </div>
                <div className="gantt-timeline">
                  <div className="gantt-grid">
                    {monthMarkers.map((_, index) => (
                      <div key={index} className="gantt-grid-line"></div>
                    ))}
                  </div>
                  <div
                    className={`gantt-bar priority-${project.priority}`}
                    style={{
                      left: `${startPos}%`,
                      width: `${width}%`
                    }}
                  >
                    <div className="gantt-bar-progress" style={{ width: `${project.progress}%` }}></div>
                    <div className="gantt-bar-content">
                      <span className="gantt-bar-text">{project.progress}%</span>
                      <div className="gantt-bar-members">
                        {project.members.slice(0, 3).map((member) => (
                          <div key={member.id} className={`member-avatar-small avatar-${member.color}`}>
                            {member.initials}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="gantt-dates">
                    <span className="gantt-start-date">{formatDate(project.startDate)}</span>
                    <span className="gantt-end-date">{formatDate(project.endDate)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const NewProjectModal: React.FC = () => (
    <div
      className={`modal ${showNewProjectModal ? 'active' : ''}`}
      onClick={() => setShowNewProjectModal(false)}
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Project</h2>
          <button className="close-modal" onClick={() => setShowNewProjectModal(false)}>
            <X size={20} />
          </button>
        </div>
        <div className="modal-body">
          <form onSubmit={(e) => { e.preventDefault(); setShowNewProjectModal(false); }}>
            <div className="form-group">
              <label>Project Name</label>
              <input type="text" placeholder="Enter project name" required />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea placeholder="Describe your project" required></textarea>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Project Type</label>
                <select required>
                  <option value="">Select type</option>
                  <option value="student">Student Project</option>
                  <option value="staff">Staff Project</option>
                  <option value="mixed">Student-Staff Project</option>
                </select>
              </div>

              <div className="form-group">
                <label>Department</label>
                <select required>
                  <option value="">Select department</option>
                  <option value="cs">Computer Science</option>
                  <option value="eng">Engineering</option>
                  <option value="business">Business</option>
                  <option value="arts">Arts & Design</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Start Date</label>
                <input type="date" required />
              </div>

              <div className="form-group">
                <label>End Date</label>
                <input type="date" required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Priority</label>
                <select required>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="form-group">
                <label>Status</label>
                <select required>
                  <option value="planning">Planning</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Team Members</label>
              <input type="text" placeholder="Search and add team members" />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '30px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowNewProjectModal(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                <Plus size={16} />
                <span>Create Project</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <div className="projects-tab">
      {/* Header */}
      <div className="projects-header">
        <div className="projects-header-left">
          <h1>Projects</h1>
          <div className="view-switcher">
            <button
              className={`view-btn ${viewMode === 'kanban' ? 'active' : ''}`}
              onClick={() => setViewMode('kanban')}
            >
              <Kanban size={18} />
              <span>Kanban</span>
            </button>
            <button
              className={`view-btn ${viewMode === 'gantt' ? 'active' : ''}`}
              onClick={() => setViewMode('gantt')}
            >
              <BarChart2 size={18} />
              <span>Gantt</span>
            </button>
          </div>
        </div>
        
        {/* Filter Tabs - Now in header */}
        <div className="projects-header-middle">
          <div className="filter-tabs">
            {(['all', 'student', 'staff', 'mixed'] as const).map(filter => (
              <div
                key={filter}
                className={`tab ${activeFilter === filter ? 'active' : ''}`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter === 'all' ? 'All Projects' :
                  filter === 'student' ? 'Student Projects' :
                    filter === 'staff' ? 'Staff Projects' :
                      'Student-Staff Projects'}
              </div>
            ))}
          </div>
        </div>
        
        <div className="projects-header-right">
          <button className="btn btn-secondary">
            <Search size={16} />
            <span>Search</span>
          </button>
          <button className="btn btn-primary" onClick={() => setShowNewProjectModal(true)}>
            <Plus size={16} />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="projects-content">
        {/* Projects List Sidebar */}
        <div className="projects-list">
          <div className="projects-list-header">
            <h3>
              <FolderOpen size={16} style={{ display: 'inline', marginRight: '8px' }} />
              Projects ({filteredProjects.length})
            </h3>
          </div>
          <div className="projects-list-items">
            {filteredProjects.map(project => (
              <div
                key={project.id}
                className={`project-list-item ${selectedProject?.id === project.id ? 'selected' : ''}`}
                onClick={() => setSelectedProject(project)}
              >
                <div className="project-list-item-header">
                  <div className="project-list-item-title">{project.title}</div>
                  <span className={`project-type-small type-${project.type}`}>
                    {project.type === 'student' ? 'S' : project.type === 'staff' ? 'F' : 'M'}
                  </span>
                  <span className={`status-badge-small status-${project.status}`}>
                    {project.status}
                  </span>
                </div>
                <div className="project-list-item-meta">
                  <span className="project-list-item-department">{project.department}</span>
                </div>
                <div className="project-list-item-progress">
                  <div className="progress-bar-small">
                    <div className="progress-fill-small" style={{ width: `${project.progress}%` }}></div>
                  </div>
                  <span className="progress-text-small">{project.progress}%</span>
                </div>
                
              </div>
            ))}
          </div>
        </div>

        {/* View Area */}
        <div className="view-area">
          {viewMode === 'kanban' ? <KanbanView /> : <GanttView />}
        </div>
      </div>

      {/* Modal */}
      <NewProjectModal />
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
const sampleUsers: UserAccount[] = [
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
    permissions: ["students_view", "lecturers_view", "departments_view", "departments_operations", "finance_view"],
    tabAccess: []
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
    permissions: ["students_view", "students_edit", "lecturers_view", "events_view"],
    tabAccess: []
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
    tabAccess: []
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
    tabAccess: []
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
    tabAccess: []
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
    permissions: ["students_view", "classes_view", "timetable_manage", "documents_view"],
    tabAccess: []
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
    tabAccess: []
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
    tabAccess: []
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
    tabAccess: []
  },
];

const AccountManagement = () => {
  const [users, setUsers] = useState<UserAccount[]>(sampleUsers);
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "detail" | "create">("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<RoleLevel | "all">("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive" | "suspended">("all");
  const [activeTab, setActiveTab] = useState<"info" | "permissions" | "tabs" | "activity">("info");
  
  // Editing states
  const [editingPermissions, setEditingPermissions] = useState<string[]>([]);
  const [editingTabAccess, setEditingTabAccess] = useState<TabAccess[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  // Filter users
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.department.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = filterRole === "all" || user.role === filterRole;
      const matchesStatus = filterStatus === "all" || user.status === filterStatus;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, filterRole, filterStatus]);

  // Group permissions by category
  const groupedPermissions = useMemo(() => {
    const groups: Record<string, Permission[]> = {};
    permissionsList.forEach(perm => {
      if (!groups[perm.category]) {
        groups[perm.category] = [];
      }
      groups[perm.category].push(perm);
    });
    return groups;
  }, []);

  const handleUserSelect = (user: UserAccount) => {
    setSelectedUser(user);
    setEditingPermissions(user.permissions);
    setEditingTabAccess(
      availableTabs.map(tab => ({
        tabId: tab.toLowerCase().replace(/\//g, "_"),
        tabName: tab,
        canView: true,
        canEdit: false,
        canDelete: false,
        canExport: false
      }))
    );
    setViewMode("detail");
    setIsEditing(false);
  };

  const handleSavePermissions = () => {
    if (selectedUser) {
      const updatedUsers = users.map(u => 
        u.id === selectedUser.id 
          ? { ...u, permissions: editingPermissions, tabAccess: editingTabAccess }
          : u
      );
      setUsers(updatedUsers);
      setSelectedUser({ ...selectedUser, permissions: editingPermissions, tabAccess: editingTabAccess });
      setIsEditing(false);
    }
  };

  const togglePermission = (permId: string) => {
    if (editingPermissions.includes(permId)) {
      setEditingPermissions(editingPermissions.filter(p => p !== permId));
    } else {
      setEditingPermissions([...editingPermissions, permId]);
    }
  };

  const updateTabAccess = (tabId: string, field: keyof TabAccess, value: boolean) => {
    setEditingTabAccess(editingTabAccess.map(tab =>
      tab.tabId === tabId ? { ...tab, [field]: value } : tab
    ));
  };

  const getRoleInfo = (roleId: RoleLevel) => {
    return roleHierarchy.find(r => r.id === roleId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-700";
      case "inactive": return "bg-gray-100 text-gray-700";
      case "suspended": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <CheckCircle className="w-4 h-4" />;
      case "inactive": return <XCircle className="w-4 h-4" />;
      case "suspended": return <AlertCircle className="w-4 h-4" />;
      default: return <XCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Account Management</h1>
          <p className="text-gray-600">Manage user accounts, roles, and access permissions</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {/* TODO: Implement import functionality */}}
            className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            Import List
          </button>
          <button
            onClick={() => setViewMode("create")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create User
          </button>
        </div>
      </div>

      {viewMode === "list" ? (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold text-green-600">
                    {users.filter(u => u.status === "active").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Roles</p>
                  <p className="text-2xl font-bold text-gray-900">{roleHierarchy.length}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Permissions</p>
                  <p className="text-2xl font-bold text-gray-900">{permissionsList.length}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Key className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by name, email, or department..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value as RoleLevel | "all")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Roles</option>
                  {roleHierarchy.map(role => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>
          </div>

          {/* User List */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permissions</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map(user => {
                    const roleInfo = getRoleInfo(user.role);
                    return (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div
                              className="px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"
                              style={{ backgroundColor: `${roleInfo?.color}20`, color: roleInfo?.color }}
                            >
                              {roleInfo?.icon}
                              {roleInfo?.name}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.role === "rector" ? (
                            <span className="text-gray-400 italic">No Department</span>
                          ) : (
                            user.department
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                            {getStatusIcon(user.status)}
                            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {user.lastLogin}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {user.permissions.length} assigned
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleUserSelect(user)}
                            className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : viewMode === "create" ? (
        /* Create User Form */
        <div className="space-y-6">
          {/* Back Button */}
          <button
            onClick={() => setViewMode("list")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Back to User List
          </button>

          {/* Form Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Create New User</h2>
              <p className="text-sm text-gray-600 mt-1">Fill in the information below to create a new user account</p>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Information Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter full name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="email@hsb.edu.vn"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="+84 XXX XXX XXX"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role <span className="text-red-500">*</span>
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="">Select a role</option>
                      {roleHierarchy.map(role => (
                        <option key={role.id} value={role.id}>{role.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department <span className="text-red-500">*</span>
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="">Select a department</option>
                      <option value="administration">Administration</option>
                      <option value="business">Faculty of Business Administration</option>
                      <option value="marketing">Faculty of Marketing & Communication</option>
                      <option value="it">Faculty of Information Technology</option>
                      <option value="economics">Faculty of Economics</option>
                      <option value="accounting">Faculty of Accounting & Finance</option>
                      <option value="hr">Human Resources</option>
                      <option value="international">International Relations</option>
                      <option value="academic">Academic Affairs</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Status <span className="text-red-500">*</span>
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Quick Permissions Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Key className="w-5 h-5 text-blue-600" />
                  Quick Permissions Assignment
                </h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-blue-800 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Select a permission template based on the user&#39;s role, or customize permissions after creation
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <button className="p-4 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left">
                    <div className="font-semibold text-gray-900 mb-1">Basic Access</div>
                    <div className="text-xs text-gray-600">View-only permissions for most modules</div>
                  </button>
                  <button className="p-4 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left">
                    <div className="font-semibold text-gray-900 mb-1">Standard Access</div>
                    <div className="text-xs text-gray-600">View and edit permissions for assigned modules</div>
                  </button>
                  <button className="p-4 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left">
                    <div className="font-semibold text-gray-900 mb-1">Full Access</div>
                    <div className="text-xs text-gray-600">Complete access to all system features</div>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    // TODO: Implement create user logic
                    setViewMode("list");
                  }}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 font-medium"
                >
                  <Plus className="w-5 h-5" />
                  Create User Account
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center justify-center gap-2 font-medium"
                >
                  <X className="w-5 h-5" />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Detail View */
        <div className="space-y-6">
          {/* Back Button */}
          <button
            onClick={() => setViewMode("list")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Back to User List
          </button>

          {selectedUser && (
            <>
              {/* User Header Card */}
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {selectedUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedUser.name}</h2>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-gray-600">
                          <Mail className="w-4 h-4" />
                          {selectedUser.email}
                        </span>
                        <span className="flex items-center gap-1 text-gray-600">
                          <Phone className="w-4 h-4" />
                          {selectedUser.phone}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        {(() => {
                          const roleInfo = getRoleInfo(selectedUser.role);
                          return (
                            <span
                              className="px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"
                              style={{ backgroundColor: `${roleInfo?.color}20`, color: roleInfo?.color }}
                            >
                              {roleInfo?.icon}
                              {roleInfo?.name}
                            </span>
                          );
                        })()}
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedUser.status)}`}>
                          {getStatusIcon(selectedUser.status)}
                          {selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Edit Access
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={handleSavePermissions}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                        >
                          <Save className="w-4 h-4" />
                          Save Changes
                        </button>
                        <button
                          onClick={() => {
                            setIsEditing(false);
                            setEditingPermissions(selectedUser.permissions);
                          }}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-2"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="border-b border-gray-200">
                  <nav className="flex">
                    <button
                      onClick={() => setActiveTab("info")}
                      className={`px-6 py-3 text-sm font-medium ${
                        activeTab === "info"
                          ? "border-b-2 border-blue-600 text-blue-600"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Basic Information
                    </button>
                    <button
                      onClick={() => setActiveTab("permissions")}
                      className={`px-6 py-3 text-sm font-medium ${
                        activeTab === "permissions"
                          ? "border-b-2 border-blue-600 text-blue-600"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Permissions
                    </button>
                    <button
                      onClick={() => setActiveTab("tabs")}
                      className={`px-6 py-3 text-sm font-medium ${
                        activeTab === "tabs"
                          ? "border-b-2 border-blue-600 text-blue-600"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Tab Access
                    </button>
                    <button
                      onClick={() => setActiveTab("activity")}
                      className={`px-6 py-3 text-sm font-medium ${
                        activeTab === "activity"
                          ? "border-b-2 border-blue-600 text-blue-600"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Activity Log
                    </button>
                  </nav>
                </div>

                <div className="p-6">
                  {/* Basic Information Tab */}
                  {activeTab === "info" && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                          <input
                            type="text"
                            value={selectedUser.name}
                            disabled
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                          <input
                            type="email"
                            value={selectedUser.email}
                            disabled
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                          <input
                            type="tel"
                            value={selectedUser.phone}
                            disabled
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                          <input
                            type="text"
                            value={selectedUser.role === "rector" ? "N/A - University Level" : selectedUser.department}
                            disabled
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                          <input
                            type="text"
                            value={getRoleInfo(selectedUser.role)?.name || ""}
                            disabled
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Account Status</label>
                          <input
                            type="text"
                            value={selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)}
                            disabled
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Last Login</label>
                          <input
                            type="text"
                            value={selectedUser.lastLogin}
                            disabled
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Account Created</label>
                          <input
                            type="text"
                            value={selectedUser.createdAt}
                            disabled
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Permissions Tab */}
                  {activeTab === "permissions" && (
                    <div className="space-y-4">
                      {Object.entries(groupedPermissions).map(([category, perms]) => (
                        <div key={category} className="border border-gray-200 rounded-lg overflow-hidden">
                          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                            <h3 className="text-sm font-semibold text-gray-900">{category}</h3>
                          </div>
                          <div className="p-4 space-y-2">
                            {perms.map(perm => (
                              <label
                                key={perm.id}
                                className={`flex items-center justify-between p-3 rounded-lg border ${
                                  isEditing ? "cursor-pointer hover:bg-gray-50" : ""
                                } ${
                                  editingPermissions.includes(perm.id)
                                    ? "border-blue-300 bg-blue-50"
                                    : "border-gray-200"
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <input
                                    type="checkbox"
                                    checked={editingPermissions.includes(perm.id)}
                                    onChange={() => isEditing && togglePermission(perm.id)}
                                    disabled={!isEditing}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                  />
                                  <div>
                                    <div className="text-sm font-medium text-gray-900">{perm.name}</div>
                                    <div className="text-xs text-gray-500">{perm.description}</div>
                                  </div>
                                </div>
                                {editingPermissions.includes(perm.id) && (
                                  <CheckCircle className="w-5 h-5 text-blue-600" />
                                )}
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tab Access Tab */}
                  {activeTab === "tabs" && (
                    <div className="space-y-4">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tab Name</th>
                              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">View</th>
                              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Edit</th>
                              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Delete</th>
                              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Export</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {editingTabAccess.map(tab => (
                              <tr key={tab.tabId} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-sm font-medium text-gray-900">{tab.tabName}</td>
                                <td className="px-4 py-3 text-center">
                                  <input
                                    type="checkbox"
                                    checked={tab.canView}
                                    onChange={(e) => isEditing && updateTabAccess(tab.tabId, "canView", e.target.checked)}
                                    disabled={!isEditing}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                  />
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <input
                                    type="checkbox"
                                    checked={tab.canEdit}
                                    onChange={(e) => isEditing && updateTabAccess(tab.tabId, "canEdit", e.target.checked)}
                                    disabled={!isEditing || !tab.canView}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                  />
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <input
                                    type="checkbox"
                                    checked={tab.canDelete}
                                    onChange={(e) => isEditing && updateTabAccess(tab.tabId, "canDelete", e.target.checked)}
                                    disabled={!isEditing || !tab.canView}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                  />
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <input
                                    type="checkbox"
                                    checked={tab.canExport}
                                    onChange={(e) => isEditing && updateTabAccess(tab.tabId, "canExport", e.target.checked)}
                                    disabled={!isEditing || !tab.canView}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Activity Log Tab */}
                  {activeTab === "activity" && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <AlertCircle className="w-5 h-5 text-blue-600" />
                        <span>Activity logs show recent account actions and system events</span>
                      </div>
                      
                      <div className="space-y-3">
                        {[
                          { action: "Logged in", time: "2025-10-29 09:15", icon: <User className="w-4 h-4" />, color: "bg-green-100 text-green-700" },
                          { action: "Updated permissions", time: "2025-10-28 14:30", icon: <Key className="w-4 h-4" />, color: "bg-blue-100 text-blue-700" },
                          { action: "Accessed Finance module", time: "2025-10-28 11:20", icon: <Eye className="w-4 h-4" />, color: "bg-purple-100 text-purple-700" },
                          { action: "Exported student data", time: "2025-10-27 16:45", icon: <Download className="w-4 h-4" />, color: "bg-orange-100 text-orange-700" },
                        ].map((log, idx) => (
                          <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 ${log.color} rounded-full flex items-center justify-center`}>
                                {log.icon}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">{log.action}</div>
                                <div className="text-xs text-gray-500">{log.time}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};





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
      return <ResearchManagement/>;
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
      return <Attendance />;
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
    if (activeTab == 'docu-manage'){
      return <DocumentManagement/>;
    }
    if (activeTab == 'projects'){
      return <ProjectsTab/>;
    }
    if (activeTab == 'shopping'){
      return <HSBShop/>;
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