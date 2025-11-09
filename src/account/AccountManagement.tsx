import React, { useState, useEffect, useMemo } from 'react';
import {
  Users, Shield, Award, Building, UserCheck, User, GraduationCap, BookOpen,
  CheckCircle, XCircle, AlertCircle, Search, Plus, ArrowRight, Eye, Edit,
  Save, ShieldCheck, Phone, Mail, Trash2, X, RefreshCw, Database, CloudOff
} from 'lucide-react';
import { getZohoUsers, checkBackendHealth, type ZohoUser, type GetUsersOptions } from '../zoho/zoho-api';
import { sampleUsers } from '../useraccounts';

// ========== TYPES ==========

type RoleLevel = "admin" | "rector" | "head" | "dean" | "lead_staff" | "staff" | "lecturer" | "student";

interface Role {
  id: RoleLevel;
  name: string;
  level: number;
  color: string;
  icon: React.ReactNode;
  hasDepartment: boolean;
}

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

// ========== DATA ==========

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

// ========== MAIN COMPONENT ==========

const AccountManagement: React.FC = () => {
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

  // Zoho integration states
  const [useZohoData, setUseZohoData] = useState(false);
  const [backendConnected, setBackendConnected] = useState(false);
  const [isLoadingZoho, setIsLoadingZoho] = useState(false);
  const [zohoError, setZohoError] = useState<string | null>(null);
  const [userType, setUserType] = useState<'students' | 'lecturers'>('students');

  // Check backend health on mount
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const isHealthy = await checkBackendHealth();
        setBackendConnected(isHealthy);
        console.log('[AccountManagement] Backend health check:', isHealthy ? 'Connected' : 'Disconnected');
      } catch (error) {
        console.error('[AccountManagement] Backend health check failed:', error);
        setBackendConnected(false);
      }
    };

    checkHealth();
  }, []);

  // Load Zoho data when toggled on
  useEffect(() => {
    if (useZohoData && backendConnected) {
      loadZohoUsers();
    } else if (!useZohoData) {
      // Reset to sample data
      setUsers(sampleUsers);
      setZohoError(null);
    }
  }, [useZohoData, backendConnected, userType]);

  const loadZohoUsers = async () => {
    setIsLoadingZoho(true);
    setZohoError(null);

    try {
      console.log(`[AccountManagement] Loading ${userType} from Zoho using custom function...`);

      const zohoUsers = await getZohoUsers({
        type: userType  // 'students' or 'lecturers'
      });

      console.log(`[AccountManagement] Received ${zohoUsers.length} ${userType} from Zoho`);

      // Convert Zoho users to UserAccount format
      const convertedUsers: UserAccount[] = zohoUsers.map((zu: ZohoUser) => ({
        id: zu.ID || zu.Student_Code || zu.Email || 'unknown',
        name: zu.Name || 'Unknown',
        email: zu.Email || '',
        phone: zu.Phone || '',
        role: (userType === 'lecturers' ? 'lecturer' : 'student') as RoleLevel,
        department: zu.Department || zu.Program || zu.Program_Name_English || 'N/A',
        status: mapZohoStatus(zu.Status),
        lastLogin: zu.Last_Login || 'Never',
        createdAt: zu.Created_Time || zu.Cohort_Begin || new Date().toISOString().split('T')[0],
        permissions: [],
        tabAccess: []
      }));

      setUsers(convertedUsers);
      console.log(`[AccountManagement] Successfully loaded ${convertedUsers.length} users from Zoho`);
    } catch (error) {
      console.error('[AccountManagement] Error loading Zoho users:', error);
      setZohoError(error instanceof Error ? error.message : 'Failed to load users from Zoho');
      setUseZohoData(false);
    } finally {
      setIsLoadingZoho(false);
    }
  };

  const mapZohoStatus = (status?: string): "active" | "inactive" | "suspended" => {
    if (!status) return 'active';
    const lower = status.toLowerCase();
    if (lower.includes('active')) return 'active';
    if (lower.includes('inactive') || lower.includes('alumni')) return 'inactive';
    if (lower.includes('suspend')) return 'suspended';
    return 'active';
  };

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
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Management</h1>
          <p className="text-gray-600">Manage user accounts, roles, and permissions</p>
        </div>

        {/* Zoho Integration Controls */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-200">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              {/* Backend Status */}
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${backendConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm text-gray-600">
                  Backend: {backendConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>

              {/* Data Source Toggle */}
              {backendConnected && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">Data Source:</span>
                  <button
                    onClick={() => setUseZohoData(!useZohoData)}
                    disabled={isLoadingZoho}
                    className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                      useZohoData
                        ? 'bg-blue-50 border-blue-300 text-blue-700'
                        : 'bg-gray-50 border-gray-300 text-gray-700'
                    } ${isLoadingZoho ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-100'}`}
                  >
                    <Database className="w-4 h-4 inline mr-1" />
                    {useZohoData ? 'Zoho Data' : 'Mock Data'}
                  </button>
                </div>
              )}

              {/* User Type Selector */}
              {backendConnected && useZohoData && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">Type:</span>
                  <select
                    value={userType}
                    onChange={(e) => setUserType(e.target.value as 'students' | 'lecturers')}
                    disabled={isLoadingZoho}
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="students">Students</option>
                    <option value="lecturers">Lecturers/Staff</option>
                  </select>
                </div>
              )}

              {/* Loading Indicator */}
              {isLoadingZoho && (
                <div className="flex items-center gap-2 text-blue-600">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Loading from Zoho...</span>
                </div>
              )}
            </div>

            {/* Refresh Button */}
            {backendConnected && useZohoData && !isLoadingZoho && (
              <button
                onClick={loadZohoUsers}
                className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            )}
          </div>

          {/* Error Display */}
          {zohoError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-900">Failed to load Zoho data</p>
                <p className="text-xs text-red-700 mt-1">{zohoError}</p>
              </div>
            </div>
          )}

          {/* Backend Disconnected Warning */}
          {!backendConnected && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
              <CloudOff className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-900">Backend server not connected</p>
                <p className="text-xs text-yellow-700 mt-1">
                  Make sure the backend server is running at http://localhost:3001
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        {viewMode === "list" && (
          <div className="bg-white rounded-lg shadow-sm">
            {/* Search and Filters */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex flex-wrap gap-4">
                {/* Search */}
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Role Filter */}
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value as RoleLevel | "all")}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Roles</option>
                  {roleHierarchy.map(role => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>

                {/* Status Filter */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>

                {/* Add User Button */}
                <button
                  onClick={() => setViewMode("create")}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add User
                </button>
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Login
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => {
                    const roleInfo = getRoleInfo(user.role);
                    return (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div style={{ color: roleInfo?.color }}>{roleInfo?.icon}</div>
                            <span className="text-sm text-gray-900">{roleInfo?.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.department}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                            {getStatusIcon(user.status)}
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.lastLogin}
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

              {/* Empty State */}
              {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchTerm || filterRole !== "all" || filterStatus !== "all"
                      ? "Try adjusting your search or filters."
                      : "Get started by creating a new user."}
                  </p>
                </div>
              )}
            </div>

            {/* Results Count */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{filteredUsers.length}</span> of{" "}
                <span className="font-medium">{users.length}</span> users
              </p>
            </div>
          </div>
        )}

        {/* Detail View */}
        {viewMode === "detail" && selectedUser && (
          <div className="bg-white rounded-lg shadow-sm">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setViewMode("list")}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <ArrowRight className="w-5 h-5 rotate-180" />
                </button>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedUser.name}</h2>
                  <p className="text-sm text-gray-500">{selectedUser.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSavePermissions}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <div className="flex gap-8 px-6">
                {["info", "permissions", "tabs", "activity"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as typeof activeTab)}
                    className={`py-4 border-b-2 transition-colors capitalize ${
                      activeTab === tab
                        ? "border-blue-600 text-blue-600 font-medium"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === "info" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <div className="text-gray-900">{selectedUser.name}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <div className="flex items-center gap-2 text-gray-900">
                        <Mail className="w-4 h-4 text-gray-400" />
                        {selectedUser.email}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <div className="flex items-center gap-2 text-gray-900">
                        <Phone className="w-4 h-4 text-gray-400" />
                        {selectedUser.phone}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                      <div className="flex items-center gap-2">
                        {getRoleInfo(selectedUser.role)?.icon}
                        <span>{getRoleInfo(selectedUser.role)?.name}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                      <div className="text-gray-900">{selectedUser.department}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedUser.status)}`}>
                        {getStatusIcon(selectedUser.status)}
                        {selectedUser.status}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Login</label>
                      <div className="text-gray-900">{selectedUser.lastLogin}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Created At</label>
                      <div className="text-gray-900">{selectedUser.createdAt}</div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "permissions" && (
                <div className="space-y-6">
                  {Object.entries(groupedPermissions).map(([category, perms]) => (
                    <div key={category}>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">{category}</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {perms.map((perm) => (
                          <label
                            key={perm.id}
                            className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                              editingPermissions.includes(perm.id)
                                ? "border-blue-300 bg-blue-50"
                                : "border-gray-200 hover:border-gray-300"
                            } ${!isEditing ? "opacity-50 cursor-not-allowed" : ""}`}
                          >
                            <input
                              type="checkbox"
                              checked={editingPermissions.includes(perm.id)}
                              onChange={() => isEditing && togglePermission(perm.id)}
                              disabled={!isEditing}
                              className="mt-0.5"
                            />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{perm.name}</div>
                              <div className="text-xs text-gray-500">{perm.description}</div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "tabs" && (
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Tab</th>
                          <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">View</th>
                          <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">Edit</th>
                          <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">Delete</th>
                          <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">Export</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {editingTabAccess.map((tab) => (
                          <tr key={tab.tabId}>
                            <td className="px-4 py-3 text-sm text-gray-900">{tab.tabName}</td>
                            <td className="px-4 py-3 text-center">
                              <input
                                type="checkbox"
                                checked={tab.canView}
                                onChange={(e) => isEditing && updateTabAccess(tab.tabId, 'canView', e.target.checked)}
                                disabled={!isEditing}
                              />
                            </td>
                            <td className="px-4 py-3 text-center">
                              <input
                                type="checkbox"
                                checked={tab.canEdit}
                                onChange={(e) => isEditing && updateTabAccess(tab.tabId, 'canEdit', e.target.checked)}
                                disabled={!isEditing}
                              />
                            </td>
                            <td className="px-4 py-3 text-center">
                              <input
                                type="checkbox"
                                checked={tab.canDelete}
                                onChange={(e) => isEditing && updateTabAccess(tab.tabId, 'canDelete', e.target.checked)}
                                disabled={!isEditing}
                              />
                            </td>
                            <td className="px-4 py-3 text-center">
                              <input
                                type="checkbox"
                                checked={tab.canExport}
                                onChange={(e) => isEditing && updateTabAccess(tab.tabId, 'canExport', e.target.checked)}
                                disabled={!isEditing}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === "activity" && (
                <div className="text-center py-12 text-gray-500">
                  Activity log coming soon...
                </div>
              )}
            </div>
          </div>
        )}

        {/* Create View */}
        {viewMode === "create" && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => setViewMode("list")}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowRight className="w-5 h-5 rotate-180" />
              </button>
              <h2 className="text-xl font-bold text-gray-900">Create New User</h2>
            </div>
            <div className="text-center py-12 text-gray-500">
              User creation form coming soon...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountManagement;
