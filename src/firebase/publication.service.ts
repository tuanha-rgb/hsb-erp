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

export interface Publication {
  id?: string;
  title: string;
  authors: string[];
  type: 'Journal Article' | 'Conference Paper' | 'Book Chapter' | 'Book' | 'Review Article';
  journal: string;
  publisher?: string | null;
  year: number;
  citations: number;
  impactFactor: number | null;
  status: 'Published' | 'Under Review';
  doi: string | null;
  isbn?: string | null;
  project: string | null;
  quartile: 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'Scopus-indexed' | 'N/A';
  wosranking:  'SSCI' | 'SCIE' | 'AHCI' | 'ESCI' | 'Scopus-indexed' | 'N/A';
  scopusIndexed: boolean;
  discipline: string;
  abstract?: string;
  keywords?: string[];
  pages?: string;
  volume?: string;
  issue?: string;
  url?: string;
  pdfUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const PUBLICATIONS_COLLECTION = 'publications';

// Fetch publication data by DOI using CrossRef API
export async function fetchPublicationByDOI(doi: string): Promise<Partial<Publication> | null> {
  try {
    const cleanDOI = doi.trim();
    const res = await fetch(`https://api.crossref.org/works/${encodeURIComponent(cleanDOI)}`);
    
    if (!res.ok) return null;
    
    const data = await res.json();
    const work = data.message;
    
    if (!work) return null;
    
    // Extract authors
    const authors = work.author?.map((a: any) => 
      `${a.given || ''} ${a.family || ''}`.trim()
    ) || [];
    
    // Determine publication type
    let type: Publication['type'] = 'Journal Article';
    if (work.type === 'book-chapter') type = 'Book Chapter';
    else if (work.type === 'book') type = 'Book';
    else if (work.type === 'proceedings-article') type = 'Conference Paper';
    
    // Extract year
    const year = work.published?.['date-parts']?.[0]?.[0] || 
                 work.created?.['date-parts']?.[0]?.[0] || 
                 new Date().getFullYear();
    
    return {
      title: work.title?.[0] || '',
      authors,
      type,
      journal: work['container-title']?.[0] || work.publisher || '',
      publisher: work.publisher || null,
      year,
      doi: cleanDOI,
      volume: work.volume || undefined,
      issue: work.issue || undefined,
      pages: work.page || undefined,
      url: work.URL || undefined,
      abstract: work.abstract || undefined,
      citations: work['is-referenced-by-count'] || 0,
      impactFactor: null, // Not available from CrossRef
      quartile: 'N/A',
      status: 'Published' as const,
      discipline: work.subject?.[0] || 'General',
      project: null
    };
  } catch (error) {
    console.error('DOI lookup failed:', error);
    return null;
  }
}

// Fetch publication data by ISBN using Open Library API
export async function fetchPublicationByISBN(isbn: string): Promise<Partial<Publication> | null> {
  try {
    const cleanISBN = isbn.replace(/[-\s]/g, '');
    const res = await fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${cleanISBN}&format=json&jscmd=data`);
    const data = await res.json();
    const bookData = data[`ISBN:${cleanISBN}`];
    
    if (!bookData) return null;
    
    // Fetch description
    let description = '';
    if (bookData.key) {
      try {
        const workRes = await fetch(`https://openlibrary.org${bookData.key}.json`);
        const workData = await workRes.json();
        description = typeof workData.description === 'string' 
          ? workData.description 
          : workData.description?.value || '';
      } catch (e) {
        console.log('Could not fetch description');
      }
    }
    
    const authors = bookData.authors?.map((a: any) => a.name) || [];
    const year = bookData.publish_date ? parseInt(bookData.publish_date) : new Date().getFullYear();
    
    return {
      title: bookData.title || '',
      authors,
      type: 'Book' as const,
      journal: bookData.publishers?.[0]?.name || 'Unknown Publisher',
      publisher: bookData.publishers?.[0]?.name || null,
      year,
      isbn: cleanISBN,
      doi: null,
      abstract: description,
      citations: 0,
      impactFactor: null,
      quartile: 'N/A',
      status: 'Published' as const,
      discipline: bookData.subjects?.[0]?.name || 'General',
      project: null
    };
  } catch (error) {
    console.error('ISBN lookup failed:', error);
    return null;
  }
}

export const publicationService = {
  // Add new publication
  async addPublication(publication: Omit<Publication, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const cleanedData = Object.fromEntries(
      Object.entries(publication).filter(([_, v]) => v != null && v !== undefined)
    );
    const docRef = await addDoc(collection(db, PUBLICATIONS_COLLECTION), {
      ...cleanedData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  },

  // Upload journal PDF
  async uploadJournalPdf(file: File, publicationId: string): Promise<string> {
    const storageRef = ref(storage, `journals/${publicationId}-${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  },

  // Get all publications
  async getAllPublications(): Promise<Publication[]> {
    const querySnapshot = await getDocs(collection(db, PUBLICATIONS_COLLECTION));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    } as Publication));
  },

  // Get publications by discipline
  async getPublicationsByDiscipline(discipline: string): Promise<Publication[]> {
    const q = query(collection(db, PUBLICATIONS_COLLECTION), where('discipline', '==', discipline));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    } as Publication));
  },

  // Get publications by project
  async getPublicationsByProject(projectId: string): Promise<Publication[]> {
    const q = query(collection(db, PUBLICATIONS_COLLECTION), where('project', '==', projectId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    } as Publication));
  },

  // Update publication
  async updatePublication(publicationId: string, updates: Partial<Publication>): Promise<void> {
    const pubRef = doc(db, PUBLICATIONS_COLLECTION, publicationId);
    await updateDoc(pubRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  },

  // Delete publication
  async deletePublication(publicationId: string): Promise<void> {
    await deleteDoc(doc(db, PUBLICATIONS_COLLECTION, publicationId));
  },

  // Update citation count
  async updateCitations(publicationId: string, citations: number): Promise<void> {
    const pubRef = doc(db, PUBLICATIONS_COLLECTION, publicationId);
    await updateDoc(pubRef, {
      citations,
      updatedAt: Timestamp.now()
    });
  }
};