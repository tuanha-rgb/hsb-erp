import React, { useState } from "react";
import { Search } from "lucide-react";

const Documents = () => {
  // Local state for preview/download modal
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any | null>(null);

  // ---- Helpers ----
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

  const handleViewDocument = (doc: any, category: any) => {
    setSelectedDocument({
      ...doc,
      category: category.category,
      categoryIcon: category.icon,
    });
    setShowDocumentModal(true);
  };

  // ---- Data ----
  const documentCategories = [
    {
      category: "App Tutorials & Guides",
      color: "from-blue-500 to-blue-600",
      documents: [
        {
          title: "HSB ERP Portal User Guide",
          type: "PDF",
          size: "2.5 MB",
          date: "2025-09-15",
          description: "Complete guide to using the HSB ERP student portal",
          abstract:
            "Covers navigation, profile management, course registration, grades, financial transactions, and services.",
        },
        {
          title: "Canvas LMS Quick Start Guide",
          type: "PDF",
          size: "1.8 MB",
          date: "2025-09-10",
          description: "Get started with Canvas learning management system",
          abstract:
            "Learn to access courses, submit assignments, check grades, and communicate with instructors.",
        },
        {
          title: "One-Stop Service Tutorial",
          type: "Video",
          size: "45 MB",
          date: "2025-09-05",
          description: "Step-by-step tutorial for submitting requests",
          abstract:
            "Video demo for submitting verification, transcripts, grade reviews, and other requests.",
        },
      ],
    },
    {
      category: "Student Handbook",
      color: "from-emerald-500 to-emerald-600",
      documents: [
        {
          title: "HSB Student Handbook 2024-2025",
          type: "PDF",
          size: "8.5 MB",
          date: "2024-08-01",
          description: "Official student handbook covering all policies and procedures",
          abstract:
            "Includes academic policies, rights, services, safety, and conduct guidelines.",
        },
      ],
    },
    {
      category: "Government Regulations",
      color: "from-red-500 to-red-600",
      documents: [
        {
          title: "Higher Education Law of Vietnam",
          type: "PDF",
          size: "6.5 MB",
          date: "2023-01-01",
          description: "National law governing higher education in Vietnam",
          abstract:
            "Legal framework for governance, autonomy, quality assurance, and student rights.",
        },
      ],
    },
  ];

  // ---- UI ----
  return (
    <div className="p-3 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Documents & Resources</h2>
          <p className="text-gray-600 mt-1">
            Access important documents, handbooks, and regulations
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search documents by title, category, or keyword..."
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Categories */}
      {documentCategories.map((category, idx) => (
        <div key={idx} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className={`bg-gradient-to-r ${category.color} p-6 text-white`}>
            <h3 className="text-2xl font-bold">{category.category}</h3>
            <p className="text-white/90 text-sm mt-1">
              {category.documents.length} documents available
            </p>
          </div>

          <div className="p-6">
            {category.documents.map((doc, docIdx) => (
              <div
                key={docIdx}
                className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-blue-300"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 mb-1">{doc.title}</h4>
                  <p className="text-sm text-gray-600 mb-3">{doc.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className={`px-2 py-1 rounded-full font-semibold border ${getTypeColor(doc.type)}`}>
                      {doc.type}
                    </span>
                    <span>📦 {doc.size}</span>
                    <span>📅 {doc.date}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleViewDocument(doc, category)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
                >
                  <span>📥</span> View
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Help Section */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-8 text-white">
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

      {/* Modal */}
      {showDocumentModal && selectedDocument && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white flex justify-between items-start">
              <div className="flex flex-col">
                <h2 className="text-2xl font-bold mb-2">{selectedDocument.title}</h2>
                <div className="text-sm text-white/90 flex gap-4">
                  <span>📦 {selectedDocument.size}</span>
                  <span>📅 {selectedDocument.date}</span>
                </div>
              </div>
              <button
                onClick={() => setShowDocumentModal(false)}
                className="ml-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                ✖
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700 mb-4">{selectedDocument.description}</p>
              <h3 className="font-semibold text-gray-900 mb-2">Abstract</h3>
              <p className="text-gray-700 mb-4">{selectedDocument.abstract}</p>

              <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg p-12 text-center border-2 border-dashed border-gray-300">
                <div className="text-6xl mb-4">{getTypeIcon(selectedDocument.type)}</div>
                <p className="text-gray-600 font-medium mb-2">Document Preview</p>
                <p className="text-sm text-gray-500">
                  {selectedDocument.type === "PDF"
                    ? "PDF preview would appear here"
                    : "Video player would be embedded here"}
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
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2">
                📥 Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;
