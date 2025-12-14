import React from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import '../styles/components/Fandom.css';

const Fandom = () => {
    const posts = [
        {
            id: 1,
            user: 'Sarah_Fan123',
            avatar: 'S',
            time: '2m ago',
            content: 'Just met the captain! She is so inspiring! 💛🖤 #SameField #Victory',
            likes: 120,
            comments: 45,
            image: true
        },
        {
            id: 2,
            user: 'Coach_Mike',
            avatar: 'C',
            time: '1h ago',
            content: 'Great training session today. The team is ready for the finals.',
            likes: 850,
            comments: 120,
            image: false
        },
        {
            id: 3,
            user: 'GoldenGirl',
            avatar: 'G',
            time: '3h ago',
            content: 'Who else is coming to the stadium tomorrow? Let\'s paint it GOLD!',
            likes: 420,
            comments: 89,
            image: false
        },
        {
            id: 4,
            type: 'prediction',
            time: 'LIVE NOW',
            question: 'Will Sarah score a boundary in the next over?',
            options: ['Yes', 'No'],
            votes: 1542
        }
    ];

    return (
        <div className="fandom-container">
            <div className="fandom-header">
                <h2 className="section-title">Fan Zone</h2>
                <div className="artist-avatars">
                    {/* Mock artist circles like Weverse */}
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="artist-circle" style={{ backgroundImage: `linear-gradient(45deg, #333, #111)` }}></div>
                    ))}
                </div>
            </div>

            <div className="fandom-feed">
                {posts.map(post => (
                    post.type === 'prediction' ? (
                        <div key={post.id} className="fandom-card prediction-card">
                            <div className="pred-header">
                                <span className="live-badge">LIVE PREDICTION</span>
                                <span className="pred-votes">{post.votes} voted</span>
                            </div>
                            <h3 className="pred-question">{post.question}</h3>
                            <div className="pred-options">
                                {post.options.map(opt => (
                                    <button key={opt} className="btn-pred">{opt}</button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div key={post.id} className="fandom-card">
                            <div className="card-header">
                                <div className="user-info">
                                    <div className="user-avatar">{post.avatar}</div>
                                    <div>
                                        <div className="user-name">{post.user}</div>
                                        <div className="post-time">{post.time}</div>
                                    </div>
                                </div>
                                <button className="btn-more"><MoreHorizontal size={20} /></button>
                            </div>

                            <div className="card-content">
                                {post.content}
                            </div>
                            {post.image && <div className="card-image-placeholder"></div>}

                            <div className="card-actions">
                                <button className="action-btn"><Heart size={18} /> {post.likes}</button>
                                <button className="action-btn"><MessageCircle size={18} /> {post.comments}</button>
                                <button className="action-btn"><Share2 size={18} /></button>
                            </div>
                        </div>
                    )
                ))}
            </div>
        </div>
    );
};

export default Fandom;
