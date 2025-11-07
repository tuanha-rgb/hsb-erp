// PollSystem.tsx
import { useState, useEffect } from 'react';
import { db } from './firebase/firebase.config';
import { 
  collection, addDoc, doc, getDoc, updateDoc, setDoc,
  onSnapshot, increment, serverTimestamp, query, where, orderBy
} from 'firebase/firestore';
import { X, Plus, Trash2, BarChart3 } from 'lucide-react';

type UserLevel = 'student' | 'staff' | 'management' | 'all';
type PollType = 'course' | 'meeting' | 'event' | 'session';

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
  status: 'active' | 'closed' | 'scheduled';
  options: Record<string, { text: string; voteCount: number }>;
}

interface PollSystemProps {
  userId: string;
  userLevel: UserLevel;
}

export default function PollSystem({ userId, userLevel }: PollSystemProps) {
    const [polls, setPolls] = useState<Poll[]>([]);
    const [creating, setCreating] = useState(false);
    const [filter, setFilter] = useState<'all' | 'active' | 'closed'>('active');

    const levelValue = (level: UserLevel) => 
    level === 'student' ? 1 : 
    level === 'staff' ? 2 : 
    level === 'management' ? 3 :
    level === 'all' ? 4 : 0;
   
    const availableLevels: UserLevel[] = (() => {
  const levels: UserLevel[] = ['student', 'staff', 'management', 'all']
    .filter(level => {
      if (level === 'all') return true; // Everyone can create "all" polls
      return levelValue(level as UserLevel) <= levelValue(userLevel);
    }) as UserLevel[];
  return levels;
})();
  // Create poll
  const createPoll = async (data: Omit<Poll, 'id' | 'options'> & { 
    optionTexts: string[] 
  }) => {
    if (levelValue(userLevel) < levelValue(data.targetLevel)) {
      alert('Cannot create poll for higher level');
      return;
    }

    const options: Record<string, { text: string; voteCount: number }> = {};
    data.optionTexts.forEach((text, i) => {
      options[`opt${i}`] = { text, voteCount: 0 };
    });

    const { optionTexts, ...pollData } = data;
    
    await addDoc(collection(db, 'polls'), {
      ...pollData,
      options,
      createdAt: serverTimestamp(),
      createdBy: userId
    });

    setCreating(false);
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
    
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as Poll))
        .filter(poll => {
          // If poll target is "all", everyone can see it
        if (poll.targetLevel === 'all') return true;
        
        // Otherwise use level hierarchy
        const levelMatch = levelValue(userLevel) >= levelValue(poll.targetLevel);
        const statusMatch = filter === 'all' || poll.status === filter;
        return levelMatch && statusMatch;
        })
        .sort((a, b) => {
          const aTime = a.startTime?.toDate?.() || new Date(a.startTime);
          const bTime = b.startTime?.toDate?.() || new Date(b.startTime);
          return bTime.getTime() - aTime.getTime();
        });
      setPolls(data);
    });
    return unsub;
  }, [userLevel, filter]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold">Polls & Voting</h2>
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
        {(['all', 'active', 'closed'] as const).map(status => (
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
          </button>
        ))}
      </div>

      {/* Poll list */}
      <div className="space-y-4">
        {polls.length === 0 ? (
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
              userId={userId}
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
    </div>
  );
}

// PollCard with live results
function PollCard({ 
  poll, 
  onVote, 
  userId 
}: { 
  poll: Poll; 
  onVote: (id: string, opts: string[]) => void;
  userId: string;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getDoc(doc(db, `polls/${poll.id}/votes`, userId))
      .then(snap => setHasVoted(snap.exists()));
  }, [poll.id, userId]);

  const total = Object.values(poll.options)
    .reduce((sum, opt) => sum + opt.voteCount, 0);

  const handleVote = async () => {
    if (selected.length === 0 || selected.length > poll.maxSelections) return;
    setLoading(true);
    try {
      await onVote(poll.id, selected);
      setHasVoted(true);
    } catch (error) {
      console.error('Vote error:', error);
      alert('Failed to submit vote');
    } finally {
      setLoading(false);
    }
  };

  const isActive = poll.status === 'active';
  const endTime = poll.endTime?.toDate?.() || new Date(poll.endTime);
  const hasEnded = endTime < new Date();

  return (
    <div className="border rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-semibold">{poll.title}</h3>
            <span className={`text-xs px-2 py-1 rounded ${
              isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
            }`}>
              {poll.status}
            </span>
          </div>
          <p className="text-gray-600 text-sm">{poll.description}</p>
          {poll.relatedTo && (
            <p className="text-xs text-gray-500 mt-1">Related: {poll.relatedTo}</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
            {poll.type}
          </span>
          <span className="text-xs text-gray-500">
            Target: {poll.targetLevel}
          </span>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        {Object.entries(poll.options).map(([id, opt]) => {
          const percentage = total ? ((opt.voteCount / total) * 100).toFixed(1) : '0';
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

      {!hasVoted && isActive && !hasEnded && (
        <button
          onClick={handleVote}
          disabled={selected.length === 0 || loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Submitting...' : 'Submit Vote'}
        </button>
      )}

      {hasVoted && (
        <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg text-sm text-center">
          ✓ You have voted
        </div>
      )}

      <div className="flex justify-between items-center mt-4 pt-4 border-t text-xs text-gray-500">
        <span>Total votes: {total}</span>
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
  onClose 
}: { 
  userLevel: UserLevel;
  onCreate: (data: any) => Promise<void>;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'course' as PollType,
    targetLevel: userLevel,
    relatedTo: '',
    startTime: new Date().toISOString().slice(0, 16),
    endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    anonymous: false,
    multipleChoice: false,
    maxSelections: 1,
    status: 'active' as const,
    creatorLevel: userLevel
  });

  const [options, setOptions] = useState(['', '']);

  const levelValue = (level: UserLevel) => 
    level === 'student' ? 1 : 
    level === 'staff' ? 2 : 
    level === 'management' ? 3 :
    level === 'all' ? 4 : 0;

  const availableLevels: UserLevel[] = ['student', 'staff', 'management', 'all']
    .filter(level => levelValue(level as UserLevel) <= levelValue(userLevel)) as UserLevel[];

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
          <h3 className="text-2xl font-bold">Create New Poll</h3>
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
      {level === 'all' ? 'All (Everyone)' : level}
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
              Create Poll
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

