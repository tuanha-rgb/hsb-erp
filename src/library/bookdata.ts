// bookData.ts - External data file for book records

export type BookType = 'textbook' | 'reference' | 'lecture_notes';
export type CatalogueCategory = 
"Business"
|"Management"
| "Finance"
| "Marketing"
| "Accounting"
| "Entrepreneurship"
  | 'Computer Science' 
  | 'Engineering' 
  | 'Business & Economics' 
  | 'Mathematics' 
  | 'Physics' 
  | 'Chemistry'
  | 'Biology & Life Sciences'
  | 'Social Sciences'
  | 'Humanities'
  | 'Medicine & Health'
  | 'Architecture'
  | 'Arts & Design';

export interface Publisher {
  id: string;
  name: string;
  code: string;
  country: string;
  website: string;
}

export interface BookRecord {
  id: string;
  isbn: string;
  title: string;
  subtitle?: string;
  authors: string[];
  publisher: string;
  publisherCode: string;
  edition: string;
  publicationYear: number;
  bookType: BookType;
  catalogue: CatalogueCategory;
  subjects: string[];
  description: string;
  language: string;
  pages: number;
  totalCopies: number;
  availableCopies: number;
  borrowedCopies: number;
  reservedCopies: number;
  shelfLocation: string;
  coverImage?: string;
  rating: number;
  totalRatings: number;
  popularityScore: number;
  addedDate: string;
  lastUpdated: string;
  price: number;
  currency: string;
  pdfUrl?: string;   // PDF file URL from Firebase
  epubUrl?: string;         
  driveFileId?: string; // Google Drive file ID
  fileType?: 'pdf' | 'epub';
}

// Publishers List


// Catalogue Categories
export const catalogues: CatalogueCategory[] = [
  'Computer Science',
  'Engineering',
  'Business & Economics',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology & Life Sciences',
  'Social Sciences',
  'Humanities',
  'Medicine & Health',
  'Architecture',
  'Arts & Design'
];

// Book Records
