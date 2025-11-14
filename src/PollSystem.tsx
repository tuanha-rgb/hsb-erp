// PollSystem.tsx
import { useState, useEffect } from 'react';
import { db } from './firebase/firebase.config';
import {
  collection, addDoc, doc, getDoc, updateDoc, setDoc, getDocs,
  onSnapshot, increment, serverTimestamp, query, where, orderBy, deleteDoc
} from 'firebase/firestore';
import { X, Plus, Trash2, BarChart3, Wifi, WifiOff, Users, TrendingUp, CheckCircle, XCircle, AlertCircle, Link } from 'lucide-react';

type UserLevel = 'student' | 'staff' | 'management' | 'all';
type PollType = 'course' | 'meeting' | 'event' | 'session';
type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface Poll {
  id: string;
  title: string;
  description: string;
  type: PollType;
  creatorLevel: UserLevel;
  targetLevel: UserLevel;
  relatedTo?: string;
  startTime: any;
  endTime: any;
  anonymous: boolean;
  multipleChoice: boolean;
  maxSelections: number;
  status: 'draft' | 'active' | 'closed' | 'scheduled';
  options: Record<string, { text: string; voteCount: number }>;

  // Targeting fields
  targetCohorts?: string[];
  targetDepartments?: string[];
  targetPrograms?: string[];

  // Analytics
  viewCount?: number;
  expectedRecipients?: number;

  // Creator info
  createdBy?: string;
  createdAt?: any;

  // Publishing
  isLocked?: boolean;
  publishedAt?: any;
}

interface PollSystemProps {
  userId: string;
  userLevel?: UserLevel;
  userCohort?: string;
  userDepartment?: string;
  userProgram?: string;
}

