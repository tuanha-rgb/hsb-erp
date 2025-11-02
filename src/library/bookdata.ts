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
  driveFileId?: string; // Google Drive file ID
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
    id: 'BK-CS-001',
    isbn: '978-0-13-468599-1',
    title: 'Introduction to Algorithms',
    authors: ['Thomas H. Cormen', 'Charles E. Leiserson', 'Ronald L. Rivest', 'Clifford Stein'],
    publisher: 'MIT Press',
    publisherCode: 'MIT',
    edition: '4th Edition',
    publicationYear: 2022,
    bookType: 'textbook',
    catalogue: 'Computer Science',
    subjects: ['Algorithms', 'Data Structures', 'Computer Science'],
    description: 'A comprehensive textbook covering fundamental algorithms and data structures used in computer science.',
    language: 'English',
    pages: 1312,
    totalCopies: 25,
    availableCopies: 18,
    borrowedCopies: 6,
    reservedCopies: 1,
    shelfLocation: 'CS-A-01-05',
    rating: 4.8,
    totalRatings: 156,
    popularityScore: 95,
    addedDate: '2023-01-15',
    lastUpdated: '2024-10-15',
    price: 89.99,
    currency: 'USD'
  },
  {
    id: 'BK-ENG-002',
    isbn: '978-0-07-352955-3',
    title: 'Engineering Mechanics: Statics',
    authors: ['J.L. Meriam', 'L.G. Kraige', 'J.N. Bolton'],
    publisher: 'Wiley',
    publisherCode: 'WILY',
    edition: '9th Edition',
    publicationYear: 2021,
    bookType: 'textbook',
    catalogue: 'Engineering',
    subjects: ['Mechanics', 'Statics', 'Engineering'],
    description: 'Fundamental principles of statics with extensive problem-solving practice.',
    language: 'English',
    pages: 544,
    totalCopies: 30,
    availableCopies: 22,
    borrowedCopies: 8,
    reservedCopies: 0,
    shelfLocation: 'ENG-M-02-12',
    rating: 4.6,
    totalRatings: 89,
    popularityScore: 88,
    addedDate: '2023-02-20',
    lastUpdated: '2024-09-10',
    price: 125.00,
    currency: 'USD'
  },
  {
    id: 'BK-BUS-003',
    isbn: '978-1-292-34031-2',
    title: 'Principles of Marketing',
    authors: ['Philip Kotler', 'Gary Armstrong'],
    publisher: 'Pearson',
    publisherCode: 'PEAR',
    edition: '18th Edition',
    publicationYear: 2023,
    bookType: 'textbook',
    catalogue: 'Business & Economics',
    subjects: ['Marketing', 'Business', 'Management'],
    description: 'Comprehensive introduction to marketing principles and practices in the modern business world.',
    language: 'English',
    pages: 720,
    totalCopies: 40,
    availableCopies: 35,
    borrowedCopies: 5,
    reservedCopies: 0,
    shelfLocation: 'BUS-M-03-08',
    rating: 4.7,
    totalRatings: 234,
    popularityScore: 92,
    addedDate: '2023-08-10',
    lastUpdated: '2024-10-20',
    price: 95.00,
    currency: 'USD'
  },
  {
    id: 'BK-MAT-004',
    isbn: '978-0-321-97707-7',
    title: 'Calculus: Early Transcendentals',
    authors: ['James Stewart'],
    publisher: 'Cengage Learning',
    publisherCode: 'CENG',
    edition: '8th Edition',
    publicationYear: 2020,
    bookType: 'textbook',
    catalogue: 'Mathematics',
    subjects: ['Calculus', 'Mathematics', 'Analysis'],
    description: 'Comprehensive calculus textbook with emphasis on understanding and problem solving.',
    language: 'English',
    pages: 1368,
    totalCopies: 50,
    availableCopies: 42,
    borrowedCopies: 8,
    reservedCopies: 0,
    shelfLocation: 'MAT-C-01-15',
    rating: 4.9,
    totalRatings: 312,
    popularityScore: 98,
    addedDate: '2022-09-01',
    lastUpdated: '2024-10-05',
    price: 110.00,
    currency: 'USD'
  },
  {
    id: 'BK-CS-005',
    isbn: '978-3-540-76336-8',
    title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
    authors: ['Erich Gamma', 'Richard Helm', 'Ralph Johnson', 'John Vlissides'],
    publisher: 'Addison-Wesley',
    publisherCode: 'ADDW',
    edition: '1st Edition',
    publicationYear: 1994,
    bookType: 'reference',
    catalogue: 'Computer Science',
    subjects: ['Software Engineering', 'Design Patterns', 'OOP'],
    description: 'Classic reference on software design patterns, known as the Gang of Four book.',
    language: 'English',
    pages: 416,
    totalCopies: 15,
    availableCopies: 10,
    borrowedCopies: 5,
    reservedCopies: 0,
    shelfLocation: 'CS-R-02-08',
    rating: 4.7,
    totalRatings: 445,
    popularityScore: 85,
    addedDate: '2021-03-15',
    lastUpdated: '2024-08-22',
    price: 65.00,
    currency: 'USD'
  },
  {
    id: 'BK-PHY-006',
    isbn: '978-0-13-191182-1',
    title: 'University Physics with Modern Physics',
    authors: ['Hugh D. Young', 'Roger A. Freedman'],
    publisher: 'Pearson',
    publisherCode: 'PEAR',
    edition: '15th Edition',
    publicationYear: 2019,
    bookType: 'textbook',
    catalogue: 'Physics',
    subjects: ['Physics', 'Modern Physics', 'Classical Mechanics'],
    description: 'Comprehensive physics textbook covering classical and modern physics topics.',
    language: 'English',
    pages: 1632,
    totalCopies: 35,
    availableCopies: 28,
    borrowedCopies: 7,
    reservedCopies: 0,
    shelfLocation: 'PHY-U-01-20',
    rating: 4.6,
    totalRatings: 178,
    popularityScore: 87,
    addedDate: '2022-11-10',
    lastUpdated: '2024-09-18',
    price: 145.00,
    currency: 'USD'
  },
  {
    id: 'BK-MED-007',
    isbn: '978-0-323-55211-1',
    title: 'Gray\'s Anatomy for Students',
    authors: ['Richard Drake', 'A. Wayne Vogl', 'Adam W.M. Mitchell'],
    publisher: 'Elsevier',
    publisherCode: 'ELSE',
    edition: '4th Edition',
    publicationYear: 2020,
    bookType: 'reference',
    catalogue: 'Medicine & Health',
    subjects: ['Anatomy', 'Medicine', 'Human Biology'],
    description: 'Essential anatomy reference for medical students with clinical correlations.',
    language: 'English',
    pages: 1168,
    totalCopies: 20,
    availableCopies: 12,
    borrowedCopies: 8,
    reservedCopies: 0,
    shelfLocation: 'MED-A-01-05',
    rating: 4.9,
    totalRatings: 267,
    popularityScore: 94,
    addedDate: '2023-01-20',
    lastUpdated: '2024-10-12',
    price: 85.00,
    currency: 'USD'
  },
  {
    id: 'BK-CS-008',
    isbn: '978-0-262-03384-8',
    title: 'Artificial Intelligence: A Modern Approach',
    authors: ['Stuart Russell', 'Peter Norvig'],
    publisher: 'Pearson',
    publisherCode: 'PEAR',
    edition: '4th Edition',
    publicationYear: 2021,
    bookType: 'textbook',
    catalogue: 'Computer Science',
    subjects: ['Artificial Intelligence', 'Machine Learning', 'Robotics'],
    description: 'The leading textbook in Artificial Intelligence, comprehensive and up-to-date.',
    language: 'English',
    pages: 1136,
    totalCopies: 28,
    availableCopies: 15,
    borrowedCopies: 12,
    reservedCopies: 1,
    shelfLocation: 'CS-A-03-12',
    rating: 4.8,
    totalRatings: 523,
    popularityScore: 96,
    addedDate: '2023-03-05',
    lastUpdated: '2024-10-25',
    price: 135.00,
    currency: 'USD'
  },
  {
    id: 'BK-ARCH-009',
    isbn: '978-0-415-78270-5',
    title: 'Architecture: Form, Space, and Order',
    authors: ['Francis D.K. Ching'],
    publisher: 'Wiley',
    publisherCode: 'WILY',
    edition: '4th Edition',
    publicationYear: 2015,
    bookType: 'reference',
    catalogue: 'Architecture',
    subjects: ['Architecture', 'Design', 'Building Design'],
    description: 'Classic introduction to the basic vocabulary of architectural design.',
    language: 'English',
    pages: 464,
    totalCopies: 18,
    availableCopies: 14,
    borrowedCopies: 4,
    reservedCopies: 0,
    shelfLocation: 'ARCH-D-02-07',
    rating: 4.7,
    totalRatings: 198,
    popularityScore: 82,
    addedDate: '2022-06-15',
    lastUpdated: '2024-07-30',
    price: 75.00,
    currency: 'USD'
  },
  {
    id: 'BK-SOC-010',
    isbn: '978-1-4462-9536-4',
    title: 'Research Methods in Social Sciences',
    authors: ['Chava Frankfort-Nachmias', 'David Nachmias'],
    publisher: 'Sage Publications',
    publisherCode: 'SAGE',
    edition: '8th Edition',
    publicationYear: 2022,
    bookType: 'textbook',
    catalogue: 'Social Sciences',
    subjects: ['Research Methods', 'Social Sciences', 'Statistics'],
    description: 'Comprehensive guide to research methodology in social sciences.',
    language: 'English',
    pages: 592,
    totalCopies: 22,
    availableCopies: 19,
    borrowedCopies: 3,
    reservedCopies: 0,
    shelfLocation: 'SOC-R-01-10',
    rating: 4.5,
    totalRatings: 142,
    popularityScore: 78,
    addedDate: '2023-09-01',
    lastUpdated: '2024-10-08',
    price: 88.00,
    currency: 'USD'
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