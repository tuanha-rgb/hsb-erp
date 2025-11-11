// src/firebase/document.service.ts
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase.config';

// Collection names
const DOCUMENTS_COLLECTION = 'documents';
const DOCUMENT_RECIPIENTS_COLLECTION = 'document_recipients';
const DOCUMENT_CATEGORIES_COLLECTION = 'document_categories';

/* ---------- TypeScript Interfaces ---------- */

export type DocumentSource = 'Party' | 'Government' | 'MOET' | 'VNU' | 'HSB' | 'Other';

export interface Document {
  id?: string;
  title: string;
  type: 'incoming' | 'outgoing' | 'pending';
  category: string; // category ID
  fileUrl?: string;
  uploaderId: string;
  uploadDate: Date;
  priority: 'normal' | 'urgent';
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'archived';
  description?: string;
  tags?: string[]; // General tags
  source?: DocumentSource; // Source organization
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DocumentRecipient {
  id?: string;
  docId: string;
  recipientId: string;
  recipientType: 'student' | 'staff' | 'management';
  recipientName?: string;
  recipientEmail?: string;
  readStatus: boolean;
  readAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DocumentCategory {
  id?: string;
  name: string;
  icon: string;
  color: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/* ---------- Document Service ---------- */

export const documentService = {
  /* ---------- Documents CRUD ---------- */

  // Create a new document
  async createDocument(document: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, DOCUMENTS_COLLECTION), {
        ...document,
        uploadDate: Timestamp.fromDate(document.uploadDate),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log('[Document Service] Created document:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('[Document Service] Error creating document:', error);
      throw error;
    }
  },

  // Get a single document by ID
  async getDocument(docId: string): Promise<Document | null> {
    try {
      const docRef = doc(db, DOCUMENTS_COLLECTION, docId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          uploadDate: docSnap.data().uploadDate?.toDate(),
          createdAt: docSnap.data().createdAt?.toDate(),
          updatedAt: docSnap.data().updatedAt?.toDate()
        } as Document;
      }
      return null;
    } catch (error) {
      console.error('[Document Service] Error getting document:', error);
      throw error;
    }
  },

  // Get all documents
  async getAllDocuments(): Promise<Document[]> {
    try {
      const q = query(
        collection(db, DOCUMENTS_COLLECTION),
        orderBy('uploadDate', 'desc')
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        uploadDate: doc.data().uploadDate?.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      } as Document));
    } catch (error) {
      console.error('[Document Service] Error getting documents:', error);
      throw error;
    }
  },

