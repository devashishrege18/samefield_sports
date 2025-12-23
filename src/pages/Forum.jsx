import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, ArrowUp, Zap, Radio, AlertTriangle, ExternalLink, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { forumService } from '../services/ForumService';
import { usePoints } from '../context/PointsContext';
import { fetchRedditPosts, formatCount } from '../services/SocialMediaService';
import '../styles/components/Forum.css';

const ThreadDetail = ({ thread, onClose, onUpvote, commentText, onCommentChange, onReply }) => {
    const [comments, setComments] = useState([]);

    useEffect(() => {
        if (!thread) return;
        const unsubscribe = forumService.subscribeToComments(thread.id, (fetched) => {
            setComments(fetched);
        });
        return () => unsubscribe();
    }, [thread]);

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
                            <button className="p-3 bg-white/5 hover:bg-primary hover:text-black rounded-xl transition-all" onClick={(e) => onUpvote(e, thread.id)}>
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

                        <div className="space-y-4">
                            {comments.map((c, i) => (
                                <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/5 animate-in slide-in-from-bottom duration-300">
                                    <div className="flex justify-between mb-1">
                                        <span className="text-[10px] font-black text-primary uppercase">{c.author_name}</span>
                                        <span className="text-[8px] text-textMuted uppercase">{new Date(c.timestamp).toLocaleTimeString()}</span>
                                    </div>
                                    <p className="text-sm text-gray-300">{c.text}</p>
                                </div>
                            ))}
                            {comments.length === 0 && (
                                <div className="p-4 bg-white/5 rounded-xl border border-white/5 italic text-textMuted text-xs text-center">
                                    No comments yet. Be the first to join the conversation!
                                </div>
                            )}
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
                            onChange={(e) => onCommentChange(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && onReply()}
                            placeholder="Add to the conversation..."
                            className="flex-1 bg-black/50 border border-white/10 rounded-full px-6 py-3 text-sm focus:outline-none text-white"
                        />
                        <button className="bg-primary text-black font-black uppercase px-8 rounded-full text-xs hover:scale-105 transition-transform" onClick={onReply}>
                            Reply
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Forum = () => {
    const { addPoints } = usePoints();
    const [threads, setThreads] = useState([]);
    const [filter, setFilter] = useState('All');
    const [loading, setLoading] = useState(true);
    const [selectedThread, setSelectedThread] = useState(null);
    const [redditPosts, setRedditPosts] = useState([]);
    const [redditLoading, setRedditLoading] = useState(true);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const redditScrollRef = useRef(null);

    const filters = ['All', 'Live Match Reactions', 'Player Performance Talk', 'Tactical Analysis', 'Fan Predictions'];

    const scrollReddit = (direction) => {
        const container = redditScrollRef.current;
        if (!container) return;
        const scrollAmount = 300;
        const newScroll = direction === 'left'
            ? container.scrollLeft - scrollAmount
            : container.scrollLeft + scrollAmount;
        container.scrollTo({ left: newScroll, behavior: 'smooth' });
    };

    const updateScrollState = () => {
        const container = redditScrollRef.current;
        if (!container) return;
        setCanScrollLeft(container.scrollLeft > 10);
        setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth - 10);
    };

    useEffect(() => {
        loadThreads();
    }, [filter]);

    useEffect(() => {
        const unsubscribe = forumService.onSync(() => {
            setThreads(forumService.getThreads(filter));
            setSelectedThread(prev => {
                if (!prev) return null;
                const refreshed = forumService.getThreads('All').find(t => t.id === prev.id);
                return refreshed || prev;
            });
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
    }, [filter]);

    const loadThreads = () => {
        setLoading(true);
        // Simulate network delay
        setTimeout(() => {
            setThreads(forumService.getThreads(filter));
            setLoading(false);
        }, 300);
    };

    // Load Reddit posts on mount
    useEffect(() => {
        const loadReddit = async () => {
            setRedditLoading(true);
            const posts = await fetchRedditPosts('default', 6);
            setRedditPosts(posts);
            setRedditLoading(false);
        };
        loadReddit();
    }, []);

    const refreshReddit = async () => {
        setRedditLoading(true);
        const posts = await fetchRedditPosts('default', 6);
        setRedditPosts(posts);
        setRedditLoading(false);
    };

    const handleCreateMockThread = async () => {
        const savedName = localStorage.getItem('samefield_username') || 'You (Demo)';
        // Simulate user creating a thread
        const newT = await forumService.createThread({
            title: "Community Insight: The Rise of Mixed Teams",
            author: savedName,
            category: filter === 'All' ? 'Tactical Analysis' : filter,
            aiTags: ["User Generated", "Real-time"],
            content: "Sharing my thoughts on progress in the community leagues... I believe the integration of diverse skillsets is the key to our future success. What do you all think?",
            votes: 1
        });

        // Wait for sync or force local update
        setThreads(forumService.getThreads(filter));
        setSelectedThread(newT);
        addPoints(50, 'Created New Topic');
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

        // Broadcast the comment via P2P
        forumService.broadcastComment(selectedThread.id, newComment);

        // The onSync listener in useEffect will update the threads and selectedThread state
        // providing a consistent path for both local and remote updates.

        setCommentText('');
        addPoints(10, 'Replied to Discussion');
    };

    return (
        <div className="forum-container page-frame background-texture">

            {selectedThread && (
                <ThreadDetail
                    thread={selectedThread}
                    onClose={() => setSelectedThread(null)}
                    onUpvote={handleUpvote}
                    commentText={commentText}
                    onCommentChange={setCommentText}
                    onReply={handleReply}
                />
            )}

            <div className="forum-header">
                <div>
                    <h2 className="section-title">Community Forum</h2>
                    <p className="purpose-line" style={{ color: 'rgba(176, 176, 176, 0.8)', fontSize: '0.875rem', marginTop: '4px' }}>Discuss matches, predictions, and tactical analysis with fellow fans.</p>
                </div>
                <button className="btn-create" onClick={handleCreateMockThread}>
                    + New Discussion
                </button>
            </div>

            {/* Reddit Trending Section */}
            <div className="reddit-trending-section">
                <div className="reddit-header">
                    <div className="reddit-title-row">
                        <div className="reddit-icon">
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
                            </svg>
                        </div>
                        <h3>Trending on Reddit</h3>
                        <span className="reddit-live-badge">LIVE</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => scrollReddit('left')}
                            disabled={!canScrollLeft}
                            className={`w-7 h-7 flex items-center justify-center rounded-full border transition-all ${canScrollLeft
                                ? 'bg-surfaceHighlight border-white/20 text-white hover:bg-[#FF4500] hover:text-white hover:border-[#FF4500]'
                                : 'bg-surface border-white/10 text-white/30 cursor-not-allowed'}`}
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => scrollReddit('right')}
                            disabled={!canScrollRight}
                            className={`w-7 h-7 flex items-center justify-center rounded-full border transition-all ${canScrollRight
                                ? 'bg-surfaceHighlight border-white/20 text-white hover:bg-[#FF4500] hover:text-white hover:border-[#FF4500]'
                                : 'bg-surface border-white/10 text-white/30 cursor-not-allowed'}`}
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                        <button className="reddit-refresh-btn" onClick={refreshReddit} disabled={redditLoading}>
                            <RefreshCw size={14} className={redditLoading ? 'animate-spin' : ''} />
                            Refresh
                        </button>
                    </div>
                </div>
                <div
                    ref={redditScrollRef}
                    onScroll={updateScrollState}
                    className="reddit-posts-scroll"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {redditLoading ? (
                        <div className="reddit-loading">
                            <div className="loading-dots">
                                <span></span><span></span><span></span>
                            </div>
                            Fetching from Reddit...
                        </div>
                    ) : (
                        redditPosts.map((post) => (
                            <a
                                key={post.id}
                                href={post.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="reddit-post-card"
                            >
                                <div className="reddit-post-header">
                                    <span className="reddit-subreddit">{post.subreddit}</span>
                                    <span className="reddit-author">{post.author}</span>
                                    <span className="reddit-time">{post.timeAgo}</span>
                                </div>
                                <h4 className="reddit-post-title">{post.title}</h4>
                                <div className="reddit-post-stats">
                                    <span className="reddit-upvotes">
                                        <ArrowUp size={12} /> {formatCount(post.upvotes)}
                                    </span>
                                    <span className="reddit-comments">
                                        <MessageSquare size={12} /> {formatCount(post.comments)}
                                    </span>
                                    <ExternalLink size={12} className="reddit-external" />
                                </div>
                            </a>
                        ))
                    )}
                </div>
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
            </div>

            {/* TERMINATION ZONE */}
            <div className="zone-c" />
        </div>
    );
};

export default Forum;
