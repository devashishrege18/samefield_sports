import React, { useState, useEffect } from 'react';
import {
    User, Star, Trophy, ShoppingBag, MessageSquare, History,
    Settings, CheckCircle, BarChart2, DollarSign, Image as ImageIcon,
    MapPin, Calendar, CreditCard, ChevronRight, Edit2, Shield, Plus, Gift, Zap, Activity, Share2, Award
} from 'lucide-react';
import KID from '../components/KID';
import { usePoints } from '../context/PointsContext';
import { fandomService } from '../services/FandomService';

const Profile = () => {
    const { userId, points: contextPoints } = usePoints();
    const [accountType, setAccountType] = useState('fan');
    const [activeTab, setActiveTab] = useState('overview');
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProfile = async () => {
            if (userId) {
                const data = await fandomService.getUserStats(userId);
                if (data) {
                    setUserData(data);
                }
            }
            setLoading(false);
        };
        loadProfile();
    }, [userId, contextPoints]);

    const fanData = {
        name: userData?.name || 'Guest Fan',
        username: '@' + (userData?.name?.replace(/\s+/g, '') || 'Guest'),
        level: 'Super Fan',
        points: contextPoints || 0,
        joined: 'Aug 2024',
        predictions: userData?.predictions || { total: 0, accuracy: '0%' },
        rewards: ['Meet & Greet Tkt', '10% Store Discount']
    };

    const athleteData = {
        name: 'Virat Kohli',
        username: '@imVkohli',
        verified: true,
        kheloId: 'KID-IND-018',
        role: 'Professional Cricketer',
        team: 'Team India',
        stats: { matches: 254, runs: 12400, strikeRate: 138.5 },
        earnings: '$1.2M (Season)'
    };

    const data = accountType === 'fan' ? fanData : athleteData;

    if (loading) return <div className="h-screen flex items-center justify-center text-primary animate-pulse">Loading Profile...</div>;

    return (
        <div className="page-container animate-fade-in space-y-12 pb-20">

            {/* PROFILE HEADER */}
            <div className="relative mb-32">
                <div className="h-80 rounded-[40px] bg-black overflow-hidden relative shadow-2xl group border border-white/5">
                    <img
                        src={accountType === 'fan' ? "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=1600" : "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=1600"}
                        alt="Cover"
                        className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-[3000ms]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                    <div className="absolute top-8 right-8 flex gap-4">
                        <button
                            onClick={() => setAccountType(prev => prev === 'fan' ? 'athlete' : 'fan')}
                            className="bg-black/60 backdrop-blur-xl text-white text-[10px] font-bold uppercase tracking-widest px-6 py-3 rounded-full border border-white/10 hover:bg-white hover:text-black transition-all"
                        >
                            Switch View
                        </button>
                        <button className="bg-black/60 backdrop-blur-xl p-3 rounded-full text-white hover:text-primary transition-all border border-white/10">
                            <Settings className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="absolute -bottom-24 left-12 flex items-end gap-8">
                    <div className="w-48 h-48 rounded-[40px] border-[6px] border-black bg-black relative shadow-2xl overflow-hidden group/avatar">
                        <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${data.username}`}
                            alt="Profile"
                            className="w-full h-full object-cover group-hover/avatar:scale-110 transition-transform duration-500"
                        />
                        {accountType === 'athlete' && (
                            <div className="absolute bottom-4 right-4 bg-primary text-black p-1.5 rounded-full border-2 border-black shadow-lg" title="Verified Athlete">
                                <CheckCircle className="w-5 h-5 fill-current" />
                            </div>
                        )}
                    </div>
                    <div className="pb-8">
                        <div className="flex items-center gap-4 mb-2">
                            <h1 className="text-5xl font-bold text-white tracking-tight leading-none flex items-center gap-4">
                                {data.name}
                            </h1>
                            {accountType === 'fan' && (
                                <span className="bg-white/10 text-white px-3 py-1 rounded-lg border border-white/10 text-[10px] font-bold uppercase tracking-widest">
                                    Level 4
                                </span>
                            )}
                        </div>
                        <p className="text-white/60 font-bold text-[11px] uppercase tracking-widest flex items-center gap-4">
                            {data.username}
                            <span className="w-1 h-1 bg-white/20 rounded-full" />
                            {accountType === 'athlete' ? (
                                <span className="flex items-center gap-2 text-primary bg-primary/10 px-2 py-0.5 rounded-full"><Shield className="w-3 h-3" /> {data.kheloId}</span>
                            ) : (
                                <span className="text-white">{data.level}</span>
                            )}
                            <span className="w-1 h-1 bg-white/20 rounded-full" />
                            <span>Joined {accountType === 'fan' ? data.joined : '2008'}</span>
                        </p>
                    </div>
                </div>

                <div className="absolute -bottom-16 right-12 hidden md:flex gap-12">
                    {accountType === 'fan' ? (
                        <>
                            <div className="text-right">
                                <span className="block text-[10px] text-white/40 uppercase font-bold tracking-widest mb-1">XP Balance</span>
                                <span className="block text-4xl font-bold text-primary tabular-nums tracking-tight">{data.points.toLocaleString()}</span>
                            </div>
                            <div className="w-[1px] h-12 bg-white/10" />
                            <div className="text-right">
                                <span className="block text-[10px] text-white/40 uppercase font-bold tracking-widest mb-1">Circles</span>
                                <span className="block text-4xl font-bold text-white tabular-nums tracking-tight">{userData?.joinedCircles?.length || 0}</span>
                            </div>
                        </>
                    ) : (
                        <div className="flex gap-4">
                            <button className="bg-primary text-black hover:bg-white transition-colors text-xs font-bold uppercase px-8 py-4 rounded-xl shadow-xl">Follow Athlete</button>
                            <button className="bg-white/5 border border-white/10 text-white hover:bg-white hover:text-black transition-all p-4 rounded-xl shadow-xl"><Share2 className="w-5 h-5" /></button>
                        </div>
                    )}
                </div>
            </div>

            {/* NAV TABS SYSTEM */}
            <div className="flex gap-8 overflow-x-auto scrollbar-hide border-b border-white/5 pb-1">
                {(accountType === 'fan'
                    ? ['overview', 'predictions', 'orders', 'rewards']
                    : ['profile', 'khelo card', 'matches', 'posts', 'merch', 'earnings']
                ).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-4 text-[11px] font-bold uppercase tracking-widest transition-all relative whitespace-nowrap ${activeTab === tab ? 'text-white' : 'text-white/40 hover:text-white'}`}
                    >
                        {tab}
                        {activeTab === tab && (
                            <div className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-primary" />
                        )}
                    </button>
                ))}
            </div>

            {/* SYSTEM MODULES AREA */}
            <div className="min-h-[500px]">

                {/* ---------------- FAN MODULES ---------------- */}
                {accountType === 'fan' && (
                    <>
                        {activeTab === 'overview' && (
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                                <div className="lg:col-span-8 flex flex-col gap-8">
                                    <div className="premium-card p-10">
                                        <h3 className="text-[10px] font-bold text-white uppercase tracking-widest mb-8 flex items-center gap-3">
                                            <Award className="w-4 h-4 text-primary" /> Achievements
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {[
                                                { name: 'Top Predictor', date: '2d ago', desc: '87% Accuracy Streak', icon: Zap },
                                                { name: 'Top Commenter', date: '4d ago', desc: 'Comment of the Week', icon: MessageSquare },
                                                { name: 'Founding Member', date: '1w ago', desc: 'Member since Pre-Launch', icon: Shield },
                                                { name: 'Supporter', date: '2w ago', desc: 'Supported Artisan Gear', icon: ShoppingBag }
                                            ].map((ach, i) => (
                                                <div key={i} className="flex items-center gap-6 p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all group/ach">
                                                    <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center text-white/80 border border-white/5 group-hover/ach:text-primary transition-colors">
                                                        <ach.icon className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-white text-base mb-1">{ach.name}</h4>
                                                        <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{ach.desc}</p>
                                                        <p className="text-[9px] text-primary font-bold uppercase tracking-widest mt-2">{ach.date}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="premium-card p-10">
                                        <h3 className="text-[10px] font-bold text-white uppercase tracking-widest mb-8 flex items-center gap-3">
                                            <Activity className="w-4 h-4 text-primary" /> Recent Activity
                                        </h3>
                                        <div className="space-y-6">
                                            <div className="p-8 rounded-2xl bg-white/[0.02] border-l-2 border-primary">
                                                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-3">Comment on Match Center</p>
                                                <p className="text-lg text-white font-medium leading-relaxed">"The tactical shift in the 3rd quarter was the absolute catalyst for that comeback. Pure brilliance."</p>
                                                <div className="flex items-center gap-6 mt-6">
                                                    <div className="flex items-center gap-2 text-[9px] font-bold text-primary uppercase tracking-widest"><Star className="w-3 h-3 fill-primary" /> 142 Likes</div>
                                                    <div className="flex items-center gap-2 text-[9px] font-bold text-white/40 uppercase tracking-widest">24 Replies</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Active Circle Radar */}
                                <div className="lg:col-span-4">
                                    <div className="premium-card p-8 h-full bg-black">
                                        <h3 className="text-[10px] font-bold text-white uppercase tracking-widest mb-8">My Circles</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            {(userData?.joinedCircles && userData.joinedCircles.length > 0 ? userData.joinedCircles : ['Team India', 'RCB', 'Formula 1', 'Street Elite']).map((team, i) => (
                                                <div key={i} className="aspect-square rounded-2xl bg-white/5 relative group/team cursor-pointer overflow-hidden border border-white/5 hover:border-white/10 transition-all">
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                                                        <span className="text-3xl font-black text-white/20 mb-2 tracking-tighter group-hover/team:text-primary transition-colors">{typeof team === 'string' ? team[0] : 'C'}</span>
                                                        <span className="text-xs font-bold text-white uppercase tracking-wider">{typeof team === 'string' ? team : `Circle ${team}`}</span>
                                                        <span className="text-[8px] text-primary mt-3 opacity-0 group-hover/team:opacity-100 transition-all uppercase font-bold tracking-widest">View</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <button className="w-full mt-8 py-4 rounded-xl border border-white/10 text-white/60 text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 hover:text-white transition-all">Find New Circle</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'predictions' && (
                            <div className="premium-card p-16 text-center bg-gradient-to-br from-white/5 to-black relative overflow-hidden">
                                <div className="inline-block p-8 rounded-full bg-white/5 border border-white/5 mb-8">
                                    <TrendingUp className="w-12 h-12 text-primary" />
                                </div>
                                <h3 className="text-4xl font-bold text-white tracking-tight mb-4">Prediction Stats</h3>
                                <p className="text-white/60 text-lg max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
                                    "Your predictive modeling is currently outperforming 92% of the fan base. Maintain this accuracy to unlock Elite Broadcast permissions."
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto relative z-10">
                                    <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5">
                                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Total</p>
                                        <span className="block text-5xl font-bold text-white tabular-nums tracking-tight">{fanData.predictions.total || 0}</span>
                                    </div>
                                    <div className="p-8 rounded-3xl bg-primary/5 border border-primary/20">
                                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2">Correct</p>
                                        <span className="block text-5xl font-bold text-primary tabular-nums tracking-tight">{fanData.predictions.correct || 0}</span>
                                    </div>
                                    <div className="p-8 rounded-3xl bg-red-500/5 border border-red-500/20">
                                        <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest mb-2">Incorrect</p>
                                        <span className="block text-5xl font-bold text-white/40 tabular-nums tracking-tight">{(fanData.predictions.total - (fanData.predictions.correct || 0)) || 0}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'rewards' && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {data.rewards.map((rew, i) => (
                                    <div key={i} className="premium-card p-10 bg-white/[0.02] relative group hover:border-primary/30 transition-all">
                                        <Zap className="w-10 h-10 text-primary mb-8" />
                                        <h4 className="font-bold text-white text-2xl tracking-tight mb-2">{rew}</h4>
                                        <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-8">Expires: Dec 31, 2025</p>
                                        <button className="bg-white text-black hover:bg-primary transition-colors w-full py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest">Claim</button>
                                    </div>
                                ))}
                                <div className="premium-card p-10 border-dashed border-white/10 bg-transparent flex flex-col items-center justify-center text-center group cursor-pointer hover:border-primary/50 transition-all h-full min-h-[300px]">
                                    <div className="w-14 h-14 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center text-white/20 group-hover:text-primary group-hover:border-primary/50 transition-all mb-4">
                                        <Plus className="w-6 h-6" />
                                    </div>
                                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest group-hover:text-white transition-all">More Rewards</p>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* ---------------- ATHLETE MODULES ---------------- */}
                {accountType === 'athlete' && (
                    <>
                        {activeTab === 'khelo card' && (
                            <div className="max-w-4xl mx-auto rounded-[40px] overflow-hidden border border-white/5 scale-[0.95] shadow-2xl">
                                <KID />
                            </div>
                        )}

                        {activeTab === 'profile' && (
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                {/* Stats Module */}
                                <div className="lg:col-span-4 flex flex-col gap-8">
                                    <div className="premium-card p-8 space-y-8 bg-black border-white/10">
                                        <h3 className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-3">
                                            <BarChart2 className="w-4 h-4 text-primary" /> Career Stats
                                        </h3>
                                        <div className="space-y-6">
                                            {[
                                                { label: 'Active Matches', val: data.stats.matches },
                                                { label: 'Runs Scored', val: data.stats.runs.toLocaleString() },
                                                { label: 'Strike Rate', val: data.stats.strikeRate }
                                            ].map((stat, i) => (
                                                <div key={i} className="flex justify-between items-end pb-4 border-b border-white/5">
                                                    <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">{stat.label}</span>
                                                    <span className="text-3xl font-bold text-white tabular-nums leading-none tracking-tight">{stat.val}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <button className="w-full py-4 text-[10px] font-bold text-white/60 border border-white/10 rounded-xl hover:bg-white/5 hover:text-white transition-all uppercase tracking-widest">View Historical Logs</button>
                                    </div>

                                    <div className="premium-card p-8 bg-primary/[0.05] border-primary/20">
                                        <Activity className="w-8 h-8 text-primary mb-4" />
                                        <h3 className="text-xl font-bold text-white uppercase tracking-tight mb-2">Scout Interest</h3>
                                        <p className="text-xs text-white/60 font-medium leading-relaxed">"14 International scouts currently observing your progress logs."</p>
                                        <div className="mt-6 flex items-center gap-3">
                                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                            <span className="text-[9px] font-bold text-white uppercase tracking-widest">Live Tracking</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Multimedia Feed */}
                                <div className="lg:col-span-8 space-y-8">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-[10px] font-bold text-white uppercase tracking-widest">Highlights</h3>
                                        <button className="text-[9px] font-bold text-primary uppercase tracking-widest hover:text-white transition-colors">Expand Feed</button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {[
                                            { t: 'Century', img: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=800', tag: 'Elite Cycle' },
                                            { t: 'Winning Moment', img: 'https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?auto=format&fit=crop&q=80&w=800', tag: 'Legacy Match' },
                                            { t: 'Training', img: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=800', tag: 'Underground' },
                                            { t: 'Interview', img: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&q=80&w=800', tag: 'Fan Core' }
                                        ].map((item, i) => (
                                            <div key={i} className="aspect-video rounded-2xl overflow-hidden relative group cursor-pointer border border-white/5">
                                                <img src={item.img} alt="Highlight" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                                                        <Activity className="w-5 h-5 fill-current" />
                                                    </div>
                                                </div>
                                                <div className="absolute bottom-4 left-6 right-6">
                                                    <span className="text-[9px] font-bold text-primary uppercase tracking-widest mb-1 block">{item.tag}</span>
                                                    <p className="text-xl text-white font-bold uppercase tracking-tight leading-none">{item.t}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <button className="w-full py-5 rounded-xl border border-white/10 text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all text-white">Upload Highlight</button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'earnings' && (
                            <div className="premium-card p-12 bg-white/[0.02] border-white/5 overflow-hidden relative">
                                <div className="flex justify-between items-start mb-12 relative z-10">
                                    <div>
                                        <h3 className="text-[10px] font-bold text-white uppercase tracking-widest mb-2">Earnings</h3>
                                        <p className="text-white/60 text-lg font-medium">Season Earnings 2024-2025</p>
                                    </div>
                                    <div className="p-4 bg-green-500/10 rounded-full text-green-500">
                                        <DollarSign className="w-6 h-6" />
                                    </div>
                                </div>
                                <div className="text-7xl font-bold text-white mb-12 tracking-tighter tabular-nums relative z-10">{data.earnings}</div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                                    <div className="p-8 bg-black/40 rounded-3xl border border-white/5">
                                        <span className="block text-[10px] text-white/40 uppercase font-bold tracking-widest mb-2">Match Fees</span>
                                        <span className="block text-3xl font-bold text-white tracking-tight">$850K</span>
                                        <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div className="w-[70%] h-full bg-green-500" />
                                        </div>
                                    </div>
                                    <div className="p-8 bg-black/40 rounded-3xl border border-white/5">
                                        <span className="block text-[10px] text-white/40 uppercase font-bold tracking-widest mb-2">Merchandise</span>
                                        <span className="block text-3xl font-bold text-white tracking-tight">$210K</span>
                                        <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div className="w-[45%] h-full bg-green-500" />
                                        </div>
                                    </div>
                                    <div className="p-8 bg-black/40 rounded-3xl border border-white/5">
                                        <span className="block text-[10px] text-white/40 uppercase font-bold tracking-widest mb-2">Sponsorships</span>
                                        <span className="block text-3xl font-bold text-white tracking-tight">$140K</span>
                                        <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div className="w-[30%] h-full bg-green-500" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}

            </div>
        </div>
    );
};

export default Profile;
