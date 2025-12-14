import React, { useState, useEffect } from 'react';
import { Award, Star, Users, CheckCircle, TrendingUp, Lock } from 'lucide-react';
import { fandomService } from '../services/FandomService';
import '../styles/components/Fandom.css';

const Fandom = () => {
    const [stats, setStats] = useState(fandomService.getUserStats());
    const [circles, setCircles] = useState(fandomService.getCircles());
    const [activeTab, setActiveTab] = useState('circles'); // circles | predictions
    const [predResult, setPredResult] = useState(null);

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
            alert(res.msg); // Simple feedback for now
        } else {
            alert(res.msg);
        }
    };

    const handlePredict = (isHeads) => {
        const res = fandomService.makePrediction(Math.random() > 0.3); // 70% chance win for demo
        setPredResult(res);
        setStats({ ...fandomService.getUserStats() });
        setTimeout(() => setPredResult(null), 3000);
    };

    const nextLevel = fandomService.getNextLevel();
    const progressPercent = Math.min(100, (stats.points / nextLevel.minPoints) * 100);

    return (
        <div className="fandom-container">
            <div className="fandom-dashboard">
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

                {/* Prediction Widget (Interactivity Fix) */}
                <div className="stats-card prediction-widget">
                    <h3><TrendingUp size={16} /> Quick Prediction</h3>
                    <p className="pred-limit">Will Kohli score 50+ today?</p>

                    {predResult ? (
                        <div className={`pred-result ${predResult.result}`}>
                            {predResult.msg}
                        </div>
                    ) : (
                        <div className="pred-actions">
                            <button className="btn-pred yes" onClick={() => handlePredict(true)}>Yes (x2)</button>
                            <button className="btn-pred no" onClick={() => handlePredict(false)}>No (x1.5)</button>
                        </div>
                    )}
                    <div className="pred-stats">
                        <span>Won: {stats.predictions.correct}</span>
                        <span>Total: {stats.predictions.total}</span>
                    </div>
                </div>
            </div>

            {/* Main Content Areas */}
            <h2 className="section-title">Fandom Circles</h2>
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
    );
};

export default Fandom;
