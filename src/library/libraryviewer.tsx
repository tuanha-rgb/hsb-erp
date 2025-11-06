import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Book, BookOpen, Search, Filter, X, ChevronDown, ChevronRight,
  Download, Eye, Grid, List, ArrowLeft, ChevronLeft,
  TrendingUp, Users, ZoomIn, ZoomOut, Columns, Square, Menu, BookmarkCheck,
} from 'lucide-react';

import { catalogues, type BookRecord, type CatalogueCategory, type BookType } from './bookdata';
import { getFileUrl } from './googledrive';
import ePub from 'epubjs';
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist';
import pdfjsWorkerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { bookService, type Book as FirebaseBook } from '../firebase/book.service';
import { thesisService, type Thesis as FirebaseThesis } from '../firebase/thesis.service';

GlobalWorkerOptions.workerSrc = pdfjsWorkerSrc;

// Local Thesis type for library viewer (simplified)
export interface LibraryThesis {
  id: string;
  title: string;
  student: {
    id: string;
    name: string;
  };
  level: "bachelor" | "master" | "phd";
  program: string;
  academicYear: string; // Keep as string for consistency
  category: string;
  keywords: string[];
  abstract: string;
  status: "draft" | "submitted" | "under_review" | "approved" | "rejected" | "published";
  submittedDate: string;
  approvedDate?: string;
  pdfUrl?: string;
  pages?: number;
  plagiarismScore?: number;
  grade?: string;
}

type ViewMode = 'grid' | 'list';
type ContentType = 'books' | 'theses';
type ReadingItem = BookRecord | LibraryThesis;

interface CarouselSlide {
  id: string;
  title: string;
  description: string;
  image: string;
  badge?: string;
  action?: string;
  color: string;
}

