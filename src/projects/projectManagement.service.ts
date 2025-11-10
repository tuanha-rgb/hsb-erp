// src/projects/projectManagement.service.ts
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  Timestamp,
  serverTimestamp,
  onSnapshot,
  writeBatch
} from 'firebase/firestore';
import { db } from '../firebase/firebase.config';

const PROJECTS_COLLECTION = 'user_projects';
const TASKS_COLLECTION = 'project_tasks';
const KANBAN_COLUMNS_COLLECTION = 'kanban_columns';

export type ProjectType = 'personal' | 'student' | 'staff' | 'mixed';
export type ProjectStatus = 'planning' | 'active' | 'completed' | 'on-hold' | 'cancelled';
export type ProjectPriority = 'low' | 'medium' | 'high';

export interface ProjectMember {
  userId: string;
  name: string;
  email?: string;
  role: 'owner' | 'member' | 'viewer';
  initials: string;
  color: string;
  addedAt: Date;
}

export interface UserProject {
  id?: string;
  title: string;
  description: string;
  type: ProjectType;
  ownerId: string; // User who created the project
  ownerName: string;
  members: ProjectMember[]; // Array of member objects
  startDate: Date;
  endDate: Date;
  progress: number;
  status: ProjectStatus;
  department?: string;
  priority: ProjectPriority;
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TaskLabel {
  type: 'bug' | 'feature' | 'urgent' | 'devops' | 'documentation' | 'design' | 'backend' | 'performance' | 'setup' | 'uiux';
  text: string;
}

export interface TaskComment {
  id: string;
  text: string;
  authorId: string;
  authorName: string;
  createdAt: Date;
}

export interface TaskLink {
  id: string;
  url: string;
  title?: string;
  addedBy: string;
  addedAt: Date;
}

export interface ProjectTask {
  id?: string;
  title: string;
  description?: string;
  projectId: string;
  column: string; // Column ID from kanban board
  labels: TaskLabel[];
  assigneeId?: string;
  assigneeName?: string;
  assigneeInitials?: string;
  assigneeColor?: string;
  startDate: Date;
  endDate: Date;
  completed: boolean;
  createdById: string;
  createdByName: string;
  comments?: TaskComment[];
  links?: TaskLink[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface KanbanColumn {
  id?: string;
  projectId: string; // Each project can have custom columns
  title: string;
  order: number;
  isDefault: boolean; // Default columns can't be deleted
  color?: string;
  createdAt?: Date;
}

class ProjectManagementService {
  // ==================== PROJECTS ====================

  async createProject(project: Omit<UserProject, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const projectData = {
      ...project,
      startDate: Timestamp.fromDate(project.startDate),
      endDate: Timestamp.fromDate(project.endDate),
      members: project.members.map(m => ({
        ...m,
        addedAt: Timestamp.fromDate(m.addedAt)
      })),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, PROJECTS_COLLECTION), projectData);

    // Create default Kanban columns for this project
    await this.createDefaultColumns(docRef.id);

    return docRef.id;
  }

  async updateProject(projectId: string, updates: Partial<UserProject>): Promise<void> {
    const docRef = doc(db, PROJECTS_COLLECTION, projectId);

    const updateData: any = {
      ...updates,
      updatedAt: serverTimestamp()
    };

    if (updates.startDate) {
      updateData.startDate = Timestamp.fromDate(updates.startDate);
    }
    if (updates.endDate) {
      updateData.endDate = Timestamp.fromDate(updates.endDate);
    }
    if (updates.members) {
      updateData.members = updates.members.map(m => ({
        ...m,
        addedAt: Timestamp.fromDate(m.addedAt)
      }));
    }

    await updateDoc(docRef, updateData);
  }

  async deleteProject(projectId: string): Promise<void> {
    const batch = writeBatch(db);

    // Delete project
    const projectRef = doc(db, PROJECTS_COLLECTION, projectId);
    batch.delete(projectRef);

    // Delete all tasks
    const tasksQuery = query(collection(db, TASKS_COLLECTION), where('projectId', '==', projectId));
    const tasksSnapshot = await getDocs(tasksQuery);
    tasksSnapshot.docs.forEach(doc => batch.delete(doc.ref));

    // Delete all custom columns
    const columnsQuery = query(collection(db, KANBAN_COLUMNS_COLLECTION), where('projectId', '==', projectId));
    const columnsSnapshot = await getDocs(columnsQuery);
    columnsSnapshot.docs.forEach(doc => batch.delete(doc.ref));

    await batch.commit();
  }

  async getProject(projectId: string): Promise<UserProject | null> {
    const docRef = doc(db, PROJECTS_COLLECTION, projectId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;

    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      startDate: data.startDate?.toDate(),
      endDate: data.endDate?.toDate(),
      members: data.members?.map((m: any) => ({
        ...m,
        addedAt: m.addedAt?.toDate()
      })) || [],
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate()
    } as UserProject;
  }

  async getAllProjects(): Promise<UserProject[]> {
    const q = query(collection(db, PROJECTS_COLLECTION), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        startDate: data.startDate?.toDate(),
        endDate: data.endDate?.toDate(),
        members: data.members?.map((m: any) => ({
          ...m,
          addedAt: m.addedAt?.toDate()
        })) || [],
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate()
      } as UserProject;
    });
  }

