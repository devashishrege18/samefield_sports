import React, { useState, useEffect, useRef } from 'react';
<<<<<<< HEAD
import { useParams, useNavigate } from 'react-router-dom';
import { Award, Star, Users, TrendingUp, Lock, Heart, MessageCircle, Share2, Send, Zap, ChevronRight, Globe, Image as ImageIcon, Play, X, Pin } from 'lucide-react';
=======
import { Award, Star, Users, CheckCircle, TrendingUp, Lock, Heart, MessageCircle, Share2, BarChart2, Send, Shuffle, Radio, UserX, AlertCircle } from 'lucide-react';
>>>>>>> a8252db (Done)
import { fandomService } from '../services/FandomService';
import { predictionQuestions } from '../services/mockData';
import { io } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import '../styles/components/Fandom.css';

const SOCKET_URL = 'http://localhost:3001';

const Fandom = () => {
<<<<<<< HEAD
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('feed');

    // Stats & Data
    const [stats, setStats] = useState(fandomService.getUserStats());
    const [circles, setCircles] = useState(fandomService.getCircles());

    // Active Highlights (Video Player)
    const [activeVideo, setActiveVideo] = useState(null);
    const highlights = [
        {
            id: 'video1',
            title: 'Gauff vs Qinwen Zheng – Full Match (Internazionali BNL d’Italia)',
            category: 'Tennis Highlights',
            vidId: '_Hlq_TaPoYw'
        },
        {
            id: 'video2',
            title: 'European Cross Country Championships – Dramatic Finishes',
            category: 'Athletics',
            vidId: 'pWUJL_tL7XI'
        },
        {
            id: 'video3',
            title: 'Para Athletics | Day 6 – World Championships (New Delhi 2025)',
            category: 'Para & Track',
            vidId: '2oRUNvazstM'
        },
        {
            id: 'video4',
            title: 'Men’s Senior Race Replay – European Cross Country Champs',
            category: 'Athletics',
            vidId: 'UhKSB946GA8'
        },
        {
            id: 'video5',
            title: 'Calvin Quek – 400m Hurdles (SEA Games 2025)',
            category: 'Track',
            vidId: 'I0p6JChHmFw'
        },
        {
            id: 'video6',
            title: 'Neymar VS Erling Haaland – Transformation / Comparison',
            category: 'Soccer',
            vidId: 'NsZ-BiPzmOw'
        },
        {
            id: 'video7',
            title: 'Neymar vs Haaland – Highlights & Moments',
            category: 'Soccer',
            vidId: 'zdmRGFrqdrg'
        }
    ];

    // Backend Identity & Data
    const [guestIdentity, setGuestIdentity] = useState(null);
    const [posts, setPosts] = useState([]);
    const [newPostContent, setNewPostContent] = useState('');
    const [expandedPost, setExpandedPost] = useState(null);
    const [commentInputs, setCommentInputs] = useState({});

    // Socket
=======
    // Nav State
    const [activeTab, setActiveTab] = useState('feed'); // 'feed' | 'dashboard' | 'chat'

    // Existing Fandom Stats State
    const [stats, setStats] = useState(fandomService.getUserStats());
    const [circles, setCircles] = useState(fandomService.getCircles());
    // Prediction State
    const [currentPredIndex, setCurrentPredIndex] = useState(0);
    const [predResult, setPredResult] = useState(null);

    // --- NEW: Backend Integration State ---
    const [guestIdentity, setGuestIdentity] = useState(null);
    const [posts, setPosts] = useState([]);
    const [newPostContent, setNewPostContent] = useState('');

    // Socket / Chat State
>>>>>>> a8252db (Done)
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [connectError, setConnectError] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
<<<<<<< HEAD
    const [floatingHearts, setFloatingHearts] = useState([]); // Array of {id, style}

    const messagesEndRef = useRef(null);

    // --- Effects (Identity, Socket, Posts) ---
    useEffect(() => {
=======

    const messagesEndRef = useRef(null);

    // 1. Initialize Guest Identity & Socket
    useEffect(() => {
        // Guest Identity Logic
>>>>>>> a8252db (Done)
        let storedId = localStorage.getItem('fandom_guest_id');
        let storedName = localStorage.getItem('fandom_guest_name');

        if (!storedId) {
            storedId = uuidv4();
            storedName = `Fan_${Math.floor(1000 + Math.random() * 9000)}`;
            localStorage.setItem('fandom_guest_id', storedId);
            localStorage.setItem('fandom_guest_name', storedName);
        }

        const identity = { guest_id: storedId, guest_name: storedName };
        setGuestIdentity(identity);

<<<<<<< HEAD
        const fandomScope = id ? `FANDOM_${id}` : 'GLOBAL_FAN_ROOM';
        fetchPosts(fandomScope);

        const newSocket = io(SOCKET_URL, {
            query: { ...identity, roomId: fandomScope },
=======
        // Fetch Posts (REST)
        fetchPosts();

        // Socket Connection
        const newSocket = io(SOCKET_URL, {
            query: identity,
>>>>>>> a8252db (Done)
            transports: ['websocket', 'polling']
        });

        newSocket.on('connect', () => {
            setIsConnected(true);
            setConnectError(null);
<<<<<<< HEAD
            newSocket.emit('join_room', { roomId: fandomScope, ...identity });
        });

        newSocket.on('connect_error', (err) => {
=======
            console.log("Connected to Fan Room");
        });

        newSocket.on('connect_error', (err) => {
            console.error("Socket error:", err.message);
            // "Room full (Max 10 users)" error from server
>>>>>>> a8252db (Done)
            setConnectError(err.message);
            setIsConnected(false);
        });

        newSocket.on('disconnect', () => {
            setIsConnected(false);
<<<<<<< HEAD
        });

        newSocket.on('update_users', setOnlineUsers);
=======
            // If kicked or server down
        });

        // Chat Events
        newSocket.on('update_users', (users) => {
            setOnlineUsers(users);
        });

        newSocket.on('user_joined', (user) => {
            addSystemMessage(`${user.guest_name} joined the room.`);
        });

        newSocket.on('user_left', (user) => {
            addSystemMessage(`${user.guest_name} left the room.`);
        });
>>>>>>> a8252db (Done)

        newSocket.on('receive_message', (msg) => {
            setChatMessages(prev => [...prev, msg]);
            scrollToBottom();
        });

        setSocket(newSocket);

<<<<<<< HEAD
        return () => newSocket.disconnect();
    }, [id]);

    const fetchPosts = async (scopeId) => {
        try {
            const res = await fetch(`${SOCKET_URL}/posts?fandomId=${scopeId}`);
            if (res.ok) setPosts(await res.json());
        } catch (err) { console.error("Failed to fetch posts", err); }
    };

    const scrollToBottom = () => {
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    };

    // --- Handlers ---
    const handleCreatePost = async () => {
        if (!newPostContent.trim() || !guestIdentity) return;
=======
        return () => {
            newSocket.disconnect();
        };
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await fetch(`${SOCKET_URL}/posts`);
            if (res.ok) {
                const data = await res.json();
                setPosts(data); // Replaces localPosts
            }
        } catch (err) {
            console.error("Failed to fetch posts", err);
        }
    };

    const addSystemMessage = (text) => {
        setChatMessages(prev => [...prev, {
            id: 'sys_' + Date.now(),
            type: 'system',
            text
        }]);
        scrollToBottom();
    };

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    // --- Action Handlers ---

    // Create Post
    const handleCreatePost = async () => {
        if (!newPostContent.trim() || !guestIdentity) return;

>>>>>>> a8252db (Done)
        try {
            const res = await fetch(`${SOCKET_URL}/posts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    guest_id: guestIdentity.guest_id,
                    guest_name: guestIdentity.guest_name,
<<<<<<< HEAD
                    content: newPostContent,
                    fandomId: id ? `FANDOM_${id}` : 'GLOBAL_FAN_ROOM'
                })
            });
            if (res.ok) {
                setPosts(await res.json());
                setNewPostContent('');
                fandomService.addPoints(10);
                setStats({ ...fandomService.getUserStats() });
            }
        } catch (err) { alert("Failed to post."); }
    };

=======
                    content: newPostContent
                })
            });

            if (res.ok) {
                const updatedFeed = await res.json();
                setPosts(updatedFeed);
                setNewPostContent('');
                fandomService.addPoints(10); // Gamification hook
                setStats({ ...fandomService.getUserStats() });
            }
        } catch (err) {
            alert("Failed to post. Server might be down.");
        }
    };

    // Like Post
>>>>>>> a8252db (Done)
    const handleLike = async (postId) => {
        if (!guestIdentity) return;
        try {
            const res = await fetch(`${SOCKET_URL}/posts/${postId}/like`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ guest_id: guestIdentity.guest_id })
            });
<<<<<<< HEAD
            if (res.ok) fetchPosts(id ? `FANDOM_${id}` : 'GLOBAL_FAN_ROOM');
        } catch (err) { console.error(err); }
    };

    const handleSendMessage = () => {
        if (!socket || !chatInput.trim()) return;
=======

            if (res.ok) {
                // Update local state optimsitically or re-fetch?
                // Response contains { id, likes: count, likedByMe }
                const data = await res.json();

                setPosts(prev => prev.map(p => {
                    if (p.id === postId) {
                        // We need to update the `likes` array structure to match what we expect
                        // Or just update the count if we transform it.
                        // The server returns `likes` typically as an array in the raw object, 
                        // but specifically for the `like` endpoint it returned `{ likes: count }` in my plan.
                        // Let's check server code: `res.json({ id: post.id, likes: post.likes.length, ... })`
                        // But my valid post object in `posts` has `likes` as ARRAY.
                        // UI expects `post.likes` to be a number typically?
                        // Old code: `post.likes` was a number.
                        // New Server: `post.likes` is Array.
                        // I should handle this mapping in the Render.

                        // For now, let's just trigger a re-fetch to be safe and lazy, or modify local.
                        return p;
                    }
                    return p;
                }));
                fetchPosts(); // Safest
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Send Chat
    const handleSendMessage = () => {
        if (!socket || !chatInput.trim()) return;

>>>>>>> a8252db (Done)
        socket.emit('send_message', {
            guest_id: guestIdentity.guest_id,
            guest_name: guestIdentity.guest_name,
            text: chatInput
        });
        setChatInput('');
<<<<<<< HEAD
    };

    const handleAddComment = async (postId) => {
        const text = commentInputs[postId];
        if (!text || !text.trim() || !guestIdentity) return;
        try {
            const res = await fetch(`${SOCKET_URL}/posts/${postId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    guest_id: guestIdentity.guest_id,
                    guest_name: guestIdentity.guest_name,
                    text: text.trim()
                })
            });
            if (res.ok) {
                setCommentInputs(prev => ({ ...prev, [postId]: '' }));
                fetchPosts(id ? `FANDOM_${id}` : 'GLOBAL_FAN_ROOM');
            }
        } catch (err) { console.error(err); }
    };

