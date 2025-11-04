// src/library/BookManagement.tsx
import React, { useMemo, useState, useEffect } from "react";
import {
  Search, Filter, Plus, Eye, CheckCircle, Star, TrendingUp, Library, Book,
  Copy, BookOpen, X, Upload, Image as ImageIcon, Download, FileText, Loader, Edit
} from "lucide-react";
import { getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth";

import { bookService, type Book as FirebaseBook } from "../firebase/book.service";
import {
  type BookType,
  type CatalogueCategory,
} from "./bookdata";

/* ---------- Utilities ---------- */
// Category abbreviations for ID generation
const CATEGORY_ABBREV: Record<string, string> = {
   "Business": "BUS",
  "Management": "MGT",
  "Finance": "FIN",
  "Marketing": "MKT",
  "Economics": "ECO",
  "Accounting": "ACC",
  "Entrepreneurship": "ENT",
  "Computer Science": "CS",
  "Cybersecurity": "CYS",
  "Engineering": "ENG",
  "Mathematics": "MATH",
  "Social Sciences": "SOC",
  "Humanities": "HUM",
  "Language": "LANG",
  "Medicine & Health": "MED",
  "Architecture": "ARCH",
  "Arts & Design": "ART"

};

// Generate book ID: [CAT]-[YEAR]-[SEQ]-[I/L]
const generateBookId = (category: string, year: number, sequence: number, isInternational: boolean): string => {
  const abbrev = CATEGORY_ABBREV[category] || "GEN";
  const locale = isInternational ? "I" : "L";
  const seq = String(sequence).padStart(3, '0'); // Zero-padded 3 digits
  return `${abbrev}-${year}-${seq}-${locale}`;
};

// Calculate sequence number for a book based on all books
const getBookSequence = (books: BookRecord[], targetBook: BookRecord): number => {
  const matchingBooks = books.filter(book => 
    book.category === targetBook.category && 
    (book.publishedYear || 0) === (targetBook.publishedYear || 0) &&
    (book.isInternational ?? true) === (targetBook.isInternational ?? true)
  );
  
  // Sort by creation date or ID to maintain consistent ordering
  matchingBooks.sort((a, b) => {
    const dateA = a.addedDate || a.id || '';
    const dateB = b.addedDate || b.id || '';
    return dateA.localeCompare(dateB);
  });
  
  // Find index of target book + 1 (1-indexed)
  const index = matchingBooks.findIndex(b => b.id === targetBook.id);
  return index >= 0 ? index + 1 : matchingBooks.length + 1;
};

// ISBN lookup via Open Library API
const fetchBookByISBN = async (isbn: string) => {
  try {
    const cleanISBN = isbn.replace(/[-\s]/g, '');
    const res = await fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${cleanISBN}&format=json&jscmd=data`);
    const data = await res.json();
    const bookData = data[`ISBN:${cleanISBN}`];
    
    if (!bookData) return null;
    
    // Fetch description from work endpoint if available
    let description = "";
    if (bookData.key) {
      try {
        const workRes = await fetch(`https://openlibrary.org${bookData.key}.json`);
        const workData = await workRes.json();
        description = typeof workData.description === 'string' 
          ? workData.description 
          : workData.description?.value || "";
      } catch (e) {
        console.log("Could not fetch description");
      }
    }
    
    return {
      title: bookData.title || "",
      author: bookData.authors?.[0]?.name || "",
      publisher: bookData.publishers?.[0]?.name || "",
      publishedYear: bookData.publish_date ? parseInt(bookData.publish_date) : undefined,
      coverImage: bookData.cover?.large || bookData.cover?.medium || "",
      description: description,
    };
  } catch (error) {
    console.error("ISBN lookup failed:", error);
    return null;
  }
};

/* ---------- Types ---------- */
interface BookRecord extends FirebaseBook {
  subtitle?: string;
  authors: string[];
  isbn: string;
  subjects: string[];
  edition?: string;
  pages?: number;
  language: string;
  shelfLocation?: string;
  rating: number;
  totalRatings: number;
  popularityScore: number;
  price: number;
  currency: string;
  addedDate?: string;
  lastUpdated?: string;
  bookType: BookType;
  catalogue: CatalogueCategory;
  totalCopies: number;
  availableCopies: number;
  borrowedCopies: number;
  isInternational?: boolean; // For Book ID generation
}

