// DocumentList.tsx - Bilingual Document Management with Overview Tab
import { useState, useEffect } from 'react';
import {
  FileText, Search, Filter, Eye, Download, X,
  AlertCircle, CheckCircle, Clock, Upload, Loader, Star
} from 'lucide-react';
import {
  collection, query, where, onSnapshot, orderBy,
  QuerySnapshot, DocumentData
} from 'firebase/firestore';
import { db } from '../firebase/firebase.config';
import {
  documentService,
  Document,
  DocumentRecipient,
  DocumentCategory,
  DocumentSource
} from '../firebase/document.service';
import DocumentPdfViewer from './DocumentPdfViewer';

type DocumentTab = 'overview' | 'incoming' | 'outgoing' | 'pending';
type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface EnrichedDocument extends Document {
  categoryData?: DocumentCategory;
  recipientData?: DocumentRecipient;
}

interface DocumentListProps {
  userId: string; // Current user's ID (Student_Code or Staff ID)
  userName?: string;
  userType?: 'student' | 'staff' | 'management';
}

// Source labels with bilingual support and colors
const sourceLabels: Record<DocumentSource, { en: string; vi: string; color: string }> = {
  'Party': { en: 'Party', vi: 'Đảng', color: '#DC2626' },
  'Government': { en: 'Government', vi: 'Chính phủ', color: '#EA580C' },
  'MOET': { en: 'MOET', vi: 'Bộ GD&ĐT', color: '#CA8A04' },
  'VNU': { en: 'VNU', vi: 'ĐHQG', color: '#16A34A' },
  'HSB': { en: 'HSB', vi: 'HSB', color: '#2563EB' },
  'Other': { en: 'Other', vi: 'Khác', color: '#64748B' }
};

