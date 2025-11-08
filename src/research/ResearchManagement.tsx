import React, { useState, useEffect } from "react";
import {
  Briefcase, FileText, DollarSign, TrendingUp, Calendar, Building, Users,
  Search, Plus, Award, ChevronDown, Globe, Target, X, Loader, AlertCircle
} from "lucide-react";
import { getDisciplineColor, getStatusColor } from "./ResearchColors";
import {
  publicationService,
  Publication,
  fetchPublicationByDOI,
  fetchPublicationByISBN
} from "../firebase/publication.service";
import { projectService, Project } from "../firebase/project.service";
import { patentService, Patent } from "../firebase/patent.service";
import { sampleUsers } from "../useraccounts";
import { citationService } from "../services/citation.service";

const ResearchManagement = () => {
  const [activeView, setActiveView] = useState('overview');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  // Publications data from Firebase
  const [publications, setPublications] = useState<Publication[]>([]);
  const [isLoadingPublications, setIsLoadingPublications] = useState(false);

  // Projects data from Firebase
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);

  // Patents data from Firebase
  const [patents, setPatents] = useState<Patent[]>([]);
  const [isLoadingPatents, setIsLoadingPatents] = useState(false);

  // Publication modal states
  const [showAddPublicationModal, setShowAddPublicationModal] = useState(false);
  const [identifierType, setIdentifierType] = useState<'doi' | 'isbn'>('doi');
  const [identifier, setIdentifier] = useState('');
  const [isLoadingPublication, setIsLoadingPublication] = useState(false);
  const [fetchedPublication, setFetchedPublication] = useState<Partial<Publication> | null>(null);
  const [error, setError] = useState('');
  const [currentUserEmail, setCurrentUserEmail] = useState('nguyen.minh@hsb.edu.vn'); // Simulated current user
  const [authorRole, setAuthorRole] = useState<'first' | 'corresponding' | 'other'>('other');
  const [firstAuthorEmail, setFirstAuthorEmail] = useState('');
  const [correspondingAuthorEmail, setCorrespondingAuthorEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Additional publication fields
  const [formData, setFormData] = useState<Partial<Publication>>({
    impactFactor: null,
    quartile: 'N/A',
    wosranking: 'N/A',
    status: 'Published',
    citations: 0,
    discipline: 'Nontraditional Security'
  });

  // PDF upload states
  const [publicationPdfFile, setPublicationPdfFile] = useState<File | null>(null);
  const [projectPdfFile, setProjectPdfFile] = useState<File | null>(null);
  const [patentPdfFile, setPatentPdfFile] = useState<File | null>(null);

  // Edit modal states
  const [showEditPublicationModal, setShowEditPublicationModal] = useState(false);
  const [showEditProjectModal, setShowEditProjectModal] = useState(false);
  const [showEditPatentModal, setShowEditPatentModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Citation fetching states
  const [fetchingCitations, setFetchingCitations] = useState<Set<string>>(new Set());
  const [isBatchFetching, setIsBatchFetching] = useState(false);

  // Load data from Firebase on mount
  useEffect(() => {
    loadPublications();
    loadProjects();
    loadPatents();
  }, []);

  const loadPublications = async () => {
    console.log('Loading publications from Firebase...');
    setIsLoadingPublications(true);
    try {
      const pubs = await publicationService.getAllPublications();
      console.log('Loaded publications:', pubs.length);
      setPublications(pubs);
    } catch (error) {
      console.error('Failed to load publications:', error);
    } finally {
      setIsLoadingPublications(false);
    }
  };

  const loadProjects = async () => {
    console.log('Loading projects from Firebase...');
    setIsLoadingProjects(true);
    try {
      const projs = await projectService.getAllProjects();
      console.log('Loaded projects:', projs.length);
      setProjects(projs);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setIsLoadingProjects(false);
    }
  };

  const loadPatents = async () => {
    console.log('Loading patents from Firebase...');
    setIsLoadingPatents(true);
    try {
      const pats = await patentService.getAllPatents();
      console.log('Loaded patents:', pats.length);
      setPatents(pats);
    } catch (error) {
      console.error('Failed to load patents:', error);
    } finally {
      setIsLoadingPatents(false);
    }
  };

  // Fetch citations for a single publication
  const fetchCitationsForPublication = async (publication: Publication) => {
    if (!publication.doi || !publication.id) {
      alert('This publication does not have a DOI');
      return;
    }

    // Add to fetching set
    setFetchingCitations(prev => new Set(prev).add(publication.id!));

    try {
      console.log(`Fetching citations for publication: ${publication.title}`);
      const citationData = await citationService.fetchCitationCount(publication.doi);

      // Update publication in Firebase
      await publicationService.updatePublication(publication.id, {
        citations: citationData.citationCount
      });

      // Update local state
      setPublications(prev =>
        prev.map(pub =>
          pub.id === publication.id
            ? { ...pub, citations: citationData.citationCount }
            : pub
        )
      );

      console.log(`Updated ${publication.title} with ${citationData.citationCount} citations`);
    } catch (error) {
      console.error('Error fetching citations:', error);
      alert('Failed to fetch citations. Please try again.');
    } finally {
      // Remove from fetching set
      setFetchingCitations(prev => {
        const newSet = new Set(prev);
        newSet.delete(publication.id!);
        return newSet;
      });
    }
  };

  // Fetch citations for all publications with DOIs
  const fetchCitationsForAll = async () => {
    const pubsWithDOI = publications.filter(pub => pub.doi && pub.doi.trim() !== '');

    if (pubsWithDOI.length === 0) {
      alert('No publications with DOIs found');
      return;
    }

    const confirmed = window.confirm(
      `This will fetch citations for ${pubsWithDOI.length} publications. This may take a few minutes. Continue?`
    );

    if (!confirmed) return;

    setIsBatchFetching(true);

    try {
      for (const pub of pubsWithDOI) {
        await fetchCitationsForPublication(pub);
      }

      alert('Successfully updated all citations!');
    } catch (error) {
      console.error('Error batch fetching citations:', error);
      alert('Some citations failed to update. Check console for details.');
    } finally {
      setIsBatchFetching(false);
    }
  };

  // Helper function to check if an email belongs to HSB staff
  const isHSBStaff = (email: string): boolean => {
    return sampleUsers.some(user =>
      user.email.toLowerCase() === email.toLowerCase() &&
      user.email.includes('@hsb.edu.vn')
    );
  };

  // Fetch publication data by DOI or ISBN
  const handleFetchPublication = async () => {
    if (!identifier.trim()) {
      setError('Please enter a DOI or ISBN');
      return;
    }

    setIsLoadingPublication(true);
    setError('');
    setFetchedPublication(null);

    try {
      let pubData: Partial<Publication> | null = null;

      if (identifierType === 'doi') {
        pubData = await fetchPublicationByDOI(identifier.trim());
      } else {
        pubData = await fetchPublicationByISBN(identifier.trim());
      }

      if (pubData) {
        setFetchedPublication(pubData);
        setFormData({ ...formData, ...pubData });
      } else {
        setError(`Could not find publication with ${identifierType.toUpperCase()}: ${identifier}`);
      }
    } catch (err) {
      setError(`Error fetching publication: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoadingPublication(false);
    }
  };

  // Validate if user can add this publication
  const canAddPublication = (): { allowed: boolean; reason?: string } => {
    // User must specify their role
    if (!authorRole) {
      return { allowed: false, reason: 'Please specify your author role' };
    }

    // If user is first author or corresponding author, they can add
    if (authorRole === 'first' || authorRole === 'corresponding') {
      return { allowed: true };
    }

    // If user is other author, check if first and corresponding authors are outsiders
    if (authorRole === 'other') {
      if (!firstAuthorEmail || !correspondingAuthorEmail) {
        return {
          allowed: false,
          reason: 'Please provide first author and corresponding author emails'
        };
      }

      const firstIsOutsider = !isHSBStaff(firstAuthorEmail);
      const correspondingIsOutsider = !isHSBStaff(correspondingAuthorEmail);

      if (firstIsOutsider && correspondingIsOutsider) {
        return { allowed: true };
      } else {
        return {
          allowed: false,
          reason: 'Only first authors or corresponding authors can add this publication. If both are outsiders, other HSB authors can add it.'
        };
      }
    }

    return { allowed: false, reason: 'Invalid author role' };
  };

  // Submit publication to Firebase
  const handleSubmitPublication = async () => {
    if (!fetchedPublication) {
      setError('Please fetch publication data first');
      return;
    }

    const validation = canAddPublication();
    if (!validation.allowed) {
      setError(validation.reason || 'You are not authorized to add this publication');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const publicationToSubmit: Omit<Publication, 'id' | 'createdAt' | 'updatedAt'> = {
        title: fetchedPublication.title || '',
        authors: fetchedPublication.authors || [],
        type: fetchedPublication.type || 'Journal Article',
        journal: fetchedPublication.journal || '',
        publisher: fetchedPublication.publisher || null,
        year: fetchedPublication.year || new Date().getFullYear(),
        citations: formData.citations || 0,
        impactFactor: formData.impactFactor || null,
        status: formData.status || 'Published',
        doi: fetchedPublication.doi || null,
        isbn: fetchedPublication.isbn || null,
        project: formData.project || null,
        quartile: formData.quartile || 'N/A',
        wosranking: formData.wosranking || 'N/A',
        discipline: formData.discipline || 'Nontraditional Security',
        abstract: fetchedPublication.abstract,
        keywords: fetchedPublication.keywords,
        pages: fetchedPublication.pages,
        volume: fetchedPublication.volume,
        issue: fetchedPublication.issue,
        url: fetchedPublication.url
      };

      // Clean undefined values before saving
      const cleanedPublication = Object.fromEntries(
        Object.entries(publicationToSubmit).filter(([_, value]) => value !== undefined)
      ) as Omit<Publication, 'id' | 'createdAt' | 'updatedAt'>;

      const publicationId = await publicationService.addPublication(cleanedPublication);

      // Upload PDF if provided
      if (publicationPdfFile) {
        const pdfUrl = await publicationService.uploadJournalPdf(publicationPdfFile, publicationId);
        await publicationService.updatePublication(publicationId, { pdfUrl });
      }

      // Reset form and close modal
      alert(`Publication added successfully! ID: ${publicationId}`);
      resetPublicationForm();
      setShowAddPublicationModal(false);
      setPublicationPdfFile(null);
      // Reload publications to show the new one
      loadPublications();
    } catch (err) {
      setError(`Error adding publication: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset publication form
  const resetPublicationForm = () => {
    setIdentifier('');
    setFetchedPublication(null);
    setAuthorRole('other');
    setFirstAuthorEmail('');
    setCorrespondingAuthorEmail('');
    setError('');
    setFormData({
      impactFactor: null,
      quartile: 'N/A',
      wosranking: 'N/A',
      status: 'Published',
      citations: 0,
      discipline: 'Nontraditional Security'
    });
  };

  // Add Publication Modal Component
  const AddPublicationModal = () => {
    if (!showAddPublicationModal) return null;

    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={() => {
          setShowAddPublicationModal(false);
          resetPublicationForm();
        }}
      >
        <div
          className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="h-24 bg-gradient-to-br from-blue-500 to-blue-700 p-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Add New Publication</h2>
              <p className="text-blue-100 text-sm mt-1">Search by DOI or ISBN</p>
            </div>
            <button
              onClick={() => {
                setShowAddPublicationModal(false);
                resetPublicationForm();
              }}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg text-white"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Error Display */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="text-red-600 mt-0.5" size={20} />
                <div>
                  <p className="text-sm font-semibold text-red-800">Error</p>
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </div>
            )}

            {/* Identifier Input Section */}
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Identifier Type
                  </label>
                  <select
                    value={identifierType}
                    onChange={(e) => setIdentifierType(e.target.value as 'doi' | 'isbn')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="doi">DOI</option>
                    <option value="isbn">ISBN</option>
                  </select>
                </div>
                <div className="flex-[2]">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {identifierType.toUpperCase()}
                  </label>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={identifierType === 'doi' ? 'e.g., 10.1000/xyz123' : 'e.g., 978-3-16-148410-0'}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleFetchPublication()}
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleFetchPublication}
                    disabled={isLoadingPublication}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isLoadingPublication ? (
                      <>
                        <Loader className="animate-spin" size={18} />
                        Fetching...
                      </>
                    ) : (
                      'Fetch'
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Author Role Selection */}
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Role in this Publication *
                </label>
                <select
                  value={authorRole}
                  onChange={(e) => setAuthorRole(e.target.value as 'first' | 'corresponding' | 'other')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="first">First Author</option>
                  <option value="corresponding">Corresponding Author</option>
                  <option value="other">Other Author (Co-author)</option>
                </select>
              </div>

              {/* Show additional fields if user is "other" author */}
              {authorRole === 'other' && (
                <div className="space-y-3 pt-3 border-t border-yellow-300">
                  <p className="text-sm text-gray-600 italic">
                    As a co-author, you can only add this publication if both the first author and corresponding author are outsiders (not HSB staff).
                  </p>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      First Author Email *
                    </label>
                    <input
                      type="email"
                      value={firstAuthorEmail}
                      onChange={(e) => setFirstAuthorEmail(e.target.value)}
                      placeholder="first.author@example.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Corresponding Author Email *
                    </label>
                    <input
                      type="email"
                      value={correspondingAuthorEmail}
                      onChange={(e) => setCorrespondingAuthorEmail(e.target.value)}
                      placeholder="corresponding.author@example.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Fetched Publication Preview */}
            {fetchedPublication && (
              <div className="space-y-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-semibold text-gray-900">Publication Found!</h3>

                <div className="space-y-2">
                  <div>
                    <p className="text-xs font-semibold text-gray-600">Title</p>
                    <p className="text-sm text-gray-900">{fetchedPublication.title}</p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-600">Authors</p>
                    <p className="text-sm text-gray-900">{fetchedPublication.authors?.join(', ')}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs font-semibold text-gray-600">Type</p>
                      <p className="text-sm text-gray-900">{fetchedPublication.type}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600">Year</p>
                      <p className="text-sm text-gray-900">{fetchedPublication.year}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600">Journal</p>
                      <p className="text-sm text-gray-900">{fetchedPublication.journal}</p>
                    </div>
                  </div>
                </div>

                {/* Additional Fields */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-green-300">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Impact Factor
                    </label>
                    <input
                      type="number"
                      step="0.001"
                      value={formData.impactFactor || ''}
                      onChange={(e) => setFormData({ ...formData, impactFactor: e.target.value ? parseFloat(e.target.value) : null })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Quartile
                    </label>
                    <select
                      value={formData.quartile}
                      onChange={(e) => setFormData({ ...formData, quartile: e.target.value as any })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Q1">Q1</option>
                      <option value="Q2">Q2</option>
                      <option value="Q3">Q3</option>
                      <option value="Q4">Q4</option>
                      <option value="N/A">N/A</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      WoS Ranking
                    </label>
                    <select
                      value={formData.wosranking}
                      onChange={(e) => setFormData({ ...formData, wosranking: e.target.value as any })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="SSCI">SSCI</option>
                      <option value="SCIE">SCIE</option>
                      <option value="AHCI">AHCI</option>
                      <option value="ESCI">ESCI</option>
                      <option value="N/A">N/A</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Published">Published</option>
                      <option value="Under Review">Under Review</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Discipline
                    </label>
                    <select
                      value={formData.discipline || 'Nontraditional Security'}
                      onChange={(e) => setFormData({ ...formData, discipline: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Nontraditional Security">Nontraditional Security</option>
                      <option value="Business">Business</option>
                      <option value="Management Science">Management Science</option>
                      <option value="Economics">Economics</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Communication">Communication</option>
                      <option value="Psychology">Psychology</option>
                      <option value="Law">Law</option>
                      <option value="Cybersecurity">Cybersecurity</option>
                      <option value="Water Security">Water Security</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Human Resources">Human Resources</option>
                      <option value="IT">IT</option>
                      <option value="Technology Management">Technology Management</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Citations
                    </label>
                    <input
                      type="number"
                      value={formData.citations || 0}
                      onChange={(e) => setFormData({ ...formData, citations: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* PDF Upload */}
                <div className="pt-4 border-t border-green-300">
                  <label className="block text-xs font-semibold text-gray-600 mb-2">
                    Upload Journal PDF (Optional)
                  </label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setPublicationPdfFile(e.target.files?.[0] || null)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {publicationPdfFile && (
                    <p className="text-xs text-green-600 mt-1">
                      Selected: {publicationPdfFile.name}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowAddPublicationModal(false);
                  resetPublicationForm();
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitPublication}
                disabled={!fetchedPublication || isSubmitting}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="animate-spin" size={18} />
                    Adding...
                  </>
                ) : (
                  'Add Publication'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const OverviewDashboard = () => (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">Total Projects</p>
          <p className="text-3xl font-bold text-gray-900">42</p>
          <p className="text-xs text-green-600 mt-2">↑ 15% vs last year</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">Total Publications</p>
          <p className="text-3xl font-bold text-gray-900">156</p>
          <p className="text-xs text-green-600 mt-2">↑ 22% vs last year</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">Total Funding</p>
          <p className="text-3xl font-bold text-gray-900">$8.5M</p>
          <p className="text-xs text-gray-600 mt-2">Active grants</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">Avg Citations</p>
          <p className="text-3xl font-bold text-gray-900">38.2</p>
          <p className="text-xs text-gray-600 mt-2">Per publication</p>
        </div>
      </div>

    

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Active Projects by Faculty</h3>
          <div className="space-y-4">
            {[
              {dept: 'Faculty of Nontraditional Security', count: 18, percentage: 43},
              {dept: 'Faculty of Management', count: 12, percentage: 29},
              {dept: 'Faculty of Marketing and Communication', count: 8, percentage: 19},
              {dept: 'Other Faculties', count: 4, percentage: 9}
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{item.dept}</span>
                  <span className="text-sm font-semibold text-gray-900">{item.count} projects</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="h-2 rounded-full bg-blue-500" style={{width: `${item.percentage}%`}}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Publication Types</h3>
          <div className="space-y-4">
            {[
              {type: 'Journal Articles', count: 92, percentage: 59},
              {type: 'Conference Papers', count: 38, percentage: 24},
              {type: 'Book Chapters', count: 18, percentage: 12},
              {type: 'Patents', count: 8, percentage: 5}
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{item.type}</span>
                  <span className="text-sm font-semibold text-gray-900">{item.count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="h-2 rounded-full bg-green-500" style={{width: `${item.percentage}%`}}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Researchers</h3>
          <div className="space-y-4">
            {[
              {name: 'Dr. Nguyen Van A', publications: 24, citations: 892},
              {name: 'Dr. Vo Thi F', publications: 18, citations: 756},
              {name: 'Dr. Pham Thi D', publications: 16, citations: 634}
            ].map((researcher, i) => (
              <div key={i} className="flex items-start gap-3 pb-3 border-b last:border-b-0">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">{researcher.name}</p>
                  <div className="flex gap-3 mt-1">
                    <span className="text-xs text-gray-600">{researcher.publications} pubs</span>
                    <span className="text-xs text-gray-600">{researcher.citations} citations</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Funding Sources</h3>
          <div className="space-y-3">
            {[
              {source: 'Nafosted', amount: '$3.2M', percentage: 38},
              {source: 'Ministry of Education', amount: '$2.8M', percentage: 33},
              {source: 'Ministry of Science and Technology', amount: '$1.5M', percentage: 18},
              {source: 'VNU', amount: '$1.0M', percentage: 11}
            ].map((item, i) => (
              <div key={i} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{item.source}</span>
                  <span className="text-sm font-bold text-gray-900">{item.amount}</span>
                </div>
                <div className="w-full bg-gray-300 rounded-full h-1.5">
                  <div className="h-1.5 rounded-full bg-blue-600" style={{width: `${item.percentage}%`}}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Publications by Discipline</h3>
          <div className="space-y-3">
            {[
              {discipline: 'Nontraditional Security', count: 42, color: 'blue'},
              {discipline: 'Sustainable Development', count: 28, color: 'green'},
              {discipline: 'Engineering & IT', count: 24, color: 'purple'},
              {discipline: 'Human Resources', count: 18, color: 'green'},
              {discipline: 'Finance', count: 16, color: 'green'},
              {discipline: 'Marketing', count: 14, color: 'green'},
              {discipline: 'Communication', count: 10, color: 'green'},
              {discipline: 'Law & Criminology', count: 4, color: 'blue'}
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full bg-${item.color}-500`}></div>
                  <span className="text-xs text-gray-700">{item.discipline}</span>
                </div>
                <span className="text-xs font-bold text-gray-900">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const ProjectsView = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mt-3">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All Types</option>
                <option value="applied">Applied Research</option>
                <option value="basic">Basic Research</option>
              </select>
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Plus size={18} />
              New Project
            </button>
          </div>
        </div>
          <div className="grid grid-cols-4 gap-4 p-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">Total</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">Total Projects</p>
          <p className="text-3xl font-bold text-gray-900">{projects.length}</p>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-600">All projects in database</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">Active</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">Active Projects</p>
          <p className="text-3xl font-bold text-gray-900">
            {projects.filter(p => p.status === 'Active').length}
          </p>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-600">
              {projects.length > 0
                ? `${Math.round((projects.filter(p => p.status === 'Active').length / projects.length) * 100)}% of total`
                : '0% of total'
              }
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded">Completed</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">Completed Projects</p>
          <p className="text-3xl font-bold text-gray-900">
            {projects.filter(p => p.status === 'Completed').length}
          </p>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-600">
              {projects.length > 0
                ? `${Math.round((projects.filter(p => p.status === 'Completed').length / projects.length) * 100)}% of total`
                : '0% of total'
              }
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-orange-600" />
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded">Pending</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">Pending Projects</p>
          <p className="text-3xl font-bold text-gray-900">
            {projects.filter(p => p.status === 'Pending').length}
          </p>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-600">
              {projects.length > 0
                ? `${Math.round((projects.filter(p => p.status === 'Pending').length / projects.length) * 100)}% of total`
                : '0% of total'
              }
            </p>
          </div>
        </div>
      </div>
        <div className="p-6">
          {isLoadingProjects ? (
            <div className="text-center py-12 text-gray-500">
              <Loader className="animate-spin mx-auto mb-2" size={24} />
              <p className="text-sm">Loading projects...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg font-semibold mb-2">No projects available</p>
              <p className="text-sm">Click "New Project" to add your first project</p>
            </div>
          ) : (
            <div className="space-y-4">
              {projects
                .filter(project => {
                  const matchesSearch = searchTerm === '' ||
                    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    project.pi.toLowerCase().includes(searchTerm.toLowerCase());
                  const matchesType = filterType === 'all' ||
                    project.type.toLowerCase().includes(filterType);
                  const matchesStatus = filterStatus === 'all' ||
                    project.status.toLowerCase() === filterStatus;
                  return matchesSearch && matchesType && matchesStatus;
                })
                .map((project) => (
                  <div key={project.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-gray-900">{project.title}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                              {project.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1.5">
                              <Users size={16} />
                              PI: {project.pi}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Building size={16} />
                              {project.department}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Calendar size={16} />
                              {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-4 mb-4">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <p className="text-xs text-gray-600 mb-1">Funding</p>
                          <p className="text-lg font-bold text-gray-900">{project.funding}</p>
                          <p className="text-xs text-gray-500">{project.fundingSource}</p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                          <p className="text-xs text-gray-600 mb-1">Progress</p>
                          <p className="text-lg font-bold text-gray-900">{project.progress}%</p>
                          <div className="w-full bg-gray-300 rounded-full h-1.5 mt-2">
                            <div className="h-1.5 rounded-full bg-green-600" style={{width: `${project.progress}%`}}></div>
                          </div>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-lg">
                          <p className="text-xs text-gray-600 mb-1">Publications</p>
                          <p className="text-lg font-bold text-gray-900">{project.publications}</p>
                          <p className="text-xs text-gray-500">Published</p>
                        </div>
                        <div className="p-3 bg-orange-50 rounded-lg">
                          <p className="text-xs text-gray-600 mb-1">Team Size</p>
                          <p className="text-lg font-bold text-gray-900">{project.coInvestigators.length + 1}</p>
                          <p className="text-xs text-gray-500">Researchers</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setSelectedItem({type: 'project', data: project})}
                          className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 text-sm font-medium"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => {
                            setEditingItem(project);
                            setShowEditProjectModal(true);
                          }}
                          className="px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 text-sm font-medium"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const PublicationsView = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search publications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All Types</option>
                <option value="journal">Journal Article</option>
                <option value="conference">Conference Paper</option>
                <option value="book">Book Chapter</option>
                <option value="book">Book</option>

              </select>
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="review">Under Review</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={fetchCitationsForAll}
                disabled={isBatchFetching || publications.filter(p => p.doi).length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isBatchFetching ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    Fetching...
                  </>
                ) : (
                  <>
                    <TrendingUp size={18} />
                    Fetch All Citations
                  </>
                )}
              </button>
              <button
                onClick={() => setShowAddPublicationModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus size={18} />
                Add Publication
              </button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4 p-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">Total</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">Total Publications</p>
          <p className="text-3xl font-bold text-gray-900">{publications.length}</p>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-600">All publications in database</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">WoS</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">Web of Science</p>
          <p className="text-3xl font-bold text-gray-900">
            {publications.filter(p => p.wosranking && p.wosranking !== 'N/A').length}
          </p>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-600">
              {publications.length > 0
                ? `${Math.round((publications.filter(p => p.wosranking && p.wosranking !== 'N/A').length / publications.length) * 100)}% of total`
                : '0% of total'
              }
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded">DOI</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">With DOI</p>
          <p className="text-3xl font-bold text-gray-900">
            {publications.filter(p => p.doi).length}
          </p>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-600">
              {publications.length > 0
                ? `${Math.round((publications.filter(p => p.doi).length / publications.length) * 100)}% of total`
                : '0% of total'
              }
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-orange-600" />
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded">Q1</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">Q1 Journals</p>
          <p className="text-3xl font-bold text-gray-900">
            {publications.filter(p => p.quartile === 'Q1').length}
          </p>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-600">
              {publications.length > 0
                ? `${Math.round((publications.filter(p => p.quartile === 'Q1').length / publications.length) * 100)}% of total`
                : '0% of total'
              }
            </p>
          </div>
        </div>
      </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Authors</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Journal/Venue</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Discipline</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Year</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Citations</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Impact</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoadingPublications ? (
                <tr>
                  <td colSpan={10} className="px-6 py-12 text-center text-gray-500">
                    <Loader className="animate-spin mx-auto mb-2" size={24} />
                    <p className="text-sm">Loading publications...</p>
                  </td>
                </tr>
              ) : publications.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-6 py-12 text-center text-gray-500">
                    <p className="text-lg font-semibold mb-2">No publications available</p>
                    <p className="text-sm">Click "Add Publication" to add your first publication</p>
                  </td>
                </tr>
              ) : (
                publications
                  .filter(pub => {
                    const matchesSearch = searchTerm === '' ||
                      pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      pub.authors.some(a => a.toLowerCase().includes(searchTerm.toLowerCase()));
                    const matchesType = filterType === 'all' || pub.type.toLowerCase().includes(filterType);
                    const matchesStatus = filterStatus === 'all' || pub.status.toLowerCase() === filterStatus;
                    return matchesSearch && matchesType && matchesStatus;
                  })
                  .map((pub) => (
                    <tr key={pub.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-sm text-gray-900 max-w-xs">{pub.title}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">
                          {pub.authors.slice(0, 2).join(', ')}
                          {pub.authors.length > 2 && ` +${pub.authors.length - 2}`}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          {pub.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{pub.journal}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDisciplineColor(pub.discipline)}`}>
                          {pub.discipline}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">{pub.year}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">{pub.citations}</td>
                      <td className="px-6 py-4">
                        {pub.impactFactor ? (
                          <div className="text-sm">
                            <p className="font-semibold text-gray-900">{pub.impactFactor}</p>
                            <p className="text-xs text-gray-500">{pub.quartile}</p>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(pub.status)}`}>
                          {pub.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedItem({type: 'publication', data: pub})}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            View
                          </button>
                          <button
                            onClick={() => {
                              setEditingItem(pub);
                              setShowEditPublicationModal(true);
                            }}
                            className="text-green-600 hover:text-green-800 text-sm font-medium"
                          >
                            Edit
                          </button>
                          {pub.doi && (
                            <button
                              onClick={() => fetchCitationsForPublication(pub)}
                              disabled={fetchingCitations.has(pub.id!)}
                              className="text-orange-600 hover:text-orange-800 text-sm font-medium disabled:text-gray-400 disabled:cursor-not-allowed flex items-center gap-1"
                            >
                              {fetchingCitations.has(pub.id!) ? (
                                <>
                                  <Loader size={14} className="animate-spin" />
                                  <span>...</span>
                                </>
                              ) : (
                                <span>Cite</span>
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );


  const PatentsView = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search patents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All Status</option>
                <option value="Granted">Granted</option>
                <option value="Pending">Pending</option>
                <option value="Under Examination">Under Examination</option>
                <option value="International">International</option>
              </select>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All Types</option>
                <option value="Invention Patent">Invention Patent</option>
                <option value="Utility Model">Utility Model</option>
              </select>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Plus size={18} />
              Add Patent
            </button>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4 p-4">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">Total</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-1">Total Patents</p>
            <p className="text-3xl font-bold text-gray-900">{patents.length}</p>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-600">All patents in database</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">Granted</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-1">Granted Patents</p>
            <p className="text-3xl font-bold text-gray-900">
              {patents.filter(p => p.status === 'Granted').length}
            </p>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-600">
                {patents.length > 0
                  ? `${Math.round((patents.filter(p => p.status === 'Granted').length / patents.length) * 100)}% of total`
                  : '0% of total'
                }
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-yellow-600 bg-yellow-50 px-2 py-1 rounded">Pending</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-1">Under Review</p>
            <p className="text-3xl font-bold text-gray-900">
              {patents.filter(p => p.status === 'Pending' || p.status === 'Under Examination').length}
            </p>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-600">
                {patents.length > 0
                  ? `${Math.round((patents.filter(p => p.status === 'Pending' || p.status === 'Under Examination').length / patents.length) * 100)}% of total`
                  : '0% of total'
                }
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Globe className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded">INT</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-1">International</p>
            <p className="text-3xl font-bold text-gray-900">
              {patents.filter(p => p.status === 'International Filing' || p.status === 'International').length}
            </p>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-600">
                {patents.length > 0
                  ? `${Math.round((patents.filter(p => p.status === 'International Filing' || p.status === 'International').length / patents.length) * 100)}% of total`
                  : '0% of total'
                }
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Inventors</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Application No.</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Patent No.</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Country</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoadingPatents ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                    <Loader className="animate-spin mx-auto mb-2" size={24} />
                    <p className="text-sm">Loading patents...</p>
                  </td>
                </tr>
              ) : patents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                    <p className="text-lg font-semibold mb-2">No patents available</p>
                    <p className="text-sm">Click "Add Patent" to add your first patent</p>
                  </td>
                </tr>
              ) : (
                patents
                  .filter(patent => {
                    const matchesSearch = searchTerm === '' ||
                      patent.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      patent.inventors.some(inv => inv.toLowerCase().includes(searchTerm.toLowerCase()));
                    const matchesType = filterType === 'all' || patent.type === filterType;
                    const matchesStatus = filterStatus === 'all' || patent.status === filterStatus;
                    return matchesSearch && matchesType && matchesStatus;
                  })
                  .map((patent) => (
                    <tr key={patent.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-sm text-gray-900 max-w-xs">{patent.title}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">
                          {patent.inventors.slice(0, 2).join(', ')}
                          {patent.inventors.length > 2 && ` +${patent.inventors.length - 2}`}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          {patent.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(patent.status)}`}>
                          {patent.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-mono text-gray-900">{patent.applicationNumber}</td>
                      <td className="px-6 py-4">
                        {patent.patentNumber ? (
                          <span className="text-sm font-mono font-semibold text-green-700">{patent.patentNumber}</span>
                        ) : (
                          <span className="text-sm text-gray-400">Pending</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{patent.country}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(patent.applicationDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedItem({type: 'patent', data: patent})}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            View
                          </button>
                          <button
                            onClick={() => {
                              setEditingItem(patent);
                              setShowEditPatentModal(true);
                            }}
                            className="text-green-600 hover:text-green-800 text-sm font-medium"
                          >
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );


  return (
    <div className="min-h-screen bg-gray-50 p-3">
      <div className="max-w mx-auto space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Research Management</h1>
            <p className="text-sm text-gray-500 mt-1">Manage faculty projects, publications, and research output</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="border-b border-gray-200">
            <div className="flex gap-1 p-2">
              <button
                onClick={() => setActiveView('overview')}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeView === 'overview' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveView('projects')}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeView === 'projects' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Projects
              </button>
              <button
                onClick={() => setActiveView('publications')}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeView === 'publications' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Publications
              </button>
              <button
                onClick={() => setActiveView('patents')}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeView === 'patents' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Patents
              </button>
            </div>
          </div>
        </div>

        {activeView === 'overview' && <OverviewDashboard />}
        {activeView === 'projects' && <ProjectsView />}
        {activeView === 'publications' && <PublicationsView />}
        {activeView === 'patents' && <PatentsView />}

        {selectedItem && selectedItem.type === 'project' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedItem(null)}>
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="h-32 bg-gradient-to-br from-blue-400 to-blue-600 p-6 flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div className="flex gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-white bg-opacity-20 text-white">
                      {selectedItem.data.type}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedItem.data.status)}`}>
                      {selectedItem.data.status}
                    </span>
                  </div>
                  <button 
                    onClick={() => setSelectedItem(null)}
                    className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg text-white"
                  >
                    ✕
                  </button>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedItem.data.title}</h2>
                  <p className="text-white text-opacity-90 text-sm mt-1">{selectedItem.data.pi}</p>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Project Description</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{selectedItem.data.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <Calendar size={18} />
                      <span className="text-xs font-semibold uppercase">Duration</span>
                    </div>
                    <p className="font-semibold text-gray-900 text-sm">
                      {new Date(selectedItem.data.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - {new Date(selectedItem.data.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <DollarSign size={18} />
                      <span className="text-xs font-semibold uppercase">Funding</span>
                    </div>
                    <p className="font-semibold text-gray-900">{selectedItem.data.funding}</p>
                    <p className="text-xs text-gray-600 mt-1">{selectedItem.data.fundingSource}</p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <Building size={18} />
                      <span className="text-xs font-semibold uppercase">Department</span>
                    </div>
                    <p className="font-semibold text-gray-900">{selectedItem.data.department}</p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <Users size={18} />
                      <span className="text-xs font-semibold uppercase">Team Size</span>
                    </div>
                    <p className="font-semibold text-gray-900">{selectedItem.data.coInvestigators.length + 1} researchers</p>
                  </div>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Project Progress</h4>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Overall Completion</span>
                    <span className="text-lg font-bold text-gray-900">{selectedItem.data.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div 
                      className="h-3 rounded-full bg-blue-500"
                      style={{width: `${selectedItem.data.progress}%`}}
                    ></div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Research Team</h4>
                  <div className="space-y-2">
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm font-semibold text-gray-900">{selectedItem.data.pi}</p>
                      <p className="text-xs text-gray-600">Principal Investigator</p>
                    </div>
                    {selectedItem.data.coInvestigators.map((investigator, i) => (
                      <div key={i} className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-semibold text-gray-900">{investigator}</p>
                        <p className="text-xs text-gray-600">Co-Investigator</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                    Edit Project
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
                    View Publications
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
                    Generate Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedItem && selectedItem.type === 'publication' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedItem(null)}>
            <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="h-32 bg-gradient-to-br from-green-400 to-green-600 p-6 flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div className="flex gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-white bg-opacity-20 text-white">
                      {selectedItem.data.type}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedItem.data.status)}`}>
                      {selectedItem.data.status}
                    </span>
                  </div>
                  <button 
                    onClick={() => setSelectedItem(null)}
                    className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg text-white"
                  >
                    ✕
                  </button>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedItem.data.title}</h2>
                  <p className="text-white text-opacity-90 text-sm mt-1">{selectedItem.data.year}</p>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Authors</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.data.authors.map((author, i) => (
                      <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                        {author}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                  <p className="text-xs font-semibold text-gray-600 mb-1">Discipline</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getDisciplineColor(selectedItem.data.discipline)}`}>
                    {selectedItem.data.discipline}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <FileText size={18} />
                      <span className="text-xs font-semibold uppercase">Journal/Venue</span>
                    </div>
                    <p className="font-semibold text-gray-900 text-sm">{selectedItem.data.journal}</p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <Calendar size={18} />
                      <span className="text-xs font-semibold uppercase">Publication Year</span>
                    </div>
                    <p className="font-semibold text-gray-900">{selectedItem.data.year}</p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <TrendingUp size={18} />
                      <span className="text-xs font-semibold uppercase">Citations</span>
                    </div>
                    <p className="font-semibold text-gray-900">{selectedItem.data.citations}</p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <Award size={18} />
                      <span className="text-xs font-semibold uppercase">Impact Factor</span>
                    </div>
                    <p className="font-semibold text-gray-900">
                      {selectedItem.data.impactFactor || 'N/A'}
                      {selectedItem.data.quartile && selectedItem.data.quartile !== 'N/A' && (
                        <span className="text-xs text-gray-600 ml-2">({selectedItem.data.quartile})</span>
                      )}
                    </p>
                  </div>
                </div>

                {selectedItem.data.doi && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs font-semibold text-gray-600 mb-1">DOI</p>
                    <p className="text-sm font-mono text-blue-600">{selectedItem.data.doi}</p>
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
                    Edit Publication
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
                    View Full Text
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
                    Export Citation
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Publication Modal */}
        <AddPublicationModal />

        {/* Edit Publication Modal */}
        {showEditPublicationModal && editingItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setShowEditPublicationModal(false)}>
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="h-20 bg-gradient-to-br from-green-500 to-green-700 p-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Edit Publication</h2>
                  <p className="text-green-100 text-sm mt-1">Update publication details</p>
                </div>
                <button onClick={() => setShowEditPublicationModal(false)} className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg text-white">
                  <X size={24} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Title *</label>
                  <input type="text" value={editingItem.title || ''} onChange={(e) => setEditingItem({...editingItem, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>

                {/* Authors */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Authors (comma-separated) *</label>
                  <input type="text" value={editingItem.authors?.join(', ') || ''}
                    onChange={(e) => setEditingItem({...editingItem, authors: e.target.value.split(',').map(a => a.trim())})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>

                {/* Type and Year */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Type *</label>
                    <select value={editingItem.type || 'Journal Article'} onChange={(e) => setEditingItem({...editingItem, type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                      <option value="Journal Article">Journal Article</option>
                      <option value="Conference Paper">Conference Paper</option>
                      <option value="Book Chapter">Book Chapter</option>
                      <option value="Book">Book</option>
                      <option value="Review Article">Review Article</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Year *</label>
                    <input type="number" value={editingItem.year || new Date().getFullYear()} onChange={(e) => setEditingItem({...editingItem, year: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
                  </div>
                </div>

                {/* Journal and Publisher */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Journal/Venue *</label>
                    <input type="text" value={editingItem.journal || ''} onChange={(e) => setEditingItem({...editingItem, journal: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Publisher</label>
                    <input type="text" value={editingItem.publisher || ''} onChange={(e) => setEditingItem({...editingItem, publisher: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
                  </div>
                </div>

                {/* DOI and ISBN */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">DOI</label>
                    <input type="text" value={editingItem.doi || ''} onChange={(e) => setEditingItem({...editingItem, doi: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">ISBN</label>
                    <input type="text" value={editingItem.isbn || ''} onChange={(e) => setEditingItem({...editingItem, isbn: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
                  </div>
                </div>

                {/* Impact Factor and Quartile */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Impact Factor</label>
                    <input type="number" step="0.001" value={editingItem.impactFactor || ''} onChange={(e) => setEditingItem({...editingItem, impactFactor: e.target.value ? parseFloat(e.target.value) : null})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Quartile</label>
                    <select value={editingItem.quartile || 'N/A'} onChange={(e) => setEditingItem({...editingItem, quartile: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                      <option value="Q1">Q1</option>
                      <option value="Q2">Q2</option>
                      <option value="Q3">Q3</option>
                      <option value="Q4">Q4</option>
                      <option value="N/A">N/A</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">WoS Ranking</label>
                    <select value={editingItem.wosranking || 'N/A'} onChange={(e) => setEditingItem({...editingItem, wosranking: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                      <option value="SSCI">SSCI</option>
                      <option value="SCIE">SCIE</option>
                      <option value="AHCI">AHCI</option>
                      <option value="ESCI">ESCI</option>
                      <option value="N/A">N/A</option>
                    </select>
                  </div>
                </div>

                {/* Citations, Status, and Discipline */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Citations</label>
                    <input type="number" value={editingItem.citations || 0} onChange={(e) => setEditingItem({...editingItem, citations: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                    <select value={editingItem.status || 'Published'} onChange={(e) => setEditingItem({...editingItem, status: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                      <option value="Published">Published</option>
                      <option value="Under Review">Under Review</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Discipline</label>
                    <select value={editingItem.discipline || 'Nontraditional Security'} onChange={(e) => setEditingItem({...editingItem, discipline: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                      <option value="Nontraditional Security">Nontraditional Security</option>
                      <option value="Business">Business</option>
                      <option value="Management Science">Management Science</option>
                      <option value="Economics">Economics</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Communication">Communication</option>
                      <option value="Psychology">Psychology</option>
                      <option value="Law">Law</option>
                      <option value="Cybersecurity">Cybersecurity</option>
                      <option value="Water Security">Water Security</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Human Resources">Human Resources</option>
                      <option value="IT">IT</option>
                      <option value="Technology Management">Technology Management</option>
                    </select>
                  </div>
                </div>

                {/* Volume, Issue, Pages */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Volume</label>
                    <input type="text" value={editingItem.volume || ''} onChange={(e) => setEditingItem({...editingItem, volume: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Issue</label>
                    <input type="text" value={editingItem.issue || ''} onChange={(e) => setEditingItem({...editingItem, issue: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Pages</label>
                    <input type="text" value={editingItem.pages || ''} onChange={(e) => setEditingItem({...editingItem, pages: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
                  </div>
                </div>

                {/* Abstract */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Abstract</label>
                  <textarea value={editingItem.abstract || ''} onChange={(e) => setEditingItem({...editingItem, abstract: e.target.value})}
                    rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>

                {/* Keywords */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Keywords (comma-separated)</label>
                  <input type="text" value={editingItem.keywords?.join(', ') || ''}
                    onChange={(e) => setEditingItem({...editingItem, keywords: e.target.value.split(',').map(k => k.trim())})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>

                {/* URL */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">URL</label>
                  <input type="text" value={editingItem.url || ''} onChange={(e) => setEditingItem({...editingItem, url: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>

                {/* PDF Upload */}
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Journal PDF (Optional)</label>
                  <input type="file" accept=".pdf" onChange={(e) => setPublicationPdfFile(e.target.files?.[0] || null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  {publicationPdfFile && <p className="text-xs text-green-600 mt-1">✓ Selected: {publicationPdfFile.name}</p>}
                  {editingItem.pdfUrl && !publicationPdfFile && <p className="text-xs text-blue-600 mt-1">📄 Current PDF: {editingItem.pdfUrl.split('/').pop()}</p>}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button onClick={() => {
                    setShowEditPublicationModal(false);
                    setPublicationPdfFile(null);
                  }} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">Cancel</button>
                  <button onClick={async () => {
                    try {
                      if (publicationPdfFile) {
                        const pdfUrl = await publicationService.uploadJournalPdf(publicationPdfFile, editingItem.id);
                        await publicationService.updatePublication(editingItem.id, { ...editingItem, pdfUrl });
                      } else {
                        await publicationService.updatePublication(editingItem.id, editingItem);
                      }
                      setShowEditPublicationModal(false);
                      setPublicationPdfFile(null);
                      loadPublications();
                      alert('Publication updated successfully!');
                    } catch (err) {
                      alert('Error updating publication: ' + (err instanceof Error ? err.message : 'Unknown error'));
                    }
                  }} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">Save Changes</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Project Modal */}
        {showEditProjectModal && editingItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setShowEditProjectModal(false)}>
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="h-16 bg-gradient-to-br from-green-500 to-green-700 p-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Edit Project</h2>
                <button onClick={() => setShowEditProjectModal(false)} className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg text-white">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
                  <input type="text" defaultValue={editingItem.title} onChange={(e) => setEditingItem({...editingItem, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Upload PDF (Optional)</label>
                  <input type="file" accept=".pdf" onChange={(e) => setProjectPdfFile(e.target.files?.[0] || null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  {projectPdfFile && <p className="text-xs text-green-600 mt-1">Selected: {projectPdfFile.name}</p>}
                  {editingItem.pdfUrl && <p className="text-xs text-blue-600 mt-1">Current PDF: {editingItem.pdfUrl.split('/').pop()}</p>}
                </div>
                <div className="flex gap-3 pt-4">
                  <button onClick={() => setShowEditProjectModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg">Cancel</button>
                  <button onClick={async () => {
                    try {
                      if (projectPdfFile) {
                        const pdfUrl = await projectService.uploadProjectPdf(projectPdfFile, editingItem.id);
                        await projectService.updateProject(editingItem.id, { ...editingItem, pdfUrl });
                      } else {
                        await projectService.updateProject(editingItem.id, editingItem);
                      }
                      setShowEditProjectModal(false);
                      setProjectPdfFile(null);
                      loadProjects();
                      alert('Project updated successfully!');
                    } catch (err) {
                      alert('Error updating project: ' + (err instanceof Error ? err.message : 'Unknown error'));
                    }
                  }} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Save Changes</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Patent Modal */}
        {showEditPatentModal && editingItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setShowEditPatentModal(false)}>
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="h-16 bg-gradient-to-br from-green-500 to-green-700 p-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Edit Patent</h2>
                <button onClick={() => setShowEditPatentModal(false)} className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg text-white">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
                  <input type="text" defaultValue={editingItem.title} onChange={(e) => setEditingItem({...editingItem, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Upload PDF (Optional)</label>
                  <input type="file" accept=".pdf" onChange={(e) => setPatentPdfFile(e.target.files?.[0] || null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  {patentPdfFile && <p className="text-xs text-green-600 mt-1">Selected: {patentPdfFile.name}</p>}
                  {editingItem.pdfUrl && <p className="text-xs text-blue-600 mt-1">Current PDF: {editingItem.pdfUrl.split('/').pop()}</p>}
                </div>
                <div className="flex gap-3 pt-4">
                  <button onClick={() => setShowEditPatentModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg">Cancel</button>
                  <button onClick={async () => {
                    try {
                      if (patentPdfFile) {
                        const pdfUrl = await patentService.uploadPatentPdf(patentPdfFile, editingItem.id);
                        await patentService.updatePatent(editingItem.id, { ...editingItem, pdfUrl });
                      } else {
                        await patentService.updatePatent(editingItem.id, editingItem);
                      }
                      setShowEditPatentModal(false);
                      setPatentPdfFile(null);
                      loadPatents();
                      alert('Patent updated successfully!');
                    } catch (err) {
                      alert('Error updating patent: ' + (err instanceof Error ? err.message : 'Unknown error'));
                    }
                  }} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Save Changes</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResearchManagement;