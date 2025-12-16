import React, { useState, useEffect, useRef } from 'react';
import { Award, Star, Users, CheckCircle, TrendingUp, Lock, Heart, MessageCircle, Share2, BarChart2, Send, Shuffle, Radio, UserX, AlertCircle } from 'lucide-react';
import { fandomService } from '../services/FandomService';
import { predictionQuestions } from '../services/mockData';
import { io } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import '../styles/components/Fandom.css';

const SOCKET_URL = 'http://localhost:3001';

const Fandom = () => {
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
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [connectError, setConnectError] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');

    const messagesEndRef = useRef(null);

    // 1. Initialize Guest Identity & Socket
    useEffect(() => {
        // Guest Identity Logic
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

        // Fetch Posts (REST)
        fetchPosts();

        // Socket Connection
        const newSocket = io(SOCKET_URL, {
            query: identity,
            transports: ['websocket', 'polling']
        });

        newSocket.on('connect', () => {
            setIsConnected(true);
            setConnectError(null);
            console.log("Connected to Fan Room");
        });

        newSocket.on('connect_error', (err) => {
            console.error("Socket error:", err.message);
            // "Room full (Max 10 users)" error from server
            setConnectError(err.message);
            setIsConnected(false);
        });

        newSocket.on('disconnect', () => {
            setIsConnected(false);
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

        newSocket.on('receive_message', (msg) => {
            setChatMessages(prev => [...prev, msg]);
            scrollToBottom();
        });

        setSocket(newSocket);

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

        try {
            const res = await fetch(`${SOCKET_URL}/posts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    guest_id: guestIdentity.guest_id,
                    guest_name: guestIdentity.guest_name,
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
    const handleLike = async (postId) => {
        if (!guestIdentity) return;
        try {
            const res = await fetch(`${SOCKET_URL}/posts/${postId}/like`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ guest_id: guestIdentity.guest_id })
            });

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

        socket.emit('send_message', {
            guest_id: guestIdentity.guest_id,
            guest_name: guestIdentity.guest_name,
            text: chatInput
        });
        setChatInput('');
        // Optimistic append?
        // setChatMessages(prev => [...prev, { guest_name: guestIdentity.guest_name, text: chatInput, ... }])
    };

    // Existing Handlers
    const handleJoin = (id) => {
        const res = fandomService.joinCircle(id);
        if (res.success) {
            setStats({ ...fandomService.getUserStats() });
            alert(res.msg);
        } else { alert(res.msg); }
    };

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
                                })}
                                <div ref={messagesEndRef} />
                            </div>

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
                            </div>
                        </div>
                    </div>

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
                </div>
            )}
        </div>
    );
};

export default Fandom;
