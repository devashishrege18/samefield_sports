import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Award, Star, Users, TrendingUp, Lock, Heart, MessageCircle, Share2, Send, Zap,
    ChevronRight, Globe, Image as ImageIcon, Play, X, Pin, Activity, Shield,
    AlertTriangle, ShoppingBag, Plus, Radio, Cpu, Compass, UserCheck, Clock
} from 'lucide-react';
import { fandomService } from '../services/FandomService';
import { usePoints } from '../context/PointsContext';
import { v4 as uuidv4 } from 'uuid';
import '../styles/pages/Fandom.css';

import { joinRoom } from 'trystero/nostr';
import { predictionQuestions, circles as mockCircles, circleMedia } from '../services/mockData';

const Fandom = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('feed');

    const { points: globalPoints, userId } = usePoints();
    const [stats, setStats] = useState({ points: 0, level: '...', joinedCircles: [] });
    const [circles, setCircles] = useState(fandomService.getCircles());

    const highlights = [
        { id: 'video1', title: 'Gauff vs Qinwen Zheng – Match Intel', category: 'Tennis Highlights', vidId: '_Hlq_TaPoYw' },
        { id: 'video2', title: 'European Cross Country – Final Sprint', category: 'Athletics', vidId: 'pWUJL_tL7XI' },
        { id: 'video3', title: 'Para Athletics | Day 6 – New Delhi 2025', category: 'Para & Track', vidId: '2oRUNvazstM' },
        { id: 'video4', title: 'Men’s Senior Replay – European Champs', category: 'Athletics', vidId: 'UhKSB946GA8' },
        { id: 'video5', title: 'Calvin Quek – 400m Hurdles Intel', category: 'Track', vidId: 'I0p6JChHmFw' },
        { id: 'video6', title: 'Neymar VS Haaland – Protocol Analysis', category: 'Soccer', vidId: 'NsZ-BiPzmOw' }
    ];

    const [posts, setPosts] = useState([]);
    const [newPostContent, setNewPostContent] = useState('');
    const [expandedPost, setExpandedPost] = useState(null);
    const [commentInputs, setCommentInputs] = useState({});
    const [activeVideo, setActiveVideo] = useState(null);

    // P2P State
    const [room, setRoom] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [guestIdentity, setGuestIdentity] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [floatingHearts, setFloatingHearts] = useState([]);

    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (userId) {
            fandomService.getUserStats(userId).then(data => {
                if (data) setStats(data);
            });
        }
    }, [userId, globalPoints]);

    useEffect(() => {
        const storedId = localStorage.getItem('fandom_guest_id') || uuidv4();
        const storedName = localStorage.getItem('samefield_username') || `Fan_${Math.floor(1000 + Math.random() * 9000)}`;
        localStorage.setItem('fandom_guest_id', storedId);

        const identity = { guestUid: storedId, guest_name: storedName };
        setGuestIdentity(identity);

        if (id) {
            const RELAYS = ['wss://relay.damus.io', 'wss://nos.lol', 'wss://relay.snort.social'];
            const config = { appId: 'samefield_fandom_v6', relayUrls: RELAYS };
            const fandomRoomId = `fandom_${id}`;

            try {
                const newRoom = joinRoom(config, fandomRoomId);
                setRoom(newRoom);

                newRoom.onPeerJoin(peerId => {
                    setIsConnected(true);
                    setOnlineUsers(prev => [...new Set([...prev, peerId])]);
                });

                newRoom.onPeerLeave(peerId => {
                    setOnlineUsers(prev => prev.filter(p => p !== peerId));
                });

                return () => newRoom.leave();
            } catch (e) {
                console.error("Fandom P2P Logic Offline", e);
            }
        }
    }, [id]);

    const scrollToBottom = () => {
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    };

    useEffect(() => {
        const unsubPosts = fandomService.subscribeToPosts(id, (updatedPosts) => {
            setPosts(updatedPosts);
        });

        const unsubChat = fandomService.subscribeToChat(id, (updatedMessages) => {
            setChatMessages(updatedMessages);
            if (activeTab === 'chat') scrollToBottom();
        });

        return () => {
            unsubPosts();
            unsubChat();
        };
    }, [id, activeTab]);

    const handleCreatePost = async () => {
        if (!newPostContent.trim() || !guestIdentity) return;
        const postData = {
            author_name: guestIdentity.guest_name,
            content: newPostContent,
            author_id: guestIdentity.guestUid
        };
        await fandomService.addPost(id, postData);
        setNewPostContent('');
    };

    const handleLike = async (postId) => {
        if (!guestIdentity) return;
        await fandomService.likePost(id, postId, guestIdentity.guestUid);
    };

    const handleSendMessage = async () => {
        if (!chatInput.trim() || !guestIdentity) return;
        const msg = {
            guestUid: guestIdentity.guestUid,
            guest_name: guestIdentity.guest_name,
            text: chatInput,
            time: new Date().toISOString()
        };
        await fandomService.sendChatMessage(id, msg);
        setChatInput('');
        scrollToBottom();
    };

    const handleAddComment = async (postId) => {
        const text = commentInputs[postId];
        if (!text || !text.trim() || !guestIdentity) return;
        const commentData = {
            author_name: guestIdentity.guest_name,
            text: text.trim(),
            author_id: guestIdentity.guestUid,
            timestamp: new Date().toISOString()
        };
        await fandomService.addComment(id, postId, commentData);
        setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    };

    const handleJoin = async (id) => {
        if (!userId) return;
        const res = await fandomService.joinCircle(userId, id);
        if (res.success) {
            const upStats = await fandomService.getUserStats(userId);
            if (upStats) setStats(upStats);
        }
    };

    const handleFloatingHeart = () => {
        const newHeart = {
            id: Date.now(),
            style: {
                left: `${30 + (Math.random() * 40)}%`,
                animationDuration: `${1.5 + Math.random()}s`,
            }
        };
        setFloatingHearts(prev => [...prev, newHeart]);
        setTimeout(() => setFloatingHearts(prev => prev.filter(h => h.id !== newHeart.id)), 2000);
    };

    const getColorFromInitials = (name) => {
        const colors = ['bg-pink-500', 'bg-primary', 'bg-blue-600', 'bg-green-500', 'bg-purple-600', 'bg-orange-500'];
        let hash = 0;
        for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
        return colors[Math.abs(hash) % colors.length];
    };

    if (!guestIdentity) return (
        <div className="h-[70vh] flex flex-col items-center justify-center gap-8">
            <Activity className="w-20 h-20 text-primary animate-spin-slow opacity-20" />
            <span className="text-[12px] font-black uppercase text-primary tracking-[0.6em] italic animate-pulse">Establishing Signal...</span>
        </div>
    );

    const currentCircle = circles.find(c => c.id === id);
    const currentPoints = stats.xp || globalPoints || 0;
    const currentLevelObj = fandomService.getLevel(currentPoints);
    const nextLevel = fandomService.getNextLevel(currentPoints);
    const progressPercent = nextLevel ? Math.min(100, (currentPoints / nextLevel.minPoints) * 100) : 100;

    // ============================================
    // CINEMATIC CHANNEL VIEW
    // ============================================
    if (id) {
        return (
            <div className="page-container h-[calc(100vh-120px)] overflow-y-auto scrollbar-hide animate-fade-in relative bg-white/[0.02] rounded-[40px] border border-white/5">
                {/* ELEGANT HERO */}
                <div className="relative h-[450px] w-full overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
                    <img
                        src={id === 'c1' ? "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=1600" : "https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?auto=format&fit=crop&q=80&w=1600"}
                        className="w-full h-full object-cover opacity-40 grayscale scale-100 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[3000ms]"
                        alt="Banner"
                    />

                    <div className="absolute bottom-16 left-12 right-12 z-20 flex items-end justify-between">
                        <div className="flex items-end gap-10">
                            <div className="w-32 h-32 rounded-[32px] bg-black border border-white/10 shadow-2xl flex items-center justify-center text-5xl relative overflow-hidden">
                                <span className="relative z-10">{currentCircle?.icon}</span>
                            </div>
                            <div className="pb-4">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="flex h-1.5 w-1.5 rounded-full bg-primary" />
                                    <span className="text-[10px] font-bold text-primary/80 uppercase tracking-widest">Active Community</span>
                                </div>
                                <h1 className="text-6xl font-black text-white tracking-tighter uppercase leading-none mb-4">
                                    {currentCircle?.name} <span className="text-white/40">Circle</span>
                                </h1>
                                <div className="flex items-center gap-6">
                                    <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                                        <Users size={12} className="text-primary/60" /> {currentCircle?.members?.toLocaleString()} Members
                                    </p>
                                    <span className="h-1 w-1 bg-white/10 rounded-full" />
                                    <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                                        <span className="text-[9px] font-bold text-white/60 uppercase tracking-widest">Live Discussions</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/fandom')}
                            className="bg-white/5 hover:bg-white text-white hover:text-black text-[10px] font-bold uppercase tracking-widest px-8 py-4 rounded-xl border border-white/10 transition-all active:scale-95 shadow-2xl mb-6"
                        >
                            All Circles
                        </button>
                    </div>
                </div>

                {/* MINIMAL NAVIGATION */}
                <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-3xl border-y border-white/5 px-12">
                    <div className="flex gap-12">
                        {['feed', 'chat', 'media'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`py-6 text-[10px] font-bold uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-primary' : 'text-white/40 hover:text-white'}`}
                            >
                                {tab === 'chat' ? 'Broadcast Hub' : tab}
                                {activeTab === tab && (
                                    <div className="absolute bottom-[-1px] left-0 w-full h-0.5 bg-primary" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* MODULES AREA */}
                <div className="max-w-[1400px] mx-auto px-12 py-16 pb-32">

                    {/* FEED MODULE */}
                    {activeTab === 'feed' && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-in fade-in slide-in-from-bottom-10 duration-700">
                            <div className="lg:col-span-8 flex flex-col gap-10">
                                {/* Community Input */}
                                <div className="premium-card p-10 bg-white/[0.02] border-white/5 relative overflow-hidden group">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                            <Zap size={20} />
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest">Post to Circle</span>
                                            <p className="text-[8px] text-white/40 font-bold uppercase tracking-widest mt-0.5">Share your thoughts with the community</p>
                                        </div>
                                    </div>
                                    <textarea
                                        className="w-full bg-transparent text-white text-2xl placeholder-white/10 resize-none outline-none mb-8 font-bold tracking-tight leading-relaxed"
                                        rows="2"
                                        placeholder="What's happening in the arena?"
                                        value={newPostContent}
                                        onChange={(e) => setNewPostContent(e.target.value)}
                                    ></textarea>
                                    <div className="flex justify-between items-center border-t border-white/5 pt-8">
                                        <div className="flex gap-3">
                                            <button className="p-4 bg-white/5 hover:bg-white hover:text-black rounded-xl text-white/40 transition-all active:scale-90 border border-white/5">
                                                <ImageIcon size={20} />
                                            </button>
                                            <button className="p-4 bg-white/5 hover:bg-white hover:text-black rounded-xl text-white/40 transition-all active:scale-90 border border-white/5">
                                                <Compass size={20} />
                                            </button>
                                        </div>
                                        <button
                                            onClick={handleCreatePost}
                                            className={`px-10 py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${newPostContent.trim() ? 'bg-primary text-black shadow-lg active:scale-95' : 'bg-white/5 text-white/20 cursor-not-allowed'}`}
                                        >
                                            Share Post
                                        </button>
                                    </div>
                                </div>

                                {/* Feed Stream */}
                                <div className="space-y-8">
                                    {posts.map((post, i) => {
                                        const isLiked = Array.isArray(post.likes) && post.likes.includes(guestIdentity.guestUid);
                                        return (
                                            <div key={post.id} className="premium-card p-10 hover:border-white/20 transition-all duration-500 group/post animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                                                <div className="flex items-center gap-6 mb-8">
                                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white text-xl shadow-lg border border-white/5 ${getColorFromInitials(post.author_name)}`}>
                                                        {post.author_name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-white text-xl tracking-tight leading-none mb-2 hover:text-primary transition-colors cursor-pointer">{post.author_name}</h4>
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-1.5 h-1.5 bg-primary/40 rounded-full" />
                                                            <p className="text-[9px] text-white/40 font-bold uppercase tracking-widest">{new Date(post.created_at).toLocaleTimeString()} • Community Member</p>
                                                        </div>
                                                    </div>
                                                    <div className="ml-auto flex gap-3">
                                                        <div className="p-2.5 bg-white/5 rounded-lg text-white/20 hover:text-primary transition-all cursor-pointer">
                                                            <Pin size={14} />
                                                        </div>
                                                        <div className="p-2.5 bg-white/5 rounded-lg text-white/20 hover:text-red-500 transition-all cursor-pointer">
                                                            <AlertTriangle size={14} />
                                                        </div>
                                                    </div>
                                                </div>

                                                <p className="text-white/80 text-lg leading-relaxed whitespace-pre-wrap mb-10 font-medium border-l-2 border-primary/20 pl-8 group-hover:border-primary/40 transition-all">
                                                    {post.content}
                                                </p>

                                                <div className="flex items-center justify-between border-t border-white/5 pt-8">
                                                    <div className="flex gap-8">
                                                        <button onClick={() => handleLike(post.id)} className={`flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest transition-all ${isLiked ? 'text-primary' : 'text-white/40 hover:text-white'}`}>
                                                            <Star size={18} fill={isLiked ? "currentColor" : "none"} className={isLiked ? "animate-bounce-in" : "group-hover/post:scale-110 transition-transform"} />
                                                            {post.likes?.length || 0} Likes
                                                        </button>
                                                        <button onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)} className="flex items-center gap-3 text-[10px] font-bold text-white/40 hover:text-white uppercase tracking-widest transition-all">
                                                            <MessageCircle size={18} className="group-hover/post:scale-110 transition-transform" /> {post.comments?.length || 0} Comments
                                                        </button>
                                                    </div>
                                                    <button className="p-3 bg-white/5 hover:bg-white hover:text-black rounded-lg text-white/40 transition-all active:scale-95 border border-white/5">
                                                        <Share2 size={16} />
                                                    </button>
                                                </div>

                                                {expandedPost === post.id && (
                                                    <div className="mt-8 space-y-4 animate-in slide-in-from-top-4 duration-500">
                                                        <div className="bg-black/40 rounded-[24px] p-8 border border-white/5">
                                                            <div className="space-y-6 max-h-[300px] overflow-y-auto scrollbar-hide mb-8">
                                                                {post.comments?.map((c, idx) => (
                                                                    <div key={idx} className="flex gap-4 animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                                                                        <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center font-bold text-white text-[10px] ${getColorFromInitials(c.author_name)}`}>
                                                                            {c.author_name.charAt(0)}
                                                                        </div>
                                                                        <div className="flex-1 space-y-1.5">
                                                                            <div className="flex justify-between">
                                                                                <span className="text-[9px] font-bold text-primary/80 uppercase tracking-widest">{c.author_name}</span>
                                                                                <span className="text-[8px] text-white/20 font-bold uppercase tracking-widest">{new Date(c.timestamp).toLocaleTimeString()}</span>
                                                                            </div>
                                                                            <p className="text-sm text-white/60 leading-relaxed">{c.text}</p>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <div className="flex gap-4">
                                                                <input
                                                                    type="text"
                                                                    placeholder="Add a comment..."
                                                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-xs focus:border-primary focus:outline-none text-white transition-all font-medium placeholder:text-white/10"
                                                                    value={commentInputs[post.id] || ''}
                                                                    onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                                                                    onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                                                                />
                                                                <button onClick={() => handleAddComment(post.id)} className="bg-primary text-black px-8 rounded-xl hover:scale-105 transition-all active:scale-95 shadow-lg flex items-center justify-center">
                                                                    <Send size={18} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="lg:col-span-4 space-y-10">
                                <div className="premium-card p-10 bg-white/[0.02] border-white/5">
                                    <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-8 flex items-center gap-3">
                                        <Activity size={14} className="text-primary" /> Circle Vitality
                                    </h3>
                                    <div className="space-y-6">
                                        {[
                                            { label: 'Community Pulse', value: 'High', color: 'text-primary' },
                                            { label: 'Discussion Frequency', value: 'Active', color: 'text-white' },
                                            { label: 'Member Retention', value: '98%', color: 'text-white' },
                                            { label: 'Active Sessions', value: '1,244', color: 'text-white' }
                                        ].map((stat, idx) => (
                                            <div key={idx} className="flex justify-between items-center py-4 border-b border-white/5 last:border-0">
                                                <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">{stat.label}</span>
                                                <span className={`text-xs font-bold ${stat.color}`}>{stat.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* BROADCAST HUB */}
                    {activeTab === 'chat' && (
                        <div className="h-[700px] flex flex-col premium-card bg-white/[0.01] border-white/5 animate-in fade-in zoom-in-95 duration-700 overflow-hidden !p-0">
                            <div className="p-10 border-b border-white/5 flex items-center justify-between bg-black/40 backdrop-blur-3xl">
                                <div className="flex items-center gap-6">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <Radio className="text-primary w-5 h-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white tracking-tight">Live Discussions</h2>
                                        <div className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                                            <span className="text-[8px] text-white/40 font-bold uppercase tracking-widest">Global P2P Stream • Encrypted</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex -space-x-3">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="w-8 h-8 rounded-lg border-2 border-black bg-white/5 overflow-hidden">
                                                <img src={`https://i.pravatar.cc/100?u=${i + 10}`} alt="User" className="w-full h-full object-cover opacity-60" />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                                        <span className="text-[8px] font-bold text-white/60 uppercase tracking-widest">42 Active</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-12 space-y-8 scrollbar-hide bg-black/20">
                                {chatMessages.map((msg, i) => {
                                    const isMe = msg.guestUid === guestIdentity.guestUid || msg.guest_id === guestIdentity.guestUid;
                                    return (
                                        <div key={i} className={`flex gap-6 animate-in slide-in-from-${isMe ? 'right' : 'left'}-4 duration-500 ${isMe ? 'flex-row-reverse' : ''}`}>
                                            <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center font-bold text-white text-xs ${getColorFromInitials(msg.guest_name)}`}>
                                                {msg.guest_name.charAt(0)}
                                            </div>
                                            <div className={`max-w-[70%] space-y-2 ${isMe ? 'items-end flex flex-col' : ''}`}>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">{msg.guest_name}</span>
                                                    <span className="text-[8px] text-white/20 font-bold uppercase tracking-widest">{new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                                <div className={`p-5 rounded-2xl text-sm leading-relaxed ${isMe ? 'bg-primary text-black font-bold' : 'bg-white/5 text-white/80 border border-white/5'}`}>
                                                    {msg.text}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            <div className="p-10 border-t border-white/5 bg-black/40">
                                <div className="flex gap-6">
                                    <button onClick={handleFloatingHeart} className="p-4 bg-white/5 hover:bg-primary hover:text-black rounded-xl text-white transition-all active:scale-90 border border-white/5">
                                        <Heart size={20} />
                                    </button>
                                    <input
                                        type="text"
                                        placeholder="Send a message to the circle..."
                                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-8 py-4 text-sm text-white focus:outline-none focus:border-primary transition-all placeholder:text-white/20 font-medium"
                                        value={chatInput}
                                        onChange={(e) => setChatInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                    />
                                    <button onClick={handleSendMessage} className="bg-primary text-black px-10 rounded-xl font-bold uppercase text-[10px] tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center justify-center">
                                        <Send size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* MEDIA MODULE */}
                    {activeTab === 'media' && (
                        <div className="animate-in fade-in slide-in-from-bottom-10 duration-700">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                {(circleMedia[id] || circleMedia['default']).map((item, i) => (
                                    <div
                                        key={item.id}
                                        className="premium-card p-0 h-[320px] group border border-white/5 hover:border-primary/40 transition-all duration-700 overflow-hidden relative animate-fade-in"
                                        style={{ animationDelay: `${i * 0.1}s` }}
                                        onClick={() => item.type === 'video' ? setActiveVideo(item.vidId) : null}
                                    >
                                        <img
                                            src={item.type === 'video' ? `https://img.youtube.com/vi/${item.vidId}/maxresdefault.jpg` : item.url}
                                            className="w-full h-full object-cover opacity-60 group-hover:scale-110 grayscale group-hover:grayscale-0 transition-all duration-[2000ms]"
                                            alt={item.title}
                                        />
                                        <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black to-transparent">
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className="text-[8px] font-bold text-primary uppercase tracking-widest">{item.type === 'video' ? 'Replay' : 'Gallery'}</span>
                                            </div>
                                            <h4 className="text-xl text-white font-bold tracking-tight uppercase">{item.title}</h4>
                                        </div>
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                                            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-black">
                                                <Play size={24} fill="currentColor" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Video Modal Overlay */}
                {activeVideo && (
                    <div className="fixed inset-0 z-[150] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-12 animate-in fade-in">
                        <div className="bg-black border border-white/10 rounded-[40px] overflow-hidden w-full max-w-6xl shadow-2xl relative">
                            <button onClick={() => setActiveVideo(null)} className="absolute top-8 right-8 z-[170] p-4 rounded-2xl bg-black border border-white/10 hover:bg-primary hover:text-black text-white transition-all active:scale-95 shadow-2xl">
                                <X size={24} />
                            </button>
                            <div className="aspect-video w-full">
                                <iframe
                                    width="100%" height="100%"
                                    src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1&modestbranding=1&rel=0`}
                                    title="YouTube player" frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // ============================================
    // PREMIUM LOBBY VIEW
    // ============================================
    return (
        <div className="h-[calc(100vh-100px)] overflow-y-auto scrollbar-hide p-12 md:p-16 lg:p-24 space-y-24 bg-black/40 backdrop-blur-3xl rounded-[60px] border border-white/5 animate-fade-in relative">

            {/* BACKGROUND DECOR */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 blur-[200px] -z-10 rounded-full animate-pulse-glow" />

            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-12">
                <div>
                    <div className="flex items-center gap-5 mb-6">
                        <div className="w-12 h-[1px] bg-primary/40" />
                        <span className="text-[11px] font-black text-primary uppercase tracking-[0.6em] italic animate-pulse">Command Center</span>
                    </div>
                    <h1 className="text-7xl md:text-9xl font-black text-white italic tracking-tighter uppercase leading-[0.85] mb-8">
                        Vanguard <span className="text-primary underline decoration-primary/40 decoration-[25px] underline-offset-[25px]">Control</span>
                    </h1>
                    <div className="flex items-center gap-8">
                        <p className="text-lg text-textMuted font-black uppercase tracking-[0.4em] flex items-center gap-4 italic opacity-80">
                            Authenticated as <span className="text-primary">{guestIdentity.guest_name}</span>
                        </p>
                        <span className="h-1.5 w-1.5 bg-primary/20 rounded-full" />
                        <p className="text-lg text-textMuted font-black uppercase tracking-[0.4em] italic opacity-80">
                            Node <span className="text-green-500">SECURE</span>
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-6 bg-white/5 px-10 py-6 rounded-[40px] border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.6)] backdrop-blur-2xl group hover:border-primary/40 transition-all">
                    <Globe size={24} className="text-primary group-hover:rotate-180 transition-transform duration-1000" />
                    <div>
                        <span className="text-[10px] font-black text-textMuted uppercase tracking-widest block italic leading-none mb-2">Global Sector Rank</span>
                        <span className="text-2xl font-black text-white italic tracking-tight uppercase group-hover:text-primary transition-colors">Grade A Analyst • #142</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-16">

                <div className="xl:col-span-8 flex flex-col gap-16">

                    {/* Elite Synchronization Node */}
                    <div className="premium-card p-16 bg-black/40 border-primary/20 relative overflow-hidden group shadow-[0_60px_150px_rgba(0,0,0,1)]">
                        {/* GLOW DECOR */}
                        <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] bg-primary/10 blur-[150px] -z-10 rounded-full group-hover:bg-primary/20 transition-all duration-[3000ms]" />
                        <div className="absolute bottom-[-50px] left-[-50px] w-56 h-56 bg-primary/5 blur-[80px] -z-10 rounded-full" />

                        <div className="relative z-10 flex flex-col lg:flex-row justify-between gap-16">
                            <div className="flex-1 space-y-12">
                                <div>
                                    <div className="flex items-center gap-4 mb-6">
                                        <Cpu className="text-primary w-6 h-6 animate-pulse" />
                                        <p className="text-[12px] font-black text-primary uppercase tracking-[0.5em] italic">Vanguard Sync Protocol</p>
                                    </div>
                                    <h2 className="text-7xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-[0.9] mb-4">{currentLevelObj?.name}</h2>
                                    <div className="flex items-center gap-4 text-textMuted">
                                        <Shield size={18} />
                                        <p className="text-base font-black uppercase tracking-[0.4em] italic opacity-60">Status: Elite Operational Vanguard</p>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div className="flex justify-between items-end">
                                        <div className="space-y-2">
                                            <span className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em] italic">Intelligence Flow</span>
                                            <div className="flex items-baseline gap-4">
                                                <span className="text-5xl font-black text-primary italic tracking-tighter tabular-nums">{currentPoints.toLocaleString()}</span>
                                                <span className="text-2xl text-textMuted font-black italic tracking-tighter block pb-1 border-b border-white/10 uppercase">/ {(nextLevel?.minPoints || 25000).toLocaleString()} XP</span>
                                            </div>
                                        </div>
                                        <div className="w-[120px] h-[120px] bg-white/5 rounded-full p-2 relative group-hover:scale-105 transition-transform duration-700">
                                            <svg className="w-full h-full transform -rotate-90">
                                                <circle cx="60" cy="60" r="54" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-white/5" />
                                                <circle cx="60" cy="60" r="54" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-primary" strokeDasharray={340} strokeDashoffset={340 - (340 * progressPercent) / 100} strokeLinecap="round" />
                                            </svg>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <span className="text-2xl font-black text-white italic">{Math.round(progressPercent)}%</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full h-4 bg-white/5 rounded-full overflow-hidden shadow-inner border border-white/5">
                                        <div className="h-full bg-primary shadow-[0_0_30px_var(--primary-glow)] transition-all duration-[3000ms] animate-pulse" style={{ width: `${progressPercent}%` }} />
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <p className="text-[10px] text-primary font-black uppercase tracking-[0.4em] flex items-center gap-3 italic">
                                            <Zap size={14} className="animate-bounce" /> Evolution sequence: {(nextLevel?.minPoints || 0) - currentPoints} XP to TERMINAL Upgrade
                                        </p>
                                        <span className="text-[9px] text-textMuted font-black uppercase tracking-widest italic opacity-40">Priority: ULTRA</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-center lg:items-end justify-between border-l-0 lg:border-l border-white/10 lg:pl-16">
                                <Award size={120} className="text-primary filter drop-shadow-[0_0_40px_rgba(245,196,0,0.6)] mb-12 animate-pulse-glow" />
                                <div className="text-center lg:text-right">
                                    <div className="text-6xl font-black text-white italic tracking-tighter leading-none mb-3">Top 5%</div>
                                    <div className="text-[11px] text-textMuted font-black uppercase tracking-[0.5em] italic">Global Performance Node</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Arena Sectors */}
                    <div className="space-y-12">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[11px] font-black text-white uppercase tracking-[0.6em] flex items-center gap-6 italic">
                                <Compass className="text-primary w-6 h-6 animate-spin-slow" /> Operational Sector Units
                            </h3>
                            <button className="text-[10px] font-black text-textMuted hover:text-primary transition-all uppercase tracking-widest italic border-b border-transparent hover:border-primary">View Global Grid</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {circles.map((c, i) => {
                                const isJoined = (stats.joinedCircles || []).includes(c.id);
                                return (
                                    <div key={c.id} className="premium-card p-10 group/card relative overflow-hidden transition-all duration-700 hover:scale-[1.03] active:scale-95 cursor-pointer bg-black/40 border-white/5 hover:border-primary/40 animate-fade-in"
                                        style={{ animationDelay: `${i * 0.1}s` }}
                                        onClick={() => isJoined ? navigate(`/fandom/${c.id}`) : handleJoin(c.id)}>

                                        <div className="absolute inset-x-0 h-[2px] bg-primary/20 animate-scan pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity" />

                                        <div className="flex items-center gap-10 relative z-10">
                                            <div className="w-28 h-28 rounded-[40px] bg-black border border-white/10 flex items-center justify-center text-5xl group-hover/card:bg-primary group-hover/card:text-black group-hover/card:border-transparent transition-all duration-500 shadow-2xl relative overflow-hidden">
                                                <div className="absolute inset-0 bg-primary/5 group-hover/card:opacity-100 opacity-0 transition-opacity" />
                                                <span className="relative z-10">{c.icon}</span>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-2 group-hover/card:text-primary transition-colors">{c.name} Sector</h4>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                                    <p className="text-[10px] text-textMuted font-black uppercase tracking-widest italic">{c.members.toLocaleString()} ACTIVE UNITS</p>
                                                </div>
                                            </div>
                                            <ChevronRight className={`text-textMuted transition-all w-8 h-8 ${isJoined ? 'group-hover/card:translate-x-3 group-hover/card:text-primary' : ''}`} />
                                        </div>

                                        {!isJoined && (
                                            <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-all z-20">
                                                <button className="bg-primary text-black text-[11px] uppercase font-black tracking-[0.3em] px-12 py-5 rounded-[40px] shadow-[0_0_50px_rgba(245,196,0,0.5)] scale-90 group-hover/card:scale-100 transition-all italic underline decoration-2 underline-offset-4">
                                                    Establish Connection
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                <div className="xl:col-span-4 flex flex-col gap-12">
                    {/* Intelligence Drops */}
                    <div className="premium-card p-12 space-y-12 bg-black/40 border-white/5 shadow-2xl animate-fade-in [animation-delay:0.4s]">
                        <div className="flex justify-between items-center border-b border-white/5 pb-6">
                            <h4 className="text-[11px] font-black text-white uppercase tracking-[0.5em] italic flex items-center gap-4">
                                <Radio className="w-6 h-6 text-red-600 animate-pulse" /> Intelligence Logs
                            </h4>
                            <div className="flex items-center gap-3">
                                <span className="text-[9px] text-textMuted font-black uppercase tracking-widest italic opacity-60">Real-time Feed</span>
                            </div>
                        </div>
                        <div className="space-y-8">
                            {highlights.slice(0, 5).map((vid, ix) => (
                                <div key={vid.id} className="group/vid flex gap-8 cursor-pointer items-center" onClick={() => setActiveVideo(vid.vidId)}>
                                    <div className="w-32 h-20 rounded-2xl overflow-hidden border border-white/10 relative flex-shrink-0 group-hover/vid:border-primary/60 transition-all shadow-xl">
                                        <img src={`https://img.youtube.com/vi/${vid.vidId}/mqdefault.jpg`} className="w-full h-full object-cover opacity-60 group-hover/vid:opacity-100 group-hover/vid:scale-110 transition-all duration-[1000ms]" alt="thumb" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-10 h-10 rounded-full bg-primary/20 backdrop-blur-md border border-primary/40 flex items-center justify-center text-white scale-0 group-hover/vid:scale-100 transition-transform">
                                                <Play size={20} fill="currentColor" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                                        <p className="text-[10px] text-primary font-black uppercase tracking-[0.3em] mb-2 italic">{vid.category}</p>
                                        <p className="text-lg font-black text-white italic tracking-tighter uppercase leading-[0.9] truncate group-hover/vid:text-primary transition-colors underline decoration-transparent group-hover/vid:decoration-primary/40 decoration-2 underline-offset-4">{vid.title}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full bg-white/5 hover:bg-white text-white hover:text-black py-6 rounded-[32px] text-[10px] font-black uppercase tracking-widest shadow-2xl transition-all italic border border-white/10 underline decoration-2 underline-offset-4">Synchronize Complete Log</button>
                    </div>

                    {/* Exclusive Protocol Shop */}
                    <div className="premium-card p-12 border-primary/20 bg-gradient-to-br from-primary/[0.05] to-transparent relative overflow-hidden group shadow-2xl animate-fade-in [animation-delay:0.6s]">
                        <div className="absolute -right-10 -top-10 text-white/5 rotate-12 opacity-0 group-hover:opacity-100 transition-opacity duration-[2000ms]"><ShoppingBag size={250} /></div>
                        <div className="flex justify-between items-center mb-12 relative z-10 italic">
                            <h4 className="text-[11px] font-black text-white uppercase tracking-[0.5em] italic">Vanguard Supply Drop</h4>
                            <Lock size={18} className="text-primary animate-pulse" />
                        </div>
                        <div className="space-y-10 relative z-10">
                            {[
                                { n: 'Vanguard Elite Jersey', p: '$140', c: 'V', desc: 'Gen-2 Stealth Fabric' },
                                { n: 'Alpha Match Protocol Ball', p: '$65', c: 'A', desc: 'Signal Integrated Ball' }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-8 items-center group/shop cursor-pointer">
                                    <div className="w-24 h-24 bg-black border border-white/10 rounded-[30px] flex items-center justify-center text-primary font-black text-4xl group-hover/shop:bg-primary group-hover/shop:text-black group-hover/shop:border-transparent transition-all duration-500 shadow-2xl relative overflow-hidden">
                                        <div className="absolute inset-0 bg-primary/5 group-hover/shop:opacity-100 opacity-0 transition-opacity" />
                                        <span className="relative z-10">{item.c}</span>
                                    </div>
                                    <div>
                                        <p className="text-white font-black uppercase italic tracking-tighter text-2xl group-hover/shop:text-primary transition-colors leading-none mb-2">{item.n}</p>
                                        <p className="text-[10px] text-textMuted uppercase tracking-widest italic mb-4">{item.desc}</p>
                                        <p className="text-primary font-black text-3xl italic tabular-nums leading-none tracking-tighter shadow-primary-glow">{item.p}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-12 bg-primary hover:bg-white text-black py-7 rounded-[32px] text-xs font-black uppercase tracking-[0.2em] shadow-[0_20px_60px_rgba(245,196,0,0.3)] active:scale-95 transition-all relative z-10 italic underline decoration-2 underline-offset-4">Access Supply Terminal</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Fandom;
