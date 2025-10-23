import React, { useState, useEffect, useMemo} from "react";
import Student from "./student";
import Lecturer from "./lecturer";
import './index.css';  // <-- make sure this is here

import type { LucideIcon } from "lucide-react";   // ✅ Import type for icons
import RoleDropdown, { type RoleValue } from "./RoleDropdown";

import { navigationConfig, type UserType, type MenuItem } from "./navigation";

import { 
  ChevronDown, ChevronRight, Users, GraduationCap, BookOpen, Calendar, 
  DollarSign, FileText, Award, Clock, Building, Globe, Briefcase, 
  MessageSquare, Settings, BarChart3, TrendingUp, UserCheck, Home, 
  Search, Plus, ArrowRight, Bell, AlertTriangle, TrendingDown, 
  AlertCircle, Download, Filter, PieChart, ArrowUpRight, ArrowDownRight, 
  Target, MapPin, Star, CheckCircle, XCircle, User, Eye, Check,X, MessageCircle,
  Edit, Save, ShieldCheck, Phone, Mail 
} from "lucide-react";



// ✅ Utility renderer
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
  // ✅ Add generic types so state is typed
 const [userType, setUserType] = useState<UserType>("admin");
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [sidebarLocked, setSidebarLocked] = useState<boolean>(true);

  // ✅ compute navigation AFTER userType is declared
 const currentNav: MenuItem[] = useMemo(
  () => navigationConfig[userType] ?? navigationConfig.admin,
  [userType]
);

useEffect(() => {
  setExpandedMenus({});
  setActiveTab(currentNav[0]?.id ?? "dashboard");
}, [userType, currentNav]);

<aside key={userType} className="...">
  {/* your header + dropdown + nav */}
</aside>
  const toggleMenu = (menuId: string) =>
    setExpandedMenus((prev) => ({ ...prev, [menuId]: !prev[menuId] }));

