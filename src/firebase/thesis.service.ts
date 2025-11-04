// src/firebase/thesis.service.ts
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

export interface Thesis {
  id?: string;
  title: string;
  titleVietnamese?: string;
  studentName: string;
  studentId: string;
  level: "bachelor" | "master" | "phd";
  program: string;
  year: number;
  submissionDate: string;
  defenseDate?: string;
  approvalDate?: string;
  status: "draft" | "submitted" | "under_review" | "approved" | "rejected" | "published";
  abstract: string;
  keywords: string[];
  pdfUrl?: string;
  pages?: number;
  plagiarismScore?: number;
  grade?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Storage path mapping for thesis levels
const STORAGE_PATHS = {
  bachelor: "theses",
  master: "master-theses",
  phd: "dissertation",
};

const THESIS_COLLECTION = 'theses';

export const thesisService = {
  // Upload PDF file to appropriate storage path based on level
  async uploadThesisPdf(file: File, level: "bachelor" | "master" | "phd", thesisId: string): Promise<string> {
    const storagePath = STORAGE_PATHS[level];
    const storageRef = ref(storage, `${storagePath}/${thesisId}.pdf`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  },

  // Add new thesis with optional PDF
  async addThesis(
    thesis: Omit<Thesis, 'id' | 'createdAt' | 'updatedAt'>, 
    pdfFile?: File
  ): Promise<string> {
    const docRef = await addDoc(collection(db, THESIS_COLLECTION), {
      ...thesis,
      pdfUrl: thesis.pdfUrl || '',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });

    // Upload PDF if provided
    if (pdfFile) {
      const pdfUrl = await this.uploadThesisPdf(pdfFile, thesis.level, docRef.id);
      await updateDoc(doc(db, THESIS_COLLECTION, docRef.id), {
        pdfUrl,
        updatedAt: Timestamp.now()
      });
    }

    return docRef.id;
  },

  // Get all theses
  async getAllTheses(): Promise<Thesis[]> {
    const querySnapshot = await getDocs(collection(db, THESIS_COLLECTION));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    } as Thesis));
  },

  // Get theses by level
  async getThesesByLevel(level: "bachelor" | "master" | "phd"): Promise<Thesis[]> {
    const q = query(collection(db, THESIS_COLLECTION), where('level', '==', level));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    } as Thesis));
  },

  // Get theses by program
  async getThesesByProgram(program: string): Promise<Thesis[]> {
    const q = query(collection(db, THESIS_COLLECTION), where('program', '==', program));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    } as Thesis));
  },

  // Get theses by status
  async getThesesByStatus(status: string): Promise<Thesis[]> {
    const q = query(collection(db, THESIS_COLLECTION), where('status', '==', status));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    } as Thesis));
  },

  // Update thesis
  async updateThesis(thesisId: string, updates: Partial<Thesis>): Promise<void> {
    const thesisRef = doc(db, THESIS_COLLECTION, thesisId);
    await updateDoc(thesisRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  },

  // Delete thesis
  async deleteThesis(thesisId: string): Promise<void> {
    await deleteDoc(doc(db, THESIS_COLLECTION, thesisId));
  },

  // Update thesis status
  async updateThesisStatus(
    thesisId: string, 
    status: "draft" | "submitted" | "under_review" | "approved" | "rejected" | "published"
  ): Promise<void> {
    const thesisRef = doc(db, THESIS_COLLECTION, thesisId);
    await updateDoc(thesisRef, {
      status,
      updatedAt: Timestamp.now()
    });
  },

  // Approve thesis (set approval date and status)
  async approveThesis(thesisId: string): Promise<void> {
    const thesisRef = doc(db, THESIS_COLLECTION, thesisId);
    await updateDoc(thesisRef, {
      status: 'approved',
      approvalDate: new Date().toISOString().split('T')[0],
      updatedAt: Timestamp.now()
    });
  }
};