// src/library/ThesisManagement.tsx
import React, { useMemo, useState, useEffect } from "react";
import {
  Search, Filter, Plus, Eye, CheckCircle, Star, TrendingUp, GraduationCap, FileText,
  Copy, BookOpen, X, Upload, Download, Award, Edit, Loader
} from "lucide-react";
import { getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth";

// Import programs data
import { programs } from "../acad/programs"; // Adjust path as needed
// Import thesis service
import { thesisService, type Thesis } from "../firebase/thesis.service";

/* ---------- Utilities ---------- */
// Storage path mapping for thesis levels
const THESIS_STORAGE_PATHS = {
  bachelor: "theses",
  master: "master-theses",
  phd: "dissertation"
};

// Build program codes from imported data
const PROGRAM_CODES: Record<string, string> = {
  // Bachelor programs
  ...Object.fromEntries(programs.bachelor.map(p => [p.code, `${p.code} - ${p.name}`])),
  // Master programs
  ...Object.fromEntries(programs.master.map(p => [p.code, `${p.code} - ${p.name}`])),
  // PhD programs
  ...Object.fromEntries(programs.phd.map(p => [p.code, `${p.code} - ${p.name}`])),
};

// Get program code from full program name
const getProgramCode = (programName: string): string => {
  // If already a code (3-4 letters), return as is
  if (programName.length <= 4) return programName;
  // Extract code from format "CODE - Description"
  const match = programName.match(/^([A-Z]+)/);
  return match ? match[1] : "GEN";
};

// Generate thesis ID: [PROGRAM]-[LEVEL]-[YEAR]-[SEQ]
const generateThesisId = (programCode: string, level: string, year: number, sequence: number): string => {
  const levelCode = level === "bachelor" ? "BSC" : level === "master" ? "MSC" : "PHD";
  const seq = String(sequence).padStart(3, '0');
  return `${programCode}-${levelCode}-${year}-${seq}`;
};

// Calculate sequence number for a thesis
const getThesisSequence = (theses: ThesisRecord[], targetThesis: ThesisRecord): number => {
  const targetProgramCode = getProgramCode(targetThesis.program);
  
  const matchingTheses = theses.filter(thesis => {
    const thisProgramCode = getProgramCode(thesis.program);
    return thisProgramCode === targetProgramCode &&
           thesis.level === targetThesis.level && 
           (thesis.year || 0) === (targetThesis.year || 0);
  });
  
  matchingTheses.sort((a, b) => {
    const dateA = a.submissionDate || a.id || '';
    const dateB = b.submissionDate || b.id || '';
    return dateA.localeCompare(dateB);
  });
  
  const index = matchingTheses.findIndex(t => t.id === targetThesis.id);
  return index >= 0 ? index + 1 : matchingTheses.length + 1;
};

/* ---------- Types ---------- */
type ThesisLevel = "bachelor" | "master" | "phd";
type ThesisStatus = "draft" | "submitted" | "under_review" | "approved" | "rejected" | "published";

interface ThesisRecord {
  id?: string;
  title: string;
  studentName: string;
  studentId: string;
  level: ThesisLevel;
  program: string;
  year: number;
  submissionDate: string;
  defenseDate?: string;
  approvalDate?: string;
  status: ThesisStatus;
  abstract: string;
  keywords: string[];
  pdfUrl?: string;
  coverImage?: string;
  pages?: number;
  plagiarismScore?: number;
  grade?: string;
}

interface ThesisFilterOptions {
  level: ThesisLevel | "all";
  status: ThesisStatus | "all";
  department: string;
  yearFrom: string;
  yearTo: string;
}



/* ---------- Edit Thesis Modal ---------- */
const EditThesisModal: React.FC<{
  thesis: ThesisRecord;
  onClose: () => void;
  onSubmit: (data: Partial<ThesisRecord>, pdfFile?: File) => Promise<void> | void;
  existingTheses: ThesisRecord[];
}> = ({ thesis, onClose, onSubmit, existingTheses }) => {
  const [formData, setFormData] = useState({
    title: thesis.title,
    studentName: thesis.studentName,
    studentId: thesis.studentId,
    level: thesis.level,
    program: thesis.program,
    year: thesis.year,
    submissionDate: thesis.submissionDate,
    defenseDate: thesis.defenseDate || "",
    approvalDate: thesis.approvalDate || "",
    status: thesis.status,
    abstract: thesis.abstract,
    keywords: thesis.keywords.join(", "),
    pages: thesis.pages || 0,
    plagiarismScore: thesis.plagiarismScore || 0,
    grade: thesis.grade || "",
  });

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate sequence - should remain same for existing thesis
  const thesisSequence = useMemo(() => 
    getThesisSequence(existingTheses, thesis),
    [existingTheses, thesis]
  );

  // Auto-generated thesis ID
  const thesisId = useMemo(() => 
    generateThesisId(
      getProgramCode(formData.program),
      formData.level,
      formData.year,
      thesisSequence
    ),
    [formData.program, formData.level, formData.year, thesisSequence]
  );

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
    } else {
      alert("Please select a valid PDF file");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await Promise.resolve(
        onSubmit(
          {
            ...formData,
            keywords: formData.keywords.split(",").map(k => k.trim()).filter(Boolean),
          },
          pdfFile || undefined
        )
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get program options based on level
  const programOptions = useMemo(() => {
    if (formData.level === "bachelor") {
      return programs.bachelor.map(p => `${p.code} - ${p.name}`);
    } else if (formData.level === "master") {
      return programs.master.map(p => `${p.code} - ${p.name}`);
    } else {
      return programs.phd.map(p => `${p.code} - ${p.name}`);
    }
  }, [formData.level]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Edit Thesis</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* PDF Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Thesis PDF {pdfFile || thesis.pdfUrl ? "(Optional - Change existing)" : ""}
            </label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-32 bg-red-50 rounded border border-red-200 flex flex-col items-center justify-center">
                <FileText className="w-8 h-8 text-red-600 mb-1" />
                {(pdfFile || thesis.pdfUrl) && (
                  <span className="text-xs text-red-600 text-center px-1">
                    {pdfFile ? pdfFile.name.substring(0, 12) + "..." : "Attached"}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <label className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg cursor-pointer transition">
                  <Upload className="w-5 h-5" />
                  <span className="text-sm">
                    {pdfFile || thesis.pdfUrl ? "Change PDF" : "Upload PDF File"}
                  </span>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handlePdfChange}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  PDF format (Max 50MB)
                </p>
              </div>
            </div>
          </div>

          {/* Thesis ID Display */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <label className="block text-sm font-medium text-blue-900 mb-2">
              Thesis ID
            </label>
            <code className="block text-lg font-mono font-bold text-blue-700 bg-white px-4 py-2 rounded border border-blue-300">
              {thesisId}
            </code>
            <p className="text-xs text-blue-600 mt-2">
              Storage: {THESIS_STORAGE_PATHS[formData.level]}
            </p>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Student Name */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Student Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.studentName}
                onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>

            {/* Student ID */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Student ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Level */}
            <div>
              <label className="block text-sm font-medium mb-1">Level</label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value as ThesisLevel })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="bachelor">Bachelor</option>
                <option value="master">Master</option>
                <option value="phd">PhD</option>
              </select>
            </div>

            {/* Year */}
            <div>
              <label className="block text-sm font-medium mb-1">Year</label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                min={2000}
                max={new Date().getFullYear() + 5}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          {/* Program */}
          <div>
            <label className="block text-sm font-medium mb-1">Program</label>
            <select
              value={formData.program}
              onChange={(e) => setFormData({ ...formData, program: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              {programOptions.map((prog) => (
                <option key={prog} value={prog}>
                  {prog}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {/* Submission Date */}
            <div>
              <label className="block text-sm font-medium mb-1">Submission Date</label>
              <input
                type="date"
                value={formData.submissionDate}
                onChange={(e) => setFormData({ ...formData, submissionDate: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            {/* Defense Date */}
            <div>
              <label className="block text-sm font-medium mb-1">Defense Date</label>
              <input
                type="date"
                value={formData.defenseDate}
                onChange={(e) => setFormData({ ...formData, defenseDate: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            {/* Approval Date */}
            <div>
              <label className="block text-sm font-medium mb-1">Approval Date</label>
              <input
                type="date"
                value={formData.approvalDate}
                onChange={(e) => setFormData({ ...formData, approvalDate: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Status */}
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as ThesisStatus })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="draft">Draft</option>
                <option value="submitted">Submitted</option>
                <option value="under_review">Under Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="published">Published</option>
              </select>
            </div>

            {/* Grade */}
            <div>
              <label className="block text-sm font-medium mb-1">Grade</label>
              <input
                type="text"
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                placeholder="e.g., A, B+, Pass with Distinction"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Pages */}
            <div>
              <label className="block text-sm font-medium mb-1">Pages</label>
              <input
                type="number"
                value={formData.pages}
                onChange={(e) => setFormData({ ...formData, pages: parseInt(e.target.value) || 0 })}
                min={0}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            {/* Plagiarism Score */}
            <div>
              <label className="block text-sm font-medium mb-1">Plagiarism Score (%)</label>
              <input
                type="number"
                value={formData.plagiarismScore}
                onChange={(e) => setFormData({ ...formData, plagiarismScore: parseFloat(e.target.value) || 0 })}
                min={0}
                max={100}
                step={0.1}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          {/* Abstract */}
          <div>
            <label className="block text-sm font-medium mb-1">Abstract</label>
            <textarea
              value={formData.abstract}
              onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
              rows={4}
              placeholder="Brief summary of the thesis..."
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          {/* Keywords */}
          <div>
            <label className="block text-sm font-medium mb-1">Keywords</label>
            <input
              type="text"
              value={formData.keywords}
              onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
              placeholder="keyword1, keyword2, keyword3"
              className="w-full px-3 py-2 border rounded-lg"
            />
            <p className="text-xs text-gray-500 mt-1">Separate keywords with commas</p>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 px-6 py-3 rounded-lg flex items-center justify-center gap-2 text-white ${
                isSubmitting
                  ? "bg-orange-400 cursor-not-allowed"
                  : "bg-orange-600 hover:bg-orange-700"
              }`}
            >
              <Edit className="w-5 h-5" />
              {isSubmitting ? "Updating…" : "Update Thesis"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className={`px-6 py-3 border border-gray-300 rounded-lg ${
                isSubmitting ? "opacity-60 cursor-not-allowed" : "hover:bg-gray-50"
              }`}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


/* ---------- Detail Modal ---------- */


const ThesisDetailModal: React.FC<{
  thesis: ThesisRecord;
  allTheses: ThesisRecord[];
  onClose: () => void;
  onDelete?: (thesisId: string) => void;
}> = ({ thesis, allTheses, onClose, onDelete }) => {
  const thesisId = generateThesisId(
    getProgramCode(thesis.program),
    thesis.level,
    thesis.year,
    getThesisSequence(allTheses, thesis)
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Thesis Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded" aria-label="Close">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Thesis ID */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <span className="text-sm font-medium text-blue-900">Thesis ID:</span>
            <code className="block mt-1 text-lg font-mono font-bold text-blue-700">
              {thesisId}
            </code>
            <p className="text-xs text-blue-600 mt-1">
              Storage: {THESIS_STORAGE_PATHS[thesis.level]}
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold">{thesis.title}</h3>
            <p className="text-gray-600">
              {PROGRAM_CODES[thesis.program] || thesis.program}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-600">Student:</span>
              <p className="font-medium">
                {thesis.studentName} ({thesis.studentId})
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Level:</span>
              <p className="font-medium capitalize">{thesis.level}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Program:</span>
              <p className="font-medium">
                {PROGRAM_CODES[thesis.program] || thesis.program}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Year:</span>
              <p className="font-medium">{thesis.year}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Status:</span>
              <p className="font-medium capitalize">
                {thesis.status.replace('_', ' ')}
              </p>
            </div>
            {typeof thesis.pages === 'number' && (
              <div>
                <span className="text-sm text-gray-600">Pages:</span>
                <p className="font-medium">{thesis.pages}</p>
              </div>
            )}
          </div>

          {thesis.abstract && (
            <div>
              <span className="text-sm text-gray-600">Abstract:</span>
              <p className="text-gray-800 mt-1">{thesis.abstract}</p>
            </div>
          )}

          {thesis.keywords && thesis.keywords.length > 0 && (
            <div>
              <span className="text-sm text-gray-600">Keywords:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {thesis.keywords.map((keyword, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {thesis.pdfUrl && (
            <div className="pt-4">
              <a
                href={thesis.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
              >
                <Download className="w-5 h-5" />
                View PDF
              </a>
            </div>
          )}

          {onDelete && (
            <div className="pt-2">
              <button
                onClick={() => onDelete(thesis.id)}
                className="w-full border border-red-300 text-red-700 px-6 py-2 rounded-lg hover:bg-red-50"
              >
                Delete Thesis
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};



/* ---------- Component ---------- */
const ThesisStorage: React.FC = () => {
  const [theses, setTheses] = useState<ThesisRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [thesisToEdit, setThesisToEdit] = useState<ThesisRecord | null>(null);
  const [selectedThesis, setSelectedThesis] = useState<ThesisRecord | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Pagination
  const [pageSize] = useState<20 | 50 | 100>(20);
  const [currentPage, setCurrentPage] = useState(1);

  const [filters, setFilters] = useState<ThesisFilterOptions>({
    level: "all",
    status: "all",
    department: "all",
    yearFrom: "",
    yearTo: "",
  });

  // Initialize
  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, async (user) => {
      try {
        setInitError(null);
        if (!user) await signInAnonymously(auth);
        await loadTheses();
      } catch (e: any) {
        console.error("Initialization failed:", e);
        setInitError(e?.message ?? "Failed to initialize");
        setLoading(false);
      }
    });
    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadTheses = async () => {
    try {
      setLoading(true);
      setInitError(null);
      
      // Load from Firebase
      const firebaseTheses = await thesisService.getAllTheses();
      
      // Transform to ThesisRecord format
      const transformedTheses: ThesisRecord[] = firebaseTheses.map(thesis => ({
        id: thesis.id,
        title: thesis.title,
        studentName: thesis.studentName,
        studentId: thesis.studentId,
        level: thesis.level,
        program: thesis.program,
        year: thesis.year,
        submissionDate: thesis.submissionDate,
        defenseDate: thesis.defenseDate,
        approvalDate: thesis.approvalDate,
        status: thesis.status,
        abstract: thesis.abstract,
        keywords: thesis.keywords,
        pdfUrl: thesis.pdfUrl,
        pages: thesis.pages,
        plagiarismScore: thesis.plagiarismScore,
        grade: thesis.grade,
      }));
      
      setTheses(transformedTheses);
    } catch (error: any) {
      console.error("Error loading theses:", error);
      setInitError(error?.message ?? "Failed to load theses");
    } finally {
      setLoading(false);
    }
  };

  // Statistics
  const statistics = useMemo(() => {
    const total = theses.length;
    const bachelor = theses.filter(t => t.level === "bachelor").length;
    const master = theses.filter(t => t.level === "master").length;
    const phd = theses.filter(t => t.level === "phd").length;
    const approved = theses.filter(t => t.status === "approved" || t.status === "published").length;
    const avgPlagiarism = total === 0 ? 0 : 
      theses.filter(t => t.plagiarismScore).reduce((s, t) => s + (t.plagiarismScore || 0), 0) / 
      theses.filter(t => t.plagiarismScore).length;

    return {
      total,
      bachelor,
      master,
      phd,
      approved,
      avgPlagiarism: avgPlagiarism.toFixed(1),
    };
  }, [theses]);

  // Filtering
  const filteredTheses = useMemo(() => {
    return theses.filter((thesis) => {
      const matchesSearch =
        thesis.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        thesis.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        thesis.studentId.includes(searchTerm) ||
        thesis.program.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesLevel = filters.level === "all" || thesis.level === filters.level;
      const matchesStatus = filters.status === "all" || thesis.status === filters.status;
      const matchesProgram = filters.department === "all" || thesis.program === filters.department;
      
      const matchesYear = 
        (!filters.yearFrom || thesis.year >= parseInt(filters.yearFrom)) &&
        (!filters.yearTo || thesis.year <= parseInt(filters.yearTo));

      return matchesSearch && matchesLevel && matchesStatus && matchesProgram && matchesYear;
    });
  }, [theses, searchTerm, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredTheses.length / pageSize);
  const pageItems = filteredTheses.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, JSON.stringify(filters)]);

  // UI
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <GraduationCap className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading theses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Thesis Management
        </h1>
        <p className="text-gray-600">Manage bachelor, master, and doctoral theses</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <StatCard icon={<FileText className="w-5 h-5 text-blue-600" />} label="Total Theses" value={statistics.total} />
        <StatCard icon={<GraduationCap className="w-5 h-5 text-cyan-600" />} label="Bachelor" value={statistics.bachelor} />
        <StatCard icon={<GraduationCap className="w-5 h-5 text-indigo-600" />} label="Master" value={statistics.master} />
        <StatCard icon={<Award className="w-5 h-5 text-purple-600" />} label="PhD" value={statistics.phd} />
        <StatCard icon={<CheckCircle className="w-5 h-5 text-green-600" />} label="Approved" value={statistics.approved} />
      </div>

      {/* Controls */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search theses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <Filter className="w-5 h-5" />
            Filters
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Thesis
          </button>
        </div>
      </div>

      {/* Thesis Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <Th>Thesis ID</Th>
                <Th>Title</Th>
                <Th>Student</Th>
                <Th>Level</Th>
                <Th>Year</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pageItems.map((thesis) => (
                <tr key={thesis.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <code className="text-xs font-mono font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-200">
                      {generateThesisId(
                        getProgramCode(thesis.program),
                        thesis.level,
                        thesis.year,
                        getThesisSequence(theses, thesis)
                      )}
                    </code>
                    <div className="text-xs text-gray-500 mt-1">
                      {THESIS_STORAGE_PATHS[thesis.level]}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 max-w-md truncate">{thesis.title}</div>
                    <div className="text-sm text-gray-500">
                      {PROGRAM_CODES[thesis.program] || thesis.program}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{thesis.studentName}</div>
                    <div className="text-xs text-gray-500">{thesis.studentId}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      thesis.level === "bachelor" ? "bg-cyan-100 text-cyan-800" :
                      thesis.level === "master" ? "bg-indigo-100 text-indigo-800" :
                      "bg-purple-100 text-purple-800"
                    }`}>
                      {thesis.level === "bachelor" ? "Bachelor" : thesis.level === "master" ? "Master" : "PhD"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {thesis.year}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      thesis.status === "approved" ? "bg-green-100 text-green-800" :
                      thesis.status === "published" ? "bg-blue-100 text-blue-800" :
                      thesis.status === "under_review" ? "bg-yellow-100 text-yellow-800" :
                      thesis.status === "rejected" ? "bg-red-100 text-red-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {thesis.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedThesis(thesis);
                          setShowDetailModal(true);
                        }}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          setThesisToEdit(thesis);
                          setShowEditModal(true);
                        }}
                        className="p-1 text-orange-600 hover:bg-orange-50 rounded"
                        title="Edit Thesis"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      {thesis.pdfUrl && (
                        <a
                          href={thesis.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                          title="View PDF"
                        >
                          <Download className="w-5 h-5" />
                        </a>
                      )}
                      <button
                        onClick={async () => {
                          if (!thesis.id) return;
                          if (!confirm("Are you sure you want to delete this thesis?")) return;
                          try {
                            await thesisService.deleteThesis(thesis.id);
                            await loadTheses();
                          } catch (error: any) {
                            console.error("Error deleting thesis:", error);
                            alert(error?.message ?? "Failed to delete thesis");
                          }
                        }}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        title="Delete Thesis"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Thesis Modal */}
      {showAddModal && (
        <AddThesisModal
          onClose={() => setShowAddModal(false)}
          onSubmit={async (data, pdfFile) => {
            try {
              // Add to Firebase
              await thesisService.addThesis(
                {
                  title: data.title || "",
                  studentName: data.studentName || "",
                  studentId: data.studentId || "",
                  level: data.level as "bachelor" | "master" | "phd",
                  program: data.program || "",
                  year: data.year || new Date().getFullYear(),
                  submissionDate: data.submissionDate || "",
                  defenseDate: data.defenseDate,
                  status: data.status as any,
                  abstract: data.abstract || "",
                  keywords: data.keywords || [],
                  pages: data.pages || 0,
                  plagiarismScore: data.plagiarismScore || 0,
                  grade: data.grade,
                },
                pdfFile
              );

              // Reload theses from Firebase
              await loadTheses();
              setShowAddModal(false);
            } catch (error: any) {
              console.error("Error adding thesis:", error);
              alert(error?.message ?? "Failed to add thesis");
            }
          }}
          existingTheses={theses}
        />
      )}

      {/* Edit Thesis Modal */}
      {showEditModal && thesisToEdit && (
        <EditThesisModal
          thesis={thesisToEdit}
          onClose={() => {
            setShowEditModal(false);
            setThesisToEdit(null);
          }}
          onSubmit={async (data) => {
            try {
              if (!thesisToEdit.id) return;
              
              // Update in Firebase
              await thesisService.updateThesis(thesisToEdit.id, {
                title: data.title,
                studentName: data.studentName,
                studentId: data.studentId,
                level: data.level as "bachelor" | "master" | "phd",
                program: data.program,
                year: data.year,
                submissionDate: data.submissionDate,
                defenseDate: data.defenseDate,
                status: data.status as any,
                abstract: data.abstract,
                keywords: data.keywords,
                pages: data.pages,
                plagiarismScore: data.plagiarismScore,
                grade: data.grade,
              });

              // Reload theses
              await loadTheses();
              setShowEditModal(false);
              setThesisToEdit(null);
            } catch (error: any) {
              console.error("Error updating thesis:", error);
              alert(error?.message ?? "Failed to update thesis");
            }
          }}
          existingTheses={theses}
        />
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedThesis && (
        <ThesisDetailModal
          thesis={selectedThesis}
          allTheses={theses}
          onClose={() => setShowDetailModal(false)}
          onDelete={async (thesisId) => {
            if (!confirm("Are you sure you want to delete this thesis?")) return;
            try {
              await thesisService.deleteThesis(thesisId);
              await loadTheses();
              setShowDetailModal(false);
            } catch (error: any) {
              console.error("Error deleting thesis:", error);
              alert(error?.message ?? "Failed to delete thesis");
            }
          }}
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

/* ---------- Add Thesis Modal ---------- */
const AddThesisModal: React.FC<{
  onClose: () => void;
  onSubmit: (data: Partial<ThesisRecord>, pdfFile?: File) => Promise<void> | void;
  existingTheses: ThesisRecord[];
}> = ({ onClose, onSubmit, existingTheses }) => {
  const [formData, setFormData] = useState({
    title: "",
    studentName: "",
    studentId: "",
    level: "bachelor" as ThesisLevel,
    program: "MET", // Default to first bachelor program
    year: new Date().getFullYear(),
    submissionDate: new Date().toISOString().split('T')[0],
    defenseDate: "",
    status: "draft" as ThesisStatus,
    abstract: "",
    keywords: [] as string[],
    pages: 0,
    plagiarismScore: 0,
    grade: "",
  });

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [keywordInput, setKeywordInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get available programs for selected level
  const availablePrograms = useMemo(() => {
    return programs[formData.level] || [];
  }, [formData.level]);

  // Update program when level changes
  useEffect(() => {
    const availableProgs = programs[formData.level] || [];
    if (availableProgs.length > 0 && !availableProgs.find(p => p.code === formData.program)) {
      setFormData(prev => ({ ...prev, program: availableProgs[0].code }));
    }
  }, [formData.level, formData.program]);

  // Calculate next sequence
  const getNextSequence = useMemo(() => {
    const programCode = getProgramCode(formData.program);
    const matchingTheses = existingTheses.filter(thesis => {
      const thisProgramCode = getProgramCode(thesis.program);
      return thisProgramCode === programCode &&
             thesis.level === formData.level && 
             thesis.year === formData.year;
    });
    return matchingTheses.length + 1;
  }, [existingTheses, formData.program, formData.level, formData.year]);

  // Auto-generated thesis ID
  const thesisId = useMemo(() => 
    generateThesisId(getProgramCode(formData.program), formData.level, formData.year, getNextSequence),
    [formData.program, formData.level, formData.year, getNextSequence]
  );

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") setPdfFile(file);
    else alert("Please select a valid PDF file");
  };

  const handleAddKeyword = () => {
    if (keywordInput.trim() && !formData.keywords.includes(keywordInput.trim())) {
      setFormData({ ...formData, keywords: [...formData.keywords, keywordInput.trim()] });
      setKeywordInput("");
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setFormData({ ...formData, keywords: formData.keywords.filter(k => k !== keyword) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await Promise.resolve(onSubmit(formData, pdfFile || undefined));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Add New Thesis</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Thesis ID Display */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <label className="block text-sm font-medium text-blue-900 mb-2">
              Auto-Generated Thesis ID
            </label>
            <code className="text-lg font-mono font-bold text-blue-700 bg-white px-4 py-2 rounded border border-blue-300">
              {thesisId}
            </code>
            <p className="text-xs text-blue-600 mt-2">
              Storage: {THESIS_STORAGE_PATHS[formData.level]}
            </p>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Level *</label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value as ThesisLevel })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="bachelor">Bachelor</option>
                <option value="master">Master</option>
                <option value="phd">PhD</option>
              </select>
            </div>
          </div>

          {/* Student Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Student Name *</label>
              <input
                type="text"
                value={formData.studentName}
                onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Student ID *</label>
              <input
                type="text"
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
          </div>

          {/* Program */}
          <div>
            <label className="block text-sm font-medium mb-1">Program *</label>
            <select
              value={formData.program}
              onChange={(e) => setFormData({ ...formData, program: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              required
            >
              {availablePrograms.map((program) => (
                <option key={program.code} value={program.code}>
                  {program.code} - {program.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Faculty: {availablePrograms.find(p => p.code === formData.program)?.faculty || 'N/A'}
            </p>
          </div>

          {/* Dates & Year */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Year *</label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg"
                min={2000}
                max={2100}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Submission Date *</label>
              <input
                type="date"
                value={formData.submissionDate}
                onChange={(e) => setFormData({ ...formData, submissionDate: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Defense Date</label>
              <input
                type="date"
                value={formData.defenseDate}
                onChange={(e) => setFormData({ ...formData, defenseDate: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          {/* Status & Pages */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as ThesisStatus })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="draft">Draft</option>
                <option value="submitted">Submitted</option>
                <option value="under_review">Under Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Pages</label>
              <input
                type="number"
                value={formData.pages}
                onChange={(e) => setFormData({ ...formData, pages: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg"
                min={0}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Plagiarism Score (%)</label>
              <input
                type="number"
                value={formData.plagiarismScore}
                onChange={(e) => setFormData({ ...formData, plagiarismScore: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg"
                min={0}
                max={100}
                step={0.1}
              />
            </div>
          </div>

          {/* Abstract */}
          <div>
            <label className="block text-sm font-medium mb-1">Abstract *</label>
            <textarea
              value={formData.abstract}
              onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              rows={4}
              required
            />
          </div>

          {/* Keywords */}
          <div>
            <label className="block text-sm font-medium mb-1">Keywords</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())}
                className="flex-1 px-3 py-2 border rounded-lg"
                placeholder="Type keyword and press Enter"
              />
              <button
                type="button"
                onClick={handleAddKeyword}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.keywords.map((keyword, idx) => (
                <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2">
                  {keyword}
                  <button
                    type="button"
                    onClick={() => handleRemoveKeyword(keyword)}
                    className="hover:text-blue-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* PDF Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Thesis PDF
            </label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-32 bg-red-50 rounded border border-red-200 flex flex-col items-center justify-center">
                <FileText className="w-8 h-8 text-red-600 mb-1" />
                {pdfFile && (
                  <span className="text-xs text-red-600 text-center px-1">
                    {pdfFile.name.substring(0, 12)}...
                  </span>
                )}
              </div>
              <div className="flex-1">
                <label className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg cursor-pointer transition">
                  <Upload className="w-5 h-5" />
                  <span className="text-sm">
                    {pdfFile ? "Change PDF" : "Upload PDF File"}
                  </span>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handlePdfChange}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  PDF format (Max 50MB for Bachelor/Master, 100MB for PhD)
                </p>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 px-6 py-3 rounded-lg flex items-center justify-center gap-2 text-white ${
                isSubmitting
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              <Plus className="w-5 h-5" />
              {isSubmitting ? "Adding…" : "Add Thesis"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className={`px-6 py-3 border border-gray-300 rounded-lg ${
                isSubmitting ? "opacity-60 cursor-not-allowed" : "hover:bg-gray-50"
              }`}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ---------- Edit Thesis Modal ---------- */
// Replace the EditThesisModal (lines 920-945) in your ThesisStorage.tsx with this implementation:


/* ---------- Helper Components ---------- */
const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: number | string }> = ({
  icon, label, value
}) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-sm text-gray-600 mb-1">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
      <div className="ml-4">{icon}</div>
    </div>
  </div>
);

const Th: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    {children}
  </th>
);

export default ThesisStorage;