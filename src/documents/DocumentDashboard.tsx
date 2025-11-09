// DocumentDashboard.tsx - Admin Dashboard for Document Management
import { useState, useEffect, useMemo } from 'react';
import {
  FileText, Upload, Download, Clock, AlertCircle, CheckCircle,
  Users, TrendingUp, Calendar, Filter, Eye, BarChart3
} from 'lucide-react';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase/firebase.config';
import {
  documentService,
  Document,
  DocumentCategory,
  DocumentRecipient
} from '../firebase/document.service';

interface DashboardStats {
  total: number;
  incoming: number;
  outgoing: number;
  pending: number;
  urgent: number;
  unread: number;
  readRate: number;
  todayUploads: number;
}

interface CategoryStat {
  categoryId: string;
  categoryName: string;
  icon: string;
  color: string;
  count: number;
}

interface RecentDocument extends Document {
  categoryData?: DocumentCategory;
}

interface DocumentDashboardProps {
  userId?: string;
  userRole?: 'admin' | 'staff';
}

export default function DocumentDashboard({ userId, userRole = 'admin' }: DocumentDashboardProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [recipients, setRecipients] = useState<DocumentRecipient[]>([]);
  const [categories, setCategories] = useState<DocumentCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'all'>('week');

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load categories first
      let cats = await documentService.getAllCategories();

      // Check for duplicates by name
      const categoryNames = cats.map(c => c.name);
      const hasDuplicates = categoryNames.length !== new Set(categoryNames).size;

      if (hasDuplicates) {
        console.log('[DocumentDashboard] Duplicates detected, re-initializing categories...');
        await documentService.reinitializeCategories();
        cats = await documentService.getAllCategories();
      }

      setCategories(cats);

      // Setup real-time listeners
      const documentsUnsub = onSnapshot(
        collection(db, 'documents'),
        (snapshot) => {
          const docs = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            uploadDate: doc.data().uploadDate?.toDate(),
            createdAt: doc.data().createdAt?.toDate(),
            updatedAt: doc.data().updatedAt?.toDate()
          })) as Document[];
          setDocuments(docs);
          setLoading(false);
        },
        (error) => {
          console.error('Error loading documents:', error);
          setLoading(false);
        }
      );

      const recipientsUnsub = onSnapshot(
        collection(db, 'document_recipients'),
        (snapshot) => {
          const recs = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            readAt: doc.data().readAt?.toDate(),
            createdAt: doc.data().createdAt?.toDate(),
            updatedAt: doc.data().updatedAt?.toDate()
          })) as DocumentRecipient[];
          setRecipients(recs);
        }
      );

      return () => {
        documentsUnsub();
        recipientsUnsub();
      };
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

  // Calculate statistics
  const stats: DashboardStats = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Filter by period
    let periodDocs = documents;
    if (selectedPeriod === 'today') {
      periodDocs = documents.filter(d => d.uploadDate && d.uploadDate >= today);
    } else if (selectedPeriod === 'week') {
      periodDocs = documents.filter(d => d.uploadDate && d.uploadDate >= weekAgo);
    } else if (selectedPeriod === 'month') {
      periodDocs = documents.filter(d => d.uploadDate && d.uploadDate >= monthAgo);
    }

    const total = periodDocs.length;
    const incoming = periodDocs.filter(d => d.type === 'incoming').length;
    const outgoing = periodDocs.filter(d => d.type === 'outgoing').length;
    const pending = periodDocs.filter(d => d.type === 'pending').length;
    const urgent = periodDocs.filter(d => d.priority === 'urgent').length;

    const totalRecipients = recipients.length;
    const unread = recipients.filter(r => !r.readStatus).length;
    const readRate = totalRecipients > 0 ? ((totalRecipients - unread) / totalRecipients) * 100 : 0;

    const todayUploads = documents.filter(d => d.uploadDate && d.uploadDate >= today).length;

    return {
      total,
      incoming,
      outgoing,
      pending,
      urgent,
      unread,
      readRate,
      todayUploads
    };
  }, [documents, recipients, selectedPeriod]);

  // Category statistics
  const categoryStats: CategoryStat[] = useMemo(() => {
    return categories.map(cat => {
      const count = documents.filter(d => d.category === cat.id).length;
      return {
        categoryId: cat.id!,
        categoryName: cat.name,
        icon: cat.icon,
        color: cat.color,
        count
      };
    }).sort((a, b) => b.count - a.count);
  }, [documents, categories]);

  // Recent documents
  const recentDocuments: RecentDocument[] = useMemo(() => {
    return [...documents]
      .sort((a, b) => (b.uploadDate?.getTime() || 0) - (a.uploadDate?.getTime() || 0))
      .slice(0, 10)
      .map(doc => ({
        ...doc,
        categoryData: categories.find(c => c.id === doc.category)
      }));
  }, [documents, categories]);

  // Priority distribution
  const priorityDistribution = useMemo(() => {
    return {
      normal: documents.filter(d => d.priority === 'normal').length,
      urgent: documents.filter(d => d.priority === 'urgent').length
    };
  }, [documents]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Document Management Dashboard</h1>
              <p className="text-gray-600 mt-1">Admin Office Overview</p>
            </div>

            {/* Period Filter */}
            <div className="flex gap-2">
              {['today', 'week', 'month', 'all'].map(period => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period as any)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    selectedPeriod === period
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {period === 'today' ? 'Today' :
                   period === 'week' ? 'This Week' :
                   period === 'month' ? 'This Month' : 'All Time'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Documents */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-600">Total Documents</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-sm text-gray-500 mt-1">In selected period</p>
          </div>

          {/* Today's Uploads */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Upload className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm font-medium text-gray-600">Today's Uploads</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.todayUploads}</p>
            <p className="text-sm text-green-600 mt-1 font-medium">New documents</p>
          </div>

          {/* Urgent Documents */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <span className="text-sm font-medium text-gray-600">Urgent</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.urgent}</p>
            <p className="text-sm text-red-600 mt-1 font-medium">Requires attention</p>
          </div>

          {/* Read Rate */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-gray-600">Read Rate</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.readRate.toFixed(1)}%</p>
            <p className="text-sm text-gray-500 mt-1">{stats.unread} unread</p>
          </div>
        </div>

        {/* Document Type Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Incoming */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-4">
              <Download className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Văn bản đến</h3>
            </div>
            <p className="text-4xl font-bold text-blue-600">{stats.incoming}</p>
            <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600"
                style={{ width: stats.total > 0 ? `${(stats.incoming / stats.total) * 100}%` : '0%' }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {stats.total > 0 ? ((stats.incoming / stats.total) * 100).toFixed(1) : 0}% of total
            </p>
          </div>

          {/* Outgoing */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-4">
              <Upload className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-gray-900">Văn bản đi</h3>
            </div>
            <p className="text-4xl font-bold text-green-600">{stats.outgoing}</p>
            <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-600"
                style={{ width: stats.total > 0 ? `${(stats.outgoing / stats.total) * 100}%` : '0%' }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {stats.total > 0 ? ((stats.outgoing / stats.total) * 100).toFixed(1) : 0}% of total
            </p>
          </div>

          {/* Pending */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-5 h-5 text-orange-600" />
              <h3 className="font-semibold text-gray-900">Văn bản chờ xử lý</h3>
            </div>
            <p className="text-4xl font-bold text-orange-600">{stats.pending}</p>
            <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-600"
                style={{ width: stats.total > 0 ? `${(stats.pending / stats.total) * 100}%` : '0%' }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {stats.total > 0 ? ((stats.pending / stats.total) * 100).toFixed(1) : 0}% of total
            </p>
          </div>
        </div>

        {/* Category Distribution and Recent Documents */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Distribution */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Documents by Category
            </h3>
            <div className="space-y-3">
              {categoryStats.slice(0, 7).map(cat => (
                <div key={cat.categoryId} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-xl">{cat.icon}</span>
                    <span className="text-sm font-medium text-gray-700">{cat.categoryName}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full"
                        style={{
                          width: documents.length > 0 ? `${(cat.count / documents.length) * 100}%` : '0%',
                          backgroundColor: cat.color
                        }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-8 text-right">{cat.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Priority Distribution */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Priority Distribution
            </h3>
            <div className="space-y-6 mt-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Normal Priority</span>
                  <span className="text-2xl font-bold text-gray-900">{priorityDistribution.normal}</span>
                </div>
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500"
                    style={{
                      width: documents.length > 0
                        ? `${(priorityDistribution.normal / documents.length) * 100}%`
                        : '0%'
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {documents.length > 0
                    ? ((priorityDistribution.normal / documents.length) * 100).toFixed(1)
                    : 0}% of all documents
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Urgent Priority</span>
                  <span className="text-2xl font-bold text-red-600">{priorityDistribution.urgent}</span>
                </div>
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500"
                    style={{
                      width: documents.length > 0
                        ? `${(priorityDistribution.urgent / documents.length) * 100}%`
                        : '0%'
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {documents.length > 0
                    ? ((priorityDistribution.urgent / documents.length) * 100).toFixed(1)
                    : 0}% of all documents
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Documents */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Recent Documents
          </h3>
          <div className="divide-y divide-gray-200">
            {recentDocuments.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No documents yet</p>
            ) : (
              recentDocuments.map(doc => (
                <div key={doc.id} className="py-4 flex items-center justify-between hover:bg-gray-50 px-4 -mx-4 rounded transition">
                  <div className="flex items-center gap-4 flex-1">
                    <FileText className="w-10 h-10 text-red-600" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">{doc.title}</h4>
                      <div className="flex items-center gap-4 mt-1">
                        {doc.categoryData && (
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium"
                            style={{
                              backgroundColor: `${doc.categoryData.color}20`,
                              color: doc.categoryData.color
                            }}
                          >
                            <span>{doc.categoryData.icon}</span>
                            <span>{doc.categoryData.name}</span>
                          </span>
                        )}
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          doc.type === 'incoming' ? 'bg-blue-100 text-blue-700' :
                          doc.type === 'outgoing' ? 'bg-green-100 text-green-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>
                          {doc.type === 'incoming' ? 'Đến' :
                           doc.type === 'outgoing' ? 'Đi' : 'Chờ xử lý'}
                        </span>
                        {doc.priority === 'urgent' && (
                          <span className="flex items-center gap-1 text-red-600 text-xs font-medium">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            Urgent
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      {doc.uploadDate?.toLocaleDateString('vi-VN')}
                    </p>
                    <p className="text-xs text-gray-400">
                      {doc.uploadDate?.toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
