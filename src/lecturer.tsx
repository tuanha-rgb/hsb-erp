import React, { useState } from 'react';
import {
  Clock, FileText, Users, TrendingUp, BookOpen, Calendar,
  AlertCircle, Award, MessageSquare, Bell, ChevronRight,
  Home, User as UserIcon, BookText, Globe, Lock, ChevronLeft,
  Mail, Phone, Building2, Edit, GraduationCap,
  Plus, Video, Coffee, Briefcase, Plane, X, Save, CheckSquare
} from 'lucide-react';

// ————————————————————————————————————————
// Profile view (re-usable component)
// ————————————————————————————————————————
const LecturerProfile: React.FC = () => {
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
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold border-4 border-white/30">
                NA
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
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{lecturerInfo.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{lecturerInfo.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    <span>{lecturerInfo.department}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Office: {lecturerInfo.office}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
                <Bell className="w-4 h-4" />
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium">
                <Edit className="w-4 h-4" />
                Edit Profile
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
      <div className="max-w-7xl mx-auto px-8 py-8">
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
// Dashboard view (re-uses your original data)
// ————————————————————————————————————————
const DashboardContent: React.FC = () => {
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

          {/* Schedule */}
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

        {/* Pending Tasks */}
        <div className="grid grid-cols-3 gap-6 mb-8">
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
// Schedule view (integrated subtab)
// ————————————————————————————————————————
const ScheduleView: React.FC = () => {
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
      <div className="bg-white border-b border-gray-200 px-8 py-6">
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

      <div className="p-8">
        <div className="space-y-6">
          {/* Calendar Section - Full Width */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
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
// Root: Sidebar + conditional content routing
// ————————————————————————————————————————
const LecturerApp: React.FC = () => {
  const [activeNav, setActiveNav] = useState('Dashboard');

  const navItems = [
    { name: 'Dashboard', icon: Home },
    { name: 'My Profile', icon: UserIcon },
    { name: 'Teaching', icon: BookText },
    { name: 'Schedule', icon: Clock },
    { name: 'Research', icon: TrendingUp },
    { name: 'Canvas/LMS', icon: Globe },
    { name: 'Messages', icon: MessageSquare },
  ];

  const renderContent = () => {
    switch (activeNav) {
      case 'Dashboard':
        return <DashboardContent />;
      case 'My Profile':
        return <LecturerProfile />;
      case 'Teaching':
        return <div className="p-8">Teaching view…</div>;
      case 'Schedule':
        return <ScheduleView />;
      case 'Research':
        return <div className="p-8">Research view…</div>;
      case 'Canvas/LMS':
        return <div className="p-8">Canvas/LMS integration…</div>;
      case 'Messages':
        return <div className="p-8">Inbox / threads…</div>;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Sidebar */}
      <aside className="w-64 bg-slate-800 text-white flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold">HSB ERP</h1>
            <div className="flex items-center gap-2">
              <button className="p-1.5 hover:bg-slate-700 rounded" aria-label="lock">
                <Lock className="w-4 h-4" />
              </button>
              <button className="p-1.5 hover:bg-slate-700 rounded" aria-label="collapse">
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Role Dropdown */}
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
              const isActive = activeNav === item.name;
              return (
                <li key={item.name}>
                  <button
                    onClick={() => setActiveNav(item.name)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
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
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {renderContent()}
      </main>
    </div>
  );
};

export default LecturerApp;
