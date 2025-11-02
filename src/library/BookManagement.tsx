// src/library/BookManagement.tsx
import React, { useMemo, useState, useEffect } from 'react';
import {
  Search, Filter, Grid, List as ListIcon, Plus, Eye, Edit, CheckCircle, Star,
  TrendingUp, Building2, Layers, BarChart3, Library, Book, Users, Calendar,
  Hash, Copy, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, BookOpen,X
} from 'lucide-react';
import {
  bookRecords,
  catalogues,
  type BookRecord,
  type BookType,
  type CatalogueCategory,
} from './bookdata';

/* ---------- Types ---------- */
type BookStatus = 'available' | 'borrowed' | 'reserved' | 'maintenance' | 'lost';

interface BookFilterOptions {
  bookType: BookType | 'all';
  catalogue: CatalogueCategory | 'all';
  publisher: string;                 // 'all' or exact publisher name
  status: 'all' | 'available' | 'low_stock';
  yearFrom: string;
  yearTo: string;
  language: string;
}

const BookManagement: React.FC = () => {
  const [books, setBooks] = useState<BookRecord[]>(bookRecords);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<BookRecord | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCatalogue, setSelectedCatalogue] = useState<CatalogueCategory | 'all'>('all');

  // Pagination
  const [pageSize, setPageSize] = useState<20 | 50 | 100>(20);
  const [currentPage, setCurrentPage] = useState(1);

  const [filters, setFilters] = useState<BookFilterOptions>({
    bookType: 'all',
    catalogue: 'all',
    publisher: 'all',
    status: 'all',
    yearFrom: '',
    yearTo: '',
    language: 'all'
  });

  // Reset to first page on filters/search/pageSize change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, JSON.stringify(filters), pageSize, selectedCatalogue]);

  /* ---------- Statistics ---------- */
  const statistics = useMemo(() => {
    const total = books.length;
    const totalPhysicalCopies = books.reduce((sum, b) => sum + b.totalCopies, 0);
    const availableCopies = books.reduce((sum, b) => sum + b.availableCopies, 0);
    const borrowedCopies = books.reduce((sum, b) => sum + b.borrowedCopies, 0);
    const utilizationRate = totalPhysicalCopies === 0
      ? '0.0'
      : ((borrowedCopies / totalPhysicalCopies) * 100).toFixed(1);
    const uniquePublishers = new Set(books.map(b => b.publisher)).size;
    const avgRating = total === 0 ? 0 : books.reduce((sum, b) => sum + b.rating, 0) / total;

    return {
      total,
      totalPhysicalCopies,
      availableCopies,
      borrowedCopies,
      utilizationRate,
      uniquePublishers,
      avgRating: avgRating.toFixed(1)
    };
  }, [books]);

  // Top publishers (by count/copies)
  const publisherStats = useMemo(() => {
    const stats = books.reduce((acc, book) => {
      if (!acc[book.publisher]) {
        acc[book.publisher] = { count: 0, totalCopies: 0, borrowed: 0 };
      }
      acc[book.publisher].count += 1;
      acc[book.publisher].totalCopies += book.totalCopies;
      acc[book.publisher].borrowed += book.borrowedCopies;
      return acc;
    }, {} as Record<string, { count: number; totalCopies: number; borrowed: number }>);

    return Object.entries(stats)
      .map(([publisher, data]) => ({ publisher, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [books]);

  // Catalogue distribution
  const catalogueStats = useMemo(() => {
    const stats = books.reduce((acc, book) => {
      if (!acc[book.catalogue]) {
        acc[book.catalogue] = { count: 0, available: 0, borrowed: 0 };
      }
      acc[book.catalogue].count += book.totalCopies;
      acc[book.catalogue].available += book.availableCopies;
      acc[book.catalogue].borrowed += book.borrowedCopies;
      return acc;
    }, {} as Record<string, { count: number; available: number; borrowed: number }>);

    return Object.entries(stats)
      .map(([catalogue, data]) => ({ catalogue, ...data }))
      .sort((a, b) => b.count - a.count);
  }, [books]);

  // Unique publishers for filter dropdown (derived from current data)
  const publisherList = useMemo(() => {
    return ['all', ...Array.from(new Set(books.map(b => b.publisher))).sort()];
  }, [books]);

  /* ---------- Filtering ---------- */
  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.authors.some(a => a.toLowerCase().includes(searchTerm.toLowerCase())) ||
        book.isbn.includes(searchTerm) ||
        book.subjects.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
        book.publisher.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = filters.bookType === 'all' || book.bookType === filters.bookType;
      const matchesCatalogue = filters.catalogue === 'all' || book.catalogue === filters.catalogue;
      const matchesPublisher = filters.publisher === 'all' || book.publisher === filters.publisher;
      const matchesLanguage = filters.language === 'all' || book.language === filters.language;

      const matchesStatus =
        filters.status === 'all' ||
        (filters.status === 'available' && book.availableCopies > 0) ||
        (filters.status === 'low_stock' && book.availableCopies <= 5 && book.availableCopies > 0);

      const matchesYearFrom = !filters.yearFrom || book.publicationYear >= parseInt(filters.yearFrom, 10);
      const matchesYearTo = !filters.yearTo || book.publicationYear <= parseInt(filters.yearTo, 10);

      const matchesSelectedCatalogue = selectedCatalogue === 'all' || book.catalogue === selectedCatalogue;

      return (
        matchesSearch &&
        matchesType &&
        matchesCatalogue &&
        matchesPublisher &&
        matchesLanguage &&
        matchesStatus &&
        matchesYearFrom &&
        matchesYearTo &&
        matchesSelectedCatalogue
      );
    });
  }, [books, searchTerm, filters, selectedCatalogue]);

  /* ---------- Pagination derived values ---------- */
  const totalItems = filteredBooks.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const clampedPage = Math.min(currentPage, totalPages);
  const startIdx = (clampedPage - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, totalItems);
  const pageItems = useMemo(
    () => filteredBooks.slice(startIdx, endIdx),
    [filteredBooks, startIdx, endIdx]
  );

  /* ---------- Helpers ---------- */
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  const getAvailabilityColor = (available: number, total: number) => {
    const percentage = total === 0 ? 0 : (available / total) * 100;
    if (percentage > 50) return 'text-green-600 bg-green-50';
    if (percentage > 20) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getBookTypeLabel = (type: BookType) =>
    ({ textbook: 'Textbook', reference: 'Reference', lecture_notes: 'Lecture Notes' }[type]);

  const handleViewDetail = (book: BookRecord) => {
    setSelectedBook(book);
    setShowDetailModal(true);
  };

  /* ---------- Pagination controls ---------- */
  const goFirst = () => setCurrentPage(1);
  const goPrev = () => setCurrentPage(p => Math.max(1, p - 1));
  const goNext = () => setCurrentPage(p => Math.min(totalPages, p + 1));
  const goLast = () => setCurrentPage(totalPages);

  const pageNumbers = useMemo(() => {
    const nums: number[] = [];
    const maxButtons = 5;
    let start = Math.max(1, clampedPage - 2);
    let end = Math.min(totalPages, start + maxButtons - 1);
    start = Math.max(1, end - maxButtons + 1);
    for (let i = start; i <= end; i++) nums.push(i);
    return nums;
  }, [clampedPage, totalPages]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Book Management</h1>
            <p className="text-gray-600 mt-1">Comprehensive library collection management system</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
          >
            <Plus className="w-4 h-4" />
            Add Book
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
              <Library className="w-4 h-4" />
              Total Titles
            </div>
            <div className="text-2xl font-bold text-gray-900">{statistics.total}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 text-blue-600 text-sm mb-1">
              <Book className="w-4 h-4" />
              Total Copies
            </div>
            <div className="text-2xl font-bold text-blue-600">{statistics.totalPhysicalCopies}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 text-green-600 text-sm mb-1">
              <CheckCircle className="w-4 h-4" />
              Available
            </div>
            <div className="text-2xl font-bold text-green-600">{statistics.availableCopies}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 text-orange-600 text-sm mb-1">
              <Users className="w-4 h-4" />
              Borrowed
            </div>
            <div className="text-2xl font-bold text-orange-600">{statistics.borrowedCopies}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 text-purple-600 text-sm mb-1">
              <TrendingUp className="w-4 h-4" />
              Utilization
            </div>
            <div className="text-2xl font-bold text-purple-600">{statistics.utilizationRate}%</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 text-indigo-600 text-sm mb-1">
              <Building2 className="w-4 h-4" />
              Publishers
            </div>
            <div className="text-2xl font-bold text-indigo-600">{statistics.uniquePublishers}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 text-yellow-600 text-sm mb-1">
              <Star className="w-4 h-4" />
              Avg Rating
            </div>
            <div className="text-2xl font-bold text-yellow-600">{statistics.avgRating}</div>
          </div>
        </div>

        {/* Catalogue Quick Filter */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Layers className="w-4 h-4" />
            Browse by Catalogue
          </h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCatalogue('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                selectedCatalogue === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Categories
            </button>
            {catalogues.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCatalogue(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  selectedCatalogue === cat ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Top Publishers + Catalogue Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              Top Publishers
            </h3>
            <div className="space-y-3">
              {publisherStats.map((stat, idx) => (
                <div key={stat.publisher} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                      {idx + 1}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{stat.publisher}</div>
                      <div className="text-sm text-gray-600">{stat.count} titles, {stat.totalCopies} copies</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{stat.borrowed} borrowed</div>
                    <div className="text-xs text-gray-600">
                      {((stat.borrowed / Math.max(stat.totalCopies, 1)) * 100).toFixed(1)}% usage
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-green-600" />
              Catalogue Distribution
            </h3>
            <div className="space-y-3">
              {catalogueStats.slice(0, 6).map((stat) => (
                <div key={stat.catalogue} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-900">{stat.catalogue}</span>
                    <span className="text-gray-600">{stat.count} copies</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${statistics.totalPhysicalCopies === 0 ? 0 : (stat.count / statistics.totalPhysicalCopies) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Search + Controls */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by title, author, ISBN, subject, or publisher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-3">
              {/* Page size selector */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Rows:</span>
                <select
                  value={pageSize}
                  onChange={e => setPageSize(Number(e.target.value) as 20 | 50 | 100)}
                  className="px-2 py-2 border border-gray-300 rounded-lg"
                >
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${
                  showFilters ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
              <div className="flex bg-gray-200 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow' : ''}`}
                >
                  <ListIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow' : ''}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Book Type</label>
                  <select
                    value={filters.bookType}
                    onChange={(e) => setFilters({ ...filters, bookType: e.target.value as BookType | 'all' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Types</option>
                    <option value="textbook">Textbook</option>
                    <option value="reference">Reference</option>
                    <option value="lecture_notes">Lecture Notes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Catalogue</label>
                  <select
                    value={filters.catalogue}
                    onChange={(e) => setFilters({ ...filters, catalogue: e.target.value as CatalogueCategory | 'all' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Catalogues</option>
                    {catalogues.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Publisher</label>
                  <select
                    value={filters.publisher}
                    onChange={(e) => setFilters({ ...filters, publisher: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {publisherList.map(pub => (
                      <option key={pub} value={pub}>{pub === 'all' ? 'All Publishers' : pub}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value as BookFilterOptions['status'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="available">Available</option>
                    <option value="low_stock">Low Stock (≤5)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year From</label>
                  <input
                    type="number"
                    placeholder="2010"
                    value={filters.yearFrom}
                    onChange={(e) => setFilters({ ...filters, yearFrom: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year To</label>
                  <input
                    type="number"
                    placeholder="2024"
                    value={filters.yearTo}
                    onChange={(e) => setFilters({ ...filters, yearTo: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                  <select
                    value={filters.language}
                    onChange={(e) => setFilters({ ...filters, language: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Languages</option>
                    <option value="English">English</option>
                    <option value="Indonesian">Indonesian</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() =>
                    setFilters({
                      bookType: 'all',
                      catalogue: 'all',
                      publisher: 'all',
                      status: 'all',
                      yearFrom: '',
                      yearTo: '',
                      language: 'all'
                    })
                  }
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results count + top pagination */}
      <div className="mb-4 text-sm text-gray-600 flex items-center justify-between">
        <span>
          Showing {totalItems === 0 ? 0 : startIdx + 1}–{endIdx} of {totalItems} books
        </span>
        <div className="hidden md:flex items-center gap-1">
          <button onClick={goFirst} className="px-2 py-1 rounded hover:bg-gray-100" disabled={clampedPage === 1}>
            <ChevronsLeft className="w-4 h-4" />
          </button>
          <button onClick={goPrev} className="px-2 py-1 rounded hover:bg-gray-100" disabled={clampedPage === 1}>
            <ChevronLeft className="w-4 h-4" />
          </button>
          {pageNumbers.map(n => (
            <button
              key={n}
              onClick={() => setCurrentPage(n)}
              className={`px-3 py-1 rounded ${n === clampedPage ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}
            >
              {n}
            </button>
          ))}
          <button onClick={goNext} className="px-2 py-1 rounded hover:bg-gray-100" disabled={clampedPage === totalPages}>
            <ChevronRight className="w-4 h-4" />
          </button>
          <button onClick={goLast} className="px-2 py-1 rounded hover:bg-gray-100" disabled={clampedPage === totalPages}>
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {pageItems.map((book) => (
            <div key={book.id} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition">
              <div className="flex gap-4">
                
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{book.title}</h3>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-2">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {book.authors.join(', ')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Building2 className="w-4 h-4" />
                          {book.publisher}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {book.publicationYear} • {book.edition}
                        </span>
                        <span className="flex items-center gap-1">
                          <Hash className="w-4 h-4" />
                          ISBN: {book.isbn}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {getBookTypeLabel(book.bookType)}
                        </span>
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                          {book.catalogue}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                          {book.shelfLocation}
                        </span>
                        {book.subjects.slice(0, 3).map((subject, idx) => (
                          <span key={idx} className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs border border-green-200">
                            {subject}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <span className={`flex items-center gap-1 px-3 py-1 rounded-full font-medium ${getAvailabilityColor(book.availableCopies, book.totalCopies)}`}>
                          <CheckCircle className="w-4 h-4" />
                          {book.availableCopies}/{book.totalCopies} Available
                        </span>
                        <span className="text-gray-600">
                          {book.borrowedCopies} Borrowed
                        </span>
                        <span className="flex items-center gap-1 text-yellow-600">
                          <Star className="w-4 h-4 fill-current" />
                          {book.rating} ({book.totalRatings})
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleViewDetail(book)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                        title="Edit"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {pageItems.map((book) => (
            <div key={book.id} className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition">
              
              <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2">{book.title}</h3>
              <p className="text-sm text-gray-600 mb-2 line-clamp-1">{book.authors[0]}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  {getBookTypeLabel(book.bookType)}
                </span>
                <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                  {book.catalogue}
                </span>
              </div>
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Availability</span>
                  <span>{book.availableCopies}/{book.totalCopies}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      (book.availableCopies / book.totalCopies) > 0.5 ? 'bg-green-600' :
                      (book.availableCopies / book.totalCopies) > 0.2 ? 'bg-yellow-600' : 'bg-red-600'
                    }`}
                    style={{ width: `${(book.availableCopies / book.totalCopies) * 100}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                    {book.rating}
                  </span>
                  <span>{book.publisher}</span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleViewDetail(book)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    className="p-2 text-green-600 hover:bg-green-50 rounded transition"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredBooks.length === 0 && (
        <div className="bg-white p-12 rounded-lg shadow-sm text-center">
          <Library className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No books found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCatalogue('all');
              setFilters({
                bookType: 'all',
                catalogue: 'all',
                publisher: 'all',
                status: 'all',
                yearFrom: '',
                yearTo: '',
                language: 'all'
              });
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Bottom Pagination */}
      {filteredBooks.length > 0 && (
        <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="text-sm text-gray-600">
            Showing {totalItems === 0 ? 0 : startIdx + 1}–{endIdx} of {totalItems}
          </div>
          <div className="flex items-center gap-1">
            <button onClick={goFirst} className="px-2 py-1 rounded hover:bg-gray-100" disabled={clampedPage === 1}>
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button onClick={goPrev} className="px-2 py-1 rounded hover:bg-gray-100" disabled={clampedPage === 1}>
              <ChevronLeft className="w-4 h-4" />
            </button>
            {pageNumbers.map(n => (
              <button
                key={n}
                onClick={() => setCurrentPage(n)}
                className={`px-3 py-1 rounded ${n === clampedPage ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}
              >
                {n}
              </button>
            ))}
            <button onClick={goNext} className="px-2 py-1 rounded hover:bg-gray-100" disabled={clampedPage === totalPages}>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button onClick={goLast} className="px-2 py-1 rounded hover:bg-gray-100" disabled={clampedPage === totalPages}>
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Book Details</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-3 gap-6 mb-6">
                <div className="col-span-1">
                  <div className="w-full h-80 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-32 h-32 text-white" />
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="flex items-start gap-2 mb-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {getBookTypeLabel(selectedBook.bookType)}
                    </span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                      {selectedBook.catalogue}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedBook.title}</h3>
                  {selectedBook.subtitle && (
                    <p className="text-lg text-gray-600 mb-4">{selectedBook.subtitle}</p>
                  )}

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Author(s)</div>
                      <div className="font-medium">{selectedBook.authors.join(', ')}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Publisher</div>
                      <div className="font-medium">{selectedBook.publisher}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">ISBN</div>
                      <div className="font-medium font-mono">{selectedBook.isbn}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Edition</div>
                      <div className="font-medium">{selectedBook.edition}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Publication Year</div>
                      <div className="font-medium">{selectedBook.publicationYear}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Pages</div>
                      <div className="font-medium">{selectedBook.pages}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Language</div>
                      <div className="font-medium">{selectedBook.language}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Shelf Location</div>
                      <div className="font-medium">{selectedBook.shelfLocation}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="text-sm text-green-700 mb-1">Available</div>
                      <div className="text-2xl font-bold text-green-600">{selectedBook.availableCopies}</div>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                      <div className="text-sm text-orange-700 mb-1">Borrowed</div>
                      <div className="text-2xl font-bold text-orange-600">{selectedBook.borrowedCopies}</div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <div className="text-sm text-blue-700 mb-1">Total Copies</div>
                      <div className="text-2xl font-bold text-blue-600">{selectedBook.totalCopies}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                      <span className="font-semibold text-gray-900">{selectedBook.rating}</span> ({selectedBook.totalRatings} ratings)
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                      Popularity: {selectedBook.popularityScore}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                <p className="text-gray-700">{selectedBook.description}</p>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-2">Subjects</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedBook.subjects.map((subject, idx) => (
                    <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {subject}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Added to Library</div>
                  <div className="font-medium">{formatDate(selectedBook.addedDate)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Last Updated</div>
                  <div className="font-medium">{formatDate(selectedBook.lastUpdated)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Price</div>
                  <div className="font-medium">
                    {selectedBook.currency} {selectedBook.price.toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition">
                  <Edit className="w-5 h-5" />
                  Edit Details
                </button>
                <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                  <Copy className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookManagement;