interface BookFilterOptions {
  bookType: BookType | "all";
  catalogue: CatalogueCategory | "all";
  publisher: string;
  status: "all" | "available" | "low_stock";
  yearFrom: string;
  yearTo: string;
  language: string;
}

/* ---------- Component ---------- */
const BookManagement: React.FC = () => {
  const [books, setBooks] = useState<BookRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [bookToEdit, setBookToEdit] = useState<BookRecord | null>(null);
  const [selectedBook, setSelectedBook] = useState<BookRecord | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCatalogue, setSelectedCatalogue] =
    useState<CatalogueCategory | "all">("all");

  // Pagination
  const [pageSize] = useState<20 | 50 | 100>(20);
  const [currentPage, setCurrentPage] = useState(1);

  const [filters, setFilters] = useState<BookFilterOptions>({
    bookType: "all",
    catalogue: "all",
    publisher: "all",
    status: "all",
    yearFrom: "",
    yearTo: "",
    language: "all",
  });

  // Sign in (anonymous) first, then load data
  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, async (user) => {
      try {
        setInitError(null);
        if (!user) await signInAnonymously(auth);
        await loadBooks();
      } catch (e: any) {
        console.error("Initialization failed:", e);
        setInitError(e?.message ?? "Failed to initialize");
        setLoading(false);
      }
    });
    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      setInitError(null);

      const firebaseBooks = await bookService.getAllBooks();

      const transformedBooks: BookRecord[] = firebaseBooks.map((book) => ({
        ...book,
        authors: book.author ? [book.author] : [],
        isbn: book.isbn || "",
        subjects: [],
        language: "English",
        rating: 0,
        totalRatings: 0,
        popularityScore: 0,
        price: 0,
        currency: "USD",
        bookType: (book.bookType || "printed") as BookType,
        catalogue: book.category as CatalogueCategory,
        totalCopies: book.copies,
        borrowedCopies: book.copies - book.availableCopies,
        addedDate: book.createdAt?.toISOString(),
        lastUpdated: book.updatedAt?.toISOString(),
      }));

      setBooks(transformedBooks);
    } catch (error: any) {
      console.error("Error loading books:", error);
      setInitError(error?.message ?? "Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  // Add book (delegates uploading to bookService)
  const handleAddBook = async (
    bookData: Partial<FirebaseBook>,
    coverImageFile?: File,
    pdfFile?: File
  ) => {
    try {
      // quick client validation mirroring your Storage rules
      if (coverImageFile) {
        if (!coverImageFile.type.startsWith("image/"))
          throw new Error("Cover must be an image");
        if (coverImageFile.size > 10 * 1024 * 1024)
          throw new Error("Cover image > 10MB");
      }
      if (pdfFile) {
        if (pdfFile.type !== "application/pdf")
          throw new Error("PDF must be application/pdf");
        if (pdfFile.size > 50 * 1024 * 1024)
          throw new Error("PDF > 50MB");
      }

      await bookService.addBook(
        {
          title: bookData.title || "",
          author: bookData.author || "",
          category: bookData.category || "Business",
          copies: bookData.copies || 1,
          availableCopies: bookData.availableCopies || bookData.copies || 1,
          isbn: bookData.isbn,
          publisher: bookData.publisher,
          publishedYear: bookData.publishedYear,
          description: bookData.description,
          bookType: bookData.bookType || "Printed",
          featured: bookData.featured || false,
        },
        coverImageFile,
        pdfFile
      );

      await loadBooks();
      setShowAddModal(false);
      alert("Book added successfully!");
    } catch (error: any) {
      console.error("Error adding book:", error);
      alert(error?.message ?? "Failed to add book");
    }
  };

  // Edit book
  const handleEditBook = async (
    bookId: string,
    bookData: Partial<FirebaseBook>,
    coverImageFile?: File,
    pdfFile?: File
  ) => {
    try {
      // Validation
      if (coverImageFile) {
        if (!coverImageFile.type.startsWith("image/"))
          throw new Error("Cover must be an image");
        if (coverImageFile.size > 10 * 1024 * 1024)
          throw new Error("Cover image > 10MB");
      }
      if (pdfFile) {
        if (pdfFile.type !== "application/pdf")
          throw new Error("PDF must be application/pdf");
        if (pdfFile.size > 50 * 1024 * 1024)
          throw new Error("PDF > 50MB");
      }

      // bookService.updateBook likely only takes (bookId, bookData)
      // If files need to be uploaded separately, use addBook pattern
      await bookService.updateBook(
        bookId,
        {
          title: bookData.title || "",
          author: bookData.author || "",
          category: bookData.category || "Business",
          copies: bookData.copies || 1,
          availableCopies: bookData.availableCopies || bookData.copies || 1,
          isbn: bookData.isbn,
          publisher: bookData.publisher,
          publishedYear: bookData.publishedYear,
          description: bookData.description,
          bookType: bookData.bookType || "Printed",
          featured: bookData.featured || false,
        }
      );

      await loadBooks();
      setShowEditModal(false);
      setBookToEdit(null);
      alert("Book updated successfully!");
    } catch (error: any) {
      console.error("Error updating book:", error);
      alert(error?.message ?? "Failed to update book");
    }
  };

  const handleToggleFeatured = async (
    bookId: string,
    currentFeatured: boolean
  ) => {
    try {
      await bookService.toggleFeatured(bookId, !currentFeatured);
      await loadBooks();
    } catch (error) {
      console.error("Error toggling featured:", error);
      alert("Failed to update featured status");
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    if (!confirm("Are you sure you want to delete this book?")) return;
    try {
      await bookService.deleteBook(bookId);
      await loadBooks();
      alert("Book deleted successfully");
    } catch (error) {
      console.error("Error deleting book:", error);
      alert("Failed to delete book");
    }
  };

  // Reset to first page on filters/search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, JSON.stringify(filters), selectedCatalogue]);

  /* ---------- Statistics ---------- */
  const statistics = useMemo(() => {
    const total = books.length;
    const totalPhysicalCopies = books.reduce((s, b) => s + b.totalCopies, 0);
    const availableCopies = books.reduce((s, b) => s + b.availableCopies, 0);
    const borrowedCopies = books.reduce((s, b) => s + b.borrowedCopies, 0);
    const utilizationRate =
      totalPhysicalCopies === 0
        ? "0.0"
        : ((borrowedCopies / totalPhysicalCopies) * 100).toFixed(1);
    const uniquePublishers = new Set(
      books.map((b) => b.publisher).filter(Boolean)
    ).size;
    const avgRating =
      total === 0 ? 0 : books.reduce((s, b) => s + b.rating, 0) / total;

    return {
      total,
      totalPhysicalCopies,
      availableCopies,
      borrowedCopies,
      utilizationRate,
      uniquePublishers,
      avgRating: avgRating.toFixed(1),
    };
  }, [books]);

  /* ---------- Filtering ---------- */
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.authors.some((a) =>
          a.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        book.isbn.includes(searchTerm) ||
        (book.publisher &&
          book.publisher.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesType =
        filters.bookType === "all" || book.bookType === filters.bookType;
      const matchesCatalogue =
        filters.catalogue === "all" || book.catalogue === filters.catalogue;
      const matchesPublisher =
        filters.publisher === "all" || book.publisher === filters.publisher;
      const matchesLanguage =
        filters.language === "all" || book.language === filters.language;

      const matchesStatus =
        filters.status === "all" ||
        (filters.status === "available" && book.availableCopies > 0) ||
        (filters.status === "low_stock" &&
          book.availableCopies <= 5 &&
          book.availableCopies > 0);

      const matchesYearFrom =
        !filters.yearFrom ||
        (book.publishedYear &&
          book.publishedYear >= parseInt(filters.yearFrom, 10));
      const matchesYearTo =
        !filters.yearTo ||
        (book.publishedYear &&
          book.publishedYear <= parseInt(filters.yearTo, 10));

      const matchesSelectedCatalogue =
        selectedCatalogue === "all" || book.catalogue === selectedCatalogue;

      return (
        matchesSearch &&
        matchesType &&
        matchesCatalogue &&
        matchesPublisher &&
        matchesLanguage &&
        matchesStatus &&
        matchesYearFrom &&
        matchesYearTo &&
        matchesSelectedCatalogue
      );
    });
  }, [books, searchTerm, filters, selectedCatalogue]);

  /* ---------- Pagination ---------- */
  const totalItems = filteredBooks.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const clampedPage = Math.min(currentPage, totalPages);
  const startIdx = (clampedPage - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, totalItems);
  const pageItems = useMemo(
    () => filteredBooks.slice(startIdx, endIdx),
    [filteredBooks, startIdx, endIdx]
  );

  /* ---------- UI ---------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Library className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading library...</p>
          {initError && (
            <div className="mt-3 text-sm text-red-600">
              {initError}
              <div className="mt-2">
                <button
                  onClick={loadBooks}
                  className="px-3 py-1.5 rounded bg-red-600 text-white hover:bg-red-700"
                >
                  Retry
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Library Management
        </h1>
        <p className="text-gray-600">Manage your institution&apos;s books</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard icon={<Book className="w-5 h-5 text-blue-600" />} label="Total Books" value={statistics.total} />
        <StatCard icon={<Copy className="w-5 h-5 text-green-600" />} label="Total Copies" value={statistics.totalPhysicalCopies} />
        <StatCard icon={<CheckCircle className="w-5 h-5 text-emerald-600" />} label="Available" value={statistics.availableCopies} />
        <StatCard icon={<TrendingUp className="w-5 h-5 text-orange-600" />} label="Utilization" value={`${statistics.utilizationRate}%`} />
      </div>

      {/* Controls */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search books..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <Filter className="w-5 h-5" />
            Filters
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Book
          </button>
        </div>
      </div>

      {/* Books Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <Th>Book ID</Th>
                <Th>Title</Th>
                <Th>Author</Th>
                <Th>Publisher</Th>
                <Th>Year</Th>
                <Th>Type</Th>
                <Th>Category</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pageItems.map((book) => (
                <tr key={book.id} className="hover:bg-gray-50">
                  
                  <td className="px-6 py-4">
                    <code className="text-xs font-mono font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-200">
                      {generateBookId(
                        book.category, 
                        book.publishedYear || new Date().getFullYear(),
                        getBookSequence(books, book),
                        book.isInternational ?? true
                      )}
                    </code>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{book.title}</div>
                    {book.isbn && (
                      <div className="text-sm text-gray-500">ISBN: {book.isbn}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {book.author}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {book.publisher || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {book.publishedYear || "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                      {book.bookType || "Printed"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                      {book.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedBook(book);
                          setShowDetailModal(true);
                        }}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          setBookToEdit(book);
                          setShowEditModal(true);
                        }}
                        className="p-1 text-orange-600 hover:bg-orange-50 rounded"
                        title="Edit Book"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      {book.pdfUrl && (
                        <a
                          href={book.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                          title="View PDF"
                        >
                          <Download className="w-5 h-5" />
                        </a>
                      )}
                      <button
                        onClick={() =>
                          book.id && handleToggleFeatured(book.id, book.featured || false)
                        }
                        className={`p-1 rounded ${
                          book.featured ? "text-yellow-500" : "text-gray-400"
                        } hover:bg-gray-100`}
                        title="Toggle Featured"
                      >
                        <Star
                          className={`w-5 h-5 ${book.featured ? "fill-yellow-500" : ""}`}
                        />
                      </button>
                      <button
                        onClick={() => book.id && handleDeleteBook(book.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        title="Delete Book"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Book Modal */}
      {showAddModal && (
        <AddBookModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddBook}
          existingBooks={books}
        />
      )}

      {/* Edit Book Modal */}
      {showEditModal && bookToEdit && (
        <EditBookModal
          book={bookToEdit}
          onClose={() => {
            setShowEditModal(false);
            setBookToEdit(null);
          }}
          onSubmit={(bookData, coverImage, pdf) => 
            bookToEdit.id && handleEditBook(bookToEdit.id, bookData, coverImage, pdf)
          }
          existingBooks={books}
        />
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedBook && (
        <BookDetailModal
          book={selectedBook}
          allBooks={books}
          onClose={() => setShowDetailModal(false)}
        />
      )}
    </div>
  );
};

