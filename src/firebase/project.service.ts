import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  Timestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase.config';
import { ResearchProject } from '../research/research';

const PROJECTS_COLLECTION = 'projects';

export interface Project extends Omit<ResearchProject, 'id'> {
  id?: string;
  pdfUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const projectService = {
  // Upload project PDF
  async uploadProjectPdf(file: File, projectId: string): Promise<string> {
    const storageRef = ref(storage, `research_projects/${projectId}-${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  },

  // Add new project
  async addProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const cleanedData = Object.fromEntries(
      Object.entries(project).filter(([_, v]) => v != null && v !== undefined)
    );
    const docRef = await addDoc(collection(db, PROJECTS_COLLECTION), {
      ...cleanedData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  },

  // Get all projects
  async getAllProjects(): Promise<Project[]> {
    const querySnapshot = await getDocs(collection(db, PROJECTS_COLLECTION));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    } as Project));
  },

  // Get project by ID
  async getProjectById(id: string): Promise<Project | null> {
    const docRef = doc(db, PROJECTS_COLLECTION, id);
    const docSnap = await getDocs(query(collection(db, PROJECTS_COLLECTION), where('__name__', '==', id)));

    if (!docSnap.empty) {
      const docData = docSnap.docs[0];
      return {
        id: docData.id,
        ...docData.data(),
        createdAt: docData.data().createdAt?.toDate(),
        updatedAt: docData.data().updatedAt?.toDate()
      } as Project;
    }
    return null;
  },

  // Update project
  async updateProject(id: string, updates: Partial<Project>): Promise<void> {
    const docRef = doc(db, PROJECTS_COLLECTION, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  },

  // Delete project
  async deleteProject(id: string): Promise<void> {
    const docRef = doc(db, PROJECTS_COLLECTION, id);
    await deleteDoc(docRef);
  },

  // Get projects by PI
  async getProjectsByPI(pi: string): Promise<Project[]> {
    const q = query(collection(db, PROJECTS_COLLECTION), where('pi', '==', pi));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    } as Project));
  },

  // Get projects by status
  async getProjectsByStatus(status: string): Promise<Project[]> {
    const q = query(collection(db, PROJECTS_COLLECTION), where('status', '==', status));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    } as Project));
  }
};
