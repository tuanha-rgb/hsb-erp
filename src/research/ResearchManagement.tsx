import React, { useState, useEffect } from "react";
import {
  Briefcase, FileText, DollarSign, TrendingUp, Calendar, Building, Users,
  Search, Plus, Award, ChevronDown, Globe, Target, X, Loader, AlertCircle, Eye, Edit, Trash2, Quote
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
import { faculties } from "../acad/faculties";

const ResearchManagement = () => {
  const [activeView, setActiveView] = useState('overview');
  const [selectedItem, setSelectedItem] = useState(null);

  // Separate state for each tab to prevent input focus issues
  const [projectsSearchTerm, setProjectsSearchTerm] = useState('');
  const [projectsFilterType, setProjectsFilterType] = useState('all');
  const [projectsFilterStatus, setProjectsFilterStatus] = useState('all');

  const [publicationsSearchTerm, setPublicationsSearchTerm] = useState('');
  const [publicationsFilterType, setPublicationsFilterType] = useState('all');
  const [publicationsFilterStatus, setPublicationsFilterStatus] = useState('all');

  const [patentsSearchTerm, setPatentsSearchTerm] = useState('');
  const [patentsFilterType, setPatentsFilterType] = useState('all');
  const [patentsFilterStatus, setPatentsFilterStatus] = useState('all');

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
  const [showBulkAddModal, setShowBulkAddModal] = useState(false);
  const [entryMode, setEntryMode] = useState<'auto' | 'manual'>('auto');
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
  const [manualFormData, setManualFormData] = useState<Partial<Publication>>({
    title: '',
    authors: [],
    type: 'Journal Article',
    journal: '',
    publisher: '',
    year: new Date().getFullYear(),
    citations: 0,
    impactFactor: null,
    status: 'Published',
    doi: '',
    isbn: '',
    quartile: 'N/A',
    wosranking: 'N/A',
    scopusIndexed: false,
    discipline: 'Nontraditional Security',
    volume: '',
    issue: '',
    pages: ''
  });

  // Bulk addition states
  const [bulkPublications, setBulkPublications] = useState<Array<Partial<Publication> & { tempId: number }>>([
    { tempId: 1, title: '', authors: [], journal: '', year: new Date().getFullYear(), type: 'Journal Article', status: 'Published', quartile: 'N/A', wosranking: 'N/A', citations: 0, discipline: 'Nontraditional Security' }
  ]);
  const [isBulkSubmitting, setIsBulkSubmitting] = useState(false);

  // Additional publication fields
  const [formData, setFormData] = useState<Partial<Publication>>({
    impactFactor: null,
    quartile: 'N/A',
    wosranking: 'N/A',
    scopusIndexed: false,
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

  // Add modal states for Projects and Patents
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [showAddPatentModal, setShowAddPatentModal] = useState(false);

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
        scopusIndexed: false,
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
    setEntryMode('auto');
    setFormData({
      impactFactor: null,
      quartile: 'N/A',
      wosranking: 'N/A',
      scopusIndexed: false,
      status: 'Published',
      citations: 0,
      discipline: 'Nontraditional Security'
    });
    setManualFormData({
      title: '',
      authors: [],
      type: 'Journal Article',
      journal: '',
      publisher: '',
      year: new Date().getFullYear(),
      citations: 0,
      impactFactor: null,
      status: 'Published',
      doi: '',
      isbn: '',
      quartile: 'N/A',
      wosranking: 'N/A',
      scopusIndexed: false,
      discipline: 'Nontraditional Security',
      volume: '',
      issue: '',
      pages: ''
    });
  };

  // Add Publication Modal Component
  const renderAddPublicationModal = () => {
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
              <p className="text-blue-100 text-sm mt-1">
                {entryMode === 'auto' ? 'Search by DOI or ISBN' : 'Manual entry'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex bg-white bg-opacity-20 rounded-lg p-1">
                <button
                  onClick={() => setEntryMode('auto')}
                  className={`px-3 py-1 text-sm rounded ${
                    entryMode === 'auto'
                      ? 'bg-white text-blue-600 font-medium'
                      : 'text-white hover:bg-white hover:bg-opacity-10'
                  }`}
                >
                  Auto Fetch
                </button>
                <button
                  onClick={() => setEntryMode('manual')}
                  className={`px-3 py-1 text-sm rounded ${
                    entryMode === 'manual'
                      ? 'bg-white text-blue-600 font-medium'
                      : 'text-white hover:bg-white hover:bg-opacity-10'
                  }`}
                >
                  Manual Entry
                </button>
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
          </div>

          <div className="p-6 space-y-6">{entryMode === 'auto' ? (
            <>
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
                      <option value="Scopus-indexed">Scopus-indexed</option>
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
                      <option value="Scopus-indexed">Scopus-indexed</option>
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
            </>
            ) : (
              <>
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

                {/* Manual Entry Form */}
                <div className="space-y-4">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Title *</label>
                    <input
                      type="text"
                      value={manualFormData.title || ''}
                      onChange={(e) => setManualFormData({...manualFormData, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Authors */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Authors (comma-separated) *</label>
                    <input
                      type="text"
                      value={manualFormData.authors?.join(', ') || ''}
                      onChange={(e) => setManualFormData({...manualFormData, authors: e.target.value.split(',').map(a => a.trim())})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Type and Year */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Type *</label>
                      <select
                        value={manualFormData.type || 'Journal Article'}
                        onChange={(e) => setManualFormData({...manualFormData, type: e.target.value as any})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Journal Article">Journal Article</option>
                        <option value="Conference Paper">Conference Paper</option>
                        <option value="Book Chapter">Book Chapter</option>
                        <option value="Book">Book</option>
                        <option value="Review Article">Review Article</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Year *</label>
                      <input
                        type="number"
                        value={manualFormData.year || new Date().getFullYear()}
                        onChange={(e) => setManualFormData({...manualFormData, year: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Journal and Publisher */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Journal/Venue *</label>
                      <input
                        type="text"
                        value={manualFormData.journal || ''}
                        onChange={(e) => setManualFormData({...manualFormData, journal: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Publisher</label>
                      <input
                        type="text"
                        value={manualFormData.publisher || ''}
                        onChange={(e) => setManualFormData({...manualFormData, publisher: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* DOI and ISBN */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">DOI</label>
                      <input
                        type="text"
                        value={manualFormData.doi || ''}
                        onChange={(e) => setManualFormData({...manualFormData, doi: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">ISBN</label>
                      <input
                        type="text"
                        value={manualFormData.isbn || ''}
                        onChange={(e) => setManualFormData({...manualFormData, isbn: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Impact Factor, Quartile, WoS Ranking */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Impact Factor</label>
                      <input
                        type="number"
                        step="0.001"
                        value={manualFormData.impactFactor || ''}
                        onChange={(e) => setManualFormData({...manualFormData, impactFactor: e.target.value ? parseFloat(e.target.value) : null})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Quartile</label>
                      <select
                        value={manualFormData.quartile || 'N/A'}
                        onChange={(e) => setManualFormData({...manualFormData, quartile: e.target.value as any})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Q1">Q1</option>
                        <option value="Q2">Q2</option>
                        <option value="Q3">Q3</option>
                        <option value="Q4">Q4</option>
                        <option value="Scopus-indexed">Scopus-indexed</option>
                        <option value="N/A">N/A</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">WoS Ranking</label>
                      <select
                        value={manualFormData.wosranking || 'N/A'}
                        onChange={(e) => setManualFormData({...manualFormData, wosranking: e.target.value as any})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="SSCI">SSCI</option>
                        <option value="SCIE">SCIE</option>
                        <option value="AHCI">AHCI</option>
                        <option value="ESCI">ESCI</option>
                        <option value="Scopus-indexed">Scopus-indexed</option>
                        <option value="N/A">N/A</option>
                      </select>
                    </div>
                  </div>

                  {/* Citations, Status, Discipline */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Citations</label>
                      <input
                        type="number"
                        value={manualFormData.citations || 0}
                        onChange={(e) => setManualFormData({...manualFormData, citations: parseInt(e.target.value) || 0})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                      <select
                        value={manualFormData.status || 'Published'}
                        onChange={(e) => setManualFormData({...manualFormData, status: e.target.value as any})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Published">Published</option>
                        <option value="Under Review">Under Review</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Discipline</label>
                      <select
                        value={manualFormData.discipline || 'Nontraditional Security'}
                        onChange={(e) => setManualFormData({...manualFormData, discipline: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  </div>

                  {/* Scopus Indexed */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Scopus Indexed</label>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={manualFormData.scopusIndexed || false}
                        onChange={(e) => setManualFormData({...manualFormData, scopusIndexed: e.target.checked})}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label className="ml-2 text-sm text-gray-600">Indexed in Scopus</label>
                    </div>
                  </div>

                  {/* Volume, Issue, Pages */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Volume</label>
                      <input
                        type="text"
                        value={manualFormData.volume || ''}
                        onChange={(e) => setManualFormData({...manualFormData, volume: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Issue</label>
                      <input
                        type="text"
                        value={manualFormData.issue || ''}
                        onChange={(e) => setManualFormData({...manualFormData, issue: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Pages</label>
                      <input
                        type="text"
                        value={manualFormData.pages || ''}
                        onChange={(e) => setManualFormData({...manualFormData, pages: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* PDF Upload */}
                  <div className="pt-4 border-t border-gray-200">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Upload Publication PDF (Optional)
                    </label>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setPublicationPdfFile(e.target.files?.[0] || null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    {publicationPdfFile && (
                      <p className="text-xs text-green-600 mt-1">
                        Selected: {publicationPdfFile.name}
                      </p>
                    )}
                  </div>
                </div>

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
                    onClick={async () => {
                      if (!manualFormData.title || !manualFormData.authors?.length || !manualFormData.journal) {
                        setError('Please fill in all required fields (Title, Authors, Journal)');
                        return;
                      }

                      setIsSubmitting(true);
                      setError('');

                      try {
                        let pdfUrl = '';
                        if (publicationPdfFile) {
                          const timestamp = Date.now();
                          pdfUrl = await publicationService.uploadJournalPdf(publicationPdfFile, `publication-${timestamp}`);
                        }

                        await publicationService.addPublication({
                          ...manualFormData,
                          pdfUrl: pdfUrl || undefined
                        } as any);

                        setShowAddPublicationModal(false);
                        resetPublicationForm();
                        loadPublications();
                      } catch (err) {
                        setError(`Error adding publication: ${err instanceof Error ? err.message : 'Unknown error'}`);
                      } finally {
                        setIsSubmitting(false);
                      }
                    }}
                    disabled={isSubmitting}
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
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Bulk Addition Modal Component
  const renderBulkAddModal = () => {
    if (!showBulkAddModal) return null;

    const addRow = () => {
      const newId = Math.max(...bulkPublications.map(p => p.tempId), 0) + 1;
      setBulkPublications([...bulkPublications, {
        tempId: newId,
        title: '',
        authors: [],
        journal: '',
        year: new Date().getFullYear(),
        type: 'Journal Article',
        status: 'Published',
        quartile: 'N/A',
        wosranking: 'N/A',
        citations: 0,
        discipline: 'Nontraditional Security'
      }]);
    };

    const removeRow = (tempId: number) => {
      if (bulkPublications.length > 1) {
        setBulkPublications(bulkPublications.filter(p => p.tempId !== tempId));
      }
    };

    const updateRow = (tempId: number, field: string, value: any) => {
      setBulkPublications(bulkPublications.map(pub =>
        pub.tempId === tempId ? { ...pub, [field]: value } : pub
      ));
    };

    const handleBulkSubmit = async () => {
      const validPublications = bulkPublications.filter(p => p.title && p.authors && p.authors.length > 0 && p.journal);

      if (validPublications.length === 0) {
        alert('Please fill in at least one complete row (Title, Authors, Journal are required)');
        return;
      }

      setIsBulkSubmitting(true);

      try {
        for (const pub of validPublications) {
          const { tempId, ...publicationData } = pub;
          await publicationService.addPublication(publicationData as any);
        }

        setShowBulkAddModal(false);
        setBulkPublications([
          { tempId: 1, title: '', authors: [], journal: '', year: new Date().getFullYear(), type: 'Journal Article', status: 'Published', quartile: 'N/A', wosranking: 'N/A', citations: 0, discipline: 'Nontraditional Security' }
        ]);
        loadPublications();
      } catch (err) {
        alert(`Error adding publications: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setIsBulkSubmitting(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setShowBulkAddModal(false)}>
        <div className="bg-white rounded-xl shadow-xl w-full max-w-7xl max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="h-20 bg-gradient-to-br from-green-500 to-green-700 p-6 flex items-center justify-between flex-shrink-0">
            <div>
              <h2 className="text-2xl font-bold text-white">Bulk Add Publications</h2>
              <p className="text-green-100 text-sm mt-1">Add multiple publications at once</p>
            </div>
            <button
              onClick={() => setShowBulkAddModal(false)}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg text-white"
            >
              <X size={24} />
            </button>
          </div>

          {/* Table Container */}
          <div className="flex-1 overflow-auto p-6">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    <th className="border border-gray-300 px-2 py-2 text-xs font-semibold text-gray-700 w-8">#</th>
                    <th className="border border-gray-300 px-2 py-2 text-xs font-semibold text-gray-700 min-w-[200px]">Title *</th>
                    <th className="border border-gray-300 px-2 py-2 text-xs font-semibold text-gray-700 min-w-[150px]">Authors * (comma-sep)</th>
                    <th className="border border-gray-300 px-2 py-2 text-xs font-semibold text-gray-700 min-w-[120px]">Journal *</th>
                    <th className="border border-gray-300 px-2 py-2 text-xs font-semibold text-gray-700 w-20">Year</th>
                    <th className="border border-gray-300 px-2 py-2 text-xs font-semibold text-gray-700 w-32">Type</th>
                    <th className="border border-gray-300 px-2 py-2 text-xs font-semibold text-gray-700 w-24">Quartile</th>
                    <th className="border border-gray-300 px-2 py-2 text-xs font-semibold text-gray-700 w-24">WoS</th>
                    <th className="border border-gray-300 px-2 py-2 text-xs font-semibold text-gray-700 w-20">Cites</th>
                    <th className="border border-gray-300 px-2 py-2 text-xs font-semibold text-gray-700 w-28">Discipline</th>
                    <th className="border border-gray-300 px-2 py-2 text-xs font-semibold text-gray-700 w-20">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bulkPublications.map((pub, index) => (
                    <tr key={pub.tempId} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-2 py-1 text-center text-sm">{index + 1}</td>
                      <td className="border border-gray-300 px-2 py-1">
                        <input
                          type="text"
                          value={pub.title || ''}
                          onChange={(e) => updateRow(pub.tempId, 'title', e.target.value)}
                          className="w-full px-2 py-1 text-sm border-0 focus:outline-none focus:ring-1 focus:ring-green-500"
                          placeholder="Publication title"
                        />
                      </td>
                      <td className="border border-gray-300 px-2 py-1">
                        <input
                          type="text"
                          value={pub.authors?.join(', ') || ''}
                          onChange={(e) => updateRow(pub.tempId, 'authors', e.target.value.split(',').map(a => a.trim()))}
                          className="w-full px-2 py-1 text-sm border-0 focus:outline-none focus:ring-1 focus:ring-green-500"
                          placeholder="Author1, Author2"
                        />
                      </td>
                      <td className="border border-gray-300 px-2 py-1">
                        <input
                          type="text"
                          value={pub.journal || ''}
                          onChange={(e) => updateRow(pub.tempId, 'journal', e.target.value)}
                          className="w-full px-2 py-1 text-sm border-0 focus:outline-none focus:ring-1 focus:ring-green-500"
                          placeholder="Journal name"
                        />
                      </td>
                      <td className="border border-gray-300 px-2 py-1">
                        <input
                          type="number"
                          value={pub.year || ''}
                          onChange={(e) => updateRow(pub.tempId, 'year', parseInt(e.target.value))}
                          className="w-full px-2 py-1 text-sm border-0 focus:outline-none focus:ring-1 focus:ring-green-500"
                        />
                      </td>
                      <td className="border border-gray-300 px-2 py-1">
                        <select
                          value={pub.type || 'Journal Article'}
                          onChange={(e) => updateRow(pub.tempId, 'type', e.target.value)}
                          className="w-full px-1 py-1 text-xs border-0 focus:outline-none focus:ring-1 focus:ring-green-500"
                        >
                          <option value="Journal Article">Journal</option>
                          <option value="Conference Paper">Conference</option>
                          <option value="Book Chapter">Book Chapter</option>
                          <option value="Book">Book</option>
                        </select>
                      </td>
                      <td className="border border-gray-300 px-2 py-1">
                        <select
                          value={pub.quartile || 'N/A'}
                          onChange={(e) => updateRow(pub.tempId, 'quartile', e.target.value)}
                          className="w-full px-1 py-1 text-xs border-0 focus:outline-none focus:ring-1 focus:ring-green-500"
                        >
                          <option value="Q1">Q1</option>
                          <option value="Q2">Q2</option>
                          <option value="Q3">Q3</option>
                          <option value="Q4">Q4</option>
                          <option value="Scopus-indexed">Scopus-indexed</option>
                          <option value="N/A">N/A</option>
                        </select>
                      </td>
                      <td className="border border-gray-300 px-2 py-1">
                        <select
                          value={pub.wosranking || 'N/A'}
                          onChange={(e) => updateRow(pub.tempId, 'wosranking', e.target.value)}
                          className="w-full px-1 py-1 text-xs border-0 focus:outline-none focus:ring-1 focus:ring-green-500"
                        >
                          <option value="SSCI">SSCI</option>
                          <option value="SCIE">SCIE</option>
                          <option value="AHCI">AHCI</option>
                          <option value="ESCI">ESCI</option>
                          <option value="Scopus-indexed">Scopus</option>
                          <option value="N/A">N/A</option>
                        </select>
                      </td>
                      <td className="border border-gray-300 px-2 py-1">
                        <input
                          type="number"
                          value={pub.citations || 0}
                          onChange={(e) => updateRow(pub.tempId, 'citations', parseInt(e.target.value) || 0)}
                          className="w-full px-2 py-1 text-sm border-0 focus:outline-none focus:ring-1 focus:ring-green-500"
                        />
                      </td>
                      <td className="border border-gray-300 px-2 py-1">
                        <select
                          value={pub.discipline || 'Nontraditional Security'}
                          onChange={(e) => updateRow(pub.tempId, 'discipline', e.target.value)}
                          className="w-full px-1 py-1 text-xs border-0 focus:outline-none focus:ring-1 focus:ring-green-500"
                        >
                          <option value="Nontraditional Security">NTS</option>
                          <option value="Business">Business</option>
                          <option value="Management Science">Management</option>
                          <option value="Economics">Economics</option>
                          <option value="Marketing">Marketing</option>
                        </select>
                      </td>
                      <td className="border border-gray-300 px-2 py-1 text-center">
                        <button
                          onClick={() => removeRow(pub.tempId)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Delete row"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              onClick={addRow}
              className="mt-4 flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              <Plus size={18} />
              Add Row
            </button>
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
            <button
              onClick={() => {
                setShowBulkAddModal(false);
                setBulkPublications([
                  { tempId: 1, title: '', authors: [], journal: '', year: new Date().getFullYear(), type: 'Journal Article', status: 'Published', quartile: 'N/A', wosranking: 'N/A', citations: 0, discipline: 'Nontraditional Security' }
                ]);
              }}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-white font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleBulkSubmit}
              disabled={isBulkSubmitting}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isBulkSubmitting ? (
                <>
                  <Loader className="animate-spin" size={18} />
                  Adding {bulkPublications.filter(p => p.title && p.authors?.length && p.journal).length} publications...
                </>
              ) : (
                `Add ${bulkPublications.filter(p => p.title && p.authors?.length && p.journal).length} Publications`
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const OverviewDashboard = () => {
    // Calculate statistics from actual data
    const totalCitations = publications.reduce((sum, pub) => sum + (pub.citations || 0), 0);
    const avgCitations = publications.length > 0 ? (totalCitations / publications.length).toFixed(1) : '0';

    // Extract total funding amount (parse funding strings like "$500,000")
    const totalFunding = projects.reduce((sum, proj) => {
      const fundingStr = proj.funding?.replace(/[$,]/g, '') || '0';
      const amount = parseFloat(fundingStr);
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);
    const formattedFunding = totalFunding >= 1000000
      ? `$${(totalFunding / 1000000).toFixed(1)}M`
      : totalFunding >= 1000
      ? `$${(totalFunding / 1000).toFixed(0)}K`
      : `$${totalFunding.toFixed(0)}`;

    // Calculate SCOPUS + WOS publications
    const scopusWosCount = publications.filter(p =>
      p.quartile === 'Q1' ||
      p.quartile === 'Q2' ||
      p.quartile === 'Q3' ||
      p.quartile === 'Q4' ||
      p.quartile === 'Scopus-indexed' ||
      p.scopusIndexed === true ||
      p.wosranking === 'SSCI' ||
      p.wosranking === 'SCIE' ||
      p.wosranking === 'AHCI' ||
      p.wosranking === 'ESCI'
    ).length;
    const otherPublicationsCount = publications.length - scopusWosCount;

    return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-3">
        <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">Total Projects</p>
          <p className="text-3xl font-bold text-gray-900">{projects.length}</p>
          <p className="text-xs text-gray-600 mt-2">{projects.filter(p => p.status === 'Active').length} active</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">Total Publications</p>
          <p className="text-3xl font-bold text-gray-900">{publications.length}</p>
          <div className="mt-2 space-y-0.5">
            <p className="text-xs text-gray-600">{scopusWosCount} SCOPUS+WoS</p>
            <p className="text-xs text-gray-600">{otherPublicationsCount} Other</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">Total Patents</p>
          <p className="text-3xl font-bold text-gray-900">{patents.length}</p>
          <p className="text-xs text-gray-600 mt-2">
            {patents.filter(p => p.status === 'Granted').length} granted
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">Reputable Journals</p>
          <p className="text-3xl font-bold text-gray-900">
            {publications.filter(p =>
              p.quartile === 'Q1' ||
              p.quartile === 'Q2' ||
              p.wosranking === 'SSCI' ||
              p.wosranking === 'SCIE' ||
              p.wosranking === 'AHCI'
            ).length}
          </p>
          <p className="text-xs text-gray-600 mt-2">
            {publications.length > 0
              ? `${Math.round((publications.filter(p =>
                  p.quartile === 'Q1' ||
                  p.quartile === 'Q2' ||
                  p.wosranking === 'SSCI' ||
                  p.wosranking === 'SCIE' ||
                  p.wosranking === 'AHCI'
                ).length / publications.length) * 100)}% of total`
              : '0% of total'
            }
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">Total Funding</p>
          <p className="text-3xl font-bold text-gray-900">{formattedFunding}</p>
          <p className="text-xs text-gray-600 mt-2">Active grants</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-teal-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">Avg Citations</p>
          <p className="text-3xl font-bold text-gray-900">{avgCitations}</p>
          <p className="text-xs text-gray-600 mt-2">Per publication</p>
        </div>
      </div>

    

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Projects by Department</h3>
          <div className="space-y-4">
            {(() => {
              const deptCounts: { [key: string]: number } = {};
              projects.forEach(proj => {
                if (proj.department) {
                  deptCounts[proj.department] = (deptCounts[proj.department] || 0) + 1;
                }
              });
              const deptArray = Object.entries(deptCounts)
                .map(([dept, count]) => ({ dept, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 5);
              const total = projects.length || 1;

              return deptArray.length > 0 ? deptArray.map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{item.dept}</span>
                    <span className="text-sm font-semibold text-gray-900">{item.count} projects</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="h-2 rounded-full bg-blue-500" style={{width: `${(item.count / total) * 100}%`}}></div>
                  </div>
                </div>
              )) : <p className="text-sm text-gray-500">No projects yet</p>;
            })()}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Publication Types</h3>
          <div className="space-y-4">
            {(() => {
              const typeCounts: { [key: string]: number } = {
                'Journal Article': publications.filter(p => p.type === 'Journal Article').length,
                'Conference Paper': publications.filter(p => p.type === 'Conference Paper').length,
                'Book Chapter': publications.filter(p => p.type === 'Book Chapter').length,
                'Book': publications.filter(p => p.type === 'Book').length,
                'Patents': patents.length
              };
              const typeArray = Object.entries(typeCounts)
                .filter(([_, count]) => count > 0)
                .map(([type, count]) => ({ type, count }))
                .sort((a, b) => b.count - a.count);
              const total = publications.length + patents.length || 1;

              return typeArray.length > 0 ? typeArray.map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{item.type}</span>
                    <span className="text-sm font-semibold text-gray-900">{item.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="h-2 rounded-full bg-green-500" style={{width: `${(item.count / total) * 100}%`}}></div>
                  </div>
                </div>
              )) : <p className="text-sm text-gray-500">No publications yet</p>;
            })()}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Authors</h3>
          <div className="space-y-4">
            {(() => {
              const authorStats: { [key: string]: { pubs: number, citations: number } } = {};
              publications.forEach(pub => {
                pub.authors?.forEach(author => {
                  if (!authorStats[author]) {
                    authorStats[author] = { pubs: 0, citations: 0 };
                  }
                  authorStats[author].pubs += 1;
                  authorStats[author].citations += pub.citations || 0;
                });
              });
              const topAuthors = Object.entries(authorStats)
                .map(([name, stats]) => ({ name, ...stats }))
                .sort((a, b) => b.pubs - a.pubs)
                .slice(0, 5);

              return topAuthors.length > 0 ? topAuthors.map((researcher, i) => (
                <div key={i} className="flex items-start gap-3 pb-3 border-b last:border-b-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">{researcher.name}</p>
                    <div className="flex gap-3 mt-1">
                      <span className="text-xs text-gray-600">{researcher.pubs} pubs</span>
                      <span className="text-xs text-gray-600">{researcher.citations} citations</span>
                    </div>
                  </div>
                </div>
              )) : <p className="text-sm text-gray-500">No authors yet</p>;
            })()}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Funding Sources</h3>
          <div className="space-y-3">
            {(() => {
              const fundingSources: { [key: string]: number } = {};
              projects.forEach(proj => {
                const source = proj.fundingSource || 'Other';
                const fundingStr = proj.funding?.replace(/[$,]/g, '') || '0';
                const amount = parseFloat(fundingStr);
                if (!isNaN(amount)) {
                  fundingSources[source] = (fundingSources[source] || 0) + amount;
                }
              });
              const sourceArray = Object.entries(fundingSources)
                .map(([source, amount]) => ({ source, amount }))
                .sort((a, b) => b.amount - a.amount)
                .slice(0, 5);
              const totalFunding = sourceArray.reduce((sum, item) => sum + item.amount, 0) || 1;

              return sourceArray.length > 0 ? sourceArray.map((item, i) => {
                const formatted = item.amount >= 1000000
                  ? `$${(item.amount / 1000000).toFixed(1)}M`
                  : `$${(item.amount / 1000).toFixed(0)}K`;
                return (
                  <div key={i} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{item.source}</span>
                      <span className="text-sm font-bold text-gray-900">{formatted}</span>
                    </div>
                    <div className="w-full bg-gray-300 rounded-full h-1.5">
                      <div className="h-1.5 rounded-full bg-blue-600" style={{width: `${(item.amount / totalFunding) * 100}%`}}></div>
                    </div>
                  </div>
                );
              }) : <p className="text-sm text-gray-500">No funding sources yet</p>;
            })()}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Publications by Discipline</h3>
          <div className="space-y-3">
            {(() => {
              const disciplineCounts: { [key: string]: number } = {};
              publications.forEach(pub => {
                const disc = pub.discipline || 'Other';
                disciplineCounts[disc] = (disciplineCounts[disc] || 0) + 1;
              });
              const disciplineArray = Object.entries(disciplineCounts)
                .map(([discipline, count]) => ({ discipline, count }))
                .sort((a, b) => b.count - a.count);

              return disciplineArray.length > 0 ? disciplineArray.map((item, i) => (
                <div key={i} className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="text-xs text-gray-700">{item.discipline}</span>
                  </div>
                  <span className="text-xs font-bold text-gray-900">{item.count}</span>
                </div>
              )) : <p className="text-sm text-gray-500">No publications yet</p>;
            })()}
          </div>
        </div>
      </div>
    </div>
    );
  };

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
                  value={projectsSearchTerm}
                  onChange={(e) => setProjectsSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={projectsFilterType}
                onChange={(e) => setProjectsFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All Types</option>
                <option value="applied">Applied Research</option>
                <option value="basic">Basic Research</option>
              </select>
              <select
                value={projectsFilterStatus}
                onChange={(e) => setProjectsFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <button onClick={() => setShowAddProjectModal(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
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
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">PI</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Department</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Funding</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Progress</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoadingProjects ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    <Loader className="animate-spin mx-auto mb-2" size={24} />
                    <p className="text-sm">Loading projects...</p>
                  </td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    <p className="text-lg font-semibold mb-2">No projects available</p>
                    <p className="text-sm">Click "New Project" to add your first project</p>
                  </td>
                </tr>
              ) : (
                projects
                  .filter(project => {
                    const matchesSearch = projectsSearchTerm === '' ||
                      project.title.toLowerCase().includes(projectsSearchTerm.toLowerCase()) ||
                      project.pi.toLowerCase().includes(projectsSearchTerm.toLowerCase());
                    const matchesType = projectsFilterType === 'all' ||
                      project.type.toLowerCase().includes(projectsFilterType);
                    const matchesStatus = projectsFilterStatus === 'all' ||
                      project.status.toLowerCase() === projectsFilterStatus;
                    return matchesSearch && matchesType && matchesStatus;
                  })
                  .map((project) => (
                    <tr key={project.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-sm text-gray-900 max-w-xs">{project.title}</p>
                        <p className="text-xs text-gray-500 mt-1">{project.type}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{project.pi}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                          {project.department}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-gray-900">{project.funding}</p>
                        <p className="text-xs text-gray-500">{project.fundingSource}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 w-20">
                            <div
                              className="h-2 rounded-full bg-green-600"
                              style={{width: `${project.progress}%`}}
                            ></div>
                          </div>
                          <span className="text-xs font-semibold text-gray-700">{project.progress}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-600">
                        {new Date(project.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        <br />
                        {new Date(project.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                          {project.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedItem({type: 'project', data: project})}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            title="View Details"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingItem(project);
                              setShowEditProjectModal(true);
                            }}
                            className="p-1 text-orange-600 hover:bg-orange-50 rounded"
                            title="Edit Project"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={async () => {
                              if (window.confirm('Are you sure you want to delete this project?')) {
                                try {
                                  await projectService.deleteProject(project.id!);
                                  loadProjects();
                                } catch (err) {
                                  alert('Error deleting project: ' + (err instanceof Error ? err.message : 'Unknown error'));
                                }
                              }
                            }}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            title="Delete Project"
                          >
                            <Trash2 className="w-5 h-5" />
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

  // Add Project Modal Component
  const renderAddProjectModal = () => {
    const [newProject, setNewProject] = useState<Partial<Project>>({
      title: '',
      pi: '',
      coInvestigators: [],
      type: 'Applied Research',
      status: 'Pending',
      startDate: '',
      endDate: '',
      funding: '',
      fundingSource: '',
      progress: 0,
      publications: 0,
      department: '',
      description: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);

      try {
        let pdfUrl = '';
        if (projectPdfFile) {
          const timestamp = Date.now();
          pdfUrl = await projectService.uploadProjectPdf(projectPdfFile, `project-${timestamp}`);
        }

        await projectService.addProject({
          ...newProject,
          pdfUrl: pdfUrl || undefined
        } as any);

        alert('Project added successfully!');
        setShowAddProjectModal(false);
        setProjectPdfFile(null);
        loadProjects();
      } catch (error) {
        console.error('Error adding project:', error);
        alert('Failed to add project');
      } finally {
        setIsSubmitting(false);
      }
    };

    if (!showAddProjectModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setShowAddProjectModal(false)}>
        <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <div className="h-20 bg-gradient-to-br from-blue-500 to-blue-700 p-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Add New Project</h2>
              <p className="text-blue-100 text-sm mt-1">Create a new research project</p>
            </div>
            <button onClick={() => setShowAddProjectModal(false)} className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg text-white">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Project Title *</label>
              <input type="text" required value={newProject.title || ''} onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            {/* PI and Department */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Principal Investigator *</label>
                <input type="text" required value={newProject.pi || ''} onChange={(e) => setNewProject({...newProject, pi: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Department *</label>
                <select required value={newProject.department || ''} onChange={(e) => setNewProject({...newProject, department: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select Department</option>
                  {faculties.map(faculty => (
                    <option key={faculty.code} value={faculty.name}>{faculty.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Co-Investigators */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Co-Investigators (comma-separated)</label>
              <input type="text" value={newProject.coInvestigators?.join(', ') || ''}
                onChange={(e) => setNewProject({...newProject, coInvestigators: e.target.value.split(',').map(i => i.trim()).filter(i => i)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            {/* Type and Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Type *</label>
                <select value={newProject.type || 'Applied Research'} onChange={(e) => setNewProject({...newProject, type: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="Applied Research">Applied Research</option>
                  <option value="Basic Research">Basic Research</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Status *</label>
                <select value={newProject.status || 'Pending'} onChange={(e) => setNewProject({...newProject, status: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
            </div>

            {/* Start and End Date */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Start Date *</label>
                <input type="date" required value={newProject.startDate || ''} onChange={(e) => setNewProject({...newProject, startDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">End Date *</label>
                <input type="date" required value={newProject.endDate || ''} onChange={(e) => setNewProject({...newProject, endDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            {/* Funding and Source */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Funding Amount *</label>
                <input type="text" required placeholder="e.g., $250,000" value={newProject.funding || ''} onChange={(e) => setNewProject({...newProject, funding: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Funding Source *</label>
                <input type="text" required value={newProject.fundingSource || ''} onChange={(e) => setNewProject({...newProject, fundingSource: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            {/* Progress and Publications */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Progress (0-100) *</label>
                <input type="number" required min="0" max="100" value={newProject.progress || 0} onChange={(e) => setNewProject({...newProject, progress: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Publications Count</label>
                <input type="number" min="0" value={newProject.publications || 0} onChange={(e) => setNewProject({...newProject, publications: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Description *</label>
              <textarea required rows={4} value={newProject.description || ''} onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            {/* PDF Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Upload Project PDF (Optional)</label>
              <input type="file" accept=".pdf" onChange={(e) => setProjectPdfFile(e.target.files?.[0] || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button type="button" onClick={() => setShowAddProjectModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button type="submit" disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400">
                {isSubmitting ? 'Adding...' : 'Add Project'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Add Patent Modal Component
  const renderAddPatentModal = () => {
    const [newPatent, setNewPatent] = useState<Partial<Patent>>({
      title: '',
      inventors: [],
      applicationNumber: '',
      applicationDate: '',
      status: 'Pending',
      grantDate: null,
      patentNumber: null,
      type: 'Invention Patent',
      faculty: '',
      discipline: '',
      abstract: '',
      country: '',
      ipOffice: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);

      try {
        let pdfUrl = '';
        if (patentPdfFile) {
          const timestamp = Date.now();
          pdfUrl = await patentService.uploadPatentPdf(patentPdfFile, `patent-${timestamp}`);
        }

        const patentData = {
          ...newPatent,
          grantDate: newPatent.grantDate || null,
          patentNumber: newPatent.patentNumber || null,
          pdfUrl: pdfUrl || undefined
        };

        await patentService.addPatent(patentData as any);

        alert('Patent added successfully!');
        setShowAddPatentModal(false);
        setPatentPdfFile(null);
        loadPatents();
      } catch (error) {
        console.error('Error adding patent:', error);
        alert('Failed to add patent');
      } finally {
        setIsSubmitting(false);
      }
    };

    if (!showAddPatentModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setShowAddPatentModal(false)}>
        <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <div className="h-20 bg-gradient-to-br from-purple-500 to-purple-700 p-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Add New Patent</h2>
              <p className="text-purple-100 text-sm mt-1">Create a new patent entry</p>
            </div>
            <button onClick={() => setShowAddPatentModal(false)} className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg text-white">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Patent Title *</label>
              <input type="text" required value={newPatent.title || ''} onChange={(e) => setNewPatent({...newPatent, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>

            {/* Inventors */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Inventors (comma-separated) *</label>
              <input type="text" required value={newPatent.inventors?.join(', ') || ''}
                onChange={(e) => setNewPatent({...newPatent, inventors: e.target.value.split(',').map(i => i.trim()).filter(i => i)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>

            {/* Application Number and Date */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Application Number *</label>
                <input type="text" required value={newPatent.applicationNumber || ''} onChange={(e) => setNewPatent({...newPatent, applicationNumber: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Application Date *</label>
                <input type="date" required value={newPatent.applicationDate || ''} onChange={(e) => setNewPatent({...newPatent, applicationDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
            </div>

            {/* Type and Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Type *</label>
                <select value={newPatent.type || 'Invention Patent'} onChange={(e) => setNewPatent({...newPatent, type: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option value="Invention Patent">Invention Patent</option>
                  <option value="Utility Model">Utility Model</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Status *</label>
                <select value={newPatent.status || 'Pending'} onChange={(e) => setNewPatent({...newPatent, status: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option value="Granted">Granted</option>
                  <option value="Pending">Pending</option>
                  <option value="Under Examination">Under Examination</option>
                  <option value="International Filing">International Filing</option>
                  <option value="International">International</option>
                </select>
              </div>
            </div>

            {/* Patent Number and Grant Date (conditional) */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Patent Number {newPatent.status === 'Granted' && '*'}</label>
                <input type="text" value={newPatent.patentNumber || ''} onChange={(e) => setNewPatent({...newPatent, patentNumber: e.target.value})}
                  required={newPatent.status === 'Granted'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Grant Date {newPatent.status === 'Granted' && '*'}</label>
                <input type="date" value={newPatent.grantDate || ''} onChange={(e) => setNewPatent({...newPatent, grantDate: e.target.value})}
                  required={newPatent.status === 'Granted'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
            </div>

            {/* Faculty and Discipline */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Faculty *</label>
                <select required value={newPatent.faculty || ''} onChange={(e) => setNewPatent({...newPatent, faculty: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option value="">Select Faculty</option>
                  {faculties.map(faculty => (
                    <option key={faculty.code} value={faculty.name}>{faculty.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Discipline *</label>
                <select required value={newPatent.discipline || ''} onChange={(e) => setNewPatent({...newPatent, discipline: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option value="">Select Discipline</option>
                  {faculties.map(faculty => (
                    <option key={faculty.code} value={faculty.name}>{faculty.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Country and IP Office */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Country *</label>
                <input type="text" required value={newPatent.country || ''} onChange={(e) => setNewPatent({...newPatent, country: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">IP Office *</label>
                <input type="text" required value={newPatent.ipOffice || ''} onChange={(e) => setNewPatent({...newPatent, ipOffice: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
            </div>

            {/* Abstract */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Abstract *</label>
              <textarea required rows={4} value={newPatent.abstract || ''} onChange={(e) => setNewPatent({...newPatent, abstract: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>

            {/* PDF Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Upload Patent PDF (Optional)</label>
              <input type="file" accept=".pdf" onChange={(e) => setPatentPdfFile(e.target.files?.[0] || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button type="button" onClick={() => setShowAddPatentModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button type="submit" disabled={isSubmitting}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400">
                {isSubmitting ? 'Adding...' : 'Add Patent'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

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
                  value={publicationsSearchTerm}
                  onChange={(e) => setPublicationsSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={publicationsFilterType}
                onChange={(e) => setPublicationsFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All Types</option>
                <option value="journal">Journal Article</option>
                <option value="conference">Conference Paper</option>
                <option value="book">Book Chapter</option>
                <option value="book">Book</option>

              </select>
              <select
                value={publicationsFilterStatus}
                onChange={(e) => setPublicationsFilterStatus(e.target.value)}
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
                    All Citations
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
              <button
                onClick={() => setShowBulkAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <FileText size={18} />
                Bulk Addition
              </button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-4 p-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">Total</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{publications.length}</p>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-600">All publications in database</p>
          </div>
        </div>

        <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-39 h-24 rounded-lg flex items-center justify-center">
              <img src="https://firebasestorage.googleapis.com/v0/b/hsb-library.firebasestorage.app/o/journals%2Fwos.jpg?alt=media&token=fa4e5314-b51b-46f5-9e4c-f18044cdda67" alt="Web of Science" className="w-full h-full object-contain" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {publications.filter(p => p.wosranking && p.wosranking !== 'N/A').length}
          </p>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-600">
              {publications.length > 0
                ? `${Math.round((publications.filter(p => p.wosranking && p.wosranking !== 'N/A' ).length / publications.length) * 100)}% of total`
                : '0% of total'
              }
            </p>
          </div>
        </div>

        <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-54 h-24 rounded-lg flex items-center justify-center">
              <img src="https://firebasestorage.googleapis.com/v0/b/hsb-library.firebasestorage.app/o/journals%2Fscopus.jpg?alt=media&token=f856a81c-19ad-43df-afdf-afa8acc4d982" alt="Scopus" className="w-full h-full object-contain" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {publications.filter(p =>
              p.quartile === 'Q1' ||
              p.quartile === 'Q2' ||
              p.quartile === 'Q3' ||
              p.quartile === 'Q4' ||
              p.quartile === 'Scopus-indexed' ||
              p.scopusIndexed === true
              
            ).length}
          </p>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-600">
              {publications.length > 0
                ? `${Math.round((publications.filter(p =>
                    p.quartile === 'Q1' ||
                    p.quartile === 'Q2' ||
                    p.quartile === 'Q3' ||
                    p.quartile === 'Q4' ||
                    p.quartile === 'Scopus-indexed' ||
                    p.scopusIndexed === true
                  ).length / publications.length) * 100)}% of total`
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
              <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded">Reputable</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {publications.filter(p =>
              p.quartile === 'Q1' ||
              p.quartile === 'Q2' ||
              p.wosranking === 'SSCI' ||
              p.wosranking === 'SCIE' ||
              p.wosranking === 'AHCI'
            ).length}
          </p>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-600">
              {publications.length > 0
                ? `${Math.round((publications.filter(p =>
                    p.quartile === 'Q1' ||
                    p.quartile === 'Q2' ||
                    p.wosranking === 'SSCI' ||
                    p.wosranking === 'SCIE' ||
                    p.wosranking === 'AHCI'
                  ).length / publications.length) * 100)}% of total`
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
                    const matchesSearch = publicationsSearchTerm === '' ||
                      pub.title.toLowerCase().includes(publicationsSearchTerm.toLowerCase()) ||
                      pub.authors.some(a => a.toLowerCase().includes(publicationsSearchTerm.toLowerCase()));
                    const matchesType = publicationsFilterType === 'all' || pub.type.toLowerCase().includes(publicationsFilterType);
                    const matchesStatus = publicationsFilterStatus === 'all' || pub.status.toLowerCase() === publicationsFilterStatus;
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
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">{pub.journal}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDisciplineColor(pub.discipline)}`}>
                          {pub.discipline}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">{pub.year}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">{pub.citations}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm space-y-1">
                          {pub.quartile && pub.quartile !== 'N/A' && (
                            <div className="font-semibold text-gray-900">{pub.quartile}</div>
                          )}
                          {pub.wosranking && pub.wosranking !== 'N/A' && (
                            <div className="text-xs text-gray-600">{pub.wosranking}</div>
                          )}
                          {(!pub.quartile || pub.quartile === 'N/A') && (!pub.wosranking || pub.wosranking === 'N/A') && (
                            <span className="text-sm text-gray-400">N/A</span>
                          )}
                        </div>
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
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            title="View Details"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingItem(pub);
                              setShowEditPublicationModal(true);
                            }}
                            className="p-1 text-orange-600 hover:bg-orange-50 rounded"
                            title="Edit Publication"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          {pub.doi && (
                            <button
                              onClick={() => fetchCitationsForPublication(pub)}
                              disabled={fetchingCitations.has(pub.id!)}
                              className="p-1 text-purple-600 hover:bg-purple-50 rounded disabled:text-gray-400 disabled:cursor-not-allowed"
                              title="Fetch Citations"
                            >
                              {fetchingCitations.has(pub.id!) ? (
                                <Loader size={20} className="animate-spin" />
                              ) : (
                                <Quote className="w-5 h-5" />
                              )}
                            </button>
                          )}
                          <button
                            onClick={async () => {
                              if (window.confirm('Are you sure you want to delete this publication?')) {
                                try {
                                  await publicationService.deletePublication(pub.id!);
                                  loadPublications();
                                } catch (err) {
                                  alert('Error deleting publication: ' + (err instanceof Error ? err.message : 'Unknown error'));
                                }
                              }
                            }}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            title="Delete Publication"
                          >
                            <Trash2 className="w-5 h-5" />
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
                  value={patentsSearchTerm}
                  onChange={(e) => setPatentsSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={patentsFilterStatus}
                onChange={(e) => setPatentsFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All Status</option>
                <option value="Granted">Granted</option>
                <option value="Pending">Pending</option>
                <option value="Under Examination">Under Examination</option>
                <option value="International">International</option>
              </select>
              <select
                value={patentsFilterType}
                onChange={(e) => setPatentsFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All Types</option>
                <option value="Invention Patent">Invention Patent</option>
                <option value="Utility Model">Utility Model</option>
              </select>
            </div>
            <button onClick={() => setShowAddPatentModal(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
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
                    const matchesSearch = patentsSearchTerm === '' ||
                      patent.title.toLowerCase().includes(patentsSearchTerm.toLowerCase()) ||
                      patent.inventors.some(inv => inv.toLowerCase().includes(patentsSearchTerm.toLowerCase()));
                    const matchesType = patentsFilterType === 'all' || patent.type === patentsFilterType;
                    const matchesStatus = patentsFilterStatus === 'all' || patent.status === patentsFilterStatus;
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
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            title="View Details"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingItem(patent);
                              setShowEditPatentModal(true);
                            }}
                            className="p-1 text-orange-600 hover:bg-orange-50 rounded"
                            title="Edit Patent"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={async () => {
                              if (window.confirm('Are you sure you want to delete this patent?')) {
                                try {
                                  await patentService.deletePatent(patent.id!);
                                  loadPatents();
                                } catch (err) {
                                  alert('Error deleting patent: ' + (err instanceof Error ? err.message : 'Unknown error'));
                                }
                              }
                            }}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            title="Delete Patent"
                          >
                            <Trash2 className="w-5 h-5" />
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
        {renderAddPublicationModal()}

        {/* Bulk Addition Modal */}
        {renderBulkAddModal()}

        {/* Add Project Modal */}
        {renderAddProjectModal()}

        {/* Add Patent Modal */}
        {renderAddPatentModal()}

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
                      <option value="Scopus-indexed">Scopus-indexed</option>
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

                {/* Scopus Indexed */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Scopus Indexed</label>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editingItem.scopusIndexed || false}
                      onChange={(e) => setEditingItem({...editingItem, scopusIndexed: e.target.checked})}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <label className="ml-2 text-sm text-gray-600">Indexed in Scopus</label>
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
                  <input type="text" value={editingItem.title || ''} onChange={(e) => setEditingItem({...editingItem, title: e.target.value})}
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
                  <input type="text" value={editingItem.title || ''} onChange={(e) => setEditingItem({...editingItem, title: e.target.value})}
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