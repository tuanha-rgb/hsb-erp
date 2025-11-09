// CategoryManager.tsx - Utility to manage document categories
import { useState } from 'react';
import { AlertCircle, CheckCircle, RefreshCw, Trash2, Loader } from 'lucide-react';
import { documentService, DocumentCategory } from '../firebase/document.service';

export default function CategoryManager() {
  const [categories, setCategories] = useState<DocumentCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Load current categories
  const loadCategories = async () => {
    try {
      setLoading(true);
      const cats = await documentService.getAllCategories();
      setCategories(cats);
      setMessage({ type: 'info', text: `Loaded ${cats.length} categories` });
    } catch (error) {
      console.error('Error loading categories:', error);
      setMessage({ type: 'error', text: 'Failed to load categories' });
    } finally {
      setLoading(false);
    }
  };

  // Clear all categories
  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to delete ALL categories? This cannot be undone!')) {
      return;
    }

    try {
      setLoading(true);
      setMessage({ type: 'info', text: 'Clearing all categories...' });
      await documentService.clearAllCategories();
      setCategories([]);
      setMessage({ type: 'success', text: 'All categories cleared successfully!' });
    } catch (error) {
      console.error('Error clearing categories:', error);
      setMessage({ type: 'error', text: 'Failed to clear categories' });
    } finally {
      setLoading(false);
    }
  };

  // Initialize default categories
  const handleInitialize = async () => {
    try {
      setLoading(true);
      setMessage({ type: 'info', text: 'Initializing default categories...' });
      await documentService.initializeDefaultCategories();
      await loadCategories();
      setMessage({ type: 'success', text: 'Default categories initialized successfully!' });
    } catch (error) {
      console.error('Error initializing categories:', error);
      setMessage({ type: 'error', text: 'Failed to initialize categories' });
    } finally {
      setLoading(false);
    }
  };

  // Re-initialize (clear + initialize)
  const handleReinitialize = async () => {
    if (!window.confirm('This will DELETE all existing categories and create new bilingual ones. Continue?')) {
      return;
    }

    try {
      setLoading(true);
      setMessage({ type: 'info', text: 'Re-initializing categories...' });
      await documentService.reinitializeCategories();
      await loadCategories();
      setMessage({ type: 'success', text: 'Categories re-initialized successfully with bilingual names!' });
    } catch (error) {
      console.error('Error re-initializing categories:', error);
      setMessage({ type: 'error', text: 'Failed to re-initialize categories' });
    } finally {
      setLoading(false);
    }
  };

  // Delete specific category
  const handleDeleteCategory = async (categoryId: string, categoryName: string) => {
    if (!window.confirm(`Delete category "${categoryName}"?`)) {
      return;
    }

    try {
      setLoading(true);
      await documentService.deleteCategory(categoryId);
      await loadCategories();
      setMessage({ type: 'success', text: `Deleted "${categoryName}"` });
    } catch (error) {
      console.error('Error deleting category:', error);
      setMessage({ type: 'error', text: 'Failed to delete category' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Document Category Manager</h2>
        <p className="text-gray-600">Manage document categories and fix duplicates</p>
      </div>

      {/* Message */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
          message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
          message.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' :
          'bg-blue-50 text-blue-800 border border-blue-200'
        }`}>
          {message.type === 'success' && <CheckCircle className="w-5 h-5" />}
          {message.type === 'error' && <AlertCircle className="w-5 h-5" />}
          {message.type === 'info' && <AlertCircle className="w-5 h-5" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <button
          onClick={loadCategories}
          disabled={loading}
          className="px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:bg-gray-300 flex items-center justify-center gap-2"
        >
          {loading ? <Loader className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
          Load Categories
        </button>

        <button
          onClick={handleInitialize}
          disabled={loading || categories.length > 0}
          className="px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition disabled:bg-gray-300 flex items-center justify-center gap-2"
        >
          <CheckCircle className="w-5 h-5" />
          Initialize
        </button>

        <button
          onClick={handleReinitialize}
          disabled={loading}
          className="px-4 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition disabled:bg-gray-300 flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-5 h-5" />
          Re-initialize
        </button>

        <button
          onClick={handleClearAll}
          disabled={loading || categories.length === 0}
          className="px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition disabled:bg-gray-300 flex items-center justify-center gap-2"
        >
          <Trash2 className="w-5 h-5" />
          Clear All
        </button>
      </div>

      {/* Instructions */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-yellow-800 mb-2">Instructions:</h3>
        <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
          <li><strong>Load Categories</strong>: View current categories in database</li>
          <li><strong>Initialize</strong>: Create default categories (only if none exist)</li>
          <li><strong>Re-initialize</strong>: Delete ALL and create new bilingual categories (fixes duplicates)</li>
          <li><strong>Clear All</strong>: Delete all categories without creating new ones</li>
        </ul>
      </div>

      {/* Categories List */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800">
            Current Categories ({categories.length})
          </h3>
        </div>

        {categories.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No categories found. Click "Load Categories" or "Initialize" to get started.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {categories.map(cat => (
              <div key={cat.id} className="p-4 hover:bg-gray-50 transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <span className="text-3xl">{cat.icon}</span>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{cat.name}</h4>
                      <p className="text-sm text-gray-600">{cat.description}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span
                          className="inline-block w-4 h-4 rounded"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span className="text-xs text-gray-500">Color: {cat.color}</span>
                        <span className="text-xs text-gray-400">ID: {cat.id}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteCategory(cat.id!, cat.name)}
                    disabled={loading}
                    className="p-2 text-red-600 hover:bg-red-50 rounded transition disabled:opacity-50"
                    title="Delete category"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Categories Preview */}
      <div className="mt-6 border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800">
            New Bilingual Categories (Preview)
          </h3>
        </div>
        <div className="p-4 space-y-2 text-sm">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📚</span>
            <span className="font-medium">Academic / ĐT&CTSV</span>
            <span className="text-gray-500">- Academic-related documents, student affairs</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">💰</span>
            <span className="font-medium">Financial / KHTC</span>
            <span className="text-gray-500">- Financial planning documents, budgets</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">👥</span>
            <span className="font-medium">HR / TCCB</span>
            <span className="text-gray-500">- Human resources, personnel organization</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔬</span>
            <span className="font-medium">Research / NCKH</span>
            <span className="text-gray-500">- Research papers, proposals, grants</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌐</span>
            <span className="font-medium">International / HTQT</span>
            <span className="text-gray-500">- International cooperation documents</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">📋</span>
            <span className="font-medium">Administrative / HTPT</span>
            <span className="text-gray-500">- Administrative office documents</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">📄</span>
            <span className="font-medium">General / Chung</span>
            <span className="text-gray-500">- General documents and miscellaneous</span>
          </div>
        </div>
      </div>
    </div>
  );
}