=======
        // Optimistic append?
        // setChatMessages(prev => [...prev, { guest_name: guestIdentity.guest_name, text: chatInput, ... }])
    };

    // Existing Handlers
>>>>>>> a8252db (Done)
    const handleJoin = (id) => {
        const res = fandomService.joinCircle(id);
        if (res.success) {
            setStats({ ...fandomService.getUserStats() });
            alert(res.msg);
        } else { alert(res.msg); }
    };

<<<<<<< HEAD
    const handleFloatingHeart = () => {
        const newHeart = {
            id: Date.now(),
            style: {
                left: `${50 + (Math.random() * 40 - 20)}%`, // Random horizontal
                animationDuration: `${1.5 + Math.random()}s`,
                transform: `rotate(${Math.random() * 40 - 20}deg)`
            }
        };
        setFloatingHearts(prev => [...prev, newHeart]);

        // Cleanup
        setTimeout(() => {
            setFloatingHearts(prev => prev.filter(h => h.id !== newHeart.id));
        }, 2500);
    };

    const getColorFromInitials = (name) => {
        const colors = ['bg-pink-500', 'bg-purple-500', 'bg-indigo-500', 'bg-blue-500', 'bg-teal-500', 'bg-orange-500'];
        let hash = 0;
        for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
        return colors[Math.abs(hash) % colors.length];
    };

    if (!guestIdentity) return <div className="text-white p-10">Initializing Fan ID...</div>;

    const currentCircle = circles.find(c => c.id === id);
    const nextLevel = fandomService.getNextLevel();
    const progressPercent = Math.min(100, (stats.points / nextLevel.minPoints) * 100);

    // ============================================
    // WEVERSE-INSPIRED CHANNEL VIEW
    // ============================================
    if (id) {
        return (
            <div className="min-h-screen bg-black text-white relative">
                {/* Hero Banner */}
                <div className="relative h-64 w-full overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/90 z-10"></div>
                    {/* Dynamic Banner Gradient based on Circle ID */}
                    <div className={`w-full h-full bg-gradient-to-r ${id === 'c1' ? 'from-blue-900 to-purple-900' : id === 'c2' ? 'from-green-900 to-teal-900' : 'from-gray-900 to-gray-800'}`}></div>

                    <div className="absolute bottom-0 left-0 w-full p-6 z-20 flex items-end justify-between">
                        <div className="flex items-end gap-6">
                            <div className="w-24 h-24 rounded-2xl bg-surface border-4 border-black shadow-2xl flex items-center justify-center text-4xl shadow-primary/20">
                                {currentCircle?.icon}
                            </div>
                            <div className="pb-2">
                                <h1 className="text-4xl font-black text-white tracking-tight mb-1">{currentCircle?.name || 'Fandom Channel'}</h1>
                                <p className="text-sm font-bold text-gray-400 flex items-center gap-2">
                                    <Users size={14} className="text-primary" /> {currentCircle?.members?.toLocaleString() || '1.2M'} Members
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/fandom')}
                            className="bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold transition-all mb-2"
                        >
                            Exit Fandom
                        </button>
                    </div>
                </div>

                {/* Sticky Navigation Tabs */}
                <div className="sticky top-0 z-50 bg-black/95 backdrop-blur-xl border-b border-gray-800 px-6">
                    <div className="flex gap-8">
                        <button
                            onClick={() => setActiveTab('feed')}
                            className={`py-4 text-sm font-bold uppercase tracking-wider border-b-2 transition-all ${activeTab === 'feed' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-white'
                                }`}
                        >
                            Feed
                        </button>
                        <button
                            onClick={() => setActiveTab('chat')}
                            className={`py-4 text-sm font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${activeTab === 'chat' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-white'
                                }`}
                        >
                            Hub
                            {isConnected && onlineUsers.length > 0 && (
                                <span className="bg-primary text-black text-[10px] px-1.5 rounded-full animate-pulse">ON</span>
                            )}
                        </button>
                        <button className="py-4 text-sm font-bold uppercase tracking-wider border-b-2 border-transparent text-gray-400 hover:text-white opacity-50 cursor-not-allowed">
                            Media
                        </button>
                        <button className="py-4 text-sm font-bold uppercase tracking-wider border-b-2 border-transparent text-gray-400 hover:text-white opacity-50 cursor-not-allowed">
                            Shop
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="max-w-4xl mx-auto p-6 min-h-[600px]">

                    {/* FEED VIEW */}
                    {activeTab === 'feed' && (
                        <div className="fade-in">
                            {/* Write Post (Weverse Style Input) */}
                            <div className="bg-surface rounded-2xl p-4 mb-8 border border-white/5 shadow-lg focus-within:border-primary/50 transition-colors">
                                <textarea
                                    className="w-full bg-transparent text-white text-lg placeholder-gray-500 resize-none outline-none mb-4"
                                    rows="2"
                                    placeholder="Write a message to the community..."
                                    value={newPostContent}
                                    onChange={(e) => setNewPostContent(e.target.value)}
                                ></textarea>
                                <div className="flex justify-between items-center px-2">
                                    <button className="text-gray-400 hover:text-primary transition-colors">
                                        <ImageIcon size={20} />
                                    </button>
                                    <button
                                        onClick={handleCreatePost}
                                        className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${newPostContent.trim() ? 'bg-primary text-black hover:scale-105' : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                            }`}
                                    >
                                        Post
                                    </button>
                                </div>
                            </div>

                            {/* Posts Stream */}
                            <div className="space-y-6">
                                {posts.map(post => {
                                    const likeCount = Array.isArray(post.likes) ? post.likes.length : 0;
                                    const isLiked = Array.isArray(post.likes) && post.likes.includes(guestIdentity.guest_id);

                                    return (
                                        <div key={post.id} className="bg-surface rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-colors shadow-lg">

                                            {/* Post Header */}
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm ${getColorFromInitials(post.author_name)}`}>
                                                    {post.author_name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-white text-sm">{post.author_name}</h4>
                                                    <p className="text-xs text-gray-500">{new Date(post.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                </div>
                                            </div>

                                            {/* Post Content */}
                                            <div className="pl-14 mb-4">
                                                <p className="text-gray-200 text-base leading-relaxed whitespace-pre-wrap">{post.content}</p>
                                            </div>

                                            {/* Post Actions */}
                                            <div className="pl-14 flex items-center gap-6 border-t border-white/5 pt-4">
                                                <button
                                                    onClick={() => handleLike(post.id)}
                                                    className={`flex items-center gap-2 text-sm font-medium transition-colors ${isLiked ? 'text-pink-500' : 'text-gray-400 hover:text-pink-500'}`}
                                                >
                                                    <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
                                                    {likeCount > 0 && <span>{likeCount}</span>}
                                                </button>
                                                <button
                                                    onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                                                    className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-primary transition-colors"
                                                >
                                                    <MessageCircle size={18} />
                                                    {post.comments?.length > 0 && <span>{post.comments.length}</span>}
                                                </button>
                                                <button className="text-gray-400 hover:text-white transition-colors">
                                                    <Share2 size={18} />
                                                </button>
                                            </div>

                                            {/* Comments Expansion */}
                                            {expandedPost === post.id && (
                                                <div className="mt-6 pl-14 animate-in slide-in-from-top-2 duration-200">
                                                    <div className="bg-black/40 rounded-xl p-4 space-y-4">
                                                        {post.comments?.map(c => (
                                                            <div key={c.id} className="flex gap-3 text-sm">
                                                                <span className="font-bold text-gray-400">{c.author_name}</span>
                                                                <span className="text-gray-300">{c.text}</span>
                                                            </div>
                                                        ))}
                                                        <div className="flex gap-2 pt-2">
                                                            <input
                                                                type="text"
                                                                placeholder="Add a comment..."
                                                                className="flex-1 bg-transparent border-b border-gray-700 focus:border-primary outline-none text-sm py-1 text-white"
                                                                value={commentInputs[post.id] || ''}
                                                                onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                                                                onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                                                            />
                                                            <button onClick={() => handleAddComment(post.id)} className="text-primary hover:text-white">
                                                                <Send size={14} />
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
                    )}

                    {/* HUB (Community Chat) - VISUAL OVERHAUL */}
                    {activeTab === 'chat' && (
                        <div className="fade-in relative h-[75vh] w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col group">

                            {/* Dynamic Background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-purple-900/40 to-black z-0"></div>
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 z-0"></div>

                            {/* Pinned Message */}
                            <div className="relative z-10 bg-white/5 backdrop-blur-xl border-b border-white/10 p-3 flex items-center gap-3">
                                <div className="bg-primary/20 p-2 rounded-lg text-primary">
                                    <Pin size={16} fill="currentColor" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-primary uppercase tracking-wider mb-0.5">Announcement</p>
                                    <p className="text-xs text-white">Welcome to the Official Fan Hub! Connect, share, and respect the community guidelines. 🏟️✨</p>
                                </div>
                            </div>

                            {/* Live Header */}
                            <div className="relative z-10 px-6 py-4 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse border-2 border-black"></div>
                                        <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75"></div>
                                    </div>
                                    <span className="font-black text-white text-lg tracking-tight drop-shadow-lg">COMMUNITY CHAT</span>
                                </div>
                                <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5">
                                    <Users size={12} className="text-gray-400" />
                                    <span className="text-xs font-bold text-gray-200">{onlineUsers.length} ONLINE</span>
                                </div>
                            </div>

                            {/* Chat Area */}
                            <div className="relative z-10 flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar mask-image-gradient">
                                {chatMessages.map((msg, i) => {
                                    const isMe = msg.guest_id === guestIdentity.guest_id;
                                    return (
                                        <div key={i} className={`flex items-end gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                            {/* Avatar */}
                                            {!isMe && (
                                                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white shadow-lg ${getColorFromInitials(msg.guest_name)}`}>
                                                    {msg.guest_name.charAt(0)}
                                                </div>
                                            )}

                                            <div className={`max-w-[70%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                                {!isMe && <span className="text-[10px] text-gray-400 font-bold ml-1 mb-1">{msg.guest_name}</span>}
                                                <div className={`px-4 py-2.5 rounded-2xl backdrop-blur-md text-sm leading-relaxed shadow-sm ${isMe ? 'bg-primary/90 text-black font-medium rounded-br-none'
                                                        : 'bg-white/10 text-white border border-white/5 rounded-bl-none hover:bg-white/15 transition-colors'
                                                    }`}>
                                                    {msg.text}
                                                </div>
                                            </div>
                                        </div>
                                    )
=======
    const handlePredict = (isYes) => { /* Same as before */
        const res = fandomService.makePrediction(Math.random() > 0.4);
        setPredResult(res);
        setStats({ ...fandomService.getUserStats() });
        setTimeout(() => { setPredResult(null); refreshPrediction(); }, 2500);
    };
    const refreshPrediction = () => { setCurrentPredIndex((prev) => (prev + 1) % predictionQuestions.length); };
    const nextLevel = fandomService.getNextLevel();
    const progressPercent = Math.min(100, (stats.points / nextLevel.minPoints) * 100);
    const currentQuestion = predictionQuestions[currentPredIndex];


    if (!guestIdentity) return <div>Loading Identity...</div>;

    return (
        <div className="fandom-container">
            {/* Identity Banner */}
            <div className="guest-banner">
                <span>Playing as: <strong>{guestIdentity.guest_name}</strong></span>
                <span className={`status-dot ${isConnected ? 'online' : 'offline'}`}></span>
            </div>

            {connectError && (
                <div className="error-banner">
                    <AlertCircle size={16} />
                    {connectError === "xhr poll error" ? "Connection failed" : connectError}
                </div>
            )}

            {/* Tab Navigation */}
            <div className="fandom-tabs">
                <button
                    className={`tab-btn ${activeTab === 'feed' ? 'active' : ''}`}
                    onClick={() => setActiveTab('feed')}
                >
                    <TrendingUp size={16} /> Community Feed
                </button>
                <button
                    className={`tab-btn ${activeTab === 'chat' ? 'active' : ''}`}
                    onClick={() => setActiveTab('chat')}
                >
                    <MessageCircle size={16} /> Fan Room ({isConnected ? onlineUsers.length : 0})
                </button>
                <button
                    className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
                    onClick={() => setActiveTab('dashboard')}
                >
                    <Star size={16} /> My Fandom
                </button>
            </div>

            {/* --- FEED TAB --- */}
            {activeTab === 'feed' && (
                <div className="fandom-feed fade-in">
                    <div className="feed-header">
                        <div className="create-post-box">
                            <textarea
                                placeholder={`What's on your mind, ${guestIdentity.guest_name}?`}
                                value={newPostContent}
                                onChange={(e) => setNewPostContent(e.target.value)}
                            ></textarea>
                            <div className="create-post-actions">
                                <button className="btn-post" onClick={handleCreatePost}>
                                    <Send size={14} /> Post
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="posts-container">
                        {posts.length === 0 && <div className="empty-state">No posts yet. Be the first!</div>}
                        {posts.map(post => {
                            // Handle Like Count (Array vs Number)
                            const likeCount = Array.isArray(post.likes) ? post.likes.length : 0;
                            const isLiked = Array.isArray(post.likes) && post.likes.includes(guestIdentity.guest_id);

                            return (
                                <div key={post.id} className="feed-post">
                                    <div className="post-header">
                                        <div className="post-avatar-placeholder">
                                            {post.author_name ? post.author_name.charAt(0) : '?'}
                                        </div>
                                        <div>
                                            <h4 className="post-user">{post.author_name}</h4>
                                            <span className="post-time">{new Date(post.created_at).toLocaleTimeString()}</span>
                                        </div>
                                    </div>
                                    <p className="post-content">{post.content}</p>

                                    <div className="post-actions">
                                        <button
                                            className={`action-btn ${isLiked ? 'liked' : ''}`}
                                            onClick={() => handleLike(post.id)}
                                        >
                                            <Heart size={18} fill={isLiked ? "red" : "none"} color={isLiked ? "red" : "currentColor"} />
                                            {likeCount}
                                        </button>
                                        <button className="action-btn"><Share2 size={18} /></button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* --- CHAT TAB (FAN ROOM) --- */}
            {activeTab === 'chat' && (
                <div className="fan-room-container fade-in">
                    {!isConnected ? (
                        <div className="room-locked">
                            <Lock size={48} />
                            <h3>{connectError || "Connecting to Fan Room..."}</h3>
                            <p>Only 10 fans allowed at a time.</p>
                        </div>
                    ) : (
                        <>
                            <div className="chat-header">
                                <div className="live-indicator">
                                    <span className="dot"></span> LIVE
                                </div>
                                <span>{onlineUsers.length} Fans Online</span>
                            </div>

                            <div className="chat-messages">
                                {chatMessages.map((msg, idx) => {
                                    if (msg.type === 'system') {
                                        return <div key={idx} className="sys-msg">{msg.text}</div>
                                    }
                                    const isMe = msg.guest_id === guestIdentity.guest_id;
                                    return (
                                        <div key={idx} className={`chat-bubble ${isMe ? 'me' : 'them'}`}>
                                            {!isMe && <span className="chat-user">{msg.guest_name}</span>}
                                            <div className="chat-text">{msg.text}</div>
                                        </div>
                                    );
>>>>>>> a8252db (Done)
                                })}
                                <div ref={messagesEndRef} />
                            </div>

<<<<<<< HEAD
                            {/* Floating Hearts Area (Overlay) */}
                            <div className="absolute bottom-20 right-6 pointer-events-none z-20 w-20 h-64 overflow-hidden">
                                {floatingHearts.map(h => (
                                    <div
                                        key={h.id}
                                        className="absolute bottom-0 text-pink-500 animate-float-up"
                                        style={h.style}
                                    >
                                        <Heart fill="currentColor" size={24} />
                                    </div>
                                ))}
                            </div>

                            {/* Input Area */}
                            <div className="relative z-30 p-4 bg-black/60 backdrop-blur-xl border-t border-white/10">
                                <div className="flex gap-3 items-center">
                                    {/* Floating Heart Button */}
                                    <button
                                        onClick={handleFloatingHeart}
                                        className="w-10 h-10 rounded-full bg-white/5 hover:bg-pink-500/20 text-gray-400 hover:text-pink-500 flex items-center justify-center transition-all active:scale-95 border border-white/5"
                                    >
                                        <Heart size={20} />
                                    </button>

                                    <div className="flex-1 bg-surface/50 rounded-full p-1 pl-4 flex items-center border border-white/10 focus-within:border-primary/50 transition-colors">
                                        <input
                                            type="text"
                                            className="flex-1 bg-transparent outline-none text-sm text-white placeholder-gray-500"
                                            placeholder="Say something nice..."
                                            value={chatInput}
                                            onChange={(e) => setChatInput(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                        />
                                        <button
                                            onClick={handleSendMessage}
                                            disabled={!isConnected}
                                            className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-black hover:scale-105 transition-transform shadow-lg shadow-primary/20"
                                        >
                                            <Send size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // ... (Lobby view logic unchanged) ...
    // ============================================
    // PREMIUM LOBBY VIEW
    // ============================================
    return (
        <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-2">My Fandom</h1>
                    <p className="text-gray-400 font-medium">Welcome back, <span className="text-primary">{guestIdentity.guest_name}</span></p>
                </div>
                <div className="flex items-center gap-2 bg-surface px-4 py-2 rounded-full border border-white/10">
                    <Globe size={16} className="text-primary" />
                    <span className="text-xs font-bold text-white">GLOBAL RANK #42</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* LEFT COL (8) */}
                <div className="lg:col-span-8 space-y-8">

                    {/* Hero Stats Card */}
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 to-black border border-white/10 p-8 shadow-2xl">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                        <div className="relative z-10 flex justify-between items-start">
                            <div className="space-y-6">
                                <div>
                                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Current Level</p>
                                    <h2 className="text-5xl font-black text-white tracking-tight">{stats.level}</h2>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold text-gray-500 w-64">
                                        <span>Progress</span>
                                        <span>{stats.points} / {nextLevel.minPoints} XP</span>
                                    </div>
                                    <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
                                    </div>
                                    <p className="text-xs text-primary font-bold pt-1">
                                        {nextLevel.minPoints - stats.points} XP needed for {nextLevel.name}
                                    </p>
                                </div>
                            </div>

                            <div className="text-right space-y-1">
                                <Award size={48} className="text-primary ml-auto mb-2" />
                                <div className="text-2xl font-bold text-white">Top 5%</div>
                                <div className="text-xs text-gray-500 uppercase font-bold">Of All Fans</div>
=======
                            <div className="chat-input-area">
                                <input
                                    type="text"
                                    placeholder="Say something..."
                                    value={chatInput}
                                    onChange={e => setChatInput(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                                />
                                <button className="btn-send-chat" onClick={handleSendMessage}>
                                    <Send size={18} />
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* --- DASHBOARD TAB (Old) --- */}
            {activeTab === 'dashboard' && (
                <div className="fandom-dashboard fade-in">
                    {/* User Stats Card */}
                    <div className="stats-card user-profile-card">
                        <div className="profile-header">
                            <div className="avatar__large">
                                {stats.level.charAt(0)}
                            </div>
                            <div>
                                <h3>{guestIdentity.guest_name}</h3>
                                <span className="badge-level">{stats.level}</span>
                            </div>
                        </div>
                        <div className="stats-row">
                            <div className="stat">
                                <span className="label">Reputation</span>
                                <span className="value">{stats.reputation}</span>
                            </div>
                            <div className="stat">
                                <span className="label">Points</span>
                                <span className="value">{stats.points}</span>
                            </div>
                        </div>

                        <div className="level-progress">
                            <div className="progress-info">
                                <span>Next: {nextLevel.name}</span>
                                <span>{stats.points} / {nextLevel.minPoints}</span>
                            </div>
                            <div className="progress-bar">
                                <div className="fill" style={{ width: `${progressPercent}%` }}></div>
>>>>>>> a8252db (Done)
                            </div>
                        </div>
                    </div>

<<<<<<< HEAD
                    {/* Active Circles (Better Grid) */}
                    <div>
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Users className="text-primary" /> Active Communities
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {circles.map(c => {
                                const isJoined = stats.joinedCircles.includes(c.id);
                                return (
                                    <div key={c.id} className="group relative bg-surface hover:bg-white/5 border border-white/5 p-5 rounded-2xl transition-all hover:scale-[1.01] cursor-pointer"
                                        onClick={() => isJoined ? navigate(`/fandom/${c.id}`) : handleJoin(c.id)}>
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-xl bg-gray-800 flex items-center justify-center text-2xl group-hover:bg-primary group-hover:text-black transition-colors shadow-lg">
                                                {c.icon}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-lg font-bold text-white">{c.name}</h4>
                                                <p className="text-xs text-gray-500 font-medium">{c.members} Members</p>
                                            </div>
                                            <ChevronRight className={`text-gray-600 transition-transform ${isJoined ? 'group-hover:translate-x-1 group-hover:text-primary' : ''}`} />
                                        </div>
                                        {!isJoined && (
                                            <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="bg-white text-black font-bold px-6 py-2 rounded-full transform scale-90 group-hover:scale-100 transition-transform">
                                                    Join Circle
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                </div>

                {/* RIGHT COL (4) */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Active Highlights & Video Player */}
                    <div className="bg-surface border border-white/5 p-6 rounded-3xl">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-bold text-white text-sm uppercase tracking-widest">Active Highlights</h4>
                            <span className="text-primary text-xs font-bold animate-pulse">● LIVE UPDATE</span>
                        </div>
                        <div className="space-y-3">
                            {highlights.map(vid => (
                                <div
                                    key={vid.id}
                                    className="group flex gap-3 p-3 rounded-xl hover:bg-white/5 transition-all cursor-pointer border border-transparent hover:border-white/10"
                                    onClick={() => setActiveVideo(vid.vidId)}
                                >
                                    <div className="w-16 h-12 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0 relative overflow-hidden group-hover:ring-2 ring-primary transition-all">
                                        <img src={`https://img.youtube.com/vi/${vid.vidId}/mqdefault.jpg`} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="thumb" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-6 h-6 rounded-full bg-black/50 backdrop-blur flex items-center justify-center">
                                                <Play size={10} fill="white" className="text-white ml-0.5" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] text-primary font-bold uppercase mb-0.5">{vid.category}</p>
                                        <p className="text-xs font-bold text-gray-200 line-clamp-2 leading-tight group-hover:text-white transition-colors">{vid.title}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Member Drop (Shop) */}
                    <div className="bg-surface border border-white/5 p-6 rounded-3xl">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-bold text-white text-sm uppercase tracking-widest">Exclusive Drops</h4>
                            <Lock size={14} className="text-gray-500" />
                        </div>
                        <div className="space-y-4">
                            <div className="flex gap-4 items-center group cursor-pointer">
                                <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center text-black font-black text-xs p-2 text-center leading-none">
                                    GOLD JERSEY
                                </div>
                                <div>
                                    <p className="text-white font-bold group-hover:text-primary transition-colors">Signed Jersey</p>
                                    <p className="text-primary font-bold text-sm">$120.00</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-center group cursor-pointer">
                                <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center text-black font-black text-xs p-2 text-center leading-none">
                                    MATCH BALL
                                </div>
                                <div>
                                    <p className="text-white font-bold group-hover:text-primary transition-colors">Official Ball</p>
                                    <p className="text-primary font-bold text-sm">$45.00</p>
                                </div>
                            </div>
                        </div>
                        <button className="w-full mt-6 py-3 border border-white/10 rounded-xl text-xs font-bold text-gray-400 hover:bg-white hover:text-black transition-all">
                            VISIT STORE
                        </button>
                    </div>
                </div>

            </div>
            {/* Video Modal Overlay */}
            {activeVideo && (
                <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-black border border-white/10 rounded-3xl overflow-hidden w-full max-w-4xl shadow-2xl relative">
                        <button
                            onClick={() => setActiveVideo(null)}
                            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 hover:bg-white/20 flex items-center justify-center text-white transition-all backdrop-blur-md"
                        >
                            <X size={20} />
                        </button>
                        <div className="aspect-video w-full">
                            <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1`}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
=======
                    {/* Prediction Widget (Multi-Sport) */}
                    <div className="stats-card prediction-widget">
                        <div className="pred-header">
                            <h3><TrendingUp size={16} /> Quick Prediction</h3>
                            <button className="btn-shuffle" onClick={refreshPrediction}><Shuffle size={14} /></button>
                        </div>

                        <span className="pred-sport-tag">{currentQuestion.sport}</span>
                        <p className="pred-limit">{currentQuestion.q}</p>

                        {predResult ? (
                            <div className={`pred-result ${predResult.result}`}>
                                {predResult.msg}
                            </div>
                        ) : (
                            <div className="pred-actions">
                                <button className="btn-pred yes" onClick={() => handlePredict(true)}>
                                    Yes (x{currentQuestion.multiplier})
                                </button>
                                <button className="btn-pred no" onClick={() => handlePredict(false)}>
                                    No (x1.2)
                                </button>
                            </div>
                        )}
                        <div className="pred-stats">
                            <span>Won: {stats.predictions.correct}</span>
                            <span>Total: {stats.predictions.total}</span>
                        </div>
                    </div>

                    {/* Circles Grid */}
                    <div className="circles-section">
                        <h2 className="section-title">Verified Circles</h2>
                        <div className="circles-grid">
                            {circles.map(circle => {
                                const isMember = stats.joinedCircles.includes(circle.id);
                                const canJoin = stats.reputation >= circle.reqReputation;

                                return (
                                    <div key={circle.id} className={`circle-card ${isMember ? 'member' : ''}`}>
                                        <div className="circle-icon">{circle.icon}</div>
                                        <div className="circle-info">
                                            <h3>{circle.name}</h3>
                                            <p>{circle.type} Circle • {circle.members.toLocaleString()} Fans</p>

                                            {!isMember && (
                                                <div className="req-badge">
                                                    {canJoin ? <CheckCircle size={12} /> : <Lock size={12} />}
                                                    Req Rep: {circle.reqReputation}
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            className={`btn-join ${isMember ? 'joined' : ''}`}
                                            onClick={() => handleJoin(circle.id)}
                                            disabled={isMember || !canJoin}
                                        >
                                            {isMember ? 'Joined' : canJoin ? 'Join Circle' : 'Locked'}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
>>>>>>> a8252db (Done)
                </div>
            )}
        </div>
    );
};

export default Fandom;