const roleHasOwnSidebar = userType === "student" || userType === "lecturer";
if (roleHasOwnSidebar) {
  // Render their full apps (with their own left panels)
  return userType === "student" ? <Student /> : <Lecturer />;
}

  // navigationConfig stays same — but now TS will validate icons and submenu shape



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
    { name: 'Faculty of Management', students: 800, budget: 12500000, utilization: 78, performance: 92 },
    { name: 'Faculty of Marketing & Communication', students: 800, budget: 15800000, utilization: 85, performance: 88 },
    { name: 'Faculty of Nontraditonal Security', students: 800, budget: 9800000, utilization: 72, performance: 90 },
    { name: 'Institute of Nontraditional Security ', students: 1089, budget: 11200000, utilization: 81, performance: 87 },
    { name: 'Institute of Trainging & Management', students: 623, budget: 6400000, utilization: 68, performance: 85 }
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

      {/* KPI Performance & Publications/Patents */}
      <div className="grid grid-cols-3 gap-6 mb-8">
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
          
          <div className="space-y-6">
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

          <div className="space-y-5">
            {/* Journal Articles */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
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
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
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
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
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
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
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
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Important Events</h2>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
            View All Events
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {upcomingEvents.map((event, i) => (
            <div key={i} className={`p-6 ${event.color} rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer`}>
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
              {code: 'CS303', name: 'FONS', progress: 80}
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
      <div className="max-w-[1920px] mx-auto space-y-6">
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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Lecturer Profile Management</h1>
            <p className="text-sm text-gray-500 mt-1">Comprehensive faculty data and analytics</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus size={18} />
            Add New Lecturer
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Total Lecturers</p>
            <p className="text-2xl font-bold text-gray-900">297</p>
            <div className="mt-2 space-y-0.5">
              <p className="text-xs text-gray-600">Professors: 45 (15%)</p>
              <p className="text-xs text-gray-600">Associate: 102 (34%)</p>
              <p className="text-xs text-gray-600">Lecturers: 150 (51%)</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Total Teaching Hours</p>
            <p className="text-2xl font-bold text-gray-900">132,480h</p>
            <div className="mt-2 space-y-0.5">
              <p className="text-xs text-gray-600">Avg: 446h per lecturer</p>
              <p className="text-xs text-gray-600">This academic year</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Total Publications</p>
            <p className="text-2xl font-bold text-gray-900">1,248</p>
            <div className="mt-2 space-y-0.5">
              <p className="text-xs text-gray-600">Papers: 892</p>
              <p className="text-xs text-gray-600">Patents: 356</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Avg Workload</p>
            <p className="text-2xl font-bold text-gray-900">14.8h/week</p>
            <div className="mt-2 space-y-0.5">
              <p className="text-xs text-gray-600">Within standard range</p>
              <p className="text-xs text-gray-600">12-16h recommended</p>
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

  {/*research management for lecturer*/}

 

const ResearchManagement = () => {
  const [activeView, setActiveView] = useState('overview');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  const patentData = [
    {
      id: 'PAT001',
      title: 'AI-Based Medical Diagnostic System Using Deep Learning',
      inventors: ['Dr. Nguyen Van A', 'Dr. Tran Thi B', 'Dr. Le Van C'],
      applicationNumber: 'VN2024001234',
      applicationDate: '2024-01-15',
      status: 'Granted',
      grantDate: '2024-08-20',
      patentNumber: 'VN123456',
      type: 'Invention Patent',
      faculty: 'Faculty of Nontraditional Security',
      discipline: 'Nontraditional Security',
      abstract: 'A novel AI-based system for automated medical diagnosis using advanced deep learning algorithms for pattern recognition in medical imaging.',
      country: 'Vietnam',
      ipOffice: 'National Office of Intellectual Property (NOIP)'
    },
    {
      id: 'PAT002',
      title: 'Blockchain-Based Supply Chain Tracking Method',
      inventors: ['Dr. Pham Thi D', 'Dr. Hoang Van E'],
      applicationNumber: 'VN2024002345',
      applicationDate: '2024-03-10',
      status: 'Pending',
      grantDate: null,
      patentNumber: null,
      type: 'Invention Patent',
      faculty: 'Faculty of Management',
      discipline: 'Finance',
      abstract: 'A decentralized blockchain method for transparent and secure supply chain tracking with real-time verification capabilities.',
      country: 'Vietnam',
      ipOffice: 'National Office of Intellectual Property (NOIP)'
    },
    {
      id: 'PAT003',
      title: 'Quantum Encryption Algorithm for Secure Communications',
      inventors: ['Dr. Vo Thi F', 'Dr. Bui Van G', 'Dr. Cao Thi H'],
      applicationNumber: 'US2024098765',
      applicationDate: '2024-02-20',
      status: 'Granted',
      grantDate: '2024-09-15',
      patentNumber: 'US11,234,567',
      type: 'Invention Patent',
      faculty: 'Faculty of Nontraditional Security',
      discipline: 'Engineering & IT',
      abstract: 'A quantum-based encryption algorithm providing enhanced security for digital communications using quantum key distribution.',
      country: 'United States',
      ipOffice: 'United States Patent and Trademark Office (USPTO)'
    },
    {
      id: 'PAT004',
      title: 'IoT-Based Smart Agriculture Monitoring System',
      inventors: ['Dr. Mai Van K', 'Dr. Dang Thi L'],
      applicationNumber: 'VN2024003456',
      applicationDate: '2024-05-08',
      status: 'Under Examination',
      grantDate: null,
      patentNumber: null,
      type: 'Utility Model',
      faculty: 'Faculty of Nontraditional Security',
      discipline: 'Sustainable Development',
      abstract: 'An IoT-based system for real-time monitoring and optimization of agricultural processes using sensor networks and AI analytics.',
      country: 'Vietnam',
      ipOffice: 'National Office of Intellectual Property (NOIP)'
    },
    {
      id: 'PAT005',
      title: 'Digital Marketing Analytics Platform with AI',
      inventors: ['Dr. Nguyen Thi M', 'Dr. Phan Van N'],
      applicationNumber: 'VN2024004567',
      applicationDate: '2024-06-15',
      status: 'Pending',
      grantDate: null,
      patentNumber: null,
      type: 'Invention Patent',
      faculty: 'Faculty of Marketing and Communication',
      discipline: 'Marketing',
      abstract: 'An AI-powered platform for comprehensive digital marketing analytics with predictive consumer behavior modeling.',
      country: 'Vietnam',
      ipOffice: 'National Office of Intellectual Property (NOIP)'
    },
    {
      id: 'PAT006',
      title: 'Cybersecurity Threat Detection System',
      inventors: ['Dr. Le Van Q', 'Dr. Hoang Thi R'],
      applicationNumber: 'PCT/VN2024/00123',
      applicationDate: '2024-04-25',
      status: 'International Filing',
      grantDate: null,
      patentNumber: null,
      type: 'Invention Patent',
      faculty: 'Faculty of Nontraditional Security',
      discipline: 'Law & Criminology',
      abstract: 'An advanced system for real-time detection and prevention of cybersecurity threats using machine learning and behavioral analysis.',
      country: 'International (PCT)',
      ipOffice: 'World Intellectual Property Organization (WIPO)'
    },
    {
      id: 'PAT007',
      title: 'Sustainable Energy Management System for Smart Buildings',
      inventors: ['Dr. Bui Van S', 'Dr. Cao Thi T'],
      applicationNumber: 'VN2023005678',
      applicationDate: '2023-11-10',
      status: 'Granted',
      grantDate: '2024-07-05',
      patentNumber: 'VN123789',
      type: 'Invention Patent',
      faculty: 'Faculty of Nontraditional Security',
      discipline: 'Sustainable Development',
      abstract: 'An intelligent energy management system optimizing power consumption in smart buildings using renewable energy sources.',
      country: 'Vietnam',
      ipOffice: 'National Office of Intellectual Property (NOIP)'
    },
    {
      id: 'PAT008',
      title: 'Human Resource Performance Prediction Model',
      inventors: ['Dr. Dinh Van I', 'Dr. Ly Van J'],
      applicationNumber: 'VN2024006789',
      applicationDate: '2024-07-20',
      status: 'Pending',
      grantDate: null,
      patentNumber: null,
      type: 'Invention Patent',
      faculty: 'Faculty of Management',
      discipline: 'Human Resources',
      abstract: 'A predictive model for employee performance assessment using AI and big data analytics for HR optimization.',
      country: 'Vietnam',
      ipOffice: 'National Office of Intellectual Property (NOIP)'
    }
  ];

  const researchProjects = [
    {
      id: 'PRJ001',
      title: 'AI-Driven Healthcare Diagnostics',
      pi: 'Dr. Nguyen Van A',
      coInvestigators: ['Dr. Tran Thi B', 'Dr. Le Van C'],
      type: 'Applied Research',
      status: 'Active',
      startDate: '2024-01-15',
      endDate: '2026-01-14',
      funding: '$250,000',
      fundingSource: 'Nafosted',
      progress: 45,
      publications: 3,
      department: 'Faculty of Nontraditional Security',
      description: 'Developing machine learning algorithms for early disease detection and diagnosis in medical imaging.'
    },
    {
      id: 'PRJ002',
      title: 'Sustainable Urban Planning Framework',
      pi: 'Dr. Pham Thi D',
      coInvestigators: ['Dr. Hoang Van E'],
      type: 'Basic Research',
      status: 'Active',
      startDate: '2024-03-01',
      endDate: '2025-12-31',
      funding: '$180,000',
      fundingSource: 'Ministry of Education',
      progress: 62,
      publications: 5,
      department: 'Faculty of Management',
      description: 'Creating data-driven frameworks for sustainable city development and resource management.'
    },
    {
      id: 'PRJ003',
      title: 'Quantum Computing Applications',
      pi: 'Dr. Vo Thi F',
      coInvestigators: ['Dr. Bui Van G', 'Dr. Cao Thi H'],
      type: 'Applied Research',
      status: 'Active',
      startDate: '2023-09-01',
      endDate: '2026-08-31',
      funding: '$400,000',
      fundingSource: 'Ministry of Science and Technology',
      progress: 78,
      publications: 8,
      department: 'Faculty of Nontraditional Security',
      description: 'Exploring practical applications of quantum computing in cryptography and optimization.'
    },
    {
      id: 'PRJ004',
      title: 'Blockchain in Supply Chain',
      pi: 'Dr. Dinh Van I',
      coInvestigators: ['Dr. Ly Van J'],
      type: 'Applied Research',
      status: 'Completed',
      startDate: '2022-06-01',
      endDate: '2024-05-31',
      funding: '$150,000',
      fundingSource: 'Industry Partnership',
      progress: 100,
      publications: 12,
      department: 'Faculty of Management',
      description: 'Implementing blockchain technology for transparent and efficient supply chain management.'
    },
    {
      id: 'PRJ005',
      title: 'Neural Network Optimization',
      pi: 'Dr. Mai Van K',
      coInvestigators: ['Dr. Dang Thi L'],
      type: 'Basic Research',
      status: 'Pending',
      startDate: '2025-01-01',
      endDate: '2027-12-31',
      funding: '$320,000',
      fundingSource: 'VNU',
      progress: 0,
      publications: 0,
      department: 'Faculty of Nontraditional Security',
      description: 'Advanced research on neural network architecture optimization and efficiency.'
    },
    {
      id: 'PRJ006',
      title: 'Digital Marketing Strategies in Social Media',
      pi: 'Dr. Nguyen Thi M',
      coInvestigators: ['Dr. Phan Van N'],
      type: 'Applied Research',
      status: 'Active',
      startDate: '2024-02-15',
      endDate: '2025-12-31',
      funding: '$120,000',
      fundingSource: 'Industry Partnership',
      progress: 55,
      publications: 4,
      department: 'Faculty of Marketing and Communication',
      description: 'Analyzing consumer behavior and developing effective digital marketing frameworks for social media platforms.'
    }
  ];

  const publications = [
    {
      id: 'PUB001',
      title: 'Deep Learning Approaches for Medical Image Analysis',
      authors: ['Dr. Nguyen Van A', 'Dr. Tran Thi B', 'Dr. Le Van C'],
      type: 'Journal Article',
      journal: 'IEEE Transactions on Medical Imaging',
      year: 2024,
      citations: 45,
      impactFactor: 10.6,
      status: 'Published',
      doi: '10.1109/TMI.2024.12345',
      project: 'PRJ001',
      quartile: 'Q1',
      discipline: 'Nontraditional Security'
    },
    {
      id: 'PUB002',
      title: 'Sustainable City Development: A Data-Driven Framework',
      authors: ['Dr. Pham Thi D', 'Dr. Hoang Van E'],
      type: 'Conference Paper',
      journal: 'International Conference on Urban Planning',
      year: 2024,
      citations: 23,
      impactFactor: null,
      status: 'Published',
      doi: '10.1145/ICUP.2024.56789',
      project: 'PRJ002',
      quartile: 'N/A',
      discipline: 'Sustainable Development'
    },
    {
      id: 'PUB003',
      title: 'Quantum Algorithms for Cryptographic Applications',
      authors: ['Dr. Vo Thi F', 'Dr. Bui Van G', 'Dr. Cao Thi H'],
      type: 'Book Chapter',
      journal: 'Nature Quantum Information',
            publisher: 'IEEE',

      year: 2024,
      citations: 89,
      impactFactor: 15.2,
      status: 'Published',
      doi: '10.1038/s41534-024-00234',
      project: 'PRJ003',
      quartile: 'Q1',
      discipline: 'Engineering & IT'
    },
    {
      id: 'PUB004',
      title: 'Blockchain Technology in Supply Chain Management',
      authors: ['Dr. Dinh Van I', 'Dr. Ly Van J'],
      type: 'Book',
      journal: 'Series in Computer Science and Engineering',
      publisher: 'Springer',
      year: 2024,
      citations: 12,
      impactFactor: null,
      status: 'Published',
      doi: null,
      project: 'PRJ004',
      quartile: 'N/A',
      discipline: 'Finance'
    },
    {
      id: 'PUB005',
      title: 'Machine Learning in Healthcare: Current Trends',
      authors: ['Dr. Nguyen Van A', 'Dr. Le Van C'],
      type: 'Review Article',
      journal: 'Journal of Healthcare Engineering',
                  publisher: 'IEEE',

      year: 2025,
      citations: 0,
      impactFactor: 3.9,
      status: 'Under Review',
      doi: null,
      project: 'PRJ001',
      quartile: 'Q2',
      discipline: 'Nontraditional Security'
    },
    {
      id: 'PUB006',
      title: 'Optimization Techniques for Neural Networks',
      authors: ['Dr. Mai Van K', 'Dr. Dang Thi L'],
      type: 'Journal Article',
      journal: 'Neural Networks',
      year: 2024,
      citations: 34,
      impactFactor: 7.8,
      status: 'Published',
      doi: '10.1016/j.neunet.2024.98765',
      project: 'PRJ005',
      quartile: 'Q1',
      discipline: 'Engineering & IT'
    },
    {
      id: 'PUB007',
      title: 'Digital Transformation in Human Resource Management',
      authors: ['Dr. Pham Van O', 'Dr. Tran Thi P'],
      type: 'Journal Article',
      journal: 'Human Resource Management Review',
                  publisher: 'Taylor & Francis',

      year: 2024,
      citations: 28,
      impactFactor: 6.2,
      status: 'Published',
      doi: '10.1016/j.hrmr.2024.45678',
      project: 'PRJ002',
      quartile: 'Q1',
      discipline: 'Human Resources'
    },
    {
      id: 'PUB008',
      title: 'Social Media Marketing Effectiveness in Emerging Markets',
      authors: ['Dr. Nguyen Thi M', 'Dr. Phan Van N'],
      type: 'Journal Article',
      journal: 'Journal of Marketing Research',
      year: 2024,
      citations: 31,
      impactFactor: 8.1,
      status: 'Published',
      doi: '10.1177/JMR.2024.12345',
      project: 'PRJ006',
      quartile: 'Q1',
      discipline: 'Marketing'
    },
    {
      id: 'PUB009',
      title: 'Crisis Communication Strategies in the Digital Age',
      authors: ['Dr. Le Van Q', 'Dr. Hoang Thi R'],
      type: 'Conference Paper',
      journal: 'International Communication Association Conference',
      year: 2024,
      citations: 15,
      impactFactor: null,
      status: 'Published',
      doi: null,
      project: null,
      quartile: 'N/A',
      discipline: 'Communication'
    },
    {
      id: 'PUB010',
      title: 'Cybercrime and Legal Frameworks in Southeast Asia',
      authors: ['Dr. Bui Van S', 'Dr. Cao Thi T'],
      type: 'Book Chapter',
      journal: 'International Journal of Cyber Criminology',
                  publisher: 'Taylor & Francis',

      year: 2024,
      citations: 19,
      impactFactor: 4.5,
      status: 'Published',
      doi: '10.5281/ijcc.2024.98765',
      project: null,
      quartile: 'Q2',
      discipline: 'Law & Criminology'
    }
  ];

  const getDisciplineColor = (discipline) => {
    switch (discipline) {
      case 'Nontraditional Security': return 'bg-blue-100 text-blue-700';
      case 'Sustainable Development': return 'bg-green-100 text-green-700';
      case 'Engineering & IT': return 'bg-purple-100 text-purple-700';
      case 'Human Resources': return 'bg-green-100 text-green-700';
      case 'Finance': return 'bg-green-100 text-green-700';
      case 'Marketing': return 'bg-green-100 text-green-700';
      case 'Communication': return 'bg-green-100 text-green-700';
      case 'Law & Criminology': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-700';
      case 'Completed': return 'bg-blue-100 text-blue-700';
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      case 'Published': return 'bg-green-100 text-green-700';
      case 'Under Review': return 'bg-orange-100 text-orange-700';
      case 'Rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const OverviewDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-[1920px] mx-auto space-y-6">
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



  const StudentProfileAdmin = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterProgram, setFilterProgram] = useState('all');
    const [filterLevel, setFilterLevel] = useState('all');
    const [selectedStudent, setSelectedStudent] = useState(null);

    const sampleStudents = [
      { id: 'S001234', name: 'Nguyen Van An', program: 'FONS', level: 'Bachelor', year: '3', gpa: '3.45', status: 'Active' },
      { id: 'S001235', name: 'Tran Thi Binh', program: 'FOM', level: 'Bachelor', year: '2', gpa: '3.72', status: 'Active' },
      { id: 'S001236', name: 'Le Van Cuong', program: 'FONS', level: 'Master', year: '1', gpa: '3.88', status: 'Active' },
      { id: 'S001237', name: 'Pham Thi Dung', program: 'FONS', level: 'Master', year: '2', gpa: '3.91', status: 'Active' },
      { id: 'S001238', name: 'Hoang Van Em', program: 'FONS', level: 'PhD', year: '3', gpa: '3.95', status: 'Active' },
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
                <option value="cs">FONS</option>
                <option value="ba">FOM</option>
                <option value="se">FONS</option>
                <option value="ds">FONS</option>
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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-[1920px] mx-auto space-y-6">
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
            <h1 className="text-3xl font-bold text-gray-900">Student Services Overview</h1>
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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-[1920px] mx-auto space-y-6">
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
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
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

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
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
      { name: 'FONS', faculty: 28, avgAge: 38, phd: '100%' },
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
            <option value="cs">FONS</option>
            <option value="ba">FOM</option>
            <option value="se">FONS</option>
            <option value="ds">FONS</option>
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
      <div className="max-w-[1920px] mx-auto space-y-6">
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
      <div className="max-w-[1920px] mx-auto space-y-6">
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


const GradeManagement = () => {
  const [activeView, setActiveView] = useState('overview');
  const [selectedFaculty, setSelectedFaculty] = useState('all');
  const [selectedProgram, setSelectedProgram] = useState('all');
  const [selectedSemester, setSelectedSemester] = useState('fall-2024');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const faculties = [
    { code: 'FOM', name: 'Faculty of Management' },
    { code: 'FOMAC', name: 'Faculty of Marketing and Communication' },
    { code: 'FONS', name: 'Faculty of Nontraditional Security' }
  ];

  const programs = {
    bachelor: [
      { code: 'MET', name: 'Management Economics and Technology', faculty: 'FOM' },
      { code: 'MAC', name: 'Marketing and Communication', faculty: 'FOMAC' },
      { code: 'HAT', name: 'Hospitality and Tourism', faculty: 'FOM' },
      { code: 'MAS', name: 'Management and Sustainability', faculty: 'FOM' },
      { code: 'BNS', name: 'Business and Nontraditional Security', faculty: 'FONS' },
      { code: 'HAS', name: 'Health Administration and Security', faculty: 'FONS' }
    ],
    master: [
      { code: 'HSB-MBA', name: 'Master of Business Administration', faculty: 'FOM' },
      { code: 'MOTE', name: 'Master of Technology and Entrepreneurship', faculty: 'FONS' },
      { code: 'MNS', name: 'Master of Nontraditional Security', faculty: 'FONS' }
    ],
    phd: [
      { code: 'DMS', name: 'Doctor of Management Science', faculty: 'FOM' }
    ]
  };

  const bachelorProgramStats = [
    { code: 'MET', students: 380, passRate: 64.2, stdDev: 0.52 },
    { code: 'MAC', students: 320, passRate: 83.5, stdDev: 0.58 },
    { code: 'HAT', students: 290, passRate: 82.8, stdDev: 0.61 },
    { code: 'MAS', students: 310, passRate: 75.1, stdDev: 0.48 },
    { code: 'BNS', students: 340, passRate: 86.3, stdDev: 0.45 },
    { code: 'HAS', students: 210, passRate: 84.8, stdDev: 0.50 }
  ];

  const facultyMetrics = [
    { code: 'FOM', name: 'Faculty of Management', timelyDelivery: 89.5, stdDev: 0.54, skewness: -0.32, kurtosis: 2.85 },
    { code: 'FOMAC', name: 'Faculty of Marketing and Communication', timelyDelivery: 92.3, stdDev: 0.58, skewness: -0.28, kurtosis: 2.92 },
    { code: 'FONS', name: 'Faculty of Nontraditional Security', timelyDelivery: 94.1, stdDev: 0.47, skewness: -0.35, kurtosis: 3.12 }
  ];

  const courseData = [
    { id: 'HSB1001', name: 'Quản trị học / Management', program: 'MET', faculty: 'FOM', level: 'Bachelor', instructor: 'Dr. Nguyen Van A', students: 45, avgGrade: 3.45, passRate: 95.6 },
    { id: 'HSB1002', name: 'Kinh tế học / Economics', program: 'MET', faculty: 'FOM', level: 'Bachelor', instructor: 'Dr. Tran Thi B', students: 52, avgGrade: 3.28, passRate: 92.3 },
    { id: 'HSB1003', name: 'Phân tích dữ liệu / Data Analysis', program: 'MET', faculty: 'FONS', level: 'Bachelor', instructor: 'Dr. Le Van C', students: 38, avgGrade: 3.52, passRate: 97.4 },
    { id: 'HSB1004', name: 'Luật Kinh doanh và đạo đức kinh doanh / Business Law and Ethics', program: 'MET', faculty: 'FOM', level: 'Bachelor', instructor: 'Dr. Pham Thi D', students: 48, avgGrade: 3.38, passRate: 93.8 },
    { id: 'HSB1005', name: 'Nguyên lý kế toán / Principle of Accounting', program: 'MET', faculty: 'FOM', level: 'Bachelor', instructor: 'Dr. Hoang Van E', students: 44, avgGrade: 3.15, passRate: 90.9 },
    { id: 'HSB1006', name: 'Quản trị tài chính doanh nghiệp / Management of Corporate Finance', program: 'MAS', faculty: 'FOM', level: 'Bachelor', instructor: 'Dr. Vo Thi F', students: 42, avgGrade: 3.42, passRate: 94.5 },
    { id: 'HSB2014', name: 'Quản trị công ty / Corporate Governance', program: 'MET', faculty: 'FOM', level: 'Bachelor', instructor: 'Dr. Bui Van G', students: 36, avgGrade: 3.58, passRate: 96.2 },
    { id: 'HSB1033', name: 'Quản trị nguồn nhân lực và nhân tài / Management of Human Resource & Talents', program: 'MAS', faculty: 'FOM', level: 'Bachelor', instructor: 'Dr. Dinh Thi H', students: 50, avgGrade: 3.35, passRate: 93.5 },
    { id: 'HSB2001E', name: 'Tư duy chiến lược và quản trị chiến lược / Strategic Thinking and Strategic Management', program: 'MET', faculty: 'FOM', level: 'Bachelor', instructor: 'Dr. Ly Van I', students: 40, avgGrade: 3.48, passRate: 95.0 },
    { id: 'HSB2003E', name: 'Kinh doanh toàn cầu / Global Business', program: 'MET', faculty: 'FOM', level: 'Bachelor', instructor: 'Dr. Mai Van J', students: 35, avgGrade: 3.62, passRate: 97.1 },
    { id: 'HSB2004E', name: 'Quản trị thương hiệu và tài sản trí tuệ / Management of Branding and Intellectual Property', program: 'MAC', faculty: 'FOMAC', level: 'Bachelor', instructor: 'Dr. Dang Thi K', students: 38, avgGrade: 3.55, passRate: 96.8 },
    { id: 'HSB3119', name: 'Tổng quan về Khoa học dữ liệu / Introduction to Data Science', program: 'MET', faculty: 'FONS', level: 'Bachelor', instructor: 'Dr. Cao Van L', students: 32, avgGrade: 3.68, passRate: 98.1 },
    { id: 'HSB2023', name: 'Toán ứng dụng / Applied Mathematics', program: 'MET', faculty: 'FONS', level: 'Bachelor', instructor: 'Dr. Phan Thi M', students: 46, avgGrade: 3.22, passRate: 91.3 },
    { id: 'HSB2011', name: 'Nguyên lý Marketing và truyền thông / Principles of Marketing & Communication', program: 'MAC', faculty: 'FOMAC', level: 'Bachelor', instructor: 'Dr. Truong Van N', students: 55, avgGrade: 3.45, passRate: 94.5 },
    { id: 'MNS401', name: 'Cybersecurity Management', program: 'MNS', faculty: 'FONS', level: 'Master', instructor: 'Dr. Ta Van Canh', students: 38, avgGrade: 3.52, passRate: 97.4 },
    { id: 'MBA501', name: 'Corporate Strategy', program: 'HSB-MBA', faculty: 'FOM', level: 'Master', instructor: 'Dr. Le Van P', students: 28, avgGrade: 3.68, passRate: 100 },
    { id: 'MNS601', name: 'Advanced Security Analysis', program: 'MNS', faculty: 'FONS', level: 'Master', instructor: 'Dr. Tran Thi Q', students: 22, avgGrade: 3.71, passRate: 100 }
  ];

  const studentGrades = [
    { studentId: '25080001', name: 'Do Thi Hoa', midterm: 8.2, final: 8.7, assignments: 8.5, participation: 9.0, overall: 8.60, letterGrade: 'A', gpa: 4.0 },
{ studentId: '25080002', name: 'Nguyen Van Phuc', midterm: 7.0, final: 7.5, assignments: 7.8, participation: 7.6, overall: 7.48, letterGrade: 'C', gpa: 2.5 },
{ studentId: '25080003', name: 'Tran Thi Lan', midterm: 9.3, final: 9.0, assignments: 9.1, participation: 9.2, overall: 9.15, letterGrade: 'A', gpa: 4.0 },
{ studentId: '25080004', name: 'Bui Van Tien', midterm: 6.8, final: 6.5, assignments: 6.9, participation: 7.0, overall: 6.80, letterGrade: 'C', gpa: 2.0 },
{ studentId: '25080005', name: 'Le Thi Mai', midterm: 8.5, final: 8.3, assignments: 8.4, participation: 8.6, overall: 8.45, letterGrade: 'B', gpa: 3.5 },
{ studentId: '25080006', name: 'Pham Van Kien', midterm: 7.2, final: 7.0, assignments: 7.4, participation: 7.5, overall: 7.28, letterGrade: 'C', gpa: 2.5 },
{ studentId: '25080007', name: 'Hoang Thi Thu', midterm: 9.0, final: 8.8, assignments: 9.2, participation: 9.5, overall: 9.13, letterGrade: 'A', gpa: 4.0 },
{ studentId: '25080008', name: 'Nguyen Van Minh', midterm: 8.0, final: 8.2, assignments: 8.1, participation: 8.4, overall: 8.18, letterGrade: 'B', gpa: 3.0 },
{ studentId: '25080009', name: 'Tran Thi Quynh', midterm: 7.5, final: 8.0, assignments: 7.8, participation: 8.1, overall: 7.85, letterGrade: 'B', gpa: 3.0 },
{ studentId: '25080010', name: 'Le Van Hung', midterm: 6.2, final: 6.5, assignments: 6.8, participation: 6.9, overall: 6.60, letterGrade: 'D', gpa: 2.0 },
{ studentId: '25080011', name: 'Nguyen Thi Huong', midterm: 8.7, final: 9.0, assignments: 8.9, participation: 9.2, overall: 8.95, letterGrade: 'A', gpa: 4.0 },
{ studentId: '25080012', name: 'Tran Van Hoang', midterm: 7.3, final: 7.0, assignments: 7.2, participation: 7.5, overall: 7.25, letterGrade: 'C', gpa: 2.5 },
{ studentId: '25080013', name: 'Pham Thi Lien', midterm: 9.2, final: 9.3, assignments: 9.0, participation: 9.4, overall: 9.23, letterGrade: 'A', gpa: 4.0 },
{ studentId: '25080014', name: 'Bui Van Nam', midterm: 6.9, final: 7.2, assignments: 7.0, participation: 6.8, overall: 6.98, letterGrade: 'C', gpa: 2.0 },
{ studentId: '25080015', name: 'Hoang Thi Yen', midterm: 8.4, final: 8.7, assignments: 8.6, participation: 8.8, overall: 8.63, letterGrade: 'A', gpa: 4.0 },
{ studentId: '25080016', name: 'Le Van Hai', midterm: 7.8, final: 8.0, assignments: 7.9, participation: 8.2, overall: 7.98, letterGrade: 'B', gpa: 3.0 },
{ studentId: '25080017', name: 'Nguyen Thi Thao', midterm: 6.5, final: 6.8, assignments: 6.7, participation: 7.0, overall: 6.75, letterGrade: 'D', gpa: 2.0 },
{ studentId: '25080018', name: 'Tran Van Phong', midterm: 8.1, final: 8.3, assignments: 8.0, participation: 8.4, overall: 8.20, letterGrade: 'B', gpa: 3.0 },
{ studentId: '25080019', name: 'Pham Thi Van', midterm: 9.0, final: 8.8, assignments: 9.2, participation: 9.1, overall: 9.03, letterGrade: 'A', gpa: 4.0 },
{ studentId: '25080020', name: 'Le Van Long', midterm: 7.0, final: 7.3, assignments: 7.2, participation: 7.1, overall: 7.15, letterGrade: 'C', gpa: 2.5 }

  
  
  ];

  const OverviewDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
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

      <div className="grid grid-cols-3 gap-6">
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
            {facultyMetrics.map((faculty, i) => (
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Bachelor Programs</h3>
          <div className="grid grid-cols-2 gap-4">
            {bachelorProgramStats.map((prog, i) => (
              <div key={i} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-xl font-bold text-gray-900">{prog.code}</h4>
                  <span className="text-sm text-gray-500">{prog.students}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Pass Rate</p>
                    <p className="text-xl font-bold text-green-600">{prog.passRate}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">S.D Score</p>
                    <p className="text-xl font-bold text-blue-600">{prog.stdDev}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const CourseAnalysis = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <select 
                value={selectedFaculty}
                onChange={(e) => setSelectedFaculty(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All Faculties</option>
                {faculties.map(f => (
                  <option key={f.code} value={f.code}>{f.code} - {f.name}</option>
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
              {courseData.map((course) => (
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
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      course.faculty === 'FOM' ? 'bg-blue-100 text-blue-700' :
                      course.faculty === 'FOMAC' ? 'bg-purple-100 text-purple-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {course.faculty}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      course.level === 'Bachelor' ? 'bg-blue-100 text-blue-700' :
                      course.level === 'Master' ? 'bg-purple-100 text-purple-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {course.level}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{course.instructor}</td>
                  <td className="px-6 py-4 text-sm font-semibold">{course.students}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      course.avgGrade >= 3.5 ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {course.avgGrade}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      course.passRate >= 95 ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {course.passRate}%
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => {
                        setSelectedCourse(course);
                        setActiveView('grading');
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

  const GradeInsertion = () => {
    if (!selectedCourse) {
      return (
        <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
          <div className="max-w-md mx-auto">
            <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Course Selected</h3>
            <p className="text-gray-600 mb-6">Please select a course from the Course Analysis tab.</p>
            <button 
              onClick={() => setActiveView('courses')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Go to Course Analysis
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedCourse.id} - {selectedCourse.name}</h2>
                <div className="flex gap-4 mt-2 text-sm text-gray-600">
                  <span>Program: {selectedCourse.program}</span>
                  <span>•</span>
                  <span>Instructor: {selectedCourse.instructor}</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedCourse(null)}
                className="p-2 hover:bg-white rounded-lg"
              >
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
                  {editMode ? 'Cancel' : 'Edit Grades'}
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
                  {studentGrades.map((student) => (
                    <tr key={student.studentId} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-blue-600">{student.studentId}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{student.name}</td>
                      <td className="px-4 py-3 text-center">
                        {editMode ? (
                          <input 
                            type="number" 
                            defaultValue={student.midterm}
                            className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                            step="0.1"
                            min="0"
                            max="10"
                          />
                        ) : (
                          <span className="text-sm font-semibold">{student.midterm}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {editMode ? (
                          <input 
                            type="number" 
                            defaultValue={student.final}
                            className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                            step="0.1"
                            min="0"
                            max="10"
                          />
                        ) : (
                          <span className="text-sm font-semibold">{student.final}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {editMode ? (
                          <input 
                            type="number" 
                            defaultValue={student.assignments}
                            className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                            step="0.1"
                            min="0"
                            max="10"
                          />
                        ) : (
                          <span className="text-sm font-semibold">{student.assignments}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {editMode ? (
                          <input 
                            type="number" 
                            defaultValue={student.participation}
                            className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                            step="0.1"
                            min="0"
                            max="10"
                          />
                        ) : (
                          <span className="text-sm font-semibold">{student.participation}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-sm font-bold text-gray-900">{student.overall}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          student.letterGrade === 'A' ? 'bg-green-100 text-green-700' :
                          student.letterGrade === 'B' ? 'bg-blue-100 text-blue-700' :
                          student.letterGrade === 'C' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {student.letterGrade}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-sm font-bold text-gray-900">{student.gpa}</span>
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

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="mx-auto w-full max-w-[1600px] space-y-4">
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
                onClick={() => { setActiveView('overview'); setSelectedCourse(null); }}
                className={`px-6 py-3 rounded-lg text-sm font-medium ${
                  activeView === 'overview' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => { setActiveView('courses'); setSelectedCourse(null); }}
                className={`px-6 py-3 rounded-lg text-sm font-medium ${
                  activeView === 'courses' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
                }`}
              >
                Course Analysis
              </button>
              <button
                onClick={() => setActiveView('grading')}
                className={`px-6 py-3 rounded-lg text-sm font-medium ${
                  activeView === 'grading' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
                }`}
              >
                Grade Insertion
              </button>
            </div>
          </div>
        </div>

        {activeView === 'overview' && <OverviewDashboard />}
        {activeView === 'courses' && <CourseAnalysis />}
        {activeView === 'grading' && <GradeInsertion />}
      </div>
    </div>
  );
};

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
    if (activeTab == 'hr-profile'){
      return <HRProfileManagement/>;
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
    if (activeTab == 'one-stop-service'){
      return <OneStopService/>;
    }
    if (activeTab === 'room-schedule' || activeTab === 'course-schedule' || activeTab === 'exam-schedule') {
      return <TimetableCalendar />;
    }
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4 text-gray-900">{activeTab}</h2>
        <p className="text-gray-600">Content for {activeTab} will be displayed here.</p>
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
        <div className="grid grid-cols-4 gap-4">
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

        <div className="grid grid-cols-3 gap-6">
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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-[1920px] mx-auto space-y-6">
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

export default ERPLayout ;