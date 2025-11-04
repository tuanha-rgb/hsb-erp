// bookData.ts - External data file for book records

export type BookType = 'textbook' | 'reference' | 'lecture_notes';
export type CatalogueCategory = 
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

  {
    id: 'BK-CS-101',
    isbn: '978-1-394-21395-5',
    title: 'Stepping Through Cybersecurity Risk Management',
    subtitle: 'A Systems Thinking Approach',
    authors: ['Jennifer L. Bayuk'],
    publisher: 'Wiley',
    publisherCode: 'WILEY',
    edition: '1st Edition',
    publicationYear: 2024,
    bookType: 'textbook',
    catalogue: 'Computer Science',
    subjects: ['Cybersecurity', 'Risk Management', 'Information Security', 'Systems Engineering', 'Enterprise Security', 'Security Governance'],
    description: 'Authoritative resource delivering the professional practice of cybersecurity from the perspective of enterprise governance and risk management. This book covers the state of the art in cybersecurity risk identification, classification, measurement, remediation, monitoring and reporting. It includes industry standard techniques for examining cybersecurity threat actors, attacks, technology controls, measures and metrics, issue tracking and analysis, and risk and control assessments. Written by a highly qualified professional with extensive experience as a Wall Street CISO, risk management officer, and systems security engineering professor.',
    language: 'English',
    pages: 336,
    totalCopies: 3,
    availableCopies: 3,
    borrowedCopies: 0,
    reservedCopies: 0,
    shelfLocation: 'CS-SEC-001',
    rating: 4.7,
    totalRatings: 89,
    popularityScore: 85,
    addedDate: '2024-03-26',
    lastUpdated: '2024-11-02',
    price: 89.99,
    currency: 'USD',
    
    // Google Drive integration
    driveFileId: '1UpCwzxULdfPrj9NbCgQ9KdyYBr3n4P_W', // Replace with actual Google Drive file ID
    fileType: 'pdf'
  },
    
  {
    id: 'BK-MATH-102',
    isbn: '978-0-241-39863-0',
    title: 'The Art of Statistics',
    subtitle: 'Learning from Data',
    authors: ['David Spiegelhalter'],
    publisher: 'Pelican Books',
    publisherCode: 'PELICAN',
    edition: '1st Edition',
    publicationYear: 2019,
    bookType: 'textbook',
    catalogue: 'Mathematics',
    subjects: ['Statistics', 'Data Science', 'Statistical Literacy', 'Data Analysis', 'Probability', 'Research Methods'],
    description: 'A comprehensive guide to statistical thinking that shows how to derive knowledge from raw data by focusing on concepts and connections behind the math. Written by world-renowned statistician and Chair of the Winton Centre for Risk and Evidence Communication at Cambridge University. This book guides readers through essential principles needed to derive knowledge from data, using real-world problems to introduce complex issues. Sir David Spiegelhalter was knighted in 2014 for services to medical statistics and is one of the most cited researchers in his field. The book covers how statistics can help us understand everything from the Titanic survivors to serial killers, hospital survival rates, and the number of trees on the planet.',
    language: 'English',
    pages: 448,
    totalCopies: 5,
    availableCopies: 4,
    borrowedCopies: 1,
    reservedCopies: 0,
    shelfLocation: 'MATH-STAT-001',
    rating: 4.8,
    totalRatings: 234,
    popularityScore: 92,
    addedDate: '2019-03-28',
    lastUpdated: '2024-11-02',
    price: 18.99,
    currency: 'USD',
    
    // Google Drive integration
    driveFileId: '1eNLc_IE1oDFo_8Zs1B25WSGZuPSUGGN1', // Replace with actual Google Drive file ID
    fileType: 'epub'
  }

];