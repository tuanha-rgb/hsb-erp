import { useState, useEffect, useRef } from 'react';
import {
  X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut,
  Download, Printer, Loader, AlertCircle
} from 'lucide-react';
import { GlobalWorkerOptions, getDocument, PDFDocumentProxy } from 'pdfjs-dist';
import pdfjsWorkerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

GlobalWorkerOptions.workerSrc = pdfjsWorkerSrc;

interface HandbookPdfViewerProps {
  fileUrl: string;
  fileName: string;
  onClose: () => void;
}

export default function HandbookPdfViewer({ fileUrl, fileName, onClose }: HandbookPdfViewerProps) {
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1.5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rendering, setRendering] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Load PDF document
  useEffect(() => {
    if (!fileUrl) {
      setError('No PDF file available');
      setLoading(false);
      return;
    }

    loadPdf();
  }, [fileUrl]);

  // Render page when page number or scale changes
  useEffect(() => {
    if (pdfDoc) {
      renderPage(currentPage);
    }
  }, [pdfDoc, currentPage, scale]);

  const loadPdf = async () => {
    try {
      setLoading(true);
      setError(null);

      const loadingTask = getDocument(fileUrl);
      const pdf = await loadingTask.promise;

      setPdfDoc(pdf);
      setTotalPages(pdf.numPages);
      setCurrentPage(1);
      setLoading(false);
    } catch (err) {
      console.error('Error loading PDF:', err);
      setError('Failed to load PDF document');
      setLoading(false);
    }
  };

  const renderPage = async (pageNum: number) => {
    if (!pdfDoc || !canvasRef.current || rendering) return;

    try {
      setRendering(true);

      const page = await pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale });

      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (!context) {
        setRendering(false);
        return;
      }

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
        canvas: canvas
      };

      await page.render(renderContext).promise;
      setRendering(false);
    } catch (err) {
      console.error('Error rendering page:', err);
      setRendering(false);
    }
  };

  // Navigation
  const goToPage = (pageNum: number) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  const handlePrevPage = () => goToPage(currentPage - 1);
  const handleNextPage = () => goToPage(currentPage + 1);

  // Zoom
  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.5));

  // Download
  const handleDownload = () => {
    if (fileUrl) {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileName;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Print
  const handlePrint = () => {
    if (fileUrl) {
      const printWindow = window.open(fileUrl, '_blank');
      printWindow?.print();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrevPage();
      if (e.key === 'ArrowRight') handleNextPage();
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, totalPages]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        {/* Document Info */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <h2 className="text-lg font-semibold text-gray-900 truncate">
            {fileName}
          </h2>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Zoom Controls */}
          <button
            onClick={handleZoomOut}
            disabled={scale <= 0.5}
            className="p-2 hover:bg-gray-100 rounded transition disabled:opacity-50"
            title="Zoom Out"
          >
            <ZoomOut className="w-5 h-5" />
          </button>

          <span className="text-sm text-gray-600 min-w-[60px] text-center">
            {Math.round(scale * 100)}%
          </span>

          <button
            onClick={handleZoomIn}
            disabled={scale >= 3}
            className="p-2 hover:bg-gray-100 rounded transition disabled:opacity-50"
            title="Zoom In"
          >
            <ZoomIn className="w-5 h-5" />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-2"></div>

          {/* Download */}
          <button
            onClick={handleDownload}
            className="p-2 hover:bg-gray-100 rounded transition"
            title="Download"
          >
            <Download className="w-5 h-5" />
          </button>

          {/* Print */}
          <button
            onClick={handlePrint}
            className="p-2 hover:bg-gray-100 rounded transition"
            title="Print"
          >
            <Printer className="w-5 h-5" />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-2"></div>

          {/* Close */}
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded transition"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* PDF Content */}
      <div className="flex-1 overflow-auto bg-gray-900 flex items-center justify-center p-4">
        {loading && (
          <div className="text-center text-white">
            <Loader className="w-12 h-12 animate-spin mx-auto mb-4" />
            <p>Loading PDF...</p>
          </div>
        )}

        {error && (
          <div className="text-center text-white">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
            <p className="text-lg mb-2">{error}</p>
            <button
              onClick={loadPdf}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && pdfDoc && (
          <div className="relative">
            <canvas
              ref={canvasRef}
              className="shadow-2xl bg-white max-w-full h-auto"
            />
            {rendering && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
                <Loader className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer - Page Navigation */}
      {!loading && !error && pdfDoc && (
        <div className="bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-center gap-4">
          {/* Previous */}
          <button
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
            className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          {/* Page Input */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Page</span>
            <input
              type="number"
              min={1}
              max={totalPages}
              value={currentPage}
              onChange={(e) => {
                const page = parseInt(e.target.value);
                if (!isNaN(page)) goToPage(page);
              }}
              className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">of {totalPages}</span>
          </div>

          {/* Next */}
          <button
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
            className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
