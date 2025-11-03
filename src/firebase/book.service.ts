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
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './firebase.config';
import { compressImage } from '../imageCompression';

export interface Book {
  id?: string;
  title: string;
  author: string;
  isbn?: string;
  category: string;
  publisher?: string;
  publishedYear?: number;
  copies: number;
  availableCopies: number;
  description?: string;
  coverImage?: string;
  pdfUrl?: string; // PDF file URL
  bookType?: string; // printed, ebook, etc.
  featured?: boolean; // For carousel
  createdAt?: Date;
  updatedAt?: Date;
}

const BOOKS_COLLECTION = 'books';

export const bookService = {
  // Upload cover image to Firebase Storage
  async uploadCoverImage(file: File, bookId: string): Promise<string> {
    // Compress image before upload (80% quality, max 800x1200px)
    const compressed = await compressImage(file, 0.8);
    
    const storageRef = ref(storage, `book-covers/${crypto.randomUUID()}-${file.name}`);
    await uploadBytes(storageRef, compressed);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  },

  // Upload PDF file to Firebase Storage
  async uploadPdfFile(file: File, bookId: string): Promise<string> {
    const storageRef = ref(storage, `book-pdfs/${crypto.randomUUID()}-${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  },

  // Add new book with optional cover image and PDF
  // Add new book with optional cover image and PDF
  async addBook(book: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>, coverImageFile?: File, pdfFile?: File): Promise<string> {
    // First create the book document
    const docRef = await addDoc(collection(db, BOOKS_COLLECTION), {
      ...book,
      coverImage: book.coverImage || '',
      pdfUrl: book.pdfUrl || '',
      featured: book.featured || false,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });

    // Upload files if provided
    const updates: any = {};
    
    if (coverImageFile) {
      const coverImageUrl = await this.uploadCoverImage(coverImageFile, docRef.id);
      updates.coverImage = coverImageUrl;
    }

    if (pdfFile) {
      const pdfUrl = await this.uploadPdfFile(pdfFile, docRef.id);
      updates.pdfUrl = pdfUrl;
    }

    // Update book with file URLs if any files were uploaded
    if (Object.keys(updates).length > 0) {
      updates.updatedAt = Timestamp.now();
      await updateDoc(doc(db, BOOKS_COLLECTION, docRef.id), updates);
    }

    return docRef.id;
  },

  // Get all books
  async getAllBooks(): Promise<Book[]> {
    const querySnapshot = await getDocs(collection(db, BOOKS_COLLECTION));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    } as Book));
  },

  // Get featured books (for carousel)
  async getFeaturedBooks(): Promise<Book[]> {
    const q = query(collection(db, BOOKS_COLLECTION), where('featured', '==', true));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    } as Book));
  },

  // Update book
  async updateBook(bookId: string, updates: Partial<Book>): Promise<void> {
    const bookRef = doc(db, BOOKS_COLLECTION, bookId);
    await updateDoc(bookRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  },

  // Toggle featured status
  async toggleFeatured(bookId: string, featured: boolean): Promise<void> {
    const bookRef = doc(db, BOOKS_COLLECTION, bookId);
    await updateDoc(bookRef, {
      featured,
      updatedAt: Timestamp.now()
    });
  },

  // Delete book
  async deleteBook(bookId: string): Promise<void> {
    await deleteDoc(doc(db, BOOKS_COLLECTION, bookId));
  },

  // Borrow book (decrease available copies)
  async borrowBook(bookId: string): Promise<void> {
    const books = await this.getAllBooks();
    const book = books.find(b => b.id === bookId);
    
    if (!book || book.availableCopies <= 0) {
      throw new Error('Book not available');
    }

    const bookRef = doc(db, BOOKS_COLLECTION, bookId);
    await updateDoc(bookRef, {
      availableCopies: book.availableCopies - 1,
      updatedAt: Timestamp.now()
    });
  },

  // Return book (increase available copies)
  async returnBook(bookId: string): Promise<void> {
    const books = await this.getAllBooks();
    const book = books.find(b => b.id === bookId);
    
    if (!book || book.availableCopies >= book.copies) {
      throw new Error('Invalid return operation');
    }

    const bookRef = doc(db, BOOKS_COLLECTION, bookId);
    await updateDoc(bookRef, {
      availableCopies: book.availableCopies + 1,
      updatedAt: Timestamp.now()
    });
  }
};