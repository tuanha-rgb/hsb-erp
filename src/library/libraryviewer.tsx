import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Book, BookOpen, Search, Filter, X, ChevronDown, ChevronRight,
  Star, Download, Eye, Grid, List, ArrowLeft, ChevronLeft,
  TrendingUp, Users, ZoomIn, ZoomOut, Columns, Square, Menu, BookmarkCheck,
} from 'lucide-react';
import { bookRecords, catalogues, type BookRecord, type CatalogueCategory, type BookType } from './bookdata';
import { sampleTheses, type Thesis } from '../acad/thesis';
import { getFileUrl } from './googledrive';  // ← ADD THIS LINE
import ePub from 'epubjs';
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist';
// Ask Vite to give us the built URL of the worker file
import pdfjsWorkerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Configure PDF.js worker
GlobalWorkerOptions.workerSrc = pdfjsWorkerSrc;
type ViewMode = 'grid' | 'list';
type ContentType = 'all' | 'books' | 'theses';
type ReadingItem = BookRecord | Thesis;

interface CarouselSlide {
  id: string;
  title: string;
  description: string;
  image: string;
  badge?: string;
  action?: string;
  color: string;
}

const carouselSlides: CarouselSlide[] = [
  {
    id: '1',
    title: 'New Arrivals - Fall 2024',
    description: 'Penguin best collection',
    image: 'https://i.postimg.cc/Y0ST8dTJ/classic-penguin.jpg',
    badge: 'NEW',
    action: 'Browse Collection',
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: '2',
    title: 'AI Engineering',
    description: 'Hot AI book by a Vietnamese Author - Huyen Chip',
    image: 'https://i.postimg.cc/K8RxmDvf/aie-cover.png',
    badge: 'HOT',
    action: 'Explore AI Books',
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: '3',
    title: 'The Four',
    description: 'The Hidden DNA of Amazon, Apple, Facebook, and Google',
    image: 'https://i.postimg.cc/wvKmXBbC/thefour.jpg',
    badge: 'FEATURED',
    action: 'Explore Business Books',
    color: 'from-green-500 to-green-600'
  },
  {
    id: '4',
    title: 'Divide',
    description: 'American Injustice in the Age of the Wealth Gap',
    image: 'https://i.postimg.cc/PfgRCb4b/divide.jpg',
    action: 'Discover More',
    color: 'from-orange-500 to-orange-600'
  },
  {
    id: '5',
    title: 'Digital Library Features',
    description: 'Bookmark, annotate, and share your favorite academic resources',
    image: '✨',
    badge: 'INFO',
    action: 'Learn More',
    color: 'from-pink-500 to-pink-600'
  }
];


type PageMode = 'single' | 'dual';

interface Bookmark {
  page: number;
  note?: string;
  timestamp: number;
}

interface ReadingViewProps {
  item: ReadingItem;
  onClose: () => void;
}

const isBook = (item: ReadingItem): item is BookRecord => 'isbn' in item;
const isThesis = (item: ReadingItem): item is Thesis => 'student' in item;