export default function DocumentList({ userId, userName, userType = 'student' }: DocumentListProps) {
  const [activeTab, setActiveTab] = useState<DocumentTab>('overview');
  const [documents, setDocuments] = useState<EnrichedDocument[]>([]);
  const [categories, setCategories] = useState<DocumentCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSource, setSelectedSource] = useState<DocumentSource | 'all'>('all');
  const [toasts, setToasts] = useState<Toast[]>([]);

  // PDF Viewer state
  const [viewingDocument, setViewingDocument] = useState<EnrichedDocument | null>(null);

  // Toast helper
  const showToast = (message: string, type: ToastType = 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Load categories
  useEffect(() => {
    loadCategories();
  }, []);

  // Load documents based on active tab
  useEffect(() => {
    setLoading(true);
    loadDocuments();
  }, [activeTab, userId]);

  const loadCategories = async () => {
    try {
      let cats = await documentService.getAllCategories();

      // Check for duplicates by name
      const categoryNames = cats.map(c => c.name);
      const hasDuplicates = categoryNames.length !== new Set(categoryNames).size;

      if (hasDuplicates) {
        console.log('[DocumentList] Duplicates detected, re-initializing categories...');
        await documentService.reinitializeCategories();
        cats = await documentService.getAllCategories();
      }

      setCategories(cats);
    } catch (error) {
      console.error('Error loading categories:', error);
      showToast('Failed to load categories / Lỗi tải danh mục', 'error');
    }
  };

  const loadDocuments = () => {
    let unsubscribe: () => void;

    if (activeTab === 'overview') {
      // Overview: Show all documents with important sources
      loadAllDocuments();
      return;
    } else if (activeTab === 'outgoing') {
      // Outgoing: Documents uploaded by current user
      const q = query(
        collection(db, 'documents'),
        where('uploaderId', '==', userId),
        where('type', '==', 'outgoing'),
        orderBy('uploadDate', 'desc')
      );

      unsubscribe = onSnapshot(q,
        async (snapshot) => {
          const docs = await enrichDocuments(snapshot);
          setDocuments(docs);
          setLoading(false);
        },
        (error) => {
          console.error('Error loading outgoing documents:', error);
          showToast('Failed to load outgoing documents / Lỗi tải văn bản đi', 'error');
          setLoading(false);
        }
      );
    } else {
      // Incoming or Pending: Get recipient records first, then fetch documents
      loadRecipientDocuments();
      return;
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  };

  const loadAllDocuments = () => {
    const q = query(
      collection(db, 'documents'),
      orderBy('uploadDate', 'desc')
    );

    const unsubscribe = onSnapshot(q,
      async (snapshot) => {
        const docs = await enrichDocuments(snapshot);
        setDocuments(docs);
        setLoading(false);
      },
      (error) => {
        console.error('Error loading all documents:', error);
        showToast('Failed to load documents / Lỗi tải văn bản', 'error');
        setLoading(false);
      }
    );

    return unsubscribe;
  };

  const loadRecipientDocuments = async () => {
    try {
      // Query document_recipients collection for current user
      const recipientsQuery = query(
        collection(db, 'document_recipients'),
        where('recipientId', '==', userId)
      );

      const unsubscribe = onSnapshot(recipientsQuery,
        async (recipientSnapshot) => {
          const recipientRecords = recipientSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as DocumentRecipient[];

          if (recipientRecords.length === 0) {
            setDocuments([]);
            setLoading(false);
            return;
          }

          // Get unique document IDs
          const docIds = [...new Set(recipientRecords.map(r => r.docId))];

          // Fetch documents in batches (Firestore 'in' query limit: 10)
          const allDocs: EnrichedDocument[] = [];
          const batchSize = 10;

          for (let i = 0; i < docIds.length; i += batchSize) {
            const batch = docIds.slice(i, i + batchSize);
            const docsQuery = query(
              collection(db, 'documents'),
              where('__name__', 'in', batch)
            );

            const docsSnapshot = await new Promise<QuerySnapshot<DocumentData>>((resolve) => {
              const unsub = onSnapshot(docsQuery, (snapshot) => {
                resolve(snapshot);
                unsub();
              });
            });

            for (const docSnap of docsSnapshot.docs) {
              const docData = {
                id: docSnap.id,
                ...docSnap.data(),
                uploadDate: docSnap.data().uploadDate?.toDate(),
                createdAt: docSnap.data().createdAt?.toDate(),
                updatedAt: docSnap.data().updatedAt?.toDate()
              } as Document;

              // Filter by tab
              if (activeTab === 'incoming' && docData.type === 'incoming') {
                const recipient = recipientRecords.find(r => r.docId === docData.id);
                allDocs.push({ ...docData, recipientData: recipient });
              } else if (activeTab === 'pending' && docData.type === 'pending') {
                const recipient = recipientRecords.find(r => r.docId === docData.id);
                // Only show unread pending documents
                if (recipient && !recipient.readStatus) {
                  allDocs.push({ ...docData, recipientData: recipient });
                }
              }
            }
          }

          // Enrich with category data
          const enrichedDocs = await Promise.all(
            allDocs.map(async (doc) => {
              const category = categories.find(c => c.id === doc.category);
              return { ...doc, categoryData: category };
            })
          );

          // Sort by upload date
          enrichedDocs.sort((a, b) =>
            (b.uploadDate?.getTime() || 0) - (a.uploadDate?.getTime() || 0)
          );

          setDocuments(enrichedDocs);
          setLoading(false);
        },
        (error) => {
          console.error('Error loading recipient documents:', error);
          showToast('Failed to load documents / Lỗi tải văn bản', 'error');
          setLoading(false);
        }
      );

      return unsubscribe;
    } catch (error) {
      console.error('Error loading recipient documents:', error);
      showToast('Failed to load documents / Lỗi tải văn bản', 'error');
      setLoading(false);
    }
  };

  const enrichDocuments = async (snapshot: QuerySnapshot<DocumentData>): Promise<EnrichedDocument[]> => {
    const docs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      uploadDate: doc.data().uploadDate?.toDate(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    })) as Document[];

    // Enrich with category data
    return Promise.all(
      docs.map(async (doc) => {
        const category = categories.find(c => c.id === doc.category);
        return { ...doc, categoryData: category };
      })
    );
  };

  // Filter documents
  const filteredDocuments = documents.filter(doc => {
    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchesTitle = doc.title?.toLowerCase().includes(term);
      const matchesDescription = doc.description?.toLowerCase().includes(term);
      if (!matchesTitle && !matchesDescription) return false;
    }

    // Category filter
    if (selectedCategory !== 'all' && doc.category !== selectedCategory) {
      return false;
    }

    // Source filter (Overview tab)
    if (activeTab === 'overview' && selectedSource !== 'all' && doc.source !== selectedSource) {
      return false;
    }

    return true;
  });

  // Handle document click
  const handleDocumentClick = async (doc: EnrichedDocument) => {
    setViewingDocument(doc);

    // Mark as read if it's incoming or pending and unread
    if ((activeTab === 'incoming' || activeTab === 'pending') &&
        doc.recipientData && !doc.recipientData.readStatus) {
      try {
        await documentService.markAsRead(doc.id!, userId);
        showToast('Document marked as read / Đã đánh dấu đã đọc', 'success');
      } catch (error) {
        console.error('Error marking as read:', error);
      }
    }
  };

  // Close viewer
  const handleCloseViewer = () => {
    setViewingDocument(null);
  };

  // Get unread count for badge
  const getUnreadCount = () => {
    if (activeTab === 'incoming') {
      return documents.filter(d => d.recipientData && !d.recipientData.readStatus).length;
    } else if (activeTab === 'pending') {
      return documents.length; // All pending are unread by definition
    }
    return 0;
  };

  // Get important documents count for Overview
  const getImportantDocsCount = () => {
    return documents.filter(d => d.source && d.source !== 'Other').length;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg max-w mx-auto max-h-[calc(100vh-120px)] flex flex-col">
      {/* Header - Fixed */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-2">
          <FileText className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">
            Document Management / Quản lý văn bản
          </h2>
        </div>
        {userName && (
          <div className="text-sm text-gray-600">
            <span className="font-medium">{userName}</span>
          </div>
        )}
      </div>

      {/* Tabs - Fixed */}
      <div className="flex gap-2 px-6 pt-4 border-b border-gray-200 flex-shrink-0">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-3 font-medium transition relative ${
            activeTab === 'overview'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            <span>Overview / Tổng quan</span>
            {activeTab === 'overview' && getImportantDocsCount() > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-purple-500 text-white text-xs rounded-full">
                {getImportantDocsCount()}
              </span>
            )}
          </div>
        </button>

        <button
          onClick={() => setActiveTab('incoming')}
          className={`px-4 py-3 font-medium transition relative ${
            activeTab === 'incoming'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            <span>Incoming / Văn bản đến</span>
            {activeTab === 'incoming' && getUnreadCount() > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                {getUnreadCount()}
              </span>
            )}
          </div>
        </button>

        <button
          onClick={() => setActiveTab('outgoing')}
          className={`px-4 py-3 font-medium transition ${
            activeTab === 'outgoing'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            <span>Outgoing / Văn bản đi</span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-3 font-medium transition relative ${
            activeTab === 'pending'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Pending / Chờ xử lý</span>
            {activeTab === 'pending' && documents.length > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-orange-500 text-white text-xs rounded-full">
                {documents.length}
              </span>
            )}
          </div>
        </button>
      </div>

      {/* Filters - Fixed */}
      <div className="px-6 py-4 space-y-3 border-b border-gray-200 flex-shrink-0">
        <div className="flex gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search / Tìm kiếm..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="w-64">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories / Tất cả</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Source Filter (Overview Tab Only) */}
        {activeTab === 'overview' && (
          <div className="flex gap-2 items-center flex-wrap">
            <span className="text-sm font-medium text-gray-700">
              Source / Nguồn:
            </span>
            <button
              onClick={() => setSelectedSource('all')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                selectedSource === 'all'
                  ? 'bg-gray-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All / Tất cả
            </button>
            {(['Party', 'Government', 'MOET', 'VNU', 'HSB'] as DocumentSource[]).map(source => (
              <button
                key={source}
                onClick={() => setSelectedSource(source)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                  selectedSource === source
                    ? 'text-white'
                    : 'hover:opacity-80'
                }`}
                style={{
                  backgroundColor: selectedSource === source ? sourceLabels[source].color : `${sourceLabels[source].color}20`,
                  color: selectedSource === source ? 'white' : sourceLabels[source].color
                }}
              >
                {sourceLabels[source].en} / {sourceLabels[source].vi}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Document List - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="border-b border-gray-200">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">
                No documents found / Không tìm thấy văn bản
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
                >
                  Clear search / Xóa tìm kiếm
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {/* Table Header */}
              <div className="bg-gray-50 px-6 py-3 grid grid-cols-12 gap-4 text-sm font-medium text-gray-700 sticky top-0">
                <div className="col-span-4">Title / Tiêu đề</div>
                {activeTab === 'overview' && <div className="col-span-2">Source / Nguồn</div>}
                <div className={activeTab === 'overview' ? 'col-span-2' : 'col-span-2'}>Category / Danh mục</div>
                <div className="col-span-2">Date / Ngày</div>
                <div className="col-span-2">Priority / Ưu tiên</div>
                <div className="col-span-1 text-center">Status / Trạng thái</div>
              </div>

              {/* Table Body */}
              {filteredDocuments.map(doc => (
                <div
                  key={doc.id}
                  onClick={() => handleDocumentClick(doc)}
                  className="px-6 py-4 grid grid-cols-12 gap-4 items-center hover:bg-blue-50 cursor-pointer transition"
                >
                  {/* Title */}
                  <div className={activeTab === 'overview' ? 'col-span-4' : 'col-span-4'}>
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <h3 className="font-medium text-gray-900 hover:text-blue-600 truncate">
                          {doc.title}
                        </h3>
                        {doc.description && (
                          <p className="text-sm text-gray-500 line-clamp-1 mt-1">
                            {doc.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Source Badge (Overview Only) */}
                  {activeTab === 'overview' && (
                    <div className="col-span-2">
                      {doc.source && doc.source !== 'Other' ? (
                        <span
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium text-white"
                          style={{
                            backgroundColor: sourceLabels[doc.source].color
                          }}
                        >
                          <Star className="w-3 h-3" />
                          <span>{sourceLabels[doc.source].vi}</span>
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </div>
                  )}

                  {/* Category Badge */}
                  <div className="col-span-2">
                    {doc.categoryData ? (
                      <span
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium truncate max-w-full"
                        style={{
                          backgroundColor: `${doc.categoryData.color}20`,
                          color: doc.categoryData.color
                        }}
                      >
                        <span>{doc.categoryData.icon}</span>
                        <span className="truncate">{doc.categoryData.name}</span>
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500">Unknown</span>
                    )}
                  </div>

                  {/* Date */}
                  <div className="col-span-2">
                    <div className="text-sm text-gray-600">
                      {doc.uploadDate ? doc.uploadDate.toLocaleDateString('vi-VN') : 'N/A'}
                    </div>
                    <div className="text-xs text-gray-400">
                      {doc.uploadDate ? doc.uploadDate.toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : ''}
                    </div>
                  </div>

                  {/* Priority Indicator */}
                  <div className="col-span-2">
                    <div className="flex items-center gap-2">
                      {doc.priority === 'urgent' ? (
                        <>
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                          <span className="text-sm font-medium text-red-600">
                            Urgent / Khẩn
                          </span>
                        </>
                      ) : (
                        <>
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                          <span className="text-sm text-gray-600">
                            Normal / Bình thường
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Read/Unread Status */}
                  <div className="col-span-1 flex justify-center">
                    {activeTab !== 'outgoing' && activeTab !== 'overview' && doc.recipientData && (
                      doc.recipientData.readStatus ? (
                        <div title="Read / Đã đọc">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                      ) : (
                        <div title="Unread / Chưa đọc">
                          <AlertCircle className="w-5 h-5 text-orange-500" />
                        </div>
                      )
                    )}
                    {(activeTab === 'outgoing' || activeTab === 'overview') && (
                      <div title="View / Xem">
                        <Eye className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Document count - Fixed */}
      {!loading && filteredDocuments.length > 0 && (
        <div className="px-6 py-3 text-sm text-gray-600 text-center border-t border-gray-200 flex-shrink-0">
          Showing {filteredDocuments.length} document{filteredDocuments.length !== 1 ? 's' : ''} /
          Hiển thị {filteredDocuments.length} văn bản
        </div>
      )}

      {/* PDF Viewer Modal */}
      {viewingDocument && (
        <DocumentPdfViewer
          document={viewingDocument}
          onClose={handleCloseViewer}
        />
      )}

      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${
              toast.type === 'success' ? 'bg-green-500' :
              toast.type === 'error' ? 'bg-red-500' :
              'bg-blue-500'
            } text-white min-w-[300px] animate-slide-in`}
          >
            {toast.type === 'success' && <CheckCircle className="w-5 h-5" />}
            {toast.type === 'error' && <X className="w-5 h-5" />}
            {toast.type === 'info' && <AlertCircle className="w-5 h-5" />}
            <span className="flex-1">{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
