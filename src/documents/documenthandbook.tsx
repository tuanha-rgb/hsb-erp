import React, { useState, useEffect, useMemo } from "react";
import { Search, Upload, FileText, Trash2, X, Loader, Eye } from "lucide-react";
import {
  getAllHandbookDocuments,
  createHandbookDocument,
  uploadHandbookFile,
  deleteHandbookDocument,
  formatFileSize,
  subscribeToHandbookDocuments,
  type HandbookDocument
} from "../firebase/handbook.service";
import HandbookPdfViewer from "./HandbookPdfViewer";

interface DocumentsProps {
  userRole?: 'admin' | 'staff' | 'student';
  userId?: string;
  userName?: string;
}

const DocumentHandbook: React.FC<DocumentsProps> = ({
  userRole = 'student',
  userId = 'guest',
  userName = 'Guest User'
}) => {
  const [activeTab, setActiveTab] = useState<'browse' | 'upload'>('browse');
  const [documents, setDocuments] = useState<HandbookDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal state
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<HandbookDocument | null>(null);
 // PDF Viewer state
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [pdfToView, setPdfToView] = useState<{ fileUrl: string; fileName: string } | null>(null);

  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    abstract: '',
    category: 'Student Handbook',
    type: 'PDF' as 'PDF' | 'Video' | 'Document',
    tags: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const isAdmin = userRole === 'admin';

  // Load documents from Firebase
  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToHandbookDocuments((docs) => {
      setDocuments(docs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Group documents by category
  const documentsByCategory = useMemo(() => {
    const filtered = documents.filter(doc =>
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const grouped: { [key: string]: HandbookDocument[] } = {};
    filtered.forEach(doc => {
      if (!grouped[doc.category]) {
        grouped[doc.category] = [];
      }
      grouped[doc.category].push(doc);
    });

    return Object.entries(grouped).map(([category, docs]) => ({
      category,
      documents: docs,
      color: getCategoryColor(category)
    }));
  }, [documents, searchTerm]);

  // Category colors
  function getCategoryColor(category: string): string {
    const colorMap: { [key: string]: string } = {
      'App Tutorials & Guides': 'from-blue-500 to-blue-600',
      'Student Handbook': 'from-emerald-500 to-emerald-600',
      'Government Regulations': 'from-red-500 to-red-600',
      'Academic Policies': 'from-purple-500 to-purple-600',
      'Campus Services': 'from-orange-500 to-orange-600'
    };
    return colorMap[category] || 'from-gray-500 to-gray-600';
  }

  // Helpers
  const getTypeColor = (type: string) => {
    if (type === "PDF") return "bg-red-100 text-red-700 border-red-200";
    if (type === "Video") return "bg-purple-100 text-purple-700 border-purple-200";
    return "bg-blue-100 text-blue-700 border-blue-200";
  };

  const getTypeIcon = (type: string) => {
    if (type === "PDF") return "📄";
    if (type === "Video") return "🎥";
    return "📋";
  };

  const handleViewDocument = (doc: HandbookDocument) => {
    setSelectedDocument(doc);
    setShowDocumentModal(true);
  };
  const handleReadPdf = (doc: HandbookDocument) => {
    setPdfToView({
      fileUrl: doc.fileUrl,
      fileName: doc.fileName
    });
    setShowPdfViewer(true);
    setShowDocumentModal(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Auto-detect type from file extension
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext === 'pdf') {
        setUploadForm(prev => ({ ...prev, type: 'PDF' }));
      } else if (['mp4', 'avi', 'mov', 'wmv'].includes(ext || '')) {
        setUploadForm(prev => ({ ...prev, type: 'Video' }));
      } else {
        setUploadForm(prev => ({ ...prev, type: 'Document' }));
      }
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    try {
      // Upload file to Firebase Storage
      const fileUrl = await uploadHandbookFile(selectedFile, uploadForm.category, userId);

      // Create document record
      await createHandbookDocument({
        title: uploadForm.title,
        description: uploadForm.description,
        abstract: uploadForm.abstract,
        category: uploadForm.category,
        type: uploadForm.type,
        fileUrl,
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        uploadedBy: userId,
        uploaderName: userName,
        tags: uploadForm.tags.split(',').map(t => t.trim()).filter(Boolean),
        isActive: true
      });

      // Reset form
      setUploadForm({
        title: '',
        description: '',
        abstract: '',
        category: 'Student Handbook',
        type: 'PDF',
        tags: ''
      });
      setSelectedFile(null);
      alert('Document uploaded successfully!');
      setActiveTab('browse');
    } catch (error) {
      console.error('Error uploading document:', error);
      alert('Failed to upload document. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      await deleteHandbookDocument(id);
      alert('Document deleted successfully!');
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('Failed to delete document. Please try again.');
    }
  };

  return (
    <div className="p-3 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Documents & Resources</h2>
          <p className="text-gray-600 mt-1">
            Access important documents, handbooks, and regulations
          </p>
        </div>
      </div>

      {/* Tabs */}
      {isAdmin && (
        <div className="bg-white rounded-xl border border-gray-200 p-2 flex gap-2">
          <button
            onClick={() => setActiveTab('browse')}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'browse'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            📚 Browse Documents
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'upload'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Upload className="inline w-4 h-4 mr-2" />
            Upload Document
          </button>
        </div>
      )}

      {/* Browse Tab */}
      {activeTab === 'browse' && (
        <>
          {/* Search Bar */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search documents by title, category, or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-3 text-gray-600">Loading documents...</span>
            </div>
          )}

          {/* Categories */}
          {!loading && documentsByCategory.length === 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Documents Found</h3>
              <p className="text-gray-600">
                {searchTerm ? 'Try adjusting your search terms.' : 'No documents have been uploaded yet.'}
              </p>
            </div>
          )}

          {!loading && documentsByCategory.map((category, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className={`bg-gradient-to-r ${category.color} p-5 text-white`}>
                <h3 className="text-2xl font-bold">{category.category}</h3>
                <p className="text-white/90 text-sm mt-1">
                  {category.documents.length} documents available
                </p>
              </div>

              <div className="p-4 space-y-4">
                {category.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-blue-300"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 mb-1">{doc.title}</h4>
                      <p className="text-sm text-gray-600 mb-3">{doc.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className={`px-2 py-1 rounded-full font-semibold border ${getTypeColor(doc.type)}`}>
                          {doc.type}
                        </span>
                        <span>📦 {formatFileSize(doc.fileSize)}</span>
                        <span>📅 {doc.uploadDate.toLocaleDateString()}</span>
                        <span>👤 {doc.uploaderName}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                       {doc.type === 'PDF' && (
                        <button
                          onClick={() => handleReadPdf(doc)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Read
                        </button>
                      )}                      <button
                        onClick={() => handleViewDocument(doc)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
                      >
                        <span>📥</span> View
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => handleDelete(doc.id)}
                          className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Help Section */}
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
            <h3 className="text-2xl font-bold mb-2">Need Help Finding Documents?</h3>
            <p className="text-indigo-100 mb-4">
              Can't find what you're looking for? Contact student services or use the search feature above.
            </p>
            <div className="flex gap-3">
              <button className="px-6 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-colors">
                Contact Support
              </button>
              <button className="px-6 py-3 bg-indigo-600/50 text-white rounded-lg font-semibold hover:bg-indigo-600/70 transition-colors border border-white/30">
                Request Document
              </button>
            </div>
          </div>
        </>
      )}

      {/* Upload Tab (Admin Only) */}
      {activeTab === 'upload' && isAdmin && (
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Upload New Document</h3>

          <form onSubmit={handleUpload} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document Title *
              </label>
              <input
                type="text"
                required
                value={uploadForm.title}
                onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., HSB Student Handbook 2024-2025"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                required
                value={uploadForm.category}
                onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Student Handbook">Student Handbook</option>
                <option value="App Tutorials & Guides">App Tutorials & Guides</option>
                <option value="Government Regulations">Government Regulations</option>
                <option value="Academic Policies">Academic Policies</option>
                <option value="Campus Services">Campus Services</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <input
                type="text"
                required
                value={uploadForm.description}
                onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Brief description of the document"
              />
            </div>

            {/* Abstract */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Abstract *
              </label>
              <textarea
                required
                rows={4}
                value={uploadForm.abstract}
                onChange={(e) => setUploadForm({ ...uploadForm, abstract: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Detailed summary of what the document contains"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={uploadForm.tags}
                onChange={(e) => setUploadForm({ ...uploadForm, tags: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., policies, regulations, guidelines"
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload File *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  required
                  onChange={handleFileSelect}
                  accept=".pdf,.doc,.docx,.mp4,.avi,.mov"
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">
                    {selectedFile ? (
                      <span className="font-medium text-blue-600">{selectedFile.name}</span>
                    ) : (
                      <>Click to upload or drag and drop</>
                    )}
                  </p>
                  <p className="text-xs text-gray-500">
                    PDF, DOC, DOCX, MP4, AVI, MOV (max 100MB)
                  </p>
                </label>
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={uploading || !selectedFile}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Upload Document
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('browse')}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal */}
      {showDocumentModal && selectedDocument && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white flex justify-between items-start">
              <div className="flex flex-col">
                <h2 className="text-2xl font-bold mb-2">{selectedDocument.title}</h2>
                <div className="text-sm text-white/90 flex gap-4">
                  <span>📦 {formatFileSize(selectedDocument.fileSize)}</span>
                  <span>📅 {selectedDocument.uploadDate.toLocaleDateString()}</span>
                  <span>👤 {selectedDocument.uploaderName}</span>
                </div>
              </div>
              <button
                onClick={() => setShowDocumentModal(false)}
                className="ml-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="mb-4">
                <span className={`px-3 py-1 rounded-full font-semibold border text-sm ${getTypeColor(selectedDocument.type)}`}>
                  {selectedDocument.type}
                </span>
                <span className="ml-3 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                  {selectedDocument.category}
                </span>
              </div>

              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700 mb-4">{selectedDocument.description}</p>

              <h3 className="font-semibold text-gray-900 mb-2">Abstract</h3>
              <p className="text-gray-700 mb-4">{selectedDocument.abstract}</p>

              {selectedDocument.tags && selectedDocument.tags.length > 0 && (
                <>
                  <h3 className="font-semibold text-gray-900 mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedDocument.tags.map((tag, idx) => (
                      <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </>
              )}

              <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg p-12 text-center border-2 border-dashed border-gray-300">
                <div className="text-6xl mb-4">{getTypeIcon(selectedDocument.type)}</div>
                <p className="text-gray-600 font-medium mb-2">Document Preview</p>
                <p className="text-sm text-gray-500">
                  {selectedDocument.type === "PDF"
                    ? "PDF preview would appear here"
                    : selectedDocument.type === "Video"
                    ? "Video player would be embedded here"
                    : "Document preview would appear here"}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 p-6 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setShowDocumentModal(false)}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Close
              </button>
                {selectedDocument.type === 'PDF' && (
                <button
                  onClick={() => handleReadPdf(selectedDocument)}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
                >
                  <Eye className="w-5 h-5" />
                  Read PDF
                </button>
              )}
              <a
                href={selectedDocument.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
              >
                📥 Download
              </a>
            </div>
          </div>
        </div>
      )}
      
      {/* PDF Viewer */}
      {showPdfViewer && pdfToView && (
        <HandbookPdfViewer
          fileUrl={pdfToView.fileUrl}
          fileName={pdfToView.fileName}
          onClose={() => {
            setShowPdfViewer(false);
            setPdfToView(null);
          }}
        />
      )}
    </div>
  );
};

export default DocumentHandbook;
