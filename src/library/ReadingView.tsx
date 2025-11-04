import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft, Columns, Square, Menu, BookmarkCheck, ZoomOut, ZoomIn, X,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import ePub from 'epubjs';
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist';
// If your app hasn't already set a pdf.js worker globally, keep the two lines below:
import pdfjsWorkerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
GlobalWorkerOptions.workerSrc = pdfjsWorkerSrc;

// TODO: fix this path to where your Drive helper is
import { getFileUrl } from './googledrive';

/* ===========================================================
   Minimal local types (non-breaking with your existing types)
   If you already have BookRecord/Thesis/ReadingItem types, you can
   remove these and import your own.
   =========================================================== */
type PageMode = 'single' | 'dual';

interface BookRecord {
  id: string;
  title: string;
  fileType?: 'pdf' | 'epub';
  firebaseStoragePath?: string;   // direct signed URL or gs link mapped to URL
  driveFileId?: string;
  pdfUrl?: string;                // from your TestPdfTab/Firestore
  isbn?: string;                  // used by type guard
}

interface Thesis {
  id: string;
  title: string;
  student: string;                // used by type guard
}

type ReadingItem = BookRecord | Thesis;

interface Bookmark { page: number; note?: string; timestamp: number; }
interface ReadingViewProps { item: ReadingItem; onClose: () => void; }

/* ===========================================================
   Type Guards
   =========================================================== */
const isBook = (item: ReadingItem): item is BookRecord => 'isbn' in item || 'fileType' in item;
const isThesis = (item: ReadingItem): item is Thesis => 'student' in item;

/* ===========================================================
   Helpers for picking URL and inferring type
   =========================================================== */
const inferFileType = (url?: string | null): 'pdf' | 'epub' | undefined => {
  if (!url) return undefined;
  const lower = url.split('?')[0].toLowerCase();
  if (lower.endsWith('.pdf')) return 'pdf';
  if (lower.endsWith('.epub')) return 'epub';
  return undefined;
};

const pickFileUrl = async (item: ReadingItem): Promise<string | null> => {
  if (!isBook(item)) return null;
  if (item.pdfUrl) return item.pdfUrl; // from your TestPdfTab
  if (item.firebaseStoragePath) return item.firebaseStoragePath;
  if (item.driveFileId) return await getFileUrl(item.driveFileId);
  return null;
};

