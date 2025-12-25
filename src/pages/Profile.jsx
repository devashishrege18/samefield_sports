import React, { useState, useEffect } from 'react';
import {
    User, Star, Trophy, ShoppingBag, MessageSquare, History,
    Settings, CheckCircle, BarChart2, DollarSign, Image as ImageIcon,
    MapPin, Calendar, CreditCard, ChevronRight, Edit2, Shield,
    Plus, Gift
} from 'lucide-react';
import KID from '../components/KID';
import { usePoints } from '../context/PointsContext';
import { db } from '../firebase/config';
import { doc, onSnapshot } from 'firebase/firestore';

const Profile = () => {
    const { points, userId } = usePoints();
    const [accountType, setAccountType] = useState('fan'); // 'fan' or 'athlete'
    const [activeTab, setActiveTab] = useState('overview');
    const [userData, setUserData] = useState(null);

    // Get real user data from localStorage/Firebase
    const userName = localStorage.getItem('samefield_username') || 'Guest Fan';
    const joinDate = localStorage.getItem('samefield_join_date') || 'Dec 2024';

    // Listen to real-time user data from Firebase
    useEffect(() => {
        if (!userId) return;

        const userRef = doc(db, 'users', userId);
        const unsubscribe = onSnapshot(userRef, (doc) => {
            if (doc.exists()) {
                setUserData(doc.data());
            }
        });

        // Set join date if not set
        if (!localStorage.getItem('samefield_join_date')) {
            const now = new Date();
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            localStorage.setItem('samefield_join_date', `${monthNames[now.getMonth()]} ${now.getFullYear()}`);
        }

        return () => unsubscribe();
    }, [userId]);

    // Dynamic level calculation
    const getLevel = (pts) => {
        if (pts >= 20000) return { name: 'Legend', num: 10 };
        if (pts >= 15000) return { name: 'Captain', num: 8 };
        if (pts >= 10000) return { name: 'Super Fan', num: 6 };
        if (pts >= 5000) return { name: 'Rising Star', num: 4 };
        if (pts >= 1000) return { name: 'Fan', num: 2 };
        return { name: 'Rookie', num: 1 };
    };
    const userLevel = getLevel(points);

    // Dynamic achievements based on XP
    const getAchievements = (pts) => {
        const a = [];
        if (pts >= 100) a.push({ name: 'First Steps', desc: '100 XP' });
        if (pts >= 500) a.push({ name: 'Getting Started', desc: '500 XP' });
        if (pts >= 1000) a.push({ name: 'Active Fan', desc: '1,000 XP' });
        if (pts >= 2500) a.push({ name: 'Dedicated', desc: '2,500 XP' });
        if (pts >= 5000) a.push({ name: 'Rising Star', desc: '5,000 XP' });
        return a.slice(-3).reverse();
    };
    const userAchievements = getAchievements(points);

    // REAL DATA for fan profile
    const fanData = {
        name: userName,
        username: `@${userName.replace(/\s+/g, '').toLowerCase()}`,
        level: userLevel,
        points: points || userData?.xp || 0,
        joined: joinDate,
        fandomCount: Math.max(1, Math.floor(points / 100)),
        predictions: userData?.predictions || { total: 0, accuracy: '0%' },
        rewards: points >= 5000 ? ['Meet & Greet Tkt', '10% Store Discount'] : points >= 1000 ? ['10% Store Discount'] : []
    };

    const athleteData = {
        name: 'Harmanpreet Kaur',
        username: '@ImHarmanpreet',
        verified: true,
        kheloId: 'KID-IND-W01',
        role: 'Professional Cricketer',
        team: 'Team India Women',
        stats: { matches: 185, runs: 5200, strikeRate: 126.8 },
        earnings: '$450K (Season)'
    };

    const data = accountType === 'fan' ? fanData : athleteData;

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20">

            {/* Header / Cover */}
            <div className="relative mb-20">
                <div className="h-64 rounded-2xl bg-gradient-to-r from-surfaceHighlight to-black overflow-hidden relative">
                    <img
                        src={accountType === 'fan' ? "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=2669&auto=format&fit=crop" : "https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?q=80&w=2670&auto=format&fit=crop"}
                        alt="Cover"
                        className="w-full h-full object-cover opacity-50"
                    />
                    <div className="absolute top-4 right-4 flex gap-2">
                        {/* Toggle for Demo */}
                        <button
                            onClick={() => setAccountType(prev => prev === 'fan' ? 'athlete' : 'fan')}
                            className="bg-black/50 backdrop-blur-md text-white text-[10px] font-bold uppercase px-3 py-1.5 rounded-full border border-white/10 hover:bg-primary hover:text-black transition-colors"
                        >
                            Switch to {accountType === 'fan' ? 'Athlete' : 'Fan'} View
                        </button>
                        <button className="bg-black/50 backdrop-blur-md p-2 rounded-full text-white hover:text-primary transition-colors">
                            <Settings className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="absolute -bottom-16 left-8 flex items-end gap-6">
                    <div className="w-32 h-32 rounded-full border-4 border-black bg-surface relative">
                        <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${data.username}`}
                            alt="Profile"
                            className="w-full h-full rounded-full"
                        />
                        {accountType === 'athlete' && (
                            <div className="absolute bottom-1 right-1 bg-primary text-black p-1.5 rounded-full border-2 border-black" title="Verified Athlete">
                                <CheckCircle className="w-4 h-4 fill-current" />
                            </div>
                        )}
                    </div>
                    <div className="pb-2">
                        <h1 className="text-3xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                            {data.name}
                            {accountType === 'fan' && <span className="text-sm bg-surfaceHighlight text-primary px-2 py-0.5 rounded border border-primary/20 align-middle">Lvl {data.level.num}</span>}
                        </h1>
                        <p className="text-textMuted font-bold text-sm flex items-center gap-2">
                            {data.username}
                            {accountType === 'athlete' && <span className="flex items-center gap-1 text-primary"><Shield className="w-3 h-3" /> {data.kheloId}</span>}
                            <span className="text-surfaceHighlight">•</span>
                            <span>Joined {accountType === 'fan' ? data.joined : '2008'}</span>
                        </p>
                    </div>
                </div>

                <div className="absolute -bottom-12 right-8 hidden md:block">
                    {accountType === 'fan' ? (
                        <div className="flex gap-4">
                            <div className="text-center">
                                <span className="block text-xl font-black text-primary">{data.points}</span>
                                <span className="text-[10px] text-textMuted uppercase font-bold">Points</span>
                            </div>
                            <div className="w-[1px] h-8 bg-surfaceHighlight" />
                            <div className="text-center">
                                <span className="block text-xl font-black text-white">{data.fandomCount}</span>
                                <span className="text-[10px] text-textMuted uppercase font-bold">Fandoms</span>
                            </div>
                        </div>
                    ) : (
                        <button className="btn-primary text-sm uppercase px-8">Follow</button>
                    )}
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-surfaceHighlight flex gap-8">
                {(accountType === 'fan'
                    ? ['overview', 'predictions', 'orders', 'rewards']
                    : ['profile', 'khelo card', 'matches', 'posts', 'merch', 'earnings']
                ).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-4 text-sm font-bold uppercase tracking-wider transition-colors relative ${activeTab === tab ? 'text-primary' : 'text-textMuted hover:text-white'}`}
                    >
                        {tab}
                        {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-t-full" />}
                    </button>
                ))}
            </div>

            {/* CONTENT AREA */}
            <div className="min-h-[400px]">

                {/* ---------------- FAN VIEWS ---------------- */}
                {accountType === 'fan' && (
                    <>
                        {activeTab === 'overview' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Activity & Stats */}
                                <div className="space-y-6">
                                    <div className="premium-card p-6">
                                        <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                                            <Trophy className="w-4 h-4 text-primary" /> Recent Achievements
                                        </h3>
                                        <div className="space-y-4">
                                            {userAchievements.length > 0 ? userAchievements.map((ach, i) => (
                                                <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-surfaceHighlight/30 hover:bg-surfaceHighlight/50 transition-colors">
                                                    <div className="w-10 h-10 rounded-full bg-surfaceHighlight flex items-center justify-center text-yellow-500">
                                                        <Star className={`w-5 h-5 ${i === 0 ? 'fill-current' : ''}`} />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-white text-sm">{ach.name}</h4>
                                                        <p className="text-[10px] text-textMuted uppercase">{ach.desc}</p>
                                                    </div>
                                                </div>
                                            )) : (
                                                <div className="text-center py-6 text-textMuted">
                                                    <Star className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                                    <p className="text-sm">Earn XP to unlock achievements!</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="premium-card p-6">
                                        <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                                            <MessageSquare className="w-4 h-4 text-primary" /> Recent Forum Activity
                                        </h3>
                                        <div className="space-y-3">
                                            <div className="p-3 border-l-2 border-primary bg-surfaceHighlight/20">
                                                <p className="text-xs text-textMuted mb-1">Replied to "Best T20 Captain?"</p>
                                                <p className="text-sm text-white italic">"Honestly, it has to be Dhoni for his tactical genius under pressure."</p>
                                            </div>
                                            <div className="p-3 border-l-2 border-surfaceHighlight bg-surfaceHighlight/10">
                                                <p className="text-xs text-textMuted mb-1">Posted in "Match Thread"</p>
                                                <p className="text-sm text-white italic">"What a catch! That's the turning point."</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Active Fandoms */}
                                <div>
                                    <div className="premium-card p-6 h-full">
                                        <h3 className="text-sm font-black text-white uppercase tracking-wider mb-6">My Fandoms</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            {['Team India', 'RCB', 'Lakers', 'Ferrari'].map((team, i) => (
                                                <div key={i} className="aspect-square rounded-2xl bg-surfaceHighlight relative group cursor-pointer overflow-hidden border border-white/5 hover:border-primary transition-colors">
                                                    <div className={`absolute inset-0 bg-gradient-to-br ${i % 2 === 0 ? 'from-blue-900' : 'from-red-900'} to-black opacity-60`} />
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                                                        <span className="text-2xl font-black text-white mb-1">{team[0]}</span>
                                                        <span className="text-sm font-bold text-white">{team}</span>
                                                        <span className="text-[10px] text-primary mt-2 opacity-0 group-hover:opacity-100 transition-opacity uppercase font-black">View Hub</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'predictions' && (
                            <div className="premium-card p-8 text-center">
                                <div className="inline-block p-4 rounded-full bg-surfaceHighlight mb-4">
                                    <BarChart2 className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="text-2xl font-black text-white uppercase mb-2">Prediction Stats</h3>
                                <p className="text-textMuted max-w-md mx-auto mb-8">You have an 87% accuracy rate this month. Keep it up to reach Captain tier!</p>
                                <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
                                    <div className="p-4 rounded-xl bg-surfaceHighlight/30 border border-primary/20">
                                        <span className="block text-3xl font-black text-white">42</span>
                                        <span className="text-xs font-bold text-primary uppercase">Total</span>
                                    </div>
                                    <div className="p-4 rounded-xl bg-surfaceHighlight/30 border border-green-500/20">
                                        <span className="block text-3xl font-black text-white">36</span>
                                        <span className="text-xs font-bold text-green-500 uppercase">Correct</span>
                                    </div>
                                    <div className="p-4 rounded-xl bg-surfaceHighlight/30 border border-red-500/20">
                                        <span className="block text-3xl font-black text-white">6</span>
                                        <span className="text-xs font-bold text-red-500 uppercase">Missed</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'orders' && (
                            <div className="space-y-4">
                                <div className="premium-card p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
                                            <ShoppingBag className="text-black" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white">Official Team India Jersey 2024</h4>
                                            <p className="text-xs text-textMuted">Order #8821 • Delivered</p>
                                        </div>
                                    </div>
                                    <span className="text-primary font-bold">$89.99</span>
                                </div>
                            </div>
                        )}

                        {activeTab === 'rewards' && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {data.rewards.map((rew, i) => (
                                    <div key={i} className="premium-card p-6 border-dashed border-primary/30 bg-primary/5">
                                        <Gift className="w-8 h-8 text-primary mb-4" />
                                        <h4 className="font-bold text-white text-lg mb-1">{rew}</h4>
                                        <p className="text-xs text-textMuted mb-4">Valid until Dec 31, 2025</p>
                                        <button className="w-full py-2 bg-primary text-black text-xs font-black uppercase rounded">Redeem</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {/* ---------------- ATHLETE VIEWS ---------------- */}
                {accountType === 'athlete' && (
                    <>
                        {activeTab === 'khelo card' && (
                            <KID />
                        )}

                        {activeTab === 'profile' && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {/* Stats Card */}
                                <div className="premium-card p-6 space-y-6">
                                    <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                                        <BarChart2 className="w-4 h-4 text-primary" /> Career Stats
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-end pb-2 border-b border-surfaceHighlight">
                                            <span className="text-textMuted text-sm font-bold uppercase">Matches</span>
                                            <span className="text-2xl font-black text-white">{data.stats.matches}</span>
                                        </div>
                                        <div className="flex justify-between items-end pb-2 border-b border-surfaceHighlight">
                                            <span className="text-textMuted text-sm font-bold uppercase">Runs</span>
                                            <span className="text-2xl font-black text-white">{data.stats.runs}</span>
                                        </div>
                                        <div className="flex justify-between items-end pb-2 border-b border-surfaceHighlight">
                                            <span className="text-textMuted text-sm font-bold uppercase">Strike Rate</span>
                                            <span className="text-2xl font-black text-white">{data.stats.strikeRate}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Latest Highlights */}
                                <div className="md:col-span-2 space-y-4">
                                    <h3 className="text-sm font-black text-white uppercase tracking-wider">Featured Highlights</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {[
                                            { t: 'WPL Final Heroics', img: '/assets/cricket_stadium_wpl.png' },
                                            { t: 'Match Winning Knock', img: '/assets/smriti_in_action.png' },
                                            { t: 'Training Session', img: '/assets/the_grind.png' },
                                            { t: 'Team Celebration', img: '/assets/wpl_abstract.png' }
                                        ].map((item, i) => (
                                            <div key={i} className="aspect-video bg-black rounded-xl relative overflow-hidden group cursor-pointer border border-white/5 hover:border-primary">
                                                <img src={item.img} alt="Highlight" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                                                        <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-white border-b-[8px] border-b-transparent ml-1" />
                                                    </div>
                                                </div>
                                                <div className="absolute bottom-3 left-3">
                                                    <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded font-bold uppercase">Must Watch</span>
                                                    <p className="text-xs text-white font-bold mt-1 text-shadow">{item.t}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'earnings' && (
                            <div className="premium-card p-8 border-l-4 border-l-green-500">
                                <div className="flex justify-between items-start mb-8">
                                    <div>
                                        <h3 className="text-lg font-black text-white uppercase mb-1">Total Earnings</h3>
                                        <p className="text-textMuted text-sm">Season 2024-2025</p>
                                    </div>
                                    <div className="p-3 bg-green-500/10 rounded-full text-green-500">
                                        <DollarSign className="w-6 h-6" />
                                    </div>
                                </div>
                                <div className="text-5xl font-black text-white mb-4">{data.earnings}</div>
                                <div className="grid grid-cols-3 gap-4 mt-8">
                                    <div className="p-4 bg-surfaceHighlight/30 rounded-lg">
                                        <span className="block text-sm text-textMuted uppercase font-bold mb-1">Match Fees</span>
                                        <span className="block text-xl font-bold text-white">$850k</span>
                                    </div>
                                    <div className="p-4 bg-surfaceHighlight/30 rounded-lg">
                                        <span className="block text-sm text-textMuted uppercase font-bold mb-1">Merch Sales</span>
                                        <span className="block text-xl font-bold text-white">$210k</span>
                                    </div>
                                    <div className="p-4 bg-surfaceHighlight/30 rounded-lg">
                                        <span className="block text-sm text-textMuted uppercase font-bold mb-1">Sponsorships</span>
                                        <span className="block text-xl font-bold text-white">$140k</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'merch' && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Add Product Card */}
                                <div className="border-2 border-dashed border-surfaceHighlight rounded-xl flex flex-col items-center justify-center p-8 text-textMuted hover:text-white hover:border-white transition-colors cursor-pointer min-h-[300px]">
                                    <Plus className="w-12 h-12 mb-4" />
                                    <span className="font-bold uppercase tracking-widest text-sm">Add New Product</span>
                                </div>
                                {/* Mock Products */}
                                {[
                                    { name: 'Team India Women Jersey', img: '/assets/product_batting_gloves.png' },
                                    { name: 'Harmanpreet Signed Bat', img: '/assets/product_goalkeeper_gloves.png' },
                                    { name: 'WPL Champion Kit', img: '/assets/product_leather_gloves_1765788007746.png' },
                                    { name: 'ODI WC 2025 Cap', img: '/assets/product_weightlifting_straps.png' }
                                ].map((prod, i) => (
                                    <div key={i} className="premium-card p-4 group">
                                        <div className="aspect-square bg-gray-900 rounded-lg mb-4 overflow-hidden relative">
                                            <img src={prod.img} alt="Product" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 grayscale group-hover:grayscale-0" />
                                            <div className="absolute top-2 right-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded">NEW</div>
                                        </div>
                                        <h4 className="font-bold text-white text-lg">{prod.name}</h4>
                                        <p className="text-sm text-primary font-bold mb-4">$350.00</p>
                                        <div className="flex gap-2">
                                            <button className="flex-1 py-2 border border-surfaceHighlight rounded hover:bg-white hover:text-black transition-colors font-bold text-xs uppercase flex items-center justify-center gap-2">
                                                <Edit2 className="w-3 h-3" /> Edit
                                            </button>
                                            <button className="flex-1 py-2 bg-surfaceHighlight text-white rounded font-bold text-xs uppercase">Stats</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}

            </div>
        </div>
    );
};

export default Profile;