// AFTER  
const FloatingCarousel: React.FC<{ 
  onSlideClick?: (slideId: string) => void;
  onBookClick?: (bookId: string) => void;
  setReadingItem?: (item: ReadingItem | null) => void;
  setPreviewItem?: (item: ReadingItem | null) => void;  // ADD THIS
}> = ({ onSlideClick, onBookClick, setReadingItem, setPreviewItem }) => {  // ADD setPreviewItem here
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [featuredBooks, setFeaturedBooks] = useState<FirebaseBook[]>([]);
  const [carouselSlides, setCarouselSlide] = useState<CarouselSlide[]>([]);
const [showPreview, setShowPreview] = useState(false);
const [previewBook, setPreviewBook] = useState<FirebaseBook | null>(null);
  useEffect(() => {
    loadFeaturedBooks();
  }, []);

  const loadFeaturedBooks = async () => {
    try {
      const featured = await bookService.getFeaturedBooks();
      const slides: CarouselSlide[] = featured.map((book, index) => ({
        id: book.id || `featured-${index}`,
        title: book.title,
        description: book.description || `By ${book.author}`,
        image: book.coverImage || 'https://via.placeholder.com/400x600/667eea/ffffff?text=' + encodeURIComponent(book.title),
        badge: 'FEATURED',
        action: 'View Book',
        color: ['from-blue-500 to-blue-600', 'from-purple-500 to-purple-600', 'from-green-500 to-green-600'][index % 3]
      }));
      setCarouselSlide(slides);
      setFeaturedBooks(featured);
    } catch (error) {
      console.error('Error loading featured books:', error);
    }
  };

  useEffect(() => {
    if (!isAutoPlaying || carouselSlides.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, carouselSlides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
    setIsAutoPlaying(false);
  };

  const handleViewBook = (slideId: string) => {
    const book = featuredBooks.find(b => b.id === slideId);
    if (book && setReadingItem) {
      const bookRecord: BookRecord = {
  id: book.id!,
  isbn: book.isbn || '',
  title: book.title,
  authors: [book.author],
  publisher: book.publisher || 'Unknown',
  publisherCode: 'UNKN',
  bookType: (book.bookType as BookType) || 'textbook',
  catalogue: book.category as CatalogueCategory,
  
  // Optional fields
  publicationYear: book.publishedYear,
  pages: 0,
  subjects: [book.category],
  totalCopies: book.copies,
  availableCopies: book.availableCopies,
  rating: 0,
  firebaseStoragePath: book.pdfUrl,
  fileType: book.pdfUrl ? 'pdf' : undefined
};
      setReadingItem(bookRecord);
    } else if (onBookClick) {
      onBookClick(slideId);
    } else {
      onSlideClick?.(slideId);
    }
  };

  if (carouselSlides.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-2xl shadow-2xl h-[400px] bg-gradient-to-r from-gray-400 to-gray-500 flex items-center justify-center">
        <p className="text-white text-lg">Loading featured books...</p>
      </div>
    );
  }
  const handlePreview = (e: React.MouseEvent, slideId: string) => {
  e.stopPropagation();
  const book = featuredBooks.find(b => b.id === slideId);
  if (book) {
    setPreviewBook(book);
    setShowPreview(true);
  }
};
  const slide = carouselSlides[currentSlide];

  return (
    <div className="relative overflow-hidden rounded-2xl shadow-2xl h-[400px] group">
      <div className={`absolute inset-0 bg-gradient-to-r ${slide.color} transition-all duration-700`} />
      <div className="relative h-full flex items-center justify-between px-12">
        <div className="flex-1 text-white z-10">
          {slide.badge && (
            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold mb-4">
              {slide.badge}
            </span>
          )}
          <h2 className="text-4xl font-bold mb-4 drop-shadow-lg">{slide.title}</h2>
              <p className="text-lg mb-6 text-white/90 max-w-md line-clamp-3">
                {slide.description.length > 150 
                  ? `${slide.description.substring(0, 150)}...` 
                  : slide.description}
              </p>          
              {slide.action && (
                        <div className="flex gap-3">
              <button 
                onClick={(e) => handlePreview(e, slide.id)}
                className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-lg font-semibold hover:bg-white/30 transition-colors"
              >
                Preview
              </button>
              {slide.action && (
                <button 
                  onClick={() => handleViewBook(slide.id)}
                  className="px-6 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
                >
                  {slide.action}
                </button>
              )}
            </div>
          )}
        </div>
        {/* Preview Modal */}
{showPreview && previewBook && (
  <div 
    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    onClick={() => setShowPreview(false)}
  >
    <div 
      className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-auto p-6 shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">{previewBook.title}</h3>
          <p className="text-sm text-gray-600 mt-1">by {previewBook.author}</p>
        </div>
        <button 
          onClick={() => setShowPreview(false)} 
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X size={24} />
        </button>
      </div>
      
      <div className="flex gap-6 mb-6">
        <img 
          src={previewBook.coverImage || 'https://via.placeholder.com/200x300'} 
          alt={previewBook.title} 
          className="w-48 h-72 object-cover rounded-lg shadow-lg"
        />
        <div className="flex-1">
          <div className="space-y-3 text-sm">
            <div>
              <span className="font-semibold text-gray-700">ISBN:</span>
              <span className="text-gray-600 ml-2">{previewBook.isbn || 'N/A'}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Publisher:</span>
              <span className="text-gray-600 ml-2">{previewBook.publisher || 'Unknown'}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Year:</span>
              <span className="text-gray-600 ml-2">{previewBook.publishedYear || 'N/A'}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Category:</span>
              <span className="inline-block ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                {previewBook.category}
              </span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Available:</span>
              <span className={`ml-2 font-medium ${previewBook.availableCopies > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {previewBook.availableCopies}/{previewBook.copies}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
        <p className="text-gray-700 leading-relaxed">
          {previewBook.description || 'No description available.'}
        </p>
      </div>

      <button 
        onClick={() => {
          setShowPreview(false);
          handleViewBook(previewBook.id!);
        }}
        className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
      >
        Open & Read Book
      </button>
    </div>
  </div>
)}
        <div className="relative">
          {slide.image.startsWith('http') || slide.image.startsWith('https') || slide.image.startsWith('/') ? (
            <img 
              src={slide.image} 
              alt={slide.title}
              className="w-64 h-96 object-cover rounded-lg shadow-2xl opacity-90 group-hover:opacity-100 transition-opacity"
            />
          ) : (
            <div className="text-9xl opacity-20 group-hover:opacity-30 transition-opacity">
              {slide.image}
            </div>
          )}
        </div>
      </div>
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all opacity-0 group-hover:opacity-100"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all opacity-0 group-hover:opacity-100"
      >
        <ChevronRight size={24} />
      </button>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {carouselSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

type PageMode = 'single' | 'dual';
interface Bookmark { page: number; note?: string; timestamp: number; }
interface ReadingViewProps { item: ReadingItem; onClose: () => void; }

const isBook = (item: ReadingItem): item is BookRecord => 'isbn' in item;
const isThesis = (item: ReadingItem): item is LibraryThesis => 'student' in item;

const ReadingView: React.FC<ReadingViewProps> = ({ item, onClose }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState(1.1);
  const [pageMode, setPageMode] = useState<PageMode>('single');
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [bookmarkNote, setBookmarkNote] = useState('');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvas2Ref = useRef<HTMLCanvasElement>(null);
  const epubContainerRef = useRef<HTMLDivElement>(null);
  const pdfDocRef = useRef<any>(null);
  const epubBookRef = useRef<any>(null);
  const renditionRef = useRef<any>(null);
  const viewTrackedRef = useRef<boolean>(false); // Prevent duplicate view tracking

  // Determine file type and availability
  const fileKind: 'pdf' | 'epub' | null =
    (isBook(item) && item.firebaseStoragePath && item.fileType
      ? (item.fileType as 'pdf' | 'epub')
      : (isThesis(item) && item.pdfUrl ? 'pdf' : null));
  
  const hasFile = fileKind !== null;
  const storageKey = `bookmarks_${item.id}`;

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try { setBookmarks(JSON.parse(saved)); } 
      catch (e) { console.error('Failed to load bookmarks:', e); }
    }
  }, [storageKey]);

  useEffect(() => {
    if (bookmarks.length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(bookmarks));
    }
  }, [bookmarks, storageKey]);

  useEffect(() => {
    if (!hasFile) {
      setLoading(false);
      return;
    }
    viewTrackedRef.current = false; // Reset tracking flag for new item
    loadDocument();
    return () => {
      if (pdfDocRef.current) { pdfDocRef.current.destroy(); pdfDocRef.current = null; }
      if (renditionRef.current) { renditionRef.current.destroy(); renditionRef.current = null; }
      if (epubBookRef.current) { epubBookRef.current.destroy(); epubBookRef.current = null; }
    };
  }, [item, hasFile]);

  const loadDocument = async () => {
    // Check if item has a valid file source
    const hasValidSource = 
      (isBook(item) && item.fileType && (item.firebaseStoragePath || item.driveFileId)) ||
      (isThesis(item) && item.pdfUrl);
    
    if (!hasValidSource) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      let fileUrl: string | null = null;
      let fileType: 'pdf' | 'epub' = 'pdf';
      
      // Handle books
      if (isBook(item)) {
        if (item.firebaseStoragePath) {
          fileUrl = item.firebaseStoragePath;
        } else if (item.driveFileId) {
          fileUrl = await getFileUrl(item.driveFileId);
        }
        fileType = item.fileType!;
      }
      
      // Handle theses (always PDF)
      if (isThesis(item) && item.pdfUrl) {
        fileUrl = item.pdfUrl;
        fileType = 'pdf';
      }
      
      if (!fileUrl) throw new Error('No file source available');
      
      if (fileType === 'pdf') await loadPDF(fileUrl);
      
 ;
      
      // Track view in Firebase (increment views counter) - only once per item
      if (!viewTrackedRef.current) {
        viewTrackedRef.current = true;
        try {
          if (isBook(item)) {
            // For books, find Firebase book by matching title/author
            const allBooks = await bookService.getAllBooks();
            const firebaseBook = allBooks.find(b => 
              b.title === item.title && b.author === item.authors[0]
            );
            
            if (firebaseBook?.id) {
              await bookService.incrementViews(firebaseBook.id);
            }
          } else if (isThesis(item)) {
            // For theses, find by title and student name
            const allTheses = await thesisService.getAllTheses();
            const firebaseThesis = allTheses.find(t => 
              t.title === item.title && t.studentName === item.student.name
            );
            
            if (firebaseThesis?.id) {
              await thesisService.incrementViews(firebaseThesis.id);
            }
          }
        } catch (viewErr) {
          // Don't block document viewing if view tracking fails
          console.error('Failed to track view:', viewErr);
        }
      }
    } catch (err) {
      console.error('Document load error:', err);
      setError('Failed to load document: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  
const getNumPages = () => pdfDocRef.current?.numPages ?? totalPages;

// ---- loadPDF: set ref, capture numPages, then render
// ============================================
// CORRECTED PDF RENDERING CODE
// ============================================

const loadPDF = async (url: string) => {
  const loadingTask = getDocument({ url, withCredentials: false });
  const pdf = await loadingTask.promise;
  pdfDocRef.current = pdf;

  const numPages = pdf.numPages;
  setTotalPages(numPages);
  setCurrentPage(1);

  // Only call once with a small delay
  setTimeout(() => {
    renderPDFPages(1);
  }, 100);
};

// ---- render the spread (single/dual)
const renderPDFPages = async (pageNum: number) => {
  if (!pdfDocRef.current) return;

  const numPages = pdfDocRef.current.numPages;
  
  // Validate page number
  const validPageNum = Math.max(1, Math.min(pageNum, numPages));

  // Clear first canvas before rendering
  if (canvasRef.current) {
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    await renderPDFPage(validPageNum, canvasRef.current);
  }

  // Handle second canvas for dual mode
  if (pageMode === 'dual' && canvas2Ref.current) {
    const ctx = canvas2Ref.current.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas2Ref.current.width, canvas2Ref.current.height);
    }
    
    if (validPageNum < numPages) {
      await renderPDFPage(validPageNum + 1, canvas2Ref.current);
    }
  }

  setCurrentPage(validPageNum);
};

// ---- render a single page
const renderPDFPage = async (
  pageNum: number,
  canvas: HTMLCanvasElement
) => {
  if (!pdfDocRef.current || !canvas) return;

  const numPages = pdfDocRef.current.numPages;
  if (pageNum < 1 || pageNum > numPages) return;

  try {
    const page = await pdfDocRef.current.getPage(pageNum);
    
    // Use device pixel ratio for sharper rendering
    // Use device pixel ratio for high-DPI displays
const devicePixelRatio = window.devicePixelRatio || 2;
const viewport = page.getViewport({ scale: scale * devicePixelRatio });

// Set canvas internal resolution (high-res)
canvas.width = viewport.width;
canvas.height = viewport.height;

// Set canvas display size (CSS size)
canvas.style.width = `${viewport.width / devicePixelRatio}px`;
canvas.style.height = `${viewport.height / devicePixelRatio}px`;

    const context = canvas.getContext('2d');
    if (!context) return;

  

    await page.render({ 
      canvasContext: context, 
      viewport,
      intent: 'display' // Better rendering quality
    }).promise;
  } catch (error) {
    console.error(`Error rendering page ${pageNum}:`, error);
  }
};

// ---- Add useEffect for scale/pageMode changes
useEffect(() => {
  if (fileKind === 'pdf' && pdfDocRef.current && currentPage > 0) {
    renderPDFPages(currentPage);
  }
}, [scale, pageMode]);

// ---- Navigation handlers (remove async, not needed)
const handlePrevPage = () => {
  const step = pageMode === 'dual' ? 2 : 1;
  if (currentPage <= 1) return;
  const newPage = Math.max(1, currentPage - step);
  
  if (fileKind === 'pdf') {
    renderPDFPages(newPage);
  } else if (renditionRef.current) {
    renditionRef.current.prev();
  }
};

const handleNextPage = () => {
  const step = pageMode === 'dual' ? 2 : 1;
  if (currentPage >= totalPages) return;
  const newPage = currentPage + step;
  
  if (fileKind === 'pdf') {
    renderPDFPages(newPage);
  } else if (renditionRef.current) {
    renditionRef.current.next();
  }
};

// ---- Zoom handlers (simplified)
const handleZoomIn = () => {
  if (fileKind === 'pdf') {
    setScale(prev => Math.min(prev + 0.1, 3));
  }
};

const handleZoomOut = () => {
  if (fileKind === 'pdf') {
    setScale(prev => Math.max(prev - 0.1, 0.5));
  }
};

// ---- Toggle page mode
const togglePageMode = async () => {
  const newMode = pageMode === 'single' ? 'dual' : 'single';
  setPageMode(newMode);
  

};

  const addBookmark = () => {
    const newBookmark: Bookmark = {
      page: currentPage,
      note: bookmarkNote.trim() || undefined,
      timestamp: Date.now()
    };
    setBookmarks(prev => [...prev, newBookmark].sort((a, b) => a.page - b.page));
    setBookmarkNote('');
  };

  const removeBookmark = (index: number) => {
    setBookmarks(prev => prev.filter((_, i) => i !== index));
  };

  const goToBookmark = async (page: number) => {
    if (fileKind === 'pdf') {
      await renderPDFPages(page);
    } else if (renditionRef.current && epubBookRef.current) {
      const cfi = epubBookRef.current.locations.cfiFromPercentage(page / totalPages);
      await renditionRef.current.display(cfi);
    }
    setShowBookmarks(false);
  };

  const isBookmarked = (page: number) => bookmarks.some(b => b.page === page);

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      <div className="border-b border-gray-200 p-3 flex items-center justify-between bg-white">
        <button onClick={onClose} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
          <ArrowLeft size={20} />
          <span>Back to Library</span>
        </button>
        <div className="flex items-center gap-3">
          {hasFile && totalPages > 0 && (
            <span className="text-sm text-gray-500">
              Page {currentPage}{pageMode === 'dual' && currentPage < totalPages && `-${currentPage + 1}`}{' / '}{totalPages}
            </span>
          )}
          {fileKind === 'pdf' && hasFile && (
            <button onClick={togglePageMode} className={`p-2 rounded hover:bg-gray-100 ${pageMode === 'dual' ? 'bg-blue-50 text-blue-600' : ''}`}>
              {pageMode === 'single' ? <Columns size={18} /> : <Square size={18} />}
            </button>
          )}
          <button onClick={() => setShowBookmarks(!showBookmarks)} className={`p-2 rounded hover:bg-gray-100 relative ${showBookmarks ? 'bg-blue-50 text-blue-600' : ''}`}>
            <Menu size={18} />
            {bookmarks.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {bookmarks.length}
              </span>
            )}
          </button>
          <button
            onClick={() => {
              if (isBookmarked(currentPage)) {
                const index = bookmarks.findIndex(b => b.page === currentPage);
                removeBookmark(index);
              } else addBookmark();
            }}
            className={`p-2 rounded hover:bg-gray-100 ${isBookmarked(currentPage) ? 'text-yellow-500' : ''}`}
          >
            <BookmarkCheck size={18} />
          </button>
          {fileKind === 'pdf' && hasFile && (
            <div className="flex items-center gap-1 border-l pl-3 ml-3">
              <button onClick={handleZoomOut} className="p-2 hover:bg-gray-100 rounded" disabled={loading}>
                <ZoomOut size={18} />
              </button>
              <span className="text-sm text-gray-600 min-w-[60px] text-center">{Math.round(scale * 100)}%</span>
              <button onClick={handleZoomIn} className="p-2 hover:bg-gray-100 rounded" disabled={loading}>
                <ZoomIn size={18} />
              </button>
            </div>
          )}
        </div>
      </div>

      {showBookmarks && (
        <div className="absolute right-0 top-16 bottom-0 w-80 bg-white border-l border-gray-200 shadow-lg z-10 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Bookmarks ({bookmarks.length})</h3>
              <button onClick={() => setShowBookmarks(false)} className="text-gray-500 hover:text-gray-700">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-2">
              <input type="text" placeholder="Add note (optional)" value={bookmarkNote}
                onChange={(e) => setBookmarkNote(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyDown={(e) => { if (e.key === 'Enter' && !isBookmarked(currentPage)) addBookmark(); }}
              />
              <button onClick={addBookmark} disabled={isBookmarked(currentPage)}
                className="w-full px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
                {isBookmarked(currentPage) ? 'Already Bookmarked' : `Bookmark Page ${currentPage}`}
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-4 space-y-2">
            {bookmarks.length === 0 ? (
              <div className="text-center text-gray-500 text-sm py-8">No bookmarks yet</div>
            ) : (
              bookmarks.map((bookmark, index) => (
                <div key={index} className="p-3 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer group"
                  onClick={() => goToBookmark(bookmark.page)}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <BookmarkCheck size={14} className="text-yellow-500" />
                        <span className="font-medium text-sm text-gray-900">Page {bookmark.page}</span>
                      </div>
                      {bookmark.note && <p className="text-xs text-gray-600 line-clamp-2">{bookmark.note}</p>}
                      <p className="text-xs text-gray-400 mt-1">{new Date(bookmark.timestamp).toLocaleDateString()}</p>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); removeBookmark(index); }}
                      className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 p-1">
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-auto bg-gray-100">
        {loading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600">Loading document...</p>
            </div>
          </div>
        )}
        {error && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md">
              <div className="text-red-600 mb-4">
                <X size={48} className="mx-auto mb-2" />
                <p className="font-semibold">Error Loading Document</p>
              </div>
              <p className="text-gray-600 text-sm mb-4">{error}</p>
              <button onClick={loadDocument} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Retry</button>
            </div>
          </div>
        )}
        {!loading && !error && hasFile && (
          <div className="max-w-7xl mx-auto py-8">
            {fileKind === 'pdf'  ? (
              <div className={`flex justify-center gap-4 ${pageMode === 'dual' ? 'flex-row' : ''}`}>
                <canvas ref={canvasRef} className="shadow-2xl bg-white" />
                {pageMode === 'dual' && currentPage < totalPages && (
                  <canvas ref={canvas2Ref} className="shadow-2xl bg-white" />
                )}
              </div>
            ) : fileKind === 'epub'  ? (
              <div className="bg-white shadow-2xl mx-auto" style={{ maxWidth: pageMode === 'dual' ? '1400px' : '900px' }}>
                <div ref={epubContainerRef} style={{ height: '800px', width: '100%' }} />
              </div>
            ) : null}
          </div>
        )}
        {!loading && !error && !hasFile && (
          <div className="max-w-4xl mx-auto px-6 py-8">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{isBook(item) ? item.title : item.title}</h1>
              <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm text-blue-800">
                   <strong>Digital content not available.</strong> This item does not have an associated digital file.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {hasFile && totalPages > 0 && !loading && !error && (
        <div className="border-t border-gray-200 p-3 flex items-center justify-center gap-4 bg-white">
          <button onClick={handlePrevPage} disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
            <ChevronLeft size={18} />Previous
          </button>
          <span className="text-sm text-gray-600">
            {currentPage}{pageMode === 'dual' && currentPage < totalPages && `-${currentPage + 1}`}{' / '}{totalPages}
          </span>
          <button onClick={handleNextPage} disabled={currentPage >= totalPages}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
            Next<ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

const LibraryViewer: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [contentType, setContentType] = useState<ContentType>('books');
  const [selectedCategory, setSelectedCategory] = useState<CatalogueCategory | 'all'>('all');
  const [selectedLevel, setSelectedLevel] = useState<'bachelor' | 'master' | 'phd' | 'all'>('all');
  const [selectedYear, setSelectedYear] = useState<number | string>('all');
  const [selectedPublisher, setSelectedPublisher] = useState<number | string>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [showCategoryBrowser, setShowCategoryBrowser] = useState(false);
  const [readingItem, setReadingItem] = useState<ReadingItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [firebaseBooks, setFirebaseBooks] = useState<FirebaseBook[]>([]);
  const [firebaseTheses, setFirebaseTheses] = useState<FirebaseThesis[]>([]);
  const [previewItem, setPreviewItem] = useState<ReadingItem | null>(null);
  
  // Load data from Firebase
  useEffect(() => { 
    loadFirebaseBooks();
    loadFirebaseTheses();
  }, []);

  const loadFirebaseBooks = async () => {
    try {
      const books = await bookService.getAllBooks();
      setFirebaseBooks(books);
    } catch (error) {
      console.error('Failed to load books:', error);
    }
  };

  const loadFirebaseTheses = async () => {
    try {
      const theses = await thesisService.getAllTheses();
      setFirebaseTheses(theses.filter(t => t.status === 'approved'));
    } catch (error) {
      console.error('Failed to load theses:', error);
    }
  };

  const isBook = (item: ReadingItem): item is BookRecord => 'isbn' in item;

const filteredContent = useMemo(() => {
  const convertedBooks: BookRecord[] = firebaseBooks.map(fb => ({
    id: fb.id!,
    title: fb.title,
    authors: [fb.author],
    isbn: fb.isbn || '',
    publisher: fb.publisher || '',
    publisherCode: fb.publisherCode || 'FB',
    bookType: (fb.bookType || 'textbook') as BookType,
    catalogue: fb.category as CatalogueCategory,
    publicationYear: fb.publishedYear,
    pages: fb.pages || 200,
    subjects: fb.subjects || [fb.category],
    totalCopies: fb.copies,
    availableCopies: fb.availableCopies,
    rating: fb.rating || 0,
    description: fb.description,
    coverImage: fb.coverImage,
    firebaseStoragePath: fb.pdfUrl,
    fileType: fb.pdfUrl ? 'pdf' : undefined
  }));

  const convertedTheses: LibraryThesis[] = firebaseTheses.map(ft => ({
    id: ft.id!,
    title: ft.title,
    student: { id: ft.studentId, name: ft.studentName },
    level: ft.level,
    program: ft.program,
    academicYear: ft.year.toString(),
    category: ft.program,
    keywords: ft.keywords,
    abstract: ft.abstract,
    status: ft.status,
    submittedDate: ft.submissionDate,
    approvedDate: ft.approvalDate,
    pdfUrl: ft.pdfUrl,
    pages: ft.pages,
    plagiarismScore: ft.plagiarismScore,
    grade: ft.grade
  }));

  let items: ReadingItem[] = contentType === 'books' ? convertedBooks : convertedTheses;

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    items = items.filter(item => {
      if (isBook(item)) {
        return item.title.toLowerCase().includes(q) ||
               item.authors.some(a => a.toLowerCase().includes(q)) ||
               item.subjects.some(s => s.toLowerCase().includes(q));
      } else {
        return item.title.toLowerCase().includes(q) ||
               item.student.name.toLowerCase().includes(q) ||
               item.keywords.some(k => k.toLowerCase().includes(q));
      }
    });
  }

  if (selectedCategory !== 'all' && contentType === 'books') {
  items = items.filter(item => isBook(item) && item.catalogue === selectedCategory);
}

if (selectedLevel !== 'all' && contentType === 'theses') {
  items = items.filter(item => !isBook(item) && item.level === selectedLevel);
}

  if (selectedYear !== 'all') {
  items = items.filter(item => {
    if (contentType === 'books' && isBook(item)) {
      return item.publicationYear.toString() === selectedYear;
    } else if (contentType === 'theses' && !isBook(item)) {
      return item.academicYear.toString() === selectedYear;
    }
    return true;
  });
}

  if (selectedPublisher !== 'all') {
    items = items.filter(item => {
      if (contentType === 'books' && isBook(item)) {
        return item.publisher === selectedPublisher;
      } else if (contentType === 'theses' && !isBook(item)) {
        return item.program === selectedPublisher;
      }
      return true;
    });
  }

  return items;
}, [searchQuery, contentType, selectedCategory, selectedYear, selectedPublisher, firebaseBooks, firebaseTheses]);
  const totalPages = Math.ceil(filteredContent.length / itemsPerPage);

const paginatedContent = useMemo(() => {
  const start = (currentPage - 1) * itemsPerPage;
  return filteredContent.slice(start, start + itemsPerPage);
}, [filteredContent, currentPage, itemsPerPage]);

  

  useEffect(() => { setCurrentPage(1); }, [searchQuery, contentType, selectedCategory, selectedYear, selectedPublisher, itemsPerPage]);

  const categoryStats = useMemo(() => {
    const stats: Record<string, number> = {};
    catalogues.forEach(cat => {
      stats[cat] = firebaseBooks.filter(book => book.category === cat).length;
    });
    return stats;
  }, [firebaseBooks]);

  const availableYears = useMemo(() => {
    const years = firebaseBooks.map(b => b.publishedYear).filter(y => y);
    return [...new Set(years)].sort((a, b) => b - a);
  }, [firebaseBooks]);

  const availablePublishers = useMemo(() => {
    const publishers = firebaseBooks.map(b => b.publisher).filter(p => p);
    return [...new Set(publishers)].sort();
  }, [firebaseBooks]);

  const stats = useMemo(() => ({
    totalBooks: firebaseBooks.length,
    totalTheses: firebaseTheses.length,
    availableCopies: firebaseBooks.reduce((sum, b) => sum + b.availableCopies, 0),
    digitalBooks: firebaseBooks.filter(b => b.pdfUrl).length,
  }), [firebaseBooks, firebaseTheses]);

  if (readingItem) {
    return <ReadingView item={readingItem} onClose={() => setReadingItem(null)} />;
  }

const hasActiveFilters = selectedCategory !== 'all' || selectedYear !== 'all' || selectedPublisher !== 'all' || selectedLevel !== 'all';

const clearAllFilters = () => {
  setSelectedCategory('all');
  setSelectedLevel('all');
  setSelectedYear('all');
  setSelectedPublisher('all');
  setSearchQuery('');
};

  return (
    <div className="h-full overflow-auto bg-gray-50">
      <FloatingCarousel setReadingItem={setReadingItem} setPreviewItem={setPreviewItem} />
      <div className="bg-white border-b border-gray-200 px-3 py-3">
        <div className="flex items-center justify-between mb-3">
          <h1 className="px-9 text-2xl font-bold text-gray-900">HSB Digital Library</h1>
          <div className="flex items-center gap-2">
            <button onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}>
              <Grid size={20} />
            </button>
            <button onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}>
              <List size={20} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-3">
  <div className="flex-1 relative">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
    <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
      placeholder={contentType === 'books' ? "Search books..." : "Search theses..."}
      className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
    {searchQuery && (
      <button onClick={() => setSearchQuery('')}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
        <X size={18} />
      </button>
    )}
  </div>
  
  <select 
    value={itemsPerPage} 
    onChange={(e) => setItemsPerPage(Number(e.target.value))}
    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    <option value={10}>10 per page </option>
    <option value={20}>20 per page </option>
    <option value={50}>50 per page </option>
  </select>
  
  <button onClick={() => setShowFilters(!showFilters)}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
      showFilters ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-300 hover:bg-gray-50'
    }`}>
    <Filter size={18} />Filters
  </button>
</div>

        <div className="flex items-center gap-2 mb-3">
  <button onClick={() => setContentType('books')}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
      contentType === 'books' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
    }`}>
    <Book size={18} />Books ({firebaseBooks.length})
  </button>
  <button onClick={() => setContentType('theses')}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
      contentType === 'theses' ? 'bg-green-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
    }`}>
    <BookOpen size={18} />Theses ({firebaseTheses.length})
  </button>

  {hasActiveFilters && (
    <>
      {selectedCategory !== 'all' && (
        <span className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm flex items-center gap-2">
          {selectedCategory}
          <X size={14} className="cursor-pointer" onClick={() => setSelectedCategory('all')} />
        </span>
      )}
      {selectedYear !== 'all' && (
        <span className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm flex items-center gap-2">
          {selectedYear}
          <X size={14} className="cursor-pointer" onClick={() => setSelectedYear('all')} />
        </span>
      )}
      {selectedPublisher !== 'all' && (
        <span className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm flex items-center gap-2">
          {selectedPublisher}
          <X size={14} className="cursor-pointer" onClick={() => setSelectedPublisher('all')} />
        </span>
      )}
      
      <button onClick={clearAllFilters}
        className="text-sm text-blue-600 hover:text-blue-800 font-medium">
        Clear All Filters
      </button>
    </>
  )}
</div>
      </div>

      <div className="p-3">
        
{showFilters && (
  <div className="bg-white rounded-lg border p-4 mb-3">
    <div className="flex justify-between mb-3">
      <h3 className="font-semibold">Filters</h3>
      <button onClick={() => { 
        setSelectedCategory('all'); 
        setSelectedYear('all');
        setSelectedPublisher('all');
        setSearchQuery(''); 
      }}
        className="text-sm text-blue-600 hover:text-blue-800">Clear All</button>
    </div>
    
    {contentType === 'books' && (
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value as any)}
            className="w-full px-3 py-2 border rounded-lg">
            <option value="all">All Categories</option>
            {catalogues.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Year</label>
          <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg">
            <option value="all">All Years</option>
            {Array.from(new Set(firebaseBooks.map(b => b.publishedYear))).sort((a, b) => b - a).map(year => 
              <option key={year} value={year}>{year}</option>
            )}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Publisher</label>
          <select value={selectedPublisher} onChange={(e) => setSelectedPublisher(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg">
            <option value="all">All Publishers</option>
            {Array.from(new Set(firebaseBooks.map(b => b.publisher).filter(Boolean))).sort().map(pub => 
              <option key={pub} value={pub}>{pub}</option>
            )}
          </select>
        </div>
      </div>
    )}

    {contentType === 'theses' && (
      <div className="space-y-3">
         <div>
      <label className="block text-sm font-medium mb-2">Year</label>
      <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}
        className="w-full px-3 py-2 border rounded-lg">
        <option value="all">All Years</option>
        {Array.from(new Set(firebaseTheses.map(t => t.year))).sort((a, b) => b - a).map(year => 
          <option key={year} value={year}>{year}</option>
        )}
      </select>
    </div>

        <div>
      <label className="block text-sm font-medium mb-2">Program</label>
      <select value={selectedPublisher} onChange={(e) => setSelectedPublisher(e.target.value)}
        className="w-full px-3 py-2 border rounded-lg">
        <option value="all">All Programs</option>
        {Array.from(new Set(firebaseTheses.map(t => t.program).filter(Boolean))).sort().map(prog => 
          <option key={prog} value={prog}>{prog}</option>
        )}
      </select>
    </div>

        <div>
      <label className="block text-sm font-medium mb-2">Level</label>
      <select value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value as any)}
        className="w-full px-3 py-2 border rounded-lg">
        <option value="all">All Levels</option>
        <option value="bachelor">Bachelor</option>
        <option value="master">Master</option>
        <option value="phd">PhD</option>
      </select>
    </div>
      </div>
    )}
  </div>
)}

        {contentType === 'books' && (
          <div className="mb-3">
            <div className="flex justify-between items-center ">
              <div
                className="px-3 flex items-center gap-2 cursor-pointer select-none hover:bg-gray-50 rounded-lg transition-colors mb-3"
                onClick={() => setShowCategoryBrowser(!showCategoryBrowser)}
                title={showCategoryBrowser ? "Collapse categories" : "Expand categories"}
              >
                {showCategoryBrowser ? (
                  <ChevronDown size={20} className="text-gray-600" />
                ) : (
                  <ChevronRight size={20} className="text-gray-600" />
                )}

                <h2 className="text-xl font-bold">Browse by Category</h2>

                {!showCategoryBrowser && (
                  <span className="text-sm text-gray-500">
                    ({catalogues.length} categories)
                  </span>
                )}
              </div>

              <div className="px-3 flex gap-2">
                <button onClick={() => setSelectedCategory('all')}
                  className="font-bold text-blue-600 hover:text-blue-800">View All</button>
              </div>
            </div>
            
            <div 
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                showCategoryBrowser ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 px-6">
                {catalogues.map((cat) => (
                  <button key={cat} onClick={() => {
                    setSelectedCategory(cat);
                  }}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      selectedCategory === cat ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}>
                    <div className="text-sm font-semibold mb-1 line-clamp-2">{cat}</div>
                    <div className="text-xs text-gray-500">{categoryStats[cat] || 0} books</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

       {viewMode === 'grid' ? (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
    {paginatedContent.map((item) => (
      <div key={item.id} className="bg-white rounded-lg border p-4 hover:shadow-lg cursor-pointer transition-shadow"
        onClick={() => setPreviewItem(item)}>
        
        <h3 className="font-semibold mb-2 line-clamp-2 text-gray-900 min-h-[2.5rem]">{item.title}</h3>
        
        <div className="flex gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-600 mb-2 line-clamp-1">
              {isBook(item) ? item.authors.join(', ') : item.student.name}
            </p>
            
            <div className="mb-2">
              <span className="inline-block px-2 py-1 text-xs rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                {isBook(item) ? item.catalogue : item.program}
              </span>
            </div>
            
            {isBook(item) ? (
              <div className="space-y-1">
                <div className="text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Book size={12} />
                    {item.pages} pages • {item.publicationYear} • {item.fileType ? 'eBook' : 'Print'}
                  </span>
                </div>
                <div className="text-xs text-gray-600 truncate pt-1 border-t">
                  {item.publisher}
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="text-xs text-gray-500">
                  {item.academicYear} • {item.pages || 0} pages
                </div>
                <div className="flex justify-between items-center text-xs pt-1 border-t">
                  <span className={`px-2 py-1 rounded font-medium ${
                    item.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>{item.status}</span>
                  {item.pdfUrl && (
                    <span className="text-green-600 font-medium">PDF</span>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {isBook(item) && item.coverImage && (
            <div className="w-20 h-28 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
              <img 
                src={item.coverImage} 
                alt={item.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).parentElement!.style.display = 'none';
                }}
              />
            </div>
          )}
        </div>
      </div>
    ))}
  </div>
) : (
          <div className="bg-white rounded-lg border overflow-hidden">
            <div className="bg-gray-50 border-b px-4 py-3">
              <div className="grid grid-cols-11 gap-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                <div className="col-span-4">Title / Author</div>
                <div className="col-span-1">Category</div>
                <div className="col-span-2">{contentType === 'books' ? 'Publisher' : 'Program'}</div>
                <div className="col-span-1">Year</div>
                <div className="col-span-1">Pages</div>
                <div className="col-span-1">{contentType === 'books' ? 'Available' : 'Status'}</div>
                <div className="col-span-1">Format</div>
              </div>
            </div>
            
            <div className="divide-y">
              {paginatedContent.map((item) => (
                <div key={item.id} 
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => setPreviewItem(item)}>
                  <div className="grid grid-cols-11 gap-4 items-center">
                    <div className="col-span-4 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-overflow text-sm">{item.title}</h3>
                      <p className="text-xs text-gray-600 truncate">
                        {isBook(item) ? item.authors.join(', ') : item.student.name}
                      </p>
                    </div>
                    
                    <div className="col-span-1">
                      <span className="inline-block px-2 py-1 text-xs rounded-md bg-blue-50 text-blue-700 border border-blue-200 truncate max-w-full">
                        {isBook(item) ? item.catalogue : item.program}
                      </span>
                    </div>
                    
                    <div className="col-span-2">
                      <span className="text-sm text-gray-700 truncate block">
                        {isBook(item) ? item.publisher : item.program}
                      </span>
                      {isBook(item) && item.publisherCode && (
                        <span className="text-xs text-gray-500">({item.publisherCode})</span>
                      )}
                    </div>
                    
                    <div className="col-span-1">
                      <span className="text-sm text-gray-700">
                        {isBook(item) ? item.publicationYear : item.academicYear.split('-')[1]}
                      </span>
                    </div>
                    
                    <div className="col-span-1">
                      <span className="text-sm text-gray-700">
                        {item.pages || '-'}
                      </span>
                    </div>
                    
                    <div className="col-span-1">
                      {isBook(item) ? (
                        <div className="text-sm">
                          <span className={`font-medium ${
                            item.availableCopies > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {item.availableCopies}
                          </span>
                          <span className="text-gray-500">/{item.totalCopies}</span>
                        </div>
                      ) : (
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          item.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {item.status}
                        </span>
                      )}
                    </div>
                    
                    <div className="col-span-1">
                      {isBook(item) ? (
                        item.fileType ? (
                          <span className="px-2 py-1 rounded text-xs font-medium bg-green-50 text-green-700 uppercase">
                            {item.fileType}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )
                      ) : (
                        item.pdfUrl ? (
                          <span className="px-2 py-1 rounded text-xs font-medium bg-green-50 text-green-700">
                            PDF
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )
                      )}
                    </div>
                  </div>
                  
                  {isBook(item) && (
                    <div className="grid grid-cols-12 gap-4 mt-2">
                      <div className="col-span-1"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {filteredContent.length === 0 && (
          <div className="text-center py-12">
            <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">No items found</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-3 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredContent.length)} of {filteredContent.length}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm border rounded hover:bg-gray-50 disabled:opacity-50">First</button>
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm border rounded hover:bg-gray-50 disabled:opacity-50">
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum = i + 1;
                if (totalPages > 5) {
                  if (currentPage <= 3) pageNum = i + 1;
                  else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                  else pageNum = currentPage - 2 + i;
                }
                return (
                  <button key={pageNum} onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1.5 text-sm border rounded ${
                      currentPage === pageNum ? 'bg-blue-600 text-white' : 'hover:bg-gray-50'
                    }`}>{pageNum}</button>
                );
              })}
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-sm border rounded hover:bg-gray-50 disabled:opacity-50">
                <ChevronRight size={16} />
              </button>
              <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-sm border rounded hover:bg-gray-50 disabled:opacity-50">Last</button>
            </div>
          </div>
        )}
      </div>

      {/* PREVIEW MODAL */}
      {previewItem && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewItem(null)}
        >
          <div 
            className="bg-white rounded-xl max-w-3xl w-full max-h-[85vh] overflow-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-start z-10">
              <div className="flex-1 pr-4">
                <h3 className="text-2xl font-bold text-gray-900">{previewItem.title}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {isBook(previewItem) ? `by ${previewItem.authors.join(', ')}` : `by ${previewItem.student.name}`}
                </p>
              </div>
              <button onClick={() => setPreviewItem(null)} className="text-gray-500 hover:text-gray-700 p-1">
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              {isBook(previewItem) ? (
                <div>
                  <div className="flex gap-6 mb-6">
                    {previewItem.coverImage && (
                      <img src={previewItem.coverImage} alt={previewItem.title} 
                        className="w-48 h-72 object-cover rounded-lg shadow-lg flex-shrink-0" />
                    )}
                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-xs font-semibold text-gray-500 uppercase block mb-1">ISBN</span>
                          <span className="text-gray-900">{previewItem.isbn || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-gray-500 uppercase block mb-1">Publisher</span>
                          <span className="text-gray-900">{previewItem.publisher}</span>
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-gray-500 uppercase block mb-1">Year</span>
                          <span className="text-gray-900">{previewItem.publicationYear || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-gray-500 uppercase block mb-1">Pages</span>
                          <span className="text-gray-900">{previewItem.pages || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-gray-500 uppercase block mb-1">Category</span>
                          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                            {previewItem.catalogue}
                          </span>
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-gray-500 uppercase block mb-1">Availability</span>
                          <span className={`font-medium ${previewItem.availableCopies > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {previewItem.availableCopies}/{previewItem.totalCopies}
                          </span>
                        </div>
                      </div>
                      {previewItem.fileType && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <span className="text-sm font-medium text-green-700">
                            📖 Available as {previewItem.fileType.toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  {previewItem.description && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                      <p className="text-gray-700 leading-relaxed text-sm">{previewItem.description}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                    <div>
                      <span className="text-xs font-semibold text-gray-500 uppercase block mb-1">Student</span>
                      <span className="text-gray-900">{previewItem.student.name}</span>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-gray-500 uppercase block mb-1">Level</span>
                      <span className="text-gray-900 capitalize">{previewItem.level}</span>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-gray-500 uppercase block mb-1">Program</span>
                      <span className="text-gray-900">{previewItem.program}</span>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-gray-500 uppercase block mb-1">Year</span>
                      <span className="text-gray-900">{previewItem.academicYear}</span>
                    </div>
                  </div>
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Abstract</h4>
                    <p className="text-gray-700 leading-relaxed text-sm">{previewItem.abstract}</p>
                  </div>
                  {previewItem.keywords && previewItem.keywords.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Keywords</h4>
                      <div className="flex flex-wrap gap-2">
                        {previewItem.keywords.map((kw, idx) => (
                          <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4">
              <button 
                onClick={() => {
                  setPreviewItem(null);
                  setReadingItem(previewItem);
                }}
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                disabled={!(isBook(previewItem) ? previewItem.firebaseStoragePath : previewItem.pdfUrl)}
              >
                {(isBook(previewItem) ? previewItem.firebaseStoragePath : previewItem.pdfUrl) ? '📖 Open & Read' : '⚠️ No Digital Copy'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LibraryViewer;