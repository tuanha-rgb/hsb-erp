import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit, Trash2, UserPlus, Calendar, Award, Shield, Search, X, ChevronDown, ChevronRight, FileText, Clock, CheckCircle, XCircle, AlertCircle, TrendingUp, DollarSign, Building2, HandHeart, Loader2 } from 'lucide-react';
import {
  subscribeToOrganizations,
  addOrganization as addOrgToFirebase,
  updateOrganization as updateOrgInFirebase,
  deleteOrganization as deleteOrgFromFirebase,
  Organization as FirebaseOrganization
} from '../firebase/organization.service';
import {
  getStudentByCode,
  getStaffById
} from '../firebase/student.service';

type OrganizationType = 'Party' | 'Union' | 'Club';
type MemberRole = 'Advisor' | 'President' | 'Vice President' | 'Secretary' | 'Treasurer' | 'Member';
type ProposalStatus = 'Pending' | 'Approved' | 'Rejected' | 'Under Review';
type Quarter = 'Q1' | 'Q2' | 'Q3' | 'Q4';
type SponsorType = 'Individual' | 'Corporate' | 'Government' | 'NGO';

interface Member {
  id: string;
  studentId: string;
  name: string;
  role: MemberRole;
  joinDate: string;
  email: string;
  phone: string;
  department: string;
  year: number;
  termStart?: string;
  termEnd?: string;
  responsibilities?: string;
}

interface Activity {
  id: string;
  name: string;
  date: string;
  location: string;
  participants: number;
  description: string;
  quarter: Quarter;
  year: number;
  budget?: string;
  outcome?: string;
}

interface Proposal {
  id: string;
  title: string;
  submittedBy: string;
  submittedDate: string;
  type: 'Activity' | 'Budget' | 'Policy' | 'Other';
  description: string;
  requestedBudget?: string;
  status: ProposalStatus;
  reviewedBy?: string;
  reviewDate?: string;
  comments?: string;
}

interface Sponsorship {
  id: string;
  sponsorName: string;
  sponsorType: SponsorType;
  contactPerson?: string;
  email?: string;
  phone?: string;
  amount: string;
  contributionDate: string;
  purpose: string;
  status: 'Active' | 'Completed' | 'Pending';
  notes?: string;
}

interface Organization {
  id: string;
  name: string;
  type: OrganizationType;
  foundedDate: string;
  advisor: string;
  description: string;
  members: Member[];
  activities: Activity[];
  proposals: Proposal[];
  sponsorships: Sponsorship[];
  totalMembers: number;
  activitiesCount: number;
}

// Initial organizations (will be integrated with Firebase data)
const initialOrganizations: Organization[] = [
  {
    id: 'ORG001',
    name: 'Communist Youth Union',
    type: 'Union',
    foundedDate: '1995-09-15',
    advisor: 'Dr. Nguyen Van A',
    description: 'Youth political organization supporting Party leadership and promoting social activities',
    totalMembers: 0,
    activitiesCount: 0,
    members: [],
    activities: [],
    proposals: [],
    sponsorships: []
  },
  {
    id: 'ORG002',
    name: 'HRC - HSB Research Club',
    type: 'Club',
    foundedDate: '2020-09-01',
    advisor: 'Dr. Vo Thi F',
    description: 'Student research club focused on academic research projects, publications, and scientific activities',
    totalMembers: 0,
    activitiesCount: 0,
    members: [],
    activities: [],
    proposals: [],
    sponsorships: []
  },
  {
    id: 'ORG003',
    name: 'HPC - HSB Performance Club',
    type: 'Club',
    foundedDate: '2018-10-15',
    advisor: 'Ms. Tran Thi B',
    description: 'Arts and performance club for music, dance, drama, and cultural performances',
    totalMembers: 0,
    activitiesCount: 0,
    members: [],
    activities: [],
    proposals: [],
    sponsorships: []
  },
  {
    id: 'ORG004',
    name: 'GLC - Global Language Club',
    type: 'Club',
    foundedDate: '2019-03-01',
    advisor: 'Ms. Hoang Van E',
    description: 'Language learning and cultural exchange club for English, Chinese, Japanese, and other languages',
    totalMembers: 0,
    activitiesCount: 0,
    members: [],
    activities: [],
    proposals: [],
    sponsorships: []
  },
  {
    id: 'ORG005',
    name: 'HVC - HSB Volunteer Club',
    type: 'Club',
    foundedDate: '2017-05-20',
    advisor: 'Dr. Pham Thi D',
    description: 'Community service and volunteer activities club supporting social causes and charity work',
    totalMembers: 0,
    activitiesCount: 0,
    members: [],
    activities: [],
    proposals: [],
    sponsorships: []
  }
];