/* ---------- Small UI helpers ---------- */
const Th: React.FC<React.PropsWithChildren> = ({ children }) => (
  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
    {children}
  </th>
);

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: React.ReactNode }> = ({ icon, label, value }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
    <div className="flex items-center gap-3 mb-2">
      {icon}
      <span className="text-sm text-gray-600">{label}</span>
    </div>
    <p className="text-3xl font-bold text-gray-900">{value}</p>
  </div>
);

/* ---------- Add Book Modal ---------- */
const AddBookModal: React.FC<{
  onClose: () => void;
  onSubmit: (
    book: Partial<FirebaseBook>,
    coverImage?: File,
    pdfFile?: File
  ) => Promise<void> | void;
  existingBooks: BookRecord[];
}> = ({ onClose, onSubmit, existingBooks }) => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "Business",
    copies: 1,
    isbn: "",
    publisher: "",
    publishedYear: new Date().getFullYear(),
    description: "",
    bookType: "Printed",
    featured: false,
    isInternational: true,
  });

  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isbnLoading, setIsbnLoading] = useState(false);

  // Calculate next sequence number based on existing books
  const getNextSequence = useMemo(() => {
    const matchingBooks = existingBooks.filter(book => 
      book.category === formData.category && 
      (book.publishedYear || 0) === formData.publishedYear &&
      (book.isInternational ?? true) === formData.isInternational
    );
    return matchingBooks.length + 1;
  }, [existingBooks, formData.category, formData.publishedYear, formData.isInternational]);

  // Auto-generated book ID
  const bookId = useMemo(() => 
    generateBookId(formData.category, formData.publishedYear, getNextSequence, formData.isInternational),
    [formData.category, formData.publishedYear, getNextSequence, formData.isInternational]
  );

  // ISBN lookup handler
  const handleIsbnLookup = async () => {
    if (!formData.isbn || formData.isbn.length < 10) {
      return;
    }
    
    setIsbnLoading(true);
    try {
      const bookData = await fetchBookByISBN(formData.isbn);
      if (bookData) {
        setFormData(prev => ({
          ...prev,
          title: bookData.title || prev.title,
          author: bookData.author || prev.author,
          publisher: bookData.publisher || prev.publisher,
          publishedYear: bookData.publishedYear || prev.publishedYear,
          description: bookData.description || prev.description,
        }));
        if (bookData.coverImage) {
          setPreviewUrl(bookData.coverImage);
        }
      }
    } catch (error) {
      console.error("ISBN lookup failed:", error);
    } finally {
      setIsbnLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") setPdfFile(file);
    else alert("Please select a valid PDF file");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await Promise.resolve(
        onSubmit(
          { ...formData, availableCopies: formData.copies },
          coverImage || undefined,
          pdfFile || undefined
        )
      );
    } finally {
      setIsSubmitting(false);
    }
  };
