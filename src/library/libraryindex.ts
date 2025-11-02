import { bookRecords, type BookRecord } from './bookdata';
import { sampleTheses, type Thesis } from '../acad/thesis';

export type LibraryItem = BookRecord | Thesis;

export interface SearchFilters {
  query?: string;
  contentType?: 'all' | 'books' | 'theses';
  category?: string;
  level?: string;
  year?: number;
  status?: string;
  author?: string;
}

export interface LibraryIndex {
  items: LibraryItem[];
  totalBooks: number;
  totalTheses: number;
  categories: Set<string>;
  authors: Set<string>;
  years: Set<number>;
}

/**
 * Check if item is a book
 */
export const isBook = (item: LibraryItem): item is BookRecord => {
  return 'isbn' in item;
};

/**
 * Check if item is a thesis
 */
export const isThesis = (item: LibraryItem): item is Thesis => {
  return 'student' in item;
};

/**
 * Build comprehensive library index
 */
export const buildLibraryIndex = (): LibraryIndex => {
  const allItems: LibraryItem[] = [...bookRecords, ...sampleTheses];
  const categories = new Set<string>();
  const authors = new Set<string>();
  const years = new Set<number>();

  allItems.forEach(item => {
    if (isBook(item)) {
      categories.add(item.catalogue);
      item.authors.forEach(author => authors.add(author));
      years.add(item.publicationYear);
    } else {
      categories.add(item.fieldOfStudy);
      authors.add(item.student.name);
      years.add(parseInt(item.academicYear.split('-')[0]));
    }
  });

  return {
    items: allItems,
    totalBooks: bookRecords.length,
    totalTheses: sampleTheses.length,
    categories,
    authors,
    years,
  };
};

/**
 * Search and filter library items
 */
export const searchLibrary = (filters: SearchFilters): LibraryItem[] => {
  let results: LibraryItem[] = [];

  // Select content type
  if (!filters.contentType || filters.contentType === 'all') {
    results = [...bookRecords, ...sampleTheses];
  } else if (filters.contentType === 'books') {
    results = [...bookRecords];
  } else if (filters.contentType === 'theses') {
    results = [...sampleTheses];
  }

  // Apply text search
  if (filters.query) {
    const query = filters.query.toLowerCase().trim();
    results = results.filter(item => {
      if (isBook(item)) {
        return (
          item.title.toLowerCase().includes(query) ||
          item.subtitle?.toLowerCase().includes(query) ||
          item.authors.some(a => a.toLowerCase().includes(query)) ||
          item.subjects.some(s => s.toLowerCase().includes(query)) ||
          item.description.toLowerCase().includes(query) ||
          item.isbn.includes(query)
        );
      } else {
        return (
          item.title.toLowerCase().includes(query) ||
          item.titleVietnamese.toLowerCase().includes(query) ||
          item.student.name.toLowerCase().includes(query) ||
          item.supervisor.name.toLowerCase().includes(query) ||
          item.keywords.some(k => k.toLowerCase().includes(query)) ||
          item.abstract.toLowerCase().includes(query) ||
          item.id.toLowerCase().includes(query)
        );
      }
    });
  }

  // Apply category filter
  if (filters.category && filters.category !== 'all') {
    results = results.filter(item => {
      if (isBook(item)) {
        return item.catalogue === filters.category;
      } else {
        return item.fieldOfStudy === filters.category;
      }
    });
  }

  // Apply level filter (theses only)
  if (filters.level) {
    results = results.filter(item => isThesis(item) && item.level === filters.level);
  }

  // Apply year filter
  if (filters.year) {
    results = results.filter(item => {
      if (isBook(item)) {
        return item.publicationYear === filters.year;
      } else {
        return parseInt(item.academicYear.split('-')[0]) === filters.year;
      }
    });
  }

  // Apply status filter (theses only)
  if (filters.status) {
    results = results.filter(item => isThesis(item) && item.status === filters.status);
  }

  // Apply author filter
  if (filters.author) {
    const authorLower = filters.author.toLowerCase();
    results = results.filter(item => {
      if (isBook(item)) {
        return item.authors.some(a => a.toLowerCase().includes(authorLower));
      } else {
        return item.student.name.toLowerCase().includes(authorLower) ||
               item.supervisor.name.toLowerCase().includes(authorLower);
      }
    });
  }

  return results;
};

