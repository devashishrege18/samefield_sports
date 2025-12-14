import React, { useState, useEffect } from 'react';
import { Award, Star, Users, CheckCircle, TrendingUp, Lock, Heart, MessageCircle, Share2, BarChart2, Send, Shuffle } from 'lucide-react';
import { fandomService } from '../services/FandomService';
import { predictionQuestions } from '../services/mockData';
import '../styles/components/Fandom.css';

const Fandom = () => {
    const [activeTab, setActiveTab] = useState('feed'); // 'feed' | 'dashboard'
    const [stats, setStats] = useState(fandomService.getUserStats());
    const [circles, setCircles] = useState(fandomService.getCircles());

    // Prediction State
    const [currentPredIndex, setCurrentPredIndex] = useState(0);
    const [predResult, setPredResult] = useState(null);

    // Post Creation State
    const [newPostContent, setNewPostContent] = useState('');
    const [localPosts, setLocalPosts] = useState([
        {
            id: 1,
            user: "SmritiFan_18",
            avatar: "https://ui-avatars.com/api/?name=Smriti+Fan&background=FFD700&color=000",
            content: "Queen of Cover Drives! Smriti Mandhana is looking in ominous touch today. Who else thinks a century is loading? 🏏🔥 #WPL2025 #RCB",
            image: null,
            likes: 2400,
            comments: 156,
            timestamp: "10 mins ago"
        },
        {
            id: 2,
            user: "WomenInSport",
            avatar: "https://ui-avatars.com/api/?name=WS&background=E91E63&color=FFF",
            content: "The growth of Women's Cricket in India is unreal. Sold out stadium for a Tuesday night game! 🙌 #Cricket",
            likes: 4500,
            comments: 340,
            timestamp: "45 mins ago"
        },
        {
            id: 3,
            user: "MumbaiIndians_W",
            avatar: "https://ui-avatars.com/api/?name=MI&background=004BA0&color=FFF",
            content: "Paltan! Who is your Player of the Match? Vote now! 👇",
            isPoll: true,
            pollOptions: [
                { label: "Harmanpreet Kaur", votes: "55%" },
                { label: "Nat Sciver-Brunt", votes: "30%" },
                { label: "Yastika Bhatia", votes: "15%" }
            ],
            likes: 6700,
            comments: 920,
            timestamp: "1 hour ago"
        },
        {
            id: 4,
            user: "HoopsQueen",
            avatar: "https://ui-avatars.com/api/?name=HQ&background=FF9800&color=FFF",
            content: "Caitlin Clark just broke another record! deep 3s all day. The WNBA is on fire right now. 🏀🔥 #WNBA",
            likes: 3200,
            comments: 210,
            timestamp: "2 hours ago"
        },
        {
            id: 5,
            user: "GlobalFootball",
            avatar: "https://ui-avatars.com/api/?name=GF&background=28a745&color=FFF",
            content: "Alexia Putellas is magic. That assist was world class. Barcelona Femeni looking unstoppable. ⚽",
            likes: 1500,
            comments: 89,
            timestamp: "4 hours ago"
        }
    ]);

    useEffect(() => {
        // Refresh stats periodically
        const interval = setInterval(() => {
            setStats({ ...fandomService.getUserStats() });
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleJoin = (id) => {
        const res = fandomService.joinCircle(id);
        if (res.success) {
            setStats({ ...fandomService.getUserStats() });
            alert(res.msg);
        } else {
            alert(res.msg);
        }
    };

    const handlePredict = (isYes) => {
        const res = fandomService.makePrediction(Math.random() > 0.4);
        setPredResult(res);
        setStats({ ...fandomService.getUserStats() });
        setTimeout(() => {
            setPredResult(null);
            refreshPrediction();
        }, 2500);
    };

    const refreshPrediction = () => {
        setCurrentPredIndex((prev) => (prev + 1) % predictionQuestions.length);
    };

    const handleCreatePost = () => {
        if (!newPostContent.trim()) return;

        const newPost = {
            id: Date.now(),
            user: "You",
            avatar: `https://ui-avatars.com/api/?name=You&background=FFD700&color=000`,
            content: newPostContent,
            likes: 0,
            comments: 0,
            timestamp: "Just now"
        };

        setLocalPosts([newPost, ...localPosts]);
        setNewPostContent('');
        fandomService.addPoints(10); // Reward for posting
        setStats({ ...fandomService.getUserStats() });
    };

    const nextLevel = fandomService.getNextLevel();
    const progressPercent = Math.min(100, (stats.points / nextLevel.minPoints) * 100);
    const currentQuestion = predictionQuestions[currentPredIndex];

    return (
        <div className="fandom-container">
            {/* Tab Navigation */}
            <div className="fandom-tabs">
                <button
                    className={`tab-btn ${activeTab === 'feed' ? 'active' : ''}`}
                    onClick={() => setActiveTab('feed')}
                >
                    Community Feed
                </button>
                <button
                    className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
                    onClick={() => setActiveTab('dashboard')}
                >
                    My Fandom (Circles)
                </button>
            </div>

            {activeTab === 'dashboard' && (
                <div className="fandom-dashboard fade-in">
                    {/* User Stats Card */}
                    <div className="stats-card user-profile-card">
                        <div className="profile-header">
                            <div className="avatar__large">
                                {stats.level.charAt(0)}
                            </div>
                            <div>
                                <h3>Devashish</h3>
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

            {activeTab === 'feed' && (
                <div className="fandom-feed fade-in">
                    <div className="feed-header">
                        <div className="create-post-box">
                            <textarea
                                placeholder="What's your take on today's games? Share your opinion..."
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
                        {/* Featured Fan Card */}
                        <div className="featured-fan-card">
                            <div className="fan-badge"><Star size={16} fill="gold" color="gold" /> Fan of the Week</div>
                            <div className="fan-info">
                                <img src="https://ui-avatars.com/api/?name=Sarah+K&background=FF4081&color=FFF" alt="fan" className="fan-avatar" />
                                <div className="fan-details">
                                    <h4>Sarah_CricketLover</h4>
                                    <p>Attended 5 matches this month!</p>
                                </div>
                                <button className="btn-follow">Follow</button>
                            </div>
                        </div>

                        {localPosts.map(post => (
                            <div key={post.id} className="feed-post">
                                <div className="post-header">
                                    <img src={post.avatar} alt={post.user} className="post-avatar" />
                                    <div>
                                        <h4 className="post-user">{post.user}</h4>
                                        <span className="post-time">{post.timestamp}</span>
                                    </div>
                                </div>
                                <p className="post-content">{post.content}</p>

                                {post.isPoll && (
                                    <div className="post-poll">
                                        {post.pollOptions.map((opt, i) => (
                                            <div key={i} className="poll-option">
                                                <span>{opt.label}</span>
                                                <div className="poll-bar-container">
                                                    <div className="poll-bar" style={{ width: opt.votes }}></div>
                                                    <span className="poll-percent">{opt.votes}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="post-actions">
                                    <button className="action-btn"><Heart size={18} /> {post.likes}</button>
                                    <button className="action-btn"><MessageCircle size={18} /> {post.comments}</button>
                                    <button className="action-btn"><Share2 size={18} /></button>
                                    <button className="action-btn"><BarChart2 size={18} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Fandom;