export default function PollSystem({
  userId,
  userLevel,
  userCohort,
  userDepartment,
  userProgram
}: PollSystemProps) {
    const [polls, setPolls] = useState<Poll[]>([]);
    const [creating, setCreating] = useState(false);
    const [filter, setFilter] = useState<'all' | 'draft' | 'active' | 'closed'>('active');
    const [editing, setEditing] = useState<Poll | null>(null);
    const [toasts, setToasts] = useState<Toast[]>([]);
    const [isConnected, setIsConnected] = useState(true);
    const [loading, setLoading] = useState(true);
    const [showAnalytics, setShowAnalytics] = useState<string | null>(null);

    // Toast notification helper
    const showToast = (message: string, type: ToastType = 'info') => {
      const id = Date.now().toString();
      setToasts(prev => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 4000);
    };

    const levelValue = (level: UserLevel | string | undefined) =>
    level === 'student' ? 1 :
    level === 'staff' ? 2 :
    level === 'management' ? 3 :
    level === 'all' ? 4 :
    level === 'admin' ? 999 : // Admin has highest level
    999; // Default to highest level for unknown roles (allows admin access)

    const availableLevels: UserLevel[] = ['student', 'staff', 'all'];
  // Create poll (as draft)
  const createPoll = async (data: Omit<Poll, 'id' | 'options'> & {
    optionTexts: string[]
  }) => {
    try {
      // No hierarchy checks - anyone can create polls for any level

      const options: Record<string, { text: string; voteCount: number }> = {};
      data.optionTexts.forEach((text, i) => {
        options[`opt${i}`] = { text, voteCount: 0 };
      });

      const { optionTexts, ...pollData } = data;

      await addDoc(collection(db, 'polls'), {
        ...pollData,
        options,
        status: 'draft',
        isLocked: false,
        viewCount: 0,
        createdAt: serverTimestamp(),
        createdBy: userId
      });

      showToast('Poll saved as draft!', 'success');
      setCreating(false);
    } catch (error) {
      console.error('Create poll error:', error);
      showToast('Failed to create poll. Please try again.', 'error');
    }
  };

  // Update poll (only creator can edit unlocked drafts)
  const updatePoll = async (pollId: string, updates: Partial<Poll>) => {
    try {
      const pollRef = doc(db, 'polls', pollId);
      await updateDoc(pollRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      showToast('Poll updated successfully!', 'success');
    } catch (error) {
      console.error('Update poll error:', error);
      showToast('Failed to update poll.', 'error');
    }
  };

  // Publish poll (lock and activate)
  const publishPoll = async (pollId: string) => {
    try {
      const pollRef = doc(db, 'polls', pollId);
      await updateDoc(pollRef, {
        status: 'active',
        isLocked: true,
        publishedAt: serverTimestamp()
      });
      showToast('Poll published successfully!', 'success');
    } catch (error) {
      console.error('Publish poll error:', error);
      showToast('Failed to publish poll.', 'error');
    }
  };

  // Delete poll
  const deletePoll = async (pollId: string) => {
    if (!confirm('Are you sure you want to delete this poll? This action cannot be undone.')) {
      return;
    }

    try {
      const pollRef = doc(db, 'polls', pollId);
      await deleteDoc(pollRef);
      showToast('Poll deleted successfully!', 'success');
    } catch (error) {
      console.error('Delete poll error:', error);
      showToast('Failed to delete poll.', 'error');
    }
  };

  // Track view
  const trackView = async (pollId: string) => {
    try {
      const viewRef = doc(db, `polls/${pollId}/views`, userId);
      const viewSnap = await getDoc(viewRef);

      if (!viewSnap.exists()) {
        await setDoc(viewRef, {
          userId,
          userLevel,
          userCohort,
          userDepartment,
          userProgram,
          viewedAt: serverTimestamp()
        });

        // Increment view count
        const pollRef = doc(db, 'polls', pollId);
        await updateDoc(pollRef, {
          viewCount: increment(1)
        });
      }
    } catch (error) {
      console.error('View tracking error:', error);
    }
  };

  // Vote
  const vote = async (pollId: string, optionIds: string[]) => {
    const pollRef = doc(db, 'polls', pollId);
    const voteRef = doc(db, `polls/${pollId}/votes`, userId);
    
    const voteSnap = await getDoc(voteRef);
    if (voteSnap.exists()) {
      alert('Already voted');
      return;
    }

    const updatePromises = optionIds.map(optId => 
      updateDoc(pollRef, {
        [`options.${optId}.voteCount`]: increment(1)
      })
    );

    await Promise.all([
      ...updatePromises,
      setDoc(voteRef, {
        userId,
        optionIds,
        timestamp: serverTimestamp(),
        voterLevel: userLevel
      })
    ]);
  };

  // Real-time polls
  useEffect(() => {
    let q = collection(db, 'polls');
    setLoading(true);

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() } as Poll))
          .filter(poll => {
            // No hierarchy checks - everyone can see all polls
            const statusMatch = filter === 'all' || poll.status === filter;
            return statusMatch;
          })
          .sort((a, b) => {
            const aTime = a.startTime?.toDate?.() || new Date(a.startTime);
            const bTime = b.startTime?.toDate?.() || new Date(b.startTime);
            return bTime.getTime() - aTime.getTime();
          });
        setPolls(data);
        setLoading(false);
        setIsConnected(true);
      },
      (error) => {
        console.error('Firestore error:', error);
        setIsConnected(false);
        setLoading(false);
        showToast('Connection error. Retrying...', 'error');
      }
    );
    return unsub;
  }, [userLevel, filter]);

  return (
    <div className="p-6 max-w mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold">HSB Polls & Voting</h2>
            {isConnected ? (
              <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                <Wifi size={12} />
                Live
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full">
                <WifiOff size={12} />
                Offline
              </span>
            )}
          </div>
          <p className="text-gray-600 mt-1">Create and participate in polls</p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} />
          Create Poll
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 border-b">
        {(['all', 'draft', 'active', 'closed'] as const).map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 capitalize ${
              filter === status
                ? 'border-b-2 border-blue-600 text-blue-600 font-semibold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {status}
            {status === 'draft' && polls.filter(p => p.status === 'draft' && p.createdBy === userId).length > 0 && (
              <span className="ml-2 bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded-full">
                {polls.filter(p => p.status === 'draft' && p.createdBy === userId).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Poll list */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-gray-500">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Loading polls...</p>
          </div>
        ) : polls.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <BarChart3 size={48} className="mx-auto mb-4 opacity-50" />
            <p>No polls found</p>
          </div>
        ) : (
          polls.map(poll => (
            <PollCard
              key={poll.id}
              poll={poll}
              onVote={vote}
              onPublish={publishPoll}
              onEdit={() => setEditing(poll)}
              onDelete={deletePoll}
              onTrackView={trackView}
              onViewAnalytics={() => setShowAnalytics(poll.id)}
              userId={userId}
              showToast={showToast}
              filter={filter}
            />
          ))
        )}
      </div>

      {/* Create modal */}
      {creating && (
        <CreatePollModal
          userLevel={userLevel}
          onCreate={createPoll}
          onClose={() => setCreating(false)}
        />
      )}

      {/* Edit modal */}
      {editing && (
        <CreatePollModal
          userLevel={userLevel}
          onCreate={async (data) => {
            const { optionTexts, ...updates } = data;
            const options: Record<string, { text: string; voteCount: number }> = {};
            optionTexts.forEach((text, i) => {
              options[`opt${i}`] = { text, voteCount: 0 };
            });
            await updatePoll(editing.id, { ...updates, options });
            setEditing(null);
          }}
          onClose={() => setEditing(null)}
          editingPoll={editing}
        />
      )}

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} />
    </div>
  );
}