/* ===========================================================
   Component
   =========================================================== */
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
  const [nativePdfUrl, setNativePdfUrl] = useState<string | null>(null); // optional fallback

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvas2Ref = useRef<HTMLCanvasElement>(null);
  const epubContainerRef = useRef<HTMLDivElement>(null);
  const pdfDocRef = useRef<any>(null);
  const epubBookRef = useRef<any>(null);
  const renditionRef = useRef<any>(null);

  const hasFile =
    isBook(item) && (item.pdfUrl || item.firebaseStoragePath || item.driveFileId);

  const storageKey = `bookmarks_${(item as any).id}`;

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try { setBookmarks(JSON.parse(saved)); }
      catch (e) { console.error('Failed to load bookmarks:', e); }
    }
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(bookmarks));
  }, [bookmarks, storageKey]);

  useEffect(() => {
    if (!hasFile) {
      setLoading(false);
      return;
    }
    loadDocument();
    return () => {
      if (pdfDocRef.current) { pdfDocRef.current.destroy?.(); pdfDocRef.current = null; }
      if (renditionRef.current) { renditionRef.current.destroy?.(); renditionRef.current = null; }
      if (epubBookRef.current) { epubBookRef.current.destroy?.(); epubBookRef.current = null; }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item, hasFile, pageMode]);

  const loadDocument = async () => {
    if (!isBook(item)) return;
    try {
      setLoading(true);
      setError(null);
      setNativePdfUrl(null);

      const fileUrl = await pickFileUrl(item);
      if (!fileUrl) throw new Error('No file source available');

      const type: 'pdf' | 'epub' =
        item.fileType ?? inferFileType(fileUrl) ?? 'pdf';

      if (type === 'pdf') {
        await loadPDF(fileUrl);
      } else if (type === 'epub') {
        await loadEPUB(fileUrl);
      } else {
        throw new Error('Unknown file type');
      }

      // success
      setError(null);
    } catch (err: any) {
      console.error('❌ Document load error:', err);
      setError('Failed to load document: ' + (err?.message ?? String(err)));
      // Fallback: try native iframe/object if it’s a PDF link
      try {
        const u = await pickFileUrl(item);
        if (u && (inferFileType(u) === 'pdf' || (item.fileType ?? 'pdf') === 'pdf')) {
          setNativePdfUrl(u);
        }
      } catch { /* ignore */ }
    } finally {
      setLoading(false);
    }
  };

  const loadPDF = async (url: string) => {
    const loadingTask = getDocument({ url, withCredentials: false });
    const pdf = await loadingTask.promise;
    pdfDocRef.current = pdf;
    setTotalPages(pdf.numPages);
    await renderPDFPages(1);
  };

  const renderPDFPages = async (pageNum: number) => {
    if (!pdfDocRef.current) return;
    const numPages: number = pdfDocRef.current.numPages ?? totalPages;

    if (canvasRef.current) await renderPDFPage(pageNum, canvasRef.current);

    if (pageMode === 'dual' && canvas2Ref.current && pageNum < numPages) {
      await renderPDFPage(pageNum + 1, canvas2Ref.current);
    }
    setCurrentPage(pageNum);
  };

  const renderPDFPage = async (pageNum: number, canvas: HTMLCanvasElement) => {
    if (!pdfDocRef.current) return;
    const numPages: number = pdfDocRef.current.numPages ?? totalPages;
    if (pageNum > numPages) return;

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

    // EPUBs don't have a fixed "page count"; using a stable placeholder
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
    if (isBook(item) && (item.fileType ?? 'pdf') === 'pdf') await renderPDFPages(newPage);
    else if (renditionRef.current) await renditionRef.current.prev();
  };

  const handleNextPage = async () => {
    const step = pageMode === 'dual' ? 2 : 1;
    const numPages: number = pdfDocRef.current?.numPages ?? totalPages;
    if (currentPage >= numPages) return;
    const newPage = Math.min(numPages, currentPage + step);
    if (isBook(item) && (item.fileType ?? 'pdf') === 'pdf') await renderPDFPages(newPage);
    else if (renditionRef.current) await renditionRef.current.next();
  };

  const handleZoomIn = async () => {
    if (isBook(item) && (item.fileType ?? 'pdf') === 'pdf') {
      const newScale = Math.min(scale + 0.25, 3);
      setScale(newScale);
      setTimeout(() => renderPDFPages(currentPage), 0);
    }
  };

  const handleZoomOut = async () => {
    if (isBook(item) && (item.fileType ?? 'pdf') === 'pdf') {
      const newScale = Math.max(scale - 0.25, 0.5);
      setScale(newScale);
      setTimeout(() => renderPDFPages(currentPage), 0);
    }
  };

  const togglePageMode = async () => {
    const newMode = pageMode === 'single' ? 'dual' : 'single';
    setPageMode(newMode);
    if (isBook(item) && (item.fileType ?? 'pdf') === 'pdf') {
      setTimeout(() => renderPDFPages(currentPage), 0);
    } else if (renditionRef.current && epubBookRef.current) {
      renditionRef.current.destroy();
      await loadEPUB(await pickFileUrl(item) as string);
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
    if (isBook(item) && (item.fileType ?? 'pdf') === 'pdf') {
      await renderPDFPages(page);
    } else if (renditionRef.current && epubBookRef.current) {
      const total = Math.max(totalPages, 50);
      const percentage = Math.min(Math.max(page / total, 0), 1);
      const cfi = epubBookRef.current.locations?.cfiFromPercentage?.(percentage);
      await renditionRef.current.display(cfi || undefined);
    }
    setShowBookmarks(false);
  };

  const isBookmarked = (page: number) => bookmarks.some(b => b.page === page);

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Top bar */}
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
          {isBook(item) && (item.fileType ?? 'pdf') === 'pdf' && hasFile && (
            <button
              onClick={togglePageMode}
              className={`p-2 rounded hover:bg-gray-100 ${pageMode === 'dual' ? 'bg-blue-50 text-blue-600' : ''}`}
            >
              {pageMode === 'single' ? <Columns size={18} /> : <Square size={18} />}
            </button>
          )}
          <button
            onClick={() => setShowBookmarks(!showBookmarks)}
            className={`p-2 rounded hover:bg-gray-100 relative ${showBookmarks ? 'bg-blue-50 text-blue-600' : ''}`}
          >
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
            title={isBookmarked(currentPage) ? 'Remove bookmark' : 'Add bookmark'}
          >
            <BookmarkCheck size={18} />
          </button>
          {isBook(item) && (item.fileType ?? 'pdf') === 'pdf' && hasFile && (
            <div className="flex items-center gap-1 border-l pl-3 ml-3">
              <button onClick={handleZoomOut} className="p-2 hover:bg-gray-100 rounded" disabled={loading} title="Zoom out">
                <ZoomOut size={18} />
              </button>
              <span className="text-sm text-gray-600 min-w-[60px] text-center">{Math.round(scale * 100)}%</span>
              <button onClick={handleZoomIn} className="p-2 hover:bg-gray-100 rounded" disabled={loading} title="Zoom in">
                <ZoomIn size={18} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bookmark side panel */}
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
              <input
                type="text"
                placeholder="Add note (optional)"
                value={bookmarkNote}
                onChange={(e) => setBookmarkNote(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyDown={(e) => { if (e.key === 'Enter' && !isBookmarked(currentPage)) addBookmark(); }}
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
          <div className="flex-1 overflow-auto p-4 space-y-2">
            {bookmarks.length === 0 ? (
              <div className="text-center text-gray-500 text-sm py-8">No bookmarks yet</div>
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
                      {bookmark.note && <p className="text-xs text-gray-600 line-clamp-2">{bookmark.note}</p>}
                      <p className="text-xs text-gray-400 mt-1">{new Date(bookmark.timestamp).toLocaleDateString()}</p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); removeBookmark(index); }}
                      className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 p-1"
                      title="Remove"
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

      {/* Main content */}
      <div className="flex-1 overflow-auto bg-gray-100">
        {loading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading document...</p>
            </div>
          </div>
        )}

        {error && !nativePdfUrl && (
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

        {!loading && !error && hasFile && isBook(item) && (item.fileType ?? 'pdf') === 'pdf' && !nativePdfUrl && (
          <div className="max-w-7xl mx-auto py-8">
            <div className={`flex justify-center gap-4 ${pageMode === 'dual' ? 'flex-row' : ''}`}>
              <canvas ref={canvasRef} className="shadow-2xl bg-white" />
              {pageMode === 'dual' && currentPage < totalPages && (
                <canvas ref={canvas2Ref} className="shadow-2xl bg-white" />
              )}
            </div>
          </div>
        )}

        {/* Native PDF fallback (optional) */}
        {!loading && hasFile && nativePdfUrl && (
          <div className="mt-6 max-w-7xl mx-auto w-full bg-white shadow">
            <object data={`${nativePdfUrl}#toolbar=1`} type="application/pdf" width="100%" height="800">
              <iframe src={`${nativePdfUrl}#toolbar=1`} width="100%" height="800" title="PDF Viewer" />
            </object>
            <p className="px-4 py-3 text-xs text-gray-500">
              Using native PDF viewer fallback. If you see a blank area, your browser may block inline PDFs for this URL.
            </p>
          </div>
        )}

        {!loading && !error && hasFile && isBook(item) && (item.fileType ?? '') === 'epub' && (
          <div className="bg-white shadow-2xl mx-auto my-8" style={{ maxWidth: pageMode === 'dual' ? '1400px' : '900px' }}>
            <div ref={epubContainerRef} style={{ height: '800px', width: '100%' }} />
          </div>
        )}

        {!loading && !error && !hasFile && (
          <div className="max-w-4xl mx-auto px-6 py-8">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {item.title}
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

      {/* Bottom pager */}
      {hasFile && totalPages > 0 && !loading && !error && (
        <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-center gap-4 bg-white">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <ChevronLeft size={18} />Previous
          </button>
          <span className="text-sm text-gray-600">
            {currentPage}{pageMode === 'dual' && currentPage < totalPages && `-${currentPage + 1}`}{' / '}{totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            Next<ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ReadingView;