export default function PartyUnionClubs() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [view, setView] = useState<'list' | 'details' | 'members' | 'activities' | 'proposals' | 'leaders'>('list');
  const [activeTab, setActiveTab] = useState<'activities' | 'members' | 'sponsorship'>('activities');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<OrganizationType | 'all'>('all');
  const [filterQuarter, setFilterQuarter] = useState<Quarter | 'all'>('all');
  const [showAddOrgModal, setShowAddOrgModal] = useState(false);
  const [showEditOrgModal, setShowEditOrgModal] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);
  const [showAddProposalModal, setShowAddProposalModal] = useState(false);
  const [showAddSponsorshipModal, setShowAddSponsorshipModal] = useState(false);
  const [expandedOrgs, setExpandedOrgs] = useState<Set<string>>(new Set());

  // Subscribe to Firebase organizations
  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToOrganizations(
      (orgs) => {
        // If no organizations exist in Firebase, seed with initial data
        if (orgs.length === 0) {
          initialOrganizations.forEach(async (org) => {
            const { id, ...orgData } = org;
            await addOrgToFirebase(orgData);
          });
        } else {
          setOrganizations(orgs);
          setLoading(false);
        }
      },
      (err) => {
        console.error('Error loading organizations:', err);
        setError('Failed to load organizations');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const filteredOrgs = organizations.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         org.advisor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || org.type === filterType;
    return matchesSearch && matchesType;
  });

  const getLeaders = (org: Organization) => {
    return org.members.filter(m => m.role !== 'Member');
  };

  const getQuarterlyActivities = (org: Organization) => {
    const grouped: Record<string, Activity[]> = {};
    org.activities.forEach(activity => {
      const key = `${activity.year}-${activity.quarter}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(activity);
    });
    return grouped;
  };

  const toggleExpand = (orgId: string) => {
    const newExpanded = new Set(expandedOrgs);
    if (newExpanded.has(orgId)) {
      newExpanded.delete(orgId);
    } else {
      newExpanded.add(orgId);
    }
    setExpandedOrgs(newExpanded);
  };

  const handleAddOrganization = async (org: Omit<Organization, 'id' | 'members' | 'activities' | 'proposals' | 'sponsorships'>) => {
    try {
      const newOrg = {
        ...org,
        members: [],
        activities: [],
        proposals: [],
        sponsorships: []
      };
      await addOrgToFirebase(newOrg);
      setShowAddOrgModal(false);
    } catch (error) {
      console.error('Error adding organization:', error);
      alert('Failed to add organization. Please try again.');
    }
  };

  const handleUpdateOrganization = async (updatedData: Omit<Organization, 'id' | 'members' | 'activities' | 'proposals' | 'sponsorships'>) => {
    if (!editingOrg) return;

    try {
      await updateOrgInFirebase(editingOrg.id, updatedData);
      setShowEditOrgModal(false);
      setEditingOrg(null);
    } catch (error) {
      console.error('Error updating organization:', error);
      alert('Failed to update organization. Please try again.');
    }
  };

  const handleDeleteOrganization = async (id: string) => {
    if (confirm('Are you sure you want to delete this organization?')) {
      try {
        await deleteOrgFromFirebase(id);
        if (selectedOrg?.id === id) {
          setSelectedOrg(null);
          setView('list');
        }
      } catch (error) {
        console.error('Error deleting organization:', error);
        alert('Failed to delete organization. Please try again.');
      }
    }
  };

  const handleAddMember = async (member: Omit<Member, 'id'>) => {
    if (!selectedOrg) return;

    try {
      const newMember: Member = {
        ...member,
        id: `M${String(selectedOrg.members.length + 1).padStart(3, '0')}`
      };

      const updatedMembers = [...selectedOrg.members, newMember];
      await updateOrgInFirebase(selectedOrg.id, {
        members: updatedMembers,
        totalMembers: selectedOrg.totalMembers + 1
      });

      setShowAddMemberModal(false);
    } catch (error) {
      console.error('Error adding member:', error);
      alert('Failed to add member. Please try again.');
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    if (!selectedOrg || !confirm('Remove this member?')) return;

    try {
      const updatedMembers = selectedOrg.members.filter(m => m.id !== memberId);
      await updateOrgInFirebase(selectedOrg.id, {
        members: updatedMembers,
        totalMembers: selectedOrg.totalMembers - 1
      });
    } catch (error) {
      console.error('Error deleting member:', error);
      alert('Failed to remove member. Please try again.');
    }
  };

  const handleAddActivity = async (activity: Omit<Activity, 'id'>) => {
    if (!selectedOrg) return;

    try {
      const newActivity: Activity = {
        ...activity,
        id: `ACT${String(selectedOrg.activities.length + 1).padStart(3, '0')}`
      };

      const updatedActivities = [...selectedOrg.activities, newActivity];
      await updateOrgInFirebase(selectedOrg.id, {
        activities: updatedActivities,
        activitiesCount: selectedOrg.activitiesCount + 1
      });

      setShowAddActivityModal(false);
    } catch (error) {
      console.error('Error adding activity:', error);
      alert('Failed to add activity. Please try again.');
    }
  };

  const handleDeleteActivity = async (activityId: string) => {
    if (!selectedOrg || !confirm('Delete this activity?')) return;

    try {
      const updatedActivities = selectedOrg.activities.filter(a => a.id !== activityId);
      await updateOrgInFirebase(selectedOrg.id, {
        activities: updatedActivities,
        activitiesCount: selectedOrg.activitiesCount - 1
      });
    } catch (error) {
      console.error('Error deleting activity:', error);
      alert('Failed to delete activity. Please try again.');
    }
  };

  const handleAddProposal = async (proposal: Omit<Proposal, 'id'>) => {
    if (!selectedOrg) return;

    try {
      const newProposal: Proposal = {
        ...proposal,
        id: `PROP${String(selectedOrg.proposals.length + 1).padStart(3, '0')}`
      };

      const updatedProposals = [...selectedOrg.proposals, newProposal];
      await updateOrgInFirebase(selectedOrg.id, {
        proposals: updatedProposals
      });

      setShowAddProposalModal(false);
    } catch (error) {
      console.error('Error adding proposal:', error);
      alert('Failed to add proposal. Please try again.');
    }
  };

  const handleUpdateProposalStatus = async (proposalId: string, status: ProposalStatus) => {
    if (!selectedOrg) return;

    try {
      const updatedProposals = selectedOrg.proposals.map(p =>
        p.id === proposalId
          ? { ...p, status, reviewDate: new Date().toISOString().split('T')[0] }
          : p
      );

      await updateOrgInFirebase(selectedOrg.id, {
        proposals: updatedProposals
      });
    } catch (error) {
      console.error('Error updating proposal status:', error);
      alert('Failed to update proposal status. Please try again.');
    }
  };

  const handleAddSponsorship = async (sponsorship: Omit<Sponsorship, 'id'>) => {
    if (!selectedOrg) return;

    try {
      const newSponsorship: Sponsorship = {
        ...sponsorship,
        id: `SPON${String(selectedOrg.sponsorships.length + 1).padStart(3, '0')}`
      };

      const updatedSponsorships = [...selectedOrg.sponsorships, newSponsorship];
      await updateOrgInFirebase(selectedOrg.id, {
        sponsorships: updatedSponsorships
      });

      setShowAddSponsorshipModal(false);
    } catch (error) {
      console.error('Error adding sponsorship:', error);
      alert('Failed to add sponsorship. Please try again.');
    }
  };

  const handleDeleteSponsorship = async (sponsorshipId: string) => {
    if (!selectedOrg || !confirm('Delete this sponsorship record?')) return;

    try {
      const updatedSponsorships = selectedOrg.sponsorships.filter(s => s.id !== sponsorshipId);
      await updateOrgInFirebase(selectedOrg.id, {
        sponsorships: updatedSponsorships
      });
    } catch (error) {
      console.error('Error deleting sponsorship:', error);
      alert('Failed to delete sponsorship. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading organizations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Party/Union/Clubs Management</h1>
        <p className="text-gray-600">Manage student organizations, leaders, members, activities, and proposals</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border-2 border-blue-200">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-6 h-6 text-blue-600" />
            <h3 className="text-sm font-medium text-blue-900">Total Organizations</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">{organizations.length}</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border-2 border-green-200">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-6 h-6 text-green-600" />
            <h3 className="text-sm font-medium text-green-900">Party & Unions</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">
            {organizations.filter(o => o.type === 'Party' || o.type === 'Union').length}
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border-2 border-purple-200">
          <div className="flex items-center gap-3 mb-2">
            <Award className="w-6 h-6 text-purple-600" />
            <h3 className="text-sm font-medium text-purple-900">Clubs</h3>
          </div>
          <p className="text-3xl font-bold text-purple-600">
            {organizations.filter(o => o.type === 'Club').length}
          </p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border-2 border-orange-200">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-6 h-6 text-orange-600" />
            <h3 className="text-sm font-medium text-orange-900">Total Members</h3>
          </div>
          <p className="text-3xl font-bold text-orange-600">
            {organizations.reduce((sum, org) => sum + org.totalMembers, 0)}
          </p>
        </div>

        <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-6 border-2 border-teal-200">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-6 h-6 text-teal-600" />
            <h3 className="text-sm font-medium text-teal-900">Active Proposals</h3>
          </div>
          <p className="text-3xl font-bold text-teal-600">
            {organizations.reduce((sum, org) => sum + org.proposals.filter(p => p.status === 'Pending' || p.status === 'Under Review').length, 0)}
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search organizations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Types</option>
          <option value="Party">Party</option>
          <option value="Union">Union</option>
          <option value="Club">Club</option>
        </select>

        <button
          onClick={() => setShowAddOrgModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          Add Organization
        </button>
      </div>

      {/* Main Content */}
      {view === 'list' ? (
        <div className="bg-white rounded-lg border">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Organization</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Advisor</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Members</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Activities</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Proposals</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredOrgs.map((org) => {
                const leaders = getLeaders(org);
                const pendingProposals = org.proposals.filter(p => p.status === 'Pending' || p.status === 'Under Review').length;

                return (
                  <React.Fragment key={org.id}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleExpand(org.id)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            {expandedOrgs.has(org.id) ? (
                              <ChevronDown size={20} />
                            ) : (
                              <ChevronRight size={20} />
                            )}
                          </button>
                          <div>
                            <div className="font-semibold text-gray-900">{org.name}</div>
                            <div className="text-xs text-gray-500">Founded: {new Date(org.foundedDate).toLocaleDateString()}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          org.type === 'Party' ? 'bg-red-100 text-red-700' :
                          org.type === 'Union' ? 'bg-blue-100 text-blue-700' :
                          'bg-purple-100 text-purple-700'
                        }`}>
                          {org.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{org.advisor}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Users size={16} className="text-gray-400" />
                          <span className="font-medium">{org.totalMembers}</span>
                          {leaders.length > 0 && (
                            <span className="text-xs text-gray-500">({leaders.length} leaders)</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-gray-400" />
                          <span className="font-medium">{org.activitiesCount}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FileText size={16} className="text-gray-400" />
                          <span className="font-medium">{org.proposals.length}</span>
                          {pendingProposals > 0 && (
                            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full">{pendingProposals} pending</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedOrg(org);
                              setActiveTab('activities');
                              setView('details');
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
                          >
                            Manage
                          </button>
                          <button
                            onClick={() => {
                              setSelectedOrg(org);
                              setView('leaders');
                            }}
                            className="px-3 py-1 bg-orange-100 text-orange-700 rounded hover:bg-orange-200 text-sm"
                          >
                            Leaders
                          </button>
                          <button
                            onClick={() => {
                              setSelectedOrg(org);
                              setView('proposals');
                            }}
                            className="px-3 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 text-sm"
                          >
                            Proposals
                          </button>
                          <button
                            onClick={() => {
                              setEditingOrg(org);
                              setShowEditOrgModal(true);
                            }}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            title="Edit organization"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteOrganization(org.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            title="Delete organization"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedOrgs.has(org.id) && (
                      <tr>
                        <td colSpan={7} className="px-6 py-4 bg-gray-50">
                          <p className="text-sm text-gray-700">{org.description}</p>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : view === 'details' && selectedOrg ? (
        <div>
          <div className="mb-4">
            <button
              onClick={() => {
                setView('list');
                setSelectedOrg(null);
              }}
              className="text-blue-600 hover:text-blue-700 mb-2"
            >
              ← Back to Organizations
            </button>
            <h2 className="text-2xl font-bold">{selectedOrg.name}</h2>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-b mb-6">
            <button
              onClick={() => setActiveTab('activities')}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'activities'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <span>Activities</span>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                  {selectedOrg.activitiesCount}
                </span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'members'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Users size={18} />
                <span>Members</span>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                  {selectedOrg.totalMembers}
                </span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('sponsorship')}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'sponsorship'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <HandHeart size={18} />
                <span>Sponsorship</span>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                  {selectedOrg.sponsorships.length}
                </span>
              </div>
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'activities' && (
            <ActivitiesView
              org={selectedOrg}
              onBack={() => {}}
              onAddActivity={() => setShowAddActivityModal(true)}
              onDeleteActivity={handleDeleteActivity}
              filterQuarter={filterQuarter}
              setFilterQuarter={setFilterQuarter}
            />
          )}
          {activeTab === 'members' && (
            <MembersView
              org={selectedOrg}
              onBack={() => {}}
              onAddMember={() => setShowAddMemberModal(true)}
              onDeleteMember={handleDeleteMember}
            />
          )}
          {activeTab === 'sponsorship' && (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <HandHeart size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">Sponsorship Management</h3>
              <p className="text-gray-600 mb-4">Track sponsors and funding sources</p>
              <button
                onClick={() => setShowAddSponsorshipModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="inline mr-2" size={16} />
                Add Sponsor
              </button>
              <div className="mt-6">
                {selectedOrg.sponsorships.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {selectedOrg.sponsorships.map((sponsor) => (
                      <div key={sponsor.id} className="bg-white rounded-lg border p-4 text-left">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold">{sponsor.sponsorName}</h4>
                          <button
                            onClick={() => handleDeleteSponsorship(sponsor.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="text-sm text-gray-600">{sponsor.sponsorType}</p>
                        <p className="text-lg font-bold text-green-600 mt-2">{sponsor.amount}</p>
                        <p className="text-sm mt-2">{sponsor.purpose}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : view === 'leaders' && selectedOrg ? (
        <LeadersView
          org={selectedOrg}
          onBack={() => {
            setView('list');
            setSelectedOrg(null);
          }}
          onAddMember={() => setShowAddMemberModal(true)}
          onDeleteMember={handleDeleteMember}
        />
      ) : view === 'members' && selectedOrg ? (
        <MembersView
          org={selectedOrg}
          onBack={() => {
            setView('list');
            setSelectedOrg(null);
          }}
          onAddMember={() => setShowAddMemberModal(true)}
          onDeleteMember={handleDeleteMember}
        />
      ) : view === 'activities' && selectedOrg ? (
        <ActivitiesView
          org={selectedOrg}
          onBack={() => {
            setView('list');
            setSelectedOrg(null);
          }}
          onAddActivity={() => setShowAddActivityModal(true)}
          onDeleteActivity={handleDeleteActivity}
          filterQuarter={filterQuarter}
          setFilterQuarter={setFilterQuarter}
        />
      ) : view === 'proposals' && selectedOrg ? (
        <ProposalsView
          org={selectedOrg}
          onBack={() => {
            setView('list');
            setSelectedOrg(null);
          }}
          onAddProposal={() => setShowAddProposalModal(true)}
          onUpdateStatus={handleUpdateProposalStatus}
        />
      ) : null}

      {/* Modals */}
      {showAddOrgModal && (
        <AddOrganizationModal
          onClose={() => setShowAddOrgModal(false)}
          onAdd={handleAddOrganization}
        />
      )}

      {showEditOrgModal && editingOrg && (
        <EditOrganizationModal
          onClose={() => {
            setShowEditOrgModal(false);
            setEditingOrg(null);
          }}
          onUpdate={handleUpdateOrganization}
          organization={editingOrg}
        />
      )}

      {showAddMemberModal && selectedOrg && (
        <AddMemberModal
          onClose={() => setShowAddMemberModal(false)}
          onAdd={handleAddMember}
        />
      )}

      {showAddActivityModal && selectedOrg && (
        <AddActivityModal
          onClose={() => setShowAddActivityModal(false)}
          onAdd={handleAddActivity}
        />
      )}

      {showAddProposalModal && selectedOrg && (
        <AddProposalModal
          onClose={() => setShowAddProposalModal(false)}
          onAdd={handleAddProposal}
        />
      )}

      {showAddSponsorshipModal && selectedOrg && (
        <AddSponsorshipModal
          onClose={() => setShowAddSponsorshipModal(false)}
          onAdd={handleAddSponsorship}
        />
      )}
    </div>
  );
}

// Leaders View Component
function LeadersView({ org, onBack, onAddMember, onDeleteMember }: {
  org: Organization;
  onBack: () => void;
  onAddMember: () => void;
  onDeleteMember: (id: string) => void;
}) {
  const leaders = org.members.filter(m => m.role !== 'Member');

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <button onClick={onBack} className="text-blue-600 hover:text-blue-700 mb-2">
            ← Back to Organizations
          </button>
          <h2 className="text-2xl font-bold">{org.name} - Leadership Team</h2>
        </div>
        <button
          onClick={onAddMember}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <UserPlus size={20} />
          Add Leader
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {leaders.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            No leaders yet. Add leadership team members!
          </div>
        ) : (
          leaders.map((leader) => (
            <div key={leader.id} className="bg-white rounded-lg border p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    leader.role === 'President' ? 'bg-red-100 text-red-700' :
                    leader.role === 'Vice President' ? 'bg-orange-100 text-orange-700' :
                    leader.role === 'Secretary' ? 'bg-blue-100 text-blue-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {leader.role}
                  </span>
                </div>
                <button
                  onClick={() => onDeleteMember(leader.id)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2">{leader.name}</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Student ID:</span>
                  <span>{leader.studentId}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Department:</span>
                  <span>{leader.department}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Year:</span>
                  <span>Year {leader.year}</span>
                </div>
                {leader.termStart && leader.termEnd && (
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>Term: {new Date(leader.termStart).toLocaleDateString()} - {new Date(leader.termEnd).toLocaleDateString()}</span>
                  </div>
                )}
                {leader.responsibilities && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="font-medium text-gray-700 mb-1">Responsibilities:</div>
                    <p className="text-gray-600 text-sm">{leader.responsibilities}</p>
                  </div>
                )}
                <div className="mt-3 pt-3 border-t flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">✉️</span>
                    <span className="text-xs">{leader.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">📱</span>
                    <span className="text-xs">{leader.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Members View Component
function MembersView({ org, onBack, onAddMember, onDeleteMember }: {
  org: Organization;
  onBack: () => void;
  onAddMember: () => void;
  onDeleteMember: (id: string) => void;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <button onClick={onBack} className="text-blue-600 hover:text-blue-700 mb-2">
            ← Back to Organizations
          </button>
          <h2 className="text-2xl font-bold">{org.name} - All Members</h2>
        </div>
        <button
          onClick={onAddMember}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <UserPlus size={20} />
          Add Member
        </button>
      </div>

      <div className="bg-white rounded-lg border">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Student ID</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Department</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Year</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Join Date</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {org.members.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  No members yet. Add the first member!
                </td>
              </tr>
            ) : (
              org.members.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium">{member.studentId}</td>
                  <td className="px-6 py-4">
                    <div className="font-semibold">{member.name}</div>
                    <div className="text-xs text-gray-500">{member.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      member.role === 'President' ? 'bg-red-100 text-red-700' :
                      member.role === 'Vice President' ? 'bg-orange-100 text-orange-700' :
                      member.role === 'Secretary' ? 'bg-blue-100 text-blue-700' :
                      member.role === 'Treasurer' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {member.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">{member.department}</td>
                  <td className="px-6 py-4 text-sm">Year {member.year}</td>
                  <td className="px-6 py-4 text-sm">{new Date(member.joinDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => onDeleteMember(member.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Activities View Component
function ActivitiesView({ org, onBack, onAddActivity, onDeleteActivity, filterQuarter, setFilterQuarter }: {
  org: Organization;
  onBack: () => void;
  onAddActivity: () => void;
  onDeleteActivity: (id: string) => void;
  filterQuarter: Quarter | 'all';
  setFilterQuarter: (q: Quarter | 'all') => void;
}) {
  const quarterlyActivities: Record<string, Activity[]> = {};

  org.activities.forEach(activity => {
    if (filterQuarter === 'all' || activity.quarter === filterQuarter) {
      const key = `${activity.year}-${activity.quarter}`;
      if (!quarterlyActivities[key]) quarterlyActivities[key] = [];
      quarterlyActivities[key].push(activity);
    }
  });

  const quarters = Object.keys(quarterlyActivities).sort().reverse();

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <button onClick={onBack} className="text-blue-600 hover:text-blue-700 mb-2">
            ← Back to Organizations
          </button>
          <h2 className="text-2xl font-bold">{org.name} - Activities</h2>
        </div>
        <div className="flex gap-3">
          <select
            value={filterQuarter}
            onChange={(e) => setFilterQuarter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Quarters</option>
            <option value="Q1">Q1 (Jan-Mar)</option>
            <option value="Q2">Q2 (Apr-Jun)</option>
            <option value="Q3">Q3 (Jul-Sep)</option>
            <option value="Q4">Q4 (Oct-Dec)</option>
          </select>
          <button
            onClick={onAddActivity}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus size={20} />
            Add Activity
          </button>
        </div>
      </div>

      {quarters.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No activities for selected quarter. Add the first activity!
        </div>
      ) : (
        quarters.map(quarter => (
          <div key={quarter} className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <TrendingUp size={20} className="text-blue-600" />
              {quarter} ({quarterlyActivities[quarter].length} activities)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quarterlyActivities[quarter].map((activity) => (
                <div key={activity.id} className="bg-white rounded-lg border p-6 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-bold text-lg">{activity.name}</h4>
                    <button
                      onClick={() => onDeleteActivity(activity.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>{new Date(activity.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={16} />
                      <span>{activity.participants} participants</span>
                    </div>
                    <div className="text-gray-500">{activity.location}</div>
                    {activity.budget && (
                      <div className="text-green-600 font-medium">Budget: {activity.budget}</div>
                    )}
                    <p className="text-gray-700 mt-2">{activity.description}</p>
                    {activity.outcome && (
                      <div className="mt-3 pt-3 border-t">
                        <div className="font-medium text-gray-700 mb-1">Outcome:</div>
                        <p className="text-gray-600 text-sm">{activity.outcome}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// Proposals View Component
function ProposalsView({ org, onBack, onAddProposal, onUpdateStatus }: {
  org: Organization;
  onBack: () => void;
  onAddProposal: () => void;
  onUpdateStatus: (id: string, status: ProposalStatus) => void;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <button onClick={onBack} className="text-blue-600 hover:text-blue-700 mb-2">
            ← Back to Organizations
          </button>
          <h2 className="text-2xl font-bold">{org.name} - Proposals</h2>
        </div>
        <button
          onClick={onAddProposal}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          Submit Proposal
        </button>
      </div>

      <div className="bg-white rounded-lg border">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Submitted By</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Budget</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {org.proposals.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  No proposals yet. Submit the first proposal!
                </td>
              </tr>
            ) : (
              org.proposals.map((proposal) => (
                <React.Fragment key={proposal.id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{proposal.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        {proposal.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">{proposal.submittedBy}</td>
                    <td className="px-6 py-4 text-sm">{new Date(proposal.submittedDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm font-medium">{proposal.requestedBudget || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        proposal.status === 'Approved' ? 'bg-green-100 text-green-700' :
                        proposal.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                        proposal.status === 'Under Review' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {proposal.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {proposal.status === 'Pending' || proposal.status === 'Under Review' ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => onUpdateStatus(proposal.id, 'Approved')}
                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                            title="Approve"
                          >
                            <CheckCircle size={16} />
                          </button>
                          <button
                            onClick={() => onUpdateStatus(proposal.id, 'Rejected')}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            title="Reject"
                          >
                            <XCircle size={16} />
                          </button>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">
                          {proposal.reviewedBy && `By ${proposal.reviewedBy}`}
                        </span>
                      )}
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td colSpan={7} className="px-6 py-3">
                      <div className="text-sm text-gray-700">
                        <span className="font-medium">Description:</span> {proposal.description}
                        {proposal.comments && (
                          <div className="mt-2">
                            <span className="font-medium">Comments:</span> {proposal.comments}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Add Organization Modal Component
function AddOrganizationModal({ onClose, onAdd }: {
  onClose: () => void;
  onAdd: (org: Omit<Organization, 'id' | 'members' | 'activities' | 'proposals' | 'sponsorships'>) => void;
}) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'Club' as OrganizationType,
    foundedDate: new Date().toISOString().split('T')[0],
    advisor: '',
    description: '',
    totalMembers: 0,
    activitiesCount: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h3 className="text-2xl font-bold">Add New Organization</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Organization Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Type *</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as OrganizationType })}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="Party">Party</option>
              <option value="Union">Union</option>
              <option value="Club">Club</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Founded Date *</label>
            <input
              type="date"
              required
              value={formData.foundedDate}
              onChange={(e) => setFormData({ ...formData, foundedDate: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Advisor *</label>
            <input
              type="text"
              required
              value={formData.advisor}
              onChange={(e) => setFormData({ ...formData, advisor: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Add Organization
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Edit Organization Modal Component
function EditOrganizationModal({ onClose, onUpdate, organization }: {
  onClose: () => void;
  onUpdate: (org: Omit<Organization, 'id' | 'members' | 'activities' | 'proposals' | 'sponsorships'>) => void;
  organization: Organization;
}) {
  const [formData, setFormData] = useState({
    name: organization.name,
    type: organization.type,
    foundedDate: organization.foundedDate,
    advisor: organization.advisor,
    description: organization.description,
    totalMembers: organization.totalMembers,
    activitiesCount: organization.activitiesCount
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h3 className="text-2xl font-bold">Edit Organization</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Organization Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Type *</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as OrganizationType })}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="Party">Party</option>
              <option value="Union">Union</option>
              <option value="Club">Club</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Founded Date *</label>
            <input
              type="date"
              required
              value={formData.foundedDate}
              onChange={(e) => setFormData({ ...formData, foundedDate: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Advisor *</label>
            <input
              type="text"
              required
              value={formData.advisor}
              onChange={(e) => setFormData({ ...formData, advisor: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Update Organization
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Add Member Modal Component
function AddMemberModal({ onClose, onAdd }: {
  onClose: () => void;
  onAdd: (member: Omit<Member, 'id'>) => void;
}) {
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    role: 'Member' as MemberRole,
    joinDate: new Date().toISOString().split('T')[0],
    email: '',
    phone: '',
    department: '',
    year: 1,
    termStart: '',
    termEnd: '',
    responsibilities: ''
  });
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [lookupMessage, setLookupMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleLookup = async () => {
    if (!formData.studentId.trim()) {
      setLookupMessage({ type: 'error', text: 'Please enter a Student ID or Staff ID' });
      return;
    }

    setIsLookingUp(true);
    setLookupMessage(null);

    try {
      // Try student lookup first
      let profile = await getStudentByCode(formData.studentId.trim());

      // If not found, try staff lookup
      if (!profile) {
        const staffProfile = await getStaffById(formData.studentId.trim());

        if (staffProfile) {
          setFormData({
            ...formData,
            name: staffProfile.name || '',
            email: staffProfile.email || '',
            phone: staffProfile.phone || '',
            department: staffProfile.department || '',
            year: 1 // Default for staff
          });
          setLookupMessage({ type: 'success', text: `Staff information loaded: ${staffProfile.name}` });
          return;
        }
      }

      if (profile) {
        setFormData({
          ...formData,
          name: profile.name || '',
          email: profile.email || '',
          phone: profile.phone || '',
          department: profile.department || '',
          year: profile.year || 1
        });
        setLookupMessage({ type: 'success', text: `Student information loaded: ${profile.name}` });
      } else {
        setLookupMessage({ type: 'error', text: 'No student or staff found with this ID' });
      }
    } catch (error) {
      console.error('Lookup error:', error);
      setLookupMessage({ type: 'error', text: 'Failed to lookup information. Please try again.' });
    } finally {
      setIsLookingUp(false);
    }
  };

  const handleStudentIdKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleLookup();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h3 className="text-2xl font-bold">Add New Member</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Student ID / Staff ID *</label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                onKeyPress={handleStudentIdKeyPress}
                className="flex-1 border rounded-lg px-3 py-2"
                placeholder="Enter Student Code or Staff ID"
              />
              <button
                type="button"
                onClick={handleLookup}
                disabled={isLookingUp || !formData.studentId.trim()}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLookingUp ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Looking up...
                  </>
                ) : (
                  <>
                    <Search size={16} />
                    Lookup
                  </>
                )}
              </button>
            </div>
            {lookupMessage && (
              <div className={`mt-2 text-sm ${lookupMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                {lookupMessage.type === 'success' ? '✓ ' : '✗ '}
                {lookupMessage.text}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Role *</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as MemberRole })}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="Advisor">Advisor</option>
                <option value="President">President</option>
                <option value="Vice President">Vice President</option>
                <option value="Secretary">Secretary</option>
                <option value="Treasurer">Treasurer</option>
                <option value="Member">Member</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Join Date *</label>
            <input
              type="date"
              required
              value={formData.joinDate}
              onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          {formData.role !== 'Member' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Term Start</label>
                <input
                  type="date"
                  value={formData.termStart}
                  onChange={(e) => setFormData({ ...formData, termStart: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Term End</label>
                <input
                  type="date"
                  value={formData.termEnd}
                  onChange={(e) => setFormData({ ...formData, termEnd: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Phone *</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Department *</label>
              <input
                type="text"
                required
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Year *</label>
              <select
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value={1}>Year 1</option>
                <option value={2}>Year 2</option>
                <option value={3}>Year 3</option>
                <option value={4}>Year 4</option>
              </select>
            </div>
          </div>

          {formData.role !== 'Member' && (
            <div>
              <label className="block text-sm font-medium mb-1">Responsibilities</label>
              <textarea
                value={formData.responsibilities}
                onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                rows={3}
                placeholder="Describe key responsibilities for this leadership role..."
              />
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Add Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Add Activity Modal Component
function AddActivityModal({ onClose, onAdd }: {
  onClose: () => void;
  onAdd: (activity: Omit<Activity, 'id'>) => void;
}) {
  const [formData, setFormData] = useState({
    name: '',
    date: new Date().toISOString().split('T')[0],
    location: '',
    participants: 0,
    description: '',
    quarter: 'Q1' as Quarter,
    year: new Date().getFullYear(),
    budget: '',
    outcome: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h3 className="text-2xl font-bold">Add New Activity</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Activity Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Date *</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Quarter *</label>
              <select
                value={formData.quarter}
                onChange={(e) => setFormData({ ...formData, quarter: e.target.value as Quarter })}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="Q1">Q1 (Jan-Mar)</option>
                <option value="Q2">Q2 (Apr-Jun)</option>
                <option value="Q3">Q3 (Jul-Sep)</option>
                <option value="Q4">Q4 (Oct-Dec)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Year *</label>
              <input
                type="number"
                required
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Expected Participants</label>
              <input
                type="number"
                min="0"
                value={formData.participants}
                onChange={(e) => setFormData({ ...formData, participants: parseInt(e.target.value) || 0 })}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Budget</label>
              <input
                type="text"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="e.g., $500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Location *</label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Expected Outcome</label>
            <textarea
              value={formData.outcome}
              onChange={(e) => setFormData({ ...formData, outcome: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
              rows={2}
              placeholder="What do you hope to achieve with this activity?"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Add Activity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Add Proposal Modal Component
function AddProposalModal({ onClose, onAdd }: {
  onClose: () => void;
  onAdd: (proposal: Omit<Proposal, 'id'>) => void;
}) {
  const [formData, setFormData] = useState({
    title: '',
    submittedBy: '',
    submittedDate: new Date().toISOString().split('T')[0],
    type: 'Activity' as 'Activity' | 'Budget' | 'Policy' | 'Other',
    description: '',
    requestedBudget: '',
    status: 'Pending' as ProposalStatus,
    comments: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h3 className="text-2xl font-bold">Submit New Proposal</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Proposal Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="Activity">Activity</option>
                <option value="Budget">Budget</option>
                <option value="Policy">Policy</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Submitted By *</label>
              <input
                type="text"
                required
                value={formData.submittedBy}
                onChange={(e) => setFormData({ ...formData, submittedBy: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Requested Budget</label>
            <input
              type="text"
              value={formData.requestedBudget}
              onChange={(e) => setFormData({ ...formData, requestedBudget: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="e.g., $2000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description *</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
              rows={4}
              placeholder="Provide detailed description of your proposal..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Submit Proposal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Add Sponsorship Modal Component
function AddSponsorshipModal({ onClose, onAdd }: {
  onClose: () => void;
  onAdd: (sponsorship: Omit<Sponsorship, 'id'>) => void;
}) {
  const [formData, setFormData] = useState({
    sponsorName: '',
    sponsorType: 'Corporate' as SponsorType,
    contactPerson: '',
    email: '',
    phone: '',
    amount: '',
    contributionDate: new Date().toISOString().split('T')[0],
    purpose: '',
    status: 'Active' as 'Active' | 'Completed' | 'Pending',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h3 className="text-2xl font-bold">Add New Sponsor</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Sponsor Name *</label>
              <input
                type="text"
                required
                value={formData.sponsorName}
                onChange={(e) => setFormData({ ...formData, sponsorName: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Organization or individual name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Sponsor Type *</label>
              <select
                value={formData.sponsorType}
                onChange={(e) => setFormData({ ...formData, sponsorType: e.target.value as SponsorType })}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="Individual">Individual</option>
                <option value="Corporate">Corporate</option>
                <option value="Government">Government</option>
                <option value="NGO">NGO</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Contact Person</label>
              <input
                type="text"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Primary contact name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="contact@example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="0912345678"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Amount *</label>
              <input
                type="text"
                required
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="e.g., $5,000"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Contribution Date *</label>
              <input
                type="date"
                required
                value={formData.contributionDate}
                onChange={(e) => setFormData({ ...formData, contributionDate: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Status *</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Active' | 'Completed' | 'Pending' })}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Purpose *</label>
            <textarea
              required
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
              rows={3}
              placeholder="Describe how the sponsorship will be used..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
              rows={2}
              placeholder="Additional information or terms..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Add Sponsor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
