// DocumentUploadV2.tsx - Bilingual with Source Tags
import { useState, useEffect } from 'react';
import { Upload, X, Search, Users, CheckCircle, XCircle, AlertCircle, Loader, FileText, Tag } from 'lucide-react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/firebase.config';
import { documentService, DocumentCategory, DocumentSource } from '../firebase/document.service';
import { getZohoUsers, ZohoUser } from '../zoho/zoho-api';

type DocumentType = 'incoming' | 'outgoing' | 'pending';
type RecipientType = 'student' | 'staff' | 'management';
type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface Recipient {
  id: string;
  name: string;
  email?: string;
  type: RecipientType;
}

interface DocumentUploadProps {
  uploaderId: string;
  uploaderName: string;
  onSuccess?: (docId: string) => void;
  onClose?: () => void;
}

// Source labels (bilingual)
const sourceLabels: Record<DocumentSource, { en: string; vi: string; color: string }> = {
  'Party': { en: 'Party', vi: 'Đảng', color: '#DC2626' },
  'Government': { en: 'Government', vi: 'Chính phủ', color: '#EA580C' },
  'MOET': { en: 'MOET', vi: 'Bộ GD&ĐT', color: '#CA8A04' },
  'VNU': { en: 'VNU', vi: 'ĐHQG', color: '#16A34A' },
  'HSB': { en: 'HSB', vi: 'HSB', color: '#2563EB' },
  'Other': { en: 'Other', vi: 'Khác', color: '#64748B' }
};

