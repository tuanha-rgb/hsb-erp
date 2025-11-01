import React, { useState, useMemo } from 'react';
import { 
  Book, BookOpen, Search, Filter, X, ChevronDown, ChevronRight,
  Star, Download, Eye, Grid, List, ArrowLeft
} from 'lucide-react';
import { bookRecords, catalogues, type BookRecord, type CatalogueCategory, type BookType } from './documents/bookdata';
import { sampleTheses, type Thesis } from './acad/thesis';

type ViewMode = 'grid' | 'list';
type ContentType = 'all' | 'books' | 'theses';
type ReadingItem = BookRecord | Thesis;

interface ReadingViewProps {
  item: ReadingItem;
  onClose: () => void;
}

const isBook = (item: ReadingItem): item is BookRecord => 'isbn' in item;
const isThesis = (item: ReadingItem): item is Thesis => 'student' in item;

const ReadingView: React.FC<ReadingViewProps> = ({ item, onClose }) => {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <button onClick={onClose} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
          <ArrowLeft size={20} />
          <span>Back to Library</span>
        </button>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">Page {currentPage}</span>
          <button className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50">
            <Download size={16} className="inline mr-1" />
            Download
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Title Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isBook(item) ? item.title : item.title}
          </h1>
          {isBook(item) && item.subtitle && (
            <p className="text-xl text-gray-600 mb-4">{item.subtitle}</p>
          )}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            {isBook(item) ? (
              <>
                <span>By {item.authors.join(', ')}</span>
                <span>•</span>
                <span>{item.publisher} ({item.publicationYear})</span>
                <span>•</span>
                <span>{item.pages} pages</span>
              </>
            ) : (
              <>
                <span>By {item.student.name}</span>
                <span>•</span>
                <span>{item.department}</span>
                <span>•</span>
                <span>{item.academicYear}</span>
              </>
            )}
          </div>
        </div>

        {/* Document Viewer */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 min-h-[600px]">
          {isBook(item) ? (
            <div className="prose max-w-none">
              <h2>Description</h2>
              <p>{item.description}</p>
              
              <h3>Details</h3>
              <ul>
                <li><strong>ISBN:</strong> {item.isbn}</li>
                <li><strong>Edition:</strong> {item.edition}</li>
                <li><strong>Language:</strong> {item.language}</li>
                <li><strong>Subjects:</strong> {item.subjects.join(', ')}</li>
                <li><strong>Location:</strong> {item.shelfLocation}</li>
                <li><strong>Available Copies:</strong> {item.availableCopies} of {item.totalCopies}</li>
              </ul>

              <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm text-blue-800">
                  📖 <strong>Full content preview coming soon.</strong> This is a placeholder for the actual book content viewer.
                  In production, this would display PDF content or integrated e-book reader.
                </p>
              </div>
            </div>
          ) : (
            <div className="prose max-w-none">
              <h2>Abstract</h2>
              <p>{item.abstract}</p>

              <h3>Details</h3>
              <ul>
                <li><strong>ID:</strong> {item.id}</li>
                <li><strong>Level:</strong> {item.level.toUpperCase()}</li>
                <li><strong>Category:</strong> {item.category}</li>
                <li><strong>Status:</strong> {item.status}</li>
                <li><strong>Supervisor:</strong> {item.supervisor.name}</li>
                <li><strong>Field of Study:</strong> {item.fieldOfStudy}</li>
                <li><strong>Keywords:</strong> {item.keywords.join(', ')}</li>
              </ul>

              {item.documents.fullThesis && (
                <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded">
                  <p className="text-sm text-green-800">
                    📄 <strong>Thesis document:</strong> {item.documents.fullThesis}
                    <br />
                    Full document viewer integration available in production environment.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <button 
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button 
            onClick={() => setCurrentPage(currentPage + 1)}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      </div>
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

  if (readingItem) {
    return <ReadingView item={readingItem} onClose={() => setReadingItem(null)} />;
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Library</h1>
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
      </div>

      {/* Content Grid/List */}
      <div className="flex-1 overflow-auto p-6">
        <div className="mb-4 text-sm text-gray-600">
          {filteredContent.length} item{filteredContent.length !== 1 ? 's' : ''} found
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredContent.map((item) => (
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
            {filteredContent.map((item) => (
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
      </div>
    </div>
  );
};

export default LibraryViewer;