  async getUserProjects(userId: string): Promise<UserProject[]> {
    // Get projects where user is owner or member
    const allProjects = await this.getAllProjects();
    return allProjects.filter(project =>
      project.ownerId === userId ||
      project.members.some(m => m.userId === userId)
    );
  }

  async getProjectsByType(type: ProjectType, userId?: string): Promise<UserProject[]> {
    const allProjects = await this.getAllProjects();
    let filtered = allProjects.filter(p => p.type === type);

    // Filter by user if userId provided
    if (userId) {
      filtered = filtered.filter(project =>
        project.ownerId === userId ||
        project.members.some(m => m.userId === userId)
      );
    }

    return filtered;
  }

  subscribeToProjects(callback: (projects: UserProject[]) => void, userId?: string) {
    const q = query(collection(db, PROJECTS_COLLECTION), orderBy('createdAt', 'desc'));

    return onSnapshot(q, (snapshot) => {
      let projects = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          startDate: data.startDate?.toDate(),
          endDate: data.endDate?.toDate(),
          members: data.members?.map((m: any) => ({
            ...m,
            addedAt: m.addedAt?.toDate()
          })) || [],
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate()
        } as UserProject;
      });

      // Filter by user if userId provided
      if (userId) {
        projects = projects.filter(project =>
          project.ownerId === userId ||
          project.members.some(m => m.userId === userId)
        );
      }