const FloatingCarousel: React.FC<{ onSlideClick?: (slideId: string) => void }> = ({ onSlideClick }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

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

  const slide = carouselSlides[currentSlide];

  return (
    <div className="relative overflow-hidden rounded-2xl shadow-2xl h-[400px] group">
      {/* Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-r ${slide.color} transition-all duration-700`} />
      
      {/* Content */}
      <div className="relative h-full flex items-center justify-between px-12">
        {/* Left Content */}
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
              onClick={() => onSlideClick?.(slide.id)}
              className="px-6 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              {slide.action}
            </button>
          )}
        </div>

        {/* Right Image/Icon */}
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
      {/* Navigation Arrows */}
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

      {/* Dots Navigation */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {carouselSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentSlide 
                ? 'w-8 bg-white' 
                : 'w-2 bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>
    </div>
  );
};



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

  const hasFile = isBook(item) && item.driveFileId && item.fileType;
  const storageKey = `bookmarks_${item.id}`;

  // Load bookmarks from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setBookmarks(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load bookmarks:', e);
      }
    }
  }, [storageKey]);

  // Save bookmarks to localStorage
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
      if (pdfDocRef.current) {
        pdfDocRef.current.destroy();
        pdfDocRef.current = null;
      }
      if (renditionRef.current) {
        renditionRef.current.destroy();
        renditionRef.current = null;
      }
      if (epubBookRef.current) {
        epubBookRef.current.destroy();
        epubBookRef.current = null;
      }
    };
  }, [item, hasFile]);

  const loadDocument = async () => {
    if (!isBook(item) || !item.driveFileId || !item.fileType) return;

    try {
      setLoading(true);
      setError(null);
      
      const fileUrl = await getFileUrl(item.driveFileId);
      
      if (item.fileType === 'pdf') {
        await loadPDF(fileUrl);
      } else if (item.fileType === 'epub') {
        await loadEPUB(fileUrl);
      }
    } catch (err) {
      console.error('Document load error:', err);
      setError('Failed to load document: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

   const loadPDF = async (url: string) => {
    // const loadingTask = pdfjsLib.getDocument(url);
const loadingTask = getDocument(url);

    const pdf = await loadingTask.promise;
    pdfDocRef.current = pdf;
    setTotalPages(pdf.numPages);
    await renderPDFPages(1);
  };

  const renderPDFPages = async (pageNum: number) => {
    if (!pdfDocRef.current) return;
    
    // Render first page
    if (canvasRef.current) {
      await renderPDFPage(pageNum, canvasRef.current);
    }
    
    // Render second page if in dual mode
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
      width: '100%',
      height: '100%',
      spread: pageMode === 'dual' ? 'auto' : 'none'
    });
    
    renditionRef.current = rendition;
    await rendition.display();
    
    await book.ready;
    setTotalPages(50); // EPUB doesn't have fixed pages
    setCurrentPage(1);

    rendition.on('relocated', (location: any) => {
      setCurrentPage(Math.floor(location.start.percentage * 50) + 1);
    });
  };

  const handlePrevPage = async () => {
    const step = pageMode === 'dual' ? 2 : 1;
    if (currentPage <= 1) return;
    
    const newPage = Math.max(1, currentPage - step);
    
    if (isBook(item) && item.fileType === 'pdf') {
      await renderPDFPages(newPage);
    } else if (renditionRef.current) {
      await renditionRef.current.prev();
    }
  };

  const handleNextPage = async () => {
    const step = pageMode === 'dual' ? 2 : 1;
    if (currentPage >= totalPages) return;
    
    const newPage = Math.min(totalPages, currentPage + step);
    
    if (isBook(item) && item.fileType === 'pdf') {
      await renderPDFPages(newPage);
    } else if (renditionRef.current) {
      await renditionRef.current.next();
    }
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
      // For PDF, re-render with new mode
      setTimeout(() => renderPDFPages(currentPage), 0);
    } else if (renditionRef.current && epubBookRef.current) {
      // For EPUB, need to recreate rendition
      renditionRef.current.destroy();
      await loadEPUB(await getFileUrl(item.driveFileId));
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

  const isBookmarked = (page: number) => {
    return bookmarks.some(b => b.page === page);
  };

 

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between bg-white">
        <button onClick={onClose} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
          <ArrowLeft size={20} />
          <span>Back to Library</span>
        </button>
        
        <div className="flex items-center gap-3">
          {hasFile && totalPages > 0 && (
            <span className="text-sm text-gray-500">
              Page {currentPage}
              {pageMode === 'dual' && currentPage < totalPages && `-${currentPage + 1}`}
              {' / '}{totalPages}
            </span>
          )}
          
          {/* View Mode Toggle */}
          {isBook(item) && item.fileType === 'pdf' && hasFile && (
            <button
              onClick={togglePageMode}
              className={`p-2 rounded hover:bg-gray-100 ${pageMode === 'dual' ? 'bg-blue-50 text-blue-600' : ''}`}
              title={pageMode === 'single' ? 'Dual Page View' : 'Single Page View'}
            >
              {pageMode === 'single' ? <Columns size={18} /> : <Square size={18} />}
            </button>
          )}
          
          {/* Bookmark Toggle */}
          <button
            onClick={() => setShowBookmarks(!showBookmarks)}
            className={`p-2 rounded hover:bg-gray-100 relative ${showBookmarks ? 'bg-blue-50 text-blue-600' : ''}`}
            title="Bookmarks"
          >
            <Menu size={18} />
            {bookmarks.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {bookmarks.length}
              </span>
            )}
          </button>
          
          {/* Add Bookmark */}
          <button
            onClick={() => {
              if (isBookmarked(currentPage)) {
                const index = bookmarks.findIndex(b => b.page === currentPage);
                removeBookmark(index);
              } else {
                addBookmark();
              }
            }}
            className={`p-2 rounded hover:bg-gray-100 ${isBookmarked(currentPage) ? 'text-yellow-500' : ''}`}
            title={isBookmarked(currentPage) ? 'Remove Bookmark' : 'Add Bookmark'}
          >
            {isBookmarked(currentPage) ? <BookmarkCheck size={18} /> : <BookmarkCheck size={18} />}
          </button>
          
          {/* Zoom Controls for PDF */}
          {isBook(item) && item.fileType === 'pdf' && hasFile && (
            <div className="flex items-center gap-1 border-l pl-3 ml-3">
              <button 
                onClick={handleZoomOut} 
                className="p-2 hover:bg-gray-100 rounded"
                disabled={loading}
              >
                <ZoomOut size={18} />
              </button>
              <span className="text-sm text-gray-600 min-w-[60px] text-center">
                {Math.round(scale * 100)}%
              </span>
              <button 
                onClick={handleZoomIn} 
                className="p-2 hover:bg-gray-100 rounded"
                disabled={loading}
              >
                <ZoomIn size={18} />
              </button>
            </div>
          )}
          
         
          
        </div>
      </div>

      {/* Bookmarks Sidebar */}
      {showBookmarks && (
        <div className="absolute right-0 top-16 bottom-0 w-80 bg-white border-l border-gray-200 shadow-lg z-10 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Bookmarks ({bookmarks.length})</h3>
              <button onClick={() => setShowBookmarks(false)} className="text-gray-500 hover:text-gray-700">
                <X size={18} />
              </button>
            </div>
            
            {/* Add Bookmark Form */}
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Add note (optional)"
                value={bookmarkNote}
                onChange={(e) => setBookmarkNote(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isBookmarked(currentPage)) {
                    addBookmark();
                  }
                }}
              />
              <button
                onClick={addBookmark}
                disabled={isBookmarked(currentPage)}
                className="w-full px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isBookmarked(currentPage) ? 'Already Bookmarked' : `Bookmark Page ${currentPage}`}
              </button>
            </div>
          </div>
          
          {/* Bookmarks List */}
          <div className="flex-1 overflow-auto p-4 space-y-2">
            {bookmarks.length === 0 ? (
              <div className="text-center text-gray-500 text-sm py-8">
                No bookmarks yet
              </div>
            ) : (
              bookmarks.map((bookmark, index) => (
                <div
                  key={index}
                  className="p-3 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer group"
                  onClick={() => goToBookmark(bookmark.page)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <BookmarkCheck size={14} className="text-yellow-500" />
                        <span className="font-medium text-sm text-gray-900">Page {bookmark.page}</span>
                      </div>
                      {bookmark.note && (
                        <p className="text-xs text-gray-600 line-clamp-2">{bookmark.note}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(bookmark.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeBookmark(index);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 p-1"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Content Area */}
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
              <button 
                onClick={loadDocument}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Retry
              </button>
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {isBook(item) ? item.title : item.title}
              </h1>
              <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm text-blue-800">
                  📖 <strong>Digital content not available.</strong> This item does not have an associated digital file.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      {hasFile && totalPages > 0 && !loading && !error && (
        <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-center gap-4 bg-white">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <ChevronLeft size={18} />
            Previous
          </button>
          <span className="text-sm text-gray-600">
            {currentPage}
            {pageMode === 'dual' && currentPage < totalPages && `-${currentPage + 1}`}
            {' / '}{totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            Next
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

const LibraryViewer: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [contentType, setContentType] = useState<ContentType>('all');
  const [selectedCategory, setSelectedCategory] = useState<CatalogueCategory | 'all'>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [readingItem, setReadingItem] = useState<ReadingItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Combined and filtered content
  const filteredContent = useMemo(() => {
    let items: ReadingItem[] = [];

    if (contentType === 'all' || contentType === 'books') {
      items = [...items, ...bookRecords];
    }
    if (contentType === 'all' || contentType === 'theses') {
      items = [...items, ...sampleTheses];
    }

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter(item => {
        if (isBook(item)) {
          return (
            item.title.toLowerCase().includes(query) ||
            item.authors.some(a => a.toLowerCase().includes(query)) ||
            item.subjects.some(s => s.toLowerCase().includes(query))
          );
        } else {
          return (
            item.title.toLowerCase().includes(query) ||
            item.student.name.toLowerCase().includes(query) ||
            item.keywords.some(k => k.toLowerCase().includes(query))
          );
        }
      });
    }

    // Apply category filter (books only)
    if (selectedCategory !== 'all') {
      items = items.filter(item => isBook(item) && item.catalogue === selectedCategory);
    }

    return items;
  }, [searchQuery, contentType, selectedCategory]);

  // Paginated content
  const paginatedContent = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredContent.slice(startIndex, endIndex);
  }, [filteredContent, currentPage, itemsPerPage]);

  // Total pages
  const totalPages = Math.ceil(filteredContent.length / itemsPerPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, contentType, selectedCategory, itemsPerPage]);

  // Handle carousel action
  const handleCarouselAction = (slideId: string) => {
    switch(slideId) {
      case '1': // New Arrivals
        setContentType('books');
        break;
      case '2': // AI & ML
        setSelectedCategory('Computer Science');
        setContentType('books');
        break;
      case '3': // Thesis Archive
        setContentType('theses');
        break;
      case '4': // Business & Economics
        setSelectedCategory('Business & Economics');
        setContentType('books');
        break;
    }
  };

  // Get category statistics
  const categoryStats = useMemo(() => {
    const stats: Record<string, number> = {};
    catalogues.forEach(cat => {
      stats[cat] = bookRecords.filter(book => book.catalogue === cat).length;
    });
    return stats;
  }, []);

  // Get quick stats
  const stats = useMemo(() => ({
    totalBooks: bookRecords.length,
    totalTheses: sampleTheses.length,
    availableCopies: bookRecords.reduce((sum, book) => sum + book.availableCopies, 0),
    popularBooks: bookRecords.filter(book => book.rating >= 4.5).length,
  }), []);

  if (readingItem) {
    return <ReadingView item={readingItem} onClose={() => setReadingItem(null)} />;
  }

  return (
    <div className="h-full overflow-auto bg-gray-50">
      {/* Hero Carousel Section */}
      <div className="bg-white border-b border-gray-200 px-3 py-3">
        <FloatingCarousel onSlideClick={handleCarouselAction} />
      </div>

      {/* Quick Stats Bar */}
      <div className="bg-white border-b border-gray-200 px-3 py-3">
        <div className="grid grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Book className="text-blue-600" size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.totalBooks}</div>
              <div className="text-sm text-gray-600">Books</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <BookOpen className="text-green-600" size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.totalTheses}</div>
              <div className="text-sm text-gray-600">Theses</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Star className="text-purple-600" size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.popularBooks}</div>
              <div className="text-sm text-gray-600">Top Rated</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-orange-600" size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.availableCopies}</div>
              <div className="text-sm text-gray-600">Available</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-3 py-3">
        {/* Categories Section */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-gray-900">Browse by Category</h2>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setContentType('all');
              }}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View All
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {catalogues.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setContentType('books');
                }}
                className={`p-4 rounded-xl border-2 transition-all hover:shadow-md ${
                  selectedCategory === category
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="text-3xl mb-2">
                  {category === 'Computer Science' && '💻'}
                  {category === 'Engineering' && '⚙️'}
                  {category === 'Business & Economics' && '💼'}
                  {category === 'Mathematics' && '📐'}
                  {category === 'Physics' && '⚛️'}
                  {category === 'Chemistry' && '🧪'}
                  {category === 'Biology & Life Sciences' && '🧬'}
                  {category === 'Social Sciences' && '👥'}
                  {category === 'Humanities' && '📚'}
                  {category === 'Medicine & Health' && '🏥'}
                  {category === 'Architecture' && '🏛️'}
                  {category === 'Arts & Design' && '🎨'}
                </div>
                <div className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
                  {category}
                </div>
                <div className="text-xs text-gray-500">
                  {categoryStats[category] || 0} books
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Header with Search */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-3">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Library Collection</h1>
              <p className="text-sm text-gray-600 mt-1">
                Browse and read {bookRecords.length} books and {sampleTheses.length} theses
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <List size={18} />
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by title, author, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <Filter size={18} />
              Filters
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
                  <select
                    value={contentType}
                    onChange={(e) => setContentType(e.target.value as ContentType)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="all">All Content</option>
                    <option value="books">Books Only</option>
                    <option value="theses">Theses Only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as CatalogueCategory | 'all')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    disabled={contentType === 'theses'}
                  >
                    <option value="all">All Categories</option>
                    {catalogues.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-3">
              <span>
                {filteredContent.length} item{filteredContent.length !== 1 ? 's' : ''} found
              </span>
              <span>•</span>
              <div className="flex items-center gap-2">
                <label className="text-gray-700">Show:</label>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span>per page</span>
              </div>
            </div>
            {totalPages > 1 && (
              <div className="text-gray-600">
                Page {currentPage} of {totalPages}
              </div>
            )}
          </div>
        </div>

        {/* Content Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {paginatedContent.map((item) => (
              <div
                key={isBook(item) ? item.id : item.id}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setReadingItem(item)}
              >
                <div className="flex items-start justify-between mb-3">
                  {isBook(item) ? (
                    <Book className="text-blue-600" size={24} />
                  ) : (
                    <BookOpen className="text-green-600" size={24} />
                  )}
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                    {isBook(item) ? item.bookType : item.level}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {isBook(item) ? item.title : item.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-1">
                  {isBook(item) ? item.authors.join(', ') : item.student.name}
                </p>
                {isBook(item) ? (
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{item.pages} pages</span>
                    <div className="flex items-center gap-1">
                      <Star size={12} className="text-yellow-500 fill-yellow-500" />
                      <span>{item.rating}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{item.category}</span>
                    <span className={`px-2 py-0.5 rounded ${
                      item.status === 'approved' ? 'bg-green-100 text-green-700' :
                      item.status === 'under_review' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {paginatedContent.map((item) => (
              <div
                key={isBook(item) ? item.id : item.id}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer flex items-center gap-4"
                onClick={() => setReadingItem(item)}
              >
                {isBook(item) ? (
                  <Book className="text-blue-600 flex-shrink-0" size={32} />
                ) : (
                  <BookOpen className="text-green-600 flex-shrink-0" size={32} />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {isBook(item) ? item.title : item.title}
                  </h3>
                  <p className="text-sm text-gray-600 truncate">
                    {isBook(item) ? item.authors.join(', ') : item.student.name}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600 flex-shrink-0">
                  {isBook(item) ? (
                    <>
                      <span>{item.publicationYear}</span>
                      <span className="flex items-center gap-1">
                        <Star size={14} className="text-yellow-500 fill-yellow-500" />
                        {item.rating}
                      </span>
                    </>
                  ) : (
                    <>
                      <span>{item.academicYear}</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        item.status === 'approved' ? 'bg-green-100 text-green-700' :
                        item.status === 'under_review' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {item.status}
                      </span>
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
            <p className="text-gray-600">No items found matching your criteria</p>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && filteredContent.length > 0 && (
          <div className="mt-3 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredContent.length)} of {filteredContent.length} items
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                First
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} className="inline" />
              </button>
              
              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1.5 text-sm border rounded transition-colors ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} className="inline" />
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Last
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LibraryViewer;