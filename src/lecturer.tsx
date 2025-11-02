"use client";

import React, { useState, useEffect } from 'react';
import {
  Clock, FileText, Users, TrendingUp, BookOpen, Calendar,
  AlertCircle, Award, MessageSquare, Bell, ChevronRight,
  Home, User as UserIcon, BookText, Globe, Lock, ChevronLeft,
  Mail, Phone, Building2, Edit, GraduationCap,
  Plus, Video, Coffee, Briefcase, Plane, X, Save, CheckSquare, DollarSign, Search, Filter, Eye, MoreVertical,
  User,Upload, Book, ClipboardList,BarChart3,Download, Send, LockIcon, UnlockIcon, ChevronLeftIcon, Pencil,
  BookPlus
} from 'lucide-react';
import * as QRCode from "qrcode";
import Documents from "./documents/documenthandbook";
import LibraryViewer from "./library/libraryviewer";

// ————————————————————————————————————————
// Dashboard view (re-uses your original data)
// ————————————————————————————————————————
const DashboardContent = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('This Week');

  const stats = [
    {
      label: 'Teaching Hours',
      value: '480/700h',
      subtitle: 'Total cumulative',
      change: '+12h this week',
      trend: 'up',
      icon: Clock,
      color: 'blue' as const,
    },
    {
      label: 'Publications',
      value: '8 | 700h',
      subtitle: 'Papers: 5 & Patents: 3',
      change: '+2 this year',
      trend: 'up',
      icon: FileText,
      color: 'green' as const,
    },
    {
      label: 'Active Projects',
      value: '12',
      subtitle: 'Research & Supervision',
      change: '+3 this semester',
      trend: 'up',
      icon: BookOpen,
      color: 'purple' as const,
    },
    {
      label: 'Avg. Feedback Score',
      value: '4.6/5',
      subtitle: 'Student ratings',
      change: '+0.3 improvement',
      trend: 'up',
      icon: TrendingUp,
      color: 'orange' as const,
    },
  ];

  const courses = [
    { id: 'CS401', name: 'Introduction to AI', students: 65, upcoming: 'Lecture - Today 2:00 PM', progress: 65, status: 'active' },
    { id: 'CS501', name: 'Machine Learning', students: 58, upcoming: 'Lab Session - Tomorrow 10:00 AM', progress: 58, status: 'active' },
    { id: 'CS601', name: 'Deep Learning', students: 42, upcoming: 'Assignment Due - Oct 20', progress: 42, status: 'active' },
  ];

  const upcomingClasses = [
    { course: 'Introduction to AI', type: 'Lecture', time: 'Today, 2:00 PM', room: 'Room 301', duration: '2h' },
    { course: 'Machine Learning', type: 'Lab', time: 'Tomorrow, 10:00 AM', room: 'Lab 102', duration: '3h' },
    { course: 'Deep Learning', type: 'Lecture', time: 'Oct 18, 3:00 PM', room: 'Room 205', duration: '2h' },
  ];

  const pendingTasks = [
    { id: 1, title: 'Grade submission - CS401', due: 'Due Oct 19', priority: 'high', category: 'Grading' },
    { id: 2, title: 'Syllabus update - CS501', due: 'Due Oct 25', priority: 'medium', category: 'Planning' },
    { id: 3, title: 'Thesis review - John Doe', due: 'Due Oct 25', priority: 'medium', category: 'Research' },
    { id: 4, title: 'Midterm preparation - CS601', due: 'Due Oct 30', priority: 'low', category: 'Teaching' },
  ];

  const getColorClasses = (color: 'blue' | 'green' | 'purple' | 'orange') => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-50 text-blue-600 border-blue-200',
      green: 'bg-green-50 text-green-600 border-green-200',
      purple: 'bg-purple-50 text-purple-600 border-purple-200',
      orange: 'bg-orange-50 text-orange-600 border-orange-200',
    };
    return colors[color] || colors.blue;
  };

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    const colors: Record<string, string> = {
      high: 'text-red-600 bg-red-50',
      medium: 'text-orange-600 bg-orange-50',
      low: 'text-blue-600 bg-blue-50',
    };
    return colors[priority] || colors.low;
  };

  return (
    <>
    <div className="px-3 sm:px-3">
  <div className="flex justify-between items-start mt-3">
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Lecturer Dashboard</h1>
      <p className="text-gray-500 mt-1">Welcome back, Dr. Nguyen Van A</p>
    </div>
  </div>
</div>
     

      <div className="px-3 ">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mt-3">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg border ${getColorClasses(stat.color)}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.subtitle}</p>
                  <p className="text-sm text-green-600 mt-2">{stat.change}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 mt-3">
          {/* My Courses */}
          <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">My Courses</h2>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
            </div>
            <div className="space-y-4">
              {courses.map((course) => (
                <div key={course.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded">{course.id}</span>
                        <h3 className="font-semibold text-gray-900">{course.name}</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{course.students} students enrolled</p>
                      <p className="text-sm text-orange-600 font-medium">{course.upcoming}</p>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Course Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Schedule */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Schedule</h2>
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-3 overflow-auto ">
              {upcomingClasses.map((cls, index) => (
                <div key={index} className="border-l-4 overflow-auto border-blue-600 pl-4 py-2">
                  <p className="font-semibold text-gray-900 text-sm">{cls.course}</p>
                  <p className="text-xs text-gray-600 mt-1">{cls.type} • {cls.duration}</p>
                  <p className="text-xs text-blue-600 font-medium mt-1">{cls.time}</p>
                  <p className="text-xs text-gray-500 mt-1">{cls.room}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-3 mt-3">
          <div className="col-span-3 bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Pending Tasks</h2>
              <span className="px-3 py-1 bg-red-50 text-red-600 text-sm font-semibold rounded-full">{pendingTasks.length} tasks</span>
            </div>
            <div className="space-y-3">
              {pendingTasks.map((task) => (
                <div key={task.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-900">{task.title}</h3>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded ${getPriorityColor(task.priority as 'high'|'medium'|'low')}`}>
                        {task.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{task.due}</p>
                  </div>
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">{task.category}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ————————————————————————————————————————
// Profile view (re-usable component)
// ————————————————————————————————————————
const LecturerProfile = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'teaching' | 'publications'>('overview');

  const lecturerInfo = {
    name: 'Dr. Nguyễn Văn A',
    employeeId: '25080030',
    email: 'nva25080030@hsb.edu.vn',
    phone: '0846258088',
    department: 'Computer Science',
    position: 'Associate Professor',
    office: 'QH-2022-D',
    officeHours: 'Mon, Wed 2-4 PM',
    rating: '4.6',
    ratingLevel: 'Excellent',
    teachingHours: '480/700h',
    researchHours: '700h',
    publications: '8',
    activeProjects: '12'
  };

  const teachingPerformance = [
    { semester: 'Semester I', gpa: '4.2', courses: 3, students: 156, level: 'Excellent', levelColor: 'text-green-600 bg-green-50' },
    { semester: 'Semester II', gpa: '4.4', courses: 3, students: 148, level: 'Excellent', levelColor: 'text-green-600 bg-green-50' },
    { semester: 'Semester III', gpa: '4.1', courses: 2, students: 98, level: 'Excellent', levelColor: 'text-green-600 bg-green-50' },
    { semester: 'Semester IV', gpa: '4.5', courses: 3, students: 165, level: 'Excellent', levelColor: 'text-green-600 bg-green-50' },
    { semester: 'Semester V', gpa: '-', courses: 0, students: 0, level: '-', levelColor: 'text-gray-600 bg-gray-50' },
    { semester: 'Semester VI', gpa: '-', courses: 0, students: 0, level: '-', levelColor: 'text-gray-600 bg-gray-50' }
  ];

  const educationHistory = [
    { degree: 'Ph.D. in Computer Science', institution: 'Stanford University', year: '2015', country: 'USA' },
    { degree: 'M.Sc. in Artificial Intelligence', institution: 'MIT', year: '2010', country: 'USA' },
    { degree: 'B.Sc. in Computer Engineering', institution: 'HSB University', year: '2006', country: 'Vietnam' }
  ];

  const researchAreas = [
    'Machine Learning',
    'Deep Learning',
    'Natural Language Processing',
    'Computer Vision',
    'AI Ethics'
  ];

  const publications = [
    { title: 'Advanced Neural Networks for Image Recognition', journal: 'IEEE Transactions on AI', year: '2024', citations: 45 },
    { title: 'Transformer Models in NLP Applications', journal: 'ACM Computing Surveys', year: '2023', citations: 78 },
    { title: 'Ethical Considerations in AI Development', journal: 'Nature Machine Intelligence', year: '2023', citations: 62 }
  ];

  const currentProjects = [
    { name: 'AI-Powered Healthcare Diagnostics', role: 'Principal Investigator', status: 'Active', funding: '$150,000' },
    { name: 'Smart City Infrastructure', role: 'Co-Investigator', status: 'Active', funding: '$200,000' },
    { name: 'Educational AI Tools', role: 'Lead Researcher', status: 'Active', funding: '$80,000' }
  ];

  const awards = [
    { title: 'Best Teacher Award', year: '2024', organization: 'HSB University' },
    { title: 'Outstanding Research Award', year: '2023', organization: 'National Science Foundation' },
    { title: 'Excellence in Teaching', year: '2022', organization: 'Ministry of Education' }
  ];

  const committees = [
    { name: 'Academic Board', position: 'Member', since: '2020' },
    { name: 'Research Ethics Committee', position: 'Chair', since: '2021' },
    { name: 'Curriculum Development', position: 'Lead', since: '2019' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 sm:p-6 lg:p-8">
        <div className="max-w mx-auto">
          <div className="flex justify-between items-start">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Profile pic */}
              <div className="flex flex-wrap items-center gap-4 flex-1 min-w-0">
                <img
      src="https://i.postimg.cc/tgHhXHK4/hsb-capibara.jpg" 
      alt="Student Photo"
      className="w-28 h-28 rounded-full border-4 border-white shadow-md object-cover"
    />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">{lecturerInfo.name}</h1>
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                    ID: {lecturerInfo.employeeId}
                  </span>
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                    {lecturerInfo.position}
                  </span>
                  <span className="px-3 py-1 bg-green-400/90 text-green-900 rounded-full text-sm font-semibold">
                    {lecturerInfo.rating} - {lecturerInfo.ratingLevel}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
                  <div className="flex items-center gap-2">
                    <Mail className="min-w-0" />
                    <span>{lecturerInfo.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="min-w-0" />
                    <span>{lecturerInfo.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="min-w-0" />
                    <span>{lecturerInfo.department}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="min-w-0" />
                    <span>Office: {lecturerInfo.office}</span>
                  </div>
                </div>
              </div>
            </div>
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

          {/* Simple tabs for the profile page itself */}
          <div className="mt-6 flex gap-2">
            {(['overview','teaching','publications'] as const).map(t => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`px-3 py-1.5 rounded-lg text-sm ${activeTab === t ? 'bg-white text-blue-700' : 'bg-white/20 hover:bg-white/30'}`}
              >
                {t[0].toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w mx-auto mt-3">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-3 gap-6">
            {/* Left Column - Personal & Academic Info */}
            <div className="col-span-2 space-y-6">
              {/* Personal Information */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h2>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">Employee ID</label>
                    <p className="text-gray-900 font-medium">{lecturerInfo.employeeId}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">Department</label>
                    <p className="text-gray-900 font-medium">{lecturerInfo.department}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">Position / Rank</label>
                    <p className="text-gray-900 font-medium">{lecturerInfo.position}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">Office Location</label>
                    <p className="text-gray-900 font-medium">{lecturerInfo.office}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">Office Hours</label>
                    <p className="text-gray-900 font-medium">{lecturerInfo.officeHours}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">Employment Start Date</label>
                    <p className="text-gray-900 font-medium">September 2015</p>
                  </div>
                </div>
              </div>

              {/* Education History */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Education History</h2>
                <div className="space-y-4">
                  {educationHistory.map((edu, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <GraduationCap className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                        <p className="text-sm text-gray-600 mt-1">{edu.institution}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>Year: {edu.year}</span>
                          <span>•</span>
                          <span>{edu.country}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Research Projects */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Current Research Projects</h2>
                <div className="space-y-4">
                  {currentProjects.map((project, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900">{project.name}</h3>
                        <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded">
                          {project.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>Role: {project.role}</span>
                        <span>•</span>
                        <span>Funding: {project.funding}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Additional Info */}
            <div className="space-y-6">
              {/* Academic Status */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Academic Status</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">Current Status</label>
                    <span className="inline-block px-3 py-1 bg-green-50 text-green-700 text-sm font-semibold rounded-full">
                      Active
                    </span>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">Teaching Hours</label>
                    <p className="text-gray-900 font-medium">{lecturerInfo.teachingHours}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">Research Hours</label>
                    <p className="text-gray-900 font-medium">{lecturerInfo.researchHours}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">Publications</label>
                    <p className="text-gray-900 font-medium">{lecturerInfo.publications}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">Active Projects</label>
                    <p className="text-gray-900 font-medium">{lecturerInfo.activeProjects}</p>
                  </div>
                </div>
              </div>

              {/* Research Areas */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Research Areas</h2>
                <div className="flex flex-wrap gap-2">
                  {researchAreas.map((area, index) => (
                    <span key={index} className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-full">
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              {/* Awards & Recognition */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Awards & Recognition</h2>
                <div className="space-y-3">
                  {awards.map((award, index) => (
                    <div key={index} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Award className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{award.title}</p>
                          <p className="text-xs text-gray-600 mt-1">{award.organization} • {award.year}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Committee Memberships */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Committee Memberships</h2>
                <div className="space-y-3">
                  {committees.map((committee, index) => (
                    <div key={index} className="p-3 border border-gray-200 rounded-lg">
                      <p className="font-semibold text-gray-900 text-sm">{committee.name}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
                        <span>{committee.position}</span>
                        <span>•</span>
                        <span>Since {committee.since}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Professional Memberships */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Professional Memberships</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Globe className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">IEEE Member</p>
                      <p className="text-xs text-gray-600">Since 2015</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Globe className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">ACM Member</p>
                      <p className="text-xs text-gray-600">Since 2016</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'teaching' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">Teaching tab content…</div>
        )}

        {activeTab === 'publications' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Publications</h2>
            <div className="space-y-4">
              {publications.map((pub, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <h3 className="font-semibold text-gray-900 mb-2">{pub.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{pub.journal}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Year: {pub.year}</span>
                    <span>•</span>
                    <span>Citations: {pub.citations}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};



// ————————————————————————————————————————
// Schedule view (integrated subtab)
// ————————————————————————————————————————
const ScheduleView = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'month' | 'day'>('week');
  const [showAddModal, setShowAddModal] = useState(false);
  const [addType, setAddType] = useState<'task' | 'event' | 'leave' | 'note'>('task');

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  const events = [
    { id: 1, type: 'class', title: 'CS401 - Introduction to AI', startTime: '14:00', endTime: '15:30', day: 'Monday', location: 'Room 301', color: 'bg-blue-500' },
    { id: 2, type: 'class', title: 'CS501 - Machine Learning', startTime: '10:00', endTime: '11:30', day: 'Tuesday', location: 'Lab 102', color: 'bg-blue-500' },
    { id: 3, type: 'meeting', title: 'Faculty Meeting', startTime: '09:00', endTime: '10:00', day: 'Wednesday', location: 'Conference Room', color: 'bg-purple-500' },
    { id: 4, type: 'office_hours', title: 'Office Hours', startTime: '16:00', endTime: '18:00', day: 'Monday', location: 'Office QH-2022-D', color: 'bg-green-500' },
    { id: 5, type: 'research', title: 'Research Lab Time', startTime: '13:00', endTime: '16:00', day: 'Thursday', location: 'Research Lab', color: 'bg-orange-500' },
  ];

  const tasks = [
    { id: 1, title: 'Grade CS401 Midterm Exams', dueDate: '2024-10-19', priority: 'high', status: 'pending', category: 'Grading' },
    { id: 2, title: 'Prepare Lecture Notes - Week 8', dueDate: '2024-10-20', priority: 'medium', status: 'in-progress', category: 'Teaching' },
    { id: 3, title: 'Review Research Paper Draft', dueDate: '2024-10-22', priority: 'high', status: 'pending', category: 'Research' },
    { id: 4, title: 'Update Course Syllabus', dueDate: '2024-10-25', priority: 'low', status: 'pending', category: 'Administrative' },
  ];

  const leaveRequests = [
    { id: 1, type: 'Annual Leave', startDate: '2024-11-10', endDate: '2024-11-15', reason: 'Family vacation', status: 'Approved', appliedDate: '2024-10-01' },
    { id: 2, type: 'Conference', startDate: '2024-12-05', endDate: '2024-12-08', reason: 'International AI Conference', status: 'Pending', appliedDate: '2024-10-10' },
  ];

  const notes = [
    { id: 1, title: 'Student Meeting Notes', content: 'Discussed thesis progress with John. Need to schedule follow-up.', date: '2024-10-17', tags: ['students', 'thesis'] },
    { id: 2, title: 'Research Ideas', content: 'New approach for neural network optimization. Explore batch normalization alternatives.', date: '2024-10-16', tags: ['research', 'ideas'] },
  ];

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    const colors: Record<string, string> = {
      high: 'bg-red-50 text-red-700 border-red-200',
      medium: 'bg-orange-50 text-orange-700 border-orange-200',
      low: 'bg-blue-50 text-blue-700 border-blue-200',
    };
    return colors[priority];
  };

  const getStatusColor = (status: 'pending' | 'in-progress' | 'completed' | 'Approved' | 'Pending' | 'Rejected') => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-50 text-yellow-700',
      'in-progress': 'bg-blue-50 text-blue-700',
      completed: 'bg-green-50 text-green-700',
      Approved: 'bg-green-50 text-green-700',
      Pending: 'bg-yellow-50 text-yellow-700',
      Rejected: 'bg-red-50 text-red-700',
    };
    return colors[status];
  };

  const getEventIcon = (type: string) => {
    const icons: Record<string, any> = {
      class: GraduationCap,
      meeting: Users,
      office_hours: Coffee,
      research: Briefcase,
      conference: Video,
    };
    return icons[type] || Calendar;
  };

  return (
    <div className="flex-1 overflow-auto">
      {/* Header */}
      <div className="bg-white border-b rounded-xl border-gray-200 p-3 mb-3">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Schedule & Tasks</h1>
            <p className="text-gray-500 mt-1">Manage your calendar, tasks, and appointments</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => { setAddType('task'); setShowAddModal(true); }} className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              <CheckSquare className="w-5 h-5" />
              Add Task
            </button>
            <button onClick={() => { setAddType('event'); setShowAddModal(true); }} className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              <Calendar className="w-5 h-5" />
              Add Event
            </button>
            <button onClick={() => { setAddType('leave'); setShowAddModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              <Plane className="w-5 h-5" />
              Request Leave
            </button>
          </div>
        </div>
      </div>

      <div className="">
        <div className="space-y-3">
          {/* Calendar Section - Full Width */}
          <div className="bg-white rounded-xl border border-gray-200 p-3">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-gray-900">{monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}</h2>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
              <div className="flex gap-4 items-center">
                {/* Legend */}
                <div className="flex gap-4 mr-4">
                  <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded"></div><span className="text-sm text-gray-700">Classes</span></div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 bg-purple-500 rounded"></div><span className="text-sm text-gray-700">Meetings</span></div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-500 rounded"></div><span className="text-sm text-gray-700">Office Hours</span></div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 bg-orange-500 rounded"></div><span className="text-sm text-gray-700">Research</span></div>
                </div>
                {/* View Mode Buttons */}
                <div className="flex gap-2">
                  <button onClick={() => setViewMode('day')} className={`px-4 py-2 rounded-lg font-medium transition-colors ${viewMode === 'day' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Day</button>
                  <button onClick={() => setViewMode('week')} className={`px-4 py-2 rounded-lg font-medium transition-colors ${viewMode === 'week' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Week</button>
                  <button onClick={() => setViewMode('month')} className={`px-4 py-2 rounded-lg font-medium transition-colors ${viewMode === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Month</button>
                </div>
              </div>
            </div>

            {/* Week View */}
            {viewMode === 'week' && (
              <div className="overflow-x-auto">
                <div className="grid gap-2 min-w-max" style={{ gridTemplateColumns: '60px repeat(7, 1fr)' }}>
                  <div className="text-xs text-gray-600 font-semibold p-2">Time</div>
                  {weekDays.map((day) => (
                    <div key={day} className="text-center p-2">
                      <p className="text-xs text-gray-600 font-semibold">{day}</p>
                      <p className="text-lg font-bold text-gray-900">17</p>
                    </div>
                  ))}

                  {[8,9,10,11,12,13,14,15,16,17,18].map((hour) => (
                    <React.Fragment key={hour}>
                      <div className="text-xs text-gray-600 p-2 border-t border-gray-100">{hour}:00</div>
                      {weekDays.map((day) => {
                        const dayEvents = events.filter(e => e.day === day && parseInt(e.startTime.split(':')[0]) === hour);
                        return (
                          <div key={`${day}-${hour}`} className="border border-gray-100 p-1 min-h-16">
                            {dayEvents.map((event) => {
                              const Icon = getEventIcon(event.type);
                              return (
                                <div key={event.id} className={`${event.color} text-white p-2 rounded text-xs mb-1`}>
                                  <div className="flex items-center gap-1 mb-1">
                                    <Icon className="w-3 h-3" />
                                    <span className="font-semibold">{event.title}</span>
                                  </div>
                                  <p className="text-xs opacity-90">{event.startTime} - {event.endTime}</p>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}

            {/* Day View */}
            {viewMode === 'day' && (
              <div className="space-y-3">
                {events.filter(e => e.day === 'Monday').map((event) => {
                  const Icon = getEventIcon(event.type);
                  return (
                    <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 ${event.color} rounded-lg`}><Icon className="w-6 h-6 text-white" /></div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{event.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{event.startTime} - {event.endTime} • {event.location}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Month View */}
            {viewMode === 'month' && (
              <div className="grid grid-cols-7 gap-2">
                {weekDays.map((day) => (
                  <div key={day} className="text-center text-xs font-semibold text-gray-600 p-2">{day.substring(0, 3)}</div>
                ))}
                {[...Array(35)].map((_, i) => (
                  <div key={i} className="aspect-square border border-gray-200 rounded-lg p-2 hover:bg-gray-50 cursor-pointer">
                    <p className="text-sm font-semibold text-gray-900">{i + 1}</p>
                    {i === 16 && (
                      <div className="mt-1 space-y-1">
                        <div className="w-full h-1 bg-blue-500 rounded"></div>
                        <div className="w-full h-1 bg-green-500 rounded"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Quick Notes</h2>
              <button onClick={() => { setAddType('note'); setShowAddModal(true); }} className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                <Plus className="w-4 h-4" />
                Add Note
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {notes.map((note) => (
                <div key={note.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{note.title}</h3>
                    <p className="text-xs text-gray-500">{note.date}</p>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{note.content}</p>
                  <div className="flex gap-2">
                    {note.tags.map((tag, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tasks & Leave */}
          <div className="grid grid-cols-2 gap-6">
            {/* Tasks */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Tasks</h2>
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div key={task.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <input type="checkbox" className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked={task.status === 'completed'} readOnly />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm mb-2">{task.title}</h3>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-0.5 text-xs font-semibold rounded border ${getPriorityColor(task.priority as 'high'|'medium'|'low')}`}>{task.priority}</span>
                          <span className={`px-2 py-0.5 text-xs font-semibold rounded ${getStatusColor(task.status as any)}`}>{task.status}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Calendar className="w-3 h-3" />
                          <span>{task.dueDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Leave Requests */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Leave Requests</h2>
              <div className="space-y-3">
                {leaveRequests.map((leave) => (
                  <div key={leave.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="p-2 bg-blue-50 rounded-lg"><Plane className="w-4 h-4 text-blue-600" /></div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-gray-900 text-sm">{leave.type}</h3>
                          <span className={`px-2 py-0.5 text-xs font-semibold rounded ${getStatusColor(leave.status as any)}`}>{leave.status}</span>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{leave.startDate} to {leave.endDate}</p>
                        <p className="text-xs text-gray-500">{leave.reason}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                {addType === 'task' && 'Add New Task'}
                {addType === 'event' && 'Add New Event'}
                {addType === 'leave' && 'Request Leave'}
                {addType === 'note' && 'Add New Note'}
              </h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label="close">
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="p-6">
              {/* (same form sections as above) */}
            </div>

            <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200 px-6 pb-6">
              <button onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">Cancel</button>
              <button onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2">
                <Save className="w-4 h-4" />
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ————————————————————————————————————————
// Teaching view (integrated subtab - no sidebar/nav)
// ————————————————————————————————————————
const LecturerTeaching = () => {
  const [activeTab, setActiveTab] = useState<'courses' | 'assignments' | 'students' | 'schedule'>('courses');
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  const courses = [
    {
      id: 'CS401',
      name: 'Introduction to AI',
      code: 'CS401',
      semester: 'Fall 2024',
      students: 65,
      schedule: 'Mon, Wed 2:00-3:30 PM',
      room: 'Room 301',
      status: 'Active',
      progress: 65,
      totalClasses: 40,
      completedClasses: 26,
      upcomingClass: 'Today 2:00 PM',
      assignments: 8,
      pendingGrades: 12,
      avgGrade: 78,
      attendanceRate: 92,
    },
    {
      id: 'CS501',
      name: 'Machine Learning',
      code: 'CS501',
      semester: 'Fall 2024',
      students: 58,
      schedule: 'Tue, Thu 10:00-11:30 AM',
      room: 'Lab 102',
      status: 'Active',
      progress: 58,
      totalClasses: 40,
      completedClasses: 23,
      upcomingClass: 'Tomorrow 10:00 AM',
      assignments: 10,
      pendingGrades: 8,
      avgGrade: 82,
      attendanceRate: 88,
    },
    {
      id: 'CS601',
      name: 'Deep Learning',
      code: 'CS601',
      semester: 'Fall 2024',
      students: 42,
      schedule: 'Fri 3:00-5:30 PM',
      room: 'Room 205',
      status: 'Active',
      progress: 42,
      totalClasses: 40,
      completedClasses: 17,
      upcomingClass: 'Oct 18, 3:00 PM',
      assignments: 6,
      pendingGrades: 5,
      avgGrade: 75,
      attendanceRate: 85,
    },
  ];

  const assignments = [
    {
      id: 'A001',
      course: 'CS401',
      title: 'Neural Network Implementation',
      type: 'Programming',
      dueDate: 'Oct 20, 2024',
      submitted: 52,
      total: 65,
      graded: 40,
      avgScore: 85,
      status: 'Active',
    },
    {
      id: 'A002',
      course: 'CS501',
      title: 'ML Model Evaluation',
      type: 'Report',
      dueDate: 'Oct 22, 2024',
      submitted: 45,
      total: 58,
      graded: 38,
      avgScore: 88,
      status: 'Active',
    },
    {
      id: 'A003',
      course: 'CS601',
      title: 'CNN Architecture Design',
      type: 'Project',
      dueDate: 'Oct 25, 2024',
      submitted: 30,
      total: 42,
      graded: 25,
      avgScore: 78,
      status: 'Active',
    },
    {
      id: 'A004',
      course: 'CS401',
      title: 'Midterm Exam',
      type: 'Exam',
      dueDate: 'Oct 15, 2024',
      submitted: 65,
      total: 65,
      graded: 53,
      avgScore: 76,
      status: 'Grading',
    },
  ];

  const students = [
    {
      id: 'S001',
      name: 'John Smith',
      studentId: '2020001',
      courses: ['CS401', 'CS501'],
      avgGrade: 85,
      attendance: 95,
      assignments: { submitted: 15, total: 18 },
      status: 'Excellent',
    },
    {
      id: 'S002',
      name: 'Emily Chen',
      studentId: '2020002',
      courses: ['CS401', 'CS601'],
      avgGrade: 92,
      attendance: 98,
      assignments: { submitted: 14, total: 14 },
      status: 'Excellent',
    },
    {
      id: 'S003',
      name: 'Michael Brown',
      studentId: '2020003',
      courses: ['CS501'],
      avgGrade: 78,
      attendance: 88,
      assignments: { submitted: 8, total: 10 },
      status: 'Good',
    },
    {
      id: 'S004',
      name: 'Sarah Johnson',
      studentId: '2020004',
      courses: ['CS401'],
      avgGrade: 65,
      attendance: 75,
      assignments: { submitted: 5, total: 8 },
      status: 'Need Attention',
    },
  ];

  const teachingSchedule = [
    { day: 'Monday', time: '2:00 PM - 3:30 PM', course: 'CS401', type: 'Lecture', room: 'Room 301' },
    { day: 'Tuesday', time: '10:00 AM - 11:30 AM', course: 'CS501', type: 'Lecture', room: 'Lab 102' },
    { day: 'Wednesday', time: '2:00 PM - 3:30 PM', course: 'CS401', type: 'Lecture', room: 'Room 301' },
    { day: 'Thursday', time: '10:00 AM - 11:30 AM', course: 'CS501', type: 'Lab Session', room: 'Lab 102' },
    { day: 'Friday', time: '3:00 PM - 5:30 PM', course: 'CS601', type: 'Lecture', room: 'Room 205' },
  ];

  const teachingStats = {
    totalCourses: 3,
    totalStudents: 165,
    pendingGrades: 25,
    avgClassRating: 4.6,
    teachingHours: '12h/week',
    completionRate: 94,
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Active: 'bg-green-50 text-green-700 border-green-200',
      Completed: 'bg-blue-50 text-blue-700 border-blue-200',
      Grading: 'bg-orange-50 text-orange-700 border-orange-200',
      Excellent: 'bg-green-50 text-green-700',
      Good: 'bg-blue-50 text-blue-700',
      'Need Attention': 'bg-red-50 text-red-700',
    };
    return colors[status] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  return (
    <div className="flex-1 overflow-auto p-1">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Teaching Management</h1>
            <p className="text-gray-500 mt-1">Manage your courses, students, and assignments</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              <Upload className="w-5 h-5" />
              Upload Materials
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              <Plus className="w-5 h-5" />
              Create New
            </button>
          </div>
        </div>
      </div>

      <div className="mt-3">
        {/* Teaching Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Book className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Courses</p>
                <p className="text-2xl font-bold text-gray-900">{teachingStats.totalCourses}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-50 rounded-lg">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Students</p>
                <p className="text-2xl font-bold text-gray-900">{teachingStats.totalStudents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-orange-50 rounded-lg">
                <ClipboardList className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{teachingStats.pendingGrades}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Award className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Rating</p>
                <p className="text-2xl font-bold text-gray-900">{teachingStats.avgClassRating}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <Clock className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Hours/Week</p>
                <p className="text-2xl font-bold text-gray-900">{teachingStats.teachingHours}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-teal-50 rounded-lg">
                <BarChart3 className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completion</p>
                <p className="text-2xl font-bold text-gray-900">{teachingStats.completionRate}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden  mt-3">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('courses')}
                className={`flex-1 px-6 py-4 font-medium transition-colors ${
                  activeTab === 'courses'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                My Courses
              </button>
              <button
                onClick={() => setActiveTab('assignments')}
                className={`flex-1 px-6 py-4 font-medium transition-colors ${
                  activeTab === 'assignments'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Assignments & Grading
              </button>
              <button
                onClick={() => setActiveTab('students')}
                className={`flex-1 px-6 py-4 font-medium transition-colors ${
                  activeTab === 'students'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Students
              </button>
              <button
                onClick={() => setActiveTab('schedule')}
                className={`flex-1 px-6 py-4 font-medium transition-colors ${
                  activeTab === 'schedule'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Schedule
              </button>
            </div>
          </div>

          {/* Courses Tab */}
          {activeTab === 'courses' && (
            <div className="p-6">
              <div className="space-y-6">
                {courses.map((course) => (
                  <div key={course.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-semibold rounded">
                            {course.code}
                          </span>
                          <span className={`px-3 py-1 text-sm font-semibold rounded border ${getStatusColor(course.status)}`}>
                            {course.status}
                          </span>
                          <span className="text-sm text-gray-600">{course.semester}</span>
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 mb-3">{course.name}</h3>

                        <div className="grid grid-cols-4 gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{course.students} Students</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{course.schedule}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{course.room}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-orange-600 font-medium">{course.upcomingClass}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Classes Progress</p>
                            <p className="text-lg font-bold text-gray-900">
                              {course.completedClasses}/{course.totalClasses}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Assignments</p>
                            <p className="text-lg font-bold text-gray-900">{course.assignments}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Pending Grades</p>
                            <p className="text-lg font-bold text-orange-600">{course.pendingGrades}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Avg Grade</p>
                            <p className="text-lg font-bold text-gray-900">{course.avgGrade}%</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Course Progress</span>
                            <span className="font-semibold text-gray-900">{course.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${course.progress}%` }} />
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 ml-4">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                          Manage Course
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <MoreVertical className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Assignments Tab */}
          {activeTab === 'assignments' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex gap-3">
                  <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>All Courses</option>
                    <option>CS401</option>
                    <option>CS501</option>
                    <option>CS601</option>
                  </select>
                  <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>All Status</option>
                    <option>Active</option>
                    <option>Grading</option>
                    <option>Completed</option>
                  </select>
                </div>
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Search className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="space-y-4">
                {assignments.map((assignment) => (
                  <div key={assignment.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded">
                            {assignment.course}
                          </span>
                          <span className={`px-2 py-1 text-xs font-semibold rounded border ${getStatusColor(assignment.status)}`}>
                            {assignment.status}
                          </span>
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded">
                            {assignment.type}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 mb-3">{assignment.title}</h3>

                        <div className="grid grid-cols-4 gap-4 mb-3">
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Due Date</p>
                            <p className="text-sm font-semibold text-gray-900">{assignment.dueDate}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Submitted</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {assignment.submitted}/{assignment.total}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Graded</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {assignment.graded}/{assignment.submitted}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Avg Score</p>
                            <p className="text-sm font-semibold text-green-600">{assignment.avgScore}%</p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <div className="flex-1">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-gray-600">Submission Progress</span>
                              <span className="font-semibold">
                                {Math.round((assignment.submitted / assignment.total) * 100)}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all"
                                style={{ width: `${(assignment.submitted / assignment.total) * 100}%` }}
                              />
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-gray-600">Grading Progress</span>
                              <span className="font-semibold">
                                {Math.round((assignment.graded / assignment.submitted) * 100)}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-600 h-2 rounded-full transition-all"
                                style={{ width: `${(assignment.graded / assignment.submitted) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 ml-4">
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                          <CheckSquare className="w-4 h-4" />
                          Grade
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Download className="w-5 h-5 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <MoreVertical className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Students Tab */}
          {activeTab === 'students' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex gap-3">
                  <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>All Courses</option>
                    <option>CS401</option>
                    <option>CS501</option>
                    <option>CS601</option>
                  </select>
                  <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>All Performance</option>
                    <option>Excellent</option>
                    <option>Good</option>
                    <option>Need Attention</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Search className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Download className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Student</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Courses</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Avg Grade</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Attendance</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Assignments</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {students.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-gray-900">{student.name}</p>
                            <p className="text-sm text-gray-600">{student.studentId}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {student.courses.map((course, idx) => (
                              <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded">
                                {course}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-gray-900">{student.avgGrade}%</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div className="bg-green-600 h-2 rounded-full" style={{ width: `${student.attendance}%` }} />
                            </div>
                            <span className="text-sm text-gray-900">{student.attendance}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-900">
                            {student.assignments.submitted}/{student.assignments.total}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 text-xs font-semibold rounded ${getStatusColor(student.status)}`}>
                            {student.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                              <Eye className="w-4 h-4 text-gray-600" />
                            </button>
                            <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                              <Send className="w-4 h-4 text-gray-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Schedule Tab */}
          {activeTab === 'schedule' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">Weekly Teaching Schedule</h3>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                  <Download className="w-4 h-4" />
                  Export Schedule
                </button>
              </div>

              <div className="space-y-3">
                {teachingSchedule.map((schedule, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="text-center min-w-24">
                          <p className="text-sm font-semibold text-gray-900">{schedule.day}</p>
                          <p className="text-xs text-gray-600 mt-1">{schedule.time}</p>
                        </div>

                        <div className="h-12 w-px bg-gray-200" />

                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded">
                              {schedule.course}
                            </span>
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded">
                              {schedule.type}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Building2 className="w-4 h-4" />
                            <span>{schedule.room}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                          Start Class
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <MoreVertical className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 grid grid-cols-2 gap-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Office Hours</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">Monday</span>
                      <span className="text-sm font-medium text-gray-900">4:00 PM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">Wednesday</span>
                      <span className="text-sm font-medium text-gray-900">4:00 PM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">Friday</span>
                      <span className="text-sm font-medium text-gray-900">By Appointment</span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Upcoming Events</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Calendar className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Midterm Exam - CS401</p>
                        <p className="text-xs text-gray-600">Oct 25, 2024 • 2:00 PM</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Calendar className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Guest Lecture</p>
                        <p className="text-xs text-gray-600">Oct 28, 2024 • 3:00 PM</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Calendar className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Faculty Meeting</p>
                        <p className="text-xs text-gray-600">Nov 1, 2024 • 10:00 AM</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


// ————————————————————————————————————————
// Research view (integrated subtab)
// ————————————————————————————————————————
const ResearchView = () => {
  const [activeTab, setActiveTab] = useState<'projects' | 'publications'>('projects');
  const [projectFilter, setProjectFilter] = useState<'all' | 'private' | 'government'>('all');

  const privateProjects = [
    {
      id: 'PVT-001',
      title: 'AI-Powered Healthcare Diagnostics',
      type: 'Private/Corporate',
      status: 'Active',
      progress: 75,
      startDate: 'Jan 2024',
      endDate: 'Dec 2024',
      funding: '$150,000',
      partner: 'MediTech Corp',
      team: ['Dr. Smith', '3 Researchers'],
      description: 'Developing AI models for early disease detection',
    },
    {
      id: 'PVT-002',
      title: 'Smart City Infrastructure',
      type: 'Private/Corporate',
      status: 'Active',
      progress: 60,
      startDate: 'Mar 2024',
      endDate: 'Feb 2025',
      funding: '$200,000',
      partner: 'Urban Solutions Inc',
      team: ['Dr. Smith', '5 Researchers'],
      description: 'IoT-based smart city management system',
    },
    {
      id: 'PVT-003',
      title: 'Natural Language Processing for Legal Documents',
      type: 'Private/Corporate',
      status: 'Completed',
      progress: 100,
      startDate: 'Jun 2023',
      endDate: 'Dec 2023',
      funding: '$120,000',
      partner: 'LegalTech Solutions',
      team: ['Dr. Smith', '4 Researchers'],
      description: 'NLP system for automated legal document analysis',
    },
  ];

  const governmentProjects = [
    {
      id: 'GOV-001',
      title: 'National AI Research Initiative',
      type: 'Government',
      status: 'Active',
      progress: 45,
      startDate: 'Jan 2024',
      endDate: 'Dec 2026',
      funding: '$500,000',
      agency: 'Ministry of Science & Technology',
      grantNumber: 'NSF-2024-AI-001',
      team: ['Dr. Smith', '8 Researchers', '2 PhD Students'],
      description: 'Large-scale AI research for national infrastructure',
    },
    {
      id: 'GOV-002',
      title: 'Educational Technology Enhancement',
      type: 'Government',
      status: 'Active',
      progress: 30,
      startDate: 'Sep 2024',
      endDate: 'Aug 2025',
      funding: '$80,000',
      agency: 'Ministry of Education',
      grantNumber: 'MOE-2024-EDU-045',
      team: ['Dr. Smith', '3 Researchers'],
      description: 'AI-powered educational tools for rural schools',
    },
  ];

  const publications = [
    {
      id: 'PUB-001',
      title: 'Advanced Neural Networks for Image Recognition',
      authors: ['Nguyen Van A', 'John Smith', 'Jane Doe'],
      journal: 'IEEE Transactions on Artificial Intelligence',
      year: 2024,
      volume: '15',
      issue: '3',
      pages: '245-260',
      doi: '10.1109/TAI.2024.001',
      citations: 45,
      status: 'Published',
      type: 'Journal Article',
      quartile: 'Q1',
    },
    {
      id: 'PUB-002',
      title: 'Transformer Models in NLP Applications',
      authors: ['Nguyen Van A', 'Emily Chen'],
      journal: 'ACM Computing Surveys',
      year: 2023,
      volume: '56',
      issue: '2',
      pages: '1-35',
      doi: '10.1145/3589001',
      citations: 78,
      status: 'Published',
      type: 'Journal Article',
      quartile: 'Q1',
    },
    {
      id: 'PUB-003',
      title: 'Ethical Considerations in AI Development',
      authors: ['Nguyen Van A', 'Michael Brown', 'Sarah Johnson'],
      journal: 'Nature Machine Intelligence',
      year: 2023,
      volume: '5',
      issue: '8',
      pages: '890-905',
      doi: '10.1038/s42256-023-00001',
      citations: 62,
      status: 'Published',
      type: 'Journal Article',
      quartile: 'Q1',
    },
    {
      id: 'PUB-004',
      title: 'Deep Learning Approaches for Healthcare',
      authors: ['Nguyen Van A', 'Lisa Wang'],
      journal: 'Medical AI Journal',
      year: 2024,
      status: 'Under Review',
      type: 'Journal Article',
      submittedDate: 'Oct 2024',
    },
  ];

  const researchStats = {
    totalProjects: 5,
    activeProjects: 4,
    completedProjects: 1,
    totalFunding: '$1,050,000',
    publications: 8,
    citations: 245,
    hIndex: 12,
  };

  const allProjects = [...privateProjects, ...governmentProjects];

  const filteredProjects =
    projectFilter === 'all'
      ? allProjects
      : projectFilter === 'private'
      ? privateProjects
      : governmentProjects;

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Active: 'bg-green-50 text-green-700 border-green-200',
      Completed: 'bg-blue-50 text-blue-700 border-blue-200',
      'On Hold': 'bg-yellow-50 text-yellow-700 border-yellow-200',
      Published: 'bg-green-50 text-green-700 border-green-200',
      'Under Review': 'bg-orange-50 text-orange-700 border-orange-200',
    };
    return colors[status] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  return (
    <div className="flex-1 overflow-auto p-3">
      {/* Header */}
      <div className="bg-white border-b rounded-xl border-gray-200 px-6 py-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Research Management</h1>
            <p className="text-gray-500 mt-1">Manage your research projects and publications</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            <Plus className="w-5 h-5" />
            Add New
          </button>
        </div>
      </div>

      <div className="p-3 mt-3">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Briefcase className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Projects</p>
                <p className="text-2xl font-bold text-gray-900">{researchStats.totalProjects}</p>
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              {researchStats.activeProjects} Active • {researchStats.completedProjects} Completed
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-50 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Funding</p>
                <p className="text-2xl font-bold text-gray-900">{researchStats.totalFunding}</p>
              </div>
            </div>
            <div className="text-xs text-green-600 mt-2">Across all projects</div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-50 rounded-lg">
                <BookOpen className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Publications</p>
                <p className="text-2xl font-bold text-gray-900">{researchStats.publications}</p>
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-2">{researchStats.citations} Total Citations</div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-orange-50 rounded-lg">
                <Award className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">H-Index</p>
                <p className="text-2xl font-bold text-gray-900">{researchStats.hIndex}</p>
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-2">Research impact metric</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('projects')}
                className={`flex-1 px-6 py-4 font-medium transition-colors ${
                  activeTab === 'projects'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Research Projects
              </button>
              <button
                onClick={() => setActiveTab('publications')}
                className={`flex-1 px-6 py-4 font-medium transition-colors ${
                  activeTab === 'publications'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Publications
              </button>
            </div>
          </div>

          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <div className="p-6">
              {/* Filters */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex gap-3">
                  <button
                    onClick={() => setProjectFilter('all')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      projectFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All Projects ({allProjects.length})
                  </button>
                  <button
                    onClick={() => setProjectFilter('private')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      projectFilter === 'private'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Private/Corporate ({privateProjects.length})
                  </button>
                  <button
                    onClick={() => setProjectFilter('government')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      projectFilter === 'government'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Government ({governmentProjects.length})
                  </button>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Search className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Filter className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Project Cards */}
              <div className="space-y-4">
                {filteredProjects.map((project: any) => (
                  <div
                    key={project.id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded">
                            {project.id}
                          </span>
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded border ${getStatusColor(project.status)}`}
                          >
                            {project.status}
                          </span>
                          {project.type === 'Private/Corporate' ? (
                            <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs font-semibold rounded">
                              Private/Corporate
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded">
                              Government
                            </span>
                          )}
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                        <p className="text-sm text-gray-600 mb-4">{project.description}</p>

                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">
                              {project.startDate} - {project.endDate}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <DollarSign className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-900 font-semibold">{project.funding}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">{project.team.join(', ')}</span>
                          </div>
                        </div>

                        {project.partner && (
                          <div className="flex items-center gap-2 text-sm mb-4">
                            <Building2 className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">Partner: {project.partner}</span>
                          </div>
                        )}

                        {project.agency && (
                          <div className="space-y-1 mb-4">
                            <div className="flex items-center gap-2 text-sm">
                              <Building2 className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600">Agency: {project.agency}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <FileText className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600">Grant: {project.grantNumber}</span>
                            </div>
                          </div>
                        )}

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-semibold text-gray-900">{project.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 ml-4">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Eye className="w-5 h-5 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Edit className="w-5 h-5 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <MoreVertical className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Publications Tab */}
          {activeTab === 'publications' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex gap-3">
                  <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>All Years</option>
                    <option>2024</option>
                    <option>2023</option>
                    <option>2022</option>
                  </select>
                  <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>All Types</option>
                    <option>Journal Article</option>
                    <option>Conference Paper</option>
                    <option>Book Chapter</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Search className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {publications.map((pub) => (
                  <div key={pub.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`px-2 py-1 text-xs font-semibold rounded border ${getStatusColor(pub.status)}`}>
                            {pub.status}
                          </span>
                          {pub.quartile && (
                            <span className="px-2 py-1 bg-yellow-50 text-yellow-700 text-xs font-semibold rounded border border-yellow-200">
                              {pub.quartile}
                            </span>
                          )}
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded">{pub.type}</span>
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 mb-2">{pub.title}</h3>

                        <p className="text-sm text-gray-600 mb-3">{pub.authors.join(', ')}</p>

                        <p className="text-sm text-gray-700 font-medium mb-3">
                          {pub.journal}
                          {pub.volume && pub.issue && (
                            <span className="text-gray-600 font-normal"> • Vol. {pub.volume}, Issue {pub.issue}</span>
                          )}
                          {pub.pages && <span className="text-gray-600 font-normal"> • pp. {pub.pages}</span>}
                        </p>

                        <div className="flex items-center gap-6 text-sm text-gray-600">
                          <span>Year: {pub.year}</span>
                          {pub.doi && <span>DOI: {pub.doi}</span>}
                          {pub.citations !== undefined && (
                            <span className="font-semibold text-blue-600">Citations: {pub.citations}</span>
                          )}
                          {pub.submittedDate && <span>Submitted: {pub.submittedDate}</span>}
                        </div>
                      </div>

                      <div className="flex gap-2 ml-4">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Eye className="w-5 h-5 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Edit className="w-5 h-5 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <MoreVertical className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CanvasView = () => {
  const [open, setOpen] = useState<Record<string, boolean>>({
    csir6261: false,
    cs6262: false,
    cs6238: false,
  });

  const toggleDiscussion = (id: keyof typeof open) => {
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const navigateTo = (section: string) => {
    window.alert(`Navigating to ${section} management...`);
  };

  return (
    <div>
      {/* Header */}
      <div className="header bg-[linear-gradient(135deg,#5b6ce8_0%,#8b5cf6_100%)] rounded-xl  text-white  mb-3 shadow-[0_4px_20px_rgba(91,108,232,0.3)] p-5" >
        <div className="header-content max-w mx-auto rounded-xl flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="header-title text-[28px] font-bold mb-1">HSB Canvas / LMS</div>
            <div className="header-subtitle text-sm opacity-90">Lecturer Management System</div>
          </div>
          <button
            className="header-btn bg-white/20 border border-white/30 text-white p-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:bg-white/30 hover:-translate-y-0.5"
            onClick={() => navigateTo("documentation")}
          >
            <BookOpen className="w-[18px] h-[18px]" />
            Documentation
          </button>
        </div>
      </div>

      {/* Container */}
      <div className="">
        {/* Course Overview Stats */}
        <div className="section">
          <h2 className="section-title text-[20px] font-semibold text-gray-900 mb-3 text-center">Course Overview</h2>
          <div className="stats-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="stat-card bg-white rounded-2xl p-7 border border-gray-200 text-center transition-all hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(91,108,232,0.12)]">
              <div className="stat-value text-[40px] font-bold bg-[linear-gradient(135deg,#5b6ce8_0%,#8b5cf6_100%)] bg-clip-text text-transparent mb-2">
                65
              </div>
              <div className="stat-label text-sm text-gray-500 font-semibold tracking-wide uppercase">Total Students</div>
            </div>
            <div className="stat-card bg-white rounded-2xl p-7 border border-gray-200 text-center transition-all hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(91,108,232,0.12)]">
              <div className="stat-value text-[40px] font-bold bg-[linear-gradient(135deg,#5b6ce8_0%,#8b5cf6_100%)] bg-clip-text text-transparent mb-2">
                8
              </div>
              <div className="stat-label text-sm text-gray-500 font-semibold tracking-wide uppercase">Active Modules</div>
            </div>
            <div className="stat-card bg-white rounded-2xl p-7 border border-gray-200 text-center transition-all hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(91,108,232,0.12)]">
              <div className="stat-value text-[40px] font-bold bg-[linear-gradient(135deg,#5b6ce8_0%,#8b5cf6_100%)] bg-clip-text text-transparent mb-2">
                12
              </div>
              <div className="stat-label text-sm text-gray-500 font-semibold tracking-wide uppercase">Assignments</div>
            </div>
            <div className="stat-card bg-white rounded-2xl p-7 border border-gray-200 text-center transition-all hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(91,108,232,0.12)]">
              <div className="stat-value text-[40px] font-bold bg-[linear-gradient(135deg,#5b6ce8_0%,#8b5cf6_100%)] bg-clip-text text-transparent mb-2">
                82%
              </div>
              <div className="stat-label text-sm text-gray-500 font-semibold tracking-wide uppercase">Avg Grade</div>
            </div>
          </div>
        </div>

        {/* Main Features */}
        <div className="cards-grid grid gap-3 mt-3 mb-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
          <div
            className="feature-card bg-white rounded-2xl p-8 border border-gray-200 transition-all cursor-pointer relative overflow-hidden hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(91,108,232,0.15)] hover:border-[#5b6ce8]"
            onClick={() => navigateTo("materials")}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-[linear-gradient(90deg,#5b6ce8,#8b5cf6)] opacity-0 transition-opacity duration-300 pointer-events-none feature-card-bar" />
            <div className="card-icon card-icon-blue w-14 h-14 rounded-xl flex items-center justify-center mb-5 text-2xl bg-[rgba(91,108,232,0.1)] text-[#5b6ce8]">
              📚
            </div>
            <h3 className="card-title text-lg font-semibold text-gray-900 mb-2">Course Materials</h3>
            <p className="card-description text-sm text-gray-500 leading-6">
              Upload lectures, readings, and resources for student access
            </p>
          </div>

          <div
            className="feature-card bg-white rounded-2xl p-8 border border-gray-200 transition-all cursor-pointer relative overflow-hidden hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(91,108,232,0.15)] hover:border-[#5b6ce8]"
            onClick={() => navigateTo("assignments")}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-[linear-gradient(90deg,#5b6ce8,#8b5cf6)] opacity-0 transition-opacity duration-300 pointer-events-none feature-card-bar" />
            <div className="card-icon card-icon-purple w-14 h-14 rounded-xl flex items-center justify-center mb-5 text-2xl bg-[rgba(139,92,246,0.1)] text-[#8b5cf6]">
              📝
            </div>
            <h3 className="card-title text-lg font-semibold text-gray-900 mb-2">Assignments</h3>
            <p className="card-description text-sm text-gray-500 leading-6">
              Create, submit, and track assignment deadlines and submissions
            </p>
          </div>

          <div
            className="feature-card bg-white rounded-2xl p-8 border border-gray-200 transition-all cursor-pointer relative overflow-hidden hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(91,108,232,0.15)] hover:border-[#5b6ce8]"
            onClick={() => navigateTo("grades")}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-[linear-gradient(90deg,#5b6ce8,#8b5cf6)] opacity-0 transition-opacity duration-300 pointer-events-none feature-card-bar" />
            <div className="card-icon card-icon-green w-14 h-14 rounded-xl flex items-center justify-center mb-5 text-2xl bg-[rgba(16,185,129,0.1)] text-[#10b981]">
              📊
            </div>
            <h3 className="card-title text-lg font-semibold text-gray-900 mb-2">Grades & Feedback</h3>
            <p className="card-description text-sm text-gray-500 leading-6">
              Grade submissions and provide detailed instructor feedback
            </p>
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="section mb-3">
          <h2 className="section-title text-[20px] font-semibold text-gray-900 mb-3 text-center">
            Pending Tasks & Actions Required
          </h2>

          <div className="update-item bg-white rounded-xl p-5 border border-gray-200 mb-3 flex items-start gap-4 transition-all hover:border-[#5b6ce8] hover:shadow-[0_2px_8px_rgba(91,108,232,0.1)]">
            <div className="update-icon update-icon-orange w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0 text-[20px] bg-[rgba(249,115,22,0.1)]">
              📝
            </div>
            <div className="update-content flex-1">
              <div className="update-title text-[15px] font-semibold text-gray-900 mb-1">
                Grading Required
                <span className="update-badge badge-pending inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold ml-2 bg-[rgba(249,115,22,0.1)] text-[#f97316]">
                  15 Submissions
                </span>
              </div>
              <div className="update-description text-sm text-gray-500 mb-1.5">
                Assignment 3: Incident Response Plan - 15 student submissions are awaiting your grades and feedback
              </div>
              <div className="update-meta text-xs text-gray-400">Due: Oct 20, 2025 • CSIR-6261</div>
            </div>
          </div>

          <div className="update-item bg-white rounded-xl p-5 border border-gray-200 mb-3 flex items-start gap-4 transition-all hover:border-[#5b6ce8] hover:shadow-[0_2px_8px_rgba(91,108,232,0.1)]">
            <div className="update-icon update-icon-orange w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0 text-[20px] bg-[rgba(249,115,22,0.1)]">
              📝
            </div>
            <div className="update-content flex-1">
              <div className="update-title text-[15px] font-semibold text-gray-900 mb-1">
                Grading Required
                <span className="update-badge badge-pending inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold ml-2 bg-[rgba(249,115,22,0.1)] text-[#f97316]">
                  8 Submissions
                </span>
              </div>
              <div className="update-description text-sm text-gray-500 mb-1.5">
                Assignment 2: Threat Modeling - 8 late submissions need to be reviewed and graded
              </div>
              <div className="update-meta text-xs text-gray-400">Overdue • CSIR-6261</div>
            </div>
          </div>

          <div className="update-item bg-white rounded-xl p-5 border border-gray-200 mb-3 flex items-start gap-4 transition-all hover:border-[#5b6ce8] hover:shadow-[0_2px_8px_rgba(91,108,232,0.1)]">
            <div className="update-icon update-icon-blue w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0 text-[20px] bg-[rgba(91,108,232,0.1)]">
              📚
            </div>
            <div className="update-content flex-1">
              <div className="update-title text-[15px] font-semibold text-gray-900 mb-1">
                Course Material Update Required
                <span className="update-badge badge-pending inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold ml-2 bg-[rgba(249,115,22,0.1)] text-[#f97316]">
                  Action Needed
                </span>
              </div>
              <div className="update-description text-sm text-gray-500 mb-1.5">
                Week 6 lecture materials need to be uploaded before next class session on Monday
              </div>
              <div className="update-meta text-xs text-gray-400">Due: Oct 21, 2025 • CSIR-6261</div>
            </div>
          </div>

          <div className="update-item bg-white rounded-xl p-5 border border-gray-200 mb-3 flex items-start gap-4 transition-all hover:border-[#5b6ce8] hover:shadow-[0_2px_8px_rgba(91,108,232,0.1)]">
            <div className="update-icon update-icon-purple w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0 text-[20px] bg-[rgba(139,92,246,0.1)]">
              📋
            </div>
            <div className="update-content flex-1">
              <div className="update-title text-[15px] font-semibold text-gray-900 mb-1">
                Quiz Creation Required
                <span className="update-badge badge-pending inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold ml-2 bg-[rgba(249,115,22,0.1)] text-[#f97316]">
                  Not Started
                </span>
              </div>
              <div className="update-description text-sm text-gray-500 mb-1.5">
                Quiz 5: Security Monitoring needs to be created and published for next week's assessment
              </div>
              <div className="update-meta text-xs text-gray-400">Scheduled: Oct 22, 2025 • CSIR-6261</div>
            </div>
          </div>

          <div className="update-item bg-white rounded-xl p-5 border border-gray-200 mb-3 flex items-start gap-4 transition-all hover:border-[#5b6ce8] hover:shadow-[0_2px_8px_rgba(91,108,232,0.1)]">
            <div className="update-icon update-icon-green w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0 text-[20px] bg-[rgba(16,185,129,0.1)]">
              ✅
            </div>
            <div className="update-content flex-1">
              <div className="update-title text-[15px] font-semibold text-gray-900 mb-1">Module Review Required</div>
              <div className="update-description text-sm text-gray-500 mb-1.5">
                Week 3: Incident Detection Methods is in draft status and ready for your final review before publishing
              </div>
              <div className="update-meta text-xs text-gray-400">Ready for Review • CSIR-6261</div>
            </div>
          </div>
        </div>

        {/* Course Discussion Updates */}
        <div className="section mb-3">
          <h2 className="section-title text-[20px] font-semibold text-gray-900 mb-3 text-center">
            Course Discussion Updates
          </h2>

          {/* CSIR-6261 Discussions */}
          <div className="mb-3">
            <div
              className="course-discussion-header flex items-center justify-between px-5 py-4 bg-white border border-gray-200 rounded-xl cursor-pointer transition-all mb-3 hover:border-[#5b6ce8] hover:shadow-[0_2px_8px_rgba(91,108,232,0.1)]"
              onClick={() => toggleDiscussion("csir6261")}
            >
              <div className="course-discussion-title flex items-center gap-3 text-[16px] font-semibold">
                <span style={{ color: "#5b6ce8" }}>CSIR-6261 - Cybersecurity Incident Response</span>
                <span className="course-badge badge-count inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold bg-[rgba(249,115,22,0.1)] text-[#f97316]">
                  4 new posts
                </span>
              </div>
              <svg
                className={`dropdown-icon w-5 h-5 text-gray-500 transition-transform ${open.csir6261 ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {open.csir6261 && (
              <div className="course-discussions block mb-3">
                <div className="update-item bg-white rounded-xl p-5 border border-gray-200 mb-3 flex items-start gap-4 transition-all hover:border-[#5b6ce8] hover:shadow-[0_2px_8px_rgba(91,108,232,0.1)]">
                  <div className="update-icon update-icon-purple w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0 text-[20px] bg-[rgba(139,92,246,0.1)]">
                    💬
                  </div>
                  <div className="update-content flex-1">
                    <div className="update-title text-[15px] font-semibold text-gray-900 mb-1">
                      New Discussion Post
                      <span className="update-badge badge-pending inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold ml-2 bg-[rgba(249,115,22,0.1)] text-[#f97316]">
                        12 Replies
                      </span>
                    </div>
                    <div className="update-description text-sm text-gray-500 mb-1.5">
                      Sarah Johnson posted: &quot;Question about Week 5 Assignment - Part C clarification needed&quot;
                    </div>
                    <div className="update-meta text-xs text-gray-400">3 hours ago</div>
                  </div>
                </div>

                <div className="update-item bg-white rounded-xl p-5 border border-gray-200 mb-3 flex items-start gap-4 transition-all hover:border-[#5b6ce8] hover:shadow-[0_2px_8px_rgba(91,108,232,0.1)]">
                  <div className="update-icon update-icon-green w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0 text-[20px] bg-[rgba(16,185,129,0.1)]">
                    💬
                  </div>
                  <div className="update-content flex-1">
                    <div className="update-title text-[15px] font-semibold text-gray-900 mb-1">
                      Active Discussion
                      <span className="update-badge badge-pending inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold ml-2 bg-[rgba(249,115,22,0.1)] text-[#f97316]">
                        24 Replies
                      </span>
                    </div>
                    <div className="update-description text-sm text-gray-500 mb-1.5">
                      Thread: &quot;Best practices for incident response documentation&quot; - High engagement from students
                    </div>
                    <div className="update-meta text-xs text-gray-400">Yesterday</div>
                  </div>
                </div>

                <div className="update-item bg-white rounded-xl p-5 border border-gray-200 mb-3 flex items-start gap-4 transition-all hover:border-[#5b6ce8] hover:shadow-[0_2px_8px_rgba(91,108,232,0.1)]">
                  <div className="update-icon update-icon-orange w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0 text-[20px] bg-[rgba(249,115,22,0.1)]">
                    💬
                  </div>
                  <div className="update-content flex-1">
                    <div className="update-title text-[15px] font-semibold text-gray-900 mb-1">
                      Awaiting Response
                      <span className="update-badge badge-pending inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold ml-2 bg-[rgba(249,115,22,0.1)] text-[#f97316]">
                        Instructor Input Needed
                      </span>
                    </div>
                    <div className="update-description text-sm text-gray-500 mb-1.5">
                      Emma Wilson: &quot;Professor, could you clarify the midterm exam format and coverage areas?&quot;
                    </div>
                    <div className="update-meta text-xs text-gray-400">2 days ago</div>
                  </div>
                </div>

                <div className="update-item bg-white rounded-xl p-5 border border-gray-200 mb-3 flex items-start gap-4 transition-all hover:border-[#5b6ce8] hover:shadow-[0_2px_8px_rgba(91,108,232,0.1)]">
                  <div className="update-icon update-icon-blue w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0 text-[20px] bg-[rgba(91,108,232,0.1)]">
                    💬
                  </div>
                  <div className="update-content flex-1">
                    <div className="update-title text-[15px] font-semibold text-gray-900 mb-1">Group Discussion</div>
                    <div className="update-description text-sm text-gray-500 mb-1.5">
                      Study group formed for final exam preparation - 8 students actively collaborating
                    </div>
                    <div className="update-meta text-xs text-gray-400">2 days ago</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CS-6262 Discussions */}
          <div className="mb-3">
            <div
              className="course-discussion-header flex items-center justify-between px-5 py-4 bg-white border border-gray-200 rounded-xl cursor-pointer transition-all mb-3 hover:border-[#5b6ce8] hover:shadow-[0_2px_8px_rgba(91,108,232,0.1)]"
              onClick={() => toggleDiscussion("cs6262")}
            >
              <div className="course-discussion-title flex items-center gap-3 text-[16px] font-semibold">
                <span style={{ color: "#8b5cf6" }}>CS-6262 - Network Security</span>
                <span className="course-badge badge-count inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold bg-[rgba(249,115,22,0.1)] text-[#f97316]">
                  2 new posts
                </span>
              </div>
              <svg
                className={`dropdown-icon w-5 h-5 text-gray-500 transition-transform ${open.cs6262 ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {open.cs6262 && (
              <div className="course-discussions block mb-6">
                <div className="update-item bg-white rounded-xl p-5 border border-gray-200 mb-3 flex items-start gap-4 transition-all hover:border-[#5b6ce8] hover:shadow-[0_2px_8px_rgba(91,108,232,0.1)]">
                  <div className="update-icon update-icon-blue w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0 text-[20px] bg-[rgba(91,108,232,0.1)]">
                    💬
                  </div>
                  <div className="update-content flex-1">
                    <div className="update-title text-[15px] font-semibold text-gray-900 mb-1">
                      Student Question
                      <span className="update-badge badge-pending inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold ml-2 bg-[rgba(249,115,22,0.1)] text-[#f97316]">
                        Unanswered
                      </span>
                    </div>
                    <div className="update-description text-sm text-gray-500 mb-1.5">
                      Michael Chen asked: &quot;Can someone explain the difference between IDS and IPS in the context of our lab?&quot;
                    </div>
                    <div className="update-meta text-xs text-gray-400">5 hours ago</div>
                  </div>
                </div>

                <div className="update-item bg-white rounded-xl p-5 border border-gray-200 mb-3 flex items-start gap-4 transition-all hover:border-[#5b6ce8] hover:shadow-[0_2px_8px_rgba(91,108,232,0.1)]">
                  <div className="update-icon update-icon-purple w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0 text-[20px] bg-[rgba(139,92,246,0.1)]">
                    💬
                  </div>
                  <div className="update-content flex-1">
                    <div className="update-title text-[15px] font-semibold text-gray-900 mb-1">
                      Lab Discussion
                      <span className="update-badge badge-pending inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold ml-2 bg-[rgba(249,115,22,0.1)] text-[#f97316]">
                        6 Replies
                      </span>
                    </div>
                    <div className="update-description text-sm text-gray-500 mb-1.5">
                      David Lee: &quot;Having trouble with Wireshark configuration in Lab 3, anyone else experiencing this?&quot;
                    </div>
                    <div className="update-meta text-xs text-gray-400">1 day ago</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CS-6238 Discussions */}
          <div className="mb-3">
            <div
              className="course-discussion-header flex items-center justify-between px-5 py-4 bg-white border border-gray-200 rounded-xl cursor-pointer transition-all mb-3 hover:border-[#5b6ce8] hover:shadow-[0_2px_8px_rgba(91,108,232,0.1)]"
              onClick={() => toggleDiscussion("cs6238")}
            >
              <div className="course-discussion-title flex items-center gap-3 text-[16px] font-semibold">
                <span style={{ color: "#10b981" }}>CS-6238 - Secure Computer Systems</span>
                <span className="course-badge badge-count inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold bg-[rgba(249,115,22,0.1)] text-[#f97316]">
                  2 new posts
                </span>
              </div>
              <svg
                className={`dropdown-icon w-5 h-5 text-gray-500 transition-transform ${open.cs6238 ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {open.cs6238 && (
              <div className="course-discussions block mb-6">
                <div className="update-item bg-white rounded-xl p-5 border border-gray-200 mb-3 flex items-start gap-4 transition-all hover:border-[#5b6ce8] hover:shadow-[0_2px_8px_rgba(91,108,232,0.1)]">
                  <div className="update-icon update-icon-green w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0 text-[20px] bg-[rgba(16,185,129,0.1)]">
                    💬
                  </div>
                  <div className="update-content flex-1">
                    <div className="update-title text-[15px] font-semibold text-gray-900 mb-1">
                      Research Discussion
                      <span className="update-badge badge-pending inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold ml-2 bg-[rgba(249,115,22,0.1)] text-[#f97316]">
                        15 Replies
                      </span>
                    </div>
                    <div className="update-description text-sm text-gray-500 mb-1.5">
                      Thread: &quot;Latest vulnerabilities in modern OS kernels&quot; - Students sharing research findings
                    </div>
                    <div className="update-meta text-xs text-gray-400">3 days ago</div>
                  </div>
                </div>

                <div className="update-item bg-white rounded-xl p-5 border border-gray-200 mb-3 flex items-start gap-4 transition-all hover:border-[#5b6ce8] hover:shadow-[0_2px_8px_rgba(91,108,232,0.1)]">
                  <div className="update-icon update-icon-blue w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0 text-[20px] bg-[rgba(91,108,232,0.1)]">
                    💬
                  </div>
                  <div className="update-content flex-1">
                    <div className="update-title text-[15px] font-semibold text-gray-900 mb-1">Assignment Clarification</div>
                    <div className="update-description text-sm text-gray-500 mb-1.5">
                      Lisa Wang: &quot;Is the secure coding assignment due this Friday or next Friday?&quot;
                    </div>
                    <div className="update-meta text-xs text-gray-400">4 days ago</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Small responsive tweak to header/container spacing */}
      <style>{`
        @media (max-width: 768px) {
          .header { padding: 24px !important; }
          .container { padding: 0 24px 24px !important; }
        }
        /* Show the gradient bar on hover (for the three feature cards) */
        .feature-card:hover .feature-card-bar { opacity: 1; }
      `}</style>
    </div>
  );
};

 const Identification = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const url = await QRCode.toDataURL("Nguyen Van A | 22080 | Faculty of Management | Lecturer-Dean ", {
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
        Staff Identification Card (VNU-HSB) </p>
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
      <p className="text-gray-500 text-[10px] uppercase tracking-wide mb-0.5 font-semibold">Staff ID</p>
      <p className="text-sm font-bold text-gray-900">22080</p>
    </div>

    <div className="border-b border-gray-200 pb-2">
      <p className="text-gray-500 text-[10px] uppercase tracking-wide mb-0.5 font-semibold">Department</p>
      <p className="text-sm font-bold text-gray-900">Faculty of Management</p>
    </div>

    <div className="grid grid-cols-2 gap-3 border-b border-gray-200 pb-2">
      <div>
        <p className="text-gray-500 text-[10px] uppercase tracking-wide mb-0.5 font-semibold">Type</p>
        <p className="text-sm font-bold text-gray-900">Lecturer</p>
      </div>
      <div>
        <p className="text-gray-500 text-[10px] uppercase tracking-wide mb-0.5 font-semibold">Level</p>
        <p className="text-sm font-bold text-emerald-600">Dean</p>
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


// ————————————————————————————————————————
// Root: Sidebar + conditional content routing
// ————————————————————————————————————————
const LecturerApp = () => {
  const [activeNav, setActiveNav] = useState('Dashboard');
 // Sidebar controls
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLocked, setIsLocked] = useState(true);

  const toggleLock = () => setIsLocked(v => !v);
  const toggleCollapse = () => {
    if (isLocked) return;
    setIsCollapsed(v => !v);
  };

  // Optional: hover-to-expand when unlocked
  const handleEnter = () => {
    if (!isLocked && isCollapsed) setIsCollapsed(false);
  };
  const handleLeave = () => {
    if (!isLocked && !isCollapsed) setIsCollapsed(true);
  };
  const navItems = [
    { name: 'Dashboard', icon: Home },
    { name: 'My Profile', icon: UserIcon },
    { name: 'Teaching', icon: BookText },
    { name: 'Schedule', icon: Clock },
    { name: 'Documents', icon: BookOpen },
    { name: 'Research', icon: TrendingUp },
    { name: 'Canvas/LMS', icon: Globe },
    { name: 'Online Library', icon: BookPlus },
    { name: 'Identification', icon: UserIcon },

  ];

  const renderContent = () => {
    switch (activeNav) {
      case 'Dashboard':
        return <DashboardContent />;
      case 'My Profile':
        return <LecturerProfile />;
      case 'Teaching':
        return <LecturerTeaching />;
      case 'Schedule':
        return <ScheduleView />;
      case 'Documents':
        return <Documents />;  
      case 'Research':
        return <ResearchView />;
      case 'Canvas/LMS':
        return <CanvasView />;
       case 'Library':
        return <LibraryViewer/>; 
      case 'Identification':
        return <Identification />;
      default:
        return <DashboardContent />;
    }
  };

  return (
      <div className="flex min-h-screen bg-gray-50">
      {/* Left Sidebar */}
      <aside
        className={`${isCollapsed ? 'w-16' : 'w-60'} relative bg-slate-800 text-white flex flex-col transition-all duration-300`}
       
      >
        {/* Header: title + controls on the same baseline */}
        <div className="p-4 border-b border-slate-700">
          <div className={`${isCollapsed ? 'hidden' : 'block'}`}>
            {/* Row 1: Title (left) + Controls (right) aligned */}
            <div className="flex items-start justify-between">
               <h1 className="text-2xl font-bold leading-none">HSB ERP</h1>

              <div className="flex items-baseline gap-2">
                {/* Lock / Unlock */}
                <button
                  onClick={toggleLock}
                  title={isLocked ? 'Unlock panel' : 'Lock panel'}
                  className="p-2 rounded-lg border border-white/20 bg-white/10 hover:bg-white/20"
                >
                  {isLocked ? <LockIcon size={16} /> : <UnlockIcon size={16} />}
                </button>

                {/* Collapse / Expand */}
                <button
                  onClick={toggleCollapse}
                  title={
                    isCollapsed ? 'Expand panel' : isLocked ? 'Unlock to collapse' : 'Collapse panel'
                  }
                  className={`p-2 rounded-lg border ${
                    isLocked
                      ? 'border-white/20 opacity-50 cursor-not-allowed'
                      : 'border-white/60 bg-slate-800 hover:bg-slate-700'
                  }`}
                >
                  {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeftIcon size={16} />}
                </button>
              </div>
            </div>

            {/* Row 2: Subtitle */}
        <p className="text-slate-300 text-sm leading-none">Staff Portal</p>
          </div>

          {/* When collapsed, show compact controls (optional) */}
          {isCollapsed && (
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={toggleLock}
                title={isLocked ? 'Unlock panel' : 'Lock panel'}
                className="p-2 rounded-lg border border-white/20 bg-white/10 hover:bg-white/20"
              >
                {isLocked ? <LockIcon size={16} /> : <UnlockIcon size={16} />}
              </button>
              <button
                onClick={toggleCollapse}
                title={
                  isCollapsed ? 'Expand panel' : isLocked ? 'Unlock to collapse' : 'Collapse panel'
                }
                className={`p-2 rounded-lg border ${
                  isLocked
                    ? 'border-white/20 opacity-50 cursor-not-allowed'
                    : 'border-white/60 bg-slate-800 hover:bg-slate-700'
                }`}
              >
                {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeftIcon size={16} />}
              </button>
            </div>
          )}
        </div>
         
          
        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.name;
              return (
                <li key={item.name}>
                  <button
                    onClick={() => setActiveNav(item.name)}
                    title={item.name} // helpful tooltip when collapsed
                    className={`w-full flex items-center ${
                      isCollapsed ? 'justify-center px-2' : 'justify-start px-4 gap-3'
                    } py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-slate-700 text-white'
                        : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className={`${isCollapsed ? 'sr-only' : 'inline'} font-medium`}>
                      {item.name}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
         {/* User Profile Footer */}
<div className="p-4 border-t border-slate-700">
  <div
    className={`flex items-center px-4 py-3 overflow-hidden
      ${isCollapsed ? 'justify-center gap-0' : 'justify-start gap-3'}`}
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
        ${isCollapsed ? 'w-0 opacity-0 pointer-events-none select-none' : 'w-auto opacity-100'}`}
    >
      <p className="font-medium text-sm">Nguyễn Văn A</p>
      <p className="text-slate-400 text-xs">ID: 22080</p>
    </div>
  </div>
</div>   
      </aside>
    

      {/* Main Content */}
      <main className="flex-1 p-2 w-full space-y-6 overflow-visible min-h-screen">
        {renderContent()}
      </main>
    </div>
  );
};

export default LecturerApp;
