import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { Crown, Medal, TrendingUp } from 'lucide-react';

const TopFansWidget = () => {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(
            collection(db, 'users'),
            orderBy('xp', 'desc'),
            limit(3)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const list = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setLeaders(list);
            setLoading(false);
        }, (error) => {
            console.error('TopFansWidget error:', error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const formatXP = (xp) => {
        if (xp >= 1000) {
            return (xp / 1000).toFixed(1) + 'K';
        }
        return xp?.toString() || '0';
    };

    const getRankIcon = (index) => {
        if (index === 0) return <Crown className="w-3 h-3 text-yellow-400" />;
        if (index === 1) return <Medal className="w-3 h-3 text-gray-400" />;
        if (index === 2) return <Medal className="w-3 h-3 text-orange-400" />;
        return null;
    };

    if (loading) {
        return (
            <div className="premium-card p-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-primary" /> Top Fans
                </h4>
                <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex justify-between items-center">
                            <div className="h-3 w-20 bg-white/5 rounded animate-pulse" />
                            <div className="h-3 w-12 bg-white/5 rounded animate-pulse" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="premium-card p-4 glow-on-hover">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-primary" /> Top Fans
                <span className="ml-auto text-[8px] text-green-400 font-bold animate-pulse">● LIVE</span>
            </h4>
            <div className="space-y-1.5">
                {leaders.length > 0 ? (
                    leaders.map((fan, i) => (
                        <div key={fan.id} className="flex justify-between items-center text-[10px] group">
                            <span className="text-textMuted flex items-center gap-1">
                                {getRankIcon(i)}
                                <span className="group-hover:text-white transition-colors">{fan.name || 'Anonymous'}</span>
                            </span>
                            <span className="text-primary font-bold tabular-nums">{formatXP(fan.xp)} XP</span>
                        </div>
                    ))
                ) : (
                    <p className="text-[10px] text-textMuted">No fans yet. Be the first!</p>
                )}
            </div>
        </div>
    );
};

export default TopFansWidget;
