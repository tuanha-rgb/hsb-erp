import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Book, BookOpen, Search, Filter, X, ChevronDown, ChevronRight,
  Star, Download, Eye, Grid, List, ArrowLeft, ChevronLeft,
  TrendingUp, Users, ZoomIn, ZoomOut, Columns, Square, Menu, BookmarkCheck,
} from 'lucide-react';
import { type BookRecord, type CatalogueCategory, type BookType } from './bookdata';
import { bookService } from '../firebase/book.service';
import { getAuth, onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { sampleTheses, type Thesis } from '../acad/thesis';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import ePub from 'epubjs';
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist';
import pdfjsWorkerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

GlobalWorkerOptions.workerSrc = pdfjsWorkerSrc;

type ViewMode = 'grid' | 'list';
type ContentType = 'books' | 'theses';
type ReadingItem = (BookRecord & { author?: string }) | Thesis;

interface CarouselSlide {
  id: string;
  title: string;
  description: string;
  image: string;
  badge?: string;
  action?: string;
  color: string;
}

interface ReadingViewProps {
  item: ReadingItem;
  onClose: () => void;
}

const isBook = (item: ReadingItem): item is BookRecord => 'isbn' in item;
const isThesis = (item: ReadingItem): item is Thesis => 'student' in item;

const getBookAuthor = (book: any): string => {
  if (book.authors && Array.isArray(book.authors)) {
    return book.authors.join(', ');
  }
  if (book.author) {
    return book.author;
  }
  return 'Unknown Author';
};

const FloatingCarousel: React.FC<{ 
  onSlideClick?: (slideId: string) => void;
  onBookClick?: (bookId: string) => void;
}> = ({ onSlideClick, onBookClick }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [featuredBooks, setFeaturedBooks] = useState<any[]>([]);
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
              onClick={() => {
                if (onBookClick) {
                  onBookClick(slide.id);
                } else {
                  onSlideClick?.(slide.id);
                }
              }}
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1.5);
  
  const pdfDocRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renditionRef = useRef<any>(null);
  const epubBookRef = useRef<any>(null);

  const hasFile = useMemo(() => {
    return isBook(item) && !!item.pdfUrl;
  }, [item]);

  const loadPDF = async (url: string) => {
    try {
      // Fetch as blob first to avoid CORS issues with PDF.js
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      const loadingTask = getDocument({
        url: blobUrl,
        isEvalSupported: false,
      });
      const pdf = await loadingTask.promise;
      pdfDocRef.current = pdf;
      setTotalPages(pdf.numPages);
      await renderPage(1);
      
      // Store blob URL for cleanup
      setPdfUrl(blobUrl);
    } catch (err) {
      console.error('Error loading PDF:', err);
      throw new Error('Failed to load PDF document');
    }
  };

  const renderPage = async (pageNum: number) => {
    if (!pdfDocRef.current || !canvasRef.current) return;

    try {
      const page = await pdfDocRef.current.getPage(pageNum);
      const viewport = page.getViewport({ scale });
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (!context) return;

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      await page.render(renderContext).promise;
    } catch (err) {
      console.error('Error rendering page:', err);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    if (!hasFile) {
      setLoading(false);
      return;
    }

    const loadFile = async () => {
      setLoading(true);
      setError(null);
      
      try {
        if (isBook(item) && item.pdfUrl) {
          console.log('Loading PDF from:', item.pdfUrl);
          // loadPDF will set pdfUrl with blob URL
          await loadPDF(item.pdfUrl);
        } else {
          throw new Error('No PDF available for this book');
        }
      } catch (err: any) {
        console.error('Error loading file:', err);
        setError(err.message || 'Failed to load PDF');
      } finally {
        setLoading(false);
      }
    };

    loadFile();

    return () => {
      // Cleanup blob URL
      if (pdfUrl && pdfUrl.startsWith('blob:')) {
        URL.revokeObjectURL(pdfUrl);
      }
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

  useEffect(() => {
    if (pdfDocRef.current) {
      renderPage(currentPage);
    }
  }, [currentPage, scale]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading document...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 mb-4">
            <X size={64} className="mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Document</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!hasFile) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <BookOpen size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Document Available</h2>
          <p className="text-gray-600 mb-6">This item doesn't have an associated document file.</p>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-100 z-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Library</span>
          </button>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setScale(Math.max(0.5, scale - 0.25))}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Zoom Out"
            >
              <ZoomOut size={20} />
            </button>
            <span className="text-sm font-medium">{Math.round(scale * 100)}%</span>
            <button
              onClick={() => setScale(Math.min(3, scale + 0.25))}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Zoom In"
            >
              <ZoomIn size={20} />
            </button>

            <div className="w-px h-6 bg-gray-300" />

            <a
              href={isBook(item) ? item.pdfUrl : '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Download size={20} />
              Download
            </a>
          </div>
        </div>

        <h1 className="text-xl font-bold text-gray-900">
          {isBook(item) ? item.title : item.title}
        </h1>
        <p className="text-sm text-gray-600">
          {isBook(item) ? item.authors.join(', ') : item.student.name}
        </p>
      </div>

      <div className="flex-1 overflow-auto bg-gray-200 p-8">
        <div className="max-w-5xl mx-auto bg-white shadow-lg">
          <canvas ref={canvasRef} className="w-full" />
        </div>
      </div>

      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => goToPage(1)}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            First
          </button>
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} />
          </button>
          
          <span className="text-sm font-medium">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight size={16} />
          </button>
          <button
            onClick={() => goToPage(totalPages)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Last
          </button>
        </div>
      </div>
    </div>
  );
};

const LibraryViewer: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedBookType, setSelectedBookType] = useState<BookType | 'All'>('All');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [contentType, setContentType] = useState<ContentType>('books');
  const [readingItem, setReadingItem] = useState<ReadingItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 12;

  const [allBooks, setAllBooks] = useState<BookRecord[]>([]);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const books = await bookService.getAllBooks() as unknown as BookRecord[];
        setAllBooks(books);
      } catch (error) {
        console.error('Error loading books:', error);
      }
    };
    loadBooks();
  }, []);

  const categories: string[] = useMemo(() => {
    return ['All', 'Computer Science', 'Engineering', 'Business & Economics', 'Mathematics', 
            'Physics', 'Chemistry', 'Biology & Life Sciences', 'Social Sciences', 
            'Humanities', 'Medicine & Health', 'Architecture', 'Arts & Design'];
  }, []);

  const categoryStats = useMemo(() => {
    const stats: Record<string, number> = {};
    allBooks.forEach((book: any) => {
      const cat = book.catalogue || book.category;
      stats[cat] = (stats[cat] || 0) + 1;
    });
    return stats;
  }, [allBooks]);

  const filteredContent = useMemo(() => {
    const content = contentType === 'books' ? allBooks : sampleTheses;

    return content.filter(item => {
      const matchesSearch = searchQuery === '' || 
        (isBook(item) 
          ? item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            getBookAuthor(item).toLowerCase().includes(searchQuery.toLowerCase())
          : item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.student.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesCategory = selectedCategory === 'All' || 
        (isBook(item) && item.catalogue === selectedCategory);

      const matchesBookType = selectedBookType === 'All' || 
        (isBook(item) && item.bookType === selectedBookType);

      return matchesSearch && matchesCategory && matchesBookType;
    });
  }, [allBooks, contentType, searchQuery, selectedCategory, selectedBookType]);

  const totalPages = Math.ceil(filteredContent.length / itemsPerPage);
  const paginatedContent = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredContent.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredContent, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedBookType, contentType]);

  if (readingItem) {
    return <ReadingView item={readingItem} onClose={() => setReadingItem(null)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <FloatingCarousel 
          onBookClick={(bookId) => {
            const book = allBooks.find(b => b.id === bookId);
            if (book) setReadingItem(book);
          }}
        />

        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Library Collection</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <List size={20} />
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search books, theses, authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setContentType('books')}
                className={`px-4 py-2.5 rounded-lg font-medium transition-colors ${
                  contentType === 'books'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Book size={18} className="inline mr-2" />
                Books
              </button>
              <button
                onClick={() => setContentType('theses')}
                className={`px-4 py-2.5 rounded-lg font-medium transition-colors ${
                  contentType === 'theses'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <BookOpen size={18} className="inline mr-2" />
                Theses
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                <Filter size={18} className="inline mr-2" />
                Filters
              </button>
            </div>
          </div>

          {showFilters && contentType === 'books' && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Book Type</label>
                  <select
                    value={selectedBookType}
                    onChange={(e) => setSelectedBookType(e.target.value as BookType | 'All')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="All">All Types</option>
                    <option value="textbook">Textbook</option>
                    <option value="reference">Reference</option>
                    <option value="lecture_notes">Lecture Notes</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {contentType === 'books' && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Browse by Category</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {categories.filter(c => c !== 'All').map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      selectedCategory === category
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="text-2xl mb-1">
                      {category === 'Computer Science' && '💻'}
                      {category === 'Mathematics' && '📐'}
                      {category === 'Physics' && '⚛️'}
                      {category === 'Chemistry' && '🧪'}
                      {category === 'Biology & Life Sciences' && '🧬'}
                      {category === 'Social Sciences' && '👥'}
                      {category === 'Humanities' && '📚'}
                      {category === 'Medicine & Health' && '⚕️'}
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
          )}

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
                    {isBook(item) ? getBookAuthor(item) : item.student.name}
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
                      {isBook(item) ? getBookAuthor(item) : item.student.name}
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

          {totalPages > 1 && filteredContent.length > 0 && (
            <div className="mt-6 flex items-center justify-between">
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
    </div>
  );
};

export default LibraryViewer;