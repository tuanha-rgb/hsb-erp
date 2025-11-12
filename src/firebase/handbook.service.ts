import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  where,
  Timestamp,
  onSnapshot
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';
import { db, storage } from './firebase.config';

export interface HandbookDocument {
  id: string;
  title: string;
  description: string;
  abstract: string;
  category: string;
  type: 'PDF' | 'Video' | 'Document';
  fileUrl: string;
  fileName: string;
  fileSize: number;
  uploadDate: Date;
  uploadedBy: string;
  uploaderName: string;
  tags?: string[];
  isActive: boolean;
}

const COLLECTION_NAME = 'handbook';

// Upload file to Firebase Storage
export async function uploadHandbookFile(
  file: File,
  category: string,
  userId: string
): Promise<string> {
  const timestamp = Date.now();
  const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const storagePath = `handbook/${category}/${timestamp}_${sanitizedFileName}`;
  const storageRef = ref(storage, storagePath);

  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);

  return downloadURL;
}

// Create handbook document
export async function createHandbookDocument(
  document: Omit<HandbookDocument, 'id' | 'uploadDate'>
): Promise<string> {
  const docRef = doc(collection(db, COLLECTION_NAME));
  const newDoc: HandbookDocument = {
    ...document,
    id: docRef.id,
    uploadDate: new Date(),
    isActive: true
  };

  await setDoc(docRef, {
    ...newDoc,
    uploadDate: Timestamp.fromDate(newDoc.uploadDate)
  });

  return docRef.id;
}

// Get all handbook documents
export async function getAllHandbookDocuments(): Promise<HandbookDocument[]> {
  const q = query(
    collection(db, COLLECTION_NAME),
    where('isActive', '==', true),
    orderBy('uploadDate', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      uploadDate: data.uploadDate?.toDate() || new Date()
    } as HandbookDocument;
  });
}

// Get documents by category
export async function getHandbookDocumentsByCategory(
  category: string
): Promise<HandbookDocument[]> {
  const q = query(
    collection(db, COLLECTION_NAME),
    where('category', '==', category),
    where('isActive', '==', true),
    orderBy('uploadDate', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      uploadDate: data.uploadDate?.toDate() || new Date()
    } as HandbookDocument;
  });
}

// Get single document
export async function getHandbookDocument(id: string): Promise<HandbookDocument | null> {
  const docRef = doc(db, COLLECTION_NAME, id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return null;

  const data = docSnap.data();
  return {
    ...data,
    id: docSnap.id,
    uploadDate: data.uploadDate?.toDate() || new Date()
  } as HandbookDocument;
}

// Update document
export async function updateHandbookDocument(
  id: string,
  updates: Partial<HandbookDocument>
): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await setDoc(docRef, updates, { merge: true });
}

// Delete document (soft delete)
export async function deleteHandbookDocument(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await setDoc(docRef, { isActive: false }, { merge: true });
}

// Delete document permanently (including file)
export async function permanentlyDeleteHandbookDocument(
  id: string,
  fileUrl: string
): Promise<void> {
  // Delete from Firestore
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);

  // Delete from Storage
  try {
    const fileRef = ref(storage, fileUrl);
    await deleteObject(fileRef);
  } catch (error) {
    console.error('Error deleting file from storage:', error);
  }
}

// Subscribe to real-time updates
export function subscribeToHandbookDocuments(
  callback: (documents: HandbookDocument[]) => void
): () => void {
  const q = query(
    collection(db, COLLECTION_NAME),
    where('isActive', '==', true),
    orderBy('uploadDate', 'desc')
  );

  return onSnapshot(q, snapshot => {
    const documents = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        uploadDate: data.uploadDate?.toDate() || new Date()
      } as HandbookDocument;
    });
    callback(documents);
  });
}

// Search documents
export async function searchHandbookDocuments(
  searchTerm: string
): Promise<HandbookDocument[]> {
  const allDocs = await getAllHandbookDocuments();
  const lowerSearch = searchTerm.toLowerCase();

  return allDocs.filter(doc =>
    doc.title.toLowerCase().includes(lowerSearch) ||
    doc.description.toLowerCase().includes(lowerSearch) ||
    doc.category.toLowerCase().includes(lowerSearch) ||
    doc.tags?.some(tag => tag.toLowerCase().includes(lowerSearch))
  );
}

// Format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
