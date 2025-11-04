import React, { useCallback, useEffect, useState } from 'react';
import { FileText, ExternalLink, X, Plus } from 'lucide-react';
import ReadingView from './ReadingView'; // <-- adjust path if needed

// Minimal local book type (no Firebase)
interface UrlBook {
  id: string;
  title: string;
  author?: string;
  pdfUrl: string;              // direct URL to PDF (signed URL is fine)
  fileType?: 'pdf' | 'epub';   // optional (Reader can infer from url)
}

const TestPdfTab: React.FC = () => {
  // You can seed with any URLs you want (or leave empty)
  const [books, setBooks] = useState<UrlBook[]>([
    // Example (replace/remove as you wish)
     {
       id: 'sample-1',
       title: 'NICE Cybersecurity Framework',
       author: 'Izzat Alasmadi, Chuck Easttom, Lo’ai Tawalbeh',
       pdfUrl: 'https://firebasestorage.googleapis.com/v0/b/hsb-library.firebasestorage.app/o/book-pdfs%2F1cd36f22-8657-42ff-a1dc-b0071acaa6e9-NICE%20cyber%20security%20framework.pdf?alt=media&token=82474e86-ea1d-461c-9a78-2fe668ab4c33',
     }
  ]);

  // Simple form to add a new PDF URL
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newUrl, setNewUrl] = useState('');

  // Modal state (blurred overlay)
  const [selectedBook, setSelectedBook] = useState<UrlBook | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMount, setModalMount] = useState(false);

  const addUrlBook = () => {
    if (!newUrl.trim()) return;
    const id = `url-${Date.now()}`;
    const b: UrlBook = {
      id,
      title: newTitle.trim() || 'Untitled',
      author: newAuthor.trim() || undefined,
      pdfUrl: newUrl.trim(),
    };
    setBooks((prev) => [b, ...prev]);
    setNewTitle('');
    setNewAuthor('');
    setNewUrl('');
  };

  const openReader = useCallback((book: UrlBook) => {
    setSelectedBook(book);
    setModalMount(true);
    requestAnimationFrame(() => setModalVisible(true));
  }, []);

  const closeReader = useCallback(() => {
    setModalVisible(false);
  }, []);

  // Unmount after animation completes
  useEffect(() => {
    if (!modalVisible && modalMount) {
      const t = setTimeout(() => {
        setModalMount(false);
        setSelectedBook(null);
      }, 150);
      return () => clearTimeout(t);
    }
  }, [modalVisible, modalMount]);

  // Prevent background scroll
  useEffect(() => {
    if (modalMount) {
      document.body.classList.add('overflow-hidden');
      return () => document.body.classList.remove('overflow-hidden');
    }
  }, [modalMount]);

  // ESC to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && modalMount) closeReader();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [modalMount, closeReader]);

  const booksWithPdfCount = books.filter(b => !!b.pdfUrl).length;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">PDF URLs Test (URL-only, no Firebase)</h2>

      {/* URL Adder */}
      <div className="mb-6 bg-white border border-gray-200 rounded-xl p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Add a PDF by URL</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            className="px-3 py-2 border rounded-lg text-sm"
            placeholder="Title (optional)"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <input
            className="px-3 py-2 border rounded-lg text-sm"
            placeholder="Author (optional)"
            value={newAuthor}
            onChange={(e) => setNewAuthor(e.target.value)}
          />
          <div className="flex gap-2">
            <input
              className="flex-1 px-3 py-2 border rounded-lg text-sm"
              placeholder="https://... (direct PDF URL or signed URL)"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
            />
            <button
              onClick={addUrlBook}
              className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 text-sm"
              title="Add URL"
            >
              <Plus size={16} />
              Add
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Paste a direct PDF link (e.g., a Firebase Storage signed URL). Click “Read PDF” to open it in the in-app viewer.
        </p>
      </div>

      {/* List */}
      {books.length === 0 ? (
        <p className="text-gray-500">No entries yet. Add a PDF URL above.</p>
      ) : (
        <div className="space-y-4">
          {books.map((book) => (
            <div key={book.id} className="border border-gray-200 rounded-lg p-4 bg-white">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="text-blue-600" size={20} />
                    <h3 className="font-semibold text-gray-900">{book.title}</h3>
                  </div>
                  {book.author && <p className="text-sm text-gray-600 mb-2">by {book.author}</p>}
                  <div className="bg-green-50 border border-green-200 rounded p-3 mt-3">
                    <p className="text-xs font-medium text-green-800 mb-1">PDF URL:</p>
                    <p className="text-xs text-green-700 break-all font-mono">{book.pdfUrl}</p>
                  </div>
                </div>

                <div className="ml-4 flex flex-col gap-2">
                  <a
                    href={book.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2 text-sm"
                    title="Open in new tab"
                  >
                    Open PDF
                    <ExternalLink size={16} />
                  </a>
                  <button
                    onClick={() => openReader(book)}
                    className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
                    title="Open in reader"
                  >
                    Read PDF
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer stats */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
        <p className="text-sm text-blue-800">
          <strong>Total Items:</strong> {books.length} |
          <strong className="ml-3">Items with PDF:</strong> {booksWithPdfCount}
        </p>
      </div>

      {/* ===== Modal with blurred backdrop ===== */}
      {modalMount && (
        <div
          className={`fixed inset-0 z-[999] flex items-center justify-center
                      transition-opacity duration-150
                      ${modalVisible ? 'opacity-100' : 'opacity-0'}`}
        >
          {/* Backdrop (click to close) */}
          <div
            className={`absolute inset-0 bg-black/40 backdrop-blur-sm
                        transition-opacity duration-150
                        ${modalVisible ? 'opacity-100' : 'opacity-0'}`}
            onClick={closeReader}
          />

          {/* Modal content wrapper to center and apply scale animation */}
          <div
            className={`relative z-10 w-full h-full
                        transition-transform duration-150
                        ${modalVisible ? 'scale-100' : 'scale-95'}`}
          >
            {/* Close button (top-right) */}
            <button
              onClick={closeReader}
              className="absolute right-4 top-4 z-20 rounded-full bg-white/80 hover:bg-white text-gray-700 shadow p-2"
              aria-label="Close"
              title="Close"
            >
              <X size={18} />
            </button>

            {/* ReadingView fills the screen (uses its own header & controls) */}
            {selectedBook && (
              <ReadingView
                item={{
                  id: selectedBook.id,
                  title: selectedBook.title,
                  isbn: 'url-mode',           // just to satisfy Book guard
                  pdfUrl: selectedBook.pdfUrl,
                  fileType: selectedBook.fileType ?? 'pdf',
                } as any}
                onClose={closeReader}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TestPdfTab;
