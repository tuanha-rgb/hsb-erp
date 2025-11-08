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
import { Patent as ResearchPatent } from '../research/research';

const PATENTS_COLLECTION = 'patents';

export interface Patent extends Omit<ResearchPatent, 'id'> {
  id?: string;
  pdfUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const patentService = {
  // Upload patent PDF
  async uploadPatentPdf(file: File, patentId: string): Promise<string> {
    const storageRef = ref(storage, `patents/${patentId}-${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  },

  // Add new patent
  async addPatent(patent: Omit<Patent, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const cleanedData = Object.fromEntries(
      Object.entries(patent).filter(([_, v]) => v != null && v !== undefined)
    );
    const docRef = await addDoc(collection(db, PATENTS_COLLECTION), {
      ...cleanedData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  },

  // Get all patents
  async getAllPatents(): Promise<Patent[]> {
    const querySnapshot = await getDocs(collection(db, PATENTS_COLLECTION));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    } as Patent));
  },

  // Get patent by ID
  async getPatentById(id: string): Promise<Patent | null> {
    const docRef = doc(db, PATENTS_COLLECTION, id);
    const docSnap = await getDocs(query(collection(db, PATENTS_COLLECTION), where('__name__', '==', id)));

    if (!docSnap.empty) {
      const docData = docSnap.docs[0];
      return {
        id: docData.id,
        ...docData.data(),
        createdAt: docData.data().createdAt?.toDate(),
        updatedAt: docData.data().updatedAt?.toDate()
      } as Patent;
    }
    return null;
  },

  // Update patent
  async updatePatent(id: string, updates: Partial<Patent>): Promise<void> {
    const docRef = doc(db, PATENTS_COLLECTION, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  },

  // Delete patent
  async deletePatent(id: string): Promise<void> {
    const docRef = doc(db, PATENTS_COLLECTION, id);
    await deleteDoc(docRef);
  },

  // Get patents by status
  async getPatentsByStatus(status: string): Promise<Patent[]> {
    const q = query(collection(db, PATENTS_COLLECTION), where('status', '==', status));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    } as Patent));
  },

  // Get patents by inventor
  async getPatentsByInventor(inventorName: string): Promise<Patent[]> {
    const allPatents = await this.getAllPatents();
    return allPatents.filter(patent =>
      patent.inventors.some(inv => inv.toLowerCase().includes(inventorName.toLowerCase()))
    );
  }
};
