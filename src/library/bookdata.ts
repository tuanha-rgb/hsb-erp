// bookData.ts - External data file for book records

export type BookType = 'textbook' | 'reference' | 'lecture_notes' | 'E-Book';
export type CatalogueCategory = 
   | 'Business'
  | 'Management'
  | 'Technology'
  | 'Finance'
  | 'Marketing'
  | 'Economics'
  | 'Accounting'
  | 'Entrepreneurship'
  | 'Computer Science'
  | 'Cybersecurity'
  | 'Engineering'
  | 'Mathematics'
  | 'Social Sciences'
  | 'Humanities'
  | 'Language'
  | 'Medicine & Health'
  | 'Architecture'
  | 'Arts & Design'
  | 'Nontraditional Security'
    | 'Data Science'
  | 'Vietnam'


export interface Publisher {
  id: string;
  name: string;
  code: string;
  country: string;
  website: string;
}

// bookdata.ts
export interface BookRecord {
  // Required core fields
  id: string;
  isbn: string;
  title: string;
  authors: string[];
  publisher: string;
  publisherCode: string;
  bookType: BookType;
  catalogue: CatalogueCategory;
  
  // Optional fields (add ? to each)
  subtitle?: string;
  edition?: string;
  publicationYear?: number;
  subjects?: string[];
  description?: string;
  language?: string;
  pages?: number;
  totalCopies?: number;
  availableCopies?: number;
  borrowedCopies?: number;
  reservedCopies?: number;
  shelfLocation?: string;
  coverImage?: string;
  rating?: number;
  totalRatings?: number;
  popularityScore?: number;
  addedDate?: string;
  lastUpdated?: string;
  price?: number;
  currency?: string;
  firebaseStoragePath?: string;
  driveFileId?: string;
  fileType?: 'pdf' | 'epub';
}

// Publishers List
export const publishers: Publisher[] = [
  { id: 'PUB-001', name: 'Pearson', code: 'PEAR', country: 'USA', website: 'pearson.com' },
  { id: 'PUB-002', name: 'McGraw-Hill', code: 'MCGH', country: 'USA', website: 'mheducation.com' },
  { id: 'PUB-003', name: 'Springer', code: 'SPRG', country: 'Germany', website: 'springer.com' },
  { id: 'PUB-004', name: 'Sage Publications', code: 'SAGE', country: 'USA', website: 'sagepub.com' },
  { id: 'PUB-005', name: 'Routledge', code: 'ROUT', country: 'UK', website: 'routledge.com' },
  { id: 'PUB-006', name: 'Wiley', code: 'WILY', country: 'USA', website: 'wiley.com' },
  { id: 'PUB-007', name: 'Oxford University Press', code: 'OXFP', country: 'UK', website: 'oup.com' },
  { id: 'PUB-008', name: 'Cambridge University Press', code: 'CAMB', country: 'UK', website: 'cambridge.org' },
  { id: 'PUB-009', name: 'Elsevier', code: 'ELSE', country: 'Netherlands', website: 'elsevier.com' },
  { id: 'PUB-010', name: 'Cengage Learning', code: 'CENG', country: 'USA', website: 'cengage.com' }
];

// Catalogue Categories
export const catalogues: CatalogueCategory[] = [
     "Business", "Management", 'Nontraditional Security','Technology',"Finance", "Marketing",
"Economics", "Accounting", "Entrepreneurship",  'Computer Science','Data Science','Cybersecurity' ,'Engineering', 
   'Mathematics' ,
   'Social Sciences',
   'Humanities',
   'Language',
   'Medicine & Health',
   'Arts & Design', 
   'Vietnam',
];

// Book Records
export const bookRecords: BookRecord[] = [
  
  {
     id: 'BK-SOC-011',
  isbn: '978-1-133-95477-4', // ← replace with your exact ISBN
  title: 'Research Methods: The Essential Knowledge Base',
  authors: ['William M. Trochim', 'James P. Donnelly', 'Kanika Arora'],
  publisher: 'Cengage Learning',
  publisherCode: 'CENGAGE',
  edition: 'Latest Edition',
  publicationYear: 2014,             // adjust if your copy differs
  bookType: 'textbook',
  catalogue: 'Social Sciences',
  subjects: ['Research Methods', 'Social Sciences', 'Statistics', 'Methodology'],
  description: 'Core concepts and practical techniques for designing, conducting, and analyzing research across the social sciences.',
  language: 'English',
  pages: 446,                         // approximate; adjust to your copy
  totalCopies: 20,
  availableCopies: 17,
  borrowedCopies: 3,
  reservedCopies: 0,
  shelfLocation: 'SOC-R-01-11',
  rating: 4.6,
  totalRatings: 265,
  popularityScore: 82,
  addedDate: '2024-11-02',
  lastUpdated: '2024-11-02',
  price: 95.00,
  currency: 'USD',
   // Google Drive integration
    driveFileId: '1x9cCXbDyKAcDqtpjfx4UlWu5tlXE0SVy', // Replace with actual Google Drive file ID
    fileType: 'pdf'
  },

  
  
];