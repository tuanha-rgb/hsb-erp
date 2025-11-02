// src/library/ThesisStorage.tsx
import React, { useState, useMemo, useEffect } from 'react';
import {
  Search, Filter, Upload, Download, Eye, FileText, User, GraduationCap,
  Calendar, BookOpen, Star, X, Edit, Grid, List as ListIcon,
  CheckCircle, Archive, FileCheck, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight
} from 'lucide-react';
import {
  sampleTheses,
  type Thesis,
  type ThesisCategory,
  type ThesisLevel,
} from '../acad/thesis';

type PublishedFilter = 'all' | 'published' | 'unpublished';

interface ThesisArchive {
  id: string;
  title: string;
  author: string;
  studentId: string;
  supervisor: string;
  coSupervisor?: string;
  thesisType: ThesisCategory;
  degreeLevel: ThesisLevel;
  department: string;
  submissionDate: string;
  defenseDate: string | null;
  approvalDate: string | null;
  archiveDate: string;
  keywords: string[];
  views: number;
  rating: number;
  citations: number;
  isPlagiarismChecked: boolean;
  plagiarismScore: number | null;
  isPublished: boolean;
  pages: number;
  fileSize: string;
  language: string;
  doi?: string;
  fileUrl?: string;
}

interface ThesisFilterOptions {
  thesisType: ThesisCategory | 'all';
  degreeLevel: ThesisLevel | 'all';
  department: string;
  yearFrom: string;
  yearTo: string;
  language: string;
  isPublished: PublishedFilter;
}

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const toArchive = (t: Thesis): ThesisArchive => {
  const avgRating =
    (t.reviews.reduce((s, r) => s + (r.rating ?? 0), 0) /
      Math.max(t.reviews.length, 1)) || 0;

  const citations =
    t.associatedItems.publications.reduce((s, p) => s + (p.citations ?? 0), 0);

  const anyDoi = t.associatedItems.publications.find(p => !!p.doi)?.doi;
  const archiveDate = t.approvalDate ?? t.defenseDate ?? t.submissionDate;

  return {
    id: t.id,
    title: t.title,
    author: t.student.name,
    studentId: t.student.studentId,
    supervisor: t.supervisor.name,
    coSupervisor: t.coSupervisor?.name,
    thesisType: t.category,
    degreeLevel: t.level,
    department: t.department,
    submissionDate: t.submissionDate,
    defenseDate: t.defenseDate,
    approvalDate: t.approvalDate,
    archiveDate,
    keywords: t.keywords,
    views: t.reviews.length * 10,
    rating: Number(avgRating.toFixed(1)),
    citations,
    isPlagiarismChecked: t.plagiarismScore !== null,
    plagiarismScore: t.plagiarismScore,
    isPublished: t.status === 'published',
    pages: 0,
    fileSize: '—',
    language: 'English',
    doi: anyDoi,
    fileUrl: undefined,
  };
};

