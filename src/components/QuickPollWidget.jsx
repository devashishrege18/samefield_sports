import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { doc, onSnapshot, updateDoc, increment, setDoc, getDoc } from 'firebase/firestore';
import { usePoints } from '../context/PointsContext';
import { BarChart2 } from 'lucide-react';

const POLL_ID = 'current_poll';

const QuickPollWidget = () => {
    const { addPoints, userId } = usePoints();
    const [poll, setPoll] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hasVoted, setHasVoted] = useState(false);
    const [userVote, setUserVote] = useState(null);

    useEffect(() => {
        // Check if user already voted
        const votedPolls = JSON.parse(localStorage.getItem('samefield_voted_polls') || '{}');
        if (votedPolls[POLL_ID]) {
            setHasVoted(true);
            setUserVote(votedPolls[POLL_ID]);
        }

        // Create or get poll document
        const pollRef = doc(db, 'polls', POLL_ID);

        getDoc(pollRef).then(snap => {
            if (!snap.exists()) {
                // Create initial poll
                setDoc(pollRef, {
                    question: 'Should mixed doubles be in Test Cricket?',
                    yesVotes: 72,
                    noVotes: 28,
                    createdAt: new Date()
                });
            }
        });

        // Real-time listener
        const unsubscribe = onSnapshot(pollRef, (doc) => {
            if (doc.exists()) {
                setPoll(doc.data());
            }
            setLoading(false);
        }, (error) => {
            console.error('QuickPollWidget error:', error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleVote = async (voteType) => {
        if (hasVoted) return;

        try {
            const pollRef = doc(db, 'polls', POLL_ID);
            await updateDoc(pollRef, {
                [voteType === 'yes' ? 'yesVotes' : 'noVotes']: increment(1)
            });

            // Save vote to localStorage
            const votedPolls = JSON.parse(localStorage.getItem('samefield_voted_polls') || '{}');
            votedPolls[POLL_ID] = voteType;
            localStorage.setItem('samefield_voted_polls', JSON.stringify(votedPolls));

            setHasVoted(true);
            setUserVote(voteType);

            // Award XP for voting
            addPoints(50, 'Quick Poll Participation');
        } catch (error) {
            console.error('Vote error:', error);
        }
    };

    const getPercentage = (type) => {
        if (!poll) return 0;
        const total = (poll.yesVotes || 0) + (poll.noVotes || 0);
        if (total === 0) return 0;
        return Math.round(((type === 'yes' ? poll.yesVotes : poll.noVotes) / total) * 100);
    };

    if (loading) {
        return (
            <div className="premium-card p-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Quick Poll</h4>
                <div className="h-4 bg-white/5 rounded w-3/4 mb-2 animate-pulse" />
                <div className="flex gap-2">
                    <div className="flex-1 h-8 bg-white/5 rounded animate-pulse" />
                    <div className="flex-1 h-8 bg-white/5 rounded animate-pulse" />
                </div>
            </div>
        );
    }

    return (
        <div className="premium-card p-4 glow-on-hover">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1">
                <BarChart2 className="w-3 h-3 text-primary" /> Quick Poll
                <span className="ml-auto text-[8px] text-green-400 font-bold animate-pulse">● LIVE</span>
            </h4>
            <p className="text-[10px] text-textMuted mb-2">{poll?.question || 'Loading...'}</p>
            <div className="flex gap-2">
                <button
                    onClick={() => handleVote('yes')}
                    disabled={hasVoted}
                    className={`flex-1 py-2 text-[10px] font-bold rounded transition-all relative overflow-hidden ${hasVoted
                        ? userVote === 'yes'
                            ? 'bg-green-500/30 text-green-300 border border-green-500/50'
                            : 'bg-green-500/10 text-green-400/50'
                        : 'bg-green-500/10 text-green-400 hover:bg-green-500/20 cursor-pointer'
                        }`}
                >
                    {hasVoted && (
                        <div
                            className="absolute inset-y-0 left-0 bg-green-500/20 transition-all duration-500"
                            style={{ width: `${getPercentage('yes')}%` }}
                        />
                    )}
                    <span className="relative z-10">YES {getPercentage('yes')}%</span>
                </button>
                <button
                    onClick={() => handleVote('no')}
                    disabled={hasVoted}
                    className={`flex-1 py-2 text-[10px] font-bold rounded transition-all relative overflow-hidden ${hasVoted
                        ? userVote === 'no'
                            ? 'bg-red-500/30 text-red-300 border border-red-500/50'
                            : 'bg-red-500/10 text-red-400/50'
                        : 'bg-red-500/10 text-red-400 hover:bg-red-500/20 cursor-pointer'
                        }`}
                >
                    {hasVoted && (
                        <div
                            className="absolute inset-y-0 left-0 bg-red-500/20 transition-all duration-500"
                            style={{ width: `${getPercentage('no')}%` }}
                        />
                    )}
                    <span className="relative z-10">NO {getPercentage('no')}%</span>
                </button>
            </div>
            {hasVoted && (
                <p className="text-[8px] text-textMuted mt-2 text-center">
                    You voted {userVote?.toUpperCase()} • {(poll?.yesVotes || 0) + (poll?.noVotes || 0)} total votes
                </p>
            )}
        </div>
    );
};

export default QuickPollWidget;
