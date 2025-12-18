import React, { useState, useEffect } from 'react';
import { MessageSquare, ArrowUp, Zap, Radio, AlertTriangle } from 'lucide-react';
import { forumService } from '../services/ForumService';
import { usePoints } from '../context/PointsContext';
import '../styles/components/Forum.css';

const Forum = () => {
    const { addPoints } = usePoints();
    const [threads, setThreads] = useState([]);
    const [filter, setFilter] = useState('All');
    const [loading, setLoading] = useState(true);
    const [selectedThread, setSelectedThread] = useState(null);

    const filters = ['All', 'Live Match Reactions', 'Player Performance Talk', 'Tactical Analysis', 'Fan Predictions'];

    useEffect(() => {
        loadThreads();

        const unsubscribe = forumService.onSync(() => {
            setThreads(forumService.getThreads(filter));
            if (selectedThread) {
                const refreshed = forumService.getThreads('All').find(t => t.id === selectedThread.id);
                if (refreshed) setSelectedThread(refreshed);
            }
        });

        const interval = setInterval(() => {
            setThreads(forumService.getThreads(filter));
        }, 5000);

        forumService.simulateLiveActivity(() => {
            setThreads(forumService.getThreads(filter));
        });

        return () => {
            unsubscribe();
            clearInterval(interval);
        };
    }, [filter, selectedThread]);

    const loadThreads = () => {
        setLoading(true);
        // Simulate network delay
        setTimeout(() => {
            setThreads(forumService.getThreads(filter));
            setLoading(false);
        }, 300);
    };

    const handleCreateMockThread = () => {
        const savedName = localStorage.getItem('samefield_username') || 'You (Demo)';
        // Simulate user creating a thread
        const newT = forumService.createThread({
            title: "Community Insight: The Rise of Mixed Teams",
            author: savedName,
            category: filter === 'All' ? 'Tactical Analysis' : filter,
            aiTags: ["User Generated", "Real-time"],
            content: "Sharing my thoughts on progress in the community leagues... I believe the integration of diverse skillsets is the key to our future success. What do you all think?",
            votes: 1
        });
        setThreads(forumService.getThreads(filter));
        addPoints(50, 'Created New Topic');
        setSelectedThread(newT);
    };

    const handleUpvote = (e, threadId) => {
        e.stopPropagation();
        forumService.upvoteThread(threadId);
        setThreads(forumService.getThreads(filter));
        addPoints(5, 'Forum Upvote');
    };

    const handleJoinDebate = (e, thread) => {
        if (e) e.stopPropagation();
        setSelectedThread(thread);
        addPoints(20, 'Joined Debate');
    };

    const [commentText, setCommentText] = useState('');

    const handleReply = () => {
        if (!commentText.trim() || !selectedThread) return;

        const savedName = localStorage.getItem('samefield_username') || 'Guest';
        const newComment = {
            id: 'c' + Date.now(),
            author_name: savedName,
            text: commentText.trim(),
            timestamp: new Date().toISOString()
        };

        // Update local thread instance
        const updatedThread = { ...selectedThread };
        updatedThread.comments = (updatedThread.comments || 0) + 1;
        // In a real P2P app, we'd send this via ForumService. 
        // For now, we update the local list and selected view.
        setSelectedThread(updatedThread);
        setThreads(prev => prev.map(t => t.id === updatedThread.id ? updatedThread : t));

        setCommentText('');
        addPoints(10, 'Replied to Discussion');
    };

    const ThreadDetail = ({ thread, onClose }) => {
        if (!thread) return null;
        return (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in zoom-in duration-300">
                <div className="relative w-full max-w-2xl bg-surface border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                    <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/50">
                        <span className="text-xs font-bold text-primary uppercase tracking-widest">{thread.category}</span>
                        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full text-white transition-colors">
                            <Zap className="w-5 h-5 rotate-90" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 font-sans">
                        <div className="flex gap-6 mb-8">
                            <div className="flex flex-col items-center gap-2">
                                <button className="p-3 bg-white/5 hover:bg-primary hover:text-black rounded-xl transition-all" onClick={(e) => handleUpvote(e, thread.id)}>
                                    <ArrowUp size={24} />
                                </button>
                                <span className="text-xl font-black text-white">{thread.votes}</span>
                            </div>
                            <div className="flex-1">
                                <h2 className="text-3xl font-black text-white mb-2 leading-tight uppercase italic tracking-tighter">{thread.title}</h2>
                                <div className="flex items-center gap-3 text-xs text-textMuted font-bold uppercase mb-6">
                                    <span className="text-primary">{thread.author}</span>
                                    <span>•</span>
                                    <span>{new Date(thread.timestamp).toLocaleDateString()}</span>
                                </div>
                                <div className="text-gray-200 text-lg leading-relaxed whitespace-pre-wrap border-l-4 border-primary/20 pl-6 mb-8 italic font-medium">
                                    {thread.content}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h4 className="text-sm font-black text-white uppercase tracking-widest border-b border-white/5 pb-2">Comments ({thread.comments})</h4>

                            {/* Mock Comments for UI Depth */}
                            <div className="space-y-4">
                                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                    <div className="flex justify-between mb-1">
                                        <span className="text-[10px] font-black text-primary uppercase">Expert_Fan</span>
                                        <span className="text-[8px] text-textMuted uppercase">5m ago</span>
                                    </div>
                                    <p className="text-sm text-gray-300">Totally agree with this take. The momentum shift was obvious!</p>
                                </div>
                            </div>

                            <div className="bg-white/5 rounded-xl p-6 border border-white/10 italic text-textMuted text-center text-xs">
                                Join the live debate! More peers are typing...
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-surfaceHighlight/50 border-t border-white/10">
                        <div className="flex gap-4">
                            <input
                                type="text"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleReply()}
                                placeholder="Add to the conversation..."
                                className="flex-1 bg-black/50 border border-white/10 rounded-full px-6 py-3 text-sm focus:outline-none focus:border-primary text-white"
                            />
                            <button className="bg-primary text-black font-black uppercase px-8 rounded-full text-xs hover:scale-105 transition-transform" onClick={handleReply}>
                                Reply
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="forum-container">
            {selectedThread && <ThreadDetail thread={selectedThread} onClose={() => setSelectedThread(null)} />}

            <div className="forum-header">
                <h2 className="section-title">Community Forum</h2>
                <button className="btn-create" onClick={handleCreateMockThread}>
                    + New Discussion
                </button>
            </div>

            <div className="forum-layout">
                {/* Main Feed */}
                <div className="forum-main">

                    {/* Filters */}
                    <div className="forum-filters">
                        {filters.map(f => (
                            <button
                                key={f}
                                className={`filter-pill ${filter === f ? 'active' : ''}`}
                                onClick={() => setFilter(f)}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div className="loading-state">Loading discussions...</div>
                    ) : (
                        <div className="thread-list">
                            {threads.map(thread => (
                                <div key={thread.id} className={`thread-card ${thread.isLive ? 'live-thread' : ''}`} onClick={() => setSelectedThread(thread)}>
                                    <div className="vote-column">
                                        <button className="btn-vote" onClick={(e) => handleUpvote(e, thread.id)}><ArrowUp size={18} /></button>
                                        <span className="vote-count">{thread.votes}</span>
                                    </div>

                                    <div className="thread-content">
                                        <div className="thread-meta">
                                            <span className="thread-category">{thread.category}</span>
                                            <span className="dot">•</span>
                                            <span className="thread-author">Posted by {thread.author}</span>
                                            <span className="dot">•</span>
                                            <span className="thread-time">2m ago</span>
                                        </div>

                                        <h3 className="thread-title">
                                            {thread.isLive && <span className="badge-live"><Radio size={12} /> LIVE</span>}
                                            {thread.title}
                                        </h3>

                                        <p className="thread-snippet">{thread.content.substring(0, 100)}...</p>

                                        {thread.aiSummary && (
                                            <div className="ai-summary-box">
                                                <Zap size={12} className="ai-icon" />
                                                <span className="ai-label">AI Summary:</span>
                                                <span className="ai-text">{thread.aiSummary}</span>
                                            </div>
                                        )}

                                        <div className="thread-tags">
                                            {thread.aiTags?.map(tag => (
                                                <span key={tag} className="ai-tag">#{tag}</span>
                                            ))}
                                            {thread.isToxic && <span className="warning-tag"><AlertTriangle size={12} /> Flagged</span>}
                                        </div>

                                        <div className="thread-actions">
                                            <div className="action-pill" onClick={(e) => handleJoinDebate(e, thread)}><MessageSquare size={14} /> {thread.comments} Comments</div>
                                            <div className="action-pill">Share</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="forum-sidebar">
                    <div className="sidebar-card live-now">
                        <h3><Radio size={16} className="icon-pulse" /> Live Events</h3>
                        <ul className="live-list">
                            <li>India vs Australia <span className="live-tag">LIVE</span></li>
                            <li>Mumbai vs Chennai <span className="live-tag">LIVE</span></li>
                        </ul>
                        <button className="btn-join-live" onClick={(e) => handleJoinDebate(e, threads[0])}>Join Live Chat</button>
                    </div>

                    <div className="sidebar-card">
                        <h3>Trending Topics</h3>
                        <ul className="live-list">
                            <li>#WPL2025</li>
                            <li>#ViratKohli</li>
                            <li>#MixedCricket</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Forum;