/**
 * Get popular/recommended items
 */
export const getPopularItems = (limit = 10): LibraryItem[] => {
  const books = bookRecords
    .sort((a, b) => b.popularityScore - a.popularityScore)
    .slice(0, Math.floor(limit / 2));
  
  const theses = sampleTheses
    .filter(t => t.status === 'approved' || t.status === 'published')
    .sort((a, b) => {
      const aScore = a.reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / Math.max(a.reviews.length, 1);
      const bScore = b.reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / Math.max(b.reviews.length, 1);
      return bScore - aScore;
    })
    .slice(0, Math.ceil(limit / 2));

  return [...books, ...theses].slice(0, limit);
};

/**
 * Get recently added items
 */
export const getRecentItems = (limit = 10): LibraryItem[] => {
  const books = bookRecords
    .sort((a, b) => new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime())
    .slice(0, Math.floor(limit / 2));
  
  const theses = sampleTheses
    .sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime())
    .slice(0, Math.ceil(limit / 2));

  return [...books, ...theses]
    .sort((a, b) => {
      const aDate = isBook(a) ? new Date(a.addedDate) : new Date(a.submissionDate);
      const bDate = isBook(b) ? new Date(b.addedDate) : new Date(b.submissionDate);
      return bDate.getTime() - aDate.getTime();
    })
    .slice(0, limit);
};

/**
 * Get statistics for library
 */
export const getLibraryStats = () => {
  const index = buildLibraryIndex();
  
  return {
    totalItems: index.items.length,
    totalBooks: index.totalBooks,
    totalTheses: index.totalTheses,
    totalCategories: index.categories.size,
    totalAuthors: index.authors.size,
    availableBooks: bookRecords.reduce((sum, book) => sum + book.availableCopies, 0),
    borrowedBooks: bookRecords.reduce((sum, book) => sum + book.borrowedCopies, 0),
    approvedTheses: sampleTheses.filter(t => t.status === 'approved').length,
    publishedTheses: sampleTheses.filter(t => t.status === 'published').length,
  };
};

/**
 * Sort library items
 */
export const sortLibraryItems = (
  items: LibraryItem[],
  sortBy: 'title' | 'date' | 'rating' | 'author' = 'title',
  order: 'asc' | 'desc' = 'asc'
): LibraryItem[] => {
  const sorted = [...items].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'title':
        comparison = (isBook(a) ? a.title : a.title).localeCompare(
          isBook(b) ? b.title : b.title
        );
        break;

      case 'date':
        const aDate = isBook(a) ? new Date(a.publicationYear, 0) : new Date(a.submissionDate);
        const bDate = isBook(b) ? new Date(b.publicationYear, 0) : new Date(b.submissionDate);
        comparison = aDate.getTime() - bDate.getTime();
        break;

      case 'rating':
        const aRating = isBook(a) ? a.rating : 
          a.reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / Math.max(a.reviews.length, 1);
        const bRating = isBook(b) ? b.rating :
          b.reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / Math.max(b.reviews.length, 1);
        comparison = aRating - bRating;
        break;

      case 'author':
        const aAuthor = isBook(a) ? a.authors[0] : a.student.name;
        const bAuthor = isBook(b) ? b.authors[0] : b.student.name;
        comparison = aAuthor.localeCompare(bAuthor);
        break;
    }

    return order === 'asc' ? comparison : -comparison;
  });

  return sorted;
};

export default {
  buildLibraryIndex,
  searchLibrary,
  getPopularItems,
  getRecentItems,
  getLibraryStats,
  sortLibraryItems,
  isBook,
  isThesis,
};