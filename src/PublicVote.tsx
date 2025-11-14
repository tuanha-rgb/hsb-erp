// PublicVote.tsx
// Public voting interface for students and staff to vote without authentication
import { useState, useEffect } from 'react';
import { db } from './firebase/firebase.config';
import {
  collection, doc, getDoc, setDoc, getDocs, updateDoc,
  onSnapshot, increment, serverTimestamp, query, where
} from 'firebase/firestore';
import { CheckCircle, AlertCircle, Users, Lock, Vote } from 'lucide-react';

type UserLevel = 'student' | 'staff' | 'management' | 'all';

interface Poll {
  id: string;
  title: string;
  description: string;
  targetLevel: UserLevel;
  anonymous: boolean;
  multipleChoice: boolean;
  maxSelections: number;
  status: 'draft' | 'active' | 'closed' | 'scheduled';
  options: Record<string, { text: string; voteCount: number }>;
  endTime: any;
}

interface UserInfo {
  id: string;
  name: string;
  type: 'student' | 'staff';
  department?: string;
  class?: string;
}

export default function PublicVote() {
  const [userId, setUserId] = useState('');
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState('');
  const [polls, setPolls] = useState<Poll[]>([]);
  const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [voting, setVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState<Record<string, boolean>>({});

  // Load active polls
  useEffect(() => {
    if (!userInfo) return;

    const pollsRef = collection(db, 'polls');
    const q = query(pollsRef, where('status', '==', 'active'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const activePolls: Poll[] = [];
      snapshot.docs.forEach((doc) => {
        const data = doc.data() as Poll;
        const poll = { ...data, id: doc.id };

        // Filter polls based on user type and target level
        if (
          poll.targetLevel === 'all' ||
          poll.targetLevel === userInfo.type ||
          (poll.targetLevel === 'student' && userInfo.type === 'student') ||
          (poll.targetLevel === 'staff' && userInfo.type === 'staff')
        ) {
          activePolls.push(poll);
        }
      });

      setPolls(activePolls);
    });

    return unsubscribe;
  }, [userInfo]);

  // Check if user has voted on polls
  useEffect(() => {
    if (!userInfo) return;

    const checkVotes = async () => {
      const voted: Record<string, boolean> = {};
      for (const poll of polls) {
        const voteRef = doc(db, `polls/${poll.id}/votes`, userInfo.id);
        const voteSnap = await getDoc(voteRef);
        voted[poll.id] = voteSnap.exists();
      }
      setHasVoted(voted);
    };

    if (polls.length > 0) {
      checkVotes();
    }
  }, [polls, userInfo]);

  // Validate user ID
  const validateUserId = async () => {
    if (!userId.trim()) {
      setError('Please enter your ID');
      return;
    }

    setValidating(true);
    setError('');

    try {
      // Try student first
      const studentRef = doc(db, 'students', userId.trim());
      const studentSnap = await getDoc(studentRef);

      if (studentSnap.exists()) {
        const data = studentSnap.data();
        setUserInfo({
          id: userId.trim(),
          name: data.studentName || 'Unknown',
          type: 'student',
          class: data.class || ''
        });
        return;
      }

      // Try staff
      const staffRef = doc(db, 'staff', userId.trim());
      const staffSnap = await getDoc(staffRef);

      if (staffSnap.exists()) {
        const data = staffSnap.data();
        setUserInfo({
          id: userId.trim(),
          name: data.staffName || 'Unknown',
          type: 'staff',
          department: data.department || ''
        });
        return;
      }

      // Not found
      setError('ID not found. Please check your Student ID or Staff ID.');
    } catch (err) {
      console.error('Validation error:', err);
      setError('Failed to validate ID. Please try again.');
    } finally {
      setValidating(false);
    }
  };

  // Handle vote submission
  const submitVote = async () => {
    if (!selectedPoll || !userInfo) return;

    if (selectedOptions.length === 0) {
      setError('Please select at least one option');
      return;
    }

    if (selectedPoll.multipleChoice && selectedOptions.length > selectedPoll.maxSelections) {
      setError(`You can only select up to ${selectedPoll.maxSelections} options`);
      return;
    }

    setVoting(true);
    setError('');

    try {
      const pollRef = doc(db, 'polls', selectedPoll.id);
      const voteRef = doc(db, `polls/${selectedPoll.id}/votes`, userInfo.id);

      // Check if already voted
      const voteSnap = await getDoc(voteRef);
      if (voteSnap.exists()) {
        setError('You have already voted on this poll');
        setVoting(false);
        return;
      }

      // Update vote counts
      const updatePromises = selectedOptions.map((optionId) =>
        updateDoc(pollRef, {
          [`options.${optionId}.voteCount`]: increment(1)
        })
      );

      // Record the vote
      await Promise.all([
        ...updatePromises,
        setDoc(voteRef, {
          userId: userInfo.id,
          optionIds: selectedOptions,
          timestamp: serverTimestamp(),
          voterLevel: userInfo.type,
          voterName: selectedPoll.anonymous ? null : userInfo.name
        })
      ]);

      // Update local state
      setHasVoted((prev) => ({ ...prev, [selectedPoll.id]: true }));
      setSelectedPoll(null);
      setSelectedOptions([]);
      alert('✓ Vote submitted successfully!');
    } catch (err) {
      console.error('Vote error:', err);
      setError('Failed to submit vote. Please try again.');
    } finally {
      setVoting(false);
    }
  };

  // Toggle option selection
  const toggleOption = (optionId: string) => {
    if (!selectedPoll) return;

    if (selectedPoll.multipleChoice) {
      if (selectedOptions.includes(optionId)) {
        setSelectedOptions(selectedOptions.filter((id) => id !== optionId));
      } else if (selectedOptions.length < selectedPoll.maxSelections) {
        setSelectedOptions([...selectedOptions, optionId]);
      }
    } else {
      setSelectedOptions([optionId]);
    }
  };

  // Logout
  const logout = () => {
    setUserInfo(null);
    setUserId('');
    setPolls([]);
    setSelectedPoll(null);
    setSelectedOptions([]);
    setHasVoted({});
  };

  // Login screen
  if (!userInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Vote className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Public Voting</h1>
            <p className="text-gray-600">Enter your ID to participate in polls</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Student ID or Staff ID
              </label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && validateUserId()}
                placeholder="e.g., 19080001 or STAFF001"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                disabled={validating}
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <button
              onClick={validateUserId}
              disabled={validating || !userId.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-lg"
            >
              {validating ? 'Validating...' : 'Continue'}
            </button>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                Your ID will be validated against the student and staff database.
                {' '}No password required.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Poll list screen
  if (!selectedPoll) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          {/* User header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{userInfo.name}</h2>
                  <p className="text-sm text-gray-600">
                    {userInfo.type === 'student' ? `Student • ${userInfo.class}` : `Staff • ${userInfo.department}`}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">ID: {userInfo.id}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Switch User
              </button>
            </div>
          </div>

          {/* Polls */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Active Polls ({polls.length})
            </h3>

            {polls.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <Vote className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Active Polls</h3>
                <p className="text-gray-500">There are no polls available for you at the moment.</p>
              </div>
            ) : (
              polls.map((poll) => {
                const hasUserVoted = hasVoted[poll.id];
                const hasEnded = poll.endTime && poll.endTime.toDate() < new Date();
                const totalVotes = Object.values(poll.options).reduce(
                  (sum, opt) => sum + opt.voteCount,
                  0
                );

                return (
                  <div
                    key={poll.id}
                    className={`bg-white rounded-lg shadow-md p-6 border-2 transition-all ${
                      hasUserVoted
                        ? 'border-green-300 bg-green-50'
                        : hasEnded
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-200 hover:border-blue-300 cursor-pointer'
                    }`}
                    onClick={() => !hasUserVoted && !hasEnded && setSelectedPoll(poll)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-gray-900 mb-2">{poll.title}</h4>
                        <p className="text-gray-600 mb-3">{poll.description}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                            {poll.anonymous ? 'Anonymous' : 'Public'}
                          </span>
                          <span className="text-gray-600">
                            {totalVotes} vote{totalVotes !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                      {hasUserVoted && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg">
                          <CheckCircle className="w-5 h-5" />
                          <span className="font-medium">Voted</span>
                        </div>
                      )}
                      {!hasUserVoted && hasEnded && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg">
                          <Lock className="w-5 h-5" />
                          <span className="font-medium">Locked</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    );
  }

  // Voting screen
  const totalVotes = Object.values(selectedPoll.options).reduce(
    (sum, opt) => sum + opt.voteCount,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <button
            onClick={() => {
              setSelectedPoll(null);
              setSelectedOptions([]);
              setError('');
            }}
            className="text-blue-600 hover:text-blue-700 mb-4 flex items-center gap-2"
          >
            ← Back to polls
          </button>

          <h2 className="text-2xl font-bold text-gray-900 mb-3">{selectedPoll.title}</h2>
          <p className="text-gray-600 mb-6">{selectedPoll.description}</p>

          <div className="flex items-center gap-4 mb-6 text-sm">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
              {selectedPoll.anonymous ? 'Anonymous' : 'Public'}
            </span>
            <span className="text-gray-600">
              {totalVotes} vote{totalVotes !== 1 ? 's' : ''}
            </span>
            {selectedPoll.multipleChoice && (
              <span className="text-gray-600">
                Select up to {selectedPoll.maxSelections} option{selectedPoll.maxSelections !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {Object.entries(selectedPoll.options).map(([optionId, option]) => (
              <label
                key={optionId}
                className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedOptions.includes(optionId)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type={selectedPoll.multipleChoice ? 'checkbox' : 'radio'}
                    checked={selectedOptions.includes(optionId)}
                    onChange={() => toggleOption(optionId)}
                    className="w-5 h-5 text-blue-600"
                  />
                  <span className="text-lg font-medium text-gray-900">{option.text}</span>
                </div>
              </label>
            ))}
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-4">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <button
            onClick={submitVote}
            disabled={voting || selectedOptions.length === 0}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-lg"
          >
            {voting ? 'Submitting...' : 'Submit Vote'}
          </button>
        </div>
      </div>
    </div>
  );
}
