import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Book, BookOpen, Search, Filter, X, ChevronDown, ChevronRight,
  Star, Download, Eye, Grid, List, ArrowLeft, ChevronLeft,
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
  academicYear: string;
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

const FloatingCarousel: React.FC<{ 
  onSlideClick?: (slideId: string) => void;
  onBookClick?: (bookId: string) => void;
  setReadingItem?: (item: ReadingItem | null) => void;
}> = ({ onSlideClick, onBookClick, setReadingItem }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [featuredBooks, setFeaturedBooks] = useState<FirebaseBook[]>([]);
  const [carouselSlides, setCarouselSlide] = useState<CarouselSlide[]>([]);

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
          <p className="text-lg mb-6 text-white/90 max-w-md">{slide.description}</p>
          {slide.action && (
            <button 
              onClick={() => handleViewBook(slide.id)}
              className="px-6 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              {slide.action}
            </button>
          )}
        </div>
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
  const [scale, setScale] = useState(1.5);
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

  const hasFile = isBook(item) && (item.driveFileId || item.firebaseStoragePath) && item.fileType;
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
    loadDocument();
    return () => {
      if (pdfDocRef.current) { pdfDocRef.current.destroy(); pdfDocRef.current = null; }
      if (renditionRef.current) { renditionRef.current.destroy(); renditionRef.current = null; }
      if (epubBookRef.current) { epubBookRef.current.destroy(); epubBookRef.current = null; }
    };
  }, [item, hasFile]);

  const loadDocument = async () => {
    if (!isBook(item) || !item.fileType) return;
    try {
      setLoading(true);
      setError(null);
      
      let fileUrl: string | null = null;
      if (item.firebaseStoragePath) {
        fileUrl = item.firebaseStoragePath;
        console.log('ðŸ“š Loading Firebase PDF:', fileUrl);
      } else if (item.driveFileId) {
        console.log('ðŸ“‚ Fetching Google Drive URL');
        fileUrl = await getFileUrl(item.driveFileId);
      }
      
      if (!fileUrl) throw new Error('No file source available');
      
      if (item.fileType === 'pdf') await loadPDF(fileUrl);
      else if (item.fileType === 'epub') await loadEPUB(fileUrl);
      
      console.log('âœ… Document loaded successfully');
    } catch (err) {
      console.error('âŒ Document load error:', err);
      setError('Failed to load document: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const loadPDF = async (url: string) => {
    const loadingTask = getDocument(url);
    const pdf = await loadingTask.promise;
    pdfDocRef.current = pdf;
    setTotalPages(pdf.numPages);
    await renderPDFPages(1);
  };

  const renderPDFPages = async (pageNum: number) => {
    if (!pdfDocRef.current) return;
    if (canvasRef.current) await renderPDFPage(pageNum, canvasRef.current);
    if (pageMode === 'dual' && canvas2Ref.current && pageNum < totalPages) {
      await renderPDFPage(pageNum + 1, canvas2Ref.current);
    }
    setCurrentPage(pageNum);
  };

  const renderPDFPage = async (pageNum: number, canvas: HTMLCanvasElement) => {
    if (!pdfDocRef.current || pageNum > totalPages) return;
    const page = await pdfDocRef.current.getPage(pageNum);
    const viewport = page.getViewport({ scale });
    const context = canvas.getContext('2d');
    if (!context) return;
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    await page.render({ canvasContext: context, viewport }).promise;
  };

  const loadEPUB = async (url: string) => {
    if (!epubContainerRef.current) return;
    const book = ePub(url);
    epubBookRef.current = book;
    const rendition = book.renderTo(epubContainerRef.current, {
      width: '100%', height: '100%',
      spread: pageMode === 'dual' ? 'auto' : 'none'
    });
    renditionRef.current = rendition;
    await rendition.display();
    await book.ready;
    setTotalPages(50);
    setCurrentPage(1);
    rendition.on('relocated', (location: any) => {
      setCurrentPage(Math.floor(location.start.percentage * 50) + 1);
    });
  };

  const handlePrevPage = async () => {
    const step = pageMode === 'dual' ? 2 : 1;
    if (currentPage <= 1) return;
    const newPage = Math.max(1, currentPage - step);
    if (isBook(item) && item.fileType === 'pdf') await renderPDFPages(newPage);
    else if (renditionRef.current) await renditionRef.current.prev();
  };

  const handleNextPage = async () => {
    const step = pageMode === 'dual' ? 2 : 1;
    if (currentPage >= totalPages) return;
    const newPage = Math.min(totalPages, currentPage + step);
    if (isBook(item) && item.fileType === 'pdf') await renderPDFPages(newPage);
    else if (renditionRef.current) await renditionRef.current.next();
  };

  const handleZoomIn = async () => {
    if (isBook(item) && item.fileType === 'pdf') {
      const newScale = Math.min(scale + 0.25, 3);
      setScale(newScale);
      setTimeout(() => renderPDFPages(currentPage), 0);
    }
  };

  const handleZoomOut = async () => {
    if (isBook(item) && item.fileType === 'pdf') {
      const newScale = Math.max(scale - 0.25, 0.5);
      setScale(newScale);
      setTimeout(() => renderPDFPages(currentPage), 0);
    }
  };

  const togglePageMode = async () => {
    const newMode = pageMode === 'single' ? 'dual' : 'single';
    setPageMode(newMode);
    if (isBook(item) && item.fileType === 'pdf') {
      setTimeout(() => renderPDFPages(currentPage), 0);
    } else if (renditionRef.current && epubBookRef.current && isBook(item) && item.firebaseStoragePath) {
      renditionRef.current.destroy();
      await loadEPUB(item.firebaseStoragePath);
    }
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
    if (isBook(item) && item.fileType === 'pdf') {
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
      <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between bg-white">
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
          {isBook(item) && item.fileType === 'pdf' && hasFile && (
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
          {isBook(item) && item.fileType === 'pdf' && hasFile && (
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
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
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
            {isBook(item) && item.fileType === 'pdf' ? (
              <div className={`flex justify-center gap-4 ${pageMode === 'dual' ? 'flex-row' : ''}`}>
                <canvas ref={canvasRef} className="shadow-2xl bg-white" />
                {pageMode === 'dual' && currentPage < totalPages && (
                  <canvas ref={canvas2Ref} className="shadow-2xl bg-white" />
                )}
              </div>
            ) : isBook(item) && item.fileType === 'epub' ? (
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
                  ðŸ“– <strong>Digital content not available.</strong> This item does not have an associated digital file.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {hasFile && totalPages > 0 && !loading && !error && (
        <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-center gap-4 bg-white">
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
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [readingItem, setReadingItem] = useState<ReadingItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [firebaseBooks, setFirebaseBooks] = useState<FirebaseBook[]>([]);
  const [firebaseTheses, setFirebaseTheses] = useState<FirebaseThesis[]>([]);

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
    // Convert Firebase books to BookRecord
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

    // Convert Firebase theses to LibraryThesis
    const convertedTheses: LibraryThesis[] = firebaseTheses.map(ft => ({
      id: ft.id!,
      title: ft.title,
      student: { id: ft.studentId, name: ft.studentName },
      level: ft.level,
      program: ft.program,
      academicYear: `${ft.year - 1}-${ft.year}`,
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

    return items;
  }, [searchQuery, contentType, selectedCategory, firebaseBooks, firebaseTheses]);

  const paginatedContent = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredContent.slice(start, start + itemsPerPage);
  }, [filteredContent, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredContent.length / itemsPerPage);

  useEffect(() => { setCurrentPage(1); }, [searchQuery, contentType, selectedCategory, itemsPerPage]);

  const categoryStats = useMemo(() => {
    const stats: Record<string, number> = {};
    catalogues.forEach(cat => {
      stats[cat] = firebaseBooks.filter(book => book.category === cat).length;
    });
    return stats;
  }, [firebaseBooks]);

  const stats = useMemo(() => ({
    totalBooks: firebaseBooks.length,
    totalTheses: firebaseTheses.length,
    availableCopies: firebaseBooks.reduce((sum, b) => sum + b.availableCopies, 0),
    popularBooks: firebaseBooks.filter(b => (b.rating || 0) >= 4.5).length,
  }), [firebaseBooks, firebaseTheses]);

  if (readingItem) {
    return <ReadingView item={readingItem} onClose={() => setReadingItem(null)} />;
  }

  return (
    <div className="h-full overflow-auto bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-3 py-3">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-bold text-gray-900">Digital Library</h1>
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
          <button onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
              showFilters ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-300 hover:bg-gray-50'
            }`}>
            <Filter size={18} />Filters
          </button>
        </div>

        <div className="flex items-center gap-2">
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
        </div>
      </div>

      <div className="p-3">
        <FloatingCarousel setReadingItem={setReadingItem} />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-3">
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Total Books</span>
              <Book className="text-blue-600" size={20} />
            </div>
            <div className="text-2xl font-bold">{stats.totalBooks.toLocaleString()}</div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Theses</span>
              <BookOpen className="text-green-600" size={20} />
            </div>
            <div className="text-2xl font-bold">{stats.totalTheses.toLocaleString()}</div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Available</span>
              <BookmarkCheck className="text-purple-600" size={20} />
            </div>
            <div className="text-2xl font-bold">{stats.availableCopies.toLocaleString()}</div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Popular</span>
              <TrendingUp className="text-orange-600" size={20} />
            </div>
            <div className="text-2xl font-bold">{stats.popularBooks}</div>
          </div>
        </div>

        {showFilters && (
          <div className="bg-white rounded-lg border p-4 mb-3">
            <div className="flex justify-between mb-3">
              <h3 className="font-semibold">Filters</h3>
              <button onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
                className="text-sm text-blue-600 hover:text-blue-800">Clear All</button>
            </div>
            {contentType === 'books' && (
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value as any)}
                  className="w-full px-3 py-2 border rounded-lg">
                  <option value="all">All Categories</option>
                  {catalogues.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
            )}
          </div>
        )}

        {contentType === 'books' && (
          <div className="mb-3">
            <div className="flex justify-between items-center mb-3 px-6">
              <h2 className="text-xl font-bold">Browse by Category</h2>
              <button onClick={() => setSelectedCategory('all')}
                className="text-blue-600 hover:text-blue-800 font-medium">View All</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
              {catalogues.map((cat) => (
                <button key={cat} onClick={() => setSelectedCategory(cat)}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    selectedCategory === cat ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}>
                  <div className="text-sm font-semibold mb-1 line-clamp-2">{cat}</div>
                  <div className="text-xs text-gray-500">{categoryStats[cat] || 0} books</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {paginatedContent.map((item) => (
              <div key={item.id} className="bg-white rounded-lg border p-4 hover:shadow-lg cursor-pointer"
                onClick={() => setReadingItem(item)}>
                <div className="flex justify-between mb-3">
                  {isBook(item) ? <Book className="text-blue-600" size={24} /> : <BookOpen className="text-green-600" size={24} />}
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-100">
                    {isBook(item) ? item.bookType : item.level}
                  </span>
                </div>
                <h3 className="font-semibold mb-2 line-clamp-2">{item.title}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-1">
                  {isBook(item) ? item.authors.join(', ') : item.student.name}
                </p>
                {isBook(item) ? (
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{item.pages} pages</span>
                    <div className="flex items-center gap-1">
                      <Star size={12} className="text-yellow-500 fill-yellow-500" />
                      <span>{item.rating}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{item.category}</span>
                    <span className={`px-2 py-0.5 rounded ${
                      item.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-gray-100'
                    }`}>{item.status}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {paginatedContent.map((item) => (
              <div key={item.id} className="bg-white rounded-lg border p-4 hover:shadow-md cursor-pointer flex items-center gap-4"
                onClick={() => setReadingItem(item)}>
                {isBook(item) ? <Book className="text-blue-600" size={32} /> : <BookOpen className="text-green-600" size={32} />}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{item.title}</h3>
                  <p className="text-sm text-gray-600 truncate">
                    {isBook(item) ? item.authors.join(', ') : item.student.name}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  {isBook(item) ? (
                    <>
                      <span>{item.publicationYear}</span>
                      <span className="flex items-center gap-1">
                        <Star size={14} className="text-yellow-500 fill-yellow-500" />{item.rating}
                      </span>
                    </>
                  ) : (
                    <>
                      <span>{item.academicYear}</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        item.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-gray-100'
                      }`}>{item.status}</span>
                    </>
                  )}
                  <Eye size={18} className="text-gray-400" />
                </div>
              </div>
            ))}
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
    </div>
  );
};

export default LibraryViewer;