  // Get documents by type
  async getDocumentsByType(type: 'incoming' | 'outgoing' | 'pending'): Promise<Document[]> {
    try {
      const q = query(
        collection(db, DOCUMENTS_COLLECTION),
        where('type', '==', type),
        orderBy('uploadDate', 'desc')
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        uploadDate: doc.data().uploadDate?.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      } as Document));
    } catch (error) {
      console.error('[Document Service] Error getting documents by type:', error);
      throw error;
    }
  },

  // Get documents by category
  async getDocumentsByCategory(categoryId: string): Promise<Document[]> {
    try {
      const q = query(
        collection(db, DOCUMENTS_COLLECTION),
        where('category', '==', categoryId),
        orderBy('uploadDate', 'desc')
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        uploadDate: doc.data().uploadDate?.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      } as Document));
    } catch (error) {
      console.error('[Document Service] Error getting documents by category:', error);
      throw error;
    }
  },

  // Get documents by uploader
  async getDocumentsByUploader(uploaderId: string): Promise<Document[]> {
    try {
      const q = query(
        collection(db, DOCUMENTS_COLLECTION),
        where('uploaderId', '==', uploaderId),
        orderBy('uploadDate', 'desc')
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        uploadDate: doc.data().uploadDate?.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      } as Document));
    } catch (error) {
      console.error('[Document Service] Error getting documents by uploader:', error);
      throw error;
    }
  },

  // Get documents for a specific recipient (based on document_recipients)
  async getDocumentsForRecipient(recipientId: string): Promise<Document[]> {
    try {
      // First, get all recipient records for this user
      const q = query(
        collection(db, DOCUMENT_RECIPIENTS_COLLECTION),
        where('recipientId', '==', recipientId)
      );
      const recipientSnapshot = await getDocs(q);

      // Extract document IDs
      const docIds = recipientSnapshot.docs.map(doc => doc.data().docId);

      if (docIds.length === 0) {
        return [];
      }

      // Fetch all documents (Firestore 'in' query limited to 10 items)
      const documents: Document[] = [];
      const batchSize = 10;

      for (let i = 0; i < docIds.length; i += batchSize) {
        const batch = docIds.slice(i, i + batchSize);
        const docQuery = query(
          collection(db, DOCUMENTS_COLLECTION),
          where('__name__', 'in', batch)
        );
        const docSnapshot = await getDocs(docQuery);

        docSnapshot.docs.forEach(doc => {
          documents.push({
            id: doc.id,
            ...doc.data(),
            uploadDate: doc.data().uploadDate?.toDate(),
            createdAt: doc.data().createdAt?.toDate(),
            updatedAt: doc.data().updatedAt?.toDate()
          } as Document);
        });
      }

      return documents.sort((a, b) => b.uploadDate.getTime() - a.uploadDate.getTime());
    } catch (error) {
      console.error('[Document Service] Error getting documents for recipient:', error);
      throw error;
    }
  },

  // Update a document
  async updateDocument(docId: string, updates: Partial<Omit<Document, 'id' | 'createdAt'>>): Promise<void> {
    try {
      const docRef = doc(db, DOCUMENTS_COLLECTION, docId);
      const updateData: any = {
        ...updates,
        updatedAt: serverTimestamp()
      };

      // Convert Date to Timestamp if uploadDate is being updated
      if (updates.uploadDate) {
        updateData.uploadDate = Timestamp.fromDate(updates.uploadDate);
      }

      await updateDoc(docRef, updateData);
      console.log('[Document Service] Updated document:', docId);
    } catch (error) {
      console.error('[Document Service] Error updating document:', error);
      throw error;
    }
  },

  // Delete a document
  async deleteDocument(docId: string): Promise<void> {
    try {
      const batch = writeBatch(db);

      // Delete the document
      const docRef = doc(db, DOCUMENTS_COLLECTION, docId);
      batch.delete(docRef);

      // Delete all associated recipients
      const recipientsQuery = query(
        collection(db, DOCUMENT_RECIPIENTS_COLLECTION),
        where('docId', '==', docId)
      );
      const recipientsSnapshot = await getDocs(recipientsQuery);

      recipientsSnapshot.docs.forEach(recipientDoc => {
        batch.delete(recipientDoc.ref);
      });

      await batch.commit();
      console.log('[Document Service] Deleted document and recipients:', docId);
    } catch (error) {
      console.error('[Document Service] Error deleting document:', error);
      throw error;
    }
  },

  /* ---------- Document Recipients CRUD ---------- */

  // Add a recipient to a document
  async addRecipient(recipient: Omit<DocumentRecipient, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, DOCUMENT_RECIPIENTS_COLLECTION), {
        ...recipient,
        readStatus: recipient.readStatus ?? false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log('[Document Service] Added recipient:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('[Document Service] Error adding recipient:', error);
      throw error;
    }
  },

  // Add multiple recipients to a document
  async addRecipients(recipients: Omit<DocumentRecipient, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<void> {
    try {
      const batch = writeBatch(db);

      recipients.forEach(recipient => {
        const docRef = doc(collection(db, DOCUMENT_RECIPIENTS_COLLECTION));
        batch.set(docRef, {
          ...recipient,
          readStatus: recipient.readStatus ?? false,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      });

      await batch.commit();
      console.log('[Document Service] Added recipients:', recipients.length);
    } catch (error) {
      console.error('[Document Service] Error adding recipients:', error);
      throw error;
    }
  },

  // Get all recipients for a document
  async getRecipientsByDocument(docId: string): Promise<DocumentRecipient[]> {
    try {
      const q = query(
        collection(db, DOCUMENT_RECIPIENTS_COLLECTION),
        where('docId', '==', docId)
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        readAt: doc.data().readAt?.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      } as DocumentRecipient));
    } catch (error) {
      console.error('[Document Service] Error getting recipients:', error);
      throw error;
    }
  },

  // Mark document as read
  async markAsRead(docId: string, recipientId: string): Promise<void> {
    try {
      const q = query(
        collection(db, DOCUMENT_RECIPIENTS_COLLECTION),
        where('docId', '==', docId),
        where('recipientId', '==', recipientId)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const recipientDoc = querySnapshot.docs[0];
        await updateDoc(recipientDoc.ref, {
          readStatus: true,
          readAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        console.log('[Document Service] Marked document as read:', docId);
      }
    } catch (error) {
      console.error('[Document Service] Error marking as read:', error);
      throw error;
    }
  },

  // Get unread count for a recipient
  async getUnreadCount(recipientId: string): Promise<number> {
    try {
      const q = query(
        collection(db, DOCUMENT_RECIPIENTS_COLLECTION),
        where('recipientId', '==', recipientId),
        where('readStatus', '==', false)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.size;
    } catch (error) {
      console.error('[Document Service] Error getting unread count:', error);
      throw error;
    }
  },

  // Remove recipient from document
  async removeRecipient(docId: string, recipientId: string): Promise<void> {
    try {
      const q = query(
        collection(db, DOCUMENT_RECIPIENTS_COLLECTION),
        where('docId', '==', docId),
        where('recipientId', '==', recipientId)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        await deleteDoc(querySnapshot.docs[0].ref);
        console.log('[Document Service] Removed recipient:', recipientId);
      }
    } catch (error) {
      console.error('[Document Service] Error removing recipient:', error);
      throw error;
    }
  },

  /* ---------- Document Categories CRUD ---------- */

  // Create a new category
  async createCategory(category: Omit<DocumentCategory, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, DOCUMENT_CATEGORIES_COLLECTION), {
        ...category,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log('[Document Service] Created category:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('[Document Service] Error creating category:', error);
      throw error;
    }
  },

  // Get all categories
  async getAllCategories(): Promise<DocumentCategory[]> {
    try {
      const q = query(
        collection(db, DOCUMENT_CATEGORIES_COLLECTION),
        orderBy('name', 'asc')
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      } as DocumentCategory));
    } catch (error) {
      console.error('[Document Service] Error getting categories:', error);
      throw error;
    }
  },

  // Get a single category by ID
  async getCategory(categoryId: string): Promise<DocumentCategory | null> {
    try {
      const docRef = doc(db, DOCUMENT_CATEGORIES_COLLECTION, categoryId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt?.toDate(),
          updatedAt: docSnap.data().updatedAt?.toDate()
        } as DocumentCategory;
      }
      return null;
    } catch (error) {
      console.error('[Document Service] Error getting category:', error);
      throw error;
    }
  },

  // Update a category
  async updateCategory(categoryId: string, updates: Partial<Omit<DocumentCategory, 'id' | 'createdAt'>>): Promise<void> {
    try {
      const docRef = doc(db, DOCUMENT_CATEGORIES_COLLECTION, categoryId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      console.log('[Document Service] Updated category:', categoryId);
    } catch (error) {
      console.error('[Document Service] Error updating category:', error);
      throw error;
    }
  },

  // Delete a category
  async deleteCategory(categoryId: string): Promise<void> {
    try {
      const docRef = doc(db, DOCUMENT_CATEGORIES_COLLECTION, categoryId);
      await deleteDoc(docRef);
      console.log('[Document Service] Deleted category:', categoryId);
    } catch (error) {
      console.error('[Document Service] Error deleting category:', error);
      throw error;
    }
  },

  // Clear all existing categories (for re-initialization)
  async clearAllCategories(): Promise<void> {
    try {
      const categories = await this.getAllCategories();
      const batch = writeBatch(db);

      categories.forEach(cat => {
        if (cat.id) {
          const docRef = doc(db, DOCUMENT_CATEGORIES_COLLECTION, cat.id);
          batch.delete(docRef);
        }
      });

      await batch.commit();
      console.log('[Document Service] Cleared all categories');
    } catch (error) {
      console.error('[Document Service] Error clearing categories:', error);
      throw error;
    }
  },

  // Initialize default categories (bilingual: English/Vietnamese)
  async initializeDefaultCategories(): Promise<void> {
    try {
      const existingCategories = await this.getAllCategories();

      if (existingCategories.length > 0) {
        console.log('[Document Service] Categories already initialized');
        return;
      }

      const defaultCategories: Omit<DocumentCategory, 'id' | 'createdAt' | 'updatedAt'>[] = [
        {
          name: 'Academic / ĐT&CTSV',
          icon: '📚',
          color: '#3B82F6',
          description: 'Academic-related documents, student affairs / Đào tạo và Công tác sinh viên'
        },
        {
          name: 'Financial / KHTC',
          icon: '💰',
          color: '#F59E0B',
          description: 'Financial planning documents, budgets / Kế hoạch tài chính'
        },
        {
          name: 'HR / TCCB',
          icon: '👥',
          color: '#EC4899',
          description: 'Human resources, personnel organization / Tổ chức cán bộ'
        },
        {
          name: 'Research / NCKH',
          icon: '🔬',
          color: '#8B5CF6',
          description: 'Research papers, proposals, grants / Nghiên cứu khoa học'
        },
        {
          name: 'International / HTPT',
          icon: '🌐',
          color: '#10B981',
          description: 'International cooperation documents / Hợp tác phát triển'
        },
        {
          name: 'Administrative / HTQT',
          icon: '📋',
          color: '#06B6D4',
          description: 'Administrative office documents / Hành chính quản trị'
        },
        {
          name: 'General / Chung',
          icon: '📄',
          color: '#6B7280',
          description: 'General documents and miscellaneous / Văn bản chung'
        }
      ];

      const batch = writeBatch(db);
      defaultCategories.forEach(category => {
        const docRef = doc(collection(db, DOCUMENT_CATEGORIES_COLLECTION));
        batch.set(docRef, {
          ...category,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      });

      await batch.commit();
      console.log('[Document Service] Initialized default categories (bilingual)');
    } catch (error) {
      console.error('[Document Service] Error initializing categories:', error);
      throw error;
    }
  },

  // Re-initialize categories (clears existing and creates new)
  async reinitializeCategories(): Promise<void> {
    try {
      await this.clearAllCategories();
      await this.initializeDefaultCategories();
      console.log('[Document Service] Categories re-initialized successfully');
    } catch (error) {
      console.error('[Document Service] Error re-initializing categories:', error);
      throw error;
    }
  }
};
