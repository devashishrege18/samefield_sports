import React, { useState, useEffect } from 'react';
import { MessageSquare, ArrowUp, Zap, Radio, AlertTriangle, Search, Filter, Plus, ChevronRight, Share2, TrendingUp, Activity, Cpu, Shield, ZapOff, Info, Clock, UserCheck, ArrowUpRight } from 'lucide-react';
import { forumService } from '../services/ForumService';
import { usePoints } from '../context/PointsContext';

const ThreadDetail = ({ thread, onClose, onUpvote, commentText, onCommentChange, onReply }) => {
    const [comments, setComments] = useState([]);

    useEffect(() => {
        if (!thread) return;
        const unsubscribe = forumService.subscribeToComments(thread.id, (fetched) => {
            setComments(fetched);
        });
        return unsubscribe;
    }, [thread]);

    if (!thread) return null;

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/90 backdrop-blur-[60px] animate-fade-in">
            <div className="relative w-full max-w-4xl bg-surface border border-white/10 rounded-[40px] overflow-hidden shadow-premium flex flex-col max-h-[90vh]">
                <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] italic">{thread.category} Discussion</span>
                    </div>
                    <button onClick={onClose} className="p-4 bg-white/[0.05] hover:bg-white hover:text-black rounded-2xl text-white transition-all active:scale-95 border border-white/5">
                        <Plus className="w-5 h-5 rotate-45" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-12 scrollbar-hide">
                    <div className="flex gap-10 mb-12">
                        <div className="flex flex-col items-center gap-4">
                            <button className="p-5 bg-white/[0.03] hover:bg-primary hover:text-black rounded-2xl transition-all active:scale-95 group border border-white/10" onClick={(e) => onUpvote(e, thread.id)}>
                                <ArrowUp size={24} className="group-hover:translate-y-[-2px] transition-transform" />
                            </button>
                            <span className="text-3xl font-black text-white italic tabular-nums tracking-tighter">{thread.votes}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight uppercase italic tracking-tighter">{thread.title}</h2>
                            <div className="flex items-center gap-6 text-[10px] text-text-muted font-black uppercase tracking-[0.3em] mb-10 italic">
                                <div className="flex items-center gap-2 text-primary">
                                    <UserCheck size={12} />
                                    <span>{thread.author}</span>
                                </div>
                                <span className="h-1 w-1 bg-white/10 rounded-full" />
                                <div className="flex items-center gap-2">
                                    <Clock size={12} />
                                    <span>{new Date(thread.timestamp).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div className="text-white/80 text-lg leading-relaxed whitespace-pre-wrap border-l-2 border-primary/20 pl-10 mb-12 italic font-medium py-4">
                                {thread.content}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-10">
                        <div className="flex items-center justify-between border-b border-white/5 pb-6">
                            <h4 className="text-[10px] font-black text-white/50 uppercase tracking-[0.4em] italic flex items-center gap-4">
                                <MessageSquare className="w-4 h-4 text-primary" /> Community Comments ({thread.comments})
                            </h4>
                        </div>

                        <div className="space-y-6">
                            {comments.map((c, i) => (
                                <div key={i} className="p-8 bg-white/[0.02] rounded-[24px] border border-white/5 group hover:bg-white/[0.04] transition-all">
                                    <div className="flex justify-between mb-4">
                                        <span className="text-[9px] font-black text-primary uppercase tracking-[0.4em] italic leading-none">{c.author_name}</span>
                                        <span className="text-[9px] text-text-muted font-bold uppercase tracking-widest">{new Date(c.timestamp).toLocaleTimeString()}</span>
                                    </div>
                                    <p className="text-base text-white/70 font-medium leading-relaxed italic border-l-2 border-white/5 pl-6 group-hover:border-primary/20 transition-colors">{c.text}</p>
                                </div>
                            ))}
                            {comments.length === 0 && (
                                <div className="p-16 rounded-[32px] border border-dashed border-white/5 italic text-text-muted text-sm text-center flex flex-col items-center gap-6">
                                    <span className="uppercase tracking-[0.4em] font-black opacity-30">No comments yet. Start the conversation.</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-8 bg-black/40 border-t border-white/5 backdrop-blur-3xl">
                    <div className="flex gap-4 items-center">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={commentText}
                                onChange={(e) => onCommentChange(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && onReply()}
                                placeholder="Write a comment..."
                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-8 py-5 text-sm focus:outline-none focus:border-white/20 text-white placeholder:text-white/10 placeholder:font-black placeholder:uppercase placeholder:tracking-widest italic"
                            />
                        </div>
                        <button className="btn-primary" onClick={onReply}>
                            Post
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

    const filters = ['All', 'Live Reactions', 'Player Talk', 'Tactics', 'Predictions'];

    useEffect(() => {
        loadThreads();
    }, [filter]);

    useEffect(() => {
        const unsubscribe = forumService.onSync(() => {
            setThreads(forumService.getThreads(filter));
            setSelectedThread(prev => {
                if (!prev) return null;
                return forumService.getThreads('All').find(t => t.id === prev.id) || prev;
            });
        });
        const interval = setInterval(() => setThreads(forumService.getThreads(filter)), 5000);
        forumService.simulateLiveActivity(() => setThreads(forumService.getThreads(filter)));
        return () => { unsubscribe(); clearInterval(interval); };
    }, [filter]);

    const loadThreads = () => {
        setLoading(true);
        setTimeout(() => {
            setThreads(forumService.getThreads(filter));
            setLoading(false);
        }, 500);
    };

    const handleCreateMockThread = async () => {
        const savedName = localStorage.getItem('samefield_username') || 'Member';
        const newT = await forumService.createThread({
            title: "Community Viewpoint on League Progression",
            author: savedName,
            category: filter === 'All' ? 'Tactics' : filter,
            aiTags: ["Recommended"],
            content: "What are your top predictions for the upcoming season of Mixed Pro Finals? Truly curious to hear this group's tactical take.",
            votes: 1
        });
        setThreads(forumService.getThreads(filter));
        setSelectedThread(newT);
        addPoints(50, 'Discussion Hub Contribution');
    };

    const handleUpvote = (e, threadId) => {
        e.stopPropagation();
        forumService.upvoteThread(threadId);
        setThreads(forumService.getThreads(filter));
        addPoints(10, 'Post Recommendation Boosted');
    };

    const [commentText, setCommentText] = useState('');
    const handleReply = () => {
        if (!commentText.trim() || !selectedThread) return;
        const savedName = localStorage.getItem('samefield_username') || 'Member';
        const newComment = { id: 'c' + Date.now(), author_name: savedName, text: commentText.trim(), timestamp: new Date().toISOString() };
        forumService.broadcastComment(selectedThread.id, newComment);
        setCommentText('');
        addPoints(25, 'Community Insight Shared');
    };

    return (
        <div className="page-container h-[calc(100vh-120px)] overflow-y-auto scrollbar-hide relative bg-white/[0.01] rounded-[40px] border border-white/5 p-12 lg:p-16">
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

            {/* FORUM HEADER */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-10">
                <div className="animate-slide-up">
                    <div className="flex items-center gap-4 mb-3">
                        <div className="w-10 h-[1px] bg-primary/30" />
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.6em] italic">Active Discussion</span>
                    </div>
                    <h1 className="text-6xl md:text-[80px] font-black text-white uppercase italic tracking-tighter leading-[0.85] flex items-center gap-6">
                        Community <span className="text-white/20 italic">Hub</span>
                    </h1>
                    <p className="text-sm text-text-muted uppercase font-black tracking-[0.4em] mt-8 flex items-center gap-4 italic">
                        <TrendingUp className="w-5 h-5 text-primary" /> trending discussions & live streams
                    </p>
                </div>
                <button className="btn-primary flex items-center gap-4" onClick={handleCreateMockThread}>
                    <Plus className="w-5 h-5" />
                    New Topic
                </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-16">
                {/* MAIN FEED AREA */}
                <div className="xl:col-span-8 flex flex-col gap-12">

                    {/* FILTERS BAR */}
                    <div className="flex items-center gap-4 overflow-x-auto pb-6 scrollbar-hide animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        <div className="p-4 bg-white/[0.03] border border-white/10 rounded-2xl text-text-muted">
                            <Filter className="w-5 h-5" />
                        </div>
                        {filters.map(f => (
                            <button
                                key={f}
                                className={`whitespace-nowrap px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 border italic ${filter === f
                                    ? 'bg-white text-black border-white'
                                    : 'bg-white/[0.03] text-text-muted border-white/10 hover:text-white hover:border-white/30'
                                    }`}
                                onClick={() => setFilter(f)}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center p-32 bg-white/[0.01] border border-white/5 rounded-[40px] gap-8 animate-pulse">
                            <Activity className="w-12 h-12 text-primary/20" />
                            <span className="text-[10px] font-black uppercase text-primary/40 tracking-[0.6em] italic">Gathering insights...</span>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-8">
                            {threads.map((thread, i) => (
                                <div
                                    key={thread.id}
                                    className={`premium-card group transition-all duration-700 overflow-hidden cursor-pointer bg-black animate-fade-in ${thread.isLive ? 'border-primary/30' : ''}`}
                                    style={{ animationDelay: `${i * 0.1}s` }}
                                    onClick={() => setSelectedThread(thread)}
                                >
                                    <div className="flex">
                                        <div className="w-20 bg-white/[0.02] flex flex-col items-center py-10 gap-3 border-r border-white/5 shrink-0">
                                            <button
                                                className="p-3 text-text-muted hover:text-primary transition-all group/vote"
                                                onClick={(e) => handleUpvote(e, thread.id)}
                                            >
                                                <ArrowUp className="w-6 h-6 group-hover/vote:translate-y-[-2px] transition-transform" />
                                            </button>
                                            <span className="text-2xl font-black text-white italic tabular-nums tracking-tighter">{thread.votes}</span>
                                        </div>

                                        <div className="flex-1 p-10">
                                            <div className="flex items-center gap-4 mb-6">
                                                <span className="text-[9px] font-black text-primary uppercase tracking-[0.4em] bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-lg italic">{thread.category}</span>
                                                <span className="w-1 h-1 bg-white/10 rounded-full" />
                                                <div className="flex items-center gap-2 text-[9px] font-black text-text-muted uppercase tracking-[0.2em] italic">
                                                    <UserCheck size={12} className="text-primary/60" />
                                                    {thread.author} • 2m ago
                                                </div>
                                            </div>

                                            <h3 className="text-3xl font-black text-white mb-6 uppercase italic tracking-tighter leading-tight group-hover:text-primary transition-all flex items-center gap-4">
                                                {thread.isLive && (
                                                    <span className="bg-primary text-black px-3 py-1 rounded-full flex items-center gap-2">
                                                        <span className="w-1.5 h-1.5 bg-black rounded-full animate-pulse" />
                                                        <span className="text-[9px] font-black tracking-widest italic">LIVE</span>
                                                    </span>
                                                )}
                                                {thread.title}
                                            </h3>

                                            <p className="text-base text-text-muted font-medium line-clamp-2 leading-relaxed mb-8 italic border-l-2 border-white/5 pl-8 group-hover:border-primary/20 transition-all">
                                                "{thread.content}"
                                            </p>

                                            {thread.aiSummary && (
                                                <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl mb-8 flex gap-5 group-hover:bg-white/[0.04] transition-all">
                                                    <Cpu className="w-5 h-5 text-primary/40 shrink-0" />
                                                    <div className="space-y-1">
                                                        <span className="text-[9px] font-black text-primary/40 uppercase tracking-[0.4em] italic leading-none">AI Sentiment</span>
                                                        <p className="text-sm text-white/70 font-bold leading-relaxed italic tracking-tight">"{thread.aiSummary}"</p>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex items-center justify-between mt-4">
                                                <div className="flex gap-4">
                                                    {thread.aiTags?.map(tag => (
                                                        <span key={tag} className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] bg-white/[0.03] border border-white/5 px-3 py-1.5 rounded-lg italic">#{tag}</span>
                                                    ))}
                                                </div>
                                                <div className="flex items-center gap-8">
                                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted group-hover:text-white transition-all italic">
                                                        <MessageSquare className="w-4 h-4 text-primary" /> {thread.comments}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted group-hover:text-white transition-all italic">
                                                        <Share2 className="w-4 h-4 text-primary" /> Export
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* SIDEBAR COMMAND CENTER */}
                <div className="xl:col-span-4 flex flex-col gap-10">
                    <div className="premium-card p-10 bg-white/[0.02]">
                        <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] mb-10 flex items-center justify-between italic">
                            <span className="flex items-center gap-4"><Radio className="w-5 h-5 text-primary" /> Live Discussions</span>
                            <ChevronRight className="w-4 h-4" />
                        </h3>
                        <div className="space-y-4 mb-10">
                            {[
                                { title: 'India vs Australia', sub: 'Final Session Discussion' },
                                { title: 'Mixed Pro Finals', sub: 'Tactical Analysis Open' }
                            ].map((arena, i) => (
                                <div key={i} className="p-6 bg-white/[0.03] border border-white/5 rounded-2xl flex items-center justify-between group hover:bg-white/[0.06] transition-all cursor-pointer">
                                    <div className="space-y-2">
                                        <h4 className="text-[13px] font-black text-white uppercase italic tracking-tighter">{arena.title}</h4>
                                        <p className="text-[9px] text-primary/60 font-black uppercase tracking-[0.2em] italic">{arena.sub}</p>
                                    </div>
                                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                                </div>
                            ))}
                        </div>
                        <button className="w-full btn-primary text-[10px]">Sync to Community Arena</button>
                    </div>

                    <div className="premium-card p-10 bg-white/[0.02]">
                        <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] mb-10 italic flex items-center gap-4">
                            <TrendingUp className="w-5 h-5 text-primary" /> Trending Topics
                        </h3>
                        <div className="space-y-8">
                            {['League Progression', 'Tactical Analysis', 'Player Milestones', 'Fan Predictions'].map((topic, i) => (
                                <div key={topic} className="flex items-center justify-between group cursor-pointer">
                                    <span className="text-[12px] font-black text-white/40 uppercase tracking-[0.2em] group-hover:text-primary transition-all italic">#{topic.replace(/\s/g, '')}</span>
                                    <ArrowUpRight className="w-4 h-4 text-white/10 group-hover:text-primary transition-all" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="premium-card p-10 bg-gradient-to-br from-white/[0.03] to-transparent border-white/10 relative overflow-hidden">
                        <Zap className="w-10 h-10 text-primary mb-8" />
                        <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-4 leading-none">Member Status</h4>
                        <p className="text-xs text-text-muted font-bold leading-relaxed mb-8 italic uppercase tracking-widest">Contributing to discussions increases your community rank. Tier 5 unlocks exclusive analyst features.</p>

                        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mb-6">
                            <div className="w-[45%] h-full bg-primary rounded-full" />
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="text-[9px] font-black text-primary uppercase tracking-[0.4em] italic leading-none">Tier-3 Analyst</p>
                            <p className="text-[9px] font-black text-white/20 uppercase tracking-widest italic leading-none">4.2K XP until Tier-4</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Forum;