      callback(projects);
    });
  }

  // ==================== TASKS ====================

  async createTask(task: Omit<ProjectTask, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const taskData = {
      ...task,
      startDate: Timestamp.fromDate(task.startDate),
      endDate: Timestamp.fromDate(task.endDate),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, TASKS_COLLECTION), taskData);
    return docRef.id;
  }

  async updateTask(taskId: string, updates: Partial<ProjectTask>): Promise<void> {
    const docRef = doc(db, TASKS_COLLECTION, taskId);

    const updateData: any = {
      ...updates,
      updatedAt: serverTimestamp()
    };

    if (updates.startDate) {
      updateData.startDate = Timestamp.fromDate(updates.startDate);
    }
    if (updates.endDate) {
      updateData.endDate = Timestamp.fromDate(updates.endDate);
    }

    await updateDoc(docRef, updateData);
  }

  async deleteTask(taskId: string): Promise<void> {
    const docRef = doc(db, TASKS_COLLECTION, taskId);
    await deleteDoc(docRef);
  }

  async getProjectTasks(projectId: string): Promise<ProjectTask[]> {
    const q = query(
      collection(db, TASKS_COLLECTION),
      where('projectId', '==', projectId),
      orderBy('createdAt', 'asc')
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        startDate: data.startDate?.toDate(),
        endDate: data.endDate?.toDate(),
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate()
      } as ProjectTask;
    });
  }

  subscribeToProjectTasks(projectId: string, callback: (tasks: ProjectTask[]) => void) {
    const q = query(
      collection(db, TASKS_COLLECTION),
      where('projectId', '==', projectId),
      orderBy('createdAt', 'asc')
    );

    return onSnapshot(q, (snapshot) => {
      const tasks = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          startDate: data.startDate?.toDate(),
          endDate: data.endDate?.toDate(),
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate()
        } as ProjectTask;
      });

      callback(tasks);
    });
  }

  async moveTask(taskId: string, newColumn: string): Promise<void> {
    await this.updateTask(taskId, { column: newColumn });
  }

  // ==================== KANBAN COLUMNS ====================

  async createDefaultColumns(projectId: string): Promise<void> {
    const defaultColumns: Omit<KanbanColumn, 'id' | 'createdAt'>[] = [
      { projectId, title: 'To Do', order: 0, isDefault: true, color: '#94a3b8' },
      { projectId, title: 'Progress', order: 1, isDefault: true, color: '#3b82f6' },
      { projectId, title: 'Completed', order: 2, isDefault: true, color: '#10b981' },
    ];

    const batch = writeBatch(db);
    defaultColumns.forEach(column => {
      const docRef = doc(collection(db, KANBAN_COLUMNS_COLLECTION));
      batch.set(docRef, {
        ...column,
        createdAt: serverTimestamp()
      });
    });

    await batch.commit();
  }

  async createColumn(column: Omit<KanbanColumn, 'id' | 'createdAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, KANBAN_COLUMNS_COLLECTION), {
      ...column,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  }

  async updateColumn(columnId: string, updates: Partial<KanbanColumn>): Promise<void> {
    const docRef = doc(db, KANBAN_COLUMNS_COLLECTION, columnId);
    await updateDoc(docRef, updates);
  }

  async deleteColumn(columnId: string, projectId: string): Promise<void> {
    const docRef = doc(db, KANBAN_COLUMNS_COLLECTION, columnId);
    const columnSnap = await getDoc(docRef);

    if (columnSnap.exists() && columnSnap.data().isDefault) {
      throw new Error('Cannot delete default columns');
    }

    // Get the first default column to move tasks to
    const defaultColumnsQuery = query(
      collection(db, KANBAN_COLUMNS_COLLECTION),
      where('projectId', '==', projectId),
      where('isDefault', '==', true),
      orderBy('order', 'asc')
    );
    const defaultColumnsSnap = await getDocs(defaultColumnsQuery);
    const firstDefaultColumn = defaultColumnsSnap.docs[0];

    if (!firstDefaultColumn) {
      throw new Error('No default column found to move tasks to');
    }

    // Move all tasks from this column to first default column
    const tasksQuery = query(collection(db, TASKS_COLLECTION), where('column', '==', columnId));
    const tasksSnapshot = await getDocs(tasksQuery);

    const batch = writeBatch(db);
    tasksSnapshot.docs.forEach(doc => {
      batch.update(doc.ref, { column: firstDefaultColumn.id });
    });
    batch.delete(docRef);

    await batch.commit();
  }

  async getProjectColumns(projectId: string): Promise<KanbanColumn[]> {
    const q = query(
      collection(db, KANBAN_COLUMNS_COLLECTION),
      where('projectId', '==', projectId),
      orderBy('order', 'asc')
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate()
    })) as KanbanColumn[];
  }

  subscribeToProjectColumns(projectId: string, callback: (columns: KanbanColumn[]) => void) {
    const q = query(
      collection(db, KANBAN_COLUMNS_COLLECTION),
      where('projectId', '==', projectId),
      orderBy('order', 'asc')
    );

    return onSnapshot(q, (snapshot) => {
      const columns = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      })) as KanbanColumn[];

      callback(columns);
    });
  }
}

export const projectManagementService = new ProjectManagementService();
