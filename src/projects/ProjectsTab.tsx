// src/projects/ProjectsTab.tsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus, Search, X, Folder, FolderOpen, Calendar, Users, Building,
  CheckCircle, Clock, Eye, FileText, List, Kanban as KanbanIcon,
  BarChart2, Trash2, ExternalLink, Edit2
} from 'lucide-react';
import {
  projectManagementService,
  UserProject,
  ProjectTask,
  KanbanColumn,
  ProjectType,
  ProjectStatus,
  ProjectPriority,
  ProjectMember,
  TaskComment,
  TaskLink
} from './projectManagement.service';

type ViewMode = 'kanban' | 'gantt';

interface ProjectsTabProps {
  userId: string;
  userName: string;
}

const ProjectsTab: React.FC<ProjectsTabProps> = ({ userId, userName }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [selectedProject, setSelectedProject] = useState<UserProject | null>(null);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [showEditProjectModal, setShowEditProjectModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showTaskDetailModal, setShowTaskDetailModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<ProjectTask | null>(null);
  const [taskColumnId, setTaskColumnId] = useState<string>('');
  const [draggedTask, setDraggedTask] = useState<ProjectTask | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | ProjectType>('all');
  const [showNewColumnInput, setShowNewColumnInput] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');

  const [projects, setProjects] = useState<UserProject[]>([]);
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [columns, setColumns] = useState<KanbanColumn[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state for new project
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    type: 'personal' as ProjectType,
    department: '',
    startDate: '',
    endDate: '',
    priority: 'medium' as ProjectPriority,
    status: 'planning' as ProjectStatus
  });

  // Form state for new task
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: ''
  });

  // Form state for editing project
  const [editProject, setEditProject] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: ''
  });

  // Form state for adding member
  const [newMember, setNewMember] = useState({
    studentId: '',
    name: '',
    role: 'member' as 'owner' | 'member' | 'viewer'
  });

  // Form state for task details
  const [editingDescription, setEditingDescription] = useState(false);
  const [taskDescription, setTaskDescription] = useState('');
  const [newComment, setNewComment] = useState('');
  const [newLink, setNewLink] = useState({ url: '', title: '' });

  // Load projects
  useEffect(() => {
    setLoading(true);
    const unsubscribe = projectManagementService.subscribeToProjects((projectsData) => {
      setProjects(projectsData);
      setLoading(false);
    }, userId);

    return () => unsubscribe();
  }, [userId]);

  // Load tasks and columns when project is selected
  useEffect(() => {
    if (!selectedProject?.id) {
      setTasks([]);
      setColumns([]);
      return;
    }

    const unsubTasks = projectManagementService.subscribeToProjectTasks(
      selectedProject.id,
      setTasks
    );

    const unsubColumns = projectManagementService.subscribeToProjectColumns(
      selectedProject.id,
      setColumns
    );

    return () => {
      unsubTasks();
      unsubColumns();
    };
  }, [selectedProject?.id]);

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      if (activeFilter === 'all') return true;
      return project.type === activeFilter;
    });
  }, [projects, activeFilter]);

  const getTasksByColumn = (columnId: string) => {
    if (!selectedProject) return [];
    return tasks.filter(task => task.column === columnId && task.projectId === selectedProject.id);
  };

  const handleDragStart = (task: ProjectTask) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (columnId: string) => {
    if (draggedTask && draggedTask.id) {
      await projectManagementService.moveTask(draggedTask.id, columnId);
      setDraggedTask(null);
    }
  };

  const handleAddColumn = async () => {
    if (newColumnName.trim() && selectedProject?.id) {
      await projectManagementService.createColumn({
        projectId: selectedProject.id,
        title: newColumnName.trim(),
        order: columns.length,
        isDefault: false
      });
      setNewColumnName('');
      setShowNewColumnInput(false);
    }
  };

  const handleDeleteColumn = async (columnId: string) => {
    if (!selectedProject?.id) return;

    const column = columns.find(c => c.id === columnId);
    if (column?.isDefault) {
      alert('Cannot delete default columns');
      return;
    }

    if (window.confirm('Delete this column? Tasks will be moved to "To Do".')) {
      await projectManagementService.deleteColumn(columnId, selectedProject.id);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await projectManagementService.createProject({
        ...newProject,
        ownerId: userId,
        ownerName: userName,
        members: [],
        progress: 0,
        startDate: new Date(newProject.startDate),
        endDate: new Date(newProject.endDate)
      });

      setShowNewProjectModal(false);
      setNewProject({
        title: '',
        description: '',
        type: 'personal',
        department: '',
        startDate: '',
        endDate: '',
        priority: 'medium',
        status: 'planning'
      });
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project');
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProject?.id || !taskColumnId) {
      alert('Please select a project and column');
      return;
    }

    try {
      await projectManagementService.createTask({
        title: newTask.title,
        description: newTask.description,
        projectId: selectedProject.id,
        column: taskColumnId,
        labels: [],
        startDate: new Date(newTask.startDate),
        endDate: new Date(newTask.endDate),
        completed: false,
        createdById: userId,
        createdByName: userName
      });

      setShowNewTaskModal(false);
      setNewTask({
        title: '',
        description: '',
        startDate: '',
        endDate: ''
      });
      setTaskColumnId('');
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Failed to create task');
    }
  };

  const handleDeleteProject = async () => {
    if (!selectedProject?.id) return;

    try {
      await projectManagementService.deleteProject(selectedProject.id);
      setShowDeleteConfirmModal(false);
      setSelectedProject(null);
      alert('Project deleted successfully');
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project');
    }
  };

  const handleOpenEditModal = (project: UserProject) => {
    setEditProject({
      title: project.title,
      description: project.description,
      startDate: project.startDate.toISOString().split('T')[0],
      endDate: project.endDate.toISOString().split('T')[0]
    });
    setShowEditProjectModal(true);
  };

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProject?.id) return;

    try {
      await projectManagementService.updateProject(selectedProject.id, {
        title: editProject.title,
        description: editProject.description,
        startDate: new Date(editProject.startDate),
        endDate: new Date(editProject.endDate)
      });

      setShowEditProjectModal(false);
      alert('Project updated successfully');
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Failed to update project');
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProject?.id) return;

    try {
      const colors = ['blue', 'green', 'purple', 'red', 'pink', 'orange'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const initials = newMember.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);

      const member: ProjectMember = {
        userId: newMember.studentId,
        name: newMember.name,
        email: `${newMember.studentId}@student.edu`,
        role: newMember.role,
        initials: initials,
        color: randomColor,
        addedAt: new Date()
      };

      const updatedMembers = [...(selectedProject.members || []), member];

      await projectManagementService.updateProject(selectedProject.id, {
        members: updatedMembers
      });

      setShowAddMemberModal(false);
      setNewMember({ studentId: '', name: '', role: 'member' });
      alert('Team member added successfully');
    } catch (error) {
      console.error('Error adding member:', error);
      alert('Failed to add team member');
    }
  };

  const createGoogleCalendarLink = (project: UserProject) => {
    const title = encodeURIComponent(project.title);
    const details = encodeURIComponent(project.description);

    // Convert dates to Google Calendar format: YYYYMMDDTHHmmssZ
    const formatDateForGoogle = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const startDate = formatDateForGoogle(new Date(project.startDate));
    const endDate = formatDateForGoogle(new Date(project.endDate));

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${details}`;
  };

  // Gantt Chart Helpers
  const getDatePosition = (date: Date, minDate: Date, maxDate: Date) => {
    const totalDays = (maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24);
    const daysPassed = (date.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24);
    return (daysPassed / totalDays) * 100;
  };

  const getDuration = (startDate: Date, endDate: Date, minDate: Date, maxDate: Date) => {
    const totalDays = (maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24);
    const projectDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    return (projectDays / totalDays) * 100;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getDateRange = () => {
    const allDates = filteredProjects.flatMap(p => [p.startDate, p.endDate]);
    const minDate = new Date(Math.min(...allDates.map(d => d.getTime())));
    const maxDate = new Date(Math.max(...allDates.map(d => d.getTime())));

    minDate.setDate(minDate.getDate() - 7);
    maxDate.setDate(maxDate.getDate() + 7);

    return { minDate, maxDate };
  };

  const generateMonthMarkers = (minDate: Date, maxDate: Date) => {
    const markers = [];
    const current = new Date(minDate);
    current.setDate(1);

    while (current <= maxDate) {
      const position = getDatePosition(current, minDate, maxDate);
      markers.push({
        position,
        label: current.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      });
      current.setMonth(current.getMonth() + 1);
    }

    return markers;
  };

  // ========== COMPONENTS ==========

  const handleCompleteTask = async (task: ProjectTask) => {
    // Find the "Completed" column
    const completedColumn = columns.find(col => col.title === 'Completed');
    if (completedColumn?.id && task.id) {
      await projectManagementService.moveTask(task.id, completedColumn.id);
    }
  };

  const handleOpenTaskDetail = (task: ProjectTask) => {
    setSelectedTask(task);
    setTaskDescription(task.description || '');
    setEditingDescription(false);
    setShowTaskDetailModal(true);
  };

  const handleAssignMember = async (taskId: string, member: ProjectMember | null) => {
    try {
      await projectManagementService.updateTask(taskId, {
        assigneeId: member?.userId || undefined,
        assigneeName: member?.name || undefined,
        assigneeInitials: member?.initials || undefined,
        assigneeColor: member?.color || undefined
      });
    } catch (error) {
      console.error('Error assigning member:', error);
      alert('Failed to assign member');
    }
  };

  const handleUpdateDescription = async () => {
    if (!selectedTask?.id) return;

    try {
      await projectManagementService.updateTask(selectedTask.id, {
        description: taskDescription
      });
      setEditingDescription(false);
      // Update local state
      setSelectedTask({ ...selectedTask, description: taskDescription });
    } catch (error) {
      console.error('Error updating description:', error);
      alert('Failed to update description');
    }
  };

  const handleAddComment = async () => {
    if (!selectedTask?.id || !newComment.trim()) return;

    try {
      const comment: TaskComment = {
        id: Date.now().toString(),
        text: newComment.trim(),
        authorId: userId,
        authorName: userName,
        createdAt: new Date()
      };

      const updatedComments = [...(selectedTask.comments || []), comment];

      await projectManagementService.updateTask(selectedTask.id, {
        comments: updatedComments
      });

      setNewComment('');
      // Update local state
      setSelectedTask({ ...selectedTask, comments: updatedComments });
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment');
    }
  };

  const handleAddLink = async () => {
    if (!selectedTask?.id || !newLink.url.trim()) return;

    try {
      const link: TaskLink = {
        id: Date.now().toString(),
        url: newLink.url.trim(),
        title: newLink.title.trim() || newLink.url.trim(),
        addedBy: userName,
        addedAt: new Date()
      };

      const updatedLinks = [...(selectedTask.links || []), link];

      await projectManagementService.updateTask(selectedTask.id, {
        links: updatedLinks
      });

      setNewLink({ url: '', title: '' });
      // Update local state
      setSelectedTask({ ...selectedTask, links: updatedLinks });
    } catch (error) {
      console.error('Error adding link:', error);
      alert('Failed to add link');
    }
  };

  const TaskCard: React.FC<{ task: ProjectTask }> = ({ task }) => {
    const isCompleted = columns.find(col => col.id === task.column)?.title === 'Completed';

    return (
      <div
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 mb-2 cursor-move hover:shadow-md transition-shadow"
        draggable
        onDragStart={() => handleDragStart(task)}
        onClick={(e) => {
          // Only open detail if not dragging
          if (!(e.target as HTMLElement).closest('button')) {
            handleOpenTaskDetail(task);
          }
        }}
      >
        <div className="font-medium text-gray-900 text-sm mb-2">{task.title}</div>
        {task.description && (
          <p className="text-xs text-gray-600 mb-2">{task.description}</p>
        )}
        <div className="flex flex-wrap gap-1 mb-2">
          {task.labels.map((label, index) => (
            <span
              key={index}
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                label.type === 'bug' ? 'bg-red-100 text-red-700' :
                label.type === 'feature' ? 'bg-blue-100 text-blue-700' :
                label.type === 'urgent' ? 'bg-orange-100 text-orange-700' :
                label.type === 'devops' ? 'bg-purple-100 text-purple-700' :
                label.type === 'documentation' ? 'bg-yellow-100 text-yellow-700' :
                label.type === 'design' ? 'bg-pink-100 text-pink-700' :
                label.type === 'backend' ? 'bg-green-100 text-green-700' :
                label.type === 'performance' ? 'bg-indigo-100 text-indigo-700' :
                label.type === 'setup' ? 'bg-gray-100 text-gray-700' :
                'bg-cyan-100 text-cyan-700'
              }`}
            >
              {label.text}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between mb-2">
          {task.assigneeName && (
            <div className="flex items-center">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold text-white ${
                task.assigneeColor === 'blue' ? 'bg-blue-500' :
                task.assigneeColor === 'green' ? 'bg-green-500' :
                task.assigneeColor === 'purple' ? 'bg-purple-500' :
                task.assigneeColor === 'red' ? 'bg-red-500' :
                task.assigneeColor === 'pink' ? 'bg-pink-500' :
                task.assigneeColor === 'orange' ? 'bg-orange-500' :
                'bg-gray-500'
              }`}>
                {task.assigneeInitials}
              </div>
            </div>
          )}
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <Calendar size={12} />
            {formatDate(task.endDate)}
          </span>
        </div>
        {!isCompleted && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCompleteTask(task);
            }}
            className="w-full mt-2 flex items-center justify-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-xs font-medium transition-colors"
          >
            <CheckCircle size={14} />
            <span>Mark Complete</span>
          </button>
        )}
      </div>
    );
  };

  const KanbanColumnComponent: React.FC<{
    column: KanbanColumn;
    tasks: ProjectTask[];
  }> = ({ column, tasks }) => {
    const Icon = column.title === 'To Do' ? FileText :
                column.title === 'Progress' ? Clock :
                column.title === 'Review' ? Eye :
                column.title === 'Done' ? CheckCircle : List;

    return (
      <div
        className="bg-gray-50 rounded-lg p-3 min-w-[280px] flex-shrink-0"
        onDragOver={handleDragOver}
        onDrop={() => handleDrop(column.id!)}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Icon size={16} className="text-gray-600" />
            <span className="font-semibold text-gray-900">{column.title}</span>
            <span className="bg-gray-200 text-gray-700 text-xs font-medium px-2 py-0.5 rounded-full">
              {tasks.length}
            </span>
          </div>
          {!column.isDefault && (
            <button
              onClick={() => handleDeleteColumn(column.id!)}
              className="text-gray-400 hover:text-red-500 transition-colors"
              title="Delete column"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto">
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
        <button
          onClick={() => {
            setTaskColumnId(column.id!);
            setShowNewTaskModal(true);
          }}
          className="w-full mt-2 flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg px-3 py-2 transition-colors"
        >
          <Plus size={16} />
          <span className="text-sm">Add Task</span>
        </button>
      </div>
    );
  };

  const KanbanView: React.FC = () => {
    if (!selectedProject) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
          <Folder size={64} className="text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Select a project to view tasks</h3>
          <p className="text-gray-500">Choose a project from the list to see its Kanban board</p>
        </div>
      );
    }

    // Filter columns to ensure they belong to the selected project (extra safeguard)
    const projectColumns = columns.filter(col => col.projectId === selectedProject.id);

    return (
      <div className="h-full flex flex-col p-4">
        {projectColumns.length === 0 ? (
          showNewColumnInput ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="bg-white border-2 border-gray-200 rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Your First List</h3>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                  placeholder="Enter list name (e.g., To Do, Progress, Completed)..."
                  value={newColumnName}
                  onChange={(e) => setNewColumnName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddColumn();
                    if (e.key === 'Escape') {
                      setShowNewColumnInput(false);
                      setNewColumnName('');
                    }
                  }}
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleAddColumn}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create List
                  </button>
                  <button
                    onClick={() => {
                      setShowNewColumnInput(false);
                      setNewColumnName('');
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <List size={64} className="text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No lists yet</h3>
              <p className="text-gray-500 mb-6">Create your first list to start organizing tasks</p>
              <button
                onClick={() => setShowNewColumnInput(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={16} />
                <span>Create First List</span>
              </button>
            </div>
          )
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-4 h-full">
            {projectColumns.sort((a, b) => a.order - b.order).map(column => (
              <KanbanColumnComponent
                key={column.id}
                column={column}
                tasks={getTasksByColumn(column.id!)}
              />
            ))}

            {showNewColumnInput ? (
              <div className="bg-gray-50 rounded-lg p-3 min-w-[280px] flex-shrink-0">
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                  placeholder="Enter list name..."
                  value={newColumnName}
                  onChange={(e) => setNewColumnName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddColumn();
                    if (e.key === 'Escape') {
                      setShowNewColumnInput(false);
                      setNewColumnName('');
                    }
                  }}
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleAddColumn}
                    className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add list
                  </button>
                  <button
                    onClick={() => {
                      setShowNewColumnInput(false);
                      setNewColumnName('');
                    }}
                    className="p-1.5 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowNewColumnInput(true)}
                className="bg-gray-100 hover:bg-gray-200 rounded-lg p-3 min-w-[280px] flex-shrink-0 flex items-center gap-2 text-gray-700 transition-colors"
              >
                <Plus size={16} />
                <span className="font-medium">Add another list</span>
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  const GanttView: React.FC = () => {
    if (filteredProjects.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
          <BarChart2 size={64} className="text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No projects to display</h3>
          <p className="text-gray-500">Create a project to see the Gantt timeline</p>
        </div>
      );
    }

    const { minDate, maxDate } = getDateRange();
    const monthMarkers = generateMonthMarkers(minDate, maxDate);

    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Gantt Header */}
        <div className="grid grid-cols-[300px_1fr] border-b border-gray-200">
          <div className="bg-gray-50 p-4 font-semibold text-gray-700 border-r border-gray-200">
            Project
          </div>
          <div className="bg-gray-50 p-4 relative">
            <div className="flex">
              {monthMarkers.map((marker, index) => (
                <div
                  key={index}
                  className="absolute text-xs font-medium text-gray-600"
                  style={{ left: `${marker.position}%` }}
                >
                  {marker.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Gantt Body */}
        <div className="max-h-[calc(100vh-250px)] overflow-y-auto">
          {filteredProjects.map((project) => {
            const startPos = getDatePosition(project.startDate, minDate, maxDate);
            const width = getDuration(project.startDate, project.endDate, minDate, maxDate);

            return (
              <div
                key={project.id}
                className={`grid grid-cols-[300px_1fr] border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                  selectedProject?.id === project.id ? 'bg-blue-50' : ''
                }`}
                onClick={() => setSelectedProject(project)}
              >
                {/* Project Info */}
                <div className="p-4 border-r border-gray-200">
                  <div className="font-semibold text-gray-900 mb-1">{project.title}</div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className={`px-2 py-0.5 rounded-full font-medium ${
                      project.type === 'personal' ? 'bg-gray-100 text-gray-700' :
                      project.type === 'student' ? 'bg-blue-100 text-blue-700' :
                      project.type === 'staff' ? 'bg-green-100 text-green-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {project.type === 'personal' ? 'P' :
                       project.type === 'student' ? 'S' :
                       project.type === 'staff' ? 'F' : 'M'}
                    </span>
                    {project.department && (
                      <span className="text-gray-600">{project.department}</span>
                    )}
                  </div>
                </div>

                {/* Timeline */}
                <div className="p-4 relative">
                  {/* Grid lines */}
                  <div className="absolute inset-0 flex">
                    {monthMarkers.map((_, index) => (
                      <div
                        key={index}
                        className="flex-1 border-r border-gray-100 last:border-r-0"
                      />
                    ))}
                  </div>

                  {/* Gantt Bar */}
                  <div
                    className={`absolute h-8 rounded-lg flex items-center justify-between px-2 ${
                      project.priority === 'high' ? 'bg-red-500' :
                      project.priority === 'medium' ? 'bg-blue-500' :
                      'bg-green-500'
                    }`}
                    style={{
                      left: `${startPos}%`,
                      width: `${width}%`,
                      top: '50%',
                      transform: 'translateY(-50%)'
                    }}
                  >
                    {/* Progress */}
                    <div
                      className="absolute inset-0 bg-white/30 rounded-lg"
                      style={{ width: `${project.progress}%` }}
                    />

                    <span className="relative z-10 text-xs font-semibold text-white">
                      {project.progress}%
                    </span>

                    <div className="relative z-10 flex -space-x-1">
                      {project.members.slice(0, 3).map((member, idx) => (
                        <div
                          key={idx}
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold text-white ring-2 ring-white ${
                            member.color === 'blue' ? 'bg-blue-600' :
                            member.color === 'green' ? 'bg-green-600' :
                            member.color === 'purple' ? 'bg-purple-600' :
                            member.color === 'red' ? 'bg-red-600' :
                            member.color === 'pink' ? 'bg-pink-600' :
                            member.color === 'orange' ? 'bg-orange-600' :
                            'bg-gray-600'
                          }`}
                        >
                          {member.initials}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="absolute -bottom-1 left-0 right-0 flex justify-between text-[10px] text-gray-500">
                    <span style={{ left: `${startPos}%`, position: 'absolute' }}>
                      {formatDate(project.startDate)}
                    </span>
                    <span style={{ left: `${startPos + width}%`, position: 'absolute', transform: 'translateX(-100%)' }}>
                      {formatDate(project.endDate)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render modal (removed nested component to fix focus issue)
  const renderNewProjectModal = () => (
    <div
      className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity ${
        showNewProjectModal ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={() => setShowNewProjectModal(false)}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Create New Project</h2>
          <button
            onClick={() => setShowNewProjectModal(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleCreateProject} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter project name"
                value={newProject.title}
                onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                placeholder="Describe your project"
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Type
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newProject.type}
                  onChange={(e) => setNewProject({ ...newProject, type: e.target.value as ProjectType })}
                  required
                >
                  <option value="personal">Personal Project</option>
                  <option value="student">Student Project</option>
                  <option value="staff">Staff Project</option>
                  <option value="mixed">Mixed Project</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Department (optional)"
                  value={newProject.department}
                  onChange={(e) => setNewProject({ ...newProject, department: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newProject.startDate}
                  onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newProject.endDate}
                  onChange={(e) => setNewProject({ ...newProject, endDate: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newProject.priority}
                  onChange={(e) => setNewProject({ ...newProject, priority: e.target.value as ProjectPriority })}
                  required
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newProject.status}
                  onChange={(e) => setNewProject({ ...newProject, status: e.target.value as ProjectStatus })}
                  required
                >
                  <option value="planning">Planning</option>
                  <option value="active">Active</option>
                  <option value="on-hold">On Hold</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => setShowNewProjectModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus size={16} />
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Render task modal
  const renderNewTaskModal = () => (
    <div
      className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity ${
        showNewTaskModal ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={() => setShowNewTaskModal(false)}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Add New Task</h2>
          <button
            onClick={() => setShowNewTaskModal(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleCreateTask} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Task Title
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter task title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none"
                placeholder="Task description (optional)"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newTask.startDate}
                  onChange={(e) => setNewTask({ ...newTask, startDate: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newTask.endDate}
                  onChange={(e) => setNewTask({ ...newTask, endDate: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => setShowNewTaskModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus size={16} />
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderDeleteConfirmModal = () => (
    <div
      className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity ${
        showDeleteConfirmModal ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={() => setShowDeleteConfirmModal(false)}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 bg-red-100 rounded-lg">
            <Trash2 size={24} className="text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Delete Project</h3>
            <p className="text-gray-600 text-sm">
              Are you sure you want to delete "{selectedProject?.title}"? This action cannot be undone.
              All tasks and columns associated with this project will also be deleted.
            </p>
          </div>
        </div>
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={() => setShowDeleteConfirmModal(false)}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDeleteProject}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete Project
          </button>
        </div>
      </div>
    </div>
  );

  const renderEditProjectModal = () => (
    <div
      className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity ${
        showEditProjectModal ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={() => setShowEditProjectModal(false)}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleUpdateProject}>
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Edit2 size={20} className="text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Edit Project</h2>
            </div>
          </div>

          <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Title *
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter project title"
                value={editProject.title}
                onChange={(e) => setEditProject({ ...editProject, title: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={4}
                placeholder="Enter project description"
                value={editProject.description}
                onChange={(e) => setEditProject({ ...editProject, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date *
                </label>
                <input
                  type="date"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={editProject.startDate}
                  onChange={(e) => setEditProject({ ...editProject, startDate: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date *
                </label>
                <input
                  type="date"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={editProject.endDate}
                  onChange={(e) => setEditProject({ ...editProject, endDate: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => setShowEditProjectModal(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderAddMemberModal = () => (
    <div
      className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity ${
        showAddMemberModal ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={() => setShowAddMemberModal(false)}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleAddMember}>
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users size={20} className="text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Add Team Member</h2>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Student ID *
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter student ID (e.g., 20210001)"
                value={newMember.studentId}
                onChange={(e) => setNewMember({ ...newMember, studentId: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter full name"
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role *
              </label>
              <select
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newMember.role}
                onChange={(e) => setNewMember({ ...newMember, role: e.target.value as 'owner' | 'member' | 'viewer' })}
              >
                <option value="member">Member - Can edit tasks</option>
                <option value="viewer">Viewer - Can only view</option>
                <option value="owner">Owner - Full access</option>
              </select>
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => {
                setShowAddMemberModal(false);
                setNewMember({ studentId: '', name: '', role: 'member' });
              }}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderTaskDetailModal = () => {
    if (!selectedTask) return null;

    const taskColumn = columns.find(col => col.id === selectedTask.column);
    const allMembers = selectedProject?.members || [];
    const ownerMember: ProjectMember = {
      userId: selectedProject?.ownerId || '',
      name: selectedProject?.ownerName || '',
      email: '',
      role: 'owner',
      initials: selectedProject?.ownerName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'OW',
      color: 'blue',
      addedAt: new Date()
    };
    const allTeamMembers = [ownerMember, ...allMembers];

    return (
      <div
        className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity ${
          showTaskDetailModal ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setShowTaskDetailModal(false)}
      >
        <div
          className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedTask.title}</h2>
                <div className="flex items-center gap-2 text-sm">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    taskColumn?.title === 'Completed' ? 'bg-green-100 text-green-700' :
                    taskColumn?.title === 'Progress' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {taskColumn?.title || 'Unknown'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowTaskDetailModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Description */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-700">Description</h3>
                {!editingDescription ? (
                  <button
                    onClick={() => setEditingDescription(true)}
                    className="text-blue-600 hover:text-blue-700 text-xs flex items-center gap-1"
                  >
                    <Edit2 size={12} />
                    <span>Edit</span>
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleUpdateDescription}
                      className="text-green-600 hover:text-green-700 text-xs font-medium"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingDescription(false);
                        setTaskDescription(selectedTask.description || '');
                      }}
                      className="text-gray-600 hover:text-gray-700 text-xs font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
              {editingDescription ? (
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={4}
                  placeholder="Enter task description..."
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                />
              ) : (
                <p className="text-gray-600 whitespace-pre-wrap">
                  {selectedTask.description || 'No description provided'}
                </p>
              )}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Start Date</h3>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar size={16} />
                  <span>{formatDate(selectedTask.startDate)}</span>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">End Date</h3>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar size={16} />
                  <span>{formatDate(selectedTask.endDate)}</span>
                </div>
              </div>
            </div>

            {/* Assign Member */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Assigned To</h3>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedTask.assigneeId || ''}
                onChange={(e) => {
                  const memberId = e.target.value;
                  const member = memberId ? allTeamMembers.find(m => m.userId === memberId) : null;
                  if (selectedTask.id) {
                    handleAssignMember(selectedTask.id, member || null);
                  }
                }}
              >
                <option value="">Unassigned</option>
                {allTeamMembers.map(member => (
                  <option key={member.userId} value={member.userId}>
                    {member.name} ({member.role})
                  </option>
                ))}
              </select>
              {selectedTask.assigneeName && (
                <div className="mt-2 flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white ${
                    selectedTask.assigneeColor === 'blue' ? 'bg-blue-500' :
                    selectedTask.assigneeColor === 'green' ? 'bg-green-500' :
                    selectedTask.assigneeColor === 'purple' ? 'bg-purple-500' :
                    selectedTask.assigneeColor === 'red' ? 'bg-red-500' :
                    selectedTask.assigneeColor === 'pink' ? 'bg-pink-500' :
                    selectedTask.assigneeColor === 'orange' ? 'bg-orange-500' :
                    'bg-gray-500'
                  }`}>
                    {selectedTask.assigneeInitials}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{selectedTask.assigneeName}</div>
                    <div className="text-xs text-gray-500">Assigned</div>
                  </div>
                </div>
              )}
            </div>

            {/* Created By */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Created By</h3>
              <p className="text-gray-600">{selectedTask.createdByName}</p>
              {selectedTask.createdAt && (
                <p className="text-xs text-gray-500 mt-1">
                  {selectedTask.createdAt.toLocaleDateString()} at {selectedTask.createdAt.toLocaleTimeString()}
                </p>
              )}
            </div>

            {/* Links */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Links</h3>
              {selectedTask.links && selectedTask.links.length > 0 ? (
                <div className="space-y-2 mb-3">
                  {selectedTask.links.map((link) => (
                    <div key={link.id} className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg">
                      <ExternalLink size={14} className="text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium break-all"
                        >
                          {link.title}
                        </a>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Added by {link.addedBy}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm mb-3">No links added yet</p>
              )}
              <div className="space-y-2">
                <input
                  type="url"
                  placeholder="Enter URL (https://...)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newLink.url}
                  onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Link title (optional)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newLink.title}
                  onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                />
                <button
                  onClick={handleAddLink}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-sm font-medium transition-colors"
                >
                  <Plus size={16} />
                  <span>Add Link</span>
                </button>
              </div>
            </div>

            {/* Comments */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Comments</h3>
              {selectedTask.comments && selectedTask.comments.length > 0 ? (
                <div className="space-y-3 mb-3 max-h-64 overflow-y-auto">
                  {selectedTask.comments.map((comment) => (
                    <div key={comment.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between mb-1">
                        <span className="font-medium text-gray-900 text-sm">{comment.authorName}</span>
                        <span className="text-xs text-gray-500">
                          {comment.createdAt.toLocaleDateString()} {comment.createdAt.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm whitespace-pre-wrap">{comment.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm mb-3">No comments yet</p>
              )}
              <div className="space-y-2">
                <textarea
                  placeholder="Add a comment..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <button
                  onClick={handleAddComment}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-sm font-medium transition-colors"
                >
                  <Plus size={16} />
                  <span>Add Comment</span>
                </button>
              </div>
            </div>

            {/* Labels */}
            {selectedTask.labels && selectedTask.labels.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Labels</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedTask.labels.map((label, index) => (
                    <span
                      key={index}
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        label.type === 'bug' ? 'bg-red-100 text-red-700' :
                        label.type === 'feature' ? 'bg-blue-100 text-blue-700' :
                        label.type === 'urgent' ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {label.text}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
            {taskColumn?.title !== 'Completed' && (
              <button
                onClick={() => {
                  handleCompleteTask(selectedTask);
                  setShowTaskDetailModal(false);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <CheckCircle size={16} />
                <span>Mark Complete</span>
              </button>
            )}
            <button
              onClick={() => setShowTaskDetailModal(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6 flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Projects</h1>

            {/* View Switcher */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('kanban')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                  viewMode === 'kanban'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <KanbanIcon size={18} />
                Kanban
              </button>
              <button
                onClick={() => setViewMode('gantt')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                  viewMode === 'gantt'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <BarChart2 size={18} />
                Gantt
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mx-6">
            {(['all', 'personal', 'student', 'staff', 'mixed'] as const).map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeFilter === filter
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {filter === 'all' ? 'All' :
                 filter === 'personal' ? 'Personal' :
                 filter === 'student' ? 'Student' :
                 filter === 'staff' ? 'Staff' : 'Mixed'}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <Search size={16} />
              Search
            </button>
            <button
              onClick={() => setShowNewProjectModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} />
              New Project
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Projects List Sidebar */}
        <div className="w-56 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <FolderOpen size={16} />
              Projects ({filteredProjects.length})
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {loading ? (
              <div className="text-center text-gray-500 py-8">Loading...</div>
            ) : filteredProjects.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p>No projects found</p>
                <button
                  onClick={() => setShowNewProjectModal(true)}
                  className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                >
                  Create your first project
                </button>
              </div>
            ) : (
              filteredProjects.map(project => (
                <div
                  key={project.id}
                  className={`p-3 rounded-lg mb-2 transition-colors ${
                    selectedProject?.id === project.id
                      ? 'bg-blue-50 border-2 border-blue-500'
                      : 'bg-white border-2 border-transparent hover:bg-gray-50 hover:border-gray-200'
                  }`}
                >
                  <div
                    onClick={() => setSelectedProject(project)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div className="font-medium text-gray-900 text-sm flex-1 flex items-center gap-1">
                        <span>{project.title}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProject(project);
                            handleOpenEditModal(project);
                          }}
                          className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Edit Project"
                        >
                          <Edit2 size={12} />
                        </button>
                      </div>
                      <div className="flex gap-1">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                          project.type === 'personal' ? 'bg-gray-100 text-gray-700' :
                          project.type === 'student' ? 'bg-blue-100 text-blue-700' :
                          project.type === 'staff' ? 'bg-green-100 text-green-700' :
                          'bg-purple-100 text-purple-700'
                        }`}>
                          {project.type === 'personal' ? 'P' :
                           project.type === 'student' ? 'S' :
                           project.type === 'staff' ? 'F' : 'M'}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                          project.status === 'active' ? 'bg-green-100 text-green-700' :
                          project.status === 'planning' ? 'bg-yellow-100 text-yellow-700' :
                          project.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {project.status}
                        </span>
                      </div>
                    </div>
                    {project.department && (
                      <div className="text-xs text-gray-600 mb-2">
                        {project.department}
                      </div>
                    )}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-1.5 mr-2">
                        <div
                          className="bg-blue-600 h-1.5 rounded-full transition-all"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600 font-medium">
                        {project.progress}%
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 pt-2 border-t border-gray-200">
                    <div className="flex items-center gap-1">
                      <a
                        href={createGoogleCalendarLink(project)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Add to Google Calendar"
                      >
                        <Calendar size={12} />
                        <span>Calendar</span>
                      </a>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProject(project);
                          setShowDeleteConfirmModal(true);
                        }}
                        className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete Project"
                      >
                        <Trash2 size={12} />
                        <span>Delete</span>
                      </button>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProject(project);
                        setShowAddMemberModal(true);
                      }}
                      className="w-full flex items-center justify-center gap-1 px-2 py-1 text-xs text-green-600 hover:bg-green-50 rounded transition-colors"
                      title="Add Team Member"
                    >
                      <Users size={12} />
                      <span>Add Member</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* View Area */}
        <div className="flex-1 overflow-auto p-6">
          {viewMode === 'kanban' ? <KanbanView /> : <GanttView />}
        </div>
      </div>

      {/* Modals */}
      {renderNewProjectModal()}
      {renderNewTaskModal()}
      {renderDeleteConfirmModal()}
      {renderEditProjectModal()}
      {renderAddMemberModal()}
      {renderTaskDetailModal()}
    </div>
  );
};

export default ProjectsTab;
