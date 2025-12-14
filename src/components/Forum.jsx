import React from 'react';
import { MessageSquare, ArrowBigUp, ArrowBigDown, Share } from 'lucide-react';
import '../styles/components/Forum.css';

const Forum = () => {
    const threads = [
        {
            id: 1,
            title: 'Tactical Analysis: Why the 4-3-3 is working for us',
            author: 'TacticsTim',
            upvotes: 245,
            comments: 56,
            tag: 'Analysis'
        },
        {
            id: 2,
            title: 'Match Thread: City Strikers vs Valley Vipers [Live]',
            author: 'ModTeam',
            upvotes: 1024,
            comments: 890,
            tag: 'Live Match',
            highlight: true
        },
        {
            id: 3,
            title: 'Unpopular Opinion: We need better defensive reserves',
            author: 'FanBoy99',
            upvotes: 12,
            comments: 34,
            tag: 'Discussion'
        }
    ];

    return (
        <div className="forum-container">
            <h2 className="section-title">Community Forum</h2>

            <div className="forum-layout">
                <div className="forum-main">
                    {threads.map(thread => (
                        <div key={thread.id} className={`thread-card ${thread.highlight ? 'highlight' : ''}`}>
                            <div className="vote-column">
                                <button className="btn-vote"><ArrowBigUp size={24} /></button>
                                <span className="vote-count">{thread.upvotes}</span>
                                <button className="btn-vote"><ArrowBigDown size={24} /></button>
                            </div>
                            <div className="thread-content">
                                <div className="thread-meta">
                                    <span className="thread-tag">{thread.tag}</span>
                                    <span className="thread-author">Posted by u/{thread.author}</span>
                                </div>
                                <h3 className="thread-title">{thread.title}</h3>
                                <div className="thread-actions">
                                    <button className="action-pill"><MessageSquare size={16} /> {thread.comments} Comments</button>
                                    <button className="action-pill"><Share size={16} /> Share</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="forum-sidebar">
                    <div className="sidebar-card">
                        <h3>Trending Topics</h3>
                        <ul>
                            <li>#CityStrikersWin</li>
                            <li>#GoldenBoot</li>
                            <li>#TransferNews</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Forum;
