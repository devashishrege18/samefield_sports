import React from 'react';
import { Trophy, TrendingUp, Activity, Star, Shield, Zap, Award, Target } from 'lucide-react';

const KID = () => {
    // This would come from actual athlete data/context
    const athleteStats = {
        name: 'Harmanpreet Kaur',
        nickname: 'The Boss Lady',
        id: 'KID-IND-W01',
        sport: 'Cricket',
        tier: 'Diamond', // Bronze, Silver, Gold, Platinum, Diamond
        overallRating: 92,
        attributes: {
            batting: 94,
            fitness: 90,
            technique: 93,
            consistency: 89,
            leadership: 96
        },
        achievements: ['ODI World Cup 2025 🏆', 'Asia Cup Champion', 'WPL Champion']
    };

    const getTierColor = (tier) => {
        const colors = {
            'Bronze': 'from-amber-700 to-amber-900',
            'Silver': 'from-gray-300 to-gray-500',
            'Gold': 'from-yellow-400 to-yellow-600',
            'Platinum': 'from-cyan-300 to-cyan-600',
            'Diamond': 'from-blue-400 via-purple-400 to-pink-400'
        };
        return colors[tier] || colors['Gold'];
    };

    const getTierBorder = (tier) => {
        const borders = {
            'Bronze': 'border-amber-700',
            'Silver': 'border-gray-400',
            'Gold': 'border-primary',
            'Platinum': 'border-cyan-400',
            'Diamond': 'border-purple-400'
        };
        return borders[tier] || borders['Gold'];
    };

    const leaderboard = [
        { rank: 1, name: 'Harmanpreet Kaur', points: 9420, trend: 'up', avatar: 'HK' },
        { rank: 2, name: 'Smriti Mandhana', points: 9280, trend: 'up', avatar: 'SM' },
        { rank: 3, name: 'Shafali Verma', points: 8950, trend: 'up', avatar: 'SV' },
        { rank: 4, name: 'Deepti Sharma', points: 8720, trend: 'same', avatar: 'DS' },
        { rank: 5, name: 'Jemimah Rodrigues', points: 8650, trend: 'up', avatar: 'JR' },
    ];

    return (
        <div className="space-y-8">
            {/* Section Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight">Khelo ID Card</h2>
                    <p className="text-sm text-textMuted">Your verified athlete identity & performance metrics</p>
                </div>
                <button className="px-4 py-2 bg-surfaceHighlight text-white text-xs font-bold uppercase rounded-lg hover:bg-primary hover:text-black transition-colors">
                    Share Card
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Premium KID Card */}
                <div className="lg:col-span-1">
                    <div className={`relative overflow-hidden rounded-2xl border-2 ${getTierBorder(athleteStats.tier)} bg-gradient-to-br from-black via-gray-900 to-black p-6 group`}>
                        {/* Holographic shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                        {/* Card Header */}
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-7 bg-gradient-to-r from-yellow-500 via-yellow-300 to-yellow-500 rounded opacity-80" />
                                <span className={`text-xs font-black uppercase px-2 py-0.5 rounded bg-gradient-to-r ${getTierColor(athleteStats.tier)} text-black`}>
                                    {athleteStats.tier}
                                </span>
                            </div>
                            <div className="text-right">
                                <span className="text-primary font-black text-lg">SF</span>
                                <p className="text-[8px] text-textMuted uppercase">Samefield</p>
                            </div>
                        </div>

                        {/* Avatar */}
                        <div className="flex justify-center mb-4">
                            <div className={`w-28 h-28 rounded-full border-4 ${getTierBorder(athleteStats.tier)} bg-gradient-to-br from-surfaceHighlight to-black flex items-center justify-center relative`}>
                                <img
                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${athleteStats.name}`}
                                    alt={athleteStats.name}
                                    className="w-full h-full rounded-full"
                                />
                                <div className="absolute -bottom-1 -right-1 bg-primary text-black p-1.5 rounded-full border-2 border-black">
                                    <Shield className="w-3 h-3" />
                                </div>
                            </div>
                        </div>

                        {/* Name & ID */}
                        <div className="text-center mb-6">
                            <h3 className="text-xl font-black text-white uppercase">{athleteStats.name}</h3>
                            <p className="text-xs text-primary font-bold">{athleteStats.nickname}</p>
                            <p className="text-[10px] text-textMuted font-mono tracking-widest mt-1">{athleteStats.id}</p>
                        </div>

                        {/* Attributes with Progress Bars */}
                        <div className="space-y-3 mb-6">
                            {Object.entries(athleteStats.attributes).map(([key, val]) => (
                                <div key={key} className="flex items-center gap-3">
                                    <span className="text-[10px] font-bold text-textMuted uppercase w-20">{key}</span>
                                    <div className="flex-1 h-2 bg-surfaceHighlight rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-primary to-orange-500 rounded-full transition-all duration-500"
                                            style={{ width: `${val}%` }}
                                        />
                                    </div>
                                    <span className="text-xs font-black text-primary w-8 text-right">{val}</span>
                                </div>
                            ))}
                        </div>

                        {/* Overall Rating */}
                        <div className="bg-gradient-to-r from-primary via-yellow-400 to-orange-500 rounded-xl p-4 flex justify-between items-center">
                            <div>
                                <span className="text-[10px] font-bold text-black/60 uppercase block">Overall Rating</span>
                                <span className="text-sm font-black text-black uppercase">{athleteStats.sport}</span>
                            </div>
                            <div className="text-4xl font-black text-black">{athleteStats.overallRating}</div>
                        </div>
                    </div>
                </div>

                {/* Analytics & Leaderboard */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="premium-card p-4 text-center">
                            <Trophy className="w-6 h-6 text-primary mx-auto mb-2" />
                            <span className="block text-2xl font-black text-white">94</span>
                            <span className="text-[10px] text-textMuted uppercase font-bold">Overall</span>
                        </div>
                        <div className="premium-card p-4 text-center">
                            <Target className="w-6 h-6 text-green-500 mx-auto mb-2" />
                            <span className="block text-2xl font-black text-white">#1</span>
                            <span className="text-[10px] text-textMuted uppercase font-bold">India Rank</span>
                        </div>
                        <div className="premium-card p-4 text-center">
                            <Award className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                            <span className="block text-2xl font-black text-white">100+</span>
                            <span className="text-[10px] text-textMuted uppercase font-bold">Centuries</span>
                        </div>
                    </div>

                    {/* Global Leaderboard */}
                    <div className="premium-card p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                                <Zap className="w-4 h-4 text-primary" /> Talent Leaderboard
                            </h3>
                            <button className="text-xs text-primary font-bold hover:underline">View All</button>
                        </div>

                        <div className="space-y-3">
                            {/* Table Header */}
                            <div className="grid grid-cols-12 text-[10px] text-textMuted font-bold uppercase pb-2 border-b border-surfaceHighlight">
                                <span className="col-span-1">Rank</span>
                                <span className="col-span-7">Player</span>
                                <span className="col-span-2 text-right">Points</span>
                                <span className="col-span-2 text-right">Trend</span>
                            </div>

                            {/* Leaderboard Rows */}
                            {leaderboard.map((item) => (
                                <div key={item.rank} className={`grid grid-cols-12 items-center py-3 rounded-lg transition-colors ${item.rank === 1 ? 'bg-primary/10' : 'hover:bg-surfaceHighlight/30'}`}>
                                    <div className="col-span-1">
                                        <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${item.rank === 1 ? 'bg-primary text-black' :
                                            item.rank === 2 ? 'bg-gray-300 text-black' :
                                                item.rank === 3 ? 'bg-amber-600 text-black' :
                                                    'bg-surfaceHighlight text-white'
                                            }`}>
                                            {item.rank}
                                        </span>
                                    </div>
                                    <div className="col-span-7 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-surfaceHighlight flex items-center justify-center text-xs font-bold text-white">
                                            {item.avatar}
                                        </div>
                                        <span className="font-bold text-white text-sm">{item.name}</span>
                                    </div>
                                    <div className="col-span-2 text-right">
                                        <span className="font-black text-primary">{item.points.toLocaleString()}</span>
                                    </div>
                                    <div className="col-span-2 flex justify-end">
                                        {item.trend === 'up' ? (
                                            <TrendingUp className="w-4 h-4 text-green-500" />
                                        ) : item.trend === 'down' ? (
                                            <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />
                                        ) : (
                                            <Activity className="w-4 h-4 text-gray-500" />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Achievements */}
                    <div className="premium-card p-6">
                        <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Star className="w-4 h-4 text-primary fill-primary" /> Key Achievements
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {athleteStats.achievements.map((ach, i) => (
                                <span key={i} className="px-3 py-1.5 bg-surfaceHighlight/50 border border-primary/20 rounded-full text-xs font-bold text-white">
                                    {ach}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KID;