export default function DocumentUploadV2({
  uploaderId,
  uploaderName,
  onSuccess,
  onClose
}: DocumentUploadProps) {
  // Form state
  const [title, setTitle] = useState('');
  const [type, setType] = useState<DocumentType>('incoming');
  const [categoryId, setCategoryId] = useState('');
  const [priority, setPriority] = useState<'normal' | 'urgent'>('normal');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [source, setSource] = useState<DocumentSource>('HSB');
  const [customTags, setCustomTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  // Categories
  const [categories, setCategories] = useState<DocumentCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Recipients
  const [searchTerm, setSearchTerm] = useState('');
  const [recipientType, setRecipientType] = useState<RecipientType>('student');
  const [allStudents, setAllStudents] = useState<ZohoUser[]>([]);
  const [allLecturers, setAllLecturers] = useState<ZohoUser[]>([]);
  const [selectedRecipients, setSelectedRecipients] = useState<Recipient[]>([]);
  const [loadingRecipients, setLoadingRecipients] = useState(false);

  // Upload state
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Toast notifications
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Toast helper
  const showToast = (message: string, type: ToastType = 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Load categories on mount
  useEffect(() => {
    loadCategories();
  }, []);

  // Load recipients when type changes
  useEffect(() => {
    loadRecipients();
  }, [recipientType]);

  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      let cats = await documentService.getAllCategories();

      if (cats.length === 0) {
        await documentService.initializeDefaultCategories();
        cats = await documentService.getAllCategories();
      } else {
        // Check for duplicates by name
        const categoryNames = cats.map(c => c.name);
        const hasDuplicates = categoryNames.length !== new Set(categoryNames).size;

        if (hasDuplicates) {
          console.log('[DocumentUpload] Duplicates detected, re-initializing categories...');
          await documentService.reinitializeCategories();
          cats = await documentService.getAllCategories();
        }
      }

      setCategories(cats);

      if (cats.length > 0 && !categoryId) {
        setCategoryId(cats[0].id || '');
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      showToast('Failed to load categories', 'error');
    } finally {
      setLoadingCategories(false);
    }
  };

  const loadRecipients = async () => {
    try {
      setLoadingRecipients(true);

      if (recipientType === 'student' && allStudents.length === 0) {
        const students = await getZohoUsers({ type: 'students' });
        setAllStudents(students);
      } else if ((recipientType === 'management' || recipientType === 'staff') && allLecturers.length === 0) {
        const lecturers = await getZohoUsers({ type: 'lecturers' });
        setAllLecturers(lecturers);
      }
    } catch (error) {
      console.error('Error loading recipients:', error);
      showToast('Failed to load recipients / Không tải được người nhận', 'error');
    } finally {
      setLoadingRecipients(false);
    }
  };

  // Filter recipients based on search
  const filteredRecipients = (): ZohoUser[] => {
    const source = recipientType === 'student' ? allStudents : allLecturers;

    if (!searchTerm.trim()) return source;

    const term = searchTerm.toLowerCase();
    return source.filter(user =>
      user.Name?.toLowerCase().includes(term) ||
      user.Student_Code?.toLowerCase().includes(term) ||
      user.Email?.toLowerCase().includes(term) ||
      user.ID?.toLowerCase().includes(term)
    );
  };

  // Add recipient
  const addRecipient = (user: ZohoUser) => {
    const recipient: Recipient = {
      id: user.Student_Code || user.ID || '',
      name: user.Name || 'Unknown',
      email: user.Email,
      type: recipientType
    };

    if (selectedRecipients.find(r => r.id === recipient.id)) {
      showToast('Recipient already added / Người nhận đã được thêm', 'info');
      return;
    }

    setSelectedRecipients(prev => [...prev, recipient]);
    setSearchTerm('');
  };

  // Remove recipient
  const removeRecipient = (recipientId: string) => {
    setSelectedRecipients(prev => prev.filter(r => r.id !== recipientId));
  };

  // Select all of current type
  const selectAllCurrentType = () => {
    const source = recipientType === 'student' ? allStudents : allLecturers;
    const newRecipients: Recipient[] = source
      .filter(user => !selectedRecipients.find(r => r.id === (user.Student_Code || user.ID)))
      .map(user => ({
        id: user.Student_Code || user.ID || '',
        name: user.Name || 'Unknown',
        email: user.Email,
        type: recipientType
      }));

    setSelectedRecipients(prev => [...prev, ...newRecipients]);
    showToast(`Added ${newRecipients.length} ${recipientType}s / Đã thêm ${newRecipients.length} người`, 'success');
  };

  // Add custom tag
  const addCustomTag = () => {
    const tag = tagInput.trim();
    if (tag && !customTags.includes(tag)) {
      setCustomTags(prev => [...prev, tag]);
      setTagInput('');
    }
  };

  // Remove custom tag
  const removeCustomTag = (tag: string) => {
    setCustomTags(prev => prev.filter(t => t !== tag));
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    // Validate PDF
    if (selectedFile.type !== 'application/pdf') {
      showToast('Only PDF files are allowed / Chỉ chấp nhận file PDF', 'error');
      return;
    }

    // Validate size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      showToast('File size must be less than 10MB / Kích thước tối đa 10MB', 'error');
      return;
    }

    setFile(selectedFile);
  };

  // Upload document
  const handleUpload = async () => {
    // Validation
    if (!title.trim()) {
      showToast('Please enter document title / Vui lòng nhập tiêu đề', 'error');
      return;
    }

    if (!categoryId) {
      showToast('Please select a category / Vui lòng chọn danh mục', 'error');
      return;
    }

    if (!file) {
      showToast('Please select a PDF file / Vui lòng chọn file PDF', 'error');
      return;
    }

    if (selectedRecipients.length === 0) {
      showToast('Please add at least one recipient / Vui lòng thêm người nhận', 'error');
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      // Upload file to Firebase Storage
      const fileRef = ref(storage, `documents/${Date.now()}-${file.name}`);
      const uploadTask = uploadBytesResumable(fileRef, file);

      // Track upload progress
      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error('Upload error:', error);
          showToast('File upload failed / Tải file thất bại', 'error');
          setUploading(false);
        }
      );

      // Wait for upload to complete
      await uploadTask;
      const fileUrl = await getDownloadURL(fileRef);

      // Create document in Firestore
      const docId = await documentService.createDocument({
        title: title.trim(),
        type,
        category: categoryId,
        fileUrl,
        uploaderId,
        uploadDate: new Date(),
        priority,
        status: 'approved',
        description: description.trim() || undefined,
        tags: customTags,
        source
      });

      // Create recipient records
      const recipientRecords = selectedRecipients.map(recipient => ({
        docId,
        recipientId: recipient.id,
        recipientType: recipient.type,
        recipientName: recipient.name,
        recipientEmail: recipient.email,
        readStatus: false
      }));

      await documentService.addRecipients(recipientRecords);

      // Success
      showToast(
        `Document uploaded successfully! ${selectedRecipients.length} recipient(s) notified / Tải lên thành công! Đã thông báo ${selectedRecipients.length} người`,
        'success'
      );

      // Reset form
      setTitle('');
      setDescription('');
      setFile(null);
      setSelectedRecipients([]);
      setCustomTags([]);
      setUploadProgress(0);

      // Callback
      if (onSuccess) {
        onSuccess(docId);
      }

    } catch (error) {
      console.error('Error uploading document:', error);
      showToast('Failed to upload document / Tải lên thất bại', 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Upload className="w-6 h-6 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Upload Document / Tải lên văn bản</h2>
            <p className="text-sm text-gray-600">Fill in details and select recipients / Điền thông tin và chọn người nhận</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Form */}
      <div className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Document Title / Tiêu đề văn bản *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter document title... / Nhập tiêu đề..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={uploading}
          />
        </div>

        {/* Type, Category, and Source Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Document Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document Type / Loại văn bản *
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as DocumentType)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={uploading}
            >
              <option value="incoming">Incoming / Văn bản đến</option>
              <option value="outgoing">Outgoing / Văn bản đi</option>
              <option value="pending">Pending / Văn bản chờ xử lý</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category / Danh mục *
            </label>
            {loadingCategories ? (
              <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg">
                <Loader className="w-4 h-4 animate-spin" />
                <span className="text-sm text-gray-500">Loading...</span>
              </div>
            ) : (
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={uploading}
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Source */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Source / Nguồn *
            </label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value as DocumentSource)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={uploading}
            >
              {(Object.keys(sourceLabels) as DocumentSource[]).map(src => (
                <option key={src} value={src}>
                  {sourceLabels[src].en} / {sourceLabels[src].vi}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Priority Toggle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Priority / Mức độ ưu tiên
          </label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setPriority('normal')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
                priority === 'normal'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              disabled={uploading}
            >
              Normal / Bình thường
            </button>
            <button
              type="button"
              onClick={() => setPriority('urgent')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
                priority === 'urgent'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              disabled={uploading}
            >
              Urgent / Khẩn cấp
            </button>
          </div>
        </div>

        {/* Custom Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Custom Tags / Nhãn tùy chỉnh (optional / tùy chọn)
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomTag())}
              placeholder="Add tag... / Thêm nhãn..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={uploading}
            />
            <button
              type="button"
              onClick={addCustomTag}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition flex items-center gap-2"
              disabled={uploading}
            >
              <Tag className="w-4 h-4" />
              Add / Thêm
            </button>
          </div>
          {customTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {customTags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                  {!uploading && (
                    <button
                      onClick={() => removeCustomTag(tag)}
                      className="hover:text-purple-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description / Mô tả (optional / tùy chọn)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description... / Nhập mô tả..."
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            disabled={uploading}
          />
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            PDF File / Tệp PDF *
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            {!file ? (
              <label className="cursor-pointer block">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={uploading}
                />
                <FileText className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">
                  Click to upload PDF file (max 10MB) / Nhấn để tải lên file PDF (tối đa 10MB)
                </p>
              </label>
            ) : (
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-red-600" />
                  <div className="text-left">
                    <p className="font-medium text-gray-800">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                {!uploading && (
                  <button
                    onClick={() => setFile(null)}
                    className="p-2 hover:bg-gray-200 rounded-full transition"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Upload Progress */}
        {uploading && uploadProgress > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Uploading... / Đang tải lên...</span>
              <span className="text-sm text-gray-600">{Math.round(uploadProgress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Recipients Section */}
        <div className="border-t pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-gray-700" />
            <h3 className="text-lg font-semibold text-gray-800">Recipients / Người nhận</h3>
            <span className="ml-auto text-sm text-gray-600">
              {selectedRecipients.length} selected / đã chọn
            </span>
          </div>

          {/* Recipient Type Selector */}
          <div className="flex gap-2 mb-4">
            <button
              type="button"
              onClick={() => setRecipientType('student')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                recipientType === 'student'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              disabled={uploading}
            >
              Students / SV
            </button>
            <button
              type="button"
              onClick={() => setRecipientType('staff')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                recipientType === 'staff'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              disabled={uploading}
            >
              Staff / CB
            </button>
            <button
              type="button"
              onClick={() => setRecipientType('management')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                recipientType === 'management'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              disabled={uploading}
            >
              Management / QL
            </button>
            <button
              type="button"
              onClick={selectAllCurrentType}
              className="ml-auto px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
              disabled={uploading || loadingRecipients}
            >
              Select All / Chọn tất cả
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Search by name, ID, email... / Tìm theo tên, mã, email...`}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={uploading}
            />
          </div>

          {/* Search Results */}
          {searchTerm && (
            <div className="mb-4 max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
              {loadingRecipients ? (
                <div className="p-4 text-center">
                  <Loader className="w-5 h-5 animate-spin mx-auto text-gray-400" />
                </div>
              ) : filteredRecipients().length === 0 ? (
                <div className="p-4 text-center text-gray-500">No results found / Không tìm thấy</div>
              ) : (
                <div className="divide-y">
                  {filteredRecipients().slice(0, 10).map(user => (
                    <button
                      key={user.Student_Code || user.ID}
                      type="button"
                      onClick={() => addRecipient(user)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 transition flex items-center justify-between"
                      disabled={uploading}
                    >
                      <div>
                        <p className="font-medium text-gray-800">{user.Name}</p>
                        <p className="text-sm text-gray-500">
                          {user.Student_Code || user.ID} {user.Email ? `• ${user.Email}` : ''}
                        </p>
                      </div>
                      <span className="text-blue-600 text-sm">Add / Thêm</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Selected Recipients */}
          {selectedRecipients.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Selected / Đã chọn:</p>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {selectedRecipients.map(recipient => (
                  <div
                    key={recipient.id}
                    className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        recipient.type === 'student' ? 'bg-blue-100 text-blue-700' :
                        recipient.type === 'management' ? 'bg-purple-100 text-purple-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {recipient.type === 'student' ? 'Student / SV' :
                         recipient.type === 'staff' ? 'Staff / CB' :
                         recipient.type === 'management' ? 'Management / QL' : recipient.type}
                      </span>
                      <div>
                        <p className="font-medium text-gray-800">{recipient.name}</p>
                        <p className="text-xs text-gray-500">{recipient.id}</p>
                      </div>
                    </div>
                    {!uploading && (
                      <button
                        onClick={() => removeRecipient(recipient.id)}
                        className="p-1 hover:bg-gray-200 rounded transition"
                      >
                        <X className="w-4 h-4 text-gray-600" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4 border-t sticky bottom-0 bg-white">
          {onClose && (
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
              disabled={uploading}
            >
              Cancel / Hủy
            </button>
          )}
          <button
            onClick={handleUpload}
            disabled={uploading || !title || !file || selectedRecipients.length === 0}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Uploading... / Đang tải...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Upload / Tải lên
              </>
            )}
          </button>
        </div>
      </div>

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
            {toast.type === 'error' && <XCircle className="w-5 h-5" />}
            {toast.type === 'info' && <AlertCircle className="w-5 h-5" />}
            <span className="flex-1">{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