const TextAreaField: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}> = ({ label, value, onChange, rows = 3, placeholder }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      placeholder={placeholder}
      className="w-full px-3 py-2 border rounded-lg"
    />
  </div>
);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Add New Book</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Cover */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Book Cover Image
            </label>
            <div className="flex items-center gap-4">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-24 h-32 object-cover rounded border"
                />
              ) : (
                <div className="w-24 h-32 bg-gray-100 rounded border flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                </div>
              )}
              <div className="flex-1">
                <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition">
                  <Upload className="w-5 h-5" />
                  <span className="text-sm">Upload Cover Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  JPG, PNG, or WEBP (Max 10MB)
                </p>
              </div>
            </div>
          </div>

          {/* PDF */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Book PDF (Optional)
            </label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-32 bg-red-50 rounded border border-red-200 flex flex-col items-center justify-center">
                <FileText className="w-8 h-8 text-red-600 mb-1" />
                {pdfFile && (
                  <span className="text-xs text-red-600 text-center px-1">
                    {pdfFile.name.substring(0, 12)}...
                  </span>
                )}
              </div>
              <div className="flex-1">
                <label className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg cursor-pointer transition">
                  <Upload className="w-5 h-5" />
                  <span className="text-sm">
                    {pdfFile ? "Change PDF" : "Upload PDF File"}
                  </span>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handlePdfChange}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  PDF format (Max 50MB)
                </p>
              </div>
            </div>
          </div>

          {/* Fields */}
          {/* Auto-generated Book ID */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <label className="block text-sm font-medium text-blue-900 mb-2">
              Auto-Generated Book ID
            </label>
            <div className="flex items-center justify-between">
              <code className="text-lg font-mono font-bold text-blue-700 bg-white px-4 py-2 rounded border border-blue-300">
                {bookId}
              </code>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    checked={formData.isInternational}
                    onChange={() => setFormData({ ...formData, isInternational: true })}
                  />
                  International
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    checked={!formData.isInternational}
                    onChange={() => setFormData({ ...formData, isInternational: false })}
                  />
                  Local
                </label>
              </div>
            </div>
            <p className="text-xs text-blue-600 mt-2">
              Format: [{CATEGORY_ABBREV[formData.category] || "GEN"}]-[{formData.publishedYear}]-[{String(getNextSequence).padStart(3, '0')}]-[{formData.isInternational ? "I" : "L"}]
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <TextField
              label="Title *"
              value={formData.title}
              onChange={(v) => setFormData({ ...formData, title: v })}
              required
            />
            <TextField
              label="Author *"
              value={formData.author}
              onChange={(v) => setFormData({ ...formData, author: v })}
              required
            />
          </div>
                
          <div className="grid grid-cols-3 gap-4">
            <TextField
              label="Publisher"
              value={formData.publisher}
              onChange={(v) => setFormData({ ...formData, publisher: v })}
            />
            <NumberField
              label="Year"
              value={formData.publishedYear}
              onChange={(v) => setFormData({ ...formData, publishedYear: v })}
              min={1900}
              max={new Date().getFullYear() + 1}
            />
            <SelectField
              label="Type"
              value={formData.bookType}
              onChange={(v) => setFormData({ ...formData, bookType: v })}
              options={["E-Book", "Audiobook","Printed"]}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <SelectField
              label="Category"
              value={formData.category}
              onChange={(v) => setFormData({ ...formData, category: v })}
              options={[
                "Business", "Management", "Finance", "Marketing",
"Economics", "Accounting", "Entrepreneurship",  'Computer Science','Cybersecurity' ,'Engineering', 
   'Mathematics' ,
   'Social Sciences',
   'Humanities',
   'Language',
   'Medicine & Health',
   'Architecture',
   'Arts & Design'
              ]}
            />
            <NumberField
              label="Copies"
              value={formData.copies}
              onChange={(v) => setFormData({ ...formData, copies: v })}
              min={1}
            />
          </div>

          {/* ISBN with lookup button */}
          <div>
            <label className="block text-sm font-medium mb-1">ISBN</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.isbn}
                onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                placeholder="978-0-123456-78-9"
                className="flex-1 px-3 py-2 border rounded-lg"
              />
              <button
                type="button"
                onClick={handleIsbnLookup}
                disabled={isbnLoading || !formData.isbn}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  isbnLoading || !formData.isbn
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                {isbnLoading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Looking up...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Auto-Fill
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Enter ISBN and click Auto-Fill to retrieve book information
            </p>
          </div>

          <TextAreaField
            label="Description"
            value={formData.description}
            onChange={(v) => setFormData({ ...formData, description: v })}
            rows={3}
            placeholder="Brief description of the book..."
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) =>
                setFormData({ ...formData, featured: e.target.checked })
              }
              className="w-4 h-4"
            />
            <label className="text-sm font-medium">
              Featured (Show in carousel)
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 px-6 py-3 rounded-lg flex items-center justify-center gap-2 text-white ${
                isSubmitting
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              <Plus className="w-5 h-5" />
              {isSubmitting ? "Uploading…" : "Add Book"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className={`px-6 py-3 border border-gray-300 rounded-lg ${
                isSubmitting ? "opacity-60 cursor-not-allowed" : "hover:bg-gray-50"
              }`}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ---------- Edit Book Modal ---------- */
const EditBookModal: React.FC<{
  book: BookRecord;
  onClose: () => void;
  onSubmit: (
    book: Partial<FirebaseBook>,
    coverImage?: File,
    pdfFile?: File
  ) => Promise<void> | void;
  existingBooks: BookRecord[];
}> = ({ book, onClose, onSubmit, existingBooks }) => {
  const [formData, setFormData] = useState({
    title: book.title,
    author: book.author,
    category: book.category,
    copies: book.copies,
    isbn: book.isbn || "",
    publisher: book.publisher || "",
    publishedYear: book.publishedYear || new Date().getFullYear(),
    description: book.description || "",
    bookType: book.bookType || "Printed",
    featured: book.featured || false,
    isInternational: book.isInternational ?? true,
  });

  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(book.coverImage || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isbnLoading, setIsbnLoading] = useState(false);

  // Calculate sequence - should remain same for existing book
  const bookSequence = useMemo(() => 
    getBookSequence(existingBooks, book),
    [existingBooks, book]
  );

  // Auto-generated book ID
  const bookId = useMemo(() => 
    generateBookId(formData.category, formData.publishedYear, bookSequence, formData.isInternational),
    [formData.category, formData.publishedYear, bookSequence, formData.isInternational]
  );

  // ISBN lookup handler
  const handleIsbnLookup = async () => {
    if (!formData.isbn || formData.isbn.length < 10) {
      return;
    }
    
    setIsbnLoading(true);
    try {
      const bookData = await fetchBookByISBN(formData.isbn);
      if (bookData) {
        setFormData(prev => ({
          ...prev,
          title: bookData.title || prev.title,
          author: bookData.author || prev.author,
          publisher: bookData.publisher || prev.publisher,
          publishedYear: bookData.publishedYear || prev.publishedYear,
          description: bookData.description || prev.description,
        }));
        if (bookData.coverImage) {
          setPreviewUrl(bookData.coverImage);
        }
      }
    } catch (error) {
      console.error("ISBN lookup failed:", error);
    } finally {
      setIsbnLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") setPdfFile(file);
    else alert("Please select a valid PDF file");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await Promise.resolve(
        onSubmit(
          { ...formData, availableCopies: formData.copies },
          coverImage || undefined,
          pdfFile || undefined
        )
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const TextAreaField: React.FC<{
    label: string;
    value: string;
    onChange: (v: string) => void;
    rows?: number;
    placeholder?: string;
  }> = ({ label, value, onChange, rows = 3, placeholder }) => (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full px-3 py-2 border rounded-lg"
      />
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Edit Book</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Cover */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Book Cover Image
            </label>
            <div className="flex items-center gap-4">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-24 h-32 object-cover rounded border"
                />
              ) : (
                <div className="w-24 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-white" />
                </div>
              )}
              <div className="flex-1">
                <label className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg cursor-pointer transition">
                  <Upload className="w-5 h-5" />
                  <span className="text-sm">
                    {coverImage || book.coverImage ? "Change Cover" : "Upload Cover"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  JPG, PNG, or WEBP (Max 10MB)
                </p>
              </div>
            </div>
          </div>

          {/* PDF */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Book PDF (Optional)
            </label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-32 bg-red-50 rounded border border-red-200 flex flex-col items-center justify-center">
                <FileText className="w-8 h-8 text-red-600 mb-1" />
                {(pdfFile || book.pdfUrl) && (
                  <span className="text-xs text-red-600 text-center px-1">
                    {pdfFile ? pdfFile.name.substring(0, 12) + "..." : "Attached"}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <label className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg cursor-pointer transition">
                  <Upload className="w-5 h-5" />
                  <span className="text-sm">
                    {pdfFile || book.pdfUrl ? "Change PDF" : "Upload PDF File"}
                  </span>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handlePdfChange}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  PDF format (Max 50MB)
                </p>
              </div>
            </div>
          </div>

          {/* Book ID Display */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <label className="block text-sm font-medium text-blue-900 mb-2">
              Book ID
            </label>
            <div className="flex items-center justify-between">
              <code className="text-lg font-mono font-bold text-blue-700 bg-white px-4 py-2 rounded border border-blue-300">
                {bookId}
              </code>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    checked={formData.isInternational}
                    onChange={() => setFormData({ ...formData, isInternational: true })}
                  />
                  International
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    checked={!formData.isInternational}
                    onChange={() => setFormData({ ...formData, isInternational: false })}
                  />
                  Local
                </label>
              </div>
            </div>
            <p className="text-xs text-blue-600 mt-2">
              Format: [{CATEGORY_ABBREV[formData.category] || "GEN"}]-[{formData.publishedYear}]-[{String(bookSequence).padStart(3, '0')}]-[{formData.isInternational ? "I" : "L"}]
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <TextField
              label="Title *"
              value={formData.title}
              onChange={(v) => setFormData({ ...formData, title: v })}
              required
            />
            <TextField
              label="Author *"
              value={formData.author}
              onChange={(v) => setFormData({ ...formData, author: v })}
              required
            />
          </div>
                
          <div className="grid grid-cols-3 gap-4">
            <TextField
              label="Publisher"
              value={formData.publisher}
              onChange={(v) => setFormData({ ...formData, publisher: v })}
            />
            <NumberField
              label="Year"
              value={formData.publishedYear}
              onChange={(v) => setFormData({ ...formData, publishedYear: v })}
              min={1900}
              max={new Date().getFullYear() + 1}
            />
            <SelectField
              label="Type"
              value={formData.bookType}
              onChange={(v) => setFormData({ ...formData, bookType: v })}
              options={["E-Book", "Audiobook","Printed"]}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <SelectField
              label="Category"
              value={formData.category}
              onChange={(v) => setFormData({ ...formData, category: v })}
              options={[
               "Business", "Management", "Finance", "Marketing",
"Economics", "Accounting", "Entrepreneurship",  'Computer Science','Cybersecurity' ,'Engineering', 
   'Mathematics' ,
   'Social Sciences',
   'Humanities',
   'Language',
   'Medicine & Health',
   'Architecture',
   'Arts & Design'
              ]}
            />
            <NumberField
              label="Copies"
              value={formData.copies}
              onChange={(v) => setFormData({ ...formData, copies: v })}
              min={1}
            />
          </div>

          {/* ISBN with lookup button */}
          <div>
            <label className="block text-sm font-medium mb-1">ISBN</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.isbn}
                onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                placeholder="978-0-123456-78-9"
                className="flex-1 px-3 py-2 border rounded-lg"
              />
              <button
                type="button"
                onClick={handleIsbnLookup}
                disabled={isbnLoading || !formData.isbn}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  isbnLoading || !formData.isbn
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                {isbnLoading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Looking up...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Auto-Fill
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Enter ISBN and click Auto-Fill to retrieve book information
            </p>
          </div>

          <TextAreaField
            label="Description"
            value={formData.description}
            onChange={(v) => setFormData({ ...formData, description: v })}
            rows={3}
            placeholder="Brief description of the book..."
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) =>
                setFormData({ ...formData, featured: e.target.checked })
              }
              className="w-4 h-4"
            />
            <label className="text-sm font-medium">
              Featured (Show in carousel)
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 px-6 py-3 rounded-lg flex items-center justify-center gap-2 text-white ${
                isSubmitting
                  ? "bg-orange-400 cursor-not-allowed"
                  : "bg-orange-600 hover:bg-orange-700"
              }`}
            >
              <Edit className="w-5 h-5" />
              {isSubmitting ? "Updating…" : "Update Book"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className={`px-6 py-3 border border-gray-300 rounded-lg ${
                isSubmitting ? "opacity-60 cursor-not-allowed" : "hover:bg-gray-50"
              }`}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ---------- Detail Modal ---------- */
const BookDetailModal: React.FC<{
  book: BookRecord;
  allBooks: BookRecord[];
  onClose: () => void;
}> = ({ book, allBooks, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Book Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          {book.coverImage && (
            <div className="flex justify-center mb-4">
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-48 h-64 object-cover rounded-lg shadow-lg"
              />
            </div>
          )}
          <div>
            <h3 className="text-xl font-bold">{book.title}</h3>
            <p className="text-gray-600">{book.author}</p>
          </div>
          {/* Book ID Display */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <span className="text-sm font-medium text-blue-900">Book ID:</span>
            <code className="block mt-1 text-lg font-mono font-bold text-blue-700">
              {generateBookId(
                book.category, 
                book.publishedYear || new Date().getFullYear(),
                getBookSequence(allBooks, book),
                book.isInternational ?? true
              )}
            </code>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Info label="Category" value={book.category} />
            <Info label="Publisher" value={book.publisher || "N/A"} />
            <Info label="Year" value={book.publishedYear || "N/A"} />
            <Info label="Type" value={book.bookType || "Printed"} />
            <Info label="ISBN" value={book.isbn || "N/A"} />
            <Info label="Total Copies" value={book.copies} />
            <Info label="Available" value={book.availableCopies} />
            <Info label="Featured" value={book.featured ? "Yes" : "No"} />
          </div>
          {book.description && (
            <div>
              <span className="text-sm text-gray-600">Description:</span>
              <p className="text-gray-800 mt-1">{book.description}</p>
            </div>
          )}
          {book.pdfUrl && (
            <div className="pt-4">
              <a
                href={book.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
              >
                <Download className="w-5 h-5" />
                View PDF
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ---------- Small field components ---------- */
const TextField: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
}> = ({ label, value, onChange, required, placeholder }) => (
  <div>
    <label className="block text-sm font-medium mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border rounded-lg"
      placeholder={placeholder}
      required={required}
    />
  </div>
);

const NumberField: React.FC<{
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}> = ({ label, value, onChange, min, max }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value))}
      min={min}
      max={max}
      className="w-full px-3 py-2 border rounded-lg"
    />
  </div>
);

const SelectField: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}> = ({ label, value, onChange, options }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border rounded-lg"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

const Info: React.FC<{ label: string; value: React.ReactNode }> = ({
  label,
  value,
}) => (
  <div>
    <span className="text-sm text-gray-600">{label}:</span>
    <p className="font-medium">{value}</p>
  </div>
);

export default BookManagement;