// PollCard with live results
function PollCard({
  poll,
  onVote,
  onPublish,
  onEdit,
  onDelete,
  onTrackView,
  onViewAnalytics,
  userId,
  showToast,
  filter
}: {
  poll: Poll;
  onVote: (id: string, opts: string[]) => void;
  onPublish: (id: string) => void;
  onEdit: () => void;
  onDelete: (id: string) => void;
  onTrackView: (id: string) => void;
  onViewAnalytics: () => void;
  userId: string;
  showToast: (message: string, type: ToastType) => void;
  filter: 'all' | 'draft' | 'active' | 'closed';
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalVotes, setTotalVotes] = useState(0);

  const isCreator = poll.createdBy === userId;
  const isDraft = poll.status === 'draft';
  const canEdit = isCreator && !poll.isLocked && isDraft;

  // Check if poll has ended
  const endTime = poll.endTime?.toDate?.() || new Date(poll.endTime);
  const hasEnded = poll.endTime && endTime < new Date();
  const isActive = poll.status === 'active' && !hasEnded;

  // Track view when component mounts (only for active polls)
  useEffect(() => {
    if (poll.status === 'active') {
      onTrackView(poll.id);
    }
  }, [poll.id, poll.status]);

  useEffect(() => {
    getDoc(doc(db, `polls/${poll.id}/votes`, userId))
      .then(snap => setHasVoted(snap.exists()));
  }, [poll.id, userId]);

  useEffect(() => {
    const total = Object.values(poll.options)
      .reduce((sum, opt) => sum + opt.voteCount, 0);
    setTotalVotes(total);
  }, [poll.options]);

  const handleVote = async () => {
    if (selected.length === 0) {
      showToast('Please select at least one option', 'error');
      return;
    }
    if (selected.length > poll.maxSelections) {
      showToast(`You can only select up to ${poll.maxSelections} option(s)`, 'error');
      return;
    }

    setLoading(true);
    try {
      await onVote(poll.id, selected);
      setHasVoted(true);
      showToast('Vote submitted successfully!', 'success');
    } catch (error) {
      console.error('Vote error:', error);
      showToast('Failed to submit vote. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-semibold">{poll.title}</h3>
            <span className={`text-xs px-2 py-1 rounded ${
              isDraft ? 'bg-orange-100 text-orange-700' :
              hasEnded ? 'bg-red-100 text-red-700' :
              isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
            }`}>
              {hasEnded ? 'locked' : poll.status}
            </span>
            {(poll.isLocked || hasEnded) && <span className="text-xs bg-gray-200 px-2 py-1 rounded">🔒 Locked</span>}
          </div>
          <p className="text-gray-600 text-sm">{poll.description}</p>
          {poll.relatedTo && (
            <p className="text-xs text-gray-500 mt-1">Related: {poll.relatedTo}</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex flex-col items-end gap-1">
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
              {poll.type}
            </span>
            <span className="text-xs text-gray-500">
              Target: {poll.targetLevel}
            </span>
          </div>
          {isCreator && (
            <div className="flex gap-2">
              {canEdit && filter === 'draft' && (
                <button
                  onClick={onEdit}
                  className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded flex items-center gap-1"
                >
                  Edit
                </button>
              )}
              {isDraft && !poll.isLocked && (
                <button
                  onClick={() => onPublish(poll.id)}
                  className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                >
                  Publish
                </button>
              )}
              {(filter === 'all' || (filter === 'draft' && isDraft)) && (
                <button
                  onClick={() => onDelete(poll.id)}
                  className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded flex items-center gap-1"
                >
                  <Trash2 size={12} />
                  Delete
                </button>
              )}
              {poll.status === 'active' && (
                <>
                  <button
                    onClick={() => {
                      const voteUrl = `${window.location.origin}/?vote`;
                      navigator.clipboard.writeText(voteUrl);
                      showToast('Vote link copied to clipboard!', 'success');
                    }}
                    className="text-xs bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded flex items-center gap-1"
                  >
                    <Link size={12} />
                    Copy Link
                  </button>
                  <button
                    onClick={onViewAnalytics}
                    className="text-xs bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded flex items-center gap-1"
                  >
                    <TrendingUp size={12} />
                    Analytics
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3 mb-4">
        {Object.entries(poll.options).map(([id, opt]) => {
          const percentage = totalVotes ? ((opt.voteCount / totalVotes) * 100).toFixed(1) : '0';
          return (
            <div key={id} className="flex items-center gap-3">
              {!hasVoted && isActive && !hasEnded && (
                <input
                  type={poll.multipleChoice ? 'checkbox' : 'radio'}
                  name={`poll-${poll.id}`}
                  checked={selected.includes(id)}
                  onChange={(e) => {
                    if (poll.multipleChoice) {
                      setSelected(prev => 
                        e.target.checked 
                          ? [...prev, id]
                          : prev.filter(x => x !== id)
                      );
                    } else {
                      setSelected([id]);
                    }
                  }}
                  className="w-4 h-4"
                />
              )}
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="font-medium">{opt.text}</span>
                  <span className="text-sm text-gray-600">
                    {opt.voteCount} votes ({percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Voting UI - only show for active/non-draft polls */}
      {!isDraft && !hasVoted && isActive && !hasEnded && (
        <button
          onClick={handleVote}
          disabled={selected.length === 0 || loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Submitting...' : 'Submit Vote'}
        </button>
      )}

      {!isDraft && hasVoted && (
        <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg text-sm text-center">
          ✓ You have voted
        </div>
      )}

      {isDraft && isCreator && (
        <div className="bg-orange-50 text-orange-700 px-4 py-2 rounded-lg text-sm text-center">
          📝 This poll is in draft mode. Edit and publish to make it available.
        </div>
      )}

      {hasEnded && !hasVoted && (
        <div className="bg-red-50 text-red-700 px-4 py-2 rounded-lg text-sm text-center">
          🔒 This poll has ended and is now locked.
        </div>
      )}

      <div className="flex justify-between items-center mt-4 pt-4 border-t text-xs text-gray-500">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Users size={14} />
            <span>{totalVotes} vote{totalVotes !== 1 ? 's' : ''}</span>
          </div>
          {poll.viewCount > 0 && (
            <div className="flex items-center gap-2">
              <TrendingUp size={14} />
              <span>{poll.viewCount} view{poll.viewCount !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
        <span>
          {poll.anonymous && '🔒 Anonymous • '}
          Ends: {endTime.toLocaleDateString()} {endTime.toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
}

// CreatePollModal
function CreatePollModal({
  userLevel,
  onCreate,
  onClose,
  editingPoll
}: {
  userLevel: UserLevel;
  onCreate: (data: any) => Promise<void>;
  onClose: () => void;
  editingPoll?: Poll | null;
}) {
  const isEditing = !!editingPoll;

  const [formData, setFormData] = useState({
    title: editingPoll?.title || '',
    description: editingPoll?.description || '',
    type: (editingPoll?.type || 'course') as PollType,
    targetLevel: editingPoll?.targetLevel || userLevel,
    relatedTo: editingPoll?.relatedTo || '',
    startTime: editingPoll?.startTime
      ? new Date(editingPoll.startTime.toDate?.() || editingPoll.startTime).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16),
    endTime: editingPoll?.endTime
      ? new Date(editingPoll.endTime.toDate?.() || editingPoll.endTime).toISOString().slice(0, 16)
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    anonymous: editingPoll?.anonymous || false,
    multipleChoice: editingPoll?.multipleChoice || false,
    maxSelections: editingPoll?.maxSelections || 1,
    status: editingPoll?.status || 'draft',
    creatorLevel: editingPoll?.creatorLevel || userLevel
  });

  const [options, setOptions] = useState(
    editingPoll
      ? Object.values(editingPoll.options).map(opt => opt.text)
      : ['', '']
  );

  // Only allow student, staff, and all (staff+student)
  const availableLevels: UserLevel[] = ['student', 'staff', 'all'];

  const addOption = () => setOptions([...options, '']);
  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validOptions = options.filter(opt => opt.trim());
    if (validOptions.length < 2) {
      alert('At least 2 options required');
      return;
    }

    await onCreate({
      ...formData,
      startTime: new Date(formData.startTime),
      endTime: new Date(formData.endTime),
      optionTexts: validOptions
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h3 className="text-2xl font-bold">{isEditing ? 'Edit Poll' : 'Create New Poll'}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="e.g., Best Time for Extra Tutorial"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
              rows={3}
              placeholder="Optional description"
            />
          </div>

          {/* Type & Target Level */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as PollType })}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="course">Course</option>
                <option value="position">Meeting</option>
                <option value="event">Event</option>
                <option value="session">Session</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Target Level *</label>
              <select
  value={formData.targetLevel}
  onChange={(e) => setFormData({ ...formData, targetLevel: e.target.value as UserLevel })}
  className="w-full border rounded-lg px-3 py-2"
>
  {availableLevels.map(level => (
    <option key={level} value={level}>
      {level === 'student' ? 'Student' : level === 'staff' ? 'Staff' : 'Staff + Student'}
    </option>
  ))}
</select>
            </div>
          </div>

          {/* Related To */}
          <div>
            <label className="block text-sm font-medium mb-1">Related To (Optional)</label>
            <input
              type="text"
              value={formData.relatedTo}
              onChange={(e) => setFormData({ ...formData, relatedTo: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="e.g., HSB101-2025-1"
            />
          </div>

          {/* Start & End Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Start Time *</label>
              <input
                type="datetime-local"
                required
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Time *</label>
              <input
                type="datetime-local"
                required
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>

          {/* Options */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium">Options * (min 2)</label>
              <button
                type="button"
                onClick={addOption}
                className="text-blue-600 text-sm flex items-center gap-1 hover:text-blue-700"
              >
                <Plus size={16} /> Add Option
              </button>
            </div>
            <div className="space-y-2">
              {options.map((opt, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => {
                      const newOpts = [...options];
                      newOpts[i] = e.target.value;
                      setOptions(newOpts);
                    }}
                    className="flex-1 border rounded-lg px-3 py-2"
                    placeholder={`Option ${i + 1}`}
                  />
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(i)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.anonymous}
                onChange={(e) => setFormData({ ...formData, anonymous: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm">Anonymous voting</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.multipleChoice}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  multipleChoice: e.target.checked,
                  maxSelections: e.target.checked ? 2 : 1
                })}
                className="w-4 h-4"
              />
              <span className="text-sm">Allow multiple choices</span>
            </label>

            {formData.multipleChoice && (
              <div className="ml-6">
                <label className="block text-sm mb-1">Max selections</label>
                <input
                  type="number"
                  min="1"
                  max={options.length}
                  value={formData.maxSelections}
                  onChange={(e) => setFormData({ ...formData, maxSelections: parseInt(e.target.value) })}
                  className="border rounded-lg px-3 py-2 w-24"
                />
              </div>
            )}
          </div>

          {/* Submit */}
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
              {isEditing ? 'Update Poll' : 'Create Poll'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Toast notification container
function ToastContainer({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg
            transform transition-all duration-300 ease-in-out
            animate-slide-in-right
            ${toast.type === 'success' ? 'bg-green-600 text-white' : ''}
            ${toast.type === 'error' ? 'bg-red-600 text-white' : ''}
            ${toast.type === 'info' ? 'bg-blue-600 text-white' : ''}
          `}
        >
          {toast.type === 'success' && <CheckCircle size={20} />}
          {toast.type === 'error' && <XCircle size={20} />}
          {toast.type === 'info' && <AlertCircle size={20} />}
          <span className="font-medium">{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