const ThesisStorage: React.FC = () => {
  const [theses, setTheses] = useState<ThesisArchive[]>(
    () => sampleTheses.map(toArchive)
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedThesis, setSelectedThesis] = useState<ThesisArchive | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // NEW: pagination state
  const [pageSize, setPageSize] = useState<20 | 50 | 100>(20);
  const [currentPage, setCurrentPage] = useState(1);

  const [filters, setFilters] = useState<ThesisFilterOptions>({
    thesisType: 'all',
    degreeLevel: 'all',
    department: 'all',
    yearFrom: '',
    yearTo: '',
    language: 'all',
    isPublished: 'all',
  });

  // Re-clamp current page when filters/search/pageSize change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, JSON.stringify(filters), pageSize]);

  // Statistics
  const statistics = useMemo(() => {
    const total = theses.length;
    const thisYear = theses.filter(
      t => new Date(t.archiveDate).getFullYear() === new Date().getFullYear()
    ).length;
    const published = theses.filter(t => t.isPublished).length;
    const totalviews = theses.reduce((sum, t) => sum + t.views, 0);
    const avgRating =
      total === 0 ? 0 : theses.reduce((sum, t) => sum + t.rating, 0) / total;
    const totalCitations = theses.reduce((sum, t) => sum + t.citations, 0);

    return {
      total,
      published,
      thisYear,
      totalviews,
      totalCitations,
      avgRating: avgRating.toFixed(1),
    };
  }, [theses]);

  const departments = useMemo(() => {
    const depts = new Set(theses.map(t => t.department));
    return ['all', ...Array.from(depts)];
  }, [theses]);

  const filteredTheses = useMemo(() => {
    return theses.filter(thesis => {
      const q = searchTerm.trim().toLowerCase();
      const matchesSearch =
        q.length === 0 ||
        thesis.title.toLowerCase().includes(q) ||
        thesis.author.toLowerCase().includes(q) ||
        thesis.supervisor.toLowerCase().includes(q) ||
        thesis.keywords.some(k => k.toLowerCase().includes(q));

      const matchesType =
        filters.thesisType === 'all' || thesis.thesisType === filters.thesisType;

      const matchesDegree =
        filters.degreeLevel === 'all' || thesis.degreeLevel === filters.degreeLevel;

      const matchesDept =
        filters.department === 'all' || thesis.department === filters.department;

      const matchesLanguage =
        filters.language === 'all' || thesis.language === filters.language;

      const matchesPublished =
        filters.isPublished === 'all' ||
        (filters.isPublished === 'published' && thesis.isPublished) ||
        (filters.isPublished === 'unpublished' && !thesis.isPublished);

      const thesisYear = new Date(thesis.archiveDate).getFullYear();
      const matchesYearFrom =
        !filters.yearFrom || thesisYear >= parseInt(filters.yearFrom, 10);
      const matchesYearTo =
        !filters.yearTo || thesisYear <= parseInt(filters.yearTo, 10);

      return (
        matchesSearch &&
        matchesType &&
        matchesDegree &&
        matchesDept &&
        matchesLanguage &&
        matchesPublished &&
        matchesYearFrom &&
        matchesYearTo
      );
    });
  }, [theses, searchTerm, filters]);

  // NEW: pagination derived values
  const totalItems = filteredTheses.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const clampedPage = Math.min(currentPage, totalPages);
  const startIdx = (clampedPage - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, totalItems);
  const pageItems = useMemo(
    () => filteredTheses.slice(startIdx, endIdx),
    [filteredTheses, startIdx, endIdx]
  );

  const handleViewDetail = (thesis: ThesisArchive) => {
    setSelectedThesis(thesis);
    setShowDetailModal(true);
  };

  const handleDownload = (thesis: ThesisArchive) => {
    console.log('Downloading:', thesis.title);
  };

  // Pagination controls
  const goFirst = () => setCurrentPage(1);
  const goPrev = () => setCurrentPage(p => Math.max(1, p - 1));
  const goNext = () => setCurrentPage(p => Math.min(totalPages, p + 1));
  const goLast = () => setCurrentPage(totalPages);

  // Helper: compact page buttons (at most 5 numbers centered around current)
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
    <div className="p-3 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Thesis Storage</h1>
            <p className="text-gray-600 mt-1">
              Completed thesis, dissertations, and final project reports repository
            </p>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
          >
            <Upload className="w-4 h-4" />
            Upload Thesis
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-3">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
              <Archive className="w-4 h-4" />
              Total Archived
            </div>
            <div className="text-2xl font-bold text-gray-900">{statistics.total}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 text-green-600 text-sm mb-1">
              <CheckCircle className="w-4 h-4" />
              Published
            </div>
            <div className="text-2xl font-bold text-green-600">{statistics.published}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 text-blue-600 text-sm mb-1">
              <Calendar className="w-4 h-4" />
              This Year
            </div>
            <div className="text-2xl font-bold text-blue-600">{statistics.thisYear}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 text-purple-600 text-sm mb-1">
              <Eye className="w-4 h-4" />
              Views
            </div>
            <div className="text-2xl font-bold text-purple-600">{statistics.totalviews}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 text-orange-600 text-sm mb-1">
              <BookOpen className="w-4 h-4" />
              Citations
            </div>
            <div className="text-2xl font-bold text-orange-600">{statistics.totalCitations}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 text-yellow-600 text-sm mb-1">
              <Star className="w-4 h-4" />
              Avg Rating
            </div>
            <div className="text-2xl font-bold text-yellow-600">{statistics.avgRating}</div>
          </div>
        </div>

        {/* Search + Controls */}
        <div className="bg-white p-3 rounded-lg shadow-sm">
          <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by title, author, keywords, or supervisor..."
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

          {/* Filters Panel (unchanged) */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={filters.thesisType}
                    onChange={(e) => setFilters({ ...filters, thesisType: e.target.value as ThesisCategory | 'all' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Types</option>
                    <option value="thesis">Thesis</option>
                    <option value="dissertation">Dissertation</option>
                    <option value="final_project">Final Project</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                  <select
                    value={filters.degreeLevel}
                    onChange={(e) => setFilters({ ...filters, degreeLevel: e.target.value as ThesisLevel | 'all' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Degrees</option>
                    <option value="bachelor">Bachelor</option>
                    <option value="master">Master</option>
                    <option value="phd">PhD</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <select
                    value={filters.department}
                    onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {departments.map(dept => (
                      <option key={dept} value={dept}>
                        {dept === 'all' ? 'All Departments' : dept}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year From</label>
                  <input
                    type="number"
                    placeholder="2020"
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Published</label>
                  <select
                    value={filters.isPublished}
                    onChange={(e) => setFilters({ ...filters, isPublished: e.target.value as PublishedFilter })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All</option>
                    <option value="published">Published</option>
                    <option value="unpublished">Unpublished</option>
                  </select>
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() =>
                    setFilters({
                      thesisType: 'all',
                      degreeLevel: 'all',
                      department: 'all',
                      yearFrom: '',
                      yearTo: '',
                      language: 'all',
                      isPublished: 'all',
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

      {/* Results Count + showing range */}
      <div className="mb-3 text-sm text-gray-600 flex items-center justify-between">
        <span>
          Showing {totalItems === 0 ? 0 : startIdx + 1}–{endIdx} of {totalItems} theses
        </span>

        {/* Top pagination (optional) */}
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

      {/* List / Grid use pageItems instead of filteredTheses */}
      {viewMode === 'list' && (
        <div className="space-y-3">
          {pageItems.map((thesis) => (
            <div key={thesis.id} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition">
              {/* ... (unchanged card body) ... */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <FileText className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{thesis.title}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {thesis.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <GraduationCap className="w-4 h-4" />
                          {thesis.supervisor}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(thesis.submissionDate)}
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          {thesis.pages} pages
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {thesis.thesisType.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                          {thesis.degreeLevel.toUpperCase()}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                          {thesis.department}
                        </span>
                        {thesis.isPublished && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Published
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {thesis.keywords.slice(0, 5).map((keyword, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-50 text-gray-600 rounded text-xs border border-gray-200">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => handleViewDetail(thesis)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    title="View Details"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDownload(thesis)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                    title="Download"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-600 pt-3 border-t border-gray-100">
                <span className="flex items-center gap-1">
                  <Download className="w-4 h-4" />
                  {thesis.views} views
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  {thesis.rating.toFixed(1)} rating
                </span>
                {thesis.isPlagiarismChecked && (
                  <span className="flex items-center gap-1">
                    <FileCheck className="w-4 h-4 text-green-600" />
                    Plagiarism: {thesis.plagiarismScore}%
                  </span>
                )}
                <span className="flex items-center gap-1">
                  {thesis.fileSize}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pageItems.map((thesis) => (
            <div key={thesis.id} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition">
              <div className="flex items-start justify-between mb-3">
                <FileText className="w-8 h-8 text-blue-600 flex-shrink-0" />
                {thesis.isPublished && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Published
                  </span>
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{thesis.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{thesis.author}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  {thesis.degreeLevel.toUpperCase()}
                </span>
                <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                  {thesis.department}
                </span>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <span className="flex items-center gap-1">
                    <Download className="w-3 h-3" />
                    {thesis.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    {thesis.rating}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewDetail(thesis)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDownload(thesis)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded transition"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredTheses.length === 0 && (
        <div className="bg-white p-12 rounded-lg shadow-sm text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No theses found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setFilters({
                thesisType: 'all',
                degreeLevel: 'all',
                department: 'all',
                yearFrom: '',
                yearTo: '',
                language: 'all',
                isPublished: 'all',
              });
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Bottom Pagination */}
      {filteredTheses.length > 0 && (
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
      {showDetailModal && selectedThesis && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Thesis Details</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              {/* … (detail body unchanged from your version) … */}
              <div className="mb-6">
                <div className="flex items-start gap-2 mb-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {selectedThesis.thesisType.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                    {selectedThesis.degreeLevel.toUpperCase()}
                  </span>
                  {selectedThesis.isPublished && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Published
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{selectedThesis.title}</h3>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Author</div>
                    <div className="font-medium">{selectedThesis.author}</div>
                    <div className="text-sm text-gray-600">ID: {selectedThesis.studentId}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Supervisor</div>
                    <div className="font-medium">{selectedThesis.supervisor}</div>
                    {selectedThesis.coSupervisor && (
                      <div className="text-sm text-gray-600">Co-supervisor: {selectedThesis.coSupervisor}</div>
                    )}
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Department</div>
                    <div className="font-medium">{selectedThesis.department}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Submission Date</div>
                    <div className="font-medium">{formatDate(selectedThesis.submissionDate)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Defense Date</div>
                    <div className="font-medium">{formatDate(selectedThesis.defenseDate)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Approval Date</div>
                    <div className="font-medium">{formatDate(selectedThesis.approvalDate)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Archive Date</div>
                    <div className="font-medium">{formatDate(selectedThesis.archiveDate)}</div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedThesis.keywords.map((keyword, idx) => (
                      <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Pages</div>
                    <div className="text-2xl font-bold">{selectedThesis.pages}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">File Size</div>
                    <div className="text-2xl font-bold">{selectedThesis.fileSize}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Views</div>
                    <div className="text-2xl font-bold">{selectedThesis.views}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Rating</div>
                    <div className="text-2xl font-bold flex items-center gap-1">
                      {selectedThesis.rating}
                      <Star className="w-5 h-5 text-yellow-500" />
                    </div>
                  </div>
                </div>

                {selectedThesis.isPlagiarismChecked && (
                  <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <FileCheck className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-green-900">Plagiarism Check Completed</span>
                    </div>
                    <div className="text-sm text-green-700">
                      Similarity Score: {selectedThesis.plagiarismScore}%
                    </div>
                  </div>
                )}

                {selectedThesis.doi && (
                  <div className="mb-6">
                    <div className="text-sm text-gray-600 mb-1">DOI</div>
                    <div className="font-mono text-blue-600">{selectedThesis.doi}</div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => handleDownload(selectedThesis)}
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition"
                  >
                    <Download className="w-5 h-5" />
                    Download Thesis
                  </button>
                  <button
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThesisStorage;
