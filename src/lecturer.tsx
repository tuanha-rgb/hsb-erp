import React, { useState } from 'react';
import { Clock, FileText, Users, TrendingUp, BookOpen, Calendar, CheckSquare, AlertCircle, Award, MessageSquare, Bell, ChevronRight, BarChart3, Home, User, BookText, Globe, Lock, ChevronLeft } from 'lucide-react';

const LecturerDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('This Week');
  const [activeNav, setActiveNav] = useState('Dashboard');

  const navItems = [
    { name: 'Dashboard', icon: Home },
    { name: 'My Profile', icon: User },
    { name: 'Teaching', icon: BookText },
    { name: 'Schedule', icon: Clock },
    { name: 'Research', icon: TrendingUp },
    { name: 'Canvas/LMS', icon: Globe },
    { name: 'Messages', icon: MessageSquare }
  ];

  const stats = [
    { 
      label: 'Teaching Hours', 
      value: '480/700h', 
      subtitle: 'Total cumulative', 
      change: '+12h this week',
      trend: 'up',
      icon: Clock,
      color: 'blue'
    },
    { 
      label: 'Publications', 
      value: '8 | 700h', 
      subtitle: 'Papers: 5 & Patents: 3', 
      change: '+2 this year',
      trend: 'up',
      icon: FileText,
      color: 'green'
    },
    { 
      label: 'Active Projects', 
      value: '12', 
      subtitle: 'Research & Supervision', 
      change: '+3 this semester',
      trend: 'up',
      icon: BookOpen,
      color: 'purple'
    },
    { 
      label: 'Avg. Feedback Score', 
      value: '4.6/5', 
      subtitle: 'Student ratings', 
      change: '+0.3 improvement',
      trend: 'up',
      icon: TrendingUp,
      color: 'orange'
    }
  ];

  const courses = [
    { id: 'CS401', name: 'Introduction to AI', students: 65, upcoming: 'Lecture - Today 2:00 PM', progress: 65, status: 'active' },
    { id: 'CS501', name: 'Machine Learning', students: 58, upcoming: 'Lab Session - Tomorrow 10:00 AM', progress: 58, status: 'active' },
    { id: 'CS601', name: 'Deep Learning', students: 42, upcoming: 'Assignment Due - Oct 20', progress: 42, status: 'active' }
  ];

  const pendingTasks = [
    { id: 1, title: 'Grade submission - CS401', due: 'Due Oct 19', priority: 'high', category: 'Grading' },
    { id: 2, title: 'Syllabus update - CS501', due: 'Due Oct 25', priority: 'medium', category: 'Planning' },
    { id: 3, title: 'Thesis review - John Doe', due: 'Due Oct 25', priority: 'medium', category: 'Research' },
    { id: 4, title: 'Midterm preparation - CS601', due: 'Due Oct 30', priority: 'low', category: 'Teaching' }
  ];

  const upcomingClasses = [
    { course: 'Introduction to AI', type: 'Lecture', time: 'Today, 2:00 PM', room: 'Room 301', duration: '2h' },
    { course: 'Machine Learning', type: 'Lab', time: 'Tomorrow, 10:00 AM', room: 'Lab 102', duration: '3h' },
    { course: 'Deep Learning', type: 'Lecture', time: 'Oct 18, 3:00 PM', room: 'Room 205', duration: '2h' }
  ];

  const recentActivity = [
    { type: 'submission', title: 'New assignment submission', detail: 'CS401 - 12 students submitted', time: '2h ago', icon: FileText },
    { type: 'question', title: 'Student question posted', detail: 'ML Assignment 3 - Discussion', time: '4h ago', icon: MessageSquare },
    { type: 'achievement', title: 'Research milestone', detail: 'Paper accepted for conference', time: '1d ago', icon: Award },
    { type: 'alert', title: 'Grade deadline approaching', detail: 'CS401 Midterm - 2 days left', time: '1d ago', icon: AlertCircle }
  ];

  const studentEngagement = [
    { metric: 'Attendance Rate', value: '92%', change: '+3%' },
    { metric: 'Assignment Completion', value: '87%', change: '+5%' },
    { metric: 'Discussion Participation', value: '68%', change: '-2%' },
    { metric: 'Average Grade', value: '78%', change: '+3%' }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600 border-blue-200',
      green: 'bg-green-50 text-green-600 border-green-200',
      purple: 'bg-purple-50 text-purple-600 border-purple-200',
      orange: 'bg-orange-50 text-orange-600 border-orange-200'
    };
    return colors[color] || colors.blue;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'text-red-600 bg-red-50',
      medium: 'text-orange-600 bg-orange-50',
      low: 'text-blue-600 bg-blue-50'
    };
    return colors[priority] || colors.low;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-64 bg-slate-800 text-white flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold">HSB ERP</h1>
            <div className="flex items-center gap-2">
              <button className="p-1.5 hover:bg-slate-700 rounded">
                <Lock className="w-4 h-4" />
              </button>
              <button className="p-1.5 hover:bg-slate-700 rounded">
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* User Dropdown */}
          <select className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Lecturer</option>
            <option>Admin</option>
            <option>Student</option>
          </select>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <button
                    onClick={() => setActiveNav(item.name)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeNav === item.name
                        ? 'bg-slate-700 text-white'
                        : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Lecturer Dashboard</h1>
              <p className="text-gray-500 mt-1">Welcome back, Dr. Smith</p>
            </div>
            <div className="flex items-center gap-4">
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>This Week</option>
                <option>This Month</option>
                <option>This Semester</option>
                <option>This Year</option>
              </select>
              <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-6 mb-8">
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

          <div className="grid grid-cols-3 gap-6 mb-8">
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

            {/* Upcoming Classes */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Schedule</h2>
                <Calendar className="w-5 h-5 text-gray-400" />
              </div>
              <div className="space-y-4">
                {upcomingClasses.map((cls, index) => (
                  <div key={index} className="border-l-4 border-blue-600 pl-4 py-2">
                    <p className="font-semibold text-gray-900 text-sm">{cls.course}</p>
                    <p className="text-xs text-gray-600 mt-1">{cls.type} • {cls.duration}</p>
                    <p className="text-xs text-blue-600 font-medium mt-1">{cls.time}</p>
                    <p className="text-xs text-gray-500 mt-1">{cls.room}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-8">
            {/* Pending Tasks */}
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
                        <span className={`px-2 py-0.5 text-xs font-medium rounded ${getPriorityColor(task.priority)}`}>
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
      </div>
    </div>
  );
};

export default LecturerDashboard;